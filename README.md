# myportfolio

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Analytics (PostHog)

Product analytics is handled by [PostHog](https://posthog.com/). All tracking flows
through `src/utils/analytics.js`, which is a safe no-op when the project token is
missing, so local dev without env vars stays silent.

### Setup

1. Copy the project token (starts with `phc_`) from PostHog > Project Settings.
2. Set it in `.env`:

   ```sh
   VITE_POSTHOG_PROJECT_TOKEN=phc_your_token_here
   VITE_POSTHOG_HOST=https://us.i.posthog.com
   ```

   Use `https://eu.i.posthog.com` if your project lives in the EU region.

The project token is a public, write-only key and is safe to ship in the client
bundle. Never place a Personal API Key in a `VITE_` variable.

For production on Vercel, add both variables under Project Settings > Environment
Variables, then redeploy.

### What is captured

| Feature | Where |
| --- | --- |
| Autocapture (clicks, form changes, submits) | enabled in `initAnalytics()` |
| Pageviews | `capturePageview()` from the router `afterEach` hook in `src/App.vue` |
| Session replay (inputs masked) | `session_recording` in `initAnalytics()` |
| Error tracking | `app.config.errorHandler` in `src/main.js` |
| Person properties | `setPersonProperties()` called on guestbook submit (no `identify`, see note) |
| Custom events | `captureEvent()` (e.g. `guestbook_submitted`) |

To track a new event, import the helper and call it:

```js
import { captureEvent, setPersonProperties, resetUser } from '@/utils/analytics'

captureEvent('project_opened', { project_id: 'my-app' })
setPersonProperties({ plan: 'pro' })
resetUser()
```

This site has no auth, so there is no stable user ID to call `identify()` with. PostHog
guidance is explicit: never use a display name or email as a `distinct_id`, since a
collision merges people. Instead the guestbook submit calls `setPersonProperties()`,
which keeps PostHog's auto-generated ID and attaches `name` / `source` as person
properties.

Note the tradeoff: under `person_profiles: 'identified_only'`, `setPersonProperties()`
creates a person profile, so events from a guestbook visitor become identified (and
billed as such) from that point on. Visitors who never submit stay anonymous. If auth is
added later, call `identify(stableUserId, { name, email })` on login and `resetUser()`
on logout.

