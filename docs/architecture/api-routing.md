# API Routing Architecture

## Overview
The application generates AI product imagery by routing requests through `generateImages.js`. This service acts as an abstraction layer between the UI components (`StudioView.vue`) and the specific vendor APIs.

## Routing Logic
When the user clicks "Generate", `StudioView.vue` bundles the current session into an `apiContext` object:
```javascript
const apiContext = {
  apiKey: "...",
  apiProvider: "gemini" | "openrouter",
  uploadedImage: { base64: "...", mimeType: "..." }
}
```

`generateImages.js` inspects `apiContext.apiProvider` and branches the request:
1.  **Mock Fallback:** If the `apiContext` is incomplete (missing key or image), it defaults to `generateMock()` which returns Lorem Picsum placeholders.
2.  **Google Gemini (`geminiService.js`):** If the provider is `gemini`, it routes directly to the Google AI Studio REST endpoint (`generativelanguage.googleapis.com`). It leverages Google's native `responseModalities: ["IMAGE"]` for direct base64 image generation.
3.  **OpenRouter (`openRouterService.js`):** If the provider is `openrouter`, it routes to `openrouter.ai/api/v1/chat/completions`. The payload is translated into the OpenAI-compatible Vision format required by OpenRouter.

## Security
*   **Client-Side Only:** All API routing and execution happens purely in the browser. API keys are never stored on a backend server; they remain exclusively in the local browser state.
*   **Gateway Validation:** Before routing any generation requests, the `validateKey.js` service intercepts the key at Step 1 and makes an initial, cheap verification request (`models.get` for Gemini, `/auth/key` for OpenRouter) to ensure the key is functional before admitting the user to the Studio.
