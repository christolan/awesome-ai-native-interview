# AGENTS.md — AI 协作维护指南

本文档面向协助维护该仓库的 AI（如 Hermes Agent）。  
描述了仓库的维护约定、工作流程和写作规范。

---

## 仓库概述

这是一个面向 AI Native 工程师的面试训练仓库，由 AI 持续维护。  
每天进行一次面试，AI 出题、点评和归档；高质量内容可沉淀为 curated 精选。

---

## 目录约定

| 目录 | 用途 |
|------|------|
| `daily/` | 每日训练记录，文件名为 `YYYY-MM-DD.md` |
| `curated/` | 精选参考答案，文件名为英文 slug，如 `what-is-rag-and-why-it-matters.md` |
| `templates/` | 写作模板，不直接修改 |
| `assets/` | 静态资源存放，如配图、截图等图片文件 |

---

## 每日面试工作流

### 1. 出题

- 每天只出一道题
- 难度根据用户实际答题表现动态调整
- 重点关注：大语言模型的原理与应用、AI Agents 开发、AI Coding 的实践

### 2. 点评

- 先肯定答得好的地方，再指出不足
- 最后给出更完整的参考答法
- 评分参考满分 10 分

### 3. 归档（用户要求时执行）

创建 `daily/YYYY-MM-DD.md`，格式参考 `templates/daily-question.md`。

补充说明：
- 忠实保留用户的原始回答
- Review 采用教练风格：先优点，再不足

### 4. 沉淀（curated）

满足以下条件才 promote：
- 题目有代表性
- 答案有长期复用价值
- 内容整理后适合独立阅读

创建 `curated/<slug>.md`。Curated 不设固定模板——它应该是一篇完整的技术文章，像一篇博客或技术分享，核心目标是把一个问题讲清楚。

同时在 `README.md` 的 curated 链接列表中追加对应链接。
- 文中出现新的核心概念时，同步追加到 `README.md` 的核心概念术语表中，保持字母序，一条一句话精准定义。

---

## 补充规范

- 所有小改动直接推送到 `main`，不需要 PR
- commit message 格式：`docs: archive day N <简短主题描述>`
- 每次归档只提交当次涉及的文件
- 不提前过度设计目录结构，内容积累后再自然演化
- 核心技术概念不做中文翻译，直接使用英文术语（如 beam search、greedy decoding、log probability、length normalization、nucleus sampling）
- 默认中文
