window.TB = window.TB || {};
window.TB["game-server"] = {
  id: "game-server",
  name: "游戏服务器架构专项",
  icon: "🎮",
  nodes: [
 {
  "id": "game-server-arch-overview",
  "title": "游戏服务器架构总览：六类服的职责边界",
  "layer": 0,
  "depends": [],
  "covers": [
   "game-server-01",
   "game-server-09",
   "game-server-36"
  ],
  "quiz": [
   "game-server-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服务器不是一个进程，而是一组按『实时性要求』和『故障爆炸半径』拆分的服务集群——先理解每类服的职责边界与依赖关系，才能谈后面的一切。"
   },
   {
    "t": "pre",
    "items": [
     "做过登录服/游戏服/支付服/日志服/GM 后台，对这些服的职责有感性认识",
     "理解『长连接有状态服务』与『无状态 Web 服务』的区别",
     "不需要先学本分类其他节点"
    ]
   },
   {
    "t": "h",
    "text": "拆分的两条铁律：实时性要求、故障爆炸半径"
   },
   {
    "t": "p",
    "text": "游戏服拆成多进程不是『跟风微服务』，背后只有两条可论证的原则。第一条按实时性要求分：玩家心跳、战斗结算、背包操作这类毫秒级响应的逻辑必须独占进程，不能被旁路业务拖慢；日志落库、BI 报表、GM 后台这类能容忍秒级甚至分钟级延迟的旁路，天然适合异步解耦——这正是日志链路用 Kafka 异步化的原因。第二条按故障爆炸半径分：支付回调是公网 HTTP 入口，被攻击或出 bug 不能把核心玩法拉下水；日志服挂了 2 小时，Kafka 消息堆积、恢复后按位点重放追平，玩家无感；但游戏服挂了全服玩家立刻掉线。拆服的收益最终收敛为三点：单点故障不扩散、独立扩容、安全边界清晰。"
   },
   {
    "t": "h",
    "text": "六类服的职责边界（结合 merge 类游戏）"
   },
   {
    "t": "list",
    "items": [
     "登录服：账号验证、token 签发、区服列表、负载均衡入口。无状态、短平快、可水平扩展；宕机不影响已在线玩家——长连接在游戏服上，只有新登录和重连受阻",
     "游戏服：核心玩法（merge、背包、任务、战斗）。长连接 + 内存态，有状态服务，可用性要求最高，是唯一不可随意重建的进程",
     "跨服/中心服：跨服战场、跨服聊天、全服排行榜。本质是『所有服都能到达的中立层』，把单服内存态提升为共享态",
     "支付服：对接苹果/微信/渠道支付回调，验签、防重发、通知游戏服发货。公网 HTTP 入口，独立部署做安全隔离",
     "日志服：消费 Kafka 的行为日志，批量落库/写文件。纯异步，挂了不丢数据（堆积重放），绝不同步阻塞业务线程",
     "GM 后台：运营管理入口。通过指令通道操作游戏服（发补偿、封号、查数据），走内网 RPC/消息，权限审计独立，绝不直连游戏库"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服系统分层：实时性从高到低、旁路逐层剥离开</text>\n<rect x=\"200\" y=\"42\" width=\"240\" height=\"42\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">玩家客户端（长连接）</text>\n<rect x=\"40\" y=\"110\" width=\"270\" height=\"120\" rx=\"10\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"175\" y=\"132\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">实时层（毫秒级，有状态）</text>\n<rect x=\"60\" y=\"146\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">游戏服（核心玩法）</text>\n<rect x=\"180\" y=\"146\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"235\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">跨服/中心服</text>\n<text x=\"175\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">宕机=全服掉线，需最高保障</text>\n<rect x=\"330\" y=\"110\" width=\"270\" height=\"120\" rx=\"10\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"465\" y=\"132\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">准实时/入口层（无状态）</text>\n<rect x=\"350\" y=\"146\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"405\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">登录服</text>\n<rect x=\"470\" y=\"146\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"171\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">支付服（公网入口）</text>\n<text x=\"465\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可快速扩容，宕机影响新入口</text>\n<rect x=\"180\" y=\"256\" width=\"280\" height=\"42\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"282\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">日志服 / BI 服 / GM 后台（旁路异步，Kafka 解耦）</text>\n<path d=\"M320 84 L250 110\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#g1a)\"/>\n<path d=\"M320 84 L430 110\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#g1a)\"/>\n<path d=\"M175 230 L300 256\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"5 4\" marker-end=\"url(#g1b)\"/>\n<path d=\"M465 230 L340 256\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"5 4\" marker-end=\"url(#g1b)\"/>\n<defs><marker id=\"g1a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker><marker id=\"g1b\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：六类服按实时性与爆炸半径分层"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">玩家世界边界的三种形态：单服 / 分区分服 / 合服</text>\n<rect x=\"30\" y=\"55\" width=\"180\" height=\"96\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">单服</text>\n<text x=\"120\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一进程管所有玩家</text>\n<text x=\"120\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">社交无边界，容量见顶</text>\n<text x=\"120\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">适合测试期/小规模</text>\n<rect x=\"230\" y=\"55\" width=\"180\" height=\"96\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">分区分服</text>\n<text x=\"320\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">每区独立进程组</text>\n<text x=\"320\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">开新区扩容，跨服缝合</text>\n<text x=\"320\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">主流模型</text>\n<rect x=\"430\" y=\"55\" width=\"180\" height=\"96\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"520\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">合服</text>\n<text x=\"520\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">多服数据并集去重</text>\n<text x=\"520\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">恢复人气，老区激活</text>\n<text x=\"520\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">难点：ID冲突/重名/关系重连</text>\n<path d=\"M210 103 L230 103\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g1c)\"/>\n<path d=\"M410 103 L430 103\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g1c)\"/>\n<text x=\"220\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">容量不够→开新区</text>\n<text x=\"420\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">人少→合并</text>\n<rect x=\"30\" y=\"180\" width=\"580\" height=\"50\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">本质：『玩家世界的边界』随容量与活跃度动态调整</text>\n<text x=\"320\" y=\"222\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分服是扩容手段，合服是运营手段，跨服玩法把分裂的世界重新缝合</text>\n<rect x=\"30\" y=\"246\" width=\"580\" height=\"38\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">同屏容量是带宽问题不是机器问题：AOI 裁剪 + 增量 + 降频才是解法</text>\n<defs><marker id=\"g1c\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 1b：单服/分区分服/合服模型演进"
   },
   {
    "t": "h",
    "text": "单服 → 分区分服 → 合服的模型演进"
   },
   {
    "t": "p",
    "text": "单服模型（一个进程管所有玩家）适合测试期或小规模游戏：社交无边界、开发最简单，但万人同在线时 CPU/内存/GC 全面吃紧，所有玩家挤在同一张地图和频道，广播放大效应严重，撑不过几次开服洪峰。分区分服是当前主流：按区服隔离玩家世界，容量不够就『开新区』，从根上解决单机瓶颈；代价是玩家世界被割裂，所以需要跨服玩法（跨服战场、跨服聊天、全服排行）把分裂的世界重新缝合。合服是反向操作：老区人少时把多个服数据合并成一服恢复人气，难点在数据并集去重——主键冲突、重名、社交关系重连，一个漏网就是线上灵异 bug。三者的演进本质是同一件事：『玩家世界的边界』如何随容量和活跃度动态调整。"
   },
   {
    "t": "h",
    "text": "同屏玩家容量设计的核心矛盾：带宽广播放大"
   },
   {
    "t": "p",
    "text": "服务器进程能扛的『同时在线数』通常不是瓶颈，真正的瓶颈是同屏广播放大：一个玩家移动要同步给视野内所有人，100 人同屏约等于 100×99 条同步消息。先算带宽账：单个同步包约 50 字节，视野 50 人、广播 10Hz，单玩家下行约 25KB/s；同屏 100 人则约 250KB/s——远超移动网络承受能力。所以同屏容量设计的本质是裁剪广播（AOI 视野管理）与压缩频率（增量同步、远近降频），而不是无限加机器。MMORPG 常规目标单场景 50~150 人同屏，国战等超大场景靠极限降频 + 客户端 LOD 兜底，这是容量设计的默认前提。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 登录服路由表：无状态服务的核心数据（示意）\npublic class LoginRouter {\n    // 区服ID -> 游戏服网关地址；在线标记放 Redis 共享\n    private final Map<Integer, String> serverAddr = new ConcurrentHashMap<>();\n\n    // 登录服只做两件事：验账号、指路。玩家本体在游戏服\n    public LoginResp login(String account, String pwd) {\n        int sid = pickServer(); // 负载均衡选区服（按活跃度/在线数加权）\n        String token = issueToken(account, sid); // 签发短时效 token\n        return new LoginResp(sid, serverAddr.get(sid), token);\n    }\n\n    // 在线状态：登录服与游戏服通过 Redis 共享，防多端顶号\n    public boolean tryLockOnline(long uid, int sid) {\n        return redis.setIfAbsent(\"online:\" + uid, sid, 120, SECONDS);\n    }\n}"
   },
   {
    "t": "h",
    "text": "服务间通信：内网 RPC 与消息队列的分工"
   },
   {
    "t": "p",
    "text": "游戏服之间的同步调用走内网 RPC（Netty 长连接 + 自定义二进制或 Protobuf），请求带 seqId 异步回调，支持超时重试；游戏服与旁路（日志、BI、GM 指令）之间走 Kafka/消息队列异步解耦。铁律：资产变动只在玩家所属的游戏服执行（资产单写原则），其他服只产出『结果事件』，通过消息或 RPC 回推，杜绝双写。这条铁律在跨服战场、战斗服与功能服拆分、支付发货里反复出现，是整个架构一致性的地基。"
   },
   {
    "t": "pits",
    "items": [
     "把拆分答成跟风微服务——必须讲透『实时性 + 爆炸半径』两条可论证的原则",
     "说游戏服是无状态的——游戏服恰恰是有状态的核心，无状态的是登录服/匹配服",
     "漏掉『已在线玩家不受登录服宕机影响』这个关键点：长连接挂在游戏服，登录服只服务新入口",
     "同屏容量只谈在线人数、不谈带宽广播放大——面试官要的是数量级估算能力",
     "忽略资产单写原则——跨服/战斗服/支付服之间的一致性全靠它兜底"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：六类服 = 实时层（游戏服/跨服）+ 入口层（登录/支付）+ 旁路层（日志/BI/GM），由『实时性要求』和『故障爆炸半径』两条铁律驱动拆分；玩家世界边界随容量演进（单服→分区分服→合服）；同屏容量本质是带宽裁剪问题。"
   }
  ]
 },
 {
  "id": "game-server-net-comm",
  "title": "客户端-服务器通信模型：长连接、协议与同步方式",
  "layer": 0,
  "depends": [],
  "covers": [
   "game-server-02",
   "game-server-03",
   "game-server-18",
   "game-server-31",
   "game-server-40"
  ],
  "quiz": [
   "game-server-02",
   "game-server-03",
   "game-server-40"
  ],
  "body": [
   {
    "t": "lead",
    "text": "通信模型决定整个游戏服的骨架：长连接还是短连接、协议怎么设计、服务器权威还是客户端权威、状态同步还是帧同步——四个选择定下来，架构大方向就定了。"
   },
   {
    "t": "pre",
    "items": [
     "理解 TCP 长连接与 HTTP 短连接的区别",
     "知道粘包/半包问题（TCP 是字节流）",
     "对『服务器权威』这个概念有直觉"
    ]
   },
   {
    "t": "h",
    "text": "长连接 vs 短连接：MMORPG 为什么必须长连接"
   },
   {
    "t": "p",
    "text": "短连接（HTTP 请求-响应）的问题在于：每次交互都要握手，实时玩法（移动同步、战斗）要求毫秒级往返，握手开销不可接受；且服务器无法主动推送——MMORPG 里『别人的位置变了』必须由服务器推给客户端，短连接模型下只能靠客户端高频轮询，流量浪费一个量级。长连接（TCP 保活 + 心跳）天然支持服务器主动推送，也方便做断线感知（心跳超时即踢）。选型边界：登录鉴权、支付回调这类低频、一次性的交互走短连接（HTTP 公网入口）更简单；核心玩法、聊天、广播一律长连接。注意长连接是有状态资源，连接数会打满——游戏服按『同时在线数 + 冗余』规划连接上限，Netty 单机轻松支撑数万连接，瓶颈通常在业务线程和 DB 而非 socket。"
   },
   {
    "t": "h",
    "text": "消息协议设计原则：二进制、定长包头、协议号管理"
   },
   {
    "t": "p",
    "text": "游戏协议首选二进制（Protobuf 或自定义），体积小、解析快、免文本歧义；包头 = 包长 + 协议号 + 序列号 + 校验，包体 = 序列化数据。粘包半包用长度字段解决：Netty 的 LengthFieldBasedFrameDecoder 按包长拆包，业务层拿到的永远是完整包。协议号按模块分段治理（1xxx 登录、2xxx 背包、3xxx 战斗、9xxx GM），在一张协议表（Excel/IDL）里登记，启动时校验唯一性，废号保留不复用；代码由工具链从 IDL 自动生成，杜绝手写错位。兼容性铁律：只增字段不改语义、废弃协议留占位、客户端对未知字段跳过不崩、不兼容大版本走强更（登录服按版本拦截）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Netty 拆包 + 协议分发骨架（IO 线程只做编解码）\nServerBootstrap b = new ServerBootstrap();\nb.group(boss, worker).channel(NioServerSocketChannel.class)\n .childHandler(new ChannelInitializer<SocketChannel>() {\n     @Override protected void initChannel(SocketChannel ch) {\n         ch.pipeline()\n           // 粘包半包：2 字节长度前缀\n           .addLast(new LengthFieldBasedFrameDecoder(65536, 0, 2, 0, 2))\n           .addLast(new MsgDecoder())   // 协议号 + 反序列化\n           .addLast(new MsgDispatcher()) // 按玩家ID哈希投递业务线程，IO线程不阻塞\n           .addLast(new HeartbeatHandler(30)); // IdleStateHandler 踢死链\n     }\n });\n// 协议号唯一性校验（启动时执行，冲突直接拒绝启动）\nvoid checkUnique(Map<Integer, Class<?>> regs) {\n    Set<Integer> seen = new HashSet<>();\n    for (Integer no : regs.keySet())\n        if (!seen.add(no)) throw new IllegalStateException(\"协议号重复: \" + no);\n}"
   },
   {
    "t": "h",
    "text": "客户端状态与服务器权威"
   },
   {
    "t": "p",
    "text": "通信模型的上层是权威模型：一切可影响资产/结果的判定必须由服务器算，客户端只负责表现与输入。血量、货币、位置、掉落、结算全部以服务器为准——客户端改了内存只是自嗨，下次服务器校正就拉回来。服务器权威是反外挂的根基（协议全被逆向也不致命，因为伪造请求过不了服务器校验），也是断线重连简单的前提（重连直接拉服务器快照即可）。『客户端负责即时表现（预测 + 插值），服务器负责低频校正（5~10Hz 权威坐标）』是 MMORPG 的标准分工。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">服务器权威模型：客户端表现，服务器校正</text>\n<rect x=\"30\" y=\"50\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">客户端</text>\n<text x=\"120\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">输入指令 + 预测插值表现</text>\n<rect x=\"430\" y=\"50\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"520\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">服务器</text>\n<text x=\"520\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">权威状态 + 5~10Hz 校正</text>\n<path d=\"M210 75 L430 75\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g2a)\"/>\n<path d=\"M430 95 L210 95\" stroke=\"var(--lv2)\" stroke-width=\"2.5\" marker-end=\"url(#g2b)\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">移动/技能/拾取指令</text>\n<text x=\"320\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">状态快照 + 校正包</text>\n<rect x=\"30\" y=\"160\" width=\"580\" height=\"60\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">断线重连 = 重新拉取服务器快照，无缝恢复</text>\n<text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家资产/位置/Buff 全在服务器，客户端只丢表现层</text>\n<rect x=\"30\" y=\"240\" width=\"580\" height=\"44\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"267\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">反外挂根基：客户端可被完全逆向，但伪造请求过不了服务器语义校验</text>\n<defs><marker id=\"g2a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker><marker id=\"g2b\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv2)\"/></marker></defs>\n</svg>",
    "caption": "图 2：客户端表现 + 服务器权威 + 快照重连"
   },
   {
    "t": "h",
    "text": "同步方式：帧同步 vs 状态同步"
   },
   {
    "t": "p",
    "text": "帧同步同步『操作』：服务器只转发玩家输入指令，所有客户端用相同逻辑 + 统一随机种子本地模拟，适合 MOBA/RTS/格斗这类局制短对局——流量小、服务器轻，但要求逻辑绝对确定（定点数、禁浮点、禁本地状态、逻辑帧固定步进），断线重连要补指令流快进追帧，且逻辑在客户端、防外挂先天弱势。状态同步同步『结果』：逻辑全在服务器跑，广播实体状态给客户端，客户端只做表现——服务器权威、防外挂强、重连直接拉快照，天然适合大世界百人同屏，代价是服务器 CPU/带宽压力大。MMORPG 选状态同步的核心理由：无『一局』边界无法追帧、玩法持续演进确定性难维护、需要权威防作弊。业界常态是混合：MMORPG 主玩法状态同步，跨服战场/竞技场等局制玩法内嵌帧同步房间。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "帧同步（Lockstep）",
     "状态同步"
    ],
    "rows": [
     [
      "同步内容",
      "玩家输入指令流",
      "实体状态结果"
     ],
     [
      "服务器压力",
      "轻（只转发 + 组帧）",
      "重（全逻辑 + 广播）"
     ],
     [
      "网络流量",
      "小且恒定",
      "大（需 AOI 裁剪）"
     ],
     [
      "防外挂",
      "弱（逻辑在客户端）",
      "强（服务器权威）"
     ],
     [
      "断线重连",
      "追帧快进模拟",
      "拉快照即恢复"
     ],
     [
      "适合类型",
      "MOBA / RTS / 格斗",
      "MMORPG / 大世界"
     ]
    ]
   },
   {
    "t": "h",
    "text": "通信模型落地到你的项目"
   },
   {
    "t": "p",
    "text": "merge 类游戏的经验：核心玩法（merge、背包、战斗）走长连接 + 状态同步 + 服务器权威；登录、支付、GM 指令走 HTTP/内网 RPC 短连接；心跳 3~5 秒 + 30 秒超时判定掉线；协议号模块分段 + IDL 工具链自动生成双端代码。这几个决定一旦定下，后面会话管理、数据落地、AOI、反外挂全部建立在这套通信骨架上。"
   },
   {
    "t": "pits",
    "items": [
     "把帧同步说成过时技术——它在 MOBA 仍是主流，选型要讲场景匹配",
     "只答『用 Protobuf』不答协议号治理——规模化下怎么不乱才是考点",
     "忽略 IO 线程绝不阻塞——业务 Handler 跑在 EventLoop 上会冻住成千上万连接",
     "把客户端时间当权威——一切判定用服务器时间，客户端只做显示",
     "漏掉协议『只增不改』兼容铁律——老客户端与新版服务器共存靠它"
    ]
   },
   {
    "t": "h",
    "text": "协议的性能细节：序列化、压缩与流水线"
   },
   {
    "t": "p",
    "text": "协议设计不止正确性，性能细节同样决定体验：① 序列化选型——Protobuf 体积小解析快（变长编码），但反射序列化慢，游戏服要预生成编解码器（proto 工具生成 + 缓存反射）或直接用生成的代码；② 字段压缩——高频协议（移动、血量）用定长 int16/int32 + 位压缩（坐标除以精度存 short），比通用序列化再省 30~50%；③ 合并与流水线——客户端批量操作合并成一个协议（一次战斗结算一个包），服务器 tick 末合并广播，减少小包风暴（小包的系统调用与 TCP 开销占比极高）；④ 消息优先级——同一连接上移动包可以丢（用最新覆盖），而交易/支付包必须可靠有序，协议栈支持按优先级调度；⑤ 大数据块（战斗录像、大地图资源）与实时消息分通道——避免大包阻塞实时消息，走独立的可靠通道或文件传输。这些细节在百人同屏时就是带宽从爆到不爆的区别。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：长连接承载实时玩法、短连接处理低频入口；协议用二进制定长包头 + 协议号分段治理 + 工具链生成 + 只增不改；同步方式按『状态边界』选型——有局的选帧同步、大世界选状态同步；服务器权威是反外挂与重连体验的共同地基。"
   }
  ]
 },
 {
  "id": "game-server-session",
  "title": "玩家会话管理：从登录鉴权到断线重连",
  "layer": 1,
  "depends": [
   "game-server-arch-overview",
   "game-server-net-comm"
  ],
  "covers": [
   "game-server-07",
   "game-server-06",
   "game-server-33",
   "game-server-37"
  ],
  "quiz": [
   "game-server-07"
  ],
  "body": [
   {
    "t": "lead",
    "text": "会话（Session）是『玩家逻辑身份』与『网络连接』之间的胶水：登录鉴权建会话、心跳保活、掉线保尸、重连换绑、顶号互踢、跨服迁移——把会话状态机画清楚，通信层与业务层就解耦了。"
   },
   {
    "t": "pre",
    "items": [
     "理解长连接与服务器权威模型（见通信模型节点）",
     "知道 token 与登录服的职责（见架构总览节点）",
     "对『掉线 ≠ 下线』有直觉认识"
    ]
   },
   {
    "t": "h",
    "text": "Session 生命周期：一个完整的状态机"
   },
   {
    "t": "p",
    "text": "游戏服里一个玩家会话经历五个阶段：连接建立（TCP 连上，尚未认证）→ 鉴权登录（凭 token 换取正式会话）→ 活跃（正常收发业务消息）→ 掉线保尸（连接断开，玩家对象保留 N 分钟，标记 offline 不落地不踢出，MMORPG 中机器人托管继续被攻击）→ 销毁（超时真正下线：写库、清内存、广播好友下线）。关键区分是『掉线 ≠ 下线』：掉线只是网络层事件，保尸期内玩家仍在世界中；只有超过保尸时间（常见 3~5 分钟）才触发真正下线。这个设计决定了重连体验（秒回）与数据安全（防掉线丢数据）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">会话状态机：连接 → 鉴权 → 活跃 → 保尸 → 销毁</text>\n<rect x=\"30\" y=\"100\" width=\"120\" height=\"50\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"90\" y=\"129\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">CONNECTED</text>\n<rect x=\"190\" y=\"100\" width=\"120\" height=\"50\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"250\" y=\"129\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">AUTH(鉴权)</text>\n<rect x=\"350\" y=\"100\" width=\"120\" height=\"50\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"410\" y=\"129\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">ACTIVE(活跃)</text>\n<rect x=\"510\" y=\"100\" width=\"110\" height=\"50\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"565\" y=\"129\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">OFFLINE(保尸)</text>\n<path d=\"M150 125 L190 125\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g3a)\"/>\n<path d=\"M310 125 L350 125\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g3a)\"/>\n<path d=\"M470 125 L510 125\" stroke=\"var(--lv3)\" stroke-width=\"2\" marker-end=\"url(#g3a)\"/>\n<text x=\"170\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">token 验证</text>\n<text x=\"330\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录成功</text>\n<text x=\"490\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">心跳超时</text>\n<path d=\"M565 150 L565 190 L90 190 L90 150\" stroke=\"var(--lv2)\" stroke-width=\"2\" stroke-dasharray=\"5 4\" fill=\"none\" marker-end=\"url(#g3b)\"/>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">保尸期内重连：换绑连接恢复 ACTIVE（秒回）</text>\n<text x=\"320\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">超过保尸时间：真正下线（写库 / 清内存 / 广播好友下线）</text>\n<defs><marker id=\"g3a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker><marker id=\"g3b\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv2)\"/></marker></defs>\n</svg>",
    "caption": "图 3：会话状态机闭环"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">登录鉴权时序：token 双段签发 + 防重放</text>\n<rect x=\"30\" y=\"55\" width=\"120\" height=\"44\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"90\" y=\"81\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">客户端</text>\n<rect x=\"260\" y=\"55\" width=\"120\" height=\"44\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"81\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">登录服（无状态）</text>\n<rect x=\"490\" y=\"55\" width=\"120\" height=\"44\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"550\" y=\"81\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">游戏服（有状态）</text>\n<path d=\"M90 99 L320 99\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g3c)\"/>\n<text x=\"205\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">① 账号密码/渠道 token</text>\n<path d=\"M320 115 L320 140\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<path d=\"M320 140 L90 140\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g3c)\"/>\n<text x=\"205\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">② 验账号 → 签发短时效 token（HMAC 签名）</text>\n<path d=\"M150 140 L150 190 L490 190\" stroke=\"var(--lv2)\" stroke-width=\"2\" stroke-dasharray=\"5 4\" fill=\"none\" marker-end=\"url(#g3d)\"/>\n<text x=\"320\" y=\"185\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">③ 客户端携 token 连接游戏服</text>\n<path d=\"M550 200 L550 230 L90 230\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#g3e)\"/>\n<text x=\"320\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">④ 验 token（签名/过期/防重放）→ 建会话，业务消息不再验 token</text>\n<rect x=\"30\" y=\"244\" width=\"580\" height=\"36\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"267\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">token 只服务登录/重连；过期重连走刷新流程，新 token 签发并吊销旧 token 防顶号</text>\n<defs><marker id=\"g3c\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker><marker id=\"g3d\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv2)\"/></marker><marker id=\"g3e\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n</svg>",
    "caption": "图 3b：登录鉴权时序"
   },
   {
    "t": "h",
    "text": "登录鉴权流程：token 双段签发与防重放"
   },
   {
    "t": "p",
    "text": "完整链路：客户端拿账号密码/渠道 token 请求登录服 → 登录服验证账号（自有库或渠道服务端验签）→ 映射到内部 accountId → 签发短时效 token（含 accountId、区服、过期时间、随机盐）→ 客户端携 token 连接游戏服 → 游戏服校验 token（防重放：记录已用序列号；防过期：时效校验）→ 建立正式会话。多渠道接入时，渠道差异被适配层隔离，业务只认内部 accountId 与 token。游戏中的业务消息不再校验 token（token 只在登录/重连时用），避免每包解密开销；token 过期后重连走刷新流程，登录服重新签发并吊销旧 token 防顶号。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 登录服签发 token（HMAC 签名，游戏服可无状态校验）\nString issueToken(long accountId, int sid, long expireAt) {\n    String payload = accountId + \".\" + sid + \".\" + expireAt + \".\" + nonce();\n    String sig = hmacSha256(payload, SERVER_SECRET);\n    return Base64.urlEncode(payload + \".\" + sig);\n}\n// 游戏服校验 + 防重放\nboolean verifyToken(String token) {\n    String[] parts = decode(token).split(\"\\.\");\n    if (!hmacSha256(parts[0], SERVER_SECRET).equals(parts[1])) return false; // 篡改\n    if (Long.parseLong(parts[0].split(\"\\.\")[2]) < now()) return false;      // 过期\n    return redis.setIfAbsent(\"tokenUsed:\" + token, \"1\", 300, SECONDS);       // 重放\n}"
   },
   {
    "t": "h",
    "text": "顶号处理与同账号多端"
   },
   {
    "t": "p",
    "text": "顶号 = 同一账号新设备登录，旧会话被强制下线。设计要点：在线状态放 Redis 共享（online:{uid} → sid），登录服在游戏服确认可登录后写入并标记旧会话；游戏服收到新会话建立请求后，向旧会话推『被顶下线』消息并断开旧连接。同一账号能否同端多开由产品定——通常同端只允许一个会话（防共享账号）。顶号是安全操作，必须带审计日志（何时、何 IP 顶掉了谁），防止盗号后顶号引发客诉。"
   },
   {
    "t": "h",
    "text": "Session 与玩家数据绑定：单入口单出口"
   },
   {
    "t": "p",
    "text": "会话对象与玩家内存对象的绑定遵循『单入口单出口』：PlayerManager 是玩家对象的唯一持有者（在线表），其他模块（组队、公会、排行榜快照）只存 playerId，用时查在线表，不缓存对象引用——这是防内存泄漏的第一道防线。下线统一走 logout() 收口：从在线表摘除 → 清理定时器/监听器 → 数据落地 → 广播下线，所有反注册集中一处。session 绑定 playerId，任何业务代码都不直接持有 Channel 引用（用 session 封装），换连接时只需更新 session 的连接字段，业务无感知。"
   },
   {
    "t": "h",
    "text": "跨服迁移会话"
   },
   {
    "t": "p",
    "text": "玩家进跨服战场或跨地图进程时，会话要从源进程迁移到目标进程：源进程打包玩家内存状态（属性快照）→ 目标进程加载 → 路由/网关把后续消息转投目标进程 → 客户端短重连（或代理层透明切换）。核心一致性要求：任一时刻只有一个权威副本；迁移用两阶段——源进程打包后仍持有只读副本，目标加载确认并切换路由成功后才释放，中途失败回退源进程。玩家在跨服期间，原服长连接可以保持（影子方案），也可以断开重连到中心服，两种做法各有取舍。"
   },
   {
    "t": "pits",
    "items": [
     "只答『心跳 3~5 秒』不答状态流转——保尸/重连/顶号才是考点",
     "把保尸期玩家当正常在线玩家广播——offline 标记要参与各类系统判定",
     "顶号不做审计——盗号客诉时没有证据链",
     "session 里直接存 Channel 引用并到处传——换连接时全部失效，必须封装",
     "跨服迁移不做两阶段——迁移中进程挂了玩家状态会丢"
    ]
   },
   {
    "t": "h",
    "text": "会话与业务状态一致性、并发登录竞态"
   },
   {
    "t": "p",
    "text": "会话对象上还要绑定三个一致性约束。第一，版本校验：session 记录玩家数据版本号（dataVersion），重连恢复时若玩家在掉线期间被离线系统改动过（GM 补发、公会踢人、跨服结算），上线要重新拉取最新数据而非用保尸期内的旧内存副本，避免覆盖。第二，并发登录竞态：同一账号两个客户端同时发起登录，游戏服对同一 playerId 的登录请求必须串行化（玩家级锁或登录队列），先到者建会话、后到者按顶号逻辑处理，绝不能两个会话同时持有玩家对象。第三，会话恢复时的状态推送分两级：全量关键快照（背包货币、位置、Buff 列表）秒级拉取，增量事件（掉线期间的世界变化）按需补发——全量保证正确，增量保证带宽。连接资源规划上，单连接占用内存约 2~10KB（接收缓冲 + 编解码上下文），十万连接约 1GB 量级，连接数本身不是瓶颈，但每个 EventLoop 上的活跃连接数与业务分发要匹配，避免单 EventLoop 过载。"
   },
   {
    "t": "p",
    "text": "补充一个常被忽略的并发细节：会话对象分两层存在——IO 层的连接会话（绑在 EventLoop 上，负责心跳探活、字节流收发）与业务层的玩家会话（绑在业务线程，负责业务逻辑与数据）。两层通过玩家 ID 关联，跨层访问必须经队列投递而非直接调对象（IO 线程改业务对象、业务线程写 Channel 都有并发隐患）。心跳检测放在 IO 层（Netty IdleStateHandler），判定掉线只是发事件通知业务层，业务层决定保尸还是销毁——这样 IO 层永远不碰玩家数据，职责干净。"
   },
   {
    "t": "p",
    "text": "补一个重连体验细节：会话恢复时服务器按需下发离线期间的关键事件摘要（被加入队伍、收到好友申请、跨服结算到账），配合秒回的快照，让玩家上线时对『离线期间发生了什么』有完整感知，而不是凭空少了一截。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：会话状态机 = 连接 → 鉴权 → 活跃 → 保尸 → 销毁；token 双段签发 + 防重放 + 顶号互踢；掉线 ≠ 下线是体验关键；PlayerManager 单入口 + logout 收口防泄漏；跨服迁移两阶段保证单权威副本。"
   }
  ]
 },
 {
  "id": "game-server-player-data",
  "title": "玩家数据存储：内存为准、异步落地、分库分表",
  "layer": 1,
  "depends": [
   "game-server-arch-overview"
  ],
  "covers": [
   "game-server-04",
   "game-server-12",
   "game-server-15",
   "game-server-35"
  ],
  "quiz": [
   "game-server-04",
   "game-server-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "玩家数据是游戏服最重要的资产：线上玩法每秒改几十次，实时写库 DB 必挂，于是『内存为准、异步落地、流水兜底』成为游戏服数据层的公理级设计。"
   },
   {
    "t": "pre",
    "items": [
     "理解有状态服务与内存态（见架构总览）",
     "会用 MySQL 与 MyBatis-Plus",
     "理解事务与幂等的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "为什么不能实时写库：记账白板模型"
   },
   {
    "t": "p",
    "text": "玩家背包、货币、任务在玩法中每秒被改几十上百次，若每次都同步写 MySQL，DB 的 QPS 会在开服瞬间被打满，且长事务阻塞线上。游戏服的标准答案是『内存为准』：玩家上线时从 DB 加载到内存，之后所有读写都操作内存对象（纳秒级），DB 只是持久化仓库。类比：内存是记账白板，定时抄到账本（DB），收钱（充值）当场开票（流水），打烊（关服）前必须抄完。这个模型的关键是明确『可丢的』与『不可丢的』：普通玩法进度丢最近几分钟可接受，资产变动（充值/交易/抽奖）必须同步写或先写流水兜底。"
   },
   {
    "t": "h",
    "text": "数据表设计：按玩家 ID 分片的唯一事实源"
   },
   {
    "t": "p",
    "text": "玩家私有数据（档案、背包、任务、邮件）按 playerId 取模分库分表，同一玩家的数据永远落在同一片，业务查询带 playerId 直接路由、天然无跨片。全服数据（排行榜、公会、拍卖行）单独存 Redis 或独立库，不参与分片。主键必须全局唯一（雪花 ID 或号段），否则合服时主键冲突爆炸。跨片查询（GM 按昵称查玩家）靠昵称→playerId 映射索引（注册时写入并保唯一），禁止全片广播扫。分片数写死难扩容，用『逻辑分片多、物理库少』的映射，扩容时整片迁移。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 玩家对象：dirty 标记 + 内存为准（示意）\npublic class Player {\n    public final long playerId;\n    // 各模块独立 dirty 位，落地只处理脏模块\n    private boolean dirtyBag, dirtyMoney, dirtyQuest;\n    private Bag bag = new Bag();\n    private long money;\n\n    public void addMoney(long delta) {\n        this.money += delta;\n        dirtyMoney = true;   // 改内存 + 打标，不碰 DB\n    }\n    // 资产类操作：内存 + 同步流水双写\n    public void addMoneyCritical(long delta, String orderId) {\n        addMoney(delta);\n        ledger.save(orderId, playerId, delta); // Kafka/流水表，保证不丢\n    }\n}\n// 落地线程：批量按脏集合写库\nvoid flushLoop() {\n    List<Player> dirty = playerManager.dirtyPlayers();\n    dirty.parallelStream().filter(p -> p.hasDirty())\n         .forEach(p -> mapper.batchUpdate(p)); // 分桶 + 限流，失败保留标记重试\n}"
   },
   {
    "t": "h",
    "text": "加载/回存时机与四道防线"
   },
   {
    "t": "p",
    "text": "加载：玩家登录进内存（可选 Redis 二级缓存/会话标记），离线玩家被操作时走『影子加载』（LRU 缓存 + 过期时间）。回存四道防线：① dirty 标记——对象修改即置位；② 定时落地——60~120 秒扫一遍脏集合批量写库，按玩家分桶多线程 + 限流，写失败保留标记下轮重试；③ 关键操作同步写——充值、交易、抽奖这类资产变动同步写库或先写 Kafka 流水，宁可慢不可丢；④ 关服刷盘——ShutdownHook/GM 停服指令：拒新登录 → 踢人 → 全部 dirty 刷库 → 退出，刷盘失败不退出（重试 + 本地文件兜底）。宕机兜底靠流水对账：资产流水在 Kafka/流水表，可按流水补偿。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">玩家数据链路：加载 → 内存 → 异步落地 → 流水兜底</text>\n<rect x=\"30\" y=\"55\" width=\"150\" height=\"60\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"105\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">MySQL（账本）</text>\n<text x=\"105\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">playerId 分片</text>\n<rect x=\"245\" y=\"55\" width=\"150\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">玩家内存对象</text>\n<text x=\"320\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">dirty 标记 + 锁内无锁</text>\n<rect x=\"460\" y=\"55\" width=\"150\" height=\"60\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"535\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">流水/Kafka</text>\n<text x=\"535\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">资产变动审计</text>\n<path d=\"M180 85 L245 85\" stroke=\"var(--lv1)\" stroke-width=\"2.5\" marker-end=\"url(#g4a)\"/>\n<path d=\"M395 85 L460 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g4a)\"/>\n<text x=\"212\" y=\"76\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">登录加载</text>\n<text x=\"427\" y=\"76\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">资产双写</text>\n<path d=\"M245 115 L180 145\" stroke=\"var(--lv3)\" stroke-width=\"2\" stroke-dasharray=\"5 4\" marker-end=\"url(#g4b)\"/>\n<text x=\"175\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">dirty 定时批量落地</text>\n<rect x=\"30\" y=\"170\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">关服刷盘：拒新登录 → 踢人 → 刷全部 dirty → 确认后退出</text>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">宕机兜底：按流水对账补偿，普通进度容忍分钟级丢失</text>\n<defs><marker id=\"g4a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker><marker id=\"g4b\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n</svg>",
    "caption": "图 4：内存为准 + 异步落地 + 流水兜底"
   },
   {
    "t": "h",
    "text": "缓存与 DB 一致性的红线"
   },
   {
    "t": "p",
    "text": "一致性铁律：在线玩家数据以内存为准，任何外部修改（GM、客服）必须走业务线程进内存再落地，绝不允许后台直接 update 数据库——否则定时落地会用内存旧值覆盖回库，造成『改了没生效』和『内存库不一致』双重事故。Redis 只做缓存与共享态（在线标记、排行榜、会话 token），不做玩家资产唯一存储——Redis 持久化（RDB/AOF）和主从切换都有丢数窗口，账本还是 MySQL。缓存更新用『先更新内存 → 异步落地 → 缓存失效』顺序，避免缓存与库时序错乱。"
   },
   {
    "t": "h",
    "text": "回档与数据修复"
   },
   {
    "t": "p",
    "text": "回档分两级：单玩家回档（按流水逆向回收异常道具，常用于事故处理）和全服回档（核弹级，仅数据全面污染时用）。日常修复靠 GM 指令通道：发补偿走玩家业务线程进内存落地；离线玩家走『待执行指令表』，上线时补执行。版本升级的数据结构变更用『版本号 + 懒迁移』：玩家数据存 dataVersion，上线加载时按迁移器链逐级升级，死号零成本；迁移器只前进不回退、幂等、失败兜底。这套机制让『几千万玩家数据迁移』变成『谁登录谁升级』。"
   },
   {
    "t": "pits",
    "items": [
     "把 Redis 当唯一存储——资产要求强可靠，账本必须 MySQL",
     "GM 直接 update 玩家表——会被内存落地覆盖且不一致，必须走业务线程",
     "落地失败就清 dirty 标记——数据悄悄丢，必须保留重试",
     "分片数写死不留逻辑分片——扩容只能整库搬迁",
     "主键用自增 ID——合服时主键冲突直接爆炸"
    ]
   },
   {
    "t": "h",
    "text": "存储容灾、写放大控制与备份体系"
   },
   {
    "t": "p",
    "text": "玩家数据落地不止要防宕机丢内存，还要防 DB 本身出问题。容灾三板：MySQL 主从高可用（半同步复制防切换丢数，漂移 IP/中间件代理对业务透明）、binlog 增量备份 + 定期冷备（全量备份 + 每天 binlog，支持按时间点回档）、分片副本（按 playerId 分片的多副本库，单库故障只影响部分玩家）。写放大控制是性能关键：dirty 集合合并（同一玩家多个模块一次 update 拼成一条 SQL，而非逐模块 update）、批量 upsert（INSERT ... ON DUPLICATE KEY UPDATE，比先查后改少一半往返）、落地限流（DB QPS 预算，超出部分下轮再落）。回档演练要定期做：模拟『玩家误删号』『副本 bug 大面积污染』两种场景，从备份 + binlog 恢复到指定时间点，验证 RPO（数据恢复点）与 RTO（恢复耗时）可接受——平时没演练过，事故当天必翻车。另有一个被忽视的点：资产类流水表与玩家表必须同库同事务或至少同分片，否则流水与资产对不齐时无法判断先写谁。"
   },
   {
    "t": "p",
    "text": "落地失败的细节决定数据安全的下限：写库失败要指数退避重试（1s/5s/30s），连续失败告警 + 保留 dirty 标记，绝不清标记假成功；批量 update 失败按小批次拆分重试，定位单条脏数据。流水与主表的写序固定为『先写流水、后写主表』——若反过来，主表成功而流水失败，对账时无法确认这笔资产是否存在。关服刷盘用两阶段：先落流水与关键资产（玩家收到的每一笔都留痕），再落普通进度；进程收到停服信号后先拒新登录再踢人，刷盘完成才退出，退出码标记『优雅退出』，运维脚本据此判断是否正常。"
   },
   {
    "t": "p",
    "text": "补一个分片落地细节：分片路由规则集中在一个数据访问层（按 playerId 取模选库选表），业务代码不感知分片；扩容时只改路由配置并迁移对应片，业务无感——路由散落在各业务代码里是扩容时的最大阻力。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：玩家数据『内存为准、异步落地』，四道防线（dirty 标记 / 定时批量 / 关键同步写 / 关服刷盘）+ 流水兜底；按 playerId 取模分片 + 全局唯一主键；GM 不碰库；回档优先单玩家、版本迁移用懒迁移。"
   }
  ]
 },
 {
  "id": "game-server-combat",
  "title": "战斗与技能系统：配置驱动、状态机与可回滚修正",
  "layer": 1,
  "depends": [
   "game-server-net-comm"
  ],
  "covers": [
   "game-server-28",
   "game-server-29",
   "game-server-30",
   "game-server-14"
  ],
  "quiz": [
   "game-server-28",
   "game-server-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "战斗系统是 MMORPG 最复杂的子系统：技能 = 配置驱动的状态机 + 效果管线，Buff 的属性修正必须可精确回滚，伤害公式要策划可调、程序可扩展——一套好框架能撑住十年数值迭代。"
   },
   {
    "t": "pre",
    "items": [
     "理解服务器权威与状态同步（见通信模型）",
     "理解战斗服/功能服拆分动机（见架构总览）",
     "知道状态机与事件驱动的基本模式"
    ]
   },
   {
    "t": "h",
    "text": "战斗框架分层：从配置表到事件广播"
   },
   {
    "t": "p",
    "text": "标准分层：配置层（策划表定义技能 = 效果列表 + 条件列表 + 数值参数，效果原子化——伤害/治疗/加 Buff/位移/召唤，策划组合原子效果拼新技能，程序不改代码）→ 规则层（技能状态机：施法检查 → 前摇 → 生效点 → 后摇 → 进 CD，每段可被外部事件打断）→ 执行层（在战斗 tick 内跑效果，产出事件：掉血、上 Buff、位移）→ 同步层（tick 末合并广播给视野内客户端）。战斗逻辑全在战斗服（或功能服内的战斗模块）跑，伤害计算走统一入口，杜绝每个效果各写一套公式。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">技能执行管线：可被打断的分段状态机</text>\n<rect x=\"25\" y=\"55\" width=\"105\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"77\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">施法检查</text>\n<text x=\"77\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CD/蓝耗/目标</text>\n<rect x=\"155\" y=\"55\" width=\"105\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"207\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">前摇/读条</text>\n<text x=\"207\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可被打断</text>\n<rect x=\"285\" y=\"55\" width=\"105\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"337\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">生效点</text>\n<text x=\"337\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">效果逐个执行</text>\n<rect x=\"415\" y=\"55\" width=\"105\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"467\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">后摇收招</text>\n<text x=\"467\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可被取消</text>\n<rect x=\"545\" y=\"55\" width=\"80\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"585\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">进 CD</text>\n<text x=\"585\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">锁技能</text>\n<path d=\"M130 83 L155 83\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g5a)\"/>\n<path d=\"M260 83 L285 83\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g5a)\"/>\n<path d=\"M390 83 L415 83\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g5a)\"/>\n<path d=\"M520 83 L545 83\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g5a)\"/>\n<text x=\"320\" y=\"145\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">打断优先级：强打断（眩晕/沉默/死亡）&gt; 受击打断 &gt; 主动取消，只在生效点前生效</text>\n<rect x=\"25\" y=\"170\" width=\"590\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">效果管线（配置组合，程序零改动）</text>\n<text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">伤害/治疗/加Buff/位移/召唤/触发效果（概率连锁·深度计数）</text>\n<rect x=\"25\" y=\"248\" width=\"590\" height=\"30\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"268\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">输出事件：掉血/上Buff/位移 → tick 末合并广播；重连靠快照+事件补发</text>\n<defs><marker id=\"g5a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 5：技能分段状态机与效果管线"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Buff 属性修正分层：只贴便利贴，不碰原件</text>\n<rect x=\"40\" y=\"50\" width=\"170\" height=\"70\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"125\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">基础值</text>\n<text x=\"125\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">等级/装备（唯一被改的层）</text>\n<rect x=\"235\" y=\"50\" width=\"170\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">加法修正层</text>\n<text x=\"320\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Buff/装备 modifier 登记</text>\n<rect x=\"430\" y=\"50\" width=\"170\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"515\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">乘法修正层</text>\n<text x=\"515\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">增减伤/暴击率修正</text>\n<path d=\"M210 85 L235 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g5c)\"/>\n<path d=\"M405 85 L430 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g5c)\"/>\n<text x=\"222\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">+</text>\n<text x=\"417\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">×</text>\n<rect x=\"40\" y=\"145\" width=\"560\" height=\"44\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"164\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">最终属性 =（基础 + Σ加法）× Π乘法</text>\n<text x=\"320\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">缓存 + 脏标记重算，先加后乘定序</text>\n<rect x=\"40\" y=\"205\" width=\"560\" height=\"64\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"227\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">到期/驱散 = 注销对应 modifier，天然精确回滚</text>\n<text x=\"320\" y=\"247\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不会出现『扣了血上限忘加回来』的经典事故——这是 Buff 系统最高频的坑</text>\n<text x=\"320\" y=\"263\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">永久 Buff（装备被动）不挂时间轮，卸装时注销；限时 Buff 挂时间轮 + 参与快照</text>\n<defs><marker id=\"g5c\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 5b：Buff 属性修正分层"
   },
   {
    "t": "h",
    "text": "Buff 系统：叠加规则配置化、属性修正可回滚"
   },
   {
    "t": "p",
    "text": "Buff 系统的两大难点。第一是叠加规则，全部配置驱动：同 ID 互斥刷新时间 / 叠层（带上限）/ 多来源共存 / 高优先级顶替低优先级；互斥关系用 groupId 表达（同类控制 Buff 只留最强）。第二是属性修正——最容易出事故的地方：绝不直接改基础属性，属性分『基础值 + 加法修正 + 乘法修正』三层，Buff 只往修正层登记/注销 modifier；最终属性 =（基础 + Σ加法）× Π乘法，缓存 + 脏标记重算。Buff 到期/被驱散 = 注销对应 modifier，天然精确回滚，不会出现『扣了血上限忘加回来』的经典事故。特殊形态：护盾（独立数值池）、dot/hot（挂时间轮周期结算）、控制类（状态机标记位，施法检查读取）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 属性分层修正：Buff 只贴便利贴，不碰原件\npublic final class AttrHolder {\n    private final int base;                      // 基础值（等级/装备）\n    private final Map<Attr, Long> addBonus;      // 加法修正层\n    private final Map<Attr, Float> mulBonus;     // 乘法修正层\n    private long cached; private boolean dirty;\n\n    public void addModifier(Attr a, long add, float mul) {\n        addBonus.merge(a, add, Long::sum);\n        mulBonus.merge(a, mul, Float::sum);\n        dirty = true;   // 到期/驱散时反向 merge 回去，即精确回滚\n    }\n    public long finalValue() {\n        if (dirty) { long v = base;\n            for (long b : addBonus.values()) v += b;\n            for (float m : mulBonus.values()) v = (long) (v * m);\n            cached = v; dirty = false;\n        }\n        return cached;\n    }\n}"
   },
   {
    "t": "h",
    "text": "伤害结算与属性公式：进表不进码"
   },
   {
    "t": "p",
    "text": "属性系统 = 枚举化属性 ID + 分层修正 + 单一计算入口：所有属性在配置表定义 ID 和类型，代码用 ID 访问，加新属性不动框架。伤害公式由策划表配置（公式类型 + 参数），服务器统一 DamageCalculator 按类型分发。三种主流公式：减法（攻-防，直观但怕不破防）、除法（攻/防比）、乘法减免（减伤% = 防/(防+K)，边际递减，大后期不崩）——中大型游戏偏好乘法减免。实战要点：公式计算用整型/定点数防浮点误差（跨端一致性），每次伤害产出明细战斗日志（各修正项逐项列出），玩家投诉伤害不对时能对账。"
   },
   {
    "t": "h",
    "text": "战斗同步与防作弊校验"
   },
   {
    "t": "p",
    "text": "战斗同步：tick 末合并广播（同目标伤害批量结算、技能事件合并打包），重连玩家拉战斗快照 + 补发事件恢复表现；掉线保尸期间 dot 继续结算。防作弊三层：协议层（序列号防重放、参数合法性校验）、逻辑层（速度校验——按位移/时间算速率，超上限 × 容差则纠偏 + 累计违规；频率校验——技能/普攻最短间隔，令牌桶节流；收益校验——单位时间产出超理论上限告警）、数据层（道具产出消耗全量流水进 Kafka，离线对账发现异常产出）。处置梯度：纠偏 → 标记观察 → 踢线 → 封号，全程证据日志避免误杀弱网玩家。"
   },
   {
    "t": "table",
    "head": [
     "模块",
     "设计要点",
     "常见事故"
    ],
    "rows": [
     [
      "技能执行",
      "配置驱动状态机，效果原子化",
      "硬编码技能，策划改需求要发版"
     ],
     [
      "Buff 修正",
      "modifier 分层登记，到期注销",
      "直接改基础属性导致无法回滚"
     ],
     [
      "伤害公式",
      "公式进表、统一计算器、定点数",
      "浮点误差导致跨端不一致"
     ],
     [
      "战斗同步",
      "tick 末合并广播、快照+补发",
      "逐条广播打爆带宽"
     ],
     [
      "防作弊",
      "速度/频率/收益三层校验",
      "只防协议不防逻辑，外挂零成本"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "把技能逻辑硬编码当成正常做法——配置驱动 + 效果原子化才是框架",
     "属性修正直接改基础值——必须分层 + modifier 注销回滚",
     "伤害公式写死代码——策划调数值必须走配置",
     "战斗同步逐条实时广播——必须 tick 末合并 + 增量",
     "忽略战斗服与功能服的资产单写——战斗服只产结果事件，发奖回功能服"
    ]
   },
   {
    "t": "h",
    "text": "战斗日志与录像回放"
   },
   {
    "t": "p",
    "text": "战斗系统的长期资产是战斗日志：每场战斗产出结构化事件流（施法、命中、伤害明细、Buff 增删），进 Kafka 落日志库。三大用途：客诉对账（玩家说伤害不对，按日志逐条还原）；外挂追查（伤害/频率异常的根源证据）；回放系统（录像 = 初始快照 + 事件流，重放即还原战斗，观战与赛事回放共用）。日志采样策略：常态只落结果事件（伤害汇总），明细日志按需开启（客诉单、赛事、嫌疑账号采样），避免全量明细把日志库打爆。战斗服与功能服的结算一致性也依赖日志：战斗服产出结果事件 → 功能服按事件结算发奖 → 日志留痕，三方对得上才叫闭环。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：战斗系统 = 配置驱动的技能状态机 + 可回滚的 Buff 修正 + 公式进表的伤害结算 + tick 末合并广播 + 速度/频率/收益三层防作弊；资产单写原则贯穿战斗服与功能服的每一次交互。"
   }
  ]
 },
 {
  "id": "game-server-scene-aoi",
  "title": "场景管理与 AOI：让百人同屏不爆带宽",
  "layer": 1,
  "depends": [
   "game-server-net-comm"
  ],
  "covers": [
   "game-server-20",
   "game-server-26",
   "game-server-27"
  ],
  "quiz": [
   "game-server-26",
   "game-server-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "AOI（Area of Interest）是 MMORPG 场景层的命门：用空间索引把 O(N²) 的全图可见性判断降到 O(k)，百人同屏的带宽才扛得住——九宫格、灯塔、十字链表是三种主流实现。"
   },
   {
    "t": "pre",
    "items": [
     "理解状态同步与广播放大（见通信模型）",
     "理解玩家会话与实体概念",
     "对带宽估算有数量级概念"
    ]
   },
   {
    "t": "h",
    "text": "场景与实体管理：场景服持有世界状态"
   },
   {
    "t": "p",
    "text": "MMORPG 中每个场景（地图）由一个场景服进程（或功能服内的场景模块）长期持有世界状态：地图上的玩家、怪物、NPC、掉落物都是实体（Entity），每个实体有位置、视野、观察者列表。玩家进入场景 = 实体创建 + 加入空间索引；离开 = 从空间索引移除 + 广播消失。实体生命周期必须与玩家会话绑定（下线即摘除防泄漏），观察者列表只存实体 ID 不缓存对象引用。场景分线（同地图开多线）是扩容手段：每条线独立进程，玩家跨线 = 场景迁移，路由层切换。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">九宫格 AOI：视野 = 中心格 + 周围 8 格</text>\n<g stroke=\"var(--line)\" stroke-width=\"1.5\">\n<line x1=\"90\" y1=\"200\" x2=\"550\" y2=\"200\"/><line x1=\"90\" y1=\"260\" x2=\"550\" y2=\"260\"/>\n<line x1=\"150\" y1=\"60\" x2=\"150\" y2=\"310\"/><line x1=\"230\" y1=\"60\" x2=\"230\" y2=\"310\"/><line x1=\"310\" y1=\"60\" x2=\"310\" y2=\"310\"/><line x1=\"390\" y1=\"60\" x2=\"390\" y2=\"310\"/><line x1=\"470\" y1=\"60\" x2=\"470\" y2=\"310\"/><line x1=\"550\" y1=\"60\" x2=\"550\" y2=\"310\"/>\n<line x1=\"90\" y1=\"140\" x2=\"550\" y2=\"140\"/><line x1=\"90\" y1=\"80\" x2=\"550\" y2=\"80\"/>\n</g>\n<rect x=\"230\" y=\"140\" width=\"80\" height=\"60\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<circle cx=\"270\" cy=\"170\" r=\"6\" fill=\"var(--accent)\"/>\n<text x=\"270\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\" font-weight=\"bold\">玩家A</text>\n<g fill=\"var(--lv2)\">\n<circle cx=\"190\" cy=\"110\" r=\"5\"/><circle cx=\"350\" cy=\"110\" r=\"5\"/><circle cx=\"430\" cy=\"110\" r=\"5\"/><circle cx=\"510\" cy=\"110\" r=\"5\"/>\n<circle cx=\"190\" cy=\"170\" r=\"5\"/><circle cx=\"510\" cy=\"170\" r=\"5\"/>\n<circle cx=\"190\" cy=\"230\" r=\"5\"/><circle cx=\"350\" cy=\"230\" r=\"5\"/><circle cx=\"510\" cy=\"230\" r=\"5\"/>\n</g>\n<text x=\"510\" y=\"110\" text-anchor=\"middle\" font-size=\"11\" fill=\"var(--muted)\">视野内实体</text>\n<text x=\"450\" y=\"300\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">格子差集：进入新格触发 enter，离开旧格触发 leave，tick 末合并推送</text>\n<rect x=\"30\" y=\"60\" width=\"40\" height=\"18\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"50\" y=\"73\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">格长≈视野半径</text>\n<defs><marker id=\"g6a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 6：九宫格 AOI 视野模型"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">视野同步优化四板斧：裁剪 / 增量 / 合并 / 降频</text>\n<rect x=\"30\" y=\"55\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"100\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① AOI 裁剪</text>\n<text x=\"100\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">看不见的别发</text>\n<text x=\"100\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">广播从全图缩到视野内</text>\n<rect x=\"180\" y=\"55\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"250\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 增量同步</text>\n<text x=\"250\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">没变的别发</text>\n<text x=\"250\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只发变化字段+插值预测</text>\n<rect x=\"330\" y=\"55\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"400\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 合并打包</text>\n<text x=\"400\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">攒一起发</text>\n<text x=\"400\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">tick 末合并单包</text>\n<rect x=\"480\" y=\"55\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"550\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 分级降频</text>\n<text x=\"550\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">远的慢点发</text>\n<text x=\"550\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">近 10Hz / 远 1Hz</text>\n<rect x=\"30\" y=\"160\" width=\"590\" height=\"48\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"182\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">移动同步：客户端预测 + 服务器 5~10Hz 低频校正</text>\n<text x=\"320\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">带宽估算：单包 50B × 视野 50 人 × 10Hz ≈ 25KB/s/玩家</text>\n<rect x=\"30\" y=\"222\" width=\"590\" height=\"48\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">国战 500 人同屏 AOI 裁不掉 → 极限降频 + 合并快照包 + 客户端 LOD 降级 + UDP/KCP</text>\n<text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">纠偏平滑：小偏差收敛、大偏差直接拉，避免『拉扯』观感</text>\n</svg>",
    "caption": "图 6b：视野同步优化四板斧"
   },
   {
    "t": "h",
    "text": "AOI 的本质与三种实现"
   },
   {
    "t": "p",
    "text": "AOI 的本质是用空间索引做范围查询 + 进出事件：给定观察者和视野范围，高效找出需要同步的实体，并在实体进出视野时触发 appear/disappear 事件。三种主流实现：① 九宫格——地图划固定格，玩家视野 = 中心格 + 周围 8 格（或按视野半径外扩），移动跨格时新旧格子集合差集触发 enter/leave，插入删除 O(1)，实现简单、适合实体均匀分布，缺点是热点格子（主城）成为瓶颈、格子边界频繁抖动（加缓冲带/滞后切换缓解）；② 灯塔——格子放大到 L ≥ 2R（R 为视野半径），视野圆最多跨越 0.5 个塔，只查 4 个塔而非 9 格，查询路径更短；③ 十字链表——实体按 x、y 坐标分别挂在两条有序双向链表，移动时与邻居局部交换，视野查询沿链表向两侧扩展，省内存、适合稀疏地图，但实现复杂、移动更新成本高（高密度区域链表频繁增删）。"
   },
   {
    "t": "h",
    "text": "视野同步优化：看不见的别发、没变的别发、攒一起发、远的慢发"
   },
   {
    "t": "p",
    "text": "AOI 裁剪只是第一招，完整组合拳：增量同步——只发变化的字段（位置变了发位置，血量没变不发），移动用『坐标 + 方向 + 速度』让客户端插值预测，服务器低频校正（5~10Hz 而非每帧）；合并打包——同一 tick 内发给同一玩家的多条消息合并成一个包，减少包头和系统调用开销；分级降频——视野内按距离分级，远处实体 1Hz、近处 10Hz；协议层——二进制 + 字段压缩，必要时 UDP/可靠 UDP（KCP）降低移动同步延迟。国战 500 人同屏 AOI 裁不掉时，只能极限降频 + 合并快照包 + 客户端 LOD 降级。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 九宫格 AOI 核心：移动跨格时的视野差集（示意）\npublic class GridAOI {\n    Map<Long, GridCoord> pos = new HashMap<>(); // 实体ID -> 格子坐标\n    // 移动后：旧 9 宫格集合 vs 新 9 宫格集合，差集即 enter/leave\n    void onMove(long id, int newGx, int newGy) {\n        GridCoord old = pos.get(id);\n        Set<GridCoord> oldSet = neighbors(old.gx, old.gy); // 旧视野格子\n        Set<GridCoord> newSet = neighbors(newGx, newGy);   // 新视野格子\n        for (GridCoord g : oldSet)\n            if (!newSet.contains(g)) fireLeave(id, g); // 只剩旧的=离开\n        for (GridCoord g : newSet)\n            if (!oldSet.contains(g)) fireEnter(id, g); // 只有新的=进入\n        pos.put(id, new GridCoord(newGx, newGy));\n        // 进出事件不逐条推送，tick 末对每个观察者批量合并\n    }\n    Set<GridCoord> neighbors(int gx, int gy) { /* 以(gx,gy)为中心的 3x3 格子集合 */ }\n}"
   },
   {
    "t": "h",
    "text": "寻路与移动校验：服务器不当导航仪，只当边线裁判"
   },
   {
    "t": "p",
    "text": "寻路分工：客户端负责点击寻路的即时表现，服务器负责怪物 AI 寻路与玩家移动合法性校验，双端用同一份地图数据的不同精度版本。A* 适合中小地图和怪物 AI（分层寻路、路径缓存、JPS 跳点剪枝优化）；NavMesh 把可行走区域切成凸多边形网格 + 漏斗算法拉直路径，适合 3D 大世界。服务器移动校验三件套：速度校验（位移/时间 > 速度上限 × 容差判非法）、穿墙校验（粗粒度阻挡格做射线/可达性检查）、处置梯度（先纠偏拉回 → 累计违规超阈值再踢线/封号，弱网抖动不误杀）。服务器不重跑完整寻路，只做粗校验，开销可控——这是反外挂与性能的成本权衡。"
   },
   {
    "t": "pits",
    "items": [
     "只答 AOI 一招不讲组合拳——增量/合并/降频/协议压缩才是完整方案",
     "格子大小乱定——以视野半径为基准，太大裁剪失效、太小进出事件风暴",
     "说服务器全量寻路——量级扛不住，服务器只做粗校验",
     "观察者列表存实体对象引用——下线泄漏重灾区，只存实体 ID",
     "跨格进出事件不做缓冲带——边界来回抖动会刷爆事件队列"
    ]
   },
   {
    "t": "h",
    "text": "场景分线与跨线迁移：扩容与热度治理"
   },
   {
    "t": "p",
    "text": "同一张地图玩家过多时用分线（频道）拆散：每条线独立进程（或独立 AOI 实例），玩家进线时选择容量低的一条；分线数按热度规划（主城高峰 3~5 条，野外 1~2 条），热度回落自动合并空线（空线不再进人，存量玩家迁移到相邻线后销毁）。跨线迁移 = 场景内的玩家会话迁移：打包位置/属性/视野状态 → 目标线加载 → 路由切换 → 客户端拉取新线快照，玩家感知是『切换分线』的明确操作而非黑盒。场景实体管理还有一个常被忽略的点：怪物/NPC 是场景常住实体，随场景加载而生、场景卸载而灭，它们的 AI 调度要分帧执行（每 tick 只跑 N 个怪物的 AI），配合视野外怪物降频（1Hz）甚至休眠，几千只怪也不会拖垮单 tick。瞬移/传送/上下马这类特殊移动不走逐步校验，直接全量重算视野（新旧格子集合差集一次算清），保证 enter/leave 事件不丢不重。"
   },
   {
    "t": "p",
    "text": "AOI 事件与广播协议要配套设计：实体首次 appear 时下发完整初始状态（位置、朝向、属性、Buff 摘要），之后只发增量事件；增量事件按实体分组合并（同一实体移动 + 状态变化合成一条），避免同一实体拆多条消息；瞬移/传送全量重算视野后发完整快照。广播对象用观察者模式解耦：AOI 只产出『视野变更事件』，同步层负责翻译成协议包并投递给对应玩家线程，两层的边界是『空间层不管带宽、同步层不管空间』——职责清晰才能各自优化。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：场景层 = 实体管理 + 空间索引（九宫格/灯塔/十字链表）+ 视野同步四板斧（AOI 裁剪/增量/合并/分级降频）+ 寻路分工（客户端表现、服务器粗校验）。AOI 的本质是把 O(N²) 可见性判断降到 O(k)。"
   }
  ]
 },
 {
  "id": "game-server-rank-match",
  "title": "排行榜与匹配：ZSet、ELO 与天梯体系",
  "layer": 2,
  "depends": [
   "game-server-player-data"
  ],
  "covers": [
   "game-server-08",
   "game-server-36"
  ],
  "quiz": [
   "game-server-08"
  ],
  "body": [
   {
    "t": "lead",
    "text": "排行榜与匹配是竞技类玩法的发动机：ZSet 让千万级玩家毫秒出榜，ELO/MMR 让匹配既有对抗性又不失衡——两者共同支撑天梯、赛事与跨服竞技。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Redis 与玩家数据存储（见数据存储节点）",
     "理解房间制与大厅/匹配分层（见架构总览）",
     "对概率与统计有基本直觉"
    ]
   },
   {
    "t": "h",
    "text": "实时排行 vs 定时排行：两种出榜模式"
   },
   {
    "t": "p",
    "text": "实时排行：玩家战力/等级变化即更新排行榜，用 Redis ZSet 实现——ZADD 更新、ZREVRANGE 取前 N，毫秒级出榜，适合战力榜、等级榜这类高频变化且全服关心的榜单；代价是写入放大（每人每变一次就一次 Redis 写）。定时排行：每天/每周结算一次，榜单从 DB 批量重算写入快照表，玩家看到的是一次结算结果，适合活动榜、赛季榜这类低频榜单；实现简单、压力可控。选型原则：榜单变化频率 × 玩家关心程度决定实时性——PVP 天梯必须实时，活动冲榜结算可以定时。全服排行数据放 Redis 集群共享，各服读写走缓存 + 异步持久化，避免单点。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// ZSet 排行榜：同分排序的编码技巧\nString encodeScore(int power, long reachTime) {\n    // 高分在前，先达到者靠前：战力占高位，时间戳取反占低位\n    return String.format(\"%08d%013d\", power, Long.MAX_VALUE - reachTime);\n}\n// 上榜/更新\nredis.zadd(\"rank:power\", encodeScore(power, now), String.valueOf(playerId));\n// 取前 100\nList<Long> top = redis.zrevrangeByScore(\"rank:power\", \"+inf\", \"-inf\", 0, 100);\n// 千万级 member 的 ZSet 约几百 MB ~ 1GB+，按 member 长度与分数宽度估算\n// 注意：同分时 ZSet 按 member 字典序排序，必须用上述编码把时间戳塞进分数"
   },
   {
    "t": "h",
    "text": "ELO 与 MMR：匹配系统的数学内核"
   },
   {
    "t": "p",
    "text": "ELO（阿帕德·埃洛，1960 年代为国际象棋设计）公式：期望得分 E = 1 / (1 + 10^((Rb - Ra) / 400))，赛后新分 = 旧分 + K × (实际得分 - 期望得分)，实际得分胜 1 / 平 0.5 / 负 0。400 分差约 91% 胜率；K 因子控制波动幅度——新玩家 K=40 快速收敛、普通玩家 K=20~32、顶级玩家 K=10 保稳定。ELO 的现代升级是 Glicko（加入评分波动 RD，久不参赛分数变得不确定）和 TrueSkill（支持多人/组队）。MMORPG 天梯常用 ELO 变体 + 段位映射：隐藏 MMR 决定匹配池，显示段位由 MMR 区间映射，保护星/晋级赛由产品配置。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">匹配系统闭环：撮合、开局、结算、MMR 更新</text>\n<rect x=\"25\" y=\"55\" width=\"130\" height=\"60\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"90\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">匹配池</text>\n<text x=\"90\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MMR 分桶 + 等待扩容</text>\n<rect x=\"185\" y=\"55\" width=\"130\" height=\"60\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"250\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">撮合分发</text>\n<text x=\"250\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分配房间实例</text>\n<rect x=\"345\" y=\"55\" width=\"130\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"410\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">房间战斗</text>\n<text x=\"410\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">帧/状态同步，打完即毁</text>\n<rect x=\"505\" y=\"55\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"560\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">结算更新</text>\n<text x=\"560\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ELO 公式更新</text>\n<path d=\"M155 85 L185 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g7a)\"/>\n<path d=\"M315 85 L345 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g7a)\"/>\n<path d=\"M475 85 L505 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g7a)\"/>\n<path d=\"M560 115 L560 170 L90 170 L90 115\" stroke=\"var(--lv2)\" stroke-width=\"2\" stroke-dasharray=\"5 4\" fill=\"none\" marker-end=\"url(#g7b)\"/>\n<text x=\"320\" y=\"205\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">E = 1 / (1 + 10^((Rb - Ra) / 400))  新分 = 旧分 + K × (实际 - 期望)</text>\n<text x=\"320\" y=\"230\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分差随时间放宽：等待越久，允许的 MMR 跨度越大，保证秒排且不失衡</text>\n<defs><marker id=\"g7a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker><marker id=\"g7b\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv2)\"/></marker></defs>\n</svg>",
    "caption": "图 7：匹配闭环与 ELO 更新"
   },
   {
    "t": "h",
    "text": "匹配的工程细节：等待动态放宽与防失衡"
   },
   {
    "t": "p",
    "text": "纯按 MMR 精确匹配会导致秒排失败、长尾玩家永远排不到。标准解法是等待时间动态放宽：分差随排队时间线性增长（等 5 秒允许 ±100，等 30 秒允许 ±400），保证活跃度与公平性的平衡。其他工程细节：同队玩家取平均 MMR 但加权（高分段权重高，防带小号刷分）；段位保护（连败保星、晋级赛）、秒退惩罚队列（进队列后退出拉黑 X 分钟）；跨服匹配 = 匹配服集中所有源的池子统一撮合，队列放 Redis、多个匹配 worker 按模式/段位分片消费，匹配逻辑无状态可水平扩展。"
   },
   {
    "t": "h",
    "text": "天梯与赛事：显示层与匹配层的解耦"
   },
   {
    "t": "p",
    "text": "天梯设计要点：隐藏 MMR（防玩家试错卡段）与显示段位（激励）解耦——段位只是 MMR 区间映射 + 每赛季重置规则；赛季结算按最终 MMR 发放段位奖励，排行榜按段位 + 分数排序。赛事是活动型玩法：报名 → 分组 → 淘汰赛/积分赛，赛程由活动系统驱动，战斗复用跨服战场实例；赛事奖励结算必须幂等（按对局结果回源服发奖，防重复领取）。"
   },
   {
    "t": "table",
    "head": [
     "场景",
     "榜单/匹配方案",
     "关键参数"
    ],
    "rows": [
     [
      "战力榜/等级榜",
      "Redis ZSet 实时榜",
      "分数编码塞时间戳解同分"
     ],
     [
      "活动冲榜",
      "定时结算写快照表",
      "每日/每周批量重算"
     ],
     [
      "天梯 PVP",
      "ELO/MMR 隐藏分 + 段位映射",
      "K=40 新玩家 / 20~32 普通 / 10 顶级"
     ],
     [
      "跨服竞技",
      "跨服匹配池 + 中心服撮合",
      "分差随等待动态放宽"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "排行榜全量 DB order by——千万玩家必然打爆，必须 ZSet 或快照",
     "同分排序不处理——ZSet 按字典序，必须编码分数塞时间戳",
     "K 值恒定不区分新手老手——新手要快速收敛必须大 K",
     "匹配不动态放宽分差——长尾玩家永远排不到直接流失",
     "赛事奖励不幂等——结算重复发奖是资损事故"
    ]
   },
   {
    "t": "h",
    "text": "赛季重置、榜单快照与匹配质量指标"
   },
   {
    "t": "p",
    "text": "天梯赛季的核心机制：赛季结束按最终 MMR 结算发奖 → 新赛季段位衰减（高分段跌一个段位，低分段保底不跌）→ 段位/MMR 分开存储（段位重置、MMR 软重置后重新校准）。赛季结算必须幂等（结算任务可重跑，按赛季 + 玩家唯一键），且结算结果快照落库——赛季期间的实时榜用 ZSet，历史榜单走快照表（玩家在任何时候查历史赛季都能看到当时名次，这是客诉重灾区，不做快照就查不到了）。榜单的缓存策略：ZSet 常驻 Redis 的只有热榜（Top 100 用本地缓存 + 30 秒过期），千万级全量榜单做分桶——按 MMR 区间分桶存桶内排名，查询先定位桶再定位名次，避免 ZSet 全量扫描。匹配质量指标要量化：平均等待时间（P50/P90）、MMR 差分布（中位数 < 100 视为健康）、匹配成功率——三个指标构成匹配系统的监控大盘，任何改动（放宽分差、改 K 值）后对比这三个指标验证是否恶化。段位保护细节：连败保护星、晋级赛（连胜触发、三局两胜）、掉段保护（刚升级后输 3 局不掉）都由配置驱动，避免改规则发版。"
   },
   {
    "t": "p",
    "text": "匹配系统的防刷与体验细节：代打识别（常用设备/IP 变化 + 段位跳跃检测，异常标记人工复核）、秒退惩罚（中途退出拉黑队列 X 分钟，累犯加重）、掉线保护（网络波动不算秒退，判负但不禁赛）。匹配池的分片策略：按模式（单排/组排）和段位区间分队列，避免大池子相互干扰；同段位池子排不到人时向上下区间扩散，扩散顺序和步长由配置控制。匹配是运营敏感系统，所有规则（K 值、放宽曲线、保护星）配置化，改动走灰度对比指标，绝不在代码里拍脑袋改。"
   },
   {
    "t": "p",
    "text": "补一个榜单展示细节：同分并列的展示规则（并列名次或按到达时间严格排序）由策划配置决定，程序只实现两种模式不硬编码——这是数值策划与程序最容易扯皮的边界。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：榜单选型 = 实时 ZSet vs 定时快照；匹配内核 = ELO（E=1/(1+10^(ΔR/400))，新分=旧分+K×(实际-期望)），工程上等待动态放宽 + 显示段位与隐藏 MMR 解耦；跨服竞技靠无状态匹配池 + 中心服撮合。"
   }
  ]
 },
 {
  "id": "game-server-activity-config",
  "title": "活动与配置系统：热更、定时与峰值预案",
  "layer": 2,
  "depends": [
   "game-server-arch-overview"
  ],
  "covers": [
   "game-server-10",
   "game-server-19",
   "game-server-13",
   "game-server-33"
  ],
  "quiz": [
   "game-server-19",
   "game-server-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "运营活动是游戏的生命力，也是服务器的定时炸弹：配置化活动框架 + 海量定时任务的工程解法 + 配置热更能力，三者合起来才敢在黄金周开全服活动。"
   },
   {
    "t": "pre",
    "items": [
     "理解导表工具与配置加载（见架构总览的 GM 指令）",
     "理解服务器时间权威（见会话管理）",
     "知道时间轮、懒计算的概念"
    ]
   },
   {
    "t": "h",
    "text": "活动框架：配置驱动 + 状态机 + 活动容器"
   },
   {
    "t": "p",
    "text": "活动框架的核心是『策划可配、程序零改动』：活动 = 配置表（开始/结束时间、开启条件、奖励表、规则参数）+ 活动容器（管理活动实例的生命周期、状态机：未开启 → 开启 → 进行中 → 结算 → 关闭）。所有活动判定用服务器时间做『时间比较』得出状态，而非靠定时器翻转标志位——这样服务器重启/维护后活动状态天然正确（幂等）。活动开启瞬间的全服推送由定时器负责『及时性』，状态比较负责『正确性』，两者解耦：推送失败无所谓，玩家任何操作读状态时自然看到活动已开。"
   },
   {
    "t": "h",
    "text": "海量定时任务：时间轮、懒计算、可恢复"
   },
   {
    "t": "p",
    "text": "游戏里有大量定时逻辑（技能 CD、Buff 到期、体力恢复、活动开启），铁律是绝不为每个任务开一个 ScheduledFuture。三种手段：① 时间轮（HashedWheelTimer 思路）——环形槽位按时间分桶，到期批量触发，插入删除 O(1)，百万级定时器无压力，技能 CD、Buff 到期都挂上面；② 懒计算——体力恢复、建筑倒计时这类『纯时间函数』不挂定时器，存起始时间和速率，读取时现算（省内存省调度），停服维护跨过 0 点也不丢结算；③ 持久化恢复——关键定时器（限时活动）的到期时间落库或用配置驱动，启动时重建。全服级时间点用统一调度器（Quartz/自研 cron），触发后投递到玩家所属业务线程执行，保持单线程模型。百万 Buff 同时到期时，到期回调只做投递（分发到各玩家业务线程分 tick 消化），不做重计算。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">活动与配置系统：四层架构</text>\n<rect x=\"40\" y=\"45\" width=\"560\" height=\"42\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">配置层</text>\n<text x=\"320\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Excel → 导表工具校验 → 二进制/强类型实体（错误前置到发布前）</text>\n<rect x=\"40\" y=\"97\" width=\"560\" height=\"42\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"114\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">活动容器</text>\n<text x=\"320\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">活动状态机 + 时间比较定状态（重启幂等）+ 定时器只管及时性</text>\n<rect x=\"40\" y=\"149\" width=\"560\" height=\"42\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">定时引擎</text>\n<text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">时间轮（CD/Buff）+ 懒计算（体力恢复）+ 持久化恢复（限时活动）</text>\n<rect x=\"40\" y=\"201\" width=\"560\" height=\"42\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"218\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">发奖层</text>\n<text x=\"320\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">邮件表懒处理（全服百万玩家零压力）+ 防刷按真实在线记录圈人</text>\n</svg>",
    "caption": "图 8：活动与配置系统的四层架构"
   },
   {
    "t": "h",
    "text": "配置热更：三种方案与一个关键取舍"
   },
   {
    "t": "p",
    "text": "配置热更的目标是『线上改数值/公式不停服』。三种主流方案：① 脚本层（Lua/Groovy）——热点逻辑用脚本写，热更 = 替换脚本文件，最安全彻底，但前期架构成本高；② 自定义 ClassLoader——可热更类隔离到独立模块，新 ClassLoader 加载新 class 替换入口引用，坑是旧实例和新类不兼容（instanceof 失效）、类引用不清 Metaspace 泄漏；③ Java Agent（redefine/retransform）——运行时改写已有类字节码，只能改方法体，不能增删字段/方法/改签名。通用铁律：热更只改逻辑不改内存数据，新旧逻辑对同一份状态的理解必须兼容；热更要选低峰 + 灰度（先一台服），出问题能回滚。实战组合：策划配置走配置中心热推；公式/活动脚本走 Lua/Groovy；Java 逻辑热更走 ClassLoader；紧急 bug 走 Agent 兜底；大版本进程重启 + 网关切流。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 配置热更的可替换 Holder：GM 触发重载，业务无感知\npublic final class ConfigHolder<T> {\n    private volatile T data; // 新配置先校验合法，再原子替换引用\n    public T get() { return data; }\n    public boolean reload(byte[] newBin) {\n        T parsed = loader.parseAndValidate(newBin); // 校验失败拒绝替换\n        if (parsed == null) return false;\n        this.data = parsed; // 单次 volatile 写，读者无感知切换\n        return true;\n    }\n}\n// 全服发奖：不逐玩家操作，邮件表懒处理\nvoid sendMailAll(int mailId) {\n    db.insert(\"INSERT INTO mail_all (mail_id,title,content,attach) VALUES (?,...)\");\n    redis.set(\"mail:latest:\" + mailId, now()); // 玩家上线拉取 + 领取\n}"
   },
   {
    "t": "h",
    "text": "运营配置与奖励发放：防刷与幂等"
   },
   {
    "t": "p",
    "text": "活动奖励发放的工程要点：全服奖励绝不逐个激活玩家——生成一条全服邮件记录，玩家上线时拉取并领取（懒处理），百万玩家零压力；定向补偿按『事故时间窗内真实在线/登录记录』圈人，按真实历史行为过滤工作室小号；奖励发放必须幂等（唯一请求 ID/订单号，防重复领取）；发放走 GM 指令通道进玩家业务线程，与普通协议同队列执行，不直连库。"
   },
   {
    "t": "h",
    "text": "活动峰值预案"
   },
   {
    "t": "p",
    "text": "开服/活动整点是全服架构的极限测试：登录洪峰（压 DB 加载与会话创建）、全服广播（活动开启瞬间推送风暴）、海量结算（百万 Buff 同时到期）。预案分层：前置——预加载活动配置、Redis 缓存预热、登录限流降级；峰值——非核心功能降级（关排行榜刷新、合并广播、限制发言频率）；事后——监控在线数/队列水位/DB QPS 曲线，压测回放验证。核心原则：峰值流量必须被『削峰』（异步化、懒处理、降级），而不是硬扛。"
   },
   {
    "t": "pits",
    "items": [
     "活动状态用定时器翻转标志位——维护跨过 0 点活动状态全乱",
     "体力恢复挂定时器——必须懒计算，存起始时间读取现算",
     "配置热更不做灰度回滚——线上出 bug 无法秒级回退",
     "全服发奖逐玩家激活——百万玩家直接打爆服务器，必须邮件懒处理",
     "热更改内存数据结构——新旧逻辑状态不兼容，现场雪崩"
    ]
   },
   {
    "t": "h",
    "text": "导表工具工程细节：从 Excel 到线上热推"
   },
   {
    "t": "p",
    "text": "配置系统能跑得稳，功夫在导表工具的工程化：① 表头规范约定（字段名行、类型行、主键行、注释行、客户端/服务器可见性标记），策划按模板填，工具按规范解析，模板版本变更要兼容旧表；② 校验前置——类型检查、主键唯一、引用完整性（道具表引用的怪物 ID 必须存在）、枚举合法性、数值范围，策划保存后本地跑工具当场报文件 + 行号，错误进不了版本库；③ 双端产物——二进制/JSON 给服务器（运行时反序列化为 Map&lt;id, 实体&gt;），客户端用同工具链生成 C#/Lua，双端字段集合严格对齐（服务器可见性标记决定字段下不下发）；④ 版本 diff——配置包带版本号与增量补丁，客户端弱更只拉变更表，服务器启动时校验配置版本与代码版本匹配（不匹配拒绝启动，防新旧配置错位）；⑤ 线上热推——新配置先校验合法再原子替换 Holder 引用，业务读取无感知；热推要灰度（先一台服验证，出问题回退旧版本），配置变更留审计日志（谁、何时、改了哪张表），这是排查『数值被谁改坏了』的关键。配置与代码的边界铁律：能配置的绝不写代码——活动数值、技能效果、掉落表全部走配置，代码只维护『计算器』与『管线』。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：活动框架 = 配置驱动 + 时间比较定状态 + 容器管理生命周期；海量定时用时间轮/懒计算/持久化恢复三件套；配置热更按变更粒度分层（配置中心/Lua脚本/ClassLoader/Agent/进程重启）；全服发奖邮件懒处理 + 幂等 + 防刷；峰值靠削峰与降级而非硬扛。"
   }
  ]
 },
 {
  "id": "game-server-social",
  "title": "社交系统：聊天、邮件、好友、公会与组队",
  "layer": 2,
  "depends": [
   "game-server-session",
   "game-server-player-data"
  ],
  "covers": [
   "game-server-34",
   "game-server-09"
  ],
  "quiz": [
   "game-server-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "社交是留存的核心，也是架构上的『放大镜』：一条世界聊天会被全服玩家放大，一封全服邮件要发给百万玩家，一个离线玩家的好友关系怎么改——社交系统的每个细节都在考验你处理『量』与『离线』的能力。"
   },
   {
    "t": "pre",
    "items": [
     "理解会话状态机与掉线保尸（见会话管理）",
     "理解内存为准的玩家数据模型（见数据存储）",
     "知道 Redis 与 Kafka 的定位"
    ]
   },
   {
    "t": "h",
    "text": "聊天系统：频道、推送与限流"
   },
   {
    "t": "p",
    "text": "聊天按频道划分：世界/区域/队伍/私聊/公会，各频道隔离广播范围。实现要点：消息先过敏感词过滤（前置到客户端和源服，减少中心压力）→ 按频道投递到目标玩家 → 限流（发言频率、刷屏检测，令牌桶节流）。全服世界频道是带宽与 CPU 放大点：一条消息 × 在线人数 = 推送量，所以高频频道做聚合（批量转发）、设置发言 CD、收费喇叭道具天然限流。跨服聊天 = 中心聊天服集群 + 按频道分片，各服本地先限流，消息聚合批量转发。聊天记录异步落库（Kafka → 日志服），离线期间的消息进离线信箱。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">社交系统全景：消息推送、离线信箱与懒处理</text>\n<rect x=\"25\" y=\"50\" width=\"150\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"100\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">聊天频道</text>\n<text x=\"100\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">世界/队伍/私聊/公会</text>\n<rect x=\"215\" y=\"50\" width=\"150\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"290\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">邮件系统</text>\n<text x=\"290\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">离线信箱 + 全服懒处理</text>\n<rect x=\"405\" y=\"50\" width=\"150\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"480\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">好友/公会/组队</text>\n<text x=\"480\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">关系表 + 离线影子加载</text>\n<path d=\"M175 78 L215 78\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#g9a)\"/>\n<path d=\"M365 78 L405 78\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g9a)\"/>\n<rect x=\"25\" y=\"130\" width=\"590\" height=\"80\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">核心原则：量大的走懒处理，离线的不激活本体</text>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全服邮件 = 写一条记录，玩家上线拉取领取（百万玩家零压力）</text>\n<text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">操作离线玩家 = 只读查库 / 写入走邮件 / 必须改本体才影子加载（LRU + 用完即还）</text>\n<rect x=\"25\" y=\"230\" width=\"590\" height=\"50\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">上线冲突：先查在线表再查离线影子缓存，加玩家级锁，保证任一时刻单权威副本</text>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">级联清理：删除角色时同步解除好友/公会/婚姻关系，防脏数据</text>\n<defs><marker id=\"g9a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 9：社交系统的量级处理原则"
   },
   {
    "t": "h",
    "text": "邮件系统：离线消息、全服邮件与附件"
   },
   {
    "t": "p",
    "text": "邮件是游戏服『写给离线玩家的信』，核心设计是懒处理：写邮件 ≠ 激活玩家。个人邮件（好友留言、系统通知）直接插目标玩家的邮件表，玩家上线自提；全服邮件（补偿、活动奖励）写一条全服记录 + Redis 标记，玩家上线拉取并领取。邮件附件（道具）是资产，领取时走玩家业务线程发奖、落流水、幂等（同一封邮件领一次）。邮件过期清理（30 天未领自动回收或转入仓库），防邮件表无限膨胀。邮件到达通知用 Redis 在线标记：玩家在线时推送红点，离线玩家上线后补拉。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 全服邮件：懒处理，百万玩家零压力（示意）\npublic class MailService {\n    // 发全服邮件：只写一条记录 + 标记，不逐玩家操作\n    public void sendMailAll(long mailTemplateId) {\n        long mid = db.insert(\"INSERT INTO mail_all(mail_id,start_at,expire_at) VALUES(?,?,?)\");\n        redis.set(\"mail:all:latest\", mid); // 玩家上线/定时拉取增量\n    }\n    // 玩家上线领取：拉全服邮件增量 + 个人邮件\n    public List<Mail> pull(long playerId) {\n        long latest = redis.getLong(\"mail:all:latest\");\n        // 从 mid 上次已领位置开始拉取，逐封领取（走业务线程，幂等）\n        return mailDao.listAllSince(playerId, latest).stream()\n            .peek(m -> rewardCenter.issue(playerId, m.attach, \"mail:\" + m.id))\n            .toList();\n    }\n}"
   },
   {
    "t": "h",
    "text": "好友与公会：关系存储与离线操作"
   },
   {
    "t": "p",
    "text": "好友/公会关系是典型的关系数据：好友表（双向行）、公会表 + 成员表，存 MySQL，Redis 只缓存在线状态与常用查询。操作离线玩家的分级策略：只读（查看资料、排行榜展示）直接查库或只读快照，不进缓存；写入（加好友、发消息）写成离线消息/邮件，不激活本体；必须改本体（公会踢人、婚姻解除）走影子加载——按 playerId 从 DB 加载进 LRU 离线缓存（上限 + 过期时间），修改走正常 dirty 落地流程，用完即还。上线冲突：登录流程先查在线表再查离线影子缓存，加玩家级锁——影子存在则基于影子转正（先刷库再加载），保证任一时刻只有一个权威副本。删除角色必须级联清理好友/公会/婚姻关系，否则脏数据导致列表报错。"
   },
   {
    "t": "h",
    "text": "组队与跨服社交"
   },
   {
    "t": "p",
    "text": "组队系统：队伍是轻量级共享结构，队长持有队伍状态，队员操作投递到队长线程或独立队伍线程；队伍进度/掉落按队员实时分发。跨服组队 = 队伍信息放 Redis 共享，跨服副本 = 队伍整体报名进跨服战斗实例，属性快照随队迁移，结算回源服。社交数据跨服的核心约束：跨服交互的资产变动仍回源服执行（资产单写原则），中心服只产生结果事件。"
   },
   {
    "t": "table",
    "head": [
     "子系统",
     "在线玩家",
     "离线玩家",
     "量级防线"
    ],
    "rows": [
     [
      "聊天",
      "频道广播 + 限流",
      "离线信箱",
      "敏感词前置 + 发言 CD"
     ],
     [
      "邮件",
      "推送红点 + 即时拉取",
      "邮件表自提",
      "全服邮件懒处理"
     ],
     [
      "好友",
      "内存态 + Redis 在线",
      "影子加载只读/邮件",
      "双向关系表 + 级联清理"
     ],
     [
      "公会",
      "成员表 + 职级",
      "踢人走影子加载",
      "成员数据不复制进内存"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "全服发奖逐玩家激活——百万玩家必然炸服，必须邮件懒处理",
     "操作离线玩家直接改库——在线玩家内存态会与库不一致，必须分级处理",
     "影子加载不设 LRU 上限——离线缓存无限膨胀内存泄漏",
     "上线时不管离线缓存里的影子——双权威副本竞态数据错乱",
     "删角色不级联清关系——好友/公会列表出现幽灵数据"
    ]
   },
   {
    "t": "h",
    "text": "红点系统与离线推送：社交的体验层"
   },
   {
    "t": "p",
    "text": "社交系统还有一个体验层容易被架构忽略——红点与推送。红点系统：每个玩家维护『可领取/有未读』的标记集合（邮件未读、好友申请、公会战奖励），上线或收到事件时按系统聚合下发红点状态（单个 RedDotMsg 合并多个系统，避免每系统一条消息）；红点状态是内存态 + Redis 持久化（跨端同步，手机/PC 端一致），玩家点击后清除并回写。离线推送：玩家不在线时，关键事件（好友申请、被踢出公会、跨服结算到账）要推手机通知——走推送服务（APNs/厂商推送通道），游戏服只负责在事件发生时把『玩家离线 + 事件类型』写入推送队列，推送服务聚合限频（防骚扰），玩家上线后红点兜底（推送可以漏，红点不能错）。全服活动开启时的红点推送是典型洪峰：必须合并 + 限频 + 延迟补偿，绝不能对十万在线玩家逐条实时推。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：社交系统的一切量级问题靠『懒处理』与『影子加载』解决：全服邮件写记录玩家自提，操作离线玩家分只读/邮件/影子加载三级，上线并档保证单权威副本；跨服社交遵守资产单写原则。"
   }
  ]
 },
 {
  "id": "game-server-security",
  "title": "反外挂与安全：服务器是唯一的法官",
  "layer": 2,
  "depends": [
   "game-server-net-comm"
  ],
  "covers": [
   "game-server-32",
   "game-server-40",
   "game-server-27"
  ],
  "quiz": [
   "game-server-32",
   "game-server-40"
  ],
  "body": [
   {
    "t": "lead",
    "text": "反外挂的根基不是加密，而是『服务器权威 + 不信任客户端任何输入』：客户端可以完全逆向、内存可改、流量可伪造，但只要尺子（速度校验）、账本（流水对账）、门禁（序列号）都握在服务器手里，外挂就拿不到超额收益。"
   },
   {
    "t": "pre",
    "items": [
     "理解服务器权威与协议设计（见通信模型）",
     "理解移动校验与穿墙检测（见场景管理）",
     "对对称/非对称加密有基本概念"
    ]
   },
   {
    "t": "h",
    "text": "协议安全三层：加密、完整性、语义校验"
   },
   {
    "t": "p",
    "text": "协议安全 = 传输加密 + 完整性校验 + 语义校验三层，目标是让破解成本高于收益。① 传输加密：握手阶段用 RSA/ECDH 交换 AES 会话密钥，之后对称加密，性能可接受；客户端内置服务器公钥指纹（pinning）防中间人。② 完整性：包体带 HMAC/CRC 签名，篡改即断连；序列号单调递增防重放。③ 语义层——最后也最重要的防线：加密总会被逆向，服务器必须假设客户端完全透明，一切请求当恶意输入校验（参数范围、状态前置、操作频率）。这层做好，前两层被破也不致命。实战取舍：全量加密有 CPU 成本，移动包等高频低价值协议可只签名不加密；登录/支付/交易必须强加密强校验。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 防重放：会话级单调序列号（示意）\npublic class AntiReplay {\n    private final ConcurrentHashMap<Long, Long> lastSeq = new ConcurrentHashMap<>();\n    // 每个会话记录已处理的最大序列号，重复/回跳直接拒绝\n    public boolean check(long sessionId, long seq) {\n        return lastSeq.merge(sessionId, seq, Math::max) == seq; // 只有递增才放行\n    }\n}\n// 逻辑层频率校验：令牌桶节流采集/攻击频率\npublic class RateLimiter {\n    private final double permitsPerSec; private double stored; private long last;\n    public synchronized boolean tryAcquire() {\n        long now = System.nanoTime();\n        stored = Math.min(capacity, stored + (now - last) / 1e9 * permitsPerSec);\n        last = now;\n        if (stored >= 1) { stored -= 1; return true; }\n        return false; // 超频操作被拒，记观察日志\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">反外挂分层防线：协议层 → 逻辑层 → 数据层</text>\n<rect x=\"30\" y=\"50\" width=\"180\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">协议层</text>\n<text x=\"120\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">防重放序列号 / 加密防篡改</text>\n<text x=\"120\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">参数合法性校验</text>\n<rect x=\"230\" y=\"50\" width=\"180\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">逻辑层</text>\n<text x=\"320\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">速度校验（位移/时间）</text>\n<text x=\"320\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">频率校验（令牌桶）/ 收益上限</text>\n<rect x=\"430\" y=\"50\" width=\"180\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"520\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">数据层</text>\n<text x=\"520\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">道具产出消耗全量流水</text>\n<text x=\"520\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">离线对账发现异常产出</text>\n<path d=\"M210 90 L230 90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g10a)\"/>\n<path d=\"M410 90 L430 90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g10a)\"/>\n<rect x=\"30\" y=\"160\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"182\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">处置梯度：纠偏 → 标记观察 → 踢线 → 封号（全程证据日志，防误杀弱网）</text>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">加速器骗不过服务器时钟：统计操作实际到达频率与位移速率，单位时间动作数超上限即标记</text>\n<rect x=\"30\" y=\"228\" width=\"580\" height=\"46\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">协议被完全逆向也不致命：加密被破 → 还有逻辑校验 → 还有流水对账事后追责</text>\n<text x=\"320\" y=\"266\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">客户端加固/反调试只是提高破解门槛，不是主防线</text>\n<defs><marker id=\"g10a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 10：反外挂三层防线"
   },
   {
    "t": "h",
    "text": "行为分析：工作室与脚本的识别"
   },
   {
    "t": "p",
    "text": "协议层防不住『真协议脚本』，行为分析是关键：行为特征（24h 在线、路径重复、操作间隔方差极小）、经济特征（产出集中流向少数账号——打金工作室）、设备特征（同 IP/设备多开）。离线模型对流水/日志批量打分 + 人工复核名单。识别到疑似工作室，处置要有梯度：先观察降权（限制交易、收益减半）→ 确认后封号 + 没收异常产出。行为分析的另一面是弱网保护：速度校验用滑动窗口累计位移而非单包瞬时速率，容差 = 速度上限 ×（1 + 冗余系数），违规先纠偏不处罚，累计超阈值才处置，避免误杀抖动玩家。"
   },
   {
    "t": "h",
    "text": "封号体系与账号安全"
   },
   {
    "t": "p",
    "text": "封号体系：封号分永久/临时/限制（禁言、禁交易、禁登录），必须走 GM 指令通道（可审计、可申诉、可解封），封号数据证据链齐全（行为日志、流水、封号原因），避免误封引发客诉。账号安全：顶号互踢 + token 吊销 + 登录 IP 变化二次验证；渠道账号绑定官方账号迁移预案（渠道倒闭时防数据丢失）。全链路 channelId/accountId 贯穿登录/支付/日志，封号与审计都基于内部 ID，不依赖渠道。"
   },
   {
    "t": "h",
    "text": "经济系统防刷"
   },
   {
    "t": "p",
    "text": "经济防刷的根基是『道具产出/消耗全量流水进 Kafka』：充值、购买、掉落、消耗每一笔都记录（谁、何时、何物、来源），离线对账脚本对比产出 vs 消耗、发现异常产出（复制 bug、刷道具）。实时防线：大额资产变动告警、单位时间收益超理论上限标记（打金识别）。事故后处理：按流水逆向回收异常道具（单账号回滚）或赦免存量 + 封死漏洞 + 经济注水对冲——按污染扩散范围决策，不轻易全服回滚。"
   },
   {
    "t": "pits",
    "items": [
     "把反外挂等同于客户端加固——那是辅助，服务器语义校验才是主防线",
     "加密当主防线——客户端可完全逆向，必须假设加密已破",
     "只防协议不防逻辑——真协议脚本靠速度/频率/收益校验与行为分析",
     "速度校验单包瞬时判定——弱网玩家必被误杀，必须滑动窗口 + 容差",
     "封号不留证据链——误封客诉时无法自证"
    ]
   },
   {
    "t": "h",
    "text": "移动校验与穿墙检测的工程细节"
   },
   {
    "t": "p",
    "text": "MMORPG 反外挂的主角是移动校验，细节决定误杀率。速度校验：按上报坐标算位移/时间，超过『速度上限 ×（1 + 冗余系数）』判非法；容差要覆盖弱网抖动（滑窗累计位移而非单包瞬时速率）与移动状态切换（跳跃走抛物线轨迹校验 + 落点可达性检查、坐骑加速 = 更新速度上限参数、传送 = 免校验标记）。穿墙检测：服务器存粗粒度阻挡格（如 1m 格），对移动路径做射线/可达性检查——只校验起点到终点是否可达，不做完整导航重算（成本控制的关键）。纠偏策略：轻度越界（滑窗内偶尔超速）直接拉回合法位置不处罚；累计违规超阈值才踢线；封号必须人工/规则双重确认。经济监控指标要埋全：单位时间金币产出上限、道具产出 vs 消耗流水对账（小时级）、大额资产异动实时告警（单笔超过上限 or 频率异常）、多账号同 IP/设备聚集检测——四个指标进监控大盘，外挂和工作室的刷量行为几乎必然触发其中一个。"
   },
   {
    "t": "p",
    "text": "安全运营要形成闭环而不是只布防线：外挂样本库（每次封号的证据包——操作序列、协议报文、流水异常，沉淀成特征，供新外挂比对识别）、封号申诉通道（误封 48 小时内人工复核，申诉率是安全体系质量的体检指标）、处置记录审计（谁封的、依据什么、封多久，全链路留痕）。对外挂的响应要分级：批量封禁选低峰 + 分批（避免一次封一万账号引发舆情），封禁公告给结论不给细节（防止外挂作者反推检测规则）。安全与体验的平衡点：宁可放过一个可疑账号观察，也不误杀真实玩家——风控误杀是比外挂更快的流失引擎。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：反外挂 = 协议层（加密/签名/序列号防重放）+ 逻辑层（速度/频率/收益校验）+ 数据层（流水对账）；处置梯度纠偏→观察→踢线→封号；行为分析识别工作室；经济防刷靠全量流水 + 上限告警 + 事故回收。"
   }
  ]
 },
 {
  "id": "game-server-thread-model",
  "title": "线程模型与性能优化：一人一线程、无锁串行化",
  "layer": 3,
  "depends": [
   "game-server-session",
   "game-server-player-data"
  ],
  "covers": [
   "game-server-05",
   "game-server-06",
   "game-server-11",
   "game-server-21",
   "game-server-25"
  ],
  "quiz": [
   "game-server-05",
   "game-server-11",
   "game-server-21"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服性能的根基是线程模型：把同一个玩家的所有操作串行化，就能无锁操作该玩家内存数据——『一人一线程』是比任何锁优化都高明的并发方案，Disruptor 则把这个模型推到百万级吞吐。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Netty IO 线程与业务线程分离（见通信模型）",
     "理解玩家对象生命周期与内存态（见数据存储）",
     "理解 JUC 锁竞争与 JVM GC 的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "为什么单线程处理单个玩家：锁竞争的代价"
   },
   {
    "t": "p",
    "text": "玩家数据是共享可变的（背包、货币、任务互相影响），多线程并发改必须加锁：锁竞争 + 死锁风险 + 加锁粒度难以把握。游戏服的主流做法是刻意制造串行：Netty IO 线程收到包 → 解码 → 按玩家 ID 哈希投递到固定业务线程（或 Disruptor RingBuffer），同一玩家的消息永远在同一线程顺序执行。效果：业务代码操作玩家对象完全不用加锁，像写单线程程序一样；多业务线程按玩家天然分片，吞吐随核数扩展。代价：跨玩家操作（交易、组队）要么串到一方线程（按玩家 ID 大小仲裁），要么显式加锁并固定加锁顺序防死锁；业务线程内禁止同步 DB/HTTP（慢操作异步化，回调重新投递回该玩家线程）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服线程模型：IO 解耦、按玩家分片、无锁串行</text>\n<rect x=\"25\" y=\"55\" width=\"130\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"90\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">IO 线程池</text>\n<text x=\"90\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">收包/解码/拆包</text>\n<text x=\"90\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">绝不阻塞</text>\n<rect x=\"200\" y=\"55\" width=\"150\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"275\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">分发层</text>\n<text x=\"275\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按 playerId 哈希</text>\n<text x=\"275\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Disruptor 无锁队列</text>\n<g stroke=\"var(--lv2)\" stroke-width=\"2\">\n<rect x=\"410\" y=\"40\" width=\"205\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--lv2)\"/>\n<rect x=\"410\" y=\"96\" width=\"205\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--lv2)\"/>\n<rect x=\"410\" y=\"152\" width=\"205\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--lv2)\"/>\n</g>\n<text x=\"512\" y=\"67\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务线程 1（玩家 A/B/C）</text>\n<text x=\"512\" y=\"123\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务线程 2（玩家 D/E）</text>\n<text x=\"512\" y=\"179\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务线程 3（玩家 F/G）</text>\n<path d=\"M155 100 L200 100\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g11a)\"/>\n<path d=\"M350 80 L410 62\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#g11a)\"/>\n<path d=\"M350 90 L410 118\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#g11a)\"/>\n<path d=\"M350 100 L410 174\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#g11a)\"/>\n<text x=\"275\" y=\"225\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同玩家永远同一线程 → 业务无锁；跨玩家（交易）串一方线程或固定锁序</text>\n<rect x=\"25\" y=\"248\" width=\"590\" height=\"36\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"271\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">铁律：业务线程内禁止阻塞 IO；慢操作异步化，回调投递回原线程</text>\n<defs><marker id=\"g11a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 11：IO 解耦 + 按玩家分片的无锁模型"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Disruptor 无锁原理：环形数组 + 序号 CAS + 缓存行填充</text>\n<rect x=\"30\" y=\"55\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">生产者</text>\n<text x=\"95\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty IO 线程</text>\n<text x=\"95\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CAS 抢占序号</text>\n<rect x=\"250\" y=\"55\" width=\"140\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">RingBuffer</text>\n<text x=\"320\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">预分配定长环形数组</text>\n<text x=\"320\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">槽位复用，无 GC 压力</text>\n<rect x=\"480\" y=\"55\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"545\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">消费者</text>\n<text x=\"545\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">各自维护消费序号</text>\n<text x=\"545\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按玩家哈希分片保序</text>\n<path d=\"M160 90 L250 90\" stroke=\"var(--accent) stroke-width=\"2.5\" marker-end=\"url(#g11c)\"/>\n<path d=\"M390 90 L480 90\" stroke=\"var(--accent) stroke-width=\"2.5\" marker-end=\"url(#g11c)\"/>\n<rect x=\"30\" y=\"155\" width=\"580\" height=\"46\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">比 ArrayBlockingQueue 快一个量级的三因素</text>\n<text x=\"320\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数组预分配无 GC × CAS 无锁竞争 × 序号缓存行填充防伪共享</text>\n<rect x=\"30\" y=\"215\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">WaitStrategy 取舍：BlockingWait（省 CPU）→ Park/Yield → BusySpin（最低延迟吃满 CPU）</text>\n<text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">堆积排查：remainingCapacity 变小=消费跟不上 → jstack 看 CPU 满核(逻辑重)或阻塞(IO) → 去阻塞/加并行/换策略</text>\n<defs><marker id=\"g11c\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 11b：Disruptor 无锁原理"
   },
   {
    "t": "h",
    "text": "Disruptor：无锁队列把吞吐推到百万级"
   },
   {
    "t": "p",
    "text": "Disruptor 用『环形数组 + 序号 CAS + 缓存行填充』实现无锁队列，比 ArrayBlockingQueue 快一个量级。原理四要素：RingBuffer（预分配定长环形数组，槽位复用无 GC 压力）；Sequence（生产者用 CAS 抢占序号，消费者各自维护消费序号，互不抢锁）；伪共享防护（序号字段缓存行填充，避免多核缓存行失效）；WaitStrategy（BlockingWait/Park/Yield/BusySpin 在延迟与 CPU 间权衡）。游戏服落地：Netty IO 线程作生产者，按玩家 ID 哈希发到 Disruptor，多个消费者线程各自负责一批玩家。配置要点：多生产者用 ProducerType.MULTI（CAS 竞争序号），单生产者 SINGLE 更快；多消费者用 WorkerPool 竞争消费（每条只被一个消费者处理，保序靠哈希）或 EventHandler 依赖图做阶段流水线。线上堆积排查：先看 remainingCapacity 持续变小 = 消费跟不上 → 消费者 CPU 满核 = 逻辑重、低 CPU = 阻塞（jstack 抓现场）→ 三刀：消费逻辑去阻塞、按玩家哈希加并行度、WaitStrategy 换 Yielding 降延迟 → 背压兜底（生产端限流/丢弃非关键消息 + 告警，绝不允许 OOM）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Disruptor 按玩家哈希保序分发（示意）\nRingBuffer<GameEvent> ring = RingBuffer.create(\n    ProducerType.MULTI,   // Netty 多 IO 线程并发生产，CAS 竞争序号\n    GameEvent::new, 1 << 14, YieldingWaitStrategy.INSTANCE);\nSequenceBarrier barrier = ring.newBarrier();\n// 每个消费者固定一批玩家：同一玩家永远同一消费者\nint idx = (int) (playerId & (consumers - 1));\nring.publish(translate(playerId, msg)); // 消费者按 idx 分片拉取\n// 关键：消费逻辑禁止阻塞 IO，DB/HTTP 全异步；RingBuffer 满即背压"
   },
   {
    "t": "h",
    "text": "对象池与 GC 优化"
   },
   {
    "t": "p",
    "text": "游戏服是高频分配对象的重灾区（消息对象、战斗事件、同步包），GC 是毛刺的主要来源。三层优化：① 复用——消息对象用池化（Netty 的 Recycler、自研对象池），战斗 tick 内的临时对象用 ThreadLocal 复用；② 减少——tick 末合并消息、增量同步减少对象数量；③ 分代配置——堆大小与新生代比例按压测调（开服场景大对象多，避免对象直接进老年代）。GC 监控：关注 Full GC 频率与 STW 时长，老年代曲线持续抬高 = 内存泄漏（dump + MAT 分析 Path to GC Roots，常见凶手：静态 Map、事件总线、ThreadLocal 未清理、未关闭定时任务）。玩家对象泄漏防线：PlayerManager 唯一持有 + 别处只存 playerId + logout 收口统一反注册。"
   },
   {
    "t": "h",
    "text": "热点优化与缓存设计"
   },
   {
    "t": "p",
    "text": "热点三类：热点玩家（大主播/高战力被大量查看）、热点数据（全服 Boss 血量、活动状态）、热点请求（登录洪峰、排行榜）。优化手段：热点数据 Redis + 本地缓存双级（本地 Caffeine 抗瞬时风暴，Redis 保跨服一致）；热点玩家资料快照只读副本；登录洪峰前置限流 + 批量预加载 DB 数据；排行榜写合并（批量 ZADD）。缓存设计原则：缓存不是账本——玩家资产不落 Redis 当唯一存储，Redis 只做缓存与共享态；缓存更新用『先更新内存 → 异步落地 → 失效缓存』，避免时序错乱。"
   },
   {
    "t": "pits",
    "items": [
     "每个请求丢线程池并发处理——玩家数据共享可变必加锁，应刻意串行化",
     "业务逻辑跑在 EventLoop 上——一个慢操作冻住成千上万连接",
     "Disruptor 里做阻塞 IO——单线程事件循环全体卡死",
     "队列无限堆积当背压——必须监控水位 + 生产端限流，防 OOM",
     "忽视 GC 毛刺——高频分配 + 大对象直接进老年代，P99 抖动"
    ]
   },
   {
    "t": "h",
    "text": "锁序约定与异步化模式：避免死锁与阻塞"
   },
   {
    "t": "p",
    "text": "『一人一线程』消除的是单玩家内部竞争，跨玩家操作仍需显式锁，锁用得不对就是死锁温床。三个约定：① 全局锁序——所有跨玩家加锁必须按固定顺序（如 playerId 大小序、系统优先级序）获取，禁止『先锁 A 再锁 B』与『先锁 B 再锁 A』并存，锁序乱了死锁只是时间问题；② 锁内禁 IO——临界区内绝不做 DB/Redis/HTTP 调用，需要外部数据先查询完再进临界区（否则锁被 IO 拽住，整个分片停摆）；③ 尽量用「串行化替代加锁」——交易/组队这类跨玩家操作直接串到一方线程执行，比加锁更简单可靠。异步化模式三选一：回调（异步查询 + 回调投递回原线程，链路长时回调地狱）、CompletableFuture 编排（阶段组合，可读性好）、协程框架（Quasar/虚拟线程思想，写同步代码拿到异步性能）——共同点都是『业务线程永不阻塞，慢操作外包，结果回到原线程继续』。热点玩家（大主播、排行榜头名被大量查询）另加一条：资料查询走只读快照副本，不读热玩家内存对象本身，避免多线程读同一对象的可见性问题。"
   },
   {
    "t": "p",
    "text": "一个实战提醒：无锁模型的收益依赖『玩家数据不被并发读』——日志线程、监控线程、GM 查询线程读玩家内存对象时不能直接拿引用，走快照拷贝或对象池化的只读视图，否则刚建好的无锁模型被一个读取线程打破。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：线程模型 = IO 解耦 + 按玩家哈希分片 + 单线程无锁；Disruptor 用环形数组/CAS/缓存行填充把吞吐推到百万级；性能优化三板斧：对象池与 GC 治理、热点双级缓存、背压兜底；玩家对象生命周期单入口防泄漏。"
   }
  ]
 },
 {
  "id": "game-server-loadtest",
  "title": "压测与容量规划：找拐点，不是跑满分",
  "layer": 3,
  "depends": [
   "game-server-thread-model"
  ],
  "covers": [
   "game-server-38",
   "game-server-23"
  ],
  "quiz": [
   "game-server-38"
  ],
  "body": [
   {
    "t": "lead",
    "text": "压测的意义不是证明服务器能扛多少，而是找到『在线数-延迟』曲线的拐点：上线前用真实协议机器人压出容量上限，开服时才知道该开多少服、该预载什么缓存。"
   },
   {
    "t": "pre",
    "items": [
     "理解线程模型与队列水位（见线程模型）",
     "理解登录链路与数据加载（见会话管理）",
     "有 Linux 与监控工具使用经验"
    ]
   },
   {
    "t": "h",
    "text": "压测机器人框架：真协议假人"
   },
   {
    "t": "p",
    "text": "游戏服压测不能用 HTTP 模拟，必须走真实协议栈：机器人 = 协议级假客户端集群（Netty + 真实编解码），多机分布式（单机几千连接受端口/内存限制），控制中心统一下发场景、调速、收集指标。行为模型要逼近真人：登录洪峰（开服瞬间数千连接/秒，重点压 DB 加载与会话创建——真正的瓶颈通常在 DB 而非连接数）、常态脚本（状态机模拟登录→跑图→打怪→交易→下线，操作间隔加随机抖动）、热点场景（千人同屏移动广播、全服活动整点开启、世界聊天刷屏）。关键设计：压测账号池号段隔离（事后清档防污染排行榜/邮件/日志）、思考时间可调、逐步加压找拐点、机器人自身不能成为瓶颈（异步 IO + 指标异步上报）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">压测闭环：场景建模 → 逐步加压 → 拐点定位 → 容量决策</text>\n<rect x=\"25\" y=\"55\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">机器人集群</text>\n<text x=\"95\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">真实协议 + 行为抖动</text>\n<rect x=\"195\" y=\"55\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"265\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">场景控制中心</text>\n<text x=\"265\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录洪峰/常态/热点</text>\n<rect x=\"365\" y=\"55\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"435\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">目标服务器</text>\n<text x=\"435\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">业务线程/DB/Redis</text>\n<rect x=\"535\" y=\"55\" width=\"85\" height=\"60\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"577\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">度量</text>\n<text x=\"577\" y=\"99\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">延迟/水位/GC</text>\n<path d=\"M165 85 L195 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g12a)\"/>\n<path d=\"M335 85 L365 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g12a)\"/>\n<path d=\"M505 85 L535 85\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g12a)\"/>\n<g stroke=\"var(--line)\" stroke-width=\"2\">\n<polyline points=\"50,240 110,236 170,226 230,210 290,188 350,158 410,150 470,150\" fill=\"none\"/>\n<line x1=\"50\" y1=\"160\" x2=\"470\" y2=\"160\" stroke-dasharray=\"5 4\" stroke=\"var(--lv2)\"/>\n</g>\n<text x=\"470\" y=\"145\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">延迟</text>\n<text x=\"230\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">P99 拐点</text>\n<text x=\"260\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">在线数（横轴）→ 容量上限 = 拐点处在线数 × 冗余系数</text>\n<defs><marker id=\"g12a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 12：压测闭环与拐点曲线"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">有状态服务的三层扩容方案</text>\n<rect x=\"30\" y=\"55\" width=\"185\" height=\"96\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"122\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 区服维度</text>\n<text x=\"122\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">扩容=开新区</text>\n<text x=\"122\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">缩容=合服</text>\n<text x=\"122\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">登录服路由表调度，零改造</text>\n<rect x=\"230\" y=\"55\" width=\"185\" height=\"96\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"322\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 单区内拆分</text>\n<text x=\"322\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按场景/地图拆进程</text>\n<text x=\"322\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跨地图=跨进程迁移</text>\n<text x=\"322\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">MMORPG 常用</text>\n<rect x=\"430\" y=\"55\" width=\"185\" height=\"96\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"522\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 战斗服无状态化</text>\n<text x=\"522\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">快照启动+结果回写</text>\n<text x=\"522\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">进程可随意增删</text>\n<text x=\"522\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">K8s HPA 按战场数伸缩</text>\n<rect x=\"30\" y=\"170\" width=\"585\" height=\"48\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">玩家会话迁移：打包 → 加载 → 切路由 → 客户端短重连</text>\n<text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">两阶段：源进程保留只读副本，目标确认+切路由成功才释放，中途失败回退</text>\n<rect x=\"30\" y=\"234\" width=\"585\" height=\"40\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">缩容 = draining（拒新玩家）→ 存量迁移或自然下线；K8s 滚动更新配 preStop 优雅下线</text>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">难点不在选型，在『状态搬运的原子性』与『玩家无感』</text>\n</svg>",
    "caption": "图 12b：三层扩容方案"
   },
   {
    "t": "h",
    "text": "指标与目标：度量什么才算压到位"
   },
   {
    "t": "p",
    "text": "服务端指标：业务线程延迟 P50/P99（P99 才是玩家体感）、队列水位（Disruptor remainingCapacity / Kafka lag）、GC 频率与 STW、带宽、DB QPS/慢查询、Redis slowlog。机器人侧指标：响应延迟分布、失败率、掉线数。核心产出是『在线数-延迟』曲线：压到延迟拐点（P99 开始陡增）即容量上限；开服目标 = 上限 × 0.6~0.7 冗余系数，留出活动峰值与故障缓冲。量化数据说话：压测报告必须带拐点前后对比，而不是一句『能扛 1 万人』。"
   },
   {
    "t": "h",
    "text": "瓶颈定位方法论：先定界再下钻"
   },
   {
    "t": "p",
    "text": "压测中定位瓶颈按层走：先定界（是所有玩家卡还是部分？全部卡 = 公共依赖 DB/Redis/Kafka 或网络；部分卡 = 分片/单进程问题）→ 机器层（top 看 CPU/内存/IO；CPU 高 → jstack + async-profiler 找热点；内存高 → GC 日志看 Full GC 是否频繁）→ 应用层（jstack 看业务线程 BLOCKED 还是等 IO；队列水位是否堆积；是否广播风暴）→ 依赖层（DB processlist 慢查询、Redis 热 key、Kafka lag）。开服登录风暴的经典瓶颈排序：DB 玩家数据加载 > 会话创建与 Redis 写入 > 登录服验签 RPC > 连接数本身（Netty 扛连接很轻松）。"
   },
   {
    "t": "h",
    "text": "扩容方案：有状态服务的容量弹性"
   },
   {
    "t": "p",
    "text": "压测出的容量上限如何扩展？分层方案：区服维度（最常用）——游戏天然按区服隔离，扩容 = 开新区，登录服路由表调度，业务零改造；单区内拆分——按场景/地图拆进程（玩家跨地图 = 跨进程迁移），战斗服无状态化（战斗实例快照启动 + 结果回写，进程可随意增删，K8s HPA 按战场数伸缩）；玩家会话迁移——源进程打包内存状态 → 目标进程加载 → 路由切换 → 客户端短重连，两阶段保证状态不丢。缩容 = draining（标记不收新玩家）→ 存量自然下线或迁移完再下线。K8s 滚动更新游戏服：先 draining 拒新玩家 + preStop 优雅下线，更新窗口选低峰。"
   },
   {
    "t": "h",
    "text": "全链路压测与开服峰值评估"
   },
   {
    "t": "p",
    "text": "单服压测不够，要全链路：登录服 → 游戏服 → DB/Redis/Kafka → 日志链路一起压，验证每个环节的瓶颈在哪里。开服峰值评估：按历史开服数据（预约量 × 转化率）估首日 DAU，拆成登录洪峰（首个 30 分钟登录曲线）、在线峰值、广播放大（同屏活动）；据此定开服机器数、DB 规格、缓存预热方案（预载热门配置、排行榜预热）。压测是长期投资：大版本回归压测对比容量曲线防劣化——某版本上线后容量下降 30% 就是优化回退的信号。"
   },
   {
    "t": "pits",
    "items": [
     "用 HTTP 模拟压长连接游戏——协议栈不一致，结论不可信",
     "压到不崩溃就说能扛——不压到拐点不知道真实上限",
     "机器人行为太规律——必须加随机抖动和多种画像，最真实是录真人操作回放",
     "压完不清档——机器人污染排行榜/邮件/日志，正式环境事故",
     "只压单服不压全链路——登录服/DB/Kafka 的瓶颈全被放过"
    ]
   },
   {
    "t": "h",
    "text": "监控告警与压测环境隔离"
   },
   {
    "t": "p",
    "text": "压测的价值要靠监控体系兑现：指标采集（Prometheus/node-exporter + JVM exporter：业务线程池水位、队列 remainingCapacity、GC 次数与 STW、DB QPS/慢查询、Redis slowlog、网卡带宽）、告警规则（队列水位 > 80% 持续 1 分钟、P99 延迟超阈值、Full GC 间隔 < 5 分钟——告警要可行动，每条告警对应 runbook）。压测环境三隔离：数据隔离（压测账号号段专属库或沙箱，绝不碰线上玩家数据）、网络隔离（压测流量走独立网段，避免污染线上监控与 CDN 计费）、时间隔离（压测选低峰，避开维护窗口，事后清档）。机器人数量规划：单机 3000~5000 连接（受端口/文件句柄限制），万人压测至少 3~5 台机器人机；机器人进程自身不能成为瓶颈——异步 IO + 指标异步上报，否则压的是机器人自己。压测报告模板：场景、在线数梯度（500/1000/.../上限）、每梯度 P50/P99 延迟、失败率、各层瓶颈、拐点位置、建议容量 = 拐点 × 0.6~0.7——这份报告就是上线评审和扩容决策的依据。"
   },
   {
    "t": "p",
    "text": "压测数据的真实性还有一招：录制真实玩家操作日志回放（把线上玩家请求按时间序录下来，压测时原样重放），比脚本模拟逼真得多，能暴露脚本覆盖不到的偶发链路；回放压测与脚本压测结合，前者验证正确性边界、后者验证容量上限。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：压测 = 真实协议机器人 + 场景建模（洪峰/常态/热点）+ 拐点度量（在线数-延迟曲线）；容量目标 = 拐点 × 冗余系数；瓶颈定位先定界再分层下钻；扩容按区服/场景/战斗服无状态化三层方案；全链路 + 回归压测防劣化。"
   }
  ]
 },
 {
  "id": "game-server-incident",
  "title": "事故应急与复盘：先止血、再算账、后安抚",
  "layer": 3,
  "depends": [
   "game-server-thread-model"
  ],
  "covers": [
   "game-server-24",
   "game-server-39",
   "game-server-25"
  ],
  "quiz": [
   "game-server-24",
   "game-server-39"
  ],
  "body": [
   {
    "t": "lead",
    "text": "线上事故是游戏服架构师真正的考场：复制 bug、误发奖励、全服卡顿——处理顺序永远是先止血、再算账、后安抚，每一步都要快且留痕，平时打的流水就是事故时的救命数据。"
   },
   {
    "t": "pre",
    "items": [
     "理解线程模型与队列水位排查（见线程模型）",
     "理解 GM 指令通道与流水对账（见反外挂）",
     "理解回滚与补偿的基本决策"
    ]
   },
   {
    "t": "h",
    "text": "故障分类与定级"
   },
   {
    "t": "p",
    "text": "故障按影响分四级：P0（资损/复制 bug/大规模数据污染）——可紧急停服；P1（功能异常但无资损）——关功能降级；P2（性能劣化）——监控观察 + 优化；P3（体验问题）——排期修复。定级决定止血手段的激进程度，绝不一刀切停服。故障按根因分：逻辑 bug（代码缺陷）、数据问题（脏数据、配置错误）、依赖故障（DB/Redis/Kafka/云厂商）、安全事件（外挂刷道具、盗号）、容量问题（峰值超预估）。分诊第一步永远是用监控大盘定界：所有玩家卡还是部分？在线数异常？CPU/GC/DB QPS/带宽哪一项异常？"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">事故应急三步走：止血 → 算账 → 安抚</text>\n<rect x=\"25\" y=\"55\" width=\"180\" height=\"90\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"115\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 止血（分钟级）</text>\n<text x=\"115\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">P0 可停服 / P1 关功能降级</text>\n<text x=\"115\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先留现场（dump/jstack）再重启</text>\n<rect x=\"230\" y=\"55\" width=\"180\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 算账（数据核查）</text>\n<text x=\"320\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">流水圈定影响范围与账号清单</text>\n<text x=\"320\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">恶意利用 vs 被动获得分级处置</text>\n<rect x=\"435\" y=\"55\" width=\"180\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"525\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 安抚（补偿与公告）</text>\n<text x=\"525\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 通道定向/全服补偿</text>\n<text x=\"525\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">补偿防刷：按时间窗真实在线圈人</text>\n<path d=\"M205 100 L230 100\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g13a)\"/>\n<path d=\"M410 100 L435 100\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#g13a)\"/>\n<rect x=\"25\" y=\"170\" width=\"590\" height=\"46\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">回滚优先级：单账号回滚（按流水逆向回收）&gt; 分区回滚 &gt; 全服回滚（核弹级，慎用）</text>\n<text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全服回滚会抹掉正常玩家进度，往往不如回收异常 + 全服补偿</text>\n<rect x=\"25\" y=\"232\" width=\"590\" height=\"40\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"257\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">复盘模板：时间线 / 根因 / 影响面 / 改进项（补监控·补流水·补开关）落实到人，48 小时内完成</text>\n<defs><marker id=\"g13a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 13：事故应急三步走"
   },
   {
    "t": "h",
    "text": "定位流程：先定界再分层，全程用监控说话"
   },
   {
    "t": "p",
    "text": "以全服卡顿为例的排查顺序：① 定界（1 分钟）——所有玩家卡还是部分？部分卡 = 分片/单进程问题；全部卡 = 公共依赖（DB/Redis/Kafka）或网络。看监控大盘：在线数异常（外挂/机器人涌入）、带宽、CPU、GC、DB QPS/慢查询。② 机器层——top 看 CPU/内存/IO；CPU 高 → jstack + async-profiler 找热点；内存高 → GC 日志看 Full GC 频率（大对象、缓存无界增长）。③ 应用层——jstack 看业务线程是否 BLOCKED（锁竞争）或等 IO；Disruptor/队列水位是否堆积（消费慢于生产）；是否全服广播风暴（活动开启瞬间全服推送）。④ 依赖层——DB processlist 慢查询、Redis 大 key/热 key（redis-cli --hotkeys 或 monitor 采样）、Kafka 消费 lag。真实案例：活动整点开启全服卡 3 秒，定位是活动初始化在业务线程同步查库，改为预加载 + 异步初始化解决。"
   },
   {
    "t": "h",
    "text": "紧急止血与热修"
   },
   {
    "t": "p",
    "text": "止血手段按侵入性排序：功能开关（秒级关掉异常功能，最轻）→ 配置热更（改数值/公式）→ 代码热更（Lua/Groovy 脚本或 ClassLoader，低峰灰度）→ 重启（最后手段，先 dump + jstack 留现场）。利用中的 bug：先关入口（关功能开关/热更修复/紧急停服），防损失扩大；同时摘除出问题节点流量再操作，避免止血动作本身扩大故障。热修三原则：低峰 + 灰度（先一台服观察）、出问题能回滚、操作留审计日志。重启前必须留现场（jmap dump 有 STW 风险，低峰 + 先摘流量，或用 -XX:+HeapDumpBeforeFullGC 借 Full GC 顺带 dump）。"
   },
   {
    "t": "h",
    "text": "数据修复：回滚、补偿与对账"
   },
   {
    "t": "p",
    "text": "复制道具已被交易流通时：按流水追踪交易链——二手买家属善意取得，优先回收源头账号 + 对买家等价补偿；流通太广时『赦免存量 + 封死漏洞 + 经济注水对冲』往往比强行回收划算。回滚决策：单账号回滚 > 分区回滚 > 全服回滚；全服回滚决策权在项目负责人群（制作人/主程/运营），技术方提供数据（污染范围、回滚误伤面、两种方案损失对比）给建议不独断。补偿防刷：按『事故时间窗内真实在线/登录记录』圈人，邮件设领取期限，工作室批量小号无历史行为记录可被风控过滤。"
   },
   {
    "t": "h",
    "text": "事后复盘模板"
   },
   {
    "t": "p",
    "text": "48 小时内出复盘：时间线（发现→定级→止血→修复→恢复，精确到分钟，谁在什么时间做了什么）、根因分析（5Why 追到代码/配置/依赖的确定性原因，拒绝『偶发』）、影响面（受损玩家数、资损金额、SLA）、改进项（补监控、补流水、补功能开关、补自动化对账，落实到人 + 排期）、预防措施验证（下版本回归验证修复有效）。复盘的产出是『下一次能更快止血』：预置的开关、更细的监控、可执行的 runbook 比一纸检讨有用得多。"
   },
   {
    "t": "pits",
    "items": [
     "上来就重启——必须留现场（dump/jstack），重启是最后手段",
     "直接全服回滚——误伤正常玩家进度，先算清楚污染范围再决策",
     "全服补偿被工作室小号薅——必须按真实在线记录圈人",
     "复盘只写『偶发/人为』——5Why 追根因，落到可执行的改进项",
     "没有 runbook——事故时靠人脑回忆预案，黄金时间被浪费"
    ]
   },
   {
    "t": "h",
    "text": "Runbook 与故障演练：把应急变成肌肉记忆"
   },
   {
    "t": "p",
    "text": "事故应急的黄金时间是前 5 分钟，靠人脑回忆预案必然失败——必须预置 Runbook（操作手册）：每条已知故障场景一张卡（症状 → 定级 → 止血步骤 → 涉及系统 → 联系人），如『DB 主库慢查询打满』的卡写着：先看 processlist 找慢 SQL → 从监控确认是查询风暴还是写入放大 → 降级重查询（关排行榜刷新）→ 必要时主从切换 → 复盘。Runbook 要放在监控告警旁边（告警即链接到 Runbook），值班人不需要思考『怎么办』。故障演练按季度做：随机抽一张 Runbook 场景，在压测环境真实演练（注入 DB 故障/断流/洪峰），演练暴露的问题是 Runbook 写得不对、权限不够、工具不顺手——演练的价值不在『演练通过』而在『演练失败并改进』。应急角色分工也要预置：指挥（定级与决策）、技术（定位与止血）、沟通（公告与对运营同步）、记录（时间线留痕）——四人小组让指挥权清晰，避免事故现场多头指挥。事故后的补偿与公告策略同样预置模板：公告口径（给结论给补偿，不甩技术细节）、补偿档位（按事故时长分档）、发放通道（GM 指令 + 邮件懒处理）。"
   },
   {
    "t": "p",
    "text": "复盘的两个反模式要避免：『追责导向』——把复盘写成批斗会，下次没人敢报真实根因，必须建立『无责复盘』文化（系统问题不怪人，改进项落到流程与工具）；『复盘完就完』——改进项没有验证机制，下个版本仍然复现，改进项要带验证用例进 CI（能自动化验证的必须自动化）。"
   },
   {
    "t": "p",
    "text": "补一个停服沟通细节：紧急停服前要预置玩家侧弹窗提示与官方公告渠道同步，停服通知滞后或缺失是事故舆情放大的最常见原因。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：事故处理 = 止血（按定级选手段，先留现场）→ 算账（流水圈范围，恶意/被动分级）→ 安抚（补偿防刷 + 公告）；回滚单账号优先、全服慎用；48 小时复盘落到改进项；预置开关/监控/runbook 让下一次更快止血。"
   }
  ]
 },
 {
  "id": "game-server-merge-cross",
  "title": "合服与跨服：世界边界的合并与缝合",
  "layer": 3,
  "depends": [
   "game-server-player-data",
   "game-server-social"
  ],
  "covers": [
   "game-server-17",
   "game-server-22",
   "game-server-15"
  ],
  "quiz": [
   "game-server-22",
   "game-server-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "合服是『两个世界的数据并集去重』，跨服是『所有服都能到达的中立层』——一个向内合并玩家世界，一个向外缝合玩家世界，两者是游戏服生命周期里最难也最考验系统设计的两件事。"
   },
   {
    "t": "pre",
    "items": [
     "理解玩家数据分片与全局主键（见数据存储）",
     "理解社交关系存储与离线处理（见社交系统）",
     "理解资产单写原则（见反外挂与架构总览）"
    ]
   },
   {
    "t": "h",
    "text": "合服流程：前置改造比合服当天更重要"
   },
   {
    "t": "p",
    "text": "合服的本质是『两个世界的数据并集去重』，技术难点不在导数据，而在唯一性冲突与社交关系重连。完整流程按时间线：① 前置改造（合服前几个版本就要做）——主键全局唯一（雪花 ID 或区服号进高位）、昵称/公会名唯一索引预留后缀方案；② 停服窗口——双服同时停服冻结数据，提前 3~7 天公告；③ 数据合并——玩家表 ID 冲突用映射表（oldId → newId）全量改外键（背包、邮件、好友、公会成员……漏一张表就是灵异 bug）；重名处理：昵称加 [S1]/[S2] 后缀 + 发改名卡（按活跃/等级保留一个原名，其余加后缀）；排行榜/全服数据双服合并重排重建；④ 社交关系——好友、公会、婚姻关系按 ID 映射批量重写，级联清理死号关系；⑤ 验证——自动化对账脚本（双服关键数据条数、资产总额合并前后一致）+ 白名单玩家预演；⑥ 入口切换——登录服路由表把旧区服 ID 都指向新服，原服入口保留可登录；⑦ 回滚预案——合并前全量备份，验证失败可回退。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">合服七步：从前置改造到回滚预案</text>\n<g font-size=\"12\">\n<rect x=\"25\" y=\"50\" width=\"130\" height=\"56\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"74\" text-anchor=\"middle\" fill=\"var(--ink)\">① 前置改造</text>\n<text x=\"90\" y=\"94\" text-anchor=\"middle\" fill=\"var(--muted)\">全局唯一主键</text>\n<rect x=\"175\" y=\"50\" width=\"130\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"240\" y=\"74\" text-anchor=\"middle\" fill=\"var(--ink)\">② 停服冻结</text>\n<text x=\"240\" y=\"94\" text-anchor=\"middle\" fill=\"var(--muted)\">双服同时停服</text>\n<rect x=\"325\" y=\"50\" width=\"130\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"390\" y=\"74\" text-anchor=\"middle\" fill=\"var(--ink)\" font-weight=\"bold\">③ 数据合并</text>\n<text x=\"390\" y=\"94\" text-anchor=\"middle\" fill=\"var(--muted)\">映射表改外键</text>\n<rect x=\"475\" y=\"50\" width=\"140\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"545\" y=\"74\" text-anchor=\"middle\" fill=\"var(--ink)\" font-weight=\"bold\">④ 关系重写</text>\n<text x=\"545\" y=\"94\" text-anchor=\"middle\" fill=\"var(--muted)\">好友/公会/婚姻</text>\n</g>\n<path d=\"M155 78 L175 78\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g14a)\"/>\n<path d=\"M305 78 L325 78\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g14a)\"/>\n<path d=\"M455 78 L475 78\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g14a)\"/>\n<g font-size=\"12\">\n<rect x=\"25\" y=\"130\" width=\"180\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"154\" text-anchor=\"middle\" fill=\"var(--ink)\" font-weight=\"bold\">⑤ 自动化对账</text>\n<text x=\"115\" y=\"174\" text-anchor=\"middle\" fill=\"var(--muted)\">条数/资产总额前后一致</text>\n<rect x=\"230\" y=\"130\" width=\"180\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"154\" text-anchor=\"middle\" fill=\"var(--ink)\" font-weight=\"bold\">⑥ 入口切换</text>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" fill=\"var(--muted)\">路由表旧ID→新服，玩家无感</text>\n<rect x=\"435\" y=\"130\" width=\"180\" height=\"56\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"154\" text-anchor=\"middle\" fill=\"var(--ink)\" font-weight=\"bold\">⑦ 回滚预案</text>\n<text x=\"525\" y=\"174\" text-anchor=\"middle\" fill=\"var(--muted)\">全量备份，失败可退</text>\n</g>\n<path d=\"M205 158 L230 158\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g14a)\"/>\n<path d=\"M410 158 L435 158\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g14a)\"/>\n<rect x=\"25\" y=\"212\" width=\"590\" height=\"68\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"234\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">两个最容易翻车的点</text>\n<text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">漏改一张外键表 → 幽灵好友/幽灵公会成员（用映射表 + 对账脚本全量校验）</text>\n<text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不停服在线合服 → 内存态 + 强社交关系使一致性窗口极难控制，业界主流仍停服</text>\n<defs><marker id=\"g14a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 14：合服七步流程"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">跨服中立层：影子参战 + 结果回源</text>\n<rect x=\"30\" y=\"55\" width=\"130\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">源服 A</text>\n<text x=\"95\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家本体不下线</text>\n<rect x=\"30\" y=\"150\" width=\"130\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">源服 B</text>\n<text x=\"95\" y=\"195\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">报名带属性快照</text>\n<rect x=\"255\" y=\"100\" width=\"150\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"330\" y=\"125\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">战斗实例（中立层）</text>\n<text x=\"330\" y=\"145\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只跑战斗，不持资产</text>\n<text x=\"330\" y=\"161\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一局一实例，打完即毁</text>\n<rect x=\"495\" y=\"55\" width=\"130\" height=\"66\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"560\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">结果回源</text>\n<text x=\"560\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按路由表翻译源服</text>\n<path d=\"M160 88 L255 118\" stroke=\"var(--accent\" stroke-width=\"2.5\" marker-end=\"url(#g14c)\"/>\n<path d=\"M160 165 L255 130\" stroke=\"var(--accent\" stroke-width=\"2.5\" marker-end=\"url(#g14c)\"/>\n<path d=\"M405 115 L495 100\" stroke=\"var(--lv3\" stroke-width=\"2.5\" marker-end=\"url(#g14d)\"/>\n<rect x=\"30\" y=\"205\" width=\"585\" height=\"42\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"227\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">资产单写：资产变动永远回源服执行，中心服只产结果事件（幂等按 battleId 去重）</text>\n<text x=\"320\" y=\"243\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">合服路由表 oldId→newId 翻译，跨服期间源服合服不影响结算回推</text>\n<rect x=\"30\" y=\"255\" width=\"585\" height=\"30\" rx=\"8\" fill=\"var(--lv3-bg\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"275\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">中心服挂了只影响在局玩家：按保底结算补发；战斗实例独立进程互不影响</text>\n<defs><marker id=\"g14c\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker><marker id=\"g14d\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n</svg>",
    "caption": "图 14b：跨服中立层模型"
   },
   {
    "t": "h",
    "text": "跨服战场：中立层 + 属性快照 + 结果回源"
   },
   {
    "t": "p",
    "text": "跨服 = 引入一个『所有服都能到达的中立层』，把跨服逻辑从单服内存态变成共享态。跨服战场：各服玩家报名后把属性快照 + 玩家路由信息发给独立部署的战斗实例集群，玩家在中心服『虚拟参战』（源服玩家本体不下线，影子方案），结束后结果回源服结算发奖。路由：中心服收到消息按来源服 ID 回推到对应源服（源服 ID 用路由表映射，合服后 oldId → newId 可翻译），源服再推给客户端，客户端无感知。资产单写原则：跨服交互的资产变动仍回源服执行，中心服只产生结果事件；中心服挂了只影响在局玩家——按保底结算（源服超时未收结果按规则补发），战斗实例独立进程互不影响。"
   },
   {
    "t": "h",
    "text": "跨服聊天、排行榜与赛季"
   },
   {
    "t": "p",
    "text": "跨服聊天：中心聊天服集群化 + 按频道分片；各服本地先限流（发言频率、刷屏检测），消息聚合批量转发；敏感词过滤前置到源服减少中心压力。跨服排行榜：全服榜单放 Redis 集群或中心库，各服读写走缓存 + 异步持久化。跨服赛季：赛事按赛季周期（报名 → 分组 → 淘汰/积分 → 结算），匹配走跨服匹配池（按段位/战力分桶，凑齐分配战场实例）；赛季结算必须幂等（按对局结果回源服发奖，防重复领取）；跨服延迟高于单服，玩法设计要容忍（技能命中判定以服务器为准）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 跨服结果回源：路由表翻译 + 幂等结算（示意）\npublic class CrossServerResult {\n    // 战斗服只产出可信结果事件，资产变动永远回源服执行\n    record BattleResult(long battleId, long uid, int srcSid,\n                        int win, String rewards) {}\n    void onBattleResult(BattleResult r) {\n        int realSid = routeTable.translate(r.srcSid()); // 合服路由表 oldId->newId\n        // 幂等：按 battleId 去重，源服未收结果可重发\n        if (!idempotent.save(\"battle:\" + r.battleId(), r)) return;\n        rpcTo(realSid).issueReward(r.uid(), r.rewards(), \"battle:\" + r.battleId());\n    }\n}"
   },
   {
    "t": "table",
    "head": [
     "场景",
     "核心机制",
     "一致性与兜底"
    ],
    "rows": [
     [
      "跨服战场",
      "属性快照 + 影子参战",
      "结果回源服结算，中心服挂了按保底补发"
     ],
     [
      "跨服聊天",
      "中心服集群 + 频道分片",
      "源服本地限流 + 敏感词前置"
     ],
     [
      "跨服排行榜",
      "Redis 集群共享 + 异步持久化",
      "各服读写走缓存，慢查询隔离"
     ],
     [
      "跨服赛季",
      "匹配池撮合 + 战场实例",
      "结算幂等防重复发奖"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "合服前不做前置改造——主键冲突/重名只能在合服当天手忙脚乱",
     "漏改外键表——背包/邮件/好友/公会任一漏改就是幽灵数据",
     "跨服中心服存玩家资产——必须资产单写回源服，中心服只产结果事件",
     "跨服中心服单点——聊天集群分片 + 战场实例独立进程，爆炸半径要小",
     "不停服在线合服——一致性窗口极难控制，主流仍是停服合服"
    ]
   },
   {
    "t": "h",
    "text": "合服后的生态与玩家体验"
   },
   {
    "t": "p",
    "text": "合服不是数据搬完就结束，还要处理『世界重置』带来的体验问题：竞技场/帮派战归属清零（合服公告说明重新争夺）、排行榜重建后的名次变化、物价基准统一（交易行价格以目标服为准）、原服入口保留（玩家从旧入口登录无感进入新服）。配套运营动作：合服活动（回归礼包、双倍经验、充值回馈）留住玩家；重名玩家获得免费改名卡 + 改名通知邮件（通知好友列表）；被合服玩家的已订阅跨服玩法（赛季、约战）做边界处理——约战双方合服后同服则保留、不同跨服组则退还积分。这些细节决定合服的口碑，比数据合并本身更影响留存。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：合服七步（前置改造→停服冻结→数据合并→关系重写→对账→入口切换→回滚），最难是映射表全量改外键；跨服 = 中立层（属性快照 + 结果回源）+ 资产单写 + 路由表翻译；跨服聊天/排行/赛季靠集群分片 + Redis 共享 + 幂等结算。"
   }
  ]
 },
 {
  "id": "game-server-microservice",
  "title": "游戏服微服务化与中台：拆的边界与合的成本",
  "layer": 3,
  "depends": [
   "game-server-arch-overview",
   "game-server-thread-model"
  ],
  "covers": [
   "game-server-01",
   "game-server-14",
   "game-server-16",
   "game-server-23"
  ],
  "quiz": [
   "game-server-14",
   "game-server-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服微服务化不是把玩法拆成十几个服务，而是按『负载特征 + 迭代频率 + 故障爆炸半径』拆成有边界的服务集群：什么时候该拆、拆到什么粒度、服务间怎么通信——这是资深架构师的价值所在。"
   },
   {
    "t": "pre",
    "items": [
     "理解六类服拆分原则（见架构总览）",
     "理解战斗服与功能服拆分（见战斗系统）",
     "理解 Kafka 日志链路（见反外挂/社交）"
    ]
   },
   {
    "t": "h",
    "text": "拆分边界：三个可论证的维度"
   },
   {
    "t": "p",
    "text": "模块拆分有三条可论证的标准，缺一不可。① 负载特征：战斗是高 CPU 热点且需要独立扩缩容（按战场数伸缩），功能逻辑复杂但单玩家压力小——合并在一起要么战斗压垮功能、要么功能拖累战斗；② 迭代频率：功能服（背包、任务、社交）改动频繁，停服迭代不能影响正在打的战斗——隔离后功能服热更/重启不影响战斗进程；③ 故障爆炸半径：战斗服挂了只影响在局玩家，功能服挂了玩家还能打完当前副本，旁路（日志/BI）挂了玩家完全无感。反例是『为微服务而微服务』：把登录拆成 8 个服务、每步一个 RPC，延迟叠加且一致性问题成倍增加。游戏服的铁律：玩家私有的强一致数据留在同一服务内，跨服务只传事件不共享可变状态。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服微服务化：三个边界 + 服务治理</text>\n<rect x=\"30\" y=\"50\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"122\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">核心玩法服务</text>\n<text x=\"122\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">战斗/背包/任务（有状态）</text>\n<rect x=\"230\" y=\"50\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"322\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">公共能力服务</text>\n<text x=\"322\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">登录/支付/排行/匹配（无状态）</text>\n<rect x=\"430\" y=\"50\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"522\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">旁路服务</text>\n<text x=\"522\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">日志/BI/GM（Kafka 解耦）</text>\n<path d=\"M122 120 L122 145 L322 145 L322 120\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g15a)\"/>\n<path d=\"M522 120 L522 145 L322 145 L322 120\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#g15b)\"/>\n<text x=\"322\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">内网 RPC（同步） vs Kafka（异步）</text>\n<rect x=\"30\" y=\"160\" width=\"585\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">服务治理：Nacos 注册发现 + 玩家→进程路由 + 熔断限流 + 全链路 trace</text>\n<text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">网关查路由转发；RPC 带 seqId 异步回调；消息幂等消费</text>\n<rect x=\"30\" y=\"218\" width=\"585\" height=\"64\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">数据中台：游戏库 → 日志库/数仓 → 离线报表，重查询与线上库物理隔离</text>\n<text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">资产变动只在源服务执行（资产单写），跨服务传事件，防双写</text>\n<text x=\"320\" y=\"276\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">扩展 = 开新区 / 战斗服无状态化容器伸缩；缩容 = draining + 存量迁移</text>\n<defs><marker id=\"g15a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker><marker id=\"g15b\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 15：微服务边界与治理"
   },
   {
    "t": "h",
    "text": "服务治理：注册发现、路由与可靠性"
   },
   {
    "t": "p",
    "text": "注册发现：游戏服服务实例注册到 Nacos（或自研注册中心），网关按『玩家 → 进程』映射查路由转发；玩家进跨服/迁场景时路由更新。RPC 协议：内部走 Netty 长连接 + 自定义二进制/Protobuf（比 HTTP 开销小），请求带 seqId 异步回调 Future，支持超时重试；操作幂等（唯一请求 ID），超时后安全重试按 ID 去重。可靠性三板斧：熔断（下游故障快速失败保护上游）、限流（登录洪峰、GM 指令风暴）、降级（非核心功能秒级关闭）。跨服务一致性：能避的分布式事务全避掉——跨玩家操作最终一致性 + 对账，关键资产操作唯一约束兜底 + 幂等消费（Kafka at-least-once + 消费端幂等去重）。"
   },
   {
    "t": "h",
    "text": "消息驱动与数据中台"
   },
   {
    "t": "p",
    "text": "消息驱动是微服务间的粘合剂：游戏服业务代码打行为日志 → 内存队列 → 批量 producer 异步发 Kafka（acks=1 性能与可靠平衡，充值日志 acks=all + 本地流水兜底）→ 按日志类型分 topic、按玩家 ID 做 key 保证同玩家日志有序 → 日志服消费落 ClickHouse/MySQL 日志库（幂等去重）→ BI 服从日志库出报表。快慢解耦的价值：日志服挂 2 小时，Kafka 堆积不丢，恢复后追平，线上无感。数据中台分层：游戏库（OLTP，线上核心）→ 日志库/数仓（OLAP，离线报表、留存、付费漏斗）→ BI 分析，重查询物理隔离在日志库，绝不碰线上库。道具产出消耗日志与资产对账，用于反外挂与事故追溯——日志是旁路，允许延迟不允许阻塞。"
   },
   {
    "t": "h",
    "text": "游戏服演进案例与技术选型"
   },
   {
    "t": "p",
    "text": "典型演进路径：单进程（一切都在一个 JVM，开发快但容量天花板低）→ 分区分服（按区服隔离，开新区扩容，跨服玩法缝合）→ 单区内拆服务（战斗服独立 + 功能服，按负载与迭代频率拆）→ 容器化（战斗服无状态化 + K8s 按战场数伸缩，玩家会话迁移支持动态扩缩）。技术选型参考：注册发现 Nacos、RPC gRPC/Dubbo（游戏内部常自研 Netty 二进制省开销）、消息 Kafka（快慢解耦）、缓存 Redis 集群、存储 MySQL 分片 + ClickHouse 日志、调度 Quartz、配置中心。选型原则是『适配负载特征，不追新』：游戏服对延迟敏感，服务调用链路越短越好——能在一个进程内完成的模块不要拆出去，跨服玩法除外。"
   },
   {
    "t": "h",
    "text": "微服务化的真实代价"
   },
   {
    "t": "p",
    "text": "拆服务要付出的账必须算清：延迟（本地调用 → 网络 RPC，毫秒级增加）、一致性（分布式事务难做，只能最终一致 + 对账）、运维（监控/日志/trace 全链路贯通）、排障（问题跨服务定位变难）。所以正确的问法不是『要不要微服务』，而是『哪块值得拆』：有独立负载特征且需要独立扩缩容的拆（战斗、匹配、日志），有独立迭代节奏的拆（功能服），有安全隔离需求的拆（支付、GM）。玩家私有数据、强一致的玩法逻辑，留在服务内不动。"
   },
   {
    "t": "pits",
    "items": [
     "为微服务而微服务——每步一个 RPC，延迟叠加一致性爆炸",
     "资产双写——跨服务共享可变状态，必须资产单写 + 事件回传",
     "RPC 不做幂等——超时重试会重复扣款，必须唯一请求 ID + 去重",
     "日志同步写进业务线程——快慢解耦被破坏，DB 抖动拖垮玩法",
     "重查询跑线上库——BI 大 SQL 拖垮在线，必须物理隔离"
    ]
   },
   {
    "t": "h",
    "text": "可观测性：微服务排障的基石"
   },
   {
    "t": "p",
    "text": "拆成多个服务后，排障的最大难点是『一次玩家操作经过了哪几个服务』——可观测性三件套必须打通：Metrics（Prometheus：各服务延迟/吞吐/错误率/队列水位，按服务 + 接口打点）、Logs（结构化日志统一格式：traceId + 服务名 + 玩家 ID + 事件类型，落 Kafka 进日志库，全链路检索）、Tracing（全链路 trace：登录请求从网关 → 登录服 → 游戏服 → DB 每跳都带 traceId，SkyWalking/自研埋点，瀑布图看耗时分布）。统一约定：所有 RPC 和消息消费都透传 traceId（MDC 注入日志），跨服务调用在日志里能看到完整链路——线上报『登录慢』，搜 traceId 即可看到耗时在哪一跳。灰度发布与回滚：服务版本化 + 按区服灰度（先一台服观察监控再全量），出问题一键回滚旧版本；配置变更同样走灰度 + 审计。可观测性不是『以后再说』的建设，而是在拆服务的第一天就要埋点——事后补埋点的成本是指数级上升的。"
   },
   {
    "t": "p",
    "text": "技术选型的最终检验是『换人也能维护』：游戏服团队流动快，核心框架要选团队熟悉、文档社区充足的组件（Netty/Spring Boot/MyBatis-Plus/Redis/Kafka），自研组件必须控制数量并写清设计文档——为省一个依赖自研的队列中间件，往往是三年运维噩梦的开始。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：拆服务按『负载特征/迭代频率/爆炸半径』三条边界，玩家强一致数据留在服务内；治理靠 Nacos 路由 + RPC 幂等 + 熔断限流降级；Kafka 做快慢解耦 + 对账；数据中台与线上物理隔离；演进路径 = 单进程 → 分服 → 拆服务 → 容器化，选型适配负载不追新。"
   }
  ]
 },
 {
  "id": "game-server-arch-interview",
  "title": "架构设计面试深水区：设计题套路与容量估算",
  "layer": 3,
  "depends": [
   "game-server-net-comm",
   "game-server-combat",
   "game-server-merge-cross"
  ],
  "covers": [
   "game-server-05",
   "game-server-36",
   "game-server-14",
   "game-server-23"
  ],
  "quiz": [
   "game-server-36"
  ],
  "body": [
   {
    "t": "lead",
    "text": "『给我设计一个游戏服务器』是资深职位的必考题：面试官看的不是标准答案，而是你有没有套路——拆职责、定状态边界、选同步模型、算容量、讲权衡，五步走下来，深度自然显现。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握本分类全部核心知识（架构/通信/数据/战斗/AOI/合服）",
     "对 JUC、Netty、Redis、MySQL 有实战经验",
     "理解『任何设计都是取舍』"
    ]
   },
   {
    "t": "h",
    "text": "设计题的五步套路：一个可复用的框架"
   },
   {
    "t": "p",
    "text": "拿到任何游戏架构设计题，按五步走，缺一不可：① 拆职责——按实时性 + 爆炸半径把系统拆成服/模块，先画边界（登录/游戏/跨服/旁路）；② 定状态边界——每块服务是『有状态的（持有玩家内存态）』还是『无状态的（可任意伸缩）』，这决定了扩容方式和故障影响面；③ 选同步模型——长连接还是短连接、帧同步还是状态同步，依据是『有没有局的边界』与『防外挂要求』；④ 一致性方案——资产单写原则、流水对账、幂等重试，先讲清楚『哪些数据可丢、哪些不可丢』；⑤ 容量估算——把在线数换算成带宽、CPU、DB QPS、Redis 内存，给出数量级结论。最后永远补一句权衡：这个方案在什么场景下不成立、代价是什么。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">设计题五步框架：拆职责 → 定边界 → 选模型 → 定一致 → 算容量</text>\n<g font-size=\"12\">\n<rect x=\"25\" y=\"55\" width=\"110\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"80\" y=\"80\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">① 拆职责</text>\n<text x=\"80\" y=\"100\" text-anchor=\"middle\" fill=\"var(--muted)\">实时性+爆炸半径</text>\n<text x=\"80\" y=\"116\" text-anchor=\"middle\" fill=\"var(--muted)\">先画服/模块边界</text>\n<rect x=\"155\" y=\"55\" width=\"110\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"210\" y=\"80\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">② 定边界</text>\n<text x=\"210\" y=\"100\" text-anchor=\"middle\" fill=\"var(--muted)\">有状态 vs 无状态</text>\n<text x=\"210\" y=\"116\" text-anchor=\"middle\" fill=\"var(--muted)\">决定扩容与故障面</text>\n<rect x=\"285\" y=\"55\" width=\"110\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"340\" y=\"80\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">③ 选模型</text>\n<text x=\"340\" y=\"100\" text-anchor=\"middle\" fill=\"var(--muted)\">长短连接/同步方式</text>\n<text x=\"340\" y=\"116\" text-anchor=\"middle\" fill=\"var(--muted)\">依据：局边界+防外挂</text>\n<rect x=\"415\" y=\"55\" width=\"110\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"80\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">④ 定一致</text>\n<text x=\"470\" y=\"100\" text-anchor=\"middle\" fill=\"var(--muted)\">资产单写+流水对账</text>\n<text x=\"470\" y=\"116\" text-anchor=\"middle\" fill=\"var(--muted)\">讲清可丢/不可丢</text>\n<rect x=\"545\" y=\"55\" width=\"75\" height=\"70\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"582\" y=\"80\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">⑤ 算容量</text>\n<text x=\"582\" y=\"100\" text-anchor=\"middle\" fill=\"var(--muted)\">带宽/CPU/DB</text>\n<text x=\"582\" y=\"116\" text-anchor=\"middle\" fill=\"var(--muted)\">数量级结论</text>\n</g>\n<path d=\"M135 90 L155 90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g16a)\"/>\n<path d=\"M265 90 L285 90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g16a)\"/>\n<path d=\"M395 90 L415 90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g16a)\"/>\n<path d=\"M525 90 L545 90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#g16a)\"/>\n<rect x=\"25\" y=\"150\" width=\"595\" height=\"40\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">容量估算基准（记住数量级，别背精确值）</text>\n<text x=\"320\" y=\"188\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单玩家移动同步约 50B/包；同屏50人10Hz≈25KB/s；万人在线≈业务线程数百/秒/玩家</text>\n<rect x=\"25\" y=\"205\" width=\"595\" height=\"72\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"227\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">最高分答案的最后一句永远是『权衡』</text>\n<text x=\"320\" y=\"247\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">这个方案在什么场景不成立？代价是什么？为什么不像主流那样选另一种？</text>\n<text x=\"320\" y=\"265\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">例：帧同步省带宽但防外挂弱——MOBA 用、MMORPG 不用，是场景决定不是技术好坏</text>\n<defs><marker id=\"g16a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 16：设计题五步框架"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">容量估算示例：1 万人在线的数量级推算</text>\n<rect x=\"30\" y=\"48\" width=\"580\" height=\"30\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">假设：DAU 3 万，峰值同时在线 1 万，单玩家下行 25KB/s（同屏 50 人 × 10Hz）</text>\n<g font-size=\"12\">\n<rect x=\"30\" y=\"92\" width=\"185\" height=\"76\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"122\" y=\"112\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">带宽</text>\n<text x=\"122\" y=\"134\" text-anchor=\"middle\" fill=\"var(--muted)\">1 万 × 25KB/s ≈ 250MB/s</text>\n<text x=\"122\" y=\"154\" text-anchor=\"middle\" fill=\"var(--muted)\">≈ 2Gbps 峰值，机房按 3~5 倍冗余</text>\n<rect x=\"230\" y=\"92\" width=\"185\" height=\"76\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"112\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">登录洪峰</text>\n<text x=\"322\" y=\"134\" text-anchor=\"middle\" fill=\"var(--muted)\">首 30 分钟 3000 登录 ≈ 100/s</text>\n<text x=\"322\" y=\"154\" text-anchor=\"middle\" fill=\"var(--muted)\">DB 玩家加载 QPS 100~200（限流上限）</text>\n<rect x=\"430\" y=\"92\" width=\"185\" height=\"76\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"522\" y=\"112\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"var(--ink)\">Redis</text>\n<text x=\"522\" y=\"134\" text-anchor=\"middle\" fill=\"var(--muted)\">在线标记 1 万 key + 排行榜</text>\n<text x=\"522\" y=\"154\" text-anchor=\"middle\" fill=\"var(--muted)\">ZSet 千万级 member ≈ 几百 MB~1GB</text>\n</g>\n<rect x=\"30\" y=\"186\" width=\"580\" height=\"40\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">业务线程：1 万在线 ÷ 每线程 200~500 玩家（串行模型）≈ 20~50 条业务线程，按核数 ×2 起步</text>\n<text x=\"320\" y=\"222\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">结论：瓶颈在带宽/DB 加载而非连接数——这是『裁广播 + 预加载 + 限流』的设计依据</text>\n<rect x=\"30\" y=\"240\" width=\"580\" height=\"36\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">开服容量 = 压测拐点在线数 × 0.6~0.7 冗余系数，留出活动峰值与故障缓冲</text>\n</svg>",
    "caption": "图 16b：容量估算数量级推算"
   },
   {
    "t": "h",
    "text": "设计一个游戏服务器（1 万人同时在线）"
   },
   {
    "t": "p",
    "text": "按五步展开：① 拆职责——登录服（无状态，验账号发 token 指路）+ 游戏服（有状态，核心玩法 + 玩家内存态）+ 跨服中心服（跨服玩法）+ 日志/BI（Kafka 旁路）+ GM 通道；② 状态边界——游戏服持有玩家内存态（不可随意伸缩，扩容靠开新区），登录服/匹配服无状态可水平扩展；③ 同步模型——长连接 + 状态同步 + 服务器权威（MMORPG 无局边界）；④ 一致性——内存为准 + dirty 定时落地 + 流水兜底，资产单写；⑤ 容量估算——万人在线按 10% 同屏聚集估算广播压力，DB 按登录洪峰 500~1000 连接/秒算 QPS，Redis 按在线标记/排行榜/ZSet 内存算，给出『拐点 × 0.6~0.7 冗余』的开服容量。最后补权衡：单区一万人的方案靠 AOI + 降频兜底，若玩法要求高同屏密度则要拆场景进程。"
   },
   {
    "t": "h",
    "text": "设计登录链路（开服洪峰）"
   },
   {
    "t": "p",
    "text": "开服瞬间数千连接/秒登录，链路设计：CDN/网关层（限流 + 静态区服列表）→ 登录服（验账号，无状态集群，抗洪峰靠水平扩展 + 令牌桶限流）→ Redis（会话 token + 在线标记，防顶号）→ 游戏服（DB 玩家数据加载，瓶颈通常在这里——缓存预热 + 批量预载 + 分片并行加载）。关键权衡：token 双段签发（登录服签、游戏服验，游戏服无状态校验）；登录服挂机期间已在线玩家不受影响（长连接在游戏服）；洪峰时非核心登录奖励异步发放（先放行后补发）。"
   },
   {
    "t": "h",
    "text": "设计跨服玩法与世界服"
   },
   {
    "t": "p",
    "text": "跨服玩法：中立层 + 属性快照 + 结果回源（玩家本体不下线影子参战），路由表翻译源服 ID（合服可迁移），结算幂等。世界服（无缝大地图）：多场景进程 + AOI（九宫格/十字链表）+ 场景分线 + 玩家跨场景迁移（进程间会话迁移 + 快照加载）；世界服容量不靠单机，靠『场景维度切分 + 分线 + 战斗实例化』。两者共同点：有状态的部分（玩家/场景）不可随意丢，无状态的部分（匹配/战场实例）可弹性伸缩——状态边界决定架构弹性。"
   },
   {
    "t": "h",
    "text": "权衡表达：面试官真正想听的东西"
   },
   {
    "t": "p",
    "text": "设计题的加分项永远是『主动讲权衡』：帧同步 vs 状态同步——选型依据是局边界与防外挂需求，不是技术好坏；单线程处理玩家——拿并发换无锁，跨玩家操作要付出串行化/加锁代价；Redis 当缓存不当账本——拿强可靠换性能，资产必须 MySQL；拆服务 vs 单进程——拿运维复杂度和延迟换扩缩容弹性；合服停服 vs 在线——拿停机时长换一致性可控。表达公式：『这里我选了 A，因为 B 场景下 C 更重要；A 的代价是 D，所以补了 E 来兜底』——有取舍、有代价、有兜底，就是资深与初级的差距。"
   },
   {
    "t": "pits",
    "items": [
     "背一套标准答案不按场景适配——设计题没有唯一解，考官看的是推理链",
     "只讲拆组件不讲状态边界——『哪些有状态哪些无状态』才是弹性与故障面的关键",
     "不做容量估算——必须把在线数换算成带宽/DB QPS/Redis 内存的数量级",
     "回避权衡——只讲好处不讲代价是初级表现，主动讲取舍才显资深",
     "忽略故障场景——面试官追问『中心服挂了/DB 慢了』时，预案决定成败"
    ]
   },
   {
    "t": "h",
    "text": "表达技巧：把答案讲成推理过程"
   },
   {
    "t": "p",
    "text": "同样的方案，表达方式决定评分。三个技巧：① 先给结论再展开——『我选状态同步，因为 MMORPG 无局边界』，考官立刻抓住你的判断；② 用数字说话——『同屏 100 人，单玩家下行约 250KB/s，所以必须 AOI 裁剪』，数量级让方案显得可落地；③ 主动暴露权衡——『这里我选了 Redis 当缓存，代价是资产强可靠需要 MySQL 兜底，所以补了流水对账』，考官追问的往往是权衡点，主动讲比被追问体面得多。面试官还爱做压力测试：你说『单线程处理玩家』，他追问『那跨玩家交易怎么办』——预案要在心里预演一遍，把本分类的坑列表当追问清单过一遍，基本没有死角。"
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：设计题五步框架 = 拆职责 → 定状态边界 → 选同步模型 → 定一致性方案 → 算容量，最后补权衡；容量估算记数量级不背精确值；权衡表达公式 = 选 A 的理由 + A 的代价 + 兜底方案 E——有取舍、有代价、有兜底，是资深架构师与初级的分水岭。"
   }
  ]
 }
]
};
