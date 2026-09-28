# Logos Learning Labs — local redesign draft

English-language website draft for Logos Learning Labs Inc., a Canadian company. Built with Astro and Mint UI, following the Logos company website's structure.
The source repository is [YushiNakazato/logoslearninglabs.com](https://github.com/YushiNakazato/logoslearninglabs.com).

This redesign is being developed on `codex/learning-labs-redesign` for local review. The live website has not been updated by this work. Do not merge this branch into `main`, push to a publishing branch, or deploy without a separate explicit user request to publish.

## Local preview

Use Node.js 22.12.0 or later and pnpm 11.19.0. Astro is pinned to 7.3.4, matching the version installed in the Logos company website.

```sh
pnpm install
pnpm dev
```

Open <http://127.0.0.1:4333>. Astro's development server listens only on the loopback interface. Stop it with Ctrl+C before starting the build preview on the same port.

Pages, layouts, and components live under `src/`. Public assets live under `public/assets/`, site styles under `public/styles/site.css`, and browser interactions under `public/scripts/site.js`. Mint UI is installed under `public/vendor/mint-ui/0.6.1/`.

## Checks and local build

```sh
pnpm build
pnpm check
pnpm preview
```

`build` runs Astro's static build into the ignored `dist/` directory. `check` validates browser JavaScript syntax and runs the site verification script against the build. `preview` serves the build at <http://127.0.0.1:4333>. As in the company website, an Astro build hook removes Mint UI documentation and examples from the output, preserving only these runtime files:

- `vendor/mint-ui/0.6.1/theme.css`
- `vendor/mint-ui/0.6.1/components.css`
- `vendor/mint-ui/0.6.1/mint-ui.js`

The root-level `CNAME`, Git metadata, tooling, and repository documentation are outside Astro's public source directory and are excluded from the build. Building does not publish or change the live site's domain configuration. Keep the draft's `noindex` metadata and `public/robots.txt` crawler exclusion during local review.

## Source and publishing

Normal source commits may be pushed to the corresponding nonpublishing feature branch after reviewing the diff and running appropriate checks. A source push is distinct from permission to publish. The existing tracked `CNAME` and `.nojekyll` files describe the live site's setup and should remain untouched during this local redesign.

Mint UI is pinned to 0.6.1. Do not edit distributed files under `public/vendor/`; site-specific appearance belongs in `public/styles/site.css`. Shared library changes belong in `C:/Users/yushi/Desktop/physical-ai-ma-praxis/packages/mint-ui/` under that project's instructions.
