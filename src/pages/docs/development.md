---
layout: ../../layouts/DocsLayout.astro
title: Development
description: How to approach Tetrodotoxin changes so the resulting system remains clear, owned, and useful to people.
subheader: Contributing
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

## Write for people

Public documentation begins with what becomes possible and why it matters.
Comments record ownership, constraints, stage order, failure behavior, or a
tradeoff that readable code cannot explain by itself. They do not narrate the
next statement or recount the patch that introduced it.

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
