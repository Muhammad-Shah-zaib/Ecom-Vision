# OpenRouter Integration & Limitations

## Implementation Details
The application supports routing API calls through OpenRouter.
1.  **Validation (`validateKey.js`):** A real GET request is made to `https://openrouter.ai/api/v1/auth/key` to ensure the user's OpenRouter API key is valid before entering the Studio.
2.  **Service Integration (`openRouterService.js`):** The app uses the standard OpenAI Chat Completions endpoint (`/v1/chat/completions`) required by OpenRouter. It attaches the user's image via the `image_url` property in a multimodal message array.

## The Gemini 2.5 Flash Limitation on OpenRouter
The user requested to use `google/gemini-2.5-flash` through OpenRouter to generate images.

**Critical Limitation:**
*   OpenRouter exposes the **Text/Vision** interface for Gemini models, not the native Image Generation interface.
*   Google's native Gemini API supports a feature called `responseModalities: ["IMAGE"]` which instructs the model to return a raw binary image. OpenRouter does **not** support or pass this modality flag.
*   Because of this, `google/gemini-2.5-flash` via OpenRouter acts strictly as a text model. It cannot output a valid PNG/JPEG binary.

### Fallback Handled in Code
To attempt to fulfill the user request without changing the model, the system prompt in `openRouterService.js` aggressively instructs the model to reply with only Base64 image data. However, if the model refuses or returns conversational text, the service intercepts it, logs a warning, and throws an error indicating that text models via OpenRouter cannot generate images natively.

**Future Solution:** To reliably generate images via OpenRouter, the model string in `openRouterService.js` should be changed to a dedicated image generation model supported by OpenRouter (e.g., `stability-ai/stable-diffusion-3`).
