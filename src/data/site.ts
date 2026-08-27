export const SITE = {
  name: 'Tetrodotoxin',
  title: 'Tetrodotoxin · Purpose-built languages, one toolchain',
  description:
    'Tetrodotoxin connects purpose-built languages through one semantic Workspace and one complete toolchain.',
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

export const docsNavigation = [
  { label: 'Introduction', href: '/docs/' },
  { label: 'Core concepts', href: '/docs/core-concepts/' },
  { label: 'API reference', href: '/docs/reference/' },
  { label: 'Development', href: '/docs/development/' },
] as const;
