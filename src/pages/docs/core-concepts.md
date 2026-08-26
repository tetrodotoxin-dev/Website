---
layout: ../../layouts/DocsLayout.astro
title: Core concepts
description: The small set of ideas that let several concrete languages participate in one toolchain without losing their meaning.
eyebrow: The model
---

The central problem is not parsing several syntaxes. It is keeping one fact from
turning into several plausible copies as editors, compilers, build tools, and
serializers begin to use it.

Tetrodotoxin treats semantic identity as the integration boundary. A consumer
asks the real owner for the contract it understands instead of reading a shadow
symbol, compiler node, or serialization model.

## Dialects keep domain meaning

A **Dialect** owns the grammar and semantic objects for one domain. Package can
describe durable identity and composition. Library can describe values,
functions, and execution. Scene and Shader can keep their own lifecycle and GPU
rules.

Similar implementation shapes do not make these concepts identical. Shared
meaning rises only after independent domains prove that they ask the same
question.

## TTX carries shared questions

**TTX** is the compact, host-neutral vocabulary used across domains. It covers
questions such as identity, resolution, Types, Packs, Layouts, Addressables,
Callables, documentation, and Interfaces.

TTX is not a universal intermediate representation. A concrete Shader Stage or
Library Function answers a shared question on its own identity and keeps the
richer behavior its Dialect owns.

The [TTX language family](/ttx/) applies that vocabulary through cooperating
Package, Library, App, Scene, Render, and Shader Dialects with a semi-common
Lexicon. That family is one implementation on Tetrodotoxin rather than the
platform boundary itself. A future C frontend can join the same Workspace and
Terminal model without becoming TTX or adopting its source conventions.

## Extend both sides of the toolchain

Dialects and Terminals are complementary extension points. Installed Dialects
choose which source meanings can join a Workspace. Selected Terminal producers
choose which products can leave it after completion.

A new DSL can therefore reuse source lifetime, diagnostics, Packages, editor
sessions, cross-language navigation, and existing Terminals without translating
its model into another language. A new Terminal can consume the completed graph
without adding target policy to every Dialect.

## The Workspace connects real identities

One semantic **Workspace** retains the languages in a product and the
relationships between them. Package routes, navigation, diagnostics,
cross-language references, and compilation therefore observe the same graph.

Source is often incomplete while a person is editing. The Workspace preserves
the strongest meaning available, including explicit uncertainty, so tools can
remain useful without pretending the product is ready to ship.

## Interfaces preserve richer compatibility

A Layout can prove that values have compatible shape, but shape alone cannot
prove that one semantic object satisfies another domain's behavior.

An **Interface** carries that higher-order relationship. It lets two real
semantic owners negotiate compatibility without either language copying the
other's declaration inventory.

## Terminals choose representation

A **Terminal** derives one product from completed meaning. Native code, SPIR-V,
Package Archives, generated headers, and canonical formatting each belong to
the consumer that needs that representation.

This boundary keeps target facts out of the languages that do not own them. The
generated product is a view for its next consumer, not a replacement for the
semantic graph.
