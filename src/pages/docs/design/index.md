---
layout: ../../../layouts/DesignLayout.astro
title: Background
description: Matt Kaes traces the custom-tooling work and integration problems that grew into Tetrodotoxin's approach to semantic infrastructure.
steps:
  - number: "A"
    title: Why build custom tooling?
    id: why-build-custom-tooling
  - number: "B"
    title: Small tools are easy until they have users
    id: small-tools-are-easy-until-they-have-users
  - number: "C"
    title: Domain-specific problems create domain-limited tools
    id: domain-specific-problems-create-domain-limited-tools
  - number: "D"
    title: A boundary carries its history
    id: a-boundary-carries-its-history
  - number: "E"
    title: Lowering is not federation
    id: lowering-is-not-federation
  - number: "F"
    title: Semantic layering points another way
    id: semantic-layering-points-another-way
  - number: "G"
    title: And so we got another programming language
    id: and-so-we-got-another-programming-language
  - number: "H"
    title: Okay, so where do we start?
    id: okay-so-where-do-we-start
---

## Preface

When someone pitches me a new project, I have one question: how good is your
tooling?

Well, actually, I tend to have a lot of questions. It just seems a lot more
sagacious to call out one than list my top twelve... Regardless, the response
always reveals more about the project than any other question I typically ask.

There is no _wrong_ answer: some of the best teams I've both run and worked for
have had the full range of near-perfect infrastructure and “production falls
over twice a week.” What really matters is how invested the team is in their
tools and systems. It turns out you can teach an old dog how to K8s! However,
it's nearly impossible to teach the dog to care.

My personal project portfolio covers a lot of ground. The classic two or three
custom game engines cover the software side, but I've always loved physical
production too. I've built several complete card games, and I suspect I've spent
more time extending my card-design software, analysis tools, and manufacturer
integration than I have *playing* them. Even in woodworking, I've enjoyed the
craft as much as the bookcases and tables that came out of it. I love a polished
result, but I'm always looking for an excuse to pull out the tools and start
building again.

This fascination bleeds into every project I've ever taken on. In 2018, I
decided to start gathering all of my performance projects into a single
optimized C++ runtime called `Perimortem`. Eventually, between the LLVM compiler
extensions, multiplatform optimizations, and language extensions, the toolchain
work slowly took over. Tetrodotoxin grew from one small part of that effort into
the main project in 2023.

At the start of 2026, I decided to give the research a proper public form,
partly for my own satisfaction and partly so I could stop retyping the same
explanations on Discord.

The rest of this page explains the tooling and infrastructure philosophy behind
Tetrodotoxin. The ten design chapters that follow work through the research from
the foundations of semantic tooling to the problems of ecosystem integration
I've directly explored over the last 15 years.

This project, if anything, is a work of love dedicated to my ever-understanding
family, friends, and colleagues who still put up with my obsessions. If you
somehow stumbled onto this project, I hope it gives you at least a fraction of
the joy I've had building and using it over the years.

Cheers,

*Matt Kaes*

## Why build custom tooling?

I can give you *dozens* of reasons *not* to build your own tooling and
infrastructure, but the canonical answer comes down to the time investment.

If you want to ship something like a game, you are far better off reaching
for an engine that does "almost" everything you want rather than building
the perfect solution. You can ship three or four games in the time it takes
to develop the perfect engine for one, although AI agents may tempt you to
believe otherwise. You would be better off literally waiting for Godot.

The reason we build custom tooling anyway can be deeply personal, but it often
comes down to that same answer: time.

The paradox makes sense to anyone who has delivered a long-running project. A
few months in, the project mostly works, but a handful of paper cuts slow you
down every day. No one knows those problems better than you, so you build a few
small tools, customize your infrastructure, tweak some configs. They work well.
You keep investing in them. A few years pass, and the next thing you know, you've
created TypeScript.

Or Godot.

Or React.

Problems are the source of custom tooling, and all of us build it constantly.
The reality is there are only two things that separate tools such as TypeScript
from a helper buried in one project:

- How readily the tool can escape its original context
- Whether someone has the tenacity to carry it toward its natural conclusion

## Small tools are easy until they have users

Okay, so really it's just one thing: users. But outside the rare occurrences
where the users just "show up," the prior two tend to be the limiting factor.

If you showed me a graph claiming that “large, impressive tools” were the most
common category of GitHub abandonware, the only thing I might question would be
the order of magnitude.

Getting a small, need-driven idea off the ground is easy, but in my experience
that is about five percent of the project. Even with coding agents, building a
foundation that people can actually use for an extended period of time can still
take a year or more of diligent work.

Language design makes the imbalance especially visible. The unique idea may be
small, but making it useful means carrying that meaning through parsers,
diagnostics, editor services, packages, bindings, runtimes, build tools, and
compilers. Rebuilding the surrounding ecosystem is not small at all.

Speaking of TypeScript, Anders Hejlsberg nails the point in a recent interview:

> **“The world needs another language as much as it needs another bullet in the
> head.”**
>
> — Anders Hejlsberg,
> [The Future of Programming Languages](https://www.youtube.com/watch?v=cywK3XYYJ2o&t=1980s)

Tetrodotoxin gets no exemption from this pattern. It could become the same kind
of ambitious custom tool whose maintenance cost eventually outruns its
usefulness. What motivates me is the chance to do the fundamental work and find
out whether the recurring integration problem can be reduced at its source
instead of wrapped in another layer of bespoke tooling. The project earns its
cost only if that foundation removes enough repeated work to pay for itself.

## Domain-specific problems create domain-limited tools

The interview points to all the machinery required to bring up a language, but
that leaves me with a larger question: why do we constantly rebuild so much of
it? Is it some Sisyphean curse cast upon our entire industry? DWARF gave us a
debugging format in the 90s. LLVM gifted us its backend starting in the 00s.
ANTLR 4 has been my recommended parser generator since 2015, and MLIR hit the
scene a few years after.

There is far more tooling than there was ten years ago, yet deploying something
competitive seems harder than ever.

A strong domain tool earns its value by turning local assumptions into precise,
productive abstractions. That focus is a strength because it keeps the design
grounded in a real problem. The cost appears when those semantics must be
projected into new source, compiler, and tooling models. Every neighboring
system must either adopt your new model (good luck), or you end up transitively
absorbing each system as a new requirement and treating it as another foreign
edge surrounded by adapters.

What we end up building is all the **semantic infrastructure**. That's where the
cost is. It's why neutral representations such as JSON fill the void between
most systems. You can almost carbon-date the maturity of a tool by the day it
added a JSON or Protobuf library.

This works. The world runs on it. There was a running joke at Google that your
job was simply to shuttle Protobuf around. I've personally shipped many
production systems that ultimately revolve around juggling JSON.

But your choice of semantic layer doesn't come for free.

## A boundary carries its history

C++ gave me one of the clearest examples of this tension. It gained enormous
leverage by extending C while retaining practical access to C ecosystems.
Stronger types, objects, lifetimes, generic programming, and compile-time
computation could all arrive without requiring every existing system to be
replaced first.

The bargain worked, but it also made the relationship with C part of every later
design decision. Neither language stopped evolving. The
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

This is not a failure of either language. The boundary delivered decades of
useful compatibility, but it was never passive. The same commitments that make
a language expressive become constraints that every future feature has to
negotiate.

C++ also gave me a hint that these boundaries do not have to classify everything
in advance. A `constexpr` function is not permanently compile-time or runtime
code. Its use and the facts available at that point decide whether it can become
an immutable result. That flexibility is powerful, but the meaning still lives
inside the C++ compiler and tooling ecosystem. Another language cannot
participate just because it understands the same fact.

You might think comparing C's effect on C++ with JSON semantics is a stretch,
but the tension between semantics and representation shapes tooling in more
similar ways than may be initially obvious.

## Lowering is not federation

The obvious escape from all this integration work is to move cooperation into
one common representation. That works beautifully when the destination is a
backend.

[LLVM IR](https://llvm.org/docs/LangRef.html) proves the point. Its own language
reference describes a low-level, typed, SSA-based representation designed to
support the complete compilation pipeline. That specificity is why LLVM can
optimize and lower so many languages effectively.

The same specificity becomes a constraint when LLVM IR is asked to serve as the
place where those languages share meaning. LLVM IR is not C, but funneling every
language through low-level functions, typed values, control flow, and memory
operations creates a broadly C-shaped semantic boundary. Everything that does
not fit must become a convention, metadata, a runtime call, or information the
frontend lowers away.

[MLIR](https://mlir.llvm.org/docs/Rationale/Rationale/) is a fantastic response
to exactly that pressure. Dialects let a compiler preserve several levels of
abstraction, while progressive lowering keeps useful semantics alive until the
pipeline is ready to choose a more specific form. Transformations can finally
meet the program at the level where their questions make sense.

That buys a tremendous amount of room, but the flow still points toward
target-specific representations. Each semantic layer eventually has to lower
into the next one, and anything the next representation cannot express stops
participating. MLIR delays the boundary instead of forcing every idea directly
into LLVM IR, but it does not make those semantic layers bidirectional.

Is bidirectional semantic cooperation such an unreasonable ask?

Yes, actually.

Neither project failed to solve a universal language problem because neither
set out to solve one. They are exceptionally good lowering infrastructure. The
difficulty begins when a shared system must preserve the meaning that made each
source language useful rather than progressively choosing which parts to leave
behind. A sufficiently small common model erases important distinctions. A
model expressive enough to describe every past, present, and future semantic
system becomes another language, another toolchain, and another translation
boundary.

Trying to resolve that tension with one more representation is how fourteen
competing standards become [fifteen](https://xkcd.com/927/).

The problem is not that lowering loses information. Trimming information is
often the point of an optimization pass. The problem begins when the
lowered representation becomes the only place where languages and tools are
allowed to cooperate. Symbols and debug builds exist because it is unreasonable
to put every demand on a representation that never made those semantic promises
in the first place.

## Semantic layering points another way

TypeScript realized that expecting JavaScript to "be better" just wasn't the
answer. Instead, out of classic necessity, it added semantic knowledge for
developers and tools without asking browsers to replace JavaScript. By avoiding
the representation-narrowing problem, an entire ecosystem gained a useful type
system. It even got to opt in gradually!

That does not solve every integration problem, but it shows that useful
semantics do not have to own the execution representation beneath them. We can
separate two directions:

- semantic information can be raised into a richer layer for tools and people
- an executable representation can still be projected into an established
  runtime.

So that's the language problem solved: transpilers. Except we are here to talk
about infrastructure and tools, and unless I missed something, browsers still
do not understand TypeScript semantics. They run the JavaScript left after
those semantics have done their work.

The real question worth asking is whether that relationship could be generalized
and made bidirectional:

> How can independently designed systems contribute their own meaning without
> asking every tool to reimplement every language or asking users to maintain
> another layer of adapters?

That question left me with three working ideas:

1. **Dialects raise meaning** from concrete languages and domains. They extend
   the useful part of the TypeScript relationship into a composable, on-demand
   system.
2. **Terminals project representation** only at the boundary where something
   enters or leaves the living semantic graph. Existing tools such as LLVM can
   remain powerful destinations without making their representations semantic
   authority inside the graph.
3. **Layouts isolate factual structure** so consumers can cooperate without
   acquiring the private machinery that produced it or letting one
   representation leak into another participant's contract.

## And so we got another programming language...

Now I know what you're thinking. After rejecting the universal-language answer,
I have given the solution a lexicon, a family of Dialects, and a project full of
`.ttx` files.

TTX can certainly be used as a programming language, but treating it as *the*
language gets the relationship backwards. A `.ttx` file is one lexical
projection of a semantic subgraph. The shared lexicon provides a compact graph
notation, while the selected Dialect supplies the domain-specific diction and
decides which semantic owners and relationships that source constructs.
In that sense, TTX source is closer to a lexical IR than a universal source
language. It describes one domain-shaped subgraph without claiming that every
graph must have been written as TTX source.

That lets each TTX Dialect pursue a maximal projection of one domain rather than
becoming a fragment of one universal language. Here, maximal means the strongest
factual projection that domain can currently establish. A Library source can
pursue execution semantics, a Build source can describe infrastructure, and a
Shader source can express GPU work without forcing any of them to absorb the
others. Completely abstract concepts can remain theory until a concrete domain
has something useful to say about them.

The larger goal is not to translate every language into TTX source. Every
language should be able to project its observable semantics into the graph. A C
frontend should remain C, just as a shader language should remain shaped for
GPU work. Each can preserve its own grammar and private machinery while its real
semantic owners answer the questions that other participants genuinely share.

My fundemental conjecture is this goes further than programming languages. Any reasonable
construction with observable semantics should have a projection into the graph.
It needs real owners for the subjects it exposes, factual answers for the
relationships it understands, and an isolated way to project data flow. The
graph does not need its private implementation or an exhaustive model of every
question that might ever be asked. If the construction remains completely
abstract, it can stay theory. As soon as it has an observable relationship, it
has something it can project.

The remaining design chapters build that claim from the bottom up. They are the
reason it is practical to give each TTX Dialect a small, domain-specific
vocabulary and revise it quickly. Every source describes its own subgraph using
the diction appropriate to that domain, while the graph carries the relationships
that let those independently designed pieces meet.

The reason certain TTX dialects take a source like form is much more practical:
I still needed a sufficiently difficult test bench to find out whether these
ideas held together. A real language forces source, partial meaning, tooling,
execution, packaging, and domain policy to meet in one system. The Tetrodotoxin
language family emerged in mid-2025 as that test bench, applying pressure
without replacing semantic infrastructure as the project's purpose.

The test bench also exposed a useful consequence of infrastructure as code.
Once the toolchain can describe its own meaning through the same graph, nothing
requires application behavior to use a separate foundation. When a Dialect
describes executable behavior, its TTX projection might as well be a programming
language to enable effective dogfooding.

Agents give me another reason to care about the boundary. They can extend a
system quickly, including in directions that subtly setup code to sprial over
multiple changes. If one experiment has to edit separate parser, editor, compiler,
package, and runtime models, the mistake can spread before the design proves itself.
Instead Tetrodotoxin can over a semantic tooling API that lets an agent add one owned
participant instead. If that part goes wild, we can nip it in the bud cleanly rather 
than untangle copies left across every neighboring system.

## Okay, so where do we start?

That is a lot of ground for one project to cover. Trying to design the entire
system at once is prone to recreate the universal model we just rejected.

Let's step back and imagine one name in source code. It may be a variable
declaration such as `int color;`, a function definition, a GPU resource, or
something from a language that has not been designed yet.

The parser, editor, compiler, package system, and runtime all want to discover
the same meaning for different work. If each consumer builds its own
representation, one authored name becomes several partial semantic models whose
disagreements no single copy has the authority to resolve.

Where should that meaning live?

The first design chapter starts there, not with a universal node model, graph
API, or another language IR. All we need to do to make the world is decide who
owns one "semantic" fact when several systems need it.

*How hard could it be?*

## Reading path

1. **Semantic ownership**: Solve our initial riddle: who owns one fact?
2. **Factual uncertainty**: Add time, context, and the honest answer “maybe.”
3. **Opaque projections**: Share useful structure without handing over the
   machinery that produced it.
4. **Emergent behavior**: Discover how much language behavior falls out of
   solving toolchain problems.
5. **Derived type systems**: End up with a programming language by mistake.
6. **Generative graphs**: Preserve the question and the machinery capable of
   producing future meaning, not only today's answer.
7. **Shared tooling**: Let editors and compilers ask questions of the same
   identities instead of rebuilding them.
8. **Live evolution**: Change one source without invalidating the world or
   inventing a global cache.
9. **Semantic federation**: Raise and project meaning across languages without
   turning TTX into the fifteenth standard.
10. **Self-hosting**: Turn TTX back on itself, replace the bootstrap, and keep
    every other language a peer.

### Normative contracts

- [Tetrodotoxin Philosophy](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/PHILOSOPHY.md)
- [TTX design](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md)
- [Tetrodotoxin design](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md)
