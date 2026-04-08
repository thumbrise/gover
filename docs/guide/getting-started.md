---
title: "Getting Started — Go Multi-Module Monorepo Tooling"
description: "You searched for a Go monorepo tool. But do you actually have a monorepo problem — or a multi-module problem? multimod solves the second one. Zero config. The missing cargo-release for Go."
head:
  - - meta
    - name: keywords
      content: go monorepo tool, go multi-module getting started, golang monorepo setup, go.work sync tool, go mod replace automation, multimod install, zero-config go monorepo, cargo-release for go
---

# Getting Started

::: warning Work In Progress
multimod is in active development. The [RFC](/reference/rfc-001-ecosystem) is solid, proof of concept works, dog-fooding is live. Not production-ready for general use yet.
:::

## Wait — do you need a monorepo tool?

You probably searched for "Go monorepo tool." Let's check if that's actually what you need.

**Do you have this?**
- One Git repo with multiple `go.mod` files
- A core library + optional extensions (OTEL, gRPC, Redis) in separate modules
- `go.work` that keeps breaking, `replace` directives everywhere, `go test ./...` that misses sub-modules
- Release day means stripping replaces, pinning versions, tagging each sub-module by hand

**If yes — you don't have a monorepo problem. You have a multi-module problem.**

A monorepo is a storage strategy: 15 microservices in one Git repo. You need Bazel, Nx, or Turborepo — tools that decide **which projects to build**.

A multi-module project is an architecture strategy: one product, many Go modules. You need a tool that manages **how those modules work together** — workspace sync, replace directives, version alignment, coordinated releases.

These are orthogonal problems. Different tools. multimod solves the second one.

::: tip Still not sure?
Quick test: do all your modules share one version number at release time? If yes — multi-module project, you're in the right place. If each module has its own independent version — that's a monorepo with independent packages, and multimod is not for you.
:::

## What is multimod?

multimod is a unix-way CLI ecosystem for Go multi-module projects. It covers the full lifecycle: clone → develop → test → release → publish.

The ecosystem consists of four tools:

| Tool | Domain | Status |
|------|--------|--------|
| [**multimod**](/multimod/) | Dev-state sync + module iteration | PoC, dog-fooding |
| [**multirelease**](/multirelease/) | Publish-state creation (detached commit + tags) | PoC |
| **version-bumper** | Version determination from git history | Planned |
| **ghreleaser** | GitHub Release publication | Planned |

You can adopt tools incrementally. multimod is useful without multirelease. multirelease is useful without multimod — pipe any JSON module map into it.

## The Problem

Every Go project with 2+ modules in one repo solves these problems manually:

1. **go.work** must list all modules — forget one, IDE breaks
2. **replace directives** must exist for local development — forget one, `go mod tidy` fetches from registry
3. **go version** must be the same everywhere — drift causes subtle build differences
4. **go test ./...** doesn't test sub-modules — each needs its own run
5. **Release** requires stripping replaces, pinning requires, tagging each sub-module

Rust has `cargo-release`. Node has `changesets`. Java has `mvn release`. Go has... shell scripts. Every project reinvents this wheel. We got tired of reinventing.

## Quick Start

```bash
# From your project root (where root go.mod lives):
go run github.com/thumbrise/multimod/multimod@latest
```

This single command:
- Discovers all `go.mod` files in subdirectories
- Generates/syncs `go.work`
- Adds missing `replace` directives to all sub-modules
- Aligns `go` version across all modules
- Reports what it did on stderr

Run it again — nothing changes. Idempotent.

## Multi-Module Commands

```bash
# Test all modules
go run github.com/thumbrise/multimod/multimod@latest go test ./...

# Tidy all modules
go run github.com/thumbrise/multimod/multimod@latest go mod tidy

# Vet all modules
go run github.com/thumbrise/multimod/multimod@latest go vet ./...
```

Non-multi-module commands pass through to `go` directly — multimod is transparent.

## Module Map

```bash
# JSON output for piping into other tools
go run github.com/thumbrise/multimod/multimod@latest modules
```

```json
{
  "root": {"path": "github.com/you/project", "dir": "/abs/path", "go_version": "1.25.0"},
  "subs": [
    {"path": "github.com/you/project/otel", "dir": "/abs/path/otel", "requires": ["github.com/you/project"]}
  ]
}
```

This JSON is the contract between tools. See [Pipe Ecosystem](./pipe-ecosystem) for the full pipeline.

## What's Next

- [multimod](/multimod/) — the dev-state guardian, specification and architecture
- [multirelease](/multirelease/) — how releases work (detached commits, three levels of trust)
- [Pipe Ecosystem](./pipe-ecosystem) — how all four tools compose
- [RFC-001](/reference/rfc-001-ecosystem) — the architectural source of truth (most current document)
- [FAQ](/reference/faq) — every angry question, answered honestly
