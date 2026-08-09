window.TB = window.TB || {};
window.TB["microservice"] = {
  id: "microservice",
  name: "微服务与分布式",
  icon: "🕸️",
  nodes: [
 {
  "id": "microservice-arch-evolution",
  "title": "微服务架构演进与拆分哲学",
  "layer": 0,
  "depends": [],
  "covers": [
   "microservice-15",
   "microservice-31",
   "microservice-01"
  ],
  "quiz": [
   "microservice-15",
   "microservice-31",
   "microservice-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "微服务不是银弹，而是一组“拆分权衡”的工程决策。理解单体→SOA→微服务的演进动机与代价，是理解整个微服务知识体系的起点——包括为什么游戏服选择了“看起来像微服务、实际是横向分片”的另一条路。"
   },
   {
    "t": "pre",
    "items": [
     "清楚 Web 服务的基本形态：一个 WAR 包、一台机器、一套数据库",
     "熟悉游戏多服架构：登录服/游戏服/购买服/日志服各司其职",
     "了解 HTTP、RPC、MQ 的基本概念即可"
    ]
   },
   {
    "t": "h",
    "text": "为什么从单体走向微服务"
   },
   {
    "t": "p",
    "text": "单体应用（Monolith）把所有功能打成一个大包部署：登录、订单、报表都在同一个 WAR 里，共享同一个数据库。单体最大的优点是简单——调试、部署、事务都简单，一个进程内方法调用没有网络开销。但随着团队和业务膨胀，痛点越来越明显：代码库膨胀到几十万行，任何一行改动都要整个包回归测试；部署要全家重启，发布窗口越来越长；团队并行开发在同一个代码仓库里频繁冲突；某个模块的流量暴涨只能整体扩容，把不需要扩容的模块一起放大；数据库单库成为瓶颈。这些痛点按顺序积累到临界点，就是微服务改造的动机。"
   },
   {
    "t": "h",
    "text": "演进路线：单体 → SOA → 微服务"
   },
   {
    "t": "p",
    "text": "SOA（面向服务架构）是第一波服务化浪潮：把系统拆成粗粒度的业务服务，通过企业服务总线（ESB）互联。SOA 强调服务重用与集中治理，但 ESB 本身成了新的中心化瓶颈和复杂度来源，协议以 SOAP/WS 为主，偏重。微服务继承了 SOA“按服务切分”的思想，但去掉了 ESB：每个服务自治、独立部署、以轻量协议（HTTP/REST、gRPC、Dubbo）直接互调，用注册中心、网关、配置中心、链路追踪等基础设施替代 ESB 的集中治理。一句话记忆：SOA 是“服务化 + 中央总线”，微服务是“服务化 + 去中心化自治”。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">架构演进：单体 → SOA → 微服务</text>\n<rect x=\"20\" y=\"45\" width=\"185\" height=\"172\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"112\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">单体 Monolith</text>\n<text x=\"112\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">一个 WAR 一个库</text>\n<text x=\"112\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">方法调用=本地调用</text>\n<text x=\"112\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">改一行全包回归</text>\n<text x=\"112\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">部署全家重启</text>\n<text x=\"112\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只能整体扩容</text>\n<text x=\"112\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">优点：简单</text>\n<rect x=\"228\" y=\"45\" width=\"185\" height=\"172\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">SOA</text>\n<text x=\"320\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">粗粒度业务服务</text>\n<text x=\"320\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ESB 总线集中集成</text>\n<text x=\"320\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">WS/SOAP 重协议</text>\n<text x=\"320\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">集中治理重用</text>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">总线成新瓶颈</text>\n<text x=\"320\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">优点：服务化</text>\n<rect x=\"436\" y=\"45\" width=\"185\" height=\"172\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"528\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">微服务</text>\n<text x=\"528\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">按业务域拆分</text>\n<text x=\"528\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">独立部署/独立扩容</text>\n<text x=\"528\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">轻协议直连 RPC</text>\n<text x=\"528\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">注册中心+网关治理</text>\n<text x=\"528\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无 ESB 去中心</text>\n<text x=\"528\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">优点：自治</text>\n<path d=\"M205 131 L228 131\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#arA1)\"/>\n<path d=\"M413 131 L436 131\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#arA1)\"/>\n<defs><marker id=\"arA1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<rect x=\"20\" y=\"242\" width=\"601\" height=\"74\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"265\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服映射：周边系统微服务化，核心逻辑层按区服横向分片</text>\n<text x=\"320\" y=\"287\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录服/支付服/日志服/GM 后台 = 无状态微服务；游戏服 = 强有状态，横向分片，自研 RPC</text>\n<text x=\"320\" y=\"305\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">康威定律：团队的沟通结构决定系统的架构边界</text>\n</svg>",
    "caption": "图 1：单体 / SOA / 微服务的演进与游戏服映射"
   },
   {
    "t": "h",
    "text": "拆分原则与粒度：服务边界怎么划"
   },
   {
    "t": "list",
    "items": [
     "单一职责：一个服务只负责一个业务域（限界上下文），例如用户域、订单域、库存域",
     "数据私有：服务独享自己的库/表，禁止跨服务直连数据库——这是硬约束，不是建议",
     "独立部署独立扩容：能独立发布、能按自己的负载横向伸缩，否则不叫微服务",
     "按变更频率与团队边界拆：常一起改的代码别拆散，康威定律决定了组织边界即服务边界",
     "接口契约稳定：服务间用契约通信（API/事件），契约变更要做版本管理",
     "避免过细：服务拆到只有一两个接口时，治理成本超过收益，就成了分布式单体"
    ]
   },
   {
    "t": "p",
    "text": "判断边界是否合理的试金石有两个：能不能独立发布？能不能独立扩容？如果两个服务永远一起发布、一起扩容，它们本质上是一个服务。电商学习项目按 DDD 拆成 用户/商品/订单/库存/营销 就是标准示例；而游戏项目里，登录服、游戏服、购买服、日志服本身就是按业务域天然切分好的——登录=认证域、游戏=核心玩法域、购买=交易域、日志=数据域，每个域数据私有、故障隔离，购买服挂了玩家照常玩。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 边界划分示例：电商订单域 vs 游戏交易域\n// 订单服务只暴露契约接口，绝不暴露自己的表\npublic interface OrderService {\n    // 契约：创建订单（幂等：clientOrderNo 唯一）\n    OrderDTO createOrder(String clientOrderNo, List<ItemDTO> items);\n\n    // 契约：支付回调，内部由支付域服务触发\n    OrderDTO payCallback(String orderNo, String channel, String channelTradeNo);\n}\n\n// 游戏购买服对齐同一思想：充值回调接口即服务契约\npublic interface RechargeService {\n    // 幂等发货：channelTradeNo 唯一，重复回调直接返回已处理\n    RechargeResult deliverGoods(String channelTradeNo, long playerId, int goodsId);\n}"
   },
   {
    "t": "h",
    "text": "康威定律：组织架构决定系统架构"
   },
   {
    "t": "p",
    "text": "康威定律（Conway's Law）原文：设计系统的组织，其产生的设计等同于组织内部的沟通结构。通俗讲，团队怎么沟通，系统就长什么样。两个团队合用一个代码仓库，他们就会天天为合并冲突吵架；每个团队能独立负责一个服务，系统就会长出清晰的边界。所以微服务拆分不只是技术决策，更是组织决策——按康威定律拆服务，让团队沟通成本与系统耦合度同构。面试主动讲这条定律，说明你理解微服务的组织学维度，而不只是会背“按业务域拆”。"
   },
   {
    "t": "h",
    "text": "微服务八大痛点：把好处换来的代价"
   },
   {
    "t": "list",
    "items": [
     "分布式复杂性：本地方法调用变成网络调用，超时、重试、序列化、网络抖动全要处理",
     "数据一致性：跨服务事务没有本地事务保证，需要分布式事务或最终一致性方案",
     "服务治理：注册发现、负载均衡、熔断限流、链路追踪全套基础设施要自建",
     "测试与调试变难：端到端联调要在多服务间做，问题定位要跨进程看日志",
     "运维成本：几十上百个进程，监控、日志、告警、灰度、回滚全是工作量",
     "性能损耗：网络往返 + 序列化开销，跨服务调用比本地调用慢几个数量级",
     "团队协作复杂：接口契约、版本兼容、发布节奏需要跨团队协调",
     "故障定位困难：一个请求穿越多个服务，日志不串联就找不出问题"
    ]
   },
   {
    "t": "h",
    "text": "游戏服适合微服务吗：先分清两类服务"
   },
   {
    "t": "p",
    "text": "游戏服务器架构要分成两层看。接入与周边层（登录服、支付服、日志服、GM 后台）是典型的无状态服务，天然适合标准微服务技术栈：登录服可以注册到 Nacos、支付服可以用本地消息表 + 幂等做充值发货、日志服用 Kafka 异步解耦、GM 后台用 RuoYi/SpringBoot 全家桶。但核心的游戏逻辑层（游戏服本身）很难直接套 Spring Cloud：玩家战斗上下文、场景 AOI、Buff/技能状态全在进程内存里，这是强有状态服务；战斗广播是服务端高频主动推送（每秒几十次），HTTP 请求-响应模型和网关/Feign 那套根本不适用；同一玩家的操作必须串行化，微服务默认的并发无锁化模型反而有害。所以游戏服的正确姿势是“微服务思想 + 专用通信层”：按区服横向分片（有状态），周边系统纵向微服务化（无状态），中间用自研 RPC + Kafka 打通。这个判断本身，就是 10 年游戏服务器经验最值钱的地方——知道什么时候该用什么，不迷信任何框架。"
   },
   {
    "t": "pits",
    "items": [
     "把微服务说成“拆得越细越好”：拆出分布式单体（Distributed Monolith）比单体更糟，既要网络开销又没有独立部署能力",
     "忽略数据私有：允许跨服务共享数据库，等于把微服务拆成了换皮单体",
     "只讲好处不讲痛点：微服务面试最怕只会背优点，主动讲八大痛点反而显深度",
     "游戏场景答错方向：说“游戏服应该全面微服务化”——正确认知是周边系统微服务化、核心逻辑层横向分片"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：微服务的本质是“拆分权衡”——用分布式复杂性、一致性代价、运维成本换取独立部署与弹性伸缩；SOA 用 ESB 集中治理，微服务去中心化自治；拆分看单一职责、数据私有、独立部署、康威定律四条硬原则；游戏服的正确姿势是周边微服务化 + 核心逻辑层按区服分片。下一篇进入注册中心，它是服务化之后第一个绕不开的基础设施。"
   }
  ]
 },
 {
  "id": "microservice-registry-center",
  "title": "注册中心原理与选型",
  "layer": 0,
  "depends": [],
  "covers": [
   "microservice-01",
   "microservice-03",
   "microservice-09",
   "microservice-24"
  ],
  "quiz": [
   "microservice-03",
   "microservice-09",
   "microservice-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "注册中心是微服务的“活通讯录”：服务上线登记、下线销户、变化广播。理解注册、发现、健康检查三大机制和 AP/CP 取舍，才能说清 Nacos、Eureka、Zookeeper、Consul 为什么长成不同样子。"
   },
   {
    "t": "pre",
    "items": [
     "知道微服务的基本形态：服务 A 要调用服务 B，而 B 有多台实例",
     "有 IP 直连配置调用地址的朴素经验（游戏服列表配置）",
     "理解 CAP 理论的基本三要素（一致性/可用性/分区容错）"
    ]
   },
   {
    "t": "h",
    "text": "没有注册中心时会怎样"
   },
   {
    "t": "p",
    "text": "最简单的服务调用是写死 IP：order-service 在配置里写 inventory-service:8080。一旦服务做集群（3 个实例）、动态扩缩容、实例故障自动摘除，写死的列表就失效了：扩容了没加进去、挂了一台还在列表里。注册中心就是把“服务名 → 可用实例列表”这个映射关系集中管理起来并实时维护。登录服维护“可用游戏服列表”、玩家选服后重定向，本质就是一套人工/半自动的注册中心——只是没有自动化而已。"
   },
   {
    "t": "h",
    "text": "注册、发现、健康检查三大机制"
   },
   {
    "t": "p",
    "text": "服务提供者（Provider）启动时向注册中心注册自己的 IP:端口、权重、元数据；注册后按固定周期发心跳维持存活。服务消费者（Consumer）启动时按服务名拉取实例列表并缓存到本地，同时订阅该服务的变更；实例上下线时注册中心把变更推送给所有订阅者，消费者刷新本地缓存，再用客户端负载均衡选一个实例发起调用。健康检查是名单保持鲜活的关键：Nacos 对临时实例靠客户端心跳（5 秒一次），15 秒未收到标记不健康、30 秒剔除；对持久实例由服务端主动探测（TCP/HTTP）。Nacos 1.x 用 HTTP 短连接心跳 + UDP 推送变更，2.x 全面改为 gRPC 长连接，连接数大减、推送延迟更低。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 336\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">服务注册 / 发现 / 心跳 时序</text>\n<rect x=\"20\" y=\"45\" width=\"170\" height=\"36\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">服务提供者</text>\n<rect x=\"235\" y=\"45\" width=\"170\" height=\"36\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">注册中心 Nacos</text>\n<rect x=\"450\" y=\"45\" width=\"170\" height=\"36\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">服务消费者</text>\n<circle cx=\"105\" cy=\"130\" r=\"13\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">1</text>\n<line x1=\"190\" y1=\"125\" x2=\"235\" y2=\"125\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#rA)\"/>\n<text x=\"212\" y=\"117\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">注册+启动</text>\n<circle cx=\"105\" cy=\"170\" r=\"13\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">2</text>\n<line x1=\"190\" y1=\"165\" x2=\"235\" y2=\"165\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rA)\"/>\n<text x=\"212\" y=\"157\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">心跳 5s 保活</text>\n<circle cx=\"535\" cy=\"130\" r=\"13\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">3</text>\n<line x1=\"405\" y1=\"125\" x2=\"460\" y2=\"125\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#rA)\"/>\n<text x=\"432\" y=\"117\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">订阅服务</text>\n<circle cx=\"535\" cy=\"170\" r=\"13\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">4</text>\n<line x1=\"405\" y1=\"205\" x2=\"460\" y2=\"205\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#rA)\"/>\n<text x=\"432\" y=\"197\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">变更推送</text>\n<text x=\"432\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">gRPC/UDP</text>\n<line x1=\"190\" y1=\"205\" x2=\"235\" y2=\"205\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rA)\"/>\n<text x=\"212\" y=\"197\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">健康探测</text>\n<circle cx=\"320\" cy=\"240\" r=\"13\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"245\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">5</text>\n<line x1=\"535\" y1=\"240\" x2=\"190\" y2=\"240\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#rA)\"/>\n<text x=\"362\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">客户端负载均衡直接调用</text>\n<rect x=\"20\" y=\"272\" width=\"601\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"293\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">消费者本地缓存实例列表：注册中心短暂不可用时，存量调用仍可直连</text>\n<text x=\"320\" y=\"313\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏映射：登录服维护可用游戏服列表 = 注册发现模式的野生实现</text>\n<defs><marker id=\"rA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 2：服务注册发现与心跳保活时序"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Spring Cloud Alibaba：服务注册与发现的最小闭环\n@SpringBootApplication\n@EnableDiscoveryClient // 注册本服务 + 开启服务发现（新版可省略）\npublic class LoginServerApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(LoginServerApplication.class, args);\n    }\n}\n\n@RestController\npublic class ServerListController {\n    // 用 DiscoveryClient 拉取\"游戏服\"服务的全部实例（等价于登录服的游戏服列表）\n    @Autowired\n    private DiscoveryClient discoveryClient;\n\n    @GetMapping(\"/servers\")\n    public List<String> listGameServers() {\n        // 返回所有游戏服实例的 host:port，前端/客户端据此选服连接\n        return discoveryClient.getInstances(\"game-server\").stream()\n                .map(i -> i.getHost() + \":\" + i.getPort())\n                .collect(Collectors.toList());\n    }\n}"
   },
   {
    "t": "h",
    "text": "四大注册中心对比"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "Nacos",
     "Eureka",
     "Zookeeper",
     "Consul"
    ],
    "rows": [
     [
      "一致性",
      "默认 AP（Distro），可 CP（JRaft）",
      "纯 AP，对等复制",
      "CP，ZAB 协议",
      "CP（Raft），可切 AP"
     ],
     [
      "健康检查",
      "临时实例心跳/持久实例探测",
      "客户端心跳",
      "临时节点会话",
      "探活脚本/TTL/gRPC"
     ],
     [
      "通信协议",
      "HTTP + gRPC（2.x）",
      "HTTP",
      "TCP",
      "HTTP/DNS/gRPC"
     ],
     [
      "注册+配置",
      "注册配置一体，双模",
      "只做注册",
      "配置/锁/选主全能",
      "注册+KV 存储"
     ],
     [
      "现状",
      "Spring Cloud Alibaba 标配",
      "Netflix 组件已停更",
      "Dubbo 传统搭档",
      "服务网格生态（含 DNS）"
     ]
    ]
   },
   {
    "t": "h",
    "text": "CAP 取舍：注册中心该选 AP 还是 CP"
   },
   {
    "t": "p",
    "text": "服务注册发现本质是“列表下发”场景：拿到稍有延迟的实例列表，最坏只是连到一个刚下线的节点，客户端重试即可恢复；但注册中心整体不可用则全系统瘫痪。所以绝大多数微服务注册中心选 AP——宁旧勿死。Eureka 是纯 AP：各节点对等互相同步，任一节点存活就能服务，代价是可能读到旧数据。Nacos 更聪明：用实例的 ephemeral 属性做双模，临时实例走 AP（Distro 协议，客户端心跳，内存态），持久实例走 CP（JRaft，服务端探测，持久化）——默认的微服务实例是临时实例，走 AP。Zookeeper 是 CP：Leader 选举期间整个集群短暂不可写，换来强一致。面试要能说出层次：注册中心优先 AP，配置中心与关键元数据可以要 CP。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 210\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Nacos 双模：一个注册中心两种协议</text>\n<rect x=\"20\" y=\"45\" width=\"290\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"165\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">临时实例 ephemeral=true</text>\n<text x=\"165\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">协议：Distro（AP）</text>\n<text x=\"165\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">保活：客户端 5s 心跳，30s 剔除</text>\n<text x=\"165\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">存储：内存态，不持久化</text>\n<text x=\"165\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">场景：微服务动态扩缩容</text>\n<rect x=\"330\" y=\"45\" width=\"290\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"475\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">持久实例 ephemeral=false</text>\n<text x=\"475\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">协议：JRaft（CP）</text>\n<text x=\"475\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">保活：服务端主动探测</text>\n<text x=\"475\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">存储：持久化，多数派写入</text>\n<text x=\"475\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">场景：数据库等基础设施、配置</text>\n<text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">由实例属性决定协议，非人工切换——这是 Nacos 区别于其他注册中心的核心设计</text>\n</svg>",
    "caption": "图 3：Nacos 临时/持久实例的 AP/CP 双模设计"
   },
   {
    "t": "h",
    "text": "与 Kubernetes Service 的关系"
   },
   {
    "t": "p",
    "text": "K8s 也有自己的服务发现：Service 对象提供稳定虚拟 IP/DNS，由 kube-proxy 把流量转发到一组 Pod（endpoints），解决的是 Pod IP 漂移问题——这是基础设施层的服务发现。Nacos 这类注册中心是应用层的服务发现——解决业务实例注册、健康检查、权重路由、灰度打标。两者可以并存甚至互补：K8s Service 管调度与网络层，Nacos 管业务注册与治理；有些团队在 K8s 上直接用 Service/DNS 做发现，就不再引入注册中心，这是可接受的简化。理解这个层次关系，是云原生时代的必备认知。"
   },
   {
    "t": "h",
    "text": "游戏场景：登录服的游戏服列表"
   },
   {
    "t": "p",
    "text": "登录服维护可用游戏服列表、定时探测游戏服存活、玩家选服后下发重定向地址——这就是一套游戏行业的“注册中心”。微服务方案成熟后，这个列表完全可以由 Nacos 承接：游戏服启动注册（元数据带区服号、负载、版本号），登录服订阅列表做选服推荐，游戏服下线自动摘除，开新服只需启动新实例。邓凡可以把这段经历翻译成：我在游戏里维护过游戏服列表，Nacos 是这套思路的通用化产品，我理解的是注册发现这个模式的本质，而不是只背过 API。"
   },
   {
    "t": "pits",
    "items": [
     "说“Eureka 和 Zookeeper 都是注册中心，随便选”：要按 CAP 取舍与业务场景选型，CP 的 ZK 选主期不可写",
     "把 Nacos 简单归类为 AP：Nacos 是双模，按 ephemeral 属性决定协议，这是加分点也是挖坑点",
     "漏掉本地缓存：消费者缓存实例列表，注册中心挂了解存量调用仍可直连，这是高可用设计",
     "游戏场景不会类比：登录服选服就是注册发现的野生实现，主动类比是差异化亮点"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：注册中心三件事——注册、发现、健康检查；临时实例走 AP/Distro、持久实例走 CP/JRaft 是 Nacos 双模核心；注册中心宁旧勿死（AP），关键元数据可要 CP；K8s Service 管网络层、Nacos 管应用层，可互补可替换；登录服的游戏服列表就是注册发现的野生实现。下一篇讲远程调用：注册中心把地址给到，怎么把请求发出去、发得稳。"
   }
  ]
 },
 {
  "id": "microservice-remote-call",
  "title": "远程调用：从 Feign 到 Dubbo",
  "layer": 1,
  "depends": [
   "microservice-arch-evolution",
   "microservice-registry-center"
  ],
  "covers": [
   "microservice-05",
   "microservice-06",
   "microservice-25"
  ],
  "quiz": [
   "microservice-05",
   "microservice-25",
   "microservice-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "远程调用是微服务的“血管”。HTTP 系（Feign）与二进制系（Dubbo）各有取舍，而超时、重试、负载均衡、连接管理这些工程细节，决定了一次 RPC 在高并发下的生死。"
   },
   {
    "t": "pre",
    "items": [
     "理解注册中心的注册发现流程",
     "写过 HTTP 客户端调第三方接口（支付渠道回调）",
     "用 Netty 写过自研 RPC 通信（战斗服↔功能服）"
    ]
   },
   {
    "t": "h",
    "text": "两种调用范式：HTTP 与二进制 RPC"
   },
   {
    "t": "p",
    "text": "服务间调用有两大流派。HTTP 流派以 RestTemplate/Feign 为代表：基于 HTTP 协议 + JSON 序列化，跨语言、调试方便、对网关和外部系统友好，代价是报文冗余、序列化慢、短连接开销大。二进制流派以 Dubbo/gRPC 为代表：自定义协议帧 + 二进制序列化（Hessian2/Protobuf），长连接复用、体积小、性能高，代价是 Java 体系耦合（gRPC 用 IDL 缓解跨语言）。选型规律：外部系统/异构系统用 HTTP，内部高吞吐链路用二进制 RPC。游戏服内部服间通信用自研二进制协议，本质就是 Dubbo 这条路——这也是把自研 Netty RPC 经历翻译成微服务语言的关键。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "Feign / HTTP",
     "Dubbo / 二进制 RPC"
    ],
    "rows": [
     [
      "传输",
      "HTTP 短连接 + 连接池",
      "TCP 长连接复用（默认 20880）"
     ],
     [
      "序列化",
      "JSON（Jackson/Fastjson）",
      "Hessian2 / Kryo / Protobuf"
     ],
     [
      "报文体积",
      "大（字段名重复）",
      "小（二进制紧凑）"
     ],
     [
      "跨语言",
      "好",
      "Java 体系为主"
     ],
     [
      "能力边界",
      "只解决请求发出",
      "容错/路由/负载均衡/泛化调用全套"
     ],
     [
      "适用",
      "对外/异构/网关边缘",
      "内部高频低延迟调用"
     ]
    ]
   },
   {
    "t": "h",
    "text": "OpenFeign 的原理"
   },
   {
    "t": "p",
    "text": "OpenFeign 是声明式 HTTP 客户端：你写 @FeignClient 接口 + Spring MVC 注解，描述“我要调哪个服务哪个接口”。启动时 FeignClientFactoryBean 为接口生成 JDK 动态代理，调用方法时 InvocationHandler 把注解元数据解析成 RequestTemplate（URL、Header、Body），Encoder 把参数序列化为 JSON，再交给底层 HTTP Client（默认 HttpURLConnection，生产换成 OkHttp/HttpClient5）发出；请求里的服务名（http://order-service/…）由 Spring Cloud LoadBalancer（替代停更的 Ribbon）解析成具体实例地址。面试重点：Feign 本质是“HTTP 的接口代理”，做的是接口声明与请求拼装，不是传输层优化。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Feign 声明式调用：GM 后台调用游戏服玩家查询\n@FeignClient(name = \"game-server\", fallbackFactory = GameServerClientFallback.class)\npublic interface GameServerClient {\n    // 服务名由 LoadBalancer 解析为实例地址，路径打到游戏服 HTTP 接入层\n    @GetMapping(\"/api/players/{playerId}/profile\")\n    PlayerProfileVO getPlayerProfile(@PathVariable(\"playerId\") long playerId);\n\n    @PostMapping(\"/api/gm/gift\")\n    GiftResult sendGift(@RequestBody GiftRequest request); // GM 发奖\n}\n\n// fallbackFactory 能拿到异常，区分超时/熔断/业务错误做不同兜底\n@Component\npublic class GameServerClientFallback implements FallbackFactory<GameServerClient> {\n    @Override\n    public GameServerClient create(Throwable cause) {\n        return new GameServerClient() {\n            @Override\n            public PlayerProfileVO getPlayerProfile(long playerId) {\n                // 降级：返回缓存快照或默认值，明确标注非实时\n                return PlayerProfileVO.stale();\n            }\n            @Override\n            public GiftResult sendGift(GiftRequest request) {\n                // 发奖不可自动降级为成功，抛异常让上层告警人工处理\n                throw new RuntimeException(\"gift send failed: \" + request.getGiftNo(), cause);\n            }\n        };\n    }\n}"
   },
   {
    "t": "h",
    "text": "Dubbo RPC 模型"
   },
   {
    "t": "p",
    "text": "Dubbo 是完整的 RPC 框架，角色分工：Provider 启动把接口实现封装成 Exporter 暴露（默认 Netty 监听 20880）并注册到注册中心；Consumer 订阅拿到地址列表缓存本地；调用时动态代理把 方法+参数 封装成 Invocation，经过 Cluster（容错策略）、Router（路由规则）、LoadBalance（负载均衡）选定一台 Provider，用协议编解码 + 序列化（默认 Hessian2）经 Netty 传输；Provider 解码后反射调用本地实现，结果原路返回。与 Feign 最大的区别：Feign 只解决“怎么把请求发出去”，Dubbo 还解决“发给谁、失败怎么办、怎么容错、怎么治理”。3D MMORPG 的战斗服与功能服 RPC 通信和 Dubbo 模型完全同构——只是当时用自研协议 + Netty 实现。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Dubbo 一次 RPC 调用的完整链路</text>\n<rect x=\"20\" y=\"50\" width=\"150\" height=\"60\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Consumer</text>\n<text x=\"95\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">动态代理拦截调用</text>\n<rect x=\"190\" y=\"50\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Cluster 容错</text>\n<text x=\"255\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Failover 等策略</text>\n<rect x=\"340\" y=\"50\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"405\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">LoadBalance</text>\n<text x=\"405\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">随机/轮询/一致性哈希</text>\n<rect x=\"490\" y=\"50\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"555\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">编解码</text>\n<text x=\"555\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">16B 头 + Hessian2</text>\n<path d=\"M170 80 L190 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rcA)\"/>\n<path d=\"M320 80 L340 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rcA)\"/>\n<path d=\"M470 80 L490 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rcA)\"/>\n<rect x=\"20\" y=\"140\" width=\"600\" height=\"46\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Netty 长连接传输（协议帧 + 心跳 + 消息 ID 配对）</text>\n<text x=\"320\" y=\"178\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">与游戏服 Netty 自定义协议同构：长度防粘包、消息 ID 配响应、心跳保活</text>\n<rect x=\"20\" y=\"216\" width=\"600\" height=\"60\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"239\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Provider：Netty 解码 → 反射调用本地实现 → 结果原路返回</text>\n<text x=\"320\" y=\"261\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Monitor 异步统计调用次数与耗时；注册中心提供地址但不经手业务数据</text>\n<defs><marker id=\"rcA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 4：Dubbo RPC 调用链路与角色分工"
   },
   {
    "t": "h",
    "text": "超时与重试：最容易踩的坑"
   },
   {
    "t": "p",
    "text": "所有远程调用必须设超时，且连接超时与读取超时分开设。Feign 的坑：组件默认超时经常不生效或被覆盖（Ribbon 时代的 ConnectTimeout + ReadTimeout 两层叠加让人困惑），必须显式配置 feign.client.config.default.connect-timeout / read-timeout。重试的坑：自动重试会把一个非幂等请求重复执行，产生重复订单/重复扣款——要么关掉重试、要么保证接口幂等。经典公式：超时 1s × 重试 3 次 = 最坏等待 3s，且流量放大 3 倍，雪崩时形成重试风暴，必须配合熔断。邓凡调支付渠道的 HTTP 客户端经验（超时、重试、签名）和 Feign 的调优是同一套功夫。"
   },
   {
    "t": "h",
    "text": "负载均衡策略"
   },
   {
    "t": "p",
    "text": "客户端负载均衡在调用方侧选择实例：随机（Dubbo 默认）、轮询、加权轮询、最少活跃、一致性哈希。服务端负载均衡在代理层分发：Nginx、LVS。对比：客户端模式去中心化、无单点、但每个客户端维护列表；服务端模式对调用方透明、但代理是集中点。游戏场景：登录服按区服人数/负载选服就是业务级负载均衡；有状态服务（玩家会话）必须用一致性哈希保证亲和——同一玩家固定到持有其上下文的进程，否则要昂贵的状态迁移。负载均衡不与健康检查配合就是“闭眼随机”——必须剔除不健康实例。"
   },
   {
    "t": "h",
    "text": "连接管理"
   },
   {
    "t": "p",
    "text": "连接池是连接复用的基础：HTTP 用连接池（OkHttp ConnectionPool / HttpClient5 PoolingHttpClientConnectionManager）避免每次建连的 TCP 握手开销；Dubbo 默认与每个 Provider 建立共享长连接（dubbo 协议默认单连接，2.7+ 可配 connections 参数），高并发下单连接可能成为瓶颈，可调多连接 + 连接复用。连接管理三件事：复用（池化）、保活（心跳/空闲检测）、故障剔除（连接断开重连/失败转移）。游戏 Netty 里写过长连接心跳、断线重连，和 Dubbo 的 Heartbeat、重连机制是一个道理——把这段经验讲出来，就是“我调过 RPC 底层”。"
   },
   {
    "t": "pits",
    "items": [
     "Feign 超时配置不生效：组件默认超时经常被覆盖，必须显式配置 connect-timeout/read-timeout",
     "自动重试打爆下游：重试必须配幂等或熔断，非幂等写接口显式 retries=0",
     "只说策略名字不说选型逻辑：读 Failover、写 Failfast、通知 Failsafe",
     "忽略连接池：默认 HttpURLConnection 每次新建连接，压测直接打挂"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：远程调用两条路——Feign 是 HTTP 接口代理（声明式、跨语言、重），Dubbo 是完整 RPC 框架（长连接、二进制、容错路由全套）；超时、重试、连接池是生产生死线，重试必须配幂等；客户端负载均衡与健康检查必须配合；游戏自研 Netty RPC 与 Dubbo 模型同构，是翻译成微服务语言的最佳素材。下一篇讲 API 网关：外部流量从哪里进。"
   }
  ]
 },
 {
  "id": "microservice-api-gateway",
  "title": "API 网关：统一入口与横切治理",
  "layer": 1,
  "depends": [
   "microservice-arch-evolution",
   "microservice-registry-center"
  ],
  "covers": [
   "microservice-04",
   "microservice-16",
   "microservice-19"
  ],
  "quiz": [
   "microservice-04",
   "microservice-16",
   "microservice-19"
  ],
  "body": [
   {
    "t": "lead",
    "text": "API 网关是微服务的第一道门：所有外部流量在此汇聚，路由、鉴权、限流、灰度、日志在网关层统一完成，业务服务只关心业务。"
   },
   {
    "t": "pre",
    "items": [
     "知道 Gateway（网关）和 Feign（调用）是两种性质不同的组件",
     "写过 HTTP 拦截器（GM 后台的鉴权拦截）",
     "理解注册中心的服务发现"
    ]
   },
   {
    "t": "h",
    "text": "网关要解决的三个问题"
   },
   {
    "t": "p",
    "text": "没有网关时，每个服务都要自己处理鉴权、限流、跨域、日志，N 个服务 N 份重复代码，且安全边界后移到业务层——攻击者可以绕过 Nginx 直达服务。网关把横切逻辑前置：①统一入口：客户端只认识一个域名，网关按路径路由到不同服务；②统一横切：鉴权、限流、灰度、跨域、日志、参数校验一处实现；③统一治理：网关层可观测（链路追踪起点）、可限流（防刷）、可降级（故障时快速失败）。"
   },
   {
    "t": "h",
    "text": "Spring Cloud Gateway 核心三要素"
   },
   {
    "t": "p",
    "text": "Route（路由）：一条转发规则 = id + 目标 URI + 断言集合 + 过滤器集合。Predicate（断言）：匹配条件，如 Path=/login/**、Header=X-Version=1.2、Method=POST、时间窗口等——请求满足断言才走这条路由。Filter（过滤器）：转发前后做加工，分 pre（请求到达下游前：鉴权、加头、改路径）和 post（响应返回前：改写响应、加耗时头）两类，有 GlobalFilter（全局生效）和 GatewayFilter（绑定路由）两种。请求处理链：进入 → 命中 Route → 按序执行过滤器链 → 转发到下游 → 返回响应 → post 过滤器。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Spring Cloud Gateway 架构</text>\n<rect x=\"20\" y=\"50\" width=\"110\" height=\"50\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"75\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">客户端</text>\n<path d=\"M130 75 L160 75\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#gwA)\"/>\n<rect x=\"160\" y=\"42\" width=\"320\" height=\"66\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Gateway</text>\n<text x=\"320\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Route + Predicate 匹配路由</text>\n<text x=\"320\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GlobalFilter 过滤器链</text>\n<path d=\"M480 75 L510 75\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#gwA)\"/>\n<rect x=\"510\" y=\"50\" width=\"110\" height=\"50\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"565\" y=\"73\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">下游服务</text>\n<text x=\"565\" y=\"89\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">/login/**</text>\n<rect x=\"30\" y=\"130\" width=\"120\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">鉴权</text>\n<text x=\"90\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JWT 校验 401 短路</text>\n<rect x=\"160\" y=\"130\" width=\"120\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"220\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">限流</text>\n<text x=\"220\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis 令牌桶</text>\n<rect x=\"290\" y=\"130\" width=\"120\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"350\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">灰度</text>\n<text x=\"350\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">标签路由按版本</text>\n<rect x=\"420\" y=\"130\" width=\"120\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"480\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">日志/链路</text>\n<text x=\"480\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TraceId 起点</text>\n<text x=\"240\" y=\"222\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">过滤器链按 @Order 排序执行，鉴权必须排最前；pre 阶段在转发前，post 阶段在响应后</text>\n<rect x=\"30\" y=\"240\" width=\"580\" height=\"62\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏映射：登录前的 HTTP 接入层（账号校验/选服/公告/热更包地址）= 网关思想的野生实现</text>\n<text x=\"320\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Nginx 挡大流量 + Gateway 做业务治理，两者叠加使用</text>\n<defs><marker id=\"gwA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 5：Gateway 路由、断言与过滤器链"
   },
   {
    "t": "h",
    "text": "断言与过滤器编写"
   },
   {
    "t": "p",
    "text": "断言在 YAML 里声明式写：- Path=/game/**、- Header=X-App-Version, \\d+、- Method=POST。复杂逻辑（灰度比例、IP 黑名单、签名校验）用自定义 GlobalFilter 写 Java。过滤器通过实现 Ordered 接口控制顺序，值越小越靠前。最关键认知：Gateway 底层是 Netty + WebFlux 响应式模型，过滤器内不能写阻塞 IO——不能调同步 JDBC、同步 Redis，要用 reactive 客户端（ReactiveRedisTemplate/WebClient），否则一次阻塞调用就能卡住事件循环、打爆整个网关。这和传统 Servlet 一请求一线程的思维完全相反。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Component\npublic class AuthGlobalFilter implements GlobalFilter, Ordered {\n\n    // 白名单：登录、支付回调、健康检查直接放行\n    private static final List<String> WHITELIST =\n        Arrays.asList(\"/login\", \"/pay/callback\", \"/actuator/health\");\n\n    @Override\n    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {\n        ServerHttpRequest req = exchange.getRequest();\n        String path = req.getPath().value();\n        if (WHITELIST.contains(path)) {\n            return chain.filter(exchange); // 白名单放行\n        }\n        String token = req.getHeaders().getFirst(\"Authorization\");\n        // JWT 本地校验（不访问 DB，避免阻塞）——校验失败短路返回 401\n        if (token == null || !JwtUtil.verify(token)) {\n            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);\n            return exchange.getResponse().setComplete();\n        }\n        // 校验通过：把玩家ID注入请求头转发下游，下游免解析 token\n        ServerHttpRequest mutated = req.mutate()\n            .header(\"X-Player-Id\", JwtUtil.getPlayerId(token))\n            .build();\n        return chain.filter(exchange.mutate().request(mutated).build());\n    }\n\n    @Override\n    public int getOrder() { return -100; } // 鉴权排最前\n}"
   },
   {
    "t": "h",
    "text": "限流、鉴权、灰度三件套"
   },
   {
    "t": "p",
    "text": "限流：内置 RequestRateLimiter + RedisRateLimiter，基于 Redis + Lua 实现令牌桶，KeyResolver 决定按什么维度限（IP、玩家 ID、接口路径）——开服瞬间按 IP 限流防刷、按玩家 ID 限流防单个账号狂刷。鉴权：GlobalFilter 里校验 JWT/Token，失败 401 短路，成功把身份注入 Header 转发（下游信任内网头）。灰度：请求染色（Header/参数带版本标签），配合注册中心实例 metadata 做标签路由，新版本实例逐步放量，异常秒级摘除。还有跨域（CORS）、改写路径（StripPrefix）、协议适配（HTTP→Dubbo 泛化调用）等常用过滤器。"
   },
   {
    "t": "h",
    "text": "网关 vs 游戏网关"
   },
   {
    "t": "p",
    "text": "游戏项目里也有“网关”：Nginx 接入层 + 登录服的 HTTP 接入（账号校验、选服、公告、热更包地址下发）。对比差异：Spring Cloud Gateway 是业务级 HTTP 网关，做路由与治理；游戏长连接网关（Netty 实现）做 TCP/WebSocket 协议接入、断线重连、心跳、消息转发——两者都是“统一入口 + 横切前置”，只是协议栈不同。面试话术：游戏登录前的 HTTP 接入层就是网关思想的野生实现，网关三要素（路由/断言/过滤器）在游戏接入层里都有对应：路径路由对应选服路由、鉴权断言对应 token 校验、过滤器链对应接入层的校验/限流/日志拦截。"
   },
   {
    "t": "pits",
    "items": [
     "在 Gateway 过滤器里写阻塞 IO：WebFlux 事件循环被卡死，网关整体雪崩",
     "鉴权过滤器顺序排错：没有用 @Order 控制，会出现未鉴权先被限流计数、先打日志",
     "混淆 Gateway 和 Nginx：Nginx 挡大流量、做 TLS 卸载，Gateway 做业务治理，二者叠加而非二选一",
     "以为网关能替代所有服务鉴权：内网服务仍需防绕过（内网隔离 + 下游校验网关注入的头）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：网关三要素 Route/Predicate/Filter，把鉴权、限流、灰度、日志从业务服务剥离并前置；WebFlux 响应式模型下禁止阻塞 IO；Nginx 管流量、Gateway 管治理，可叠加；游戏 HTTP 接入层就是网关思想的野生实现。下一篇讲配置中心：流量进了系统，配置怎么动态管。"
   }
  ]
 },
 {
  "id": "microservice-config-center",
  "title": "配置中心与动态配置",
  "layer": 1,
  "depends": [
   "microservice-registry-center"
  ],
  "covers": [
   "microservice-26",
   "microservice-30",
   "microservice-33"
  ],
  "quiz": [
   "microservice-26",
   "microservice-30",
   "microservice-33"
  ],
  "body": [
   {
    "t": "lead",
    "text": "配置中心解决“配置散落各地、改配置要重启、环境不隔离”三个痛点。Nacos Config 用长轮询/gRPC 推送实现秒级热更新，是游戏数值表热更新的最佳对标物。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Spring Environment 与属性占位符 ${} 的基本用法",
     "做过游戏数值表热更新（导表工具 + 版本号 + 全服推送）",
     "用过 application.yml 多环境 profile"
    ]
   },
   {
    "t": "h",
    "text": "配置管理的演进"
   },
   {
    "t": "p",
    "text": "最初配置写在 application.yml 里，改配置 = 改代码 = 发版重启；后来拆出 dev/test/prod 多环境 profile，但多实例集群要一台台改、改完还要重启，改一个限流阈值都要走发布流程。配置中心把配置外置到集中服务：统一管理、按环境隔离、变更实时推送、支持灰度与回滚、变更有审计。Nacos Config 是 Spring Cloud Alibaba 的标配；Spring Cloud Config 是 Netflix 时代的方案（配 Git 仓库 + Bus 消息总线刷新）；Apollo 是携程开源的强一致配置中心，大厂存量系统用得很多。"
   },
   {
    "t": "h",
    "text": "Nacos Config 核心概念"
   },
   {
    "t": "p",
    "text": "四个核心定位概念：dataId（配置文件名，如 game-server.properties，含文件后缀）、group（分组，默认 DEFAULT_GROUP，同环境不同用途分租）、namespace（命名空间，用于环境隔离：dev/test/prod 各一个 namespace，互相不可见）、配置内容（properties/yaml/json/text）。客户端启动时拉取配置并缓存本地快照（磁盘），即使 Nacos 不可用也能用最后一份快照启动；运行时感知变更靠长轮询（1.x：HTTP 长轮询，请求在服务端挂起约 29.5 秒，有变更立即返回，无变更超时后客户端重新发请求）或 gRPC 长连接（2.x：服务端主动推送，延迟更低）——长轮询把“轮询开销”和“实时性”平衡得很好，远优于傻轮询。"
   },
   {
    "t": "h",
    "text": "热更新原理与 @RefreshScope"
   },
   {
    "t": "p",
    "text": "配置值注入 Bean 有两种方式：@Value(\"${a.b}\") 和 @ConfigurationProperties(prefix=\"...\")。要让配置变更后 Bean 自动刷新，必须标 @RefreshScope：Spring 为它创建代理对象并缓存目标实例，刷新事件触发时清空缓存，下次方法调用走 getBean 用新的 Environment 重新创建——这就是“Bean 销毁重建”的原理。注意两个关键认知：①@RefreshScope 刷新的是 Bean 的重建，不是改已运行线程里的局部变量；②@Value 写在非 RefreshScope 的 Bean 里，拿到的是启动时的旧值，改了不生效。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Nacos 配置中心热更新链路</text>\n<rect x=\"20\" y=\"50\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"85\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">GM 后台</text>\n<text x=\"85\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发布/变更配置</text>\n<path d=\"M150 80 L190 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#ccA)\"/>\n<rect x=\"190\" y=\"50\" width=\"150\" height=\"60\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"265\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Nacos Server</text>\n<text x=\"265\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MySQL 持久化 + 集群同步</text>\n<path d=\"M340 80 L380 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#ccA)\"/>\n<rect x=\"380\" y=\"50\" width=\"130\" height=\"60\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"445\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">应用客户端</text>\n<text x=\"445\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">长轮询/gRPC 监听</text>\n<path d=\"M510 80 L540 80\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#ccA)\"/>\n<rect x=\"540\" y=\"50\" width=\"80\" height=\"60\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"580\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">本地快照</text>\n<text x=\"580\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">磁盘缓存</text>\n<rect x=\"20\" y=\"140\" width=\"600\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">拉取新配置 → 覆盖本地快照 → 发布 EnvironmentChangeEvent</text>\n<text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@RefreshScope Bean 代理缓存清空，下次访问用新 Environment 重建</text>\n<rect x=\"20\" y=\"212\" width=\"600\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"234\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏映射：GM 改配置 → 推送到游戏服 → 监听回调热加载数值表</text>\n<text x=\"320\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">导表工具生成新版本数值表 ≈ 配置发布；版本号比对 ≈ Nacos 的 dataId + MD5 校验</text>\n<text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">区别：大二进制数值表走文件分发，Nacos 适合小型键值配置</text>\n<defs><marker id=\"ccA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 6：Nacos 配置发布与热更新全链路"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 配置热更新：GM 后台开关联动限流阈值\n@RestController\n@RefreshScope // 关键：标注后 Bean 可随配置重建\npublic class RateLimitController {\n\n    @Value(\"${login.rate.limit:2000}\")       // 登录服每秒放行上限\n    private int loginRateLimit;\n\n    @Value(\"${game.activity.switch:false}\")  // 活动开关，热更切换\n    private boolean activitySwitch;\n\n    @GetMapping(\"/config/snapshot\")\n    public Map<String, Object> snapshot() {\n        return Map.of(\"loginRateLimit\", loginRateLimit,\n                      \"activitySwitch\", activitySwitch);\n    }\n}\n\n// @ConfigurationProperties 方式同样支持热更新（Rebinder 重新绑定）\n@ConfigurationProperties(prefix = \"recharge\")\n@RefreshScope\npublic class RechargeProperties {\n    private int connectTimeoutMs = 1000;   // 渠道连接超时\n    private int readTimeoutMs = 3000;      // 渠道读超时\n    // getter/setter 略\n}"
   },
   {
    "t": "h",
    "text": "多环境隔离与安全"
   },
   {
    "t": "p",
    "text": "多环境用 namespace（推荐）或 group 隔离：dev/test/prod 各一个 namespace，生产配置对测试不可见，避免误用。敏感配置（数据库密码、支付密钥、渠道签名）不能明文入库：Nacos 支持自定义加密解密插件（nacos 2.x 内置 AES 加密支持），或结合 Jasypt 把密文放配置中心、密钥放 JVM 参数/KMS，运行时解密。灰度与回滚：配置支持 Beta 发布（先灰度到部分实例验证）、变更历史可回滚。权限：生产 namespace 要配只读权限，谁改配置要有审计记录——游戏里活动开关误配导致全服异常，教训都是这么来的。"
   },
   {
    "t": "h",
    "text": "与 Spring Cloud Config 对比"
   },
   {
    "t": "p",
    "text": "Spring Cloud Config：配置存 Git 仓库，天然支持版本历史、分支、审计；但它本身不推送，需要 Spring Cloud Bus（消息总线）广播 refresh 事件，架构多一跳，且高可用依赖 MQ；变更链路长（Config Server 要读 Git → Bus 广播 → 各服务 refresh）。Nacos Config：内置存储（MySQL）与推送机制（长轮询/gRPC），注册中心 + 配置中心一体，与 Spring Cloud Alibaba 生态无缝，运维一套系统；代价是配置历史/审计能力不如 Git。结论：新项目选 Nacos Config；已有 Spring Cloud Netflix 基建、偏爱 Git 审计的团队可选 Spring Cloud Config + Bus。"
   },
   {
    "t": "pits",
    "items": [
     "@Value 在没加 @RefreshScope 的 Bean 里不刷新：拿到启动时的旧值，改了没反应",
     "长轮询与短轮询讲不清：长轮询 hold 住请求、有变更立即返回、无变更超时重连，兼顾开销与实时",
     "敏感配置明文入库：密码/密钥必须加密或放 KMS，只存密文",
     "配置与代码混淆：配置是运行时可变行为、代码是编译期逻辑，开关别硬编码在代码里，也别把代码逻辑写成配置"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：配置中心把配置外置集中管理，dataId/group/namespace 三件套完成定位与环境隔离；热更新靠长轮询/gRPC 推送 + @RefreshScope Bean 重建；敏感配置要加密、变更要审计、可灰度可回滚；游戏数值表热更新与 Nacos 配置推送是同一套模式，版本号比对等价于 dataId+MD5。下一篇讲分布式协调：ZooKeeper 如何用一棵树管住分布式系统。"
   }
  ]
 },
 {
  "id": "microservice-distributed-coordination",
  "title": "分布式协调基础：ZooKeeper 与 etcd",
  "layer": 1,
  "depends": [
   "microservice-arch-evolution"
  ],
  "covers": [
   "microservice-18",
   "microservice-24",
   "microservice-22"
  ],
  "quiz": [
   "microservice-18",
   "microservice-24",
   "microservice-22"
  ],
  "body": [
   {
    "t": "lead",
    "text": "ZooKeeper 是分布式系统的“协调员”：用一棵带版本和监听的节点树，提供配置存储、分布式锁、选主、命名服务。理解它的数据模型与 Watch 机制，就能看懂 etcd、以及大量基于 ZK 的中间件（Kafka、Dubbo、HBase）。"
   },
   {
    "t": "pre",
    "items": [
     "了解注册中心的基本职责",
     "知道一致性协议分 CP/AP 两类",
     "用过 Linux 文件系统（/ 目录树的概念）"
    ]
   },
   {
    "t": "h",
    "text": "ZK 是什么、解决什么问题"
   },
   {
    "t": "p",
    "text": "ZooKeeper 是一个分布式协调服务，本质是“支持监听的高可用树形文件系统”。它把数据组织成 znode 节点树（路径寻址，如 /game/servers/game-1），每个节点存少量数据（默认 1MB 上限，适合配置和元数据，不适合大数据）并带版本号。核心能力四件套：配置管理（把配置放节点，Watch 监听变化）、命名服务（路径当全局唯一名字）、分布式锁（临时顺序节点）、集群选主（Leader 选举）。ZK 用 ZAB 协议保证强一致（CP），数据写主副本、多数派确认，Leader 选举期间短暂不可用——这是它的正确性来源，也是它的可用性短板。"
   },
   {
    "t": "h",
    "text": "数据模型：znode 的类型"
   },
   {
    "t": "p",
    "text": "znode 分两类维度组合出四种节点：持久节点（手动删除才消失，存配置）、临时节点（创建它的会话断开自动消失，存服务在线状态）、持久顺序节点、临时顺序节点（创建时自动追加单调递增序号，/locks/lock-0000000001）。选主和分布式锁都依赖“临时 + 顺序”两个特性：临时保证会话断了锁自动释放（不会死锁），顺序保证公平排队（FIFO）。节点数据带 stat 元信息（版本号、时间戳、zxid），支持 CAS 条件更新（版本号对不上写失败）——这是分布式下的乐观锁。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">ZooKeeper 树形数据模型与节点类型</text>\n<line x1=\"320\" y1=\"60\" x2=\"180\" y2=\"95\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"320\" y1=\"60\" x2=\"320\" y2=\"95\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"320\" y1=\"60\" x2=\"460\" y2=\"95\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"320\" cy=\"50\" r=\"16\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"55\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">/</text>\n<circle cx=\"180\" cy=\"105\" r=\"15\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"180\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">game</text>\n<line x1=\"165\" y1=\"118\" x2=\"130\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"195\" y1=\"118\" x2=\"230\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<rect x=\"60\" y=\"150\" width=\"140\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"130\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">servers（持久）</text>\n<rect x=\"180\" y=\"150\" width=\"140\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"250\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">config（持久）</text>\n<circle cx=\"320\" cy=\"105\" r=\"15\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">locks</text>\n<line x1=\"320\" y1=\"118\" x2=\"320\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<rect x=\"255\" y=\"150\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">lock-0000000001（临时顺序）</text>\n<circle cx=\"460\" cy=\"105\" r=\"15\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"460\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">election</text>\n<line x1=\"445\" y1=\"118\" x2=\"420\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<rect x=\"360\" y=\"150\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"425\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">master-0000000002（临时顺序）</text>\n<rect x=\"30\" y=\"210\" width=\"580\" height=\"74\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Watch 机制：注册监听 → 节点变化 → 一次性通知 → 客户端重读数据</text>\n<text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">锁/选主用临时顺序节点：会话断开自动释放、序号最小者获胜、Watch 前一个节点避免惊群</text>\n<text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">等etd 对应：Lease 租约 ≈ 临时节点，Watch 流式监听 ≈ 一次性 Watch 的进化版</text>\n</svg>",
    "caption": "图 7：ZK 树形模型、节点类型与 Watch 机制"
   },
   {
    "t": "h",
    "text": "Watch 机制：观察-通知"
   },
   {
    "t": "p",
    "text": "客户端可在节点上注册 Watch（监听器），节点数据变化、子节点变化、节点删除都会触发一次性通知——Watch 是一次性的，收到通知后必须重新注册才能继续监听。这就是 ZK 做服务发现的基础：Consumer 监听服务节点下的子节点，子节点增删时收到通知，刷新本地列表。两个关键细节：①Watch 只保证“告诉你变了”，不保证“通知时数据是最新的”，收到通知后要主动再读一次数据；②一次性 + 网络可能丢，生产实现通常还要配合定时拉取兜底（比如 Dubbo 注册中心挂了用本地缓存）。"
   },
   {
    "t": "h",
    "text": "三大经典用法"
   },
   {
    "t": "list",
    "items": [
     "分布式锁：创建临时顺序节点，判断自己是不是序号最小的，是则获锁；否则 Watch 前一个节点，等它删除后重试——公平锁、无惊群（只等前一个）、会话断开自动释放",
     "选主（Leader 选举）：所有候选者创建临时顺序节点，序号最小的当 Leader，其余 Watch 它；Leader 挂了会话断开节点消失，前一个顶上——不需要额外加锁",
     "命名服务：/game/server- 前缀 + 顺序节点，创建即获得全局唯一名字（等价于雪花 ID 之外的自增命名方案）"
    ]
   },
   {
    "t": "h",
    "text": "与 etcd 对比"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "ZooKeeper",
     "etcd"
    ],
    "rows": [
     [
      "一致性协议",
      "ZAB（类似 Raft 的两阶段）",
      "Raft（多数派选举）"
     ],
     [
      "数据模型",
      "树形 znode + stat 版本",
      "key-value + 前缀查询"
     ],
     [
      "Watch",
      "一次性通知，需重注册",
      "gRPC 流式 Watch，持续监听"
     ],
     [
      "临时节点",
      "会话断开自动删除",
      "Lease 租约到期自动删除"
     ],
     [
      "API",
      "Java 客户端为主",
      "gRPC 原生，云原生友好"
     ],
     [
      "生态",
      "Dubbo/Kafka/HBase 传统生态",
      "Kubernetes 存储层"
     ]
    ]
   },
   {
    "t": "p",
    "text": "etcd 是云原生时代的 ZK 替代品：一致协议用 Raft（比 ZAB 更易理解），API 用 gRPC + 流式 Watch，租约机制对应临时节点。Kubernetes 的存储层就是 etcd。对比结论：ZK 老牌成熟、生态广；etcd 现代、gRPC 原生、与云原生集成好。新项目选 etcd，存量系统跟着生态走。"
   },
   {
    "t": "h",
    "text": "游戏场景：协调无处不在"
   },
   {
    "t": "p",
    "text": "游戏项目里 ZK/协调思想处处可见：跨服战匹配的 Leader 选主（谁负责组织对战、谁仲裁结果）、合服操作的分布式锁（防止两个 GM 同时合服导致数据错乱）、公共配置的下发（活动开关、跨服黑名单）。Kafka 早期版本用 ZK 管 Broker 元数据与分区分配，正是 ZK 协调能力的典型应用。邓凡可以这样讲：我用 Redis 做分布式锁，但面试里我能讲清 ZK 锁为什么正确性更高——临时节点 + 顺序 + Watch，没有时钟依赖，GC 停顿也不会造成误删，正确性敏感的操作（合服、跨服结算）应该用 ZK/etcd 锁或数据库唯一约束兜底。"
   },
   {
    "t": "pits",
    "items": [
     "忘记 Watch 是一次性的：不重新注册就收不到后续通知，只能靠定时拉取兜底",
     "把临时节点当持久用：进程一挂数据没了——这恰恰是特性，服务状态就该这样",
     "说 ZK 是 AP：ZK 是 CP，Leader 选举期间短暂不可用，这就是“宁可不可用也不出错”",
     "用 ZK 存大数据：1MB 上限，大配置放数据库/文件，ZK 只放元数据"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：ZK 是带监听的高可用树，四类 znode 支撑配置、命名、锁、选主；Watch 一次性、收到后重读；临时顺序节点是无死锁公平锁与无惊群选主的关键；etcd 用 Raft + gRPC + Lease 成为云原生替代；游戏合服/跨服选主就是协调服务的实战场景。下一篇进入分布式事务：跨库跨服的一致性问题怎么解。"
   }
  ]
 },
 {
  "id": "microservice-distributed-transaction",
  "title": "分布式事务：从 XA 到 Seata 到最终一致",
  "layer": 2,
  "depends": [
   "microservice-remote-call",
   "microservice-distributed-coordination"
  ],
  "covers": [
   "microservice-12",
   "microservice-13",
   "microservice-17"
  ],
  "quiz": [
   "microservice-12",
   "microservice-17",
   "microservice-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "分布式事务没有银弹：从强一致的 XA，到无侵入的 Seata AT，到业务侵入大的 TCC，再到工程上最实用的最终一致性。理解“每种方案在强一致、性能、侵入性上的取舍”，是分布式系统面试的分水岭。"
   },
   {
    "t": "pre",
    "items": [
     "理解 ACID 与本地事务（MySQL 事务、行锁）",
     "理解 CAP/BASE 理论",
     "做过支付服充值回调处理（渠道回调、幂等、发货）"
    ]
   },
   {
    "t": "h",
    "text": "问题定义：为什么本地事务不够"
   },
   {
    "t": "p",
    "text": "单体时代一个事务搞定订单+库存+积分。微服务拆开后，订单在 order-service、库存跨库、积分在另一个服务，本地事务无法覆盖多个库/多个服务——一个 MySQL 事务只能约束一个连接一个库。跨服务事务要么靠分布式事务协议（XA/Seata），要么接受最终一致性（消息+对账）。先记住选型总纲：强一致低频用 XA/Seata AT，核心高频链路用 TCC，非核心链路用消息最终一致。"
   },
   {
    "t": "h",
    "text": "XA 与 2PC"
   },
   {
    "t": "p",
    "text": "2PC（两阶段提交）：协调者（TM）先问所有参与者（RM）“能否提交”——各参与者执行本地事务但不提交（持锁，等待指令）；全部同意则第二阶段统一提交，任一拒绝则全部回滚。XA 是数据库层的 2PC 标准实现。三个致命缺点：①同步阻塞——资源锁从一阶段一直持到二阶段，时间长、并发低；②协调者单点——协调者挂了所有事务卡住；③极端情况数据不一致——协调者在二阶段宕机，有的参与者提交了有的没提交。因为持锁时间长，高并发场景基本不用于核心链路。"
   },
   {
    "t": "h",
    "text": "Seata AT 模式：无侵入的改进版 2PC"
   },
   {
    "t": "p",
    "text": "Seata 三大角色：TC（事务协调器，独立部署的服务）、TM（事务管理器，全局事务发起方）、RM（资源管理器，各服务内的数据源代理）。AT 模式一阶段：RM 拦截业务 SQL，解析 SQL 记录 before image（改动前数据）和 after image（改动后数据）写入 undo_log 表，注册分支事务并申请全局锁，然后本地事务直接提交——不等其他分支，这是比 XA 快的关键：不长时间持锁。二阶段提交：TC 通知各 RM 异步删除 undo_log（很快，几乎无阻塞）。二阶段回滚：RM 用 before image 对比当前数据（after image 校验防脏写），生成反向 SQL 恢复现场。全局锁解决的是写隔离：两个全局事务改同一行时串行化，防止交叉修改导致 undo_log 回滚错乱。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Seata AT 模式两阶段流程</text>\n<rect x=\"240\" y=\"40\" width=\"160\" height=\"50\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">TC 事务协调器</text>\n<text x=\"320\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">独立部署，维护全局事务状态</text>\n<rect x=\"60\" y=\"40\" width=\"150\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"135\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">TM 事务管理器</text>\n<text x=\"135\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@GlobalTransactional 发起方</text>\n<rect x=\"430\" y=\"40\" width=\"150\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"505\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">RM 资源管理器</text>\n<text x=\"505\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">各服务内数据源代理</text>\n<line x1=\"210\" y1=\"65\" x2=\"240\" y2=\"65\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#stA)\"/>\n<line x1=\"400\" y1=\"65\" x2=\"430\" y2=\"65\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#stA)\"/>\n<rect x=\"30\" y=\"115\" width=\"580\" height=\"62\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"137\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">一阶段：解析 SQL → 记 before/after image 到 undo_log → 注册分支+申请全局锁 → 本地事务提交</text>\n<text x=\"320\" y=\"161\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">关键：业务数据与 undo_log 同一本地事务提交，不等其他分支——比 XA 快的根因</text>\n<rect x=\"30\" y=\"195\" width=\"280\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"217\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">二阶段-提交：异步删除 undo_log</text>\n<text x=\"170\" y=\"241\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数据已提交，只做清理，几乎无阻塞</text>\n<rect x=\"330\" y=\"195\" width=\"280\" height=\"62\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"217\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">二阶段-回滚：镜像对比+反向 SQL</text>\n<text x=\"470\" y=\"241\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">after image 校验防脏写，before image 生成反向 SQL</text>\n<rect x=\"30\" y=\"278\" width=\"580\" height=\"36\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"301\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">选型：AT 无侵入适合低频/管理链路；TCC 无全局锁适合高并发核心链路；Saga 适合长流程补偿</text>\n<defs><marker id=\"stA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 8：Seata AT 模式三角色与两阶段"
   },
   {
    "t": "h",
    "text": "Seata TCC 模式"
   },
   {
    "t": "p",
    "text": "TCC 把分布式事务拆成三个业务方法：Try（检查并预留资源，如冻结库存/冻结余额）、Confirm（确认执行，真正扣减）、Cancel（释放预留）。优点：无全局锁、无长事务、并发高，适合下单扣库存、支付这类核心高频链路；缺点：业务侵入大——每个接口要写三套逻辑，还要处理空回滚（Try 没执行 Cancel 先到了）与悬挂（Cancel 之后 Try 才执行），用事务状态表记录各分支状态解决。选型一句话：AT 无侵入适合快速落地和低频链路，TCC 高性能适合核心高频链路。"
   },
   {
    "t": "h",
    "text": "Saga 模式"
   },
   {
    "t": "p",
    "text": "Saga 适合长流程（跨多个服务、每个服务都是最终一致操作）：把长事务拆成多个本地事务，每个事务完成后发布事件触发下一个；失败时执行反向补偿操作（如先扣款后发奖，发奖失败则退款）。特点是适合业务流程长、对中间状态可接受的场景（下单→支付→发货→确认收货），靠编排器（Orchestration）或事件驱动（Choreography）实现。注意区分：Saga 的 Cancel 是“补偿”而不是“回滚”——已扣的钱要靠退款操作补回来，不是把数据翻回原样。"
   },
   {
    "t": "h",
    "text": "可靠消息最终一致：最常用的工程方案"
   },
   {
    "t": "p",
    "text": "对“允许最终一致”的链路（下单后发积分、充值后统计、发货后通知），用“本地消息表”或“MQ 事务消息”：①本地消息表：业务操作与消息记录在同一个本地事务提交（同库同事务），定时任务扫描待发送消息投递 MQ，下游消费幂等，失败重试，定期对账兜底；②RocketMQ 事务消息：先发半消息，本地事务成功后确认，回查机制兜底。核心原则四句话：先落本地、异步同步、失败有兜底、消费必须幂等。"
   },
   {
    "t": "h",
    "text": "游戏服跨服结算与支付对账"
   },
   {
    "t": "p",
    "text": "游戏跨服结算（跨服战奖励、合服数据合并）：本质是跨库跨服的一致性问题——正确姿势不是全局强一致，而是“以源服为准的最终一致”：主服事务提交，生成结算快照（带场次 ID），各服异步消费快照入账，重复消息用 场次ID+服ID+玩家ID 唯一键幂等。支付对账：充值回调发货用本地消息表或唯一流水号幂等，发货放本地事务；每日对账任务对比支付渠道流水与本地订单，状态不一致自动修复/告警——这是充值系统的生死线。邓凡的核心话术：游戏充值链路，我不上 2PC——玩家付了钱必须发货，但发货和统计之间允许晚几秒一致，本地消息表 + 幂等 + 对账就是最优解。这个回答把“懂业务”和“懂技术”同时展示出来了。"
   },
   {
    "t": "pits",
    "items": [
     "一上来就选强一致方案：先问业务是否允许最终一致，多数链路都允许，强一致是少数刚需",
     "把 2PC 当万金油：同步阻塞持锁，高并发核心链路不能用，协调者单点还要单独高可用",
     "TCC 不做幂等：Confirm/Cancel 必须幂等，重试重放会出乱子",
     "本地消息表讲成“先发消息再写库”：业务与消息必须同库同事务，否则消息发了业务没成就是假消息"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分布式事务按“强一致/性能/侵入”三维选型——XA/2PC 强一致但阻塞，Seata AT 无侵入快速落地，TCC 高性能但侵入大，Saga 长流程补偿，本地消息表+对账是最实用的最终一致方案；游戏跨服结算以源服为准、支付对账靠幂等+对账兜底。下一篇讲分布式锁：防并发的最后一道闸。"
   }
  ]
 },
 {
  "id": "microservice-distributed-lock",
  "title": "分布式锁实战：Redisson 与选型",
  "layer": 2,
  "depends": [
   "microservice-distributed-coordination"
  ],
  "covers": [
   "microservice-22",
   "microservice-23"
  ],
  "quiz": [
   "microservice-22",
   "microservice-23",
   "microservice-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "分布式锁是“跨进程的 synchronized”。从裸 SET NX 的三大坑，到 Redisson 看门狗，再到 ZK 锁与 RedLock 的争议，这一篇把分布式锁的原理、坑与选型一次讲透。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 Redis 基本命令（SET NX EX、Lua）",
     "理解线程锁 synchronized/ReentrantLock 的原理",
     "做过 GM 后台发奖、合服等需要防并发的操作"
    ]
   },
   {
    "t": "h",
    "text": "为什么需要分布式锁"
   },
   {
    "t": "p",
    "text": "单机 synchronized/ReentrantLock 只在本进程内有效。GM 后台两个管理员同时点“全服发奖”、两个服务实例同时跑同一定时任务、合服脚本同时被执行、充值回调“查订单→发货”先查后写——这些操作跨进程，需要一把“所有进程都认的锁”。Redis 是天然的选择：单线程执行命令保证原子性，SET NX EX 一条命令解决“加锁 + 过期”，性能比 ZK/数据库锁高一两个数量级。"
   },
   {
    "t": "h",
    "text": "裸 SET NX 的三大坑"
   },
   {
    "t": "list",
    "items": [
     "坑一 误删锁：线程 A 加锁后执行慢，锁过期；线程 B 加锁成功；A 执行完 del 把 B 的锁删了，导致并发。解决：value 存线程/请求唯一标识，删除前用 Lua 比对，是自己的才删",
     "坑二 过期时间难定：设短了业务没跑完锁没了，设长了持有者宕机后死锁。任何固定值都尴尬——这是看门狗要解决的根因",
     "坑三 不可重入：同一线程内嵌套加锁直接死锁",
     "坑四 无重试机制：抢不到锁直接失败，没有等待重试"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 裸 SET NX EX 的安全释放：Lua 保证“比对+删除”原子\n// KEYS[1]=锁key  ARGV[1]=唯一标识  ARGV[2]=过期ms\n// 加锁\nString uuid = UUID.randomUUID().toString();\nBoolean locked = redisTemplate.opsForValue()\n        .setIfAbsent(\"lock:gift:\" + playerId, uuid, Duration.ofSeconds(30));\nif (Boolean.TRUE.equals(locked)) {\n    try {\n        doDeliverGift(playerId); // 业务逻辑（锁内只做必须的临界操作）\n    } finally {\n        // 释放锁：只有 value 是自己时才删，防止误删别人的锁\n        String lua = \"if redis.call('get', KEYS[1]) == ARGV[1] \" +\n                     \"then return redis.call('del', KEYS[1]) else return 0 end\";\n        redisTemplate.execute(new DefaultRedisScript<Long>(lua, Long.class),\n                List.of(\"lock:gift:\" + playerId), uuid);\n    }\n}"
   },
   {
    "t": "h",
    "text": "Redisson 看门狗"
   },
   {
    "t": "p",
    "text": "Redisson 把裸锁的坑全部解决：加锁默认租约 30 秒；后台看门狗线程每 10 秒（租约的 1/3）检查持有方是否存活，存活就续期回 30 秒——业务跑多久锁续多久；持有者宕机则看门狗线程随之消亡，停止续期，锁自然过期释放，既不死锁也不提前释放。可重入用 Hash 结构实现：field 是线程标识，value 是重入次数，Lua 脚本原子判断“不存在则建 / 是本线程则计数+1”。关键注意点：如果手动指定了 leaseTime，看门狗不会续期，租约够不够长完全由你负责——这是 Redisson 最常见的误用。"
   },
   {
    "t": "h",
    "text": "主从问题与红锁争议"
   },
   {
    "t": "p",
    "text": "Redis 单主模型有个固有缺陷：加锁只写主节点，若主宕机、锁还没同步到从节点，主从切换后锁就丢了——别的客户端拿到锁，原持有者还在跑。红锁（RedLock）想解决：向 N 个相互独立的 Redis 主节点顺序加锁，多数派（N/2+1）成功才算拿到锁，释放时全部释放。但 Martin Kleppmann 指出了致命问题：客户端进程 GC 停顿或系统时钟跳变会破坏“锁过期时间”这个时间假设——GC 停顿几秒期间锁已经过期，另一个客户端拿到锁，原客户端恢复后还以为自己持有，多数派模型挡不住这种全局暂停。Antirez 反驳过，但社区共识是：对正确性要求极高的场景用 ZK/etcd 锁（临时节点+会话，无时钟依赖）或数据库唯一约束/fencing token 兜底；一般场景单主 Redisson 足够，配合业务幂等兜底。"
   },
   {
    "t": "h",
    "text": "ZK 锁与数据库锁"
   },
   {
    "t": "p",
    "text": "ZK 锁：临时顺序节点 + Watch 前一个节点，公平、无惊群、会话断开自动释放，正确性高于 Redis 锁，代价是每次加锁几次网络往返、性能低。数据库锁三件套：乐观锁（版本号 CAS：UPDATE ... SET version=version+1 WHERE id=? AND version=?）、悲观锁（SELECT ... FOR UPDATE，事务内持锁）、唯一索引（天然幂等兜底，插入即抢锁）。数据库锁性能最低但最可靠，适合低频管理操作（合服、导数据）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 310\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">分布式锁方案对比</text>\n<rect x=\"20\" y=\"42\" width=\"145\" height=\"220\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"92\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">裸 SET NX</text>\n<text x=\"92\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">加锁一条命令</text>\n<text x=\"92\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">误删锁</text>\n<text x=\"92\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">过期难定</text>\n<text x=\"92\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不可重入</text>\n<text x=\"92\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不可重试</text>\n<text x=\"92\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">坑全踩遍</text>\n<rect x=\"177\" y=\"42\" width=\"145\" height=\"220\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"249\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">Redisson ★</text>\n<text x=\"249\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">看门狗自动续期</text>\n<text x=\"249\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Lua 唯一标识防误删</text>\n<text x=\"249\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Hash 可重入</text>\n<text x=\"249\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">tryLock 可等待重试</text>\n<text x=\"249\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">一般场景首选</text>\n<rect x=\"334\" y=\"42\" width=\"145\" height=\"220\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"406\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">ZK / etcd 锁</text>\n<text x=\"406\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">临时顺序节点</text>\n<text x=\"406\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">会话断开自动释放</text>\n<text x=\"406\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无时钟依赖</text>\n<text x=\"406\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">性能低</text>\n<text x=\"406\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\" font-weight=\"bold\">正确性最高</text>\n<rect x=\"491\" y=\"42\" width=\"130\" height=\"220\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"556\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">数据库锁</text>\n<text x=\"556\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">唯一索引兜底</text>\n<text x=\"556\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">乐观锁版本号</text>\n<text x=\"556\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">悲观锁 FOR UPDATE</text>\n<text x=\"556\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">最可靠性能最低</text>\n<rect x=\"20\" y=\"276\" width=\"601\" height=\"30\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"296\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">铁律：分布式锁是预防，数据库唯一约束/状态机才是兜底；锁粒度越小并发越高</text>\n</svg>",
    "caption": "图 9：四种分布式锁方案对比"
   },
   {
    "t": "h",
    "text": "锁粒度设计"
   },
   {
    "t": "p",
    "text": "锁粒度越小并发越高：全服级锁（key=serverId）串行化整个服务器的相关操作，玩家级锁（key=playerId）只锁单个玩家。正确设计：GM 发奖按玩家粒度加锁（一个玩家一个 key）；合服按区服粒度；充值回调按订单号/流水号加锁；全服排行榜结算这种长任务宁可单节点串行跑，也不要抢全局分布式锁。锁内只做必须的临界操作，别在锁里调 RPC、别在锁里做重计算——持锁时间越短越好，因为所有竞争这把锁的请求都在等。游戏场景还要注意：锁的 key 要带业务维度前缀避免冲突，如 lock:gift:{playerId}、lock:merge:{serverId}。"
   },
   {
    "t": "pits",
    "items": [
     "用 SETNX 不设过期时间：持有者宕机即死锁，Redis 都救不了",
     "解锁不比对唯一标识：误删别人的锁，等于锁形同虚设",
     "锁里做重操作：持锁调 RPC/重计算，锁时间被拉爆，并发直接归零",
     "迷信 RedLock：讲选型先讲 GC 停顿和时钟问题，再说多数派挡不住时间假设破坏",
     "用分布式锁替代唯一约束：锁是预防、约束是兜底，两个都要有"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分布式锁三问——用什么存（Redis 性能/ZK 正确性/DB 兜底）、怎么防误删（唯一标识+Lua）、怎么续期（Redisson 看门狗，别手动配 leaseTime）；主从切换丢锁是单主模型固有缺陷，正确性敏感场景换 ZK 或加唯一约束；锁粒度越小越好，锁内只做临界操作。下一篇讲熔断限流降级：把故障挡在门外。"
   }
  ]
 },
 {
  "id": "microservice-circuit-breaker",
  "title": "熔断、限流、降级：流量治理三板斧",
  "layer": 2,
  "depends": [
   "microservice-remote-call",
   "microservice-api-gateway"
  ],
  "covers": [
   "microservice-07",
   "microservice-11",
   "microservice-19",
   "microservice-29"
  ],
  "quiz": [
   "microservice-07",
   "microservice-11",
   "microservice-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "限流守入口、熔断断调用链、降级做取舍——这三板斧是微服务防雪崩的完整体系。理解每个概念的触发条件与保护对象，以及 Sentinel 的限流算法与熔断状态机，是架构级面试的必考内容。"
   },
   {
    "t": "pre",
    "items": [
     "理解线程模型：工作线程池被慢调用占满会怎样",
     "做过支付渠道超时切换备用渠道的运维",
     "了解服务雪崩的机理（下游慢→上游线程耗尽→向上扩散）"
    ]
   },
   {
    "t": "h",
    "text": "三个概念先定界"
   },
   {
    "t": "p",
    "text": "面试官专门在这挖坑：熔断和降级经常被混为一谈。三者的准确定界：限流（Rate Limiting）是入口侧主动控制单位时间请求量，防止突发流量打垮系统，是主动防御；熔断（Circuit Breaker）是调用下游持续失败时自动切断调用，进入开路状态快速失败，保护的是调用方，防止线程被下游拖死，是被动响应；降级（Degradation）是整体资源紧张时主动关闭或简化非核心功能给核心链路让路（返回缓存数据、默认值），降级可以是手动开关，也可以是熔断触发的 fallback 兜底逻辑。三者关系：限流守前门，熔断断后链，降级做取舍，经常组合使用。"
   },
   {
    "t": "h",
    "text": "限流算法：令牌桶、漏桶、滑动窗口"
   },
   {
    "t": "p",
    "text": "滑动窗口（Sentinel 统计用）：把时间切成小格子（如 1 秒切 10 个 100ms 窗口），统计当前滑动窗口内的请求总数，比固定窗口边界更平滑——固定窗口在边界处可能瞬时放行 2 倍流量，滑动窗口则按格子滚动，精度取决于格子数。漏桶：请求先进入固定容量的桶，以恒定速率流出处理——流量整形，输出平滑，但突发请求只能排队，无法利用空闲资源。令牌桶：以恒定速率生成令牌放入桶中，请求取到令牌才能通过——允许桶内积攒令牌应对突发，兼顾平滑与突发能力，是网关限流的主流（Gateway 的 RequestRateLimiter 就是基于 Redis + Lua 的令牌桶）。Sentinel 的 Warm Up（冷启动）就是令牌桶变体：初始阈值低，随时间平滑升到设定阈值，防止冷系统被突发流量瞬间打垮。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 310\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">三种限流算法对比</text>\n<rect x=\"20\" y=\"45\" width=\"195\" height=\"150\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">滑动窗口</text>\n<text x=\"117\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">1 秒切成 10 个 100ms 格子</text>\n<text x=\"117\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">统计窗口内总请求数</text>\n<text x=\"117\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">边界平滑，无突刺</text>\n<text x=\"117\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">格子越细精度越高</text>\n<text x=\"117\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">Sentinel 统计基础</text>\n<rect x=\"225\" y=\"45\" width=\"195\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">漏桶</text>\n<text x=\"322\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">桶容量固定</text>\n<text x=\"322\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">恒定速率流出处理</text>\n<text x=\"322\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">流量整形，输出平滑</text>\n<text x=\"322\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">突发只能排队</text>\n<text x=\"322\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">Sentinel 匀速排队</text>\n<rect x=\"430\" y=\"45\" width=\"195\" height=\"150\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"527\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">令牌桶</text>\n<text x=\"527\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">恒定速率生成令牌</text>\n<text x=\"527\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">取到令牌才能通过</text>\n<text x=\"527\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">攒令牌应对突发</text>\n<text x=\"527\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">平滑+突发兼顾</text>\n<text x=\"527\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">网关限流主流</text>\n<rect x=\"20\" y=\"215\" width=\"605\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"238\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">开服洪峰三板斧</text>\n<text x=\"322\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">网关/Nginx IP 级限流防刷 → 登录服令牌桶排队平滑放行 → 非核心接口（公告/跑马灯）降级关闭</text>\n<text x=\"322\" y=\"280\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录服无状态水平扩容，登录成功 token 分流到各游戏服</text>\n</svg>",
    "caption": "图 10：滑动窗口/漏桶/令牌桶算法与开服应对"
   },
   {
    "t": "h",
    "text": "Sentinel 的实现骨架"
   },
   {
    "t": "p",
    "text": "Sentinel 核心是 资源（Resource）+ 规则（Rule）+ 责任链（ProcessorSlotChain）。请求进入资源时走一串 Slot：NodeSelectorSlot（统计节点）、ClusterBuilderSlot（集群统计）、StatisticSlot（用滑动窗口 LeapArray 统计 pass/block/RT）、FlowSlot（按限流规则判断放行）、DegradeSlot（熔断降级判断）。所有指标实时统计在滑动窗口里，规则判断时读统计结果——这就是为什么 Sentinel 的限流是实时的、可秒级调整的。与 Hystrix 相比，Sentinel 流量控制维度更丰富（QPS/并发线程数/关联流量/热点参数）、无额外线程池、控制台实时下发规则，且 Hystrix 2018 年已停更——新系统无条件选 Sentinel。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">熔断器三态状态机</text>\n<circle cx=\"130\" cy=\"120\" r=\"62\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2.5\"/>\n<text x=\"130\" y=\"112\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">CLOSED</text>\n<text x=\"130\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">正常放行+统计</text>\n<circle cx=\"320\" cy=\"120\" r=\"62\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2.5\"/>\n<text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">OPEN</text>\n<text x=\"320\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">快速失败+冷却计时</text>\n<circle cx=\"510\" cy=\"120\" r=\"62\" fill=\"var(--bg)\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/>\n<text x=\"510\" y=\"106\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">HALF-OPEN</text>\n<text x=\"510\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">放行少量试探请求</text>\n<path d=\"M192 100 C 230 70, 260 70, 258 96\" stroke=\"var(--lv3)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#cbA)\"/>\n<text x=\"225\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">错误率/慢调用超阈值</text>\n<path d=\"M382 100 C 420 70, 450 70, 448 96\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#cbA)\"/>\n<text x=\"415\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">冷却期结束</text>\n<path d=\"M448 144 C 420 176, 390 176, 388 150\" stroke=\"var(--lv1)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#cbA)\"/>\n<text x=\"415\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">试探成功→关闭</text>\n<path d=\"M448 150 C 410 200, 350 200, 336 190\" stroke=\"var(--lv3)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#cbA)\"/>\n<text x=\"360\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">试探失败→重新打开</text>\n<rect x=\"30\" y=\"224\" width=\"580\" height=\"24\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1\"/>\n<text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">触发条件（Sentinel 三策略）：慢调用比例 / 异常比例 / 异常数</text>\n<defs><marker id=\"cbA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n</svg>",
    "caption": "图 11：熔断器 Closed/Open/Half-Open 状态机"
   },
   {
    "t": "h",
    "text": "熔断器状态机"
   },
   {
    "t": "p",
    "text": "三态：Closed（关闭）：正常调用并统计指标；错误率/慢调用比例/异常数超过阈值 → 转 Open（打开）：所有请求快速失败（不真正调用下游），开始冷却计时；冷却期结束 → 进 Half-Open（半开）：放行少量试探请求，成功则回 Closed，失败则回 Open 继续冷却。半开机制是自愈的核心：避免了因一次短暂故障被永久切断，也给下游留了恢复窗口。游戏场景：购买服调第三方支付渠道——错误率超阈值自动熔断切备用渠道，冷却期后试探恢复，这就是保护调用方线程不被渠道拖死的标准姿势。"
   },
   {
    "t": "h",
    "text": "隔离策略：线程池隔离 vs 信号量隔离"
   },
   {
    "t": "p",
    "text": "隔离是防止故障扩散到整个服务的关键：线程池隔离（Hystrix 风格）——给不同下游分配独立线程池，一个下游挂了最多耗尽自己的池子，彻底但线程切换有开销，适合耗时外部调用；信号量隔离（Sentinel 风格）——靠计数器限制并发数，无线程切换、轻量，适合内部快速调用。游戏里的天然实践：用 Disruptor/业务线程组把登录、战斗、支付回调拆开，单点阻塞不拖垮主循环——这就是“隔离思想”在游戏架构里的落地，面试时把这段讲出来比背参数高一个档次。"
   },
   {
    "t": "h",
    "text": "降级预案"
   },
   {
    "t": "list",
    "items": [
     "按业务优先级分级：P0 核心链路（登录、战斗、支付）绝不降级；P1 重要但可延迟（排行榜、邮件、活动入口）；P2 锦上添花（跑马灯、分享、统计上报）",
     "开关放配置中心：@Value + @RefreshScope 或自定义开关工具，秒级全服生效，绝不做成发版才能改的硬编码",
     "降级手段库：返回缓存/默认值（读降级）、异步改同步拒绝（写降级：先收单后补）、关闭非核心接口、限流收紧、排队机制",
     "演练：故障注入（chaos 思想）——故意停日志服验证游戏服不受影响、给支付渠道注入延迟验证熔断生效，预案不演练等于没有"
    ]
   },
   {
    "t": "pits",
    "items": [
     "把熔断和降级混为一谈：熔断是自动切断故障调用、保护调用方；降级是主动取舍、简化响应，二者触发来源不同",
     "只背限流算法定义不讲适用场景：滑动窗口数格子、漏桶匀速整形、令牌桶攒突发，网关主流是令牌桶",
     "没有超时就谈熔断：超时是第一层、熔断是第二层，先杜绝无限等待再谈自动切断",
     "降级返回的数据不标注：缓存/默认值必须明确标注非实时，避免业务误当真实数据用"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：限流守入口（滑动窗口统计+令牌桶整形）、熔断断调用链（三态状态机+超时）、降级做取舍（P0/P1/P2 分级+配置开关）；Sentinel 责任链+滑动窗口是流量治理的事实标准；游戏开服组合拳是网关限流+登录排队+非核心降级。下一篇讲链路追踪：故障发生了，怎么快速找到它。"
   }
  ]
 },
 {
  "id": "microservice-tracing",
  "title": "链路追踪：TraceId 串起整个调用链",
  "layer": 2,
  "depends": [
   "microservice-remote-call",
   "microservice-api-gateway"
  ],
  "covers": [
   "microservice-28",
   "microservice-02"
  ],
  "quiz": [
   "microservice-28"
  ],
  "body": [
   {
    "t": "lead",
    "text": "一个请求穿越登录服、游戏服、支付服、日志服，出问题怎么快速定位？链路追踪用一个 TraceId 把全程串成一棵树。理解 Trace/Span 模型、跨进程透传和 SkyWalking 的字节码增强原理，是排障能力的分水岭。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉一次请求的完整路径（网关→服务→DB→返回）",
     "用 MDC 在日志里打过线程上下文",
     "理解 HTTP Header、RPC attachment、MQ 消息属性的概念"
    ]
   },
   {
    "t": "h",
    "text": "为什么需要链路追踪"
   },
   {
    "t": "p",
    "text": "单体时代看一个日志文件就能定位问题。微服务化后，一次请求可能调用 5 个服务、经过 3 层网络、写 4 个数据库，日志散落在几十个进程里——没有关联 ID，定位一个慢请求等于大海捞针。链路追踪的价值：①故障定界——拓扑图里直接看出哪个服务变红；②慢调用定位——链路里哪个 Span 耗时异常一目了然；③全链路日志关联——用 TraceId 把各服务日志瞬间串起来。开服活动出问题，运营催着修复，链路追踪能帮你 5 分钟找到根因而不是 50 分钟。"
   },
   {
    "t": "h",
    "text": "数据模型：Trace 与 Span"
   },
   {
    "t": "p",
    "text": "Trace 是一次完整请求链路，有全局唯一的 TraceId。Span 是链路中的一个工作单元（一次 RPC、一次 DB 查询、一个方法调用），包含 SpanId、父 SpanId（ParentId）、起止时间、标签（tag）、日志（log）。靠 ParentId 把 Span 拼成树：入口 Span 是根，RPC 调用产生的下游 Span 挂在父 Span 下。SkyWalking 还有 Segment 概念（一个进程内所有 Span 的集合）。模型一句话：TraceId 是快递单号，SpanId 是每个中转站的扫描记录——单号跟着包裹走，哪一站卡了一扫就知道。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Trace 调用链：TraceId + ParentId 还原调用树</text>\n<rect x=\"30\" y=\"45\" width=\"580\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"61\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">TraceId = 32a3f9c0...（全局唯一，贯穿所有服务）</text>\n<text x=\"320\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">网关入口生成 → Header/MQ 属性/attachment 透传到每一跳</text>\n<rect x=\"60\" y=\"100\" width=\"160\" height=\"42\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"140\" y=\"117\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">网关 EntrySpan</text>\n<text x=\"140\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SpanId=1 根节点</text>\n<line x1=\"220\" y1=\"121\" x2=\"270\" y2=\"121\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#trA)\"/>\n<rect x=\"270\" y=\"100\" width=\"160\" height=\"42\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"350\" y=\"117\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">登录服 Span</text>\n<text x=\"350\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SpanId=2, Parent=1</text>\n<line x1=\"430\" y1=\"121\" x2=\"480\" y2=\"121\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#trA)\"/>\n<rect x=\"480\" y=\"100\" width=\"130\" height=\"42\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"545\" y=\"117\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">支付服 Span</text>\n<text x=\"545\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SpanId=3, Parent=2</text>\n<rect x=\"60\" y=\"170\" width=\"160\" height=\"42\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"140\" y=\"187\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">DB 查询 Span</text>\n<text x=\"140\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SpanId=4, Parent=1</text>\n<rect x=\"270\" y=\"170\" width=\"160\" height=\"42\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"350\" y=\"187\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka 消费 Span</text>\n<text x=\"350\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SpanId=5, Parent=1</text>\n<line x1=\"220\" y1=\"181\" x2=\"270\" y2=\"181\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#trA)\"/>\n<line x1=\"220\" y1=\"121\" x2=\"240\" y2=\"181\" stroke=\"var(--line)\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/>\n<rect x=\"30\" y=\"236\" width=\"580\" height=\"44\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"255\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">排障用法：一条 TraceId 瞬间串起网关/登录服/支付服/日志服的日志</text>\n<text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">异步线程要用 TransmittableThreadLocal 传递，否则 TraceId 断链</text>\n<defs><marker id=\"trA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 12：Trace 树与 Span 层级（ParentId 还原）"
   },
   {
    "t": "h",
    "text": "TraceId 怎么跨服务透传"
   },
   {
    "t": "p",
    "text": "入口（网关/Controller）生成 TraceId 放入 ThreadLocal（配合 SLF4J MDC 打进每行日志），然后放到下游调用的载体里：HTTP 请求放 Header（SkyWalking 的 sw8、W3C 的 traceparent）、Dubbo 放 RPC attachment（隐式传参）、MQ 放消息属性、gRPC 放 metadata。下游服务取出 TraceId 重建上下文，继续传递。两个高频坑：①异步线程——线程池里的新线程没有父线程的 ThreadLocal，要用 TransmittableThreadLocal 或装饰线程池（SkyWalking 用 EnhancedRunnable 包装）传递上下文，否则链路断在异步边界；②MQ 场景——生产端把 TraceId 写进消息 header，消费端取出重建，不重建就断链。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 自研长连接协议 + MDC 手动埋点（游戏服场景）\npublic class GameChannelInboundHandler extends ChannelInboundHandlerAdapter {\n\n    @Override\n    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {\n        GamePacket packet = (GamePacket) msg;\n        // 自研协议帧头自带 TraceId：网关/登录服生成，帧间透传\n        String traceId = packet.getHeader().getTraceId();\n        if (traceId == null || traceId.isEmpty()) {\n            traceId = TraceIdUtil.generate(); // 入口生成\n        }\n        MDC.put(\"traceId\", traceId);          // 打进日志，与 SkyWalking 打通\n        try {\n            dispatch(ctx, packet);            // 业务分发（Disruptor 队列提交后消费线程无 MDC）\n        } finally {\n            MDC.remove(\"traceId\");\n        }\n    }\n}\n\n// 异步消费线程重建上下文：从请求对象里取 TraceId 重新 put\npublic class PlayerEventConsumer {\n    public void onEvent(PlayerEvent event) {\n        MDC.put(\"traceId\", event.getTraceId());   // 断链处手动重建\n        try { process(event); } finally { MDC.remove(\"traceId\"); }\n    }\n}"
   },
   {
    "t": "h",
    "text": "SkyWalking 为什么不需要改业务代码"
   },
   {
    "t": "p",
    "text": "核心是 Java Agent + 字节码增强：应用启动加 -javaagent:skywalking-agent.jar，Agent 的 premain 方法拿到 JVM 的 Instrumentation 实例，注册 ClassFileTransformer；类加载时用 ByteBuddy 修改字节码，在 Tomcat/Dubbo/HttpClient/JDBC/Redis 客户端等框架的关键方法入口出口织入埋点代码——创建 Span、传播上下文、记录耗时与异常。业务代码零改动，这就是 agent 方案的通用思想（Arthas、jacoco 同理）。采集的数据经 gRPC 异步上报 OAP Server（无状态分析集群），OAP 聚合后落 ES/BanyanDB，UI 展示拓扑图、调用链、慢端点。采样：默认全量，生产可调每 3 秒采样 N 条或慢调用强制采样，控制开销。"
   },
   {
    "t": "h",
    "text": "日志关联与性能剖析"
   },
   {
    "t": "p",
    "text": "日志关联：Agent 自动把 TraceId 写入日志上下文（对 log4j2/logback 的 MDC 增强），或日志采集时按 TraceId 关联 trace 数据——报错日志一点就跳到完整调用链。性能剖析：SkyWalking 支持 on-the-fly 在线剖析（CPU 火焰图）、慢 SQL 定位——拓扑图里看到 order-service 到 inventory-service 耗时 5 秒，点开就是慢 SQL 的完整 SQL 语句。这套“拓扑→链路→日志→SQL”的下钻路径，是 APM 的核心价值。"
   },
   {
    "t": "h",
    "text": "游戏服调用链落地"
   },
   {
    "t": "p",
    "text": "游戏长连接不走 HTTP，SkyWalking 默认探针覆盖不到自研协议——这是游戏微服务化的差异化痛点，也是邓凡能讲出的独家方案：①在自研协议帧头加 TraceId 字段（登录/进入场景时生成，帧间透传），战斗服↔功能服 RPC 时在 attachment 里带上；②用 SkyWalking Toolkit（@Trace 注解）手动埋点关键路径——充值回调链路（购买服→渠道回调→发货→日志 Kafka）最值得埋；③日志统一打 TraceId（MDC），线上问题用一条 TraceId 把登录服、游戏服、购买服、日志服的日志瞬间串起来。这套方案把 APM 从 HTTP 世界平移到了游戏长连接世界。"
   },
   {
    "t": "pits",
    "items": [
     "异步线程/MQ 场景 TraceId 断了：必须 TransmittableThreadLocal 或消费端重建上下文",
     "把采样当全量：全量采集有性能开销，生产按比例采样+慢调用强制采样",
     "只背 SkyWalking 名字不会讲原理：字节码增强是核心，premain + ClassFileTransformer + ByteBuddy",
     "游戏长连接场景说'直接上 SkyWalking 就行'：默认探针覆盖不到自研协议，要帧头加 TraceId 或手动埋点"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：TraceId 全局唯一贯穿全程、SpanId+ParentId 还原调用树；HTTP Header/Dubbo attachment/MQ 属性透传上下文，异步边界用 TTL 重建；SkyWalking 用 Java Agent 字节码增强实现零侵入，gRPC 上报 OAP；游戏长连接要自研协议帧头加 TraceId 才能打通全链路。下一篇讲微服务安全：谁来、能不能、能做什么。"
   }
  ]
 },
 {
  "id": "microservice-security",
  "title": "微服务安全：认证、授权与统一鉴权",
  "layer": 3,
  "depends": [
   "microservice-api-gateway",
   "microservice-config-center"
  ],
  "covers": [
   "microservice-08",
   "microservice-16"
  ],
  "quiz": [
   "microservice-08"
  ],
  "body": [
   {
    "t": "lead",
    "text": "微服务安全的核心是三条线：认证（你是谁）、授权（你能干什么）、传输与存储安全（数据不被偷）。JWT、OAuth2、SSO、网关统一鉴权、内部服务鉴权与数据脱敏，构成完整纵深。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Session 与 Cookie 的基本机制",
     "做过登录服的账号校验与 token 签发",
     "用过 GM 后台的权限拦截器（RuoYi）"
    ]
   },
   {
    "t": "h",
    "text": "认证 vs 授权：先分清"
   },
   {
    "t": "p",
    "text": "认证（Authentication）回答“你是谁”：验证用户名密码、验证 token 合法性。授权（Authorization）回答“你能干什么”：判断当前用户有没有权限执行某操作（角色/权限点）。认证失败返回 401，授权失败返回 403——这两个状态码别用混。游戏里的对应：登录服校验账号密码签发 token 是认证；GM 后台只有运营角色能点“发奖”、只有客服角色能查玩家数据是授权。面试先主动拆分这两个词，安全题就赢了一半。"
   },
   {
    "t": "h",
    "text": "JWT：结构、原理与坑"
   },
   {
    "t": "p",
    "text": "JWT（JSON Web Token）三段式：Header（算法）+ Payload（声明：sub、exp、iat、自定义字段）+ Signature（签名）。服务端签名，客户端持有，无状态——服务端不存 Session，天然支持水平扩展与跨域。校验流程：解析 → 验签名（公钥/密钥）→ 验过期时间 → 取业务字段。四个高频坑：①无法单点失效——踢人下线和改密后旧 token 仍有效，补救：Redis 黑名单/版本号比对，或短过期 Access Token + Refresh Token 双令牌；②密钥泄露——HS256 对称密钥放配置中心加密存储，泄露等于全站失守；③过期时间太长——无状态 token 越长越危险，建议 30 分钟~2 小时；④敏感信息别放 Payload——JWT 只做签名不做加密，Payload 是 Base64 明文，谁都能解出来。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 登录服签发 token 的核心骨架（JWT 无状态 + Redis 防重放）\n@Service\npublic class AuthService {\n\n    public String login(String account, String pwd) {\n        // 1. 校验账号密码（略）\n        long playerId = validate(account, pwd);\n\n        // 2. 签发 JWT：带玩家ID与过期时间\n        String token = Jwts.builder()\n                .claim(\"playerId\", playerId)\n                .claim(\"serverId\", getDefaultServer(playerId)) // 选服信息\n                .setExpiration(new Date(System.currentTimeMillis() + 30 * 60_000))\n                .signWith(secretKey)\n                .compact();\n\n        // 3. 记录 token 版本号（支持踢人：新 token 版本+1，旧版本失效）\n        stringRedisTemplate.opsForValue().set(\"auth:ver:\" + playerId, \"1\",\n                Duration.ofMinutes(30));\n        return token;\n    }\n\n    // 游戏服验票：验签名+验过期+验版本号（踢人=版本号+1）\n    public long verifyAndGetPlayerId(String token) {\n        Claims c = Jwts.parserBuilder().setSigningKey(secretKey).build()\n                .parseClaimsJws(token).getBody();\n        String cur = stringRedisTemplate.opsForValue()\n                .get(\"auth:ver:\" + c.get(\"playerId\", Long.class));\n        if (!\"1\".equals(cur)) { throw new KickedException(\"token revoked\"); }\n        return c.get(\"playerId\", Long.class);\n    }\n}"
   },
   {
    "t": "h",
    "text": "OAuth2 与 SSO"
   },
   {
    "t": "p",
    "text": "OAuth2 是授权框架，解决“第三方应用在不拿到你密码的前提下，代表你访问资源”：四种授权模式（授权码模式最常用，用于第三方登录；客户端凭证模式用于服务间）。常见误区：OAuth2 是授权不是认证，但它常被组合成“认证+授权”方案（OIDC 把身份信息加到 OAuth2 之上形成认证协议）。SSO（单点登录）：多个系统共用一套登录——你在 GM 后台、运营后台、BI 后台登录一次全部通行。实现：独立认证中心（CAS/OIDC），各系统登录时跳转认证中心，认证中心发票据/令牌，各系统校验；关键问题 Session 共享——认证中心的登录态存 Redis，各系统不再各自维护 Session。游戏里的 GM 后台多系统互通就是 SSO 的典型场景。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">网关统一鉴权 + 内网隔离纵深</text>\n<rect x=\"30\" y=\"45\" width=\"110\" height=\"44\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"85\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">外部客户端</text>\n<path d=\"M140 67 L170 67\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#scA)\"/>\n<rect x=\"170\" y=\"42\" width=\"300\" height=\"50\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">API 网关（统一鉴权）</text>\n<text x=\"320\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">白名单放行 → 验 token → 失败 401 → 通过注入 X-Player-Id</text>\n<path d=\"M470 67 L500 67\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#scA)\"/>\n<rect x=\"500\" y=\"45\" width=\"110\" height=\"44\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"555\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">业务服务</text>\n<rect x=\"30\" y=\"120\" width=\"580\" height=\"52\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"141\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">防绕过：业务服务只暴露内网，校验网关注入的签名头/来源标识，拒绝直连</text>\n<text x=\"320\" y=\"161\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">配合 mTLS 或内网 ACL，确保流量必须经过网关</text>\n<rect x=\"30\" y=\"196\" width=\"580\" height=\"78\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"217\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">内部服务鉴权三种手段</text>\n<text x=\"320\" y=\"239\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">内网令牌（服务间共享密钥验签） / mTLS 双向证书 / 服务身份认证（JWT of service）</text>\n<text x=\"320\" y=\"259\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏映射：登录服发 token、游戏服验票建会话；GM 后台多系统 = SSO 场景</text>\n<defs><marker id=\"scA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 13：网关统一鉴权与内网隔离的纵深防线"
   },
   {
    "t": "h",
    "text": "网关统一鉴权与内部服务鉴权"
   },
   {
    "t": "p",
    "text": "为什么鉴权放网关：横切逻辑收敛（所有入口一处校验，业务服务零重复代码）、安全边界前移（非法请求不进内网）、统一审计与灰度。GlobalFilter 五步：白名单放行（登录、回调、健康检查）→ 取 token → 校验签名与过期 → 失败 401 短路 → 通过则把玩家 ID 注入 Header 转发（下游免解析）。但网关鉴权只解决“外部进来”的问题：防绕过要靠内网隔离（业务服务只暴露内网地址）+ 下游校验网关注入的来源头 + mTLS/ACL。内部服务间鉴权三种手段：内网令牌（共享密钥验签）、mTLS 双向证书、服务身份认证。敏感操作（GM 发奖）还要二次鉴权：除了认证，还要查角色权限（RBAC），授权放行才执行。"
   },
   {
    "t": "h",
    "text": "敏感数据脱敏"
   },
   {
    "t": "p",
    "text": "脱敏三原则：日志不落明文（玩家手机号、身份证、渠道账号打码：138****8888）、接口不下发敏感字段（序列化时 @JsonIgnore 或脱敏 DTO）、存储最小化（能存 hash 不存明文，密码必须加盐哈希）。网关/日志链路层做统一脱敏——日志框架配置 SensitiveConverter，在落盘前替换敏感字段。游戏场景：客服查询玩家充值记录，手机号必须脱敏；日志服的原始日志不能直接给 BI 之外的人看。脱敏是安全审计的硬性要求，也是数据合规（个保法）的基本盘。"
   },
   {
    "t": "pits",
    "items": [
     "JWT 说成加密：JWT 只签名不加密，Payload 是 Base64 明文，敏感信息不能放",
     "踢人下线答不上来：JWT 无法单点失效，Redis 黑名单/版本号+双令牌才是正解",
     "认证授权不分：401 认证失败、403 授权不足，概念混淆直接暴露基本功",
     "只做网关鉴权不防绕过：内网隔离 + 来源头校验 + mTLS 缺一不可，网关不是保险柜"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：认证看身份、授权看权限；JWT 无状态但有过期/踢人/密钥三个坑，配合 Redis 版本号与双令牌；OAuth2 管授权、SSO 管多系统单点；网关统一鉴权收敛横切逻辑，内网隔离+mTLS 防绕过；敏感数据日志脱敏、接口不下发、存储最小化。游戏登录服发 token、游戏服验票，就是这套模式的落地。下一篇讲幂等与容错：安全之后，数据怎么防重。"
   }
  ]
 },
 {
  "id": "microservice-idempotency",
  "title": "幂等与容错设计：数据防重与自愈",
  "layer": 3,
  "depends": [
   "microservice-distributed-transaction",
   "microservice-distributed-lock"
  ],
  "covers": [
   "microservice-13",
   "microservice-14",
   "microservice-34"
  ],
  "quiz": [
   "microservice-14",
   "microservice-34",
   "microservice-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "网络重试、渠道回调重发、MQ 重复投递、玩家双击——同一请求到达 N 次是常态不是意外。幂等设计就是让“执行一次”和“执行 N 次”结果相同，它是充值发货、发奖、下单这些资金相关操作的生命线。"
   },
   {
    "t": "pre",
    "items": [
     "理解数据库唯一索引与事务",
     "做过支付渠道回调的重复回调处理",
     "理解分布式锁的防并发作用"
    ]
   },
   {
    "t": "h",
    "text": "幂等的定义与重复来源"
   },
   {
    "t": "p",
    "text": "幂等（Idempotent）：一次调用和多次调用的结果完全一致，不产生重复副作用。重复来源五大类：①网络重试（超时后客户端自动重发）；②支付渠道回调重发（渠道多次通知）；③MQ 重复投递（消费端没提交 offset 重新消费）；④玩家双击/重复提交（表单连点）；⑤恶意重放（攻击者抓包重放请求）。游戏里充值发货是最典型场景：渠道回调多通知一次，就多发一次钻石——这是资损级别的 bug。"
   },
   {
    "t": "h",
    "text": "幂等方案谱系（按可靠性排序）"
   },
   {
    "t": "list",
    "items": [
     "唯一索引兜底（最推荐）：以业务唯一键（渠道流水号/订单号/场次ID）建唯一索引，重复插入撞索引直接失败，数据库原子拦截，最可靠",
     "状态机条件更新：订单状态只能单向流转，UPDATE ... SET status=? WHERE id=? AND status=?，影响行数=0 说明已处理，天然防并发重复",
     "Token 防重：提交前先取一次性 token（Redis SETNX），提交时校验并删除，防表单重复提交",
     "防重表/去重表：独立表记录已处理请求 ID，与业务操作同事务写入，重复请求查表拦截",
     "分布式锁：防“先查后写”类操作的并发，但不能替代唯一约束——锁是预防，约束才是兜底"
    ]
   },
   {
    "t": "p",
    "text": "关键认知：先查后插防不住并发——两个请求并发查询都查不到旧记录，都通过校验各自插入，产生重复数据。唯一索引让数据库原子拦截是正解；查询只能做提示、不能做强校验。这是面试官最爱挖的坑，主动说出来就是加分。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 充值回调幂等组合拳：唯一键 + 状态机 + 同事务发货\n@Transactional\npublic RechargeResult payCallback(String channelTradeNo, long playerId, int amount) {\n    // 第一层：唯一索引兜底（pay_order.channel_trade_no 唯一）\n    PayOrder order;\n    try {\n        order = payOrderMapper.insert(new PayOrder(channelTradeNo, playerId, amount, Status.WAIT));\n    } catch (DuplicateKeyException e) {\n        // 重复回调：查库返回已处理结果，绝不再发货\n        return RechargeResult.alreadyHandled(payOrderMapper.findByTradeNo(channelTradeNo));\n    }\n    // 第二层：状态机推进，只有待支付能变已支付\n    int rows = payOrderMapper.casUpdate(order.getId(),\n            Status.WAIT, Status.PAID); // UPDATE ... SET status=PAID WHERE id=? AND status=WAIT\n    if (rows == 0) {\n        throw new IllegalStateException(\"order state wrong: \" + order.getId());\n    }\n    // 第三层：发货与订单状态同一本地事务，天然原子\n    goodsService.deliver(playerId, order.getGoodsId());\n    return RechargeResult.success(order.getId());\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">充值回调幂等三层防线</text>\n<rect x=\"30\" y=\"50\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第一层：唯一索引</text>\n<text x=\"120\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">channel_trade_no 唯一约束</text>\n<text x=\"120\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">重复插入直接撞索引失败</text>\n<path d=\"M210 85 L240 85\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#idA)\"/>\n<rect x=\"240\" y=\"50\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"330\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第二层：状态机</text>\n<text x=\"330\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CAS 条件更新</text>\n<text x=\"330\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">WAIT→PAID 单向流转</text>\n<path d=\"M420 85 L450 85\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#idA)\"/>\n<rect x=\"450\" y=\"50\" width=\"160\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"530\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第三层：同事务发货</text>\n<text x=\"530\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发货与状态更新同本地事务</text>\n<text x=\"530\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">要么都成要么都败</text>\n<rect x=\"30\" y=\"145\" width=\"580\" height=\"50\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"167\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">兜底：定时对账任务</text>\n<text x=\"320\" y=\"187\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">对比支付渠道流水与本地订单，状态不一致自动修复/告警——充值系统的生死线</text>\n<rect x=\"30\" y=\"210\" width=\"580\" height=\"40\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"235\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MQ 消费端同理：消息唯一键+去重表；分布式锁是预防，唯一约束才是兜底</text>\n<defs><marker id=\"idA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 14：充值回调幂等三层防线与对账兜底"
   },
   {
    "t": "h",
    "text": "超时重试策略"
   },
   {
    "t": "p",
    "text": "重试放大公式：超时 1s × 重试 3 次 = 最坏等待 3s，且流量放大 3 倍——雪崩时重试风暴会打垮下游。安全重试三原则：①读操作（查询）可以放心重试；②写操作（下单、扣款、发奖）要么保证幂等再重试，要么 Failfast 不重试交给业务补偿；③重试要有退避（指数退避+抖动），不要同一时刻轰击下游。Dubbo 默认 Failover 重试 2 次适合幂等读，写接口显式 retries=0。游戏服自研 RPC 同理：查背包可重连重试，发奖绝不自动重试，用流水号幂等让重试变安全。"
   },
   {
    "t": "h",
    "text": "补偿与对账"
   },
   {
    "t": "p",
    "text": "最终一致方案的最后一环是兜底：定时对账（对比两端数据，不一致自动修复或告警）、补偿任务（扫描长时间未完成的订单/消息，重放或人工介入）、反向补偿（Saga 里 Cancel 退款）。对账不是可选项——它是把“重试可能永远失败”这个不确定因素变成确定收敛的关键。支付对账每日跑，发现渠道已扣款本地没发货，立即补发并告警；日志消费积压，监控 lag 并限速追平。"
   },
   {
    "t": "h",
    "text": "降级开关：容错的最后一道闸"
   },
   {
    "t": "p",
    "text": "容错不只是防重，还要能优雅退让：降级开关放配置中心，故障时一键关闭非核心功能（排行榜刷新、GM 查询降级为缓存快照），保核心链路（登录、战斗、支付）。关键点：开关要能秒级生效（@RefreshScope）、要有本地兜底（配置中心挂了按最后值运行）、降级恢复要逐级回放并限速消费积压数据，防止恢复流量二次雪崩。游戏场景：开服活动日支付渠道抖动，先降级公告/邮件功能，保充值链路；渠道恢复后先恢复 P1 观察再恢复 P2。"
   },
   {
    "t": "pits",
    "items": [
     "先查后插防不住并发：两个请求并发查询都通过校验各自插入——必须唯一索引原子拦截",
     "重试不做幂等保护：非幂等写接口自动重试 = 重复扣款/重复发奖",
     "对账只做“发现”不做“修复”：对账任务要能自动修复可修复项（补发、更新状态），人工介入只留罕见 case",
     "降级恢复一次性放开：积压数据要限速消费，防止恢复流量二次雪崩"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：幂等五源（网络重试/回调重发/MQ 重复/双击/重放）、四方案（唯一索引/状态机/Token/防重表）；先查后插防不住并发、分布式锁是预防唯一约束才是兜底；重试配幂等、退避防风暴；对账把最终一致变成确定收敛；降级开关保核心链路。这篇和前面的分布式事务、分布式锁合起来就是充值链路完整方案。下一篇深入 Dubbo：协议、序列化与线程模型。"
   }
  ]
 },
 {
  "id": "microservice-dubbo-deep",
  "title": "Dubbo 深入：协议、序列化与线程模型",
  "layer": 3,
  "depends": [
   "microservice-remote-call"
  ],
  "covers": [
   "microservice-05",
   "microservice-10",
   "microservice-34"
  ],
  "quiz": [
   "microservice-10",
   "microservice-34",
   "microservice-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Dubbo 不止是 RPC 框架，而是一整套服务治理体系。这一篇深入协议帧、序列化选型、集群容错、线程模型与版本演进，并把 Dubbo 2/3 的差异和游戏自研 RPC 拉通对照。"
   },
   {
    "t": "pre",
    "items": [
     "理解 RPC 基本流程（代理→序列化→传输→反射调用）",
     "用 Netty 写过自研协议编解码（粘包拆包、消息 ID）",
     "知道序列化、传输、协议三个概念的区别"
    ]
   },
   {
    "t": "h",
    "text": "Dubbo 协议设计：16 字节定长头"
   },
   {
    "t": "p",
    "text": "dubbo 协议是私有二进制协议，变长协议（定长头 + payload），默认 Netty 监听 20880 端口。16 字节定长头结构：魔数（2 字节，固定 0xdabb，用于识别 Dubbo 报文防误连）、Flag（1 字节：请求/响应、双向、心跳事件标志 + 序列化类型低 4 位）、Status（1 字节：响应状态）、消息 ID（8 字节 long：请求响应配对，异步通信靠它关联）、Body 长度（4 字节：防粘包拆包）。这个设计和游戏 Netty 协议完全同构：魔数防误连、长度防粘包、消息 ID 配对、心跳保活。游戏协议与 Dubbo 协议的差异：游戏追求极致小体积（Protobuf/自研二进制、字段编号而非类名），Dubbo 面向通用 RPC 更重元信息（接口名、方法名、附件）；游戏常单连接长会话+主动推送，Dubbo 以请求响应为主。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Dubbo 协议 16 字节定长头</text>\n<rect x=\"20\" y=\"50\" width=\"70\" height=\"80\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"55\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">魔数 2B</text>\n<text x=\"55\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">0xdabb</text>\n<text x=\"55\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">识别报文</text>\n<rect x=\"98\" y=\"50\" width=\"70\" height=\"80\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"133\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Flag 1B</text>\n<text x=\"133\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">请求/响应</text>\n<text x=\"133\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">+心跳+序列化</text>\n<rect x=\"176\" y=\"50\" width=\"70\" height=\"80\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"211\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Status 1B</text>\n<text x=\"211\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">响应状态码</text>\n<rect x=\"254\" y=\"50\" width=\"110\" height=\"80\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"309\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">消息 ID 8B</text>\n<text x=\"309\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">请求响应配对</text>\n<text x=\"309\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">异步通信关键</text>\n<rect x=\"372\" y=\"50\" width=\"90\" height=\"80\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"417\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Body 长度 4B</text>\n<text x=\"417\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">防粘包拆包</text>\n<rect x=\"470\" y=\"50\" width=\"150\" height=\"80\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"545\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Body</text>\n<text x=\"545\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Hessian2/Kryo/Protobuf</text>\n<text x=\"545\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">序列化后的参数/结果</text>\n<rect x=\"20\" y=\"165\" width=\"600\" height=\"76\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"187\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">与游戏 Netty 协议同构：魔数防误连 / 长度防粘包 / 消息 ID 配对 / 心跳保活</text>\n<text x=\"320\" y=\"209\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">差异：游戏追求体积极限（Protobuf、字段编号），Dubbo 重元信息（接口名/方法名/附件）</text>\n<text x=\"320\" y=\"229\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">3.x 新协议 triple：HTTP/2 + gRPC 兼容，支持流式/双向通信</text>\n</svg>",
    "caption": "图 15：Dubbo 协议帧结构与游戏协议的同构性"
   },
   {
    "t": "h",
    "text": "序列化选型"
   },
   {
    "t": "table",
    "head": [
     "序列化",
     "性能",
     "体积",
     "跨语言",
     "说明"
    ],
    "rows": [
     [
      "Hessian2",
      "中",
      "中",
      "是",
      "Dubbo 2.x 默认，生态兼容好"
     ],
     [
      "Kryo/FST",
      "极快",
      "小",
      "否",
      "需注册类，同 Java 体系内推"
     ],
     [
      "Protobuf",
      "快",
      "最小",
      "是",
      "IDL 强 schema，跨语言首选"
     ],
     [
      "JSON",
      "慢",
      "大",
      "极高",
      "调试方便，生产很少用"
     ],
     [
      "Fastjson2",
      "快",
      "中",
      "是",
      "Dubbo 3.2+ 自动协商默认"
     ]
    ]
   },
   {
    "t": "p",
    "text": "默认序列化有版本演进：Dubbo 2.x 默认 Hessian2（二进制、跨语言、性能均衡）；Dubbo 3.2 起增加自动协商机制——两端都是 Dubbo 3 且存在 Fastjson2 依赖时自动用 fastjson2，否则回退 hessian2，对用户透明。选型建议：内部高频跨语言链路用 Protobuf（体积小、schema 约束强，但要维护 proto 文件），同 Java 体系性能敏感用 Kryo（注册类），对外兼容用 Hessian2/JSON。游戏服自研协议通常直接用 Protobuf，这正好是 Dubbo 序列化选型的同款思考。"
   },
   {
    "t": "h",
    "text": "集群容错与负载均衡"
   },
   {
    "t": "list",
    "items": [
     "Failover（默认）：失败自动切换其他 Provider 重试（默认 retries=2），适合幂等读操作；坑：非幂等写会重复执行",
     "Failfast：快速失败，只调一次报错即抛，适合非幂等写（下单、扣款），失败交给业务补偿",
     "Failsafe：失败忽略记日志，适合日志上报、埋点等丢了也无所谓的调用",
     "Failback：失败后台定时重发，适合通知类（最终送达即可）",
     "Forking：并行调用多个 Provider 取最快返回，用资源换延迟，适合实时性极高的读",
     "Broadcast：广播调所有 Provider 任一失败算失败，适合全服通知/缓存刷新"
    ]
   },
   {
    "t": "p",
    "text": "选型原则一句话：读 Failover、写 Failfast、通知 Failsafe——按操作的幂等性选策略。重试安全铁三角：超时 × 重试次数 × 接口幂等。负载均衡四种：随机（默认）、轮询、最少活跃、一致性哈希（有状态亲和）。游戏 RPC 场景：查询类可 Failover+重试；发奖类 Failfast 或流水号幂等后重试；跨服战状态上报 Failsafe。"
   },
   {
    "t": "h",
    "text": "线程模型"
   },
   {
    "t": "p",
    "text": "Dubbo 线程模型分层：IO 线程（Netty boss/work group，处理连接与编解码）→ 业务线程池（默认 cached 线程池，执行反射调用业务方法）。关键认知：IO 线程不做业务逻辑，只做编解码；长耗时业务放到业务线程池，避免阻塞 IO 线程导致整个服务不可用。2.7+ 支持异步调用（CompletableFuture）、响应式 API；3.x 引入 triple 协议（HTTP/2）与 RPC 下沉（Proxyless 模式，直连 Istio 等 mesh 控制面）。游戏对照：Netty boss/work + Disruptor 业务队列就是同款线程模型——IO 线程收包入队，业务线程串行处理，避免锁竞争。"
   },
   {
    "t": "h",
    "text": "与 Spring Cloud 技术选型对比"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "Dubbo",
     "Spring Cloud（Alibaba）"
    ],
    "rows": [
     [
      "通信协议",
      "私有二进制 dubbo/triple",
      "HTTP（Feign/WebClient）"
     ],
     [
      "序列化",
      "Hessian2/Kryo/Protobuf",
      "JSON"
     ],
     [
      "性能",
      "长连接+二进制，高",
      "HTTP+JSON，适中"
     ],
     [
      "注册中心",
      "ZK/Nacos（可直连）",
      "Nacos（标配）"
     ],
     [
      "治理能力",
      "服务路由/容错/降级/泛化调用",
      "网关/配置/熔断（Sentinel）/链路全家桶"
     ],
     [
      "生态重心",
      "Java 体系高性能内部调用",
      "云原生/外部接入/生态完整"
     ]
    ]
   },
   {
    "t": "p",
    "text": "选型规律：内部服务间高频低延迟调用（游戏战斗服↔功能服、订单↔库存）选 Dubbo 系；对外 HTTP、异构系统、云原生接入选 Spring Cloud 系。国内很多团队两者混用：Spring Cloud Gateway 入口 + Dubbo 内部调用。游戏服的自研 RPC 通信本质就是 Dubbo 这条路——把这段经历翻译成“自研版 Dubbo”，面试直接拉高一个档次。"
   },
   {
    "t": "pits",
    "items": [
     "序列化说成“默认就是 Protobuf”：2.x 默认 Hessian2，3.2 起自动协商 fastjson2，Protobuf 是可选最优",
     "16 字节头背不全：魔数/Flag/Status/消息ID/长度，能画出来才算真懂",
     "重试策略只背名字不讲幂等性：非幂等写接口必须 Failfast 或 retries=0",
     "把 IO 线程和业务线程混为一谈：IO 线程只做编解码，业务进线程池，阻塞 IO 线程是事故"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Dubbo 协议帧=魔数+标志+状态+消息ID+长度+Body，与游戏 Netty 协议同构；序列化按场景选（内部跨语言 Protobuf、Java 内 Kryo、兼容 Hessian2/JSON）；容错六策略按幂等性选，重试配幂等是铁律；IO 线程只编解码、业务进线程池；内部 Dubbo + 入口 Spring Cloud 是常见混用姿势。下一篇讲高并发治理：流量大了怎么办。"
   }
  ]
 },
 {
  "id": "microservice-high-concurrency",
  "title": "高并发治理：缓存、异步与削峰",
  "layer": 3,
  "depends": [
   "microservice-circuit-breaker"
  ],
  "covers": [
   "microservice-11",
   "microservice-19",
   "microservice-33",
   "microservice-23"
  ],
  "quiz": [
   "microservice-11",
   "microservice-19",
   "microservice-33"
  ],
  "body": [
   {
    "t": "lead",
    "text": "高并发治理是系统工程：读多写少用缓存扛、写峰用 MQ 削、入口用限流挡、热点用拆分治。这一篇把缓存、异步、削峰、热点 key、分布式限流、预案与压测串成一套完整打法，直接对标游戏开服和活动峰值。"
   },
   {
    "t": "pre",
    "items": [
     "理解缓存的基本使用（Redis 读写）",
     "用过 Kafka 做日志异步（日志服）",
     "理解限流算法与熔断降级（前一篇）"
    ]
   },
   {
    "t": "h",
    "text": "高并发治理的分层思维"
   },
   {
    "t": "p",
    "text": "治理不是某一种技术，而是一层一层的防线：①CDN/接入层挡静态（公告、热更包、图片走 CDN）；②网关限流防刷（令牌桶按 IP/玩家限）；③多级缓存扛读（本地 Caffeine + Redis + DB 兜底）；④MQ 削峰写（下单、充值回调、日志全部异步化）；⑤数据库分库分表（写放大时数据层扩容）；⑥预案与降级（峰值期关非核心保核心）。每层各挡一部分流量，叠加起来才能扛住 10 倍峰值。游戏开服瞬间就是典型：几千人同时登录，登录请求、角色加载、日志写入全压到后端。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 310\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">高并发治理分层防线</text>\n<rect x=\"40\" y=\"48\" width=\"560\" height=\"40\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"73\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 接入层：CDN 挡静态 + Nginx TLS/限流</text>\n<path d=\"M320 88 L320 102\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#hcA)\"/>\n<rect x=\"40\" y=\"104\" width=\"560\" height=\"40\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"129\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 网关：IP/玩家 ID 级限流防刷，令牌桶排队</text>\n<path d=\"M320 144 L320 158\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#hcA)\"/>\n<rect x=\"40\" y=\"160\" width=\"560\" height=\"40\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"185\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 多级缓存：Caffeine 本地 + Redis 共享 + DB 兜底</text>\n<path d=\"M320 200 L320 214\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#hcA)\"/>\n<rect x=\"40\" y=\"216\" width=\"560\" height=\"40\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"241\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ MQ 削峰：充值回调/日志/排行写入异步化</text>\n<path d=\"M320 256 L320 270\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#hcA)\"/>\n<rect x=\"40\" y=\"272\" width=\"560\" height=\"34\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"294\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">⑤ 数据层扩容 + ⑥ 峰值预案降级（关非核心保核心）</text>\n<defs><marker id=\"hcA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 16：高并发治理六层防线"
   },
   {
    "t": "h",
    "text": "多级缓存与缓存一致性"
   },
   {
    "t": "p",
    "text": "多级缓存组合：本地缓存（Caffeine，纳秒级，扛热点读）→ Redis（共享层，毫秒级，跨实例一致）→ DB（兜底）。核心矛盾：A 节点更新了 DB 和 Redis，B 节点本地缓存还是旧值——本地缓存一致性靠“失效广播 + 短 TTL”组合：更新方发布失效消息（Redis Pub/Sub / MQ / Nacos 配置变更），所有节点收到后删本地 key；Pub/Sub 不持久化、消息可能丢，所以必须配短 TTL 兜底（30s~5min 最多脏这么久）。版本号方案：缓存值带版本，读时校验。铁律：只缓存读多写少、容忍秒级延迟的数据；钱和库存永远回源 DB。游戏场景：导表工具生成的数值表就是“版本号 + 失效广播”的最佳实践——GM 改表生成新版本号，各服比对重新加载，和电商商品改价后全实例 1 秒失效同构。"
   },
   {
    "t": "h",
    "text": "异步与削峰"
   },
   {
    "t": "p",
    "text": "异步的核心是“请求立即响应、工作后台消化”：Kafka/MQ 把峰值流量削成平峰——充值回调先确认收到（写消息），发货逻辑消费消息慢慢做；日志、统计、排行全异步，游戏服不阻塞。削峰三板斧：排队（网关令牌桶/登录发号）、限速（消费端按能力消费，Kafka 天然可堆积）、错峰（活动按区服错峰开放）。异步的代价是状态复杂度——消费幂等、乱序处理、消息丢失兜底（Kafka 多副本 + 消费端 offset 管理 + 对账）都要做。日志服就是你做过的削峰案例：游戏服行为日志写 Kafka，日志服消费入库，峰值只压 Kafka 不压业务。"
   },
   {
    "t": "h",
    "text": "热点 key 治理"
   },
   {
    "t": "p",
    "text": "热点 key 是指数访问的单个 key（全服公告、开服排行榜第一名、爆款商品），会打爆单节点 Redis 和单台 DB。治理手段：①本地缓存扛热点——热点 key 进 Caffeine，避免打爆 Redis 单分片；②key 打散——热点 key 加后缀拆 N 份（hot:001~hot:100），写时分摊、读时合并；③多级保护——热点接口单独限流；④数据预取——活动前把热点数据预热到各实例本地缓存。游戏场景：开服时的全服公告、跨服战榜单头部、活动排行实时刷新都是典型热点。注意：一致性哈希解决的是节点增减的迁移成本，不解决热点本身——热点必须单独治理。"
   },
   {
    "t": "h",
    "text": "分布式限流架构"
   },
   {
    "t": "p",
    "text": "单机限流只保护单实例，集群流量要全局视角。分布式限流两种主流：①Redis + Lua 令牌桶（网关 RequestRateLimiter 方案）：脚本内原子完成取令牌判断，简单通用，缺点是每次限流一次网络往返；②Sentinel 集群流控：独立 Token Server 统一发令牌，精确全局限流但引入中心节点。选型：对外网关用 Redis+Lua，内部精确控制用 Sentinel 集群模式。游戏开服场景：登录接口按 IP 限流防刷 + 按玩家 ID 限流防单账号狂刷 + 全局限流保总量——三层叠加。"
   },
   {
    "t": "h",
    "text": "活动峰值预案与全链路压测"
   },
   {
    "t": "list",
    "items": [
     "提前扩容：登录服/游戏服水平扩容，Redis/DB 连接池调大，预热 JVM（触发类加载与线程池初始化）",
     "开关就绪：公告/排行榜/邮件等非核心功能降级开关提前在配置中心备好，秒级可关",
     "预案文档：按 P0/P1/P2 分级的功能降级清单、负责人、操作步骤、回滚方式",
     "全链路压测：按峰值 2~3 倍压测（压测流量打标记，不走真实计费），找出链路瓶颈——往往是 DB 慢 SQL、Redis 大 key、连接池耗尽",
     "演练验证：故障注入（下游延迟/宕机）验证熔断、降级、对账是否按预期生效"
    ]
   },
   {
    "t": "pits",
    "items": [
     "缓存只做读写不做一致性：多级缓存必须有失效广播+短 TTL 兜底，钱和库存绝不缓存",
     "热点 key 不治理只扩容：单 key 单分片，扩容也没用，必须本地缓存+key 打散",
     "异步化不做幂等：MQ 削峰的前提是消费幂等，否则重复消费直接资损",
     "压测不按真实链路：压测要打标记走全链路，别只压单个服务——瓶颈往往在数据层"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：高并发治理六层防线——接入挡静态、网关限流、多级缓存扛读、MQ 削峰写、数据层扩容、预案降级；缓存一致性靠失效广播+短 TTL；热点 key 靠本地缓存+打散；分布式限流 Redis+Lua 或 Sentinel 集群；峰值靠预案+压测+演练，预案不演练等于没有。下一篇讲单体改造：存量系统怎么微服务化。"
   }
  ]
 },
 {
  "id": "microservice-refactoring",
  "title": "微服务改造与演进：拆分的落地之路",
  "layer": 3,
  "depends": [
   "microservice-arch-evolution",
   "microservice-distributed-transaction"
  ],
  "covers": [
   "microservice-15",
   "microservice-20",
   "microservice-27",
   "microservice-32"
  ],
  "quiz": [
   "microservice-20",
   "microservice-32",
   "microservice-27"
  ],
  "body": [
   {
    "t": "lead",
    "text": "微服务改造最大的坑不是技术，是“一刀切重写”。这一篇讲清单体拆分的渐进方法论、数据库拆分策略、分布式数据一致性落地，以及游戏服微服务化的真实案例与反模式。"
   },
   {
    "t": "pre",
    "items": [
     "理解服务边界划分原则（单一职责/数据私有）",
     "理解分布式事务与最终一致性方案",
     "做过游戏线上部署与热更新（灰度、回滚）"
    ]
   },
   {
    "t": "h",
    "text": "单体拆分方法论：渐进式改造"
   },
   {
    "t": "p",
    "text": "反模式是“推倒重来”（Strangler Fig 才是正解）。渐进式拆分四步走：①模块化（Modulith）：先在单体内部把代码按领域分层建模块、解耦依赖——这是零风险的第一步；②垂直切片拆服务：从最独立、收益最高的模块开始（如日志、消息推送、支付），一次拆一个，保持与其他模块的契约接口；③数据先行：拆服务前先拆数据库（逻辑分库），服务边界和数据边界要同步；④灰度迁移：新老服务并存，流量按比例切换，验证稳定后再下线老实现。关键原则：拆分必须可独立部署、可独立回滚，一次拆一个，拆完一个稳定一个。"
   },
   {
    "t": "h",
    "text": "数据库拆分策略"
   },
   {
    "t": "p",
    "text": "数据是微服务拆分最硬的部分，按顺序推进：①表拆分（垂直切分）：按业务域把表分到不同库——用户表、订单表、日志表各归其位，这是拆服务的前提；②分库分表（水平切分）：单表数据量大、写并发高时，按分片键（玩家 ID/订单 ID）水平拆分，MyCat/ShardingSphere 中间件落地；③读写分离：主库写、从库读，扛读放大；④数据私有化：每个服务只访问自己的库，跨服务数据通过 API/事件获取，禁止直连。游戏场景：玩家数据天然按 服ID+玩家ID 分片，充值订单按订单 ID 分片，日志按天分区——游戏行业做分库分表有天然优势。"
   },
   {
    "t": "h",
    "text": "分布式数据一致性落地"
   },
   {
    "t": "p",
    "text": "拆分后数据一致性按“强一致/最终一致”分级落地：核心资金链路（充值发货）用本地事务+唯一索引幂等，非核心链路（积分、统计、通知）走 MQ 异步最终一致，管理操作（GM 批量操作）用 Seata AT 或分布式锁+对账。关键认知：不是所有链路都要强一致，先给数据分级再选方案——把一致性成本和业务容忍度匹配起来，才是架构师思维。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服微服务化：周边系统与核心逻辑的分界</text>\n<rect x=\"30\" y=\"45\" width=\"580\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">无状态周边系统（标准微服务技术栈）</text>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录服（Nacos 注册） / 支付服（幂等+对账） / 日志服（Kafka 异步） / GM 后台（RuoYi+SpringBoot）</text>\n<text x=\"320\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">这些系统：无状态、可水平扩容、可走网关/配置中心/链路追踪全套</text>\n<path d=\"M320 115 L320 138\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rfA)\"/>\n<rect x=\"30\" y=\"140\" width=\"580\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"161\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">核心逻辑层（有状态，按区服横向分片）</text>\n<text x=\"320\" y=\"183\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服按 服ID 分片：同服玩家强交互、AOI/战斗状态在内存，请求按分片键路由</text>\n<text x=\"320\" y=\"199\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单写者串行化（Disruptor/线程模型）保证同玩家操作顺序执行</text>\n<path d=\"M320 210 L320 233\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#rfA)\"/>\n<rect x=\"30\" y=\"235\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"257\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">通信：自研 RPC（跨服战/功能服）+ Kafka（日志/统计）+ 配置推送（热更新）</text>\n<text x=\"320\" y=\"279\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">微服务的注册/配置/追踪思想在游戏里有对应野生实现，两边都摸过是跨界优势</text>\n<defs><marker id=\"rfA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 17：游戏服微服务化的分层映射"
   },
   {
    "t": "h",
    "text": "游戏服微服务化案例"
   },
   {
    "t": "p",
    "text": "游戏服微服务化要分清楚“能拆的”和“不能拆的”。能拆的：登录服（账号校验、token 签发、选服，无状态可水平扩容）、支付服（订单、渠道对接，独立部署避免支付问题影响游戏）、日志服（Kafka 消费、离线分析）、GM 后台（运营工具）、活动/跨服战匹配（独立进程组织对战）。不能拆的：单服核心玩法逻辑（玩家状态在内存，拆成跨进程会带来状态同步的高延迟与一致性问题）。实际演进路径：先做周边系统微服务化（RuoYi GM 后台 + 登录服 Nacos 注册 + 支付服幂等），再按需把活动、跨服战等独立子系统拆出来，游戏服本体保持横向分片。灰度发布与热更新结合：新版本实例 metadata 打标，网关/路由按标切流，游戏热更的“先灰度区服验证再全服推”就是微服务灰度的同款流程。"
   },
   {
    "t": "h",
    "text": "改造反模式清单"
   },
   {
    "t": "list",
    "items": [
     "推倒重写：没有 Strangler Fig 渐进替换，一锅端重构，回滚成本无限大",
     "分布式单体：拆了服务却共享数据库/共享缓存，既要网络开销又没有独立部署能力",
     "按技术层拆：所有 DAO 一个服务、所有 Controller 一个服务——没有业务边界",
     "拆得过细：服务只有一两个接口，治理成本超过收益",
     "环形依赖：A 调 B、B 调 C、C 调 A，发布必须同时、故障互相传染",
     "数据库一步到位：服务拆了库没拆，跨服务直连库，边界形同虚设",
     "没有版本管理：接口改了就删旧版，客户端/下游全量被迫升级，回滚即爆炸"
    ]
   },
   {
    "t": "pits",
    "items": [
     "改造不拆数据：服务边界和数据库边界必须同步，只拆服务不拆库 = 分布式单体",
     "一次拆太多：并发拆多个服务，出问题无法定位是哪个变更引起的",
     "灰度方案没有数据库兼容：表结构变更要做“先加不改不删+双写过渡”，否则回滚时旧版本读不动",
     "忽略定时任务改造：单机 @Scheduled 集群跑 N 遍，要上 xxl-job 分片或分布式锁"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：微服务改造用 Strangler Fig 渐进式——先模块化、再垂直切片、数据先行、灰度迁移；数据库拆分按 表拆分→分库分表→读写分离 推进，数据私有是铁律；游戏服的正确姿势是周边系统微服务化 + 核心逻辑层按区服分片，自研 RPC/Kafka/配置推送就是微服务思想的野生实现；反模式要牢记——分布式单体、共享库、环形依赖、拆过细。最后一篇进入面试深水区，把高频易错点一次清完。"
   }
  ]
 },
 {
  "id": "microservice-interview-deep",
  "title": "微服务面试深水区：高频易错点合集",
  "layer": 3,
  "depends": [
   "microservice-registry-center",
   "microservice-distributed-transaction",
   "microservice-distributed-lock"
  ],
  "covers": [
   "microservice-01",
   "microservice-02",
   "microservice-21",
   "microservice-31"
  ],
  "quiz": [
   "microservice-21",
   "microservice-01",
   "microservice-31"
  ],
  "body": [
   {
    "t": "lead",
    "text": "CAP/BASE 的深层理解、双写一致性、分布式 ID、时钟问题、优雅停机——这些“深水区”考点最能区分背题选手和真懂的人。这一篇把微服务面试的高频深坑一次清完。"
   },
   {
    "t": "pre",
    "items": [
     "已经学完本分类前面全部教程",
     "能画出 CAP 三角并解释 P 必留",
     "熟悉分布式锁、分布式事务、注册中心的基本原理"
    ]
   },
   {
    "t": "h",
    "text": "CAP/BASE 深入：别再说“三者只能取其二”"
   },
   {
    "t": "p",
    "text": "CAP 的正确表述：网络分区（P）在分布式环境下必然发生，所以 P 不可放弃；当分区发生时，系统只能在一致性（C）和可用性（A）之间二选一。注意：①“三者取二”只在分区发生时成立，正常运行时 C 和 A 可以同时满足；②CAP 的 C 是“线性一致性”（所有节点同一时刻看到同一数据），比数据库事务的 ACID 一致性更严格——这也是为什么“MySQL 集群满足 CAP”这个说法不严谨；③选 CP 还是 AP 取决于业务：注册中心选 AP（宁旧勿死）、支付订单选 CP（宁慢勿错）。BASE 是 AP 方案的工程化：基本可用（部分功能降级）、软状态（允许中间状态）、最终一致（经过一段时间收敛）。关键认知：BASE 不是不要一致性，而是把强一致放宽成“可接受的最终一致”，并用消息、对账等手段保证收敛。"
   },
   {
    "t": "h",
    "text": "双写一致性：缓存与数据库谁先写"
   },
   {
    "t": "p",
    "text": "经典问题：更新 DB 和更新缓存，先后怎么定？错误答案：先更缓存再更 DB（崩溃即不一致）、先删缓存再更 DB（并发窗口期可能写入旧值回填）。标准姿势：先更新 DB，再删缓存（Cache Aside 模式）——读时 miss 回源 DB 重建缓存；删缓存失败用“延迟双删”或 MQ 重试补偿。为什么先 DB 后删缓存：更新 DB 后删除缓存，即使删除失败，最多一次缓存 miss 回源，最终一致；反过来先删缓存后更新 DB 的窗口期，并发读会回填旧值。更稳的方案：订阅 binlog 异步删缓存（Canal 监听变更），把缓存删除从业务代码里解耦出来。游戏场景：GM 后台改玩家数值，先更新 DB 再删该玩家缓存，下个读请求回源重建——简单可靠。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">微服务面试深水区知识地图</text>\n<rect x=\"20\" y=\"50\" width=\"195\" height=\"105\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">CAP/BASE</text>\n<text x=\"117\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">P 必留，分区时才取二</text>\n<text x=\"117\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">注册中心 AP、订单 CP</text>\n<text x=\"117\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BASE=AP 的工程化</text>\n<rect x=\"225\" y=\"50\" width=\"195\" height=\"105\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">双写一致性</text>\n<text x=\"322\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先更新 DB 再删缓存</text>\n<text x=\"322\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">延迟双删/消息补偿</text>\n<text x=\"322\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">binlog 订阅解耦</text>\n<rect x=\"430\" y=\"50\" width=\"195\" height=\"105\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"527\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">分布式 ID</text>\n<text x=\"527\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">雪花：41时间+10机器+12序列</text>\n<text x=\"527\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">时钟回拨是死穴</text>\n<text x=\"527\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家ID按服号段分配</text>\n<rect x=\"20\" y=\"168\" width=\"195\" height=\"105\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">时钟问题</text>\n<text x=\"117\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">NTP 跳变/回拨</text>\n<text x=\"117\" y=\"234\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">影响锁/选举/时间戳</text>\n<rect x=\"225\" y=\"168\" width=\"195\" height=\"105\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">优雅停机</text>\n<text x=\"322\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">摘流量→排空→关闭</text>\n<text x=\"322\" y=\"234\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Spring 钩子+健康检查</text>\n<rect x=\"430\" y=\"168\" width=\"195\" height=\"105\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"527\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏架构对照</text>\n<text x=\"527\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">周边微服务化+核心分片</text>\n<text x=\"527\" y=\"234\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">自研 RPC=野生 Dubbo</text>\n<text x=\"320\" y=\"278\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">深水区答题公式：概念 → 原理 → 取舍 → 工程兜底 → 游戏场景</text>\n</svg>",
    "caption": "图 18：深水区考点知识地图"
   },
   {
    "t": "h",
    "text": "分布式 ID 方案"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 雪花算法 64 位结构：1 符号 + 41 时间戳 + 10 机器位 + 12 序列号\n// 0 | 00000000000000000000000000000000000000000 | 0000000000 | 000000000000\npublic class SnowflakeIdGenerator {\n    private final long workerId;          // 机器位（ZK/Nacos 分配）\n    private long sequence = 0L;           // 同毫秒内序列号\n    private long lastTimestamp = -1L;\n\n    public synchronized long nextId() {\n        long ts = System.currentTimeMillis();\n        if (ts < lastTimestamp) {\n            // 时钟回拨：小幅度等待追平，超阈值报错（重复 ID 比慢更可怕）\n            long offset = lastTimestamp - ts;\n            if (offset > 5) { throw new IllegalStateException(\"clock moved backwards\"); }\n            ts = waitUntil(lastTimestamp);\n        }\n        if (ts == lastTimestamp) {\n            sequence = (sequence + 1) & 0xFFF;   // 12 位序列号上限 4096\n            if (sequence == 0) { ts = waitUntil(lastTimestamp + 1); } // 本毫秒耗尽\n        } else { sequence = 0L; }\n        lastTimestamp = ts;\n        return (ts << 22) | (workerId << 12) | sequence;\n    }\n}"
   },
   {
    "t": "p",
    "text": "方案谱系：UUID（无序、太长、索引碎片，不做主键）、数据库号段（一次取一批自增 ID 缓存本地，简单可靠）、Redis INCR（有序但要网络请求）、雪花（本地生成、趋势递增、QPS 百万级）。雪花优缺点：趋势递增对 InnoDB 聚簇索引友好、ID 自带时间信息；缺点依赖机器时钟——回拨产生重复 ID（等待/报错/历史最大时间戳续跑），机器位要集中分配（ZK/Nacos/Redis 申请）。游戏特色：充值订单号用雪花或“时间+服ID+自增”混合规则，玩家 ID 按区服号段预分配（服 ID 高位+自增低位），天然避免跨服合服冲突。"
   },
   {
    "t": "h",
    "text": "时钟问题：分布式系统最隐蔽的敌人"
   },
   {
    "t": "p",
    "text": "分布式系统的时钟分两类：物理时钟（System.currentTimeMillis，受 NTP 调整可能回拨或跳变）和逻辑时钟（Lamport/向量时钟，靠事件顺序递增，无物理依赖）。时钟问题的实际影响：①雪花 ID 重复（回拨）；②分布式锁的过期时间假设（GC 停顿/时钟跳变导致锁提前失效，RedLock 争议的根源）；③选举与租约（Leader 心跳超时判断依赖时钟）；④日志时间戳乱序（排障误导）。工程对策：ID 生成用逻辑时钟或号段方案绕开物理时钟；锁的正确性依赖用 ZK/etcd 会话或 fencing token；关键时间戳统一用数据库时间或消息序号。游戏场景：跨服战的对战开始/结束时间、活动开服时间戳，必须统一约定时钟源，避免各服各表。"
   },
   {
    "t": "h",
    "text": "优雅停机：发布不停机的另一半"
   },
   {
    "t": "p",
    "text": "优雅停机要保证：存量请求处理完、新请求不再进、外部感知不到抖动。标准三步：①摘流量——从注册中心注销/标记下线（Nacos 主动下线），负载均衡不再分发新请求；②排空——等待存量请求/队列任务处理完（Spring 的 ApplicationListener、K8s preStop 钩子、JVM shutdownHook），设置超时上限（如 30s）；③关闭资源——关闭连接池、线程池、Kafka 消费者、Redis 连接，停止接受新连接。游戏场景：游戏服停机维护就是完整的优雅停机流程——先封登录入口（摘流量）、踢出在线玩家并保存快照（排空）、停止战斗线程（关闭资源）、切维护状态。把这段运维经历翻译成微服务语言，就是“优雅停机”的标准答案。"
   },
   {
    "t": "h",
    "text": "面试易错点合集"
   },
   {
    "t": "list",
    "items": [
     "CAP 说“三者取二”：正确是分区时才取二，P 必留，正常运行时 C/A 可同时满足",
     "把 Nacos 简单归为 AP：临时实例 AP（Distro）、持久实例 CP（JRaft），双模是加分点",
     "分布式事务一上来就 2PC：先问业务是否允许最终一致，本地消息表+对账更常用",
     "RedLock 当成银弹：GC 停顿/时钟破坏时间假设，正确性敏感场景用 ZK 锁或 fencing token",
     "雪花 ID 只说优点：时钟回拨、机器位分配两个缺点必须能讲清解法",
     "Feign 超时配置不当：组件默认超时经常被覆盖，必须显式配置",
     "重试不配幂等：非幂等写接口自动重试 = 资损",
     "游戏场景答错：说“游戏服全面微服务化”，正确是周边微服务化+核心分片"
    ]
   },
   {
    "t": "pits",
    "items": [
     "深水区最怕背术语不落地：每个概念都要能给出“工程兜底”和“游戏场景”，例如 CAP 之后马上讲注册中心 AP 的选择",
     "双写一致性答反顺序：先更缓存再更 DB 是错误示范，标准是 Cache Aside 先 DB 后删缓存",
     "时钟问题只当玩笑：NTP 回拨是真实事故源，能讲出对锁/ID/选举的影响才算懂",
     "优雅停机漏了摘流量：直接 kill 进程 = 请求中断，摘流量→排空→关闭三步缺一不可"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：深水区考点一句话速记——CAP 分区才取二、BASE 是 AP 工程化；双写一致先 DB 后删缓存；分布式 ID 按场景选、雪花注意回拨；时钟问题影响锁/ID/选举，用逻辑时钟或会话规避；优雅停机三步摘流量→排空→关闭。至此 microservice 分类 16 篇教程全部完成，从架构演进到深水区考点形成完整闭环，游戏场景贯穿始终。"
   }
  ]
 }
]
};
