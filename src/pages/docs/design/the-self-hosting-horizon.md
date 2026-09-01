---
layout: ../../../layouts/DesignLayout.astro
title: Self-hosting
description: TTX describes its own contracts as semantic machinery, Packages that machinery, and treats every bootstrap as one replaceable implementation of the same observations.
steps:
  - number: "37"
    title: TTX describes its own concepts
    id: ttx-describes-its-own-concepts
  - number: "38"
    title: Package preserves graph-generating machinery
    id: package-preserves-graph-generating-machinery
  - number: "39"
    title: Bootstrap implementations are replaceable
    id: bootstrap-implementations-are-replaceable
  - number: "40"
    title: The toolchain is made from the meaning it hosts
    id: the-toolchain-is-made-from-the-meaning-it-hosts
---

Every toolchain has to start somewhere. Before a Workspace exists, an executable
must read source, create the first semantic identities, load providers, and
publish results. Tetrodotoxin calls that trusted starting implementation the
**bootstrap**.

Self-hosting is often presented as a compiler written in the language it
compiles. The question here is broader: can the semantic system describe and
Package the machinery that gives its own contracts meaning, then project the
native interfaces needed to start another host?

If it can, bootstrap code remains operationally necessary without becoming the
permanent semantic authority.

## TTX describes its own concepts

Begin with the contracts the previous chapters have used: `Abstract`, `Type`,
`Addressable`, `Callable`, `Pack`, `Layout`, `Context`, and `Interface`. The
bootstrap exposes them through a small C ABI of typed handles and immutable
operation tables because that carrier can be implemented without inheriting one
host language's object model.

Their meaning is expressed as graph relationships:

- one semantic identity and its documentation
- total type and open concept questions
- synchronous concept and Layout visitation
- category evidence through Interface negotiation
- immutable Packs and Layout projections
- the concrete operations owned by each semantic model.

The C structs are not the semantic definitions. They are one Terminal
projection that lets native hosts exchange identities and contract evidence.
A TTX-authored owner and a native owner participate through the same questions
without sharing a C++ class hierarchy, RTTI catalogue, or private graph
registry.

The plugin ABI makes the separation observable. Puffer accepts typed handles
and canonical requirement identities from independently built providers without
learning their C++ classes, implementation language, or repository. A provider
written in TTX and a native bootstrap provider are interchangeable only when
their semantic observations are equivalent.

## Package preserves graph-generating machinery

Self-hosting requires more than serializing the types observed during one
build. Package preserves the generators that answer new type, Layout, Dialect,
and Interface questions in another Workspace.

```text
TTX definitions
  + Generic machinery
  + Dialect behavior
  + Reference relationships
  + immutable Constants
  → self-hosted Package graph
```

This is the ordinary Package contract applied to the semantic substrate itself.
A restored Generic answers an argument that publication never materialized. A
restored Dialect constructs a source graph through ordinary TTX contracts rather
than consulting a hidden native registry.

Package freezes durable semantic machinery without freezing the process
representation that happened to implement it. The restored graph receives
fresh identities, yet outside observers receive the same promised concepts and
the same ability to generate future meaning.

## Bootstrap implementations are replaceable

Every host begins with a trusted executable capable of admitting source and
providers into a Workspace. That is the bootstrap. It supplies a starting edge
for the graph, but it does not own the meaning produced after that edge.

A native owner and a TTX-authored owner are equivalent when the same TTX
questions produce equivalent observations and Terminal products.

```text
bootstrap owner ──TTX questions──┐
                                ├─ equivalent behavior
self-hosted owner ─TTX questions─┘
```

Equivalence covers names, documentation, concept answers, Layouts, fitting,
generated types, Package reconstruction, diagnostics, and independently
projected products. It does not require matching heap layouts, source language,
compiler data structures, or process identities.

The minimum Puffer bootstrap is deliberately bounded. It contains the TTX
lexical and C ABI foundations, source transactions, the Workspace needed to
install a frontend, the Build, Environment, and Package bootstrap Dialects,
plugin loading, CLI and LSP transport, and atomic publication. Other Dialects
and Terminals enter through exact provider identities over the same ABI.

This boundary lets one semantic owner be supplied by native C++, native C, TTX,
or another implementation language without creating adapters throughout the
graph. Replacing an implementation is provider substitution at the bootstrap
edge. It is not a migration of the semantic identities observed by consumers.

## The toolchain is made from the meaning it hosts

The same pattern now spans the whole platform:

```text
purpose-built languages ──raise──> living semantic Workspace
                                      │
                                      ├── editor and graph tooling
                                      ├── independent Terminals
                                      ├── generated language bindings
                                      └── Package simulacra
                                                   │
other language frontends <──raise and project──────┘
                                      │
                                      └── TTX-hosted semantic machinery
```

Puffer coordinates bootstrap and invocation while editor tooling observes exact
graph identities, live source authorities replace their answers without
rebuilding unrelated graphs, and independent Terminals project Graph Text,
bindings, compiler inputs, Packages, libraries, and executables. Other frontends
raise their own meaning into the same conversation instead of first becoming
Library or TTX source.

The language remains an emergent property of bootstrapping the system. The
durable product is a toolchain whose semantics can be queried, projected,
Packaged, and hosted without choosing one permanent source language or compiler
representation as its foundation.

When a graph survives source and process boundaries, its reconstruction is a
perfect simulacrum. When independently designed languages meet through that
preserved meaning, they form a semantic federation. When the federation hosts
the machinery that defines its own contracts, self-hosting is no longer a
special compiler milestone. It is another instance of semantic participation.

That is the complete Design argument: the common layer is meaning, not
representation.

### What this enables

- TTX-authored and native owners can satisfy the same contracts
- Packages preserve the generators needed to construct another semantic host
- The C ABI remains one replaceable projection rather than the definition of
  meaning

### What goes wrong without it

- Bootstrap classes become the real semantic authority
- Compiler registries and native type identities define participation
- Self-hosting requires every consumer to migrate to a second model instead of
  replacing one provider at the graph boundary

### Normative contracts

- [TTX semantics: Host ABI](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md#host-abi)
- [Tetrodotoxin design: Observable boundaries](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md#observable-boundaries)
- [Tetrodotoxin Philosophy: The complete arc](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/PHILOSOPHY.md#the-complete-arc)
