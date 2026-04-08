---
title: "multimod Vision — Roadmap for Go Multi-Module Ecosystem"
description: "Roadmap for multimod ecosystem: from proof of concept to stable release. Four tools, unix pipes, the missing cargo-release for Go."
head:
  - - meta
    - name: keywords
      content: go multi-module roadmap, golang monorepo tool, cargo-release for go, changesets for go, go module release automation
---

# Vision

::: info This document may be outdated
The [RFC-001](/reference/rfc-001-ecosystem) is the most current architectural document. This vision page reflects the original roadmap and may not match the current state. When in doubt — read the RFC.
:::

## The Pattern

Tools emerge from tools:

1. **longrun** (1500-line framework) → killed → **resilience** (`func(ctx, call) error`)
2. **Task runner lifecycle gap** → documented → waiting for someone to build `BeforeAll`
3. **Release shell scripts** (grep over JSON in YAML) → killed → **multimod**

Each time: concrete pain → honest research → minimal primitive → extract when ready.

## Current Status

Standalone repository `thumbrise/multimod`. Extracted from [thumbrise/resilience](https://github.com/thumbrise/resilience). Dog-fooding on itself.

- ✅ Boot — cwd is root, no traversal, .git warning
- ✅ Discovery pipeline — Parse, ValidateAcyclic, Enrich*
- ✅ Applier — sync go.work, go.mod, replaces, go version
- ✅ CLI — `multimod go <args>` proxy with multi-module iteration
- ✅ `multimod modules` — JSON output for piping
- ✅ `multirelease` — standalone binary, reads JSON, creates detached commit + tags
- ✅ Extraction — own repo, own CI, own docs
- 🔨 Stabilize release flow — edge cases, rollback, validation
- 🔮 `version-bumper` — conventional commits → version string
- 🔮 `ghreleaser` — GitHub Release creation (may just be `gh release create`)

**Success criteria:** strangers use it and don't file bugs about basic operations.

## Non-goals

- **Not a build system** — we don't replace `go build`
- **Not a package manager** — we don't replace `go get`
- **Not a CI tool** — we give you the model, you write the pipeline
- **Not a monorepo framework** — we solve Go multi-module projects, not monorepos (see [Getting Started](/guide/getting-started) for the distinction)
- **Not cross-language** — Go only

## The Bet

The Go ecosystem will grow more multi-module projects as the language matures. Libraries with optional integrations (OTEL, gRPC, Redis) need isolated dependencies. The tooling gap will become more painful, not less.

multimod bets that a zero-config, convention-based tool can fill this gap — the same way `cargo-release` filled it for Rust and `changesets` filled it for Node.
