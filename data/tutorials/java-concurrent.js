window.TB = window.TB || {};
window.TB["java-concurrent"] = {
  id: "java-concurrent",
  name: "Java 并发编程",
  icon: "🧵",
  nodes: [
 {
  "id": "java-concurrent-thread-basics",
  "title": "线程模型与生命周期",
  "layer": 0,
  "depends": [],
  "covers": [
   "java-concurrent-01",
   "java-concurrent-02",
   "java-concurrent-05",
   "java-concurrent-29"
  ],
  "quiz": [
   "java-concurrent-01",
   "java-concurrent-05",
   "java-concurrent-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "线程是并发的原子单位：六个状态、四种创建方式、协作式中断，这三件事是读懂 jstack 和设计线程池的地基。"
   },
   {
    "t": "pre",
    "items": [
     "理解「线程是 CPU 调度的最小单位」，JVM 线程与 OS 线程的关系",
     "会用 jstack 抓线程快照（线上排查基本技能）",
     "了解游戏服『一个玩家一串行线程』的基本约束"
    ]
   },
   {
    "t": "h",
    "text": "一、六状态模型：状态机别背错"
   },
   {
    "t": "p",
    "text": "Thread.State 只定义 6 种状态。最容易错的两点：一是 RUNNABLE 把『就绪』和『运行中』合并了，JVM 不区分；二是 BLOCKED 只认 synchronized 抢锁失败，而 ReentrantLock 抢不到锁进的是 WAITING（park）。写代码前先把这条边界刻在脑子里。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\"><rect x=\"20\" y=\"15\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"105\" y=\"38\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">NEW</text><text x=\"105\" y=\"56\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">new 未 start</text><rect x=\"235\" y=\"15\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"38\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">RUNNABLE</text><text x=\"320\" y=\"56\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">就绪 + 运行中</text><rect x=\"450\" y=\"15\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"535\" y=\"38\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">TERMINATED</text><text x=\"535\" y=\"56\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">run 结束</text><path d=\"M190 41 L233 41\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#a1)\"/><text x=\"211\" y=\"33\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">start</text><path d=\"M405 41 L448 41\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"426\" y=\"33\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">结束</text><rect x=\"20\" y=\"110\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"105\" y=\"133\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">BLOCKED</text><text x=\"105\" y=\"151\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">等 synchronized</text><rect x=\"235\" y=\"110\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"133\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">WAITING</text><text x=\"320\" y=\"151\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">wait/park/join</text><rect x=\"450\" y=\"110\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"535\" y=\"133\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">TIMED_WAITING</text><text x=\"535\" y=\"151\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">sleep/parkNanos</text><path d=\"M105 67 C105 85 105 92 105 108\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M100 100 L105 110 L110 100\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"122\" y=\"90\" font-size=\"12\" fill=\"var(--accent)\">抢锁失败</text><path d=\"M320 67 L320 108\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"338\" y=\"92\" font-size=\"12\" fill=\"var(--accent)\">park/wait</text><path d=\"M535 67 L535 108\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"553\" y=\"92\" font-size=\"12\" fill=\"var(--accent)\">sleep</text><path d=\"M320 162 L320 200 L105 200 L105 166\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"210\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">unpark / notify / 锁释放</text><path d=\"M535 162 L535 205\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"550\" y=\"195\" font-size=\"12\" fill=\"var(--accent)\">超时/唤醒</text><path d=\"M105 205 L105 240\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"122\" y=\"228\" font-size=\"12\" fill=\"var(--accent)\">回 RUNNABLE</text><defs><marker id=\"a1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6\" fill=\"var(--accent)\"/></marker></defs></svg>",
    "caption": "图：线程六状态流转（BLOCKED 只来自 synchronized，Lock 排队是 WAITING）"
   },
   {
    "t": "h",
    "text": "二、创建线程：四种方式，生产只用线程池"
   },
   {
    "t": "list",
    "items": [
     "继承 Thread 重写 run()：任务与执行体耦合，不推荐",
     "实现 Runnable 传给 Thread：解耦任务与执行，仍裸线程",
     "Callable + FutureTask：能拿返回值和异常，仍裸线程",
     "线程池 submit/execute：生产环境唯一正确姿势"
    ]
   },
   {
    "t": "p",
    "text": "游戏服为什么严禁 new Thread()？默认线程栈约 1MB，几千个裸线程就是几 GB 内存；突发流量一个玩家一个线程直接把机器打爆。更致命的是第 4 条——游戏服要求『同一玩家的消息在同一线程串行执行』，乱起线程直接破坏并发约束。生产上线程池统一命名（game-logic-1）、统一 shutdown 优雅停机、统一监控。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 游戏服正确姿势：统一线程池 + 命名 + 有界队列\nThreadFactory named = r -> new Thread(r, \"game-logic-\" + r.hashCode());\nExecutorService pool = new ThreadPoolExecutor(\n    8, 16, 60L, TimeUnit.SECONDS,\n    new ArrayBlockingQueue<Runnable>(4096), named,\n    new ThreadPoolExecutor.CallerRunsPolicy());"
   },
   {
    "t": "h",
    "text": "三、sleep/wait 与协作式中断"
   },
   {
    "t": "p",
    "text": "sleep 抱着锁睡觉，wait 放锁进等待队列。wait 必须在 synchronized 内，且必须放 while 循环里判条件防虚假唤醒。中断是协作式的：interrupt() 只设标志，interrupted() 是静态方法且会清除标志，isInterrupted() 只查询。为什么 stop() 被废弃？它强制杀死线程并释放所有锁，玩家数据改一半就被放下，其他线程读到半成品。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 优雅停机：标志位 + 中断协作，让线程把活干完再退\nprivate volatile boolean shutdown;\n\n// 业务循环线程\nwhile (!shutdown && !Thread.currentThread().isInterrupted()) {\n    try {\n        Message msg = queue.take();      // 阻塞等待\n        handle(msg);                      // 处理玩家消息\n    } catch (InterruptedException e) {\n        Thread.currentThread().interrupt(); // 必须恢复标志，不能吞\n    }\n}\n// 收到 shutdown 后：落盘、释放资源、退出"
   },
   {
    "t": "pits",
    "items": [
     "BLOCKED 和 WAITING 分不清：BLOCKED 只在抢 synchronized 时出现；ReentrantLock 排队是 WAITING（park）",
     "RUNNABLE 一定在跑？不一定——内核态 IO 阻塞时 Java 层仍显示 RUNNABLE，要结合系统态看",
     "interrupted() 会清除标志：捕获 InterruptedException 后不恢复标志，上层 shutdownNow 永远停不下来",
     "wait() 用 if 判条件：虚假唤醒或 notifyAll 后条件被破坏，会带着失效条件继续执行"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：六状态（新就阻等超时终）→ 生产用线程池禁裸线程 → sleep 抱锁 wait 放锁 → 中断是协作式、stop 是事故。这套地基直接支撑后面所有 JUC 内容。"
   }
  ]
 },
 {
  "id": "java-concurrent-jmm",
  "title": "JMM 内存模型与可见性",
  "layer": 0,
  "depends": [],
  "covers": [
   "java-concurrent-04",
   "java-concurrent-12",
   "java-concurrent-10",
   "java-concurrent-18"
  ],
  "quiz": [
   "java-concurrent-04",
   "java-concurrent-12",
   "java-concurrent-18"
  ],
  "body": [
   {
    "t": "lead",
    "text": "JMM 定义『主内存 + 工作内存』的抽象，用 happens-before 给程序员可见性承诺；volatile 是它的最小抓手，ThreadLocal 是它的反面（线程封闭）。"
   },
   {
    "t": "pre",
    "items": [
     "CPU 缓存与 MESI 一致性：每个核有自己的缓存行",
     "上一节的线程状态与中断（本节点在 layer 1 的首站）",
     "DCL 单例为什么加 volatile（现象先记住，原理本章讲透）"
    ]
   },
   {
    "t": "h",
    "text": "一、JMM：为什么需要内存模型"
   },
   {
    "t": "p",
    "text": "每个线程有自己的工作内存（寄存器 + 缓存），变量副本改完要先写回主存，别的线程才看得见。写回时机不确定，就出现『改了看不见』。JMM 是 Java 层面的内存模型抽象，屏蔽不同 CPU 的差异，解决三大问题：可见性、有序性（重排序）、原子性。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">主内存（共享变量）</text><rect x=\"20\" y=\"34\" width=\"600\" height=\"46\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">player.gold  volatile shutdown  configVersion</text><rect x=\"30\" y=\"120\" width=\"270\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"165\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程 1 工作内存</text><text x=\"165\" y=\"165\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">缓存副本 + 本地变量</text><rect x=\"340\" y=\"120\" width=\"270\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"475\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程 2 工作内存</text><text x=\"475\" y=\"165\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">缓存副本 + 本地变量</text><path d=\"M165 120 L165 86 L300 86 L300 82\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"190\" y=\"102\" font-size=\"12\" fill=\"var(--accent)\">volatile 写：立即刷回主存</text><path d=\"M340 82 L340 86 L475 86 L475 118\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"410\" y=\"102\" font-size=\"12\" fill=\"var(--accent)\">volatile 读：强制从主存读</text><text x=\"20\" y=\"216\" font-size=\"13\" fill=\"var(--ink)\">非 volatile 变量：写回时机不定，可能长时间读不到新值</text><path d=\"M20 226 L620 226\" stroke=\"var(--line)\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/><text x=\"20\" y=\"250\" font-size=\"12\" fill=\"var(--muted)\">happens-before 保证：volatile 写 hb 后续对该 volatile 的读；锁释放 hb 后续加锁；传递性 A hb B 且 B hb C 则 A hb C</text></svg>",
    "caption": "图：JMM 主内存 + 工作内存，volatile 的写刷回/读直达"
   },
   {
    "t": "h",
    "text": "二、volatile：可见有序不原子"
   },
   {
    "t": "list",
    "items": [
     "可见性：写 volatile 变量立即刷回主存，读强制从主存读",
     "有序性：插入内存屏障，禁止 volatile 读写与周围指令重排（DCL 防半初始化）",
     "不保证原子性：i++ 是读-改-写三步，volatile 会丢更新"
    ]
   },
   {
    "t": "p",
    "text": "游戏服典型用法：停服/维护标志位 private volatile boolean shutdown，GM 后台下发指令后 IO 线程和业务线程立刻看到；配置热更新版本号 volatile long configVersion；DCL 单例的 private static volatile Instance。注意 count++ 用 volatile 是经典错误——复合操作必须 synchronized 或 CAS。"
   },
   {
    "t": "h",
    "text": "三、happens-before：八条承诺选三条重点"
   },
   {
    "t": "p",
    "text": "不需要背全部八条，面试吃透三条就够：程序次序规则（单线程书写顺序）、锁规则（unlock hb 后续 lock）、volatile 规则（写 hb 后续读），外加传递性。DCL 为什么必须 volatile？对象创建分『分配内存-初始化-引用赋值』三步，后两步可重排，非 volatile 时可能拿到字段未初始化的半成品对象。"
   },
   {
    "t": "h",
    "text": "四、ThreadLocal：线程封闭与内存泄漏"
   },
   {
    "t": "p",
    "text": "ThreadLocal 为每个线程维护独立副本（ThreadLocalMap），key 是弱引用、value 是强引用。泄漏根源不是弱引用 key，而是『线程长命 + value 强引用』：key 被 GC 后 Entry 变脏，但 value 仍被 Thread→ThreadLocalMap→Entry→value 强引用链抓住，池化线程永不死 value 永不释放。Netty/Disruptor 的永生线程下，残留还会造成玩家上下文串号——上个玩家的数据被下个消息读到。铁律：用完 finally remove()。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><rect x=\"20\" y=\"30\" width=\"150\" height=\"50\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"95\" y=\"53\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Thread</text><text x=\"95\" y=\"71\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">池化线程长命</text><path d=\"M170 55 L220 55\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"195\" y=\"47\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">强引用</text><rect x=\"222\" y=\"30\" width=\"190\" height=\"50\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"317\" y=\"53\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">threadLocals Map</text><text x=\"317\" y=\"71\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">强引用</text><path d=\"M412 55 L462 55\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"437\" y=\"47\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">强引用</text><rect x=\"464\" y=\"30\" width=\"156\" height=\"50\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"542\" y=\"53\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Entry(key=null)</text><text x=\"542\" y=\"71\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">脏条目，value 仍强引用</text><rect x=\"464\" y=\"110\" width=\"156\" height=\"50\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"542\" y=\"133\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Entry(key 弱引用)</text><text x=\"542\" y=\"151\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">key 可被 GC 回收</text><path d=\"M542 80 L542 108\" stroke=\"var(--lv3)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><text x=\"560\" y=\"98\" font-size=\"12\" fill=\"var(--lv3)\">泄漏点</text><text x=\"20\" y=\"196\" font-size=\"13\" fill=\"var(--ink)\">正确姿势：static final ThreadLocal + finally remove()</text><text x=\"20\" y=\"220\" font-size=\"12\" fill=\"var(--muted)\">游戏服：解码层塞上下文 → 业务处理 → finally remove，杜绝跨消息残留串号</text></svg>",
    "caption": "图：ThreadLocal 泄漏引用链（key 弱引用 value 强引用，线程不死泄漏不亡）"
   },
   {
    "t": "pits",
    "items": [
     "说『volatile 保证线程安全』：大错。它只保证可见有序，i++ 照样丢更新",
     "DCL 单例不加 volatile：对象半初始化被读到，线上偶发 NPE 最坑",
     "ThreadLocal 用完不 remove：池化线程脏数据串号，玩家 A 上下文串到玩家 B",
     "把大对象塞 ThreadLocal 又不用：value 强引用永不释放，等于隐性泄漏"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：JMM 抽象主存/工作内存 → volatile 六字『可见有序不原子』→ hb 三重点（程序次序/锁/volatile + 传递性）→ ThreadLocal 是线程封闭但要防泄漏。这张网是理解 CAS、AQS、锁升级的语义前提。"
   }
  ]
 },
 {
  "id": "java-concurrent-synchronized",
  "title": "synchronized 与锁升级",
  "layer": 1,
  "depends": [
   "java-concurrent-thread-basics"
  ],
  "covers": [
   "java-concurrent-03",
   "java-concurrent-11",
   "java-concurrent-28"
  ],
  "quiz": [
   "java-concurrent-03",
   "java-concurrent-11",
   "java-concurrent-28"
  ],
  "body": [
   {
    "t": "lead",
    "text": "synchronized 锁的是对象不是代码；JDK6 起按竞争强度『无锁→偏向→轻量→重量』只升不降，JDK15 后偏向锁默认关闭——版本意识是加分项。"
   },
   {
    "t": "pre",
    "items": [
     "线程六状态（BLOCKED 与锁的关系）",
     "对象头 Mark Word 的概念（锁状态就存在这里）",
     "volatile 与 JMM 的可见性语义"
    ]
   },
   {
    "t": "h",
    "text": "一、三种用法锁的是什么"
   },
   {
    "t": "list",
    "items": [
     "修饰实例方法：锁 this（当前实例）",
     "修饰静态方法：锁 Class 对象，全局唯一",
     "修饰代码块 synchronized(obj)：锁指定对象，粒度最细最常用"
    ]
   },
   {
    "t": "p",
    "text": "核心理解：锁的是对象不是代码。两个线程用同一个 obj 才互斥，各 new 一个锁对象等于没锁。可重入保证同一线程能重复获取同一把锁——玩家消息处理里调多个加锁方法不会自己锁死自己。别用 String/Integer 当锁对象：String 有驻留池、Integer 有 -128~127 缓存，看似无关的代码可能引用到同一对象互相阻塞。"
   },
   {
    "t": "h",
    "text": "二、锁升级：按竞争强度逐级付成本"
   },
   {
    "t": "p",
    "text": "JDK6 后 synchronized 走『无锁 → 偏向锁 → 轻量级锁 → 重量级锁』，只升不降。无锁：Mark Word 存 hashcode。偏向锁：记录线程 ID，同线程再进入零 CAS 开销——但撤销需全局安全点，高并发下成本高，JDK15（JEP 374）起默认关闭、JDK18 移除实现。轻量级锁：栈上建 Lock Record，CAS 把 Mark Word 指向它，失败者自适应自旋。重量级锁：Mark Word 指向 ObjectMonitor，抢不到的进队列 BLOCKED。为什么这么设计？无竞争时加锁 ≈ 一次 CAS；轻竞争自旋几十纳秒，比重线程挂起/唤醒（微秒级切换）便宜得多；重竞争才付内核态成本。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">synchronized 锁升级路径（JDK15 起偏向锁默认禁用，主流 LTS 上实为三级）</text><rect x=\"20\" y=\"40\" width=\"130\" height=\"58\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"85\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">无锁</text><text x=\"85\" y=\"83\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Mark Word 存 hash</text><path d=\"M150 69 L178 69\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"164\" y=\"61\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">CAS</text><rect x=\"180\" y=\"40\" width=\"130\" height=\"58\" rx=\"8\" fill=\"var(--lv2)\" opacity=\"0.25\" stroke=\"var(--lv2)\"/><text x=\"245\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">偏向锁</text><text x=\"245\" y=\"83\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JDK15 默认关闭</text><path d=\"M310 69 L338 69\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"324\" y=\"61\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">竞争</text><rect x=\"340\" y=\"40\" width=\"130\" height=\"58\" rx=\"8\" fill=\"var(--lv2)\" opacity=\"0.4\" stroke=\"var(--lv2)\"/><text x=\"405\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">轻量级锁</text><text x=\"405\" y=\"83\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">自旋等待</text><path d=\"M470 69 L498 69\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"484\" y=\"61\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">自旋失败</text><rect x=\"500\" y=\"40\" width=\"120\" height=\"58\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"560\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">重量级锁</text><text x=\"560\" y=\"83\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ObjectMonitor</text><text x=\"20\" y=\"130\" font-size=\"13\" fill=\"var(--ink)\">成本分层逻辑：</text><text x=\"20\" y=\"152\" font-size=\"12\" fill=\"var(--muted)\">无竞争：加锁 ≈ 一次 Mark Word CAS，几乎免费</text><text x=\"20\" y=\"172\" font-size=\"12\" fill=\"var(--muted)\">轻竞争：自旋几十纳秒拿到锁，远便宜于挂起/唤醒（微秒级）</text><text x=\"20\" y=\"192\" font-size=\"12\" fill=\"var(--muted)\">重竞争：才付出内核态切换成本，进队列 BLOCKED</text><rect x=\"20\" y=\"212\" width=\"600\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"36\" y=\"236\" font-size=\"13\" fill=\"var(--accent)\">JIT 兄弟优化：</text><text x=\"36\" y=\"258\" font-size=\"12\" fill=\"var(--muted)\">锁消除——逃逸分析发现锁对象不逃出线程，直接把锁去掉（StringBuffer 单线程 append）；锁粗化——循环内反复对同一对象加解锁，合并成循环外一把锁</text></svg>",
    "caption": "图：锁升级四阶段与成本分层（含 JIT 锁消除/锁粗化）"
   },
   {
    "t": "h",
    "text": "三、JIT 的锁消除与锁粗化"
   },
   {
    "t": "p",
    "text": "锁消除：逃逸分析判定锁对象不逃出当前线程，这把锁无意义，JIT 直接去掉——所以单线程用 StringBuffer 没有想象中慢。锁粗化：相邻操作反复对同一对象加解锁（循环体内 synchronized），合并成一把锁。启示：别手动把循环里的 synchronized 挪出去『优化』，JIT 比你聪明；真正要手动控制粒度的是业务架构（该不该把整段玩家处理包在大锁里）。评估性能用 JMH 实测，不靠直觉。"
   },
   {
    "t": "pits",
    "items": [
     "『synchronized 很重』是过时认知：JDK6 优化后低竞争下与 ReentrantLock 相当",
     "偏向锁版本答错：JDK8 默认开，JDK15 默认关，JDK18 移除实现——面试官追问版本要能接住",
     "用 String/Integer 当锁对象：驻留池/缓存导致看似无关的代码互相阻塞",
     "锁对象为 null：进入 synchronized 直接 NPE"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三种用法锁的对象各不同 → 升级路线只升不降、按竞争分层付成本 → 版本意识（JDK15 偏向锁废弃）→ JIT 锁消除/锁粗化别手动干预。游戏服低竞争短临界区用 synchronized 简单可靠。"
   }
  ]
 },
 {
  "id": "java-concurrent-cas-atomic",
  "title": "CAS 与原子类",
  "layer": 1,
  "depends": [
   "java-concurrent-jmm"
  ],
  "covers": [
   "java-concurrent-06",
   "java-concurrent-13",
   "java-concurrent-21",
   "java-concurrent-24",
   "java-concurrent-27"
  ],
  "quiz": [
   "java-concurrent-06",
   "java-concurrent-13",
   "java-concurrent-24"
  ],
  "body": [
   {
    "t": "lead",
    "text": "CAS 是 CPU 原子指令，是无锁乐观并发的基石：AtomicInteger 用 volatile + CAS + 自旋实现，但三大缺点（ABA、自旋烧 CPU、单变量）决定了它的适用边界。"
   },
   {
    "t": "pre",
    "items": [
     "JMM 可见性语义（volatile 变量与内存屏障）",
     "i++ 为什么不是原子操作",
     "上一节的锁升级（CAS 是轻量级锁的核心动作）"
    ]
   },
   {
    "t": "h",
    "text": "一、CAS 是什么"
   },
   {
    "t": "p",
    "text": "Compare-And-Swap：内存值 == 期望值才更新为新值，否则失败重试。AtomicInteger 内部 value 用 volatile 修饰保证可见性，compareAndSet 调用底层 CAS，自旋重试直到成功。JDK9 起原子类从 sun.misc.Unsafe 迁移到 java.lang.invoke.VarHandle，最终仍映射到 CPU 指令（x86 的 cmpxchg）。优点：无锁、无阻塞切换、不会死锁。缺点：ABA 问题、高竞争自旋空转烧 CPU、只能保证单变量原子性。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">CAS 三步：读 → 比 → 换（成功才更新，失败自旋重试）</text><rect x=\"20\" y=\"40\" width=\"180\" height=\"54\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">1. 读取旧值 expected</text><text x=\"110\" y=\"83\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">内存 value = A</text><path d=\"M200 67 L238 67\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"219\" y=\"59\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">比较</text><rect x=\"240\" y=\"40\" width=\"180\" height=\"54\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"330\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">2. value == expected ?</text><text x=\"330\" y=\"83\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CAS 指令原子判断</text><path d=\"M420 67 L458 67\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"439\" y=\"59\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">是</text><rect x=\"460\" y=\"40\" width=\"160\" height=\"54\" rx=\"8\" fill=\"var(--lv2)\" opacity=\"0.35\" stroke=\"var(--lv2)\"/><text x=\"540\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">3. 更新为新值 C</text><text x=\"540\" y=\"83\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">写入成功</text><path d=\"M540 94 L540 120\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"556\" y=\"112\" font-size=\"12\" fill=\"var(--accent)\">返回 true</text><path d=\"M330 94 C330 130 200 130 200 105\" fill=\"none\" stroke=\"var(--lv3)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><text x=\"246\" y=\"140\" font-size=\"12\" fill=\"var(--lv3)\">失败：重读新值再试（自旋）</text><text x=\"20\" y=\"172\" font-size=\"13\" fill=\"var(--accent)\">ABA 陷阱：</text><text x=\"20\" y=\"194\" font-size=\"12\" fill=\"var(--muted)\">值被改走又改回来（A→B→A），CAS 只比对值判断不出——纯数值无伤大雅，链表节点复用场景致命</text><text x=\"20\" y=\"216\" font-size=\"12\" fill=\"var(--muted)\">解法：AtomicStampedReference 值 + 版本号打包整体比较（DB 乐观锁 version 字段是同一思想）</text></svg>",
    "caption": "图：CAS 三步与 ABA 问题（版本号解法）"
   },
   {
    "t": "h",
    "text": "二、原子类四分类"
   },
   {
    "t": "list",
    "items": [
     "基本类型：AtomicInteger / AtomicLong / AtomicBoolean",
     "数组：AtomicIntegerArray 等——对指定下标元素原子更新，不锁整个数组",
     "引用：AtomicReference（换对象引用）、AtomicStampedReference（防 ABA）、AtomicMarkableReference（布尔标记）",
     "字段更新器：AtomicIntegerFieldUpdater 等——反射更新已有类的 volatile 字段，省对象实例内存（Netty 内部大量使用）"
    ]
   },
   {
    "t": "h",
    "text": "三、LongAdder：高竞争下的分段救星"
   },
   {
    "t": "p",
    "text": "AtomicLong 高竞争下 N-1 个线程自旋失败，CPU 空转 + 缓存行乒乓。LongAdder 把热点拆成 base + Cell[] 数组，线程哈希到不同 Cell 各自 CAS 累加，冲突时按 2 的幂扩容；Cell 标 @Contended 防伪共享。sum() 无锁遍历汇总——不是原子快照，统计期间读到近似值。选型：高频写低频读（QPS、日志计数）用 LongAdder；需要精确返回值做强一致判断（发号器、满员判断）用 AtomicLong。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">AtomicLong vs LongAdder：单点自旋 vs 分段累加</text><rect x=\"20\" y=\"40\" width=\"280\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"160\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">AtomicLong 单点瓶颈</text><rect x=\"50\" y=\"78\" width=\"60\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"80\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">T1</text><rect x=\"130\" y=\"78\" width=\"60\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"160\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">T2</text><rect x=\"210\" y=\"78\" width=\"60\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"240\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">T3</text><rect x=\"110\" y=\"128\" width=\"90\" height=\"26\" rx=\"6\" fill=\"var(--lv3)\" opacity=\"0.3\" stroke=\"var(--lv3)\"/><text x=\"155\" y=\"146\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">同一个 value</text><rect x=\"340\" y=\"40\" width=\"280\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"480\" y=\"62\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">LongAdder 分段 Cell[]</text><rect x=\"360\" y=\"78\" width=\"56\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv1)\"/><text x=\"388\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Cell0</text><rect x=\"428\" y=\"78\" width=\"56\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv1)\"/><text x=\"456\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Cell1</text><rect x=\"496\" y=\"78\" width=\"56\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv1)\"/><text x=\"524\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Cell2</text><rect x=\"564\" y=\"78\" width=\"40\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--lv1)\"/><text x=\"584\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">…</text><text x=\"480\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">线程哈希到不同 Cell，竞争分散</text><text x=\"480\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Cell 标 @Contended 防伪共享</text><text x=\"20\" y=\"196\" font-size=\"12\" fill=\"var(--muted)\">伪共享提醒：多个 Cell 若挤在同一缓存行（64 字节）会互相失效——@Contended（JDK8 引入，业务代码需 -XX:-RestrictContended）让每个 Cell 独占缓存行</text><text x=\"20\" y=\"222\" font-size=\"12\" fill=\"var(--muted)\">选型分水岭：sum() 非原子快照 → 监控统计用 LongAdder；发号/满员判断要精确值用 AtomicLong</text></svg>",
    "caption": "图：AtomicLong 单点 vs LongAdder 分段（@Contended 防伪共享）"
   },
   {
    "t": "pits",
    "items": [
     "i++ 用 AtomicInteger 还丢值：忘了 incrementAndGet 才是原子，直接 get() 后自己加是普通读",
     "CAS 自旋太久不收敛：高竞争下 LongAdder 或退回加锁，别硬自旋",
     "ABA 场景判断错：纯数值无害、链表节点复用致命——先说清『这个场景 ABA 真有害吗』",
     "FieldUpdater 字段忘加 volatile：原子操作前提不满足，改动不可见"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：CAS=乐观改稿（读-比-换）→ 四类原子类各管一种形态 → 高竞争上 LongAdder 分段 + @Contended 防伪共享 → ABA 用版本号。记住『单变量 CAS，多变量回线程串行』的边界。"
   }
  ]
 },
 {
  "id": "java-concurrent-collections",
  "title": "并发容器与阻塞队列",
  "layer": 1,
  "depends": [
   "java-concurrent-jmm"
  ],
  "covers": [
   "java-concurrent-09",
   "java-concurrent-30",
   "java-concurrent-34"
  ],
  "quiz": [
   "java-concurrent-09",
   "java-concurrent-30",
   "java-concurrent-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从 wait/notify 到 Condition 到 BlockingQueue 到 Disruptor，是一条『锁 → 精确唤醒 → 有界缓冲 → 无锁』的演进线——并发容器的选型题答的就是这条线。"
   },
   {
    "t": "pre",
    "items": [
     "AQS 的 state 与 Condition 机制（ArrayBlockingQueue 内部就是 ReentrantLock + 双 Condition）",
     "wait/notify 的 Monitor 语义",
     "生产者消费者模型"
    ]
   },
   {
    "t": "h",
    "text": "一、wait/notify 四大铁律"
   },
   {
    "t": "list",
    "items": [
     "必须在 synchronized 内调用（否则 IllegalMonitorStateException）",
     "while 循环判条件防虚假唤醒与 notifyAll 后条件被破坏",
     "wait 释放锁进等待队列；notify 只叫一个、notifyAll 全叫醒再抢锁",
     "共享缓冲必须有界，满则 wait 空则 wait"
    ]
   },
   {
    "t": "p",
    "text": "等待队列 ≠ 锁池：wait() 的线程在等待队列等『条件成立』的通知；抢不到 synchronized 的线程在锁池（Entry List）等『锁本身』。流程是 wait → 等待队列 → notify 搬回锁池 → 抢到锁才继续。为什么推荐 Condition？一把 Lock 可挂多个 Condition，缓冲区『满』和『空』各一个等待队列，signal 精确叫醒该醒的一类，不会像 notifyAll 那样白叫醒同类线程抢一轮锁。"
   },
   {
    "t": "h",
    "text": "二、BlockingQueue 五种实现怎么选"
   },
   {
    "t": "table",
    "head": [
     "队列",
     "特性",
     "游戏服用途"
    ],
    "rows": [
     [
      "ArrayBlockingQueue",
      "数组有界，一把锁",
      "业务线程池队列，必须有界防 OOM"
     ],
     [
      "LinkedBlockingQueue",
      "链表默认近无界，两把锁",
      "日志异步写（显式传容量）"
     ],
     [
      "SynchronousQueue",
      "不存元素，put 等 take",
      "CachedThreadPool 用它"
     ],
     [
      "PriorityBlockingQueue",
      "按优先级出队，无界",
      "活动事件按优先级调度"
     ],
     [
      "DelayQueue",
      "到期才能取",
      "buff 到期结算等轻量定时"
     ]
    ]
   },
   {
    "t": "p",
    "text": "核心思路：生产环境队列必须有界 + 合理拒绝策略，防消息洪峰 OOM。但真正的游戏服核心消息链路往往不用 BlockingQueue，而是 Disruptor 的 RingBuffer——数组预分配零 GC、CAS 序号无锁、缓存行填充防伪共享、批量消费，才撑得起单服几十万 QPS。BlockingQueue 只用在非核心异步链路。LinkedBlockingQueue 默认容量 Integer.MAX_VALUE 近似无界是经典坑：任务无限堆积最终 OOM，救急线程永不触发。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">并发队列演进线（游戏服核心链路直接用最右端）</text><rect x=\"20\" y=\"40\" width=\"140\" height=\"64\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"90\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">wait/notify</text><text x=\"90\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一把锁一个等待集合</text><text x=\"90\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">notifyAll 全叫醒</text><path d=\"M160 72 L196 72\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"178\" y=\"64\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">演进</text><rect x=\"198\" y=\"40\" width=\"140\" height=\"64\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"268\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">ReentrantLock+Condition</text><text x=\"268\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>多等待队列精确唤醒</text><text x=\"268\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">支持超时/中断</text><path d=\"M338 72 L374 72\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"356\" y=\"64\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">封装</text><rect x=\"376\" y=\"40\" width=\"140\" height=\"64\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"446\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">BlockingQueue</text><text x=\"446\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">有界缓冲 + 阻塞语义</text><text x=\"446\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">选型按 有界/无界/优先/延迟</text><path d=\"M516 72 L552 72\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"534\" y=\"64\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">无锁化</text><rect x=\"554\" y=\"40\" width=\"70\" height=\"64\" rx=\"8\" fill=\"var(--lv2)\" opacity=\"0.35\" stroke=\"var(--lv2)\"/><text x=\"589\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Disruptor</text><text x=\"589\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">预分配零 GC</text><text x=\"589\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CAS 序号</text><rect x=\"20\" y=\"130\" width=\"600\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"36\" y=\"152\" font-size=\"13\" fill=\"var(--accent)\">CopyOnWriteArrayList：写时复制 + 读无锁</text><text x=\"36\" y=\"174\" font-size=\"12\" fill=\"var(--muted)\">读 99.99% 写 0.01% 才用（监听器列表、GM 指令注册表）；实时排行榜这类高频写绝对别用，写一次拷贝一次数组 O(n)</text><rect x=\"20\" y=\"206\" width=\"600\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"36\" y=\"228\" font-size=\"13\" fill=\"var(--accent)\">ConcurrentLinkedQueue：CAS 无锁链表</text><text x=\"36\" y=\"250\" font-size=\"12\" fill=\"var(--muted)\">适合消费者轮询/事件驱动；size() 是 O(n) 近似值，别拿它做容量判断——容量控制必须用有界结构</text></svg>",
    "caption": "图：并发队列演进线 + COW/CLQ 适用边界"
   },
   {
    "t": "h",
    "text": "三、CopyOnWriteArrayList 与 ConcurrentLinkedQueue"
   },
   {
    "t": "p",
    "text": "两者共同哲学：读侧无锁，用写侧或一致性让步换。COW 底层是不可变数组快照，写操作加锁复制整个数组替换 volatile 引用，迭代器遍历快照不抛 CME 但也看不到最新修改（弱一致）。CLQ 是单向链表 + CAS 更新 head/tail（Michael-Scott 算法变体），无界非阻塞，poll 空返回 null。游戏服：COW 适合监听器/回调列表（启动注册一次、触发读千万次）；CLQ 适合低频异步事件投递，但核心消息链路仍用 Disruptor。"
   },
   {
    "t": "pits",
    "items": [
     "LinkedBlockingQueue 不传容量：默认 Integer.MAX_VALUE 近无界，洪峰 OOM 且救急线程永不触发",
     "用 COW 存实时排行榜：高频写 = 每次复制整个数组，写放大雪崩",
     "拿 CLQ 的 size() 做容量判断：O(n) 且是近似值，并发增减下结果不可信",
     "wait 用 if 判条件 + 用 notify 唤醒同类：双条件缓冲下信号丢失全员死等，要么 while+notifyAll 要么双 Condition"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：wait/notify 铁律四连 → Condition 精确唤醒 → BlockingQueue 有界选型 → 演进到 Disruptor 无锁化。COW 为读牺牲写、CLQ 为并发牺牲精确 size——先讲清场景再选容器。"
   }
  ]
 },
 {
  "id": "java-concurrent-threadlocal",
  "title": "ThreadLocal 与线程局部状态",
  "layer": 1,
  "depends": [
   "java-concurrent-jmm"
  ],
  "covers": [
   "java-concurrent-10",
   "java-concurrent-18"
  ],
  "quiz": [
   "java-concurrent-10",
   "java-concurrent-18"
  ],
  "body": [
   {
    "t": "lead",
    "text": "ThreadLocal 是『线程封闭』的标准实现：每个线程一份独立副本，用它对玩家会话、请求上下文这类『跟线程走』的状态做隔离；用错它的代价是内存泄漏和上下文串号——面试考原理，工程考生命周期。"
   },
   {
    "t": "pre",
    "items": [
     "JMM 的工作内存模型（线程私有变量副本的抽象）",
     "线程池复用线程的机制（池化线程不死、一直复用）",
     "玩家消息『同一玩家同一线程串行』的游戏服线程模型"
    ]
   },
   {
    "t": "h",
    "text": "一、ThreadLocal 是什么：为线程封闭而生"
   },
   {
    "t": "p",
    "text": "ThreadLocal 的定位不是『并发安全的 Map』，而是『线程本地变量』。每个线程访问同一个 ThreadLocal 实例时，拿到的是自己那份独立副本，读写互不可见，天然无锁、无竞争。一个常见的直觉反例：static ThreadLocal<String> 整个 JVM 只有一份对象，但每个线程各存各的值——共享的是『存取的入口』，隔离的是『数据本身』。它和 volatile 是一对方向相反的思路：volatile 解决的是『一个变量让所有线程看见』，ThreadLocal 解决的是『一个变量让每个线程各有各的』。游戏服里它最典型的身份是『请求上下文』：一次消息处理中透传玩家 ID、登录态、TraceId，而不必把这些参数一路传参传到底。"
   },
   {
    "t": "h",
    "text": "二、底层原理：ThreadLocalMap 与弱引用 Entry"
   },
   {
    "t": "p",
    "text": "每个 Thread 对象内部有一个 ThreadLocal.ThreadLocalMap 类型的 threadLocals 字段（懒创建，第一次 set/get 才初始化）。ThreadLocalMap 是一个自定义哈希表：Entry[] table，默认容量 16，用『哈希取模 + 线性探测』解决冲突，扩容阈值是 2/3。关键设计在 Entry 上：Entry 继承 WeakReference，key 是弱引用、value 是普通强引用。为什么 key 用弱引用？因为 ThreadLocal 通常是 static final 的，生命周期比线程长，如果 key 是强引用，线程不死它就不被回收，static 变量永远挂在 Map 里，整个 ThreadLocal 及其关联数据全部泄漏。弱引用让『ThreadLocal 对象不可达时 key 可以先行被 GC』——但这恰恰引出了下一节 value 的泄漏问题。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\"><text x=\"20\" y=\"22\" font-size=\"13\" fill=\"var(--ink)\">ThreadLocal 数据结构：Thread → ThreadLocalMap → Entry[]</text><rect x=\"20\" y=\"36\" width=\"140\" height=\"64\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"90\" y=\"60\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Thread</text><text x=\"90\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">池化线程复用不退出</text><path d=\"M160 68 L200 68\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"180\" y=\"60\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">持有</text><rect x=\"202\" y=\"36\" width=\"180\" height=\"64\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"292\" y=\"60\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">ThreadLocalMap</text><text x=\"292\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Entry[] 默认容量 16</text><path d=\"M382 68 L422 68\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"402\" y=\"60\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">哈希取模</text><rect x=\"424\" y=\"36\" width=\"196\" height=\"64\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"522\" y=\"60\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Entry[] 线性探测</text><text x=\"522\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">冲突向后顺延找空位</text><rect x=\"40\" y=\"140\" width=\"180\" height=\"76\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"130\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Entry 正常</text><text x=\"130\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">key 弱引用 ThreadLocal</text><text x=\"130\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">value 强引用</text><rect x=\"240\" y=\"140\" width=\"180\" height=\"76\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"330\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Entry 正常</text><text x=\"330\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">key 弱引用 ThreadLocal</text><text x=\"330\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">value 强引用</text><rect x=\"440\" y=\"140\" width=\"180\" height=\"76\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"530\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Entry 脏条目</text><text x=\"530\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">key 已被 GC 置 null</text><text x=\"530\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">value 强引用 → 泄漏</text><text x=\"20\" y=\"252\" font-size=\"12\" fill=\"var(--muted)\">弱引用 key：ThreadLocal 不可达时 key 可先回收；但 value 仍被 Thread→Map→Entry 的强引用链抓住</text><text x=\"20\" y=\"276\" font-size=\"12\" fill=\"var(--muted)\">池化线程不死 → 脏 Entry 的 value 永不释放；set/get/remove 只清理『顺路遇到』的脏条目，长期不访问的清理不到</text><text x=\"20\" y=\"300\" font-size=\"13\" fill=\"var(--accent)\">根治姿势：static final 声明 + 用完 finally remove()</text></svg>",
    "caption": "图：ThreadLocal 数据结构与弱引用 key/强引用 value 的泄漏链"
   },
   {
    "t": "h",
    "text": "三、内存泄漏根因：不是弱引用 key，而是强引用 value"
   },
   {
    "t": "p",
    "text": "泄漏链路是这样的：Thread → threadLocals（强引用）→ ThreadLocalMap → Entry[] → 某个 Entry 的 value（强引用）。当 ThreadLocal 对象不再可达时，Entry 的 key 被 GC 清成 null，但 value 依然被这条链死死抓着。池化线程不会退出，这条链就永远存在——这就是泄漏。JDK 的补救是 set/get/remove 时顺带清理 key==null 的脏 Entry，但这只覆盖『再次访问到那个桶位』的情况，长期不被访问的脏 value 就一直挂着。游戏服里还有更隐蔽的第二种坑：线程池线程长期复用，残留的旧上下文会被下一个消息读到，玩家 A 的会话串到玩家 B 的请求上——比内存泄漏更可怕的是数据串号。铁律只有一条：用完在 finally 里 remove()，让上下文生命周期严格限定在一次消息处理内。"
   },
   {
    "t": "p",
    "text": "还有一个认知要补：非池化线程（手动 new 的线程）退出后，它的 threadLocals 会随 Thread 对象一起被 GC 回收，所以泄漏只在『池化 / 长命线程』场景显著——这正解释了为什么面试官总把 ThreadLocal 泄漏和线程池绑定在一起问。同样道理，游戏服里如果哪个模块还在用裸线程跑长任务且用了 ThreadLocal，等于把泄漏面铺到每一个不死线程上。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 游戏服请求上下文：static final 声明 + 用完必 remove\npublic final class ReqContext {\n    private static final ThreadLocal<ReqContext> CTX =\n        new ThreadLocal<ReqContext>() {\n            @Override protected ReqContext initialValue() {\n                return new ReqContext();\n            }\n        };\n    private long playerId;\n    private String traceId;\n    private boolean sampleLog;\n    public static ReqContext get() { return CTX.get(); }\n    public static void remove() { CTX.remove(); }\n    public void reset(long pid, String traceId, boolean sample) {\n        this.playerId = pid; this.traceId = traceId; this.sampleLog = sample;\n    }\n    // 字段 getter 略\n}\n\n// 解码层（Netty IO 线程）：set 上下文\npublic void channelRead(ChannelHandlerContext ctx, Object msg) {\n    ReqContext c = ReqContext.get();\n    c.reset(msg.playerId, TraceIdGen.next(), shouldSample(msg.playerId));\n    dispatcher.dispatch(msg);      // 投递到玩家绑定业务线程\n}\n\n// 业务层（玩家绑定线程）：get 读取，finally remove\npublic void handleLogin(LoginReq req) {\n    try {\n        long pid = ReqContext.get().playerId;   // 读上下文\n        // 业务逻辑：鉴权、加载、响应\n    } catch (BizException e) {\n        sendError(e.getCode());\n    } finally {\n        ReqContext.remove();                    // 铁律：清理，防串号\n    }\n}"
   },
   {
    "t": "h",
    "text": "四、游戏服落地：会话上下文与请求链路"
   },
   {
    "t": "p",
    "text": "游戏服最常见的用法是『一次请求/一条消息的上下文』：玩家 ID、登录态、来源渠道、TraceId、超时时间、当前请求的埋点采样开关。Netty 解码器在 IO 线程 set，经 Disruptor 投递到业务线程后 get，业务处理完 finally remove。有两个关键认知：第一，ThreadLocal 并不能跨线程『漂移』——IO 线程 set 的值业务线程 get 不到，上下文必须随消息对象显式传递或在业务线程侧重建；第二，所有写上下文的入口和读上下文的出口必须对称，异常链路、超时链路、跨线程派发链路都要在 finally 清理，否则一次异常就把脏状态留在池化线程里。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">游戏服请求上下文生命周期：IO 线程 set → 业务线程 get → finally remove</text><rect x=\"20\" y=\"48\" width=\"150\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"95\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Netty 解码线程</text><text x=\"95\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">解码消息</text><text x=\"95\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">set 玩家上下文</text><path d=\"M170 83 L218 83\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"194\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">投递</text><rect x=\"220\" y=\"48\" width=\"150\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"295\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Disruptor 桥</text><text x=\"295\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">RingBuffer 消息</text><text x=\"295\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跨线程传递消息对象</text><path d=\"M370 83 L418 83\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"394\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">消费</text><rect x=\"420\" y=\"48\" width=\"200\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"520\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">玩家绑定业务线程</text><text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">get 读取上下文处理</text><text x=\"520\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">finally remove 清理</text><path d=\"M520 118 L520 150\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><rect x=\"420\" y=\"152\" width=\"200\" height=\"64\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"520\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程池复用同一线程</text><text x=\"520\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不 remove → 旧玩家上下文残留</text><text x=\"520\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">下一消息读到脏数据 → 串号</text><text x=\"20\" y=\"252\" font-size=\"13\" fill=\"var(--accent)\">注意：ThreadLocal 不跨线程，IO 线程 set 的值业务线程 get 不到</text><text x=\"20\" y=\"276\" font-size=\"12\" fill=\"var(--muted)\">上下文要么随消息对象显式传递，要么在业务线程侧重建；异常/超时链路同样要在 finally 清理</text></svg>",
    "caption": "图：游戏服上下文生命周期（set → get → finally remove，池化线程复用放大残留风险）"
   },
   {
    "t": "h",
    "text": "五、FastThreadLocal：Netty 为什么另起炉灶"
   },
   {
    "t": "p",
    "text": "JDK ThreadLocal 对高性能网络框架有两个不友好点：一是哈希 + 线性探测在冲突时退化，高频 get 有额外的寻址开销；二是清理时机不可控，全靠开发者记得 remove。Netty 的 FastThreadLocal 做了两个核心改造：第一，用数组替代哈希表——每个 FastThreadLocal 实例创建时从全局 AtomicInteger 拿一个唯一下标 index，值直接存进线程的 InternalThreadLocalMap.indexedVariables[index]，get/set 是纯数组下标访问，稳定 O(1)、无冲突、对 CPU 缓存友好（数组连续内存）；第二，配合 FastThreadLocalThread 与 FastThreadLocalRunnable，任务跑完自动批量清理本线程所有 FastThreadLocal，把『忘 remove』的泄漏风险从机制上消灭。注意前提：只有运行在 FastThreadLocalThread 上才走快路径，普通线程会退化为 JDK ThreadLocal 慢路径。Netty 内部主要用它存每个线程的 ByteBuf 池 PoolThreadLocalCache 这类『每个线程各一份、访问极高频』的变量。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "JDK ThreadLocal",
     "Netty FastThreadLocal"
    ],
    "rows": [
     [
      "存储结构",
      "ThreadLocalMap（哈希表 + 线性探测）",
      "Object[] indexedVariables（数组直接下标）"
     ],
     [
      "访问复杂度",
      "理论 O(1)，冲突时退化",
      "稳定 O(1)，纯数组寻址、缓存友好"
     ],
     [
      "清理机制",
      "弱引用 key + 访问时惰性清理，需手动 remove",
      "FastThreadLocalRunnable 结束自动批量清理"
     ],
     [
      "线程要求",
      "任意线程",
      "需 FastThreadLocalThread 才走快路径"
     ],
     [
      "典型场景",
      "请求上下文、事务上下文",
      "ByteBuf 线程池等极高频线程局部状态"
     ]
    ]
   },
   {
    "t": "h",
    "text": "六、虚拟线程下的 ThreadLocal：慎用"
   },
   {
    "t": "p",
    "text": "虚拟线程（JDK21）可以轻松创建百万个，每个虚拟线程都持有自己的 ThreadLocalMap。一个常见上下文对象几十字节到几 KB，百万虚拟线程乘上下文就是内存暴涨；更隐蔽的是虚拟线程在 synchronized 块内阻塞 IO 会『钉住』载体线程（JDK21 的 pinning 问题，JDK24/JEP 491 已从 JVM 层面解决）。结论：虚拟线程场景优先把『每请求上下文』改造成『显式参数传递』或『对象池 + 字段携带』，不要依赖 ThreadLocal 隐式传递。"
   },
   {
    "t": "h",
    "text": "七、判断清单：什么时候值得用 ThreadLocal"
   },
   {
    "t": "p",
    "text": "总结五个判断问题，能帮你有结构地回答『什么时候用 ThreadLocal』这类开放题：第一，这个状态是『每线程各一份』还是『全局共享』——共享是 volatile/CAS/锁的领域，不要硬塞进 ThreadLocal；第二，生命周期是否严格等于一次任务——是则必须 finally remove，跨任务保留必有串号风险；第三，会不会跨线程传递——会就显式传参，ThreadLocal 天生不跨线程；第四，调用频率是否极高——极高频率且每线程一份才是它的甜区，低频场景随便用什么都没差别；第五，有没有更简单的替代——方法参数传递永远是最清晰、最不容易错的方案，ThreadLocal 是『隐式传参』，隐式即隐患，能用显式就用显式。把这个清单讲出来，面试官看到的是边界感而不是背 API。"
   },
   {
    "t": "pits",
    "items": [
     "『ThreadLocal 是并发安全的共享变量』：错。它是线程私有副本，跨线程不共享，本质是线程封闭而非并发控制",
     "复用上下文对象时只 get 不重置：请求开始必须整体重置字段，否则上一次请求的脏字段被误读",
     "重写 initialValue 后仍不 remove：池化线程下 initialValue 只在首次调用触发，之后复用的是旧 value",
     "用 ThreadLocal 跨线程传递任务参数：CompletableFuture/线程池换线程后 get 到空或旧值——必须显式传参",
     "InheritableThreadLocal 的坑：子线程继承『创建那一刻』的父值，父线程后续修改子线程看不到；线程池复用子线程会继承到创建时的旧值"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：ThreadLocal=线程封闭工具 → 底层是弱引用 key 哈希表 + 强引用 value → 泄漏根源是『池化线程不死 + value 强引用』，铁律 finally remove → 游戏服做请求上下文要严格限定生命周期 → FastThreadLocal 用数组下标换 O(1) 与自动清理 → 虚拟线程时代优先显式传参。"
   }
  ]
 },
 {
  "id": "java-concurrent-synchronizers",
  "title": "并发协作工具族：Semaphore / CountDownLatch / CyclicBarrier / Exchanger",
  "layer": 1,
  "depends": [
   "java-concurrent-aqs-lock"
  ],
  "covers": [
   "java-concurrent-17"
  ],
  "quiz": [
   "java-concurrent-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "四个同步器都是 AQS 共享模式的壳，区别全在 state 语义：CountDownLatch 是『一次性倒数门闩』、CyclicBarrier 是『可复用集合点』、Semaphore 是『许可池限流』、Exchanger 是『两线程换手』——游戏服限流、开服屏障、批量汇总全靠它们。"
   },
   {
    "t": "pre",
    "items": [
     "AQS 的 volatile state 与共享模式（tryAcquireShared/tryReleaseShared）",
     "LockSupport 与线程 WAITING 状态",
     "线程池与异步任务（同步器负责线程间协作时机）"
    ]
   },
   {
    "t": "h",
    "text": "一、AQS 共享模式：state 的三种语义"
   },
   {
    "t": "p",
    "text": "回顾 AQS：一个 volatile int state + 一条 CLH 变体等待队列。四个同步器里，CountDownLatch、Semaphore 直接就是 AQS 子类，state 语义由子类重写：Latch 把 state 当『剩余倒数』，每次 countDown 减一，减到 0 后所有 await 放行；Semaphore 把 state 当『剩余许可数』，acquire 减一拿不到就排队，release 加一归还。CyclicBarrier 不是 AQS 子类，它内部用 ReentrantLock + Condition 实现『N 人到齐一起放行』。理解了这个底子，三者的区别就一句话：Latch 只能减到 0 一次，Barrier 可以循环用，Semaphore 可以借了再还。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">AQS 共享模式三兄弟：state 语义决定用途</text><rect x=\"20\" y=\"44\" width=\"190\" height=\"176\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"115\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">CountDownLatch</text><text x=\"115\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">一次性倒数门闩</text><text x=\"115\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">state = N，countDown 减一</text><text x=\"115\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">减到 0 放行所有 await</text><text x=\"115\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不可重置，用一次即废</text><text x=\"115\" y=\"178\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">开服等模块就绪</text><text x=\"115\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">批量任务汇总</text><rect x=\"230\" y=\"44\" width=\"190\" height=\"176\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"325\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">CyclicBarrier</text><text x=\"325\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">可复用集合点</text><text x=\"325\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">N 线程到齐一起放行</text><text x=\"325\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">用尽自动重置循环用</text><text x=\"325\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">支持 barrierAction</text><text x=\"325\" y=\"178\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">回合制同帧结算</text><text x=\"325\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跨服活动同步点</text><rect x=\"440\" y=\"44\" width=\"180\" height=\"176\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"530\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">Semaphore</text><text x=\"530\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">许可池限流</text><text x=\"530\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">state = 剩余许可数</text><text x=\"530\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">acquire 拿许可，release 归还</text><text x=\"530\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">tryAcquire 带超时不阻塞</text><text x=\"530\" y=\"178\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">限制跨服战斗并发</text><text x=\"530\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">限制 DB 连接占用</text><text x=\"20\" y=\"252\" font-size=\"13\" fill=\"var(--accent)\">口诀：闩倒数（一次）、栅集合（可复用）、量限流（许可池）</text><text x=\"20\" y=\"276\" font-size=\"12\" fill=\"var(--muted)\">Exchanger：两线程交换数据的一次性换手点，双缓冲流水线、双端对决同步用</text></svg>",
    "caption": "图：三同步器 state 语义对比（Latch 倒数/Barrier 集合/Semaphore 许可）"
   },
   {
    "t": "h",
    "text": "二、CountDownLatch：开服初始化屏障"
   },
   {
    "t": "p",
    "text": "CountDownLatch 是『主线程等 N 个异步任务全部完成』的标准件：主线程 await 阻塞，N 个任务各自 countDown，倒数归零一次性放行。游戏服开服场景最典型：配置表加载、Redis 缓存预热、排行榜恢复三个异步任务完成前，登录端口不开放——用 Latch(3) 等待，三个模块各 countDown 一次。注意三点：await 必须带超时，任一模块挂死时不能永远锁住开服；countDown 用 finally 保证，异常也要倒数；Latch 不可复用，需要多轮等待该用 CyclicBarrier。它和 CompletableFuture.allOf 的区别：Latch 是『阻塞式等待』，适合启动流程这种同步上下文；allOf 是『异步编排』，适合继续链式处理。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 开服初始化屏障：N 个模块就绪 → 放行 → 开放登录\npublic void openServer() throws InterruptedException {\n    CountDownLatch ready = new CountDownLatch(3);\n    configLoader.loadAsync()\n        .whenComplete((v, e) -> ready.countDown());  // finally 语义\n    cacheWarmer.warmAsync()\n        .whenComplete((v, e) -> ready.countDown());\n    rankRecover.recoverAsync()\n        .whenComplete((v, e) -> ready.countDown());\n    // 超时兜底：40 秒没齐也必须放行，半开检查\n    if (!ready.await(40, TimeUnit.SECONDS)) {\n        logger.warn(\"server init partial timeout, open with warning\");\n    }\n    openLoginPort();\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">开服初始化：N 个异步模块就绪 → 放行 → 开放登录</text><rect x=\"30\" y=\"48\" width=\"160\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">配置表加载</text><text x=\"110\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">导表线程</text><rect x=\"240\" y=\"48\" width=\"160\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Redis 缓存预热</text><text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">异步线程</text><rect x=\"450\" y=\"48\" width=\"160\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"530\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">排行榜恢复</text><text x=\"530\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">异步线程</text><path d=\"M110 100 L110 128\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"124\" y=\"118\" font-size=\"12\" fill=\"var(--accent)\">countDown</text><path d=\"M320 100 L320 128\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"334\" y=\"118\" font-size=\"12\" fill=\"var(--accent)\">countDown</text><path d=\"M530 100 L530 128\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"544\" y=\"118\" font-size=\"12\" fill=\"var(--accent)\">countDown</text><rect x=\"200\" y=\"130\" width=\"240\" height=\"58\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"153\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">CountDownLatch(3)</text><text x=\"320\" y=\"173\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">减到 0 → await 全部放行</text><path d=\"M320 188 L320 216\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"336\" y=\"206\" font-size=\"12\" fill=\"var(--accent)\">放行</text><rect x=\"170\" y=\"218\" width=\"300\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">对外开放登录（接受玩家连接）</text><text x=\"320\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">超时兜底：40 秒未齐先半开检查，验证完毕全量开放</text></svg>",
    "caption": "图：开服初始化屏障（Latch(3) → await → 开放登录）"
   },
   {
    "t": "p",
    "text": "补充一个实现细节：CountDownLatch 内部是 AQS 共享模式，await 实际是 acquireShared 失败入队，countDown 是 releaseShared；Semaphore 同理，acquire 是 acquireShared 减许可，release 是 releaseShared 加许可。明白这一点，『Latch 可不可以手动重置』『Semaphore 可不可以负数构造』这类边角题都能直接推出来：负数构造抛 IllegalArgumentException，Latch 没提供重置方法就是设计如此，而不是遗漏。面试时把工具拆到 AQS 层面讲，和停留在 API 层面的候选人立刻拉开差距。"
   },
   {
    "t": "h",
    "text": "三、CyclicBarrier：回合制同帧结算"
   },
   {
    "t": "p",
    "text": "CyclicBarrier 是『N 个线程互相等到齐，然后一起放行』，用尽后自动重置可以循环使用，还支持 barrierAction——每次放行后由最后一个到达的线程执行的收尾动作。游戏服最典型的场景是回合制/半回合制战斗：一场战斗分 N 个玩家单元线程，每个回合所有玩家先收集各自指令，指令齐了才统一结算——这就是 Barrier 的天然语义。注意它和 Latch 的关键区别：Barrier 是『参与的线程自己等』（等齐了一起走），Latch 是『主线程等别人』（等别人干完）；Barrier 每轮自动重建，Latch 归零即废。Barrier 还有个坑：线程中途异常退出会触发 BrokenBarrierException，其他线程全部解除阻塞，必须在循环里处理好，否则下一轮直接抛异常。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 回合制战斗：每回合 N 个玩家指令到齐 → barrierAction 统一结算\npublic void battleTick(List<BattleWorker> workers) {\n    CyclicBarrier barrier = new CyclicBarrier(workers.size(), () -> {\n        roundSettle();                       // 所有指令到齐后统一结算（最后到齐者执行）\n        if (battleOver()) endBattle();\n    });\n    ExecutorService pool = Executors.newFixedThreadPool(workers.size());\n    workers.forEach(w -> pool.submit(() -> {\n        for (int round = 0; round < MAX_ROUND && !battleOver(); round++) {\n            w.collectCmd();                  // 收集本回合指令\n            try {\n                barrier.await();             // 等本轮所有玩家到齐\n            } catch (BrokenBarrierException e) {\n                logger.warn(\"barrier broken at round {}\", round);\n                return;                      // 有玩家掉线，本回合放弃\n            } catch (InterruptedException e) {\n                Thread.currentThread().interrupt();\n                return;\n            }\n        }\n    }));\n}"
   },
   {
    "t": "h",
    "text": "四、Semaphore：跨服战斗限流与 DB 连接保护"
   },
   {
    "t": "p",
    "text": "Semaphore 是『许可池』：构造时给 N 个许可，acquire 拿走一个，release 归还一个，许可耗尽后续线程排队。游戏服用它做三类限流：跨服战斗并发上限（一台跨服网关最多同时跑 500 场，爆满提示稍后再试）、DB 异步落盘池保护（落盘线程数 × 每线程连接数不能超过连接池上限）、GM 后台批量操作限流（防止一次全服发奖打爆 Redis）。核心用法是 tryAcquire 带超时——拿不到许可立刻降级返回『服务器繁忙』，而不是让玩家线程无限排队。另一个关键点：许可的获取与释放必须对称，release 放 finally；acquire 多张许可时要小心中断异常把部分许可拿到一半的情况。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 跨服战斗并发限流：tryAcquire 超时 + finally release\npublic class ArenaLimiter {\n    private final Semaphore arena = new Semaphore(500);   // 最多 500 场\n    public void enterArena(Player p) {\n        if (!arena.tryAcquire(2, TimeUnit.SECONDS)) {     // 拿不到就降级\n            throw new BizException(\"跨服战场爆满，请稍后再试\");\n        }\n        try {\n            crossServerFightService.enter(p);\n        } finally {\n            arena.release();                               // 对称归还\n        }\n    }\n}\n\n// 数据库连接保护：落盘线程数受连接池约束\npublic class DbPermitGuard {\n    private final Semaphore permit =\n        new Semaphore(dbPool.getMaxConnections());\n    public void withConnection(Runnable task) {\n        if (!permit.tryAcquire(1, TimeUnit.SECONDS)) {\n            logDrop(); return;                             // 降级：稍后重试\n        }\n        try { task.run(); } finally { permit.release(); }\n    }\n}"
   },
   {
    "t": "h",
    "text": "五、Exchanger：双缓冲与换手"
   },
   {
    "t": "p",
    "text": "Exchanger 让两个线程在同步点交换各自持有的数据：exchange(v) 阻塞等对方，双方都到了就交换并同时返回。游戏服场景：双缓冲流水线——生产线程不断填充一批日志，交换给消费线程去写盘，双方交换后继续各自干活，天然实现『填充与消费并行』；双端数据对决——跨服同步时两个服交换各自快照。它是四个工具里最冷门也最轻量的，适用面窄：只能两方、一次性交换，多数场景可以用 BlockingQueue 替代，知道原理即可。"
   },
   {
    "t": "h",
    "text": "五、三工具对比表与选型一句话"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "CountDownLatch",
     "CyclicBarrier",
     "Semaphore"
    ],
    "rows": [
     [
      "state 语义",
      "倒数计数 N→0",
      "等待线程数到齐",
      "剩余许可数"
     ],
     [
      "是否可重置",
      "否，一次性",
      "是，自动重建",
      "是，借还循环"
     ],
     [
      "参与方式",
      "主线程 await，工作线程 countDown",
      "所有参与线程互相 await",
      "任意线程 acquire/release"
     ],
     [
      "异常影响",
      "计数不足主线程一直等",
      "线程中断/异常 → BrokenBarrierException 全体唤醒",
      "不影响其他线程"
     ],
     [
      "游戏服场景",
      "开服初始化屏障",
      "回合制同帧结算",
      "跨服战斗限流 / DB 保护"
     ]
    ]
   },
   {
    "t": "p",
    "text": "选型一句话：『等人齐』用 Latch（别人干活我等着），『到齐一起走』用 Barrier（一起干活的互相等），『限量放行』用 Semaphore（来一个放一个），『两方换手』用 Exchanger。选错的最典型后果：该用 Latch 的场景用了 Barrier，参与线程自己 await 自己，永远等不齐；该用 Semaphore 的场景用了 Latch，一次性放完就废，限流失效。工具本身不复杂，难点永远在场景映射——面试时把『为什么这个场景选它』讲清楚，比背一遍 API 值钱得多。"
   },
   {
    "t": "h",
    "text": "六、Exchanger 的边界与替代"
   },
   {
    "t": "p",
    "text": "Exchanger 只在两个线程正好成对时才有意义，超过两方就没法用；exchange 是阻塞的，对方不来当前线程就一直等，必须配合超时版本 exchange(x, timeout, unit) 兜底。还有个隐蔽坑：交换完成后数据的『所有权』随之转移，两方都不要再持有旧引用去修改，否则就是数据竞争。实际项目里多数『两线程协作』都可以用双 BlockingQueue 或 SynchronousQueue 替代，Exchanger 更多是面试知识点——会讲原理、会举双缓冲例子，就足够体现深度。"
   },
   {
    "t": "pits",
    "items": [
     "CountDownLatch 想复用：state 归零无法重置，多轮等待该用 CyclicBarrier",
     "Barrier 线程中途退出：触发 BrokenBarrierException，不捕获处理下一轮全抛异常",
     "Semaphore acquire 不带超时：许可耗尽时玩家线程无限排队，等于把限流做成拖垮",
     "tryAcquire 成功但 try/finally 外释放：任何中途 return/throw 都会泄漏许可，release 必须对称",
     "Latch await 不带超时：初始化模块挂死时开服流程永久阻塞，必须超时兜底"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：四工具都是协作时机件，区别在 state 语义 → Latch 一次性倒数（开服屏障）、Barrier 可复用集合（回合结算）、Semaphore 许可池（跨服限流/DB 保护）、Exchanger 两线程换手 → 统一注意：超时兜底 + finally 对称释放。"
   }
  ]
 },
 {
  "id": "java-concurrent-volatile-barriers",
  "title": "volatile 与内存屏障深水区",
  "layer": 1,
  "depends": [
   "java-concurrent-jmm"
  ],
  "covers": [
   "java-concurrent-04",
   "java-concurrent-12"
  ],
  "quiz": [
   "java-concurrent-04",
   "java-concurrent-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "volatile 的完整语义是『可见 + 有序不原子』，落到硬件是四类内存屏障的组合；happens-before 八条规则是 JMM 给程序员的可证明承诺——DCL 单例为什么必须 volatile，是这一切的终极考题。"
   },
   {
    "t": "pre",
    "items": [
     "JMM 主内存 + 工作内存抽象与可见性问题",
     "CPU 缓存一致性 MESI 与 Store Buffer（内存屏障的物理背景）",
     "synchronized 锁升级中的 CAS 与内存屏障"
    ]
   },
   {
    "t": "h",
    "text": "一、JSR133 语义：volatile 到底保证了什么"
   },
   {
    "t": "p",
    "text": "JSR133（Java 5 引入）重新定义了 volatile 的语义：对 volatile 变量的读，一定能看到『最近一次对该变量的写』；volatile 读写与周围指令的相对顺序不被重排。三个边界必须说死：可见性——写 volatile 立即刷回主存并使其他核缓存行失效，读强制从主存取，绝不读旧副本；有序性——编译器与 CPU 都不允许把 volatile 读写重排到禁止的位置；不原子——i++ 是读-改-写三步，volatile 只保证每次读写本身原子，不保证复合操作原子，count++ 用 volatile 是经典错误。一句话版本：volatile 管『每个线程看到的值』，不管『多个操作合起来是不是对的』。"
   },
   {
    "t": "h",
    "text": "二、四类内存屏障：读写之间的纪律"
   },
   {
    "t": "p",
    "text": "JMM 层面有四类屏障：LoadLoad（第一次读必须在第二次读之前）、StoreStore（第一次写必须在第二次写之前，保证写有序刷出）、LoadStore（读必须在写之前）、StoreLoad（写必须在读之前，最贵）。volatile 的插入规则（Doug Lea JSR133 Cookbook）：volatile 写之前插 StoreStore，写之后插 StoreLoad；volatile 读之后插 LoadLoad + LoadStore。为什么这样插：StoreStore 保证 volatile 写之前的普通写先落定，别人读到 volatile 值时前面的写也一起可见（这就是『volatile 写 hb 后续读』的硬件实现）；StoreLoad 防止后续的 volatile 读被重排到本次写之前——它同时要求写缓冲刷主存并等待，所以最贵；LoadLoad/LoadStore 保证 volatile 读之后的普通读写不会被提前到读之前，防止读到过期值。平台差异：x86 是 TSO 强内存序，四条屏障里只有 StoreLoad 需要真实指令（mfence），其余三条由编译器插桩即可；ARM/PowerPC 是弱内存序，四条全要真指令——这也是『同一份 Java 代码在不同 CPU 上行为一致』依赖 JMM 的原因。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">四类内存屏障：volatile 读写各插入一组，禁止特定重排</text><rect x=\"20\" y=\"48\" width=\"130\" height=\"76\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"85\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">LoadLoad</text><text x=\"85\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Load1 后 Load2</text><text x=\"85\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">禁止读读乱序</text><rect x=\"170\" y=\"48\" width=\"130\" height=\"76\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"235\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">StoreStore</text><text x=\"235\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Store1 后 Store2</text><text x=\"235\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">禁止写写乱序</text><rect x=\"320\" y=\"48\" width=\"130\" height=\"76\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"385\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">LoadStore</text><text x=\"385\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Load 后 Store</text><text x=\"385\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">禁止读写乱序</text><rect x=\"470\" y=\"48\" width=\"150\" height=\"76\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"545\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">StoreLoad</text><text x=\"545\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Store 后 Load</text><text x=\"545\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">最贵，x86 唯一真屏障</text><text x=\"20\" y=\"160\" font-size=\"13\" fill=\"var(--accent)\">volatile 写：写前插 StoreStore（前序写先落定），写后插 StoreLoad（防读越过写）</text><text x=\"20\" y=\"184\" font-size=\"12\" fill=\"var(--muted)\">读到新值的线程，也必然看到 volatile 写之前的所有普通写 → 可见性的硬件实现</text><text x=\"20\" y=\"210\" font-size=\"13\" fill=\"var(--accent)\">volatile 读：读后插 LoadLoad + LoadStore（后续读写不得提前越过本次读）</text><text x=\"20\" y=\"234\" font-size=\"12\" fill=\"var(--muted)\">防止读操作之后拿到的值被提前执行的指令覆盖/跳过</text><text x=\"20\" y=\"266\" font-size=\"13\" fill=\"var(--ink)\">x86 TSO：只有 StoreLoad 是真指令（mfence），其余编译器插桩即可；ARM/PowerPC 弱内存序，四条全要</text></svg>",
    "caption": "图：四类内存屏障与 volatile 的插入规则"
   },
   {
    "t": "h",
    "text": "三、happens-before 八条规则全解"
   },
   {
    "t": "p",
    "text": "happens-before 是 JMM 给程序员的证明规则，满足则『前一个操作的结果对后一个操作可见且有序』。八条全部列出：程序次序规则（单线程内书写顺序）、管程锁规则（unlock hb 后续 lock）、volatile 变量规则（写 hb 后续对该变量的读）、传递性（A hb B 且 B hb C 则 A hb C）、线程启动规则（Thread.start() hb 该线程的一切动作）、线程终止规则（线程一切动作 hb Thread.join() 返回）、中断规则（interrupt() hb 被中断线程检测到中断）、对象终结规则（构造完成 hb finalize 开始）。面试吃透前四条 + 传递性即可，但八条全部报得出是区分『背了』和『真懂』的分水岭。工程上的用法：用 hb 规则证明你的代码为什么安全——比如『volatile 停服标志写 hb 业务线程的读』，所以停服逻辑不需要加锁。"
   },
   {
    "t": "p",
    "text": "hb 规则的正确用法不是背，而是『证明』：写代码时把关键共享访问串成 hb 链，能推出来就安全，推不出来就加锁。比如玩家离线落盘：落盘线程把数据版本写成 volatile，GM 后台读该版本，volatile 写 hb 后续读成立，所以 GM 能看到最新版本——全程不加锁。面试时说出『我能用 hb 证明这段代码安全』，比把八条规则背一遍更能打动面试官，因为后者只证明你背了书，前者证明你会用。"
   },
   {
    "t": "h",
    "text": "四、DCL 单例全解：半初始化重排"
   },
   {
    "t": "p",
    "text": "double-checked locking 的完整分析：INSTANCE == null 的快速检查在外层不加锁（无竞争时零开销），进同步块后再查一次（有竞争时只有一个线程进入构造）。问题出在构造：new Config() 在 JVM 里拆成三步——①分配内存、②初始化字段、③把引用赋给 INSTANCE。CPU 允许把②③重排：先赋引用、后初始化字段。这时另一个线程读 INSTANCE 非空，直接返回，但对象的字段还没初始化——拿到半成品。加 volatile 后，②③之间的重排被禁止（volatile 写前的 StoreStore + 写后的 StoreLoad），引用赋值对所有线程可见时字段必已初始化。这就是 DCL 必须 volatile 的全部理由。补充知识点：非 volatile 的 DCL 在单线程或凑巧不重排时也能跑，所以是『偶发、难以复现、线上偶发 NPE』的典型——比必现 bug 更难排查。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">DCL 半初始化：引用赋值与字段初始化重排，volatile 禁之</text><rect x=\"20\" y=\"44\" width=\"180\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"110\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">① 分配内存</text><text x=\"110\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">对象指向空白内存</text><path d=\"M200 75 L238 75\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"219\" y=\"67\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">步骤</text><rect x=\"240\" y=\"44\" width=\"180\" height=\"62\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"330\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">② 初始化字段</text><text x=\"330\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">字段赋值</text><path d=\"M420 75 L458 75\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"439\" y=\"67\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">步骤</text><rect x=\"460\" y=\"44\" width=\"160\" height=\"62\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"540\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">③ 引用赋值</text><text x=\"540\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">instance = obj</text><path d=\"M540 106 C540 132 330 132 330 116\" fill=\"none\" stroke=\"var(--lv3)\" stroke-width=\"2\" stroke-dasharray=\"5 5\"/><text x=\"300\" y=\"146\" font-size=\"12\" fill=\"var(--lv3)\">无 volatile：②③ 可重排，读 instance 非空但字段未初始化</text><rect x=\"60\" y=\"164\" width=\"520\" height=\"58\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">加 volatile：屏障禁止重排，引用可见时字段必已初始化</text><text x=\"320\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">JDK9+ 可用 VarHandle release/acquire 语义替代</text><text x=\"20\" y=\"252\" font-size=\"13\" fill=\"var(--accent)\">happens-before 八条：</text><text x=\"20\" y=\"276\" font-size=\"12\" fill=\"var(--muted)\">程序次序 / 管程锁 / volatile / 传递性 / 线程启动 / 线程终止 / 中断 / 对象终结</text></svg>",
    "caption": "图：DCL 半初始化重排与 volatile 修复"
   },
   {
    "t": "h",
    "text": "五、游戏服应用与单例变体"
   },
   {
    "t": "p",
    "text": "volatile 在游戏服的三个高频位：停服/维护标志（GM 下发指令后所有线程立即可见）、配置热更新版本号、配置表不可变对象整体替换（volatile 引用换新对象，读者无锁读新版本）。单例话题顺便把三个变体讲全：静态内部类（Initialization-on-demand holder，类加载保证唯一，零同步开销）、枚举单例（反射/序列化天然免疫）、DCL volatile（懒加载 + 可定制）。面试顺序建议：先 DCL 讲透屏障，再对比静态内部类和枚举的取舍。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// ① 停服标志：写后其它线程立即可见，无需加锁\npublic class ServerShutdown {\n    private volatile boolean shutdown;\n    public void shutdown() { shutdown = true; }\n    public boolean isShutdown() { return shutdown; }\n}\n// 业务循环每帧检查：isShutdown() 为真则停接收、落盘、退出\n\n// ② DCL 单例：为什么必须 volatile（半初始化重排）\npublic final class Config {\n    private static volatile Config INSTANCE;\n    private final Map<String, String> table;   // final 字段\n    private Config() { table = loadFromFile(); }\n    public static Config get() {\n        Config c = INSTANCE;                   // 快速检查（无锁）\n        if (c == null) {\n            synchronized (Config.class) {\n                c = INSTANCE;                  // 二次检查\n                if (c == null) {\n                    c = new Config();\n                    INSTANCE = c;              // volatile 写：禁止与构造重排\n                }\n            }\n        }\n        return c;\n    }\n}\n\n// ③ 配置热更新：volatile 引用整体替换，读者无锁\npublic class GameConfigHolder {\n    private volatile ImmutableConfig config;\n    public ImmutableConfig get() { return config; }          // 读者无锁\n    public void reload() { config = ImmutableConfig.load(); } // 写者整体替换\n}"
   },
   {
    "t": "h",
    "text": "六、性能与语义边界"
   },
   {
    "t": "p",
    "text": "volatile 写比普通写贵，主要贵在写后那个 StoreLoad 屏障：它要求写缓冲刷回主存并等待其他核的缓存行失效确认，跨核通信是几十到上百周期的延迟；volatile 读虽然是普通 load，但编译器不能把后续读写提前，会损失一部分优化空间。所以工程上有两个原则：能用普通变量就别到处加 volatile——真不需要共享的字段加了是白付代价；共享状态标志位用 volatile 而非锁——延迟极低且语义正确。还有一个高频语义边界：volatile 修饰数组，修饰的是『数组引用』而不是『数组元素』，元素的可见性要靠 AtomicIntegerArray 或 Unsafe 的 volatile 数组读写，很多人栽在这里。"
   },
   {
    "t": "h",
    "text": "七、final 与 VarHandle 的关系"
   },
   {
    "t": "p",
    "text": "final 字段有更强的可见性保证：构造完成后，任何线程都能看到 final 字段的最终值（前提是对象安全发布），不需要 volatile。JDK9 引入 VarHandle 后，JMM 的屏障语义可以被精确控制：setRelease / getAcquire / getOpaque 分别对应 StoreStore、LoadLoad+LoadStore 的部分语义，比 volatile 的全屏障更精细，是实现无锁队列、无锁栈时比 Unsafe 安全、比 volatile 灵活的底层工具。面试被追问『除了 volatile 和锁还有什么保证可见性的手段』时，final 的安全发布 + VarHandle 的 acquire/release 才是完整答案。"
   },
   {
    "t": "pits",
    "items": [
     "『volatile 保证线程安全』：大错。只保证可见有序，i++ 照样丢更新，复合操作必须 synchronized/CAS",
     "DCL 不加 volatile：半初始化偶发 NPE，线上最阴的 bug 之一",
     "停服标志不加 volatile：业务线程永远看不到 GM 的停服指令，关服流程卡死",
     "把 volatile 当锁用：check-then-act（先读后改）还是竞态，需要锁或 CAS 保证原子",
     "版本答错：volatile 语义是 JSR133（Java5）定型的，别说是 Java8 的新特性"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：volatile = 可见有序不原子 → 四屏障按读写插入，x86 只有 StoreLoad 真指令 → happens-before 八条用传递性证明正确性 → DCL 半初始化靠 volatile 禁重排 → 游戏服用它做停服标志与配置热更新。这一篇是把『会用 volatile』升级成『懂 volatile』的关键。"
   }
  ]
 },
 {
  "id": "java-concurrent-aqs-lock",
  "title": "AQS 与 ReentrantLock 体系",
  "layer": 2,
  "depends": [
   "java-concurrent-cas-atomic"
  ],
  "covers": [
   "java-concurrent-14",
   "java-concurrent-15",
   "java-concurrent-16",
   "java-concurrent-17",
   "java-concurrent-31"
  ],
  "quiz": [
   "java-concurrent-14",
   "java-concurrent-15",
   "java-concurrent-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "AQS = 一个 volatile int state + 一条 CLH 变体 FIFO 队列 + 模板方法模式，JUC 里 ReentrantLock、Semaphore、CountDownLatch 全是它的子类——它就是 JUC 的脊柱。"
   },
   {
    "t": "pre",
    "items": [
     "CAS 自旋与无锁思想（AQS 抢 state 靠的就是 CAS）",
     "LockSupport.park/unpark 的 permit 语义",
     "线程 WAITING 状态（Lock 排队是 park）"
    ]
   },
   {
    "t": "h",
    "text": "一、AQS 三大核心结构"
   },
   {
    "t": "list",
    "items": [
     "state：volatile int，语义由子类定义（锁重入次数 / 剩余许可数 / 倒计数）",
     "同步队列：双向链表，抢锁失败线程包装成 Node 入队，park 挂起；前驱释放后 unpark 唤醒",
     "模板方法：tryAcquire/tryRelease/tryAcquireShared 由子类实现，AQS 管排队挂起唤醒的通用骨架"
    ]
   },
   {
    "t": "p",
    "text": "独占获取流程：tryAcquire CAS 抢 state 成功即完事 → 失败构造 Node 自旋 CAS 入队尾 → 自旋检查前驱是 head 再试一次（快速路径）→ 否则把前驱置 SIGNAL，LockSupport.park 挂起。释放流程：tryRelease 减 state 归零后 unpark 后继。为什么用 park/unpark 而不用 wait/notify？permit 语义允许 unpark 先于 park 调用，天然免疫『先 notify 后 wait 信号丢失』。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><rect x=\"20\" y=\"20\" width=\"280\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"160\" y=\"44\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--accent)\">AbstractQueuedSynchronizer</text><text x=\"160\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">volatile int state</text><text x=\"160\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">锁重入数/许可数/倒计数（子类定语义）</text><text x=\"160\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">模板方法：tryAcquire / tryRelease / tryAcquireShared</text><rect x=\"340\" y=\"20\" width=\"280\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"480\" y=\"44\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--accent)\">CLH 变体同步队列（FIFO）</text><text x=\"480\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">head —— Node —— Node —— tail</text><text x=\"480\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">前驱 waitStatus=SIGNAL 表示『负责唤醒后继』</text><text x=\"480\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">抢锁失败 → 入队 park（WAITING）</text><text x=\"20\" y=\"140\" font-size=\"13\" fill=\"var(--ink)\">独占获取流程：</text><text x=\"20\" y=\"162\" font-size=\"12\" fill=\"var(--muted)\">1. tryAcquire CAS 抢 state  →  成功直接返回</text><text x=\"20\" y=\"182\" font-size=\"12\" fill=\"var(--muted)\">2. 失败 → 构造 Node CAS 入队尾 → 检查前驱是 head 再试一次</text><text x=\"20\" y=\"202\" font-size=\"12\" fill=\"var(--muted)\">3. 还不行 → 前驱置 SIGNAL → LockSupport.park 挂起</text><text x=\"20\" y=\"222\" font-size=\"12\" fill=\"var(--muted)\">释放：tryRelease 减到 0 → unpark 后继节点</text><text x=\"20\" y=\"252\" font-size=\"13\" fill=\"var(--accent)\">JUC 全家都是 AQS 子类：</text><rect x=\"20\" y=\"264\" width=\"120\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"80\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ReentrantLock</text><rect x=\"150\" y=\"264\" width=\"120\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"210\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Semaphore</text><rect x=\"280\" y=\"264\" width=\"130\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"345\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">CountDownLatch</text><rect x=\"420\" y=\"264\" width=\"200\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"520\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ReentrantReadWriteLock</text></svg>",
    "caption": "图：AQS 三大结构（state + CLH 队列 + 模板方法）与 JUC 子类"
   },
   {
    "t": "h",
    "text": "二、ReentrantLock vs synchronized"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "synchronized",
     "ReentrantLock"
    ],
    "rows": [
     [
      "实现层次",
      "JVM 内置（monitorenter/exit）",
      "JDK 类，基于 AQS"
     ],
     [
      "可中断/超时",
      "不支持",
      "lockInterruptibly / tryLock(timeout)"
     ],
     [
      "公平性",
      "只能非公平",
      "公平/非公平可选"
     ],
     [
      "条件变量",
      "一个 wait set，notifyAll 全叫",
      "多 Condition 精确唤醒"
     ],
     [
      "释放",
      "编译期自动",
      "必须 finally unlock"
     ]
    ]
   },
   {
    "t": "p",
    "text": "选型建议：默认 synchronized 简单不易错；需要超时/可中断/多条件/公平时才上 ReentrantLock。游戏服经验：玩家数据高并发最好别靠锁——『玩家绑定固定业务线程』从根上消灭竞争，锁只是兜底。非公平锁为什么吞吐高？锁刚释放时新线程直接插队抢到，减少 park/unpark 交接；代价是唤醒的线程可能继续睡，有饥饿风险。"
   },
   {
    "t": "h",
    "text": "三、读写锁与 StampedLock 乐观读"
   },
   {
    "t": "p",
    "text": "ReentrantReadWriteLock 用一个 int state 高 16 位存读锁计数、低 16 位存写锁重入次数，实现『读读共享、读写/写写互斥』。支持锁降级（持写锁再取读锁后释放写锁），不支持锁升级（持读锁抢写锁会死锁）。游戏服典型：配置表 99.99% 读、热更新才写——更推荐『不可变对象 + volatile 引用整体替换』，读侧完全无锁。StampedLock 的乐观读 tryOptimisticRead 拿 stamp 不阻塞写，读完 validate 校验，失败升级悲观读——读多写少把读路径成本降到接近零，但不可重入、不支持 Condition、范式顺序不能错。"
   },
   {
    "t": "h",
    "text": "四、CountDownLatch / CyclicBarrier / Semaphore"
   },
   {
    "t": "p",
    "text": "三者都是 AQS 共享模式封装：Latch 是一次性倒数门闩（服务器启动等初始化模块 ready 再对外开放端口）；Barrier 是可重复集合点（回合制战斗等 N 个玩家操作指令齐了再统一结算）；Semaphore 是限流许可池（限制跨服战斗并发数、限制 DB 并发连接）。口诀：『闩倒数、栅集合、量限流』。"
   },
   {
    "t": "pits",
    "items": [
     "ReentrantLock 忘了 unlock：锁泄漏，必须 finally 释放",
     "读写锁升级死锁：持读锁直接抢写锁，两个读者互相等对方放锁——只能降级不能升级",
     "StampedLock 乐观读范式错：必须先拷局部变量再 validate，失败不重读会读到撕裂数据",
     "CountDownLatch 想复用：state 到 0 无法重置，复用场景该用 CyclicBarrier"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：AQS 一个 state 一条队、子类只定义语义 → RL 胜在超时/中断/多 Condition → 读写锁高 16 读低 16 写、只降不升 → 三同步器按场景选。面试能画出 Node 入队与 SIGNAL 语义就是高分。"
   }
  ]
 },
 {
  "id": "java-concurrent-thread-pool",
  "title": "线程池设计与调优",
  "layer": 2,
  "depends": [
   "java-concurrent-collections"
  ],
  "covers": [
   "java-concurrent-07",
   "java-concurrent-08",
   "java-concurrent-36",
   "java-concurrent-26",
   "java-concurrent-20",
   "java-concurrent-33"
  ],
  "quiz": [
   "java-concurrent-07",
   "java-concurrent-08",
   "java-concurrent-36"
  ],
  "body": [
   {
    "t": "lead",
    "text": "线程池七参数 + 『核心 → 队列 → 最大 → 拒绝』提交流程 + 按 CPU/IO 密集估算大小，是并发题的最高频考点；ForkJoinPool 和 commonPool 的坑是隐藏加分点。"
   },
   {
    "t": "pre",
    "items": [
     "阻塞队列选型（有界/无界/优先/延迟）",
     "线程六状态与优雅停机",
     "CompletableFuture 与 ForkJoinPool 的关系（后两节用到）"
    ]
   },
   {
    "t": "h",
    "text": "一、七参数与提交流程"
   },
   {
    "t": "list",
    "items": [
     "corePoolSize：核心线程数，常驻",
     "maximumPoolSize：核心 + 救急线程",
     "keepAliveTime + unit：救急线程空闲回收时间",
     "workQueue：任务队列（必须有界）",
     "threadFactory：自定义线程名——游戏服必配，排查靠名字认线程",
     "handler：拒绝策略"
    ]
   },
   {
    "t": "p",
    "text": "execute 流程四步：线程数 < core 直接建核心线程 → 否则入队列排队 → 队列满且线程数 < max 才建救急线程 → 到 max 且队列满走拒绝策略。两个易错点：核心线程不是预热的，任务来了才逐个创建；救急线程只在队列满之后才出现。Executors 默认工厂（newFixedThreadPool 无界队列、newCachedThreadPool 无线程上限）都有 OOM 风险，生产必须 new ThreadPoolExecutor 显式传参。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">ThreadPoolExecutor.execute 提交流程</text><rect x=\"20\" y=\"40\" width=\"180\" height=\"48\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"110\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">提交任务</text><text x=\"110\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">execute / submit</text><path d=\"M200 64 L238 64\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"219\" y=\"56\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">判</text><rect x=\"240\" y=\"40\" width=\"180\" height=\"48\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"330\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程数 &lt; core ?</text><text x=\"330\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">是 → 建核心线程执行</text><path d=\"M420 64 L458 64\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"439\" y=\"56\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">否</text><rect x=\"460\" y=\"40\" width=\"160\" height=\"48\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"540\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)>入队 workQueue</text><text x=\"540\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>队列满？否→排队等待</text><path d=\"M540 88 L540 120\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"556\" y=\"110\" font-size=\"12\" fill=\"var(--accent)>满</text><rect x=\"460\" y=\"122\" width=\"160\" height=\"48\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"540\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)>线程数 &lt; max ?</text><text x=\"540\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>是 → 建救急线程</text><path d=\"M540 170 L540 202\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"556\" y=\"192\" font-size=\"12\" fill=\"var(--accent)>满</text><rect x=\"460\" y=\"204\" width=\"160\" height=\"48\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"540\" y=\"227\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)>拒绝策略</text><text x=\"540\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>抛/回跑/丢弃/丢老</text><text x=\"20\" y=\"290\" font-size=\"12\" fill=\"var(--muted)>游戏服选型：玩家操作不能丢（CallerRuns 反压 + 告警）；日志可丢（Discard + 计数）；落盘绝不丢（拒绝时落 Kafka 死信 + 告警）</text></svg>",
    "caption": "图：线程池提交流程（核心 → 队列 → 最大 → 拒绝）"
   },
   {
    "t": "h",
    "text": "二、拒绝策略：按『能不能丢』选型"
   },
   {
    "t": "list",
    "items": [
     "AbortPolicy（默认）：抛 RejectedExecutionException",
     "CallerRunsPolicy：提交线程自己跑——天然反压，但提交方是 Netty IO 线程时别用",
     "DiscardPolicy：静默丢弃；DiscardOldestPolicy：丢最老的塞新的"
    ]
   },
   {
    "t": "p",
    "text": "游戏服铁律：玩家操作类任务不能丢——CallerRunsPolicy 反压或自定义策略先短暂 offer 等待再降级告警；日志/埋点可丢——DiscardPolicy + 丢弃率监控；数据落盘绝不能丢——拒绝时落本地文件或 Kafka 死信队列 + 钉钉告警。无界队列下拒绝策略形同虚设：队列永远不满，救急线程和拒绝永不触发，任务无限堆积 OOM。"
   },
   {
    "t": "h",
    "text": "三、线程池大小：估算起点 + 压测校准"
   },
   {
    "t": "p",
    "text": "没有银弹公式。CPU 密集（协议编解码、战斗数值结算）：N ≈ 核数（或核数+1）。IO 密集（DB 落盘、调渠道 SDK）：N ≈ 核数 × (1 + W/C)，W 是等待时间 C 是计算时间。混合型拆两个池分别配。游戏服各池：Netty IO 线程 2×核数够用；Disruptor 业务消费者 ≈ 核数；DB 异步落盘池结合连接池上限取 16~32 且必须 ≤ DB 连接池大小，否则线程干等连接；日志池 4~8 可丢弃；登录/渠道验证池独立 + 超时 + 熔断。线上监控四指标：activeCount、queueSize、taskCount、rejectCount。"
   },
   {
    "t": "h",
    "text": "四、ForkJoinPool 与 commonPool 陷阱"
   },
   {
    "t": "p",
    "text": "ForkJoinPool 是为可分治的 CPU 密集递归任务设计：每个线程一个双端队列，自己从头部 LIFO 取，空闲线程从别人尾部 FIFO 偷（工作窃取）。坑：parallelStream 和 CompletableFuture 不传 executor 时默认共用 ForkJoinPool.commonPool()，大小 = CPU 核数 - 1、全 JVM 共享、daemon 线程。在公共池里跑阻塞 IO（查库、调渠道）会把公共池占满，连累同进程所有 parallelStream 和默认 CF 任务——必须传自定义命名线程池。游戏服适合 ForkJoin 的场景：离线批量计算（导表解析、日志聚合），不适合任何带 DB/网络阻塞和顺序要求的任务。"
   },
   {
    "t": "pits",
    "items": [
     "线程池配得比 DB 连接池大：多余线程全阻塞在获取连接上，白占内存，还可能在连接池锁上竞争",
     "用 CompletableFuture 不传自定义池：默认 commonPool 全 JVM 共享，阻塞任务把 parallelStream 一起拖死",
     "submit 的异常被 Future 包住：get() 才抛 ExecutionException，忘了 get 异常静默吞掉",
     "上下文切换是线程池隐形成本：单次切换直接成本微秒级，缓存/TLB 失效才是大头——线程数别超过核数太多"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：七参数 + 四步流程（核心→队列→最大→拒绝）→ 拒绝策略按可丢弃性选型 → CPU 贴核数 IO 乘等待比 → 公共池别阻塞。监控四指标 + 动态线程池是生产落地的话术加分点。"
   }
  ]
 },
 {
  "id": "java-concurrent-completable-future",
  "title": "CompletableFuture 与异步编排",
  "layer": 2,
  "depends": [
   "java-concurrent-thread-pool"
  ],
  "covers": [
   "java-concurrent-20"
  ],
  "quiz": [
   "java-concurrent-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "CompletableFuture 是 Java8 异步编程的编排器：Future 只能阻塞 get，它把『依赖多个异步结果』这件事变成声明式 DAG；最大的坑是默认跑在全局共享的 commonPool 上——阻塞操作会把整个进程的并行流一起拖死。"
   },
   {
    "t": "pre",
    "items": [
     "线程池七参数与拒绝策略（异步任务的执行载体）",
     "Future 的痛点：get 阻塞、无法组合、异常拿不到",
     "ForkJoinPool.commonPool 与工作窃取的初步认识"
    ]
   },
   {
    "t": "h",
    "text": "一、从 Future 到 CompletableFuture：解决了什么"
   },
   {
    "t": "p",
    "text": "传统 Future 有三个痛点：get() 阻塞调用线程，等结果期间线程啥也干不了；任务之间没法组合——A 完成后才能发起 B，只能手写回调地狱或阻塞嵌套；异常被吞进 ExecutionException，要拿到还得先判断。CompletableFuture 同时实现 Future 和 CompletionStage 接口，把异步逻辑表达成『链式阶段』：每个方法返回新的 CompletableFuture，前一个阶段的结果自动流入下一个阶段，全程非阻塞。一个关键语义必须记牢：不带 Async 后缀的方法（thenApply）默认在『上一个任务所在的线程』执行，若上一个任务已完成则用『当前调用线程』执行；带 Async 后缀且不传线程池的（thenApplyAsync）默认用 ForkJoinPool.commonPool()。"
   },
   {
    "t": "h",
    "text": "二、方法分类：串行变换 / 并行组合 / 异常恢复"
   },
   {
    "t": "list",
    "items": [
     "串行变换：thenApply（映射）、thenAccept（消费）、thenCompose（展平依赖，链式 then 用），以及各自的 Async 版本",
     "并行组合：thenCombine（二元合并）、thenAcceptBoth、allOf（N 个全等）、anyOf（N 个任一）、applyToEither（竞速）",
     "异常处理：exceptionally（降级返回）、whenComplete（观察不改变结果）、handle（无论成败都处理）",
     "结果获取：get/join（阻塞）、getNow（有值立即返回否则给默认值）"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">CompletableFuture 三种组合语义</text><rect x=\"20\" y=\"44\" width=\"190\" height=\"170\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"115\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">thenCombine 二元合并</text><rect x=\"45\" y=\"80\" width=\"66\" height=\"34\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"78\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A 任务</text><rect x=\"125\" y=\"80\" width=\"66\" height=\"34\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"158\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B 任务</text><path d=\"M95 114 L95 138\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M158 114 L158 138\" stroke=\"var(--line)\" stroke-width=\"2\"/><rect x=\"78\" y=\"140\" width=\"100\" height=\"34\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"128\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">BiFunction 合并</text><text x=\"115\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">两个都要等</text><rect x=\"230\" y=\"44\" width=\"190\" height=\"170\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"325\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">allOf 全部完成</text><rect x=\"255\" y=\"84\" width=\"40\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"275\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text><rect x=\"305\" y=\"84\" width=\"40\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"325\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text><rect x=\"355\" y=\"84\" width=\"40\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"375\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">C</text><path d=\"M275 114 L275 134 L325 134 L325 138\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M325 114 L325 138\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M375 114 L375 134 L325 134\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2\"/><rect x=\"270\" y=\"140\" width=\"110\" height=\"34\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"325\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">全部齐才继续</text><text x=\"325\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不关心各自返回值</text><rect x=\"440\" y=\"44\" width=\"180\" height=\"170\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"530\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">anyOf 任一完成</text><rect x=\"465\" y=\"84\" width=\"40\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"485\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text><rect x=\"515\" y=\"84\" width=\"40\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"535\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text><rect x=\"565\" y=\"84\" width=\"40\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"585\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Z</text><path d=\"M485 114 C485 130 540 130 540 138\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M535 114 C535 130 540 130 540 138\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M585 114 C585 130 540 130 540 138\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2\"/><rect x=\"475\" y=\"140\" width=\"120\" height=\"34\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"535\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">最快完成者</text><text x=\"530\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先到先得，用于竞速</text></svg>",
    "caption": "图：thenCombine / allOf / anyOf 三种并行组合语义"
   },
   {
    "t": "h",
    "text": "三、底层线程模型：Async 后缀与默认线程池"
   },
   {
    "t": "p",
    "text": "CompletableFuture 的默认线程池是 ForkJoinPool.commonPool()：JVM 全局唯一、daemon 线程、默认并行度 = max(1, CPU 核数 - 1)，即 16 核机器约 15 个线程，全进程所有不指定线程池的 supplyAsync/runAsync/thenApplyAsync/parallelStream 共用它。这是全篇最重要的坑：commonPool 是按 CPU 密集任务设计的轻量池，任何线程跑去阻塞（查 DB、调 HTTP、等 Redis、写盘）都会长时间占住一个工作线程，N 个阻塞任务就能把整个池占满，把所有用公共池的并行任务一起饿死。生产铁律：凡链上有阻塞 IO，一律显式传入自定义线程池；每个阶段该用哪种后缀也要有意识——CPU 纯计算且量小可以用不带 Async 的原地执行，跨线程的慢操作必须 Async + 专属池。"
   },
   {
    "t": "p",
    "text": "再补两个高频误用。第一个是把阻塞 IO 包在 thenApply（不带 Async）里：不带 Async 的阶段在『上一个阶段的线程』执行，如果链上第一个任务跑在 Netty IO 线程，thenApply 里的阻塞代码就跑到 Netty IO 线程上去了——这是把 IO 线程拖死的经典事故。规则：任何可能阻塞的阶段都用 Async + 专属池，不指望谁顺手帮我跑。第二个是异常语义没吃透：CompletableFuture 的异常沿链传播，哪个阶段抛了，后续阶段全部以异常完成，直到遇到 exceptionally / whenComplete / handle 才被兜住。所以降级逻辑的摆放位置很讲究：给整条链兜底放链尾；给某个子分支降级放分支内部，别让一个可降级分支的异常污染整条链。另外 supplyAsync 里 rethrow 的异常会自动被包装成 CompletionException 传播，get 的时候记得拆 cause 才能看到业务异常。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">登录服异步编排链路：鉴权 → 并行拉取 → 汇总 → 落库 → 响应</text><rect x=\"20\" y=\"40\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"90\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">① 账号鉴权</text><text x=\"90\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">supplyAsync</text><path d=\"M160 70 L218 70\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"189\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">成功</text><rect x=\"220\" y=\"40\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"290\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">② 并行拉取</text><text x=\"290\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">thenApplyAsync</text><rect x=\"60\" y=\"130\" width=\"150\" height=\"52\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"135\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">玩家档案缓存</text><text x=\"135\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis 读</text><rect x=\"245\" y=\"130\" width=\"150\" height=\"52\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">好友列表</text><text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DB 查询</text><rect x=\"430\" y=\"130\" width=\"150\" height=\"52\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"505\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">未读邮件</text><text x=\"505\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">缓存读取</text><path d=\"M290 100 L290 128\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><path d=\"M135 182 L135 210\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M320 182 L320 210\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M505 182 L505 210\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"150\" y=\"202\" font-size=\"12\" fill=\"var(--accent)\">全部完成</text><rect x=\"40\" y=\"212\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"160\" y=\"236\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">③ allOf 汇总等待</text><text x=\"160\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">任一失败 → exceptionally 降级</text><rect x=\"360\" y=\"212\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"480\" y=\"236\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">④ 落库 + 下发响应</text><text x=\"480\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">thenAcceptAsync</text><path d=\"M280 238 L358 238\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"20\" y=\"286\" font-size=\"12\" fill=\"var(--muted)\">整条链必须用自定义线程池，禁默认 commonPool：链上有 DB/Redis/HTTP 阻塞操作，会占满公共池饿死 parallelStream</text></svg>",
    "caption": "图：登录鉴权 → 并行拉取 → allOf 汇总 → 落库响应的异步编排链路"
   },
   {
    "t": "h",
    "text": "四、登录链路实战：鉴权 → 缓存 → 落库"
   },
   {
    "t": "p",
    "text": "以登录服为例：一次登录要经过账号鉴权（远程或 DB）、玩家档案读取（Redis）、好友/邮件拉取（DB/缓存）、在线标记落库，最后组装响应下发。这些操作全部是阻塞 IO，正确姿势是拆成可并行的阶段，各自跑在独立命名的业务线程池上，用 thenCompose 串联依赖、allOf 并联无依赖分支、exceptionally 统一降级。注意 thenCompose 和 thenApply 的区别：thenApply 的 Lambda 返回『新值』，thenCompose 的 Lambda 返回『新的 CompletableFuture』——链式编排必须用 thenCompose 避免 Future 嵌套。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "ExecutorService biz = new ThreadPoolExecutor(\n    16, 32, 60L, TimeUnit.SECONDS,\n    new ArrayBlockingQueue<>(4096),\n    r -> new Thread(r, \"login-biz\"),\n    new ThreadPoolExecutor.CallerRunsPolicy());\n\npublic CompletableFuture<LoginResp> login(LoginReq req) {\n    // ① 账号鉴权（异步线程池）\n    return CompletableFuture.supplyAsync(\n            () -> authService.verify(req.token), biz)\n        .thenApplyAsync(auth -> {\n            if (!auth.ok) throw new BizException(AUTH_FAILED);\n            return auth.playerId;\n        }, biz)\n        // ② 并行拉取三段无依赖数据\n        .thenComposeAsync(pid -> {\n            CompletableFuture<PlayerProfile> profile =\n                CompletableFuture.supplyAsync(() -> profileCache.get(pid), biz);\n            CompletableFuture<List<Friend>> friends =\n                CompletableFuture.supplyAsync(() -> friendDao.list(pid), biz);\n            CompletableFuture<List<Mail>> mails =\n                CompletableFuture.supplyAsync(() -> mailCache.getUnread(pid), biz);\n            return CompletableFuture.allOf(profile, friends, mails)\n                .thenApplyAsync(v -> new LoginData(\n                    profile.join(), friends.join(), mails.join()), biz);\n        }, biz)\n        // ③ 在线标记落库 + 组装响应\n        .thenApplyAsync(data -> {\n            loginDao.markOnline(req.playerId);\n            return new LoginResp(data);\n        }, biz)\n        // ④ 统一异常降级\n        .exceptionally(e -> e instanceof BizException\n            ? LoginResp.fail(((BizException) e).getCode())\n            : LoginResp.fail(SYS_BUSY));\n}"
   },
   {
    "t": "h",
    "text": "五、线程池选择与超时兜底"
   },
   {
    "t": "p",
    "text": "线程池选择要回答三个问题：池给谁用（登录链、落盘链、日志链各一个，命名隔离）、任务什么类型（IO 密集给大池、CPU 密集给贴核数小池）、满了怎么办（玩家登录不能丢 → CallerRuns 反压或短暂等待降级）。另外两个高频工程点：第一，get 必须带超时——complete() 永远不来时不能无限等，join 的线程会一直挂着，等于池里的线程名额被泄漏；第二，跨线程要传递上下文就显式传参或 wrap 自定义 Runnable，别指望 ThreadLocal 跟着 CompletableFuture 走。还要警惕循环依赖编排（两个任务互相等对方完成）和任务内再往同一个池里同步提交（池打满时自己等自己死锁）。"
   },
   {
    "t": "p",
    "text": "最后说透一个选型问题：CompletableFuture 和直接开线程池 + Future 的本质区别在『编排』——它把异步结果的依赖关系声明出来，让调度器自己决定顺序和并发度。所以能用它解决的问题特征很明确：多个无依赖的异步结果要组合、有依赖的异步流程要串联、任何一步都可能失败要统一兜底。不具备这些特征的简单任务，直接 runAsync 到线程池就够了，别为了用而用——这也是面试里『什么时候不推荐 CompletableFuture』的加分答案。"
   },
   {
    "t": "h",
    "text": "六、thenCompose 与 thenApply：别再混用"
   },
   {
    "t": "p",
    "text": "两者都做『上一个阶段的结果流进下一阶段』，但返回类型不同：thenApply 的 Lambda 返回普通值，下一阶段直接拿到；thenCompose 的 Lambda 返回 CompletableFuture，下一阶段『等那个 Future 完成』再继续，相当于把嵌套的 Future 展平。用 thenApply 去包一个返回 Future 的函数，会得到 CompletableFuture 套 CompletableFuture，后面要 join 两次才能拿到真值，并发语义还全错。判据一句话：Lambda 里如果返回的是异步调用的结果，就用 thenCompose。游戏服登录链里『鉴权完成后并行拉三段数据』就是 thenCompose 的教科书场景。"
   },
   {
    "t": "h",
    "text": "七、取消、超时与背压"
   },
   {
    "t": "p",
    "text": "CompletableFuture 没有真正的取消——cancel(true) 只把状态置为取消，底层任务该跑还跑，所以别指望用 cancel 中断阻塞 IO。超时有三招：get(3, SECONDS) 在等待方兜底；orTimeout(3, SECONDS) 给链上某个节点设超时，超时后该节点以 TimeoutException 完成；completeOnTimeout(value, 3, SECONDS) 超时后用默认值完成，不让异常沿链传播。背压方面：生产环境给异步链配有界队列 + CallerRunsPolicy，队列满时由提交线程自己跑，天然限流；绝对避免无界队列 + 无限投递，异步链同样会 OOM。这些『工程细节』才是面试官想听的实战能力。"
   },
   {
    "t": "h",
    "text": "八、游戏服异步链路的黄金法则"
   },
   {
    "t": "list",
    "items": [
     "链上每个阻塞阶段都指定线程池，且池按业务隔离命名（login-async / save-db / bi-report）",
     "无依赖的任务用 thenCombine / allOf 并行，别串行排队浪费延迟",
     "所有 get 带超时，异常统一在链路末端 exceptionally 降级",
     "跨线程上下文显式传参，别依赖 ThreadLocal 隐式漂移",
     "监控链路的延迟分位数与队列水位，慢链优先查池大小与阻塞点"
    ]
   },
   {
    "t": "pits",
    "items": [
     "不传自定义线程池：默认 commonPool 全局共享，链上的 DB/HTTP 阻塞把 parallelStream 和所有默认异步任务一起饿死",
     "thenApply 和 thenCompose 混用：返回 Future 的 Lambda 必须用 thenCompose，否则得到嵌套的 Future 解不出来",
     "get() 不带超时：依赖方永不 complete 时线程永久挂起，池名额泄漏；生产必须 get(3, SECONDS) 或 orTimeout",
     "exceptionally 之后才吞异常：前面阶段不处理，异常沿链传播到终点，忘了处理就静默失败",
     "忽略 complete() 的返回值：complete 返回 false 说明任务已被其他线程先完成，直接覆盖会破坏『完成一次』语义"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：CompletableFuture 把异步流程表达成声明式阶段 → 三组方法：串行变换/并行组合/异常恢复 → 默认 commonPool 并行度 CPU核数-1、全局共享、禁跑阻塞 → 登录链路用 thenCompose+allOf+exceptionally 编排 → 所有 get 带超时、上下文显式传递。"
   }
  ]
 },
 {
  "id": "java-concurrent-disruptor",
  "title": "Disruptor 无锁队列原理与游戏服应用",
  "layer": 2,
  "depends": [
   "java-concurrent-collections",
   "java-concurrent-cas-atomic"
  ],
  "covers": [
   "java-concurrent-21",
   "java-concurrent-22"
  ],
  "quiz": [
   "java-concurrent-22"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Disruptor 是游戏服核心消息链路的最优解：环形数组预分配零 GC、CAS 序号无锁、缓存行填充防伪共享、批量消费摊薄成本——理解它的四个板斧，就是理解『Java 里把并发压榨到机械极限』的全部答案。"
   },
   {
    "t": "pre",
    "items": [
     "BlockingQueue 的锁 + 条件唤醒开销（上一节点的演进线终点）",
     "CAS 自旋与 volatile 可见性（序号推进的基石）",
     "缓存行 64 字节与 MESI 一致性（伪共享的物理背景）"
    ]
   },
   {
    "t": "h",
    "text": "一、为什么还要无锁：BlockingQueue 的瓶颈在哪"
   },
   {
    "t": "p",
    "text": "ArrayBlockingQueue 用 ReentrantLock + 双 Condition 实现生产者消费者，每投递一条消息都要加锁、解锁、条件唤醒——锁竞争剧烈时线程 park/unpark 的上下文切换是微秒级，缓存行乒乓让 N 个生产者互相踩踏。Disruptor 从三个方向解决：第一，环形数组启动时预创建全部 Event 对象，发布只是覆盖写字段，零对象创建、零 GC；第二，用 volatile 序号 + CAS 替代锁，生产者之间抢 cursor 是 CAS，无内核态切换；第三，把『谁等谁』的协调从锁变成序号比较，消费者检查自己序号是否落后于 cursor，不等信号量、不靠唤醒，纯自旋或让出。这就是它能做到几十万 QPS 消息吞吐、纳秒级延迟抖动的原因。"
   },
   {
    "t": "h",
    "text": "二、四大组件与序号机制"
   },
   {
    "t": "list",
    "items": [
     "RingBuffer：定长环形数组，容量取 2 的幂，用 序号 & (size-1) 位运算取模定位槽位",
     "Sequence：volatile long 序号 + 前后各 7 个 long 填充，保证独占缓存行",
     "Sequencer：大脑。单生产者用 SingleProducerSequencer（免 CAS，靠内存屏障），多生产者用 MultiProducerSequencer（CAS 抢 cursor）",
     "WaitStrategy：等待策略。Blocking/Sleeping/Yielding/BusySpin 四档，延迟与 CPU 消耗的权衡"
    ]
   },
   {
    "t": "p",
    "text": "序号机制是核心中的核心。生产者流程：ring.next() 用 CAS 申请下一个槽位的序号，拿到后写 Event 数据，再 ring.publish(seq) 发布——publish 前消费者不可见该槽，发布后 cursor 推进到该序号。消费者流程：拿着自己的 Sequence，等 cursor 超过自己再取事件；消费完把自己的 Sequence 推进。环形缓冲的『满』与『空』都靠序号判断：生产者要写第 N 槽，先检查最慢消费者是否已经越过 N-ringSize，没越过就等；消费者的推进反过来决定生产者能超前多少。多消费者还能做依赖：handler B 的 SequenceBarrier 跟踪 handler A 的 Sequence，A 没消费完 B 不处理——这就是消费依赖的实现。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">Disruptor RingBuffer：环形数组 + 序号推进（定长预分配零 GC）</text><rect x=\"235\" y=\"18\" width=\"80\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"275\" y=\"38\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽0</text><text x=\"275\" y=\"54\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家消息</text><rect x=\"440\" y=\"18\" width=\"80\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"480\" y=\"38\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽1</text><rect x=\"556\" y=\"70\" width=\"64\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"588\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽2</text><rect x=\"556\" y=\"190\" width=\"64\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"588\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽3</text><rect x=\"420\" y=\"240\" width=\"80\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"460\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽4</text><rect x=\"180\" y=\"240\" width=\"80\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"220\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽5</text><rect x=\"20\" y=\"190\" width=\"64\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"52\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽6</text><rect x=\"20\" y=\"70\" width=\"64\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"52\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽7</text><path d=\"M330 62 C330 100 330 100 330 118\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"346\" y=\"92\" font-size=\"12\" fill=\"var(--accent)\">cursor 生产序号</text><path d=\"M330 240 C330 210 330 190 330 172\" fill=\"none\" stroke=\"var(--lv3)\" stroke-width=\"2\"/><text x=\"346\" y=\"210\" font-size=\"12\" fill=\"var(--lv3)\">消费者序号</text><text x=\"20\" y=\"286\" font-size=\"12\" fill=\"var(--muted)\">容量 2 的幂，序号 & (size-1) 定位；生产者 CAS 抢 cursor，超前最慢消费者一圈则等待；publish 前消费者不可见</text></svg>",
    "caption": "图：环形缓冲区结构（预分配事件 + cursor/消费者序号推进）"
   },
   {
    "t": "h",
    "text": "三、缓存行填充：把伪共享钉死在摇篮里"
   },
   {
    "t": "p",
    "text": "CPU 以缓存行（通常 64 字节）为单位读写内存。生产者线程在某核频繁更新 cursor，消费者线程在另一核频繁读自己的消费序号——如果这两个序号恰好落在同一个 64 字节缓存行里，每次写都会导致对方的缓存行失效，双方被迫反复从主存重载，这就是伪共享（False Sharing）：变量本身没共享，缓存行共享了。Disruptor 的解法是用空间换时间：Sequence 类的 value 字段前后各填充 7 个 long（7×8=56 字节 + 8 字节字段 = 独占 64 字节缓存行），让 cursor 与任何其他并发修改的字段物理隔离。JDK8 起官方给了 @sun.misc.Contended 注解，LongAdder 的 Cell、ConcurrentHashMap 的 CounterCell 都靠它自动填充，启动参数 -XX:-RestrictContended 控制开关。手动填充更彻底但侵入代码，注解更优雅但依赖 JVM 参数与内部 API——两者都值得在面试里主动讲出来。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">消费依赖：链式/菱形依赖由 SequenceBarrier 协调，最慢者决定水位</text><rect x=\"20\" y=\"48\" width=\"140\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"90\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">生产者</text><text x=\"90\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发布事件</text><path d=\"M160 76 L208 76\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"184\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">写入</text><rect x=\"210\" y=\"48\" width=\"140\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"280\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">RingBuffer</text><text x=\"280\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">事件槽位</text><path d=\"M350 76 L398 76\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"374\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">gating</text><rect x=\"400\" y=\"48\" width=\"140\" height=\"56\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"470\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">消费者 A</text><text x=\"470\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">业务处理</text><path d=\"M470 104 L470 140\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><rect x=\"360\" y=\"142\" width=\"220\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"470\" y=\"166\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">消费者 B：落库 / 日志</text><text x=\"470\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">依赖 A 的消费序号</text><text x=\"20\" y=\"230\" font-size=\"13\" fill=\"var(--accent)\">依赖规则：</text><text x=\"20\" y=\"252\" font-size=\"12\" fill=\"var(--muted)\">B 要等 A 消费完才处理 → B 的 SequenceBarrier 跟踪 A 的 Sequence；生产者要等最慢消费者释放槽位</text><text x=\"20\" y=\"276\" font-size=\"12\" fill=\"var(--muted)\">菱形依赖典型：单消费者写日志 + 双消费者备份（日志服/监控），最慢者决定环形缓冲水位</text></svg>",
    "caption": "图：消费依赖链（B 依赖 A 的消费进度，生产者等最慢消费者）"
   },
   {
    "t": "p",
    "text": "补充一个工程点：环形缓冲的水位（cursor 与最慢消费者序号的差值）是衡量系统积压的天然指标，监控它就能在背压失控前预警——这比 BlockingQueue 的 size() 更可靠，因为 Disruptor 取差值只需要两条 volatile 读，而并发写下的 size() 只是近似值且要遍历。"
   },
   {
    "t": "h",
    "text": "四、等待策略选型与游戏服落地"
   },
   {
    "t": "p",
    "text": "等待策略是延迟与 CPU 的权衡：BlockingWaitStrategy 用锁 + 条件变量，省 CPU 但延迟高；SleepingWaitStrategy 自旋 + 让出，均衡；YieldingWaitStrategy 自旋 + 让出 CPU 一次，游戏服低延迟常用；BusySpinWaitStrategy 纯自旋，延迟最低但烧满一个核。游戏服选 Yielding 最稳妥：玩家消息延迟敏感，但绝不接受一个核白烧。落地形态就是我们熟悉的『玩家绑定线程』：消费者按玩家 ID 哈希分工，每个消费者线程负责一群玩家，单玩家消息严格串行。生产者是 Netty IO 线程，把解码后的消息 publish 进环形缓冲，业务消费者取出来处理。要特别注意：消费者回调里绝不能做阻塞操作（同步 DB、HTTP），一个玩家慢会拖累同线程所有玩家——慢操作一律投递到异步池。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 事件定义：环形缓冲预创建实例，事件对象复用零 GC\npublic class GameEvent {\n    public int playerId;\n    public Object msg;          // 引用在使用后必须置空\n    public long seq;\n}\n\n// 处理器：单玩家串行消费的核心\npublic class PlayerHandler implements EventHandler<GameEvent> {\n    private final PlayerService playerService;\n    @Override\n    public void onEvent(GameEvent e, long seq, boolean endOfBatch) {\n        try {\n            playerService.dispatch(e.playerId, e.msg);   // 玩家绑定线程内处理\n        } finally {\n            e.msg = null;                                // 归还前清理引用\n        }\n    }\n}\n\n// 组装：单生产者 + Yielding 等待 + 消费者\nint ringSize = 1 << 16;                                  // 65536，2 的幂\nDisruptor<GameEvent> disruptor = new Disruptor<>(\n        GameEvent::new, ringSize,\n        r -> new Thread(r, \"game-\" + r.hashCode()),\n        ProducerType.SINGLE, new YieldingWaitStrategy());\ndisruptor.handleEventsWith(new PlayerHandler(playerService));\ndisruptor.start();\n\n// 发布：Netty IO 线程调用，CAS 无锁推进\nRingBuffer<GameEvent> ring = disruptor.getRingBuffer();\nlong s = ring.next();                                    // 申请槽位（CAS）\ntry {\n    GameEvent e = ring.get(s);\n    e.playerId = msg.playerId;\n    e.msg = msg;\n} finally {\n    ring.publish(s);                                     // 发布后才对消费者可见\n}"
   },
   {
    "t": "h",
    "text": "五、批量消费：摊薄调度的最后一公里"
   },
   {
    "t": "p",
    "text": "Disruptor 的消费者回调带 endOfBatch 参数——一次取出一批事件，处理到最后一个时 endOfBatch 为 true。善用这个参数可以做批量收尾：日志类消费者攒一批再写盘，减少 IO 次数；业务消费者在每个 endOfBatch 时统一 flush 当前线程的脏数据标记，减少零碎的小写。批量消费的意义是摊薄『取号 + 回调 + 调度』的固定成本：单条消息的调度成本不变，一批消息分摊下来，每条的均摊成本显著下降。这是 Disruptor 宣称吞吐接近理论上限的最后一层优化，很多讲四板斧的文章会把它的地位和缓存行填充并列，面试主动提出来是加分项。"
   },
   {
    "t": "h",
    "text": "六、多生产者与启动关闭纪律"
   },
   {
    "t": "p",
    "text": "多生产者场景（比如网关多线程投递）要改用 MultiProducerSequencer，它用 CAS 抢 cursor，多线程申请槽位时各自拿到不同序号，不会互相覆盖；代价是比单生产者多一些 CAS 开销，所以单线程投递（如单 IO 线程）用 ProducerType.SINGLE 更优。跨服务注意点：Disruptor 是进程内队列，别拿它跨机器——跨服消息走 Netty/Redis/Kafka。启动与关闭也讲究：start() 启动所有消费者线程；关闭时先停止接收新事件，等消费者把剩余积压消费完再释放资源，顺序反了会丢消息。游戏服关服时『踢玩家下线 → 等 Disruptor 排空 → 停落盘池』的顺序，就是这条纪律的落地。"
   },
   {
    "t": "pits",
    "items": [
     "环形缓冲容量不取 2 的幂：位运算定位失效，mod 取模性能差",
     "消费者回调里做同步 IO：一个玩家慢拖累整线程玩家，必须投递异步池",
     "发布后修改 Event：publish 后消费者已可见，再改就是数据竞争——先填数据后 publish",
     "事件引用不清理：槽位复用后旧对象残留引用，GC 压力回流，对象池白做",
     "生产环节节流：RingBuffer 满了生产者自旋等待，不配超时/降级就会把 IO 线程烧满"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Disruptor 四板斧（环形预分配零 GC / CAS 序号无锁 / 缓存行填充防伪共享 / 批量消费）→ 序号机制决定生产消费协调 → 消费依赖用 SequenceBarrier 跟踪 → 等待策略按延迟/CPU 权衡 → 游戏服落地玩家绑定串行，回调禁阻塞。这是简历里『核心消息链路』最有含金量的技术叙事。"
   }
  ]
 },
 {
  "id": "java-concurrent-patterns",
  "title": "并发设计模式：不可变 / 线程封闭 / COW / 生产者-消费者",
  "layer": 2,
  "depends": [
   "java-concurrent-cas-atomic",
   "java-concurrent-collections"
  ],
  "covers": [
   "java-concurrent-34",
   "java-concurrent-35"
  ],
  "quiz": [
   "java-concurrent-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "并发安全的最高境界不是把锁用得出神入化，而是让问题根本不存在：不可变对象『发布即安全』、线程封闭『不共享就没错』、Copy-on-Write『读快照不锁』、生产者-消费者『有界解耦带背压』——四个模式对应四条消灭竞争的思路。"
   },
   {
    "t": "pre",
    "items": [
     "CAS 原子类与 volatile 发布语义",
     "COW 容器与 BlockingQueue 的适用边界",
     "玩家数据串行写 + 高频读的游戏服现实"
    ]
   },
   {
    "t": "h",
    "text": "一、模式总览：五种思路各灭一类问题"
   },
   {
    "t": "list",
    "items": [
     "不可变对象：数据构造完就不许变，任何线程读到的都是完整一致版本——消灭『改到一半被看见』",
     "线程封闭：栈封闭 / ThreadLocal / 玩家绑定线程——不共享，就无竞争",
     "Copy-on-Write：写时复制整体替换，读者拿快照迭代——读多写少专用",
     "生产者-消费者：有界缓冲解耦生产与消费速度，积压量就是背压信号",
     "同步策略（互补）：锁 / CAS 只在无法用上面四招兜底时兜底"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">并发设计模式总览：五个维度各管一类问题</text><rect x=\"20\" y=\"40\" width=\"180\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"110\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">不可变对象</text><text x=\"110\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">final 字段 + 无 setter</text><text x=\"110\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发布即安全，读侧无锁</text><text x=\"110\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家快照 / 配置项</text><rect x=\"230\" y=\"40\" width=\"180\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程封闭</text><text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">栈封闭 / ThreadLocal</text><text x=\"320\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家绑定线程串行</text><text x=\"320\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">零锁正确性</text><rect x=\"440\" y=\"40\" width=\"180\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"530\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Copy-on-Write</text><text x=\"530\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">写时复制整个数组</text><text x=\"530\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读者拿快照不锁</text><text x=\"530\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">监听器 / 热更新配置</text><rect x=\"60\" y=\"180\" width=\"240\" height=\"86\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"180\" y=\"204\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">生产者-消费者</text><text x=\"180\" y=\"226\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">有界缓冲解耦速度</text><text x=\"180\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">积压量即背压信号</text><text x=\"180\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家消息 → 落盘 / 日志</text><rect x=\"330\" y=\"180\" width=\"260\" height=\"86\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"460\" y=\"204\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">读写分离（快照发布）</text><text x=\"460\" y=\"226\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读多写少：volatile 引用整体替换</text><text x=\"460\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">配置表 99.99% 读 → 热更新换引用</text><text x=\"460\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">排行榜副本发布，玩家读无锁</text><text x=\"20\" y=\"296\" font-size=\"12\" fill=\"var(--muted)\">共同哲学：要么让数据不可变/不共享（消灭问题），要么用快照让读写互不干扰（隔离问题），锁只兜底</text></svg>",
    "caption": "图：并发设计模式总览（不可变 / 封闭 / COW / 生产消费 / 快照发布）"
   },
   {
    "t": "h",
    "text": "二、不可变对象：发布即安全"
   },
   {
    "t": "p",
    "text": "不可变对象的规则：所有字段 final、不提供 setter、可变集合拷贝后包装成不可修改视图、构造完成后不泄漏 this。为什么不可变对象天然线程安全？因为『安全发布』——final 字段的写入对任意线程可见（final 语义保证），且对象内容永不改变，线程读到的任何时刻都是完整一致版本，不需要锁也不需要 volatile（final 字段自有可见性保证）。游戏服的黄金应用是玩家数据快照：玩家背包、金币是高频读写热点，内存层由玩家绑定线程串行改，但排行榜线程、GM 后台、跨服同步都要读——不能让他们直接读可变对象。做法是写线程在改动后构建不可变快照，volatile 引用发布，读者拿快照读，永远看不到写一半的数据。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 玩家不可变快照：final 字段 + 只读 getter，构造完成即定格\npublic final class PlayerSnapshot {\n    private final long playerId;\n    private final long gold;\n    private final Map<Integer, Item> items;   // 不可变视图\n    public PlayerSnapshot(long id, long gold, Map<Integer, Item> items) {\n        this.playerId = id;\n        this.gold = gold;\n        this.items = Collections.unmodifiableMap(new HashMap<>(items));\n    }\n    public long getGold() { return gold; }\n    public Map<Integer, Item> getItems() { return items; }\n}\n\n// 写线程：改动后构建快照，volatile 引用发布\nprivate volatile PlayerSnapshot snapshot;\nvoid onGoldChanged(long delta) {\n    PlayerSnapshot old = snapshot;\n    Map<Integer, Item> copy = new HashMap<>(old.getItems());   // 拷贝\n    copy.put(itemId, old.getItems().get(itemId).copy());       // 浅拷贝可变值\n    snapshot = new PlayerSnapshot(old.playerId, old.gold + delta, copy);\n}\n\n// 读者（排行榜/GM/跨服）：拿快照读，无锁、永远一致\nPlayerSnapshot s = snapshot;\nrankUpdater.update(s.getPlayerId(), s.getGold());"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">玩家数据不可变快照：写线程改内存版 → 构建快照 → volatile 发布 → 读线程拿快照</text><rect x=\"20\" y=\"48\" width=\"170\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"105\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">玩家绑定写线程</text><text x=\"105\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">内存版对象（可变）</text><text x=\"105\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">改背包 / 扣金币</text><path d=\"M190 88 L238 88\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"214\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">拷贝</text><rect x=\"240\" y=\"48\" width=\"170\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"325\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">不可变快照</text><text x=\"325\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">final 字段全量拷贝</text><text x=\"325\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">构造完成即定格</text><path d=\"M410 88 L458 88\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"434\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">发布</text><rect x=\"460\" y=\"48\" width=\"160\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"540\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">volatile 引用</text><text x=\"540\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">snapshot</text><text x=\"540\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">写后可见</text><path d=\"M280 128 L280 170\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 4\"/><path d=\"M540 128 L540 170\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"556\" y=\"152\" font-size=\"12\" fill=\"var(--accent)\">读取</text><rect x=\"40\" y=\"172\" width=\"240\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"160\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">排行榜线程</text><text x=\"160\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读快照排序，无锁安全</text><rect x=\"360\" y=\"172\" width=\"240\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"480\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">GM 后台 / 跨服</text><text x=\"480\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读快照展示，无锁安全</text><text x=\"20\" y=\"268\" font-size=\"12\" fill=\"var(--muted)\">代价是写时全量拷贝，适合『写低频、读高频』；读者永远拿到一致版本，不会看到写一半的数据</text></svg>",
    "caption": "图：玩家不可变快照发布（写线程改→快照→volatile 发布→读者无锁读）"
   },
   {
    "t": "h",
    "text": "三、线程封闭与 Copy-on-Write"
   },
   {
    "t": "p",
    "text": "线程封闭分三层：栈封闭（局部变量只在当前线程，天然安全）、ThreadLocal 封闭（每线程副本，注意生命周期与 remove）、Ad-hoc 封闭（约定某数据只被某线程碰，靠纪律）。游戏服的玩家绑定线程就是 Ad-hoc 封闭的系统级应用——玩家对象只被其绑定线程访问，其他线程想操作就投递消息过去。Copy-on-Write 是另一条思路：COW 容器底层是不可变数组快照，写操作加锁复制整个数组再替换 volatile 引用，读者迭代时遍历快照——迭代器不抛 ConcurrentModificationException，但也看不到最新修改（弱一致）。适用边界要说清：监听器列表（启动注册一次、触发读千万次）用它完美；实时排行榜（每秒写）用它等于每次写复制整个数组，写放大雪崩。替代方案就是上一节的不可变快照 + volatile 发布，语义完全相同，只是把『复制』从容器内部挪到业务层，粒度更可控。"
   },
   {
    "t": "h",
    "text": "四、生产者-消费者与读写分离落地"
   },
   {
    "t": "p",
    "text": "生产者-消费者模式的价值是解耦与削峰：生产者不关心消费者快慢，消费者不阻塞生产者。落地要点是『有界 + 背压』：队列必须有界，满的时候要么阻塞（BlockingQueue.put）、要么拒绝降级（offer 失败丢弃 + 计数告警）。游戏服的典型管道：玩家业务线程（生产者）→ 有界队列 → 落盘线程（消费者），队列满就说明落盘跟不上，触发降级而不是让玩家线程无限堆积。读写分离的思想再延伸一层：配置表『读 99.99%、热更新才写』，用不可变配置对象 + volatile 引用整体替换，读者完全无锁——这比读写锁更好，因为连读锁的开销都省了。整个模式章节的核心话术：先讲『用哪种思路消灭竞争』，再讲『锁只做兜底』，最后落一个真实案例。"
   },
   {
    "t": "h",
    "text": "五、并发单例：四个变体的取舍"
   },
   {
    "t": "p",
    "text": "单例是并发模式的最小考题，四个变体要能讲出选型依据而不是背写法。DCL + volatile：懒加载 + 可定制构造，但要正确理解屏障语义；静态内部类 Holder：类加载天然线程安全、零同步开销、代码最简洁，是懒加载单例的事实标准；枚举：反射和序列化双重免疫，最适合『工具类 + 全局状态』这种无需懒加载的场合；static final 直接初始化：最简单，但加载时机完全由 JVM 决定。面试节奏建议：先 DCL 把屏障讲透（证明原理），再补『其实生产上静态内部类更常用』（展示工程判断），最后提枚举防反射（秀知识面）。"
   },
   {
    "t": "h",
    "text": "六、读写分离的更深一层"
   },
   {
    "t": "p",
    "text": "读写分离再往前一步就是 CQRS 的局部形态：内存里的玩家热数据一套结构（写友好），展示给排行榜/GM 的投影一套结构（读友好），两者靠事件异步对齐。它和『不可变快照』的区别是：快照是同一数据的副本，投影是不同结构的重建。游戏服的战力榜、全服排行这类『读极多、写集中』的场景，用『结算时批量重算投影 + volatile 发布』比实时加锁更新优雅得多。把这两个概念讲清楚，你就超出了『会写 COW』的层面，进入『会用模式组合』的层面。"
   },
   {
    "t": "pits",
    "items": [
     "不可变对象内部泄漏可变引用：getter 直接返回内部 Map，调用方一改就破功——必须返回拷贝或不可修改视图",
     "快照粒度太大：整个玩家对象每秒都拷贝一次，写放大——按『读者需要哪些字段』裁剪快照",
     "COW 用在高频写场景：每次写复制整个数组，写放大雪崩，只能读多写极少",
     "生产者-消费者队列无界：落盘跟不上时内存无限膨胀 OOM，必须显式有界 + 背压",
     "『不可变就线程安全』忘了引用发布：对象不可变但引用没有正确发布（非 volatile/未同步），读者可能看到默认值"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：并发设计先问『能不能让问题不存在』→ 不可变对象发布即安全（玩家快照）→ 线程封闭不共享（玩家绑定线程）→ COW 读多写极少专用（监听器）→ 生产消费有界带背压（落盘管道）→ 锁与 CAS 只兜底。面试把『消灭竞争的思路』讲在前，比背一堆锁 API 高级得多。"
   }
  ]
 },
 {
  "id": "java-concurrent-forkjoin-stream",
  "title": "Fork/Join 与并行流",
  "layer": 2,
  "depends": [
   "java-concurrent-thread-pool"
  ],
  "covers": [
   "java-concurrent-26"
  ],
  "quiz": [
   "java-concurrent-26"
  ],
  "body": [
   {
    "t": "lead",
    "text": "ForkJoinPool 是为『可递归分治的 CPU 密集任务』设计的：每个线程一条双端队列、自己 LIFO 取、空闲偷别人 FIFO 偷，配合 RecursiveTask 的 fork/join 实现负载均衡；parallelStream 底层就是它——但全局共享的 commonPool 和顺序性、共享可变状态两大陷阱，让它在游戏服只适合导表校验、日志聚合这类批处理。"
   },
   {
    "t": "pre",
    "items": [
     "ThreadPoolExecutor 的队列调度模型（对比参照）",
     "CompletableFuture 默认线程池与 commonPool 的关系",
     "Stream API 的中间/终止操作与惰性求值"
    ]
   },
   {
    "t": "h",
    "text": "一、设计思想：分治 + 工作窃取"
   },
   {
    "t": "p",
    "text": "ThreadPoolExecutor 是『全局共享阻塞队列 + 线程抢任务』，适合独立任务；ForkJoinPool 面对的是『一个任务能递归拆成子任务』的形态——一个大任务拆成两个、两个拆四个，最后合并。如果子任务全进一个共享队列，线程一调 fork 就把子任务塞回同一队列，自己还得去抢，缓存全废。所以 ForkJoin 给每个工作线程一条自己的双端队列：自己 fork 出的子任务 push 到自己队列，自己取任务从同一端 LIFO（刚 fork 的最近任务还在 CPU 缓存里，命中率高）；队列空了就去别的线程队列『另一端』偷（FIFO，拿对方最老通常最大的活，让窃取者长时间忙碌）。双端取不同端，天然减少冲突。关键点：join() 不会让线程空等——被 join 的任务没完成，当前线程转身去执行自己队列或偷来的任务，CPU 永远满载。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">ForkJoin 工作窃取：自己取队尾 LIFO 最近任务，空闲偷别人队头 FIFO 最老任务</text><rect x=\"20\" y=\"44\" width=\"290\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Worker A 的双端队列</text><rect x=\"40\" y=\"80\" width=\"70\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"75\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">任务3</text><rect x=\"120\" y=\"80\" width=\"70\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"155\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">任务2</text><rect x=\"200\" y=\"80\" width=\"70\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"235\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">任务1</text><path d=\"M235 120 L235 142\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"251\" y=\"136\" font-size=\"12\" fill=\"var(--accent)\">A 从队尾 LIFO 取</text><rect x=\"340\" y=\"44\" width=\"290\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"485\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Worker B 的队列（已空）</text><text x=\"485\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">B 空闲 → 去偷 A</text><path d=\"M110 80 C110 52 300 52 300 60\" fill=\"none\" stroke=\"var(--lv3)\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/><text x=\"140\" y=\"46\" font-size=\"12\" fill=\"var(--lv3)\">B 偷走任务3（另一端的最老任务）</text><text x=\"20\" y=\"196\" font-size=\"13\" fill=\"var(--accent)\">为什么这样设计：</text><text x=\"20\" y=\"218\" font-size=\"12\" fill=\"var(--muted)\">自己取 LIFO：最近 fork 的子任务还在 CPU 缓存里，命中率高；</text><text x=\"20\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">偷取 FIFO：拿对方最老、通常最大块的活，让窃取者长时间保持忙碌；</text><text x=\"20\" y=\"262\" font-size=\"12\" fill=\"var(--muted)\">双端取不同端 → 少冲突；join 不空等，线程转身干别的，CPU 永不闲置</text></svg>",
    "caption": "图：工作窃取双端队列（LIFO 自取 + FIFO 偷取）"
   },
   {
    "t": "h",
    "text": "二、RecursiveTask / RecursiveAction 与拆分粒度"
   },
   {
    "t": "p",
    "text": "ForkJoinTask 有两个子类：RecursiveTask 有返回值（求和、聚合、统计），RecursiveAction 无返回值（排序、批量写）。模板就是 compute() 里判断：任务足够小直接算（阈值），否则拆两半——left.fork() 异步入队、right.compute() 当前线程算、left.join() 合并。这里有个性能细节：一半 fork 一半 compute，而不是两个都 fork，因为当前线程反正要等，自己算一半省一次入队出队。拆分粒度是工程关键：阈值太小，拆分开销（入队 + 任务对象）大于计算本身；阈值太大，并行度不足。经验值：单个任务执行在微秒到几十微秒区间比较合适，阈值通常取几千到几万条数据。ForkJoinPool 也可以自定义并行度：new ForkJoinPool(核数)，别用默认——默认池是全局共享的 commonPool，别把批处理任务倒进去污染别人。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// RecursiveTask：日志聚合求和（游戏服批量统计场景）\npublic class SumTask extends RecursiveTask<Long> {\n    private static final int THRESHOLD = 10_000;\n    private final long[] data;\n    private final int from, to;\n    public SumTask(long[] data, int from, int to) {\n        this.data = data; this.from = from; this.to = to;\n    }\n    @Override\n    protected Long compute() {\n        int n = to - from;\n        if (n <= THRESHOLD) {            // 足够小 → 直接算\n            long s = 0;\n            for (int i = from; i < to; i++) s += data[i];\n            return s;\n        }\n        int mid = from + n / 2;\n        SumTask left = new SumTask(data, from, mid);\n        left.fork();                     // 左半异步入队\n        long right = new SumTask(data, mid, to).compute(); // 右半当前线程算\n        return left.join() + right;      // 合并\n    }\n}\n\n// 独立池：不污染 commonPool\nForkJoinPool calcPool = new ForkJoinPool(\n    Runtime.getRuntime().availableProcessors());\nlong total = calcPool.invoke(new SumTask(logs, 0, logs.length));"
   },
   {
    "t": "h",
    "text": "三、parallelStream 底层：commonPool 与三大陷阱"
   },
   {
    "t": "p",
    "text": "parallelStream() 底层就是 ForkJoinPool.commonPool()，并行度 = max(1, CPU 核数 - 1)，全 JVM 共享、daemon 线程。三大陷阱逐个说：第一，性能陷阱——数据量小时并行开销大于收益，10 万条以内串行更快；嵌套并行流会互相占线程；线程数本来就比核数少 1，流内再套 CompletableFuture 默认链会饿死。第二，顺序性陷阱——并行流结果对『顺序有要求』的收集（比如按序拼接、有状态累加）语义会变，reduce 的累加器必须可交换可结合。第三，共享可变状态陷阱——parallelStream().forEach 里去改共享 Map/List 是经典翻车现场，即使用了 ConcurrentHashMap，非原子的 read-modify-write（如 counter.merge 的语义依赖）也要仔细。第四，阻塞陷阱——流内跑 DB 查询/HTTP 会占满 commonPool，把全进程所有并行任务一起拖死。给并行流指定自定义池的方式：new ForkJoinPool(n).submit(()->list.parallelStream().collect(...)).join()。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">commonPool 共享陷阱：默认并行度 CPU核数-1，一个阻塞任务饿死所有人</text><rect x=\"20\" y=\"40\" width=\"600\" height=\"80\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"320\" y=\"64\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">ForkJoinPool.commonPool()（全 JVM 共享，daemon 线程）</text><text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">默认并行度 = max(1, CPU核数 - 1)，16 核约 15 线程</text><text x=\"320\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">parallelStream / supplyAsync 默认共用</text><rect x=\"40\" y=\"140\" width=\"160\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">parallelStream</text><text x=\"120\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">批量统计</text><rect x=\"240\" y=\"140\" width=\"160\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">supplyAsync</text><text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录链路</text><rect x=\"440\" y=\"140\" width=\"160\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"520\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">流内阻塞任务</text><text x=\"520\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DB 查询 / HTTP</text><path d=\"M120 140 L120 126 L320 126 L320 120\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M320 140 L320 120\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M520 140 L520 126 L320 126\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2\"/><text x=\"20\" y=\"226\" font-size=\"13\" fill=\"var(--accent)\">流内阻塞把 commonPool 占满 → 所有并行任务一起饿死</text><text x=\"20\" y=\"252\" font-size=\"12\" fill=\"var(--muted)\">解法：CompletableFuture 全部显式传自定义池；并行流也要自定义池 + 不跑阻塞 IO</text><text x=\"20\" y=\"276\" font-size=\"12\" fill=\"var(--muted)\">游戏服批量计算（导表校验/日志聚合）用独立 ForkJoinPool，控制好阈值粒度</text></svg>",
    "caption": "图：commonPool 全局共享与阻塞饿死陷阱"
   },
   {
    "t": "h",
    "text": "四、游戏服批量计算场景"
   },
   {
    "t": "p",
    "text": "游戏服里 Fork/Join 的合理落点都是『离线/低频的 CPU 密集批处理』，不是玩家在线链路：导表工具解析配置文件并做一致性校验（几万行 Excel 转对象 + 外键检查）、日志聚合统计（把一天几亿条日志按服/渠道聚合出 PV/UV）、GM 后台批量报表计算、战斗录像回放批量验证。这些任务的共同特征：数据量大、可分区、无阻塞、结果可合并——正好是工作窃取的最佳舞台。反过来，任何带 DB/Redis/HTTP 阻塞的『并行』都不要用 ForkJoin，阻塞会让工作窃取彻底失效（线程等着不干活，偷也偷不出性能），改用异步 IO + 线程池的组合。结论一句话：分治是给纯计算的，IO 是给异步池的，别混。"
   },
   {
    "t": "p",
    "text": "还有一个常见误解要澄清：ForkJoin 不是『多线程肯定快』的银弹。拆分越细，任务对象越多、入队越频繁，固定开销越大；线程数超过核数反而增加切换。评估收益的正确方式是 JMH 对比『串行 vs ForkJoin vs parallelStream』三档，用实测数据说话。游戏服导表这种一次性任务，并行可能只省几秒，代码复杂度却上一个等级——先量化再并行，别为并行而并行。"
   },
   {
    "t": "h",
    "text": "五、parallelStream 的正确打开方式"
   },
   {
    "t": "p",
    "text": "给并行流一个正确的打开姿势：数据量大（几十万以上）才值得并行，小数据并行反而更慢；任务必须是纯计算、无共享可变状态；确认不跑阻塞 IO；需要控制并行度时用自定义池（new ForkJoinPool(n).submit(...).join()），别用 commonPool；需要顺序保持时在收集阶段用有序收集器。一个反直觉的点：parallelStream 的 toList 结果是按 encounter order 的（并行只是内部拆分，收集保持遇序），但 forEach 的执行顺序不保证——所以『要顺序就收集，不要顺序才 forEach 并行』。"
   },
   {
    "t": "p",
    "text": "还有一点值得记住：parallelStream 的并行行为取决于元素数量与每个元素的处理成本，JVM 会做内部阈值判断，数据太少时根本不会并行，所以『我写了 parallelStream 它一定并行』是错的——它可能退化成串行，也可能因为 commonPool 线程不足而排队。想确认实际并行度，加日志打印当前线程名，线上最容易暴露真相。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 自定义池跑并行流：控制并行度，不污染 commonPool\nForkJoinPool custom = new ForkJoinPool(4);\ntry {\n    long total = custom.submit(\n        () -> dailyLogs.parallelStream()\n                       .mapToLong(LogEntry::getCostMs)\n                       .sum()).join();\n} finally {\n    custom.shutdown();\n}"
   },
   {
    "t": "h",
    "text": "六、ForkJoin 与虚拟线程的分工"
   },
   {
    "t": "p",
    "text": "虚拟线程（JDK21）解决的是『阻塞等待太贵』，ForkJoin 解决的是『CPU 密集型并行』，两者定位完全不同。虚拟线程适合大量阻塞 IO 场景（渠道 SDK 验证、支付回调），把同步写法当并发用；ForkJoin 适合少量线程把核占满的纯计算。游戏服的正确分工：网络/DB 阻塞 → 虚拟线程或异步 IO；配置解析/日志聚合/数值模拟 → ForkJoin 并行计算。面试里能说出这个分工，说明你见过这两种技术各自的甜区，而不是把新名词都往自己项目里套——这也是十年经验区别于背题的关键。"
   },
   {
    "t": "pits",
    "items": [
     "parallelStream 里改共享可变状态：并行修改同一容器/计数器，结果错乱还难复现",
     "commonPool 里跑阻塞 IO：占满全局共享池，把别的模块的并行任务一起拖死",
     "阈值设太小：拆分开销大于计算本身，并行反而更慢；数据量小也用并行也是同类问题",
     "用并行流还要求处理顺序：并行不保证顺序，顺序敏感该用串行流或按序收集",
     "reduce 累加器非结合/交换：并行归约结果不确定，必须满足结合律交换律"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：ForkJoinPool=分治 + 工作窃取（LIFO 自取 + FIFO 偷取）→ RecursiveTask/Action 拆到阈值直接算 → parallelStream 底层就是 commonPool（CPU核数-1、全局共享）→ 四大陷阱：性能/顺序/共享状态/阻塞 → 游戏服只用于导表校验、日志聚合这类纯计算批处理，IO 场景交给异步线程池。"
   }
  ]
 },
 {
  "id": "java-concurrent-game-server",
  "title": "游戏服并发实战：线程模型与玩家数据",
  "layer": 3,
  "depends": [
   "java-concurrent-thread-pool",
   "java-concurrent-aqs-lock"
  ],
  "covers": [
   "java-concurrent-19",
   "java-concurrent-22",
   "java-concurrent-23",
   "java-concurrent-25",
   "java-concurrent-32",
   "java-concurrent-35"
  ],
  "quiz": [
   "java-concurrent-19",
   "java-concurrent-23",
   "java-concurrent-32"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服并发的主战场：用『IO 线程与业务线程分离 + 玩家 ID 哈希绑线程』从架构上消灭锁，落盘层用批量合并 + 乐观锁兜底，Disruptor 无锁投递，虚拟线程补外围链路。"
   },
   {
    "t": "pre",
    "items": [
     "线程池设计与阻塞队列（投递链路的基础）",
     "AQS 与锁体系（兜底与跨玩家场景）",
     "上一节点全部内容（本章是收口实战）"
    ]
   },
   {
    "t": "h",
    "text": "一、三层线程模型：用线程模型消灭锁"
   },
   {
    "t": "list",
    "items": [
     "Netty boss/worker IO 线程：只做收发包、编解码，绝不阻塞、绝不碰业务",
     "业务逻辑线程（Disruptor 消费者）：玩家 ID 哈希绑定固定线程，单玩家消息严格串行",
     "异步线程池：DB 落盘、日志、BI 上报等慢 IO，业务线程只发事件不等待"
    ]
   },
   {
    "t": "p",
    "text": "为什么玩家串行？玩家数据（背包、金币、任务）是高频读写热点，多线程并发改要么加锁（性能差易死锁）要么脏数据。哈希绑定后，玩家 A 的『扣金币买道具』和『领任务奖励』排队执行，无锁、可复现。跨玩家交互（交易、组队、战斗）才需要小心：把请求投递到目标玩家线程，或战斗中数据拷贝进战斗上下文闭环结算。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">游戏服三层线程模型</text><rect x=\"20\" y=\"40\" width=\"600\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Netty IO 线程（boss/worker）</text><text x=\"320\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只做收发包/编解码，绝不阻塞，绝不碰业务</text><path d=\"M320 100 L320 124\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"336\" y=\"116\" font-size=\"12\" fill=\"var(--accent)>publishEvent</text><rect x=\"20\" y=\"126\" width=\"600\" height=\"66\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"149\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Disruptor RingBuffer → 业务消费者线程</text><text x=\"320\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">玩家 ID % 消费者数 绑定 → 单玩家严格串行，无锁处理</text><text x=\"320\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">禁：同步 DB、HTTP、长时间持锁——一次阻塞拖累整线程的玩家</text><path d=\"M320 192 L320 216\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"336\" y=\"208\" font-size=\"12\" fill=\"var(--accent)>异步事件</text><rect x=\"20\" y=\"218\" width=\"290\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"242\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">DB 落盘线程池</text><text x=\"165\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>批量合并 + version 乐观锁</text><rect x=\"330\" y=\"218\" width=\"290\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"475\" y=\"242\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">日志/BI 上报池</text><text x=\"475\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>可丢弃 + 有界队列</text><text x=\"20\" y=\"306\" font-size=\"12\" fill=\"var(--muted)\">Disruptor 四快：环形数组预分配零 GC、CAS 序号无锁、缓存行填充防伪共享、批量消费 drain</text></svg>",
    "caption": "图：游戏服三层线程模型（Netty → Disruptor → 异步池）"
   },
   {
    "t": "h",
    "text": "二、Disruptor 为什么快"
   },
   {
    "t": "list",
    "items": [
     "RingBuffer：定长环形数组，启动预分配所有 Event，覆盖写不做对象创建——零 GC",
     "序号机制：生产者 CAS 竞争 cursor，capacity 取 2 的幂位运算取模定位",
     "缓存行填充：cursor/消费者序号等高频写字段填 7 个 long 防伪共享",
     "批量消费：一次 drain 积压消息，摊薄调度成本"
    ]
   },
   {
    "t": "p",
    "text": "等待策略选型：BlockingWaitStrategy（锁+Condition 省 CPU）、SleepingWaitStrategy（自旋+让出均衡，适合异步日志）、YieldingWaitStrategy（游戏服低延迟常用）、BusySpinWaitStrategy（纯自旋极致延迟但烧 CPU）。多消费者按玩家哈希分工，仍保持单玩家串行。RingBuffer 满了生产者自旋等待，要配超时/降级并监控水位做背压告警。"
   },
   {
    "t": "h",
    "text": "三、玩家数据高并发写入全链路"
   },
   {
    "t": "p",
    "text": "分层防御：内存层靠玩家绑定线程串行化消灭竞争，金币扣减在串行上下文直接余额判断天然原子；落盘层不实时写库——内存标记脏位，定时（如 5 分钟）+ 关键节点（下线、关服）批量落盘，UPDATE 带 version 乐观锁：UPDATE player SET gold=?, version=version+1 WHERE id=? AND version=?，影响行数为 0 说明被 GM 后台等外部改过，告警 + 重读合并。容错：关键操作（充值、交易）实时落盘不走批量；普通操作先写 Kafka 操作日志，宕机后回放恢复到最近一致点。关服流程：volatile 停服标志 → 拒新登录 → 踢下线触发落盘 → 等落盘池 drain → JVM 退出。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">玩家数据并发写入全链路（分层防御）</text><rect x=\"20\" y=\"40\" width=\"600\" height=\"62\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">内存层：玩家绑定线程串行化</text><text x=\"320\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单玩家写操作排队执行 → 天然原子无锁；跨玩家操作投递到目标线程，严禁跨线程直改</text><path d=\"M320 102 L320 124\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"336\" y=\"118\" font-size=\"12\" fill=\"var(--accent)>脏位标记</text><rect x=\"20\" y=\"126\" width=\"600\" height=\"62\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"149\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">落盘层：定时批量 + 关键节点落盘（异步线程池）</text><text x=\"320\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">UPDATE ... WHERE version=? 影响行数 0 → 冲突，重读合并 + 告警</text><path d=\"M320 188 L320 210\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"336\" y=\"204\" font-size=\"12\" fill=\"var(--accent)>先写日志</text><rect x=\"20\" y=\"212\" width=\"290\" height=\"62\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"165\" y=\"235\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Kafka 操作日志（回放兜底）</text><text x=\"165\" y=\"255\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">宕机按日志重放到最近一致点</text><rect x=\"330\" y=\"212\" width=\"290\" height=\"62\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"475\" y=\"235\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">DB（乐观锁 version）</text><text x=\"475\" y=\"255\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 操作也必须走游戏服消息链路，严禁直改库</text></svg>",
    "caption": "图：内存串行 → 批量落盘 → 日志回放（三层防御）"
   },
   {
    "t": "h",
    "text": "四、虚拟线程：优化什么，不优化什么"
   },
   {
    "t": "p",
    "text": "JDK21（JEP 444）引入虚拟线程：JVM 调度的轻量级线程，M:N 映射到少量载体线程（ForkJoinPool），阻塞 IO 时自动 unmount 让出载体。利好：登录服渠道 SDK 验证、支付回调、GM 后台 HTTP、日志上报这些阻塞式调用可回归同步写法，代码大幅简化。不能替代的：玩家消息串行模型是并发正确性设计，不是线程成本问题；战斗服 tick 这种 CPU 密集长任务用虚拟线程毫无意义。两个大坑：一是 synchronized pinning——JDK21 里虚拟线程在 synchronized 块内阻塞 IO 会钉住载体线程，JDK24（JEP 491）已从 JVM 层面解决（JDK25 是首个含此修复的 LTS）；二是百万虚拟线程 × ThreadLocal 大对象 = 内存爆炸。结论话术：虚拟线程让外围异步链路回归同步，Netty IO + Disruptor 投递 + 玩家绑定线程这套核心架构依然成立。"
   },
   {
    "t": "h",
    "text": "五、死锁排查与对象池"
   },
   {
    "t": "p",
    "text": "死锁四条件：互斥、占有且等待、不可剥夺、循环等待。工程上最有效的是破坏循环等待——跨玩家操作按 playerId 排序后依次加锁，或干脆投递到目标玩家线程串行化；规则『持锁期间绝不阻塞 RPC』。排查三板斧：jstack 直接输出 Found one Java-level deadlock；ThreadMXBean.findDeadlockedThreads() 写进监控线程定时自检 + 告警；Arthas thread -b 线上无侵入。对象池方面，Netty Recycler 是教科书：线程局部 Stack + WeakOrderQueue 跨线程归还，借还全路径无锁、对象回『熟悉』它的线程（线程亲和）。池化铁律：归还前必须 reset、绝不能同时被两线程使用、池必须有界。先 profiling 再池化——对象小构造便宜时分配只是 TLAB 指针碰撞，乱池化是反模式。"
   },
   {
    "t": "pits",
    "items": [
     "业务线程里做同步 DB/HTTP：一次阻塞拖累该线程上所有玩家，全体卡顿——慢操作必须投递异步池",
     "跨玩家操作直接改对方对象：数据错乱。正确做法是消息投递到目标玩家线程",
     "批量落盘间隙宕机丢数据没兜底：关键操作实时落盘 + Kafka 操作日志回放，别裸奔",
     "虚拟线程 + synchronized 老代码：JDK21 有 pinning 风险，评估换 ReentrantLock 或升 JDK25 LTS",
     "环形队列/池化对象归还后旧引用继续用：唯一所有权必须严格移交（Netty ByteBuf 用引用计数 retain/release）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三层线程模型用串行化消灭锁 → Disruptor 无锁投递四板斧 → 玩家数据内存串行 + 批量落盘 + 乐观锁 + 日志回放 → 虚拟线程省线程不省锁 → 死锁排序加锁 + 监控自检。架构级取舍一句话：宁可单线程串行 + 异步批量落盘，不要多线程 + 锁 + 实时写库。"
   }
  ]
 },
 {
  "id": "java-concurrent-deadlock-debug",
  "title": "死锁排查与并发故障诊断",
  "layer": 3,
  "depends": [
   "java-concurrent-aqs-lock",
   "java-concurrent-game-server"
  ],
  "covers": [
   "java-concurrent-32",
   "java-concurrent-33"
  ],
  "quiz": [
   "java-concurrent-32"
  ],
  "body": [
   {
    "t": "lead",
    "text": "死锁四条件缺一不可、破一即解；线上诊断三板斧是 jstack、ThreadMXBean 自检、Arthas thread -b；CPU 飙高是另一类高频事故，靠『top 找线程 → 十六进制转 nid → jstack 对栈』三步定位——这两套动作是游戏服老手的条件反射。"
   },
   {
    "t": "pre",
    "items": [
     "synchronized/ReentrantLock 的获取释放语义",
     "线程六状态与 jstack 快照的读法",
     "游戏服『玩家绑定线程』串行模型（大部分死锁在这被架构消灭）"
    ]
   },
   {
    "t": "h",
    "text": "一、死锁四条件与工程破法"
   },
   {
    "t": "p",
    "text": "死锁成立必须同时满足四条件：互斥（资源一次只能被一个线程占用）、占有且等待（拿着 A 锁不放又去等 B 锁）、不可剥夺（别人拿着的锁抢不过来）、循环等待（T1 等 T2 的锁、T2 等 T1 的锁）。工程上不是四条件全都要破，而是挑最容易动手的破：破『循环等待』最常用——多把锁按固定顺序申请，比如跨玩家操作按 playerId 排序后依次加锁，所有人锁的顺序一致就不会成环；破『占有且等待』用 tryLock 超时，拿不到第二把锁就把第一把释放了重来；破『不可剥夺』用读写锁或 CAS 乐观重试；破『互斥』最难，通常让位给架构级方案——游戏服玩家绑定线程串行化，从根上消灭多锁竞争，这是终极解法。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">死锁四个必要条件：缺一不可，破一即解</text><rect x=\"40\" y=\"48\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"105\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">① 互斥</text><text x=\"105\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">资源独占使用</text><text x=\"105\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">锁不可共享</text><rect x=\"255\" y=\"48\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">② 占有且等待</text><text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">持 A 锁不释放</text><text x=\"320\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">又去等 B 锁</text><rect x=\"470\" y=\"48\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"535\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">③ 不可剥夺</text><text x=\"535\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">别人的锁抢不走</text><text x=\"535\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只能等其主动释放</text><rect x=\"40\" y=\"180\" width=\"250\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"165\" y=\"204\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">④ 循环等待</text><text x=\"165\" y=\"224\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">T1 等 T2 的锁，T2 等 T1 的锁</text><text x=\"165\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">环形依赖闭环</text><rect x=\"350\" y=\"180\" width=\"250\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"475\" y=\"204\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">工程破法</text><text x=\"475\" y=\"224\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">排序加锁破循环、tryLock 超时破等待</text><text x=\"475\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一次申请破占有、玩家串行免锁</text><text x=\"20\" y=\"280\" font-size=\"12\" fill=\"var(--muted)\">四条件全部满足才死锁；游戏服最有效的是架构级规避：玩家绑定线程串行化，从根上消灭多锁竞争</text></svg>",
    "caption": "图：死锁四条件与对应工程破法"
   },
   {
    "t": "h",
    "text": "二、排查三板斧：jstack / ThreadMXBean / Arthas"
   },
   {
    "t": "p",
    "text": "定位死锁的第一板斧是 jstack：dump 文件里直接输出 Found one Java-level deadlock 并给出完整的锁等待环，这是最直观的现场。第二板斧是主动防御：监控线程定时调 ManagementFactory.getThreadMXBean().findDeadlockedThreads()，返回非空说明有死锁，立刻抓 ThreadInfo 拼栈发钉钉告警——死锁往往发生在半夜的无人值守时段，被动等人发现不如监控自检。第三板斧是 Arthas：线上无侵入，thread -b 直接列出当前阻塞其他线程的持锁线程，不用重启不用重启参数。JVM 参数方面，生产建议 -XX:+HeapDumpOnOutOfMemoryError 配合 jstack 脚本化巡检。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// ① ThreadMXBean 死锁自检监控线程（配合钉钉告警）\npublic class DeadlockMonitor {\n    public void start() {\n        Thread t = new Thread(() -> {\n            while (!shutdown) {\n                ThreadMXBean bean = ManagementFactory.getThreadMXBean();\n                long[] dead = bean.findDeadlockedThreads();\n                if (dead != null) {\n                    ThreadInfo[] infos = bean.getThreadInfo(dead, true, true);\n                    StringBuilder sb = new StringBuilder(\"DEADLOCK DETECTED: \");\n                    for (ThreadInfo ti : infos) {\n                        sb.append(ti.getThreadName()).append(\" 持有:\")\n                          .append(Arrays.toString(ti.getLockedMonitors()))\n                          .append(\"; \");\n                    }\n                    alertService.urgent(sb.toString());   // 钉钉 + 归档\n                }\n                try { Thread.sleep(10_000); }\n                catch (InterruptedException e) {\n                    Thread.currentThread().interrupt(); return;\n                }\n            }\n        }, \"deadlock-monitor\");\n        t.setDaemon(true);\n        t.start();\n    }\n}\n\n// ② 排序加锁：跨玩家转账按 playerId 升序，破坏循环等待\npublic void transfer(Player a, Player b, long gold) {\n    long lo = Math.min(a.id, b.id);\n    long hi = Math.max(a.id, b.id);\n    synchronized (lockOf(lo)) {\n        synchronized (lockOf(hi)) {\n            a.gold -= gold;\n            b.gold += gold;\n        }\n    }\n}\n\n// ③ tryLock 超时：破坏占有且等待\nif (lockA.tryLock(1, TimeUnit.SECONDS)) {\n    try {\n        if (lockB.tryLock(1, TimeUnit.SECONDS)) {\n            try { /* 临界区 */ } finally { lockB.unlock(); }\n        }\n    } finally { lockA.unlock(); }\n}"
   },
   {
    "t": "h",
    "text": "三、CPU 飙高排查五步"
   },
   {
    "t": "p",
    "text": "CPU 飙高和死锁是两类完全不同的事故。死锁的线程是 WAITING 不耗 CPU，CPU 飙高的元凶往往是：业务死循环（while 条件漏更新）、频繁 GC（对象分配过快/泄漏）、锁自旋失控、正则回溯、CompletableFuture 循环自补任务。排查流程固定五步：top 看哪个 Java 进程吃 CPU → top -Hp PID 按线程看哪个 TID 飙高 → printf %x TID 把十进制转成十六进制 nid → jstack PID 按 nid 找到对应线程栈 → 读栈定位代码行。配合 jstat -gcutil 看 GC 占比区分『计算型飙升』还是『GC 型飙升』，配合 Arthas thread 按 CPU 占用排序直接列出热点线程。这五步在游戏服故障演练里应该练到闭眼能做。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\"><text x=\"20\" y=\"24\" font-size=\"13\" fill=\"var(--ink)\">CPU 飙高排查五步：top → 线程 → 十六进制 → jstack → 分析</text><rect x=\"20\" y=\"44\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"75\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">① top</text><text x=\"75\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">找高 CPU 的进程 PID</text><path d=\"M130 74 L170 74\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"150\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">定位</text><rect x=\"172\" y=\"44\" width=\"130\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"237\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">② top -Hp</text><text x=\"237\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按线程定位高 CPU TID</text><path d=\"M302 74 L342 74\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"322\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">线程</text><rect x=\"344\" y=\"44\" width=\"120\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"404\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">③ printf %x</text><text x=\"404\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TID 转十六进制 nid</text><path d=\"M464 74 L504 74\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"484\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">转换</text><rect x=\"506\" y=\"44\" width=\"114\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"563\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">④ jstack</text><text x=\"563\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">grep 匹配 nid</text><path d=\"M563 104 L563 140\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"579\" y=\"126\" font-size=\"12\" fill=\"var(--accent)\">对栈</text><rect x=\"120\" y=\"142\" width=\"400\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">⑤ 分析线程栈定位元凶</text><text x=\"320\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">死循环 / 频繁 GC / 锁自旋 / 正则回溯</text><text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">配 jstat -gcutil 看 GC 占比，Arthas thread 无侵入抓现场</text><text x=\"20\" y=\"246\" font-size=\"13\" fill=\"var(--accent)\">死锁排查三板斧：</text><text x=\"20\" y=\"268\" font-size=\"12\" fill=\"var(--muted)\">jstack 直接输出 Found one Java-level deadlock；ThreadMXBean.findDeadlockedThreads() 监控自检告警；</text><text x=\"20\" y=\"290\" font-size=\"12\" fill=\"var(--muted)\">Arthas thread -b 线上无侵入定位持锁线程；活锁用随机退避，饥饿看公平锁与优先级</text></svg>",
    "caption": "图：CPU 飙高五步排查与死锁三件套"
   },
   {
    "t": "h",
    "text": "四、活锁 / 饥饿 / 伪唤醒"
   },
   {
    "t": "p",
    "text": "死锁之外还有三个兄弟概念要能分辨。活锁：线程不阻塞但互相谦让，谁都没进展——典型是多个事务同时回滚重试互相踩脚，解法是随机退避 + 指数退避，让竞争错开。饥饿：锁永远轮不到某个线程——非公平锁下新线程不断插队，久等的线程可能被饿死；解法是公平锁（吞吐下降）或把持锁时间压短。伪唤醒：wait 条件成立被自发唤醒，JVM 允许这种无通知的唤醒，所以 wait 必须放 while 循环里复查条件。三个概念面试一问一个准，尤其要能说出『活锁线程是 RUNNABLE 状态且占 CPU』、『饥饿的线程永远等不到，但没有死锁环』。"
   },
   {
    "t": "h",
    "text": "五、上下文切换成本：为什么锁竞争贵"
   },
   {
    "t": "p",
    "text": "面试连环题喜欢追问『死锁和锁竞争到底贵在哪』。一次上下文切换的直接成本微秒级，真正的大头是切换的连锁反应：TLB 缓存失效（下次访存全走慢路径）、CPU 缓存暖失（冷数据重新载入）、调度器排队抖动。高并发系统减少上下文切换的四板斧：无锁化（CAS/Disruptor，用自旋替代挂起切换）、减小锁粒度与持锁时间（把临界区压到最小）、异步化（慢 IO 丢给专用池，别占业务线程）、合理线程数（线程数超过核数太多，切换反而变多）。游戏服的玩家串行模型，本质上就是用线程模型减少切换的工程化实践——把一个玩家的一切操作钉在一个线程里，锁和切换都消失了。"
   },
   {
    "t": "h",
    "text": "六、故障演练与监控指标"
   },
   {
    "t": "p",
    "text": "死锁和 CPU 事故有一个共同点：平时不演练，出事就是大事故。建议给游戏服做三类常态化演练：人为注入死锁（测试代码加一条故意成环的路径，验证监控能不能 10 秒内告警）、CPU 拉满演练（压测脚本模拟死循环热点，验证排查流程能不能 5 分钟内定位到代码行）、线程池打满演练（洪峰注入，验证拒绝策略和降级文案是否正确）。监控侧常盯四组指标：BLOCKED/WAITING 线程数（异常堆积就是锁问题前兆）、GC 耗时与频率（CPU 飙升第一嫌疑）、线程池队列水位与拒绝数（背压预警）、锁平均等待时间（JMX 可以看 ReentrantLock 的等待统计）。把『能发现问题』升级成『问题出现前就预警』，这是十年经验该有的层次。"
   },
   {
    "t": "h",
    "text": "七、一个游戏服真实案例"
   },
   {
    "t": "p",
    "text": "交易系统早期版本：玩家 A 卖装备给 B，实现里先锁 A 的背包再锁 B 的背包；另一条路径『GM 补发装备』先锁 B 再锁 A，两条路径交叉就成环。玩家量小时没暴露，跨服活动把交易和 GM 操作同时打满后死锁频发。修复分两步：第一步排序加锁——任何涉及两个玩家的操作按 playerId 升序拿锁；第二步根治——把交易请求投递到两个玩家绑定线程之一串行处理，彻底消灭双锁。这个案例的价值在于演示：能修好 bug 的是经验，能从架构上让 bug 不再出现的是设计能力。"
   },
   {
    "t": "pits",
    "items": [
     "只背四条件不背破法：面试必追问『你项目里怎么防死锁』，答不出排序加锁/超时/串行化就是零分",
     "死锁只看不自动发现：上线后必须配 ThreadMXBean 监控自检，靠玩家投诉发现死锁是事故",
     "CPU 排查卡在第二步：top -Hp 找到 TID 后忘了 printf %x 转十六进制，jstack 里永远 grep 不到",
     "活锁当死锁处理：加锁解决不了活锁，要随机退避；饥饿想用 lock 加锁解决也是方向错误",
     "wait 用 if 判条件：伪唤醒后带着失效条件继续执行，必须 while 复查"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：死锁四条件 + 破一即解（排序加锁破环/tryLock 破等待/串行化免锁）→ jstack/ThreadMXBean/Arthas 三件套 → CPU 飙高五步走（top→线程→hex→jstack→分析）→ 活锁要退避、饥饿要公平、伪唤醒要 while。架构上记住：玩家串行模型本身就是最好的死锁预防。"
   }
  ]
 }
]
};
