# LLM Decoding Strategies: From Sampling to Beam Search

Every time a language model generates the next token, it faces the same decision: given a probability distribution over tens of thousands of possible words, which one do you pick? The answer isn't as simple as "the most likely one." Different decoding strategies produce radically different outputs — from rigid, deterministic prose to wildly creative tangents — and choosing the right one is a core skill for any engineer building on LLMs.

## Where It All Begins: Logits and Softmax

At each generation step, the model's final layer outputs raw scores called **logits** — one per token in the vocabulary. These logits aren't probabilities; they're unbounded real numbers, some positive, some negative. To turn them into a proper probability distribution, we apply the softmax function:

```
P(i) = exp(logit_i) / Σ exp(logit_j)
```

This gives us a probability for every token in the vocabulary, all summing to 1. Everything that follows — temperature, top-k, top-p, greedy decoding, beam search — is just a different policy for choosing a token from (or modifying) this distribution.

## The Sampling Trio: Temperature, Top-K, Top-P

### Temperature

Temperature is the simplest and most fundamental knob. Before softmax, we divide every logit by a temperature parameter T:

```
P(i) = exp(logit_i / T) / Σ exp(logit_j / T)
```

- **T → 0**: The distribution becomes extremely sharp. All probability mass collapses onto the single highest-scoring token. This is effectively greedy decoding.
- **T = 1**: The original probability distribution is preserved unchanged.
- **T > 1**: The distribution flattens. High-probability tokens are suppressed, low-probability tokens are boosted, and the model becomes more "creative" — and more likely to produce nonsense.

Temperature doesn't filter the candidate set; it reshapes the entire distribution. Low temperature means safe and predictable; high temperature means varied and risky.

### Top-K Sampling

Top-K takes a more direct approach: after computing the probability distribution, discard everything except the K most probable tokens. Then re-normalize and sample from only those K candidates.

The appeal is obvious — you'll never sample a bizarre, 0.001%-probability token that derails the output. The problem is that K is a fixed number. Sometimes the top 50 tokens account for 99% of the probability mass (K=50 is too generous); other times the top 50 only cover 60% (K=50 cuts off meaningful options). A static K can't adapt to the shape of the distribution.

### Top-P (Nucleus Sampling)

Top-P solves top-K's rigidity by making the cutoff dynamic. Instead of a fixed count, you set a cumulative probability threshold P (commonly 0.9). Sort tokens by descending probability, keep adding them to the candidate set until the cumulative probability exceeds P, and sample from that "nucleus."

When the distribution is sharply peaked ("The sky is..."), only a few tokens make the cut. When it's flat and uncertain, more tokens are included. This adaptivity makes top-P generally preferable to top-K in modern practice — and indeed, many API providers (including OpenAI) expose `top_p` but not `top_k`.

### How They Work Together

Temperature, top-K, and top-P aren't mutually exclusive, but they're also not independent. The standard execution order is: **top-K / top-P filter the candidate set first, then temperature adjusts the distribution shape, then the final token is sampled**. In practice, top-K and top-P are usually alternatives rather than complements — using both simultaneously tends to over-constrain the output.

**Real-world parameter recipes:**

| Use Case | Temperature | Top-P | Why |
|---|---|---|---|
| Creative writing | 0.8–0.9 | 0.95 | Embrace randomness and variety |
| Code generation | 0.1–0.3 | 0.9 | Precision matters; creativity is a liability |
| RAG / factual Q&A | 0.0–0.2 | 0.9 | Stay close to the evidence |

## Beam Search: When You Want the "Best" Answer

Beam search represents a fundamentally different philosophy. Instead of sampling from a probability distribution, beam search systematically explores multiple generation paths and picks the one with the highest overall score.

### How It Works

Beam search maintains B candidate sequences (B = beam size) at every step. At each position, it expands all B candidates by running the model forward once per candidate, producing B × vocab_size possible next tokens. It then ranks all these extensions by cumulative log-probability and keeps only the top B. This repeats until every path has generated an end-of-sequence token (or until max length).

When beam size = 1, beam search degenerates into greedy decoding — one path, always the locally optimal choice. With larger beam sizes (typical values: 3–8), the algorithm can recover from early decisions that look good locally but paint the sequence into a corner.

A crucial implementation detail: beam search doesn't require B separate model forward passes per token. The model's output embedding matrix maps the final hidden state to logits for every vocabulary token in a single matrix multiplication. The B paths can be batched, making beam search roughly B times as expensive as greedy decoding, not B × vocab_size.

### Length Bias and Normalization

Beam search has a natural bias toward shorter sequences. Since log-probabilities are always negative, longer sequences accumulate more negative values, making them score worse purely because of length. The standard fix is length normalization:

```
score = Σ log P(t_i) / length^α    (α typically 0.6–0.7)
```

This prevents the model from producing unnaturally terse outputs just to maximize the raw score.

### The Tradeoffs

Beam search produces grammatically coherent, logically consistent output — which is exactly what you want for machine translation, speech recognition, or summarization, where there's a clear "correct" answer to approximate. But it has serious downsides for open-ended generation:

1. **No diversity**: Run beam search on the same prompt 10 times and you'll get nearly identical output every time. The algorithm systematically converges on the highest-probability path.
2. **The "safe but boring" problem**: The highest-probability sequence is often the most generic one. Beam search loves bland openings like "There are several reasons why..." because those are statistically common across training data.
3. **Repetition traps**: Beam search can get stuck in loops, repeating the same phrase because the model assigns high probability to continuing an already-repeated pattern.

## Why Modern Chat Models Prefer Sampling

ChatGPT, Claude, and other conversational models overwhelmingly use temperature + top-P sampling rather than beam search. The reasons cut to the heart of what makes conversation different from translation.

**Diversity is a feature, not a bug.** When a user asks "tell me a story," they don't want the same story every time. Sampling introduces controlled randomness that makes conversations feel alive and responsive rather than robotic.

**There is no single "correct" answer.** Machine translation has a target reference; beam search's drive toward the maximum-likelihood sequence makes sense. But in open-domain chat, "highest probability" doesn't mean "best." The most probable response to "How are you?" is probably "I'm fine, thanks" — a boring and useless reply for a chatbot.

**Length and repetition penalties.** Sampling-based approaches can be augmented with techniques like repetition penalties and presence penalties — actively suppressing tokens that have already appeared — which are harder to cleanly integrate into beam search's scoring framework.

---

Decoding strategy is where the rubber meets the road in LLM applications. The same model, the same prompt, the same context — change only the decoding parameters and you'll get wildly different behavior. Understanding the logit → softmax → distribution pipeline, and knowing when to sample versus when to search, is what separates engineers who treat LLMs as black boxes from those who can reason about and control their outputs.

**Key Takeaways**

- All decoding starts from **logits** → **softmax** → **probability distribution**. Every strategy is just a different way to pick from (or modify) this distribution.
- **Temperature** reshapes the entire distribution before softmax: T→0 is greedy, T=1 is unchanged, T>1 flattens for more randomness.
- **Top-K** hard-caps candidates to K highest-probability tokens; rigid but simple.
- **Top-P (nucleus sampling)** dynamically includes tokens until cumulative probability ≥ P; adapts to distribution shape and is generally preferred over top-K.
- Execution order: top-K/top-P filtering → temperature adjustment → final sampling.
- **Beam Search** explores B parallel paths, selecting the globally highest-scoring sequence; beam size = 1 degrades to greedy decoding.
- Beam search excels at translation/summarization (where a "correct" answer exists) but produces rigid, repetitive, low-diversity output — making it unsuitable for open-ended chat.
- Modern chat models use sampling (temperature + top-P) because conversation requires diversity, has no single correct answer, and benefits from repetition penalties.
- Length normalization (`score / length^α`) prevents beam search from unfairly favoring short sequences.
