import referenceCollection from './generated/ttx-reference.json';

export interface ReferenceGraph {
  slug: string;
  source: string;
  displaySource: string;
  dialect: string;
  root: string;
}

export interface ReferenceConcept {
  name: string;
  displayName: string;
  target: string;
}

export interface ReferenceNode {
  key: string;
  graph: string;
  id: number;
  name: string;
  displayName: string;
  contracts: string[];
  documentation: string[];
  resolved: string;
  type: string;
  concepts: ReferenceConcept[];
  canonicalPath: string[] | null;
  route: string;
  slug: string;
}

export interface ReferenceLayoutEntry {
  index: number;
  name: string;
  displayName: string;
  target: string | null;
}

export interface ReferenceLayout {
  owner: string;
  role: 'type' | 'parameters' | 'results';
  entries: ReferenceLayoutEntry[];
}

export interface ReferenceRouteBranch {
  segment: string;
  route: string;
  node: ReferenceNode | null;
  showOverview: boolean;
  children: ReferenceRouteBranch[];
}

interface ReferenceCollection {
  schema: 'ttx.graph.collection.v1';
  graphs: ReferenceGraph[];
  nodes: ReferenceNode[];
  edges: Array<{ from: string; kind: 'resolve' | 'type' | 'concept'; name: string; to: string }>;
  layouts: ReferenceLayout[];
}

const collection = referenceCollection as ReferenceCollection;
export const referenceGraphs = collection.graphs;
export const referenceNodes = collection.nodes;
export const referenceEdges = collection.edges;
export const referenceLayouts = collection.layouts;

export function graphNodes(graph: ReferenceGraph): ReferenceNode[] {
  return referenceNodes.filter((node) => node.graph === graph.slug);
}

export function navigableNodes(graph: ReferenceGraph): ReferenceNode[] {
  return graphNodes(graph)
    .filter((node) => node.canonicalPath !== null)
    .sort((left, right) => {
      const leftPath = left.canonicalPath ?? [];
      const rightPath = right.canonicalPath ?? [];
      if (leftPath.length !== rightPath.length) return leftPath.length - rightPath.length;
      return leftPath.join('').localeCompare(rightPath.join(''));
    });
}

export function referenceRouteTree(graph: ReferenceGraph): ReferenceRouteBranch[] {
  interface MutableBranch {
    segment: string;
    route: string;
    node: ReferenceNode | null;
    children: Map<string, MutableBranch>;
  }

  const roots = new Map<string, MutableBranch>();

  for (const node of navigableNodes(graph)) {
    const segments = (node.canonicalPath ?? []).map(displayBytes);
    let siblings = roots;
    const route: string[] = [];

    segments.forEach((segment, index) => {
      route.push(segment);
      let branch = siblings.get(segment);
      if (!branch) {
        branch = {
          segment,
          route: route.join('::'),
          node: null,
          children: new Map(),
        };
        siblings.set(segment, branch);
      }

      if (index === segments.length - 1) branch.node = node;
      siblings = branch.children;
    });
  }

  function complete(branches: Map<string, MutableBranch>): ReferenceRouteBranch[] {
    return [...branches.values()]
      .sort((left, right) => left.segment.localeCompare(right.segment))
      .map((branch) => ({
        segment: branch.segment,
        route: branch.route,
        node: branch.node,
        showOverview: branch.node !== null && !isStructuralRouteNode(branch.node) && branch.node.displayName !== '<source>',
        children: complete(branch.children),
      }));
  }

  function present(branch: ReferenceRouteBranch): ReferenceRouteBranch | null {
    const children = branch.children
      .map(present)
      .filter((child): child is ReferenceRouteBranch => child !== null);

    if (branch.node && isStructuralRouteNode(branch.node) && children.length === 0) return null;

    const groupsTypes = branch.segment === 'static'
      && branch.node !== null
      && isStructuralRouteNode(branch.node)
      && children.some((child) => child.node !== null && representsType(child.node));

    return {
      ...branch,
      segment: groupsTypes ? 'Types' : branch.segment,
      children,
    };
  }

  return complete(roots)
    .flatMap((branch) => branch.node?.displayName === '<source>' ? branch.children : [branch])
    .map(present)
    .filter((branch): branch is ReferenceRouteBranch => branch !== null);
}

function isStructuralRouteNode(node: ReferenceNode): boolean {
  return node.contracts.length === 1
    && node.contracts[0] === 'abstract'
    && (node.displayName === 'static' || node.displayName === 'instance');
}

function representsType(node: ReferenceNode): boolean {
  if (node.contracts.includes('type')) return true;
  return referenceNodes.find((candidate) => candidate.key === node.resolved)?.contracts.includes('type') ?? false;
}

export function findNode(key: string): ReferenceNode {
  const node = referenceNodes.find((candidate) => candidate.key === key);
  if (!node) throw new Error(`Generated graph references missing node ${key}.`);
  return node;
}

export function graphHref(graph: ReferenceGraph): string {
  return `/docs/reference/${graph.slug}/`;
}

export function nodeHref(node: ReferenceNode): string {
  return `/docs/reference/${node.graph}/${node.slug}/`;
}

export function nodeLayouts(node: ReferenceNode): ReferenceLayout[] {
  return referenceLayouts.filter((layout) => layout.owner === node.key);
}

export function displayBytes(hex: string): string {
  if (hex.length === 0) return '';
  const bytes = Uint8Array.from(hex.match(/../g) ?? [], (byte) => Number.parseInt(byte, 16));
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  const roundTrip = Array.from(new TextEncoder().encode(text), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return roundTrip === hex && !/[\u0000-\u001f\u007f]/u.test(text)
    ? text
    : `$[${hex.match(/../g)?.join(' ') ?? ''}]`;
}

export function documentationParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const line of lines.map(displayBytes)) {
    if (line.trim() === '') {
      if (current.length > 0) paragraphs.push(current.join(' '));
      current = [];
    } else {
      current.push(line.trim());
    }
  }
  if (current.length > 0) paragraphs.push(current.join(' '));
  return paragraphs;
}
