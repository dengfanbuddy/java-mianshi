window.TB = window.TB || {};
window.TB["java-basic"] = {
  id: "java-basic",
  name: "Java 基础",
  icon: "☕",
  nodes: [
 {
  "id": "java-basic-runtime-oop",
  "title": "Java 运行机制与面向对象",
  "layer": 0,
  "depends": [],
  "covers": [
   "java-basic-09",
   "java-basic-23",
   "java-basic-30"
  ],
  "quiz": [
   "java-basic-23",
   "java-basic-30",
   "java-basic-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Java 程序从源码到运行要经过哪些环节？类、接口、抽象类、继承多态、内部类与枚举在游戏服务器建模里分别扮演什么角色？本文把 Java 的运行机制与面向对象四大支柱一次讲透。"
   },
   {
    "t": "pre",
    "items": [
     "能看懂最基本的 Java 代码（变量、方法、类）",
     "不需要任何框架知识，纯语言基础"
    ]
   },
   {
    "t": "h",
    "text": "运行机制：一次编译，到处运行"
   },
   {
    "t": "p",
    "text": "Java 不是直接编译成机器码，而是先由 javac 把 .java 源码编译成与平台无关的字节码（.class 文件），再由 JVM 解释执行或 JIT 编译成本地机器码。字节码是 JVM 的「通用语言」，任何平台只要装了对应版本的 JVM，就能运行同一份 .class，这就是跨平台的根本原因。对于游戏服务器来说，这意味着同一套游戏逻辑代码可以部署在 Windows 开发机、Linux 生产机、海外服务器上，无需为平台差异改代码。"
   },
   {
    "t": "list",
    "items": [
     "源码阶段：编写 .java 文件，语法检查与类型检查都在这里完成",
     "编译阶段：javac 产出 .class 字节码文件（含常量池、方法表、泛型签名等）",
     "加载阶段：类加载器（Bootstrap/Ext/App）按双亲委派模型把类加载进方法区",
     "执行阶段：解释器逐条翻译，热点代码被 JIT（C1/C2）编译为机器码；Graal 等 AOT 可提前编译"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 一行命令走完「编译 + 运行」两个阶段\n// 编译：javac Player.java -> Player.class\n// 运行：java Player（自动查找并加载 main 方法所在类）\npublic class Player {\n    private long playerId;\n    private String name;\n\n    public Player(long playerId, String name) {\n        this.playerId = playerId;\n        this.name = name;\n    }\n\n    public static void main(String[] args) {\n        Player p = new Player(10001L, \"阿凡\");\n        System.out.println(p); // 默认走 toString\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"20\" y=\"20\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"85\" y=\"50\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">源码</text>\n  <text x=\"85\" y=\"70\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Player.java</text>\n  <text x=\"155\" y=\"58\" font-size=\"20\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"175\" y=\"20\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"240\" y=\"50\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">字节码</text>\n  <text x=\"240\" y=\"70\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Player.class</text>\n  <text x=\"310\" y=\"58\" font-size=\"20\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"330\" y=\"20\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/>\n  <text x=\"395\" y=\"50\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">JVM 解释执行</text>\n  <text x=\"395\" y=\"70\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">+ JIT 热点编译</text>\n  <text x=\"465\" y=\"58\" font-size=\"20\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"485\" y=\"20\" width=\"135\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"552\" y=\"50\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">机器码</text>\n  <text x=\"552\" y=\"70\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Win/Linux/Mac</text>\n  <line x1=\"40\" y1=\"130\" x2=\"600\" y2=\"130\" stroke=\"var(--line)\" stroke-dasharray=\"4 4\"/>\n  <rect x=\"20\" y=\"150\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"110\" y=\"177\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">编译期（javac）</text>\n  <text x=\"110\" y=\"197\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">类型检查/泛型擦除/语法糖</text>\n  <rect x=\"230\" y=\"150\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"177\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">类加载期</text>\n  <text x=\"320\" y=\"197\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">双亲委派/验证/准备</text>\n  <rect x=\"440\" y=\"150\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"530\" y=\"177\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">运行期</text>\n  <text x=\"530\" y=\"197\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">解释执行 + C1/C2 JIT</text>\n  <rect x=\"140\" y=\"240\" width=\"360\" height=\"50\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"320\" y=\"263\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">游戏服部署：同一份 jar 包</text>\n  <text x=\"320\" y=\"281\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Windows 开发 → Linux 测试 → 海外生产，零改动</text>\n</svg>",
    "caption": "图 1：Java 编译-加载-执行全链路，字节码是跨平台的根基"
   },
   {
    "t": "h",
    "text": "类、对象与访问修饰符"
   },
   {
    "t": "p",
    "text": "类是对象的模板，对象是类的实例。游戏服务器里最典型的建模就是「配置类描述数据、运行时对象承载状态」：玩家等级、背包、Buff 都是对象，而它们的「结构说明书」是类。访问修饰符控制可见性，是封装的核心工具：public 任何地方可访问；protected 同包或子类；default（不写）仅同包；private 仅本类。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public class Player {              // public 类：任何包都能引用\n    private long playerId;          // 对外只暴露 getter，防止外部乱改主键\n    private String name;\n    protected int level;            // 子类（如 NpcPlayer）可直接访问\n    long lastLoginTime;             // 默认包内可见，GM 工具与业务类同包\n\n    public long getPlayerId() { return playerId; }\n    // 只读字段不提供 setter，配合不可变设计防止并发下被篡改\n}"
   },
   {
    "t": "h",
    "text": "继承、多态与抽象类/接口"
   },
   {
    "t": "p",
    "text": "继承表达 is-a 关系，多态让「同一个接口、不同实现」在运行时表现出不同行为。游戏服中多态无处不在：一个 List<Buff> 里装着各种 Buff 子类，调用 buff.tick() 时各自执行自己的逻辑，这就是多态。抽象类和接口的选择是高频面试点：抽象类可以有构造器、字段和部分实现，适合「模板方法」；接口强调能力契约，适合「可插拔实现」。JDK8 起接口支持 default 和 static 方法，两者边界进一步模糊。"
   },
   {
    "t": "table",
    "head": [
     "对比项",
     "抽象类",
     "接口"
    ],
    "rows": [
     [
      "关键词",
      "abstract class",
      "interface / @interface"
     ],
     [
      "构造器",
      "可以有",
      "不能有"
     ],
     [
      "字段",
      "任意字段",
      "public static final 常量（JDK8 起也可 private）"
     ],
     [
      "实现",
      "可含部分具体方法",
      "全抽象（default/static 方法可有实现）"
     ],
     [
      "继承",
      "单继承",
      "多实现"
     ],
     [
      "游戏服用途",
      "模板方法（如 BaseHandler）",
      "能力契约（如 IReward、IPersistence）"
     ]
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 接口：定义「能发奖励」的能力契约\npublic interface IReward {\n    void deliver(long playerId);      // 实现方决定怎么发\n}\n// 抽象类：模板方法——登录流程骨架固定，细节由子类填充\npublic abstract class BaseLoginHandler {\n    public final void handle(long playerId) {   // 模板方法：final 防重写\n        validate(playerId);                     // 子类提供校验\n        loadPlayer(playerId);\n        onLogin(playerId);\n    }\n    protected abstract void validate(long playerId);\n    protected abstract void loadPlayer(long playerId);\n    protected void onLogin(long playerId) { /* 默认空实现 */ }\n}"
   },
   {
    "t": "h",
    "text": "内部类与枚举"
   },
   {
    "t": "p",
    "text": "内部类分四种：成员内部类、静态内部类、局部内部类、匿名内部类。除静态内部类外，其余都隐式持有外部类 this$0 引用——这是游戏服内存泄漏的高发源头（Netty handler 写成非静态内部类会连带泄漏外部对象）。枚举是类型安全的状态常量，游戏服用枚举表达玩家状态机（在线/战斗/离线）、Buff 类型、协议错误码，比裸 int 常量安全得多。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 枚举：玩家状态机，比 int 常量更安全\npublic enum PlayerState {\n    ONLINE, IN_BATTLE, OFFLINE;\n\n    public boolean canEnterBattle() {\n        return this == ONLINE;      // 只有在线才能进战斗\n    }\n}\n// 静态内部类：不持有外部引用，天然防泄漏，适合做 Holder\npublic class GameServer {\n    private static class Holder {   // 延迟加载单例：类加载时线程安全\n        static final GameServer INSTANCE = new GameServer();\n    }\n    public static GameServer getInstance() { return Holder.INSTANCE; }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"40\" y=\"20\" width=\"560\" height=\"55\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"52\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">面向对象四大特性在游戏服中的落点</text>\n  <rect x=\"40\" y=\"100\" width=\"260\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"170\" y=\"128\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">封装</text>\n  <text x=\"170\" y=\"152\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">private 字段 + getter，保护玩家数据</text>\n  <rect x=\"340\" y=\"100\" width=\"260\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"470\" y=\"128\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">继承</text>\n  <text x=\"470\" y=\"152\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Player / NpcPlayer 复用公共字段</text>\n  <rect x=\"40\" y=\"205\" width=\"260\" height=\"80\" rx=\"8\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/>\n  <text x=\"170\" y=\"233\" font-size=\"15\" fill=\"var(--panel)\" text-anchor=\"middle\">多态</text>\n  <text x=\"170\" y=\"257\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">List&lt;Buff&gt; 各子类 tick() 各执行各的</text>\n  <rect x=\"340\" y=\"205\" width=\"260\" height=\"80\" rx=\"8\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/>\n  <text x=\"470\" y=\"233\" font-size=\"15\" fill=\"var(--panel)\" text-anchor=\"middle\">抽象</text>\n  <text x=\"470\" y=\"257\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">IReward/BaseLoginHandler 能力契约</text>\n</svg>",
    "caption": "图 2：OOP 四大特性对应到游戏服务器的建模实践"
   },
   {
    "t": "pits",
    "items": [
     "「Java 是编译型还是解释型」答单边都扣分：字节码先解释执行、热点 JIT 编译，两者共存",
     "访问修饰符的默认值是「同包可见」（default），不是 public——new 对象跨包调方法报错先查这里",
     "接口不能有实例字段（常量除外），把字段塞进接口是典型反模式",
     "非静态内部类/匿名类隐式持有外部引用，Netty handler、定时任务里是泄漏高发源",
     "成员内部类和静态内部类差一个 static 关键字，内存语义天差地别"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Java 的运行机制是「源码→字节码→JVM 执行」三段式，跨平台靠字节码 + 各平台 JVM。面向对象四特性在游戏服中分别对应：封装保护玩家数据、继承复用实体字段、多态实现 Buff/技能差异化逻辑、抽象定义能力契约与模板方法。写业务时优先「组合优于继承」，能用接口契约就不要深继承。"
   }
  ]
 },
 {
  "id": "java-basic-data-types",
  "title": "数据类型与包装类",
  "layer": 0,
  "depends": [],
  "covers": [
   "java-basic-25",
   "java-basic-26",
   "java-basic-02",
   "java-basic-08"
  ],
  "quiz": [
   "java-basic-25",
   "java-basic-26",
   "java-basic-02"
  ],
  "body": [
   {
    "t": "lead",
    "text": "8 种基本类型怎么选？自动装箱拆箱的底层是什么？Integer 缓存范围多大？== 和 equals 怎么用？BigDecimal 为什么是金额计算的唯一正确解？本文把数据类型的每个坑都填平。"
   },
   {
    "t": "pre",
    "items": [
     "掌握变量声明与赋值",
     "了解方法调用的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "基本类型八兄弟：大小与默认值"
   },
   {
    "t": "p",
    "text": "Java 有 8 种基本类型，全部存在栈帧的局部变量区或堆对象头里（无对象头开销），赋值即拷贝值。游戏服务器里玩家 ID、战力、伤害全部用基本类型，因为包装类会引入对象开销与 GC 压力。char 是 16 位无符号，可表示 UTF-16 编码单元，BMP 内的常用汉字一个 char 即可存下。"
   },
   {
    "t": "table",
    "head": [
     "类型",
     "位宽",
     "默认值",
     "范围（示例）",
     "游戏服典型用途"
    ],
    "rows": [
     [
      "byte",
      "8",
      "0",
      "-128 ~ 127",
      "协议字段号、状态枚举"
     ],
     [
      "short",
      "16",
      "0",
      "-32768 ~ 32767",
      "小整数配置、CD 秒数"
     ],
     [
      "int",
      "32",
      "0",
      "±21 亿",
      "玩家等级、金币、伤害"
     ],
     [
      "long",
      "64",
      "0L",
      "±9.2×10^18",
      "玩家 ID、时间戳、流水号"
     ],
     [
      "float",
      "32",
      "0.0f",
      "±3.4×10^38",
      "少数非精确场景"
     ],
     [
      "double",
      "64",
      "0.0d",
      "±1.8×10^308",
      "战力等宽量级计算"
     ],
     [
      "char",
      "16",
      "'\\u0000'",
      "0 ~ 65535",
      "单字符、协议字符"
     ],
     [
      "boolean",
      "不定",
      "false",
      "true/false",
      "开关、状态位"
     ]
    ]
   },
   {
    "t": "h",
    "text": "自动装箱拆箱与 Integer 缓存池"
   },
   {
    "t": "p",
    "text": "装箱 = 编译器自动把 int 转成 Integer.valueOf(int)，拆箱 = 自动调 intValue()。Integer.valueOf 命中缓存 [-128, 127]（默认，已验证）时返回缓存里的同一个对象，范围外 new 新对象；缓存上限可用 -XX:AutoBoxCacheMax 调大，下限 -128 由 JLS 规范固定。Byte/Short/Character(0-127)/Long 同范围缓存，Boolean 缓存 true/false，Float/Double 无缓存。这是 == 比较包装类时「127 相等、128 不相等」的根源。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "Integer a = 127;   // 底层 Integer.valueOf(127) -> 命中缓存\nInteger b = 127;   // 同一个缓存对象\nSystem.out.println(a == b);        // true（引用相同）\nInteger c = 128;\nInteger d = 128;   // 超出缓存，各自 new\nSystem.out.println(c == d);        // false（引用不同，比的是地址）\n// 黄金法则：包装类比大小一律用 equals 或拆箱成基本类型\nSystem.out.println(c.equals(d));   // true（比数值）"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"30\" width=\"200\" height=\"170\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"130\" y=\"60\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">IntegerCache 数组</text>\n  <line x1=\"60\" y1=\"75\" x2=\"200\" y2=\"75\" stroke=\"var(--line)\"/>\n  <rect x=\"60\" y=\"88\" width=\"80\" height=\"34\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"100\" y=\"110\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">index 0 (-128)</text>\n  <rect x=\"145\" y=\"88\" width=\"80\" height=\"34\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"185\" y=\"110\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">… 127 …</text>\n  <rect x=\"60\" y=\"128\" width=\"80\" height=\"34\" rx=\"6\" fill=\"var(--lv2)\"/>\n  <text x=\"100\" y=\"150\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">127 缓存命中</text>\n  <rect x=\"145\" y=\"128\" width=\"80\" height=\"34\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"185\" y=\"150\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">>127 无缓存</text>\n  <text x=\"130\" y=\"185\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">上限 -XX:AutoBoxCacheMax 可调</text>\n  <rect x=\"300\" y=\"40\" width=\"300\" height=\"170\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"450\" y=\"70\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">游戏服高频翻车点</text>\n  <line x1=\"330\" y1=\"82\" x2=\"570\" y2=\"82\" stroke=\"var(--accent)\"/>\n  <text x=\"450\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">1. 玩家等级/金币用 == 比较包装类 → 翻车</text>\n  <text x=\"450\" y=\"134\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">2. Map.get() 返回 null 拆箱赋给 int → NPE</text>\n  <text x=\"450\" y=\"160\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">3. 热循环里 List&lt;Integer&gt; 频繁装箱 → GC 压力</text>\n  <text x=\"450\" y=\"186\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">4. long 玩家 ID 与 int 混用 → 精度丢失</text>\n</svg>",
    "caption": "图 3：Integer 缓存池边界与游戏服四大高频坑"
   },
   {
    "t": "h",
    "text": "equals 与 hashCode 的契约"
   },
   {
    "t": "p",
    "text": "Object 的 equals 默认就是 ==（比引用），hashCode 默认与内存地址相关。String 等类重写了 equals 比内容。契约核心一句：equals 相等则 hashCode 必须相等（反向不成立）。只重写 equals 不重写 hashCode，放进 HashMap/HashSet 时逻辑相等的对象被分到不同桶，get/contains 找不到、Set 里出现重复元素。游戏服的玩家 ID 包装类、道具唯一 ID 作为 Map key 时必须两个一起重写。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public class ItemKey {\n    private final long itemUid;\n    private final int slot;\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof ItemKey)) return false;\n        ItemKey k = (ItemKey) o;\n        return itemUid == k.itemUid && slot == k.slot;\n    }\n    @Override\n    public int hashCode() {\n        return 31 * (int) (itemUid ^ (itemUid >>> 32)) + slot;\n    }\n}"
   },
   {
    "t": "h",
    "text": "BigDecimal：金额计算的唯一正确解"
   },
   {
    "t": "p",
    "text": "double/float 是二进制浮点，无法精确表示 0.1 这类十进制小数（0.1 在二进制下是无限循环），累加必然产生误差。涉及钱必须用 BigDecimal 或 long 存最小单位。BigDecimal 三大坑：new BigDecimal(0.1) 会把 double 误差原样带入，必须 new BigDecimal(\"0.1\")；equals 连 scale 一起比较（1.0 不等于 1.00），比大小用 compareTo；divide 不指定舍入模式除不尽时抛 ArithmeticException。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 支付服金额处理规范写法\nBigDecimal fee = new BigDecimal(\"0.1\");          // 必须字符串构造\nBigDecimal amount = BigDecimal.valueOf(100);       // 或 valueOf（内部走 toString）\nBigDecimal result = amount.multiply(fee)\n        .setScale(2, RoundingMode.HALF_UP);        // 统一保留 2 位四舍五入\n// 比较一律 compareTo：equals 会因 scale 不同返回 false\nif (result.compareTo(BigDecimal.ZERO) > 0) { /* 有效金额 */ }"
   },
   {
    "t": "pits",
    "items": [
     "int 溢出是静默的：a - b 在比较/排序里可能翻车，用 Integer.compare(a,b)",
     "Map<Long,Integer> 取值直接赋 int 变量：null 拆箱必 NPE，且堆栈极其迷惑",
     "new BigDecimal(0.1) 是经典错误，99% 的精度事故源于此",
     "BigDecimal.equals 连 scale 一起比，1.0 和 1.00 不相等",
     "float/double 与基本类型混合 == 时，包装类会先拆箱再比较，行为不同"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：基本类型八兄弟按位宽与用途选型，玩家 ID/时间戳用 long，小状态用 byte/short，伤害金币用 int。包装类比大小永远 equals，Integer 缓存 -128~127（上限可调），Long 玩家 ID 同理。equals/hashCode 必须成对重写。金额一律 BigDecimal + 字符串构造 + compareTo 比较。热路径避免频繁装箱。"
   }
  ]
 },
 {
  "id": "java-basic-string",
  "title": "字符串全解",
  "layer": 1,
  "depends": [
   "java-basic-runtime-oop",
   "java-basic-data-types"
  ],
  "covers": [
   "java-basic-03",
   "java-basic-08",
   "java-basic-28"
  ],
  "quiz": [
   "java-basic-03",
   "java-basic-28",
   "java-basic-08"
  ],
  "body": [
   {
    "t": "lead",
    "text": "String 为什么不可变？常量池和 intern 是怎么运作的？StringBuilder/StringBuffer 怎么选？JDK9 的字符串底层发生了什么变化？字符串拼接在不同 JDK 下怎么优化？这是 Java 基础里最常考、也最容易翻车的一块。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 == 与 equals 的区别",
     "了解常量与变量在编译期的差异"
    ]
   },
   {
    "t": "h",
    "text": "String 不可变的设计与收益"
   },
   {
    "t": "p",
    "text": "String 内部持有 final 的字符数组（JDK8 是 char[]，JDK9 起改为 byte[] + coder 标志，即 Compact Strings），且数组不对外暴露，任何「修改」都返回新对象。不可变带来四大收益：线程安全（游戏服里玩家名字被多线程共享零成本）、支持常量池复用、hashCode 可缓存（String 作为 HashMap key 的重磅优势）、安全（类名/URL/密码传参后不会被篡改）。代价是频繁拼接产生大量临时对象，所以循环拼接必须用 StringBuilder。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "String s1 = \"abc\";           // 字面量 -> 常量池（若已存在则复用）\nString s2 = \"abc\";           // 同一常量池对象\nSystem.out.println(s1 == s2); // true\nString s3 = new String(\"abc\"); // 堆上新对象\nSystem.out.println(s1 == s3); // false（== 比引用）\nSystem.out.println(s1.equals(s3)); // true（String 重写了 equals 比内容）\nString s4 = s3.intern();      // 入池并返回池中引用\nSystem.out.println(s1 == s4); // true"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"40\" y=\"30\" width=\"250\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"165\" y=\"58\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">字符串常量池（JDK7 起在堆）</text>\n  <line x1=\"70\" y1=\"70\" x2=\"260\" y2=\"70\" stroke=\"var(--line)\"/>\n  <rect x=\"70\" y=\"82\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"115\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">\"abc\"</text>\n  <text x=\"185\" y=\"105\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">… 其他字面量</text>\n  <line x1=\"290\" y1=\"80\" x2=\"330\" y2=\"80\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"310\" y=\"68\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">引用</text>\n  <rect x=\"330\" y=\"40\" width=\"270\" height=\"100\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"465\" y=\"68\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">堆：s3 = new String(\"abc\")</text>\n  <line x1=\"360\" y1=\"80\" x2=\"570\" y2=\"80\" stroke=\"var(--line)\"/>\n  <text x=\"465\" y=\"103\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">新对象，与常量池不是同一地址</text>\n  <text x=\"465\" y=\"125\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">s1 == s3 ? false；equals ? true</text>\n  <rect x=\"40\" y=\"170\" width=\"560\" height=\"100\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"320\" y=\"198\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">StringBuilder vs StringBuffer vs String</text>\n  <text x=\"320\" y=\"224\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">String 不可变/天然安全；StringBuilder 可变/最快/单线程首选；</text>\n  <text x=\"320\" y=\"246\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">StringBuffer 方法级 synchronized/线程安全但慢，共享拼接才用</text>\n</svg>",
    "caption": "图 4：常量池与堆对象的内存关系，及三者的取舍"
   },
   {
    "t": "h",
    "text": "字符串拼接的编译期与运行期优化"
   },
   {
    "t": "p",
    "text": "纯字面量拼接 \"a\"+\"b\" 在编译期直接折叠为 \"ab\"（常量池同一对象）；含变量的拼接，JDK8 编译成 StringBuilder.append 链，JDK9 起改为 invokedynamic + StringConcatFactory，运行时才决定最优拼接策略（可精确计算长度一次性分配 byte[]，配合 Compact Strings 更省内存）。循环里用 + 每次 new 一个 StringBuilder，必须循环外显式声明并给足初始容量。日志服实践：先判级别再用 SLF4J 占位符，避免无谓拼接。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 错误示范：循环内用 + 拼接，产生大量 StringBuilder 临时对象\nString log = \"\";\nfor (Player p : onlinePlayers) {\n    log += p.getName();        // 每次循环 new 一个 StringBuilder\n}\n// 正确示范：显式 StringBuilder + 预分配容量\nStringBuilder sb = new StringBuilder(onlinePlayers.size() * 16);\nfor (Player p : onlinePlayers) {\n    sb.append(p.getName());\n}\nString result = sb.toString();\n// 日志：先判级别，用占位符延迟拼接\nif (logger.isDebugEnabled()) {\n    logger.debug(\"player {} login, cost {} ms\", playerId, cost);\n}"
   },
   {
    "t": "h",
    "text": "高频工具方法与易错细节"
   },
   {
    "t": "p",
    "text": "字符串在协议解析中地位极高：定长字符串截断、昵称长度校验、JSON 拼接都依赖 String 方法。注意三个细节：length() 返回 UTF-16 code unit 数（emoji 占 2），真字符数用 codePointCount()；substring 可能因字符集问题截出乱码；getBytes() 不指定编码就按平台默认（Windows GBK / Linux UTF-8），跨环境必须显式 StandardCharsets.UTF_8。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 昵称长度校验：按码点数而非 char 数\nint cpCount = nick.codePointCount(0, nick.length());  // 含 emoji 也正确\n// 协议字节长度：按 UTF-8 字节数（中文 3 字节）\nint byteLen = nick.getBytes(StandardCharsets.UTF_8).length;\n// 截断避免半字符：用 offsetByCodePoints 找码点边界\nint end = nick.offsetByCodePoints(0, maxChars);\nString safe = nick.substring(0, end);"
   },
   {
    "t": "pits",
    "items": [
     "new String(\"abc\") 实际创建 1~2 个对象：常量池没有时先建池对象，再在堆建一个",
     "常量池位置演变：JDK6 在永久代，JDK7 移到堆，JDK8 永久代被元空间取代、池仍在堆",
     "a == b 在包装类/字符串场景语义完全不同，混用必翻车",
     "JDK9 起 String 底层是 byte[] + coder 而非 char[]，别再答 char[]",
     "intern() 用多了会撑大常量池，JDK7+ 池可被 GC，但仍要慎用"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：String 不可变带来线程安全/常量池/hash 缓存/安全四大收益；字面量在常量池、new 在堆，intern 可入池。拼接上纯字面量编译期折叠、含变量 JDK8 走 StringBuilder、JDK9 走 StringConcatFactory，循环拼接必须显式 StringBuilder。length() 数 char、字节数看编码、真字符数 codePointCount，三个长度各说各话。"
   }
  ]
 },
 {
  "id": "java-basic-collections",
  "title": "集合框架全景",
  "layer": 1,
  "depends": [
   "java-basic-data-types"
  ],
  "covers": [
   "java-basic-01",
   "java-basic-04",
   "java-basic-11",
   "java-basic-29",
   "java-basic-37"
  ],
  "quiz": [
   "java-basic-01",
   "java-basic-04",
   "java-basic-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "List/Set/Queue/Map 四大体系怎么选？HashMap 的底层与 put 全流程、树化阈值为什么是 8 和 64？fail-fast/fail-safe 是什么？本文把集合框架从选型到源码级原理一次讲清。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 equals/hashCode 契约",
     "了解泛型基本语法"
    ]
   },
   {
    "t": "h",
    "text": "四大体系与常用实现选型"
   },
   {
    "t": "p",
    "text": "List 有序可重复，Set 不可重复，Queue 排队，Map 键值对。游戏服选型口诀：随机访问用 ArrayList，头插/中间插频繁用 LinkedList，去重用 HashSet/LinkedHashSet，带大小顺序用 TreeSet/TreeMap，要 LRU 用 LinkedHashMap(accessOrder)，并发共享用 ConcurrentHashMap/CopyOnWriteArrayList。"
   },
   {
    "t": "table",
    "head": [
     "体系",
     "常用实现",
     "底层",
     "有序性",
     "线程安全",
     "游戏服用途"
    ],
    "rows": [
     [
      "List",
      "ArrayList",
      "Object 数组",
      "插入序",
      "否",
      "排行榜列表、在线玩家快照"
     ],
     [
      "List",
      "LinkedList",
      "双向链表",
      "插入序",
      "否",
      "滚动日志队列（低频）"
     ],
     [
      "Set",
      "HashSet",
      "HashMap 壳",
      "无序",
      "否",
      "去重：已领奖玩家"
     ],
     [
      "Set",
      "TreeSet",
      "红黑树",
      "按比较器",
      "否",
      "按时间排序的跨服战报"
     ],
     [
      "Queue",
      "ArrayDeque",
      "环形数组",
      "FIFO",
      "否",
      "事件处理队列"
     ],
     [
      "Map",
      "HashMap",
      "数组+链表+红黑树",
      "无序",
      "否",
      "配置表、玩家数据缓存（单线程）"
     ],
     [
      "Map",
      "LinkedHashMap",
      "HashMap+双向链表",
      "插入/访问序",
      "否",
      "最近会话缓存（LRU）"
     ],
     [
      "Map",
      "ConcurrentHashMap",
      "数组+链表+红黑树",
      "无序",
      "是",
      "在线玩家表、房间表"
     ]
    ]
   },
   {
    "t": "h",
    "text": "HashMap 底层结构与 put 全流程"
   },
   {
    "t": "p",
    "text": "JDK8 的 HashMap = 数组 + 链表 + 红黑树。默认容量 16、负载因子 0.75。put 流程五步：先对 hashCode 做扰动（h = key.hashCode() ^ (h>>>16)）让高位参与运算；再用 (n-1)&hash 定位桶位（容量是 2 的幂时等价取模且更快）；桶空直接插入；非空遍历链表（或树），key 相同（equals）覆盖 value，否则尾插；链表长度达 8 且数组 >= 64 时树化为红黑树（不足 64 则优先扩容）；元素超过 capacity*loadFactor 扩容为 2 倍，JDK8 用高低位拆分迁移，无需重新 hash。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 扰动函数 + 定位（源码逻辑）\nstatic final int hash(Object key) {\n    int h;\n    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);\n}\n// 定位：index = (n - 1) & hash\n// 树化判断：binCount >= 7 时（即链表第 8 个节点）调 treeifyBin，\n// treeifyBin 内再判断 table.length < 64 则先 resize 扩容，否则链表转红黑树\n// 游戏服：配置表用 HashMap<Long, Config>，注意给足初始容量避免频繁扩容\nMap<Long, ItemConfig> config = new HashMap<>(expectedSize * 2);"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"20\" width=\"120\" height=\"45\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"90\" y=\"47\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">table 数组</text>\n  <rect x=\"30\" y=\"75\" width=\"120\" height=\"30\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"90\" y=\"95\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">桶 0</text>\n  <rect x=\"30\" y=\"115\" width=\"120\" height=\"30\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"90\" y=\"135\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">桶 1</text>\n  <rect x=\"30\" y=\"155\" width=\"120\" height=\"30\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"90\" y=\"175\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">桶 2</text>\n  <text x=\"90\" y=\"210\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">…</text>\n  <line x1=\"150\" y1=\"130\" x2=\"200\" y2=\"130\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <rect x=\"200\" y=\"105\" width=\"95\" height=\"50\" rx=\"6\" fill=\"var(--lv2)\"/>\n  <text x=\"247\" y=\"125\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">Node</text>\n  <text x=\"247\" y=\"143\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">key hash value</text>\n  <line x1=\"295\" y1=\"130\" x2=\"335\" y2=\"130\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <rect x=\"335\" y=\"105\" width=\"95\" height=\"50\" rx=\"6\" fill=\"var(--lv2)\"/>\n  <text x=\"382\" y=\"125\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">Node</text>\n  <text x=\"382\" y=\"143\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">链表尾插</text>\n  <text x=\"247\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">链表长达 8 且数组>=64 时</text>\n  <text x=\"247\" y=\"198\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">树化为红黑树 O(log n)</text>\n  <rect x=\"200\" y=\"230\" width=\"300\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"350\" y=\"255\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">扩容：容量>cap*0.75 时翻倍</text>\n  <text x=\"350\" y=\"277\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">JDK8 高低位拆分，新位 = 原位 或 原位+oldCap</text>\n  <text x=\"350\" y=\"297\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">树化阈值 8 来自泊松分布，正常哈希几乎到不了</text>\n</svg>",
    "caption": "图 5：HashMap 的数组+链表+红黑树结构与扩容迁移"
   },
   {
    "t": "h",
    "text": "fail-fast / fail-safe 与迭代器"
   },
   {
    "t": "p",
    "text": "fail-fast：集合维护 modCount，迭代器创建时记录 expectedModCount，next() 校验不一致就抛 ConcurrentModificationException。它不是线程安全保证，只是尽力而为的 bug 探测器。迭代中删除必须用迭代器的 remove()。fail-safe（弱一致）：CopyOnWriteArrayList 迭代基于快照、ConcurrentHashMap 迭代器是弱一致视图，迭代中修改不抛异常但可能读旧值。游戏服广播遍历在线玩家时，收编到单线程或快照拷贝是正解。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 错误：增强 for 里直接 list.remove() 抛 CME\nfor (Player p : list) {\n    if (p.isOffline()) list.remove(p);   // ConcurrentModificationException\n}\n// 正确：迭代器 remove\nIterator<Player> it = list.iterator();\nwhile (it.hasNext()) {\n    Player p = it.next();\n    if (p.isOffline()) it.remove();\n}\n// 更优雅：JDK8 起直接 removeIf\nlist.removeIf(Player::isOffline);\n// 广播场景：先拷快照再遍历，避免并发修改\nfor (Player p : new ArrayList<>(onlinePlayers.values())) { p.send(pkt); }"
   },
   {
    "t": "h",
    "text": "LinkedHashMap 实现 LRU 缓存"
   },
   {
    "t": "p",
    "text": "LinkedHashMap 在 HashMap 基础上加双向链表维护顺序，构造传 accessOrder=true 时每次 get/put 都把节点移到链表尾部，重写 removeEldestEntry 返回 true 即可在插入后自动淘汰最久未用的头部——十几行实现一个 LRU。游戏服适合做「最近会话缓存」「协议反射句柄缓存」。坑：线程不安全，accessOrder 模式下 get 也算结构性修改（读也是写），遍历中 get 可能 CME。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "Map<Long, String> recentChat = new LinkedHashMap<Long, String>(16, 0.75f, true) {\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Long, String> eldest) {\n        return size() > 20;   // 最多保留 20 个最近会话\n    }\n};\n// 需求变重（过期时间、命中率）再上 Caffeine：LRU 只是其中一种策略"
   },
   {
    "t": "pits",
    "items": [
     "HashMap 线程不安全：JDK7 头插法并发扩容成环死循环，JDK8 尾插法仍有丢数据、size 不准",
     "树化条件两个都要满足：链表 >= 8 且数组 >= 64，缺一个都不树化",
     "ArrayList 扩容 1.5 倍整体拷贝，大量已知数量要预分配容量",
     "List<String> 与 List<Integer> 运行时是同一个 class（泛型擦除，见泛型篇）",
     "TreeSet/TreeMap 判重用比较结果而非 equals，compare 返回 0 就视为重复"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：集合选型看四个维度——有序性、去重、并发、底层复杂度。HashMap 掌握扰动函数、位运算定位、树化（8+64）、扩容（2 倍+高低位拆分）四条主线。迭代修改用迭代器 remove 或 removeIf，并发遍历要么快照要么弱一致容器。线程安全场景用 ConcurrentHashMap 而不是在 HashMap 上加 synchronized。"
   }
  ]
 },
 {
  "id": "java-basic-generics",
  "title": "泛型机制与类型擦除",
  "layer": 1,
  "depends": [
   "java-basic-runtime-oop",
   "java-basic-data-types"
  ],
  "covers": [
   "java-basic-12",
   "java-basic-06"
  ],
  "quiz": [
   "java-basic-12",
   "java-basic-27",
   "java-basic-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "泛型在编译期做了什么？类型擦除后信息真的丢了吗？桥方法是什么？<? extends T> 和 <? super T> 怎么用？为什么 TypeReference 能拿到元素类型？本文把泛型从语法到字节码一次讲透。"
   },
   {
    "t": "pre",
    "items": [
     "掌握继承与多态",
     "了解 List/Map 的基本使用"
    ]
   },
   {
    "t": "h",
    "text": "泛型是编译期语法糖，运行时要卸妆"
   },
   {
    "t": "p",
    "text": "Java 泛型不是 C++ 模板，编译后泛型参数会被擦除为边界类型：无界 T 擦成 Object，<T extends Number> 擦成 Number。运行时 List<String> 和 List<Integer> 是同一个 ArrayList.class。擦除带来三大后果：不能 new T()、不能 new T[]、不能 instanceof List<String>（只能 instanceof List<?>）；重载 foo(List<String>) 和 foo(List<Integer>) 编译冲突；编译器自动生成桥接方法（bridge method）保证多态正确性。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public class Box<T> {\n    private T value;\n    public void set(T v) { this.value = v; }\n    public T get() { return value; }\n}\n// 擦除后（等价于）：\n// public class Box { private Object value; ... }\n// List<String> 和 List<Integer> 运行时都是 ArrayList.class\n// 反证：List<String> list = new ArrayList<>();\n//       list instanceof List   // 合法\n//       list instanceof List<String>  // 编译错误！\n// 不能 new T()：T 在运行时不存在\n// public <T> T create() { return new T(); }  // 编译错误"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"40\" y=\"25\" width=\"260\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"170\" y=\"50\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">编译期：泛型参数生效</text>\n  <text x=\"170\" y=\"72\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">类型检查 / 自动强转</text>\n  <text x=\"305\" y=\"58\" font-size=\"20\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"340\" y=\"25\" width=\"260\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"470\" y=\"50\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">运行时：擦除为边界类型</text>\n  <text x=\"470\" y=\"72\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Object / Number / 桥方法</text>\n  <rect x=\"40\" y=\"110\" width=\"560\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"320\" y=\"138\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">泛型信息并非全丢：Signature 属性保留签名</text>\n  <text x=\"320\" y=\"162\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">反射 getGenericParameterTypes / getGenericSuperclass 可拿到</text>\n  <rect x=\"40\" y=\"200\" width=\"560\" height=\"75\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"226\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">这就是 Jackson/Gson TypeReference 的原理</text>\n  <text x=\"320\" y=\"250\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">new TypeReference&lt;List&lt;Player&gt;&gt;(){} 匿名子类把实参写进父类签名</text>\n</svg>",
    "caption": "图 6：泛型擦除与 Signature 保留签名，TypeReference 原理"
   },
   {
    "t": "h",
    "text": "泛型方法、通配符与 PECS 原则"
   },
   {
    "t": "p",
    "text": "泛型方法在方法返回类型前声明类型参数：public static <T> List<T> emptyList()。通配符有三种：<?> 无界通配，<? extends T> 上界（读安全），<? super T> 下界（写安全）。PECS 原则（Producer Extends, Consumer Super）：只读的生产者用 extends，只写的消费者用 super。游戏背包例子：背包存入是消费者 List<? super Item> 可 add；掉落产出是生产者 List<? extends Item> 只能取出当 Item 用。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 泛型方法：把协议对象转成 JSON 字符串（只读，生产者）\npublic static <T> String toJson(List<? extends Serializable> items) {\n    // items 里只读 T，不能 add —— 上界通配符只读\n    return items.stream().map(String::valueOf).collect(Collectors.joining());\n}\n// PECS 例子：背包批量加入（消费者，下界）\npublic static void addItems(List<? super Item> bag, Item... items) {\n    for (Item i : items) bag.add(i);   // 下界通配符可写\n}\n// 生产消费对比：\n// List<? extends Item> loot 只能取出当 Item，不能 add（除了 null）\n// List<? super Item> bag 可以 add Item 及子类"
   },
   {
    "t": "h",
    "text": "泛型在框架与游戏工具中的实战"
   },
   {
    "t": "p",
    "text": "泛型 + 反射是 Spring IOC、MyBatis Mapper、MyBatis-Plus、协议生成工具的底座。MyBatis-Plus 的 BaseMapper<T> 靠反射读泛型签名确定实体类型；我们的导表工具生成实体类后用泛型集合承接配置。注意运行时泛型被擦除，所以「根据泛型拿到类型」只能靠签名，且必须通过子类化/匿名类把类型参数固化。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// MyBatis-Plus 泛型基建：框架反射读泛型签名\npublic interface UserMapper extends BaseMapper<User> {\n    // 框架通过 getGenericInterfaces 拿到 User，从而确定表名/主键\n}\n// 导表工具：泛型 + 反射承载配置\npublic class ConfigManager {\n    private static final Map<Class<?>, Map<Long, ?>> CACHE = new HashMap<>();\n    @SuppressWarnings(\"unchecked\")\n    public static <T> Map<Long, T> get(Class<T> cfgClass) {\n        return (Map<Long, T>) CACHE.get(cfgClass);   // 擦除后只能强转\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "泛型是编译期语法糖，别答成「运行时保留类型信息」——只在 Signature 里留了签名",
     "instanceof List<String> 编译错误；List<String>[] 数组也建不出来",
     "foo(List<String>) 和 foo(List<Integer>) 重载冲突——擦除后签名相同",
     "泛型数组不能直接 new，常见绕过是 new List<?>[n] 或转 Object[]",
     "T 不能用于 static 上下文（静态字段/静态方法）——擦除后无类型参数可依"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：泛型编译期生效、运行时擦除为边界类型，但 Signature 属性保留签名供反射读取（TypeReference 原理）。PECS 原则：生产者 extends、消费者 super。游戏工程里泛型 + 反射是 MyBatis-Plus 实体映射、导表工具、协议解析的通用底座。写公共工具类时优先泛型方法而非泛型类的滥用。"
   }
  ]
 },
 {
  "id": "java-basic-exception",
  "title": "异常处理与游戏服治理",
  "layer": 1,
  "depends": [
   "java-basic-runtime-oop"
  ],
  "covers": [
   "java-basic-05",
   "java-basic-23"
  ],
  "quiz": [
   "java-basic-05",
   "java-basic-23",
   "java-basic-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Throwable 家族怎么分？checked 和 unchecked 语义差在哪？finally 里 return 为什么是禁忌？try-with-resources 的原理是什么？游戏服务器的异常三道防线怎么搭？本文讲透异常体系 + 服务器端治理经验。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 try/catch/finally 基本语法",
     "了解方法调用栈"
    ]
   },
   {
    "t": "h",
    "text": "异常体系结构"
   },
   {
    "t": "p",
    "text": "Throwable 分两支：Error 和 Exception。Error 是 JVM 级严重问题（OOM、StackOverflowError），程序无法恢复，一般不 catch。Exception 分 checked（受检）和 unchecked（RuntimeException 及其子类）：checked 是编译期强制处理的「可预期外部问题」（IOException、SQLException）；unchecked 是「代码 bug」（NPE、IndexOutOfBounds、ClassCastException），编译器不强制。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"245\" y=\"20\" width=\"150\" height=\"45\" rx=\"8\" fill=\"var(--lv3)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"48\" font-size=\"15\" fill=\"var(--panel)\" text-anchor=\"middle\">Throwable</text>\n  <line x1=\"280\" y1=\"68\" x2=\"200\" y2=\"100\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <line x1=\"360\" y1=\"68\" x2=\"440\" y2=\"100\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <rect x=\"100\" y=\"100\" width=\"200\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"200\" y=\"125\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Error（不可恢复）</text>\n  <text x=\"200\" y=\"145\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">OOM / StackOverflow / LinkageError</text>\n  <rect x=\"340\" y=\"100\" width=\"200\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"440\" y=\"125\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Exception</text>\n  <text x=\"440\" y=\"145\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">分受检 / 非受检</text>\n  <line x1=\"340\" y1=\"158\" x2=\"240\" y2=\"190\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <line x1=\"540\" y1=\"158\" x2=\"560\" y2=\"190\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <rect x=\"130\" y=\"190\" width=\"230\" height=\"55\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"245\" y=\"215\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">checked 受检异常</text>\n  <text x=\"245\" y=\"235\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">IOException / SQLException，编译期强制</text>\n  <rect x=\"420\" y=\"190\" width=\"200\" height=\"55\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"520\" y=\"215\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">unchecked 运行时</text>\n  <text x=\"520\" y=\"235\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">NPE / ClassCastException，代码 bug</text>\n  <text x=\"320\" y=\"278\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">口诀：Error 是绝症，checked 是天气预报，unchecked 是自己摔倒</text>\n</svg>",
    "caption": "图 7：异常体系全景：Error 与两类 Exception"
   },
   {
    "t": "h",
    "text": "finally、return 与 try-with-resources"
   },
   {
    "t": "p",
    "text": "finally 里的 return 会覆盖 try/catch 的返回值，甚至吞掉未处理的异常——这是编码禁忌，方法实际结果与预期不符且极难排查。正确姿势：返回值放 finally 之前算好，finally 只做资源释放。try-with-resources 是编译器语法糖：资源须实现 AutoCloseable，自动生成 finally 调 close()，多资源按声明逆序关闭；close 抛出的异常被抑制进主异常的 suppressed 列表不丢失。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 禁忌：finally 里 return 覆盖返回值\nstatic int bad() {\n    try { return 1; } finally { return 2; }  // 结果恒为 2，且吞掉异常\n}\n// 正确：try-with-resources 自动关闭\n// Java 7+ 要求资源实现 AutoCloseable\ntry (FileInputStream in = new FileInputStream(\"cfg.bin\");\n     BufferedInputStream buf = new BufferedInputStream(in)) {\n    byte[] data = buf.readAllBytes();\n} // 编译器自动生成 finally：buf.close() 再 in.close()（逆序）"
   },
   {
    "t": "h",
    "text": "游戏服异常治理三道防线"
   },
   {
    "t": "p",
    "text": "第一道：网络层兜底——Netty pipeline 必须有全局 exceptionCaught，一个协议处理异常不能搞挂连接或线程；第二道：业务错误码转化——自定义 ErrorCodeException 带错误码，统一拦截转成协议错误码推给客户端而不是直接断线；第三道：异步任务绝不吞异常——线程池/Disruptor handler 里的异常必须打日志，否则线上排查无迹可循。最致命的是 catch(Exception e){} 空块，等于把事故信息吃掉。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 自定义业务异常：带错误码\npublic class GameBizException extends RuntimeException {\n    private final int code;\n    public GameBizException(int code, String msg) { super(msg); this.code = code; }\n    public int getCode() { return code; }\n}\n// Netty 全局兜底：exceptionCaught\n@Override\npublic void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {\n    logger.error(\"channel {} exception\", ctx.channel().remoteAddress(), cause);\n    if (cause instanceof GameBizException ge) {\n        ctx.writeAndFlush(ErrorCodePkt.of(ge.getCode()));  // 转错误码协议\n    } else {\n        ctx.close();   // 致命错误关闭连接，保连接池干净\n    }\n}\n// 异步任务：绝不吞异常\nexecutor.execute(() -> {\n    try { doSettlement(playerId); }\n    catch (Exception e) { logger.error(\"settlement failed pid={}\", playerId, e); }\n});"
   },
   {
    "t": "pits",
    "items": [
     "try 里 return 前 finally 会先执行，但 finally 里 return 会覆盖前面的返回值——禁忌",
     "catch(Error) 是反模式：OOM 捕了也恢复不了，反而掩盖问题",
     "多资源 try-with-resources 关闭顺序是逆序，且 close 异常进 suppressed",
     "异常构造本身昂贵（填充栈），热循环里不要用异常做流程控制",
     "catch 后空块（吞异常）是线上事故的头号元凶"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：异常体系按 Error/checked/unchecked 三分，unchecked 代表代码 bug、checked 代表可预期外部问题。finally 只做清理、绝不 return。游戏服三道防线：网络层 exceptionCaught 兜底、业务异常转错误码、异步任务异常必打日志。治理原则：能恢复的转错误码，不能恢复的打日志保现场，绝不静默吞掉。"
   }
  ]
 },
 {
  "id": "java-basic-reflection",
  "title": "反射与动态代理",
  "layer": 2,
  "depends": [
   "java-basic-generics",
   "java-basic-runtime-oop"
  ],
  "covers": [
   "java-basic-17",
   "java-basic-18",
   "java-basic-21"
  ],
  "quiz": [
   "java-basic-17",
   "java-basic-18",
   "java-basic-21"
  ],
  "body": [
   {
    "t": "lead",
    "text": "反射是什么？Class 对象怎么拿？Method/Field 怎么操作？JDK 动态代理和 CGLIB 的区别？Spring AOP 默认用哪个？反射为什么慢、怎么缓解？导表工具从运行期反射到生成代码的演进之路是什么？"
   },
   {
    "t": "pre",
    "items": [
     "掌握 Class 与对象的关系",
     "了解接口与继承",
     "理解泛型擦除（见泛型篇）"
    ]
   },
   {
    "t": "h",
    "text": "反射的本质与三大入口"
   },
   {
    "t": "p",
    "text": "反射 = 运行时动态获取类信息（Class 对象）并操作其字段/方法/构造器的能力。三种入口：Class.forName(\"全限定名\")、obj.getClass()、Xxx.class。核心 API：getDeclaredField/setAccessible 读写私有字段、Method.invoke 调方法、Constructor.newInstance 建对象。游戏服里反射是导表工具、协议生成、MyBatis 映射的底座。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 三种获取 Class 的入口\nClass<?> c1 = Class.forName(\"com.game.config.ItemConfig\");\nClass<?> c2 = new ItemConfig().getClass();\nClass<?> c3 = ItemConfig.class;\n// 反射操作字段与方法\nField f = c1.getDeclaredField(\"name\");\nf.setAccessible(true);            // 关闭 Java 语言访问检查\nString name = (String) f.get(instance);\nMethod m = c1.getMethod(\"getId\");\nObject id = m.invoke(instance);   // 参数装箱 + 数组封装，慢\n// 缓存 Field/Method 对象是性能关键：查找才是开销大头"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"30\" width=\"180\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"120\" y=\"53\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Class.forName</text>\n  <text x=\"120\" y=\"73\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">全限定名（加载）</text>\n  <rect x=\"230\" y=\"30\" width=\"180\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"53\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">obj.getClass()</text>\n  <text x=\"320\" y=\"73\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">实例（运行时类型）</text>\n  <rect x=\"430\" y=\"30\" width=\"180\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"520\" y=\"53\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Xxx.class</text>\n  <text x=\"520\" y=\"73\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">编译期字面量</text>\n  <line x1=\"120\" y1=\"88\" x2=\"120\" y2=\"120\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <line x1=\"320\" y1=\"88\" x2=\"320\" y2=\"120\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <line x1=\"520\" y1=\"88\" x2=\"520\" y2=\"120\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <rect x=\"30\" y=\"120\" width=\"580\" height=\"55\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"143\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">Class 对象（每个类 JVM 中唯一）</text>\n  <text x=\"320\" y=\"163\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">字段表 / 方法表 / 构造器 / 泛型签名 / 注解</text>\n  <rect x=\"30\" y=\"195\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"120\" y=\"218\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">getDeclaredField</text>\n  <text x=\"120\" y=\"238\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">+ setAccessible</text>\n  <rect x=\"230\" y=\"195\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"320\" y=\"218\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">Method.invoke</text>\n  <text x=\"320\" y=\"238\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">装箱+数组封装</text>\n  <rect x=\"430\" y=\"195\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"520\" y=\"218\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">Constructor</text>\n  <text x=\"520\" y=\"238\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">newInstance</text>\n</svg>",
    "caption": "图 8：反射三大入口与核心 API 操作"
   },
   {
    "t": "h",
    "text": "JDK 动态代理 vs CGLIB"
   },
   {
    "t": "p",
    "text": "JDK 动态代理基于接口：反射生成实现接口的代理类，调用转发给 InvocationHandler.invoke；要求目标必须实现接口。CGLIB 基于继承：ASM 生成目标类的子类重写方法织入逻辑，不需要接口，但不能代理 final 类/final 方法。Spring AOP 默认策略：目标有接口用 JDK 代理、无接口用 CGLIB；SpringBoot 2.x 起默认 proxyTargetClass=true 强制 CGLIB。MyBatis Mapper 没有实现类却能注入，就是 JDK 动态代理的经典应用。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// JDK 动态代理：GM 后台操作日志切面\npublic class LogProxy implements InvocationHandler {\n    private final Object target;\n    public LogProxy(Object target) { this.target = target; }\n    @Override\n    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {\n        logger.info(\"GM op: {} called with {}\", method.getName(), Arrays.toString(args));\n        return method.invoke(target, args);   // 转发真实调用\n    }\n    public static <T> T wrap(T target, Class<T> itf) {\n        return (T) Proxy.newProxyInstance(itf.getClassLoader(),\n                new Class[]{itf}, new LogProxy(target));\n    }\n}\n// 使用：IGmService svc = LogProxy.wrap(impl, IGmService.class);\n// 注意：同类内部 this.b() 自调用不经过代理——AOP 失效的经典坑"
   },
   {
    "t": "h",
    "text": "反射性能与代码生成优化"
   },
   {
    "t": "p",
    "text": "反射慢在四件事：参数装箱拆箱、参数数组封装、访问检查、JIT 优化受限。缓解手段：缓存 Field/Method（查找是开销大头）、setAccessible(true) 跳过检查、启动期生成字节码/源代码让运行期零反射。导表工具演进正是这条路：早期运行期反射填充配置对象 → 后期直接生成 new XxxConfig(a,b,c) 源码再编译，启动更快、类型错误编译期暴露。JDK9 模块系统后强封装，反射未导出的包会报 InaccessibleObjectException。"
   },
   {
    "t": "pits",
    "items": [
     "JDK 动态代理必须接口，目标没接口会直接报错——这是面试最爱挖的点",
     "CGLIB 不能代理 final 类/方法，SpringBoot2 默认 CGLIB 后 final 方法 AOP 静默失效",
     "同类自调用 this.b() 绕开代理，事务/缓存注解失效——需注入自身或 AopContext",
     "反射性能坑：不缓存 Field/Method 每次都 getDeclaredField，慢十倍以上",
     "JDK9+ 模块化强封装：反射未导包抛 InaccessibleObjectException，需 --add-opens"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：反射三大入口 + 核心 API 是框架的底座，但裸反射慢，靠缓存句柄和 setAccessible 缓解。动态代理两条路线：JDK 走接口、CGLIB 走继承，Spring Boot 默认 CGLIB。导表/协议工具的正确姿势是把反射从运行期左移到编译期（生成源码/字节码），错误左移、运行零开销。"
   }
  ]
 },
 {
  "id": "java-basic-annotation-spi",
  "title": "注解与 SPI 机制",
  "layer": 2,
  "depends": [
   "java-basic-runtime-oop",
   "java-basic-generics"
  ],
  "covers": [
   "java-basic-31",
   "java-basic-32"
  ],
  "quiz": [
   "java-basic-31",
   "java-basic-32",
   "java-basic-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "四大元注解分别管什么？注解怎么在运行期真正生效？SPI 机制和 ServiceLoader 是怎么工作的？为什么需要线程上下文类加载器？JDK/Spring/Dubbo 三代 SPI 有什么演进？本文把「注解 + 可插拔」这套骨架讲透。"
   },
   {
    "t": "pre",
    "items": [
     "理解反射读取元数据",
     "了解类加载器双亲委派的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "四大元注解与生效原理"
   },
   {
    "t": "p",
    "text": "元注解是「注解注解的注解」：@Target 管贴哪（TYPE/METHOD/FIELD/PARAMETER…）、@Retention 管活多久（SOURCE 编译丢弃/CLASS 进 class 文件默认/RUNTIME 反射可读）、@Inherited 管传不传后代（仅类注解有效）、@Documented 管进不进 Javadoc。核心认知：注解本身只是元数据，必须有「处理者」才生效——运行期反射 getAnnotation 扫描（Spring/JUnit）、编译期 APT 生成代码（MapStruct/Lombok）、或 AOP 切面织入。游戏服协议分发用 @MsgHandler(cmd=1001) 替代手写 switch，就是反射处理者的经典应用。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 自定义协议注解 + 启动期扫描注册\n@Target(ElementType.METHOD)\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface MsgHandler {\n    int cmd() default 0;\n    boolean needLogin() default true;\n}\n// 处理器注册：启动时扫描到 Map，运行期零反射\n@MsgHandler(cmd = 1001)\npublic void onLogin(ChannelHandlerContext ctx, LoginReq req) {\n    // 业务逻辑\n}\n// 扫描注册（示意）：\nMap<Integer, HandlerMeta> HANDLERS = new HashMap<>();\nfor (Method m : MsgProcessor.class.getDeclaredMethods()) {\n    MsgHandler ann = m.getAnnotation(MsgHandler.class);\n    if (ann != null) HANDLERS.put(ann.cmd(), new HandlerMeta(m, ann.needLogin()));\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"20\" width=\"580\" height=\"45\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"48\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">@Retention 决定注解活多久 → 决定处理者形态</text>\n  <rect x=\"30\" y=\"85\" width=\"180\" height=\"85\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"120\" y=\"108\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">SOURCE</text>\n  <text x=\"120\" y=\"128\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">编译丢弃，如 @Override</text>\n  <text x=\"120\" y=\"148\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">处理者：无/静态检查</text>\n  <rect x=\"230\" y=\"85\" width=\"180\" height=\"85\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"108\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">CLASS</text>\n  <text x=\"320\" y=\"128\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">进 class 文件（默认）</text>\n  <text x=\"320\" y=\"148\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">处理者：字节码工具</text>\n  <rect x=\"430\" y=\"85\" width=\"180\" height=\"85\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"520\" y=\"108\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">RUNTIME</text>\n  <text x=\"520\" y=\"128\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">反射可读，@Autowired</text>\n  <text x=\"520\" y=\"148\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">处理者：反射/AOP</text>\n  <rect x=\"30\" y=\"195\" width=\"180\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"120\" y=\"222\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">@Target</text>\n  <text x=\"120\" y=\"246\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">贴哪：类/方法/字段/参数</text>\n  <rect x=\"230\" y=\"195\" width=\"180\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"222\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">@Inherited</text>\n  <text x=\"320\" y=\"246\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">类注解传子类（仅类）</text>\n  <rect x=\"430\" y=\"195\" width=\"180\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"520\" y=\"222\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">@Documented</text>\n  <text x=\"520\" y=\"246\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">进 Javadoc 文档</text>\n</svg>",
    "caption": "图 9：四大元注解与 Retention 生命周期决定的处理者形态"
   },
   {
    "t": "h",
    "text": "SPI 机制与 ServiceLoader"
   },
   {
    "t": "p",
    "text": "SPI = 接口由调用方 jar 定义、实现由第三方 jar 提供，通过 META-INF/services/接口全限定名 文件声明实现类，ServiceLoader.load() 扫描加载——实现「可插拔」。为什么需要线程上下文类加载器（TCCL）：SPI 接口在启动类加载器里（如 java.sql.Driver），实现在应用 classpath，双亲委派下启动类加载器看不到实现，必须「破坏委派」用 TCCL 向下加载——这是类加载委派模型的经典例外。典型例子：JDBC 驱动、SLF4J 绑定。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 定义接口：渠道登录服务\npublic interface ChannelLoginService {\n    String getChannel();\n    String verify(String token);   // 返回 openId\n}\n// META-INF/services/com.game.channel.ChannelLoginService 文件内容：\n// com.game.channel.huawei.HuaweiLoginService\n// com.game.channel.xiaomi.XiaomiLoginService\n// 加载：\nServiceLoader<ChannelLoginService> loader = ServiceLoader.load(ChannelLoginService.class);\nfor (ChannelLoginService svc : loader) {\n    if (svc.getChannel().equals(channel)) { openId = svc.verify(token); }\n}\n// JDBC 同理：META-INF/services/java.sql.Driver 自动注册驱动"
   },
   {
    "t": "h",
    "text": "JDK/Spring/Dubbo 三代 SPI 对比"
   },
   {
    "t": "p",
    "text": "JDK SPI：ServiceLoader 懒迭代、无缓存（每次 load 新建实例）、无法按 key 选择、无依赖注入。Spring spring.factories：一次性全量读 + 缓存 + 支持排序过滤，SpringBoot 自动装配靠它。Dubbo SPI：key-value 配置按需加载、支持 AOP 包装与 IOC 注入、@Adaptive 运行时自适应选实现——解决 JDK SPI 全实例化、无注入的痛点。游戏卡牌渠道接入是天然 SPI 场景：定义接口、各渠道实现独立打包，新渠道只加 jar 不改主工程。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "JDK SPI",
     "Spring spring.factories",
     "Dubbo SPI"
    ],
    "rows": [
     [
      "配置",
      "services 文件",
      "META-INF/spring.factories",
      "META-INF/dubbo 接口文件"
     ],
     [
      "加载",
      "ServiceLoader 懒加载",
      "一次性全量 + 缓存",
      "按 key 按需加载"
     ],
     [
      "选择",
      "无法按 key 选",
      "排序过滤",
      "@Adaptive 运行时选"
     ],
     [
      "依赖注入",
      "无",
      "无（需手动处理）",
      "支持 IOC 注入"
     ],
     [
      "适用",
      "JDBC/SLF4J 绑定",
      "SpringBoot 自动装配",
      "Dubbo 扩展点"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "SPI 是接口在调用方、实现在第三方，别答反了方向",
     "TCCL 破坏双亲委派是「必须」而非「缺陷」——接口在启动类加载器看不到应用类",
     "ServiceLoader 线程不安全、无缓存，别在多线程场景裸用",
     "@Retention(SOURCE) 的注解反射读不到，框架要处理必须 RUNTIME",
     "@Inherited 只对类注解有效，方法/接口不继承——代理场景需 AnnotationUtils 桥接"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：注解是元数据，必须配合处理者（反射/APT/AOP）才生效，Retention 决定处理者形态；协议分发、权限切面、导表校验是游戏服的三大注解落地场景。SPI 提供可插拔能力，JDBC/SLF4J 是 JDK 级范例，Spring/Dubbo 在其上做了缓存、按需、注入的增强。渠道接入用 SPI 设计，新增渠道零侵入。"
   }
  ]
 },
 {
  "id": "java-basic-io-serialization",
  "title": "IO 体系与序列化",
  "layer": 2,
  "depends": [
   "java-basic-exception",
   "java-basic-string"
  ],
  "covers": [
   "java-basic-13",
   "java-basic-14",
   "java-basic-24"
  ],
  "quiz": [
   "java-basic-13",
   "java-basic-14",
   "java-basic-24"
  ],
  "body": [
   {
    "t": "lead",
    "text": "字节流/字符流怎么分？缓冲流解决什么问题？BIO/NIO/AIO 的本质区别是什么？Java 原生序列化为什么被游戏协议抛弃？serialVersionUID 和 transient 的细节是什么？本文把 IO 与序列化体系一次讲全。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 try-with-resources 自动关闭",
     "了解异常体系（受检异常）",
     "了解字符编码基础概念"
    ]
   },
   {
    "t": "h",
    "text": "IO 体系：字节流 vs 字符流"
   },
   {
    "t": "p",
    "text": "IO 体系两大基座：字节流 InputStream/OutputStream 处理一切二进制（图片、协议包、class 文件），字符流 Reader/Writer 处理文本（本质是字节流 + 编码解码，把字节按 Charset 转成 char）。游戏服读配置文件、日志文件、写协议包全部是字节流；读策划导出的文本配置、生成代码用字符流。字符流是「字节流 + 编码」的包装，底层还是字节。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 字节流：读二进制协议/配置\nbyte[] data;\ntry (FileInputStream in = new FileInputStream(\"cfg.bin\")) {\n    data = in.readAllBytes();   // 小文件可直接全读\n}\n// 字符流：按 UTF-8 读文本配置\nList<String> lines;\ntry (BufferedReader reader = new BufferedReader(\n        new InputStreamReader(new FileInputStream(\"items.csv\"), StandardCharsets.UTF_8))) {\n    lines = reader.lines().collect(Collectors.toList());\n}\n// 必须显式指定编码：不指定则用平台默认（Windows GBK / Linux UTF-8）"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"25\" width=\"250\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"155\" y=\"48\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">InputStream / OutputStream</text>\n  <text x=\"155\" y=\"68\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">字节流：一切二进制数据</text>\n  <rect x=\"360\" y=\"25\" width=\"250\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"485\" y=\"48\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Reader / Writer</text>\n  <text x=\"485\" y=\"68\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">字符流 = 字节 + 编码解码</text>\n  <rect x=\"30\" y=\"105\" width=\"250\" height=\"55\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"155\" y=\"128\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">BufferedInputStream</text>\n  <text x=\"155\" y=\"148\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">缓冲：减少系统调用</text>\n  <rect x=\"360\" y=\"105\" width=\"250\" height=\"55\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"485\" y=\"128\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">BufferedReader</text>\n  <text x=\"485\" y=\"148\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">readLine / lines() 高效读文本</text>\n  <rect x=\"30\" y=\"185\" width=\"580\" height=\"75\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"320\" y=\"211\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">NIO 体系：Channel + Buffer + Selector</text>\n  <text x=\"320\" y=\"233\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Channel 双向通道 / Buffer 数据容器(flip切换) / Selector 多路复用</text>\n  <text x=\"320\" y=\"253\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">Netty 封装后长连接海量并发，游戏服主力</text>\n</svg>",
    "caption": "图 10：IO 体系分层：字节流/字符流与 NIO 三大组件"
   },
   {
    "t": "h",
    "text": "BIO / NIO / AIO 三模型对比"
   },
   {
    "t": "p",
    "text": "BIO：一连接一线程阻塞等待，并发上千连接就线程爆炸——登录服/游戏服长连接场景直接淘汰。NIO：单线程通过 Selector 轮询多路复用，事件就绪才处理，三大组件 Channel/Buffer/Selector。AIO：OS 完成后回调，Linux 下本质是 epoll 封装、不成熟。游戏服为什么选 Netty 而不是裸写 NIO：JDK NIO 有 epoll 空轮询 bug（Selector 无事件也返回，CPU 100%），Netty 重建 Selector 规避；ByteBuf 池化、粘包拆包解码器、主从 Reactor 线程模型全帮屏蔽。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// BIO：一连接一线程（游戏服不这么干）\nServerSocket server = new ServerSocket(8080);\nwhile (true) {\n    Socket socket = server.accept();          // 阻塞等待连接\n    new Thread(() -> handle(socket)).start(); // 每连接一个线程\n}\n// NIO 核心：Selector 多路复用（示意）\nSelector selector = Selector.open();\nserverChannel.register(selector, SelectionKey.OP_ACCEPT);\nwhile (true) {\n    selector.select();                        // 阻塞直到有事件就绪\n    Set<SelectionKey> keys = selector.selectedKeys();\n    for (SelectionKey key : keys) {\n        if (key.isAcceptable()) { /* accept */ }\n        if (key.isReadable()) { /* read */ }\n    }\n}\n// 生产：直接用 Netty，LengthFieldBasedFrameDecoder 解决粘包拆包"
   },
   {
    "t": "h",
    "text": "Java 序列化：Serializable 的原理与坑"
   },
   {
    "t": "p",
    "text": "Serializable 是标记接口，序列化通过 ObjectOutputStream 写对象图（含类元数据）。serialVersionUID 是版本校验标识：反序列化时类与流中 UID 不一致抛 InvalidClassException，不显式声明则按类结构自动计算，字段一改 UID 就变——必须显式固定。transient 字段不参与序列化。游戏协议对象为什么不用 Java 原生序列化：性能差体积大（带类元数据）、反序列化有安全漏洞史（readObject 任意代码执行链）、跨语言不支持（客户端是 C++/TS）、serialVersionUID 演进不友好。游戏服用自定义二进制（字段编号 + 变长编码，思路类似 Protobuf）或 Protobuf/Kryo。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public class PlayerSnapshot implements Serializable {\n    private static final long serialVersionUID = 1L;  // 显式固定版本号\n    private long playerId;\n    private String name;\n    private transient byte[] sessionToken;   // 敏感数据不序列化\n}\n// 深拷贝的序列化实现（Kryo 是游戏服常用方案）：\n// Kryo kryo = new Kryo();\n// PlayerSnapshot copy = kryo.copy(original);   // 深拷贝，正确处理对象图\n// 反序列化安全：限制允许的类，别裸用 ObjectInputStream.readObject()\n// 可加 ObjectInputFilter（JDK9+）白名单过滤"
   },
   {
    "t": "pits",
    "items": [
     "serialVersionUID 不显式声明：改字段后自动计算值变化，线上升级直接 InvalidClassException",
     "transient 只跳过序列化，不跳过 JSON——Jackson 默认序列化 transient 字段（要加 @JsonIgnore）",
     "深拷贝别用 clone()：默认浅拷贝且不调用构造器；用 Kryo/JSON/拷贝构造器",
     "BIO 一连接一线程在游戏服长连接场景必然线程爆炸",
     "字符流不指定编码 = 平台默认，Windows/Linux 部署结果不同"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：字节流管二进制、字符流管文本（字节+编码），都要配缓冲流减少系统调用。NIO 三组件 Channel/Buffer/Selector 是 Netty 的底子，生产直接用 Netty 屏蔽 epoll bug 与粘包拆包。序列化选型：游戏协议用 Protobuf/自定义二进制（瘦快稳），内部缓存用 Kryo，Java 原生序列化四宗罪（胖慢有后门不跨语言）要能脱口而出。"
   }
  ]
 },
 {
  "id": "java-basic-datetime",
  "title": "新日期时间 API（java.time）",
  "layer": 2,
  "depends": [
   "java-basic-data-types"
  ],
  "covers": [
   "java-basic-34"
  ],
  "quiz": [
   "java-basic-34",
   "java-basic-25",
   "java-basic-26"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Date 和 SimpleDateFormat 为什么被诟病？LocalDate/LocalTime/LocalDateTime 怎么分工？Duration/Period 怎么选？时区 ZoneId 怎么处理？游戏开服时间、活动排期、每日重置怎么用 java.time 正确实现？本文给出完整答案。"
   },
   {
    "t": "pre",
    "items": [
     "掌握基本类型与包装类",
     "了解线程安全的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "老 API 的两宗罪"
   },
   {
    "t": "p",
    "text": "第一宗：Date 可变且 API 反人类——年从 1900 起、月从 0 起（month 12 表示次年一月），getYear() 返回 1900 偏移。第二宗：SimpleDateFormat 线程不安全——内部共享 Calendar 状态，并发 parse 数据错乱（偶发输出错误日期，线上极难排查）。JDK8 的 java.time 全套不可变、线程安全，格式化用 DateTimeFormatter 也是不可变线程安全的，可放心定义为 static 常量。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 错误：SimpleDateFormat 定义为 static 并发使用\nprivate static final SimpleDateFormat SDF = new SimpleDateFormat(\"yyyy-MM-dd\"); // 线程不安全！\n// 正确：DateTimeFormatter 不可变线程安全\nprivate static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern(\"yyyy-MM-dd HH:mm:ss\");\n// 格式化/解析\nString s = LocalDateTime.now().format(FMT);\nLocalDateTime t = LocalDateTime.parse(\"2026-08-08 12:00:00\", FMT);"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"25\" width=\"580\" height=\"45\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"320\" y=\"52\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">java.time 核心类分工（全部不可变 + 线程安全）</text>\n  <rect x=\"30\" y=\"95\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"95\" y=\"122\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">LocalDate</text>\n  <text x=\"95\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">年/月/日</text>\n  <text x=\"95\" y=\"164\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">每日重置</text>\n  <rect x=\"175\" y=\"95\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"240\" y=\"122\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">LocalTime</text>\n  <text x=\"240\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">时/分/秒</text>\n  <text x=\"240\" y=\"164\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">日限购、CD</text>\n  <rect x=\"320\" y=\"95\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"385\" y=\"122\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">LocalDateTime</text>\n  <text x=\"385\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">无时区墙钟</text>\n  <text x=\"385\" y=\"164\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">运营展示</text>\n  <rect x=\"465\" y=\"95\" width=\"145\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"537\" y=\"122\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Instant</text>\n  <text x=\"537\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">机器时间戳</text>\n  <text x=\"537\" y=\"164\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">存储/传输</text>\n  <rect x=\"30\" y=\"195\" width=\"280\" height=\"85\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"170\" y=\"222\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">Duration：时间长短</text>\n  <text x=\"170\" y=\"246\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">PT2H30M，跨时区秒级差</text>\n  <text x=\"170\" y=\"266\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">活动时长、CD 计时</text>\n  <rect x=\"330\" y=\"195\" width=\"280\" height=\"85\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"470\" y=\"222\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">Period：日期间隔</text>\n  <text x=\"470\" y=\"246\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">P3Y2M1D，日历日差</text>\n  <text x=\"470\" y=\"266\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">签到周期、月卡到期</text>\n</svg>",
    "caption": "图 11：java.time 核心类分工与 Duration/Period 的定位"
   },
   {
    "t": "h",
    "text": "时区与 ZoneId：开服/活动时间怎么定"
   },
   {
    "t": "p",
    "text": "游戏服实践四原则：一、服务器内部一律 epoch 毫秒（Instant/System.currentTimeMillis），跨服、跨时区无歧义；二、活动时间配置存「运营时区时间 + 时区标识」，计算开启用 ZonedDateTime.now(ZoneId.of(\"Asia/Shanghai\"))，绝不用系统默认时区——海外部署系统时区一变活动就错位；三、每日重置（凌晨 4 点刷新日常）用 LocalDateTime 比较上次重置时间，别用毫秒硬算 24 小时；四、时钟回拨（NTP 校时）会让时间倒流，间隔测量用 System.nanoTime 单调时钟。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 活动开启判断：运营填的是上海时区时间\nZoneId sh = ZoneId.of(\"Asia/Shanghai\");\nLocalDateTime activityStart = LocalDateTime.of(2026, 8, 8, 12, 0);\nlong startEpoch = activityStart.atZone(sh).toInstant().toEpochMilli();\nboolean opened = System.currentTimeMillis() >= startEpoch;\n// 每日重置：本地日与上次重置日比较（服务端按运营时区定重置点）\nZonedDateTime now = ZonedDateTime.now(sh);\nLocalDate today = now.toLocalDate();\nif (!today.equals(lastResetDate)) {\n    resetDaily();\n    lastResetDate = today;\n}\n// 老代码兼容：Date <-> Instant\nDate legacy = new Date();\nInstant instant = legacy.toInstant();\nDate back = Date.from(instant);"
   },
   {
    "t": "h",
    "text": "格式化、解析与夏令时"
   },
   {
    "t": "p",
    "text": "DateTimeFormatter 支持自定义 pattern 和 ISO 标准格式（ISO_INSTANT、ISO_OFFSET_DATE_TIME）。协议/存储永远用 epoch 毫秒或 UTC（Instant.toString 是 ISO-8601 Z 格式），只在显示层转 ZonedDateTime 到玩家本地时区。夏令时地区（美服/欧服）ZoneId 下 LocalDateTime 可能不存在（跳过）或重复（回拨），用 ZonedDateTime.of 自动处理，或干脆避免 LocalDateTime 做跨时区交换——LocalDateTime 不带时区，同一值在不同时区代表不同瞬间。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 协议/存储用 epoch 毫秒\nlong ts = Instant.now().toEpochMilli();\n// 显示层再转本地时区\nZonedDateTime zdt = Instant.ofEpochMilli(ts).atZone(ZoneId.of(\"Asia/Shanghai\"));\n// 跨服交换数据：带偏移量，不裸用 LocalDateTime\nOffsetDateTime odt = zdt.toOffsetDateTime();\n// 周期校验：月卡到期\nboolean expired = Instant.now().isAfter(expireTime);\n// 间隔计时：耗时统计用单调时钟\nlong start = System.nanoTime();\n// ...\nlong costMs = (System.nanoTime() - start) / 1_000_000;"
   },
   {
    "t": "pits",
    "items": [
     "SimpleDateFormat 静态变量并发格式化 = 线上偶发日期错乱，换 DateTimeFormatter",
     "LocalDateTime 不带时区，跨服/跨时区交换必须存 epoch 毫秒或 OffsetDateTime",
     "系统默认时区随部署环境变，活动时间计算必须显式 ZoneId",
     "每日重置用「24 小时」硬算跨天逻辑必错，用 LocalDate 比较",
     "时钟回拨（NTP）导致时间倒流：活动结算/冷却要容忍并告警，间隔测量用 nanoTime"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：java.time 全套不可变线程安全，替代 Date/SimpleDateFormat。类分工：LocalDate 管日历、Instant 管时间戳、Duration/Period 管间隔。游戏服铁律：内部存 epoch 毫秒、显示才转时区、活动时间显式 ZoneId、每日重置按 LocalDate、NTP 回拨用 nanoTime 防御。老项目迁移先统一存储层，再逐步替换格式化。"
   }
  ]
 },
 {
  "id": "java-basic-stream",
  "title": "Stream 与函数式编程",
  "layer": 3,
  "depends": [
   "java-basic-collections",
   "java-basic-exception"
  ],
  "covers": [
   "java-basic-06",
   "java-basic-15",
   "java-basic-16",
   "java-basic-22"
  ],
  "quiz": [
   "java-basic-06",
   "java-basic-15",
   "java-basic-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Lambda 的本质是什么？方法引用有几种？Stream 中间/终端操作怎么分？惰性求值与操作融合是怎么回事？Collectors 怎么分组聚合？Optional 怎么防 NPE？并行流为什么危险？本文把函数式三板斧一次讲透。"
   },
   {
    "t": "pre",
    "items": [
     "掌握集合框架",
     "理解函数式接口概念",
     "了解泛型"
    ]
   },
   {
    "t": "h",
    "text": "Lambda 与函数式接口"
   },
   {
    "t": "p",
    "text": "函数式接口 = 只有一个抽象方法的接口（@FunctionalInterface 标注，编译器校验）。常用五个：Function<T,R>、Consumer<T>、Supplier<T>、Predicate<T>、Runnable。Lambda 本质不是匿名内部类的语法糖：不生成 class 文件，通过 invokedynamic + LambdaMetafactory 运行时生成实现，性能更好。Lambda 捕获的外部局部变量必须 effectively final（事实不可变），因为变量是值拷贝进去的，可变会出现并发语义混乱。方法引用四种：静态方法 String::valueOf、特定对象实例方法 list::add、任意对象实例方法 String::length、构造器 ArrayList::new。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 协议 handler 注册：Map<Integer, Consumer<MsgContext>>\nMap<Integer, Consumer<MsgContext>> handlers = new HashMap<>();\nhandlers.put(1001, ctx -> loginService.handle(ctx));\nhandlers.put(1002, this::onBattle);   // 方法引用\n// 常用函数式接口\nFunction<String, Integer> parseLen = String::length;      // T -> R\nConsumer<String> log = System.out::println;               // T -> void\nSupplier<Player> newPlayer = Player::new;                 // () -> T\nPredicate<Player> online = Player::isOnline;              // T -> boolean\nRunnable task = () -> doTick();                           // () -> void\n// effectively final：捕获的局部变量不能重新赋值\nint minLevel = 30;   // 不变\nplayers.stream().filter(p -> p.getLevel() >= minLevel);   // OK\n// minLevel = 40;    // 再赋值则编译错误"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"20\" width=\"580\" height=\"45\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"320\" y=\"47\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">Stream 流水线：中间操作惰性，终端操作触发</text>\n  <rect x=\"30\" y=\"85\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"85\" y=\"110\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">数据源</text>\n  <text x=\"85\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">Collection/数组</text>\n  <text x=\"145\" y=\"118\" font-size=\"18\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"160\" y=\"85\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"215\" y=\"110\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">filter</text>\n  <text x=\"215\" y=\"130\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">中间·惰性</text>\n  <text x=\"275\" y=\"118\" font-size=\"18\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"290\" y=\"85\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"345\" y=\"110\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">map</text>\n  <text x=\"345\" y=\"130\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">中间·惰性</text>\n  <text x=\"405\" y=\"118\" font-size=\"18\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"420\" y=\"85\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"475\" y=\"110\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">sorted</text>\n  <text x=\"475\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">中间·惰性</text>\n  <text x=\"535\" y=\"118\" font-size=\"18\" fill=\"var(--accent)\" text-anchor=\"middle\">&#8594;</text>\n  <rect x=\"550\" y=\"85\" width=\"60\" height=\"60\" rx=\"8\" fill=\"var(--lv3)\" stroke=\"var(--line)\"/>\n  <text x=\"580\" y=\"110\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">collect</text>\n  <text x=\"580\" y=\"130\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">终端!</text>\n  <rect x=\"30\" y=\"170\" width=\"290\" height=\"110\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"175\" y=\"195\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">惰性求值</text>\n  <text x=\"175\" y=\"218\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">中间操作只记录步骤，遇到终端才执行</text>\n  <text x=\"175\" y=\"240\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">多个中间操作融合成一次遍历（不是逐层过）</text>\n  <text x=\"175\" y=\"262\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">短路操作：findFirst/anyMatch/limit 可提前结束</text>\n  <rect x=\"340\" y=\"170\" width=\"270\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"475\" y=\"195\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Stream 只能消费一次</text>\n  <text x=\"475\" y=\"218\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">复用抛 IllegalStateException</text>\n  <text x=\"475\" y=\"240\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">流里做耗时 IO 会拖慢流水线</text>\n  <text x=\"475\" y=\"262\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">正确：collect 出名单再异步批处理</text>\n</svg>",
    "caption": "图 12：Stream 流水线：惰性中间操作 + 触发终端操作"
   },
   {
    "t": "h",
    "text": "终端操作与 Collectors 聚合"
   },
   {
    "t": "p",
    "text": "终端操作触发整个流水线：collect、forEach、reduce、count、anyMatch、findFirst。Collectors 是聚合工具箱：toList/toMap/groupingBy/joining/partitioningBy。groupingBy 支持下游收集器嵌套聚合（按职业分组统计平均战力）。reduce 三参版本：identity 每分片初始值、accumulator 分片内累积、combiner 并行时合并分片。游戏服发奖场景：筛选在线且战力达标的玩家，collect 出名单再异步批处理，别在 forEach 里同步写库。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 公会战结算：筛选 + 聚合\nList<Player> rewardList = players.stream()\n        .filter(Player::isOnline)\n        .filter(p -> p.getPower() >= minPower)\n        .collect(Collectors.toList());\n// 按职业分组统计平均战力\nMap<Job, Double> avgPowerByJob = players.stream()\n        .collect(Collectors.groupingBy(Player::getJob,\n                Collectors.averagingInt(Player::getPower)));\n// reduce 三参版本：串行只走前两个，并行用 combiner\nint totalHp = players.stream().parallel()\n        .reduce(0, (sum, p) -> sum + p.getHp(), Integer::sum);\n// 排行榜 topN\nList<Player> top = players.stream()\n        .sorted(Comparator.comparingInt(Player::getPower).reversed())\n        .limit(10)\n        .collect(Collectors.toList());"
   },
   {
    "t": "h",
    "text": "Optional 防 NPE 与并行流陷阱"
   },
   {
    "t": "p",
    "text": "Optional 设计初衷是「方法返回值可能为空」的显式声明，正确用法：返回 Optional、消费用 orElse/orElseGet/orElseThrow/map 链式。四大反模式：裸 get()、isPresent()+get()、当实体字段用、当方法参数用。orElse 参数无条件立即求值、orElseGet 传 Supplier 惰性求值——默认值昂贵（查库）必须 orElseGet。并行流陷阱：默认共用全局 ForkJoinPool.commonPool（并行度=CPU 核-1），任务阻塞会拖垮全进程所有并行流和 CompletableFuture；任务拆分开销在小数据量时反而更慢；collect 到非线程安全容器直接数据错乱。游戏服正确姿势：明确线程模型 + 自建池，CPU 密集+大数据量+无共享才用并行流。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Optional 正确用法\nOptional<Player> cached = playerCache.find(playerId);\nPlayer player = cached.orElseGet(() -> playerDao.loadFromDb(playerId));  // 惰性回源\n// 反模式：opt.get() 无检查；isPresent()+get() 脱裤子放屁\n// 反模式：实体字段用 Optional（序列化不友好、内存开销）\n// 并行流风险：commonPool 全局共享\nplayers.parallelStream()        // 慎用！\n        .filter(Player::isOnline)\n        .forEach(this::sendReward);   // 阻塞 IO 会占满 commonPool\n// 正确：自建线程池 + CompletableFuture 指定 executor\nList<CompletableFuture<Void>> futures = players.stream()\n        .map(p -> CompletableFuture.runAsync(() -> sendReward(p), bizPool))\n        .collect(Collectors.toList());\nCompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();"
   },
   {
    "t": "pits",
    "items": [
     "Lambda 不是匿名内部类语法糖，是 invokedynamic 运行时生成——别答错",
     "捕获的局部变量必须 effectively final，否则编译错误",
     "Stream 复用一次抛 IllegalStateException；中间操作不执行，没终端就白搭",
     "并行流默认 commonPool：一个阻塞任务拖垮全进程——游戏服大忌",
     "Optional 当字段/参数用是反模式；orElse 无条件求值，昂贵默认值必须 orElseGet"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Lambda 靠 invokedynamic 高效生成，函数式接口五个常用类型要熟。Stream 中间惰性、终端触发、操作融合一次遍历，Collectors 负责聚合，短路操作提效。Optional 只用在返回值场景，消费用 orElseGet 惰性兜底。并行流是陷阱：commonPool 全局共享，游戏服用自建池 + CompletableFuture 显式 executor 代替。"
   }
  ]
 },
 {
  "id": "java-basic-new-features",
  "title": "Java 新特性演进（8→25）",
  "layer": 3,
  "depends": [
   "java-basic-runtime-oop",
   "java-basic-string"
  ],
  "covers": [
   "java-basic-35",
   "java-basic-36"
  ],
  "quiz": [
   "java-basic-35",
   "java-basic-36",
   "java-basic-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从 JDK8 到 JDK25，每版都带来了什么？var、record、sealed、switch 表达式、文本块、模式匹配、虚拟线程分别在哪个版本落地？游戏服团队升级路线怎么走？本文按版本号梳理一遍演进地图。"
   },
   {
    "t": "pre",
    "items": [
     "掌握基础语法与集合",
     "了解 Stream 与 Lambda（见函数式篇）",
     "了解泛型与多态"
    ]
   },
   {
    "t": "h",
    "text": "JDK 8 → 25 逐版要点（已验证版本时间线）"
   },
   {
    "t": "p",
    "text": "JDK8（2014 LTS）：Lambda、Stream、Optional、新时间 API、接口 default 方法、方法引用——现代 Java 的分水岭。JDK9（2017）：模块化 JPMS（module-info.java）、JShell、集合工厂（List.of/Map.of）、String 底层改 byte[]（Compact Strings）。JDK10（2018）：var 局部变量类型推断。JDK11（2018 LTS）：HTTP Client、String.strip/lines/repeat、移除 Java EE。JDK12-13（2019）：switch 表达式预览、文本块预览。JDK14（2020）：switch 表达式正式（箭头语法 + yield）、Record 预览、有用的 NPE。JDK15（2020）：文本块正式、sealed 预览。JDK16（2021）：Record 正式、instanceof 模式匹配正式、Stream.toList()。JDK17（2021 LTS）：sealed 正式、强封装 JDK 内部。JDK18（2022）：UTF-8 默认编码。JDK19-20：虚拟线程预览、记录模式。JDK21（2023 LTS）：虚拟线程正式、switch 模式匹配正式、结构化并发、Sequenced Collections。JDK22-24（2024-2025）：String Templates 预览、Gatherers 预览、隐式类。JDK25（2025 LTS）：性能与运行时优化为主。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 360\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"15\" width=\"580\" height=\"40\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"41\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">JDK 关键特性落地时间线（LTS 加粗）</text>\n  <line x1=\"80\" y1=\"90\" x2=\"560\" y2=\"90\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <polygon points=\"560,90 550,85 550,95\" fill=\"var(--accent)\"/>\n  <rect x=\"70\" y=\"78\" width=\"80\" height=\"24\" rx=\"12\" fill=\"var(--lv2)\"/>\n  <text x=\"110\" y=\"94\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">8</text>\n  <rect x=\"180\" y=\"78\" width=\"80\" height=\"24\" rx=\"12\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"220\" y=\"94\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">11</text>\n  <rect x=\"300\" y=\"78\" width=\"80\" height=\"24\" rx=\"12\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"340\" y=\"94\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">17</text>\n  <rect x=\"420\" y=\"78\" width=\"80\" height=\"24\" rx=\"12\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"460\" y=\"94\" font-size=\"13\" fill=\"var(--ink)\" text-anchor=\"middle\">21</text>\n  <rect x=\"525\" y=\"78\" width=\"55\" height=\"24\" rx=\"12\" fill=\"var(--lv3)\" stroke=\"var(--line)\"/>\n  <text x=\"552\" y=\"94\" font-size=\"13\" fill=\"var(--panel)\" text-anchor=\"middle\">25</text>\n  <rect x=\"30\" y=\"120\" width=\"185\" height=\"100\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"122\" y=\"146\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">JDK8 核心</text>\n  <text x=\"122\" y=\"170\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">Lambda/Stream/Optional</text>\n  <text x=\"122\" y=\"190\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">java.time/default 方法</text>\n  <text x=\"122\" y=\"210\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">游戏服基线</text>\n  <rect x=\"228\" y=\"120\" width=\"185\" height=\"100\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"146\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">JDK9-11</text>\n  <text x=\"320\" y=\"170\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">模块化/var/HTTP Client</text>\n  <text x=\"320\" y=\"190\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">String 改 byte[]（Compact）</text>\n  <text x=\"320\" y=\"210\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">生产常用</text>\n  <rect x=\"426\" y=\"120\" width=\"185\" height=\"100\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"518\" y=\"146\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">JDK17/21</text>\n  <text x=\"518\" y=\"170\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">record/sealed/switch 模式</text>\n  <text x=\"518\" y=\"190\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">虚拟线程/文本块</text>\n  <text x=\"518\" y=\"210\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">新项目推荐</text>\n  <rect x=\"30\" y=\"240\" width=\"580\" height=\"100\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"320\" y=\"268\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">游戏服升级建议</text>\n  <text x=\"320\" y=\"292\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">存量服：8/11 稳妥运行，JVM 参数 -XX:+UseG1GC 已默认</text>\n  <text x=\"320\" y=\"314\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">新服：17 起步，21 可上虚拟线程处理旁路（GM/日志/渠道回调）</text>\n  <text x=\"320\" y=\"336\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">LTS 间隔 6-8 年，跟随 LTS 而非每版追新</text>\n</svg>",
    "caption": "图 13：JDK 8→25 关键特性时间线与游戏服升级建议"
   },
   {
    "t": "h",
    "text": "record、sealed、switch 表达式与模式匹配"
   },
   {
    "t": "p",
    "text": "record（JDK16 正式）：不可变数据载体语法糖，一行 = final 类 + 全参构造 + equals/hashCode/toString + 访问器，可在紧凑构造器里做校验。sealed（JDK17 正式）：受限继承，permits 列表限定子类，配合 switch 模式匹配可穷举分支，漏分支编译报错。switch 表达式（JDK14 正式）：箭头语法 + yield 返回值。instanceof 模式匹配（JDK16 正式）：if (obj instanceof String s) 直接绑定变量。switch 模式匹配（JDK21 正式）：case Integer i ->。文本块（JDK15 正式）：三引号多行字符串，写 SQL/JSON 配置模板神器。游戏场景：响应 DTO 用 record 合适，池化协议对象不适合；玩家状态机用 sealed + switch 模式匹配绝配。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// record：不可变 DTO\npublic record PlayerDto(long playerId, String name, int level) {}\nPlayerDto dto = new PlayerDto(10001L, \"阿凡\", 88);\nSystem.out.println(dto.name());      // 访问器，不是 getName\n// sealed + switch 模式匹配：状态机穷举\npublic sealed interface PlayerState permits Online, InBattle, Offline {}\nrecord Online(int sceneId) implements PlayerState {}\nrecord InBattle(long battleId) implements PlayerState {}\nrecord Offline(long offlineTs) implements PlayerState {}\nString desc = switch (state) {\n    case Online o -> \"在线，场景 \" + o.sceneId();\n    case InBattle b -> \"战斗中 \" + b.battleId();\n    case Offline f -> \"离线于 \" + f.offlineTs();\n};   // 全覆盖，无需 default\n// 文本块：写 GM 后台 SQL\nString sql = \"\"\"\n        SELECT player_id, name, level\n        FROM player\n        WHERE level > 50\n        ORDER BY level DESC\n        \"\"\";"
   },
   {
    "t": "h",
    "text": "虚拟线程与游戏服线程模型"
   },
   {
    "t": "p",
    "text": "虚拟线程（JDK21 正式，JEP 444）：JVM 调度的轻量级线程，载体线程（carrier）上可挂载成千上万个虚拟线程，阻塞时自动卸载让出载体——让「一请求一线程」的同步写法获得异步吞吐量。与平台线程对比：平台线程 1:1 映射 OS 线程、栈 MB 级、创建贵；虚拟线程 M:N、栈几百字节起步、可百万级。两个坑：synchronized 块内阻塞会 pin 住载体不卸载（阻塞段用 ReentrantLock），可加 -Djdk.tracePinnedThreads 排查；它提升并发数不是单任务速度，CPU 密集零收益。对游戏服：Netty+Disruptor 的核心价值是玩家维度串行化，虚拟线程不保证同一 key 同线程，不能取代；适用旁路——GM 后台、日志上报、渠道回调、跨服 HTTP。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 虚拟线程：每任务一线程，百万级并发\nExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();\nexecutor.submit(() -> handleGmRequest(req));\n// 不要池化虚拟线程：创建廉价，池化反而引入竞争\n// 注意：synchronized 内阻塞会 pin 载体\nsynchronized (lock) {           // 阻塞段改 ReentrantLock\n    Thread.sleep(100);          // 这里会钉住 carrier\n}\n// 排查 pin：-Djdk.tracePinnedThreads=full\n// 游戏服判断：不能取代 Netty+Disruptor 的玩家串行化\n// 但 GM 后台/日志/支付回调等旁路 IO 密集任务很适合"
   },
   {
    "t": "pits",
    "items": [
     "版本对不上是硬伤：record 是 16 转正不是 14；sealed 是 17；虚拟线程是 21",
     "switch 表达式旧冒号语法 vs 新箭头语法要分清，箭头语法用 yield 返回值",
     "record 是 final 类不能继承；组件不可变，池化/序列化框架兼容性要验证",
     "虚拟线程不是更快而是更省：CPU 密集任务零收益",
     "升级别追每个版本：跟随 LTS（8/11/17/21/25），游戏服存量保守"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：JDK8 奠定函数式基础，9-11 补模块化/var/Compact Strings，17/21 集中落地 record/sealed/switch 模式/虚拟线程，25 以性能为主。新项目选 17/21，存量服跟随 LTS。落地建议：DTO 用 record、状态机用 sealed+switch 模式匹配、文本块写 SQL、虚拟线程用于旁路 IO 密集任务而非核心玩家逻辑。技术选型跟团队 JDK 版本走。"
   }
  ]
 },
 {
  "id": "java-basic-charset",
  "title": "编码与字符集",
  "layer": 3,
  "depends": [
   "java-basic-string",
   "java-basic-io-serialization"
  ],
  "covers": [
   "java-basic-33"
  ],
  "quiz": [
   "java-basic-33",
   "java-basic-08",
   "java-basic-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Unicode、UTF-8、GBK 到底是什么关系？String.length() 是字符数吗？emoji 为什么占 2 个 char？new String(bytes) 不指定编码会怎样？游戏协议、验签、Excel 导表、MySQL 存储里有哪些必踩的编码坑？本文一次讲清。"
   },
   {
    "t": "pre",
    "items": [
     "了解 String 底层与 length() 语义",
     "了解字节流读写的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "字符集 vs 编码方案"
   },
   {
    "t": "p",
    "text": "Unicode 是字符集（给每个字符编号的码点表），UTF-8/UTF-16/GBK 是编码方案（码点 → 字节）。Java 内部 String 用 UTF-16，出 JVM 做 IO 才涉及编码转换。UTF-8 变长 1~4 字节、ASCII 兼容、中文 3 字节，是网络传输事实标准。GBK 中文 2 字节、Windows 简体中文默认，与 UTF-8 互转必乱码。UTF-16 定长 2 字节（BMP 内），Java char 就是 16 位 UTF-16 code unit。UTF-32 定长 4 字节，空间浪费严重很少用。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"40\" y=\"20\" width=\"250\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"165\" y=\"43\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Unicode 字符集（码点表）</text>\n  <text x=\"165\" y=\"63\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">U+4E2D = 「中」</text>\n  <rect x=\"350\" y=\"20\" width=\"250\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"475\" y=\"43\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">编码方案（码点→字节）</text>\n  <text x=\"475\" y=\"63\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">UTF-8 / UTF-16 / GBK</text>\n  <rect x=\"40\" y=\"95\" width=\"180\" height=\"85\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"130\" y=\"122\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">UTF-8</text>\n  <text x=\"130\" y=\"146\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">变长 1-4 字节，ASCII 兼容</text>\n  <text x=\"130\" y=\"166\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">中文 3 字节，网络事实标准</text>\n  <rect x=\"235\" y=\"95\" width=\"180\" height=\"85\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"325\" y=\"122\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">UTF-16</text>\n  <text x=\"325\" y=\"146\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">Java char 语义（code unit）</text>\n  <text x=\"325\" y=\"166\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">BMP 内 2 字节</text>\n  <rect x=\"430\" y=\"95\" width=\"180\" height=\"85\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"520\" y=\"122\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">GBK</text>\n  <text x=\"520\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">中文 2 字节</text>\n  <text x=\"520\" y=\"166\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">Windows 简体中文默认，易乱码</text>\n  <rect x=\"40\" y=\"200\" width=\"570\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"325\" y=\"226\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">三个长度各说各话</text>\n  <text x=\"325\" y=\"250\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">length() 数 char（UTF-16 code unit）；字节数看编码；真字符数 codePointCount()</text>\n  <text x=\"325\" y=\"272\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">emoji：占 2 个 char、UTF-8 下 4 字节、一个码点</text>\n</svg>",
    "caption": "图 14：Unicode 字符集与编码方案的层级，及「三个长度」的差异"
   },
   {
    "t": "h",
    "text": "编码乱码的定位方法论"
   },
   {
    "t": "p",
    "text": "乱码的本质是「编码与解码不一致」：字节序列按 A 编码、按 B 解码。定位三步：看字节（十六进制 dump）确认真实编码；确认读取方用的解码编码；统一两边。常见乱码特征：UTF-8 被 GBK 读出现「锟斤拷」（0xEFBFBD 替换字符的 GBK 演绎）、GBK 被 UTF-8 读出「？？？」或错误替换。new String(bytes) / getBytes() 不指定编码就用平台默认：Windows 服务器 GBK、Linux UTF-8，同一份代码不同环境结果不同——必须显式 StandardCharsets.UTF_8。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 铁律：所有编码转换显式指定\nString s = new String(bytes, StandardCharsets.UTF_8);       // 解码\nbyte[] out = s.getBytes(StandardCharsets.UTF_8);            // 编码\n// 读文件/流也显式：InputStreamReader 第二参\nBufferedReader reader = new BufferedReader(new InputStreamReader(\n        new FileInputStream(\"items.csv\"), StandardCharsets.UTF_8));\n// 乱码定位：dump 十六进制\nfor (byte b : bytes) System.out.printf(\"%02X \", b);\n// 中文 \"中\" 的 UTF-8 是 E4 B8 AD；GBK 是 D6 D0\n// 若 dump 出 EF BF BD：说明已是被替换的 U+FFFD，原字节已丢"
   },
   {
    "t": "h",
    "text": "游戏项目四个编码实战坑"
   },
   {
    "t": "p",
    "text": "一、协议定长字符串：客户端按字节截断、服务器按 char 截断，中文昵称被截半个字显示乱码——协议字符串统一 UTF-8 + 字节长度前缀。二、登录 token/签名 getBytes() 未指定编码，渠道侧（GBK 环境生成）与服务器（UTF-8）验签不一致，偶发登录失败极难复现。三、策划 Excel 是 GBK，导表工具按 UTF-8 读，中文配置全变「锟斤拷」——InputStreamReader 显式指定编码。四、MySQL 表 latin1 存 emoji 昵称报错/丢失——全库统一 utf8mb4。另外 UTF-8 BOM（EF BB BF）会让协议首字段多出 3 字节导致解析错位，文本协议与 JSON 文件应保存为无 BOM。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 昵称长度校验：码点边界截断，避免截出孤代理\npublic static String truncateByCodepoints(String s, int maxCp) {\n    int len = s.codePointCount(0, s.length());\n    if (len <= maxCp) return s;\n    int end = s.offsetByCodePoints(0, maxCp);\n    return s.substring(0, end);\n}\n// 协议字符串统一带字节长度前缀（长度头 + UTF-8 字节）\nbyte[] nameBytes = name.getBytes(StandardCharsets.UTF_8);\nbuf.writeShort(nameBytes.length);\nbuf.writeBytes(nameBytes);\n// 签名/验签两侧显式 UTF-8\nString sign = HmacSHA256(baseStr.getBytes(StandardCharsets.UTF_8), key);"
   },
   {
    "t": "pits",
    "items": [
     "String.length() 不是字符数也不是字节数，是 UTF-16 code unit 数",
     "char 能存 BMP 内汉字，但存不了 emoji（需一对 surrogate）",
     "new String/getBytes 不指定编码 = 平台默认，跨环境结果不同",
     "substring 从代理对中间截断产生孤代理显示为「�」",
     "UTF-8 BOM 让协议首字段错位、JSON 解析报错，必须无 BOM"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Unicode 是字典、UTF-8/GBK 是抄写格式；乱码 = 编码解码不一致，定位靠 dump 字节 + 显式编码。游戏服四原则：协议字符串统一 UTF-8 + 字节长度前缀；所有转换显式 StandardCharsets.UTF_8；Excel/CSV 按实际编码读；DB 统一 utf8mb4。三个长度（char/字节/码点）各说各话，昵称校验用 codePointCount。"
   }
  ]
 },
 {
  "id": "java-basic-utils-json",
  "title": "常用工具库与 JSON",
  "layer": 3,
  "depends": [
   "java-basic-string",
   "java-basic-collections"
  ],
  "covers": [
   "java-basic-26",
   "java-basic-32",
   "java-basic-14"
  ],
  "quiz": [
   "java-basic-26",
   "java-basic-32",
   "java-basic-14"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Guava 和 Apache Commons 有哪些高频 API？Jackson/Gson/Fastjson 怎么选？反序列化安全为什么是红线？SLF4J + Log4j2/Logback 的绑定机制是什么？本文把游戏服日常依赖的工具栈讲全。"
   },
   {
    "t": "pre",
    "items": [
     "掌握集合与字符串处理",
     "了解 SPI 机制（见注解 SPI 篇）"
    ]
   },
   {
    "t": "h",
    "text": "Guava 高频 API"
   },
   {
    "t": "p",
    "text": "Guava 是 Google 的 Java 工具库，游戏服高频用的：ImmutableList/ImmutableMap（不可变集合，防配置被改）、Lists/Collections2（集合工厂）、Multimap（一键多值，如按职业分组）、BiMap（双向映射）、CacheBuilder（本地缓存，带过期/权重，比手写 LRU 强）、Preconditions（参数校验，checkArgument/checkNotNull）、Strings（判空工具）。Caffeine 是 Guava Cache 的继任者，性能更好。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Guava 不可变集合：配置表只读保护\nImmutableMap<Long, ItemConfig> configs = ImmutableMap.copyOf(rawMap);\n// Multimap：职业 -> 玩家列表\nMultimap<Job, Player> byJob = ArrayListMultimap.create();\nfor (Player p : players) byJob.put(p.getJob(), p);\n// 本地缓存：比 LinkedHashMap LRU 更强的过期策略\nCache<Long, PlayerProfile> cache = Caffeine.newBuilder()\n        .maximumSize(10_000)\n        .expireAfterWrite(Duration.ofMinutes(5))\n        .build(key -> playerService.loadFromDb(key));   // 回源函数\n// Preconditions 参数校验\nPreconditions.checkArgument(amount > 0, \"amount must > 0\");"
   },
   {
    "t": "h",
    "text": "Apache Commons 高频 API"
   },
   {
    "t": "p",
    "text": "Apache Commons 系列是传统工具库：commons-lang3 的 StringUtils（isBlank/join/abbreviate）、ObjectUtils、RandomStringUtils；commons-collections4 的 CollectionUtils（isNotEmpty/union/intersection）、MapUtils；commons-io 的 IOUtils（copy/closeQuietly）、FileUtils。注意 StringUtils.isBlank 会忽略空白字符、isEmpty 只看 null 和空串。游戏服 GM 后台导出、日志格式化、字段拼接常用这些。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// commons-lang3\nStringUtils.isBlank(s);              // null/空/全空白\nStringUtils.join(list, \",\");         // 列表转字符串\nStringUtils.abbreviate(nick, 20);    // 超长省略，日志友好\n// commons-io\nIOUtils.toString(inputStream, StandardCharsets.UTF_8);\nFileUtils.writeStringToFile(file, json, StandardCharsets.UTF_8);\n// 注意：commons-beanutils BeanUtils.copyProperties 是浅拷贝，嵌套对象共享引用"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"20\" width=\"580\" height=\"45\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"47\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">主流 JSON 库对比（游戏服选型）</text>\n  <rect x=\"30\" y=\"85\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"122\" y=\"112\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">Jackson（推荐）</text>\n  <text x=\"122\" y=\"136\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">性能优/生态最好</text>\n  <text x=\"122\" y=\"156\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">Spring Boot 默认集成</text>\n  <text x=\"122\" y=\"176\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">支持 record/本地化日期</text>\n  <text x=\"122\" y=\"196\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">安全配置成熟</text>\n  <rect x=\"228\" y=\"85\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"112\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Gson</text>\n  <text x=\"320\" y=\"136\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">Google 出品，API 简洁</text>\n  <text x=\"320\" y=\"156\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">默认无字段顺序控制</text>\n  <text x=\"320\" y=\"176\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">性能中上</text>\n  <text x=\"320\" y=\"196\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">小型工具可用</text>\n  <rect x=\"426\" y=\"85\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"518\" y=\"112\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">Fastjson（慎用）</text>\n  <text x=\"518\" y=\"136\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">历史性能激进</text>\n  <text x=\"518\" y=\"156\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">反序列化 RCE 漏洞史</text>\n  <text x=\"518\" y=\"176\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">autoType 默认关闭</text>\n  <text x=\"518\" y=\"196\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">新项目不建议</text>\n  <rect x=\"30\" y=\"225\" width=\"580\" height=\"55\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"320\" y=\"249\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">反序列化安全红线</text>\n  <text x=\"320\" y=\"271\" font-size=\"13\" fill=\"var(--muted)\" text-anchor=\"middle\">外部输入解析：白名单/禁用多态反序列化；网关入站 JSON 用 Jackson + activateDefaultTyping 关闭</text>\n</svg>",
    "caption": "图 15：Jackson/Gson/Fastjson 对比与反序列化安全红线"
   },
   {
    "t": "h",
    "text": "反序列化安全"
   },
   {
    "t": "p",
    "text": "JSON 反序列化的安全风险：解析器支持多态类型（@type/autoType）时，攻击者可指定任意类触发 gadget 链，导致 RCE。Fastjson 历史上多次爆出此类漏洞（autoType 默认关闭后仍出绕过）。Jackson 的 enableDefaultTyping 也危险。安全实践：对外部输入禁用多态反序列化；必须用多态时维护白名单（Jackson activateDefaultTyping + Validator 或子类型过滤）；数据来源可信（服务器内部缓存）才放宽。Gson 默认不支持多态相对安全，但功能受限。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Jackson：禁用多态反序列化（对外部输入）\nObjectMapper mapper = new ObjectMapper();\nmapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);\n// 不要开启：mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);  // 危险！\n// 游戏服协议入站：先字节校验再反序列化\nbyte[] body = ctx.frame();\nif (!checkCrc(body)) { reject(ctx); return; }\nGameRequest req = mapper.readValue(body, GameRequest.class);\n// 泛型反序列化必须 TypeReference（擦除后拿不到元素类型）\nList<Player> list = mapper.readValue(json, new TypeReference<List<Player>>() {});"
   },
   {
    "t": "h",
    "text": "日志框架：SLF4J + Log4j2/Logback"
   },
   {
    "t": "p",
    "text": "SLF4J 是门面（API），Logback/Log4j2 是实现，靠 SPI 机制在 META-INF/services 绑定实现——这就是 SLF4J 与 SPI 的关联。日志服实践：用占位符 {} 而不是 + 拼接（延迟到判断级别后）；debug 级别用 isDebugEnabled() 守护；异步日志（AsyncAppender）避免写盘阻塞业务线程；MDC（Mapped Diagnostic Context）给日志加玩家 ID 做链路追踪；Log4j2 曾有 JNDI 注入漏洞（CVE-2021-44228），升级到 2.17+。游戏服日志链路：MDC.put(\"playerId\", id) 后整条链路都能追溯。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// SLF4J 占位符 + MDC 链路\nprivate static final Logger log = LoggerFactory.getLogger(LoginHandler.class);\n// 入口设置 MDC：日志链路带玩家 ID\nMDC.put(\"pid\", String.valueOf(playerId));\ntry {\n    log.info(\"player login, cost {} ms\", costMs);   // 占位符，非字符串拼接\n} finally {\n    MDC.remove(\"pid\");\n}\n// 级别守护：debug 参数组装昂贵时\nif (log.isDebugEnabled()) {\n    log.debug(\"session detail: {}\", session.toString());\n}\n// logback.xml：异步 Appender 配置\n// <appender name=\"ASYNC\" class=\"ch.qos.logback.classic.AsyncAppender\">\n//   <appender-ref ref=\"FILE\"/>\n// </appender>"
   },
   {
    "t": "pits",
    "items": [
     "Fastjson autoType 漏洞史：新项目别选，历史项目升级最新版",
     "Jackson enableDefaultTyping 对外部输入是 RCE 红线",
     "反序列化泛型 List<Player> 不写 TypeReference 会拿到 List<LinkedHashMap>",
     "SLF4J 是门面不是实现，不引入实现 jar 直接 NoClassDefFoundError",
     "Log4j2 有 JNDI 注入 CVE，务必 2.17+；异步日志注意队列积压丢日志"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Guava 的不可变集合/Multimap/Caffeine 缓存/Preconditions 是游戏服高频工具；Commons 的 StringUtils/IOUtils 处理日常文本 IO。JSON 选 Jackson（Spring Boot 默认、生态成熟），反序列化对外部输入禁用多态、泛型用 TypeReference。日志用 SLF4J 门面 + Logback/Log4j2，占位符 + MDC 链路 + 异步 Appender，并警惕 Log4j2 JNDI 漏洞版本。"
   }
  ]
 },
 {
  "id": "java-basic-testing",
  "title": "单元测试与代码质量",
  "layer": 3,
  "depends": [
   "java-basic-exception",
   "java-basic-reflection"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "JUnit5 怎么组织测试？Mockito 怎么打桩？断言、参数化测试、覆盖率怎么用？重构和代码异味是什么？CodeReview 看哪些点？本文给出游戏服可落地的测试与质量实践。"
   },
   {
    "t": "pre",
    "items": [
     "掌握异常与依赖注入概念",
     "了解 Spring 测试基础"
    ]
   },
   {
    "t": "h",
    "text": "JUnit5 结构与断言"
   },
   {
    "t": "p",
    "text": "JUnit5 由 JUnit Platform + Jupiter + Vintage 组成。核心注解：@Test、@BeforeEach/@AfterEach（每个测试前后）、@BeforeAll/@AfterAll（类级别一次）、@DisplayName（中文描述）、@Disabled。断言用 Assertions.assertEquals/assertTrue/assertThrows/assertTimeout。参数化测试 @ParameterizedTest + @ValueSource/@CsvSource/@MethodSource 让一个测试方法跑多组数据——配置校验、协议解析边界用例特别适合。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// JUnit5 基础结构\nclass PlayerServiceTest {\n    private PlayerService service;\n    @BeforeEach void setUp() { service = new PlayerService(); }\n    @Test @DisplayName(\"等级提升校验\") \n    void levelUp() {\n        assertTrue(service.canLevelUp(player, cost));\n        assertThrows(GameBizException.class, () -> service.levelUp(player, 0));\n    }\n    // 参数化：协议解析边界\n    @ParameterizedTest\n    @CsvSource({\"0,0,FAIL\", \"1,1,OK\", \"65535,65535,OK\"})\n    void parseBoundary(int cmd, int len, String expect) {\n        assertEquals(expect, parser.check(cmd, len));\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"20\" width=\"580\" height=\"45\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"47\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">单元测试金字塔与 Mock 边界</text>\n  <polygon points=\"320,70 520,220 120,220\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <rect x=\"30\" y=\"105\" width=\"580\" height=\"55\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"128\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">UI/集成测试（少）</text>\n  <text x=\"320\" y=\"148\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">接口冒烟、全链路：成本高，只覆盖主路径</text>\n  <rect x=\"30\" y=\"175\" width=\"580\" height=\"55\" rx=\"8\" fill=\"var(--lv2)\"/>\n  <text x=\"320\" y=\"198\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">服务测试（中）</text>\n  <text x=\"320\" y=\"218\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">SpringBootTest + 内存库/嵌入式中间件，验证装配与事务</text>\n  <rect x=\"30\" y=\"245\" width=\"580\" height=\"45\" rx=\"8\" fill=\"var(--lv3)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"265\" font-size=\"14\" fill=\"var(--panel)\" text-anchor=\"middle\">单元测试（多，Mockito 隔离）</text>\n  <text x=\"320\" y=\"283\" font-size=\"12\" fill=\"var(--panel)\" text-anchor=\"middle\">纯逻辑快跑，依赖用 Mock 打桩</text>\n</svg>",
    "caption": "图 16：测试金字塔：单元测试最多最快，集成测试少而全"
   },
   {
    "t": "h",
    "text": "Mockito 打桩与行为验证"
   },
   {
    "t": "p",
    "text": "Mockito 用于隔离被测类的外部依赖（DAO、RPC、Redis 客户端）。核心 API：mock 创建、when(...).thenReturn(...) 打桩、verify 验证调用、ArgumentCaptor 捕获参数、@Mock/@InjectMocks 注解 + MockitoExtension。游戏服测试经验：排行榜计算、战斗公式、发奖逻辑这种纯函数适合单测；数据库、Redis 用 Mock 或 Testcontainers；异步线程模型（Disruptor）测试用 Awaitility 等待。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "import static org.mockito.Mockito.*;\n@ExtendWith(MockitoExtension.class)\nclass SettlementServiceTest {\n    @Mock PlayerDao playerDao;\n    @Mock MailService mailService;\n    @InjectMocks SettlementService settlement;\n    @Test @DisplayName(\"公会战结算发奖\") \n    void settle() {\n        when(playerDao.findById(10001L)).thenReturn(player);\n        boolean ok = settlement.reward(10001L, rewardConfig);\n        verify(mailService, times(1)).send(eq(10001L), any(Reward.class));\n        verify(playerDao).updatePower(eq(10001L), anyLong());\n    }\n    @Test @DisplayName(\"玩家离线不结算\") \n    void offlineSkip() {\n        when(playerDao.findById(10001L)).thenReturn(null);\n        assertFalse(settlement.reward(10001L, rewardConfig));\n        verifyNoInteractions(mailService);\n    }\n}"
   },
   {
    "t": "h",
    "text": "覆盖率、重构与代码异味"
   },
   {
    "t": "p",
    "text": "覆盖率指标：行覆盖（line）、分支覆盖（branch）、语句覆盖。达标门槛常见 80%（行）+ 70%（分支），但覆盖率不是目的——关键业务路径（发奖、扣费、状态机转移）必须覆盖。代码异味（Code Smell）：过长方法、过深嵌套、魔法数字、重复代码、类过大、过多参数。重构手段：提取方法、引入常量、拆分大类、组合优于继承。游戏服高危代码异味：协议处理巨型 switch、配置校验逻辑散落、状态字段 int 散着 if。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 异味：魔法数字 + 深嵌套\nif (p.getLevel() >= 30 && p.getGold() >= 10000 && p.getVip() >= 3) { ... }\n// 重构：引入常量 + 提取方法\nprivate static final int VIP_FORGE_LV = 30;\nprivate static final int VIP_FORGE_GOLD = 10_000;\nboolean canForge = canAccess(Player p) {\n    return p.getLevel() >= VIP_FORGE_LV\n        && p.getGold() >= VIP_FORGE_GOLD\n        && p.getVip() >= 3;\n}\n// 配置校验集中化：导表工具启动期校验，错误左移\n// 校验逻辑 -> 唯一入口 validateAll(configs)，坏配置直接启动失败"
   },
   {
    "t": "h",
    "text": "CodeReview 关注点"
   },
   {
    "t": "p",
    "text": "游戏服 CodeReview 按优先级看：一、并发正确性——共享 Map 是否用并发容器、玩家数据是否跨线程泄漏、复合操作是否原子（get-then-put）；二、资源生命周期——IO/连接/定时任务是否关闭、Netty handler 是否泄漏外部引用；三、业务安全——金额计算是否 BigDecimal、幂等/防重是否到位、配置数值是否越界；四、性能——热路径是否装箱、是否频繁创建对象、日志是否拼接；五、可读性——方法是否过长、命名是否自解释、是否有魔法数字。RuoYi 重构时我们重点梳理过权限与日志链路。"
   },
   {
    "t": "pits",
    "items": [
     "覆盖率 100% 不等于正确：没断言、测实现细节的测试是垃圾测试",
     "Mock 一切导致测试与真实行为脱节：外部依赖 mock，纯逻辑不 mock",
     "测试里写 Thread.sleep 等时序：用 Awaitility 轮询等待",
     "不测异常分支：assertThrows + 边界值（0/负数/超大）必须覆盖",
     "代码异味不治：状态字段散 if、魔法数字、巨型方法，越拖越难改"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：JUnit5 + Mockito 搭建测试骨架：纯逻辑函数（战斗公式/发奖/配置校验）是单测主战场，外部依赖 mock 隔离，参数化测试覆盖边界。覆盖率 80/70 是常用门槛但关键路径优先。重构从魔法数字、深嵌套、巨型方法入手。CodeReview 五板斧：并发正确性、资源生命周期、业务安全、性能、可读性。"
   }
  ]
 },
 {
  "id": "java-basic-pitfalls",
  "title": "Java 易错点深水区",
  "layer": 3,
  "depends": [
   "java-basic-data-types",
   "java-basic-string",
   "java-basic-collections"
  ],
  "covers": [
   "java-basic-08",
   "java-basic-09",
   "java-basic-25",
   "java-basic-28"
  ],
  "quiz": [
   "java-basic-08",
   "java-basic-09",
   "java-basic-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "== vs equals、值传递还是引用传递、finally/return、Integer 比较陷阱、String 拼接、toArray 与数组转换……这些面试高频坑合集，每个都是线上事故的温床。本文把它们集中拆解，附判断口诀。"
   },
   {
    "t": "pre",
    "items": [
     "已学完数据类型、字符串、集合三篇",
     "建议先做前文的随堂小测"
    ]
   },
   {
    "t": "h",
    "text": "坑 1：== 与 equals"
   },
   {
    "t": "p",
    "text": "== 比较基本类型比值、引用类型比地址；equals 默认也是比地址，String/包装类重写后比内容。String a=\"abc\" 与 new String(\"abc\")：字面量在常量池、new 在堆，== 为 false；intern() 可把堆对象引用/值入池返回池引用。包装类 Integer 缓存 -128~127，128 起 == 为 false。判断口诀：基本类型 == 比值，对象 == 比引用，内容相等用 equals；包装类混合 == 会先拆箱。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 坑 1：== 与 equals\nString s1 = \"abc\", s2 = \"abc\", s3 = new String(\"abc\");\nSystem.out.println(s1 == s2);      // true 常量池复用\nSystem.out.println(s1 == s3);      // false 堆对象 vs 池对象\nSystem.out.println(s1.intern() == s3.intern());  // true 都入池\nInteger a = 127, b = 127;\nSystem.out.println(a == b);        // true 缓存\nInteger c = 128, d = 128;\nSystem.out.println(c == d);        // false 缓存外各建对象\nSystem.out.println(c.equals(d));   // true"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"20\" width=\"580\" height=\"40\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"46\" font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\">面试高频坑合集速查表</text>\n  <rect x=\"30\" y=\"75\" width=\"280\" height=\"95\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"170\" y=\"100\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">值传递陷阱</text>\n  <text x=\"170\" y=\"124\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">Java 只有值传递，对象传引用副本</text>\n  <text x=\"170\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">重赋值不影响实参，改字段影响实参</text>\n  <text x=\"170\" y=\"164\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">swap(Integer,Integer) 必失败</text>\n  <rect x=\"330\" y=\"75\" width=\"280\" height=\"95\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"470\" y=\"100\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">finally + return 陷阱</text>\n  <text x=\"470\" y=\"124\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">finally return 覆盖 try 返回值</text>\n  <text x=\"470\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">finally 吞掉未处理异常</text>\n  <text x=\"470\" y=\"164\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">返回值先在 finally 前算好</text>\n  <rect x=\"30\" y=\"185\" width=\"280\" height=\"95\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"170\" y=\"210\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">String 拼接陷阱</text>\n  <text x=\"170\" y=\"234\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">循环用 + 每次 new StringBuilder</text>\n  <text x=\"170\" y=\"256\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">纯字面量编译期折叠为常量</text>\n  <text x=\"170\" y=\"274\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">含变量 JDK9 走 StringConcatFactory</text>\n  <rect x=\"330\" y=\"185\" width=\"280\" height=\"95\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"470\" y=\"210\" font-size=\"14\" fill=\"var(--ink)\" text-anchor=\"middle\">toArray/集合转换陷阱</text>\n  <text x=\"470\" y=\"234\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">toArray() 返回 Object[] 转类型 ClassCast</text>\n  <text x=\"470\" y=\"256\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">toArray(new T[0]) vs new T[n] 性能</text>\n  <text x=\"470\" y=\"274\" font-size=\"12\" fill=\"var(--muted)\" text-anchor=\"middle\">asList 是定长视图，add 抛异常</text>\n</svg>",
    "caption": "图 17：五大高频坑速查：值传递/finally/String/toArray/asList"
   },
   {
    "t": "h",
    "text": "坑 2：值传递还是引用传递"
   },
   {
    "t": "p",
    "text": "结论：Java 只有值传递。基本类型传值副本；对象类型传「引用的副本」——方法里给形参重新赋值不影响实参（副本换了指向），但通过形参修改对象字段影响实参（同一堆对象）。swap(Integer a, Integer b) 无效：交换的是引用副本；且 Integer 有缓存池更添迷惑。游戏启示：协议对象在多个 handler 间传递要明确「共享可变」还是「拷贝防御」，跨线程传递要么只读要么拷贝。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 值传递验证\nstatic void swap(Integer a, Integer b) {\n    Integer t = a; a = b; b = t;   // 交换引用副本，实参不变\n}\nInteger x = 1, y = 2;\nswap(x, y);\nSystem.out.println(x + \",\" + y);   // 1,2 没换\n// 改字段影响实参\nstatic void levelUp(Player p) {\n    p.setLevel(p.getLevel() + 1);   // 同一堆对象被改\n}\n// 跨线程防御：拷贝而非共享可变\nPlayer copy = player.snapshot();    // 快照拷贝，防并发中间态"
   },
   {
    "t": "h",
    "text": "坑 3：finally/return 与异常误用"
   },
   {
    "t": "p",
    "text": "finally 里的 return 会覆盖 try/catch 的返回值，甚至吞掉未处理异常——编码禁忌。另外 try-catch 的 return 值在 finally 执行前已确定（若 finally 不 return），但对象引用类型改字段仍会生效。异常构造昂贵（填充栈），热循环里不要用异常做流程控制。catch(Exception e){} 空块吞异常是线上事故头号元凶。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "static int bad() {\n    try { return 1; } finally { return 2; }   // 结果恒 2，且吞异常\n}\nstatic int good() {\n    int r;\n    try { r = compute(); }\n    finally { release(); }    // finally 只清理，不 return\n    return r;\n}\n// 热循环别用异常控流\n// for (int i = 0; ; i++) { try { x = arr[i]; } catch (ArrayIndexOutOfBounds e) { break; } }  // 反模式"
   },
   {
    "t": "h",
    "text": "坑 4：数组/集合转换与 asList"
   },
   {
    "t": "p",
    "text": "集合转数组：list.toArray() 返回 Object[]，强转 String[] 会 ClassCastException，正确写法 list.toArray(new String[0])。Arrays.asList 返回 Arrays$ArrayList（定长视图），add/remove 抛 UnsupportedOperationException，且与源数组共享数据。数组转集合后改数组元素集合也变。集合嵌套（集合存集合）泛型擦除后元素是 LinkedHashMap。另外 List.subList 是视图而非拷贝，改原列表 subList 失效。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 正确转数组：指定类型\nString[] arr = list.toArray(new String[0]);\n// 错误：Object[] 直接强转\n// String[] bad = (String[]) list.toArray();  // ClassCastException\n// asList 陷阱\nList<String> fixed = Arrays.asList(\"a\", \"b\");\n// fixed.add(\"c\");  // UnsupportedOperationException！定长视图\n// subList 是视图：改原 list 后 subList 行为不确定\nList<String> sub = list.subList(0, 2);\nlist.clear();       // sub 再操作会 ConcurrentModificationException\n// 新建可变副本\nList<String> mutable = new ArrayList<>(Arrays.asList(\"a\", \"b\"));"
   },
   {
    "t": "h",
    "text": "坑 5：拆箱 NPE 与溢出"
   },
   {
    "t": "p",
    "text": "Map<Long,Integer> 取值直接赋 int 变量：get 返回 null 拆箱必 NPE 且堆栈迷惑。int 溢出静默：a - b 在比较/排序里翻车，用 Integer.compare。Long 玩家 ID 与 int 混用精度丢失。Integer 混合 long 比较：Integer a=1; long b=1; a==b 先拆箱成 int 再提升 long 比数值为 true。游戏服数值：战力、金币用 long 承载乘法中间值，避免溢出。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 拆箱 NPE\nMap<Long, Integer> hpMap = new HashMap<>();\nint hp = hpMap.getOrDefault(10001L, 0);   // getOrDefault 防 null\n// int hp = hpMap.get(10001L);   // null 拆箱 NPE\n// 溢出陷阱\nint a = Integer.MAX_VALUE, b = -1;\n// System.out.println(a - b < 0);  // 溢出成负数！\nSystem.out.println(Integer.compare(a, b) > 0);  // 正确\n// Long 玩家 ID 别转 int\nlong playerId = 30_0000_0000L;   // 超过 int 上限\n// int id = (int) playerId;       // 精度丢失\n// 大数中间值用 long/BigDecimal 承接"
   },
   {
    "t": "pits",
    "items": [
     "String 用 == 比较内容：字面量可能相等，new 的必不相等——一律 equals",
     "swap(Integer,Integer) 换不了值：值传递 + 引用副本，面试必考",
     "finally 里 return 覆盖返回值并吞异常，编码禁忌",
     "asList 是定长视图不能增删；subList 是视图受原表影响",
     "拆箱 NPE 堆栈迷惑、int 溢出静默——数值边界要显式处理"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：五大深水区口诀——「== 比引用、equals 比内容；Java 只有值传递，对象传引用副本；finally 只清理不 return；集合转数组用 toArray(new T[0])，asList 是定长视图；拆箱防 NPE、溢出用 compare」。这些坑每个都在游戏服线上真实发生过，面试时能主动说出来就是加分项。"
   }
  ]
 }
]
};
