---
title: "Pipe Ecosystem — How multimod Tools Work Together"
description: "Four CLI tools, unix pipes, JSON contracts. multimod modules | multirelease | version-bumper | ghreleaser. Each tool does one thing. Any tool is replaceable."
head:
  - - meta
    - name: keywords
      content: go multi-module pipeline, unix pipe cli tools, go release pipeline, multimod multirelease, json contract cli, composable go tools, go module release automation
---

# Pipe Ecosystem

> "Each tool does one thing. Tools communicate through stdin/stdout/JSON. Any tool is replaceable with an alternative that speaks the same contract."
> — [RFC-001, §3.1](/reference/rfc-001-ecosystem)

## The Full Pipeline

```
clone → multimod → develop → multimod go → test → release pipeline
                                                        │
                                         version-bumper → multirelease → ghreleaser
```

```bash
# CI release pipeline — one line
multimod modules | multirelease $(version-bumper) --write --push

# Then create GitHub Release
gh release create "$VERSION" --generate-notes
```

## Four Tools, Four Domains

| Tool | What it does | Input | Output | Status |
|------|-------------|-------|--------|--------|
| [**multimod**](/multimod/) | Syncs dev-state, iterates modules | Filesystem | Synced FS, JSON module map | PoC |
| [**multirelease**](/multirelease/) | Creates publish-state | JSON (stdin) + version (arg) | Detached commit + tags | PoC |
| **version-bumper** | Determines next version | Git history | Version string (stdout) | Planned |
| **ghreleaser** | Creates GitHub Release | Version + git history | GitHub Release | Planned |

## The Contract

The [Module Map JSON](/reference/rfc-001-ecosystem#_6-1-module-map-json-multimod-multirelease) is the primary contract between tools:

```bash
multimod modules   # → JSON to stdout
```

```json
{
  "version": 1,
  "root": {"path": "github.com/example/project", "dir": "/abs/path", "go_version": "1.25.0"},
  "subs": [
    {"path": "github.com/example/project/otel", "dir": "/abs/path/otel",
     "requires": ["github.com/example/project"], "workspace_only": false}
  ]
}
```

Any tool that produces this JSON can drive multirelease. Any tool that reads it can consume multimod's output. The contract is the interface, not the implementation.

## Replaceable Parts

Every tool in the ecosystem can be replaced:

```bash
# Replace version-bumper with svu
multimod modules | multirelease $(svu next) --write --push

# Replace version-bumper with cocogitto
multimod modules | multirelease $(cog bump --auto --dry-run) --write --push

# Replace ghreleaser with gh CLI
gh release create v1.2.3 --generate-notes

# Replace ghreleaser with git-cliff + gh
git-cliff -t v1.2.3 | gh release create v1.2.3 --notes-file -

# Replace multimod modules with a jq script
cat my-modules.json | multirelease v1.2.3 --write
```

**Litmus test from the RFC:** can a user replace any single tool with a shell script or third-party alternative? If not — the boundary is wrong.

## Adoption is Incremental

You don't need all four tools:

- **Just multimod** — sync go.work, replaces, go version. Run `multimod go test ./...`. Never touch release tools.
- **multimod + multirelease** — add release automation when ready. Specify version manually.
- **Full pipeline** — add version-bumper when you want automated version determination. Add ghreleaser for GitHub Releases.

Each tool is useful in isolation. The ecosystem grows with your needs.

## See Also

- [RFC-001](/reference/rfc-001-ecosystem) — the architectural source of truth
- [multimod](/multimod/) — the dev-state guardian
- [multirelease](/multirelease/) — the publish-state creator
