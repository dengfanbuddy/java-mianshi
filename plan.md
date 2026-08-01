# Java 游戏服务器面试复习题库 — 执行计划

## 背景
用户：邓凡，10 年 Java 游戏服务器开发（Netty/Disruptor/SpringBoot/MyBatis-Plus/Redis 集群/Kafka/分库分表/JUC/JVM，登录服/游戏服/支付服/日志服/GM 后台全链路，微服务 Nacos/Gateway/Dubbo/Redisson），简历：`邓凡-Java(1).pdf`。

## 交付物（已完成）
1. 分类面试题库（16 分类，data/*.js，window.QB 格式）
2. 网页版题库 index.html（左分类右内容，搜索/难度筛选/标记掌握）
3. README.md 使用说明

## 阶段 4 — 快速复习能力增强（2026-07-24，AgentSwarm 4 个并行 coder 子代理）
目标：让用户能高效自测、间隔重复、多端刷题、候场速览。

| 子代理 | 职责 | 产出文件（互不冲突） |
|---|---|---|
| UI增强工程师 | index.html 增加自测模式（随机抽题/隐藏答案/自评会·模糊·不会）、错题本、跨分类全局搜索、间隔重复到期提醒、快捷键、移动端适配 | `index.html`（仅此代理可改） |
| Anki导出工程师 | Node 脚本读取 data/*.js，导出 Anki 可导入的 TSV 牌组 + 使用说明 | `tools/export-anki.js`、`anki/` 输出 |
| 打印版工程师 | 生成打印友好的速览版（A4 排版、浓缩题干+要点），面试候场快速翻阅 | `print.html` 或生成脚本 |
| 数据质检工程师 | 校验 16 个 data 文件：ID 唯一性、level 合法、必填字段齐全、统计各分类题数，修复小问题，清理空文件 2.txt，更新 README | `data/*.js` 修复、README.md |

## 验收
- index.html 在浏览器打开无报错，自测/错题本/全局搜索/到期复习均可用
- anki 导出文件可被 Anki 直接导入
- print 版浏览器打印预览排版正常
- 质检报告全绿，README 数据与事实一致
