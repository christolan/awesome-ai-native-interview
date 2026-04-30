# Beam Search 详解：原理、优缺点与工程取舍

## Interview Question

大模型还有另一类解码方式——**Beam Search（束搜索）**。

请你解释：
1. Beam Search 的基本原理是什么？它和 greedy decoding 有什么区别？
2. Beam Search 相比随机采样有什么优缺点？
3. 为什么现代对话模型（如 ChatGPT）普遍不用 Beam Search，而是用采样策略？

## Why this question matters

Beam Search 是 NLP 领域经典的解码算法，在机器翻译、语音识别、摘要生成中广泛使用。理解它和随机采样的区别，能帮助你在不同场景下做出正确的解码策略选择，也是面试中考察 LLM 推理机制理解深度的常见题。

## Reference Answer

### 1. 核心原理

**Greedy Decoding：** 每步只选概率最高的 1 个 token，一条路走到底。简单快，但容易错过全局最优路径。

**Beam Search：** 每步保留概率最高的 **B 条**候选序列（B = beam size），最终选整体得分最高的那条输出。

**每步的具体过程（beam size = 2）：**
```
当前保留 2 条路径：
  路径A："我"     累积得分: -0.3
  路径B："你"     累积得分: -0.5

每条路径跑一次模型推理 → 得到完整词表概率分布
  路径A 展开："我 喜欢":-0.8, "我 想":-1.1 ...
  路径B 展开："你 好":-0.7,  "你 喜欢":-1.2 ...

全部合并，全局取 Top-2：
  ✅ "你 好":   -0.7
  ✅ "我 喜欢": -0.8
```

**得分计算：** 不需要每步重新算整句，直接累积：
```
新路径得分 = 已有路径得分 + log P(新token)
```

**停止条件：** 某条路径生成 `<EOS>` 就锁定，所有 B 条路径都 EOS（或达到 max_tokens）后，取得分最高的一条输出。

**关键推论：** beam size=1 时，Beam Search 退化为 greedy decoding。

---

### 2. 模型推理只需一次 forward pass

不是"把词表每个词拼上去跑一次模型"，而是：

```
模型最后一层 hidden state
    ↓
乘以 output embedding 矩阵（hidden_dim × 词表大小）
    ↓
一次性得到词表所有 token 的 logit → softmax → 概率分布
```

Greedy、采样、Beam Search 的区别只是**拿到概率分布后怎么选**，不影响模型推理本身。

---

### 3. 优缺点对比

| | Beam Search | 随机采样 |
|---|---|---|
| 输出质量 | 语法通顺、逻辑严密 | 有随机性 |
| 多样性 | **差**，多次运行结果几乎一样 | **好** |
| 重复问题 | 容易产生循环重复的句子 | 较少 |
| 计算量 | greedy 的 B 倍 | 接近 greedy |
| 适合场景 | 翻译、摘要、语音识别 | 对话、创作、问答 |

---

### 4. 对话模型为什么不用 Beam Search？

**① 对话需要多样性**：Beam Search 永远给一样的答案，体验僵硬。

**② 倾向于生成"安全但无聊"的句子**：最高概率往往意味着通用、平淡，大量产生废话开头。

**③ 开放域没有标准答案**：翻译有参考译文，Beam Search 逼近"最正确答案"合理；对话是开放域，"最高概率"不等于"最好的回答"。

---

### 5. 长度归一化

连乘概率天然偏向短句（越长累积负值越多），实际工程会做长度归一化：

```
score = Σ log P(ti) / 序列长度^α   （α 通常取 0.6~0.7）
```

## Follow-up Questions

- Beam Search 和 Top-P 采样能结合使用吗？
- 为什么 Beam Search 容易产生重复循环的句子？有什么缓解方法？（n-gram blocking）
- Diverse Beam Search 是什么？解决了 Beam Search 的什么问题？
- 如果 beam size 很大，Beam Search 会趋近于穷举搜索吗？

## Notes

- 和上一题（temperature / top_k / top_p）直接衔接：采样策略是在概率分布上做文章，Beam Search 是在路径搜索上做文章
- `<EOS>` token 是训练时在每条文本末尾加入的特殊标记，模型学会在语义完整时输出它
- 现代对话模型（GPT、Claude）用的是带 temperature + top_p 的采样，而非 Beam Search
