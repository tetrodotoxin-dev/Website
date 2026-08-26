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

## Project structure

- *src/pages/* owns public routes. Markdown files under *src/pages/docs/* become
  documentation pages.
- *src/layouts/* owns the shared site and documentation shells.
- *src/components/* owns the header and footer.
- *src/data/site.ts* owns navigation and external project links.
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
