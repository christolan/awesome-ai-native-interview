# How Reasoning Models Work Under the Hood

## Interview Question

在 AI Native 工程中，你接触过支持 reasoning / thinking 的模型（如 DeepSeek-R1、OpenAI o1、Claude Extended Thinking）。请从模型运作机制层面解释：

1. thinking tokens 是什么？它们和普通 output tokens 在机制上有什么本质区别？
2. 为什么让模型"先想后答"能提升复杂推理的准确性？
3. 推理开关（reasoning on/off）在技术上是如何生效的？

## Why this question matters

Reasoning 模型是当前 AI Native 工程最前沿的话题之一。这道题考察的不是"怎么调 API"，而是对 LLM 自回归生成本质的理解——一切皆是 token。理解了这个，就能明白为什么 reasoning 不是黑魔法，而只是现有机制在新场景的应用。

## Reference Answer

### 1. Thinking Tokens 是什么？

thinking tokens 和普通 output tokens 在生成机制上完全一样——都是自回归 next token prediction。区别只在于"给谁看"。

关键洞见：thinking tokens 不是"另一个模型"在思考，而是同一个模型把它本该内部进行的推理过程"外化"成了可见 token。底层都是同一个 Transformer forward pass。没有第二套权重，没有额外模块。

### 2. 为什么"先想后答"更准确？

从自回归生成的特性来看：每个 token 都基于前面所有 token 生成。普通模型做复杂推理时，必须把多步计算压缩进"下一个 token"这一个决策里，没有机会自我修正。

Reasoning 模型的解决方案是把推理步骤写成 token，让模型能"看到"自己刚才想了什么。每个中间 token 都在缩小下一步的不确定性。这不是魔法，而是自回归生成最朴素的特性——context 越丰富，next token 越准确。

### 3. 推理开关如何生效？

推理开关不在模型内部，而在 Chat Template 层。这是 prompt engineering 的底层化——把"请一步步思考"这句自然语言，换成了特殊 token。

Chat API 不是直接调模型，而是经过翻译层用特定的 token 序列去调模型。推理开关只是这个翻译层里的一个 if-else。

### 4. 边界信号：如何标记思考结束？

DeepSeek-R1 用 `<｜end▁of▁thinking｜>` 和 ` 特殊 token。机制和 EOS 完全一样——都是词表中的特殊 token，模型在 RL 训练中学会了"推理结束就该输出 `<｜end▁of▁thinking｜>`"。OpenAI o1 的内部标记则在 API 层被隐藏，只暴露 reasoning token 计数。

核心启示：推理是 token，答案是 token，开关也是 token。没有 if-else 分支，没有模式切换，只有"从不同的 token 开始续写，就得到不同的行为"。

## Follow-up Questions

- 输出推理内容和直接输出正确内容，生成下一个 token 的机制完全一样吗？（答：forward pass 一样，训练目标不同，thinking 阶段可能用更低 temperature）
- 模型如何知道何时结束思考？有类似 EOS 的信号吗？（答：有，不同模型实现方式不同）
- 即使直接调用 API，厂商是否会注入额外上下文？（答：会，Chat Template 层负责 JSON 到 token 的翻译，所有 Chat API 都有这一层）

## Notes

- 这道题的回旋镖：用户从"完全不知道"一路追问到 chat template 层，展示了极好的追问深度
- 用户最终总结"一切皆是 token"精准到位，可作为这道题的核心论点
- 未来可就 RL 训练（GRPO）如何让模型学会 ` 展开继续问`