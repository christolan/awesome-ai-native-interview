# Understanding LLM Function Calling Mechanism

## Interview Question

LLM 的 Function Calling / Tool Call 是什么机制？请解释它的触发条件、模型的返回行为、以及从发送请求到拿到最终回答的完整消息数组演进过程。

## Why this question matters

Function Calling 是现代 AI Native 应用的骨架——从 ChatGPT 插件到 Cursor 的代码操作，底层都是这套机制。理解它，不只是「会调 API」，而是理解 LLM 和外部世界交互的基本范式。这道题区分「用过 API」和「理解协议」两种人。

## Reference Answer

### 1. 触发条件

模型不会自发调用工具。必须满足：

- 请求中传入了 `tools` 参数（函数名 + description + parameters schema）
- `tool_choice` 为 `"auto"`（默认）时，模型自主判断：当用户问题超出自身知识边界（实时数据、私有数据、精确计算），且 tools 中有匹配能力的函数，则返回 tool_call
- 可设为 `"none"`（禁止调用）、`"required"`（强制调用）或指定具体函数名

函数 description 是模型判断何时调用的唯一依据，写得越精确，触发越准确。

### 2. content 与 tool_calls 互斥

模型在同一轮响应中**不会同时返回** `content` 和 `tool_calls`：

| 情况 | content | tool_calls |
|:--|:--|:--|
| 不需要工具 | 有内容 | null |
| 需要工具 | **null** | 有值 |

看似「边说边调」的体验，底层是多轮交替：第一轮返回 tool_call → 前端执行 → 追加 tool 结果 → 第二轮模型基于结果生成文本。

### 3. messages[] 是唯一真相源

完整链路中 messages 数组的演进：

```
1. [user: "北京天气？"]
        ↓ 请求模型
2. [user, assistant(tool_call: get_weather("北京"))]
        ↓ 执行工具，拿到结果
3. [user, assistant(tool_call), tool(result: "22°C 晴")]
        ↓ 带着完整数组再请求模型
4. [user, assistant(tool_call), tool(result), assistant(text: "北京今天晴天，22°C")]
```

每一步都是对 messages[] 的追加，不能跳过中间的 tool_call 和 tool 消息。

### 4. 工程要点

- **并行调用**：模型可一次返回多个 tool_call（如同时查北京和上海天气），前端应并行执行
- **异常处理**：工具执行失败时，将错误作为 tool 消息回传，模型会自动道歉/修正/换策略
- **循环意识**：tool call 不是一次性的，可能是多轮多工具链式调用
- **流式拼接**：SSE 流中 tool_call 是逐 delta 到达的碎片，需按 index 拼合 id、function.name、arguments

## Follow-up Questions

- 如果模型在不需要工具时也被强制要求调用（`tool_choice: "required"`），会发生什么？
- 如何设计工具的 description 以避免模型误调用或漏调用？
- 多工具链式调用（一个工具的结果决定下一个工具的参数）在前端如何编排？

## Notes

- 核心区分：考实现（API 对接熟练度）vs 考机制（协议理解深度），后者更有区分度
- 面试中建议先确认候选人是否知道 tool call 不是模型「心里想调就调」，而是由 tools 参数 + tool_choice 控制
- 进阶表达应覆盖消息数组演进、并行调用、异常回传和循环意识
