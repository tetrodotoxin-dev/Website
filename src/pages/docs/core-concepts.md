---
layout: ../../layouts/DocsLayout.astro
title: Core concepts
description: The small set of ideas that let several concrete languages participate in one toolchain without losing their meaning.
---

The central problem is not parsing several syntaxes, but keeping one fact from
turning into several plausible copies as editors, compilers, build tools, and
serializers begin to use it.

Tetrodotoxin treats semantic identity as the integration boundary. A consumer
asks the real owner for the contract it understands instead of reading a shadow
symbol, compiler node, or serialization model.

## Dialects keep domain meaning

A **Dialect** owns the grammar and semantic objects for one domain, allowing
Package to describe durable identity and composition, Library to describe
values and execution, and Scene and Shader to keep their own lifecycle and GPU
rules.

Similar implementation shapes do not make these concepts identical. Shared
meaning rises only after independent domains prove that they ask the same
question.

## TTX carries shared questions

**TTX** supplies stable host-neutral contracts and open concept questions used
across domains. Identity, resolution, types, Packs, Layouts, Addressables,
Callables, documentation, and Interfaces form a shared foundation without
limiting the richer semantics another owner may expose.

TTX is not a universal intermediate representation. A concrete Shader stage or
Library function answers a shared question on its own identity and keeps the
richer behavior its Dialect owns. Concepts are questions asked of that real
owner rather than fields copied into a universal node.

The [bundled TTX languages](/ttx/) apply that vocabulary through cooperating
Package, Library, App, Scene, Render, and Shader Dialects. Their shared source
conventions are one implementation on Tetrodotoxin rather than the platform
boundary itself. A C frontend can join the same Workspace and Terminal model
without becoming Library or adopting TTX source conventions.

## Build and Environment make infrastructure explicit

Package answers what semantic things belong together, **Build** answers which
exported identities this invocation should realize, and **Environment** answers
which host, target, repositories, and provider plugins are available to do so.

Every Build retains one real Environment child constructed by the installed
Environment Dialect. Build owns that containment relationship but cannot inspect
Environment's private model. It asks shared concepts and Interfaces, just as
Scene and Shader reuse a real Library child without copying Library semantics.

Puffer raises the command-line bytes, working directory, SDK location, and host
observations into one immutable invocation authority. Build owns the argument
schema and maps its outcomes to product requirements. Environment loads the
exact Dialect and Terminal plugins named by the Build before it constructs the
child Toolchain and interprets the Package source once.

This is infrastructure as code without a build manifest becoming another
semantic graph. Package remains host independent, Build retains generative
requests rather than artifacts, and target representations still leave only at
Terminal edges.

## Extend both sides of the toolchain

Dialects and Terminals are complementary extension points. Installed Dialects
choose which source meanings can join a Workspace. Selected Terminal producers
choose which products can leave when the current projection satisfies that
product's contract.

A new DSL can therefore reuse source lifetime, diagnostics, packages, editor
sessions, cross-language navigation, and existing Terminals without translating
its model into another language. A new Terminal can consume the strongest graph
its product admits without adding target policy to every Dialect.

## The Workspace connects real identities

One semantic **Workspace** retains the languages in a product and the
relationships between them. Package routes, navigation, diagnostics,
cross-language references, and compilation therefore observe the same graph.

Source is often incomplete while a person is editing. `Unknown` preserves a
provisional answer, `None` proves completed absence, and `Constant` proves one
immutable fact. Tools can use every current relationship without pretending the
product is ready to ship.

## Packs carry flow and Layouts protect owners

A **Pack** carries the real Abstracts currently producing value flow, while its
**Layout** projects that shape with exact and Unknown entries without exposing
the private machinery that generated them.

This is an enabling firewall. Editors, compilers, and other Dialects can
negotiate useful structure without extracting another owner's member tables,
completion state, or target representation.

Fitting is therefore negotiation rather than a Boolean type test. An unsettled
relationship remains Unknown, a completed rejection proves absence, and a
successful negotiation supplies the fitted Pack projection.

## Interfaces preserve richer compatibility

A Layout can prove that values have compatible shape, but shape alone cannot
prove that one semantic object satisfies another domain's behavior.

An **Interface** carries that higher-order relationship. It lets two real
semantic owners negotiate compatibility without either language copying the
other's declaration inventory.

The negotiation reports one current relationship without binding the owners,
manufacturing a wrapper, or requiring a native `is` or `select` cast. The
[Semantic ownership walkthrough](/docs/Design/the-copy-problem/#interfaces-negotiate-without-binding-identities)
derives why that distinction matters for category proof and cross-Dialect
contracts.

## Terminals choose representation

A **Terminal** derives one product from the strongest meaning its format admits.
Native code, SPIR-V, packages, generated headers, Graph Text, and canonical
formatting each belong to the consumer that needs that representation.

This boundary keeps target facts out of the languages that do not own them. The
generated product is a view for its next consumer, not a replacement for the
semantic graph.

Tetrodotoxin uses the ordinary `products` concept to enter production
negotiation. Unknown preserves an unsettled product surface, None proves that an
owner exposes no products, and a production authority factually visits its
named exported product identities. The authority is not a Layout or registry.

Build imports exact Terminal provider identities from SDK or project plugins.
Environment proves their Interfaces before a provider consumes one exported
Library, App, Package, or other product identity. The Terminal returns a Named
Pack whose relative paths identify immutable byte Constants. Publisher commits
that complete Pack atomically.

A Library does not become an executable when an App later reaches it. Library,
executable, binding, Graph Text, SPIR-V, and Package results are independent
maximal projections over exact immutable inputs.

A representation placed inside the graph becomes an early Terminal: a dead
fragment that needs linking, invalidation, or adapters to imitate participation.
Keeping Terminals at the edge is what prevents shadow graphs.

## packages preserve semantic machinery

A Package reconstructs fresh identities that answer the same promised
questions as the source graph that produced it. References preserve how a
question is asked, Generics preserve how new graphs are generated, and Constant
facts preserve immutable results. When the reconstructed graph retains that
meaning without retaining the original representation, it is a perfect
simulacrum.

Local Build production does not require that archive. `build.ttx` sources the
live `package.ttx` graph through its Environment-owned Workspace. Invoking
`package.ttx` directly is the independent request that creates `package.ttxp`
for distribution or source-free use.

The [design pages](/docs/Design/) derive these behaviors from first principles
and follow them into live editing, unified language tooling, generated
bindings, and semantic federation.
