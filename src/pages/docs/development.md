---
layout: ../../layouts/DocsLayout.astro
title: Development
description: How to approach Tetrodotoxin changes so the resulting system remains clear, owned, and useful to people.
---

Tetrodotoxin is built around explicit ownership. Before choosing a file or
class, write down the semantic question and the object that should answer it.
If the same fact lands in two models, correct that boundary before adding a
bridge between them.

## Begin with the meaning

A useful ownership story is usually short:

- A Dialect owns new domain meaning.
- TTX exposes a contract already shared by independent domains.
- The Workspace connects or retains existing identities.
- A Terminal derives a product from completed meaning.
- Puffer coordinates those owners for a user request.

Do not raise an abstraction because two implementations merely look alike.
Shared concepts earn their place through independent semantic use.

## Read the contracts in authority order

The Website explains the public model and first product. Repository documents
carry the contracts needed to change it:

1. [TTX semantics](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_semantics.md)
   defines graph identity, certainty, concepts, Packs, Layouts, Interfaces, and
   Terminal boundaries.
2. [TTX design](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/ttx/ttx_design.md)
   explains why those contracts have their current shape.
3. [Tetrodotoxin design](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/tetrodotoxin_design.md)
   defines Workspace, Build, Environment, Package, plugins, and product
   negotiation.
4. The README beside an owner defines the concrete language or Terminal policy
   that remains in that domain.
5. Live owner contracts and validation show how much of the target is currently
   implemented.

Public design documents describe the intended architecture. An older
implementation shape does not override them merely because it still compiles.
When code and the public design conflict, make the discrepancy explicit before
adding an adapter around it.

## Know the owner map

- `ttx/` owns the host-neutral C ABI and semantic vocabulary.
- `tetrodotoxin/language/` owns common source and Dialect contracts.
- `tetrodotoxin/environment/` owns Toolchain and Workspace lifetime.
- Build, Environment, Package, Library, App, Scene, Render, and Shader own
  concrete language meaning.
- `tetrodotoxin/terminal/` owns independent product projections.
- Linker owns native composition.
- Puffer owns CLI/LSP transport, invocation raising, diagnostics, and atomic
  publication.
- `extension/` owns VS Code transport and presentation while using the installed
  Puffer SDK for semantics.

Provider plugins cross repository boundaries through the typed TTX C ABI.
Puffer must not include a concrete provider inventory, and a plugin must not
embed a private TTX runtime.

## Carry a change through its real boundary

A build proves that pieces agree mechanically. It does not prove that the
semantic contract works. Follow a change far enough to exercise the real owner,
the direct consumers, and an observable product or independent validator.

When reviewing the result, ask:

1. Does every semantic fact have one owner?
2. Do dependencies point toward that owner?
3. Does each consumer query the real graph instead of a copy?
4. Did the new path replace an older model rather than settle beside it?
5. Does the final proof exercise a real consumer?

For Build and provider changes, also ask:

1. Did Package remain host independent?
2. Did Build retain a request rather than a generated artifact?
3. Did Environment construct its own child Monograph?
4. Did Build select an exact imported provider identity rather than a class or
   registry name?
5. Was the child Package Workspace interpreted once after plugin bootstrap?
6. Did the representation leave only in a Terminal result?

## Write for people

Public documentation begins with what becomes possible and why it matters.
Comments record ownership, constraints, stage order, failure behavior, or a
tradeoff that readable code cannot explain by itself. They do not narrate the
next statement or recount the patch that introduced it.

Use ordinary capitalization for ordinary language concepts: a function, its
type, authored documentation, or a field in source. Capitalize an exact Dialect,
contract, or authored identity only when the prose intentionally refers to that
named TTX concept. Code formatting can make that distinction explicit when a
word such as `Type` names the contract rather than types in general.

The [project philosophy](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/PHILOSOPHY.md)
contains the full design direction. The
[contribution guide](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/CONTRIBUTING.md)
turns that direction into review guidance.

## Source repositories

| Repository                                                       | Owner                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Tetrodotoxin](https://github.com/tetrodotoxin-dev/Tetrodotoxin) | Languages, toolchain, runtime, editor support, applications, and validation |
| [Website](https://github.com/tetrodotoxin-dev/Website)           | The public Astro website and documentation shell                            |

Each repository owns independent Git history, dependencies, builds, and
validation. A change spanning both must report evidence for each product tree
separately.

## Validate from the repository boundary

The current native development checkout uses Clang and Bazel for repository
implementation work even though the public TTX project flow uses only the
installed Puffer SDK. From the Tetrodotoxin repository root:

```sh
bazel build //...
bazel run //validation:unit_tests --config=debug
```

Run focused targets first, then the bounded complete suite appropriate to the
change. A provider extracted into another repository owns its own revision,
build, tests, ABI checks, and release artifact. SDK assembly consumes that
artifact. It does not make the source repositories one build graph again.
