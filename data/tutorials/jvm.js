window.TB = window.TB || {};
window.TB["jvm"] = {
  id: "jvm",
  name: "JVM",
  icon: "☕",
  nodes: [
 {
  "id": "jvm-memory-objects",
  "title": "内存区域划分与对象的一生",
  "layer": 0,
  "depends": [],
  "covers": [
   "jvm-01",
   "jvm-02",
   "jvm-25",
   "jvm-34"
  ],
  "quiz": [
   "jvm-01",
   "jvm-02",
   "jvm-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "本节点把 JVM 的五块内存区域、对象从 new 到回收的一生讲透——这是后续所有 GC、调优、排查内容的地基。"
   },
   {
    "t": "pre",
    "items": [
     "会写 Java 类与对象，知道 static 字段和构造器的作用",
     "理解「栈里存引用、堆里存对象」的基础认知",
     "本节点自包含，不依赖任何 GC 知识"
    ]
   },
   {
    "t": "h",
    "text": "先记住一句话：两块共享，三块私有"
   },
   {
    "t": "p",
    "text": "JVM 运行时数据区共五块：程序计数器、虚拟机栈、本地方法栈是线程私有的；堆、方法区（JDK8 起叫元空间）是线程共享的。判据很简单——会不会被多个线程同时访问：方法执行的现场是每线程一份，所以栈和计数器私有；对象和类元数据谁都要用，所以共享。"
   },
   {
    "t": "list",
    "items": [
     "程序计数器：当前线程执行的字节码行号，唯一一个不会抛 OutOfMemoryError 的区域",
     "虚拟机栈：每个方法一个栈帧，装局部变量表、操作数栈、动态链接、返回地址；栈深到极限抛 StackOverflowError，无法扩展抛 OOM",
     "本地方法栈：为 native 方法服务，HotSpot 里与虚拟机栈合并实现",
     "堆：对象与数组的分配区，GC 主战场，内部再分 Eden、Survivor0/1、老年代",
     "方法区/元空间：存类元信息、运行时常量池、静态变量；JDK8 起用本地内存的 Metaspace 替代永久代"
    ]
   },
   {
    "t": "p",
    "text": "为什么 JDK8 要干掉永久代？永久代大小固定还跟堆的 GC 耦合，热部署/动态代理加载类一多就 PermGen OOM；元空间用操作系统本地内存，按需扩展，只受 -XX:MaxMetaspaceSize 限制（默认不限），类卸载更彻底。另一个高频混淆点：字符串常量池 JDK7 就已从永久代搬到堆里，JDK8 的元空间里并没有字符串池。"
   },
   {
    "t": "h",
    "text": "对象的一生：从 new 到落地"
   },
   {
    "t": "p",
    "text": "new 一个对象走五步：类加载检查（找不到类先触发加载）→ 分配内存 → 字段零值初始化 → 设置对象头 → 执行构造器。分配内存有两种姿势：堆规整时用指针碰撞（挪指针即可），堆碎片化时用空闲列表（要维护可用块）。并发分配靠两条路兜底：CAS + 失败重试，或 TLAB——每个线程在 Eden 里预占一小块缓冲，分配只在自己缓冲内挪指针，全程无锁。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// TLAB 与对象分配：战斗服每帧成千上万个临时对象\npublic class BattleCalc {\n    static DamageEvent calc(int atk, int def) {\n        DamageEvent e = new DamageEvent();  // 在 TLAB 内挪指针，无锁分配\n        e.value = Math.max(1, atk - def);\n        return e;   // 对象逃逸到调用方，无法标量替换\n    }\n}"
   },
   {
    "t": "p",
    "text": "对游戏服的意义：战斗结算、寻路、协议编解码都在疯狂 new 小对象，TLAB 让这些分配接近「线程私有」，是控制 Minor GC 频率的第一道防线。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 380'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>JVM 运行时内存区域（JDK8+）</text>\n  <rect x='18' y='40' width='296' height='172' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='32' y='62' font-size='13' fill='var(--lv1)' font-weight='bold'>线程私有（每线程一份）</text>\n  <rect x='32' y='72' width='268' height='38' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='42' y='95' font-size='12' fill='var(--ink)'>程序计数器 - 字节码行号，唯一不 OOM</text>\n  <rect x='32' y='114' width='268' height='38' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='42' y='137' font-size='12' fill='var(--ink)'>虚拟机栈 - 栈帧（局部变量表等）</text>\n  <rect x='32' y='156' width='268' height='38' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='42' y='179' font-size='12' fill='var(--ink)'>本地方法栈 - native（HotSpot 合并）</text>\n  <rect x='326' y='40' width='296' height='172' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='340' y='62' font-size='13' fill='var(--lv1)' font-weight='bold'>线程共享（所有线程可见）</text>\n  <rect x='340' y='72' width='268' height='70' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='350' y='94' font-size='12' fill='var(--ink)'>堆 - 对象/数组，GC 主战场</text>\n  <text x='350' y='116' font-size='12' fill='var(--muted)'>新生代 Eden + Survivor0/1 / 老年代</text>\n  <rect x='340' y='146' width='268' height='32' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='350' y='167' font-size='12' fill='var(--ink)'>元空间 - 类元信息/常量池（本地内存）</text>\n  <rect x='18' y='226' width='604' height='62' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='32' y='248' font-size='13' fill='var(--lv1)' font-weight='bold'>直接内存 Direct Memory（非运行时数据区）</text>\n  <text x='32' y='272' font-size='12' fill='var(--ink)'>Native 内存，受 -XX:MaxDirectMemorySize 限制（默认 = -Xmx）；Netty ByteBuf 大户，超限抛 Direct buffer memory</text>\n  <text x='320' y='316' font-size='12' fill='var(--muted)' text-anchor='middle'>对象在堆、引用在栈、类信息在元空间；判据：会被多线程共享的 → 共享，方法执行现场 → 私有</text>\n  <text x='320' y='342' font-size='12' fill='var(--muted)' text-anchor='middle'>口诀：两栈一器私有，一堆一区共享</text>\n</svg>",
    "caption": "图：JVM 运行时内存区域划分（线程私有 vs 线程共享）"
   },
   {
    "t": "h",
    "text": "对象长什么样：对象头 + 实例数据 + 对齐"
   },
   {
    "t": "p",
    "text": "对象在堆里的布局 = 对象头（Mark Word + 类型指针）+ 实例数据 + 对齐填充。Mark Word 8 字节，装哈希码、GC 分代年龄（4 bit，最大 15）、锁状态标志——synchronized 锁升级就是它换内容。类型指针指向元空间的类元信息，开指针压缩时只占 4 字节。空对象 new Object() 占 16 字节。数组对象还有 4 字节 length。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 240'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>对象内存布局（64 位 + 指针压缩）</text>\n  <rect x='40' y='48' width='90' height='96' rx='4' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='85' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>Mark Word</text>\n  <text x='85' y='92' font-size='12' fill='var(--muted)' text-anchor='middle'>8 字节</text>\n  <text x='85' y='112' font-size='12' fill='var(--muted)' text-anchor='middle'>哈希/年龄/锁</text>\n  <text x='85' y='132' font-size='12' fill='var(--muted)' text-anchor='middle'>年龄 4bit ≤ 15</text>\n  <rect x='134' y='48' width='94' height='96' rx='4' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='181' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>Klass Pointer</text>\n  <text x='181' y='92' font-size='12' fill='var(--muted)' text-anchor='middle'>压缩后 4 字节</text>\n  <text x='181' y='112' font-size='12' fill='var(--muted)' text-anchor='middle'>指向元空间</text>\n  <text x='181' y='132' font-size='12' fill='var(--muted)' text-anchor='middle'>类元信息</text>\n  <rect x='232' y='48' width='120' height='96' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='292' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>实例数据</text>\n  <text x='292' y='94' font-size='12' fill='var(--muted)' text-anchor='middle'>long playerId</text>\n  <text x='292' y='114' font-size='12' fill='var(--muted)' text-anchor='middle'>int level ...</text>\n  <rect x='356' y='48' width='94' height='96' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='403' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>对齐填充</text>\n  <text x='403' y='92' font-size='12' fill='var(--muted)' text-anchor='middle'>8 字节对齐</text>\n  <text x='403' y='112' font-size='12' fill='var(--muted)' text-anchor='middle'>不足补零</text>\n  <text x='462' y='72' font-size='12' fill='var(--lv2)'>数组另有 length 4 字节</text>\n  <rect x='40' y='152' width='410' height='32' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='245' y='173' font-size='12' fill='var(--ink)' text-anchor='middle'>new Object() 空对象 = 8 + 4 + 4 = 16 字节</text>\n  <text x='480' y='158' font-size='12' fill='var(--muted)'>指针压缩：8 字节对齐使地址低 3 位恒 0</text>\n  <text x='480' y='178' font-size='12' fill='var(--muted)'>右移 3 位存 32 位，可寻址 32G</text>\n  <text x='480' y='206' font-size='12' fill='var(--lv3)'>堆超 32G 压缩失效，引用变 8 字节</text>\n</svg>",
    "caption": "图：对象内存布局与指针压缩的 32G 分水岭"
   },
   {
    "t": "h",
    "text": "四种引用，一种选择"
   },
   {
    "t": "p",
    "text": "四种引用按「GC 时保不保命」分级：强 > 软 > 弱 > 虚，强度越低越容易被回收。游戏服在线玩家 Map 就是强引用——所以玩家下线必须 remove；软引用回收时机不可控，别当主缓存。"
   },
   {
    "t": "table",
    "head": [
     "引用类型",
     "回收时机",
     "游戏服典型用途"
    ],
    "rows": [
     [
      "强引用",
      "GC Roots 可达就永不回收，宁可 OOM",
      "在线玩家 Map、会话缓存（下线必须 remove）"
     ],
     [
      "软引用",
      "内存不足（临近 OOM）才回收",
      "可重建的大缓存（不推荐做主缓存）"
     ],
     [
      "弱引用",
      "只要发生 GC 就回收",
      "WeakHashMap、ThreadLocalMap 的 key"
     ],
     [
      "虚引用",
      "不影响生命周期，只发回收通知",
      "Cleaner 释放堆外、Netty 泄漏检测"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "把直接内存说成「运行时数据区」成员——它属 native 内存，不受 -Xmx 管，受 -XX:MaxDirectMemorySize 限制，Netty 大户，超限抛 Direct buffer memory",
     "说元空间在堆里——Metaspace 用本地内存，不在堆预算内；JDK8 起永久代整个没了",
     "指针碰撞配 CMS、空闲列表配 Serial——张冠李戴：复制/整理算法堆规整才用指针碰撞，CMS 标记-清除老年代碎片化用空闲列表",
     "对象头只说 Mark Word——漏了类型指针；数组对象还漏 length 字段",
     "背四种引用只背定义不给选型——面试官要的是「游戏服缓存为什么选 Caffeine 显式驱逐而非软引用」"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：内存五区记「两栈一器私有，一堆一区共享」；对象创建五步记「查类、分地、清零、盖章、装修」，TLAB 让游戏服高频小对象分配接近线程私有；JDK8 后元空间在本地内存、字符串池在堆；对象布局 Mark(8) + Klass(4) + 实例数据 + 对齐，空对象 16 字节，32G 是压缩指针分水岭；四种引用按回收时机分级，游戏服缓存默认 Caffeine 显式驱逐。"
   }
  ]
 },
 {
  "id": "jvm-class-loading",
  "title": "类加载机制与双亲委派",
  "layer": 0,
  "depends": [],
  "covers": [
   "jvm-07",
   "jvm-08",
   "jvm-27"
  ],
  "quiz": [
   "jvm-07",
   "jvm-08",
   "jvm-27"
  ],
  "body": [
   {
    "t": "lead",
    "text": "类从字节码到能被 new 出来，中间要过五道关卡；三层加载器「有事找爹」的委派模型以及怎么打破它——热更新与 Metaspace OOM 的答案都藏在这一节。"
   },
   {
    "t": "pre",
    "items": [
     "知道 .class 字节码是什么，能写 Java 类",
     "清楚静态变量、静态代码块的执行时机",
     "写过静态内部类单例更佳"
    ]
   },
   {
    "t": "h",
    "text": "类加载生命周期：五个阶段"
   },
   {
    "t": "p",
    "text": "加载 → 验证 → 准备 → 解析 → 初始化。加载把字节流转成方法区的类元信息和堆里的 Class 对象；验证保证字节码不危害 JVM；准备为 static 变量分配内存并赋零值；解析把符号引用换成直接引用（可推迟到初始化之后，以支持动态绑定）；初始化执行 <clinit>()，静态赋值和静态代码块按代码顺序合并执行，JVM 保证它只执行一次。"
   },
   {
    "t": "p",
    "text": "最容易考出分水岭的差异：准备阶段 static int x = 1 只把 x 置为 0；static final int Y = 1 是编译期常量，准备阶段直接赋真值 1；普通 static 变量的真值 1 要等初始化阶段 clinit 才赋。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public class ConfigHolder {\n    static int x = 1;        // 准备阶段 x = 0，初始化阶段才赋 1\n    static final int Y = 2;  // 编译期常量，准备阶段就是 2\n    static { System.out.println(\"clinit 执行\"); }\n}\n\n// 静态内部类单例：clinit 由 JVM 加锁保证只执行一次\npublic class Singleton {\n    private Singleton() {}\n    private static class Holder {\n        static final Singleton INST = new Singleton();\n    }\n    public static Singleton get() {\n        return Holder.INST;   // 首次访问才触发 Holder 的加载与初始化\n    }\n}"
   },
   {
    "t": "h",
    "text": "什么时候触发初始化（主动使用）"
   },
   {
    "t": "list",
    "items": [
     "new 对象 / 读写静态字段 / 调用静态方法",
     "反射 Class.forName(\"xxx\")",
     "初始化子类时，父类先初始化",
     "含 main 的启动类；MethodHandle 解析结果对应的类"
    ]
   },
   {
    "t": "p",
    "text": "三种被动引用不触发初始化：通过子类引用父类的静态字段；引用类的编译期常量（已折叠进调用方常量池）；定义类的数组。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 170'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>类加载生命周期：加载 → 连接（验证/准备/解析）→ 初始化</text>\n  <rect x='30' y='48' width='96' height='54' rx='6' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='78' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>加载</text>\n  <text x='78' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>字节流→元信息</text>\n  <rect x='150' y='48' width='96' height='54' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='198' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>验证</text>\n  <text x='198' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>格式/字节码合法</text>\n  <rect x='270' y='48' width='96' height='54' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='318' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>准备</text>\n  <text x='318' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>static 赋零值</text>\n  <rect x='390' y='48' width='96' height='54' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='438' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>解析</text>\n  <text x='438' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>符号→直接引用</text>\n  <rect x='510' y='48' width='96' height='54' rx='6' fill='var(--accent)'/>\n  <text x='558' y='70' font-size='13' fill='var(--bg)' text-anchor='middle'>初始化</text>\n  <text x='558' y='90' font-size='12' fill='var(--bg)' text-anchor='middle'>执行 clinit</text>\n  <line x1='128' y1='75' x2='146' y2='75' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M148 75 l-8 -4 v8 z' fill='var(--accent)'/>\n  <line x1='248' y1='75' x2='266' y2='75' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M268 75 l-8 -4 v8 z' fill='var(--accent)'/>\n  <line x1='368' y1='75' x2='386' y2='75' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M388 75 l-8 -4 v8 z' fill='var(--accent)'/>\n  <line x1='488' y1='75' x2='506' y2='75' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M508 75 l-8 -4 v8 z' fill='var(--accent)'/>\n  <text x='320' y='130' font-size='12' fill='var(--muted)' text-anchor='middle'>连接三阶段可交叉进行；static final 编译期常量在准备阶段直接赋真值</text>\n  <text x='320' y='150' font-size='12' fill='var(--muted)' text-anchor='middle'>主动使用（new/反射/静态访问）才触发初始化，被动引用不触发</text>\n</svg>",
    "caption": "图：类加载五阶段流程"
   },
   {
    "t": "h",
    "text": "双亲委派模型：有事找爹"
   },
   {
    "t": "p",
    "text": "三层加载器：BootstrapClassLoader（C++ 实现，加载 java.* 核心类）、ExtClassLoader（JDK9+ 改名 PlatformClassLoader，加载扩展类）、AppClassLoader（加载 classpath 下的应用类，我们的代码）。流程：收到类名先查自己缓存，没有就委托父加载器，父加载不了才自己 findClass。"
   },
   {
    "t": "p",
    "text": "两大好处：同名类全局唯一（避免重复加载），核心类不被伪造（用户写的 java.lang.Object 永远轮不到 App 加载）。破坏它要靠重写 loadClass 而不是 findClass。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 250'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>双亲委派模型：请求先上缴，父不行子才上</text>\n  <rect x='170' y='44' width='300' height='42' rx='6' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='320' y='62' font-size='13' fill='var(--ink)' text-anchor='middle'>Bootstrap（C++，java.* 核心类）</text>\n  <text x='320' y='78' font-size='12' fill='var(--muted)' text-anchor='middle'>JAVA_HOME/lib</text>\n  <rect x='170' y='110' width='300' height='42' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='320' y='128' font-size='13' fill='var(--ink)' text-anchor='middle'>Ext / Platform（扩展类）</text>\n  <text x='320' y='144' font-size='12' fill='var(--muted)' text-anchor='middle'>JDK9+ 已改名 PlatformClassLoader</text>\n  <rect x='170' y='176' width='300' height='42' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='320' y='194' font-size='13' fill='var(--ink)' text-anchor='middle'>App（classpath 应用类，我们的代码）</text>\n  <line x1='320' y1='152' x2='320' y2='172' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M320 174 l-4 -8 h8 z' fill='var(--accent)'/>\n  <line x1='320' y1='86' x2='320' y2='106' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M320 108 l-4 -8 h8 z' fill='var(--accent)'/>\n  <text x='320' y='206' font-size='12' fill='var(--muted)' text-anchor='middle'>虚线方向为「委派」，反向为「自己尝试 findClass」</text>\n  <text x='320' y='228' font-size='12' fill='var(--lv3)' text-anchor='middle'>打破三场景：SPI 用 TCCL 反调 / Tomcat 应用隔离 / 游戏服热更换 ClassLoader</text>\n</svg>",
    "caption": "图：双亲委派三层结构与打破场景"
   },
   {
    "t": "h",
    "text": "打破双亲委派的三个经典场景"
   },
   {
    "t": "list",
    "items": [
     "SPI 机制：JDBC/Dubbo 由 Bootstrap 加载接口却要调应用实现，用线程上下文类加载器（TCCL）反向加载",
     "Tomcat：每个 WebApp 用 WebappClassLoader 优先加载本应用类，实现应用间隔离",
     "热更新：游戏服热更必须换新 ClassLoader 重新加载新版类，旧 ClassLoader 整体丢弃"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public class HotClassLoader extends ClassLoader {\n    // 遵守委派：只重写 findClass，父加载器加载不了才回调这里\n    @Override\n    protected Class<?> findClass(String name) throws ClassNotFoundException {\n        byte[] bytes = loadNewBytes(name);   // 从热更目录读新版字节码\n        return defineClass(name, bytes, 0, bytes.length);\n    }\n}\n// 想彻底打破委派才重写 loadClass（Tomcat 风格）；游戏服热更默认用 findClass 即可"
   },
   {
    "t": "h",
    "text": "热更新与元空间泄漏"
   },
   {
    "t": "p",
    "text": "每次热更 new 一个 ClassLoader，旧 ClassLoader 必须整体死掉其类元数据才能释放。类卸载要同时满足三条件：该类所有实例已回收、加载它的 ClassLoader 已回收、Class 对象无任何引用——第三条最难，只要一个旧实例被静态容器或长命线程持有，整个旧加载器下所有类的元数据都卸不掉，热更 N 次就 Metaspace OOM。排查：dump 里数自定义 ClassLoader 存活实例，多于 2 个即实锤。"
   },
   {
    "t": "pits",
    "items": [
     "把解析说成必须在初始化之前完成——连接阶段可交叉，解析常推迟到初始化后以支持动态绑定",
     "说准备阶段给 static 变量赋了真值——准备只赋零值，赋真值是初始化阶段 clinit 的事",
     "JDK9+ 还死抠 ExtClassLoader 的名字——已改名 PlatformClassLoader",
     "自定义 ClassLoader 想遵守委派却重写 loadClass——应该重写 findClass，保留父加载流程",
     "把 MetaspaceSize 当上限用——它是触发 Full GC 的水位线，MaxMetaspaceSize 才是硬上限"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：类加载五阶段记「加验备析始」，准备赋零值、初始化赋真值，clinit 由 JVM 加锁保证单例；主动使用六种、被动引用三种要分清；双亲委派记「有事找爹，爹不行儿子上」，打破记「SPI 反调、Tomcat 隔离、热更换爹」；热更泄漏本质是旧 ClassLoader 被一个旧实例拽住，dump 数 loader 实例是最快实证。"
   }
  ]
 },
 {
  "id": "jvm-gc-basics",
  "title": "GC 原理：对象存活判定与分代算法",
  "layer": 1,
  "depends": [
   "jvm-memory-objects"
  ],
  "covers": [
   "jvm-03",
   "jvm-04",
   "jvm-05",
   "jvm-29"
  ],
  "quiz": [
   "jvm-03",
   "jvm-04",
   "jvm-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "GC 判断对象死活、三种基础算法、分代与晋升规则——理解任何收集器之前，必须先懂这一层。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握内存区域与对象布局（jvm-memory-objects）",
     "知道什么是堆、什么是引用，能画出分代结构",
     "本节点讲算法层面，具体收集器留到 jvm-collectors"
    ]
   },
   {
    "t": "h",
    "text": "判定存活：为什么 Java 选可达性分析"
   },
   {
    "t": "p",
    "text": "引用计数法给每个对象挂计数器，引用 +1、失效 -1，归零就回收——它解决不了 A、B 互相引用导致的永远归不了零，且每次赋值都有额外开销。Java 改用可达性分析：从 GC Roots 出发向下搜索，搜不到的对象判定为可回收（还有 finalize 的「缓刑」流程才真正回收）。"
   },
   {
    "t": "list",
    "items": [
     "GC Roots 六类：虚拟机栈（栈帧局部变量表）中引用的对象",
     "方法区中静态属性、常量引用的对象",
     "本地方法栈 JNI 引用的对象",
     "活跃线程对象",
     "synchronized 持有的锁对象",
     "JVM 内部引用（类加载器、重要异常类等）"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 玩家对象为什么常驻？因为被静态在线 Map（GC Root）强引用\npublic class OnlineManager {\n    private static final Map<Long, Player> ONLINE = new ConcurrentHashMap<>();\n    public void onLogin(Player p) { ONLINE.put(p.id, p); }\n    public void onLogout(Long id) { ONLINE.remove(id); }  // 不 remove → 永久可达\n}\n// 泄漏后果：对象永不回收 → 年龄增长 → 晋升老年代 → 老年代持续爬坡 → Full GC/OOM"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 300'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>可达性分析：从 GC Roots 出发找活对象</text>\n  <rect x='20' y='44' width='200' height='220' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='34' y='66' font-size='13' fill='var(--lv1)' font-weight='bold'>GC Roots（六类）</text>\n  <rect x='34' y='78' width='172' height='26' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='44' y='95' font-size='12' fill='var(--ink)'>线程栈局部变量</text>\n  <rect x='34' y='108' width='172' height='26' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='44' y='125' font-size='12' fill='var(--ink)'>静态属性 / 常量</text>\n  <rect x='34' y='138' width='172' height='26' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='44' y='155' font-size='12' fill='var(--ink)'>JNI 引用</text>\n  <rect x='34' y='168' width='172' height='26' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='44' y='185' font-size='12' fill='var(--ink)'>活跃线程 / 锁对象</text>\n  <rect x='34' y='198' width='172' height='26' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='44' y='215' font-size='12' fill='var(--ink)'>JVM 内部（加载器等）</text>\n  <circle cx='320' cy='150' r='42' fill='var(--accent-soft)' stroke='var(--accent)' stroke-width='2'/>\n  <text x='320' y='146' font-size='13' fill='var(--ink)' text-anchor='middle'>GC Roots</text>\n  <text x='320' y='166' font-size='12' fill='var(--muted)' text-anchor='middle'>起点</text>\n  <line x1='230' y1='120' x2='280' y2='140' stroke='var(--accent)' stroke-width='2'/>\n  <rect x='430' y='80' width='150' height='44' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='505' y='100' font-size='12' fill='var(--ink)' text-anchor='middle'>在线玩家对象（可达）</text>\n  <text x='505' y='118' font-size='12' fill='var(--muted)' text-anchor='middle'>被 ONLINE Map 拽住</text>\n  <line x1='362' y1='140' x2='428' y2='104' stroke='var(--accent)' stroke-width='2'/>\n  <rect x='430' y='150' width='150' height='44' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='505' y='170' font-size='12' fill='var(--ink)' text-anchor='middle'>战斗临时对象（可达）</text>\n  <text x='505' y='188' font-size='12' fill='var(--muted)' text-anchor='middle'>栈引用，活到方法结束</text>\n  <line x1='360' y1='160' x2='428' y2='172' stroke='var(--accent)' stroke-width='2'/>\n  <rect x='430' y='220' width='150' height='44' rx='4' fill='var(--lv3-bg)' stroke='var(--lv3)'/>\n  <text x='505' y='240' font-size='12' fill='var(--ink)' text-anchor='middle'>下线后仍被拽住的玩家</text>\n  <text x='505' y='258' font-size='12' fill='var(--lv3)' text-anchor='middle'>不可达才是垃圾，但没断开</text>\n  <line x1='362' y1='150' x2='428' y2='220' stroke='var(--lv3)' stroke-width='2' stroke-dasharray='4 4'/>\n  <text x='320' y='286' font-size='12' fill='var(--muted)' text-anchor='middle'>口诀：计数怕循环，可达问根源；游戏服泄漏 = Roots 拽着不该拽的对象</text>\n</svg>",
    "caption": "图：可达性分析与 GC Roots 六类（结合在线玩家 Map 泄漏场景）"
   },
   {
    "t": "h",
    "text": "三种基础算法"
   },
   {
    "t": "p",
    "text": "分代假说决定算法选择：绝大多数对象朝生夕灭（战斗临时对象是典型），熬过多次 GC 的往往长期存活（玩家数据、配置表）。新生代存活率低 → 复制便宜；老年代存活率高 → 复制成本爆炸，只能清除或整理。"
   },
   {
    "t": "table",
    "head": [
     "算法",
     "核心思想",
     "致命缺点",
     "用在哪"
    ],
    "rows": [
     [
      "标记-清除",
      "标记后直接清除",
      "产生碎片，大对象难安家",
      "CMS 老年代"
     ],
     [
      "标记-复制",
      "活对象复制到另一半，一次清空半区",
      "浪费空间（8:1:1 只浪费 10%）",
      "新生代（Eden/S0/S1）"
     ],
     [
      "标记-整理",
      "存活对象向一端移动再清边界",
      "移动对象要更新引用且 STW",
      "Serial Old / Parallel Old / G1 region 内"
     ]
    ]
   },
   {
    "t": "h",
    "text": "GC 类型与晋升四途径"
   },
   {
    "t": "p",
    "text": "Minor GC 收新生代（Eden 满触发，快而频繁）；Major GC 收老年代，与 Full 常被混用，面试先说明语境显严谨；Full GC 收整堆 + 方法区，STW 最长，游戏服最怕。Full GC 常见触发：老年代空间不足、晋升失败担保、System.gc()、元空间不足、CMS 的 concurrent mode failure。"
   },
   {
    "t": "list",
    "items": [
     "晋升①年龄到：每熬过一轮 Minor GC 年龄 +1，达到 MaxTenuringThreshold（默认 15，与 Mark Word 4bit 硬边界一致）",
     "晋升②动态年龄判定：Survivor 中同年龄对象总和超 Survivor 一半，该年龄及以上直接晋升",
     "晋升③大对象直接进老年代：-XX:PretenureSizeThreshold（Serial/ParNew 有效）",
     "晋升④分配担保：Minor GC 后 Survivor 放不下，多余对象直接进老年代"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 270'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>分代回收与晋升路径</text>\n  <rect x='30' y='48' width='250' height='120' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='155' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>新生代（Minor GC 回收）</text>\n  <rect x='44' y='84' width='100' height='70' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='94' y='105' font-size='12' fill='var(--ink)' text-anchor='middle'>Eden</text>\n  <text x='94' y='123' font-size='12' fill='var(--muted)' text-anchor='middle'>TLAB 分配点</text>\n  <text x='94' y='141' font-size='12' fill='var(--muted)' text-anchor='middle'>满 → 触发 Minor</text>\n  <rect x='160' y='84' width='106' height='70' rx='4' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='213' y='105' font-size='12' fill='var(--ink)' text-anchor='middle'>Survivor S0/S1</text>\n  <text x='213' y='123' font-size='12' fill='var(--muted)' text-anchor='middle'>复制算法 8:1:1</text>\n  <text x='213' y='141' font-size='12' fill='var(--muted)' text-anchor='middle'>保留 10% 浪费</text>\n  <rect x='330' y='48' width='280' height='120' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='470' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>老年代（Full GC 主战场）</text>\n  <text x='470' y='100' font-size='12' fill='var(--muted)' text-anchor='middle'>存活率高 → 清除/整理</text>\n  <text x='470' y='124' font-size='12' fill='var(--muted)' text-anchor='middle'>玩家数据、配置表常驻</text>\n  <text x='470' y='148' font-size='12' fill='var(--lv3)' text-anchor='middle'>水位爬坡 = 泄漏信号</text>\n  <line x1='282' y1='119' x2='326' y2='105' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M328 104 l-8 -2 l2 8 z' fill='var(--accent)'/>\n  <text x='288' y='92' font-size='12' fill='var(--accent)'>晋升</text>\n  <line x1='120' y1='190' x2='120' y2='226' stroke='var(--lv3)' stroke-width='2' stroke-dasharray='4 4'/>\n  <text x='132' y='212' font-size='12' fill='var(--lv3)'>大对象直入老年代（③）</text>\n  <text x='320' y='252' font-size='12' fill='var(--muted)' text-anchor='middle'>四途径：年龄到（①）/ 动态年龄（②）/ 大对象（③）/ 分配担保（④）；Eden 满小扫，老满大扫，全不满全扫</text>\n</svg>",
    "caption": "图：分代回收与对象晋升四途径"
   },
   {
    "t": "h",
    "text": "finalize 为什么是垃圾"
   },
   {
    "t": "p",
    "text": "四宗罪：执行时机不确定（可能永远不执行）；拖慢 GC（带 finalize 的对象要经历两次 GC 才回收，F-Queue 堆积会直接 OOM）；能在 finalize 里把自己复活（且只执行一次，复活后状态往往不完整）；异常被吞没。JDK9 起标记废弃，正确姿势是 try-with-resources 显式释放，或用基于虚引用的 Cleaner（JDK9+）注册清理动作。"
   },
   {
    "t": "pits",
    "items": [
     "答引用计数法时不说它解决不了循环引用——这是 Java 弃用它的根本原因",
     "GC Roots 漏掉活跃线程对象、synchronized 锁对象这两类",
     "说复制算法浪费一半内存而不提 Appel 式 8:1:1 改进",
     "把 Major GC 与 Full GC 咬死为同一概念——两者经常混用，要说清语境",
     "以为 finalize 一定能执行完——它时机不定、可能不执行、还能复活对象"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Java 选可达性分析是因为引用计数破不了循环引用，Roots 记「栈、静态、常量、JNI、线程、锁」六类；三种算法记「清除碎、复制费、整理慢」，分代假说决定新生代复制、老年代清除/整理；晋升四途径记「老、大、挤、超」；Full GC 是游戏服头号大敌；finalize 是反面教材，资源清理跟业务生命周期走，不跟 GC 走。"
   }
  ]
 },
 {
  "id": "jvm-jmm-jit",
  "title": "JMM 与 JIT 运行期优化",
  "layer": 1,
  "depends": [
   "jvm-memory-objects"
  ],
  "covers": [
   "jvm-30",
   "jvm-20",
   "jvm-12"
  ],
  "quiz": [
   "jvm-30",
   "jvm-20",
   "jvm-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "内存区域管「数据存哪」，JMM 管「一个线程的写何时被另一个线程看见」；加上 JIT 的分层编译与逃逸分析，构成并发与性能的底层世界观。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握内存区域划分（jvm-memory-objects）",
     "用过 synchronized / volatile，见过多线程数据不一致的 bug",
     "知道字节码先解释执行的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "JMM 与运行时内存区域是两回事"
   },
   {
    "t": "p",
    "text": "运行时数据区是 JVM 的物理内存划分（堆/栈/元空间），回答「数据存在哪、谁回收」；JMM 是抽象的线程访问规范（主内存/工作内存），回答「一个线程的写何时对另一个线程可见、指令能不能重排」。它是 JSR-133 规范，JVM 靠内存屏障在 CPU 上落地。"
   },
   {
    "t": "p",
    "text": "每个线程有自己的工作内存（抽象概念，对应 CPU 缓存/寄存器），变量修改先写工作内存再刷主内存——这就是可见性问题的根源。游戏服场景：逻辑线程改了玩家坐标，网络线程未必立刻看到，发出去的是旧坐标——这是 JMM 问题，不是 GC 问题。"
   },
   {
    "t": "h",
    "text": "happens-before：可见性保证，不是时间先后"
   },
   {
    "t": "list",
    "items": [
     "程序次序规则：单线程内按书写顺序",
     "锁规则：解锁 happens-before 后续对同一把锁的加锁",
     "volatile 规则：写 happens-before 后续对该变量的读",
     "线程启动规则：start() 之前的操作对线程内可见",
     "线程终止规则：线程内所有操作 happens-before join() 返回",
     "传递性：A hb B、B hb C，则 A hb C"
    ]
   },
   {
    "t": "p",
    "text": "一句话理解：happens-before 决定的是「前一个操作的结果对后一个操作可见」的保证关系，两个操作没有 hb 关系时不保证可见性。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 逻辑线程单写、网络线程读的玩家状态：可见性靠 volatile/不可变快照\npublic class PlayerState {\n    private volatile int x, y;                    // 简单状态：volatile 保证读线程立即可见\n    private volatile Snapshot snap;               // 复合状态：不可变快照整体替换发布\n\n    void moveTo(int nx, int ny) {                 // 逻辑线程\n        x = nx;\n        y = ny;\n        snap = new Snapshot(x, y);                // 发布新快照\n    }\n    static final class Snapshot {                 // 不可变对象\n        final int x, y;\n        Snapshot(int x, int y) { this.x = x; this.y = y; }\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 250'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>JMM：主内存 / 工作内存与可见性</text>\n  <rect x='200' y='44' width='240' height='150' rx='6' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='320' y='66' font-size='13' fill='var(--ink)' text-anchor='middle'>主内存（所有线程共享）</text>\n  <text x='320' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>玩家坐标 x / y</text>\n  <text x='320' y='108' font-size='12' fill='var(--muted)' text-anchor='middle'>在线列表 Map</text>\n  <text x='320' y='126' font-size='12' fill='var(--muted)' text-anchor='middle'>战斗状态快照</text>\n  <text x='320' y='168' font-size='12' fill='var(--muted)' text-anchor='middle'>（抽象概念，对应物理内存）</text>\n  <rect x='30' y='60' width='130' height='110' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='95' y='84' font-size='13' fill='var(--ink)' text-anchor='middle'>线程 A</text>\n  <text x='95' y='104' font-size='12' fill='var(--muted)' text-anchor='middle'>工作内存</text>\n  <text x='95' y='122' font-size='12' fill='var(--muted)' text-anchor='middle'>= CPU 缓存/寄存器</text>\n  <text x='95' y='140' font-size='12' fill='var(--muted)' text-anchor='middle'>改了 x 未必立刻刷主存</text>\n  <rect x='480' y='60' width='130' height='110' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='545' y='84' font-size='13' fill='var(--ink)' text-anchor='middle'>线程 B</text>\n  <text x='545' y='104' font-size='12' fill='var(--muted)' text-anchor='middle'>工作内存</text>\n  <text x='545' y='122' font-size='12' fill='var(--muted)' text-anchor='middle'>读到旧坐标 → 发旧包</text>\n  <line x1='162' y1='110' x2='198' y2='110' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M200 110 l-8 -4 v8 z' fill='var(--accent)'/>\n  <line x1='442' y1='110' x2='478' y2='110' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M480 110 l-8 -4 v8 z' fill='var(--accent)'/>\n  <text x='320' y='218' font-size='12' fill='var(--muted)' text-anchor='middle'>volatile 写 → 加 StoreLoad 屏障强制刷主存；synchronized 进出 monitor 隐含屏障</text>\n  <text x='320' y='238' font-size='12' fill='var(--lv3)' text-anchor='middle'>i++ 是读-改-写复合操作，volatile 保不了原子性 → 用 AtomicInteger 的 CAS</text>\n</svg>",
    "caption": "图：JMM 主内存/工作内存模型与可见性问题"
   },
   {
    "t": "h",
    "text": "JIT 分层编译：热代码才有资格被优化"
   },
   {
    "t": "p",
    "text": "字节码先解释执行，被反复执行的「热点代码」触发即时编译。热点探测靠方法调用计数器 + 回边计数器（循环体执行次数）。分层编译（JDK8 默认开）：Level 0 解释执行 → C1 快编译（带 profiling 收集类型信息）→ Level 4 C2 深度优化（方法内联、逃逸分析、锁消除、循环展开、死代码消除）。C2 的激进优化基于 profiling 的乐观假设，猜错会触发逆优化（deoptimization）回解释执行。"
   },
   {
    "t": "h",
    "text": "逃逸分析三大优化"
   },
   {
    "t": "p",
    "text": "不逃逸的对象被标量替换拆成局部变量——这才是「栈上分配」的真相，对象本体并不真正搬到栈上，而是根本不创建；锁对象不线程逃逸则锁消除；内联扩大分析范围让优化更准。重要边界：只有 C2 热代码才生效——战斗结算这种热路径才吃得到红利，解释执行/C1 阶段对象照常进堆。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 210'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>分层编译：解释 → C1 → C2</text>\n  <rect x='30' y='48' width='110' height='54' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='85' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>字节码</text>\n  <text x='85' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>.class</text>\n  <rect x='170' y='48' width='130' height='54' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='235' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>Level 0 解释执行</text>\n  <text x='235' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>双计数器探测热点</text>\n  <rect x='330' y='48' width='130' height='54' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='395' y='70' font-size='13' fill='var(--ink)' text-anchor='middle'>C1（L1-L3）</text>\n  <text x='395' y='90' font-size='12' fill='var(--muted)' text-anchor='middle'>快编译 + 类型 profiling</text>\n  <rect x='490' y='48' width='120' height='54' rx='6' fill='var(--accent)'/>\n  <text x='550' y='70' font-size='13' fill='var(--bg)' text-anchor='middle'>C2（L4）</text>\n  <text x='550' y='90' font-size='12' fill='var(--bg)' text-anchor='middle'>激进优化</text>\n  <line x1='142' y1='75' x2='166' y2='75' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M168 75 l-8 -4 v8 z' fill='var(--accent)'/>\n  <line x1='302' y1='75' x2='326' y2='75' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M328 75 l-8 -4 v8 z' fill='var(--accent)'/>\n  <line x1='462' y1='75' x2='486' y2='75' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M488 75 l-8 -4 v8 z' fill='var(--accent)'/>\n  <rect x='170' y='128' width='440' height='34' rx='4' fill='var(--bg)' stroke='var(--line)'/>\n  <text x='390' y='150' font-size='12' fill='var(--ink)' text-anchor='middle'>C2 红利：方法内联 / 标量替换（栈上分配真相）/ 锁消除 / 循环展开</text>\n  <text x='320' y='190' font-size='12' fill='var(--muted)' text-anchor='middle'>乐观假设被打破 → 逆优化回解释执行；热更批量换类可能引发逆优化风暴</text>\n</svg>",
    "caption": "图：JIT 分层编译与 C2 激进优化"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 吃逃逸分析红利：作用域局部、方法小、利于内联\npublic int sumDamage(int[] atkList) {\n    int sum = 0;                       // 基本类型，零对象分配\n    for (int a : atkList) { sum += a; }\n    return sum;\n}\n// 反例：把临时结算对象塞进成员字段/集合 → 线程逃逸 → 逃逸分析失效\n// 战斗服建议：热路径少用自动装箱、少 new 包装类，用 int/fastutil 代替 Integer"
   },
   {
    "t": "pits",
    "items": [
     "把 JMM 讲成内存结构图——两个概念完全不同，先一刀切清「物理划分 vs 访问规范」",
     "说 happens-before 是时间先后——它是可见性保证关系，无 hb 关系不保证可见",
     "说 volatile 能保证 i++ 原子——不能，读-改-写是复合操作",
     "说对象真被搬到栈上——真相是标量替换，对象根本不创建",
     "以为逃逸分析对所有代码生效——只有 C2 热代码才吃红利",
     "谈 JIT 只说优化不提逆优化——C2 乐观假设被打破会回解释执行，热更后 CPU 飙高要想到它"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：内存区域管存哪、JMM 管谁看见；happens-before 六条记「次序、锁、volatile、启动、终止、传递」；游戏服状态同步的可见性靠 volatile/不可变快照，别等 GC 或锁去兜底；JIT 记「先解释后编译，C1 快 C2 狠，热代码才配优化」，逃逸分析是 C2 白给的红利——把临时对象留在方法内、保持方法小。"
   }
  ]
 },
 {
  "id": "jvm-object-allocation",
  "title": "对象分配全流程与内存布局细节",
  "layer": 1,
  "depends": [
   "jvm-memory-objects"
  ],
  "covers": [
   "jvm-02",
   "jvm-12",
   "jvm-34"
  ],
  "quiz": [
   "jvm-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "对象从 new 到安家的每一步细节：Mark Word 的 64 个 bit 在四种锁状态之间怎么切换、JVM 凭什么重排你的字段、TLAB 怎样分配又怎样浪费、逃逸分析怎么把对象\"变没\"——这是理解对象创建与 GC 压力的最后一公里。"
   },
   {
    "t": "pre",
    "items": [
     "对象创建五步流程与对象头的基础结构（jvm-memory-objects）",
     "逃逸分析三种优化（标量替换/锁消除）的初步认识（jvm-jmm-jit）",
     "锁升级（偏向→轻量→重量）的 Mark Word 切换史"
    ]
   },
   {
    "t": "h",
    "text": "一、Mark Word：一个 64 位槽位装下四种身份"
   },
   {
    "t": "p",
    "text": "64 位 JVM 的 Mark Word 固定 8 字节，本身不是一张表，而是一个\"按锁状态复用 bit 的变脸槽位\"。无锁（Normal）状态：unused 25bit + identity hashcode 31bit + GC 分代年龄 age 4bit + biased 1bit + lock 标志 2bit（01）。偏向锁状态：threadId（偏向线程 ID）23bit + epoch 2bit + age 4bit + biased=1 + lock=01。轻量级锁：指向线程栈中 Lock Record 的指针 62bit + lock=00。重量级锁：指向 ObjectMonitor 的指针 62bit + lock=10。锁升级的本质就是这些 bit 的一次次整体换装——这也是为什么说 synchronized 锁升级\"只改对象头不改对象字段\"。"
   },
   {
    "t": "p",
    "text": "两个高频考点藏在这张表里。第一，identity hashcode 只有在无锁状态才存在，一旦偏向锁启用 hash 就被挤掉，所以重写 hashCode() 的类偏锁无法生效、会直接撤销。第二，age 只有 4bit，最大值 15，这就是 -XX:MaxTenuringThreshold 设超过 15 会在启动时直接报错（must be between 0 and 15）的底层原因——不是 JVM 故意限制，是对象头只给了 4 个 bit。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Mark Word 四种锁状态（64 位 JVM，共 64 bit）</text><rect x=\"20\" y=\"44\" width=\"600\" height=\"44\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"34\" y=\"62\" font-size=\"12\" fill=\"var(--ink)\">无锁 01：</text><text x=\"34\" y=\"80\" font-size=\"12\" fill=\"var(--muted)\">unused 25bit | hashcode 31bit | age 4bit | biased 1bit | 01</text><rect x=\"20\" y=\"96\" width=\"600\" height=\"44\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"34\" y=\"114\" font-size=\"12\" fill=\"var(--ink)\">偏向锁 01：</text><text x=\"34\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">threadId 23bit | epoch 2bit | age 4bit | biased=1 | 01</text><rect x=\"20\" y=\"148\" width=\"600\" height=\"44\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"34\" y=\"166\" font-size=\"12\" fill=\"var(--ink)\">轻量锁 00：</text><text x=\"34\" y=\"184\" font-size=\"12\" fill=\"var(--muted)\">指向栈中 Lock Record 的指针 62bit | 00</text><rect x=\"20\" y=\"200\" width=\"600\" height=\"44\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"34\" y=\"218\" font-size=\"12\" fill=\"var(--ink)\">重量锁 10：</text><text x=\"34\" y=\"236\" font-size=\"12\" fill=\"var(--muted)\">指向 ObjectMonitor 的指针 62bit | 10</text><text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">age 4bit = 0~15，这就是 MaxTenuringThreshold 上限 15 的硬边界</text><text x=\"320\" y=\"292\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">锁升级 = Mark Word 内容的整体换装，字段不变、哈希可能被挤掉</text></svg>",
    "caption": "图：Mark Word 在四种锁状态下的 64 bit 布局与 age 4bit 硬边界"
   },
   {
    "t": "h",
    "text": "二、字段重排：JVM 悄悄重排了你的字段"
   },
   {
    "t": "p",
    "text": "实例数据的排列顺序不完全按源码声明，HotSpot 会按一个固定策略重排：引用（Oops）优先放对象头后面，其次是 long/double，再 int/float，再 short/char，再 byte/boolean，最后才是对齐填充。为什么引用优先？因为对象头是被访问最频繁的区域，把引用字段排紧挨对象头，配合压缩指针，取字段时更可能命中缓存行，间接寻址的代价更低。这个策略在 64 位 + 压缩指针下收益尤其明显——引用字段只占 4 字节，密集排列让一条 64 字节缓存行能装下更多对象头+字段。"
   },
   {
    "t": "p",
    "text": "对游戏服的启示有两条。第一，别试图通过改字段声明顺序做微优化——JVM 会重排，你的顺序可能被无视；真正的热点靠 JOL（org.openjdk.jol）打印实际布局来判断。第二，真正的坑是伪共享（False Sharing）：两个不同对象/字段落在同一缓存行，被不同线程频繁改写，互相\"踢\"缓存行导致性能雪崩。对策是 -XX:+UseCondCardMark 之外的字段级方案 @Contended 注解（JDK8+，需 -XX:-RestrictContended 解锁使用），LongAdder 的 Cell 数组、Disruptor 的 Sequence 都用它错开缓存行。"
   },
   {
    "t": "h",
    "text": "三、TLAB 全流程：快分配、慢分配与浪费"
   },
   {
    "t": "p",
    "text": "TLAB 默认开启（-XX:+UseTLAB），每个线程在 Eden 预占一块私有缓冲，分配对象时只在缓冲内挪 top 指针，全程无锁。但 TLAB 的完整机制比\"一块缓冲\"复杂得多：每次 GC 后 JVM 按线程过去的分配速率估算下一轮的 desired_size（期望大小），最小 2KB（-XX:MinTLABSize），最大略小于 1GB，动态调整。分配对象时走三岔路：对象小于当前剩余空间 → 快分配直接挪指针；对象大于剩余空间但小于 refill_waste_limit（允许浪费线，默认 TLAB 大小的 1/64，由 -XX:TLABRefillWasteFraction=64 控制）→ 废弃当前 TLAB 换新块；对象大于 refill_waste_limit → 走慢分配，直接到 Eden 共享区用 CAS 分配。"
   },
   {
    "t": "p",
    "text": "两个参数组合起来才是完整的浪费模型：-XX:TLABWasteTargetPercent 默认 1%，决定整个 Eden 里 TLAB 允许浪费的总比例（慢分配遗留的空隙 + GC 时未用完的余量）；-XX:TLABWasteIncrement 默认 4，每次慢分配后 JVM 会调高 waste 阈值以减少后续慢分配。对游戏服的意义：战斗结算大量 new 小对象基本全走快分配，是\"分配接近线程私有\"的第一道防线；但把一个大数组塞进循环体，每次超过 TLAB 剩余 → 慢分配 → CAS 竞争，性能立刻退化——这就是为什么对象池与基本类型替代仍然必要，TLAB 不是银弹。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">TLAB 分配三岔路</text><rect x=\"200\" y=\"44\" width=\"240\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">new 对象 obj</text><path d=\"M260 84 L260 110\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M320 84 L320 110\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M380 84 L380 110\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"140\" y=\"112\" width=\"240\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"260\" y=\"134\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">obj &lt; 剩余空间</text><text x=\"260\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">快分配：TLAB 内挪 top 指针，无锁</text><rect x=\"410\" y=\"112\" width=\"210\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"515\" y=\"134\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">剩余 &lt; obj &lt; waste线</text><text x=\"515\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">废弃当前 TLAB 换新块</text><rect x=\"290\" y=\"190\" width=\"200\" height=\"52\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"390\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">obj &gt; waste线</text><text x=\"390\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">慢分配：Eden 共享区 CAS</text><path d=\"M260 164 L260 186\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><path d=\"M515 164 L430 210\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><text x=\"320\" y=\"268\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TLABWasteTargetPercent 默认 1% | TLABRefillWasteFraction 默认 64（1/64）</text><text x=\"320\" y=\"288\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">慢分配遗留 + GC 未用完余量 = TLAB 浪费，总量受 1% 约束</text></svg>",
    "caption": "图：TLAB 快分配/换块/慢分配三岔路与两个默认参数"
   },
   {
    "t": "h",
    "text": "四、逃逸分析全流程：从字节码到\"不创建对象\""
   },
   {
    "t": "p",
    "text": "逃逸分析不是单独一环，而是长在 JIT 流水线上的分析：先方法内联把方法边界消掉（内联越充分，对象图越容易整体分析），再对每个 new 出来的对象做逃逸判定——方法逃逸（被返回值带出/传给外部方法）、线程逃逸（被赋值给成员字段或静态字段，可能被别的线程访问）、参数逃逸。判定结果为\"完全不逃逸\"的对象触发三类产物：标量替换（把对象字段拆成若干个局部标量放栈帧/寄存器，对象本体根本不创建——这才是\"栈上分配\"的真相）、栈上分配/无堆分配（标量替换的别名效果）、锁消除（同步锁对象不线程逃逸则去掉加解锁指令）。"
   },
   {
    "t": "p",
    "text": "一个常被忽略的关键：逃逸分析只对 C2（Level 4）生效，解释执行和 C1 阶段对象照常进堆。所以游戏服想蹭这个红利，代码必须满足三个条件：热路径（达到编译阈值）、方法体足够小可内联、临时对象作用域严格限制在方法内。反例比正例更容易考：把临时结算对象塞进战斗上下文的 Map 里复用，立刻线程逃逸，逃逸分析失效——这就是\"对象池用错地方\"和\"逃逸分析\"互相冲突的典型场景，面试时把这对矛盾讲出来就是加分项。验证手段：JMH 跑 -XX:+DoEscapeAnalysis / -XX:-DoEscapeAnalysis 对比 GC 次数，或 JITWatch 看对象是否被编译掉。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 逃逸分析红利场景：结算对象完全留在方法内\npublic int sumDamage(int[] atk, int[] def) {\n    int sum = 0;\n    for (int i = 0; i < atk.length; i++) {   // 热循环，方法小可内联\n        sum += Math.max(1, atk[i] - def[i]); // 全部基本类型，零对象\n    }\n    return sum;\n}\n// 反例：把中间结果塞进成员字段/集合 → 线程逃逸 → 标量替换失效\n// class Battle {\n//     private final List<DamageEvent> log = new ArrayList<>(); // 每个事件被集合持有\n// }"
   },
   {
    "t": "pits",
    "items": [
     "把 age 4bit 说成 GC 设计的巧合——它是对象头位宽决定的硬边界，MaxTenuringThreshold 设 16 直接启动报错",
     "以为重写 hashCode() 后偏向锁不受影响——identity hashcode 只在无锁状态存在，重写 hashCode 的类偏锁会撤销",
     "试图靠声明顺序优化字段布局——JVM 按引用/长整型/整型策略重排，用 JOL 看实际布局而不是猜",
     "只讲 TLAB 是\"线程私有缓冲\"不讲慢分配三岔路——对象大于剩余空间走 Eden 共享区 CAS，这才是性能退化点",
     "把逃逸分析说成对所有代码生效——只有 C2 热代码生效，解释执行/C1 阶段对象照常进堆",
     "用对象池又抱怨逃逸分析不生效——池化对象必然被共享，与\"留在方法内\"的红利互相矛盾，二者取其一"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Mark Word 是 64 bit 按锁状态复用的变脸槽位，age 4bit 锁死晋升阈值 15；字段被 JVM 按引用优先策略重排，伪共享用 @Contended 治；TLAB 三岔路记\"小快分、中大换块、超大慢分\"，浪费总量受 1% 约束；逃逸分析是 C2 流水线产物，标量替换才是栈上分配的真相，热路径+小方法+不逃逸三条件缺一不可。"
   }
  ]
 },
 {
  "id": "jvm-refs-oom",
  "title": "引用类型与 OOM 全图鉴",
  "layer": 1,
  "depends": [
   "jvm-memory-objects"
  ],
  "covers": [
   "jvm-25",
   "jvm-27",
   "jvm-28"
  ],
  "quiz": [
   "jvm-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "强软弱虚四级引用决定对象\"什么时候可以被回收\"；而每一类 OOM 的报错文本都精确指向一个内存区域——Java heap space、Metaspace、Direct buffer memory、unable to create native thread、StackOverflow、GC overhead limit exceeded，把报错当分诊信号，配合三板斧，任何 OOM 都能收敛。"
   },
   {
    "t": "pre",
    "items": [
     "内存区域划分与元空间/直接内存的边界（jvm-memory-objects）",
     "GC Roots 与可达性分析（jvm-gc-basics）",
     "会读启动参数与 hs_err 日志的基本能力"
    ]
   },
   {
    "t": "h",
    "text": "一、四种引用：回收时机的四档开关"
   },
   {
    "t": "p",
    "text": "四种引用按\"GC 时保不保命\"分级：强引用（可达就永不回收，宁可 OOM）；软引用（内存不足、临近 OOM 才回收，-XX:SoftRefLRUPolicyMSPerMB 默认 1000 毫秒控制最近访问活跃度）；弱引用（只要发生 GC、只剩弱引用就回收）；虚引用（get() 永远 null，不影响生命周期，只配合 ReferenceQueue 在回收时收到通知）。工程选型的标准答案：游戏服缓存默认用带容量上限与过期策略的 Caffeine（强引用 + 显式驱逐），软引用只用于\"丢了可重建\"的辅助缓存——因为软引用回收时机不可控，缓存命中率随堆压力波动，还可能加剧 GC 前堆积。虚引用的核心战场是堆外内存：JDK 的 Cleaner 和 Netty 的 ResourceLeakDetector 都基于它做确定性清理与泄漏追踪。"
   },
   {
    "t": "table",
    "head": [
     "报错文本",
     "对应区域",
     "典型根因",
     "首选排查"
    ],
    "rows": [
     [
      "Java heap space",
      "堆",
      "泄漏 / 堆配小 / 大对象",
      "jstat 看 O 斜率 + dump 支配树"
     ],
     [
      "Metaspace",
      "元空间",
      "热更/动态代理类太多卸不掉",
      "dump 数 ClassLoader 实例"
     ],
     [
      "Direct buffer memory",
      "堆外直接内存",
      "Netty buffer 泄漏 / 上限没设",
      "leakDetection + NMT"
     ],
     [
      "unable to create native thread",
      "线程栈（native）",
      "线程数超限 / ulimit / 内存不足",
      "ps -eLf 数线程 + 查 ulimit"
     ],
     [
      "StackOverflowError",
      "虚拟机栈",
      "深递归 / 无限递归",
      "jstack 看栈顶 + 查调用链"
     ],
     [
      "GC overhead limit exceeded",
      "堆（GC 失效）",
      "99% 时间 GC、回收不到 2%",
      "同 Java heap space，先查泄漏"
     ]
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">OOM 六类报错 → 区域 → 根因 → 工具</text><rect x=\"20\" y=\"40\" width=\"180\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"58\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Java heap space → 堆</text><rect x=\"200\" y=\"40\" width=\"190\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"295\" y=\"58\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">泄漏/配小/大对象</text><rect x=\"390\" y=\"40\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"505\" y=\"58\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">jstat O 斜率 + MAT 支配树</text><rect x=\"20\" y=\"72\" width=\"180\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Metaspace → 元空间</text><rect x=\"200\" y=\"72\" width=\"190\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"295\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">类卸不掉（热更）</text><rect x=\"390\" y=\"72\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"505\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">dump 数 ClassLoader</text><rect x=\"20\" y=\"104\" width=\"180\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Direct buffer memory</text><rect x=\"200\" y=\"104\" width=\"190\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"295\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ByteBuf 泄漏/未限额</text><rect x=\"390\" y=\"104\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"505\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">leakDetection + NMT</text><rect x=\"20\" y=\"136\" width=\"180\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">native thread → 线程</text><rect x=\"200\" y=\"136\" width=\"190\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"295\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">线程数超限</text><rect x=\"390\" y=\"136\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"505\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">ps -eLf 数线程 + ulimit</text><rect x=\"20\" y=\"168\" width=\"180\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">StackOverflow → 栈</text><rect x=\"200\" y=\"168\" width=\"190\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"295\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">深/无限递归</text><rect x=\"390\" y=\"168\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"505\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">jstack 看栈顶调用链</text><rect x=\"20\" y=\"200\" width=\"180\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">GC overhead limit</text><rect x=\"200\" y=\"200\" width=\"190\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"295\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">GC 空转（堆已满）</text><rect x=\"390\" y=\"200\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"505\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">同 heap space，先查泄漏</text><text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">三板斧：一斧趋势（jstat/GC 日志）→ 二斧快照（dump + 支配树 + Path to GC Roots）→ 三斧收尾（NMT/线程数/栈深/业务复查）</text><text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">记住：OOM 是症状，泄漏是病因；堆外泄漏堆内监控完全看不见</text></svg>",
    "caption": "图：OOM 报错分诊表——报错文本就是最优先的线索"
   },
   {
    "t": "h",
    "text": "二、Java heap space 与 GC overhead：一对难兄难弟"
   },
   {
    "t": "p",
    "text": "Java heap space 是堆内存分配不出新对象，根因三选一：泄漏（该回收的被 Roots 拽住）、堆配小（-Xmx 不够）、单次大对象（瞬间请求超大数组）。GC overhead limit exceeded 是它的\"前传\"：-XX:+UseGCOverheadLimit（默认开启）检测到 GC 用了 98% 以上的时间却回收不到 2% 的堆，判定 GC 空转，直接抛 OOM——本质是堆已满、活对象太多，先于 heap space 报出来，收到它说明堆压力已到极限。两者共用一套排查：先看 jstat -gcutil 的 O（老年代）增长斜率——持续爬坡是泄漏，一条直线是配小；再 dump 看支配树找 Retained Heap 大户、Path to GC Roots 找强引用链；最后对号入座修代码或调堆。游戏服最常见的 Leak 是玩家下线没从在线 Map 移除、本地缓存无上限、ThreadLocal 在线程池没 remove 三件套。"
   },
   {
    "t": "h",
    "text": "三、Metaspace OOM：类元数据卸不掉"
   },
   {
    "t": "p",
    "text": "OutOfMemoryError: Metaspace 的根因是类元数据占满元空间（本地内存，默认不设上限，直到把机器内存吃光）。典型来源：热更新反复 new ClassLoader 旧类卸不掉（旧类实例还被全局事件总线/定时器/线程持有）；动态代理/脚本引擎批量生成类（CGLIB、Groovy）；导表工具每轮生成新类。参数语义要分清：-XX:MetaspaceSize（默认约 21M）是\"首次 Full GC 触发水位\"不是上限，不设会启动期连续 Full GC；-XX:MaxMetaspaceSize（默认不限）才是硬上限，生产建议显式给值 + 监控。排查要点：dump 里 MAT 搜自定义 ClassLoader 看存活实例数，多于 2 个即热更泄漏实锤，再用 Path to GC Roots 找\"钉子\"（TCCL 持有、ThreadLocal value 是旧类实例都是常见钉子）。"
   },
   {
    "t": "h",
    "text": "四、Direct buffer memory 与 unable to create native thread：两个 native 区"
   },
   {
    "t": "p",
    "text": "Direct buffer memory 是堆外直接内存耗尽，Netty 游戏服头号 native 风险：DirectByteBuffer 只是堆里的\"壳\"，堆外内存靠壳被 GC 后 Cleaner 释放——堆很健康时壳迟迟不死，堆外早已超限，表现为\"jstat 完全正常但 OOM\"。默认上限 -XX:MaxDirectMemorySize 等于 -Xmx，堆 8G 堆外也可能吃 8G，堆+堆外超出物理内存会被 OOM Killer 无声杀掉（exit 137，无 Java 异常）。排查三招：泄漏检测 -Dio.netty.leakDetectionLevel=ADVANCED 打 LEAK 日志（带分配栈）、NMT（-XX:NativeMemoryTracking=summary + jcmd VM.native_memory）看堆外增长、RES 持续上涨而堆平稳即堆外泄漏实锤。"
   },
   {
    "t": "p",
    "text": "unable to create native thread 是另一个 native 区：线程栈是 native 内存（-Xss 每线程一份），创建新线程时被拒绝。根因：线程数打满（查 /proc/sys/kernel/threads-max、ulimit -u、pids.max）、或 native 内存不足（栈 + 堆 + 堆外叠加超限）。游戏服排查：ps -eLf | wc -l 数线程总数，jstack 看是哪个池疯狂建线程（拒绝策略写错、线程池无界、EventLoop 泄漏都是经典），再查 ulimit 与容器 pids limit。注意线程数满了之后连 dump/重启都可能失败——先杀掉异常线程来源（或先删几个线程）再取证。"
   },
   {
    "t": "h",
    "text": "五、StackOverflowError：栈深度撞墙"
   },
   {
    "t": "p",
    "text": "StackOverflowError 是虚拟机栈深度超限（默认 -Xss 约 1MB，游戏服常调 512k），根因几乎都是深递归：XML 递归解析、树/图的递归遍历、对象图序列化、以及游戏服常见的寻路递归。一个例外情况值得记：无限递归往往先于栈溢出在 GC 层出问题（每层帧引用大量对象），所以\"栈溢出但内存暴涨\"也是常见组合。修复思路按性价比排：递归改循环/迭代（栈换堆）、限制递归深度（安全阀）、调大 -Xss（最后手段，注意线程数 × Xss 是总预算）。"
   },
   {
    "t": "h",
    "text": "六、OOM 定位三板斧：一套通吃的流程"
   },
   {
    "t": "p",
    "text": "不管哪类 OOM，处置流程一致：①止血与取证——摘流量保留一台现场，jmap dump + 保存 GC 日志/hs_err，再重启恢复（dump 会 STW，务必在摘流实例上做）；②定位——MAT 支配树按 Retained Heap 排序找大户，Path to GC Roots（排除软/弱引用）找强引用链；③收尾——按报错类型用对应工具复核（heap 查 O 斜率、Metaspace 数 ClassLoader、Direct 查 NMT/泄漏检测、thread 数线程、stack 查调用链），修复后灰度盯 jstat 一周验证曲线拉平。把报错文本当第一线索，把三板斧当固定流程，任何 OOM 都能在三十分钟内收敛到具体类。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "# 完整取证参数（任何游戏服生产启动参数都应包含）\n-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/logs/heapdump.hprof\n-XX:ErrorFile=/logs/hs_err_pid%p.log\n-XX:MaxMetaspaceSize=512m -XX:MaxDirectMemorySize=4g\n-XX:NativeMemoryTracking=summary\n# 排查动作清单\njstat -gcutil <pid> 1000          # ① 趋势：O 斜率 / FGC 次数 / YGC 单次耗时\njmap -dump:format=b,file=h.hprof  # ② 快照：摘流实例上做，会 STW\nps -eLf | wc -l                   # ③ native 线程数（unable to create native thread）\njcmd <pid> VM.native_memory      # ③ 堆外分配画像（Direct buffer memory）"
   },
   {
    "t": "pits",
    "items": [
     "软引用/弱引用分不清回收时机——软引用快 OOM 才回收，弱引用只要发生 GC 就回收，虚引用只发通知",
     "缓存选软引用——生产标准答案是 Caffeine 显式驱逐，软引用回收时机不可控、命中率随堆压力波动",
     "把 GC overhead limit 当成独立故障——它是堆满的前传，报它说明 GC 空转，先查泄漏再考虑调堆",
     "线程 OOM 还只查 Java 层——unable to create native thread 是 native 资源，ulimit/容器 pids 也要查",
     "堆外泄漏指望 jstat 发现——Direct buffer memory 堆内监控完全看不见，RES 对比 + NMT + 泄漏检测三件套",
     "Metaspace OOM 只调大 MaxMetaspaceSize——先查旧 ClassLoader 是否卸得掉，调大只是拖延复发"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：四引用记\"强到 OOM 不放、软到没内存才放、弱到 GC 就放、虚只报丧\"，缓存选型 Caffeine 显式驱逐；OOM 报错即分诊信号——heap 查斜率、Metaspace 数 loader、Direct 查 NMT、thread 数线程、stack 查调用链、overhead 先查泄漏；三板斧\"趋势→快照→收尾\"一通吃，取证参数提前配好，别等出事才想起加 HeapDumpOnOutOfMemoryError。"
   }
  ]
 },
 {
  "id": "jvm-collectors",
  "title": "垃圾收集器谱系与低延迟演进",
  "layer": 2,
  "depends": [
   "jvm-gc-basics"
  ],
  "covers": [
   "jvm-06",
   "jvm-13",
   "jvm-14",
   "jvm-18",
   "jvm-24",
   "jvm-33"
  ],
  "quiz": [
   "jvm-06",
   "jvm-13",
   "jvm-14"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从 Serial 到 ZGC 的收集器演进、CMS 与 G1 的设计哲学差异、G1 的 Region/RSet/SATB 深水区，以及 GC 日志怎么读——收集器谱系一网打尽。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握三种基础算法与分代（jvm-gc-basics）",
     "知道 Minor/Full GC 与晋升规则",
     "本节点把「算法」升级成「收集器实现」，JDK 版本差异是考点"
    ]
   },
   {
    "t": "h",
    "text": "收集器谱系一句话定位"
   },
   {
    "t": "p",
    "text": "版本事实先钉死（已核实）：JDK8 默认 Parallel（吞吐优先）；JDK9 起默认 G1（JEP 248 官方确认）；CMS JDK9 标记废弃、JDK14 彻底删除；ZGC JDK11 实验、JDK15 正式、JDK21 分代 ZGC（JEP 439，需显式 -XX:+UseZGC -XX:+ZGenerational，默认仍是 G1）。"
   },
   {
    "t": "table",
    "head": [
     "收集器",
     "定位",
     "核心算法/特点"
    ],
    "rows": [
     [
      "Serial / Serial Old",
      "单线程，客户端或小应用",
      "复制 + 整理"
     ],
     [
      "ParNew",
      "Serial 多线程版，唯一能配 CMS 的新生代",
      "复制"
     ],
     [
      "Parallel Scavenge/Old",
      "吞吐量优先，JDK8 默认",
      "复制 + 整理"
     ],
     [
      "CMS",
      "老年代并发，追求最短 STW（JDK14 删除）",
      "标记-清除"
     ],
     [
      "G1",
      "分区化、可预测停顿，JDK9+ 默认",
      "Region 复制"
     ],
     [
      "ZGC / Shenandoah",
      "大堆毫秒级停顿，JDK15 正式",
      "并发转移 + 染色/转发指针"
     ]
    ]
   },
   {
    "t": "h",
    "text": "CMS 四阶段与三大缺点"
   },
   {
    "t": "p",
    "text": "初始标记(STW) → 并发标记 → 重新标记(STW) → 并发清除。三大缺点：CPU 敏感（并发标记吃核）；浮动垃圾（并发期产生的新垃圾留到下轮）；标记-清除产生碎片。并发清除期间老年代被新对象填满 → concurrent mode failure → 退化 Serial Old 单线程 Full GC，STW 极长。这也是它被 G1 取代的原因。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 230'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>HotSpot 收集器演进时间线</text>\n  <rect x='30' y='70' width='100' height='56' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='80' y='92' font-size='13' fill='var(--ink)' text-anchor='middle'>Serial</text>\n  <text x='80' y='112' font-size='12' fill='var(--muted)' text-anchor='middle'>单线程</text>\n  <rect x='150' y='70' width='100' height='56' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='200' y='92' font-size='13' fill='var(--ink)' text-anchor='middle'>Parallel</text>\n  <text x='200' y='112' font-size='12' fill='var(--muted)' text-anchor='middle'>JDK8 默认</text>\n  <rect x='270' y='70' width='100' height='56' rx='6' fill='var(--lv3-bg)' stroke='var(--lv3)'/>\n  <text x='320' y='92' font-size='13' fill='var(--ink)' text-anchor='middle'>CMS</text>\n  <text x='320' y='112' font-size='12' fill='var(--lv3)' text-anchor='middle'>JDK14 删除</text>\n  <rect x='390' y='70' width='100' height='56' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='440' y='92' font-size='13' fill='var(--ink)' text-anchor='middle'>G1</text>\n  <text x='440' y='112' font-size='12' fill='var(--lv1)' text-anchor='middle'>JDK9+ 默认</text>\n  <rect x='510' y='70' width='100' height='56' rx='6' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='560' y='92' font-size='13' fill='var(--ink)' text-anchor='middle'>ZGC</text>\n  <text x='560' y='112' font-size='12' fill='var(--accent)' text-anchor='middle'>15 正式/21 分代</text>\n  <line x1='132' y1='98' x2='146' y2='98' stroke='var(--line)' stroke-width='2'/>\n  <path d='M148 98 l-7 -3 v6 z' fill='var(--line)'/>\n  <line x1='252' y1='98' x2='266' y2='98' stroke='var(--line)' stroke-width='2'/>\n  <path d='M268 98 l-7 -3 v6 z' fill='var(--line)'/>\n  <line x1='372' y1='98' x2='386' y2='98' stroke='var(--line)' stroke-width='2'/>\n  <path d='M388 98 l-7 -3 v6 z' fill='var(--line)'/>\n  <line x1='492' y1='98' x2='506' y2='98' stroke='var(--line)' stroke-width='2'/>\n  <path d='M508 98 l-7 -3 v6 z' fill='var(--line)'/>\n  <text x='320' y='160' font-size='12' fill='var(--muted)' text-anchor='middle'>设计主线：吞吐 → 低延迟 → 可预测停顿 → 亚毫秒 STW</text>\n  <text x='320' y='182' font-size='12' fill='var(--muted)' text-anchor='middle'>Shenandoah：Brooks 转发指针实现并发转移，不进 Oracle JDK，选型优先 ZGC 主线</text>\n  <text x='320' y='204' font-size='12' fill='var(--lv3)' text-anchor='middle'>口诀：CMS 并发清碎，G1 分区可预期，ZGC 染色毫秒级</text>\n</svg>",
    "caption": "图：HotSpot 收集器演进与版本事实"
   },
   {
    "t": "h",
    "text": "G1：Region 化与可预测停顿"
   },
   {
    "t": "p",
    "text": "G1 把堆均分为约 2048 个 Region，物理上不再连续分代，每个 Region 逻辑扮演 Eden/Survivor/Old。RSet（Remembered Set）为每个 Region 记账「哪些外部 Region 引用了我」，回收某 Region 不必扫全堆找引用来源；代价是写屏障维护开销约 10%-20%。回收分 Young GC（全量收 Eden+Survivor）和 Mixed GC——老年代占比超 -XX:InitiatingHeapOccupancyPercent（默认 45%）触发并发标记后，分批回收部分老年代 Region，「混着收、慢慢收」。停顿预测模型按历史回收成本给每个 Region 打分，在 MaxGCPauseMillis（软目标，默认 200ms）预算内选「性价比最高」的 CSet——这是 G1 区别于 CMS 的灵魂。"
   },
   {
    "t": "p",
    "text": "超过 Region 一半的对象是 Humongous，直接占连续 Region 进老年代，不走常规回收路径，易引发分配失败、evacuation failure 和 Full GC——游戏服的大数组要拆、要堆外、要调大 Region 规避。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 290'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>G1：堆被切成 Region，逻辑分代</text>\n  <rect x='40' y='48' width='380' height='150' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <rect x='50' y='58' width='60' height='40' rx='3' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='80' y='82' font-size='12' fill='var(--ink)' text-anchor='middle'>Eden</text>\n  <rect x='116' y='58' width='60' height='40' rx='3' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='146' y='82' font-size='12' fill='var(--ink)' text-anchor='middle'>Eden</text>\n  <rect x='182' y='58' width='60' height='40' rx='3' fill='var(--lv2)'/>\n  <text x='212' y='82' font-size='12' fill='var(--bg)' text-anchor='middle'>S0</text>\n  <rect x='248' y='58' width='60' height='40' rx='3' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='278' y='82' font-size='12' fill='var(--ink)' text-anchor='middle'>Eden</text>\n  <rect x='314' y='58' width='60' height='40' rx='3' fill='var(--lv3-bg)' stroke='var(--lv3)'/>\n  <text x='344' y='82' font-size='12' fill='var(--ink)' text-anchor='middle'>Humongous</text>\n  <rect x='50' y='104' width='60' height='40' rx='3' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='80' y='128' font-size='12' fill='var(--ink)' text-anchor='middle'>Eden</text>\n  <rect x='116' y='104' width='60' height='40' rx='3' fill='var(--lv2)'/>\n  <text x='146' y='128' font-size='12' fill='var(--bg)' text-anchor='middle'>S1</text>\n  <rect x='182' y='104' width='60' height='40' rx='3' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='212' y='128' font-size='12' fill='var(--ink)' text-anchor='middle'>Eden</text>\n  <rect x='248' y='104' width='60' height='40' rx='3' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='278' y='128' font-size='12' fill='var(--ink)' text-anchor='middle'>Old</text>\n  <rect x='314' y='104' width='60' height='40' rx='3' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='344' y='128' font-size='12' fill='var(--ink)' text-anchor='middle'>Old</text>\n  <rect x='50' y='150' width='60' height='40' rx='3' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='80' y='174' font-size='12' fill='var(--ink)' text-anchor='middle'>Old</text>\n  <rect x='116' y='150' width='60' height='40' rx='3' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='146' y='174' font-size='12' fill='var(--ink)' text-anchor='middle'>Old</text>\n  <rect x='182' y='150' width='60' height='40' rx='3' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='212' y='174' font-size='12' fill='var(--accent)' text-anchor='middle'>CSet</text>\n  <rect x='248' y='150' width='60' height='40' rx='3' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='278' y='174' font-size='12' fill='var(--ink)' text-anchor='middle'>Old</text>\n  <rect x='314' y='150' width='60' height='40' rx='3' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='344' y='174' font-size='12' fill='var(--ink)' text-anchor='middle'>Old</text>\n  <text x='320' y='218' font-size='12' fill='var(--muted)' text-anchor='middle'>Region 大小 = 堆 / 2048 取 2 的幂（1M-32M）；超过一半的对象即 Humongous → 进老年代</text>\n  <text x='320' y='238' font-size='12' fill='var(--muted)' text-anchor='middle'>RSet：记「谁引用了我的 Region」，回收局部化，不用扫全堆</text>\n  <text x='320' y='258' font-size='12' fill='var(--muted)' text-anchor='middle'>停顿模型：历史成本 + 收益排序 → 预算内选 CSet（MaxGCPauseMillis 是软目标）</text>\n  <text x='320' y='278' font-size='12' fill='var(--lv3)' text-anchor='middle'>口诀：分格子、记小账、挑肥的收、预算内办事</text>\n</svg>",
    "caption": "图：G1 Region 逻辑分代、RSet 与 CSet 价值排序"
   },
   {
    "t": "h",
    "text": "G1 并发标记与 SATB"
   },
   {
    "t": "p",
    "text": "老年代占比超 IHOP 触发并发标记周期，五阶段：初始标记（借 Young GC 的 piggyback 完成，STW，极快）→ 根区域扫描 → 并发标记（SATB 保证正确性）→ 重新标记（处理 SATB 队列，STW）→ 清理（统计各 Region 存活比，选出后续 mixed GC 的 CSet）。"
   },
   {
    "t": "p",
    "text": "SATB（Snapshot-At-The-Beginning）思想：标记开始时对对象图拍「逻辑快照」，并发期间引用变化用写屏障记录「被覆盖的旧引用」进队列，Remark 重放即可——保守地把开始时刻活着的对象都算活，浮动垃圾留给下轮。对比 CMS 的增量更新（记录「新插入的引用」，黑指向白时把黑变灰），Remark 要重扫老年代及新生代，STW 明显更长。三色标记漏标需两条件同时满足，SATB 破坏「灰色到白色的引用被切断」，增量更新破坏「黑色新引用白色」——各破其一即防漏。"
   },
   {
    "t": "h",
    "text": "ZGC 与 Shenandoah：低延迟两条路线"
   },
   {
    "t": "p",
    "text": "ZGC 把 GC 元信息存在 64 位指针高位（染色指针 Marked0/Marked1/Remapped），配合读屏障：应用线程读引用时检查指针颜色，发现指向已转移的旧地址就自愈修正。对象移动与业务运行同时进行，STW 只与 GC Roots 数量相关、与堆大小无关——官方宣称 ≤1ms，TB 级堆也成立。代价：吞吐比 G1 低 5%-15%、需要更多堆余量消化浮动垃圾。JDK21 分代 ZGC 引入年轻代高频快收，吞吐拉回接近 G1。Shenandoah 用对象头的 Brooks 转发指针实现并发转移，需读写屏障、无分代，且不进 Oracle JDK——商业项目选型优先 ZGC 主线。"
   },
   {
    "t": "h",
    "text": "GC 日志怎么读（G1 为例）"
   },
   {
    "t": "p",
    "text": "抓三指标：频率、单次耗时（real）、回收后水位。关键字段：GC pause (G1 Evacuation Pause) (young) 是 Young GC；Heap: 回收前(总量)->回收后(总量)，Eden 清 0 且堆下降明显说明垃圾为主、健康；Times 里 real 是真实 STW，user 远大于 real 说明并行充分；出现 Full GC (Allocation Failure) 或 to-space exhausted / evacuation failure 即红灯。健康线：Minor 单次 real < 50ms、老年代水位长期不爬坡、无 Full GC。"
   },
   {
    "t": "pits",
    "items": [
     "忽略 CMS 已废弃、JDK14 删除的现状——老项目用 CMS 参数升到新 JDK 会直接启动失败",
     "把 mixed GC 说成一次回收全部老年代——是分批「混着收、慢慢收」",
     "把 MaxGCPauseMillis 说成硬保证——它是软目标，G1 尽力在预算内选 CSet",
     "漏 RSet 的写屏障维护开销——约 10%-20%，小堆上 G1 未必比 Parallel 好",
     "把分代 ZGC 说成 JDK21 默认 GC——需显式 -XX:+UseZGC -XX:+ZGenerational，默认仍是 G1",
     "Satb 与增量更新说不清「记旧引用 vs 记新引用」——这是 Remark 时长差异的根因"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：收集器谱系按「吞吐→低延迟→可预测→亚毫秒」演进，版本事实（JDK8 Parallel / JDK9+ G1 / CMS 14 删 / ZGC 15 正式 21 分代）张口就来；CMS 四阶段与并发失败退化是必考；G1 记「Region 分区 + RSet 记账 + 价值排序 CSet + SATB 快照」，停顿模型是它区别于 CMS 的灵魂；ZGC 用染色指针+读屏障把 STW 与堆大小解耦；GC 日志看频率、耗时、水位三指标，Full GC 与 evacuation failure 是红灯。"
   }
  ]
 },
 {
  "id": "jvm-game-tuning",
  "title": "游戏服长连接与高分配调优",
  "layer": 2,
  "depends": [
   "jvm-gc-basics",
   "jvm-jmm-jit"
  ],
  "covers": [
   "jvm-09",
   "jvm-10",
   "jvm-11",
   "jvm-26",
   "jvm-35"
  ],
  "quiz": [
   "jvm-09",
   "jvm-10",
   "jvm-11"
  ],
  "body": [
   {
    "t": "lead",
    "text": "长连接游戏服是「老年代重型」应用——常驻玩家数据 + 战斗临时对象，调优核心是减分配、控晋升、防泄漏。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握 GC 算法与收集器（jvm-gc-basics / jvm-collectors）",
     "已懂逃逸分析与 JIT（jvm-jmm-jit）",
     "本节点把理论落到游戏服参数与代码写法"
    ]
   },
   {
    "t": "h",
    "text": "游戏服内存画像：常驻与瞬态"
   },
   {
    "t": "p",
    "text": "长连接游戏服分两层：常驻部分（玩家对象背包属性任务、策划配置表、协议模板、连接会话）被 GC Roots 拽住、长期存活，老年代水位天然偏高；瞬态部分（战斗结算临时对象、协议编解码 buffer、日志事件）朝生夕灭，理想情况全死在 Eden。调优方向由此确定：扩大新生代消化瞬态、控制晋升节奏、选可预测停顿的收集器、玩家下线必须清理——后者是真实线上事故高发点。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 250'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>游戏服堆内存双层画像</text>\n  <rect x='40' y='44' width='560' height='72' rx='6' fill='var(--lv3-bg)' stroke='var(--lv3)'/>\n  <text x='60' y='66' font-size='13' fill='var(--lv3)' font-weight='bold'>常驻层（老年代水位偏高）</text>\n  <text x='60' y='90' font-size='12' fill='var(--ink)'>在线玩家对象 / 配置表 / 协议模板 / 连接会话 / 本地缓存</text>\n  <text x='60' y='108' font-size='12' fill='var(--muted)'>被 GC Roots 拽住 → 长时间存活，全靠玩家下线清理兜底</text>\n  <rect x='40' y='130' width='560' height='72' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='60' y='152' font-size='13' fill='var(--lv1)' font-weight='bold'>瞬态层（理想全死在 Eden）</text>\n  <text x='60' y='176' font-size='12' fill='var(--ink)'>战斗结算对象 / 伤害事件 / 协议编解码 buffer / 日志事件</text>\n  <text x='60' y='194' font-size='12' fill='var(--muted)'>增大新生代占比 + TLAB + 逃逸分析，让它们 Minor GC 就死掉</text>\n  <text x='320' y='226' font-size='12' fill='var(--muted)' text-anchor='middle'>调优手段：新生代占比 / 晋升门槛 / 收集器选型 / 大对象管控 / 下线清理五条线</text>\n  <text x='320' y='246' font-size='12' fill='var(--lv3)' text-anchor='middle'>类比：常驻玩家是包夜客人，战斗临时对象是过客——别让过客占用包间</text>\n</svg>",
    "caption": "图：长连接游戏服的常驻/瞬态双层内存画像"
   },
   {
    "t": "h",
    "text": "一套常用的生产参数（8C16G 游戏服）"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# JDK8 + G1 游戏服参考（堆固定防扩缩容抖动）\n-Xms8g -Xmx8g\n-XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m\n-XX:+UseG1GC -XX:MaxGCPauseMillis=100\n-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/logs/heapdump.hprof\n-Xloggc:/logs/gc.log -XX:+PrintGCDetails -XX:+PrintGCDateStamps   # JDK8 格式\n# JDK9+ 换统一日志：-Xlog:gc*:file=gc.log:time\n-XX:MaxDirectMemorySize=4g     # Netty 必须显式，默认 = -Xmx 很危险\n-XX:+DisableExplicitGC         # 防第三方误调 System.gc()\n-Xss512k                       # 线程多时可调小省内存"
   },
   {
    "t": "p",
    "text": "关键取舍：-Xms=-Xmx 防运行期扩容（要申请内存并搬迁对象）和缩容（触发额外 GC），堆行为可预期；MetaspaceSize 显式设稳定值，消除启动期类加载引发的连续 Full GC；MaxDirectMemorySize 必须设，否则堆外默认等于堆大小，堆外+堆内加起来可能被系统 OOM Killer 无声杀掉（exit 137）。"
   },
   {
    "t": "h",
    "text": "战斗服高分配优化：减分配优先于调参数"
   },
   {
    "t": "p",
    "text": "影响链路：分配速率高 → Eden 快速填满 → Minor GC 频繁 → 每次 STW 几 ms 到几十 ms，玩家体感偶发卡顿 → 分配高峰期 Survivor 放不下触发分配担保 → 临时对象被挤进老年代 → 老年代加速填满 → Full GC。核心思路是「减少分配」而非「加快回收」。"
   },
   {
    "t": "list",
    "items": [
     "对象池/复用：伤害事件、战斗消息用对象池（自研环形池或 Netty Recycler）；Disruptor RingBuffer 预分配事件槽位零分配是教科书案例",
     "基本类型替代包装类：int 代替 Integer 避免自动装箱，集合用 fastutil/Trove",
     "复用 buffer：协议拼接用 StringBuilder/ByteBuf，避免 String 拼接产生中间对象",
     "蹭逃逸分析红利：临时对象留在方法内、方法小利于内联",
     "堆外化：大 buffer 用 Netty 直接内存池（PooledByteBufAllocator），不进堆"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 230'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>Disruptor RingBuffer：预分配 + 覆写 = 零分配</text>\n  <rect x='70' y='70' width='60' height='60' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='100' y='95' font-size='12' fill='var(--ink)' text-anchor='middle'>槽 0</text>\n  <text x='100' y='113' font-size='12' fill='var(--muted)' text-anchor='middle'>事件复用</text>\n  <rect x='150' y='70' width='60' height='60' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='180' y='95' font-size='12' fill='var(--ink)' text-anchor='middle'>槽 1</text>\n  <rect x='230' y='70' width='60' height='60' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='260' y='95' font-size='12' fill='var(--ink)' text-anchor='middle'>槽 2</text>\n  <rect x='310' y='70' width='60' height='60' rx='4' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='340' y='95' font-size='12' fill='var(--accent)' text-anchor='middle'>槽 3</text>\n  <text x='340' y='113' font-size='12' fill='var(--accent)' text-anchor='middle'>写指针处</text>\n  <rect x='390' y='70' width='60' height='60' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='420' y='95' font-size='12' fill='var(--ink)' text-anchor='middle'>槽 4</text>\n  <rect x='470' y='70' width='60' height='60' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='500' y='95' font-size='12' fill='var(--ink)' text-anchor='middle'>槽 5</text>\n  <line x1='60' y1='100' x2='66' y2='100' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M68 100 l-7 -3 v6 z' fill='var(--accent)'/>\n  <line x1='532' y1='100' x2='580' y2='100' stroke='var(--accent)' stroke-width='2' stroke-dasharray='4 4'/>\n  <text x='320' y='160' font-size='12' fill='var(--muted)' text-anchor='middle'>启动时预分配固定数量事件对象，槽位随环无限复用</text>\n  <text x='320' y='182' font-size='12' fill='var(--muted)' text-anchor='middle'>生产者只覆写槽内数据、不新建对象 → 全程零分配、零 GC 压力</text>\n  <text x='320' y='204' font-size='12' fill='var(--muted)' text-anchor='middle'>日志服/跨线程消息分发的高吞吐低延迟利器</text>\n  <text x='320' y='226' font-size='12' fill='var(--lv3)' text-anchor='middle'>口诀：战斗对象朝生夕灭，思路不是勤倒垃圾，而是少制造垃圾</text>\n</svg>",
    "caption": "图：Disruptor RingBuffer 预分配槽位复用实现零分配"
   },
   {
    "t": "h",
    "text": "Humongous 与字符串 intern：两个隐藏雷"
   },
   {
    "t": "p",
    "text": "大数组（战斗录像、批量日志聚合、GM 后台全表导出）超过 Region 一半就是 Humongous，直入老年代且占连续 Region，回收效率低、易引发分配失败和 Full GC——四招规避：拆（分片/分页）、堆外（直接内存池）、扩（-XX:G1HeapRegionSize 调大让大对象变回普通对象）、隔（GM/报表独立进程）。动态字符串（玩家昵称、SDK token、订单号）调 intern 会进全局 StringTable——等价于一个只增不减的全局 Map，温水煮青蛙式老年代爬坡：用带容量上限的 Caffeine 做有限去重，或开 G1 的 -XX:+UseStringDeduplication，别碰 intern。"
   },
   {
    "t": "pits",
    "items": [
     "只谈参数不谈业务引用清理——玩家下线不 remove 才是真实事故源，参数救不了泄漏",
     "-Xmx 与 -Xms 不设成一样大——运行期扩缩容会引发停顿",
     "漏 Netty 直接内存上限——默认 = -Xmx，堆外堆内相加可能撑爆物理内存",
     "调优全靠拍脑袋——要用 jstat -gcutil 看 O 增长斜率、GC 日志验证晋升速率",
     "讲 Disruptor 讲不出机理——「预分配 + 覆写 = 零分配」才是亮点",
     "把 intern 当字符串去重法宝——全局 StringTable 只增不减是泄漏源"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：游戏服先画双层内存画像（常驻老年代 + 瞬态 Eden）再谈调优；参数五件套「堆等大、GC 定、日志开、Dump 备、直存限」；高分配场景记「减分配优先于调参数」，Disruptor 零分配、基本类型、复用 buffer、逃逸分析红利四板斧；Humongous 用「拆、外、扩、隔」四字规避，动态字符串用 Caffeine 去重而非 intern；所有调优都要 jstat + GC 日志验证。"
   }
  ]
 },
 {
  "id": "jvm-troubleshooting",
  "title": "线上诊断工具链与故障排查",
  "layer": 2,
  "depends": [
   "jvm-gc-basics",
   "jvm-jmm-jit"
  ],
  "covers": [
   "jvm-15",
   "jvm-16",
   "jvm-17",
   "jvm-19",
   "jvm-28",
   "jvm-32"
  ],
  "quiz": [
   "jvm-15",
   "jvm-16",
   "jvm-19"
  ],
  "body": [
   {
    "t": "lead",
    "text": "线上事故处置章法：止血 → 取证 → 定位 → 修复，配合 jstat/jmap/jstack/jcmd/Arthas/JFR 工具链，把游戏服 OOM 与卡顿当场拿下。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握收集器与 GC 日志判读（jvm-collectors）",
     "已懂 JMM/线程模型（jvm-jmm-jit）",
     "本节点是纯实战章法，按事故处理顺序记"
    ]
   },
   {
    "t": "h",
    "text": "工具链分工总纲"
   },
   {
    "t": "table",
    "head": [
     "工具",
     "核心命令",
     "擅长的场景"
    ],
    "rows": [
     [
      "jstat",
      "-gcutil <pid> 1000",
      "看 GC 趋势：O 增长斜率、FGC 次数、YGC 单次耗时"
     ],
     [
      "jmap",
      "-histo / -dump",
      "内存直方图快速找大户；导出堆快照给 MAT（有 STW，先摘流）"
     ],
     [
      "jstack",
      "三连抓对比",
      "死锁、锁竞争、CPU 飙高线程定位"
     ],
     [
      "jcmd",
      "VM.flags / GC.heap_dump / VM.native_memory",
      "瑞士军刀；NMT 查堆外（Netty 直接内存）"
     ],
     [
      "Arthas",
      "jad / watch / trace / thread -b",
      "在线深挖单点：反编译确认版本、方法耗时、找最阻塞线程"
     ],
     [
      "JFR",
      "jcmd JFR.start / dump",
      "常开录像 + 事后复盘（时光机），开销 <1%-2%"
     ]
    ]
   },
   {
    "t": "p",
    "text": "趋势用 jstat 盯，快照用 jmap/jstack 抓，动态追踪用 Arthas，全程回放用 JFR。注意 jmap/jstack 会触发 STW，高峰期主用实例上慎用，先摘流量。"
   },
   {
    "t": "h",
    "text": "OOM 排查完整流程"
   },
   {
    "t": "p",
    "text": "顺序不能乱：先摘流量（保留一台做现场）→ 现场取证：jmap -dump:format=b,file=heap.hprof（dump 会 STW，务必在摘流实例上做）+ 保存 GC 日志/hs_err → 重启恢复服务 → MAT 打开 dump 看 Dominator Tree 找 Retained Heap 大户 → Path to GC Roots（排除软/弱引用）找强引用链 → 按报错类型分诊 → 修复灰度盯一周验证。"
   },
   {
    "t": "list",
    "items": [
     "五类典型嫌疑人：在线玩家 Map 只增不减（下线没清理）——游戏服最常见",
     "本地缓存无上限（Guava/Caffeine 没设 maximumSize/expire）",
     "静态集合/单例累积（日志缓冲队列、未消费的 Disruptor 积压）",
     "ClassLoader 泄漏（热更新反复加载旧类，元空间涨，dump 数 loader 实例）",
     "ThreadLocal 在线程池里没 remove，value 永远被线程拽住"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 300'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>OOM 排查四步章法</text>\n  <rect x='30' y='48' width='180' height='110' rx='6' fill='var(--lv3-bg)' stroke='var(--lv3)'/>\n  <text x='120' y='70' font-size='13' fill='var(--lv3)' text-anchor='middle' font-weight='bold'>① 止血与取证（分钟级）</text>\n  <text x='120' y='94' font-size='12' fill='var(--ink)' text-anchor='middle'>摘流量 / 留一台现场</text>\n  <text x='120' y='114' font-size='12' fill='var(--ink)' text-anchor='middle'>jmap dump + 存 GC/hs_err</text>\n  <text x='120' y='134' font-size='12' fill='var(--muted)' text-anchor='middle'>dump 会 STW，摘流实例上做</text>\n  <rect x='230' y='48' width='180' height='110' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='320' y='70' font-size='13' fill='var(--lv1)' text-anchor='middle' font-weight='bold'>② 重启恢复服务</text>\n  <text x='320' y='94' font-size='12' fill='var(--ink)' text-anchor='middle'>先保命再破案</text>\n  <text x='320' y='114' font-size='12' fill='var(--muted)' text-anchor='middle'>OOM 自动 dump + 手动 dump</text>\n  <text x='320' y='134' font-size='12' fill='var(--muted)' text-anchor='middle'>两份对比看增长轨迹</text>\n  <rect x='430' y='48' width='180' height='110' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='520' y='70' font-size='13' fill='var(--lv1)' text-anchor='middle' font-weight='bold'>③ 定位大户与黑手</text>\n  <text x='520' y='94' font-size='12' fill='var(--ink)' text-anchor='middle'>MAT 支配树找 Retained 大户</text>\n  <text x='520' y='114' font-size='12' fill='var(--ink)' text-anchor='middle'>Path to GC Roots 找强引用链</text>\n  <text x='520' y='134' font-size='12' fill='var(--muted)' text-anchor='middle'>按 OOM 报错类型分诊</text>\n  <line x1='212' y1='103' x2='226' y2='103' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M228 103 l-7 -3 v6 z' fill='var(--accent)'/>\n  <line x1='412' y1='103' x2='426' y2='103' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M428 103 l-7 -3 v6 z' fill='var(--accent)'/>\n  <rect x='140' y='182' width='360' height='60' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='320' y='204' font-size='13' fill='var(--ink)' text-anchor='middle' font-weight='bold'>④ 修复与验证</text>\n  <text x='320' y='226' font-size='12' fill='var(--muted)' text-anchor='middle'>修代码 → 灰度 → 盯 jstat/GC 日志一周，对比老年代增长曲线是否拉平</text>\n  <line x1='320' y1='160' x2='320' y2='178' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M320 180 l-4 -8 h8 z' fill='var(--accent)'/>\n  <text x='320' y='266' font-size='12' fill='var(--lv3)' text-anchor='middle'>口诀：先摘流、再取证、后重启；dump 找大户、Roots 找黑手、日志定类型</text>\n</svg>",
    "caption": "图：OOM 排查四步章法（止血→重启→定位→修复）"
   },
   {
    "t": "h",
    "text": "堆外与直接内存：看不见的杀手"
   },
   {
    "t": "p",
    "text": "DirectByteBuffer 是堆内的壳，堆外内存靠壳被 GC 后关联的 Cleaner（虚引用）释放——堆很健康时壳迟迟不死，堆外早已超限，报 OutOfMemoryError: Direct buffer memory。Netty 泄漏是 retain/release 不配对。排查三招：-Dio.netty.leakDetectionLevel=PARANOID（线上 ADVANCED）打 LEAK 日志并带分配栈；-XX:NativeMemoryTracking=summary + jcmd VM.native_memory 看堆外增长；RES 持续上涨而堆平稳 = 堆外问题实锤。容器里堆+堆外超 limit 被 OOM Killer 杀掉（exit code 137）无声无息，无任何 Java 异常。"
   },
   {
    "t": "h",
    "text": "卡顿排查：GC 之外的五类嫌疑"
   },
   {
    "t": "p",
    "text": "GC 日志干净但玩家仍卡 → 按嫌疑清单逐层排查：Safepoint 非 GC 触发（偏向锁批量撤销、类重定义、栈去优化，看 -Xlog:safepoint 的 TTSP）；业务大锁串行化（jstack 三连抓看 BLOCKED 分布，全局玩家表 synchronized 是经典）；JIT 逆优化风暴（热更批量换类，看 -XX:+PrintCompilation）；容器 CPU 限流 CFS throttle（查 cpu.throttled 指标）；swap/磁盘 IO（swappiness=0）。终极套路：业务埋点记录 P99 尖刺时间戳 → 对齐 safepoint/GC/系统监控 → 二分排除；async-profiler 的 wall-clock 火焰图直接看等待栈，是这类问题的终极武器。"
   },
   {
    "t": "h",
    "text": "JFR：常开的黑匣子"
   },
   {
    "t": "p",
    "text": "JFR 事件由 JVM 内部埋点直接写环形缓冲，无反射无插桩，开销 <1%-2%，是唯一敢在生产 7x24 常开的全维度工具——JDK11 起完全免费（JDK8 是商业特性）。用法：启动常开 -XX:StartFlightRecording=duration=24h,filename=app.jfr；或运行时 jcmd <pid> JFR.start settings=profile 临时抓现场，事后 jcmd JFR.dump 回放。卡顿看 jdk.JavaMonitorBlocked（锁阻塞）、jdk.ThreadPark、Safepoint 事件；内存看 jdk.ObjectAllocationSample（分配热点）与 jdk.OldObjectSample（老年代存活画像）。环形缓冲 = 时光机：玩家昨晚 8 点卡，现在也能 dump 当时现场。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 260'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>按问题场景选工具</text>\n  <rect x='30' y='44' width='240' height='30' rx='4' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='150' y='64' font-size='12' fill='var(--ink)' text-anchor='middle'>老年代爬坡 / FGC 次数涨</text>\n  <rect x='290' y='44' width='120' height='30' rx='4' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='350' y='64' font-size='12' fill='var(--accent)' text-anchor='middle'>jstat -gcutil</text>\n  <rect x='430' y='44' width='180' height='30' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='520' y='64' font-size='12' fill='var(--ink)' text-anchor='middle'>→ MAT dump / GC 日志</text>\n  <rect x='30' y='90' width='240' height='30' rx='4' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='150' y='110' font-size='12' fill='var(--ink)' text-anchor='middle'>死锁 / 锁竞争 / 卡死</text>\n  <rect x='290' y='90' width='120' height='30' rx='4' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='350' y='110' font-size='12' fill='var(--accent)' text-anchor='middle'>jstack / Arthas thread -b</text>\n  <rect x='430' y='90' width='180' height='30' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='520' y='110' font-size='12' fill='var(--ink)' text-anchor='middle'>→ 死锁链 / BLOCKED 分布</text>\n  <rect x='30' y='136' width='240' height='30' rx='4' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='150' y='156' font-size='12' fill='var(--ink)' text-anchor='middle'>某协议处理慢 / 怀疑线上版本不对</text>\n  <rect x='290' y='136' width='120' height='30' rx='4' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='350' y='156' font-size='12' fill='var(--accent)' text-anchor='middle'>Arthas watch / trace / jad</text>\n  <rect x='430' y='136' width='180' height='30' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='520' y='156' font-size='12' fill='var(--ink)' text-anchor='middle'>→ 入参/返回/耗时/字节码</text>\n  <rect x='30' y='182' width='240' height='30' rx='4' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='150' y='202' font-size='12' fill='var(--ink)' text-anchor='middle'>偶发卡顿想事后复盘 / 看分配热点</text>\n  <rect x='290' y='182' width='120' height='30' rx='4' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='350' y='202' font-size='12' fill='var(--accent)' text-anchor='middle'>JFR（常开 + dump）</text>\n  <rect x='430' y='182' width='180' height='30' rx='4' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='520' y='202' font-size='12' fill='var(--ink)' text-anchor='middle'>→ 锁事件/STW/分配采样</text>\n  <text x='320' y='242' font-size='12' fill='var(--muted)' text-anchor='middle'>口诀：stat 看势，map 看堆，stack 看线，cmd 全能，Arthas 在线手术，JFR 全程录像</text>\n</svg>",
    "caption": "图：诊断工具链按问题场景选型"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 三连抓 jstack（间隔 5-10 秒）对比「原地不动」的线程\njstack <pid> > /tmp/jstack1.txt; sleep 8; jstack <pid> > /tmp/jstack2.txt; jstack <pid> > /tmp/jstack3.txt\n# jstack 末尾直接报 Found one Java-level deadlock 就是死锁实锤\n# CPU 飙高定位：top -Hp <pid> → 线程号转 16 进制 → jstack 里搜 nid=0x<hex>\nprintf '%x\\n' <tid>\n# Arthas 在线诊断（attach 式，不重启）：\nthread -b               # 找阻塞别人最多的元凶线程\nthread --state BLOCKED  # 过滤阻塞线程\njad <类>                # 反编译确认线上版本（热更后好用）"
   },
   {
    "t": "pits",
    "items": [
     "一上来就重启丢现场——先摘流保留现场再动，顺序不能乱",
     "在高峰期主实例上直接 jmap/jstack——它们会 STW，先摘流量",
     "MAT 只看 Shallow Heap——排查看 Retained Heap（支配树按它排序）",
     "只抓一次 jstack 就下结论——要三连抓对比找「钉子户」",
     "漏容器层——OOM Killer 杀进程（exit 137）和 CPU throttle 都是无 Java 报错的宕机/卡顿",
     "把 JFR 记成收费工具——JDK11 起完全免费，JDK8 才需要商业特性解锁"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：工具分工记「stat 看势、map 看堆、stack 看线、cmd 全能、Arthas 在线手术、JFR 全程录像」；OOM 流程记「先摘流、再取证、后重启，dump 找大户、Roots 找黑手、日志定类型」，游戏服五类泄漏嫌疑人背下来；直接内存是监控盲区，靠泄漏检测 + NMT + RES 对比三招；卡顿不等于 GC，safepoint/锁/逆优化/容器/swap 五类嫌疑逐层排；JFR 是常开的时光机，值得每个游戏服都开。"
   }
  ]
 },
 {
  "id": "jvm-tri-color-marking",
  "title": "三色标记与并发 GC 正确性",
  "layer": 2,
  "depends": [
   "jvm-gc-basics"
  ],
  "covers": [
   "jvm-24"
  ],
  "quiz": [
   "jvm-24"
  ],
  "body": [
   {
    "t": "lead",
    "text": "并发 GC 最难的从来不是\"扫得慢\"，而是\"边扫边改\"——对象图在标记期间被并发修改就可能漏标。三色标记给每个对象染上白/灰/黑三种颜色跟踪标记进度，漏标两个条件同时满足才会发生，增量更新和 SATB 各破其一。"
   },
   {
    "t": "pre",
    "items": [
     "可达性分析与 GC Roots 六类（jvm-gc-basics）",
     "CMS 四阶段与 G1 并发标记周期的整体印象（jvm-collectors）",
     "知道写屏障这个词，但不清楚它插在哪里"
    ]
   },
   {
    "t": "h",
    "text": "一、三色标记：把标记进度染到对象上"
   },
   {
    "t": "p",
    "text": "三色标记是把\"可达性分析的过程\"可视化：白色=尚未被访问；灰色=自身已被标记为可达，但它的引用字段还没全部扫完；黑色=自身和它所有引用的对象都扫完。标记从 GC Roots 出发，把所有直接可达对象涂灰，然后一个个把灰对象变成黑色，同时把它引用到的白对象涂灰，直到没有灰色对象。结束时所有仍为白色的对象就是不可达的垃圾。这套算法在 STW 下单线程做没有任何正确性问题——问题是并发 GC 要让标记与应用线程同时跑，标记扫到一半，对象图变了，就会漏标。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">三色标记：白=未访问 灰=待扫描 黑=扫描完毕</text><circle cx=\"120\" cy=\"90\" r=\"30\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/><text x=\"120\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">白</text><text x=\"120\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">未访问</text><circle cx=\"320\" cy=\"90\" r=\"30\" fill=\"var(--lv2)\" opacity=\"0.9\"/><text x=\"320\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--bg)\">灰</text><text x=\"320\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">已标记待扫引用</text><circle cx=\"520\" cy=\"90\" r=\"30\" fill=\"var(--accent)\"/><text x=\"520\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--bg)\">黑</text><text x=\"520\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">自身+引用全扫完</text><path d=\"M150 90 L286 90\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M350 90 L486 90\" stroke=\"var(--line)\" stroke-width=\"2\"/><text x=\"320\" y=\"190\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">漏标两条件（同时满足才漏）：</text><text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">① 黑色对象新引用了白色对象</text><text x=\"320\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">② 灰色对象到该白色对象的引用被切断</text><text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">增量更新破①（记新引用，黑引白则黑变灰）| SATB 破②（记旧引用，切断的白按活算）</text></svg>",
    "caption": "图：三色标记状态与漏标两条件，两个算法各破其一"
   },
   {
    "t": "h",
    "text": "二、漏标：为什么必须同时满足两个条件"
   },
   {
    "t": "p",
    "text": "要推导为什么两条件缺一不可：标记过程中一个白色对象 W 若还没被任何灰色对象引用，它最终会被判定为垃圾。现在并发修改发生了——黑色对象 B 新引用了 W（条件①成立）。但注意：如果灰色对象 G 到 W 的引用还活着（条件②不成立），那么当 G 稍后被扫描时，它会把 W 重新涂灰，W 还是会被标记为活对象。反过来，如果 G→W 被切断（条件②成立）但没有任何黑对象引用 W（条件①不成立），那 W 本来就该被标记为垃圾，只是\"提前\"变成了垃圾，不影响正确性（最多产生浮动垃圾）。只有当 B 新引用 W 且 G→W 恰好被切断同时发生，W 才会\"明明活着却被判死\"——这就是致命的漏标。"
   },
   {
    "t": "p",
    "text": "把漏标问题翻译成工程语言，就得到两个防漏流派：增量更新（Incremental Update）盯着\"新连的线\"——一旦发现黑色对象新引用了白色对象，就把黑色对象重新变回灰色（因为黑色已扫完，只能倒退），CMS 的并发标记就是这个思路；SATB（Snapshot-At-The-Beginning）盯着\"断掉的线\"——标记开始时对对象图拍一张逻辑快照，并发期间凡是被覆盖掉的旧引用全部记录到队列，重新标记时按快照补扫，开始时刻活着的对象本轮一律算活，哪怕它标记期间死了也只当浮动垃圾。一个记新引用、一个记旧引用，这就是两种方案全部差异的浓缩。"
   },
   {
    "t": "h",
    "text": "三、写屏障：一切正确性方案的物理载体"
   },
   {
    "t": "p",
    "text": "不管增量更新还是 SATB，都需要在应用线程的字段赋值动作里\"插一杠子\"，这就是写屏障（Write Barrier）。JVM 在字节码的 putfield/aastore 等写引用指令前后插入检查代码：前写屏障（pre-write barrier）在赋值前执行，记录\"被覆盖的旧引用\"——SATB 就是靠它把 G→W 这条将被切断的引用塞进队列；后写屏障（post-write barrier）在赋值后执行，记录\"新写入的引用\"，增量更新靠它发现 B 新引用了 W；同一个后写屏障还顺带维护卡表（把被写对象所在的卡标脏），为记忆集服务。所以一个字段赋值在 HotSpot 里可能触发两次屏障检查，这就是并发收集器 10%~20% 运行时开销的主要来源。"
   },
   {
    "t": "p",
    "text": "一个细节常被忽视：SATB 的 pre-write barrier 只在\"旧引用指向的源对象是灰色以上（已标记）\"时才有记录价值，HotSpot 用 SATB 队列 + 减计数（一个线程自己的 buffer 满就入全局队列）实现低开销。CMS 的增量更新方案没有这个队列，而是靠重新标记阶段\"重扫\"——把整个老年代 + 新生代再扫一遍，这就是 CMS 的 Remark STW 明显长于 G1 的根因。G1 的 Remark 只需要重放 SATB 队列（结合 RSet 缩小扫描范围），快一个数量级。"
   },
   {
    "t": "h",
    "text": "四、卡表与记忆集：另一条并发正确性的护城河"
   },
   {
    "t": "p",
    "text": "漏标问题之外，还有\"跨区引用\"问题：Minor GC 回收新生代时，老年代对象可能引用新生代对象，不扫老年代就找不全 GC Roots，扫整个老年代又太贵。解法是卡表（Card Table）：堆按 512 字节切成卡页，卡表是一个字节数组，每张卡对应一个字节。老年代对象写了一个指向新生代的引用时，后写屏障把源对象所在卡页标为\"脏\"，Minor GC 只扫描脏卡覆盖的老年代区域——粗粒度定位，允许误标但绝不允许漏标。G1 在此基础上升级出 RSet（Remembered Set）：每个 Region 维护一个哈希表，记录\"哪些外部 Region 的哪些卡页引用了我\"，是精确到卡的反向索引。回收某个 Region 时加载它的 RSet，直接找到外部引用来源做根枚举，不必扫全堆。关系是：Card Table 负责\"标记哪里被写过\"，RSet 负责\"谁引用了我\"，两者配合实现\"不扫全堆、只查可能有引用的区域\"。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "增量更新（CMS）",
     "SATB（G1）"
    ],
    "rows": [
     [
      "记录什么",
      "新插入的引用（记新线）",
      "被覆盖的旧引用（记旧线）"
     ],
     [
      "破坏的漏标条件",
      "条件①（黑引白 → 黑变灰）",
      "条件②（灰到白的引用被切断也按活算）"
     ],
     [
      "重新标记做法",
      "重扫老年代+新生代",
      "只重放 SATB 队列"
     ],
     [
      "Remark 耗时",
      "长",
      "短"
     ],
     [
      "浮动垃圾",
      "较少",
      "较多（快照更保守）"
     ],
     [
      "依赖的屏障",
      "后写屏障（增量更新）",
      "前写屏障（SATB 记录）"
     ]
    ]
   },
   {
    "t": "h",
    "text": "五、CMS 并发标记的完整细节与三个危险"
   },
   {
    "t": "p",
    "text": "CMS 的老年代回收四阶段：初始标记（STW，只标记 GC Roots 直接可达对象，极短）→ 并发标记（用增量更新算法边跑边标，与业务并发，最长但不停顿）→ 重新标记（STW，处理并发期间的变化：扫描新生代 + 老年代脏卡重扫，这就是增量更新方案最贵的 STW）→ 并发清除（标记-清除，与业务并发）。三个危险逐个来：第一是并发标记期间对象图仍被修改，靠增量更新写屏障兜底；第二是浮动垃圾——并发标记/并发清除期间新产生的垃圾只能留到下轮，CMS 会因此预留空间（-XX:CMSInitiatingOccupancyFraction 调低提前触发）；第三是并发模式失败（concurrent mode failure）——并发清除期间老年代被新对象填满，回收赶不上分配，CMS 直接退化串行 Full GC，STW 极长。这三条危险是 CMS 被 G1 取代的完整理由，也是\"为什么说并发 GC 的代价是吞吐与复杂度\"的注脚。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 写屏障的语义（伪代码，HotSpot 实际是汇编级插入）\nvoid post_write_barrier(FieldRef dst, Object newValue) {\n    if (dst.isCrossRegion(newValue)) {\n        card_table.markDirty(dst.objAddr);   // 卡表标脏（RSet 用）\n    }\n    if (newValue.isBlack() && dst.isWhite()) {\n        dst.setGray();                        // 增量更新：黑引白 → 黑变灰\n    }\n}\nvoid pre_write_barrier(FieldRef dst) {\n    Object old = dst.get();\n    if (old.isMarked()) {\n        satb_queue.push(old);                 // SATB：记录被切断的旧引用\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "漏标条件只背一半——必须是\"黑引白\"与\"灰到白的引用被切断\"同时满足，缺一不致命，讲不全两个条件等于没懂",
     "把增量更新和 SATB 记反——增量更新记新引用、把黑变灰；SATB 记旧引用、快照算活，Remark 时长差异全在这一条",
     "说写屏障只属于 G1——前写屏障（SATB）+ 后写屏障（增量更新+卡表）是并发 GC 通用机制，CMS/G1 都在用",
     "把卡表和 RSet 混为一谈——卡表是 512 字节/卡的脏标记字节数组（粗粒度），RSet 是 Region 级\"谁引用了我\"的反向索引（精确到卡）",
     "说浮动垃圾是 G1 专利——增量更新和 SATB 都有浮动垃圾，SATB 只是更保守、比例更高",
     "忽略并发清除阶段还能满——concurrent mode failure 退化串行 Full GC，这是 CMS 被淘汰的最后一根稻草"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三色标记把可达性分析可视化（白未访/灰待扫/黑完毕）；漏标需\"黑引白 + 灰到白被切断\"两条件同时成立；增量更新记新引用把黑变灰（破①）、SATB 记旧引用快照算活（破②），写屏障是二者物理载体；卡表 512 字节标脏 + RSet 反向索引解决跨区引用；CMS 并发标记用增量更新，Remark 重扫老年代+新生代所以最贵，浮动垃圾与并发模式失败是它被淘汰的完整理由。"
   }
  ]
 },
 {
  "id": "jvm-g1-deep",
  "title": "G1 深入：Region、RSet 与暂停预测模型",
  "layer": 2,
  "depends": [
   "jvm-collectors"
  ],
  "covers": [
   "jvm-13",
   "jvm-18",
   "jvm-35"
  ],
  "quiz": [
   "jvm-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从\"会用 G1\"到\"懂 G1\"：Region 从 Eden 到 Old 的一生、RSet 靠写屏障怎么记账、Mixed GC 何时触发又怎么分批、暂停预测模型凭什么\"选性价比最高的 Region 收\"，以及一张可以拿去上生产的调优参数表。"
   },
   {
    "t": "pre",
    "items": [
     "G1 的基础定位：分区化、逻辑分代、CSet 价值排序（jvm-collectors）",
     "三色标记、SATB 与卡表/RSet 的通用原理（jvm-tri-color-marking）",
     "Humongous 判定与 Full GC 兜底的基本认知（jvm-game-tuning）"
    ]
   },
   {
    "t": "h",
    "text": "一、Region 的一生：从 Eden 到 Old 再到回收"
   },
   {
    "t": "p",
    "text": "G1 把堆均分成约 2048 个 Region（实际数量 = 堆 / 目标 Region 大小），Region 大小自动计算：堆大小除以 2048 后向上取 2 的幂，范围 1MB~32MB（8G 堆约 4MB，可用 -XX:G1HeapRegionSize 显式指定）。Region 没有固定身份：新建时是 Eden 成员，Eden 里的对象熬过一次 Young GC 存活 → 复制进 Survivor Region，再熬几轮晋升 → 变成 Old Region，Old Region 里的对象全死光 → 整块 Region 回到空闲列表等待重新分配。新生代不是一个固定区域，而是\"一组 Eden Region + 两组 Survivor Region\"的动态集合，大小由暂停预测模型按停顿预算实时伸缩（-XX:G1NewSizePercent 默认 5%、-XX:G1MaxNewSizePercent 默认 60% 给出上下限）。超过 Region 一半的对象是 Humongous，占多个连续 Region 直接进老年代，不走常规路径——这是 G1 的\"隐形杀手\"，详见 jvm-game-tuning。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Region 状态迁移：Eden → Survivor → Old → 空闲</text><rect x=\"40\" y=\"52\" width=\"120\" height=\"60\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"100\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Eden</text><text x=\"100\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">新对象分配点</text><path d=\"M160 82 L218 82\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"189\" y=\"74\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">Minor存活</text><rect x=\"220\" y=\"52\" width=\"120\" height=\"60\" rx=\"6\" fill=\"var(--lv2)\" opacity=\"0.9\"/><text x=\"280\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--bg)\">Survivor</text><text x=\"280\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--bg)\">复制往返 S0/S1</text><path d=\"M340 82 L398 82\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"369\" y=\"74\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">年龄到/担保</text><rect x=\"400\" y=\"52\" width=\"120\" height=\"60\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"460\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Old</text><text x=\"460\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Mixed GC 分批收</text><path d=\"M520 82 L560 82\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M556 78 L566 82 L556 86 z\" fill=\"var(--line)\"/><text x=\"100\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全部 Region 处于空闲列表</text><text x=\"320\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">空闲 Region 重新按需扮演</text><text x=\"320\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Eden / Survivor / Old / Humongous（&gt;Region一半，连续N个）</text><rect x=\"60\" y=\"216\" width=\"140\" height=\"36\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"130\" y=\"239\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Eden 5%~60% 动态</text><rect x=\"250\" y=\"216\" width=\"140\" height=\"36\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"239\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Old 占比触 IHOP</text><rect x=\"440\" y=\"216\" width=\"140\" height=\"36\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"510\" y=\"239\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Humongous 直入老年代</text></svg>",
    "caption": "图：Region 身份迁移与 Humongous 直入老年代"
   },
   {
    "t": "h",
    "text": "二、RSet 维护：写屏障、卡表与哈希表的组合拳"
   },
   {
    "t": "p",
    "text": "RSet 解决的核心问题：回收某个 Region 时，怎么快速找到\"外部 Region 指向我的引用\"。G1 的方案是每个 Region 维护一个哈希表，记录来源 Region 的卡页索引（存卡索引不存对象地址，粗粒度）。维护动作发生在写屏障里：应用线程往对象字段写引用时，后写屏障检查新旧引用是否跨 Region，跨了就把源对象所在卡页对应的条目加进目标 Region 的 RSet。为了摊薄写屏障的即时开销，HotSpot 用\"脏卡队列 + 并发细化线程（Refinement Threads）\"异步处理——写屏障只标脏卡塞队列，专门线程批量更新 RSet，-XX:G1RSetUpdatingPauseTimePercent 默认 5% 控制暂停中用于 RSet 更新的时间比例。"
   },
   {
    "t": "p",
    "text": "RSet 的代价是内存和 CPU：每个 Region 一张哈希表，大量跨区引用的对象图（游戏服玩家对象引用另一玩家的任务目标、公会成员互相引用）会让 RSet 膨胀到堆的 10%~20%。但它换来的是 Young GC 和 Mixed GC 的\"精确打击\"——Young GC 只读 Eden/Survivor Region 的 RSet，就能把老年代指向新生代的引用找全，不必扫老年代；Mixed GC 回收某个 Old Region，加载它的 RSet 反向定位到所有外部引用来源做根枚举，跳过无关内存。这是 G1 区别于\"扫全堆\"的 CMS 的核心结构支撑。"
   },
   {
    "t": "h",
    "text": "三、Young GC 与 Mixed GC：G1 的两种回收"
   },
   {
    "t": "p",
    "text": "Young GC：全量回收所有 Eden + Survivor Region，把存活对象复制到新的 Survivor 或晋升到 Old，STW，但只涉及新生代所以通常很快。Mixed GC：老年代占用比例超过 -XX:InitiatingHeapOccupancyPercent（IHOP，默认 45%）触发并发标记周期，标记完成后进入\"混着收\"阶段——每次 Mixed GC 同时收新生代 + 一批老年代 Region（按垃圾占比从高到低挑），把一次大停顿拆成多次小停顿。-XX:G1MixedGCCountTarget 默认 8 控制一批目标拆成多少次，-XX:G1HeapWastePercent 默认 5%（堆中可回收垃圾比例低于 5% 就提前结束 mixed 周期），-XX:G1MixedGCLiveThresholdPercent 默认 85%（存活率超过 85% 的 Region 不选入 CSet，收了也白收）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">并发标记周期 → 多次 Mixed GC 时间线</text><rect x=\"30\" y=\"48\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"85\" y=\"72\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">老年代 &gt; IHOP</text><path d=\"M140 68 L186 68\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"163\" y=\"60\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">触发</text><rect x=\"188\" y=\"48\" width=\"100\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"238\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">初始标记</text><text x=\"238\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">STW piggyback</text><rect x=\"292\" y=\"48\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"347\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">并发标记</text><text x=\"347\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SATB 边跑边标</text><rect x=\"406\" y=\"48\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"451\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">重新标记</text><text x=\"451\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">处理SATB队列</text><rect x=\"500\" y=\"48\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"555\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">清理+选CSet</text><text x=\"555\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">统计存活比排序</text><rect x=\"60\" y=\"120\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"105\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Mixed GC 1</text><rect x=\"200\" y=\"120\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"245\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Mixed GC 2</text><rect x=\"340\" y=\"120\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"385\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Mixed GC 3</text><rect x=\"480\" y=\"120\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"525\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">直到垃圾&lt;5%</text><path d=\"M105 118 L105 116\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M150 160 L240 118\" stroke=\"var(--accent)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><path d=\"M290 160 L380 118\" stroke=\"var(--accent)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><path d=\"M430 160 L520 118\" stroke=\"var(--accent)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">每次 Mixed GC 收新生代 + 垃圾占比最高的若干老年代 Region（G1MixedGCCountTarget 默认 8 次内消化）</text><text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">不满足：Old 区被灌满且标记没赶上 → evacuation failure → Full GC（兜底）</text><text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">调低 IHOP 提前触发标记、控分配速率、控 Humongous 是三条预防线</text></svg>",
    "caption": "图：并发标记周期与 Mixed GC 分批回收，evacuation failure 是兜底红灯"
   },
   {
    "t": "h",
    "text": "四、暂停预测模型：G1 的灵魂"
   },
   {
    "t": "p",
    "text": "G1 与 CMS 的本质区别是\"可预测停顿\"。实现机制是暂停预测模型（Pause Prediction Model）：G1 为每次回收记录每个 Region 的历史数据——回收耗时（扫描+复制）、存活对象比例、晋升量，用带衰减加权的统计模型（最近的数据权重高）估计每个 Region 的回收代价与收益。每个 Region 的\"性价比\"= 垃圾占比（回收后能腾出的空间）/ 预估耗时。每次 Young/Mixed GC 开始时，G1 在 -XX:MaxGCPauseMillis（软目标，默认 200ms）预算内，从高性价比往低性价比选 Region 组成 CSet——就像外卖骑手按\"单多路顺\"接单而不是扫完整条街。所以停顿目标是\"尽力而为\"：分配速率飙升时预算会超，这是正常的，调参的人必须理解这一点而不是把它当硬保证。"
   },
   {
    "t": "p",
    "text": "理解模型后，几个常见现象就有了解释：为什么 G1 动态伸缩新生代——新生代越小，Young GC 越便宜，预算内能处理；为什么小堆（<6G）上 G1 不一定比 Parallel 好——RSet/写屏障/模型维护的固定开销在堆小时占比过高，吞吐吃亏；为什么调 MaxGCPauseMillis 太低（如 20ms）反而坏事——预算太紧导致每次收得太少、GC 更频繁，总开销上升甚至触发 Full GC。游戏服合理的做法是设 100~200ms，配合 IHOP 调低（35~40）提前启动标记，给晋升留缓冲。"
   },
   {
    "t": "h",
    "text": "五、一张能上生产的 G1 调优参数表"
   },
   {
    "t": "table",
    "head": [
     "参数",
     "默认值",
     "游戏服建议",
     "作用"
    ],
    "rows": [
     [
      "-XX:MaxGCPauseMillis",
      "200",
      "100~150",
      "停顿软目标，模型在此预算内选 CSet"
     ],
     [
      "-XX:InitiatingHeapOccupancyPercent",
      "45",
      "35~40",
      "老年代占比超此值触发并发标记，调低提前开始"
     ],
     [
      "-XX:G1NewSizePercent / G1MaxNewSizePercent",
      "5 / 60",
      "按业务",
      "新生代动态伸缩区间，分配高可调大上限"
     ],
     [
      "-XX:G1HeapRegionSize",
      "自动 1M~32M",
      "大对象多则调大",
      "Region 大小，超过一半的对象成 Humongous"
     ],
     [
      "-XX:G1ReservePercent",
      "10",
      "10~15",
      "为晋升预留的堆空间，防 evacuation failure"
     ],
     [
      "-XX:ConcGCThreads",
      "≈ParallelGCThreads/4",
      "按核数",
      "并发标记线程数，标记跟不上就调大"
     ],
     [
      "-XX:G1MixedGCCountTarget",
      "8",
      "8~16",
      "一个标记周期拆成几次 Mixed GC，越大越分散"
     ],
     [
      "-XX:G1HeapWastePercent",
      "5",
      "5",
      "可回收垃圾低于此值提前结束 mixed 周期"
     ],
     [
      "-XX:G1MixedGCLiveThresholdPercent",
      "85",
      "85",
      "存活率超此值的 Region 不选入 CSet"
     ]
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "# 8C16G 游戏服 G1 参考（堆固定防扩缩容抖动）\n-Xms8g -Xmx8g\n-XX:+UseG1GC\n-XX:MaxGCPauseMillis=100\n-XX:InitiatingHeapOccupancyPercent=35\n-XX:G1ReservePercent=12\n-XX:ConcGCThreads=4 -XX:ParallelGCThreads=8\n-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/logs/heapdump.hprof\n-Xloggc:/logs/gc.log -XX:+PrintGCDetails -XX:+PrintGCDateStamps   # JDK8\n# JDK9+ 统一日志：-Xlog:gc*:file=gc.log:time\n# 调优纪律：先看日志（Young GC 频率/耗时、老年代水位、FGC 次数）再动参数，一次只动一个"
   },
   {
    "t": "h",
    "text": "六、调优纪律：先观测，再动刀"
   },
   {
    "t": "p",
    "text": "G1 调优最忌讳\"上来就改参数\"。正确的顺序是：先开 GC 日志跑 24~48 小时，统计三个基线——Young GC 频率（游戏服战斗高峰期 1~2 秒一次可接受）、单次停顿 real 值（健康线 &lt;50ms）、老年代回收后水位是否爬坡（爬坡=泄漏或晋升过猛）。然后对照参数表判断：停顿超标 → 检查新生代是否过大（-XX:G1MaxNewSizePercent 是否被顶满）；老年代涨太快 → 看晋升速率（日志里 Eden 回收后老年代增量），分配速率高则优化代码（jvm-game-tuning），晋升过猛则调大 Survivor 或调低 MaxTenuringThreshold；出现 Full GC / evacuation failure → 先查 Humongous、再调低 IHOP、加大 G1ReservePercent。每改一个参数都要回测对比停顿分布，而不是看平均——分位数才是玩家体感。"
   },
   {
    "t": "pits",
    "items": [
     "把 MaxGCPauseMillis 说成硬保证——它是软目标，分配峰值会超预算，理解了这一点才不会在超预算时乱调参数",
     "调优只调 IHOP 不调 G1ReservePercent——晋升预留空间不够照样 evacuation failure，两条线都要管",
     "把 G1HeapWastePercent 与 IHOP 混淆——前者控制 mixed 周期何时提前结束，后者控制标记周期何时开始",
     "不知道 Region 大小是 2 的幂且范围 1M~32M——8G 堆 Region 约 4M，不是随便设",
     "忽略动态新生代——手动 -Xmn 固定新生代会破坏 G1 的停顿模型，官方明示不要设置",
     "用平均停顿判断调优效果——要用 P99/P999 分布，平均掩盖了长尾尖刺，玩家感知的是长尾"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Region 身份动态流转（Eden→Survivor→Old→空闲），新生代是 Region 动态集合；RSet 靠写屏障+脏卡队列+细化线程异步维护，代价是堆的 10%~20%；Mixed GC 由 IHOP 触发标记周期后分批消化老年代，evacuation failure 是红灯；暂停预测模型按性价比在预算内选 CSet，这是 G1 灵魂；调优纪律\"先观测三天，一次动一个参数，用分位数验证\"，参数表按场景对照着用。"
   }
  ]
 },
 {
  "id": "jvm-bytecode",
  "title": "Class 文件与字节码：从 javap 到 ASM",
  "layer": 2,
  "depends": [
   "jvm-class-loading"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "字节码是 JVM 的机器语言：Class 文件用一张张表存下类的一切，方法体是一段指令序列。看懂 javap 输出，你就能理解 ASM、ByteBuddy、Arthas 这类字节码增强工具到底在对 .class 动什么手脚——这是从\"会用框架\"到\"看得懂框架\"的钥匙。"
   },
   {
    "t": "pre",
    "items": [
     "类加载五阶段与符号引用转直接引用（jvm-class-loading）",
     "Java 源码编译产物 .class 的基本认知",
     "用过反射或动态代理，知道运行时增强这回事"
    ]
   },
   {
    "t": "h",
    "text": "一、Class 文件结构：一张表接一张表"
   },
   {
    "t": "p",
    "text": "Class 文件是一份二进制格式的流，只有两种结构：无符号数（u1/u2/u4 表示版本号、计数等）和表（以 count 开头、后跟 N 个同构条目的集合）。顶层结构固定：magic（u4，0xCAFEBABE）→ 次版本号 → 主版本号（55=JDK11，52=JDK8）→ 常量池计数及常量池 → 访问标志 → this 类索引 → 父类索引 → 接口表 → 字段表 → 方法表 → 属性表。方法体和字段默认值都存在属性表里，属性表是 Class 文件最灵活的扩展点——Code（方法字节码）、ConstantValue（常量字段初值）、StackMapTable（类型检查用，Java 7+ 必带）、BootstrapMethods（invokedynamic 的引导方法）、Signature（泛型签名）、Exceptions（方法抛出的受检异常）都是属性。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Class 文件顶层结构</text><rect x=\"30\" y=\"40\" width=\"180\" height=\"40\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"64\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">magic + 次版本 + 主版本</text><rect x=\"30\" y=\"84\" width=\"180\" height=\"40\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"120\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">常量池（最大的表）</text><rect x=\"30\" y=\"128\" width=\"180\" height=\"40\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">访问标志 + this/super + 接口</text><rect x=\"30\" y=\"172\" width=\"180\" height=\"40\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">字段表</text><rect x=\"30\" y=\"216\" width=\"180\" height=\"40\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">方法表</text><rect x=\"30\" y=\"260\" width=\"180\" height=\"40\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">属性表</text><rect x=\"260\" y=\"84\" width=\"350\" height=\"200\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"278\" y=\"108\" font-size=\"12\" fill=\"var(--ink)\">常量池条目类型：</text><text x=\"278\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">Utf8（字符串/方法名/描述符）</text><text x=\"278\" y=\"156\" font-size=\"12\" fill=\"var(--muted)\">Class（类引用）Fieldref/Methodref</text><text x=\"278\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">NameAndType（名字+描述符）</text><text x=\"278\" y=\"204\" font-size=\"12\" fill=\"var(--muted)\">String/Integer/Long/Float/Double</text><text x=\"278\" y=\"228\" font-size=\"12\" fill=\"var(--muted)\">InvokeDynamic/MethodHandle/...（JDK7+）</text><text x=\"278\" y=\"260\" font-size=\"12\" fill=\"var(--accent)\">属性表扩展点：</text><text x=\"278\" y=\"284\" font-size=\"12\" fill=\"var(--muted)\">Code / ConstantValue / StackMapTable / Signature</text></svg>",
    "caption": "图：Class 文件一张张表的结构与常量池条目类型"
   },
   {
    "t": "h",
    "text": "二、常量池：装了九成信息的最大的表"
   },
   {
    "t": "p",
    "text": "常量池是 Class 文件的灵魂，几乎一切东西都通过索引指向它：类名、方法名、字段名、描述符、字符串字面量全部以 Utf8 条目存一份，其余条目（Class、Fieldref、Methodref、NameAndType）只存索引组合。为什么方法名是\"符号引用\"？因为方法名在常量池里是一个 Utf8 字符串，编译期不知道它最终会被哪个类解析，类加载的\"解析\"阶段就是把 Methodref 这样的符号引用换成实际的方法入口——这就是\"符号引用\"与\"直接引用\"的物理含义。加载一个类时，字节码里每一条 getfield/invokevirtual 都带着一个常量池索引，JVM 沿索引找到真实的目标，这也就是为什么类加载验证要检查常量池索引不越界。"
   },
   {
    "t": "h",
    "text": "三、访问标志与方法表"
   },
   {
    "t": "p",
    "text": "访问标志（u2）告诉 JVM 这个类的性质：ACC_PUBLIC（0x0001）、ACC_FINAL（0x0010）、ACC_SUPER（0x0020，默认带）、ACC_INTERFACE（0x0200）、ACC_ABSTRACT（0x0400）、ACC_SYNTHETIC（0x1000，编译器生成的）、ACC_ANNOTATION、ACC_ENUM。方法表里的访问标志额外有 ACC_STATIC（0x0008）、ACC_PRIVATE/PROTECTED、ACC_BRIDGE（0x0040，桥接方法，泛型擦除的产物）、ACC_VARARGS。每个方法条目 = 访问标志 + 名字索引 + 描述符索引 + 属性表；描述符（descriptor）是方法签名（如 (JLjava/lang/String;)V 表示 long + String 返回 void）与字段类型（如 [[I 表示 int[][]）的紧凑编码——这是 JVM 识别重载和进行类型检查的语言。"
   },
   {
    "t": "h",
    "text": "四、常用指令集：手算一个 a+b"
   },
   {
    "t": "p",
    "text": "字节码指令按作用分几族：加载/存储（iload、istore、aload、ldc 加载常量）、运算（iadd、imul、l2i）、对象与数组（new、getfield、putfield、arraylength）、方法调用（invokevirtual、invokestatic、invokespecial、invokeinterface、invokedynamic）、控制流（goto、if_icmpge、tableswitch/lookupswitch）、异常（athrow）、同步（monitorenter/monitorexit）。理解一个要点：字节码是栈式机器模型——每条指令从操作数栈取操作数、把结果压回栈，方法调用时按帧压栈。写一个 int add(int a,int b){ return a+b; }，javap -c 会输出 iload_1、iload_2、iadd、ireturn 四条指令——方法参数在局部变量表 0~n 的位置，this 占位 0。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 编译后 javap -c -p 查看\npublic class Calc {\n    public int add(int a, int b) { return a + b; }\n    public String pick(int n) {\n        switch (n) {\n            case 1: return \"一\";\n            case 2: return \"二\";\n            default: return \"?\";\n        }\n    }\n}\n// javap -c Calc\n//   public int add(int, int);\n//     iload_1        // 从局部变量表取 a\n//     iload_2        // 取 b\n//     iadd           // 操作数栈顶两数相加\n//     ireturn\n//   pick: tableswitch 1: 0 2: 1 default: 2  → 编译器把密集 switch 优化成跳转表"
   },
   {
    "t": "h",
    "text": "五、javap 实战三件套"
   },
   {
    "t": "p",
    "text": "javap 是 JDK 自带的字节码查看器，三个高频用法：javap -c 反编译方法字节码（看实现逻辑）；javap -verbose 输出完整结构（常量池全量、访问标志、行号表、StackMapTable）；javap -p 连私有成员一起显示（默认只显示 public/protected）。游戏服实践场景：热更后确认线上跑的类到底是不是新版——反编译比对方法签名/常量池里的字符串字面量；排查 lambda 生成的隐藏类（lambda 表达式会生成 invokedynamic 引导方法）；看 switch 是 tableswitch 还是 lookupswitch（判断编译器优化路径）。注意 javap 不显示 Code 属性之外的运行时信息，方法耗时这种要靠 Arthas trace。"
   },
   {
    "t": "h",
    "text": "六、ASM 与 ByteBuddy：字节码增强两代工具"
   },
   {
    "t": "p",
    "text": "字节码增强 = 直接改 .class 的二进制（要么读-改-写，要么运行时 Instrumentation 重定义）。ASM 是底层工具箱：用 Visitor 模式遍历 Class 文件的各个部分（ClassVisitor 收到 visitField/visitMethod 回调），在遍历过程中插入/改写节点，生成新字节流。它轻量、可控、无反射，但上手门槛高——ASMifier 可以把你手写的一小段\"目标字节码\"转换成等价的 ASM 代码，是学习与生成的双向工具。ByteBuddy 是 ASM 之上的 DSL：AgentBuilder 声明式拦截哪个类哪个方法、用 MethodInterceptor 写增强逻辑，隐藏了字节码细节——Arthas 的 watch/trace、SkyWalking、Mockito 都基于它。运行时的机制是 Instrumentation：通过 -javaagent 或 attach API 拿到 Instrumentation 句柄，redefineClasses 替换已有类的方法体（限制：不能增删方法/字段、不能改父类签名），或 retransformClasses 对已加载类重新增强——游戏服热更补丁和线上诊断正是靠这套 API。"
   },
   {
    "t": "p",
    "text": "一个必须讲清的边界：字节码增强和类加载器热加载是两条路。类加载器方案是\"换一个 ClassLoader 加载整份新类\"，代价是旧类实例与新旧类互相转换的隔离问题（jvm-classloader-hotswap 展开）；字节码增强是\"保留类身份，只替换方法实现\"，代价是仅限方法体级别的修改、不能加字段改签名、与 JIT 已有编译产物冲突时可能触发逆优化。游戏服实践：线上问题定位用 Arthas（retransform）；功能热更优先类加载器方案，字节码增强做兜底补丁。"
   },
   {
    "t": "pits",
    "items": [
     "把 Class 文件说成纯文本或 XML——它是严格的二进制格式，只有无符号数和表两种结构，magic 0xCAFEBABE 固定开头",
     "混淆访问标志与方法访问标志——ACC_SUPER/ACC_INTERFACE 是类级，ACC_STATIC/ACC_BRIDGE 是方法级，桥接方法正是泛型擦除的产物",
     "以为 javap -c 能看到耗时——它只看字节码结构，运行时性能要看 Arthas/JFR",
     "把 ASM 和 ByteBuddy 混为一谈——ASM 是操作字节流的手工工具箱（Visitor 模式），ByteBuddy 是 ASM 之上的声明式 DSL",
     "忽略 redefineClasses 的限制——运行时只能替换方法体，不能增删字段/改签名，热更方案必须提前意识到这条边界",
     "不知道 invokedynamic——JDK7 引入，lambda 表达式的实现基石，老资料里讲方法调用还停在 invokevirtual/static 四兄弟"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Class 文件 = 无符号数 + 表，常量池是索引仓库、属性表是扩展点；方法描述符是紧凑签名语言；字节码是栈式指令序列，javap -c/-verbose/-p 三件套看结构；ASM 用 Visitor 直接改字节流，ByteBuddy 是 DSL，运行时增强走 Instrumentation redefine/retransform（仅限方法体）；字节码增强与类加载器热加载是两条互补的路，边界是\"是否保留类身份\"。"
   }
  ]
 },
 {
  "id": "jvm-jit-deep",
  "title": "JIT 深入：分层编译、内联与逆优化",
  "layer": 2,
  "depends": [
   "jvm-jmm-jit"
  ],
  "covers": [
   "jvm-20"
  ],
  "quiz": [
   "jvm-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从解释执行到 C2 激进优化是一条流水线：计数器喂给分层编译器，profiling 喂给内联与逃逸分析，乐观假设被打破就触发逆优化回退。学会读 -XX 编译日志、用 JITWatch 看内联链，游戏服热路径优化就有据可依而不是靠猜。"
   },
   {
    "t": "pre",
    "items": [
     "解释+编译混合执行与双计数器热点探测（jvm-jmm-jit）",
     "逃逸分析三种优化与\"只有 C2 生效\"的边界（jvm-jmm-jit）",
     "会看 GC 日志的类似经验，理解\"停顿\"与\"编译\"是两件事"
    ]
   },
   {
    "t": "h",
    "text": "一、分层编译：五级流水线"
   },
   {
    "t": "p",
    "text": "HotSpot 的分层编译（JDK8 默认开启，-XX:+TieredCompilation）把\"编译\"拆成五级：Level 0 解释执行（纯解释器，零编译开销）；Level 1 C1 简单编译（-XX:TieredStopAtLevel=1，无 profiling）；Level 2 C1 受限 profiling（只记录方法调用计数）；Level 3 C1 全 profiling（收集分支概率、类型信息，这些数据是 C2 的燃料）；Level 4 C2 深度优化（慢编译但做激进优化）。为什么中间有三层 C1？因为 C2 的激进优化严重依赖类型信息——只有 profiling 数据够了，C2 才敢做单态内联、分支裁剪这些乐观假设。触发链路：方法调用计数器 / 回边计数器（循环）累计超过阈值（C2 编译阈值默认 10000 次调用，-XX:CompileThreshold）→ 先升到 Level 3 收集数据 → 数据够了升 Level 4。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">分层编译五级流水线（Tiered Compilation）</text><rect x=\"30\" y=\"48\" width=\"110\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"85\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">L0 解释</text><text x=\"85\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">纯解释器</text><rect x=\"170\" y=\"48\" width=\"120\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"230\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">L1 C1 简单</text><text x=\"230\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无 profiling</text><rect x=\"320\" y=\"48\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"390\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">L2/L3 C1 profiling</text><text x=\"390\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">收集类型/分支数据</text><rect x=\"490\" y=\"48\" width=\"120\" height=\"52\" rx=\"6\" fill=\"var(--accent)\"/><text x=\"550\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--bg)\">L4 C2 深优</text><text x=\"550\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--bg)\">内联/逃逸/循环</text><path d=\"M140 74 L166 74\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M164 70 L174 74 L164 78 z\" fill=\"var(--accent)\"/><path d=\"M290 74 L316 74\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M314 70 L324 74 L314 78 z\" fill=\"var(--accent)\"/><path d=\"M460 74 L486 74\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M484 70 L494 74 L484 78 z\" fill=\"var(--accent)\"/><path d=\"M550 100 L550 130\" stroke=\"var(--lv3)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><text x=\"566\" y=\"120\" font-size=\"12\" fill=\"var(--lv3)\">假设被打破 → 逆优化</text><rect x=\"380\" y=\"132\" width=\"160\" height=\"34\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"460\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">回退 L0 或 L3 重编译</text><text x=\"320\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">C1 快编译保启动性能，C2 慢编译保峰值性能——分层就是两者的时间权衡</text><text x=\"320\" y=\"222\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服开服卡顿：热代码未编译，先灌流量预热（机器人压测）是标准解法</text></svg>",
    "caption": "图：分层编译五级与逆优化回退路径"
   },
   {
    "t": "h",
    "text": "二、方法内联：一切优化之前提"
   },
   {
    "t": "p",
    "text": "内联是 C2 最重要也最基础的优化，其他优化的前提——方法调用有开销（栈帧建立、参数传递、返回跳转），把被调方法体\"搬进\"调用方，边界消失后才能做逃逸分析、常量传播、死代码消除。内联的门槛有两个：方法体大小（-XX:MaxInlineSize 默认 35 字节码，热方法放宽到 -XX:FreqInlineSize 默认 325）和非递归。类型分派上，C2 靠 profiling 数据做单态内联（热点实际只调用一种实现就直接内联）；多态调用（2 种实现）用内联缓存；超过 2 种（mega-morphic）放弃内联走虚调用。对游戏服的启示：热路径方法保持小、分支稳定；final 不是内联前提（单态内联靠 profiling 不需要 final）；反射调用难内联——热路径避免反射是硬道理。"
   },
   {
    "t": "h",
    "text": "三、循环优化与安全点"
   },
   {
    "t": "p",
    "text": "C2 对循环做一串优化：循环展开（减少回边检查次数）、循环剥离（把前几次迭代拉出循环消除分支预测失败）、循环无关代码外提（把循环体里不变的表达式提到外面算一次）。但循环优化有一个与 JVM 全局相关的副作用：C2 对\"计数循环\"（int 索引的紧凑 for 循环）默认不在回边插入安全点检查，一个几亿次的纯数学循环可能几百毫秒不让线程进入安全点，拖慢全局 GC 的 TTSP（time to safepoint）——这是\"GC 日志很干净但卡顿\"的经典元凶之一（详见 jvm-architecture 的 Safepoint 节）。JDK10+ 引入 LoopStripMining 把大循环自动分段插入安全点检查，默认开启大幅缓解；老版本或极端场景要靠把索引用 long（强制插检查点）或循环内主动让步来规避。"
   },
   {
    "t": "h",
    "text": "四、逃逸分析产物与锁优化"
   },
   {
    "t": "p",
    "text": "逃逸分析是 C2 基于内联后的对象图做的分析，产物有三类：标量替换（对象字段拆成局部标量，对象不创建）、栈上分配/无堆分配（别名说法）、锁消除（锁对象不线程逃逸则去掉加解锁）+ 同步省略。这些优化只在 Level 4 生效，所以验证它要看编译日志或 JITWatch，而不是跑一段就断言\"生效了\"。另一个容易被忽略的点：逃逸分析\"不成立\"也有调试价值——JITWatch 里看到对象没有被标量替换，要么是方法未内联（太大/多态），要么是对象逃逸（塞进了集合/成员字段），对照代码改一处就有收益。锁消除之外，C2 还做锁粗化（把相邻的多次加解锁合并成一次，如循环内反复加同一个锁）。"
   },
   {
    "t": "h",
    "text": "五、逆优化：乐观假设被打破"
   },
   {
    "t": "p",
    "text": "C2 的激进优化建立在对 profiling 数据的乐观假设上：假设某调用点永远是类型 A（单态内联）、假设分支永远走热侧。运行时出现新类、罕见分支被触发、或 JVM 状态变化（类重定义 redefine、CodeCache 满、JVMCI 切换），假设作废，C2 必须丢弃已编译的机器码回退到解释执行（或降级到 Level 3 重新收集数据）——这就是逆优化（deoptimization），日志里叫 uncommon trap 或 null check elimination 失败。游戏服的现实场景：热更用 redefine 批量替换类 → 旧编译产物全部作废 → 逆优化风暴 → 瞬间 CPU 飙高 + 延迟尖刺；启动预热阶段频繁升级编译层也伴随逆优化。观察手段：-XX:+PrintCompilation 看编译事件流，-XX:+TraceDeoptimization 看逆优化原因，JFR 的 jdk.Deoptimization 事件。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "# 编译日志（生产建议配滚动文件，别打 stdout）\n-XX:+UnlockDiagnosticVMOptions -XX:+LogCompilation -XX:+PrintCompilation\n-Xlog:jit+compilation=debug:file=compilation.log:time,uptime\n# PrintCompilation 每行含义：<编译序号> <时间> <属性> <方法>\n#   1.0    0.12  3750    b  Calc::sumDamage (25 bytes)\n#     b = 阻塞式编译（L1） | n = 非标准 | % = 栈上替换 OSR\n# 看 JITWatch 导入 compilation.log：内联链 / 标量替换 / 编译层级一目了然\n# 验证逃逸分析：-XX:-DoEscapeAnalysis 跑 JMH 对比 GC 次数与吞吐"
   },
   {
    "t": "h",
    "text": "六、JITWatch：把编译日志变成可视化报告"
   },
   {
    "t": "p",
    "text": "JITWatch（AdoptOpenJDK 开源项目）是 JIT 调试的首选工具，流程三步：启动参数加 -XX:+UnlockDiagnosticVMOptions -XX:+LogCompilation（并建议 -XX:+PrintAssembly 查看生成的机器码，需要 hsdis 插件）→ 运行压测/业务 → JITWatch 导入 compilation.log 生成报告。核心面板：Code Cache（编译方法清单与层级）、Inline Chain（看一个调用点被内联了几层——内联链断裂在哪一目了然）、Escape Analysis（看对象是否被标量替换）、Assembly（看关键方法的实际机器码）。游戏服用法：战斗结算方法明明写了局部对象却仍有大量分配 → 去 Escape Analysis 面板确认是否被标量替换，没生效就查内联链为什么断（方法太大？多态？）。配合 async-profiler 的火焰图，一个看\"编译得好不好\"、一个看\"热点在哪\"，是性能优化的完整闭环。"
   },
   {
    "t": "pits",
    "items": [
     "说 C1 也做激进优化——C1 是快编译、保启动，激进优化（内联/逃逸/循环展开）是 C2 的事",
     "把内联门槛记成只看方法大小——还有非递归、单态类型（profiling 决定），final 不是内联前提",
     "把逆优化当成异常——它是 C2 乐观假设被打破的正常回退，热更 redefine 引发的逆优化风暴才是要防的",
     "用 -XX:+PrintAssembly 却不知道要装 hsdis——没有反汇编插件该参数不生效，JITWatch 的 Assembly 面板会空",
     "忽略 OSR（栈上替换）——长循环在循环中途升级编译要靠 OSR（% 标记），这是\"循环热\"与\"方法热\"的区别",
     "循环优化和安全点割裂看——C2 给 counted loop 省安全点检查正是 TTSP 隐患，JDK10+ 的 LoopStripMining 才是解"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分层编译 L0~L4，profiling 是 C2 的燃料；内联是前提，门槛\"方法小+非递归+单态\"；循环优化省安全点是 TTSP 隐患，LoopStripMining 兜底；逃逸分析产物用 JITWatch 验证；逆优化是乐观假设被打破的正常回退，热更 redefine 会引发风暴；工具链 PrintCompilation + JITWatch + async-profiler 三件套，热路径优化从猜变成看。"
   }
  ]
 },
 {
  "id": "jvm-architecture",
  "title": "架构级 JVM 方案与深水区",
  "layer": 3,
  "depends": [
   "jvm-game-tuning",
   "jvm-troubleshooting"
  ],
  "covers": [
   "jvm-21",
   "jvm-22",
   "jvm-23",
   "jvm-31",
   "jvm-36",
   "jvm-37"
  ],
  "quiz": [
   "jvm-21",
   "jvm-22",
   "jvm-23"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从单台 JVM 的参数，到 10 万长连接单区服的架构级方案、JDK 大版本升级、容器化与 Safepoint 深水区——把 JVM 能力拉到架构层面。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握游戏服调优（jvm-game-tuning）",
     "已掌握线上排查工具链（jvm-troubleshooting）",
     "本节点讲架构决策与深水区，容量要能算出来"
    ]
   },
   {
    "t": "h",
    "text": "10 万长连接单区服 JVM 方案"
   },
   {
    "t": "p",
    "text": "容量估算：10 万连接 × 每玩家在线数据 50KB ≈ 5G 常驻，加上配置表、缓存、战斗临时对象分配峰值，堆建议 16G-32G；堆外（Netty 直接内存 + 线程栈）另留 8G+，机器选 64G。GC 选型：JDK21 首选 -XX:+UseZGC -XX:+ZGenerational，STW <1ms 玩家无感；老环境 G1 则 -XX:MaxGCPauseMillis=50 -XX:InitiatingHeapOccupancyPercent=35（提前启动并发标记，给晋升留缓冲）。监控告警落地：Full GC >0 次/天即告警；单次 STW >100ms（G1）告警；老年代 1 小时涨幅 >10% 告警（疑似泄漏）；safepoint 日志常开（-Xlog:safepoint）。业务侧闭环：把 GC 事件打点进 BI 服，与玩家卡顿上报/掉线率关联分析——游戏公司特有的监控闭环。容灾：玩家状态定时快照落 Redis/DB，进程崩溃可快速恢复现场。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 270'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>10 万长连接单区服 JVM 方案</text>\n  <rect x='30' y='44' width='280' height='120' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='170' y='66' font-size='13' fill='var(--lv1)' text-anchor='middle' font-weight='bold'>内存预算（机器 64G）</text>\n  <text x='170' y='92' font-size='12' fill='var(--ink)' text-anchor='middle'>堆 16G-32G（10 万 x 50KB 常驻 5G）</text>\n  <text x='170' y='114' font-size='12' fill='var(--ink)' text-anchor='middle'>堆外 8G+（直接内存 + 线程栈）</text>\n  <text x='170' y='136' font-size='12' fill='var(--muted)' text-anchor='middle'>元空间 + JIT code + 余量</text>\n  <text x='170' y='154' font-size='12' fill='var(--muted)' text-anchor='middle'>MaxDirectMemorySize 显式限额</text>\n  <rect x='330' y='44' width='280' height='120' rx='6' fill='var(--accent-soft)' stroke='var(--accent)'/>\n  <text x='470' y='66' font-size='13' fill='var(--accent)' text-anchor='middle' font-weight='bold'>GC 选型与参数</text>\n  <text x='470' y='92' font-size='12' fill='var(--ink)' text-anchor='middle'>JDK21：ZGC + ZGenerational</text>\n  <text x='470' y='114' font-size='12' fill='var(--ink)' text-anchor='middle'>G1 备选：PauseMillis=50 / IHOP=35</text>\n  <text x='470' y='136' font-size='12' fill='var(--muted)' text-anchor='middle'>业务：Netty EventLoop + Disruptor</text>\n  <text x='470' y='154' font-size='12' fill='var(--muted)' text-anchor='middle'>单线程消费者模型，玩家逻辑无锁</text>\n  <rect x='110' y='186' width='420' height='64' rx='6' fill='var(--panel)' stroke='var(--line)'/>\n  <text x='320' y='208' font-size='13' fill='var(--ink)' text-anchor='middle' font-weight='bold'>监控告警闭环（游戏公司特色）</text>\n  <text x='320' y='230' font-size='12' fill='var(--muted)' text-anchor='middle'>FGC 零容忍 / STW>100ms 告警 / 老年代 1h 涨幅 >10% 告警 → 与玩家卡顿上报、掉线率关联 BI</text>\n  <text x='320' y='248' font-size='12' fill='var(--muted)' text-anchor='middle'>容灾：玩家状态定时快照落 Redis/DB，进程崩溃快速恢复现场</text>\n  <line x1='312' y1='166' x2='312' y2='182' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M312 184 l-4 -8 h8 z' fill='var(--accent)'/>\n  <line x1='328' y1='166' x2='328' y2='182' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M328 184 l-4 -8 h8 z' fill='var(--accent)'/>\n</svg>",
    "caption": "图：10 万长连接单区服内存预算、GC 选型与监控闭环"
   },
   {
    "t": "h",
    "text": "JDK8 → 17/21 升级：GC 层的收益与坑"
   },
   {
    "t": "list",
    "items": [
     "收益：G1 成熟化（JDK10 起 Full GC 并行，远好于 JDK8 的单线程 Serial Old 兜底）；分代 ZGC（JDK21）STW<1ms 且吞吐接近 G1，对状态同步延迟敏感的 MMORPG 是质变；容器感知默认开启、JIT 改进，同硬件吞吐提升约 10%-20%"
    ]
   },
   {
    "t": "list",
    "items": [
     "坑①：CMS 被删除——JDK14 起 -XX:+UseConcMarkSweepGC 及一堆 CMS 参数直接启动失败，要全换 G1/ZGC 参数并重新压测",
     "坑②：GC 日志格式全变——JDK9+ 统一 -Xlog:gc*:file=gc.log:time,level,tags，旧 PrintGCDetails 等全部废弃，监控/告警脚本要重写",
     "坑③：模块化强封装——JDK16+ 强封装 JDK 内部 API，反射访问 sun.misc.Unsafe/NIO 内部类报 InaccessibleObjectException，Netty 旧版/序列化/热更框架要升级或 --add-opens",
     "边角：默认字符集 UTF-8（JDK18）、Security Manager 弃用等"
    ]
   },
   {
    "t": "p",
    "text": "升级策略：协议层（RPC 序列化产物）先保证兼容 → 灰度单服 → 对比 JVM 侧（STW 分布/P99、晋升速率、老年代水位）与业务侧（协议处理 P99/P999、战斗帧耗时、掉线率、卡顿上报）→ 全量。"
   },
   {
    "t": "h",
    "text": "容器化：MaxRAMPercentage 与优雅停机"
   },
   {
    "t": "p",
    "text": "版本事实（已核实）：JDK8u191+ / JDK10+ 默认 UseContainerSupport，能读 cgroup 的内存/CPU 限制；-XX:MaxRAMPercentage 默认仅 25%，必须显式调大（游戏服建议 70-80），基数是容器 limit 不是宿主机。CPU 感知：老版本 JVM 看到宿主机核数会超发 GC 线程、加剧 CFS throttle 卡顿，用 -XX:ActiveProcessorCount 强制指定。优雅停机：容器里 Java 做 PID 1 收不到 SIGTERM 全套处理，K8s preStop 钩子里先摘流量 → 踢玩家下线并触发存档 → 等关键队列（日志、支付）消费完 → 再退出。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# K8s limit 8G 游戏服（JDK17+）\n-XX:+UseZGC -XX:+ZGenerational\n-XX:MaxRAMPercentage=75.0             # 默认 25% 是坑，游戏服给 70-80\n-XX:MaxDirectMemorySize=1g            # 堆外显式限额，留出元空间/栈/JIT 预算\n-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/data/dump   # 挂持久卷\n-Xlog:gc*:file=/data/logs/gc.log:time,uptime,level,tags:filecount=10,filesize=100m\n# preStop：先调下线接口踢玩家存档，再走优雅退出，避免玩家数据丢失"
   },
   {
    "t": "h",
    "text": "Safepoint 与 TTSP：非 GC 停顿的真凶"
   },
   {
    "t": "p",
    "text": "总停顿 = TTSP（等最慢线程赶到安全点）+ VM 操作耗时（vmop）。GC 日志只报后者——这就是「GC 日志 20ms 但监控显示 500ms 停顿」的真相。元凶代码模式：C2 对紧凑 int 计数循环默认不插安全点检查，一个几亿次的循环（寻路预处理、GM 全表统计、批量伤害计算）可能数百 ms 不让全局进入安全点，全员陪等。对策：索引用 long 强制插检查点、按批次拆分（每 256 个单位让步）、放独立线程池控制批大小。查看手段：-Xlog:safepoint 看 TTSP 与 vmop 类型；-XX:+SafepointTimeout + -XX:SafepointTimeoutDelay 直接点名迟到线程。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox='0 0 640 220'>\n  <text x='320' y='24' font-size='15' fill='var(--ink)' text-anchor='middle' font-weight='bold'>真实 STW = TTSP + VM 操作耗时</text>\n  <rect x='40' y='60' width='220' height='70' rx='6' fill='var(--lv3-bg)' stroke='var(--lv3)'/>\n  <text x='150' y='86' font-size='13' fill='var(--lv3)' text-anchor='middle' font-weight='bold'>TTSP（等最慢线程）</text>\n  <text x='150' y='110' font-size='12' fill='var(--muted)' text-anchor='middle'>counted loop 迟到数百 ms</text>\n  <rect x='290' y='60' width='240' height='70' rx='6' fill='var(--lv1-bg)' stroke='var(--lv1)'/>\n  <text x='410' y='86' font-size='13' fill='var(--lv1)' text-anchor='middle' font-weight='bold'>vmop（安全点内干活）</text>\n  <text x='410' y='110' font-size='12' fill='var(--muted)' text-anchor='middle'>GC 移动对象 / 偏向锁撤销 / redefine</text>\n  <line x1='262' y1='95' x2='286' y2='95' stroke='var(--accent)' stroke-width='2'/>\n  <path d='M288 95 l-7 -3 v6 z' fill='var(--accent)'/>\n  <text x='150' y='165' font-size='12' fill='var(--muted)' text-anchor='middle'>GC 日志只报 vmop → 监控看到 500ms</text>\n  <text x='410' y='165' font-size='12' fill='var(--muted)' text-anchor='middle'>safepoint 日志才有 TTSP 真相</text>\n  <text x='320' y='196' font-size='12' fill='var(--lv3)' text-anchor='middle'>排查：业务延迟尖刺时间戳 → 对齐 safepoint 日志 → 看是 TTSP 长还是 vmop 长</text>\n</svg>",
    "caption": "图：真实 STW 由 TTSP 与 vmop 组成，GC 日志只报后半段"
   },
   {
    "t": "h",
    "text": "JNI 与 native 层"
   },
   {
    "t": "p",
    "text": "过 JNI 桥后 JVM 的安全网（GC、异常、内存边界检查）全部失效——native 崩溃直接干死整个进程，native 内存泄漏 jmap/MAT 完全看不见。游戏服常见 JNI：Netty epoll transport、LZ4/zstd/OpenSSL、RocksDB、寻路物理库。hs_err_pid.log 判读：Problematic frame 前缀决定凶手——J=JIT 编译的 Java 方法、C=native 库（基本坐实库 bug）、V=libjvm.so（不一定是 JVM bug，可能被外库越界写踩了内存）。native 内存排查：NMT 只管 JVM 账内，第三方库用 jemalloc profiling（MALLOC_CONF=prof:true）或 pmap 与已知项做减法。防御设计：重度 native 计算（物理引擎、压缩）拆独立进程 + IPC，崩了不拖死主游戏服——把「会踩内存的」和「不能死的」分开。"
   },
   {
    "t": "pits",
    "items": [
     "10 万连接方案只堆参数不给容量估算——先算常驻内存（连接数 x 单玩家数据量）再定堆，数字说话",
     "JDK 升级只谈语法新特性——本题焦点是 GC 参数、日志格式、模块封装三大坑",
     "容器里不算堆外预算——堆 + 堆外 + 元空间 + 线程栈总和超 limit 会被无声杀死（137）",
     "把 Safepoint 等同 GC——GC 只是 safepoint 的一种 vmop，偏向锁撤销、热更 redefine 都会触发",
     "hs_err 里 frame 是 libjvm.so 就咬定 JVM bug——也可能是外库踩坏 JVM 数据结构，结合近期 native 库变更判断"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：架构级答案五步走「估算 → 选型 → 参数 → 监控 → 容灾」，10 万连接大堆单实例 + ZGC/分代 ZGC + 堆外单算 + FGC 零容忍 + 水位斜率告警 + 卡顿关联 BI；JDK 升级记「参数换、日志换、封装破」，收益记分代 ZGC 毫秒停顿与吞吐白捡 10%+；容器记「RAMPercentage 默认 25 是坑，游戏服给 75，preStop 先踢玩家存档」；Safepoint 记「总停顿 = TTSP + vmop，紧凑大循环是迟到专业户」；native 记「过 JNI 桥 GC 管不着，hs_err 看 frame 定凶手，重度 native 拆进程」。JVM 复习到此闭环：从内存区域到架构方案，一条线全打通。"
   }
  ]
 },
 {
  "id": "jvm-zgc-shenandoah",
  "title": "ZGC 与 Shenandoah：亚毫秒停顿的两条路线",
  "layer": 3,
  "depends": [
   "jvm-collectors"
  ],
  "covers": [
   "jvm-14",
   "jvm-33"
  ],
  "quiz": [
   "jvm-14"
  ],
  "body": [
   {
    "t": "lead",
    "text": "大堆 + 长连接游戏服对停顿零容忍：ZGC 把 GC 元信息塞进指针高位、用读屏障自愈引用，Shenandoah 用对象头前的转发指针换并发整理——两条路线都让 STW 与堆大小解耦，选型看堆规模、JDK 版本与发行版。"
   },
   {
    "t": "pre",
    "items": [
     "并发标记正确性（三色标记/SATB/写屏障）——jvm-tri-color-marking",
     "G1 的 Region 化与停顿模型——jvm-g1-deep",
     "64 位指针布局与压缩指针的 32G 分水岭（jvm-34）"
    ]
   },
   {
    "t": "h",
    "text": "一、为什么需要 ZGC：G1 的停顿还是太长"
   },
   {
    "t": "p",
    "text": "G1 把停顿压到几百毫秒以内，但 Young GC 的 STW 与存活对象量成正比，Mixed GC 复制大量老年代 Region 时停顿可达几十到几百毫秒——这对百万玩家同时在线、战斗帧率敏感的游戏服仍是体感伤害。ZGC 的目标是让停顿与堆大小彻底解耦：不管堆是 2G 还是 16TB，STW 都只与 GC Roots 数量相关（毫秒/亚毫秒级）。达成这个目标的两个支柱是染色指针和读屏障。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">64 位染色指针布局（ZGC）</text><rect x=\"30\" y=\"44\" width=\"200\" height=\"90\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"130\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">位 0~41（JDK13+ 位 0~43）</text><text x=\"130\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">对象地址</text><text x=\"130\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">42bit = 4TB | 44bit = 16TB</text><text x=\"130\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">与压缩指针冲突：ZGC 不支持 Oops</text><rect x=\"250\" y=\"44\" width=\"240\" height=\"90\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"370\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">位 42~45（4 bit 标志位）</text><text x=\"370\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Marked0 | Marked1 | Remapped | Finalizable</text><text x=\"370\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">对象生死状态跟着指针走，不在对象头</text><text x=\"370\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读屏障检查颜色位决定快/慢路径</text><rect x=\"510\" y=\"44\" width=\"100\" height=\"90\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"560\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">保留位</text><text x=\"560\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">预留扩展</text><text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">版本事实（已验证）：</text><text x=\"320\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JDK11 实验性（JEP 333）→ JDK15 生产可用（JEP 377）→ JDK21 分代 ZGC（JEP 439）</text><text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JDK13+ 堆上限从 4TB 提升到 16TB；JDK21 需显式 -XX:+UseZGC -XX:+ZGenerational，默认仍是 G1</text></svg>",
    "caption": "图：染色指针位布局与 ZGC 版本演进（事实点已验证）"
   },
   {
    "t": "h",
    "text": "二、染色指针：把 GC 元数据塞进地址"
   },
   {
    "t": "p",
    "text": "传统 GC 把对象状态存在对象头里，标记/转移要改对象头还得保证可见性；ZGC 反其道，把状态塞进指针本身。64 位指针中，对象地址只占 42 位（JDK11，对应 4TB 堆上限；JDK13+ 扩到 44 位、16TB），剩下的位拿出 4 个作为颜色标志：Marked0/Marked1（奇数/偶数轮次的标记结果）、Remapped（对象是否已迁移到新地址）、Finalizable（只能经 finalize 访问）。读一个引用时，JVM 直接检查指针的颜色位就能知道这个对象是\"已被标记\"还是\"已移动\"——对象状态跟着指针走，转移对象后不需要回写老对象头。"
   },
   {
    "t": "p",
    "text": "为了配合染色指针，ZGC 用多重映射（Multi-Mapping）：同一块物理内存映射到三个不同的虚拟地址视图（Marked0 视图 / Marked1 视图 / Remapped 视图），三个视图的差别只在高位颜色位的值。指针颜色变了，从虚拟地址层面看就等于\"跳到了另一个视图\"，物理内存完全没动——JVM 用一个 bit 操作就能完成颜色切换，代价为零。这也是为什么 ZGC 有两大限制：必须 64 位（32 位没有富余位）、与压缩指针互斥（压缩指针会用掉那些高位）。"
   },
   {
    "t": "h",
    "text": "三、读屏障与自愈式引用修正"
   },
   {
    "t": "p",
    "text": "ZGC 只在\"读引用\"时做检查，这就是读屏障（Load Barrier）：应用线程每次从堆里读引用，JVM 检查指针颜色位——颜色\"好\"（Good Color）直接放行，快路径几乎零开销；颜色\"坏\"（Bad Color，对象已移动或本轮未标记）进入慢路径，通过 Region 的转发表找到对象新地址，修正引用指向新地址并把颜色改成 Remapped——这就是\"自愈\"：应用线程访问到哪，引用就修正到哪，无需 STW 全量更新引用。官方基准测试读屏障开销约 4%（SPECjbb 2015）。配合自愈，ZGC 的并发整理四阶段得以成立：初始标记（STW，只扫 Roots）→ 并发标记（边跑边染指针颜色）→ 并发预备重分配（统计选出重分配集）→ 并发重分配（复制存活对象 + 转发表 + 自愈修正）→ 重映射（把残余的旧地址引用扫尾，可与下轮标记合并）。"
   },
   {
    "t": "h",
    "text": "四、版本演进与分代 ZGC"
   },
   {
    "t": "p",
    "text": "ZGC 的成熟轨迹值得记：JDK11 实验性引入（需 -XX:+UnlockExperimentalVMOptions）；JDK13 支持 AArch64、堆上限提到 16TB、支持 uncommit 归还未用内存；JDK15 转正生产可用（JEP 377），并支持类卸载、Windows/macOS 平台、NVRAM 堆；JDK21 推出分代 ZGC（JEP 439）——老 ZGC 不分代，全堆同等扫描转移，CPU 开销高、浮动垃圾多、需要大量堆余量；分代 ZGC 把新生代和老年代分开，新生代高频快收、老年代低频深收，吞吐从\"比 G1 低 5%~15%\"拉回接近 G1，堆余量需求也大幅下降。注意 JDK21 的分代 ZGC 必须显式 -XX:+UseZGC -XX:+ZGenerational 开启，默认仍是 G1。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">ZGC 并发整理阶段：停顿点只有 Roots 相关</text><rect x=\"30\" y=\"50\" width=\"110\" height=\"54\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"85\" y=\"72\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">初始标记</text><text x=\"85\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">STW 扫 Roots</text><rect x=\"170\" y=\"50\" width=\"110\" height=\"54\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"225\" y=\"72\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">并发标记</text><text x=\"225\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">染指针颜色</text><rect x=\"310\" y=\"50\" width=\"120\" height=\"54\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"370\" y=\"72\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">并发预备重分配</text><text x=\"370\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">统计选重分配集</text><rect x=\"460\" y=\"50\" width=\"150\" height=\"54\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"535\" y=\"72\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">并发重分配</text><text x=\"535\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">复制+转发表+自愈</text><text x=\"85\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">毫秒级</text><text x=\"370\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">与业务并发，零停顿</text><text x=\"535\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">与业务并发</text><rect x=\"40\" y=\"164\" width=\"560\" height=\"64\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">重映射（Remap）：把残余旧地址引用修正，可与下一轮标记合并省一次遍历</text><text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">STW 时长只与 GC Roots 数量相关（线程栈规模），与堆大小无关 → TB 级堆也 &lt;1ms</text><text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">代价：吞吐降 5%~15%（分代 ZGC 后接近 G1）、需堆余量、不支持压缩指针、仅 64 位平台</text></svg>",
    "caption": "图：ZGC 并发整理阶段与\"停顿与堆大小解耦\"的代价"
   },
   {
    "t": "h",
    "text": "五、Shenandoah：Brooks 转发指针路线"
   },
   {
    "t": "p",
    "text": "Shenandoah 由 Red Hat 主导，目标与 ZGC 相同（亚毫秒级停顿、STW 与堆大小无关），路线完全不同：每个对象头前额外放一个 Brooks 转发指针（平时指向自己，对象被并发转移后旧对象的转发指针指向新地址），应用线程访问旧对象时经转发指针跳到新地址并顺带修正引用。它需要读写双屏障（写屏障维护 SATB 标记正确性、读屏障做转发跳转，JDK13 后读屏障简化为 LRB 大幅降开销），并发整理六个阶段：初始标记 → 并发标记 → 最终标记 → 并发清理 → 并发转移 → 并发引用更新（加初始/最终两个极短 STW 点）。版本事实：JDK12 引入（JEP 189，实验性），JDK15 转正，且因为 Oracle 构建默认不包含 Shenandoah，实际使用要选 Adoptium、RHEL 等 OpenJDK 发行版。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "ZGC",
     "Shenandoah"
    ],
    "rows": [
     [
      "GC 元信息位置",
      "指针高位（染色指针，零对象开销）",
      "对象头前转发指针（每对象 +8 字节）"
     ],
     [
      "屏障",
      "只读屏障（+分代模式的写屏障）",
      "读写双屏障（LRB 优化后主读屏障）"
     ],
     [
      "平台限制",
      "仅 64 位，与压缩指针互斥",
      "无指针位限制，ARM 等平台也可跑"
     ],
     [
      "分代",
      "JDK21 有分代 ZGC",
      "长期无分代，靠堆余量消化浮动垃圾"
     ],
     [
      "发行版",
      "OpenJDK 主线，Oracle JDK 可用",
      "Oracle 构建默认不包含，需特定发行版"
     ],
     [
      "内存效率",
      "小对象场景受限于无压缩指针",
      "小对象每对象多 8 字节，也吃亏"
     ]
    ]
   },
   {
    "t": "h",
    "text": "六、游戏服选型：适用场景、代价与落地建议"
   },
   {
    "t": "p",
    "text": "给结论：堆 ≥16G、在线人数多、对卡顿零容忍的 MMORPG 主战服，JDK17+ 优先选 ZGC，JDK21 直接选分代 ZGC（-XX:+UseZGC -XX:+ZGenerational）；JDK11/17 且用 OpenJDK 发行版、不想升级又想要亚毫秒停顿，可以评估 Shenandoah，但商业项目默认走 ZGC 主线更稳。同时必须接受三个代价：吞吐折损（压测量化，分代 ZGC 后通常 3%~8%）；需要堆余量（无分代版建议留 30%+ 空闲消化浮动垃圾，分代版需求显著下降）；内存效率（无压缩指针，百万级小对象场景堆占用比 G1 高，需实测对比）。落地 checklist：压测对比 STW 分位数与吞吐 → 确认堆余量与总内存预算（堆+堆外+元空间）→ 开启 GC 日志与 JFR 跟踪 → 灰度单服对比玩家卡顿上报率 → 全量。记住：ZGC 不是默认选项，它用吞吐换延迟，游戏服也要先量一量自己是不是真的对毫秒级停顿有刚需。"
   },
   {
    "t": "pits",
    "items": [
     "说 ZGC 是 JDK15 才有——JDK11 就实验性引入，JDK15 才转正，版本口径要准",
     "说 JDK21 默认用分代 ZGC——必须显式 -XX:+UseZGC -XX:+ZGenerational，默认仍是 G1",
     "把堆上限记成 16TB 一步到位——JDK11 是 4TB，JDK13+ 才提到 16TB",
     "忽略染色指针与压缩指针互斥——ZGC 不能用 UseCompressedOops，小对象内存效率不如 G1，这是选型代价之一",
     "说 Shenandoah 是 Oracle JDK 自带——Oracle 构建默认不包含，Adoptium/RHEL 发行版才有",
     "把 ZGC 讲成无代价——吞吐降 5%~15%、需要堆余量，\"用吞吐换延迟\"才是准确表述"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：ZGC 用染色指针（42bit 地址 + 4 色标志，JDK13+ 16TB）+ 读屏障自愈实现并发整理，STW 与堆大小解耦、官方宣称 &lt;1ms；版本演进 JDK11 实验 → 15 生产 → 21 分代（显式开启）；Shenandoah 用 Brooks 转发指针 + 读写屏障换并发整理，每对象多 8 字节、Oracle 构建不含；选型口诀\"堆大延迟敏感上 ZGC，JDK21 用分代，吞吐与堆余量是代价，先压测再上\"。"
   }
  ]
 },
 {
  "id": "jvm-classloader-hotswap",
  "title": "类加载器实战与热部署",
  "layer": 3,
  "depends": [
   "jvm-class-loading"
  ],
  "covers": [
   "jvm-08",
   "jvm-27"
  ],
  "quiz": [
   "jvm-08"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从\"能打破双亲委派\"到\"能设计一套热更体系\"：SPI 为什么必须靠 TCCL 反向加载、Tomcat 怎么用 WebappClassLoader 做应用隔离、自定义 ClassLoader 怎么实现热加载、JDK9 模块化后类加载器长什么样——以及游戏服热更方案该怎么做才不把元空间泄漏成事故。"
   },
   {
    "t": "pre",
    "items": [
     "双亲委派模型与打破三场景（jvm-class-loading）",
     "类加载五阶段与初始化时机（jvm-class-loading）",
     "元空间 OOM 与类卸载三条件（jvm-class-loading / jvm-refs-oom）"
    ]
   },
   {
    "t": "h",
    "text": "一、双亲委派破坏的三个经典姿势"
   },
   {
    "t": "p",
    "text": "先钉死一条边界：遵守双亲委派就重写 findClass（loadClass 的委派流程保留，父加载不了才回调你）；要破坏委派才重写 loadClass，直接改变\"先找爹\"的顺序。三大经典破坏场景各有各的动机：SPI 机制——Bootstrap/Platform 加载了接口（java.sql.Driver、javax.sql.DataSource），但实现类在应用 classpath 上，委派链到不了 AppClassLoader，于是用线程上下文类加载器（TCCL）反向加载，让接口实现\"下放\"给应用；Tomcat 应用隔离——多个 WebApp 同名类必须互不干扰，WebappClassLoader 优先加载自己 WEB-INF/classes 下的类，父加载器变兜底；热部署/热更新——游戏服热更必须换新 ClassLoader 加载新版类，因为 JVM 不允许同一加载器重复加载同名类。把这三个动机讲清楚，比背\"打破方法\"有说服力得多。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">SPI 反调：接口在 Bootstrap，实现靠 TCCL</text><rect x=\"40\" y=\"48\" width=\"200\" height=\"60\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"140\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">BootstrapClassLoader</text><text x=\"140\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">加载 java.sql.Driver 接口</text><path d=\"M240 78 L300 78\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><text x=\"270\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">委派不了实现</text><rect x=\"40\" y=\"140\" width=\"200\" height=\"60\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"140\" y=\"164\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">AppClassLoader（TCCL）</text><text x=\"140\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">加载 com.mysql.Driver</text><rect x=\"360\" y=\"48\" width=\"240\" height=\"152\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"480\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">DriverManager（核心类）</text><text x=\"480\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ServiceLoader 扫 META-INF/services</text><text x=\"480\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">Thread.currentThread().getContextClassLoader()</text><text x=\"480\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">用 TCCL（App）加载实现类</text><text x=\"480\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ 打破\"爹用儿的类\"的死结</text><text x=\"480\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服日志框架 SPI、JDBC 驱动、</text><text x=\"480\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Protocol 扩展全走这条链</text><path d=\"M300 110 L360 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"330\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">TCCL</text></svg>",
    "caption": "图：SPI 用 TCCL 反向加载实现类，绕开委派链的死结"
   },
   {
    "t": "h",
    "text": "二、Tomcat WebappClassLoader：应用隔离教科书"
   },
   {
    "t": "p",
    "text": "Tomcat 的类加载器结构是分层委派的教科书：Bootstrap → Ext/Platform → 系统（App）→ 每个 WebApp 一个 WebappClassLoaderBase（Java 9+ 还有 JRE 模块层）。WebappClassLoader 的查找顺序刻意打破双亲委派：先查自己缓存 → 再查 WEB-INF/classes 与 WEB-INF/lib（应用自己的类优先）→ 再委派父加载器 → 最后查 Common/Shared 目录的系统类。为什么这个顺序？因为两个 WebApp 可能带不同版本的 Spring、不同版本的同一个业务类，如果都让父加载器加载就会互相污染；自己优先才能实现\"各玩各的\"。注意一个安全例外：java.*、javax.* 等核心类仍必须由 Bootstrap 加载，这是安全底线。WebApp 的热部署本质就是\"换一个 WebappClassLoader\"——目录变更监听触发 reload，新建 loader 加载新版本，旧 loader 连同旧类全部丢弃。"
   },
   {
    "t": "h",
    "text": "三、自定义 ClassLoader 实现热加载"
   },
   {
    "t": "p",
    "text": "热加载的底层依据是类唯一性公式：类身份 = 全限定名 + 定义它的类加载器。同一个 XxxService 类，由 Loader-A 加载的实例和 Loader-B 加载的实例互不识别——instanceof 为 false、强转抛 ClassCastException。热更正是利用这一点：新版本代码交给新 Loader 加载，业务持有的是\"新类的新实例\"，旧 Loader 连同旧类整体变垃圾等待卸载。实现要点：遵守委派就重写 findClass（从热更目录读字节码 → defineClass），核心 API 三个——findLoadedClass（先查缓存）、findClass（加载新字节流）、defineClass（把字节数组转成 Class）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "public class HotClassLoader extends ClassLoader {\n    private final Path root;                 // 热更补丁目录\n    public HotClassLoader(Path root, ClassLoader parent) {\n        super(parent); this.root = root;\n    }\n    @Override\n    protected Class<?> findClass(String name) throws ClassNotFoundException {\n        Path file = root.resolve(name.replace('.', '/') + \".class\");\n        try {\n            byte[] bytes = Files.readAllBytes(file);   // 读新版本字节码\n            return defineClass(name, bytes, 0, bytes.length);\n        } catch (IOException e) {\n            throw new ClassNotFoundException(name, e);\n        }\n    }\n}\n// 热更流程：new HotClassLoader → loadClass(\"com.game.service.SkillService\")\n// → 反射/工厂创建新实例 → 替换引用 → 旧 loader 无引用后整体回收\n// 三个致命坑：旧实例还被静态容器持有=卸不掉；新旧实例混用=ClassCastException；\n// 线程池线程 TCCL 还是旧 loader=卸不掉（热更后必须重置 TCCL）"
   },
   {
    "t": "h",
    "text": "四、隔离依赖：让两个版本共存"
   },
   {
    "t": "p",
    "text": "同一 Jar 两个版本、插件系统、各业务模块独立升级，都需要\"依赖隔离\"——子类加载器优先加载指定版本，父委派只处理共享类（JDK 类、公共基础设施）。做法：给每个隔离单元一个子加载器，findClass 从它自己的 lib 目录读，找不到再委托父加载器。代价与边界要讲透：隔离带来\"同类不同身份\"——插件 A 的 com.foo.Config 和插件 B 的不互通，传对象就 ClassCastException，因此隔离边界上要定义\"传输协议\"（接口放共享父目录，实现各版本私有）；序列化/反射/切面（AOP）跨隔离单元时也要小心类身份不匹配。游戏服实践：配置表结构（公共接口）放共享层，各服热更的业务实现放隔离层，接口驱动避免硬依赖。"
   },
   {
    "t": "h",
    "text": "五、JDK9+ 模块化：类加载器的三个变化"
   },
   {
    "t": "p",
    "text": "JDK9 模块化（Jigsaw）对类加载器的冲击有三点必须更新认知。第一，ExtClassLoader 改名 PlatformClassLoader，职责从\"ext 目录\"变成\"平台模块\"（java.se、jdk.unsupported 等），第三层 App 加载 classpath 模块与应用类。第二，强封装：非导出的 JDK 内部 API 反射访问直接抛 InaccessibleObjectException（-XX:+IllegalAccessControl 时代结束后），解决方案是 --add-opens 或 --add-exports 显式放行——Netty 旧版、旧序列化框架、Arthas 等字节码工具在 JDK17+ 都要配 --add-opens，这是游戏服升级 JDK 必踩的坑（对应 jvm-architecture 的 JDK 升级节）。第三，模块加载器职责更纯粹，热更/隔离的玩法基本不变，但 JDK 内部被模块严格划界，自定义加载器想碰 java.base 的类更不可能——安全边界更硬了。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">JDK9+ 类加载器：Bootstrap / Platform / App</text><rect x=\"170\" y=\"44\" width=\"300\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Bootstrap：java.base 等核心模块</text><text x=\"320\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">C++ 实现，JVM 自身</text><rect x=\"170\" y=\"96\" width=\"300\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"114\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Platform（原 Ext）：java.se 等平台模块</text><text x=\"320\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">jdk.unsupported / jdk.internal.* 部分</text><rect x=\"170\" y=\"148\" width=\"300\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">App：classpath 模块与应用类</text><text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">-javaagent 也挂在 App 层</text><path d=\"M320 84 L320 92\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M320 136 L320 144\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"500\" y=\"62\" font-size=\"12\" fill=\"var(--lv3)\">强封装：非导出包反射</text><text x=\"500\" y=\"82\" font-size=\"12\" fill=\"var(--lv3)\">访问抛 InaccessibleObjectException</text><text x=\"500\" y=\"102\" font-size=\"12\" fill=\"var(--muted)\">解法：--add-opens / --add-exports</text><text x=\"500\" y=\"122\" font-size=\"12\" fill=\"var(--muted)\">旧 Netty/序列化/字节码工具</text><text x=\"500\" y=\"142\" font-size=\"12\" fill=\"var(--muted)\">升级或配放行参数</text><text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">自定义加载器与热更玩法不变，但 java.* 内部被模块硬隔离，安全边界更强</text></svg>",
    "caption": "图：JDK9+ 三层加载器与强封装带来的 --add-opens 需求"
   },
   {
    "t": "h",
    "text": "六、游戏服热更方案设计：三个层次"
   },
   {
    "t": "p",
    "text": "把热更拆成三个层次选型：配置表热更——最简单也收益最高（活动配置、数值表），用监听文件变更 + 重载缓存即可，不涉及类；代码热更——两个流派：ClassLoader 方案（换 loader 整体加载新版本，改动面可控、但新旧实例隔离/静态状态重置要设计好）与字节码增强方案（Instrumentation redefine，只替换方法体、类身份不变，但仅限方法级修改）；进程级热更——灰度新进程 + 路由切换，最稳但成本高。游戏服成熟实践是三选二：配置表热更 + 日常代码走 ClassLoader 热更，大版本走灰度新进程，字节码增强留作线上补丁。ClassLoader 热更必答的四个设计点：静态状态怎么办（旧类的 static 字段不会自动搬进新类，业务要有状态重载/迁移机制）；旧实例怎么处理（新类替换后旧实例要么迁移要么拒绝继续使用，防止新旧混用 ClassCastException）；TCCL 怎么清（线程池线程的上下文加载器热更后要重置，否则旧 loader 卸不掉）；元空间泄漏怎么防（热更后监控 Metaspace 水位，dump 数旧 loader 实例）。把这四个设计点讲全，就是\"会做热更\"和\"见过热更事故\"的区别。"
   },
   {
    "t": "pits",
    "items": [
     "破坏双亲委派就重写 loadClass——遵守委派重写 findClass，破坏才动 loadClass，两个动作别混",
     "忘记类身份 = 类名 + 加载器——两个 loader 加载的同名类 instanceof 为 false，热更后新旧实例混用必抛 ClassCastException",
     "热更只换 loader 不处理静态状态——旧类的 static 字段不会自动迁移，业务状态要显式重载",
     "热更后不重置 TCCL——线程池长命线程还握着旧 loader，整个旧加载器及其类元数据卸不掉，N 次后 Metaspace OOM",
     "JDK9+ 还叫 ExtClassLoader——改名 PlatformClassLoader；且强封装下反射访问 JDK 内部要 --add-opens",
     "隔离依赖时把业务类也放共享父目录——隔离的目的是各版本私有，接口共享、实现隔离才是正确边界"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：破坏委派三场景（SPI 用 TCCL 反向加载、Tomcat 应用优先加载、热更换新 loader）；自定义 loader 重写 findClass + defineClass，热更靠\"类身份=类名+loader\"制造新旧隔离；隔离依赖\"接口共享、实现私有\"；JDK9+ 记\"Ext 改名 Platform、强封装要 --add-opens\"；游戏服热更选型\"配置表热更 + ClassLoader 热更 + 灰度新进程\"三层，设计点四个：静态状态迁移、旧实例处理、TCCL 重置、元空间监控。"
   }
  ]
 }
]
};
