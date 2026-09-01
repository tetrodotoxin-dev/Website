---
layout: ../../../layouts/DesignLayout.astro
title: Shared tooling
description: Puffer, editor features, and independent compilers become ordinary observers of one semantic graph instead of owners of parallel models.
steps:
  - number: "25"
    title: Puffer hosts the graph
    id: puffer-hosts-the-graph
  - number: "26"
    title: One identity, one editor path
    id: one-identity-one-editor-path
  - number: "27"
    title: Hover without a language switch
    id: hover-without-a-language-switch
  - number: "28"
    title: Compile into independent Terminals
    id: compile-into-independent-terminals
---

The graph now preserves current facts, partial structure, and machinery capable
of generating future meaning. None of that matters to a developer if hover,
navigation, compilation, and Packages still build private models beside it.

This chapter follows one graph identity from source into editor tools and
independent products, then defines the deliberately small role Puffer plays in
hosting that path.

## Puffer hosts the graph

A developer begins with one command or opens an editor. Something must establish
the source transaction, provider set, Workspace lifetime, diagnostics, and
publication boundary for that request.

Puffer is that host. It receives one root source with Dialect-owned argument
bytes or one language-server pipe:

```text
puffer <source.ttx> [dialect arguments...]
puffer -lsp=<pipe-name>
```

The selected source chooses its Dialect. Puffer raises the invocation without
parsing Build profiles, repository roots, provider names, or product flags. A
Build delegates one inline region to its real Environment child. Environment
loads the explicitly imported plugins, constructs a child Toolchain and
Workspace, and interprets the live Package source graph exactly once.

Puffer owns transport, host observations, diagnostics, and atomic publication.
Build owns the argument schema and product requests. Environment owns providers
and confinement. Terminals decide whether the current graph contains enough
certainty for their products.

`puffer build.ttx` therefore needs no external build system. Invoking
`package.ttx` separately produces a Package archive. Build does not require that
archive before it can consume the live Package graph.

## One identity, one editor path

Now imagine hovering the name `Texture` in source. The editor first has a source
position, while the graph understands semantic identities. Each frontend joins
those worlds by associating authored source spans with the exact Abstracts
created from them.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-tooling-path" role="img" aria-label="A source position selects an Association and exact Abstract used by hover, completion, definition, and graph tools">
  <div class="diagram-panel"><small>Authored source</small><strong>Position</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel"><small>Source evidence</small><strong>Association</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel accent-panel"><small>Shared subject</small><strong>Exact Abstract</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="chip-grid rabbit-diagram-stack"><span>Hover</span><span>Completion</span><span>Go to definition</span><span>Graph Text</span></div>
</div>

The Association is not an editor symbol. It is source evidence connecting one
authored location to the same identity used by validation, Package projection,
and compilation.

Diagnostics can therefore remain source-specific without making the editor the
semantic owner. A declaration with an unknown type still retains its authored
span, name, documentation, and every other relationship already established.

## Hover without a language switch

Once the position reaches the exact Abstract, hover asks generic questions:
name, documentation, type, concepts, and Layouts. Completion visits the concepts
that identity currently advertises. Go-to-definition follows the identity back
to its authored Association.

No central branch asks whether the subject is an import, field, parameter,
Pipeline value, Shader resource, or C declaration just to reconstruct
information the real owner already exposes.

The [Language Server Protocol](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)
standardizes requests and responses between editors and servers. TTX addresses
the layer behind that wire: which semantic subject every request actually
describes. A server can implement LSP perfectly and still maintain separate
editor, compiler, and Package symbol graphs. One exact Abstract prevents that
inner duplication.

Language-specific tokenization, formatting, and specialized presentation remain
with the frontend that owns them. Generic tooling handles only the semantic
questions that have genuinely become shared.

The VS Code extension follows the same bootstrap. It launches the installed
Puffer SDK, locates the workspace Build root, and loads the same declared
Dialect plugins. The extension owns editor transport and presentation rather
than a second provider inventory.

## Compile into independent Terminals

The compiler begins from the same graph, but asks different questions. One living
graph can feed several products without choosing one universal lowering:

```text
partial graph       → Graph Text
public concepts     → C or C++ bindings
Library execution  → LLVM IR and CPU objects
Shader + Render     → SPIR-V and Vulkan descriptions
semantic machinery → Package reconstruction
```

Each producer sets its own admission threshold. Graph Text can preserve
Unknown. Hover can show partial facts. Native objects and Package products wait
for every immutable fact their formats promise.

Provider plugins make that plurality an ABI boundary as well as an architectural
idea. The bootstrap SDK contains Build, Environment, Package, and a typed C
plugin loader. Library, App, Scene, Shader, LLVM, Vulkan, bindings, and other
frontends arrive from independent repositories. Environment retains their
shared libraries, visits exact provider identities, and proves the Terminal or
Dialect Interface Build requires.

LLVM IR is a powerful representation for optimization and CPU lowering. It is
not the common semantic layer for Package, Scene, Shader, editor, or Generic
meaning. SPIR-V owns a different representation for a different consumer.

This plurality is what lets the toolchain wake up without calcifying the graph.
The next question appears as soon as the developer edits the source. Can those
tools keep working without rebuilding one linked world or invalidating every
observation already returned?

### What this enables

- One source identity supports hover, definition, completion, Graph Text,
  Package projection, and independent compilation
- A new Dialect inherits generic tooling by participating in shared contracts
  rather than adding branches to Puffer

### What goes wrong without it

- The editor creates another symbol graph
- The compiler creates another dependency graph
- The application shell accumulates one mode and argument schema for every
  Dialect and Terminal

### Normative contracts

- [TTX design: A living toolchain](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#a-living-toolchain)
- [Tetrodotoxin design: Direct semantic construction](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md#direct-semantic-construction)
- [Tetrodotoxin design: Observable boundaries](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md#observable-boundaries)
