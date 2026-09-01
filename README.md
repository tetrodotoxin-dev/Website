# Tetrodotoxin website

The public site for [tetrodotoxin.dev](https://tetrodotoxin.dev). It is a
static Astro project deployed to Cloudflare Workers.

## Local development

The project requires Node.js 22.12 or newer.

~~~sh
npm install
npm run dev -- --background
~~~

Astro keeps the development server in the background. Inspect or stop it with:

~~~sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
~~~

Useful checks:

~~~sh
npm run check
npm run build
~~~

## Generated TTX reference

The API reference consumes versioned graph text. Puffer's generic graph Terminal
records real Abstract identities, concepts, contracts, Type edges, and ordered
Layouts without Package, Library, Pipeline, Shader, or another Dialect-specific
section. The website parses that text into one generic nodes, edges, and Layouts
view.

Generate one or more dumps from the sibling checkout, then synchronize the
checked-in corpus from files:

~~~sh
cd ../tetrodotoxin
bazel build //puffer:puffer
.bin/bin/puffer/puffer packages/ttx/Perimortem.Memory/package.ttx \
  -terminal_repository=/tmp/ttx-products -dump_graph > /tmp/memory.ttxg
cd ../website
npm run docs:sync -- /tmp/memory.ttxg
~~~

With no file arguments, *scripts/sync-reference.mjs* reads one graph from stdin.
It never invokes Puffer, opens Package products, discovers dependencies, or
reconstructs concrete Dialect meaning.

Static pages use canonical shortest concept paths for navigation. Bytewise
lexical order breaks presentation ties, while dump-local IDs preserve shared
nodes and cycles.

## Project structure

- *src/pages/* owns public routes. Markdown files under *src/pages/docs/* become
  documentation pages.
- *src/layouts/* owns the shared site and documentation shells.
- *src/components/* owns the header and footer.
- *src/data/site.ts* owns navigation and external project links.
- *src/pages/docs/design/* and *src/layouts/DesignLayout.astro* own the
  first-principles narrative about meaning, graphs, and representation.
- *src/data/reference.ts* owns the generated reference presentation contract.
- *scripts/sync-reference.mjs* parses graph-text files or stdin into the generic
  checked-in view.
- *src/styles/global.css* owns the visual system.
- *public/brand/* contains the canonical Tetrodotoxin SVG artwork.

To add a documentation page, create a Markdown file under *src/pages/docs/*
using *DocsLayout.astro*, then add its route to *docsNavigation* in
*src/data/site.ts*. The navigation stays explicit so a maintainer can see the
published information architecture in one place.

## Cloudflare deployment

The site uses Astro's static output, so it does not need the Cloudflare Astro
adapter. *wrangler.jsonc* sends the built *dist/* directory to a Cloudflare
Worker and binds the Worker to *tetrodotoxin.dev*.

Authenticate Wrangler once, then deploy:

~~~sh
npx wrangler login
npm run deploy
~~~

Use *npm run preview:cloudflare* to build and preview through the local
Cloudflare runtime. Cloudflare credentials and account identifiers remain
outside the repository.

## Brand source

The website copies *logo.svg* and *icon.svg* from the Tetrodotoxin repository's
*.data/* directory. Update the canonical files there first, then copy the
reviewed artwork into *public/brand/* and *public/favicon.svg*.
