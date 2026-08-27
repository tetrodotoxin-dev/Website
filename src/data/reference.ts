import referenceCollection from './generated/ttx-reference.json';

export interface ReferenceTarget {
  node: string;
  package: string;
  major: number;
  minor: number;
  route: string;
  role: string;
  name: string;
  kind: string;
}

export interface ReferenceEdge {
  from: string;
  kind: string;
  label: string;
  index: number;
  target: ReferenceTarget;
}

export interface ReferenceNode {
  id: string;
  source: string;
  name: string;
  kind: string;
  visibility: 'public' | 'exposed';
  role: '' | 'self' | 'static';
  declaration: string;
  documentation: string[];
  location: ReferenceLocation;
}

export interface ReferenceLocation {
  authored: boolean;
  path: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  offset: number;
  length: number;
}

export interface ReferenceSource {
  id: string;
  name: string;
  path: string;
  dialect: string;
  root: string;
  semanticRoot: string;
  documentation: string[];
}

export interface ReferenceExport {
  route: string;
  role: string;
  node: string;
}

export interface ReferencePackage {
  package: {
    name: string;
    major: number;
    minor: number;
    root: string;
  };
  sources: ReferenceSource[];
  nodes: ReferenceNode[];
  edges: ReferenceEdge[];
  exports: ReferenceExport[];
}

interface ReferenceCollection {
  schema: 'tetrodotoxin.documentation.graph.collection.v1';
  packages: ReferencePackage[];
}

const collection = referenceCollection as ReferenceCollection;

export const referencePackages = collection.packages;

export const referenceTypeKinds = new Set([
  'object',
  'structure',
  'enumeration',
  'namespace',
  'type',
  'render-contract',
  'shader-program',
]);

export function packageSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function packageReferenceHref(name: string): string {
  return `/docs/reference/${packageSlug(name)}/`;
}

export function nodeAnchor(node: string): string {
  return `node-${node}`;
}

export function sourceAnchor(source: string): string {
  return `source-${source}`;
}

export function isReferenceType(node: ReferenceNode): boolean {
  return referenceTypeKinds.has(node.kind);
}

export function referenceKindLabel(kind: string): string {
  return kind.replaceAll('-', ' ');
}

export function representedNode(document: ReferencePackage, node: ReferenceNode): ReferenceNode {
  if (node.kind !== 'alias') {
    return node;
  }
  const target = document.edges.find((edge) => edge.from === node.id && edge.kind === 'alias')?.target.node;
  const represented = document.nodes.find((candidate) => candidate.id === target);
  return represented && represented.kind !== 'value' ? represented : node;
}

export function typeSlug(document: ReferencePackage, node: ReferenceNode): string {
  const exportedRoutes = document.exports
    .filter((entry) => {
      if (entry.node === node.id) {
        return true;
      }
      const exported = document.nodes.find((candidate) => candidate.id === entry.node);
      return exported ? representedNode(document, exported).id === node.id : false;
    })
    .map((entry) => entry.route)
    .sort((left, right) => left.length - right.length || left.localeCompare(right));
  if (exportedRoutes[0]) {
    return packageSlug(exportedRoutes[0]);
  }
  const source = document.sources.find((candidate) => candidate.id === node.source);
  return `${packageSlug(source?.path ?? 'semantic')}-${packageSlug(node.name)}-${node.id}`;
}

export function typeReferenceHref(document: ReferencePackage, node: ReferenceNode): string {
  return `${packageReferenceHref(document.package.name)}${typeSlug(document, node)}/`;
}

export function owningType(document: ReferencePackage, node: ReferenceNode): ReferenceNode | undefined {
  const visited = new Set<string>();
  let selected: ReferenceNode | undefined = node;
  while (selected && !visited.has(selected.id)) {
    visited.add(selected.id);
    const parentId = document.edges.find(
      (edge) => ['declares', 'case', 'value'].includes(edge.kind) && edge.target.node === selected?.id,
    )?.from;
    const parent = document.nodes.find((candidate) => candidate.id === parentId);
    if (!parent) {
      return undefined;
    }
    if (isReferenceType(parent)) {
      return parent;
    }
    selected = parent;
  }
  return undefined;
}

export function nodeReferenceHref(document: ReferencePackage, node: ReferenceNode): string {
  if (isReferenceType(node)) {
    return typeReferenceHref(document, node);
  }
  const owner = owningType(document, node);
  return owner
    ? `${typeReferenceHref(document, owner)}#${nodeAnchor(node.id)}`
    : `${packageReferenceHref(document.package.name)}#${nodeAnchor(node.id)}`;
}

export function documentationParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let paragraph: string[] = [];
  for (const line of lines) {
    if (line.length === 0) {
      if (paragraph.length > 0) {
        paragraphs.push(paragraph.join(' '));
        paragraph = [];
      }
    } else {
      paragraph.push(line);
    }
  }
  if (paragraph.length > 0) {
    paragraphs.push(paragraph.join(' '));
  }
  return paragraphs;
}

export function targetHref(target: ReferenceTarget, currentPackage: string): string | undefined {
  if (target.node && target.package === currentPackage) {
    const document = referencePackages.find((candidate) => candidate.package.name === currentPackage);
    const node = document?.nodes.find((candidate) => candidate.id === target.node);
    return document && node ? nodeReferenceHref(document, node) : undefined;
  }
  if (!target.package) {
    return undefined;
  }

  const base = packageReferenceHref(target.package);
  if (!target.route) {
    return base;
  }
  const document = referencePackages.find((candidate) => candidate.package.name === target.package);
  const selected = document?.exports.find(
    (entry) => entry.route === target.route && entry.role === target.role,
  );
  if (!selected || !document) {
    return base;
  }
  const exportedNode = document.nodes.find((node) => node.id === selected.node);
  if (!exportedNode) {
    return base;
  }
  return nodeReferenceHref(document, representedNode(document, exportedNode));
}
