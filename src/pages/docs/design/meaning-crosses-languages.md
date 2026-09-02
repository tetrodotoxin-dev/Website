---
layout: ../../../layouts/DesignLayout.astro
title: Semantic federation
description: Semantic projections generate honest bindings while independent frontends raise their own meaning into TTX without adopting one universal source or IR.
steps:
  - number: "43"
    title: Generated bindings are semantic projections
    id: generated-bindings-are-semantic-projections
  - number: "44"
    title: LLVM IR remains one Terminal
    id: llvm-ir-remains-one-terminal
  - number: "45"
    title: C and other languages raise their own meaning
    id: c-and-other-languages-raise-their-own-meaning
  - number: "46"
    title: Hover follows identity across languages
    id: hover-follows-identity-across-languages
---

Imagine a Library Callable that must be used from C. A conventional binding
generator lowers it into a C declaration. That is useful, but one-way. The C
representation cannot automatically contribute C meaning back to the editor,
Package graph, or the language that produced it.

A semantic federation therefore moves in both directions: it projects meaning
outward into the strongest form another language can express while allowing
that language's real semantic owners to participate through shared contracts.

## Generated bindings are semantic projections

A binding Terminal begins by asking what the receiving language can represent
faithfully.

C may receive opaque handles, structs where structural projection is honest,
callable functions, immutable operation tables, and generated documentation. A
richer language may preserve sum types, ownership policy, Generics, or stronger
Interface relationships.

```text
TTX graph → C API
TTX graph → C++ facade
TTX graph → Rust API
TTX graph → Zig API
```

These products do not define the semantic graph. Each is one view selected for
one receiving ecosystem, so the weakest target never becomes the ceiling for
every other Terminal.

The provider may cross a repository boundary as well. A binding plugin exposes
one typed C ABI entrypoint, returns exact provider identities, and uses the
host's canonical TTX requirements. Build imports that provider explicitly.
Environment retains its shared library. Puffer never learns a binding-specific
switch or schema.

COM’s `QueryInterface` and Rust trait objects demonstrate the value of pairing
one identity with evidence for one interface. TTX uses the same broad mechanism
with a narrower semantic contract: the requirement is another Abstract, the
candidate identity remains unchanged, and proof neither owns lifetime nor
closes the open concept namespace.

## LLVM IR remains one Terminal

LLVM IR provides a shared, typed representation for optimization and CPU
lowering. It is exactly the kind of powerful infrastructure this model should
reuse.

The mistake would be requiring Package, Scene, Shader, editor, and Generic
meaning to become LLVM operations before those domains can cooperate.

```text
Library execution ─────────────→ LLVM IR
Shader + Render ───────────────→ SPIR-V
public semantic concepts ──────→ bindings
reconstruction machinery ──────→ Package
```

Each arrow leaves from meaning at the point its target becomes relevant. LLVM
can remain an intermediate representation inside its own lowering ecosystem
while acting as a Terminal relative to the TTX Workspace.

MLIR interfaces pursue a related capability-oriented goal inside a compiler:
transformations ask shared behavior without switching over every concrete
operation. TTX applies that instinct before compiler representation, across
languages and tools that may never share one operation model.

## C and other languages raise their own meaning

Now reverse the direction. A C frontend participates without translating C into
Library. C keeps preprocessing, translation units, namespaces, typedefs,
promotions, pointers, unions, bit-fields, variadics, and its implementation
profile.

Its real semantic owners can still answer shared questions:

- this declaration is a type
- this name is Addressable
- this function is Callable
- this value has a Layout
- this source span owns documentation
- this Reference reaches another semantic identity.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-federation-graphic" role="img" aria-label="C, Library, Scene, and Shader keep their concrete meaning while raising shared concepts into one TTX Workspace">
  <div class="chip-grid rabbit-federation-languages"><span>C</span><span>Library</span><span>Scene</span><span>Shader</span></div>
  <div class="rabbit-federation-arrow" aria-hidden="true">↓ raise shared meaning</div>
  <div class="diagram-panel accent-panel rabbit-federation-core"><small>Semantic federation</small><strong>TTX Workspace</strong><span>Identity · Type · Layout · Reference · Interface</span></div>
</div>

Those facts are raised by participation, not normalized into another language.
No consumer gains permission to inspect C's private machinery because it
can negotiate a Layout or Interface.

The same plugin boundary can install the C frontend Dialect. Environment loads
it before constructing the child Workspace, so C source is interpreted once by
its real owner. Loading the provider never triggers a second parse or relifts a
compiler representation into the live graph.

## Hover follows identity across languages

Once several frontends share a Workspace, editor behavior follows identity
across syntax boundaries.

A Library Reference may reach a C type. A Shader resource may point to a
Library value. A generated binding may retain correlation to the semantic
identity that produced it.

<div class="diagram inset-shadow diagram-flow diagram-grid rabbit-cross-language" role="img" aria-label="Source in one language follows a Reference to an identity authored in another language and uses the same hover and definition path">
  <div class="diagram-panel"><small>Library source</small><strong>Graphics::Texture</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→ Reference →</span>
  <div class="diagram-panel accent-panel"><small>C source owner</small><strong>Texture</strong></div>
  <span class="diagram-arrow" aria-hidden="true">→</span>
  <div class="chip-grid rabbit-diagram-stack"><span>Hover</span><span>Go to definition</span><span>Completion</span></div>
</div>

Hover asks the selected owner. Go to definition follows its authored
Association. Completion visits current concepts. The language server does not
need custom integration for every possible pair of languages.

The federation now spans source, process, representation, and language
boundaries. The final question turns inward: can the definitions and bootstrap
that make TTX participate obey the same rules?

### Key takeaways

- Bindings preserve as much meaning as the receiving language can express
- C and other frontends retain their own semantics while joining shared hover,
  navigation, Package, and Terminal relationships

### Common pitfalls to avoid

- Bindings become ABI-only stubs
- Every language pair needs custom editor integration
- Frontends must flatten into one universal source or compiler IR before their
  tools can cooperate

### Normative contracts

- [TTX design: Semantic federation](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md#semantic-federation)
- [Tetrodotoxin design: One toolchain, several languages](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md#one-toolchain-several-languages)
- [Tetrodotoxin Philosophy: A semantic federation](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/PHILOSOPHY.md#a-semantic-federation)
