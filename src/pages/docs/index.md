---
layout: ../../layouts/DocsLayout.astro
title: Tetrodotoxin documentation
description: Learn why Tetrodotoxin connects purpose-built languages and how its shared semantic model fits together.
---

Tetrodotoxin is for products that already contain several languages, even when
some of those languages currently look like configuration files, scene data,
shader source, or build metadata.

Each domain deserves to speak in the concepts its users understand. The hard
part is keeping those languages connected without flattening them into a second,
less precise model.

## What becomes possible

A Tetrodotoxin toolchain gives each domain its own **Dialect** and semantic
objects. Those objects participate in one **Workspace**, where Packages,
cross-language references, editor navigation, diagnostics, and compilation can
reach the same identities.

When a consumer needs native code, a GPU module, a Package, Graph Text, or
canonical source, an independent **Terminal** asks the current Workspace for
the projection its product admits. Representation begins at that boundary
instead of leaking back into every language.

> **The common layer is meaning, not representation.** Languages share the
> questions that cross domains while keeping richer behavior with the owner
> that understands it.

## Choose a path

### Build the first product

[Getting Started](/docs/getting-started/) begins with an installed Puffer SDK
and a fresh Echo checkout. `puffer build.ttx` loads the declared plugins,
sources the live Package graph, and publishes the executable without Bazel or a
Package archive round trip.

### Understand the model

[Core concepts](/docs/core-concepts/) starts with the ownership problem and
introduces Dialects, TTX, the Workspace, and Terminals in context.

### Study the design

[Design Background](/docs/design/) explains the tooling history and constraints
that produced Tetrodotoxin. It then develops nine concepts across forty
numbered steps: semantic ownership, factual uncertainty, opaque projections,
emergent behavior, generative graphs, shared tooling, live evolution, semantic
federation, and self-hosting. It is the long path for readers who want to reason
through the examples and tradeoffs behind the architecture.

### See the bundled languages

[TTX](/ttx/) shows how Build, Environment, Package, Library, App, Scene, Render,
and Shader share a semantic vocabulary and selected source conventions while
remaining distinct Dialects in one graph.

### Browse the semantic graph

[TTX graph reference](/docs/reference/) presents identities, concepts, type
edges, layouts, and authored documentation from versioned Graph Text.

### Work on the project

[Development](/docs/development/) explains the contribution philosophy, source
repositories, and the evidence expected from a change.

### Use the application shell

[Puffer](/puffer/) opens one source or language-server session, coordinates the
real Build, Environment, Workspace, and Terminals, and publishes their products
without becoming a second semantic or build model.

### Find a build

The [download page](/download/) links to the source repository and GitHub
Releases, where packaged builds and their notes belong.
