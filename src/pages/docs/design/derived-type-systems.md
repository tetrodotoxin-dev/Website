---
layout: ../../../layouts/DesignLayout.astro
title: Derived type systems
description: Concrete languages build Types, initialization, optional values, and control flow over TTX Domains without making one universal type system authoritative.
steps:
  - number: "23"
    title: TTX defines Domain, not a type system
    id: ttx-defines-domain-not-a-type-system
  - number: "24"
    title: Initialization joins target and source
    id: initialization-joins-target-and-source
  - number: "25"
    title: Empty flow is not Void
    id: empty-flow-is-not-void
  - number: "26"
    title: Option derives absence through fitting
    id: option-derives-absence-through-fitting
  - number: "27"
    title: Empty-capable values break recursion
    id: empty-capable-values-break-recursion
  - number: "28"
    title: Propagation gives empty flow control meaning
    id: propagation-gives-empty-flow-control-meaning
  - number: "29"
    title: Type systems meet through shared contracts
    id: type-systems-meet-through-shared-contracts
---

Operational joins showed how behavior can arise without assuming a type system.
Now we can apply that machinery to a familiar language problem: values have
types, declarations need initialization, optional values may be absent, and
control flow must decide which values continue.

TTX does not supply one answer for every language. It supplies the contracts
from which a concrete language can build an answer and still cooperate with
other systems.

## TTX defines Domain, not a type system

A TTX `Domain` is one Abstract representing a semantic value domain. It exposes
a current Layout and answers its own total `resolve_domain()` query. That is
enough for another system to ask where a value participates and what value shape
it currently promises.

It is not a type system. TTX Domain prescribes no numeric families,
subtyping, visibility, construction, defaults, conversion, ownership, receiver
roles, allocation, or physical representation.

Those policies remain with the languages that give them meaning:

```text
C Type ─────────┐
Library Type ───┼──> shared Domain, Layout, and Interface questions
Shader Type ────┘
```

Each language can define a rich and internally coherent type system without
translating its Types into another language's hierarchy. Its concrete Types may
satisfy Domain where they genuinely participate in shared value flow.
Cooperation begins only where their real owners can answer the same contract
honestly.

This distinction protects both directions. TTX does not become the semantic
baseline for every language, and a convenient bundled language does not become
a universal intermediate representation merely because other Dialects reuse
some of its infrastructure.

## Initialization joins target and source

Consider a declaration that requests one target meaning and receives some
source flow. Initialization is the operational join between those participants,
not a method intrinsically owned by Domain:

```text
Initialization
├─ Target Abstract
└─ Source Abstract and its Pack
```

The current fitting answer propagates through the join:

```text
Target.fits(Source)
  → Unknown      Initialization remains Unknown
  → None         Initialization propagates None
  → fitted Pack  Initialization delegates Target questions
                 and returns fitted Source flow
```

The output Pack is sufficient evidence for the constructee. It does not need to
know whether a scalar literal, field policy, conversion, allocation, or another
Dialect produced the admitted values.

A concrete owner may define initialization beside its Type semantics because it
understands both relationships. That does not add Initialization to the shared
TTX Domain operations. Another language can define a different join over the same
Pack and Layout contracts.

An empty input Pack is one possible initialization request. It does not imply a
universal default method. The receiving language decides what zero supplied
values mean for this target.

## Empty flow is not Void

An empty Pack exposes the empty Layout:

```text
Pack()
└─ Layout []
```

This is a complete statement that no value flows. It is not a Void Type, an
unreachable state, a null Pack, or the None concept answer.

The distinctions remain separate:

```text
[]       → zero values cross this flow edge
None     → one concept question proved completed absence
Unknown  → the current observation remains indeterminate
```

A bare return can therefore carry one real empty Pack and fit a function result
Layout that also accepts zero values. No synthetic Void value needs to cross
the edge.

That Pack is empty because the authored return proves that it supplies no
values. It is not the Pack of Unknown. Unknown supplies no Pack at all, and a
producer whose cardinality remains unsettled must preserve that uncertainty in
its own partial Layout.

An empty Layout also cannot masquerade as an ordinary value. A Domain admitted
to value flow contributes at least one entry to its Layout. An empty `View[T]` is
different because the View itself is one value even when it selects no elements.
Its Pack still contains that exact View producer.

## Option derives absence through fitting

Now define one concrete Library formula, `Option[T]`. It represents either an
absent state or one payload value. Both states are real values of the same
Option Type.

The receiving owner can derive those states directly from Pack fitting:

```text
[]                  → absent Option[T]
Pack(value fitting T) → present Option[T]
Unknown relation    → Unknown
rejected relation   → None
```

The empty input does not become the Option's Layout. It is the source flow that
the Option initialization join recognizes as absence. The resulting absent
Option is still one producer with a nonempty value Layout.

Likewise, a present Option retains the fitted payload Pack rather than copying
its producer into an optional-field record. The Option owns only the distinction
between absent and present states.

This is the first payoff of deriving a type system from opaque projections. A
language can introduce optional values without adding null to every Abstract,
adding optional entries to Layout, or teaching TTX about payload storage.

## Empty-capable values break recursion

Suppose a record-like `Node` requires another inline `Node` value:

```text
Node
└─ child : Node
```

Initializing the outer value requires another Node, which requires another
Node. No finite Pack can satisfy that request, so the current initialization
projection remains Unknown.

Now make the child optional:

```text
Node
└─ child : Option[Node]
```

The Option owner accepts `[]` and produces its absent value without asking Node
for payload flow. The recursive request therefore reaches one finite Pack.

The same reasoning applies to a `View[Node]` or `Access[Node]` whose empty value
selects no elements. Each concrete owner defines an empty-capable value. No
central recursion registry needs to recognize a list of privileged Type kinds.

<div class="grid columns-2 prose-grid">
  <article class="card data-card"><small>Required child</small><strong>Node → Node → Node</strong><p>Unknown · no finite Pack</p></article>
  <article class="card data-card"><small>Empty-capable child</small><strong>Node → Option[Node] → absent</strong><p>Complete · recursion stops</p></article>
</div>

## Propagation gives empty flow control meaning

Empty flow does not mean control-flow termination by itself. A concrete
operation gives an empty edge that meaning.

Library's postfix `?` asks an optional or result-like value which flow should
continue and which flow should leave the current function:

```text
present Option[T] ?  → Pack(payload T) continues
absent Option[T]  ?  → Pack() escapes
Unknown Option[T] ?  → Unknown
```

The escape Pack contains no value. It can fit a function result Layout `[]`, so
the function needs no Void Type to express an early return without data. A
result-like value can instead project one typed error Pack along the escape edge.

The empty escape is available only after the Option owner establishes its
absent state. An unsettled Option cannot eliminate Unknown into that branch and
must be queried again when another observation provides more evidence.

Postfix `!` uses another join:

```text
present Option[T] !  → retained payload Pack
absent Option[T]  !  → Initialization(T, [])
Unknown Option[T] !  → Unknown
```

It does not terminate control flow. It asks the element's concrete
Initialization relationship to produce fallback flow. The two operators share
the same Option states while assigning them different behavior through their
own operational joins.

Branches, loops, returns, and propagation can build richer control flow from the
same rule. Packs state what crosses an edge. The concrete operation states which
edge is taken and what that choice means.

## Type systems meet through shared contracts

Library's Option, Bool, initialization policy, and propagation rules now form
part of one concrete type system. Another Dialect may choose different value
families and different operational joins.

They can still cooperate without adopting one hierarchy:

- Domain identifies the semantic value domain each owner genuinely exposes
- Pack retains the real producers participating in current flow
- Layout projects structural relationships without revealing private policy
- Fitting negotiates directional value admission
- Interface proves richer compatibility without casting either participant
- Open concepts such as `fold` allow independent domains to share behavior

Matching Layouts do not make two Domains identical. A satisfied Interface does not
install a global subtype relationship. A generated binding does not make one
language's representation authoritative. Each proof remains local to the exact
participants and question being negotiated.

This is why TTX can support type systems without becoming one. The shared
contracts make interaction possible, while every language retains the freedom
to define the concepts that make its own values useful.

With current Types and their behavior established, the next question moves from
facts that exist now to machinery capable of producing facts in the future.

### Key takeaways

- Languages can construct coherent type systems without extending one universal
  hierarchy
- Empty flow, absence, and indeterminacy remain separate facts
- Option, View, and Access can terminate recursive initialization through their
  own empty-capable values
- Control flow can use explicit empty Packs without inventing a Void value
- Independent type systems can negotiate through shared contracts

### Common pitfalls to avoid

- TTX Domain accumulates defaults, conversion, allocation, and control-flow policy
- Empty flow is laundered into Void, null, or unreachable state
- Option requires nullable Abstracts or optional Layout entries
- Recursive construction depends on a central registry of special Type kinds
- One language's Type hierarchy becomes the integration model for every Dialect

### Normative contracts

- [TTX semantics: Domain](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#domain)
- [TTX semantics: Pack](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#pack)
- [TTX design: Initialization and emergent behavior](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#initialization-and-emergent-behavior)
