# Google AI Studio & Gemini API Limits

## The "0 Quota" Error on Free Tier
During development, we encountered a persistent HTTP `429 Quota Exceeded` error from the Google Gemini API when attempting to use image generation models like `gemini-2.5-flash-image` and `gemini-3.1-flash-image-preview`.

### Symptoms
*   The API response indicates: `Quota exceeded for metric: ..._free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image`
*   The Google AI Studio dashboard shows `0 out of 5 requests used`, leading to confusion.

### Root Cause
While Google AI Studio advertises a free tier (e.g., 5 requests for some heavy tasks or general API usage), **image generation models (Imagen 3 equivalents like the `gemini-*-image` series) are heavily restricted or completely disabled (Limit: 0) on free tier API accounts.**
The free tier quota is primarily intended for text (LLM) and text-to-speech tasks. Attempting to programmatically call native image generation through the API generally requires a Google Cloud project with a linked **billing account**, even if the volume is minimal.

## Concurrency Mitigation
To prevent hitting standard RPM (Requests Per Minute) limits in the future when a billing account is attached, the application UI was updated. 
*   **Previous Behavior:** Users could select multiple shot angles (Top, Side, Front) and the app would fire parallel asynchronous requests to Gemini.
*   **Current Behavior:** The `appStore.js` logic was refactored so the shot angle toggles act as **radio buttons** (only one active at a time). This enforces exactly **one image generation request per click**, ensuring we stay safely within any basic rate limits.
