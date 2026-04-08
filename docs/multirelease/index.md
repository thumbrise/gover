---
title: "multirelease — Publish-State Creator for Go Multi-Module Monorepos"
description: "Transform dev-state go.mod into publish-state. Strip replaces, pin requires, create detached commit with tags. Reads JSON module map from stdin. Zero knowledge of multimod internals."
head:
  - - meta
    - name: keywords
      content: go module release tool, golang publish go.mod, go mod replace strip, detached commit release go, go sub-module tagging, go multi-module publish, multirelease
  - - meta
    - property: og:title
      content: "multirelease — publish-state creator for Go multi-module monorepos"
  - - meta
    - property: og:description
      content: "Strip replaces, pin requires, create detached commit with tags. Reads JSON from stdin. The publish-state half of the multimod ecosystem."
---

# multirelease

> "Main is the kitchen. Tags are the restaurant menu. The customer never sees the kitchen."

::: warning Work In Progress
multirelease is a proof of concept. The [RFC](/reference/rfc-001-ecosystem) defines the capabilities. The implementation is catching up.
:::

## What

multirelease is the **publish-state creator** — one of four tools in the [multimod ecosystem](/guide/pipe-ecosystem). It transforms dev-state `go.mod` files into publish-state, creates a detached git commit, and tags it for release.

**Zero knowledge of multimod.** multirelease reads a JSON module map from stdin and a version string from arguments. It doesn't know how modules were discovered. It doesn't import multimod code. The JSON contract is the only interface.

## How It Works

```bash
# Dry-run: show the plan, touch nothing
multimod modules | multirelease v1.2.3

# Local: create detached commit + tags on your machine
multimod modules | multirelease v1.2.3 --write

# CI: create + push
multimod modules | multirelease v1.2.3 --write --push
```

### What happens with `--write`:

1. Tag current HEAD as `v1.2.3-dev` (traceability)
2. `git checkout --detach` (main is never touched)
3. Strip internal `replace` directives from all sub-module `go.mod`
4. Pin internal `require` versions to `v1.2.3`
5. Commit: `chore(release): v1.2.3 [multirelease]`
6. Tag: `v1.2.3` (root) + `otel/v1.2.3` (each sub)
7. `git checkout main` (return to dev-state)

Main **never leaves dev-state**. The publish-state commit is detached — accessible only via tag.

## Three Levels of Trust

| Mode | What happens | Who uses |
|------|-------------|----------|
| (default) | Dry-run: show plan, touch nothing | Developer verification |
| `--write` | Local: detached commit + tags | Developer local testing |
| `--write --push` | Commit + tags + push to origin | CI pipeline |

## Input Contract

multirelease reads the [Module Map JSON](/reference/rfc-001-ecosystem#_6-1-module-map-json-multimod-multirelease) from stdin:

```json
{
  "version": 1,
  "root": {"path": "github.com/example/project", "dir": "/abs/path"},
  "subs": [
    {"path": "github.com/example/project/otel", "dir": "/abs/path/otel",
     "requires": ["github.com/example/project"], "workspace_only": false}
  ]
}
```

Any tool that produces this JSON can drive multirelease. `multimod modules` is the default producer, but a `jq` script works too.

## See Also

- [multimod](/multimod/) — the dev-state half of the ecosystem
- [Pipe Ecosystem](/guide/pipe-ecosystem) — how all four tools work together
- [RFC-001](/reference/rfc-001-ecosystem) — the architectural source of truth
- [FAQ](/reference/faq) — "Detached commits are bad practice!" and other angry questions
