# awesome-ai-native-interview

## 项目简介

AI Native 工程师面试题库

---

## 面试题索引

| 日期 | 题目 |
|------|------|
| [2026-04-22](daily/2026-04-22.md) | 流式输出（streaming response）与即时展示的重要性 |
| [2026-04-23](daily/2026-04-23.md) | 上下文管理（context management）方案设计 |
| [2026-04-24](daily/2026-04-24.md) | Web 应用接入流式 AI 对话（实时 token 展示） |
| [2026-04-25](daily/2026-04-25.md) | 中老年新闻 App + AI 图片理解 |
| [2026-04-26](daily/2026-04-26.md) | Embedding / Vector Search / RAG 协同工作 |
| [2026-04-27](daily/2026-04-27.md) | RAG 原理与常见挑战 |
| [2026-04-29](daily/2026-04-29.md) | 多模态输入（文字 + 图片）图文混合问答 |
| [2026-04-30](daily/2026-04-30.md) | Temperature / Top-K / Top-P 采样参数 |
| [2026-05-01](daily/2026-05-01.md) | Beam Search 原理与解码策略对比 |
| [2026-05-02](daily/2026-05-02.md) | 流式对话的中断与恢复 |
| [2026-05-03](daily/2026-05-03.md) | Function Call / Tool Call 前端处理流程 |
| [2026-05-04](daily/2026-05-04.md) | Reasoning Model 运作机制（thinking tokens） |
| [2026-05-05](daily/2026-05-05.md) | ReAct 模式（Reasoning + Acting） |
| [2026-05-06](daily/2026-05-06.md) | RAG 生产环境常见失败模式与排查 |
| [2026-05-07](daily/2026-05-07.md) | KV Cache 原理与自回归生成加速 |

---

## 核心概念

### A

**AbortController** — 浏览器 API，用于中断进行中的 fetch 请求，是实现流式输出「停止」功能的基础。

**ANN (Approximate Nearest Neighbor)** — 近似最近邻搜索算法族（HNSW、IVF 等），在百万级向量中做毫秒级相似检索而不必穷举比对。

**Agent** — 具备自主规划、工具调用和反馈驱动迭代循环的 LLM 系统；区别于仅有工具但缺乏规划和循环的助手。

**Attention** — Transformer 的核心信息路由机制：每个 token 通过 Q/K/V 三组投影，用 Q 去查 K 产生注意力权重，再用权重聚合 V 得到融合上下文的新表示。

### B

**Base64 Encoding** — 将二进制数据（如图片）编码为文本字符串，用于把图像内联到 API payload 中而不依赖外部 URL。

**Beam Search** — 每步维护 B 条候选序列，从所有 beam × 词表的扩展候选中做全局 top-B 筛选，最终取累积 log probability 最高的序列。

**Beam Size** — beam search 中并行维护的候选路径数量；beam size=1 退化为 greedy decoding。

### C

**Chain of Thought (CoT)** — 将中间推理步骤外化为 token，使后续生成以这些步骤为条件，从而降低复杂问题的出错概率。

**Chat Template** — JSON API 消息到原始 token 流的翻译层；推理模型的开/关即是通过该层注入或省略特殊 token 实现。

**Chunking Strategy** — 文档分块策略，决定每段文本多大、怎么切；直接影响 embedding 质量和 RAG 检索精度。

**Context Window** — 模型单次前向传播能处理的最大 token 数，是 LLM 应用的硬资源上限。

### D

**Diverse Beam Search** — 对来自同一父序列的姐妹 beam 施加评分惩罚，强制候选路径在不同父序列间分流。

### E

**Embedding** — 将文本映射为固定长度浮点向量，使语义相近的文本在向量空间中彼此靠近。

### F

**FFN (Feed-Forward Network)** — Transformer Block 中的两层非线性变换（扩展→激活→压缩），存储了模型大部分事实性知识，约占 Transformer 参数量的三分之二。

**Function Calling** — 模型输出结构化工具调用 token 而非自然语言的能力，本质是推理层在 prompt 中注入工具描述后的协议遵从。

### G

**GQA (Grouped Query Attention)** — 让多个 query head 共享同一组 key-value head，大幅缩减 KV cache 显存占用。

**Greedy Decoding** — 每步只选概率最高的一个 token，确定性强但缺乏多样性，是 beam search 在 beam size=1 时的退化形式。

**Group Beam Search** — 将 beam 分成若干独立小组，组内做 beam search 但组间不共享候选市场，从结构上保证多样性。

### J

**JSON Schema** — 函数调用中用于定义参数类型、结构和约束的规范格式，是模型生成合法工具调用的唯一依据。

### K

**KV Cache** — 将已生成 token 的 Key 和 Value 向量缓存下来，避免自回归生成时每一步重算全部历史，将每步计算从 O(n²) 降至 O(n)。

### L

**Layer Normalization** — 对层内激活值做归一化以稳定训练，是 Transformer 残差连接的关键配套组件。

**Length Normalization** — 将 beam search 的累积 log probability 除以 length^α，防止算法因 log probability 全为负数而不公平地偏爱短序列。

**Logits** — 模型最后一层输出的原始分数（softmax 之前），每个 token 对应一个实数，代表模型对该 token 的未校准偏好。

### M

**Multi-Head Attention** — 并行运行多个独立的 Q/K/V 投影，让模型在不同子空间中同时关注不同的语义关系。

**Multimodal** — 模型能同时处理多种输入类型（如文本+图像），图像经专用编码器处理后与文本在统一的表示空间中融合。

### N

**Nucleus Sampling（Top-P）** — 按概率从高到低累积，只保留累积概率刚好 ≥ P 的最小 token 集合，然后从中采样；候选集大小随分布的不确定性自适应调整。

### P

**Pre-signed URL** — 后端签发的短期临时 URL，前端可直传对象存储而不暴露长期密钥，是实现图片直传 OSS 的安全基础。

### Q

**Q/K/V (Query/Key/Value)** — Attention 中每个 token 的三组投影：Q 表示「我需要什么信息」，K 表示「我这里有什么信息」，V 是实际传递的内容。

### R

**RAG (Retrieval-Augmented Generation)** — 检索增强生成：将用户查询转为 embedding → 向量库检索相关文档 → 拼入 prompt → LLM 基于证据生成，让模型能访问训练截止日期之后或私有的知识。

**ReAct** — Reasoning + Acting 范式，让 LLM 在 Thought→Action→Observation 的循环中交替推理和工具调用，形成推理指导行动、行动反馈推理的闭环。

**Reasoning Model** — 先生成内部思考 token（用户不可见），再生成最终答案的模型；思考 token 与输出 token 由相同的 autoregressive 机制产生，没有独立推理引擎。

**Residual Connection** — 将层的输入加到其输出上再送入下一层，解决深层网络梯度消失问题，使上百层的 Transformer 堆叠成为可能。

**RLHF (Reinforcement Learning from Human Feedback)** — 用人类偏好作为奖励信号，通过强化学习微调模型使其行为更符合人类期望。

### S

**Softmax** — 将 logits 向量转换为合法概率分布的函数：exp(x_i) / Σ exp(x_j)，是 logits 到概率的最后一步。

**Speculative Decoding** — 用小草稿模型快速提议多个候选 token，再用完整模型一次前向传播验证，加速生成而不改变输出分布。

**SSE (Server-Sent Events)** — 基于标准 HTTP 的单向推送协议，浏览器通过 EventSource API 接收服务端流式数据，是 LLM 文本流式传输的最优选择。

**Stochastic Beam Search** — 用 Gumbel-top-k 技巧将随机采样引入 beam search，使选择不再完全确定，保持探索性。

**Streaming** — 将服务端生成的内容逐 chunk 增量发送给客户端，而非等完整响应后一次性返回；LLM 自回归生成的天然匹配。

### T

**Temperature** — 在 softmax 之前将 logits 除以 T 的参数：T→0 趋向 greedy，T>1 拉平分布增加随机性，控制生成文本的保守与大胆程度。

**Test-Time Compute** — 推理阶段额外投入的计算量（如生成更多思考 token），用于提升输出质量而非训练参数。

**Thinking Tokens** — 推理模型输出的内部 token，用户不可见，用于逐步推理并丰富后续生成的上下文。

**Token** — LLM 输入输出的原子单元，可以是一个完整单词、子词碎片或单个字符，由 tokenizer 决定切割粒度。

**Token Limit** — context window 所定义的输入 token 硬上限，超限后只能截断或拒绝。

**Tool Choice** — 函数调用 API 中的控制参数（`auto`/`required`/`none`），决定模型是否允许、必须或禁止返回工具调用。

**Tool Use** — 与 Function Calling 同义，模型指定调用哪个工具及传什么参数的协议。

**Top-K Sampling** — 只保留概率最高的 K 个 token，丢弃其余，然后重新归一化采样；简单但 K 为静态值，无法适应动态分布。

### V

**Vector Database** — 专为 embedding 向量设计的数据存储系统，用 ANN 索引实现毫秒级相似搜索，同时支持 CRUD 和元数据过滤。

**Vision Model** — 将图像编码为 LLM 可理解表示的模型组件，是多模态能力的关键组成部分。

### W

**Weight Tying** — 将 token 嵌入矩阵复用为反嵌入矩阵（转置），减少约一半参数量的技巧。
