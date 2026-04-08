import {defineConfig} from 'vitepress'

export default defineConfig({
  title: 'multimod',
  description: 'Unix-way CLI ecosystem for Go multi-module monorepos. Zero-config workspace sync, replace management, detached-commit releases, sub-module tagging. The missing cargo-release for Go.',
  base: '/multimod/',
  sitemap: {
    hostname: 'https://thumbrise.github.io/multimod/',
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/multimod/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/multimod/favicon-96x96.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/multimod/apple-touch-icon.png' }],
    ['meta', { property: 'og:image', content: 'https://thumbrise.github.io/multimod/og-image-multimod.png' }],
    ['meta', {property: 'og:type', content: 'website'}],
    ['meta', {property: 'og:title', content: 'multimod — zero-config CLI ecosystem for Go multi-module monorepos'}],
    ['meta', {property: 'og:description', content: 'Workspace sync, replace management, detached-commit releases, sub-module tagging. The missing cargo-release for Go.'}],
    ['meta', {property: 'og:url', content: 'https://thumbrise.github.io/multimod/'}],
    ['meta', {name: 'twitter:card', content: 'summary'}],
    ['meta', {name: 'twitter:title', content: 'multimod — zero-config CLI ecosystem for Go multi-module monorepos'}],
    ['meta', {name: 'twitter:description', content: 'Workspace sync, replace management, detached-commit releases, sub-module tagging. The missing cargo-release for Go.'}],
    ['meta', {name: 'keywords', content: 'go multi-module monorepo tool, golang workspace management, go.work automation, go mod replace strip publish, cargo-release for go, go sub-module tagging, zero-config go monorepo, go mod tidy multi-module, detached commit release go, go module release automation'}],
  ],

  themeConfig: {
    nav: [
      {text: 'Guide', link: '/guide/getting-started'},
      {text: 'multimod', link: '/multimod/'},
      {text: 'multirelease', link: '/multirelease/'},
      {text: 'Reference', link: '/reference/rfc-001-ecosystem'},
      {text: 'Devlog', link: '/devlog/'},
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            {text: 'Getting Started', link: '/guide/getting-started'},
            {text: 'Pipe Ecosystem', link: '/guide/pipe-ecosystem'},
          ],
        },
      ],
      '/multimod/': [
        {
          text: 'multimod',
          items: [
            {text: 'Overview', link: '/multimod/'},
            {text: 'Specification', link: '/multimod/spec'},
          ],
        },
      ],
      '/multirelease/': [
        {
          text: 'multirelease',
          items: [
            {text: 'Overview', link: '/multirelease/'},
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            {text: 'RFC-001 — Ecosystem', link: '/reference/rfc-001-ecosystem'},
            {text: 'FAQ — Angry User Edition', link: '/reference/faq'},
            {text: 'Research', link: '/reference/research'},
            {text: 'Vision', link: '/reference/vision'},
          ],
        },
      ],
      '/devlog/': [
        {
          text: 'Devlog',
          items: [
            {text: 'About This Devlog', link: '/devlog/'},
            {text: '#1 — The Great Migration', link: '/devlog/001-the-great-migration'},
            {text: '#2 — Gate vs Observation', link: '/devlog/002-gate-vs-observation'},
          ],
        },
      ],
    },

    socialLinks: [
      {icon: 'github', link: 'https://github.com/thumbrise/multimod'},
    ],

    editLink: {
      pattern: 'https://github.com/thumbrise/multimod/edit/main/docs/:path',
    },

    footer: {
      message: 'Apache 2.0 · Built in public · Contributions welcome',
    },
  },
})
