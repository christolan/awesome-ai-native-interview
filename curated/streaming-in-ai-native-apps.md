# Streaming in AI Native Apps: From Concept to Production

Streaming isn't just a UX polish — it's the default interaction paradigm for AI-native applications. If you've ever watched ChatGPT type out a response token by token, you've experienced streaming. But why does it matter so much, and what does it take to build it right?

## Why Streaming Is the Natural Fit for LLMs

To understand streaming, you need to understand how large language models actually generate text. An LLM doesn't conjure an entire paragraph in one shot. It works iteratively: given a sequence of input tokens, it predicts the single most probable next token, appends it to the sequence, and repeats. This autoregressive generation loop means the model itself produces content incrementally — so delivering it incrementally to the user is the most natural choice.

The alternative — waiting for the full response, then displaying it all at once — creates a poor experience. LLM inference is inherently slower than a traditional API call. If users stare at a blank screen for 5, 10, or 30 seconds waiting for a complete answer, they feel the system is broken or stuck. Streaming flips this: the user sees words appear immediately, which reduces perceived latency and waiting anxiety. More importantly, it transforms the interaction from a black-box query into a live collaboration. The user can read along, judge whether the answer is heading in the right direction, and intervene — hitting stop, rephrasing, or asking a follow-up — before the model wastes tokens going down the wrong path.

This pattern of early feedback and interruptibility is what separates AI-native products from traditional request-response web apps.

## The Frontend Architecture: More Than Just Appending Text

Building a streaming chat UI looks deceptively simple — "just connect to a stream and append chunks to a div." In practice, production-grade streaming demands a carefully designed state machine.

When the user sends a message, the frontend immediately inserts a `user message` into the conversation and creates an empty `assistant message` as a placeholder. Critically, every entity gets a stable identifier: a `conversationId` for the entire session, a `messageId` for each message, and a `requestId` for each generation attempt. The frontend then opens a streaming connection (carrying these IDs plus conversation context) and begins appending received chunks to the placeholder message while the UI re-renders incrementally.

### Protocol Selection

For unidirectional text streaming — the server pushing model output to the client — **SSE (Server-Sent Events)** or **fetch + ReadableStream** are almost always the right choices. They're simple, built on standard HTTP semantics, and map cleanly onto the LLM generation model. WebSocket, by contrast, is designed for bidirectional, high-frequency real-time communication (collaborative editing, voice streams, multiplayer state sync). Using it for one-way text generation adds unnecessary complexity without real benefit.

### The Three-Layer State Model

A common trap is conflating "the text is displayed" with "the data is safely stored." To avoid this, separate your state into three layers:

- **Message state**: `streaming | completed | stopped | failed` — what the user sees
- **Request state**: `idle | requesting | aborting | reconnecting` — what the network is doing
- **Persistence state**: `not_started | persisting | persisted | persist_failed` — what the backend has committed

These layers move independently. A message can finish streaming (`completed`) while persistence is still in flight (`persisting`). A page refresh can interrupt both. Keeping them distinct prevents the all-too-common bug where "the answer looks done but the database still has nothing."

## Stopping, Persisting, and Recovering

**Stop generation** is the feature most likely to break under real-world conditions. The correct approach: when the user clicks stop, the frontend uses `AbortController` to immediately halt local stream consumption (so the UI freezes instantly), then sends an `abort(requestId)` to the server. The server stops model inference and — this is the crucial part — **persists whatever it has already accumulated as the final answer**. The server, not the client, is the source of truth. The frontend may have dropped chunks, the page may have refreshed mid-stream, or the network may have glitched. If the client tries to save "what I saw on screen," you'll get drift between display and database. Let the server be the authority.

**Persistence** must be idempotent. The server writes using `messageId` or `requestId` as the key, so retries, reconnects, and duplicate submissions all update the same record — never creating duplicate messages.

**Recovery** has two paths. For completed history, the frontend loads past messages by `conversationId` on page load — straightforward. For in-flight generations interrupted by a refresh, the server may still hold a `streaming` or `aborting` intermediate state. The frontend should either re-subscribe to the stream by `requestId` or display the partial message with a "generation was interrupted — regenerate?" affordance. Never leave the user staring at a silent half-answer with no recourse.

---

Streaming in AI-native apps is an exercise in distributed state consistency. The core insight is that the text stream itself is the easy part. The hard parts are: defining clear identity boundaries (`conversationId`, `messageId`, `requestId`), keeping display state and persistence state separate, treating the server as the authoritative source of truth, and designing every interaction — stop, refresh, reconnect — as a first-class state transition rather than an afterthought.

**Key Takeaways**

- LLMs generate tokens autoregressively, so streaming is the natural delivery mechanism — not just a UX enhancement.
- Streaming reduces perceived latency, enables early user feedback, and supports interruptibility (stop, retry, refine).
- Prefer SSE or fetch + ReadableStream for unidirectional text streaming; reserve WebSocket for bidirectional real-time scenarios.
- Separate state into three layers: message state (what's displayed), request state (what the network is doing), and persistence state (what's committed).
- On stop: abort locally for instant UI feedback, but let the server persist whatever it accumulated — the server is the source of truth.
- Persist idempotently by `messageId` to survive retries and reconnects without creating duplicates.
- Handle page refresh recovery: reload completed history normally; for interrupted generations, either re-subscribe or offer a regenerate option.
