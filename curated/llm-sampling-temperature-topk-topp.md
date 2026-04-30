# 大模型采样三参数详解：temperature、top_k、top_p

## Interview Question

大模型生成文本时，常见的采样参数有 `temperature`、`top_k`、`top_p`（nucleus sampling）。

请解释：
1. 这三个参数分别控制什么？背后的数学逻辑是什么？
2. 它们之间有什么区别和联系？实际工程中怎么组合使用？

## Why this question matters

这三个参数直接决定 LLM 输出的随机性、质量和风格。代码生成要偏保守，创意写作要放开，RAG 问答要足够确定——每种场景需要不同的参数组合。不理解它们，调 API 时只能乱猜；理解了，才能做有意识的工程决策。

## Reference Answer

### 背景：从 Logits 到 Token

模型每步生成时，输出的是词表上的 **Logits**（原始分数），经过 Softmax 转成概率分布，然后从中**采样**一个 token。

三个参数都是在"怎么采这一步"上做文章。

---

### 1. Temperature（温度）

**控制什么：** 概率分布的"平滑程度"，即生成的随机性。

**数学逻辑：**
Softmax 前先把 logits 除以 T：

```
P(i) = exp(logit_i / T) / Σ exp(logit_j / T)
```

- **T → 0**：分布极度尖锐，概率全集中在最高分 token，等于 greedy decoding
- **T = 1**：保持原始概率分布不变
- **T > 1**：分布变平，各 token 概率趋于均等，更"随机创意"

---

### 2. Top-K

**控制什么：** 每次只从概率最高的 K 个 token 里采样，其余直接截断。

**逻辑：** 防止采到概率极低的奇怪词。缺点是 K 是固定的——有时前 K 个概率很分散，有时非常集中，统一用 K 不够灵活。

---

### 3. Top-P（Nucleus Sampling）

**控制什么：** 动态选取候选 token 集合，使其累积概率 ≥ P。

**逻辑：** 把 token 按概率从高到低排列，累加直到超过阈值 P，只从这个"核"里采样。

- P = 0.9 时，如果前 5 个 token 已覆盖 90% 的概率质量，就只从这 5 个里选
- 比 Top-K 更自适应：分布集中时候选集小，分散时候选集大

---

### 三者关系与工程实践

| 参数 | 作用层面 | 核心效果 |
|------|---------|---------|
| Temperature | 改变整体分布形状 | 控制随机性强弱 |
| Top-K | 硬截断候选数量 | 过滤尾部噪声 |
| Top-P | 动态截断候选集 | 更灵活的尾部过滤 |

**典型组合：**
- 创意写作：`temperature=0.9, top_p=0.95`，放开随机性
- 代码生成：`temperature=0.2, top_p=0.9`，偏确定性
- **Top-K 和 Top-P 通常二选一**，同时用容易过度限制

**执行顺序：** 先 Top-K / Top-P 过滤候选集 → 再用 Temperature 调整分布 → 最后采样

## Follow-up Questions

- Top-K 和 Top-P 同时设置时，哪个先生效？会互相叠加吗？
- 什么是 greedy decoding，它和 temperature=0 的效果完全等价吗？
- 为什么说 temperature=0 是"可复现"的，而 temperature>0 不是？
- 有没有比 Top-P 更好的采样方式？（提示：Mirostat, Min-P sampling）

## Notes

- Temperature 作用于 logits 层，Top-K / Top-P 作用于概率层，两者是不同层面的控制
- 实际调用 OpenAI API 时，`top_k` 通常不暴露，用 `top_p` 替代
- 训练时不使用这些采样参数，只在推理时生效
- 和之前讲的 Logits → Softmax → 采样流程直接衔接
