# AGENTS.md

面向 AI 的仓库维护指南。

---

## 仓库概述

面向 AI Native 工程师的面试训练仓库。日常维护由 AI 驱动：出题、点评、归档、沉淀。

## 目录结构

| 目录 | 用途 |
|------|------|
| `daily/` | 每日训练记录，`YYYY-MM-DD.md` |
| `templates/` | 写作模板（不直接修改） |

## 核心规范

- **小改动直推 `main`**，不需要 PR
- **commit 格式**：`docs: archive day YYYY-MM-DD <topic>`
- **每次归档只提交当次涉及的文件**
- **核心技术概念不翻译**：beam search / greedy decoding / log probability / length normalization / nucleus sampling
- **默认中文**
- **daily/ 是永久归档**，不删除；curated 内容才迁移博客

## 面试流程

详见 `hermes skills daily-interview`（引用自 `christolan/hermes-skills` 仓库，自动同步）。

## 博客仓库

`~/christolan.github.io` — Hexo 博客，push 后 GitHub Actions 自动部署。
