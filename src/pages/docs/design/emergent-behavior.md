---
layout: ../../../layouts/DesignLayout.astro
title: Emergent behavior
description: Operational joins, fitting propagation, equality, and folding emerge from layered graph relationships without assuming one universal type system.
steps:
  - number: "19"
    title: Operations join existing facts
    id: operations-join-existing-facts
  - number: "20"
    title: Fitting outcomes propagate
    id: fitting-outcomes-propagate
  - number: "21"
    title: Equality layers a truth result
    id: equality-layers-a-truth-result
  - number: "22"
    title: Fold is an ordinary concept
    id: fold-is-an-ordinary-concept
---

Opaque projections gave us independent producers, repacked flow, and fitting
answers that preserve Unknown, None, or an admitted Pack. We can now ask how an
operation combines those facts without inspecting either participant or adding
another method to a universal object.

The answer is a layered **operational join**. The operation retains the exact
participants and derives only the relationship it owns. It remains a real
semantic subject that can be queried again when either participant offers a new
projection.

## Operations join existing facts

Suppose one operation relates a Target Abstract to a Source Abstract. Each owns
its own concepts and may expose value flow through a Pack. The operation does
not copy either participant into an operation-specific node model.

```text
Operational join
├─ Target Abstract
└─ Source Abstract
```

The join asks whether the Source flow fits the structure accepted by Target.
That question is current and directional. The operation keeps both identities
regardless of the answer, so another observation can ask again without
invalidating a retained selection.

This is the same layering principle introduced by Addressable. The join remains
interrogable because it owns a real relationship. It may delegate a successful
semantic question to Target or return Source flow, but it is not a transparent
Alias and cannot be unwrapped to bypass its admission rule.

## Fitting outcomes propagate

The fitting answer determines the join's current projection:

```text
Target.fits(Source)
  → Unknown      Join remains Unknown
  → None         Join propagates None
  → fitted Pack  Join may delegate to Target and expose fitted Source flow
```

Unknown does not become rejection. None does not fall back to Unknown. A fitted
Pack does not become proof that Source and Target are the same semantic object.
Each result preserves exactly the evidence established by fitting.

When a consumer asks for the admitted flow, the join asks the caller's Context
to retain the fitted Source Layout as another Pack snapshot. The Pack continues
to identify the actual Source producers. Target contributes admission policy,
not replacement values.

This is **conditional propagation**. It shares the useful shape of Alias
forwarding while remaining a layered operation with its own observable
contract. Initialization can later use this construction to relate requested
output meaning to supplied flow without making either participant own the
other.

## Equality layers a truth result

Equality is another operational join. It retains two source flows, negotiates
whether they belong to one comparable domain, and projects a truth-valued result
only when that admission succeeds.

```text
left flow + right flow
          ↓ comparable
      Equality
          ↓
   truth-valued Pack
```

Equality does not semantically depend on Initialization. Both operations reuse
the same pattern: retain exact participants, propagate the fitting outcome, and
add only the result relationship owned by the operation.

If compatibility remains Unknown, the Equality result remains Unknown. If the
relationship is rejected with None, Equality propagates None. Once admitted,
the operation can expose its truth domain without converting either operand
into that domain.

The producer of the result is Equality itself. The operands remain its exact
inputs, while the output Pack contains the value produced by this operation.
That separation lets a formatter retain the authored comparison, an editor
explain both inputs, and a consumer use the truth result without rebuilding the
comparison from metadata.

## Fold is an ordinary concept

Now ask whether one operational result can become immutable evidence. A consumer
should not inspect literals, expressions, aggregates, or foreign values to
decide whether their producer is complete.

It asks one ordinary question: `fold`.

1. Query every semantically reached input for `fold`.
2. Negotiate whether each answer proves Constant.
3. Preserve Unknown when an input remains provisional.
4. Recognize exact None as proven non-foldability.
5. Treat another non-Constant answer as unrelated or currently non-folded.
6. Continue only after every required input proves Constant.
7. Let the concrete domain derive one immutable result.

A Constant answers its own fold query with itself. Another Dialect can support
the same protocol without modifying Equality, hover, or the consumer that asks
for the result.

For Equality, two current Constant inputs allow the owning domain to emit
`Constant(True)` or `Constant(False)`. Empty, scalar, named, and multi-value
domains may instead emit one aggregate Constant representing their complete
flow. Fold prescribes the evidence boundary, not the value domain.

Before reusing a folded value, the operation requeries its reached inputs and
compares their exact Constant identities. This is the local form of the
Constant closure introduced in Factual uncertainty.

Folding and constant evaluation are therefore not separate semantic graphs.
`fold` asks for the immutable projection. Constant evaluation is the proof that
every fact needed by the current request has reached Constant.

<details class="documentation-insert">
  <summary>
    <span class="documentation-insert-label">Technical note</span>
    <strong>Partial behavior has useful precedents</strong>
  </summary>
  <div class="documentation-insert-content">
    <p><a href="https://hazel.org/papers/hazel-hatra23.pdf">Hazel</a> gives incomplete programs static and dynamic meaning rather than treating every unfinished editor state as meaningless. <a href="https://www.di.ens.fr/~cousot/COUSOTpapers/POPL77.shtml">Abstract interpretation</a> formalizes useful approximations of program behavior.</p>
    <p>TTX shares the insistence that partial information can remain meaningful, but it does not force every concept into one global lattice or one universal approximation relation. Operational joins propagate the answer supplied by each owner rather than interpreting Unknown, None, and Constant as one universal state machine.</p>
  </div>
</details>

Operational joins now explain how behavior can arise from layered relationships
without assuming a type system. The next chapter applies that construction to
Types, initialization, optional values, and control flow to show how a concrete
language can derive a coherent type system without making it part of TTX.

### Key takeaways

- Operations retain their real participants instead of copying them into a
  central operation model
- Unknown, None, and fitted Packs propagate without losing their distinct
  meanings
- Equality and folding can extend the graph without inspecting concrete
  producer kinds

### Common pitfalls to avoid

- Operations collapse fitting into Boolean admission
- Completed rejection is laundered back into Unknown
- Const evaluation becomes a second interpreter
- Concrete kind switches decide which producers participate in behavior their
  real owners could have answered directly

### Normative contracts

- [TTX semantics: Open concept negotiation](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#open-concept-negotiation)
- [TTX semantics: Layout](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#layout)
