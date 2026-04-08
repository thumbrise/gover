---
title: "multimod — Zero-Config Dev-State Guardian for Go Multi-Module Monorepos"
description: "Auto-discovery, workspace sync, replace management, go version alignment, multi-module go command iteration. Zero config. The dev-state half of the multimod ecosystem."
head:
  - - meta
    - name: keywords
      content: go multi-module tool, golang workspace sync, go.work automation, go mod replace management, go version alignment, zero-config go monorepo, go mod tidy multi-module
  - - meta
    - property: og:image
      content: https://thumbrise.github.io/multimod/og-image-multimod.png
  - - meta
    - property: og:title
      content: "multimod — zero-config dev-state guardian for Go multi-module monorepos"
  - - meta
    - property: og:description
      content: "Auto-discovery, workspace sync, replace management, go version alignment. The dev-state half of the multimod ecosystem."
---

# multimod

> "Every Go project with sub-modules writes its own release script. Nobody asks why."

::: warning Work In Progress
multimod is in active development. The [RFC](/reference/rfc-001-ecosystem) is solid, the proof of concept works, dog-fooding is live. Not production-ready yet. We're building in public — the RFC drives development, not the other way around.
:::

## What

multimod is the **dev-state guardian** — one of four tools in the [multimod ecosystem](/guide/pipe-ecosystem). It solves the problems that Go's toolchain doesn't: workspace sync, replace management, go version alignment, and multi-module command iteration — all with zero configuration.

**Always Apply.** Every invocation guarantees the filesystem matches the desired state. You cannot forget to sync.

## Why

Go is the only major language ecosystem where multi-module monorepos have no tooling support. Every other ecosystem solved this years ago:

- **Rust** — `cargo workspace` + `cargo-release`
- **Node** — `npm workspaces` + `changesets`
- **Java** — Maven multi-module + `mvn release`
- **Elixir** — umbrella projects with automatic `in_umbrella` → version transform

In Go, every project writes its own shell scripts. OTEL wrote 3000 lines of internal tooling. AWS has scattered scripts. Nobody published a reusable solution. See [Research](/reference/research) for the full ecosystem analysis.

## Commands

```
multimod                        — apply + status (syncs FS to desired state)
multimod go <args>              — transparent proxy with multi-module iteration
multimod modules                — JSON module map to stdout (for piping)
```

## Architecture

```
Boot → Discovery → desired State → Applier
```

See [Specification](./spec.md) for the full technical design.

## See Also

- [Specification](./spec.md) — architecture, commands, state contract
- [multirelease](/multirelease/) — the publish-state half of the ecosystem
- [Pipe Ecosystem](/guide/pipe-ecosystem) — how all four tools work together
- [RFC-001](/reference/rfc-001-ecosystem) — the architectural source of truth
- [FAQ](/reference/faq) — the angry user edition
