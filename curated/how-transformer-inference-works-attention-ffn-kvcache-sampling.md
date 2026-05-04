# How Transformers Actually Generate Text: A Visual Walkthrough

Every time you hit "send" on a chat message, a Transformer model wakes up and does something remarkable: it stares at every word you've ever said to it, weighs their relevance, runs them through a massive feedforward network, and picks the single most appropriate next token — then does it all over again for the token after that, and the one after that, hundreds of times, faster than you can blink.

If you work with LLMs, understanding exactly how this pipeline works isn't just intellectually satisfying — it's practically essential. KV Cache memory costs, why long contexts are expensive, what temperature actually does, why models hallucinate, and how speculative decoding accelerates inference all fall out naturally once you understand the four-stage architecture of Transformer inference.

**Stage 1: Attention — making every word aware of every other word**

When a token enters a Transformer layer, it doesn't arrive with any awareness of its neighbors. The attention mechanism fixes that. Each token is projected through three learned weight matrices to produce three vectors:

- **Q (Query):** "What information do I need right now?" — the current token's search query into the past.
- **K (Key):** "Here's what I can offer." — every token's index entry, describing what information it carries.
- **V (Value):** "Here's the actual content." — the information itself, what gets passed forward when a token is attended to.

The current token's Q is compared against every previous token's K using a dot product, producing a set of raw attention scores. Those scores are scaled, softmaxed into a probability distribution, and used to compute a weighted sum of all V vectors. The result is a single vector that represents the current token *conditioned on everything that came before it*.

![注意力机制 QKV 计算过程](../assets/attention_diagram.png)

The critical optimization here is the **KV Cache**. During autoregressive generation, you produce one token at a time. Without caching, you'd recompute K and V for every previous token on every step — pure quadratic waste. Instead, once a token's K and V are computed, they're stored. On the next step, only the newest token's Q, K, and V are computed fresh; all historical K and V are read from cache. This turns an O(n²) per-step operation into O(n), which is the entire reason autoregressive generation is practical at all.

**Stage 2: FFN — the knowledge store**

Attention is, at its core, a weighted averaging operation — fundamentally linear. Stack enough linear operations and they collapse into a single linear transformation, which can't model the complexity of human language. The Feed-Forward Network (FFN) breaks this linearity.

The FFN takes the attention output vector (typically 768 to 4096 dimensions depending on model size) and runs it through a two-layer transformation: expand to 4× the dimension (e.g., 768 → 3072), apply a non-linear activation like ReLU or GELU, then compress back to the original dimension. The expansion gives the model a high-dimensional space to represent complex feature interactions; the activation zeroes out negative values, ensuring the two linear layers don't collapse into one; the compression maps back to the layer's output format.

![FFN 计算过程](../assets/ffn_diagram.png)

There's a compelling line of research suggesting that FFN layers store the bulk of a model's **factual knowledge** — that "Paris is the capital of France" lives in the FFN weights, not in the attention patterns. Attention routes information; FFN stores it. This is why model editing techniques (like ROME or MEMIT) target FFN weights, and why the FFN accounts for roughly two-thirds of a Transformer's parameters.

**Stage 3: Stacking it all up**

Attention + FFN = one Transformer block. Modern models stack anywhere from a dozen (small distillations) to over a hundred (frontier models) of these blocks. Each block has its own independent QKV and FFN weight matrices, and the output of one block becomes the input to the next.

This stacking creates a hierarchy of abstraction. Early layers tend to learn surface-level patterns — syntax, part-of-speech, local word relationships. Middle layers pick up semantic structure. Deep layers handle abstract reasoning, factual integration, and long-range dependencies. The KV Cache must be maintained *per layer*: with 96 layers, a 128K context window, and 128-dimensional KV heads, the memory footprint becomes `96 × 128K × 128 × 2 (K+V) × 2 bytes (FP16)` — roughly 6GB just for the cache. This is why long-context inference is expensive and why techniques like Grouped Query Attention (GQA), KV quantization, and sliding window attention are not just optimizations but necessities for production deployment.

**Stage 4: Decoding — from vectors to words**

After the final Transformer block, you have a vector (say, 768 dimensions) representing the last token in rich semantic space. But you need a word. Here's how that happens:

The output vector is multiplied by an unembedding matrix — typically the transpose of the original token embedding matrix (a trick called Weight Tying that halves the parameter count) — producing **logits**: a raw score for every token in the vocabulary. For a 50,000-token vocabulary, that's 50,000 numbers representing the model's uncalibrated preference for each possible next word.

Logits pass through a softmax to become a proper probability distribution, and then a sampling strategy picks the actual token:

- **Greedy decoding (temperature=0):** Always pick the highest-probability token. Deterministic, reproducible, and often boring — it tends to produce repetitive, predictable text.
- **Temperature sampling:** Divide logits by a temperature value before softmax. High temperature (>1) flattens the distribution, making rare tokens more likely and output more creative. Low temperature (<1) sharpens it, making the model more conservative.
- **Top-p (nucleus) sampling:** Sort tokens by probability, keep only the smallest set whose cumulative probability exceeds p (e.g., 0.9), then sample from that truncated set. This dynamically adapts the candidate pool to the model's confidence — when the model is certain, the pool is small; when it's uncertain, the pool expands.

![Logits 到 Token 的采样过程](../assets/logits_diagram.png)

This sampling step is why the same prompt can produce different responses — the logits are deterministic (given the same weights and input), but the sampling *introduces* randomness. It's also where hallucinations gain a foothold: if the model assigns non-trivial probability to a factually incorrect token, and the sampler picks it, the model confidently emits falsehood. The architecture itself has no fact-checking mechanism; it only knows probability distributions.

**Why this matters in practice**

Once you internalize this four-stage pipeline — Attention routes information via KV Cache, FFN stores knowledge, multiple layers build abstraction, and decoding samples from a probability distribution — a dozen engineering decisions become intuitive. You understand why KV Cache compression is essential for long contexts. You see why speculative decoding (using a small draft model to propose tokens, then verifying with the full model in one forward pass) can accelerate generation without changing output distribution. You grasp why fine-tuning FFN layers can inject factual updates while preserving style and fluency. And you recognize that sampling parameters aren't just knobs to tweak — they're the interface between deterministic computation and creative output.

**Key Takeaways**

- Attention computes Q, K, V for each token; Q queries K to produce attention weights, which aggregate V into a context-aware representation. The KV Cache stores historical K and V to avoid recomputation, turning O(n²) per-step into O(n).
- The FFN (expand → activate → compress) introduces non-linearity and is believed to store the majority of a model's factual knowledge, accounting for ~2/3 of Transformer parameters.
- Stacking many blocks creates a hierarchy: shallow layers learn syntax, deep layers learn abstract reasoning. KV Cache must be stored per-layer, making cache memory scale as `layers × seq_len × KV_dim`.
- Decoding converts the final hidden vector to logits (via unembedding matrix), then to probabilities (softmax), then to a token via sampling. Temperature controls randomness; top-p dynamically limits the candidate pool.
- Sampling is the sole source of non-determinism in inference. Hallucinations occur when the probability distribution assigns weight to factually wrong tokens and the sampler selects them — the architecture has no truth-checking built in.
