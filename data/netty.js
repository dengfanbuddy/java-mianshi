window.QB = window.QB || {};
window.QB["netty"] = {
  id: "netty",
  name: "Netty 与网络编程",
  icon: "🌐",
  desc: "游戏服务器的长连接基石：重点复习 IO 模型、Netty 线程模型、Pipeline、ByteBuf、粘包拆包、心跳与内存泄漏，并结合长连接网关、自定义协议、登录服连接管理等实战场景作答。",
  questions: [
    {
      id: "netty-01",
      level: 1,
      q: "BIO、NIO、AIO 有什么区别？为什么游戏服务器几乎不用 BIO？",
      a: "核心结论：三者的本质区别在于「等待数据就绪」和「读写数据」两个阶段是否阻塞线程。\n1. BIO（阻塞 IO）：accept 和 read 都阻塞，一个连接必须配一个线程。连接上万时线程爆炸，上下文切换把 CPU 吃光——游戏长连接网关动辄几万在线，BIO 完全不可行。\n2. NIO（非阻塞 IO）：基于多路复用（select/poll/epoll），一个线程通过 Selector 轮询管理成千上万个 Channel，数据就绪才触发读写，线程模型从「连接数驱动」变成「事件驱动」。\n3. AIO（异步 IO）：读写操作由操作系统完成后回调通知（Proactor 模式），连 read 调用本身都不阻塞。但 Linux 上 AIO 底层仍是 epoll 模拟，性能没有质变，Netty 在 Linux 下用 NIO/epoll 反而更快，所以 Netty 放弃了 AIO 实现。\n4. 游戏服务器场景：长连接、小包高频、并发大，NIO 事件驱动模型是最优解，这也是 Netty/Mina 成为游戏服标配的原因。",
      point: "考察对三种 IO 模型阻塞本质的理解，而非背概念，重点是能映射到游戏长连接场景。",
      approach: "先一句话点出区别在「等数据」和「读写」两阶段是否阻塞，再按 BIO/NIO/AIO 顺序各讲线程模型，最后落到游戏服为何选 NIO。别只背定义，主动提 epoll 和 Netty 放弃 AIO 的原因，展示深度。",
      followups: [
        {q: "select、poll、epoll 的区别是什么？epoll 为什么能支撑百万连接？", a: "select 有 1024 上限且每次全量拷贝轮询 O(n)；poll 去掉上限仍 O(n)；epoll 用红黑树管理 fd、就绪链表回调收集，O(1) 拿就绪事件，配合 ET 模式减少唤醒，故能撑百万连接。"},
        {q: "既然 NIO 不阻塞，为什么 Netty 里还要有 boss 和 worker 两组线程？", a: "单线程虽能管连接，但 accept 与海量读写全压一线程成瓶颈；boss 专职 accept、worker 分管连接读写，主从 Reactor 吃满多核，也隔离了接入抖动对存量连接的影响。"},
        {q: "你了解过 io_uring 吗？它相比 epoll 解决了什么问题？", a: "io_uring 是 Linux 5.1+ 的真异步 IO，用共享环形队列提交和收割结果，消除 epoll 的反复系统调用与「伪异步」问题；但 Netty 生态支持尚新，生产落地需谨慎评估。"}
      ],
      memory: "类比餐厅：BIO=每个客人配一个服务员全程站着等；NIO=一个服务员巡台，谁举手服务谁；AIO=客人扫码下单，菜好了厨房直接送。游戏服客人多、翻台快，只能选巡台的。",
      tags: ["IO模型", "BIO", "NIO", "AIO", "基础"]
    },
    {
      id: "netty-02",
      level: 1,
      q: "讲讲 Reactor 线程模型，Netty 用的是哪一种？",
      a: "核心结论：Reactor 是「I/O 多路复用 + 线程池」的事件分发模型，Netty 用的是主从多线程 Reactor（Multi-Reactor 多线程版）。\n三种形态：\n1. 单线程 Reactor：一个线程既 accept 又处理所有连接读写和业务。实现简单，但一个慢业务拖死全部连接，无法利用多核。\n2. 单 Reactor 多线程：Reactor 一个线程负责 accept + 读写事件分发，业务处理丢给线程池。瓶颈在单 Reactor 处理所有连接的 I/O。\n3. 主从 Reactor 多线程（Netty 采用）：MainReactor（boss）只负责 accept 新连接，把 Channel 注册到 SubReactor（worker）上；多个 SubReactor 各自负责一组连接的读写。每个 Reactor 对应一个 EventLoop。\n游戏服映射：boss 线程就像登录服的「接待台」只管接入，worker 线程是各个「包间服务员」，玩家连接的协议收发都由固定的 worker 负责，天然避免了同一条连接的并发问题。",
      point: "考察 Reactor 三种形态的演进逻辑，以及 Netty 主从模型与游戏服线程分工的对应。",
      approach: "先给结论「Netty 用主从多线程 Reactor」，再按单线程→单 Reactor 多线程→主从的演进讲每步解决了什么瓶颈，用 boss=接待台、worker=包间服务员映射项目。结尾主动引出「Channel 绑定单 EventLoop 免锁」这个加分点。",
      followups: [
        {q: "Netty 里业务逻辑应该跑在 EventLoop 上还是丢到业务线程池？为什么？", a: "轻量逻辑（解码、路由）可跑 EventLoop；任何阻塞或重计算（DB/Redis/复杂结算）必须丢业务线程池，否则一个慢操作会拖垮该 EventLoop 上的几千条连接。"},
        {q: "一条 Channel 会被多个 EventLoop 处理吗？这带来了什么好处？", a: "不会。注册时绑定且终身固定，同一连接的所有事件由同一线程串行处理，天然无并发竞争，游戏服 I/O 层因此可以免锁编程。"},
        {q: "Proactor 模式和 Reactor 模式的区别？", a: "Reactor 是「就绪通知、自己读写」的同步非阻塞；Proactor 是「OS 完成读写后回调」的真异步。Linux 缺成熟 Proactor 支撑，故 Netty 走 Reactor。"}
      ],
      memory: "主从 Reactor = 酒店大堂：前台（boss）只办入住，办完好把房卡分给楼层管家（worker），管家全程服务到底，不会中途换人。",
      tags: ["Reactor", "线程模型", "基础"]
    },
    {
      id: "netty-03",
      level: 1,
      q: "你们游戏服务器为什么选 Netty 做长连接网关，而不是原生 NIO 或 Tomcat？（结合项目经历）",
      a: "核心结论：Netty 在原生 NIO 之上封装了易用的 API、成熟的线程模型和开箱即用的编解码器，是游戏长连接网关的事实标准。\n结合我的 merge 类游戏项目：\n1. 为什么不原生 NIO：原生 JDK NIO 的 Selector/SelectionKey API 晦涩难用，要自己处理半包读写、OP 事件切换，还有臭名昭著的 epoll 空轮询 bug（CPU 100%），Netty 已在内部重建 Selector 规避。自己造轮子成本高、稳定性没保障。\n2. 为什么不用 Tomcat/Servlet：Tomcat 是「请求-响应」短连接模型，一个请求绑定一个工作线程（BIO/NIO 连接器本质还是线程池模型），无法支撑几万玩家常驻长连接，也没有服务端主动推送的能力——而游戏大量逻辑（如其他玩家操作、邮件、GM 踢人）都是服务端主动下发。\n3. Netty 带来的实际收益：ChannelPipeline 让我们把「解码→协议分发→业务→编码」拆成独立 Handler，配合我们自研的协议生成工具，新增协议只需生成类+注册 Handler；IdleStateHandler 直接解决心跳；ByteBuf 池化减少了高频小包下的 GC 压力。\n4. 网关角色：游戏服作为 TCP 网关维持玩家连接，收包后解码出协议号，投递到 Disruptor 队列由业务线程消费，I/O 与业务彻底解耦。",
      point: "考察技术选型论证能力：能否从协议模型、线程模型、生态三维度说明 Netty 的必然性。",
      approach: "结构用排除法：先定调 Netty 是游戏长连接网关事实标准，再讲原生 NIO 的 API 难用与 epoll 空轮询 bug、Tomcat 请求-响应模型无推送，最后落到自己项目 Pipeline/心跳/ByteBuf 的实际收益。必须结合项目细节，空谈概念会露怯。",
      followups: [
        {q: "你们的网关层是单独部署还是和游戏服在一起？拆分的考量是什么？", a: "大连接量时独立部署网关层，可水平扩缩、专注承载连接，业务服专注逻辑、独立发布；小体量合并部署省运维。考量点：连接规模、发布独立性、故障隔离。"},
        {q: "Netty 相比 Mina 的优势是什么？", a: "同一作者，Netty 是重构升级版：API 更现代、性能更高、社区活跃、文档与生态完善；Mina 已基本停止演进，新项目无脑选 Netty。"},
        {q: "如果让你用 WebSocket 重新做这套网关，协议栈会怎么设计？", a: "HTTP 握手升级到 WS + WSS 加密，二进制帧承载原有「长度+协议号+body」协议，业务层零改动；文本帧仅留调试通道。"}
      ],
      memory: "原生 NIO 是自己烧砖盖房（还有 epoll 空转这个烂地基），Tomcat 是招待所（来一拨客人换一拨），Netty 是精装长租公寓——玩家一住几个月，必须长租。",
      tags: ["游戏实战", "网关", "Netty选型"]
    },
    {
      id: "netty-04",
      level: 1,
      q: "Netty 的 bossGroup 和 workerGroup 分别做什么？线程数怎么配？",
      a: "核心结论：bossGroup 只负责 accept 新连接，workerGroup 负责已接入连接的 I/O 读写，两组都是 EventLoopGroup。\n1. bossGroup：内部每个 EventLoop 绑定 ServerSocketChannel，轮询 OP_ACCEPT 事件，accept 出的 SocketChannel 以「轮询（默认）」策略注册到 workerGroup 的某个 EventLoop 上，之后该连接生命周期内只由这个 EventLoop 服务。一般 1 个线程就够（1 个监听端口）。\n2. workerGroup：默认线程数 = CPU 核数 × 2（NettyRuntime.availableProcessors() * 2）。负责 OP_READ/OP_WRITE 事件处理、执行 ChannelPipeline、以及用户提交的普通任务和定时任务。\n3. 线程数配置经验：\n   - 纯 I/O 转发型网关（协议解析后直接转发），默认核数×2 即可；\n   - 若 Handler 里有轻量业务（如我们游戏服的协议号路由），保持默认，切勿在 EventLoop 里做 DB/Redis 等阻塞操作；\n   - 阻塞业务必须丢给独立的业务线程池（如我们用 Disruptor 的 RingBuffer 做交接），否则一个慢 SQL 会拖垮该 EventLoop 上的几千条连接。\n4. 注意：EventLoop 同时承担 I/O 事件、普通任务、定时任务三类工作，任何一类耗时都会挤压另外两类——这是线上排查延迟毛刺时首先要怀疑的点。",
      point: "考察两组线程职责边界与配置经验，重点是「EventLoop 不可阻塞」的红线意识。",
      approach: "先给职责结论与默认线程数依据，重点讲配置经验：什么场景保持默认、何时必须拆业务线程池，结尾点出 EventLoop 一肩挑 I/O/任务/定时三类的排查视角。别只背「核数×2」，要讲出阻塞雪崩的后果。",
      followups: [
        {q: "workerGroup 默认为什么是核数×2 而不是×1？", a: "官方经验值：I/O 线程大部分时间在等事件，×2 保证部分线程跑任务时仍有线程响应 I/O；纯 I/O 场景×1 也常够，最终以压测为准。"},
        {q: "Channel 和 EventLoop 的绑定关系是怎么建立的？能换绑吗？", a: "accept 时由 workerGroup 的 next() 轮询选定并注册，终身绑定，官方不支持换绑——换绑会破坏单线程串行假设，引入并发问题。"},
        {q: "EventLoop 的任务队列满了会怎样？如何监控？", a: "默认无界队列不会拒绝只会积压，表现为回包延迟持续上涨直至 OOM；监控 eventLoop.pendingTasks() 与任务耗时分布，超阈值告警并在源头背压降级。"}
      ],
      memory: "boss 是门童（一个就够，只开门），worker 是管家团（核数×2，一人管一层楼），管家绝不亲自下厨（不做阻塞业务），下单给厨房（业务线程池）。",
      tags: ["线程模型", "EventLoop", "基础"]
    },
    {
      id: "netty-05",
      level: 1,
      q: "讲讲 ChannelPipeline 和 ChannelHandler 的机制，入站和出站事件的传播顺序是怎样的？",
      a: "核心结论：Pipeline 是 Handler 的双向链表（责任链模式），入站事件从头到尾传播，出站事件从尾到头传播。\n1. 结构：每个 Channel 创建时绑定一个 ChannelPipeline，内部是 HeadContext ↔ 各 Handler ↔ TailContext 的双向链表。Head 处理底层 I/O（真正的读写、bind），Tail 兜底（释放未处理的消息、打印异常）。\n2. 入站事件（channelRead、channelActive、exceptionCaught 等）：Head → Tail 方向依次经过 ChannelInboundHandler；若不调用 ctx.fireChannelRead()，事件在此 Handler 停止传播。\n3. 出站事件（write、flush、connect、close 等）：Tail → Head 方向逆向经过 ChannelOutboundHandler，最终由 Head 写到 Socket。\n4. 编码/解码的位置：Decoder（如 LengthFieldBasedFrameDecoder、我们的协议解码器）是 InboundHandler 放前面；Encoder 是 OutboundHandler；业务 Handler 放最后面处理解码后的完整协议对象。\n5. 游戏项目实例：我们游戏服的 Pipeline 顺序是：IdleStateHandler（心跳）→ 帧解码器（粘拆包）→ 协议解码器（字节→协议对象）→ 业务分发 Handler（协议号路由，投递 Disruptor）；出站方向是协议编码器 → 加密 Handler（如有）。\n6. 异常处理：exceptionCaught 也按入站方向传播，一般在最后一个 Handler 统一捕获：记日志、回错误码、必要时关连接。",
      point: "考察责任链传播方向的精准理解：入站头到尾、出站尾到头及 fire 的中断语义。",
      approach: "先给结论与 Head/Tail 链表结构，用「入站从头到尾、出站从尾到头」口诀讲传播与中断条件，结合项目 Pipeline 实际顺序举例，再补异常统一兜底。可主动提 ctx 与 channel 写法的传播起点差异加分。",
      followups: [
        {q: "ctx.write() 和 channel.write() 有什么区别？", a: "ctx.write 从当前 Handler 位置逆向出站，channel.write 从尾部走完整条链；前者少走路径性能略好，但放错位置会跳过前面的编码器/加密器。"},
        {q: "一个 Handler 被 @Sharable 注解后可以加到多个 Pipeline，要满足什么条件？", a: "必须无状态：无可变成员变量，因为多 Pipeline、多 EventLoop 会并发共享同一实例；有状态的 Handler 要每条连接 new 一个。"},
        {q: "如何动态地增删 Handler？举一个实际用途。", a: "用 pipeline.addLast/remove 动态调整，Netty 保证切换的线程安全。用途：登录成功后移除未登录限流 Handler、协商加密后插入加密 Handler。"}
      ],
      memory: "Pipeline 像地铁双向轨道：入站是「进站方向」从头坐到尾，出站是「出站方向」从尾坐回头，每站（Handler）可以下车（拦截）也可以继续坐（fire 传递）。",
      tags: ["Pipeline", "ChannelHandler", "基础"]
    },
    {
      id: "netty-06",
      level: 1,
      q: "TCP 粘包和拆包是怎么产生的？Netty 提供了哪些解决方案？",
      a: "核心结论：TCP 是字节流协议，没有消息边界，粘包拆包是「发送方、内核缓冲、接收方」三方共同作用的必然结果，必须由应用层自己界定消息边界。\n产生原因：\n1. 发送方 Nagle 算法把多个小包合并发送（粘包）；\n2. 发送包大于 MSS 被 IP 层分片 / 大于发送缓冲区被拆分（拆包）；\n3. 接收方缓冲区剩余空间不足，一个完整包被分多次读取（拆包）；一次 read 捞走多个包（粘包）。\nNetty 四种解码器对应四种边界划分方案：\n1. FixedLengthFrameDecoder：定长切分，协议简单但浪费带宽；\n2. LineBasedFrameDecoder / DelimiterBasedFrameDecoder：按分隔符（换行/自定义分隔符）切分，body 不能含分隔符，文本协议适用；\n3. LengthFieldBasedFrameDecoder：长度字段法，生产环境主流——我们游戏协议就是「魔数(2B)+长度(4B)+协议号(4B)+body」，用它配合自定义解码器切帧；\n4. 自定义：继承 ByteToMessageDecoder 自己解析。\n关键认知：解码器内部维护累积缓冲区（cumulation），数据不够一个完整包时留在缓冲区等下一批，这就是处理「拆包」的机制；一次读到多个包则循环解码逐个产出，这就是处理「粘包」。",
      point: "考察对 TCP 字节流无边界本质的认知，及四种解码方案的选型判断力。",
      approach: "先归因「TCP 是流协议，边界必须应用层界定」，从发送方/内核/接收方三方讲成因，再按定长/分隔符/长度字段/自定义给方案并指明项目用长度字段法，最后点破解码器靠累积缓冲区处理半包。别把粘包甩锅给 Nagle。",
      followups: [
        {q: "LengthFieldBasedFrameDecoder 的核心参数怎么理解？", a: "maxFrameLength 防恶意大包；lengthFieldOffset 是长度字段起始位置；lengthFieldLength 是其字节数；lengthAdjustment 补偿长度不含头部的差值；initialBytesToStrip 指定解码后剥离的头部字节数。"},
        {q: "关闭 Nagle 算法（TCP_NODELAY）能根治粘包吗？", a: "不能。它只禁止发送方合并小包，接收缓冲区一次读多包、一包分多次读照样发生；粘拆包只能靠应用层协议界定边界。"},
        {q: "UDP 有粘包问题吗？为什么？", a: "没有。UDP 是报文协议，一次 send 对应一次 recv，自带消息边界；代价是不保证可达、不保证顺序。"}
      ],
      memory: "TCP 是水管不是快递柜——水（字节）流成一片分不清哪杯是谁的；长度字段法 = 每瓶水贴上容量标签，收水的人先读标签再舀水，永远不多不少。",
      tags: ["粘包拆包", "TCP", "解码器", "基础"]
    },
    {
      id: "netty-07",
      level: 1,
      q: "游戏客户端和服务器之间的长连接为什么要做心跳？Netty 怎么实现？",
      a: "核心结论：心跳解决两个问题——检测「假死连接」（对端断电/断网时 TCP 本身感知不到）和防止 NAT/运营商回收空闲连接。\n为什么必须做：\n1. TCP 协议层面，如果对端直接拔网线/进程崩溃（非四次挥手），本端连接会一直 ESTABLISHED，服务器白白维持几万个死连接，内存和会话资源被耗尽；\n2. 家用路由和运营商 NAT 会清理长时间无流量的映射表（常见 5~15 分钟），不发包连接就「幽灵断开」；\n3. 游戏业务上还要判断玩家在线状态，用于排行榜、好友状态、GM 在线统计。\nNetty 实现：\n1. IdleStateHandler：三个参数 readerIdleTime、writerIdleTime、allIdleTime（秒），超时触发 IdleStateEvent 事件；\n2. 在业务 Handler 的 userEventTriggered() 里捕获事件：读空闲超阈值（如连续 N 次未收到心跳）→ 判定玩家掉线，走掉线逻辑并关闭 Channel；\n3. 我们 merge 类游戏的做法：客户端每 30 秒发心跳协议，服务端读空闲 90 秒（允许丢 2 次）判定离线，断线后客户端自动重连走登录服的 token 校验恢复会话；\n4. 注意：IdleStateHandler 内部用 EventLoop 的定时任务实现，每条连接一次调度，十万连接下开销可接受，但要避免在回调里做重业务。",
      point: "考察是否理解心跳的双重目的：探假死连接+保 NAT 映射，及参数取舍。",
      approach: "先讲「TCP 感知不到拔网线」这个根因，分协议层（假死）、网络层（NAT 回收）、业务层（在线状态）三层说必要性，再给 IdleStateHandler 实现与项目 30s/90s 参数，强调容忍丢包次数、回调里不做重业务。",
      followups: [
        {q: "心跳间隔设多少合适？设太短或太长各有什么代价？", a: "太短费流量/电量/服务端调度开销；太长发现死连接慢、NAT 映射被回收。移动端常见 30s~4.5min，按 NAT 超时与业务实时性折中。"},
        {q: "你们怎么处理玩家「弱网闪断」后的快速重连和会话恢复？", a: "客户端指数退避自动重连，走登录服重拿 token，服务端校验后从会话快照恢复上下文，同时踢掉旧连接防双在线，玩家基本无感。"},
        {q: "除了 IdleStateHandler，还有哪些保活手段？TCP KeepAlive 为什么不够？", a: "KeepAlive 默认 2 小时才首次探测，远慢于业务容忍度，且穿不透所有中间设备、无业务语义，只能作兜底，应用层心跳不可替代。"}
      ],
      memory: "心跳就是「打卡考勤」：玩家每 30 秒打卡一次，连续三次没打卡（90 秒）就按离职处理——工位（Channel）回收，工牌（会话）注销。",
      tags: ["心跳", "IdleStateHandler", "游戏实战", "基础"]
    },
    {
      id: "netty-08",
      level: 1,
      q: "Netty 的 Channel、EventLoop、ChannelFuture、ChannelHandlerContext 各自是什么角色？",
      a: "核心结论：这四个是 Netty 的「四大件」——Channel 是连接载体，EventLoop 是专属司机，Future 是异步回执，Context 是 Handler 在链表里的「座位牌」。\n1. Channel：网络连接的抽象（NioSocketChannel/NioServerSocketChannel），封装底层 Socket，提供异步的 read/write/close，每条 Channel 有独立的 Pipeline 和属性容器（AttributeKey，我们用它挂玩家会话对象）。\n2. EventLoop：单线程执行器，一个 EventLoop 绑定一个线程，负责多条 Channel 的 I/O 事件和任务队列；Channel 生命周期内只注册到一个 EventLoop，因此同一连接的所有操作天然线程安全、无锁——这是游戏服能在 I/O 层免锁设计的关键。\n3. ChannelFuture：所有 I/O 操作都异步返回 ChannelFuture，通过 addListener 注册回调感知完成/失败，绝不 get() 阻塞等待（会死锁：EventLoop 等待自己执行的任务）。\n4. ChannelHandlerContext：Handler 与 Pipeline 的关联上下文，代表「这个 Handler 在链表里的位置」；ctx.fireChannelRead()/ctx.write() 从当前位置开始传播，channel.write() 从尾部开始——性能敏感场景用 ctx 版本少走半条链表。",
      point: "考察对 Channel/EventLoop/Future/Context 四组件角色边界的体系化理解。",
      approach: "用一句话给四组件各安角色（载体/司机/回执/座位牌），逐个展开并点出关键推论：绑定带来无锁、Future 禁 get、Context 决定传播起点，结合项目 AttributeKey 挂会话举例。要体现懂设计动机而非背 API。",
      followups: [
        {q: "为什么说 Channel 与 EventLoop 的绑定让游戏服 I/O 层可以无锁编程？", a: "Channel 终身绑定单 EventLoop，该连接所有 I/O 事件与任务串行执行，无并发竞争；会话数据挂 AttributeKey 上访问无需加锁。"},
        {q: "在 EventLoop 线程里调用 future.sync()/await() 为什么可能死锁？", a: "sync 会阻塞当前线程等待完成通知，而完成通知必须由本线程执行——自己等自己，永久死锁；正确做法是 addListener 回调。"},
        {q: "AttributeKey 和 ThreadLocal 的区别和使用场景？", a: "AttributeKey 随 Channel 走，跨线程访问同一会话数据安全；ThreadLocal 随线程走，EventLoop 复用线程服务多连接时会串数据，不能用来挂连接态。"}
      ],
      memory: "快递站比喻：Channel=快递车，EventLoop=固定司机（车跟人走不换手），Future=快递单号（凭号查进度，不能堵在分拣中心门口等），Context=工位牌（决定从哪一站继续流转）。",
      tags: ["核心组件", "EventLoop", "ChannelFuture", "基础"]
    },
    {
      id: "netty-09",
      level: 1,
      q: "Netty 里 ByteBuf 相比 JDK 的 ByteBuffer 有哪些改进？",
      a: "核心结论：ByteBuf 解决了 ByteBuffer 单指针、API 难用、无法动态扩容三大痛点，并引入引用计数和池化。\n1. 双指针：ByteBuffer 只有一个 position，读写切换要 flip()（最常见的 bug 来源）；ByteBuf 用 readerIndex + writerIndex 两个指针，读写互不干扰，可读字节数 = writerIndex - readerIndex。\n2. 动态扩容：ByteBuffer 容量固定，写满要手动处理；ByteBuf 类似 ArrayList 自动扩容（上限 maxCapacity）。\n3. 引用计数：继承 ReferenceCounted，retain()/release() 手动管理生命周期，配合池化复用堆外内存，减少 GC——游戏服高频小包场景下这是 GC 优化的核心。\n4. 池化分配器：PooledByteBufAllocator（4.1 后默认）基于 jemalloc 思想的内存池，复用直接内存，避免频繁的 malloc/free 和 DirectByteBuffer 创建开销（后者创建还要等 Cleaner 回收）。\n5. 丰富的派生视图：slice()（共享子区域）、duplicate()、CompositeByteBuf（逻辑合并多个 Buf 不拷贝），为零拷贝提供基础。\n6. 内存分类：堆内存（HeapBuf，GC 管理快但 I/O 要先拷贝到堆外）vs 直接内存（DirectBuf，I/O 零拷贝但分配贵，适合配合池化）。",
      point: "考察 ByteBuf 改进点的系统掌握：双指针、扩容、引用计数、池化四大件。",
      approach: "先总述解决 ByteBuffer 三大痛点，按双指针/扩容/引用计数/池化/派生视图逐条讲，每条点出收益场景（池化对高频小包的 GC 优化），再补堆内 vs 堆外取舍。别漏引用计数，这是与 JDK 最本质的设计差异。",
      followups: [
        {q: "堆外内存（DirectByteBuffer）的回收机制是什么？为什么 Netty 要自己管？", a: "JDK 靠 Cleaner 挂虚引用等 GC 触发回收，时机不可控易堆外 OOM；Netty 用引用计数手动管理+池化复用，把回收主动权拿回自己手里。"},
        {q: "什么时候用 Unpooled？什么时候必须用池化？", a: "低频、一次性的编解码或工具场景用 Unpooled 省事；高频 I/O 主链路必须池化，否则直接内存的分配回收开销会成为瓶颈。"},
        {q: "readerIndex 之前的字节什么时候被回收？discardReadBytes() 的代价是什么？", a: "已读空间默认不立即回收；discardReadBytes 把未读数据前移腾空间，代价是一次内存拷贝，频繁调用反而伤性能，要控制触发频率。"}
      ],
      memory: "ByteBuffer 是单指针翻页书，读完要 flip 才能回头；ByteBuf 是两根书签的书（读书签+写书签），还能加页（扩容）、撕页共享（slice）、多本合订（Composite）。",
      tags: ["ByteBuf", "ByteBuffer", "基础"]
    },
    {
      id: "netty-10",
      level: 2,
      q: "你们游戏服的自定义协议是怎么设计的？（魔数+长度+协议号）解码器怎么实现？为什么这么设计？",
      a: "核心结论：「魔数+长度+协议号+body」是游戏私有协议的经典结构：魔数防错连、长度解决粘拆包、协议号做业务路由。\n我们的协议帧格式：| magic(2B) | length(4B) | protocolId(4B) | body(NB) |（可选 checksum）。\n各字段的作用：\n1. 魔数（magic）：快速识别非法连接——端口被扫、HTTP 请求误连、版本不匹配的旧客户端，第一个字节对不上直接关连接，省资源也防攻击；\n2. 长度（length）：body 长度，交给 LengthFieldBasedFrameDecoder 切帧，彻底解决粘包拆包；同时设 maxFrameLength 上限（如 1MB）防恶意大包打爆内存；\n3. 协议号（protocolId）：业务路由键，解码后根据协议号反射/查表找到对应的协议类和处理器——我们自研的协议生成工具根据协议定义表自动生成 Java 类和「协议号→处理器」的注册表，策划加协议只需改表；\n4. body：序列化后的业务数据（二进制自研序列化/Protobuf）。\n解码实现：继承 ByteToMessageDecoder 或组合 LengthFieldBasedFrameDecoder + MessageToMessageDecoder。核心逻辑：in.readableBytes() < 头部长度时 return 等数据（自动处理拆包）；校验魔数；读长度预检查；标记 readerIndex（markReaderIndex）不够时 reset；够则读出协议号和 body，反序列化为协议对象加入 out 列表传给下一个 Handler。\n为什么不用 HTTP/JSON：长连接小包高频，文本协议体积大 2~3 倍、解析耗 CPU；私有二进制协议带宽和解析成本都最优，且协议号路由比 URL 路由快。",
      point: "考察私有协议设计能力：每个字段的存在理由都要讲清，并能落地解码细节。",
      approach: "先给帧格式，逐字段讲设计动机（魔数防错连、长度切帧+防大包、协议号路由），再讲解码器实现要点（mark/reset、不够就 return），收尾对比 HTTP/JSON 说明私有二进制优势。全程结合协议生成工具经验最出彩。",
      followups: [
        {q: "如果 length 字段被篡改成 2GB，你的解码器怎么防住？", a: "读到 length 先校验上限（maxFrameLength）与可读字节，超限直接关闭连接并记录日志；绝不在校验前按 length 分配缓冲区。"},
        {q: "协议需要向下兼容（旧客户端连新服）时怎么设计？", a: "协议号版本化、新协议用新号；body 用 Protobuf 这类向前兼容的序列化，新字段旧端自动忽略；魔数可带版本位拒绝过旧客户端。"},
        {q: "你们的协议生成工具是怎么工作的？协议号冲突怎么管理？", a: "在定义表写协议结构，工具生成实体类+编解码+协议号注册表；协议号按模块号段分配，生成时全表查重，冲突编译期直接报错。"}
      ],
      memory: "协议帧四件套 = 快递包裹：魔数是快递公司 LOGO（认错公司直接拒收）、长度是包裹尺寸（知道多大才搬得动）、协议号是收件工位（送到哪个部门）、body 是货物本身。",
      tags: ["自定义协议", "解码器", "游戏实战"]
    },
    {
      id: "netty-11",
      level: 2,
      q: "什么是零拷贝？Netty 中有哪些零拷贝的体现？",
      a: "核心结论：零拷贝的本质是「减少数据在内核态与用户态之间、以及内存各区域之间的拷贝次数」，Netty 在框架层做了多种逻辑零拷贝。\nOS 层面的零拷贝（铺垫）：传统 read+write 要 4 次拷贝、4 次上下文切换；sendfile/mmap 把文件数据直接在内核态送到 Socket，Netty 的 FileRegion（DefaultFileRegion + transferTo）就用 sendfile，适合大文件传输（GM 后台下载日志可用）。\nNetty 框架层的零拷贝（游戏服更常用）：\n1. CompositeByteBuf：把多个 ByteBuf 逻辑合并为一个，不真正拷贝——比如「协议头 Buf + body Buf」合并下发，广播同一条消息给几万玩家时 body 只存一份，每个玩家只组合自己的头；\n2. slice()/duplicate()/retainedSlice()：派生视图共享底层内存，只改读写索引，解码时切出 body 给业务层不产生拷贝；\n3. Unpooled.wrappedBuffer()：把多个 byte[] 包装成一个 Buf 而非合并拷贝；\n4. 直接内存 + 池化：I/O 直接读写堆外内存，避免 JVM 堆 ↔ 堆外的一次拷贝（Socket 只能读堆外内存，堆内 Buf 写 Socket 前会被拷贝一次）；\n5. 实战案例：我们 MMORPG 的状态同步广播，同一份战斗状态 body 用 CompositeByteBuf 复用，千人同屏时避免了上千次 memcpy 和上千份临时对象的 GC 压力。\n面试加分点：零拷贝不是「零次拷贝」，是「能不拷就不拷」的优化思想，要结合具体场景说清省了哪次拷贝。",
      point: "考察对零拷贝「减少拷贝次数」本质的理解，及 Netty 多种实现的识别。",
      approach: "先纠正误区「零拷贝≠零次拷贝，是能省则省」，用 OS 层 sendfile 铺垫，重点讲 Netty 层四种：Composite/slice/wrappedBuffer/直接内存，用广播共享 body 的项目案例收尾。每种都要说清省的是哪次拷贝。",
      followups: [
        {q: "sendfile 和 mmap 两种零拷贝的区别和适用场景？", a: "sendfile 数据全程内核态直达 Socket，适合大文件原样转发；mmap 映射到用户态可读写加工，适合需修改内容的场景。Netty FileRegion 用前者。"},
        {q: "广播共享 body 时引用计数怎么管理？连接断开谁来 release？", a: "每发一个 Channel 前 retain 一次，各 Channel 写完由出站缓冲 release；断开的 Channel 未写完部分由 Netty 关闭时统一释放，计数归零才真正回收。"},
        {q: "堆内 ByteBuf 写 Socket 时 Netty 内部做了什么？", a: "Socket 只认堆外内存，Netty 会先把堆内数据拷贝到临时直接缓冲区再写——所以高频链路应直接用直接内存+池化，省掉这次拷贝。"}
      ],
      memory: "零拷贝 = 能看原件就别复印：slice 是「翻到第 X 页看」而不是抄写，Composite 是「两本书夹一起读」而不是合印，sendfile 是「档案室直接寄出」而不是先领回工位再寄。",
      tags: ["零拷贝", "ByteBuf", "性能优化", "游戏实战"]
    },
    {
      id: "netty-12",
      level: 2,
      q: "ByteToMessageDecoder 的解码流程是怎样的？写自定义解码器要注意哪些坑？",
      a: "核心结论：ByteToMessageDecoder 用累积缓冲区（cumulation）承接「可能不完整」的字节流，子类在 decode() 里循环产出完整消息，数据不够就 return 等下一批。\n解码流程：\n1. channelRead 收到 ByteBuf → 追加到内部 cumulation（默认 MERGE_CUMULATOR，memcpy 合并）；\n2. 循环调用子类 decode(ctx, in, out)：\n   - 数据不够：return，保留剩余字节等下次；\n   - 解出一个消息：放入 out，继续循环（自动处理粘包：一次读到多个包逐个产出）；\n3. 循环结束后 fireChannelRead 把 out 里的消息逐个传给下一个 Handler。\n自定义解码器的坑（游戏项目血泪经验）：\n1. 必须 markReaderIndex/resetReaderIndex：读到一半发现数据不够，要 reset 回起点，否则下次从错误位置继续读，协议全乱；\n2. decode 内绝不做阻塞操作：它跑在 EventLoop 上；\n3. 防恶意长度：读 length 后先校验上限再分配/读取，否则一个伪造的 2GB length 会让 cumulation 无限膨胀（OOM）；\n4. 解码出的消息要交给后续 Handler release，或确保 final release——引用计数泄漏排查的第一现场；\n5. ByteBuf 不能缓存到 decode 外面：cumulation 会被复用/释放，要留存必须 copy() 或 retainedDuplicate()；\n6. ReplayingDecoder 慎用：它用「读不够就抛 Error 重放」简化代码，但性能差、有些操作不支持（如 ByteBufList），生产环境老老实实用 ByteToMessageDecoder。",
      point: "考察累积缓冲区解码循环机制的理解，及手写解码器的工程避坑能力。",
      approach: "先讲 cumulation+循环 decode 的整体流程，说明 return 等数据与循环产出如何分别对应拆包粘包，再重点列坑：mark/reset、防恶意长度、引用计数交接、禁缓存 Buf。坑要带项目教训讲，比背流程更打动人。",
      followups: [
        {q: "MERGE_CUMULATOR 和 COMPOSITE_CUMULATOR 两种累积策略的区别？", a: "MERGE 每次 memcpy 合并，简单但有拷贝开销；COMPOSITE 用 CompositeByteBuf 零拷贝拼接，但缓冲可能膨胀成大量分片。各有取舍，默认 MERGE。"},
        {q: "decode() return 后，新数据到达是从头重新解码整个缓冲区吗？", a: "不是。Netty 保持 cumulation 的 readerIndex 位置，新数据追加后从未消费处继续；子类靠 mark/reset 保证「数据不够」时语义正确。"},
        {q: "你们协议解码后是怎么路由到具体业务处理器的？", a: "解出协议号后查「协议号→处理器」注册表（协议生成工具产出），包装成事件投递 Disruptor，由业务线程按玩家 ID 定序消费。"}
      ],
      memory: "解码器像流水线质检员：传送带（cumulation）上的货不够一整箱就按兵不动（return），够一箱就封箱出货（out.add），封完接着看还能不能再封一箱（循环），永远站在原地等货，绝不追传送带。",
      tags: ["解码器", "ByteToMessageDecoder", "进阶"]
    },
    {
      id: "netty-13",
      level: 2,
      q: "你们游戏服的完整心跳保活机制是怎么设计的？包括断线检测、重连、会话恢复。（结合项目经历）",
      a: "核心结论：心跳不是单独一个 Handler，而是「检测—判定—清理—恢复」的完整闭环，要联动业务层的玩家会话。\n我们的设计（merge 类游戏，登录服+游戏服架构）：\n1. 检测层：游戏服 Pipeline 首个 Handler 是 IdleStateHandler(readIdle=90s)，客户端每 30s 发心跳包，容忍连续丢 2 次；\n2. 判定层：userEventTriggered 收到读空闲事件 → 判定掉线，先移除 Channel 与玩家 ID 的绑定（防重复登录冲突），再触发业务层 onPlayerOffline（保存数据、清除在线标记、通知好友），最后 ctx.close()；\n3. 主动清理兜底：极端情况下 EventLoop 假死导致心跳事件不触发，登录服有全量连接巡检任务，对最后活跃时间超阈值的连接强杀；\n4. 重连与会话恢复：客户端断线后走登录服重新拿 token → 连游戏服 → 服务端校验 token 并从会话快照恢复玩家上下文（场景位置、未结算状态），玩家无感知；\n5. 重复登录处理：新连接登录成功时检查旧 Channel 是否存活，存活则给旧连接推「异地登录」协议并踢下线，保证同账号唯一在线；\n6. 移动端特殊考量：弱网环境心跳超时阈值放宽 + 客户端指数退避重连（1s、2s、4s…上限 30s），避免全网玩家同时重连造成「惊群」冲击登录服。",
      point: "考察心跳体系化设计：检测、判定、清理、恢复闭环与业务会话的联动。",
      approach: "强调「心跳不是 Handler 是闭环」，按检测/判定/清理/恢复四段式展开，每段给项目参数（90s 阈值、token 恢复），补兜底巡检与移动端惊群处理。突出「少一步就是线上事故」的工程意识，别停留在 IdleStateHandler 用法。",
      followups: [
        {q: "心跳包要加密/校验吗？伪造心跳包刷在线时长怎么防？", a: "心跳包携带会话 token 或序号校验，未登录/非法会话的心跳直接断连；在线时长由服务端按会话存续统计，不采信客户端报数。"},
        {q: "「惊群重连」你们实际遇到过吗？登录服怎么抗压？", a: "客户端随机抖动+指数退避错开洪峰；登录服限流排队+快速签发令牌，游戏服多节点分流，并以压测验证万级同时重连场景。"},
        {q: "TCP KeepAlive 开启后还有必要做应用层心跳吗？", a: "有必要。KeepAlive 默认 2 小时首探、穿不透所有 NAT，且无业务语义无法驱动掉线结算；只能当兜底，应用层心跳不可替代。"}
      ],
      memory: "心跳闭环四步曲：点名（IdleState 检测）→ 除名（解绑+掉线逻辑）→ 销户（close 回收资源）→ 补办（token 重连恢复会话），少一步都是线上事故。",
      tags: ["心跳", "断线重连", "游戏实战"]
    },
    {
      id: "netty-14",
      level: 2,
      q: "登录服/网关如何做连接管理？（Channel 与用户绑定、踢人、广播）Netty 提供了什么工具？（结合项目经历）",
      a: "核心结论：连接管理的核心是两个映射关系（Channel↔玩家ID）加一个广播容器（ChannelGroup），全部要考虑并发安全。\n我们的实现：\n1. 双向映射：用 ConcurrentHashMap<Long, Channel>（玩家ID→Channel）做正向查找（给指定玩家推消息），Channel 上用 AttributeKey<Long> 挂玩家ID做反向查找（连接断开时知道是谁掉了）；为什么两个都要：断连回调里只有 Channel，推送接口只有玩家ID；\n2. 登录绑定时机：连接建立（channelActive）时不绑定，等登录协议校验通过才建立映射——未登录连接单独限流（每连接每秒最多 N 个包）防刷；\n3. 踢人/重复登录：GM 踢人或异地登录时，从 map 里 remove 拿到旧 Channel，先推「被踢」协议（客户端要弹窗提示），延迟几百毫秒再 close，避免协议包和 FIN 粘在一起客户端收不到；\n4. ChannelGroup：Netty 自带的 DefaultChannelGroup，本质是 ConcurrentMap 包装的 Channel 集合，支持批量 writeAndFlush（自动匹配各 Channel 的 EventLoop），channelInactive 时自动移除——我们用它做全服公告广播和活动推送；\n5. 断连清理：channelInactive 里用 AttributeKey 拿到玩家ID → 从 map 按「值相等才删」（remove(k, v)，防并发下误删新连接的映射）→ 触发掉线业务；\n6. 登录服的定位：只做认证+分发（校验渠道 token、发游戏服地址和会话票据），不持有长连接，玩家拿到票据后连游戏服，这样登录服可以随时重启不影响在线玩家——这也是我们支持热更新/平滑部署的关键设计。",
      point: "考察连接管理的并发设计：双向映射、并发删除、广播容器与踢人时序。",
      approach: "先抽象「两个映射+一个广播容器」模型，讲清为什么需要双向（回调只有 Channel、推送只有 ID），重点讲 remove(k,v) 防误删、踢人先推协议延迟关连接等细节，收尾讲登录服无连接化支撑平滑部署。细节越具体越可信。",
      followups: [
        {q: "remove(k, v) 为什么要带值比较？不带会出什么并发 bug？", a: "断连清理与重新登录并发时，旧连接的 channelInactive 可能删掉新连接刚建立的映射；带值比较确保「只删自己那条」，防止误删。"},
        {q: "ChannelGroup 广播 10 万连接时会有什么问题？怎么优化？", a: "遍历写产生海量任务与写风暴，慢连接顶高水位；优化：分片分批+间隔发送、isWritable 过滤降级、CompositeByteBuf 共享 body 减拷贝。"},
        {q: "GM 后台（RuoYi 项目）是怎么把「踢人」指令传到游戏服的？", a: "GM 后台经内网 RPC/Kafka 发指令到游戏服，游戏服校验来源后查玩家 ID 映射，先推被踢协议，延迟几百毫秒再关闭旧 Channel。"}
      ],
      memory: "连接管理 = 小区门禁系统：花名册（ID→Channel 映射）查得到房号，门禁卡（AttributeKey）刷得出业主，广播喇叭（ChannelGroup）全楼喊话，退房（断连）必须同时注销花名册和门禁卡。",
      tags: ["连接管理", "ChannelGroup", "游戏实战"]
    },
    {
      id: "netty-15",
      level: 2,
      q: "游戏服务器选序列化协议时怎么权衡？Protobuf、JSON、Kryo、自研二进制各自适合什么场景？（结合协议生成工具经验）",
      a: "核心结论：选型看四个维度——体积、解析速度、跨语言/兼容性、开发效率，游戏长连接首选 Protobuf 或自研二进制。\n对比：\n1. JSON：可读性最好、调试方便，但体积大（字段名重复）、解析慢。适合 GM 后台、运营接口、日志——我们 GM 后台（RuoYi）对 Web 前端就是 JSON/HTTP，和玩家协议完全两套；\n2. Protobuf：二进制、体积小（varint 压缩+字段编号代替字段名）、解析快、强 schema 跨语言、天然支持向后兼容（新增字段旧代码不炸）。缺点是要维护 .proto 和生成代码。适合玩家协议主链路；\n3. Kryo：Java 专属、几乎零配置、体积小速度快，但没有跨语言能力、版本兼容弱（类结构变了老数据反序列化可能炸）。适合服务器内部 RPC、Redis 缓存对象、战斗服↔功能服通信；\n4. 自研二进制：极致定制（我们卡牌项目早期就是：按字段定义表生成读写代码），性能天花板最高，但维护成本随协议数量指数上升。\n我们的实践与演进：玩家协议从自研二进制演进到类 Protobuf 方案，关键就是「协议生成工具」——策划/程序在 Excel/定义表里写协议结构，工具一键生成 Java 实体类、编解码代码和协议号注册表，消除手写序列化的低级 bug，这是导表工具链里复用度最高的一个工具。\n决策口诀：对外玩家协议要稳（Protobuf/自研二进制），对 Web 要人看得懂（JSON），服内 RPC 要省事（Kryo/Dubbo 默认 Hessian）。",
      point: "考察序列化选型方法论：体积、速度、兼容性、效率四维权衡与场景匹配。",
      approach: "先立四维评估框架，按 JSON/Protobuf/Kryo/自研逐一给定位（对 Web/玩家协议/服内 RPC/极致定制），用协议生成工具的演进故事展示落地深度，给决策口诀收尾。避免罗列优缺点，要体现「什么场景选什么」的判断力。",
      followups: [
        {q: "Protobuf 为什么比 JSON 小？varint 和 tag 编码的原理？", a: "字段用「编号+类型」tag 代替字段名，整数 varint 变长编码小值只占 1 字节；省掉字段名文本与分隔符，所以体积远小于 JSON。"},
        {q: "Protobuf 协议演进时（加字段、删字段、改类型）各有什么坑？", a: "改编号=数据错乱；删字段必须 reserved 占位防编号复用；改标量类型多不兼容；只加 optional 字段最安全，required 已在 proto3 废弃。"},
        {q: "你们战斗服和功能服之间 RPC 用什么序列化？为什么？", a: "用 Kryo/Hessian：Java 内部零配置、体积小、无需维护 schema；一旦出现跨语言需求再切 Protobuf 或 Dubbo 默认方案。"}
      ],
      memory: "序列化选型 = 寄快递选包装：Protobuf 是真空压缩袋（小且标准，跨城市不破损），JSON 是透明塑料袋（一眼看清但占地方），Kryo 是自家绳结（捆得快但别人拆不开），自研二进制是量身木箱（最省空间但木匠贵）。",
      tags: ["序列化", "Protobuf", "游戏实战"]
    },
    {
      id: "netty-16",
      level: 2,
      q: "你们游戏服为什么把 Netty 收包和 Disruptor 业务处理结合起来？交接时怎么保证线程安全和消息顺序？",
      a: "核心结论：Netty EventLoop 只做 I/O 和解码，业务逻辑丢给 Disruptor 单线程消费，用「生产者-消费者 + 玩家维度定序」实现高吞吐和无锁业务。\n为什么要解耦：\n1. EventLoop 是稀缺资源：一个 EventLoop 管几千连接，任何一次 DB/Redis 阻塞都让这几千人集体卡顿时——所以业务绝不能跑在 I/O 线程；\n2. 传统线程池方案的痛点：任务队列竞争锁、上下文切换多，而且玩家消息可能被打散到不同线程并发执行，破坏「同一玩家消息串行」的铁律；\n3. Disruptor 的优势：环形数组无锁（CAS）、缓存行填充避免伪共享、批处理消费，单线程消费就能达到百万级 TPS——游戏业务单线程模型天然契合（单线程业务逻辑不需要任何锁，这是游戏服开发的巨大红利）。\n交接设计：\n1. 生产者：Netty 解码 Handler（EventLoop 线程）把「玩家ID + 协议对象」包装成事件 publish 到 RingBuffer；\n2. 定序：按玩家ID 哈希到固定队列/固定消费者（多 RingBuffer 或单 RingBuffer 内按 ID 分发），保证同一玩家的消息永远由同一线程按到达顺序处理——登录在移动之前、扣钱在发货之前，顺序错了就是事故；\n3. 回写：业务处理完要回包时，不直接 write，而是拿到玩家 Channel 的 EventLoop，eventLoop.execute(() -> channel.writeAndFlush(msg))，把写操作切回该连接所属的 I/O 线程，保证写也线程安全；\n4. 背压：RingBuffer 满了 publishEvent 会阻塞——不能让 EventLoop 阻塞，用 tryPublishEvent 失败则触发过载保护（拒绝非关键协议、告警、必要时踢连接）。",
      point: "考察 I/O 与业务解耦的架构理解，及「玩家维度定序」保序设计。",
      approach: "先讲为什么解耦（EventLoop 稀缺+阻塞雪崩），对比传统线程池的锁竞争与乱序问题，再给交接三要点：publish 事件、ID 哈希定序、eventLoop.execute 回写，补 tryPublish 背压。顺序保证是灵魂，必须展开讲透。",
      followups: [
        {q: "Disruptor 为什么快？伪共享和缓存行填充是什么？", a: "环形数组预分配无 GC、CAS 无锁生产消费、消费者可批处理；伪共享是相邻变量同处一缓存行互相失效，缓存行填充隔离消除它。"},
        {q: "业务单线程模型下怎么利用多核？", a: "多 RingBuffer 按玩家 ID 分片，或单 RingBuffer 多消费者按 ID 分发；每片单线程保持玩家内串行，片间并行吃满多核。"},
        {q: "eventLoop.execute() 回写时 EventLoop 任务队列积压，会有什么连锁反应？", a: "任务堆积挤压 I/O 处理与心跳定时，回包延迟上涨、心跳误判断线，最终内存膨胀；需 pendingTasks 监控+源头降级防传导。"}
      ],
      memory: "Netty 是前台收件员（只登记不办事），Disruptor 是盖章流水线：每个玩家一个固定窗口（ID 哈希定序），单子按先后排队盖章（串行无锁），盖好章的回执再交回收件员寄出（切回 EventLoop 回写）。",
      tags: ["Disruptor", "线程模型", "游戏实战"]
    },
    {
      id: "netty-17",
      level: 2,
      q: "游戏服向大量玩家广播消息时（如 MMORPG 状态同步、全服公告），Netty 写入有什么坑？背压怎么处理？",
      a: "核心结论：广播的两大杀手是「慢客户端拖垮内存」和「写风暴打满 CPU/带宽」，必须靠 isWritable 高/低水位检测 + 分级降级策略做背压。\n写入机制铺垫：\n1. write() 只是入队到 ChannelOutboundBuffer，flush() 才真正触发写 Socket；writeAndFlush = 两者合体；\n2. 每个 Channel 有写缓冲区（默认高水位 64KB、低水位 32KB）：内核发送缓冲区满时，数据在出站缓冲堆积，超过高水位后 channel.isWritable() 返回 false，触发 channelWritabilityChanged 事件。\n广播场景的坑（MMORPG 项目实战）：\n1. 慢客户端连累全服：一个 2G 网络的玩家收不动状态同步包，如果无脑 write，它的出站缓冲无限膨胀→堆外内存 OOM。处理：isWritable() == false 时对该玩家降级（降频/丢弃非关键状态包/标记为卡顿玩家），连续不可写直接踢下线——宁可让一个卡比掉线，不能让全服陪葬；\n2. 每帧全量广播是灾难：状态同步要做 AOI（兴趣区域）裁剪 + 增量同步 + 合帧（比如 10Hz 而不是每逻辑帧都发），百人同屏不是把 100 人的状态发给 100 人各一份原始量；\n3. 对象复用：广播包用 CompositeByteBuf 共享 body（引用计数 retain），避免每个连接拷贝一份；\n4. 写风暴平滑：把大广播拆批，分散到多个 tick 发送，配合 EventLoop 的 I/O 比率（ioRatio）防止写任务饿死读事件；\n5. 监控：线上盯着每个 Channel 的 outboundBuffer 总量和不可写时长，这是游戏服最灵敏的「网络健康度」指标。",
      point: "考察广播场景背压实战：高水位检测、慢客户端降级与写风暴平滑。",
      approach: "先立论「两大杀手：慢客户端与写风暴」，铺垫 write/flush 与水位线机制，逐条给实战对策：isWritable 降级踢线、AOI+增量+合帧、共享 body、拆批发送，补监控指标。突出「宁可踢卡比不坑全服」的取舍观。",
      followups: [
        {q: "channel.write() 在 EventLoop 线程和外部线程调用，内部路径有什么不同？", a: "EventLoop 内直接进出站缓冲；外部线程调用被封装成任务投递到该 Channel 的 EventLoop 执行，多一次队列中转，最终都收敛到 I/O 线程。"},
        {q: "写缓冲区高水位 64KB 是固定最优吗？什么场景要调大调小？", a: "广播服瞬时写峰高可调大到 512KB~1MB 容忍毛刺，但必须配 isWritable 降级；内存敏感或海量连接场景调小，更早暴露慢连接。"},
        {q: "AOI 兴趣区域管理你们用的什么算法？", a: "九宫格简单常用，向视野格内广播；灯塔法按实体订阅进出；四叉树适合大地图稀疏分布。按地图密度与实体数量选型。"}
      ],
      memory: "广播像老师发试卷：写得慢的同学（慢客户端）桌上卷子堆成山就不能再发了（水位线），先停他的（降级/踢线），绝不能为等他一个人让全班放学延迟（OOM）。",
      tags: ["背压", "广播", "状态同步", "游戏实战"]
    },
    {
      id: "netty-18",
      level: 2,
      q: "Netty 服务端常用的 ChannelOption 参数有哪些？分别解决什么问题？",
      a: "核心结论：ServerBootstrap 的 option 作用于 accept 出来的服务端参数，childOption 作用于每条接入连接；游戏服重点调 backlog、Nagle、水位线。\n服务端（option）：\n1. SO_BACKLOG：已完成三次握手、等待 accept 的全连接队列长度。玩家集中登录/重连时 backlog 小了会被拒连（表现为连接超时），Linux 下还受 net.core.somaxconn 限制要配合调，我们登录/游戏服配 1024~4096。\n连接级（childOption）：\n2. TCP_NODELAY=true：关闭 Nagle 算法，小包立即发送不等待合并——游戏操作指令对延迟敏感，必开（默认 false 会带来几十 ms 延迟毛刺）；\n3. SO_KEEPALIVE：TCP 层保活，默认 2 小时才探测，远慢于应用层心跳，只作兜底，不替代心跳协议；\n4. SO_RCVBUF/SO_SNDBUF：内核收发缓冲区，高吞吐场景可调大（如 256KB），但长连接海量场景要算总内存账：10 万连接 × 双缓冲区不能无节制；\n5. WRITE_BUFFER_WATER_MARK：出站高/低水位，广播型游戏服常把高水位调大（如 512KB~1MB）容忍瞬时写峰值，但必须配合 isWritable 降级逻辑；\n6. SO_REUSEADDR：服务端重启快速绑定 TIME_WAIT 占用的端口，发布时必备；\n7. CONNECT_TIMEOUT_MILLIS（客户端侧）：重连超时控制。\n排查思路：连不上看 backlog 和 somaxconn，延迟毛刺看 NODELAY，内存涨看水位线和出站缓冲。",
      point: "考察网络参数调优实战：option/childOption 分工与典型问题的对应关系。",
      approach: "先分清 option（服务端）与 childOption（连接级），按「连不上/延迟毛刺/写不出/重启绑不上」四类问题映射参数讲，比逐个背参数更有结构；给项目常用值，结尾给排查口诀。",
      followups: [
        {q: "三次握手的半连接队列和全连接队列分别是什么？backlog 对应哪个？", a: "半连接队（SYN_RECV）存未握完的连接，全连接队（ESTABLISHED 待 accept）存握完的；backlog 对应全连接队列长度，且受 somaxconn 钳制。"},
        {q: "TIME_WAIT 大量堆积是什么原因？对游戏服有什么影响？", a: "主动关闭方承担 TIME_WAIT，HTTP 短连接或连出侧高频建连所致，占端口和 fd；对策：客户端先断、tw_reuse+timestamps、连接池复用。"},
        {q: "怎么验证 TCP_NODELAY 是否生效？", a: "Wireshark 抓包看小包是否未等 ACK 立即发出、是否带 PSH 标志；或对比开关前后固定 40ms 级毛刺是否消失。"}
      ],
      memory: "参数速记：进不来调 BACKLOG（门厅太小），响应慢开 NODELAY（不等凑单立即发货），发不出看 WATER_MARK（仓库堆货上限），重启绑不上用 REUSEADDR（允许原址重开）。",
      tags: ["ChannelOption", "TCP调优"]
    },
    {
      id: "netty-19",
      level: 3,
      q: "线上游戏服出现内存持续增长，怀疑 Netty 堆外内存泄漏，你的排查思路是什么？",
      a: "核心结论：Netty 内存泄漏排查三板斧——开泄漏检测器定位、看引用计数纪律、用监控区分堆内/堆外。\n第一步：确认漏在哪。\n1. 看现象：JVM 堆稳定但 RSS/进程内存一直涨 → 基本锁定堆外（DirectBuffer 或 Netty 池化内存）；\n2. 监控指标：-Dio.netty.maxDirectMemory 限制 + 通过 Netty 的 PlatformDependent.usedDirectMemory() 或池化分配器的 metric（PooledByteBufAllocator.metric()）观察直接内存使用曲线；\n3. NMT（Native Memory Tracking，-XX:NativeMemoryTracking=summary）辅助看 off-heap 分布。\n第二步：打开泄漏检测器。\n1. -Dio.netty.leakDetectionLevel=PARANOID（偏执级，全量采样）或 ADVANCED（抽样），线上一般先 ADVANCED 低抽样率，预发/压测用 PARANOID；\n2. 原理：ByteBuf 被 GC 时检查引用计数是否归零，未归零打印分配堆栈——直接告诉你哪行代码分配了没释放的 Buf；\n3. 代价：有性能开销，PARANOID 级别不适合长期开在人口大服。\n第三步：对照引用计数纪律自查（游戏服最常见的四个漏点）：\n1. 入站消息：SimpleChannelInboundHandler 会自动 release，但 ChannelInboundHandlerAdapter 里接管消息后忘了 release——业务分发 Handler 是高发区；\n2. retain 了没成对 release：广播场景 CompositeByteBuf/retainedDuplicate，某个分支异常导致少 release；\n3. try-catch 覆盖不全：解码中途抛异常，已分配的 Buf 没走 finally release；\n4. 消息丢到异步线程（如 Disruptor）：跨线程后引用计数所有权交接不清，谁最后消费谁 release，要形成团队约定。\n兜底手段：release 不彻底且短期无法定位时，可临时切非池化分配器（-Dio.netty.allocator.type=unpooled）让泄漏只影响 GC 而非堆外，为修复争取时间。",
      point: "考察堆外内存泄漏的系统排查方法论：定位、检测、纪律自查、止血。",
      approach: "按排查流程讲而非堆知识：第一步区分堆内外（曲线+指标），第二步开 leakDetectionLevel 拿分配堆栈，第三步对照四个高发漏点自查，给 unpooled 止血兜底。强调「先止血再手术」的线上思维，这是与背书者的分水岭。",
      followups: [
        {q: "ReferenceCounted 的 release() 和 GC 是什么关系？为什么池化场景不能只依赖 GC？", a: "GC 只回收对象壳，不归还池化内存；必须 release 把计数归零才回池。只依赖 GC 等于内存只进不出，最终堆外耗尽。"},
        {q: "ResourceLeakDetector 的实现原理了解吗？", a: "对采样的 ByteBuf 包弱引用进 ReferenceQueue，GC 回收对象后若引用计数非零，说明漏 release，打印分配堆栈；用抽样级别控制开销。"},
        {q: "堆外内存还有没有其他来源？", a: "有：JNI 库（压缩/加密）、Unsafe 直接分配、业务自管的 DirectByteBuffer、第三方原生库；可用 NMT 与 jemalloc dump 辅助定位。"}
      ],
      memory: "排查口诀：先分堆内外（看曲线），再开检测器（拿堆栈），对照计数纪律（谁 retain 谁 release），实在不行换非池化（先止血再手术）。",
      tags: ["内存泄漏", "引用计数", "线上排查"]
    },
    {
      id: "netty-20",
      level: 3,
      q: "epoll 的水平触发（LT）和边缘触发（ET）有什么区别？Netty 的 EpollEventLoop 用哪种？对编程模型有什么影响？",
      a: "核心结论：LT 是「只要还有数据就反复通知」，ET 是「只在状态变化瞬间通知一次」；Netty 的 EpollEventLoop 默认 ET（EPOLLET），追求极致性能。\n两者对比：\n1. LT（水平触发，epoll 默认）：fd 可读时每次 epoll_wait 都返回。读一半剩一半，下次还通知你。容错好，编程简单，代价是重复事件和多余系统调用；\n2. ET（边缘触发）：fd 从不可读变可读的那一刻只通知一次。必须把缓冲区读到 EAGAIN（榨干为止），否则剩余数据可能永远不再有新事件（对端不再发数据时）→ 连接饿死。\n对编程模型的影响：\n1. ET 强制「循环读到尽」：Netty 的 NioEventLoop/EpollEventLoop 读循环每次最多读 16 次（maxMessagesPerRead），读到的字节数 < 缓冲区预期才认为读尽——这就是为什么一次 channelRead 未必读完所有数据，解码器必须用累积缓冲区；\n2. ET 下 fd 必须设为非阻塞：阻塞 fd 读 EAGAIN 前会卡住整个 event loop；\n3. ET 收益：同一批数据只唤醒一次，减少 epoll_wait 调用次数和事件风暴，海量连接下 CPU 收益明显。\nNetty 相关点：\n1. EpollEventLoop（Linux 专属，native epoll）相比 NioEventLoop（JDK Selector）还解决了 epoll 空轮询 bug、减少了 JNI 层对象开销，大连接量游戏服建议开启 EpollServerSocketChannel；\n2. 若从 NIO 切到 Epoll ET 模式，应用层无感——因为 Netty 的读循环和累积解码已经帮你消化了 ET 的苛刻要求，这正是框架的价值。\n游戏服视角：十万级长连接 + 小包高频，ET 减少的每一次系统调用都会被连接数放大，这是 Linux 大服用 Epoll 传输的理由之一。",
      point: "考察 epoll 触发模式的深层理解及 ET 对编程模型的约束。",
      approach: "先用一句话定义 LT/ET，对比容错性与性能，重点讲 ET 的三个推论：必须读到 EAGAIN、fd 必须非阻塞、事件减少的收益，落回 Netty：读循环+累积解码已消化 ET 苛刻性。结尾给游戏服选 Epoll 传输的理由。",
      followups: [
        {q: "ET 模式下只读一半数据就 return，会发生什么？怎么复现？", a: "剩余数据不再触发新事件（对端静默时），连接表现为「卡死收不到」；复现：ET 模式单次 read 后停手，对端不再发包即饿死。"},
        {q: "epoll 空轮询 bug 是什么？Netty 怎么规避的？", a: "JDK Selector 在异常断连时 select 立即返回 0 致 CPU 100%；Netty 计空转 512 次后 rebuildSelector 换新 Selector 规避。"},
        {q: "maxMessagesPerRead=16 这个值是干什么的？调大调小各有什么影响？", a: "限制单次事件循环最多读 16 次，防单连接霸占 EventLoop，保证连接间公平；调大吞吐优先，调小公平与低延迟优先。"}
      ],
      memory: "LT 是唠叨的管家：活没干完天天催你；ET 是高冷的管家：只在快递到的那一刻敲一次门，你必须一次全搬进屋（读到 EAGAIN），漏搬的他绝不再提醒。",
      tags: ["epoll", "边缘触发", "Linux", "深挖"]
    },
    {
      id: "netty-21",
      level: 3,
      q: "如果让你对游戏长连接网关做百万级连接的容量规划和压测验证，你会从哪些方面入手？",
      a: "核心结论：百万连接 = 文件句柄 + 内核参数 + JVM/Netty 参数 + 内存精算 + 真实压测，五个层面缺一不可，瓶颈通常在细节参数而不是框架本身。\n1. OS 层：\n   - 文件句柄：每连接一个 fd，ulimit -n 提到百万级（1024000），同时关注 fs.file-max；\n   - 端口与连接跟踪：服务端监听单端口可接入的连接数不受 65535 限制（四元组区分），但要防 nf_conntrack 表满（调大或关掉）；\n   - 内核参数：somaxconn（≥backlog）、tcp_max_syn_backlog、tcp_tw_reuse（主动关连接侧）、vm.max_map_count。\n2. JVM/Netty 层：\n   - 堆外内存精算：每连接的读缓冲 + 写缓冲 + Netty 内部对象 ≈ 数 KB~数十 KB，百万连接光缓冲就是 GB 级，maxDirectMemory 和机器内存要按连接数×单连接开销精算；\n   - EventLoop 线程数：核数×2 起步，百万连接下每 EventLoop 管几千连接，要压测验证 I/O 延迟；\n   - GC：G1/ZGC，大堆+池化 ByteBuf，避免 Full GC 造成全服心跳超时「雪崩掉线」。\n3. 架构层：\n   - 单机百万连接更多是水军/机器人场景，真实游戏玩家通常几十万/服就够，更早遇到瓶颈的是广播和业务吞吐——必要时网关层多实例 + LVS/SLB 负载均衡，登录服做分流调度；\n   - 关键路径无锁化（Netty I/O + Disruptor 业务）保证连接数上涨时吞吐近似线性。\n4. 压测验证：\n   - 自研机器人客户端（我们压测就是用精简协议栈的机器人程序批量建连、发心跳、模拟操作）；\n   - 指标：建连成功率、消息 RT 分布（P99）、GC 停顿、出站缓冲水位、慢连接比例；\n   - 故障注入：批量断连重连（模拟运营商抖动）、慢客户端、恶意大包，验证背压和防护逻辑。\n5. 线上护栏：连接数/包速率/内存水位告警，过载时的降级预案（限新建连、踢离线最久连接）。",
      point: "考察容量规划的体系化思维：OS/JVM/架构/压测/护栏五层递进。",
      approach: "先给五层框架定结构，每层抓关键项讲（fd/somaxconn/conntrack、堆外精算、GC、网关多实例、机器人压测），强调「瓶颈在细节参数而非框架」，收尾故障注入与线上护栏。这题看广度+落地，每点带数字最佳。",
      followups: [
        {q: "单机连接数理论上限怎么算？（fd 限制 vs 四元组）", a: "服务端受 fd（ulimit/file-max）与内存限制，不受 65535 端口限制——连接以四元组区分，客户端 IP×端口组合才是远端侧上限。"},
        {q: "压测机器人怎么做才「像真实玩家」而不是 DDoS？", a: "行为拟真：建连错峰、按真实频率心跳与发包、混合消息大小、模拟慢读与断线；纯洪峰建连那是 DDoS，不是有效压测。"},
        {q: "连接数翻倍但吞吐不涨的排查顺序是什么？", a: "先看 EventLoop 是否打满（线程数/任务积压），再查内核参数（backlog/conntrack），再看 GC 停顿，最后查带宽与网卡队列，逐层缩圈。"}
      ],
      memory: "百万连接五步排查歌：句柄不够门不开（ulimit），队列太短进不来（backlog），内存不精算必翻车（堆外账），线程不对齐全白搭（EventLoop），不压测的承诺是吹牛（机器人验证）。",
      tags: ["容量规划", "压测", "架构", "深挖"]
    },
    {
      id: "netty-22",
      level: 3,
      q: "游戏服热更新/重启时，如何做到玩家不掉线或秒级恢复？Netty 优雅停机要处理哪些细节？",
      a: "核心结论：优雅停机的本质是「拒新、保旧、等收尾」，配合登录服的会话票据机制让玩家感知最小化。\nNetty 优雅停机三板斧：\n1. 先摘流量：从注册中心/负载均衡摘掉节点（或关闭 bossGroup 停止 accept 新连接），新玩家登录会被登录服调度到其他节点；\n2. 处理存量：\n   - 通知在线玩家「服务器维护中，稍后自动重连」（客户端收到后进入重连流程）；\n   - 等关键业务收尾：正在结算的订单、正在写入的存档要落盘——我们的做法是停收新协议，等待 RingBuffer 消费排空 + 强制超时兜底（如 30s）；\n   - 保存玩家会话快照（内存数据落 Redis/DB），供重连后恢复；\n3. 关 Netty：bossGroup.shutdownGracefully(quietPeriod, timeout, unit) + workerGroup 同理——quietPeriod 内没有新任务才真正关闭，期间继续处理存量 I/O，最后 awaitTermination 阻塞等退出，保证不落掉正在 write 的包。\n玩家无感的关键设计（架构层，比单机技巧更重要）：\n1. 登录服与游戏服分离：登录服发的会话票据（token+过期时间）在玩家重连任意游戏服节点时都有效，重连不依赖原节点存活；\n2. 会话外置：玩家关键状态定期快照到 Redis，节点挂了换节点也能恢复；\n3. 灰度/滚动发布：多节点逐个重启，玩家无感迁移——这也是我们线上部署维护的标准流程；\n4. 热更新（代码级）：逻辑脚本化（Lua/Groovy）或自定义 ClassLoader 热替换业务类，Netty 连接层完全不动——连接对象、Pipeline 与会话保留，只换业务逻辑实现。\n常见坑：shutdownGracefully 的 quietPeriod 设太短导致回包被截断；忘关业务线程池/Disruptor 导致进程退不掉；强杀进程造成玩家未保存数据丢失引客诉。",
      point: "考察优雅停机与玩家无感发布的架构设计：拒新、保旧、等收尾、会话外置。",
      approach: "先给「拒新保旧等收尾」总纲，讲 Netty 侧 shutdownGracefully 语义，重点升级到架构层：票据重连、会话快照、滚动发布、脚本热更，列常见坑收尾。要点出「架构设计比单机技巧更重要」的高度。",
      followups: [
        {q: "shutdownGracefully 的 quietPeriod 和 timeout 参数语义是什么？", a: "quietPeriod 静默期内无新任务才真正启动关闭，timeout 是强制上限到期强杀；先等静默稳定再计时，双保险防截断回包。"},
        {q: "热替换 ClassLoader 方案有什么限制？", a: "静态变量/单例状态会丢失、类结构变更（加字段）不兼容、旧类已加载对象不自动迁移；适合无状态逻辑类，配置与状态要外置。"},
        {q: "你们的会话快照包含哪些内容？恢复时怎么处理「停机期间的游戏世界变化」？", a: "含玩家位置、背包/货币版本号、未结算战斗上下文；恢复时以快照+世界当前状态做一致性校验，停机期间的结算事件重放或补偿。"}
      ],
      memory: "优雅停机 = 打烊三部曲：门口挂「暂停接待」（拒新）→ 店内顾客耐心送完（等收尾+存会话）→ 最后锁门拉闸（shutdownGracefully）；熟客明天凭会员卡（token）从任意分店（节点）继续消费。",
      tags: ["优雅停机", "热更新", "游戏实战", "架构"]
    },
    {
      id: "netty-23",
      level: 1,
      q: "讲讲 TCP 三次握手和四次挥手。为什么握手是三次、挥手是四次？TIME_WAIT 是什么，对游戏服有什么影响？",
      a: "核心结论：三次握手是为了「双向确认收发能力并同步初始序列号」，四次挥手是因为 TCP 全双工、两个方向要各自独立关闭。\n三次握手：\n1. 客户端发 SYN（seq=x）；\n2. 服务端回 SYN+ACK（seq=y, ack=x+1）；\n3. 客户端回 ACK（ack=y+1），连接建立。为什么不是两次：两次服务端无法确认自己的发送能力是否被对方收到，且无法防止「历史失效的连接请求」突然到达服务端造成资源浪费。\n四次挥手：\n1. 主动方发 FIN（我发完了）；\n2. 被动方回 ACK；\n3. 被动方处理完剩余数据后发自己的 FIN；\n4. 主动方回 ACK，进入 TIME_WAIT。为什么四次：被动方收到 FIN 时可能还有数据没发完，ACK 和 FIN 不能合并，只能分两次——这就是「半关闭」状态。\nTIME_WAIT（主动关闭方停留 2MSL，通常 60s）的两个作用：\n1. 确保最后一个 ACK 能送达（对方收不到会重发 FIN，TIME_WAIT 状态还能再回一次 ACK）；\n2. 让本次连接的旧报文在网络中消亡，避免串到下一个相同四元组的新连接。\n游戏服影响与应对：\n1. 长连接游戏服 TIME_WAIT 少，但登录服/购买服/GM 后台的 HTTP 短连接、以及服务器主动连 Redis/Kafka/内网 RPC 时，如果由服务端主动关闭会堆大量 TIME_WAIT，占满端口和 fd；\n2. 应对：尽量让客户端先断（主动关闭方承担 TIME_WAIT）；连出侧开 net.ipv4.tcp_tw_reuse（前提 tcp_timestamps 开启）；HTTP 连接用连接池复用而不是短连接；\n3. 千万别图省事设 SO_LINGER=0 发 RST 强关，会丢未送达的数据，玩家回包可能被截断。",
      point: "考察 TCP 连接生命周期原理，及 TIME_WAIT 对服务器资源的实际影响与治理。",
      approach: "握手挥手过程简要画清，重点答两个为什么（双向确认+防历史失效；全双工独立关闭+半关闭），TIME_WAIT 讲清两个作用再落到游戏服影响与治理，强调别用 SO_LINGER=0 图省事。",
      followups: [
        {q: "如果第三次握手的 ACK 丢了，连接是什么状态？", a: "服务端停在 SYN_RECV 并超时重传 SYN+ACK，多次失败后释放；客户端以为已连接，一发包触发 RST 后重新建连。"},
        {q: "TIME_WAIT 为什么是 2MSL 而不是 1MSL？MSL 是多少？", a: "1 个 MSL 保证本方最后 ACK 到达对端，另 1 个容忍对端重发 FIN 返回；MSL 通常 30s~2min，Linux 的 TIME_WAIT 固定 60s。"},
        {q: "登录服是短连接，实际观察到过 TIME_WAIT 堆积吗？怎么处理的？", a: "用 ss/netstat 统计 TW 数量确认；治理：接口连接池复用、服务端尽量被动关闭、开 tcp_tw_reuse+timestamps，必要时扩端口范围。"}
      ],
      memory: "打电话模型：握手=「喂，听得到吗」「听得到，你呢」「我也听得到」（三次缺一不可）；挥手=「我说完了」「嗯」「那我也说完了」「好」。TIME_WAIT=挂完电话把手机举 2 分钟，确认对方真挂了才揣兜。",
      tags: ["TCP", "三次握手", "TIME_WAIT", "基础"]
    },
    {
      id: "netty-24",
      level: 2,
      q: "Nagle 算法是什么？为什么游戏服务器必须开 TCP_NODELAY？它和延迟 ACK 叠加会产生什么现象？",
      a: "核心结论：Nagle 用「攒包」换带宽效率，但和延迟 ACK 叠加会造成固定 40ms 级延迟毛刺，对操作指令型游戏不可接受，必须 TCP_NODELAY=true 关闭。\n1. Nagle 算法：只要连接上还有「未被 ACK 的小包」，新的小数据就先缓存不发送，直到收到 ACK 或攒够一个 MSS 再发。目的是减少网络中小包数量，批量传输（大文件、日志）场景是优点。\n2. 延迟 ACK：接收方收到数据后不立即回 ACK，最多等 40ms（Linux 典型值）看能不能「捎带」在回包里一起发，减少 ACK 包数量。\n3. 致命叠加：发送方 Nagle 等 ACK 才发下一包，接收方延迟 40ms 才回 ACK——互相等待，每个小包都卡 40ms。表现就是「大部分时候流畅，间歇性固定几十 ms 的毛刺」，用 Wireshark 抓包能看到规律的延迟间隔。\n4. 游戏场景：玩家移动、合成、战斗操作都是小包高频且强延迟敏感，40ms 毛刺直接影响手感投诉——所以游戏服 childOption(TCP_NODELAY, true) 是铁律（这也是我们所有长连接服务的默认配置）。\n5. 什么场景反而可以保留 Nagle：日志服批量上报、GM 后台大文件导出这类吞吐优先、延迟不敏感的场景。\n6. 注意：TCP_NODELAY 只影响发送时机，不能根治粘包（对端缓冲区照样可能一次读到多个包），粘包拆包依然要靠应用层协议界定边界。",
      point: "考察 Nagle 与延迟 ACK 叠加产生 40ms 毛刺的机理及必开 TCP_NODELAY 的原因。",
      approach: "先给结论「两者叠加=固定 40ms 毛刺」，分别讲 Nagle 与延迟 ACK 的设计初衷（都是好意），用「互相等待」讲清叠加死锁，落到游戏小包高频必须 TCP_NODELAY，补一句它治不了粘包，防以偏概全。",
      followups: [
        {q: "怎么在抓包里确认 TCP_NODELAY 是否生效？", a: "观察小包是否未等 ACK 立即发出、是否带 PSH 标志；对比关闭 Nagle 前后规律性 40ms 间隔是否消失。"},
        {q: "quick ACK 是什么？能替代 TCP_NODELAY 吗？", a: "quick ACK 让接收方立即回 ACK（tcp_quickack），缓解发送方等待，但它治接收端不治发送端，不能替代发送侧的 TCP_NODELAY。"},
        {q: "除了 Nagle，还有哪些 TCP 机制会引入游戏延迟毛刺？", a: "重传 RTO 最小 200ms、拥塞窗口慢启动、零窗口探测，以及服务端 GC 停顿；弱网下重传是延迟尖峰的最大头。"}
      ],
      memory: "Nagle 是班车：凑满一车（MSS）或上一车乘客签收了（ACK）才发车；延迟 ACK 是慢性子签收员：货到了先压 40ms 再签。两个撞一起就是每趟都晚点 40ms。游戏操作要打出租车（TCP_NODELAY），招手即走。",
      tags: ["Nagle", "TCP_NODELAY", "延迟ACK", "游戏实战"]
    },
    {
      id: "netty-25",
      level: 3,
      q: "JDK NIO 的 epoll 空轮询 bug 是怎么回事？Netty 是怎么规避的？",
      a: "核心结论：JDK 的 Selector 在 Linux/epoll 实现下，可能在「没有任何就绪事件」时 select() 立即返回 0，导致外层 while 循环空转、CPU 100%；Netty 用「空转计数 + 重建 Selector」兜底规避。\nbug 根因：\n1. 触发场景：连接被对端 RST 异常断开等边缘情况下，epoll 底层会反复唤醒 Selector，但 selectedKeys 集合是空的（事件无法被正确处理/注册）；\n2. 结果：select(timeout) 本该阻塞等待，却立即返回 0，业务代码的 while(true) { selector.select(); 处理事件; } 变成无阻塞死循环，单核 CPU 打满——这是 JDK 著名的未修复 bug（官方 issue 挂了很多年）。\nNetty 的规避策略（NioEventLoop.run 里）：\n1. 每次 select 返回 0 且没有任务需要执行时，空转计数器 selectCnt 自增；\n2. 达到阈值（默认 512 次，SELECTOR_AUTO_REBUILD_THRESHOLD，可用 -Dio.netty.selectorAutoRebuildThreshold 调整）就判定中招；\n3. 执行 rebuildSelector()：新建一个 Selector，把旧 Selector 上注册的所有 SelectionKey 逐个取消并注册到新 Selector，然后原子替换——相当于不修车直接换车；\n4. 换完新 Selector 后 epoll 状态干净，空转消失，计数清零继续正常轮询。\n补充认知：\n1. 这个 bug 只在 NIO 传输（NioEventLoop）下存在，Linux 上直接用 EpollEventLoop（native epoll，不走 JDK Selector）可以彻底绕开——这也是大连接量游戏服推荐 Epoll 传输的原因之一；\n2. 线上排查「游戏服 CPU 莫名 100%」时，epoll 空轮询是嫌疑清单之一，jstack 会看到线程一直停在 selector.select 相关栈上。",
      point: "考察 JDK epoll 空轮询 bug 根因与 Netty 重建式规避方案的了解。",
      approach: "先描述现象（select 返回 0 空转 CPU 100%），讲根因（异常断连下 epoll 反复唤醒无事件），重点讲 Netty 三步：计数 512→rebuildSelector→原子替换，补 EpollEventLoop 彻底绕开与 jstack 排查特征。可借用「换车不修车」的比喻。",
      followups: [
        {q: "rebuildSelector 重建过程中会丢事件吗？Netty 怎么保证安全的？", a: "重建在 EventLoop 线程内执行，期间不处理新事件；旧 key 逐个 cancel 并注册到新 Selector，注册关系完整交接，不丢连接。"},
        {q: "为什么说这是「无法根治只能规避」的 bug？", a: "bug 在 JDK 的 epoll 实现层，应用层改不了；只能检测症状后重建规避，或换 native EpollEventLoop 不走 JDK Selector。"},
        {q: "你们线上遇到过单核 CPU 100% 吗？当时的排查路径是什么？", a: "top -H 定位线程→jstack 看是否停在 selector 相关栈→结合异常断连日志确认→升级 JDK/启用 Epoll 传输/调重建阈值。"}
      ],
      memory: "闹钟坏了：每秒响一次但睁眼一看没任何事（select 返回 0）。Netty 不修闹钟（改不了 JDK），而是数它空响 512 次就直接换个新闹钟（rebuildSelector），旧闹钟扔掉。",
      tags: ["Selector", "空轮询bug", "epoll", "深挖"]
    },
    {
      id: "netty-26",
      level: 3,
      q: "EventLoop 除了处理 I/O 事件还要执行任务队列里的任务，它的任务调度机制是怎样的？队列满了会发生什么？",
      a: "核心结论：EventLoop 的 run 循环按 ioRatio 分配「I/O 事件处理」和「任务执行」的时间，任务队列默认是无界的——不会拒绝，只会无限积压直至延迟爆炸或 OOM，必须主动监控。\nEventLoop 每轮循环做三件事：\n1. select() 等待 I/O 事件（可被新任务 wakeup 提前唤醒）；\n2. 处理就绪的 I/O 事件（processSelectedKeys）；\n3. 执行任务队列：runAllTasks。ioRatio（默认 50）表示 I/O 时间占比上限 50%，即任务执行时间不超过本轮 I/O 处理耗时，防止任务饿死 I/O。\n两类任务两种队列：\n1. 普通任务（eventLoop.execute/submit）：MPSC（多生产者单消费者）无锁队列，游戏服里最常见的就是业务线程 eventLoop.execute 回写数据包；\n2. 定时任务（schedule）：优先级队列（按截止时间排序），IdleStateHandler、重连定时都走这里。\n关键陷阱——队列是无界的：\n1. Netty 默认用 LinkedBlockingQueue（容量 Integer.MAX_VALUE），不像线程池有拒绝策略，任务只进不拒；\n2. 业务线程回写速度超过网络发送能力时（慢客户端+高频回包），任务在队列里堆积：单条连接的写任务互相排队 → 回包延迟持续上涨 → 最终堆外内存/OOM；\n3. 游戏服防护：监控 eventLoop.pendingTasks() 和任务执行耗时分布，超阈值告警；配合 isWritable 背压在源头降级（少发、合帧、踢慢连接），别让压力传导到任务队列；\n4. 排延迟毛刺的口诀：先看任务队列积压（pendingTasks），再看 I/O 事件耗时，最后看 GC——EventLoop 一个线程干三类活，任何一类超时都会拖累另两类。",
      point: "考察 EventLoop 循环内 I/O 与任务的时间分配机制及无界队列积压风险。",
      approach: "先讲 run 循环三步与 ioRatio 语义，区分普通任务（MPSC 队列）与定时任务（优先级队列），重点抛「无界队列不拒绝只积压」的陷阱与监控手段，给排毛刺口诀收尾。陷阱部分最能体现生产经验。",
      followups: [
        {q: "ioRatio 调大调小分别适合什么场景？", a: "默认 50；I/O 极重的转发型网关调高让 I/O 优先，任务重的场景调低保任务时效；多数情况不动，以压测验证为准。"},
        {q: "wakeup 机制是怎么实现的？为什么 execute 任务能及时打断 select？", a: "execute 时向 Selector 的 wakeup 管道写一字节，select 立即被唤醒转而处理新任务，兼顾了阻塞等待与任务及时性。"},
        {q: "如果想让关键任务（如踢人指令）优先执行，有什么办法？", a: "EventLoop 单队列无优先级；可另起专用 EventExecutor 处理踢人等指令，或业务侧用独立 RingBuffer 让关键事件插队消费。"}
      ],
      memory: "EventLoop 是独臂厨师：左手炒 I/O 的菜，右手接 execute 的订单，ioRatio 规定左右手各用一半时间。订单筐（任务队列）无底不限量——堂食爆单不会拒客，只会堆到厨房淹没，所以要装摄像头盯筐深（pendingTasks）。",
      tags: ["EventLoop", "任务队列", "ioRatio", "深挖"]
    },
    {
      id: "netty-27",
      level: 2,
      q: "Netty 的 HashedWheelTimer（时间轮）是什么原理？游戏里的海量定时任务（技能 CD、Buff 过期、超时检测）适合用它吗？",
      a: "核心结论：HashedWheelTimer 用「环形数组 + 链表槽位」把定时任务的插入/取消降到 O(1)，适合海量、低精度、短时效的定时任务；但它单线程执行回调，重任务必须异步甩出。\n原理：\n1. 结构：一个环形数组（wheel，默认 512 个槽位），一个指针每过 tickDuration（默认 100ms）前进一格；\n2. 任务按「延迟时间 ÷ tickDuration」算出槽位下标和剩余圈数（remainingRounds），挂到槽位链表上；\n3. 指针扫到某槽位时，遍历链表：圈数 >0 的任务圈数减一等下轮，圈数 =0 的执行；\n4. 插入和取消都是 O(1)，只有执行时遍历当前槽位链表。\n对比其他定时方案：\n1. DelayQueue/ScheduledThreadPoolExecutor：堆结构，插入 O(log n)，海量任务下有锁竞争；\n2. 时间轮：O(1) 插入取消，十万级任务无压力——Dubbo 的心跳重试、Netty 的连接超时都用它；\n3. 精度代价：任务触发时间会被对齐到 tickDuration 的整数倍，100ms 粒度误差天然存在。\n游戏场景适配（我们的实践）：\n1. 适合：连接级超时（登录超时、协议应答超时）、重试退避、GM 指令延迟执行这类「量大、精度要求百毫秒级」的任务；\n2. 不适合：技能 CD、Buff 帧级结算——这类跟战斗逻辑强耦合、要精确到逻辑帧（如 20Hz），我们直接由逻辑帧驱动（每帧检查到期列表），不走时间轮；\n3. 铁律：回调跑在时间轮的唯一线程上，里面只能做轻量标记/转发，重逻辑丢业务线程，否则一个慢任务拖延全轮任务。",
      point: "考察时间轮 O(1) 原理及对「海量低精度」适用边界的判断力。",
      approach: "先讲环形数组+槽位链表+圈数的结构与 O(1) 来源，对比 DelayQueue 的 O(log n)，关键讲适配边界：连接超时/重试适合，技能 CD 这类帧级任务用逻辑帧驱动，强调回调单线程铁律。边界判断比原理复述更得分。",
      followups: [
        {q: "任务延迟 1 小时而 tickDuration 是 100ms，时间轮怎么表示？", a: "总 tick 数 36000，槽位=36000%512，remainingRounds=36000/512 圈；指针每扫到该槽圈数减一，归零才真正执行。"},
        {q: "HashedWheelTimer 和 Kafka 的层级时间轮有什么区别？", a: "Kafka 用多层时间轮（秒轮→分轮→时轮），溢出任务降级到粗粒度轮，避免大跨度任务让单层轮空转；Netty 是单层+圈数表示。"},
        {q: "时间轮的指针推进靠什么线程？它挂了会怎样？", a: "Timer 内部唯一 Worker 线程推进并执行回调；它若被慢回调阻塞或崩溃，全轮任务延迟——所以回调必须轻量、快速甩出。"}
      ],
      memory: "时间轮 = 老式火车站的圆形时刻表：512 个格子是 512 个站台，指针是检票员每 100ms 挪一站；你的车票写着「第几站、第几圈」，圈数没跑完就在站台继续等，跑完才上车。",
      tags: ["HashedWheelTimer", "时间轮", "定时任务", "游戏实战"]
    },
    {
      id: "netty-28",
      level: 2,
      q: "从 channel.write() 到数据真正发出去，Netty 内部经历了什么？ChannelOutboundBuffer 和水位线在这里扮演什么角色？",
      a: "核心结论：write() 只是把消息挂进出站缓冲（ChannelOutboundBuffer）并占位记账，flush() 才触发真正的 Socket 写；缓冲字节数超过高水位即判定「不可写」，这是背压的触发点。\n完整路径：\n1. 线程切换：如果在非 EventLoop 线程调用 write，Netty 会把写操作封装成任务投递到该 Channel 的 EventLoop 执行——所有出站操作最终都收敛到 I/O 线程，保证无锁；\n2. 出站 Pipeline：消息逆序经过各 OutboundHandler（编码器在这把协议对象转成 ByteBuf）；\n3. write 阶段：ByteBuf 被包成 Entry 挂到 ChannelOutboundBuffer 的链表上，并按消息大小累加 pendingBytes——此时数据还在 JVM 里，没碰 Socket；\n4. flush 阶段：把缓冲里累积的 Entry 尽量一次性写进内核发送缓冲区（gathering write 聚集写，多次 write 合并为少量系统调用），写不完的留在缓冲里注册 OP_WRITE 事件，等内核缓冲可写时续写；\n5. Entry 里的 ByteBuf 在真正写入内核成功后才 release——所以业务层 writeAndFlush 之后可以安全地不再管这个 Buf（前提是自己 retain 的份额已交接清楚）。\n水位线机制：\n1. pendingBytes 超过高水位（默认 64KB）→ channel.isWritable() 变 false，触发 channelWritabilityChanged 事件；\n2. 内核缓冲排空、pendingBytes 降到低水位（默认 32KB）以下 → 恢复可写，再次触发事件；\n3. 游戏广播场景就靠这两个事件做背压开关：不可写时降频/丢帧/踢慢连接，可写时恢复推送。\n性能要点：write 和 flush 分开调，批量攒几次 write 再一次 flush，能显著减少系统调用——高频回包路径上值得专门优化。",
      point: "考察 write/flush 分离语义、出站缓冲记账与水位线触发背压的完整链路。",
      approach: "按数据流向讲链路：线程收敛→出站 Pipeline→write 挂缓冲记账→flush 聚集写内核→OP_WRITE 续写，再讲高低水位与 isWritable 事件如何当背压开关，补批量 write 一次 flush 的性能要点。链路完整+讲清水位线是核心。",
      followups: [
        {q: "write 之后不 flush，数据会发出去吗？Netty 有没有自动 flush 的机制？", a: "不会，数据只停在 JVM 出站缓冲；除 writeAndFlush 外无自动 flush，业务需自己把握 flush 时机做攒批优化。"},
        {q: "OP_WRITE 事件什么时候注册、什么时候取消？一直挂着会发生什么？", a: "内核缓冲满写不完时注册，可写后续写，写完立即取消；一直挂着会每轮空触发写事件，白白消耗 CPU。"},
        {q: "水位线事件在哪条线程回调？回调里能直接继续做大量 write 吗？", a: "在该 Channel 所属 EventLoop 回调；可以继续 write 但要节制——恢复可写瞬间疯狂补发会立刻又顶回高水位。"}
      ],
      memory: "write 是把快递搬进发货仓库（OutboundBuffer）并记账（pendingBytes），flush 才叫货车来拉走（写 Socket）。仓库堆到红线（高水位）就挂「暂停收货」牌（isWritable=false），货车拉走一半降到安全线（低水位）才摘牌。",
      tags: ["writeAndFlush", "ChannelOutboundBuffer", "高低水位", "背压"]
    },
    {
      id: "netty-29",
      level: 2,
      q: "ChannelFuture 和 Promise 有什么区别？在游戏服的异步回包链路里怎么用才不踩坑？",
      a: "核心结论：Future 是「只读回执」（查询结果+注册回调），Promise 是「可写回执」（生产者 setSuccess/setFailure）；Netty 所有 I/O 操作返回的 ChannelFuture 底层都是 Promise。\n1. 分工：调用方拿 Future 只能 isSuccess()/addListener()；执行方持有 Promise 才能写入结果。DefaultPromise 同时实现两者——写完操作的人 set，等结果的人 listen。\n2. 回调线程：addListener 的回调默认在「完成该 Promise 的线程」上执行（I/O 操作即 EventLoop）。所以回调里禁止阻塞、禁止重业务，要转业务就再投递出去。\n3. 死锁红线：在 EventLoop 线程里 future.sync()/await() 等于「等自己完成任务」，直接死锁——排查 CPU 不高但全服卡死的经典案发现场。\n4. 与 CompletableFuture 对比：Promise 是监听器模式（addListener 即时回调），CompletableFuture 是编排模式（thenApply/thenCompose 链式组合）；Netty 内部链路用 Promise，业务层异步编排（如登录服并发查渠道+查账号）可以用 CompletableFuture 再接回 Netty。\n游戏实战用法（我们的场景）：\n1. 回包确认：购买服给玩家发「扣款成功」协议时 writeAndFlush(msg).addListener(f -> { if (!f.isSuccess()) 记失败日志/补偿 })——网络层发送失败不能让玩家以为扣款成功；\n2. 关连接前确保送达：踢人时先 writeAndFlush(踢人协议).addListener(ChannelFutureListener.CLOSE)，用「写完再关」代替「写完 sleep 再关」，优雅且不丢包；\n3. 异步登录链：连接建立后 channel.closeFuture().addListener(...) 统一挂资源清理逻辑，比散落在各处的 close 调用可靠。",
      point: "考察 Future 只读/Promise 可写分工及异步链路的回调线程与死锁红线。",
      approach: "先给「只读回执 vs 可写回执」分工，讲回调线程归属与 EventLoop 内 sync 死锁红线，用项目三场景落地：回包失败补偿、写完再关踢人、closeFuture 统一清理，顺带对比 CompletableFuture 展示视野。红线与实战用法并重。",
      followups: [
        {q: "DefaultPromise 的 setSuccess 可以被调用两次吗？会发生什么？", a: "第二次返回 false 不生效（CAS 保护），不抛异常；结果以首次设置为准，监听器只触发一次。"},
        {q: "ChannelFutureListener.CLOSE 和直接 ctx.close() 有什么区别？", a: "addListener(CLOSE) 等写完成后再关，保证协议送达；直接 close 立即关闭，已 write 未 flush 完的包可能被截断。"},
        {q: "future.sync() 里做了什么？为什么在 EventLoop 里调用会死锁？", a: "内部 await 等待状态位，由 setSuccess 方唤醒；EventLoop 里等即「自己等自己执行的任务完成」，互相等待成死锁。"}
      ],
      memory: "取餐号模型：Future 是顾客手里的取餐号——只能查不能改；Promise 是厨房的叫号屏——做完了自己翻牌。sync() 等于顾客堵在出餐口死等，厨师（EventLoop）被堵得做不了别人的菜，整个餐厅瘫痪。",
      tags: ["ChannelFuture", "Promise", "异步模型", "游戏实战"]
    },
    {
      id: "netty-30",
      level: 2,
      q: "Netty 怎么和 Protobuf 集成？官方提供了哪些编解码器？为什么游戏项目往往不用官方的 ProtobufDecoder 而是自己组合？",
      a: "核心结论：官方 codec-protobuf 解决「切帧+序列化」两件事，但缺游戏最需要的「协议号路由」，所以生产上普遍用「自定义帧头（含协议号）+ Protobuf body」的组合方案。\n官方四件套：\n1. ProtobufVarint32FrameDecoder / ProtobufVarint32LengthFieldPrepender：用 varint 长度前缀切帧（解决粘包拆包）；\n2. ProtobufDecoder：字节 → MessageLite，构造时必须传入一个 prototype 实例（getDefaultInstance），它按这个类型反序列化；\n3. ProtobufEncoder：MessageLite → 字节。\n官方方案的短板：\n1. 一个 Pipeline 只能绑一种消息类型——游戏有几百个协议，总不可能给每个协议建一条连接；\n2. 没有协议号字段，解码后无法路由到对应业务处理器。\n游戏通用做法（我们的方案）：\n1. 帧头自定义：| magic | length | protocolId | protobuf body |，用 LengthFieldBasedFrameDecoder 或自定义解码器切帧并解出协议号；\n2. body 部分直接调 Protobuf：Parser parser = 协议号注册表.getParser(protocolId); parser.parseFrom(bodyBytes)——注册表由我们的协议生成工具从 .proto 自动生成，加协议零手写代码；\n3. 这样编解码、路由、协议演进全部打通，又保留了 Protobuf 体积小、跨语言（客户端可能是 C++/Unity）的优势。\n协议演进纪律（必考）：\n1. 字段编号一经发布永不复用，删除字段用 reserved 2, 15 to 20; 占位，防止后人误用旧编号导致数据错乱；\n2. 只加 optional 字段不改已有字段的类型和编号，老客户端收到新字段自动忽略（向前兼容）；\n3. required 字段在 proto3 已废弃，新协议一律 optional/无修饰。\n备选认知：需要免预注册反序列化（如日志服/BI 服收全量协议）可用 DynamicMessage + 自描述文件，但解析成本高，只适合低频链路。",
      point: "考察官方 protobuf 编解码器局限的认知及「帧头协议号+PB body」组合设计。",
      approach: "先列官方四件套，点破致命短板：单 Pipeline 单消息类型、无协议号无法路由，再给游戏通用方案：自定义帧头+注册表 parseFrom，补协议演进纪律（编号不复用/reserved）。短板分析是本题灵魂，别只答集成步骤。",
      followups: [
        {q: "varint 编码为什么省空间？负数为什么反而占 10 个字节？", a: "varint 每字节 7 位有效+1 位续标，小整数只占 1 字节；负数按补码直接编码占满 10 字节，故用 zigzag 映射为小正数（sint32）。"},
        {q: "ProtobufDecoder 为什么需要 prototype 实例而不是 Class？", a: "反序列化需要具体消息实例作解析模板，Class 无法直接提供 parseFrom 行为入口；getDefaultInstance 是官方约定的原型模式。"},
        {q: "你们的协议生成工具怎么处理协议号分配和冲突检测？", a: "按模块划分号段（登录 1xxx、战斗 2xxx），工具构建时全表查重，冲突直接编译失败；协议号一经发布不回收复用。"}
      ],
      memory: "官方 codec 是单机版电饭煲：一次只能煮一种米（一个 prototype）。游戏要的是食堂大锅：窗口（帧头）贴菜品编号（协议号），后厨按编号领对应的菜谱（parser）炒对应的菜（protobuf body）。",
      tags: ["Protobuf", "编解码", "协议路由", "游戏实战"]
    },
    {
      id: "netty-31",
      level: 2,
      q: "如果让你用 Netty 支持 H5 游戏/小游戏的 WebSocket 接入，Pipeline 怎么设计？和原生 TCP 网关怎么复用业务层？",
      a: "核心结论：浏览器不能裸 TCP，H5 游戏只能走 WebSocket；Netty 用「HTTP 握手 + 协议升级 + 二进制帧」三段式 Pipeline，业务层通过抽象「传输无关的消息模型」与 TCP 网关完全复用。\n为什么不能裸 TCP：浏览器安全模型只允许 HTTP/WebSocket，H5 小游戏、棋牌、轻量 merge 类产品接 H5 渠道时 WebSocket 是唯一长连接选择。\nNetty Pipeline 设计（从下到上）：\n1. SslHandler（可选但生产必备）：WSS 加密，放最前面——H5 渠道和微信环境基本都强制 WSS；\n2. HttpServerCodec：把字节解成 HTTP 请求（握手阶段用）；\n3. HttpObjectAggregator：聚合 HTTP 分片成 FullHttpRequest（握手请求必须完整）；\n4. WebSocketServerProtocolHandler(\"/ws\")：核心——自动完成握手（校验 Upgrade: websocket 头、用 Sec-WebSocket-Key + 固定 GUID 做 SHA-1+Base64 算出 Sec-WebSocket-Accept 回 101 响应）、握手成功后自动把 HTTP 相关 Handler 移除、自动处理协议层 Ping/Pong/Close 帧；\n5. 自定义业务 Handler：收 BinaryWebSocketFrame —— frame.content() 就是 ByteBuf，直接喂给我们原有的「魔数+长度+协议号」解码器。\n关键决策：\n1. 二进制帧 vs 文本帧：BinaryWebSocketFrame 直接承载和原生 TCP 完全一致的二进制协议+Protobuf body，业务零改动；TextWebSocketFrame 走 JSON 只用于调试工具和 GM 调试页；\n2. 业务复用：在解码器之上抽象出统一的「会话 + 协议对象」模型，TCP Channel 和 WebSocket Channel 对业务层透明——同一套 Disruptor 投递、同一批业务处理器，H5 玩家和原生客户端可以同服；\n3. 心跳双保险：WS 协议层 Ping/Pong（浏览器自动回 Pong）+ 应用层心跳协议（IdleStateHandler）都要，因为部分代理会吞协议层帧；\n4. 坑：微信/部分浏览器对单帧大小有限制，大包要分帧；WSS 证书过期导致全量 H5 玩家连不上是经典线上事故，证书要进监控。",
      point: "考察 WebSocket 接入的 Pipeline 组装及传输层与业务层解耦复用的设计。",
      approach: "先讲为什么 H5 只能 WS（浏览器安全模型），按顺序组装 Pipeline：SSL→HttpCodec→聚合→WS 协议 Handler→业务解码，核心答复用：二进制帧承载原协议、业务层传输无关，列坑：WSS 证书、帧大小、双心跳。复用设计是分水岭。",
      followups: [
        {q: "WebSocket 握手时 Sec-WebSocket-Accept 是怎么算出来的？为什么要这么算？", a: "Sec-WebSocket-Key 拼接固定 GUID 后 SHA-1 再 Base64；证明服务端真懂 WS 协议而非误响应的普通 HTTP 服务，防缓存代理混淆。"},
        {q: "WebSocket 帧本身有长度字段，还需要应用层长度字段吗？", a: "单协议一帧时可省；但承载原 TCP 协议（多协议复用/跨帧兼容）时保留长度字段，解码器零改动直接复用。"},
        {q: "H5 渠道要求的鉴权（token 放握手 URL 还是首条消息）怎么设计？", a: "握手 URL query 带 token 拒绝成本低，注意长度与日志泄漏；或首条消息鉴权+未鉴权定时踢线。按渠道安全要求选择。"}
      ],
      memory: "WebSocket 接入 = 酒店前台换制服：客人（H5 玩家）从旋转门（HTTP）进来先办入住（握手 101），办完直接走内部电梯（WS 二进制帧）——进了房间（业务层）和走 VIP 通道（原生 TCP）的客人享受完全一样的服务。",
      tags: ["WebSocket", "H5游戏", "SslHandler", "游戏实战"]
    },
    {
      id: "netty-32",
      level: 3,
      q: "实时对战类游戏为什么用 UDP/KCP 而不是 TCP？Netty 支持 UDP 吗？KCP 的原理和取舍是什么？",
      a: "核心结论：TCP 的队头阻塞对实时对战是致命的——一个丢包会堵住后续所有数据；KCP 在 UDP 之上实现「快速重传的可靠传输」，用 10~20% 带宽冗余换 30~40% 的平均延迟降低。\nTCP 的原罪（对实时游戏）：\n1. 队头阻塞：TCP 保证字节流严格有序，第 N 个包丢了，N+1 之后的包即使已到也要在内核缓冲里排队等重传——而状态同步里「旧状态」等重传到了已经没有价值，玩家要的是「最新的那帧」；\n2. RTO 下限：TCP 重传超时最小 200ms，丢一次包就是肉眼可见的卡顿；\n3. 拥塞控制保守：丢包即降速，弱网下吞吐腰斩。\nKCP 的做法（应用层 ARQ，跑在 UDP 上）：\n1. 选择性重传：只重传真正丢的包，后续包不排队直接交给应用层；\n2. 快速重传更激进：收到 2 次跳号 ACK（TCP 是 3 次）立即重传，不等 RTO；RTO 计算系数也更激进（1.5 vs 2）；\n3. 可以关闭/弱化拥塞控制：丢包不降速，带宽换延迟；\n4. 代价：冗余流量多 10~20%，CPU 略高——移动端流量敏感场景要评估。\n同步方案与协议选择的搭配：\n1. 帧同步（Lockstep，农药类）：只传玩家操作指令，包小但严格有序+不能丢，KCP/可靠 UDP 标配；\n2. 状态同步（我们的 MMORPG）：传实体状态快照，允许丢中间帧、必须拿最新帧，适合「不可靠通道 + 应用层序号去旧」或 KCP 半可靠模式。\nNetty 支持：NioDatagramChannel（EventLoop 模型和 TCP 一致），KCP 实现（如 kcp4j）作为会话层 Handler 插在 Pipeline 里，用 conv 字段标识会话——线程模型、连接管理、业务投递全部复用 TCP 网关那套经验。\n工程要点：UDP 无连接，NAT 会话保持要更高频心跳；防火墙/运营商对 UDP 不友好要留 TCP 降级通道；压测用 tc netem 注入丢包/抖动模拟弱网。",
      point: "考察 TCP 队头阻塞致命性的理解及 KCP 以带宽换延迟的取舍逻辑。",
      approach: "先定罪 TCP：队头阻塞+RTO 200ms 对实时对战致命，讲 KCP 三板斧：选择性重传、激进快重传、弱化拥塞控制，搭配同步方案讲（帧同步必可靠/状态同步可丢帧），补 Netty DatagramChannel 复用经验与工程要点。取舍意识比参数背诵重要。",
      followups: [
        {q: "KCP 的 conv 字段起什么作用？UDP「连接」怎么管理会话超时？", a: "UDP 无连接，conv 标识一条 KCP 会话，同 IP:PORT 可复用多会话；会话超时靠应用层心跳维护，超时回收会话上下文。"},
        {q: "QUIC/HTTP3 和 KCP 的思路有什么异同？", a: "同思路：UDP 上自建可靠传输绕开 TCP 队头阻塞；QUIC 还内置 TLS1.3、多路流、连接迁移且是标准协议；KCP 更轻量可深度定制。"},
        {q: "MMORPG 状态同步用 TCP 遇到的最严重网络问题是什么？换 UDP 值得吗？", a: "丢包引发全队延迟尖峰是主痛点；但 UDP 有 NAT/运营商/防火墙成本，小团队可先做 AOI+增量优化 TCP 链路，再评估是否换。"}
      ],
      memory: "TCP 是火车：一节车厢脱轨（丢包），后面整列停运等救援（队头阻塞）。KCP 是加急快递：发现哪件丢了立刻补寄（选择性重传），其他包裹照常派送不等它——多烧点油（带宽）换时效（延迟）。",
      tags: ["UDP", "KCP", "帧同步", "实时对战", "深挖"]
    },
    {
      id: "netty-33",
      level: 2,
      q: "Netty 和 Tomcat、Undertow 的定位有什么区别？为什么你的 GM 后台（RuoYi）用 Tomcat 而游戏服用 Netty？（结合项目经历）",
      a: "核心结论：Tomcat/Undertow 是「Servlet 容器/HTTP 服务器」，为请求-响应模型而生；Netty 是「事件驱动网络框架」，为长连接和自定义协议而生——选型看通信模型，不看性能 benchmark。\n三者定位：\n1. Tomcat：Servlet 规范容器，HTTP 请求-响应模型。连接器（NIO）把请求解出来丢给工作线程池，业务在 Servlet/Spring MVC 里同步执行。生态是核心优势：Filter、Spring、安全框架、监控全套现成；\n2. Undertow：红帽的轻量容器，基于 XNIO，嵌入式启动、内存占用小、性能略优于 Tomcat，WildFly 默认。但生态和人才储备不如 Tomcat；\n3. Netty：纯框架不是容器，没有 Servlet/Filter/路由这些概念，一切自己用 Handler 搭。换来的是：长连接常驻、服务端任意时刻主动推送、任意二进制协议、I/O 与业务线程完全自定义。\n我的项目选型逻辑：\n1. GM 后台（RuoYi 重构）：典型 CRUD+RBAC 的 HTTP 短请求，SpringBoot 内嵌 Tomcat 天经地义——RuoYi 的拦截器、权限注解、Excel 导出全套建立在 Servlet 生态上，换 Netty 等于重写框架，毫无收益；\n2. 游戏服/登录服：几万玩家常驻长连接 + 服务端高频主动推送（邮件、踢人、状态同步）+ 私有二进制协议——Tomcat 的「一请求一线程」模型在十万连接下线程爆炸，且没有推送模型，只有 Netty 能承载；\n3. 混合场景：游戏服的 HTTP 管理接口（健康检查、运维指令）不引 Tomcat，直接用 Netty 起一个轻量 HTTP Pipeline（HttpServerCodec+聚合）就够，避免双容器。\n边界情况认知：Spring WebFlux + Netty 是中间态——反应式 HTTP，适合高并发 IO 密集的 HTTP 服务，但要求全链路异步（JDBC 阻塞代码放进去照样死），传统 CRUD 没必要折腾。\n一句话：通信模型决定选型——「客人点菜上菜」用容器（Tomcat/Undertow），「客人包间长住随叫随到」用框架（Netty）。",
      point: "考察按通信模型选型的架构判断力：容器与框架的本质分工。",
      approach: "先立论「选型看通信模型不看 benchmark」，三者各一句话定位，用自己两个项目对照：GM 后台 CRUD 用 Tomcat 吃生态、游戏服长连接推送必须 Netty，补 WebFlux 中间态认知，口诀收尾。双项目对照是最强说服力。",
      followups: [
        {q: "Tomcat NIO 连接器和 Netty 都是 NIO，为什么还是撑不住长连接推送？", a: "Tomcat NIO 只解决接入多路复用，业务仍走线程池同步模型，十万长连接线程爆炸；且 Servlet 模型没有服务端主动推送语义。"},
        {q: "Undertow 相比 Tomcat 的优势在什么场景才值得迁移？", a: "内存敏感的微服务/网关、嵌入式轻量部署、追求极致 HTTP 性能时值得；传统 CRUD 项目迁移收益不抵生态损失。"},
        {q: "GM 后台要加「实时推送在线人数给运营大屏」，你会怎么做？", a: "GM 后台加 WebSocket 端点推在线数；更解耦的做法是游戏服经 Kafka 上报指标，后台消费后推大屏，不影响主链路。"}
      ],
      memory: "Tomcat 是快餐店：排队点单、出餐即走，翻台率就是一切；Netty 是长租公寓：客人一住几个月，管家随时能敲门送东西（主动推送）。GM 后台是来吃饭的，游戏玩家是来住的——开的店不一样，用的家伙自然不一样。",
      tags: ["Tomcat", "Undertow", "选型对比", "游戏实战"]
    },
    {
      id: "netty-34",
      level: 2,
      q: "游戏服上线前，文件描述符（fd）和内核网络参数要做哪些调优？线上报 too many open files 怎么排查？",
      a: "核心结论：长连接服第一资源不是 CPU 也不是内存，而是 fd；调优 = ulimit 抬高 + 内核参数配套 + 上线前 checklist，排查 = lsof 分类统计找泄漏源。\nfd 预算（每连接至少 1 个 fd，再加监听端口、日志文件、Redis/Kafka/MySQL 连接、管道）：\n1. ulimit -n / limits.conf 的 nofile 提到 1024000（十万连接服的标准配置）；注意 systemd 管理的服务不吃 limits.conf，要在 unit 文件里加 LimitNOFILE=——这个坑坑过无数人，改完一定要 /proc/<pid>/limits 验证；\n2. fs.file-max（系统级总句柄）同步调大。\n内核参数 checklist（/etc/sysctl.conf）：\n1. net.core.somaxconn ≥ Netty SO_BACKLOG（1024~4096），否则重连风暴时握手完成也进不来；\n2. net.ipv4.tcp_max_syn_backlog 调大，抗重连/防半连接队列溢出；\n3. net.ipv4.tcp_tw_reuse=1 + tcp_timestamps=1：连出侧（连 Redis/Kafka/内网服务）复用 TIME_WAIT；\n4. net.ipv4.ip_local_port_range 扩到 1024~65535：服务器主动连出场景（RPC 客户端）可用端口；\n5. net.netfilter.nf_conntrack_max 调大或直接关 conntrack：K8s/iptables 环境下连接跟踪表满会静默丢包，表现为「间歇性建连失败」，极其隐蔽；\n6. vm.max_map_count（Netty 池化/大内存场景）。\ntoo many open files 排查路径：\n1. lsof -p <pid> | wc -l 看总量，逼近 ulimit 即确认；\n2. lsof -p <pid> | awk '{print $5}' | sort | uniq -c | sort -rn 按类型分类：大量 TCP ESTABLISHED=连接确实多（正常），大量 CLOSE_WAIT=对端关了而本地没 close（代码 bug 重灾区，HTTP 客户端连接池、未关闭的 Channel），大量 pipe/FIFO=线程池或日志组件泄漏；\n3. 我们游戏服的高发区：GM 指令 HTTP 调用没关 response、异常分支里 Channel 没走 closeFuture 清理；\n4. 兜底：fd 使用率接入监控（/proc/<pid>/fd 计数），80% 告警，别等报错。",
      point: "考察长连接服 fd 预算意识与 too many open files 的分类排查套路。",
      approach: "先立「fd 是第一资源」，给调优清单：nofile（含 systemd 坑）、somaxconn、tw_reuse、conntrack，排查用 lsof 分类统计找泄漏源，重点讲 CLOSE_WAIT=代码 bug，收尾 fd 监控告警。systemd 不生效与 CLOSE_WAIT 两细节是加分点。",
      followups: [
        {q: "CLOSE_WAIT 和 TIME_WAIT 分别是连接生命周期的哪个状态？哪个说明自己代码有 bug？", a: "CLOSE_WAIT 是对端已关、本地未收尾 close，堆多是自己代码 bug；TIME_WAIT 是主动关闭方的正常状态，量大是架构问题。"},
        {q: "systemd 下改了 limits.conf 不生效，正确的做法是什么？", a: "limits.conf 对 systemd 服务无效，要在 unit 文件加 LimitNOFILE=，daemon-reload 后重启服务，并用 /proc/pid/limits 验证。"},
        {q: "单机 fd 上限打满之前，通常先撞到哪个瓶颈？", a: "通常先撞 conntrack 表满（静默丢包）或单进程 ulimit，再是内存；fd 打满前网络参数往往先露馅。"}
      ],
      memory: "fd 是餐厅的餐位牌：每桌客人（连接）占一个牌，牌发完了（too many open files）门口再多人也进不来。调优三件事：加牌（ulimit）、快进快出（tw_reuse）、后厨别把牌揣兜里不还（CLOSE_WAIT 泄漏）。",
      tags: ["ulimit", "fd", "内核调优", "线上排查"]
    },
    {
      id: "netty-35",
      level: 3,
      q: "讲一下 Netty 服务端从 ServerBootstrap.bind() 到接收到第一个连接的完整过程。",
      a: "核心结论：bind() 完成「建 Channel—初始化—注册—绑定端口」四步，接入连接由 ServerBootstrapAcceptor 接力完成「child 参数装配—注册到 worker」，全过程事件驱动、异步回调。\nbind() 阶段（主线程发起，异步完成）：\n1. initAndRegister：通过 ReflectiveChannelFactory 反射 new 出 NioServerSocketChannel——构造函数里就打开了底层 fd（ServerSocketChannel.open）、设为非阻塞；\n2. init()：给这个 Channel 设置 option（SO_BACKLOG 等）和属性，并往它的 Pipeline 尾部塞入一个特殊的 Handler：ServerBootstrapAcceptor——这是连接接入的「总接待」；\n3. 把 Channel 注册到 bossGroup 的某个 EventLoop（注册也是异步任务，由 EventLoop 线程执行）；\n4. doBind0：调底层 JDK channel 绑定端口，绑定成功后激活 Channel，向 SelectionKey 注册 OP_ACCEPT 事件，fireChannelActive——此时服务才真正对外可见。\n接入第一个连接：\n1. boss EventLoop 轮询到 OP_ACCEPT → accept 出 NioSocketChannel；\n2. 这个 SocketChannel 作为「消息」在 boss 的 Pipeline 里走入站传播，到达 ServerBootstrapAcceptor.channelRead()；\n3. Acceptor 给它装配 childOption（TCP_NODELAY、水位线等）、childHandler（我们游戏服的一整条业务 Pipeline：心跳→解码→分发）；\n4. 用 childGroup（workerGroup）的 next() 策略（默认轮询）选一个 worker EventLoop，把连接注册过去——从此这条连接的所有 I/O 都由该 worker 独占；\n5. 注册成功后 channelActive 事件在 worker 线程触发，我们的连接管理逻辑（未登录限流计数初始化）从这里开始。\n为什么值得考：整个过程体现了 Netty 的核心哲学——「一切皆事件、一切皆异步回调」，服务启动和连接接入走的是同一套 Pipeline/EventLoop 机制，没有特权路径。理解了它，boss/worker 分工、Channel 与 EventLoop 绑定、异步 Future 这些概念全部串起来了。",
      point: "考察 Netty 启动源码链路的掌握：四步 bind 与 ServerBootstrapAcceptor 接力。",
      approach: "按时间线讲：反射建 Channel（开 fd）→init 塞 Acceptor→注册 boss→绑定端口激活，再讲接入首连接：accept→Acceptor 装配 child 参数→注册 worker，收尾点题「一切皆事件」的哲学。讲清 Acceptor 这个隐藏角色是区分背题与读过源码的关键。",
      followups: [
        {q: "bind() 返回时端口一定已经绑定成功了吗？主线程怎么安全地等待？", a: "不一定，返回的是异步 ChannelFuture；主线程用 future.sync()/await 或 addListener 等待绑定结果后再继续后续逻辑。"},
        {q: "ServerBootstrapAcceptor 为什么不直接在 boss 线程处理连接 I/O？", a: "boss 若处理连接 I/O，读写抖动会影响新连接 accept；专职分离保证接入能力稳定，这正是主从 Reactor 的分工意义。"},
        {q: "childHandler 是新连接共享一个实例还是每条连接 new 一个？和 @Sharable 什么关系？", a: "childHandler 是 ChannelInitializer，每连接回调 initChannel，内部 new 的 Handler 各连接独立；直接放 @Sharable 实例则全连接共享。"}
      ],
      memory: "开店流程：bind() = 租铺面（建 Channel）→ 装修挂牌（init+装 Acceptor）→ 请前台上班（注册 boss）→ 开门营业（绑定端口+OP_ACCEPT）。第一个客人进门：前台（Acceptor）发房卡（childOption/childHandler）并指派专属管家（注册到 worker），之后客人只认这位管家。",
      tags: ["ServerBootstrap", "启动流程", "源码", "深挖"]
    },
    {
      id: "netty-36",
      level: 2,
      q: "游戏长连接网关会面临哪些网络攻击和滥用？Netty 层面怎么做防护？（结合项目经历）",
      a: "核心结论：游戏网关防护分四层——内核抗 SYN、协议层防畸形包、应用层限流鉴权、业务层人机校验，Netty 的 Handler 链正好每层都有落点。\n1. 传输层：SYN flood。\n   - 海量伪造 SYN 打满半连接队列。防护在内核：net.ipv4.tcp_max_syn_backlog 调大 + tcp_syncookies=1（队列满时用 cookie 验证，不占队列）；\n   - 大流量攻击超出单机能力时只能靠接入层（高防 IP/云清洗），应用层无解——这一点面试要说清楚边界。\n2. 协议层：畸形包与资源消耗。\n   - 恶意大包：伪造 2GB length 让累积缓冲膨胀——LengthFieldBasedFrameDecoder 的 maxFrameLength 上限 + 解码器里先校验长度再分配，直接断开；\n   - 魔数校验：端口扫描器、HTTP 误连第一字节即识别并关闭，不进入后续解码浪费 CPU；\n   - 慢速攻击（Slowloris 变体：每次只发几个字节拖住连接）：读空闲超时 + 登录超时定时任务（如 30s 内未完成登录强制断开）。\n3. 应用层：未登录限流与协议白名单。\n   - 未登录连接单独计数：每连接每秒最多 N 个包（令牌桶计数器挂在 AttributeKey 上），超阈值断开并记录 IP——这是我们在游戏服防脚本刷协议的标准做法；\n   - 协议号白名单：登录完成前只允许登录/心跳两个协议号，其他一律踢线，把攻击面锁到最小；\n   - IP 级黑名单：同一 IP 高频建连/频繁发畸形包自动拉黑（内存计数 + 定期同步到 Redis 供多网关节点共享）。\n4. 业务层：登录服的人机校验（滑块/验证码）挡住脚本批量注册登录；GM 指令通道（我们的 RuoYi 后台到游戏服的 RPC）走内网隔离 + token 鉴权，绝不暴露公网。\n核心心法：防护的每一层都要「尽早、尽量便宜」地拒绝——能在魔数阶段关的连接绝不让它走到解码，能在未登录阶段踢的绝不给它进业务队列的机会。",
      point: "考察分层防护体系思维：内核、协议、应用、业务四层各尽其责。",
      approach: "先给四层框架，每层讲威胁+落点：syncookies、maxFrameLength+魔数、未登录限流+协议白名单、人机校验，收尾亮心法「尽早尽量便宜地拒绝」，主动说清应用层对带宽型 DDoS 无解的边界。边界认知体现真实经验。",
      followups: [
        {q: "syncookies 开启后有什么副作用？什么情况下不该开？", a: "开启后部分 TCP 选项（窗口缩放等）信息丢失、性能略降；正常业务队列浅时不必依赖，作 SYN 攻击的兜底即可。"},
        {q: "令牌桶限流的计数器放哪？为什么不用 Redis 集中限流？", a: "挂 Channel AttributeKey 本地计数，单连接限流无需跨节点共享；Redis 集中限流引入网络开销，被打时自身成瓶颈，得不偿失。"},
        {q: "DDoS 打满带宽时，应用层做的一切还有意义吗？完整的抗 D 体系长什么样？", a: "带宽打满时应用层无能为力；完整体系=云高防/运营商清洗→LVS/Anycast 分流→内核参数→应用限流→业务降级，层层设防。"}
      ],
      memory: "网关防护 = 机场安检四道门：门口限流闸机（内核抗 SYN）→ 证件初验（魔数+长度上限，假证直接劝返）→ 安检仪细查（未登录限流+协议白名单）→ 登机口刷脸（登录服人机校验）。原则：越靠前的门检查越便宜，坏人绝不能放到候机厅（业务层）。",
      tags: ["安全", "DDoS防护", "限流", "游戏实战"]
    }
  ]
};
