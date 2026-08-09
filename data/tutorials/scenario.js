window.TB = window.TB || {};
window.TB["scenario"] = {
  id: "scenario",
  name: "系统设计与场景题",
  icon: "🏗️",
  nodes: [
 {
  "id": "scenario-design-method",
  "title": "系统设计方法论：从需求澄清到表达框架",
  "layer": 0,
  "depends": [],
  "covers": [
   "scenario-04",
   "scenario-19"
  ],
  "quiz": [
   "scenario-04"
  ],
  "body": [
   {
    "t": "lead",
    "text": "开放设计题没有标准答案，但有一套「需求澄清→规模估算→架构分层→核心流程→数据模型→扩展性→可用性→表达」的固定打法——面试官考的不是你会不会某个方案，而是你拿到模糊题目后会不会『有章法地逼近』。"
   },
   {
    "t": "pre",
    "items": [
     "做过登录服/游戏服/支付服/日志服/GM 后台，有真实系统的容量与架构直觉",
     "懂 Redis/Kafka/MySQL 单机与集群的吞吐量级",
     "不需要先学本分类其他节点"
    ]
   },
   {
    "t": "h",
    "text": "第一步：需求澄清——先问五个问题，再画一张图"
   },
   {
    "t": "p",
    "text": "一道设计题通常只有一句话，比如『设计一个排行榜』。直接开画等于把自己往沟里带。先向面试官确认五个维度：① 用户规模与 QPS（多少注册、多少活跃、峰值并发多少）；② 读写特征（读多写多、实时性要求、延迟预算）；③ 一致性要求（能否容忍最终一致、能否容忍展示延迟）；④ 可用性预期（停机多久可接受、是否需要跨区容灾）；⑤ 边界条件（客户端是否可信、是否有防刷/风控要求）。这五个问题问完，题目从『开放题』变成『选择题』，你后面每一步都有依据，面试官也能立刻判断你『做过系统』而不是『背过答案』。"
   },
   {
    "t": "list",
    "items": [
     "规模：注册/活跃/峰值 QPS/DAU，直接决定要不要分库分表、要不要消息队列",
     "读写的比例与热点：排行榜写少读多，聊天写多读多，秒杀读写都高且单点热点",
     "一致性：游戏资产强一致（钻石/背包），展示类数据最终一致即可（排名/在线状态）",
     "延迟预算：战斗结算毫秒级，邮件推送可秒级，日志可分钟级",
     "可信边界：客户端一切输入都不可信，校验必须在服务端"
    ]
   },
   {
    "t": "h",
    "text": "第二步：规模估算——数量级比精确数字重要"
   },
   {
    "t": "p",
    "text": "面试官要的是『数量级判断力』，不是精确计算。记住几个基准：单台 Redis 读约 10 万 QPS、写约 3~5 万 QPS；单 MySQL 主库稳定扛几千 TPS，上限在 1 万左右；Kafka 单分区顺序写吞吐可达每秒数十万条，集群亿级消息/天很常见。推算公式：峰值 QPS = DAU × 平均操作数 / 秒数 × 峰值系数。举例：10 万 DAU，每人每天 30 次道具操作，集中在 2 小时（7200 秒），峰值系数取 5，则峰值 QPS ≈ 100000 × 30 / 7200 × 5 ≈ 2 万。再用『单机上限除一下』就知道要几台 Redis、要不要拆库。存储同理：按单玩家多少 KB 算总容量，再乘以冗余系数。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 规模估算：把口头推算变成可复用的小工具（面试时可心算同款）\npublic class CapacityEstimator {\n    /** 峰值QPS估算：avgOpsPerUser 每用户日均操作数，peakHours 高峰小时数，burst 峰值系数 */\n    public static double peakQps(long dau, double avgOpsPerUser, double peakHours, double burst) {\n        return dau * avgOpsPerUser / (peakHours * 3600) * burst;\n    }\n    // 例：10万DAU、人均30次操作、集中在2小时、峰值系数5\n    // = 100000 * 30 / 7200 * 5 ≈ 20833 QPS\n    public static double storageBytes(long players, int bytesPerPlayer, double replicas) {\n        return players * bytesPerPlayer * replicas;\n    }\n    // 例：100万玩家 × 5KB 档案 × 3副本 = 15GB，单 Redis/单 MySQL 都装得下\n}"
   },
   {
    "t": "h",
    "text": "第三步：架构分层与核心流程"
   },
   {
    "t": "p",
    "text": "游戏服务端通用分层：接入层（Netty 网关：编解码、鉴权、限流、连接管理）→ 逻辑层（游戏服/跨服服/支付服：状态机与业务规则）→ 数据层（Redis 缓存 + MySQL 持久化 + Kafka 异步）。每个请求画一条主流程线，再标出哪些步骤是同步的、哪些丢给异步。核心流程一定画清楚『谁持有权威状态』：游戏服持有玩家内存态，DB 是最终持久层，Redis 是加速层——三者顺序错了就是数据不一致。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">系统设计通用分层：接入→逻辑→数据，请求画主线，旁路走异步</text>\n<rect x=\"30\" y=\"48\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">接入层（无状态，可水平扩展）</text>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty 网关：编解码 / token 鉴权 / 限流 / 连接管理</text>\n<path d=\"M320 100 L320 122\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#m1a)\"/>\n<rect x=\"30\" y=\"122\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"142\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">逻辑层（有状态：持有权威状态）</text>\n<text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服(玩家内存态) / 跨服服 / 支付服：状态机 + 业务规则</text>\n<path d=\"M320 174 L320 196\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#m1a)\"/>\n<rect x=\"30\" y=\"196\" width=\"280\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"216\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">数据层：Redis（热数据）</text>\n<text x=\"170\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">排行榜/在线态/锁：加速层</text>\n<rect x=\"330\" y=\"196\" width=\"280\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"216\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">数据层：MySQL（持久层）</text>\n<text x=\"470\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家档案/流水：最终一致基准</text>\n<rect x=\"30\" y=\"266\" width=\"580\" height=\"0\" rx=\"0\" fill=\"none\" stroke=\"none\"/>\n<text x=\"320\" y=\"292\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Kafka：旁路异步通道（日志、对账、广播），不阻塞主流程</text>\n<defs><marker id=\"m1a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：系统设计通用分层骨架"
   },
   {
    "t": "h",
    "text": "第四步：数据模型与第五步：扩展性、可用性"
   },
   {
    "t": "p",
    "text": "数据模型回答三件事：核心实体（玩家、道具、订单、邮件）怎么建表；主键怎么定（雪花 ID 还是自增）；读写热点怎么拆（缓存 key 设计、是否分表）。扩展性回答『流量翻十倍怎么办』：接入层加机器即可（无状态），逻辑层按玩家 ID 分片（单写原则），数据层 Redis 集群扩容 + 分库分表。可用性回答『挂了怎么办』：Redis 主从+哨兵/集群、MySQL 主从切换、逻辑层做热备或快速重启恢复、关键链路降级（排行榜读旧快照、聊天降级成只发不收）。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "关键动作",
     "游戏场景落地"
    ],
    "rows": [
     [
      "扩展性",
      "无状态层水平扩容；有状态层按玩家 ID 分片；数据层集群化",
      "登录服随便加机器；游戏服按区服/分线分片；Redis Cluster 扩槽"
     ],
     [
      "可用性",
      "主从切换、降级、限流熔断、快速恢复",
      "Redis 挂了排行榜读快照；DB 挂了读写分离读从库；秒杀限流兜底"
     ]
    ]
   },
   {
    "t": "h",
    "text": "表达框架：STAR-五步法，把答案钉在结构里"
   },
   {
    "t": "p",
    "text": "所有设计题统一按五步讲，答案永远有条理：① 需求澄清（30 秒，问清规模/读写/一致性）；② 容量估算（30 秒，给出数量级）；③ 架构与核心流程（2 分钟，画分层 + 主流程 + 权威状态归属）；④ 关键点与细节（1 分钟，挑 2~3 个工程细节，如幂等、热点、降级）；⑤ 取舍与扩展（30 秒，主动讲这个方案牺牲了什么、还能怎么演进）。每步说完用『所以』收束到下一步，整体一气呵成。深度藏在第四步：一句话带过『用 Redis ZSet』没有价值，展开『怎么处理同分、怎么重建、怎么降级』才是 10 年经验的体现。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">开放设计题答题五步法（面试表达骨架）</text>\n<rect x=\"30\" y=\"46\" width=\"104\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"82\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 澄清需求</text>\n<text x=\"82\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">规模/读写/一致性/可用性/边界</text>\n<text x=\"82\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">先问再做</text>\n<rect x=\"150\" y=\"46\" width=\"104\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"202\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 容量估算</text>\n<text x=\"202\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">峰值QPS/存储/单机上限</text>\n<text x=\"202\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">数量级即可</text>\n<rect x=\"270\" y=\"46\" width=\"104\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 架构流程</text>\n<text x=\"322\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分层+主流程+权威状态</text>\n<text x=\"322\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">画图讲</text>\n<rect x=\"390\" y=\"46\" width=\"104\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"442\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 关键细节</text>\n<text x=\"442\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">幂等/热点/降级/防刷</text>\n<text x=\"442\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">深度所在</text>\n<rect x=\"510\" y=\"46\" width=\"104\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"562\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">⑤ 取舍演进</text>\n<text x=\"562\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">牺牲了什么/如何演进</text>\n<text x=\"562\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">主动收尾</text>\n<path d=\"M134 106 L150 106\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#m1b)\"/>\n<path d=\"M254 106 L270 106\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#m1b)\"/>\n<path d=\"M374 106 L390 106\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#m1b)\"/>\n<path d=\"M494 106 L510 106\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#m1b)\"/>\n<rect x=\"30\" y=\"184\" width=\"584\" height=\"34\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"206\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">回答主线：一句话结论 → 五步展开 → 主动补 2~3 个工程细节 → 总结取舍</text>\n<defs><marker id=\"m1b\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 2：面试答题五步法"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 面试表达骨架：开头一句话结论 + 五步展开（这是你回答的『代码结构』）\npublic class InterviewAnswer {\n    // 第0句：一句话结论（给出主方案 + 核心取舍）\n    // 「排行榜用 Redis ZSet，member=玩家ID、score=战力，天然 O(logN) 支持 TopN 与名次查询。」\n    // 第1步：需求澄清 → 第2步：容量估算 → 第3步：架构与核心流程 → 第4步：关键细节 → 第5步：取舍演进\n    // 关键细节举例（展示深度，只讲 2~3 个）：\n    //  1) 同分排序：score = 战力 * 10^13 + (10^13 - 时间戳)，先到先得\n    //  2) 写路径异步：玩家属性变更 → DB → 发事件 → ZADD，主流程不阻塞\n    //  3) 宕机恢复：启动预热脚本从 DB 全量重建，重建期降级读旧快照\n}"
   },
   {
    "t": "pits",
    "items": [
     "一上来就画架构，不先澄清需求——开放题默认你先问规模/读写/一致性，跳过等于外行",
     "只背命令/组件名，说不出为什么——『用 ZSet』必须接『因为跳表 O(logN) + 天然有序 + 单机十万QPS』",
     "容量估算全靠嘴说没有数字——背下 Redis/MySQL/Kafka 的单机量级，张口就来",
     "忽略权威状态归属——说『双写 DB 和缓存』基本等于送命，必须讲清谁是权威谁是对账",
     "没有取舍意识——任何方案都有代价，主动讲『我牺牲了什么换来了什么』"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：设计题 = 澄清需求 + 数量级估算 + 分层架构 + 权威状态 + 关键细节 + 取舍，五步法把模糊问题变成结构化的『选择题』；深度靠第④步的幂等/热点/降级细节，而不是方案名本身。"
   }
  ]
 },
 {
  "id": "scenario-common-components",
  "title": "通用组件设计：分布式 ID、限流器、分布式锁、配置中心",
  "layer": 0,
  "depends": [
   "scenario-design-method"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "分布式 ID、限流器、分布式锁、配置中心是游戏后端反复要用的『基础设施四件套』——每个都能单独出道成题，也会以『你是怎么做防超卖的/怎么控流量的』形式藏在业务题里。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 Redis 常用命令（SETNX/INCR/DECR/EXPIRE）与 Lua 脚本原子性",
     "理解 MySQL 主键与 B+ 树索引的关系",
     "知道配置变更需要不停服生效"
    ]
   },
   {
    "t": "h",
    "text": "组件一：分布式 ID——雪花算法、号段、Redis INCR 三选一"
   },
   {
    "t": "p",
    "text": "雪花算法（Snowflake）是 2010 年 Twitter 开源的 64 位分布式 ID 方案：1 位符号位 + 41 位毫秒时间戳 + 10 位机器 ID + 12 位序列号，单机单毫秒可生成 4096 个 ID，趋势递增、完全本地生成无网络开销。代价是强依赖机器时钟，时钟回拨会重复发号（需阻塞等待或记录上次时间戳自检）；且 41 位时间戳从自定义纪元起算约可用 69 年。号段（Segment）方案从 DB 取一段区间（如一次取 10000 个 ID 缓存到本地内存），DB 只记录当前号段，性能高且可批量生成，缺点是重启会浪费未用完的号段、趋势递增非严格。Redis INCR 最简单但单点有热点，且每发一个 ID 一次网络往返。游戏场景选型：流水表/订单表主键用雪花（带时间语义、可反查生成时间）；运营活动发放的序列号/礼包码用号段批量生成；实时计数类（如全服首杀序号）用 Redis INCR。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 雪花算法核心（简化版）：时间戳左移22位 | 机器位<<12 | 序列号\npublic class Snowflake {\n    private final long workerId;       // 10位机器ID（含数据中心位）\n    private long lastTs = -1L;         // 上次生成时间戳\n    private long seq = 0;              // 12位序列号\n\n    public synchronized long nextId() {\n        long ts = System.currentTimeMillis();\n        if (ts < lastTs) {             // 时钟回拨：最简单处理是抛异常/阻塞等待\n            throw new IllegalStateException(\"clock moved backwards\");\n        }\n        if (ts == lastTs) {\n            seq = (seq + 1) & 0xFFF;   // 同一毫秒内 seq 自增，12位封顶4096\n            if (seq == 0) {            // 序列号耗尽，等下一毫秒\n                while ((ts = System.currentTimeMillis()) <= lastTs) { /* busy wait */ }\n            }\n        } else {\n            seq = 0;\n        }\n        lastTs = ts;\n        // 1位符号(0) | 41位时间戳 | 10位机器 | 12位序列\n        return (ts << 22) | (workerId << 12) | seq;\n    }\n}"
   },
   {
    "t": "h",
    "text": "组件二：限流器——令牌桶 vs 漏桶，固定窗口 vs 滑动窗口"
   },
   {
    "t": "p",
    "text": "限流核心是『允许突发但有限制』。令牌桶：桶容量 capacity，按 rate 匀速生成令牌，请求取令牌成功才放行——允许一定突发（桶里攒的令牌可瞬间消耗），适合游戏登录洪峰、GM 批量操作。漏桶：请求进桶、按固定速率流出——完全平滑，超出的拒绝，适合下游吞吐严格固定的场景（如把秒杀流量按固定速率灌给 DB）。固定窗口计数简单但有『窗口边界双倍突发』问题（比如限 100 次/秒，59.9 秒和 0.1 秒各来 100 次都通过）；滑动窗口/滑动日志更精确但成本高。Redis 落地：令牌桶用 Lua 原子执行『按时间差补令牌 + 扣令牌』；固定窗口用 INCR + EXPIRE；更推荐 Redis 集群前置一个无状态限流层（如网关），把限流从业务里剥离。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">四种基础组件：选型矩阵</text>\n<rect x=\"30\" y=\"44\" width=\"280\" height=\"92\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">分布式 ID</text>\n<text x=\"170\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">雪花=本地生成+趋势递增，怕时钟回拨</text>\n<text x=\"170\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">号段=批量取号，适合流水/礼包码</text>\n<text x=\"170\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis INCR=最简单，单点热点</text>\n<rect x=\"330\" y=\"44\" width=\"280\" height=\"92\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">限流器</text>\n<text x=\"470\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">令牌桶=允许突发，适合登录洪峰</text>\n<text x=\"470\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"ink\">漏桶=完全平滑，适合保护下游DB</text>\n<text x=\"470\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">固定窗口有边界双倍突发风险</text>\n<rect x=\"30\" y=\"148\" width=\"280\" height=\"92\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"170\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">分布式锁</text>\n<text x=\"170\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"ink\">SETNX+过期时间，防误删+续期</text>\n<text x=\"170\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"ink\">Redisson 看门狗自动续期</text>\n<text x=\"170\" y=\"234\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis 主从切换可能丢锁，强一致用 ZK/etcd</text>\n<rect x=\"330\" y=\"148\" width=\"280\" height=\"92\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"170\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">配置中心</text>\n<text x=\"470\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"ink\">版本号+变更推送，内存引用原子替换</text>\n<text x=\"470\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"ink\">错误配置可回滚，双写兼容</text>\n<text x=\"470\" y=\"234\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">校验先行，上线前灰度验证</text>\n</svg>",
    "caption": "图 1：四件套选型矩阵"
   },
   {
    "t": "h",
    "text": "组件三：分布式锁——防超卖、防重复、防顶号"
   },
   {
    "t": "p",
    "text": "分布式锁三要素：加锁（SET key token EX seconds NX，NX 保证只加一次）、解锁（Lua 校验 token 再 DEL，防止误删别人的锁）、续期（Redisson 看门狗机制：锁超时前自动续期，任务没跑完锁不会先过期）。游戏里的典型用法：限时礼包每人限购 1 份（用锁 + 购买名单）；补偿邮件发放幂等（锁 + 领取状态位）；玩家顶号（登录时加『在线锁』）。注意：Redis 锁是『可用性优先』方案，主从切换瞬间可能丢锁，导致两个客户端同时持锁；对一致性要求极高的场景（如账务扣款）用 ZooKeeper/etcd 的临时顺序节点锁，代价是吞吐低。判断标准：业务容忍偶发重复就 Redis 锁，绝不接受就 ZK 锁。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Redis 分布式锁 + Lua 解锁：token 防止误删，NX+EX 保证原子\npublic class RedisLock {\n    private final Jedis jedis;\n    // 加锁：SET key token PX 30000 NX —— 同一 key 同时只有一人成功\n    public boolean tryLock(String key, String token, long expireMs) {\n        String r = jedis.set(key, token, \"NX\", \"PX\", expireMs);\n        return \"OK\".equals(r);\n    }\n    // 解锁：Lua 校验 token，避免删掉别人的锁（A 超时→B 加锁→A 来解锁）\n    private static final String UNLOCK_LUA =\n        \"if redis.call('get', KEYS[1]) == ARGV[1] then \" +\n        \"  return redis.call('del', KEYS[1]) \" +\n        \"else return 0 end\";\n    public boolean unlock(String key, String token) {\n        return ((Long) jedis.eval(UNLOCK_LUA, 1, key, token)) == 1L;\n    }\n    // 生产环境用 Redisson RLock：watchdog 自动续期 + 可重入\n}"
   },
   {
    "t": "h",
    "text": "组件四：配置中心——不停服改配置"
   },
   {
    "t": "p",
    "text": "配置中心解决『配置改一下就要重启』的问题。核心机制：配置存储于中心（DB/文件 + 版本号）→ 服务启动拉全量 → 中心推送变更（WebSocket/长轮询）→ 本地校验 → 原子替换内存引用（volatile 引用 / CopyOnWrite 列表），读侧无感知。游戏场景高频用法：活动开关（活动配置改完立即生效）、节日限流阈值、GM 指令开关、掉线重连窗口时长。设计要点：① 配置校验先行（格式/取值范围校验失败不发布，避免把坏配置推上全服）；② 可回滚（保留版本历史，一键回退）；③ 灰度（先推测试服验证再全量）；④ 变更要有审计（谁改了什么，配合 GM 后台）。这正好对接邓凡的导表工具与热更新经验——策划改表 → 导表校验 → 配置中心热更进游戏服，全程不停服。"
   },
   {
    "t": "pits",
    "items": [
     "分布式锁只加锁不解锁/不解 token——A 超时释放了 B 的锁，是经典送命题",
     "雪花算法不处理时钟回拨——NTP 一跳就重复发号，线上事故的常见来源",
     "限流只做单机——多台游戏服各限各的，总量失控，要 Redis 集中限流",
     "配置中心没有校验直接替换——坏配置推上去比旧配置更糟，必须『先校验后发布』",
     "把 Redis 锁当强一致锁——主从切换丢锁在账务场景不可接受，要讲清选型边界"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：四件套各有适用边界——ID 按『时间语义/批量/简单』三选一，限流按『突发/平滑』选令牌桶或漏桶，锁按『可用性/强一致』选 Redis 或 ZK，配置中心核心是『校验+原子替换+回滚+灰度』。能把这四个组件讲透，秒杀、防刷、热更新题目就都有了弹药。"
   }
  ]
 },
 {
  "id": "scenario-bag-item",
  "title": "玩家背包/道具系统：存储模型与增删改的原子性",
  "layer": 1,
  "depends": [
   "scenario-design-method"
  ],
  "covers": [
   "scenario-21"
  ],
  "quiz": [
   "scenario-21"
  ],
  "body": [
   {
    "t": "lead",
    "text": "背包是所有游戏的『资产核心』：道具的堆叠、绑定、过期、流水都绕不开它——设计好存储模型和增删改的原子性，等于给整个经济系统打了地基。"
   },
   {
    "t": "pre",
    "items": [
     "理解 MySQL 事务 ACID 与行锁",
     "熟悉 Redis 缓存与 DB 的关系（缓存一致性）",
     "有发放/消耗道具的业务经验（邮件、商店、任务领奖都动背包）"
    ]
   },
   {
    "t": "h",
    "text": "存储模型：格子制 vs 物品表，怎么选"
   },
   {
    "t": "p",
    "text": "两种主流模型。格子制：背包固定 N 个格子，player_bag(player_id, slot, item_id, count, bind, expire_time)，一行一格，格子数有限（如 100 格），天然直观、前端好画格子；缺点是格子即上限，扩容要加格子。物品表制：每件道具一行 player_items(id, player_id, item_id, count, props, bind, expire_time)，支持无限叠放与每件独立属性（强化等级、耐久、随机词条），适合 MMORPG 的复杂道具；缺点是没有『格子』概念，前端要自己摆。一般规律：卡牌/休闲/merge 类用格子制（格子少、道具简单），MMORPG/数值深做物品表。关键点：item_id 只是『配置 ID』，同一 item_id 的道具可能有不同的实例属性（绑定/强化/随机词条），此时必须用『实例行』而非纯计数叠加。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">背包存储模型对比：格子制 vs 物品表制</text>\n<rect x=\"30\" y=\"46\" width=\"280\" height=\"118\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">格子制 player_bag</text>\n<text x=\"170\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">player_id, slot, item_id, count</text>\n<text x=\"170\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">bind, expire_time</text>\n<text x=\"170\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">格子有限、前端直观</text>\n<text x=\"170\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">适合 merge/休闲/卡牌</text>\n<rect x=\"330\" y=\"46\" width=\"280\" height=\"118\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">物品表 player_items</text>\n<text x=\"470\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">id, item_id, count, props</text>\n<text x=\"470\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">bind, expire_time</text>\n<text x=\"470\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">每件独立属性(强化/词条)</text>\n<text x=\"470\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">适合 MMORPG/深数值</text>\n<rect x=\"30\" y=\"180\" width=\"580\" height=\"96\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">共识：item_id 是『配置ID』，实例属性要单独成行</text>\n<text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">绑定道具 / 强化等级 / 随机词条 → 同 item_id 多行，每行独立 count 与 props</text>\n<text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">纯计数叠加只适用于『无差异道具』，否则账目必乱</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">坑：把有实例属性的道具当纯计数叠加 → 发放/消耗/转移全部对不上</text>\n</svg>",
    "caption": "图 1：背包两种存储模型对比"
   },
   {
    "t": "h",
    "text": "堆叠与绑定：上限、过期、绑定规则"
   },
   {
    "t": "p",
    "text": "堆叠：配置表定义每道具每格上限（如 999），发放时先找已有格子加满，满了再开新格。绑定：道具分绑定/非绑定，绑定道具不可交易，发放时按来源（礼包/活动/兑换）决定 bind 标记；注意『穿戴后再绑定』『交易后绑定』这类规则要用一个绑定状态字段统一表达，别用多个字段互相打架。过期：时限道具（月卡、限时皮肤）要能在过期时刻被清理或失效，常用方案是 expire_time 字段 + 定期扫描任务，或者读取时惰性检查（登录时 / 使用前判断是否过期）；大规模过期道具的清理要在低峰期跑批量任务，别在玩家读背包时同步扫全包。"
   },
   {
    "t": "h",
    "text": "增删改的原子性：从『先查后改』到『一个事务/一段 Lua』"
   },
   {
    "t": "p",
    "text": "背包操作最核心的问题是并发下的原子性。典型错误：『先查背包格子有没有空位，再 INSERT 道具』——两个请求同时查到有位置，同时插入，背包就超上限了。正确做法有两种。方案 A（单线程收口）：游戏服按玩家 ID 分线/加玩家级锁，同一玩家所有背包操作串行执行，『查-改-写回』全程在内存里完成，DB 只负责异步持久化。这是游戏服最常用的方案，因为玩家级单写天然规避了行级并发。方案 B（DB 原子/分布式）：背包服务化、多实例并发时，用 UPDATE 条件更新（UPDATE player_bag SET count=count+1 WHERE player_id=? AND item_id=?）加行锁兜底，或把『查库存+扣减』封装成 Redis Lua 脚本。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 玩家级单线程收口：背包操作的『查-改-写回』串行执行\npublic class BagService {\n    private final ConcurrentMap<Long, PlayerBag> bags = new ConcurrentHashMap<>();\n    private final PlayerExecutor exec;  // 按 playerId 分片的单线程执行器\n\n    /** 发放道具：在该玩家的执行器上串行运行，天然无并发竞争 */\n    public CompletableFuture<Boolean> addItem(long playerId, int itemId, int count) {\n        return exec.submit(playerId, () -> {\n            PlayerBag bag = bags.get(playerId);\n            return bag.add(itemId, count);   // 内存里：先找可叠加格，满则开新格，返回结果\n        });\n    }\n\n    /** 消耗道具：条件校验与扣减在同一临界区，不存在『查到有、扣的时候没了』 */\n    public boolean costItem(long playerId, int itemId, int count) {\n        return exec.submitSync(playerId, () -> {\n            PlayerBag bag = bags.get(playerId);\n            return bag.consume(itemId, count);\n        });\n    }\n    // 注意：内存态操作必须最终异步落库 + 定期全量快照，防止进程崩溃丢数据\n}"
   },
   {
    "t": "h",
    "text": "背包扩容与道具流水"
   },
   {
    "t": "p",
    "text": "扩容：格子制背包满时，设计上要能『买格子/任务送格子/消耗道具扩容』，前端 + 后端一起支持（后端只加一行新格子）；不要出现『发放道具时格子不够直接失败』的体验，常见的兜底是发到邮件或临时溢出区，提示玩家清理。道具流水：所有『发给玩家』和『玩家消耗』都要记流水表 item_flow(id, player_id, item_id, delta, reason, order_id, create_time)，reason 是来源（邮件、商店、任务、活动、GM），order_id 用于幂等与对账。流水是经济系统的审计日志：出 bug 能回溯、被刷能定位、活动能验证——没有流水的背包系统，排查线上问题等于黑灯摸鱼。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">道具发放链路：谁动背包都要记流水</text>\n<rect x=\"30\" y=\"46\" width=\"130\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">来源系统</text>\n<text x=\"95\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">邮件/商店/任务/活动/GM</text>\n<path d=\"M160 74 L192 74\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#b1a)\"/>\n<rect x=\"192\" y=\"46\" width=\"130\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"257\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">背包服务</text>\n<text x=\"257\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家级单线程收口</text>\n<path d=\"M322 74 L354 74\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#b1a)\"/>\n<rect x=\"354\" y=\"46\" width=\"130\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"419\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">流水表</text>\n<text x=\"419\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">delta + reason + orderId</text>\n<path d=\"M484 74 L516 74\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#b1a)\"/>\n<rect x=\"516\" y=\"46\" width=\"100\" height=\"56\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"566\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">对账/审计</text>\n<text x=\"566\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM/BI 稽核</text>\n<rect x=\"30\" y=\"124\" width=\"586\" height=\"92\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"323\" y=\"146\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">流水表字段设计（幂等与对账的关键）</text>\n<text x=\"323\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">id(雪花) | player_id | item_id | delta(正负) | bind | reason | order_id | create_time</text>\n<text x=\"323\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">order_id 唯一约束 → 邮件重复点击/断线重发不会二次发道具</text>\n<text x=\"323\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">GM 补偿 = 一条流水的『发』，回档 = 一条流水的『冲正』</text>\n</svg>",
    "caption": "图 2：道具流水与幂等设计"
   },
   {
    "t": "pits",
    "items": [
     "『先查格子再插入』不做临界区——并发下背包超上限，经典并发 bug",
     "同 item_id 的道具全当纯计数叠加——绑定/强化/词条对不上账",
     "背包操作直接怼 DB，不走玩家级单线程收口——行锁竞争把游戏服拖垮",
     "没有道具流水——出 bug 无法回溯，被刷无法定位，活动无法验证",
     "格子满了直接发放失败——应该邮件/溢出区兜底，否则触发大量客服工单"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：背包三支柱——存储模型（格子制/物品表看道具复杂度）、原子性（玩家级单线程收口 or 条件更新/Lua）、流水（delta+reason+orderId 的审计闭环）。能讲清『发放→流水→对账→冲正』的完整链路，面试官会直接给你贴上『有资产系统实战』的标签。"
   }
  ]
 },
 {
  "id": "scenario-social-mail",
  "title": "好友/公会/邮件系统：关系存储、离线消息与系统通知",
  "layer": 1,
  "depends": [
   "scenario-design-method"
  ],
  "covers": [
   "scenario-02",
   "scenario-22",
   "scenario-23",
   "scenario-27"
  ],
  "quiz": [
   "scenario-02",
   "scenario-22"
  ],
  "body": [
   {
    "t": "lead",
    "text": "社交系统（好友/公会/邮件/公告）看似简单，坑全在『大规模推送』和『离线状态』上：好友上线下线通知怎么才不刷爆服务器，全服 100 万人的邮件怎么发才不炸库——这是两道必考题。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Redis 集合与发布订阅、MySQL 关系表",
     "有消息推送/广播的经验（游戏广播、通知）",
     "理解『读多写少』的推送与『离线再拉取』两条路"
    ]
   },
   {
    "t": "h",
    "text": "好友关系存储：双写还是半写"
   },
   {
    "t": "p",
    "text": "好友关系是双向的，设计上两条路。双写：申请通过时插两行（A→B 和 B→A），查询快、加索引简单，但多了『两个方向不一致』的风险，必须同事务写入。半写：只存一行 friend(a, b) 约定 a<b，查询时 WHERE (a=? OR b=?) 反查——省一半空间，但查询要用 OR，索引利用差、数据量大时慢。好友数少（几百以内）且查询频繁时选双写更实用。重点：好友表必须 (player_id, friend_id) 联合唯一索引 + 申请/同意/删除/拉黑的状态字段；拉黑不是删除好友，要单独维护拉黑集合，且『被拉黑方看不到对方在线、消息被拒收』。"
   },
   {
    "t": "h",
    "text": "好友在线状态：推送 vs 拉取，别把通知做成广播风暴"
   },
   {
    "t": "p",
    "text": "经典考题『10 万在线，好友上下线通知怎么做才不是性能灾难』。两种方案。方案 A（上线拉取）：玩家上线时从 Redis 批量查自己好友的在线状态（一次性 GET 好友集合，好友列表通常几十~几百人），用 SET 求交集（Redis SINTER 好友集合 ∩ 在线集合）一次得出所有在线好友；下线时只清自己的在线标记，不通知任何人。方案 B（上下线推送）：上下线时给所有好友推通知——10 万在线 × 平均 50 个好友 = 500 万条推送，直接刷爆。结论：上线拉取（query-on-login）永远优先，推送只用于『在线好友之间的实时状态变化』，且要节流（合并同秒内多次状态变化）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">在线状态：上线拉取（推荐）vs 上下线推送（广播风暴）</text>\n<rect x=\"30\" y=\"46\" width=\"280\" height=\"160\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">方案A 上线拉取</text>\n<text x=\"170\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">玩家上线 → 查自己好友集合</text>\n<text x=\"170\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">SINTER 好友∩在线 → 一次得出</text>\n<text x=\"170\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">下线只清自己标记，不推任何人</text>\n<text x=\"170\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">成本 O(好友数)，与总在线无关</text>\n<text x=\"170\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">✓ 推荐</text>\n<rect x=\"330\" y=\"46\" width=\"280\" height=\"160\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">方案B 上下线推送</text>\n<text x=\"470\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"ink\">上线 → 给 50 个好友各推一条</text>\n<text x=\"470\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"ink\">10万在线 × 人均50好友</text>\n<text x=\"470\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">= 500万条广播风暴</text>\n<text x=\"470\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">玩家频繁切前后台更炸</text>\n<text x=\"470\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\" font-weight=\"bold\">✗ 仅限在线实时小范围用</text>\n<rect x=\"30\" y=\"222\" width=\"580\" height=\"0\" rx=\"0\" fill=\"none\" stroke=\"none\"/>\n</svg>",
    "caption": "图 1：在线状态查询方案对比"
   },
   {
    "t": "h",
    "text": "邮件系统：个人邮件与全服邮件的读写分离"
   },
   {
    "t": "p",
    "text": "核心结论：全服邮件绝不逐人落库。『给 100 万玩家发一封带附件的补偿邮件』，若逐人 insert 就是百万级写入风暴，DB 直接打满；正确做法是『一封公共邮件 + 玩家领取记录』：mail_global 表只存 1 行公共邮件（标题、内容、附件、生效时间），玩家领取时在 mail_record(player_id, mail_id, status) 记录一条（领取前不占存储）。玩家登录时拉取：个人邮件 + 『创建时间 > 玩家注册时间 且 未过期』的全服邮件，左关联领取记录过滤已领的。领取附件用『UPDATE ... SET status=1 WHERE player_id=? AND mail_id=? AND status=0』原子更新保证幂等，与道具发放同事务——断线重连重复点击不会拿双倍。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 全服邮件：一次写 vs 百万次写，附领取幂等\npublic class MailService {\n    /** 全服补偿邮件：只写 mail_global 一行，玩家领取时才登记 */\n    public void sendGlobalMail(MailMail mail, long expireTs) {\n        // INSERT INTO mail_global(id, title, body, items, start_time, expire_time)\n        // 无玩家维度的循环，O(1)\n    }\n\n    /** 领取附件：status 0→1 原子更新 + 同事务发道具，保证幂等 */\n    @Transactional\n    public boolean claim(MailRecord rec, PlayerBag bag) {\n        // 1. 原子占位：只有第一个请求把 status 从 0 改成 1，其余影响行数为0\n        int rows = mailRecordMapper.updateClaimed(rec.getPlayerId(), rec.getMailId());\n        if (rows == 0) return false;                 // 已领过，幂等返回\n        // 2. 同事务发放道具 + 记流水（order_id = \"mail:\" + rec.getMailId()）\n        bag.addItem(rec.getPlayerId(), rec.getItems(), \"mail:\" + rec.getMailId());\n        return true;\n    }\n}"
   },
   {
    "t": "h",
    "text": "公会系统：共享状态与并发写"
   },
   {
    "t": "p",
    "text": "公会是『几百人共享一个状态』的典型：公会等级/资金/职位/成员被所有成员读写，天然是热点。设计要点：① 权威状态放 Redis（公会等级、资金、公告）或独立公会服进程，成员操作先写 Redis 再异步落库，别让 300 人同时 UPDATE 同一行公会表——行锁直接把公会卡死；② 成员关系（谁在公会、职位）走 MySQL，加 (guild_id) 索引，名单查询走 Redis 缓存成员 ID 列表；③ 会长转让、踢人、退出这类『状态变更』要加分布式锁或 Redis 事务，防止两个管理操作并发把成员关系改乱；④ 公会聊天用 Redis Pub/Sub 或消息队列广播到本公会在线成员，离线成员离线再拉。"
   },
   {
    "t": "h",
    "text": "系统通知与公告：弹窗、跑马灯、定向推送"
   },
   {
    "t": "p",
    "text": "公告分三类。登录弹窗：登录时从公告表拉『当前生效的弹窗公告』列表（按生效时间过滤），只读 Redis 缓存，天然无压力。跑马灯：服务器定时把公告内容广播给在线玩家（长连接推），低频（每分钟几次），全服广播用消息队列分发给各游戏服再组播，注意节流与合并。定时/定向推送：按活动时间排期的推送，关键点是不做『逐人实时推送』——玩家在线用长连接推，离线就写一条『待推送』（Redis 列表或离线消息表），下次登录时补拉；定向推送（圈选特定玩家，如给所有 Lv50+ 玩家发活动提醒）本质就是『定向邮件』，复用全服邮件模式 + WHERE 过滤，不用实时推送。"
   },
   {
    "t": "pits",
    "items": [
     "好友上下线做广播通知——500 万条广播风暴，必答『上线拉取』",
     "全服邮件逐人 insert——百万行写入炸库，必答『公共邮件+领取记录』",
     "领取附件不做幂等——断线重连拿双倍，status 0→1 原子更新是标准答案",
     "公会数据全怼一张 MySQL 表让 300 人并发 UPDATE——行锁卡死，权威状态上 Redis",
     "公告/邮件过期不清理——线上垃圾数据膨胀，定时归档+TTL 要主动讲"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：社交系统的三个共识——在线状态『上线拉取』优于广播推送；全服消息『公共邮件/公共公告 + 按需登记』优于逐人落库；共享状态（公会/邮件领取）用 Redis 原子操作或锁收口。这三个共识覆盖好友、公会、邮件、公告四类题目，是开放设计题的送分知识点。"
   }
  ]
 },
 {
  "id": "scenario-quest-achievement",
  "title": "任务/成就/签到系统：定义、进度追踪与奖励发放",
  "layer": 1,
  "depends": [
   "scenario-design-method",
   "scenario-bag-item"
  ],
  "covers": [
   "scenario-03",
   "scenario-10",
   "scenario-30"
  ],
  "quiz": [
   "scenario-03",
   "scenario-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "任务、成就、签到同属『事件驱动的进度系统』：业务发生动作 → 进度推进 → 条件达成 → 发奖。把『事件模型』想清楚，三套系统共用一套骨架。"
   },
   {
    "t": "pre",
    "items": [
     "有背包/道具发放经验（发奖要走流水+幂等）",
     "理解 Redis bitmap 与计数器",
     "知道事件发布/订阅的基本模式"
    ]
   },
   {
    "t": "h",
    "text": "任务定义：配置化 + 四要素"
   },
   {
    "t": "p",
    "text": "任务配置四要素：触发条件（登录、击杀、收集、通关、消耗）、进度目标（击杀 100 只、收集 5 个）、奖励（道具+经验+货币）、状态流转（未激活→进行中→可领取→已领取）。代码只写『任务类型模板』（如 kill_monster 模板、collect_item 模板），具体任务全走配置表——这正是活动框架四元组思路的下沉。模板的职责：监听对应事件，按配置读取进度字段，更新计数，达目标置可领取。新任务上线只加配置，不重启服务（热更配置）——这是邓凡导表工具+热更新经验的直接复用点。"
   },
   {
    "t": "h",
    "text": "进度追踪：事件索引 + 稀疏存储"
   },
   {
    "t": "p",
    "text": "关键设计一：事件倒排索引。业务动作产生事件后，不能遍历玩家所有任务找『哪些任务关心这个事件』——要用『事件类型 → 任务列表』的注册表，事件来了只查该类型下挂的任务，O(1) 定位。关键设计二：稀疏存储。500 个成就 × 100 万玩家若全量成行 = 5 亿行，不可行；实际绝大多数成就玩家从未触碰，只存『有进度的』和『已完成的』——进行中的进度用 Map<taskId, count>，完成集合用 bitmap/long[] 压缩，人均几十字节。签到就是稀疏存储的极端：一个月 31 天用一个 int 位图（31 位）就存下，Redis 的 SETBIT/BITCOUNT 天然支持，100 万玩家每月仅约 4MB。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">事件驱动的进度系统：三套系统共用骨架</text>\n<rect x=\"30\" y=\"46\" width=\"150\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务动作</text>\n<text x=\"105\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录/击杀/收集/通关</text>\n<text x=\"105\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">消耗/签到/合成</text>\n<text x=\"105\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">发布事件</text>\n<path d=\"M180 110 L220 110\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#q1a)\"/>\n<rect x=\"220\" y=\"46\" width=\"170\" height=\"130\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"305\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">事件→任务索引</text>\n<text x=\"305\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">kill_monster → [任务A,B]</text>\n<text x=\"305\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">collect_item → [任务C]</text>\n<text x=\"305\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">只命中关心该事件的</text>\n<path d=\"M390 110 L430 110\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#q1a)\"/>\n<rect x=\"430\" y=\"46\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">进度存储（稀疏）</text>\n<text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">Map<taskId,count> 进行中</text>\n<text x=\"520\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">bitmap 完成集合</text>\n<text x=\"520\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">签到 = int 位图(31位)</text>\n<text x=\"520\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">达到目标→置可领取→发奖</text>\n<defs><marker id=\"q1a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：任务/成就/签到共用的事件驱动骨架"
   },
   {
    "t": "h",
    "text": "完成判定与奖励发放：四态状态机 + 幂等"
   },
   {
    "t": "p",
    "text": "状态机四态：未激活 → 进行中 → 可领取 → 已领取。为什么『可领取』和『已领取』分开？因为发奖可能失败（背包满、网络异常），玩家要能重试；『已领取』必须靠 order_id 幂等防重复。完成判定：进度 count 达标即置『可领取』，判定动作要幂等——同一事件只触发一次状态迁移，防止重复发奖。签到场景：『查位（是否已签）+ 置位 + 发奖』要同事务或同一 Lua 完成，先查再置是并发窗口。补签本质是『校验补签卡 → 对历史位 SETBIT → 走同一发奖流程』，不要把补签做成另一套逻辑。连续签到（7 天大礼包）额外存 last_sign_date + continuous_count，签到时比较逻辑日是否相邻——O(1)，不用扫位图。"
   },
   {
    "t": "h",
    "text": "跨天处理：逻辑日与边界"
   },
   {
    "t": "p",
    "text": "游戏常把『新的一天』定在凌晨 4/5 点而非 0 点：0 点恰是夜猫子在线高峰，此时刷新会打断体验并造成跨天并发尖峰；凌晨 4 点在线最低，切换平滑。判断『今天是否已签/任务是否刷新』要按服务器逻辑日换算，客户端只做展示、不参与判定。边界：玩家 23:59:59 点击、服务端 0:00:01 收到，以服务端收到时换算的逻辑日为准，全服规则统一收口，杜绝两端各算各的。跨周/跨月：bitmap 按周期清零归档，历史按月存，Redis 加 TTL 自动清理。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 签到：查位+置位+发奖 原子完成（Redis Lua，防止并发重复签到）\npublic class SignInService {\n    private static final String SIGN_LUA =\n        \"local key = KEYS[1] \" +                 // sign:202506:playerId\n        \"local day = tonumber(ARGV[1]) \" +       // 逻辑日(当月第几天)\n        \"local got = redis.call('GETBIT', key, day) \" +\n        \"if got == 1 then return 0 end \" +       // 已签过，幂等\n        \"redis.call('SETBIT', key, day, 1) \" +\n        \"return 1\";                              // 成功，由业务发奖\n    // 逻辑日换算：以凌晨 5 点为界，25:00 算第二天\n    public static int logicDay(long ts, int offsetHours) {\n        return (int)(((ts - 5 * 3600 * 1000L) / 86400000L) % 31) + 1;\n    }\n}"
   },
   {
    "t": "h",
    "text": "成就/图鉴与全服首杀"
   },
   {
    "t": "p",
    "text": "成就是『一次性任务』，进度只增不减，条件多样。图鉴是收集型成就的特例：收集到即点亮，用 bitset 存储收集集合。全服首杀：完成时查 Redis 的『该成就全服完成计数』，INCR 后 ==1 说明是首个，触发全服公告——INCR 原子性天然保证只有一个拿到首杀序号。新成就上线要考虑存量玩家回溯：历史数据回补（跑批把历史击杀数灌入进度）还是『上线后从零计』，需要策划拍板，但设计上要预留进度初始化接口。成就领奖与完成分离、领奖幂等，防止重复领取。"
   },
   {
    "t": "pits",
    "items": [
     "事件来了遍历全部任务找命中的——O(500) 全扫描，要倒排索引按事件类型命中",
     "500 成就 × 100 万玩家全量成行——5 亿行，必须稀疏存储（进行中 Map + 完成 bitmap）",
     "签到『查位+置位+发奖』分开做——并发重复签，要一个事务/一段 Lua 收口",
     "补签做成独立一套逻辑——补签=写历史位+走同一发奖流程，别复制粘贴",
     "跨天判断客户端服务端各算各的——逻辑日统一收口，边界以服务端收到时刻为准"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：任务/成就/签到 = 同一套『事件驱动 + 倒排索引 + 稀疏存储 + 四态状态机 + 幂等发奖』骨架；逻辑日（凌晨 4 点刷新）统一收口解决跨天边界；签到 bitmap、成就稀疏存储、首杀 INCR 是三个必背的存储/判定细节。"
   }
  ]
 },
 {
  "id": "scenario-shop-trade",
  "title": "商店/交易/拍卖行：商品模型、货币体系与防刷",
  "layer": 1,
  "depends": [
   "scenario-design-method",
   "scenario-bag-item"
  ],
  "covers": [
   "scenario-24",
   "scenario-29"
  ],
  "quiz": [
   "scenario-24",
   "scenario-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "商店、交易、拍卖行是『经济系统』的三张脸：商店是策划定价的入口，交易是玩家之间的流通，拍卖行是异步撮合的市场——每一张脸后面都站着『货币体系』和『防刷』两个硬约束。"
   },
   {
    "t": "pre",
    "items": [
     "理解 MySQL 事务与行锁、Redis 原子操作",
     "有背包/道具流水经验（发收道具必须记流水）",
     "知道限量限购场景的防超卖手段"
    ]
   },
   {
    "t": "h",
    "text": "商品模型与货币体系"
   },
   {
    "t": "p",
    "text": "商品表 shop_item(id, item_id, price_type, price, limit_type, limit_num, period, status)：price_type 区分用哪种货币支付。货币体系核心是『多币种划分』：金币（游戏内产出/回收循环）、钻石（充值硬通货，与人民币锚定）、绑钻（免费获得但受限用途，只能买指定商品）。为什么分？为了控制通货膨胀：金币是『产出无限、回收靠消耗』，钻石是『恒定锚定、增值保值』，绑钻是运营赠送的『半价值货币』——三者账目必须分表/分字段，兑换只能单向（钻石→绑钻，不可逆），防止玩家用免费货币套利。产出与回收平衡：每个金币来源都要配一个消耗出口（强化、合成、修理），用数据监控『产出/回收比』，比值长期大于 1 就是通缩前兆（玩家没消耗动力），低于警戒线要加回收活动。"
   },
   {
    "t": "h",
    "text": "商店购买：限量限购与防超卖"
   },
   {
    "t": "p",
    "text": "普通商店直接 DB 扣款（玩家级单写收口，扣货币+发货同事务）。限时礼包（限量 1000 份 + 每人限购 1 份）走『三闸门』：① 入口限流 + 前端按钮置灰；② Redis Lua 原子完成『校验库存 > 0 + 校验该玩家未购买 + 扣库存 + 记购买名单』，一次往返无竞态；③ 成功者发 MQ 异步落订单/落账，DB 层 UPDATE ... WHERE stock>=0 做最终兜底。每人限购的『已购名单』用 Redis Hash（playerId → 已购数量），同样在 Lua 里判。注意：玩家购买『扣钻石』与『发货』必须同事务——钻石扣了道具没发，客服工单直接爆。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">限时礼包购买链路：三闸门防超卖 + 幂等发货</text>\n<rect x=\"30\" y=\"46\" width=\"120\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 入口闸</text>\n<text x=\"90\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">限流/按钮置灰/排队</text>\n<text x=\"90\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">过滤毛刺流量</text>\n<path d=\"M150 106 L186 106\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#s1a)\"/>\n<rect x=\"186\" y=\"46\" width=\"140\" height=\"120\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"256\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 原子闸</text>\n<text x=\"256\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis Lua：校验库存+限购</text>\n<text x=\"256\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">+扣库存+记购买名单</text>\n<text x=\"256\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">一个脚本无竞态</text>\n<path d=\"M326 106 L362 106\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#s1a)\"/>\n<rect x=\"362\" y=\"46\" width=\"120\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"422\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 落账闸</text>\n<text x=\"422\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">MQ 异步落订单</text>\n<text x=\"422\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">DB 乐观锁兜底</text>\n<text x=\"422\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent\">DB 永不直面人海</text>\n<path d=\"M482 106 L518 106\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#s1a)\"/>\n<rect x=\"518\" y=\"46\" width=\"96\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"566\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">发货</text>\n<text x=\"566\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">扣钻石+发道具</text>\n<text x=\"566\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">同事务+流水</text>\n<text x=\"566\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">幂等orderId</text>\n<defs><marker id=\"s1a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：限时礼包三闸门链路"
   },
   {
    "t": "h",
    "text": "玩家交易：一手交钱一手交货怎么保证"
   },
   {
    "t": "p",
    "text": "玩家直接交易（面对面）的一致性难点：『A 给道具 + B 给货币』要同时成立，否则复制道具或白嫖货币。做法：交易不是两边分别改背包，而是『锁定阶段 + 结算阶段』。① 双方把要交易的物品/货币锁定到交易托盘（从背包移入临时锁定区，不可用）；② 双方确认 → 服务端在玩家级单写收口下执行一次『A 托盘→B 背包、B 托盘→A 背包、双方货币增减』的同事务结算；③ 任意一方取消/掉线，托盘原样退回。锁定是关键：先锁定再确认，杜绝『锁定期间物品被消耗』。交易频率要限（CD/次数上限）、交易对象要限（同服/同公会优先），交易记录全量落流水，方便事后定位复制道具的漏洞。"
   },
   {
    "t": "h",
    "text": "拍卖行：异步撮合与挂单"
   },
   {
    "t": "p",
    "text": "拍卖行 vs 面对面交易：拍卖行买卖双方不在同一时刻出现，必须『挂单 + 撮合』。架构：玩家上架 → 道具移入托管仓库（防止上架期间被消耗）+ 生成挂单记录 → 进撮合队列 → 撮合引擎按『价格优先 + 时间优先』匹配 → 成交时双方各自原子结算（卖家收货、买家付钱）→ 未成交挂单到期下架退回。撮合引擎处理不过来时用 MQ 削峰、批量撮合；成交通知走邮件（玩家可能离线），邮件附件模式正好复用。防刷重点：上架次数限流、价格下限防低价刷、同名道具合并展示（竞价取最优价）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 拍卖行撮合：价格优先 + 时间优先（简化示意）\npublic class AuctionMatcher {\n    // 买单队列（价格降序）+ 卖单队列（价格升序），同一档内时间优先\n    private final TreeMap<Integer, Deque<Order>> bids = new TreeMap<>(Comparator.reverseOrder());\n    private final TreeMap<Integer, Deque<Order>> asks = new TreeMap<>();\n\n    public void onNewOrder(Order o) {\n        if (o.isBuy()) { match(o, asks, o.getPrice()); }  // 买家用卖单低价\n        else           { match(o, bids, o.getPrice()); }  // 卖家吃买单高价\n    }\n    private void match(Order o, TreeMap<Integer, Deque<Order>> book, int p) {\n        // 从最优价开始扫，能成交就成交；成交=双方原子结算+退托管道具\n    }\n}"
   },
   {
    "t": "h",
    "text": "防刷：工作室、复制、套利"
   },
   {
    "t": "p",
    "text": "经济系统三大黑客：工作室（批量小号产金）、复制道具（交易/断线漏洞）、套利（货币兑换差）。防线：① 交易链路全量流水 + 异常模式检测（同 IP 大量交易、单人交易次数异常、道具异常增长）；② 小号产出限制（新人产出折扣、绑定优先）；③ 货币兑换单向、手续费随量递增；④ 高价值道具交易加冷却与公告；⑤ GM 后台定期跑『产出/回收比』报表，人工盯异常。技术上，任何『扣了 A 给 B』的操作都必须在同一原子作用域完成，这是复制漏洞的根治手段。"
   },
   {
    "t": "pits",
    "items": [
     "玩家交易两边各改各的背包——复制道具/白嫖货币，必须『锁定托盘+同事务结算』",
     "扣钻石和发货分开做——扣了没发/发了没扣，客服工单爆，必须同事务",
     "拍卖行上架后道具还在背包可被消耗——上架必须移入托管仓库",
     "货币可自由双向兑换——套利空间，只能单向（钻石→绑钻）且锚定",
     "没有全量流水——复制道具漏洞事后根本定位不了，流水是经济系统的审计底牌"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：商店=定价入口（三闸门防超卖）、交易=玩家流通（锁定托盘+同事务结算）、拍卖行=异步撮合（挂单+托管+价格时间优先）；货币体系按『锚定物』划分且单向兑换，全链路流水是防刷与审计的地基。"
   }
  ]
 },
 {
  "id": "scenario-rank-system",
  "title": "排行榜系统：实时/定时、ZSet 方案与跨服排行",
  "layer": 2,
  "depends": [
   "scenario-design-method",
   "scenario-common-components"
  ],
  "covers": [
   "scenario-01",
   "scenario-09"
  ],
  "quiz": [
   "scenario-01",
   "scenario-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "排行榜是 Redis ZSet 的『亲儿子』考题：ZADD 上榜、ZREVRANGE 看头部、ZREVRANK 查名次，三个命令打天下——但同分排序、周期榜、跨服聚合、宕机重建才是分高低的细节。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 Redis ZSet 与跳表/压缩列表底层",
     "理解写路径异步化与读多写少场景",
     "有跨服/合服的架构意识"
    ]
   },
   {
    "t": "h",
    "text": "为什么 ZSet 是标准答案：底层与复杂度"
   },
   {
    "t": "p",
    "text": "ZSet 底层是哈希表（member→score）+ 跳表（按 score 排序），插入/删除/查名次都是 O(logN)。全服 50 万玩家，每个 entry 几十字节，整个 ZSet 仅几十 MB，单实例完全够用。对比 MySQL ORDER BY 方案：每次查 TopN 全表排序 O(NlogN) 且索引难建，Redis ZSet 天然有序，查询零计算。实时性：分数变更 → ZADD，玩家立刻能看到新名次；写多时可以异步批量写（变更进队列合并），但名次查询永远实时。"
   },
   {
    "t": "h",
    "text": "同分排序：先到先得的复合分数"
   },
   {
    "t": "p",
    "text": "ZSet 同分时按 member 字典序排，这通常不是策划想要的『先到达者排前』。标准解法：score 编码为复合分数——`score = 战力 * 10^13 + (10^13 - 时间戳)`。战力 1 亿（1e8）量级 × 1e13 = 1e21，超 double 精度，要按实际量级选系数：战力上限 < 10^(19 - 13) 即可。时间戳用『10^13 - 当前毫秒时间戳』，越早到达差值越大、排在前面。注意 double 精度：ZSet 的 score 是 double，超过 2^53 会丢精度，必须确保复合分数 < 2^53（约 9e15）。若战力上限高，拆成两个 ZSet 或用 member 后缀时间戳 + 字典序对比的替代方案。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">排行榜核心链路：变更事件 → ZSet → 查询/结算</text>\n<rect x=\"30\" y=\"46\" width=\"150\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">玩家属性变更</text>\n<text x=\"105\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">战力/充值/等级</text>\n<text x=\"105\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先落 DB 再发事件</text>\n<path d=\"M180 90 L220 90\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#r1a)\"/>\n<rect x=\"220\" y=\"46\" width=\"150\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"295\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">异步写 ZSet</text>\n<text x=\"295\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">ZADD 复合分数</text>\n<text x=\"295\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">不阻塞主流程</text>\n<path d=\"M370 90 L410 90\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#r1a)\"/>\n<rect x=\"410\" y=\"46\" width=\"200\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"510\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">查询</text>\n<text x=\"510\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ZREVRANGE TopN O(logN)</text>\n<text x=\"510\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">ZREVRANK 个人名次 O(logN)</text>\n<rect x=\"30\" y=\"160\" width=\"580\" height=\"120\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">工程细节三件套（面试分水岭）</text>\n<text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">① 同分排序：score=战力*10^13+(10^13-时间戳)，先到先得（注意 < 2^53 精度）</text>\n<text x=\"320\" y=\"230\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">② 宕机重建：启动预热脚本从 DB 全量 ZADD；重建期读旧快照降级</text>\n<text x=\"320\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">③ 周期榜：key 带周期后缀 rank:power:daily:20250610 + TTL 自动过期 + 结算任务发奖</text>\n<text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">跨服榜：各服 ZUNIONSTORE/上报中心聚合，member 带区服前缀防 ID 冲突</text>\n</svg>",
    "caption": "图 1：排行榜链路与工程细节"
   },
   {
    "t": "h",
    "text": "实时榜 vs 定时榜（日榜/周榜/总榜）"
   },
   {
    "t": "p",
    "text": "总榜长期有效、玩家分数变更实时 ZADD。周期榜用『带时间周期的 key + 周期任务结算归档』：rank:power:daily:20250610、rank:power:weekly:2025W24。玩家得分变更同时写多个 ZSet（总榜 + 当日榜 + 当周榜），周期任务在逻辑日/周切换点：① 把当前周期 key RENAME 成 history key（或已带日期直接定型）；② 读 TopN 发奖；③ 设 TTL（日榜留 7 天、周榜留 5 周）让 Redis 自动清理。跨天边界：用逻辑日（凌晨 4 点）切换，结算窗口内新分数写新 key，避免『最后一刻的分算哪天』的歧义；结算期间玩家查榜：查当前周期 key 查不到就回退查上一周期 history key。发奖幂等：结算任务先写执行记录（周期 + 状态唯一约束），重复触发不重复发奖。"
   },
   {
    "t": "h",
    "text": "跨服排行与超大规模"
   },
   {
    "t": "p",
    "text": "跨服排行两种做法：① 各服 ZSet 定时 ZUNIONSTORE 合并到全局 ZSet，member 带区服前缀（s1_playerId）防 ID 冲突；② 各服上报分数到中心服聚合服务。公平性：不同开服天数的服进度天然不同，一般按开服天数分组竞技，或只比『增量』（本周新增战力）。5000 万玩家的超大服单 ZSet 会成热点：按分数段分桶拆多个 ZSet 再归并汇总，或按区服分片 + 中心聚合；TopN 查询从各分片取头部做归并。缓存与降级：TopN 结果缓存一份（如 1 秒 TTL），查询打缓存不打 Redis 主体；Redis 挂了读旧快照 + 提示『榜单维护中』，不让查询把重建中的 Redis 压垮。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 排行榜核心命令与复合分数编码\npublic class RankService {\n    private final Jedis jedis;\n    // 复合分数：战力*10^13 + (10^13 - 时间戳)，先到先得\n    // 约束：战力上限 ≤ 1e6 时，分数上限 ≈ 1e19 > 2^53，要按量级调整系数\n    public void reportPower(long playerId, long power) {\n        double score = power * 1e13 + (1e13 - System.currentTimeMillis());\n        jedis.zadd(\"rank:power:total\", score, String.valueOf(playerId));\n    }\n    public List<String> topN(int n) {\n        return jedis.zrevrange(\"rank:power:total\", 0, n - 1);   // TopN\n    }\n    public long myRank(long playerId) {\n        Long r = jedis.zrevrank(\"rank:power:total\", String.valueOf(playerId));\n        return r == null ? -1 : r + 1;                          // 个人名次\n    }\n    // 重建：预热脚本扫描 DB 玩家战力，批量 ZADD 回来\n}"
   },
   {
    "t": "pits",
    "items": [
     "只背 ZADD/ZREVRANK 不讲同分——『先到先得』用复合分数，还要盯 2^53 精度",
     "榜单写路径同步进玩家主流程——变更异步化，别让 ZADD 阻塞战斗",
     "周期榜不设 TTL——历史 key 无限膨胀，Redis 内存被榜单吃掉",
     "结算发奖不幂等——任务重跑双倍发奖，结算前先写执行记录",
     "跨服聚合不防 ID 冲突——member 必须带区服前缀"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：排行榜 = ZSet 三命令（ZADD/ZREVRANGE/ZREVRANK）+ 三个工程细节（复合分数同分、异步写、宕机重建）+ 周期 key 与 TTL 管理；跨服聚合带区服前缀、分组竞技保公平，超大服分桶归并治热点。"
   }
  ]
 },
 {
  "id": "scenario-match-system",
  "title": "匹配系统：ELO/MMR、匹配池与机器人填充",
  "layer": 2,
  "depends": [
   "scenario-design-method",
   "scenario-common-components"
  ],
  "covers": [
   "scenario-25",
   "scenario-26"
  ],
  "quiz": [
   "scenario-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "匹配系统是两个目标的博弈：『匹配到实力相近的对手』和『等待时间可控』——ELO/隐藏分解决前者，匹配池与等待队列解决后者，机器人填充兜底体验。"
   },
   {
    "t": "pre",
    "items": [
     "理解分值与概率模型，能算简单公式",
     "熟悉 Redis 有序集合与队列",
     "理解跨服玩法需要中立服务"
    ]
   },
   {
    "t": "h",
    "text": "ELO 与 MMR：匹配分数 ≠ 段位展示分"
   },
   {
    "t": "p",
    "text": "ELO（埃洛等级分，国际象棋发明）核心是两个公式：期望胜率 E_A = 1 / (1 + 10^((R_B − R_A)/400))；赛后更新 R'_A = R_A + K·(S_A − E_A)，S 是实际结果（胜 1/平 0.5/负 0）。含义：200 分差期望胜率约 76%，400 分差约 91%；K 是调整系数，新玩家 K=40 快速收敛、老玩家 K=10~20 稳定，K 大波动大。MMR（MatchMaking Rating）是对 ELO 的游戏化改良：把『匹配分』与『段位展示分』分开——匹配用隐藏 MMR（含不确定性 sigma），段位/星数只做展示，防玩家『上分后不敢打』。Glicko-2/TrueSkill 更进一步引入不确定性（sigma），局数越多越确定，适合组队与 MVP 判定。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">ELO 匹配原理：期望胜率与赛后更新</text>\n<rect x=\"30\" y=\"46\" width=\"580\" height=\"64\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">期望胜率 E(A) = 1 / (1 + 10^((R(B)−R(A))/400))</text>\n<text x=\"320\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同分=50% | 100分差≈64% | 200分差≈76% | 400分差≈91%</text>\n<rect x=\"30\" y=\"122\" width=\"580\" height=\"64\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"148\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">赛后更新 R' = R + K·(S − E)</text>\n<text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">S：胜=1 平=0.5 负=0 | K：新玩家 40 快速收敛，老玩家 10~20 稳定</text>\n<rect x=\"30\" y=\"198\" width=\"580\" height=\"48\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">游戏化要点：MMR 隐藏分负责匹配，段位星数负责展示——防『上分后不敢打』</text>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">冷启动/不确定性：新玩家 sigma 大，前 10 局 ±K 大快速定位</text>\n</svg>",
    "caption": "图 1：ELO 公式与游戏化要点"
   },
   {
    "t": "h",
    "text": "匹配池与等待队列：时间优先的工程实现"
   },
   {
    "t": "p",
    "text": "匹配池 = 按『模式 + 段位段 + 区服』分桶的等待队列，桶内玩家按进入时间排序。匹配流程：① 玩家发起匹配，按 MMR 落入对应桶（如 ±100 分一桶）；② 调度器定时（如每 2 秒）扫桶：桶内人数 ≥ 开局人数（如 10 人）就直接开局；不足则把桶向外扩展一圈（±200、±400）继续凑——这就是『等待时间换匹配质量』的调节旋钮；③ 玩家可随时取消。数据用 Redis List/ZSet 做队列，玩家 ID 进桶、超时逐出。匹配成功要『锁定』：把双方从池里原子移出（LREM + 建房间），防止两个调度器把同一个人拉进两个房间——这里需要一个房间创建锁或 Redis 事务。"
   },
   {
    "t": "h",
    "text": "机器人填充与跨服匹配"
   },
   {
    "t": "p",
    "text": "等待时间过长要填充机器人（BOT），否则玩家流失。策略：等待超过 N 秒（如 30 秒）开始注入 BOT，MMR 越低的玩家越早注入（低分段人少、也越能接受 AI 对手）；BOT 数量按『还差几个补齐』动态生成，BOT 实力按目标 MMR 附近的分布模拟（胜率接近真实）。BOT 的生命周期与数据：BOT 有假名字/假段位/假战绩，AI 控制走战斗逻辑，结算正常出分——但要能区分（内部标记），防止被玩家刷分。跨服匹配：匹配服是中立服务，各服玩家上报匹配请求，匹配成功后在『跨服战场服』开房间，玩家通过网关跳转——跨服玩家数据不迁移，只同步『战斗所需快照』（属性、技能、装备摘要），战斗结束把结果回传本服结算。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 匹配调度：时间优先，等待越久允许的 MMR 跨度越大\npublic class MatchMaker {\n    private static final int[] SPREAD = {100, 200, 400, 800, 1600}; // 逐轮放宽的 MMR 跨度\n    // 每 2 秒扫一轮：先查中心桶，不够就向宽桶扩散凑人\n    public void tick() {\n        for (QueueBucket center : buckets.values()) {\n            for (int i = 0; i < SPREAD.length; i++) {\n                List<Long> batch = center.pollIfEnough(SPREAD[i], TEAM_SIZE);\n                if (!batch.isEmpty()) {\n                    createRoom(batch);       // 锁定：从桶移除 + 建房间，防重复拉人\n                    break;\n                }\n            }\n        }\n    }\n    // 机器人填充：等待 > 30s 且不足人数时，按目标 MMR 生成 BOT 补位\n}"
   },
   {
    "t": "h",
    "text": "赛季与防刷"
   },
   {
    "t": "p",
    "text": "赛季：段位/分数按赛季周期结算，赛季末按段位发奖（发奖幂等，按赛季+玩家唯一约束），新赛季隐藏分做『软重置』（向中间值收缩而非清零），避免老玩家开局碾压。匹配分数变化要限幅：单局最大 ±K，防异常波动。防刷：匹配中掉线/挂机要扣分（检测对局内行为），恶意卡匹配（秒退）进惩罚队列；同队固定刷分（顶分互刷）用『同队 MMR 差上限』限制——高带低会拉高综合 MMR，收益被稀释。"
   },
   {
    "t": "pits",
    "items": [
     "把段位分直接当匹配分——段位可被『上了不打』冻结，匹配要用隐藏 MMR",
     "匹配池不加锁——两个调度器把同一玩家拉进两个房间，必须原子移出+房间锁",
     "只说 ELO 背不出公式——期望胜率 E=1/(1+10^((Rb-Ra)/400)) 和更新 R'=R+K(S-E) 要随手能写",
     "等待时间没上限——必须按等待时长放宽 MMR 跨度 + 机器人兜底",
     "跨服匹配把玩家数据整个搬过去——只同步战斗快照，回传结果，别做数据迁移"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：匹配 = ELO/MMR 定强度（隐藏分负责匹配、段位负责展示）+ 匹配池按等待时长放宽跨度 + 机器人兜底体验；匹配成功原子锁定防重复，赛季软重置保公平，跨服只传快照不回传数据。"
   }
  ]
 },
 {
  "id": "scenario-chat-im",
  "title": "聊天与实时交互：频道、私聊、离线消息与 IM 选型",
  "layer": 2,
  "depends": [
   "scenario-social-mail",
   "scenario-common-components"
  ],
  "covers": [
   "scenario-07",
   "scenario-11",
   "scenario-27"
  ],
  "quiz": [
   "scenario-07",
   "scenario-11",
   "scenario-27"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏聊天 = 频道分发 + 私聊路由 + 离线补拉 + 内容安全，四条线合起来就是一套简化版 IM——先想清楚『谁在哪看到这条消息』，再谈组件选型。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 Redis Pub/Sub 与 List、长连接推送（Netty）",
     "有敏感词过滤经验（DFA/AC 自动机）",
     "理解离线消息的『在线推、离线拉』模式"
    ]
   },
   {
    "t": "h",
    "text": "频道模型：世界/公会/队伍/附近四类广播"
   },
   {
    "t": "p",
    "text": "游戏频道本质是『按订阅关系广播』：世界频道订阅全体在线玩家，公会频道订阅本公会成员，队伍频道订阅本队成员，附近频道订阅同场景/同 AOI 网格的玩家。实现上两个选择：Redis Pub/Sub 或消息队列 Topic。Pub/Sub：延迟低、天然支持『订阅组』，但消息即发即弃、无堆积、不支持回溯，适合世界频道这类『在线才看』的广播；且全服一个频道高并发时是单点瓶颈，要按区服分 key（channel:world:1）或分片。消息队列（Kafka/RocketMQ）：可堆积、可回溯、按分区并发，但延迟高（毫秒~几十毫秒），适合离线消息持久化和对账，不适合实时广播。工程结论：实时广播用 Pub/Sub（或直连广播），需要留存/回溯的用消息队列。"
   },
   {
    "t": "h",
    "text": "世界频道高峰：5 万在线、每秒上千条怎么办"
   },
   {
    "t": "p",
    "text": "考题『全服 5 万在线、世界频道高峰期每秒上千条消息』。先算账：千条/秒广播给 5 万人 = 500 万次推送/秒，单机扛不住。分层削峰：① 频率限制——每玩家每频道发送限频（如 3 秒 1 条），从源头把 QPS 压下来；② 合并广播——同一个玩家连续消息合并、多人共用通道（Pub/Sub 只发一份，由游戏服组播给本服在线玩家）；③ 客户端节流——世界频道展示频率限制，服务端只保证投递不保证全部展示；④ 跨服广播用 Kafka 分发给各服，各服再组播本服玩家——总 QPS 从『条数×人数』变成『条数×服数』。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">聊天广播分层：从源头限频到逐服组播</text>\n<rect x=\"30\" y=\"46\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">发送入口</text>\n<text x=\"100\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">限频 3s/条 + 敏感词</text>\n<text x=\"100\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">+ 冷却 + 禁言检查</text>\n<path d=\"M170 86 L212 86\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#c1a)\"/>\n<rect x=\"212\" y=\"46\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"282\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">频道分发</text>\n<text x=\"282\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Pub/Sub 按频道发布</text>\n<text x=\"282\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">一份消息多端订阅</text>\n<path d=\"M352 86 L394 86\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#c1a)\"/>\n<rect x=\"394\" y=\"46\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"464\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">跨服分发</text>\n<text x=\"464\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">Kafka Topic 分发给各服</text>\n<text x=\"464\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">再组播本服在线玩家</text>\n<path d=\"M534 86 L560 86\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#c1a)\"/>\n<rect x=\"560\" y=\"46\" width=\"60\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"590\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">玩家</text>\n<rect x=\"30\" y=\"150\" width=\"580\" height=\"128\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">四类频道订阅关系</text>\n<text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">世界：全体在线（Pub/Sub 一份广播，各服组播）</text>\n<text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">公会：订阅公会 ID 的频道（成员在线才收，离线走公会邮件/离线消息）</text>\n<text x=\"320\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">队伍/附近：订阅队伍 ID 或 AOI 网格（范围小，直连广播即可）</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">私聊：一对一路由，离线存离线消息表，上线补拉</text>\n</svg>",
    "caption": "图 1：聊天频道分发链路"
   },
   {
    "t": "h",
    "text": "私聊与离线消息：在线推、离线拉"
   },
   {
    "t": "p",
    "text": "私聊是一对一消息，路由靠『玩家在线状态』：在线 → 长连接直接推给目标；离线 → 写离线消息表（Redis List 或 DB 表），上线时补拉。离线消息的存储：量小时 Redis List（设置上限如每人 200 条，超限挤掉最旧），量大时落 DB（player_id + 索引）。私聊的频率限制要更严（防骚扰），陌生人私聊默认限制（需互为好友才能高频互聊）。敏感词过滤在私聊同样生效，且私聊更适合『先审后发』还是『先发后审』取决于合规策略——一般文字游戏先过滤再放行，语音留痕异步审核。"
   },
   {
    "t": "h",
    "text": "敏感词过滤：DFA/AC 自动机"
   },
   {
    "t": "p",
    "text": "词库几万个词、每秒几千条消息，暴力遍历 contains 是 O(n×m) 直接不可用；DFA（确定有限状态自动机）把词库编译成状态机，每条消息逐字符走一次状态转移，O(n) 扫完、与词库大小无关，百字消息微秒级。AC 自动机是 trie + fail 指针的多模式匹配，DFA 是转移表完全展开的形式（更快、内存更大）。工程细节：① 前置文本归一化——大小写、全半角、繁简、去标点空格、拼音谐音映射，否则『傻X』『傻 x』绕过；② 词库热更新——新词库离线构建整棵新树，构建好原子替换引用（volatile/CopyOnWrite），读侧无锁无感知；③ 分级策略——替换为 *、整条拦截、仅记录送人工审核，按词级别区分。谐音火星文是持久战，配合举报 + 风控 + 封号体系化治理，别指望纯算法封死。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// DFA 敏感词过滤：O(n) 单次扫描 + 热更新（简化核心）\npublic class SensitiveFilter {\n    // 节点：char -> 子节点；isEnd 标记词尾，可带级别\n    static class Node { Map<Character, Node> next = new HashMap<>(); boolean end; int level; }\n    private volatile Node root = new Node();          // volatile：热更新原子替换引用\n\n    public void load(List<String> words) {\n        Node r = new Node();\n        for (String w : words) {\n            Node cur = r;\n            for (char ch : w.toCharArray()) cur = cur.next.computeIfAbsent(ch, k -> new Node());\n            cur.end = true;\n        }\n        root = r;                                     // 构建完再替换，读侧无感知\n    }\n    public String filter(String text) {\n        Node r = root; StringBuilder sb = new StringBuilder(text);\n        for (int i = 0; i < text.length(); i++) {\n            Node cur = r; int j = i;\n            while (j < text.length() && cur.next.containsKey(text.charAt(j))) {\n                cur = cur.next.get(text.charAt(j++));\n                if (cur.end) {                        // 命中词尾：替换为 *\n                    for (int k = i; k < j; k++) sb.setCharAt(k, '*');\n                    break;\n                }\n            }\n        }\n        return sb.toString();\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "世界频道把每条消息推给每个人——QPS 是条数×人数，必须限频+组播+客户端节流",
     "Redis Pub/Sub 当消息队列用——即发即弃不能回溯，离线/对账必须走 Kafka/落库",
     "敏感词暴力 contains——几万词 O(n×m)，要 DFA/AC 自动机",
     "敏感词不归一化直接过滤——大小写/全半角/谐音绕过，前置归一化是刚需",
     "离线消息无限堆 Redis List——内存爆炸，要设上限+落库归档"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：聊天 = 频道订阅（世界走 Pub/Sub+组播、私聊走路由）+ 在线推离线拉 + DFA 敏感词（归一化+热更新+分级）；实时广播和持久消息是两套东西，Pub/Sub 与 MQ 的分工要讲清。"
   }
  ]
 },
 {
  "id": "scenario-seckill-hotspot",
  "title": "秒杀与热点场景：削峰、防超卖与热点 Key 治理",
  "layer": 2,
  "depends": [
   "scenario-common-components",
   "scenario-shop-trade"
  ],
  "covers": [
   "scenario-05",
   "scenario-16",
   "scenario-20"
  ],
  "quiz": [
   "scenario-05",
   "scenario-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "秒杀/限量抢购是『高并发 + 单点热点 + 强一致』的极端考题：核心是把并发竞争从 DB 前移到 Redis——Lua 原子扣减做闸门，DB 只做异步落账，三个层次兜底不超卖。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Redis 单线程 + Lua 原子性、DB 行锁与乐观锁",
     "有购买服/发奖的幂等经验（orderId 去重）",
     "理解令牌桶限流与削峰排队"
    ]
   },
   {
    "t": "h",
    "text": "问题边界：为什么 DB 直扣扛不住"
   },
   {
    "t": "p",
    "text": "秒杀瞬间 QPS 可能数万，DB 行锁直查直扣把所有请求串行化到一个热点行，单行 TPS 只有几百，差两个数量级。所以第一原则是『把库存热点前置到 Redis』：Redis 单线程 + Lua 脚本原子执行『校验 + 扣减』，单实例可扛数万到十万级 QPS。同时要防『少卖』（Redis 扣了、消息丢了，库存没进 DB）——需要 ACK + 重试 + 对账任务兜底。"
   },
   {
    "t": "h",
    "text": "标准方案：三道闸门"
   },
   {
    "t": "list",
    "items": [
     "① 入口闸（限流+静态化）：网关令牌桶限流，前端按钮置灰/排队/验证码，把毛刺流量挡在最外层；秒杀页面静态资源上 CDN，库存数字由服务端低频推送",
     "② 原子闸（Redis Lua）：库存预热到 stock:itemId=N；Lua 一次完成『校验库存>0 + 校验个人限购 + DECR + 记录购买名单』，返回成功才放行——查+扣必须一个脚本，分开就有并发窗口",
     "③ 落账闸（MQ + DB）：扣减成功者发 MQ 异步建订单、扣 DB 库存；DB 层用 UPDATE ... WHERE stock>=0 乐观锁兜底，保证最终库存不为负"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">秒杀三道闸：限流→Lua原子扣减→MQ异步落账</text>\n<rect x=\"30\" y=\"46\" width=\"130\" height=\"170\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 入口闸</text>\n<text x=\"95\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">网关令牌桶限流</text>\n<text x=\"95\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">CDN 静态资源</text>\n<text x=\"95\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">按钮置灰/验证码</text>\n<text x=\"95\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">挡毛刺流量</text>\n<path d=\"M160 130 L196 130\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#k1a)\"/>\n<rect x=\"196\" y=\"46\" width=\"140\" height=\"170\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"266\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 原子闸</text>\n<text x=\"266\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">Redis Lua：校验库存</text>\n<text x=\"266\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">+校验限购+DECR</text>\n<text x=\"266\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">+记购买名单</text>\n<text x=\"266\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">一个脚本无竞态</text>\n<path d=\"M336 130 L372 130\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#k1a)\"/>\n<rect x=\"372\" y=\"46\" width=\"130\" height=\"170\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"437\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 落账闸</text>\n<text x=\"437\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">MQ 异步建订单</text>\n<text x=\"437\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">DB 扣库存乐观锁</text>\n<text x=\"437\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">UPDATE stock>=0</text>\n<text x=\"437\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">DB 永不直面人海</text>\n<path d=\"M502 130 L560 130\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/>\n<text x=\"545\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">对账兜底</text>\n<rect x=\"502\" y=\"160\" width=\"116\" height=\"56\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"560\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">定时对账任务</text>\n<text x=\"560\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">核对 Redis 扣减 vs DB 订单</text>\n<defs><marker id=\"k1a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：秒杀三道闸门链路"
   },
   {
    "t": "h",
    "text": "库存扣减的原子性：Lua 脚本核心"
   },
   {
    "t": "p",
    "text": "『查库存 + 扣减』必须在一个 Lua 脚本里：分开两步就有并发窗口（两个请求都查到库存=1，都 DECR，变 -1）。Redis 执行 Lua 是单线程串行，脚本内所有命令原子执行。每人限购也要在同一个脚本里：校验『该玩家已购数量 < 限购』再扣。脚本返回 1 成功 / 0 库存不足 / -1 已购超限，业务只认返回值。未支付订单超时回补：下单时发延迟消息（如 15 分钟），到期检查订单未支付则关闭、INCR 回补库存并清限购记录——回补以订单状态机流转为准，保证只回补一次。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 秒杀扣减 Lua：校验库存 + 校验限购 + 扣减 + 记名单，一次原子完成\nprivate static final String SECKILL_LUA =\n    \"local stock = redis.call('GET', KEYS[1]) \" +      // stock:item:100\n    \"if tonumber(stock) <= 0 then return 0 end \" +     // 无库存\n    \"local bought = redis.call('HGET', KEYS[2], ARGV[1]) \" + // bought:item:100 playerId->数量\n    \"if bought and tonumber(bought) >= tonumber(ARGV[2]) then return -1 end \" + // 超限购\n    \"redis.call('DECR', KEYS[1]) \" +\n    \"redis.call('HINCRBY', KEYS[2], ARGV[1], 1) \" +\n    \"return 1\";\n\n// 调用方：Lua 返回 1 → 发 MQ 落订单；0/-1 → 直接拒绝，不打 DB\nObject r = jedis.eval(SECKILL_LUA, 2, \"stock:item:100\", \"bought:item:100\",\n                       String.valueOf(playerId), String.valueOf(limit));"
   },
   {
    "t": "h",
    "text": "热点 Key 治理：单 key 也被打穿怎么办"
   },
   {
    "t": "p",
    "text": "秒杀商品 ID 是典型热点 Key：即使有 Redis，百万级请求打在同一 slot 也会让单分片网卡打满或 CPU 飙升。治理手段分层：① 库存分片——把 stock:item:100 拆成 N 个分片 stock:item:100:0..N-1，请求随机/按玩家取模打不同分片，Lua 内先查主分片不足再轮询其余分片（注意回滚防负）；② 读多写少的展示数据（商品信息）缓存多副本 + 本地缓存；③ 兜底限流——网关层对秒杀接口整体限流，超出的直接返回『排队中』。全服运营活动（全服 Boss、红包雨）同理：入口限流 + 分片 + 异步结算，Boss 血量这种写热点按分区累计再合并。"
   },
   {
    "t": "pits",
    "items": [
     "『先查库存再扣减』分开两步——并发窗口必超卖，必须一个 Lua",
     "Redis 扣了 MQ 消息丢了不回补——库存变负，要 ACK+重试+定时对账",
     "单个库存 Key 扛所有流量——分片拆 key + 轮询兜底，别让单 slot 打满",
     "未支付订单不回补库存——占着名额卖不出去，延迟消息+状态机回补",
     "强一致方案全走 DB——行锁 TPS 几百，秒杀场景必须接受最终一致+对账"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：秒杀 = 三道闸（入口限流 → Lua 原子扣减 → MQ 异步落账）+ 对账兜底；热点 Key 用分片拆 key + 轮询治理；『查+扣』原子性、未支付回补、DB 乐观锁兜底是三个必答细节。"
   }
  ]
 },
 {
  "id": "scenario-storage-cache",
  "title": "缓存与存储设计：多级缓存、分库分表与冷热数据",
  "layer": 3,
  "depends": [
   "scenario-design-method",
   "scenario-common-components"
  ],
  "covers": [
   "scenario-14",
   "scenario-32"
  ],
  "quiz": [
   "scenario-14",
   "scenario-32"
  ],
  "body": [
   {
    "t": "lead",
    "text": "存储设计的本质是回答『数据放哪一层、谁写、谁读、怎么演进』：多级缓存解决读延迟，分库分表解决数据量与写吞吐，冷热分离解决成本与性能的平衡——三件事讲透，存储类设计题就稳了。"
   },
   {
    "t": "pre",
    "items": [
     "理解缓存击穿/穿透/雪崩三兄弟",
     "熟悉 MySQL 索引、事务、主从复制",
     "理解分库分表的基本原理（取模/范围分片）"
    ]
   },
   {
    "t": "h",
    "text": "多级缓存：本地 → Redis → DB 的读路径"
   },
   {
    "t": "p",
    "text": "游戏读路径三层：① 进程内缓存（玩家内存态、配置表、热点排行榜 TopN）——零网络开销，但多副本要处理一致性（配置表用版本号失效）；② Redis 缓存——跨进程共享（在线状态、排行榜、活动配置），扛住大部分读；③ MySQL——持久层权威。三级设计原则：能进内存的进内存，能进 Redis 的进 Redis，DB 只兜底。缓存三兄弟必须背熟：穿透（查不存在的 key 打穿到 DB）——布隆过滤器前置 or 空值缓存；击穿（热点 key 过期瞬间并发打到 DB）——互斥锁重建 or 逻辑过期；雪崩（大量 key 同时过期）——过期时间加随机抖动 + 多级缓存兜底。游戏档案缓存还有更细的坑：玩家数据 Redis 缓存 + 定期落库，要防『缓存比 DB 新、DB 覆盖缓存』，写路径统一走『内存态 → 异步落库 → 缓存失效/更新』。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">读路径多级缓存与缓存三兄弟防护</text>\n<rect x=\"30\" y=\"46\" width=\"120\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">本地缓存</text>\n<text x=\"90\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">配置表/内存态</text>\n<path d=\"M150 81 L190 81\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#c2a)\"/>\n<rect x=\"190\" y=\"46\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Redis 缓存</text>\n<text x=\"255\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">在线态/排行/活动</text>\n<path d=\"M320 81 L360 81\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#c2a)\"/>\n<rect x=\"360\" y=\"46\" width=\"140\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"430\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">MySQL 持久层</text>\n<text x=\"430\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">权威数据兜底</text>\n<text x=\"430\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">主从读写分离</text>\n<rect x=\"510\" y=\"46\" width=\"104\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"562\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">告警兜底</text>\n<text x=\"562\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">DB 不可被打穿</text>\n<rect x=\"30\" y=\"140\" width=\"584\" height=\"120\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"164\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">缓存三兄弟</text>\n<text x=\"320\" y=\"188\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">穿透：查不存在key打穿DB → 布隆过滤器 / 空值缓存</text>\n<text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">击穿：热点key过期瞬间并发打DB → 互斥锁重建 / 逻辑过期</text>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">雪崩：大量key同时过期 → 过期时间加随机抖动 + 多级兜底</text>\n<text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">游戏档案写路径：内存态 → 异步落库 → 缓存更新，防『DB覆盖新缓存』</text>\n</svg>",
    "caption": "图 1：多级缓存与缓存三兄弟"
   },
   {
    "t": "h",
    "text": "分库分表：游戏数据与电商有什么不同"
   },
   {
    "t": "p",
    "text": "分库分表的触发点：单表数据量过大（千万~亿级）或单库 TPS 不够。分片键是灵魂：必须选『查询条件里恒定出现』的字段。电商订单按 user_id 分片（用户查自己订单天然单库命中）；游戏玩家数据按 player_id 取模分片，命中规则一致。游戏与电商的关键差异：① 游戏数据强『按玩家聚合』——背包、任务、好友都挂 player_id，同一玩家的数据必须落在同一库，否则一次操作跨库事务、悲剧；② 游戏跨服/合服场景要改分片——合服时数据并集，分片规则要支持迁移；③ 游戏主键多用雪花 ID 保证全局唯一，避免分库后自增主键冲突。难点：跨库查询（全服排行榜扫分片归并）、跨库事务（尽量按玩家聚合规避，必须跨的用事务消息/补偿）、扩容（取模分片扩容要重排数据，用一致性哈希或范围分片缓解）。"
   },
   {
    "t": "h",
    "text": "缓存一致性：更新策略与双写坑"
   },
   {
    "t": "p",
    "text": "缓存与 DB 谁权威必须说清：游戏场景里 DB 是权威，Redis 是加速层。更新策略常用『Cache-Aside』（旁路缓存）：读未命中 → 查 DB → 写缓存；写 → 先改 DB → 删除缓存（或更新缓存）。为什么删缓存而不是更新缓存？因为并发写下『更新缓存』会出现旧值覆盖新值的竞态（两个线程都读旧值再写回），而『删缓存』让下一次读重新拉 DB，天然规避。真正的坑是『改 DB 和删缓存不是原子的』：先删缓存后改 DB，中间读会 miss 打 DB（可接受）；先改 DB 后删缓存，缓存删除失败会长期脏读——解法：删除失败重试（延迟双删），或订阅 binlog（如 Canal）异步删缓存。『延迟双删』是面试常考点：先删缓存 → 更新 DB → 延时（如 500ms）再删一次，把并发读回填的旧值再清掉。游戏玩家档案写路径更简单：玩家级单线程收口，『内存态 → 异步落库 → 主动失效缓存』，没有并发双写竞态。"
   },
   {
    "t": "table",
    "head": [
     "缓存一致性方案",
     "原理",
     "适用场景"
    ],
    "rows": [
     [
      "Cache-Aside + 删缓存",
      "改 DB 后删缓存，miss 再拉",
      "读多写少的通用场景"
     ],
     [
      "延迟双删",
      "更新后延时再删一次",
      "读多写少但怕并发回填旧值"
     ],
     [
      "binlog 订阅（Canal）",
      "DB 变更异步驱动删缓存",
      "高可用要求、删除不信任"
     ],
     [
      "玩家级单写收口",
      "同玩家操作串行，直接失效",
      "游戏档案（玩家数据强聚合）"
     ]
    ]
   },
   {
    "t": "h",
    "text": "读写分离与冷热数据"
   },
   {
    "t": "p",
    "text": "读写分离：主库负责写、从库读，读多写少的报表/查询走从库；延迟容忍：从库主从延迟几毫秒到几秒，实时性要求高的读不能走从库（或读主库）。写放大注意：写主库的数据要尽快同步到从库，缓存失效可以『主库写+从库读+缓存失效』组合。冷热分离：游戏数据热冷分明——在线玩家档案是热数据（内存态+Redis+热表），离线很久的玩家是冷数据（归档表/压缩/迁移到廉价存储）。归档策略：按最后登录时间划分（如 30 天未登录 → 冷库），玩家再次登录时热迁移回来；流水/日志类数据天然冷热分明，按天分区，历史分区定期归档/删除。回档（数据恢复）：单玩家精准回档=流水冲正（找到误操作的流水反向补偿），全服回档=快照+binlog 恢复到时间点；代价是回档窗口内数据丢失，边界要提前与运营约定——数据恢复预案要像应急预案一样有卡片、可演练。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 分片路由：按 playerId 取模，同玩家数据强聚合在同一库表\npublic class ShardRouter {\n    private static final int SHARDS = 64; // 建议一次分到位，后续扩容是灾难\n    // 背包表分片：player_bag_{n}\n    public static String table(String base, long playerId) {\n        return base + \"_\" + (playerId % SHARDS);\n    }\n    // 同一玩家所有表（背包/任务/好友）都走同一分片 → 单玩家操作不跨库\n    // 注意：合服/换分区时要数据迁移，分片规则需支持热迁移（双写+对账）\n    // 主键用雪花 ID（全局唯一），避免分库后自增主键冲突\n}"
   },
   {
    "t": "pits",
    "items": [
     "分片键选错（如选 create_time）——查询全库扫描，分片必须选恒定出现的查询条件",
     "同一玩家数据散到多个分片——一次操作跨库事务，必须按 player_id 强聚合",
     "分库后主键还用自增——跨库冲突，换雪花 ID",
     "冷热不分离——百万离线玩家档案占满热表，归档+热迁移是刚需",
     "只讲缓存不讲一致性——缓存与 DB 谁权威必须说清，写路径统一收口"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：存储 = 多级缓存扛读（三兄弟防护）+ 分库分表扛量（player_id 聚合、雪花 ID）+ 读写分离与冷热归档控成本；『按玩家聚合、全局唯一主键、支持迁移』是游戏分库分表的三条铁律。"
   }
  ]
 },
 {
  "id": "scenario-event-async",
  "title": "事件驱动与异步架构：事件总线、消息队列与最终一致",
  "layer": 3,
  "depends": [
   "scenario-common-components",
   "scenario-design-method"
  ],
  "covers": [
   "scenario-17",
   "scenario-18",
   "scenario-13"
  ],
  "quiz": [
   "scenario-17",
   "scenario-18"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服不会只有同步调用的『一根筋』架构：玩家操作是同步主流程，周边系统（日志、排行榜、邮件、对账、跨服 RPC）全走事件与消息——把『同步 vs 异步』的边界划清，就是事件驱动架构的全部。"
   },
   {
    "t": "pre",
    "items": [
     "理解同步调用与消息队列的语义（ACK/重试/幂等）",
     "熟悉 Kafka 消费位点与分区模型",
     "有跨服 RPC、战斗服/功能服拆分的经验"
    ]
   },
   {
    "t": "h",
    "text": "事件总线 vs 消息队列：进程内与跨进程"
   },
   {
    "t": "p",
    "text": "事件总线（EventBus）是进程内的发布订阅：业务动作发事件，同进程的监听器（任务系统、成就、日志、GM 统计）各自响应。游戏服常见实现：Guava EventBus、Disruptor（环形缓冲、无锁、低延迟）、或自研按玩家分片的执行器。作用是把『主流程』与『旁路』解耦：玩家买道具的同步主流程只改背包+扣货币，任务进度、成就判定、行为日志全是监听器异步响应——主流程延迟不随旁路数量增长。跨进程则用消息队列（Kafka）：游戏服产事件 → Kafka → 日志服/排行榜服/BI 消费。选型边界：同进程、低延迟 → 事件总线/Disruptor；跨进程、可堆积、需回溯 → Kafka。"
   },
   {
    "t": "h",
    "text": "Kafka 在游戏里的标准位置：日志与对账"
   },
   {
    "t": "p",
    "text": "Kafka 的核心价值是『削峰 + 解耦 + 可回溯』。游戏标准用法：① 行为日志——游戏服打点（玩家登录、充值、掉落、消耗）→ Kafka → 日志服消费落库/落文件，千万级/日轻松；② 对账——支付回调 → Kafka → 对账服务核对订单；③ 全服广播/邮件——运营事件 → Kafka → 各服消费。设计要点：打点必须带 traceId（端到端链路追踪：客户端请求 → 游戏服 → Kafka → 日志服），这是排查『一条日志从哪来的』的关键；消费端幂等（消息重复投递是常态，业务侧按唯一键去重）；日志丢失可容忍但要有对账（定期核对上下游计数）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">同步主流程 + 异步旁路：事件驱动架构骨架</text>\n<rect x=\"30\" y=\"46\" width=\"220\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"140\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">同步主流程（毫秒级）</text>\n<text x=\"140\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">玩家操作 → 校验 → 改状态</text>\n<text x=\"140\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">扣货币/发道具/结算</text>\n<text x=\"140\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">结果立即返回客户端</text>\n<path d=\"M250 106 L290 106\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#e1a)\"/>\n<rect x=\"290\" y=\"66\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"360\" y=\"92\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">事件总线</text>\n<text x=\"360\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">同进程监听器：任务/成就</text>\n<text x=\"360\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">日志/统计（Disruptor）</text>\n<path d=\"M430 106 L470 106\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#e1a)\"/>\n<rect x=\"470\" y=\"66\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"540\" y=\"92\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka 异步</text>\n<text x=\"540\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">日志服/对账/广播</text>\n<text x=\"540\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">可堆积可回溯</text>\n<rect x=\"30\" y=\"196\" width=\"580\" height=\"76\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">跨服 RPC：同步调用 + 超时重试 + 幂等（战斗服/功能服拆分）</text>\n<text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">请求带 seqId 异步回调；失败重试靠幂等键；强一致需求走补偿/SAGA</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">原则：资产单写——资产变动只在所属服执行，其他服只产『结果事件』</text>\n</svg>",
    "caption": "图 1：事件驱动架构骨架"
   },
   {
    "t": "h",
    "text": "最终一致与对账补偿"
   },
   {
    "t": "p",
    "text": "异步化必然引入『最终一致』：Redis 扣了、MQ 丢了、DB 没落账怎么办？三层兜底：① 可靠投递——生产者 ACK + 失败重试，消费端按唯一业务键幂等；② 状态机 + 对账——每笔业务有状态（已扣减/已下单/已发货/已关闭），定时对账任务核对上下游，缺单补建、多余冲正；③ SAGA 补偿——多服务跨步操作（下单扣库存 → 支付 → 发货），任何一步失败按反向顺序补偿前序步骤（扣库存失败 → 回滚优惠/取消订单）。游戏场景最常被考的是『购买链路』：扣钻石（游戏服）→ 建订单（支付服）→ 支付回调 → 发货——整条链靠 orderId 贯穿幂等，任何一环断了由对账任务兜底。"
   },
   {
    "t": "table",
    "head": [
     "同步 vs 异步：怎么选",
     "同步（RPC/直连）",
     "异步（事件/MQ）"
    ],
    "rows": [
     [
      "延迟",
      "毫秒级、确定",
      "毫秒~秒级、不保证即时"
     ],
     [
      "一致性",
      "调用返回即一致",
      "最终一致，需对账补偿"
     ],
     [
      "主流程",
      "随旁路增多而变慢",
      "不随旁路增长，解耦"
     ],
     [
      "典型场景",
      "战斗结算、改背包、扣货币",
      "日志、排行榜、邮件、广播、对账"
     ],
     [
      "失败处理",
      "超时重试+幂等",
      "ACK+重试+幂等+对账"
     ]
    ]
   },
   {
    "t": "h",
    "text": "跨服 RPC 与数据一致性"
   },
   {
    "t": "p",
    "text": "跨服场景（战斗服/功能服拆分、跨服战场）用 RPC 同步调用：请求带 seqId，异步回调，超时重试；重试必须幂等（按请求键去重）。一致性铁律是『资产单写』——玩家资产变动只在所属服执行，其他服只产『结果事件』，通过消息回推，杜绝双写。跨服战斗的结果回传：战斗服算完 → 结果事件 → 所属服结算（发奖励、扣耐久），结算幂等（按战斗场次+玩家去重）。跨服调用失败的兜底：调用方超时 → 重试；重试仍失败 → 记录补偿任务，恢复后补跑；无法自动补偿的（如跨服奖励）落到对账报表人工处理。SAGA 在游戏里的典型落地：『跨服商店购买 → 扣本服货币 → 请求跨服仓发货』，任何一步失败反向补偿，靠 saga 记录表追踪每一步状态。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 事件驱动：主流程发事件，旁路异步响应（含 Disruptor 定位）\npublic class PlayerBuyHandler {\n    private final BagService bag;\n    private final EventBus eventBus;   // 进程内：Guava/自研 或 Disruptor 环形缓冲\n\n    @Transactional\n    public void buyItem(long playerId, int itemId, int price) {\n        bag.cost(playerId, itemId, price);          // 1. 同步主流程：扣货币+发道具\n        eventBus.post(new ItemFlowEvent(playerId, itemId, price));\n        // 2. 发事件后立即返回，任务/成就/日志/排行监听器异步推进\n        // 主流程延迟不随旁路数量增长——这是事件驱动解耦的核心收益\n    }\n}\n// 跨进程：生产者 ACK + 幂等消费\n// producer.send(new KafkaProducerRecord(\"item_flow\", orderId, payload)); // 带业务键\n// consumer：按 orderId 去重表，命中即跳过，保证消息重投不重复记账"
   },
   {
    "t": "pits",
    "items": [
     "把所有旁路都做成同步调用——主流程延迟随系统数量线性增长，必须事件解耦",
     "消费端不幂等——Kafka 重投是常态，按业务键去重表是刚需",
     "Redis 扣了 MQ 丢了不回补——只有对账任务能兜底，别裸奔",
     "SAGA 只讲概念不落地——反向补偿要有可执行的步骤与状态记录",
     "跨服 RPC 只讲同步不讲超时幂等——seqId + 重试 + 幂等键三件套要背"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：事件驱动 = 同步主流程（改状态）+ 事件总线（同进程旁路）+ Kafka（跨进程异步）+ 最终一致兜底（ACK/幂等/对账/SAGA）；记住『资产单写』原则，任何跨服务操作都要有可追溯的状态机。"
   }
  ]
 },
 {
  "id": "scenario-search-recommend",
  "title": "搜索与推荐：玩家/道具搜索、ES 应用与运营推荐",
  "layer": 3,
  "depends": [
   "scenario-storage-cache"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "搜索与推荐是『把海量数据按条件捞出来』的两类引擎：结构化搜索（玩家名/道具）用 ES，个性化推荐（商城/活动）用规则与协同过滤——游戏场景里它们都要先解决『数据怎么进引擎』的问题。"
   },
   {
    "t": "pre",
    "items": [
     "理解倒排索引与分词、MySQL LIKE 的局限",
     "有日志链路/Kafka 经验（数据进 ES 的管道）",
     "了解协同过滤与 AB 实验的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "为什么 MySQL LIKE 不够：倒排索引"
   },
   {
    "t": "p",
    "text": "玩家昵称搜索『%abc%』是全文扫描，数据量大时毫秒级退化到秒级。ES 用倒排索引：每个词 → 文档列表，查询时按词定位，秒级返回千万级结果。游戏搜索场景盘点：① 玩家名/昵称搜索（好友添加、GM 查号）——ES 或简化方案（前缀索引 + Redis 缓存）；② 道具/商品搜索（商城、拍卖行筛选）——结构化字段（类型、价格、等级），ES 或 MySQL 组合索引即可；③ 运营日志查询（GM 后台查流水）——ES 按字段过滤 + 聚合，这是 ES 在游戏里最高频的用途；④ 全文本（聊天记录、攻略）——分词 + 相关性排序。选型边界：结构化等值/范围查询优先 MySQL 组合索引；模糊匹配、全文、聚合分析才上 ES。"
   },
   {
    "t": "h",
    "text": "数据进 ES：同步管道与一致性"
   },
   {
    "t": "p",
    "text": "ES 不是权威存储，是『从业务数据同步出来的索引副本』。管道：业务落库 → 发变更事件（Kafka）→ 同步服务消费 → 写 ES。要点：① 全量 + 增量双轨——首建全量灌入，之后增量同步；② 幂等——按业务主键 upsert，重复消息不重复建文档；③ 数据一致性——ES 允许分钟级延迟（搜索不是资产操作），定期对账（ES 与 DB 计数对比）兜底；④ 索引设计——按业务分索引（player_idx / item_idx / log_idx），写多读少场景按天建索引（log_20250610），过期索引直接删；⑤ 别把复杂业务逻辑放 ES 查询里，ES 只做『捞候选集』，业务规则在服务端再过滤。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">搜索管道：业务库 → 变更事件 → ES 索引 → 查询</text>\n<rect x=\"30\" y=\"48\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务库</text>\n<text x=\"95\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">MySQL 权威数据</text>\n<path d=\"M160 83 L196 83\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#sr1a)\"/>\n<rect x=\"196\" y=\"48\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"261\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">变更事件</text>\n<text x=\"261\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">Kafka 增量同步</text>\n<path d=\"M326 83 L362 83\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#sr1a)\"/>\n<rect x=\"362\" y=\"48\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"427\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">ES 索引</text>\n<text x=\"427\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">按业务分索引/按天分</text>\n<path d=\"M492 83 L528 83\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#sr1a)\"/>\n<rect x=\"528\" y=\"48\" width=\"88\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"572\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">查询</text>\n<text x=\"572\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">捞候选集</text>\n<rect x=\"30\" y=\"140\" width=\"580\" height=\"100\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"164\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">工程要点</text>\n<text x=\"320\" y=\"188\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">全量+增量双轨：首建全量灌入，之后增量；按业务主键 upsert 幂等</text>\n<text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">允许分钟级延迟：搜索非资产操作，定期对账 ES 与 DB 计数</text>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">ES 只捞候选集，业务规则服务端再过滤——别把复杂逻辑塞进 ES 查询</text>\n</svg>",
    "caption": "图 1：搜索数据管道"
   },
   {
    "t": "h",
    "text": "运营推荐：规则 → 协同过滤 → 个性化"
   },
   {
    "t": "p",
    "text": "游戏推荐（商城推荐、礼包推荐、活动推荐）分三档：① 规则推荐——运营配的『新手必买、热销榜、折扣精选』，简单可靠、易解释，大部分游戏的主力；② 协同过滤——基于用户行为的『买了 A 的也买了 B』，需要用户行为数据（购物/试玩/时长）积累；③ 个性化排序——结合玩家画像（等级、职业、消费能力、活跃度）对候选集打分排序。落地顺序：先规则再算法，算法收益要能解释、能回滚。推荐系统的工程骨架：候选集召回（规则/协同/ES 按标签捞）→ 排序（评分公式/模型）→ 展示位控制 → AB 实验验证 → 效果报表（曝光/点击/转化）。"
   },
   {
    "t": "h",
    "text": "AB 实验与效果度量"
   },
   {
    "t": "p",
    "text": "推荐/运营改动上线前必须 AB：按玩家 ID 哈希分桶（如 10% 实验组、10% 对照组、80% 默认组），两组只差一个变量，跑足周期（至少一个完整转化周期），用显著性检验看指标差（转化率、人均付费）。工程要点：① 分桶要稳定——同一玩家整个实验期落在同一组，按 playerId 取模或一致性哈希；② 埋点要齐全——曝光、点击、转化三段埋点缺一不可，否则效果无法度量；③ 实验要可回滚——开关位控制，效果差立刻关；④ 避免『多实验互相污染』——同层互斥、跨层正交（行业标准的分层实验框架）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// AB 实验分桶：按 playerId 稳定分流，效果可回滚\npublic class AbTest {\n    private static final Map<String, Integer> EXPERIMENT_BUCKETS = new HashMap<>();\n    // 配置：experimentId -> 实验组桶位（如 0~9 实验组，10~99 对照组）\n    public static String group(long playerId, String expId) {\n        int bucket = (int)(playerId % 100);\n        int expBucket = EXPERIMENT_BUCKETS.getOrDefault(expId, -1);\n        if (expBucket >= 0 && bucket < expBucket) return \"test\";\n        if (expBucket >= 0 && bucket >= expBucket && bucket < 20) return \"control\";\n        return \"default\";\n    }\n    // 推荐排序打分示意：候选集 → 个性化评分 → TopK 展示\n    public List<Item> rank(List<Item> candidates, PlayerProfile profile) {\n        return candidates.stream()\n            .sorted(Comparator.comparingDouble(i -> score(i, profile)).reversed())\n            .limit(10).collect(Collectors.toList());\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "能用 MySQL 组合索引解决的模糊搜索硬上 ES——杀鸡用牛刀，先分场景",
     "ES 当权威存储——ES 只是索引副本，权威在业务库，要全量+增量双轨同步",
     "没有埋点就上推荐/AB——曝光/点击/转化三段埋点是效果度量的前提",
     "AB 分桶不稳定——玩家实验期跨组，结果不可信，按 playerId 稳定分桶",
     "算法不可解释、不可回滚——规则先行，算法要能 AB、能开关、能回退"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：搜索用 ES 扛模糊/全文/聚合（数据走 Kafka 增量同步、幂等 upsert、按天分索引），结构化查询优先 MySQL；推荐从规则做起，协同/个性化排序按数据积累逐级演进；一切改动都要 AB 分桶 + 三段埋点 + 可回滚。"
   }
  ]
 },
 {
  "id": "scenario-monitor-sla",
  "title": "监控告警与稳定性：指标、SLO、容量与应急预案",
  "layer": 3,
  "depends": [
   "scenario-event-async"
  ],
  "covers": [
   "scenario-13",
   "scenario-32"
  ],
  "quiz": [
   "scenario-13",
   "scenario-32"
  ],
  "body": [
   {
    "t": "lead",
    "text": "稳定性不是『出了事再救』，而是『指标能度量、红线能预警、容量有预算、预案可演练』四件事的制度化——面试里被问『线上事故怎么处理』，答得出这套体系就赢了。"
   },
   {
    "t": "pre",
    "items": [
     "理解日志链路（traceId、行为日志）",
     "知道 Prometheus/Grafana 的基本概念",
     "有线上事故处理与回档经验"
    ]
   },
   {
    "t": "h",
    "text": "监控指标设计：RED 与四大黄金信号"
   },
   {
    "t": "p",
    "text": "监控指标按 RED 模型设计（对应四大黄金信号的子集）：Rate（每秒请求数）、Errors（错误率）、Duration（延迟 P99/P95）。游戏服必盯的指标：① 接入层——连接数、登录 QPS、登录失败率、消息处理延迟 P99；② 游戏服——玩家在线数、房间/场景数、事件队列积压（Disruptor 填满度）、GC 频率与停顿、内存/CPU/线程池；③ 数据层——Redis 命中率、慢查询数、DB TPS/行锁等待、Kafka 消费位点落后（lag）；④ 业务指标——充值流水、道具发放量、异常重复单。指标用 Prometheus 拉取 + Grafana 面板，日志用 ELK/自研链路。关键：业务指标（lag、积压、重复单）比系统指标更能反映『要出事故』。"
   },
   {
    "t": "h",
    "text": "告警规则与 SLO：别被噪音淹没"
   },
   {
    "t": "p",
    "text": "告警三要素：正确（只告真问题）、及时（快速发现）、可执行（告警即有应对预案）。分级：P0（全服不可用/资损）→ 5 分钟内拉响电话；P1（部分功能受损）→ 15 分钟；P2（潜在风险）→ 工单。SLO（服务等级目标）要量化：可用性 99.9%（月停机 < 43 分钟）、登录成功率、充值到账延迟 P99 < 5 秒——目标定得越具体，告警阈值越有依据（SLO - 余量 = 告警线）。告警噪音治理：抖动抑制（持续 N 分钟才触发）、聚合（同一根因合并成一条）、值班轮换。容量水位：CPU/内存/连接数按 70%~80% 设预警线，提前扩容，别等 99% 才处理；『压测先行』——上线前按预估峰值 1.5 倍压测，确认容量余量。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">稳定性体系四件事：度量 → 预警 → 预案 → 复盘</text>\n<rect x=\"30\" y=\"46\" width=\"130\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 指标度量</text>\n<text x=\"95\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">RED：速率/错误/延迟</text>\n<text x=\"95\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">连接数/在线/GC/lag</text>\n<text x=\"95\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">业务指标：流水/重复单</text>\n<text x=\"95\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">Prometheus+Grafana</text>\n<path d=\"M160 120 L196 120\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#mo1a)\"/>\n<rect x=\"196\" y=\"46\" width=\"130\" height=\"150\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"261\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 告警预警</text>\n<text x=\"261\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">分级 P0/P1/P2</text>\n<text x=\"261\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">SLO-余量=告警线</text>\n<text x=\"261\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">抖动抑制/根因合并</text>\n<text x=\"261\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">噪音治理</text>\n<path d=\"M326 120 L362 120\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#mo1a)\"/>\n<rect x=\"362\" y=\"46\" width=\"130\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"427\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 应急预案</text>\n<text x=\"427\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">容量水位 70%~80%预警</text>\n<text x=\"427\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">预案卡：每个故障有动作</text>\n<text x=\"427\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">降级开关/回档快照</text>\n<text x=\"427\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">可演练</text>\n<path d=\"M492 120 L528 120\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#mo1a)\"/>\n<rect x=\"528\" y=\"46\" width=\"88\" height=\"150\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"572\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 复盘</text>\n<text x=\"572\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">5个Why</text>\n<text x=\"572\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">根因+行动项</text>\n<text x=\"572\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">避免重复事故</text>\n<text x=\"572\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">闭环</text>\n<defs><marker id=\"mo1a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：稳定性体系四件事"
   },
   {
    "t": "h",
    "text": "应急预案与容量压测"
   },
   {
    "t": "p",
    "text": "预案卡（Playbook）：每个已知故障类型配一张卡——『Kafka lag 飙高：先扩消费者，再查消费逻辑是否卡死』『Redis 主从切换：等待哨兵/集群自动选举，观察连接恢复』『游戏服内存飙高：dump 堆栈 + 抓 GC 日志，必要时重启止损』。预案要可演练：季度做一次故障演练（模拟 Redis 挂掉、Kafka 断流），验证降级路径真实可用，别等真出事才发现降级代码没生效。压测：上线前按预估峰值 1.5 倍压测，同时压出系统极限，明确『超过多少 QPS 必须限流保护』。降级开关：关键功能（排行榜、聊天、邮件）要有独立开关，出问题时先降级止血再定位——『先恢复、后复盘』是事故处理的第一原则。"
   },
   {
    "t": "h",
    "text": "事故处理流程：从发现到复盘"
   },
   {
    "t": "p",
    "text": "标准流程：① 发现（告警/玩家反馈）→ ② 响应（P0 拉群/电话，指定指挥官）→ ③ 止血（按预案降级/回滚/扩容，先恢复服务）→ ④ 定位（看 traceId 链路、日志、指标，找根因）→ ⑤ 修复（发布修复，灰度验证）→ ⑥ 复盘（5 个 Why 追根因，产出行之有效的行动项，避免重复事故）。回档是最后手段：全服回档到快照点（代价是回档窗口内数据丢失），单玩家回档用流水冲正；回档边界（能回哪些数据、丢哪些数据）要提前与运营书面约定，事故中再谈边界就是灾难。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 业务指标埋点：日志链路 traceId 贯穿，出问题能端到端定位\npublic class Metrics {\n    // 登录成功率埋点：Rate/Errors 都有了，配合告警规则\n    public void login(long playerId, boolean ok, long costMs, String traceId) {\n        if (ok) metrics.counter(\"login.success\").inc();\n        else    metrics.counter(\"login.fail\").inc();\n        metrics.histogram(\"login.cost\").observe(costMs);   // 看 P99\n        log.info(\"login player={} ok={} cost={}ms trace={}\", playerId, ok, costMs, traceId);\n    }\n    // 告警线推导：SLO 99.9% 可用性 → 月停机预算 43 分钟 → 连续 5 分钟错误率超阈值即 P1\n    // 容量预警：连接数/CPU 达 70% 黄色预警，85% 红色预警，提前扩容\n}"
   },
   {
    "t": "pits",
    "items": [
     "只盯系统指标不看业务指标——lag、重复单、流水异常才是事故前兆",
     "告警全是噪音——没有分级、没有抖动抑制，值班会麻木，真正事故被淹没",
     "SLO 是口号不是数字——可用性/延迟要量化成阈值，SLO-余量=告警线",
     "预案从不演练——真出事发现降级代码没生效，预案要季度演练",
     "回档边界不提前约定——事故中谈『丢多少数据』就是二次事故"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：稳定性 = RED 指标度量 + 分级告警与 SLO 阈值 + 预案卡与季度演练 + 事故五步流程（发现→止血→定位→修复→复盘）；『先恢复后复盘』、容量压测 1.5 倍、回档边界提前书面化是三个实战要点。"
   }
  ]
 },
 {
  "id": "scenario-login-chain",
  "title": "完整案例：设计登录链路（注册/会话/防刷/压测）",
  "layer": 3,
  "depends": [
   "scenario-design-method",
   "scenario-common-components"
  ],
  "covers": [
   "scenario-33",
   "scenario-06",
   "scenario-12"
  ],
  "quiz": [
   "scenario-33",
   "scenario-06",
   "scenario-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "登录链路是『端到端架构』的最佳案例：从注册到进游戏服，横跨账号、鉴权、会话、防刷、压测五个环节，把前面所有方法论串成一条完整主线——答好这一题，等于现场展示一遍完整设计能力。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 Netty 长连接与 token 鉴权",
     "理解 Redis 在线态与多端互踢",
     "理解防刷（限流/验证码/风控）与压测"
    ]
   },
   {
    "t": "h",
    "text": "第一步：注册与账号体系"
   },
   {
    "t": "p",
    "text": "注册设计要点：① 账号唯一性——手机号/邮箱/用户名加唯一索引，注册请求幂等（同一注册请求重复提交不重复建号）；② 密码存储——绝不明文/简单 MD5，加盐 bcrypt/Argon2（重哈希成本换安全），数据库泄露也不暴露原文；③ 游客登录（渠道游客）——生成 guest_xxx 账号，可绑定手机号升级为正式账号；④ 注册入口防刷——同一 IP/设备注册频率限制 + 验证码，防止批量小号（工作室）。账号体系是支付与社交的基础，注册即分配 playerId（雪花），后续所有系统按 playerId 聚合。"
   },
   {
    "t": "h",
    "text": "第二步：token 签发与校验"
   },
   {
    "t": "p",
    "text": "登录成功后签发 token，游戏里常用『短期 access token + 可刷新』：登录服签 token（含 playerId、区服、过期时间、签名），客户端带 token 连接游戏服，游戏服校验 token 并绑定连接。token 设计要点：① 无状态（JWT 式自校验）还是有状态（Redis 存 session）——JWT 免查库但难吊销，游戏登录通常用 Redis 会话（在线态、多端互踢都要 Redis），token 存 Redis 带过期时间，踢人=删 Redis 记录；② 传输安全——token 走 HTTPS/WSS，游戏内加密协议用 AES（对称）+ RSA/ECDH 密钥协商，防抓包；③ 防重放——请求带时间戳 + 随机数 + 签名，过期/重放的请求拒绝；④ 会话与连接分离——连接易失、会话持久（玩家状态挂 playerId 的 Session 而非 TCP 连接），断线重连=新连接重新绑定旧会话。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">登录链路：从客户端到进游戏服的主流程</text>\n<rect x=\"30\" y=\"46\" width=\"120\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">客户端</text>\n<text x=\"90\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">账号+密码/游客</text>\n<text x=\"90\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">HTTPS/WSS</text>\n<path d=\"M150 90 L186 90\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#lg1a)\"/>\n<rect x=\"186\" y=\"46\" width=\"130\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"251\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">登录服</text>\n<text x=\"251\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">验账号 → 签发 token</text>\n<text x=\"251\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">防刷(限流/验证码)</text>\n<path d=\"M316 90 L352 90\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#lg1a)\"/>\n<rect x=\"352\" y=\"46\" width=\"130\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"417\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服</text>\n<text x=\"417\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">校验 token → 绑连接</text>\n<text x=\"417\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">踢旧连接→补发快照</text>\n<path d=\"M482 90 L518 90\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#lg1a)\"/>\n<rect x=\"518\" y=\"46\" width=\"96\" height=\"90\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"566\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Redis</text>\n<text x=\"566\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">会话/在线态</text>\n<text x=\"566\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">多端互踢</text>\n<rect x=\"30\" y=\"156\" width=\"584\" height=\"122\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">关键设计点</text>\n<text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">① 会话与连接分离：状态挂 playerId 的 Session，重连=新连接绑旧会话</text>\n<text x=\"320\" y=\"226\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">② 多端互踢：新连接绑定时通知旧连接被顶号并关闭，防双端操作</text>\n<text x=\"320\" y=\"248\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">③ 断线幂等：请求带 requestId，服务端去重表防重复结算；心跳 IdleStateHandler 判死连接</text>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"lv3\">④ 防刷：登录限流 + 验证码 + 设备/IP 风控 + 密码暴力破解锁定</text>\n</svg>",
    "caption": "图 1：登录链路主流程"
   },
   {
    "t": "h",
    "text": "第三步：重连、踢号与数据不丢不重"
   },
   {
    "t": "p",
    "text": "网络闪断重连：短时间（宽限期 3~5 分钟）内重连 → 新 Channel 绑定旧 Session，补发全量快照（自己+视野内实体）再恢复增量；超宽限期 → 按正常下线处理，数据落库。防双端：新连接绑定会话时检查旧 Channel 存在则通知『被顶号』并关闭，写路径天然单点。防重复结算：所有奖励/扣费请求带客户端生成的唯一 requestId，服务端去重表（playerId+requestId）命中即返回首次结果——断线重发不会二次扣费/二次发奖。心跳：客户端 30 秒上行、服务端 60~90 秒判死连接并释放资源。数据安全：玩家数据定期落库 + 关键操作即时落库，断线不等于丢档。"
   },
   {
    "t": "h",
    "text": "第四步：开服登录潮与压测"
   },
   {
    "t": "p",
    "text": "开服瞬间登录潮是真实考验：数万人同时登录，登录服无状态可水平扩展（加机器即可），但登录后的『创建会话、拉档案、广播上线』会打游戏服。对策：① 登录限流——令牌桶控制登录 QPS，超出排队（登录队列），防击穿；② 分批放行——排队策略（先到先进，超时重新排）；③ 游戏服预热——开服前预热 Redis 缓存与玩家档案，避免首登全打 DB；④ 压测验证——上线前按峰值 1.5 倍压测（模拟登录潮），确认登录服/游戏服/Redis/DB 的容量水位，压出系统极限并配置对应限流阈值；⑤ 降级预案——登录拥堵时提示『排队中』而非让请求堆积打垮系统。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 登录会话与重连核心（Netty 侧，简化）\npublic class LoginService {\n    // 1. 登录：验账号 → 签 token → Redis 记会话（含过期时间与当前连接）\n    public String login(String account, String pwd, int serverId) {\n        if (!auth(account, pwd)) return null;                 // bcrypt 校验\n        String token = UUID.randomUUID().toString().replace(\"-\", \"\");\n        redis.setex(\"session:\" + token, 3600, playerId + \":\" + serverId);\n        return token;\n    }\n    // 2. 重连绑定：新 Channel 绑旧 Session，踢掉旧 Channel（防双端）\n    public void bind(Long playerId, Channel newCh) {\n        Channel old = sessions.get(playerId);\n        if (old != null) old.writeAndFlush(KICK).addListener(CLOSE); // 通知被顶号\n        sessions.put(playerId, newCh);\n    }\n    // 3. 幂等：requestId 去重，断线重发不重复结算\n    if (idempotent.setIfAbsent(\"req:\" + playerId + \":\" + requestId, 1, 60, SECONDS)) {\n        doReward(playerId, reward);                           // 只有首次命中执行\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "把会话挂 TCP 连接上——连接断会话丢，必须『连接易失、会话持久』",
     "token 不设过期/不可吊销——JWT 免查库但踢不了人，登录用 Redis 会话",
     "重连后直接补全量不同步——重连要『踢旧→绑新→补快照→增量恢复』四步",
     "登录潮没有限流——数万请求全怼游戏服，登录队列+分批放行+预热是标配",
     "上线不压测——容量没数，事故必然，峰值 1.5 倍压测是上线前硬指标"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：登录链路 = 注册幂等 + bcrypt 密码 + token/Redis 会话 + 会话连接分离与重连幂等 + 多端互踢 + 登录潮限流与压测。答完整条主线并带出 2~3 个工程细节（requestId 去重、宽限期、IdleStateHandler），就是一份完整的端到端设计。"
   }
  ]
 },
 {
  "id": "scenario-game-pay-chain",
  "title": "完整案例：设计游戏服务器与支付链路",
  "layer": 3,
  "depends": [
   "scenario-event-async",
   "scenario-shop-trade",
   "scenario-seckill-hotspot"
  ],
  "covers": [
   "scenario-16",
   "scenario-08",
   "scenario-28"
  ],
  "quiz": [
   "scenario-16",
   "scenario-08"
  ],
  "body": [
   {
    "t": "lead",
    "text": "支付链路是『一致性要求最高』的全链路设计：从客户端点购买到支付回调再到发货，横跨游戏服、支付服、渠道、日志，钱和道具一条线——对账、幂等、防刷一个都不能少。这题答好了，直接展示十年游戏后端的所有功力。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉订单模型与状态机、对账思想",
     "有购买服发货/防刷经验（扣钻石+发货同事务）",
     "理解回调安全（验签/防重放）与幂等"
    ]
   },
   {
    "t": "h",
    "text": "整体架构：游戏服、支付服、渠道三方"
   },
   {
    "t": "p",
    "text": "支付链路角色：客户端（点购买）→ 游戏服（生成订单、扣游戏内货币或发起充值）→ 支付服（对接苹果/微信/渠道支付，验签、落订单）→ 渠道支付（真正收钱）→ 支付回调（渠道→支付服→游戏服→发货）。关键：支付服是公网 HTTP 入口，独立部署做安全隔离（被攻击/出 bug 不能把核心玩法拉下水）；游戏服不直接对接渠道，所有渠道回调统一进支付服验签后再转游戏服——渠道适配变化只在支付服，游戏服只认支付服的内部协议。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">支付链路：下单 → 支付 → 回调 → 发货 → 对账</text>\n<rect x=\"30\" y=\"46\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">客户端</text>\n<text x=\"95\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">下单请求/拉起支付</text>\n<path d=\"M160 80 L196 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#p1a)\"/>\n<rect x=\"196\" y=\"46\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"261\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服</text>\n<text x=\"261\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">建订单/扣货币/发货</text>\n<path d=\"M326 80 L362 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#p1a)\"/>\n<rect x=\"362\" y=\"46\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"427\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">支付服</text>\n<text x=\"427\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">渠道验签/订单落库</text>\n<path d=\"M492 80 L528 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#p1a)\"/>\n<rect x=\"528\" y=\"46\" width=\"88\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"572\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">渠道</text>\n<text x=\"572\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">苹果/微信/渠道</text>\n<rect x=\"30\" y=\"136\" width=\"584\" height=\"142\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">关键设计点</text>\n<text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">① 订单状态机：待支付 → 已支付 → 已发货 → 已关闭，全程 orderId 贯穿</text>\n<text x=\"320\" y=\"206\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">② 回调验签：渠道签名校验 + 防重放（订单已处理则直接返回成功，幂等）</text>\n<text x=\"320\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">③ 发货幂等：支付服→游戏服按 orderId 去重，扣钻石+发道具同事务+流水</text>\n<text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"muted\">④ 对账：每日拉渠道账单 vs 本地订单核对，差异单按状态机补发/退款</text>\n<text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var=\"lv3\">⑤ 防刷：订单号不可猜测、下单限流、金额/商品校验服务端权威</text>\n</svg>",
    "caption": "图 1：支付链路与关键设计点"
   },
   {
    "t": "h",
    "text": "订单模型与状态机"
   },
   {
    "t": "p",
    "text": "订单表 order(id, player_id, goods_id, amount, currency, status, channel, create_time, pay_time)：主键用雪花 ID；状态机：待支付 → 已支付 → 已发货 → 已关闭（超时未支付）。状态流转要『可追溯』——每次流转记流水（谁触发、什么时间、旧态→新态）。订单号不可猜测：用雪花 ID + 渠道前缀，防刷单/撞号。下单幂等：同一玩家重复点购买只生成一个待支付订单（按 playerId+goodsId 查待支付单），防重复订单。超时关闭：延迟消息/定时扫描关闭超时未支付订单，回调晚到时按状态机判断（已关闭的订单不发货、走退款流程）。"
   },
   {
    "t": "h",
    "text": "支付回调与发货：验签、幂等、同事务"
   },
   {
    "t": "p",
    "text": "回调链路三道防：① 验签——渠道回调带签名（RSA/公私钥），支付服验签失败直接拒绝，杜绝伪造回调；② 防重放——渠道可能重复回调，订单『已处理』直接返回成功（幂等），不重复发货；③ 通知可信——支付服确认订单已支付后，通过内部 RPC/消息通知游戏服发货，通知要带 orderId，游戏服按 orderId 去重。发货本身：扣钻石（若是内购型礼包）与发道具必须在同一事务 + 记流水（order_id 关联）——这是『扣了没发/发了没扣』事故的根治方案。苹果的 IAP 还有票据校验（receipt 上服务端二次验证），Android/微信渠道同样服务端验签，客户端永远不可信。"
   },
   {
    "t": "h",
    "text": "对账与防刷"
   },
   {
    "t": "p",
    "text": "对账是支付链路的最后防线：每日定时任务拉取渠道账单（各渠道的支付明细），与本地订单表核对——金额一致、订单一一对应；差异分两类：① 渠道有、本地无（漏单）——查回调是否丢失，补发/补录；② 本地有、渠道无（假单）——状态机回滚/退款，查是否被伪造。对账报告按渠道、按天归档，是财务审计的依据。防刷：下单接口限流（同玩家/同 IP 频率）、金额与商品由服务端权威定价（不信任客户端传价）、重复支付同订单（状态机挡）、高风险玩家（异地登录/异常设备）加风控标记、GM 后台的充值操作全量审计（谁、何时、对谁、金额）——这正好接邓凡的 GM 后台重构经验：危险操作走审批 + 二次确认 + 审计日志，绝不直改游戏库。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 支付回调处理：验签 + 幂等 + 同事务发货（核心逻辑）\npublic class PayService {\n    @Transactional\n    public PayResult onChannelCallback(PayCallback cb) {\n        if (!verifySignature(cb)) return PayResult.REJECT;      // ① 验签失败即拒\n        // ② 幂等：订单状态机流转，重复回调直接返回成功\n        Order order = orderMapper.lockForUpdate(cb.getOrderId()); // 行锁防并发\n        if (order.getStatus() == OrderStatus.PAID) return PayResult.OK;\n        if (order.getStatus() != OrderStatus.PENDING) return PayResult.REJECT;\n        orderMapper.updateStatus(order.getId(), OrderStatus.PAID);\n        // ③ 同事务发货：扣货币 + 发道具 + 流水（orderId 关联）\n        bagService.deliver(order);                                  // 失败则事务回滚\n        return PayResult.OK;\n    }\n    // ④ 对账任务：每日拉渠道账单 vs 本地订单，差异单按状态机补发/退款\n}"
   },
   {
    "t": "pits",
    "items": [
     "客户端传金额/商品——服务端必须权威定价，客户端数据一律不信任",
     "回调不验签或验签不严格——伪造回调免费充值，RSA 验签是第一道门",
     "发货不幂等——渠道重复回调发两次货，状态机+orderId 去重是标配",
     "扣钻石和发道具分两个事务——扣了没发/发了没扣，必须同事务+流水",
     "没有对账——漏单/假单全看不见，每日渠道对账+差异处理是支付系统的压舱石"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：支付链路 = 游戏服/支付服/渠道三方隔离（支付服验签、游戏服发货）+ 订单状态机贯穿 + 回调验签防重放 + 同事务发货 + 每日对账兜底 + GM 审计防内鬼。把『orderId 贯穿 + 状态机 + 对账』这条主线讲清，再补验签与同事务两个细节，就是一份能打动面试官的完整设计。"
   }
  ]
 }
]
};
