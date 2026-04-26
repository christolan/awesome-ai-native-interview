# Token → Embedding → Vector Database: The AI Native Data Pipeline

## Interview Question

请解释以下三个概念的区别，并给出一个实际场景说明它们如何协同工作：

**Token → Embedding → Vector Database**

## Why this question matters

这道题用于考察对 AI Native 应用**数据链路**的基础理解。Token、Embedding、Vector Database 是 RAG、语义搜索、记忆系统等 AI 场景的底层基石。不理解这三者的关系，就无法真正理解 RAG，也无法理解为什么 AI 应用需要向量数据库而不是传统 SQL。

一个清晰的回答应该能把这三个概念从"是什么"讲到"为什么"再到"如何协同"——光背定义不够，能串起 RAG 链路才是加分点。

## Reference Answer

Token、Embedding、Vector Database 是 AI Native 应用数据链路中的三个层次，从"文字碎块"到"语义坐标"再到"语义搜索引擎"。

**Token** 是大语言模型处理文字的基本单位。无论输入还是输出，LLM 都在做同一件事：给定一系列 token，预测下一个最可能的 token，反复迭代直到生成完整结果。

**Embedding** 解决的是"机器不认识文字，只认识数字"的问题。Embedding 模型会把每个 token 或整段文本映射成一个固定长度的浮点数向量（比如 1536 维）。关键性质是：语义相近的文本，它们在向量空间中的距离也相近。"苹果"和"香蕉"的向量距离很近，"苹果"和"汽车"的向量距离很远。这就像给每段文字在语义空间中打了一个"坐标"。

**Vector Database** 解决的是"高效语义检索"的问题。当你拥有 100 万份文档的 Embedding 向量后，用户问一个问题，你需要找出最相关的几篇。你不能一个个遍历比较——太慢了。Vector DB 通过专门的索引结构（如 HNSW、IVF）把最近邻搜索加速到毫秒级，同时提供增删改查、元数据过滤等生产级能力。代表产品：Pinecone、Weaviate、Qdrant、Milvus、Chroma。

**三者协同：RAG 场景**

用户提问"最新的报销政策是什么？"→
1. **Token** 化：把问题分解成 token 序列
2. 输入 **Embedding** 模型 → 得到语义向量
3. 用该向量到 **Vector Database** 中检索最相关的 3 篇文档
4. 把"问题 + 检索到的文档"拼接成 Prompt 发给 LLM

这样 LLM 就有了事实依据，避免了生编硬造。这就是 RAG（Retrieval-Augmented Generation）的核心链路。

## Follow-up Questions

- Embedding 模型和 LLM 本身是同一个模型吗？它们分别负责什么？
- Vector Database 和传统数据库（如 MySQL、Elasticsearch）在语义搜索场景下有什么本质区别？
- 如果 RAG 检索回来的文档和用户问题其实不太相关，会发生什么？怎么缓解？

## Notes

- Token 是 LLM 的输入/输出单位，Embedding 是语义向量化，Vector DB 是语义检索引擎——三者各司其职
- Embedding 模型通常独立于生成模型（如 OpenAI 的 `text-embedding-ada-002` 与 `gpt-4` 是两个不同模型）
- RAG 是这三者最典型的协同场景，也是 AI Native 工程师面试的高频考点
