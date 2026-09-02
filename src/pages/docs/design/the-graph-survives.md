---
layout: ../../../layouts/DesignLayout.astro
title: Generative graphs
description: References and Generics preserve graph-generating machinery until a real Terminal or Package boundary asks meaning to leave the live Workspace.
steps:
  - number: "30"
    title: Reference preserves the question
    id: reference-preserves-the-question
  - number: "31"
    title: Generic preserves the generator
    id: generic-preserves-the-generator
  - number: "32"
    title: Terminals belong at the edge
    id: terminals-belong-at-the-edge
  - number: "33"
    title: Package reconstructs machinery
    id: package-reconstructs-machinery
  - number: "34"
    title: A perfect simulacrum passes a behavioral test
    id: a-perfect-simulacrum-passes-a-behavioral-test
---

So far, every example could be described as a projection of current facts. Some
semantic objects promise more. They describe how to reach or generate a part of
the graph that may not exist yet.

The distinction first appears in ordinary name lookup. It becomes unavoidable
with Generics, and it ultimately determines what a Package has to preserve.

## Reference preserves the question

Suppose source spells `Graphics::Texture`. The current `Graphics` authority can
answer `Texture`, so retaining the selected type looks convenient. But if the
source behind `Graphics` changes, that pointer is yesterday's answer rather than
the authored relationship.

A Reference instead retains exactly two semantic facts:

- one stable host Abstract
- one authored concept name.

Whenever it resolves, it asks the host again.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-diagram rabbit-reference-diagram" role="img" aria-label="A Reference retains a stable host and one name and queries the host for its current answer">
  <div class="diagram-panel"><small>Stable host</small><strong>Graphics</strong></div>
  <span class="diagram-arrow" aria-hidden="true">+</span>
  <div class="diagram-panel"><small>Authored name</small><strong>Texture2D</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel accent-panel"><small>Current answer</small><strong>host.resolve(Texture2D)</strong></div>
</div>

A qualified spelling becomes a chain of those relationships. Each `::` segment asks the identity
selected by the previous segment. No route object stores the whole spelling,
selects a terminal type, or assumes the host will answer the same way after a
live source replacement.

`TypeReference` is therefore not a harmless name. It records instructions for
replaying a lookup because the graph-generating Reference was terminated too
early. Restoration and retry code then attempts to make that selected answer
look alive again.

## Generic preserves the generator

Reference preserves how to ask an existing authority. A Generic goes farther:
it accepts immutable argument facts and produces a live type graph according to
its own semantics.

```text
Generic machinery + argument Layout → materialized type graph
```

The materialized types are results. They do not define the Generic.

<div class="diagram inset-shadow diagram-flow rabbit-generative-graphic grid columns-2" role="img" aria-label="One Generic machinery graph creates materialized types from different argument Packs">
  <div class="diagram-panel accent-panel rabbit-generator"><small>First-class machinery</small><strong>Option</strong><span>argument Layout → type graph</span></div>
  <div class="chip-grid rabbit-generator-outputs"><span>Option[U8]</span><span>Option[Node]</span><span>Option[FutureType]</span></div>
</div>

Imagine that publication has observed `Option[U8]` and `Option[Node]`.
Serializing those two types would turn an open generator into a closed
inventory. A restored consumer could use yesterday's materializations but could
not ask for `Option[FutureType]` tomorrow.

C++ templates expose the same module-interface pressure. Their generative
semantics often require source definitions or a compiler-specific serialized
representation to instantiate later. TTX instead treats the generator as
semantic graph content that a Package can preserve independently from one
frontend's heap.

## Terminals belong at the edge

What happens when a consumer genuinely needs a representation rather than a
living semantic participant? That operation belongs at a Terminal.

A Terminal derives a representation for another consumer:

```text
living graph
├── Graph Text
├── generated bindings
├── LLVM IR and CPU objects
├── SPIR-V and Vulkan descriptions
└── Package reconstruction
```

Representation is useful. The boundary is the issue.

LLVM may choose registers, calling conventions, offsets, and debug data. SPIR-V
may choose storage classes and descriptor bindings. A C binding may choose
opaque handles and operation tables. Those facts serve real consumers, but none
flow backward to become semantic authority inside the graph.

A selected-type cache, flattened route record, linked dependency object, or
compiler IR node retained as source meaning is an internal Terminal. It cannot
answer future concepts naturally. Adapters must relift it into wrappers, and
the edge multiplies through invalidation, normalization, and retry phases.

This is stronger than a warning against caching. The stored representation has
already left semantic participation. Every later attempt to make it answer a
new question creates an edge back into the graph, so restoration, relinking,
and synchronization grow around a fact that should have remained a live owner.

The diagnostic question is direct:

> Does this object store enough representation to reconstruct another semantic
> participant later?

If so, it is probably a Terminal inside the graph. Living owners retain the
machinery instead: References keep host and name, Generics keep
argument-to-graph behavior, and Expressions keep their operands. Representation
appears only when a real consumer asks those owners to leave the graph.

The causal rule is simple:

> A Terminal may enter or leave only at the graph boundary.

Tetrodotoxin enters production through the ordinary `products` concept. An
unsettled owner returns Unknown, a completed owner with no products returns
None, and a production authority visits factual named product identities. The
authority is semantic machinery, not an inventory of existing artifacts.

Build retains those exact roots and maps its invocation inputs to Terminal
providers imported from plugins. A Terminal may return a Named Pack of
immutable byte Constants, but that Pack has already crossed the edge. No EXE,
library, provider path, or compiler object becomes a route back into the live
Package graph.

## Package reconstructs machinery

Package is the semantic Terminal. It asks every persistent owner for the
immutable facts and machinery needed to reproduce that owner's promised
behavior.

References contribute host relationships and names, not selected targets.
Generics contribute their materialization behavior, not prior outputs.
Initialization contributes the negotiation needed to produce future Packs, not
cached defaults. Concrete Dialects contribute the rules only they understand.

Packaging is graph-scale Constant closure:

```text
[Constant machinery, Constant relationship, Unknown dependency]
                       ↓ later observation
[Constant machinery, Constant relationship, Constant dependency]
                       ↓
              immutable Package product
```

The live graph does not become Constant. The publication projection becomes
Constant after every required current dependency proves an immutable identity.
Reuse is lawful only against that exact dependency tuple.

This is the graph-scale form of the same rule used by folding:

- `fold` asks one value-producing relationship for an immutable projection
- constant evaluation proves that all facts required by that request are
  Constant
- Package asks an entire semantic island for an immutable reconstructable
  projection.

Other toolchains often implement these as separate engines because each works
over a different representation. TTX gives them one semantic foundation without
pretending their operational policies are identical.

Termination limits, resource budgets, deterministic serialization, imported
code security, cache scope, protocol versioning, and target-specific facts
remain real concerns. They belong to the querying Context or consuming Terminal
rather than justifying another semantic graph.

Restoration follows the ownership path in reverse: validate the bounded
product, create fresh authorities, reconstruct concrete owners, reconstruct
References, restore generators, and validate the new living graph through its
ordinary queries.

## A perfect simulacrum passes a behavioral test

The reconstructed graph is not the original process object. It has fresh
addresses, fresh identities, and may use different private data structures.

It is a perfect simulacrum when observers cannot distinguish the two through
the semantic behavior the Package promises:

```text
name(source graph)              = name(restored graph)
resolve("instance")             ≃ resolve("instance")
visit_concepts(source graph)    ≃ visit_concepts(restored graph)
materialize(Generic, arguments) ≃ materialize(Generic, arguments)
```

The comparison includes more than names and lookup. Promised type and
Addressable edges, Layout projections, fitting and Initialization behavior,
Callable behavior, Interface relationships, Constant facts, References, and
Generic generation must remain observably equivalent. The private structure
that supplies those answers is deliberately outside the promise.

The final line is the strongest test. A restored Generic must materialize a type
that the packaging process never requested. Otherwise the product preserved a
memoization table rather than graph-generating meaning.

Source tokens, compiler caches, process addresses, and native code need not be
part of the Package promise. They may remain absent or travel through sibling
Terminals. The Package format is compact because it chooses observable semantic
behavior, not because it terminates machinery into convenient records.

That makes Package fundamentally different from a compiler memory image. GCC,
for example, documents its
[Compiled Module Interface](https://gcc.gnu.org/onlinedocs/gcc/C_002b_002b-Compiled-Module-Interface.html)
as implementation-specific, compiler-version-bound, and rebuildable. A Package
instead promises semantic observations through public concepts, including the
ability to generate facts that did not exist during publication.

That separation also keeps local production live. A Build sources
`package.ttx` directly after its Environment has loaded the required Dialect
plugins. It never creates `package.ttxp` just to restore the graph it already
has. Invoking the Package root is the independent edge that produces an archive
for distribution or source-free use.

The graph can now survive source and process boundaries. The remaining concepts
show editors, builds, other languages, and TTX itself using that living result.

### Key takeaways

- References continue resolving after live source replacement
- Generics can materialize types that publication never observed
- packages can reconstruct a source-free graph that remains useful to the same
  semantic tools

### Common pitfalls to avoid

- Selected types, serialized routes, materialization inventories, linked
  dependencies, and compiler nodes become internal Terminals
- Adapters, relinking, retry phases, and invalidation attempt to make those dead
  fragments behave like living graph participants

### Normative contracts

- [TTX semantics: Consumers and Terminal products](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#consumers-and-terminal-products)
- [TTX design: Terminal products and reconstruction](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#terminal-products-and-reconstruction)
- [Tetrodotoxin design: Terminal production and reconstruction](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md#terminal-production-and-reconstruction)
