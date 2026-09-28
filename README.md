# Logos Learning Labs

English-language website for Logos Learning Labs Inc., a Canadian company. Built with Astro and Mint UI, following the Logos company website's structure.
The source repository is [YushiNakazato/logoslearninglabs.com](https://github.com/YushiNakazato/logoslearninglabs.com).

Source work lives on `codex/learning-labs-redesign`. GitHub Pages publishes generated files from `main` at the repository root to [logoslearninglabs.com](https://logoslearninglabs.com/), with HTTPS enforced. The user authorized publishing the current redesign on 2026-09-28. Later deployments still require an explicit request to publish.

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

The root-level `CNAME`, Git metadata, tooling, and repository documentation are outside Astro's public source directory and excluded from local builds. Building does not publish or change the live site's domain configuration. Local builds always retain `noindex` and `public/robots.txt` crawler exclusions, even if the parent shell has `SITE_PUBLIC=1`.

## Source and publishing

Normal source commits may be pushed to the corresponding nonpublishing feature branch after reviewing the diff and running appropriate checks. A source push is distinct from permission to publish.

For an explicitly approved deployment:

```sh
pnpm build:production
pnpm check:production
```

These commands generate and validate the ignored `dist-production/` directory, including indexable metadata, a canonical URL, `robots.txt`, `sitemap.xml`, and exact copies of the existing `CNAME` and `.nojekyll`. Only Mint UI runtime files are included. Source, build tools, repository documentation and private local files remain excluded.

Stage the verified output in a separate clean checkout of the existing `main` branch, review the complete deployment diff, commit, and push normally. Do not merge the source branch into `main`, force-push, change DNS, or recreate Pages. Check the GitHub Pages build result and live HTTPS page/assets after pushing. The ignored `.local/pages-deploy/` directory can be used for this publishing checkout; do not copy that directory into build output.

Mint UI is pinned to 0.6.1. Do not edit distributed files under `public/vendor/`; site-specific appearance belongs in `public/styles/site.css`. Shared library changes belong in `C:/Users/yushi/Desktop/physical-ai-ma-praxis/packages/mint-ui/` under that project's instructions.
