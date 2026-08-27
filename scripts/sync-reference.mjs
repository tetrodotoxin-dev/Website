import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = resolve(
  process.argv[2] ?? join(websiteRoot, '..', 'tetrodotoxin', '.bin', 'bin', 'packages', 'ttx'),
);
const outputPath = join(websiteRoot, 'src', 'data', 'generated', 'ttx-reference.json');

function requireObject(value, context) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${context} must be an object.`);
  }
}

function requireString(value, context) {
  if (typeof value !== 'string') {
    throw new Error(`${context} must be a string.`);
  }
}

function requireNumber(value, context) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${context} must be a nonnegative integer.`);
  }
}

function requireStringArray(value, context) {
  if (!Array.isArray(value)) {
    throw new Error(`${context} must be an array.`);
  }
  value.forEach((entry, index) => requireString(entry, `${context}[${index}]`));
}

function validateTarget(target, context) {
  requireObject(target, context);
  requireString(target.node, `${context}.node`);
  requireString(target.package, `${context}.package`);
  requireNumber(target.major, `${context}.major`);
  requireNumber(target.minor, `${context}.minor`);
  requireString(target.route, `${context}.route`);
  requireString(target.role, `${context}.role`);
  requireString(target.name, `${context}.name`);
  requireString(target.kind, `${context}.kind`);
}

function validatePackage(document, path) {
  requireObject(document, path);
  if (document.schema !== 'tetrodotoxin.documentation.graph.v1') {
    throw new Error(`${path} uses an unsupported documentation graph schema.`);
  }
  requireObject(document.package, `${path}.package`);
  requireString(document.package.name, `${path}.package.name`);
  requireNumber(document.package.major, `${path}.package.major`);
  requireNumber(document.package.minor, `${path}.package.minor`);
  requireString(document.package.root, `${path}.package.root`);
  for (const field of ['sources', 'nodes', 'edges', 'exports']) {
    if (!Array.isArray(document[field])) {
      throw new Error(`${path}.${field} must be an array.`);
    }
  }

  const sourceIds = new Set();
  document.sources.forEach((source, index) => {
    const context = `${path}.sources[${index}]`;
    requireObject(source, context);
    for (const field of ['id', 'name', 'path', 'dialect', 'root', 'semanticRoot']) {
      requireString(source[field], `${context}.${field}`);
    }
    requireStringArray(source.documentation, `${context}.documentation`);
    if (sourceIds.has(source.id)) {
      throw new Error(`${path} contains duplicate source id ${source.id}.`);
    }
    sourceIds.add(source.id);
  });
  if (!sourceIds.has(document.package.root)) {
    throw new Error(`${path}.package.root does not select a source.`);
  }

  const nodeIds = new Set();
  const aliasIds = new Set();
  document.nodes.forEach((node, index) => {
    const context = `${path}.nodes[${index}]`;
    requireObject(node, context);
    for (const field of ['id', 'source', 'name', 'kind', 'visibility', 'role', 'declaration']) {
      requireString(node[field], `${context}.${field}`);
    }
    requireStringArray(node.documentation, `${context}.documentation`);
    requireObject(node.location, `${context}.location`);
    if (typeof node.location.authored !== 'boolean') {
      throw new Error(`${context}.location.authored must be a boolean.`);
    }
    requireString(node.location.path, `${context}.location.path`);
    for (const field of ['line', 'column', 'endLine', 'endColumn', 'offset', 'length']) {
      requireNumber(node.location[field], `${context}.location.${field}`);
    }
    if (node.location.authored && (!node.location.path || !node.location.line || !node.location.column)) {
      throw new Error(`${context}.location does not identify its authored source position.`);
    }
    if (!sourceIds.has(node.source)) {
      throw new Error(`${context}.source does not select a source.`);
    }
    if (!['public', 'exposed'].includes(node.visibility)) {
      throw new Error(`${context} exposes nonpublic visibility ${node.visibility}.`);
    }
    if (nodeIds.has(node.id)) {
      throw new Error(`${path} contains duplicate node id ${node.id}.`);
    }
    nodeIds.add(node.id);
    if (node.kind === 'alias') {
      aliasIds.add(node.id);
    }
  });

  for (const source of document.sources) {
    if (!nodeIds.has(source.root) || !nodeIds.has(source.semanticRoot)) {
      throw new Error(`${path} source ${source.id} does not select its semantic roots.`);
    }
  }

  const linkedAliases = new Set();
  document.edges.forEach((edge, index) => {
    const context = `${path}.edges[${index}]`;
    requireObject(edge, context);
    requireString(edge.from, `${context}.from`);
    requireString(edge.kind, `${context}.kind`);
    requireString(edge.label, `${context}.label`);
    requireNumber(edge.index, `${context}.index`);
    validateTarget(edge.target, `${context}.target`);
    if (!nodeIds.has(edge.from)) {
      throw new Error(`${context}.from does not select a local graph node.`);
    }
    if (edge.target.node && !nodeIds.has(edge.target.node)) {
      throw new Error(`${context}.target.node does not select a local graph node.`);
    }
    if (edge.target.node && edge.target.package !== document.package.name) {
      throw new Error(`${context} gives a local node to another Package.`);
    }
    if (edge.kind === 'alias') {
      linkedAliases.add(edge.from);
      if (!edge.target.node && !edge.target.route) {
        throw new Error(`${context} does not give its Alias a navigable target.`);
      }
    }
  });
  for (const alias of aliasIds) {
    if (!linkedAliases.has(alias)) {
      throw new Error(`${path} Alias ${alias} has no resolved graph edge.`);
    }
  }

  const selectors = new Set();
  document.exports.forEach((entry, index) => {
    const context = `${path}.exports[${index}]`;
    requireObject(entry, context);
    requireString(entry.route, `${context}.route`);
    requireString(entry.role, `${context}.role`);
    requireString(entry.node, `${context}.node`);
    if (!entry.route || !entry.node || !nodeIds.has(entry.node)) {
      throw new Error(`${context} must select one local public graph node.`);
    }
    const selector = `${entry.route}::${entry.role}`;
    if (selectors.has(selector)) {
      throw new Error(`${path} contains duplicate public selector ${selector}.`);
    }
    selectors.add(selector);
  });
}

async function findProducts(directory) {
  const products = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      products.push(...await findProducts(path));
    } else if (entry.isFile() && entry.name === 'documentation.json') {
      products.push(path);
    }
  }
  return products.sort();
}

const productPaths = await findProducts(sourceRoot);
if (productPaths.length === 0) {
  throw new Error(`No documentation.json products were found beneath ${sourceRoot}.`);
}

const packages = [];
for (const path of productPaths) {
  const document = JSON.parse(await readFile(path, 'utf8'));
  validatePackage(document, path);
  packages.push(document);
}
packages.sort((left, right) => left.package.name.localeCompare(right.package.name));

const packageNames = new Set();
for (const document of packages) {
  if (packageNames.has(document.package.name)) {
    throw new Error(`Duplicate documentation graph for ${document.package.name}.`);
  }
  packageNames.add(document.package.name);
}

const collection = {
  schema: 'tetrodotoxin.documentation.graph.collection.v1',
  packages,
};
const generated = `${JSON.stringify(collection, null, 2)}\n`;
let current = '';
try {
  current = await readFile(outputPath, 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}
if (current !== generated) {
  await writeFile(outputPath, generated);
}

const totals = packages.reduce(
  (summary, document) => {
    summary.sources += document.sources.length;
    summary.nodes += document.nodes.length;
    summary.edges += document.edges.length;
    return summary;
  },
  { sources: 0, nodes: 0, edges: 0 },
);
console.log(
  `Synchronized ${packages.length} packages, ${totals.sources} sources, ${totals.nodes} identities, and ${totals.edges} edges.`,
);
