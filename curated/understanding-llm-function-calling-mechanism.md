# Understanding LLM Function Calling: The Protocol Behind AI Tools

Every time you ask ChatGPT for the weather, tell Cursor to run a terminal command, or watch an AI agent browse the web, you're witnessing the same underlying mechanism: LLM function calling. It's the invisible protocol that turns a text generator into something that can *act*. But despite being the skeleton of every modern AI application, function calling is widely misunderstood—even by engineers who use it daily.

Let's go deeper than "here's how to call the API." This is about the protocol itself: how models decide *when* to call a tool, what happens inside the message array, and the engineering realities that make or break production systems.

## The Trigger: Models Don't "Decide" to Call Tools

The biggest misconception about function calling is that the model has some kind of internal "I should use a tool now" intuition. It doesn't. The model is an autoregressive token generator—it predicts the next token given the previous ones. Function calling is something the inference layer *enables*, and it requires two explicit conditions:

1. The request must include a **`tools` parameter**—an array of function definitions, each with a name, a natural-language description, and a JSON Schema for parameters.
2. The **`tool_choice`** parameter must allow it. The default is `"auto"`, meaning the model *may* return a tool call if it deems one appropriate. You can also set it to `"none"` (never call), `"required"` (always call), or pin it to a specific function.

When `tool_choice` is `"auto"`, the model evaluates each function's description against the user's request. If the request exceeds the model's knowledge boundary—real-time data, private databases, precise computation—and a matching tool exists, the model outputs a tool call instead of text. If nothing matches, it outputs text as usual.

The function description is the *only signal* the model has for deciding when to call. A vague description like "Gets data" will cause both false positives and missed calls. A precise one like "Retrieves current weather conditions for a given city name. Returns temperature, humidity, and conditions string." dramatically improves accuracy. Tool descriptions are a form of prompt engineering—just one layer deeper in the stack.

## The Mutual Exclusion: Content and Tool Calls Never Coexist

One of the most counterintuitive properties of the function calling protocol: in any single assistant response, `content` and `tool_calls` are **mutually exclusive**. The model either returns text or it returns a function invocation—never both at once.

| Scenario | `content` | `tool_calls` |
|:--|:--|:--|
| Model answers directly | Present | `null` |
| Model needs a tool | **`null`** | Array of calls |

ChatGPT seems to "talk while searching," but that's an illusion. Under the hood, it's multiple round trips: the model returns a tool call (no text), your system executes it, feeds the result back, and *then* the model generates the natural language response. The conversational flow you see is stitched together from separate API calls.

This mutual exclusion has practical implications. If you're streaming responses, you can't partially render text while waiting for a tool call to resolve—you either have content to display or you have a tool to execute, never both in the same response object.

## Messages[]: The Single Source of Truth

Function calling isn't stateful in the traditional sense. Every request to the model must contain the *entire conversation history* in the `messages` array. This array is the only thing the model sees, and it grows with each turn. Here's how a complete tool-calling interaction evolves:

```
Step 1 — User asks a question
messages: [user: "What's the weather in Beijing?"]
        ↓ Send to model

Step 2 — Model decides it needs a tool
messages: [user, assistant(tool_call: get_weather("Beijing"))]
        ↓ You execute get_weather, get back { temp: 22, condition: "sunny" }

Step 3 — Append the tool result
messages: [user, assistant(tool_call), tool(result: "22°C, sunny")]
        ↓ Send the full array back to the model

Step 4 — Model generates the final answer
messages: [user, assistant(tool_call), tool(result), assistant(text: "Beijing is sunny, 22°C")]
```

Every step is an append to `messages[]`. The model has no memory between API calls—the `messages` array *is* the memory. Skip the `tool` result message before the final call, and the model will hallucinate because it never saw the data. This is also why you can't prune messages mid-interaction: the model needs to see `assistant(tool_call)` to understand that a tool was invoked, and `tool(result)` to know what came back.

## Engineering Realities: Parallel Calls, Errors, and Streaming

**Parallel tool calls** are a first-class feature. The model can return multiple `tool_calls` in a single response—for instance, simultaneously requesting weather for both Beijing and Shanghai. Your system should execute them concurrently (they're independent) and append all results as separate `tool` messages before the next model call. Serial execution doubles latency for no reason.

**Error handling** has an elegant pattern: when a tool execution fails, don't throw an exception at the user. Instead, append the error as a `tool` message and send the array back to the model. The model will typically apologize, explain the issue, or try an alternative approach. The error becomes part of the conversation, not a dead end.

**Tool call loops** are the hardest edge case. A model might call a tool, get results, then call another tool based on those results—potentially chaining several calls before producing a final answer. Your orchestration layer needs a loop-aware design: keep iterating as long as the model returns `tool_calls`, with a hard maximum to prevent infinite loops. Each iteration appends to `messages[]` and re-requests the model.

**Streaming assembly** is the subtlest challenge. When receiving a streaming response (SSE), tool calls arrive as fragmented deltas. A single `get_weather("Beijing")` call might arrive across five SSE events. You need to buffer by `index` (models can emit multiple tool calls interleaved), accumulating `id`, `function.name`, and `function.arguments` fragments until the `tool_calls` stream signals completion. Only then can you parse the full JSON arguments and execute.

## Key Takeaways

- **Function calling is externally triggered**, not internally decided—the `tools` parameter and `tool_choice` setting control whether and when tool calls happen; the model just follows the protocol.
- **`content` and `tool_calls` are mutually exclusive**—a single response never contains both; multi-turn orchestration creates the illusion of simultaneous text and tool use.
- **`messages[]` is the single source of truth**—every API call carries the full conversation history, and skipping any intermediate message breaks the model's context.
- **Execute parallel tool calls concurrently**—they're independent by definition, and serial execution is wasted latency.
- **Errors are messages too**—feed tool execution failures back into the conversation as `tool` messages and let the model recover gracefully.
- **Streaming tool calls require careful delta assembly**—buffer by index, accumulate fragments, and parse only when complete.
