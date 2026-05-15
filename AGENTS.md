# AGENTS.md

面向 AI 的仓库维护指南。

---

## 仓库概述

面向 AI Native 工程师的面试训练仓库。日常维护由 AI 驱动：出题、点评、归档。

## 目录结构

| 目录 | 用途 |
|------|------|
| `daily/` | 每日训练记录，`YYYY-MM-DD.md` |

## 面试定位与核心重点

用户后续面试训练的主线是：**基于可直接调用的大模型 API，构建可靠、可控、可评测、可持续迭代的上层 AI 应用系统**。

面试不再以基础模型训练为主线，也不优先考察预训练、模型架构创新、分布式训练、CUDA / GPU kernel、推理引擎底层实现等底层方向。除非为了帮助理解应用层边界，否则这些内容只作为背景知识出现。

### 重点领域排序

后续出题应按以下顺序组织，形成从单次模型调用到完整应用系统的递进关系：

1. **Context Engineering**：Prompt Design、message structure、structured output、conversation state、memory management、long context compression。
2. **Knowledge Grounding / RAG**：document parsing、chunking strategy、embedding、vector search、hybrid search、reranking、citation、RAG Evaluation。
3. **Tool Use / Function Calling**：tool schema design、tool routing、parameter filling、API orchestration、permission control、sandbox execution、human-in-the-loop、error recovery。
4. **Workflow / Agent**：task decomposition、planner-executor、state machine、task queue、retry / rollback、agent memory、multi-agent collaboration、human approval。
5. **Evaluation**：golden dataset、prompt regression test、LLM-as-a-Judge、human evaluation、RAG Evaluation、Tool Call Evaluation、Agent Evaluation、A/B Test。
6. **Observability**：trace、logs、metrics、token cost tracking、latency monitoring、prompt versioning、model versioning、retrieval analytics、feedback analytics。
7. **AI Product Design**：AI UX、trust design、error recovery UX、feedback loop、personalization、user onboarding、business workflow integration。

### 出题优先级

- **第一优先级**：Context Engineering + RAG + Evaluation。这三项是所有知识型 AI 应用从 demo 走向可用系统的基础。
- **第二优先级**：Tool Use + Workflow / Agent。用于考察模型从“回答问题”走向“执行任务”的工程能力。
- **第三优先级**：Observability + AI Product Design。用于考察应用上线后的诊断、迭代、成本控制和用户信任设计。

### 面试题设计原则

- 每道题应围绕一个应用层核心问题展开，例如“如何让模型理解正确任务”“如何降低 RAG 幻觉”“如何设计 tool schema”“如何评测 Agent 是否完成任务”。
- 题目要鼓励用户解释：**系统链路、关键权衡、失败模式、评测方法、工程边界**。
- 优先使用场景化问题，而不是纯概念背诵。例如：企业知识库问答、AI Coding Agent、客服工单助手、文档生成 Copilot、数据分析助手等。
- 对每个主题，尽量追问生产环境关注点：权限、安全、延迟、成本、可观测性、回滚、人工确认、用户反馈闭环。
- 面试目标不是考察是否记住术语，而是训练用户把模型 API 能力组织成可落地应用系统的能力。

## 每日面试工作流

### 1. 出题

- **出题方向**：以 AI Application Layer 为主线，重点覆盖 Context Engineering / RAG / Tool Use / Workflow / Agent / Evaluation / Observability / AI Product Design；LLM 原理只作为应用层必要背景
- 出题前查看仓库 `index.md` 中的过往题目索引，避免重复问题
- 每题聚焦一个核心主题，避免一次考察过多无关概念
- 题目应偏面试问法，鼓励用户解释原理、权衡和工程影响
- 可包含 2-4 个引导维度，但不要在出题时暴露参考答案

### 2. 等待作答

- 作答过程中不给提示

### 3. 点评

- 用户回答"不知道"时，`Your Answer` 原样记录"不知道"
- 用户回答"不知道"时，`Review` 不做不足点评，可写"本次未作答，完整示范回答如下。"
- 用户回答"不知道"时，`Improved Answer` 仍需提供完整参考答案
- 用户正常回答后先指出回答中不足的地方，然后给出参考答案
- 参考答案按照金字塔原理组织
- 不打分

### 4. 归档

按以下结构创建 `daily/YYYY-MM-DD.md`：

```markdown
# YYYY-MM-DD

## Question
<!-- write question here -->

## Your Answer
<!-- write your answer here -->

## Review
<!-- feedback -->

## Improved Answer
<!-- refined answer -->
```

归档文件只有 4 个 section：**Question → Your Answer → Review → Improved Answer**。不要添加 Expected points、Why this matters、Decision 等非模板字段。

注意事项：

- 归档时必须同步更新 `index.md` 的「面试题索引」，追加当天题目
- 用户回答一字不落的记录下来，不要做任何加工润色，直接复制
- 如果点评后用户继续追问或要求修正参考答案，则归档前必须先把完整归档内容发给用户确认
- 用户追问本身不写入 `daily` 文件，只把追问带来的修正体现在 `Improved Answer` 中

## 核心规范

- **小改动直推 `main`**，不需要 PR
- **commit 格式**：`docs: archive day YYYY-MM-DD <topic>`
- **每次归档只提交当次涉及的文件**
- **核心术语只用英文**（如 beam search、greedy decoding、log probability）
- **默认中文**
