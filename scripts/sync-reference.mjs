import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(websiteRoot, 'src/data/generated/ttx-reference.json');

function fail(message) {
  throw new Error(`Graph text: ${message}`);
}

function decodeHex(token, context) {
  if (!/^x(?:[0-9a-f]{2})*$/.test(token)) fail(`${context} is not lossless hexadecimal bytes.`);
  return token.slice(1);
}

function displayBytes(hex) {
  const bytes = Buffer.from(hex, 'hex');
  const text = bytes.toString('utf8');
  return Buffer.from(text, 'utf8').equals(bytes) && !/[\u0000-\u001f\u007f]/u.test(text)
    ? text
    : `$[${hex.match(/../g)?.join(' ') ?? ''}]`;
}

function parseCount(token, context) {
  const value = Number(token);
  if (!Number.isSafeInteger(value) || value < 0) fail(`${context} is not a nonnegative integer.`);
  return value;
}

function expect(parts, word, context) {
  if (parts.shift() !== word) fail(`${context} requires '${word}'.`);
}

function parseDump(text, input) {
  const lines = text.replace(/\r/g, '').split('\n');
  let cursor = 0;
  const next = () => lines[cursor++]?.trim().split(/\s+/) ?? [];

  let parts = next();
  if (parts.join(' ') !== 'ttx.graph 1') fail(`${input} uses an unsupported graph version.`);
  parts = next(); expect(parts, 'source', input);
  const source = decodeHex(parts.shift(), `${input} source`);
  parts = next(); expect(parts, 'dialect', input);
  const dialect = parseCount(parts.shift(), `${input} dialect`);
  parts = next(); expect(parts, 'root', input);
  const root = parseCount(parts.shift(), `${input} root`);
  parts = next(); expect(parts, 'nodes', input);
  const nodeCount = parseCount(parts.shift(), `${input} node count`);
  const nodes = [];

  for (let expected = 0; expected < nodeCount; expected += 1) {
    parts = next(); expect(parts, 'node', `${input} node ${expected}`);
    const id = parseCount(parts.shift(), `${input} node id`);
    if (id !== expected) fail(`${input} node IDs must be contiguous dump-local IDs.`);
    parts = next(); expect(parts, 'name', `${input} node ${id}`);
    const name = decodeHex(parts.shift(), `${input} node ${id} name`);
    parts = next(); expect(parts, 'contracts', `${input} node ${id}`);
    const contracts = parts;
    parts = next(); expect(parts, 'resolve', `${input} node ${id}`);
    const resolved = parseCount(parts.shift(), `${input} node ${id} resolve edge`);
    parts = next(); expect(parts, 'type', `${input} node ${id}`);
    const type = parseCount(parts.shift(), `${input} node ${id} Type edge`);
    parts = next(); expect(parts, 'documentation', `${input} node ${id}`);
    const documentationCount = parseCount(parts.shift(), `${input} documentation count`);
    const documentation = [];
    for (let line = 0; line < documentationCount; line += 1) {
      parts = next(); expect(parts, 'line', `${input} documentation line`);
      documentation.push(decodeHex(parts.shift(), `${input} documentation line`));
    }
    parts = next(); expect(parts, 'concepts', `${input} node ${id}`);
    const conceptCount = parseCount(parts.shift(), `${input} concept count`);
    const concepts = [];
    for (let conceptIndex = 0; conceptIndex < conceptCount; conceptIndex += 1) {
      parts = next(); expect(parts, 'concept', `${input} concept edge`);
      concepts.push({
        name: decodeHex(parts.shift(), `${input} concept name`),
        target: parseCount(parts.shift(), `${input} concept target`),
      });
    }
    const layouts = [];
    parts = next();
    while (parts[0] === 'layout') {
      parts.shift();
      const role = parts.shift();
      const entryCount = parseCount(parts.shift(), `${input} ${role} Layout count`);
      const entries = [];
      for (let index = 0; index < entryCount; index += 1) {
        parts = next(); expect(parts, 'entry', `${input} ${role} Layout entry`);
        const entryName = decodeHex(parts.shift(), `${input} Layout entry name`);
        const targetToken = parts.shift();
        entries.push({
          index,
          name: entryName,
          target: targetToken === 'none' ? null : parseCount(targetToken, `${input} Layout target`),
        });
      }
      layouts.push({ role, entries });
      parts = next();
    }
    if (parts.join(' ') !== 'end') fail(`${input} node ${id} is not terminated.`);
    nodes.push({ id, name, contracts, resolved, type, documentation, concepts, layouts });
  }

  for (const node of nodes) {
    const layoutTargets = node.layouts.flatMap((layout) =>
      layout.entries.map((entry) => entry.target).filter((value) => value !== null));
    for (const target of [node.resolved, node.type, ...node.concepts.map((edge) => edge.target), ...layoutTargets]) {
      if (!nodes[target]) fail(`${input} node ${node.id} references missing node ${target}.`);
    }
  }
  if (!nodes[dialect] || !nodes[root]) fail(`${input} header references a missing node.`);
  return { source, dialect, root, nodes };
}

function comparePaths(left, right) {
  if (left.length !== right.length) return left.length - right.length;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return 0;
}

function canonicalPaths(graph) {
  const paths = new Map([[graph.root, []]]);
  const pending = [graph.root];
  while (pending.length > 0) {
    const from = pending.shift();
    const prefix = paths.get(from);
    const resolved = graph.nodes[from].resolved;
    const resolvedPath = paths.get(resolved);
    if (!resolvedPath || comparePaths(prefix, resolvedPath) < 0) {
      paths.set(resolved, prefix);
      pending.push(resolved);
    }
    const concepts = [...graph.nodes[from].concepts].sort((left, right) =>
      left.name === right.name ? 0 : left.name < right.name ? -1 : 1);
    for (const edge of concepts) {
      const candidate = [...prefix, edge.name];
      const current = paths.get(edge.target);
      if (!current || comparePaths(candidate, current) < 0) {
        paths.set(edge.target, candidate);
        pending.push(edge.target);
      }
    }
  }
  return paths;
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'graph';
}

function project(graph, index) {
  const sourceName = displayBytes(graph.source);
  const graphSlug = `${slug(sourceName.split('/').at(-1)?.replace(/\.ttx$/u, '') ?? sourceName)}-${index + 1}`;
  const paths = canonicalPaths(graph);
  const nodes = graph.nodes.map((node) => {
    const path = paths.get(node.id) ?? null;
    const route = path?.map(displayBytes).join('::') ?? '';
    return {
      key: `${graphSlug}:${node.id}`,
      graph: graphSlug,
      id: node.id,
      name: node.name,
      displayName: displayBytes(node.name),
      contracts: node.contracts,
      documentation: node.documentation,
      resolved: `${graphSlug}:${node.resolved}`,
      type: `${graphSlug}:${node.type}`,
      concepts: node.concepts.map((edge) => ({
        name: edge.name,
        displayName: displayBytes(edge.name),
        target: `${graphSlug}:${edge.target}`,
      })),
      canonicalPath: path,
      route,
      slug: `${slug(route || displayBytes(node.name))}-${node.id}`,
    };
  });
  const layouts = graph.nodes.flatMap((node) => node.layouts.map((layout) => ({
    owner: `${graphSlug}:${node.id}`,
    role: layout.role,
    entries: layout.entries.map((entry) => ({
      index: entry.index,
      name: entry.name,
      displayName: displayBytes(entry.name),
      target: entry.target === null ? null : `${graphSlug}:${entry.target}`,
    })),
  })));
  const edges = graph.nodes.flatMap((node) => [
    { from: `${graphSlug}:${node.id}`, kind: 'resolve', name: '', to: `${graphSlug}:${node.resolved}` },
    { from: `${graphSlug}:${node.id}`, kind: 'type', name: '', to: `${graphSlug}:${node.type}` },
    ...node.concepts.map((edge) => ({
      from: `${graphSlug}:${node.id}`,
      kind: 'concept',
      name: edge.name,
      to: `${graphSlug}:${edge.target}`,
    })),
  ]);
  return {
    graph: {
      slug: graphSlug,
      source: graph.source,
      displaySource: sourceName,
      dialect: `${graphSlug}:${graph.dialect}`,
      root: `${graphSlug}:${graph.root}`,
    },
    nodes,
    edges,
    layouts,
  };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const inputs = process.argv.slice(2);
const texts = inputs.length > 0
  ? await Promise.all(inputs.map((path) => readFile(resolve(path), 'utf8')))
  : [await readStdin()];
if (texts.some((text) => text.trim() === '')) fail('no graph text was supplied.');

const projections = texts.map((text, index) => project(parseDump(text, inputs[index] ?? 'stdin'), index));
const collection = {
  schema: 'ttx.graph.collection.v1',
  graphs: projections.map((projection) => projection.graph),
  nodes: projections.flatMap((projection) => projection.nodes),
  edges: projections.flatMap((projection) => projection.edges),
  layouts: projections.flatMap((projection) => projection.layouts),
};
await writeFile(outputPath, `${JSON.stringify(collection, null, 2)}\n`);
console.log(`Synchronized ${collection.graphs.length} graph dumps and ${collection.nodes.length} Abstracts.`);
