---
layout: ../../layouts/DocsLayout.astro
title: Tetrodotoxin documentation
description: Learn why Tetrodotoxin connects purpose-built languages and how its shared semantic model fits together.
subheader: Start here
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

When a completed Workspace needs to become native code, a GPU module, an
Archive, or canonical source, an independent **Terminal** produces that view.
Representation begins at that boundary instead of leaking back into every
language.

> **The common layer is meaning, not representation.** Languages share the
> questions that cross domains while keeping richer behavior with the owner
> that understands it.

## Choose a path

### Understand the model

[Core concepts](/docs/core-concepts/) starts with the ownership problem and
introduces Dialects, TTX, the Workspace, and Terminals in context.

### See the language family

[TTX](/ttx/) shows how Package, Library, App, Scene, Render, and Shader share a
semi-common Lexicon while remaining distinct Dialects in one semantic graph.

### Browse the source API

[TTX package reference](/docs/reference/) presents the public identities,
relationships, and authored documentation generated from completed Package
graphs.

### Work on the project

[Development](/docs/development/) explains the contribution philosophy, source
repositories, and the evidence expected from a change.

### Use the complete application

[Puffer](/puffer/) is Tetrodotoxin's all-in-one compiler driver, Workspace
manager, command host, and language server. It is one complete way to use the
platform rather than a required layer inside it.

### Find a build

Tetrodotoxin has no public release yet. The [download page](/download/) points
to the GitHub location where the first release and its notes will be published.
