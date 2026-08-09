window.TB = window.TB || {};
window.TB["netty"] = {
  id: "netty",
  name: "Netty 与网络编程",
  icon: "🌐",
  nodes: [
 {
  "id": "netty-io-models",
  "title": "网络 IO 模型与 TCP 传输基础",
  "layer": 0,
  "depends": [],
  "covers": [
   "netty-01",
   "netty-23",
   "netty-24",
   "netty-20"
  ],
  "quiz": [
   "netty-01",
   "netty-23",
   "netty-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏长连接网关的一切起点：先搞清『等数据』和『读写数据』两个阶段会不会阻塞线程，以及 TCP 字节流为什么需要应用层自己画边界。"
   },
   {
    "t": "pre",
    "items": [
     "BIO / NIO / AIO 三种 IO 模型各自如何等待与读写数据",
     "TCP 三次握手、四次挥手与 TIME_WAIT 的产生与影响",
     "Nagle 算法与延迟 ACK 叠加出的 40ms 延迟毛刺",
     "epoll 的水平触发（LT）与边缘触发（ET）对编程模型的约束"
    ]
   },
   {
    "t": "h",
    "text": "三种 IO 模型的本质区别"
   },
   {
    "t": "p",
    "text": "面试官问 BIO、NIO、AIO 的区别，不要背定义，要抓住一个判断轴：『等待数据就绪』和『读写数据』这两个阶段是否阻塞调用线程。游戏服务器是长连接、小包高频、并发大的场景，线程模型从『连接数驱动』走向『事件驱动』是唯一出路。"
   },
   {
    "t": "list",
    "items": [
     "BIO：accept 和 read 都阻塞，一个连接必须配一个线程。连接上万时线程爆炸、上下文切换吃光 CPU——长连接网关几万在线，BIO 直接出局",
     "NIO：基于多路复用（select/poll/epoll），一个线程通过 Selector 轮询管理成千上万 Channel，数据就绪才触发读写，线程从『等数据』中解放出来",
     "AIO：读写由操作系统完成后回调通知（Proactor），连 read 都不阻塞。但 Linux 上 AIO 底层仍是 epoll 模拟，性能没有质变，Netty 在 Linux 下用 NIO/epoll 反而更快，所以 Netty 放弃了 AIO 实现",
     "游戏服结论：长连接 + 小包高频 + 并发大，NIO 事件驱动模型是最优解，这也是 Netty/Mina 成为游戏服标配的原因"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 原生 NIO 服务端骨架：一个线程管所有连接（理解事件驱动的前提）\nSelector selector = Selector.open();\nServerSocketChannel ssc = ServerSocketChannel.open();\nssc.configureBlocking(false);\nssc.bind(new InetSocketAddress(9000));\nssc.register(selector, SelectionKey.OP_ACCEPT);\n\nwhile (selector.isOpen()) {\n    // 没有就绪事件时阻塞等待，不会像 BIO 那样每条连接占一个线程\n    selector.select();\n    Iterator<SelectionKey> it = selector.selectedKeys().iterator();\n    while (it.hasNext()) {\n        SelectionKey key = it.next();\n        it.remove();\n        if (key.isAcceptable()) {\n            SocketChannel ch = ssc.accept();\n            ch.configureBlocking(false);\n            ch.register(selector, SelectionKey.OP_READ); // 新连接挂到同一个 Selector\n        } else if (key.isReadable()) {\n            // 读到数据再处理，读不到不阻塞调用线程\n        }\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <rect x=\"10\" y=\"10\" width=\"300\" height=\"280\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"160\" y=\"36\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">BIO：一线程一连接</text>\n  <rect x=\"30\" y=\"52\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"75\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">连接 1</text>\n  <rect x=\"130\" y=\"52\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"175\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">连接 2</text>\n  <rect x=\"230\" y=\"52\" width=\"70\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"265\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">连接 N</text>\n  <line x1=\"75\" y1=\"92\" x2=\"75\" y2=\"120\" stroke=\"var(--line)\" stroke-dasharray=\"4 3\"/>\n  <line x1=\"175\" y1=\"92\" x2=\"175\" y2=\"120\" stroke=\"var(--line)\" stroke-dasharray=\"4 3\"/>\n  <line x1=\"265\" y1=\"92\" x2=\"265\" y2=\"120\" stroke=\"var(--line)\" stroke-dasharray=\"4 3\"/>\n  <rect x=\"30\" y=\"120\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"75\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程 1</text>\n  <rect x=\"130\" y=\"120\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"175\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程 2</text>\n  <rect x=\"230\" y=\"120\" width=\"70\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"265\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">线程 N</text>\n  <text x=\"160\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\">每个线程阻塞在 read 上等数据</text>\n  <text x=\"160\" y=\"218\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">连接数上万 → 线程爆炸</text>\n  <text x=\"160\" y=\"240\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">上下文切换吃光 CPU</text>\n  <rect x=\"330\" y=\"10\" width=\"300\" height=\"280\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"480\" y=\"36\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">NIO：一 Selector 管万连接</text>\n  <rect x=\"350\" y=\"52\" width=\"60\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"380\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">连接 1</text>\n  <rect x=\"420\" y=\"52\" width=\"60\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"450\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">连接 2</text>\n  <rect x=\"490\" y=\"52\" width=\"60\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"520\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">连接 3</text>\n  <rect x=\"560\" y=\"52\" width=\"50\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"585\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">…N</text>\n  <line x1=\"380\" y1=\"92\" x2=\"450\" y2=\"120\" stroke=\"var(--accent)\"/>\n  <line x1=\"450\" y1=\"92\" x2=\"450\" y2=\"120\" stroke=\"var(--accent)\"/>\n  <line x1=\"520\" y1=\"92\" x2=\"450\" y2=\"120\" stroke=\"var(--accent)\"/>\n  <line x1=\"585\" y1=\"92\" x2=\"530\" y2=\"120\" stroke=\"var(--accent)\"/>\n  <rect x=\"380\" y=\"120\" width=\"150\" height=\"44\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"455\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Selector 多路复用</text>\n  <text x=\"455\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数据就绪才通知</text>\n  <line x1=\"455\" y1=\"164\" x2=\"455\" y2=\"192\" stroke=\"var(--accent)\"/>\n  <rect x=\"350\" y=\"192\" width=\"210\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"455\" y=\"216\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">一个事件驱动线程</text>\n  <text x=\"480\" y=\"250\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\">线程数不再随连接数增长</text>\n  <text x=\"480\" y=\"272\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">游戏长连接网关的基石</text>\n</svg>",
    "caption": "图：BIO 连接数驱动线程数，NIO 用事件驱动让一个线程管万连接"
   },
   {
    "t": "h",
    "text": "TCP 连接生命周期：为什么握手三次、挥手四次"
   },
   {
    "t": "p",
    "text": "三次握手是为了『双向确认收发能力并同步初始序列号』；为什么不是两次——服务端无法确认自己的发送能力被对方收到，也无法防止历史失效的连接请求突然到达造成资源浪费。四次挥手则是因为 TCP 全双工，两个方向要各自独立关闭（半关闭状态），被动方收到 FIN 时可能还有数据没发完，ACK 和 FIN 不能合并。"
   },
   {
    "t": "list",
    "items": [
     "TIME_WAIT 由主动关闭方承担，停留 2MSL（通常 60 秒）：一是确保最后一个 ACK 送达（对方重发 FIN 时还能再回一次 ACK），二是让旧报文在网络中消亡，避免串到相同四元组的新连接",
     "游戏服长连接场景 TIME_WAIT 很少，但登录服/购买服/GM 后台的 HTTP 短连接、服务器主动连 Redis/Kafka 时，服务端主动关闭会堆大量 TIME_WAIT",
     "治理三板斧：尽量让客户端先断；连出侧开 net.ipv4.tcp_tw_reuse=1 + tcp_timestamps=1；HTTP 用连接池复用；千万别用 SO_LINGER=0 发 RST 强关，会丢未送达数据",
     "LT（水平触发）：有数据就反复通知，容错好；ET（边缘触发）：只在状态变化瞬间通知一次，必须读到 EAGAIN，否则剩余数据可能再无事件导致连接饿死。Netty 的 EpollEventLoop 默认 ET"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"320\" y=\"30\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">TCP 三次握手 / 四次挥手</text>\n  <rect x=\"20\" y=\"50\" width=\"130\" height=\"30\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"85\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">客户端</text>\n  <rect x=\"490\" y=\"50\" width=\"130\" height=\"30\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"555\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">服务端</text>\n  <line x1=\"155\" y1=\"65\" x2=\"490\" y2=\"65\" stroke=\"var(--accent)\"/>\n  <text x=\"322\" y=\"58\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">1 SYN seq=x</text>\n  <line x1=\"490\" y1=\"95\" x2=\"155\" y2=\"95\" stroke=\"var(--accent)\"/>\n  <text x=\"322\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">2 SYN+ACK seq=y ack=x+1</text>\n  <line x1=\"155\" y1=\"125\" x2=\"490\" y2=\"125\" stroke=\"var(--accent)\"/>\n  <text x=\"322\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">3 ACK ack=y+1</text>\n  <rect x=\"20\" y=\"140\" width=\"600\" height=\"30\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\">握手完成，连接建立，开始业务收发</text>\n  <line x1=\"155\" y1=\"200\" x2=\"490\" y2=\"200\" stroke=\"var(--lv3)\"/>\n  <text x=\"322\" y=\"193\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">4 FIN（我发完了）</text>\n  <line x1=\"490\" y1=\"225\" x2=\"155\" y2=\"225\" stroke=\"var(--line)\"/>\n  <text x=\"322\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">5 ACK（半关闭）</text>\n  <line x1=\"490\" y1=\"250\" x2=\"155\" y2=\"250\" stroke=\"var(--lv3)\"/>\n  <text x=\"322\" y=\"243\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">6 FIN（我处理完了）</text>\n  <line x1=\"155\" y1=\"275\" x2=\"490\" y2=\"275\" stroke=\"var(--line)\"/>\n  <text x=\"322\" y=\"268\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">7 ACK → 主动方进入 TIME_WAIT（2MSL）</text>\n</svg>",
    "caption": "图：三次握手双向确认收发能力，四次挥手因全双工各自独立关闭"
   },
   {
    "t": "h",
    "text": "Nagle 算法与 TCP_NODELAY：游戏服必开的开关"
   },
   {
    "t": "p",
    "text": "Nagle 用『攒包』换带宽效率：只要还有未被 ACK 的小包，新小数据就先缓存不发。它本身是好意，但和接收方的延迟 ACK（最多等 40ms 看能否捎带 ACK）叠加，就会互相等待：发送方等 ACK 才发下一包，接收方压 40ms 才回 ACK——每个小包固定卡 40ms，玩家操作手感直接崩。所以游戏服 childOption(TCP_NODELAY, true) 是铁律。注意：它只影响发送时机，治不了粘包，粘拆包要靠应用层协议界定边界。"
   },
   {
    "t": "pits",
    "items": [
     "把粘包甩锅给 Nagle：粘包是『发送方合并 + 内核缓冲 + 接收方一次读多包』共同作用，TCP_NODELAY 只禁发送方合并，接收缓冲照样一次捞走多个包",
     "只背『select 有 1024 上限』：select 的 fd_set 上限 1024 是历史事实，但重点在每次全量拷贝轮询 O(n)，epoll 红黑树+就绪链表 O(1) 拿事件才能撑百万连接",
     "说 AIO 比 NIO 快：Linux 下 AIO 底层仍是 epoll 模拟，Netty 恰恰放弃了 AIO 实现，答反了直接露怯",
     "ET 模式读一半就 return：剩余数据对端静默时不再触发新事件，连接卡死——这是 ET 必须读到 EAGAIN 的原因，也是解码器必须用累积缓冲区的原因"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：IO 模型看『等数据/读写是否阻塞』，游戏服选 NIO 事件驱动；TCP 三次握手双向确认、四次挥手全双工半关闭，TIME_WAIT 靠『让客户端先断 + tw_reuse』治理；Nagle 与延迟 ACK 叠加出 40ms 毛刺，游戏服必开 TCP_NODELAY；LT/ET 的差异决定了解码器必须自带累积缓冲区。"
   }
  ]
 },
 {
  "id": "netty-core-thread",
  "title": "Netty 核心组件与线程模型",
  "layer": 0,
  "depends": [],
  "covers": [
   "netty-02",
   "netty-03",
   "netty-04",
   "netty-08",
   "netty-25",
   "netty-35"
  ],
  "quiz": [
   "netty-04",
   "netty-08",
   "netty-02"
  ],
  "body": [
   {
    "t": "lead",
    "text": "把 Netty 的四个核心角色和主从 Reactor 线程模型讲透，就掌握了整个框架的设计骨架——这也是游戏长连接网关选型论证的核心弹药。"
   },
   {
    "t": "pre",
    "items": [
     "Reactor 模式的三种形态演进",
     "Channel / EventLoop / ChannelFuture / ChannelHandlerContext 四大组件分工",
     "bossGroup 与 workerGroup 的职责与默认线程数",
     "JDK epoll 空轮询 bug 与 Netty 的 rebuildSelector 规避"
    ]
   },
   {
    "t": "h",
    "text": "四大组件各司其职"
   },
   {
    "t": "list",
    "items": [
     "Channel：网络连接的抽象（NioSocketChannel / NioServerSocketChannel），封装底层 Socket，提供异步 read/write/close，每条 Channel 有独立 Pipeline 和属性容器（AttributeKey，可挂玩家会话对象）",
     "EventLoop：单线程执行器，一个 EventLoop 绑定一个线程，负责多条 Channel 的 I/O 事件与任务队列；Channel 生命周期内只注册到一个 EventLoop，同一连接所有事件串行执行、天然免锁",
     "ChannelFuture：所有 I/O 操作异步返回的『回执』，用 addListener 注册回调感知完成/失败，绝不 get() 阻塞等待（EventLoop 里 sync/await 自己等自己会死锁）",
     "ChannelHandlerContext：Handler 与 Pipeline 的关联上下文，决定事件传播起点：ctx.write() 从当前位置逆向出站，channel.write() 从尾部走完整条链"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">四大组件关系：司机、车、工位牌与回执</text>\n  <rect x=\"30\" y=\"50\" width=\"150\" height=\"150\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"45\" y=\"65\" width=\"120\" height=\"34\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"105\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">EventLoop</text>\n  <text x=\"105\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">绑定 1 个线程</text>\n  <text x=\"105\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">管理 N 条 Channel</text>\n  <text x=\"105\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">事件串行 → 免锁</text>\n  <text x=\"105\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">终身绑定不换司机</text>\n  <rect x=\"220\" y=\"50\" width=\"150\" height=\"150\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"235\" y=\"65\" width=\"120\" height=\"34\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"295\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Channel</text>\n  <text x=\"295\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接载体</text>\n  <text x=\"295\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">带 Pipeline + Attribute</text>\n  <text x=\"295\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">AttributeKey 挂玩家会话</text>\n  <text x=\"295\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">玩家 ID 也能反查</text>\n  <rect x=\"410\" y=\"50\" width=\"200\" height=\"150\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"510\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Pipeline 责任链</text>\n  <rect x=\"425\" y=\"92\" width=\"170\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"510\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Handler A（解码）</text>\n  <rect x=\"425\" y=\"124\" width=\"170\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"510\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Handler B（路由）</text>\n  <rect x=\"425\" y=\"156\" width=\"170\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"510\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Context 是每个 Handler 的工位牌</text>\n  <text x=\"510\" y=\"205\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ChannelFuture 是所有异步操作的取餐号</text>\n  <line x1=\"180\" y1=\"125\" x2=\"220\" y2=\"125\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr1)\"/>\n  <line x1=\"370\" y1=\"125\" x2=\"410\" y2=\"125\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n</svg>",
    "caption": "图：EventLoop 是司机、Channel 是车、Pipeline 是座位排布、Future 是回执"
   },
   {
    "t": "h",
    "text": "主从 Reactor：boss 管接入，worker 管读写"
   },
   {
    "t": "p",
    "text": "Netty 采用主从多线程 Reactor：bossGroup 只负责 accept 新连接（一般 1 个线程就够），把 accept 出来的 Channel 轮询注册到 workerGroup 的某个 EventLoop；此后这条连接终身由该 EventLoop 服务，天然避免了同一连接的并发问题。workerGroup 默认线程数 = CPU 核数 × 2，由源码 DEFAULT_EVENT_LOOP_THREADS = Math.max(1, SystemPropertyUtil.getInt(\"io.netty.eventLoopThreads\", NettyRuntime.availableProcessors() * 2)) 得出。红线：EventLoop 一肩挑 I/O 事件、普通任务、定时任务三类，任何一类耗时都会挤压另外两类——DB/Redis/重结算绝不能跑在 EventLoop 上。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 游戏服长连接网关启动骨架\nEventLoopGroup bossGroup = new NioEventLoopGroup(1);       // 只 accept，1 个线程够\nEventLoopGroup workerGroup = new NioEventLoopGroup();      // 默认 CPU 核数 * 2\nServerBootstrap b = new ServerBootstrap();\nb.group(bossGroup, workerGroup)\n .channel(NioServerSocketChannel.class)\n .option(ChannelOption.SO_BACKLOG, 1024)                    // 全连接队列\n .childOption(ChannelOption.TCP_NODELAY, true)              // 关 Nagle，小包即发\n .childHandler(new ChannelInitializer<SocketChannel>() {\n     @Override\n     protected void initChannel(SocketChannel ch) {\n         ch.pipeline()\n           .addLast(new IdleStateHandler(90, 0, 0))         // 心跳读空闲检测\n           .addLast(new GameFrameDecoder())                  // 粘拆包解码器\n           .addLast(new GameDispatchHandler());              // 协议号路由\n     }\n });\nChannelFuture f = b.bind(9000).sync();                     // 主线程阻塞等端口就绪\n// 业务绝不能直接跑在 EventLoop：解码后投递 Disruptor / 业务线程池\n// EventLoop 的默认线程数公式见源码：availableProcessors() * 2"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">主从多线程 Reactor（Netty 采用）</text>\n  <rect x=\"20\" y=\"50\" width=\"140\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"90\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">bossGroup（主）</text>\n  <rect x=\"35\" y=\"90\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"90\" y=\"114\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">EventLoop 1</text>\n  <text x=\"90\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只 accept 新连接</text>\n  <rect x=\"35\" y=\"160\" width=\"110\" height=\"70\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"90\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ServerSocketChannel</text>\n  <text x=\"90\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OP_ACCEPT</text>\n  <text x=\"90\" y=\"222\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">accept 后分发</text>\n  <rect x=\"240\" y=\"50\" width=\"380\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"430\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">workerGroup（从）</text>\n  <rect x=\"260\" y=\"90\" width=\"110\" height=\"130\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"315\" y=\"112\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">EventLoop 1</text>\n  <text x=\"315\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接 1..n</text>\n  <text x=\"315\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读/写/编解码</text>\n  <text x=\"315\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">同连接同线程</text>\n  <text x=\"315\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">免锁串行</text>\n  <rect x=\"385\" y=\"90\" width=\"110\" height=\"130\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"440\" y=\"112\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">EventLoop 2</text>\n  <text x=\"440\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接 2..m</text>\n  <text x=\"440\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读/写/编解码</text>\n  <text x=\"440\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">同连接同线程</text>\n  <text x=\"440\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">免锁串行</text>\n  <rect x=\"510\" y=\"90\" width=\"95\" height=\"130\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"557\" y=\"112\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">EventLoop N</text>\n  <text x=\"557\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接…</text>\n  <text x=\"557\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读/写/编解码</text>\n  <text x=\"557\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">线程数默认核数×2</text>\n  <path d=\"M160 110 C 200 60, 240 60, 260 120\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <path d=\"M160 150 C 200 180, 240 180, 260 190\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <path d=\"M160 190 C 200 240, 240 240, 260 230\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"210\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">轮询分配：连接与 EventLoop 终身绑定</text>\n  <text x=\"210\" y=\"282\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">boss 只管开门，业务 I/O 全在 worker</text>\n</svg>",
    "caption": "图：boss 专职 accept，worker 分组分管连接读写，连接与 EventLoop 终身绑定"
   },
   {
    "t": "h",
    "text": "EventLoop 的任务队列与 epoll 空轮询 bug"
   },
   {
    "t": "p",
    "text": "EventLoop 每轮循环做三件事：select() 等 I/O 事件 → 处理就绪事件 → 执行任务队列。ioRatio（默认 50）控制 I/O 时间占比上限，防止任务饿死 I/O。任务队列默认无界（LinkedBlockingQueue），不会拒绝只会积压——业务线程回写速度超过网络发送能力时，pendingTasks 持续上涨直至延迟爆炸或 OOM，必须监控。另外，JDK Selector 在 Linux/epoll 实现下可能在无就绪事件时 select 立即返回 0，导致 CPU 100% 空转；Netty 用『连续空轮询计数达到 512 次（-Dio.netty.selectorAutoRebuildThreshold 可调）→ rebuildSelector() 换新 Selector』规避，这就是大连接量游戏服推荐 EpollEventLoop（native epoll，不走 JDK Selector）的原因之一。"
   },
   {
    "t": "pits",
    "items": [
     "在 EventLoop 线程里 future.sync()/await()：等于自己等自己执行任务，永久死锁；正确做法是 addListener 回调",
     "把 DB/Redis 查询写在 Handler 里：一个慢 SQL 拖垮该 EventLoop 上的几千条连接，全服集体卡顿——业务必须投递到 Disruptor/业务线程池",
     "背『workerGroup 默认为核数×1』：源码是 Math.max(1, availableProcessors() * 2)，且可用 -Dio.netty.eventLoopThreads 覆盖",
     "以为 EventLoop 任务队列有拒绝策略：它默认无界，不拒绝只积压，回包延迟上涨到 OOM 前没有报错，要靠 pendingTasks 监控提前发现",
     "忽略 bossGroup 也耗线程：boss 线程数配多了没意义（一个监听端口），但 EventLoop 假死时 heartbeat 事件不触发，需登录服巡检兜底"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：四大组件一句话——Channel 是车、EventLoop 是终身司机、Future 是回执、Context 是工位牌；主从 Reactor 让 boss 只开门、worker 分组分管读写，同连接同线程免锁；EventLoop 一肩挑三类任务，ioRatio 分配时间，任务队列无界必须监控；epoll 空轮询由『512 次重建 Selector』规避。"
   }
  ]
 },
 {
  "id": "netty-pipeline-codec",
  "title": "ChannelPipeline 与粘包拆包编解码",
  "layer": 1,
  "depends": [
   "netty-core-thread"
  ],
  "covers": [
   "netty-05",
   "netty-06",
   "netty-12"
  ],
  "quiz": [
   "netty-06",
   "netty-12",
   "netty-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Pipeline 是 Netty 的脊梁，粘包拆包是长连接游戏服必须正面解决的第一道关卡——这一篇把它们串成一条链路讲透。"
   },
   {
    "t": "pre",
    "items": [
     "Channel 与 ChannelHandlerContext 的基本概念",
     "TCP 是字节流协议、没有消息边界这一本质",
     "入站/出站 Handler 的职责划分",
     "ByteToMessageDecoder 累积缓冲区机制"
    ]
   },
   {
    "t": "h",
    "text": "Pipeline：Handler 的双向链表"
   },
   {
    "t": "p",
    "text": "每个 Channel 创建时绑定一个 ChannelPipeline，内部是 HeadContext ↔ 各 Handler ↔ TailContext 的双向链表。Head 处理底层 I/O（真正的读写、bind），Tail 兜底（释放未处理消息、打印异常）。传播规则一句话：入站事件（channelRead、channelActive、exceptionCaught）从头到尾；出站事件（write、flush、connect、close）从尾到头；若 Handler 不调用 ctx.fireChannelRead()，事件在此停止传播。游戏服的典型 Pipeline：IdleStateHandler（心跳）→ 帧解码器（粘拆包）→ 协议解码器（字节→协议对象）→ 业务分发 Handler（协议号路由投递 Disruptor）；出站方向是协议编码器 → 加密 Handler。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">Pipeline：入站从头到尾，出站从尾到头</text>\n  <rect x=\"20\" y=\"52\" width=\"150\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"95\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">入站（读）</text>\n  <rect x=\"35\" y=\"92\" width=\"120\" height=\"32\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"95\" y=\"113\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Head（底层 I/O）</text>\n  <line x1=\"95\" y1=\"124\" x2=\"95\" y2=\"140\" stroke=\"var(--accent)\"/>\n  <rect x=\"35\" y=\"140\" width=\"120\" height=\"32\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"95\" y=\"161\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">心跳 IdleState</text>\n  <line x1=\"95\" y1=\"172\" x2=\"95\" y2=\"188\" stroke=\"var(--accent)\"/>\n  <rect x=\"35\" y=\"188\" width=\"120\" height=\"32\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"95\" y=\"209\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">帧解码（切包）</text>\n  <rect x=\"220\" y=\"52\" width=\"200\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">业务区</text>\n  <rect x=\"235\" y=\"92\" width=\"170\" height=\"32\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"113\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">协议解码（入站）</text>\n  <rect x=\"235\" y=\"140\" width=\"170\" height=\"32\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"320\" y=\"161\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">业务分发（入站）</text>\n  <rect x=\"235\" y=\"188\" width=\"170\" height=\"32\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\"/>\n  <text x=\"320\" y=\"209\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">协议编码（出站）</text>\n  <rect x=\"440\" y=\"52\" width=\"180\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"530\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">出站（写）</text>\n  <rect x=\"455\" y=\"92\" width=\"150\" height=\"32\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\"/>\n  <text x=\"530\" y=\"113\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">加密（出站）</text>\n  <line x1=\"530\" y1=\"124\" x2=\"530\" y2=\"140\" stroke=\"var(--lv2)\"/>\n  <rect x=\"455\" y=\"140\" width=\"150\" height=\"32\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\"/>\n  <text x=\"530\" y=\"161\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Tail（兜底释放）</text>\n  <line x1=\"530\" y1=\"172\" x2=\"530\" y2=\"188\" stroke=\"var(--lv2)\"/>\n  <rect x=\"455\" y=\"188\" width=\"150\" height=\"32\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"530\" y=\"209\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Head（写 Socket）</text>\n  <path d=\"M170 170 C 200 170, 200 108, 235 108\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <path d=\"M405 170 C 430 170, 430 204, 455 204\" fill=\"none\" stroke=\"var(--lv2)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <text x=\"320\" y=\"248\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">入站方向 fireChannelRead 传递，出站方向 write 从当前位置逆向</text>\n  <text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不调 fire 就中断；ctx.write 从当前 Handler 开始，channel.write 从尾部开始</text>\n</svg>",
    "caption": "图：入站 Head→Tail，出站 Tail→Head，业务 Handler 位于中间"
   },
   {
    "t": "h",
    "text": "粘包拆包：TCP 是水管，不是快递柜"
   },
   {
    "t": "p",
    "text": "TCP 是字节流协议，没有消息边界，粘包拆包是『发送方 Nagle 合并 + 内核缓冲拆分 + 接收方一次读多包/一包分多次读』共同作用的结果，必须由应用层自己界定消息边界。Netty 提供四种解码器对应四种方案：FixedLengthFrameDecoder 定长切分、LineBasedFrameDecoder/DelimiterBasedFrameDecoder 按分隔符、LengthFieldBasedFrameDecoder 长度字段法（生产主流）、自定义继承 ByteToMessageDecoder。关键认知：解码器内部维护累积缓冲区（cumulation），数据不够一个完整包就留着等下一批（处理拆包），一次读到多个包就循环解码逐个产出（处理粘包）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">累积缓冲区：拆包等数据、粘包循环解</text>\n  <text x=\"80\" y=\"60\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">字节流到达</text>\n  <rect x=\"20\" y=\"72\" width=\"120\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"32\" y=\"84\" width=\"96\" height=\"30\" rx=\"5\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"80\" y=\"104\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">包 A（残缺）</text>\n  <rect x=\"32\" y=\"122\" width=\"96\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"80\" y=\"142\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">包 A 剩余</text>\n  <rect x=\"32\" y=\"160\" width=\"96\" height=\"20\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"80\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">新数据追加</text>\n  <text x=\"80\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">够了就解出 A</text>\n  <line x1=\"140\" y1=\"132\" x2=\"200\" y2=\"132\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"200\" y=\"72\" width=\"200\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"300\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">decode 循环</text>\n  <rect x=\"215\" y=\"106\" width=\"170\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"300\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不够 → return 等下一批</text>\n  <rect x=\"215\" y=\"138\" width=\"170\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"300\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">够 → out.add 消息，继续循环</text>\n  <text x=\"300\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">markReaderIndex/resetReaderIndex 保证读一半不丢位置</text>\n  <line x1=\"400\" y1=\"132\" x2=\"460\" y2=\"132\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"460\" y=\"72\" width=\"160\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"540\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">下一个 Handler</text>\n  <rect x=\"475\" y=\"106\" width=\"130\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"540\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">业务协议对象</text>\n  <rect x=\"475\" y=\"138\" width=\"130\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"540\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">逐个 fireChannelRead</text>\n  <text x=\"540\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">粘包：一次产多个</text>\n  <text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\">数据不足一个完整包 → 留在 cumulation，绝不丢字节</text>\n  <text x=\"320\" y=\"266\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">这就是『TCP 是字节流』带来的必然：边界必须应用层自己划</text>\n</svg>",
    "caption": "图：解码器用累积缓冲区承接不完整字节流，循环产出完整消息"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 长度字段法：生产环境主流，对应「魔数+长度+协议号+body」\npipeline.addLast(new LengthFieldBasedFrameDecoder(\n        1024 * 1024,          // maxFrameLength：防恶意大包\n        2,                    // lengthFieldOffset：长度字段偏移（跳过魔数 2B）\n        4,                    // lengthFieldLength：长度字段占 4B\n        -6,                   // lengthAdjustment：长度不含头部，补偿回去\n        6));                  // initialBytesToStrip：解码后剥离 6 字节头部\n\n// 或者继承 ByteToMessageDecoder 自己写（坑点全在这里）\npublic class GameDecoder extends ByteToMessageDecoder {\n    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {\n        if (in.readableBytes() < 10) return;           // 头部都不够：return 等数据\n        in.markReaderIndex();                          // 标记起点，读一半不够要 reset\n        short magic = in.readShort();\n        if (magic != 0x4E47) { ctx.close(); return; }  // 魔数不对直接断连\n        int length = in.readInt();\n        if (length < 0 || length > 1024 * 1024) {      // 先校验上限再读，防伪造 2GB\n            ctx.close(); return;\n        }\n        if (in.readableBytes() < 4 + length) {         // body 不够：回到标记点等下一批\n            in.resetReaderIndex();\n            return;\n        }\n        int protocolId = in.readInt();\n        byte[] body = new byte[length];\n        in.readBytes(body);\n        out.add(new GameMessage(protocolId, body));    // 解出一个完整消息\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "decode() 里不做 markReaderIndex/reset：读一半发现数据不够，下次从错误位置继续读，协议全乱——这是手写解码器第一坑",
     "读 length 后先按 length 分配再校验：一个伪造的 2GB length 直接撑爆 cumulation 触发 OOM；必须先校验上限再分配",
     "把解码出的 ByteBuf 缓存到 decode 之外：cumulation 会被复用/释放，要留存必须 copy() 或 retainedDuplicate()",
     "忘 release：SimpleChannelInboundHandler 会自动 release，但 ChannelInboundHandlerAdapter 里接管消息后必须自己 release，业务分发 Handler 是内存泄漏高发区",
     "误以为关掉 Nagle 能根治粘包：TCP_NODELAY 只禁发送方合并小包，接收缓冲一次读多包照样粘包"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Pipeline 是双向链表，入站从头到尾、出站从尾到头，fire 决定是否继续传播；粘包拆包是 TCP 字节流本质决定的，应用层用长度字段法（生产主流）+ 累积缓冲区解决；手写 ByteToMessageDecoder 记住 mark/reset、先验长度再分配、引用计数交接三条纪律。"
   }
  ]
 },
 {
  "id": "netty-bytebuf",
  "title": "ByteBuf 内存模型与零拷贝",
  "layer": 1,
  "depends": [
   "netty-core-thread"
  ],
  "covers": [
   "netty-09",
   "netty-11",
   "netty-19"
  ],
  "quiz": [
   "netty-09",
   "netty-11",
   "netty-19"
  ],
  "body": [
   {
    "t": "lead",
    "text": "ByteBuf 是 Netty 的数据载体，双指针、动态扩容、引用计数、池化四大改进解决 JDK ByteBuffer 的全部痛点；零拷贝和内存泄漏排查则是游戏服性能与稳定性的分水岭。"
   },
   {
    "t": "pre",
    "items": [
     "JDK ByteBuffer 单指针与 flip() 的痛",
     "引用计数 retain/release 的基本概念",
     "堆内 vs 直接（堆外）内存的取舍",
     "PooledByteBufAllocator 的池化机制"
    ]
   },
   {
    "t": "h",
    "text": "四大改进：双指针、扩容、引用计数、池化"
   },
   {
    "t": "list",
    "items": [
     "双指针：ByteBuffer 只有一个 position，读写切换要 flip()（最常见的 bug 来源）；ByteBuf 用 readerIndex + writerIndex，可读字节数 = writerIndex - readerIndex，读写互不干扰",
     "动态扩容：ByteBuffer 容量固定写满要手动处理；ByteBuf 类似 ArrayList 自动扩容（上限 maxCapacity）",
     "引用计数：继承 ReferenceCounted，retain()/release() 手动管理生命周期；GC 只回收对象壳不归还池化内存，必须 release 归零才回池——这是与 JDK 最本质的设计差异",
     "池化分配器：4.1 起默认 PooledByteBufAllocator（-Dio.netty.allocator.type 可改，Android 例外为 unpooled），基于 jemalloc 思想分 arena/chunk/size-class 复用直接内存，高频小包场景极大缓解 GC 与堆外分配开销",
     "派生视图：slice() 共享子区域、duplicate() 共享全区域、CompositeByteBuf 逻辑合并不拷贝，为零拷贝打基础"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">ByteBuf 双指针结构</text>\n  <rect x=\"20\" y=\"48\" width=\"600\" height=\"46\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">一段连续内存（堆内 byte[] 或堆外 Direct）</text>\n  <rect x=\"40\" y=\"104\" width=\"70\" height=\"40\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"75\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">已读区</text>\n  <rect x=\"110\" y=\"104\" width=\"200\" height=\"40\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"210\" y=\"128\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">可读区（未读数据）</text>\n  <rect x=\"310\" y=\"104\" width=\"200\" height=\"40\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"410\" y=\"128\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">可写区</text>\n  <line x1=\"110\" y1=\"88\" x2=\"110\" y2=\"100\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <line x1=\"310\" y1=\"88\" x2=\"310\" y2=\"100\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"110\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--accent)\">readerIndex</text>\n  <text x=\"310\" y=\"80\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--accent)\">writerIndex</text>\n  <text x=\"210\" y=\"168\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\">readableBytes = writerIndex - readerIndex</text>\n  <rect x=\"20\" y=\"190\" width=\"600\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">扩容与回收纪律</text>\n  <text x=\"320\" y=\"236\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">写满自动扩容到 maxCapacity；discardReadBytes 前移未读数据腾空间（代价是一次拷贝，勿频繁调）</text>\n  <text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\">池化内存：必须 retain/release 成对，GC 不回收池化内存</text>\n</svg>",
    "caption": "图：readerIndex 与 writerIndex 两个指针划出可读区与可写区，读写互不干扰"
   },
   {
    "t": "h",
    "text": "零拷贝：能省则省的优化思想"
   },
   {
    "t": "p",
    "text": "零拷贝不是『零次拷贝』，而是『能不拷就不拷』。OS 层：sendfile/mmap 让文件数据直接在内核态送达 Socket，Netty 的 FileRegion（transferTo）用 sendfile，适合 GM 后台大文件下载。框架层更常用：CompositeByteBuf 把多个 Buf 逻辑合并（协议头+body 合并下发，广播时 body 只存一份）；slice()/duplicate() 共享底层内存只改读写索引；直接内存 + 池化让 I/O 直接读写堆外，避免堆↔堆外一次拷贝（Socket 只认堆外内存，堆内 Buf 写 Socket 前必被拷一次）。MMORPG 状态同步广播同一条战斗 body 给千人，用 CompositeByteBuf 复用就省掉上千次 memcpy 和上千份临时对象。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">零拷贝：同一份 body 广播给 N 个玩家</text>\n  <rect x=\"20\" y=\"48\" width=\"150\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"95\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">body 只存一份</text>\n  <text x=\"95\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">玩家 1 的协议头</text>\n  <text x=\"95\" y=\"112\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">玩家 2 的协议头…</text>\n  <line x1=\"170\" y1=\"83\" x2=\"210\" y2=\"83\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"210\" y=\"48\" width=\"190\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"305\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">CompositeByteBuf</text>\n  <text x=\"305\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">逻辑合并，零拷贝拼接</text>\n  <text x=\"305\" y=\"112\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">每连接 retain 一次</text>\n  <line x1=\"400\" y1=\"70\" x2=\"440\" y2=\"70\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <line x1=\"400\" y1=\"96\" x2=\"440\" y2=\"96\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <rect x=\"440\" y=\"48\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"530\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">玩家 1 Channel</text>\n  <text x=\"530\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">玩家 2 Channel</text>\n  <text x=\"530\" y=\"112\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">…N 条连接</text>\n  <rect x=\"20\" y=\"140\" width=\"600\" height=\"100\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"164\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">不这么做的代价</text>\n  <text x=\"320\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">N 份独立拷贝 → 千次 memcpy + 千份临时对象 GC 压力</text>\n  <text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\">引用计数纪律：每发一个 Channel 前 retain 一次，写完由出站缓冲 release，计数归零才真正回收</text>\n  <text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">断开的 Channel 未写完部分由 Netty 关闭时统一释放</text>\n</svg>",
    "caption": "图：CompositeByteBuf 共享 body，广播场景把 N 份拷贝降为 1 份"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 广播共享 body：引用计数成对 retain/release\npublic void broadcast(ByteBuf body) {\n    for (Channel ch : onlineChannels) {\n        if (!ch.isActive() || !ch.isWritable()) continue;  // 慢连接跳过\n        ByteBuf frame = ch.alloc().buffer();\n        frame.writeShort(0x4E47);       // 魔数\n        frame.writeInt(body.readableBytes());\n        frame.writeInt(broadcastProtocolId);\n        ByteBuf out = Unpooled.wrappedBuffer(frame, body.retainedDuplicate());\n        // retainedDuplicate：共享内存 + 引用计数 +1，随写完成自动 release\n        ch.writeAndFlush(out);\n    }\n    body.release();   // 广播完释放原始 body 的引用\n}\n\n// 排查堆外泄漏三板斧（netty-19 的核心）\n// 1. -Dio.netty.leakDetectionLevel=ADVANCED 打开泄漏检测器，拿分配堆栈\n// 2. 对照纪律自查：接管消息后 release、retain/release 成对、try-catch 里走 finally\n// 3. 无法定位时临时 -Dio.netty.allocator.type=unpooled 止血，让泄漏只影响 GC\n// 监控：PooledByteBufAllocator.DEFAULT.metric() 观察直接内存曲线"
   },
   {
    "t": "pits",
    "items": [
     "堆内 Buf 直接写 Socket：Socket 只认堆外内存，Netty 会先拷贝到临时直接缓冲区——高频链路应直接用直接内存 + 池化，省掉这次拷贝",
     "只依赖 GC 管理 ByteBuf：GC 只回收对象壳，池化内存必须 release 归零才回池，只进不出的结果是堆外 OOM",
     "discardReadBytes 频繁调用：每次都是一次内存拷贝，密集调用反而伤性能；用 Compact 或合理时机",
     "堆外泄漏只看 JVM 堆：现象是 JVM 堆稳定但 RSS/进程内存持续涨，要用 PlatformDependent.usedDirectMemory() 或 NMT 看 off-heap",
     "以为零拷贝是零次拷贝：面试里把零拷贝吹成完全不拷贝会翻车，要讲清『省的是哪次拷贝』（用户态/内核态/堆内外）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：ByteBuf 用双指针解决 flip、自动扩容、引用计数 + 池化接管生命周期，4.1 默认 PooledByteBufAllocator；零拷贝是能省则省，CompositeByteBuf/slice/直接内存各省一次拷贝；内存泄漏排查三板斧——开 leakDetectionLevel 拿堆栈、对照 retain/release 纪律自查、unpooled 止血。"
   }
  ]
 },
 {
  "id": "netty-heartbeat",
  "title": "心跳保活与断线重连",
  "layer": 1,
  "depends": [
   "netty-core-thread",
   "netty-io-models"
  ],
  "covers": [
   "netty-07",
   "netty-13",
   "netty-14",
   "netty-18",
   "netty-34"
  ],
  "quiz": [
   "netty-07",
   "netty-13",
   "netty-14"
  ],
  "body": [
   {
    "t": "lead",
    "text": "心跳不是单个 Handler，而是『检测—判定—清理—恢复』的完整闭环；配套的连接管理双映射与 fd 调优，才是长连接游戏服稳定运营的真功夫。"
   },
   {
    "t": "pre",
    "items": [
     "TCP 感知不到对端拔网线/进程崩溃（非四次挥手）",
     "NAT/运营商对空闲连接的回收机制",
     "IdleStateHandler 三个超时参数语义",
     "ChannelGroup、AttributeKey、ConcurrentHashMap 连接管理工具"
    ]
   },
   {
    "t": "h",
    "text": "为什么必须做应用层心跳"
   },
   {
    "t": "list",
    "items": [
     "协议层：TCP 只在四次挥手时感知关闭，对端直接断电/断网时本端连接一直 ESTABLISHED，服务器白白维持几万个死连接耗尽会话内存",
     "网络层：家用路由和运营商 NAT 会清理长时间无流量的映射表（常见 5~15 分钟），不发包连接就『幽灵断开』",
     "业务层：要判断玩家在线状态，驱动排行榜、好友状态、GM 在线统计与掉线结算",
     "TCP KeepAlive 为什么不够：默认 2 小时才首次探测，远慢于业务容忍度，穿不透所有中间设备，无业务语义，只能作兜底"
    ]
   },
   {
    "t": "h",
    "text": "IdleStateHandler 与心跳闭环"
   },
   {
    "t": "p",
    "text": "Netty 用 IdleStateHandler 三个参数 readerIdleTime / writerIdleTime / allIdleTime（秒）触发 IdleStateEvent，在业务 Handler 的 userEventTriggered() 里捕获处理。merge 类游戏的成熟参数：客户端每 30 秒发心跳，服务端读空闲 90 秒（容忍丢 2 次）判定离线；断线后客户端指数退避重连（1s、2s、4s…上限 30s），走登录服重新拿 token 恢复会话，同时踢掉旧连接防双在线。注意：IdleStateHandler 内部用 EventLoop 定时任务，十万连接下每条连接一次调度开销可接受，但回调里绝不能做重业务。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Pipeline 首个 Handler 挂读空闲检测\npipeline.addLast(new IdleStateHandler(90, 0, 0, TimeUnit.SECONDS));\n\n// 业务 Handler 捕获心跳事件\n@Override\npublic void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {\n    if (evt instanceof IdleStateEvent) {\n        // 读空闲超时：判定玩家掉线，走完整闭环\n        Long playerId = ctx.channel().attr(ATTR_PLAYER_ID).get();\n        if (playerId != null) {\n            // 1 解绑：移除 Channel 与玩家 ID 的双向映射，防重复登录冲突\n            onlineChannels.remove(playerId, ctx.channel());\n            // 2 业务掉线：保存数据、清在线标记、通知好友、排行榜下线\n            playerService.onPlayerOffline(playerId);\n        }\n        // 3 清理：关闭 Channel 回收资源\n        ctx.close();\n        return;\n    }\n    super.userEventTriggered(ctx, evt);\n}\n\n// 客户端心跳：每 30s 发心跳协议，重连走 token 恢复会话\n// 服务端兜底：登录服巡检最后活跃时间超阈值的连接强杀，防 EventLoop 假死不触发事件"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">心跳闭环四步：检测 → 判定 → 清理 → 恢复</text>\n  <rect x=\"30\" y=\"50\" width=\"130\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"95\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">① 检测</text>\n  <text x=\"95\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">IdleStateHandler</text>\n  <text x=\"95\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读空闲 90s</text>\n  <line x1=\"160\" y1=\"95\" x2=\"200\" y2=\"95\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"200\" y=\"50\" width=\"130\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"265\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">② 判定</text>\n  <text x=\"265\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">userEventTriggered</text>\n  <text x=\"265\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连续 3 次未心跳</text>\n  <line x1=\"330\" y1=\"95\" x2=\"370\" y2=\"95\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"370\" y=\"50\" width=\"130\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"435\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">③ 清理</text>\n  <text x=\"435\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">解绑映射 + 掉线业务</text>\n  <text x=\"435\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ctx.close 回收</text>\n  <line x1=\"500\" y1=\"95\" x2=\"540\" y2=\"95\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"540\" y=\"50\" width=\"80\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"580\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">④ 恢复</text>\n  <text x=\"580\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">token 重连</text>\n  <text x=\"580\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">会话快照</text>\n  <path d=\"M580 140 C 580 220, 95 220, 95 150\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\" stroke-dasharray=\"6 4\" marker-end=\"url(#arr2)\"/>\n  <text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">玩家重连：登录服拿 token → 校验 → 恢复场景位置与未结算状态</text>\n  <rect x=\"20\" y=\"215\" width=\"600\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">配套工程细节</text>\n  <text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">重复登录：新连接登录成功推『异地登录』给旧连接并踢下线，保证同账号唯一在线</text>\n  <text x=\"320\" y=\"280\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">移动端：阈值放宽 + 指数退避错开重连洪峰，防惊群冲击登录服</text>\n</svg>",
    "caption": "图：心跳是完整闭环，与业务会话联动，少一步就是线上事故"
   },
   {
    "t": "h",
    "text": "连接管理双映射与 fd 调优"
   },
   {
    "t": "p",
    "text": "连接管理核心是两个映射加一个广播容器：ConcurrentHashMap<Long, Channel>（玩家ID→连接，推送用）和 Channel 上的 AttributeKey<Long>（连接→玩家ID，断连回调里反查用）；断连清理用 remove(k, v) 带值比较，防止旧连接的 channelInactive 误删新连接刚建立的映射。广播用 DefaultChannelGroup（ConcurrentMap 包装 + writeAndFlush 批量 + channelInactive 自动移除）。同时，长连接服第一资源是 fd：ulimit nofile 提到 1024000，systemd 服务要在 unit 里加 LimitNOFILE（改 limits.conf 不生效）；配套 somaxconn ≥ backlog、tcp_tw_reuse=1、防 nf_conntrack 表满；线上 lsof 分类统计定位 too many open files，CLOSE_WAIT 堆积基本是自己代码 bug。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">连接管理：双向映射 + 广播容器</text>\n  <rect x=\"30\" y=\"50\" width=\"180\" height=\"140\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"120\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">ConcurrentHashMap</text>\n  <text x=\"120\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">playerId → Channel</text>\n  <rect x=\"45\" y=\"106\" width=\"150\" height=\"28\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"120\" y=\"125\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">10001 → ChannelA</text>\n  <rect x=\"45\" y=\"140\" width=\"150\" height=\"28\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"120\" y=\"159\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">10002 → ChannelB</text>\n  <text x=\"120\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">推送接口只用 ID → 查正向映射</text>\n  <rect x=\"250\" y=\"50\" width=\"180\" height=\"140\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"340\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">AttributeKey</text>\n  <text x=\"340\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Channel → playerId</text>\n  <rect x=\"265\" y=\"106\" width=\"150\" height=\"28\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"340\" y=\"125\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ChannelA → 10001</text>\n  <rect x=\"265\" y=\"140\" width=\"150\" height=\"28\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"340\" y=\"159\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ChannelB → 10002</text>\n  <text x=\"340\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">断连回调只有 Channel → 反查 ID</text>\n  <rect x=\"470\" y=\"50\" width=\"150\" height=\"140\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"545\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">ChannelGroup</text>\n  <text x=\"545\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全服公告 / 活动推送</text>\n  <text x=\"545\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">批量 writeAndFlush</text>\n  <text x=\"545\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">断连自动移除</text>\n  <text x=\"545\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">并发删除用 remove(k, v)</text>\n  <text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\">坑：断连清理与重新登录并发时，remove(k) 会误删新连接映射，必须 remove(k, v) 带值比较</text>\n  <text x=\"320\" y=\"242\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">踢人时序：先推被踢协议 → 延迟几百毫秒再 close，避免协议包和 FIN 粘在一起</text>\n</svg>",
    "caption": "图：玩家ID与 Channel 双向映射 + ChannelGroup 广播容器，全部考虑并发安全"
   },
   {
    "t": "pits",
    "items": [
     "心跳只配 IdleStateHandler 不管判定：读空闲事件触发后必须联动解绑映射、掉线结算、close，少一步就是僵尸会话",
     "remove(k) 不带值比较：断连清理和重新登录并发时误删新连接的映射，玩家操作全部丢失",
     "踢人直接 ctx.close()：被踢协议包和 FIN 可能粘在一起收不到，客户端不弹提示；正确做法是先 writeAndFlush 再延迟关",
     "改了 limits.conf 以为 systemd 生效：systemd 服务不吃 limits.conf，要 unit 文件加 LimitNOFILE=，且用 /proc/pid/limits 验证",
     "把 TCP KeepAlive 当心跳用：2 小时首探、穿不透 NAT、无业务语义，只能兜底"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：心跳是检测→判定→清理→恢复的闭环，30s/90s 参数是成熟起点，重连走 token 恢复会话并踢旧连接防双在线；连接管理用双向映射 + ChannelGroup，删除必须带值比较；长连接服先算 fd 预算，ulimit/somaxconn/tw_reuse 配齐并监控。"
   }
  ]
 },
 {
  "id": "netty-nio-deep",
  "title": "Java NIO 深入：Buffer / Channel / Selector 与 epoll 细节",
  "layer": 1,
  "depends": [
   "netty-io-models"
  ],
  "covers": [
   "netty-01",
   "netty-25",
   "netty-20",
   "netty-35"
  ],
  "quiz": [
   "netty-25",
   "netty-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Netty 是踩着原生 NIO 的肩膀封装的：把 JDK NIO 的三大件、SelectionKey 事件语义、epoll 多路复用细节和臭名昭著的空轮询 bug 全部讲透，你就明白 Netty 的每层设计都在补原生 NIO 的什么窟窿。"
   },
   {
    "t": "pre",
    "items": [
     "IO 模型三态：BIO/NIO/AIO 的阻塞差异（netty-io-models）",
     "TCP 字节流本质与长连接网关的基本诉求",
     "Reactor 事件驱动的基本思想",
     "JDK ByteBuffer 的 position/limit/capacity 单指针模型"
    ]
   },
   {
    "t": "h",
    "text": "一、NIO 三大件：Buffer、Channel、Selector 各自负责什么"
   },
   {
    "t": "p",
    "text": "原生 NIO 把传统 Socket 编程拆成三个角色：Buffer（数据容器）、Channel（连接通道）、Selector（多路复用器）。一句话概括分工：Channel 负责与对端收发，但所有数据必须先落到 Buffer 里；Selector 负责『盯着』一堆 Channel，谁有数据就绪了就通知线程去读。这三大件拼起来就是『一个线程通过 Selector 轮询管理成千上万条 Channel』的事件驱动模型。"
   },
   {
    "t": "list",
    "items": [
     "Buffer：一块带读写索引的内存（position/limit/capacity）。读前要 flip() 把写模式切到读模式，读完要 compact() 或 clear()。JDK 的 ByteBuffer 是单指针 + 手动翻转，是粘包半包、丢数据的头号 bug 来源",
     "Channel：双向通道的抽象（SocketChannel/ServerSocketChannel），非阻塞模式下 read/write 立即返回，返回 0 表示没数据可读、返回 -1 表示对端关闭",
     "Selector：注册 Channel 并监听其感兴趣的事件（OP_ACCEPT/OP_READ/OP_WRITE/OP_CONNECT）。select() 阻塞等待，任一 Channel 有就绪事件才返回，selectedKeys() 取出就绪集合逐条处理"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 原生 NIO 服务端：一个线程 + 一个 Selector 管所有连接\nSelector selector = Selector.open();\nServerSocketChannel ssc = ServerSocketChannel.open();\nssc.configureBlocking(false);\nssc.bind(new InetSocketAddress(9000));\n// 服务端注册 ACCEPT 兴趣\nssc.register(selector, SelectionKey.OP_ACCEPT);\n\nByteBuffer buf = ByteBuffer.allocate(4096);\nwhile (selector.isOpen()) {\n    selector.select();                       // 阻塞，直到有就绪事件\n    Iterator<SelectionKey> it = selector.selectedKeys().iterator();\n    while (it.hasNext()) {\n        SelectionKey key = it.next();\n        it.remove();                          // 必须 remove，否则下次重复处理\n        if (key.isAcceptable()) {             // 有新的连接请求\n            SocketChannel ch = ssc.accept();\n            ch.configureBlocking(false);\n            ch.register(selector, SelectionKey.OP_READ); // 新连接关注读\n        } else if (key.isReadable()) {\n            SocketChannel ch = (SocketChannel) key.channel();\n            buf.clear();\n            int n = ch.read(buf);             // 非阻塞：可能返回 0\n            if (n == -1) { ch.close(); continue; }       // 对端关闭\n            buf.flip();                       // 切读模式，一次可能读到多个包\n            handle(buf);                      // 业务处理：注意攒包/切包要靠应用层\n        }\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">NIO 三大件：Selector 管事件，Channel 管收发，Buffer 管数据</text><rect x=\"20\" y=\"50\" width=\"160\" height=\"210\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"100\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Selector</text><rect x=\"35\" y=\"88\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"100\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">select() 阻塞等事件</text><rect x=\"35\" y=\"128\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"100\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">selectedKeys 就绪集合</text><rect x=\"35\" y=\"168\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"100\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">管理 N 条 Channel</text><text x=\"100\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一个线程即可支撑</text><text x=\"100\" y=\"248\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">万级连接</text><line x1=\"180\" y1=\"95\" x2=\"210\" y2=\"95\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"195\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">注册</text><line x1=\"180\" y1=\"160\" x2=\"210\" y2=\"160\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"195\" y=\"153\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">就绪</text><rect x=\"210\" y=\"60\" width=\"120\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"270\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Channel 1</text><text x=\"270\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OP_READ</text><text x=\"270\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">非阻塞读写</text><text x=\"270\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">返回 0/-1 语义</text><rect x=\"345\" y=\"60\" width=\"120\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"405\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Channel 2</text><text x=\"405\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OP_READ</text><text x=\"405\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">…</text><rect x=\"480\" y=\"60\" width=\"140\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"550\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Channel N</text><text x=\"550\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">OP_READ</text><text x=\"550\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">万级连接中的一条</text><line x1=\"270\" y1=\"180\" x2=\"270\" y2=\"210\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/><line x1=\"550\" y1=\"180\" x2=\"550\" y2=\"210\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/><rect x=\"200\" y=\"210\" width=\"160\" height=\"50\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"280\" y=\"232\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Buffer 1</text><text x=\"280\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">position/limit 翻转</text><rect x=\"470\" y=\"210\" width=\"150\" height=\"50\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"545\" y=\"232\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Buffer N</text><text x=\"545\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一次读多包 → 攒包切包</text></svg>",
    "caption": "图：Selector 集中管理事件，Channel 负责收发，数据经 Buffer 承载"
   },
   {
    "t": "h",
    "text": "二、SelectionKey 事件：interestOps 与 readyOps 的区别"
   },
   {
    "t": "p",
    "text": "SelectionKey 上挂着两套操作集合：interestOps（你『想关心』哪些事件）和 readyOps（实际『已经就绪』哪些事件）。注册时通过 register(channel, ops) 指定 interestOps；select() 返回后，key.readyOps() 才是当前真正可操作的事件。四个事件对应连接生命周期：OP_ACCEPT（服务端有连接待 accept）、OP_READ（有数据可读）、OP_WRITE（缓冲区可写）、OP_CONNECT（客户端连接完成）。游戏服服务端只关心前两个，OP_WRITE 是『陷阱』——它几乎总是就绪，一旦注册又不取消，select() 会疯狂返回导致 CPU 空转。"
   },
   {
    "t": "list",
    "items": [
     "OP_ACCEPT：ServerSocketChannel 专用，表示完成握手的连接排队等 accept；配合 backlog（全连接队列）理解：队列满时内核直接丢连接，客户端表现为 connect 超时",
     "OP_READ：有数据到内核接收缓冲即可读。注意『有数据』不代表『有一条完整消息』——这正是粘包半包发生的物理位置",
     "OP_WRITE：只有当发送缓冲写满、后续写会被阻塞时才需要注册；写完立即取消，否则每轮 select 都返回可写，白耗 CPU",
     "OP_CONNECT：客户端异步 connect 完成回调，游戏服不常用（登录服 HTTP 短连才涉及）"
    ]
   },
   {
    "t": "h",
    "text": "三、epoll 多路复用细节：为什么它能撑百万连接"
   },
   {
    "t": "p",
    "text": "Linux 上 NIO 的底层多路复用演进是 select → poll → epoll。select 的 fd_set 上限 1024、每次调用全量拷贝、线性扫描 O(n)；poll 去掉了 1024 上限但仍是 O(n) 扫描；epoll 用红黑树管理注册的 fd（epoll_ctl 增删改，O(log n)），内核只把真正就绪的 fd 通过就绪链表回传（epoll_wait，O(1) 拿就绪集合），并用 mmap 共享内核与用户态的事件数组避免拷贝。这就是 epoll 能支撑百万连接的本质：注册 O(log n)、取就绪 O(1)、无全量拷贝。Netty 的 EpollEventLoop（netty-transport-native-epoll）直接复用操作系统 epoll 而非 JDK Selector，还能用 epoll 的 EPOLLET 边缘触发。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">select / poll / epoll 对比：线性扫描 vs 红黑树+就绪链表</text><rect x=\"20\" y=\"48\" width=\"180\" height=\"150\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">select</text><text x=\"110\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">fd_set 上限 1024</text><text x=\"110\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">每次全量拷贝 O(n)</text><text x=\"110\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">所有 fd 都要扫一遍</text><text x=\"110\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">找出谁就绪</text><rect x=\"230\" y=\"48\" width=\"180\" height=\"150\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">poll</text><text x=\"320\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">去掉 1024 上限</text><text x=\"320\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">仍是线性扫描 O(n)</text><text x=\"320\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">百万 fd 每次扫百万</text><text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">性能随 fd 数下降</text><rect x=\"440\" y=\"48\" width=\"180\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"530\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">epoll</text><text x=\"530\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">红黑树注册 O(log n)</text><text x=\"530\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">就绪链表回传 O(1)</text><text x=\"530\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">mmap 共享事件数组</text><text x=\"530\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">百万连接的核心支撑</text><text x=\"320\" y=\"228\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">LT 水平触发反复通知；ET 边缘触发只在状态变化时通知一次，必须读到 EAGAIN</text><text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty EpollEventLoop 默认 ET，JDK NioEventLoop 走 LT</text></svg>",
    "caption": "图：三种多路复用机制在注册复杂度与就绪获取上的本质差异"
   },
   {
    "t": "h",
    "text": "四、selector 空轮询 bug：JDK NIO 最著名的坑"
   },
   {
    "t": "p",
    "text": "Linux 上 JDK Selector 的 epoll 实现有一个历史 bug（netty issue #366）：当连接异常断开（如对端拔网线后 FIN/RST 处理出问题）时，select() 会在『没有任何就绪事件』的情况下立即返回 0，而线程还以为是正常返回，于是再次 select()——再次立即返回 0，形成死循环，CPU 飙到 100%，连接全部假死。这个 bug 官方多次声称修复但一直有残留（JDK 8 某些版本仍可触发）。Netty 的规避方案是计数+重建：NioEventLoop.select() 里统计『提前返回』次数，如果 select() 阻塞时长小于超时时间且连续发生达到 SELECTOR_AUTO_REBUILD_THRESHOLD（默认 512，可用 -Dio.netty.selectorAutoRebuildThreshold 调整）次，就调用 rebuildSelector()：在 EventLoop 线程内把旧 Selector 上的所有 key 逐个 cancel 并重新注册到新建的 Selector 上，再 selectNow() 恢复监听，全程不丢连接、对业务透明。游戏服大连接量场景，直接用 EpollEventLoopGroup 走 native epoll 从根上绕开 JDK Selector，是更彻底的解法。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">空轮询检测与 rebuildSelector 流程</text><rect x=\"220\" y=\"44\" width=\"200\" height=\"44\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">selector.select(timeout)</text><path d=\"M320 88 L320 112\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"220\" y=\"112\" width=\"200\" height=\"44\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">阻塞时长 ≥ timeout ?</text><path d=\"M420 134 L470 134 L470 70 L420 70\" stroke=\"var(--lv1)\" stroke-width=\"2\" fill=\"none\"/><text x=\"492\" y=\"68\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">是：正常返回</text><text x=\"492\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">selectCnt 重置为 1</text><path d=\"M320 156 L320 180\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"220\" y=\"180\" width=\"200\" height=\"44\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"320\" y=\"206\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">selectCnt++ 空轮询</text><path d=\"M220 202 L130 202 L130 300\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"120\" y=\"292\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">回到 select 循环</text><path d=\"M420 202 L470 202 L470 236 L440 236\" stroke=\"var(--lv3)\" stroke-width=\"2\" fill=\"none\"/><text x=\"522\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">≥ 512 次 ?</text><rect x=\"250\" y=\"236\" width=\"250\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"375\" y=\"258\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">rebuildSelector() 重建</text><text x=\"375\" y=\"278\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">旧 key 逐个重注册，selectNow 恢复</text></svg>",
    "caption": "图：连续 512 次提前返回触发 Selector 重建，重建对连接透明"
   },
   {
    "t": "h",
    "text": "五、JDK NIO 的痛点清单：Netty 为什么要封装 NIO"
   },
   {
    "t": "list",
    "items": [
     "API 晦涩：Selector/SelectionKey/ByteBuffer 三件套配合繁琐，易出逻辑错；Netty 用 ChannelFuture + 回调 + Pipeline 把复杂度藏起来",
     "半包/粘包要自己攒：原生 NIO 一次 read 可能只有半个包，必须自己维护累积缓冲，极易出错；Netty 的 ByteToMessageDecoder 内置 cumulation",
     "ByteBuffer 单指针翻转：flip() 忘调/调错位置就丢数据；Netty ByteBuf 双指针 + 自动扩容",
     "空轮询 bug：上面讲的 512 次重建；Netty 已内置规避",
     "内存管理裸奔：直接内存分配/回收要手动处理；Netty 引用计数 + 池化接管",
     "没有线程模型：原生 NIO 只给事件循环，业务线程怎么调度、如何免锁全靠自己设计；Netty 的主从 Reactor 直接给答案",
     "wakeup 开销：任务线程唤醒 select 要往管道写字节；Netty 封装成 eventLoop.execute() 并内部优化"
    ]
   },
   {
    "t": "pits",
    "items": [
     "selectedKeys() 拿到集合不 remove：下次 select 返回同一批 key 重复处理，玩家动作执行两遍——这是手写 NIO 第一坑",
     "注册 OP_WRITE 后不及时取消：可写几乎恒为就绪，select 每轮返回导致 CPU 空转，和空轮询 bug 症状一模一样",
     "把 NIO 的 read 当成『一次一条消息』：一次 read 可能读到多个协议包，也可能只读到半个包；必须累积缓冲 + 应用层定界",
     "ET 模式读一半就 return：剩余数据对端静默时不再触发新事件，连接饿死；ET 必须循环读到 EAGAIN",
     "只背『select 上限 1024』：重点是每次全量拷贝 + O(n) 扫描，epoll 的 O(1) 就绪获取才是百万连接的根因",
     "以为 select(0) 是非阻塞：select(0) 确实立即返回，但一般用于『非阻塞轮询』；网络线程应 select(timeout) 或阻塞 select"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：NIO 三大件 = Buffer 存数据、Channel 收发、Selector 管事件；SelectionKey 区分 interestOps（关心什么）与 readyOps（已就绪什么），OP_WRITE 用后即撤；epoll 靠红黑树+就绪链表+mmap 把注册降到 O(log n)、取就绪降到 O(1)；空轮询 bug 由『连续 512 次提前返回 → rebuildSelector』规避；Netty 封装 NIO 的每一项（累积缓冲/双指针/池化/线程模型/重建 Selector）都对应原生 NIO 的一个坑。"
   }
  ]
 },
 {
  "id": "netty-framing",
  "title": "粘包半包与拆包策略全解：定长 / 分隔符 / 长度字段 / 多协议混合",
  "layer": 1,
  "depends": [
   "netty-pipeline-codec"
  ],
  "covers": [
   "netty-06",
   "netty-12",
   "netty-10",
   "netty-34"
  ],
  "quiz": [
   "netty-06",
   "netty-12"
  ],
  "body": [
   {
    "t": "lead",
    "text": "TCP 是水管不是快递柜：一次 read 可能拿到多个包（粘包），也可能只拿到半个包（半包）。四种拆包策略各有适用场景，长度字段法是企业级主流，多协议混合编解码则是老游戏服一端口多协议的真功夫。"
   },
   {
    "t": "pre",
    "items": [
     "TCP 字节流无消息边界、Nagle 与接收缓冲导致的粘拆包成因（netty-pipeline-codec）",
     "ByteToMessageDecoder 的 cumulation 累积缓冲机制",
     "LengthFieldBasedFrameDecoder 五个参数的基本认识",
     "Pipeline 入站 Handler 的传播顺序"
    ]
   },
   {
    "t": "h",
    "text": "一、四种拆包策略对比：没有银弹，只有最合适"
   },
   {
    "t": "table",
    "head": [
     "策略",
     "原理",
     "优点",
     "缺点",
     "适用场景"
    ],
    "rows": [
     [
      "定长 FixedLengthFrameDecoder",
      "按固定 N 字节切帧",
      "实现最简单",
      "字节浪费大、定长必须吃满",
      "内部对账/极简单固定结构"
     ],
     [
      "分隔符 LineBased/DelimiterBased",
      "按 \\n 或自定义分隔符切帧",
      "文本协议友好、调试方便",
      "二进制数据里可能撞上分隔符",
      "文本指令、GM 命令行、日志"
     ],
     [
      "长度字段 LengthFieldBased",
      "前部长度字段声明本帧长度",
      "通用、精确、可嵌头部",
      "参数组合复杂需理解语义",
      "生产主流、游戏私有协议"
     ],
     [
      "自定义 ByteToMessageDecoder",
      "魔数+长度+协议号+body 全自控",
      "极致定制、一端口多协议",
      "所有坑自己扛（mark/reset）",
      "老牌游戏服、多协议混合"
     ]
    ]
   },
   {
    "t": "p",
    "text": "拆包的本质是『确定消息边界』：定长用『尺寸已知』确定边界，分隔符用『标记字符』确定边界，长度字段用『显式声明』确定边界，自定义则把边界逻辑完全交给开发者。游戏服为什么普遍选长度字段法：小包不浪费（对比定长）、二进制安全（对比分隔符）、能同时承载魔数/协议号（对比前两者只解决切帧）。而自定义解码器等于把 LengthFieldBasedFrameDecoder 的能力 + 协议号路由全部自己实现，适合协议头带安全校验、版本协商、多种长度语义混用的老项目。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">四种拆包策略的切帧示意</text><rect x=\"20\" y=\"44\" width=\"290\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">定长 FixedLength</text><text x=\"165\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">[ 10B ][ 10B ][ 10B ] 每 10B 一帧</text><rect x=\"20\" y=\"106\" width=\"290\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"128\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">分隔符 Delimiter</text><text x=\"165\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">login\\n  move\\n  hit\\n 遇 \\n 切帧</text><rect x=\"20\" y=\"168\" width=\"290\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"190\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">长度字段 LengthField</text><text x=\"165\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">[len=30][20B body][len=12][4B body]</text><rect x=\"20\" y=\"230\" width=\"290\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"252\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">自定义 Custom</text><text x=\"165\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">[magic][len][protocolId][body] 全自控</text><rect x=\"330\" y=\"44\" width=\"290\" height=\"238\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"475\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">选型结论</text><text x=\"475\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">定长：固定结构，浪费字节</text><text x=\"475\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分隔符：文本指令/调试友好</text><text x=\"475\" y=\"146\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">长度字段：生产主流，小包不浪费、二进制安全</text><text x=\"475\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">自定义：多协议混合、老项目定制</text><text x=\"475\" y=\"206\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服选型口诀：</text><text x=\"475\" y=\"230\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">主链路长度字段法</text><text x=\"475\" y=\"252\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">GM/文本走分隔符</text><text x=\"475\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">多协议混合走自定义</text></svg>",
    "caption": "图：四种策略切帧方式与选型口诀"
   },
   {
    "t": "h",
    "text": "二、LengthFieldBasedFrameDecoder 参数详解"
   },
   {
    "t": "p",
    "text": "这五个参数是面试必考点，也是生产最容易配错的点。核心公式：实际帧总长度 = lengthFieldOffset + lengthFieldLength + lengthAdjustment + lengthFieldValue。以游戏协议帧 [magic 2B][length 4B][protocolId 4B][body N] 为例（length 只声明 body 长度）：lengthFieldOffset=2（length 字段从第 2 字节开始）、lengthFieldLength=4、lengthAdjustment=6（因为要得到完整帧长，需要把头部 magic+protocolId 共 6 字节补偿进去：2+4+6+N = 12+N，正好等于整个帧长）、initialBytesToStrip=10（解码后剥离整个头部，业务 Handler 直接拿 body）。如果长度字段声明的是『含自身的总长』，lengthAdjustment 就是负的偏移量；如果头部有变长字段或版本字段，lengthAdjustment 就要精确补偿。maxFrameLength 是安全阀：超过直接抛异常并关连接，防伪造大包打爆内存。"
   },
   {
    "t": "table",
    "head": [
     "参数",
     "含义",
     "游戏协议（magic2+len4+pid4+body）取值"
    ],
    "rows": [
     [
      "maxFrameLength",
      "允许的最大帧长，防恶意大包",
      "1MB（按业务最大包）"
     ],
     [
      "lengthFieldOffset",
      "长度字段在帧内的起始偏移",
      "2（跳过 magic 2B）"
     ],
     [
      "lengthFieldLength",
      "长度字段占用的字节数",
      "4（int）"
     ],
     [
      "lengthAdjustment",
      "补偿：长度值 + 偏移 + 本参 = 完整帧长",
      "6（magic 2 + pid 4）"
     ],
     [
      "initialBytesToStrip",
      "解码后从帧头剥离的字节数",
      "10（剥离全部头部）"
     ]
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 场景一：magic 2B + length 4B + protocolId 4B + body，length 只含 body\npipeline.addLast(new LengthFieldBasedFrameDecoder(\n        1024 * 1024,   // maxFrameLength\n        2,             // lengthFieldOffset：跳过魔数\n        4,             // lengthFieldLength\n        6,             // lengthAdjustment：补偿头部 6 字节（magic+pid）\n        10));          // initialBytesToStrip：剥离 10 字节头部\n\n// 场景二：长度字段在帧首且声明『含自身』的总长（4 字节总长 + body）\npipeline.addLast(new LengthFieldBasedFrameDecoder(\n        1024 * 1024,\n        0,             // 长度字段从 0 偏移开始\n        4,             // 4 字节\n        -4,            // 总长已含自身 4 字节，减去 offset+len\n        4));           // 剥离 4 字节长度字段\n\n// 场景三：length 只含 body、头部无其他字段（len 4B + body）\npipeline.addLast(new LengthFieldBasedFrameDecoder(\n        1024 * 1024, 0, 4, 0, 4));   // 帧长 = 4 + bodyLen\n\n// 注意：LengthFieldBasedFrameDecoder 只负责『切帧』，切出来的 ByteBuf\n// 还需下游 ProtocolDecoder 按协议号反序列化成业务对象"
   },
   {
    "t": "h",
    "text": "三、多协议混合编解码实战：一端口兼容两套协议"
   },
   {
    "t": "p",
    "text": "老游戏服升级时常见需求：同一个端口既要兼容旧客户端（文本协议）又要服务新客户端（二进制长度字段协议），或同一条连接先走 HTTP 握手再切二进制（WebSocket 接入也类似）。两种落地方式：方式一，解码器链叠加——先按首字节 Magic 判断协议族，把数据分发给不同的子解码器；方式二，继承 ByteToMessageDecoder 写一个总控解码器，读到一个完整帧后按魔数/协议号路由到不同解析器。关键纪律：多协议混合必须让『切帧』与『反序列化』解耦——切帧只解决边界，反序列化才决定语义，这样加新协议不需要动切帧逻辑。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 多协议混合解码器：首字节区分文本指令与二进制协议\npublic class MixedFrameDecoder extends ByteToMessageDecoder {\n    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {\n        if (in.readableBytes() < 1) return;\n        in.markReaderIndex();\n        short magic = in.readUnsignedByte();\n        if (magic == 'T') {                        // 文本协议：按行切\n            in.resetReaderIndex();\n            int idx = in.bytesBefore((byte) '\\n'); // 找换行符\n            if (idx < 0) return;                   // 行还没读完\n            byte[] line = new byte[idx];\n            in.readBytes(line);\n            in.skipBytes(1);                       // 跳过 \\n\n            out.add(new TextCommand(new String(line, UTF_8)));\n        } else if (magic == 0x4E) {                // 二进制协议：长度字段法\n            in.resetReaderIndex();\n            if (in.readableBytes() < 10) return;   // 头部 10B 都不够\n            int len = in.getInt(2);                // 跳过 magic 取长度\n            if (len < 0 || len > 1024 * 1024) { ctx.close(); return; }\n            if (in.readableBytes() < 10 + len) { return; }  // 等 body\n            in.skipBytes(10);                      // 剥头部\n            byte[] body = new byte[len];\n            in.readBytes(body);\n            out.add(new GameMessage(body));\n        } else {\n            ctx.close();                           // 未知魔数直接断\n        }\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">LengthFieldBasedFrameDecoder 帧布局与参数映射</text><rect x=\"20\" y=\"48\" width=\"70\" height=\"70\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"55\" y=\"82\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">magic</text><text x=\"55\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">2B</text><rect x=\"90\" y=\"48\" width=\"90\" height=\"70\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"135\" y=\"82\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">length</text><text x=\"135\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">4B 只含 body</text><rect x=\"180\" y=\"48\" width=\"80\" height=\"70\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\"/><text x=\"220\" y=\"82\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">protocolId</text><text x=\"220\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">4B</text><rect x=\"260\" y=\"48\" width=\"360\" height=\"70\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"440\" y=\"82\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">body N 字节</text><text x=\"440\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">lengthFieldValue = N</text><line x1=\"90\" y1=\"122\" x2=\"90\" y2=\"146\" stroke=\"var(--accent)\" stroke-width=\"2\"/><line x1=\"180\" y1=\"122\" x2=\"180\" y2=\"146\" stroke=\"var(--accent)\" stroke-width=\"2\"/><line x1=\"260\" y1=\"122\" x2=\"260\" y2=\"146\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"90\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">offset=2</text><text x=\"180\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">len=4</text><text x=\"260\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">adjust=6</text><rect x=\"20\" y=\"158\" width=\"600\" height=\"34\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">帧总长 = offset(2) + len(4) + adjust(6) + N = 12 + N</text><rect x=\"20\" y=\"202\" width=\"600\" height=\"34\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">initialBytesToStrip = 10：解码后剥离头部，业务 Handler 直接拿 body</text></svg>",
    "caption": "图：长度字段法五参数的几何映射关系"
   },
   {
    "t": "h",
    "text": "四、手写解码器的四道保险"
   },
   {
    "t": "list",
    "items": [
     "mark/reset 成对：读了一部分发现不够，必须 resetReaderIndex 回到帧头重来，否则下次从错误位置续读，协议全乱",
     "先校验再分配：读到 length 先校验上限与可读字节，绝不在校验前按 length 分配缓冲区——伪造 2GB 长度直接 OOM",
     "decode 循环粘包：一次读入多帧时，decode 内循环产出全部完整帧，而非只解第一帧",
     "release 纪律：切帧产物是 ByteBuf，业务消费完必须释放；派生视图 slice/duplicate 共享底层内存，随主对象生命周期走"
    ]
   },
   {
    "t": "pits",
    "items": [
     "lengthAdjustment 理解反：它是『补偿值』不是『长度字段偏移』，配错帧长算出来全错，解码立刻乱",
     "initialBytesToStrip 把帧头剥没了：剥掉长度字段后下游还要用协议号，strip 值必须精确等于要丢弃的头部字节数",
     "定长协议硬塞变长消息：FixedLengthFrameDecoder 按固定长度切，变长数据会被切成两半错位，从此所有帧全乱",
     "二进制协议用分隔符法：二进制 payload 里可能天然出现分隔符字节，一拆就错",
     "多协议混合只配一个解码器：不同协议族必须用『切帧→反序列化』解耦，别指望一个解码器包打天下",
     "忘了设 maxFrameLength：恶意大包直接吃满内存触发 OOM，长度字段法必须配上限"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：拆包本质是定边界——定长靠尺寸、分隔符靠标记、长度字段靠显式声明、自定义靠全自控；游戏主链路选长度字段法，五参数用『帧总长 = offset + len + adjust + lengthValue』推导，initialBytesToStrip 精确剥头；多协议混合把切帧与反序列化解耦，手写解码器守 mark/reset、先校验再分配、循环解粘包、release 四道保险。"
   }
  ]
 },
 {
  "id": "netty-protocol",
  "title": "自定义协议与 Protobuf 序列化",
  "layer": 2,
  "depends": [
   "netty-pipeline-codec",
   "netty-bytebuf"
  ],
  "covers": [
   "netty-10",
   "netty-15",
   "netty-30"
  ],
  "quiz": [
   "netty-10",
   "netty-15",
   "netty-30"
  ],
  "body": [
   {
    "t": "lead",
    "text": "魔数 + 长度 + 协议号 + body 是游戏私有协议的经典结构；序列化在体积、速度、兼容性、开发效率四维权衡——这一篇把协议从设计到落地的全链路讲完。"
   },
   {
    "t": "pre",
    "items": [
     "LengthFieldBasedFrameDecoder 的切帧原理",
     "ByteToMessageDecoder 的 mark/reset 用法",
     "序列化四维权衡：体积、解析速度、跨语言兼容、开发效率",
     "Protobuf 的 varint 与 tag 编码、协议演进纪律"
    ]
   },
   {
    "t": "h",
    "text": "协议帧设计：每个字段都有存在理由"
   },
   {
    "t": "list",
    "items": [
     "魔数（magic，2B）：快速识别非法连接——端口扫描、HTTP 误连、版本不匹配的旧客户端，第一字节对不上直接关连接，省资源也防攻击",
     "长度（length，4B）：body 长度，交给 LengthFieldBasedFrameDecoder 切帧，彻底解决粘拆包；同时设 maxFrameLength（如 1MB）防恶意大包打爆内存",
     "协议号（protocolId，4B）：业务路由键，解码后查『协议号→处理器』注册表，路由比 URL 快",
     "body：序列化后的业务数据（Protobuf / 自研二进制）",
     "为什么不用 HTTP/JSON：长连接小包高频，文本协议体积大 2~3 倍、解析耗 CPU；私有二进制带宽与解析成本最优，且协议号路由比 URL 路由快"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">游戏私有协议帧格式</text>\n  <rect x=\"30\" y=\"50\" width=\"80\" height=\"80\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"70\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">magic</text>\n  <text x=\"70\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">2B 魔数</text>\n  <rect x=\"120\" y=\"50\" width=\"80\" height=\"80\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"160\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">length</text>\n  <text x=\"160\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">4B 长度</text>\n  <rect x=\"210\" y=\"50\" width=\"90\" height=\"80\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\"/>\n  <text x=\"255\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">protocolId</text>\n  <text x=\"255\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">4B 协议号</text>\n  <rect x=\"310\" y=\"50\" width=\"300\" height=\"80\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"460\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">body（N 字节）</text>\n  <text x=\"460\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Protobuf / 自研二进制序列化</text>\n  <text x=\"320\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\">length 必须先校验上限再分配：伪造 2GB 长度直接 OOM</text>\n  <text x=\"320\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">魔数防错连，长度切帧防粘拆包，协议号做业务路由</text>\n  <text x=\"320\" y=\"200\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">协议号按模块号段分配（登录 1xxx、战斗 2xxx），工具生成时全表查重</text>\n  <text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">协议演进：编号一经发布不复用，删除字段用 reserved 占位，只加 optional 字段</text>\n</svg>",
    "caption": "图：魔数防错连、长度切帧防粘拆、协议号路由，缺一不可"
   },
   {
    "t": "h",
    "text": "序列化选型：四维权衡"
   },
   {
    "t": "table",
    "head": [
     "方案",
     "体积",
     "速度",
     "跨语言",
     "适合场景"
    ],
    "rows": [
     [
      "JSON",
      "大（字段名重复）",
      "慢",
      "是",
      "GM 后台 / 运营接口 / 日志调试"
     ],
     [
      "Protobuf",
      "小（varint + 字段编号）",
      "快",
      "强（强 schema）",
      "玩家协议主链路"
     ],
     [
      "Kryo",
      "小",
      "快",
      "否（Java 专属）",
      "服内 RPC / Redis 缓存对象"
     ],
     [
      "自研二进制",
      "极致小",
      "天花板",
      "看实现",
      "极致定制 / 早期项目"
     ]
    ]
   },
   {
    "t": "p",
    "text": "决策口诀：对外玩家协议要稳（Protobuf/自研二进制），对 Web 要人看得懂（JSON），服内 RPC 要省事（Kryo/Hessian）。成熟项目普遍用『协议生成工具』：策划/程序在 Excel/定义表写协议结构，工具一键生成 Java 实体类、编解码代码、协议号注册表——加协议零手写代码，这是导表工具链里复用度最高的工具。Protobuf 协议演进纪律：字段编号一经发布永不复用，删除字段用 reserved 占位防编号复用，只加 optional 字段不改已有字段类型，老客户端收到新字段自动忽略；改编号 = 数据错乱。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 官方 codec-protobuf 的短板：单 Pipeline 只能绑一种消息类型，且没有协议号无法路由\n// 游戏通用方案：自定义帧头 + Protobuf body + 注册表路由\npublic class GameFrameDecoder extends ByteToMessageDecoder {\n    private final Map<Integer, Parser<?>> parserMap;  // 协议号 → Parser，工具生成\n\n    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {\n        if (in.readableBytes() < 10) return;\n        in.markReaderIndex();\n        short magic = in.readShort();\n        if (magic != 0x4E47) { ctx.close(); return; }\n        int length = in.readInt();\n        if (length < 0 || length > 1024 * 1024) { ctx.close(); return; }\n        if (in.readableBytes() < 4 + length) { in.resetReaderIndex(); return; }\n        int protocolId = in.readInt();\n        Parser<?> parser = parserMap.get(protocolId);\n        if (parser == null) { ctx.close(); return; }  // 白名单外的协议号直接踢\n        byte[] body = new byte[length];\n        in.readBytes(body);\n        out.add(parser.parseFrom(body));   // 反序列化出具体协议对象\n    }\n}\n// 出站：Encoder 把 MessageLite 编码，帧头拼 protocolId\n// 扩展：未登录前只放行登录/心跳协议号，把攻击面锁到最小"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">解码 → 路由 → 业务 全链路</text>\n  <rect x=\"30\" y=\"50\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"95\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">切帧</text>\n  <text x=\"95\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">LengthFieldBased</text>\n  <text x=\"95\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">FrameDecoder</text>\n  <line x1=\"160\" y1=\"90\" x2=\"200\" y2=\"90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"200\" y=\"50\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"265\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">解析帧头</text>\n  <text x=\"265\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">取 protocolId</text>\n  <text x=\"265\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">校验魔数/长度</text>\n  <line x1=\"330\" y1=\"90\" x2=\"370\" y2=\"90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"370\" y=\"50\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"435\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">注册表路由</text>\n  <text x=\"435\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">协议号 → Parser</text>\n  <text x=\"435\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">白名单外踢线</text>\n  <line x1=\"500\" y1=\"90\" x2=\"540\" y2=\"90\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"540\" y=\"50\" width=\"80\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"580\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">业务</text>\n  <text x=\"580\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">投递 Disruptor</text>\n  <rect x=\"30\" y=\"150\" width=\"590\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">工具链价值</text>\n  <text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">定义表/Excel 写结构 → 一键生成实体类 + 编解码 + 注册表，策划加协议零手写代码</text>\n</svg>",
    "caption": "图：帧头携带协议号，解码后经注册表路由，未登录协议白名单锁攻击面"
   },
   {
    "t": "pits",
    "items": [
     "length 字段被篡改成 2GB：必须先校验 maxFrameLength 与可读字节再分配，绝不在校验前按 length 分配缓冲区",
     "官方 ProtobufDecoder 直接上生产：它只能绑一种 prototype 类型、没有协议号，游戏几百个协议必须自己组合帧头 + 注册表",
     "改协议号/字段编号实现『升级』：改编号 = 数据错乱，删除字段不 reserved 占位 = 后人复用旧编号埋雷",
     "把 Protobuf 的 required 当默认：proto3 已废弃 required，新协议一律 optional/无修饰，向前兼容靠『只加字段』",
     "序列化全用 JSON 图省事：玩家协议主链路 JSON 体积大 2~3 倍、解析耗 CPU，只能用在 GM 后台等低频场景"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：帧格式四个字段各有动机——魔数防错连、长度切帧+防大包、协议号路由、body 序列化；序列化按体积/速度/兼容/效率四维选型，玩家协议走 Protobuf；官方 codec 缺路由能力，用帧头 + 注册表组合；协议演进守纪律：编号不复用、reserved 占位、只加 optional。"
   }
  ]
 },
 {
  "id": "netty-async-write",
  "title": "异步写路径、背压与时间轮",
  "layer": 2,
  "depends": [
   "netty-bytebuf",
   "netty-pipeline-codec"
  ],
  "covers": [
   "netty-27",
   "netty-28",
   "netty-29",
   "netty-16",
   "netty-17",
   "netty-26"
  ],
  "quiz": [
   "netty-28",
   "netty-29",
   "netty-27"
  ],
  "body": [
   {
    "t": "lead",
    "text": "write 只是入队、flush 才真正写 Socket；高水位触发 isWritable 背压，时间轮 O(1) 管海量定时任务——这三件套撑起游戏服回包链路的吞吐与稳定。"
   },
   {
    "t": "pre",
    "items": [
     "write() 与 flush() 的分离语义",
     "ChannelOutboundBuffer 与高低水位（默认高 64KB / 低 32KB）",
     "ChannelFuture / Promise 的只读/可写分工",
     "HashedWheelTimer 环形数组 + 槽位链表原理"
    ]
   },
   {
    "t": "h",
    "text": "从 write 到真正发出：链路与水位线"
   },
   {
    "t": "p",
    "text": "write() 只是把消息挂进出站缓冲 ChannelOutboundBuffer 并累加 pendingBytes 记账，flush() 才触发真正写 Socket（gathering write 聚集写，把多次 write 合并为少量系统调用）。内核发送缓冲满时，数据在出站缓冲堆积，超过高水位（默认 64KB）后 channel.isWritable() 返回 false 并触发 channelWritabilityChanged；排空到低水位（默认 32KB）以下才恢复可写。非 EventLoop 线程调用 write 会被封装成任务投递到该 Channel 的 EventLoop 执行，所有出站操作收敛到 I/O 线程保证无锁。性能要点：批量几次 write 再一次 flush，能显著减少系统调用。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">write 入队记账，flush 真正发送，水位线做背压</text>\n  <rect x=\"20\" y=\"50\" width=\"120\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"80\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">业务线程</text>\n  <text x=\"80\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">writeAndFlush</text>\n  <text x=\"80\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">封装任务投递</text>\n  <line x1=\"140\" y1=\"95\" x2=\"180\" y2=\"95\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"180\" y=\"50\" width=\"170\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"265\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">ChannelOutboundBuffer</text>\n  <text x=\"265\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">write 入队 + pendingBytes 记账</text>\n  <text x=\"265\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">超过高水位 → isWritable=false</text>\n  <line x1=\"350\" y1=\"95\" x2=\"390\" y2=\"95\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"390\" y=\"50\" width=\"120\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"450\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">内核发送缓冲</text>\n  <text x=\"450\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">flush 聚集写</text>\n  <text x=\"450\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">写不完注册 OP_WRITE</text>\n  <line x1=\"510\" y1=\"95\" x2=\"540\" y2=\"95\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"540\" y=\"50\" width=\"80\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"580\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">网卡</text>\n  <text x=\"580\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">真正发出</text>\n  <rect x=\"20\" y=\"160\" width=\"600\" height=\"100\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"184\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">水位线 = 背压开关（默认高水位 64KB / 低水位 32KB）</text>\n  <rect x=\"60\" y=\"196\" width=\"520\" height=\"22\" rx=\"11\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <rect x=\"60\" y=\"196\" width=\"130\" height=\"22\" rx=\"11\" fill=\"var(--lv3)\"/>\n  <text x=\"125\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">高水位 64KB</text>\n  <line x1=\"330\" y1=\"196\" x2=\"330\" y2=\"218\" stroke=\"var(--line)\"/>\n  <text x=\"330\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">…</text>\n  <text x=\"460\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">低水位 32KB 以下恢复可写</text>\n  <text x=\"320\" y=\"252\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">广播场景：isWritable=false 时降频/丢非关键帧/踢慢连接，恢复可写再补发</text>\n</svg>",
    "caption": "图：write 只入队记账，flush 触发真正发送，高低水位驱动 isWritable 背压"
   },
   {
    "t": "h",
    "text": "背压与广播：宁可踢卡比，不坑全服"
   },
   {
    "t": "p",
    "text": "广播两大杀手：慢客户端拖垮内存、写风暴打满 CPU/带宽。对策：isWritable()==false 时对慢客户端降级（降频/丢弃非关键状态包/标记卡顿玩家），连续不可写直接踢下线；状态同步做 AOI 裁剪 + 增量同步 + 合帧（10Hz 而不是每逻辑帧都发）；广播包用 CompositeByteBuf 共享 body；大广播拆批分散到多个 tick 发送，配合 EventLoop 的 ioRatio 防写任务饿死读事件；线上盯着每个 Channel 的出站缓冲总量与不可写时长，这是最灵敏的网络健康度指标。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 广播降级：慢客户端绝不拖垮全服\nvoid broadcastToPlayer(Long playerId, Object msg) {\n    Channel ch = onlineChannels.get(playerId);\n    if (ch == null || !ch.isActive()) return;\n    if (!ch.isWritable()) {\n        // 出站缓冲超高水位：降级处理\n        if (ch.attr(ATTR_SLOW_COUNT).getAndIncrement() > 3) {\n            // 连续不可写：标记卡顿玩家，踢线，让客户端走重连\n            ch.writeAndFlush(KICK_PROTOCOL).addListener(ChannelFutureListener.CLOSE);\n            return;\n        }\n        return; // 暂时跳过非关键状态包\n    }\n    ch.writeAndFlush(msg);\n}\n\n// ChannelFuture / Promise 纪律\n// 1. 绝不在 EventLoop 线程 sync()/await() —— 自己等自己，死锁\n// 2. 回包失败补偿：writeAndFlush(msg).addListener(f -> { if (!f.isSuccess()) 记日志/补偿 })\n// 3. 踢人写完再关：writeAndFlush(踢人协议).addListener(ChannelFutureListener.CLOSE)"
   },
   {
    "t": "h",
    "text": "时间轮：海量低精度定时任务的答案"
   },
   {
    "t": "p",
    "text": "HashedWheelTimer 用『环形数组 + 槽位链表』把定时任务的插入/取消降到 O(1)：指针每过 tickDuration（默认 100ms）前进一格，任务按『延迟 ÷ tickDuration』算槽位和剩余圈数，扫到槽位时圈数为 0 的执行。对比 DelayQueue/ScheduledThreadPoolExecutor 的堆结构 O(log n) 插入，时间轮在十万级任务下无压力。适合：连接级超时（登录超时、协议应答超时）、重试退避、GM 指令延迟执行。不适合：技能 CD、Buff 帧级结算这类要精确到逻辑帧的任务——游戏逻辑帧（如 20Hz）直接每帧检查到期列表，不走时间轮。铁律：回调跑在时间轮唯一线程上，只能做轻量标记/转发，重逻辑丢业务线程，否则一个慢任务拖延全轮任务。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">HashedWheelTimer：环形数组 + 槽位链表，插入/取消 O(1)</text>\n  <circle cx=\"320\" cy=\"150\" r=\"100\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <circle cx=\"320\" cy=\"150\" r=\"10\" fill=\"var(--accent)\"/>\n  <line x1=\"320\" y1=\"150\" x2=\"400\" y2=\"92\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"408\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">指针</text>\n  <text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">每 100ms 前进一格</text>\n  <g stroke=\"var(--line)\" stroke-width=\"1\">\n    <line x1=\"320\" y1=\"50\" x2=\"320\" y2=\"250\"/>\n    <line x1=\"220\" y1=\"150\" x2=\"420\" y2=\"150\"/>\n    <line x1=\"251\" y1=\"81\" x2=\"389\" y2=\"219\"/>\n    <line x1=\"251\" y1=\"219\" x2=\"389\" y2=\"81\"/>\n  </g>\n  <circle cx=\"340\" cy=\"98\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"340\" y=\"103\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽 0</text>\n  <circle cx=\"440\" cy=\"170\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"440\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽 1</text>\n  <circle cx=\"240\" cy=\"200\" r=\"22\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\"/>\n  <text x=\"240\" y=\"205\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">槽 511</text>\n  <text x=\"320\" y=\"236\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">任务 = 槽位下标 + remainingRounds 圈数，扫到圈数归零才执行</text>\n  <rect x=\"20\" y=\"248\" width=\"600\" height=\"26\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"266\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">游戏适用：连接超时/重试退避；帧级任务（技能 CD/Buff）用逻辑帧驱动，不走时间轮</text>\n</svg>",
    "caption": "图：环形数组按 tick 分槽，任务挂槽位链表，插入取消 O(1)"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 时间轮使用示例：登录超时检测\nHashedWheelTimer timer = new HashedWheelTimer(100, TimeUnit.MILLISECONDS);\n// 每条未登录连接注册 30s 登录超时任务\ntimer.newTimeout(timeout -> {\n    Channel ch = timeout.getChannel();\n    if (ch.isActive() && !ch.attr(ATTR_LOGINED).get()) {\n        // 30 秒未登录强制断开（慢速攻击防护）\n        ch.close();\n    }\n}, 30, TimeUnit.SECONDS);\n\n// EventLoop 任务调度（netty-26 核心）\n// 每轮循环：select → processSelectedKeys → runAllTasks\n// ioRatio（默认 50）：I/O 时间占比上限，防止任务饿死 I/O\n// 任务队列默认无界：不拒绝只积压，必须监控 eventLoop.pendingTasks()\n// 业务线程回写超速 + 慢客户端 → 任务积压 → 延迟上涨 → 最终 OOM"
   },
   {
    "t": "pits",
    "items": [
     "write 之后忘 flush：数据停在 JVM 出站缓冲不会发出，Netty 除 writeAndFlush 外没有自动 flush",
     "EventLoop 里 future.sync()：自己等自己执行的任务，永久死锁——排查『CPU 不高但全服卡死』的经典现场",
     "把时间轮当万能定时器：帧级任务（技能 CD/Buff 结算）走时间轮会因 100ms 粒度误差破坏战斗逻辑，应每帧检查到期列表",
     "时间轮回调里做重业务：回调在唯一 Worker 线程执行，一个慢任务拖延全轮任务，必须轻量标记后丢业务线程",
     "背压只配水位线不写 isWritable 判断：参数设了不判断等于没设，慢客户端照样拖垮内存"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：write 入队记账、flush 聚集发送，高 64KB/低 32KB 水位线驱动 isWritable 背压，广播场景降级踢慢连接；ChannelFuture 禁 sync，用 addListener 处理回包失败与写完再关；时间轮 O(1) 管海量低精度任务，帧级任务用逻辑帧驱动。"
   }
  ]
 },
 {
  "id": "netty-eventloop-tuning",
  "title": "EventLoop 与线程模型调优：线程数、ioRatio 与免锁铁律",
  "layer": 2,
  "depends": [
   "netty-core-thread",
   "netty-nio-deep"
  ],
  "covers": [
   "netty-04",
   "netty-08",
   "netty-26",
   "netty-02"
  ],
  "quiz": [
   "netty-26",
   "netty-04"
  ],
  "body": [
   {
    "t": "lead",
    "text": "boss 只管开门、worker 分管长住客、每个 EventLoop 一肩挑 I/O/任务/定时三类工作——线程数怎么选、ioRatio 怎么调、哪些操作绝对禁止上 EventLoop，是游戏长连接网关稳定与性能的分水岭。"
   },
   {
    "t": "pre",
    "items": [
     "主从 Reactor：boss 接入、worker 读写的职责划分（netty-core-thread）",
     "EventLoop 默认线程数 2×CPU 的源码依据",
     "Channel 终身绑定单 EventLoop 的免锁原理",
     "selector 空轮询与 select 循环的基本流程（netty-nio-deep）"
    ]
   },
   {
    "t": "h",
    "text": "一、boss 与 worker：职责边界决定线程数"
   },
   {
    "t": "p",
    "text": "bossGroup 只做一件事：监听 OP_ACCEPT，把 accept 出来的 Channel 注册到 workerGroup。一个监听端口配 1 个 boss 线程就够，配多了没用——端口就一个，多线程抢一个 accept 只会增加竞争。workerGroup 负责所有存量连接的读写、编解码与 Pipeline 执行，默认线程数由源码决定：DEFAULT_EVENT_LOOP_THREADS = Math.max(1, getInt(\"io.netty.eventLoopThreads\", NettyRuntime.availableProcessors() * 2))，即 CPU 核数 × 2，可用 -Dio.netty.eventLoopThreads 覆盖。为什么是 ×2 而不是 ×1：I/O 线程大量时间在 select 等待，一半线程等事件、一半线程跑任务，既保证事件及时响应又让任务有线程可跑。但 ×2 是『起点』不是『答案』，最终要压测校准。"
   },
   {
    "t": "list",
    "items": [
     "纯转发型网关（解码后直接转发到业务层）：默认 2×CPU 即可，I/O 密集线程大部分在等 select",
     "Handler 里带轻量业务（协议号路由、计数）：保持默认或略增，别指望线程数解决阻塞问题",
     "业务里出现任何阻塞（DB/Redis/重计算）：不是加线程，是把阻塞业务丢到 Disruptor/业务线程池",
     "大连接量 + 弱网环境：连接数不直接决定线程数，决定线程数的是『每秒事件吞吐』；先看 CPU 与延迟，连接数只是间接指标",
     "超多核机器（如 32 核以上）：2×CPU=64 个 EventLoop，上下文切换可能反而变慢，压测后酌情下调，或按 n+1 经验值试"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 线程模型启动：显式指定线程数，附关键配置\nint cores = Runtime.getRuntime().availableProcessors();\nEventLoopGroup boss = new NioEventLoopGroup(1);            // 一个端口一个线程\nEventLoopGroup worker = new NioEventLoopGroup(cores * 2);   // 起点：2×CPU，压测校准\n\nServerBootstrap b = new ServerBootstrap();\nb.group(boss, worker)\n .channel(NioServerSocketChannel.class)\n .childOption(ChannelOption.TCP_NODELAY, true)\n .childHandler(new ChannelInitializer<SocketChannel>() {\n     protected void initChannel(SocketChannel ch) {\n         ch.pipeline()\n           .addLast(new IdleStateHandler(90, 0, 0))\n           .addLast(new GameFrameDecoder())\n           .addLast(new GameDispatchHandler());   // 解码后投递 Disruptor，绝不阻塞\n     }\n });\n\n// 任务耗时与积压监控（运维排查利器）\nfor (EventLoop el : worker) {\n    // 定时采样：任务积压数、I/O 线程 CPU\n    log.info(\"pendingTasks={}\", ((SingleThreadEventExecutor) el).pendingTasks());\n}"
   },
   {
    "t": "h",
    "text": "二、EventLoop 一轮循环：select → 处理就绪 → 执行任务"
   },
   {
    "t": "p",
    "text": "每个 EventLoop 就是一个死循环线程，每轮做三件事：① select() 等待 I/O 就绪事件；② processSelectedKeys() 处理就绪的 Channel 读写；③ runAllTasks() 执行任务队列里的普通任务与到期的定时任务。任务从哪来？外部线程调用 channel.write()/eventLoop.execute() 时，任务被封装进该 EventLoop 的任务队列（默认无界，只有积压没有拒绝）；定时任务（IdleStateHandler、schedule）进入内部的调度队列。关键认知：同一 Channel 的所有 I/O 与任务都在同一个 EventLoop 线程串行执行，所以 Channel 上永远不存在并发——这是 Netty 免锁编程的根基；但也意味着任何在 EventLoop 上运行的代码阻塞，都会堵住这条线程上挂着的几千条连接。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">EventLoop 每轮循环三阶段 + ioRatio 时间分配</text><rect x=\"30\" y=\"52\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"115\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">① select() 等事件</text><text x=\"115\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">阻塞等待就绪</text><text x=\"115\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">有空轮询检测</text><text x=\"115\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">任务到来会被唤醒</text><path d=\"M200 107 L236 107\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"218\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">就绪</text><rect x=\"236\" y=\"52\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"321\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">② 处理就绪 I/O</text><text x=\"321\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">channelRead/write</text><text x=\"321\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跑 Pipeline 编解码</text><text x=\"321\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">轻量业务可直接做</text><path d=\"M406 107 L442 107\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"424\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">时间</text><rect x=\"442\" y=\"52\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"527\" y=\"78\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">③ runAllTasks</text><text x=\"527\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">普通任务 + 定时任务</text><text x=\"527\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">业务回写在此排队</text><text x=\"527\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无界队列只积压</text><path d=\"M527 162 L527 190 L70 190 L70 162\" stroke=\"var(--line)\" stroke-width=\"2\" fill=\"none\" stroke-dasharray=\"6 4\"/><text x=\"300\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">回到 ① 循环</text><rect x=\"30\" y=\"202\" width=\"580\" height=\"30\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"222\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">ioRatio 默认 50：I/O 处理时间占上限 50%，任务占剩余 50%</text><rect x=\"30\" y=\"242\" width=\"290\" height=\"30\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"175\" y=\"262\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">调大 → I/O 优先，任务延迟上升</text><rect x=\"330\" y=\"242\" width=\"290\" height=\"30\" rx=\"6\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\"/><text x=\"475\" y=\"262\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">调小 → 任务优先，I/O 吞吐下降</text></svg>",
    "caption": "图：EventLoop 三阶段循环，ioRatio 控制 I/O 与任务的 CPU 时间配比"
   },
   {
    "t": "h",
    "text": "三、ioRatio：I/O 与任务的 CPU 时间配比"
   },
   {
    "t": "p",
    "text": "ioRatio 默认 50，含义是『每次循环里，处理 I/O 事件花费的时间占本轮循环总时间的百分比上限』。Netty 在 processSelectedKeys 阶段记账，一旦 I/O 处理耗时达到本轮时间的 50%，就提前进入 runAllTasks，防止 I/O 事件无限吞掉任务执行时间。反过来，如果任务特别重（比如业务回写密集），任务阶段挤占 select 等待，I/O 响应延迟就上来。调整经验：纯转发网关 I/O 极重，可把 ioRatio 调高到 80~100 让 I/O 优先，代价是任务（含业务回写）延迟上升；任务重、低延迟敏感（如大厅心跳踢线）场景调低。注意 ioRatio 只是『时间配额』，不是硬限流，多数游戏服保持默认 50 即可，别为了调参而调参。"
   },
   {
    "t": "h",
    "text": "四、EventLoopGroup 与 Channel 数量：一个 EventLoop 到底能扛多少连接"
   },
   {
    "t": "p",
    "text": "面试和线上都爱问：一个 EventLoop 能管多少连接？答案是：不按连接数算，按『每秒事件数 × 单事件耗时』算。一个 EventLoop 的吞吐上限 = 1 秒 / 每条消息平均处理耗时。如果一条协议平均 0.1ms，那这个 EventLoop 每秒能处理 10000 条消息；假如每条连接每秒发 10 条消息，就是 1000 条连接。连接数的上限由『消息速率 × 单连接消息频率』共同决定，与线程数无直接关系。所以调优的正确姿势是：先压测出单 EventLoop 的消息吞吐，再反推『要扛 N 万连接 × 每连接每秒 M 包，需要几个 EventLoop』。workerGroup 线程数 ≈ 每秒总消息数 ÷ 单 EventLoop 吞吐，而不是盲配 2×CPU。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">阻塞 EventLoop 的连锁反应：一个慢任务拖垮几千条连接</text><rect x=\"30\" y=\"48\" width=\"280\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"170\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">正常：延迟平稳</text><text x=\"170\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">每条消息 ~0.1ms</text><rect x=\"45\" y=\"110\" width=\"250\" height=\"60\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><rect x=\"45\" y=\"158\" width=\"10\" height=\"12\" fill=\"var(--lv1)\"/><text x=\"62\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">延迟毫秒级，稳定</text><rect x=\"55\" y=\"158\" width=\"10\" height=\"12\" fill=\"var(--lv1)\"/><rect x=\"65\" y=\"158\" width=\"10\" height=\"12\" fill=\"var(--lv1)\"/><rect x=\"75\" y=\"158\" width=\"10\" height=\"12\" fill=\"var(--lv1)\"/><rect x=\"85\" y=\"158\" width=\"10\" height=\"12\" fill=\"var(--lv1)\"/><rect x=\"330\" y=\"48\" width=\"280\" height=\"150\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"470\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">阻塞：一个慢 SQL 拖垮整组</text><text x=\"470\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">该 EventLoop 上几千条连接全卡</text><rect x=\"345\" y=\"110\" width=\"250\" height=\"60\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><rect x=\"345\" y=\"158\" width=\"10\" height=\"12\" fill=\"var(--lv3)\"/><rect x=\"355\" y=\"150\" width=\"10\" height=\"20\" fill=\"var(--lv3)\"/><rect x=\"365\" y=\"140\" width=\"10\" height=\"30\" fill=\"var(--lv3)\"/><rect x=\"375\" y=\"130\" width=\"10\" height=\"40\" fill=\"var(--lv3)\"/><rect x=\"385\" y=\"118\" width=\"10\" height=\"52\" fill=\"var(--lv3)\"/><rect x=\"395\" y=\"158\" width=\"10\" height=\"12\" fill=\"var(--lv3)\"/><text x=\"470\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">延迟尖峰 = 该线程上的所有连接</text><text x=\"320\" y=\"224\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">红线：DB/Redis/重计算/锁等待/sleep 绝对不允许出现在 EventLoop 线程</text></svg>",
    "caption": "图：EventLoop 被阻塞后，其名下所有连接的延迟同步飙升"
   },
   {
    "t": "h",
    "text": "五、避免阻塞 EventLoop：免锁红线下不能碰的事"
   },
   {
    "t": "list",
    "items": [
     "阻塞 IO：JDBC 查库、Redis 同步调用、读本地文件——一个慢 SQL 堵住线程，该线程上所有玩家心跳超时、操作卡顿",
     "锁竞争：在 EventLoop 上 synchronized 一个被业务线程持有的锁，直接死锁或长时间阻塞",
     "CPU 密集重计算：大数据量序列化、加密、寻路，先做耗时评估，重活丢业务线程",
     "future.sync()/await()：在 EventLoop 里等一个最终由该线程执行的任务完成——自己等自己，永久死锁",
     "Thread.sleep：任何形式的 sleep 都是 EventLoop 上的自杀行为",
     "写大日志：日志本身轻，但磁盘刷盘慢会拖住线程；游戏服高频路径用异步日志（如 Log4j2 AsyncAppender / Kafka 转储）"
    ]
   },
   {
    "t": "pits",
    "items": [
     "盲目给 workerGroup 加线程：线程数不是越多越好，超多核 + 大量上下文切换反而变慢；先压测出单 EventLoop 吞吐再反推",
     "boss 配多个线程：一个监听端口一个线程足够，多配只增加无谓竞争",
     "把 ioRatio 理解成毫秒数：它是 I/O 时间占本轮循环的百分比，不是具体时间",
     "用 ThreadLocal 存连接态：EventLoop 复用线程服务多条连接会串数据；连接态必须用 AttributeKey/FastThreadLocal 按连接隔离",
     "默认 2×CPU 永远不动：它是起点；纯 I/O 或超多核机器都要压测校准",
     "只在 EventLoop 上跑轻量业务就认为安全：协议解码里藏了正则、反射也会拖慢线程；涉及耗时的解码逻辑同样要评估"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：boss 1 个线程只管接入，worker 默认 2×CPU 用 -Dio.netty.eventLoopThreads 覆盖；EventLoop 一轮循环 = select → 处理就绪 → runAllTasks，ioRatio 默认 50 控制 I/O 时间配额；一个 EventLoop 能扛的连接数 = 吞吐 ÷ 每连接每秒消息数，靠压测反推而非拍脑袋；免锁红线下绝对禁止阻塞 IO、锁竞争、future.sync、sleep 出现在 EventLoop，重活一律投递业务线程池。"
   }
  ]
 },
 {
  "id": "netty-bytebuf-pool",
  "title": "ByteBuf 内存池原理：PoolArena / Chunk / Page / Subpage 与泄漏排查",
  "layer": 2,
  "depends": [
   "netty-bytebuf"
  ],
  "covers": [
   "netty-09",
   "netty-19",
   "netty-11",
   "netty-28"
  ],
  "quiz": [
   "netty-19",
   "netty-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Netty 把 jemalloc 的分层分配思想搬进 JVM：Arena 分片、Chunk 大块、Page/Subpage 细分、ThreadCache 快路径，配合引用计数把内存生命周期管到极致——这是高频小包游戏服不掉堆外内存、不毛刺 GC 的根本保障。"
   },
   {
    "t": "pre",
    "items": [
     "ByteBuf 双指针、动态扩容、引用计数基础（netty-bytebuf）",
     "PooledByteBufAllocator 自 4.1 起为默认分配器",
     "直接内存 vs 堆内内存的取舍",
     "retain/release 成对管理的纪律"
    ]
   },
   {
    "t": "h",
    "text": "一、为什么需要内存池：高频小包场景的分配回收灾难"
   },
   {
    "t": "p",
    "text": "游戏服一个晚上几十亿个小包，如果用 UnpooledByteBufAllocator，每个包都 new 一块直接内存：堆外分配要走系统调用（malloc/mmap）、用完要释放，GC 只回收对象壳不回收堆外内存，还要靠 Cleaner 挂虚引用等不定时回收——结果就是内存碎片、堆外暴涨、Full GC 后心跳集体超时。PooledByteBufAllocator 借鉴 jemalloc 的思路：预先向 OS 申请大块内存，切成不同规格的小块常驻池中，用完归还而不是释放。Netty 4.1 起默认就是池化分配器（Android 除外），可由 -Dio.netty.allocator.type=pooled/unpooled 强制指定，无特殊理由不要改回 unpooled。"
   },
   {
    "t": "h",
    "text": "二、分配层次：PoolThreadCache → PoolArena → Chunk → Page/Subpage"
   },
   {
    "t": "p",
    "text": "内存池从顶层到底层四层结构。第一层 PoolThreadCache（每线程专属缓存）：每个线程的 FastThreadLocal 里缓存最近归还的 tiny/small/normal 三类内存，分配时先在本地缓存命中，全程无锁——这是高频路径 90% 分配发生的层。第二层 PoolArena：默认数量 2×CPU（-Dio.netty.allocator.numDirectArenas 可调），相当于『分片后的堆外内存池』，多线程竞争时各自进不同的 Arena 降低锁冲突；线程与 Arena 按 round-robin 绑定。第三层 Chunk：每块 chunk 大小 = pageSize << maxOrder，默认 pageSize=8192（8KB）、maxOrder=9，即 8KB<<9 = 4MB（不同版本默认值可能不同，以 jar 内 javadoc 为准），chunk 内部是一棵平衡二叉树，叶子是 page，用于大内存分配。第四层 Page/Subpage：8KB 的 page 再被拆成更小的 subpage（如 512B、1KB、2KB），小对象用 subpage 池管理。"
   },
   {
    "t": "callout",
    "kind": "unverified",
    "text": "存疑：chunk 大小的具体默认值（pageSize 与 maxOrder）在不同 Netty 版本间可能不同——本文按 netty.io 4.2 javadoc 的 pageSize=8192、maxOrder=9 推得约 4MB；若线上版本不同，请以实际 jar 内 javadoc 或源码常量为准。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">PooledByteBufAllocator 四层结构（借鉴 jemalloc）</text><rect x=\"20\" y=\"44\" width=\"600\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">PoolThreadCache（线程私有，FastThreadLocal）</text><text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">tiny 缓存 512B 档 | small 缓存 256 个 | normal 缓存 64 个 —— 快路径无锁</text><path d=\"M160 96 L160 116\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"152\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">未命中</text><path d=\"M480 96 L480 116\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"472\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">归还</text><rect x=\"20\" y=\"116\" width=\"600\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">PoolArena × (2×CPU)，默认分片减小锁竞争</text><text x=\"320\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">tinySubpagePools | smallSubpagePools | normal chunk 列表</text><path d=\"M160 168 L160 188\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"152\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">无空页</text><rect x=\"20\" y=\"188\" width=\"600\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Chunk = pageSize &lt;&lt; maxOrder（默认 8192 &lt;&lt; 9 ≈ 4MB）</text><text x=\"320\" y=\"230\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">内部平衡二叉树：根 = 整个 chunk，叶子 = 8KB page，大分配按 2 的幂切块</text><path d=\"M160 240 L160 260\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"152\" y=\"256\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">叶子</text><rect x=\"20\" y=\"260\" width=\"600\" height=\"30\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"280\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Page 8KB / Subpage（512B、1KB、2KB…）——小对象共用 subpage 池</text></svg>",
    "caption": "图：从线程缓存到 Arena 到 Chunk 的四层分配结构，小对象走 subpage"
   },
   {
    "t": "h",
    "text": "三、分配与回收流程：快路径与慢路径"
   },
   {
    "t": "p",
    "text": "一次 buffer(256) 的分配路径：① 从 PoolThreadCache 按规格（tiny/small/normal）查找缓存，命中则直接从缓存剥离一块，无锁返回，这是 99% 高频小包走的路；② 缓存未命中，进 Arena：小对象去 subpage 池（tiny/smallSubpagePools）找空闲 subpage，大对象去 chunk 二叉树里找空闲块（allocateNode 按 2 的幂拆分）；③ Arena 里也没空间了，才向 OS 申请新 chunk（直接内存 mmap/系统分配），再挂进 Arena 的 chunk 列表。释放路径对称：release 归零后，小对象先回 ThreadCache，缓存满了或跨线程释放才回 Arena 的 subpage 池/chunk；大对象整块归还 chunk 二叉树。整个设计目标：让『分配-释放』尽量发生在线程私有缓存内，把锁竞争和系统调用降到最低。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">分配快慢路径</text><rect x=\"20\" y=\"44\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"110\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">快路径</text><text x=\"110\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ThreadCache 命中</text><text x=\"110\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无锁，微秒级返回</text><path d=\"M200 79 L240 79\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"240\" y=\"44\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"330\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">中路径</text><text x=\"330\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Arena 加锁</text><text x=\"330\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">subpage / chunk 分配</text><path d=\"M420 79 L460 79\" stroke=\"var(--lv2)\" stroke-width=\"2\"/><rect x=\"460\" y=\"44\" width=\"160\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"540\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">慢路径</text><text x=\"540\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">向 OS 申请新 chunk</text><text x=\"540\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">系统调用，昂贵</text><rect x=\"20\" y=\"140\" width=\"600\" height=\"40\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">优化目标：把绝大多数 分配/释放 收敛在快路径，锁竞争与系统调用降到最低</text><rect x=\"20\" y=\"190\" width=\"600\" height=\"40\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">高频游戏包（几十字节 ~ 几 KB）全走 ThreadCache + subpage，GC 与堆外波动极小</text></svg>",
    "caption": "图：分配的三条路径，高频小包几乎全部命中线程私有缓存"
   },
   {
    "t": "h",
    "text": "四、引用计数与泄漏检测：谁分配谁负责"
   },
   {
    "t": "p",
    "text": "池化内存不是 GC 管的，而是引用计数管的：retain() 计数 +1、release() 计数 -1，归零才真正回池。铁律：『谁拿的、谁 release；传递到哪、在哪终结』。具体到游戏服 Pipeline：解码出的消息在业务 Handler 里处理完必须 release；SimpleChannelInboundHandler 会在 channelRead0 返回后自动 release；ChannelInboundHandlerAdapter 不会自动释放，必须手动。忘记 release 就是内存『只进不出』，堆外持续上涨直到 OOM。Netty 的 ResourceLeakDetector 是排查利器：按采样概率给 ByteBuf 包一层弱引用，GC 回收对象时若引用计数非零，说明漏 release，就把分配时的调用栈打印出来。泄漏检测四级：DISABLED（禁用）、SIMPLE（默认，抽样 1/128）、ADVANCED（抽样 1/32，带分配栈）、PARANOID（全量，性能代价大），由 -Dio.netty.leakDetection.level=advanced 控制。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 内存池监控：线上直接看池化指标\nPooledByteBufAllocatorMetric m = PooledByteBufAllocator.DEFAULT.metric();\nfor (PoolArenaMetric arena : m.directArenas()) {\n    log.info(\"directArena numAllocations={} numDeallocations={} activeBytes={}\",\n        arena.numAllocations(), arena.numDeallocations(), arena.numActiveBytes());\n}\n// 判断泄漏：numAllocations 持续增长且 numDeallocations 不跟涨 → 有连接在漏\n\n// 泄漏排查三板斧\n// 1. 启动参数开检测：-Dio.netty.leakDetection.level=ADVANCED，看日志里 LEAK: 的分配堆栈\n// 2. 对照纪律自查：channelRead 接管的消息是否 release；retain 是否成对；finally 里兜底\n// 3. 止血：临时 -Dio.netty.allocator.type=unpooled，泄漏只影响 GC 不再耗尽堆外，再慢慢定位\n\n// 使用纪律示例\npublic void channelRead(ChannelHandlerContext ctx, Object msg) {\n    try {\n        GameMessage gm = (GameMessage) msg;\n        dispatch(ctx, gm);        // 业务消费完\n    } finally {\n        ReferenceCountUtil.release(msg);   // 兜底释放，防异常路径漏 release\n    }\n}"
   },
   {
    "t": "h",
    "text": "五、内存泄漏排查实战流程"
   },
   {
    "t": "list",
    "items": [
     "现象确认：JVM 堆稳定但进程 RSS/系统内存持续上涨 → 八成是堆外泄漏；先看 /proc/pid/status 的 VmRSS 与 -Xmx 对比",
     "Netty 侧定位：开 ADVANCED 检测，等日志出现 LEAK 记录，直接拿到『分配但没释放』的堆栈，十有八九当场定位到 Handler",
     "非 Netty 堆外来源排查：JNI 库（压缩/加密）、Unsafe 分配、业务自管 DirectByteBuffer、第三方原生库；用 NMT（-XX:NativeMemoryTracking=summary）看 off-heap 构成",
     "对象壳泄漏 vs 内存泄漏：GC 只回收壳，池化内存必须归零才回池；确认是池化内存泄漏而不是对象堆积",
     "长期无法定位时：unpooled 止血 → 观察泄漏是否消失 → 缩小到池化路径，再逐 Handler 二分排查"
    ]
   },
   {
    "t": "pits",
    "items": [
     "只依赖 GC 不 release：GC 回收对象壳不归还池化内存，只进不出最终堆外 OOM；这是 4.1 池化默认开启后最常见的线上事故",
     "泄漏检测级别停留在默认 SIMPLE：抽样 1/128，小流量下可能漏检；疑难现场开 ADVANCED 拿堆栈",
     "盯着 JVM 堆找堆外泄漏：现象是 RSS 涨而堆稳定，要看 VmRSS、NMT、allocator.metric() 的 activeBytes",
     "release 两次 / 使用后再 release：refCnt 归零后再操作抛 IllegalReferenceCountException，业务崩溃",
     "把 Unpooled 用于高频链路：低频工具场景 unpooled 省事，高频 I/O 主链路必须池化，否则系统调用开销吃掉吞吐",
     "用 slice()/duplicate() 的派生 Buf 当独立消息缓存：派生视图共享底层内存，原 Buf release 后派生对象成悬空引用"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：池化分配器四层结构 = ThreadCache 无锁快路径 → Arena 分片 → Chunk 二叉树 → Page/Subpage 小对象池；默认 pageSize 8192、maxOrder 9（chunk 约 4MB，版本间有差异）；引用计数归零才回池，SimpleChannelInboundHandler 自动 release 而 Adapter 必须手动；泄漏排查三板斧 = ADVANCED 拿堆栈 + 纪律自查 + unpooled 止血，配合 NMT 与 allocator.metric() 定位。"
   }
  ]
 },
 {
  "id": "netty-idle-heartbeat",
  "title": "IdleStateHandler 心跳机制深入：源码原理、踢线策略与重连退避",
  "layer": 2,
  "depends": [
   "netty-heartbeat",
   "netty-pipeline-codec"
  ],
  "covers": [
   "netty-07",
   "netty-13",
   "netty-34",
   "netty-18"
  ],
  "quiz": [
   "netty-13",
   "netty-07"
  ],
  "body": [
   {
    "t": "lead",
    "text": "把 IdleStateHandler 翻开到源码层：三个内部定时任务怎么调度、读/写/全空闲各自什么语义、服务端踢线怎么留足余量、客户端重连怎么指数退避防惊群——心跳不只是加个 Handler，而是检测-判定-清理-恢复的完整工程。"
   },
   {
    "t": "pre",
    "items": [
     "心跳闭环：检测→判定→清理→恢复四步（netty-heartbeat）",
     "IdleStateHandler 三参数 readerIdleTime/writerIdleTime/allIdleTime 语义",
     "userEventTriggered 捕获 IdleStateEvent 的基本用法",
     "EventLoop 定时任务调度机制（netty-eventloop-tuning）"
    ]
   },
   {
    "t": "h",
    "text": "一、源码级：空闲检测是怎么实现的"
   },
   {
    "t": "p",
    "text": "IdleStateHandler 本质是 ChannelDuplexHandler，初始化（handlerAdded 触发）时调用 initialize()：先记录 lastReadTime = lastWriteTime = ticksInNanos()，然后按参数分别调用 schedule(ctx, new ReaderIdleTimeoutTask(ctx), readerIdleTimeNanos, NANOSECONDS)，writerIdleTime 和 allIdleTime 同理，参数为 0 表示不启用对应检测。注意时间基准是 ticksInNanos()（内部用 System.nanoTime()），不是 System.currentTimeMillis()——避免系统时钟被 NTP 拨动导致误判空闲。每个定时任务执行完会重新 schedule 下一次，实现『一次注册、循环检测』。判断逻辑很简单：ReaderIdleTimeoutTask 里 nextDelay = readerIdleTimeNanos - (ticksInNanos() - lastReadTime)，nextDelay 小于等于 0 就说明超过读空闲阈值，触发 channelIdle → fireUserEventTriggered(new IdleStateEvent(READER_IDLE, first))。lastReadTime 何时更新？channelRead 方法被调用时更新——但注意是『调用进入』就更新，不是数据读完；写时间戳则更精细，通过给 write 操作挂 ChannelFutureListener，在写真正完成后才更新 lastWriteTime，保证『写空闲』语义是真实写完成而非入队。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">IdleStateHandler 内部机制：定时任务 + 时间戳 + 事件传播</text><rect x=\"20\" y=\"48\" width=\"290\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">initialize() 注册三个定时任务</text><rect x=\"35\" y=\"80\" width=\"250\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"160\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ReaderIdleTimeoutTask（读空闲）</text><rect x=\"35\" y=\"110\" width=\"250\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"160\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">WriterIdleTimeoutTask（写空闲）</text><rect x=\"35\" y=\"140\" width=\"250\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"160\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">AllIdleTimeoutTask（读写都算）</text><path d=\"M310 103 L350 103\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"350\" y=\"48\" width=\"270\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"485\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">每 tick 判断</text><text x=\"485\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">nextDelay = idleTime - (now - lastTime)</text><text x=\"485\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">nextDelay &lt;= 0 → 空闲触发</text><text x=\"485\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">时间基准 ticksInNanos() = nanoTime</text><text x=\"485\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">避免系统时钟拨动误判</text><rect x=\"20\" y=\"176\" width=\"600\" height=\"50\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">空闲事件 → fireUserEventTriggered(IdleStateEvent)</text><text x=\"320\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">业务 Handler 在 userEventTriggered() 里捕获处理；firstReaderIdleEvent 标记首事件</text><rect x=\"20\" y=\"240\" width=\"600\" height=\"42\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"266\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">写时间戳在 write 完成后经 ChannelFutureListener 更新——写空闲语义 = 真实写完，不是入队</text></svg>",
    "caption": "图：初始化注册三任务、每 tick 按 nanoTime 判断、事件经 userEventTriggered 传播"
   },
   {
    "t": "h",
    "text": "二、读空闲 / 写空闲 / 全空闲：语义与选择"
   },
   {
    "t": "list",
    "items": [
     "读空闲（readerIdleTime）：超过 N 秒没收到任何数据。服务端用它判定『客户端失联』——客户端断网后不再发包，读空闲累计到阈值就踢线",
     "写空闲（writerIdleTime）：超过 N 秒没写出任何数据。客户端用它驱动主动心跳——没业务包可发时，写空闲一到就发心跳保活",
     "全空闲（allIdleTime）：读和写都空闲 N 秒。适合兜底：读不空闲但写一直空闲、或反向的怪异连接，全空闲一网打尽",
     "注意观察位：IdleStateHandler 默认不观察输出缓冲区（observeOutput=false），极端慢客户端可能既写不出去又符合空闲条件；需要时通过构造参数开启"
    ]
   },
   {
    "t": "h",
    "text": "三、服务端踢线策略：留余量、走流程、兜底巡检"
   },
   {
    "t": "p",
    "text": "服务端踢线有三条铁律。第一，参数留足余量：客户端 30 秒发一次心跳，服务端读空闲设 90 秒（容忍连续丢 2~3 个心跳），避免一次网络抖动就误踢；踢线动作在 userEventTriggered 里做：解绑玩家映射、执行掉线业务（存档、通知好友、排行榜下线）、再关闭 Channel。第二，踢线要『先礼后兵』：直接 ctx.close() 会把被踢协议包和 FIN 粘在一起，客户端收不到提示，玩家一脸懵；正确做法是先 writeAndFlush 踢线协议，再 addListener(ChannelFutureListener.CLOSE) 等写完成再关。第三，巡检兜底：如果 EventLoop 假死、GC 长停顿导致定时任务没跑，心跳检测就不触发，必须在登录服做『最后活跃时间』巡检，超阈值强制清理——心跳是应用层兜底，巡检是最后的保险丝。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 服务端：读空闲踢线 + 防双在线\npipeline.addLast(new IdleStateHandler(90, 0, 0, TimeUnit.SECONDS));\n\n@Override\npublic void userEventTriggered(ChannelHandlerContext ctx, Object evt) {\n    if (evt instanceof IdleStateEvent) {\n        Long playerId = ctx.channel().attr(ATTR_PLAYER_ID).get();\n        if (playerId != null) {\n            onlineChannels.remove(playerId, ctx.channel());  // 带值比较防误删\n            playerService.onPlayerOffline(playerId);          // 掉线结算\n        }\n        // 先推踢线协议再关，保证客户端收到提示\n        ctx.writeAndFlush(KickPacket.of(REASON_IDLE))\n           .addListener(ChannelFutureListener.CLOSE);\n    }\n}\n\n// 客户端：写空闲发心跳，断线指数退避重连（1s→2s→4s→…上限30s，加抖动）\npipeline.addLast(new IdleStateHandler(0, 25, 0, TimeUnit.SECONDS));\nint attempt = 0;\n@Override\npublic void userEventTriggered(ChannelHandlerContext ctx, Object evt) {\n    if (evt instanceof IdleStateEvent) {\n        ctx.writeAndFlush(HeartbeatPacket.INSTANCE);          // 写空闲 → 发心跳\n    }\n}\nvoid reconnect() {\n    long delay = Math.min(1000L << Math.min(attempt++, 5), 30_000L); // 指数退避\n    delay = (long) (delay * (0.8 + 0.4 * Math.random()));            // 加 0.8~1.2 抖动\n    bootstrap.connect(host, port).addListener(f -> {\n        if (!f.isSuccess()) {\n            bootstrap.config().group().schedule(this::reconnect, delay, TimeUnit.MILLISECONDS);\n        }\n    });\n}"
   },
   {
    "t": "h",
    "text": "四、客户端重连退避与防惊群"
   },
   {
    "t": "p",
    "text": "断线重连的核心是『退避 + 抖动』。退避让重连间隔指数增长（1s、2s、4s…封顶 30s），避免弱网下高频空转；抖动（0.8~1.2 倍随机）让同一时刻断线的成千上万玩家错开洪峰，否则服务器重启后所有客户端同时重连——登录服瞬间被打挂，这就是『惊群重连』。配合手段：重连前先走登录服拿新 token（会话票据），避免旧连接残留；服务端对同一玩家 ID 的旧连接踢掉，防止双在线互相顶号；登录服做限流排队（令牌桶/每秒建连配额），并在压测里专门模拟『万级同时重连』验证峰值。会话恢复：重连成功后用 token + 会话快照恢复玩家上下文（位置、背包版本、未结算战斗），让玩家感知为『闪断秒回』。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">游戏服心跳状态机：从连接到踢线再到重连</text><ellipse cx=\"80\" cy=\"80\" rx=\"62\" ry=\"26\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"80\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">未连接</text><path d=\"M142 80 L200 80\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"171\" y=\"72\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">connect</text><ellipse cx=\"260\" cy=\"80\" rx=\"70\" ry=\"26\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"260\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">已连接未认证</text><path d=\"M330 80 L390 80\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"360\" y=\"72\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">token 认证</text><ellipse cx=\"450\" cy=\"80\" rx=\"66\" ry=\"26\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"450\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">在线（心跳中）</text><path d=\"M450 106 L450 160\" stroke=\"var(--lv3)\" stroke-width=\"2\"/><text x=\"458\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">读空闲 90s</text><ellipse cx=\"450\" cy=\"196\" rx=\"76\" ry=\"26\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"450\" y=\"202\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">踢线（解绑+掉线）</text><path d=\"M374 196 L200 196 L200 130\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\"/><text x=\"260\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">指数退避重连</text><text x=\"490\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">1s→2s→4s…30s</text><rect x=\"20\" y=\"236\" width=\"600\" height=\"44\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"256\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">重连成功：新 token 恢复会话 + 服务端踢旧连接防双在线</text><text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">登录服巡检兜底：最后活跃时间超阈值的僵尸连接强制清理</text></svg>",
    "caption": "图：连接-认证-在线-踢线-重连的完整状态流转"
   },
   {
    "t": "h",
    "text": "五、真实游戏服心跳设计要点"
   },
   {
    "t": "list",
    "items": [
     "心跳频率折中：移动端 NAT 映射常见 5~15 分钟超时，心跳间隔要短于 NAT 超时；太短费流量电量、太长发现死连接慢；常见 30s，按机型网络再调",
     "心跳包轻量化：空协议头 + 协议号即可，尽量不携带业务字段；带序列号可做乱序/重放防护",
     "心跳不触发业务：心跳消息只更新活跃时间戳，绝不进业务逻辑、不落库，避免刷心跳打爆存储",
     "Ping/Pong 双向：客户端发心跳、服务端回 Pong（或服务端只收不回）；回 Pong 能帮客户端探测上行链路，但服务端高并发下回包开销要评估",
     "心跳与业务包区分：业务包同样刷新 lastReadTime，玩家在打副本时不发心跳也不会被误踢",
     "机房级兜底：网关层记录连接最后活跃时间，登录服/运维平台巡检，双保险防 EventLoop 假死漏检"
    ]
   },
   {
    "t": "pits",
    "items": [
     "只加 IdleStateHandler 不写 userEventTriggered：事件触发了没人接，等于没配——必须自己捕获 IdleStateEvent 做踢线",
     "读空闲设得跟心跳间隔一样（30s 对 30s）：一次网络抖动丢一个心跳就误踢，必须留 2~3 倍余量",
     "踢线直接 ctx.close()：被踢协议和 FIN 粘包，客户端收不到提示；先 writeAndFlush 再 addListener(CLOSE)",
     "在心跳回调里做重业务：userEventTriggered 跑在 EventLoop 线程，掉线存档/通知要投递业务线程，否则拖垮整个 EventLoop",
     "客户端重连不抖动：服务端重启后全员同时重连，登录服被打挂——指数退避 + 随机抖动是标配",
     "用 currentTimeMillis 判断空闲：系统时钟被 NTP 拨动会误判空闲、误踢玩家；源码用 nanoTime 就是为这个"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：IdleStateHandler 源码 = handlerAdded 时注册 Reader/Writer/AllIdleTimeoutTask 三个定时任务，每 tick 用 nanoTime 与 lastReadTime/lastWriteTime 比较，超时 fireUserEventTriggered；服务端读空闲 90s（客户端 30s 心跳）留足余量，踢线先推协议再关、巡检兜底；客户端写空闲发心跳 + 指数退避带抖动重连 + 新 token 恢复会话 + 踢旧连接防双在线，才算完整闭环。"
   }
  ]
 },
 {
  "id": "netty-serialization-compare",
  "title": "高性能序列化技术对比：Protobuf / Kryo / Hessian / JSON / MessagePack",
  "layer": 2,
  "depends": [
   "netty-protocol"
  ],
  "covers": [
   "netty-15",
   "netty-30",
   "netty-10",
   "netty-32"
  ],
  "quiz": [
   "netty-30",
   "netty-15"
  ],
  "body": [
   {
    "t": "lead",
    "text": "序列化是游戏服的『隐形性能税』：同一份玩家数据，JSON 可能比 Protobuf 大 2~3 倍、慢一个量级。按体积/速度/跨语言/可读性/兼容性五维选型，不同链路（玩家协议、服内 RPC、GM 后台、日志）各有最优解。"
   },
   {
    "t": "pre",
    "items": [
     "序列化四维权衡：体积、解析速度、跨语言兼容、开发效率（netty-protocol）",
     "Protobuf 的 varint 与 tag 编码原理",
     "游戏私有协议帧与序列化的分层关系",
     "协议生成工具的工作方式"
    ]
   },
   {
    "t": "h",
    "text": "一、五大序列化技术全景对比"
   },
   {
    "t": "table",
    "head": [
     "方案",
     "编码体积",
     "解析速度",
     "跨语言",
     "可读性",
     "兼容性"
    ],
    "rows": [
     [
      "Protobuf",
      "小（varint+编号）",
      "快",
      "强（.proto schema）",
      "差（二进制）",
      "强（字段编号演进）"
     ],
     [
      "Kryo",
      "小",
      "最快（Java 内部）",
      "否（Java 专属）",
      "差",
      "中（需注册/类演进谨慎）"
     ],
     [
      "Hessian",
      "中",
      "中",
      "多语言实现",
      "差",
      "中"
     ],
     [
      "JSON",
      "大（字段名重复）",
      "慢（字符串解析）",
      "是（事实标准）",
      "好（人可读）",
      "好（宽松）"
     ],
     [
      "MessagePack",
      "中（二进制 JSON）",
      "中快",
      "多语言",
      "差",
      "中"
     ]
    ]
   },
   {
    "t": "p",
    "text": "五点结论：体积上 Kryo 和 Protobuf 最省，JSON 最大——字段名每个消息重复出现，几十字节的协议能膨胀到几百字节；速度上 Kryo 在纯 Java 内部最快，Protobuf 次之且稳定，JSON 因字符串解析与对象反射慢一个量级；跨语言上 Protobuf 靠 .proto schema 三端（C++/C#/Lua）共享最可靠，JSON 任何语言原生支持；可读性上 JSON 唯一胜出，正好是 GM 后台、运营接口、日志调试要的；兼容性上 Protobuf 的字段编号演进纪律最规范，Kryo 则要小心类结构变更。没有万能方案，只有按链路选型。"
   },
   {
    "t": "h",
    "text": "二、为什么 Protobuf 又快又小：varint、tag 与 zigzag"
   },
   {
    "t": "p",
    "text": "Protobuf 省空间靠三点。第一，字段用『编号 + wire type』编码成 1 字节 tag（如 0x08 = field 1, varint），代替 JSON 的字段名字符串——几十个字段也就几十字节 tag，字段名每个消息重复出现的开销被砍掉。第二，整数用 varint 变长编码：每个字节 7 位有效位 + 1 位续位标志，小整数只占 1 字节，玩家等级、坐标差值这种小值几乎都是 1~2 字节。第三，负数和浮点走 zigzag 或固定编码：负 int 直接 varint 要占满 10 字节，zigzag 把 -1 映射成 1、-2 映射成 3，小负数也压到 1 字节；浮点用固定 4/8 字节。解析速度快的来源是『编号 + 类型自描述』：跳过未知字段按 wire type 直接算长度，不需要整包扫描。"
   },
   {
    "t": "callout",
    "kind": "unverified",
    "text": "存疑：五大方案在体积/速度上的『相对量级』来自业界常见 benchmark 结论（Kryo 体积最小速度最快、JSON 最大最慢等），具体数值随库版本、JVM、字段结构差异浮动；本项目未做同条件实测，若面试或选型需要精确数字，建议用 JMH 在自建压测环境里对目标库版本实测。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">五方案对比：体积（条越短越好）与速度（条越长越快）</text><text x=\"30\" y=\"60\" font-size=\"13\" fill=\"var(--ink)\">Kryo</text><rect x=\"90\" y=\"46\" width=\"150\" height=\"24\" rx=\"5\" fill=\"var(--lv1)\"/><text x=\"300\" y=\"64\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">体积小 · 速度最快</text><text x=\"30\" y=\"96\" font-size=\"13\" fill=\"var(--ink)\">Protobuf</text><rect x=\"90\" y=\"82\" width=\"180\" height=\"24\" rx=\"5\" fill=\"var(--lv1)\"/><text x=\"330\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">体积小 · 速度快 · 跨语言</text><text x=\"30\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">MessagePack</text><rect x=\"90\" y=\"118\" width=\"240\" height=\"24\" rx=\"5\" fill=\"var(--lv2)\"/><text x=\"390\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">体积中 · 速度中快</text><text x=\"30\" y=\"168\" font-size=\"13\" fill=\"var(--ink)\">Hessian</text><rect x=\"90\" y=\"154\" width=\"260\" height=\"24\" rx=\"5\" fill=\"var(--lv2)\"/><text x=\"410\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">体积中 · 速度中</text><text x=\"30\" y=\"204\" font-size=\"13\" fill=\"var(--ink)\">JSON</text><rect x=\"90\" y=\"190\" width=\"380\" height=\"24\" rx=\"5\" fill=\"var(--lv3)\"/><text x=\"560\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">体积最大 · 速度最慢 · 唯一可读</text><text x=\"320\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">注：相对量级为业界常见 benchmark 结论，具体数字随库版本与字段结构浮动（unverified）</text></svg>",
    "caption": "图：五方案在体积与速度两个维度的相对位置（量级为经验值）"
   },
   {
    "t": "h",
    "text": "三、游戏服各链路怎么选型"
   },
   {
    "t": "list",
    "items": [
     "玩家协议主链路（登录/战斗/背包）：Protobuf 或自研二进制。跨端（客户端 C++/C#/Lua）schema 共享、体积小、解析快，是刚需",
     "服内 RPC（战斗服→功能服、服务间调用）：Kryo。纯 Java 零 schema、体积小、速度最快，不跨语言就选它",
     "GM 后台 / 运营接口 / 日志上报：JSON。人要读、要好调试，性能不是瓶颈",
     "跨语言但对体积敏感（如 Lua 客户端的高频状态）：MessagePack 或 Protobuf；MessagePack 无 schema 更灵活，Protobuf 更规范",
     "帧同步 / 极致高频状态同步：自研二进制 + 位压缩。几百字节压到几十字节，把 CPU 与带宽压到极限，代价是协议生成工具要配套"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// proto 定义（player.proto）\n// syntax = \"proto3\";\n// message Move {\n//   int32 seq = 1;      // 帧序号\n//   int32 x = 2;        // 坐标（float 转 int 省体积）\n//   int32 y = 3;\n// }\n// 编译：protoc --java_out=./src ./player.proto  生成 MoveOuterClass.Move\n\n// 使用：把 Protobuf 的 byte[] 塞进协议帧 body 再编码\npublic class MoveEncoder extends MessageToByteEncoder<MoveOuterClass.Move> {\n    protected void encode(ChannelHandlerContext ctx, MoveOuterClass.Move msg, ByteBuf out) {\n        out.writeShort(0x4E47);                 // 魔数\n        byte[] body = msg.toByteArray();\n        out.writeInt(body.length);              // length\n        out.writeInt(1002);                     // protocolId = 移动协议\n        out.writeBytes(body);                   // body\n    }\n}\n\n// Kryo 服内 RPC：注册类减少类名开销\nKryo kryo = new Kryo();\nkryo.register(PlayerProfile.class, 1001);       // 用短 ID 代替类名\nkryo.register(ItemStack.class, 1002);\n// 网络层先按协议号决定用什么序列化器，和帧切分完全解耦"
   },
   {
    "t": "h",
    "text": "四、Proto 编译与版本演进纪律"
   },
   {
    "t": "list",
    "items": [
     "编译链：写 .proto → protoc 生成 Java 类（官方插件）+ grpc 服务类（grpc-java 插件）→ 协议生成工具同时产出协议号注册表，加协议零手写代码",
     "字段编号一经发布永不复用：改编号 = 新旧端字段错位，数据全乱；删字段用 reserved 1, 5, 8; 占位防后人复用",
     "只加不改：新增字段只加 optional/无修饰字段，旧端自动忽略；绝不改已有字段类型（int32→int64 多数不兼容）",
     "required 已废弃：proto3 里字段默认都是 optional 语义，别再写 required",
     "枚举演进要留位：给枚举预留未知值兜底，新枚举值旧端反序列化为 UNRECOGNIZED，别让它崩掉",
     "版本化协议号：大版本不兼容时开新协议号（如 1002 升级到 1003），老客户端走老协议，新客户端走新协议，平滑过渡"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">序列化选型决策树</text><rect x=\"230\" y=\"44\" width=\"180\" height=\"40\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"69\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">选序列化方案</text><path d=\"M230 84 L170 110 L170 124\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\"/><text x=\"140\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">跨语言/对外?</text><rect x=\"90\" y=\"124\" width=\"160\" height=\"40\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"170\" y=\"149\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Protobuf</text><path d=\"M410 84 L470 110 L470 124\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\"/><text x=\"480\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">纯 Java?</text><rect x=\"390\" y=\"124\" width=\"160\" height=\"40\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"470\" y=\"149\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Kryo</text><path d=\"M170 164 L170 190\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/><path d=\"M470 164 L470 190\" stroke=\"var(--line)\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/><rect x=\"30\" y=\"190\" width=\"190\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"125\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">要人可读? → JSON</text><text x=\"125\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 后台/日志/运营接口</text><rect x=\"230\" y=\"190\" width=\"190\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"325\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">极高频状态? → 自研二进制</text><text x=\"325\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">帧同步/位压缩/极致体积</text><rect x=\"430\" y=\"190\" width=\"190\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"525\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">跨语言且无 schema?</text><text x=\"525\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ MessagePack</text><text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">口诀：对外要稳选 Protobuf，服内省事选 Kryo，给人看选 JSON，极致高频自己写</text></svg>",
    "caption": "图：按跨语言、纯 Java、可读性、极致性能四个维度走决策树"
   },
   {
    "t": "pits",
    "items": [
     "全项目 JSON 图省事：玩家协议主链路 JSON 体积大 2~3 倍、解析耗 CPU，百万并发下是白扔的带宽与 CPU；JSON 只配 GM/日志场景",
     "Kryo 不注册类：默认用类名字符串当 key，体积直接翻倍；注册短 ID（register(Class, id)）才发挥体积优势",
     "proto3 里写 required：已废弃，编译就报错；新协议一律 optional/无修饰",
     "删除字段不 reserved：后人复用旧编号，新旧端字段错位，数据静默损坏",
     "改字段类型实现『优化』：int32 改 int64 多数不兼容，前端解析直接错位；正确做法是加新字段、留旧字段弃用",
     "序列化与切帧耦合死：切帧管边界、序列化管语义，混在一起加新协议就要动切帧逻辑；分层才能支持多协议混合"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：五方案按体积/速度/跨语言/可读性/兼容性五维选型——玩家协议 Protobuf、服内 RPC Kryo、GM/日志 JSON、跨语言无 schema 用 MessagePack、极致高频自研二进制；Protobuf 靠 tag+varint+zigzag 兼顾小与快；演进纪律 = 编号不复用、reserved 占位、只加 optional、大版本换协议号。"
   }
  ]
 },
 {
  "id": "netty-gateway",
  "title": "游戏长连接网关实战",
  "layer": 3,
  "depends": [
   "netty-protocol",
   "netty-heartbeat",
   "netty-async-write"
  ],
  "covers": [
   "netty-31",
   "netty-32",
   "netty-36",
   "netty-21",
   "netty-22",
   "netty-33"
  ],
  "quiz": [
   "netty-31",
   "netty-32",
   "netty-36"
  ],
  "body": [
   {
    "t": "lead",
    "text": "把前面所有知识组装成真实的生产系统：登录服与游戏服分工、WebSocket/KCP 多端接入、百万连接容量规划、安全防护与优雅停机——这是面试的最终加分题。"
   },
   {
    "t": "pre",
    "items": [
     "登录服无连接化设计与会话票据机制",
     "Netty 与 Tomcat/Undertow 的定位差异",
     "WebSocket 三段式 Pipeline（HTTP 握手 → 升级 → 二进制帧）",
     "TCP 队头阻塞与 UDP/KCP 的取舍",
     "百万连接五层容量规划：OS/JVM/架构/压测/护栏"
    ]
   },
   {
    "t": "h",
    "text": "架构总览：为什么登录服无连接、游戏服长连接"
   },
   {
    "t": "p",
    "text": "选型看通信模型不看 benchmark：Tomcat/Undertow 是 Servlet 容器，为请求-响应模型而生；Netty 是事件驱动框架，为长连接与自定义协议而生。GM 后台（RuoYi）是 CRUD+RBAC 的 HTTP 短请求，用 SpringBoot 内嵌 Tomcat 吃 Filter/权限注解/Excel 导出整套生态；游戏服是几万玩家常驻长连接 + 服务端主动推送 + 私有二进制协议，只有 Netty 能承载。架构上登录服只做认证+分发（校验渠道 token、发游戏服地址和会话票据），不持有长连接；玩家拿票据连游戏服后，登录服随时可以重启不影响在线玩家——这是平滑部署的关键设计。业务回包不直接 write，而是拿到玩家 Channel 的 EventLoop，eventLoop.execute(() -> channel.writeAndFlush(msg)) 切回 I/O 线程保证线程安全。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">游戏长连接网关总架构</text>\n  <rect x=\"20\" y=\"50\" width=\"170\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"105\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">客户端 / H5 / 小游戏</text>\n  <rect x=\"35\" y=\"88\" width=\"140\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"105\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TCP / WebSocket / UDP(KCP)</text>\n  <rect x=\"35\" y=\"128\" width=\"140\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"105\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">心跳 30s / token 重连</text>\n  <rect x=\"35\" y=\"168\" width=\"140\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"105\" y=\"188\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">指数退避防惊群</text>\n  <text x=\"105\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">协议：魔数+长度+协议号+PB body</text>\n  <rect x=\"240\" y=\"50\" width=\"170\" height=\"200\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"325\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">登录服（无连接）</text>\n  <rect x=\"255\" y=\"88\" width=\"140\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"325\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">渠道 token 校验</text>\n  <rect x=\"255\" y=\"130\" width=\"140\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"325\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">签发会话票据</text>\n  <rect x=\"255\" y=\"172\" width=\"140\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"325\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">调度游戏服节点</text>\n  <text x=\"325\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">随时重启不影响在线玩家</text>\n  <rect x=\"460\" y=\"50\" width=\"160\" height=\"200\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"540\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">游戏服（长连接）</text>\n  <rect x=\"475\" y=\"88\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"540\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty 网关保持连接</text>\n  <rect x=\"475\" y=\"130\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"540\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">解码 → 路由 → Disruptor</text>\n  <rect x=\"475\" y=\"172\" width=\"130\" height=\"34\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"540\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">按玩家 ID 定序消费</text>\n  <text x=\"540\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">回写切回 EventLoop</text>\n  <path d=\"M190 110 C 220 110, 220 110, 240 110\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <path d=\"M410 150 C 440 150, 440 150, 460 150\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <text x=\"320\" y=\"268\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">热更新/滚动发布：多节点逐个重启，玩家凭票据重连任意节点无感迁移</text>\n  <text x=\"320\" y=\"290\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">会话外置 Redis 快照，节点挂了换节点也能恢复关键状态</text>\n</svg>",
    "caption": "图：登录服无连接化支撑平滑部署，游戏服保持长连接并按玩家 ID 定序处理业务"
   },
   {
    "t": "h",
    "text": "多端接入：WebSocket 与 UDP/KCP"
   },
   {
    "t": "p",
    "text": "H5/小游戏浏览器不能裸 TCP，只能走 WebSocket。Netty Pipeline 三段式：SslHandler（WSS 加密，生产必备）→ HttpServerCodec + HttpObjectAggregator（握手用）→ WebSocketServerProtocolHandler（自动握手、101 升级、处理 Ping/Pong/Close，握手后自动移除 HTTP Handler）→ 业务 Handler 收 BinaryWebSocketFrame，frame.content() 是 ByteBuf，直接喂给原有的魔数+长度+协议号解码器——业务层传输无关，H5 和原生客户端同服。实时对战类（帧同步）TCP 队头阻塞致命：一个丢包堵住后续所有数据，且 RTO 最小 200ms；KCP 在 UDP 上做选择性重传、2 次跳号 ACK 就快速重传、可弱化拥塞控制，用 10~20% 带宽冗余换 30~40% 平均延迟降低。Netty 用 NioDatagramChannel 支持 UDP，KCP 实现作为会话层 Handler 插在 Pipeline，用 conv 字段标识会话。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\">\n  <text x=\"320\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">WebSocket 接入 Pipeline：三段式复用原生 TCP 业务层</text>\n  <rect x=\"20\" y=\"50\" width=\"120\" height=\"160\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"80\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">客户端</text>\n  <text x=\"80\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">H5 / 小游戏</text>\n  <rect x=\"35\" y=\"108\" width=\"90\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"80\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">wss:// 握手</text>\n  <rect x=\"35\" y=\"146\" width=\"90\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"80\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">二进制帧</text>\n  <text x=\"80\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">心跳 Ping/Pong</text>\n  <line x1=\"140\" y1=\"130\" x2=\"180\" y2=\"130\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"180\" y=\"50\" width=\"230\" height=\"160\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"295\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">游戏服 Netty Pipeline</text>\n  <rect x=\"195\" y=\"88\" width=\"200\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"295\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SslHandler（WSS 加密）</text>\n  <rect x=\"195\" y=\"118\" width=\"200\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"295\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">HttpServerCodec + 聚合（握手用）</text>\n  <rect x=\"195\" y=\"148\" width=\"200\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/>\n  <text x=\"295\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">WebSocketServerProtocolHandler（升级）</text>\n  <rect x=\"195\" y=\"178\" width=\"200\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"295\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">帧解码器 + 业务分发（复用 TCP 那套）</text>\n  <line x1=\"410\" y1=\"130\" x2=\"450\" y2=\"130\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#arr2)\"/>\n  <rect x=\"450\" y=\"50\" width=\"170\" height=\"160\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"535\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">业务层（传输无关）</text>\n  <text x=\"535\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BinaryWebSocketFrame</text>\n  <text x=\"535\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">frame.content() = ByteBuf</text>\n  <text x=\"535\" y=\"140\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">直接喂魔数+长度+协议号解码器</text>\n  <text x=\"535\" y=\"166\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\">H5 玩家与原生客户端同服</text>\n  <text x=\"535\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同套 Disruptor 投递与处理器</text>\n  <text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\">坑：微信/浏览器有单帧大小限制，大包要分帧；WSS 证书过期是经典线上事故，证书要进监控</text>\n  <text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">KCP 接入：NioDatagramChannel + KCP Handler（conv 标识会话），线程模型与连接管理复用 TCP 经验</text>\n</svg>",
    "caption": "图：WebSocket 通过三段式 Pipeline 复用原生 TCP 的编解码与业务层"
   },
   {
    "t": "h",
    "text": "百万连接容量规划与安全防护"
   },
   {
    "t": "p",
    "text": "百万连接五层缺一不可：OS 层（ulimit -n 提到百万级、somaxconn ≥ backlog、tcp_tw_reuse、防 nf_conntrack 表满静默丢包）；JVM/Netty 层（堆外精算——每连接读缓冲+写缓冲+内部对象数 KB~数十 KB，百万连接光缓冲就是 GB 级，G1/ZGC 防 Full GC 全服心跳超时雪崩）；架构层（网关层多实例 + LVS/SLB，登录服分流调度）；压测（机器人客户端批量建连/发心跳/模拟操作，指标看建连成功率、RT P99、GC 停顿、出站缓冲水位，故障注入模拟弱网）；线上护栏（连接数/包速率/内存水位告警，过载降级预案：限新建连、踢离线最久连接）。安全防护四层：内核抗 SYN flood（tcp_syncookies=1）、协议层防畸形包（maxFrameLength 上限 + 魔数校验 + 慢速攻击用登录超时踢线）、应用层未登录限流（令牌桶挂 AttributeKey）+ 协议号白名单、业务层人机校验；心法：越靠前越便宜地拒绝。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 生产级网关初始化（全参数一次到位）\nEventLoopGroup boss = new NioEventLoopGroup(1);\nEventLoopGroup worker = new NioEventLoopGroup();   // 默认 CPU 核数 * 2\nServerBootstrap b = new ServerBootstrap();\nb.group(boss, worker)\n .channel(EpollServerSocketChannel.class)            // Linux 大服用 native epoll，绕开空轮询\n .option(ChannelOption.SO_BACKLOG, 4096)\n .option(ChannelOption.SO_REUSEADDR, true)          // 发布快速绑定 TIME_WAIT 端口\n .childOption(ChannelOption.TCP_NODELAY, true)       // 关 Nagle\n .childOption(ChannelOption.SO_KEEPALIVE, true)      // TCP 兜底保活\n .childOption(ChannelOption.WRITE_BUFFER_WATER_MARK,\n        new WriteBufferWaterMark(64 * 1024, 1024 * 1024))  // 广播服高水位调大\n .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)\n .childHandler(new ChannelInitializer<SocketChannel>() {\n     protected void initChannel(SocketChannel ch) {\n         ch.pipeline()\n           .addLast(new IdleStateHandler(90, 0, 0))\n           .addLast(new GameFrameDecoder())\n           .addLast(new GameRateLimiter())           // 未登录限流：令牌桶挂 AttributeKey\n           .addLast(new GameDispatchHandler());\n     }\n });\n// 优雅停机：拒新 → 保旧 → 等收尾\nboss.shutdownGracefully(10, 30, TimeUnit.SECONDS);\nworker.shutdownGracefully(10, 30, TimeUnit.SECONDS);\n// 发布前：摘流量 → 通知在线玩家 → 等 RingBuffer 排空 → 存会话快照 → shutdownGracefully"
   },
   {
    "t": "pits",
    "items": [
     "把 Tomcat NIO 当长连接用：Tomcat NIO 只解决接入多路复用，业务仍走线程池同步模型，十万长连接线程爆炸，且 Servlet 没有服务端主动推送语义",
     "WSS 证书过期/配置漏掉：H5 全量玩家连不上，证书要进监控告警；握手 URL 带 token 注意日志泄漏",
     "KCP 当 TCP 用：UDP 无连接、NAT 会话保持要更高频心跳，防火墙/运营商对 UDP 不友好要留 TCP 降级通道",
     "容量规划只算连接数不算堆外内存：每连接数 KB~数十 KB 缓冲，百万连接是 GB 级堆外账，必须按连接数 × 单连接开销精算",
     "优雅停机忘了等 Disruptor 排空：正在结算的订单/存档未落盘就杀进程，玩家数据丢失引客诉；quietPeriod 设太短回包被截断"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：选型看通信模型——GM 后台 Tomcat、游戏服 Netty，登录服无连接化支撑平滑部署；WebSocket 三段式 Pipeline 让 H5 与原生客户端同服，实时对战走 UDP/KCP 绕开队头阻塞；百万连接是 OS/JVM/架构/压测/护栏五层工程，安全防护坚持『越靠前越便宜地拒绝』；优雅停机守『拒新、保旧、等收尾』。"
   }
  ]
 },
 {
  "id": "netty-integration",
  "title": "Netty 与主流框架集成：SpringBoot / Dubbo / gRPC / WebSocket / HTTP-2",
  "layer": 3,
  "depends": [
   "netty-gateway"
  ],
  "covers": [
   "netty-31",
   "netty-33",
   "netty-32",
   "netty-30",
   "netty-36"
  ],
  "quiz": [
   "netty-31",
   "netty-33"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Netty 从不是孤岛：与 SpringBoot 的容器集成决定开发效率，Dubbo/gRPC 的传输层关系决定你对 RPC 生态的认知，WebSocket 三段式接入与 HTTP/2/3 的演进则是网关面向未来的底座。"
   },
   {
    "t": "pre",
    "items": [
     "Netty 与 Tomcat/Undertow 的定位差异（netty-gateway）",
     "SpringBoot 依赖注入与 Bean 生命周期",
     "WebSocket 握手与二进制帧的基础（netty-gateway）",
     "HTTP/1.1 请求-响应模型与长连接推送的局限"
    ]
   },
   {
    "t": "h",
    "text": "一、Spring/SpringBoot 集成模式"
   },
   {
    "t": "p",
    "text": "两种主流集成姿势。姿势一，Netty Handler 由 Spring 管理：把解码器、业务分发 Handler 注册为 Spring Bean（@Component 或 @Sharable 无状态单例），ChannelInitializer 里从容器按类型取用，业务 Handler 可以 @Autowired 注入 Service/Repository——好处是游戏逻辑全部走 Spring 生态（事务、AOP、配置、监控）。姿势二，Netty 服务器生命周期交给 Spring：用 ApplicationRunner / SmartLifecycle 启动 bootstrap，@PreDestroy / destroyMethod 里 shutdownGracefully 优雅停机，这样发布时 Spring 先注入完所有 Bean 再开端口，停机时先摘流量再关连接。注意：Handler 如果是 @Sharable 单例，必须无状态（不可变字段）；有状态的会话 Handler 每条连接 new，不要往 Spring 里塞。Netty 线程上的业务调用 Spring Bean 是安全的，只要这些 Bean 本身线程安全（Service 无状态、Repository 走连接池）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@SpringBootApplication\npublic class GameServerApp implements ApplicationRunner {\n    @Autowired private GameDispatchHandler dispatchHandler; // Spring 注入\n    @Autowired private PlayerService playerService;\n    private EventLoopGroup boss, worker;\n\n    public void run(ApplicationArguments args) {\n        boss = new NioEventLoopGroup(1);\n        worker = new NioEventLoopGroup();\n        ServerBootstrap b = new ServerBootstrap();\n        b.group(boss, worker)\n         .channel(NioServerSocketChannel.class)\n         .childHandler(new ChannelInitializer<SocketChannel>() {\n             protected void initChannel(SocketChannel ch) {\n                 ch.pipeline()\n                   .addLast(new IdleStateHandler(90, 0, 0))\n                   .addLast(new GameFrameDecoder())\n                   .addLast(dispatchHandler);   // 复用 Spring 单例\n             }\n         });\n        b.bind(9000).sync();\n    }\n\n    @PreDestroy\n    public void stop() {\n        boss.shutdownGracefully(10, 30, TimeUnit.SECONDS);\n        worker.shutdownGracefully(10, 30, TimeUnit.SECONDS);\n    }\n}"
   },
   {
    "t": "h",
    "text": "二、与 Dubbo / gRPC 的传输层关系"
   },
   {
    "t": "p",
    "text": "Dubbo 和 gRPC 是『完整的 RPC 框架』，Netty 只是它们默认选用的传输层。Dubbo 从 2.6 起默认用 Netty 4 承载自定义二进制协议（dubbo 协议：header + body），序列化默认 Hessian2，你可以把 Dubbo 理解为『Netty + 协议层 + 注册中心 + 集群容错』的组合；Dubbo 3 还支持 triple 协议（HTTP/1.1+gRPC 兼容），传输层仍是 Netty。gRPC 默认跑在 HTTP/2 上（ALPN 协商），Netty 负责 HTTP/2 传输，Protobuf 负责序列化，方法/参数/返回值的 RPC 语义由 gRPC 框架解析。关键认知：你的游戏服私有协议也可以叠在 Dubbo/gRPC 之上——如果团队已有 Dubbo 生态，登录服/支付服的内部调用直接走 Dubbo 服务，玩家长连接仍由裸 Netty 承载，两者互不冲突。选型依据：Dubbo 适合 Java 生态服务治理（负载均衡/熔断/灰度），gRPC 适合跨语言、需要流式传输、proto 已有生态的团队。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">传输层 vs RPC 框架：Netty 只是 Dubbo/gRPC 的底座</text><rect x=\"30\" y=\"44\" width=\"280\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"170\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Dubbo（RPC 框架）</text><rect x=\"45\" y=\"76\" width=\"250\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"170\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">dubbo 协议 | Hessian2 序列化 | 注册中心/治理</text><rect x=\"45\" y=\"104\" width=\"250\" height=\"24\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"170\" y=\"121\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">传输层 = Netty 4</text><rect x=\"330\" y=\"44\" width=\"280\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"470\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">gRPC（RPC 框架）</text><rect x=\"345\" y=\"76\" width=\"250\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"470\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">HTTP/2 + Protobuf | 流式/双向流</text><rect x=\"345\" y=\"104\" width=\"250\" height=\"24\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"470\" y=\"121\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">传输层 = Netty（HTTP/2）</text><rect x=\"30\" y=\"156\" width=\"580\" height=\"44\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"178\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">游戏服：玩家长连接 → 裸 Netty 自研协议；服内服务调用 → Dubbo/gRPC（传输仍是 Netty）</text><text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">两套并存不冲突，业务层按调用类型选择通道</text><rect x=\"30\" y=\"210\" width=\"580\" height=\"40\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"236\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty 提供传输；协议/序列化/服务治理由上层框架各自实现</text></svg>",
    "caption": "图：Dubbo 与 gRPC 的协议栈分层，Netty 在传输层"
   },
   {
    "t": "h",
    "text": "三、WebSocket 握手与帧：三段式 Pipeline"
   },
   {
    "t": "p",
    "text": "H5/小游戏不能裸 TCP，只能走 WebSocket。Netty 的 Pipeline 三段式：SslHandler（WSS 加密，生产必备）→ HttpServerCodec + HttpObjectAggregator（解析握手请求、聚合头体）→ WebSocketServerProtocolHandler（校验握手、返回 101 升级、后续自动收发 Ping/Pong/Close，握手成功后自动移除 HTTP Handler）→ 业务 Handler 收到 WebSocketFrame。帧类型四类：BinaryWebSocketFrame（承载你的二进制协议）、TextWebSocketFrame（文本调试）、Ping/PongWebSocketFrame（协议层保活）、CloseWebSocketFrame（关闭握手）。关键技巧：BinaryWebSocketFrame.content() 是 ByteBuf，直接喂给已有的『魔数+长度+协议号』解码器——业务层传输无关，H5 与原生客户端同服。安全注意：握手 URL 带 token 有日志泄漏风险，token 放首条消息或 header 更稳。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">WebSocket 三段式 Pipeline：握手 → 升级 → 二进制帧</text><rect x=\"20\" y=\"50\" width=\"130\" height=\"180\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"85\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">H5/小游戏</text><rect x=\"32\" y=\"88\" width=\"106\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"85\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GET Upgrade</text><rect x=\"32\" y=\"124\" width=\"106\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"85\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">101 切换协议</text><rect x=\"32\" y=\"160\" width=\"106\" height=\"30\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"85\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">二进制帧双向</text><text x=\"85\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">心跳 Ping/Pong</text><path d=\"M150 130 L190 130\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"190\" y=\"50\" width=\"250\" height=\"180\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"315\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">游戏服 Netty Pipeline</text><rect x=\"205\" y=\"88\" width=\"220\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"315\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SslHandler（WSS）</text><rect x=\"205\" y=\"118\" width=\"220\" height=\"26\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"315\" y=\"136\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">HttpServerCodec + 聚合（握手）</text><rect x=\"205\" y=\"148\" width=\"220\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"315\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">WebSocketServerProtocolHandler</text><rect x=\"205\" y=\"178\" width=\"220\" height=\"26\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"315\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">BinaryFrame → 原游戏解码器</text><text x=\"315\" y=\"224\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">握手成功后自动移除 HTTP Handler</text><rect x=\"460\" y=\"50\" width=\"160\" height=\"180\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"540\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">业务层复用</text><text x=\"540\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">魔数+长度+协议号</text><text x=\"540\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">帧解码器零改动</text><text x=\"540\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">H5 与原生客户端同服</text><text x=\"540\" y=\"178\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">token 放首条消息</text><text x=\"540\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">防 URL 日志泄漏</text></svg>",
    "caption": "图：WebSocket 握手升级后复用原二进制解码器"
   },
   {
    "t": "h",
    "text": "四、HTTP/2 与 HTTP/3 简介"
   },
   {
    "t": "list",
    "items": [
     "HTTP/2 四大改进：二进制分帧（替代文本）、多路复用（一条连接并发多个流，解决队头阻塞中『应用层请求串行』）、头部压缩 HPACK（静态+动态表，头部体积降 90%+）、流优先级与服务端推送",
     "Netty 支持：netty-codec-http2 模块，Http2FrameCodec 把帧映射为对象 + Http2MultiplexHandler 每个流一个子 Channel，TLS 下用 ALPN 协商 h2；h2c 明文走 HTTP Upgrade",
     "HTTP/3 本质：传输层换 QUIC（UDP 之上自带 TLS1.3、多路复用、连接迁移、0-RTT），彻底消除 TCP 级队头阻塞——一个流丢包不影响其他流",
     "Netty 支持现状：netty-incubator-codec-http3 模块（实验性，基于 QUIC），生产环境跟进需评估稳定性",
     "游戏网关相关：WebSocket 在 HTTP/2/3 下有新帧（RFC 8441），未来 H5 游戏可更丝滑；游戏内帧同步的 UDP/KCP 与 QUIC 思路同源（UDP 自建可靠传输），可互相借鉴"
    ]
   },
   {
    "t": "h",
    "text": "五、游戏网关与平台打通"
   },
   {
    "t": "p",
    "text": "游戏服作为长连接网关，要和周边系统打通：SDK 登录鉴权（HTTP 回调）、支付回调（签名验签）、GM 后台指令（内网 RPC/Kafka）、日志上报（Kafka/日志服）、运营指标（Redis 计数）。落地模式：Netty 网关层只管『连接、编解码、心跳、限流、协议分发』，把业务语义全部转交给 Spring 业务层；玩家请求解码成消息后投递 Disruptor，业务线程调用 RPC（Dubbo 服内调用）或写 Kafka（日志/事件）或操作 Redis/DB；GM 指令从 Kafka/RPC 进来后，查玩家映射表拿到 Channel 再 writeAndFlush。集成铁律：Netty 线程不做阻塞业务，跨服务调用一律投递业务线程池；网关与业务服解耦，网关可独立扩缩容扛连接，业务服专注逻辑。"
   },
   {
    "t": "pits",
    "items": [
     "Handler 里手动 new 容器拿 Bean：ApplicationContext 没启动完或作用域不对，NPE；Handler 应由 Spring 注入或从容器按类型取",
     "Netty 线程上直接调非线程安全的 Spring 单例：静态变量/有状态 Bean 跨线程并发，数据错乱；Service 必须无状态",
     "WebSocket 用 TextWebSocketFrame 传二进制：文本帧按 UTF-8 解析会损坏二进制协议；二进制必须走 BinaryWebSocketFrame",
     "忘了 HttpObjectAggregator：握手请求 Split 成多段，ProtocolHandler 解析失败，H5 玩家全连不上",
     "HTTP/2 走 TLS 不配 ALPN：证书协商不了 h2，退化为 HTTP/1.1；需 OpenSSL 支持 ALPN 的配置",
     "握手 URL 带 token：日志、代理缓存都可能泄漏凭据；token 改放首条消息或自定义 header，并做未鉴权限流踢线"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：SpringBoot 集成 = Handler 由容器管理 + 生命周期交给 Spring（ApplicationRunner 启动、@PreDestroy 停机）；Dubbo/gRPC 的传输层都是 Netty，游戏服『裸 Netty 承载长连接 + Dubbo/gRPC 承载服内调用』两套并存；WebSocket 三段式 Pipeline 握手升级后复用原解码器；HTTP/2 靠二进制分帧+HPACK+多路复用，HTTP/3 用 QUIC 消除队头阻塞；网关与平台打通的铁律是 Netty 只管连接、阻塞业务一律出 EventLoop。"
   }
  ]
 },
 {
  "id": "netty-performance-tuning",
  "title": "Netty 性能调优与故障排查：背压 / 泄漏 / 无锁串行化 / 压测",
  "layer": 3,
  "depends": [
   "netty-eventloop-tuning",
   "netty-bytebuf-pool",
   "netty-async-write"
  ],
  "covers": [
   "netty-28",
   "netty-29",
   "netty-17",
   "netty-21",
   "netty-36",
   "netty-19"
  ],
  "quiz": [
   "netty-28",
   "netty-29",
   "netty-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "调优不是调参，而是先建观测：背压水位、pendingTasks、泄漏检测、FastThreadLocal、无锁串行化，再配一套贴近真实的压测。最后六个线上案例，把『症状-定位-修复』的排查套路全部走一遍。"
   },
   {
    "t": "pre",
    "items": [
     "write 入队 / flush 发送 / 高低水位的背压机制（netty-async-write）",
     "池化内存、引用计数与泄漏检测基础（netty-bytebuf-pool）",
     "EventLoop 一轮循环与 ioRatio（netty-eventloop-tuning）",
     "广播降级与慢客户端治理（netty-async-write）"
    ]
   },
   {
    "t": "h",
    "text": "一、高低水位与背压：写路径的第一道防线"
   },
   {
    "t": "p",
    "text": "channel.write() 只是把消息挂进 ChannelOutboundBuffer 记账，flush() 才真正写 Socket。当内核发送缓冲慢（慢客户端、弱网），JVM 出站缓冲开始堆积，超过高水位（默认 WriteBufferWaterMark 高 64KB / 低 32KB，可用 ChannelOption.WRITE_BUFFER_WATER_MARK 覆盖）时 channel.isWritable() 返回 false，并触发 channelWritabilityChanged()。此时背压策略就位：广播循环里跳过该连接的非关键包、对玩家降级（降频/丢非关键状态）、连续不可写则标记卡顿玩家并踢线。广播服瞬时写峰高，可把高水位调大到 512KB~1MB 容忍毛刺；内存敏感或海量连接场景调小，更早暴露慢连接。注意：水位线只是『告知』，真正生效靠你在 channelWritabilityChanged/isWritable 里写的降级逻辑——参数设了不判断等于没设。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 广播降级 + 慢连接踢线\nvoid broadcastToPlayer(Long playerId, Object msg) {\n    Channel ch = onlineChannels.get(playerId);\n    if (ch == null || !ch.isActive()) return;\n    if (!ch.isWritable()) {\n        // 出站缓冲超高水位：降级\n        int slow = ch.attr(ATTR_SLOW_COUNT).getAndIncrement();\n        if (slow > 3) {\n            ch.writeAndFlush(KickPacket.of(REASON_SLOW))\n              .addListener(ChannelFutureListener.CLOSE);\n        }\n        return;   // 暂时跳过非关键状态包\n    }\n    ch.writeAndFlush(msg);\n}\n\n// 压测机器人：模拟真实玩家建连/心跳/操作\nfor (int i = 0; i < 50000; i++) {\n    // 错峰建连（指数分布），按真实频率发包、混合消息大小，模拟弱网丢包\n    client = new GameClient(host, port, randInterval(), playerProfile);\n}\n// 观测指标：建连成功率、RT P99、GC 停顿、EventLoop pendingTasks、\n//          出站缓冲水位、心跳超时率、allocator.activeBytes()"
   },
   {
    "t": "h",
    "text": "二、channelWritabilityChanged 与补发风暴"
   },
   {
    "t": "p",
    "text": "channelWritabilityChanged 在 Channel 可写状态翻转时回调（该 Channel 所属 EventLoop 线程上）。两个坑：其一，恢复可写瞬间疯狂补发——把之前积压的消息一口气 write 出去，立刻又顶回高水位，形成『顶高-排空-再顶高』的锯齿，CPU 与延迟双炸；正确做法是限速补发（每轮最多补发 N 条，或按 isWritable 分段）。其二，慢连接踢线要果断——同一广播体发给 10 万连接，一个慢连接积压 1MB，十个就是 10MB，内存被慢客户端拖垮前必须先踢。广播本身也要优化：CompositeByteBuf 共享 body 减拷贝、分片分批发送、AOI 裁剪+增量同步+10Hz 合帧，把单玩家单帧的字节数压到最小。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">背压闭环：水位线 → isWritable → 降级/踢线</text><rect x=\"20\" y=\"50\" width=\"150\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"95\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">业务线程广播</text><text x=\"95\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">writeAndFlush</text><text x=\"95\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">批量攒 flush</text><path d=\"M170 95 L210 95\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"210\" y=\"50\" width=\"200\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"310\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">ChannelOutboundBuffer</text><text x=\"310\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">超过高水位 64KB</text><text x=\"310\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">isWritable()=false</text><path d=\"M410 95 L450 95\" stroke=\"var(--lv3)\" stroke-width=\"2\"/><rect x=\"450\" y=\"50\" width=\"170\" height=\"90\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"535\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">降级策略</text><text x=\"535\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">跳过非关键包/降频</text><text x=\"535\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">连续慢 → 踢线</text><rect x=\"20\" y=\"166\" width=\"600\" height=\"40\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">恢复可写（低于低水位 32KB）→ 限速补发，绝不一次补光形成锯齿</text><rect x=\"20\" y=\"216\" width=\"600\" height=\"50\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">监控：每 Channel 出站缓冲总量、不可写时长、slowCount——网络健康度最灵敏指标</text><text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">广播优化：CompositeByteBuf 共享 body、AOI 裁剪、增量同步、10Hz 合帧</text></svg>",
    "caption": "图：水位线驱动的背压闭环与降级策略"
   },
   {
    "t": "h",
    "text": "三、内存泄漏检测级别与线上定位"
   },
   {
    "t": "list",
    "items": [
     "四级检测：DISABLED（关）、SIMPLE（默认，抽样 1/128）、ADVANCED（抽样 1/32 带分配栈）、PARANOID（全量，性能开销大）；生产故障时可动态用 -Dio.netty.leakDetection.level=advanced 重启取证",
     "定位流程：出现 LEAK 日志 → 直接看分配的调用栈 → 定位到具体 Handler 的 release 缺失 → 修代码 + 跑复现压测确认消失",
     "辅助手段：allocator.metric() 看 activeBytes 是否单调上涨；NMT（-XX:NativeMemoryTracking）看 off-heap；unpooled 止血隔离",
     "防复发：release 纪律写进 CodeReview Checklist（接管消息必 release、retain 成对、finally 兜底）；泄漏用例进自动化压测"
    ]
   },
   {
    "t": "h",
    "text": "四、FastThreadLocal：为什么比 ThreadLocal 快"
   },
   {
    "t": "p",
    "text": "ThreadLocal 用 ThreadLocalMap + 开放寻址，每次 get 要 hash、线性探测、可能有缓存行伪共享；FastThreadLocal 用 ThreadLocalMap 换成 InternalThreadLocalMap，下标直接定位（类似数组随机访问），O(1) 无 hash 冲突，且数据结构按缓存行对齐减少伪共享。配合 Netty 的 FastThreadLocalThread（EventLoop 默认线程即该类型），get/set 比 ThreadLocal 快一个量级。游戏服高吞吐路径（解码、广播、Disruptor 消费线程）的线程局部数据（如线程内复用对象、计数桶）用 FastThreadLocal 有明显的微观收益。注意别把连接态挂 FastThreadLocal——线程被 EventLoop 复用服务多条连接会串数据，连接态必须挂 AttributeKey。"
   },
   {
    "t": "h",
    "text": "五、无锁串行化：EventLoop 单线程 + Disruptor 分片"
   },
   {
    "t": "p",
    "text": "游戏服的无锁化是『结构性』的：I/O 层 Channel 终身绑定单 EventLoop，同一连接的所有事件串行执行，天然免锁；业务层把收包投递 Disruptor 环形缓冲，消费者按玩家 ID 分片到多个 RingBuffer，每个 RingBuffer 单线程消费——玩家内操作串行免锁，分片间并行吃满多核。要点：多 RingBuffer 分片时用 playerId % ringCount 定序，保证同一玩家的消息永远进同一 Ring；写回 Channel 时用 eventLoop.execute(() -> ch.writeAndFlush(msg)) 切回 I/O 线程，保持无锁。Disruptor 快在：环形数组预分配无 GC、CAS 代替锁、消费者批处理、缓存行填充消除伪共享。整个架构一句话：『I/O 线程不阻塞，业务线程按玩家分片串行，跨线程只交换不可变消息』。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"bold\" fill=\"var(--ink)\">无锁串行化架构：I/O 免锁 + 业务按玩家分片</text><rect x=\"20\" y=\"48\" width=\"150\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Netty EventLoop</text><text x=\"95\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同连接同线程</text><text x=\"95\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">解码后投递</text><text x=\"95\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不阻塞</text><path d=\"M170 93 L210 93\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"210\" y=\"48\" width=\"120\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"270\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Ring 0</text><text x=\"270\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">playerId%N=0</text><text x=\"270\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单线程消费</text><text x=\"270\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">免锁</text><rect x=\"340\" y=\"48\" width=\"120\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"400\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Ring 1</text><text x=\"400\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">playerId%N=1</text><text x=\"400\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单线程消费</text><text x=\"400\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">免锁</text><rect x=\"470\" y=\"48\" width=\"150\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"545\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Ring N-1</text><text x=\"545\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分片并行</text><text x=\"545\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">吃满多核</text><path d=\"M330 93 L340 93\" stroke=\"var(--line)\" stroke-width=\"2\"/><path d=\"M460 93 L470 93\" stroke=\"var(--line)\" stroke-width=\"2\"/><rect x=\"20\" y=\"170\" width=\"600\" height=\"40\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">玩家内串行 → 免锁；玩家间并行 → 多核；回写 eventLoop.execute 切回 I/O 线程</text><rect x=\"20\" y=\"220\" width=\"600\" height=\"44\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">FastThreadLocal：下标定位 O(1)、缓存行对齐；连接态挂 AttributeKey 不挂线程局部</text><text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Disruptor：环形预分配无 GC、CAS、批处理、缓存行填充防伪共享</text></svg>",
    "caption": "图：I/O 层与业务层双重的无锁串行化结构"
   },
   {
    "t": "h",
    "text": "六、压测方法论与常用指标"
   },
   {
    "t": "list",
    "items": [
     "指标：建连成功率、RT P99/P999（不是 avg）、TPS/QPS、GC 停顿（CMS/G1 阶段时间）、EventLoop CPU、pendingTasks、出站缓冲水位、心跳超时率、堆外 activeBytes",
     "场景：建连风暴（万级同时接入）、心跳风暴（全量心跳）、广播风暴（全服公告/团战）、慢客户端拖拽（模拟低带宽）、弱网丢包（tcp 丢包注入）、重启恢复（优雅停机+重连洪峰）",
     "工具：自研机器人客户端最贴真实（错峰建连、真实频率、混合大小、模拟慢读断线）；JMeter 只适合 HTTP；netty-benchmark/自写 benchmark 做组件级对比",
     "流程：基线压测 → 单因子变量（线程数/水位/ioRatio/allocator）→ 记录拐点 → 回到场景复合压测 → 故障注入验证降级逻辑 → 输出容量报告",
     "反模式：只测峰值不看 P99（毛刺漏掉）；压测机器人行为不像玩家（纯洪峰是 DDoS 不是压测）；调参不压测（改完凭感觉上线）"
    ]
   },
   {
    "t": "h",
    "text": "七、线上问题案例复盘"
   },
   {
    "t": "list",
    "items": [
     "案例一：单核 CPU 100% —— 症状：某个 worker 线程打满。定位：top -H → jstack 看栈在 selector 相关 → 确认空轮询 → 升级 JDK / 启用 EpollEventLoopGroup / 调 rebuild 阈值。根因：JDK Selector epoll 空轮询 bug",
     "案例二：全服心跳集体超时 —— 症状：几千玩家同时掉线重连。定位：GC 日志发现 5 秒 Full GC 停顿 → EventLoop 全被 STW 冻结 → 心跳定时任务没跑。根因：对象分配压力大触发 Full GC；对策：堆外泄漏连带 + 调 GC 参数/ZGC",
     "案例三：堆外内存持续上涨 —— 症状：JVM 堆稳定、RSS 涨、最终 native OOM。定位：开 ADVANCED 泄漏检测 → LEAK 堆栈指向广播 Handler → 发现广播后没 release 共享 body。根因：retain/release 不对称",
     "案例四：广播后内存翻倍 —— 症状：全服公告后内存尖峰。定位：广播循环里对 10 万连接每个 writeAndFlush 独立 body → 每连接一份拷贝。根因：没用 CompositeByteBuf 共享 body；对策：共享 body + isWritable 过滤 + 分片发送",
     "案例五：某个 EventLoop 上玩家全部卡顿 —— 症状：延迟毛刺集中在某一组连接。定位：该线程 jstack 发现阻塞在 JDBC 查询 → 业务把查库写在 Handler 里。根因：EventLoop 上做了阻塞 IO；对策：投递业务线程池",
     "案例六：连接数翻倍吞吐不涨 —— 定位顺序：先看 EventLoop 是否打满 → 内核参数（backlog/conntrack）→ GC 停顿 → 网卡队列/带宽 → 逐层缩圈。根因往往是多个瓶颈叠加"
    ]
   },
   {
    "t": "pits",
    "items": [
     "压测只看 avg 不看 P99：平均延迟被大部分快请求拉低，毛刺全部藏起来；游戏体验由 P99/P999 决定",
     "调大水位线不写降级逻辑：参数设了不判断等于没设，慢客户端照样拖垮内存",
     "泄漏检测级别常年在默认 SIMPLE：抽样 1/128 小流量可能漏检；压测阶段就开 ADVANCED 排查干净",
     "用 ThreadLocal 而不用 FastThreadLocal：EventLoop 线程复用多连接，线程局部串数据；FastThreadLocal 只给『线程私有临时对象』用",
     "线程数凭感觉拍：不压测反推单 EventLoop 吞吐，多线程只增加上下文切换",
     "排查故障不先看 GC：EventLoop 假死、心跳超时、延迟尖峰，第一嫌疑往往是 GC 停顿——先看 GC 日志再谈别的",
     "慢连接不踢只降级：降级只是缓解，连续不可写必须踢线，否则僵尸慢连接长期占内存"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：背压靠水位线+isWritable+降级踢线的完整闭环，恢复可写限速补发防锯齿；泄漏检测 ADVANCED 拿堆栈、metric 看 activeBytes、unpooled 止血；FastThreadLocal 下标定位提速，连接态挂 AttributeKey；无锁串行化 = I/O 单线程 + 业务按玩家分片 RingBuffer；压测看 P99/P999、场景覆盖建连/心跳/广播/慢客户端/故障注入；六个案例贯穿『GC 优先、线程栈、泄漏栈、水位线』四条排查主线。"
   }
  ]
 }
]
};
