---
layout: home

hero:
  name: multimod
  text: The missing cargo-release for Go
  tagline: 'Unix-way CLI ecosystem for Go multi-module monorepos. Zero-config workspace sync, replace management, detached-commit releases, sub-module tagging. No YAML. No shell scripts. Just go.mod.'
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/getting-started
    - theme: alt
      text: RFC-001
      link: /reference/rfc-001-ecosystem
    - theme: alt
      text: GitHub
      link: https://github.com/thumbrise/multimod

features:
  - icon: 🚧
    title: Work In Progress
    details: "Honest status: RFC is solid, proof of concept works, dog-fooding is live. Not production-ready yet. We're building in public — the RFC drives development, not the other way around."
    link: /reference/rfc-001-ecosystem
    linkText: Read the RFC →
  - icon: 🔍
    title: Zero Configuration
    details: "Directory structure is the config. A go.mod in a subdirectory = a sub-module. No YAML, no TOML, no .multimod.json. Discovery is automatic, deterministic, and auditable."
  - icon: 🔄
    title: Always Synced
    details: "Every invocation guarantees the filesystem matches the desired state. go.work, replace directives, go version alignment — all synced. You cannot forget. You cannot drift."
  - icon: 🏷️
    title: Detached-Commit Releases
    details: "Publish-state lives on a detached git commit behind a tag. Main never leaves dev-state. go get @v1.2.3 gets clean go.mod. Developers never see broken state."
    link: /multimod/spec
    linkText: How it works →
  - icon: 🔗
    title: Unix Pipe Ecosystem
    details: "multimod modules | multirelease v1.2.3 --write --push. Each tool does one thing. JSON contracts between them. Any tool is replaceable with a shell script."
    link: /guide/pipe-ecosystem
    linkText: See the pipeline →
  - icon: 🚀
    title: Dog-Fooding
    details: "multimod manages its own multi-module monorepo. The tool is built with the tool. If it breaks us, we fix it before it breaks you."
    link: /devlog/001-the-great-migration
    linkText: Read the origin story →
---
