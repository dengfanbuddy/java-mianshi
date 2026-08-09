window.TB = window.TB || {};
window.TB["resume-deepdive"] = {
  id: "resume-deepdive",
  name: "简历深挖与项目追问",
  icon: "🔍",
  nodes: [
 {
  "id": "resume-deepdive-self-intro",
  "title": "自我介绍与简历主线：30 秒 / 1 分钟 / 3 分钟逐字稿",
  "layer": 0,
  "depends": [],
  "covers": [
   "resume-deepdive-01",
   "resume-deepdive-05"
  ],
  "quiz": [
   "resume-deepdive-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "自我介绍不是简历复读，而是『立人设 + 埋钩子』的销售话术——你抛出的每一个关键词，都是等着面试官咬钩的饵。核心目标只有一个：把面试节奏带向你最有把握的战场。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉简历上每一条经历，能随口讲出数字与自己在其中的角色",
     "理解目标岗位 JD 的关键词（高并发、长连接、稳定性、微服务……）",
     "准备好 3 个『高光故事』，每个都能用 STAR 讲 2~3 分钟"
    ]
   },
   {
    "t": "h",
    "text": "核心认知：自我介绍 = 钓鱼，不是填表"
   },
   {
    "t": "p",
    "text": "10 年经验的自我介绍，如果还按『我叫邓凡，毕业于 XX，做过几个项目』的简历顺序讲，等于把最宝贵的黄金 3 分钟浪费在面试官已经读过的东西上。面试官手上有简历，他要听的不是信息复述，而是三样东西：① 你给自己贴的标签是什么（立人设）；② 你最想让 TA 追问什么（埋钩子）；③ 你的表达是否有结构感（10 年经验的成熟度）。所以自我介绍的正确姿势是『先立人设、再抛钩子』：把最亮眼的 2~3 段经历用一句话各带一个数字讲出来，然后故意把『全链路』『统一抽象』『高并发』这类词收住不展开，等着面试官来追问——追问的每一题都是你精心准备过的，节奏就永远在你手里。"
   },
   {
    "t": "h",
    "text": "30 秒版：电梯间版（初面开场/被临时要求简短介绍）"
   },
   {
    "t": "p",
    "text": "30 秒版只讲三件事：我是谁 + 我最大价值是什么 + 我为什么适合这个岗位。不展开任何项目细节，最后一定要留一个钩子。语速放慢，全程像聊天不像背稿。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 30 秒自我介绍逐字稿（约 90 字，控制在 25~30 秒）\n// 「面试官你好，我是邓凡，10 年 Java 游戏服务器开发，\n//  完整经历过 merge 类、卡牌、MMORPG 三类项目的上线与维护。\n//  近一款女性向 merge 游戏，我负责从登录服、游戏服到日志服的全链路架构。\n//  今天想重点和您聊聊我在这套高并发链路里的几个关键设计，比如支付幂等和日志削峰。」"
   },
   {
    "t": "h",
    "text": "1 分钟版：标准三段式"
   },
   {
    "t": "p",
    "text": "1 分钟版用『一句话定位 + 两段高光 + 一个收口』。高光只讲最近两个项目，每个 2~3 句带数字。收口落到『今天想深入聊的方向』，把主动权交出去。"
   },
   {
    "t": "list",
    "items": [
     "第一句定位：『我是邓凡，10 年 Java 游戏服务器开发，从登录、支付到日志、BI 的全链路都完整做过闭环。』",
     "第一段高光（merge 项目）：『最近一款女性向 merge 游戏，我负责全链路架构，核心是支付幂等、Kafka 日志削峰和 GM 后台重构，把运营新功能交付周期从 3 天压到半天。』",
     "第二段高光（卡牌项目）：『之前做卡牌游戏渠道接入，抽象了统一登录/支付网关，接了 N 个渠道，新渠道接入从一周缩到 1~2 天。』",
     "收口：『今天想重点聊聊我在高并发游戏服上的线程模型和中间件实战。』——把话题引向自己最稳的区域"
    ]
   },
   {
    "t": "h",
    "text": "3 分钟版：完整立人设（题库 resume-deepdive-01 的标准答案）"
   },
   {
    "t": "p",
    "text": "3 分钟版按『一句话定位 → 三段高光（每段 2~3 句带数字）→ 技术关键词收口』展开。三段高光对应你三个最有代表性的项目阶段：最近的全链路负责人、中期的渠道统一抽象、早期的 MMORPG 战斗服与状态同步。每个项目只讲『项目是什么 + 我做了什么 + 一个数字』，绝不深入技术细节——细节留给你抛的钩子。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">自我介绍三段式：立人设 → 抛高光 → 埋钩子</text>\n<rect x=\"30\" y=\"46\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 一句话定位（15 秒）</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">10 年 Java 游戏服务器 · merge/卡牌/MMORPG · 全链路闭环</text>\n<path d=\"M320 102 L320 120\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#si1)\"/>\n<rect x=\"30\" y=\"120\" width=\"580\" height=\"74\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"142\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 三段高光（2 分钟，每段 2~3 句 + 一个数字）</text>\n<text x=\"60\" y=\"166\" font-size=\"12\" fill=\"var(--ink)\">· merge：全链路架构 + 支付幂等 + GM 重构（交付 3 天→半天）</text>\n<text x=\"60\" y=\"186\" font-size=\"12\" fill=\"var(--ink)\">· 卡牌：渠道统一网关，N 渠道接入 1 周→1~2 天</text>\n<path d=\"M320 194 L320 212\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#si1)\"/>\n<rect x=\"30\" y=\"212\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"234\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 技术关键词收口（15 秒，只抛不展开）</text>\n<text x=\"320\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty · Disruptor · Redis 集群 · Kafka 削峰 —— 等面试官咬钩</text>\n<rect x=\"30\" y=\"286\" width=\"580\" height=\"28\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"305\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">钩子法则：抛 3 个饵（全链路/统一抽象/高并发），追问的每一题你都有备而来</text>\n<defs><marker id=\"si1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：自我介绍三段式结构与时间分配"
   },
   {
    "t": "h",
    "text": "主线逻辑：让十年经历听起来是一条线，而不是四段拼盘"
   },
   {
    "t": "p",
    "text": "跳槽多次的资深候选人，最怕被听成『每个项目都浅尝辄止』。破解方法是给十年经历一条主线：我始终在做同一件事——『把游戏服务器的链路越做越完整、并发越做越大』。按这条主线讲：早期在 MMORPG 做战斗服与状态同步（攒网络与并发基本功）→ 中期做卡牌渠道接入（沉淀抽象与业务理解）→ 近期做 merge 全链路（把网络、存储、消息、资金全部串起来）。每条经历之间用『因为我想接触更完整的链路，所以选择了下一段』来衔接，跳槽就从散点变成了成长轨迹。"
   },
   {
    "t": "h",
    "text": "亮点提炼三原则：数字、独特性、可被追问"
   },
   {
    "t": "list",
    "items": [
     "有数字：每个亮点至少带一个可解释来源的数字（在线量级、QPS、人力缩短、错误率下降），数字准备好『来源 + 口径』两层",
     "有独特性：选『别人没做过的』而非『大家都会的』——比如渠道统一抽象、导表/协议工具链、GM 基座重构，这些是别人简历上少见的工程资产",
     "可被追问：选亮点时必须自问『面试官追问一句我能答上来吗』，答不上来的亮点宁可不讲，讲了被挖穿就是减分"
    ]
   },
   {
    "t": "h",
    "text": "与岗位匹配：把 JD 关键词翻译成你的钩子"
   },
   {
    "t": "p",
    "text": "面试前把 JD 里的能力要求圈出来，逐个在你的经历里找到对应物，然后把它做成钩子放进自我介绍。比如 JD 写『熟悉 NIO 网络框架』，你就讲『Netty 长连接、IO 线程不做业务的纪律』；JD 写『有高并发系统经验』，你就讲『开服尖峰 QPS、玩家级串行、Kafka 削峰』；JD 写『熟悉微服务』，你就诚实说『游戏服拆服务 + 空窗期用学习项目跑通 Nacos/Dubbo 全家桶』。匹配不是编造，是把你已有的东西用对方的语言再说一遍。"
   },
   {
    "t": "table",
    "head": [
     "版本",
     "时长",
     "结构",
     "适用场景"
    ],
    "rows": [
     [
      "30 秒",
      "25~30 秒",
      "定位 + 最大价值 + 钩子",
      "初面开场、被临时要求简短介绍"
     ],
     [
      "1 分钟",
      "55~65 秒",
      "定位 + 两段高光 + 收口",
      "常规一面开场"
     ],
     [
      "3 分钟",
      "2~3 分钟",
      "定位 + 三段高光 + 关键词收口",
      "二面/终面、面试官明确说『详细讲讲』"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "从头到尾复述简历——面试官刚读完你的简历，复述等于没答",
     "超过 3 分钟不刹闸——10 年经验内容多，但收不住时间反而暴露表达短板",
     "只讲技术不讲项目价值——面试官要的是『你解决了什么业务问题』，不是『你用了什么框架』",
     "钩子抛完不接住——抛出『全链路』后必须马上准备好一段能讲 5 分钟的追问答案，否则钩子变成破绽",
     "语速过快不给插话缝隙——自我介绍应该像聊天，停顿给面试官追问的空间"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：自我介绍 = 一句话定位 + 三段带数字的高光 + 三个待追问的钩子。30 秒/1 分钟/3 分钟三版逐字稿背熟但不背死，主线用『把链路做完整』串起十年，亮点按『数字、独特、可追问』三原则筛，最后把 JD 关键词翻译成自己的钩子——节奏永远在你这。"
   }
  ]
 },
 {
  "id": "resume-deepdive-project-story",
  "title": "项目讲述方法论：STAR 法则与『背景-难点-方案-量化』四段式",
  "layer": 0,
  "depends": [],
  "covers": [
   "resume-deepdive-02",
   "resume-deepdive-18"
  ],
  "quiz": [
   "resume-deepdive-02"
  ],
  "body": [
   {
    "t": "lead",
    "text": "项目讲述的核心不是『做过什么』，而是『在什么背景下、解决了什么难点、做了什么决策、带来什么量化结果』——面试官用追问验证细节，你只有把故事讲成经得起刨的四段式，才能把追问变成展示。"
   },
   {
    "t": "pre",
    "items": [
     "准备好 3~4 个可深入讲的项目故事（全链路架构、支付、GM 重构、线上事故）",
     "理解 STAR 四要素：Situation/Task/Action/Result 的比例约为 10%/10%/60%/20%",
     "掌握『引导性结尾』：每讲完一个故事留一个钩子，把面试官引向你擅长的子主题"
    ]
   },
   {
    "t": "h",
    "text": "为什么 STAR 是面试官默认的评分框架"
   },
   {
    "t": "p",
    "text": "行为面试（Behavioral Interview）已经被验证是预测候选人未来表现最有效的手段，而 STAR 是其核心编码标准：面试官通过你过去的具体行为（而不是你的自我评价）来判断你的能力。S（情境）交代背景与舞台，T（任务）定义目标与挑战，A（行动）占回答 60% 左右的时间、必须用『我』做主语的动词，R（结果）用数据证明价值。面试官在听的时候大脑里就在做四件事：你的行动可不可信？你个人贡献有多大？结果是不是真的？再追问几个细节就能戳穿吗？所以你的故事必须在这四个维度上都扎实。"
   },
   {
    "t": "h",
    "text": "游戏服务器场景的 STAR 拆解（以 merge 全链路架构为例）"
   },
   {
    "t": "list",
    "items": [
     "S 情境（1~2 句）：『项目是女性向 merge 游戏，玩家在线几万人，操作频次高，支付是收入命脉，日志量每天上亿条。』——给出量级与业务属性",
     "T 任务（1~2 句）：『我需要把登录、游戏、支付、日志、BI、GM 六个服务拆清楚边界，保证开服尖峰不崩、支付不丢单、日志不拖慢主流程。』——明确你的职责边界",
     "A 行动（占 60%，讲 3 个关键决策）：① 按『在线实时流量与离线准实时流量分离』拆服务；② 支付链路做幂等 + 掉单补偿三层兜底；③ 日志走 Kafka 异步削峰。每个决策都讲『为什么这么选、放弃了什么』",
     "R 结果（2~3 句带数据）：『开服尖峰登录 QPS 支撑住了，支付零资损，日志积压归零，运营新功能交付从 3 天缩到半天。』——数据要能讲来源"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 项目讲述的『引导性结尾』模板——讲完故事立刻抛钩子\n// 场景：讲完 merge 全链路架构的拆服务决策后\n//\n// 「当时最纠结的是支付要不要单独拆成购买服，\n//  最后我拍板拆——理由有两个：一是支付要对接外部渠道、要求强一致；\n//  二是回调风暴来了不能拖垮游戏主流程。\n//  这个决策背后其实是一整套幂等和补偿设计，\n//  如果面试官您感兴趣，我可以把支付掉单和补偿的细节展开讲讲。」\n//\n// 效果：把『你被问到哪讲到哪』变成『你引着面试官往你最熟的地方走』"
   },
   {
    "t": "h",
    "text": "四段式：背景-难点-方案-量化结果（比 STAR 更聚焦『技术深度』）"
   },
   {
    "t": "p",
    "text": "技术面讲项目时，面试官真正想听的是难点和方案之间的逻辑链。四段式的关键在第二段『难点』——难点定义得越具体，你的方案越显价值。不要把难点说成『并发高』这种空话，要说成『开服当天登录 QPS 是平时的 20 倍，登录服和游戏服之间 token 校验平均耗时 80ms 成为瓶颈』。方案段不要只讲『用了 Redis』，要讲『为什么选 Redis 而不是本地缓存：因为要跨服共享 + 要 TTL 自动过期』——每个选择都有理由，理由里有权衡，权衡里才有经验。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">项目故事四段式：背景 → 难点 → 方案 → 量化结果</text>\n<rect x=\"30\" y=\"46\" width=\"130\" height=\"170\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 背景</text>\n<text x=\"95\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">量级 + 业务属性</text>\n<text x=\"95\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">玩家几万</text>\n<text x=\"95\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">操作高频</text>\n<text x=\"95\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">支付是命脉</text>\n<text x=\"95\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">日志上亿条</text>\n<text x=\"95\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">1~2 句交代舞台</text>\n<rect x=\"176\" y=\"46\" width=\"130\" height=\"170\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"241\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 难点</text>\n<text x=\"241\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">越具体越值钱</text>\n<text x=\"241\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">开服尖峰 20 倍</text>\n<text x=\"241\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">回调风暴</text>\n<text x=\"241\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">日志拖慢主流程</text>\n<text x=\"241\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">别只说『并发高』</text>\n<rect x=\"322\" y=\"46\" width=\"130\" height=\"170\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"387\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 方案</text>\n<text x=\"387\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">决策 + 权衡</text>\n<text x=\"387\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">服务边界三刀切</text>\n<text x=\"387\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">幂等 + 三层补偿</text>\n<text x=\"387\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Kafka 异步削峰</text>\n<text x=\"387\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">每个选择都有理由</text>\n<rect x=\"468\" y=\"46\" width=\"142\" height=\"170\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"539\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 量化结果</text>\n<text x=\"539\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">能讲来源的数字</text>\n<text x=\"539\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">QPS 支撑住</text>\n<text x=\"539\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">支付零资损</text>\n<text x=\"539\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">积压归零</text>\n<text x=\"539\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">交付 3 天→半天</text>\n<text x=\"539\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">数字要有口径</text>\n<path d=\"M160 131 L176 131\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#ps1)\"/>\n<path d=\"M306 131 L322 131\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#ps1)\"/>\n<path d=\"M452 131 L468 131\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#ps1)\"/>\n<rect x=\"30\" y=\"232\" width=\"580\" height=\"76\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">时间分配纪律</text>\n<text x=\"320\" y=\"276\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">背景 10% + 难点 10% + 方案 60% + 量化 20%——方案永远是主角</text>\n<text x=\"320\" y=\"298\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">引导性结尾：讲完立刻抛钩子，把追问引向你最熟的子主题</text>\n<defs><marker id=\"ps1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 2：项目故事四段式与时间分配"
   },
   {
    "t": "h",
    "text": "怎么引导面试官问自己擅长的"
   },
   {
    "t": "p",
    "text": "引导的本质是『预埋话题』。三个实操手法：① 结尾抛钩子——『这套设计里我最想展开的是 X』，直接把下个问题的候选范围圈住；② 讲方案时给『关键词密度』——提到 Disruptor 就顺带说『玩家级串行』，提到 Redis 就顺带说『排行榜热 key 治理』，多给面试官可抓的词；③ 准备 3 个『万能弹药』——无论面试官从哪个项目切入，都能绕回你最强的两个主题（网络层/并发与资金链路）。注意引导不是躲题，面试官问别的必须正面接招，引导只是让分支话题往你优势区汇聚。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 引导性讲法的『关键词预埋』示范（注意每句末尾都在给追问素材）\n// 「登录这块我核心做了三件事：\n//  一是渠道 token 统一校验，用适配器收敛了 N 个渠道差异；\n//  二是玩家级串行，用 Disruptor 哈希定槽保证同一玩家请求有序；\n//  三是防重放，token 带时间戳 + HMAC，短 TTL。\n//  其中 Disruptor 的玩家级串行模型，其实和 actor 的 mailbox 是同一个思想，\n//  这块如果想深入聊我可以把实现细节讲一讲。」\n//\n// 面试官大概率会选：Disruptor 串行 / token 防重放 / 渠道适配器——三选一都是你的主场"
   },
   {
    "t": "pits",
    "items": [
     "全程说『我们』不说『我』——面试官聘的是你，行动段必须用『我』做主语",
     "难点说成『并发高』『数据量大』这种空话——要把难点量化成具体数字和具体冲突",
     "方案只报技术名词没有权衡——『用了 Redis』不如『为什么选 Redis 不选本地缓存』",
     "结果没有数据或数据说不出来源——提前准备『口径 + 来源 + 反推锚点』",
     "故事讲完没有钩子就结束——结尾抛一个『我最想展开的是 X』，把追问引入主场"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：STAR 是面试官默认的评分框架（S/T/A/R 约 10/10/60/20），四段式是技术面的讲法升级——难点量化、方案讲权衡、结果带口径；引导靠结尾抛钩子 + 关键词预埋 + 三个万能弹药。把故事练到『经得起三次追问』，追问就是你的主场。"
   }
  ]
 },
 {
  "id": "resume-deepdive-login-server",
  "title": "登录服项目深挖：登录流程、并发尖峰、安全与 session 管理",
  "layer": 1,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-project-story"
  ],
  "covers": [
   "resume-deepdive-02",
   "resume-deepdive-10",
   "resume-deepdive-19"
  ],
  "quiz": [
   "resume-deepdive-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "登录服是面试官最常深挖的第一站：它把渠道接入、token 校验、并发尖峰、session 管理、防重放五个技术点串成一条链路，也是最容易被连续追问出真伪的地方——因为每个环节都有『为什么这么设计』的决策逻辑。"
   },
   {
    "t": "pre",
    "items": [
     "清楚登录服在整个架构里的位置：独立服务，扛流量尖峰入口",
     "理解渠道登录抽象（适配器模式 + 账号映射），见题库 resume-deepdive-10",
     "掌握 token 防重放、session TTL、负载均衡的基本原理"
    ]
   },
   {
    "t": "h",
    "text": "登录主流程：一条链路上五个关键环节"
   },
   {
    "t": "p",
    "text": "标准游戏登录流程：客户端从渠道 SDK 拿 code/token → 登录服拿着它调渠道官方接口二次校验（不信任客户端）→ 校验通过后映射内部账号（渠道 uid + channelId → accountId）→ 登录服签发进入游戏服的 ticket/token → 分配一个负载最轻的游戏服给客户端 → 客户端拿 ticket 到游戏服建长连接，游戏服验签后放行。整条链路里，登录服承担的是『验证 + 签发 + 路由』三个职责，所有环节都不能被绕过——尤其是『二次校验』：渠道 token 必须由服务端调渠道方接口或验签确认，绝不能信任客户端直传的 uid，这是防伪登录的生命线。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 360\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">登录服主流程：验证 → 映射 → 签发 → 路由 → 放行</text>\n<rect x=\"30\" y=\"44\" width=\"120\" height=\"40\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">客户端</text>\n<rect x=\"180\" y=\"44\" width=\"120\" height=\"40\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"240\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">渠道 SDK</text>\n<text x=\"240\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">华为/小米/应用宝</text>\n<rect x=\"330\" y=\"44\" width=\"130\" height=\"40\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"395\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">登录服</text>\n<rect x=\"490\" y=\"44\" width=\"120\" height=\"40\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"550\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">游戏服</text>\n<path d=\"M150 64 L180 64\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#lg1)\"/>\n<text x=\"165\" y=\"54\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">① code</text>\n<path d=\"M240 84 L240 110 L330 110 L330 84\" stroke=\"var(--line)\" stroke-width=\"1.8\" marker-end=\"url(#lg1)\"/>\n<text x=\"285\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">② 调官方接口二次校验</text>\n<rect x=\"180\" y=\"120\" width=\"440\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"400\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">③ 校验通过 → 映射内部账号 (channelId, channelUid) → accountId</text>\n<text x=\"400\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">对内只认 accountId，渠道细节不外泄，多渠道可绑定/迁移</text>\n<path d=\"M395 84 L395 120\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#lg1)\"/>\n<rect x=\"180\" y=\"196\" width=\"200\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"280\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">④ 签发 ticket + 分配游戏服</text>\n<text x=\"280\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ticket 带账号+时间戳+HMAC 签名</text>\n<rect x=\"420\" y=\"196\" width=\"200\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">⑤ 客户端持 ticket 建长连接</text>\n<text x=\"520\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服验签 + 时效校验后放行</text>\n<path d=\"M280 224 L420 224\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#lg1)\"/>\n<rect x=\"30\" y=\"280\" width=\"580\" height=\"62\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"302\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">安全红线：三个『绝不』</text>\n<text x=\"320\" y=\"324\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">绝不信任客户端直传 uid · token 绝不不过期 · 密钥绝不硬编码进代码库</text>\n<defs><marker id=\"lg1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 3：登录服五环节主流程"
   },
   {
    "t": "h",
    "text": "并发尖峰：开服/活动推送时登录 QPS 暴涨怎么扛"
   },
   {
    "t": "p",
    "text": "登录服拆成独立服务最核心的理由就是『流量尖峰隔离』：开服、活动推送、主播带量时登录 QPS 可以瞬间是平时的 20 倍，如果和游戏主流程共用服务，尖峰会把在线玩家也拖崩。扛尖峰的实战手段按顺序讲：① 登录服无状态化，水平加机器——因为登录服不持有玩家游戏状态，可以随便扩；② 接入层限流排队——超限的登录请求进队列或直接返回『稍后重试』，宁可排队不可打崩；③ 渠道校验走连接池 + 超时控制，渠道接口慢不拖垮整个登录服，必要时老玩家降级（凭缓存的历史验证记录短窗口放行 + 告警）；④ 全链路压测——用模拟客户端按真实协议打登录服，找出 CPU/GC/延迟拐点，生产再打七折留余量。面试官追问『你的登录尖峰 QPS 多少』时，答案要有锚点：『我记得活动峰值那周登录 QPS 大概 X，因为当时我们把登录服从 4 个实例紧急扩到了 8 个。』"
   },
   {
    "t": "h",
    "text": "session 管理与防重放"
   },
   {
    "t": "p",
    "text": "session 的正确设计是『无状态 + 短时效 + 可重发』：token/ticket 里带上账号 + 时间戳 + HMAC 签名，密钥只存在服务端、定期轮换，不落库即天然无状态、水平扩容零成本。防重放靠『时间窗 + 一次性』：ticket 短 TTL（如 2 分钟），加序列号或已用标记，过期或已用即拒绝。game server 建连接时验签 + 校验时效，之后玩家保持长连接，session 就升级成连接本身——断线重连走『重连票据』或客户端上报版本号比对。这块最容易暴露的坑是『token 不过期』和『密钥硬编码』，主动讲出这两个反例反而加分。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 登录 ticket 签发示意（无状态、防重放）——只演示结构，密钥严禁硬编码\npublic class LoginTicket {\n    // 字段：accountId + 签发时间戳 + 随机序列号\n    // payload = accountId + \".\" + System.currentTimeMillis() + \".\" + nonce\n    // ticket  = payload + \".\" + hmacSha256(payload, secretKey)   // secretKey 放配置中心/密钥服务\n    //\n    // 游戏服验签三步：\n    //  1) 拆出 payload 与签名，用同一 secretKey 重算 HMAC，不等即拒绝（防伪造）\n    //  2) 校验 currentTime - 签发时间 < TTL(2分钟)，过期即拒绝（防重放窗口）\n    //  3) 若要求一次性，校验 nonce 未用过（Redis SETNX + TTL），已用即拒绝\n    //\n    // 设计要点：ticket 不落库 → 登录服无状态 → 水平扩容零成本；\n    //          HMAC 密钥只存服务端并定期轮换 → 泄露面最小。\n}"
   },
   {
    "t": "h",
    "text": "典型追问链与应对（按题库记忆点准备）"
   },
   {
    "t": "list",
    "items": [
     "追问『渠道 token 校验超时或挂了，玩家登录怎么办？』→ 首次登录必须成功（失败提示重试）；老玩家降级放行 + 告警；绝不无限重试拖垮登录服",
     "追问『密钥怎么管理？』→ 配置中心 + 权限隔离 + 分环境 + 定期轮换 + 变更审批，代码只引用配置 key",
     "追问『伪造 token 登录别人的号怎么防？』→ 所有 token 必须服务端向渠道官方二次校验或验签，伪造 token 过不了渠道方验证",
     "追问『凭证怎么不被重放？』→ token 带时间戳 + HMAC + 短 TTL + 序列号/时间窗防重放",
     "追问『登录服宕机了玩家怎么办？』→ 已在线玩家不受影响（长连接在游戏服）；新登录失败，靠无状态多实例 + 健康检查剔除 + 快速拉起"
    ]
   },
   {
    "t": "pits",
    "items": [
     "只讲流程不讲拆分理由——登录服为什么独立是送分题，必须点出『流量尖峰隔离 + 挂掉不影响在线玩家』",
     "二次校验讲不出口——把『服务端向渠道官方接口校验 token』这步漏了，等于没防伪登录",
     "session 概念混成 HttpSession——游戏服是自研 ticket/长连接体系，别往 Servlet 里套",
     "没有压测数字——『开服 QPS 多少、怎么测的、留了多少余量』必须能答，答不出显假",
     "不提降级与限流——只说能扛不说扛不住怎么办，面试官会怀疑你没经历过真实尖峰"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：登录服把『渠道二次校验 → 账号映射 → 签发 ticket → 路由分配 → 建连放行』串成一条可深挖的链路。深挖的四个考点：独立拆分的理由（尖峰隔离）、并发尖峰的扛法（无状态扩容 + 限流排队 + 压测）、session 的『无状态 + 短 TTL + HMAC 防重放』、以及三条安全红线（不信任客户端、token 不过期即失败、密钥不进代码库）。"
   }
  ]
 },
 {
  "id": "resume-deepdive-game-server",
  "title": "游戏服项目深挖：在线规模、架构、核心玩法技术与玩家数据",
  "layer": 1,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-project-story"
  ],
  "covers": [
   "resume-deepdive-03",
   "resume-deepdive-09",
   "resume-deepdive-17"
  ],
  "quiz": [
   "resume-deepdive-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服是技术面的主战场：面试官会从『在线规模 → 架构 → 核心玩法技术 → 玩家数据存储』一层层往下挖，merge 棋盘的服务端权威校验、Disruptor 玩家级串行、MMORPG 的 AOI 与战斗服拆分，都是拉开分差的关键。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 merge 棋盘『服务端权威』存储与校验（题库 resume-deepdive-09）",
     "理解 Disruptor 玩家级串行 = actor 模型的 mailbox（题库 resume-deepdive-13）",
     "了解 MMORPG 状态同步、AOI、战斗服/功能服拆分（题库 resume-deepdive-17）"
    ]
   },
   {
    "t": "h",
    "text": "先讲在线规模：把『量级 + 挑战 + 应对』一次讲透"
   },
   {
    "t": "p",
    "text": "在线规模是游戏服所有设计的前提，面试官问的第一个问题大概率是『你们游戏多少在线、单服多少并发』。回答模板：『merge 类项目日常在线几万人，晚高峰 8~10 点翻 2~3 倍；单游戏服实例承载 1~2 万长连接。这个量级下的核心挑战是：玩家操作频次极高，单玩家每分钟操作几十次，写压力集中在存档回写；同时是长连接 + 自定义二进制协议，对网络层和线程模型要求高。』——注意：把『量级』和『这个量级下的技术挑战』绑定着讲，数字不大也能讲出技术密度。面试官如果追问压测方法：『模拟客户端批量建连 + 按真实协议发包，观察 CPU/内存/GC 与 P99 延迟拐点定上限，生产打七折留余量。』"
   },
   {
    "t": "h",
    "text": "游戏服架构：单线程模型 + Disruptor 玩家级串行"
   },
   {
    "t": "p",
    "text": "游戏服的核心架构纪律是『IO 线程只干 IO，业务全部异步化』：Netty 的 EventLoop 收到消息只做编解码和分发，业务请求投递到 Disruptor 环形队列，由业务线程处理。关键玩法是『按玩家 id 哈希定槽』——同一个玩家的所有请求进同一个队列槽位串行执行，不同玩家并行，等价于 actor 的 mailbox。这样做的三个收益：同一玩家状态天然有序（不用加锁）；不同玩家互不阻塞（吞吐高）；IO 线程永不阻塞（不会群体性掉线）。回答时要能对比 BlockingQueue 的死穴：锁竞争成为热点、无法保证同一玩家请求有序。讲完这个模型，面试官对你的『游戏服实战』认知会立刻拉高一个档次。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服线程模型：IO 线程只收发，业务进 Disruptor 玩家级串行</text>\n<rect x=\"30\" y=\"48\" width=\"130\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Netty EventLoop</text>\n<text x=\"95\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只做编解码 + 分发</text>\n<text x=\"95\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不做业务 / 不碰 DB</text>\n<text x=\"95\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">阻塞 = 群体掉线</text>\n<path d=\"M160 93 L200 93\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#gs1)\"/>\n<rect x=\"200\" y=\"48\" width=\"200\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"300\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Disruptor 环形队列</text>\n<text x=\"300\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按玩家 id 哈希定槽</text>\n<text x=\"300\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同一玩家串行 · 不同玩家并行</text>\n<text x=\"300\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">等价 actor mailbox</text>\n<path d=\"M400 93 L440 93\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#gs1)\"/>\n<rect x=\"440\" y=\"48\" width=\"170\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务线程池</text>\n<text x=\"525\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跑游戏逻辑</text>\n<text x=\"525\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无锁化 · 状态有序</text>\n<rect x=\"30\" y=\"170\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">收益三连</text>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">① 同玩家天然有序无锁 · ② 不同玩家并行吞吐高 · ③ IO 线程永不阻塞</text>\n<rect x=\"30\" y=\"240\" width=\"580\" height=\"60\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">对比 BlockingQueue 的两大死穴</text>\n<text x=\"320\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">锁竞争热点 · 无法保证同一玩家请求按序执行（状态会乱）</text>\n<defs><marker id=\"gs1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 4：游戏服 Disruptor 玩家级串行模型"
   },
   {
    "t": "h",
    "text": "核心玩法技术：merge 棋盘的服务端权威（题库 resume-deepdive-09 重点）"
   },
   {
    "t": "p",
    "text": "merge 类游戏最典型的深挖点是棋盘合成。核心原则一句话：客户端只是渲染器，服务端持有权威状态。具体分四层讲：① 存储——棋盘本质是个格子数组（如 8x8），每格存棋子 id + 等级，序列化成紧凑结构存玩家档案表的一个字段，绝不拆成『一格一行』；② 校验——每次合成请求服务端必查三件事：源格非空且棋子 id/等级相同、目标产物在合成表中存在、结果由服务端计算下发（客户端只发操作坐标不发结果）；③ 并发——单玩家请求全部进同一个 Disruptor 队列串行执行，天然无并发写冲突，存档带版本号防重放；④ 持久化——操作即改内存 + 定时/定量回写 MySQL（如 30 秒），资金类操作即时落库不走回写窗口。面试官最爱的追问是『合成带随机性（概率产出）时随机数放哪』——答案必须是服务端，且要有公平性验证日志，这是防作弊红线，答错直接出局。"
   },
   {
    "t": "h",
    "text": "玩家数据存储：内存态 + Redis 缓存 + MySQL 持久化三层"
   },
   {
    "t": "p",
    "text": "玩家数据的三层设计：热数据（在线玩家的战斗态、背包操作中的临时状态）在游戏服内存；加速层（排行榜、在线状态、部分档案缓存、分布式锁）在 Redis；最终一致基准（玩家档案、背包、棋盘、流水）在 MySQL。内存态是权威、DB 是最终持久层、Redis 是加速层——三者的顺序在回答里不能乱。持久化策略讲两点：一是『操作即改内存 + 定时/定量回写』，宕机最多丢一个可接受窗口；二是关键资金操作即时落库。面试官追问『宕机丢 30 秒数据玩家投诉怎么办』时，答案要完整：设计上缩小窗口（关键操作即时落库）+ 操作日志重放恢复 + 恢复不了的走客服补偿 SOP，GM 后台全程留操作记录。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// merge 棋盘合成校验骨架（服务端权威，客户端只发操作坐标）\npublic class BoardMergeService {\n    // 入参：棋盘当前版本号 + 两个源格坐标 + 客户端上报的快照（仅用于比对）\n    public MergeResult merge(PlayerCtx ctx, int[] src1, int[] src2, long clientVersion) {\n        // 1. 版本校验：clientVersion 落后于服务端存档 → 先下发快照重建（防重放/防旧操作）\n        if (clientVersion < ctx.board.version()) return rebuildSnapshot(ctx);\n        // 2. 合法性：源格非空、棋子 id 相同且等级相同（在服务端存档上判断，不信任客户端）\n        Piece a = ctx.board.get(src1), b = ctx.board.get(src2);\n        if (a == null || b == null || a.id() != b.id() || a.level() != b.level()) {\n            return MergeResult.fail(\"非法合成\");\n        }\n        // 3. 结果确定性：产物由服务端查合成表算出（含概率产物的随机数也在服务端生成）\n        Piece prod = mergeTable.produce(a.id(), a.level());   // 随机数在服务端\n        // 4. 原子更新棋盘 + 版本号自增 + 定时回写窗口内落内存\n        ctx.board.set(src1, null); ctx.board.set(src2, null);\n        ctx.board.set(prodCell, prod); ctx.board.bumpVersion();\n        auditLog.record(ctx, \"merge\", src1, src2, prod);      // 可审计、可复现\n        return MergeResult.ok(prod);\n    }\n}"
   },
   {
    "t": "h",
    "text": "扩展：MMORPG 的状态同步与战斗服拆分（提到即可加分）"
   },
   {
    "t": "p",
    "text": "如果面试官问过你的 MMO 经验（10 年经历里这是早期项目），要能讲两件事：一是状态同步用服务端权威 + AOI（九宫格）控制广播量，客户端只上报操作意图、服务端校验位移合理性防瞬移挂；二是战斗服/功能服拆分——战斗服跑高频实时逻辑、状态只在内存、结算才回写，功能服跑复杂业务，之间用基于 Netty 的 RPC 通信（进战斗快照传入、结算结果回传）。核心记忆点：『战斗状态只在内存，结算才回写』，这句话能一句话证明你做过 MMO。"
   },
   {
    "t": "pits",
    "items": [
     "只讲功能不讲量级——在线规模是游戏服所有设计的前提，先讲量级再讲挑战",
     "服务端权威讲不彻底——把『客户端只发操作不发结果』漏了，等于没防作弊",
     "随机数放客户端——这是防作弊红线，答错直接出局",
     "线程模型讲成线程池数量——重点不是线程数，是『IO 不做业务 + 玩家级串行』这个纪律",
     "存档设计成一格一行——merge 棋盘是紧凑字段存储 + 版本号，拆行是外行方案"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：游戏服深挖按『在线规模 → 线程模型 → 核心玩法 → 玩家数据』四层准备。规模讲量级+挑战绑定，线程模型讲『IO 不做业务 + Disruptor 玩家级串行』，merge 玩法讲服务端权威四层校验，数据讲内存/Redis/MySQL 三层与回写窗口。每个点都配一个能讲 5 分钟的追问答案，游戏服这一关就稳了。"
   }
  ]
 },
 {
  "id": "resume-deepdive-pay-log-server",
  "title": "支付服/日志服深挖：支付幂等、掉单补偿、日志链路与 Kafka 削峰",
  "layer": 1,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-project-story"
  ],
  "covers": [
   "resume-deepdive-11",
   "resume-deepdive-12"
  ],
  "quiz": [
   "resume-deepdive-11"
  ],
  "body": [
   {
    "t": "lead",
    "text": "支付服和日志服是『稳定性』主题的两极：支付要求强一致、零资损、可追溯；日志要求高吞吐、可容忍延迟、绝不能拖慢主流程。面试官一前一后问这两个服务，考的就是你有没有『按流量性质与一致性要求区分设计』的架构判断力。"
   },
   {
    "t": "pre",
    "items": [
     "掌握支付链路两条铁律：回调必幂等、掉单必补偿（题库 resume-deepdive-11）",
     "理解 Kafka 积压处理三步：定位 → 止血 → 根治（题库 resume-deepdive-12）",
     "理解『在线实时流量与离线准实时流量分离』的服务拆分思想"
    ]
   },
   {
    "t": "h",
    "text": "为什么支付服必须独立拆服"
   },
   {
    "t": "p",
    "text": "支付服独立拆分的理由有三层，缺一不可：① 强一致与可追溯——支付要对接外部渠道、回调要验签、订单状态机要严格流转、每日要对账，这些要求的复杂度和普通业务不是一个量级；② 回调风暴隔离——渠道集中回调时 QPS 会瞬间冲高，如果支付逻辑混在游戏服里，风暴会拖垮在线玩家；③ 资金链路安全——支付相关的密钥、验签、审计必须独立管理，权限边界清晰。答题要点是强调『核心资金链路与普通业务隔离』这条架构思想，而不是罗列支付服做了什么功能。"
   },
   {
    "t": "h",
    "text": "支付幂等设计：三层兜底，全部汇入同一发货入口"
   },
   {
    "t": "p",
    "text": "支付链路的两个铁律：渠道会重推回调（幂等必须做）、掉单总会发生（补偿必须做）。幂等设计三件套：① 订单表以渠道订单号建唯一索引，重复回调在 INSERT 层就被挡住；② 状态机条件更新做原子闸门——`UPDATE 订单 SET status=已发货 WHERE id=? AND status=已支付`，受影响行数为 1 才执行发货，回调与主动查单都走这个入口，天然互斥只发一次货；③ 回调先验签再处理，验签不过直接拒绝。掉单补偿三层兜底：被动等回调 + 定时扫『创建超时仍未支付』的订单主动调渠道查单接口核实 + 每日拉渠道账单对账，差异单自动告警。所有路径（回调、查单、GM 补单）都汇入同一个幂等发货入口——这句话是支付题的得分点。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 340\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">支付防漏发三层网：渔网（回调）→ 拖网（查单）→ 雷达（对账）</text>\n<rect x=\"30\" y=\"48\" width=\"180\" height=\"84\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第一层 · 回调</text>\n<text x=\"120\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">渠道回调 → 验签 → 处理</text>\n<text x=\"120\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可能漏（网络/宕机）</text>\n<rect x=\"230\" y=\"48\" width=\"180\" height=\"84\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第二层 · 主动查单</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">定时扫待支付订单</text>\n<text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">调渠道查单接口核实</text>\n<rect x=\"430\" y=\"48\" width=\"180\" height=\"84\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第三层 · 每日对账</text>\n<text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">渠道账单 vs 本地订单</text>\n<text x=\"520\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">差异单自动告警</text>\n<path d=\"M120 132 L120 176 L320 176 L320 152\" stroke=\"var(--line)\" stroke-width=\"1.8\" marker-end=\"url(#pl1)\"/>\n<path d=\"M320 132 L320 152\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#pl1)\"/>\n<path d=\"M520 132 L520 176 L320 176\" stroke=\"var(--line)\" stroke-width=\"1.8\"/>\n<rect x=\"190\" y=\"182\" width=\"260\" height=\"66\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">统一幂等发货入口</text>\n<text x=\"320\" y=\"226\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">状态机条件更新做原子闸门</text>\n<text x=\"320\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">UPDATE ... WHERE status=已支付 → 行数为 1 才发货</text>\n<rect x=\"30\" y=\"266\" width=\"580\" height=\"58\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"288\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">钱货两讫前，订单永不置终态</text>\n<text x=\"320\" y=\"308\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发货失败进异常队列重试 · 背包满改发邮箱 · 人工补单走同一幂等入口</text>\n<defs><marker id=\"pl1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 5：支付三层兜底 + 统一幂等发货入口"
   },
   {
    "t": "h",
    "text": "日志服的定位与 Kafka 链路"
   },
   {
    "t": "p",
    "text": "日志服的定位一句话：它是『高频写、可容忍延迟、绝不允许拖慢游戏主流程』的离线流量。架构是游戏服/购买服把行为日志、支付事件异步上报 Kafka → 日志服消费入库 → BI 服聚合出报表。关键设计点是两条链路互不阻塞：在线链路（登录、操作）同步实时；日志链路（行为、BI）异步削峰。日志链路要主动提的两个量级概念：日志量每天上亿条、高峰期间写吞吐是关键瓶颈——这决定了入库要走批量写（攒批 500~1000 条 batch insert），分析查询久了要考虑 ClickHouse 替换 MySQL。"
   },
   {
    "t": "h",
    "text": "Kafka 积压处理：定位 → 止血 → 根治（题库 resume-deepdive-12 重点）"
   },
   {
    "t": "p",
    "text": "面试官问积压是想看你有没有真实运维经验。三步框架：① 定位——看 lag 增长曲线：突增一般是活动/开服导致生产端流量翻倍，缓慢持续增长是消费能力长期不足；② 止血（分钟级）——消费者扩容（注意同一消费组并发度上限等于分区数，分区不够要先加分区，分区只能加不能减要提前规划）、消费端降级（日志可容忍延迟，临时关非关键日志类型保核心日志）、批量参数调优（拉大 max.poll.records、批量入库）；③ 根治——入库是瓶颈就上缓冲攒批或换 ClickHouse；生产端削峰（游戏服先写内存队列异步批量发 Kafka）。最后补预防：对 lag 设告警阈值，不能等 BI 说报表没数据才发现。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 日志消费端批量入库骨架——把单条 insert 换成攒批，是日志链路最常被追问的优化\npublic class LogConsumer {\n    private static final int BATCH_SIZE = 500;          // 攒批阈值\n    private static final long BATCH_TIMEOUT_MS = 200;   // 攒批时间窗\n    private final List<LogEvent> buffer = new ArrayList<>();\n\n    public void onMessage(LogEvent e) {\n        buffer.add(e);\n        if (buffer.size() >= BATCH_SIZE) flush();       // 满 500 条立刻批量写\n    }\n    private void flush() {\n        // batch insert 一次写 500 条，写吞吐远高于逐条 insert\n        // 失败重试：先本地重试 N 次（带退避），仍失败写入独立 DLQ topic 并告警\n        // 避免一条毒消息卡死整个分区：DLQ 由定时任务人工分析后重放/修复\n        logDao.batchInsert(new ArrayList<>(buffer));\n        buffer.clear();\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "支付题只讲幂等不讲补偿——『回调必幂等、掉单必补偿』两条铁律缺一不可，只答一半不及格",
     "幂等只用唯一索引——必须讲状态机条件更新做原子闸门，才证明并发下单不会多发",
     "漏验签前置——回调先验签再处理，验签不过直接拒绝，这步不能省",
     "积压只讲加消费者——不知道『并发度上限=分区数、分区只能加不能减』会露馅",
     "日志链路讲成同步入库——日志必须异步削峰，和在线主流程隔离，这是拆分思想的考核点"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：支付服考『两层铁律 + 三层兜底』——回调幂等（唯一索引 + 状态机原子闸门）与掉单补偿（回调/查单/对账三层网），所有路径汇入同一幂等发货入口；日志服考『异步削峰 + 积压三步』——定位看 lag 曲线、止血靠扩容/降级/批量、根治靠攒批或换 ClickHouse。一前一后两问，考的是按一致性要求分设计的判断力。"
   }
  ]
 },
 {
  "id": "resume-deepdive-gm-ops",
  "title": "GM 后台与运维深挖：功能架构、权限、运营效率与线上稳定性",
  "layer": 1,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-project-story"
  ],
  "covers": [
   "resume-deepdive-08",
   "resume-deepdive-14",
   "resume-deepdive-15"
  ],
  "quiz": [
   "resume-deepdive-14"
  ],
  "body": [
   {
    "t": "lead",
    "text": "GM 后台在简历上容易被面试官轻看，却是『工程效率 + 稳定性 + 安全』三合一的证明题——它的深挖套路是把 CRUD 的外壳剥开，露出里面的运行态稳定性工程、性能工程与权限安全工程。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 GM 后台重构的价值量化（题库 resume-deepdive-14，STAR 讲法）",
     "理解热更新的分层与边界（题库 resume-deepdive-15）",
     "理解 MyBatis-Plus 在后台 CRUD 的用法与坑（题库 resume-deepdive-08）"
    ]
   },
   {
    "t": "h",
    "text": "先定调：GM 后台不是 CRUD，是运行态系统的稳定性工程"
   },
   {
    "t": "p",
    "text": "面试官轻看 GM 后台时（『10 年经验怎么简历上还写后台管理』，见题库 resume-deepdive-27），你要当场重构叙事：GM 指令是直达在线游戏服的——热更新、发奖、封禁、改配置是在『跑着的服务器』上做手术。GM 后台真正在解决三类工程问题：① 运行态稳定性工程——指令双缓冲切换、指令幂等、操作审计与回滚；② 性能工程——GM 多条件组合查询要防深分页打垮 DB，用游标翻页 + 查询预算限制；③ 权限安全工程——RBAC 权限模型、高危指令二次确认、金额阈值审批。把这三条讲出来，CRUD 的壳里就装满了非 CRUD 的问题。"
   },
   {
    "t": "h",
    "text": "功能架构：从单体后台到统一基座（STAR 讲法，题库 resume-deepdive-14）"
   },
   {
    "t": "p",
    "text": "用 STAR 讲 GM 后台重构：S（背景）——老后台是 JSP/老框架，各项目各自为政，权限靠硬编码，每个新游戏都要重做一套；T（目标）——统一技术栈，做成可复用的后台基座；A（行动）——基于若依（SpringBoot + Vue）搭建统一后台，自带 RBAC 权限、代码生成器、字典参数管理；抽象出游戏通用模块（玩家查询、邮件发奖、封禁、公告、订单查询）；打通与游戏服的指令通道（HTTP/RPC 下发 GM 指令，带操作日志和二次确认）；R（量化收益）——新功能开发效率：代码生成器 + 通用模块复用，一个新管理页面从 2~3 天缩到半天；新项目接入从重做一套变成复用基座 + 配置；运营自助率提升，开发侧客服支持工单下降；安全性：统一权限 + 操作审计，杜绝『直接改库』的野路子。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">GM 后台统一基座架构（若依 + 游戏通用模块 + 指令通道）</text>\n<rect x=\"30\" y=\"46\" width=\"280\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">基础能力（若依自带）</text>\n<text x=\"170\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">RBAC 权限 · 代码生成器</text>\n<text x=\"170\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">字典 · 参数管理</text>\n<rect x=\"330\" y=\"46\" width=\"280\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏通用模块</text>\n<text x=\"470\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家查询 · 邮件发奖 · 封禁</text>\n<text x=\"470\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">公告 · 订单查询</text>\n<path d=\"M320 130 L320 156\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#gm1)\"/>\n<rect x=\"150\" y=\"156\" width=\"340\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"178\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">GM 指令通道（HTTP/RPC → 游戏服）</text>\n<text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">操作日志 · 高危指令二次确认 · 发奖幂等</text>\n<rect x=\"150\" y=\"232\" width=\"340\" height=\"48\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">收益三数：开发 3 天→半天 · 新项目省人周 · 工单下降</text>\n<defs><marker id=\"gm1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 6：GM 后台统一基座架构"
   },
   {
    "t": "h",
    "text": "权限与防误操作：安全工程的三道闸"
   },
   {
    "t": "p",
    "text": "GM 后台权限与防误操作是面试官最爱追问的安全点。三道闸：① RBAC 权限模型——角色 → 权限点（菜单/按钮级），发奖、封禁这类高危功能单独授权，杜绝『人人可改』；② 二次确认与审批——高危指令（大额发奖、封禁）强制二次确认 + 金额阈值走上级审批，杜绝误点即生效；③ 操作审计与幂等——所有指令落操作日志可追溯，发奖类服务端幂等防重复点击，测试服验证后再上正式服。加分反例：重构前运营误操作直接改库导致事故，重构后这类事故归零。"
   },
   {
    "t": "h",
    "text": "热更新：分层方案与安全边界（题库 resume-deepdive-15）"
   },
   {
    "t": "p",
    "text": "热更新按内容分层：① 配置热更（覆盖 80% 需求）——策划配表放 DB/配置中心，GM 后台点热更通知游戏服重新加载，双缓冲切换（新表加载校验通过后原子替换引用，旧请求继续用旧表，天然无锁）；② 脚本逻辑热更——规则类逻辑（活动玩法、数值公式）用 Groovy/Lua 承载，替换脚本文件即可；③ Java 类热更——自定义 ClassLoader 重载，只适用于无状态工具类，有状态单例和 Spring 管理的 Bean 禁做。安全纪律：必须可回滚、走审批 + 操作日志、热更只解决紧急小修——协议变更、数据结构变更必须停服版本更新。这条边界要主动说出来，说明你清楚热更的适用边界。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// GM 后台深分页防拖垮 DB 的游标翻页示意（MyBatis-Plus 场景）\n// 问题：Page 分页翻到后几页，SQL 变成 LIMIT 500000,20，要扫描并丢弃前 50 万行\n// 方案：游标翻页 WHERE id > lastId ORDER BY id LIMIT 20\npublic List<Player> queryByCursor(Long lastId, int size, Integer zoneId) {\n    // 多条件组合查询 + 强制 id 游标翻页，杜绝大 offset\n    LambdaQueryWrapper<Player> w = new LambdaQueryWrapper<>();\n    w.eq(zoneId != null, Player::getZoneId, zoneId);   // 动态拼条件\n    w.gt(lastId != null, Player::getId, lastId);        // 游标翻页\n    w.orderByAsc(Player::getId).last(\"LIMIT \" + Math.min(size, 50)); // 查询预算上限\n    return playerMapper.selectList(w);\n}\n// 配套纪律：GM 查询强制分页上限 + 慢查询告警，防止运营一条查询打垮主库"
   },
   {
    "t": "pits",
    "items": [
     "只讲页面功能不讲工程价值——GM 后台要拆出运行态稳定性/性能/安全三个工程维度",
     "重构价值没有量化——必须给数字（开发提速、新项目省人周、工单下降）+ 一个反例（改库事故归零）",
     "热更新讲成万能——必须主动说『协议与存档结构变更走停服』，这条边界才显成熟",
     "权限只讲 RBAC 名词——要落到高危指令二次确认 + 金额阈值审批 + 操作审计",
     "不提发奖幂等——GM 发奖重复点击会重复发货，服务端幂等是必须讲的细节"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：GM 后台深挖 = 剥开 CRUD 壳讲三层工程（运行态稳定性 / 性能 / 安全），重构价值用 STAR + 三个数字 + 一个反例，权限讲 RBAC + 二次确认 + 审计三道闸，热更新讲分层方案与『哪些必须停服』的边界。这题答得好，等于把『10 年经验只写 CRUD』的质疑当场翻盘。"
   }
  ]
 },
 {
  "id": "resume-deepdive-netty",
  "title": "技术栈专项拷打：Netty——Reactor、粘包、百万连接怎么讲得让人信服",
  "layer": 2,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-project-story",
   "resume-deepdive-login-server",
   "resume-deepdive-game-server"
  ],
  "covers": [
   "resume-deepdive-03"
  ],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "Netty 是游戏服务器技术面的必考专项，考的不是你会背几个类名，而是『你知不知道 IO 线程为什么不能做业务』这条纪律——说得出口是背过书，说不出口就是没写过生产代码。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 Netty 的 ChannelPipeline、EventLoop、ByteBuf 核心概念",
     "理解 Reactor 线程模型与 NIO 的 Selector 机制",
     "理解 TCP 粘包拆包的本质是『流协议没有消息边界』"
    ]
   },
   {
    "t": "h",
    "text": "为什么游戏服选 Netty：场景决定选型"
   },
   {
    "t": "p",
    "text": "游戏服是长连接、小包高频、自定义二进制协议的场景，这个特征决定了选型：① 长连接——HTTP 那套每次建连的模型不合适，需要连接级的状态管理与心跳保活；② 小包高频——单玩家每秒几十次小包，要求单连接吞吐高、GC 压力小；③ 自定义二进制协议——需要灵活的编解码与 Pipeline 插拔。Netty 恰好三个都满足：基于 NIO 事件驱动，单机数万连接无压力；ChannelPipeline 责任链方便插拔编解码/心跳/加密/防重放处理器；ByteBuf 池化与零拷贝减少 GC。回答时先讲场景再讲选型，比直接背 Netty 优点可信十倍。"
   },
   {
    "t": "h",
    "text": "Reactor 线程模型：EventLoop 就是高速收费站的抬杆"
   },
   {
    "t": "p",
    "text": "Netty 的线程模型是 Reactor 的 Java 落地：一个 EventLoop 绑定一个线程，串行处理它名下所有 Channel 的事件，无锁化；多个 EventLoop 组成 EventLoopGroup 分担连接。核心纪律是『IO 线程只干 IO』——EventLoop 收到数据只做解码与分发，业务逻辑投递到 Disruptor/业务线程池。为什么不能阻塞：一个 EventLoop 管着几千个连接，阻塞一次（比如在 handler 里调数据库）就会拖垮该线程上所有连接——超时、心跳失效、群体性掉线。面试官最爱追问『如果某个 handler 里调了数据库会怎样』，标准答案：该 EventLoop 上所有连接集体超时掉线；排查用 jstack 看 EventLoop 线程栈是否停在业务/DB 调用，或给 handler 加耗时监控超阈值告警。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Netty Reactor 模型：一个 EventLoop 管一批连接，IO 线程只抬杆</text>\n<rect x=\"30\" y=\"48\" width=\"100\" height=\"180\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"80\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">连接池</text>\n<text x=\"80\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接1</text>\n<text x=\"80\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接2</text>\n<text x=\"80\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接3</text>\n<text x=\"80\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">……</text>\n<text x=\"80\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接N</text>\n<text x=\"80\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">数千连接/EventLoop</text>\n<path d=\"M130 138 L170 138\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#nt1)\"/>\n<rect x=\"170\" y=\"48\" width=\"150\" height=\"180\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"245\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">EventLoop 线程</text>\n<text x=\"245\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">串行处理名下所有连接</text>\n<text x=\"245\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">编解码 · 分发 · 心跳</text>\n<text x=\"245\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无锁化 · 只干 IO</text>\n<text x=\"245\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">阻塞 = 群体掉线</text>\n<path d=\"M320 138 L360 138\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#nt1)\"/>\n<rect x=\"360\" y=\"48\" width=\"250\" height=\"180\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"485\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务线程（Disruptor/线程池）</text>\n<text x=\"485\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家级串行</text>\n<text x=\"485\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">业务逻辑 · DB 访问</text>\n<text x=\"485\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">与 IO 线程解耦</text>\n<rect x=\"30\" y=\"246\" width=\"580\" height=\"40\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">纪律一句话：IO 线程像高速收费站，只抬杆放行，绝不下地卸货</text>\n<defs><marker id=\"nt1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 7：Netty Reactor 线程模型与 IO 线程纪律"
   },
   {
    "t": "h",
    "text": "粘包拆包：LengthFieldBasedFrameDecoder 参数讲清楚"
   },
   {
    "t": "p",
    "text": "TCP 是流协议没有消息边界，粘包拆包的本质是『怎么从字节流里把一条条消息切出来』。方案选长度字段：自定义协议 = 魔数 + 长度 + 协议号 + 序列化体，用 LengthFieldBasedFrameDecoder 处理。参数含义要能逐一讲清：maxFrameLength（最大帧长，超长直接拒）、lengthFieldOffset（长度字段偏移）、lengthFieldLength（长度字段字节数，一般 4）、lengthAdjustment（长度调整值，length 字段到 payload 之间的补偿）、initialBytesToStrip（跳过的字节数，剥离帧头）。魔数的用途是快速识别非法连接——不是自家协议直接踢掉，防止垃圾流量占资源。主动补一句『粘包本质是流协议没边界』能显得你是真懂而不是背参数。"
   },
   {
    "t": "h",
    "text": "百万连接怎么讲：单机承载与全局架构分开说"
   },
   {
    "t": "p",
    "text": "『百万连接』这个话题要诚实分层：单机几十万连接是可能的但受限于 FD 数、内存、CPU；生产里靠『多实例 + 网关路由』凑总量。讲的顺序：① 单机承载的瓶颈——文件描述符上限（ulimit 调优）、内存（每连接几 KB ~ 几十 KB 的读写缓冲）、CPU（EventLoop 数量按 CPU 核数配）；② 业务侧手段——连接池化、心跳空闲检测踢僵尸连接（IdleStateHandler 防 NAT 超时）、按区服/分线分片把连接摊到多实例；③ 诚实结论——『百万连接不是单机指标，是多实例架构的总量』，这个答案比吹单机百万连接可信得多。面试官追问『单实例能承载多少』时给数字 + 测法：压测模拟客户端批量建连 + 按真实协议发包，看 CPU/内存/GC 与 P99 延迟拐点定上限，生产打七折留余量。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Netty 服务端核心骨架：Pipeline 插拔各处理器\nEventLoopGroup boss = new NioEventLoopGroup(1);            // 1 个线程处理 accept\nEventLoopGroup worker = new NioEventLoopGroup(0);          // 默认 CPU*2，处理 IO\nServerBootstrap b = new ServerBootstrap();\nb.group(boss, worker)\n .channel(NioServerSocketChannel.class)\n .childHandler(new ChannelInitializer<SocketChannel>() {\n     protected void initChannel(SocketChannel ch) {\n         ChannelPipeline p = ch.pipeline();\n         p.addLast(new LengthFieldBasedFrameDecoder(65536, 2, 4, 0, 6)); // 拆包\n         p.addLast(new IdleStateHandler(180, 120, 0));      // 心跳空闲检测，踢僵尸连接\n         p.addLast(new GameProtocolDecoder());              // 解码：魔数校验+协议号路由\n         p.addLast(new DispatcherHandler(disruptor));       // 分发：投递到 Disruptor，IO 线程不阻塞\n     }\n });\n// 注意：DispatcherHandler 里绝不做业务、绝不调 DB——业务交给 Disruptor 玩家级串行"
   },
   {
    "t": "pits",
    "items": [
     "只背类名说不出纪律——『IO 线程不做业务』说不出等于没写过生产代码",
     "粘包只答『用 LengthFieldBasedFrameDecoder』——参数含义要能逐一讲清",
     "不知道 handler 里调 DB 的后果——事件循环阻塞导致该 EventLoop 全部连接掉线",
     "百万连接吹单机——必须分层：单机有瓶颈，总量靠多实例架构",
     "不提心跳踢僵尸连接——长连接场景 IdleStateHandler 是必讲细节，防 NAT 超时占资源"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Netty 专项四连问——为什么选（长连接小包高频场景决定）、Reactor 模型（IO 线程只干 IO，阻塞即群体掉线）、粘包拆包（流协议无边界 + LengthField 参数）、百万连接（单机瓶颈 + 多实例总量）。最后那句『IO 线程像高速收费站，只抬杆不放行』要能脱口而出，它就是信服力的注脚。"
   }
  ]
 },
 {
  "id": "resume-deepdive-concurrency-jvm",
  "title": "技术栈专项拷打：并发与 JVM——线程模型、锁、GC 调优与量化案例",
  "layer": 2,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-project-story",
   "resume-deepdive-login-server",
   "resume-deepdive-game-server"
  ],
  "covers": [
   "resume-deepdive-13",
   "resume-deepdive-28"
  ],
  "quiz": [
   "resume-deepdive-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "并发与 JVM 是 10 年经验的试金石：面试官用『玩家级串行』考你的并发建模能力，用『最难 bug』考你的 JVM 排查方法论。讲法要领是『机制讲到底层、案例讲出数字、结论给出方法论』。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Disruptor 相对 BlockingQueue 的本质优势（题库 resume-deepdive-13）",
     "熟悉 jstack / jmap / MAT / GC 日志 / Arthas 等排查工具",
     "熟悉 JVM 内存结构与常见 GC 算法的基本原理"
    ]
   },
   {
    "t": "h",
    "text": "线程模型：游戏服怎么把并发问题消灭在入口"
   },
   {
    "t": "p",
    "text": "游戏服并发建模的核心思想是『串行化』：通过把请求按玩家维度排队，把『多线程并发改同一个玩家状态』的问题变成『单线程顺序处理』，从而在业务代码里完全不用加锁。落地是 Disruptor 的『按玩家 id 哈希定槽』——同一玩家的请求永远进同一个槽位串行执行，不同玩家并行。这个模型的本质是 actor 模式，把并发复杂性收敛到框架层。回答对比题『为什么不用 BlockingQueue + 线程池』时抓两个死穴：LinkedBlockingQueue 的 putLock/takeLock 在高并发下成为锁竞争热点；线程池无法保证同一玩家的请求按序执行，两个线程同时处理同一玩家的两个请求，状态就乱了。再补一个实现细节：RingBuffer 容量取 2 的幂是为了用位与（sequence & (size-1)）代替取模，序号用 long 单调递增不回头、槽位环形复用。"
   },
   {
    "t": "h",
    "text": "锁：从 synchronized 到并发容器，游戏场景怎么选"
   },
   {
    "t": "p",
    "text": "面试官问你锁的粒度，本质是考『你知道什么时候可以不用锁』。游戏服务器的经验是：能串行化就不加锁（Disruptor 玩家级串行消灭业务锁）；必须共享的用并发容器（ConcurrentHashMap 代替 HashMap + 锁）；跨实例的用分布式锁（Redisson RLock 用于 GM 发奖防重、定时任务防多实例并发执行）。锁粒度口诀：锁的持有时间越短越好、锁的范围越小越好、能无锁（CAS/串行化）就别加锁。再补一个 JVM 层概念：synchronized 会从偏向锁升级到轻量级锁再到重量级锁，高并发下锁竞争升级为重量级锁是性能拐点——所以并发热点优先用 CAS 或串行化规避。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">并发建模三级阶梯：先串行化，再并发容器，最后才上锁</text>\n<rect x=\"30\" y=\"48\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第一级 · 串行化（游戏服首选）</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Disruptor 玩家级串行：同玩家有序、不同玩家并行，业务代码零加锁</text>\n<path d=\"M320 104 L320 128\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#cj1)\"/>\n<rect x=\"30\" y=\"128\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第二级 · 并发容器</text>\n<text x=\"320\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ConcurrentHashMap / CopyOnWriteArrayList：读多写少场景无锁读</text>\n<path d=\"M320 184 L320 208\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#cj1)\"/>\n<rect x=\"30\" y=\"208\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"230\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第三级 · 分布式锁（跨实例）</text>\n<text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redisson RLock：GM 发奖防重、定时任务防多实例并发执行</text>\n<defs><marker id=\"cj1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 8：并发建模三级阶梯"
   },
   {
    "t": "h",
    "text": "GC 调优：从现象到参数，讲一个真实流程"
   },
   {
    "t": "p",
    "text": "GC 调优不是背参数，是『看现象 → 定目标 → 改配置 → 验证』的流程。常见现象与对策：① 频繁 Full GC、老年代一直涨 → 大概率对象泄漏，用 jmap 导出堆 + MAT 看支配树找泄漏点（比如静态缓存 Map 只 put 不清理）；② Young GC 频繁 → 新生代偏小，调大 -Xmn 或 -XX:NewRatio；③ P99 毛刺 → 可能 GC 停顿与业务峰值叠加，用 G1 的 -XX:MaxGCPauseMillis 设停顿目标，必要时开 -XX:+PrintGCDetails 观察各区状态。游戏服场景的特殊点：对象分配极频繁（每秒大量小包解码），所以首选池化（ByteBuf 池化、对象池）减少分配，配合 G1 把停顿控制在业务可接受范围。讲的时候要给出『改前改后的量化对比』——这是 senior 和初级的差别。"
   },
   {
    "t": "h",
    "text": "最难 bug：讲推理链而不是时间线（题库 resume-deepdive-28 重点）"
   },
   {
    "t": "p",
    "text": "这题面试官要的是侦探式的推理链，不是事故流水账。高分讲法：① 先定义难在哪——『偶发，一周一次，无法本地复现，日志里没有异常』，难点定义清楚深度才有参照系；② 排查路径要敢讲错路——第一轮假设是什么、为什么被排除，然后关键动作给到命令级：jstack 抓线程栈发现业务线程全部 BLOCKED 在同一把锁 / jmap + MAT 分析堆直方图发现某集合实例只增不减 / GC 日志看老年代斜率异常 / Arthas watch 抓现场入参；③ 根因落到机制——比如玩家离线清理和登录加载并发触发，HashMap 非线程安全导致死循环链表或状态覆盖；或静态缓存只 put 不清理导致缓慢泄漏；④ 修复与验证——怎么改（缩小锁粒度 / 改 ConcurrentHashMap / 加 TTL 清理），用什么数据验证修好了（观察两周 GC 曲线 / 线程数平稳）。最后收口方法论：『偶发并发 bug 的铁律——不要在代码里找，先在现象里找规律（时间规律 / 操作规律 / 数据规律），规律会把范围缩到 10 行代码以内。』"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 并发 bug 排查工具链记忆卡（面试时可逐一展开）\n// jstack <pid>           → 看线程状态分布：大量 BLOCKED = 锁问题；RUNNABLE 集中 = 热点代码\n// jmap -dump:format=b    → 导堆给 MAT 分析支配树，找『只增不减』的泄漏源\n// jstat -gcutil <pid>    → 看 GC 曲线斜率：老年代持续上涨 = 泄漏嫌疑\n// GC 日志               → -Xlog:gc* 观察停顿分布，定位 Full GC 毛刺\n// Arthas watch/trace     → 线上抓方法入参与耗时，不重启看现场\n//\n// 排查顺序口诀：先监控定大类（内存涨 = 堆分析 / CPU 高 = 线程栈），\n// 再 jstack 看线程状态分布，最后 MAT/Arthas 下钻到代码行——先现象后代码"
   },
   {
    "t": "pits",
    "items": [
     "并发题只背锁名词——说不出『串行化消灭锁』的游戏服核心玩法等于没写过",
     "Disruptor 只背『无锁环形数组』——讲不出玩家级串行 = 没在游戏服真用过",
     "GC 调优只背参数——必须讲『现象 → 目标 → 参数 → 验证』流程 + 量化对比",
     "难 bug 讲成运气好蒙到的——要展示假设→验证→推翻的推理链，敢讲错路",
     "修复后没有验证数据——观察两周曲线/线程数平稳，没验证等于故事不完整"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：并发与 JVM 专项三连——并发建模讲『串行化三级阶梯』（Disruptor 玩家级串行 > 并发容器 > 分布式锁）、GC 讲『现象→参数→验证』流程并给量化对比、难 bug 讲『推理链 + 命令级工具 + 机制根因 + 验证数据』。记忆钩子：偶发并发 bug 不在代码里找，先在现象里找规律。"
   }
  ]
 },
 {
  "id": "resume-deepdive-redis-mysql-shard",
  "title": "技术栈专项拷打：Redis / MySQL / 分库分表——排行榜、缓存一致性、慢查询",
  "layer": 2,
  "depends": [
   "resume-deepdive-login-server",
   "resume-deepdive-game-server",
   "resume-deepdive-pay-log-server"
  ],
  "covers": [
   "resume-deepdive-04",
   "resume-deepdive-16"
  ],
  "quiz": [
   "resume-deepdive-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "存储专项是游戏服务器技术面的重头戏：Redis 考『四件套职责 + 热 key 治理』，MySQL 考『慢查询与索引』，分库分表考『路由、扩容、跨片查询』三大真实痛点——每一个都要用你项目里的真实决策来背书。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 Redis 在游戏服的四大职责：缓存/排行榜/分布式锁/在线状态（题库 resume-deepdive-04）",
     "理解缓存一致性、穿透/击穿/雪崩的基本概念",
     "理解分库分表的三大痛点：路由、扩容、跨片查询（题库 resume-deepdive-16）"
    ]
   },
   {
    "t": "h",
    "text": "Redis 四件套：每个数据结构为什么适配对应场景"
   },
   {
    "t": "p",
    "text": "游戏服里 Redis 的职责要能一口气讲出四件，且每个都要说『为什么是它』：① 缓存——玩家热数据挡在 MySQL 前面，String/Hash 都行，关键是用 TTL 与淘汰策略控制内存；② 排行榜——ZSet 天然适配战力榜/活动榜，跳表实现 O(logN) 插入，ZRANGE/ZREVRANGE 取 TopN，ZSCORE 查自己排名，同分排序用『score = 战力 × 10^13 + (10^13 - 时间戳)』让先到先得；③ 分布式锁——Redisson RLock 用于 GM 发奖防重、定时任务防多实例并发执行；④ 在线状态——玩家 token、在线标记、跨服路由信息，TTL 自动过期。为什么用集群：数据量超单机内存 + 需要主从与自动故障转移，Cluster 模式 16384 个 slot 按 key 哈希分片、水平扩容。"
   },
   {
    "t": "h",
    "text": "热 key / 大 key / 缓存一致性：主动讲这三个坑才像做过生产"
   },
   {
    "t": "p",
    "text": "面试官问 Redis 一定会往下挖实战坑，主动讲三个：① 热 key——全服排行榜是典型单 key 热点，对策是本地缓存（Caffeine 短 TTL）挡一层、大排行榜按分数段拆成多个 key 再合并查询、读扩散到从库，核心是把单 key 压力分散到内存和多个 key 上；② 大 key——超大 ZSet 或大 Hash 拖慢单次操作与持久化，对策是定期裁剪 + 拆分 + 渐进式删除；③ 缓存与 DB 一致性——『先写 DB 再删缓存 + 延迟双删』或订阅 binlog，不能先写缓存（会与旧缓存/DB 冲突）。穿透用布隆过滤器或空值缓存、击穿用互斥锁或逻辑过期、雪崩用随机 TTL + 多级缓存——每个词都配一句项目实例，可信度翻倍。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 310\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Redis 四件套 + 三坑治理（先讲职责，再讲坑）</text>\n<rect x=\"30\" y=\"46\" width=\"130\" height=\"84\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 缓存</text>\n<text x=\"95\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家热数据挡在 DB 前</text>\n<text x=\"95\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TTL + 淘汰策略控内存</text>\n<rect x=\"176\" y=\"46\" width=\"130\" height=\"84\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"241\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 排行榜 ZSet</text>\n<text x=\"241\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跳表 O(logN) 插入</text>\n<text x=\"241\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TopN / 自己名次</text>\n<rect x=\"322\" y=\"46\" width=\"130\" height=\"84\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"387\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 分布式锁</text>\n<text x=\"387\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redisson RLock</text>\n<text x=\"387\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发奖防重 / 定时任务</text>\n<rect x=\"468\" y=\"46\" width=\"142\" height=\"84\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"539\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 在线状态</text>\n<text x=\"539\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">token / 在线标记 / 路由</text>\n<text x=\"539\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TTL 自动过期</text>\n<rect x=\"30\" y=\"150\" width=\"580\" height=\"52\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">为什么集群：容量超单机 + 主从自动故障转移</text>\n<text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">16384 slot 按 key 哈希分片，客户端缓存 slot→节点映射，MOVED/ASK 重定向</text>\n<rect x=\"30\" y=\"222\" width=\"580\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三个实战坑，主动讲</text>\n<text x=\"60\" y=\"266\" font-size=\"12\" fill=\"var(--ink)\">热 key：本地缓存 + 拆 key 分片 + 读扩散</text>\n<text x=\"60\" y=\"284\" font-size=\"12\" fill=\"var(--ink)\">大 key：定期裁剪 + 拆分 + 渐进式删除 · 一致性：先写 DB 再删缓存 + 延迟双删</text>\n<defs></defs>\n</svg>",
    "caption": "图 9：Redis 四件套与三坑治理"
   },
   {
    "t": "h",
    "text": "MySQL 慢查询：从 EXPLAIN 到优化动作的完整讲法"
   },
   {
    "t": "p",
    "text": "面试官问慢查询，别只答『加索引』。完整讲法：① 定位——慢查询日志开启 long_query_time，或监控平台按 avg latency 排序；② 分析——EXPLAIN 看 type（ALL 全表扫描要警惕）、key（用没用到索引）、rows（扫描行数）、Extra（Using filesort 要优化排序）；③ 常见三类优化——索引缺失/失效（函数包列、隐式类型转换、最左前缀违背）、深分页（LIMIT 大 offset 扫全表，改游标翻页 WHERE id > lastId LIMIT 20，GM 后台典型）、大查询（in 传几千个 id SQL 超长，分批查询）；④ 验证——改完看执行计划与线上延迟。游戏服实例：GM 后台翻到最后一页的深分页把 DB 打慢，改游标翻页后延迟从秒级降到毫秒级，这就是『慢查询案例的量化讲述』。"
   },
   {
    "t": "h",
    "text": "分库分表：标准答案 + 三大真实痛点（题库 resume-deepdive-16 重点）"
   },
   {
    "t": "p",
    "text": "游戏服分库分表的标准答案是『按 user_id 哈希水平拆分』：玩家档案/背包/棋盘等强归属数据按 user_id % N 水平拆到 N 个库，单表控制在千万级以内；路由靠登录时加载并缓存玩家所在分片，SQL 自带分片键，用 ShardingSphere/MyCat 或自研路由都可以，讲清你用的哪种。三个痛点必须主动讲：① 扩容迁移——哈希取模扩容要迁大量数据，对策是提前规划分片数（一次到位按未来 2~3 年量预估）或『虚拟桶』方案（1024 个虚拟桶映射到物理库，扩容只挪桶）；② 跨片查询——排行榜/全服统计这类跨片需求不走 DB，排行榜走 Redis ZSet、统计走日志服 + BI 离线聚合，GM 后台按玩家查询天然带分片键；③ 全局唯一 id——订单号等用雪花算法（时间戳 + 机器位 + 序列号）或号段模式。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 分库分表路由 + 事务边界示意\n// 1. 路由：登录时计算分片并缓存，所有 SQL 自带分片键\npublic class ShardRouter {\n    public static int shardOf(long userId, int shardCount) {\n        return (int) (userId % shardCount);   // 哈希取模水平拆分\n    }\n}\n// 2. 事务边界（面试要点）：\n//    单玩家操作 → 天然落单库单表 → 本地事务够用，不上分布式事务中间件（性能优先）\n//    跨玩家操作（交易/赠送）→ 本地事务 + 对账补偿，靠消息与幂等兜底\n//\n// 3. 跨片查询的绕开策略（答题点）：\n//    排行榜 → Redis ZSet（不进 DB）    全服统计 → 日志服 + BI 离线聚合\n//    GM 按玩家查询 → 自带分片键，天然单片    跨片 join → 应用层分次查询内存拼装"
   },
   {
    "t": "h",
    "text": "典型追问链：扩容、join、TiDB 的权衡"
   },
   {
    "t": "list",
    "items": [
     "追问『分库分表后 join 怎么办？』→ 分片键相同的数据放同库（订单冗余 user_id 分片）避免跨库 join；必须关联的在应用层分次查询后内存拼装，或冗余宽表/ES 承接复杂查询",
     "追问『扩容怎么不停机？』→ 双写过渡：新旧分片同时写，历史数据后台迁移 + 校验一致；读先走旧、迁完切读再停旧写；虚拟桶方案只挪桶、迁移粒度小",
     "追问『为什么不用 TiDB 一劳永逸？』→ 讲权衡：TiDB 省分片运维但引入新组件学习与运维成本；游戏服单玩家查询天然命中单分片，中间件方案延迟更可控；存量系统迁移风险与收益不成比例",
     "追问『缓存和 DB 一致性怎么保证？』→ 先写 DB 再删缓存 + 延迟双删或 binlog 订阅；配合穿透/击穿/雪崩三防，每个词带项目实例"
    ]
   },
   {
    "t": "pits",
    "items": [
     "只背数据类型不背场景——ZSet 之于排行榜的『为什么』比 ZSet 本身值钱",
     "缓存一致性只答『先写 DB 再删缓存』——漏了延迟双删与 binlog 订阅两种变体",
     "深分页只说加索引——索引救不了 LIMIT 大 offset，必须说游标翻页",
     "分片只讲路由不讲扩容——扩容是三大痛点之一，虚拟桶或提前规划必须主动讲",
     "事务边界不主动提——单玩家本地事务、跨玩家对账补偿、不上分布式事务中间件，这是判断力的体现"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：存储专项 = Redis 四件套（缓存/排行榜/锁/在线状态）+ 三坑治理（热 key、大 key、一致性）+ MySQL 慢查询『定位→EXPLAIN→三类优化→验证』+ 分库分表三大痛点（路由、扩容、跨片）。记忆钩子：数据跟着 user_id 走、跨片查询绕开 DB、事务不出单库。"
   }
  ]
 },
 {
  "id": "resume-deepdive-kafka-microservice",
  "title": "技术栈专项拷打：Kafka / 微服务——日志链路、堆积处理、Nacos/Dubbo 实际应用",
  "layer": 2,
  "depends": [
   "resume-deepdive-login-server",
   "resume-deepdive-pay-log-server",
   "resume-deepdive-gm-ops"
  ],
  "covers": [
   "resume-deepdive-12",
   "resume-deepdive-24"
  ],
  "quiz": [
   "resume-deepdive-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Kafka 与微服务专项的核心是『诚实 + 映射』：Kafka 考你日志链路的真实运维（积压三步），微服务考你能不能把游戏服的自研架构『翻译』成标准框架语言——不硬撑生产经验，而是证明核心问题你都踩过，只是外壳不同。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 Kafka 积压处理三步：定位→止血→根治（题库 resume-deepdive-12）",
     "理解游戏服拆分服务 = 微服务的真实等价物（题库 resume-deepdive-24）",
     "了解 Nacos 的 AP/CP 差异、Dubbo 的注册发现与集群容错基本概念"
    ]
   },
   {
    "t": "h",
    "text": "日志链路：Kafka 在游戏服里解决什么"
   },
   {
    "t": "p",
    "text": "Kafka 在游戏服的核心职责是『异步削峰的日志通道』：游戏服/购买服把行为日志、支付事件异步上报 Kafka → 日志服消费入库 → BI 服聚合出报表。设计要点：日志是高频写、可容忍延迟的流量，异步削峰后绝不阻塞在线主流程——这就是『在线同步、日志异步』两条链路的架构思想。面试官会追问几个细节：分区键怎么定？——日志允许乱序，但如果要求单玩家日志有序，分区键用 user_id，同一玩家固定进同一分区，分区内天然有序（注意扩容会改映射、重平衡期有乱序窗口，对顺序敏感的消费端要做幂等或版本过滤）。消费失败怎么办？——本地重试 N 次带退避，仍失败写独立 DLQ topic 并告警，主流程继续，避免一条毒消息卡死整个分区。"
   },
   {
    "t": "h",
    "text": "堆积处理三步：先定位、再止血、后根治（题库 resume-deepdive-12 重点）"
   },
   {
    "t": "p",
    "text": "积压处理分三步，面试官听的是你的动线是否专业。① 定位——看 lag 增长曲线：突增多是活动/开服导致生产端流量翻倍，缓慢持续增长是消费能力长期不足；② 止血（分钟级）——消费者扩容（注意同一消费组并发度上限 = 分区数，分区不够得先加分区，分区只能加不能减、要提前规划）、消费端降级（日志可容忍延迟，临时关非关键日志类型保核心日志）、批量参数调优（拉大 max.poll.records、攒批 500~1000 条 batch insert）；③ 根治——入库是瓶颈就上缓冲攒批或改 ClickHouse（日志分析场景远快于 MySQL），生产端削峰（游戏服先写本地/内存队列异步批量发 Kafka）；④ 预防——对 lag 设告警阈值，不能等 BI 说报表没数据才发现。最后这句预防意识是加分项。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka 积压处理四步动线：定位 → 止血 → 根治 → 预防</text>\n<rect x=\"30\" y=\"48\" width=\"130\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 定位</text>\n<text x=\"95\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">看 lag 曲线</text>\n<text x=\"95\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">突增=生产翻倍</text>\n<text x=\"95\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">缓增=消费不足</text>\n<text x=\"95\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">先分性质再动手</text>\n<rect x=\"176\" y=\"48\" width=\"130\" height=\"150\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"241\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 止血</text>\n<text x=\"241\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分钟级</text>\n<text x=\"241\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">扩容消费</text>\n<text x=\"241\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">降级保核心日志</text>\n<text x=\"241\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">批量参数调优</text>\n<text x=\"241\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">并发上限=分区数</text>\n<rect x=\"322\" y=\"48\" width=\"130\" height=\"150\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"387\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 根治</text>\n<text x=\"387\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">治本</text>\n<text x=\"387\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">攒批入库/ClickHouse</text>\n<text x=\"387\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">生产端削峰</text>\n<text x=\"387\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">堵住源头</text>\n<rect x=\"468\" y=\"48\" width=\"142\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"539\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 预防</text>\n<text x=\"539\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">lag 告警阈值</text>\n<text x=\"539\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">分级告警</text>\n<text x=\"539\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">值班认领机制</text>\n<text x=\"539\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">别等报表没数据</text>\n<path d=\"M160 123 L176 123\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#km1)\"/>\n<path d=\"M306 123 L322 123\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#km1)\"/>\n<path d=\"M452 123 L468 123\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#km1)\"/>\n<rect x=\"30\" y=\"216\" width=\"580\" height=\"96\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">必背的两个硬知识</text>\n<text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">① 分区数：按目标吞吐÷单分区消费能力估算并预留 2~3 倍；只能加不能减</text>\n<text x=\"320\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">② 加分区会改变 key→分区映射、破坏历史顺序性，上线前一次规划到位</text>\n<defs><marker id=\"km1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 10：Kafka 积压处理四步动线"
   },
   {
    "t": "h",
    "text": "微服务专项：不装、会译、点破（题库 resume-deepdive-24 重点）"
   },
   {
    "t": "p",
    "text": "面试官质疑『微服务只是学习项目、没有生产经验』时，正确姿势是『问题域映射法』：先诚实承认是学习项目（及格线），再用映射证明核心问题全踩过（加分线）。映射对照：① 服务拆分——游戏服按登录/游戏/购买/日志/BI 拆服务，和微服务按业务域拆是同一套思维，我做过真实的拆与合决策；② RPC 与调用链——MMORPG 战斗服↔功能服就是自研 RPC（Netty + 协议号路由 + 超时重试），Dubbo 的注册发现、负载均衡、超时熔断只是把这套标准化了；③ 配置中心——热更新 + GM 动态下发指令本质就是配置中心的推拉模型，Nacos 的 AP/CP 选型我能讲出为什么；④ 分布式锁与一致性——Redisson 生产用过（发奖防重），支付幂等、掉单补偿就是分布式一致性的实战；⑤ 网关限流——登录服防刷限流、排队机制对应 Gateway 的过滤器与限流插件。收口：给我一个礼拜能平移技术栈，服务治理直觉（超时怎么设、降级砍什么、雪崩怎么防）我在游戏服十年里已经交了学费。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 微服务『问题域映射』论证骨架——背下来直接套用\n// 面试官：你微服务只是学习项目，凭什么信你能落地？\n//\n// 回答结构（不装 → 会译 → 点破）：\n//  1. 不装：『您说得对，Nacos/Dubbo 体系我确实是学习项目，我承认没有生产背景。』\n//  2. 会译：『但这些框架解决的核心问题我在游戏服务器里全踩过——\n//       拆服务（登录/游戏/支付/日志）= 微服务拆分；\n//       战斗服↔功能服的 RPC = Dubbo 的注册发现+超时重试；\n//       热更新+GM 下发 = 配置中心推拉模型；\n//       Redisson 发奖防重 + 支付幂等 = 分布式一致性与锁。』\n//  3. 点破：『框架是标准化的自研，我懂里子；缺的是框架层的工程规范，\n//       给我一个礼拜按贵司规范平移，治理直觉不用重新学。』"
   },
   {
    "t": "h",
    "text": "Nacos / Dubbo 高频知识点：AP/CP、调用链、容错"
   },
   {
    "t": "p",
    "text": "如果面试官继续追问微服务细节，背熟这几个高频点：① Nacos 做注册中心默认 AP（Distro 协议），可用性优先、临时实例允许短时不一致；做配置中心基于 Raft 是 CP，保证配置一致性——两套协议的差异要能讲清；② Dubbo 调用链路：消费者从 Nacos 订阅提供者列表 → 负载均衡选实例 → Netty 长连接发 RPC → 提供者反序列化执行 → 结果回传；集群容错默认 failover（失败重试其他实例），超时在消费端配置；③ 网关限流与登录服限流的差异：机制相通（令牌桶/计数器），差异在层次——Gateway 是声明式配置 + 过滤器链统一入口限流，登录服限流业务内嵌（按连接/账号维度）更贴近协议层与防刷场景。"
   },
   {
    "t": "pits",
    "items": [
     "Kafka 题只答加消费者——不知道并发上限=分区数、分区只能加不能减，立刻露馅",
     "积压只讲止血不讲根治——三步动线必须完整，结尾补 lag 告警预防意识",
     "微服务题硬撑有生产经验——诚实承认是学习项目是及格线，映射论证是加分线",
     "只报框架名词说不出底层——Dubbo 调用链、Nacos AP/CP 要能讲清",
     "把日志讲成同步入库——日志必须异步削峰与主流程隔离，这是架构思想考核点"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Kafka 考积压四步动线（定位看 lag 曲线 → 止血扩容/降级/批量 → 根治攒批/ClickHouse → 预防告警）；微服务考问题域映射法（不装、会译、点破），把拆服务/RPC/配置中心/分布式锁/网关限流全映射到游戏服经验。记忆钩子：框架是标准化的自研，我懂里子。"
   }
  ]
 },
 {
  "id": "resume-deepdive-quantify",
  "title": "量化与成果表达：指标数据怎么来、怎么讲、怎么避免假大空",
  "layer": 3,
  "depends": [
   "resume-deepdive-project-story",
   "resume-deepdive-netty",
   "resume-deepdive-concurrency-jvm",
   "resume-deepdive-redis-mysql-shard"
  ],
  "covers": [
   "resume-deepdive-07",
   "resume-deepdive-25",
   "resume-deepdive-26"
  ],
  "quiz": [
   "resume-deepdive-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "量化表达是 senior 的分水岭：同一个优化，初级说『性能提升了』，资深说『P99 从 800ms 降到 120ms，支撑晚高峰翻倍』。核心不是背数字，而是建立一套『指标来源 → 口径定义 → 量化模板 → 防假大空』的方法论。"
   },
   {
    "t": "pre",
    "items": [
     "理解 STAR 法则中 Result 必须量化的要求（题库 resume-deepdive-02/18）",
     "掌握简历数字三关：来源、口径、交叉印证（题库 resume-deepdive-25）",
     "准备好工具链、GM 重构、性能优化等可量化的真实案例"
    ]
   },
   {
    "t": "h",
    "text": "指标数据怎么来：三个可信来源"
   },
   {
    "t": "p",
    "text": "面试官追问『这个数字哪来的』时，你要能说出统计渠道，可信度翻倍。三个来源：① BI 报表——留存、付费、DAU 这类业务指标以 BI 为准，说明统计口径（按账号去重还是设备去重）；② 监控大盘——QPS、延迟、GC、资源使用率以 Grafana/Prometheus 为准，CCU（同时在线连接数）与 DAU 要分清楚；③ 运维与压测记录——压测报告、扩容记录（『那天从 4 个实例扩到 8 个』）是量级的硬锚点。规则是：每个简历数字都要准备三层——精确值 + 来源 + 口径定义。口径讲得清才是内行，比如『在线峰值 2 万』要能说清是开服峰值还是日常峰值、是 CCU 还是活跃。"
   },
   {
    "t": "h",
    "text": "三大量化模板：性能、成本、稳定性"
   },
   {
    "t": "p",
    "text": "把成果按三大类套模板，讲的时候直接用：① 性能提升模板——『优化前 X → 优化后 Y，关键指标 P99/Z 』，如『存档回写从逐条 insert 改成攒批 500 条，P99 写延迟从 800ms 降到 120ms，支撑晚高峰在线翻倍』；② 成本节约模板——『省了多少机器/多少人周/多少时间』，如『GM 后台基座化，新游戏接后台从重做一套省 2 人周，通用模块复用新页面从 3 天缩到半天』；③ 稳定性改善模板——『事故/故障从 X 降到 Y』，如『热更 + 双缓冲后，配表事故从线上故障变成导出期报错，改库事故归零』。每个模板都要『前后对比 + 归属』：哪个数字是你入职前就有的、哪个是你优化后改善的、改善了多少——归属清晰比数字大更重要。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">量化表达三层模型：先给来源，再套模板，最后防假大空</text>\n<rect x=\"30\" y=\"46\" width=\"580\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第一层 · 来源与口径（数字三关）</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">精确值 + 来源（BI/监控/压测）+ 口径定义（DAU 按账号还是设备 / CCU vs 活跃）</text>\n<path d=\"M320 108 L320 130\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#qt1)\"/>\n<rect x=\"30\" y=\"130\" width=\"580\" height=\"84\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第二层 · 三大量化模板（前后对比 + 归属）</text>\n<text x=\"60\" y=\"176\" font-size=\"12\" fill=\"var(--ink)\">性能：优化前 X → 优化后 Y，关键指标 P99（800ms→120ms）</text>\n<text x=\"60\" y=\"196\" font-size=\"12\" fill=\"var(--ink)\">成本：省机器/人周/时间（新页面 3 天→半天，新项目省 2 人周）</text>\n<text x=\"60\" y=\"216\" font-size=\"12\" fill=\"var(--ink)\">稳定性：事故从 X 降到 Y（改库事故归零，配表事故左移到导出期）</text>\n<path d=\"M320 214 L320 236\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#qt1)\"/>\n<rect x=\"30\" y=\"236\" width=\"580\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第三层 · 防假大空四道闸</text>\n<text x=\"320\" y=\"280\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不编造 · 不夸大数量级 · 口径可查 · 经得起『按数字反推』验算</text>\n<defs><marker id=\"qt1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 11：量化表达三层模型"
   },
   {
    "t": "h",
    "text": "数字不记得精确值怎么办：区间 + 锚点反推"
   },
   {
    "t": "p",
    "text": "面试被问到想不起精确值的数字，硬编是红线，但可以给『区间 + 锚点』：『具体数字以 BI 为准，我记得活动峰值那周 CCU 在 2~3 万区间，因为那天我们把游戏服从 4 个实例紧急扩到了 8 个。』用运维动作反推量级比硬背数字更真实，也给了面试官一个可以顺着追问的技术细节。另一招是把『数字大小』引向『技术密度』：DAU 不高不要慌，讲『这个量级下的挑战』——『DAU 虽然不高，但 merge 类玩家操作频次极高，单玩家每分钟操作几十次，写压力集中在存档回写，所以我们做了批量异步写』，把面试官从数字大小引导到技术含量。"
   },
   {
    "t": "h",
    "text": "工具链与重构的量化：错误左移与人效提升（题库 resume-deepdive-07/14）"
   },
   {
    "t": "p",
    "text": "工程效率类成果最容易被问『到底省了什么』，备好两个现成话术：① 工具链——导表工具把配表错误从线上事故变成导出期报错，协议生成工具把协议变更从『手工改 5 处、联调半天』变成『改定义 + 重新生成 10 分钟』。核心一句话：『把重复劳动和人为失误变成自动化和编译期错误』——这是 senior 思维；② GM 重构——开发效率（新页面 3 天→半天）、新项目接入（省 2 人周）、运营自助率（客服工单下降 X%）、安全性（改库事故归零），加上一个反例（重构前运营误操作直接改库导致的事故）。量化不是炫数字，是证明你『把技术动作翻译成了业务收益』。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 简历数字台账模板——面试前为每个数字准备三层\n// 数字：晚高峰 CCU 2~3 万（活动峰值）\n//   来源：Grafana 在线监控 / 运维扩容记录\n//   口径：CCU = 同时在线长连接数（不是 DAU）；活动峰值 vs 日常晚高峰差 2~3 倍\n//   锚点：那天把游戏服从 4 实例紧急扩到 8 实例，CPU 才回到 60%\n//\n// 数字：存档回写 P99 800ms → 120ms\n//   来源：监控平台平均耗时接口 + 压测报告\n//   口径：P99 = 99% 请求耗时，回写路径攒批 500 条 batch insert\n//   归属：入职前基线 800ms，我优化后 120ms（归属清晰 > 数字大）"
   },
   {
    "t": "h",
    "text": "面试官最爱的数字追问：QPS 反推验证"
   },
   {
    "t": "p",
    "text": "资深面试官会当场验算你的数字，这既为了戳穿编造，也看你的量级感。比如你说『登录峰值 QPS 5 万』，他会接着问『那你们 Netty 配了几个 EventLoop、单实例承载多少连接』——数字对不上人设当场崩。所以讲数字前先自问三个可验算问题：① 这个量级下我的架构参数是什么（EventLoop 数量、线程池大小、Redis 连接池）？② 单实例能扛多少、生产留了多少余量（压测拐点 × 70%）？③ 这个数字我能用监控或运维动作佐证吗？把『数字 → 参数 → 佐证』三层准备好，任何反推都能接住。反过来，如果面试官只是随口问量级，可以先给区间再给锚点，不用追求精确到个位——过度精确反而像背稿。"
   },
   {
    "t": "pits",
    "items": [
     "数字没有来源——『谁统计的』说不出等于编的，每个数字背三层（值/来源/口径）",
     "夸大一个数量级——资深面试官会用 QPS 反推 EventLoop 数量当场验算，编造直接出局",
     "只讲结果不讲归属——『哪个是我优化前就有的、哪个是我改善的』要分清",
     "空泛形容词代替数字——『性能提升』『大幅优化』都是减分，必须给前后对比",
     "数字小就慌——用『量级下的技术挑战』把话题引向技术密度，比硬撑数字大更聪明"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：量化表达 = 来源三关（值/来源/口径）+ 三大模板（性能/成本/稳定性，前后对比 + 归属）+ 防假大空四道闸（不编造、不夸大、口径可查、经得起反推）。记不住精确值给『区间 + 锚点』，数字小就引向技术密度——简历上的每个数字都要能讲出一个故事。"
   }
  ]
 },
 {
  "id": "resume-deepdive-job-motive",
  "title": "跳槽动机与职业规划：离职原因话术、为什么选我们、职业规划表达",
  "layer": 3,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-project-story"
  ],
  "covers": [
   "resume-deepdive-05",
   "resume-deepdive-21",
   "resume-deepdive-23",
   "resume-deepdive-31"
  ],
  "quiz": [
   "resume-deepdive-21"
  ],
  "body": [
   {
    "t": "lead",
    "text": "跳槽动机是 33 岁候选人绕不开的必考题：面试官要的不是标准答案，而是『你走每一步是不是理性的、这次选择是不是深思熟虑的』。离职原因、职业规划、为什么选我们三题连问，本质都在验证同一件事——稳定性。"
   },
   {
    "t": "pre",
    "items": [
     "理解离职话术双因结构：客观环境变化 + 我的诉求升级（题库 resume-deepdive-23）",
     "掌握跳槽频繁的叙事重构：行业定性 + 逐段客观因 + 人走资产留（题库 resume-deepdive-21）",
     "了解成都游戏行业的基本面，能报出本地公司名录（题库 resume-deepdive-31）"
    ]
   },
   {
    "t": "h",
    "text": "离职原因话术：环境变 + 诉求升 + 守完最后一班岗"
   },
   {
    "t": "p",
    "text": "离职原因的正确结构 = 『客观环境变化』+『我的诉求升级』，两者缺一就有漏洞。三个模板按真实原因套用：① 项目/公司原因（最安全）——项目停运/公司收缩/团队解散，游戏行业高度可理解，但必须补一句『我把手头模块完整交接、线上稳定期守完才走』体现责任心；② 成长诉求（次安全）——现有项目进入维护期、技术挑战饱和，想找还有增量空间的团队，必须接一句具体想要什么（更完整的链路/更大的并发量级），否则像托词；③ 地域/生活（慎用但真实）——回成都定居是家庭与长期的理性决策，反而强化稳定性叙事。三条铁律：永不说前东家坏话（面试官会想『他以后也这么说我们』）；原因必须和求职动机自洽（说想要技术挑战却投维护岗当场穿帮）；被裁不隐瞒但换框——『团队整体优化，我是整批调整的一员，绩效记录可以查』，个体化归因才致命，集体事件可解释。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">离职原因三件套：环境变 + 诉求升 + 守完最后一班岗</text>\n<rect x=\"30\" y=\"48\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 环境变（客观）</text>\n<text x=\"120\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">项目停运/公司收缩</text>\n<text x=\"120\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">行业可理解</text>\n<text x=\"120\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不甩锅给环境</text>\n<text x=\"120\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">可解释 ≠ 推卸</text>\n<rect x=\"230\" y=\"48\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 诉求升（主动）</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">更完整链路/更大并发</text>\n<text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">必须接具体诉求</text>\n<text x=\"320\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">否则像托词</text>\n<text x=\"320\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">成长诉求要落地</text>\n<rect x=\"430\" y=\"48\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 守完最后一班岗</text>\n<text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">完整交接 + 文档化</text>\n<text x=\"520\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">稳定期守完再走</text>\n<text x=\"520\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">体现责任心</text>\n<text x=\"520\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">留下好口碑</text>\n<path d=\"M210 108 L230 108\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#jm1)\"/>\n<path d=\"M410 108 L430 108\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#jm1)\"/>\n<rect x=\"30\" y=\"186\" width=\"580\" height=\"96\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三条铁律</text>\n<text x=\"60\" y=\"232\" font-size=\"12\" fill=\"var(--muted)\">① 永不说前东家坏话（TA 会想『他以后也这么说我们』）</text>\n<text x=\"60\" y=\"252\" font-size=\"12\" fill=\"var(--muted)\">② 原因必须与求职动机自洽 · ③ 被裁换框：团队整体优化，个体归因才致命</text>\n<defs><marker id=\"jm1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 12：离职原因三件套"
   },
   {
    "t": "h",
    "text": "跳槽频繁的叙事重构：把散点讲成一条有主线的路"
   },
   {
    "t": "p",
    "text": "10 年 4 家被问『是不是太频繁』时，别防御，重构叙事。框架：① 先给行业定性——10 年 4 家在游戏行业属于正常偏稳，游戏行业项目制，项目砍线、公司收缩是常态，平均 2.5 年一段不算频繁；② 逐段给客观理由——每段一句话，必须是『外部原因 + 内部成长』双因，比如『项目被砍，但这段让我把渠道抽象做成了通用资产』；③ 每段都带走资产——强调每家公司都完整经历了项目周期、沉淀了可迁移能力（渠道抽象、GM 基座、工具链），『人走了，产出留下了』；④ 收口表决心——33 岁这个阶段我要的是长期稳定，成都本地 + 方向匹配的岗位我会沉下去做 3 年以上，把年龄从劣势转成稳定性承诺。禁忌：不吐槽任何前东家、不每段都归因外部（全是环境的错 = 你是扫把星）。"
   },
   {
    "t": "h",
    "text": "为什么选我们 + 职业规划：把『稳定性』翻译成『确定性』"
   },
   {
    "t": "p",
    "text": "『为什么选我们』的答案 = 城市确定性 + 公司调研 + 匹配点。城市：成都是长期定居的终局决策（家庭/生活成本，不是过渡跳板）；行业：成都游戏有真实底子（天美/育碧成都/乐狗/卓杭/数字天空等），团队精悍、休闲与出海品类活跃；公司：说出产品线、品类、近期版本动态，接上匹配点——『你们的 XX 品类和我做的 merge/卡牌在用户结构和服务器架构上高度相似，全链路经验可直接复用』。职业规划给『方向明确、路径开放』：成为能独立扛一条产品线服务器架构的人，带不带团队看组织需要；未来 3 年薪资与职级随职责扩大回到与贡献匹配的水平——把规划题变成稳定性背书。红线：不贬低成都市场（『成都没啥好公司』= 你为啥还来），不做伸手党（『你们公司是做什么的』= 自杀式提问）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 跳槽动机三连问的标准话术骨架（离职/为什么选我们/职业规划）\n//\n// 离职：「上一段是项目停运（客观），那段时间我把通用 GM 模块和工具链沉淀了下来（资产）；\n//        现在我想找还有增量空间的项目（诉求升），做更完整的链路。」\n//\n// 为什么选我们：「我看重三点——成都是我的定居决策（家庭、生活成本，终局判断）；\n//        贵司的 XX 品类和我做过的 merge/卡牌在用户结构与服务器架构上高度相似；\n//        团队口碑我在业内听说过（调研证据）。我的全链路经验可以直接复用。」\n//\n// 职业规划：「我想成为能独立扛一条产品线服务器架构的人；\n//        带不带团队看组织需要，33 岁我要的是长期稳定，\n//        方向匹配的岗位我会沉下去做 3 年以上。」"
   },
   {
    "t": "h",
    "text": "动机表达的情绪纪律：理性叙事，不卑不亢"
   },
   {
    "t": "p",
    "text": "离职动机类问题除了内容，情绪和语气同样重要：讲客观原因时语气平淡、不抱怨，讲成长诉求时语气积极、带点期待——让面试官听出你是『已经消化好过去、正在朝前走』的人，而不是『带着情绪找下家』的人。两个小技巧：① 讲被裁或项目停运时，主动补一句『这件事当时对我们团队是遗憾，但对行业是常态，我调整得很快』，把负面事件讲成成熟度；② 讲职业规划时不要表忠心过头（『我一定干到退休』太假），用『方向明确、路径开放、长期投入』的组合，既真诚又留有余地。叙事全程保持『这次选择是深思熟虑的』这个底调，所有细节都为它服务。"
   },
   {
    "t": "pits",
    "items": [
     "离职原因只说『工资低』——纯功利理由显得不稳定，必须环境 + 诉求双因",
     "吐槽前东家——面试官会想『他以后也这么说我们』，永远不说坏话",
     "跳槽频繁不解释或全归因外部——要讲行业定性 + 逐段双因 + 人走资产留",
     "『为什么选我们』没做调研——报不出对方产品线等于态度问题",
     "职业规划给死数字或表现犹豫——方向明确、路径开放，33 岁要落地到长期承诺"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：跳槽动机 = 离职双因三件套（环境变 + 诉求升 + 守完最后一班岗）+ 频繁跳槽叙事重构（行业定性 → 逐段双因 → 人走资产留 → 33 岁承诺）+ 为什么选我们（城市确定性 + 公司调研 + 匹配点）。三题连问本质都在验证同一件事——这次选择是深思熟虑的，你值得长期投入。"
   }
  ]
 },
 {
  "id": "resume-deepdive-soft-skill",
  "title": "软技能与协作：团队协作、跨部门沟通、技术决策、带人与冲突处理",
  "layer": 3,
  "depends": [
   "resume-deepdive-self-intro",
   "resume-deepdive-gm-ops"
  ],
  "covers": [
   "resume-deepdive-20",
   "resume-deepdive-29"
  ],
  "quiz": [
   "resume-deepdive-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "软技能题在游戏服务器岗位是『夹心层必修』——服务器工程师夹在策划、客户端、运维之间，冲突必然发生。最高级的答案不是人际周旋，而是『对事有原则、对人有方法，并且能用工程手段消灭冲突源』。"
   },
   {
    "t": "pre",
    "items": [
     "理解冲突处理三问：对方目标 / 第三条路 / 是否变机制（题库 resume-deepdive-29）",
     "理解 10 年经验的『非 title 领导力』表达（题库 resume-deepdive-20）",
     "准备按对象分类的三个真实协作案例：策划/客户端/运维"
    ]
   },
   {
    "t": "h",
    "text": "冲突处理：三问框架 + 按对象各备一个 STAR 案例"
   },
   {
    "t": "p",
    "text": "冲突题的关键是展示『对事有原则、对人有方法』，并且游戏服务器的冲突大多有技术解。通用框架是冲突三问：① 对方的目标是什么（往往是正当的）？② 技术上有没有第三条路？③ 这次冲突值不值得变成机制/工具？按对象各备一个真实案例：和策划——需求不合理时不给对立（『做不了』），而是给方案分级『方案 A 准实时 Top100（ZSet，成本 1 天）、方案 B 全量实时（成本高 10 倍）』，让策划在知情下做决策；和客户端——联调数据对不上时不上情绪，上日志把收发原文打出来对质 + 推动协议生成工具，把『两端手写不一致』这个冲突根源从机制上消灭；和运维——发版窗口冲突时推动热更新 + 灰度方案，把二选一变成可兼得。收口金句：好的工程师把反复出现的冲突变成工具需求。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 310\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">冲突处理三问：先找正当性，再找第三条路，最后变机制</text>\n<rect x=\"30\" y=\"48\" width=\"580\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第一问 · 他的目标是什么？</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先找对方需求的正当性，不预设对立——往往不是故意刁难，只是要效果</text>\n<path d=\"M320 118 L320 142\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#ss1)\"/>\n<rect x=\"30\" y=\"142\" width=\"580\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"164\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第二问 · 技术上有没有第三条路？</text>\n<text x=\"320\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">给方案分级让 TA 在知情下决策：方案 A 准实时 Top100（1 天）/ 方案 B 全量实时（贵 10 倍）</text>\n<path d=\"M320 212 L320 236\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#ss1)\"/>\n<rect x=\"30\" y=\"236\" width=\"580\" height=\"58\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第三问 · 要不要变成机制/工具？</text>\n<text x=\"320\" y=\"280\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">反复出现的冲突 → 协议工具/联调清单/流程脚本，从机制上消灭冲突源</text>\n<defs><marker id=\"ss1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 13：冲突处理三问"
   },
   {
    "t": "h",
    "text": "跨部门沟通与技术决策：把技术成本翻译成对方听得懂的语言"
   },
   {
    "t": "p",
    "text": "跨部门沟通的核心技能是『翻译』：程序的价值是把技术成本翻译成策划/运营听得懂的取舍。比如策划要『全服实时刷新排行榜』，你别说『做不了』，而是给出成本分级和玩法收益的权衡。技术决策题要能讲一个『你拍板反对了别人方案、事后证明你对』的真实案例：分歧点 → 你的反对理由（性能/复杂度/风险）→ 如何论证（压测/原型）→ 事后验证数据。重点展示决策方法而非固执：不直接否定，用数据说话，小范围验证后再推广。决策如果被推翻也要讲得坦荡——『裁决后全力执行，有异议先记录再服从』，这反而显示成熟。"
   },
   {
    "t": "h",
    "text": "带人经验与非 title 领导力（题库 resume-deepdive-20 相关）"
   },
   {
    "t": "p",
    "text": "33 岁被问『为什么没带团队』时，不要防御，重构为『技术纵深 + 非 title 领导力』：游戏公司服务器团队普遍精悍，我走的是技术纵深路线——核心模块 owner + 工具链建设者，实际承担了技术决策、新人带教、跨部门协作的职责。带人证据：带过 2~3 个新人（给具体故事：怎么帮新人从改 bug 到独立负责模块）、主导过重构方案的技术评审、跨部门协作推动过协议工具落地。表态开放：『往架构师或技术管理走我都能接受，看团队需要。』带人方法论可以讲一条通用的：先复述对方的目标再给方案、问题清单化逐个攻破、把踩过的坑沉淀成文档——这三条既能讲带人也适用协作。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 技术决策题的『方案争议』讲法骨架（STAR 变体）\n//\n// S/T：排行榜方案评审，我提议用 Redis ZSet 准实时，老同事坚持每次操作全量重算。\n// 分歧点：全量重算在操作峰值时 CPU 会打满，且延迟不可控。\n// 我的反对理由：性能（重算 O(N logN) 每次 × 全服玩家）与复杂度（要串行队列）。\n// 论证方式：先跑压测对比两种方案在峰值负载下的 P99，再给数据给组里看。\n// 结果：ZSet 方案 P99 延迟低一个数量级，采纳后运行稳定。\n//\n// 表达要点：① 讲数据不讲对错 ② 承认对方方案的价值再谈代价\n//          ③ 被推翻时：先记录再服从，事后用数据复盘"
   },
   {
    "t": "h",
    "text": "协作案例的选材原则：小而真，胜过又大又空"
   },
   {
    "t": "p",
    "text": "准备协作案例时，宁可选一个『看起来不大但细节经得起追问』的小事，也不要选一个『听起来很厉害但一问就虚』的大事。面试官判断协作能力的依据是细节密度：你和策划当时具体怎么对齐的、你给客户端展示了什么证据、争议里你说了哪句话。一个示范级的『小案例』：某次版本联调，客户端坚持说协议字段顺序服务端发错了，你没有争论，而是给 pipeline 加了收发原始报文日志，两边各自抓包比对，5 分钟定位到是客户端缓存了旧协议版本——这个案例同时展示了沟通方法（用事实代替情绪）和工程手段（日志对质）。收口点：从那以后我推动做了协议版本号校验，两端版本不一致直接报错，类似冲突再没发生过——反复冲突变成工具需求，这就是工程思维治本。"
   },
   {
    "t": "list",
    "items": [
     "选材三问：这个案例里『我』的个人贡献可剥离吗？细节经得起追问吗？结尾有机制化改进吗？",
     "三种对象各备一个：策划（方案分级）、客户端（日志对质+协议工具）、运维（热更灰度）",
     "收口金句：好的工程师把反复出现的冲突变成工具需求——这句话要能脱口而出"
    ]
   },
   {
    "t": "pits",
    "items": [
     "冲突题讲成单方面忍让或硬刚——要讲『对事有原则、对人有方法』",
     "只讲人际周旋不讲工程手段——最高级答案是让反复冲突变成工具需求",
     "技术决策没有数据支撑——说『我觉得应该这样』没有说服力，要用压测/原型论证",
     "带团队问题防御性辩解——重构为技术纵深 + 非 title 领导力（带新人/评审/协作）",
     "跨部门沟通只用技术黑话——核心是『翻译』，把技术成本讲成对方听得懂的取舍"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：软技能 = 冲突三问（目标正当性 → 第三条路 → 变机制）+ 跨部门翻译能力 + 带人非 title 领导力表达。游戏服务器是夹心层，最高级的活法不是周旋而是消灭冲突源——反复出现的冲突变成工具需求，这既是协作题也是工程思维的加分题。"
   }
  ]
 },
 {
  "id": "resume-deepdive-salary-offer",
  "title": "薪资谈判与 offer 选择：期望薪资话术、价值论证、谈薪技巧与背调注意",
  "layer": 3,
  "depends": [
   "resume-deepdive-project-story"
  ],
  "covers": [
   "resume-deepdive-06",
   "resume-deepdive-32"
  ],
  "quiz": [
   "resume-deepdive-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "薪资谈判是『把价格问题变成价值问题』的博弈：先锚定市场与底线、报价给区间留让步空间、让步换转正调薪、用职级带宽反问——谈薪不是讨价还价，是让你 10 年的价值被正确计价。"
   },
   {
    "t": "pre",
    "items": [
     "理解低期望不被当作低能力的三口径（题库 resume-deepdive-06）",
     "掌握报价策略：锚定区间、先问后答、offer 后谈判窗口",
     "了解背调的基本流程与注意点，准备一致口径"
    ]
   },
   {
    "t": "h",
    "text": "期望薪资话术：三条线 + 区间报价 + 先问后答"
   },
   {
    "t": "p",
    "text": "谈薪前先给自己定三条线：生存线（覆盖基本开销）、目标线（当前薪资 × 合理涨幅 + 技能溢价）、心理底线（不低于目标线 80%，低于即止损）。被问『期望薪资多少』时不要先报价，先反问摸底：『想了解岗位薪资结构是底薪 + 绩效 + 年终奖吗？各部分比例如何？』避免被总包高底薪低误导。报价给区间不给自己：『结合我的经验，期望 14~16K，具体可根据职责难度调整』——下限暗示底线、上限留让步空间，避免被锚定低价。区间报价的最佳实践是上限比预期高 10~30%，第一次报价可略高于期望值，谈判窗口最佳在拿到 offer 之后、签合同之前。"
   },
   {
    "t": "h",
    "text": "低期望的化解：把『务实』讲成成熟，而不是能力水分"
   },
   {
    "t": "p",
    "text": "邓凡的期望薪资是 10~12K（成都），面试官问这个不是嫌要得低，是担心『低期望 = 能力水分或市场上被挑剩的』。三个解释口径按情况组合：① 市场口径——成都游戏行业这两年收缩，我研究过本地行情，10~12K 是结合市场供需的务实区间，不代表对能力的定价；② 机会导向口径——薪资不是第一排序，我更看重项目方向和团队，谈的是总包和成长空间，base 可以灵活；③ 结构口径——之前薪资构成里有项目奖金/分红，base 不高，所以这次按市场给。心态：低期望不是劣势，表达成『务实 + 看重长期』就是成熟。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">谈薪五步动线：定线 → 摸底 → 报价 → 破压价 → 收口</text>\n<rect x=\"30\" y=\"48\" width=\"104\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"82\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 定三线</text>\n<text x=\"82\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">生存线</text>\n<text x=\"82\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">目标线（涨幅）</text>\n<text x=\"82\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">心理底线 -20%</text>\n<text x=\"82\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">低于止损</text>\n<rect x=\"150\" y=\"48\" width=\"104\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"202\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 先摸底</text>\n<text x=\"202\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">问薪资结构</text>\n<text x=\"202\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">底薪/绩效/年终</text>\n<text x=\"202\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">不被总包误导</text>\n<rect x=\"270\" y=\"48\" width=\"104\" height=\"130\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 报价区间</text>\n<text x=\"322\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">上限比预期高</text>\n<text x=\"322\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">10~30%</text>\n<text x=\"322\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">留让步空间</text>\n<rect x=\"390\" y=\"48\" width=\"104\" height=\"130\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"442\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 破压价</text>\n<text x=\"442\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">问真限制还是试探</text>\n<text x=\"442\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">亮不可替代性</text>\n<text x=\"442\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">调福利结构</text>\n<text x=\"442\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">不直接降价</text>\n<rect x=\"510\" y=\"48\" width=\"104\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"562\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">⑤ 收口</text>\n<text x=\"562\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">让步换转正调薪</text>\n<text x=\"562\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">价值承诺</text>\n<text x=\"562\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">谈共赢</text>\n<path d=\"M134 113 L150 113\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#so1)\"/>\n<path d=\"M254 113 L270 113\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#so1)\"/>\n<path d=\"M374 113 L390 113\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#so1)\"/>\n<path d=\"M494 113 L510 113\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#so1)\"/>\n<rect x=\"30\" y=\"196\" width=\"580\" height=\"106\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"218\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">谈判时机与纪律</text>\n<text x=\"60\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">最佳窗口：拿到 offer 后、签合同前——对方已认可你，更愿意锁定</text>\n<text x=\"60\" y=\"260\" font-size=\"12\" fill=\"var(--muted)\">谈判三不：不主动降价 · 不用家庭压力等个人理由 · 不带情绪、要书面确认</text>\n<text x=\"60\" y=\"280\" font-size=\"12\" fill=\"var(--muted)\">压价应对：『区间下限是底线，您这边职级体系对应的带宽是多少？』把球踢回去</text>\n<defs><marker id=\"so1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 14：谈薪五步动线"
   },
   {
    "t": "h",
    "text": "价值论证：先把你的价值复述成一句话，再谈钱"
   },
   {
    "t": "p",
    "text": "谈薪时把面试中展示的经验浓缩成一句价值主张再报价：『我能直接接手核心模块并独立闭环——全链路架构、支付幂等、线上稳定性、工具链建设，这些在面试里都有数据支撑。』价值先于价格，报价才有底气。让步的艺术：不主动降价，用『有条件交换』——『如果试用期表现达标，希望转正时有一次调薪评审』，把一次性让步换成期权的承诺；对方说『预算不足』时区分真限制还是试探性压价——真限制就亮不可替代性（『我做过的 XX 技术方案能规避 30% 成本风险』），试探就谈福利调整（提高底薪占比、目标年薪不变）。被压到区间下限也别当场答应，可以『给我一天时间考虑』留白，从容且给对方重新评估机会。"
   },
   {
    "t": "h",
    "text": "offer 选择与背调注意"
   },
   {
    "t": "p",
    "text": "拿到多个 offer 时用比较矩阵决策：薪资（base/绩效/年终/总包）＋ 项目阶段（预研/上线前/稳定运营/增长期）＋ 技术栈匹配度 ＋ 团队稳定性（老员工留存）＋ 城市与通勤 ＋ 成长空间（职级/技术纵深）。游戏项目阶段决定你的工作内容与风险——稳定运营期的项目适合长期沉淀，预研期挑战大但风险也大。背调注意四件事：① 离职原因与入职信息前后一致（HR 会交叉核对）；② 社保与个税记录会暴露空窗期，空窗时长别说谎；③ 薪资结构如实给区间（背调可查），结构里说明 base 与奖金；④ 准备好直属领导的客观评价（负责、能扛事、交接完整），主动欢迎背调本身就是自信的证据。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 谈薪高频对话攻防话术卡（背熟，现场不卡壳）\n//\n// HR：「你的期望薪资是多少？」\n// 你：「想先了解一下这个岗位的薪资结构，是底薪+绩效+年终吗？大概比例？」\n//     （先摸底再报价，避免被总包高底薪低误导）\n//\n// HR：「预算有限，只能给到区间下限。」\n// 你：「我理解。想确认一下，是我某部分经验不符合，还是岗位预算确实如此？\n//      如果确实有限，看能否约定试用期考核达标后有一次转正调薪评审？」\n//     （区分真限制 vs 试探性压价；让步换成有条件的交换，绝不主动降价）\n//\n// HR：「上一份薪资多少？为什么降薪也走？」\n// 你：「之前 base 不高但有项目奖金，薪资结构如此（背调可查）；\n//      离职归到项目停运和成长诉求，与薪资解耦——降薪是换赛道的理性成本。」"
   },
   {
    "t": "h",
    "text": "谈总包：base、绩效、年终、福利一拆到底"
   },
   {
    "t": "p",
    "text": "面试官给的『总包』可能很漂亮，但真实到手的现金流取决于结构，谈判前一定要拆清楚：base 是现金流的锚，绩效年终有浮动（问清系数与兑现惯例），公积金比例影响长期买房，股票期权要问归属期与行权条件。游戏行业的常见结构是『低 base + 高项目奖金』，邓凡自己的经历就是这样——这既是谈薪时解释『base 不高』的现成理由，也提醒你在比较 offer 时别只比总包数字。拆结构的问法示范：『想了解一下这个岗位的薪资构成，base 和绩效的比例大概是多少？年终一般按几个月？公积金按什么基数交？』——问得越具体，越显得你是理性决策的人，也能避免入职后才发现的落差。"
   },
   {
    "t": "pits",
    "items": [
     "面试初期主动提薪资——最佳窗口在 offer 之后，提前提显得急",
     "先报价不用区间——区间报价留让步空间，别把自己锚死在单点",
     "用家庭压力等个人理由要价——专业性崩塌，谈的是价值不是困难",
     "谈判中带情绪或态度强硬——对事温和、对价坚定，留白一天再回",
     "背调口径前后不一——离职原因/薪资/空窗期三处必须一致，社保个税会交叉核对"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：谈薪 = 定三线 + 先摸底 + 区间报价 + 破压价 + 收口五步；价值论证把 10 年经验浓缩成一句话再谈钱；offer 用比较矩阵决策（薪资/项目阶段/技术栈/团队/成长）；背调注意口径一致与如实。记忆钩子：谈薪三不——不自卑、不急让、不谈死。"
   }
  ]
 },
 {
  "id": "resume-deepdive-pressure-questions",
  "title": "高频压力题应对：最大挑战、失败经历、缺点、裁员空窗、加班、35 岁",
  "layer": 3,
  "depends": [
   "resume-deepdive-project-story"
  ],
  "covers": [
   "resume-deepdive-18",
   "resume-deepdive-20",
   "resume-deepdive-22",
   "resume-deepdive-27",
   "resume-deepdive-30",
   "resume-deepdive-34"
  ],
  "quiz": [
   "resume-deepdive-30"
  ],
  "body": [
   {
    "t": "lead",
    "text": "压力题考核的不是你有没有缺点、失败过没有，而是『你在质疑下的心态管理 + 结构化表达』。所有压力题的通用解法是同一个：不防御性辩解，正面重构问题，用『真实但非致命 + 已有行动证据 + 反转成优势』的框架回答。"
   },
   {
    "t": "pre",
    "items": [
     "理解压力题统一框架：不辩解、重构问题、给对比、圆回岗位",
     "掌握空窗期『三有』表达：有产出、有节奏、有方向（题库 resume-deepdive-22）",
     "掌握加班题二分法：战斗性加班 vs 消耗性加班（题库 resume-deepdive-30）"
    ]
   },
   {
    "t": "h",
    "text": "压力题的统一心法：先重构，再回答"
   },
   {
    "t": "p",
    "text": "压力题的陷阱在于它带着攻击性——『10 年怎么还写 CRUD』『为什么没带团队』『怎么被裁了』。一旦防御性辩解（『那个后台很难做的』『不是我的问题』）你就输了。正确的心法是三步：① 不辩解——直接承认表象（『GM 后台确实是 CRUD 的壳』）；② 重构内涵——把壳里装的非基础问题讲出来（运行态稳定性工程/性能工程/安全工程）；③ 换战场——把话题引向你的纵深锚点（网络层/并发/资金链路），并圆回岗位需求（『贵岗位最需要的是 X，我的纵深正好在那』）。这套三步法适用于所有带攻击性的压力题。"
   },
   {
    "t": "h",
    "text": "最大挑战 / 失败经历：STAR + STARR，敢讲错路才真实"
   },
   {
    "t": "p",
    "text": "『最大挑战』用 STAR 讲成功经验，『失败经历』用 STARR 讲：Situation → Task → Action → Result → Reflection（反思）。失败题的高分结构：① 选真实但不致命的失败（某次方案没坚持导致返工、某次看重 title 忽视项目阶段）；② 讲原因不讲借口——『我当时判断失误在 X』；③ 重点在反思与行为改变——『之后我学会用数据和小范围验证争取方案』；④ 落点到对现在的你更好——『现在的我遇到同类问题会先做原型再拍板』。关键纪律：失败必须真实（面试官追问细节会戳穿编的），但不能是岗位核心能力的失败（面并发岗不能说并发不行）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">压力题通用三段式：先重构 → 给真实+证据 → 反转成优势</text>\n<rect x=\"30\" y=\"48\" width=\"580\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第一步 · 不辩解，重构问题</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">『CRUD 确实是壳』→ 壳里装的是稳定性/性能/安全工程——主动换战场</text>\n<path d=\"M320 114 L320 138\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#pq1)\"/>\n<rect x=\"30\" y=\"138\" width=\"580\" height=\"66\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第二步 · 真实但非致命 + 行动证据</text>\n<text x=\"320\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">短板（微服务生产经验）→ 空窗期学习项目跑通全家桶可演示</text>\n<path d=\"M320 204 L320 228\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#pq1)\"/>\n<rect x=\"30\" y=\"228\" width=\"580\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">第三步 · 反转成优势，圆回岗位</text>\n<text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">『知道能力边界的人最安全』+『我的价值正好匹配你们要的 X』</text>\n<rect x=\"30\" y=\"300\" width=\"580\" height=\"26\" rx=\"8\" fill=\"var(--bg)\" stroke=\"none\"/>\n<text x=\"320\" y=\"318\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">适用：最大挑战/失败/缺点/被裁/CRUD 质疑/没带团队</text>\n<defs><marker id=\"pq1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 15：压力题通用三段式"
   },
   {
    "t": "h",
    "text": "缺点与短板题：真实 + 在补 + 反转（题库 resume-deepdive-34）"
   },
   {
    "t": "p",
    "text": "短板题的安全结构 = 『真实但非致命的短板』+『已经在补的证据』+『补短板反而成了优势』。适合邓凡的三个备选：① 微服务生产经验（最安全且真实）——游戏行业单体/分服架构为主，微服务治理生产上用得少，但空窗期用学习项目完整跑通了注册发现、网关、RPC、熔断限流，且能讲清与游戏自研架构的对应关系；② 云原生/K8s——生产经验有限，但容器化与游戏服分线、弹性扩缩容问题域相通，学习成本低；③ 大数据体系——日志服和 BI 做过链路上游，但 Flink/数仓建模深度不如专业大数据工程师。三条纪律：绝不说『我太追求完美』『工作太拼』这种伪短板（直接扣分）；短板不能碰岗位核心要求（面 Java 岗不能说并发不行）；必须有『在补』的动作和证据。收尾反转：『承认短板的位置，恰恰说明我清楚能力边界——这比不知道自己不知道的人安全得多。』"
   },
   {
    "t": "h",
    "text": "被裁/空窗期：三有 + 换框（题库 resume-deepdive-22）"
   },
   {
    "t": "p",
    "text": "被裁与空窗期最忌『休息/找工作』四个字，必须证明这段时间『有产出、有节奏、有方向』。三段式：① 定性——『这是我 10 年职业生涯第一次主动停下来，我做了有计划的间隔，不是被动失业』；② 讲具体产出（核心，必须可验证）——系统性补了微服务体系（用 Nacos/Gateway/Dubbo/Redisson 完整做了一个学习项目并跑通），复盘整理了 10 年技术资产（导表工具、协议生成、GM 基座的通用设计），保持每天固定节奏编码；③ 收口到岗位——『这段时间让我想清楚了方向，下一份工作是长期投入，所以我对岗位匹配度看得比薪资重』，与谈薪务实呼应。纪律：空窗时长不说谎（背调查社保）；学习项目要真的能讲细（被追问『网关路由怎么配的』答不上来反而坐实脱节）；不渲染焦虑（『投了 200 份简历没回音』是自毁）。"
   },
   {
    "t": "h",
    "text": "加班与 35 岁：区分战斗性 vs 消耗性（题库 resume-deepdive-30）"
   },
   {
    "t": "p",
    "text": "加班题不能简单说『接受』（显得假或没家庭概念），也不能说『不接受』（游戏行业直接出局）——要区分两种加班。① 战斗性加班：开服保障、重大版本、线上救火，有明确目标和期限，我全力投入且经验丰富（可举例某次开服守了 36 小时、做了哪些预案）；② 消耗性加班：排期不合理、返工、流程混乱导致的常态化无效加班，我更擅长用工程手段减少它（导表工具减少配表返工、热更新减少停服窗口、监控告警减少救火）。33 岁差异化表达：我更看重单位时间产出而不是耗时长——十年经验让我把很多要加班解决的问题消灭在设计阶段。35 岁问题的核心是『稳定性 + 经验溢价』：游戏行业精悍团队要的正是不用教的中年人，你的价值是让团队少走弯路、少加班、少踩坑。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 压力题速查卡（面试前过一遍，每题 30 秒给结构）\n// 最大挑战  → STAR 成功经验：背景/难点量化/方案权衡/量化结果\n// 失败经历  → STARR：真实但不致命 + 原因不讲借口 + 反思后的行为改变\n// 缺点      → 真实非致命 + 在补证据 + 反转『知道边界最安全』\n// 被裁/空窗 → 三有：有产出（学习项目）+ 有节奏（每天编码）+ 有方向（想清楚才求职）\n// 加班      → 二分法：战斗性全力扛 + 消耗性用工程手段消灭\n// 35 岁     → 稳定性 + 经验溢价：不用教的中年人，让团队少走弯路\n// CRUD 质疑 → 三步：承认壳 → 讲芯（稳定性/性能/安全）→ 换战场到纵深\n// 没带团队  → 技术纵深 + 非 title 领导力：带新人/方案评审/跨部门协作"
   },
   {
    "t": "pits",
    "items": [
     "防御性辩解——『那个后台很难做的』越描越黑，必须重构问题换战场",
     "伪短板——『太追求完美』『太拼』是减分项，面试官一听就识破",
     "失败题讲成别人坑我——原因必须在自己，敢讲错路才真实",
     "空窗期只说休息找工作——必须三有（产出/节奏/方向），时长别说谎",
     "加班题无底线承诺或直接拒绝——二分法才是成熟答案，战斗性 vs 消耗性"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：压力题通用三段式 = 先重构（不辩解）→ 真实非致命 + 行动证据 → 反转成优势圆回岗位。逐题备好速查卡：失败用 STARR、空窗讲三有、加班二分法、35 岁讲稳定性与经验溢价。记忆钩子：面试官考的不是你的短板，是你对短板的态度。"
   }
  ]
 },
 {
  "id": "resume-deepdive-mock",
  "title": "全真模拟与临场技巧：追问链模拟、答题框架、紧张应对、反问清单、复盘模板",
  "layer": 3,
  "depends": [
   "resume-deepdive-netty",
   "resume-deepdive-concurrency-jvm"
  ],
  "covers": [
   "resume-deepdive-32",
   "resume-deepdive-33"
  ],
  "quiz": [
   "resume-deepdive-32"
  ],
  "body": [
   {
    "t": "lead",
    "text": "考前最后一篇：把所有方法变成肌肉记忆。全真模拟的意义不是预测题，而是练『追问链的应对』和『紧张下的结构化表达』——真实面试里 80% 的表现取决于你提前把框架和话术练到了脱口而出的程度。"
   },
   {
    "t": "pre",
    "items": [
     "完成本分类 1~15 篇的要点（自我介绍/项目/技术专项/软技能/谈薪）",
     "准备一个能讲 20 分钟的『纵深主题』（Disruptor 或支付幂等），面试官要的是把一条讲穿",
     "准备反问提问清单（题库 resume-deepdive-32）与复盘模板"
    ]
   },
   {
    "t": "h",
    "text": "追问链模拟：准备『三层答案』，让每个钩子都有接得住的下文"
   },
   {
    "t": "p",
    "text": "面试官会顺着你的回答连续追问 2~3 层，追问链模拟就是为每个钩子准备三层答案。方法：选 5 个你最可能抛出的钩子（如 Disruptor 玩家级串行、支付幂等、渠道抽象、GM 重构、Kafka 积压），每个钩子写三层：第一层 30 秒概述（结论 + 为什么）；第二层 2 分钟展开（机制 + 权衡 + 项目实例）；第三层 5 分钟下钻（底层原理 + 边界 + 反例）。练法：让朋友/同事当面试官连续追问『为什么？具体怎么做的？遇到过什么坑？怎么发现的？』，练到任何一层都能脱口而出。题库里每题都带了 followups，直接把那些追问链练熟是最省力的模拟。"
   },
   {
    "t": "h",
    "text": "答题框架：六种万能骨架，覆盖 90% 的问题"
   },
   {
    "t": "p",
    "text": "把高频问题归到六种框架，任何题都能套：① 项目题——STAR/四段式（背景-难点-方案-量化）；② 技术原理题——『是什么 → 为什么 → 怎么用 → 底层原理 → 游戏场景落地 → 坑』；③ 设计题——需求澄清 → 容量估算 → 架构 → 关键细节 → 取舍；④ 对比题——『先讲两者各自是什么，再讲差异维度，最后给选型结论 + 场景』；⑤ 观点题——『给立场 + 给理由 + 给边界』；⑥ 压力题——重构 → 真实 + 证据 → 反转。面试时先停顿 2 秒想框架再开口，有条理比快重要——『我先把答案结构过一遍』这个动作本身就是成熟表现。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">全真模拟三件套：追问链三层 → 六种框架 → 复盘闭环</text>\n<rect x=\"30\" y=\"46\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">追问链三层</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">L1：30 秒概述</text>\n<text x=\"120\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">L2：2 分钟展开</text>\n<text x=\"120\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">L3：5 分钟下钻</text>\n<text x=\"120\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">5 个钩子 × 3 层</text>\n<rect x=\"230\" y=\"46\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">六种答题框架</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">STAR · 原理六问</text>\n<text x=\"320\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">设计五步 · 对比</text>\n<text x=\"320\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">观点 · 压力重构</text>\n<text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">先想框架再开口</text>\n<rect x=\"430\" y=\"46\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">复盘闭环</text>\n<text x=\"520\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">记录问题清单</text>\n<text x=\"520\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">标红卡壳点</text>\n<text x=\"520\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">补齐话术再练</text>\n<text x=\"520\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">每次面完进步</text>\n<path d=\"M210 111 L230 111\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#mk1)\"/>\n<path d=\"M410 111 L430 111\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#mk1)\"/>\n<rect x=\"30\" y=\"196\" width=\"580\" height=\"116\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"218\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">临场三纪律</text>\n<text x=\"60\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">① 紧张应对：深呼吸 + 语速放慢 + 停顿想框架，紧张时先复述问题拖时间</text>\n<text x=\"60\" y=\"260\" font-size=\"12\" fill=\"var(--muted)\">② 不会的题：诚实说不会 + 给思路 + 反抛相关经验（『原理没背熟，但我在项目里处理过类似问题』）</text>\n<text x=\"60\" y=\"280\" font-size=\"12\" fill=\"var(--muted)\">③ 结尾反问：问题池按角色选 2~3 个，问完补一句自我推销把反问变二次营销</text>\n<defs><marker id=\"mk1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 16：全真模拟三件套"
   },
   {
    "t": "h",
    "text": "紧张应对：从生理到表达的三层解法"
   },
   {
    "t": "p",
    "text": "紧张是生理反应，靠『告诉自己别紧张』没用。三层解法：① 生理层——面试前深呼吸（4 秒吸气 6 秒呼气，做 3 轮）降心率，进场时放慢语速，语速慢下来大脑才跟得上；② 认知层——把面试当『双向评估』而不是考试：我在评估这家公司值不值得长期投入，这个心态会极大降低被审视感；③ 表达层——紧张时最容易忘词，用『停顿 + 复述』兜底：『您这个问题是问 XX，我分三点说』——复述问题给自己争取 3 秒组织时间，也给面试官『你听懂了』的信号。真不会的题：诚实说『这块我原理没背熟』，但立刻补『不过我在项目里处理过类似问题，逻辑是 XX』——把不会变成相关经验展示，比硬编强十倍。"
   },
   {
    "t": "h",
    "text": "反问环节：提问清单 + 问完补推销（题库 resume-deepdive-32 重点）"
   },
   {
    "t": "p",
    "text": "反问是最后一次立人设的机会，问题要体现『我在认真评估长期投入』。按角色选 2~3 个：问技术面试官——『服务器团队目前技术债里最想解决的一件事是什么？』『项目在线量级和架构形态？未来一年有架构演进计划吗？』『团队开服/发版流程和值班机制是怎样的？』；问 leader/HR——『这个岗位 3 个月/半年内您最希望我交付的第一件事是什么？』（最强问题，直接对齐期望）『团队技术氛围如何？有技术分享或方案评审机制吗？』『项目组目前处于什么阶段？』。可以谈但要放最后的：薪资结构、加班制度。禁忌：能自己查到的（『你们做什么游戏』）、只关心享受的（首问福利）、挑战面试官的。收尾话术：问完补一句『今天聊下来我对咱们项目 XX 方向更感兴趣了，我过往的 XX 经验应该能快速上手』——把反问变成第二次自我推销。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 面试复盘模板（面完 1 小时内写完，赶在记忆消失前）\n//\n// 一、问题清单（按类别记录）\n//   项目类：______（卡壳点：______）\n//   技术类：______（没答好：______）\n//   软技能：______（可以更好：______）\n//   谈薪/反问：______（下次调整：______）\n//\n// 二、三个钩子执行情况\n//   抛出的钩子：______  面试官咬钩了吗：是/否  接住了吗：______\n//\n// 三、时间与节奏复盘\n//   自我介绍超时了吗：______  方案段占比够 60% 吗：______\n//\n// 四、下次改进清单（最多 3 条，别贪多）\n//   1. ______  2. ______  3. ______"
   },
   {
    "t": "h",
    "text": "临场表达两个小动作：先给结论，分点作答"
   },
   {
    "t": "p",
    "text": "即使不紧张，表达习惯也决定印象分。两个最有效的动作：① 先给结论再展开——所有回答第一句先亮观点（『我认为应该用 X，理由有三点』），面试官不用猜你的立场，你也逼自己把逻辑想清楚再开口；② 分点作答——用『第一、第二、第三』或『从网络层、数据层、监控层三个角度看』这种显式结构，既控制节奏也让面试官好记。10 年经验的表达气质不是口若悬河，而是『每条都讲完、每点都收口』的稳定性——宁可讲得慢一点、短一点、结构化一点，也别让人听不出重点。"
   },
   {
    "t": "pits",
    "items": [
     "只准备问题不准备追问链——真实面试是连续追问，把 followups 练熟才是模拟",
     "答题没框架就开口——停顿 2 秒想框架，有条理比快重要",
     "紧张时语速失控——放慢语速 + 复述问题兜底，生理层先解决",
     "不会的题硬编——诚实 + 给思路 + 反抛相关经验，比编造安全十倍",
     "反问环节空手——按角色备 2~3 个问题，问完补一句自我推销；首问福利是大忌"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：全真模拟 = 追问链三层准备（5 个钩子 × 3 层）+ 六种答题框架（STAR/原理六问/设计五步/对比/观点/压力重构）+ 临场三纪律（深呼吸放慢、不会就诚实+思路、反问当二次营销）。面完 1 小时内复盘写模板，把每一次面试变成下一次的弹药。祝你拿下 offer。"
   }
  ]
 }
]
};
