---
layout: ../../../layouts/DesignLayout.astro
title: Opaque projections
description: Packs carry real producers while immutable Layout projections expose useful shape without revealing the machinery that derived it.
steps:
  - number: "12"
    title: Packs carry produced flow
    id: packs-carry-produced-flow
  - number: "13"
    title: Layouts expose shape
    id: layouts-expose-shape
  - number: "14"
    title: Slice retains partial extent
    id: slice-retains-partial-extent
  - number: "15"
    title: Swizzle earns a Reindexed projection
    id: swizzle-earns-a-reindexed-projection
  - number: "16"
    title: Fitting is negotiation
    id: fitting-is-negotiation
---

Suppose an expression produces three values: red, green, and alpha. Another
operation wants to consume those values. It needs to know what is flowing and
what shape that flow has, but it should not need the expression's parser state,
concrete class, or private rules.

Returning the complete producer object would expose too much. Copying its values
into a generic tuple would create another semantic owner. Packs, Layouts, and
Context divide the problem along the questions the consumer actually asks.

## Packs carry produced flow

A `Pack` is an immutable snapshot of produced semantic flow. It retains the
exact Abstracts supplying each current value.

```text
Pack
├─ red-expression
├─ green-address
└─ alpha-constant
```

The Pack answers “which semantic identities are producing values in this
observation?” It is not an aggregate type, another semantic node, or a side
table mapping descriptors back to producers. Empty, scalar, positional, named,
and repeated flow can exist without materializing an anonymous type solely to
give the next operation something to inspect.

This is particularly important for expressions. The expression remains the
producer even when its output contains several values. A consumer does not
replace it with a tuple node and later attempt to recover the authored
expression for formatting or diagnostics.

## Layouts expose shape

The consumer may not need the identities themselves. It may only need to ask
whether the flow contains three values with particular types or names. A
`Layout` is the immutable, identity-free projection that answers that structural
question.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-diagram rabbit-pack-diagram" role="img" aria-label="A Pack retains exact producers while its Layout exposes only their current shape">
  <div class="diagram-panel accent-panel"><small>Exact producers</small><strong>Pack</strong><span>red · green · alpha</span></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel accent-panel"><small>Immutable projection</small><strong>Layout</strong><span>U8 · U8 · U32</span></div>
</div>

Equal Layouts do not make two types identical. A Layout carries no visibility,
documentation, field policy, target offset, storage class, or ABI calling
convention.

That opacity is an enabling firewall. The owner can offer useful structure to
another Dialect or Terminal without exposing the contract machinery from which
the structure was inferred.

The firewall has concrete rules:

- a Layout is a fresh immutable projection, never retained semantic owner state
- Unknown entries, extents, names, and relationships are useful partial shape
- a later query returns another Layout rather than completing an earlier one
- each concrete Layout preserves only the structure it can honestly promise
- generic consumers negotiate with the Layout instead of inspecting its owner
- fitting or equal shape never proves type identity
- offsets, storage classes, calling conventions, and reconstruction records
  belong to Terminals rather than Layouts.

These constraints do not make Layouts less expressive. They let another
consumer use established shape without gaining a dependency on field tables,
parser state, lifecycle policy, or the current implementation of the producing
Dialect. The information hidden by Layout is exactly the information that would
otherwise calcify the consumer.

### Context carries query-time data flow

A query sometimes needs to retain the Pack and Layout it has just projected.
`Context` is the caller-owned data-flow domain for that observation. Its narrow
operation, `pack(layout)`, retains one immutable Pack snapshot for the Context
lifetime. It copies the projected names and shape while borrowing the real
Abstract identities that produced the flow.

Context does not resolve names, evaluate concepts, own source identities, or
keep an earlier Pack synchronized with later queries. Adding those powers would
turn query-time data flow into an execution choke point and another dead graph.

This narrow role is important to self-hosting. TTX queries already communicate
through the same Pack and Layout flow that TTX exposes to other languages. The
semantic model does not require a separate host-only result container before it
can describe its own queries.

## Slice retains partial extent

Imagine a Slice operation that selects a subrange from the values produced by
another expression. Its starting index and count may still be incomplete, but
the operation is not arbitrary. Whatever it eventually produces will be
repeated element flow.

What can Slice truthfully promise before it knows the element type or the number
of selected elements?

It can promise a Ranged Layout while leaving both facts provisional:

```text
Ranged(Unknown, Unknown)
```

The first Unknown represents the element. The second represents the extent.
Neither means that the entire projection failed.

If the receiver establishes that its elements are `U8`, a later query can
project:

```text
Ranged(U8, Unknown)
```

If the count operand later answers the ordinary `fold` concept with Constant
`4`, Slice can ask the caller's Context to retain another Pack snapshot:

```text
Ranged(U8, 4)
```

These are three immutable observations because the Layout never interprets
`fold` or mutates its extent. Slice owns the progressive language-level query,
while Ranged records only the element relationship and extent established by
that observation.

Because Slice publishes ordinary Layouts, it does not need to know its eventual
consumers or the concrete machinery behind its producer. The resulting flow can
participate in fitting, initialization, another access operation, or a future
Dialect without giving those consumers a Slice-specific API.

## Swizzle earns a Reindexed projection

Slice preserves one repeated element relationship. What if an operation needs
to select individual elements, repeat them, and change their order?

Expanding Slice with name lookup and index maps would give one concept several
unrelated responsibilities. Swizzle owns the broader element-selection
question. It begins with authored names rather than completed indices. Given:

```text
[r: U8, g: U8, b: U8, a: U32]
```

Consider the authored selection:

```text
.[.r, .r, .a, .g, .a]
```

The output count is already known from the five authored selections, even when
none of their names resolve. Its minimum useful projection is:

```text
Ranged(Unknown, 5)
```

As names resolve independently, Swizzle can preserve every established slot in
a Fluid Layout:

```text
Fluid[red-producer, red-producer, Unknown, green-producer, Unknown]
```

Once every selected name is factual and unique in the receiver, Swizzle can
publish the complete immutable mapping:

```text
Reindexed(receiver-layout, [0, 0, 3, 1, 3])
```

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-layout-sequence" role="img" aria-label="Swizzle projections progress from unknown ranged shape through partial fluid shape to a complete reindexed mapping">
  <div class="diagram-panel"><small>Base</small><strong>Ranged</strong><span>(Unknown, 5)</span></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel"><small>Partial</small><strong>Fluid</strong><span>[red-producer, red-producer, Unknown, green-producer, Unknown]</span></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel"><small>Complete</small><strong>Reindexed</strong><span>(receiver-layout, [0, 0, 3, 1, 3])</span></div>
</div>

Reindexed knows nothing about names or Swizzle. It records only a complete
source Layout and mapping already established by the semantic owner.

This separation is the compositional payoff: whether a consumer receives Ranged
from Slice or Fluid or Reindexed from Swizzle, it asks the same fitting question
without knowing which operation produced the projection.

```text
Slice   ──> Ranged ───────┐
                         ├──> the same Layout negotiation
Swizzle ──> Fluid/Reindexed┘
```

## Fitting is negotiation

The next consumer now has a structural question: can this projected flow satisfy
the shape I accept? A Boolean `fits` result destroys the distinction between
provisional incompatibility and completed rejection. It also cannot carry
selected producers, name reordering, conversions, or partial slots.

Fitting therefore projects one of three answers:

```text
Unknown          the relationship remains unsettled
None             the receiver proves completed rejection
fitted Pack      the receiver admits these actual producers
```

A positive Pack may itself contain Unknown slots. Whole-relationship
uncertainty and slot-local uncertainty are different facts.

Without this boundary, a generic consumer proves a concrete contract, extracts
member tables or current type selections, and stores them as stable state. A
query becomes a cache, the cache becomes a link phase, and the link phase
becomes another graph.

The recurring smell is a consumer that switches over Fluid, Named, Ranged,
Composite, or Reindexed to recover the producer's private model. Optional names
on every base entry, sentinel indices inside Reindexed, Boolean-only fitting,
and ABI offsets inside Layout all cross the same boundary. They convert one
immutable projection into a hidden contract extraction API.

The next concept asks how construction, defaults, folding, and richer
compatibility can emerge from these opaque negotiations without accumulating on
one central type object.

### What this enables

- Slice and Swizzle can expose partial results through shared Layouts
- Consumers can fit, initialize, compile, or inspect that flow without learning
  which operation or Dialect produced it

### What goes wrong without it

- Boolean fitting turns an unsettled negotiation into a premature decision
- Retained type answers turn one observation into hidden mutable state
- Concrete Layout switches make consumers depend on producer implementation
- Sentinel indices encode uncertainty as representation
- Target offsets leak Terminal facts into semantic structure

### Normative contracts

- [TTX semantics: Pack](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#pack)
- [TTX semantics: Layout](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#layout)
- [TTX design: Pack is value flow and Layout is semantic shape](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#pack-is-value-flow-and-layout-is-semantic-shape)
