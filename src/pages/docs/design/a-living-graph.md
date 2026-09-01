---
layout: ../../../layouts/DesignLayout.astro
title: Factual uncertainty
description: How Unknown, None, Constant, and irreversible commitments let incomplete source remain factual without turning the graph into mutable phase state.
steps:
  - number: "06"
    title: Indeterminate is still an answer
    id: indeterminate-is-still-an-answer
  - number: "07"
    title: None proves completed absence
    id: none-proves-completed-absence
  - number: "08"
    title: Constant is an axiom
    id: constant-is-an-axiom
  - number: "09"
    title: Alias makes one referent shareable
    id: alias-makes-one-referent-shareable
  - number: "10"
    title: Layers change what a consumer can observe
    id: layers-change-what-a-consumer-can-observe
  - number: "11"
    title: Constant closure replaces invalidation
    id: constant-closure-replaces-invalidation
---

Return to a name in source code. The parser may already know its spelling,
documentation, and location while the expression that establishes its type is
unfinished. An editor still needs to hover and navigate that name. The compiler
cannot yet pretend that its type is complete.

The owner therefore needs an answer between success and failure. It must publish
everything already factual without guessing the missing fact or discarding the
surrounding declaration.

TTX calls each such answer a **projection**. A projection is an immutable
observation of what one concept can currently establish. Later information can
produce another projection, but it does not rewrite the earlier observation.

## Indeterminate is still an answer

Consider a declaration whose name and documentation are already known while the
expression that should establish its type remains incomplete. The graph cannot
establish one exact type, but it also cannot prove that the declaration has no
type.

Several familiar answers say too much. Null discards the relationship entirely.
An error claims the source has already failed. A mutable placeholder promises
that some later phase will repair this observation in place.

What can the graph truthfully say? The type is indeterminate in this observation.

TTX represents that answer with the shared Abstract `Unknown`:

```text
declaration "pixels"
├─ documentation = "Mutable image storage"
├─ type = Unknown
└─ source Association = pixels.ttx:18
```

Hover can still show the name and prose. Navigation can still reach the
declaration. A graph dump can preserve the unfinished type edge. Returning null
for the whole declaration would erase truthful information because one
question remains open.

`Unknown` does not mean the owner recognized a particular protocol. The default
Abstract concept query returns Unknown for every name it does not understand.
The answer establishes only that the current graph cannot determine anything
more factual for this route.

That restraint cuts in both directions. Unknown preserves the possibility of an
answer without promising that one will ever arrive. The next source transaction
may establish an exact identity, or every future observation may remain Unknown.
Neither outcome would contradict the current answer.

Unknown also records no history. A live route may have produced an exact answer
in an earlier source transaction and become indeterminate after that source was
replaced. The earlier projection remains factual for its observation, while the
current query returns Unknown from the facts available now.

This is the graph's honest “maybe.” TTX does not solve undecidability or require
every semantic question to terminate in certainty. It gives indeterminacy a real
semantic answer so consumers do not have to disguise it as null, failure, or a
promise of later completion.

<details class="documentation-insert">
  <summary>
    <span class="documentation-insert-label">Technical note</span>
    <strong>Unknown has no elimination rule</strong>
  </summary>
  <div class="documentation-insert-content">
    <p>For readers with a type or programming-language theory background, an Interface negotiation that returns Unknown has accomplished nothing as a proof. That is the correct interpretation.</p>
    <p>For one graph observation <code>G</code>, the relation can be sketched as:</p>
    <pre><code>negotiate_G(requirement, candidate)
  → Unknown
  | Rejected
  | Satisfied
  | Equivalent</code></pre>
    <p>These are evidence states rather than truth values. Unknown establishes neither that the candidate satisfies the requirement nor that it fails. Rejected is completed negative evidence for the directional relationship. Satisfied proves that direction, while Equivalent proves the relation in both directions.</p>
    <p>There is therefore no valid elimination from Unknown to the operations required by the contract. A compiler cannot lower through it, a runtime cannot dispatch through it, and category proof cannot manufacture a witness view from it. A consumer that tries to eliminate Unknown is wrong.</p>
    <p>Calling Unknown “absurd” risks importing the wrong type-theory rule. An absurd or empty type has no inhabitant, and an impossible inhabitant permits elimination into any proposition. TTX Unknown is a real identity that permits no such elimination. A closer analogy is a reified neutral or partial observation: it is stable under the queries available now without becoming a <a href="https://arxiv.org/abs/cs/0110028">canonical form</a> witnessing the requested contract. This analogy is local as well—Unknown is graph meaning, not a term in a host type theory.</p>
    <p>For this one relation, a useful local information order is:</p>
    <pre><code>Unknown ⊑ Rejected
Unknown ⊑ Satisfied ⊑ Equivalent</code></pre>
    <p>Rejected remains incomparable with the positive branch. Under an evidence ordering, Unknown resembles bottom because it establishes the least information. Under a possible-outcomes interpretation, it resembles top because every completed outcome remains available. This is only a local reading of one contract. TTX does not require every concept or the complete graph to inhabit a shared lattice.</p>
    <p>The observation <code>G</code> matters as well. A later source transaction creates another observation and may return a different relation. That is not one proof moving backward. Each result remains an immutable statement about the facts available to its own observation.</p>
    <p>Unknown is still useful outside proof elimination. An editor can preserve the requirement, candidate, source relationships, and every other factual projection without issuing a false rejection. A Terminal that requires the relationship to be complete must stop at its boundary. Repeating the negotiation without any new facts has no semantic justification.</p>
    <p>The information-order analogy follows the tradition of <a href="https://doi.org/10.1007/BFb0012801">Scott domains</a>, while <a href="https://www.di.ens.fr/~cousot/COUSOTpapers/POPL77.shtml">abstract interpretation</a> provides a useful language for factual approximations. Neither formalism is the TTX model. In particular, Unknown is not a delayed computation in the sense of <a href="https://lmcs.episciences.org/2265/pdf">Capretta's partiality construction</a>. The TTX query returns synchronously with an explicit indeterminate answer.</p>
    <p>Finally, <code>None</code> and Rejected are related but distinct negative results. None is one Constant Abstract proving completed absence and closes every further concept question over itself. Rejected is the completed negative result of one Interface relation. Unknown provides neither proof.</p>
  </div>
</details>

## None proves completed absence

Unknown already has an unusual property: every route that reaches it remains
there. Its total type answer is Unknown, and every possible concept name resolves
to Unknown. Questions never fall out of the graph, but none become determined.

What would express the same closure while explicitly proving that the answer is
not Unknown?

TTX constructs exactly one other universal resolution fixed point: `None`.

```text
Unknown.resolve_concept(any bytes) → Unknown
None.resolve_concept(any bytes)    → None

Unknown.get_type() → Unknown
None.get_type()    → None

Unknown requirement against None → Rejected
None requirement against None    → Satisfied
```

That final distinction is None's defining proof. None returns itself for every
resolution route, just as Unknown does, while explicitly proving that it belongs
to the None and Constant categories rather than Unknown. The result is one
reachable axiomatic identity in the semantic graph, not a missing pointer and
not an unreachable state.

It is tempting to compare None to `Void`, but that combines different
questions. A function can receive or produce zero values while remaining
perfectly callable. Its invocation returns an empty Pack, and the Pack exposes
an empty Layout:

```text
function result  → ()      empty Pack
result shape     → []      empty Layout
concept answer   → None    proven absence
```

The first two lines describe value flow. No value crosses the boundary, but the
function still executes and its result is fully determined. `Void`, `Never`, or
another unreachable control-flow Type would be a separate language concept.
TTX currently needs no host-neutral identity for it.

None occupies the third line. A concept route reached a real answer, and that
answer proves there is no domain-owned identity to return for the question. This
is why an empty Pack cannot substitute for None and None cannot substitute for
an empty Pack.

Unknown and None therefore preserve opposite facts. Unknown propagates
indeterminacy. None is axiomatic, so every concept name—past, present, or
introduced by a future Dialect—resolves to the same completed absence. None does
not parse those names or predict their protocols. Its construction proves that
there is no underlying subject from which another answer could emerge.

That closure belongs to the exact None identity. A live source route that
selected None in one observation may select another immutable answer after the
source authority changes, just as any live route can. Nothing about the earlier
None answer changes.

The distinction is operationally important:

<div class="grid columns-3 prose-grid">
  <article class="card data-card"><span>Unknown</span><strong>No conclusion</strong><p>The current observation cannot settle the question.</p></article>
  <article class="card data-card"><span>None</span><strong>Absence proven</strong><p>The exact answer proves completed absence.</p></article>
  <article class="card data-card"><span>Constant</span><strong>Reuse this fact</strong><p>The exact answer is immutable for its lifetime.</p></article>
</div>

Suppose an expression is asked for `fold`. Unknown means the current observation
cannot decide whether a folded answer exists. None means the expression
understands folding and proves that it cannot fold. A consumer that collapses
both answers into “no value” either retries without justification or freezes an
indeterminate answer as permanent policy.

## Constant is an axiom

A third answer proves more than completion. A `Constant` is one complete,
immutable terminal graph fact. Once reached, a consumer may treat that exact
identity as axiomatic and reuse work derived from it.

Three properties can look deceptively similar:

- **Carrier immutability** means an object's operations do not mutate it
- **Resolution stability** means asking that object repeats the same identity
- **Axiomatic completeness** means the represented semantic fact is finished
  and may be used as immutable evidence

TTX `Constant` names the third property. It does not merely say that a C object
is immutable or that a query happens to be idempotent.

Unknown has the first two properties. The shared Unknown identity is immutable,
and every resolution route over it constructs the same Unknown answer. That
construction has no premise and supplies no evidence about the question, so it
cannot justify the Constant category. If it did, folding, publication, or
another consumer could treat indeterminacy as a completed fact even though
Unknown has established nothing that consumer can safely act on.

None has all three properties. It is immutable, resolves back to itself, and
provides completed negative evidence. Its self-resolution follows from an axiom
rather than standing in for one.

From those distinctions we can derive the evidence each identity supplies:

- `None` is Constant because proven absence cannot become presence for the
  lifetime of that exact answer.
- `Unknown` is not Constant because repeated construction proves only that the
  answer remains Unknown. Every semantic category the consumer actually asked
  it to prove remains unsettled.

Constant does not mean that the live route selecting it can never change. It
means the selected fact itself will not change.

```text
source route ──today──> Constant A
source route ──after edit──> Constant B
```

Neither Constant migrates. The source authority answers a later query
with another immutable identity.

## Alias makes one referent shareable

Return to a declaration whose initializer is unfinished. The declaration already
has a name, documentation, and source identity, but the exact type it denotes is
still Unknown. Once that type becomes factual, every type question should reach
the real type rather than a copy retained by the declaration.

The graph needs one stable relationship that can conditionally forward those
questions:

```text
definition "pixels"
└─ type → TTX Alias
           └─ target → Unknown
```

TTX calls that relationship the host-neutral **Alias** concept. An Alias derives
one property: transparent forwarding through its current target. It does not
publish an Alias Interface that lets a consumer discover or inspect the
indirection. The name describes what a consumer observes: another route to the
referent, not another public semantic kind.

Every semantic route continues through the target, including when that target
is Unknown:

```text
Alias.resolve()                    → target
Alias.get_type()                   → target.get_type()
Alias.resolve_concept(any bytes)   → target.resolve_concept(any bytes)
Alias.interface(requirement)       → target.interface(requirement)
```

The inability to negotiate “are you an Alias?” is what keeps this relationship
transparent. A consumer may resolve the Abstract it received, but cannot branch
on an Alias category, extract the target, or attach policy to the forwarding
step. If a consumer needs richer meaning, that meaning belongs to another
composed concept.

The target is **spot-resolved** before the Alias retains it. A valid target is
either provisional Unknown or one exact resolved Abstract identity. It is never
another Alias. Alias chains and Alias cycles are therefore impossible by
construction, not cases that traversal must detect or repair.

Alias adds one axiom around that target: a referent must exist. Unknown does not
weaken the promise. It says only that the current graph cannot determine which
Abstract is the referent. The relationship may remain incomplete indefinitely,
but it never becomes null or proves that no referent exists.

This makes Alias a semantic **reference**. A C++ reference makes the same
non-null promise by requiring one concrete object when the reference is
constructed. Alias separates the promise from that construction-time witness.
Its owner may establish the required relationship with Unknown rather than
manufacturing a placeholder object merely to bind it.

Transparency preserves that guarantee. There is no Alias value to compare with
null, no pointer state to inspect, and no explicit dereference operation. A
consumer receives only the answer forwarded from the required referent. While
that answer is Unknown, every forwarded question remains Unknown. Once the
owner determines the exact referent, those same routes continue directly
through that Abstract:

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-diagram rabbit-progression" role="img" aria-label="An Alias conditionally forwards first to Unknown and then to one exact target">
  <div class="diagram-panel"><small>Base forwarding</small><strong>Alias → Unknown</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel accent-panel"><small>Exact forwarding</small><strong>Alias → Texture2D</strong></div>
</div>

Alias therefore recovers reference indirection from graph semantics rather than
memory representation. It guarantees one referent, forbids rebinding after that
referent becomes exact, and forwards without copying. Unknown encodes the
current lack of a witness, not an optional referent. TTX infers no address,
nullable bit pattern, allocation policy, or ownership rule from the reference
analogy.

Those axioms are already enough to support sharing and caching once the referent
is exact:

- **Identity sharing** lets every consumer retain the same referent instead of
  copying its meaning into another model
- **Resolution caching** may reuse that exact referent for the lifetime of the
  Alias commitment without reinterpreting the forwarding relationship
- **Consumer independence** lets editors, compilers, and other Dialects ask the
  referent directly without retaining Alias-specific state

The scope remains confined. Alias does not prescribe a cache, reference count,
process address, or cross-graph identity. It establishes only that this Alias
has one required referent and that an exact referent will not be replaced.

That is the critical mass of Alias: two small axioms make reference sharing and
cache reuse semantically valid without making their representation part of TTX.

One terminology distinction belongs at this boundary. A concrete language may
define a higher-order **definitional alias** that owns an authored name,
documentation, visibility, and the language-specific route locating another
identity. Each observation asks that route again and spot-resolves its answer
before applying TTX Alias forwarding. The declaration is a concrete language
owner, not another shared Alias category. The Generative graphs chapter returns
to the route machinery that lets it remain live.

Alias gives every consumer the same referent and the same observable domain.
That leaves the next question: how can consumers share one referent when they
should not all observe the same meaning?

## Layers change what a consumer can observe

Alias is intentionally transparent, so it cannot change the observable domain
of its referent. Suppose a variable-like name should expose the value it denotes
while also answering whether this particular use can be written. Forwarding
every question to the value loses the write policy. Putting the policy on the
value makes that value responsible for every context in which it might appear.

What we need is a semantic subject that remains present long enough to answer
its own questions, then forwards everything outside its responsibility to the
referent.

This is the first non-axiomatic **layered concept**. TTX calls it
**Addressable**.

The names describe the relationship from the consumer's perspective:

- **Alias is transparent forwarding.** The Alias disappears into its referent,
  so a consumer cannot interrogate the forwarding step.
- **Addressable is an interrogable layer.** The Addressable remains the
  candidate identity while its layers answer, restrict, enrich, or delegate a
  question.

Here, “addressable” means a semantic subject to which questions can be
directed—closer to addressing a person than taking a machine address. Physical
storage, pointer representation, allocation, and ownership remain language or
Terminal facts.

Addressable composes Alias forwarding and enriches it:

```text
Let Y be the referent
Let W answer whether this use is writable

Alias(Y)          → forwards every observation to Y
Addressable(W, Y) → asks W first where W owns the question
                  → otherwise forwards the question to Y
```

Alias(Y) is observationally Y because every question, including Interface
negotiation for Y, reaches Y. Addressable is not itself an Alias. It composes
that forwarding behavior with W while remaining a distinct semantic identity.

Different consumers can now observe the same Addressable through the contract
they understand:

```text
consumer asks about the value       → Y answers through the Addressable
consumer asks whether it can write  → W answers through the Addressable
consumer requires both contracts    → each is negotiated over one Addressable
```

Interface negotiation exposes the operations needed for each contract while
retaining the Addressable as the exact candidate. It does not cast the
Addressable to W or Y, and it does not manufacture copied W and Y declarations.

This changes the possible endpoints of the concept. A **maximal projection** is
one completed answer permitted by a concept's contract, not a claim that the
graph has discovered everything that could ever be known. Alias can reach any
one exact referent. A writable Addressable can reach completed answers that
combine facts from its referent with facts owned by its writable layer.

Layers can also deliberately reveal less. Suppose the same declaration is
passed into two contexts. One may inspect private routes, while the other must
not receive evidence about them. A visibility layer can express that difference
without changing the underlying referent:

```text
restricted_visibility(route)
  → Unknown  when the route is private in this context
  → None     when visibility does not own the route

unrestricted_visibility(route)
  → None     for every route
```

The Addressable interprets those answers before exposing a result. None means
the layer has proven that the question is outside its responsibility, so the
question continues to the referent. Unknown gives the restricted context no
fact it can act on, so forwarding stops:

```text
Addressable(policy, Y).resolve_concept(route)
  policy(route) = None    → Y.resolve_concept(route)
  policy(route) = Unknown → Unknown
  policy(route) = answer  → layer(answer)
```

Returning None for a private route would let fallback reveal the referent's
answer. Returning a fabricated absence would lie about the graph. Unknown
preserves the possibility that an answer exists while proving nothing usable to
the receiving context.

The two policies therefore create different Addressable identities over the
same referent:

```text
restricted address   → private routes remain Unknown
unrestricted address → every route may reach the referent
```

These are separate capability identities. A trusted boundary may pass the
restricted Addressable instead of the full one, but it never mutates one policy
into the other. The restricted holder also cannot negotiate around the filter
to recover the raw referent. Every successful Interface view retains the
restricted Addressable as its candidate and therefore keeps the visibility
layer in the question path.

In object-capability terms, this is **capability attenuation**: an authority that
already has the fuller capability may issue a narrower one, while the narrower
holder cannot reconstruct the authority that was withheld. TTX derives that
behavior from ordinary layered resolution rather than a separate access-control
graph.

<details class="documentation-insert">
  <summary>
    <span class="documentation-insert-label">Technical note</span>
    <strong>Layering changes maximal projection domains</strong>
  </summary>
  <div class="documentation-insert-content">
    <p>A reader familiar with type theory might suspect that Addressable is an intersection type or an <a href="https://dl.acm.org/doi/10.1145/6041.6042">ordinary subtype</a>. A reader approaching from object systems might see a decorator or restricted capability facet. Someone familiar with categorical models of dependent types might ask whether the indexed layers require the stronger structure of a fibration. Each comparison recognizes part of the shape, but each would also add laws that TTX does not claim.</p>
    <p>The construction needs to establish four narrower properties:</p>
    <ol>
      <li>The Addressable remains the exact candidate identity in every negotiated view.</li>
      <li>An enriching layer preserves the referent observations it claims to extend.</li>
      <li>A restrictive layer exposes no inverse that lets its holder recover withheld observations.</li>
      <li>Neither form creates implicit substitution, a transitive subtype relation, or a copied semantic authority.</li>
    </ol>
    <p>We can derive the enriching case as a dependent family. Let <code>M(Y)</code> denote the possible maximal projections of referent Y. For each <code>y</code>, let <code>W(y)</code> contain the valid maximal projections of layer W over that particular answer. The Addressable observations then have the shape of a <a href="https://math.berkeley.edu/~forte/notes/type_theory.pdf#page=5">dependent pair</a>, where the valid second component depends on the selected first component:</p>
    <pre><code>M(Addressable(W, Y)) = Σ (y ∈ M(Y)). W(y)

project_Y(y, w) = y

conservative when every y has at least one valid w in W(y)</code></pre>
    <p>This resembles a dependent sum rather than a Cartesian product because valid W evidence may depend on the selected Y observation. The projection proves that enrichment preserves the underlying observation. It is not an operation exposed to a consumer, and it does not replace the Addressable candidate with Y.</p>
    <p>This is also why the construction is not ordinary subtyping or an intersection type. Interface negotiation proves one requested relationship over one exact candidate. It creates no universal subsumption rule, implicit coercion, transitive inheritance relation, or type constructor <code>W &amp; Y</code>.</p>
    <p>A restrictive layer has a different shape. It maps fuller observations into the evidence available to one authority:</p>
    <pre><code>M(A(restricted, Y))   = reduce_visibility(M(Y))
M(A(unrestricted, Y)) = M(Y)</code></pre>
    <p>No inverse is promised for <code>reduce_visibility</code>. Two fuller observations may become indistinguishable after restriction, and the restricted holder receives no operation for recovering the difference. The restricted-facet analogy from <a href="https://pdos.csail.mit.edu/6.828/2004/readings/miller03paradigm.pdf">object-capability systems</a> is useful here. Addressable is broader because the same layering rule also supports enrichment and semantic Interface negotiation rather than only access reduction.</p>
    <p>The restricted policy can be complete even when its maximal projection contains Unknown leaves. Maximum certainty is relative to the layered contract. The policy has completely determined that this authority receives no further evidence, while Unknown still gives the consumer no fact it can eliminate or use.</p>
    <p>In categorical models, a fibration organizes each <code>W(y)</code> as a fiber over <code>y</code> and provides coherent lifting or reindexing along relationships between base observations. TTX defines neither those relationships nor transport laws for layer evidence. The local dependent-pair analogy is sufficient to state the preservation property without claiming an unproved categorical structure.</p>
    <p>These obligations explain why layering is more general than wrapping. Enrichment adds independently negotiable evidence. Reduction confines observation. Both preserve the candidate identity and both produce fresh immutable projections rather than mutating an earlier answer.</p>
  </div>
</details>

Layering can therefore enrich, reduce, or otherwise transform the completed
answers a concept permits. Each layer defines the questions it owns, the
fallback it preserves, and the maximal projections its authority may expose.
An exact layer does not migrate. Another authority or source transaction
produces another layered identity.

The same referent can now support several immutable observations without any
one of them replacing the others. That raises a practical question: when work
was derived from one observation, what evidence permits reusing it later?

## Constant closure replaces invalidation

Now combine a live route with Constant facts. Suppose an operation queries a
route and receives Constant `A`. It derives Constant `R` from that exact answer.

```text
(machinery M, Constant A) → Constant R₁
```

After an edit, the route selects Constant `B`:

```text
(machinery M, Constant B) → Constant R₂
```

`R₁` remains valid for the exact dependency tuple that produced it. Reuse is
lawful only after fresh queries reach the same immutable inputs. If the tuple is
different, the owner creates another closure.

The route did not become Constant. It remains free to answer differently after
the source changes. Only `A`, `B`, `R₁`, and `R₂` make immutable promises.

This replaces invalidation with comparison. There is no mutable cache entry to
repair and no lease on the source graph. Reuse records only immutable input
identities and the immutable result they produced.

This is **Constant closure**. A live route is free to produce another Constant
on another observation. Every result derived from the first answer remains
closed over the exact immutable tuple that justified it. Folding, Generic
materialization, and Package publication use the same rule at different scales.

With that, we can take a breath. An owner can now answer factually at every
stage, and we have enough of the foundation to reason about the core mechanisms
of a real TTX graph rather than treating Unknown, Alias, and Addressable as
isolated rules.

The next chapter asks how a consumer can use the structure inside those answers
without acquiring the private machinery that established it.

### What this enables

- Incomplete source remains useful to editors and graph tools
- Immutable work can be reused without leases or global invalidation when its
  exact Constant inputs are observed again
- Alias can conditionally forward every semantic route without making each
  consumer unwrap or cache its current target
- Addressable can compose that forwarding with real address-owned layers that
  enrich or attenuate the target's maximal projections
- Empty value flow remains distinct from axiomatic semantic absence

### What goes wrong without it

- Null collapses provisional and absent answers
- Mutable placeholders rewrite old observations
- A cache that records a live route instead of exact Constants needs
  invalidation to keep its stored answer believable
- Treating None as `Void` or an empty Pack conflates concept resolution with
  value flow
- Making Alias negotiable or forwarding only one operation invites every caller
  to inspect the indirection and rebuild policy that transparent forwarding
  deliberately hides
- A layer that cannot project back to the facts it claims to preserve becomes a
  wrapper or shadow authority rather than an enrichment
- A reduced layer that leaks the unrestricted base witness fails its authority
  boundary entirely

### Normative contracts

- [TTX semantics: Projections and certainty](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#projections-and-certainty)
- [TTX semantics: Unknown, Constant, and None](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#unknown-constant-and-none)
- [TTX design: Layered projections](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#layered-projections)
