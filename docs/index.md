# awesome-ai-native-interview

## 项目简介

AI Native 工程师面试题库

## 面试题索引

### [2026-05-17｜Self-Attention 机制与上下文表示](daily/2026-05-17.md)

摘要：考察 self-attention 如何通过 Query / Key / Value 和 attention score 建模 token 间关系，形成上下文化表示，并理解其相对 RNN 的长距离依赖优势与计算代价。

### [2026-05-16｜模型幻觉（hallucination）的成因与治理](daily/2026-05-16.md)

摘要：考察 hallucination 的定义、与普通错误的区别、从自回归生成机制看其成因，以及通过 RAG、工具校验、约束生成、评估监控等工程手段降低幻觉。

### [2026-05-15｜Logits / Softmax / Token Probability 与 Temperature](daily/2026-05-15.md)

摘要：考察 LLM 下一个 token 生成链路中的 logits、softmax、概率分布和 temperature，重点理解 logits 差值的指数效应及其对随机性的影响。

### [2026-05-14｜AI Coding Agent 的 test selection 与 verification boundary](daily/2026-05-14.md)

摘要：考察 Coding Agent 如何选择测试和定义验证边界，包括根据改动范围挑选单测 / 集成测试、避免过度验证或漏测，并给出可信的完成判断。

### [2026-05-13｜AI Coding Agent 的 implementation plan 判断机制](daily/2026-05-13.md)

摘要：考察 Coding Agent 在写代码前如何制定和判断 implementation plan，包括需求澄清、任务拆分、风险识别、验证路径和计划与执行的同步更新。

### [2026-05-12｜Agent 工具调用权限控制](daily/2026-05-12.md)

摘要：考察 Agent 工具权限与安全边界设计，包括工具分级、最小权限、敏感操作确认、审计日志、沙箱隔离和防止越权调用。

### [2026-05-11｜AI Coding Agent 改动范围控制](daily/2026-05-11.md)

摘要：考察 AI Coding Agent 的变更边界控制能力，包括如何限制文件范围、避免无关重构、保持 diff 可审查，并通过计划、权限和验证降低破坏性修改。

### [2026-05-10｜客服工单助手的 Tool Call Evaluation](daily/2026-05-10.md)

摘要：考察 tool call 评测体系设计，包括工具选择、参数填写、调用顺序、失败恢复、golden cases 构造，以及线上错误的归因分析。

### [2026-05-09｜程序员视角的 AI Coding Agent](daily/2026-05-09.md)

摘要：考察对 AI Coding Agent 的工程理解，包括它与普通代码补全 / Chatbot 的区别，以及任务拆解、工具调用、代码修改、测试验证和人类协作边界。

### [2026-05-08｜企业知识库 RAG 的检索质量优化](daily/2026-05-08.md)

摘要：考察企业知识库问答中的检索优化能力，包括 chunking、query rewrite、hybrid search、rerank、metadata filter 和召回质量评估。

### [2026-05-07｜KV Cache 原理与自回归生成加速](daily/2026-05-07.md)

摘要：考察 Transformer 自回归生成中的 KV Cache 机制，理解缓存 Key / Value 如何避免重复计算，以及它对长文本生成延迟和显存占用的影响。

### [2026-05-06｜RAG 生产环境常见失败模式与排查](daily/2026-05-06.md)

摘要：考察生产级 RAG 的系统排查能力，包括 retrieval、generation、端到端 pipeline、评估监控等环节的失败模式、定位方法和优化手段。

### [2026-05-05｜ReAct 模式（Reasoning + Acting）](daily/2026-05-05.md)

摘要：考察 Agent 的 ReAct 范式，理解 Reasoning 与 Acting 如何交替推进任务，并能比较 ReAct、纯 CoT 和纯 Tool-Use 在真实落地中的优劣。

### [2026-05-04｜Reasoning Model 运作机制（thinking tokens）](daily/2026-05-04.md)

摘要：考察 reasoning / thinking 模型的生成机制，理解 thinking tokens 与普通 output tokens 的关系，以及流式响应中推理内容和最终答案的工程处理差异。

### [2026-05-03｜Function Call / Tool Call 前端处理流程](daily/2026-05-03.md)

摘要：考察 AI Chat 产品处理 tool call 的完整流程，包括接收 tool_calls、执行业务函数、回传工具结果、继续模型生成，以及工具调用状态的 UI 表达。

### [2026-05-02｜流式对话的中断与恢复](daily/2026-05-02.md)

摘要：考察前端 AI 对话中可中断生成和恢复续写的设计，包括 AbortController、请求取消、部分回答保存、上下文续接和 UI 状态一致性。

### [2026-05-01｜Beam Search 原理与解码策略对比](daily/2026-05-01.md)

摘要：考察 beam search、greedy decoding 与随机采样的区别，理解多候选路径搜索的优缺点，以及为什么现代对话模型通常不优先使用 beam search。

### [2026-04-30｜Temperature / Top-K / Top-P 采样参数](daily/2026-04-30.md)

摘要：考察 LLM decoding 中常见采样参数的作用和数学直觉，包括 temperature 对概率分布的平滑、top_k / top_p 的候选集截断，以及工程组合策略。

### [2026-04-29｜多模态输入（文字 + 图片）图文混合问答](daily/2026-04-29.md)

摘要：考察多模态对话产品的前端实现，包括图片上传链路、图文请求体组织、预览压缩、格式限制，以及上传失败、弱网和隐私等边界体验。

### [2026-04-27｜RAG 原理与常见挑战](daily/2026-04-27.md)

摘要：考察 RAG 的基本链路和工程难点，包括文档切分、embedding、召回、重排、上下文拼接，以及检索不准、信息过期和 hallucination 等问题。

### [2026-04-26｜Embedding / Vector Search / RAG 协同工作](daily/2026-04-26.md)

摘要：考察 Token、Embedding、Vector Database 与 RAG 的关系，重点理解语义向量化、向量检索和检索增强生成如何在知识问答场景中协同工作。

### [2026-04-25｜中老年新闻 App + AI 图片理解](daily/2026-04-25.md)

摘要：考察移动端信息流场景的性能优化能力，包括首屏加载、弱网缓存、骨架屏、列表虚拟化、图片懒加载、解码优先级和离线容灾。

### [2026-04-24｜Web 应用接入流式 AI 对话（实时 token 展示）](daily/2026-04-24.md)

摘要：考察 Web 前端接入流式 AI 接口的工程实现，包括 SSE / streaming fetch、增量 token 渲染、状态管理、异常处理和用户可感知的实时反馈。

### [2026-04-23｜上下文管理（context management）方案设计](daily/2026-04-23.md)

摘要：考察 AI 对话产品中的 context window 管理能力，包括多轮会话历史取舍、摘要压缩、关键信息保留，以及在成本、效果和延迟之间的权衡。

### [2026-04-22｜流式输出（streaming response）与即时展示的重要性](daily/2026-04-22.md)

摘要：考察 streaming response 的定义、与传统 request-response 的区别，以及它在 LLM 逐 token 生成场景下对用户体验、前端增量渲染和中断交互的影响。

## 核心概念

- [查看核心概念词典](core-concepts.md)
