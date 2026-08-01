window.QB = window.QB || {};
window.QB["java-basic"] = {
  id: "java-basic",
  name: "Java 基础",
  icon: "☕",
  desc: "集合源码、并发容器、String、泛型、异常、IO/NIO、序列化、Java 8+ 与反射动态代理；重点结合游戏服协议对象集合缓存与导表工具反射生成代码的实战场景复习。",
  questions: [
    {
      id: "java-basic-01",
      level: 1,
      q: "HashMap 的底层数据结构是什么？put 一个 key 的完整流程是怎样的？",
      point: "考察对 HashMap 源码级结构（数组+链表+红黑树）与 put 全流程的理解深度，而非背概念。",
      approach: "先一句话给结构结论，再按「定位→判桶→插入/覆盖→树化→扩容」五步讲 put 流程，主动说出扰动函数和 (n-1)&hash 的原因。别把树化条件说错（8 且 64），结尾可自然引到并发安全话题。",
      a: "核心结论：JDK8 的 HashMap = 数组 + 链表 + 红黑树。\n1. 数组（table）默认初始容量 16，负载因子 0.75。\n2. put 流程：对 key 的 hashCode 做扰动（h = key.hashCode() ^ (h >>> 16)），再用 (n-1) & hash 定位桶位。\n3. 桶为空直接插入；不为空则遍历链表（或树），key 相同（equals）则覆盖 value，否则尾插。\n4. 链表长度达到 8 且数组长度 >= 64 时树化为红黑树；数组不足 64 则优先扩容。\n5. 元素数量超过 capacity * loadFactor 时扩容为 2 倍，重新分配桶位（JDK8 用高低位拆分，避免全部重新 hash）。\n为什么用 (n-1) & hash：容量是 2 的幂时等价于取模，但位运算更快，且扰动函数让高位参与运算，减少哈希冲突。",
      followups: [
        { q: "为什么链表转红黑树的阈值是 8 而不是 6 或 10？", a: "理想哈希下桶长度服从泊松分布，达 8 的概率约千万分之六，此时多半是 hashCode 被攻击或写得太烂，树化是极端情况的兜底；6 或 10 没有统计学依据。" },
        { q: "HashMap 为什么容量必须是 2 的幂？", a: "(n-1)&hash 等价取模且位运算更快；扩容时元素新位置只需看 hash 新增的高位，要么留原位要么移到 原位+oldCap，迁移高效无需重新取模。" },
        { q: "如果 key 没有重写 hashCode 和 equals 会发生什么？", a: "用 Object 默认实现：hashCode 与地址相关、equals 比引用。逻辑相等的对象落到不同桶，get/contains 找不到，HashSet 里出现重复元素。" }
      ],
      memory: "口诀：「16 桶、0.75 胀、8 变树、64 才化、6 退化」——初始16，0.75扩容，链表8且数组64才树化，树退化阈值为6。",
      tags: ["HashMap", "集合", "源码"]
    },
    {
      id: "java-basic-02",
      level: 1,
      q: "equals 和 hashCode 的约定是什么？只重写 equals 不重写 hashCode 会出什么问题？",
      point: "考察 equals 与 hashCode 契约关系，及违反契约在散列容器中引发的实际故障。",
      approach: "先给契约三句话结论，再推演只重写 equals 导致「逻辑相等却分桶」的故障链，最后结合游戏 key 场景举例。注意区分硬性要求与性能建议，别把方向背反——是 equals 相等推出 hash 相等，不是反过来。",
      a: "核心结论：equals 相等 ⇒ hashCode 必须相等；hashCode 相等不保证 equals 相等。\n三大约定：\n1. equals 相等则 hashCode 相等（硬性要求）。\n2. hashCode 相等，equals 不一定相等（哈希冲突允许存在）。\n3. equals 不相等，hashCode 最好不同（提升散列性能，非强制）。\n只重写 equals 的后果：把对象放进 HashMap/HashSet 时，两个「逻辑相等」的对象 hashCode 不同，会被分到不同桶，导致 contains/get 找不到、Set 里出现重复元素。\n实际场景：游戏里的玩家 ID 包装类、道具唯一 ID 作为 Map key 时，必须同时重写两个方法；否则背包查重、玩家缓存命中会出隐蔽 bug。",
      followups: [
        { q: "Object 默认的 equals 和 hashCode 是怎么实现的？", a: "equals 就是 ==（比引用地址）；hashCode 是 native 方法，通常由对象地址相关信息生成，不同对象一般不同值。" },
        { q: "用 Lombok 的 @Data 会不会有坑（比如继承场景）？", a: "@Data 默认 callSuper=false，继承时 equals/hashCode 只算子类字段，父子对象比较不对称、与父类混入同一容器会错乱；需显式 @EqualsAndHashCode(callSuper=true)。" }
      ],
      memory: "口诀：「equals 是结婚证，hashCode 是门牌号」——结了婚（相等）必须住同一门牌；住同一门牌不一定是夫妻（冲突）。",
      tags: ["equals", "hashCode", "基础"]
    },
    {
      id: "java-basic-03",
      level: 1,
      q: "String 为什么设计为不可变？这种设计带来了哪些好处？",
      point: "考察对不可变设计动机的理解：线程安全、常量池、hash 缓存、安全性四大收益。",
      approach: "先答「怎么做到不可变」（final 数组+不暴露+修改返回新对象），再分四点讲收益且每点带一个使用场景，最后主动提代价（频繁拼接开销→StringBuilder）体现权衡思维，不要只背好处。",
      a: "核心结论：String 内部 char[]（JDK9 后为 byte[]）被 final 修饰且不对外暴露，任何「修改」都返回新对象。\n不可变的好处：\n1. 线程安全：天然不可变，多线程共享无需同步——游戏服里玩家名字、协议字符串被多线程引用时零成本共享。\n2. 支持字符串常量池：字面量可复用，省内存。\n3. hashCode 可缓存：String 缓存了 hash，作为 HashMap key 时不用每次重算，这也是 HashMap 偏爱 String key 的原因。\n4. 安全性：类名、URL、密码、文件路径作为参数传入后不会被恶意修改（如反射加载类、Socket 连接地址）。\n代价：频繁拼接产生大量临时对象，所以循环里要用 StringBuilder。",
      followups: [
        { q: "String、StringBuilder、StringBuffer 的区别？", a: "String 不可变、天然线程安全；StringBuilder 可变、非线程安全、最快，单线程首选；StringBuffer 方法级 synchronized、线程安全但慢，多线程共享拼接才用。" },
        { q: "JDK9 把 char[] 改成 byte[] 是为了什么（Compact Strings）？", a: "纯 Latin-1 字符串每字符只占 1 字节，byte[] 加 coder 标志区分编码，字符串内存占用近减半，显著降低堆压力。" }
      ],
      memory: "类比：String 像「石刻」，刻好就不能改，只能重刻一块新的；所以大家都敢围着它看（线程安全），看一眼就能记住它的样子（hash 缓存）。",
      tags: ["String", "不可变", "基础"]
    },
    {
      id: "java-basic-04",
      level: 1,
      q: "ArrayList 的扩容机制是怎样的？为什么随机访问快、中间插入慢？在游戏开发中你会在什么场景避免用 ArrayList？",
      point: "考察扩容机制、复杂度分析与按场景选型能力，重点在游戏场景的取舍判断。",
      approach: "先给底层数组+1.5 倍扩容结论，再解释随机访问/中间插入的复杂度根源，第三部分必须落到游戏场景：预分配容量、高频插入换结构、fail-fast 注意。只背源码不谈应用会丢分。",
      a: "核心结论：ArrayList 底层是 Object 数组，默认初始容量 10，扩容为原来的 1.5 倍（oldCap + oldCap>>1），扩容时 Arrays.copyOf 整体拷贝。\n1. 随机访问 O(1)：数组按下标直接寻址。\n2. 中间插入/删除 O(n)：要 System.arraycopy 移动后续元素。\n3. 尾部插入均摊 O(1)，但触发扩容那次是 O(n)。\n游戏场景经验：\n1. 大量已知数量的元素（如全服排行榜 1000 条）应 new ArrayList<>(size) 预分配，避免多次扩容拷贝。\n2. 频繁头插/中间插的场景（如按时间排序的滚动日志队列）改用 LinkedList 或环形缓冲；我们游戏服用 Disruptor 的 RingBuffer 解决的就是这类高频写入问题。\n3. 遍历中删除要用迭代器的 remove()，否则抛 ConcurrentModificationException（fail-fast）。",
      followups: [
        { q: "fail-fast 机制（modCount）是怎么实现的？它是线程安全的保证吗？", a: "集合维护 modCount，迭代器记录 expectedModCount，next() 时校验不一致抛 CME。没有任何同步/volatile 语义，不是线程安全保证，只是尽力而为的 bug 探测器。" },
        { q: "ArrayList 和 Vector、CopyOnWriteArrayList 的区别？", a: "Vector 方法级 synchronized，粒度粗已基本弃用；CopyOnWrite 写时整体复制新数组、读完全无锁，适合读极多写极少（如监听器列表），写多则内存翻倍不可接受。" }
      ],
      memory: "口诀：「10 起步，1.5 翻，搬家一次全拷贝」——像租仓库，货多了换大 1.5 倍的新仓库，所有货搬一遍。",
      tags: ["ArrayList", "集合", "扩容"]
    },
    {
      id: "java-basic-05",
      level: 1,
      q: "Java 的异常体系是怎样的？checked 异常和 unchecked 异常有什么区别？你在游戏服务器里怎么处理异常？",
      point: "考察异常体系分类认知与服务器端异常治理的工程经验，重实践轻背书。",
      approach: "先用 Throwable→Error/Exception→checked/unchecked 树状给分类结论，再讲三类的语义定位，最后重点答游戏服三道防线：网络层兜底、业务错误码转化、异步不吞异常。面试官真正想听的是工程处理经验。",
      a: "核心结论：Throwable 分 Error 和 Exception；Exception 分 checked（受检）和 unchecked（RuntimeException）。\n1. Error：JVM 严重问题，如 OOM、StackOverflowError，程序无法恢复，一般不 catch。\n2. checked：编译期强制处理（try-catch 或 throws），如 IOException、SQLException，代表「可预期的外部环境问题」。\n3. unchecked：运行时异常，如 NPE、IndexOutOfBounds、ClassCastException，代表「代码 bug」，编译器不强制。\n游戏服实践：\n1. 网络层（Netty pipeline）必须有全局 exceptionCaught 兜底，一个协议处理异常不能搞挂整个连接或线程。\n2. 业务层自定义业务异常（如 ErrorCodeException 带错误码），统一拦截后转成协议错误码推给客户端，而不是直接断线。\n3. 绝不吞异常（catch 后什么都不做），异步任务（线程池/Disruptor handler）里的异常必须打日志，否则线上排查无迹可循。",
      followups: [
        { q: "try-with-resources 的原理是什么？", a: "编译器语法糖，自动生成 finally 调 close()；资源须实现 AutoCloseable，多资源按声明逆序关闭；close 抛出的异常会被抑制进主异常的 suppressed 列表不丢失。" },
        { q: "为什么不要在 finally 里 return？", a: "finally 的 return 会覆盖 try/catch 里的返回值，甚至吞掉未处理的异常，方法实际结果与预期不符且极难排查，属编码禁忌。" }
      ],
      memory: "口诀：「Error 是绝症，checked 是天气预报（必须带伞），unchecked 是自己摔倒（怪代码）」。",
      tags: ["异常", "Throwable", "工程实践"]
    },
    {
      id: "java-basic-06",
      level: 1,
      q: "什么是函数式接口？Lambda 表达式的本质是什么？",
      point: "考察 Lambda 本质（invokedynamic 而非匿名类）与函数式接口的判定标准。",
      approach: "先给定义（单抽象方法接口+@FunctionalInterface），再讲本质区别：不生成 class 文件、靠 invokedynamic 运行时生成实现。补充 effectively final 的原因，最后用协议 handler 注册举例。切忌把 Lambda 说成匿名内部类的语法糖。",
      a: "核心结论：函数式接口 = 只有一个抽象方法的接口（@FunctionalInterface 标注，编译器校验）；Lambda 本质是它的匿名实现。\n1. 常用函数式接口：Function<T,R>、Consumer<T>、Supplier<T>、Predicate<T>、Runnable、Comparator。\n2. Lambda 不像匿名内部类那样生成新的 class 文件，而是通过 invokedynamic 指令 + LambdaMetafactory 在运行时生成实现类，性能更好。\n3. Lambda 捕获的外部局部变量必须是 effectively final（事实不可变），因为变量是值拷贝进 Lambda 的，若可变会出现并发语义混乱。\n游戏项目例子：协议处理器注册 Map<Integer, Consumer<MsgContext>>，用 Lambda 一行注册一个协议 handler，比每个协议写一个匿名类清爽得多。",
      followups: [
        { q: "Lambda 和匿名内部类的 this 指向有什么区别？", a: "匿名内部类的 this 指匿名类自身实例；Lambda 不引入新作用域，this 指向外围类实例——在 Lambda 里用 this 取到的是外部对象。" },
        { q: "方法引用有哪几种形式？", a: "四种：静态方法引用（String::valueOf）、特定对象的实例方法（list::add）、任意对象的实例方法（String::length）、构造器引用（ArrayList::new）。" }
      ],
      memory: "口诀：「一个抽象方法是门票，invokedynamic 是入场方式」——Lambda 不是语法糖生成类，而是运行时才「发证」。",
      tags: ["Lambda", "Java8", "函数式接口"]
    },
    {
      id: "java-basic-07",
      level: 1,
      q: "HashMap 是线程安全的吗？多线程并发 put 会发生什么？你们游戏服里玩家数据缓存用的是什么？",
      point: "考察并发故障机理与「用线程模型消灭竞争」的架构思维，后者是核心加分点。",
      approach: "先给不安全结论，分 JDK7（头插成环死循环）/JDK8（丢数据、size 不准）讲清机理，再给方案：ConcurrentHashMap 是及格线，重点讲 Disruptor 玩家串行化从架构上消灭竞争的思路，体现实战高度而非容器背诵。",
      a: "核心结论：HashMap 线程不安全，并发 put 会导致数据覆盖、size 不准，JDK7 扩容时甚至可能形成环形链表导致 CPU 100% 死循环。\n1. JDK7：头插法 + 并发扩容转移节点，两个线程可能把链表互指成环，后续 get 触发死循环。\n2. JDK8：改尾插法解决了成环，但并发 put 仍会丢数据（两个线程算到同一空桶同时写，后写覆盖先写）、size++ 非原子导致计数偏小。\n游戏服实践：玩家在线缓存、房间表这类高频读写 Map，我们用的是 ConcurrentHashMap（读多写少场景也评估过 Guava Cache/Caffeine 做带过期策略的本地缓存）；会话属性这类单线程归属的数据才用普通 HashMap——因为我们用 Disruptor 把同一玩家的逻辑固定到单线程处理（玩家维度串行化），从架构上规避了并发。这是游戏服比 Web 服务更常用的思路：不是每把锁都靠容器，而是靠线程模型消灭竞争。",
      followups: [
        { q: "ConcurrentHashMap 是怎么保证线程安全的？", a: "JDK8 用 CAS + synchronized 锁桶头节点：空桶 CAS 插入，非空只锁单桶；读无锁，靠 volatile 保证可见性；锁粒度细到桶，并发度远高于分段锁。" },
        { q: "JDK7 环形链表的详细形成过程能画一下吗？", a: "头插法+扩容转移：线程 A 转移到一半被挂起，线程 B 完成转移后引用已反转，A 恢复后继续头插使两节点互指成环；之后 get 走到环上即死循环，CPU 100%。" }
      ],
      memory: "类比：HashMap 像「单人更衣室」，两个人同时进就会互相盖住柜子（丢数据），JDK7 还会把门把手打成死结（环形链表死循环）。",
      tags: ["HashMap", "线程安全", "游戏服"]
    },
    {
      id: "java-basic-08",
      level: 1,
      q: "== 和 equals 的区别？String a = \"abc\" 和 String b = new String(\"abc\") 用 == 比较结果是什么？涉及哪些内存区域？",
      point: "考察引用比较与内容比较的语义差异，及字符串常量池与堆的内存布局。",
      approach: "先定义 == 与 equals 的语义，再画出 \"abc\" 与 new String(\"abc\") 的内存图（常量池 vs 堆对象），给出 false 结论并讲 intern 的作用。顺带提「创建几个对象」这个高频追问，显示细节掌握。",
      a: "核心结论：== 比较的是引用地址（基本类型比值），equals 默认也是比地址，但 String 重写了 equals 比内容。\n\"abc\" == new String(\"abc\") 结果为 false：\n1. \"abc\" 字面量在字符串常量池（JDK7 起常量池移到了堆）。\n2. new String(\"abc\") 在堆里新建对象，引用指向堆对象，与常量池不是同一地址。\n3. 调用 intern() 会把堆对象的引用/值放入常量池并返回常量池引用，此时 intern() 返回值 == \"abc\" 为 true。\n注意：new String(\"abc\") 实际创建 1~2 个对象（常量池没有 \"abc\" 时先建常量池对象，再在堆里建一个）。",
      followups: [
        { q: "字符串常量池在 JDK6/7/8 中的位置变化？", a: "JDK6 在永久代方法区；JDK7 移到堆中；JDK8 永久代被元空间取代，常量池仍在堆——目的是避免 PermGen OOM 并便于 GC 回收。" },
        { q: "String s = \"a\" + \"b\" 和 s = \"a\" + variable 的编译期处理有什么不同？", a: "纯字面量拼接编译期常量折叠为 \"ab\"（常量池同一对象）；含变量的拼接编译成 StringBuilder.append（JDK9 起 invokedynamic），结果是堆里的新对象。" }
      ],
      memory: "口诀：「== 比身份证，equals 比脸」——new 出来的永远换不了身份证，但脸可以一样。",
      tags: ["String", "equals", "内存"]
    },
    {
      id: "java-basic-09",
      level: 1,
      q: "Java 是值传递还是引用传递？为什么改了方法里的形参，实参的字段却变了？",
      point: "考察对「Java 只有值传递」的精确理解——对象传的是引用的副本。",
      approach: "先旗帜鲜明给结论「只有值传递」，再用「引用副本」解释两种现象：重新赋值不影响实参、改字段影响实参。主动提 swap 陷阱，最后落到跨线程传递对象的防御性拷贝实践，体现工程意识。",
      a: "核心结论：Java 只有值传递。基本类型传值副本；对象类型传的是「引用的副本」。\n1. 方法里给形参重新赋值（p = new Player()），不影响实参——副本换了指向而已。\n2. 方法里通过形参修改对象字段（p.setLevel(99)），实参指向的同一个堆对象被改了，所以调用方可见。\n面试高频陷阱：swap(Integer a, Integer b) 无效，因为交换的是引用副本；且 Integer 有 -128~127 缓存，更添迷惑性。\n游戏代码启示：协议对象在多个 handler 间传递时要明确「共享可变」还是「拷贝防御」，我们处理跨线程传递（如逻辑线程 → IO 线程）时，要么保证对象只读，要么拷贝，避免一条线程在改、另一条在读。",
      followups: [
        { q: "Integer 缓存池范围是多少？能改吗？", a: "默认 -128~127（IntegerCache 静态数组）；上限可用 -XX:AutoBoxCacheMax 调大，下限 -128 是规范固定。Byte/Short/Character/Long 同范围缓存，Boolean 缓存 true/false。" },
        { q: "为什么 String 作为方法参数被「修改」后原变量不变？", a: "传的仍是引用副本，方法内 s = s + \"x\" 只是让副本指向新对象，原引用指向未变；且 String 本身不可变，任何「修改」都产生新对象。" }
      ],
      memory: "口诀：「遥控器是复制的」——形参是实参遥控器的复制品：按按钮能控制同一台电视（改字段），但把遥控器指向另一台电视（重新赋值）影响不了原来那个遥控器。",
      tags: ["值传递", "基础", "内存"]
    },
    {
      id: "java-basic-10",
      level: 2,
      q: "ConcurrentHashMap 在 JDK7 和 JDK8 的实现有什么本质区别？JDK8 是怎么做到高并发读写的？",
      point: "考察 CHM 两代实现的锁粒度演进，及无锁读、分段计数等核心设计。",
      approach: "先一句对比结论（分段锁→CAS+桶锁），再分述 JDK7 Segment 与 JDK8 三要点（空桶 CAS、锁桶头、volatile 读），补 size 的分段计数，结尾用在线玩家表的实践数据收尾。结构清晰比细节堆砌更重要。",
      a: "核心结论：JDK7 用 Segment 分段锁（继承 ReentrantLock），JDK8 用 CAS + synchronized 锁单个桶头节点，锁粒度从「段」细化到「桶」。\nJDK7：HashEntry 数组分 16 个 Segment，每个 Segment 独立加锁，并发度 = Segment 数，最多 16 线程同时写。\nJDK8：\n1. 结构同 HashMap：数组 + 链表 + 红黑树。\n2. 桶为空：CAS 插入，无锁。\n3. 桶非空：synchronized 锁桶头节点再插入，只锁一个桶，并发度 = 桶数量。\n4. 读完全无锁：table 和 Node 的 value/next 用 volatile 修饰，保证可见性。\n5. size() 用 baseCount + CounterCell 分段计数（类似 LongAdder），避免全局竞争。\n游戏服关联：在线玩家表 ConcurrentHashMap<Long, Player>，读操作（广播、查找）完全无锁，写操作只锁单个桶，单服万级在线无压力。",
      followups: [
        { q: "为什么 JDK8 不用 ReentrantLock 而改用 synchronized？", a: "JDK8 起 synchronized 有偏向锁/轻量级锁优化，低竞争下开销接近 CAS；锁粒度已到单桶，不需要 ReentrantLock 的高级特性，且省掉锁对象内存。" },
        { q: "CounterCell 分段计数的思想和 LongAdder 有什么共通之处？", a: "同一思想：竞争时把计数分散到多个 Cell 并行累加，取值时求和——用空间换并发，避免多线程 CAS 同一变量的热点冲突。" },
        { q: "ConcurrentHashMap 的 get 为什么不加锁也能读到最新值？", a: "table 数组引用、Node 的 val 和 next 均用 volatile 修饰，写入对读立即可见；读路径无锁，写侧由 CAS 或桶锁保证结构安全。" }
      ],
      memory: "口诀：「7 代锁一条街，8 代锁一间房」——JDK7 锁整个 Segment（街），JDK8 只锁桶头（房间），空房直接 CAS 进，连锁都不用。",
      tags: ["ConcurrentHashMap", "并发", "源码"]
    },
    {
      id: "java-basic-11",
      level: 2,
      q: "HashMap 树化的条件为什么是「链表 >= 8 且数组 >= 64」？泊松分布在这里起了什么作用？",
      point: "考察对树化阈值背后统计学依据的理解，区分「会背数字」与「懂设计意图」。",
      approach: "先给泊松分布结论（长度 8 概率约千万分之六），推出设计意图：树化是防 hashCode 攻击的兜底而非正常路径；再解释 64 门槛（小数组扩容更划算）与 8/6 缓冲带。别只背阈值数字，要讲出「为什么」。",
      a: "核心结论：阈值 8 来自泊松分布统计——理想哈希下链表长度达到 8 的概率约 0.00000006（千万分之六），此时大概率是 hashCode 被攻击或实现太烂，用树兜底。\n1. 源码注释说明：随机 hashCode 下，桶中节点数服从参数约 0.5 的泊松分布，长度 8 的概率约为 6 亿分之一级别的极小值。\n2. 为什么数组 < 64 不树化而扩容：小数组下链表长主要是「桶太少」导致的拥挤，扩容后桶位散开更划算；树节点内存是普通节点两倍，小树不划算。\n3. 树退化阈值 6：8 和 6 之间留缓冲带，避免链表长度在阈值附近反复树化/退化抖动。\n关联记忆：这也解释了为什么自定义 key 的 hashCode 质量很重要——游戏协议对象如果乱写 hashCode，HashMap 会退化成树甚至链表的性能。",
      followups: [
        { q: "哈希冲突攻击（Hash DoS）是什么？Tomcat 当年怎么中招的？", a: "攻击者构造大量同 hash 的 key 使哈希表退化为链表，查询变 O(n) 打满 CPU。Tomcat 曾因 POST 参数存哈希表可被构造冲突 DoS，后来限制单请求参数数量。" },
        { q: "红黑树相比 AVL 树的优势是什么？为什么选红黑树？", a: "AVL 严格平衡、查询略快，但插入删除旋转频繁；红黑树近似平衡、写操作旋转少，综合性能更好，工程界（Java、Linux CFS）普遍选红黑树。" }
      ],
      memory: "口诀：「千万分之六才到 8」——走到 8 说明不是运气差，是 hashCode 有内鬼；树化是抓内鬼的兜底方案。",
      tags: ["HashMap", "红黑树", "源码"]
    },
    {
      id: "java-basic-12",
      level: 2,
      q: "什么是泛型擦除？泛型信息在运行时还存在吗？List<String> 和 List<Integer> 在运行时是不是同一个类型？",
      point: "考察擦除机制本质、后果，及 Signature 属性保留泛型签名这一进阶知识点。",
      approach: "先给「编译期语法糖」结论和擦除规则，再列三大后果（不能 new T、重载冲突、桥接方法），进阶部分讲 Signature 保留签名支撑 Spring/MyBatis，最后 PECS 收尾。层次：是什么→后果→没全丢→怎么用。",
      a: "核心结论：Java 泛型是编译期语法糖，编译后泛型参数被擦除为边界类型（无界擦成 Object，<T extends Number> 擦成 Number），运行时 List<String> 和 List<Integer> 都是同一个 ArrayList.class。\n擦除带来的后果：\n1. 不能 new T()、不能 new T[]、不能 instanceof List<String>（只能 instanceof List<?>）。\n2. 重载冲突：foo(List<String>) 和 foo(List<Integer>) 编译报错——擦除后签名相同。\n3. 编译器自动生成桥接方法（bridge method）保证多态正确性。\n泛型信息并非全丢：类、方法、字段的泛型签名会保留在 Class 文件的 Signature 属性里，可通过反射 getGenericParameterTypes 拿到——这正是 Spring 注入泛型 Bean、MyBatis Mapper 接口泛型解析的基础。\n通配符：<? extends T> 生产者（只读）、<? super T> 消费者（只写），即 PECS 原则。",
      followups: [
        { q: "什么是桥接方法？为什么会有它？", a: "子类实现泛型接口后，编译器自动生成擦除签名（参数 Object）的方法转发到真实方法，保证多态调用正确；可用 method.isBridge() 识别。" },
        { q: "Jackson/Gson 反序列化 List<Player> 怎么绕过擦除拿到元素类型（TypeReference）？", a: "利用匿名子类 new TypeReference<List<Player>>(){} 把泛型实参保留进父类 Signature，反射读 getGenericSuperclass 拿到 ParameterizedType，从而解析元素类型。" },
        { q: "PECS 原则用游戏背包的例子说明一下。", a: "背包存入是消费者：List<? super Item> bag 可以 add Item 及子类；产出物品是生产者：List<? extends Item> loot 只能取出当 Item 用，不能往里放（除了 null）。" }
      ],
      memory: "口诀：「编译期化妆，运行时卸妆」——泛型只在编译前有效，.class 文件里素颜（Object）；但签名里留了「卸妆前的照片」（Signature），反射能看。",
      tags: ["泛型", "类型擦除", "Java 进阶"]
    },
    {
      id: "java-basic-13",
      level: 2,
      q: "BIO、NIO、AIO 的区别是什么？NIO 的三大核心组件是什么？你们游戏服务器为什么选择 Netty 而不是自己写 NIO？",
      point: "考察 IO 模型演进认知与「为什么选 Netty」的技术选型论证能力。",
      approach: "先三句话对比 BIO/NIO/AIO，再答 NIO 三组件各自职责，重点在第三问：epoll 空轮询 bug、ByteBuf/编解码/线程模型屏蔽的复杂度、海量长连接的场景匹配。结合自家主从 Reactor+Disruptor 骨架讲最有说服力。",
      a: "核心结论：BIO 一连接一线程阻塞等待；NIO 单线程通过 Selector 轮询多路复用；AIO 由 OS 完成后回调（Linux 下本质是 epoll 封装，不成熟）。\nNIO 三大组件：\n1. Channel：双向通道，可读可写（SocketChannel、ServerSocketChannel）。\n2. Buffer：数据容器，读写都走 Buffer，核心属性 position/limit/capacity，flip() 切换读写模式。\n3. Selector：一个线程注册监听多个 Channel 的事件（accept/read/write），事件就绪才处理。\n为什么用 Netty：\n1. JDK NIO 有 epoll 空轮询 bug（Selector 无事件也返回，CPU 100%），Netty 用重建 Selector 规避。\n2. Netty 屏蔽了 ByteBuf 管理（池化、零拷贝）、粘包拆包（解码器）、线程模型（Reactor 主从），自己写要踩无数坑。\n3. 游戏服场景：登录服/游戏服长连接动辄几千上万并发，BIO 一连接一线程根本撑不住；Netty 主从 Reactor 模型下 IO 线程处理读写，业务派发给逻辑线程（我们接 Disruptor），IO 与计算解耦，这是我们项目的基本骨架。",
      followups: [
        { q: "epoll 和 select/poll 的区别？epoll 空轮询 bug 是什么？", a: "select/poll 每次调用全量拷贝 fd 集合并 O(n) 轮询；epoll 内核维护就绪链表 O(1) 返回。空轮询 bug：连接异常关闭时 JDK select 立即返回空事件，死循环占满 CPU。" },
        { q: "Netty 的主从 Reactor 线程模型讲一下？", a: "bossGroup 少量线程只处理 accept 接入，workerGroup 多线程处理已建连的读写事件；连接管理与 IO 处理分离，天然匹配游戏服海量长连接。" },
        { q: "粘包/拆包怎么解决？你们协议用什么编解码？", a: "TCP 流无消息边界，方案有定长、分隔符、长度字段（最常用）。游戏协议用 LengthFieldBasedFrameDecoder 按长度头切包，body 走自定义二进制或 Protobuf。" }
      ],
      memory: "类比：BIO 是「一个服务员守一桌客人」；NIO 是「一个服务员盯所有桌的呼叫铃（Selector），铃响才过去」；Netty 是「请了个金牌大堂经理，连铃坏了（epoll bug）都会自己修」。",
      tags: ["NIO", "Netty", "游戏服", "网络编程"]
    },
    {
      id: "java-basic-14",
      level: 2,
      q: "Java 有哪些常见的序列化方式？游戏协议对象为什么一般不用 Java 原生序列化？你们的协议生成工具是怎么做的？",
      point: "考察序列化方案横向对比与游戏协议设计的工程决策：体积、兼容、跨语言。",
      approach: "先罗列主流方案，再列原生序列化四宗罪说明为何弃用，核心部分讲自家协议生成工具：IDL/Excel 定义→生成双端类→字段编号二进制编码，主动对标 Protobuf 显示视野，最后用 Kryo 内部缓存场景收尾。",
      a: "核心结论：常见方式 = Java 原生（Serializable）、JSON（Jackson/Fastjson）、二进制框架（Protobuf/Kryo/Hessian/MessagePack）。\nJava 原生序列化的问题：\n1. 性能差、体积大：带类元数据、继承体系描述，字节数远超 Protobuf。\n2. 有安全漏洞史：反序列化可触发任意代码执行（readObject 链），攻击面大。\n3. serialVersionUID 不一致直接抛 InvalidClassException，协议演进不友好。\n4. 跨语言不支持，客户端（C++/TS）没法用。\n游戏项目实践：我们做了协议生成工具——用 IDL/Excel 定义协议结构，通过反射 + 模板引擎生成 Java/C# 双端协议类，序列化走自定义二进制（字段编号 + 变长编码，思路类似 Protobuf），优点：\n1. 体积小（省带宽，移动网络下关键）。\n2. 字段编号前后兼容，加字段不影响老版本客户端。\n3. 生成工具保证客户端/服务器协议永不失配，策划改表即出协议。\nKryo 常用于服务器内部（如 Redis 缓存玩家数据的序列化），比原生快约 10 倍。",
      followups: [
        { q: "serialVersionUID 的作用是什么？不显式声明会怎样？", a: "版本校验标识，反序列化时类与流中 UID 不一致抛 InvalidClassException。不显式声明则按类结构自动计算，字段一改 UID 就变，兼容尽失——必须显式固定。" },
        { q: "Protobuf 为什么又小又快（varint、tag 编码）？", a: "varint 变长编码使小整数只占 1 字节；tag=字段号<<3|类型，只存编号不存字段名；无类元数据，故体积小、解析快。" },
        { q: "transient 关键字和自定义 writeObject/readObject 有什么用？", a: "transient 字段不参与序列化（敏感或可推导字段）；自定义 writeObject/readObject 可控制序列化逻辑，做字段兼容迁移、加密或只序列化必要状态。" }
      ],
      memory: "口诀：「原生序列化三宗罪：胖、慢、有后门」——体积胖、性能慢、反序列化漏洞像后门；游戏协议要「瘦快稳」，所以自己造轮子或上 Protobuf。",
      tags: ["序列化", "Protobuf", "游戏协议"]
    },
    {
      id: "java-basic-15",
      level: 2,
      q: "Stream API 的中间操作和终端操作有什么区别？什么是惰性求值？给一个你在游戏业务里用 Stream 的真实例子。",
      point: "考察中间/终端操作语义、惰性求值机制与真实业务中的应用判断力。",
      approach: "先给两类操作的定义和「终端才触发」结论，讲操作融合与短路，再给公会战发奖的真实例子，最后主动提两个坑：流里做 IO、Stream 只能消费一次。例子要具体，坑要自己先说出来。",
      a: "核心结论：中间操作（filter/map/sorted）返回新 Stream、惰性不执行；终端操作（collect/forEach/reduce/count）触发整个流水线执行。\n1. 惰性求值：中间操作只记录操作步骤，遇到终端操作才一次性遍历执行，多个中间操作会融合成一次遍历（不是 filter 一遍再 map 一遍）。\n2. 短路操作（findFirst、anyMatch、limit）可提前结束，不必处理全部元素。\n3. Stream 只能用一次，复用抛 IllegalStateException。\n游戏业务例子：公会战结算时从玩家列表筛选在线且战力达标的玩家发奖励：\nplayers.stream().filter(p -> p.isOnline()).filter(p -> p.getPower() >= minPower).forEach(p -> mailService.sendReward(p, reward));\n注意事项：\n1. Stream 里做耗时 IO（如上面的发邮件如果同步写库）会拖慢流水线，正式做法是 collect 出名单再异步批处理。\n2. 复杂逻辑别硬塞 Lambda，可读性比炫技重要。",
      followups: [
        { q: "Stream 的 reduce 三个参数版本怎么理解？", a: "identity 是每个分片的初始值，accumulator 在分片内累积，combiner 在并行时合并各分片结果；串行只用前两个，并行时 combiner 必须满足结合律。" },
        { q: "Collectors.groupingBy 的下游收集器（downstream）怎么用？比如按职业分组统计平均战力。", a: "groupingBy(Player::getJob, Collectors.averagingInt(Player::getPower))——第一参数是分组键，下游收集器对每组做聚合，还可嵌套 counting、summing、再分组。" }
      ],
      memory: "口诀：「中间操作是点菜，终端操作是喊上菜」——只点菜厨房不动手，喊一声上菜，所有菜按最优流程一锅出（操作融合，一次遍历）。",
      tags: ["Stream", "Java8", "惰性求值"]
    },
    {
      id: "java-basic-16",
      level: 2,
      q: "Optional 的正确用法是什么？为什么说 get() 滥用和 ifPresent 之外把它当字段用都是反模式？",
      point: "考察 Optional 设计意图与反模式辨析，重点在「会用」与「不乱用」的边界。",
      approach: "先给定位（返回值可空的显式声明），再讲正确消费姿势，然后列四大反模式（裸 get、isPresent+get、字段用、参数用）并给替代写法，最后用 orElse vs orElseGet 差异和缓存回源例子收尾。",
      a: "核心结论：Optional 的设计初衷是「方法返回值可能为空」的显式声明，提醒调用方处理空值，而不是消灭一切 null。\n正确用法：\n1. 返回 Optional：public Optional<Player> findPlayer(long id)。\n2. 消费用 orElse/orElseGet/orElseThrow/map/ifPresent 链式处理。\n反模式：\n1. opt.get() 不做检查 —— 和直接 null 一样会炸（NoSuchElementException），甚至更隐晦。\n2. if (opt.isPresent()) { opt.get(); } —— 脱了裤子放屁，等于手写 null 检查，应该用 orElse 或 ifPresent。\n3. 实体类字段用 Optional —— 增加内存开销、序列化不友好（Serializable 支持差），字段保持普通类型即可。\n4. 方法参数用 Optional —— 参数校验应该直接 Objects.requireNonNull。\norElse vs orElseGet：orElse 的参数是无条件立即求值的，orElseGet 传 Supplier 惰性求值——默认值构建昂贵时（如查库）必须用 orElseGet。\n游戏例子：查离线玩家缓存 miss 时返回 Optional.empty()，调用方 orElseGet(() -> loadFromDb(id)) 兜底回源。",
      followups: [
        { q: "orElse 和 orElseGet 的区别？写一段能体现差异的代码。", a: "orElse 的参数无条件立即求值，orElseGet 传 Supplier 仅在空时执行。opt.orElse(createDefault()) 即使非空也会 new 对象；默认值昂贵（查库/新建）时必须 orElseGet。" },
        { q: "Optional 为什么不适合做实体类字段（序列化、内存角度）？", a: "Optional 未实现 Serializable，主流序列化框架支持差；每个字段多包一层对象增加内存与 GC 压力；且违背设计初衷——字段保持普通类型+判空即可。" }
      ],
      memory: "口诀：「Optional 是快递柜短信」——告诉你「可能有件」，要用取件码（orElse 系列）正规取；直接撬柜（get()）会报警。",
      tags: ["Optional", "Java8", "编码规范"]
    },
    {
      id: "java-basic-17",
      level: 2,
      q: "反射的原理和使用场景是什么？性能开销在哪里？你的导表工具是怎么用反射生成代码的？",
      point: "考察反射原理、性能开销认知与「用生成代码消除运行期反射」的优化经验。",
      approach: "先给定义和三种入口，列核心 API，性能部分讲慢在哪（装箱、访问检查）与缓解手段（缓存句柄、setAccessible），重点讲导表工具从运行期反射到生成源码的演进——优化叙事远比罗列 API 值钱。",
      a: "核心结论：反射 = 运行时动态获取类信息（Class 对象）并操作其字段/方法/构造器的能力，入口是 Class.forName / obj.getClass / Xxx.class。\n核心 API：getDeclaredField/setAccessible、Method.invoke、Constructor.newInstance。\n性能开销：\n1. Method.invoke 比直接调用慢一个数量级：参数装箱拆箱、数组封装、访问检查。\n2. JIT 优化受限（早期版本），JDK 对反射有 inflation 机制（调用次数超阈值后生成字节码替代 native 调用）缓解。\n3. 缓解手段：缓存 Field/Method 对象（查找是开销大头）、setAccessible(true) 跳过检查、或干脆用反射在启动期生成字节码/源代码，运行期零反射。\n导表工具实践：策划用 Excel 配表 → 工具读表头 → 按表结构生成 Java 实体类（字段名/类型来自列定义）→ 启动时用反射把 Excel 行数据填充到实体实例存入 Map<Integer, XxxConfig>。后期优化：运行期反射填充改成直接生成「new XxxConfig(a,b,c)」的 Java 源码再编译，启动更快、类型错误编译期暴露。这与 MyBatis 结果集映射、Spring 依赖注入、协议生成工具的套路一脉相承。",
      followups: [
        { q: "setAccessible(true) 做了什么？JDK9 模块系统对反射有什么限制？", a: "关闭 Java 语言访问检查，可读写 private 成员。JDK9 模块化后强封装，反射未导出包的内部类报 InaccessibleObjectException，需 --add-opens 显式放开。" },
        { q: "反射、MethodHandle、LambdaMetafactory 的性能对比了解吗？", a: "直接调用最快，LambdaMetafactory≈MethodHandle 次之（签名校验后可被 JIT 内联），反射 invoke 最慢（装箱+数组封装+访问检查），高频路径应避免裸反射。" },
        { q: "Spring IOC 哪些地方用到了反射？", a: "Bean 实例化（构造器反射）、@Autowired 字段/方法注入、@Value 赋值、@Configuration 解析、AOP JDK 动态代理，整个容器基本靠反射驱动。" }
      ],
      memory: "口诀：「反射是晚上开锁」——白天（编译期）走大门，晚上得撬锁（setAccessible）；撬一次贵，所以把钥匙配好随身带（缓存 Method），或者干脆白天换把新锁（生成代码）。",
      tags: ["反射", "导表工具", "游戏项目"]
    },
    {
      id: "java-basic-18",
      level: 2,
      q: "JDK 动态代理和 CGLIB 动态代理的区别？Spring AOP 默认用哪个？",
      point: "考察两种代理机制原理、Spring 默认策略选择及代理失效等实战坑。",
      approach: "先给对比结论（接口 vs 继承），分述两者实现机制与限制（CGLIB 不能代理 final），再答 Spring 默认策略及 Boot 2.x 的变化，最后落到 MyBatis Mapper 与自调用失效坑——坑才是面试官真正想听的。",
      a: "核心结论：JDK 动态代理基于接口（反射生成实现接口的代理类），CGLIB 基于继承（ASM 字节码生成目标类的子类）。\nJDK 动态代理：\n1. 要求目标类实现接口，代理类实现相同接口。\n2. 核心是 InvocationHandler.invoke + Proxy.newProxyInstance，调用转发到 handler。\nCGLIB：\n1. 不需要接口，生成目标类的子类，重写方法织入增强逻辑。\n2. 不能代理 final 类/final 方法（继承不了、重写不了）。\n3. 基于 ASM 操作字节码，生成期慢于 JDK 代理，运行期调用差不多。\nSpring AOP 默认策略：目标有接口用 JDK 代理，无接口用 CGLIB；SpringBoot 2.x 起默认 proxyTargetClass=true 强制 CGLIB（避免按接口注入失败的问题）。\n实际应用：\n1. MyBatis Mapper 接口没有实现类却能注入——JDK 动态代理生成代理，invoke 里走 SqlSession。\n2. 事务 @Transactional、缓存 @Cacheable 都是 AOP 代理织入；同类内方法自调用 this.b() 不触发代理（绕过了代理对象），这是经典坑。\n游戏场景：GM 后台（SpringBoot）的权限注解、操作日志切面都是 CGLIB 代理实现。",
      followups: [
        { q: "为什么同类内部方法自调用时 AOP 失效？怎么解决？", a: "this.b() 走的是目标对象本身而非代理对象，不经过切面。解法：注入自身代理调用、AopContext.currentProxy()（需 exposeProxy=true）、或拆分到另一个 Bean。" },
        { q: "动态代理在 MyBatis 里是怎么工作的（Mapper 没有实现类为什么能调用）？", a: "MapperProxy 用 JDK 动态代理生成接口代理类，invoke 里把方法包装成 MapperMethod 交给 SqlSession 执行 SQL 并映射结果——代理对象就是「实现类」。" }
      ],
      memory: "口诀：「JDK 代理要介绍信（接口），CGLIB 直接认干爹（继承）」——没介绍信才认干爹；但 final 是「断绝父子关系」，干爹也认不了。",
      tags: ["动态代理", "AOP", "Spring"]
    },
    {
      id: "java-basic-19",
      level: 3,
      q: "ConcurrentHashMap 的扩容（transfer）是怎么做到多线程协作的？扩容期间读写请求如何处理？",
      point: "考察 CHM 多线程协作扩容的源码级理解：sizeCtl、ForwardingNode、stride 分片。",
      approach: "按「触发→状态机→分片→读写处理→完成」讲全流程，点出三个关键：sizeCtl 记录扩容线程数、ForwardingNode 转发读请求、stride 分片让线程抢任务。最后给游戏服收益（均摊停顿）体现价值判断。",
      a: "核心结论：JDK8 的 CHM 扩容支持多线程协作搬迁——发现扩容中的线程不袖手旁观，而是帮忙一起搬，搬完才继续自己的操作。\n关键机制：\n1. 触发：put 后计数超过阈值（sizeCtl 控制），或树化时数组不足 64。\n2. sizeCtl 是扩容状态机：负数时高 16 位是扩容标识戳（reservationStamp），低 16 位是参与扩容的线程数 +1；每个想扩容的线程 CAS 把它加 1。\n3. 任务分片：每个线程通过 transferIndex 领取一段桶区间（stride，最少 16 个桶）负责迁移，类似「分田到户」。\n4. 迁移中的桶头节点会被替换为 ForwardingNode（hash = -1），get 遇到它就去新表 nextTable 查；put 遇到它就先帮忙 transfer。\n5. 全部搬完后新表替换旧表，sizeCtl 恢复。\n收益：扩容均摊到多个操作线程，避免单线程搬百万级元素的长停顿——这对游戏服很关键，在线玩家表如果扩容卡 100ms，全服玩家操作都会抖动。",
      followups: [
        { q: "sizeCtl 字段在不同取值下分别代表什么状态？", a: "-1 表示正在初始化；负值 -N 表示有 (N-1) 个线程在扩容（高 16 位为扩容标识戳）；0 为默认值；正数为下次扩容的阈值。一个字段承载四种状态。" },
        { q: "为什么说 CHM 的扩容是「写时协作」而不是「写时复制」？和 CopyOnWriteArrayList 对比适用场景？", a: "CHM 是参与式搬迁：遇到扩容的线程帮忙迁移，旧表逐步废弃；COW 是整体拷贝新数组一次性替换。前者适合高频写，后者只适读多写极少。" }
      ],
      memory: "口诀：「搬家时来帮忙的才准进门」——扩容像搬家，ForwardingNode 是「已搬走」告示牌；想放东西？先帮忙搬 16 箱（stride）再说。",
      tags: ["ConcurrentHashMap", "扩容", "源码", "深挖"]
    },
    {
      id: "java-basic-20",
      level: 3,
      q: "假设你们游戏服用 ConcurrentHashMap 做玩家数据缓存，用 get-then-put（check-then-act）模式更新玩家战力排行榜，会有什么并发问题？怎么解决？",
      point: "考察复合操作非原子的认知，及从锁到串行化的分层解决思路。",
      approach: "先点破「单方法原子≠组合原子」，给丢失更新的具体例子，再给四层方案：compute/merge 原子方法、CAS 重试、分段锁、Disruptor 串行化。最后一层是重点——「消灭共享优于加锁」是差异化亮点，必须讲到。",
      a: "核心结论：ConcurrentHashMap 的单个方法（get/put）是原子的，但「get → 判断 → put」组合不是原子的，多线程下会丢失更新或基于过期数据决策。\n典型事故场景（游戏服真实高频题）：\n两个线程同时 get 到玩家战力 1000，各自 +100 后 put 回去，结果都是 1100，丢了 100（丢失更新，类 ABA）。\n解决方案（按场景选）：\n1. 用原子方法：compute(key, (k,v) -> v == null ? 100 : v + 100) 或 merge——CHM 对单个桶的 compute 持有桶锁，复合操作原子化。注意 compute 的函数体不能改同一个 Map 的其他 key（死锁风险）。\n2. putIfAbsent / replace(key, oldVal, newVal)（CAS 语义）做乐观锁重试。\n3. 加细粒度锁：按玩家 ID 分段的锁数组（如 64 把锁，id % 64）。\n4. 架构级方案（我们更常用）：游戏服用 Disruptor/线程亲和把同一玩家的操作固定到同一个逻辑线程串行执行——玩家维度无并发，排行榜这类全局数据用独立的排行榜线程消费增量事件，从根上消除共享写。这是「消灭共享优于加锁」的思路，也是 Disruptor 的核心价值之一。",
      followups: [
        { q: "compute 方法的 remappingFunction 里为什么不能操作同一个 Map？", a: "compute 持有桶锁执行函数，函数内再操作同 Map 可能争用其他桶锁造成互锁，或触发递归更新；官方明确禁止，轻则死锁重则死循环。" },
        { q: "你们用 Disruptor 做玩家串行化，跨玩家的交互（如交易）怎么处理？", a: "交易请求转入独立的交易线程队列串行撮合，或按玩家对路由到同一线程；也可双方按 id 排序定序加锁防死锁——核心是仍然保持定序。" },
        { q: "ConcurrentHashMap 的 size() 是准确值吗？", a: "不是。size() 是 baseCount+CounterCell 求和的近似值，并发写入时可能滞后；mappingCount() 同理。设计上不应依赖精确 size 做判断。" }
      ],
      memory: "口诀：「原子方法只保一拳，组合拳要自己上锁」——get+put 是两拳，中间空门大开；要么合成一招（compute/merge），要么从根上改打法（串行化）。",
      tags: ["ConcurrentHashMap", "并发", "游戏服", "深挖"]
    },
    {
      id: "java-basic-21",
      level: 3,
      q: "你的导表工具和协议生成工具用反射生成代码。如果让你重新设计，如何在「运行期反射」「启动期代码生成（annotation processing/模板）」「字节码增强」三种方案间权衡？",
      point: "考察对反射/APT/字节码增强三种「元数据翻译时机」的架构权衡能力。",
      approach: "先抽象本质——翻译时机不同，再逐个讲三方案优劣，核心是给选型逻辑：导表诉求（高频改表+错误左移+启动快）推导出编译期生成源码最优。最后补 APT 与字节码各自的适配场景和热更新应用，展示全景视野。",
      a: "核心结论：三种方案的本质是「把元数据翻译成可执行代码的时机」不同——运行期反射最灵活但慢，启动期生成源码编译期可见最稳，字节码增强最透明但调试难。\n1. 运行期反射（如旧版导表工具直接 Field.set 填充）：改表不用改代码，运行时动态适配；缺点是慢（启动加载上万行配置时明显）、错误延迟到运行期才暴露、反射调用有开销。\n2. 启动期/编译期代码生成（我们最终方案）：Excel/IDL → 模板引擎（Freemarker）生成 .java 源码 → 参与编译。优点：类型错误编译期暴露（策划填错类型直接编译失败，拦截在上线前）、运行零反射开销、IDE 可补全可断点。缺点：改表必须重新生成+编译。\n3. 字节码增强（ASM/Javassist，如 Lombok、JPA 增强）：对源码零侵入；缺点是黑盒、调试栈不友好、构建链复杂。\n选型逻辑：游戏导表的核心诉求是「策划高频改表 + 上线前必须发现错误 + 启动快」，所以编译期生成源码是最优解——把错误左移到编译期。Annotation Processing（APT，如 MapStruct）适合「注解驱动、规则固定」的场景；字节码增强适合「不能改源码、运行期织入」的场景（如热更新、监控探针）——我们热更新就用到了字节码/JVM attach 思路替换类逻辑。",
      followups: [
        { q: "Annotation Processing 和反射在编译期/运行期的分工有什么不同？", a: "APT 在编译期运行，读注解生成源码/资源，错误编译期暴露、运行零开销；反射在运行期动态读注解，灵活但有性能开销、错误晚暴露——一个左移一个右置。" },
        { q: "热更新是怎么实现的（类加载器隔离 vs Instrumentation redefine）？为什么 redefine 不能改类结构？", a: "redefine 只能替换方法体，因为增删字段/方法会改变常量池与方法表布局，已存在对象全部失效；改结构需自定义类加载器加载新类并迁移状态（隔离方案）。" }
      ],
      memory: "口诀：「反射是现场翻译，代码生成是提前出字幕，字节码增强是给电影换配音」——现场翻译慢但灵活，提前出字幕稳但要重印，换配音无痕但观众口型对不上时没法查。",
      tags: ["反射", "代码生成", "字节码", "游戏项目", "深挖"]
    },
    {
      id: "java-basic-22",
      level: 3,
      q: "Stream 的 parallel() / parallelStream() 有什么陷阱？为什么在游戏服务器或 Web 服务里滥用并行流可能引发线上事故？",
      point: "考察 commonPool 全局共享这一隐藏风险，及并行流适用边界的判断力。",
      approach: "先抛出核心风险（全局 ForkJoinPool 被阻塞污染殃及全进程），再列拆分 overhead、线程安全、顺序三个次坑，然后给游戏服正确姿势：明确线程模型+自建池。结尾给适用判断标准（CPU 密集+大数据量+无共享）显专业。",
      a: "核心结论：并行流默认共用 JVM 全局唯一的 ForkJoinPool.commonPool（默认并行度 = CPU 核数 - 1），任务一旦阻塞或耗时，会拖垮整个进程里所有用并行流/CompletableFuture 的代码。\n具体陷阱：\n1. 公共池污染：并行流里做阻塞 IO（查库、RPC），worker 线程被占满，其他模块的并行流和 CompletableFuture.supplyAsync（默认也用 commonPool）一起饿死。游戏服里一个并行流慢查询可能拖垮协议处理。\n2. 任务拆分开销：数据量小（几百条）时，拆任务 + 合并结果的开销远超收益，比串行还慢。\n3. 线程安全问题：collect 到非线程安全容器、Lambda 里改共享变量，直接数据错乱。\n4. 顺序语义：forEach 不保证顺序，要顺序用 forEachOrdered。\n游戏服正确姿势：\n1. 高吞吐逻辑用明确的线程模型（Netty IO 线程 + Disruptor 逻辑线程 + 业务线程池），每个池有界、可监控、可隔离——这是我们项目的选择。\n2. 真要并行处理批任务（如结算全服奖励），自建 ForkJoinPool 或固定线程池 + CompletableFuture 指定 executor，绝不裸用 commonPool。\n3. CPU 密集 + 数据量大（上万）+ 无共享状态，才是并行流的合法场景。",
      followups: [
        { q: "ForkJoinPool 的工作窃取（work-stealing）算法讲一下？", a: "每个 worker 有双端队列，自己从头部取任务执行，空闲时从其他队列尾部「偷」任务，减少竞争、自动均衡负载；ForkJoinTask 通过 fork/join 递归拆分合并。" },
        { q: "CompletableFuture 默认用哪个线程池？生产上应该怎么用？", a: "默认用 ForkJoinPool.commonPool。生产必须 supplyAsync(task, 自建业务池)：按业务隔离池、设界、命名线程、配拒绝策略与监控，避免互相拖累。" },
        { q: "怎么给并行流指定自定义线程池？（提示：pool.submit(() -> stream.parallel()...) 的原理和局限）", a: "把 parallelStream 的终端操作提交进自定义 ForkJoinPool，它会在该池执行；但 commonPool 仍可能参与且语义隐晦不可靠。正经做法是放弃并行流，手动拆分任务提交线程池。" }
      ],
      memory: "口诀：「commonPool 是全公司唯一的保洁阿姨」——你让她帮你搬家（阻塞任务），全公司都没人打扫卫生了；所以重活自己雇人（自建线程池）。",
      tags: ["Stream", "ForkJoinPool", "并发", "深挖"]
    },
    {
      id: "java-basic-23",
      level: 1,
      q: "Object 类有哪些方法？哪些可以重写、哪些是 final？各有何用途？",
      point: "考察 Object 方法全集的体系化记忆，及可重写性、线程方法归属等细节。",
      approach: "用三组分类法（身份四件套/生死两件/线程协作五兄弟）一次性报全 11 个方法，标注哪些 final、哪些可重写，点名 finalize 废弃与 clone 是 protected 两个细节，最后解释 wait/notify 为何在 Object——用设计理解收尾。",
      a: "核心结论：Object 共 11 个方法，分三组记忆：身份四件套、生死两件、线程协作五兄弟。\n1. 标识与比较（可重写）：getClass()（final，返回运行时类）、hashCode()、equals()、toString()。\n2. 克隆与析构：clone()（protected，需实现 Cloneable 标记接口，默认浅拷贝）；finalize()（JDK9 废弃、JDK18 移除，执行时机不保证，勿用，替代品是 Cleaner/PhantomReference）。\n3. 线程协作（全部 final）：wait()/wait(long)/wait(long,int) 让当前线程释放对象监视器进入等待集；notify()/notifyAll() 唤醒等待线程——调用前必须持有该对象的锁（synchronized 内），否则抛 IllegalMonitorStateException。\n易考点：equals/hashCode/toString 常被重写；getClass、wait、notify 是 final 不可重写；clone 是 protected，不能对任意对象直接调用。\n工程启示：wait/notify 定义在 Object 而非 Thread，因为锁（监视器）是对象级别的——每个对象既是锁也是等待条件，这个设计与 synchronized 语义绑定。游戏服里我们几乎不直接用 wait/notify（用 Lock/Condition 或 Disruptor 的等待策略），但面试必考。",
      followups: [
        { q: "finalize 为什么被废弃？Cleaner 解决了什么问题？", a: "finalize 执行时机不保证、可能永不执行、拖慢 GC 还可能复活对象。Cleaner 基于 PhantomReference 由专门线程执行清理，时机可控、不阻塞对象回收。" },
        { q: "wait 为什么定义在 Object 而不是 Thread？", a: "锁（监视器）是对象级的，等待/通知本质是与锁绑定的条件队列操作；若放在 Thread，一个线程无法方便地等待多个条件、释放的锁也不明确。" },
        { q: "clone() 要实现深拷贝必须怎么做？", a: "重写 clone 时对每个引用字段递归调 clone 或新建拷贝，引用链深时极易漏；工程上更推荐序列化拷贝（Kryo）或手写拷贝构造器。" }
      ],
      memory: "口诀：「身份四件套（class/hash/equals/string）、生死两件（clone/finalize）、睡叫五兄弟（wait×3 + notify×2）」——能重写的只有前三件和 clone，其余 final。",
      tags: ["Object", "基础", "方法全集"]
    },
    {
      id: "java-basic-24",
      level: 1,
      q: "深拷贝和浅拷贝的区别是什么？Java 实现深拷贝有哪些方式？游戏服里哪些场景必须深拷贝？",
      point: "考察拷贝语义辨析、多种深拷贝实现的选型，及游戏服必拷场景的实战经验。",
      approach: "先一句话区分两种拷贝（引用共享 vs 对象图全复制），再系统给五种实现并标注坑（BeanUtils 是浅拷贝），核心答三个游戏场景：跨线程防御、战斗快照、配置只读保护——用场景驱动回答而非罗列概念。",
      a: "核心结论：浅拷贝只复制对象本身和字段的引用（内部对象共享），深拷贝连引用指向的整个对象图一起复制。\n1. 浅拷贝：Object.clone() 默认行为——两个对象共享内部数组/集合，改一边另一边跟着变。\n2. 深拷贝实现方式：① 逐层重写 clone（繁琐易漏）；② Java 序列化/Kryo 写入字节流再读回（要求可序列化，Kryo 是游戏服常用方案）；③ JSON 序列化反序列化（Jackson，要求无参构造/getter）；④ 手写拷贝构造器或 copy 工厂方法（类型安全、可控，核心业务对象最推荐）；⑤ 工具类 SerializationUtils——注意 Spring 的 BeanUtils.copyProperties 是浅拷贝，别误用。\n游戏服实战：\n1. 跨线程防御性拷贝：玩家数据从逻辑线程传给 IO 线程/日志线程前拷贝一份，防止一条线程改、另一条读到中间态。\n2. 战斗快照：跨服战开打前对玩家战斗属性深拷贝快照，结算用快照，避免战斗中途玩家换装/升级污染战报。\n3. 配置表只读保护：策划配置对象全局共享只读，活动需要临时改数值时必须先深拷贝再改——否则全服玩家一起中招，这种事故排查极难。",
      followups: [
        { q: "为什么说 clone() 的设计是失败的（Cloneable 无方法、构造器不执行）？", a: "Cloneable 是空标记接口却没有 clone 方法（clone 在 Object 且 protected），拷贝不调用构造器绕过初始化逻辑，深拷贝还得逐层重写——契约破碎、易错。" },
        { q: "用 Kryo 做深拷贝时遇到循环引用怎么办？", a: "Kryo 默认开启循环引用支持（references=true）可正确处理；若关闭则递归拷贝栈溢出。还需注意循环引用下 equals/hashCode 的实现与瞬态字段。" },
        { q: "BeanUtils.copyProperties 是深拷贝还是浅拷贝？嵌套对象会怎样？", a: "浅拷贝——只复制字段值，嵌套对象/集合字段复制的是引用，改目标对象的嵌套属性会连带改源对象；嵌套结构需手动深拷或用 MapStruct 生成映射。" }
      ],
      memory: "类比：浅拷贝是「复印钥匙串」——两把钥匙开同一间房；深拷贝是「连房间一起复制」，各住各的互不打扰。",
      tags: ["深拷贝", "浅拷贝", "clone", "游戏服"]
    },
    {
      id: "java-basic-25",
      level: 1,
      q: "自动装箱/拆箱的底层是什么？Integer 缓存池的范围和原理？写业务代码有哪些必踩的坑？",
      point: "考察装箱底层、缓存池范围，及 == 比较、拆箱 NPE、热路径装箱三大实战坑。",
      approach: "先给编译器转换本质（valueOf/xxxValue）和缓存范围，再按坑一（== 比较）、坑二（拆箱 NPE）、坑三（热循环装箱）逐条讲，每坑带游戏场景。最后提 Long 型玩家 ID 同理，展示经验迁移能力。",
      a: "核心结论：装箱 = 编译器自动调 valueOf（Integer.valueOf(int)），拆箱 = 自动调 xxxValue()；Integer/Long/Short/Byte/Character 缓存 -128~127，Boolean 缓存 true/false。\n1. 缓存原理：Integer.valueOf 命中缓存返回同一对象（IntegerCache 静态数组），范围外 new 新对象；缓存上限可用 -XX:AutoBoxCacheMax 调大，下限固定。\n2. 坑一：包装类型用 == 比较——127 以内 true、128 起 false；玩家等级、道具数量、战力比较必须 equals 或拆箱成基本类型。\n3. 坑二：拆箱 NPE——Map<Long, Integer> get 到 null 直接赋给 int 变量，抛 NPE 且堆栈指向很迷惑；游戏服查配置表 miss、JSON 反序列化缺字段时高发。\n4. 坑三：热循环装箱产生大量临时对象——伤害结算、寻路等热路径用 int/long 数组而非 List<Integer>，减少 GC 压力。\n5. Long 型玩家 ID 同理：== 比较必踩坑，全项目统一 equals 或直接用 long 基本类型。",
      followups: [
        { q: "new Integer(127) 和 Integer.valueOf(127) 用 == 比较结果是什么？", a: "false。new 强制在堆新建对象、永远绕过缓存；valueOf(127) 返回缓存对象，两者不是同一引用。" },
        { q: "为什么缓存上限可以调大、下限不能调小？", a: "IntegerCache 在类初始化时按 -XX:AutoBoxCacheMax 分配数组，上限可配；下限 -128 是 JLS 规范强制必须缓存的范围，不能调小。" },
        { q: "Integer a = 1; long b = 1; a == b 结果是什么（提示：拆箱优先级）？", a: "true。包装类与基本类型混合 == 时，a 先拆箱成 int 再提升为 long，按数值比较——类型不同但值相等即为 true。" }
      ],
      memory: "口诀：「-128 到 127 走团购（缓存同一对象），128 起单独开票（new 新对象）」——团购的 == 认得出，单开的 == 认不出。",
      tags: ["自动装箱", "Integer缓存", "基础", "坑"]
    },
    {
      id: "java-basic-26",
      level: 2,
      q: "为什么金额计算不能用 double/float？BigDecimal 的正确用法和三大坑是什么？你们购买服怎么处理金额？",
      point: "考察浮点精度原理认知、BigDecimal 三大坑与金额存储选型的工程经验。",
      approach: "先讲二进制浮点为何无法精确表示 0.1，再逐个讲三坑（构造传 double、equals 带 scale、divide 舍入）并给正确写法，最后答购买服实践：能整型就整型、字符串构造、compareTo 校验——原则先行、细节跟上。",
      a: "核心结论：double/float 是二进制浮点，无法精确表示 0.1 这类十进制小数，累加必产生精度误差——涉及钱必须用 BigDecimal 或 long 存最小单位（分）。\n三大坑：\n1. 构造坑：new BigDecimal(0.1) 把 double 的误差原样带入（0.1000000000000000055...），必须用 new BigDecimal(\"0.1\") 或 BigDecimal.valueOf(0.1)（内部走 Double.toString）。\n2. equals 坑：BigDecimal.equals 连 scale 一起比较，\"1.0\" 和 \"1.00\" 不相等；比大小一律用 compareTo()。\n3. 除法坑：divide 不指定舍入模式且除不尽时抛 ArithmeticException，必须 divide(b, 2, RoundingMode.HALF_UP)。\n购买服实践：\n1. 充值订单金额入库用 decimal(10,2)，Java 侧 BigDecimal，渠道分成比例计算统一 HALF_UP 到分。\n2. 游戏内货币（钻石/金币）本质是整数，直接 long 存「个」，杜绝浮点——业界通行做法：能整型就整型，只有真实法币金额才上 BigDecimal。\n3. 苹果/渠道支付回调金额字段是字符串，解析只走 BigDecimal(String) 构造，且入库前与订单金额 compareTo 校验，防篡改防精度错。\n4. BigDecimal 不可变、每次运算新建对象，热路径（如全服结算批处理）注意对象分配开销。",
      followups: [
        { q: "0.1 + 0.2 在 Java 里等于多少？为什么？", a: "0.30000000000000004。0.1 和 0.2 在二进制下都是无限循环小数，按 IEEE754 截断存储后累加的误差在小数末尾显形。" },
        { q: "RoundingMode.HALF_UP 和 HALF_EVEN（银行家舍入）的区别？什么场景用哪个？", a: "HALF_UP 是四舍五入；HALF_EVEN 逢 5 凑偶数，大量累加时误差统计性抵消。金融批量结算用 HALF_EVEN，单笔展示/订单用 HALF_UP 更直观。" },
        { q: "用 long 存「分」有什么隐患？溢出问题怎么考虑？", a: "分转元易忘除 100 出错；long 上限约 9 千万亿元一般够用，但乘利率、汇率等中间量可能溢出，大额运算的中间值用 BigDecimal 承接。" }
      ],
      memory: "口诀：「double 是估堆，BigDecimal 是点钞」——估堆差几张没人管，点钞差一张要人命；点钞认字符串票面（String 构造），比钞面用 compareTo。",
      tags: ["BigDecimal", "精度", "购买服", "金额"]
    },
    {
      id: "java-basic-27",
      level: 1,
      q: "Comparable 和 Comparator 的区别是什么？游戏排行榜排序用哪个、怎么写？",
      point: "考察两种比较接口的定位差异，及排行榜多字段排序的工程实现技巧。",
      approach: "先给「自带 vs 外部策略」结论，讲 Comparator 链式写法，强调与 equals 的一致性（TreeSet 判重不调 equals），重点答排行榜：多字段排序、Redis ZSet 增量、long 编码 key 技巧、a-b 溢出坑。实践密度要高。",
      a: "核心结论：Comparable 是对象「自带」的比较能力（实现 compareTo，改类本身），Comparator 是「外部」比较策略（独立比较器，不改类，可有多套）。\n1. Comparable：类实现 compareTo，Arrays.sort/Collections.sort/TreeMap 直接使用；一个类只有一种自然顺序。\n2. Comparator：可定义任意多套规则，JDK8 起链式写法：Comparator.comparing(Player::getPower).reversed().thenComparing(Player::getLevel)。\n3. 一致性要求：compareTo/compare 应尽量与 equals 一致（a.equals(b) ⇔ compare==0），否则放进 TreeSet/TreeMap 会「丢」元素——有序集合用比较结果判重，根本不调 equals。\n排行榜实践：\n1. 全服战力榜用 Comparator 外部策略：战力降序 → 同战力比上榜时间升序（先到达者排前），thenComparing 组合。\n2. 大排行榜不反复全排序——增量更新用 Redis ZSet（跳表）；内存榜可把「战力<<32 | 时间取反」编码成一个 long 做 key，TreeMap<Long, Long> 一次 compare 搞定多字段排序，热路径省比较器开销。\n3. compareTo 里别写 a - b（int 溢出翻车），用 Integer.compare 或 Long.compare。",
      followups: [
        { q: "compareTo 返回值用 a - b 有什么坑（溢出）？举例说明。", a: "a=21 亿（接近 Integer.MAX_VALUE）、b=-1 时 a-b 溢出成负数，排序结果颠倒。战力、时间戳这类大数值比较必须用 Integer.compare/Long.compare。" },
        { q: "为什么 TreeSet 里 compare 返回 0 但 equals 为 false 的元素加不进去？", a: "TreeSet 只凭 compare 结果判等（返回 0 即视为重复），根本不调 equals/hashCode；compare 与 equals 不一致时元素会被静默拒绝。" },
        { q: "Redis ZSet 底层（跳表）为什么比红黑树更适合排行榜？", a: "跳表按 score 做区间查询和排名操作高效（O(logN+M)），实现简单无需旋转平衡，且支持按排名范围取数；红黑树范围遍历复杂，不适合排行榜语义。" }
      ],
      memory: "口诀：「Comparable 是天生身高，Comparator 是评委打分」——身高只有一种，评委可以按战力、等级、才艺各排各的榜。",
      tags: ["Comparable", "Comparator", "排序", "排行榜"]
    },
    {
      id: "java-basic-28",
      level: 2,
      q: "字符串拼接在编译期和运行期分别怎么优化？JDK9 的 StringConcatFactory 是什么？日志服高频拼接怎么写？",
      point: "考察拼接优化的版本演进（编译期 StringBuilder→invokedynamic）与日志热路径优化。",
      approach: "按时间线讲：常量折叠→编译期 StringBuilder→JDK9 StringConcatFactory，讲清循环拼接为何必须显式 Builder，最后给日志服三条实践（占位符、预分配、二进制 schema）。能讲出版本差异是这题的区分度。",
      a: "核心结论：JDK8 及之前编译期把 + 优化成 StringBuilder.append 链；JDK9 起改为 invokedynamic + StringConcatFactory，运行时才决定最优拼接策略。\n1. 常量折叠：\"a\" + \"b\" 编译期直接合成 \"ab\"，零临时对象。\n2. 单行 +：编译为一次 StringBuilder（默认容量 16，超长触发扩容拷贝）的多次 append。\n3. 循环里 +：每次循环 new 一个 StringBuilder，产生大量临时对象——必须循环外显式 new StringBuilder 并给足初始容量。\n4. JDK9+：+ 编译为 invokedynamic 指令，首次执行时 StringConcatFactory 按实际参数类型生成定制拼接代码（可精确计算长度一次性分配 byte[]，配合 Compact String 更省内存），且未来 JVM 升级拼接策略不用改字节码。\n日志服实践：\n1. 日志先判级别再拼：用 SLF4J 占位符 log.info(\"player {} login, cost {}\", id, cost)，debug 级别用 isDebugEnabled() 守护，避免无谓拼接。\n2. BI 日志大批量字段拼接用预分配 StringBuilder（按平均行长 new StringBuilder(256)），减少扩容。\n3. 真正高频路径不拼字符串——协议日志走二进制 schema 落盘，离线再格式化，拼接开销在热路径上是奢侈的。",
      followups: [
        { q: "StringBuilder 默认容量 16，append 超了怎么扩容？", a: "新容量 = old*2+2，仍不够则直接用所需长度，Arrays.copyOf 整体拷贝——预估长度传入构造器可省多次扩容拷贝。" },
        { q: "JDK9 为什么要换掉编译期 StringBuilder 方案？好处是什么？", a: "编译期方案策略固化在字节码里，无法随 JVM 优化演进；invokedynamic 把策略推迟到运行时，可精确算长一次分配、配合 Compact String，未来升级零成本。" },
        { q: "String.join 和 Collectors.joining 底层是什么？", a: "String.join 内部走 StringJoiner（本质是 StringBuilder 加分隔符）；Collectors.joining 同样用 StringJoiner 累积，delimiter/prefix/suffix 语义一致。" }
      ],
      memory: "口诀：「JDK8 是按菜谱备菜（编译期生成 StringBuilder），JDK9 是看食材现做（invokedynamic 运行时定制）」——现做不浪费（精确分配），但循环大锅菜还是自己备料快（显式 StringBuilder）。",
      tags: ["String", "字符串拼接", "JDK9", "日志服"]
    },
    {
      id: "java-basic-29",
      level: 2,
      q: "fail-fast 机制的原理是什么？它是线程安全的保证吗？游戏服遍历在线玩家广播时怎么避免 ConcurrentModificationException？",
      point: "考察 modCount 机制原理、非线程安全的定性，及广播遍历的并发解决方案。",
      approach: "先讲 modCount/expectedModCount 校验机制，明确定性「不是线程安全保证、只是 bug 探测器」，再给游戏服三方案：快照拷贝、CHM 弱一致、收编到单线程（重点），最后补延迟操作队列这一通用手法。",
      a: "核心结论：fail-fast = 集合维护 modCount 修改计数，迭代器创建时记下 expectedModCount，每次 next() 校验，不一致抛 ConcurrentModificationException。\n1. 原理：结构性修改（add/remove）modCount++；迭代器自己的 remove() 会同步 expectedModCount——所以「迭代中删除必须用迭代器的 remove()」是唯一安全姿势，增强 for 里直接 list.remove() 必抛。\n2. 不是线程安全保证：modCount 检查没有任何同步/volatile 语义，只是「尽力而为」的 bug 探测器，多线程下可能该抛不抛——绝不能当并发控制用。\n3. fail-safe/弱一致：CopyOnWriteArrayList 迭代器基于快照，ConcurrentHashMap 迭代器是弱一致视图，迭代中修改不抛异常，但可能读到旧值。\n游戏服实践：\n1. 广播遍历 onlinePlayers.values() 时别的线程踢人下线触发 CME——方案：① 遍历前拷贝快照 new ArrayList<>(map.values())（在线量可控时）；② 用 CHM 弱一致迭代器，容忍踢人延迟一个 tick 生效；③ 更彻底（我们采用）：遍历与增删收编到同一逻辑线程，主循环 tick 内先处理下线队列再广播，从线程模型上消灭并发修改。\n2. 延迟操作队列是游戏服通用手法：循环中不直接增删，先记进 pendingAdd/pendingRemove，循环结束统一 flush。",
      followups: [
        { q: "CopyOnWriteArrayList 适合什么场景？写多会有什么问题？", a: "适合读极多写极少、迭代远多于修改的场景，如事件监听器列表、动态白名单。写多时每次全量拷贝数组，内存翻倍、GC 压力大，写频繁场景禁用。" },
        { q: "modCount 为什么不做成 volatile？（提示：性能与语义取舍）", a: "modCount 定位是单线程 bug 探测，加 volatile 会让每次增删付可见性成本，却仍给不了真线程安全——语义与成本不匹配，索性不保证。" },
        { q: "单线程下也可能抛 CME 吗？举例。", a: "会。增强 for 迭代中直接调 list.remove()（非迭代器 remove）就抛；同理对 subList 视图操作后改原表也抛——单线程违反契约照样触发。" }
      ],
      memory: "口诀：「modCount 是装修备案号」——施工（增删）一次备案号 +1，验收员（迭代器）发现号不对就报警；但备案本没上锁，两人同时改可能查不出来（非线程安全）。",
      tags: ["fail-fast", "CME", "集合", "游戏服"]
    },
    {
      id: "java-basic-30",
      level: 2,
      q: "Java 四种内部类的区别是什么？内部类隐式持有外部引用，在游戏服务器里会引发什么实际问题？",
      point: "考察四种内部类差异，及隐式外部引用导致的内存泄漏、序列化实战坑。",
      approach: "先给四类定义与「除静态都持 this$0」结论，再重点答游戏服三坑：handler 引用链泄漏、定时任务忘 cancel、序列化连带外部对象，每坑给规范解法（能 static 就 static、显式 unregister），最后用 Holder 单例正面收尾。",
      a: "核心结论：内部类分四种——成员内部类、静态内部类、局部内部类、匿名内部类；除静态内部类外都隐式持有外部类 this$0 引用。\n1. 成员内部类：依附外部实例，可用 Outer.this 访问外部成员；隐式引用是内存泄漏高发源。\n2. 静态内部类（static nested class）：不持外部引用，等价于命名空间内聚的普通类——设计首选。\n3. 局部内部类：定义在方法内，捕获的局部变量必须 effectively final。\n4. 匿名内部类：new 接口(){...}，同样持有外部引用；JDK8 后多被 Lambda 替代（Lambda 只要不引用外部成员就不捕获 this）。\n游戏服真实坑：\n1. Netty handler 写成非静态内部类/匿名类注册进全局 pipeline 或定时任务后，引用链 handler → 内部类 → 外部 GameServer 单例整条泄漏，热更新/重载时老对象回收不掉。\n2. 定时任务 new TimerTask(){...} 匿名类持有 ActivityService.this，活动结束忘了 cancel，活动对象连同缓存数据常驻内存——规范：内部类能 static 就 static；必须持外部引用时显式 unregister 或用弱引用。\n3. 序列化陷阱：非静态内部类序列化会连带序列化外部对象，Kryo/Java 序列化报莫名字段错误——协议 DTO 一律顶层类或静态内部类。\n4. 正面用法：静态内部类 Holder 模式实现延迟加载单例（类加载锁保证线程安全），我们配置管理中心用过。",
      followups: [
        { q: "Lambda 和匿名内部类在外部引用持有上有什么区别？", a: "匿名类无论用不用外部成员都持有 this$0；Lambda 只有引用外部实例成员才捕获 this，纯用局部变量则不持外部引用——防泄漏优先用 Lambda。" },
        { q: "静态内部类 Holder 模式实现单例为什么线程安全且延迟加载？", a: "内部类按需加载：首次访问 Holder 才触发其类初始化，JVM 类加载锁天然保证线程安全；无需 synchronized 即同时获得延迟加载与线程安全。" },
        { q: "局部内部类/匿名类捕获的局部变量为什么必须 effectively final？", a: "局部变量是值拷贝进内部类的，若可变，内外两份副本可各自修改导致语义错乱；强制不可变保证副本一致性。" }
      ],
      memory: "口诀：「内部类是揣着房东钥匙的租客」——非静态的都带着房东家钥匙（this$0），房东想卖房（GC）都卖不掉；静态的是自立户口，两不相欠。",
      tags: ["内部类", "内存泄漏", "Netty", "游戏服"]
    },
    {
      id: "java-basic-31",
      level: 2,
      q: "四大元注解分别是什么？自定义注解怎么在运行期真正生效？你在游戏项目里自定义过哪些注解？",
      point: "考察元注解体系与「注解需处理者才生效」的本质认知，及项目实战应用。",
      approach: "先报四大元注解职责（口诀化一句话），重点强调注解只是元数据、必须有处理者（反射/APT/AOP）才生效，然后讲三个项目实例：协议分发、权限切面、导表校验。实例是灵魂，别停在背注解。",
      a: "核心结论：元注解是「注解注解的注解」，四大金刚：@Target 管贴哪、@Retention 管活多久、@Inherited 管传不传后代、@Documented 管进不进 Javadoc。\n1. @Target：可贴位置（TYPE/METHOD/FIELD/PARAMETER…）。\n2. @Retention：存活期——SOURCE（编译丢弃，如 @Override）、CLASS（进 class 文件，默认）、RUNTIME（反射可读，如 @Autowired）；运行期框架要处理就必须 RUNTIME。\n3. @Inherited：仅对类注解有效，子类可继承父类注解；对方法和接口无效。\n4. 生效原理：注解本身只是元数据，必须有「处理者」——运行期反射 getAnnotation() 扫描（Spring、Junit）、编译期 APT 生成代码（MapStruct/Lombok）、或 AOP 切面织入。\n游戏项目实践：\n1. 协议分发：@MsgHandler(cmd = 1001) 标在处理方法上，启动扫描注册到 Map<Integer, Method>，Netty 收包按 cmd 反射调用——替代手写 switch，加协议只加一个方法。\n2. GM 后台：@RequiresPermission(\"gm:player:ban\") 自定义权限注解 + Spring AOP 切面，拦截 controller 校验 Session 权限并落操作日志（谁、何时、封了谁）——RuoYi 重构时梳理过这套。\n3. 导表校验：@ExcelColumn(name = \"战力上限\", required = true) 标在配置实体字段，导表工具反射读注解做列映射与必填校验，列名错了直接报错给策划，拦截在进服前。",
      followups: [
        { q: "组合注解（如 @Service 组合 @Component）是怎么回事？能自定义组合注解吗？", a: "在自定义注解上标注已有注解即组合，Spring 支持组合注解并继承其元注解语义（如 @Service 之上是 @Component），可减少重复标注、统一语义。" },
        { q: "运行期反射读注解有缓存吗？高频路径怎么处理性能？", a: "JDK 对注解有软引用缓存，但 getAnnotation 仍有开销；高频路径应在启动时一次性扫描注册成 Map（如 cmd→Method），运行期零反射。" },
        { q: "@Inherited 有哪些局限？", a: "只对类上的注解有效，方法和接口注解不继承；实现接口也拿不到接口上的注解，代理场景需用 Spring 的 AnnotationUtils 做桥接查找。" }
      ],
      memory: "口诀：「Target 管贴哪，Retention 管活多久，Inherited 管传不传后代，Documented 管上不上户口」；注解是便利贴，没人读（处理者）就是废纸。",
      tags: ["注解", "元注解", "AOP", "游戏项目"]
    },
    {
      id: "java-basic-32",
      level: 2,
      q: "Java SPI 机制的原理是什么？为什么需要线程上下文类加载器？和 Spring spring.factories、Dubbo SPI 有什么区别？",
      point: "考察 SPI 原理、TCCL 破坏双亲委派的必然性，及 JDK/Spring/Dubbo 三代演进对比。",
      approach: "先给 SPI 定义与加载流程，讲清 TCCL 为什么必须（接口在启动类加载器、实现在应用层），再做三方对比（缓存/key 选择/依赖注入），最后用渠道接入场景落地，Spring Bean 实现与 SPI 思想对照收尾，展示架构视野。",
      a: "核心结论：SPI = 接口由调用方 jar 定义、实现由第三方 jar 提供，通过 META-INF/services/接口全限定名 文件声明实现类，ServiceLoader.load() 扫描加载——实现「可插拔」。\n1. JDK SPI 流程：ServiceLoader 读所有 jar 的 services 文件，反射实例化实现类；典型例子 JDBC Driver、SLF4J 绑定。缺点：懒迭代但无缓存（每次 load 新建实例）、一次性无法按 key 选择、无依赖注入。\n2. 为什么用 TCCL（线程上下文类加载器）：SPI 接口在启动类加载器（如 rt.jar 的 java.sql.Driver）里，实现类在应用 classpath，双亲委派下启动类加载器看不到实现，必须「破坏委派」用 TCCL 向下加载——这是类加载委派模型的经典例外。\n3. Spring spring.factories：同思路但一次性全量读 + 缓存 + 支持排序过滤，SpringBoot 自动装配（EnableAutoConfiguration）就靠它。\n4. Dubbo SPI：增强版——key-value 配置（dubbo=com.xxx.DubboProtocol）按需加载、支持 AOP 包装与 IOC 注入、@Adaptive 运行时自适应选实现，解决 JDK SPI 全实例化、无注入的痛点（我微服务学习项目里实操过 Dubbo SPI 扩展点）。\n游戏场景：卡牌渠道接入（华为/小米/应用宝）是天然 SPI 场景——定义 ChannelLoginService 接口（验签/取 openId），各渠道实现独立打包，新渠道只加 jar 不改主工程；我们实际用 Spring Bean + 配置开关，但 SPI 对比能体现架构视野。",
      followups: [
        { q: "ServiceLoader 线程安全吗？多线程下怎么用？", a: "非线程安全。多线程下各线程各自 new ServiceLoader 使用，或外层加锁；SpringFactoriesLoader 有内部缓存可安全共享。" },
        { q: "JDBC4 之后为什么不用 Class.forName(\"com.mysql.jdbc.Driver\") 了？", a: "JDBC4 起驱动通过 SPI 自动注册（META-INF/services/java.sql.Driver），DriverManager 初始化时自动加载所有驱动，Class.forName 仅为兼容老驱动。" },
        { q: "Dubbo 的 @Adaptive 和 @Activate 区别是什么？", a: "@Adaptive 运行时按 URL 参数动态选择实现（自适应扩展点）；@Activate 是有条件自动激活的扩展集合（如按 group 过滤），常用于 Filter 链自动装配。" }
      ],
      memory: "口诀：「SPI 是插座标准」——主板（调用方）只定插口，谁家显卡（实现）都能插；找显卡靠 TCCL 这个「万能转接头」（破坏双亲委派向下找）。",
      tags: ["SPI", "ServiceLoader", "类加载", "Dubbo", "渠道接入"]
    },
    {
      id: "java-basic-33",
      level: 2,
      q: "Unicode、UTF-8、GBK 的关系是什么？游戏协议开发中有哪些必踩的字符编码坑？",
      point: "考察字符集与编码的本质区分，及协议、验签、导表、存储四类编码实战坑。",
      approach: "先给「Unicode 是字符集、UTF-8/GBK 是编码方案」总纲，讲三个长度各说各话这一核心坑，再按协议截断、验签不一致、Excel 乱码、utf8mb4 四类事故展开——用事故驱动回答最有说服力。",
      a: "核心结论：Unicode 是字符集（给每个字符编号的码点表），UTF-8/UTF-16/GBK 是编码方案（码点 → 字节）；Java 内部 String 用 UTF-16，出 JVM 做 IO 才涉及编码转换。\n1. UTF-8：变长 1~4 字节，ASCII 兼容，中文 3 字节——网络传输事实标准。\n2. GBK：中文 2 字节，Windows 简体中文默认——国服老系统、策划 Excel 导出常见，与 UTF-8 互转必乱码。\n3. 三个长度各说各话：String.length() 返回 char 数（UTF-16 code unit），不是字符数更不是字节数；emoji 占 2 个 char、UTF-8 下 4 字节——昵称长度校验用 codePointCount()，存库/发协议按字节算。\n4. new String(bytes) / getBytes() 不指定编码就用平台默认：Windows 服务器 GBK、Linux UTF-8，同一份代码不同环境结果不同——必须显式 StandardCharsets.UTF_8。\n游戏项目真实坑：\n1. 协议定长字符串：客户端按字节截断、服务器按 char 截断，中文昵称被截半个字显示乱码——规范：协议字符串统一 UTF-8 + 字节长度前缀。\n2. 登录 token/签名 getBytes() 未指定编码，渠道侧（GBK 环境生成）与服务器（UTF-8）验签不一致，偶发登录失败，极难复现。\n3. 策划 Excel 是 GBK，导表工具按 UTF-8 读，中文配置全变「锟斤拷」——InputStreamReader 显式指定编码。\n4. MySQL 表 latin1 存 emoji 昵称报错/丢失——全库统一 utf8mb4。",
      followups: [
        { q: "char 能存一个汉字吗？能存 emoji 吗？什么是代理对（surrogate pair）？", a: "char 是 16 位 UTF-16 code unit，BMP 内的常用汉字一个 char 可存；emoji 在 BMP 之外，需两个 char（一高一低代理对）组合表示。" },
        { q: "substring 从中间截断一个 emoji 会怎样？", a: "从代理对中间截断会产生孤半代理（非法字符），显示为「�」；正确做法按 codePoint 边界截断（offsetByCodePoints）。" },
        { q: "UTF-8 带 BOM 会坑在哪里（协议头/JSON 解析）？", a: "UTF-8 BOM（EF BB BF）会让协议首字段多出 3 字节导致解析错位，部分 JSON 解析器直接报错；文本协议与 JSON 文件应保存为「无 BOM」。" }
      ],
      memory: "口诀：「Unicode 是字典，UTF-8 是抄写格式」——同一本字典（码点）不同抄法（字节）；三个长度各说各话：length() 数格子（char），字节数看编码，真字数数 codePoint。",
      tags: ["编码", "UTF-8", "GBK", "游戏协议", "字符集"]
    },
    {
      id: "java-basic-34",
      level: 2,
      q: "Date/SimpleDateFormat 为什么被诟病？java.time 怎么正确使用？游戏开服时间、活动时间怎么处理时区？",
      point: "考察老时间 API 缺陷、java.time 正确用法，及开服/活动时间的时区处理经验。",
      approach: "先点 Date 可变+SDF 线程不安全两宗罪，给 java.time 核心类分工，然后答实践四原则：内部 epoch 毫秒、时区显式 ZoneId、每日重置用 LocalDateTime、防时钟回拨。SDF 静态变量事故细节是加分项。",
      a: "核心结论：Date 可变且 API 反人类（年从 1900 起、月从 0 起），SimpleDateFormat 线程不安全（内部共享 Calendar 状态，并发 parse 数据错乱）；JDK8 的 java.time 全套不可变、线程安全。\n1. 核心类分工：LocalDateTime（无时区墙钟）、ZonedDateTime（带时区）、Instant（机器时间戳）、Duration（时段）/Period（日期间隔）。\n2. 格式化用 DateTimeFormatter——不可变线程安全，可放心定义为 static 常量，替代 SimpleDateFormat。\n3. 老代码兼容：Date ↔ Instant 互转；存储与传输永远用 epoch 毫秒或 UTC。\n游戏项目实践：\n1. 服务器内部一律 epoch 毫秒（Instant/System.currentTimeMillis），跨服、跨时区无歧义，只在显示层转 ZonedDateTime。\n2. 活动时间配置存「运营时区时间 + 时区标识」，计算开启用 ZonedDateTime.now(ZoneId.of(\"Asia/Shanghai\"))，绝不用系统默认时区——海外部署系统时区一变活动就错位，踩过。\n3. 每日重置（凌晨 4 点刷新日常）用 LocalDateTime 与上次重置时间比较，别用毫秒硬算 24 小时，跨天逻辑必错。\n4. 线上事故：运营后台把 SimpleDateFormat 定义成静态变量，并发格式化偶发输出错乱数字，换 DateTimeFormatter 后消失。\n5. 时钟回拨：now() 依赖系统时钟，NTP 校时回拨会导致「时间倒流」，活动结算与排行榜周期要容忍或改用单调时钟补偿。",
      followups: [
        { q: "SimpleDateFormat 并发 parse 具体会发生什么？根因在哪个字段？", a: "parse 时对内部共享的 Calendar 做 clear/set 非原子操作，线程交叉导致字段错乱——解析出错误日期或抛 NumberFormatException；根因是 calendar 成员变量共享。" },
        { q: "LocalDateTime 为什么不适合存数据库做跨服交换数据？", a: "它不带时区信息，同一 LocalDateTime 在不同时区代表不同瞬间；跨服/跨时区交换必须存 epoch 毫秒或带偏移的 OffsetDateTime/ZonedDateTime。" },
        { q: "时钟回拨对业务有什么影响？游戏服怎么防？", a: "NTP 校时可致系统时间倒退，引发活动重复结算、冷却时间异常变长；间隔测量用 System.nanoTime（单调时钟），关键时间点容忍回拨并加告警。" }
      ],
      memory: "口诀：「Date 是漏水的怀表，SimpleDateFormat 是公用放大镜（抢着看会打架），java.time 是一人一块原子钟」——时间对内只认毫秒数，对外才穿时区的衣服。",
      tags: ["时间API", "java.time", "时区", "游戏运营"]
    },
    {
      id: "java-basic-35",
      level: 2,
      q: "record 和 sealed 分别解决什么问题？游戏协议 DTO 和玩家状态机适合用吗？（注意分类边界：语言特性归 Java 基础，虚拟线程归并发）",
      point: "考察新语言特性的定位、局限与落地判断，含与虚拟线程的分类边界意识。",
      approach: "先分述两者解决的问题（不可变数据载体/受限继承）与局限（record 兼容性、sealed 需 JDK17），再评估游戏场景：响应 DTO 适合、池化协议不适合、状态机绝配，最后用「技术选型跟 JDK 版本走」收尾显成熟度。",
      a: "核心结论：record（JDK16 转正）是不可变数据载体的语法糖；sealed（JDK17）是「受限继承」——声明式限定谁能继承/实现。\n1. record Point(int x, int y) {} 一行 = final 类 + 全参构造 + 自动生成 equals/hashCode/toString + 访问器 x()；组件隐式 final、天然不可变，适合 DTO/值对象；可在紧凑构造器里做参数校验。局限：不能继承类、组件不可变，序列化框架（Jackson 2.12+ 支持）和老 ORM 兼容性要验证。\n2. sealed class Shape permits Circle, Rect：编译器强制子类只在 permits 列表内，子类必须 final/sealed/non-sealed 三选一；配合 switch 模式匹配（JDK21 转正）可穷举分支，漏一个分支编译报错。\n3. 分类边界提醒：record/sealed 是语言特性，归 Java 基础；虚拟线程（JDK21）是并发基础设施，面试里归 JUC/并发分类，别混淆。\n游戏场景评估：\n1. GM 后台/购买服的响应 DTO 用 record 很合适——不可变、自动 toString 打日志方便；但请求协议对象要复用池化（我们协议对象 reset 重用降 GC），就不适合 record。\n2. 玩家状态机：sealed interface PlayerState permits Online, InBattle, Offline，配合 switch 穷举，加新状态编译器逼你补全所有分支——比裸 int 常量 + if-else 链安全得多。\n3. 落地前提：团队 JDK 版本——游戏服普遍保守（8/11/17），sealed 要 17、完整模式匹配要 21，技术选型跟版本走，面试说出这句加分。",
      followups: [
        { q: "record 的 equals/hashCode 是怎么生成的？紧凑构造器能做什么？", a: "equals/hashCode 由 invokedynamic（ObjectMethods）按全部组件动态生成；紧凑构造器省略参数列表，可在字段赋值前统一做参数校验与归一化。" },
        { q: "switch 模式匹配 + sealed 是怎么做到编译器穷举检查的？", a: "sealed 的 permits 列表让编译器知晓全部合法子类型，switch 覆盖所有 permits 子类即判定穷尽，漏分支直接编译错误，无需 default 兜底。" },
        { q: "record 和 Lombok @Value 怎么选？", a: "两者都是不可变值类；record 是语言标准、零依赖、语义更强且被框架原生支持。老项目已用 Lombok 保持统一，新项目 JDK16+ 优先 record。" }
      ],
      memory: "口诀：「record 是快递面单（填好不能改，自带打印信息），sealed 是家谱（写明只有这几个后代，外人别来认亲）」。",
      tags: ["record", "sealed", "JDK新特性", "语言演进"]
    },
    {
      id: "java-basic-36",
      level: 3,
      q: "虚拟线程（Virtual Thread）是什么？它能取代游戏服务器现在的 Netty + Disruptor 线程模型吗？",
      point: "考察虚拟线程原理认知，及「能否取代现有线程模型」的架构判断力。",
      approach: "先给定义（M:N 轻量线程、阻塞自动卸载），讲与平台线程的对比和两个坑（pin、扩并发不提速），核心是第三问：不能取代——玩家串行化语义会丢失；再给适用旁路场景与 JDK 门槛。辩证判断是这题的全部价值。",
      a: "核心结论：虚拟线程（JDK21，JEP 444）是 JVM 调度的轻量级线程，载体线程（carrier，平台线程）上可挂载成千上万个虚拟线程，阻塞时自动卸载让出载体——让「一请求一线程」的同步写法获得异步的吞吐量。\n1. 与平台线程对比：平台线程 1:1 映射 OS 线程，MB 级栈、创建贵；虚拟线程 M:N 调度，栈几百字节起步、可创建百万级，Thread.ofVirtual().start(...) 即得。\n2. 调度机制：由 ForkJoinPool FIFO 工作窃取调度，阻塞 IO 时 JVM 把虚拟线程从 carrier 上 unmount，恢复时再 mount（可能换 carrier）——ThreadLocal 存放大对象要慎用。\n3. 两个坑：① synchronized 块内阻塞会「钉住」（pin）carrier 不卸载（JDK24 改进），阻塞段用 ReentrantLock；② 它提升的是并发数不是单任务速度，CPU 密集任务零收益。\n对游戏服线程模型的判断——不能简单取代：\n1. Netty + Disruptor 的核心价值不只是吞吐，而是「玩家维度串行化」：同一玩家的操作固定线程有序执行，从架构上消灭锁和并发 bug；虚拟线程不保证同一 key 的任务同一线程执行，换成每协议一虚拟线程，串行语义丢失，锁全回来了。\n2. 适用场景：IO 密集且无序要求的旁路——GM 后台、日志/BI 上报、渠道支付回调、跨服 HTTP 调用，用虚拟线程替代线程池，同步写法拿高并发。\n3. 落地门槛：JDK21+ 且依赖库兼容（老 Netty/部分 native 库需验证），游戏服升级保守，短期是「补充」不是「取代」。",
      followups: [
        { q: "虚拟线程 pin（钉住）是什么？怎么排查（-Djdk.tracePinnedThreads）？", a: "虚拟线程在 synchronized 块或 native 方法内阻塞时无法从 carrier 卸载，载体被占住影响吞吐。用 -Djdk.tracePinnedThreads=full 打印钉住堆栈，改 ReentrantLock 消除。" },
        { q: "虚拟线程还需要池化吗？为什么官方说不要池化？", a: "不需要。池化是为复用昂贵资源设计的，虚拟线程创建极廉价（栈几百字节起步），池化反而引入竞争与泄漏——用完即弃，每任务一线程。" },
        { q: "虚拟线程下连接池（HikariCP）和信号量还要注意什么？", a: "虚拟线程数可远超连接数，瓶颈转移到连接池——按 DB 真实能力定池大小；下游限流用信号量控制并发，别再靠线程池大小当阀门。" }
      ],
      memory: "类比：平台线程是「正式工位」（一人一座，贵），虚拟线程是「自习室座位牌」——你去打电话（阻塞 IO）就把牌子挂回去，回来随便找个空位继续；但「同一玩家固定座位」这条店规（串行化）它不保证。",
      tags: ["虚拟线程", "JDK21", "线程模型", "游戏服", "深挖"]
    },
    {
      id: "java-basic-37",
      level: 2,
      q: "LinkedHashMap 为什么能当 LRU 缓存用？accessOrder 和 removeEldestEntry 怎么用？游戏服里哪里适合？",
      point: "考察 LinkedHashMap 实现 LRU 的机制细节，及缓存选型的演进视野。",
      approach: "先给双向链表+accessOrder+removeEldestEntry 三件套机制，给模板代码，点名线程不安全与「读也是写」两个坑，再答游戏服两个落点（最近会话、句柄缓存），最后用 LinkedHashMap→Guava→Caffeine 的演进线收尾。",
      a: "核心结论：LinkedHashMap 在 HashMap 基础上加一条双向链表维护顺序，构造传 accessOrder=true 时每次 get/put 都把节点移到链表尾部，重写 removeEldestEntry 返回 true 即可在插入后自动淘汰最久未用的头部节点——十几行实现 LRU。\n1. 两种排序模式：insertionOrder（默认，按插入序）、accessOrder（按访问序，LRU 必需）。\n2. LRU 模板：new LinkedHashMap<K,V>(cap, 0.75f, true){ protected boolean removeEldestEntry(Map.Entry e){ return size() > MAX; } }。\n3. 线程不安全：多线程要 Collections.synchronizedMap 包装或显式加锁；且 accessOrder 模式下 get 会改链表结构，「读」也是写，遍历中 get 可能触发 CME。\n游戏服实践：\n1. 最近会话缓存：玩家最近私聊的 20 人列表，accessOrder 天然淘汰冷数据，新聊天自动置顶。\n2. 协议反射句柄缓存：cmd → Method 句柄，热点协议常驻，容量有界——防止异常 cmd（配表错误/恶意包）把缓存撑爆。\n3. 演进路径：需求变重（过期时间、命中率统计、权重淘汰）就上 Caffeine——LRU 只是它的一种策略；面试能说出 LinkedHashMap → Guava Cache → Caffeine（Window-TinyLFU）的演进，体现缓存选型视野。",
      followups: [
        { q: "accessOrder 模式下为什么 get 也可能抛 ConcurrentModificationException？", a: "accessOrder 下 get 会把节点移到链表尾部，属结构性修改 modCount++；迭代过程中调 get 导致 expectedModCount 不一致，抛 CME。" },
        { q: "TreeMap 和 LinkedHashMap 的「序」有什么区别？", a: "TreeMap 按 key 的比较结果排序（大小序），LinkedHashMap 按插入或访问时间排序（时序）——一个看大小，一个看先后。" },
        { q: "Caffeine 的 Window-TinyLFU 比 LRU 强在哪里？", a: "LRU 只看新近性，突发扫描流量会污染缓存；TinyLFU 用频率草图（CountMin）+ 时间窗综合评估准入，抗扫描污染、命中率更高。" }
      ],
      memory: "口诀：「LinkedHashMap 是排队打卡」——accessOrder 下谁被点名（get/put）就排到队尾，队首是最久没被点名的；removeEldestEntry 就是开除队首的 HR。",
      tags: ["LinkedHashMap", "LRU", "缓存", "集合", "游戏服"]
    }
  ]
};
