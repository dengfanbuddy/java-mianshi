window.TB = window.TB || {};
window.TB["design-pattern"] = {
  id: "design-pattern",
  name: "设计模式",
  icon: "🧩",
  nodes: [
 {
  "id": "design-pattern-overview",
  "title": "设计模式总览与设计原则",
  "layer": 0,
  "depends": [],
  "covers": [
   "design-pattern-17"
  ],
  "quiz": [
   "design-pattern-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "设计模式是面向对象世界里被反复验证过的「问题-方案」命名对，而设计原则是比模式更底层的判断依据——先懂为什么，再背是什么，23 个模式才不会变成 23 个孤岛。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 Java 基础：类、接口、继承、多态、组合",
     "有游戏服分层概念：Handler / Service / Dao / 配置表",
     "写过一些 if-else 堆出来的业务代码，能感受到变差的成本"
    ]
   },
   {
    "t": "h",
    "text": "什么是设计模式：GOF 23 分类"
   },
   {
    "t": "p",
    "text": "1994 年 Erich Gamma 等四人（Gang of Four）出版《设计模式：可复用面向对象软件的基础》，系统总结了面向对象领域反复出现的 23 种模式，按「目的」分为三类：创建型 5 种——关注「怎么创建对象」（单例、工厂方法、抽象工厂、建造者、原型）；结构型 7 种——关注「类和对象怎么组合成更大的结构」（适配器、桥接、组合、装饰、外观、享元、代理）；行为型 11 种——关注「对象之间怎么协作、职责怎么分配」（责任链、命令、解释器、迭代器、中介者、备忘录、观察者、状态、策略、模板方法、访问者）。另有一种按「作用范围」的分类：类模式靠继承实现（工厂方法、类适配器、模板方法、解释器），对象模式靠组合实现（其余 19 种）。现代工程里组合优先于继承，所以对象模式远比类模式常用。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 360\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">GoF 23 种设计模式全景</text>\n<rect x=\"40\" y=\"48\" width=\"170\" height=\"34\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"125\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">创建型（5 种）</text>\n<rect x=\"235\" y=\"48\" width=\"170\" height=\"34\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">结构型（7 种）</text>\n<rect x=\"430\" y=\"48\" width=\"170\" height=\"34\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"515\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">行为型（11 种）</text>\n<rect x=\"40\" y=\"96\" width=\"170\" height=\"150\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"60\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">单例 Singleton</text>\n<text x=\"60\" y=\"150\" font-size=\"13\" fill=\"var(--ink)\">工厂方法 Factory</text>\n<text x=\"60\" y=\"176\" font-size=\"13\" fill=\"var(--ink)\">抽象工厂 Abstract</text>\n<text x=\"60\" y=\"202\" font-size=\"13\" fill=\"var(--ink)\">建造者 Builder</text>\n<text x=\"60\" y=\"228\" font-size=\"13\" fill=\"var(--ink)\">原型 Prototype</text>\n<rect x=\"235\" y=\"96\" width=\"170\" height=\"150\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">适配器 Adapter</text>\n<text x=\"255\" y=\"150\" font-size=\"13\" fill=\"var(--ink)\">桥接 Bridge</text>\n<text x=\"255\" y=\"176\" font-size=\"13\" fill=\"var(--ink)\">组合 Composite</text>\n<text x=\"255\" y=\"202\" font-size=\"13\" fill=\"var(--ink)\">装饰 Decorator</text>\n<text x=\"255\" y=\"228\" font-size=\"13\" fill=\"var(--ink)\">外观 Facade</text>\n<text x=\"255\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">享元 / 代理</text>\n<rect x=\"430\" y=\"96\" width=\"170\" height=\"150\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"450\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">策略 / 模板方法</text>\n<text x=\"450\" y=\"150\" font-size=\"13\" fill=\"var(--ink)\">观察者 / 责任链</text>\n<text x=\"450\" y=\"176\" font-size=\"13\" fill=\"var(--ink)\">状态 / 命令</text>\n<text x=\"450\" y=\"202\" font-size=\"13\" fill=\"var(--ink)\">迭代器 / 中介者</text>\n<text x=\"450\" y=\"228\" font-size=\"13\" fill=\"var(--ink)\">备忘录 / 访问者</text>\n<text x=\"450\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">解释器</text>\n<rect x=\"40\" y=\"272\" width=\"560\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"296\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">一个模式 = 一个反复出现的痛点 + 一套经过验证的解法</text>\n<text x=\"320\" y=\"320\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服高频：单例（配置表）工厂（奖励/渠道）策略（算法族）状态机（订单/战斗）命令（GM/回放）享元（地图格子）</text>\n</svg>",
    "caption": "图 1：GoF 23 种模式按目的三分——创建 5 / 结构 7 / 行为 11"
   },
   {
    "t": "h",
    "text": "面向对象设计原则：SOLID 六原则"
   },
   {
    "t": "p",
    "text": "面试里「SOLID」五个字母对应五个原则，加上工程界公认的「组合优于继承」和「依赖抽象而非具体」，构成模式背后真正的地基：单一职责原则（SRP）——一个类只为一个变化原因负责，改动的理由越少越好；开闭原则（OCP）——对扩展开放、对修改关闭，新增需求靠加代码而不是改老代码；里氏替换原则（LSP）——子类必须能替换父类而不破坏行为约定，重写父类方法时不能放宽前置条件、收紧后置条件；接口隔离原则（ISP）——客户端不该被迫依赖它不用的方法，胖接口拆成小接口；依赖倒置原则（DIP）——高层不依赖低层，两者都依赖抽象；组合优于继承——用「持有对象、委托调用」代替「继承绑定」，运行期可换、类层次不深。游戏服里「协议分发框架」「奖励系统」「活动框架」能长期演进不烂尾，靠的全是这几条。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">SOLID 五原则 + 两条工程信条</text>\n<rect x=\"30\" y=\"46\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">S 单一职责</text>\n<text x=\"120\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一个类只为一个理由而变</text>\n<rect x=\"230\" y=\"46\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">O 开闭原则</text>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">扩展开放，修改封闭</text>\n<rect x=\"430\" y=\"46\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">L 里氏替换</text>\n<text x=\"520\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">子类不破坏父类约定</text>\n<rect x=\"30\" y=\"116\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">I 接口隔离</text>\n<text x=\"120\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">瘦接口，不用不依赖</text>\n<rect x=\"230\" y=\"116\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">D 依赖倒置</text>\n<text x=\"320\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">都依赖抽象不依赖具体</text>\n<rect x=\"430\" y=\"116\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">组合优于继承</text>\n<text x=\"520\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">运行期可换，层次不深</text>\n<rect x=\"30\" y=\"196\" width=\"580\" height=\"86\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">DRY 不要重复自己 ｜ KISS 保持简单 ｜ YAGNI 你不会需要它</text>\n<text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DRY：同一事实只存一处（奖励发放只写一套）</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">KISS：直白可读优先 ｜ YAGNI：不为想象中的需求提前造抽象</text>\n</svg>",
    "caption": "图 2：SOLID 五原则与 DRY/KISS/YAGNI 三信条"
   },
   {
    "t": "h",
    "text": "DRY / KISS / YAGNI：模式使用的刹车片"
   },
   {
    "t": "p",
    "text": "这三个词是模式使用的「刹车片」。DRY（Don't Repeat Yourself）——同样的规则只维护一处，比如游戏服的奖励发放逻辑只写一套，别在背包、邮件、活动里各复制一份；但 DRY 反对的是「复制事实」，不是「复制代码」，两段恰好长得像但语义不同的代码硬抽公共方法反而是负担。KISS（Keep It Simple, Stupid）——直白的代码优先，间接层是有成本的，读代码的人跳五个文件才看懂一行业务，是负资产。YAGNI（You Aren't Gonna Need It）——不为「万一以后」写代码，Rule of Three 是黄金判据：同一个变化出现了第三次，才值得抽象。游戏服热路径（战斗结算、状态同步）尤其要克制：模式带来的间接层在百万次调用下就是真实开销。"
   },
   {
    "t": "h",
    "text": "什么时候用模式，什么时候别用"
   },
   {
    "t": "p",
    "text": "判断标准只有一个：痛点真实存在吗？三问框架可以套在任何模式决策上：变化点真实吗——「下季度确定接 iOS 渠道」提前抽渠道策略合理，「万一哪天要换数据库」纯属猜测；复杂度付得起吗——一个被调两次的流程套工厂加策略三层抽象，维护成本超过收益；团队接得住吗——再优雅的设计，团队没人会改、不敢改，就是负资产。反过来，识别反模式也很重要：God Class（一个类什么都管，几百个字段）、死代码、复制粘贴式修改、霰弹式修改（改一个需求要动七八个类）、猜疑式过早抽象。面试时能讲出「哪里不该用模式、为什么」，比背 23 个模式的结构更体现十年功力。"
   },
   {
    "t": "pits",
    "items": [
     "背出 23 个模式名字但说不出任何一个对应痛点——面试官立刻判定背书",
     "把 SOLID 和 DRY/KISS/YAGNI 混为一谈，说不出两者是「原则」与「信条」的关系",
     "答「设计模式就是让代码更优雅」这种空话，没有落到「管理变化、隔离耦合、控制复杂度」上",
     "鼓吹模式万能，被反问「热路径上接口多态的开销」就哑火——不懂 JIT 内联和过度设计的边界",
     "识别不出反模式：把「一个类 500 行」说成职责饱满，其实违反 SRP"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：设计模式 = 对反复出现的痛点的命名解法，23 种分创建/结构/行为三族；SOLID 六原则是模式的价值观，DRY/KISS/YAGNI 是模式使用的刹车片；判断标准就一条——痛点真实存在才上模式，Rule of Three 是节流阀。后面 15 篇会逐个拆解模式结构，并把每个模式落到游戏服务器的真实场景。"
   }
  ]
 },
 {
  "id": "design-pattern-singleton",
  "title": "创建型：单例模式",
  "layer": 0,
  "depends": [
   "design-pattern-overview"
  ],
  "covers": [
   "design-pattern-01"
  ],
  "quiz": [
   "design-pattern-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "单例模式保证一个类全局只有一个实例并对外提供统一访问点——游戏服的配置表管理器、全局线程池、ID 生成器都是它的经典地盘，但单例保的是「只有一个实例」，保不了「字段并发安全」，这是面试官最爱挖的坑。"
   },
   {
    "t": "pre",
    "items": [
     "理解类加载机制：类初始化时 JVM 有锁保证",
     "理解 volatile 与指令重排：DCL 的核心考点",
     "知道反射和序列化的基本行为"
    ]
   },
   {
    "t": "h",
    "text": "五种经典写法逐个拆"
   },
   {
    "t": "p",
    "text": "饿汉式：类加载即 new，由 JVM 类初始化锁保证线程安全，写法最简单，缺点是一旦类被引用（哪怕没用 getInstance）实例就创建，可能白占资源；懒汉式（同步方法）：getInstance 加 synchronized，线程安全但每次调用都抢锁，性能差，生产基本不用；DCL 双重检查锁：两次判空加锁，只有第一次创建才进同步块，性能最好，但 instance 字段必须加 volatile——这是高频考点，原理在下图；静态内部类：Holder 类被调用时才加载初始化，JVM 锁保证线程安全，无锁开销，同时实现懒加载，代码最优雅；枚举单例：Effective Java 作者 Josh Bloch 强烈推荐，写法最短，且天然免疫反射和序列化两种破坏方式。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">DCL 为什么要 volatile：new 不是一步的</text>\n<rect x=\"30\" y=\"44\" width=\"170\" height=\"66\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 分配内存</text>\n<text x=\"115\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">堆上划出对象空间</text>\n<rect x=\"235\" y=\"44\" width=\"170\" height=\"66\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 初始化对象</text>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">构造器执行、字段赋值</text>\n<rect x=\"440\" y=\"44\" width=\"170\" height=\"66\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 引用赋值</text>\n<text x=\"525\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">instance 指向该内存</text>\n<path d=\"M200 77 L235 77\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#sg1)\"/>\n<path d=\"M405 77 L440 77\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#sg1)\"/>\n<defs><marker id=\"sg1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<rect x=\"30\" y=\"130\" width=\"580\" height=\"56\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"154\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">JIT 可能重排序成 ① → ③ → ②：引用先被看到，对象还没初始化</text>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">另一个线程判空通过，拿到的 instance 是「半初始化对象」——字段是默认值！</text>\n<rect x=\"30\" y=\"204\" width=\"580\" height=\"46\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"226\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">volatile 禁止重排序 + 保证可见性 → 杜绝拿到半初始化对象</text>\n<text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">这是《Java 并发编程实战》明确要求的写法，漏了 volatile 就是隐蔽线上 bug</text>\n</svg>",
    "caption": "图 1：DCL 指令重排风险与 volatile 的作用"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// ① 饿汉式：类加载即创建，最简单，可能白占资源\npublic class GameConfigV1 {\n    private static final GameConfigV1 INSTANCE = new GameConfigV1();\n    private GameConfigV1() { load(); }\n    public static GameConfigV1 getInstance() { return INSTANCE; }\n}\n\n// ② DCL + volatile：懒加载 + 高性能，但写起来最容易漏 volatile\npublic class GameConfigV2 {\n    private static volatile GameConfigV2 instance;  // volatile 必须有\n    private GameConfigV2() { load(); }\n    public static GameConfigV2 getInstance() {\n        if (instance == null) {              // 第一次判空：不进锁\n            synchronized (GameConfigV2.class) {\n                if (instance == null) {      // 第二次判空：锁内确认\n                    instance = new GameConfigV2();\n                }\n            }\n        }\n        return instance;\n    }\n}\n\n// ③ 静态内部类：懒加载 + 无线程安全问题 + 无锁，最优雅\npublic class GameConfigV3 {\n    private GameConfigV3() { load(); }\n    private static class Holder {\n        private static final GameConfigV3 INSTANCE = new GameConfigV3();\n    }\n    public static GameConfigV3 getInstance() { return Holder.INSTANCE; }\n}\n\n// ④ 枚举单例：Effective Java 推荐，防反射 + 防序列化\npublic enum GameConfigV4 {\n    INSTANCE;                                // 唯一实例，JVM 保证\n    private Map<Integer, ItemCfg> itemCfg;\n    public void load() { /* 导表加载 */ }\n    public ItemCfg getItemCfg(int id) { return itemCfg.get(id); }\n}"
   },
   {
    "t": "h",
    "text": "容器单例与 Spring 单例的辨析"
   },
   {
    "t": "p",
    "text": "Spring 的单例 Bean 和单例模式不是一回事：Spring 单例是「容器作用域」概念——每个 Spring 容器内同一个 Bean 名只有一个实例，靠容器管理、不防反射，但可注入、可替换、方便测试；单例模式是「类加载器级别」的实例唯一，靠私有构造器硬控。游戏服里两者经常叠加：配置表管理器、全局线程池这种进程级资源用静态单例（或静态内部类），业务 Service/Handler 交给 Spring 容器托管。还有一个注意点：Spring 单例 Bean 默认是单例，但 Bean 内部的可变字段如果被多个线程改，同样是并发问题——容器管的是「一个实例」，管不了「字段安全」。"
   },
   {
    "t": "h",
    "text": "游戏服单例的实战姿势与坑"
   },
   {
    "t": "p",
    "text": "游戏服的典型单例：全局配置表管理器（所有策划表只加载一份，所有模块共享只读）、全局线程池/执行器（玩家逻辑线程池、定时任务调度器）、ID 生成器（雪花算法）、日志打点器。实战里有两个高频坑：一是「单例只保证一个实例，不保证字段并发安全」——多个逻辑线程同时读写单例里的可变 Map 会出问题，配置热更的正确姿势是构建好新配置对象后整对象替换（AtomicReference），读线程永远拿到完整一致的新旧快照，而不是边读边改；二是枚举单例天然防序列化破坏——普通单例实现 Serializable 后反序列化会创建新对象，必须重写 readResolve() 返回原实例，而枚举反序列化按名字 valueOf 返回唯一实例，JVM 层面免疫。"
   },
   {
    "t": "pits",
    "items": [
     "DCL 漏 volatile：只背了双检锁结构，说不清 new 三步与重排序——必扣分点",
     "答不出反射和序列化怎么破坏单例：反射 setAccessible 调私有构造器；反序列化 readObject 生成新对象",
     "枚举为什么防得住：反射 newInstance 对枚举类直接抛 IllegalArgumentException；枚举序列化只写名字，反序列化 valueOf 按名找回",
     "把 Spring 单例 Bean 和单例模式划等号：一个是容器作用域，一个是类加载器级唯一",
     "忽略字段并发安全：单例的 Map 被多线程改，照样 ConcurrentModificationException；热更要 AtomicReference 整对象替换"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：生产只用饿汉/静态内部类/DCL+volatile/枚举四种；DCL 的 volatile 防指令重排导致半初始化对象外泄；枚举靠 JVM 机制免疫反射与序列化；游戏服单例的深水区不是「怎么创建一个」，而是「单例里的可变状态怎么并发安全」——配置热更用 AtomicReference 整对象替换。下一篇讲工厂模式三兄弟，单例常与工厂搭配解决「唯一 + 创建」。"
   }
  ]
 },
 {
  "id": "design-pattern-factory",
  "title": "创建型：工厂模式三兄弟",
  "layer": 1,
  "depends": [
   "design-pattern-singleton"
  ],
  "covers": [
   "design-pattern-02"
  ],
  "quiz": [
   "design-pattern-02"
  ],
  "body": [
   {
    "t": "lead",
    "text": "简单工厂、工厂方法、抽象工厂是抽象层次递进的三种创建手段——从「一个工厂造一切」到「一种产品一个工厂」再到「一族产品一套工厂」，游戏服的奖励发放、渠道接入、协议编解码器工厂全靠它们。"
   },
   {
    "t": "pre",
    "items": [
     "掌握接口与多态：面向接口编程是工厂的地基",
     "理解开闭原则：新增代码而不是修改老代码",
     "有游戏服奖励/渠道/协议的基础认知"
    ]
   },
   {
    "t": "h",
    "text": "三兄弟的抽象层次差异"
   },
   {
    "t": "p",
    "text": "简单工厂不是 GoF 23 之一，但它最常用：一个静态方法按类型参数返回不同产品（RewardFactory.create(type)）。优点是简单直白；缺点是每加一种产品就要改工厂类里的 if-else/switch，违反开闭原则，产品多了方法会膨胀。工厂方法把创建逻辑下沉到子类：定义抽象工厂接口，每种产品一个具体工厂类（GoldRewardFactory、ItemRewardFactory），新增产品 = 新增一个工厂类，不改老代码，符合开闭原则，代价是类数量翻倍。抽象工厂更进一步：一个工厂生产「一族相关产品」，典型场景是跨平台 UI 库（一套按钮 + 文本框 + 滚动条），对应到游戏就是「渠道服全家桶」——每个渠道的登录器、支付器、分享器由同一个渠道工厂统一产出，切换平台只换工厂，从结构上避免跨平台对象混搭错配。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">工厂三兄弟对比</text>\n<rect x=\"30\" y=\"42\" width=\"580\" height=\"76\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"50\" y=\"66\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">简单工厂</text>\n<text x=\"50\" y=\"88\" font-size=\"12\" fill=\"var(--muted)\">一个静态方法 create(type) 返回不同产品 ｜ 实现最直白</text>\n<text x=\"50\" y=\"106\" font-size=\"12\" fill=\"var(--lv2)\">缺点：加产品要改工厂 if-else，违反开闭原则</text>\n<rect x=\"30\" y=\"130\" width=\"580\" height=\"76\" rx=\"8\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"50\" y=\"154\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">工厂方法</text>\n<text x=\"50\" y=\"176\" font-size=\"12\" fill=\"var(--muted)\">抽象工厂接口 + 每种产品一个工厂类 ｜ 新增产品 = 新增类</text>\n<text x=\"50\" y=\"194\" font-size=\"12\" fill=\"var(--lv2)\">符合开闭原则，代价是类变多</text>\n<rect x=\"30\" y=\"218\" width=\"580\" height=\"76\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"50\" y=\"242\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">抽象工厂</text>\n<text x=\"50\" y=\"264\" font-size=\"12\" fill=\"var(--muted)\">一个工厂生产「一族相关产品」：登录器 + 支付器 + 分享器</text>\n<text x=\"50\" y=\"282\" font-size=\"12\" fill=\"var(--lv2)\">切换平台只换工厂，整套对象配套产出，防混搭错配</text>\n</svg>",
    "caption": "图 1：三种工厂的抽象层次递进"
   },
   {
    "t": "h",
    "text": "游戏落地一：奖励发放 = 简单工厂 + 注册表（叠加策略）"
   },
   {
    "t": "p",
    "text": "游戏服的奖励类型几十种（金币/钻石/道具/经验/体力/抽卡券……），最实用的不是写死 switch，而是「简单工厂 + 注册表」混合方案：每种奖励一个 RewardHandler，启动时按 type 注册进 Map<Integer, RewardHandler>，发放时查表取 Handler 执行。本质是把简单工厂的 if-else 换成查表，再叠加策略模式。工程收益非常实在：新增奖励只加一个类、不动分发逻辑，回归风险小；注册表在启动期能校验重复 type 直接 fail-fast；每个 Handler 可独立单测；配合 Spring 还能按类型自动收集注册，零配置扩展。面试加分点：主动提 Spring 的 FactoryBean、BeanFactory 就是工厂模式的工业级实现。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 奖励发放：简单工厂 + 注册表 + 策略 的混合方案\npublic interface RewardHandler {\n    int type();\n    void grant(Player player, RewardParams params);\n}\n\n@Component(\"rewardGold\")\npublic class GoldRewardHandler implements RewardHandler {\n    public int type() { return 1; }              // 1 = 金币\n    public void grant(Player player, RewardParams p) {\n        player.addGold(p.getAmount());           // 具体发放逻辑\n    }\n}\n\n@Component\npublic class RewardService {\n    // Spring 自动把容器里所有 RewardHandler 按 Bean 名装配成 Map\n    private final Map<String, RewardHandler> handlerMap;\n    public RewardService(Map<String, RewardHandler> handlerMap) {\n        this.handlerMap = handlerMap;\n    }\n    public void grant(Player player, int type, RewardParams params) {\n        RewardHandler h = handlerMap.get(\"reward\" + type);  // 查表而非 switch\n        if (h == null) throw new IllegalArgumentException(\"未知奖励类型: \" + type);\n        h.grant(player, params);\n    }\n}"
   },
   {
    "t": "h",
    "text": "游戏落地二：协议编解码器工厂与抽象渠道工厂"
   },
   {
    "t": "p",
    "text": "协议层也是工厂的重灾区：客户端每个协议号对应一个编解码器，用 Map<Integer, Codec> 在启动期注册（本质是简单工厂 + 注册表），解码时按协议号查表——这和协议分发框架天然衔接。抽象工厂则用在渠道接入：每个平台（华为/小米/苹果/官方）是一族产品——登录器 + 支付器 + 推送器 + 分享器。定义抽象渠道工厂 ChannelFactory 声明 createLogin/ createPay/createPush 四个创建方法，各平台工厂各实现一套，切换渠道只换工厂实例，整套对象配套产出。这样做的核心价值：从类型系统层面防止「华为登录器 + 小米支付器」这种跨平台混搭，比人肉检查靠谱得多。"
   },
   {
    "t": "pits",
    "items": [
     "答不出三者抽象层次的递进，只说「都是创建对象的」——等于没答",
     "简单工厂的缺点说不清：加产品要改工厂类 if-else，违反开闭原则",
     "抽象工厂的核心价值说不准：是「产品族一致性」而非「多创建几个对象」",
     "只会背概念没有落地：奖励发放/渠道接入/协议编解码器三个游戏场景至少准备一个",
     "不知道 Spring 的 FactoryBean / BeanFactory 是工厂模式的工业级实现——错失加分点"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：简单工厂一个窗口造一切（加产品改代码）、工厂方法一产品一工厂（加产品加类）、抽象工厂一族产品一套工厂（防混搭）；游戏服奖励发放用「简单工厂+注册表+策略」最实用，渠道接入用抽象工厂保证产品族配套。下一篇讲创建型另外两兄弟：建造者与原型。"
   }
  ]
 },
 {
  "id": "design-pattern-builder-prototype",
  "title": "创建型：建造者与原型",
  "layer": 1,
  "depends": [
   "design-pattern-singleton"
  ],
  "covers": [
   "design-pattern-11"
  ],
  "quiz": [
   "design-pattern-11"
  ],
  "body": [
   {
    "t": "lead",
    "text": "建造者解决「多可选参数的复杂对象怎么优雅地一步步装出来」，原型解决「初始化成本高的对象怎么快速复制」——游戏服的邮件、奖励包、角色模板、对象池批量创建全靠它们，但热路径上要警惕 Builder 的中间对象开销。"
   },
   {
    "t": "pre",
    "items": [
     "理解构造器重载与 setter 的局限",
     "理解深浅拷贝与 clone 的坑",
     "有对象池/缓存的基础概念"
    ]
   },
   {
    "t": "h",
    "text": "建造者模式：复杂对象的组装车间"
   },
   {
    "t": "p",
    "text": "建造者模式解决的第一个痛点是「重叠构造器」：对象有十几个字段，大多可选，用构造器重载得写从 3 个到 12 个参数的版本，调用方根本记不清第 7 个 boolean 是什么；第二个痛点是「半构建状态」：用 setter 拼对象，对象可能在中途被别的代码读到，处于不一致状态，而且没法做整体校验。Builder 的做法是：链式 setter 返回 this，最后 build() 统一做校验——对象一旦产出必然合法，问题在构建期暴露而非运行期。游戏服里最适合 Builder 的是邮件、奖励包这类「字段多、可选多、要统一校验」的对象。Lombok @Builder 能省掉手写代码，但有四个坑必须记住：与 @Data 联用时默认无全参构造，Jackson 反序列化要配合 @NoArgsConstructor + @AllArgsConstructor + @Jacksonized；默认值字段要加 @Builder.Default 否则不设值就是 null；父类字段不被继承要用 @SuperBuilder；toBuilder = true 才有「以旧对象为底改几个字段」的能力。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 邮件对象：字段多、可选多、build() 统一校验\npublic class Mail {\n    private final String title;\n    private final String content;\n    private final List<ItemStack> attaches;\n    private final long expireAt;\n\n    private Mail(Builder b) {\n        this.title = b.title; this.content = b.content;\n        this.attaches = b.attaches; this.expireAt = b.expireAt;\n    }\n    public static Builder builder() { return new Builder(); }\n\n    public static class Builder {\n        private String title;\n        private String content;\n        private List<ItemStack> attaches = new ArrayList<>();\n        private long expireAt;\n\n        public Builder title(String v) { this.title = v; return this; }\n        public Builder content(String v) { this.content = v; return this; }\n        public Builder attach(int itemId, int count) {\n            attaches.add(new ItemStack(itemId, count));\n            return this;\n        }\n        public Builder expireDays(int days) {\n            this.expireAt = System.currentTimeMillis() + days * 86400_000L;\n            return this;\n        }\n        public Mail build() {\n            if (title == null || title.isEmpty()) throw new IllegalArgumentException(\"邮件标题必填\");\n            if (attaches.size() > 10) throw new IllegalArgumentException(\"附件最多 10 个\");\n            if (expireAt <= 0) throw new IllegalArgumentException(\"过期时间必须为正\");\n            return new Mail(this);   // 构建期校验，产出即合法\n        }\n    }\n}\n\n// 使用：链式可读\nMail mail = Mail.builder()\n        .title(\"维护补偿\").content(\"感谢您对服务器的支持\")\n        .attach(1001, 50).attach(2002, 3).expireDays(7)\n        .build();"
   },
   {
    "t": "h",
    "text": "原型模式：以旧生新"
   },
   {
    "t": "p",
    "text": "原型模式通过克隆已有对象创建新对象，适用于初始化成本高的场景（对象要加载配置、连接资源、做复杂计算）。Java 里有两条路线：实现 Cloneable 接口 + 重写 clone()（JDK 的浅拷贝，被很多人诟病但仍是标准方案），或者写一个自定义的 deepCopy() 方法。深浅拷贝的区别是核心考点：浅拷贝只复制对象引用，嵌套对象仍指向同一实例，修改子对象会互相影响；深拷贝把整棵对象图都复制一份，互相独立。游戏服的角色模板、装备模板是原型的好场景：一份策划模板作为原型，给每个玩家 clone 出独立实例，玩家改自己的那份，模板永远不被污染。但实战中深拷贝要谨慎——递归复制整棵对象图成本高，某些字段（如不可变配置引用、线程池引用）恰恰应该共享，所以合格的 clone 通常是有选择地「浅拷贝 + 手动深拷贝可变部分」。这正是面试官想听的边界感。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">浅拷贝 vs 深拷贝</text>\n<rect x=\"30\" y=\"44\" width=\"280\" height=\"90\" rx=\"8\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">浅拷贝（默认 clone）</text>\n<rect x=\"50\" y=\"82\" width=\"80\" height=\"36\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">副本对象</text>\n<rect x=\"210\" y=\"82\" width=\"80\" height=\"36\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"250\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">共享子对象</text>\n<path d=\"M130 100 L210 100\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#bp1)\"/>\n<defs><marker id=\"bp1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv2)\"/></marker></defs>\n<text x=\"170\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">改了子对象，双方都变</text>\n<rect x=\"330\" y=\"44\" width=\"280\" height=\"90\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">深拷贝（deepCopy）</text>\n<rect x=\"350\" y=\"82\" width=\"80\" height=\"36\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"390\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">副本对象</text>\n<rect x=\"510\" y=\"82\" width=\"80\" height=\"36\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"550\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">独立子对象</text>\n<path d=\"M430 100 L510 100\" stroke=\"var(--lv3)\" stroke-width=\"2\" marker-end=\"url(#bp2)\"/>\n<defs><marker id=\"bp2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n<text x=\"470\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">整棵树独立，互不影响</text>\n<rect x=\"30\" y=\"156\" width=\"580\" height=\"106\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服怎么选</text>\n<text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">角色模板/装备模板：原型 clone 出玩家独立实例，模板本身不可变永不污染</text>\n<text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不可变配置引用（ItemConfig）应共享 = 浅拷贝；可变列表（背包/技能）应深拷贝</text>\n<text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">对象池批量创建：复用实例而非克隆，两者语义不同，别混</text>\n</svg>",
    "caption": "图 1：浅拷贝与深拷贝的区别及游戏落地选择"
   },
   {
    "t": "h",
    "text": "对象池批量创建：原型与对象池的分工"
   },
   {
    "t": "p",
    "text": "对象池是「创建性能」问题的解法：批量创建成本高、创建销毁频繁的对象（如连接、线程、以及战斗中的伤害事件对象），预先准备一批放池里，用时借、用完还，避免反复 new 和 GC。它和原型模式的本质区别：原型是「复制出一个新对象」，对象池是「复用一个旧对象」——同一时刻池里对象只服务一方。游戏服里典型组合：伤害事件对象、消息对象高频创建，用 Disruptor 或自研对象池复用；而角色/装备模板这种「要复制出独立个体」的场景用原型。另外提醒一点：Builder 模式在高频热路径上要谨慎，每次构建多一个中间 Builder 对象，战斗结算这种每秒几十万次的场景会增加 GC 压力，热路径用对象复用或直接构造更合适。"
   },
   {
    "t": "pits",
    "items": [
     "把 StringBuilder 当建造者模式的标准答案——它只是可变累加器，没有 build 校验语义",
     "Lombok 四坑答不全：序列化构造器、@Builder.Default 默认值、@SuperBuilder 继承、toBuilder 增量改造",
     "深浅拷贝说不清：clone 默认浅拷贝，嵌套对象共享引用会互相污染；深拷贝要手动递归且成本高",
     "原型和对象池混为一谈：原型=复制出新的，对象池=复用旧的（同时刻服务一方）",
     "在热路径上滥用 Builder：每个邮件/奖励包之外，战斗事件每秒几十万次就别再包一层 Builder 了"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：建造者把多可选参数对象的组装从构造器解放出来，链式调用 + build() 统一校验；原型用 clone 以旧生新，深拷贝有选择地复制可变部分；对象池解决复用，原型解决复制，别混；热路径上 Builder 的中间对象是真开销。下一篇进入结构型：适配器/桥接/装饰器三兄弟。"
   }
  ]
 },
 {
  "id": "design-pattern-adapter-bridge-decorator",
  "title": "结构型：适配器 / 桥接 / 装饰器",
  "layer": 1,
  "depends": [
   "design-pattern-overview"
  ],
  "covers": [
   "design-pattern-14",
   "design-pattern-12"
  ],
  "quiz": [
   "design-pattern-14",
   "design-pattern-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "适配器把不兼容的接口翻译成目标接口，桥接把抽象与实现两维拆分独立扩展，装饰器在运行期层层包裹增强功能——三兄弟都长着一张「包一层」的脸，意图却完全不同，这是结构型模式里最容易混的一组。"
   },
   {
    "t": "pre",
    "items": [
     "理解接口、继承与组合的区别",
     "有接入第三方渠道/老系统的经验更好",
     "理解递归与链式调用"
    ]
   },
   {
    "t": "h",
    "text": "适配器模式：接口翻译官"
   },
   {
    "t": "p",
    "text": "适配器把不兼容的接口包装成目标接口，让原本不能协作的双方一起工作，是系统集成时最不侵入的缝合手段。两种形态：对象适配器（组合，适配器持有被适配者实例，推荐）和类适配器（继承被适配者 + 实现目标接口，Java 单继承下侵入性强，少用）。对象适配器为什么更好：组合可以适配被适配者的整个子类体系、不受单继承限制、耦合更松。游戏服的典型场景就是渠道接入——对内统一 PayService（createOrder / verifyCallback / queryOrder），对外的微信、支付宝、苹果 IAP、华为渠道千差万别，每个渠道写一个 Adapter 实现 PayService，内部做方言翻译，主流程只依赖 PayService，渠道差异被彻底隔离。JDK 里的例子：Arrays.asList() 把数组适配成 List，InputStreamReader 把字节流适配成字符流。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">适配器：三兄弟里的「接口翻译官」</text>\n<rect x=\"30\" y=\"46\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">统一接口 PayService</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">createOrder / verify</text>\n<rect x=\"30\" y=\"150\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">WechatAdapter</text>\n<text x=\"120\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">微信 V3 API 方言</text>\n<rect x=\"230\" y=\"150\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">AlipayAdapter</text>\n<text x=\"320\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">支付宝 RSA 验签</text>\n<rect x=\"430\" y=\"150\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">IapAdapter</text>\n<text x=\"520\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">苹果票据校验</text>\n<path d=\"M120 102 L120 150\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#ad1)\"/>\n<path d=\"M320 102 L320 150\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#ad1)\"/>\n<path d=\"M520 102 L520 150\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#ad1)\"/>\n<defs><marker id=\"ad1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"120\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">实现</text>\n<rect x=\"30\" y=\"220\" width=\"580\" height=\"26\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1\"/>\n<text x=\"320\" y=\"237\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">新增渠道 = 新增一个 Adapter，主流程 PayService 零改动（开闭原则）</text>\n</svg>",
    "caption": "图 1：支付渠道接入——每个渠道一个 Adapter 翻译成统一 PayService"
   },
   {
    "t": "h",
    "text": "桥接模式：拆分两个变化维度"
   },
   {
    "t": "p",
    "text": "桥接模式把「抽象」和「实现」两个维度拆开，各自独立扩展，用组合代替继承。经典例子是跨平台图形渲染：形状（圆形/方形）和渲染方式（OpenGL/软件渲染）是两维变化，用继承组合会类爆炸（2 形状 × 2 渲染 = 4 类，N×M 就爆炸），拆成 Shape 持有 Renderer 引用，组合起来就两维独立扩展。游戏里的对应场景：装备的「品质体系」和「穿戴部位」、技能的「效果类型」和「表现方式」、渠道 SDK 的「登录能力」和「底层实现」都可以用桥接拆分。桥接和适配器的区别：适配器是「翻译已有接口让双方协作」（被动缝合），桥接是「设计阶段就主动拆出两维」（主动设计）。面试高频追问：桥接怎么用组合代替继承——Shape 类里持有一个 Renderer 引用，new CircleShape(new OpenGLRenderer()) 就是桥。"
   },
   {
    "t": "h",
    "text": "装饰器模式：层层包裹的功能叠加"
   },
   {
    "t": "p",
    "text": "装饰器在运行期动态地给对象包裹增强，解决「多种正交增强自由组合」导致的类爆炸。继承的局限：武器有火焰/冰冻/剧毒三种附魔，组合要 7 个子类，N 种附魔要 2^N-1 个类；装饰器每种附魔一个装饰类，运行期自由包裹 new PoisonEnchant(new FireEnchant(baseWeapon))。结构核心：装饰器实现与被装饰者相同的接口，内部持有一个同接口对象，方法里先调被装饰者再加自己的料。Java IO 是教科书：new BufferedInputStream(new FileInputStream(...))。游戏服的伤害计算是经典落地：DamageCalculator 接口，BaseDamage 算裸伤害，装饰器依次叠加暴击判定、属性克制、Buff 加成、护盾减免，每个修正独立成类可单测，顺序可配。但注意：动态增删的 Buff 系统更适合「修饰器列表 + 遍历聚合」而不是装饰器——Buff 要随时上随时下，装饰器拆层很麻烦；装饰器适合相对固定的增强链。面试能主动讲出这个边界是加分项。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 伤害计算器：装饰器实现「暴击 → Buff → 减免」固定增强链\npublic interface DamageCalculator {\n    int calc(int baseDamage);\n}\n\n// 基础实现：裸伤害\npublic class BaseDamage implements DamageCalculator {\n    public int calc(int baseDamage) { return baseDamage; }\n}\n\n// 装饰器基类：持同接口对象，先调被装饰者再叠加自己的逻辑\npublic abstract class DamageDecorator implements DamageCalculator {\n    protected final DamageCalculator next;\n    public DamageDecorator(DamageCalculator next) { this.next = next; }\n}\n\npublic class CritDecorator extends DamageDecorator {\n    public CritDecorator(DamageCalculator next) { super(next); }\n    public int calc(int dmg) {\n        int v = next.calc(dmg);\n        return Math.random() < 0.2 ? (int)(v * 1.5) : v;   // 20% 暴击 1.5 倍\n    }\n}\n\npublic class BuffDecorator extends DamageDecorator {\n    private final double rate;\n    public BuffDecorator(DamageCalculator next, double rate) { super(next); this.rate = rate; }\n    public int calc(int dmg) { return (int)(next.calc(dmg) * rate); }\n}\n\n// 装配：先暴击后 Buff（顺序敏感，由策划配表定义）\nDamageCalculator chain = new BuffDecorator(\n        new CritDecorator(new BaseDamage()), 1.3);\nint finalDmg = chain.calc(1000);"
   },
   {
    "t": "h",
    "text": "三兄弟辨析：都是包一层，意图不同"
   },
   {
    "t": "p",
    "text": "适配器、桥接、装饰器结构上都像「包一层」，意图完全不同：适配器改「接口签名」让双方兼容——是缝合器，重点是翻译；桥接拆「抽象与实现」两维独立扩展——是拆分器，重点是解耦两个变化维度；装饰器增强「功能」——是加料器，重点是运行期动态叠加，不改变接口。再加两个常被拉进来对比的：代理控制「访问」，门面简化「复杂度」。面试时能把五个「包一层」的模式讲清各自意图，是结构型模式的体系化证明。"
   },
   {
    "t": "pits",
    "items": [
     "适配器和装饰器结构像就混淆：适配器翻译接口，装饰器增强功能（调了再加料），代理控制访问",
     "桥接例子只会背「颜色和形状」，举不出游戏维度（品质×部位、技能效果×表现）",
     "Buff 系统硬套装饰器：动态增删的 Buff 该用修饰器列表按优先级遍历，装饰器适合固定增强链",
     "忘了 JDK/框架实例：SLF4J 适配各日志框架、Java IO 装饰器链、Arrays.asList、HandlerAdapter",
     "顺序敏感说不清：先暴击后减免 ≠ 先减免后暴击，顺序要由策划显式定义并配表"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：适配器=翻译（SLF4J/支付渠道）、桥接=拆分两维（形状×渲染、品质×部位）、装饰器=叠加增强（伤害计算链/Java IO）；它们和代理/门面都长着「包一层」的脸，意图是区分关键；动态增删的 Buff 用修饰器列表而非装饰器。下一篇讲结构型的重量级选手：代理模式。"
   }
  ]
 },
 {
  "id": "design-pattern-proxy",
  "title": "结构型：代理模式",
  "layer": 1,
  "depends": [
   "design-pattern-overview"
  ],
  "covers": [
   "design-pattern-07"
  ],
  "quiz": [
   "design-pattern-07"
  ],
  "body": [
   {
    "t": "lead",
    "text": "代理模式在目标对象前后插入横切逻辑而不改目标代码——JDK 动态代理基于接口反射，CGLIB 基于字节码生成子类，MyBatis Mapper 和 RPC stub 都在用代理变魔术，Spring AOP 的本质就是动态代理。"
   },
   {
    "t": "pre",
    "items": [
     "掌握反射基础：Proxy / InvocationHandler",
     "了解字节码与继承：final 的语义",
     "知道 Spring AOP / MyBatis 的基本用法"
    ]
   },
   {
    "t": "h",
    "text": "三种形态：静态代理 / JDK 动态代理 / CGLIB"
   },
   {
    "t": "p",
    "text": "静态代理：手写一个代理类实现同一接口，内部持有目标对象，一个接口一个代理类，逻辑最透明但类爆炸、不可扩展。JDK 动态代理：Proxy.newProxyInstance + InvocationHandler，运行期生成实现指定接口的代理类，前提是目标必须有接口，调用走反射。CGLIB：用 ASM 字节码生成目标类的子类并重写方法，不需要接口，但不能代理 final 类/final 方法（子类无法重写），Spring Boot 2.x 起 AOP 默认用它。性能上现代 JDK（1.8+）两者的调用差异已经极小，CGLIB 的 FastClass 机制和 JDK 反射的方法内联优化让差距可以忽略，面试别再拿「JDK 慢」当结论。创建代理对象的速度倒是 JDK 更快（逻辑简单）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">JDK 动态代理 vs CGLIB</text>\n<rect x=\"30\" y=\"44\" width=\"280\" height=\"96\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">JDK 动态代理</text>\n<text x=\"170\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Proxy + InvocationHandler</text>\n<text x=\"170\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">基于接口反射生成代理类</text>\n<text x=\"170\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">前提：目标必须有接口</text>\n<rect x=\"330\" y=\"44\" width=\"280\" height=\"96\" rx=\"8\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">CGLIB</text>\n<text x=\"470\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ASM 字节码生成子类</text>\n<text x=\"470\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">重写方法拦截调用</text>\n<text x=\"470\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">限制：final 类/方法不可代理</text>\n<rect x=\"30\" y=\"162\" width=\"580\" height=\"48\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Spring 的选择</text>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">传统策略：有接口用 JDK，无接口用 CGLIB；Spring Boot 2.x 起默认强制 CGLIB（spring.aop.proxy-target-class=true）</text>\n<rect x=\"30\" y=\"226\" width=\"580\" height=\"44\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"247\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">代理对象类名：JDK8 是 com.sun.proxy.$Proxy0，JDK9+ 是 jdk.proxy1.$Proxy0</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">打断点调试动态代理：断点打在 InvocationHandler.invoke() 实现里</text>\n</svg>",
    "caption": "图 1：JDK 动态代理与 CGLIB 的核心差异与 Spring 默认策略"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// JDK 动态代理：基于接口\npublic interface IPlayerService { void addExp(long exp); }\n\npublic class PlayerService implements IPlayerService {\n    public void addExp(long exp) { /* 加经验逻辑 */ }\n}\n\n// InvocationHandler：横切逻辑在这里\nInvocationHandler h = (proxy, method, args) -> {\n    long start = System.currentTimeMillis();\n    Object result = method.invoke(target, args);   // 反射调目标\n    System.out.println(method.getName() + \" 耗时 \" + (System.currentTimeMillis() - start) + \"ms\");\n    return result;\n};\nIPlayerService proxy = (IPlayerService) Proxy.newProxyInstance(\n        PlayerService.class.getClassLoader(),\n        new Class[]{IPlayerService.class}, h);   // 必须有接口\n\n// CGLIB：基于字节码继承，不需要接口（SpringBoot 2.x AOP 默认）\n// @Configuration 类的增强就是 CGLIB：配置类方法每次调用都返回同一个单例 Bean\n// Enhancer enhancer = new Enhancer();\n// enhancer.setSuperclass(PlayerService.class);  // 生成子类\n// enhancer.setCallback((MethodInterceptor) (obj, method, args, proxy1) -> {\n//     long start = System.currentTimeMillis();\n//     Object result = proxy1.invokeSuper(obj, args);   // FastClass 直接调父类，比反射快\n//     return result;\n// });"
   },
   {
    "t": "h",
    "text": "MyBatis Mapper 与 RPC stub：代理变魔术"
   },
   {
    "t": "p",
    "text": "MyBatis 的 Mapper 接口没有实现类，SqlSession.getMapper() 返回的是 JDK 动态代理对象——调用接口方法时，代理把「接口全限定名 + 方法名」映射到 Mapper XML/注解里的 SQL，交给 Executor 执行，接口调用魔术般变成 SQL 执行。为什么选 JDK 代理而不是 CGLIB：Mapper 天生就是接口、没有实现类，JDK 动态代理正好基于接口工作，依赖少、机制简单。RPC stub 同理：Dubbo 消费端注入的接口引用也是代理，本地调用被代理拦下，转成网络请求发给 Provider，结果再转回返回值——调用方感觉在调本地方法，网络细节全被藏掉，这就是「远程调用本地化」。游戏服自己的应用：协议层的统一耗时统计、日志埋点、权限校验都可以用代理/注解切面在不动业务代码的情况下加横切逻辑。"
   },
   {
    "t": "h",
    "text": "Spring AOP 的本质"
   },
   {
    "t": "p",
    "text": "Spring AOP 的核心是动态代理：Spring 发现目标 Bean 需要被增强（有 @Aspect 切面匹配）时，不直接给业务代码，而是生成一个代理对象放进容器，注入的其实是代理。@Transactional 的原理也在这：调用被代理拦下，先开启事务、执行目标方法、再提交/回滚。三个实战坑要记住：final 方法对 AOP 静默失效（CGLIB 子类无法重写 final 方法，JDK 代理也只能拦接口方法）；同一 Bean 内部自调用（this.doXxx()）不经过代理，事务/切面不生效——这是经典事故，必须用 AopContext.currentProxy() 或拆分 Bean 解决；注入类型用接口还是实现类——JDK 代理下注入实现类会 ClassCastException，这也是 Spring Boot 2.x 默认切 CGLIB 的原因之一。"
   },
   {
    "t": "pits",
    "items": [
     "把「JDK 代理慢」当结论——JDK8+ 与 CGLIB 调用性能差距可忽略，创建速度 JDK 更快",
     "CGLIB 为什么不能代理 final 方法：生成子类重写方法，final 方法/类不能被继承重写，拦截插不进去",
     "MyBatis 为什么用 JDK 代理：Mapper 是接口没有实现类，JDK 代理正好基于接口工作",
     "自调用事务失效说不清：this 调用不经过代理，AOP/事务在内部自调时静默失效",
     "把静态代理当答案但答不出动态代理的适用场景——三种形态都要会讲"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：代理 = 在目标前后插横切逻辑；JDK 代理需接口+反射，CGLIB 字节码生成子类、final 不可代理；Spring Boot 2.x 默认 CGLIB；MyBatis Mapper 和 RPC stub 都是代理变魔术；Spring AOP/事务的本质是动态代理，自调用失效是高频事故。下一篇讲组合/外观/享元三连。"
   }
  ]
 },
 {
  "id": "design-pattern-composite-facade-flyweight",
  "title": "结构型：组合 / 外观 / 享元",
  "layer": 2,
  "depends": [
   "design-pattern-proxy"
  ],
  "covers": [
   "design-pattern-15",
   "design-pattern-13",
   "design-pattern-10"
  ],
  "quiz": [
   "design-pattern-10",
   "design-pattern-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "组合让叶子和容器统一接口递归处理树形结构（技能树），外观为一组子系统提供统一入口（创角五系统编排），享元拆出内在状态共享海量细粒度对象（地图格子）——三个模式三个维度：组织、收口、省内存。"
   },
   {
    "t": "pre",
    "items": [
     "理解递归与树形结构",
     "有技能树/背包分组/地图的认知",
     "理解不可变对象与引用共享"
    ]
   },
   {
    "t": "h",
    "text": "组合模式：树形结构的统一接口"
   },
   {
    "t": "p",
    "text": "组合模式让「单个对象」和「对象集合」实现同一接口，调用方用统一方式处理树形结构的任意节点，递归操作不用区分叶子和容器。结构三角色：Component 抽象（统一接口）、Leaf 叶子（无子节点）、Composite 容器（持有 children，方法里遍历 children 递归调用）。游戏里树形结构无处不在：技能树——技能节点和技能分支统一抽象 SkillNode(isUnlocked/getCost)，分支节点的解锁条件 = 所有前置子节点已解锁，递归算整棵树的加点总消耗；装备套装——单件和套装统一 EquipmentComponent，套装的属性总加成 = 遍历子装备聚合 + 套装额外词条；背包分组——背包 → 标签页 → 格子，统计总负重一个 getWeight() 递归搞定。核心收益：新增一种节点类型不需要改遍历算法，客户端面对任意深度树一视同仁。注意点：透明式（叶子也有 add/remove 空实现或抛异常）vs 安全式（只有容器有），工程上安全式更稳；树形结构在游戏服要注意引用泄漏——节点移除后子树引用要清干净；深树递归注意栈深度，必要时改迭代加显式栈。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">组合模式：技能树统一接口递归聚合</text>\n<rect x=\"260\" y=\"44\" width=\"120\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">SkillNode</text>\n<text x=\"320\" y=\"79\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">接口：解锁/花费</text>\n<rect x=\"70\" y=\"120\" width=\"120\" height=\"40\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"130\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Composite 分支</text>\n<text x=\"130\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">持 children 递归</text>\n<rect x=\"450\" y=\"120\" width=\"120\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"510\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Leaf 叶子技能</text>\n<text x=\"510\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无子节点</text>\n<path d=\"M300 84 C260 100 200 104 150 118\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#cf1)\"/>\n<path d=\"M350 84 C380 100 440 104 480 118\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#cf1)\"/>\n<defs><marker id=\"cf1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"40\" y=\"190\" width=\"560\" height=\"42\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">总消耗 = node.cost() 递归：Composite 遍历子节点求和，Leaf 返回自身花费</text>\n<text x=\"320\" y=\"226\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">新增节点类型不改遍历算法；前置依赖做环检测，防止递归死循环</text>\n</svg>",
    "caption": "图 1：组合模式——技能树叶子与容器统一接口，递归聚合"
   },
   {
    "t": "h",
    "text": "外观模式（Facade）：统一入口收口复杂编排"
   },
   {
    "t": "p",
    "text": "门面为一组复杂子系统提供统一的高层入口，调用方只和门面打交道，不感知内部协作细节。游戏服最典型的例子是「创建角色」：客户端只调 RoleFacade.createRole()，内部实际要账号服校验 → 玩家数据服建档 → 背包服初始化背包 → 任务服初始化新手任务 → 邮件服发欢迎邮件，五个系统的编排细节全藏在门面后。GM 后台的「账号封禁」按钮同理：更新账号状态 + 踢下线 + 通知客服 + 记审计，一个 Facade 方法收口。收益：接口稳定（子系统重构不影响调用方）、事务/补偿边界清晰（门面方法天然是编排与补偿逻辑的落点）、新人友好。风险是门面容易长成「上帝类」——什么都往里塞，要按业务域拆分多个门面（RoleFacade、PayFacade、GmFacade），而不是一个 GameFacade 包打天下。和中介者的区别：门面是单向的（调用方通过门面访问子系统，子系统之间依然可互相调用），中介者是双向的（所有子系统只和中介者通信）。"
   },
   {
    "t": "h",
    "text": "享元模式：拆内外状态，共享不变部分"
   },
   {
    "t": "p",
    "text": "享元把对象的「内在状态（不变、可共享）」和「外在状态（变化、场景相关）」拆开，内在状态共享同一份实例，用极少对象支撑海量细粒度元素。游戏地图的经典场景：MMORPG 百万级格子，地形类型（草地/水面/山地）是内在状态——含贴图、通行规则，共享享元对象；每个格子只存「类型引用 + 坐标 + 动态占用状态」，内存从「格子数 × 完整对象」降到「格子数 × 引用 + 类型数 × 完整对象」。配置表同理：10 万条道具配置加载成不可变共享对象，所有玩家的「铁剑」指向同一个 ItemConfig，玩家背包只存 configId + 数量 + 绑定状态，配合不可变设计天然线程安全，多线程读无需加锁。工程铁律：享元对象必须不可变，否则共享 = 互相污染；配置热更不能改原对象——构建新配置对象后整对象替换引用（AtomicReference），旧对象等 GC 回收。JDK 的 Integer 缓存（-128~127）、String 常量池都是享元。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 享元：地图地形类型共享\npublic enum TerrainType {\n    GRASS(\"草地\", true), WATER(\"水面\", false), MOUNTAIN(\"山地\", false);\n    final String name;\n    final boolean walkable;\n    TerrainType(String name, boolean walkable) { this.name = name; this.walkable = walkable; }\n}\n\n// 每个格子只存引用 + 外在状态，不重复创建地形对象\npublic final class MapCell {\n    final TerrainType terrain;      // 共享的享元（同一枚举实例）\n    final int x, y;\n    int occupyPlayerId;             // 外在状态：动态占用\n    public MapCell(TerrainType terrain, int x, int y) {\n        this.terrain = terrain; this.x = x; this.y = y;\n    }\n    public boolean canPass() { return terrain.walkable && occupyPlayerId == 0; }\n}\n\n// 100万格子的内存：100万个引用 + 4种地形对象 ≈ 极小\n// 对比：每格 new 一个含贴图/通行规则的对象 = 内存爆炸\n\n// 享元 vs 对象池：语义区别\n// 享元 = 同一对象被多个地方同时共享使用（地形/配置表）\n// 对象池 = 同一对象在不同时间被复用，同时刻只服务一方（连接池/线程池）"
   },
   {
    "t": "h",
    "text": "三模式协同与边界"
   },
   {
    "t": "p",
    "text": "三个模式常在一个游戏里协同：技能树用组合组织，技能效果的类型对象用享元共享（同一种 Buff 效果只一份配置），而「开始战斗」这种复杂入口用 Facade 收口。边界辨析：组合管「组织结构」（树），享元管「对象共享」（省内存），外观管「接口收口」（简化调用）。高频追问是享元 vs 对象池：享元是「同一个对象同时被多处共享」，对象池是「对象在不同时间被复用」——连接池、线程池是对象池，不是享元。还有享元 vs 单例：单例是类级全局唯一（实例数量 = 1），享元是池化共享集合（每种内在状态一个实例，可有多个）。"
   },
   {
    "t": "pits",
    "items": [
     "享元对象可变：共享 = 互相污染，享元必须不可变，热更用 AtomicReference 整对象替换",
     "享元 vs 对象池说不清：一个同时共享，一个分时复用；连接池/线程池是对象池不是享元",
     "组合模式的透明式/安全式分不清：叶子要不要 add/remove 接口，工程上安全式更稳",
     "技能树前置依赖成环没防：拓扑排序或 DFS 检测环要放在导表工具里，启动期 fail-fast",
     "门面膨胀成上帝类：按业务域拆分 RoleFacade/PayFacade/GmFacade，别一个 GameFacade 包打天下"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：组合管树形结构统一接口（技能树递归聚合）、外观管复杂编排统一入口（创角五系统）、享元管内在状态共享省内存（地形/配置表）；享元必须不可变，与对象池的「同时共享 vs 分时复用」是高频辨析点。下一篇进入行为型：策略与模板方法。"
   }
  ]
 },
 {
  "id": "design-pattern-strategy-template",
  "title": "行为型：策略与模板方法",
  "layer": 2,
  "depends": [
   "design-pattern-factory"
  ],
  "covers": [
   "design-pattern-03",
   "design-pattern-04"
  ],
  "quiz": [
   "design-pattern-03",
   "design-pattern-04"
  ],
  "body": [
   {
    "t": "lead",
    "text": "策略模式把「会变的行为」抽象成接口、运行期按标识选实现，模板方法把「固定骨架 + 可变钩子」收进父类——一个管算法族替换，一个管流程复用，游戏服渠道接入和活动框架是它们的教科书现场。"
   },
   {
    "t": "pre",
    "items": [
     "理解接口多态与 Map 查表",
     "理解继承与 final 方法",
     "有渠道接入/活动框架的认知"
    ]
   },
   {
    "t": "h",
    "text": "策略模式：消灭 if-else 地狱"
   },
   {
    "t": "p",
    "text": "策略模式 = 把会变的行为抽象成接口，运行期按标识选择具体实现，消灭 if-else 分支堆积。没有策略时：if (channel == \"huawei\") {...} else if (channel == \"xiaomi\") {...}，渠道越多方法越长，任何渠道改动都要动核心流程，回归测试范围爆炸。策略改造：定义 ChannelLoginStrategy 接口（verify(token) -> LoginResult），每个渠道一个实现类；用 Map<String, ChannelLoginStrategy> 持有全部策略，登录请求进来按渠道标识 strategyMap.get(channel).verify(token)。JDK 里的经典例子是 Comparator：排序算法固定、比较行为可替换，Collections.sort(list, comparator) 就是策略注入；线程池的 RejectedExecutionHandler 拒绝策略同理。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">策略模式：渠道登录接入</text>\n<rect x=\"30\" y=\"46\" width=\"180\" height=\"52\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">LoginStrategy</text>\n<text x=\"120\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">verify(token)→LoginResult</text>\n<rect x=\"30\" y=\"140\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">HuaweiStrategy</text>\n<text x=\"120\" y=\"181\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OAuth 验证</text>\n<rect x=\"230\" y=\"140\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">YybStrategy</text>\n<text x=\"320\" y=\"181\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">应用宝票据校验</text>\n<rect x=\"430\" y=\"140\" width=\"180\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">OfficialStrategy</text>\n<text x=\"520\" y=\"181\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">账号密码登录</text>\n<path d=\"M120 98 L120 140\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#st1)\"/>\n<path d=\"M320 98 L320 140\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#st1)\"/>\n<path d=\"M520 98 L520 140\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#st1)\"/>\n<defs><marker id=\"st1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"120\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">实现</text>\n<rect x=\"30\" y=\"212\" width=\"580\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1\"/>\n<text x=\"320\" y=\"231\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">strategyMap.get(channel).verify(token) ｜ 新增渠道 = 新增一个类 + @Component(\"huawei\") 自动进 Map</text>\n</svg>",
    "caption": "图 1：策略模式——渠道登录按 channel 查表选择实现"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 策略 + Spring Map 注入：新增渠道零配置\npublic interface ChannelLoginStrategy {\n    LoginResult verify(String token, Map<String, String> ext);\n}\n\n@Component(\"huawei\")\npublic class HuaweiLoginStrategy implements ChannelLoginStrategy {\n    public LoginResult verify(String token, Map<String, String> ext) {\n        // 华为 OAuth 验证，返回 channelUid\n        return new LoginResult(channelUidFromHuawei(token), \"\");\n    }\n}\n\n@Component\npublic class LoginService {\n    // Spring 把容器里所有 ChannelLoginStrategy 按 Bean 名注入 Map\n    private final Map<String, ChannelLoginStrategy> strategyMap;\n    public LoginService(Map<String, ChannelLoginStrategy> strategyMap) {\n        this.strategyMap = strategyMap;\n    }\n    public LoginResult login(String channel, String token) {\n        ChannelLoginStrategy s = strategyMap.get(channel);\n        if (s == null) throw new IllegalArgumentException(\"未接入渠道: \" + channel);\n        return s.verify(token, new HashMap<>());\n    }\n}\n\n// 策略 vs 工厂：策略管「行为可替换」，工厂管「对象创建」；\n// 实际项目两者叠加——工厂按渠道名拿出对应策略"
   },
   {
    "t": "h",
    "text": "模板方法模式：固定骨架 + 可变钩子"
   },
   {
    "t": "p",
    "text": "模板方法 = 父类定义算法骨架（final 方法固定步骤顺序），子类重写抽象钩子方法填充差异步骤——好莱坞原则「别打电话给我们，我们会打给你」。结构要点：父类 final 的 templateMethod() 里固定调用 step1() → step2() → step3()，差异步骤声明为 abstract 或空实现（钩子）让子类覆盖。两个关键细节：骨架方法必须声明 final，防止子类重写骨架、打乱步骤顺序，父类里的健壮性逻辑（参数校验、异常兜底）才不会被绕过；钩子和抽象方法的区别——抽象方法是必填项（如 doHandle），钩子是有默认实现的选填项（如 before/after）。游戏服两个落地：Handler 基类 BaseHandler 定义 handle() 骨架（校验登录态 → 反序列化参数 → before() 钩子 → doHandle() 抽象业务 → after() 钩子 → 统一异常捕获回错误包），几十个协议 Handler 共享同一套健壮性逻辑；活动框架 BaseActivity 定义生命周期骨架（onStart → onReward 子类实现 → onEnd），双倍掉落、限时商店等活动只写差异逻辑。JDK/Spring 的例子：AbstractList、HttpServlet 的 service() 调 doGet/doPost、JdbcTemplate 的回调接口。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 模板方法：协议 Handler 骨架\npublic abstract class BaseHandler {\n    public final void handle(Player player, ProtoMsg msg) {   // final 骨架\n        if (!checkLogin(player)) { sendError(player, Code.NOT_LOGIN); return; }\n        try {\n            Object param = parseParam(msg);   // 反序列化\n            before(player, param);            // 钩子：可选覆盖\n            doHandle(player, param);          // 抽象方法：子类必填\n            after(player, param);             // 钩子：如打点\n        } catch (Exception e) {\n            sendError(player, Code.SYSTEM_ERROR);  // 统一兜底\n            log.error(\"handle error, proto={}\", getProtoId(), e);\n        }\n    }\n    protected abstract int getProtoId();\n    protected abstract Object parseParam(ProtoMsg msg);\n    protected abstract void doHandle(Player player, Object param);\n    protected void before(Player p, Object param) {}\n    protected void after(Player p, Object param) {}\n}\n\n// 子类只写差异\npublic class BuyItemHandler extends BaseHandler {\n    protected int getProtoId() { return 1001; }\n    protected Object parseParam(ProtoMsg msg) { return new BuyItemReq(msg); }\n    protected void doHandle(Player player, Object param) {\n        // 购买道具业务\n    }\n}"
   },
   {
    "t": "h",
    "text": "模板方法 vs 策略：继承复用 vs 组合替换"
   },
   {
    "t": "p",
    "text": "模板方法靠继承复用骨架（骨架在父类、差异在子类），策略靠组合替换行为（行为在接口实现、装配在运行期）。模板方法继承层次深了就僵——改骨架影响所有子类；现代代码更倾向「策略 + 组合」，但骨架流程稳定的场景（协议处理、活动生命周期）模板方法依然最直白、最防呆。选型建议：流程步骤稳定、差异点固定 → 模板方法；行为种类多、可随时替换 → 策略。两者也能协同：BaseActivity 用模板方法定义生命周期骨架，活动玩法差异再抽象成 ActivityPlayStrategy 由子类装配——活动框架就是这么组合的，具体会在「模式实战落地」篇展开。"
   },
   {
    "t": "pits",
    "items": [
     "模板方法的骨架方法忘了讲 final 的用意：防止子类重写骨架、打乱步骤顺序，健壮性逻辑不被绕过",
     "钩子和抽象方法混为一谈：抽象方法是必填差异步骤，钩子是有默认实现的选填扩展点",
     "策略 vs 模板方法说不清：继承复用（骨架在父类）vs 组合替换（行为在接口），层次深了模板方法会僵",
     "策略例子只会背 Comparator：游戏渠道登录/支付、战斗结算、奖励发放是更好的落地素材",
     "忘了 JDK/Spring 实例：RejectedExecutionHandler、AbstractList、HttpServlet.service()、JdbcTemplate"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：策略把会变的行为抽象成接口、Map 查表选择实现，消灭 if-else；模板方法用 final 骨架 + 钩子复用固定流程；继承复用 vs 组合替换是选型分界线，Handler 骨架和活动生命周期是游戏服的标准落地。下一篇讲行为型的另一大支柱：观察者与发布订阅。"
   }
  ]
 },
 {
  "id": "design-pattern-observer",
  "title": "行为型：观察者与发布订阅",
  "layer": 2,
  "depends": [
   "design-pattern-strategy-template"
  ],
  "covers": [
   "design-pattern-05"
  ],
  "quiz": [
   "design-pattern-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "观察者模式让「业务动作」和「衍生逻辑」解耦——升级只发一条事件，成就、任务、排行榜、全服公告各自监听；游戏服事件总线与 Spring 事件机制是它的两种落地形态，同步还是异步、异常怎么隔离是实战分水岭。"
   },
   {
    "t": "pre",
    "items": [
     "理解接口与 List 遍历",
     "有成就/任务/统计系统的耦合痛点体验",
     "了解 Spring 事件与 @Async 基础"
    ]
   },
   {
    "t": "h",
    "text": "为什么需要观察者：升级触发多系统的耦合之痛"
   },
   {
    "t": "p",
    "text": "游戏服的典型痛点：玩家升级这个动作会触发——任务进度更新、成就检查、排行榜刷新、全服公告（首个满级）、BI 打点。如果升级逻辑里直接调各系统，耦合死且越加越多——每加一个想「关心升级」的系统，都要去改升级方法，升级系统渐渐认识全服所有模块。观察者模式的解法：定义 GameEvent 基类，玩家行为产生处只负责 fireEvent(new LevelUpEvent(player))，各系统注册监听各自关心的事件类型，总线按类型分发。升级系统从此不认识成就系统，新增「关心升级」的系统只加一个监听器，零改动业务代码。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">观察者模式：游戏内事件总线</text>\n<rect x=\"230\" y=\"44\" width=\"180\" height=\"52\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">升级系统</text>\n<text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">fireEvent(LevelUpEvent)</text>\n<path d=\"M320 96 L320 130\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#ob1)\"/>\n<defs><marker id=\"ob1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"210\" y=\"132\" width=\"220\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"157\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">事件总线（按类型分发）</text>\n<rect x=\"30\" y=\"204\" width=\"170\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"226\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">成就监听器</text>\n<text x=\"115\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同步 · 快速</text>\n<rect x=\"235\" y=\"204\" width=\"170\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"226\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">任务进度监听</text>\n<text x=\"320\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同步 · 快速</text>\n<rect x=\"440\" y=\"204\" width=\"170\" height=\"52\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"226\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">BI 打点监听</text>\n<text x=\"525\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">异步 · Disruptor 队列</text>\n<path d=\"M270 172 L180 202\" stroke=\"var(--line)\" stroke-width=\"1.5\" marker-end=\"url(#ob2)\"/>\n<path d=\"M330 172 L320 202\" stroke=\"var(--line)\" stroke-width=\"1.5\" marker-end=\"url(#ob2)\"/>\n<path d=\"M380 172 L490 202\" stroke=\"var(--line)\" stroke-width=\"1.5\" marker-end=\"url(#ob2)\"/>\n<defs><marker id=\"ob2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 1：事件总线按类型分发，快监听同步、慢监听异步"
   },
   {
    "t": "h",
    "text": "同步还是异步：游戏服事件的总裁决策"
   },
   {
    "t": "p",
    "text": "游戏服单线程玩家模型下，同步事件即可——玩家逻辑线程内顺序触发，无线程安全问题，监听器失败能及时暴露。但耗时监听器（写日志、推 BI、调外部服务）要异步化——丢进 Disruptor 队列或 @Async，避免拖慢主流程。判断标准：监听器里的事「玩家感不感知延迟」？成就检查、任务进度这类毫秒级且和玩家当次操作强相关的，同步；BI 打点、跨服广播这类可容忍延迟的，异步。还有一个工程铁律：一个监听器抛异常不能炸掉整个事件——总线分发时对每个监听器 try-catch 记日志、不中断后续监听器；关键监听器（如扣资源）留在主流程同步执行并让其异常上抛。"
   },
   {
    "t": "h",
    "text": "Spring 事件机制的落地"
   },
   {
    "t": "p",
    "text": "Spring 的事件机制和手写总线几乎一一对应：ApplicationEventPublisher.publishEvent() 发事件，@EventListener 注解监听，@TransactionalEventListener 还能保证「事务提交后再发事件」——充值成功才发奖励通知，避免事务回滚但奖励已发的脏事件。GM 后台、支付服的典型组合：支付回调里把订单状态落库并发布 PaySuccessEvent，发奖监听器用 @TransactionalEventListener(phase = AFTER_COMMIT) 监听，事务提交成功才发奖；若事务回滚，事件根本不触发，天然防脏事件。工程注意点：监听器执行顺序用 @Order 控制；监听器内部异常要用 try-catch 隔离，或让它不影响事务；小心环形事件——A 事件触发 B，B 又触发 A 的死循环，要有环路上限或设计约束。"
   },
   {
    "t": "h",
    "text": "观察者 vs MQ 发布订阅"
   },
   {
    "t": "p",
    "text": "这是高频辨析题：观察者是进程内调用，延迟低、强一致（同步事件）、但限于同一 JVM；MQ 发布订阅跨进程、可削峰解耦、天然异步，但有延迟和运维成本。游戏内业务逻辑解耦用事件总线（快、便宜、无中间件依赖），跨服跨系统（如充值通知 BI、跨服排行同步）用 MQ（Kafka）。两者的订阅模型本质一样，区别在「进程边界」和「投递保证」——MQ 有持久化和至少一次/精确一次语义，进程内事件没有。"
   },
   {
    "t": "pits",
    "items": [
     "同步事件里监听器抛异常波及业务：总线要对每个监听器 try-catch 隔离，不中断后续监听器",
     "@TransactionalEventListener 的语义说不清：事务提交后才触发，解决「事务回滚但事件已发」的脏事件",
     "观察者 vs MQ 的边界说不出：进程内强一致 vs 跨进程异步削峰，游戏内解耦用事件总线、跨系统用 MQ",
     "环形事件没防：A 触发 B、B 触发 A 死循环，要有环路上限或设计约束",
     "耗时监听器同步执行拖慢玩家操作：写日志/推 BI 必须异步化，玩家逻辑线程只做快事件"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：观察者 = 升级只发一条事件，关心它的系统各自监听；快监听同步、慢监听异步，异常隔离是铁律；Spring 的 @EventListener/@TransactionalEventListener 是企业级落地，事务提交后才发事件防脏数据；进程内用事件总线，跨系统用 MQ。下一篇讲状态机与责任链。"
   }
  ]
 },
 {
  "id": "design-pattern-state-chain",
  "title": "行为型：状态机与责任链",
  "layer": 2,
  "depends": [
   "design-pattern-strategy-template"
  ],
  "covers": [
   "design-pattern-08",
   "design-pattern-06"
  ],
  "quiz": [
   "design-pattern-08",
   "design-pattern-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "状态机把「状态和迁移规则」显式建模，结构性杜绝非法迁移；责任链把处理者串成链、请求沿链传递——玩家状态机、订单状态机、Netty Pipeline、登录校验链是游戏服的两大标配。"
   },
   {
    "t": "pre",
    "items": [
     "理解枚举与 Map/二维表",
     "有 Netty Pipeline 的使用经验",
     "有登录/订单/校验链的业务认知"
    ]
   },
   {
    "t": "h",
    "text": "状态机：结构性杜绝非法迁移"
   },
   {
    "t": "p",
    "text": "状态机/状态模式的核心价值：把「状态」和「状态间的迁移规则」显式建模为对象/表，代替散落的 if-else 判断，收益是「非法迁移被结构性地杜绝」而非靠人肉小心。游戏服的必用场景：玩家状态（离线/在线/战斗中/死亡/挂机，死亡不能交易、战斗中不能切场景）；订单状态（待支付/已支付/已发货/已关闭，支付回调只在待支付状态生效——这是幂等的重要一环）；活动状态（未开启/进行中/领奖期/已结束）；副本/战斗状态机（匹配中/加载中/战斗中/结算中）。if-else 写法的问题：状态判断散落在几十个方法里，新增状态要翻遍所有调用点，漏一处就是线上 bug；状态迁移没有集中定义，「从死亡直接变在线」这种非法跳变无法被系统性拦截。实现三件套：状态枚举 + 迁移表（当前状态 × 事件 → 下一状态，用 Map 或二维表配置）+ 状态上下文（持有当前状态，提供 fire(event) 统一入口，非法迁移直接拒绝并告警）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">订单状态机 + 乐观锁防重复发货</text>\n<rect x=\"40\" y=\"52\" width=\"110\" height=\"44\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">待支付</text>\n<rect x=\"265\" y=\"52\" width=\"110\" height=\"44\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">已支付</text>\n<rect x=\"490\" y=\"52\" width=\"110\" height=\"44\" rx=\"8\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"545\" y=\"79\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">已发货</text>\n<path d=\"M150 74 L265 74\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#sc1)\"/>\n<path d=\"M375 74 L490 74\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#sc1)\"/>\n<defs><marker id=\"sc1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"208\" y=\"64\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">支付回调</text>\n<text x=\"432\" y=\"64\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发货</text>\n<rect x=\"40\" y=\"120\" width=\"560\" height=\"64\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">渠道重复回调：状态已是「已发货」→ fire(支付回调) 被迁移表拒绝 → 幂等返回</text>\n<text x=\"320\" y=\"164\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">再叠加乐观锁：update order set status='已发货' where id=? and status='已支付'，影响行数为 0 = 已被并发修改</text>\n<rect x=\"40\" y=\"204\" width=\"560\" height=\"60\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"226\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">if-else 写法：状态判断散落在几十个方法里，非法跳变无法系统拦截</text>\n<text x=\"320\" y=\"248\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">状态机 = 红绿灯 + 车道线，红灯结构性地不能走</text>\n</svg>",
    "caption": "图 1：订单状态机 + 乐观锁：重复回调幂等，杜绝重复发货"
   },
   {
    "t": "h",
    "text": "状态模式 vs 轻量迁移表"
   },
   {
    "t": "p",
    "text": "完整的状态模式（State Pattern）是每种状态一个类、行为写在状态类里（如玩家战斗状态类实现攻击/防御行为）；轻量场景用「枚举 + 迁移表」就够。选型建议：行为逻辑也随状态变化且复杂（战斗 AI），上完整状态类体系；只是「能不能做某操作 + 迁移合法不合法」，迁移表足够。更高阶的是分层状态机（HFSM）：状态内部嵌套子状态机，父状态公共行为被子状态继承——游戏 AI 行为复杂（战斗内又分追击/施法/逃跑），平铺会状态爆炸，分层后公共迁移（受击打断）只在父状态定义一次。迁移表放代码还是配置表：核心迁移规则放代码（类型安全、可单测），参数化规则放配置（运营可调），启动期要校验表合法性（非法状态、孤立状态）。"
   },
   {
    "t": "h",
    "text": "责任链：请求沿链传递"
   },
   {
    "t": "p",
    "text": "责任链 = 把处理者串成链，请求沿链传递，每个节点决定「处理 + 传递」或「中断」，新增处理节点不改链路结构。两种形态：纯责任链（一个节点处理完就结束，如报销审批）和不纯责任链（每个节点都处理一部分再往下传，如过滤器链），工程里后者更常见。游戏服三个落地：Netty Pipeline——双向责任链，入站从 head 到 tail（解码 → 协议分发 → 业务），出站从 tail 到 head（编码 → 写出），每个 ChannelHandler 是节点，ctx.fireChannelRead() 显式传递，不传就中断，游戏服的「解码器 → 日志记录 → 协议路由」靠它串起来；登录校验链——版本号校验 → 封号校验 → 防沉迷校验 → 白名单/维护校验 → 区服人数上限校验，每个校验器实现 LoginChecker 接口，任一节点拒绝即中断，新增「渠道未成年宵禁」只加一个节点；敏感词过滤链——基础词库 → 变体字归一化 → 组合词 → 语义级检测，便宜的先跑、贵的后跑。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 登录校验链：数组遍历 + 中断语义\npublic interface LoginChecker {\n    LoginResult check(LoginContext ctx);   // 返回通过 or 拒绝原因\n}\n\n@Component(\"version\")\npublic class VersionChecker implements LoginChecker {\n    public LoginResult check(LoginContext ctx) {\n        return ctx.getClientVersion() >= ctx.getMinVersion()\n                ? LoginResult.pass() : LoginResult.reject(\"版本过低，请更新\");\n    }\n}\n\n@Component(\"ban\")\npublic class BanChecker implements LoginChecker {\n    public LoginResult check(LoginContext ctx) {\n        return banService.isBanned(ctx.getAccountId())\n                ? LoginResult.reject(\"账号已被封禁\") : LoginResult.pass();\n    }\n}\n\n@Component\npublic class LoginChain {\n    // Spring 按 @Order 排序后注入：便宜的先跑\n    private final List<LoginChecker> checkers;\n    public LoginChain(List<LoginChecker> checkers) { this.checkers = checkers; }\n\n    public LoginResult verify(LoginContext ctx) {\n        for (LoginChecker c : checkers) {          // 顺序遍历\n            LoginResult r = c.check(ctx);\n            if (!r.isPass()) return r;             // 任一拒绝即中断\n        }\n        return LoginResult.pass();\n    }\n}"
   },
   {
    "t": "h",
    "text": "责任链 vs 装饰器：形似神不似"
   },
   {
    "t": "p",
    "text": "责任链和装饰器结构上都是「持有同接口对象层层传递」，语义完全不同：责任链节点是处理者，各自处理请求的一部分并可中断流程（分而治之、可中途拦截）；装饰器是增强者，在被装饰者调用前后叠加功能、不改请求路由（层层加料）。Netty Pipeline 为什么要双向链表而不是数组：运行期要动态增删 Handler（如按需装载加密层），链表增删 O(1) 且天然维护前驱后继，双向结构区分入站/出站两个传播方向。工程要点：链的组装方式（数组遍历 / next 指针 / Netty 双向链表）、中断与继续语义要约定清楚、@Order 控制顺序；慢节点会阻塞整条链——慢校验异步化、加耗时监控与超时，必要时拆快慢两条链。"
   },
   {
    "t": "pits",
    "items": [
     "状态机价值说不准：核心是结构性杜绝非法迁移，不是「让代码好看」",
     "状态机和乐观锁怎么配合：update ... where status=旧值，影响行数 0 = 并发修改，防止订单重复发货",
     "纯责任链 vs 不纯责任链分不清：一个节点处理完就结束 vs 每个节点处理一段继续传",
     "责任链 vs 装饰器语义混淆：处理者（可中断）vs 增强者（不改变请求路由）",
     "Netty Pipeline 为什么是双向链表：运行期动态增删 Handler 需要 O(1) 且双向区分入站/出站"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：状态机把状态与迁移规则显式建模，非法迁移结构性被拒，配合乐观锁防并发重复发货；责任链把处理者串成链，纯/不纯两形态，Netty Pipeline、登录校验链、敏感词链是标配；两者一个管「状态合法性」，一个管「请求传递」。下一篇讲命令/迭代器/中介者。"
   }
  ]
 },
 {
  "id": "design-pattern-command-iterator-mediator",
  "title": "行为型：命令 / 迭代器 / 中介者",
  "layer": 3,
  "depends": [
   "design-pattern-observer"
  ],
  "covers": [
   "design-pattern-09"
  ],
  "quiz": [
   "design-pattern-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "命令模式把「请求」对象化，获得排队、审计、撤销、回放的时间维度能力；迭代器统一遍历集合而不暴露内部表示；中介者把网状通信收敛成星形——GM 指令系统、操作回放、大厅聊天是它们在游戏服的舞台。"
   },
   {
    "t": "pre",
    "items": [
     "理解封装与对象引用",
     "有 GM 指令/回放/聊天系统的认知",
     "理解 List/Map 遍历"
    ]
   },
   {
    "t": "h",
    "text": "命令模式：把请求变成可传递的对象"
   },
   {
    "t": "p",
    "text": "命令模式 = 把「请求」封装成对象（携带参数 + 接收者 + 执行方法），让请求可以被排队、记录、撤销、回放，而不只是立即执行的函数调用。结构四角色：Command 接口（execute/undo）、ConcreteCommand（绑定接收者和参数）、Invoker（调用/排队命令）、Receiver（真正干活的人）。核心洞察：请求对象化带来了时间维度的能力——命令可以延迟执行、排队执行、持久化重放，这是普通方法调用没有的。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">命令模式：GM 指令系统</text>\n<rect x=\"30\" y=\"46\" width=\"150\" height=\"48\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"105\" y=\"67\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Invoker</text>\n<text x=\"105\" y=\"85\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 指令入口</text>\n<rect x=\"245\" y=\"46\" width=\"150\" height=\"48\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"67\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Command 接口</text>\n<text x=\"320\" y=\"85\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">execute / undo</text>\n<rect x=\"460\" y=\"46\" width=\"150\" height=\"48\" rx=\"7\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"67\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Receiver</text>\n<text x=\"535\" y=\"85\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家/奖励服务</text>\n<path d=\"M180 70 L245 70\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#cm1)\"/>\n<path d=\"M395 70 L460 70\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#cm1)\"/>\n<defs><marker id=\"cm1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"116\" width=\"580\" height=\"44\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"137\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">命令对象化带来的能力</text>\n<text x=\"320\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">排队（Disruptor）· 审计（谁在何时对谁做了什么）· 幂等（commandId 去重）· undo 撤销 · 持久化回放</text>\n<rect x=\"30\" y=\"180\" width=\"580\" height=\"84\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"50\" y=\"204\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏落地</text>\n<text x=\"50\" y=\"226\" font-size=\"12\" fill=\"var(--muted)\">GM 补发命令：带 commandId，执行前查执行记录，已执行直接返回（不会发两次）</text>\n<text x=\"50\" y=\"246\" font-size=\"12\" fill=\"var(--muted)\">战斗回放：命令序列持久化后重新 execute 一遍（帧同步游戏就是这么做的）</text>\n<text x=\"50\" y=\"260\" font-size=\"12\" fill=\"var(--muted)\">宏命令：组合模式用在命令上，execute 顺序执行子命令，undo 逆序撤销</text>\n</svg>",
    "caption": "图 1：命令模式四角色与 GM 指令系统的落地收益"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// GM 指令：命令对象化 + 审计 + 幂等\npublic interface GmCommand {\n    String commandId();\n    void execute(GmContext ctx);   // 执行\n    void undo(GmContext ctx);      // 撤销（可选）\n}\n\npublic class GrantCompensationCommand implements GmCommand {\n    private final String cmdId;         // 唯一命令号，幂等依据\n    private final long playerId;\n    private final List<ItemStack> items;\n    public GrantCompensationCommand(String cmdId, long playerId, List<ItemStack> items) {\n        this.cmdId = cmdId; this.playerId = playerId; this.items = items;\n    }\n    public String commandId() { return cmdId; }\n    public void execute(GmContext ctx) {\n        if (ctx.executedRecord().exists(cmdId)) return;   // 幂等：已执行过直接返回\n        ctx.mailService().send(playerId, Mail.builder()\n                .title(\"补偿\").attach(items).build());\n        ctx.executedRecord().record(cmdId);               // 记录执行痕迹\n    }\n    public void undo(GmContext ctx) {\n        ctx.mailService().recall(playerId, cmdId);        // 误发可回收\n    }\n}\n\n// Invoker：鉴权 → 审计 → 排队执行 → 回执\npublic class GmDispatcher {\n    public void dispatch(GmCommand cmd, String operator, GmContext ctx) {\n        auditLog.log(operator, cmd);          // 审计：谁在何时对谁执行了什么\n        executor.submit(() -> cmd.execute(ctx));  // 排队串行执行\n    }\n}"
   },
   {
    "t": "h",
    "text": "命令 vs 策略：换算法 vs 行为对象化"
   },
   {
    "t": "p",
    "text": "两者都是接口 + 实现类的结构，意图不同：策略是「同一个行为换算法」——问题不变、算法变（排序算法切换）；命令是「把行为本身变成可传递的对象」——命令多了时间维度（可延迟、可存储、可回放）。游戏里的辨析题：奖励发放用策略（发法不同但都是发奖），GM 指令用命令（指令要排队、审计、回放）。和 MQ 消息的区别：命令通常在进程内，强调 execute/undo 语义与接收者绑定；消息是跨进程数据载体，强调路由与投递语义；实践中常串联——消费消息后再构造命令执行。"
   },
   {
    "t": "h",
    "text": "迭代器模式：遍历不露内部结构"
   },
   {
    "t": "p",
    "text": "迭代器提供统一方式顺序访问集合元素，不暴露内部表示。JDK 的 Iterator 就是教科书：hasNext()/next()，集合框架内部结构千差万别（数组/链表/红黑树），但遍历 API 统一，这就是迭代器模式。Java 增强 for 循环、Stream 本质都依赖迭代器。游戏里的落地：背包/技能栏遍历、排行榜分段拉取（按排名区间迭代）、对象池的游标复用。更现代的迭代是 Stream + lambda：filter/map/reduce 是「迭代器 + 高阶函数」的演进，但原理一致——解耦遍历与业务。"
   },
   {
    "t": "h",
    "text": "中介者模式：网状通信收敛成星形"
   },
   {
    "t": "p",
    "text": "中介者把对象之间的复杂网状交互收敛到中介者一个点上：所有对象只和中介者通信，对象之间互不认识，N 个对象从 N×N 的关系降为 N×1。游戏里的场景：大厅/聊天——玩家进出、房间列表、世界消息都经过 HallMediator，房间之间、玩家之间不直接引用；MVC 里的 Controller 就是 View 和 Model 的中介者，View 不直接改 Model。和门面的区别（高频辨析）：门面是单向的——调用方通过门面访问子系统，子系统之间依然可互相调用；中介者是双向的——所有子系统只和中介者通信，互相不直接说话。中介者的代价：中介者容易长成「上帝对象」（所有交互逻辑都堆在它身上），要控制职责边界。"
   },
   {
    "t": "pits",
    "items": [
     "命令 vs 策略混淆：策略换算法（问题不变），命令行为对象化（多了排队/审计/撤销/回放的时间维度）",
     "命令幂等说不清：commandId 执行前查记录、状态机校验，GM 补发不会发两次",
     "宏命令不是天然事务：中间失败要逆序补偿已执行的子命令，或先预校验全部可执行",
     "中介者 vs 门面：一个双向收敛（互相不说话），一个单向入口（子系统仍可互调）",
     "迭代器只会说 List.iterator()：背包遍历、排行榜分段拉取、Stream 底层都是它的应用"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：命令把请求对象化带来排队/审计/幂等/撤销/回放能力，GM 指令系统是标配；迭代器统一遍历不露内部结构；中介者把网状通信收敛成星形（大厅/聊天/MVC Controller），与门面的单向入口要分清。下一篇讲行为型收尾三件套：备忘录/访问者/解释器。"
   }
  ]
 },
 {
  "id": "design-pattern-memento-visitor-interpreter",
  "title": "行为型：备忘录 / 访问者 / 解释器",
  "layer": 3,
  "depends": [
   "design-pattern-command-iterator-mediator"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "备忘录在不破坏封装的前提下保存并恢复对象状态——游戏存档快照与回档的骨架；访问者把操作从对象结构上剥离，新增操作不改节点类；解释器把可配置规则翻译成可执行逻辑——游戏配置表达式引擎的雏形。"
   },
   {
    "t": "pre",
    "items": [
     "理解封装与快照",
     "理解树形结构遍历",
     "理解抽象语法树 AST 的概念"
    ]
   },
   {
    "t": "h",
    "text": "备忘录模式：存档快照与回档"
   },
   {
    "t": "p",
    "text": "备忘录 = 在不破坏封装的前提下，捕获一个对象的内部状态，并在将来某个时刻把这个状态恢复回去。三个角色：发起人 Originator（要保存状态的对象，生成备忘录/从备忘录恢复）、备忘录 Memento（保存状态快照，通常不可变）、管理者 Caretaker（保存/管理备忘录，但不知道里面是什么）。游戏服落地：玩家档案快照——备份玩家背包/等级/货币做回档；副本进度存档——中途退出副本可恢复；GM 回档——线上事故时把一批玩家状态恢复到备份点。工程注意点：备忘录的快照要深拷贝可变部分（背包列表），否则恢复时改到同一份引用；快照要不可变，防止恢复途中被篡改；大数据量快照要序列化落盘（Redis/DB），内存里全量存快照会爆内存。和命令模式的 undo 协同：命令的 undo 常借助备忘录保存执行前状态，回退时恢复。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">备忘录：玩家档案快照与回档</text>\n<rect x=\"30\" y=\"46\" width=\"170\" height=\"70\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Originator</text>\n<text x=\"115\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家档案 PlayerProfile</text>\n<text x=\"115\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">createSnapshot()/restore()</text>\n<rect x=\"235\" y=\"46\" width=\"170\" height=\"70\" rx=\"7\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Memento</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不可变快照</text>\n<text x=\"320\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">深拷贝背包/货币</text>\n<rect x=\"440\" y=\"46\" width=\"170\" height=\"70\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Caretaker</text>\n<text x=\"525\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 回档服务</text>\n<text x=\"525\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">存 Redis，控制版本</text>\n<path d=\"M200 81 L235 81\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#mv1)\"/>\n<path d=\"M405 81 L440 81\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#mv1)\"/>\n<defs><marker id=\"mv1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"320\" y=\"105\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">生成</text>\n<text x=\"500\" y=\"105\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">管理</text>\n<rect x=\"30\" y=\"138\" width=\"580\" height=\"76\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">回档流程：定期/事故前打快照 → GM 选定版本 → restore() 恢复</text>\n<text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">快照必须深拷贝可变部分 + 不可变，否则恢复时改到同一份引用</text>\n<text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全量内存快照会爆内存：大数据量序列化落 Redis/DB，只留近期版本</text>\n</svg>",
    "caption": "图 1：备忘录三角色与游戏回档流程"
   },
   {
    "t": "h",
    "text": "访问者模式：把操作从结构上剥离"
   },
   {
    "t": "p",
    "text": "访问者 = 在不改变对象结构的前提下，为一个集合里的元素添加新的操作——把「数据结构」和「施加在结构上的操作」分离。实现方式：每个元素类实现 accept(visitor) 方法，方法内部回调 visitor.visitXxx(this)，具体操作写进访问者类。收益：新增一种操作只加一个访问者类，不改任何元素类（符合开闭原则）。和组合模式是经典搭档：组合管组织结构（树），访问者管在树上施加操作——导出 JSON、算总战力、校验配置都是访问者。游戏落地：策划配置校验器——同一棵技能树配置，一个访问者校验数值越界、一个访问者导出 JSON、一个访问者生成客户端表，节点类零改动；装备/技能系统的「统计总战力」「日志导出」。代价：访问者适合元素种类稳定的结构，元素种类频繁新增时，每个访问者都要加 visit 方法，反而更难维护——这是访问者的适用边界。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 访问者：技能树操作与结构分离\npublic interface SkillNode {\n    void accept(SkillVisitor v);\n}\n\n// 叶子技能\npublic class SkillLeaf implements SkillNode {\n    public final int id;\n    public final int cost;\n    public SkillLeaf(int id, int cost) { this.id = id; this.cost = cost; }\n    public void accept(SkillVisitor v) { v.visit(this); }\n}\n\n// 容器分支：遍历子树后回调\npublic class SkillBranch implements SkillNode {\n    public final List<SkillNode> children = new ArrayList<>();\n    public void accept(SkillVisitor v) {\n        v.visit(this);\n        for (SkillNode n : children) n.accept(v);   // 递归访问子树\n    }\n}\n\n// 访问者接口：每种元素一个 visit 方法\npublic interface SkillVisitor {\n    void visit(SkillLeaf leaf);\n    void visit(SkillBranch branch);\n}\n\n// 新增操作 = 新增访问者，节点类零改动\npublic class TotalCostVisitor implements SkillVisitor {\n    int total = 0;\n    public void visit(SkillLeaf leaf) { total += leaf.cost; }\n    public void visit(SkillBranch branch) { /* 容器自身无花费，靠遍历子树 */ }\n}\n\n// 校验器访问者：检查前置依赖环、数值越界\npublic class SkillValidator implements SkillVisitor {\n    public void visit(SkillLeaf leaf) { /* 校验单个技能数值 */ }\n    public void visit(SkillBranch branch) { /* 校验分支合法性 */ }\n}"
   },
   {
    "t": "h",
    "text": "解释器模式：把规则翻译成可执行逻辑"
   },
   {
    "t": "p",
    "text": "解释器 = 定义一种语言的文法，并提供一个解释器来解释该语言中的句子。游戏里最实用的形态是「配置表达式引擎」：策划在配置表里写公式（如 damage = base * (1 + critRate * 0.5) + levelBonus），服务器解析成 AST 并求值，改公式不用发版。实现骨架：词法分析（把字符串切成 token）→ 语法分析（按文法组合成表达式树）→ 求值（递归计算节点）。JDK 的 Pattern（正则表达式）、Spring 的 SpEL（#{...}）、Math 表达式引擎（Aviator/QLExpress）都是解释器思想的工业实现。工程建议：生产环境直接用成熟引擎（Aviator/SpEL/QLExpress），自己写解释器用于「理解原理」和极简单的 DSL；解释器的坑：性能（每帧解析会拖垮热路径，要预编译缓存 AST）、安全（表达式注入/死循环，要限制语法白名单、超时、递归深度）、复杂度（文法复杂后维护成本指数上升）。"
   },
   {
    "t": "h",
    "text": "三模式的关系与边界"
   },
   {
    "t": "p",
    "text": "三个模式都偏「结构化」行为型，游戏里常组合：命令的 undo 用备忘录存快照；访问者配合组合遍历技能树；解释器为策划配置提供表达式能力。面试高频边界题：访问者 vs 迭代器——迭代器遍历元素但操作写在调用方，访问者把操作下沉到对象结构上且新增操作不改节点；备忘录 vs 原型——备忘录保存状态供恢复（版本快照），原型复制对象供创建（复制新个体）。"
   },
   {
    "t": "pits",
    "items": [
     "备忘录快照不深拷贝：恢复时改到同一份引用，回档等于没回",
     "访问者适用边界说不清：元素种类频繁新增时访问者更难维护（每个访问者都要加方法），适合结构稳定的树",
     "访问者 vs 迭代器混淆：迭代器遍历操作在调用方，访问者把操作下沉到结构、新增操作不改节点类",
     "解释器自己从零写：生产用 Aviator/SpEL/QLExpress，自研解释器要预编译缓存 AST 并防表达式注入",
     "宏命令/undo 与备忘录的关系说不清：命令的撤销通常靠备忘录保存执行前状态"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：备忘录做状态快照与回档（深拷贝 + 不可变 + 落盘防爆内存）；访问者把操作从结构剥离、新增操作不改节点类（适合结构稳定的树）；解释器把配置表达式翻译成可执行逻辑（生产用成熟引擎 + 预编译缓存）。三模式的组合：命令 undo 靠备忘录，访问者配合组合遍历。下一篇进入并发模式。"
   }
  ]
 },
 {
  "id": "design-pattern-concurrency",
  "title": "并发模式",
  "layer": 3,
  "depends": [
   "design-pattern-singleton"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "并发模式是「设计模式 × JUC」的交叉地带——线程池模式、生产者-消费者、读写锁模式、Leader/Follower、双重检查锁定，游戏服的玩家逻辑线程模型、Disruptor 队列、配置读写分离全靠它们撑着。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉 JUC：线程池、锁、队列、原子类",
     "理解 volatile、synchronized、AQS 基础",
     "有玩家逻辑线程/Disruptor 的使用经验"
    ]
   },
   {
    "t": "h",
    "text": "线程池模式：复用线程避免反复创建"
   },
   {
    "t": "p",
    "text": "线程池模式的核心：把「创建线程」和「执行任务」分离，一组工作线程循环从队列取任务执行，避免高频任务反复创建/销毁线程。这就是 ExecutorService 的骨架——ThreadPoolExecutor 内部就是「工作线程 + 阻塞队列 + 拒绝策略」的经典实现。游戏服的典型落地：玩家逻辑线程池（按 playerId 哈希分发到固定线程，保证同一玩家串行）、定时任务调度线程池（活动开关、跨天结算）、异步写日志线程池。工程要点：核心线程数、最大线程数、队列容量的取舍（IO 密集 vs CPU 密集）；拒绝策略（AbortPolicy/CallerRunsPolicy 的选择）；线程池用完要 shutdown 防止资源泄漏；线程工厂命名（方便排查线程 dump）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">生产者-消费者：Disruptor RingBuffer</text>\n<rect x=\"30\" y=\"46\" width=\"560\" height=\"40\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">生产者：Netty IO 线程 / 协议入站 → 封装成事件投入 RingBuffer</text>\n<rect x=\"120\" y=\"108\" width=\"200\" height=\"52\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"220\" y=\"130\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">RingBuffer 环形队列</text>\n<text x=\"220\" y=\"149\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数组预分配，无锁写</text>\n<rect x=\"350\" y=\"108\" width=\"200\" height=\"52\" rx=\"7\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"450\" y=\"130\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">消费者：业务逻辑线程</text>\n<text x=\"450\" y=\"149\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按玩家串行消费</text>\n<path d=\"M200 88 L200 106\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#cc1)\"/>\n<path d=\"M380 108 L380 92\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#cc2)\"/>\n<defs>\n<marker id=\"cc1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker>\n<marker id=\"cc2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv2)\"/></marker>\n</defs>\n<rect x=\"30\" y=\"182\" width=\"580\" height=\"82\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"206\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服为什么用 Disruptor：超低延迟 + 无锁/少锁 + 预分配数组减少 GC</text>\n<text x=\"320\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同一玩家的请求哈希到同一消费者线程 → 天然串行，杜绝并发改玩家状态</text>\n<text x=\"320\" y=\"248\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">积压监控：队列水位过高 = 该玩家/该服吞吐告警，排查慢 Handler 而非盲目加线程</text>\n</svg>",
    "caption": "图 1：生产者-消费者模式在游戏服的 Disruptor 落地"
   },
   {
    "t": "h",
    "text": "生产者-消费者：解耦与削峰"
   },
   {
    "t": "p",
    "text": "生产者-消费者模式：生产者产数据、消费者处理，中间用队列解耦——生产者不关心谁消费、消费者不关心谁生产，队列天然削峰填谷。游戏服的三大落地：协议请求（Netty IO 线程生产 → 业务线程消费）、日志（业务线程生产 → 日志线程批量刷盘）、跨服消息（Kafka 消费 → 业务处理）。注意几个坑：队列要有界（无界队列会内存溢出），要监控队列积压（水位过高告警）；生产者快消费者慢时的背压策略（限流/拒绝/扩大消费能力）；多消费者要处理好任务分配（按玩家哈希 vs 抢任务）。Disruptor 是比 BlockingQueue 更极致的实现：环形数组预分配、CAS 无锁写、无 GC 压力，游戏服玩家逻辑队列用它能把单玩家操作延迟压到微秒级。"
   },
   {
    "t": "h",
    "text": "读写锁模式与 Leader/Follower"
   },
   {
    "t": "p",
    "text": "读写锁模式：读多写少场景下，读锁共享、写锁互斥，让并发读不被串行化。JDK 的 ReentrantReadWriteLock 和更现代的 StampedLock（乐观读）都是这个思想。游戏服配置表/排行榜缓存的「读多写少」场景：读用共享锁或直接无锁（不可变快照），写用独占锁整对象替换。工程注意：读写锁的写饥饿问题（StampedLock 可缓解）、锁粒度（按配置表拆分而非全局一把锁）、锁内不要做 IO。Leader/Follower 模式是高性能网络模型：一组线程，一个 Leader 负责监听 IO 事件，其他线程是 Follower 排队等待成为 Leader，事件到达时 Leader 指定一个 Follower 处理该连接的数据，自己回到队列——避免每连接一线程的上下文切换开销。它是多 Reactor 模型（Netty 的 boss/worker）的思想来源之一，面试讲 Netty 线程模型时可连带提它。"
   },
   {
    "t": "h",
    "text": "双重检查锁定与并发单例"
   },
   {
    "t": "p",
    "text": "Double-Checked Locking 本身就是并发模式之一——见单例篇的 DCL。它抽象出的模式价值：对于「初始化成本高且只需一次」的资源（配置加载、连接池、本地缓存），先无锁判空避免大部分场景抢锁，锁内再判空避免重复初始化。工程要点：DCL 在 Java 里必须 volatile 防重排序（见单例篇）；更现代的替代是 AtomicReference.compareAndSet 或静态内部类；懒加载容器（如 Guava 的 Suppliers.memoize）内部也是类似思想。并发模式不是独立的 23 模式，但它们是游戏服务器高并发场景下的「模式化解法」——面试时把它们和 JUC 结合讲，能体现并发功底。"
   },
   {
    "t": "pits",
    "items": [
     "线程池参数只背不解释：core/max/队列大小的取舍依据是任务性质（CPU/IO 密集）和排队策略",
     "生产者-消费者队列用无界的：内存溢出风险，要有界 + 水位监控 + 背压策略",
     "读写锁用错场景：写多读少也用读写锁，锁竞争反而更严重；锁内做 IO 是并发大忌",
     "Disruptor 讲不出为什么快：预分配数组 + CAS 无锁写 + 无 GC，比 BlockingQueue 的加锁入队快一个量级",
     "DCL 的 volatile 是并发问题：漏了就拿到半初始化对象，见单例篇的图"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：并发模式是设计模式 × JUC 的交叉——线程池模式复用线程、生产者-消费者解耦削峰（Disruptor 是极致实现）、读写锁模式服务读多写少（配置表/排行榜）、Leader/Follower 是高性能网络模型、DCL 防重复初始化；玩家逻辑线程按玩家哈希串行是游戏服并发设计的基石。下一篇进入架构级模式。"
   }
  ]
 },
 {
  "id": "design-pattern-architecture",
  "title": "架构级模式",
  "layer": 3,
  "depends": [
   "design-pattern-overview"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "架构级模式从「一个类怎么设计」上升到「系统怎么组织」——分层架构、MVC/MVP/MVVM、事件驱动、微服务、游戏服的 ECS 组件模式，它们是架构师视角的模式语言。"
   },
   {
    "t": "pre",
    "items": [
     "理解模块划分与依赖关系",
     "有 SpringBoot 分层与微服务认知",
     "理解事件驱动与消息队列"
    ]
   },
   {
    "t": "h",
    "text": "分层架构：水平切分职责"
   },
   {
    "t": "p",
    "text": "分层架构把系统按职责水平切分，上层依赖下层、下层不感知上层：经典的 表现层 → 业务层 → 数据访问层，游戏服的细化版是 Handler（协议层）→ Service（业务层）→ Dao/Repository（数据访问层），加上配置表层和工具层。收益：职责清晰、可替换性（换 DB 只动 Dao 层）、可测试性（各层独立 mock）。代价与坑：过度分层（Controller → Facade → Service → Manager → Helper → Dao 每层只做透传）是模式滥用重灾区；跨层依赖（业务层直接调 Dao 之外的模块）会破坏分层；依赖方向要一致（上层依赖下层，禁止下层反向依赖）。分层在游戏服的变体：登录服/游戏服/支付服/日志服本身就是物理分层的体现，进程内再按模块水平分层。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">分层架构：游戏服的水平切分</text>\n<rect x=\"60\" y=\"44\" width=\"520\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">表现/协议层：Handler 编解码器</text>\n<path d=\"M320 84 L320 98\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#ar1)\"/>\n<defs><marker id=\"ar1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<rect x=\"60\" y=\"100\" width=\"520\" height=\"40\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"124\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">业务层：Service 玩家/战斗/活动/背包</text>\n<path d=\"M320 140 L320 154\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#ar2)\"/>\n<defs><marker id=\"ar2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv2)\"/></marker></defs>\n<rect x=\"60\" y=\"156\" width=\"520\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">数据访问层：Dao / Redis / DB</text>\n<rect x=\"60\" y=\"216\" width=\"520\" height=\"70\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">分层铁律</text>\n<text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">上层依赖下层，下层不感知上层；禁止跨层反向依赖</text>\n<text x=\"320\" y=\"278\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">过度分层（每层只做透传）是模式滥用重灾区，层要有实际职责</text>\n</svg>",
    "caption": "图 1：游戏服分层架构与铁律"
   },
   {
    "t": "h",
    "text": "MVC / MVP / MVVM：交互层三兄弟"
   },
   {
    "t": "p",
    "text": "MVC（Model-View-Controller）：Model 管数据与业务规则，View 管显示，Controller 接收用户输入并调度 Model/View。它是「中介者模式」在交互层的最佳实践——View 和 Model 不直接对话，都通过 Controller。游戏服的映射：协议请求进 Handler（Controller）→ 改 Model（玩家数据）→ 推送 View（客户端状态同步）。MVP 把 View 进一步抽成接口（Presenter 持有 View 接口，可 mock 测试），MVVM 用双向绑定让 View 状态自动与 ViewModel 同步（前端 Vue/安卓 DataBinding 是代表）。服务器端面试重点不是三者的 UI 细节，而是理解「把交互逻辑从业务逻辑中剥离」的演变动机，以及它们与事件驱动架构的关系。"
   },
   {
    "t": "h",
    "text": "事件驱动架构与微服务模式"
   },
   {
    "t": "p",
    "text": "事件驱动架构（EDA）：系统行为由事件触发，事件是消息在模块/服务间流动，生产者不关心消费者——这是观察者模式在架构层的延伸。游戏服的 EDA 分两层：进程内事件总线（成就/任务/活动监听，见观察者篇）+ 跨进程 MQ 事件（充值完成、跨服排行更新、公告广播）。微服务模式是分布式系统的架构语言：服务注册发现、API 网关（门面模式在微服务下的形态）、配置中心、熔断降级、分布式事务（Saga/补偿）、消息驱动。BFF/聚合服务就是门面模式在微服务下的形态——为客户端聚合并编排多个微服务调用。游戏服用微服务的边界：登录服/支付服天然适合独立服务；游戏服本体通常保持单体 + 模块化（玩家状态强一致性要求高，拆服务会带来分布式事务成本）。"
   },
   {
    "t": "h",
    "text": "游戏服 ECS 组件模式"
   },
   {
    "t": "p",
    "text": "ECS（Entity-Component-System）不是 GoF 23 之一，但它是游戏引擎与游戏服的架构级模式：Entity 只是唯一 ID 的容器；Component 是纯数据（位置、血量、Buff 列表），没有行为；System 是纯逻辑（移动系统、战斗系统），按帧/按事件遍历持有相关组件的 Entity。对比传统 OOP：OO 的「对象既带数据又带行为」在技能/物品/怪物体系里会变成继承树爆炸（所有能加血的都继承基类），ECS 用「数据组合」代替「行为继承」——一个怪物 = 位置 + 血量 + AI + 掉落组件，行为由系统统一处理，组合灵活、缓存友好（数组连续内存）、热更友好（加组件不加类）。游戏服里轻量级 ECS 应用：Buff 系统（Buff 是组件，属性计算系统统一遍历）、技能效果系统、AI 系统。和组合模式的辨析：组合模式是树形结构的统一接口（结构层面），ECS 是数据与行为的分离架构（组织层面）。"
   },
   {
    "t": "pits",
    "items": [
     "过度分层：每层只做透传，读代码要跳五层才能看懂一行业务——层要有实际职责",
     "MVC/MVP/MVVM 分不清动机：核心是交互逻辑从业务剥离，MVVM 是双向绑定",
     "事件驱动 vs 微服务混淆：EDA 是架构范式（事件驱动），微服务是部署/协作范式（服务拆分），两者正交可组合",
     "游戏服强拆微服务：玩家状态强一致性场景拆服务带来分布式事务成本，登录/支付/日志适合独立，游戏服本体常保单体模块化",
     "ECS 和组合模式混淆：ECS 是数据与行为分离（组件组合），组合模式是树形结构统一接口（结构递归）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分层架构水平切分职责（上层依赖下层）、MVC/MVP/MVVM 把交互逻辑从业务剥离、事件驱动是观察者在架构层的延伸、微服务是分布式系统的架构语言（BFF/网关 = 门面的微服务形态）、ECS 用数据组合代替行为继承（Buff/技能/AI 系统适用）；架构模式的取舍核心是「为当前一致性要求选最省成本的形态」。下一篇模式实战落地：把 23 模式组合进一个游戏服。"
   }
  ]
 },
 {
  "id": "design-pattern-practice",
  "title": "模式实战落地：游戏服务器组合拳",
  "layer": 3,
  "depends": [
   "design-pattern-strategy-template",
   "design-pattern-observer",
   "design-pattern-state-chain"
  ],
  "covers": [
   "design-pattern-16",
   "design-pattern-18"
  ],
  "quiz": [
   "design-pattern-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "模式从来不是单独用的——技能系统 = 策略 + 状态机 + 命令，Buff = 装饰器/修饰器列表 + 享元，活动 = 模板方法 + 策略 + 状态机 + 观察者，GM 后台 = 工厂 + 观察者；本讲把「模式组合拳」拆解到协议分发与活动框架两大经典设计题。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉前 15 篇的单个模式",
     "有协议分发框架/活动框架的设计经验",
     "能画出模块依赖图"
    ]
   },
   {
    "t": "h",
    "text": "组合拳一：协议分发框架（至少 5 个模式）"
   },
   {
    "t": "p",
    "text": "生产级协议分发框架至少组合 5 个模式，每个模式解决一个具体问题：注册与路由用「注解 + 工厂」（@Protocol(msgId=1001) 标在 Handler 类上，启动时扫描包构建 Map<Integer, Handler> 路由表，协议号到 Handler 单例的映射共享一份——含享元思想）；分发用策略（Dispatcher 按协议号查表取 Handler，替代 switch 地狱）；前置处理用责任链（登录态校验 → 频率限制 → 黑白名单 → 参数校验，任一拦截即终止，节点可插拔）；Handler 骨架用模板方法（BaseHandler.handle() 固定流程：解析参数 → 权限钩子 → doHandle() 抽象业务 → 统一异常处理 → 打点）；请求对象化用命令模式（请求封装成 RequestContext 投入 Disruptor 队列按玩家串行消费，可排队、可追踪、可统计）；横切增强用代理/AOP（耗时监控、参数日志，不侵入业务）。面试呈现技巧：画「客户端 → 解码 → 责任链 → Dispatcher(查表) → Handler(模板方法) → 队列(命令)」链路图，每个节点说出模式名 + 解决的问题 + 不用它会怎样。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">协议分发框架：模式组合拳</text>\n<rect x=\"30\" y=\"42\" width=\"110\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"85\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">解码器</text>\n<text x=\"85\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty 入站</text>\n<rect x=\"180\" y=\"42\" width=\"110\" height=\"46\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"235\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">前置校验链</text>\n<text x=\"235\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">责任链模式</text>\n<rect x=\"330\" y=\"42\" width=\"110\" height=\"46\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"385\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Dispatcher</text>\n<text x=\"385\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">策略+工厂查表</text>\n<rect x=\"480\" y=\"42\" width=\"130\" height=\"46\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"545\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Handler 骨架</text>\n<text x=\"545\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">模板方法</text>\n<path d=\"M140 65 L180 65\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#pp1)\"/>\n<path d=\"M290 65 L330 65\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#pp1)\"/>\n<path d=\"M440 65 L480 65\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#pp1)\"/>\n<defs><marker id=\"pp1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"330\" y=\"108\" width=\"280\" height=\"46\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Disruptor 请求队列</text>\n<text x=\"470\" y=\"146\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">命令模式 · 按玩家串行</text>\n<path d=\"M545 88 L470 106\" stroke=\"var(--lv3)\" stroke-width=\"1.5\" marker-end=\"url(#pp2)\"/>\n<defs><marker id=\"pp2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n<rect x=\"30\" y=\"172\" width=\"580\" height=\"112\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">工程细节（拉开差距的部分）</text>\n<text x=\"50\" y=\"220\" font-size=\"12\" fill=\"var(--muted)\">路由表构建时机：容器就绪后（ContextRefreshedEvent / SmartInitializingSingleton），否则拿到未注入完整的 Handler</text>\n<text x=\"50\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">协议号冲突：注册时 containsKey 检查，重复直接抛异常 fail-fast，启动期炸出来而非线上随机路由错</text>\n<text x=\"50\" y=\"260\" font-size=\"12\" fill=\"var(--muted)\">按玩家串行：同一玩家请求哈希到同一线程，天然杜绝并发改玩家状态，连点按钮也不会并发重复</text>\n<text x=\"50\" y=\"278\" font-size=\"12\" fill=\"var(--muted)\">热更：路由表读写锁/CopyOnWrite 保护，新 Handler 校验无冲突后再注册；务实做法是灰度服滚动更新</text>\n</svg>",
    "caption": "图 1：协议分发框架的 5 模式组合拳与工程细节"
   },
   {
    "t": "h",
    "text": "组合拳二：配置化活动框架（4 个模式 + 兜底）"
   },
   {
    "t": "p",
    "text": "活动框架的目标：让新活动「只写差异、复用骨架」，四个模式各管一层——状态机管活动生命周期流转（未开启 → 预热 → 进行中 → 领奖期 → 已结束，迁移由定时器时间驱动，玩家请求先过状态门，非法请求结构性被拒）；模板方法管生命周期骨架（BaseActivity 的 final 生命周期：onStart 加载配置初始化 → onPlayerAction 资格校验 → doAction() 抽象玩法 → 记录进度 → onEnd 结算发奖清理，通用逻辑父类收口）；策略管玩法差异（双倍掉落、累计充值、限时商店各自 ActivityPlayStrategy，策划配置表 activityType 决定装配哪个策略）；观察者管事件触发（业务侧 fireEvent(KillEvent)，活动框架的事件监听层把事件路由给关心它的活动，业务系统和活动系统彻底解耦）。配置化收尾：活动时间、参数、奖励全走配置表，策划自助配活动、程序零发版，配置热更用整对象替换保证原子性。兜底设计是拉开差距的部分：活动开关（事故配置层一键关闭）、进度数据落盘策略、跨天/跨服边界处理、同一玩家连点领奖的幂等（状态门 + 乐观锁 + 按玩家串行）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 活动框架：模板方法 + 策略 + 状态机 + 观察者的四合一\npublic abstract class BaseActivity {\n    private final ActivityStateMachine stateMachine = new ActivityStateMachine();\n    protected final Map<String, String> cfg;\n\n    // 模板方法：固定生命周期骨架（final 防破坏）\n    public final void onStart() { stateMachine.fire(Event.START); init(); }\n    public final void onEnd() { stateMachine.fire(Event.END); settle(); }\n    public final void onPlayerAction(Player p, Action act) {\n        if (!stateMachine.is(ActivityState.RUNNING)) return;   // 状态门\n        if (!checkQualify(p, act)) return;                     // 通用资格校验\n        doAction(p, act);                                      // 抽象玩法（子类实现）\n        progressService.record(p, act);                        // 进度持久化\n        eventBus.publish(new ActivityProgressEvent(p, act));   // 观察者：触发衍生逻辑\n    }\n    protected abstract void init();\n    protected abstract void settle();\n    protected abstract boolean checkQualify(Player p, Action act);\n    protected abstract void doAction(Player p, Action act);    // 差异玩法\n}\n\n// 策略：玩法差异（双倍掉落）\n@Component(\"doubleDrop\")\npublic class DoubleDropActivity extends BaseActivity {\n    protected void doAction(Player p, Action act) {\n        // 双倍掉落玩法：击杀奖励 ×2\n    }\n}\n\n// 观察者：业务侧零改动，活动监听事件\n@EventListener\npublic void onKill(KillEvent e) {\n    // 路由给关心击杀的活动（双倍掉落监听它）\n}"
   },
   {
    "t": "h",
    "text": "组合拳三：技能系统、Buff、GM 后台"
   },
   {
    "t": "p",
    "text": "技能系统 = 策略 + 状态机 + 命令：技能效果用策略（火/冰/治疗各一个 SkillEffectStrategy）、技能释放流程用状态机（冷却中/引导中/可释放）、技能操作（释放/打断）用命令对象化便于回放与打断恢复。Buff 系统 = 修饰器列表 + 享元：Buff 效果类型对象享元共享（同一 Buff 效果只一份配置），玩家实例只存 Buff 实例数据（剩余时长、叠层数），属性计算时按优先级遍历修饰器列表聚合。活动系统见上面组合拳二。GM 后台 = 工厂 + 观察者 + 命令：指令对象化（命令模式）统一走鉴权-审计-执行；GM 操作发布事件（观察者）通知在线玩家/日志；指令创建用工厂（指令类型 → Command 实例）。模式组合的核心心法：每个模式对准一个具体问题，先列问题清单再选模式，避免为了用模式而用模式。"
   },
   {
    "t": "pits",
    "items": [
     "只罗列模式名说不出每个模式解决什么问题——面试官要听「不用它会怎样」",
     "路由表构建时机搞错：Handler 依赖未注入完整就注册，运行期 NPE；要等容器就绪（ContextRefreshedEvent）",
     "协议号冲突不防：要 containsKey 检查 + 启动期 fail-fast，别等线上随机路由错",
     "活动框架没有状态门：玩家请求直接进玩法逻辑，非法状态（领奖期刷活动）结构性无法拦截",
     "兜底设计缺失：活动开关、进度落盘、跨天边界、连点幂等，这些才是面试深挖时拉开差距的部分"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：模式组合拳 = 每个模式对准一个具体问题——协议分发框架组合注解+工厂+策略+责任链+模板方法+命令+代理 5~7 个模式；活动框架组合状态机+模板方法+策略+观察者 4 个模式；技能系统=策略+状态机+命令，Buff=修饰器列表+享元，GM=工厂+观察者+命令；会画链路图、讲清每个模式「解决什么问题、不用它会怎样」，才是面试官真正想听的体系化表达。下一篇：模式面试深水区。"
   }
  ]
 },
 {
  "id": "design-pattern-interview",
  "title": "模式面试深水区",
  "layer": 3,
  "depends": [
   "design-pattern-practice"
  ],
  "covers": [
   "design-pattern-17"
  ],
  "quiz": [
   "design-pattern-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "面试深水区不在背结构，而在辨析与权衡——策略 vs 状态、装饰 vs 代理 vs 适配器、工厂 vs 建造者、手绘类图、5 分钟讲清一个模式，以及最常被问的「你怎么把握用模式和过度设计的度」。"
   },
   {
    "t": "pre",
    "items": [
     "熟悉全部 23 模式的结构",
     "有模式使用与重构的实战经验",
     "能徒手画类图"
    ]
   },
   {
    "t": "h",
    "text": "易混模式对比一：策略 vs 状态"
   },
   {
    "t": "p",
    "text": "策略和状态结构上几乎一样（都是接口 + 实现类集合 + 上下文持有），意图不同：策略是「同一件事的算法不同」——客户端主动选，行为互相独立（奖励发放策略、排序算法）；状态是「对象自身状态不同导致行为不同」——状态切换由事件驱动，状态对象之间有关联迁移（订单状态、战斗状态）。一句话区分：策略是「怎么做」的选择（外部决定），状态是「处于什么阶段」的表现（内部迁移）。面试追问：状态模式里上下文持有当前状态对象，fire 事件时把迁移逻辑委托给状态对象处理——这就是状态对象和策略对象结构相同的根源。"
   },
   {
    "t": "h",
    "text": "易混模式对比二：装饰 vs 代理 vs 适配器"
   },
   {
    "t": "p",
    "text": "这三个「包一层」的模式结构几乎相同（都持有一个目标引用），意图完全不同：适配器改接口签名（翻译）——让不兼容的双方协作，重点是接口转换；装饰器增强功能（加料）——调用后叠加行为，不改变接口，调用方无感知；代理控制访问（看门）——决定「能不能调、怎么调」（权限、懒加载、远程转发），关注访问控制而非功能增强。加分技巧：用「访问者 vs 控制者 vs 翻译者」三词区分，再举 JDK 实例——IO 是装饰、RMI 是代理、InputStreamReader 是适配。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">包一层三兄弟 + 两工厂辨析速查</text>\n<rect x=\"30\" y=\"42\" width=\"180\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">适配器</text>\n<text x=\"120\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">改接口签名=翻译</text>\n<text x=\"120\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">InputStreamReader</text>\n<rect x=\"230\" y=\"42\" width=\"180\" height=\"62\" rx=\"7\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">装饰器</text>\n<text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">增强功能=加料</text>\n<text x=\"320\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BufferedInputStream</text>\n<rect x=\"430\" y=\"42\" width=\"180\" height=\"62\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">代理</text>\n<text x=\"520\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">控制访问=看门</text>\n<text x=\"520\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">RMI/Spring AOP</text>\n<rect x=\"30\" y=\"122\" width=\"180\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"146\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">工厂</text>\n<text x=\"120\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">创建哪种对象</text>\n<text x=\"120\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">奖励/渠道/编解码器</text>\n<rect x=\"230\" y=\"122\" width=\"180\" height=\"62\" rx=\"7\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"146\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">建造者</text>\n<text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">复杂对象怎么装</text>\n<text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">邮件/奖励包/Mail.builder</text>\n<rect x=\"30\" y=\"202\" width=\"580\" height=\"46\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">5 分钟讲清一个模式的口径：痛点 → 结构 → 游戏落地 → 坑 → 与易混模式辨析</text>\n<text x=\"320\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先亮痛点（为什么需要），再画结构，再落游戏场景，最后主动讲坑——比背定义强一个量级</text>\n</svg>",
    "caption": "图 1：易混模式辨析速查表"
   },
   {
    "t": "h",
    "text": "易混模式对比三：工厂 vs 建造者 + 手绘类图"
   },
   {
    "t": "p",
    "text": "工厂和建造者都「创建对象」，分工不同：工厂解决「创建哪种对象」（类型选择，返回值是产品接口），建造者解决「这个复杂对象怎么一步步装出来」（分步构建 + 统一校验，返回值是产品本身）。区别一句话：工厂管「选型」，建造者管「装配」。手绘类图是硬技能：面试官常要求「画一下策略模式类图」——白板上画 Strategy 接口、ConcreteStrategyA/B、Context（持有 Strategy），三条线讲清：箭头（依赖/实现/组合）含义、接口和抽象类的画法、泛型不用画。练手建议：把 5 分钟讲清一个模式（痛点 → 结构 → 游戏落地 → 坑 → 辨析）和对应类图各准备一遍，做到「盲画」。5 分钟口径里最容易出彩的是「坑」和「辨析」两段——这两段是背书和实战的分界线。"
   },
   {
    "t": "h",
    "text": "过度设计：模式使用的分寸感"
   },
   {
    "t": "p",
    "text": "面试最常问的价值观题：设计模式经常被批「过度设计」，你怎么把握度？判断标准就一条——痛点真实存在才上模式，为「想象中的变化」提前上模式就是过度设计。三问框架：变化点真实吗（有明确计划才提前抽象，Rule of Three：第三次重复才抽象）；复杂度付得起吗（为一个被调两次的流程引入工厂+策略+模板方法三层抽象，维护成本超过收益）；团队接得住吗（团队没人会改、不敢改，就是负资产）。见过的真实滥用：单例滥用（工具类全静态单例，状态互相污染、测试无法隔离）、为模式而模式（三行业务硬套策略工厂，类数量是业务代码十倍）、过度分层（每层只做透传）、接口执念（只有一个实现的接口满天飞）。游戏服务实经验：热路径（战斗结算、状态同步）优先直白高效，间接层在高频路径上是真开销；低频管理路径（GM、活动配置）优先可扩展可维护。「性能敏感处做减法，变化频繁处做抽象」。重构观：模式更多是「重构的目标」而不是「设计的起点」——先写能跑的直白代码，痛点出现再演进。收尾金句：设计模式是武器库不是军规，十年经验的差别不在于多会背 23 种模式，而在于知道什么时候不用。"
   },
   {
    "t": "pits",
    "items": [
     "策略 vs 状态答反：策略=外部主动选的算法（怎么做），状态=内部事件驱动的阶段（处于什么），状态对象间有关联迁移",
     "装饰/代理/适配器只用「都是包一层」搪塞：翻译/加料/看门三个意图词必须脱口而出",
     "工厂 vs 建造者说不清：工厂管选型（哪种产品），建造者管装配（怎么一步步装 + build 校验）",
     "手绘类图画不出来：依赖/实现/组合的箭头含义要烂熟，5 分钟口径背熟",
     "过度设计只批判不反思：三问框架（变化真实/复杂度/团队）+ Rule of Three + 热路径做减法才是成熟工程观"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：面试深水区考的是辨析和权衡——策略 vs 状态（怎么做 vs 处于什么）、装饰 vs 代理 vs 适配器（加料/看门/翻译）、工厂 vs 建造者（选型 vs 装配）；5 分钟讲清一个模式的口径是痛点→结构→落地→坑→辨析；过度设计的判断标准是三问 + Rule of Three，热路径做减法、变化频繁处做抽象；模式是武器库不是军规，知道什么时候不用才是十年功力。至此 16 篇设计模式教程完结。"
   }
  ]
 }
]
};
