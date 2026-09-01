---
layout: ../../../layouts/DesignLayout.astro
title: Emergent behavior
description: Initialization, recursive defaults, and folding emerge from small independent concepts instead of accumulating on one universal type API.
steps:
  - number: "17"
    title: Type does not own Initialization
    id: type-does-not-own-initialization
  - number: "18"
    title: Empty-capable values break recursion
    id: empty-capable-values-break-recursion
  - number: "19"
    title: Fold is an ordinary concept
    id: fold-is-an-ordinary-concept
---

Imagine implementing a type system for one language. The first type object may
need only a name and size, but construction soon adds defaults, conversions add
another policy, and fitting, allocation, constant evaluation, folding, and
lowering follow because type appears to be the object every operation already
understands.

The arrangement works until another language gives one operation a different
meaning or an operation does not belong to type at all. The shared type contract
then accumulates policies from every consumer and becomes another universal
language model.

TTX takes the opposite route. It begins with the Pack and Layout flowing through
the current query, then asks which semantic owner understands the requested
behavior. The result is another factual projection rather than a method added to
every type.

## Type does not own Initialization

Consider a declaration that needs a value but has no authored initializer. Its
type describes the semantic domain and exposes a Layout, but that alone does not
explain how the language creates a valid value.

Initialization asks a separate question:

> Given this input Pack, what output flow can the receiving concept currently produce?

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-diagram rabbit-initialization-diagram" role="img" aria-label="A source Pack and an Initialization concept negotiate an output Pack accepted by the receiver">
  <div class="diagram-panel"><small>Supplied flow</small><strong>Input Pack</strong></div>
  <span class="diagram-arrow" aria-hidden="true">+</span>
  <div class="diagram-panel accent-panel"><small>Independent concept</small><strong>Initialization</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel accent-panel"><small>Negotiated result</small><strong>Output Pack</strong></div>
</div>

The output Pack is sufficient evidence. The receiving declaration does not need
to know whether its producer came from a scalar zero, a field initializer, a
conversion, a fresh Object allocation, or another Dialect's construction
policy.

Concrete Library types can all answer Initialization while the host-neutral TTX
type contract remains free of default and allocation policy. A C type, Shader
type, or another domain can define a different initialization relationship
without extending one global switch.

## Empty-capable values break recursion

Opaque Packs first make ordinary composition straightforward. A Structure with
a Bool and a finite nested Structure asks each declaration for Initialization,
then composes the returned producers into one Pack. The outer owner does not
need a special nested-default representation.

Recursion exposes why that opacity matters. Suppose `Node` requires another
`Node` as an inline value. Initializing the outer value requires another Node,
which requires another Node. No finite Pack can satisfy the request, so the
current projection remains Unknown and immutable production waits.

Now place the child behind `Option[Node]`:

```text
Node initialization
  └─ Option[Node] initialization
       └─ absent
```

The absent Option produces one complete Pack without initializing Node. The
same reasoning lets an empty `View[Node]` or `Access[Node]` exist without
constructing an element.

<div class="grid columns-2 prose-grid">
  <article class="card data-card"><small>Required child</small><strong>Node → Node → Node</strong><p>Unknown · no finite projection</p></article>
  <article class="card data-card"><small>Empty-capable child</small><strong>Node → Option[Node] → absent</strong><p>Complete · recursion stops</p></article>
</div>

No central recursion registry knows that Option is special. The behavior
emerges because Initialization returns an opaque Pack and the absent state does
not ask for payload flow. Query-local recursion detection only prevents one
observation from evaluating forever. It does not mutate the type or cache a
permanent failure.

## Fold is an ordinary concept

Now consider a declaration that requires compile-time data. It receives a
producer, but should not inspect literals, expressions, Options, aggregates, or
foreign values to decide whether that producer is immutable.

It asks one ordinary question: `fold`.

1. Query every semantically reached input for `fold`.
2. Preserve Unknown when an input remains provisional.
3. Recognize exact None as proven non-foldability.
4. Continue only after every required answer proves Constant.
5. Let the concrete domain derive one immutable result.

A Constant answers its own fold query with itself. Another Dialect can support
the same protocol without modifying Library fields, the type system, hover, or
the compiler that consumes the result.

Before reusing a folded value, the operation requeries its reached inputs and
compares their exact Constant identities. This is the local form of the
Constant closure introduced in Factual uncertainty.

Folding and constant evaluation are therefore not separate semantic graphs.
`fold` asks for the immutable projection. Constant evaluation is the proof that
every fact needed by the current request has reached Constant.

These behaviors have useful precedents. The
[Hazel project](https://hazel.org/) gives incomplete programs static and dynamic
meaning rather than treating every unfinished editor state as meaningless.
[Abstract interpretation](https://www.di.ens.fr/~cousot/COUSOTpapers/POPL77.shtml)
formalizes useful approximations of program behavior. TTX shares the insistence
that partial information can remain meaningful, but it does not force every
concept into one global lattice or one universal approximation relation.

What matters here is the composition of the rules:

- Alias and Addressable make simple irreversible commitments
- Slice and Swizzle retain useful partial Layouts
- Option, View, and Access end recursive Initialization through empty values
- a required recursive Object remains Unknown because no finite Pack exists
- a const field proves Constant without learning how construction worked
- a Generic preserves machinery capable of producing unrequested types
- Package preserves observable behavior without preserving process identity.

None of those outcomes needs a central kind switch. They emerge because the
owners answer independent questions through immutable projections. The design
is successful when adding another Dialect extends those behaviors without
adding another registry, const interpreter, initialization hierarchy, or
shadow graph.

The same pattern now covers defaults, recursive construction, and folding
without assigning them all to type. The next question is harder: how can the
graph preserve an operation that produces not only a current fact, but new facts
in the future?

### What this enables

- Different languages can define Initialization and folding without extending a
  global type hierarchy
- Empty-capable values terminate recursive defaults while required recursive
  values remain factually Unknown

### What goes wrong without it

- The type system accumulates construction, conversion, allocation, folding,
  and lowering policy
- Const evaluation becomes a second interpreter
- Concrete kind switches decide which declarations participate in behavior that
  their real owners could have answered directly

### Normative contracts

- [TTX semantics: Open concept negotiation](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#open-concept-negotiation)
- [TTX design: Initialization and emergent behavior](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#initialization-and-emergent-behavior)
