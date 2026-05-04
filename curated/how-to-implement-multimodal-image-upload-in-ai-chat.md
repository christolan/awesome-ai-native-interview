# Building Multimodal AI Chat: How Images and Text Work Together

Every AI chat product eventually hits the same inflection point: text isn't enough. Users want to snap a photo of a receipt and ask "what did I spend on groceries?", or paste a screenshot of an error message and get an instant diagnosis. Adding image support transforms a chatbot into something that feels genuinely intelligent—but the engineering underneath is more nuanced than dropping an `<img>` tag into a chat bubble.

Let's walk through what it actually takes to build multimodal image upload into an AI chat product, from the byte-level plumbing to the UX details that separate a polished experience from a frustrating one.

## The Upload Architecture: Why Direct-to-OSS Wins

When a user selects an image, that file has to get to the model API somehow. The naive approach pipes everything through your backend server: frontend uploads to your server, your server uploads to the model. This works at five users but crumbles at scale—image uploads eat bandwidth, tie up request threads, and turn your API server into a glorified file proxy.

The better pattern is **direct OSS upload**: your backend issues a temporary credential (an STS token or pre-signed URL), and the frontend uploads straight to object storage. The flow looks like this:

1. User selects an image → frontend calls your backend for an upload token
2. Backend returns a short-lived pre-signed URL (valid for minutes, never hours)
3. Frontend uploads directly to OSS, receives a permanent image URL
4. That URL gets bundled into the model API request—no copy ever touches your server

This keeps your backend lean and sidesteps the cardinal sin of exposing long-lived access keys in client-side code. The security boundary is clean: temporary credentials, server-side issuance, no secrets on the frontend.

One timing trick that makes a noticeable UX difference: kick off the upload **the moment the user selects the image**, not when they hit "send." By the time they finish typing their question, the URL is already ready. No spinner, no awkward pause.

## How Images Actually Reach the Model: It's Not Markdown

Here's the mistake almost everyone makes on their first implementation. You're building a chat UI; the message bubble shows an image, so naturally you want to represent it like this:

```
User message: "![image](https://cdn.example.com/photo.jpg) What's in this photo?"
```

That's how the **rendering layer** works, but it's not how the **model API** works. Multimodal LLM APIs expect a structured `content` array, where each element is a typed object:

```json
{
  "role": "user",
  "content": [
    { "type": "text", "text": "What's in this photo?" },
    { "type": "image_url", "image_url": { "url": "https://cdn.example.com/photo.jpg" } }
  ]
}
```

This distinction matters because it's the difference between sending the model actual image data versus sending it a string that happens to contain a URL. The model doesn't "see" Markdown—it sees tokens. The structured format tells the model's multimodal encoder precisely where to route the image for processing.

In your frontend, this means you're maintaining two parallel representations: a display-friendly one for the chat UI (thumbnails, Markdown, whatever your renderer expects), and a structured one for the API payload. They're related but not interchangeable. Keep them separate, and never mash an image URL into a Markdown string and call it done.

## Preprocessing: Compression, Validation, and Thumbnails

Not every image that comes out of a phone camera is ready for a model API. Most providers enforce limits—GPT-4V caps at 20MB per image, others have dimension constraints—and sending raw 12MP photos is wasteful when the model downsamples them anyway.

A good client-side preprocessing pipeline handles three things:

**Format and size validation** happens first. Check that the file is JPEG, PNG, WebP, or whatever your target model supports. Reject anything outside the size limit with a clear, immediate message—don't let the user discover this when the upload fails thirty seconds later.

**Client-side compression** is next. Use Canvas to resize images before upload. A 4000×3000 photo can usually become a 1024×768 version with no perceptible quality loss for model comprehension, but a fraction of the bandwidth. This also speeds up the upload itself.

**Thumbnail generation** rounds out the pipeline: the full-resolution image goes to the model, but the chat UI displays a lightweight thumbnail (most OSS providers let you append query parameters like `?x-oss-process=image/resize,w_200` to generate variants on the fly). Clicking the thumbnail opens the original. This keeps long conversation histories from becoming scroll-killing bandwidth hogs.

## The UX Details That Actually Matter

The architecture gets the images to the model. The UX determines whether users enjoy the process or abandon it.

**Upload progress** is non-negotiable for large images. A progress bar—even a simple one—tells the user the system is working. Without it, a 10MB upload on a slow connection feels like the app froze. Use `XMLHttpRequest` with `progress` events (or `fetch` with a `ReadableStream` wrapper) to surface real upload percentage.

**Retry logic** needs to be baked in from day one. Network conditions are unpredictable. If the OSS upload fails, retry automatically once or twice before showing an error. If the STS token expires mid-upload (rare but possible), request a fresh token and retry. The user shouldn't need to understand credential lifecycle management.

**Multi-image support** adds complexity to state management. If the model supports multiple images per message (many do), you need to track a list of selected images with individual upload states—uploading, uploaded, failed—and allow the user to remove individual images before sending. A thumbnail grid with per-image progress indicators and delete buttons is the standard pattern.

**Clipboard paste** is the power-user feature that makes everything feel seamless. Users don't always want to click "upload"—they want to Ctrl+V a screenshot. The Clipboard API gives you a `Blob` from `navigator.clipboard.read()`. Treat it exactly like a file selection: same validation, same compression, same upload pipeline. The source changes; the pipeline doesn't.

## Key Takeaways

- **Direct OSS upload** keeps your backend lean: issue temporary credentials server-side, upload client-side, and never route image bytes through your application server.
- **Upload on select, not on send**—pre-warming the upload eliminates perceived latency when the user hits send.
- **The model API expects structured `content` arrays, not Markdown**—keep your display representation and your API payload strictly separate.
- **Compress and validate client-side** before upload; reject invalid files early and resize unnecessarily large images with Canvas.
- **UX polish is the differentiator**: progress bars, automatic retries, multi-image management, and clipboard paste support make the feature feel native rather than bolted-on.
