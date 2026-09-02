---
layout: ../../../layouts/DesignLayout.astro
title: Opaque projections
description: Packs carry real producers while immutable Layout projections expose useful shape without revealing the machinery that derived it.
steps:
  - number: "12"
    title: One value keeps its producer
    id: one-value-keeps-its-producer
  - number: "13"
    title: Packs reflow independent values
    id: packs-reflow-independent-values
  - number: "14"
    title: Layouts expose opaque structure
    id: layouts-expose-opaque-structure
  - number: "15"
    title: Context retains query-time projections
    id: context-retains-query-time-projections
  - number: "16"
    title: Layout families preserve different promises
    id: layout-families-preserve-different-promises
  - number: "17"
    title: Fitting composes element proofs
    id: fitting-composes-element-proofs
  - number: "18"
    title: Bundled operations synthesize flow
    id: slice-and-swizzle-synthesize-flow
---

Now that we understand the Abstract model and how semantic owners compose, we
can look at how TTX preserves those boundaries when data begins to flow. If
Abstract, Alias, Addressable, or Interface negotiation still feels unsettled,
[Factual uncertainty](/docs/Design/a-living-graph/) develops the foundation this
chapter assumes.

The derivation proceeds in four stages. We first preserve one producer while
separating semantic identity from value flow. We then reflow several independent
values into one Pack. Next, a consumer negotiates that multi-value flow through
opaque Layouts without learning how any entry was produced. Finally, operations
such as Slice and Swizzle synthesize new flow from those same projections.

Each stage depends on the preceding chapters. Semantic ownership keeps every
value attached to its real owner. Factual uncertainty lets each relationship
remain partial without turning the complete flow into null or failure.

## One value keeps its producer

Begin with one value named `red`. It may come from field access through an
Addressable, a Constant, a function result reached through an Alias, or another
producer that has not been designed yet.

Suppose another operation needs to receive `red` as a value. Translating it into
a new value record would recreate the copy problem. Passing its owner alone
would leave two questions entangled: whether that identity can participate as a
value and whether it is actually flowing into this operation.

The producer can answer one total question instead: which semantic value domain
currently describes it? We could model that relationship as another named
concept route. It would preserve owner-directed resolution, but every value-flow
consumer would then depend on one spelling and repeat the same answer contract.

TTX promotes this common relationship into the first-class **Domain** protocol.
That gives every Abstract one total `resolve_domain()` route with the same
factual answer vocabulary used throughout the graph:

- Unknown while the relationship is indeterminate
- None when the owner proves that no Domain relationship exists
- One exact Abstract as the established Domain

Because type systems often answer a similar question, promoting Domain can look
like the first step toward a universal type hierarchy. That interpretation would
add relationships the protocol never asked for. `resolve_domain()` establishes
only where an Abstract currently participates in value flow. It says nothing
about parentage, subtyping, storage, construction, or another language's policy.
When a Domain answers the route with itself, it closes that one question rather
than declaring itself a root type. Recursive value shapes can therefore refer
through other Domains as ordinary graph relationships, and every observation
continues to preserve Unknown, None, or the exact answer currently established.

The Domain answer does not create value flow or prove how many values exist. An
owner may know that one producer position exists while its Domain remains
Unknown. None proves that the identity has no value Domain and therefore cannot
occupy a Pack position.

We can now ask whether `red` participates in a value Domain, but that still does
not say that it is flowing into this operation. Using the Domain answer as a
flow marker would conflate capability with one current event. Giving the flow a
new semantic identity would recreate the copied owner we removed in Chapter 1.

The smallest remaining contract is therefore an identity-free carrier that
keeps the exact producer. TTX calls that carrier a **Pack**. Begin with the
smallest possible Pack: one producer contributing one value.

The first separation is small but important:

```text
semantic owner              produced flow
red producer ─────────────> one-value Pack
```

Because the Pack carries no semantic identity, `red` remains owned by its
producer while participating in the current flow. The Pack records that exact
Abstract as one value without copying it, unwrapping an Addressable or Alias, or
replacing the producer with a tuple entry.

As a result, another consumer still reaches the real owner, and a later
observation may follow the Addressable or Alias again rather than inheriting a
result frozen by the first consumer.

## Packs reflow independent values

Now add `green` from a complex expression and `alpha` from a function result.
The three values have unrelated semantic owners, but another operation wants to
consume them together.

We could materialize a tuple-like object to hold them. That would give the group
another semantic owner, force a concrete aggregate Domain, and translate each
producer into the aggregate's representation before any consumer asked for one.
The one-value Pack already contains the relationship we need. It can compose
several flows without materializing a new value.

```text
Pack(red producer) ──────┐
Pack(green expression) ──┼──> Pack(red, green, alpha)
Pack(alpha result) ──────┘
```

TTX calls this **repacking** or **reflowing**. One Pack composes flow already
supplied by other Packs while every position continues to identify its real
producer, leaving the grouped Pack without an aggregate Domain or semantic
identity of its own.

The combined flow will need to preserve facts such as order, repetition, or
route mapping without turning them into a consumer-owned producer model. At
this stage, the Pack answers only which producers currently flow together.

With the complete multi-source case established, the remaining problem belongs
to the consumer. How can it inspect and negotiate that flow without learning
the private model behind every entry?

## Layouts expose opaque structure

A consumer may need to ask whether the flow contains three values, whether
their current relationships satisfy one receiving policy, or whether routes can
reorder them. Exposing a vector of producer records would make the consumer
reconstruct order, naming, repetition, and composition for itself while also
revealing that red came through an Addressable, green came from an expression,
or alpha crossed an Alias.

Answering that question earns the next identity-free contract. Every Pack
projects a **Layout** from the structure of its current flow, while a Domain can
project the Layout accepted by values participating in that semantic domain.
Neither projection reveals the private machinery that established its shape.

The Layout has no semantic identity of its own, but its entries still borrow the
exact Abstracts whose current relationships establish the shape.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-diagram rabbit-pack-diagram" role="img" aria-label="A Pack borrows exact producers while its Layout exposes only their current shape">
  <div class="diagram-panel accent-panel"><small>Exact producers</small><strong>Pack</strong><span>(red, green, alpha)</span></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel accent-panel"><small>Projected producer shape</small><strong>Layout</strong><span>[red, green, alpha]</span></div>
</div>

The notation makes this separation visible: parentheses group the producers
supplied by a Pack, while brackets describe only their projected Layout shape.
When two Layouts expose the same outer shape, they have established only enough
structure to align their entries. Each aligned pair must still negotiate its
own proof before the complete flow can be admitted. Visibility, documentation,
and field policy therefore remain with their semantic owners, while target
offsets, storage classes, and calling conventions remain with the boundary
representation that eventually needs them.

By exposing only that structure, Layout becomes an enabling firewall through
which the owner can answer another consumer without revealing the contract
machinery used to derive it.

Preserving that boundary gives us several reviewable consequences:

- A Layout is a fresh immutable projection, never retained semantic owner state
- Unknown entries, extents, names, and relationships are useful partial shape
- A later query returns another Layout rather than completing an earlier one
- Each concrete Layout preserves only the structure it can honestly promise
- Generic consumers negotiate with the Layout instead of inspecting its owner
- Matching shape never proves semantic identity or completed admission
- Offsets, storage classes, calling conventions, and reconstruction records
  belong to boundary representations rather than Layouts

Hiding that machinery is what lets the Layout remain useful across consumers. A
consumer can depend on the established shape while the producer remains free to
derive it from field tables, parser state, lifecycle policy, or another future
implementation. Exposing any of those choices would make them part of the
consumer's contract, turning one factual projection into a dependency that both
sides would have to preserve.

Layout therefore protects the Interface boundary rather than replacing it.
Structural similarity cannot prove that two producers implement the same
behavior or belong to the same semantic domain. Richer compatibility still
requires explicit Interface negotiation between the real Abstracts.

## Context retains query-time projections

A projection still needs storage even though it must not become another graph
identity. Letting the semantic producer retain every projection would turn
immutable answers into growing owner state. Returning borrowed temporary storage
would make the answer expire before its consumer finishes using it.

The caller therefore supplies a `Context` as the lifetime owner for query-time
flow. An owner constructs one Layout from the facts it can currently establish,
then asks `pack(layout)` to retain the corresponding immutable Pack snapshot for
the Context lifetime.

Context admits a Pack only when the Layout can enumerate its complete
cardinality. The entries may still be Unknown because the Layout owner can prove
that those positions exist. An Unknown extent cannot become a Pack because no
value flow can yet be enumerated.

Once a Layout is admitted, Context performs only the mechanical work needed to
keep that observation usable: it copies the projected support values and shape
for the caller while continuing to borrow the real Abstract identities that
produced the flow. Another query may retain a newer snapshot, but nothing has to
complete, synchronize, or rewrite the first one.

That snapshot boundary determines what Context must leave with the graph. If it
resolved names, evaluated concepts, owned source identities, or followed later
changes, it would become a second authority responsible for keeping its answers
alive. Query-time data flow would then converge on an execution choke point and
the Pack would become another dead representation waiting to be refreshed.

By stopping at lifetime retention, Context lets TTX queries communicate through
the same Pack and Layout flow available to every consumer. No host-only result
container is needed between the semantic owner and the caller.

## Layout families preserve different promises

We now have an identity-free projection and a caller-owned lifetime for it. The
next question is which structural promises that Layout can make without
exposing how its producer stores, computes, or discovers the values. One generic
list of optional fields would move that machinery into the representation.
Repeated flow would be expanded, names would appear on every entry, nested
groups would be flattened, and partial mappings would need sentinel indexes.

We can therefore derive each family with one test: add a structural promise
while leaving the mechanism that established it with the producer. Working
through those promises in order produces the Layout family without first
inventing a collection taxonomy.

### Value promises one producer

Begin with a Pack carrying the Constant `4`. Replacing the Constant with its
Domain would answer a different question and discard the exact producer
identity. Copying the number would be worse: the Layout would become another
value representation.

`Value` promises only that one exact producer contributes one value:

```text
Value(Constant(4))
```

The entry remains `Constant(4)`, not its numeric storage and not the Domain that
currently describes it. A consumer that needs the Domain negotiates that
question with the producer. `Value(Unknown)` is also meaningful when the Layout
owner independently knows that one slot exists but cannot yet establish its
producer. Unknown supplies no cardinality, while the Value owner supplies the
fact that there is exactly one entry.

None needs no equivalent Layout because it proves semantic absence, whereas
Value proves one position in value flow. Having isolated one producer, we can
now ask how the same promise survives when that value repeats.

### Ranged promises repetition and extent

Expanding repeated values into separate entries would imply that the producer
has already materialized each value and would discard the fact that they all
follow one promise.

`Ranged` retains one producer relationship and one extent:

```text
Ranged(Constant(4), Constant(3))
```

The projection promises three values following the `Constant(4)` relationship.
It says nothing about whether the producer uses an array, linked list,
generator, or completely synthetic operation. The extent is itself an Abstract,
so `Ranged(Unknown, Constant(3))`, `Ranged(Constant(4), Unknown)`, and
`Ranged(Unknown, Unknown)` preserve whichever side of the promise is currently
factual.

An Unknown extent does not enumerate as zero entries. Zero would be a completed
cardinality fact. The Ranged Layout remains useful as partial structure, but it
cannot back a Pack until its extent becomes usable.

The consumer can therefore negotiate the repeated form without acquiring an
indexable container or the producer's iteration machinery. That works while
every position follows the same relationship. Independently established
positions require another promise.

### Fluid lets entries settle independently

What if the flow contains several independently established values whose
producer relationships may differ?

`Fluid` preserves one ordered sequence of producer answers:

```text
Fluid[red-producer, Unknown, alpha-producer]
```

Each entry may become factual independently. The Layout owner proves that three
positions exist and that the first and third producers are known. Unknown says
nothing about the middle producer beyond its indeterminacy.

Retaining those answers in Fluid avoids materializing a tuple Domain or
aggregate value. The consumer can now negotiate several producer relationships
at once, but position still binds consumption to the order in which the
producer generated them.

### Named separates routes from generation order

A map-like producer would therefore have to promise a stable order or retain a
sidecar sequence solely for consumers.

`Named` layers a second Layout of route metadata over one value Layout. Both
projections preserve the same structure:

```text
values = [A, B, C]
routes = [Unknown, Constant(".r"), Constant("Width")]
```

The route entries are Abstracts, so naming can remain partial without adding a
nullable field to every value entry. Every Layout can provide the matching base
projection by returning Unknown at each established position. Named contributes
more factual route producers where its owner knows them.

A consumer asks the Layout contract for its `named` projection, keeping the
query between Layouts rather than introducing an Abstract concept or casting to
a concrete family. Its route metadata consequently follows the same partial
projection and layering rules as the values it describes.

These names are borrowed byte routes, not necessarily readable text. They obey
the same route rules established for concepts. A consumer can match
`Constant("Width")` without assuming that the producer stores or discovers that
value second. The order in which a Named Layout visits established routes has no
semantic weight because matching uses each complete route.

Named leaves value structure with the underlying Layout and layers route
metadata through the same projection machinery. Route selection removes the
dependency on generation order, but it still says nothing about whether several
entries must resolve together.

### Composite preserves coupled groups

Repacking can place the same four producers into either of these shapes:

```text
((A, B), (C, D))
(A, B, C, D)
```

A flat sequence cannot distinguish them. That difference matters when the
members of one group must be admitted together. Suppose `(A, B)` describes one
record-like value and `A` remains Unknown. Exposing `B` as independently fitted
would pretend that the group relationship had already settled.

`Composite` retains child Layouts so the structural negotiation developed next
can treat each child as one coupled segment:

```text
Composite(Fluid[A, B], Fluid[C, D])
```

Flat entry matching cannot establish this promise because it cannot distinguish
the nested form from its flattened entries. Composite records that the
corresponding child group must settle as a unit.

When the next section negotiates an unsettled first child, its partial result
can preserve the known outer shape without leaking admission from within that
child:

```text
Composite(
  Fluid[Unknown, Unknown],
  Fluid[C, D],
)
```

Masking `B` within the unsettled child records that the consumer has not yet
established the group containing `A` and `B` rather than claiming that `B`
ceased to exist. Composite preserves that boundary without exposing the concrete
owner.

By accepting any two Layouts while preserving their order and separate
negotiation boundaries, `Composite(left, right)` closes Layout composition.
Nesting Composite therefore lets Value, Ranged, Fluid, Named, and other
Composite projections mix in one structured tree without flattening into a
universal entry record.

Once every established Layout can compose this way, one structural problem
remains. An operation may want to extract entries from anywhere in that tree and
expose them through a new ordering without materializing the selected values or
discarding the source projection.

### Reindexed records a completed remapping

Materializing reordered values would create another aggregate. Retaining
authored names and resolving them on every structural query would instead leak
the selecting operation into the Layout.

`Reindexed` records one completed mapping over one immutable source Layout:

```text
Reindexed(source-layout, [0, 0, 3, 1, 3])
```

Recording the mapping rather than the reordered values provides the structural
analogue of transparent forwarding: consumers observe remapped flow without
acquiring the representation that selected it. Because the selecting owner
publishes only after every mapping entry becomes factual, Reindexed need not
understand names, perform delayed lookup, or encode Unknown with a sentinel
index.

Composite and Reindexed complete the same kind of layering that Addressable
introduced for semantic owners. Composite preserves and extends a structural
base, while Reindexed retains that complete base and projects an arbitrary view
over it. Both results remain ordinary Layouts, so they can wrap, compose, and be
reprojected again without exposing the machinery beneath them.

The same derivation has a zero-value case. An empty Layout completely promises
that no value flows without introducing a special semantic identity, and no
generic consumer needs to discover which family produced a projection.

The remaining question is how a receiving owner can negotiate these promises
without switching over their concrete families or reducing the answer to a
Boolean.

## Fitting composes element proofs

The receiving owner can now ask whether actual source flow satisfies the
relationship it accepts. That question initially sounds like a predicate: does
this Pack fit this Layout? A conventional API would likely call that predicate
`fits` and return true or false.

That answer works only when the relationship has settled and success requires
no evidence beyond “yes.” Neither assumption holds here: the relationship may
remain unsettled, while admission must preserve the actual producer mapping.
Fitting therefore joins one source Pack, one receiving Layout, and the caller's
Context to return the most factual structural evidence currently available:

```text
fit(source Pack, receiving Layout, caller Context)
  → Unknown       The relationship is indeterminate in this observation
  → None          The receiver proves completed rejection
  → fitted Pack   The receiver preserves the admitted structural evidence
```

### A Pack proves the relationship through Layout

Rather than carrying a second declared schema for fitting, each Pack asks its
real producers to project the relationship required by the current operation.
A source may be asked for readable flow while a target is asked for writable
flow, and each side preserves the Value, Ranged, Fluid, Named, Composite, or
Reindexed structure appropriate to that request.

Once both sides enter the Layout domain, their concrete Layout families align
the corresponding positions and ask each pair for one shared proof. Depending
on the participants, fitting reuses the same proof vocabulary established so
far rather than inventing a fitting-specific category. The proof may come from
exact Domain identity, complete axiomatic evidence supplied by a Constant, the
current spot-resolved referent projected transparently through an Alias, or a
projection enriched or attenuated by Addressable layers. An Interface can
establish another shared relationship without requiring either side to expose
its concrete owner. Unknown preserves an element whose proof is indeterminate
in this observation, while None proves that the pair has no admitted
relationship.

A fitted result reflows the source positions into the receiving shape and asks
Context to retain that Pack. Its Layout preserves the established alignment and
any Unknown positions, while its known entries continue to identify the real
producers admitted by the operation.

The same construction lets one Pack receive another without giving either
Pack semantic identity. For a hypothetical assignment flow, the source values
project their readable Layout while the target Addressables construct the
Layout accepted by their write policy:

```text
source values Pack      → readable producer Layout
target Addressable Pack → write-policy Layout

fit(source values Pack, write-policy Layout, caller Context)
  → Unknown | None | fitted source Pack
```

The write policy has already participated by the time fitting sees the target
Layout. It may expose the target's full receiving shape, preserve a Composite
boundary, or return Unknown while one required proof remains indeterminate. A
non-writable target whose layers have completed their delegation contributes
None instead of a receiving Layout, so the assignment cannot accidentally fit
first and bypass policy afterward.

Changing which Pack constructs the receiving Layout changes the question rather
than providing another view of the same assignment. Asking the source values to
receive the target Addressables may produce an entirely different answer, while
an admitted result can still contain Unknown in individual slots whose
positions are already established. In either direction, the fitted snapshot
preserves the producer mapping without storing the relationship in an input
Pack or revealing the concrete machinery behind either flow.

### Policy gives the same flow different meanings

Readability and writability demonstrate why policy must participate in Layout
construction. A readable projection may expose an Addressable's complete value
Layout when its visibility layer permits that observation, yet the same
Addressable may produce None when asked for a writable receiving Layout. The
fitter does not contain branches for visibility, constness, or another
language's policies. It only composes the projections those owners provide.

The bundled TTX languages use that freedom to make `const` a compile-time
promise rather than a runtime location with its write bit disabled. Consider a
constant declaration:

```ttx
const var = 5;
```

The declaration cannot supply a writable Layout, but that does not make its
initialization invalid. Its initialization policy constructs a receiving Layout
that asks each source element to prove Constant, while the Pack containing
`Constant(5)` projects the matching proof. Fitting admits that flow for this
request even though an ordinary write request against the same declaration
would receive None.

Nothing in the common model needs to define a “constant context.” The compiler,
declaration, and source producers establish that meaning by the policy-specific
Layouts they construct, applying the same principle introduced in
[Background](/docs/Design/#a-boundary-carries-its-history): semantic work done
for tools remains valuable even when it does not describe runtime execution.
[Folding](/docs/Design/emergent-behavior/#fold-is-an-ordinary-concept) uses Pack
flow in the same way while owning its own request and evidence instead of
inheriting assignment or initialization policy.

The zero-value case follows the same cardinality rule. When a Pack owner proves
that no producers participate, Context can retain the Pack with the empty Layout
`[]`. A receiving empty Layout admits that flow because both sides establish the
same zero cardinality. Nothing in that agreement explains why the edge is empty,
so meanings such as Void, null, or unreachable control must come from a
receiving concept that actually owns them.

Unknown never implies `[]`. Deriving an empty Pack from Unknown would claim that
the flow contains exactly zero values, which is new evidence and therefore an
invalid elimination. If an owner knows that one provisional value exists, it
can project `[Unknown]`. If it knows only that the result is repeated flow, it
can project `Ranged(Unknown, Unknown)`. In both cases the owner supplies the
surrounding structure, leaving Unknown to express only the cardinality or
producer fact that remains unsettled.

<details class="documentation-insert">
  <summary>
    <span class="documentation-insert-label">Technical note</span>
    <strong>Partial shape is not completed flow</strong>
  </summary>
  <div class="documentation-insert-content">

The Unknown Abstract has no Pack operation and provides no elimination into
value flow. A rule `Unknown → []` would be unsound because the empty Layout
proves an exact cardinality of zero.

A Layout owner may still surround Unknown with independently established
structure. `Value(Unknown)` proves one position. `Fluid[Unknown, A]` proves two.
`Ranged(Unknown, Constant(3))` proves three repeated positions. Each can support
an enumerable Pack because its owner, rather than Unknown, supplies the complete
cardinality.

`Ranged(A, Unknown)` is different. It proves repetition but not how many values
currently flow. That Layout remains useful for structural negotiation, but its
owner cannot ask Context to retain a Pack from it. Treating a zero-entry visit as
its Pack would collapse unknown cardinality into completed empty flow.

When the extent later becomes usable, the real owner constructs another Ranged
Layout and asks Context for a fresh Pack. The partial Layout remains an immutable
statement about its earlier observation.

  </div>
</details>

This distinction later lets a control-flow owner give different meanings to an
edge carrying `[]` and an edge carrying values without assigning either policy
to Layout. We now have enough of the host-neutral projection model to see how a
concrete language can build operations over it.

<p class="design-section-eyebrow">Top-down construction · bundled TTX Dialects</p>

## Constructing bundled Slice and Swizzle

Having worked bottom-up from each constraint to the smallest host-neutral
contract that preserves it, we can now reverse direction. The shared TTX lexicon
already gives the bundled Dialect family two authored operations, so we can
start from their user-facing promises and work downward to the contracts needed
to implement them.

The operator spellings still belong entirely to those concrete languages.
Abstract has no Slice or Swizzle operation, and neither spelling applies to an
arbitrary graph participant. The exercise asks whether a language owner can
implement its own feature using Domain, Pack, Layout, Context, and fitting
without adding that feature to the host-neutral model.

### Constructing Slice (`:[`)

The Library Dialect offers two safe value-selection forms:

```ttx
value:[index]
value:[start, count]
```

The scalar form promises one selected value. The ranged form promises exactly
`count` values that share the receiver's element relationship. Library later
defines how a missing element is initialized, but that policy does not change
the structural obligation established here: a range cannot produce a Pack until
its count becomes an enumerable cardinality.

Those promises identify the two providers needed by the output Layout. The
receiver supplies the current element relationship through `resolve_domain()`,
while the authored count supplies an extent provider whose answer may remain
Unknown or later become an enumerable Constant. Slice retains both providers and
composes them without becoming the repeated Layout entry:

```text
element = value.resolve_domain()
extent  = extent-provider

scalar layout = Value(element)
range layout  = Ranged(element, extent)
```

Before either provider settles, the range still has its minimum structural
promise:

```text
Ranged(Unknown, Unknown)
```

The first Unknown comes from `value.resolve_domain()`, while the second comes
from the extent provider. Neither requires Slice to manufacture a provisional
value or copy a count into Layout representation.

As each provider establishes more information, the same construction raises its
certainty without changing its structure:

```text
Ranged(Unknown, Unknown)
Ranged(U8, Unknown)
Ranged(U8, Constant(4))
```

No conditional recovery path produces the first projection. When `value` is
Unknown, its total Domain answer is already Unknown, and composing that answer
with the extent provider naturally produces `Ranged(Unknown, extent)`. A later
observation runs the same construction and receives a more factual Domain
answer. Unknown propagation is therefore inherent in the provider composition
rather than an exceptional state that Slice must eliminate or repair.

The range cannot produce a Pack while the extent remains Unknown because no
enumerable flow exists yet. Once the provider resolves to `Constant(4)`, the
Ranged Layout can supply four element relationships and Context can retain the
resulting Pack. Ranged never needs to know how the extent provider reached that
answer or how Library selects and initializes the concrete values.

Starting from the concrete Slice contract has therefore required no Slice
category in the host-neutral graph. Its language owner coordinates ordinary
providers, while the values enter Layout through their Domain relationship and
become Pack flow only after the extent can be enumerated.

### Constructing Swizzle (`.[`)

Swizzle begins from a different authored promise. Given a receiver with named
value flow, Library lets the user select, repeat, and reorder those values:

```ttx
ttx [.r : U8, .g : U8, .b : U8, .a : U32]
```

```ttx
color.[r, r, a, g, a]
```

The result is one positional Pack over the real selected producers. Repeated
routes repeat a producer, authored order determines output order, and Swizzle
does not materialize an aggregate Domain merely to hold the result.

The receiver may implement its Domain Layout as an ordered structure, a compact
range, a hash-oriented map, a composition of several children, or a completely
synthetic projection. Making Swizzle enumerate that concrete model would force
every representation to support the same traversal strategy and would turn its
current ordering into Swizzle state.

Swizzle asks for the Layout's `named` projection instead. That route metadata is
itself a Layout, so each producer can preserve its own optimization while
exposing only the routes it currently knows. A compact source remains compact,
a map can retain route-oriented lookup, and a synthetic source can derive its
answers on demand.

Working downward from that behavior begins with the authored selection count,
which establishes five output positions even when none of their routes resolve.
The minimum projection can therefore preserve repeated shape immediately:

```text
Ranged(Unknown, Constant(5))
```

Because each route settles independently, Swizzle can replace that wholly
provisional shape with a Fluid Layout that preserves every established
producer:

```text
Fluid[red-producer, red-producer, Unknown, green-producer, Unknown]
```

Each resolved source index remains meaningful only for the immutable receiver
Layout from which it was selected. Once every route names one unique entry,
Swizzle can therefore retain that source snapshot and publish the complete
mapping as Reindexed:

```text
Reindexed(receiver-layout, [0, 0, 3, 1, 3])
```

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-layout-sequence" role="img" aria-label="Swizzle projections progress from unknown ranged shape through partial fluid shape to a complete reindexed mapping">
  <div class="diagram-panel"><small>Base</small><strong>Ranged</strong><span>(Unknown, Constant(5))</span></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel"><small>Partial</small><strong>Fluid</strong><span>[red-producer, red-producer, Unknown, green-producer, Unknown]</span></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel"><small>Complete</small><strong>Reindexed</strong><span>(receiver-layout, [0, 0, 3, 1, 3])</span></div>
</div>

Reindexed records only the complete source Layout snapshot and established
mapping because Swizzle owns every authored route and resolves it before
publishing. A later query repeats that language-owned work against the current
receiver instead of following a retained name-to-index table.

Both sides consequently keep their preferred optimization almost for free. The
source Layout remains shaped for its producer, while Reindexed supplies the
exact ordered projection Swizzle's consumer requested without requiring either
side to adopt the other's representation or retain a synchronized copy.

The top-down exercise reaches the same compositional payoff as the bottom-up
derivation. Whether a consumer receives Ranged from Slice or Fluid or Reindexed
from Swizzle, it asks the same fitting question without learning which language
operation produced the projection.

```text
Slice   ──> Ranged ───────┐
                         ├──> the same Layout negotiation
Swizzle ──> Fluid/Reindexed┘
```

Slice and Swizzle began as concrete Library features and remained concrete
throughout the construction. Slice composes resolvable Domain and extent
providers into value flow, while Swizzle projects a consumer ordering over a
source optimized for an entirely different concern. Their ability to reuse the
common model without entering it as universal operations is the practical result
of the firewall. The next chapter derives broader language behavior from
operational joins over the same projections.

<details class="documentation-insert documentation-insert-advanced">
  <summary>
    <span class="documentation-insert-label">Advanced synthesis · optional</span>
    <strong>The identity-free middle prevents semantic regress</strong>
  </summary>
  <div class="documentation-insert-content">

<blockquote>
  <p><strong>“Tetrodotoxin was developed from first principles. Each part of the design began with concrete constraints and was built by construction, allowing the larger semantics to emerge from their composition. The formalization below is my working derivation of that structure, informed by several years of tangential exposure to theory while building in this space. If you can strengthen one of these derivations or connect it to established work, please <a href="https://github.com/tetrodotoxin-dev/Tetrodotoxin/issues">open a design issue</a>. Substantial revisions can grow into a public RFC. None of the notation is required to understand or use Tetrodotoxin.”</strong></p>
  <footer>— Matt</footer>
</blockquote>

**Identity-free projection.** Let `𝒜` contain exact Abstract identities, `𝓛`
immutable Layout projections, and `𝒫_C` the Packs retained by caller Context
`C`. During observation `ω`, an Abstract may project a Pack. Given one
owner-defined relationship `q`, that Pack can ask its producers to construct
the corresponding Layout answer:

$$
\begin{aligned}
\pi^{\mathcal{P}}_{\omega,C}
  &: \mathcal{A} \rightharpoonup \mathcal{P}_C \\
\Lambda_{\omega,q}
  &: \mathcal{P}_C \to \left(\{u,n\}\sqcup\mathcal{L}\right)
\end{aligned}
$$

Pack and Layout remain outside semantic identity even though both borrow real
Abstract handles:

$$
\mathcal{P}_C \cap \mathcal{A} = \varnothing
\qquad
\mathcal{L} \cap \mathcal{A} = \varnothing
$$

Although a consumer may follow a borrowed handle to its real owner, Pack and
Layout cannot themselves be resolved, queried for concepts, or negotiated as
candidate Abstracts. In the codomain of `Λ`, `u` denotes Unknown and `n`
denotes None.

**Policy-indexed fitting.** The request `q` belongs to the participating
operation rather than a universal policy registry. For source Pack `P_S` and
target Pack `P_T`, the operation may choose different relationships for their
respective roles:

$$
S=\Lambda_{\omega,q_S}(P_S),
\qquad
T=\Lambda_{\omega,q_T}(P_T),
\qquad
(L_S,L_T)=(S,T)\quad\text{when }S,T\in\mathcal{L}.
$$

The concrete Layout families establish a structural alignment `m` from target
positions to source positions. If `s_{m(i)}` and `t_i` are one aligned pair,
their owners negotiate element evidence

$$
\eta_{\omega}\!\left(s_{m(i)},t_i\right)
\in
\{u,n\}\sqcup\mathcal{E}.
$$

The evidence set `𝓔` contains the exact proofs admitted by both sides. A
Constant may supply one axiomatically, an Alias contributes its exact referent,
an Addressable contributes its layered projection, and an Interface may retain
a non-binding witness over the original candidate.

Constructing `L_F` preserves Unknown at an established leaf, rejects the
relationship when a leaf returns None, and retains the real source producer
when evidence is exact. The index `i` below ranges over aligned leaves without
flattening Composite boundaries, while `L_F` keeps the receiving structure:

$$
L_F[i]=
\begin{cases}
s_{m(i)} & \eta_{\omega}(s_{m(i)},t_i)\in\mathcal{E} \\
u & \eta_{\omega}(s_{m(i)},t_i)=u
\end{cases}
$$

and the directional fitting result

$$
F_{\omega,C,q_T,q_S}(P_T,P_S)=
\begin{cases}
u & S=u\text{ or }T=u\text{ or alignment is indeterminate} \\
n & S=n\text{ or }T=n\text{ or an element is rejected} \\
\operatorname{pack}_{C}(L_F) & \text{otherwise}.
\end{cases}
$$

The final Pack serves as the witness, but reversing `P_T` and `P_S` requires
another pair of owner-defined relationships, so one successful fit proves
neither symmetry nor transitivity.

**The const construction.** Let `P_a` contain one const Addressable `a`, let
`P_5` contain `Constant(5)`, and let `k` be the Constant proof requested by the
declaration's initialization policy. The same target supports distinct maximal
projections:

$$
\begin{aligned}
\Lambda_{\omega,\mathrm{read}}(P_a) &= L_a
  && \text{when visibility permits} \\[0.4em]
\Lambda_{\omega,\mathrm{write}}(P_a) &= n \\[0.4em]
\Lambda_{\omega,\text{const-init}}(P_a)
  &= \operatorname{Value}(k) \\[0.4em]
\Lambda_{\omega,\mathrm{constant}}(P_5)
  &= \operatorname{Value}(\operatorname{Constant}(5)).
\end{aligned}
$$

Because `η_ω(Constant(5),k)` supplies exact Constant evidence, constant
initialization produces a fitted Pack while ordinary writing remains None. The
distinction comes entirely from the participating policies, not from a
universal constant-context category.

**Provider composition and Pack admission.** For Slice, let `d_ω(v)` be the
total Domain answer from value provider `v` and `e_ω(x)` the current extent
answer. Direct composition preserves Unknown without an exceptional branch:

$$
\operatorname{SliceLayout}_{\omega}(v,x)
=
\operatorname{Ranged}\!\left(d_{\omega}(v),e_{\omega}(x)\right),
\qquad
d_{\omega}(u)=u.
$$

Pack admission adds only enumerable cardinality:

$$
\operatorname{pack}_{C}\!\left(\operatorname{Ranged}(d,e)\right)
\mathrel{\downarrow}
\quad\Longleftrightarrow\quad
d\ne n\;\land\;\operatorname{Enumerable}(e).
$$

Here `f(x) ↓` denotes definedness. Unknown may remain in an independently
established position, while None and an unenumerable extent cannot manufacture
value flow.

**Closure without semantic regress.** Named, Composite, and Reindexed keep
structural work inside `𝓛`:

$$
\begin{aligned}
\operatorname{Named}
  &: \mathcal{L}\times\mathcal{L}\rightharpoonup\mathcal{L} \\
\operatorname{Composite}
  &: \mathcal{L}\times\mathcal{L}\to\mathcal{L} \\
\operatorname{Reindexed}
  &: \mathcal{L}\times\mathcal{I}\rightharpoonup\mathcal{L}.
\end{aligned}
$$

The set `𝓘` contains completed index mappings. Composite preserves grouping, so
reassociation requires explicit evidence. Named adds route metadata without a
storage order, while Reindexed projects a completed selection without
normalizing or copying its source Layout.

Because fitting supplies the third-party relation between the semantic
participants, turning its witness into another Abstract would manufacture a new
participant that immediately required resolution and proof of its own. Keeping
Layout, Pack, Context, Interface, and their witnesses identity-free stops that
regress while borrowed handles continue to lead back to the real owners.

  </div>
</details>

### Key takeaways

- Packs carry exact producers and construct Layout projections from those real
  relationships rather than retaining an independently authored schema
- A Pack's projection depends on the relationship requested by the operation,
  allowing visibility, writability, Constant, Alias, Addressable, and Interface
  evidence to participate without becoming Layout policy
- Fitting aligns the two Layout structures, negotiates one shared proof for
  every corresponding element, and retains the admitted source producers as
  its witness
- Unknown, None, and a fitted Pack distinguish indeterminate, rejected, and
  structurally admitted relationships without collapsing them into a Boolean
- Partial Layouts preserve useful structure before cardinality settles, while
  Context retains Packs only for enumerable flow
- Composite and Reindexed let producers and consumers preserve independently
  optimized structure without flattening or copying it
- Total Domain and extent providers propagate Unknown through ordinary
  composition rather than exceptional recovery
- Concrete language operations such as Slice and Swizzle can expose partial
  results without becoming host-neutral Abstract operations

### Common pitfalls to avoid

- Treating a Pack's Layout as one context-free or independently authored schema
  prevents policy layers from participating and duplicates facts already owned
  by the real producers
- Comparing only outer shape or raw Domain identity skips the per-element proof
  that fitting is meant to establish
- Applying visibility or writability after fitting allows a structurally
  successful result to bypass the policy that should have constructed its
  receiving Layout
- Adding universal read, write, or constant-context categories moves
  language-owned policy into the host-neutral model
- Boolean fitting turns an unsettled negotiation into a premature decision
- Storing a fitting witness in either participating Pack assigns a directional
  relationship to the wrong owner
- Constructing a Pack before its extent becomes enumerable launders unknown
  cardinality into completed flow
- Deriving `[]` from Unknown invents a completed cardinality fact
- Treating `[]` as Void or unreachable state assigns control-flow policy to
  Layout
- Using the Slice identity as its Ranged element hides the receiver's actual
  Domain provider
- Retained Domain answers turn one observation into hidden mutable state
- Branching on concrete receiver kinds before composing their providers turns
  Unknown propagation into an exceptional recovery path
- Enumerating a concrete receiver Layout or retaining Swizzle's name-to-index
  answers forces producer and consumer optimizations into one representation
- Concrete Layout switches make consumers depend on producer implementation
- Sentinel indices encode uncertainty as representation
- Target offsets leak boundary-representation facts into semantic structure
- Optional route fields on every entry turn layered metadata into a universal
  record schema
- Extracting member tables or current selections turns one immutable projection
  into a cache, then a link phase, then another graph

### Normative contracts

- [TTX semantics: Pack](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#pack)
- [TTX semantics: Domain](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#domain)
- [TTX semantics: Layout](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#layout)
- [TTX semantics: Interface](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#interface)
- [TTX semantics: Context](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#host-abi)
- [TTX design: Pack is value flow and Layout is semantic shape](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#pack-is-value-flow-and-layout-is-semantic-shape)
