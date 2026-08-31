# Parallel Pi Extension — Fast by default

Standalone extraction of Parallel's official Pi extension, with one behavioral patch:

- `web_search` defaults to Parallel **Fast** mode.
- Set `PARALLEL_SEARCH_MODE=turbo|fast|advanced` to override it.
- The private monorepo-only `@parallel-web/oauth` workspace package is vendored into this repo so it can build independently.

Upstream source: `parallel-web/parallel-npm-packages/packages/pi-extension` (MIT).

## Install from GitHub

```bash
pi install git:https://github.com/Darryl-Shi/parallel-pi-extension.git
```

Or clone and load locally:

```bash
git clone https://github.com/Darryl-Shi/parallel-pi-extension.git
cd parallel-pi-extension
npm install
npm run build
pi --no-extensions -e ./dist/index.js
```

## Authentication

Inside Pi:

```text
/login parallel
```

Or set an API key:

```bash
export PARALLEL_API_KEY=your_key_here
```

## Search mode

Fast is the default, even when `PARALLEL_SEARCH_MODE` is unset:

```bash
pi
```

Explicit Fast:

```bash
PARALLEL_SEARCH_MODE=fast pi
```

Temporarily use Advanced:

```bash
PARALLEL_SEARCH_MODE=advanced pi
```

Use Turbo:

```bash
PARALLEL_SEARCH_MODE=turbo pi
```

Any other value is rejected with a clear error rather than silently falling back to Parallel's API default.

## What it provides

- `web_search`
- `web_fetch`
- `/login parallel` OAuth through Pi's provider system
- `/parallel-login` authentication status
- `PARALLEL_API_KEY` fallback
- one Parallel `session_id` reused for the lifetime of each Pi session

Requires `@earendil-works/pi-coding-agent` 0.83.0 or newer.
