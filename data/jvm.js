window.QB = window.QB || {};
window.QB["jvm"] = {
  id: "jvm",
  name: "JVM",
  icon: "☕",
  desc: "JVM 内存、GC、类加载与线上诊断；针对游戏服长连接常驻内存、战斗临时对象高频分配、线上卡顿定位等场景重点复习。",
  questions: [
    {
      id: "jvm-01",
      level: 1,
      q: "JVM 运行时内存区域如何划分？哪些是线程私有的，哪些是线程共享的？",
      a: "核心结论：程序计数器、虚拟机栈、本地方法栈是线程私有；堆和方法区（元空间）是线程共享。\n1. 程序计数器：当前线程执行的字节码行号指示器，唯一不会 OOM 的区域。\n2. 虚拟机栈：每个方法对应一个栈帧，存局部变量表、操作数栈、动态链接、返回地址；深度不够抛 StackOverflowError，无法扩展抛 OOM。\n3. 本地方法栈：为 native 方法服务，HotSpot 中与虚拟机栈合并。\n4. 堆：对象实例和数组的主要分配区，GC 主战场，分新生代（Eden + Survivor0/1）和老年代。\n5. 方法区/JDK8 后的元空间：存类元信息、运行时常量池、静态变量；JDK8 起用本地内存的 Metaspace 替代永久代，避免 PermGen OOM。\n6. 直接内存：不属于运行时数据区但受 -XX:MaxDirectMemorySize 限制，Netty 大量使用，超了也抛 OOM。",
      point: "考察内存区域的准确划分与私有/共享的底层原因，而非只会背区域名称",
      approach: "先一句话给出私有/共享结论，再逐区域讲职责和会抛什么错，堆的分代与元空间变迁要点出，结尾主动带一句 Netty 直接内存，展示与项目的连接。坑：别把直接内存算进运行时数据区，别把元空间说成在堆里。",
      followups: [
        { q: "为什么 JDK8 要把永久代换成元空间？", a: "永久代大小固定易 OOM，类元数据与堆 GC 耦合难回收；元空间用本地内存按需扩展，只受 MaxMetaspaceSize 限制，类卸载更彻底，也消除了 PermGen 的调优负担。" },
        { q: "String 常量池在 JDK6/7/8 中位置有什么变化？", a: "JDK6 在永久代；JDK7 移到堆中，intern 的字符串可参与普通 GC；JDK8 永久代整体删除，类元信息迁元空间，字符串常量池留在堆里。" },
        { q: "游戏服用 Netty，直接内存 OOM 的报错长什么样？怎么排查？", a: "报 OutOfMemoryError: Direct buffer memory。排查：确认 MaxDirectMemorySize，开泄漏检测 ADVANCED 级，NMT 看堆外增长，查 ByteBuf 是否成对 release。" }
      ],
      memory: "口诀：「两栈一器私有，一堆一区共享」——线程私有记『计数器+双栈』，共享记『堆+方法区』。",
      tags: ["内存区域", "基础"]
    },
    {
      id: "jvm-02",
      level: 1,
      q: "对象在堆中是如何分配的？说说对象创建（new）的完整过程。",
      a: "核心结论：类加载检查 → 分配内存 → 初始化零值 → 设置对象头 → 执行 <init>。\n1. 类加载检查：遇到 new 指令先查常量池能否定位类的符号引用，没加载先走类加载。\n2. 分配内存：两种策略——指针碰撞（堆规整，Serial/ParNew 用）和空闲列表（堆不规整，CMS 用）；并发分配靠 CAS+失败重试 或 TLAB（Thread Local Allocation Buffer，每个线程在 Eden 预分配一小块，默认开启，-XX:+UseTLAB）。\n3. 初始化零值：保证字段不赋值也能用。\n4. 设置对象头：Mark Word（哈希码、GC 分代年龄、锁状态）+ 类型指针（Klass Pointer），数组还有长度。\n5. 执行 <init>：构造器初始化。\n补充：TLAB 对游戏服高频创建小对象（如战斗临时对象）很重要，它让分配无锁化。",
      point: "考察对象创建全流程的细节掌握，尤其并发分配优化 TLAB 的理解深度",
      approach: "先用五步口诀给主线，再把内存分配两种策略和并发方案（CAS/TLAB）讲透，对象头点出 Mark Word 为锁升级埋钩子，结尾结合战斗临时对象说 TLAB 价值。坑：别漏 TLAB，别把指针碰撞和空闲列表与收集器的对应关系张冠李戴。",
      followups: [
        { q: "对象头里 Mark Word 在 synchronized 锁升级时怎么变化？", a: "无锁时存 hash 与 GC 年龄；偏向锁改存线程 ID 与 epoch；轻量级锁存指向栈中锁记录的指针；重量级锁存指向 monitor 的指针。锁升级本质就是 Mark Word 内容的切换史。" },
        { q: "TLAB 是什么？为什么说它让对象分配接近『线程私有』？", a: "每个线程在 Eden 预占的一小块缓冲，分配只在自家 TLAB 内移动指针，全程无锁；TLAB 耗尽才走全局 CAS 申请新块。对象仍在共享堆里，但分配动作近似线程私有。" },
        { q: "指针碰撞和空闲列表分别对应哪种 GC 收集器？为什么？", a: "指针碰撞要求堆规整，用复制/整理算法的 Serial、ParNew 采用；空闲列表容忍碎片，CMS 标记-清除的老年代采用。GC 算法决定堆是否规整，进而决定分配策略。" }
      ],
      memory: "记忆钩子：『查类、分地、清零、盖章、装修』——检查类、分配内存、置零、设对象头、跑构造器。",
      tags: ["对象创建", "TLAB", "基础"]
    },
    {
      id: "jvm-03",
      level: 1,
      q: "判断对象是否存活的两种算法？Java 为什么用可达性分析？哪些对象可以作为 GC Roots？",
      a: "核心结论：Java 用可达性分析而非引用计数，因为引用计数解决不了循环引用。\n1. 引用计数法：给对象加计数器，引用+1、失效-1，归零可回收；缺陷是无法处理 A↔B 循环引用，且每次赋值都有额外开销。\n2. 可达性分析：从 GC Roots 出发向下搜索，搜索不到的对象判定为可回收（还要经过 finalize 的『缓刑』流程才真正回收）。\nGC Roots 包括：\n- 虚拟机栈（栈帧局部变量表）中引用的对象；\n- 方法区中静态属性、常量引用的对象；\n- 本地方法栈 JNI 引用的对象；\n- 活跃线程对象；\n- synchronized 持有的锁对象；\n- JVM 内部引用（类加载器、重要异常类等）。\n游戏服场景：玩家对象通常挂在 session/在线玩家 Map 上（被静态容器或线程栈引用），这就是它们常驻的原因——玩家下线必须从 Map 移除，否则内存泄漏。",
      point: "考察可达性分析的选择理由、GC Roots 清单及解释泄漏的能力",
      approach: "先给结论：Java 选可达性是因引用计数解决不了循环引用；再简述两算法对比，背六类 Roots；关键加分项是用 Roots 解释项目里玩家对象常驻原因和下线泄漏风险，展示理论联系实际。坑：别漏活跃线程、synchronized 锁对象这两类 Roots。",
      followups: [
        { q: "可达性分析中两次标记和 finalize 的『自救』流程是什么？", a: "第一次标记后，无 finalize 或已执行过的对象直接判死；有 finalize 的进 F-Queue 由 Finalizer 线程执行，期间重新被引用可复活一次；第二次标记仍不可达才真正回收。" },
        { q: "四种引用（强软弱虚）分别什么用途？游戏服本地缓存适合用哪种？", a: "强引用 OOM 也不回收；软引用内存不足才回收，适合可重建缓存；弱引用 GC 即回收，适合 key 死即失效的映射；虚引用只做回收通知。本地缓存首选带容量与过期策略的 Caffeine，比软引用可控。" },
        { q: "为什么你们玩家下线处理不当会造成老年代持续增长？用 GC Roots 解释一下。", a: "玩家对象被静态在线 Map（GC Root）强引用，下线不 remove 则始终可达，Minor GC 杀不死，年龄增长后晋升老年代；积少成多老年代持续上涨，最终 Full GC 甚至 OOM。" }
      ],
      memory: "口诀：『计数怕循环，可达问根源』——Roots 记『栈、静态、常量、JNI、线程、锁』六类。",
      tags: ["GC Roots", "可达性分析", "基础"]
    },
    {
      id: "jvm-04",
      level: 1,
      q: "三种基础垃圾回收算法（标记-清除、标记-复制、标记-整理）的原理和优缺点？分别用在哪？",
      a: "核心结论：新生代用复制，老年代用清除或整理，分代思想是算法选择的依据。\n1. 标记-清除：标记后直接清除。优点简单；缺点：①效率不稳定（对象多时代价高）②产生内存碎片，大对象可能无处安放。CMS 的老年代回收用它。\n2. 标记-复制：内存分两半，活着的复制到另一半，一次清掉半区。优点无碎片、分配快（指针碰撞）；缺点浪费一半内存。改进版 Appel 式回收：Eden:Survivor = 8:1:1，只浪费 10%，用于新生代。\n3. 标记-整理：标记后把存活对象向一端移动再清边界。优点无碎片不浪费空间；缺点移动对象要更新引用且必须 STW，成本高。Serial Old、Parallel Old、G1 的 region 内压缩用它。\n分代假说：绝大多数对象朝生夕灭（游戏战斗临时对象就是典型），熬过多次 GC 的对象往往长期存活（玩家数据、配置表）。",
      point: "考察三种 GC 算法的取舍依据与分代思想，而非孤立背诵优缺点",
      approach: "先一句话定调『分代假说决定算法选择』，再逐个讲原理并各记一个致命缺点，随后落到新生代 8:1:1 复制、老年代清除/整理的应用场景，结尾用战斗临时对象与玩家数据印证分代假说。坑：别忘 Appel 式改进，别说复制算法浪费一半而不提 8:1:1。",
      followups: [
        { q: "为什么新生代用复制算法而老年代不用？", a: "新生代存活率低，复制代价与存活对象数成正比，少量存活复制极快；老年代存活率高，复制成本巨大且要浪费一半空间，只能用清除或整理。" },
        { q: "Survivor 区为什么是两个？一个行不行？", a: "两个 Survivor 保证任何时候都有一个空区承接 Eden+另一 Survivor 的存活对象，复制后留下规整空间用指针碰撞分配；只有一个会产生碎片，退化成空闲列表，复制算法失去意义。" },
        { q: "什么情况下新生代的对象会提前晋升老年代？", a: "四种：年龄达 MaxTenuringThreshold；动态年龄判定（同年龄对象超 Survivor 一半）；大对象直接进老年代；Minor GC 后 Survivor 放不下触发分配担保。" }
      ],
      memory: "口诀：『清除碎、复制费、整理慢』——各记一个致命缺点；『新生复制老生整（清）』记应用场景。",
      tags: ["GC算法", "分代", "基础"]
    },
    {
      id: "jvm-05",
      level: 1,
      q: "Minor GC、Major GC、Full GC 的区别？对象什么时候进入老年代？",
      a: "核心结论：Minor GC 收新生代，Major GC 收老年代，Full GC 收整个堆+方法区；Full GC 最慢最危险。\n触发与区别：\n1. Minor GC（Young GC）：Eden 满了触发，速度快、频繁。\n2. Major GC：老年代回收，CMS 有单独的 Major；很多资料里与 Full GC 混用，面试时说明语境即可。\n3. Full GC：整堆+方法区回收，STW 最长。常见触发：老年代空间不足、晋升失败担保（HandlePromotionFailure）、System.gc()、元空间不足、CMS 的 concurrent mode failure。\n对象进老年代的四种途径：\n① 年龄到了：对象每熬过一次 Minor GC 年龄+1，达到 -XX:MaxTenuringThreshold（默认 15）晋升；\n② 动态年龄判定：Survivor 中同年龄对象总和超过 Survivor 一半，年龄≥它的直接晋升；\n③ 大对象直接进老年代：-XX:PretenureSizeThreshold（Serial/ParNew 有效）；\n④ 分配担保：Minor GC 后 Survivor 放不下，多余对象直接进老年代。",
      point: "考察 GC 类型的边界界定、晋升四途径与 Full GC 触发的完整清单",
      approach: "先三句话定义 Minor/Major/Full，并主动指出 Major 与 Full 常混用需说明语境，显严谨；再列 Full GC 触发原因，然后讲进老年代四条途径，强调游戏服最怕 Full GC（STW 最长）。坑：别把 Major 和 Full 咬死为同一概念，别漏分配担保这条途径。",
      followups: [
        { q: "什么代码会导致 Full GC 频繁？你们游戏服遇到过吗？", a: "静态容器只增不减（在线 Map 不清理）、大对象频出直接进老年代、元空间不足（热更/动态代理泛滥）、堆配小、代码误调 System.gc()。游戏服最常见是玩家数据泄漏引发老年代打满。" },
        { q: "动态年龄判定规则具体怎么算？", a: "Minor GC 前把 Survivor 中对象按年龄从低到高累加大小，首次累计超过 Survivor 区一半时，该年龄及以上的对象全部直接晋升老年代，不必等到 MaxTenuringThreshold。" },
        { q: "为什么生产环境建议禁用 System.gc()（-XX:+DisableExplicitGC）？", a: "System.gc() 触发的是 Full GC，STW 长且时机不可控；框架或第三方库误调会造成周期性卡顿。加 -XX:+DisableExplicitGC 让其失效，GC 节奏完全交给 JVM 与参数控制。" }
      ],
      memory: "口诀：『Eden 满小扫，老满大扫，全不满全扫』；进老年代记『老（年龄）、大（大对象）、挤（担保）、超（动态年龄）』。",
      tags: ["GC类型", "晋升", "基础"]
    },
    {
      id: "jvm-06",
      level: 1,
      q: "HotSpot 有哪些经典垃圾收集器？CMS 和 G1 的核心区别是什么？",
      a: "核心结论：JDK8 默认 Parallel，低延迟选 CMS（已废弃）或 G1（JDK9+ 默认），超大堆/超低延迟选 ZGC/Shenandoah。\n经典组合（JDK8 时代）：\n- Serial/Serial Old：单线程，客户端模式或小应用。\n- ParNew + CMS：ParNew 是 Serial 多线程版，唯一能配合 CMS 的新生代。\n- Parallel Scavenge/Parallel Old：吞吐量优先，JDK8 默认，适合后台计算型任务。\n- CMS：老年代并发收集器，追求最短 STW，四阶段：初始标记(STW)→并发标记→重新标记(STW)→并发清除。缺点：CPU 敏感、浮动垃圾、标记-清除产生碎片（并发失败退化为 Serial Old 全停）。JDK14 已删除。\n- G1：把堆切成约 2048 个 Region，不再是物理分代而是逻辑分代；按回收价值（收益/成本）维护优先级列表，在 -XX:MaxGCPauseMillis（默认 200ms）预算内选回收价值最高的 Region 集合（CSet）。可预测的停顿模型是它与 CMS 的本质区别。\n- ZGC：JDK15 正式，TB 级堆 STW 控制在 1ms 内，基于染色指针+读屏障，适合对延迟极端敏感的大内存服务。",
      point: "考察收集器谱系与 CMS/G1 设计哲学差异，重点在可预测停顿模型",
      approach: "先按年代给谱系：Serial→Parallel→CMS→G1→ZGC，各自一句话定位；重点展开 CMS 四阶段与三大缺点、G1 的 Region 化与价值优先回收，点明本质区别是『可预测停顿』；结尾按堆大小和延迟要求给选型建议。坑：别忽略 CMS 已废弃、JDK14 删除的现状。",
      followups: [
        { q: "CMS 的 concurrent mode failure 是什么？触发后会发生什么？", a: "CMS 并发清除期间老年代被新对象填满，回收赶不上分配；触发后退化为 Serial Old 单线程 Full GC，STW 极长。对策：调低触发阈值、降分配速率、直接换 G1。" },
        { q: "G1 的 Region 里 Humongous 区存什么？大对象对 G1 有什么影响？", a: "存超过 Region 一半的大对象，占连续多个 Region 且直接算老年代；不走常规回收路径，易造成分配失败、evacuation failure 和 Full GC，应拆小、堆外化或调大 Region。" },
        { q: "你的游戏服现在线上用什么收集器？为什么这么选？", a: "示例答法：JDK8、8G 堆用 G1（MaxGCPauseMillis=100~200），因长连接玩家对卡顿敏感而吞吐可接受；堆更大或 JDK17+ 上 ZGC 把 STW 压到 1ms。围绕延迟要求和堆规模论证即可。" }
      ],
      memory: "口诀：『CMS 并发清碎，G1 分区可预期，ZGC 染色毫秒级』——各记一个关键词。",
      tags: ["GC收集器", "CMS", "G1", "基础"]
    },
    {
      id: "jvm-07",
      level: 1,
      q: "类加载的过程（加载、验证、准备、解析、初始化）各做什么？什么时候触发类的初始化？",
      a: "核心结论：类加载生命周期 = 加载→连接(验证/准备/解析)→初始化，连接三阶段可交叉进行。\n1. 加载：通过全限定名获取字节流，转成方法区运行时数据结构，生成 java.lang.Class 对象。\n2. 验证：保证字节流符合规范（文件格式、元数据、字节码、符号引用验证），保护 JVM。\n3. 准备：为静态变量分配内存并设零值（static int a=1 此时是 0）；static final 常量此时直接赋真值。\n4. 解析：符号引用转直接引用（可在初始化后做，支持动态绑定）。\n5. 初始化：执行 <clinit>()，即静态变量赋值和静态代码块，按代码顺序合并执行；JVM 保证 <clinit> 线程安全（这正是静态内部类单例的原理）。\n主动使用（触发初始化）：new/读写静态字段/调用静态方法、反射 Class.forName、初始化子类时父类先初始化、含 main 的启动类、MethodHandle 解析结果对应的类。\n被动引用不触发：通过子类引用父类静态字段、引用类的常量（常量已在编译期入调用方常量池）、定义类的数组。",
      point: "考察类加载五阶段的准确语义，尤其准备与初始化的赋值差异和初始化时机",
      approach: "先背生命周期主线，重点讲清准备阶段赋零值（static final 常量例外）与初始化执行 clinit 的区别，再列主动使用清单和三种被动引用反例；点出 clinit 线程安全是静态内部类单例的原理，展示深度。坑：别把解析说成必须在初始化前完成。",
      followups: [
        { q: "静态内部类单例为什么既线程安全又懒加载？", a: "内部类的 clinit 由 JVM 加锁保证只执行一次（线程安全）；只有首次调用 getInstance 访问内部类才触发其加载与初始化（懒加载），无显式同步开销，是兼顾两者的标准写法。" },
        { q: "准备阶段和初始化阶段对 static 变量的赋值有什么区别？", a: "准备阶段 static 变量只赋零值（int 为 0），static final 常量在编译期确定、此时直接赋真值；初始化阶段执行 clinit，static 变量才赋代码里写的真值。" },
        { q: "你们的热更新/导表工具涉及类加载吗？怎么做的？", a: "热更新用自定义 ClassLoader 加载新版类字节码，旧 ClassLoader 整体丢弃、等新对象创建即切换；导表工具若用脚本引擎或动态生成类同样涉及。注意旧 ClassLoader 必须全无引用才能卸载元空间。" }
      ],
      memory: "口诀：『家（加）宴（验）备（准备）席（析）始』——加载、验证、准备、解析、初始化；准备给零值，初始化给真值。",
      tags: ["类加载", "基础"]
    },
    {
      id: "jvm-08",
      level: 1,
      q: "什么是双亲委派模型？三层类加载器分别加载什么？怎么打破双亲委派？",
      a: "核心结论：加载请求先一路委派给父加载器，父加载不了才自己加载——保证核心类唯一、安全。\n三层结构：\n1. BootstrapClassLoader（C++实现）：加载 JAVA_HOME/lib 下核心类（rt.jar，java.*）。\n2. ExtClassLoader：加载 ext 目录扩展类（JDK9+ 改为 PlatformClassLoader）。\n3. AppClassLoader：加载 classpath 下的应用类，我们自己的代码。\n工作流程：收到请求先查缓存→委托父类→父类不行再自己 findClass。好处：①避免重复加载②防止用户伪造 java.lang.Object 等核心类造成混乱。\n打破双亲委派的典型场景：\n- SPI 机制（JDBC/Dubbo）：BootStrap 加载的接口要调应用类，用线程上下文类加载器（TCCL）反向加载；\n- Tomcat：每个 WebApp 用自己的 WebappClassLoader 优先加载本应用类，实现应用间隔离；\n- 热部署/热更新：游戏服热更常用自定义 ClassLoader 重新加载新版本的类（旧 ClassLoader 整个丢弃，等新对象创建即切换）；\n- OSGi：网状委派模型。",
      point: "考察双亲委派机制、设计目的与打破场景，热更新是游戏服的加分点",
      approach: "先一句话讲清委派流程与两大好处（唯一性、安全性），再列三层加载器职责；打破部分按 SPI/Tomcat/热更三个经典场景展开，游戏服重点讲热更换 ClassLoader 的方案。坑：别只背概念说不出打破场景，别在 JDK9+ 语境还死抠 ExtClassLoader 名字。",
      followups: [
        { q: "自定义 ClassLoader 打破双亲委派要重写 loadClass 还是 findClass？区别？", a: "遵守委派重写 findClass：loadClass 的委派流程保留，父加载不了才回调 findClass；要打破委派才重写 loadClass，直接改变『先找爹』的流程，Tomcat 的 WebappClassLoader 就是这么做的。" },
        { q: "游戏服热更新为什么不能用 AppClassLoader 直接重新加载？内存上有什么坑（旧类元空间泄漏）？", a: "已加载的类不能原地更新字节码，同一 ClassLoader 不允许重复加载同名类，必须换新的。坑：旧 ClassLoader 只要还有一个实例被引用就卸不掉，热更多次即 Metaspace OOM。" },
        { q: "同一个类被两个不同 ClassLoader 加载，instanceof 结果是什么？", a: "false。JVM 判定类唯一性 = 全限定名 + 类加载器，两个加载器加载的同名类互为不同类型，instanceof 为 false，强转抛 ClassCastException——这正是应用隔离与热更生效的底层依据。" }
      ],
      memory: "口诀：『有事找爹，爹不行儿子上』；打破记三个场景：『SPI 反调、Tomcat 隔离、热更换爹』。",
      tags: ["双亲委派", "ClassLoader", "基础"]
    },
    {
      id: "jvm-09",
      level: 1,
      q: "线上游戏服启动，你会配置哪些核心 JVM 参数？说一套你常用的配置并解释含义。",
      a: "核心结论：堆、新生代、GC 器、GC 日志、OOM dump 五大类缺一不可，游戏服强调 -Xms=-Xmx 避免动态扩缩容停顿。\n以 8C16G 游戏服（G1）为例：\n-Xms8g -Xmx8g                    # 堆固定，防止运行时扩容引起抖动\n-XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m\n-XX:+UseG1GC -XX:MaxGCPauseMillis=100   # 游戏服延迟敏感，目标停顿 100ms\n-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/logs/heapdump.hprof\n-Xloggc:/logs/gc.log -XX:+PrintGCDetails -XX:+PrintGCDateStamps（JDK8；JDK9+ 用 -Xlog:gc*:file=gc.log:time）\n-XX:ErrorFile=/logs/hs_err_pid%p.log    # JVM 崩溃日志\n-XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=50m  # 日志滚动\n其他常用：\n- -XX:MaxDirectMemorySize=4g：Netty 游戏服必须显式设置，防止直接内存失控；\n- -XX:+DisableExplicitGC：防止框架里有人调 System.gc()；\n- -Xss512k：线程栈大小，线程多时可调小省内存；\n- -XX:CICompilerCount、-XX:ReservedCodeCacheSize：JIT 相关一般不动；\n- 容器环境：-XX:+UseContainerSupport（JDK8u191+）或 -XX:MaxRAMPercentage。",
      point: "考察参数配置实战：五大类齐备、含义讲清、每个取舍能说出理由",
      approach: "按『堆、GC 器、日志、Dump、直接内存』五件套组织答案，每个参数给值并解释为什么（如 -Xms=-Xmx 防扩缩容抖动），再补容器感知和 DisableExplicitGC 等加分项，结尾主动说这套配置上线后如何验证效果。坑：别只列参数不解释，别漏 Netty 直接内存上限。",
      followups: [
        { q: "为什么 -Xms 和 -Xmx 要设置成一样大？", a: "防止堆运行中动态扩缩容：扩容要申请内存并搬迁对象引发停顿，缩容触发额外 GC；固定大小让堆行为可预期，也避免和容器内存管理互相打架。" },
        { q: "MetaspaceSize 不设置会发生什么？为什么建议显式设置？", a: "默认约 21M，超过即触发 Full GC 并调整水位；启动期类加载多会连续 Full GC 造成启动抖动。显式设为稳定值（如 256m）可消除启动期无谓的 Full GC。" },
        { q: "游戏服用 Netty，直接内存参数为什么必须设？不设的默认值是多少？", a: "默认上限等于 -Xmx：堆 8G 则堆外也可能吃 8G，合计超物理内存会被 OOM Killer 无声杀进程。必须显式 -XX:MaxDirectMemorySize，并纳入总内存预算。" }
      ],
      memory: "口诀：『堆等大、GC 定、日志开、Dump 备、直存限』——五件套背下来就能答任何参数题。",
      tags: ["JVM参数", "G1", "基础"]
    },
    {
      id: "jvm-10",
      level: 2,
      q: "【结合游戏服】你们的游戏服是长连接服务，几万玩家常驻在线。这种场景下堆内存有什么特点？你会怎么调优？",
      a: "核心结论：长连接游戏服是『老年代重』型应用——在线玩家数据、配置表、缓存长期存活，调优方向是扩大新生代+控制晋升节奏+选用可预测停顿的收集器。\n内存画像：\n1. 常驻部分：玩家对象（背包/属性/任务）、策划配置表（导表工具生成）、协议模板、连接会话——这些是 GC Roots 可达的长寿对象，老年代水位天然偏高。\n2. 瞬态部分：战斗结算临时对象、协议编解码 buffer、日志事件——朝生夕灭，理想情况全死在 Eden。\n调优手段：\n1. 增大新生代占比：让临时对象在 Minor GC 就死掉，减少晋升。Parallel 用 -XX:NewRatio 或直接 -Xmn；G1 默认动态调整，可用 -XX:G1NewSizePercent/G1MaxNewSizePercent 控制区间。\n2. 提高晋升门槛：-XX:MaxTenuringThreshold 适度调大（如 8~15），让对象多熬几轮再决定，避免误晋升；但 Survivor 要够大，否则触发分配担保反而提前晋升——jstat -gcutil 观察 O（老年代使用率）增长斜率验证。\n3. 收集器选择：JDK8 堆 ≤8G 可用 G1（MaxGCPauseMillis=100~200）；堆更大且 JDK11+ 考虑 ZGC/Shenandoah，STW 压到 10ms 内，玩家无感知。\n4. 大对象管控：战斗录像、批量日志等超大数组避免直接进老年代/成为 G1 Humongous 对象。\n5. 玩家下线清理：session 断开必须从在线 Map、定时器、事件监听里移除引用，否则老年代只涨不跌（真实线上事故高发点）。",
      point: "考察长连接应用的内存画像分析力与调优方法论：常驻重、瞬态快的双层结构",
      approach: "先定性『老年代重型应用』，分常驻/瞬态两部分画内存画像；调优按新生代占比、晋升门槛、收集器选型、大对象管控、下线清理五条线展开，每条给可观测的验证手段（jstat 看 O 斜率）。坑：别只谈参数不谈业务引用清理，那才是真实事故源。",
      followups: [
        { q: "怎么通过 GC 日志判断晋升速度过快？会看什么指标？", a: "看每次 Young GC 后老年代占用增量：日志里 Heap 回收后值持续抬升即晋升过猛；jstat 看 OU 增长斜率；配合 Survivor 使用率长期打满或年龄分布异常（PrintTenuringDistribution）佐证。" },
        { q: "老年代水位持续缓涨、Full GC 后只能回收一部分，说明什么？怎么定位？", a: "典型内存泄漏：回收后水位逐次抬高，说明有 GC Roots 拽住的对象在持续累积。定位：摘流后 jmap dump，MAT 支配树找大户，Path to GC Roots 排除软弱引用找强引用链。" },
        { q: "如果让你验证调优效果，你会对比调优前后的哪些数据？", a: "YGC 频率与单次耗时、FGC 次数（目标趋零）、晋升速率、老年代水位曲线斜率、业务 P99 延迟与玩家卡顿上报率。同场景同流量压测对比，排除环境差异干扰。" }
      ],
      memory: "类比：游戏服像网吧——常驻玩家是包夜客人（老年代），战斗临时对象是过客（Eden），调优就是让过客在大厅结账走人，别占用包间。",
      tags: ["游戏服", "调优", "长连接", "晋升"]
    },
    {
      id: "jvm-11",
      level: 2,
      q: "【结合游戏服】战斗服每帧/每个技能结算会创建大量临时对象（伤害事件、BUFF 快照、坐标对象等），这对 GC 有什么影响？怎么优化？",
      a: "核心结论：高频短生命周期对象会拉高分配速率和 Minor GC 频率，极端情况引发过早晋升甚至 Full GC；优化核心思路是『减少分配』而非『加快回收』。\n影响链路：分配速率高 → Eden 快速填满 → Minor GC 频繁 → STW 次数多（每次几 ms~几十 ms，玩家表现为偶发卡顿）→ 分配高峰期 Survivor 放不下触发分配担保 → 临时对象被挤进老年代 → 老年代加速填满 → Full GC。\n优化手段（按性价比排序）：\n1. 对象池/复用：伤害事件、战斗消息等用对象池（自研环形池或 Netty Recycler），Disruptor 的 RingBuffer 预分配事件对象反复复用就是教科书级案例——事件槽位固定，生产者只填充数据，零分配。\n2. 用基本类型替代包装类：int 代替 Integer，避免自动装箱；集合用 fastutil/Trove 等原始类型集合。\n3. 减少临时数组/字符串：协议拼接用 ByteBuf/StringBuilder 复用，避免 String 拼接产生中间对象。\n4. 栈上分配红利：JVM 逃逸分析会自动把不逃逸的小对象拆散标量替换到栈上分配，不写代码就能受益——保持方法小、对象作用域局部。\n5. 堆外化：大 buffer 用 Netty 直接内存池（PooledByteBufAllocator），不进堆。",
      point: "考察高分配速率场景的 GC 影响链路与『减分配优于快回收』的优化思维",
      approach: "先画影响链路：分配快→Minor 频繁→担保晋升→Full GC；再按性价比给优化清单，Disruptor RingBuffer 零分配作为招牌案例详讲（正是候选人的技术栈），对象池、基本类型、逃逸分析红利依次跟上。坑：别上来就说调 GC 参数，本题核心是减少分配。",
      followups: [
        { q: "你们项目里 Disruptor 具体解决了什么问题？RingBuffer 为什么是零 GC 压力？", a: "解决高吞吐低延迟的事件分发（日志、跨线程消息）。RingBuffer 启动时预分配固定数量事件槽位，生产者只覆写槽内数据不新建对象，槽位随环无限复用，全程零分配、零 GC 压力。" },
        { q: "逃逸分析的三个优化（栈上分配、标量替换、锁消除）分别是什么？怎么验证生效了？", a: "不逃逸对象被标量替换拆成局部变量（栈上分配的本质）；锁对象不线程逃逸则消除加解锁；内联扩大分析范围。验证：JMH 对比 -XX:±DoEscapeAnalysis 的耗时与 GC 次数变化。" },
        { q: "怎么度量你们战斗服的分配速率？分配速率多少算危险？", a: "GC 日志相邻两次 Young GC 的 Eden 容量除以间隔时间即得；或用 JFR 分配采样、async-profiler 的 alloc 火焰图。危险线：上 GB/s 或 Minor GC 每秒多次。" }
      ],
      memory: "口诀：『战斗对象朝生夕灭，思路不是勤倒垃圾而是少制造垃圾』——对象池、基本类型、复用 buffer、蹭逃逸分析红利。",
      tags: ["游戏服", "Disruptor", "对象池", "GC优化"]
    },
    {
      id: "jvm-12",
      level: 2,
      q: "什么是逃逸分析？栈上分配和标量替换是怎么回事？写代码时怎么利用它？",
      a: "核心结论：JIT 通过逃逸分析判断对象作用域，不逃逸的对象可以栈上分配甚至标量替换，直接不进堆、零 GC 压力。\n1. 逃逸分析（JDK7+ 默认开启 -XX:+DoEscapeAnalysis）：分析对象动态作用域——方法逃逸（被返回值带出、传给其他方法）、线程逃逸（赋值给可被其他线程访问的变量，如成员变量、静态变量）。\n2. 标量替换：对象完全不逃逸时，JVM 不创建对象，直接把它的成员字段拆成若干局部变量（标量）放在栈帧/寄存器里——这才是真正的『栈上分配』实现方式，对象本身并未真的搬到栈上。\n3. 锁消除：同步锁对象不线程逃逸（如方法内 new 的 StringBuffer 调用同步方法），JIT 直接去掉锁。\n编码启示（游戏服战斗代码很受益）：\n- 临时计算对象作用域限制在方法内，不塞进字段/集合/返回值；\n- 方法保持小且可被内联（-XX:MaxInlineSize），逃逸分析在方法内联后进行，内联越充分分析越准；\n- 验证手段：-XX:+PrintEscapeAnalysis（需 debug JVM）、或用 JMH 对比、观察 GC 次数变化；关闭对比 -XX:-DoEscapeAnalysis。\n注意：C2 编译才生效，解释执行/C1 阶段对象照常进堆，热代码（战斗结算循环）才能获得红利。",
      point: "考察逃逸分析的真实机制：标量替换才是『栈上分配』的真相及生效条件",
      approach: "先纠正常见误区：对象并没有真的挪到栈上，真相是标量替换；再讲方法逃逸/线程逃逸的判定和三大优化；编码建议落到游戏服热路径写法（作用域局部、方法小利于内联）；最后提醒只有 C2 热代码才生效。坑：别把栈上分配按字面意思大讲特讲。",
      followups: [
        { q: "对象真的会被分配到栈上吗？还是只是标量替换？", a: "HotSpot 并未把对象整体搬到栈上；实际是标量替换——对象字段拆成局部标量进栈帧/寄存器，对象本体根本不创建。『栈上分配』只是对这个效果的通俗叫法。" },
        { q: "逃逸分析什么时候失效？举个游戏服里容易破坏逃逸的写法。", a: "对象被存进成员字段/静态集合/被返回值带出、传给未内联的方法、方法太大无法内联，都会失效。典型：把临时结算对象塞进战斗上下文 Map 缓存复用，立刻线程逃逸。" },
        { q: "锁消除和你们用的 synchronized 优化有什么关系？", a: "锁消除是逃逸分析的红利之一：同步锁对象不线程逃逸（如方法内 new 的 StringBuffer 调同步方法），JIT 直接去掉加解锁指令。它与 synchronized 锁升级是正交的两层优化，一个在编译期一个在运行期。" }
      ],
      memory: "口诀：『不逃逸就拆散，能拆散就不堆，锁不逃就消除』——对象像快递，没人签收（不逃逸）就不打包（不创建）。",
      tags: ["逃逸分析", "JIT", "标量替换"]
    },
    {
      id: "jvm-13",
      level: 2,
      q: "G1 的 Region、Remembered Set 和 mixed GC 是怎么回事？G1 如何做到『可预测的停顿』？",
      a: "核心结论：G1 把堆均分为约 2048 个 Region，按回收价值排序，在停顿时间预算内挑『性价比最高』的 Region 集合回收。\n1. Region：堆不再物理连续分代，每个 Region 逻辑扮演 Eden/Survivor/Old；超过 Region 一半的对象为大对象，存 Humongous Region（多个连续 Region），大对象在 G1 中是 Full GC 的导火索，要尽量避免。\n2. RSet（Remembered Set）：每个 Region 记录『哪些外部 Region 引用了我』，收某个 Region 时不必扫描全堆找引用来源；代价是写屏障维护卡表/RSet 的额外开销（约 10%~20% 运行时开销）。\n3. Young GC：全量收 Eden+Survivor，STW。\n4. Mixed GC：老年代占比超 -XX:InitiatingHeapOccupancyPercent（默认 45%）触发并发标记周期，之后分批做若干次 Young+部分老年代的混合回收——这是 G1 收老年代的方式，『混着收、慢慢收』。\n5. 可预测停顿：-XX:MaxGCPauseMillis 是软目标，G1 建立停顿预测模型，根据历史回收成本估算每个 Region 回收耗时与收益，在预算内选 CSet。\n6. Full GC（兜底）：并发标记来不及（Evacuation Failure/晋升失败）→ JDK10 前单线程 Serial Old 全堆整理，JDK10+ 并行——游戏服要极力避免，手段：降分配速率、预留更多空间（调低 IHOP）、控制大对象。",
      point: "考察 G1 三大核心机制与停顿预测模型原理，区分于 CMS 的关键差异",
      approach: "按 Region 分区→RSet 记账→Young/Mixed 回收流程→停顿预测模型一条线讲下来，Humongous 与 Full GC 兜底作为风险点收尾；强调『软实时目标+CSet 价值排序』是 G1 的灵魂。坑：别漏 RSet 的写屏障代价，别把 mixed GC 说成回收全部老年代。",
      followups: [
        { q: "G1 和 CMS 都可能 Full GC，触发原因和后果有什么区别？", a: "CMS 因 concurrent mode failure 或碎片触发，退化 Serial Old 单线程；G1 因 evacuation failure 或标记跟不上，JDK10 前单线程、之后并行。G1 可调低 IHOP、控大对象预防。" },
        { q: "IHOP 调低有什么好处和代价？", a: "好处：并发标记更早启动，老年代不会顶满才标记，降低 Full GC 风险。代价：标记周期更频繁，CPU 与写屏障开销增加。一般在 35~45 之间按分配速率权衡。" },
        { q: "为什么说 G1 在 8G 以下小堆不一定比 Parallel 好？什么场景必须上 G1/ZGC？", a: "G1 的 Region/RSet/写屏障有固定开销（10%+），小堆下吞吐不如 Parallel，低延迟优势也体现不出。必须上 G1/ZGC 的场景：堆大、STW 预算 200ms 内、在线服务对卡顿零容忍。" }
      ],
      memory: "口诀：『分格子、记小账（RSet）、挑肥的收（价值优先）、预算内办事（停顿模型）』——G1 像外卖骑手按路线价值接单，而不是扫完整条街。",
      tags: ["G1", "Region", "RSet"]
    },
    {
      id: "jvm-14",
      level: 2,
      q: "ZGC 的核心原理（染色指针+读屏障）是什么？为什么它能把 STW 压到 1ms 以内？游戏服值得上 ZGC 吗？",
      a: "核心结论：ZGC 把 GC 元信息存在指针里而非对象头，配合读屏障让标记和转移几乎全程并发，STW 只与 GC Roots 数量相关、与堆大小无关。\n1. 染色指针（Colored Pointers）：利用 64 位指针中未使用的高位存 Marked0/Marked1/Remapped 等标志位，对象生死状态跟着指针走，转移对象后不改老对象头。\n2. 读屏障：应用线程每次读引用时检查指针颜色，发现指向已转移的旧地址就自愈（自我修正指向新地址并更新引用）——这是并发转移的关键，对象移动和业务运行同时进行，无需长时间 STW。\n3. 多重映射：同一物理内存映射到多个虚拟地址视图，转移过程地址切换对应用透明。\n4. 停顿来源：仅初始标记、再标记、初始转移三个 STW 点，都是毫秒/亚毫秒级，官方宣称 ≤1ms（JDK16 后甚至 ≤100μs），TB 级堆也成立。\n游戏服值不值得上：\n- 值得：堆 ≥16G、在线人数多、对卡顿（STW）零容忍的 MMORPG 战斗服；JDK17+ ZGC 已很成熟（JDK21 还有分代 ZGC，进一步降低开销）。\n- 注意点：ZGC 吞吐略低于 G1（约 5%~15% 开销，分代 ZGC 后差距缩小）；需要更多内存余量应对浮动垃圾；JDK8 没有 ZGC，要上就得升级 JDK。\n- 对比选择：堆 <8G 且延迟要求 100ms 级 → G1 够用；堆大且要求 10ms 内 → ZGC。",
      point: "考察 ZGC 染色指针与读屏障原理，及 STW 与堆大小解耦的本质理解",
      approach: "先给结论：元信息进指针+读屏障自愈=并发转移；按染色指针、读屏障、多重映射三步讲机制，点出三个 STW 点只与 Roots 相关；最后给游戏服选型判断（堆大、延迟敏感、JDK17+ 值得上）并提吞吐折损。坑：别忘提分代 ZGC 的演进和 JDK 版本门槛。",
      followups: [
        { q: "读屏障和写屏障分别解决什么问题？开销谁大？", a: "读屏障在读引用时检查/自愈指针颜色，支撑并发转移（ZGC）；写屏障在写引用时记录变化，支撑并发标记正确性（SATB）与 RSet 维护。读路径远多于写，ZGC 把读屏障优化到几条指令。" },
        { q: "ZGC 的 STW 为什么与堆大小无关？那与什么有关？", a: "三个 STW 点只做 GC Roots 扫描与少量簿记，不遍历堆；标记和转移全并发。STW 时长与 Roots 数量（线程栈规模）相关，堆再大 Roots 不涨，所以 TB 级堆也能 1ms。" },
        { q: "JDK21 的分代 ZGC 解决了原 ZGC 什么问题？", a: "原 ZGC 不分代，所有对象同等扫描转移，CPU 开销大、浮动垃圾多。分代 ZGC 双代各用染色指针，新生代高频快收，吞吐接近 G1，CPU 开销与堆余量需求显著下降。" }
      ],
      memory: "类比：ZGC 像给每个快递包裹贴 GPS（染色指针），收件人取件时自己纠正地址（读屏障自愈），搬家不用停业；传统 GC 是停业盘点。",
      tags: ["ZGC", "染色指针", "读屏障", "低延迟"]
    },
    {
      id: "jvm-15",
      level: 2,
      q: "【结合项目】线上游戏服突然频繁 Full GC 甚至 OOM，你的完整排查流程是什么？",
      a: "核心结论：先止血保命（摘流量/重启+保留 dump），再定位根因（dump 分析找大户），最后修复验证——顺序不能乱。\n第一步 止血与取证（分钟级）：\n1. 把问题实例从负载/网关摘流（保留一台做现场）；\n2. 现场取证：jmap -dump:format=b,file=heap.hprof <pid>（大堆用 jmap -dump:live 或 Arthas heapdump，注意 dump 会 STW，务必在摘流实例上做）；保存 GC 日志、hs_err 日志；\n3. 重启恢复服务。\n第二步 定位大户：\n1. MAT/JProfiler 打开 dump，看 Dominator Tree（支配树）：哪个对象保留堆最大；\n2. 典型嫌疑人：\n   - 在线玩家 Map 只增不减（下线没清理）→ 游戏服最常见；\n   - 本地缓存无上限（Guava Cache 没设 maximumSize/expire）；\n   - 静态集合/单例里累积数据（日志缓冲队列、未消费的 Disruptor 积压）；\n   - ClassLoader 泄漏（热更新反复加载旧类没释放，元空间涨）；\n   - ThreadLocal 在线程池里没 remove；\n3. Path to GC Roots：排除软/弱引用看强引用链，确认『谁拽着它不放』。\n第三步 确认类型：\n- java.lang.OutOfMemoryError: Java heap space → 堆；\n- Metaspace → 类加载太多（热更/动态代理）；\n- Direct buffer memory → Netty 直接内存，用 NMT（-XX:NativeMemoryTracking）或检查 ByteBuf 是否 release；\n- unable to create native thread → 线程太多，查线程数与 ulimit。\n第四步 修复与验证：修代码→灰度→盯 jstat/GC 日志一周，对比老年代增长曲线是否拉平。",
      point: "考察线上事故处置章法：止血、取证、定位、修复的顺序与工具链熟练度",
      approach: "按时间线答：先摘流保留现场并 dump，再重启恢复；然后 MAT 支配树找大户、Path to GC Roots 找黑手，列举游戏服五类典型嫌疑人；按 OOM 报错类型分诊；最后修复灰度并盯一周曲线验证。强调顺序不能乱、dump 会 STW 必须在摘流实例上做。坑：别一上来就重启丢现场。",
      followups: [
        { q: "OOM 时 -XX:+HeapDumpOnOutOfMemoryError 已经 dump 了，为什么还要手动再 dump 一份？", a: "自动 dump 在 OOM 那一刻触发，现场可能已乱（部分对象已回收）；摘流后趁服务活着手动 dump 能拿到更完整的引用链，两份对比还能看出对象增长轨迹。" },
        { q: "MAT 里 Shallow Heap 和 Retained Heap 的区别？排查看哪个？", a: "Shallow 是对象自身大小；Retained 是回收该对象后能连带释放的总大小。排查看 Retained——支配树按 Retained 排序，才能找到真正拽住内存的大户而非表面大对象。" },
        { q: "你们热更新导致过 Metaspace OOM 吗？旧 ClassLoader 为什么回收不掉？", a: "类卸载需三条件同时满足，只要一个旧实例被静态容器/线程持有，旧 ClassLoader 及其全部类元数据都活着。dump 里数自定义 ClassLoader 存活实例，多于 2 个即泄漏实锤。" }
      ],
      memory: "口诀：『先摘流、再取证、后重启；dump 找大户、Roots 找黑手、日志定类型』——像破案：保护现场→找赃物→找赃主。",
      tags: ["OOM", "游戏服", "排查", "MAT"]
    },
    {
      id: "jvm-16",
      level: 2,
      q: "【结合项目】玩家反馈游戏间歇性卡顿，你怀疑是死锁或线程问题。如何用 jstack 定位？dump 里重点看什么？",
      a: "核心结论：连续抓 3 次 jstack（间隔 5~10 秒），对比找出『一直 BLOCKED/死锁/原地不动』的线程；jstack 自带死锁检测是最直接的证据。\n操作流程：\n1. top 找到 Java 进程 → top -Hp <pid> 找到 CPU 最高的线程（卡顿也可能是个别线程忙等）→ 线程号转 16 进制（printf %x）→ jstack <pid> 里搜 nid=0x<hex> 定位栈。\n2. 卡顿类问题连抓 3 份 jstack 对比：\n   - 死锁：jstack 输出末尾直接报 Found one Java-level deadlock，列出互相持有的锁和等待链；\n   - 锁竞争：大量线程 BLOCKED 在同一个 monitor（如 - locked <0x0000...> 出现在同一线程，其余 waiting to lock），说明有热点锁——游戏服常见的是全局玩家表加粗粒度 synchronized；\n   - 假死：线程全 TIMED_WAITING/RUNNABLE 但业务不动 → 可能是连接池/线程池耗尽（如 DB 连接池打满，所有业务线程等在 getConnection）；\n   - GC 卡顿：VM thread/ GC task thread 活跃 + safepoint 相关输出，配合 GC 日志确认是 STW 导致。\n3. 游戏服典型死锁场景：玩家 A 锁自己调玩家 B 的方法、B 同时锁自己调 A——按固定顺序加锁（如按玩家 id 排序）可根治。\n4. 进阶：Arthas thread -b 一键找阻塞其他线程最多的线程；thread --state BLOCKED 直接过滤。",
      point: "考察线程问题定位套路：三连抓对比法与 dump 关键信息的判读能力",
      approach: "先给方法论：CPU 飙高走 top -Hp 定位 nid，卡顿走 jstack 三连抓对比；再按死锁、锁竞争、线程池耗尽、GC 四种典型结果分别讲判读特征；游戏服互调死锁场景和按 id 排序加锁的解法是项目加分点，Arthas 收尾。坑：别只抓一次 jstack 就下结论。",
      followups: [
        { q: "jstack 里 WAITING、TIMED_WAITING、BLOCKED 的区别？", a: "BLOCKED 等 monitor 锁（synchronized 入口被占）；WAITING 无限期等唤醒（wait/park）；TIMED_WAITING 限时等待。BLOCKED 指向锁竞争，后两者多为资源等待或挂起。" },
        { q: "怎么用 Arthas 不死锁重启地定位线上卡死？watch/tt 命令用过吗？", a: "attach 后 thread -b 直接找阻塞别人最多的元凶线程，thread --state BLOCKED 过滤；watch 观察方法入参返回，tt 记录方法调用时空隧道可重放。全程不改代码不重启，用完 stop 完整卸载。" },
        { q: "游戏服里两个玩家互相交易时怎么设计加锁顺序避免死锁？", a: "对双方玩家 id 排序，永远先锁小 id 再锁大 id，保证全局一致的加锁顺序，破除死锁四要素中的循环等待；也可用 tryLock 加超时兜底，超时释放重试。" }
      ],
      memory: "口诀：『三次连拍找钉子户，死锁末尾直接点名』——jstack 三连抓，不动的线程就是凶手；游戏服死锁记『按 id 排序加锁』。",
      tags: ["jstack", "死锁", "游戏服", "Arthas"]
    },
    {
      id: "jvm-17",
      level: 2,
      q: "jstat、jmap、jstack、jcmd、Arthas 各自擅长什么？给你一个线上游戏服，你会怎么用这套工具链？",
      a: "核心结论：jstat 看 GC 趋势、jmap 抓内存快照、jstack 抓线程快照、jcmd 是瑞士军刀、Arthas 是在线诊断全家桶——趋势用 jstat 盯，快照用 jmap/jstack 抓，动态追踪用 Arthas。\n分工：\n1. jstat -gcutil <pid> 1000（每秒一次）：看 S0/S1/E/O/M 使用率、YGC/YGCT、FGC/FGCT——判断 GC 健康度的第一入口。游戏服重点关注：O（老年代）增长斜率、FGC 次数、YGCT/YGC 平均单次 Minor 耗时。\n2. jmap：-histo 看对象直方图（快速找大户，慎用会 STW）；-dump 导出堆快照给 MAT 分析。\n3. jstack：线程快照，定位死锁、锁竞争、CPU 飙高线程。\n4. jcmd：JDK7+ 综合命令，VM.flags 看实际生效参数、GC.heap_dump、VM.native_memory（NMT 查堆外内存，Netty 直接内存问题靠它）、Thread.print。\n5. Arthas（阿里开源，线上诊断神器）：\n   - dashboard/thread -b：总览与找最阻塞线程；\n   - jad 反编译：确认线上跑的到底是不是你以为的版本（热更新后特别好用）；\n   - watch/trace：不改代码观察方法入参返回与耗时——查某个协议处理慢的神器；\n   - heapdump + ognl：导堆、执行表达式查静态变量（如直接看在线玩家 Map size）；\n   - 优势：attach 式、无需重启、用完全量卸载，对游戏服这种不能随意重启的服务至关重要。\n注意：jmap/jstack 会触发 STW，高峰期的主用实例上慎用，先摘流量。",
      point: "考察诊断工具链的分工认知与按场景选工具的实战思路",
      approach: "先一句话给五工具分工总纲（趋势/快照/追踪），再逐个讲核心命令和关键观察列（jstat 的 O 与 FGC、jcmd 的 NMT），Arthas 重点展开 jad/watch 价值；最后强调 jmap/jstack 有 STW 风险要先摘流。坑：别列成干清单，要按问题场景组织。",
      followups: [
        { q: "jstat 的 FGC 列突然 +1，同时 O 没怎么降，说明什么？", a: "这次 Full GC 没回收多少——老年代对象大多真活着，疑似内存泄漏（被 GC Roots 拽住）。应安排摘流 dump，MAT 看支配树确认大户与引用链。" },
        { q: "Arthas 的 watch 和 trace 原理是什么？对线上性能有影响吗？", a: "基于字节码增强（retransform）在方法出入口织入回调，观察入参/返回/耗时。有开销，生产用要限定类和方法、加耗时条件过滤，排查完立即 reset 还原字节码。" },
        { q: "不用任何工具，怎么从 GC 日志手工算出晋升速率和 Minor GC 频率？", a: "晋升速率：相邻两次 Young GC 日志的 Heap 回收后值相减除以间隔时间；Minor GC 频率=相邻 Young GC 时间戳之差。高峰平峰各取几组对比，比单点值可靠。" }
      ],
      memory: "口诀：『stat 看势，map 看堆，stack 看线，cmd 全能，Arthas 在线手术』——五件工具对应五种病情。",
      tags: ["诊断工具", "Arthas", "jstat"]
    },
    {
      id: "jvm-18",
      level: 2,
      q: "GC 日志怎么看？以 G1 日志为例，关键字段有哪些？怎么从日志判断游戏服的 GC 是否健康？",
      a: "核心结论：看 GC 日志抓三个指标——频率、单次耗时、回收后水位；游戏服的健康标准是 Minor GC 频率低且单次 <50ms、几乎无 Full GC、老年代水位长期平稳。\nG1 日志关键字段（JDK8 格式）：\n- [GC pause (G1 Evacuation Pause) (young), 0.0234567 secs]：Young GC，耗时 23ms；\n- [Eden: 4096.0M(4096.0M)->0.0B(3928.0M) Survivors: ... Heap: 5200.0M(8192.0M)->1150.0M(8192.0M)]：回收前->回收后（总量），Eden 清 0、Heap 从 5.2G 降到 1.15G 说明大部分是垃圾，健康；\n- [Times: user=0.08 sys=0.01, real=0.02 secs]：real 是真实 STW 时间；user >> real 说明并行充分，real 接近 user 说明可能 CPU 不足或 IO 等待；\n- concurrent-mark-start / mixed 字样：并发标记周期与 mixed GC；\n- Full GC (Allocation Failure)：G1 的 Full GC，出现即告警，游戏服必须查原因；\n- to-space exhausted / evacuation failure：Survivor/老年代放不下要疏散的对象，G1 退化信号。\n健康判断清单：\n1. Minor GC 单次 real < 50ms，频率与业务节奏匹配（战斗高峰期 1~2 秒一次可接受）；\n2. 老年代回收后水位长期水平线，不爬坡（爬坡=泄漏）；\n3. 无 Full GC、无 evacuation failure；\n4. 晋升速率低：可用多次日志对比『Young GC 后堆余量增长』估算。\n工具：GCeasy、gceasy.io 在线分析，或 -Xlog:gc*（JDK9+）配 ELK 收集。",
      point: "考察 GC 日志判读能力：抓频率、耗时、水位三指标形成健康判断",
      approach: "先给三指标框架，再以 G1 日志为例逐字段拆解（Evacuation Pause、Heap 前后值、Times 的 real），列出 Full GC 与 evacuation failure 两个红灯字样；最后给健康清单四条和工具建议。坑：别只会看有没有 Full GC，要能解读回收前后数值。",
      followups: [
        { q: "日志里 real 时间远大于 user+sys 可能是什么原因？", a: "CPU 不够（核数少或容器 throttle，GC 线程排队等调度）、日志写盘 IO 阻塞、swap 换页。游戏服容器环境优先查 cpu.throttled 和 swappiness 配置。" },
        { q: "evacuation failure 说明什么？怎么解决？", a: "疏散时目标区（Survivor/老年代）放不下存活对象，G1 只能把对象留原地，回收收益大减，是堆不足或晋升过猛的信号。对策：增大堆、调低 IHOP、降分配速率、控制大对象。" },
        { q: "怎么从 GC 日志估算对象的平均晋升速率？", a: "取多次 Young GC 日志的 Heap 回收后值做差除以时间间隔；更精确加 -XX:+PrintTenuringDistribution（JDK8）看各年龄对象分布，直接观察年龄爬升速度。" }
      ],
      memory: "口诀：『频率、耗时、水位线』三看；real 是体感，水位是病情，Full GC 是警报——像查体检报告。",
      tags: ["GC日志", "G1", "分析"]
    },
    {
      id: "jvm-19",
      level: 2,
      q: "内存泄漏和内存溢出的区别？Java 里常见的内存泄漏场景有哪些（结合游戏服举例）？",
      a: "核心结论：泄漏是『该回收的没回收』（原因），溢出是『内存不够用』（结果）；泄漏积累到一定程度就溢出。\n区别：Memory Leak 指对象不再使用但仍被 GC Roots 引用，无法回收；OOM 是申请内存时确实没有可用空间。OOM 不一定有泄漏（堆配小了也会），但持续泄漏必然 OOM。\n游戏服常见泄漏场景：\n1. 静态容器/单例 Map 累积：在线玩家 Map 下线不 remove、全局排行榜塞历史数据、GM 后台缓存不过期；\n2. ThreadLocal：Netty/线程池线程是复用的，ThreadLocal 不 remove，value 一直挂在线程上；\n3. 监听器/回调未注销：玩家对象注册了全局事件监听（如跨服事件总线），下线没反注册；\n4. 定时任务持有引用：ScheduledExecutorService 任务里持有玩家强引用，玩家下线任务没取消；\n5. 连接/资源未关闭：ResultSet、Statement、Socket、ByteBuf（Netty 引用计数没 release——这是直接内存泄漏，堆内看不出来）；\n6. 缓存无界：Guava/Caffeine 没设 maximumSize 或过期策略；\n7. 内部类隐式持有外部类：匿名内部类/非静态内部类被长生命周期对象持有，外部类整个被拽住；\n8. 热更新类泄漏：旧 ClassLoader 被某个存活对象引用（哪怕一个），整个旧类加载器及其所有类元数据无法回收，Metaspace 涨。\n排查三板斧：jstat 看老年代爬坡 → jmap/MAT 找支配树大户 → Path to GC Roots 找引用黑手。",
      point: "考察泄漏与溢出的因果辨析及游戏服典型泄漏场景的全景枚举",
      approach: "先一句话讲因果：泄漏是原因、溢出是结果，OOM 未必泄漏；再按六字诀枚举游戏服场景，每个给一句话机制；Netty ByteBuf 和热更新类泄漏作为差异化亮点重点讲；最后给排查三板斧。坑：别漏『堆外泄漏堆内看不见』这一关键认知。",
      followups: [
        { q: "Netty 的 ByteBuf 泄漏怎么用工具发现？（-Dio.netty.leakDetectionLevel）", a: "开 -Dio.netty.leakDetectionLevel=PARANOID（全量）或 ADVANCED（采样），泄漏时 Netty 打 LEAK 日志并附分配栈；配合 NMT 看堆外增长；RES 涨而堆平稳即堆外泄漏特征。" },
        { q: "为什么线程池场景 ThreadLocal 特别容易泄漏？线程复用和 ThreadLocalMap 的 key 是弱引用为什么还漏？", a: "线程池线程长期存活，ThreadLocalMap 挂在 Thread 上；key 弱引用可回收，但 value 是强引用，key 变 null 后 value 永远可达又取不到——必须用完 remove()。" },
        { q: "弱引用能彻底解决泄漏吗？软引用缓存有什么坑？", a: "不能，弱引用只解决 key 绑定问题，管不住 value 侧。软引用缓存回收时机不可控（快 OOM 才回收），命中率随堆压力波动，还可能加剧 GC 前堆积。生产用 Caffeine 显式驱逐更可控。" }
      ],
      memory: "口诀：『泄漏是病，OOM 是症』；泄漏场景记『静（静态容器）线（ThreadLocal）听（监听）时（定时器）缓（缓存）热（热更新）』六字诀。",
      tags: ["内存泄漏", "游戏服", "ThreadLocal"]
    },
    {
      id: "jvm-20",
      level: 2,
      q: "JIT 编译器（C1/C2）和分层编译是怎么回事？方法内联和逃逸分析为什么依赖热点代码？",
      a: "核心结论：HotSpot 解释器+JIT 混合执行，热代码被分层编译成机器码；分层编译 C1 快编译、C2 深度优化，游戏服的战斗循环就是 C2 红利的最大受益者。\n1. 执行方式：字节码先解释执行，被反复执行的『热点代码』触发即时编译（AOT 之外的运行时编译），之后直接跑本地机器码。\n2. 热点探测：方法调用计数器 + 回边计数器（循环体执行次数），超过阈值（-XX:CompileThreshold，C2 默认 10000）提交编译队列。\n3. 分层编译（TieredCompilation，JDK8 默认开）：\n   - Level 0 解释执行 → Level 1/2/3 C1（client 编译器，编译快、优化少，带 profiling 收集类型信息）→ Level 4 C2（server 编译器，编译慢但做激进优化）。\n4. C2 的激进优化：方法内联（最重要的优化，其他优化的前提）、逃逸分析+标量替换、锁消除/锁粗化、循环展开、死代码消除、基于 profiling 的乐观优化（如单态内联，猜错了会逆优化 deoptimization）。\n5. 对游戏服的启示：\n   - 战斗结算、寻路等热路径保持方法小、分支稳定（利于内联与单态优化）；\n   - 避免在热路径上引入反射（反射调用难内联，JDK 还会用 NativeMethodAccessor 门槛）；\n   - 预热问题：服务刚启动时 JIT 没编译完，性能差——上线/重启后可先灌一波流量预热（warm-up），游戏服开服前跑机器人压测就是干这个；\n   - CodeCache 满了 JIT 停摆（-XX:ReservedCodeCacheSize 默认 240M，大项目可关注）。",
      point: "考察 JIT 分层编译机制与热点依赖本质：profiling 是激进优化的燃料",
      approach: "先讲解释+编译混合执行与热点探测双计数器，再展开 C1→C2 分层流程与 C2 优化清单（内联为王）；游戏服启示讲预热、热路径写法、反射规避三点。坑：别说 JIT 启动就全量编译，别漏逆优化这个概念。",
      followups: [
        { q: "什么是逆优化（deoptimization）？什么情况触发？", a: "C2 基于 profiling 做乐观假设（单态内联、分支裁剪），假设被新类加载或罕见分支打破时作废机器码回解释执行。批量热替换类或突发新调用形态会引发逆优化风暴，CPU 飙高。" },
        { q: "方法内联的门槛条件有哪些？final 一定帮助内联吗？", a: "方法体小（默认 35 字节码内，热方法放宽）、非递归、调用点类型可确定。final 不是内联前提——C2 靠类型 profiling 做单态内联，final 只是多一个确定性旁证。" },
        { q: "游戏服开服瞬间卡顿可能和 JIT 有什么关系？怎么缓解？", a: "重启后热代码未编译，解释执行+C1 阶段性能差，表现为开服几分钟卡顿。缓解：开服前机器人压测预热、引流爬坡而非瞬间全量、关键路径提前跑批触发编译。" }
      ],
      memory: "口诀：『先解释、后编译，C1 快、C2 狠，热代码才配优化』——JIT 像厨师：只给回头客（热点）做招牌菜（深度优化），生客（冷代码）随便炒。",
      tags: ["JIT", "分层编译", "内联"]
    },
    {
      id: "jvm-21",
      level: 3,
      q: "【结合项目】你的 3D MMORPG 战斗服+功能服用 RPC 通信，现在要整体从 JDK8 升级到 JDK17/21，GC 层面会踩哪些坑？带来哪些收益？",
      a: "核心结论：升级最大收益是 ZGC/分代 ZGC 与 G1 的成熟化，最大坑是 GC 参数与日志格式全换、CMS 被删除、反射封装收紧。\n收益：\n1. GC 器换代：JDK17 的 G1 远好于 JDK8（并行 Full GC JDK10 起）；JDK21 分代 ZGC（Generational ZGC）正式，STW <1ms 且吞吐接近 G1——对状态同步延迟敏感的 MMORPG 是质变，玩家技能释放不再被 STW 卡帧。\n2. 新特性：ZGC/Shenandoah 成熟、Epsilon（压测用无 GC 器）、容器感知默认开启。\n3. 性能：JDK11+ 字符串压缩、NUMA 感知分配、JIT 改进，同硬件吞吐提升 10%~20%。\n坑：\n1. CMS 没了：JDK14 删除，用 CMS 的老参数（-XX:+UseConcMarkSweepGC 及一堆 CMS 调优参数）直接启动失败——要全部换成 G1/ZGC 参数并重新压测。\n2. GC 日志格式全变：JDK9+ 统一日志 -Xlog:gc*:file=gc.log:time,level,tags，旧的 -XX:+PrintGCDetails 等全部废弃，监控/告警脚本要重写。\n3. 模块化封装：JDK16+ 强封装 JDK 内部 API（--illegal-access=deny），反射调用 sun.misc.Unsafe、NIO 内部类会报错——Netty 旧版本、热更新/序列化框架里常见，要么升级依赖要么 --add-opens。\n4. 默认字符集 UTF-8（JDK18）、Security Manager 弃用、移除 Nashorn 等边角坑。\n5. 元空间/线程行为变化要回归压测。\n升级策略：战斗服与功能服 RPC 协议层（协议生成工具产物）先保证序列化兼容 → 灰度单服 → 盯 GC 日志与 P99 延迟对比 → 全量。",
      point: "考察 JDK 大版本升级的全景认知：收益量化、坑点清单、灰度策略",
      approach: "按『收益-坑-策略』三段式：收益讲 G1 成熟化与分代 ZGC 对 MMORPG 的意义；坑按 CMS 删除、日志格式、模块封装三大必踩项展开；策略讲协议兼容先行、灰度、指标对比。坑：别只谈语法新特性，本题焦点是 GC 与运维层面。",
      followups: [
        { q: "分代 ZGC 相对原 ZGC 改进在哪？为什么吞吐量提升明显？", a: "原 ZGC 全堆同等处理，标记转移开销与活对象总量成正比；分代后新生代高频快收、老年代低频深收，双代各用染色指针，吞吐接近 G1，CPU 开销降约 10%，堆余量需求也减少。" },
        { q: "升级后怎么设计 A/B 验证？你会对比哪些 JVM 和业务指标？", a: "JVM 侧：STW 分布/P99、晋升速率、老年代水位、吞吐；业务侧：协议处理 P99/P999 延迟、战斗帧耗时、掉线率、卡顿上报。同机房同流量镜像对比至少一周再下结论。" },
        { q: "你们的导表工具、协议生成工具在 JDK 升级时可能有什么兼容问题？", a: "若用反射访问 JDK 内部 API（Unsafe、NIO）或低版本字节码库（老 ASM），JDK17 强封装下会报 InaccessibleObjectException；需升级依赖版本，过渡期加 --add-opens 放行。" }
      ],
      memory: "口诀：『升级三件事：参数换、日志换、封装破』；收益记『ZGC 毫秒停顿、吞吐白捡 10%+』——像换发动机：马力更大，但仪表盘全得重接。",
      tags: ["JDK升级", "ZGC", "游戏服", "架构"]
    },
    {
      id: "jvm-22",
      level: 3,
      q: "【架构深挖】设计一个承载 10 万长连接的 MMORPG 单区服 JVM 方案：堆大小、GC 器选型、参数、监控告警，完整说一遍。",
      a: "核心结论：大堆 + ZGC（或调优后的 G1）+ 堆外缓冲 + 全链路 GC 监控，目标 P99 业务延迟不受 GC 影响。\n容量估算：10 万连接，假设每玩家在线数据 50KB → 常驻约 5G；加上配置表、缓存、战斗临时对象分配峰值，堆建议 16G~32G，堆外（Netty 直接内存+线程栈）另留 8G+，机器选 64G。\nGC 选型：\n- 首选（JDK21）：-XX:+UseZGC -XX:+ZGenerational，STW <1ms，玩家完全无感；\n- 备选（JDK8/11 老环境）：G1，-Xms24g -Xmx24g -XX:MaxGCPauseMillis=50 -XX:InitiatingHeapOccupancyPercent=35（提前启动并发标记，给晋升留缓冲）-XX:G1HeapRegionSize 按堆自动。\n关键参数：\n- -XX:MaxDirectMemorySize=8g + Netty PooledByteBufAllocator；\n- -Xss256k：10 万连接若用 Netty 事件循环模型线程数可控（几十个 EventLoop），但业务线程池要规划，Xss 调小省出栈内存；\n- -XX:+HeapDumpOnOutOfMemoryError、-Xlog:gc*:file=gc.log:time,uptime,level,tags:filecount=10,filesize=100m；\n- -XX:NativeMemoryTracking=summary：盯堆外；\n- GC 之外：-Dio.netty.eventLoopThreads 按核数配，业务用 Disruptor 单线程消费者模型保证玩家逻辑串行无锁。\n监控告警（落地）：\n1. jstat/Micrometer 采集：YGC 频率与耗时、FGC 次数、老年代水位、晋升速率、Safepoint 总时长；\n2. 告警线：Full GC >0 次/天即告警；单次 STW >100ms（G1）告警；老年代 1 小时涨幅 >10% 告警（疑似泄漏）；\n3. Safepoint 监控：-Xlog:safepoint，排查 GC 之外的 STW（如偏向锁撤销、代码缓存刷新）；\n4. 业务侧关联：把 GC 事件打点进 BI 服，与玩家卡顿上报/掉线率关联分析——这是游戏公司特有的闭环。\n容灾：双进程灰度、玩家状态定时快照落 Redis/DB，进程崩溃可快速恢复现场。",
      point: "考察架构级 JVM 方案设计：容量估算、选型论证、监控闭环三位一体",
      approach: "按『估算→选型→参数→监控→容灾』五步走：先算常驻内存定堆，再论证 ZGC/G1 取舍，参数给关键项并解释，监控告警给具体阈值（FGC 零容忍、水位斜率），容灾补状态快照。全程数字说话。坑：别堆参数没有估算依据，别漏 safepoint 与业务卡顿的关联分析。",
      followups: [
        { q: "为什么 10 万连接不直接用多个小 JVM 实例而用大堆单实例？各自的取舍？", a: "大堆单实例省跨进程通信、配置表/缓存不重复，配合 ZGC 停顿可控；多小实例故障隔离好、GC 影响面小，但连接要网关分发、状态共享复杂。状态重的 MMORPG 主战场服倾向大实例+快照容灾。" },
        { q: "Safepoint 除了 GC 还有哪些触发源？怎么排查 safepoint 内耗时过长？", a: "偏向锁批量撤销、类重定义（热更 redefine）、栈去优化、JVMTI 操作、jstack 抓栈。用 -Xlog:safepoint 看 vmop 类型与 TTSP，长循环不到安全点的线程是常见迟到者。" },
        { q: "ZGC 对机器内存余量有什么要求？浮动垃圾怎么处理？", a: "无分代版本浮动垃圾靠堆余量消化，建议堆留 30%+ 空闲；染色指针需 64 位地址空间。JDK21 分代 ZGC 后新生代高频快收，浮动垃圾和余量需求都显著下降。" }
      ],
      memory: "口诀：『堆给够、ZGC 兜底、堆外单算、FGC 零容忍、水位看斜率、卡顿关联 BI』——设计、参数、监控三件套齐全就是架构级答案。",
      tags: ["架构", "ZGC", "游戏服", "监控"]
    },
    {
      id: "jvm-23",
      level: 3,
      q: "【压测深挖】线上出现『非 GC 卡顿』：GC 日志很干净，但玩家仍偶发 200ms+ 卡顿。从 JVM 角度还有哪些嫌疑？怎么排查？",
      a: "核心结论：GC 之外的 STW 与停顿来源很多——Safepoint 等待、锁竞争、JIT 逆优化风暴、缺页/swap、容器 CPU 限流，要用 Safepoint 日志+jstack+系统层工具联合排查。\n嫌疑清单：\n1. Safepoint 非 GC 触发：偏向锁批量撤销（JDK15 前，-XX:-UseBiasedLocking 可关）、代码缓存刷新、类重定义（热更新/Arthas redefine）、JVMTI agent 操作——看 -Xlog:safepoint 日志的『time to safepoint (TTSP)』和 SafepointSynchronize 耗时；有线程迟迟不到安全点（如长循环未内禀检测点）会拖累全局，用 -XX:+SafepointTimeout 定位。\n2. 锁竞争：业务大锁（全局玩家表 synchronized）造成串行化，jstack 三连抓看 BLOCKED 分布；换 ConcurrentHashMap 分段或按玩家分片。\n3. JIT 逆优化风暴：热更新批量替换类或罕见分支被触发，大量方法逆优化回解释执行，CPU 飙高+延迟抖动；看 -XX:+PrintCompilation 与 -XX:+TraceDeoptimization。\n4. 容器 CPU 限流：K8s limits 导致 CFS throttle，线程被强制暂停 100ms 粒度——与 GC 无关但体感一样；查容器指标 cpu.throttled。\n5. 系统层：swap 换页（游戏服必须 swapoff 或 swappiness=0）、缺页中断、其他进程抢 CPU、网卡软中断打满。\n6. 磁盘 IO：GC 日志/dump 写盘阻塞、日志服同步写。\n排查套路：业务埋点记录 P99 延迟尖刺时间戳 → 对齐 Safepoint 日志、GC 日志、系统监控（sar/perf）、容器指标 → 二分排除。Arthas profiler（async-profiler）火焰图能直接看到 wall-clock 维度的等待栈，是这类问题的终极武器。",
      point: "考察 GC 之外停顿源的系统性认知：Safepoint、锁、JIT、容器、系统层",
      approach: "先立论『卡顿≠GC』，按嫌疑清单逐层排查：safepoint 非 GC 触发、锁竞争、逆优化风暴、容器 throttle、swap/IO，每层给确认手段（日志或命令）；最后给时间戳对齐的二分排查套路和 async-profiler 大招。坑：别局限在 JVM 层，容器和系统层是高频盲区。",
      followups: [
        { q: "什么是 TTSP（time to safepoint）？什么样的代码会导致某线程迟迟到不了安全点？", a: "从发起 safepoint 到全部线程到达的耗时。C2 对 int 计数紧凑循环默认不插安全点检查，几亿次循环的批计算（寻路预处理、全表统计）可能数百 ms 不到点，全员陪等。" },
        { q: "偏向锁为什么被废弃（JDK15 默认关、JDK18 移除入口）？撤销成本是怎么回事？", a: "高竞争下撤销要全局 safepoint 批量 revoke，成本随类数量增长；现代应用多线程竞争是常态，偏向收益低而撤销代价高，所以废弃。它正是老系统周期性规律停顿的经典元凶。" },
        { q: "K8s 容器里 JVM 看到的 CPU 核数和实际可用配额不一致会引发什么连锁问题？", a: "JVM 按核数定 GC 线程、JIT 编译线程、ForkJoinPool 并行度；看到 64 核实际配额 2 核则线程超发，CFS throttle 周期性暂停。新版按配额折算，老版用 ActiveProcessorCount 指定。" }
      ],
      memory: "口诀：『GC 干净查四点：安全点、锁、逆优化、容器限流』——卡顿不全是垃圾回收的锅，像堵车不全是红绿灯的问题。",
      tags: ["Safepoint", "卡顿", "压测", "Arthas"]
    },
    {
      id: "jvm-24",
      level: 3,
      q: "【深挖】G1 的并发标记周期（Concurrent Marking Cycle）详细流程是什么？SATB 算法解决了什么问题？和 CMS 的增量更新有什么区别？",
      a: "核心结论：G1 用 SATB（Snapshot-At-The-Beginning）在标记开始时对对象图拍快照，以『开始时刻活着的对象都算活』的保守策略换并发标记的正确性与速度；CMS 用增量更新，漏标风险不同、重新标记更慢。\nG1 并发标记四阶段（老年代占比超 IHOP 触发）：\n1. 初始标记（Initial Mark，STW）：借 Young GC 的 piggyback 完成，标记 GC Roots 直达对象，极快；\n2. 根区域扫描（Root Region Scanning）：扫 Survivor 区对老年代的引用，与应用并发；\n3. 并发标记（Concurrent Marking）：遍历全堆对象图，与应用并发，SATB 保证正确性；\n4. 重新标记（Remark，STW）：处理 SATB 队列里标记期间产生的引用变化，比 CMS 的 Remark 快（SATB 队列 + 并行）；\n5. 清理（Cleanup，部分 STW）：统计各 Region 存活比例，排序选出后续 mixed GC 的 CSet，完全空的 Region 直接回收。\nSATB 原理：标记开始时对对象图做逻辑快照；并发期间引用关系变化通过写屏障记录到 SATB 队列（记录的是『被覆盖的旧引用』），Remark 时重放即可。约定：开始时刻活的对象本轮都算活，浮动垃圾留给下轮。\n对比 CMS 增量更新（Incremental Update）：CMS 记录的是『新插入的引用』（黑指向白时把黑变灰），Remark 要重扫整个老年代及新生代，STW 更长；SATB 只需处理队列，且 RSet 帮忙定位跨区引用，所以 G1 的 Remark 显著短。\n代价：SATB 写屏障有性能开销、浮动垃圾比例更高（需要更多堆余量，IHOP 别顶太满）。",
      point: "考察并发标记正确性本质：SATB 与增量更新对漏标条件的不同破坏",
      approach: "先讲 G1 并发标记五阶段流程，再点出 SATB 核心思想（开始快照+记录旧引用），与 CMS 增量更新对比落到 Remark 时长差异；最后补代价（浮动垃圾、写屏障）。坑：别只背阶段名，要能讲清 SATB 为什么快、为什么正确。",
      followups: [
        { q: "三色标记里为什么会漏标？SATB 和增量更新分别破坏的是哪个漏标条件？", a: "漏标需同时满足：黑色对象新引用白色对象、且灰色到该白色的引用被切断。SATB 记录被切断的旧引用（破坏条件二）；增量更新把新插引用的黑变灰（破坏条件一）。各破其一即可防漏。" },
        { q: "G1 的浮动垃圾为什么比 CMS 多？对堆容量规划有什么影响？", a: "SATB 保守地把标记开始时活着的都算活，标记期间死掉的也留到下轮。影响：G1 需要更大堆余量，IHOP 不宜顶满，否则标记赶不上分配速度引发 Full GC。" },
        { q: "RSet 在并发标记和 mixed GC 中分别起什么作用？", a: "并发标记中辅助定位跨 Region 引用来源，避免全堆扫描；mixed GC 回收某 Region 时靠 RSet 快速找到外部指向它的引用做根枚举与更新，是 G1 按 Region 独立回收的前提。" }
      ],
      memory: "口诀：『SATB 拍照存档，删引用记小账；CMS 增量更新，加引用记小账』——一个记『断掉的旧线』，一个记『新连的线』，Remark 时长立见高下。",
      tags: ["G1", "SATB", "并发标记", "三色标记"]
    },
    {
      id: "jvm-25",
      level: 1,
      q: "强引用、软引用、弱引用、虚引用四种引用的区别？各自典型用途是什么？游戏服本地缓存该用哪种？",
      a: "核心结论：四种引用是按『GC 时保不保命』分级的，强度：强 > 软 > 弱 > 虚，强度越低越容易被回收。\n1. 强引用：Object obj = new Object() 默认就是；只要 GC Roots 可达，宁可 OOM 也不回收。游戏服在线玩家 Map 就是强引用——所以下线必须 remove。\n2. 软引用（SoftReference）：内存不够（将要 OOM）时才回收。适合做内存敏感缓存——堆紧张时自动释放保命。游戏服可用于『可重建』的大缓存，如解析后的策划配置快照；注意回收时机不可控，且 Full GC 前才回收，缓存命中率会随堆压力波动。\n3. 弱引用（WeakReference）：只要发生 GC（哪怕 Minor GC）且只剩弱引用就回收。典型：WeakHashMap、ThreadLocalMap 的 key。适合『key 死了缓存项就该死』的场景。\n4. 虚引用（PhantomReference）：不影响生命周期，get() 永远 null，唯一作用是配合 ReferenceQueue 在对象回收时收到通知。典型用途：堆外内存回收跟踪——Netty 的 ResourceLeakDetector 和 JDK 的 Cleaner（堆外内存释放）都基于它。\n游戏服缓存怎么选：默认用带容量上限+过期策略的 Caffeine/Guava（强引用+显式驱逐），比软引用可控；软引用只用于『丢了能重建、不丢更省内存』的辅助缓存。",
      point: "考察四种引用的回收时机分级与工程选型判断，虚引用关联堆外是深度点",
      approach: "先给强度分级总纲和回收时机一句话版，再逐个讲机制加典型用途；游戏服缓存选型要明确给出『Caffeine 显式驱逐优先于软引用』的观点并说理由。坑：别背定义不给选型建议，别漏虚引用与 Cleaner/Netty 泄漏检测的关系。",
      followups: [
        { q: "ThreadLocalMap 的 key 用弱引用为什么还是会内存泄漏？value 是什么引用？", a: "key 弱引用 GC 可回收，但 value 经 Entry 是强引用；key 变 null 后 value 仍被线程可达且取不到，形成泄漏。线程池线程不死泄漏常驻——必须用完 remove()。" },
        { q: "虚引用怎么和 ReferenceQueue 配合回收直接内存？DirectByteBuffer 的 Cleaner 机制讲讲。", a: "DirectByteBuffer 在堆里只是壳，关联的 Cleaner（虚引用）在壳被 GC 后进入 ReferenceQueue，守护线程取出执行 free 释放堆外内存。Netty 泄漏检测同理用虚引用跟踪 refCnt 归零情况。" },
        { q: "软引用缓存和 Caffeine 的 maximumSize 驱逐，线上你选哪个？为什么？", a: "选 Caffeine。软引用回收时机不可控（快 OOM 才回收），命中率随堆压力波动，高并发下还加剧 GC 前堆积；Caffeine 容量+过期+W-TinyLFU 策略行为可预期、可监控、可告警。" }
      ],
      memory: "口诀：『强到 OOM 不放，软到没内存才放，弱到 GC 就放，虚只报个丧』——按回收时机记强度。",
      tags: ["引用类型", "缓存", "基础"]
    },
    {
      id: "jvm-26",
      level: 2,
      q: "字符串常量池在 JDK6/7/8 中的位置变迁？String.intern() 的行为有什么变化？游戏服里滥用 intern 有什么风险？",
      a: "核心结论：常量池从永久代搬到堆（JDK7），类元信息搬到元空间（JDK8）；intern 在 JDK7 后只存堆引用不再拷贝对象，滥用会把常量池变成泄漏点。\n位置变迁：\n1. JDK6：字符串常量池在永久代（PermGen），大小固定（-XX:MaxPermSize），intern 多了直接 PermGen OOM。\n2. JDK7：常量池移到堆中——这是关键转折，intern 的字符串可以参与普通 GC，OOM 风险转移到堆。\n3. JDK8：永久代整个删除，类元信息去元空间（本地内存），字符串常量池留在堆里。\nintern 行为差异（面试高频陷阱）：\n- JDK6：intern 时如果池里没有，把堆中对象『拷贝一份』放进永久代，返回池里的副本——s.intern() == s 为 false。\n- JDK7+：池里没有时，只在池中记录该堆对象的『引用』，不拷贝——s.intern() == s 可能为 true（如 new String(\"1\")+new String(\"1\") 场景的经典题）。\n- \"a\"+\"b\" 编译期折叠成 \"ab\" 直接进池；new String(\"ab\") 会创建 1~2 个对象（池中一个+堆中一个）。\n游戏服风险：\n1. 玩家昵称、渠道 token、协议里的动态字符串调 intern → 常量池只增不减（它是全局 StringTable，等价于一个永不过期的全局 Map）→ 老年代缓慢爬坡，典型『温水煮青蛙』泄漏。\n2. StringTable 本质是 HashTable，桶数固定（-XX:StringTableSize，JDK8 默认 60013），intern 太多哈希冲突变长链表，intern 本身变慢还加锁竞争。\n3. 正确姿势：需要字符串去重用 Caffeine + WeakReference 或自建带驱逐的 Map，别碰 intern。",
      point: "考察常量池变迁与 intern 行为差异细节，及滥用 intern 的泄漏认知",
      approach: "先按 6/7/8 三版本讲位置变迁，再讲 intern 行为差异这个高频陷阱（拷贝 vs 存引用），最后落到游戏服风险：动态字符串进全局 StringTable 的危害与正确替代。坑：intern 经典题（s.intern()==s）要会推演，别说常量池 JDK8 去了元空间。",
      followups: [
        { q: "String s = new String(\"ab\") 创建了几个对象？s.intern() == s 在 JDK6 和 JDK8 分别是什么结果？", a: "常量池一个加堆中一个共 2 个。JDK6：intern 往永久代拷贝副本返回，== s 为 false；JDK7/8：若池中原本无此串则只存堆引用，== s 为 true（该经典场景下）。" },
        { q: "常量池既然在堆里，为什么 intern 泄漏的对象不容易被回收？", a: "StringTable 是 JVM 全局结构，intern 过的字符串被 StringTable 强引用、作为 GC Roots 可达，表项不清理就常驻；虽在堆里，但等价于一个永不失效的全局缓存。" },
        { q: "你们渠道接入时各种 SDK token/订单号字符串量大，有没有做过字符串去重？怎么做的？", a: "不做 JVM 级 intern，用带容量上限+过期时间的 Caffeine 做有限去重，唯一性靠数据库索引兜底；JDK 层面可开 G1 的 -XX:+UseStringDeduplication 做底层去重，安全无泄漏。" }
      ],
      memory: "口诀：『6 拷 7 引 8 去永久』——JDK6 intern 拷贝、JDK7 存引用、JDK8 杀永久代；『intern 是全局 Map，动态字符串别乱入』。",
      tags: ["字符串常量池", "intern", "JDK变迁"]
    },
    {
      id: "jvm-27",
      level: 2,
      q: "【结合热更新】元空间 OOM（OutOfMemoryError: Metaspace）是怎么发生的？MetaspaceSize 和 MaxMetaspaceSize 的语义是什么？游戏服热更新为什么是重灾区？",
      a: "核心结论：元空间存类元数据，OOM 本质是『类太多或旧类卸不掉』；MetaspaceSize 是首次 Full GC 的触发水位而非上限，MaxMetaspaceSize 才是真正上限（默认不设限）。\n参数语义（高频混淆点）：\n1. -XX:MetaspaceSize（默认约 21M）：初始高水位线，元空间使用超过它就触发 Full GC 尝试回收类并调整水位。不设的话启动期会频繁 Full GC 扩容——所以生产建议显式设为稳定值（如 256m）避免启动抖动。\n2. -XX:MaxMetaspaceSize：硬上限，默认 -1（不限，直到本地内存耗尽）。不限有风险（把机器内存吃光），限太小有风险（正常类加载就 OOM），生产建议给上限+监控。\n3. 元空间用的是本地内存（C 堆），不占 -Xmx，OOM 报错是 java.lang.OutOfMemoryError: Metaspace。\n类从元空间卸载的三个苛刻条件（必须同时满足）：①该类所有实例已回收；②加载该类的 ClassLoader 已回收；③该类的 Class 对象无任何引用。第三条最难——只要一个实例活着，ClassLoader 和整个加载器下所有类的元数据都卸不掉。\n热更新为什么是重灾区：\n1. 每次热更都 new 一个自定义 ClassLoader 加载新版类，旧 ClassLoader 必须整个死掉其元数据才能回收；\n2. 常见钉子：旧类的某个单例/静态对象还被全局事件总线、定时器、玩家 Map 引用；新旧对象混用（旧 Class 的对象塞进了新容器）；线程上下文类加载器（TCCL）被线程池里的长命线程持有旧 ClassLoader；\n3. 热更 N 次后元空间爬坡 N 段，最终 Metaspace OOM——报错时往往离热更已过去很久，排查要用 dump 数 ClassLoader 实例个数（MAT 搜 CustomClassLoader 看有几个存活实例，多于 2 个即泄漏）。\n其他来源：反射/动态代理（CGLIB、JDK Proxy）、Groovy/脚本引擎、字节码增强框架每生成一个类都吃元空间。",
      point: "考察元空间参数语义辨析与类卸载三条件，热更泄漏机理是项目结合点",
      approach: "先破参数误区：MetaspaceSize 是水位不是上限；再讲类卸载三条件并指出 ClassLoader 回收最苛刻；热更新部分讲清『一个旧引用拽死一船旧类』的机理和 dump 数 ClassLoader 的排查法。坑：别把 MetaspaceSize 当上限，别忘 TCCL 和线程池这颗钉子。",
      followups: [
        { q: "类卸载的三个条件为什么『ClassLoader 回收』这条最苛刻？和类加载器命名空间有什么关系？", a: "类与其 ClassLoader 互相强引用（Class 持有 loader，loader 持有全部 Class）；任一实例存活则 loader 可达，其加载的所有类元数据都卸不掉。命名空间隔离决定类只能整加载器地卸载。" },
        { q: "怎么在 dump 里确认是热更新导致的元空间泄漏而不是动态代理？", a: "MAT 搜自定义热更 ClassLoader 看存活实例数（>2 即热更泄漏），再看其 Path to GC Roots 找钉子；动态代理泄漏表现为大量 proxy 类挂在少量 loader 下，类名模式（$Proxy）可辨认。" },
        { q: "ThreadLocal 和线程池如何成为旧 ClassLoader 卸不掉的『钉子』？", a: "线程池长命线程的 TCCL 是旧 ClassLoader，或 ThreadLocal 的 value 是旧类实例，旧 loader 就被 GC Root（线程）拽住。热更后必须重置 TCCL、清理 ThreadLocal。" }
      ],
      memory: "口诀：『Size 是水位不是上限，Max 才是天花板』；卸载记『实例死、加载器死、Class 没人指』三死；热更泄漏记『一个旧对象拽死一船旧类』。",
      tags: ["元空间", "OOM", "热更新", "类卸载"]
    },
    {
      id: "jvm-28",
      level: 2,
      q: "【结合 Netty 游戏服】直接内存（堆外）OOM：java.lang.OutOfMemoryError: Direct buffer memory 是怎么产生的？Netty 游戏服如何预防和排查？",
      a: "核心结论：直接内存受 -XX:MaxDirectMemorySize 限制（默认等于 -Xmx），分配超出即抛 OOM；游戏服用 Netty 必须显式限制直接内存并开启泄漏检测，否则堆内监控完全看不见。\n产生机制：\n1. NIO 的 DirectByteBuffer / Netty 的 ByteBuf 分配在本地内存，绕过堆——读写少一次堆拷贝（零拷贝），Netty 网络 IO 全靠它。\n2. 回收依赖：DirectByteBuffer 对象本身在堆里，被 GC 后通过 Cleaner（虚引用机制）释放堆外内存；堆内那个小对象不死，堆外大 buffer 就不释放——堆内一片祥和、堆外已经爆炸，jstat 完全正常。\n3. 触发 OOM 的典型路径：堆设置太大导致 DirectByteBuffer 迟迟不 GC → 堆外分配持续 → 超限抛错；或 ByteBuf 引用计数泄漏（retain/release 不配对、异常路径没 release）；或没设 MaxDirectMemorySize，默认和堆一样大，两者加起来撑爆物理内存被 OOM Killer 杀掉（容器里表现为进程被 kill -9 而无任何 Java 异常）。\n预防：\n1. 显式 -XX:MaxDirectMemorySize，并按『堆+堆外+元空间+线程栈 < 容器 limit × 0.8』做总预算；\n2. 用池化分配器 PooledByteBufAllocator（默认开启）复用内存，降低分配压力；\n3. 编码纪律：谁最后持有谁 release，异常分支用 ReferenceCountUtil.release 兜底，try/finally 或 SimpleChannelInboundHandler 自动释放。\n排查：\n1. 开启泄漏检测 -Dio.netty.leakDetectionLevel=PARANOID（线上可 ADVANCED），泄漏时 Netty 打 LEAK 日志并给出分配栈；\n2. NMT：-XX:NativeMemoryTracking=summary + jcmd VM.native_memory，看 Internal/Other 增长；\n3. 现象特征：RES 持续上涨但堆平稳、GC 正常——堆外问题实锤。",
      point: "考察堆外内存回收机制盲区与 Netty 引用计数纪律，无声被杀是关键认知",
      approach: "先讲 DirectByteBuffer 堆内壳+Cleaner 释放堆外的机制，指出『堆内祥和堆外爆炸』的监控盲区；预防给限额、池化、编码纪律三条；排查给泄漏检测、NMT、RES 对比三招，容器被 OOM Killer 无声杀死要点名。坑：别忘默认上限等于 -Xmx 的叠加风险。",
      followups: [
        { q: "DirectByteBuffer 的堆外内存是靠什么回收的？为什么说它依赖 GC 是设计缺陷？", a: "壳对象被 GC 后，关联 Cleaner 虚引用入队，清理线程调 free 释放堆外。缺陷：释放时机绑定 GC——堆宽松时壳迟迟不死，堆外早已超限，OOM 发生在堆还很健康的时候。" },
        { q: "容器里游戏服进程被 OOM Killer 杀掉、没有任何 Java 报错，怎么确认是直接内存惹的祸？", a: "exit code 137、dmesg/容器事件有 oom_kill 记录，无 hs_err 无 Java 异常。确认：核对 MaxDirectMemorySize、堆+堆外总和对比容器 limit，NMT/pmap 复盘堆外占用。" },
        { q: "Netty 引用计数机制（refCnt）和 JVM GC 是什么关系？为什么 Netty 不用纯 GC 管理 ByteBuf？", a: "refCnt 是手工内存管理：分配时为 1，retain+1、release-1，归零立即归还池子，不等 GC。原因：GC 时机不可控且管不了堆外内存，网络高吞吐下必须确定性回收。" }
      ],
      memory: "类比：直接内存像桌下现金——家里账本（jstat）记的是桌上存款，现金丢了账本看不出来；三件套：『限额、池化、开监控（leakDetection+NMT）』。",
      tags: ["直接内存", "Netty", "OOM", "游戏服"]
    },
    {
      id: "jvm-29",
      level: 2,
      q: "finalize() 方法有什么陷阱？为什么 JDK9 起被标记废弃？游戏服资源清理应该怎么做？",
      a: "核心结论：finalize 执行时机不确定、拖慢 GC、可能让对象复活、还可能永远不执行——任何严肃的资源清理都不能依赖它。\n陷阱清单：\n1. 时机不确定：对象变为不可达后，先被放入 F-Queue，由低优先级 Finalizer 守护线程慢慢执行 finalize——何时执行、甚至是否执行都不保证（JVM 退出时没跑完就不跑了）。\n2. 拖慢 GC 与堆积：带 finalize 的对象要经过两次 GC 才能真正回收（第一次标记后等 finalize 跑完，第二次才回收）；如果 finalize 里有耗时逻辑或对象产生速度 > Finalizer 线程消费速度，F-Queue 堆积直接 OOM——游戏服海量临时对象场景绝不能给事件类加 finalize。\n3. 对象复活：finalize 里把 this 赋给某个存活引用（如静态集合）对象就复活了，但 finalize 只执行一次，下次死透时不再调用——复活一次后资源永久泄漏，且复活对象状态往往不完整。\n4. 异常吞没：finalize 抛异常线程不终止但剩余代码不执行，清理做一半。\n5. 顺序与依赖：多个对象 finalize 执行顺序不保证，对象间有依赖时逻辑全乱。\n正确替代：\n1. try-with-resources / 显式 close：连接、流、文件句柄的标准姿势，确定性强；\n2. Cleaner（JDK9+）：基于虚引用的注册式清理，比 finalize 可控（自己管理清理线程、不阻塞 GC），DirectByteBuffer 内部就用它；\n3. Netty 引用计数：ByteBuf 用 retain/release 显式管理，根本不给 GC 插手的机会——游戏服资源管理就该学这个思路：资源生命周期跟业务走，不跟 GC 走。",
      point: "考察 finalize 机制缺陷及 Cleaner 等现代替代方案",
      approach: "先给结论：任何严肃清理都不能靠 finalize；按四宗罪（时机不定、拖慢 GC、可复活、只执行一次）逐条讲机制，F-Queue 堆积 OOM 结合游戏服海量临时对象场景；替代方案按确定性排序给出，Netty 引用计数收尾呼应项目。坑：别漏『两次 GC 才回收』和『复活后不再执行』两个细节。",
      followups: [
        { q: "finalize 的『两次标记』流程具体是什么？为什么说它让对象至少多活一轮 GC？", a: "第一次标记发现对象不可达且有 finalize → 入 F-Queue 不回收；Finalizer 线程执行完后对象再次不可达 → 第二次 GC 才真正回收。中间至少隔一轮，队列消费慢就堆积。" },
        { q: "Cleaner 和 finalize 比解决了哪几个问题？它自己就万无一失吗？", a: "Cleaner 用虚引用+显式注册清理动作，清理线程可自管、不拖 GC、对象不可复活、可重复注册。局限：仍依赖 GC 触发、时机不保证；清理动作里若引用目标对象本身会导致永不回收。" },
        { q: "你们购买服的支付订单对象、日志服的文件句柄，资源释放是怎么保证的？", a: "支付订单无外部资源，靠业务状态机+落库保证一致性；文件句柄/连接用 try-with-resources 或连接池归还；Netty ByteBuf 靠 release 纪律+泄漏检测兜底——核心是生命周期跟业务走。" }
      ],
      memory: "口诀：『finalize 四宗罪：没准点、拖两轮、能诈尸、只一次』——像遗嘱执行人永远请假；资源清理记『能 try-with-resources 就别等 GC 发丧』。",
      tags: ["finalize", "Cleaner", "GC", "资源管理"]
    },
    {
      id: "jvm-30",
      level: 2,
      q: "Java 内存模型（JMM）和 JVM 运行时内存区域是一回事吗？JMM 解决什么问题？happens-before 是什么？",
      a: "核心结论：完全两回事——运行时内存区域是 JVM 的物理内存划分（堆/栈/元空间），JMM 是抽象的多线程内存访问规范（主内存/工作内存），解决可见性、有序性、原子性三大问题。\n区分（面试经典混淆点）：\n1. 运行时数据区回答的是『数据存在哪、谁管回收』；\n2. JMM 回答的是『多线程下，一个线程的写何时对另一个线程可见、指令能不能重排』——它是规范（JSR-133），JVM 通过内存屏障在 CPU 上落地它。\nJMM 核心概念：\n1. 主内存与工作内存：每个线程有自己的工作内存（抽象概念，对应 CPU 缓存/寄存器），变量修改先写工作内存再刷主内存——这是可见性问题的根源（游戏服业务线程改了玩家状态，网络 IO 线程未必立刻看到）。\n2. 三大性质：可见性（volatile/synchronized/Lock 保证）、有序性（禁止特定重排序）、原子性（基本读写原子，复合操作靠锁/CAS）。\n3. happens-before：判断『前一个操作的结果对后一个操作可见』的规则集，背六条常考的：\n   - 程序次序规则：单线程内按书写顺序；\n   - 锁规则：解锁 happens-before 后续对同一锁的加锁；\n   - volatile 规则：写 happens-before 后续读；\n   - 线程启动规则：start() 前的操作对线程内可见；\n   - 线程终止规则：线程内所有操作 happens-before join() 返回；\n   - 传递性：A hb B、B hb C 则 A hb C。\n   注意 happens-before ≠ 时间先后，是『可见性保证』关系。\n4. 落地：volatile 写后加 StoreLoad 屏障强制刷主存、读后加屏障禁重排；synchronized 进出 monitor 隐含屏障；final 字段的安全发布也靠 JMM 特殊规则。\n游戏服关联：状态同步里『逻辑线程写玩家坐标、网络线程读』若无 volatile/锁，发出去的可能是旧坐标——这就是 JMM 问题，不是 GC 问题。",
      point: "考察 JMM 与内存区域的概念辨析及 happens-before 运用",
      approach: "先一刀切清两个概念（物理划分 vs 访问规范），再讲主内存/工作内存抽象与三大性质，happens-before 背六条并强调它是可见性关系而非时间先后；结尾用状态同步发旧坐标的例子落到项目。坑：别把 JMM 讲成内存结构图，别漏传递性这条。",
      followups: [
        { q: "DCL 单例为什么必须加 volatile？从指令重排角度解释。", a: "new 对象分三步：分配内存、初始化、引用赋值，后两步可重排。无 volatile 时别的线程可能拿到未初始化的半对象；volatile 写禁重排并插入 StoreLoad 屏障，保证赋值前初始化完成。" },
        { q: "volatile 能保证 i++ 的线程安全吗？为什么？", a: "不能。i++ 是读-改-写复合操作，volatile 只保证单次读写的可见性与有序性，不保证原子性，多线程下仍丢更新。需 AtomicInteger 的 CAS 或加锁。" },
        { q: "你们战斗服多线程读共享战斗状态用的什么同步手段？换成 volatile 行不行？", a: "逻辑线程单写、网络线程多读的简单状态（坐标、血条）可用 volatile 或 AtomicReference；复合状态（位置+朝向+动作需一致）volatile 不够，用不可变快照对象整体替换引用来发布。" }
      ],
      memory: "口诀：『内存区域管存哪，JMM 管谁看见』——一个是仓库布局，一个是快递规则；hb 六条记『次序、锁、volatile、启动、终止、传递』。",
      tags: ["JMM", "happens-before", "volatile", "并发"]
    },
    {
      id: "jvm-31",
      level: 2,
      q: "【结合线上部署】容器（Docker/K8s）环境跑 JVM 有哪些坑？-XX:MaxRAMPercentage 怎么用？游戏服容器化部署 JVM 参数要注意什么？",
      a: "核心结论：容器里 JVM 必须能正确感知 cgroup 的内存/CPU 限制，否则按宿主机资源计算堆和线程池，要么 OOM 被杀要么性能虚标。\n坑与解法：\n1. 内存感知：JDK8u191+/JDK10+ 默认开 UseContainerSupport，能读 cgroup 限制；更早版本 JVM 看到的是宿主机内存（如 64G），按 1/4 算堆 → 容器 limit 只有 4G → 堆还没涨满进程就被 OOM Killer 杀掉（无 Java 异常，只有 exit code 137）。\n2. -XX:MaxRAMPercentage（JDK8u191+/10+）：堆最大值 = 容器 limit × 该百分比，默认仅 25%！生产必须显式调大，游戏服建议 70~80（堆外、元空间、线程栈、JIT 代码缓存都要留地）：-XX:InitialRAMPercentage=70 -XX:MaxRAMPercentage=75。注意百分比基数是容器 limit 不是宿主机。\n3. CPU 感知：JVM 按可用核数定 GC 线程数、JIT 编译线程数、ForkJoinPool/ParallelStream 并行度。K8s 的 cpu limit 用 CFS 配额（如 2000m），老版本 JVM 看到的核数可能是宿主机核数 → GC 并行线程过多加剧 throttle；新版（JDK8u261+/11+）支持按配额折算（-XX:ActiveProcessorCount 也可手动指定）。\n4. CFS throttle 卡顿：limit 打满时线程被以 100ms 周期强制暂停，表现为规律性的 P99 尖刺——监控 cpu.throttled 指标，GC 日志却很干净（呼应『非 GC 卡顿』）。\n5. 其他：容器里 PID 1 信号处理问题（Java 直接做 PID 1 收不到 SIGTERM 优雅停机，用 tini 或 K8s preStop 钩子里调下线接口——游戏服要先踢玩家存档再退出）；/tmp、shm 大小；堆 dump 路径要挂卷，否则容器一删证据全没。\n落地配置示例（K8s limit 8G 游戏服）：-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -XX:MaxDirectMemorySize=1g -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/data/dump（挂持久卷）。",
      point: "考察容器环境 JVM 资源感知机制与内存总预算思维，默认 25% 是坑点",
      approach: "先立论：容器里 JVM 必须看懂 cgroup；按内存感知、MaxRAMPercentage、CPU 感知、throttle、优雅停机五个坑逐个讲机制与解法；游戏服特殊点（先踢玩家存档、dump 挂卷）作为加分项。坑：别忘默认 25% 这个最易踩的值，别只算堆不算堆外。",
      followups: [
        { q: "容器 limit 4G，MaxRAMPercentage=75，堆 3G，剩下 1G 要给哪些部分花？超了会怎样？", a: "剩下 1G 要装：直接内存、元空间、线程栈（线程数×Xss）、JIT 代码缓存、JVM 自身 native 结构。超了进程被 OOM Killer 杀（137），无任何 Java 异常——所以堆外各部分都要显式限额。" },
        { q: "K8s 里优雅停机对游戏服意味着什么？preStop 里你会做什么？", a: "preStop 先调下线接口：摘注册中心/网关流量 → 踢玩家下线并触发存档 → 等关键队列（日志、支付）消费完 → 再退出。否则进程直接死，玩家数据丢失、在线状态残留。" },
        { q: "cpu limit=2 的容器里 Runtime.availableProcessors() 返回多少？不同 JDK 版本答案一样吗？", a: "不一样。老版本（JDK8u191 前）返回宿主机核数；新版本按 cgroup 配额折算返回 2；分数配额（1500m）不同版本取舍策略不同。可用 -XX:ActiveProcessorCount 强制指定消除差异。" }
      ],
      memory: "口诀：『容器三问：内存认得清吗？CPU 数得对吗？死得体面吗？』；参数记『RAMPercentage 默认 25 是坑，游戏服给 75，堆外留余粮』。",
      tags: ["容器", "K8s", "JVM参数", "部署"]
    },
    {
      id: "jvm-32",
      level: 2,
      q: "JFR（Java Flight Recorder）是什么？为什么敢说它适合游戏服线上常开？怎么用 JFR 定位卡顿和内存问题？",
      a: "核心结论：JFR 是 JVM 内置的持续飞行记录器，事件直接来自 JVM 内部，开销 <1%~2%，是唯一敢在生产游戏服 7×24 常开的全维度诊断工具——JDK8 是商业特性（需 -XX:+UnlockCommercialFeatures），JDK11 起完全免费开源。\n原理：JVM 内部各子系统（GC、JIT、锁、线程、IO、Safepoint）直接向环形缓冲区写事件，满老事件被覆盖，需要时 jcmd JFR.dump 倒出 .jfr 文件，用 JMC（JDK Mission Control）或 IDEA 打开分析。开销低的原因：事件由 JVM 源码埋点产生、无反射无字节码插桩，数据先入线程本地缓冲。\n使用方式：\n1. 启动常开：-XX:StartFlightRecording=duration=24h,filename=app.jfr（JDK8 需先 UnlockCommercialFeatures）；或运行时 jcmd <pid> JFR.start duration=10m filename=issue.jfr 临时抓现场。\n2. JDK11+：jcmd JFR.start settings=profile（profile 模板事件更全，开销约 2%，适合抓问题时段）。\n游戏服排查场景：\n1. 卡顿定位：看 jdk.JavaMonitorBlocked（锁阻塞）、jdk.ThreadPark、Safepoint 事件、jdk.ExecutionSample（采样栈）——谁在等、等谁、等多久一目了然，比连抓 jstack 信息量大；\n2. 内存分析：jdk.ObjectAllocationSample 看分配热点（战斗结算哪个类分配最凶）、jdk.OldObjectSample 看老年代存活对象画像；\n3. GC 明细：每次 GC 的暂停、晋升、Region 统计全有；\n4. 趋势复盘：环形缓冲保留最近 N 小时，玩家投诉『昨晚 8 点卡』可以事后 dump 出当时的现场——这是 jstack/jstat 做不到的『时光机』能力。\n配合：JFR 事件可经 JFR Streaming（JDK14+）接入 Prometheus，做 GC/STW/锁等待的实时监控大盘。",
      point: "考察 JFR 低开销原理与『时光机』诊断价值，线上常开的底气来源",
      approach: "先讲 JFR 是什么和为什么开销低（JVM 内部埋点、环形缓冲），给常开与临时抓现场两种用法；再按卡顿、内存、GC、复盘四个游戏服场景讲具体事件名；JFR Streaming 接监控收尾。坑：别忘 JDK8 是商业特性这个边界，别把 JFR 和 Arthas 混为一谈。",
      followups: [
        { q: "JFR 和 Arthas 的定位差异是什么？线上你会怎么搭配使用？", a: "JFR 是持续低耗录像，适合常开加事后复盘；Arthas 是按需手术刀，适合在线深挖单点。搭配：JFR 发现异常时段 → Arthas 精确打击 → JFR dump 佐证。" },
        { q: "JFR 的环形缓冲意味着什么？抓问题现场时要注意什么时机问题？", a: "缓冲满后旧事件被覆盖，抓现场必须及时 dump：告警触发后尽快 JFR.dump，或预设 maxage/maxsize 时间窗；突发问题隔太久再倒，关键事件可能已被冲掉。" },
        { q: "JFR 怎么看到 Safepoint 到达时间（TTSP）过长这种隐性问题？", a: "Safepoint 相关事件记录每次 safepoint 的到达耗时与操作类型，JMC 里按 TTSP 排序找异常长的记录，结合线程与 ExecutionSample 事件定位迟到的线程当时在跑什么。" }
      ],
      memory: "类比：JFR 是飞机黑匣子——全程低耗记录，出事后 dump 复盘；jstack 是现场照片，JFR 是全程录像。口诀：『11 起免费，1% 开销，常开不慌，事后时光机』。",
      tags: ["JFR", "诊断", "线上", "游戏服"]
    },
    {
      id: "jvm-33",
      level: 2,
      q: "Shenandoah 是什么原理？和 ZGC 有什么异同？游戏服选型时怎么取舍？",
      a: "核心结论：Shenandoah 是 RedHat 主导的低延迟收集器，核心创新是 Brooks 转发指针让『并发转移』可行，STW 与堆大小解耦；它与 ZGC 目标相同（大堆毫秒级停顿），路线不同（转发指针+读写屏障 vs 染色指针+读屏障）。\nShenandoah 核心机制：\n1. Brooks Pointer：在每个对象头前额外放一个转发指针，平时指向自己；对象被并发转移后，旧对象的转发指针指向新地址，应用线程访问旧对象时经转发指针跳到新地址并顺带修正引用——对象移动和业务并发进行，这就是并发转移。\n2. 读写屏障：读屏障处理转发指针跳转（JDK13 后改为 LRB -load reference barrier，屏障开销大降），写屏障维护 SATB 式并发标记正确性。\n3. 流程：初始标记(STW) → 并发标记 → 最终标记(STW，极短) → 并发清理 → 并发转移 → 引用更新(初始 STW 极短 + 并发修正)。停顿点只有三个且都与堆大小无关。\n与 ZGC 对比：\n1. 元信息位置：Shenandoah 存在对象头前的转发指针（每对象常驻一份额外开销），ZGC 存在指针高位（染色指针，零对象开销但要求 64 位+压缩指针受限、不支持 -XX:-UseCompressedOops 之外的老场景）；\n2. 屏障：Shenandoah 需要读写双屏障（新版 LRB 后主要是读屏障），ZGC 只读屏障，ZGC 运行时开销理论更低；\n3. 分代：ZGC 在 JDK21 有分代版，Shenandoah 长期无分代（浮动垃圾处理靠更大的堆余量），大分配速率下 ZGC 分代版优势明显；\n4. 生态：Shenandoah 不进 Oracle JDK（OpenJDK 发行版如 Adoptium、RedHat 构建才有），ZGC 是官方主线——商业项目选型 ZGC 的维护确定性更强。\n游戏服取舍：JDK11/17 想压 STW 又不想升 21 → 两者都行，优先 ZGC（主线+分代演进明确）；Shenandoah 适合已用 OpenJDK 发行版且不想折腾指针位限制的环境。",
      point: "考察两大低延迟收集器的机制路线对比与工程选型权衡能力",
      approach: "先讲 Shenandoah 的 Brooks 指针+屏障机制，再与 ZGC 从元信息位置、屏障、分代、生态四个维度对比；游戏服取舍给明确观点（优先 ZGC 主线）并说理由。坑：别只背『都很低延迟』说不出路线差异，别忘 Shenandoah 不进 Oracle JDK 这个生态现实。",
      followups: [
        { q: "Brooks 转发指针的空间开销是多少？为什么说它换的是『内存换停顿』？", a: "每个对象额外常驻一个指针宽度的头开销（64 位下 8 字节），对象越多越可观；它换来并发转移能力——对象移动时业务照常跑，典型的空间换停顿设计。" },
        { q: "ZGC 染色指针为什么要求 64 位？和压缩指针冲突吗？", a: "需要指针里有富余高位存标志位，32 位地址空间没有富余位；与压缩指针冲突——ZGC 不支持 UseCompressedOops，这也是小堆上 ZGC 内存效率不如 G1 的原因之一。" },
        { q: "你们如果要在 JDK11 上选低延迟 GC，Shenandoah 和 ZGC 你会怎么评估？看什么指标？", a: "压测对比 P99/P999 STW、吞吐折损、堆余量需求、分配速率适配；工程看发行版支持（Shenandoah 需特定 OpenJDK 构建）与团队熟悉度。一般优先 ZGC，主线演进确定性更强。" }
      ],
      memory: "口诀：『Shenandoah 门牌改（对象头转发指针），ZGC 车牌改（指针染色），都为了不停车搬家』；选型记『ZGC 是亲儿子主线，Shenandoah 是 RedHat 养子』。",
      tags: ["Shenandoah", "ZGC", "低延迟", "GC收集器"]
    },
    {
      id: "jvm-34",
      level: 2,
      q: "对象在堆中的内存布局是怎样的？什么是指针压缩（CompressedOops）？为什么堆超过 32G 是个分水岭？",
      a: "核心结论：对象 = 对象头（Mark Word + 类型指针 [+ 数组长度]）+ 实例数据 + 对齐填充；指针压缩把 64 位引用压成 32 位省内存，但只在堆 <32G 时有效，跨 32G 反而费内存——大堆设计要避开『30~40G 尴尬区』。\n内存布局：\n1. Mark Word：8 字节（64 位），存哈希码、GC 分代年龄（4 bit，所以最多 15）、锁状态标志、偏向线程 id——synchronized 锁升级就是 Mark Word 的变脸史。\n2. Klass Pointer：指向元空间的类元数据；开启指针压缩（默认）4 字节，否则 8 字节。\n3. 数组长度：仅数组对象有，4 字节。\n4. 实例数据 + 对齐填充：HotSpot 要求对象起始地址 8 字节对齐，不够补零。空对象 new Object() 也占 16 字节（8 Mark + 4 Klass + 4 填充）。\n指针压缩原理：64 位引用理论上 8 字节，但对象 8 字节对齐意味着低 3 位恒为 0——存的时候右移 3 位存 32 位（能寻址 2^35 = 32G），用的时候左移 3 位还原。省下的内存很可观：百万级玩家对象的引用字段每个省 4 字节，缓存行还能装更多对象。\n32G 分水岭：\n- 堆 ≤32G：压缩指针生效，实际可用对象引用空间等价于未压缩的 32G+；\n- 堆 >32G：压缩失效（2^32×8 到顶了），所有引用变 8 字节，同样业务堆占用可能暴涨 20%~40%——32G 堆存的对象可能还没有 31G 多！\n- 对策：要么堆压回 31G 内吃压缩红利，要么直接跳到 48G+ 摊薄损失；游戏服大堆方案（如 10 万连接）选 ZGC 时更要算这笔账（ZGC JDK15 前不支持压缩指针，也是它内存开销大的原因之一）。\n相关参数：-XX:+UseCompressedOops（默认开）、-XX:+UseCompressedClassPointers（Klass 指针压缩）、JOL（org.openjdk.jol）可打印任意对象布局验证。",
      point: "考察对象布局精确知识与指针压缩原理，32G 分水岭的工程决策是核心",
      approach: "先拆对象布局三段并给出空对象 16 字节的账，再讲指针压缩的位移原理（对齐使低 3 位恒 0），重点推 32G 分水岭和『要么 31 要么 48』的决策逻辑，JOL 验证工具收尾。坑：别把 32G 讲成 4G，别漏 Mark Word 里年龄 4bit 的细节。",
      followups: [
        { q: "Mark Word 里 GC 年龄 4 bit 最大 15，这对 -XX:MaxTenuringThreshold 有什么硬限制？", a: "分代年龄只有 4 个 bit，最大表示 15，所以 MaxTenuringThreshold 设超过 15 无效，对象永远在 15 岁晋升——这是晋升调优的硬边界。" },
        { q: "为什么 8 字节对齐让 32 位压缩指针能寻址 32G 而不是 4G？", a: "对齐使地址低 3 位恒为 0，压缩时右移 3 位丢弃，32 位存的是『以 8 字节为单位的地址编号』，可寻址 2^32×8=32G，而非普通 32 位指针的 4G。" },
        { q: "你的 10 万连接方案里堆设计在 32G 上下时，你会怎么决策？", a: "先算业务真实常驻+浮动需求：≤31G 就压回压缩区吃红利；明显超 32G 直接跳 48G+ 摊薄 8 字节引用成本；绝不卡在 33~40G——多花的内存买来的容量可能还不如 31G。" }
      ],
      memory: "口诀：『头 8 盖 4 对 8』——Mark 8 字节、Klass 压完 4 字节、整体 8 对齐；『32G 是分水岭：压得住占便宜，压不住反吃亏，要么 31 要么 48』。",
      tags: ["对象布局", "指针压缩", "内存", "深挖"]
    },
    {
      id: "jvm-35",
      level: 3,
      q: "【深挖】G1 的 Humongous 对象是什么判定标准？为什么说它是 G1 的『隐形杀手』？游戏服里哪些业务会踩到？怎么规避？",
      a: "核心结论：超过 Region 大小一半的对象即 Humongous，直接占连续 N 个 Region 且不走常规回收路径——回收效率低、易引发分配失败和 Full GC，是 G1 线上事故的高频根因。\n判定与机制：\n1. 标准：对象大小 > G1HeapRegionSize / 2。Region 大小 = 堆/2048 取 2 的幂（1M~32M），如 8G 堆 Region=4M，则 >2M 的对象就是 Humongous。\n2. 存储：占一个或多个连续 Humongous Region，起点位置固定，生命周期内不移动（避免巨量拷贝）。\n3. 回收：①并发标记周期中若整个 Humongous Region 无存活引用，Cleanup 阶段直接回收；②否则只能等 Full GC 或 mixed GC 顺带（mixed 一般不碰）。JDK8u40+ 对『完全死亡的大数组』在 Young GC 也能回收（-XX:+G1EagerReclaimHumongousObjects）。\n为什么是隐形杀手：\n1. 分配即老年代：Humongous 对象分配直接占老年代 Region，绕过 Eden——分配速率监控看不出来，老年代却被快速蚕食；\n2. 连续性要求：要 N 个连续空闲 Region，堆碎片化时明明总空闲够却分配失败 → 触发 Full GC 甚至 OOM；\n3. 短寿大对象最毒：一个存活 1 秒的 10M 数组（如一次全服广播序列化结果）也要占老年代到下个标记周期，IHOP 被打满提前触发并发标记，恶性循环。\n游戏服高发场景：战斗录像/回放数据、全服排行榜一次性加载的超大 List、批量日志聚合 buffer、GM 后台一次查全表导出的 byte[]、协议包拆包时的超大消息（渠道 SDK 发来的批量数据）。\n规避：\n1. 拆：大数组拆成分片/分页处理，排行榜用分桶结构；\n2. 堆外：大 buffer 走 Netty 直接内存池，不进堆；\n3. 调 Region：-XX:G1HeapRegionSize 调大（如 4M→16M）让『大对象』变回普通对象走 Eden，但要权衡 Region 变粗后回收粒度；\n4. 监控：GC 日志关注 humongous 字样与 to-space exhausted，G1 日志里出现频繁 Humongous allocation 就要查业务。",
      point: "考察 Humongous 判定与回收特殊性及 Full GC 链路规避",
      approach: "先给判定公式（>Region/2）和 Region 大小推算法，再讲存储与回收的特殊路径；『隐形杀手』从分配即老年代、连续性要求、短寿大对象三个角度论证；游戏服场景枚举后给拆/外/扩/隔四字规避法。坑：别漏 JDK8u40 的 EagerReclaim 改进，别只讲机制不讲业务场景。",
      followups: [
        { q: "8G 堆的 G1，一个 3M 的 byte[] 会怎么分配？改成 16M Region 后呢？", a: "8G/2048≈4M Region，3M>2M 判为 Humongous，占连续 Region 直接进老年代；Region 调 16M 后 3M<8M 变回普通对象走 Eden 正常分配，但 Region 变粗回收粒度变大，需权衡。" },
        { q: "Humongous 对象为什么不做 Young GC 时顺带回收（JDK8u40 前）？难点在哪？", a: "判断 Humongous 对象死活要扫全堆找引用，与 Young GC 只查 RSet 快速回收的设计矛盾，代价不可接受；所以只能等并发标记或 Full GC，8u40 后才支持对纯死亡大数组的 EagerReclaim。" },
        { q: "你们 GM 后台的报表导出、日志服的批量消费，如果跑在同一个 JVM 会有什么 G1 层面的风险？怎么隔离？", a: "大查询结果集等于批量 Humongous 分配，瞬间蚕食老年代、挤占连续 Region，战斗业务随之 evacuation failure 甚至 Full GC。隔离：GM/报表独立 JVM 实例，导出走从库+流式分页写文件。" }
      ],
      memory: "口诀：『过半即巨兽，落地老年代，连续才肯住，回收看缘分』——规避记四字：『拆、外（堆外）、扩（Region）、隔（进程隔离）』。",
      tags: ["G1", "Humongous", "大对象", "游戏服"]
    },
    {
      id: "jvm-36",
      level: 3,
      q: "【深挖】JNI 是什么？游戏服务器会哪里碰到 native 层？JVM 崩溃生成 hs_err_pid.log 怎么分析？native 内存问题怎么排查？",
      a: "核心结论：JNI 是 Java 调本地代码（C/C++）的桥梁；一旦跨过这道桥，JVM 的安全网（GC、异常、内存边界检查）全部失效——native 崩溃直接干死整个进程，native 内存泄漏 jmap/MAT 完全看不见。\n游戏服会碰到 JNI 的场景：\n1. Netty 的 epoll transport（Linux 上默认 native epoll，性能优于 NIO）；\n2. 压缩/加密库（LZ4、zstd-jni、OpenSSL via netty-tcnative）；\n3. 图形/物理计算（MMORPG 服务端寻路、碰撞检测用 C++ 库加速）；\n4. RocksDB（嵌入式存储，JVM 外维护 block cache）；\n5. JDK 自身（Unsafe、DirectByteBuffer 底层）。\nhs_err_pid 分析（进程被 SIGSEGV 干掉后唯一现场）：\n1. 头部：# A fatal error... SIGSEGV / SIGBUS，异常信号与 Problematic frame——frame 前缀决定凶手：J = JIT 编译的 Java 方法，j = 解释执行 Java，C = native 库（如 libc.so、libxxx.so，基本坐实 native 库 bug），V = JVM 自身（libjvm.so，可能是 JVM bug 或被 native 踩了内存）；\n2. Stack 段：崩溃点调用栈，C 库里哪个函数崩的；\n3. 寄存器与内存映射：定位踩了哪段内存；\n4. 常见根因：native 库 bug（升级版本）、native 内存被踩（越界写殃及 JVM）、堆外内存耗尽后 native malloc 失败未处理。\nnative 内存排查三板斧：\n1. NMT：-XX:NativeMemoryTracking=summary/detail，jcmd <pid> VM.native_memory baseline + diff 对比增长（Internal=直接内存等、Other=线程栈等）——只管 JVM 自己账内的 native 内存；\n2. 系统层：top/pmap 看 RES 与堆+Xmx 的差额，jemalloc/tcmalloc 的 profiling（MALLOC_CONF=prof:true）抓第三方 native 库的分配；\n3. 隔离验证：嫌疑 native 库（如 RocksDB）单独限制其缓存参数（block cache 设上限），观察 RES 是否稳定。\n防御设计：重度 native 计算（物理引擎、压缩）可考虑独立进程 + IPC，崩了不拖死主游戏服——架构上把『会踩内存的』和『不能死的』分开。",
      point: "考察 native 层风险：JNI 场景、hs_err 判读、内存排查",
      approach: "先立论『过 JNI 桥后 JVM 安全网失效』，列游戏服五类 native 场景；hs_err 按信号、frame 前缀、Stack 三段讲判读法；native 内存给 NMT 管内、malloc 采样管外、隔离验证三招。坑：别漏『frame 是 V 不一定是 JVM bug』的辨析。",
      followups: [
        { q: "hs_err 里 Problematic frame 是 [libjvm.so+...] 就一定是 JVM bug 吗？为什么？", a: "不一定。native 库越界写可能踩坏 JVM 内部数据结构，崩溃延迟到 JVM 自己的代码里才暴露——frame 在 V 区也可能是被外库殃及。要结合最近引入/升级的 native 库与崩溃可复现性综合判断。" },
        { q: "NMT 看不到第三方 native 库的内存怎么办？jemalloc profiling 怎么开？", a: "NMT 只记 JVM 账内 native 内存。第三方库用 jemalloc/tcmalloc profiling（MALLOC_CONF=prof:true，jeprof 出火焰图）；或用 pmap/RES 与已知项做减法定位。" },
        { q: "Netty 游戏服用 epoll native transport 有什么收益？出了 native 崩溃怎么权衡？", a: "收益：边缘触发、更少系统调用、支持更多 TCP 选项，高连接下 CPU 更省。风险：native 崩溃无 Java 异常直接死进程。权衡：用成熟版本+灰度发布+崩溃自动拉起，收益远大于风险，生产普遍启用。" }
      ],
      memory: "口诀：『过了 JNI 桥，GC 管不着』；hs_err 记『J 自己、C 外库、V 虚拟机，先看 frame 定凶手』；native 泄漏记『NMT 管内、malloc prof 管外、实在不行拆进程』。",
      tags: ["JNI", "hs_err", "native内存", "深挖"]
    },
    {
      id: "jvm-37",
      level: 3,
      q: "【深挖】Safepoint（安全点）到底是什么？为什么『GC 很快但总停顿很长』？什么是 TTSP？游戏服哪些代码模式会让线程迟迟到不了安全点？",
      a: "核心结论：Safepoint 是 JVM 让全体业务线程暂停的『集合点』，总停顿 = 最慢线程赶到安全点的时间（TTSP）+ 安全点内干活时间——GC 本身 20ms，但某个线程迟到 500ms，全员等它，玩家体感就是 520ms 卡死。\n机制：\n1. 为什么需要：GC 移动对象、偏向锁撤销、类重定义（热更 redefine）、栈去优化等操作要求对象图『稳定不动』，必须让所有 Java 线程停在已知安全状态（堆栈可扫描、对象引用位置确定）。\n2. 怎么实现：JVM 在方法调用、循环回边（back-edge）、返回点等位置插入安全点检查（轮询一个全局页的标志位，成本极低）；需要全局暂停时 VM Thread 置位标志，各线程跑到下一个检查点自挂起。\n3. 日志：-Xlog:safepoint（JDK9+）或 -XX:+PrintSafepointStatistics，关键字段：time to reach safepoint（TTSP）与 safepoint 内耗时（vmop）。\n总停顿公式：Real STW = TTSP（等最慢线程）+ VM 操作耗时。GC 日志只报告后者，前者藏在 safepoint 日志里——这就是『GC 日志 20ms 但监控显示 500ms 停顿』的真相。\n游戏服 TTSP 元凶代码模式：\n1. 超长 counted loop：C2 对『计数循环』（int 索引的紧凑 for）默认不在回边插安全点（避免影响数值计算性能），一个循环几亿次的数学计算（寻路预处理、伤害公式批跑、GM 后台全表统计）可能跑几百 ms 全程不检查安全点；对策：索引用 long（强制插安全点检查）、拆分循环、或放到独立线程池并控制批大小；\n2. 大段 native 调用：JNI 里干活不算『在 Java 里跑』，返回时才检查（native 内其实是 safepoint-safe 的，但若 native 里回调 Java 或长时间不返回会拉长 TTSP）；\n3. 偏向锁批量撤销（revoke 风暴）：高竞争下偏向锁失效要全局 safepoint 批量撤销，老 JDK（15 前）典型，表现为周期性规律停顿；\n4. 热更新 redefine/Arthas 增强：类重定义必须 safepoint，类越多 vmop 越长。\n排查套路：业务延迟尖刺时间戳 → 对 safepoint 日志找同时间窗口 → 看是 TTSP 长（找迟到的线程，配合 jstack/火焰图）还是 vmop 长（看是什么操作触发的）。",
      point: "考察 Safepoint 本质与 TTSP 隐蔽性及大循环改造",
      approach: "先给总停顿公式（TTSP+vmop）解释『GC 快但停顿长』，再讲 safepoint 轮询实现与日志字段；元凶按计数循环、JNI、偏向锁撤销、redefine 四类讲，改造对策要具体；时间戳对齐排查收尾。坑：别把 safepoint 等同 GC，别漏 C2 counted loop。",
      followups: [
        { q: "C2 为什么敢在 counted loop 里不插安全点？它怎么保证大多数情况下不出事？", a: "计数循环迭代边界可预知，统计上执行很快，省掉每轮检查换数值计算性能；出事的正是边界巨大的例外。JDK10+ 引入 LoopStripMining 把大循环分段插安全点，默认开启后问题大幅缓解。" },
        { q: "-XX:+SafepointTimeout 和 -XX:SafepointTimeoutDelay 怎么用？", a: "开 -XX:+SafepointTimeout 并设 -XX:SafepointTimeoutDelay=毫秒数；超过该延迟仍未全员到达时，JVM 打印还没到达安全点的线程清单，直接点名迟到者，配合 jstack 看它在执行什么。" },
        { q: "你们战斗服每帧批量结算几千个单位，这段循环会不会成为 TTSP 隐患？怎么改造？", a: "会，若是紧凑 int 计数循环就是隐患。改造：索引改 long 强制插安全点、按批次拆分（每 256 个单位一让步）、或结算放业务线程池分片并行；用 safepoint 日志/JFR 验证改造效果。" }
      ],
      memory: "口诀：『总停顿 = 等最后一个人到齐 + 开会时长』——GC 日志只报开会时长，迟到的人藏在 safepoint 日志里；游戏服记『紧凑大循环是迟到专业户，int 换 long 或拆批』。",
      tags: ["Safepoint", "TTSP", "STW", "游戏服"]
    }
  ]
};
