# AGENTS.md

面向 AI 的仓库维护指南。

---

## 仓库概述

面向 AI Native 工程师的面试训练仓库。日常维护由 AI 驱动：出题、点评、归档。

## 目录结构

| 目录 | 用途 |
|------|------|
| `daily/` | 每日训练记录，`YYYY-MM-DD.md` |
| `templates/` | 写作模板（不直接修改） |

## 每日面试工作流

### 1. 出题

- **出题方向**：LLM 原理 / AI Agents / AI Coding
- 出题前查看仓库 README 中的过往题目索引，避免重复问题

### 2. 等待作答

- 作答过程中不给提示

### 3. 点评

- 用户不知道答案直接记"不知道"，不需要点评
- 用户正常回答后先指出回答中不足的地方，然后给出参考答案
- 参考答案按照金字塔原理组织
- 不打分

### 4. 归档

按仓库模板创建 `daily/YYYY-MM-DD.md`：

> **归档模板**：`templates/daily-question.md`

模板只有 4 个 section：**Question → Your Answer → Review → Improved Answer**。不要添加 Expected points、Why this matters、Decision 等非模板字段。

注意事项：

- 用户回答一字不落的记录下来，不要做任何加工润色，直接复制
- 用户的追问行为只用于修正参考答案，不需要在其他地方体现
- 用户有追问的情况下，归档前先将归档内容发给用户 Review，得到明确指令后再写入仓库

## 核心规范

- **小改动直推 `main`**，不需要 PR
- **commit 格式**：`docs: archive day YYYY-MM-DD <topic>`
- **每次归档只提交当次涉及的文件**
- **核心术语只用英文**（如 beam search、greedy decoding、log probability）
- **默认中文**
