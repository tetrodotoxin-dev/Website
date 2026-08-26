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
} as const;

export const primaryNavigation = [
  { label: 'Docs', href: '/docs/' },
  { label: 'TTX', href: '/ttx/' },
  { label: 'Puffer', href: '/puffer/' },
  { label: 'Download', href: '/download/' },
] as const;

export const docsNavigation = [
  { label: 'Introduction', href: '/docs/' },
  { label: 'Core concepts', href: '/docs/core-concepts/' },
  { label: 'Development', href: '/docs/development/' },
] as const;
