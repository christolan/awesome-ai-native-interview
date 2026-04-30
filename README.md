# awesome-ai-native-interview

一个面向 **AI Native 工程师** 的面试训练与内容沉淀仓库。

## 这是什么

这个仓库记录的是一个持续探索的过程：

- 每天一道面试题
- 先独立作答
- 再复盘、点评和优化
- 把其中真正有价值的内容沉淀下来

它不是一开始就设计完整的题库，而是一个会随着内容积累不断演化的仓库。

## 为什么做这个仓库

AI Native 工程师不只是“会接模型 API 的工程师”。

更重要的是，能围绕 AI 能力构建真实产品和工程系统，包括但不限于：

- AI Native 交互与体验设计
- 前端、客户端、服务端协作
- 模型能力接入与工程落地
- RAG、Agent、Workflow 等能力的产品化
- 延迟、成本、稳定性、可观测性等工程问题

这个仓库希望用一种长期、低负担、可持续的方式，逐步积累这些能力相关的面试题与表达方式。

## 当前阶段

当前还处在探索阶段，所以这里遵循一个简单原则：

**先积累内容，不提前过度设计结构。**

前期会更多从前端视角切入，因为这是当前最自然的切入口。  
后续会逐步融入客户端、服务端、AI 工程和系统设计相关内容。

## 目录

```text
daily/      # 每日训练记录
curated/    # 精选沉淀内容
templates/  # 使用模板
```

## 如何使用

### daily
记录每日一题的完整过程：
- 题目
- 回答
- 点评
- 优化答案
- 是否收录

### curated
只保留真正值得长期复习和复用的内容。

## 已沉淀面试题索引

- [什么是 Streaming 响应，为什么它在 AI Native 应用中很重要？](./curated/what-is-streaming-and-why-it-matters-in-ai-native-apps.md)
- [为什么不能无限把完整聊天记录追加给 LLM？](./curated/why-you-cant-infinitely-append-full-chat-history-to-an-llm.md)
- [如何在前端设计 Streaming AI 聊天交互？](./curated/how-to-design-streaming-ai-chat-on-the-frontend.md)
- [如何在低端设备上优化首屏渲染与长列表性能？](./curated/how-to-optimize-first-paint-and-long-list-performance.md)
- [Token → Embedding → 向量数据库：AI 数据流水线全解析](./curated/token-embedding-vector-database-data-pipeline.md)
- [什么是 RAG？它解决了 LLM 的哪些问题？](./curated/what-is-rag-and-why-it-matters.md)
- [Transformer 推理流程全解析：注意力、FFN、KV Cache 到 Token 采样](./curated/how-transformer-inference-works-attention-ffn-kvcache-sampling.md)
- [如何在 AI 对话产品中实现图片上传与图文混合问答？](./curated/how-to-implement-multimodal-image-upload-in-ai-chat.md)
- [大模型采样三参数详解：temperature、top_k、top_p](./curated/llm-sampling-temperature-topk-topp.md)
- [Beam Search 详解：原理、优缺点与工程取舍](./curated/beam-search-vs-sampling-decoding-strategies.md)

## 收录原则

不是所有 daily 内容都会进入 curated。

只有满足以下条件的内容才会被收录：

- 题目有代表性
- 回答有复用价值
- 能体现 AI Native 工程相关能力
- 经过整理后适合长期复习

## 当前重点

前期重点偏向：
- AI 应用前端体验
- Streaming / Chat UI / 多轮上下文
- Prompt / RAG / Agent 的产品化落地
- AI Native 工程中的真实项目问题

后续会逐步扩展到：
- 客户端
- 服务端
- AI 工程
- 系统设计
- 项目表达与行为面试

## 后续演化方式

这个仓库的结构不会预先定死。

当内容积累到一定规模后，再根据真实内容自然拆分目录和分类，而不是在一开始做过度设计。
