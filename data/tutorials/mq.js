window.TB = window.TB || {};
window.TB["mq"] = {
  id: "mq",
  name: "消息队列 Kafka",
  icon: "📨",
  nodes: [
 {
  "id": "mq-basics",
  "title": "消息队列基础与 Kafka 定位",
  "layer": 0,
  "depends": [],
  "covers": [
   "mq-07"
  ],
  "quiz": [
   "mq-07"
  ],
  "body": [
   {
    "t": "lead",
    "text": "消息队列（MQ）是游戏服架构里的'异步缓冲带'：把生产者和消费者解耦，让高峰流量被削平、让不相关的系统各自独立演进。它是理解 Kafka 一切特性的世界观。"
   },
   {
    "t": "pre",
    "items": [
     "做过登录服/游戏服/日志服，理解'玩家操作要写库、要记录日志'的同步链路痛点",
     "明白同步调用与线程阻塞的代价（DB 抖动拖慢主线程）",
     "不需要任何 MQ 使用经验"
    ]
   },
   {
    "t": "h",
    "text": "为什么需要 MQ：直接同步调用的三个痛点"
   },
   {
    "t": "p",
    "text": "先回忆一个最朴素的游戏服场景：玩家登录成功后，登录服要把日志写到 MySQL，要通知好友服，要给 BI 报表同步数据，还要给风控服务上报行为。如果这些都用同步 RPC 直接调，第一，任意一个下游（比如 MySQL 慢查询）变慢，玩家登录请求就被拖住，登录服响应时间飙到秒级；第二，这些下游和登录服强耦合，新增一个消费方就要改登录服代码重新发版；第三，晚上八点活动开服瞬间，全服玩家同时登录打点，日志写入洪峰直接打垮数据库。消息队列就是为这三个问题而生的：异步、解耦、削峰。"
   },
   {
    "t": "h",
    "text": "MQ 三大价值：解耦 / 削峰 / 异步"
   },
   {
    "t": "p",
    "text": "以日志服为例（结合你自己的项目）：游戏服把行为日志丢进 Kafka 后立即返回，日志服按自己的消费能力匀速拉取、批量写库。游戏服不需要知道日志最终写到哪几张表、要不要同步给 BI，Topic 就是双方约定的契约。MySQL 维护或慢查询时，消息堆在 Kafka 里不丢（Kafka 持久化 + 多副本），恢复后追平即可，游戏服完全无感知——这是缓冲与重试的价值。逻辑线程发消息是异步的，不会因 DB 抖动拖垮战斗/玩法响应——这是不阻塞主线程的价值。另一个对照维度是 Disruptor：它是单进程内的内存队列，管服内异步解耦，进程宕机即丢、不能跨服；Kafka 管服间解耦与持久化缓冲。两者是流水线的前后段，不是替代关系——'Disruptor 管服内、Kafka 管服间'是游戏服务器架构的口头禅。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服日志链路：MQ 的削峰与解耦</text>\n<rect x=\"30\" y=\"50\" width=\"140\" height=\"66\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"100\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服</text>\n<text x=\"100\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录/战斗/经济流水</text>\n<text x=\"100\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">异步 send 立即返回</text>\n<rect x=\"250\" y=\"50\" width=\"140\" height=\"66\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka（中转仓）</text>\n<text x=\"320\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">持久化 + 多副本</text>\n<text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">洪峰时缓冲不丢</text>\n<rect x=\"470\" y=\"50\" width=\"140\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"540\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">日志服</text>\n<text x=\"540\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">匀速批量写 MySQL</text>\n<text x=\"540\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">按自己节奏消费</text>\n<path d=\"M170 83 L250 83\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#mbA)\"/>\n<path d=\"M390 83 L470 83\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#mbA)\"/>\n<defs><marker id=\"mbA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"150\" width=\"580\" height=\"62\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三个下游互不干扰：一次生产、多方消费</text>\n<rect x=\"50\" y=\"192\" width=\"160\" height=\"0\" fill=\"none\"/>\n<rect x=\"40\" y=\"228\" width=\"170\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"125\" y=\"253\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">日志服 → MySQL 离线报表</text>\n<rect x=\"235\" y=\"228\" width=\"170\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"253\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">BI 服 → 实时大屏</text>\n<rect x=\"430\" y=\"228\" width=\"170\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"515\" y=\"253\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">风控服 → 异常检测</text>\n</svg>",
    "caption": "图 1：MQ 在日志链路中的削峰与解耦定位"
   },
   {
    "t": "h",
    "text": "核心概念词汇表（所有 MQ 通用）"
   },
   {
    "t": "table",
    "head": [
     "概念",
     "一句话说明",
     "游戏服类比"
    ],
    "rows": [
     [
      "消息 Message",
      "一次通信的数据单元，含业务负载 + 元数据",
      "一条玩家行为日志、一笔支付事件"
     ],
     [
      "生产者 Producer",
      "发送消息的一方",
      "游戏服上报 SDK、支付服回调处理器"
     ],
     [
      "消费者 Consumer",
      "接收并处理消息的一方",
      "日志服消费线程、发奖服务"
     ],
     [
      "队列 Queue",
      "点对点 FIFO 容器，一条消息只被一个消费者消费",
      "GM 后台内部指令队列"
     ],
     [
      "主题 Topic",
      "发布订阅模型中的逻辑分类，可被多消费者组各自消费",
      "player-log、pay-success-events"
     ],
     [
      "Broker",
      "消息服务端节点（Kafka 的一个服务器进程）",
      "一台 Kafka 服务器"
     ],
     [
      "投递语义",
      "at-most-once / at-least-once / exactly-once",
      "支付宁可重不可丢，打点可忍丢"
     ]
    ]
   },
   {
    "t": "h",
    "text": "两大消息模型：队列模型 vs 发布订阅模型"
   },
   {
    "t": "p",
    "text": "队列模型（point-to-point）：一条消息进入队列后，只能被一个消费者取走，取走即删除（或标记消费），消费完消息就没了，适合'一个任务只有一个执行者'的场景（如 GM 后台的处理任务）。发布订阅模型（publish-subscribe）：生产者往 Topic 发消息，所有订阅了这个 Topic 的消费者组各自消费全量副本，互不影响。Kafka 的 Topic 就是发布订阅模型——同一份日志，日志服写库、BI 服做报表、风控服做检测，三个组各拿各的。理解'一条消息能不能被多消费者各自消费'这个分水岭，是理解 Kafka 消费语义的第一步。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"165\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">队列模型（点对点）</text>\n<text x=\"485\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">发布订阅模型（Topic）</text>\n<rect x=\"70\" y=\"45\" width=\"180\" height=\"50\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"160\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Queue</text>\n<rect x=\"55\" y=\"130\" width=\"90\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">消费者A</text>\n<rect x=\"175\" y=\"130\" width=\"90\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"220\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">消费者B</text>\n<path d=\"M160 95 L100 130\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#qm1)\"/>\n<path d=\"M160 95 L220 130\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"5 4\" marker-end=\"url(#qm2)\"/>\n<defs>\n<marker id=\"qm1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker>\n<marker id=\"qm2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker>\n</defs>\n<text x=\"160\" y=\"205\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一条消息只归一个消费者（A 拿走 B 拿不到）</text>\n<rect x=\"390\" y=\"45\" width=\"180\" height=\"50\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"480\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Topic</text>\n<rect x=\"355\" y=\"130\" width=\"120\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"415\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">消费组 G1</text>\n<text x=\"415\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">日志服</text>\n<rect x=\"500\" y=\"130\" width=\"120\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"560\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">消费组 G2</text>\n<text x=\"560\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BI 服</text>\n<path d=\"M480 95 L415 130\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#qm3)\"/>\n<path d=\"M480 95 L560 130\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#qm3)\"/>\n<defs><marker id=\"qm3\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"480\" y=\"205\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">每个消费组各自消费全量副本（互不影响）</text>\n</svg>",
    "caption": "图 2：队列模型与发布订阅模型对比"
   },
   {
    "t": "h",
    "text": "Kafka 的定位：高吞吐日志流管道"
   },
   {
    "t": "p",
    "text": "Kafka 是'分区日志模型'的消息中间件，定位是高吞吐日志流 / 大数据管道：单机十万~百万级 TPS，靠顺序写 + 页缓存 + 零拷贝 + 批量攒批达成；天然支持消息持久化与多副本高可用，消费端按 offset 回溯重放，是游戏服行为日志、BI 数据管道、埋点上报的标准选型。它的短板也要心里有数：原生不支持延迟消息、死信队列（需应用层实现）、消息体过大时吞吐下降明显——但这些短板在游戏日志场景几乎用不到。面试时不要只说'Kafka 快'，要能讲清'为什么快'（顺写/页缓/零拷/批）和'它擅长什么场景、不擅长什么场景'，体现选型判断力。"
   },
   {
    "t": "h",
    "text": "引入 MQ 不是免费的：收益与新增的复杂度"
   },
   {
    "t": "p",
    "text": "引入 MQ 的账要算清楚：多了一个必须高可用的中间件（Broker 集群、监控、告警、容量管理），多了一层异步不确定性（消息延迟、乱序、重复消费要设计兜底），多了一套运维负担（升级、扩容、故障恢复演练）。所以要按收益决策：日志洪峰有没有真的打垮过库？下游要不要多方复用（日志服 + BI 服 + 风控服）？支付链路要不要异步解耦？如果只是两个服务同步调用就能解决，硬上 MQ 是过度设计。游戏服的权衡原则：跨服的、流量峰谷明显的、需要多消费方的，才值得过 Kafka；服内的、单进程内的、延迟敏感的（技能结算、战斗内实时计算），留在进程内用 Disruptor 或线程池。这也是'Disruptor 管服内、Kafka 管服间'分工的经济学依据。"
   },
   {
    "t": "pits",
    "items": [
     "把 MQ 三大价值背成口号不结合场景：必须用'晚高峰日志洪峰''支付回调''跨服广播'这类你项目里的真实案例讲",
     "说'MQ 很慢'：Kafka 本地消费延迟毫秒级，攒批参数可控，不能一概而论",
     "混淆队列模型与发布订阅模型：一条消息能不能被多消费者各自消费是分水岭",
     "以为 MQ 一定可靠：投递语义三档差距巨大，'进了 Kafka 就万事大吉'是最危险的认知",
     "选型只罗列名词不给结论：面试官要的是'我的日志场景为什么选 Kafka'这种判断"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：MQ 解决解耦/削峰/异步三大痛点，游戏服里'Disruptor 管服内、Kafka 管服间'；Kafka 定位高吞吐日志管道，靠顺写/页缓/零拷/批达成；下一篇进入 Kafka 架构，理解分区日志模型。"
   }
  ]
 },
 {
  "id": "mq-kafka-architecture",
  "title": "Kafka 架构与核心概念",
  "layer": 0,
  "depends": [
   "mq-basics"
  ],
  "covers": [
   "mq-01",
   "mq-06",
   "mq-18"
  ],
  "quiz": [
   "mq-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Kafka 的底层模型是'分区日志'（partitioned log）：数据是追加写的有序日志，用分区做并行，用副本做可靠。理解这套世界观，后面的生产者、消费者、可靠性都是自然推论。"
   },
   {
    "t": "pre",
    "items": [
     "理解 MQ 的解耦/削峰/异步价值（见上一篇）",
     "熟悉 Topic / Producer / Consumer / Broker 词汇",
     "知道 offset（消息在分区里的位置编号）这个概念"
    ]
   },
   {
    "t": "h",
    "text": "自顶向下：Broker → Topic → Partition → Replica → ISR"
   },
   {
    "t": "p",
    "text": "一句话定性：'Topic 是名义，Partition 是本体，ISR 是保镖团'。Broker 是一台 Kafka 服务器，多个 Broker 组成集群，其中一个被选举为 Controller，负责分区 Leader 选举与元数据管理。Topic 是消息的逻辑分类，类似数据库表，但它是逻辑概念——真正的存储单位是 Partition。Partition 是 Topic 的物理分片，每个 Partition 是一段有序、不可变的追加日志，消息通过 offset 定位；分区数是 Kafka 并行度的上限，也是保序的单位。每个 Partition 有多个副本（Replica）：一个 Leader 对外读写，其余 Follower 从 Leader 拉取数据；ISR（In-Sync Replicas）是与 Leader 保持同步的副本集合（落后超过 replica.lag.time.max.ms 就被踢出），Leader 宕机时只从 ISR 中选新 Leader，保证不丢已提交消息。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka 集群架构：Topic → Partition → 副本</text>\n<rect x=\"30\" y=\"45\" width=\"180\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Topic: player-log</text>\n<text x=\"120\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">逻辑分类（分区集合）</text>\n<path d=\"M120 97 L120 120\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<rect x=\"30\" y=\"120\" width=\"580\" height=\"180\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"142\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三个 Partition（并行单位，各自有序日志）</text>\n<rect x=\"50\" y=\"158\" width=\"170\" height=\"126\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"135\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Partition 0</text>\n<text x=\"135\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Leader @B0</text>\n<rect x=\"62\" y=\"212\" width=\"58\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"91\" y=\"231\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">offset 0..n</text>\n<rect x=\"126\" y=\"212\" width=\"58\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"155\" y=\"231\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ISR 内</text>\n<text x=\"135\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Follower @B1/B2 同步</text>\n<rect x=\"240\" y=\"158\" width=\"170\" height=\"126\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Partition 1</text>\n<text x=\"325\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Leader @B1</text>\n<rect x=\"252\" y=\"212\" width=\"58\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"281\" y=\"231\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">offset 0..n</text>\n<rect x=\"316\" y=\"212\" width=\"58\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"345\" y=\"231\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ISR 内</text>\n<text x=\"325\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Follower @B0/B2 同步</text>\n<rect x=\"430\" y=\"158\" width=\"170\" height=\"126\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"515\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Partition 2</text>\n<text x=\"515\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Leader @B2</text>\n<rect x=\"442\" y=\"212\" width=\"58\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"471\" y=\"231\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">offset 0..n</text>\n<rect x=\"506\" y=\"212\" width=\"58\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"535\" y=\"231\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ISR 内</text>\n<text x=\"515\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Follower @B0/B1 同步</text>\n</svg>",
    "caption": "图 1：Broker/Topic/Partition/副本的层级关系"
   },
   {
    "t": "h",
    "text": "分区为什么是核心：顺序性与并行度"
   },
   {
    "t": "p",
    "text": "Kafka 只保证分区内有序：消息追加到同一个 Partition，消费者按 offset 顺序读，分区内天然有序。跨分区则没有全局顺序。生产端用 key 做分区路由，key 相同的消息进同一分区（默认 key 哈希 % 分区数）。游戏服里用 playerId 当 key，同一玩家的日志永远进同一分区、按序消费——这就是'玩家获得钻石 → 消耗钻石'不会被乱序的根基。分区越多并行度越高（消费并行度上限 = 分区数），但也不是越多越好：文件句柄膨胀、元数据压力、端到端延迟上升。Topic 设计规范上有一条铁律：分区只能增不能减，扩容后 key 会重新路由，可能破坏顺序性，所以分区数要按峰值吞吐预留余量。"
   },
   {
    "t": "h",
    "text": "消费者组：组内互斥、组间广播"
   },
   {
    "t": "p",
    "text": "同一个消费者组内，一个分区同一时刻只能被一个消费者消费，这是分区级顺序性的前提；不同组之间互不影响、各消费各的全量消息。日志服集群部署 4 个实例组成一个 Group 消费日志 Topic（分区数 ≥ 4），互斥消费防重复；BI 服另起一个 Group 消费同一 Topic 做实时报表，与日志服写库互不干扰——这就是'一次生产、多方消费'的解耦价值。注意坑：消费者数量超过分区数时，多出来的实例闲置；想提速先扩分区再加消费者。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 创建 Topic：日志 Topic 按玩家维度保序，分区数按峰值吞吐预留\nkafka-topics.sh --bootstrap-server broker1:9092,broker2:9092,broker3:9092 \\\n  --create --topic player-log --partitions 48 --replication-factor 3 \\\n  --config min.insync.replicas=2 \\\n  --config retention.ms=604800000        # 保留 7 天\n\n# 查看分区与 ISR 状态\nkafka-topics.sh --bootstrap-server localhost:9092 \\\n  --describe --topic player-log\n# 输出含 Partition / Leader / Replicas / ISR 四列，ISR 缺副本即同步异常"
   },
   {
    "t": "h",
    "text": "Topic 设计规范（游戏服实战）"
   },
   {
    "t": "list",
    "items": [
     "命名规范：域.对象.动作，如 log.player.action、pay.order.created、gm.cmd.push，全小写、层级 2~3 段，便于 ACL 与监控过滤",
     "分区规划：分区数 = 目标消费并行度，按'峰值写入吞吐 / 单消费者实例速率'估算并预留 1~2 倍余量（日志 Topic 48~64 起步）",
     "副本因子：生产环境 replication.factor=3，配合 min.insync.replicas=2，容忍单 Broker 宕机不丢数据",
     "Topic 隔离：行为日志、经济流水、业务事件、GM 指令分 Topic，避免日志洪峰拖累支付事件消费",
     "保留策略：行为日志 1~7 天，经济流水按对账需求留 30 天，磁盘按'日增量 × 副本 × 保留天数'规划",
     "关掉 auto.create.topics：防止误写 Topic 名自动建出默认分区/副本的 Topic"
    ]
   },
   {
    "t": "pits",
    "items": [
     "把 Topic 说成存储单位：存储单位是 Partition，Topic 只是逻辑分类（'Topic 是名义，Partition 是本体'）",
     "说'消息只能被一个消费者消费'：漏掉组间广播——不同消费组各消费各的全量副本",
     "以为加消费者就能加速：并行度上限是分区数，N &gt; 分区数时实例闲置",
     "忽略 offset 概念：offset 是 Kafka 一切消费语义（顺序、重放、积压）的锚点",
     "分区数拍脑袋定：要么预留不足后期扩容破坏顺序，要么过多增加元数据压力"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Kafka 是分区日志模型，Topic 是逻辑分类、Partition 是存储与并行单位、Replica 保高可用、ISR 保可靠；分区内有序是唯一顺序保证；消费者组'组内互斥、组间广播'。下一篇从生产者视角讲消息怎么发出去。"
   }
  ]
 },
 {
  "id": "mq-kafka-producer",
  "title": "Kafka 生产者深入",
  "layer": 1,
  "depends": [
   "mq-kafka-architecture"
  ],
  "covers": [
   "mq-04",
   "mq-05",
   "mq-23"
  ],
  "quiz": [
   "mq-04"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Producer 是'主线程攒批 + Sender 线程发批'的双线程异步模型：可靠性由 acks 决定，性能由 batch/linger/压缩决定，语义由幂等与事务兜底。吃透这几个旋钮，日志服上报 SDK 和支付事件两个极端场景的配置就能信手拈来。"
   },
   {
    "t": "pre",
    "items": [
     "理解分区与 key 路由（见架构篇）",
     "会写 Java 异步回调（Callback 接口）",
     "了解 TCP 连接、序列化、压缩这些基础概念"
    ]
   },
   {
    "t": "h",
    "text": "一条消息的完整发送流程"
   },
   {
    "t": "p",
    "text": "调用 producer.send() 后，消息依次经过：① 拦截器（可选，做埋点/脱敏）→ ② 序列化器（key/value 按配置序列化）→ ③ 分区器（有 key 走哈希路由，无 key 走粘性分区/轮询）→ ④ 进入 RecordAccumulator 里对应'Broker-分区'的双端队列攒批 → ⑤ Sender 线程（后台单线程）轮询：把攒满 batch.size 或等待超过 linger.ms 的批次封装成 ProduceRequest 发给对应 Broker → ⑥ 收到响应后按 partition 顺序执行回调，失败按 retries 重试。理解关键：send() 只负责把消息放进本地缓冲（内存），真正的网络发送由 Sender 线程异步完成，所以 send 返回值不能代表发送成功，必须以回调为准。这就是'fire-and-forget 丢消息'的根源。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Producer 发送流水线（双线程模型）</text>\n<rect x=\"20\" y=\"45\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"80\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">拦截器</text>\n<text x=\"80\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">埋点/脱敏</text>\n<rect x=\"160\" y=\"45\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"220\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">序列化器</text>\n<text x=\"220\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">key/value 序列化</text>\n<rect x=\"300\" y=\"45\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"360\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">分区器</text>\n<text x=\"360\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">key 哈希/粘性</text>\n<rect x=\"440\" y=\"45\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"530\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">RecordAccumulator</text>\n<text x=\"530\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">攒批缓冲（内存）</text>\n<path d=\"M140 73 L160 73\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#pa1)\"/>\n<path d=\"M280 73 L300 73\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#pa1)\"/>\n<path d=\"M420 73 L440 73\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#pa1)\"/>\n<defs><marker id=\"pa1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<text x=\"320\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">主线程 send() 只进缓冲（攒批），不直接发网络</text>\n<rect x=\"440\" y=\"140\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"530\" y=\"161\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Sender 线程</text>\n<text x=\"530\" y=\"181\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">攒满 batch / 超 linger 就发</text>\n<path d=\"M530 101 L530 140\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#pa2)\"/>\n<defs><marker id=\"pa2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"440\" y=\"220\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"530\" y=\"241\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker 分区 Leader</text>\n<text x=\"530\" y=\"261\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按 acks 等确认 → 触发回调</text>\n<path d=\"M530 196 L530 220\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#pa3)\"/>\n<defs><marker id=\"pa3\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<rect x=\"20\" y=\"220\" width=\"390\" height=\"56\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"215\" y=\"241\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">回调（Callback）才是发送结果的唯一权威</text>\n<text x=\"215\" y=\"261\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">失败时落本地兜底表/告警，绝不用 fire-and-forget</text>\n</svg>",
    "caption": "图 1：Producer 发送流水线与双线程模型"
   },
   {
    "t": "h",
    "text": "acks 三档：可靠性开关"
   },
   {
    "t": "table",
    "head": [
     "acks",
     "等谁确认",
     "可靠性边界",
     "延迟",
     "游戏场景"
    ],
    "rows": [
     [
      "0",
      "不等任何确认，发出即返回",
      "Broker 宕机/网络丢包即丢",
      "最低",
      "可丢弃的采样埋点（严禁用于资金类）"
     ],
     [
      "1",
      "等 Leader 写入本地日志",
      "Leader 宕机且 Follower 未同步时丢",
      "中",
      "行为日志（可容忍少量丢失）"
     ],
     [
      "all(-1)",
      "等 ISR 全部副本确认",
      "配合 min.insync.replicas=2 才算保险",
      "略高",
      "支付/经济流水，宁可慢不能丢"
     ]
    ]
   },
   {
    "t": "p",
    "text": "acks 决定'生产者要等多少副本确认才算发送成功'。acks=all 并不意味着绝对不丢：它等的是'当前 ISR 里所有副本'，如果 ISR 收缩到只剩 Leader（比如 Follower 全部掉队），all 就退化成单副本确认，Leader 一挂就丢。所以必须搭配 Broker/Topic 级配置 min.insync.replicas=2：ISR 不足 2 个时写入直接报 NotEnoughReplicas，宁可写不进去（可用性换一致性）也不接受单副本写入。注意 unverified 标注：min.insync.replicas 默认值是 1，生产环境显式配 2 已经是社区公认做法；acks 与 min.insync.replicas 的组合语义已在 Kafka 官方文档确认。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">acks=all 但 min.insync.replicas=1 时为什么仍会丢</text>\n<rect x=\"30\" y=\"45\" width=\"180\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker A（Leader）</text>\n<text x=\"120\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">ISR = {A}</text>\n<text x=\"120\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Follower B/C 掉队被踢</text>\n<text x=\"120\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">acks=all → 只等 A 确认</text>\n<text x=\"120\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">= 退化成 acks=1</text>\n<rect x=\"240\" y=\"45\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker B（Follower）</text>\n<text x=\"325\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">落后 &gt; replica.lag</text>\n<text x=\"325\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">被踢出 ISR</text>\n<text x=\"325\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">消息未同步</text>\n<rect x=\"440\" y=\"45\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker C（Follower）</text>\n<text x=\"525\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">宕机/GC 卡顿</text>\n<text x=\"525\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">消息未同步</text>\n<path d=\"M210 100 L240 100\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/>\n<path d=\"M210 100 L440 100\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/>\n<rect x=\"30\" y=\"180\" width=\"580\" height=\"50\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Leader 宕机 → 数据未复制到任何 Follower → 消息丢失</text>\n<text x=\"320\" y=\"222\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">对策：min.insync.replicas=2，ISR 不足时报错，等副本恢复再写入</text>\n</svg>",
    "caption": "图 2：acks=all 失效场景与 min.insync.replicas 兜底"
   },
   {
    "t": "h",
    "text": "幂等生产者与事务"
   },
   {
    "t": "p",
    "text": "重试（retries）可能带来两个问题：同一条消息被重复写入 Broker，以及前一批失败重试时后一批先到造成的乱序。幂等生产者（enable.idempotence=true，Kafka 3.0 起默认开启）解决前者：Broker 为每个 Producer 分配 PID，每条消息携带分区级递增序列号，Broker 按（PID，分区，序列号）去重，重复序列号直接丢弃并返回成功。幂等只能在'单分区、单 Producer 会话'内保证不重复——跨分区、跨会话（Producer 重启 PID 变化）管不住；消费端重复消费也不归它管。要跨分区原子写 + 把消费 offset 提交也纳入原子单元，需要 Kafka 事务（transactional.id + initTransactions/beginTransaction/sendOffsetsToTransaction/commitTransaction），那是 kafka-transactions 级别的深水区。开启幂等后 max.in.flight.requests.per.connection 被强制 ≤5 且保证顺序，这也顺带解决了重试乱序。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 日志服上报 SDK：高吞吐 + 可安全重试（丢少量日志可容忍）\nProperties props = new Properties();\nprops.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, \"broker1:9092,broker2:9092,broker3:9092\");\nprops.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);\nprops.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);\nprops.put(ProducerConfig.ACKS_CONFIG, \"1\");                       // 行为日志：Leader 确认即可\nprops.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);        // 幂等：重试不重复\nprops.put(ProducerConfig.LINGER_MS_CONFIG, 10);                   // 攒 10ms，显著提吞吐\nprops.put(ProducerConfig.BATCH_SIZE_CONFIG, 65536);               // 批次目标 64KB\nprops.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, \"lz4\");        // 按批次压缩，CPU 换带宽\nprops.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 64 * 1024 * 1024); // 缓冲 64MB\nprops.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);\nKafkaProducer<String, String> producer = new KafkaProducer<>(props);\n\n// 带回调发送：失败必须可见，绝不用 fire-and-forget\nproducer.send(new ProducerRecord<>(\"player-log\", playerId, json),\n    (metadata, ex) -> {\n        if (ex != null) {\n            // 失败处理：落本地兜底表/计数告警，支付事件必须补偿重发\n            fallbackStore.save(msg); // 本地消息表，定时重扫重发\n        }\n    });\n\n// 支付服：延迟敏感 + 必须不丢\n// ACKS=all + min.insync.replicas=2（Broker 配）+ 幂等 + retries 拉满\n// LINGER_MS=0、BATCH_SIZE 默认即可，牺牲吞吐保延迟与可靠"
   },
   {
    "t": "h",
    "text": "分区策略与批量压缩参数"
   },
   {
    "t": "p",
    "text": "分区器决定消息进哪个分区：有 key 时默认 key.hashCode() % 分区数（同 key 同分区，保序基础）；无 key 时 3.0+ 默认粘性分区（Sticky），攒批期间粘住一个分区提升批次效率，批次轮换时才切换；轮询（RoundRobin）是无 key 的旧默认，均匀但不保序。批量压缩以批次为单位生效：gzip/snappy/lz4/zstd 四种，日志场景几乎必开，CPU 换带宽。关键参数：batch.size（默认 16KB）是单批字节上限，攒满立即发；linger.ms（默认 0）是没攒满也愿意等的窗口，日志高吞吐场景 5~20ms；buffer.memory（默认 32MB）是总缓冲，攒批打满后 send() 阻塞，超过 max.block.ms 抛异常——生产速率持续大于发送速率就会打满，这是 Producer 阻塞告警的根因。"
   },
   {
    "t": "h",
    "text": "消息大小限制"
   },
   {
    "t": "p",
    "text": "Kafka 对单条消息有默认上限：Broker 侧 message.max.bytes（默认约 1MB，1000012 字节），Topic 可覆盖为 max.message.bytes；Producer 侧 max.request.size（默认 1MB）限制单请求字节数；Consumer 侧 fetch.max.bytes（默认 50MB）限制单次拉取总量。游戏服上报的日志通常只有几十~几百字节，但如果要传输图片/录像片段这类大消息，需要显式调大四处的对应参数，且注意'消息越大，Kafka 攒批吞吐下降越明显'——超大数据建议拆分或对象存储 + 消息带引用，而不是硬塞进 Kafka。"
   },
   {
    "t": "pits",
    "items": [
     "用 acks=0 或 1 发支付事件：资金类消息必须 acks=all + min.insync.replicas=2 + 幂等",
     "send() 不传回调且不检查返回：fire-and-forget 是线上丢消息的第一大来源",
     "把幂等生产者说成 exactly-once：它只解决单分区单会话的重试重复，跨分区/跨会话/消费端重复都不管",
     "linger.ms 调到 100ms+ 追求吞吐，导致活动事件延迟不可接受：吞吐与延迟是跷跷板",
     "忽略 buffer.memory 打满的背压信号：持续打满说明发送速率跟不上，先查 Broker 与网络再降级/落盘"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Producer 双线程攒批模型决定性能，acks 决定可靠性（all 必须配 min.insync.replicas=2 才保险），幂等解决重试重复，事务才能跨分区原子；日志 SDK 高吞吐、支付事件高可靠两套配置要能脱口而出。下一篇进入消费者视角。"
   }
  ]
 },
 {
  "id": "mq-kafka-consumer",
  "title": "Kafka 消费者深入",
  "layer": 1,
  "depends": [
   "mq-kafka-architecture"
  ],
  "covers": [
   "mq-06",
   "mq-11",
   "mq-32",
   "mq-34"
  ],
  "quiz": [
   "mq-11"
  ],
  "body": [
   {
    "t": "lead",
    "text": "消费者是'拉模式 + 手动提交'的主动消费者：pull 让消费速率由自己掌控（天然背压），组的协调与重平衡决定消费稳定性，offset 提交时机决定'丢'与'重'的边界。日志服与支付服消费端的全部工程细节都在这三件事上。"
   },
   {
    "t": "pre",
    "items": [
     "理解分区、消费者组、offset 概念（架构篇）",
     "理解 at-least-once / at-most-once 投递语义（可靠性篇有展开，这里先了解概念）",
     "会写 Java 的 while 循环 + 回调"
    ]
   },
   {
    "t": "h",
    "text": "消费模型：为什么是 pull 而不是 push"
   },
   {
    "t": "p",
    "text": "Kafka 消费者主动 poll 拉取数据，而不是 Broker 推送。好处有三：一是背压自控——消费者按自己的能力批量拉取，下游 MySQL 慢就少拉，Broker 不会被'推给慢消费者'拖垮，游戏服生产洪峰、日志服匀速消费的削峰模型正依赖这一点；二是批量友好——一次 poll 拉一批消息，摊薄 RPC 开销；三是 Broker 简单——不用维护'每条消息已推给谁、确认没有'的状态机，按 offset 读日志即可。对照 push 模式：偏 push 的模型低延迟、路由复杂场景有优势，但消费端必须靠 prefetch 类流控做背压，Broker 要为每条消息维护投递与确认状态。面试常问：消费速率到底谁说了算？Kafka 的答案是消费者自己。"
   },
   {
    "t": "h",
    "text": "消费循环与 offset 提交时机"
   },
   {
    "t": "p",
    "text": "消费端铁律是'业务事务提交成功之后，再提交 offset'。offset 默认存在内部 Topic __consumer_offsets（默认 50 分区，按 group+topic+partition 哈希定位，由 Group Coordinator 负责），本质是把消费进度也做成 Kafka 日志，靠 Log Compaction 只保留每组最新位点。提交方式：enable.auto.commit=true 自动提交（默认，每 auto.commit.interval.ms=5000ms 提交已 poll 到的最大 offset）——但自动提交是'先提交后处理'的隐患温床，处理失败时消息已提交就丢了（at-most-once）。生产环境用 enable.auto.commit=false 手动提交：commitSync 阻塞且失败会重试（稳但慢，重平衡前兜底用）；commitAsync 不阻塞不重试（快，但极端情况下旧位点可能覆盖新位点导致重放）。实战组合：平时 commitAsync，在 ConsumerRebalanceListener.onPartitionsRevoked 里 sync 兜底提交。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 日志服消费端：批量拉取 → 批量写库 → 成功才提交（at-least-once）\nProperties props = new Properties();\nprops.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, \"broker1:9092,broker2:9092\");\nprops.put(ConsumerConfig.GROUP_ID_CONFIG, \"log-service\");\nprops.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);\nprops.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);\nprops.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);        // 关键：关自动提交\nprops.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, \"latest\");\nprops.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 500);           // 单批 500 条\nprops.put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, 300000);    // 处理超时保护\nKafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);\nconsumer.subscribe(Collections.singletonList(\"player-log\"));\n\nwhile (running) {\n    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));\n    // 批量聚合后 insert into 报表表（单事务）\n    try {\n        logBatchSink.insertBatch(records);   // 写 MySQL 成功\n        consumer.commitSync();                // 再提交，绝不颠倒顺序\n    } catch (Exception e) {\n        // 不提交：下轮 poll 重放整批，靠幂等键（report_id 唯一索引）兜底\n        logger.error(\"写库失败，等待重放\", e);\n    }\n}\n// 注意：单批处理耗时必须 &lt; max.poll.interval.ms，否则被踢出组触发重平衡"
   },
   {
    "t": "h",
    "text": "重平衡（Rebalance）：全组停消费的代价"
   },
   {
    "t": "p",
    "text": "重平衡是消费者组成员变化时分区所有权的重新分配，传统 Eager 协议下整个 Group 停止消费（stop-the-world），日志服消费 Lag 瞬间上涨。触发条件有三类：成员加入/退出（上线、宕机、session.timeout.ms 心跳超时）、订阅 Topic 分区数变化、处理超时（max.poll.interval.ms 内没 poll 被视为失联踢出）。优化三板斧：一是别超时——单批处理耗时必须小于 max.poll.interval.ms，批量大就调小 max.poll.records 或异步处理（注意异步处理与 offset 提交的一致性）；二是心跳配套——heartbeat.interval.ms 约为 session.timeout.ms 的三分之一；三是减重平衡——静态成员（group.instance.id，Kafka 2.3+）让实例重启走'临时离开'不触发重平衡；分区分配策略用 CooperativeStickyAssignor（2.4+），增量式重平衡只动需要动的分区。日志服滚动发布逐台重启实例时，'静态成员 + CooperativeSticky'可以把影响降到接近零。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">重平衡的触发与影响</text>\n<rect x=\"30\" y=\"45\" width=\"180\" height=\"118\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三类触发条件</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">① 成员进出（宕机/心跳超时）</text>\n<text x=\"120\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">② 分区数变化（扩容）</text>\n<text x=\"120\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">③ 处理超时被踢（poll 间隔 &gt; max.poll.interval.ms）</text>\n<text x=\"120\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">session 超时 = 心跳失联；poll 超时 = 处理太慢</text>\n<rect x=\"250\" y=\"45\" width=\"360\" height=\"118\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"430\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">影响：stop-the-world</text>\n<text x=\"430\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">全组暂停消费 → Lag 上涨</text>\n<text x=\"430\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">分区易主 → 未提交位点重放 → 重复消费</text>\n<text x=\"430\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">频繁重平衡 = 消费抖动 + 重复</text>\n<text x=\"430\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">滚动发布逐台重启是重平衡高发场景</text>\n<path d=\"M210 104 L250 104\" stroke=\"var(--lv3)\" stroke-width=\"2.5\" marker-end=\"url(#cb1)\"/>\n<defs><marker id=\"cb1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n<rect x=\"30\" y=\"180\" width=\"580\" height=\"100\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">优化三板斧</text>\n<rect x=\"45\" y=\"216\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"135\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">① 不超时：单批耗时 &lt;</text>\n<text x=\"135\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">max.poll.interval.ms</text>\n<rect x=\"235\" y=\"216\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">② 心跳配套：heartbeat ≈</text>\n<text x=\"325\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">session/3</text>\n<rect x=\"425\" y=\"216\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"515\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">③ 静态成员 + Cooperative</text>\n<text x=\"515\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Sticky 增量重平衡</text>\n</svg>",
    "caption": "图 1：重平衡触发条件、影响与优化三板斧"
   },
   {
    "t": "h",
    "text": "顺序消费与消费堆积的初步认识"
   },
   {
    "t": "p",
    "text": "顺序性：同一分区同一时刻只归组内一个消费者，分区内按 offset 顺序处理即保序；单消费者内如果开多线程并行处理一个分区，顺序就没了——要保序就别在分区内开并行。堆积（Lag）就是'分区最新 offset 与消费提交 offset 的差值'，反映消费速度跟不上生产速度。常见原因：生产太快、消费太慢（下游 MySQL 是常见真瓶颈）、消费逻辑卡死、频繁重平衡、单分区数据倾斜。堆积治理是独立的实战篇，这里先建立'Lag 是消费健康度的核心指标'的认知，以及'先看趋势再看瓶颈、并行度上限是分区数、下游提速才是根治'的排查框架。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">分区消费状态与 Lag 定义</text>\n<rect x=\"40\" y=\"60\" width=\"560\" height=\"34\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">分区日志（offset 0 → N，追加有序）</text>\n<rect x=\"50\" y=\"60\" width=\"300\" height=\"34\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"200\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">已消费并提交区域</text>\n<rect x=\"350\" y=\"60\" width=\"120\" height=\"34\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"410\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\" font-weight=\"bold\">Lag 待消费</text>\n<rect x=\"470\" y=\"60\" width=\"130\" height=\"34\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">未生产区域</text>\n<text x=\"200\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">committed offset（已提交位点）</text>\n<text x=\"410\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">current offset（分区最新位点）</text>\n<rect x=\"40\" y=\"150\" width=\"560\" height=\"90\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Lag = current offset − committed offset</text>\n<text x=\"320\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Lag 持续上涨 → 消费慢于生产；稳定 → 消费速率等于生产速率</text>\n<text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">排查顺序：看趋势 → 找瓶颈（消费者 CPU/下游 MySQL/重平衡）→ 对症处理</text>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">并行度上限 = 分区数；加消费者不加分区 = 实例闲置</text>\n</svg>",
    "caption": "图 2：Lag 的定义与消费健康度认知"
   },
   {
    "t": "pits",
    "items": [
     "开自动提交偷懒：先提交后处理，处理失败消息就丢了（at-most-once），支付事件这是资损事故",
     "处理耗时超过 max.poll.interval.ms（默认 5 分钟）：消费者被踢出组，触发重平衡 + 重复消费，GC 卡顿尤其要防",
     "以为 commitAsync 会自动重试：它失败静默，极端情况下旧位点覆盖新位点导致重放，要配合关闭前的 sync 兜底",
     "消费者开多线程并行消费同一个分区：分区顺序性瞬间被破坏",
     "把 session 超时与 poll 超时混为一谈：前者是心跳失联（Broker 侧判定），后者是处理太慢（应用侧判定），排查方向完全不同"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：pull 模型让消费速率自控；offset 提交遵循'业务成功后才提交'铁律，自动提交是丢消息温床；重平衡是全组停消费的代价，用静态成员 + CooperativeSticky 减震；Lag 是消费健康度核心指标。下一篇深入存储机制，理解 Kafka 为什么快。"
   }
  ]
 },
 {
  "id": "mq-kafka-storage",
  "title": "Kafka 存储机制",
  "layer": 1,
  "depends": [
   "mq-kafka-architecture"
  ],
  "covers": [
   "mq-02",
   "mq-19",
   "mq-33"
  ],
  "quiz": [
   "mq-19"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Kafka 快不是魔法，是'顺序写 + 页缓存 + 零拷贝 + 批量'四项 IO 优化，外加'分段日志 + 稀疏索引'把查找和清理都变成廉价操作。面试问'Kafka 为什么快'，本质是在问这四项背后省掉了什么成本。"
   },
   {
    "t": "pre",
    "items": [
     "操作系统基础：页缓存（PageCache）、DMA、上下文切换",
     "磁盘 IO 特性：顺序写吞吐远高于随机写",
     "理解分区与 offset（架构篇）"
    ]
   },
   {
    "t": "h",
    "text": "分区 = 追加写的日志，日志 = 多个 Segment 段"
   },
   {
    "t": "p",
    "text": "每个 Partition 在磁盘上是独立目录（如 topic-0/），目录里是一组 Segment 段文件。消息只追加写入当前活跃段（active segment）的末尾，永不修改已有数据——这是'顺序写'的前提。段按大小（log.segment.bytes，默认 1GB）或时间（log.roll.ms）滚动，滚动后的段变成只读，等待被清理。每段有三个配套文件：.log（消息数据）、.index（offset → 物理位置的稀疏索引）、.timeindex（时间戳 → offset 的时间索引）。为什么分段？因为这样'清理'可以按整段删除文件，'查找'可以先用文件名（段起始 offset）二分定位到段。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Partition 目录：Segment 分段 + 稀疏索引</text>\n<rect x=\"30\" y=\"45\" width=\"170\" height=\"150\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">player-log-0/ 目录</text>\n<text x=\"115\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">00000000000000000000.log</text>\n<text x=\"115\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">00000000000000000000.index</text>\n<text x=\"115\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">00000000000000000000.timeindex</text>\n<text x=\"115\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">… 更多历史段（只读）…</text>\n<text x=\"115\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">最新段 = 活跃段（可写）</text>\n<rect x=\"230\" y=\"45\" width=\"380\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Segment 内部结构（活跃段）</text>\n<rect x=\"245\" y=\"82\" width=\"350\" height=\"28\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">消息0 | 消息1 | 消息2 | … | 消息n（顺序追加，只增不改）</text>\n<rect x=\"245\" y=\"118\" width=\"350\" height=\"28\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">.index 稀疏索引：每 4KB 记一条（相对 offset → 物理位置）</text>\n<rect x=\"245\" y=\"154\" width=\"350\" height=\"28\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">.timeindex 时间索引：按时间戳定位</text>\n<rect x=\"30\" y=\"215\" width=\"580\" height=\"66\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">查找流程：段名二分定位 → 稀疏索引二分 → 段内小范围顺序扫</text>\n<text x=\"320\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">稀疏索引小到能常驻内存，避免全量索引的内存开销；相对 offset 定长 4 字节才能二分</text>\n<text x=\"320\" y=\"276\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">清理 = 整段删除文件（时间/大小策略），compact = 按 key 保留最新值</text>\n</svg>",
    "caption": "图 1：Segment 分段结构与稀疏索引查找"
   },
   {
    "t": "h",
    "text": "稀疏索引与查找流程"
   },
   {
    "t": "p",
    "text": "索引是稀疏的：每 4KB 数据（约几条~几十条消息）才记一条索引项，而不是每条消息都建索引。稀疏的好处是索引文件小（能常驻内存）、写索引开销低；代价是定位后还要在段内顺序扫描一小段。查找消息按 offset 分三步：先按段文件名（段起始 offset 递增）二分定位到段 → 在 .index 里二分定位到不大于目标 offset 的最近索引项 → 从该物理位置顺序扫描到目标消息。为什么索引用'相对 offset'？因为段内偏移量（段起始 offset 到末尾）用 4 字节定长整数就能表示，索引项定长才能二分查找——这是设计细节里的加分点。时间戳索引同理，用于按时间戳回溯消费。"
   },
   {
    "t": "h",
    "text": "页缓存与刷盘策略：可靠靠副本，不靠刷盘"
   },
   {
    "t": "p",
    "text": "Kafka 写消息时并不直接刷盘，而是把数据写进操作系统的页缓存（PageCache）就返回（acks=1 时 Leader 写页缓存即确认）。Broker 不维护应用层缓存，热数据都在页缓存里，内存越多命中越高；进程重启页缓存不丢（OS 还在管），但机器断电页缓存里的未刷盘数据会丢。刷盘由 OS 后台完成（log.flush.interval.messages/ms 默认不设置，完全交给 OS）。为什么敢不刷盘？因为可靠性靠多副本：acks=all + min.insync.replicas=2 保证至少两个副本都写入了（都进了各自页缓存），单机断电另一副本顶上。这与 MySQL 的单节点刷盘保可靠思路本质不同——用副本换可靠，用顺序 IO 换吞吐，是 Kafka 的设计哲学。面试加分点：讲清楚'为什么靠副本不靠刷盘'，说明读懂了 Kafka 的设计取舍。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">写路径：进页缓存即返回；读路径：页缓存直达网卡</text>\n<rect x=\"30\" y=\"45\" width=\"200\" height=\"120\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"130\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Producer 写入</text>\n<text x=\"130\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">1. 顺序追加日志</text>\n<text x=\"130\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">2. 写进 OS 页缓存</text>\n<text x=\"130\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">3. acks=1：返回（不刷盘）</text>\n<text x=\"130\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">刷盘交给 OS 后台（异步）</text>\n<rect x=\"410\" y=\"45\" width=\"200\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"510\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Consumer 读取</text>\n<text x=\"510\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">1. 页缓存命中热数据</text>\n<text x=\"510\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">2. sendfile 零拷贝</text>\n<text x=\"510\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">3. 内核直发网卡</text>\n<text x=\"510\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不经 JVM 堆 → 不怕 GC</text>\n<rect x=\"250\" y=\"70\" width=\"140\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"94\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">OS 页缓存</text>\n<text x=\"320\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">PageCache</text>\n<text x=\"320\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数据的中转站</text>\n<path d=\"M230 105 L250 105\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#st1)\"/>\n<path d=\"M390 105 L410 105\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#st1)\"/>\n<defs><marker id=\"st1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"185\" width=\"580\" height=\"86\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"207\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">断电丢数据怎么办？靠多副本兜底，不靠刷盘</text>\n<text x=\"320\" y=\"229\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">acks=all + min.insync.replicas=2：至少 2 副本写入才算成功</text>\n<text x=\"320\" y=\"249\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单机断电 → 另一副本顶上；只有 ISR 全灭且开 unclean 选举才真丢</text>\n<text x=\"320\" y=\"265\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">设计哲学：用副本换可靠，用顺序 IO 换吞吐</text>\n</svg>",
    "caption": "图 2：页缓存读写路径与'靠副本不靠刷盘'的可靠性设计"
   },
   {
    "t": "h",
    "text": "消息过期清理：Log Retention"
   },
   {
    "t": "p",
    "text": "Kafka 的消息不是无限保留的。清理策略（retention）：按时间（log.retention.hours 默认 168 小时 = 7 天）、按总大小（log.retention.bytes，默认 -1 不限）、或两者同时生效（先触发者为准）。清理以整个非活跃段为单位直接删文件——代价极低，这也是分段设计的另一大红利。注意语义：Kafka 的 retention 是'日志保留/磁盘回收'，不是'消息过期投递'，更不是消息级 TTL，这三者不能混用。另一种策略是 Log Compaction：按 key 只保留每个 key 的最新一条（__consumer_offsets 自己就是这么干的），适合'配置项、用户资料快照'这类按 key 保留最新值的场景；流水类日志绝不能开 compact，会丢历史明细。磁盘快满时的紧急手段也是缩短 retention 先腾空间。"
   },
   {
    "t": "h",
    "text": "为什么顺序写快：数字感受一下"
   },
   {
    "t": "p",
    "text": "传统机械磁盘顺序写吞吐可达 150~200MB/s，随机写（4KB 粒度）只有 1~2MB/s，差两个数量级；SSD 顺序写与随机写差距缩小但仍显著。Kafka 把'每条消息写一次磁盘'变成'攒批后一次大块顺序追加'，让磁盘工作在它最擅长的模式。配合页缓存：热数据读写都在内存完成，磁盘只在刷盘和段清理时被触及。这就是'把随机 IO 变顺序 IO，把用户态拷贝变内核直发'——四个字口诀：顺写、页缓、零拷、批。零拷贝（sendfile）的具体机制在性能调优篇展开。"
   },
   {
    "t": "pits",
    "items": [
     "把稀疏索引说成全量索引：每 4KB 才一条索引项，定位后还要段内小扫，这是'稀疏'的本义",
     "以为 Kafka 每条消息都刷盘：它靠 OS 页缓存 + 多副本保可靠，这是与 MySQL 单节点思路的本质区别",
     "把 retention 当消息级 TTL：retention 是磁盘回收策略（整段删除），不是'消息过期投递'，语义完全不同",
     "以为段删除是逐条删：删除是整段文件删除，代价极低；compact 是另一条按 key 保留最新的路径",
     "忽略相对 offset 的设计：4 字节定长才能让索引项定长、才能二分，这是常被追问的细节"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分区是追加日志，段是清理与查找的基本单位；稀疏索引 + 相对 offset 让查找 O(log n)；数据走页缓存不刷盘，可靠性交给多副本；retention 按段删除、语义是磁盘回收。下一篇讲副本与高可用，把 ISR/HW/LEO 讲透。"
   }
  ]
 },
 {
  "id": "mq-kafka-replication",
  "title": "Kafka 副本与高可用",
  "layer": 1,
  "depends": [
   "mq-kafka-architecture",
   "mq-kafka-storage"
  ],
  "covers": [
   "mq-21",
   "mq-24"
  ],
  "quiz": [
   "mq-21"
  ],
  "body": [
   {
    "t": "lead",
    "text": "副本机制是 Kafka 可靠性的地基：ISR 决定谁够格，HW 决定谁可见，Leader 选举决定谁接班，Controller 负责全场调度。可靠性配置的本质，就是约束这三个环节。"
   },
   {
    "t": "pre",
    "items": [
     "理解分区、offset、segment 段结构（架构与存储篇）",
     "理解 acks 与 min.insync.replicas 的关系（生产者篇）",
     "了解 ZooKeeper/KRaft 是协调组件"
    ]
   },
   {
    "t": "h",
    "text": "副本的角色：Leader 负责读写，Follower 负责复制"
   },
   {
    "t": "p",
    "text": "每个 Partition 有 replication.factor 个副本，其中一个 Leader 对外提供读写，其余 Follower 从 Leader 拉取数据（replica.fetch.max.bytes 控制单次拉取量）。为什么读写都走 Leader 而不做 MySQL 那种读写分离？因为要保证分区级顺序与一致性语义：读 Follower 会读到未同步数据、offset 语义混乱；Kafka 靠分区水平拆分扛并发，不需要读分流（2.10+ 的 follower fetching 仅供灾备就近读）。Follower 是'主动拉'而非'被推送'：持续向 Leader 发 FetchRequest，拉到的数据追加进自己的日志。Leader 宕机时，从 ISR 中选一个新 Leader 继续服务。"
   },
   {
    "t": "h",
    "text": "ISR：谁有资格当候选"
   },
   {
    "t": "p",
    "text": "ISR（In-Sync Replicas）是与 Leader 保持同步的副本集合。判定标准：Follower 在 replica.lag.time.max.ms（默认 30 秒）内持续拉取未落后，即认为同步。Follower 落后/失联超过阈值会被踢出 ISR（ISR 收缩），恢复后重新加入（ISR 扩张）。生产可靠性配置的组合逻辑：acks=all 等 ISR 全体确认，min.insync.replicas=2 保证 ISR 至少 2 个才接受写入——3 副本集群能容忍 1 台 Broker 宕机继续写；挂 2 台时 ISR 只剩 1 个，写入报 NotEnoughReplicas，分区只读不写（用可用性换一致性）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">LEO / HW 与 ISR 的关系</text>\n<rect x=\"30\" y=\"45\" width=\"580\" height=\"200\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Leader 副本（broker A）</text>\n<rect x=\"50\" y=\"82\" width=\"540\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"101\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">消息 | 消息 | 消息 | 消息 | 消息 | 消息 | 消息（LEO = 7）</text>\n<text x=\"340\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\" font-weight=\"bold\">HW = 4（ISR 最小 LEO）</text>\n<path d=\"M245 115 L245 130\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">消费者只能读到 HW 之前的消息（offset &lt; 4 可见）</text>\n<text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">HW 之后的消息 = 已写入但尚未被全部 ISR 确认，对消费者不可见</text>\n<rect x=\"50\" y=\"196\" width=\"540\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"215\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Follower B：同步到 offset 4（LEO = 4）→ 在 ISR 内</text>\n<rect x=\"30\" y=\"260\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"282\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">HW = ISR 中最小 LEO；LEO 是每个副本下一条待写 offset</text>\n<text x=\"320\" y=\"302\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只读已提交（HW 内）消息 → 保证消费者读到的数据一定在 ISR 内可恢复</text>\n</svg>",
    "caption": "图 1：HW/LEO 与 ISR 的关系（画时间轴是加分项）"
   },
   {
    "t": "h",
    "text": "HW（高水位）与 LEO：谁的消息可见"
   },
   {
    "t": "p",
    "text": "LEO（Log End Offset）是每个副本各自的下一条待写入 offset；HW（High Watermark）是 ISR 中最小 LEO——也就是'所有同步副本都已复制到的位置'。消费者只能读到 HW 之前的消息，保证'读到的都是已提交的'（ISR 内可恢复）。acks=all 配 min.insync.replicas=1 仍是假安全，之前已讲；unclean.leader.election 是另一个丢消息窗口：ISR 全灭时，允许选一个落后副本当 Leader（unclean.leader.election.enable=true）则集群可用但丢未同步消息，设为 false 则宁可分区不可用等原 Leader 回来。取舍：支付/订单类选 false（一致性优先），纯日志采集可评估 true（可用性优先）。加分细节：老版本 HW 截断机制会造成副本间数据不一致，Kafka 用 Leader Epoch（每次换届 epoch+1 记录 epoch→起始 offset）替代 HW 截断修复了这个问题。"
   },
   {
    "t": "h",
    "text": "Leader 选举与 Controller"
   },
   {
    "t": "p",
    "text": "分区 Leader 是副本间选出来的：优先从 ISR 中选（replica 顺序上排最前的优先），ISR 全灭才可能触发 unclean 选举。而'谁来主持选举'是集群级职责——Controller。Controller 是集群的大脑：管理分区 Leader 选举与故障转移（Broker 上下线时）、分区重分配、Topic 创建/删除，并把元数据变更推送给各 Broker。集群只有一个 Active Controller。ZK 模式下 Controller 靠抢 ZK 临时节点选出，分区数上十万级时 ZK 的 watch 与写入撑不住，且元数据两处维护（Controller 内存 + ZK）有视图不一致风险。KRaft（Kafka Raft，2.8 预览、3.3+ 生产可用）把元数据收编成内部日志 Topic __cluster_metadata，用 Raft 多数派在 Controller 节点间复制，去掉 ZK 依赖，分区规模上限提升到百万级——'元数据即日志，控制面与数据面用同一套复制哲学'是答 KRaft 的金句。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Broker 宕机后的 Leader 选举流程</text>\n<rect x=\"30\" y=\"45\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker A</text>\n<text x=\"120\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">宕机（Leader）</text>\n<text x=\"120\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">部分分区失去 Leader</text>\n<rect x=\"240\" y=\"45\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"330\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker B</text>\n<text x=\"330\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">ISR 内 → 当选新 Leader</text>\n<text x=\"330\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数据完整，不丢已提交消息</text>\n<rect x=\"450\" y=\"45\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"540\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker C</text>\n<text x=\"540\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Follower 继续复制</text>\n<text x=\"540\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">等待新 Leader 恢复同步</text>\n<path d=\"M210 80 L240 80\" stroke=\"var(--lv1)\" stroke-width=\"2.5\" marker-end=\"url(#rp1)\"/>\n<defs><marker id=\"rp1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<rect x=\"30\" y=\"140\" width=\"580\" height=\"130\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Controller：集群大脑</text>\n<rect x=\"45\" y=\"176\" width=\"175\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"132\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">分区 Leader 选举/故障转移</text>\n<text x=\"132\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Broker 上下线触发</text>\n<rect x=\"232\" y=\"176\" width=\"175\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">分区重分配 / Topic 管理</text>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">扩容缩容、迁移</text>\n<rect x=\"419\" y=\"176\" width=\"175\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"507\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">元数据推送</text>\n<text x=\"507\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">向各 Broker 广播变更</text>\n<text x=\"320\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">KRaft：元数据入内部日志 __cluster_metadata，Raft 多数派复制，去掉 ZK</text>\n</svg>",
    "caption": "图 2：Leader 选举与 Controller 职责"
   },
   {
    "t": "h",
    "text": "副本分配与集群扩缩容"
   },
   {
    "t": "p",
    "text": "创建 Topic 时副本默认均匀分布到不同 Broker（kafka-reassign-partitions 手动控制），开启 rack 感知可把副本分散到不同机架/机房。扩容（加 Broker）：新 Broker 只接管新建分区的 Leader；老分区的数据要迁移才均衡，用 kafka-reassign-partitions 触发分区重分配，本质是复制数据（吃网络与磁盘带宽，要限速）。缩容（减 Broker）：先把其上 Leader 迁走、副本挪到其他节点，再下线节点。注意副本数不是越多越好：复制流量翻倍、Follower 拉取开销上升、Broker 宕机时 ISR 收缩窗口变长；3 副本是生产主流，极端可靠性才 5 副本。所有扩缩容操作都要盯着 UnderReplicatedPartitions 指标——它归零才算真正完成。"
   },
   {
    "t": "pits",
    "items": [
     "说 acks=all 就绝对不丢：ISR 收缩到只剩 Leader 时退化成单副本，必须配 min.insync.replicas=2",
     "unclean.leader.election 开与不开不说明取舍：这是'一致性优先（禁）还是可用性优先（开）'的经典二选一，支付禁开",
     "把 HW 说成'每个副本的进度'：HW 是 ISR 最小 LEO，是'已提交'的边界；LEO 才是各副本自身进度",
     "忘掉 Leader Epoch：老版本按 HW 截断会导致副本数据不一致，Leader Epoch 是修复手段，答出来是深水区加分项",
     "扩缩容不看 UnderReplicatedPartitions：复制未完成就认为扩容完成，实际可靠性是降级的"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Leader 读写、Follower 复制，ISR 定资格（落后超过 replica.lag.time.max.ms 即踢出）、HW 定可见边界（ISR 最小 LEO）、unclean 选举定取舍；Controller 是大脑，KRaft 把元数据收编为内部日志。下一篇综合性能与调优。"
   }
  ]
 },
 {
  "id": "mq-kafka-performance",
  "title": "Kafka 性能与调优",
  "layer": 2,
  "depends": [
   "mq-kafka-producer",
   "mq-kafka-consumer",
   "mq-kafka-storage"
  ],
  "covers": [
   "mq-02",
   "mq-23"
  ],
  "quiz": [
   "mq-02"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Kafka 调优的本质是'把随机 IO 变顺序 IO、把 CPU 拷贝交给内核、把网络往返摊薄'，然后在吞吐与延迟之间找到业务可接受的平衡点。日志服要吞吐，支付服要低延迟，一套参数打天下的都翻过车。"
   },
   {
    "t": "pre",
    "items": [
     "理解生产者攒批参数（batch.size/linger.ms/buffer.memory）",
     "理解存储层页缓存与段结构",
     "理解消费端 poll 循环与批量拉取"
    ]
   },
   {
    "t": "h",
    "text": "四大 IO 优化：高吞吐的支柱"
   },
   {
    "t": "p",
    "text": "一是顺序写：消息追加写日志段末尾，磁盘顺序写吞吐可媲美内存随机写；二是页缓存：直接读写 OS 页缓存，不维护应用层缓存，避免 JVM GC 压力，Broker 重启缓存不丢；三是零拷贝（sendfile）：消费时数据从页缓存经内核直发网卡，跳过'内核→用户态→内核'的两次拷贝和上下文切换；四是批量：Producer 攒批发送、Consumer 批量拉取、批量压缩（gzip/snappy/lz4/zstd）摊薄网络与 IO 开销。四个字口诀：顺写、页缓、零拷、批。面试官常追一句：零拷贝到底省了哪几次拷贝？传统 read+write 共 4 次拷贝 + 4 次上下文切换，sendfile 省掉中间'页缓存→用户缓冲→socket 缓冲'两次 CPU 拷贝和两次上下文切换，只剩两次 DMA 拷贝（配合 scatter-gather 网卡）。注意：开启 SSL 加密后零拷贝不生效——加解密必须在用户态做，数据被迫拷进用户空间，这是开 SSL 后 Broker CPU 上涨的主因。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">传统路径 vs sendfile 零拷贝</text>\n<rect x=\"30\" y=\"45\" width=\"285\" height=\"190\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"172\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">传统 read + write（4 次拷贝）</text>\n<rect x=\"45\" y=\"82\" width=\"250\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"170\" y=\"101\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">① DMA：磁盘 → 页缓存</text>\n<rect x=\"45\" y=\"118\" width=\"250\" height=\"30\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.2\"/>\n<text x=\"170\" y=\"137\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">② CPU：页缓存 → 用户缓冲</text>\n<rect x=\"45\" y=\"154\" width=\"250\" height=\"30\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.2\"/>\n<text x=\"170\" y=\"173\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">③ CPU：用户缓冲 → socket 缓冲</text>\n<rect x=\"45\" y=\"190\" width=\"250\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"170\" y=\"209\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">④ DMA：socket 缓冲 → 网卡</text>\n<rect x=\"330\" y=\"45\" width=\"280\" height=\"190\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">sendfile（零拷贝）</text>\n<rect x=\"345\" y=\"82\" width=\"250\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"470\" y=\"101\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">① DMA：磁盘 → 页缓存</text>\n<rect x=\"345\" y=\"118\" width=\"250\" height=\"30\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"137\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">② 内核态直接发送（CPU 零拷贝）</text>\n<rect x=\"345\" y=\"154\" width=\"250\" height=\"30\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"470\" y=\"173\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">③ DMA：页缓存 → 网卡</text>\n<text x=\"470\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">省掉 2 次 CPU 拷贝 + 2 次上下文切换</text>\n<text x=\"470\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">SSL 开启 → 必须用户态加解密 → 零拷贝失效</text>\n</svg>",
    "caption": "图 1：sendfile 与传统 read+write 路径对比"
   },
   {
    "t": "h",
    "text": "分区数与吞吐：并行度不是越多越好"
   },
   {
    "t": "p",
    "text": "分区数是 Kafka 并行度的上限：消费并行度 = 分区数，生产端也会因分区多而把并发分散到不同 Leader。估算公式：目标吞吐 / 单分区吞吐。但分区不是越多越好：每个分区要一组文件句柄与索引、元数据要广播、Leader 选举变多、端到端延迟上升（Follower 复制 1000 分区要 20ms 量级）。社区经验：分区总数几千以内常见，上十万就要靠 KRaft 撑元数据。调优原则：按峰值吞吐估算并预留 1~2 倍余量，宁可多一点预留，也不要后期临时扩容破坏 key 路由顺序性。"
   },
   {
    "t": "h",
    "text": "生产者端调优：吞吐与延迟的旋钮"
   },
   {
    "t": "table",
    "head": [
     "参数",
     "默认",
     "调大",
     "调小"
    ],
    "rows": [
     [
      "batch.size",
      "16KB",
      "吞吐↑（批次更大）",
      "延迟↓、内存占用↓"
     ],
     [
      "linger.ms",
      "0",
      "吞吐↑↑（攒批窗口）",
      "延迟↓↓（即时发）"
     ],
     [
      "buffer.memory",
      "32MB",
      "抗突发更稳",
      "背压反馈更快"
     ],
     [
      "max.in.flight.requests",
      "5",
      "并发↑（幂等下仍有序）",
      "更保守、吞吐↓"
     ],
     [
      "compression.type",
      "none",
      "gzip 压缩率高但 CPU 高",
      "lz4/zstd 折中，必开"
     ]
    ]
   },
   {
    "t": "p",
    "text": "日志服上报 SDK 的典型高吞吐配置：linger.ms=10 + batch.size=64KB + lz4 + acks=1 + 幂等开启。支付事件低延迟配置：linger.ms=0、acks=all、batch 默认、幂等 + retries 拉满。buffer.memory 打满的背压信号要特别警惕：send() 阻塞超过 max.block.ms（默认 60 秒）抛 TimeoutException，说明生产速率持续大于发送能力，要先查 Broker 负载与网络，而不是无限加大缓冲掩盖问题。"
   },
   {
    "t": "h",
    "text": "消费者端调优"
   },
   {
    "t": "p",
    "text": "消费端主要调三个方向：一是拉取批量——fetch.min.bytes（默认 1 字节，Broker 攒够再回）与 fetch.max.wait.ms（默认 500ms）提升单次拉取数据量与吞吐；二是单批处理量——max.poll.records（默认 500）决定单批处理耗时，必须保证单批耗时 &lt; max.poll.interval.ms（默认 5 分钟），日志写库场景常调到 500~1000 并配批量插入；三是并行度——消费者实例数 ≤ 分区数，多了闲置。真正的瓶颈往往在下游：日志服消费 Kafka 写 MySQL 时，吞吐上限是 MySQL 批量插入能力，不是 Kafka 拉取能力——'端到端压测'的意义就在这，单压 Kafka 得到的理论值，上线就被下游打回原形。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">吞吐与延迟的平衡：linger.ms × batch.size</text>\n<rect x=\"30\" y=\"45\" width=\"280\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">日志服：吞吐优先</text>\n<text x=\"170\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">linger.ms = 10~20ms</text>\n<text x=\"170\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">batch.size = 64KB+</text>\n<text x=\"170\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">lz4 / acks=1 / 幂等</text>\n<text x=\"170\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">行为日志可容忍少量丢失与延迟</text>\n<rect x=\"330\" y=\"45\" width=\"280\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">支付服：低延迟可靠优先</text>\n<text x=\"470\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">linger.ms = 0（立即发）</text>\n<text x=\"470\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">acks = all + min.insync=2</text>\n<text x=\"470\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">retries 拉满 + 幂等</text>\n<text x=\"470\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">宁可慢，不可丢不可重</text>\n<rect x=\"30\" y=\"180\" width=\"580\" height=\"86\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker 端配套</text>\n<rect x=\"45\" y=\"216\" width=\"140\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"115\" y=\"241\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">num.io.threads=8</text>\n<rect x=\"200\" y=\"216\" width=\"140\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"270\" y=\"241\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">堆 4~6G，内存让页缓存</text>\n<rect x=\"355\" y=\"216\" width=\"140\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"425\" y=\"241\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">log.segment.bytes=1G</text>\n<rect x=\"510\" y=\"216\" width=\"100\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"560\" y=\"241\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">monitor</text>\n</svg>",
    "caption": "图 2：吞吐-延迟平衡与 Broker 配套调优"
   },
   {
    "t": "h",
    "text": "Broker 端调优清单"
   },
   {
    "t": "list",
    "items": [
     "num.io.threads（默认 8）：处理请求的 IO 线程数，与 CPU 核数匹配；RequestHandlerAvgIdlePercent 持续走低说明过载",
     "socket.request.max.bytes：限制单请求大小，防止超大请求打爆内存",
     "log.segment.bytes（默认 1GB）：段大小影响索引粒度与清理频率，日志量大可调大减少段文件数",
     "JVM 堆：Kafka 数据走页缓存不走堆，堆给 4~6G 就够，堆大既浪费本可作页缓存的内存又让 GC 停顿变长",
     "页缓存命中：热数据靠 OS 页缓存，机器内存尽可能留给页缓存（堆外），这是吞吐的生命线",
     "压缩是 CPU 换带宽：Producer 压缩后 Broker 原样存储，消费端解压；保持消息格式一致可避免 Broker 解压重压"
    ]
   },
   {
    "t": "pits",
    "items": [
     "无限加大 batch.size/linger.ms 追吞吐：延迟飙升，活动事件端到端延迟不可接受，吞吐延迟是跷跷板",
     "忽略压缩选型：gzip 压缩率高但 CPU 开销大，日志高吞吐场景 lz4/zstd 更均衡",
     "JVM 堆配 16G：Kafka 数据不过堆，堆大挤占页缓存内存还拉长 GC，4~6G 堆 + 大页缓存才是正解",
     "分区数拍脑袋：按'峰值吞吐/单分区速率'估算并预留余量，临时扩容会破坏 key 路由顺序",
     "只压 Kafka 不压下游：端到端压测才能暴露真实瓶颈（通常在下游 MySQL 批量写）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：高吞吐四支柱是顺写/页缓/零拷/批；零拷贝省的是 CPU 拷贝不是零次拷贝，SSL 会失效；吞吐延迟靠 linger/batch 平衡，日志与支付两套配置要熟记；Broker 堆 4~6G、内存让页缓存。下一篇综合消息可靠性。"
   }
  ]
 },
 {
  "id": "mq-message-reliability",
  "title": "消息可靠性：不丢不重不乱的完整方案",
  "layer": 2,
  "depends": [
   "mq-kafka-producer",
   "mq-kafka-consumer",
   "mq-kafka-replication"
  ],
  "covers": [
   "mq-03",
   "mq-09",
   "mq-13",
   "mq-17"
  ],
  "quiz": [
   "mq-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "消息不丢是三段接力：生产端确认、存储多副本、消费端手动提交。任何一段配错，前面的配置都白费。业务上最终靠'at-least-once + 幂等'兜底——这是 MQ 可靠性的世界观。"
   },
   {
    "t": "pre",
    "items": [
     "理解 acks 与幂等生产者（生产者篇）",
     "理解 offset 提交时机（消费者篇）",
     "理解 ISR 与 min.insync.replicas（副本篇）"
    ]
   },
   {
    "t": "h",
    "text": "三种投递语义：先定位"
   },
   {
    "t": "p",
    "text": "at-most-once（至多一次）：先提交 offset 再处理消息，处理失败消息丢失，可容忍丢失的打点采样可用。at-least-once（至少一次）：先处理消息再提交 offset，宕机时消息重放，不丢但可能重复——这是工程主流。exactly-once（恰好一次）：Kafka 通过幂等生产者 + 事务实现单分区、单会话内的精确一次，但跨系统（Kafka → MySQL）的端到端 exactly-once 无法纯靠 Kafka，必须消费端做幂等/去重。口诀：'先提交至多一，先处理至少一，端到端靠幂等'。别吹'Kafka 支持 exactly-once 业务就不用管'——出了 Kafka 的门，幂等自己扛。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">不丢消息：三段接力，一段配错全丢</text>\n<rect x=\"30\" y=\"45\" width=\"185\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"122\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 生产端</text>\n<text x=\"122\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">acks=all</text>\n<text x=\"122\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">retries 拉满 + 幂等</text>\n<text x=\"122\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">回调失败 → 本地兜底表</text>\n<text x=\"122\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">防：发送即丢 / 重试重复</text>\n<text x=\"122\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">fire-and-forget 是大忌</text>\n<rect x=\"235\" y=\"45\" width=\"185\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"327\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② Broker 存储</text>\n<text x=\"327\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">replication.factor=3</text>\n<text x=\"327\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">min.insync.replicas=2</text>\n<text x=\"327\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">禁 unclean 选举</text>\n<text x=\"327\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">防：单机断电 / Leader 丢失</text>\n<text x=\"327\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可靠靠副本不靠刷盘</text>\n<rect x=\"440\" y=\"45\" width=\"185\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"532\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 消费端</text>\n<text x=\"532\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">关自动提交</text>\n<text x=\"532\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">先处理成功再提交</text>\n<text x=\"532\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">失败重试 + 死信隔离</text>\n<text x=\"532\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">防：处理中宕机丢消息</text>\n<text x=\"532\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">at-least-once + 幂等</text>\n<path d=\"M215 120 L235 120\" stroke=\"var(--accent)\" stroke-width=\"3\" marker-end=\"url(#rl1)\"/>\n<path d=\"M420 120 L440 120\" stroke=\"var(--accent)\" stroke-width=\"3\" marker-end=\"url(#rl1)\"/>\n<defs><marker id=\"rl1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"215\" width=\"580\" height=\"86\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务兜底层：唯一键 + 状态机 + 对账（MQ 只管 at-least-once）</text>\n<text x=\"320\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">支付发货：orderId 唯一索引判重 → 条件更新状态 → 定时对账补单</text>\n<text x=\"320\" y=\"280\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">重复消费不可怕，可怕的是重复消费产生副作用（重复发货 = 资损）</text>\n</svg>",
    "caption": "图 1：三段式不丢消息接力与业务幂等兜底"
   },
   {
    "t": "h",
    "text": "消费端幂等：唯一键 + 状态机 + 原子判重"
   },
   {
    "t": "p",
    "text": "以'支付服通知游戏服发货'为模板设计：第一，唯一键——每笔支付事件带全局唯一的 orderId，作为幂等锚点。第二，判重存储——首选 DB 唯一索引：发货流水表对 orderId 建唯一索引，发货流水插入与加道具在同一事务内，重复消费时插入冲突直接吞掉（捕获 DuplicateKeyException 视为已处理）；Redis SETNX 只能作辅助（有'Redis 成功 DB 失败'的一致性窗口和 key 过期问题），主判重必须落 DB。第三，状态机——订单状态 CREATED → PAID → DELIVERED，发货前用条件更新保证并发与重复下只成功一次。第四，消费端——手动提交 offset，业务事务提交成功后再 commit，事务失败抛异常重试，重试由幂等兜底。第五，对账——支付服与游戏服定时对账，发现'已支付未发货'的告警补偿。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 游戏服消费支付成功事件的幂等发货\n@KafkaListener(topics = \"pay-success-events\", groupId = \"game-server\")\npublic void onPaySuccess(PayEvent event) {\n    // 1. 事务内：发货流水插入（orderId 唯一索引） + 发道具，同生共死\n    try {\n        deliveryService.transaction(() -> {\n            // INSERT INTO delivery_log(order_id, player_id, ...) VALUES(...)\n            // 重复消费时这里抛 DuplicateKeyException → 视为已处理\n            deliveryDao.insertWithUniqueKey(event.getOrderId(), event.getPlayerId(), ...);\n            playerDao.addDiamond(event.getPlayerId(), event.getAmount());\n        });\n    } catch (DuplicateKeyException e) {\n        log.info(\"重复事件，幂等跳过: {}\", event.getOrderId());\n    }\n    // 2. 事务提交成功后才手动提交 offset（Spring Kafka ack-mode=manual）\n    // 3. 定时对账：扫描 PAID 超过 N 分钟未 DELIVERED 的订单，补发/告警\n}\n\n// 条件更新做状态机（替代步骤 1 的备选方案）\n// UPDATE order SET status='DELIVERED' WHERE order_id=? AND status='PAID'\n// 受影响行数 = 1 才真正发货，= 0 说明已被处理或状态非法"
   },
   {
    "t": "h",
    "text": "不丢 / 不重 / 不乱：一张检查清单"
   },
   {
    "t": "table",
    "head": [
     "目标",
     "手段",
     "关键检查点"
    ],
    "rows": [
     [
      "不丢",
      "acks=all + min.insync=2 + 禁 unclean + 手动提交",
      "Producer 回调成功率、ISR 收缩告警、消费 Lag"
     ],
     [
      "不重",
      "幂等生产者（发送侧）+ 唯一键判重（消费侧）",
      "PID/序列号生效、发货流水唯一索引存在"
     ],
     [
      "不乱",
      "key 路由同分区 + 分区内不并行 + 不随意扩分区",
      "玩家事件 key=playerId、in-flight ≤5 幂等保序"
     ],
     [
      "发现",
      "监控 + 对账（源端与目标端比对）",
      "Lag 增长率、对账差量报表、重试/死信计数"
     ]
    ]
   },
   {
    "t": "p",
    "text": "消息丢失的发现与补偿同样重要：生产端 send 回调失败计数告警、Broker ISR 收缩告警、消费端 Lag 与重试次数监控、业务侧定时对账——'监控发现、对账确认、兜底表+重放补救'是治理闭环。生产端兜底表：发送失败的消息落本地 DB 表（与业务同事务），后台线程定时扫描重发，这是'本地消息表'模式；消费端重试 + 死信：消费失败先重试 N 次（指数退避），仍失败转入死信 Topic 隔离，人工或自动补偿；重放：Kafka 消息有保留期，可按 offset 或时间戳重置消费者位点重新消费。日志服行为日志可容忍少量丢失，但经济流水日志（钻石增减）必须对账——它是排查玩家投诉和工作室刷金的依据。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">支付 → MQ → 发货的可靠闭环</text>\n<rect x=\"30\" y=\"45\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">支付网关</text>\n<text x=\"95\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">异步回调</text>\n<rect x=\"190\" y=\"45\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">购买服</text>\n<text x=\"255\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">验签 + 本地事务</text>\n<text x=\"255\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">订单+消息表同事务</text>\n<rect x=\"350\" y=\"45\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"415\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka</text>\n<text x=\"415\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">pay-success-events</text>\n<rect x=\"510\" y=\"45\" width=\"110\" height=\"60\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"565\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服</text>\n<text x=\"565\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">幂等发货</text>\n<path d=\"M160 75 L190 75\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rl2)\"/>\n<path d=\"M320 75 L350 75\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#rl2)\"/>\n<path d=\"M480 75 L510 75\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#rl2)\"/>\n<defs><marker id=\"rl2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"125\" width=\"590\" height=\"146\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"147\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">每个环节防什么故障</text>\n<rect x=\"45\" y=\"162\" width=\"270\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"180\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">购买服本地事务：状态变了消息一定在</text>\n<text x=\"180\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">防'DB 提交成功但发送失败'的真空期</text>\n<rect x=\"325\" y=\"162\" width=\"280\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"465\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">消费失败 → 重试 → 死信 → 告警</text>\n<text x=\"465\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">毒药消息隔离，不卡整个分区</text>\n<rect x=\"45\" y=\"216\" width=\"270\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"180\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">对账：PAID 超时未 DELIVERED 补单</text>\n<text x=\"180\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">与支付渠道日终对账</text>\n<rect x=\"325\" y=\"216\" width=\"280\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"465\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">为什么用 MQ 不用 RPC 直连</text>\n<text x=\"465\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">洪峰缓冲 + 发版不丢 + 解耦</text>\n</svg>",
    "caption": "图 2：支付发货可靠闭环与每环节防的故障"
   },
   {
    "t": "h",
    "text": "可靠性落地：从设计到上线的五步检查"
   },
   {
    "t": "p",
    "text": "把可靠性要求落到项目里的标准动作：第一步定级——每个 Topic 属于'可丢（行为日志）''可重（业务事件）''绝不丢（经济流水/支付）'哪一级，分别决定 acks、副本、幂等、对账的配置力度；第二步配齐生产端——acks + retries + 幂等 + 回调补偿，收进公共 SDK/代码模板而不是让每个业务自己写；第三步加固存储端——replication.factor=3 + min.insync.replicas=2 做集群基线，unclean 选举统一关闭；第四步规范消费端——关自动提交、先处理后提交、失败重试 + 死信隔离、幂等键设计规范；第五步建立发现机制——Lag、回调失败率、重试次数、对账差量四项告警在上线前配齐。五步各对应一段'防什么故障'，是面试把可靠性从口号讲成工程落地的主线——按这条线答'你们怎么保证消息不丢'，远比罗列参数完整。"
   },
   {
    "t": "pits",
    "items": [
     "以为 acks=all 就不丢：必须同时配 min.insync.replicas=2 并禁 unclean 选举，三段接力一段不能少",
     "用自动提交偷懒：'先提交后处理'就是 at-most-once，支付发货场景等于丢单",
     "只答配置不讲发现：没有监控与对账，消息丢了都不知道——'监控发现、对账确认、重放补偿'才是闭环",
     "幂等键设计错误：必须全局唯一且稳定（orderId/活动ID+玩家ID+批次号），用时间戳当幂等键等于没有",
     "重复消费产生副作用不可怕、可怕的是没兜底：发货流水与业务同事务 + 唯一索引是锚点，Redis SETNX 只作辅助"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三段接力（生产确认/存储副本/消费手动提交）一段配错全丢；工程主流是 at-least-once + 业务幂等；幂等三件套是唯一键 + 状态机 + 原子判重，对账是最后防线。下一篇讲消息顺序性。"
   }
  ]
 },
 {
  "id": "mq-message-ordering",
  "title": "消息顺序性：分区内有序的工程实现",
  "layer": 2,
  "depends": [
   "mq-kafka-producer",
   "mq-kafka-consumer"
  ],
  "covers": [
   "mq-10",
   "mq-18"
  ],
  "quiz": [
   "mq-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Kafka 只能保证分区内有序，全局有序只能靠单分区（牺牲并行度）。工程上的正解是'用 key 把需要保序的消息路由到同一分区，分区内顺序消费'——游戏服里'玩家获得钻石 → 消耗钻石'这类玩家维度事件全靠这一条。"
   },
   {
    "t": "pre",
    "items": [
     "理解分区与 key 路由（架构篇）",
     "理解消费端分区独占与 offset（消费者篇）",
     "理解幂等生产者对 in-flight 的限制"
    ]
   },
   {
    "t": "h",
    "text": "全局有序 vs 分区有序：先划清边界"
   },
   {
    "t": "p",
    "text": "Kafka 的消息只在同一个 Partition 内按写入顺序存储和消费，这是唯一能承诺的顺序。要全局有序，只能让 Topic 只有 1 个分区——所有消息串行写入、串行消费，并行度退化为 1，高峰期必堆积，生产环境几乎不这么干。正确的做法是按业务维度分区：玩家维度的事件用 playerId 当 key，key 相同的消息进同一分区、同一消费者按序处理。类比：每个玩家一条专属车道（分区），车道内先来后到；不同玩家的车道互不干扰、并行通行。全服玩家共用单分区 = 只有一条车道，必然堵车。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">key 分区路由：同玩家同车道，车道内保序</text>\n<rect x=\"30\" y=\"45\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">生产者：key = playerId</text>\n<text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">hash(playerId) % 分区数 → 同一玩家永远进同一分区</text>\n<rect x=\"50\" y=\"120\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"135\" y=\"142\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Partition 0</text>\n<text x=\"135\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家A: 获得钻石 → 消耗钻石 → 合成</text>\n<text x=\"135\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家C: …</text>\n<text x=\"135\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">车道内先来后到</text>\n<rect x=\"240\" y=\"120\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"142\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Partition 1</text>\n<text x=\"325\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家B: 升级 → 领奖 → 领取邮件</text>\n<text x=\"325\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家D: …</text>\n<text x=\"325\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">与 0/2 并行通行</text>\n<rect x=\"430\" y=\"120\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"515\" y=\"142\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Partition 2</text>\n<text x=\"515\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家E: 战斗结算 → 掉落 → 入包</text>\n<text x=\"515\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家F: …</text>\n<text x=\"515\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">互不干扰</text>\n<rect x=\"30\" y=\"245\" width=\"580\" height=\"42\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"263\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">全局有序 = 单分区 = 单车道必堵车；玩家维度有序 + 分区并行才是游戏服正解</text>\n<text x=\"320\" y=\"280\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">经济流水'先消耗后获得'会造成余额负态、风控误判、对账失真</text>\n</svg>",
    "caption": "图 1：key 分区路由实现玩家维度保序"
   },
   {
    "t": "h",
    "text": "顺序性与可靠性的冲突与权衡"
   },
   {
    "t": "p",
    "text": "严格保序与高可靠天然冲突：要严格保序，max.in.flight 就必须受限（重试不跳队），消费端不能并行（一个分区一个处理线程），批量提交窗口小（位点与处理同步）；这些都会压吞吐。游戏服的解法是分层妥协：玩家维度强有序的事件（经济流水、任务进度）用'幂等 + 受限 in-flight + 分区内单线程'严格保序；非强有序的聚合型日志（战斗结算明细、位置上报）可以放宽——允许短暂乱序，消费端用时间戳或版本号做最终排序。另一个常见矛盾：批量写库提升吞吐，但一批跨多分区时，其中一个分区写失败要整批重放，重放会把已经成功的分区消息也重新处理一遍——此时幂等必须覆盖所有分区，否则顺序没乱、数据却重了。面试答'顺序与可靠性怎么平衡'，能给出这套分层妥协，就是有工程经验的信号。"
   },
   {
    "t": "h",
    "text": "乱序的三大来源与对策"
   },
   {
    "t": "p",
    "text": "第一，生产者重试乱序：max.in.flight.requests.per.connection > 1 且发生重试时，前一批失败重试可能排到后一批之后写入。解法：开启幂等生产者（enable.idempotence=true，Kafka 3.0 起默认），它把 in-flight 限制为 ≤5 并靠序列号保证有序；或保守地把 in-flight 设为 1（吞吐受损）。第二，消费端并行乱序：同一分区的消息用多线程并行处理，处理完成顺序与提交顺序不一致。解法：分区内单线程处理；确需并行时按'同 key 必须串行'做分桶，不同 key 才允许并行。第三，扩分区乱序：Topic 加分区后 key 重新路由，同一 key 的老消息在旧分区、新消息在新分区，跨分区并发消费就乱序了。解法：扩容前先消费完（Lag 清零），或接受短暂乱序用时间戳/版本号兜底，玩家强有序场景宁可一开始多预留分区。"
   },
   {
    "t": "h",
    "text": "顺序消费的工程实现"
   },
   {
    "t": "p",
    "text": "消费端保序的标准做法：生产者按 key 分区路由 → 消费者组内同一分区同一时刻只归一个消费者（组内互斥保证）→ 单个消费者内部对该分区顺序处理（不并行）→ 批量消费时按分区聚合后逐个分区顺序提交。注意重平衡期间的顺序性：同一分区同一时刻只归一个消费者，顺序不破，但分区易主时旧消费者未提交的位点会重放，要求消费端幂等容忍重放段。日志服写 MySQL 时，如果下游报表对单个玩家的事件顺序敏感（如余额快照），就按 playerId 分区 + 分区内顺序落库；如果不敏感（纯聚合指标），可以放宽并行。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 生产端：玩家事件带 key，保证同一玩家进同一分区\nproducer.send(new ProducerRecord<>(\"player-event\", playerId, eventJson),\n    (md, ex) -> { /* 回调处理 */ });\n\n// 消费端：分区内保序，禁止多线程并行处理同一分区\nwhile (running) {\n    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));\n    // 关键：同一分区的记录按 offset 顺序逐个处理，不要开线程池\n    for (ConsumerRecord<String, String> r : records) {\n        processPlayerEvent(r.value());   // 顺序执行\n        consumer.commitSync();           // 逐条提交（吞吐低但最稳）\n        // 或：处理完本分区该批后，按分区 commitSync(offsets) 批量提交\n    }\n}\n\n// 若必须并行：按分区拆桶，一个分区一个线程，提交时等该桶全部完成\n// 绝不能：把一个分区的消息丢进共享线程池乱序执行"
   },
   {
    "t": "h",
    "text": "游戏服场景：排行榜与任务链"
   },
   {
    "t": "p",
    "text": "排行榜场景：玩家积分变更事件必须按时间顺序应用到排行榜，否则'加分→减分→加回'会被乱序成'减分→加分'导致排名错乱。解法：key=playerId，分区内顺序消费，用内存榜 + 周期落库，或写 Redis ZSet 后异步刷库。任务链场景：'击杀 → 掉落 → 任务进度 → 奖励发放'是一条事件链，任一环节乱序都会导致任务进度错乱（比如先结算奖励再更新进度）。解法：整条链的事件用同一个任务实例 ID/玩家 ID 作 key 路由进同一分区，消费端按事件类型 + 版本号串行处理。这些场景的共同点：需要的不是'全局有序'，而是'业务实体维度有序'，用 key 分区正好两全。"
   },
   {
    "t": "pits",
    "items": [
     "承诺'Kafka 全局有序'：Kafka 只保证分区内有序，全局有序 = 单分区 = 并行度 1",
     "重试开 max.in.flight > 1 又不开幂等：前批失败后批先写，分区内直接乱序",
     "消费端一个分区开多线程并行：分区顺序性瞬间被破坏，这是最常见的隐蔽乱序来源",
     "临时扩分区：key 重新路由，同 key 老消息旧分区、新消息新分区，玩家事件短暂乱序",
     "忘了重平衡的重放段：分区易主时未提交位点会重放，消费端必须幂等容忍重放"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Kafka 只保证分区内有序；用 key 做业务维度分区路由实现'玩家维度有序 + 全局并行'；乱序三大来源（重试、并行、扩分区）各有对策；排行榜/任务链场景都归约到'业务实体维度有序'。下一篇讲消息可靠性：不丢不重不乱。"
   }
  ]
 },
 
 {
  "id": "mq-distributed-transaction",
  "title": "分布式事务与消息：最终一致性",
  "layer": 3,
  "depends": [
   "mq-message-reliability"
  ],
  "covers": [
   "mq-14",
   "mq-17",
   "mq-20"
  ],
  "quiz": [
   "mq-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "跨系统事务没有银弹：本地消息表、Kafka 事务、MQ 最终一致是三种主流方案。核心思想是一致的——'保证业务状态变更与消息投递的原子性，用消息驱动下游，靠对账兜底'。游戏服发奖、跨服结算全靠这套。"
   },
   {
    "t": "pre",
    "items": [
     "理解 at-least-once + 幂等的可靠性世界观（可靠性篇）",
     "理解 Kafka 事务 API（Transactional API）的能力边界",
     "理解支付发货链路的六步闭环"
    ]
   },
   {
    "t": "h",
    "text": "问题定义：为什么本地事务管不了跨系统"
   },
   {
    "t": "p",
    "text": "游戏服要发奖，涉及两个动作：更新玩家订单/奖励状态（游戏服自己的 MySQL）+ 通知日志服记账、通知 BI 统计（跨系统）。这两个动作无法在一个数据库事务里完成。朴素方案'先改库再发 MQ'有两个致命窗口：改库成功但发消息失败/进程崩溃 → 消息丢失无据可查；发消息成功但改库回滚 → 下游收到了不该有的消息。分布式事务的目标就是消灭这两个窗口，让'业务状态变更'与'消息一定投递'绑定。"
   },
   {
    "t": "h",
    "text": "方案一：本地消息表（最通用、不依赖 MQ 特性）"
   },
   {
    "t": "p",
    "text": "业务数据与消息记录放在同一个本地事务里写：业务操作成功，消息表里就多一条'待发送'记录，两个动作同生共死。后台有个独立线程（或定时任务/CDC）扫描消息表，把状态为'待发送'的消息投递到 MQ，投递成功后标记'已发送'；投递失败就重试，重复投递由消费端幂等兜底。这个方案的价值：用'消息一定在'换'至少一次投递'，可靠性不依赖 MQ 的事务能力，任何 MQ（包括 Kafka）都能用。代价：每笔业务多写一张表、多一个扫描任务，消息表会积累数据（定期清理/归档）。注意：扫描与投递之间要防重复（多实例扫描用分布式锁或 WHERE status='待发送' LIMIT n + 更新抢占），消费端幂等是必须的。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">本地消息表：业务与消息同事务，后台线程投递</text>\n<rect x=\"30\" y=\"45\" width=\"240\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"150\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">① 本地事务（同库同事务）</text>\n<text x=\"150\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">UPDATE 订单状态 = PAID</text>\n<text x=\"150\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">INSERT INTO msg_queue(status='待发送')</text>\n<text x=\"150\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">要么都成功，要么都回滚</text>\n<text x=\"150\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">消息一定在 → 不依赖 MQ 事务能力</text>\n<rect x=\"320\" y=\"45\" width=\"150\" height=\"120\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"395\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">② 后台投递线程</text>\n<text x=\"395\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">扫描待发送消息</text>\n<text x=\"395\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">投递 MQ 后标记已发送</text>\n<text x=\"395\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">失败重试（指数退避）</text>\n<text x=\"395\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">多实例防重复：条件更新抢占</text>\n<rect x=\"520\" y=\"45\" width=\"110\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"575\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">③ MQ</text>\n<text x=\"575\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">at-least-once</text>\n<text x=\"575\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">下游消费</text>\n<text x=\"575\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">业务幂等兜底</text>\n<path d=\"M270 105 L320 105\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#dt1)\"/>\n<path d=\"M470 105 L520 105\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#dt1)\"/>\n<defs><marker id=\"dt1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"185\" width=\"580\" height=\"98\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"207\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三个方案对照</text>\n<rect x=\"45\" y=\"220\" width=\"175\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"132\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">本地消息表</text>\n<text x=\"132\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">任何 MQ 可用，多写一张表</text>\n<rect x=\"232\" y=\"220\" width=\"175\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Kafka 事务</text>\n<text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Kafka 事务，原子写 + offset 入事务</text>\n<rect x=\"419\" y=\"220\" width=\"175\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"507\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">MQ 最终一致 + 对账</text>\n<text x=\"507\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">源端重发 + 定时对账补单</text>\n</svg>",
    "caption": "图 1：本地消息表方案与三方案对照"
   },
   {
    "t": "h",
    "text": "最终一致的时间窗口：玩家感知与补偿节奏"
   },
   {
    "t": "p",
    "text": "最终一致不是'立即一致'，要明确不一致窗口有多长，并让窗口内可感知、可补偿。以发奖为例：玩家点击领奖瞬间，游戏服返回'奖励发放中'，实际发奖走 MQ 可能在几百毫秒到几秒后才完成——窗口内玩家看到的道具还没到账，这就是不一致窗口。设计要点：前端给足提示（'奖励稍后到账'），减少玩家焦虑；后端给对账留足余量（PAID 超过 N 分钟未 DELIVERED 才告警补偿，N 要大于正常处理 P99 的若干倍）；补偿任务要有退避和人工介入入口，防止自动补偿打滚。跨服结算的资金类操作，窗口内要锁止玩家对该资产的消费（转移中的钻石不能再用），这是'一致性窗口内的业务约束'，往往比技术方案本身更重要——技术只保证最终一致，业务约束保证窗口内的行为安全。"
   },
   {
    "t": "h",
    "text": "方案二：Kafka 事务（Transactional API）"
   },
   {
    "t": "p",
    "text": "Kafka 事务 = 事务协调器 + 两阶段提交 + __transaction_state 日志，把'跨分区的多条写入 + 消费位点提交'做成原子单元，事务 ID（transactional.id）跨会话保持，靠 epoch 隔离僵尸生产者。它最适合 Kafka 内部的 consume-transform-produce 管道（消费 A Topic → 处理 → 写 B Topic + 提交 offset 同生共死）。局限必须讲清：Kafka 事务只保证'Kafka 进、Kafka 出'，终点是 MySQL 等外部系统时仍要回到本地消息表 + 业务幂等。所以游戏服'业务库 + Kafka'场景的主选仍是本地消息表，Kafka 事务多用于纯 Kafka 数据管道。"
   },
   {
    "t": "h",
    "text": "方案三：MQ 最终一致 + 对账补单"
   },
   {
    "t": "p",
    "text": "这是最后一道防线，也是很多团队漏掉的环节。即使消息投递和消费都正常，仍可能因为代码 bug、脏数据、人为误删导致链路断掉。因此要有两层对账：源端与目标端定时比对（如支付服与游戏服小时级对账，发现'已支付未发货'告警补偿）；源端提供可重发接口（支付网关主动查询/补单接口），发现丢单后由对账任务触发重发。对账是业务层最后防线——'监控发现，对账确认，兜底表 + 重放补救'的闭环里，对账负责'确认'。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服发奖 / 跨服结算的最终一致闭环</text>\n<rect x=\"30\" y=\"45\" width=\"140\" height=\"66\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"100\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服</text>\n<text x=\"100\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">本地事务：扣限量库存</text>\n<text x=\"100\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">+ 记录领奖/消息表</text>\n<rect x=\"250\" y=\"45\" width=\"140\" height=\"66\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka 事务</text>\n<text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Transactional API</text>\n<text x=\"320\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">或本地消息表投递</text>\n<rect x=\"470\" y=\"45\" width=\"140\" height=\"66\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"540\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">发奖服务</text>\n<text x=\"540\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">幂等消费（唯一键）</text>\n<text x=\"540\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">批量写库 + 发邮件</text>\n<path d=\"M170 78 L250 78\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#dt2)\"/>\n<path d=\"M390 78 L470 78\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#dt2)\"/>\n<defs><marker id=\"dt2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"135\" width=\"580\" height=\"140\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"157\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">跨服结算场景：分账/迁移怎么保证一致</text>\n<rect x=\"45\" y=\"172\" width=\"270\" height=\"48\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"180\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">① 源服：扣减玩家资产 + 发'转出'消息</text>\n<text x=\"180\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">（同一本地事务，记录消息凭证）</text>\n<rect x=\"325\" y=\"172\" width=\"270\" height=\"48\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"460\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">② 目标服：幂等入账（转出单号唯一键）</text>\n<text x=\"460\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">入账成功发回执消息</text>\n<rect x=\"45\" y=\"230\" width=\"550\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.2\"/>\n<text x=\"320\" y=\"247\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">③ 对账兜底：源服定时查'已扣未入账'的转出单，触发补发或人工介入</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">资产类对账必须严：转出/入账都要有流水表，差量报表驱动补偿</text>\n</svg>",
    "caption": "图 2：发奖与跨服结算的最终一致闭环"
   },
   {
    "t": "h",
    "text": "游戏服落地的完整决策"
   },
   {
    "t": "list",
    "items": [
     "业务库 + Kafka 链路：用本地消息表（业务表 + 消息表同事务，后台投递线程重试），最通用不依赖 Kafka 事务能力",
     "纯 Kafka 内部管道（消费 A Topic → 写 B Topic）：用 Kafka 事务（Transactional API），位点与结果同生共死",
     "支付发货：六步闭环——验签 → 本地事务（订单 + 消息表）→ 发 MQ → 幂等消费发货 → 死信告警 → 对账补单",
     "资产类操作（钻石增减、跨服转移）对账必须严：源端目标端都要流水表，差量报表驱动补偿",
     "限量道具：领奖入口先扣库存（Redis DECR 或 DB 条件更新），扣到才发事件，发奖端再校验资格，宁可拒发不可超发"
    ]
   },
   {
    "t": "pits",
    "items": [
     "直接发 MQ 不落本地表：'DB 提交成功但发送失败/进程崩溃'的窗口就是丢消息的根源",
     "把 Kafka 事务当跨系统分布式事务：它只保证'Kafka 进、Kafka 出'，终点是 MySQL 时仍要幂等兜底",
     "忘了对账：配置再对也可能被 bug/脏数据/人为误删打断，对账 + 源端可重发是最后防线",
     "幂等键设计错：跨服结算的转出单号、发奖的批次号才是稳定幂等键，用 playerId 当幂等键会在重复发奖时误判",
     "限量道具不先扣：异步发奖 + 限量道具不做入口扣减，并发下必超发"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：跨系统一致性靠'业务状态变更与消息投递原子绑定'——本地消息表最通用、Kafka 事务管 Kafka 内部管道、对账补单是最后防线；游戏服发奖/跨服结算/支付发货都归约到这一套。下一篇讲消息堆积治理。"
   }
  ]
 },
 {
  "id": "mq-lag-governance",
  "title": "消息堆积治理：定位、提速与兜底",
  "layer": 3,
  "depends": [
   "mq-kafka-consumer",
   "mq-message-reliability"
  ],
  "covers": [
   "mq-12",
   "mq-30"
  ],
  "quiz": [
   "mq-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "堆积（Lag）不是故障本身，而是症状。治理框架四步走：先看趋势，再找瓶颈，三加并行，四给下游提速。活动上线日志积压几百万条这类事故，按这套流程能在最短时间内稳住。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Lag 定义与消费并行度上限（消费者篇）",
     "理解 offset 提交与批量写库（消费者篇）",
     "理解监控四层（集群/Broker/Topic/消费）"
    ]
   },
   {
    "t": "h",
    "text": "堆积原因：先分类再对症"
   },
   {
    "t": "p",
    "text": "Lag = 分区最新 offset − 已提交 offset，反映消费速度跟不上生产速度。堆积原因四类：一是生产太快——活动上线瞬间日志量翻几倍，消费端来不及；二是消费太慢——下游 MySQL 是常见真瓶颈（慢 SQL、批量太小、索引过多、单事务过大），消费者 CPU/IO/GC 打满；三是消费卡住——消费逻辑死循环、频繁重平衡（实例反复被踢）、死信处理不当；四是数据倾斜——个别分区消息量远大于其他分区（比如某热门玩家的日志独占一个分区），单分区消费成为短板。先看监控分清是哪一类，再对症处理，最忌不问原因先加机器。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">堆积排查决策树</text>\n<rect x=\"240\" y=\"45\" width=\"160\" height=\"46\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">发现 Lag 上涨</text>\n<rect x=\"30\" y=\"115\" width=\"180\" height=\"100\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">所有分区一起涨</text>\n<text x=\"120\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">生产过快 or 消费整体慢</text>\n<text x=\"120\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ 看消费者 CPU/GC</text>\n<text x=\"120\" y=\"195\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ 看下游 MySQL 瓶颈</text>\n<rect x=\"230\" y=\"115\" width=\"180\" height=\"100\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">个别分区涨</text>\n<text x=\"320\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数据倾斜（热玩家）</text>\n<text x=\"320\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ key 设计不均</text>\n<text x=\"320\" y=\"195\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ 加消费者无效</text>\n<rect x=\"430\" y=\"115\" width=\"180\" height=\"100\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Lag 波动不涨</text>\n<text x=\"520\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">频繁重平衡</text>\n<text x=\"520\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ 单批处理超时</text>\n<text x=\"520\" y=\"195\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ 心跳/会话参数</text>\n<path d=\"M320 91 L120 115\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<path d=\"M320 91 L320 115\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<path d=\"M320 91 L520 115\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<rect x=\"30\" y=\"235\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"257\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">应急三选：加消费者（≤分区数）→ 转发 Topic 多实例并行 → 非核心数据重置 offset 跳过</text>\n<text x=\"320\" y=\"277\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">根治靠下游提速（批量写库/去索引/聚合），不是靠无限加机器</text>\n</svg>",
    "caption": "图 1：堆积排查决策树"
   },
   {
    "t": "h",
    "text": "活动前检查单：把堆积消灭在发生前"
   },
   {
    "t": "p",
    "text": "游戏服活动上线前的 MQ 检查单：一查容量——按活动流量系数（开服/活动是日常几倍）复核磁盘水位、网卡带宽、分区并行度余量；二查消费端——日志服/发奖服实例数是否配足（不超过分区数）、下游 MySQL 慢 SQL 与批量大小、是否预留动态扩容通道（配置中心能临时拉起更多实例）；三查 Topic——活动相关 Topic 分区是否预留、是否与日常日志隔离；四查监控——Lag 增长率告警、对账差量报表、重试/死信计数是否就位；五查降级预案——活动洪峰超预期时先砍谁（行为日志采样）、转发 Topic 的临时通道是否可快速拉起。检查单的价值在于把堆积治理从'事后救火'变成'事前预防'，这也是运维经验沉淀成流程的体现——面试讲'你们活动上线前做什么'时按这五条答，比'我们监控 Lag'扎实得多。"
   },
   {
    "t": "h",
    "text": "监控指标与告警阈值"
   },
   {
    "t": "p",
    "text": "核心指标四层：集群层（ActiveControllerCount 必须恒为 1，为 0 无 Controller、>1 脑裂；UnderReplicatedPartitions 同步中副本不足，>0 即可靠性降级；OfflinePartitionsCount 无 Leader 分区 >0 即服务受损）；Broker 层（RequestHandlerAvgIdlePercent IO 线程空闲率持续走低 = 过载、请求排队时间、P99 生产/拉取延迟）；Topic 层（写入/读出速率、Leader 分布均衡性）；消费层（Consumer Lag 最重要、消费速率 vs 生产速率、offset 提交失败率）。资源层：磁盘水位（70% 预警、85% 紧急）、inode、网卡带宽、Broker JVM GC。Lag 告警用静态阈值还是增长率：稳态流量用静态阈值（如 Lag>10 万），活动/增长型流量用增长率或预计追平时间，否则洪峰期静态阈值必误报、平时又漏报。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 消费端 Lag 自监控：每个分区上报 (TopicPartition, lag)\nMap<TopicPartition, Long> endOffsets = consumer.endOffsets(consumer.assignment());\nMap<TopicPartition, OffsetAndMetadata> committed = consumer.committed(consumer.assignment());\nlong totalLag = 0;\nfor (TopicPartition tp : consumer.assignment()) {\n    long lag = endOffsets.get(tp) - committed.get(tp).offset();\n    totalLag += lag;\n    if (lag > SINGLE_PARTITION_LAG_WARN) {\n        // 单分区积压告警：疑似数据倾斜\n        metrics.record(\"lag.partition.\" + tp.partition(), lag);\n    }\n}\nmetrics.record(\"lag.total\", totalLag);  // 配合 Prometheus/Grafana 曲线与告警\n// 告警策略：稳态看绝对值；活动期看 lag 增长率 = (lag2 - lag1) / (t2 - t1)"
   },
   {
    "t": "h",
    "text": "提速手段：临时与长期"
   },
   {
    "t": "p",
    "text": "临时冲量三板斧：① 加消费者实例——注意并行度上限是分区数，实例超过分区数就闲置，所以平时要预留分区（日志 Topic 48~64 分区）；② 转发 Topic——临时启一个'转发消费者'把积压消息搬到分区更多的临时 Topic，多实例并行消化，牺牲单分区顺序（日志场景可接受）；③ 重置 offset 跳过——活动类非核心数据评估直接跳到最新（慎重，丢数据的决策要业务确认）。长期提速：下游 MySQL 批量插入（batch 从 100 提到 1000+）、去掉非必要索引、写前聚合合并、消费端异步化（Disruptor 做拉取→判重→批量写库→提交流水线）、慢 SQL 优化。事后复盘：评估是否该长期加分区、日志采样降级、冷数据转 HDFS/ClickHouse。"
   },
   {
    "t": "h",
    "text": "降级与限流：保核心弃边缘"
   },
   {
    "t": "p",
    "text": "堆积严重且短时间无法消化时，要主动降级而不是硬扛：按优先级分层——核心业务事件（支付、发货）优先消费，行为日志可采样丢弃或延迟消费；下游 DB 告警时消费端降速（减少拉取量）避免打垮库；极端情况重置 offset 到最新，先保核心业务可用，积压的旧日志在保留期内用离线任务追补。注意：降级决策要记录在案、可回滚、事后复盘，不能悄无声息丢数据。日志类数据的价值衰减很快（风控、BI 看的是近期数据），'丢旧保新'在日志场景通常是可接受的取舍，但经济流水绝不能丢——它是对账和排查的依据。"
   },
   {
    "t": "pits",
    "items": [
     "上来就加消费者：并行度上限是分区数，超过就闲置，先确认分区是否有余量",
     "只看 Lag 绝对值不看趋势：稳态与活动期的告警策略完全不同，静态阈值洪峰期必误报",
     "忽略数据倾斜：个别热分区积压靠加实例没用，要查 key 设计（热玩家事件独立分区）",
     "把下游 MySQL 瓶颈归咎于 Kafka：端到端瓶颈 90% 在下游，先压测/看慢 SQL 再说",
     "重平衡导致 Lag 抖动被误判为堆积：看 Lag 曲线是否周期性波动，先修重平衡再谈扩容"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：堆积四类原因（生产快/消费慢/卡住/倾斜）要先分类；监控四层 + Lag 告警策略（静态 vs 增长率）；提速三板斧（加实例/转发 Topic/重置 offset）加下游提速根治；降级保核心弃边缘，经济流水绝不丢。下一篇进入游戏服 MQ 实战。"
   }
  ]
 },
 {
  "id": "mq-game-practice",
  "title": "游戏服务器 MQ 实战：链路与场景",
  "layer": 3,
  "depends": [
   "mq-lag-governance",
   "mq-distributed-transaction"
  ],
  "covers": [
   "mq-07",
   "mq-20",
   "mq-32"
  ],
  "quiz": [
   "mq-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "把前面所有知识串成游戏服的真实落地：日志采集全链路、跨服消息广播、GM 指令下发、活动通知、异步任务、与 Netty 网关配合。每一个场景对应一类 MQ 用法与一组可靠性配置。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Kafka 生产/消费/可靠性（前面多篇）",
     "理解最终一致与幂等（分布式事务篇）",
     "熟悉 Netty 网关与游戏服内部线程模型"
    ]
   },
   {
    "t": "h",
    "text": "场景一：日志采集全链路（日志服）"
   },
   {
    "t": "p",
    "text": "这是最经典的 Kafka 场景。游戏服（Netty 逻辑线程）上报行为日志：玩家操作、战斗结算、经济流水、登录登出。链路设计：游戏服内用 Disruptor 做服内缓冲（主线程只写内存队列，不碰网络/磁盘），Disruptor 消费者批量组包后异步发送到 Kafka（linger.ms=10 + lz4 + acks=1），Topic 按业务隔离（player-log、economy-flow、combat-log）。日志服是独立集群（多实例 + 独立消费组），poll 批量 → 按表拆分批量插入 MySQL → 全部成功才提交 offset。关键点：日志 Topic 分区数要按'峰值写入吞吐 / 单消费者写库速率'估算并预留；行为日志可容忍少量丢失（acks=1），经济流水必须 acks=all + 幂等消费 + 对账（它是排查玩家投诉和工作室刷金的依据）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">日志采集全链路：Disruptor 管服内、Kafka 管服间</text>\n<rect x=\"30\" y=\"45\" width=\"130\" height=\"90\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服</text>\n<text x=\"95\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty 逻辑线程</text>\n<text x=\"95\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只写内存队列</text>\n<rect x=\"190\" y=\"45\" width=\"130\" height=\"90\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Disruptor</text>\n<text x=\"255\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">服内环形缓冲</text>\n<text x=\"255\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">批量组包不阻塞主线程</text>\n<rect x=\"350\" y=\"45\" width=\"130\" height=\"90\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"415\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka</text>\n<text x=\"415\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">linger=10 + lz4</text>\n<text x=\"415\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">行为日志 acks=1</text>\n<text x=\"415\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">经济流水 acks=all</text>\n<rect x=\"510\" y=\"45\" width=\"110\" height=\"90\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"565\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">日志服</text>\n<text x=\"565\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">批量拉取 → 批量写库</text>\n<text x=\"565\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">成功才提交 offset</text>\n<path d=\"M160 90 L190 90\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#gp1)\"/>\n<path d=\"M320 90 L350 90\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#gp1)\"/>\n<path d=\"M480 90 L510 90\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#gp1)\"/>\n<defs><marker id=\"gp1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"155\" width=\"580\" height=\"150\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"177\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">跨服消息广播与 GM 指令下发（双 Group 复用同一 Topic）</text>\n<rect x=\"45\" y=\"192\" width=\"270\" height=\"48\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"180\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">GM 后台 → 指令 Topic（key=serverId）</text>\n<text x=\"180\" y=\"230\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">各游戏服实例按 serverId 过滤，定向/广播两相宜</text>\n<rect x=\"325\" y=\"192\" width=\"270\" height=\"48\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<text x=\"460\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">活动通知 → 全服广播 Topic</text>\n<text x=\"460\" y=\"230\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服 → 推送服务 → Netty 网关下发客户端</text>\n<rect x=\"45\" y=\"250\" width=\"550\" height=\"46\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.2\"/>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">异步任务：掉线重登补偿、跨服排行结算、邮件补发 → 任务 Topic，避免同步阻塞逻辑线程</text>\n<text x=\"320\" y=\"288\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 指令消费要幂等（指令带唯一 id），防止重平衡重放重复执行</text>\n</svg>",
    "caption": "图 1：日志链路 + 跨服广播/GM 指令场景"
   },
   {
    "t": "h",
    "text": "场景二：跨服消息广播"
   },
   {
    "t": "p",
    "text": "跨服玩法（跨服战场、跨服排行榜、合服）需要把事件广播给多个服。方案：事件进广播 Topic，每个游戏服实例用独立消费组订阅，各拿各的副本；或进指令 Topic，消费端按 serverId 过滤。两种都要注意：消费端过滤是'拉到再滤'，消息里带 targetServer 字段；广播的可靠性与吞吐要求通常不高，但推送服务（游戏服 → 玩家客户端）要经 Netty 网关，涉及会话管理——玩家在线才推，不在线落'离线消息'表等上线补发。跨服结算的资产一致性走上一篇的最终一致方案。"
   },
   {
    "t": "h",
    "text": "场景三：GM 指令下发与活动通知"
   },
   {
    "t": "p",
    "text": "GM 后台（RuoYi 重构过的那个）发指令：'全服停服公告''封禁某玩家''热更配置'。链路：GM 后台 → 指令 Topic → 游戏服消费 → 网关广播给客户端。可靠性要求中等（指令丢了影响体验不丢钱），但幂等必须（指令带唯一 id，消费前查去重表，防止重平衡重放重复执行——比如'封禁'被执行两次没大碍，'加钻石'被执行两次就是资损）。活动通知：活动开启/结束、限时礼包、版本更新公告，走广播 Topic，游戏服消费后推给在线玩家。配置热更新：GM 改配置 → 配置变更消息 → 游戏服加载新配置（版本号递增，防止旧配置覆盖新配置）。"
   },
   {
    "t": "h",
    "text": "场景四：异步任务与 Netty 网关配合"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 游戏服发 MQ（Netty 业务线程中，绝不阻塞）\n// 掉线重登补偿任务：玩家上线后异步补发邮件\npublic class ReconnectTaskProducer {\n    public void submit(int playerId, String reason) {\n        String json = \"{\\\"playerId\\\":\" + playerId + \",\\\"reason\\\":\\\"\" + reason + \"\\\"}\";\n        producer.send(new ProducerRecord<>(\"async-task\", String.valueOf(playerId), json),\n            (md, ex) -> { if (ex != null) fallbackStore.save(json); });\n    }\n}\n\n// 消费端：异步任务处理器（独立线程池，不占游戏逻辑线程）\n@KafkaListener(topics = \"async-task\", groupId = \"game-task\")\npublic void handle(String taskJson) {\n    Task task = JsonUtils.parse(taskJson);\n    if (dedupDao.exists(task.getId())) return;   // 幂等去重\n    executor.submit(() -> {                       // 异步执行，不阻塞 poll\n        mailService.send(task.getPlayerId(), \"重登补偿\", task.getReward());\n        dedupDao.mark(task.getId());\n    });\n}\n// 注意：异步执行 + 手动 ack 时，ack 时机要与业务完成对齐，否则丢任务\n// 简单可靠的做法：poll → 入 Disruptor → 消费线程执行 → 归并完成后再 commit"
   },
   {
    "t": "p",
    "text": "异步任务的通用模式：游戏服把耗时操作（发邮件、排行榜结算、跨服排行同步、资源回收）投给 MQ，消费端用独立线程池处理，不占游戏逻辑线程——逻辑线程只做'入队 + 立即返回'。与 Netty 网关配合的要点：MQ 消费端与 Netty 事件循环解耦，推送客户端走网关的连接，但消费端不要直接在 Netty IO 线程里跑业务逻辑。掉线补偿、活动奖励发放这类'量大但不紧急'的任务都适合 MQ 异步化。活动奖励百万玩家同时领奖的设计题，核心就是'领奖与发奖分离、playerId 分区保序、幂等判重、批量落库、限量先扣、坏了降级'——前面各篇的可靠性、顺序性、最终一致知识全部用上。"
   },
   {
    "t": "h",
    "text": "场景落地的通用清单"
   },
   {
    "t": "list",
    "items": [
     "Topic 隔离：行为日志、经济流水、业务事件、GM 指令、异步任务分 Topic，防止互相拖累",
     "分区规划：按'峰值吞吐/单消费者速率'估算并预留，玩家维度事件 key=playerId",
     "可靠性分级：行为日志 acks=1、经济流水 acks=all + 幂等 + 对账、GM 指令幂等去重",
     "消费端：关自动提交、批量写库、防 max.poll.interval.ms 超时、静态成员 + CooperativeSticky 减重平衡",
     "降级预案：活动洪峰时加消费者（预留分区）、日志采样、转发 Topic、重置 offset",
     "监控：Lag 增长率、生产成功率、消费失败率、对账差量报表"
    ]
   },
   {
    "t": "pits",
    "items": [
     "逻辑线程里同步发 MQ：send() 本身异步，但调用太频繁仍会占逻辑线程时间，服内必须经 Disruptor 缓冲",
     "GM 指令不做幂等：重平衡重放把'加钻石'执行两次 = 资损，指令必须带唯一 id + 消费去重",
     "日志 Topic 与业务事件混用：日志洪峰拖累支付事件消费延迟，必须物理隔离",
     "消费端异步处理却立即 ack：任务还没执行就提交 offset，进程崩溃任务丢失——ack 要与业务完成对齐",
     "推送在 Netty IO 线程做业务：消费端 → 网关推送要解耦，IO 线程只做读写"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：游戏服 MQ 场景可归为日志管道、跨服广播、GM 指令、活动通知、异步任务五类；核心口诀是'服内 Disruptor、服间 Kafka、playerId 分区保序、幂等判重、限量先扣、坏了降级'。下一篇讲 MQ 运维。"
   }
  ]
 },
 {
  "id": "mq-ops",
  "title": "消息中间件运维：监控、容量与故障",
  "layer": 3,
  "depends": [
   "mq-kafka-replication",
   "mq-lag-governance"
  ],
  "covers": [
   "mq-22",
   "mq-30"
  ],
  "quiz": [
   "mq-22"
  ],
  "body": [
   {
    "t": "lead",
    "text": "MQ 运维的本质是四件事：监控健康度、治理 Topic/分区、算清容量、演练故障恢复。活动前查磁盘水位与 Lag 基线、活动中盯 Lag 增长率与副本状态、故障时按预案切换与恢复——这是线上维护者的日常工作。"
   },
   {
    "t": "pre",
    "items": [
     "理解 ISR/Controller/Lag 等核心指标含义",
     "理解分区只增不减与重分配机制",
     "理解容量估算四件套（磁盘/网卡/分区/Broker）"
    ]
   },
   {
    "t": "h",
    "text": "集群监控：分层与红线"
   },
   {
    "t": "p",
    "text": "监控分四层：集群层、Broker 层、Topic 层、消费层，加资源层兜底。红线指标：ActiveControllerCount 必须恒为 1（为 0 无 Controller、>1 脑裂）；UnderReplicatedPartitions 必须为 0（>0 说明有副本同步失败，可靠性降级）；OfflinePartitionsCount 必须为 0（无 Leader 分区）。ISR 频繁收缩/扩张说明副本不稳定（网络抖动或磁盘慢）。Broker 层看 RequestHandlerAvgIdlePercent（IO 线程空闲率持续走低 = 过载）、请求排队时间、P99 生产/拉取延迟。消费层最重要是 Consumer Lag（趋势而非绝对值）与消费速率 vs 生产速率。资源层：磁盘水位（70% 预警、85% 紧急）、inode、网卡带宽、JVM GC。金句：'一个 Controller、零个欠复制、磁盘不过七、Lag 看增长'。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka 监控分层：每层看什么</text>\n<rect x=\"30\" y=\"45\" width=\"180\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">集群层（红线）</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ActiveControllerCount = 1</text>\n<text x=\"120\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">UnderReplicatedPartitions = 0</text>\n<text x=\"120\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">OfflinePartitionsCount = 0</text>\n<text x=\"120\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">任一越界立即告警</text>\n<rect x=\"230\" y=\"45\" width=\"180\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Broker / Topic 层</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">RequestHandler 空闲率</text>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">请求排队时间 / P99 延迟</text>\n<text x=\"320\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Leader 分布均衡性</text>\n<text x=\"320\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">倾斜 → 单机热点</text>\n<rect x=\"430\" y=\"45\" width=\"180\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">消费 / 资源层</text>\n<text x=\"520\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Lag（看趋势与增长率）</text>\n<text x=\"520\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">消费速率 vs 生产速率</text>\n<text x=\"520\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">磁盘水位 70%/85%</text>\n<text x=\"520\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">网卡 / inode / GC</text>\n<rect x=\"30\" y=\"175\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">金句：一个 Controller、零个欠复制、磁盘不过七、Lag 看增长</text>\n<text x=\"320\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JVM 堆刻意调小（4~6G），内存让给页缓存——大堆既浪费又拖长 GC</text>\n<rect x=\"30\" y=\"245\" width=\"580\" height=\"62\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"267\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">磁盘紧急处置：缩短 retention → 删非核心 Topic → 停非核心消费者；中期：扩盘/加 Broker 迁分区 → 冷数据转存</text>\n<text x=\"320\" y=\"287\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">容量规划四件套：磁盘（日增×副本×保留）、网卡（吞吐×副本×消费倍数）、分区（并行度）、Broker（冗余）</text>\n</svg>",
    "caption": "图 1：Kafka 分层监控与容量四件套"
   },
   {
    "t": "h",
    "text": "容量规划：算账不拍脑袋"
   },
   {
    "t": "p",
    "text": "以日活 50 万、峰值每秒 10 万条行为日志、单条 1KB 为例估算：写入吞吐峰值 10 万条/s ≈ 100MB/s 入口；网络要乘副本因子 3（集群内部复制 ×2~3）再加消费组出口（日志服 + BI 服两组翻倍），按总带宽选万兆网卡；磁盘按日均 10 万×86400×1KB≈8.6TB/天（峰值均摊，实际按均值算）×3 副本 ×保留 7 天，加 OS 预留；分区数按消费并行度：单消费者写 MySQL 约 5 千条/s，10 万/5 千 = 20+，分区给 48~64 预留；Broker 数 3~5 台起步（3 副本 + 容忍 1 台宕机）。规划原则：按峰值 + 活动系数（开服/活动流量是日常数倍）而非按均值。压测验证用官方工具 kafka-producer-perf-test / kafka-consumer-perf-test，但真正要看的是端到端压测（真实消费端写 MySQL 全链路），因为瓶颈往往在下游；故障演练：压测中 kill 一台 Broker 看 ISR 收缩、Leader 切换对吞吐的影响。"
   },
   {
    "t": "h",
    "text": "Topic / 分区治理"
   },
   {
    "t": "p",
    "text": "Topic 治理清单：命名规范（域.对象.动作）、关掉 auto.create.topics 防误建、定期清理僵尸 Topic（无生产无消费）、副本因子与 min.insync.replicas 统一基线（3/2）、保留策略按业务分级（日志 7 天/流水 30 天）。分区治理重点：分区只增不减（减少等于合并/丢弃段数据，Kafka 不支持），扩容破坏 key 路由顺序性（要评估业务影响）；Leader 分布不均衡时用 kafka-reassign-partitions 重分配；分区过多（元数据压力、句柄膨胀）与过少（并行度不足）都要治理。扩分区前确认 Lag 已清零或业务可容忍短暂乱序，扩完盯重平衡与 ISR。"
   },
   {
    "t": "h",
    "text": "权限与安全"
   },
   {
    "t": "p",
    "text": "SASL 认证 + SSL 加密 + ACL 授权是生产标配：SASL/PLAIN 或 SCRAM 做认证（客户端身份），SSL 做传输加密（注意零拷贝失效、Broker CPU 上涨的代价），ACL 控制'谁可以读写哪个 Topic'（游戏服只能写自己上报的 Topic，日志服只能读自己组的 Topic）。风险清单：未认证集群任意客户端可读写（资损/数据污染）、明文传输被嗅探、删 Topic 无权限管控（delete.topic.enable 生产建议关闭，防手滑）。迁移方案：同构迁移用 MirrorMaker2（跨集群复制）、异构迁移用双写 + 双读 + 切换（灰度切流）。升级：先升级 Controller/Broker 兼容版本，逐台滚动，盯 ISR 不收缩。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">升级与故障恢复流程</text>\n<rect x=\"30\" y=\"45\" width=\"120\" height=\"70\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">① 备份配置</text>\n<text x=\"90\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">快照/验证</text>\n<text x=\"90\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">兼容版本</text>\n<rect x=\"180\" y=\"45\" width=\"120\" height=\"70\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"240\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">② 逐台滚动</text>\n<text x=\"240\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一台一台升级</text>\n<text x=\"240\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">盯 ISR 不收缩</text>\n<rect x=\"330\" y=\"45\" width=\"120\" height=\"70\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"390\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">③ 验证指标</text>\n<text x=\"390\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Lag/ISR/延迟</text>\n<text x=\"390\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">恢复正常</text>\n<rect x=\"480\" y=\"45\" width=\"120\" height=\"70\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"540\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">④ 再升下一台</text>\n<text x=\"540\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">完成前不操作</text>\n<text x=\"540\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">其他 Broker</text>\n<path d=\"M150 80 L180 80\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#op1)\"/>\n<path d=\"M300 80 L330 80\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#op1)\"/>\n<path d=\"M450 80 L480 80\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#op1)\"/>\n<defs><marker id=\"op1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<rect x=\"30\" y=\"135\" width=\"580\" height=\"54\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"157\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Broker 宕机：ISR 内副本自动接管 Leader（秒级），集群继续服务；长时间宕机 → kafka-reassign 把副本迁走</text>\n<text x=\"320\" y=\"177\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Controller 宕机：KRaft 模式 Raft 多数派秒级选新 Leader；期间元数据不可变更但数据面读写照常</text>\n<rect x=\"30\" y=\"205\" width=\"580\" height=\"60\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"227\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">集群迁移方案</text>\n<text x=\"320\" y=\"248\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">同构迁移：MirrorMaker2 跨集群复制（异步 + 断点续传）</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">异构/跨版本：双写 + 双读 + 灰度切流，切流盯 Lag 与对账差量</text>\n</svg>",
    "caption": "图 2：滚动升级与故障恢复、迁移方案"
   },
   {
    "t": "pits",
    "items": [
     "只监控 Lag 不监控红线指标：Controller 脑裂/欠复制分区出现时 Lag 还没涨，数据已经在丢的边缘",
     "容量按均值规划：游戏服开服/活动流量是日常数倍，必须按峰值 + 活动系数估算磁盘/网卡",
     "压测只压 Kafka 不压下游：真实瓶颈在下游 MySQL 批量写，端到端压测才能暴露",
     "分区重分配不盯 ISR：迁移未完成就认为完成，实际可靠性降级，重分配期间别动其他元数据",
     "升级直接全量停服：必须逐台滚动 + 兼容版本，升级前备份配置、升级中盯 ISR"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：运维四件事——监控（红线 + Lag 趋势）、容量（四件套按峰值算）、治理（Topic/分区/安全）、故障（逐台升级、镜像/双写迁移）；金句'一个 Controller、零个欠复制、磁盘不过七、Lag 看增长'。最后一篇进入流处理与面试深水区。"
   }
  ]
 },
 {
  "id": "mq-streams-ecosystem",
  "title": "流处理与生态面试深水区",
  "layer": 3,
  "depends": [
   "mq-kafka-consumer",
   "mq-kafka-replication",
   "mq-message-reliability"
  ],
  "covers": [
   "mq-26"
  ],
  "quiz": [
   "mq-26"
  ],
  "body": [
   {
    "t": "lead",
    "text": "本篇把 MQ 知识的边界推出去：Kafka Streams 与 Flink 是什么、rebalance 风暴怎么查、丢消息案例怎么复盘、面试易错点合集。答好这些，你就是'懂原理会排查'的候选而不是'背参数'的。"
   },
   {
    "t": "pre",
    "items": [
     "完整掌握前面各篇的全部知识",
     "理解 ISR/HW/事务/重平衡机制",
     "了解 lambda 表达式与 Java 流式 API"
    ]
   },
   {
    "t": "h",
    "text": "Kafka Streams 与 Flink：流处理生态入门"
   },
   {
    "t": "p",
    "text": "Kafka Streams 是 Java 库（不是独立集群），内嵌在应用进程里做有状态流处理：读 Topic → 转换/聚合/join → 写回 Topic。它用 KTable（可更新状态，Kafka 存储 + 变更日志）+ KStream（事件流）两种抽象，本地状态 + 变更日志 Topic 实现容错，靠任务分区并行。优点：无需额外集群、部署简单、与 Kafka 天然集成；缺点：只处理 Kafka 数据、吞吐受应用进程限制。Flink 是独立的分布式流处理引擎（JobManager/TaskManager 架构），支持任意数据源（Kafka/MySQL/日志）、复杂事件处理（CEP）、窗口计算、端到端 exactly-once（checkpoint + 两阶段提交，Kafka 事务 sink），吞吐大、生态全，但部署运维成本高。选型：日志服里的简单 ETL（过滤/聚合/转储）用 Kafka Streams 或直接消费者就够；BI 实时大屏、复杂窗口统计、跨数据源 join 用 Flink。面试问'Kafka 能当数据库吗'：Kafka 可以存状态（KTable）但查询能力弱，不替代数据库。"
   },
   {
    "t": "h",
    "text": "Kafka 的生态与能力边界"
   },
   {
    "t": "p",
    "text": "Kafka 生态以 Broker 为核心向外延伸：Connect（可插拔连接器，把 MySQL/ES/HDFS 等数据源管道化）、Streams（内嵌流处理库）、Schema Registry（消息 schema 管理）、以及 Flink/Spark/ClickHouse 等外部引擎的深度集成——游戏日志链路'Kafka → Flink → ClickHouse'是 BI 侧的成熟模板。能力边界也要说清：Kafka 原生不支持延迟消息与死信（应用层实现）、没有消息级 TTL（retention 是磁盘回收）、不替代数据库（KTable 查询能力弱）；KRaft 去掉 ZK 依赖后部署简化，分层存储（KIP-405）把冷数据卸载到对象存储，进一步降低磁盘成本。面试讲'生态'要落到'我的日志场景怎么用'，而不是罗列组件名。"
   },
   {
    "t": "h",
    "text": "rebalance 风暴：怎么查怎么治"
   },
   {
    "t": "p",
    "text": "rebalance 风暴指消费者组频繁重平衡，现象：Lag 周期性抖动、消费速率骤降、重复消费增多。排查路径：一看消费者实例日志——被踢出组的异常（MemberExceeded/RebalanceInProgress/CommitFailedException）；二看心跳与 poll——session.timeout.ms 与 max.poll.interval.ms 谁先超时（GC 卡顿导致心跳中断？单批处理耗时超限？）；三看组成员进出——实例反复重启（滚动发布未配静态成员）、网络分区。治理：GC 调优（减少 Full GC 长停顿）、单批耗时调优（调小 max.poll.records 或异步处理）、静态成员 group.instance.id + CooperativeStickyAssignor、把 session.timeout 调大容忍瞬时 GC。复盘案例：某日志服消费慢导致 poll 超时被踢 → 重平衡 → 分区易主 → 位点重放 → 重复写库 → 报表数据重复 → 又被踢。根因是下游写库慢，表象是重平衡，治标先减重平衡、治本提下游速度。"
   },
   {
    "t": "h",
    "text": "丢消息案例复盘：三层真相"
   },
   {
    "t": "p",
    "text": "复盘一个真实丢消息案例：现象——BI 报表某小时数据缺失。排查：生产者日志发现 send 回调有异常但被 catch 吞掉（fire-and-forget 的恶果）；Broker 侧 acks 配了 1，某个 Leader 恰好宕机且 Follower 未同步（acks=1 的丢失窗口）；消费端用的是自动提交，写库失败但 offset 已提交（at-most-once）。三个环节各丢一种场景，三层原因叠加导致缺数。复盘结论：生产者必须回调 + acks=all（资金类）/重试；Broker min.insync.replicas=2；消费端关自动提交 + 幂等；再补对账兜底。这类案例复盘是面试加分项——展示的是'按三段接力定位，而非背配置'的排查能力。"
   },
   {
    "t": "h",
    "text": "面试易错点合集"
   },
   {
    "t": "list",
    "items": [
     "acks=all ≠ 不丢：必须配 min.insync.replicas=2，ISR 收缩到 1 时 all 退化为单副本确认",
     "幂等生产者 ≠ exactly-once：幂等解决单分区单会话重试重复；跨分区/跨会话/出 Kafka 都要业务幂等",
     "HW 是 ISR 最小 LEO，不是每个副本的进度；消费者只读 HW 之前（已提交）",
     "rebalance 的 session 超时（心跳失联）与 poll 超时（处理太慢）是两个机制，别混为一谈",
     "分区只增不减；扩容破坏 key 路由顺序；全局有序 = 单分区 = 并行度 1",
     "Kafka retention 是磁盘回收（整段删除），不是消息级 TTL；延迟消息 Kafka 无原生方案",
     "Kafka 事务不解决'Kafka 到 MySQL'的端到端 exactly-once，终点是外部系统的仍靠幂等",
     "消费端提交时机：先业务成功再提交；异步处理要等整批归并完成再提交，防丢与防重取平衡"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 面试手写题常考：Kafka Streams 简单聚合（日志按类型计数）\nKStream<String, String> stream = builder.stream(\"player-log\");\nstream.map((k, v) -> KeyValue.pair(parseType(v), 1L))\n      .groupByKey()\n      .count()                    // KTable：本地状态 + changelog Topic 容错\n      .toStream()\n      .to(\"log-type-count\");\n\n// Flink 等价物（理解差距：Flink 是独立引擎，可跨数据源、可事件时间窗口）\n// DataStream<String> ds = env.addSource(new FlinkKafkaConsumer<>(\"player-log\", ...));\n// ds.map(...).keyBy(...).window(TumblingEventTimeWindows.of(Time.minutes(1))).sum(1);"
   },
   {
    "t": "pits",
    "items": [
     "把 Kafka Streams 说成独立集群：它是内嵌 Java 库，Flink 才是独立引擎，两者部署形态完全不同",
     "吹'Kafka 支持全局有序/延迟消息'：只保分区内有序、无原生延迟消息，被追问细节就露馅",
     "rebalance 风暴只治标：加超时参数掩盖下游慢的根因，要'减重平衡 + 提下游'双管齐下",
     "丢消息复盘只答配置不答排查路径：面试官要的是'三层定位'的排查思路而非背清单"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Kafka Streams 是内嵌库、Flink 是独立引擎；rebalance 风暴排查先分 session/poll 两类超时，治本在下游提速；丢消息按三段接力定位；易错点八条要烂熟。MQ 十四篇到此收官。"
   }
  ]
 }
]
};