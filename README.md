# multimod

[![CI](https://github.com/thumbrise/multimod/actions/workflows/ci.yml/badge.svg)](https://github.com/thumbrise/multimod/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](/LICENSE)

The missing `cargo-release` for Go.

Unix-way CLI ecosystem for Go multi-module projects. Zero-config workspace sync, replace management, detached-commit releases, sub-module tagging. No YAML. No shell scripts. Just `go.mod`.

> **Work in progress.** The [RFC](https://thumbrise.github.io/multimod/reference/rfc-001-ecosystem) is solid — three-round adversarial architecture review, eight decisions, ten known limitations documented honestly. The implementation is catching up. Dog-fooding is live — multimod manages its own multi-module monorepo.

## Wait — do you need this?

Quick test: do you have a Go project with multiple `go.mod` files in one repo — a core library plus optional extensions (OTEL, gRPC, Redis) in separate modules?

If yes — you have a **multi-module project**, not a monorepo. [Different problem, different tool.](https://thumbrise.github.io/multimod/guide/getting-started) multimod solves this one.

## The Ecosystem

Four tools. Each does one thing. Unix pipes between them.

```
clone → multimod → develop → multimod go → test → release pipeline
                                                        │
                                         version-bumper → multirelease → ghreleaser
```

| Tool | Domain | Status |
|------|--------|--------|
| **multimod** | Dev-state sync + module iteration | PoC, dog-fooding |
| **multirelease** | Publish-state creation (detached commit + tags) | PoC |
| **version-bumper** | Version determination from git history | Planned |
| **ghreleaser** | GitHub Release publication | Planned |

```bash
# Full CI release pipeline — one line
multimod modules | multirelease $(version-bumper) --write --push
```

Any tool is replaceable. `version-bumper` → `svu next`. `ghreleaser` → `gh release create --generate-notes`. The contracts matter, not the implementations.

## What multimod Does

```bash
# Sync everything: go.work, replace directives, go version alignment
multimod

# Test all modules
multimod go test ./...

# Tidy all modules
multimod go mod tidy

# JSON module map for piping
multimod modules
```

One command. Zero config. Idempotent. Run it again — nothing changes.

## What multirelease Does

```bash
# Dry-run: show the plan, touch nothing
multimod modules | multirelease v1.2.3

# Local: create detached commit + tags
multimod modules | multirelease v1.2.3 --write

# CI: create + push
multimod modules | multirelease v1.2.3 --write --push
```

Main **never leaves dev-state**. Publish-state lives on a detached git commit behind a tag. `go get @v1.2.3` gets clean `go.mod`. Developers never see broken state.

## The Problem We Solve

Every Go project with 2+ modules in one repo solves these problems manually:

1. `go.work` must list all modules — forget one, IDE breaks
2. `replace` directives must exist for local dev — forget one, `go mod tidy` fetches from registry
3. `go` version must be the same everywhere — drift causes subtle build differences
4. `go test ./...` doesn't test sub-modules — each needs its own run
5. Release requires stripping replaces, pinning requires, tagging each sub-module

Rust has `cargo-release`. Node has `changesets`. Java has `mvn release`. Go has shell scripts. Every project reinvents this wheel.

## Documentation

**[thumbrise.github.io/multimod](https://thumbrise.github.io/multimod/)** — full docs, RFC, devlog.

- [Getting Started](https://thumbrise.github.io/multimod/guide/getting-started) — install, first sync, the monorepo vs multi-module distinction
- [multimod](https://thumbrise.github.io/multimod/multimod/) — dev-state guardian, specification
- [multirelease](https://thumbrise.github.io/multimod/multirelease/) — publish-state creator, detached commits
- [Pipe Ecosystem](https://thumbrise.github.io/multimod/guide/pipe-ecosystem) — how the four tools compose
- [RFC-001](https://thumbrise.github.io/multimod/reference/rfc-001-ecosystem) — the architectural source of truth
- [FAQ](https://thumbrise.github.io/multimod/reference/faq) — the angry user edition
- [Devlog](https://thumbrise.github.io/multimod/devlog/) — design decisions, dead ends, lessons learned

## Origin

Born inside [thumbrise/resilience](https://github.com/thumbrise/resilience) — a fault tolerance library for Go that needed multi-module support. The shell scripts grew, broke, and got replaced with a tool. The tool outgrew its parent. [Read the full story.](https://thumbrise.github.io/multimod/devlog/001-the-great-migration)

## License

Apache 2.0