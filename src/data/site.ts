export const SITE = {
  name: 'Tetrodotoxin',
  title: 'Tetrodotoxin · Purpose-built languages, one toolchain',
  description:
    'Tetrodotoxin connects purpose-built languages through one living semantic Workspace and one connected toolchain.',
  domain: 'tetrodotoxin.dev',
  github: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin',
  organization: 'https://github.com/tetrodotoxin-dev',
  releases: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin/releases',
  puffer: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin/tree/tetrodotoxin-1.0/puffer',
  ttxExamples: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin/tree/tetrodotoxin-1.0/apps/ttx',
  appGuide: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/app/README.md',
  sceneGuide: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/scene/README.md',
  languageGuide: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/language/README.md',
  contributing: 'https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/CONTRIBUTING.md',
} as const;

export const primaryNavigation = [
  { label: 'TTX', href: '/ttx/' },
  { label: 'Puffer', href: '/puffer/' },
  { label: 'Docs', href: '/docs/' },
  { label: 'Downloads', href: '/download/' },
] as const;

export const footerNavigation = [
  { label: 'Home', href: '/' },
  ...primaryNavigation,
] as const;

export const designNavigation = [
  { number: '00', label: 'Background', href: '/docs/design/' },
  { number: '1', label: 'Semantic ownership', href: '/docs/design/the-copy-problem/' },
  { number: '2', label: 'Factual uncertainty', href: '/docs/design/a-living-graph/' },
  { number: '3', label: 'Opaque projections', href: '/docs/design/layouts-as-firewalls/' },
  { number: '4', label: 'Emergent behavior', href: '/docs/design/emergent-behavior/' },
  { number: '5', label: 'Generative graphs', href: '/docs/design/the-graph-survives/' },
  { number: '6', label: 'Shared tooling', href: '/docs/design/the-toolchain-wakes-up/' },
  { number: '7', label: 'Live evolution', href: '/docs/design/the-graph-moves/' },
  { number: '8', label: 'Semantic federation', href: '/docs/design/meaning-crosses-languages/' },
  { number: '9', label: 'Self-hosting', href: '/docs/design/the-self-hosting-horizon/' },
] as const;

export const docsNavigation = [
  { label: 'Introduction', href: '/docs/' },
  { label: 'Getting started', href: '/docs/getting-started/' },
  { label: 'Core concepts', href: '/docs/core-concepts/' },
  { label: 'Design', href: '/docs/design/', children: designNavigation.slice(1) },
  { label: 'API reference', href: '/docs/reference/' },
  { label: 'Development', href: '/docs/development/' },
] as const;
