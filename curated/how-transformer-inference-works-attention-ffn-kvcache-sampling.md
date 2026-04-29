# Transformer 推理流程全解析：注意力、FFN、KV Cache 到 Token 采样

## Interview Question

Transformer 的注意力机制和 FFN 是如何协作完成"预测下一个 token"这件事的？请从 QKV 计算讲到最终输出 token。

## Why this question matters

这是理解 LLM 工作原理的核心链路。掌握它之后，KV Cache 的显存成本、上下文窗口为什么贵、temperature 参数的本质、模型幻觉的成因等工程问题都能自然推导出来，而不是靠记结论。

## Reference Answer

Transformer 的推理流程分为四个阶段：

### 1. 注意力层：聚合上下文

每个 token 经线性变换生成 Q（Query）、K（Key）、V（Value）三个向量：
- Q：当前 token 在问"我需要什么信息？"
- K：历史 token 在说"我能提供什么？"
- V：历史 token 实际要贡献的内容

当前 token 的 Q 和所有历史 token 的 K 做相似度计算，得到注意力权重，再对所有 V 加权求和，输出一个**上下文感知的语义向量**。

历史 token 的 K、V 会被缓存（**KV Cache**），避免每次都重新计算。

![注意力机制 QKV 计算过程](../assets/attention_diagram.png)

---

### 2. FFN：非线性加工

注意力层的加权求和本质是线性操作，FFN 在此基础上引入非线性：

```
输入向量（768）
  → 线性升维（→ 3072）
  → ReLU 激活（负值归零，只保留被"激活"的特征）
  → 线性降维（→ 768）
输出向量
```

升维给了模型足够空间表达复杂特征；ReLU 使两次线性变换不等于一次，赋予非线性表达能力。FFN 也被认为存储了模型的大量**事实性知识**。

![FFN 计算过程](../assets/ffn_diagram.png)

---

### 3. 多层 Block 堆叠

注意力 + FFN 合为一个 **Block**，GPT 类模型堆叠几十到上百层。关键点：

- 每层有**独立的 QKV 权重矩阵**，输入是上一层的输出向量
- 浅层学语法、词性；深层学抽象语义、推理
- **KV Cache 按层存储**：层数 × 序列长度 × KV 维度 = 显存占用，这是长上下文推理成本高的核心原因
- 业界用 GQA（多个 Q 共享一组 KV）、KV 量化、滑动窗口等方式压缩缓存

---

### 4. 解码：从向量到 Token

```
最后一层输出向量（768）
  × 输出矩阵（768 × 词表大小）
  = Logits（词表大小，原始打分）
  → Softmax → 概率分布
  → 采样 → 下一个 token
```

三种常见采样策略：
- **贪心（temperature=0）**：始终选概率最高的 token，结果可复现
- **Temperature 采样**：调整概率分布后随机采样；越高越随机，越低越保守
- **Top-p 采样**：只保留累计概率达到 p 的候选词，再在其中随机采样

每次预测都对整个词表打分，这也是词表越大推理越慢的原因之一。

![Logits 到 Token 的采样过程](../assets/logits_diagram.png)

---

## Follow-up Questions

- KV Cache 的大小怎么算？MQA 和 GQA 分别如何压缩它？
- 为什么 FFN 要先升维再降维，直接在原始维度做变换有什么问题？
- temperature 和 top-p 同时设置时，哪个先生效？
- 什么是投机采样（Speculative Decoding），它如何在不改变输出分布的前提下加速推理？
- 多头注意力（Multi-Head Attention）相比单头有什么优势？

## Notes

- 输出矩阵通常直接复用 Embedding 矩阵的转置（Weight Tying），节省参数量
- KV Cache 是推理阶段特有的优化，训练时不使用
- Logits → Softmax 这一步，训练时配合 Cross Entropy Loss 合并计算，避免数值溢出
- 每次回答不一样的根本原因：Logits 是确定的，但采样引入了随机性
