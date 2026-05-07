# AGENTS.md

面向 AI 的仓库维护指南。

---

## 仓库概述

面向 AI Native 工程师的面试训练仓库。日常维护由 AI 驱动：出题、点评、归档。

## 目录结构

| 目录 | 用途 |
|------|------|
| `daily/` | 每日训练记录，`YYYY-MM-DD.md` |

## 每日面试工作流

### 1. 出题

- **出题方向**：LLM 原理 / AI Agents / AI Coding
- 出题前查看仓库 README 中的过往题目索引，避免重复问题
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

- 归档时必须同步更新 `README.md` 的「面试题索引」，追加当天题目
- 用户回答一字不落的记录下来，不要做任何加工润色，直接复制
- 如果点评后用户继续追问或要求修正参考答案，则归档前必须先把完整归档内容发给用户确认
- 用户追问本身不写入 `daily` 文件，只把追问带来的修正体现在 `Improved Answer` 中

## 核心规范

- **小改动直推 `main`**，不需要 PR
- **commit 格式**：`docs: archive day YYYY-MM-DD <topic>`
- **每次归档只提交当次涉及的文件**
- **核心术语只用英文**（如 beam search、greedy decoding、log probability）
- **默认中文**
