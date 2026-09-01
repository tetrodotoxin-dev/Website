---
layout: ../../../layouts/DesignLayout.astro
title: Live evolution
description: Live source replacement changes one authority while partial tooling, impact analysis, and immutable Package neighbors continue to use the surrounding graph.
steps:
  - number: "29"
    title: Live source replacement changes one authority
    id: live-source-replacement-changes-one-authority
  - number: "30"
    title: Partial tooling remains useful during edits
    id: partial-tooling-remains-useful-during-edits
  - number: "31"
    title: Rename and impact follow identity
    id: rename-and-impact-follow-identity
  - number: "32"
    title: Packages are immutable neighbors
    id: packages-are-immutable-neighbors
---

Imagine changing the declaration behind `Graphics::Texture` while another file,
an immutable dependency Package, and several editor requests are still active.
A phase-oriented compiler can discard its world and rebuild. An interactive
toolchain needs to know what actually changed.

The graph keeps that answer local. One source authority changes its current
answers. Unrelated authorities remain valid, and consumers ask again whenever
they need a current projection.

## Live source replacement changes one authority

Workspace gives each source one stable authority. A Reference targets that
authority rather than retaining the Monograph or type currently selected from
it.

When that source changes:

1. A new source transaction creates a new partial graph.
2. The source authority atomically begins answering from that graph.
3. References ask the authority again.
4. Unrelated source authorities remain intact.
5. Immutable Package authorities remain intact.
6. Packs and Layouts retained by earlier Contexts remain valid snapshots.

<div class="diagram inset-shadow diagram-flow rabbit-live-edit grid columns-3" role="img" aria-label="Editing Source B replaces only its authority while Source A, Package C, and previous snapshots remain intact">
  <div class="card"><small>Unchanged</small><strong>Source A</strong></div>
  <div class="card accent-panel"><small>Replaced authority</small><strong>Source B′</strong></div>
  <div class="card"><small>Immutable</small><strong>Package C</strong></div>
</div>

There is no global semantic link product to invalidate. Consumers never retained
the selected answer, so they do not need a lease proving that answer survived.

Infrastructure follows the same rule. Editing `package.ttx` replaces its source
authority inside the Environment-owned child Workspace, while Build retains its
Package relationship and asks again. Loaded plugins remain stable provider
identities without lending Build cached compiler objects or target graphs.

## Partial tooling remains useful during edits

The replacement graph may contain errors or Unknown edges. That does not make
the entire source transaction useless.

```text
function "resize"
├─ documentation = known
├─ source location = known
├─ parameter Layout = partially known
└─ result type = Unknown
```

Hover can explain the function. Go to definition can navigate to it. Completion
can visit concepts already advertised. Graph Text can show the strongest
current projection. A native Terminal can independently reject the same graph
because its required result type is not complete.

This is more than graceful error recovery. Unknown is part of the semantic
contract, so editor behavior and compiler admission are two observations of one
graph rather than two systems guessing about compiler state.

## Rename and impact follow identity

A rename follows identity instead of searching every source for equal text and
hoping each match means the same thing. Authored Associations and References
expose the actual semantic edges that reach one identity.

A graph-aware rename can:

- locate the defining Association
- visit References that currently resolve to that owner
- distinguish an unrelated equal spelling in another authority
- update source owned by participating frontends
- report Package or generated projections that cannot be edited in place.

Impact analysis follows the same edges. If a Layout changes, consumers can ask
which Callables, Interface negotiations, Packages, or Terminals currently reach
that identity. The analysis does not need a separate dependency database whose
keys must be synchronized with compiler nodes.

The exact edit algorithm remains frontend policy. TTX supplies the shared
subject and graph relationships, not one universal source rewriter.

The same foundation supports broader questions without adding registries:

- semantic search visits identities satisfying the requested concepts
- graph-aware refactoring follows real References rather than equal spellings
- generated bindings retain correlation to the identities that produced them
- debugger and profiler data can map Terminal output back to semantic owners
- editor diagnostics can explain which required projection remains Unknown.

These are consequences of identity and live queries. They are not separate
indexes that become authoritative beside the graph.

## Packages are immutable neighbors

A restored Package graph participates beside live source rather than beneath a
special metadata API. Its identities are fresh in the current Workspace, but
its promised observations and generators are immutable.

References from source can query Package authorities. Hover can read Package
documentation. A Generic restored from Package can materialize a new type. A
source edit does not invalidate those neighbors because their reconstruction
facts are already Constant.

Source-free definition may lead to an authored location preserved by the
Package format or to the nearest durable semantic boundary it promises. Either
way, the same identity path serves hover and compilation. There is no fallback
Package symbol table.

Build systems may replace one Package coordinate with another in a new
Workspace transaction. They do not mutate an existing immutable Package graph
or teach live References to cache whichever version happened to be present.

An authored Build can instead select another Package source, Package coordinate,
or plugin identity in a fresh invocation. That creates a new Environment and
product projection. The previous Build products remain immutable Terminal
closures rather than graph state awaiting invalidation.

The graph can now move within one language ecosystem. The next question asks
whether the same identity and projection model can cross language boundaries
without turning either language into the other.

### What this enables

- Editors can consume partial replacement graphs immediately
- References naturally observe new source answers
- Unrelated source graphs, immutable Packages, and prior Pack and Layout
  snapshots remain valid

### What goes wrong without it

- A global linked program requires invalidation whenever one source changes
- Dependencies require an imposed processing order
- Incomplete answers trigger retry phases
- Editors need separate recovery state beside the semantic graph

### Normative contracts

- [TTX semantics: Semantic invariants](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#semantic-invariants)
- [TTX design: One live graph](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#one-live-graph)
- [Tetrodotoxin design: Workspace identity and completion](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md#workspace-identity-and-completion)
