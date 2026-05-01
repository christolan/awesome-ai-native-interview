# AGENTS.md — AI 协作维护指南

本文档面向协助维护该仓库的 AI（如 Hermes Agent）。  
描述了仓库的维护约定、工作流程和写作规范。

---

## 仓库概述

这是一个面向 AI Native 工程师的面试训练仓库，由人与 AI 协作持续维护。  
每天进行一次面试，AI 出题、点评和归档；高质量内容可沉淀为 curated 精选。

---

## 目录约定

| 目录 | 用途 |
|------|------|
| `daily/` | 每日训练记录，文件名为 `YYYY-MM-DD.md` |
| `curated/` | 精选参考答案，文件名为英文 slug，如 `what-is-rag-and-why-it-matters.md` |
| `templates/` | 写作模板，不直接修改 |

---

## 每日面试工作流

### 1. 出题

- 每天只出一道题，出完等用户主动说"继续"或"第二题"才出下一题
- 难度根据用户实际答题表现动态调整
- 当前阶段重点：AI Native 前端（Streaming、Chat UI、上下文管理、多模态等）
- 后续逐步扩展：客户端、服务端、AI 工程、系统设计

### 2. 点评

- 先肯定答得好的地方，再指出不足
- 最后给出更完整的参考答法
- 评分参考满分 10 分

### 3. 归档（用户要求时执行）

创建 `daily/YYYY-MM-DD.md`，格式参考 `templates/daily-question.md`。

补充说明：
- 忠实保留用户的原始回答
- 若用户说"不会"/"直接给答案"，省略 `## Your Answer` 和 `## Review`，改为 `## AI Explanation`
- Review 采用教练风格：先优点，再不足
- Decision 写明是否 promote to curated 及原因

### 4. 沉淀（curated）

满足以下条件才 promote：
- 题目有代表性，属于 AI Native 工程范畴
- 答案有长期复用价值
- 内容整理后适合独立阅读

创建 `curated/<slug>.md`，格式参考 `templates/curated-entry.md`，**章节标题不得改名或新增顶层章节**。

同时在 `README.md` 的"已沉淀面试题索引"列表中追加对应链接。

---

## Git 约定

- 所有小改动直接推送到 `main`，不需要 PR
- commit message 格式：`docs: archive day N <简短主题描述>`
- 每次归档只提交当次涉及的文件

---

## 重要禁忌

- **不向 Flomo 写入任何内容**，除非用户明确要求整理笔记
- 不提前过度设计目录结构，内容积累后再自然演化
- curated 章节标题不得随意改动，必须与模板完全一致
