window.TB = window.TB || {};
window.TB["spring"] = {
  id: "spring",
  name: "Spring 与 SpringBoot",
  icon: "🌱",
  nodes: [
 {
  "id": "spring-core-ioc",
  "title": "Spring 核心与 IOC 容器",
  "layer": 0,
  "depends": [],
  "covers": [
   "spring-01",
   "spring-05"
  ],
  "quiz": [
   "spring-01",
   "spring-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "IOC（控制反转）不是一种技术，而是一种设计思想：把对象的创建与依赖组装权从业务代码里抽出来，反转给容器统一管理。这是你理解 Spring 一切特性的地基。"
   },
   {
    "t": "pre",
    "items": [
     "会写最基本的 Java：类、接口、new 对象、构造器",
     "能看懂游戏服里 Handler/Service/Dao 的分层结构",
     "不需要任何 Spring 使用经验"
    ]
   },
   {
    "t": "h",
    "text": "没有 Spring 时，游戏服的依赖怎么管理"
   },
   {
    "t": "p",
    "text": "设想一个登录服：登录 Handler 需要 PlayerService，PlayerService 需要 PlayerDao 和 Redis 操作类，PlayerDao 又需要 DataSource……最原始的做法是在每个使用方里 new：LoginHandler 里 new PlayerService(new PlayerDao(new DataSource()))。代码一多，构造链越来越深，改一个依赖就要牵动一大片调用点。更麻烦的是单例管理——你想保证全局只有一个 PlayerService 实例，就得自己写静态工厂、自己维护注册表。这就是 Spring IOC 容器要解决的痛点：把'谁来创建对象、谁负责把它们组装起来、谁来保证单例'这个职责，从你手里收走。"
   },
   {
    "t": "h",
    "text": "IOC 与 DI 的关系"
   },
   {
    "t": "p",
    "text": "IOC（Inversion of Control，控制反转）是思想：创建与装配的控制权从代码反转给容器。DI（Dependency Injection，依赖注入）是实现手段：容器把 Bean 的依赖通过构造器/Setter/字段等方式注入给目标对象。面试时要主动讲清'DI 是 IOC 的实现手段'，别把两者说成并列技术。你用 @Autowired 声明'我需要什么'，容器负责'从哪里找、怎么建、怎么给'。Spring 的容器约等于一张大注册表：Bean 定义（BeanDefinition）进表，Bean 实例出表。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 传统写法：依赖硬编码在调用方\npublic class LoginHandler {\n    // 每次 new，依赖链深、难替换、难测试\n    private final PlayerService playerService =\n        new PlayerService(new PlayerDao(new DataSourceConfig().getDataSource()));\n}\n\n// IOC 写法：只声明需要什么，容器给什么\n@Component\npublic class LoginHandler {\n    private final PlayerService playerService;   // 依赖不可变，方便测试\n\n    public LoginHandler(PlayerService playerService) { // 构造器注入，官方推荐\n        this.playerService = playerService;\n    }\n}\n\n// PlayerService 也由容器托管，被引用的实例由容器保证单例\n@Service\npublic class PlayerService {\n    private final PlayerDao playerDao;\n    public PlayerService(PlayerDao playerDao) { this.playerDao = playerDao; }\n}"
   },
   {
    "t": "h",
    "text": "BeanFactory 与 ApplicationContext"
   },
   {
    "t": "p",
    "text": "容器有两个核心接口，面试高频辨析题：BeanFactory 是顶层接口，定义 getBean 等最基本能力，默认懒加载——只有调用 getBean 时才创建实例；ApplicationContext 是 BeanFactory 的增强实现（典型实现 ClassPathXmlApplicationContext / AnnotationConfigApplicationContext），启动时默认预实例化所有单例 Bean，并额外提供事件发布（ApplicationEvent）、国际化（MessageSource）、资源加载（ResourceLoader）、环境抽象（Environment）等能力。企业项目（包括你们 GM 后台）用的都是 ApplicationContext 及其子类。SpringBoot 里用的是 AnnotationConfigApplicationContext 衍生实现，注解驱动，几乎看不到 XML。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"30\" y=\"20\" width=\"280\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n<text x=\"170\" y=\"48\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">BeanFactory（顶层接口）</text>\n<text x=\"170\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">getBean / 单例注册表</text>\n<text x=\"170\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">懒加载：用到才建</text>\n<rect x=\"330\" y=\"20\" width=\"280\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"470\" y=\"48\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">ApplicationContext（企业级）</text>\n<text x=\"470\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">预实例化单例 + 事件发布</text>\n<text x=\"470\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">+ 国际化 + 资源加载 + 环境抽象</text>\n<path d=\"M310 55 L330 55\" stroke=\"var(--accent)\" stroke-width=\"3\" marker-end=\"url(#ar1)\"/>\n<defs><marker id=\"ar1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"130\" width=\"580\" height=\"60\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"155\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">AnnotationConfigApplicationContext</text>\n<text x=\"320\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">注解驱动：扫描 @Component/@Configuration/@Service 等注解装配 Bean（SpringBoot 默认）</text>\n<rect x=\"30\" y=\"210\" width=\"580\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"234\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服映射</text>\n<text x=\"320\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录服/游戏服的 Handler 是容器 Bean → 无状态单例共享</text>\n<text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 后台（RuoYi）SpringBoot 重构后几乎零 XML，全注解装配</text>\n</svg>",
    "caption": "图 1：BeanFactory 与 ApplicationContext 的分层关系"
   },
   {
    "t": "h",
    "text": "容器启动流程（refresh 主流程）"
   },
   {
    "t": "p",
    "text": "ApplicationContext 的启动核心是 AbstractApplicationContext.refresh()，它是一套规定好的启动编排，主要阶段依次是：prepareRefresh（准备环境，标记活动状态）→ obtainFreshBeanFactory（读取并解析配置，把 <bean> 定义或 @Component 扫描结果转成 BeanDefinition）→ prepareBeanFactory / postProcessBeanFactory（容器级后处理，注册内置 Bean）→ invokeBeanFactoryPostProcessors（执行 BeanFactoryPostProcessor，可修改 BeanDefinition——占位符替换就在这里）→ registerBeanPostProcessors（注册实例级后处理器 BeanPostProcessor，AOP 代理器就在这批里）→ initMessageSource / initApplicationEventMulticaster（初始化国际化与事件广播器）→ onRefresh（模板方法，SpringBoot 在这里启动内嵌 Web 容器）→ registerListeners → finishBeanFactoryInitialization（预实例化所有非懒加载单例 Bean，走完整生命周期）→ finishRefresh（发布 ContextRefreshedEvent 事件）。最后 addShutdownHook 注册 JVM 关闭钩子，实现优雅销毁。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">refresh() 启动主流程（省略辅助阶段）</text>\n<rect x=\"30\" y=\"45\" width=\"130\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">解析配置</text>\n<text x=\"95\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">生成 BeanDefinition</text>\n<rect x=\"190\" y=\"45\" width=\"130\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">BFPP 执行</text>\n<text x=\"255\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">改定义/占位符</text>\n<rect x=\"350\" y=\"45\" width=\"130\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"415\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">注册 BPP</text>\n<text x=\"415\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">含 AOP 代理器</text>\n<rect x=\"510\" y=\"45\" width=\"130\" height=\"52\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"575\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">实例化单例</text>\n<text x=\"575\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全部 Bean</text>\n<path d=\"M160 71 L190 71\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arA)\"/>\n<path d=\"M320 71 L350 71\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arA)\"/>\n<path d=\"M480 71 L510 71\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arA)\"/>\n<defs><marker id=\"arA\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<rect x=\"30\" y=\"130\" width=\"610\" height=\"52\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"335\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">onRefresh：SpringBoot 在此启动内嵌 Tomcat/Netty WebServer</text>\n<text x=\"335\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Boot 通过 WebServerFactory 创建 Servlet 容器并 bind 端口</text>\n<rect x=\"30\" y=\"200\" width=\"610\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"335\" y=\"223\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">finishRefresh：发布 ContextRefreshedEvent</text>\n<text x=\"335\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">监听该事件 = 容器就绪后的启动钩子（ApplicationRunner 同阶段）</text>\n</svg>",
    "caption": "图 2：refresh() 启动主流程关键阶段"
   },
   {
    "t": "h",
    "text": "Bean 定义与注册"
   },
   {
    "t": "p",
    "text": "BeanDefinition 是容器里 Bean 的'图纸'：记录 Bean 的类名、作用域（scope）、是否懒加载、初始/销毁方法、构造器参数、属性值、依赖关系等。@Component 系列注解、@Bean 方法、XML <bean> 最终都会转成 BeanDefinition 注册进 BeanDefinitionRegistry（DefaultListableBeanFactory 同时实现注册表）。SpringBoot 3.x 里默认使用类路径扫描 + @Bean 注解驱动，几乎不再有 XML 定义。理解'定义与实例分离'很重要：定义是图纸，实例是产品；BeanFactoryPostProcessor 改图纸，BeanPostProcessor 改产品——这两个扩展点的区分是 spring-18 的核心考点，会在手写容器篇展开。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Configuration          // 配置类本身也是 Bean\npublic class GameConfig {\n\n    @Bean               // 返回值注册为 Bean，方法名即 Bean 名\n    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {\n        RedisTemplate<String, Object> template = new RedisTemplate<>();\n        template.setConnectionFactory(factory);\n        return template; // 会被 CGLIB 代理拦截，保证单例\n    }\n\n    @Bean(initMethod = \"init\", destroyMethod = \"close\")\n    public NettyServer nettyServer() {\n        return new NettyServer(); // 指定初始/销毁回调\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "把 IOC 和 DI 说成两个并列概念：DI 是 IOC 的实现手段，先定义后手段才是正确姿势",
     "只说 BeanFactory 是'懒加载'而不讲 ApplicationContext 额外能力（事件/国际化/资源/环境），会显得只背名字",
     "答不出 refresh() 里 BFPP 与 BPP 的执行阶段，启动流程题直接扣分",
     "默认作用域是 singleton，但说'单例就是全局一个对象'不严谨——单例范围是容器，多容器就有多实例"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：IOC 把创建与装配权反转给容器，DI 是手段；BeanFactory 懒加载打底，ApplicationContext 预实例化并提供企业级能力；refresh() 是启动总编排，先出定义后出实例；游戏服里 Handler/Service 全是容器托管的无状态单例。下一篇讲依赖注入的三种方式与注解细节。"
   }
  ]
 },
 {
  "id": "spring-di-detail",
  "title": "依赖注入详解",
  "layer": 0,
  "depends": [
   "spring-core-ioc"
  ],
  "covers": [
   "spring-08",
   "spring-26"
  ],
  "quiz": [
   "spring-08",
   "spring-26"
  ],
  "body": [
   {
    "t": "lead",
    "text": "DI 是 IOC 的落地手段，掌握构造器/Setter/字段三种注入的取舍，以及 @Autowired/@Resource/@Qualifier 的装配细节，是写出可维护、可测试游戏服代码的基本功。"
   },
   {
    "t": "pre",
    "items": [
     "理解 IOC 容器与 Bean 的概念（见上一篇）",
     "用过 @Autowired 注入过 Service/Dao"
    ]
   },
   {
    "t": "h",
    "text": "三种注入方式对比"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "构造器注入",
     "Setter 注入",
     "字段注入 @Autowired"
    ],
    "rows": [
     [
      "依赖可变性",
      "不可变（可 final）",
      "可变",
      "可变"
     ],
     [
      "依赖可见性",
      "构造签名显式可见",
      "方法签名可见",
      "隐藏，看字段才知"
     ],
     [
      "单测友好",
      "可直接 new 传依赖",
      "可 set 后测",
      "需反射/Spring 启动"
     ],
     [
      "依赖完整性",
      "构造完即完整可用",
      "可能被 partial 构造",
      "依赖可能为 null"
     ],
     [
      "循环依赖",
      "不支持（直接报错）",
      "支持",
      "支持"
     ],
     [
      "官方态度",
      "推荐首选",
      "可选依赖用",
      "最方便但最不推荐"
     ]
    ]
   },
   {
    "t": "p",
    "text": "官方推荐构造器注入：依赖是 final 的，对象构造完就完整可用，单测时直接 new 传 mock 即可，还能让循环依赖在设计期就暴露出来（构造器循环依赖启动即报错，逼迫你重构，而不是藏着问题上线）。字段注入最省事，但隐藏了依赖、不能 final、单测要起容器，且容易掩盖循环依赖。游戏服里 Service 层建议全部构造器注入，Controller/Handler 可酌情字段注入。Setter 注入适合可选依赖（配默认值）或需要运行时更换实现的场景。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">三种注入方式对比</text>\n<rect x=\"20\" y=\"42\" width=\"195\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"66\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">构造器注入 ★推荐</text>\n<text x=\"117\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">public Handler(Service s)</text>\n<text x=\"117\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">final 不可变</text>\n<text x=\"117\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单测直接 new</text>\n<text x=\"117\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">暴露循环依赖</text>\n<text x=\"117\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">强制完整依赖</text>\n<rect x=\"225\" y=\"42\" width=\"195\" height=\"150\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"66\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">Setter 注入</text>\n<text x=\"322\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">@Autowired</text>\n<text x=\"322\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">void setService(S s)</text>\n<text x=\"322\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可变依赖</text>\n<text x=\"322\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可选依赖/默认值</text>\n<text x=\"322\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可能 partial 构造</text>\n<rect x=\"430\" y=\"42\" width=\"195\" height=\"150\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"527\" y=\"66\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">字段注入</text>\n<text x=\"527\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">@Autowired</text>\n<text x=\"527\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">private S s;</text>\n<text x=\"527\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">最省事</text>\n<text x=\"527\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">依赖隐藏</text>\n<text x=\"527\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">单测要起容器</text>\n</svg>",
    "caption": "图 3：构造器 / Setter / 字段三种注入的取舍"
   },
   {
    "t": "h",
    "text": "@Autowired / @Resource / @Qualifier / @Primary"
   },
   {
    "t": "p",
    "text": "@Autowired 是 Spring 的注解，默认按类型（byType）装配；容器里同类型有多个 Bean 时抛 NoUniqueBeanDefinitionException，需要用 @Qualifier(\"beanName\") 点名，或在某个实现上标 @Primary 作为默认候选。@Resource 是 JSR-250 规范注解，默认按名称（byName）装配——字段名/Setter 名当 Bean 名，找不到再退化为按类型；显式写 @Resource(name=\"xxx\") 则完全按名。当 @Primary 和 @Qualifier 同时出现时 @Qualifier 生效（精确点名优先于默认候选）。@Autowired 还有个 required = false 表示找不到依赖时注入 null 而不报错（慎用，掩盖问题）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Service\npublic class PlayerService {\n    // 单类型：直接注入\n    private final PlayerDao playerDao;\n\n    // 同类型多实现：注入集合，key 为 Bean 名（策略模式核心写法）\n    private final Map<String, GameHandler> handlerMap;\n\n    public PlayerService(PlayerDao playerDao,\n                         List<RewardHandler> rewardHandlers,\n                         Map<String, GameHandler> handlerMap) {\n        this.playerDao = playerDao;\n        this.handlerMap = handlerMap;\n        // List<RewardHandler>：Spring 自动收集该类型全部实现 Bean\n        // Map<String, GameHandler>：key 是 Bean 名，value 是实例\n    }\n\n    @Autowired\n    @Qualifier(\"kafkaTemplate\")\n    private KafkaTemplate<String, String> kafka; // 多个 KafkaTemplate 时点名\n}"
   },
   {
    "t": "h",
    "text": "同类型多 Bean 的工程化解法：策略模式"
   },
   {
    "t": "p",
    "text": "游戏服最常见的 DI 实战是协议分发：定义 GameHandler 接口，每种协议一个实现类，启动时容器把这些实现注入到 Map<String, GameHandler> 或 List<GameHandler> 中，再按协议号路由。这样天然满足开闭原则——新协议 = 新增一个 @Component Handler 类，分发代码零改动。批量注入 List 时可用 @Order 或 Ordered 接口控制顺序。注意：@Order 只影响集合注入/拦截器链等特定场景的排序，并不控制 Bean 的实例化顺序，这是 spring-22 的高频考点。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public interface GameHandler {\n    int opcode();        // 协议号\n    void handle(PlayerContext ctx, Message msg);\n}\n\n@Component\npublic class LoginHandler implements GameHandler {\n    private final PlayerService playerService;\n    public LoginHandler(PlayerService playerService) {\n        this.playerService = playerService;\n    }\n    @Override public int opcode() { return 1001; }\n    @Override public void handle(PlayerContext ctx, Message msg) {\n        playerService.onLogin(ctx.getPlayerId());\n    }\n}\n\n@Component\npublic class HandlerRouter {\n    private final Map<String, GameHandler> handlerMap; // Bean 名 -> 实现\n\n    public HandlerRouter(Map<String, GameHandler> handlerMap) {\n        // 启动时构建 opcode -> Handler 路由表\n        this.handlerMap = handlerMap;\n    }\n\n    public GameHandler get(int opcode) {\n        return handlerMap.values().stream()\n            .filter(h -> h.opcode() == opcode)\n            .findFirst().orElse(null);\n    }\n}"
   },
   {
    "t": "h",
    "text": "自动装配原理一句话"
   },
   {
    "t": "p",
    "text": "字段/Setter 的 @Autowired 由 AutowiredAnnotationBeanPostProcessor 在属性填充阶段（populateBean）处理：拿到字段的注入点，调用 beanFactory 的依赖解析（resolveDependency）按类型找 Bean，找不到且 required=true 就抛异常。构造器注入的 @Autowired（单构造器可省略注解）在实例化阶段由构造器解析器处理。整个装配发生在 Bean 生命周期'属性填充'这一环，所以它天然支持 setter 注入的循环依赖（详见循环依赖篇）。"
   },
   {
    "t": "pits",
    "items": [
     "@Autowired 和 @Resource 默认策略说反：前者 byType、后者 byName",
     "注入 Map<String, X> 时说'key 是类名'：key 是 Bean 名（首字母小写的类名，除非显式指定）",
     "说 @Primary 优先于 @Qualifier：实际 @Qualifier 显式点名优先级更高",
     "同一类型注入 List 时抱怨顺序不对：用 @Order/Ordered，而非调整 Bean 定义顺序"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：构造器注入是首选（final + 可测 + 暴露循环依赖），字段注入最省事但藏着依赖；@Autowired 按类型、@Resource 按名称、@Qualifier 点名、@Primary 兜底；游戏服协议分发用注入 Map/List 实现策略模式。下一篇进入 Bean 生命周期与作用域。"
   }
  ]
 },
 {
  "id": "spring-bean-lifecycle",
  "title": "Bean 生命周期与作用域",
  "layer": 1,
  "depends": [
   "spring-core-ioc"
  ],
  "covers": [
   "spring-02",
   "spring-03"
  ],
  "quiz": [
   "spring-03",
   "spring-02"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Bean 生命周期是一串有顺序的回调点：实例化 → 属性填充 → Aware → 初始化前后 → 初始化 → 使用 → 销毁。作用域决定'容器里存几个实例'。记住主线，所有 Spring 高级问题（AOP、事务、事件）都挂在这条时间轴上。"
   },
   {
    "t": "pre",
    "items": [
     "理解 BeanDefinition 与实例的分离（IOC 篇）",
     "用过 @Autowired、@PostConstruct"
    ]
   },
   {
    "t": "h",
    "text": "生命周期九步主线"
   },
   {
    "t": "list",
    "items": [
     "实例化：createBeanInstance，反射调用构造器（单例优先用无参构造器缓存或 Supplier），此时属性还是空的",
     "属性填充：populateBean，处理 @Autowired/@Value/@Resource，完成依赖注入",
     "Aware 回调：BeanNameAware、BeanFactoryAware、ApplicationContextAware 等，容器把自身引用塞给 Bean（按需实现）",
     "BeanPostProcessor.postProcessBeforeInitialization：初始化前处理，每个 Bean 都会走",
     "初始化：@PostConstruct → InitializingBean.afterPropertiesSet() → 自定义 init-method（三件套顺序固定）",
     "BeanPostProcessor.postProcessAfterInitialization：初始化后处理，AOP 代理就在这里生成并替换原 Bean",
     "就绪：Bean 进入容器单例池，对外可用",
     "使用：getBean 或注入时拿到",
     "销毁：容器关闭 → @PreDestroy → DisposableBean.destroy() → destroy-method"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 340\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Bean 生命周期主线（singleton 场景）</text>\n<rect x=\"30\" y=\"48\" width=\"100\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"80\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">1 实例化</text>\n<text x=\"80\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">构造器</text>\n<rect x=\"150\" y=\"48\" width=\"100\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"200\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">2 属性填充</text>\n<text x=\"200\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@Autowired</text>\n<rect x=\"270\" y=\"48\" width=\"100\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">3 Aware</text>\n<text x=\"320\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">容器引用</text>\n<rect x=\"390\" y=\"48\" width=\"110\" height=\"46\" rx=\"7\" fill=\"var(--lv2)\" stroke=\"#fff\" stroke-width=\"1.5\"/>\n<text x=\"445\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"#fff\">4 前置处理</text>\n<text x=\"445\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"#fff\">BeforeInit</text>\n<rect x=\"520\" y=\"48\" width=\"100\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"570\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">5 初始化</text>\n<text x=\"570\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">PostConstruct</text>\n<path d=\"M130 71 L150 71\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arB)\"/>\n<path d=\"M250 71 L270 71\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arB)\"/>\n<path d=\"M370 71 L390 71\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arB)\"/>\n<path d=\"M500 71 L520 71\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arB)\"/>\n<defs><marker id=\"arB\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<rect x=\"30\" y=\"130\" width=\"290\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"175\" y=\"154\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">6 后置处理 AfterInitialization</text>\n<text x=\"175\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">AOP 代理在此生成并替换原 Bean</text>\n<text x=\"175\" y=\"193\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">★ 容器里最终是代理对象</text>\n<rect x=\"350\" y=\"130\" width=\"270\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"485\" y=\"154\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">7 就绪 8 使用</text>\n<text x=\"485\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">进入单例池，getBean 对外提供</text>\n<text x=\"485\" y=\"193\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服：Handler 在此可被路由</text>\n<rect x=\"30\" y=\"230\" width=\"590\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"253\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">9 销毁：@PreDestroy → DisposableBean.destroy() → destroy-method</text>\n<text x=\"325\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">容器 close 时触发；优雅停机阶段释放连接池/线程池</text>\n<path d=\"M320 200 L320 230\" stroke=\"var(--lv3)\" stroke-width=\"2\" marker-end=\"url(#arC)\"/>\n<defs><marker id=\"arC\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n</svg>",
    "caption": "图 4：Bean 生命周期九步主线，AOP 代理在第 6 步生成"
   },
   {
    "t": "h",
    "text": "初始化三件套的执行顺序"
   },
   {
    "t": "p",
    "text": "@PostConstruct（JSR-250 规范注解）→ InitializingBean.afterPropertiesSet()（Spring 接口）→ 自定义 init-method（XML/注解里指定的方法）。记忆法：先规范、再接口、后配置。同理销毁顺序：@PreDestroy → DisposableBean.destroy() → destroy-method。AOP 代理在 postProcessAfterInitialization 生成，这意味着：如果你在 @PostConstruct 里把 this 注册到外部，外部拿到的是未代理的原始对象——AOP（事务/缓存/异步注解）全部失效。这是生命周期最著名的坑，游戏服注册回调到其他系统时要注意。"
   },
   {
    "t": "h",
    "text": "作用域：singleton 与 prototype"
   },
   {
    "t": "p",
    "text": "singleton（默认）：容器内唯一实例。无状态 Bean 才安全——Service/Dao/Handler 是纯逻辑，共享没问题。prototype：每次注入/获取都新建，Spring 只管创建不管销毁（销毁回调不保证执行），适合有状态的一次性对象。还有 Web 作用域 request/session/application/websocket，底层靠代理对象实现。把 prototype Bean 注入到单例 Bean 会退化成单例（单例只装配一次）——解法是 @Lookup 方法注入、注入 ObjectFactory/Provider 每次 getObject()，或注入 ApplicationContext 按需 getBean。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">作用域对比与游戏服陷阱</text>\n<rect x=\"25\" y=\"45\" width=\"190\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">singleton（默认）</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">容器内唯一实例</text>\n<text x=\"120\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Handler/Service 全是</text>\n<rect x=\"225\" y=\"45\" width=\"190\" height=\"80\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">prototype</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">每次获取新建</text>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不管理销毁</text>\n<rect x=\"425\" y=\"45\" width=\"190\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">request/session</text>\n<text x=\"520\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Web 作用域</text>\n<text x=\"520\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">底层是代理对象</text>\n<rect x=\"25\" y=\"150\" width=\"590\" height=\"62\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">★ 单例 Handler 绝不能存玩家状态</text>\n<text x=\"320\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">'当前玩家'写进 Handler 字段 = 所有玩家共享一个字段 = 串号事故；状态放 Player 对象或参数传递</text>\n<text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty 异步线程下 ThreadLocal 慎用：线程换了，ThreadLocal 里就是别人的数据</text>\n</svg>",
    "caption": "图 5：作用域类型与单例 Handler 的无状态原则"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Component\n@Scope(\"prototype\")\npublic class BattleInstance {\n    // 有状态的一次性对象：每次获取都是新实例\n    private final List<PlayerUnit> units = new ArrayList<>();\n}\n\n@Service\npublic class BattleService {\n    // 注入 provider，每次调用 getObject() 拿新实例\n    private final ObjectProvider<BattleInstance> battleProvider;\n\n    public BattleService(ObjectProvider<BattleInstance> battleProvider) {\n        this.battleProvider = battleProvider;\n    }\n\n    public void createBattle(int roomId) {\n        BattleInstance inst = battleProvider.getObject(); // 每次新建\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "单例 Bean 里放可变玩家状态：登录服/游戏服串号事故的第一来源",
     "@PostConstruct 里把 this 抛给外部：拿到未代理对象，AOP 全失效",
     "把 prototype Bean 直接字段注入单例：退化成单例，行为不符预期",
     "说销毁回调对 prototype 一定执行：Spring 对 prototype 不保证销毁回调",
     "混淆初始化三件套顺序：PostConstruct → afterPropertiesSet → init-method"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：生命周期主线 实例化→填充→Aware→前置→初始化→后置(AOP)→就绪→销毁；单例作用域要求 Bean 无状态，游戏服 Handler 的状态必须放 Player 上下文；初始化三件套顺序是高频考点。下一篇：循环依赖与三级缓存。"
   }
  ]
 },
 {
  "id": "spring-circular-dependency",
  "title": "循环依赖与三级缓存",
  "layer": 1,
  "depends": [
   "spring-bean-lifecycle"
  ],
  "covers": [
   "spring-10"
  ],
  "quiz": [
   "spring-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Spring 用三级缓存解决 setter/字段注入的单例循环依赖，但构造器注入的循环依赖无解。理解'为什么必须是三级而不是二级'是这道题拿满分的题眼。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Bean 生命周期中'实例化'与'属性填充'是两步（见生命周期篇）",
     "理解 AOP 代理在初始化后阶段生成"
    ]
   },
   {
    "t": "h",
    "text": "什么是循环依赖"
   },
   {
    "t": "p",
    "text": "A 依赖 B，B 又依赖 A，两者互相引用。若容器创建 A 时要 B、创建 B 时要 A，形成死循环。Spring 只在特定条件下能解决：单例作用域 + setter/字段注入。构造器注入的循环依赖无法解决——构造器要求在对象构造瞬间拿到全部依赖，此时 A 还没实例化完，无处可拿，直接抛 BeanCurrentlyInCreationException。prototype 作用域也不支持：不缓存，每次新建，会无限递归。"
   },
   {
    "t": "h",
    "text": "三级缓存分别存什么"
   },
   {
    "t": "p",
    "text": "在 DefaultSingletonBeanRegistry 里有三个 Map：一级 singletonObjects 存'成品'（初始化完成的 Bean）；二级 earlySingletonObjects 存'半成品'（实例化完但属性未填充/初始化未完成的 Bean，即提前暴露的引用）；三级 singletonFactories 存 ObjectFactory 工厂对象，是能产出'早期引用'的 lambda。核心 trick 是三级缓存存的是工厂 lambda 而非直接存半成品——它延迟到真正被循环引用时（getEarlyBeanReference）才执行，此时如果该 Bean 需要 AOP 代理，就当场生成代理；不需要就原样返回。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">三级缓存结构（DefaultSingletonBeanRegistry）</text>\n<rect x=\"25\" y=\"48\" width=\"190\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">一级 singletonObjects</text>\n<text x=\"120\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">成品：初始化完成的 Bean</text>\n<text x=\"120\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">getBean 最终从这拿</text>\n<text x=\"120\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">正常无循环时只走这</text>\n<rect x=\"225\" y=\"48\" width=\"190\" height=\"110\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">二级 earlySingletonObjects</text>\n<text x=\"320\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">半成品：早期引用</text>\n<text x=\"320\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">从三级工厂产出后放入</text>\n<text x=\"320\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">给其他 Bean 注入用</text>\n<rect x=\"425\" y=\"48\" width=\"190\" height=\"110\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"520\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">三级 singletonFactories</text>\n<text x=\"520\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ObjectFactory lambda</text>\n<text x=\"520\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">getEarlyBeanReference()</text>\n<text x=\"520\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">★ 在此按需生成 AOP 代理</text>\n<rect x=\"25\" y=\"180\" width=\"590\" height=\"100\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">为什么不能只有两级缓存？</text>\n<text x=\"320\" y=\"226\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">AOP：Bean 最终暴露的是代理对象。若二级缓存直接存'未代理的裸对象'，</text>\n<text x=\"320\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">B 注入的 A 和容器最终的 A 不是同一对象 → 事务/AOP 全失效。</text>\n<text x=\"320\" y=\"266\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">三级工厂保证'早期引用'和'最终 Bean'一致（需要时代理、不需要时原样），且延迟生成。</text>\n</svg>",
    "caption": "图 6：三级缓存各存什么，以及为何不能省掉三级"
   },
   {
    "t": "h",
    "text": "一次完整的 A→B→A 解析流程"
   },
   {
    "t": "list",
    "items": [
     "创建 A：反射实例化 A 得到半成品 a0，把 `() -> getEarlyBeanReference(a0)` 放进三级缓存 singletonFactories",
     "A 填充属性，发现依赖 B → 递归创建 B",
     "创建 B：实例化 b0，放三级缓存，填充属性发现依赖 A",
     "B 从三级缓存取 A 的 ObjectFactory，调用 getEarlyBeanReference：若 A 需要 AOP 则生成代理，否则返回 a0；结果放入二级缓存 earlySingletonObjects，B 拿到 A 的引用完成填充与初始化，B 进一级缓存",
     "A 继续：拿到已完成的 B，填充属性，执行初始化（此时早前暴露的引用已经指向 a0/代理，最终完成后的 A 再进一级缓存并移除二级三级缓存项"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">A→B→A 循环依赖解析时序</text>\n<text x=\"60\" y=\"52\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">A</text>\n<text x=\"320\" y=\"52\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三级缓存区</text>\n<text x=\"580\" y=\"52\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv2)\" font-weight=\"bold\">B</text>\n<rect x=\"40\" y=\"64\" width=\"40\" height=\"24\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.2\"/>\n<rect x=\"300\" y=\"64\" width=\"40\" height=\"24\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.2\"/>\n<rect x=\"560\" y=\"64\" width=\"40\" height=\"24\" rx=\"4\" fill=\"var(--lv2)\" stroke=\"none\"/>\n<text x=\"64\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">实例化 a0</text>\n<text x=\"580\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"#fff\">创建中</text>\n<path d=\"M90 76 L290 76\" stroke=\"var(--line)\" stroke-width=\"1.5\" marker-end=\"url(#arD)\"/>\n<text x=\"190\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">a0 的工厂放入三级</text>\n<text x=\"64\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">填充需 B</text>\n<path d=\"M80 104 L300 104 L300 88\" stroke=\"var(--lv1)\" stroke-width=\"1.5\" fill=\"none\" marker-end=\"url(#arD)\"/>\n<text x=\"64\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">创建 B 实例化 b0</text>\n<path d=\"M300 130 L555 130 L555 88\" stroke=\"var(--lv2)\" stroke-width=\"1.5\" fill=\"none\"/>\n<text x=\"64\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B 填充需 A</text>\n<path d=\"M80 156 L300 156 L300 140 L555 140\" stroke=\"var(--lv3)\" stroke-width=\"1.5\" fill=\"none\"/>\n<text x=\"190\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">取三级工厂→getEarlyBeanReference（AOP代理）→入二级→注入给B</text>\n<text x=\"64\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B 完成入一级</text>\n<path d=\"M300 186 L70 186\" stroke=\"var(--lv1)\" stroke-width=\"1.5\" marker-end=\"url(#arD)\"/>\n<text x=\"64\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A 拿 B 继续</text>\n<path d=\"M80 210 L300 210 L300 194\" stroke=\"var(--line)\" stroke-width=\"1.5\" fill=\"none\"/>\n<text x=\"64\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A 初始化完成</text>\n<text x=\"190\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">A 入一级，清除二/三级项</text>\n<defs><marker id=\"arD\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n</svg>",
    "caption": "图 7：A 依赖 B、B 依赖 A 的三级缓存解析时序"
   },
   {
    "t": "h",
    "text": "SpringBoot 2.6+ 默认禁止循环依赖"
   },
   {
    "t": "p",
    "text": "从 SpringBoot 2.6 起，官方把 spring.main.allow-circular-references 默认改为 false，检测到循环依赖直接启动失败。原因：循环依赖本质是设计坏味道，掩盖职责划分问题，还让启动行为难以推理。官方希望借此逼开发者正视并消除它。线上真遇到可临时配置 spring.main.allow-circular-references=true，但根治理方式是重构：抽出第三方 Bean、改用事件驱动、或对一方加 @Lazy 注入延迟解析的代理。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Service\npublic class A {\n    private B b;\n    @Autowired\n    public void setB(B b) { this.b = b; }   // setter 注入：可解\n}\n\n@Service\npublic class B {\n    private A a;\n    @Autowired\n    public void setA(A a) { this.a = a; }   // 字段/setter 注入可解\n}\n\n// 构造器循环依赖：启动即抛 BeanCurrentlyInCreationException\n// @Service class C { C(D d) {} }  @Service class D { D(C c) {} }\n\n// 治本：抽出公共依赖，或 @Lazy 延迟\n@Service\npublic class E {\n    private final F f;\n    public E(@Lazy F f) { this.f = f; }  // 注入代理，真正使用时才解析\n}"
   },
   {
    "t": "pits",
    "items": [
     "说三级缓存能解决构造器循环依赖：不能，构造时就要完整依赖",
     "答'二级不够因为要存半成品'却不提 AOP 代理一致性：题眼没答到",
     "不提 SpringBoot 2.6+ 默认禁止：这个版本事实必被追问",
     "只背三级名字说不清每级触发时机：一级成品/二级半成品/三级工厂延迟生成"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三级缓存解决 单例+setter/字段注入 的循环依赖；三级是关键——ObjectFactory 延迟执行 getEarlyBeanReference，保证 AOP 代理的早期引用与最终 Bean 一致；构造器循环依赖无解，Boot 2.6+ 默认禁止循环依赖。下一篇：AOP 原理。"
   }
  ]
 },
 {
  "id": "spring-aop-principle",
  "title": "AOP 原理与动态代理",
  "layer": 1,
  "depends": [
   "spring-bean-lifecycle"
  ],
  "covers": [
   "spring-11",
   "spring-23"
  ],
  "quiz": [
   "spring-11",
   "spring-23"
  ],
  "body": [
   {
    "t": "lead",
    "text": "AOP（面向切面编程）通过动态代理在目标方法执行前后织入增强逻辑。理解'代理在 Bean 生命周期哪一步生成、JDK 与 CGLIB 怎么选、切点怎么写、哪些场景会失效'，就吃透了 Spring 一半的拦截体系。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Bean 生命周期第 6 步 postProcessAfterInitialization（见生命周期篇）",
     "知道事务/缓存/异步注解都靠 AOP 实现"
    ]
   },
   {
    "t": "h",
    "text": "AOP 原理：代理替换"
   },
   {
    "t": "p",
    "text": "核心机制：容器里最终存的是代理对象而非原始对象。代理器是 AnnotationAwareAspectJAutoProxyCreator（一个 BeanPostProcessor），在每个 Bean 初始化后（postProcessAfterInitialization）判断是否匹配切点（Pointcut）：匹配则用 JDK 动态代理或 CGLIB 生成代理替换原 Bean。外部调用方法时，先进代理 → 走增强逻辑（通知 Advice）→ 再调真实方法。这也是所有'自调用失效'问题的根源：目标对象内部 this 直调，根本不经过代理入口。"
   },
   {
    "t": "h",
    "text": "JDK 动态代理 vs CGLIB"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "JDK 动态代理",
     "CGLIB"
    ],
    "rows": [
     [
      "机制",
      "Proxy.newProxyInstance 生成接口实现类",
      "ASM 字节码生成目标类子类"
     ],
     [
      "要求",
      "目标必须实现接口",
      "无接口要求"
     ],
     [
      "不能代理",
      "非接口方法",
      "final 类/final 方法"
     ],
     [
      "生成速度",
      "快",
      "较慢（生成字节码）"
     ],
     [
      "调用速度",
      "稍慢（反射）",
      "快（FastClass 索引直接调）"
     ],
     [
      "Spring 选型",
      "Spring 5 经典规则：有接口用 JDK",
      "SpringBoot 2.x 起默认 proxyTargetClass=true 一律 CGLIB"
     ]
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">AOP 织入原理与代理选型</text>\n<rect x=\"25\" y=\"45\" width=\"285\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"167\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">JDK 动态代理</text>\n<rect x=\"45\" y=\"80\" width=\"100\" height=\"42\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">接口</text>\n<text x=\"95\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">InvocationHandler</text>\n<rect x=\"185\" y=\"80\" width=\"105\" height=\"42\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"237\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">目标实现类</text>\n<text x=\"237\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">必须是接口实现</text>\n<text x=\"167\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Proxy + InvocationHandler</text>\n<text x=\"167\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">只能代理接口方法</text>\n<rect x=\"330\" y=\"45\" width=\"285\" height=\"150\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"472\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">CGLIB（Boot2.x 默认）</text>\n<rect x=\"350\" y=\"80\" width=\"110\" height=\"42\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"405\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">目标类</text>\n<text x=\"405\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">生成子类复写方法</text>\n<rect x=\"485\" y=\"80\" width=\"110\" height=\"42\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"540\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">MethodInterceptor</text>\n<text x=\"540\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">FastClass 直接调</text>\n<text x=\"472\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无需接口</text>\n<text x=\"472\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">final 类/方法不可代理</text>\n<rect x=\"25\" y=\"215\" width=\"590\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">原理：BeanPostProcessor（AnnotationAwareAspectJAutoProxyCreator）</text>\n<text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Bean 初始化后判断是否匹配切点 → 匹配则生成代理替换原 Bean 放入容器</text>\n</svg>",
    "caption": "图 8：AOP 织入时机与 JDK/CGLIB 选型"
   },
   {
    "t": "h",
    "text": "切点表达式与通知类型"
   },
   {
    "t": "p",
    "text": "切点（Pointcut）用 AspectJ 表达式描述'切哪些方法'，常见写法：execution(public * com.game.player.service.*.*(..)) 表示匹配该包下所有类的所有 public 方法；within、@annotation（按注解切）也常用——游戏服做操作日志就常用 @annotation(com.game.gm.Log) 只切打了 @Log 的方法。通知（Advice）五种：@Before 前置、@AfterReturning 返回后、@AfterThrowing 异常后、@After 最终（finally）、@Around 环绕（最强，可控制入参/返回值/异常，性能最好也最危险）。切面（@Aspect）是'切点+通知'的容器，@Order 控制多个切面执行顺序。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Aspect\n@Component\npublic class OperLogAspect {\n    // 切点：只切打了 @OperLog 注解的方法（GM 后台操作审计）\n    @Pointcut(\"@annotation(com.game.gm.annotation.OperLog)\")\n    public void logPointcut() {}\n\n    @Around(\"logPointcut()\")\n    public Object around(ProceedingJoinPoint pjp) throws Throwable {\n        long start = System.currentTimeMillis();\n        try {\n            Object result = pjp.proceed();           // 执行目标方法\n            return result;\n        } catch (Exception e) {\n            // 记录操作人、请求参数、异常堆栈到 sys_oper_log\n            saveLog(pjp, e);\n            throw e;                                  // 异常继续抛，别吞\n        } finally {\n            long cost = System.currentTimeMillis() - start;\n            if (cost > 200) log.warn(\"慢操作 GM: {} cost={}ms\", pjp.getSignature(), cost);\n        }\n    }\n}"
   },
   {
    "t": "h",
    "text": "AOP 失效场景与热路径取舍"
   },
   {
    "t": "p",
    "text": "失效四大来源：自调用（this 调 this 不走代理）、非 public 方法（CGLIB 子类复写限制，private/protected 不增强）、final 方法、以及对象是手动 new 而非容器管理。游戏服实战提醒：代理调用有反射开销，GM 后台和低频业务随便用；但 Netty/Disruptor 热路径（每帧/高频协议处理）别滥用 AOP——切面越多代理链越长，在 Disruptor 消费链路里要控制切面数量。RuoYi 的 @DataScope 数据权限、@PreAuthorize 权限、@Log 日志全是 AOP 实现，Controller 没有接口也能生效，正是 Boot2.x 默认 CGLIB 的功劳。"
   },
   {
    "t": "pits",
    "items": [
     "还说'有接口 JDK 无接口 CGLIB'是当前结论：Boot2.x 起默认 proxyTargetClass=true 一律 CGLIB",
     "漏掉自调用失效：事务/缓存/异步共有的坑，必考",
     "把 Filter/Interceptor 说成 AOP：Filter 是 Servlet 容器层、Interceptor 是 MVC 层、AOP 是方法级代理，三层归属不同",
     "切点表达式写错 execution 基本结构：修饰符 返回值 包.类.方法(参数)"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：AOP = 动态代理织入，代理在 Bean 初始化后由 BeanPostProcessor 生成；Boot2.x 默认 CGLIB；五种通知里 @Around 最常用；自调用/final/非 public 都是失效雷区。下一篇：Spring 事务管理，本质就是 AOP 的应用。"
   }
  ]
 },
 {
  "id": "spring-tx-management",
  "title": "Spring 事务管理",
  "layer": 1,
  "depends": [
   "spring-aop-principle"
  ],
  "covers": [
   "spring-06",
   "spring-12",
   "spring-13"
  ],
  "quiz": [
   "spring-06",
   "spring-12",
   "spring-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Spring 事务管理的本质就是 AOP：@Transactional 靠代理在方法前后开启/提交/回滚事务。传播行为决定事务怎么嵌套，回滚规则决定什么异常触发回滚，失效场景全都能从'代理'两个字推导出来。"
   },
   {
    "t": "pre",
    "items": [
     "理解 AOP 代理原理（见 AOP 篇）",
     "懂 SQL 的事务概念：commit/rollback、脏读/不可重复读/幻读",
     "用过 @Transactional 注解"
    ]
   },
   {
    "t": "h",
    "text": "编程式 vs 声明式"
   },
   {
    "t": "p",
    "text": "编程式：直接注入 PlatformTransactionManager（SpringBoot 下自动配置 DataSourceTransactionManager），手动 begin/commit/rollback，控制粒度最细但代码侵入。声明式：@Transactional 注解，靠 AOP 代理自动管理，是主流做法。事务管理器按持久层自动适配：JDBC/MyBatis 用 DataSourceTransactionManager，JPA 用 JpaTransactionManager，JTA 处理分布式。"
   },
   {
    "t": "h",
    "text": "@Transactional 核心属性"
   },
   {
    "t": "table",
    "head": [
     "属性",
     "说明",
     "默认值"
    ],
    "rows": [
     [
      "propagation",
      "传播行为，7 种",
      "REQUIRED"
     ],
     [
      "isolation",
      "隔离级别",
      "DEFAULT（随数据库）"
     ],
     [
      "rollbackFor",
      "指定哪些异常回滚",
      "仅 RuntimeException/Error"
     ],
     [
      "noRollbackFor",
      "指定哪些异常不回滚",
      "无"
     ],
     [
      "readOnly",
      "只读提示（路由只读库等）",
      "false"
     ],
     [
      "timeout",
      "超时秒数",
      "-1 无限制"
     ]
    ]
   },
   {
    "t": "p",
    "text": "最关键的默认回滚规则：只对 RuntimeException 和 Error 回滚，checked 异常（如 IOException）默认不回滚。设计初衷是 checked 异常代表'可预期的业务情况，调用方应处理'，但实践中极易踩坑。业界共识：业务统一抛 RuntimeException 或显式 @Transactional(rollbackFor = Exception.class)。readOnly=true 是提示不是强制——部分中间件据此路由到只读库，但不会真正禁止写。timeout 超时也不是精确的立即中断，是提示性约束，别依赖它做精确限时。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">事务传播行为（7 种）与回滚规则</text>\n<rect x=\"25\" y=\"45\" width=\"190\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">REQUIRED 拼车</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">有事务就加入，无则新建</text>\n<text x=\"120\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同生共死，一起回滚</text>\n<text x=\"120\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">默认值，95% 场景</text>\n<rect x=\"225\" y=\"45\" width=\"190\" height=\"120\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">REQUIRES_NEW 换车</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">挂起外层，新建独立事务</text>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">各自提交/回滚</text>\n<text x=\"320\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">日志/通知用，多占连接</text>\n<rect x=\"425\" y=\"45\" width=\"190\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">NESTED 里程碑</text>\n<text x=\"520\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JDBC Savepoint 保存点</text>\n<text x=\"520\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">内层回滚只回退到保存点</text>\n<text x=\"520\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">外层回滚则一起滚</text>\n<rect x=\"25\" y=\"180\" width=\"590\" height=\"55\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">默认回滚规则：只认 RuntimeException / Error</text>\n<text x=\"320\" y=\"223\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">checked 异常（IOException）默认不回滚 → 必须 rollbackFor=Exception.class 或抛 RuntimeException</text>\n</svg>",
    "caption": "图 9：三种主流传播行为与默认回滚规则"
   },
   {
    "t": "h",
    "text": "7 种传播行为"
   },
   {
    "t": "p",
    "text": "Spring 定义 7 种传播行为：REQUIRED（默认，有则加入无则新建）、SUPPORTS（有则加入无则非事务执行）、MANDATORY（必须有事务否则抛异常）、REQUIRES_NEW（挂起外层新开独立事务）、NOT_SUPPORTED（挂起事务非事务执行）、NEVER（禁止事务否则抛异常）、NESTED（嵌套事务，依赖 JDBC Savepoint）。生产 95% 只用前三种 + NESTED。注意 REQUIRES_NEW 的一个隐藏细节：内层回滚抛出的异常会被外层感知，外层若不 catch 就一起回滚——'各自回滚'指的是内层已独立回滚，但异常传播仍可能波及外层。REQUIRES_NEW 挂起外层时内层从连接池另取连接，嵌套越深占用越多，高并发下容易打满连接池。"
   },
   {
    "t": "h",
    "text": "失效场景（面试必考 5 种+）"
   },
   {
    "t": "p",
    "text": "一切失效都源于'绕过代理或代理不生效'：①自调用 this.method() 直接调不经过代理——最常见，解法：注入自身 Bean、AopContext.currentProxy()（需 @EnableAspectJAutoProxy(exposeProxy=true)）、拆到不同 Bean；②非 public 方法，CGLIB 子类复写不了 private/protected；③异常被 catch 吞掉没再抛——事务感知不到，解法 catch 里 rethrow 或 setRollbackOnly()；④异常类型不匹配，checked 异常默认不回滚；⑤多线程：@Transactional 方法里 new Thread/CompletableFuture 操作数据库，子线程不在事务上下文（事务绑 ThreadLocal/连接）——游戏服经典坑：Netty/Disruptor 异步线程里落库，事务注解加在上游是无效的，只能把事务划在消费线程内的最终落库方法上；⑥数据库引擎 MyISAM 不支持事务须 InnoDB；⑦传播级别用错 NOT_SUPPORTED/SUPPORTS 无事务。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Service\npublic class RechargeService {\n    private final OrderMapper orderMapper;\n    private final AssetService assetService;\n    private final RechargeLogService logService;\n\n    // 核心链路：必须一个事务（REQUIRED）\n    @Transactional(rollbackFor = Exception.class)\n    public void onRechargeCallback(RechargeCallbackReq req) {\n        // 幂等第一层：状态机 + 影响行数\n        int rows = orderMapper.updateStatus(req.getOrderNo(),\n            OrderStatus.PENDING, OrderStatus.SUCCESS);\n        if (rows == 0) {\n            return; // 重复回调，已处理，直接返回\n        }\n        assetService.addGold(req.getPlayerId(), req.getGold()); // 资产变更\n        // 日志必须独立事务：日志失败不影响发货\n        logService.saveAsync(req); // REQUIRES_NEW 或事件异步\n    }\n}\n\n// 自调用失效演示与正确写法\n// this.saveOrder(); // 失效：不走代理\n// 解法：注入自身 Bean，或拆到另一个 Bean 再调\n@Autowired\nprivate RechargeService self;\n\n@Transactional\npublic void createOrder() {\n    // 生成订单 + 扣库存 + 发道具\n    self.saveOrder(); // 通过代理调用，事务生效\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">事务失效五大来源（全部可归因于绕过代理）</text>\n<rect x=\"25\" y=\"45\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">自调用</text>\n<text x=\"117\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">this 直调不经过代理</text>\n<text x=\"117\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">最常见</text>\n<rect x=\"228\" y=\"45\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">非 public / final</text>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CGLIB 无法增强</text>\n<text x=\"320\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">private/protected</text>\n<rect x=\"431\" y=\"45\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"523\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">catch 吞异常</text>\n<text x=\"523\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">事务感知不到异常</text>\n<text x=\"523\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">rethrow 或 setRollbackOnly</text>\n<rect x=\"25\" y=\"130\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">异常类型不匹配</text>\n<text x=\"117\" y=\"173\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">checked 默认不回滚</text>\n<text x=\"117\" y=\"191\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">rollbackFor 点名</text>\n<rect x=\"228\" y=\"130\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">多线程/异步线程</text>\n<text x=\"320\" y=\"173\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">事务绑 ThreadLocal/连接</text>\n<text x=\"320\" y=\"191\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">游戏服 Disruptor 高频坑</text>\n<rect x=\"431\" y=\"130\" width=\"185\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"523\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">引擎/传播用错</text>\n<text x=\"523\" y=\"173\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MyISAM 无事务</text>\n<text x=\"523\" y=\"191\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">NOT_SUPPORTED 等</text>\n<rect x=\"25\" y=\"218\" width=\"590\" height=\"30\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"none\"/>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">口诀：自调私法 吞异常，错异常 跨线程，引擎不对 传播乱</text>\n</svg>",
    "caption": "图 10：事务失效五大来源与记忆口诀"
   },
   {
    "t": "pits",
    "items": [
     "只说默认只回滚 RuntimeException，忘了 Error 也算",
     "说 readOnly 能真正禁止写操作：它只是提示，不是权限",
     "把 REQUIRES_NEW 说成'内层回滚不影响外层'：内层回滚的异常仍会传播给外层",
     "游戏服异步线程里指望上游的事务注解生效：事务跨线程必失效，边界要划在消费线程落库方法上"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：事务 = AOP 代理；默认只回滚 RuntimeException/Error；传播行为 7 种常用 REQUIRED/REQUIRES_NEW/NESTED；失效全源于绕过代理——自调用、非 public、吞异常、checked、跨线程、引擎、传播用错。下一篇：Bean 装配与条件化，理解 @Configuration/@Conditional 怎么决定'装什么'。"
   }
  ]
 },
 {
  "id": "spring-bean-assembly-conditional",
  "title": "Bean 装配与条件化",
  "layer": 2,
  "depends": [
   "spring-di-detail"
  ],
  "covers": [
   "spring-16",
   "spring-22"
  ],
  "quiz": [
   "spring-16",
   "spring-22"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从 @Configuration/@Bean 手工装配，到 @Conditional 条件装配，再到 @EnableXXX 模块化——这一篇把'Spring 到底怎么决定注册哪些 Bean'讲透，是理解自动配置（下一篇）的前置。"
   },
   {
    "t": "pre",
    "items": [
     "理解 DI 与 Bean 定义（IOC/DI 篇）",
     "理解 @Autowired/@Component 注解"
    ]
   },
   {
    "t": "h",
    "text": "@Configuration 与 @Bean"
   },
   {
    "t": "p",
    "text": "@Configuration 标记配置类，内部 @Bean 方法把返回值注册为 Bean，方法名是 Bean 名。@Configuration 默认 proxyBeanMethods = true（Spring 5.2+ 新增属性），即配置类本身被 CGLIB 代理：配置类里 @Bean 方法互相调用时，会从容器取单例而非重新执行方法，保证单例一致。若改为 proxyBeanMethods = false（Lite 模式），配置类不被代理，方法间调用每次执行方法体——SpringBoot 自己的自动配置类大多用 false 提升启动速度，代价是不能再通过方法调用做 Bean 间依赖。这是 spring-16 深水区的考点，面试官会追问这个开关。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Configuration // proxyBeanMethods 默认 true：Full 模式，CGLIB 代理\npublic class NettyConfig {\n\n    @Bean\n    public EventLoopGroup bossGroup() { return new NioEventLoopGroup(1); }\n\n    @Bean\n    public EventLoopGroup workerGroup() { return new NioEventLoopGroup(8); }\n\n    // Full 模式下此方法从容器取 workerGroup() 的单例，不会重复 new\n    @Bean\n    public ServerBootstrap serverBootstrap() {\n        return new ServerBootstrap()\n            .group(bossGroup(), workerGroup());\n    }\n}\n\n// Lite 模式：配置类不被代理，方法间调用会重复执行\n@Configuration(proxyBeanMethods = false)\npublic class RedisConfig {\n    @Bean\n    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory cf) {\n        return new StringRedisTemplate(cf); // 依赖用参数传入，不靠方法调用\n    }\n}"
   },
   {
    "t": "h",
    "text": "@Conditional 家族：按需装配"
   },
   {
    "t": "p",
    "text": "@Conditional 是'满足条件才注册 Bean/配置'的总开关，是自动装配的半壁江山。记忆法'四看'：看类——@ConditionalOnClass/@ConditionalOnMissingClass（类路径有/无某类，典型：引入了 kafka-clients 才装配 KafkaTemplate）；看 Bean——@ConditionalOnBean/@ConditionalOnMissingBean（容器有/无某 Bean，覆盖默认实现的标准姿势）；看配置——@ConditionalOnProperty（如 game.hotfix.enabled=true 才装配热更新监听）、@ConditionalOnExpression（SpEL 组合）；看环境——@ConditionalOnWebApplication/@ConditionalOnJava/@ConditionalOnResource 等。自定义条件：实现 Condition 接口的 matches(ConditionContext, AnnotatedTypeMetadata)，可组合成元注解，比如 @ConditionalOnServerType(\"battle\") 只在战斗服装配战斗模块。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">@Conditional 家族'四看'分类</text>\n<rect x=\"25\" y=\"45\" width=\"185\" height=\"95\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">看类 OnClass</text>\n<text x=\"117\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">类路径是否存在某类</text>\n<text x=\"117\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@ConditionalOnClass</text>\n<text x=\"117\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">引入依赖才装配</text>\n<rect x=\"228\" y=\"45\" width=\"185\" height=\"95\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">看 Bean OnBean</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">容器是否存在某 Bean</text>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@ConditionalOnMissingBean</text>\n<text x=\"320\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">用户自定义优先</text>\n<rect x=\"431\" y=\"45\" width=\"185\" height=\"95\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"523\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">看配置 OnProperty</text>\n<text x=\"523\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">配置项开关</text>\n<text x=\"523\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@ConditionalOnProperty</text>\n<text x=\"523\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@ConditionalOnExpression</text>\n<rect x=\"25\" y=\"158\" width=\"185\" height=\"75\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"117\" y=\"181\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">看环境</text>\n<text x=\"117\" y=\"203\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OnWeb/OnJava/OnResource</text>\n<text x=\"117\" y=\"221\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">区分 Servlet/Reactive</text>\n<rect x=\"228\" y=\"158\" width=\"185\" height=\"75\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"181\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">自定义 Condition</text>\n<text x=\"320\" y=\"203\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">matches() 编程判断</text>\n<text x=\"320\" y=\"221\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">@ConditionalOnServerType(\"battle\")</text>\n<rect x=\"431\" y=\"158\" width=\"185\" height=\"75\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"523\" y=\"181\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">★ 评估顺序坑</text>\n<text x=\"523\" y=\"203\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OnMissingBean 只能看到</text>\n<text x=\"523\" y=\"221\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">已解析的定义 → @AutoConfigureAfter</text>\n</svg>",
    "caption": "图 11：@Conditional 家族分类与评估顺序坑"
   },
   {
    "t": "h",
    "text": "@Profile 环境装配"
   },
   {
    "t": "p",
    "text": "@Profile 是条件装配的'环境版'：按激活的 profile 决定是否装配，常配合 application-{profile}.yml。游戏服多角色部署（登录服/游戏服/购买服同代码库）可用 @Profile(\"battle\") 只装战斗模块、@Profile(\"login\") 只装登录模块。底层是 ProfileCondition（也是一种 Condition）。比自定义 Condition 简单，适合纯环境维度；复杂条件（服务器角色从启动参数读）就用自定义 Condition。"
   },
   {
    "t": "h",
    "text": "@Import 与 @EnableXXX 模块化"
   },
   {
    "t": "p",
    "text": "@Import 可以把普通类/配置类/ImportSelector/ImportBeanDefinitionRegistrar 引入容器，是模块化注册的正门。@EnableXXX 是它最著名的用法：@EnableAutoConfiguration、@EnableAsync、@EnableScheduling、@EnableTransactionManagement 本质上都是'通过 @Import 引入一个启动装配类/选择器'。比如 @EnableAsync 内部 @Import(AsyncConfigurationSelector.class)，selector 决定装配哪套异步执行器。游戏服做'协议分发模块'也可以定义 @EnableGameProtocol 注解，内部 @Import(GameProtocolRegistrar.class) 注册协议扫描与路由表装配。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Target(ElementType.TYPE)\n@Retention(RetentionPolicy.RUNTIME)\n@Import(GameProtocolRegistrar.class) // 核心：引入注册器\npublic @interface EnableGameProtocol {\n    String[] scanPackages() default {};\n}\n\npublic class GameProtocolRegistrar implements ImportBeanDefinitionRegistrar {\n    @Override\n    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata,\n                                        BeanDefinitionRegistry registry,\n                                        BeanNameGenerator generator) {\n        // 扫描 scanPackages 下带 @GameProtocol 注解的类\n        // 为每个 Handler 注册 BeanDefinition，并构建 opcode -> Handler 路由表\n        // 业务方只需在启动类上 @EnableGameProtocol(scanPackages=\"com.game.handler\")\n    }\n}"
   },
   {
    "t": "h",
    "text": "Bean 初始化顺序的正确打开方式"
   },
   {
    "t": "p",
    "text": "顺序依赖相关考点（spring-22）：构造器注入显式依赖最可靠——Router 构造器要 List<GameHandler>，Spring 拓扑排序自然保证所有 Handler 先就绪；SmartInitializingSingleton.afterSingletonsInstantiated() 在所有单例实例化完成后回调一次，适合建路由表；ApplicationRunner/CommandLineRunner 在 refresh 完成后执行，适合开端口、预热。注意 @Order 只对集合注入、拦截器链、Runner 等特定场景生效，并不控制 Bean 实例化顺序——面试高频误区。游戏服'先建路由表再 bind 端口'的标准姿势：Router 用 SmartInitializingSingleton 建表，Netty Server 用 ApplicationRunner（@Order 最后）bind。"
   },
   {
    "t": "pits",
    "items": [
     "说 @ConditionalOnBean 无顺序问题：它只能看到评估时已解析的定义，要用 @AutoConfigureAfter 控制顺序",
     "把 @Profile 和 @Conditional 说成独立两套：@Profile 底层就是 Condition，只是按环境维度",
     "声称 @Order 能控制 Bean 实例化顺序：它只管集合注入/Runner/拦截器等场景",
     "@Configuration 的 proxyBeanMethods 说不清：true 是 CGLIB 代理 Full 模式，false 是 Lite 模式"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：@Configuration/@Bean 手工装配，@Conditional 系列按类/Bean/配置/环境四看条件装配，@Profile 管环境，@Import 实现 @EnableXXX 模块化；初始化顺序用构造注入/SmartInitializingSingleton/Runner。下一篇：SpringBoot 自动配置原理，把条件化思想应用到 starter 机制。"
   }
  ]
 },
 {
  "id": "springboot-autoconfig",
  "title": "SpringBoot 自动配置原理",
  "layer": 2,
  "depends": [
   "spring-bean-assembly-conditional"
  ],
  "covers": [
   "spring-14",
   "spring-15"
  ],
  "quiz": [
   "spring-14",
   "spring-15"
  ],
  "body": [
   {
    "t": "lead",
    "text": "自动配置 = 条件注解 + 配置类清单加载：启动时读取 AutoConfiguration.imports 清单，经 @Conditional 过滤，按需批量注册 Bean。一句答题模板：@EnableAutoConfiguration 触发 ImportSelector，读清单，@Conditional 过滤，装配。"
   },
   {
    "t": "pre",
    "items": [
     "理解 @Conditional 家族与 @Import（见装配篇）",
     "理解 starter 依赖的本质是引入类 + 自动配置类"
    ]
   },
   {
    "t": "h",
    "text": "@SpringBootApplication 三合一套壳"
   },
   {
    "t": "p",
    "text": "@SpringBootApplication 由三个注解组合：@SpringBootConfiguration（本质是 @Configuration，标记这是配置类）、@EnableAutoConfiguration（自动配置总开关）、@ComponentScan（扫描主类同包及子包）。所以主类所在包位置很重要——约定大于配置，默认只扫同包及子包，想扫别的包用 scanBasePackages 显式指定。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">@SpringBootApplication 三合一套壳</text>\n<rect x=\"180\" y=\"45\" width=\"280\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">@SpringBootApplication</text>\n<text x=\"320\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">主类上的组合注解</text>\n<rect x=\"20\" y=\"130\" width=\"190\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">@SpringBootConfiguration</text>\n<text x=\"115\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">就是 @Configuration</text>\n<text x=\"115\" y=\"195\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">主类本身是配置类</text>\n<rect x=\"225\" y=\"130\" width=\"190\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">@EnableAutoConfiguration</text>\n<text x=\"320\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">自动装配总开关</text>\n<text x=\"320\" y=\"195\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">★ 内部 @Import(Selector)</text>\n<rect x=\"430\" y=\"130\" width=\"190\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"525\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">@ComponentScan</text>\n<text x=\"525\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">扫描主类同包及子包</text>\n<text x=\"525\" y=\"195\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">scanBasePackages 可指定</text>\n<path d=\"M215 160 L320 160 L320 135 L430 135 L430 160\" stroke=\"var(--line)\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"5 4\"/>\n</svg>",
    "caption": "图 12：@SpringBootApplication 三合一注解拆解"
   },
   {
    "t": "h",
    "text": "自动装配流程"
   },
   {
    "t": "list",
    "items": [
     "@EnableAutoConfiguration 内部 @Import(AutoConfigurationImportSelector.class)",
     "selectImports() 读取配置类清单：Boot 2.x 读 META-INF/spring.factories 中 EnableAutoConfiguration 为 key 的类列表；Boot 3.x 改读 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports 文件（每行一个类名，spring.factories 方式废弃）",
     "清单先经 AutoConfigurationImportFilter 和 @Conditional 系列过滤：@ConditionalOnClass 类路径有该类才生效、@ConditionalOnMissingBean 容器没有才装配、@ConditionalOnProperty 配置满足才装配，只留满足条件的配置类",
     "过滤后的 @Configuration 类按普通配置解析，@Bean 方法注册 Bean（如 DataSourceAutoConfiguration 装配 DataSource）",
     "顺序控制：@AutoConfigureAfter/@AutoConfigureBefore、@AutoConfigureOrder"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">自动装配流程（Boot 3.x imports 文件）</text>\n<rect x=\"25\" y=\"48\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"85\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">启动</text>\n<text x=\"85\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@EnableAutoConfiguration</text>\n<rect x=\"180\" y=\"48\" width=\"150\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ImportSelector</text>\n<text x=\"255\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读 imports 清单</text>\n<rect x=\"365\" y=\"48\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"425\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">@Conditional 过滤</text>\n<text x=\"425\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OnClass/OnMissingBean</text>\n<rect x=\"520\" y=\"48\" width=\"110\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"575\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">装配 Bean</text>\n<text x=\"575\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DataSource 等</text>\n<path d=\"M145 76 L180 76\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arE)\"/>\n<path d=\"M330 76 L365 76\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arE)\"/>\n<path d=\"M485 76 L520 76\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arE)\"/>\n<defs><marker id=\"arE\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<rect x=\"25\" y=\"130\" width=\"590\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Boot2.x 读 spring.factories 的 EnableAutoConfiguration key → Boot3.x 读 imports 文件</text>\n<text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">imports 每行一个类名，无 properties 解析，对 AOT 编译期友好、加载更快</text>\n<rect x=\"25\" y=\"200\" width=\"590\" height=\"82\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"223\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">用户 Bean 优先（@ConditionalOnMissingBean）</text>\n<text x=\"320\" y=\"245\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">自动配置的 @Bean 大多带 OnMissingBean：用户已定义同类型 Bean 时自动装配让位</text>\n<text x=\"320\" y=\"266\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">这就是覆盖默认实现（如自定义 RedisTemplate、自定义 ObjectMapper）的标准姿势</text>\n</svg>",
    "caption": "图 13：自动装配清单加载与条件过滤链路"
   },
   {
    "t": "h",
    "text": "自定义 starter 实战"
   },
   {
    "t": "p",
    "text": "starter = 依赖聚合模块（xxx-spring-boot-starter）+ 自动配置模块（xxx-spring-boot-autoconfigure），核心三板斧：Properties 属性类（@ConfigurationProperties(prefix=\"game.protocol\") 暴露可配置项）、AutoConfiguration 配置类（@AutoConfiguration + @ConditionalOnClass + @EnableConfigurationProperties，@Bean 方法带 @ConditionalOnMissingBean 允许覆盖）、imports 清单注册（Boot3 在 META-INF/spring/...AutoConfiguration.imports 写全限定类名）。使用者引一个 starter 依赖 + yml 配属性即用。把游戏服的协议分发模块做成 starter：提供 @GameProtocol(opcode) 注解 + 启动扫描注册路由表 + 装配 Netty Server/Disruptor/Handler 路由器，全部 @ConditionalOnMissingBean 允许业务方替换，再提供 ProtocolHandlerFactory SPI 扩展点——这就是'工具沉淀'思维。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 属性类：暴露可配置项\n@ConfigurationProperties(prefix = \"game.protocol\")\npublic class ProtocolProperties {\n    private int nettyPort = 8888;        // 默认端口\n    private int businessThreads = 4;     // Disruptor 消费线程数\n    private String scanPackages = \"\";   // 协议 Handler 扫描包\n}\n\n// 自动配置类\n@AutoConfiguration\n@ConditionalOnClass(Dispatcher.class)      // 类路径有协议分发类才装配\n@EnableConfigurationProperties(ProtocolProperties.class)\npublic class ProtocolAutoConfiguration {\n\n    @Bean\n    @ConditionalOnMissingBean(Dispatcher.class) // 用户自定义 Dispatcher 则让位\n    public Dispatcher dispatcher(ProtocolProperties props,\n                                 Map<String, GameHandler> handlerMap) {\n        return new Dispatcher(props.getNettyPort(), handlerMap);\n    }\n}\n\n// Boot3 注册清单：META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports\n// 文件内容一行：com.game.protocol.ProtocolAutoConfiguration"
   },
   {
    "t": "h",
    "text": "装配失败怎么排查"
   },
   {
    "t": "p",
    "text": "启动加 --debug 会输出 ConditionEvaluationReport，列出每个自动配置类'匹配/不匹配'及原因；线上可开 /actuator/conditions 端点查看。逐项核对条件（类在不在 classpath、Bean 有没有、配置项开没开）就能定位'为什么我的 Bean 没装上'。配 @ConditionalOnMissingBean 时注意评估顺序：条件判断发生在配置解析期，若用户自定义 Bean 的配置类尚未解析会误判，需要 @AutoConfigureAfter 控制顺序。"
   },
   {
    "t": "pits",
    "items": [
     "不提 Boot3 的 imports 文件：2.x 的 spring.factories 说法已过时，面试要主动讲版本差异",
     "说 starter 只是依赖聚合：核心是自动配置类 + 清单 + 属性绑定",
     "把 @EnableAutoConfiguration 说成 @SpringBootApplication 的全部：它只是三件套之一",
     "条件判断不看评估顺序：@ConditionalOnMissingBean 误判是 starter 开发经典坑"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：自动配置 = ImportSelector 读 imports 清单 + @Conditional 过滤 + 按需装配；Boot3 改 imports 文件、要求 JDK17；自定义 starter 三板斧（Properties + AutoConfiguration + 清单），全带 @Conditional 保证用户可覆盖。下一篇：SpringMVC 请求链路。"
   }
  ]
 },
 {
  "id": "springmvc-request-chain",
  "title": "SpringMVC 请求链路",
  "layer": 2,
  "depends": [
   "spring-core-ioc",
   "spring-aop-principle"
  ],
  "covers": [
   "spring-04",
   "spring-23",
   "spring-30"
  ],
  "quiz": [
   "spring-04",
   "spring-23",
   "spring-30"
  ],
  "body": [
   {
    "t": "lead",
    "text": "SpringMVC 一次请求的完整链路 = DispatcherServlet 总调度：找 Handler（HandlerMapping）→ 调适配器执行（HandlerAdapter）→ 异常统一走 HandlerExceptionResolver。GM 后台（RuoYi）每个接口请求都在走这条流水线。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Filter/Interceptor/AOP 的分层（见 AOP 篇）",
     "写过 REST Controller，知道 @GetMapping/@PostMapping",
     "了解 RuoYi 后台的登录态校验与统一返回"
    ]
   },
   {
    "t": "h",
    "text": "DispatcherServlet 主流程"
   },
   {
    "t": "list",
    "items": [
     "请求进入 DispatcherServlet（前端控制器，doDispatch 方法）",
     "HandlerMapping（如 RequestMappingHandlerMapping）根据 URL + 请求方法找到 HandlerMethod（Controller 方法），返回 HandlerExecutionChain（含拦截器链）",
     "拦截器 preHandle 逐个执行，任一返回 false 即中断请求",
     "HandlerAdapter（RequestMappingHandlerAdapter）执行：HandlerMethodArgumentResolver 解析参数（@RequestBody/@RequestParam/路径变量）→ 反射调用 Controller 方法 → HandlerMethodReturnValueHandler 用 HttpMessageConverter（Jackson）把返回值转 JSON 写回",
     "拦截器 postHandle（视图渲染前）→ afterCompletion（无论成败都执行，类似 finally）",
     "异常统一走 HandlerExceptionResolver（@ControllerAdvice/@RestControllerAdvice）"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">DispatcherServlet 一次请求主流程</text>\n<rect x=\"25\" y=\"45\" width=\"140\" height=\"46\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"95\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">请求进入</text>\n<text x=\"95\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DispatcherServlet</text>\n<rect x=\"185\" y=\"45\" width=\"140\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">HandlerMapping</text>\n<text x=\"255\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">URL 找 HandlerMethod</text>\n<rect x=\"345\" y=\"45\" width=\"140\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"415\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">拦截器 preHandle</text>\n<text x=\"415\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">false 即中断</text>\n<rect x=\"505\" y=\"45\" width=\"120\" height=\"46\" rx=\"7\" fill=\"var(--lv2)\" stroke=\"none\"/>\n<text x=\"565\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"#fff\">HandlerAdapter</text>\n<text x=\"565\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"#fff\">执行 + 参数解析</text>\n<path d=\"M165 68 L185 68\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arF)\"/>\n<path d=\"M325 68 L345 68\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arF)\"/>\n<path d=\"M485 68 L505 68\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arF)\"/>\n<defs><marker id=\"arF\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<rect x=\"25\" y=\"115\" width=\"600\" height=\"70\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Controller 方法执行（参数解析 → 调用 → 返回值处理）</text>\n<text x=\"325\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ArgumentResolver：@RequestBody(Jackson 反序列化) / @RequestParam / @PathVariable</text>\n<text x=\"325\" y=\"178\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ReturnValueHandler：Jackson 序列化写回；方法上的 @PreAuthorize 是 AOP 代理在调用时生效</text>\n<rect x=\"25\" y=\"205\" width=\"290\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"228\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">postHandle / afterCompletion</text>\n<text x=\"170\" y=\"247\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">afterCompletion 类似 finally，成败都执行</text>\n<rect x=\"335\" y=\"205\" width=\"290\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"480\" y=\"228\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">异常 → HandlerExceptionResolver</text>\n<text x=\"480\" y=\"247\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@RestControllerAdvice 统一包装 AjaxResult</text>\n<rect x=\"25\" y=\"275\" width=\"600\" height=\"42\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"325\" y=\"293\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">RuoYi 映射：JWT/登录拦截器在 preHandle 验 Token，@PreAuthorize 是 AOP 授权，异常统一 @RestControllerAdvice</text>\n<text x=\"325\" y=\"310\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">拦截器在前（认证）→ AOP 权限在后（授权），层次清晰</text>\n</svg>",
    "caption": "图 14：DispatcherServlet 请求主流程与 RuoYi 映射"
   },
   {
    "t": "h",
    "text": "HandlerMapping 与 HandlerAdapter 为什么分开"
   },
   {
    "t": "p",
    "text": "职责分离 + 开闭原则：Mapping 只负责'找'，Adapter 只负责'调'。新增一种 Handler 类型只需加对应的 Adapter，不用动 Mapping，两者可独立扩展。Spring 内置多种 Mapping（RequestMappingHandlerMapping、SimpleUrlHandlerMapping 等）和多种 Adapter，各自匹配不同风格的 Handler。这是理解 MVC 扩展性的关键。"
   },
   {
    "t": "h",
    "text": "参数绑定与类型转换"
   },
   {
    "t": "p",
    "text": "参数解析由 HandlerMethodArgumentResolver 链完成：@RequestBody 用 HttpMessageConverter（Jackson）把 JSON 反序列化成 DTO（配合 JSR-303 @Valid 校验，失败抛 MethodArgumentNotValidException）；@RequestParam/@PathVariable 走 String 到目标类型的转换器（WebConversionService）。游戏服 GM 后台的典型组合：DTO + @Validated 分组校验 + @RestControllerAdvice 统一包装错误。注意：@Valid 与 @Validated 的区别——@Valid 是 JSR 标准支持嵌套校验，@Validated 是 Spring 增强版支持分组校验。"
   },
   {
    "t": "h",
    "text": "拦截器 vs Filter vs AOP"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "Filter",
     "Interceptor",
     "AOP"
    ],
    "rows": [
     [
      "归属",
      "Servlet 容器层",
      "DispatcherServlet 内",
      "方法级动态代理"
     ],
     [
      "能拿到的",
      "ServletRequest/Response",
      "HandlerMethod/ModelAndView",
      "方法参数/返回值"
     ],
     [
      "拦截范围",
      "所有请求含静态资源",
      "仅 Handler 方法",
      "任意 Spring Bean 方法"
     ],
     [
      "中断方式",
      "chain.doFilter 不放行",
      "preHandle 返回 false",
      "抛异常/环绕控制"
     ],
     [
      "典型用例",
      "编码、JWT 登录过滤",
      "登录态、日志",
      "事务、权限、审计、缓存"
     ]
    ]
   },
   {
    "t": "p",
    "text": "执行顺序：Filter.doFilter 链 → DispatcherServlet → Interceptor.preHandle → Controller（AOP 嵌套在方法调用处）→ postHandle → afterCompletion → Filter 链回卷。Filter 能包装 request/response 流（如缓存 body 供多次读取），Interceptor 能感知具体 Controller 方法，AOP 不依赖 Web 环境可切 Service/Dao。RuoYi 里登录态用 Filter/拦截器验 JWT Token，功能权限 @PreAuthorize 本质是 AOP。支付回调验签不要放 Filter——读 body 流会破坏 Controller 的 @RequestBody，用拦截器或 Controller 前置 AOP 更合适。"
   },
   {
    "t": "h",
    "text": "统一异常处理"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    // 参数校验失败：RuoYi 统一返回 AjaxResult\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public AjaxResult handleValid(MethodArgumentNotValidException e) {\n        String msg = e.getBindingResult().getFieldErrors().stream()\n            .map(f -> f.getField() + \" \" + f.getDefaultMessage())\n            .collect(Collectors.joining(\"; \"));\n        return AjaxResult.error(msg);\n    }\n\n    // 业务异常：GM 后台抛 BizException 时统一包装\n    @ExceptionHandler(BizException.class)\n    public AjaxResult handleBiz(BizException e) {\n        return AjaxResult.error(e.getCode(), e.getMessage());\n    }\n\n    // 兜底异常：记录完整堆栈，返回友好提示\n    @ExceptionHandler(Exception.class)\n    public AjaxResult handleOther(Exception e) {\n        log.error(\"系统异常\", e);\n        return AjaxResult.error(\"系统繁忙，请稍后再试\");\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "把 afterCompletion 说成只在成功时执行：它是 finally 语义，异常也执行；仅 preHandle 返回 false 时未放行的拦截器不回调",
     "混淆 Filter/Interceptor 顺序：Filter 在 DispatcherServlet 之前，afterCompletion 在 Filter 链回卷之前",
     "说 @Valid 支持分组校验：分组是 Spring 的 @Validated 能力，@Valid 是 JSR 标准侧重嵌套级联",
     "Filter 里读 body 后不包装请求：下游 @RequestBody 拿不到数据，用 ContentCachingRequestWrapper"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：请求链路 = DispatcherServlet → HandlerMapping 找方法 → 拦截器 → HandlerAdapter 执行（参数解析+调用+返回值序列化）→ afterCompletion → 异常走 HandlerExceptionResolver；Filter/Interceptor/AOP 三层分工，RuoYi 登录在拦截器、权限在 AOP、异常统一包装。下一篇：Spring 事件机制。"
   }
  ]
 },
 {
  "id": "spring-event-mechanism",
  "title": "Spring 事件机制",
  "layer": 2,
  "depends": [
   "spring-core-ioc"
  ],
  "covers": [
   "spring-07",
   "spring-24"
  ],
  "quiz": [
   "spring-07",
   "spring-24"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Spring 事件是容器内的观察者模式：publishEvent 发布，@EventListener 监听，让发布者与订阅者彻底解耦。游戏服'玩家登录后一堆系统要联动'的场景，就是它的主战场。"
   },
   {
    "t": "pre",
    "items": [
     "理解 IOC 容器与 Bean（见核心篇）",
     "理解观察者模式的基本思想"
    ]
   },
   {
    "t": "h",
    "text": "事件三要素"
   },
   {
    "t": "list",
    "items": [
     "事件：Spring 4.2+ 可以是任意 POJO，无需继承 ApplicationEvent",
     "发布：ApplicationEventPublisher.publishEvent(new PlayerLoginEvent(playerId))，注入接口即可",
     "监听：@EventListener 注解方法（任意签名匹配事件类型），或实现 ApplicationListener 接口"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Spring 事件三要素：容器内观察者模式</text>\n<rect x=\"30\" y=\"50\" width=\"150\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">事件对象</text>\n<text x=\"105\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">PlayerLoginEvent</text>\n<text x=\"105\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">POJO 即可（4.2+）</text>\n<rect x=\"245\" y=\"50\" width=\"150\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">发布者</text>\n<text x=\"320\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">publishEvent()</text>\n<text x=\"320\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不知谁在听</text>\n<rect x=\"460\" y=\"50\" width=\"150\" height=\"80\" rx=\"8\" fill=\"var(--lv2)\" stroke=\"none\"/>\n<text x=\"535\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"#fff\">监听者</text>\n<text x=\"535\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"#fff\">@EventListener</text>\n<text x=\"535\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"#fff\">各自独立</text>\n<path d=\"M180 90 L245 90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arG)\"/>\n<path d=\"M395 90 L460 90\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arG)\"/>\n<defs><marker id=\"arG\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<rect x=\"30\" y=\"155\" width=\"580\" height=\"75\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"178\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服玩法：玩家登录事件</text>\n<text x=\"320\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发 LoginEvent → 成就系统 / 七日签到 / 邮件推送各自监听</text>\n<text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">互不知道对方存在 → 新增系统只需加监听器，登录 Handler 零改动</text>\n</svg>",
    "caption": "图 15：事件三要素与登录事件驱动玩法"
   },
   {
    "t": "h",
    "text": "同步 vs 异步监听"
   },
   {
    "t": "p",
    "text": "@EventListener 默认同步：在发布者线程内执行，监听器抛异常会沿调用链传给发布者导致发布失败。加 @Async 改异步后：监听器在独立线程池执行，异常走 AsyncUncaughtExceptionHandler，不影响发布者。异步的最大坑：事务上下文、安全上下文、ThreadLocal 全部不传递——需要的数据必须在事件对象里带全。游戏服里玩家状态本来就不放 ThreadLocal（Netty 异步线程模型下 ThreadLocal 不安全），所以事件对象直接带 playerId + 所需快照数据，反而天然适配。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Component\npublic class LoginEventPublisher {\n    private final ApplicationEventPublisher publisher;\n\n    public LoginEventPublisher(ApplicationEventPublisher publisher) {\n        this.publisher = publisher;\n    }\n\n    public void publishLogin(long playerId, String channel) {\n        // 事件对象里带全异步线程需要的数据\n        publisher.publishEvent(new PlayerLoginEvent(playerId, channel,\n            System.currentTimeMillis()));\n    }\n}\n\npublic class PlayerLoginEvent {\n    private final long playerId;\n    private final String channel;\n    private final long loginTime;\n    // 构造器 + getter 略\n}\n\n@Component\npublic class AchievementListener {\n    @EventListener\n    public void onLogin(PlayerLoginEvent event) {\n        // 同步处理成就进度（默认同线程）\n    }\n}\n\n@Component\npublic class MailListener {\n    @Async(\"mailExecutor\")   // 异步：独立线程池，需要的数据已在事件里带全\n    @EventListener\n    public void onLogin(PlayerLoginEvent event) {\n        // 推送登录奖励邮件\n    }\n}"
   },
   {
    "t": "h",
    "text": "事务事件监听器"
   },
   {
    "t": "p",
    "text": "@TransactionalEventListener(phase = AFTER_COMMIT) 保证事件在事务提交后才触发，适合'充值成功后发公告'这类不能脏读的场景。BEFORE_COMMIT 在提交前触发，若此时发公告而事务随后回滚，就出现公告发了、充值没成的事故——所以充值通知必须 AFTER_COMMIT。注意：没有事务时 @TransactionalEventListener 默认不触发（可设 fallbackExecution = true 让无事务也触发）。"
   },
   {
    "t": "h",
    "text": "事件机制与 MQ 的区别"
   },
   {
    "t": "p",
    "text": "Spring 事件是进程内机制：同 JVM 内同步/异步调用，不跨进程、不持久化、无重试。MQ（Kafka/RabbitMQ）是进程间消息：跨服、持久化、可重试、削峰。选择标准：同进程解耦用事件（GM 后台操作日志异步落库、游戏服登录联动）；跨服通知/削峰用 MQ（登录通知 BI 服、公告广播）。面试要主动点出这个区别，别把两者混谈。GM 后台的 sys_oper_log 操作日志用事件异步落库，避免拖慢主请求——这是事件机制最典型的落地。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">事件机制 vs 消息队列</text>\n<rect x=\"25\" y=\"45\" width=\"290\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">Spring 事件（进程内）</text>\n<text x=\"170\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同 JVM，ApplicationEventPublisher</text>\n<text x=\"170\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">默认同步 / @Async 异步</text>\n<text x=\"170\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不跨进程 / 不持久化 / 无重试</text>\n<text x=\"170\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">适用：登录联动、操作日志</text>\n<text x=\"170\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">GM 后台 sys_oper_log 异步落库</text>\n<rect x=\"325\" y=\"45\" width=\"290\" height=\"150\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">消息队列（进程间）</text>\n<text x=\"470\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Kafka / RabbitMQ</text>\n<text x=\"470\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跨服务 / 可持久化 / 可重试</text>\n<text x=\"470\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">削峰填谷 / 发布订阅</text>\n<text x=\"470\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">适用：跨服通知、BI 上报</text>\n<text x=\"470\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">登录事件发 Kafka 给 BI 服</text>\n</svg>",
    "caption": "图 16：事件机制与 MQ 的适用边界"
   },
   {
    "t": "pits",
    "items": [
     "把 Spring 事件和 MQ 混谈：事件是进程内观察者模式，MQ 是进程间消息，能力边界完全不同",
     "异步监听器里指望事务上下文/安全上下文存在：@Async 切换线程后 ThreadLocal 全丢",
     "充值通知用 BEFORE_COMMIT：事务回滚就产生'公告发了、充值没成'事故，必须 AFTER_COMMIT",
     "监听器抛异常以为不影响发布者：同步监听异常会传给发布者，异步才隔离"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：事件机制是容器内观察者模式，POJO 事件 + publishEvent + @EventListener 三要素；默认同步可 @Async 异步（注意丢上下文）；@TransactionalEventListener(AFTER_COMMIT) 保事务提交后再触发；进程内解耦用事件、跨服用 MQ。下一篇：MyBatis/MyBatis-Plus 深入。"
   }
  ]
 },
 {
  "id": "mybatis-plus-deep",
  "title": "MyBatis / MyBatis-Plus 深入",
  "layer": 3,
  "depends": [
   "springboot-autoconfig"
  ],
  "covers": [
   "spring-32",
   "spring-33",
   "spring-34"
  ],
  "quiz": [
   "spring-32",
   "spring-33",
   "spring-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "MyBatis 一次查询 = Mapper 代理把方法调用转成'按接口全名+方法名查 MappedStatement → Executor 执行 → 结果映射'的流水线；MyBatis-Plus 所有增强都挂在 MappedStatement 动态注入和拦截器体系上，底层仍是 MyBatis。"
   },
   {
    "t": "pre",
    "items": [
     "写过 MyBatis XML 和 Mapper 接口",
     "用过 MyBatis-Plus 的 BaseMapper 和 Wrapper",
     "理解 Spring 的 FactoryBean 概念"
    ]
   },
   {
    "t": "h",
    "text": "Mapper 代理原理：为什么接口没有实现类也能注入"
   },
   {
    "t": "p",
    "text": "启动期 SqlSessionFactoryBuilder 解析 mybatis-config.xml 与 Mapper.xml/注解，构建 Configuration——核心是 MappedStatement 注册表，key = namespace.statementId（即 接口全限定名.方法名）。Spring 集成靠 MapperFactoryBean（FactoryBean 的典型应用）生成 MapperProxyFactory 的 JDK 动态代理。调用 playerMapper.selectById(1) → MapperProxy.invoke → MapperMethod 按'接口全名+方法名'定位 MappedStatement。这就是 XML 的 namespace 必须等于接口全名、statement id 必须等于方法名的原因，也是 Mapper 接口不能重载的原因——绑定 key 不含参数签名。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">MyBatis 一次查询执行链</text>\n<rect x=\"25\" y=\"48\" width=\"130\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Mapper 接口</text>\n<text x=\"90\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MapperProxy 代理</text>\n<rect x=\"185\" y=\"48\" width=\"140\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">MappedStatement</text>\n<text x=\"255\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">namespace.方法名</text>\n<rect x=\"355\" y=\"48\" width=\"130\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Executor</text>\n<text x=\"420\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Simple/Batch/Caching</text>\n<rect x=\"515\" y=\"48\" width=\"110\" height=\"52\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"570\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">JDBC</text>\n<text x=\"570\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">PreparedStatement</text>\n<path d=\"M155 74 L185 74\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arH)\"/>\n<path d=\"M325 74 L355 74\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arH)\"/>\n<path d=\"M485 74 L515 74\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arH)\"/>\n<defs><marker id=\"arH\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<rect x=\"25\" y=\"125\" width=\"600\" height=\"60\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"148\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">四件套分工</text>\n<text x=\"325\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Executor 调度员 → StatementHandler 翻译官 → ParameterHandler 押运员（#{} 预编译防注入）→ ResultSetHandler 拆包工</text>\n<rect x=\"25\" y=\"205\" width=\"600\" height=\"68\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"325\" y=\"228\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">#{ } vs ${ }</text>\n<text x=\"325\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">#{ } = PreparedStatement 占位符，防 SQL 注入；${ } = 字符串拼接，仅动态表名/ORDER BY 列名可用且必须白名单校验</text>\n<text x=\"325\" y=\"268\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">GM 后台列表排序字段是经典注入点</text>\n</svg>",
    "caption": "图 17：MyBatis Mapper 代理与执行链"
   },
   {
    "t": "h",
    "text": "拦截器机制与插件"
   },
   {
    "t": "p",
    "text": "MyBatis 插件基于 JDK 代理 + 责任链，只能拦截四个接口：Executor、StatementHandler、ParameterHandler、ResultSetHandler。分页插件、SQL 慢查询统计、日志服 SQL 审计都挂这里。想拦截所有 Mapper 方法（比如统一补审计字段）要自定义 MapperProxy 层工厂或用 Spring AOP 切 Mapper 接口。"
   },
   {
    "t": "h",
    "text": "MyBatis-Plus 增强原理"
   },
   {
    "t": "p",
    "text": "MP 是增强工具包，核心是'通用 CRUD 免写 SQL + 统一拦截器体系 + Wrapper 条件构造器'。BaseMapper 的 selectById/insert 等由 SqlInjector 在启动期按实体类 @TableName/@TableId/@TableField 元数据动态生成 MappedStatement 注入容器；@TableId(type = IdType.ASSIGN_ID) 内置雪花算法主键。分页插件：MybatisPlusInterceptor（3.4+ 统一入口）+ PaginationInnerInterceptor，拦 Executor.query 先执行 count 再重写 SQL 拼 LIMIT——面试陷阱：没注册分页插件时 page 查询不报错但返回全量、total=0。自动填充：MetaObjectHandler 配合 @TableField(fill = FieldFill.INSERT) 自动填创建时间等审计字段。逻辑删除：@TableLogic 把 delete 变 UPDATE deleted=1，查询自动追加 deleted=0——注意唯一索引要和 deleted 联合设计。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 分页插件配置（3.4+ 统一入口）\n@Configuration\npublic class MybatisPlusConfig {\n    @Bean\n    public MybatisPlusInterceptor mybatisPlusInterceptor() {\n        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();\n        // 分页插件：自动 count + 重写 SQL 拼 LIMIT\n        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));\n        // 乐观锁插件：UPDATE 自动带 version 条件\n        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());\n        // 多租户（游戏'按区服/渠道隔离'同思路）\n        // interceptor.addInnerInterceptor(new TenantLineInnerInterceptor(...));\n        return interceptor;\n    }\n}\n\n// 自动填充审计字段\n@Component\npublic class MyMetaObjectHandler implements MetaObjectHandler {\n    @Override\n    public void insertFill(MetaObject metaObject) {\n        this.strictInsertFill(metaObject, \"createTime\", LocalDateTime.class, LocalDateTime.now());\n        this.strictInsertFill(metaObject, \"createBy\", String.class, getUser());\n    }\n}\n\n// 逻辑删除：delete 变 UPDATE deleted=1，查询自动过滤\npublic class PlayerAccount {\n    @TableId(type = IdType.ASSIGN_ID)\n    private Long id;\n    @TableLogic\n    private Integer deleted;\n    @Version\n    private Integer version; // 乐观锁：update 时 version+1，条件带旧 version\n}"
   },
   {
    "t": "h",
    "text": "批量写入与性能"
   },
   {
    "t": "p",
    "text": "游戏服批量场景（玩家下线批量落库、日志批量刷库）：用 ExecutorType.BATCH 或 MP 的 saveBatch。JDBC 层 MySQL 连接串要加 rewriteBatchedStatements=true，驱动才会把多条 INSERT 重写成单条多 VALUES，否则逐条发送性能无提升。大事务拆批提交避免长时间持锁。"
   },
   {
    "t": "h",
    "text": "一级缓存与二级缓存"
   },
   {
    "t": "p",
    "text": "一级缓存是 SqlSession 级 HashMap（默认开启），任何 DML、commit、close 都会清空；Spring 集成后 SqlSessionTemplate 无事务时每次方法调用都新建 SqlSession 随即关闭——所以 Spring 环境下一级缓存基本不生效，只有同一事务内才命中，这是反直觉的高频考点。二级缓存是 Mapper namespace 级、跨 SqlSession 共享（默认关闭），由 CachingExecutor 装饰实现，查询结果先暂存 TransactionalCacheManager、事务提交后才真正写入（防脏读）。生产慎用二级缓存三理由：多表关联的 namespace 粒度太粗容易脏数据、JVM 本地缓存多实例不一致、TTL 控制弱。玩家数据绝不走二级缓存，统一走 Redis。接 Redis 可自定义实现 org.apache.ibatis.cache.Cache 接口。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">MyBatis 一级 / 二级缓存作用域</text>\n<rect x=\"25\" y=\"45\" width=\"290\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">一级缓存（默认开启）</text>\n<text x=\"170\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SqlSession 级 HashMap</text>\n<text x=\"170\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DML/commit/close 即清空</text>\n<text x=\"170\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">★ Spring 无事务时每次新建会话 → 基本不生效，同事务内才命中</text>\n<rect x=\"325\" y=\"45\" width=\"290\" height=\"110\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">二级缓存（默认关闭）</text>\n<text x=\"470\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Mapper namespace 级共享</text>\n<text x=\"470\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CachingExecutor 装饰</text>\n<text x=\"470\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">事务提交后才写入（防脏读）</text>\n<rect x=\"25\" y=\"175\" width=\"590\" height=\"60\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">生产为什么弃二级缓存</text>\n<text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">多表 namespace 粒度粗易脏 → 多实例本地缓存不一致 → TTL/失效控制弱</text>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">结论：玩家数据/资产统一走 Redis 集中缓存，字典类才可开</text>\n</svg>",
    "caption": "图 18：一二级缓存作用域与生产取舍"
   },
   {
    "t": "pits",
    "items": [
     "答不出 Spring 环境一级缓存基本不生效：无事务时每次调用新建 SqlSession，是高频反直觉考点",
     "没注册分页插件时以为 page 会报错：实际返回全量 + total=0，静默坑",
     "批量插入不提 rewriteBatchedStatements=true：BATCH Executor 配普通连接串等于没优化",
     "逻辑删除后唯一索引冲突：删除标记要用时间戳/ID 而非 0/1，或唯一索引带 deleted"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Mapper 代理按 namespace.方法名定位 MappedStatement，四件套执行链 + 拦截器体系；MP 把增强挂在 SqlInjector 动态注入和 MybatisPlusInterceptor 上；一级缓存 Spring 环境基本失效、二级缓存生产慎用，玩家数据走 Redis。下一篇：Spring Cache 与缓存集成。"
   }
  ]
 },
 {
  "id": "spring-cache-integration",
  "title": "Spring Cache 与缓存集成",
  "layer": 3,
  "depends": [
   "spring-aop-principle"
  ],
  "covers": [
   "spring-25"
  ],
  "quiz": [
   "spring-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "@EnableCaching 开启后缓存注解由 AOP 代理（CacheInterceptor）实现：@Cacheable 先查后放、@CachePut 必执行再更新、@CacheEvict 删除。核心坑是 TTL 必须在 CacheManager 配置层设置、sync 只是单机锁。"
   },
   {
    "t": "pre",
    "items": [
     "理解 AOP 代理原理（自调用失效同样适用）",
     "用过 Redis，理解缓存穿透/击穿/雪崩概念"
    ]
   },
   {
    "t": "h",
    "text": "三个注解的语义"
   },
   {
    "t": "table",
    "head": [
     "注解",
     "语义",
     "典型场景"
    ],
    "rows": [
     [
      "@Cacheable",
      "先查缓存，有则直接返回，无则执行方法并放入",
      "GM 后台字典、玩家档案读取"
     ],
     [
      "@CachePut",
      "必执行方法，再更新缓存",
      "更新玩家昵称后刷新缓存"
     ],
     [
      "@CacheEvict",
      "删除缓存（allEntries 清整区）",
      "导表配置热更后清缓存"
     ],
     [
      "@CacheConfig",
      "类级统一 cacheNames/keyGenerator",
      "治理重复配置"
     ]
    ]
   },
   {
    "t": "h",
    "text": "核心属性"
   },
   {
    "t": "p",
    "text": "cacheNames（缓存分区，如 \"player\"）、key 用 SpEL（#playerId、#root.methodName、#root.args）、condition 条件缓存、unless 结果过滤（如 #result == null 不缓存）、sync = true 同 key 并发只放一个请求进方法（底层是 JVM 本地锁，防单机击穿）。经典坑：@Cacheable 注解本身不支持直接配 TTL——TTL 是具体缓存实现的能力，必须在 RedisCacheManager 配置层按 cacheName 分别设置。key 冲突、缓存数据与 DB 不一致，是缓存注解两大线上事故源。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">缓存三注解语义：读 / 写 / 撕</text>\n<rect x=\"25\" y=\"45\" width=\"190\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">@Cacheable 读</text>\n<text x=\"120\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先查缓存</text>\n<text x=\"120\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">没货才进货（执行方法）</text>\n<text x=\"120\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">unless 控制是否入缓存</text>\n<text x=\"120\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">读多写少的查询</text>\n<rect x=\"225\" y=\"45\" width=\"190\" height=\"120\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">@CachePut 写</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">必执行方法</text>\n<text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">再更新缓存</text>\n<text x=\"320\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">适合写后即热</text>\n<text x=\"320\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">更新昵称/排行榜</text>\n<rect x=\"425\" y=\"45\" width=\"190\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">@CacheEvict 撕</text>\n<text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">删除指定 key</text>\n<text x=\"520\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">allEntries=true 清整区</text>\n<text x=\"520\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">beforeInvocation 控制时机</text>\n<text x=\"520\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">导表热更后失效</text>\n<rect x=\"25\" y=\"185\" width=\"590\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">★ 注解不支持 TTL，必须在 CacheManager 按 cacheName 配置</text>\n<text x=\"320\" y=\"227\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">RedisCacheConfiguration.withInitialCacheConfigurations 按分区设过期时间</text>\n</svg>",
    "caption": "图 19：缓存三注解语义与 TTL 配置位置"
   },
   {
    "t": "h",
    "text": "Spring Cache + Redis 配置"
   },
   {
    "t": "p",
    "text": "引入 spring-boot-starter-data-redis 后默认用 RedisCacheManager。生产配置要点：序列化器用 GenericJackson2JsonRedisSerializer 替代默认 JDK 序列化（可读性好、跨语言）；key 加前缀隔离（如 game:player:）；按 cacheName 分别设 TTL——注解本身不设 TTL，用 withInitialCacheConfigurations 配：\"player\" 缓存 30 分钟、\"rank\" 缓存 30 秒。注意 RedisCacheManager 的缓存名字默认就是 cacheNames 的值，TTL 按名生效。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Configuration\n@EnableCaching\npublic class CacheConfig {\n\n    @Bean\n    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {\n        // JSON 序列化，替代默认 JDK 序列化\n        GenericJackson2JsonRedisSerializer serializer =\n            new GenericJackson2JsonRedisSerializer();\n        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()\n            .entryTtl(Duration.ofMinutes(30))          // 默认 TTL\n            .serializeValuesWith(RedisSerializationContext\n                .SerializationPair.fromSerializer(serializer))\n            .prefixCacheNameWith(\"game:\");            // key 前缀隔离\n\n        Map<String, RedisCacheConfiguration> configs = new HashMap<>();\n        // 排行榜 30 秒削峰\n        configs.put(\"rank\", defaultConfig.entryTtl(Duration.ofSeconds(30)));\n        // 玩家档案 10 分钟\n        configs.put(\"player\", defaultConfig.entryTtl(Duration.ofMinutes(10)));\n\n        return RedisCacheManager.builder(factory)\n            .cacheDefaults(defaultConfig)\n            .withInitialCacheConfigurations(configs)   // 按分区配 TTL\n            .build();\n    }\n}\n\n@Service\npublic class PlayerService {\n    // 玩家档案缓存：key = \"player:\" + playerId\n    @Cacheable(cacheNames = \"player\", key = \"#playerId\")\n    public PlayerProfile getProfile(long playerId) { ... }\n\n    // 更新后失效，下次读取重建（Cache Aside）\n    @CacheEvict(cacheNames = \"player\", key = \"#profile.playerId\")\n    public void updateProfile(PlayerProfile profile) { ... }\n}"
   },
   {
    "t": "h",
    "text": "缓存一致性：Cache Aside"
   },
   {
    "t": "p",
    "text": "先更新数据库，再删缓存（Cache Aside 模式）是业界主流。极端并发下仍有窗口：更新库的线程 A 删缓存前，读线程 B 把旧值回填——解法是延迟双删（删两次，间隔几百毫秒）或短 TTL 兜底。反向顺序'先删缓存再更新库'更差：删除后更新前的并发读会把旧值回填。严格一致场景（如玩家资产）建议直接不缓存或加版本号校验，别拿一致性冒险。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Cache Aside：先更新库再删缓存</text>\n<rect x=\"25\" y=\"45\" width=\"130\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">写请求</text>\n<text x=\"90\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">更新 DB</text>\n<rect x=\"185\" y=\"45\" width=\"130\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"250\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">删缓存</text>\n<text x=\"250\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@CacheEvict</text>\n<rect x=\"345\" y=\"45\" width=\"130\" height=\"46\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"410\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">读请求</text>\n<text x=\"410\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">缓存未命中</text>\n<rect x=\"505\" y=\"45\" width=\"120\" height=\"46\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"565\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">查库回填</text>\n<text x=\"565\" y=\"81\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">新值入缓存</text>\n<path d=\"M155 68 L185 68\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arI)\"/>\n<path d=\"M315 68 L345 68\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arI)\"/>\n<path d=\"M475 68 L505 68\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arI)\"/>\n<defs><marker id=\"arI\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<rect x=\"25\" y=\"115\" width=\"600\" height=\"55\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">极端并发窗口：更新线程删缓存前，读线程回填旧值</text>\n<text x=\"325\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">解法：延迟双删（间隔几百 ms 再删一次）/ 短 TTL 兜底 / 版本号校验</text>\n<rect x=\"25\" y=\"185\" width=\"600\" height=\"58\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"325\" y=\"208\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三大问题联动</text>\n<text x=\"325\" y=\"230\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">穿透：缓存空值/布隆过滤器；击穿：sync/分布式锁/逻辑过期；雪崩：TTL 加随机抖动</text>\n</svg>",
    "caption": "图 20：Cache Aside 与穿透/击穿/雪崩"
   },
   {
    "t": "h",
    "text": "sync 与分布式击穿"
   },
   {
    "t": "p",
    "text": "sync=true 底层是 JVM 本地锁，只防单机击穿；集群下同一 key 不同节点仍会同时进方法。分布式防击穿方案：Redisson 分布式锁（抢锁的节点查库回填，其余等待）、逻辑过期（不设 TTL、异步线程重建缓存，读时可能短暂旧数据）、或缓存预热 + TTL 随机抖动。游戏服排行榜这类读放大场景，缓存 30 秒 TTL 削峰 + 榜单更新事件主动 @CacheEvict，是标准组合。"
   },
   {
    "t": "h",
    "text": "本地缓存 Caffeine 与多级缓存"
   },
   {
    "t": "p",
    "text": "热路径（如每帧读取的 Buff 配置、在线列表）Redis 一次网络往返都嫌贵，用 Caffeine 本地缓存：Caffeine Cache 支持基于大小的淘汰、过期、刷新。多级缓存（本地 + Redis）要注意：更新时先本地失效再 Redis 失效，用版本号或消息广播让各节点主动失效本地缓存，避免各节点读到不一致的本地副本。游戏服热数据优先 Caffeine，冷数据走 Redis，配置类数据可两者结合。"
   },
   {
    "t": "pits",
    "items": [
     "答不出注解不支持 TTL：TTL 必须在 CacheManager 按 cacheName 配置",
     "说 sync=true 能防分布式击穿：它是 JVM 本地锁，集群要分布式锁或逻辑过期",
     "更新策略选错：Cache Aside 是'先更新库再删缓存'，别反了",
     "缓存玩家资产：一致性要求高的数据别缓存，或版本号校验",
     "缓存空值不配 TTL：缓存 null 也要设短 TTL，防穿透"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：缓存注解是 AOP 实现，@Cacheable 读、@CachePut 写、@CacheEvict 撕；TTL 按分区在 RedisCacheManager 配置；Cache Aside 先库后缓存；sync 只防单机，集群用分布式锁；热路径用 Caffeine 本地缓存。下一篇：多数据源与分布式场景。"
   }
  ]
 },
 {
  "id": "multi-datasource-distributed",
  "title": "多数据源与分布式场景",
  "layer": 3,
  "depends": [
   "spring-tx-management",
   "mybatis-plus-deep"
  ],
  "covers": [
   "spring-21",
   "spring-20"
  ],
  "quiz": [
   "spring-21",
   "spring-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "读写分离靠 AbstractRoutingDataSource 动态路由，跨库一致性靠'本地事务 + 幂等 + outbox 最终一致'。游戏服登录服/游戏服/支付服分库后，事务边界怎么划是本篇核心。"
   },
   {
    "t": "pre",
    "items": [
     "理解事务传播与失效场景（事务篇）",
     "理解 MyBatis-Plus 分库分表与 DAO 层实践",
     "做过支付回调，理解幂等概念"
    ]
   },
   {
    "t": "h",
    "text": "AbstractRoutingDataSource 动态路由"
   },
   {
    "t": "p",
    "text": "AbstractRoutingDataSource 是 Spring 的多数据源路由基类：持有 targetDataSources（路由名→DataSource 映射），每次 getConnection() 调用 determineCurrentLookupKey() 决定用哪个库。经典实现：ThreadLocal 存当前路由 key（master/slave），AOP 切面按方法标注（@ReadOnly 或 @DataSource(\"slave\")）设置 key，方法结束清理 ThreadLocal。注意坑：动态切换数据源必须在获取连接之前完成（事务开启即拿连接），所以 @Transactional 和 @DataSource 切面顺序要正确——先路由后开事务；且 ThreadLocal 在异步线程、异常路径要保证清理，否则路由串库。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">AbstractRoutingDataSource 动态路由</text>\n<rect x=\"30\" y=\"48\" width=\"170\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"115\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">@DataSource(\"slave\")</text>\n<text x=\"115\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">AOP 切面设 ThreadLocal</text>\n<text x=\"115\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">determineCurrentLookupKey</text>\n<rect x=\"235\" y=\"48\" width=\"170\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">AbstractRoutingDataSource</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">targetDataSources 映射</text>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">getConnection 时路由</text>\n<rect x=\"440\" y=\"48\" width=\"175\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"527\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">master / slave</text>\n<text x=\"527\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读写分离</text>\n<text x=\"527\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">或按库分片</text>\n<path d=\"M200 83 L235 83\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arJ)\"/>\n<path d=\"M405 83 L440 83\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#arJ)\"/>\n<defs><marker id=\"arJ\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<rect x=\"30\" y=\"145\" width=\"585\" height=\"55\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"168\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">两个致命坑</text>\n<text x=\"322\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">① 路由必须在获取连接前完成：事务一开即拿连接，@DataSource 切面要先于事务切面；② ThreadLocal 异步/异常要清理，否则路由串库</text>\n<rect x=\"30\" y=\"218\" width=\"585\" height=\"50\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"322\" y=\"241\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服落地：登录库/游戏库/支付库分库，DAO 层按业务域各自 Mapper</text>\n<text x=\"322\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分库分表后注意：跨库事务本地事务失效 → 必须演进到最终一致</text>\n</svg>",
    "caption": "图 21：动态数据源路由与两大坑"
   },
   {
    "t": "h",
    "text": "多数据源方案选型"
   },
   {
    "t": "table",
    "head": [
     "方案",
     "机制",
     "适用"
    ],
    "rows": [
     [
      "@DS 注解 + AOP（dynamic-datasource-spring-boot-starter）",
      "注解声明 + ThreadLocal 路由",
      "读写分离、多库切换，轻量"
     ],
     [
      "AbstractRoutingDataSource 手写",
      "自定路由规则",
      "需要完全定制路由逻辑"
     ],
     [
      "ShardingSphere 读写分离/分片",
      "中间件解析 SQL 路由",
      "分库分表 + 读写分离统一"
     ],
     [
      "XA / 2PC",
      "全局事务协调",
      "强一致，性能差，少用"
     ],
     [
      "Seata AT / TCC / SAGA",
      "分布式事务框架",
      "跨服务一致性，重"
     ],
     [
      "本地事务 + outbox + MQ",
      "最终一致",
      "跨库跨服的主流务实方案"
     ]
    ]
   },
   {
    "t": "h",
    "text": "事务边界设计：支付回调案例"
   },
   {
    "t": "p",
    "text": "核心思路'本地事务保证核心原子性 + 幂等防重 + outbox 保证异步通知最终一致'，不依赖分布式事务框架也能落地。流程：验签 → 查订单（不存在建档）→ 状态机校验（只受理 PENDING）→ 本地事务四件套（UPDATE order SET status=SUCCESS WHERE id=? AND status=PENDING 影响行数=0 说明重复回调直接返回；插入发货流水（订单号唯一索引，幂等第二层）；更新玩家资产/发放道具（固定顺序加锁防死锁）；同事务插 outbox 表）→ 异步投递（定时任务扫 outbox 发 Kafka 通知 BI/GM，消费端事件ID去重）→ T+1 对账兜底。关键决策：不用 Seata——充值主链路单库操作本地事务够；事务内不放 RPC/HTTP；必须先 UPDATE 状态再发货——状态机+影响行数是最强幂等防线。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@Service\npublic class RechargeService {\n\n    @Transactional(rollbackFor = Exception.class)\n    public void onRechargeCallback(RechargeReq req) {\n        // 1. 幂等第一层：状态机 + 影响行数\n        int rows = orderMapper.compareAndSetStatus(\n            req.getOrderNo(), OrderStatus.PENDING, OrderStatus.SUCCESS);\n        if (rows == 0) {\n            return; // 重复回调，已成功，直接 ack\n        }\n        // 2. 幂等第二层：流水唯一索引，冲突即已发货\n        try {\n            flowMapper.insert(buildFlow(req));\n        } catch (DuplicateKeyException e) {\n            return;\n        }\n        // 3. 发放资产（同库）\n        assetMapper.addGold(req.getPlayerId(), req.getGold());\n        // 4. 同事务写 outbox，保证'状态改了消息必然落'（至少一次）\n        outboxMapper.insert(new Outbox(\"RECHARGE_SUCCESS\", req.getOrderNo()));\n        // 5. 事务内绝不发 MQ/RPC——长事务打爆连接池\n    }\n}\n\n// 定时投递：扫描未投递 outbox → 发 Kafka → 标记已投\n// 标记前宕机 → 下次重发 → 消费端事件 ID 去重，天然至少一次"
   },
   {
    "t": "h",
    "text": "跨库后怎么演进到柔性事务"
   },
   {
    "t": "p",
    "text": "分库分表后资产在 A 库、订单在 B 库，本地事务失效。演进路线：各库本地事务 + 各自 outbox → MQ 驱动状态机流转（SAGA 思路）→ 失败补偿（退款或回收道具）→ 对账兜底。TCC（Try-Confirm-Cancel）适合必须实时拿到执行结果的跨服务场景，但开发量大；AT 模式靠快照+undolog 自动回滚，侵入小但要评估性能。充值这类可异步最终一致的场景，outbox + MQ 是最稳的选择。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">充值一致性四字诀：改、包、播、对</text>\n<rect x=\"25\" y=\"45\" width=\"140\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">① 改</text>\n<text x=\"95\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">状态机 UPDATE</text>\n<text x=\"95\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">PENDING→SUCCESS</text>\n<text x=\"95\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">影响行数=0 即重复</text>\n<rect x=\"175\" y=\"45\" width=\"155\" height=\"110\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"252\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">② 包</text>\n<text x=\"252\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">订单+流水+资产+outbox</text>\n<text x=\"252\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同库一锅端本地事务</text>\n<text x=\"252\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">核心原子性</text>\n<rect x=\"340\" y=\"45\" width=\"140\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"410\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">③ 播</text>\n<text x=\"410\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">扫描 outbox → Kafka</text>\n<text x=\"410\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BI/GM/公告消费</text>\n<text x=\"410\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">最终一致</text>\n<rect x=\"490\" y=\"45\" width=\"130\" height=\"110\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"555\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">④ 对</text>\n<text x=\"555\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">T+1 对账文件比对</text>\n<text x=\"555\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">状态不一致补单/退款</text>\n<text x=\"555\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">兜底</text>\n<rect x=\"25\" y=\"175\" width=\"595\" height=\"58\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"322\" y=\"198\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">决策点：为什么不用 Seata？</text>\n<text x=\"322\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">主链路单库本地事务足够；跨服（BI/公告）允许秒级延迟，最终一致即可；事务内不放 RPC/HTTP</text>\n</svg>",
    "caption": "图 22：充值一致性的本地事务 + 幂等 + outbox 闭环"
   },
   {
    "t": "pits",
    "items": [
     "事务和幂等混为一谈：事务保证原子性，幂等保证重试安全，二者互补缺一不可",
     "支付回调响应慢：支付平台要求快速 ack，先落单 PENDING 快速返回，发货异步",
     "跨库了还用本地事务：分库后本地事务失效，必须 outbox + MQ 演进",
     "动态数据源路由和事务切面顺序搞反：先路由后开事务，路由要在拿连接之前",
     "outbox 与业务数据不同事务：必须同事务落库，才能保证'状态改了消息必然落'"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：多数据源用 AbstractRoutingDataSource/注解路由实现读写分离，注意路由先于事务；跨库强一致用 XA/Seata（重），主流务实方案是本地事务+幂等+outbox+MQ 最终一致，对账兜底。下一篇：SpringBoot 生产运维。"
   }
  ]
 },
 {
  "id": "springboot-prod-ops",
  "title": "SpringBoot 生产运维",
  "layer": 3,
  "depends": [
   "springboot-autoconfig"
  ],
  "covers": [
   "spring-17",
   "spring-19",
   "spring-27",
   "spring-28",
   "spring-29"
  ],
  "quiz": [
   "spring-17",
   "spring-29",
   "spring-19"
  ],
  "body": [
   {
    "t": "lead",
    "text": "生产运维四件事：外部化配置与多环境隔离、Actuator 指标与健康检查、优雅停机、启动优化。游戏服多角色部署（登录服/游戏服/购买服同代码库）是配置与运维知识的最佳应用场景。"
   },
   {
    "t": "pre",
    "items": [
     "理解自动配置与 starter（见自动配置篇）",
     "部署过 SpringBoot 应用，了解 jar 运行方式",
     "了解 K8s 探针与 Docker 基本概念"
    ]
   },
   {
    "t": "h",
    "text": "配置外部化与多环境"
   },
   {
    "t": "p",
    "text": "外部化配置按固定优先级覆盖：命令行参数 > 系统属性/环境变量 > 外部配置文件 > jar 内配置文件；同级下 profile 特定文件压通用文件。加载位置（外压内）：启动目录 /config 子目录 > 启动目录 > classpath:/config > classpath:/。多环境：spring.profiles.active 激活，application-{profile}.yml 覆盖 application.yml。加密：jasypt-spring-boot-starter 密文 ENC(xxx) + 密钥环境变量注入；更优解是 Nacos 配置中心 + K8s Secret。注意 bootstrap.yml 只有引入 SpringCloud 配置中心依赖才有 bootstrap 阶段，纯 SpringBoot 项目没有——别把配置放错文件。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">配置优先级（高 → 低）</text>\n<rect x=\"180\" y=\"45\" width=\"280\" height=\"36\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">命令行参数 --server.port=8081</text>\n<rect x=\"180\" y=\"85\" width=\"280\" height=\"36\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"108\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">系统属性 / 环境变量</text>\n<rect x=\"180\" y=\"125\" width=\"280\" height=\"36\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"148\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">外部配置文件（/config 或 --spring.config.location）</text>\n<rect x=\"180\" y=\"165\" width=\"280\" height=\"36\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">jar 内 application.yml</text>\n<rect x=\"25\" y=\"215\" width=\"590\" height=\"36\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">口诀：命令行最大、环境变量老二、外置压内置、profile 专精压通用；密码三原则：不进 git、不进镜像、密钥走环境变量</text>\n</svg>",
    "caption": "图 23：配置加载优先级与多环境隔离"
   },
   {
    "t": "h",
    "text": "Actuator：生产监控门面"
   },
   {
    "t": "p",
    "text": "核心端点按用途分组：健康（/actuator/health，聚合 DB/Redis/Kafka 状态，K8s liveness/readiness 探针对接它）；指标（/actuator/metrics，JVM 内存/线程/GC/HTTP，Micrometer 吐 Prometheus + Grafana）；排查（/actuator/beans、/actuator/mappings、/actuator/conditions——自动装配条件评估报告，排查'为什么我的 Bean 没装上'）；运维（/actuator/loggers 运行时动态调日志级别、/actuator/heapdump 与 threaddump 导出快照）；/actuator/shutdown 默认禁用。线上安全四件事：只暴露需要的端点（include=health,info,metrics）、独立管理端口 + 内网 ACL、env/heapdump 等敏感端点必须鉴权（heapdump 会泄露内存里的密钥）、网关屏蔽外网。"
   },
   {
    "t": "h",
    "text": "优雅停机"
   },
   {
    "t": "p",
    "text": "SpringBoot 2.3+ 内置 server.shutdown=graceful + spring.lifecycle.timeout-per-shutdown-phase=30s。流程：SIGTERM（kill -15）→ 发布 ContextClosedEvent → Web 容器停止接收新请求 → 等待在途请求完成（超时强杀）→ SmartLifecycle 按 phase 逆序停止 → @PreDestroy → JVM 退出。K8s 配合：terminationGracePeriodSeconds 大于应用 timeout；preStop hook sleep 几秒等待 endpoints 摘除。游戏服额外动作（与 Web 服务的本质区别）：先摘流（从 Nacos/网关反注册，登录服停止分配新玩家）；玩家存档（内存态玩家状态强制批量落库）；队列刷盘（Disruptor 积压消费完、日志缓冲刷 Kafka）；定时任务先停。kill -9 无任何回调，内存玩家数据直接丢。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "# application.yml 优雅停机\nserver:\n  shutdown: graceful\nspring:\n  lifecycle:\n    timeout-per-shutdown-phase: 30s\n\n# 游戏服：停机编排用 SmartLifecycle，phase 小先启动后停止\n@Component\npublic class GameServerLifecycle implements SmartLifecycle {\n    private boolean running = false;\n\n    @Override\n    public void start() {\n        // 启动：bind Netty 端口（phase 大，后启动）\n        nettyServer.bind();\n        running = true;\n    }\n\n    @Override\n    public void stop() {\n        // 停止：先摘流 → 再刷玩家存档 → 最后关 EventLoopGroup\n        gatewayClient.unregister();        // 1. 从网关反注册\n        playerStore.flushAll();            // 2. 内存玩家强制落库\n        disruptor.shutdown();              // 3. 消费队列积压\n        nettyServer.shutdownGracefully();  // 4. 关入口\n    }\n\n    @Override public boolean isRunning() { return running; }\n    @Override public int getPhase() { return Integer.MAX_VALUE; } // 后启动、先停止\n}"
   },
   {
    "t": "h",
    "text": "启动优化"
   },
   {
    "t": "p",
    "text": "方法论：先量化定位再对症优化。排查：debug 日志看各阶段耗时、spring-boot-startup-analyzer 精确到 Bean、JFR 录制启动。优化手段：精简依赖（砍无用 starter、spring.autoconfigure.exclude）；懒加载（Boot2.2+ spring.main.lazy-initialization=true，注意把启动慢挪到首请求慢）；异步初始化（重资源放 ApplicationRunner + 线程池，health 先 UP，readiness 等初始化完再 UP）；JVM 层（-XX:TieredStopAtLevel=1、AppCDS、Boot3 AOT/GraalVM Native Image）。游戏服实际：导表工具产出的配置表是启动大头——大表异步加载 + 关键表先加载；先让 K8s 探针通过再开放流量。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服优雅停机四步（区别于普通 Web）</text>\n<rect x=\"25\" y=\"45\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">① 摘流</text>\n<text x=\"95\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Nacos/网关反注册</text>\n<text x=\"95\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录服停分配玩家</text>\n<rect x=\"180\" y=\"45\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"250\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">② 存档</text>\n<text x=\"250\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">内存玩家状态</text>\n<text x=\"250\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">强制批量落库 ★</text>\n<rect x=\"335\" y=\"45\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"405\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">③ 刷盘</text>\n<text x=\"405\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Disruptor 积压消费完</text>\n<text x=\"405\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">日志缓冲刷 Kafka</text>\n<rect x=\"490\" y=\"45\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"555\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">④ 关闸</text>\n<text x=\"555\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">关端口/EventLoopGroup</text>\n<text x=\"555\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">停定时任务</text>\n<rect x=\"25\" y=\"145\" width=\"595\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"168\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">配置与编排</text>\n<text x=\"322\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">server.shutdown=graceful + timeout-per-shutdown-phase=30s</text>\n<text x=\"322\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SmartLifecycle phase 小先启动后停止；K8s: terminationGracePeriodSeconds > timeout + preStop sleep 等流量摘除</text>\n</svg>",
    "caption": "图 24：游戏服优雅停机四步与配置"
   },
   {
    "t": "pits",
    "items": [
     "kill -9 还期待数据安全：无任何回调，在途请求中断、内存玩家数据丢失",
     "health 里 Redis 挂了导致整个 DOWN：可自定义 HealthIndicator 降级为 WARN，避免 K8s 摘流量",
     "懒加载说成无副作用：把启动慢挪到首请求慢，热路径关键 Bean 保持饿汉",
     "日志级别调整不区分方式：loggers 端点运行时生效重启丢失，自动扫描持久但有重载开销",
     "配置密码进 jar/仓库：密钥走环境变量或 K8s Secret，绝不明文入库"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：外部化配置按优先级覆盖、profile 多环境隔离、jasypt/配置中心加密；Actuator 按用途分健康/指标/排查/运维，敏感端点必须鉴权；优雅停机 = 拒新 + 等在途 + 再退出，游戏服多摘流、存档、刷盘；启动优化先量化再对症。下一篇：手写简化 IOC/AOP。"
   }
  ]
 },
 {
  "id": "handwrite-ioc-aop",
  "title": "手写简化 IOC / AOP",
  "layer": 3,
  "depends": [
   "spring-bean-lifecycle",
   "spring-aop-principle"
  ],
  "covers": [
   "spring-18",
   "spring-35"
  ],
  "quiz": [
   "spring-18",
   "spring-35"
  ],
  "body": [
   {
    "t": "lead",
    "text": "手写一个 200 行的简化 IOC + AOP，把'定义注册、实例化、属性填充、后置处理器、代理生成'的核心链路亲手实现一遍，就能和 Spring 源码逐行对照——这是面试'你懂不懂原理'的最佳证明。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Bean 生命周期主线（生命周期篇）",
     "理解动态代理与 AOP 织入（AOP 篇）",
     "会用反射操作类/字段/方法"
    ]
   },
   {
    "t": "h",
    "text": "手写容器：三步走"
   },
   {
    "t": "p",
    "text": "一个最小 IOC 容器只需三步：① 扫描类路径，把带 @MyComponent 的类登记成 BeanDefinition（存类、作用域、单例实例引用）；② 按拓扑顺序实例化：反射 newInstance → 扫描字段上的 @MyAutowired → 从容器取依赖注入（需要时递归创建依赖）；③ 单例实例缓存进 Map，getBean 返回。要点：属性填充要在实例化之后（这就是 Spring 能解 setter 循环依赖的前提）；单例注册表就是一级缓存的原型。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 极简注解\n@Target(ElementType.TYPE)\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface MyComponent {}\n\n@Target(ElementType.FIELD)\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface MyAutowired {}\n\n// 简化 IOC 容器\npublic class MiniIocContainer {\n    private final Map<String, Object> singletonPool = new ConcurrentHashMap<>(); // 一级缓存原型\n    private final Map<Class<?>, Object> inCreation = new ConcurrentHashMap<>();   // 半成品（对应二/三级缓存）\n\n    public void scan(String basePackage) throws Exception {\n        // 用 ClassPathScanner 扫出所有 @MyComponent 类，登记类型 -> Class 映射（BeanDefinition 简化版）\n    }\n\n    public <T> T getBean(Class<T> type) throws Exception {\n        Class<?> clazz = beanClasses.get(type);\n        return type.cast(createBean(clazz));\n    }\n\n    private Object createBean(Class<?> clazz) throws Exception {\n        // 一级缓存命中直接返回\n        Object existing = singletonPool.get(clazz.getName());\n        if (existing != null) return existing;\n        // 循环依赖：半成品缓存命中返回（对应 Spring 二级缓存）\n        Object early = inCreation.get(clazz);\n        if (early != null) return early;\n\n        Object instance = clazz.getDeclaredConstructor().newInstance(); // 1. 实例化\n        inCreation.put(clazz, instance);                                // 2. 提前暴露\n        for (Field f : clazz.getDeclaredFields()) {                     // 3. 属性填充\n            if (f.isAnnotationPresent(MyAutowired.class)) {\n                f.setAccessible(true);\n                f.set(instance, getBean(f.getType()));                  // 递归注入依赖\n            }\n        }\n        inCreation.remove(clazz);\n        singletonPool.put(clazz.getName(), instance);                    // 4. 入一级缓存\n        return instance;\n    }\n}"
   },
   {
    "t": "h",
    "text": "手写动态代理"
   },
   {
    "t": "p",
    "text": "JDK 动态代理三要素：目标接口、InvocationHandler（增强逻辑 + 反射调用目标方法）、Proxy.newProxyInstance 生成代理。在简化容器里加一步：实例化后检查类是否有 @MyTransactional/@MyLog 注解方法，有则用代理包装再放入单例池——这就是 Spring 的 postProcessAfterInitialization 干的事（代理替换原 Bean）。对比 Spring：真正的代理器是 AnnotationAwareAspectJAutoProxyCreator 这个 BeanPostProcessor，它比我们的'创建时检查'更晚触发（初始化后），且支持 AspectJ 切点匹配。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 手写 JDK 动态代理：AOP 最简版\npublic class JdkProxyDemo {\n\n    interface Greeter {\n        String greet(String name);\n    }\n\n    static class GreeterImpl implements Greeter {\n        @Override public String greet(String name) {\n            return \"hello \" + name;\n        }\n    }\n\n    public static void main(String[] args) {\n        Greeter target = new GreeterImpl();\n        Greeter proxy = (Greeter) Proxy.newProxyInstance(\n            Greeter.class.getClassLoader(),\n            new Class[]{Greeter.class},\n            (proxyObj, method, params) -> {\n                System.out.println(\"[切面前] 方法: \" + method.getName()); // @Before\n                Object result = method.invoke(target, params);            // 目标方法\n                System.out.println(\"[切面后] 返回: \" + result);            // @After\n                return result;\n            });\n        System.out.println(proxy.greet(\"玩家\"));\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">手写容器 vs Spring 源码对照</text>\n<rect x=\"25\" y=\"45\" width=\"290\" height=\"190\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">我的 MiniIocContainer</text>\n<text x=\"170\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">扫描 @MyComponent → BeanDefinition 简化版</text>\n<text x=\"170\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">实例化 + 字段注入（递归）</text>\n<text x=\"170\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">singletonPool = 一级缓存</text>\n<text x=\"170\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">inCreation = 半成品缓存</text>\n<text x=\"170\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">注入用反射，无循环三级</text>\n<text x=\"170\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">无生命周期回调</text>\n<rect x=\"325\" y=\"45\" width=\"290\" height=\"190\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">Spring 容器</text>\n<text x=\"470\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BeanDefinition 完整字段（scope/lazy/init）</text>\n<text x=\"470\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">三级缓存解循环依赖</text>\n<text x=\"470\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">生命周期九步 + Aware</text>\n<text x=\"470\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BeanPostProcessor 扩展点</text>\n<text x=\"470\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">AOP 代理器是 BPP 实现</text>\n<text x=\"470\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">FactoryBean 定制复杂 Bean</text>\n<rect x=\"25\" y=\"245\" width=\"590\" height=\"30\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"none\"/>\n<text x=\"320\" y=\"265\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">核心同构：定义 → 实例化 → 填充 → 增强 → 入池；差异在扩展点与生命周期完整度</text>\n</svg>",
    "caption": "图 25：手写容器与 Spring 的核心对照"
   },
   {
    "t": "h",
    "text": "Bean 后置处理器：BPP 与 BFPP"
   },
   {
    "t": "p",
    "text": "BeanFactoryPostProcessor（BFPP）动'定义'：所有 BeanDefinition 加载完、任何 Bean 实例化之前执行，可修改 BeanDefinition（改类/属性/作用域）。典型实现：ConfigurationClassPostProcessor（解析 @Configuration/@ComponentScan）、PropertySourcesPlaceholderConfigurer（${} 占位符替换）。BeanPostProcessor（BPP）动'实例'：每个 Bean 实例化初始化过程前后回调。典型实现：AOP 自动代理、AutowiredAnnotationBeanPostProcessor。执行顺序：先 BFPP（定义级）再各 Bean 实例化 + BPP（实例级）。游戏工具场景：协议 Handler 自动注册可用 SmartInitializingSingleton（所有单例就绪后回调一次）扫描 @Protocol 注解建路由表；占位符必须在 BeanDefinition 阶段替换完成（图纸阶段改完，实例阶段再改来不及）。"
   },
   {
    "t": "h",
    "text": "扩展点全家桶按启动阶段串一遍"
   },
   {
    "t": "p",
    "text": "EnvironmentPostProcessor（配置解析后、容器创建前注入属性，jasypt/配置中心挂这）→ ApplicationContextInitializer（context 创建后、refresh 前）→ BeanDefinitionRegistryPostProcessor（动态注册新 BeanDefinition，是 BFPP 子接口且先执行）→ BeanFactoryPostProcessor（改已有定义）→ InstantiationAwareBeanPostProcessor（实例化前后）→ Aware 家族 → 初始化三件套 → SmartInitializingSingleton/ApplicationRunner（全就绪后）→ SmartLifecycle（启动/停止编排，游戏服 Netty Server 挂这）。用装修流程记忆：通水电（Environment）→ 图纸会审（Initializer）→ 图纸盖章（BDRPP/BFPP）→ 毛坯验收（实例化 BPP）→ 精装收尾（初始化）→ 竣工验收（SmartInitializing）→ 开门营业/打烊（SmartLifecycle）。"
   },
   {
    "t": "pits",
    "items": [
     "把 ConfigurationClassPostProcessor 说成 BPP：它是 BDRPP/BFPP 家族，动定义不动实例",
     "说 BPP 的 after 回调只触发一次：每个 Bean 初始化完都会触发；聚合型初始化用 SmartInitializingSingleton 只一次",
     "手写容器时说'属性填充在构造器里'：注入发生在实例化之后，这正是循环依赖能解的根基",
     "混淆 FactoryBean 和 BeanFactory：FactoryBean 是定制复杂 Bean 创建的工厂接口（MyBatis 的 MapperFactoryBean 就是）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：手写最小容器 = 扫描登记 + 实例化 + 反射注入 + 单例池，与 Spring 核心同构；动态代理 = InvocationHandler + Proxy，对应 AOP 的 BPP 织入；BFPP 改图纸、BPP 改产品，扩展点全家桶按启动阶段记忆。下一篇：Spring 面试深水区易错合集。"
   }
  ]
 },
 {
  "id": "spring-interview-deepwater",
  "title": "Spring 面试深水区易错合集",
  "layer": 3,
  "depends": [
   "spring-bean-lifecycle",
   "spring-tx-management",
   "spring-aop-principle"
  ],
  "covers": [
   "spring-31",
   "spring-36",
   "spring-37"
  ],
  "quiz": [
   "spring-31",
   "spring-36",
   "spring-37"
  ],
  "body": [
   {
    "t": "lead",
    "text": "把前面所有篇的高频易错点集中盘点：@Configuration 的 CGLIB 代理开关、自调用失效、Bean 作用域陷阱、定时任务集群防重、Boot3 升级雷区——每一坑都是面试官最爱挖的考点。"
   },
   {
    "t": "pre",
    "items": [
     "已学完前面 15 篇，理解生命周期/AOP/事务/自动配置",
     "准备参加游戏服务器方向的 Spring 面试"
    ]
   },
   {
    "t": "h",
    "text": "@Configuration 的 proxyBeanMethods"
   },
   {
    "t": "p",
    "text": "Spring 5.2+ 的 @Configuration(proxyBeanMethods = true/false) 是深水区高频题。true（默认）= Full 模式：配置类被 CGLIB 代理，@Bean 方法互相调用时从容器取单例而非重新执行方法，保证单例一致；代价是类不能 final、启动有代理开销。false = Lite 模式：不被代理，方法间调用会重复 new，等价于去掉 @Configuration 变成 @Component 上的 @Bean。SpringBoot 自己的自动配置类大多用 false 提速，代价是 Bean 间依赖不能靠方法调用，要传参数。追问时主动讲：Boot 2.2+ 内部自动配置类普遍 proxyBeanMethods=false。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">@Configuration 两种模式（Spring 5.2+）</text>\n<rect x=\"25\" y=\"45\" width=\"290\" height=\"140\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">proxyBeanMethods=true（Full）</text>\n<text x=\"170\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CGLIB 代理配置类</text>\n<text x=\"170\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@Bean 方法互调 → 容器取单例</text>\n<text x=\"170\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">保证单例一致</text>\n<text x=\"170\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">限制：类不能 final，有代理开销</text>\n<text x=\"170\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">默认值，业务配置类用它</text>\n<rect x=\"325\" y=\"45\" width=\"290\" height=\"140\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">proxyBeanMethods=false（Lite）</text>\n<text x=\"470\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不被代理，等价普通 @Component</text>\n<text x=\"470\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">@Bean 方法互调 → 每次 new</text>\n<text x=\"470\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">依赖要传参数，别方法互调</text>\n<text x=\"470\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">启动更快</text>\n<text x=\"470\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">Boot 2.2+ 自动配置类普遍用它</text>\n<rect x=\"25\" y=\"200\" width=\"590\" height=\"38\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">追问点：为什么自动配置类用 false？→ 减少启动期 CGLIB 字节码生成，加速启动</text>\n</svg>",
    "caption": "图 26：@Configuration Full 与 Lite 模式"
   },
   {
    "t": "h",
    "text": "自调用失效全家桶"
   },
   {
    "t": "p",
    "text": "this.method() 直接调不经过代理，所有基于代理的注解（@Transactional、@Cacheable、@Async、@PreAuthorize）在同类自调用时全部失效。统一解法：① 注入自身 Bean 再调（this 换成 self）；② AopContext.currentProxy()（需 @EnableAspectJAutoProxy(exposeProxy = true)）；③ 拆到另一个 Bean（最推荐，还顺带职责拆分）。判断代理方式：打印 bean.getClass() 类名带 $Proxy 是 JDK 代理，带 EnhancerBySpringCGLIB 是 CGLIB；或 AopUtils.isJdkDynamicProxy / isCglibProxy。这是所有'为什么没生效'问题的第一排查位。"
   },
   {
    "t": "h",
    "text": "Bean 作用域与状态陷阱合集"
   },
   {
    "t": "p",
    "text": "单例 Handler 存玩家状态 = 串号事故（所有玩家共享一个字段）；prototype Bean 字段注入单例退化成单例（用 ObjectProvider/@Lookup 每次取）；Web 作用域底层是代理对象，别以为拿到真实例；@Async 异步方法上单独加 @Transactional 由新线程建立自己的事务上下文，不能用调用方的事务（事务绑 ThreadLocal）。定时任务 @Scheduled 默认单线程调度池，多任务互相阻塞；集群部署每个节点都触发，必须 ShedLock（Redis 锁）或调度中心分片。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 定时任务集群防重：ShedLock\n@Configuration\n@EnableScheduling\n@EnableSchedulerLock(defaultLockAtMostFor = \"5m\")\npublic class ScheduleConfig {\n    // 配 ShedLock 的 Redis LockProvider\n}\n\n@Component\npublic class DailyTasks {\n    // 每日签到重置：海外服按区服时区结算用 zone\n    @Scheduled(cron = \"0 0 4 * * ?\", zone = \"Asia/Shanghai\")\n    @SchedulerLock(name = \"dailySignReset\", lockAtMostFor = \"10m\",\n                   lockAtLeastFor = \"1m\")\n    public void dailySignReset() {\n        // lockAtMostFor 防持锁节点宕机死锁；lockAtLeastFor 防任务过快重复抢\n    }\n}\n\n// 自调用修复\n@Service\npublic class GmService {\n    @Autowired\n    private GmService self; // 注入自身代理\n\n    public void batchOp() {\n        self.singleOp(); // 走代理，事务/缓存生效\n    }\n\n    @Transactional\n    public void singleOp() { ... }\n}"
   },
   {
    "t": "h",
    "text": "SpringBoot 3 升级雷区"
   },
   {
    "t": "p",
    "text": "三大变化'换鞋、改名、塑身'：JDK 17 起步、javax 全面迁移 jakarta 命名空间（最大工作量，老版 MyBatis 集成包/Swagger 2/旧 Druid 必须同步升级，MP 用 mybatis-plus-spring-boot3-starter，可用 OpenRewrite 自动化迁移）、AOT/GraalVM Native Image 支持（为反射/代理/资源显式注册 hint，MyBatis 重反射适配成本高，先拿无状态边缘服务试点）。另外自动装配清单格式变化：spring.factories 的 EnableAutoConfiguration key 废弃，改 AutoConfiguration.imports——自定义 starter 必须跟着改。升级策略：先升到 2.7.x 最新再跨 3.x。其他亮点：虚拟线程（GM 后台 IO 密集受益，注意 synchronized 的 pinning 问题换 ReentrantLock）、PathPatternParser 默认路径匹配（AntPathMatcher 尾匹配行为差异要回归测试）。"
   },
   {
    "t": "h",
    "text": "高频追问串联"
   },
   {
    "t": "p",
    "text": "循环依赖根治：SpringBoot 2.6+ 默认禁止，根治是重构而非 allow-circular-references=true；事务与幂等关系：事务保证原子性、幂等保证重试安全，支付回调'先 UPDATE 状态+影响行数'是最强幂等；事件与 MQ：进程内 vs 进程间；启动优化：先量化（startup-analyzer/conditions 报告）再对症（砍装配/懒加载/异步初始化/AOT）；扩展点全家桶按启动阶段串（Environment → Initializer → BDRPP/BFPP → BPP → 初始化 → SmartInitializing/Runner → SmartLifecycle）。把这些问题串成一条'从启动到运行到停机'的时间线，面试表达会非常有体系。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">面试深水区六连问（一图串完）</text>\n<rect x=\"25\" y=\"45\" width=\"190\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">① @Configuration 代理</text>\n<text x=\"120\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Full=单例保证 / Lite=提速</text>\n<rect x=\"225\" y=\"45\" width=\"190\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">② 自调用失效</text>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">注入自身/currentProxy/拆 Bean</text>\n<rect x=\"425\" y=\"45\" width=\"190\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">③ 作用域陷阱</text>\n<text x=\"520\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单例无状态 / prototype 退化</text>\n<rect x=\"25\" y=\"117\" width=\"190\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">④ 循环依赖根治</text>\n<text x=\"120\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">重构 > 显式开启配置</text>\n<rect x=\"225\" y=\"117\" width=\"190\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">⑤ 定时任务集群</text>\n<text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ShedLock / 调度中心分片</text>\n<rect x=\"425\" y=\"117\" width=\"190\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">⑥ Boot3 升级</text>\n<text x=\"520\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JDK17 + jakarta + AOT</text>\n<rect x=\"25\" y=\"192\" width=\"590\" height=\"30\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"none\"/>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">答题心法：先给结论（一句话）→ 讲机制（为什么）→ 举游戏服案例 → 给解法；答错不如不答深，诚实标 unverified</text>\n</svg>",
    "caption": "图 27：深水区六连问速查"
   },
   {
    "t": "pits",
    "items": [
     "只背结论不解释机制：'自调用失效'要说出代理入口这个根因",
     "版本事实说过时结论：Boot2.x 默认 CGLIB、Boot2.6 禁循环依赖、Boot3 JDK17/imports，都是现状",
     "定时任务只讲单机用法：集群重复执行导致资损是题眼，必须提 ShedLock/分片",
     "虚拟线程下盲目用 synchronized：会钉住载体线程（pinning），换 ReentrantLock 并监控"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：深水区六连问——@Configuration 代理开关、自调用失效、作用域陷阱、循环依赖根治、定时任务集群防重、Boot3 升级雷区；答题用'结论→机制→案例→解法'四步结构，把扩展点按启动时间线串起来，整套知识就闭环了。"
   }
  ]
 }
]
};
