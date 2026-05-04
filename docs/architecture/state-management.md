# Global State Management (`appStore.js`)

## Architecture
The application uses Vue 3's Composition API (`reactive` and `readonly`) to build a lightweight, centralized global store (`src/core/store/appStore.js`). This store manages data across the 3-step pipeline: API Gateway → Studio View → Gallery Export.

## Resolving State Loss
**Issue:** During development, navigating between routes or refreshing the page would cause the `isAuthenticated` flag and the `apiKey` to reset to their default (`false` / `""`). This caused the Studio step to silently fail to authenticate and fallback to the "Mock" image generator.

**Solution:** LocalStorage Persistence
1.  **Hydration:** Upon initialization, `loadState()` attempts to read `dhaga-studio-state` from the browser's `localStorage`.
2.  **Syncing:** Actions that modify core authentication data (`setApiKey`, `setApiProvider`, `setAuthenticated`) automatically call `saveState(state)` to overwrite the JSON payload in local storage.
3.  **Result:** The user's session and provider choice now reliably survive hot-reloads and manual refreshes.

## Enforcing Single Generation
To prevent HTTP `429 Quota Exceeded` errors from the AI providers, the state management for shot angles (`shotToggles`) was intentionally modified.
Instead of allowing multiple booleans to be true simultaneously, `toggleShot(shotKey)` was rewritten to act as a radio group. It guarantees that `activeCount` is always exactly 1, limiting the pipeline to one generation request per click.
