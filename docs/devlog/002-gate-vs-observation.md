---
title: "multimod Devlog #2 — Gate vs Observation"
description: "How a govulncheck failure exposed Go's missing staging area for pre-publish analysis, and why multirelease --write is Go's npm pack."
head:
  - - meta
    - name: keywords
      content: go module publish staging, proxy.golang.org immutable, npm pack go equivalent, multirelease write staging area, go ci gate observation, govulncheck ci blocking
---

# #2 — Gate vs Observation

> "Go has no staging area between 'version ready' and 'version published'. Push tag = permanent. We accidentally built the fix."

## The Trigger

resilience PR #38. We were extracting multimod into its own repository. CI failed. Not our code — `govulncheck` found 6 CVE in Go stdlib, published between CI runs. Our PR didn't touch dependencies.

This wasn't new. In 2024-2025, a PHP project with `composer audit` configured to fail CI — same pattern. Transitive dep got a CVE. Every PR failed. Developers added `--ignore` flags until nobody read audit output at all. The tool was useful. The configuration made it toxic.

## Gate vs Observation — The Context

This led to a simple classification. Two types of CI checks:

**Gate** — blocks merge, author can fix it. **Observation** — informs, doesn't block, author isn't responsible.

Three litmus tests: (1) can the author fix it now? (2) does the result depend only on PR files? (3) will a re-run next week give the same result? Any "no" → Observation.

`go test` passes all three — Gate. `govulncheck` fails all three — Observation. PR pipeline gates only what the author controls. Security checks belong in the release pipeline.

During adversarial review, DeepSeek proposed a fourth criterion (severity threshold) — we rejected it. Severity is a release pipeline concern. The developer cannot be guilty of exceeding any threshold. DeepSeek agreed and withdrew.

But this raised the real question.

## The Real Question

If security and stability checks belong in the release pipeline — **where exactly do you run them in Go?**

### The Dev-State Problem

In dev-state, go.mod contains `replace ../` directives. All internal deps resolve locally. `go list -m -json all` shows local paths, not registry versions. You can't analyze real dependency versions — they're hidden behind replaces.

### The Publish-State Problem

In publish-state, go.mod has real versions — no replaces, pinned requires. Perfect for analysis. But publish-state exists only on a detached commit behind a tag. And in Go, **tag = publication**.

### Go's Unique Gap

Every other ecosystem has a staging area:

| | npm | Cargo | Composer | **Go** |
|---|---|---|---|---|
| Create artifact locally | `npm pack` | `cargo package` | — | — |
| Test before publish | ✅ | ✅ | ✅ (push tag, test, delete) | **❌** |
| Publish | `npm publish` | `cargo publish` | Push tag (auto) | **Push tag (auto, immutable)** |
| Undo | `npm unpublish` (72h) | `cargo yank` | Delete tag + Packagist | **`go mod retract` (soft, new tag)** |

In npm, you `npm pack` → test → `npm publish`. Two steps. In Cargo, `cargo package` → test → `cargo publish`. In Composer, Packagist auto-indexes on tag push, but you can delete the tag and manually remove from Packagist — messy but reversible.

In Go, `proxy.golang.org` is an immutable cache backed by `sum.golang.org` — a tamper-proof transparency log. Once cached, a version **cannot be removed**. `go mod retract` is not deletion — it's a soft "please don't use this" that requires publishing yet another version. There is no `npm unpublish`. No `cargo yank` (which at least removes from the index). The version is there forever.

Go is the strictest ecosystem of all. Push tag = permanent publication. No staging area. No undo.

## The Discovery

And then we realized: we already built the fix.

`multirelease` has a two-phase flow:

| Mode | What happens |
|------|-------------|
| (default) | Dry-run: show plan, touch nothing |
| `--write` | Prepare: detached commit + tags locally |
| `--push` | Ship: atomically push a prepared release |
| `--abort` | Roll back: clean up local tags and commit |
| `--write --push` | All-in-one: prepare + ship in one step (CI mode) |

Like `git rebase` puts you in a rebase state, `--write` puts you in publish-state — on the detached commit, with clean go.mod files. You analyze right there. `--push` and `--abort` both return you to your original HEAD.

```bash
# 1. Prepare — switches to detached commit, you're in publish-state
multimod modules | multirelease v1.2.3 --write
# go.mod files are clean: no replaces, pinned versions
# you're on the detached commit — analyze right here

# 2. Analyze — no checkout needed, you're already in publish-state
govulncheck ./...                    # security
your-stability-checker               # stable→unstable deps
GOWORK=off go build ./...            # isolation

# 3a. Ship — push tags + return to original HEAD
multirelease --push

# 3b. Or abort — delete tags + return to original HEAD
multirelease --abort
```

This is Go's missing `npm pack`. The only staging area in an ecosystem that doesn't have one.

We didn't design it for this. The three-level trust model was designed for developer confidence — "look before you push". But it accidentally created the only pre-publish analysis capability in the Go module ecosystem. Now we're making it explicit: `--write` prepares, `--push` ships, `--abort` rolls back.

## What We Learned

1. **Go has no staging area between "version ready" and "version published."** npm, Cargo, Composer all have one. Go doesn't. This is a real, unaddressed gap.
2. **Dev-state hides real versions. Publish-state requires publication.** Both states are unanalyzable — dev-state has replaces, publish-state is behind an immutable tag. Catch-22.
3. **`multirelease --write` breaks the catch-22.** Local publish-state without publication. The staging area Go never provided.
4. **PR pipeline gates only what the author controls.** Security checks are observations in PR, gates in release. Gate vs Observation is the classification model.
5. **Three litmus tests are complete.** Responsibility, determinism, idempotency. Severity thresholds belong in the release pipeline, not PR.

---

*The tool that accidentally became Go's missing `npm pack`.*
