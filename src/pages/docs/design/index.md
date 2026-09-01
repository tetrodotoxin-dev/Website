---
layout: ../../../layouts/DesignLayout.astro
title: Background
description: How a developer-tooling project arrived at living semantic graphs, independent representations, and bidirectional language cooperation.
steps:
  - number: "A"
    title: The toolchain came first
    id: the-toolchain-came-first
  - number: "B"
    title: A boundary carries its history
    id: a-boundary-carries-its-history
  - number: "C"
    title: Lowering is not federation
    id: lowering-is-not-federation
  - number: "D"
    title: Semantic layering points another way
    id: semantic-layering-points-another-way
  - number: "E"
    title: The question Tetrodotoxin asks
    id: the-question-tetrodotoxin-asks
---

Tetrodotoxin is the result of a developer-tooling research project that began
with a modern C++ runtime in 2018. The language family arrived years later as a
way to test an emerging model for language and tool cooperation, not as the
original destination.

This background develops the problem that produced that model. The remaining
Design chapters then take one constraint at a time, derive the smallest concept
that preserves it, and follow the consequences through Packages, editors,
compilers, other languages, and self-hosting.

## The toolchain came first

The early work was practical: could GDScript be compiled, and how difficult
would it be to add a language feature such as private visibility? The experiment
did not begin from a failure in GDScript's tooling. It exposed a deeper
integration problem instead. Although the Tetrodotoxin runtime and Godot were
both C++ projects, their build systems and runtime assumptions were
incompatible. Exploring one language feature therefore crossed build systems,
runtimes, source models, and developer tools before reaching execution.

A language feature becomes useful only after its meaning reaches parsers,
diagnostics, editor services, Packages, bindings, runtimes, build tools, and
compilers. The idea unique to the language may be small. Rebuilding the
surrounding ecosystem is not.

Anders Hejlsberg summarized the imbalance with characteristic bluntness:

> “The world needs another language as much as it needs another bullet in the
> head.”
>
> — Anders Hejlsberg,
> [The Future of Programming Languages](https://www.youtube.com/watch?v=cywK3XYYJ2o&t=1980s)

Languages are not the problem. They let a domain turn its assumptions into
precise and productive abstractions. The cost appears when those semantics can
participate only through one language's source, compiler, and tooling model.

The Tetrodotoxin language family began in mid-2025 because the integration work
kept reaching the same question:

> How can independently designed systems cooperate without asking every tool to
> reimplement every language or asking users to maintain layers of adapters?

## A boundary carries its history

C++ was a formative example because it gained enormous leverage by extending C
while retaining practical access to C ecosystems. It added stronger types,
objects, lifetimes, generic programming, and compile-time computation without
requiring every existing system to be replaced first.

That relationship also became part of every later design decision. Neither
language stopped evolving. The
[C++ 2024 standard](https://www.iso.org/standard/83626.html) still defines its
relationship against C 2018, while
[C 2024](https://www.iso.org/standard/82075.html) has continued according to
its own rules.

Consider indexed designated initialization:

```c
int values[8] = {
  [2] = 10,
  [7] = 20,
};
```

This form is valid C and invalid C++. C++ has different syntax, object lifetime,
and evaluation guarantees. Its
[designated-initializer proposal](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2017/p0329r4.pdf)
records why the C form does not transfer directly.

This is not a failure of either language. It demonstrates that a representation
boundary is not passive. The same commitments that make a language expressive
also become constraints that future features have to negotiate.

C++ contains hints of a more contextual relationship. A `constexpr` function
is not permanently classified as compile-time or runtime code. Its use and the
facts available at that use determine whether it becomes an immutable result.
The insight is powerful, but the meaning remains inside the C++ compiler and
tooling ecosystem. Understanding the same fact does not let another language
participate in that evaluation.

## Lowering is not federation

A common representation is the natural answer when several languages need the
same backend. Each frontend progressively removes language-specific detail
until the result reaches a model that an existing runtime or machine can
execute.

LLVM demonstrates how effective that approach is when machine-oriented
lowering is the destination. MLIR carries richer semantics farther through a
lowering pipeline. Both solve important representation problems.

The difficulty begins when the shared system must preserve the meaning that
made each source language useful. A sufficiently small common model erases
important distinctions. A model expressive enough to describe every past,
present, and future semantic system becomes another language, another
toolchain, and another translation boundary.

That is how fourteen competing standards become
[fifteen](https://xkcd.com/927/).

The problem is not that lowering loses information. Losing information is often
its purpose. The problem is treating the lowered representation as the only
place where languages and tools are allowed to cooperate.

## Semantic layering points another way

TypeScript demonstrates another relationship. It adds semantic knowledge for
developers and tools without asking browsers to replace JavaScript. Its type
system remains valuable even though its emitted program is still JavaScript.

This separates two directions:

- semantic information can be raised into a richer layer for tools and people
- an executable representation can still be projected into an established
  runtime.

Tetrodotoxin explores whether that relationship can be generalized and made
bidirectional. A language should be able to contribute meaning without becoming
one universal source language. A compiler or runtime should still receive the
representation it requires without making that representation authoritative
inside every participating language.

Three ideas begin to emerge:

1. **Dialects raise meaning** from concrete languages and domains.
2. **Terminals project representation** when something enters or leaves the
   living semantic graph.
3. **Layouts isolate factual structure** so consumers can cooperate without
   acquiring the private machinery that produced it.

These are conclusions to earn, not premises to accept. The next chapters begin
with a smaller and more familiar problem before returning to this larger model.

## The question Tetrodotoxin asks

Imagine one name in source code. It may be a variable declaration such as
`int color;`, a function definition, a Shader resource, or something from a
language that has not been designed yet.

The parser, editor, compiler, Package system, and runtime may all need to know
something about that name. If each consumer builds its own representation, the
toolchain acquires several partial descriptions of the same meaning.

Where should that meaning live?

The first Design concept starts there. It does not begin with a universal node,
a graph API, or a new language feature. It begins by deciding who owns one
semantic fact when several systems need it.

## Reading path

1. **Semantic ownership** asks where one fact belongs and how another system
   proves its contract without taking ownership.
2. **Factual uncertainty** asks how its owner answers before every fact settles.
3. **Opaque projections** show how to share partial structure without exposing owner state.
4. **Emergent behavior** derives initialization, recursive construction, and
   folding from independent concepts.
5. **Generative graphs** preserve machinery capable of producing future meaning.
6. **Shared tooling** lets editors and compilers observe the same identities.
7. **Live evolution** replaces one source without invalidating the semantic island.
8. **Semantic federation** raises and projects meaning across languages.
9. **Self-hosting** applies the same contracts to the machinery that defines TTX.

### What this enables

- A reader can evaluate every later mechanism against the original integration
  problem instead of treating the TTX vocabulary as a collection of unrelated
  abstractions

### What goes wrong without it

- The language family can be mistaken for the destination
- Puffer can be mistaken for a build system
- TTX can be mistaken for another universal IR

### Normative contracts

- [Tetrodotoxin Philosophy](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/PHILOSOPHY.md)
- [TTX design](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md)
- [Tetrodotoxin design](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md)
