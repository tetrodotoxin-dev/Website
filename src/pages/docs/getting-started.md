---
layout: ../../layouts/DocsLayout.astro
title: Getting started
description: Build a Hello World executable from scratch with Puffer and four ordinary TTX sources.
---

Building a first Tetrodotoxin application starts with `puffer`, the bootstrap
command and editor host supplied by the SDK, which can load source, construct
its semantic graph, select products, and publish them without a separate project
generator or build manifest.

The SDK keeps Puffer, the standard Dialect and Terminal providers, the Package
repository, native runtimes, and the optional VS Code extension in one
installation. Providers remain explicit in the Build source, so self-contained
does not mean hidden configuration.

Our first project uses four hosted Dialects:

- Package describes what belongs together
- Library implements the executable behavior
- App describes how the process starts
- Build selects the Environment and executable product

Together they produce a small `Hello, World!` application while introducing the
same composition used by larger Tetrodotoxin projects.

## Install the SDK

Download the SDK for the current host from [Tetrodotoxin
Releases](https://github.com/tetrodotoxin-dev/Tetrodotoxin/releases), unpack it,
and place its `bin` directory on `PATH`.

```sh
command -v puffer
```

Keep the SDK layout together because moving only the Puffer executable would
leave behind the provider plugins and standard Package repository its
Environment can resolve.

### VS Code

Install the VSIX shipped by the same SDK to use Tetrodotoxin in VS Code:

```sh
code --install-extension <puffer-sdk>/extensions/tetrodotoxin.vsix
```

The extension launches the installed Puffer through `PATH`, or through one
explicit SDK path in its settings. Its language server observes the same live
Workspace used by command-line production, which provides diagnostics,
formatting, hover, and go to definition without another editor-only graph.

## Workspace hosts every Dialect

The project directly uses four Dialects, but Puffer already contains a minimum
Tetrodotoxin toolchain before it opens any of our files. Its Workspace bootstrap
frontend hosts the Package, Library, App, and Build Dialects we author rather
than becoming a fifth project concern.

Workspace's built-in frontend uses TTX lexical source to construct graph data
and select the child Dialect that owns each source body. We use that frontend
throughout this tutorial because every required provider already understands
it. Tetrodotoxin itself does not require every frontend to use TTX syntax. A
different frontend can enter through the plugin boundary while preserving its
own language rules.

This is the first example of implementation serving the graph without becoming
its semantic foundation. The Design discussion of [replaceable bootstrap
implementations](/docs/design/the-self-hosting-horizon/#bootstrap-implementations-are-replaceable)
follows that idea into self-hosting.

Every source Dialect hosted by Workspace remains a real semantic owner rather
than becoming another Puffer mode. Package, Library, App, Build, Scene, Render,
Shader, and plugin-provided languages can all enter through the same source
envelope.

Workspace reads two common facts before delegating the rest of the file:

1. Opening documentation explains the source's purpose and remains available to
   tools
2. `dialect : Name` selects the installed child Dialect that interprets the
   remaining body

```ttx
// Documentation describes this source's purpose in the graph.
//
// Workspace delegates the remaining source to the selected child Dialect.
dialect : SomeDialect;
```

The selected Dialect receives the same retained source transaction, so its
objects keep their documentation, tokens, source locations, and diagnostic
context. Workspace owns the common entry contract while the child Dialect owns
the meaning of everything after the selector.

```text
Puffer
└── Workspace bootstrap frontend
    ├── Package source
    ├── Library source
    ├── App source
    └── Build source
```

This hosting relationship explains why every file starts the same way even
though their bodies describe different domains, and why Puffer needs only a
source path: the Workspace selector finds the semantic owner without a
`--language`, `build`, or `package` command mode.

Create a folder named `project` and add one source for each hosted Dialect:

- `app.ttx`: App Dialect
- `build.ttx`: Build Dialect
- `package.ttx`: Package Dialect
- `main.ttx`: Library Dialect

```text
project/
├── app.ttx
├── build.ttx
├── package.ttx
└── main.ttx
```

## TTX Lexical

Before we begin, let's familiarize ourselves with the common TTX idioms that
Puffer's built-in Dialects share. That lets the rest of the tutorial focus on
what each Dialect adds.

Package, Library, App, Build, Scene, Render, and Shader use one canonical TTX
lexicon and selected `Tetrodotoxin::Language` parser fragments. Those shared
parsers give the built-in source family familiar ways to spell documentation,
definitions, packs, layouts, attributes, and type routes.

TTX itself is not this source language. TTX is the host-neutral semantic
foundation that lets independently designed languages participate without
adopting one canonical syntax or semantic model. A plugin-provided Dialect may
reuse this lexicon, extend it, or bring a different frontend. The distinction is
the same one used when [C and other languages raise their own
meaning](/docs/design/meaning-crosses-languages/#c-and-other-languages-raise-their-own-meaning)
while keeping their own language rules.

Even among the built-in Dialects, shared spelling does not imply shared
semantics. The Dialect that accepts a form still owns what that form means.

### Comments become documentation

Consecutive `//` lines are not discarded after parsing. They become
documentation attached to the source or definition that follows, which lets
hover, generated references, Packages, and other tools ask the real semantic
owner for authored prose.

```ttx
// Writes one greeting to the process terminal.
//
// The App Dialect selects this function as its entry.
public run : func = [] -> [] {
}
```

The canonical spelling includes one space after `//`. An empty `//` line keeps
paragraph separation inside the documentation block.

### Definitions share one prefix

Many built-in Dialects create named identities through a common definition
prefix:

```text
documentation
attributes
Visibility Modifiers Name : Qualifier
```

The pieces have separate jobs:

- documentation explains the identity
- attributes such as `@capability("vector")` retain optional facts for the
  consumer that understands them
- `public`, `private`, or `expose` controls authored visibility
- modifiers such as `state` and `const` refine the declaration when its Dialect
  accepts them
- the name gives other source a spelling to resolve
- the qualifier after `:` tells the concrete Dialect which declaration model to
  construct

For example, Library understands `func`, Package understands `alias`, and
another Dialect may introduce another qualifier without changing the common
definition parser.

The built-in TTX source family conventionally uses uppercase names for types
and other type-like identities, while values, functions, fields, and other
addressable names begin with lowercase letters. The parser preserves the exact
authored name rather than normalizing it for another language.

### Packs carry values

A Pack is an ordered flow of values. Parentheses commonly provide a Pack to a
Callable, Generic, or another receiving concept. Entries may be positional or
named:

```ttx
package(.name = "Example.Hello", .version = "1.0")
```

The leading dot introduces a named entry. `=` supplies the value for that name.
The receiver owns the accepted names, their order, and how the values are
interpreted.

### Layouts describe shape

A Layout describes the shape a Pack may carry without supplying the values
themselves. Square brackets contain positional types or named slots:

```ttx
[U64, Bool]
[.value : U64, .enabled : Bool]
```

Named Layout entries use `:` because they promise a descriptor rather than
assigning a value. Empty brackets, `[]`, describe empty flow. That is why the
Library function signature `[] -> []` means no parameter values and no result
values.

Packs and Layouts deliberately remain different. A Pack answers "what values
are flowing now?" A Layout answers "what shape can this flow have?" Keeping
those questions separate lets a Dialect expose useful partial structure without
turning that structure into another semantic owner.

### Type routes preserve relationships

`::` continues a named type route one segment at a time, while brackets after a
type apply generic arguments:

```ttx
Memory::Dynamic::Bytes
View[U8]
```

These spellings retain relationships to the identities they reach. They do not
flatten the complete route into one global name. Other operators may appear
across several Dialects, but the selected Dialect still owns their semantic
policy.

Commas separate entries and may trail the final entry in a multiline Pack or
Layout. Semicolons finish declaration statements. Braces delimit bodies owned
by the concrete Dialect.

The following sections build the graph from its durable Package boundary through
execution, process policy, and finally local product configuration.

## Package

Package describes what belongs together by giving the project a durable name,
connecting its source files and Package dependencies, and choosing which
semantic identities other sources may reach without selecting a compiler,
target, or output directory.

Add the following to `package.ttx`:

```ttx
// Exports one Hello World application from this Package.
dialect : Package;

package(.name = "Example.Hello", .version = "1.0");
public Application : alias = source("app.ttx");
```

The opening comment is documentation retained by the source graph. Every TTX
source begins with documentation before selecting its Dialect.

`package(...)` gives this Package the coordinate `Example.Hello@1.0`. Package
coordinates identify semantic dependencies and published archives without
making a filesystem path part of program identity.

The final line introduces two more common ideas:

- `source("app.ttx")` asks the Workspace to interpret another source beneath
  this Package root
- `alias` keeps a live relationship to the identity produced by that source
- `public Application` gives that relationship the exported name `Application`

Package does not copy the App into a Package record. It preserves how to reach
the App, so editor tools and product Terminals observe the same identity.

## Library

Library is the general-purpose execution Dialect, owning types, functions,
expressions, control flow, and runtime values. Our first Library source creates
one function that writes a line to the terminal.

Add the following to `main.ttx`:

```ttx
// Writes the first message produced by the application.
dialect : Library;

public Memory : alias = package(.name = "Perimortem.Memory", .version = "1.0");
public System : alias = package(.name = "Perimortem.System", .version = "1.0");

using Memory;

public run : func = [] -> [] {
  state message := Dynamic::Bytes -> copy("Hello, World!" -> get_view());
  System::Terminal -> write_line(message)?;
}
```

The two `package(...)` expressions refer to standard semantic Packages by
coordinate. `Perimortem.Memory` supplies owned byte storage, while
`Perimortem.System` supplies the terminal API. They do not select native
libraries. The Build Environment later supplies providers for the current host.

`using Memory` makes the public names exported by the Memory Package available
as fallback context. That is why the function can refer to `Dynamic::Bytes`
without spelling the complete Package route each time.

The function declaration reads from left to right:

- `public run` gives the function a name that another source may reach
- `func` selects the Library function model
- `[] -> []` means the function receives no values and returns no values
- `state message` creates a runtime value whose type is inferred from the
  expression on the right

The string literal first exposes a byte View. `Dynamic::Bytes -> copy(...)`
creates owned bytes suitable for the System API. `write_line` appends the line
ending and returns whether the write completed. The postfix `?` propagates an
unsuccessful result instead of continuing the function.

## App

Library describes what the program does. App describes how a finished process
starts and which application policy surrounds it. This separation lets the
same Library code participate in terminal, windowed, service, test, or future
application models without embedding those decisions in the function.

Add the following to `app.ttx`:

```ttx
// Starts Hello World and invokes its Library entry function.
dialect : App;

private Main : alias = source("main.ttx");

runtime = Terminal {}

lifecycle = Program {
  start Main -> run,
}
```

`private Main` gives App a local route to the Library source. The Package
exports only the App, so this implementation detail does not become another
public Package identity.

`runtime = Terminal {}` selects the terminal startup profile. It asks for
ordinary process input and output without a window or Scene stack.

`lifecycle = Program` selects one exact Static Callable as the process entry.
The entry happens to be named `run`, but App does not require a conventional
`main` spelling. It only requires an empty input Layout and an empty result
Layout.

## Build

Build describes how exported Package identities become products in the current
Environment. It owns invocation inputs, selected Terminal providers, and
confined output paths. It does not change the semantic Package to match the
machine performing the Build.

Add the following to `build.ttx`:

```ttx
// Builds Hello World with providers from the installed SDK.
dialect : Build;

private Product : alias = source("package.ttx");

environment = Environment {
  .output_root = "build",
  .reachable_roots = [".", sdk],
  .plugins = [
    sdk("Tetrodotoxin.Library"),
    sdk("Tetrodotoxin.App"),
    sdk("Tetrodotoxin.LLVM"),
    sdk("Perimortem.System"),
  ],
}

public Application : product = Product::Application {
  .terminal = sdk("Tetrodotoxin.LLVM")::NativeExecutable,
};
```

`Product` is a live Reference to `package.ttx`, so Build consumes that source
graph directly rather than creating `package.ttxp` and restoring it to reach
source already present in the checkout.

The Environment block supplies the infrastructure visible to this Build:

- `output_root` confines published files beneath `build/`
- `reachable_roots` permits project-relative and SDK-relative inputs
- `plugins` imports the exact Dialect, Terminal, and runtime providers needed by
  this application

Build owns the child relationship but does not interpret those Environment
fields. Environment loads the plugins, constructs the child Toolchain and
Workspace, and interprets the Package source once.

The final declaration requests one product from the exported
`Product::Application` identity. `NativeExecutable` consumes the completed App
and every Library identity it reaches. LLVM produces CPU objects and Linker
composes the final executable. Those target representations leave the graph
rather than becoming fields on Package or App.

## Build the application

Your project now contains a complete infrastructure request and semantic
program. From the `project` directory, invoke the Build source:

```sh
puffer build.ttx
```

Puffer does not need a `build` subcommand because the selected source already
says which Dialect owns the request. The command follows this path:

```text
build.ttx
└── Environment loads the requested providers
    └── package.ttx exports Application
        └── app.ttx selects Terminal startup and Main::run
            └── main.ttx writes Hello, World!
```

After every required query becomes complete, the selected Terminal publishes
the executable beneath the authored output root.

Run it directly:

```sh
./build/Application
```

The process prints:

```text
Hello, World!
```

Change the string in `main.ttx`, invoke `puffer build.ttx` again, and run the
same product. No generated project or sidecar becomes another source of
meaning.

## See the same graph in VS Code

Open the checkout folder after installing the SDK extension. The extension
finds `build.ttx`, launches `puffer -lsp=<pipe>`, and constructs the same
Environment and provider set used by the command line.

Hover over `Application`, follow `Main` to `main.ttx`, and format one of the
files. Navigation, completion, diagnostics, and native production observe the
same Package, App, and Library identities. The extension does not reconstruct
an editor-only symbol graph.

## Archive the Package independently

Package production is useful for distribution and source-free dependencies,
but it is not a prerequisite for the local Build:

```sh
puffer package.ttx
```

This invocation emits only:

```text
Example.Hello/1.0/package.ttxp
```

The archive reconstructs fresh semantic identities with the same promised
behavior. It contains no Build profile, plugin path, compiler choice, native
object, or output directory.

## Where to go next

You now have the minimum complete path from source to executable. The next step
depends on which part of the system you want to explore.

### Grow the program

- Read the [Library guide](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/library/README.md)
  for types, functions, structs, objects, control flow, initialization, and
  Package imports
- Read the [App guide](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/app/README.md)
  for terminal, headless, and windowed startup plus application lifecycle
- Read the [Package guide](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/package/README.md)
  for dependencies, resources, exports, archives, and source-free restoration

### Add another domain

- [Scene](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/scene/README.md)
  owns interactive state, lifecycle, and signals
- [Render](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/render/README.md)
  describes GPU contracts independently from their implementation
- [Shader](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/shader/README.md)
  implements those contracts with GPU programs and hosted Library behavior

These Dialects join the same Package, editor, and product flow. Adding one does
not require a second Puffer or language server.

### Understand the toolchain

- [Puffer](/puffer/) explains why one source selects the complete command
- [Core concepts](/docs/core-concepts/) introduces the ownership vocabulary used
  across the platform
- [Design](/docs/design/) derives the model from the original toolchain problem
- [API reference](/docs/reference/) shows generated semantic identities and
  their relationships
- [Development](/docs/development/) maps the repositories and contribution
  expectations

When you are ready to change how products are selected or where providers come
from, continue with the
[Build](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/build/README.md),
[Environment](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/environment/README.md),
and [plugin](https://github.com/tetrodotoxin-dev/Tetrodotoxin/blob/tetrodotoxin-1.0/tetrodotoxin/plugin/README.md)
guides.
