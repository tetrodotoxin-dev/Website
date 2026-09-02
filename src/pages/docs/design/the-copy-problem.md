---
layout: ../../../layouts/DesignLayout.astro
title: Semantic ownership
description: Why another language, universal node model, or compiler IR cannot by itself keep semantic ownership coherent across an entire toolchain.
steps:
  - number: "01"
    title: How one fact can quickly become many copies
    id: how-one-fact-can-quickly-become-many-copies
  - number: "02"
    title: Identity becomes the integration boundary
    id: identity-becomes-the-integration-boundary
  - number: "03"
    title: Concepts are questions
    id: concepts-are-questions
  - number: "04"
    title: Concepts are not limited to readable names
    id: concepts-are-not-limited-to-readable-names
  - number: "05"
    title: Interfaces negotiate without binding identities
    id: interfaces-negotiate-without-binding-identities
---

Imagine a name in source code that represents something a developer can use. It
might be a variable declaration such as `int color;`, a function, a type, or a
resource from another language.

The source gives the name meaning, but the rest of the toolchain needs to use
that same meaning in several contexts. This chapter follows the conventional
response, finds the ownership problem hidden inside it, and derives a shared
semantic identity without constructing a universal language model.

## How one fact can quickly become many copies

Start with `color`. Several systems need facts about it:

- The parser records its spelling and source location
- The editor wants documentation, hover information, and a definition target
- The compiler needs its type, operations, and value flow
- A Package needs enough durable meaning to reconstruct it without source
- A runtime may eventually need a physical carrier for its values

Each system has a legitimate reason to avoid depending on another system's
private representation. An editor should not need compiler heap objects, and a
Package should not serialize process pointers. The conventional design gives
each consumer a representation shaped for its own work.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-diagram rabbit-copy-diagram" role="img" aria-label="One source name represented separately by the editor, compiler, Package, and runtime">
  <div class="diagram-panel accent-panel"><small>One source meaning</small><strong>color</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="chip-grid rabbit-diagram-stack"><span>Editor symbol</span><span>Compiler node</span><span>Package record</span><span>Runtime descriptor</span></div>
</div>

The representations differ, but they copy overlapping semantic information:
the name, source relationship, documentation, type, visibility, or identity.
Each copy is reasonable in isolation. Together they create a synchronization
problem that no copy has the authority to solve.

A rename must update all of them. An incomplete type needs several recovery
states. A new language feature needs several schema changes. Eventually the
build succeeds while hover describes a different object, or a Package restores
a shape the compiler no longer recognizes. Link, finalize, retry, and
invalidation phases appear to keep the representations aligned.

The duplication is not primarily wasted memory. Each copy is instead a competing
claim about the meaning of `color`.

One tempting answer is to replace the copies with a universal node containing
every fact any consumer could need. That moves the synchronization boundary but
does not remove it. Every language must now flatten its concepts into the node,
and every new domain extends the schema or hides its real meaning in metadata.

The smaller question is more useful: which object genuinely owns this fact?

## Identity becomes the integration boundary

Tetrodotoxin keeps the object that understands a fact as its semantic owner. If
one language defines `color` as mutable storage, that declaration owns the
storage policy. If another language defines it as a shader input, that resource
owns its stage and binding behavior.

Consumers retain the owner's identity rather than receiving a translated copy,
giving each one a stable subject for the questions it understands without
exposing every private detail.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-diagram rabbit-owner-diagram" role="img" aria-label="Editor, compiler, and package ask one semantic owner different questions">
  <div class="chip-grid rabbit-diagram-stack rabbit-consumer-stack"><span>Editor asks for documentation</span><span>Compiler asks for type and shape</span><span>Package asks for durable meaning</span></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="diagram-panel accent-panel"><small>Real owner</small><strong>field color</strong></div>
</div>

Consumers receive that identity and ask only the questions they understand.
They do not receive a converted declaration that pretends to be authoritative.

This does not require one universal object containing every possible field. The
owner still speaks its own domain. Shared contracts rise only when independent
systems genuinely ask the same question.

An identity reached through a local name, an imported dependency, a generated
specialization, and a direct declaration does not acquire four parents or four
copies. Those paths converge on the current semantic owner.

## Concepts are questions

How can a consumer ask for meaning without requiring one enormous operation
table?

TTX calls the common semantic identity an **Abstract**. An Abstract supplies a
small stable foundation and answers open-ended named **concepts**. A concept is
a question asked of the real owner, not a field reserved in a universal node.

Every Abstract answers `resolve()` with the identity it currently represents.
Ordinary owners represent themselves. Keeping that total operation separate
from concept lookup later lets a transparent relationship share one referent
without turning the relationship into another public category.

`resolve_concept(name)` sends one borrowed binary name to one exact Abstract.
The receiver decides whether it understands that question and returns another
real Abstract representing its current answer.

```text
receiver.resolve_concept("instance")
        .resolve_concept("width")
```

Each segment remains a separate question. No global resolver stores the whole
route, and no caller gains permission to inspect the receiver’s private member
table because it can ask a name.

This open query surface matters when the answer does not yet exist. A
conventional resolver may return null, throw, or allocate a placeholder record
for a later phase to repair. TTX can return a real provisional answer while the
owner continues to expose its name, documentation, source relationship, and
other established relationships.

## Concepts are not limited to readable names

The previous route uses `instance` and `width` because readable names make the
example easy to discuss. TTX does not require concept names to be human-readable
text. `resolve_concept(name)` receives a borrowed byte sequence, and the receiver
interprets those bytes in its own conceptual domain.

All of these are valid concept names:

```text
"8"                       one readable byte
""                        an empty byte sequence
[0xFF, 0x00, 0xA7]       arbitrary non-ASCII bytes
```

This lets an Abstract project information as part of the request rather than
requiring every possible question to have a separately declared word. A route
such as `$name` can use `$` to identify one conceptual domain and carry `name`
as data interpreted by that domain.

Embedded resources in the bundled TTX languages use that pattern:

```text
$[../resources/logo.png]
└─────────────────────── one complete concept name
```

The complete byte sequence is still one concept route, regardless of how its
owner interprets it, and therefore one atomic request. It is tempting to picture
this as a `$` route receiving `../resources/logo.png` as a string parameter.
That picture may help explain the current Package implementation, but it also
assumes structure that the concept contract never promises. Consumers therefore
cannot rely on future implementations preserving that interpretation.

Why does the example look structured at all? Package chooses to recognize the
`$[...]` convention, interpret the enclosed bytes relative to the requesting
source, and return the resource identity it owns. That is one valid
interpretation of the complete request, not structure
exposed by the concept system. Another Abstract may recognize the same byte
sequence without splitting it at all. An owner may prove that no answer exists
without decoding the apparent path, or leave the answer indeterminate while its
facts remain unsettled. Nothing about the spelling requires a parameter parser,
a partially resolved route, or a second global resource registry.

Readable names remain valuable because people can document them and independent
systems are less likely to choose the same spelling accidentally. Readability
does not determine whether a route can resolve, however. A carefully specified
single byte or encoded enum value can be useful for an important or hot path,
at the cost of making accidental collisions harder to recognize.

Those collisions are not global. Every question is directed to one receiver.
The conflict appears when that receiver participates in two protocols that give
the same exact bytes different meanings. Obscurity cannot prevent that conflict,
and a byte sequence cannot define shared meaning by itself.

This is the first need for contractual negotiation. The concept name carries
the question, while a shared contract establishes its byte domain, the expected
answer, and the category that answer must satisfy. After resolving the name, a
consumer proves the returned Abstract against that contract rather than guessing
from the spelling or extending a global name registry.

The name tells the receiver which question was asked. Its spelling cannot prove
that the returned identity satisfies the caller's contract. How can two systems
negotiate that relationship without binding either identity to the other's
implementation?

## Interfaces negotiate without binding identities

Imagine a rendering pipeline that needs a function with a particular value flow
and rendering behavior. A candidate function happens to accept and return the
right shapes, but matching shapes cannot prove that it handles the intended
stage, resources, or invocation policy.

A conventional C++ model might ask the candidate directly:

```cpp
if (candidate.is<RenderStage>()) {
  return candidate.select<RenderStage>();
}
```

This makes the contract look convenient, but it quietly defines semantic proof
in terms of the host language. `is` requires a native type identity or registry.
`select` assumes the proven object can be reached through a compatible pointer,
or it manufactures a wrapper that becomes another representation of the
candidate. A language outside that hierarchy must add an adapter before it can
participate.

TTX instead keeps the requirement and candidate as two real Abstracts. An
identity-free **Interface** negotiates the relationship between them:

$$
\begin{gathered}
\text{rendering requirement}
\mathrel{\texttt{ + }}
\text{candidate function} \\
\Downarrow\;\text{Interface negotiation}\;\Downarrow \\
\text{Indeterminate}\;\cdot\;\text{Rejected}\;\cdot\;
\text{Satisfied}\;\cdot\;\text{Equivalent}
\end{gathered}
$$

`Satisfied` is directional: the candidate meets this requirement. `Equivalent`
is stronger and requires the concrete negotiator to prove the relationship in
both directions. An unsettled relation remains indeterminate rather than
becoming a premature rejection. The next chapter derives the shared answer TTX
uses to preserve that state.

The result is deliberately non-binding. Negotiation creates no forwarding
identity, wrapper, common type, registry entry, or semantic dependency between
the participants.
It does not attach the candidate to the requirement or retain a relation object
for later queries. It reports what the current facts establish, and a later
observation negotiates again.

Category proof uses the same mechanism. A successful proof returns an
identity-free view containing the exact candidate and the operations that
witness one required category. The view is evidence about the candidate, not a
cast to another semantic object.

Rendering provides a direct example. One language can own the stage requirement
while a function remains the candidate owned by another language. Their
Interface may consider value flow, stage policy, and resource relationships
without copying either declaration or requiring both languages to inherit one
native class.

<details class="documentation-insert">
  <summary>
    <span class="documentation-insert-label">Technical note</span>
    <strong>Interface evidence is not subtyping</strong>
  </summary>
  <div class="documentation-insert-content">

It is tempting to read a satisfied Interface as the judgment
`candidate <: requirement`. TTX introduces no such subtype relation.
Satisfaction does not coerce the candidate, make it implicitly substitutable
in every context, or establish transitive relationships with other
requirements.

After one category requirement is satisfied, category proof may expose an
identity-free witness view:

$$
\operatorname{category\_proof}(R,X)
= \left(X,\operatorname{witness}(R,X)\right)
$$

Projecting the identity component recovers the original candidate:

$$
\pi_{\mathrm{identity}}
\left(\operatorname{category\_proof}(R,X)\right)=X
$$

This resembles an existential package or type-class dictionary: the consumer
receives the exact candidate beside the operations witnessing one contract.
The witness may be synthesized from other semantic facts, so pointer
convertibility and native inheritance are neither required nor implied.

The comparison to [COM interface
discovery](https://learn.microsoft.com/en-us/windows/win32/com/rules-for-implementing-queryinterface)
is useful but limited. COM returns another interface pointer, fixes an object's
supported interface set, and couples discovery to reference counting. TTX
borrows the original candidate, negotiates one current semantic relation, and
leaves lifetime with the graph owner.

[Rust trait objects](https://doc.rust-lang.org/reference/types/trait-object.html)
likewise pair a value pointer with a virtual method table, but that carrier
exists to provide runtime erasure and dispatch. A TTX witness view is evidence
only. Erasure requires a separate explicit language value, and satisfying an
Interface alone allocates nothing.

[MLIR interfaces](https://mlir.llvm.org/docs/Interfaces/) share the goal of
letting consumers ask capabilities without switching over every concrete owner.
Their generated C++ models, casts, and context registration remain part of one
compiler representation. TTX instead negotiates exact semantic requirement
identities through its C ABI without making a registry or host class hierarchy
authoritative.

  </div>
</details>

Interface negotiation cannot make an ambiguous concept name produce two
different answers from one receiver. It prevents a related mistake: treating
the spelling or native implementation of one answer as proof of its contract.
The consumer brings the exact requirement and accepts only evidence negotiated
for that relationship.

Keeping the owner alive solves the copy problem. Concepts let independent
systems ask it questions, and Interfaces let them negotiate richer contracts
without binding their identities together. One problem remains: what should an
owner or Interface answer while a person is still typing and only some facts
are known?

That is where the next chapter begins. Factual uncertainty belongs to the answer
to one complete question, not to an assumed set of parameters hidden inside its
name.

<details class="documentation-insert documentation-insert-advanced">
  <summary>
    <span class="documentation-insert-label">Advanced synthesis · optional</span>
    <strong>Ownership and evidence remain separate</strong>
  </summary>
  <div class="documentation-insert-content">

<blockquote>
  <p><strong>“Tetrodotoxin was developed from first principles. Each part of the design began with concrete constraints and was built by construction, allowing the larger semantics to emerge from their composition. The formalization below is my working derivation of that structure, informed by several years of tangential exposure to theory while building in this space. If you can strengthen one of these derivations or connect it to established work, please <a href="https://github.com/tetrodotoxin-dev/Tetrodotoxin/issues">open a design issue</a>. Substantial revisions can grow into a public RFC. None of the notation is required to understand or use Tetrodotoxin.”</strong></p>
  <footer>— Matt</footer>
</blockquote>

**One owned subject.** Let `𝒜` contain the exact Abstract identities and `𝔹*`
the finite byte sequences, including the empty sequence. For one observation
`ω`, every Abstract supplies a total represented-identity operation and one
receiver-local concept operation:

$$
\begin{aligned}
\operatorname{resolve}_{\omega}
  &: \mathcal{A} \to \mathcal{A} \\
\operatorname{concept}_{\omega}
  &: \mathcal{A} \times \mathbb{B}^{*} \to \mathcal{A}
\end{aligned}
$$

The first argument to `concept` supplies the namespace. Two owners may interpret
the same bytes differently without colliding because neither spelling creates a
global route. The complete byte sequence remains one atomic question regardless
of whether one receiver chooses to decode structure from it.

Chaining readable syntax applies the operation repeatedly rather than creating
one flattened key:

$$
X_0 = X,
\qquad
X_{k+1}
  = \operatorname{concept}_{\omega}(X_k,b_k)
$$

Each answer therefore becomes the real receiver of the next question. No route
object, universal member table, or consumer-owned copy stands between the
consumer and the current semantic owner.

**A relation without a binding.** Let `R` be one exact requirement Abstract and
`X` one exact candidate Abstract. Interface negotiation reports the evidence
available for that ordered pair:

$$
\operatorname{negotiate}_{\omega}(R,X)
\in
\left\{
u,\;
\operatorname{Rejected},\;
\operatorname{Satisfied},\;
\operatorname{Equivalent}
\right\}
$$

Here `u` names the indeterminate answer whose semantics the next chapter
develops. Satisfied proves the direction from requirement to candidate, while
Equivalent records the stronger proof established by the concrete negotiator.
No general subtype, symmetry, or transitive relation follows from either result.

When a required category is satisfied, its evidence has the form:

$$
\operatorname{proof}_{\omega}(R,X)
=
\left(X,\operatorname{witness}_{\omega}(R,X)\right)
$$

Write `π_candidate` for the ordinary projection function that selects the
candidate component from this pair. Applying it recovers the exact identity
supplied to the negotiation:

$$
\pi_{\mathrm{candidate}}
\left(\operatorname{proof}_{\omega}(R,X)\right)
=X
$$

The witness contributes only the operations needed for requirement `R`. Because
proof preserves `X`, negotiation cannot manufacture a wrapper, adjusted semantic
identity, native cast, or registry entry and then present it as the candidate.
The requirement also remains an ordinary Abstract rather than a UUID or host
type token.

This separation closes the ownership argument. Concept resolution keeps every
question with its current receiver, while Interface negotiation lets another
system prove a relationship without acquiring either participant. The graph can
therefore extend its vocabulary and evidence without creating another authority
that must be synchronized with the semantic owner.

  </div>
</details>

### Key takeaways

- Hover, navigation, compilation, and Package reconstruction can converge on one
  semantic subject without sharing one consumer-specific representation
- Binary concept domains can carry request data without creating a parallel
  registry
- Interfaces prove richer relationships without native casts, wrappers, or
  copied declaration models

### Common pitfalls to avoid

- Editor symbols, compiler nodes, Package records, and linked dependency objects
  become parallel authorities requiring synchronization, invalidation, and
  restoration machinery
- Unspecified dense concept names can collide without a contract establishing
  their domain and expected answer
- Native `is` and `select` helpers turn host-language representation into
  semantic authority and exclude candidates that could synthesize valid
  evidence

### Normative contracts

- [TTX semantics: Semantic graph](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#semantic-graph)
- [TTX semantics: Resolution and category proof](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#resolution-and-category-proof)
- [TTX semantics: Interface](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#interface)
- [TTX design: One meaning, several consumers](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#one-meaning-several-consumers)
- [TTX design: Owner directed contextual resolution](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#owner-directed-contextual-resolution)
- [Tetrodotoxin Philosophy: Identity is the integration boundary](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/PHILOSOPHY.md#identity-is-the-integration-boundary)
