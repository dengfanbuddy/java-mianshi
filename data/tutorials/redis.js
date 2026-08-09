window.TB = window.TB || {};
window.TB["redis"] = {
  id: "redis",
  name: "Redis",
  icon: "🧠",
  nodes: [
 {
  "id": "redis-data-structures",
  "title": "五种基本数据结构与高级结构",
  "layer": 0,
  "depends": [],
  "covers": [
   "redis-01",
   "redis-25",
   "redis-26"
  ],
  "quiz": [
   "redis-01",
   "redis-25",
   "redis-26"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Redis 是游戏服务器的事实级缓存层：五种基本数据结构 + Bitmap/HyperLogLog/Geo 三种高级结构，选型先看读写模式。"
   },
   {
    "t": "pre",
    "items": [
     "了解 Redis 是单线程内存 KV 存储，命令天然原子执行",
     "了解它在游戏架构中的位置：登录服 session、游戏服排行榜/玩家档案、活动服防重"
    ]
   },
   {
    "t": "h",
    "text": "五种基本数据结构与游戏选型"
   },
   {
    "t": "p",
    "text": "选型口诀：串哈希、列集合、带分排。String 干计数的活、Hash 存对象、List 当队列、Set 做去重、ZSet 管排序——每一种都能在你的游戏项目里找到落地点。"
   },
   {
    "t": "list",
    "items": [
     "String：计数、token、发号器。游戏服里 INCR 生成全服唯一 ID、存分布式 session token",
     "Hash：对象存储，field 级读写省内存。玩家基础档案（等级/昵称/VIP）登录服校验后缓存",
     "List：队列与最新列表。聊天消息、邮件列表用 LPUSH + LTRIM 截断，天然 O(1) 头尾操作",
     "Set：去重与交并集。在线玩家集合、活动参与防重（SADD 天然幂等）",
     "ZSet：带分数的排序集合。战力榜/等级榜首选，ZADD 写分、ZREVRANGE 取 TopN、ZREVRANK 查名次，都是 O(logN)"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 游戏服典型用法（Jedis）\nJedis jedis = new Jedis(\"redis-game-01\", 6379);\n\n// 1) ZSet：全服战力排行榜，O(logN) 写分与查榜\njedis.zadd(\"rank:power\", 128500.0, \"uid:1001\");\nList<Tuple> top = jedis.zrevrangeWithScores(\"rank:power\", 0, 99); // Top100\nLong myRank = jedis.zrevrank(\"rank:power\", \"uid:1001\");          // 自己名次\n\n// 2) Hash：玩家基础档案，field 级读写，登录服预载\njedis.hset(\"player:1001\", \"level\", \"68\");\njedis.hset(\"player:1001\", \"vip\", \"5\");\nString level = jedis.hget(\"player:1001\", \"level\"); // O(1) 只取一个字段\n\n// 3) Set：活动资格防重，SADD 天然幂等（重复添加返回 0）\nlong added = jedis.sadd(\"act:summer:claimed\", \"1001\");\nif (added == 1) grantReward(1001); // 只有第一次插入才发奖"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 400\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">Redis 五种数据结构选型速查</text>\n  <rect x=\"20\" y=\"44\" width=\"600\" height=\"60\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"20\" y=\"44\" width=\"150\" height=\"60\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"95\" y=\"80\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"15\" font-weight=\"bold\">String</text>\n  <text x=\"185\" y=\"66\" fill=\"var(--ink)\" font-size=\"13\">计数 / 二进制安全；token、发号器</text>\n  <text x=\"185\" y=\"88\" fill=\"var(--muted)\" font-size=\"12\">游戏场景：INCR 全服唯一 ID、分布式 session</text>\n  <rect x=\"20\" y=\"112\" width=\"600\" height=\"60\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"20\" y=\"112\" width=\"150\" height=\"60\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"95\" y=\"148\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"15\" font-weight=\"bold\">Hash</text>\n  <text x=\"185\" y=\"134\" fill=\"var(--ink)\" font-size=\"13\">对象存储，field 级读写省内存</text>\n  <text x=\"185\" y=\"156\" fill=\"var(--muted)\" font-size=\"12\">游戏场景：玩家档案（等级/昵称/VIP）</text>\n  <rect x=\"20\" y=\"180\" width=\"600\" height=\"60\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"20\" y=\"180\" width=\"150\" height=\"60\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"95\" y=\"216\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"15\" font-weight=\"bold\">List</text>\n  <text x=\"185\" y=\"202\" fill=\"var(--ink)\" font-size=\"13\">有序队列，头尾 O(1)</text>\n  <text x=\"185\" y=\"224\" fill=\"var(--muted)\" font-size=\"12\">游戏场景：聊天消息、邮件 LPUSH+LTRIM</text>\n  <rect x=\"20\" y=\"248\" width=\"600\" height=\"60\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"20\" y=\"248\" width=\"150\" height=\"60\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"95\" y=\"284\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"15\" font-weight=\"bold\">Set</text>\n  <text x=\"185\" y=\"270\" fill=\"var(--ink)\" font-size=\"13\">去重、交并集；SADD 幂等</text>\n  <text x=\"185\" y=\"292\" fill=\"var(--muted)\" font-size=\"12\">游戏场景：在线集合、活动参与防重</text>\n  <rect x=\"20\" y=\"316\" width=\"600\" height=\"60\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <rect x=\"20\" y=\"316\" width=\"150\" height=\"60\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"95\" y=\"352\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"15\" font-weight=\"bold\">ZSet</text>\n  <text x=\"185\" y=\"338\" fill=\"var(--ink)\" font-size=\"13\">带分数的有序集合，O(logN)</text>\n  <text x=\"185\" y=\"360\" fill=\"var(--muted)\" font-size=\"12\">游戏场景：战力榜 ZADD、TopN ZREVRANGE、名次 ZREVRANK</text>\n  <text x=\"320\" y=\"394\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">选型口诀：串哈希、列集合、带分排——先看读写模式再选型</text>\n</svg>",
    "caption": "图：五种基本数据结构与游戏场景选型"
   },
   {
    "t": "h",
    "text": "三种高级结构"
   },
   {
    "t": "p",
    "text": "小到签到留存的精确位标记、大到亿级 UV 估算、再到 LBS 玩法，高级结构用最省的内存补足基本结构做不了的事：Bitmap 一人一位做签到/DAU/留存，HyperLogLog 用 12KB 估亿级 UV（标准误差 0.81%），Geo 底层就是 ZSet 加 GeoHash 编码做附近玩家查询。"
   },
   {
    "t": "table",
    "head": [
     "结构",
     "底层",
     "复杂度",
     "游戏场景"
    ],
    "rows": [
     [
      "String",
      "int/embstr/raw",
      "O(1)",
      "发号器 INCR、session token"
     ],
     [
      "Hash",
      "listpack/hashtable",
      "O(1) field 级",
      "玩家档案（等级/昵称/VIP）"
     ],
     [
      "List",
      "quicklist(listpack)",
      "O(1) 头尾",
      "聊天消息、邮件队列"
     ],
     [
      "Set",
      "intset/listpack/hashtable",
      "O(1) 成员",
      "在线集合、活动防重"
     ],
     [
      "ZSet",
      "listpack/skiplist+dict",
      "O(logN)",
      "战力/等级排行榜"
     ],
     [
      "Bitmap",
      "String 位数组",
      "O(1) 位操作",
      "签到、DAU、7 日留存"
     ],
     [
      "HyperLogLog",
      "12KB 稀疏/稠密",
      "O(1)",
      "亿级 UV 估算"
     ],
     [
      "Geo",
      "ZSet + GeoHash",
      "O(logN)",
      "附近玩家、同城匹配"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "面试官爱挖：只背定义不举例。每种结构必须配一个游戏场景并说出命令（发号器、玩家档案、活动防重、排行榜）",
     "别把 Bitmap 当万能：它要求 uid 是连续可映射数值，离散 string ID 要先做映射，否则稀疏位图反而撑爆内存",
     "ZSet 同分排名按 member 字典序而非先到先得，产品要'先达到排前面'必须做 score 编码（见排行榜治理节点）",
     "HLL 只有估算值、拿不出名单也不能做交集留存，要精确统计必须回 Bitmap；选型时先想清楚业务到底要什么"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Redis 不是'内存 HashMap 换皮'。五种结构 + 三种高级结构覆盖排行榜、玩家档案、session、防重、DAU 五类游戏核心场景，能按读写模式脱口而出选型依据，就是这道题的高分起点。"
   }
  ]
 },
 {
  "id": "redis-encodings",
  "title": "底层编码：String/Hash/ZSet 与跳表",
  "layer": 1,
  "depends": [
   "redis-data-structures"
  ],
  "covers": [
   "redis-02",
   "redis-03",
   "redis-04",
   "redis-30"
  ],
  "quiz": [
   "redis-02",
   "redis-03",
   "redis-04"
  ],
  "body": [
   {
    "t": "lead",
    "text": "底层编码是 Redis 的内存账本：String 三种编码、聚合结构两级编码，理解了 44 字节、listpack、跳表与渐进式 rehash，内存优化和性能排查才有根基。"
   },
   {
    "t": "pre",
    "items": [
     "掌握五种数据结构的使用与复杂度（节点 1）",
     "了解 jemalloc 按固定档位分配内存，以及 64 字节缓存行概念"
    ]
   },
   {
    "t": "h",
    "text": "String 的三种编码：int / embstr / raw"
   },
   {
    "t": "p",
    "text": "Redis 按内容与长度自动选择编码，对外完全透明：值是 long 范围内整数走 int，短字符串走 embstr，长字符串走 raw。面试的区分度在 44 字节阈值和'embstr 只读'这个细节。"
   },
   {
    "t": "list",
    "items": [
     "int：value 是 long 范围内整数时，直接存在 redisObject 的 ptr 里，零额外内存分配",
     "embstr：字符串 ≤44 字节，redisObject 与 SDS 一次 malloc 连续存放，分配/释放各一次，缓存友好",
     "raw：字符串 >44 字节，redisObject 与 SDS 分两次分配，中间靠指针连接",
     "转换单向且不可逆：int 追加非数字内容、embstr 任何修改（APPEND/SETRANGE）都会先转 raw"
    ]
   },
   {
    "t": "p",
    "text": "为什么是 44：redisObject 16 字节 + SDS 头部 3 字节 + 结尾 \\0 = 64 字节，正好落进 jemalloc 一个分配档位/缓存行；64 - 16 - 3 - 1 = 44。另外 Redis 会共享 0~9999 的整数字符串对象。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 巡检脚本：发现编码越界的大 key（Jedis 4.x API）\n// 注意：生产环境遍历用 SCAN 分批，禁止 KEYS\ntry (Jedis jedis = pool.getResource()) {\n    for (String key : jedis.scan(\"player:*\")) {\n        String enc = jedis.objectEncoding(key);   // OBJECT ENCODING\n        long bytes = jedis.memoryUsage(key);      // MEMORY USAGE\n        if (\"hashtable\".equals(enc) || bytes > 1024) {\n            log.warn(\"玩家档案编码越界: key={} enc={} bytes={}\", key, enc, bytes);\n        }\n    }\n}\n// 阈值在 redis.conf：\n// hash-max-listpack-entries 128    hash-max-listpack-value 64"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">String 底层编码：int / embstr / raw</text>\n  <rect x=\"20\" y=\"52\" width=\"190\" height=\"96\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"115\" y=\"78\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"14\" font-weight=\"bold\">int</text>\n  <text x=\"115\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">value 为 long 整数</text>\n  <text x=\"115\" y=\"126\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">直接存 redisObject.ptr</text>\n  <rect x=\"225\" y=\"52\" width=\"190\" height=\"96\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"320\" y=\"78\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"14\" font-weight=\"bold\">embstr</text>\n  <text x=\"320\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">≤44 字节短串</text>\n  <text x=\"320\" y=\"126\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">redisObject+SDS 一次分配</text>\n  <rect x=\"430\" y=\"52\" width=\"190\" height=\"96\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"525\" y=\"78\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"14\" font-weight=\"bold\">raw</text>\n  <text x=\"525\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">&gt;44 字节长串</text>\n  <text x=\"525\" y=\"126\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">两次分配，指针连接</text>\n  <path d=\"M 415 100 L 430 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"320\" y=\"46\" text-anchor=\"middle\" fill=\"var(--lv3)\" font-size=\"12\">任何修改先转 raw（embstr 只读）</text>\n  <rect x=\"70\" y=\"178\" width=\"500\" height=\"118\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"90\" y=\"204\" fill=\"var(--ink)\" font-size=\"14\" font-weight=\"bold\">为什么是 44 字节？</text>\n  <text x=\"90\" y=\"230\" fill=\"var(--ink)\" font-size=\"13\">44 = 64(一个 jemalloc 档位/缓存行) - 16(redisObject) - 3(SDS 头) - 1(结尾 NUL)</text>\n  <text x=\"90\" y=\"256\" fill=\"var(--muted)\" font-size=\"12\">embstr 的 redisObject 与 SDS 共用一次 malloc，正好放进 64 字节缓存行；超过则拆两次分配为 raw</text>\n  <text x=\"90\" y=\"282\" fill=\"var(--muted)\" font-size=\"12\">附加：0~9999 的整数字符串对象全局共享（整数共享池），int 编码零分配由此而来</text>\n</svg>",
    "caption": "图：String 三种编码与 44 字节阈值"
   },
   {
    "t": "h",
    "text": "Hash / ZSet 的两级编码"
   },
   {
    "t": "p",
    "text": "聚合结构用'小数据省内存、大数据保性能'的思路做两级编码：元素少且值小时用紧凑的 listpack 连续存储，超限单向转成索引结构。转换只发生一次，绝不回头。"
   },
   {
    "t": "list",
    "items": [
     "listpack（Redis 7 前叫 ziplist）：Hash/ZSet 元素 ≤128 且单值 ≤64 字节时使用，连续内存、无指针开销，最省内存",
     "超限单向转换：Hash 转 hashtable（dict），ZSet 转 skiplist+dict；转完不回退",
     "ziplist 的硬伤是连锁更新：每项记录前驱长度，头部插入大元素会引发级联扩容，最坏 O(N²)；listpack 每项只记自身长度，插入删除不影响邻居，Redis 7 彻底替换",
     "ZSet 双结构共享元素：dict 存 member→score 实现 O(1) 查分，skiplist 保证范围查询 O(logN)，两处指向同一份数据不重复存储"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">聚合结构两级编码：小数据省内存，大数据保性能</text>\n  <rect x=\"20\" y=\"52\" width=\"270\" height=\"96\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"155\" y=\"78\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">listpack（Redis 7 前 ziplist）</text>\n  <text x=\"155\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">元素 ≤128 且单值 ≤64 字节</text>\n  <text x=\"155\" y=\"126\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">连续内存、无指针开销，省内存</text>\n  <rect x=\"350\" y=\"52\" width=\"270\" height=\"96\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"485\" y=\"78\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">hashtable / skiplist+dict</text>\n  <text x=\"485\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">Hash 转 hashtable；ZSet 转 skiplist+dict</text>\n  <text x=\"485\" y=\"126\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">牺牲空间换 O(1)/O(logN) 查询</text>\n  <path d=\"M 290 100 L 350 100\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n  <text x=\"320\" y=\"92\" text-anchor=\"middle\" fill=\"var(--lv1)\" font-size=\"12\">超限单向转换，不回退</text>\n  <text x=\"20\" y=\"182\" fill=\"var(--ink)\" font-size=\"13\">listpack 每个 entry 只存自身长度，插入删除不影响邻居——根治 ziplist 的 O(N²) 级联更新</text>\n  <text x=\"20\" y=\"210\" fill=\"var(--ink)\" font-size=\"13\">ZSet 双结构共享元素：dict 存 member→score 支持 O(1) 查分，skiplist 管范围查询 O(logN)</text>\n  <text x=\"20\" y=\"238\" fill=\"var(--muted)\" font-size=\"12\">渐进式 rehash：ht[0]/ht[1] 双表并存，每次增删查顺带迁一个桶，新写只进 ht[1]，搬完收敛释放旧表</text>\n  <text x=\"20\" y=\"266\" fill=\"var(--muted)\" font-size=\"12\">跳表：多层有序链表，随机层高（向上概率 1/4、上限 32 层），节点带 span 跨度所以算排名也是 O(logN)</text>\n</svg>",
    "caption": "图：Hash/ZSet 两级编码与单向转换"
   },
   {
    "t": "h",
    "text": "跳表与渐进式 rehash"
   },
   {
    "t": "p",
    "text": "跳表是多层有序链表，高层是低层的'快车道'，靠随机层级实现 O(logN) 查找；ZSet 用它而不是红黑树，核心原因是范围查询（ZREVRANGEBYSCORE）顺第 0 层链表直接走，红黑树要中序遍历。rehash 则是把 HashMap 一次性整体扩容摊成每次操作顺带迁移一个桶，避免百万级 key 一次搬完阻塞主线程。"
   },
   {
    "t": "pits",
    "items": [
     "别把 44 说成随口数字：要会算 64 - 16(redisObject) - 3(SDS 头) - 1(\\0) 这条公式",
     "embstr 是只读的，说'embstr 可修改'是送命题；任何修改先转 raw 再操作",
     "编码转换是单向的（小→大），没有'转回来'一说；ZSet 的 dict 和 skiplist 是同一份元素的两种索引，不是两份数据",
     "跳表晋升概率是 1/4 不是 1/2；范围查询友好 + 实现简单是选跳表弃红黑树的两大论点，缺一不可",
     "bgsave 期间扩容阈值从负载因子 1 放宽到 5，是为了少写新表少触发 COW 复制，别答成'防止丢数据'"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：底层编码是一套'空间换时间、时间换空间'的自动升降档机制。能背出 44 字节算式、listpack 阈值参数名、ZSet 双结构共享元素、跳表晋升概率，再把渐进式 rehash 和 HashMap 扩容对比讲清楚，这套题就稳了。"
   }
  ]
 },
 {
  "id": "redis-persistence",
  "title": "持久化：RDB 快照与 AOF 日志",
  "layer": 1,
  "depends": [
   "redis-data-structures"
  ],
  "covers": [
   "redis-05",
   "redis-06",
   "redis-21"
  ],
  "quiz": [
   "redis-05",
   "redis-06",
   "redis-21"
  ],
  "body": [
   {
    "t": "lead",
    "text": "持久化是 Redis 的'抗丢'底线：RDB 是某一时刻的快照、AOF 是每条写命令的流水账，混合模式兼得恢复快与数据全，游戏服按数据等级选型。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 Redis 单线程模型与文件 IO",
     "理解 fork 子进程与写时复制（COW）的基本语义"
    ]
   },
   {
    "t": "h",
    "text": "RDB：fork + COW 的内存快照"
   },
   {
    "t": "p",
    "text": "bgsave 时主进程 fork 出子进程，子进程把 fork 那一刻的共享内存页写成 dump.rdb，主进程继续服务。COW 意味着主进程写某个页时才复制一份再写，所以快照是 fork 时刻的数据视图——但三个生产坑必须脱口而出。"
   },
   {
    "t": "list",
    "items": [
     "fork 本身阻塞主线程：要拷贝页表，内存越大越慢，几十 GB 实例可能阻塞几百毫秒到秒级",
     "COW 放大内存：快照期间写越猛、复制页越多，极端情况内存接近翻倍，maxmemory 要留 buffer 别打满",
     "大页（THP）会加剧 COW 放大，生产建议关闭 transparent_hugepage",
     "大实例的 RDB 备份放到从节点执行，主节点关闭 save 配置，低峰期操作"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 360\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">RDB bgsave：fork 子进程 + 写时复制(COW)</text>\n  <rect x=\"40\" y=\"48\" width=\"240\" height=\"62\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"160\" y=\"72\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"14\" font-weight=\"bold\">主进程</text>\n  <text x=\"160\" y=\"94\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">继续服务，仅在 fork 瞬间阻塞</text>\n  <rect x=\"360\" y=\"48\" width=\"240\" height=\"62\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"480\" y=\"72\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"14\" font-weight=\"bold\">子进程</text>\n  <text x=\"480\" y=\"94\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">把内存快照写入 dump.rdb</text>\n  <path d=\"M 280 79 L 360 79\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"320\" y=\"72\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">fork 拷贝页表</text>\n  <text x=\"40\" y=\"140\" fill=\"var(--ink)\" font-size=\"13\">共享物理内存页（父子进程 COW 共享，快照 = fork 时刻的数据视图）</text>\n  <rect x=\"40\" y=\"152\" width=\"80\" height=\"46\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"80\" y=\"180\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">页 P1</text>\n  <rect x=\"128\" y=\"152\" width=\"80\" height=\"46\" fill=\"var(--panel)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"168\" y=\"180\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">P2 写中</text>\n  <rect x=\"216\" y=\"152\" width=\"80\" height=\"46\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"256\" y=\"180\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">页 P3</text>\n  <rect x=\"304\" y=\"152\" width=\"80\" height=\"46\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"344\" y=\"180\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">页 P4</text>\n  <rect x=\"392\" y=\"152\" width=\"80\" height=\"46\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"432\" y=\"180\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">页 P5</text>\n  <rect x=\"480\" y=\"152\" width=\"80\" height=\"46\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"520\" y=\"180\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">页 P6</text>\n  <rect x=\"128\" y=\"216\" width=\"80\" height=\"40\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"168\" y=\"241\" text-anchor=\"middle\" fill=\"var(--lv1)\" font-size=\"12\">COW 副本</text>\n  <path d=\"M 168 198 L 168 216\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n  <text x=\"216\" y=\"228\" fill=\"var(--lv1)\" font-size=\"12\">写哪页抄哪页（内存放大）</text>\n  <text x=\"40\" y=\"282\" fill=\"var(--ink)\" font-size=\"13\">三个生产坑：</text>\n  <text x=\"40\" y=\"306\" fill=\"var(--ink)\" font-size=\"12\">1. fork 阻塞：拷贝页表，几十 GB 实例可达秒级——大实例备份放从节点</text>\n  <text x=\"40\" y=\"330\" fill=\"var(--ink)\" font-size=\"12\">2. COW 放大：快照期间写越猛复制越多，极端内存翻倍——maxmemory 留 buffer</text>\n  <text x=\"40\" y=\"352\" fill=\"var(--ink)\" font-size=\"12\">3. 大页(THP)加剧 COW 放大——生产建议关闭 transparent_hugepage</text>\n</svg>",
    "caption": "图：RDB fork + COW 原理与三个生产坑"
   },
   {
    "t": "h",
    "text": "AOF：命令日志与刷盘策略"
   },
   {
    "t": "p",
    "text": "AOF 记录每条写命令，关键顺序是'先执行命令、后写日志'——日志永远不记错命令，但崩在执行与写盘之间会丢这一条。命令先进 aof_buf，再按 appendfsync 策略落盘：always 每条 fsync 最安全最慢、everysec 每秒一次是生产主流、no 交给 OS（可能丢几十秒）。"
   },
   {
    "t": "p",
    "text": "AOF 重写（bgrewriteaof）不是整理旧文件，而是 fork 子进程直接读当前内存重建最小命令集（100 次 INCR 合成一条 SET）；期间新命令同时写旧 AOF 缓冲和重写缓冲，重写完成后追加合并。混合持久化（aof-use-rdb-preamble，4.0 起默认开启）让重写结果变成 RDB 快照头 + AOF 增量尾，重启加载又快又全；同时开 RDB/AOF 时优先加载 AOF。"
   },
   {
    "t": "table",
    "head": [
     "对比项",
     "RDB",
     "AOF"
    ],
    "rows": [
     [
      "记录内容",
      "某一时刻内存快照（二进制）",
      "每条写命令（协议文本）"
     ],
     [
      "数据安全",
      "可能丢最后一次快照后的数据",
      "everysec 最多丢 1s；always 不丢"
     ],
     [
      "恢复速度",
      "快，直接加载二进制",
      "慢，逐条重放命令"
     ],
     [
      "性能影响",
      "fork + COW 内存放大",
      "fsync 频率影响写延迟"
     ],
     [
      "触发方式",
      "save / bgsave / save 规则",
      "appendfsync + bgrewriteaof"
     ]
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 游戏服数据分级：决定哪些 Redis 数据要哪种持久化\npublic enum DataGrade { CACHE, HOT_STATE, MONEY }\n\nvoid configurePersistence(DataGrade grade) {\n    switch (grade) {\n        case CACHE:     // 纯缓存：不持久化或仅 RDB，重启从 DB 回填\n        case HOT_STATE: // 热点状态：AOF everysec + RDB 双开\n        case MONEY:     // 货币/发奖：AOF everysec + MySQL 双写 + 对账任务\n    }\n}\n// redis.conf 生产推荐：\n// appendonly yes\n// appendfsync everysec\n// aof-use-rdb-preamble yes    混合持久化，4.0 起默认开启\n// 大实例：主节点 save \"\" 关闭 RDB，备份放从节点；低峰期操作"
   },
   {
    "t": "pits",
    "items": [
     "千万别说 fork 完全不阻塞主线程——fork 拷贝页表就是阻塞，几十 GB 实例秒级卡顿",
     "everysec 不保证只丢 1 秒：上次 fsync 没完成时主线程写会被迫等磁盘，可能阻塞更久；AOF 盘要 SSD、别和高 IO 服务抢磁盘",
     "save 和 bgsave 分清楚：save 主线程自己写全程阻塞，生产只用 bgsave",
     "AOF 重写读的是当前内存、不是整理旧日志；重写期间 fork 一样有 COW 风险",
     "游戏服货币数据 Redis 只是加速层，MySQL 才是事实源：丢数据靠 DB 重建 + 对账，不能指望 any 持久化兜底"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：RDB 赢在恢复快、AOF 赢在丢得少、混合模式两者兼得。面试把'先执行后写日志'、everysec 的隐藏阻塞、重写读内存重建、混合持久化默认开这几条讲全，再落到游戏服'缓存不持久化、货币 AOF+DB 双保险'的选型，就是生产级回答。"
   }
  ]
 },
 {
  "id": "redis-expire-eviction",
  "title": "过期删除、内存淘汰与缓存三兄弟",
  "layer": 1,
  "depends": [
   "redis-data-structures"
  ],
  "covers": [
   "redis-07",
   "redis-08",
   "redis-09",
   "redis-33",
   "redis-28"
  ],
  "quiz": [
   "redis-07",
   "redis-08",
   "redis-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "内存是 Redis 的生命线：过期删除管'到期数据'、内存淘汰管'内存打满'、缓存三兄弟管'DB 扛不住'——三层防线顺序错不得。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 TTL/EXPIRE 的语义",
     "理解 maxmemory 与缓存 miss 的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "过期删除：惰性 + 定期双机制"
   },
   {
    "t": "p",
    "text": "Redis 不用定时器逐个精确删除（百万级过期 key 的定时器堆开销划不来），而是惰性删除 + 定期删除双管齐下：访问时才查过期（省 CPU 费内存），同时后台每秒 10 次随机采样一批、过期比例超 25% 就继续抽（用少量 CPU 防内存堆积）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">key 过期删除：惰性 + 定期双管齐下</text>\n  <rect x=\"20\" y=\"48\" width=\"290\" height=\"128\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"40\" y=\"72\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">惰性删除（访问时）</text>\n  <text x=\"40\" y=\"98\" fill=\"var(--ink)\" font-size=\"12\">请求访问 key → 检查 TTL</text>\n  <text x=\"40\" y=\"120\" fill=\"var(--ink)\" font-size=\"12\">已过期 → 删除并返回空</text>\n  <text x=\"40\" y=\"142\" fill=\"var(--ink)\" font-size=\"12\">未过期 → 正常返回</text>\n  <text x=\"40\" y=\"166\" fill=\"var(--muted)\" font-size=\"12\">省 CPU，但没人访问的过期 key 会堆积</text>\n  <rect x=\"330\" y=\"48\" width=\"290\" height=\"128\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"350\" y=\"72\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">定期删除（serverCron，hz=10）</text>\n  <text x=\"350\" y=\"98\" fill=\"var(--ink)\" font-size=\"12\">每秒 10 次，随机采样一批（默认 20 个）</text>\n  <text x=\"350\" y=\"120\" fill=\"var(--ink)\" font-size=\"12\">删除其中已过期的 key</text>\n  <text x=\"350\" y=\"142\" fill=\"var(--ink)\" font-size=\"12\">过期比例 &gt;25% 继续抽，单次时间有限</text>\n  <text x=\"350\" y=\"166\" fill=\"var(--muted)\" font-size=\"12\">用少量 CPU 防过期 key 堆积占内存</text>\n  <rect x=\"20\" y=\"192\" width=\"600\" height=\"92\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"40\" y=\"216\" fill=\"var(--ink)\" font-size=\"13\">内存事故点：大量 key 集中过期且无人访问 → 定期删除抽不中 → 内存打满触发淘汰，可能误删正常 key</text>\n  <text x=\"40\" y=\"242\" fill=\"var(--ink)\" font-size=\"13\">对策：TTL 加随机抖动（1h + random(0~10min)），错峰过期也是防雪崩的手段</text>\n  <text x=\"40\" y=\"268\" fill=\"var(--muted)\" font-size=\"12\">从节点不主动删过期 key，由主节点删除后同步 del；3.2+ 从库读到过期 key 返回空但不删</text>\n</svg>",
    "caption": "图：惰性删除与定期删除双机制"
   },
   {
    "t": "h",
    "text": "内存淘汰：8 种策略怎么选"
   },
   {
    "t": "p",
    "text": "maxmemory 打满后按策略淘汰。三大类：noeviction 不淘汰（写满报错，当存储用）、volatile 系只淘汰设了 TTL 的、allkeys 系全 key 范围淘汰。LRU/LFU 都是近似实现：LRU 用一个随机采样池（默认 5 个里挑最久没用），LFU 用 8bit 计数器 + 衰减，抗突发流量比 LRU 好。"
   },
   {
    "t": "table",
    "head": [
     "大类",
     "策略",
     "适用场景"
    ],
    "rows": [
     [
      "不淘汰",
      "noeviction（默认）",
      "把 Redis 当存储，写满直接报错"
     ],
     [
      "volatile 系",
      "volatile-lru / lfu / random / ttl",
      "只淘汰设了 TTL 的 key"
     ],
     [
      "allkeys 系",
      "allkeys-lru / lfu / random",
      "纯缓存，全 key 范围淘汰"
     ],
     [
      "游戏服推荐",
      "allkeys-lru",
      "玩家档案缓存，冷玩家自然被淘汰"
     ]
    ]
   },
   {
    "t": "h",
    "text": "缓存穿透 / 击穿 / 雪崩"
   },
   {
    "t": "p",
    "text": "穿透是'查不存在的数据'（缓存永远 miss 打穿 DB）、击穿是'一个热点 key 刚好过期'（万级并发同时 miss）、雪崩是'大面积 key 同时失效'（或实例宕机）。根因不同解法不同：穿透用缓存空值 + 布隆过滤器 + 参数校验；击穿用互斥锁（SET NX 抢锁重建）或逻辑过期；雪崩用 TTL 随机抖动 + 热点不过期 + 多级缓存 + 熔断降级。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 缓存穿透防护：布隆过滤器前置拦截（RedisBloom / 自实现）\npublic Player loadPlayer(long uid) {\n    if (!bloom.mightContain(\"player:\" + uid)) return null; // 黑名单外必不存在\n    String json = redis.get(\"player:\" + uid);\n    if (json != null) return parse(json);\n    Player p = db.query(uid);                 // 到此才允许打 DB\n    if (p != null) {\n        // 回填缓存 + TTL 随机抖动防雪崩\n        redis.setex(\"player:\" + uid,\n            3600 + ThreadLocalRandom.current().nextInt(600), toJson(p));\n    } else {\n        redis.setex(\"player:\" + uid, 30, \"\"); // 缓存空值，短 TTL 兜底\n    }\n    return p;\n}"
   },
   {
    "t": "h",
    "text": "keyspace 通知与过期回调"
   },
   {
    "t": "p",
    "text": "开启 notify-keyspace-events 后过期/删除会发到 __keyevent@0__:expired 频道，但它是 Pub/Sub 实现 + 惰性删除触发：不准时（没人访问的 key 要等定期删除抽中才发事件）、不可靠（订阅方断线事件全丢）。生产监听 session 超时正确做法是 ZSet 延迟队列（score=到期时间戳，定时 ZRANGEBYSCORE 主动捞）或 MQ 定时消息。"
   },
   {
    "t": "pits",
    "items": [
     "别把定期删除说成'定时器逐 key 精确删除'——它是采样 + 有单次时间上限的近似清理",
     "volatile 系策略混持久 key 是事故：没设 TTL 的 key 不参与淘汰，可能内存打满还报 OOM；混业务就把实例拆开",
     "击穿是单 key、雪崩是大面积，两者解法完全不同，混为一谈是低级失误",
     "布隆过滤器有误判（说有可能没有）、不支持删除、容量估错只能重建；新玩家注册要实时加入过滤器，否则误杀真实用户",
     "keyspace 通知不准时不可靠，别拿它做精确倒计时或必须送达的通知；正解是 ZSet 延迟队列，主动权在自己手里",
     "maxmemory 别设满：要给 fork COW 和 OS 留余量，一般设物理内存 60~70%"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三条防线各司其职——过期删除主动清到期 key、淘汰是内存打满的被动兜底、缓存三兄弟守的是 DB。面试把双删除机制细节、8 种策略分类、三兄弟根因与解法、布隆过滤器的误判方向讲全，再落到 TTL 抖动与空值缓存等游戏场景对策，这题就是完整闭环。"
   }
  ]
 },
 {
  "id": "redis-advanced-structs",
  "title": "高级数据结构全解：Bitmap/Geo/HyperLogLog/Stream",
  "layer": 1,
  "depends": [
   "redis-data-structures"
  ],
  "covers": [
   "redis-25",
   "redis-26",
   "redis-24"
  ],
  "quiz": [
   "redis-25",
   "redis-26"
  ],
  "body": [
   {
    "t": "lead",
    "text": "四种高级结构把 Redis 的边界又往外推了一圈：Bitmap 一人一位做精确签到与 DAU、HyperLogLog 用 12KB 估亿级 UV、Geo 让附近的人在一行命令里完成、Stream 自带消费组和 ACK 补齐消息队列短板——它们的共同点是底层仍是 String 或 ZSet，真正的门槛在于误差边界和适用前提。"
   },
   {
    "t": "pre",
    "items": [
     "掌握五种基本结构的复杂度与游戏选型（redis-data-structures）",
     "理解 Redis 单线程、所有 value 本质是二进制安全 String",
     "了解 ZSet 的 score 与 skiplist 语义"
    ]
   },
   {
    "t": "h",
    "text": "一、Bitmap：一人一位的精确位图"
   },
   {
    "t": "p",
    "text": "Bitmap 不是独立数据结构，本质是 String 的位视图——offset 就是实体编号。SETBIT 把第 N 位置 1、GETBIT 读第 N 位、BITCOUNT 统计置 1 的位数、BITOP 做 AND/OR/XOR 跨位图运算、BITFIELD 把连续若干位当整数原子读写（Redis 3.2 引入，支持 GET/SET/INCRBY 子命令与 OVERFLOW WRAP/SAT/FAIL 溢出控制，有符号最大 64 位、无符号最大 63 位）。因为是 String，整张位图最大 512MB（offset 上限 2^32-1）。"
   },
   {
    "t": "p",
    "text": "内存账要会算：1 亿玩家一天 DAU 位图 = 1 亿 bit ≈ 12.5MB；一年 4.5GB，按天拆 key 加 TTL 即可。对比 Set 存 1 亿个 uid（约 5~10 字节/个），省一到两个数量级。前提：uid 必须是连续可映射的数值（发号器/映射表），否则稀疏 offset 会把位图撑爆。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 每日签到：sign:{uid}:{yyyyMM}，BITFIELD 原子读写位域\n// 第 5 天签到 + 读当月签到天数（u31 够装一个月）\nList<Long> r = jedis.bitfield(\"sign:1001:202408\",\n        \"INCRBY\", \"u1\", \"4\", \"1\",   // 第 5 天（offset 4）置 1\n        \"GET\", \"u31\", \"0\");          // 读前 31 位，等价于 BITCOUNT\nlong signedDays = r.get(1);\n// 7 日连续签到：7 张日 bitmap 做 AND，结果非 0 即达成\njedis.bitop(BitOP.AND, \"sign:7d:1001\",\n        \"sign:1001:20240801\", \"sign:1001:20240802\",\n        \"sign:1001:20240803\", \"sign:1001:20240804\",\n        \"sign:1001:20240805\", \"sign:1001:20240806\",\n        \"sign:1001:20240807\");\n// BITFIELD 与 SETBIT 区别：BITFIELD 可一次操作多个字段、带类型、带溢出控制；\n// 签到、连续签到这类\"整数字段\"逻辑用 BITFIELD 一条命令更省 RTT"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Bitmap 签到：sign:{uid}:{yyyyMM}，一位代表一天</text><rect x=\"40\" y=\"44\" width=\"560\" height=\"58\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"48\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"74\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"100\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"126\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"152\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"178\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"204\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"230\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"256\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"282\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"308\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"334\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"360\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"386\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"412\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><rect x=\"438\" y=\"52\" width=\"22\" height=\"42\" fill=\"var(--accent)\"/><text x=\"59\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">1号</text><text x=\"85\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">2号</text><text x=\"111\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">3号</text><text x=\"137\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">4号</text><text x=\"163\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">5号</text><text x=\"461\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">…31号</text><text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">SETBIT 按天置位 / BITCOUNT 统计当月签到天数 / BITFIELD INCRBY 原子加 / BITOP AND 算连续签到</text><text x=\"320\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">内存：1 亿玩家一天仅 12.5MB，比 Set 省一到两个数量级</text><text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">前提：uid 连续可映射 offset；离散 string ID 先做映射表，否则稀疏位图撑爆内存</text><text x=\"320\" y=\"228\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BITFIELD 3.2 引入，GET/SET/INCRBY + OVERFLOW WRAP/SAT/FAIL；有符号上限 64 位、无符号 63 位</text></svg>",
    "caption": "图：Bitmap 签到位图布局与命令职责"
   },
   {
    "t": "h",
    "text": "二、HyperLogLog：12KB 估亿级基数"
   },
   {
    "t": "p",
    "text": "原理一句话：对每个元素做哈希，统计二进制串里最长连续前导零的个数（伯努利试验）——前导零越长，说明见过的元素越\"稀有\"、基数越大。单个估计方差太大，Redis 用 2^14=16384 个寄存器分桶 + 调和平均降方差，每寄存器 6bit，总内存 16384×6/8 = 12288 字节 ≈ 12KB，标准误差 1.04/√16384 ≈ 0.81%。"
   },
   {
    "t": "p",
    "text": "命令三件套：PFADD 加元素、PFCOUNT 出估算值（支持多 key 临时合并）、PFMERGE 把多个 HLL 合并成并集。游戏服应用：PFADD dau:{date} {uid} 记活跃，PFMERGE 周/月 HLL 出周期 DAU，跨服合服直接把各服 HLL 合并算总 DAU——去重自动完成。局限必须脱口而出：只有估算值、拿不出名单、不能做交集/留存，要精确要名单回 Bitmap。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">HyperLogLog：固定 12KB 估亿级基数，标准误差 0.81%</text><rect x=\"40\" y=\"46\" width=\"270\" height=\"74\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"175\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Set 精确去重</text><text x=\"175\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">内存 O(N) 线性增长</text><text x=\"175\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">1 亿玩家 ≈ 1GB，能拿名单</text><rect x=\"330\" y=\"46\" width=\"270\" height=\"74\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"465\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">HyperLogLog 估算</text><text x=\"465\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">固定 12KB（16384 寄存器×6bit）</text><text x=\"465\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">标准误差 0.81%，拿不出名单</text><text x=\"320\" y=\"146\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">PFADD dau:20240801 {uid} → PFCOUNT 出当日 DAU 估算</text><text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">PFMERGE dau:week1 7 张日 HLL → 周 DAU；合服 = 各服 HLL 直接并集去重</text><text x=\"320\" y=\"204\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">局限：只有估算值、无名单、不能做交集/留存——要精确与留存必须回 Bitmap</text><text x=\"320\" y=\"230\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">底层也是 String（sds 编码），可用 GET/SET 序列化迁移</text><text x=\"320\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">PFADD 返回 0 只表示内部可能未变，不代表没被计入过</text></svg>",
    "caption": "图：HyperLogLog 与 Set 的内存/精度权衡"
   },
   {
    "t": "h",
    "text": "三、Geo：底层就是 ZSet 换皮"
   },
   {
    "t": "p",
    "text": "GEOADD 把经纬度经 GeoHash 交替二分编码成 52 位整数当 ZSet 的 score，member 是地名/玩家 ID——所以 Geo 天然带 ZSet 的 ZREM/ZRANGE 能力。查询半径要查九宫格：GeoHash 在编码边界上，物理相邻的点前缀可能完全不同，Redis 查目标格 + 周围 8 格再精算距离。GEOSEARCH（6.2 起更推荐）、GEODIST 算距离、GEOPOS 取坐标。局限：只有点 + 半径/矩形查询，无多边形无路线；玩家高频移动是写热点。"
   },
   {
    "t": "h",
    "text": "四、Stream：带消费组的日志结构"
   },
   {
    "t": "p",
    "text": "XADD 自动生成\"毫秒时间戳-序号\"ID，天然有序可范围查询（XRANGE）；XREADGROUP GROUP 组 消费者 > 创建/加入消费组读新消息；每条已投递未确认的消息进 Pending 列表，XACK 确认移除；消费者崩溃可用 XCLAIM/XAUTOCLAIM 把 Pending 消息转移重投；XTRIM MAXLEN ~ N 近似裁剪防内存无限涨。它把\"可靠消费\"的机制（消费组/ACK/重投）第一次做进了 Redis，但全内存存储、积压等于内存爆炸，这是它和小流量的边界。"
   },
   {
    "t": "table",
    "head": [
     "结构",
     "底层",
     "精确度",
     "游戏场景"
    ],
    "rows": [
     [
      "Bitmap",
      "String 位数组",
      "精确，一位一实体",
      "签到、DAU、7 日留存、活动资格位图"
     ],
     [
      "HyperLogLog",
      "16384 寄存器，12KB",
      "估算，误差 0.81%",
      "亿级 DAU/UV、合服去重统计"
     ],
     [
      "Geo",
      "ZSet + GeoHash 52 位",
      "精确到 0.6 米级格子",
      "附近的人、同城匹配、LBS 打卡"
     ],
     [
      "Stream",
      "listpack/rax 日志结构",
      "精确，可 ACK 重投",
      "轻量异步任务、事件总线、公告队列"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "把 Bitmap 当万能：uid 不连续会稀疏撑爆位图，离散 ID 先做映射表；要交集/留存必须 Bitmap，HLL 做不了",
     "HLL 只有估算值，说\"能精确统计 DAU\"是送命题；小数据量误差反而更大",
     "Geo 不是独立结构，是 ZSet 的 score 换皮，Redis 查半径其实在算九宫格再过滤距离",
     "Stream 不裁剪会无限涨内存，必须 XADD MAXLEN 或定期 XTRIM；XREADGROUP 忘记用 > 会反复读历史",
     "BITFIELD 的位宽上限要记牢：有符号 64 位、无符号 63 位（协议无法返回 64 位无符号）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：四种高级结构 = String/ZSet 换皮的四种姿势——Bitmap 精确位标记、HLL 常数内存估基数、Geo 空间索引、Stream 可靠消息队列。面试把内存账（12.5MB/亿人、12KB/亿级）和误差 0.81% 报清楚，再按\"要精确还是要省内存\"给选型，就是高分回答。"
   }
  ]
 },
 {
  "id": "redis-replication-sentinel",
  "title": "主从复制与哨兵高可用",
  "layer": 2,
  "depends": [
   "redis-persistence",
   "redis-encodings"
  ],
  "covers": [
   "redis-11",
   "redis-12",
   "redis-22"
  ],
  "quiz": [
   "redis-11",
   "redis-12",
   "redis-22"
  ],
  "body": [
   {
    "t": "lead",
    "text": "从主从复制到哨兵，是 Redis 从'单点内存'走向'高可用'的阶梯：异步复制必然有丢失窗口，哨兵把故障切换自动化，但业务幂等永远是兜底。"
   },
   {
    "t": "pre",
    "items": [
     "理解 RDB/AOF 与 fork 成本（节点 3）",
     "了解分布式系统的 CAP 与异步复制语义"
    ]
   },
   {
    "t": "h",
    "text": "主从复制：PSYNC 全量与增量"
   },
   {
    "t": "p",
    "text": "从库连上主库先发 PSYNC runid offset 尝试增量：runid 匹配且 offset 落在复制积压缓冲区（repl_backlog）内 → 回复 CONTINUE 增量补发；不匹配或落后太多 → 回复 FULLRESYNC，主库 bgsave 生成 RDB 发给从库、期间写命令进缓冲区，从库加载完 RDB 再补发追平。全量同步是异步复制，master 写完即返回，从库可能短暂落后。"
   },
   {
    "t": "list",
    "items": [
     "repl_backlog 是环形缓冲区，决定从库断线多久内能增量恢复（默认 1MB），高写量业务要调大，否则断线重连动不动全量",
     "runid + offset 标识数据版本与复制进度；从库重连优先 PSYNC 增量，失败才退全量",
     "无盘复制（repl-diskless-sync）：RDB 直接走 socket 不落盘，大实例省磁盘 IO",
     "全量同步期间主库要 fork + 网络传 RDB，大实例会抖；从库重连要快、backlog 要够大"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">主从复制：PSYNC 全量同步流程</text>\n  <text x=\"150\" y=\"52\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">slave（从库）</text>\n  <text x=\"480\" y=\"52\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">master（主库）</text>\n  <line x1=\"150\" y1=\"64\" x2=\"150\" y2=\"296\" stroke=\"var(--line)\"/>\n  <line x1=\"480\" y1=\"64\" x2=\"480\" y2=\"296\" stroke=\"var(--line)\"/>\n  <line x1=\"150\" y1=\"84\" x2=\"480\" y2=\"84\" stroke=\"var(--accent)\" stroke-dasharray=\"5 4\"/>\n  <text x=\"315\" y=\"78\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">1. PSYNC runid offset（先尝试增量）</text>\n  <line x1=\"480\" y1=\"116\" x2=\"150\" y2=\"116\" stroke=\"var(--lv1)\" stroke-dasharray=\"5 4\"/>\n  <text x=\"315\" y=\"110\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">2. runid/backlog 不匹配 → FULLRESYNC</text>\n  <line x1=\"150\" y1=\"148\" x2=\"480\" y2=\"148\" stroke=\"var(--accent)\" stroke-dasharray=\"5 4\"/>\n  <text x=\"315\" y=\"142\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">3. 传输 RDB 快照，期间写命令进缓冲区</text>\n  <text x=\"315\" y=\"184\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"13\">4. slave 加载 RDB，重建全量数据</text>\n  <line x1=\"150\" y1=\"216\" x2=\"480\" y2=\"216\" stroke=\"var(--accent)\" stroke-dasharray=\"5 4\"/>\n  <text x=\"315\" y=\"210\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">5. 补发缓冲写命令 → 进入增量命令传播</text>\n  <text x=\"20\" y=\"260\" fill=\"var(--ink)\" font-size=\"13\">关键点：repl_backlog 决定断线容忍窗口——offset 在 backlog 内则增量恢复，否则全量；高写量业务调大（默认 1MB）</text>\n  <text x=\"20\" y=\"286\" fill=\"var(--muted)\" font-size=\"12\">主从复制是异步非强一致：master 写完即返回；WAIT 命令可半同步等 N 个从库确认，牺牲延迟换一致性</text>\n  <text x=\"20\" y=\"310\" fill=\"var(--muted)\" font-size=\"12\">全量 = fork + 传 RDB，大实例会抖：从库断线重连要快、backlog 要够大，避免动不动全量</text>\n</svg>",
    "caption": "图：PSYNC 全量同步时序"
   },
   {
    "t": "h",
    "text": "复制的一致性与脑裂"
   },
   {
    "t": "p",
    "text": "异步复制决定了主从切换必然有丢失窗口：主库写完还没同步就宕机，新主缺这批数据；更危险的是脑裂——主库与哨兵网络分区但没死，客户端还在写旧主，哨兵把从库升主后分区恢复，旧主降级全量同步，分区期间写旧主的数据全丢。Redis 层缓解：min-replicas-to-write + min-replicas-max-lag 让主库检测到健康从库不足时拒绝写，把丢失窗口从'分区时长'压到'lag 上限'（拿可用性换一致性）；业务层兜底永远是 MySQL 事实源 + 幂等 + 唯一约束三件套。"
   },
   {
    "t": "h",
    "text": "哨兵：主观下线到故障转移"
   },
   {
    "t": "p",
    "text": "哨兵集群每秒向主/从/其他哨兵发 PING，超时标记主观下线；询问其他哨兵、票数 ≥ quorum 才确认客观下线；随后用 Raft 选出领头哨兵执行故障转移：选新主（replica-priority → 复制 offset → runid）→ replicaof no one 扶正 → 其他从库改复制新主 → 旧主回归降级为从。客户端通过哨兵订阅 +switchmaster 事件感知新主地址。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 310\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">哨兵故障转移：判定两步 + 切换四步</text>\n  <rect x=\"20\" y=\"48\" width=\"290\" height=\"92\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"40\" y=\"72\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">① 主观下线</text>\n  <text x=\"40\" y=\"96\" fill=\"var(--ink)\" font-size=\"12\">单个哨兵 PING 超时</text>\n  <text x=\"40\" y=\"118\" fill=\"var(--muted)\" font-size=\"12\">down-after-milliseconds 未回 → 标记疑似宕机</text>\n  <rect x=\"330\" y=\"48\" width=\"290\" height=\"92\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"350\" y=\"72\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">② 客观下线</text>\n  <text x=\"350\" y=\"96\" fill=\"var(--ink)\" font-size=\"12\">询问其他哨兵，同意票数 ≥ quorum</text>\n  <text x=\"350\" y=\"118\" fill=\"var(--muted)\" font-size=\"12\">防单哨兵误判，确认主库确实宕机</text>\n  <path d=\"M 310 94 L 330 94\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"320\" y=\"86\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">投票</text>\n  <rect x=\"20\" y=\"160\" width=\"600\" height=\"132\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"40\" y=\"186\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">③ Raft 选领头哨兵 → ④ 故障转移四步</text>\n  <text x=\"40\" y=\"212\" fill=\"var(--ink)\" font-size=\"13\">选新主：replica-priority → 复制 offset 最大 → runid 最小</text>\n  <text x=\"40\" y=\"236\" fill=\"var(--ink)\" font-size=\"13\">replicaof no one 扶正 → 其他从库改为复制新主 → 旧主回归降级为从</text>\n  <text x=\"40\" y=\"262\" fill=\"var(--muted)\" font-size=\"12\">哨兵至少 3 个且奇数（Raft 多数派）；quorum 管客观下线、多数派 n/2+1 管选举，两个阈值别混淆</text>\n  <text x=\"40\" y=\"284\" fill=\"var(--muted)\" font-size=\"12\">故障转移期间（秒级~十几秒）写不可用：排行榜写、锁获取会失败，业务要有重试与降级预案</text>\n</svg>",
    "caption": "图：哨兵主观/客观下线与故障转移"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 客户端经哨兵获取主库地址（游戏服连接层）\nSet<String> sentinels = new HashSet<>(Arrays.asList(\n        \"10.0.0.11:26379\", \"10.0.0.12:26379\", \"10.0.0.13:26379\"));\nJedisSentinelPool pool = new JedisSentinelPool(\"mymaster\", sentinels);\n\ntry (Jedis jedis = pool.getResource()) {\n    jedis.zincrby(\"rank:power\", 100, \"uid:1001\"); // 排行榜写分\n    jedis.sadd(\"act:summer:claimed\", \"1001\");     // 活动防重\n} catch (JedisException e) {\n    // 故障转移窗口内写失败：记录重试队列，稍后补偿（幂等）\n    retryQueue.offer(new RetryTask(e.getCommand(), e.getArgs()));\n}"
   },
   {
    "t": "pits",
    "items": [
     "主从复制是异步非强一致，别答成'同步复制'；切换丢数据是物理事实，只能缩小窗口",
     "quorum 和 Raft 多数派是两个独立阈值：quorum 管客观下线判定，n/2+1 管领头哨兵选举",
     "min-replicas-to-write 是拿可用性换一致性：从库全挂或网络抖动时主库也会拒写，必须配监控告警",
     "WAIT 只等从库'接收命令'不等落盘，且超时继续执行，别指望它保证不丢",
     "别拿 keyspace 通知做 session 过期回调（见上一节点）；哨兵本身也会成为单点，小集群也要至少 3 个"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：主从复制是 Redis 高可用的地基（全量/增量切换由 runid 与 backlog 决定），哨兵是自动化运维大脑（主观→客观→Raft→四步转移）。面试按时间线完整走一遍，再主动说出异步复制丢数据与脑裂的 Redis 层缓解和业务层幂等兜底，就是架构级回答。"
   }
  ]
 },
 {
  "id": "redis-cluster",
  "title": "Cluster 集群分片与扩缩容",
  "layer": 2,
  "depends": [
   "redis-persistence",
   "redis-expire-eviction"
  ],
  "covers": [
   "redis-13",
   "redis-31",
   "redis-32"
  ],
  "quiz": [
   "redis-13",
   "redis-31",
   "redis-32"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Cluster 把 Redis 从'一台内存'变成'一个分布式系统'：16384 个槽是中间层，MOVED/ASK 是导航协议，hash tag 是跨槽操作的钥匙。"
   },
   {
    "t": "pre",
    "items": [
     "理解主从与哨兵的复制语义（节点 5）",
     "了解 CRC16 哈希与一致性哈希的区别"
    ]
   },
   {
    "t": "h",
    "text": "16384 个槽与分片定位"
   },
   {
    "t": "p",
    "text": "slot = CRC16(key) mod 16384，每个主节点负责一段 slot，扩容缩容本质是槽在节点间迁移。为什么是 16384 而不是 65536：槽位图要塞进节点间心跳包，16384 位 = 2KB，65536 位 = 8KB，心跳带宽差 4 倍；集群设计上限约 1000 个主节点，16384 个槽分出去绰绰有余。"
   },
   {
    "t": "list",
    "items": [
     "hash tag：key 里 {xxx} 部分参与哈希计算，{actId} 能把同活动所有 key 强制落同一 slot，保证 MGET/事务/Lua 可用",
     "跨 slot 的多 key 命令直接报 CROSSSLOT——排行榜批量操作、同活动多 key 原子操作都要靠 hash tag 规避",
     "smart 客户端（Lettuce/JedisCluster）维护本地路由表，收到 MOVED 自动更新、收到 ASK 自动先 ASKING 再执行",
     "Cluster 自带故障转移（Gossip + 选举），无需额外哨兵集群"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">Cluster 分片：key → slot → 节点</text>\n  <rect x=\"230\" y=\"44\" width=\"200\" height=\"48\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"330\" y=\"73\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">CRC16(key) mod 16384</text>\n  <path d=\"M 330 92 L 330 106\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <rect x=\"20\" y=\"108\" width=\"195\" height=\"34\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"117\" y=\"130\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">slot 0-5460</text>\n  <rect x=\"215\" y=\"108\" width=\"195\" height=\"34\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n  <text x=\"312\" y=\"130\" text-anchor=\"middle\" fill=\"var(--lv1)\" font-size=\"12\">slot 5461-10922</text>\n  <rect x=\"410\" y=\"108\" width=\"195\" height=\"34\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"507\" y=\"130\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">slot 10923-16383</text>\n  <text x=\"117\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">节点 A（主）</text>\n  <text x=\"312\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">节点 B（主）</text>\n  <text x=\"507\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">节点 C（主）</text>\n  <rect x=\"20\" y=\"190\" width=\"290\" height=\"108\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"40\" y=\"214\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">MOVED 永久重定向</text>\n  <text x=\"40\" y=\"238\" fill=\"var(--ink)\" font-size=\"12\">slot 已整体迁移到别的节点</text>\n  <text x=\"40\" y=\"260\" fill=\"var(--muted)\" font-size=\"12\">客户端更新本地路由表</text>\n  <text x=\"40\" y=\"282\" fill=\"var(--muted)\" font-size=\"12\">后续请求直达新节点</text>\n  <rect x=\"330\" y=\"190\" width=\"290\" height=\"108\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"350\" y=\"214\" fill=\"var(--lv1)\" font-size=\"13\" font-weight=\"bold\">ASK 临时跳转</text>\n  <text x=\"350\" y=\"238\" fill=\"var(--ink)\" font-size=\"12\">slot 正在迁移中（部分 key 已走）</text>\n  <text x=\"350\" y=\"260\" fill=\"var(--muted)\" font-size=\"12\">先发 ASKING 再执行</text>\n  <text x=\"350\" y=\"282\" fill=\"var(--muted)\" font-size=\"12\">路由表不更新，下次可能还跳</text>\n  <text x=\"20\" y=\"318\" fill=\"var(--muted)\" font-size=\"12\">hash tag：{actId} 内只对 tag 内容算槽，把同活动/同玩家 key 聚到同一 slot，规避 CROSSSLOT</text>\n</svg>",
    "caption": "图：slot 分片与 MOVED/ASK 重定向"
   },
   {
    "t": "h",
    "text": "在线扩缩容与迁移风险"
   },
   {
    "t": "p",
    "text": "扩容：新节点 cluster meet 加入（不占槽）→ reshard 指定迁移 slot 数 → 目标节点 SETSLOT IMPORTING、源节点 SETSLOT MIGRATING → 源节点 MIGRATE 逐 key 原子搬走 → 全部搬完 SETSLOT NODE 改归属并广播。迁移期间查已迁走的 key 源节点回 ASK、未迁走正常服务、新 key 写目标节点。"
   },
   {
    "t": "p",
    "text": "两大雷区：MIGRATE 是阻塞式的，大 key（百万级排行榜 ZSet）迁移时源节点会卡几百毫秒，必须低峰迁移、提前拆大 key；ASK 跳转增加客户端 RTT，延迟敏感的游戏服避开高峰期。迁移中途故障用 redis-cli --cluster fix 修复，老客户端不支持 ASK 要提前验证版本。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "官方 Cluster",
     "代理层（twemproxy/codis）"
    ],
    "rows": [
     [
      "拓扑",
      "去中心化，无单点",
      "proxy 是额外一跳（单点风险）"
     ],
     [
      "分片",
      "16384 slot + Gossip",
      "一致性哈希 / 1024 slot"
     ],
     [
      "扩缩容",
      "在线 reshard 迁移",
      "twemproxy 不支持在线扩缩容"
     ],
     [
      "故障转移",
      "Gossip 自动选举",
      "依赖哨兵或 codis-ha"
     ],
     [
      "客户端",
      "smart（处理 MOVED/ASK）",
      "普通客户端零改造"
     ]
    ]
   },
   {
    "t": "p",
    "text": "代理层结论：twemproxy 是静态一致性哈希分片、无在线扩缩容无高可用；codis 预分 1024 slot、有 dashboard 迁移和高可用，但改造版 server 跟不上官方版本、proxy 多一跳。2024+ 新项目直接用官方 Cluster（或云托管），代理方案只剩存量维护价值。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Cluster 下 key 设计：{actId} hash tag 强制同 slot\n// 同活动多 key 原子操作：\n//   act:{summer}:claimed   act:{summer}:reward_count\n// 同玩家多字段：\n//   player:{uid}:level     player:{uid}:vip\n\n// JedisCluster 直连任一节点，客户端自动处理 MOVED/ASK 与拓扑刷新\ntry (JedisCluster cluster = new JedisCluster(hostPorts)) {\n    cluster.sadd(\"act:{summer}:claimed\", \"1001\");\n    cluster.lpush(\"act:{summer}:queue\", orderId);\n}\n// 跨 slot 的 MGET / 事务 / Lua 会报 CROSSSLOT，必须用 hash tag 聚拢\n// 同玩家档案尽量只用一个 Hash key，从根上避免多 key 跨槽"
   },
   {
    "t": "pits",
    "items": [
     "16384 不是拍脑袋：2KB 心跳 bitmap + 千节点规模的权衡，要会算这笔账",
     "MOVED 与 ASK 别混：MOVED 永久改路由表，ASK 是迁移中临时跳转不改表",
     "MIGRATE 是阻塞式命令，大 key 迁移是源节点卡顿的根因；扩容必须低峰 + 拆大 key",
     "跨 slot 的事务/Lua/MGET 报 CROSSSLOT，活动结算类多 key 操作要避开迁移窗口",
     "别硬吹代理层方案：新项目选官方 Cluster；被问'为什么还在用'就答历史原因 + 迁移评估",
     "从节点迁移先迁 slot 再下线；Cluster 最少 3 主才能容忍一次故障（多数派投票）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Cluster 的工程精髓是'slot 中间层'——数据绑槽不绑节点，扩容缩容就是搬槽。面试把 16384 的 2KB 心跳账、MOVED/ASK 语义、MIGRATE 阻塞风险、hash tag 防 CROSSSLOT 讲透，再给出扩缩容的避高峰预案，就是会实操的集群工程师。"
   }
  ]
 },
 {
  "id": "redis-pipeline-perf",
  "title": "管道 Pipeline 与性能优化",
  "layer": 2,
  "depends": [
   "redis-data-structures",
   "redis-encodings"
  ],
  "covers": [
   "redis-16",
   "redis-21"
  ],
  "quiz": [
   "redis-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Pipeline 是 Redis 性能优化的第一课：把 N 条命令打包一次发送、一次读回，省的是 RTT 网络往返。搞清楚它省的是什么、不保证的是什么，再和 Lua、事务对比，才能在排行榜结算、活动批量初始化这类场景把吞吐打满。"
   },
   {
    "t": "pre",
    "items": [
     "理解 Redis 单线程执行模型与命令级原子性（redis-data-structures）",
     "知道跨机房 RTT 对游戏服延迟的影响",
     "了解 Jedis/Redisson 基本 API 与连接池用法"
    ]
   },
   {
    "t": "h",
    "text": "一、RTT：Redis 性能瓶颈的真正大头"
   },
   {
    "t": "p",
    "text": "一条命令的总耗时 = 1 次网络往返（RTT）+ 微秒级的执行。Redis 命令执行本身在内存里是微秒级，真正的成本在网络。本地同机房 RTT 约 0.1~0.3ms，跨机房可能到 10ms+。1000 条命令串行发送 = 1000 次 RTT，本地约 0.1~0.3 秒，跨机房 10~20 秒；而 Pipeline 只花 1 次 RTT + 服务端按序执行的微秒级时间，吞吐差几个数量级——这是 Pipeline 存在的全部理由。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">串行 vs Pipeline：省的是 RTT 网络往返</text><text x=\"100\" y=\"52\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">串行：N 次 RTT</text><text x=\"500\" y=\"52\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Pipeline：1 次 RTT</text><rect x=\"30\" y=\"64\" width=\"140\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"100\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">客户端</text><rect x=\"430\" y=\"64\" width=\"140\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"500\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">客户端</text><rect x=\"30\" y=\"176\" width=\"140\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"100\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis</text><rect x=\"430\" y=\"176\" width=\"140\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"500\" y=\"200\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis</text><path d=\"M170 84 L430 84\" stroke=\"var(--line)\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/><path d=\"M100 104 L100 176\" stroke=\"var(--line)\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/><path d=\"M500 104 L500 176\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M100 104 L100 132 L300 132 L300 160\" stroke=\"var(--line)\" stroke-width=\"1.5\" fill=\"none\" stroke-dasharray=\"3 3\"/><path d=\"M300 160 L300 176\" stroke=\"var(--line)\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/><text x=\"320\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">N 次往返</text><text x=\"500\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">1 次打包</text><text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">跨机房 10ms RTT 时：1000 条命令串行 10s+，Pipeline 降到 10ms 级</text><text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">注意：命令执行仍按序、可被其他客户端命令插队，不保证原子性</text></svg>",
    "caption": "图：串行 N 次 RTT 与 Pipeline 1 次 RTT 对比"
   },
   {
    "t": "h",
    "text": "二、Pipeline 原理与使用边界"
   },
   {
    "t": "p",
    "text": "客户端把命令写进发送缓冲一次性发出，服务端按顺序执行，响应攒在接收缓冲一次性读回。三个边界必须清楚：一是没有原子性，包里的命令会被其他客户端的命令插队；二是批量太大（一次几万条）会撑爆客户端发送缓冲和服务端输出缓冲（client-output-buffer-limit），要分批（每批几百到一千实测调优）；三是 Cluster 下 key 分散在不同 slot/节点，Pipeline 要按 slot 分组发送，或用 JedisCluster/Lettuce 集群客户端自动处理。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 排行榜批量写分：1000 名玩家一次 RTT，每 500 条刷一次防缓冲爆炸\ntry (Jedis jedis = pool.getResource()) {\n    Pipeline p = jedis.pipelined();\n    int batch = 0;\n    for (Map.Entry<Long, Double> e : rankUpdates.entrySet()) {\n        p.zadd(\"rank:power\", e.getValue(), \"uid:\" + e.getKey());\n        if (++batch % 500 == 0) p.sync();   // 分批 flush，控制输出缓冲\n    }\n    p.sync();                              // 别忘了最后 sync\n}\n\n// Redisson 管道：RBatch，批量异步\nRBatch batch = redisson.createBatch();\nfor (Map.Entry<Long, Double> e : rankUpdates.entrySet()) {\n    batch.getScoredSortedSet(\"rank:power\")\n         .addAsync(e.getValue(), \"uid:\" + e.getKey());\n}\nBatchResult<?> res = batch.execute();\n\n// Cluster 下推荐 JedisCluster / Lettuce，自动按 slot 路由分组，\n// 避免自己写 slot 分组逻辑踩 CROSSSLOT 或重定向坑"
   },
   {
    "t": "h",
    "text": "三、Pipeline、事务、Lua 的边界"
   },
   {
    "t": "p",
    "text": "三者解决不同问题：Pipeline 只省 RTT、不保证原子；MULTI/EXEC 保证批量原子执行、但 EXEC 前拿不到执行结果（不能\"先读后写\"）；Lua 既原子又能写\"读→判断→写\"的逻辑。选型口诀：无依赖纯提速选 Pipeline；要原子且命令间无数据依赖选事务；要读-判断-写的原子逻辑选 Lua。Pipeline 和 MULTI 可以混用——把整段事务包进 Pipeline，一次 RTT 完成原子执行。"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "Pipeline",
     "MULTI/EXEC",
     "Lua 脚本"
    ],
    "rows": [
     [
      "核心收益",
      "省 RTT 网络往返",
      "原子批量执行",
      "原子 + 可写逻辑"
     ],
     [
      "命令插队",
      "允许（无隔离）",
      "不允许（独占执行）",
      "不允许（独占执行）"
     ],
     [
      "读后写",
      "不支持",
      "不支持（EXEC 前拿不到结果）",
      "支持（脚本内读→判断→写）"
     ],
     [
      "回滚",
      "无",
      "语法错入队即拒，运行时错不回滚",
      "不回滚，已执行写不撤销"
     ],
     [
      "游戏场景",
      "排行榜批量写分、活动批量初始化",
      "跨 slot 同节点的多 key 原子操作",
      "防超卖、发奖、资格防重"
     ]
    ]
   },
   {
    "t": "h",
    "text": "四、游戏服批量写排行榜优化实战"
   },
   {
    "t": "p",
    "text": "排行榜结算是最典型的 Pipeline 场景：结算瞬间要把几万玩家的最终分写进 ZSet，串行要几万次 RTT，Pipeline 一次搞定。注意三个细节：按玩家 ID 排序保证同 key 的写有序（其实 ZSet 内部按 score 排序，写顺序不影响结果）；每批 500~1000 条同步一次，避免单批过大；结算写分和发奖分开——写分用 Pipeline（可插队没关系），发奖用 Lua（必须原子），职责别混。活动批量初始化（10 万玩家资格 key、全服邮件）同理，Pipeline 建 key + Lua 做防重。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">排行榜结算：写分 Pipeline + 发奖 Lua</text><rect x=\"30\" y=\"48\" width=\"160\" height=\"56\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">游戏服结算任务</text><text x=\"110\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">榜单写分（几万玩家）</text><rect x=\"240\" y=\"48\" width=\"160\" height=\"56\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Pipeline 分批 500</text><text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ZADD 批量，省 RTT</text><rect x=\"450\" y=\"48\" width=\"160\" height=\"56\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"530\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Redis rank:power</text><text x=\"530\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ZSet 存储</text><path d=\"M190 76 L240 76\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M400 76 L450 76\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"30\" y=\"128\" width=\"160\" height=\"56\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"110\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">发奖任务</text><text x=\"110\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">读榜→判断→发奖</text><rect x=\"240\" y=\"128\" width=\"160\" height=\"56\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Lua 原子脚本</text><text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">防重+防超发</text><path d=\"M190 156 L240 156\" stroke=\"var(--lv1)\" stroke-width=\"2\"/><path d=\"M400 156 L450 156\" stroke=\"var(--lv1)\" stroke-width=\"2\"/><text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">写分可插队（Pipeline），发奖必须原子（Lua）——职责别混，这是面试加分点</text><text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">超大 batch 撑爆 client-output-buffer-limit，客户端会被强制断开</text></svg>",
    "caption": "图：排行榜结算的 Pipeline 写分 + Lua 发奖分工"
   },
   {
    "t": "pits",
    "items": [
     "说 Pipeline 有原子性是送命题：命令会被其他客户端插队，只是省 RTT",
     "批量太大会撑爆发送缓冲/服务端输出缓冲，必须分批（每批几百到一千）",
     "Cluster 下 Pipeline 要按 slot 分组，忘用集群客户端会踩重定向/CROSSSLOT 坑",
     "pipeline().sync() 忘了调用，命令根本没发出去，等于白写",
     "事务运行时不回滚只有语法错误才整体拒绝——很多面试者在这翻车",
     "把\"写分\"也用 Lua 是过度设计：Lua 执行期间独占整个 Redis，大循环拖累全实例"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Pipeline 的本质是拿 RTT 换吞吐——批量、有序、可插队；要原子选事务或 Lua，要逻辑选 Lua。面试把三者边界表背下来，再讲排行榜结算\"Pipeline 写分 + Lua 发奖\"的分工和分批策略，就是会调优的游戏服工程师。"
   }
  ]
 },
 {
  "id": "redis-transaction-lua",
  "title": "Redis 事务与 Lua 原子性",
  "layer": 2,
  "depends": [
   "redis-expire-eviction",
   "redis-distributed-lock"
  ],
  "covers": [
   "redis-17",
   "redis-16"
  ],
  "quiz": [
   "redis-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Redis 事务不是你想的那种事务：MULTI/EXEC 只管\"队列整批执行\"、不管回滚；WATCH 是乐观锁不是锁；真正能写业务逻辑的是 Lua 脚本——三者组合才是游戏服防超卖、发奖、活动资格防重的正确姿势。"
   },
   {
    "t": "pre",
    "items": [
     "掌握单线程执行模型与命令级原子性（redis-expire-eviction）",
     "了解 Pipeline 的省 RTT 语义（redis-pipeline-perf）",
     "了解 SET NX PX 与 Lua 解锁的分布式锁基础（redis-distributed-lock）"
    ]
   },
   {
    "t": "h",
    "text": "一、MULTI/EXEC：入队即定生死"
   },
   {
    "t": "p",
    "text": "MULTI 开启事务，后续命令进队列不执行，EXEC 一次性按序执行。两个关键语义：一是语法错误在入队时就发现，整个事务直接拒绝（不做任何命令）；二是运行时错误（如对 String 做 LPUSH）不中断不回滚，其余命令照常执行——Redis 没有回滚机制，这就是它\"假事务\"的本质。另外 WATCH 是乐观锁：WATCH 后到 EXEC 前，若被监视的 key 被其他客户端改过，EXEC 返回 nil，事务不执行，需要业务重试（类似 CAS 的自旋）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// WATCH 乐观锁：限购防超卖（自旋重试）\nwhile (true) {\n    jedis.watch(\"item:gift:stock\");                    // 监视库存\n    int stock = Integer.parseInt(jedis.get(\"item:gift:stock\"));\n    if (stock <= 0) { jedis.unwatch(); return false; }  // 没货，放弃\n    Transaction tx = jedis.multi();\n    tx.decr(\"item:gift:stock\");\n    tx.sadd(\"item:gift:claimed\", uid);\n    List<Object> res = tx.exec();\n    if (res != null) return true;   // key 未被改 → 成功\n    // res == null：并发改了库存 → 重新 WATCH 自旋\n}"
   },
   {
    "t": "h",
    "text": "二、事务、Pipeline、Lua 到底什么关系"
   },
   {
    "t": "p",
    "text": "三者是三个不同维度：Pipeline 解决网络往返、事务解决批量原子、Lua 解决逻辑原子。事务和 Pipeline 可以叠加——MULTI/EXEC 整段包进 Pipeline，一次 RTT 完成原子执行。但事务有个硬伤：EXEC 前拿不到命令结果，所以做不了\"先读后写\"；而 Lua 脚本在服务端执行，读→判断→写全在脚本里原子完成，这是它不可替代的理由。"
   },
   {
    "t": "h",
    "text": "三、Lua 脚本：读-判断-写的原子化"
   },
   {
    "t": "p",
    "text": "EVAL 每次传输脚本体，浪费带宽；EVALSHA 用 SHA1 调用服务端缓存的脚本，配合 SCRIPT LOAD 预加载，省传输。原子性来源：Redis 单线程 + 脚本执行期间独占，其他命令全部排队。三个坑必须记住：lua-time-limit 默认 5s，脚本超时不中断已执行的脚本，只是后续新命令报 BUSY；SCRIPT KILL 只能在脚本没执行过写命令时生效，否则要 SHUTDOWN NOSAVE；脚本失败不回滚，已执行的写命令不撤销——所以脚本内操作要设计成幂等。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 发奖原子操作：检查资格 + 扣库存 + 记流水，一个脚本完成\nString script =\n    \"if redis.call('SISMEMBER', KEYS[1], ARGV[1]) == 1 then return -1 end \" +\n    \"local s = tonumber(redis.call('GET', KEYS[2]) or '0') \" +\n    \"if s <= 0 then return -2 end \" +\n    \"redis.call('DECR', KEYS[2]) \" +\n    \"redis.call('SADD', KEYS[1], ARGV[1]) \" +\n    \"return 1\";\n// 先 SCRIPT LOAD 拿 SHA，省每次传脚本体\nString sha = jedis.scriptLoad(script);\ntry {\n    Long r = (Long) jedis.evalsha(sha, 2,\n            \"act:summer:claimed\", \"act:summer:stock\", uid);\n    return r.intValue();   // 1 成功 / -1 已领 / -2 库存不足\n} catch (JedisNoScriptException e) {\n    // 服务端重启后脚本缓存丢失 → 降级 EVAL 重传并重载\n    Long r = (Long) jedis.eval(script, 2,\n            \"act:summer:claimed\", \"act:summer:stock\", uid);\n    return r.intValue();\n}\n// 加分点：SADD 本身幂等（重复返回 0），纯防重场景直接拿返回值判断，连 Lua 都不用"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">为什么必须 Lua：三条命令拆开发会被并发插队</text><rect x=\"30\" y=\"44\" width=\"280\" height=\"150\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">错误做法：Java 分三条发</text><text x=\"50\" y=\"94\" font-size=\"12\" fill=\"var(--ink)\">1. SISMEMBER 判断资格</text><text x=\"50\" y=\"118\" font-size=\"12\" fill=\"var(--ink)\">2. GET 查库存</text><text x=\"50\" y=\"142\" font-size=\"12\" fill=\"var(--ink)\">3. DECR + SADD 扣减发奖</text><text x=\"170\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\" font-weight=\"bold\">步骤间被其他请求插队 → 超发</text><rect x=\"330\" y=\"44\" width=\"280\" height=\"150\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">正确做法：一个 Lua 脚本</text><text x=\"350\" y=\"94\" font-size=\"12\" fill=\"var(--ink)\">EVALSHA 一段脚本</text><text x=\"350\" y=\"118\" font-size=\"12\" fill=\"var(--ink)\">读→判断→写 全在 Redis 内</text><text x=\"350\" y=\"142\" font-size=\"12\" fill=\"var(--ink)\">单线程独占，无插队窗口</text><text x=\"470\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">原子完成，超发不可能</text><text x=\"320\" y=\"218\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">EVALSHA 用 SHA1 调缓存脚本省带宽；服务端重启丢缓存 → NOSCRIPT 降级 EVAL</text><text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">脚本执行期间独占整个 Redis：别写长循环，lua-time-limit 默认 5s，超时不中断已执行的</text><text x=\"320\" y=\"268\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">脚本失败不回滚：已执行写命令不撤销，脚本内操作要幂等</text><text x=\"320\" y=\"290\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SCRIPT KILL 只在未执行写命令时有效，否则 SHUTDOWN NOSAVE</text></svg>",
    "caption": "图：拆分命令并发超发 vs Lua 原子执行"
   },
   {
    "t": "h",
    "text": "四、游戏服防超卖/发奖的完整姿势"
   },
   {
    "t": "p",
    "text": "游戏服里\"资格判断+扣库存+发奖\"类操作必须原子。三种力度：最轻的是天生幂等的命令（SADD/SETNX/INCR 后判断返回值）；中等是 Lua 一段脚本（上面示例）；最重是 Lua + 分布式锁双保险（发奖任务整体加锁，脚本内再防重），锁防并发任务、脚本防单命令窗口。注意别过度：Lua 执行期间独占 Redis，脚本里做 10 万次循环会卡死整个实例，大循环逻辑要拆出去。"
   },
   {
    "t": "pits",
    "items": [
     "说\"Redis 事务会回滚\"是硬伤：语法错误整体拒绝，运行时错误不中断不回滚",
     "WATCH 是乐观锁不是锁：靠重试生效，业务层必须写自旋；EXEC 返回 nil 不是异常",
     "EVALSHA 遇 NOSCRIPT 必须降级 EVAL，否则服务端重启后脚本全失效",
     "Lua 脚本别写死循环/大循环，脚本独占 Redis，一个脚本卡住全实例排队",
     "脚本失败不回滚——已执行的写命令不撤销，脚本内操作必须幂等",
     "防重场景别忘 SADD 天然幂等这个更简单的答案，能少写一段 Lua"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Redis 事务 = 批量原子 + 无回滚 + WATCH 乐观锁；Lua = 逻辑原子 + 可读后写 + 独占执行。面试把 MULTI 入队即拒、运行时错不回滚、WATCH 自旋、EVALSHA/NOSCRIPT 降级、脚本幂等这五条讲透，再演示一段发奖脚本，就是原子性这题的完整答案。"
   }
  ]
 },
 {
  "id": "redis-memory-optimize",
  "title": "内存优化与内存分析",
  "layer": 2,
  "depends": [
   "redis-encodings",
   "redis-expire-eviction"
  ],
  "covers": [
   "redis-08",
   "redis-29",
   "redis-02"
  ],
  "quiz": [
   "redis-08",
   "redis-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Redis 的内存就是钱：从 key/value 设计到小对象聚合，从过期策略到碎片治理，从 MEMORY USAGE 到 maxmemory 规划——内存优化是 10 年经验里最见功力的部分。先讲指标怎么看，再讲设计怎么做，最后讲红线在哪。"
   },
   {
    "t": "pre",
    "items": [
     "掌握底层编码 listpack/hashtable 与 44 字节阈值（redis-encodings）",
     "掌握淘汰策略与过期删除双机制（redis-expire-eviction）",
     "了解 jemalloc 分配器与缓存行基本概念"
    ]
   },
   {
    "t": "h",
    "text": "一、内存指标：怎么看 Redis 的内存账"
   },
   {
    "t": "p",
    "text": "INFO memory 关键字段：used_memory（数据 + 元数据开销）、used_memory_rss（进程实际占的物理内存）、mem_fragmentation_ratio = used_memory_rss / used_memory（碎片率）。ratio 1.0~1.5 健康；>1.5 说明碎片严重（RSS 比数据多 50% 以上）；<1 说明在 swap，比碎片更危险——访问延迟从微秒级掉到毫秒级，Redis 等于半瘫。maxmemory 规划：一般设物理内存 60~70%，必须给 fork COW（快照期间写越多内存放大越狠）和 OS 留余量。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Redis 内存账：数据 vs 开销 vs 碎片</text><rect x=\"40\" y=\"48\" width=\"300\" height=\"36\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"54\" y=\"71\" font-size=\"12\" fill=\"var(--ink)\">used_memory：数据 + 元数据</text><rect x=\"40\" y=\"92\" width=\"220\" height=\"36\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"54\" y=\"115\" font-size=\"12\" fill=\"var(--ink)\">key/对象头/编码开销</text><rect x=\"40\" y=\"136\" width=\"90\" height=\"36\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"54\" y=\"159\" font-size=\"12\" fill=\"var(--lv3)\">碎片</text><text x=\"360\" y=\"74\" font-size=\"13\" fill=\"var(--ink)\">used_memory_rss ≈ 所有加总</text><text x=\"360\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">ratio = RSS / used_memory</text><text x=\"360\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">1.0~1.5 健康</text><text x=\"360\" y=\"154\" font-size=\"12\" fill=\"var(--lv3)\">&gt;1.5 碎片严重 → activedefrag / 重启</text><text x=\"360\" y=\"176\" font-size=\"12\" fill=\"var(--lv3)\">&lt;1 在 swap → 比碎片更危险</text><text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">maxmemory 设物理内存 60~70%，留 fork COW + OS 余量，别打满</text><text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MEMORY USAGE key 查单 key 字节；MEMORY DOCTOR 诊断建议；--bigkeys 扫大 key</text></svg>",
    "caption": "图：内存构成与碎片率三档解读"
   },
   {
    "t": "h",
    "text": "二、key 与 value 设计红线"
   },
   {
    "t": "list",
    "items": [
     "key 别带全业务名与长前缀：短命名省元数据，但要保留可读性（player:1001:profile 优于乱七八糟的缩写）",
     "value 小于 44 字节走 embstr、聚合小对象走 listpack：理解编码阈值才能设计出省内存的结构（见 redis-encodings）",
     "单 key 红线：value 一般不超过 100MB，超过 1MB 的操作就可能在网络传输/内存分配上抖动；列表类控制元素数，超限 LTRIM 截断",
     "一个字段一个 key 是内存杀手：千万玩家 × 3 个字段 = 3 个 key 的元数据，聚合成一个 Hash 只付一份元数据",
     "过期策略取舍：短 TTL 频繁过期有扫描成本，无 TTL 又无限涨；按数据等级统一设计（session 1h、临时态 10min、常驻不过期）"
    ]
   },
   {
    "t": "h",
    "text": "三、小对象聚合 Hash：一玩家一 Hash"
   },
   {
    "t": "p",
    "text": "玩家档案是典型聚合场景：hash:player:{uid} 里放 level/vip/exp/gold，一次 HGETALL 拿全，O(1) 取单 field。对比拆 key（player:{uid}:level、player:{uid}:vip...）三个 key 三份元数据 + 三份 TTL，聚合后一份 key 一份过期，内存和命令次数都省。代价：超大 Hash 会转 hashtable 反而费内存（阈值 128 元素/64 字节），所以\"聚合\"不等于\"无限往一个 key 塞\"，字段涨到上千要考虑拆 Hash。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">拆 key vs 聚合 Hash：一份元数据 vs 三份</text><rect x=\"30\" y=\"48\" width=\"270\" height=\"140\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"165\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">拆 key（×3 元数据）</text><rect x=\"50\" y=\"86\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"103\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">player:1001:level = 68</text><rect x=\"50\" y=\"118\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"135\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">player:1001:vip = 5</text><rect x=\"50\" y=\"150\" width=\"230\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"165\" y=\"167\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">player:1001:exp = 888</text><rect x=\"330\" y=\"48\" width=\"280\" height=\"140\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"470\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">聚合 Hash（1 份元数据）</text><rect x=\"350\" y=\"86\" width=\"240\" height=\"86\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--accent)\"/><text x=\"470\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">player:1001 档案</text><text x=\"470\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">field: level/vip/exp/gold</text><text x=\"470\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">HGETALL 一次拿全</text><text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">千万玩家 × 3 字段：拆 key = 3000 万份 key 元数据，聚合 = 1000 万份</text><text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">代价：超大 Hash 转 hashtable 反而费内存，字段上千要考虑拆 Hash（阈值 128 元素/64 字节）</text><text x=\"320\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MEMORY USAGE 对 listpack 编码是近似值，精确值要转换后量</text></svg>",
    "caption": "图：拆 key 与聚合 Hash 的内存对比"
   },
   {
    "t": "h",
    "text": "四、过期策略取舍与内存泄漏点"
   },
   {
    "t": "p",
    "text": "游戏服最常见的内存泄漏不是代码 bug，而是\"设了 TTL 忘了清理\"和\"该设 TTL 没设\"。session、临时活动 key 设短 TTL；玩家常驻档案不过期靠淘汰策略兜底（allkeys-lru）；全服邮件列表用 LTRIM 限长；Stream 用 MAXLEN 裁剪。定时巡检：SCAN 遍历（别用 KEYS）+ MEMORY USAGE + OBJECT ENCODING 抓大 key 和编码越界，低峰期跑 redis-cli --bigkeys。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 内存巡检：SCAN + MEMORY USAGE + OBJECT ENCODING（禁止 KEYS）\ntry (Jedis jedis = pool.getResource()) {\n    ScanParams sp = new ScanParams().match(\"player:*\").count(1000);\n    String cursor = ScanParams.SCAN_POINTER_START;\n    do {\n        ScanResult<String> res = jedis.scan(cursor, sp);\n        for (String key : res.getResult()) {\n            long bytes = jedis.memoryUsage(key);        // MEMORY USAGE\n            String enc = jedis.objectEncoding(key);     // OBJECT ENCODING\n            if (bytes > 1024 * 1024 || \"hashtable\".equals(enc)) {\n                log.warn(\"大key/编码越界: {} bytes={} enc={}\", key, bytes, enc);\n            }\n        }\n        cursor = res.getCursor();\n    } while (!cursor.equals(ScanParams.SCAN_POINTER_START));\n}\n// 生产指标盯三个：mem_fragmentation_ratio、used_memory 增速、keyspace 命中率"
   },
   {
    "t": "h",
    "text": "五、maxmemory 规划与单 key 红线"
   },
   {
    "t": "p",
    "text": "maxmemory 别拍脑袋：物理内存 60~70%（32G 机器设 20G 左右），留 fork COW 极端放大的 buffer、OS page cache、监控 agent。淘汰策略选型看业务（纯缓存 allkeys-lru；当存储用 noeviction；混业务拆实例，别用 volatile 系在混 key 上翻车）。单 key 红线记三档：value >1MB 操作开始有传输/内存抖动；>10MB 基本就是大 key，DEL/迁移都卡；>100MB 是事故级，必须拆。大 key 删除用 UNLINK 或 lazyfree 系列参数，别 DEL 阻塞主线程。"
   },
   {
    "t": "pits",
    "items": [
     "mem_fragmentation_ratio < 1 是在 swap，比 >1.5 更危险——别只记得碎片警告",
     "maxmemory 打满不是罪，没给 fork COW 留余量才是：快照期间写越猛内存越接近翻倍",
     "聚合 Hash 别无限加字段：超大 Hash 转 hashtable 反而费内存，上千字段要拆",
     "MEMORY USAGE 对 listpack 编码是近似值，别拿它当精确账单",
     "巡检用 SCAN 别用 KEYS；KEYS 全量扫描在生产是阻塞事故",
     "设了 TTL 不等于清理完：惰性删除 + 定期删除的采样机制下，大量过期 key 仍可能短暂占内存"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：内存优化 = 看懂指标（碎片率三档）+ 设计结构（聚合 Hash、44 字节阈值）+ 管好生命周期（TTL/淘汰/裁剪）+ 规划容量（maxmemory 留 fork 余量）。面试把 MEMORY USAGE/DOCTOR、--bigkeys、UNLINK、碎片治理这套工具链报全，就是真做过容量规划的运维老兵。"
   }
  ]
 },
 {
  "id": "redis-new-features",
  "title": "Redis 6/7 新特性与版本演进",
  "layer": 2,
  "depends": [
   "redis-replication-sentinel",
   "redis-cluster"
  ],
  "covers": [
   "redis-23",
   "redis-24"
  ],
  "quiz": [
   "redis-23"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Redis 6 让网络 IO 多线程、把权限从一把密码升级成 ACL；Redis 7 把脚本变成一等公民 Functions、把单文件 AOF 拆成多部分、让分片订阅成为现实。版本演进就是 Redis 对\"单线程、全权限、文件级运维\"三次反思的答卷，也是面试官验证你\"是否跟得上版本\"的题。"
   },
   {
    "t": "pre",
    "items": [
     "掌握单线程执行模型与 Lua 脚本（redis-transaction-lua）",
     "掌握主从/哨兵/Cluster 架构（redis-replication-sentinel、redis-cluster）",
     "了解持久化与 Pub/Sub 基本概念"
    ]
   },
   {
    "t": "h",
    "text": "一、Redis 6：多线程 IO 的边界在哪"
   },
   {
    "t": "p",
    "text": "Redis 6.0 引入 io-threads：瓶颈不在命令执行（内存操作微秒级）而在大流量下 socket 的 read/parse 和 write 系统调用。配置 io-threads N（默认 1 即关闭，建议 4~6，超过 8 收益递减）+ io-threads-do-reads yes 后，IO 线程并行读请求、写回响应，但命令执行仍是单线程——原子性、Lua、MULTI 语义全部不变，这也是它能安全引入多线程的前提。必须记住的推论：多线程不解决 DEL 大 key 阻塞，UNLINK/lazyfree 依然必要。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Redis 6 多线程 IO：手脚多了，大脑还是一个</text><rect x=\"40\" y=\"48\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"130\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">IO 线程 1..N</text><text x=\"130\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">并行 read/parse 请求</text><text x=\"130\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">并行 write 写回响应</text><rect x=\"40\" y=\"140\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"130\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">主线程（1 个）</text><text x=\"130\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">执行所有命令</text><text x=\"130\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">单线程 = 原子性不变</text><rect x=\"430\" y=\"48\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"520\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">客户端连接池</text><text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">连接分给 IO 线程</text><text x=\"520\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">大流量读系统调用分出去</text><path d=\"M220 83 L430 83\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M130 140 L130 118\" stroke=\"var(--line)\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/><text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">io-threads 默认 1（关闭）；建议 4~6，超过 8 收益递减</text><text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">推论：多线程不解决 DEL 大 key 阻塞，UNLINK/lazyfree 依然必要</text></svg>",
    "caption": "图：IO 多线程与命令执行单线程的分工"
   },
   {
    "t": "h",
    "text": "二、Redis 6：ACL 权限模型"
   },
   {
    "t": "p",
    "text": "Redis 6 之前 requirepass 一把密码全权限，拿到密码 = 拿到全部，运维误操作 FLUSHALL/KEYS 拦不住。ACL（Access Control List）按用户粒度控制三个维度：可执行的命令类别（+@read、-@dangerous）、可访问的 key 模式（~player:*）、可订阅的频道（&*）。生产用法：应用账号只给业务命令和 key 前缀，运维账号单独开危险命令，default 用户收紧。Redis 7 的 ACL v2 又加了选择器（Selector）——一个用户可配置多组\"命令 + key\"规则，按不同前缀切换权限。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// ACL 创建受限用户（运维侧执行）\n// ACL SETUSER app on >P@ssw0rd ~cache:* ~player:* +@read -@write +set +get -@dangerous\n// ACL SETUSER ops on >Ops@Pwd +@all +debug\n// ACL SETUSER default off          // 收紧默认用户\n// Redis 7 ACL v2 选择器：一个用户多组规则\n// ACL SETUSER power on >pwd (~admin:* +@all) (~public:* +@read)\n\n// 客户端用受限用户连接（Jedis）\ntry (Jedis jedis = new Jedis(\"10.0.0.11\", 6379)) {\n    jedis.auth(\"app\", \"P@ssw0rd\");      // 用户名 + 密码\n    String s = jedis.get(\"cache:rank:top100\");\n}\n// ACL 权限最小化 + 命名空间隔离，是生产安全基线"
   },
   {
    "t": "h",
    "text": "三、RESP3 与 Client Caching"
   },
   {
    "t": "p",
    "text": "RESP3 是 6.0 引入的新协议（HELLO 命令切换），新增 Map/Set/Big Number/verbatim 等类型，以及服务端主动推送能力。Client Caching（服务端辅助客户端缓存，6.0 起）：客户端 CLIENT TRACKING ON 声明缓存了哪些 key，服务端在该 key 被修改/过期时主动推 INVALIDATE 消息，客户端本地缓存 + 失效通知，读热点再降一层。对游戏服：排行榜 TopN、全服活动配置这类读多写少数据，客户端本地缓存 + 服务端失效通知，Redis 读压力再降一个量级。注意：需要客户端库支持（Lettuce 6+），Cluster 下走广播变体要开 RESP3。"
   },
   {
    "t": "h",
    "text": "四、Redis 7：Functions 取代 Lua 脚本"
   },
   {
    "t": "p",
    "text": "EVAL 脚本有三痛：脚本体随应用分发、Lua 5.1 版本老旧难演进、健壮性无库管理。Redis 7 Functions：脚本入库（FUNCTION LOAD）、命名调用（FCALL）、随 AOF 持久化并复制到从库、库级管理（FUNCTION LIST/DELETE）、只读变体 FCALL_RO 可在从节点执行。游戏服收益：把防超卖/发奖脚本统一成 Functions，运维可管理，多个应用共享一套，升级不用改客户端代码。"
   },
   {
    "t": "h",
    "text": "五、Redis 7：多部分 AOF 与分片 Pub/Sub"
   },
   {
    "t": "p",
    "text": "多部分 AOF（Multi-Part AOF，7.0）：单个 appendonly.aof 拆成 base + incr 多个文件 + manifest 清单管理，重写时只需重建 base 不阻塞，崩溃恢复只回放 incr，运维更稳。分片 Pub/Sub（7.0）：Cluster 下 SPUBLISH/SSUBSCRIBE 按 channel 哈希路由到对应分片节点，只在本分片广播——解决普通频道广播到全集群的网络放大（普通频道在 Cluster 只在本节点有效，跨节点要 7.0 分片版）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Redis 6 → 7 版本演进要点</text><rect x=\"30\" y=\"44\" width=\"290\" height=\"180\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"175\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Redis 6.0（2020）</text><text x=\"50\" y=\"94\" font-size=\"12\" fill=\"var(--ink)\">多线程 IO（io-threads）</text><text x=\"50\" y=\"118\" font-size=\"12\" fill=\"var(--ink)\">ACL 用户-命令-Key 权限</text><text x=\"50\" y=\"142\" font-size=\"12\" fill=\"var(--ink)\">RESP3 新协议</text><text x=\"50\" y=\"166\" font-size=\"12\" fill=\"var(--ink)\">Client Caching 客户端缓存</text><text x=\"50\" y=\"190\" font-size=\"12\" fill=\"var(--ink)\">OBJ/命令级细化统计</text><text x=\"50\" y=\"214\" font-size=\"12\" fill=\"var(--muted)\">重点：权限隔离、读分流、大流量 IO</text><rect x=\"330\" y=\"44\" width=\"280\" height=\"180\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"470\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Redis 7.0（2022）</text><text x=\"350\" y=\"94\" font-size=\"12\" fill=\"var(--ink)\">Functions 一等公民脚本</text><text x=\"350\" y=\"118\" font-size=\"12\" fill=\"var(--ink)\">ACL v2 选择器（多组规则）</text><text x=\"350\" y=\"142\" font-size=\"12\" fill=\"var(--ink)\">多部分 AOF + manifest</text><text x=\"350\" y=\"166\" font-size=\"12\" fill=\"var(--ink)\">分片 Pub/Sub（SPUBLISH）</text><text x=\"350\" y=\"190\" font-size=\"12\" fill=\"var(--ink)\">RDB v10、ziplist→listpack</text><text x=\"350\" y=\"214\" font-size=\"12\" fill=\"var(--muted)\">重点：可运维脚本、日志拆细、分片广播</text><text x=\"320\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服意义：Functions 统一发奖脚本可运维；分片 Pub/Sub 让跨节点广播不再网络放大</text><text x=\"320\" y=\"276\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">升级注意：7.0 RDB v10 不兼容旧版本，主从/集群滚动升级要按官方顺序</text></svg>",
    "caption": "图：Redis 6/7 新特性时间线"
   },
   {
    "t": "h",
    "text": "六、版本演进对游戏服的意义"
   },
   {
    "t": "p",
    "text": "对游戏服的真实收益排序：ACL 权限隔离（多业务共用一个集群时的安全刚需）→ Functions（发奖/防重脚本可运维化）→ Client Caching（排行榜等读热点再降压）→ 分片 Pub/Sub（跨节点广播不放大）→ 多部分 AOF（日志更稳）。注意：多线程 IO 对命令执行单线程的游戏服大 key 场景没帮助；Client Caching 需要客户端库和 RESP3 支持，升级前要验证兼容性。"
   },
   {
    "t": "pits",
    "items": [
     "说\"Redis 6 全多线程\"是送命题：只有网络 IO 多线程，命令执行仍单线程",
     "多线程 IO 不解决 DEL 大 key 阻塞，UNLINK/lazyfree 依然必要",
     "ACL 忘了收紧 default 用户等于没配：默认用户是全权限",
     "Client Caching 需要客户端库支持 + Cluster 下开 RESP3，别以为客户端零改动",
     "Functions 入库要随部署流程管理，只在某个节点 LOAD 不会自动复制到全集群（要 FUNCTION LOAD 配合复制）",
     "Redis 7 RDB v10 不兼容旧版本，升级/回滚要考虑数据格式边界",
     "分片 Pub/Sub 和普通频道语义不同：SPUBLISH 只发给同一分片节点上的订阅者"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：版本题的答题框架是\"每个版本解决了什么、边界在哪、对业务意味着什么\"。6 解决 IO 与权限、7 解决脚本与日志与广播。面试把 io-threads 边界、ACL 三维权限、Functions 对 EVAL 的演进、多部分 AOF、分片 Pub/Sub 讲透，再落到游戏服的多业务共集群隔离与脚本运维，就是跟上版本的生产工程师。"
   }
  ]
 },
 {
  "id": "redis-distributed-lock",
  "title": "分布式锁与 Redisson",
  "layer": 3,
  "depends": [
   "redis-expire-eviction",
   "redis-cluster"
  ],
  "covers": [
   "redis-14",
   "redis-15",
   "redis-20",
   "redis-17",
   "redis-16"
  ],
  "quiz": [
   "redis-14",
   "redis-15",
   "redis-20"
  ],
  "body": [
   {
    "t": "lead",
    "text": "分布式锁是活动服和支付服的'并发闸门'：从 SETNX 到 Redisson，每一版都在填一个坑；而锁永远不能替代幂等，这是这道题的灵魂。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 Redis 命令原子性与 TTL 语义（节点 4）",
     "了解 Cluster 多节点下的主从语义（节点 6）",
     "了解 JUC 的 Lock 接口（RLock 用法与它一致）"
    ]
   },
   {
    "t": "h",
    "text": "从 SETNX 到 Redisson：四个版本四步填坑"
   },
   {
    "t": "p",
    "text": "一把靠谱的锁要同时满足原子加锁、防误删、防死锁、可重入/续期，演进过程就是逐个填坑：SETNX+EXPIRE 两条命令非原子（宕机即死锁）→ SET NX PX 一条命令原子加锁 + 过期（但可能误删他人锁）→ 唯一 value + Lua 校验删除（防误删）→ 看门狗续期（防业务没跑完锁先过期）。"
   },
   {
    "t": "list",
    "items": [
     "V1 SETNX + EXPIRE：两条命令，客户端加锁成功还没设过期就宕机 → 永久死锁",
     "V2 SET key value NX PX 30000：原子加锁 + 过期时间，解决死锁；但 A 持锁超时过期后 B 拿到锁，A 醒来可能删掉 B 的锁",
     "V3 value 存 UUID:线程ID，解锁用 Lua 脚本原子校验'是我的锁才删'，解决误删",
     "V4 业务执行时间不可控 → Redisson 看门狗自动续期；主从丢锁概率性风险靠业务幂等兜底"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 330\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">分布式锁演进：每步填一个坑</text>\n  <rect x=\"20\" y=\"48\" width=\"142\" height=\"176\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"91\" y=\"74\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">V1 SETNX+EXPIRE</text>\n  <text x=\"91\" y=\"100\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">两条命令非原子</text>\n  <text x=\"91\" y=\"124\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">宕机即永久死锁</text>\n  <text x=\"91\" y=\"190\" text-anchor=\"middle\" fill=\"var(--lv3)\" font-size=\"12\" font-weight=\"bold\">坑：死锁</text>\n  <rect x=\"174\" y=\"48\" width=\"142\" height=\"176\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"245\" y=\"74\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">V2 SET NX PX</text>\n  <text x=\"245\" y=\"100\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">一条命令原子加锁</text>\n  <text x=\"245\" y=\"124\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">锁过期被 B 拿走</text>\n  <text x=\"245\" y=\"190\" text-anchor=\"middle\" fill=\"var(--lv3)\" font-size=\"12\" font-weight=\"bold\">坑：误删他人锁</text>\n  <rect x=\"328\" y=\"48\" width=\"142\" height=\"176\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"399\" y=\"74\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">V3 唯一 value</text>\n  <text x=\"399\" y=\"100\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">value=UUID:线程ID</text>\n  <text x=\"399\" y=\"124\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">Lua 校验匹配才 DEL</text>\n  <text x=\"399\" y=\"190\" text-anchor=\"middle\" fill=\"var(--lv1)\" font-size=\"12\" font-weight=\"bold\">解决：防误删</text>\n  <rect x=\"482\" y=\"48\" width=\"142\" height=\"176\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"553\" y=\"74\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">V4 看门狗续期</text>\n  <text x=\"553\" y=\"100\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">锁 30s 每 10s 续期</text>\n  <text x=\"553\" y=\"124\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">业务跑完前锁不过期</text>\n  <text x=\"553\" y=\"190\" text-anchor=\"middle\" fill=\"var(--lv3)\" font-size=\"12\" font-weight=\"bold\">遗留：主从丢锁</text>\n  <path d=\"M 162 136 L 174 136\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <path d=\"M 316 136 L 328 136\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <path d=\"M 470 136 L 482 136\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n  <text x=\"20\" y=\"256\" fill=\"var(--ink)\" font-size=\"13\">加锁：SET key value NX PX 30000（一条命令原子完成加锁 + 过期）</text>\n  <text x=\"20\" y=\"282\" fill=\"var(--ink)\" font-size=\"13\">解锁：Lua 脚本 if get(KEYS[1])==ARGV[1] then del(KEYS[1]) end</text>\n  <text x=\"20\" y=\"308\" fill=\"var(--muted)\" font-size=\"12\">任何锁方案都无法 100% 防双持：锁内操作必须幂等（发奖流水唯一索引等）</text>\n</svg>",
    "caption": "图：分布式锁四版本演进与填坑路径"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Redisson 抢全服活动资格（看门狗自动续期）\nRLock lock = redisson.getLock(\"act:summer:grant\");\nboolean got = lock.tryLock(3, TimeUnit.SECONDS); // 3s 内抢不到就放弃\nif (got) {\n    try {\n        grantAllPlayers();   // 长任务：看门狗每 10s 把锁续回 30s\n    } finally {\n        lock.unlock();       // 必须 finally 释放\n    }\n}\n// 生产推荐显式 leaseTime，防止看门狗掩盖业务卡死：\n// lock.tryLock(3, 30, TimeUnit.SECONDS); // 等 3s，锁固定 30s，不续期，到期必释放"
   },
   {
    "t": "h",
    "text": "看门狗细节与失效场景"
   },
   {
    "t": "p",
    "text": "不显式指定 leaseTime 时，Redisson 默认锁 30 秒，后台每 10 秒（30/3）用 Lua 脚本续期回 30 秒；底层是 Netty 时间轮调度，不是每把锁一个线程。失效场景：显式传了 leaseTime（不续期）、客户端宕机（看门狗随之消失，锁最多 30s 后自然过期——这正是防死锁的设计）、网络分区（续期失败锁到期，业务还在跑 → 双持锁风险，仍需幂等兜底）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">Redisson 看门狗：默认 30s，每 10s 续期</text>\n  <line x1=\"50\" y1=\"130\" x2=\"590\" y2=\"130\" stroke=\"var(--line)\" stroke-width=\"2\"/>\n  <line x1=\"50\" y1=\"126\" x2=\"50\" y2=\"134\" stroke=\"var(--line)\"/>\n  <line x1=\"140\" y1=\"126\" x2=\"140\" y2=\"134\" stroke=\"var(--line)\"/>\n  <line x1=\"230\" y1=\"126\" x2=\"230\" y2=\"134\" stroke=\"var(--line)\"/>\n  <line x1=\"320\" y1=\"126\" x2=\"320\" y2=\"134\" stroke=\"var(--line)\"/>\n  <line x1=\"410\" y1=\"126\" x2=\"410\" y2=\"134\" stroke=\"var(--line)\"/>\n  <line x1=\"500\" y1=\"126\" x2=\"500\" y2=\"134\" stroke=\"var(--line)\"/>\n  <line x1=\"590\" y1=\"126\" x2=\"590\" y2=\"134\" stroke=\"var(--line)\"/>\n  <circle cx=\"50\" cy=\"130\" r=\"5\" fill=\"var(--accent)\"/>\n  <circle cx=\"140\" cy=\"130\" r=\"5\" fill=\"var(--accent)\"/>\n  <circle cx=\"230\" cy=\"130\" r=\"5\" fill=\"var(--accent)\"/>\n  <circle cx=\"320\" cy=\"130\" r=\"5\" fill=\"var(--accent)\"/>\n  <circle cx=\"410\" cy=\"130\" r=\"5\" fill=\"var(--accent)\"/>\n  <circle cx=\"500\" cy=\"130\" r=\"5\" fill=\"var(--accent)\"/>\n  <circle cx=\"590\" cy=\"130\" r=\"5\" fill=\"var(--accent)\"/>\n  <text x=\"50\" y=\"118\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">加锁 30s</text>\n  <text x=\"140\" y=\"118\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">续期重置</text>\n  <text x=\"230\" y=\"118\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">续期重置</text>\n  <text x=\"320\" y=\"118\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">续期重置</text>\n  <text x=\"410\" y=\"118\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">续期重置</text>\n  <text x=\"500\" y=\"118\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"12\">续期重置</text>\n  <text x=\"50\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">t0</text>\n  <text x=\"140\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">t10</text>\n  <text x=\"230\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">t20</text>\n  <text x=\"320\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">t30</text>\n  <text x=\"410\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">t40</text>\n  <text x=\"500\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">t50</text>\n  <text x=\"590\" y=\"162\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">t60</text>\n  <text x=\"20\" y=\"200\" fill=\"var(--ink)\" font-size=\"13\">不传 leaseTime 才启用看门狗；显式 lock(10, SECONDS) 则固定 10s 到期释放不续期——生产推荐显式指定</text>\n  <text x=\"20\" y=\"226\" fill=\"var(--ink)\" font-size=\"13\">客户端宕机/进程被杀 → 看门狗随进程消失，锁最多 30s 后自然过期，这正是防死锁的设计</text>\n  <text x=\"20\" y=\"252\" fill=\"var(--muted)\" font-size=\"12\">续期实现：Lua 脚本重置 Hash 锁的重入计数 TTL；底层 Netty 时间轮调度，不是每把锁一个线程</text>\n  <text x=\"20\" y=\"276\" fill=\"var(--muted)\" font-size=\"12\">可重入锁结构：Hash，key=锁名，field=UUID:threadId，value=重入次数；网络分区双持锁风险仍需业务幂等兜底</text>\n</svg>",
    "caption": "图：看门狗续期时序"
   },
   {
    "t": "h",
    "text": "Lua 与 Pipeline：原子与批量"
   },
   {
    "t": "p",
    "text": "活动资格防重这类'先查再改'必须用 Lua：三条命令分开发会被并发请求插队，Lua 脚本在 Redis 内原子执行天然解决。加分点：SADD 本身幂等（重复返回 0），直接拿返回值判断连 Lua 都不用。Pipeline 则是把 N 条命令打包发一次，省的是 RTT 网络往返，不保证原子性——批量初始化 10 万玩家资格、排行榜批量写分用它，500 条一批。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 原生解锁必须 Lua：check-and-delete 在 Redis 内原子完成\nString script = \"if redis.call('get',KEYS[1])==ARGV[1] \" +\n        \"then return redis.call('del',KEYS[1]) else return 0 end\";\nLong r = (Long) jedis.eval(script, 1, \"lock:order:\" + orderId, token);\n// GET+DEL 拆开发是错的：两步之间锁可能过期被他人获取，会把别人的锁删掉\n\n// 活动资格防重：一个 Lua 完成判断+写入（或直接用 SADD 幂等返回值）\nString claim = \"if redis.call('SISMEMBER',KEYS[1],ARGV[1])==1 \" +\n        \"then return 0 end redis.call('SADD',KEYS[1],ARGV[1]) return 1\";\nlong added = jedis.sadd(\"act:summer:claimed\", \"1001\"); // 重复返回 0，天然防重\n\n// Pipeline：批量写分省 RTT（无原子性，可被其他客户端命令插队）\nPipeline p = jedis.pipelined();\nfor (long uid : top1000) p.zadd(\"rank:power\", score(uid), \"uid:\" + uid);\np.sync();"
   },
   {
    "t": "h",
    "text": "红锁与正确性"
   },
   {
    "t": "p",
    "text": "RedLock 在 N 个独立主节点（通常 5 个）上依次 SET NX PX，超过半数成功且总耗时小于锁有效期才持锁。Martin Kleppmann 的批评：时钟跳变让锁提前过期、进程 GC STW 停顿超过 TTL 导致双持、缺 fencing token 无法拒绝迟到写入。antirez 回应认为时钟假设不现实且有重启延迟参与机制。面试立场：效率型锁（防重复任务、活动结算防重）单实例 Redisson 足够；正确型锁（金融扣款）用 fencing token + 存储层校验或直接 ZK/etcd；游戏服实践是锁 + 业务幂等双保险，性价比最高。"
   },
   {
    "t": "pits",
    "items": [
     "SETNX+EXPIRE 不是原子的，谁再说它防死锁谁翻车",
     "解锁必须 Lua：GET+DEL 之间的窗口会让锁被误删，check-and-delete 必须在 Redis 内完成",
     "看门狗不是每把锁一个线程，是 Netty 时间轮调度；别乱传 leaseTime 又要续期",
     "别盲目吹红锁也别全盘否定：给立场 + 场景分级（效率锁 vs 正确锁）才是架构师式回答",
     "Lua 脚本执行期间独占 Redis（单线程），脚本别写长循环；脚本失败不回滚，已执行写命令不撤销，脚本内操作要幂等",
     "Pipeline 不保证原子性、事务运行时错误不回滚、Cluster 下 Pipeline 要按 slot 分组——三个冷点记牢"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分布式锁的考点是'每版填什么坑'：原子加锁、防误删、防死锁、续期，最后是主从丢锁的幂等兜底。Redisson 看门狗 30s/10s 参数要精确；红锁争议要能给立场。任何锁都不能替代幂等，这是答所有锁题的金句。"
   }
  ]
 },
 {
  "id": "redis-governance",
  "title": "热Key/大Key治理与缓存一致性",
  "layer": 3,
  "depends": [
   "redis-expire-eviction",
   "redis-replication-sentinel"
  ],
  "covers": [
   "redis-19",
   "redis-10",
   "redis-34",
   "redis-18",
   "redis-35",
   "redis-29"
  ],
  "quiz": [
   "redis-19",
   "redis-10",
   "redis-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "热 key 打爆单节点、大 key 拖垮迁移、缓存与 DB 不一致——生产事故三巨头，治理靠'架构上预防 + 运行时监控 + 兜底手段'三层。"
   },
   {
    "t": "pre",
    "items": [
     "掌握缓存三兄弟与一致性基础（节点 4）",
     "理解分布式锁的幂等思想（节点 7）",
     "了解 Redis 慢日志、内存指标与性能调优"
    ]
   },
   {
    "t": "h",
    "text": "大 key：体积问题怎么治理"
   },
   {
    "t": "p",
    "text": "大 key 是单 key 体积过大，拖慢 IO 与迁移、内存倾斜。发现靠 redis-cli --bigkeys（低峰跑）、MEMORY USAGE、慢日志、RDB 离线分析（rdbtools）；治理靠拆分（全服 100 万在线集合按 ID 尾号拆 100 个子 Set）、UNLINK/lazyfree 异步删除、压缩、LTRIM 限长。"
   },
   {
    "t": "list",
    "items": [
     "DEL 一个百万元素集合会阻塞主线程几百毫秒；4.0 起用 UNLINK 逻辑删除，内存回收交给 lazyfree 后台线程",
     "lazyfree-lazy-del / expire / eviction / server-del 系列建议全开，把内存回收全交给后台线程",
     "全服排行榜这类天然集中的 key 要提前按分数段/时间段拆榜，别等出事再拆",
     "限大小：List/Stream 用 LTRIM/MAXLEN 截断，防止无限增长"
    ]
   },
   {
    "t": "h",
    "text": "热 key：流量问题怎么治理"
   },
   {
    "t": "p",
    "text": "热 key 是 QPS 集中在单个 key 打爆单节点。发现靠 proxy 层统计、redis-cli --hotkeys（需 LFU 策略）、客户端埋点。治理三板斧：本地缓存挡一层（Caffeine/ConcurrentHashMap + 定时同步）、key 拆 N 份加随机后缀（hotkey:1~16，读分摊写广播，读多写少场景）、多副本/读写分离分摊读。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">热 key 治理三板斧</text>\n  <rect x=\"20\" y=\"48\" width=\"190\" height=\"172\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"115\" y=\"76\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">① 本地缓存挡一层</text>\n  <text x=\"115\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">Caffeine / ConcurrentHashMap</text>\n  <text x=\"115\" y=\"128\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">+ 定时同步</text>\n  <text x=\"115\" y=\"152\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">热点数据先命中本地</text>\n  <text x=\"115\" y=\"174\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">Redis QPS 大幅下降</text>\n  <text x=\"115\" y=\"200\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">适合读远多于写</text>\n  <rect x=\"222\" y=\"48\" width=\"190\" height=\"172\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"317\" y=\"76\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">② key 拆 N 份</text>\n  <text x=\"317\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">hotkey:1 ~ hotkey:16</text>\n  <text x=\"317\" y=\"128\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">随机后缀分摊读</text>\n  <text x=\"317\" y=\"152\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">写要广播到全部副本</text>\n  <text x=\"317\" y=\"174\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">有写放大代价</text>\n  <text x=\"317\" y=\"200\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">读多写少场景适用</text>\n  <rect x=\"424\" y=\"48\" width=\"190\" height=\"172\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <text x=\"519\" y=\"76\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">③ 多副本/读写分离</text>\n  <text x=\"519\" y=\"104\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">主从多副本分摊读</text>\n  <text x=\"519\" y=\"128\" text-anchor=\"middle\" fill=\"var(--ink)\" font-size=\"12\">从节点承载读流量</text>\n  <text x=\"519\" y=\"152\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">配合本地缓存组合</text>\n  <text x=\"519\" y=\"174\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">治标更治本的一层</text>\n  <text x=\"519\" y=\"200\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"12\">注意复制延迟</text>\n  <text x=\"20\" y=\"248\" fill=\"var(--ink)\" font-size=\"13\">发现手段：proxy 层统计、redis-cli --hotkeys（需 LFU 策略）、客户端埋点、monitor（慎用）</text>\n  <text x=\"20\" y=\"274\" fill=\"var(--muted)\" font-size=\"12\">架构预防：热点数据默认走本地缓存 + Redis 二级；游戏服内存态优先消化热点，key 设计评审预估热度与体积</text>\n</svg>",
    "caption": "图：热 key 治理三板斧"
   },
   {
    "t": "h",
    "text": "缓存与 DB 一致性"
   },
   {
    "t": "p",
    "text": "Cache Aside 为主：读 miss 回填、写先更新 DB 再删缓存（不是更新缓存，避免并发写覆盖脏值与无用计算）。极端并发用延迟双删覆盖回填窗口，删除失败走 MQ 重试；重一致性业务上 binlog 订阅（canal 伪装从库解析 binlog 投递 MQ，消费端删缓存），业务零侵入、天然可重试。游戏服特例：单玩家数据由 Disruptor 内存态串行化，缓存一致性问题主要出现在跨服共享数据和 GM 后台改数据刷缓存这类旁路场景。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Cache Aside：先更新 DB 再删缓存，极端并发用延迟双删\npublic void updatePlayerProfile(long uid, Player p) {\n    db.update(uid, p);                              // 1) 更新事实源（MySQL）\n    deleteCache(uid);                               // 2) 删缓存\n    scheduler.schedule(() -> deleteCache(uid),\n            500, TimeUnit.MILLISECONDS);            // 3) 延迟再删，覆盖并发回填窗口\n}\n\nvoid deleteCache(long uid) {\n    long del = redis.del(\"player:\" + uid);\n    if (del != 1) {\n        mq.send(\"cache-del\", \"player:\" + uid);     // 删除失败走 MQ 重试，天然幂等\n    }\n}\n// 重一致性业务用 canal：MySQL binlog → Kafka → 消费端删缓存（业务零侵入、可重试）"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 340\">\n  <text x=\"20\" y=\"26\" fill=\"var(--ink)\" font-size=\"16\" font-weight=\"bold\">延迟双删：覆盖并发回填窗口</text>\n  <rect x=\"20\" y=\"52\" width=\"600\" height=\"38\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <circle cx=\"48\" cy=\"71\" r=\"13\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"48\" y=\"76\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">1</text>\n  <text x=\"76\" y=\"76\" fill=\"var(--ink)\" font-size=\"13\">写线程 A：先删缓存（旧值清掉）</text>\n  <rect x=\"20\" y=\"102\" width=\"600\" height=\"38\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <circle cx=\"48\" cy=\"121\" r=\"13\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"48\" y=\"126\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">2</text>\n  <text x=\"76\" y=\"126\" fill=\"var(--ink)\" font-size=\"13\">写线程 A：更新 DB（新值落库）</text>\n  <rect x=\"20\" y=\"152\" width=\"600\" height=\"38\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <circle cx=\"48\" cy=\"171\" r=\"13\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n  <text x=\"48\" y=\"176\" text-anchor=\"middle\" fill=\"var(--lv3)\" font-size=\"13\" font-weight=\"bold\">3</text>\n  <text x=\"76\" y=\"176\" fill=\"var(--ink)\" font-size=\"13\">读线程 B：读 miss → 查库旧值 → 回填脏缓存（并发窗口）</text>\n  <rect x=\"20\" y=\"202\" width=\"600\" height=\"38\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <circle cx=\"48\" cy=\"221\" r=\"13\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"48\" y=\"226\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">4</text>\n  <text x=\"76\" y=\"226\" fill=\"var(--ink)\" font-size=\"13\">写线程 A：延迟 500ms 后再删缓存 → 脏缓存清除</text>\n  <rect x=\"20\" y=\"252\" width=\"600\" height=\"38\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n  <circle cx=\"48\" cy=\"271\" r=\"13\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n  <text x=\"48\" y=\"276\" text-anchor=\"middle\" fill=\"var(--accent)\" font-size=\"13\" font-weight=\"bold\">5</text>\n  <text x=\"76\" y=\"276\" fill=\"var(--ink)\" font-size=\"13\">后续读 miss → 查库新值 → 回填正确缓存</text>\n  <text x=\"20\" y=\"312\" fill=\"var(--muted)\" font-size=\"12\">第二次删除失败必须 MQ 重试（删除幂等）；延迟时长压测读路径'查库+回填'P99 定，500ms 起步</text>\n  <text x=\"20\" y=\"332\" fill=\"var(--muted)\" font-size=\"12\">所有方案都是最终一致、窗口大小不同；强一致只能牺牲可用性（分布式事务/锁），缓存场景不值得</text>\n</svg>",
    "caption": "图：延迟双删时序"
   },
   {
    "t": "h",
    "text": "排行榜大榜治理与排障"
   },
   {
    "t": "p",
    "text": "并列排名（同分同名次）零存储方案：名次 = ZCOUNT key (myScore +inf) + 1，同分的人算出的名次天然相同；要'同分先达到排前面'则用 score = 分数×10^13 + (10^13 - 时间戳) 编码，注意 double 精确整数上限 2^53 的位数预算。深度翻页：ZREVRANGE 偏移翻页适合 TopN，游标翻页（ZREVRANGEBYSCORE 记录上一个边界）适合'加载更多'；全量导出禁止 ZREVRANGE 0 -1 一把拉，用 ZSCAN 分批低峰做。亿级大榜是巨型大 key，Cluster 下单 key 无法跨节点，按分数段/时间段拆榜。"
   },
   {
    "t": "p",
    "text": "排障工具：slowlog 只统计命令执行时间、不含排队和网络，客户端普遍超时但 slowlog 空 → 查 CPU 单核 100%、网络打满、AOF fsync、fork、swap。内存碎片看 mem_fragmentation_ratio = used_memory_rss / used_memory：1.0~1.1 健康、>1.5 碎片严重、<1 说明在 swap 更危险；治理用 activedefrag（限 CPU 占比）或低峰主从切换重启。"
   },
   {
    "t": "pits",
    "items": [
     "DEL 大 key 阻塞要带出 UNLINK + lazyfree 系列参数，这是送分点也是区分点",
     "热 key 拆 N 份有写放大代价，只适用读多写少；游戏服更优解是内存态优先消化热点",
     "延迟双删是'应用层轻量兜底'，时间靠压测定，第二次删除必须能重试（MQ），否则白做",
     "canal 链路是最终一致，窗口百 ms~秒级；别吹成强一致",
     "并列排名（同分同号）与'同分先到先得'（同分不同号）是互斥需求，先问产品要哪种再动手",
     "slowlog 不是全链路耗时：客户端慢但日志空，往 CPU/网络/刷盘/fork 方向查",
     "mem_fragmentation_ratio < 1 比 >1.5 更危险（在 swap 说明半瘫），别只记得大数警告"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：治理题的通用框架是'发现问题 → 治理手段 → 架构预防'。大 key 化整为零、热 key 分身分摊、一致性分方案定窗口、大榜拆分段、排障按五板斧（fork/大 key/刷盘/过期风暴/CPU 打满）。每一条都能落到游戏服场景，就是 10 年老兵的回答。"
   }
  ]
 },
 {
  "id": "redis-cache-strategy",
  "title": "缓存雪崩/击穿/穿透与更新策略实战",
  "layer": 3,
  "depends": [
   "redis-expire-eviction",
   "redis-governance"
  ],
  "covers": [
   "redis-09",
   "redis-10",
   "redis-34"
  ],
  "quiz": [
   "redis-09",
   "redis-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "缓存三兄弟（穿透/击穿/雪崩）是\"缓存失效的三种姿势\"，更新策略是\"缓存写对的姿势\"。这篇把三兄弟的解法落到游戏服真实场景，再把 Cache-Aside、延迟双删、版本号、多级缓存串成一套完整体系，最后用活动配置缓存把整套打法演一遍。"
   },
   {
    "t": "pre",
    "items": [
     "掌握缓存三兄弟基础解法与布隆过滤器（redis-expire-eviction）",
     "了解 Cache Aside 与缓存一致性基础（redis-governance）",
     "了解分布式锁与 Lua 的原子操作手段（redis-distributed-lock、redis-transaction-lua）"
    ]
   },
   {
    "t": "h",
    "text": "一、三兄弟场景与游戏服对应"
   },
   {
    "t": "list",
    "items": [
     "穿透：查 DB 里根本不存在的玩家 ID/订单号，缓存永远 miss 打穿 DB。游戏服里恶意脚本批量刷不存在的 uid。解法：缓存空值（短 TTL）+ 布隆过滤器前置拦截 + 参数校验限流",
     "击穿：单个超热 key（全服 Boss 血量、跨服榜 Top1）在过期瞬间被万级并发同时 miss。解法：互斥锁 SET NX 重建，或逻辑过期（value 带时间戳，过期异步重建、其余线程返回旧值）",
     "雪崩：大量 key 同时过期（活动配置整表过期），或实例整体宕机。解法：TTL 随机抖动 + 热点不过期 + 多级缓存 + 熔断降级"
    ]
   },
   {
    "t": "p",
    "text": "三个真实案例帮你记：登录高峰全服玩家档案缓存一次性 miss（雪崩）→ 开服前预热 + TTL 抖动；某全服活动资格 key 被疯狂请求（击穿）→ 逻辑过期返回旧资格缓存；刷子用不存在的 uid 打排行榜接口（穿透）→ 布隆过滤器在登录入口拦掉 99%。"
   },
   {
    "t": "h",
    "text": "二、更新策略全景：Cache-Aside 到 Write-Through"
   },
   {
    "t": "p",
    "text": "四种更新模式：Cache-Aside（旁路缓存）——应用自己管，读 miss 回填、写先更新 DB 再删缓存，游戏服主流；Read-Through——应用只读缓存，缓存组件自己回源 DB，应用无感，适合缓存层封装的场景；Write-Through——写缓存同步写 DB，缓存和 DB 强一致但写路径变长；Write-Behind——只写缓存异步刷 DB，写快但丢数据窗口大。游戏服为什么用 Cache-Aside：读多写少、DB 是事实源、允许秒级最终一致，而且和游戏服\"内存态为主 + Redis 加速\"的架构最贴合。"
   },
   {
    "t": "table",
    "head": [
     "模式",
     "读路径",
     "写路径",
     "一致性",
     "游戏服适用"
    ],
    "rows": [
     [
      "Cache-Aside",
      "应用 miss 回填",
      "先 DB 后删缓存",
      "最终一致",
      "玩家档案、配置缓存（主流）"
     ],
     [
      "Read-Through",
      "缓存组件回源",
      "先 DB 后删缓存",
      "最终一致",
      "缓存层封装的中间件场景"
     ],
     [
      "Write-Through",
      "同左",
      "写缓存同步写 DB",
      "相对强",
      "写少读多的低频配置"
     ],
     [
      "Write-Behind",
      "同左",
      "只写缓存异步刷 DB",
      "弱（有丢失窗口）",
      "日志类，一般用 Kafka 更稳"
     ]
    ]
   },
   {
    "t": "h",
    "text": "三、延迟双删与版本号：并发脏写的两道保险"
   },
   {
    "t": "p",
    "text": "Cache-Aside 的并发窗口：A 更新 DB 后删缓存，删完的瞬间 B 读到旧 DB 值回填缓存，A 的\"新值\"被旧值覆盖。延迟双删：更新前删一次、延迟 500ms 再删一次，第二次把并发回填的脏缓存清掉；第二次删除必须可重试（MQ 兜底），否则白做。版本号方案：缓存 value 带版本，写库后版本 +1，读时版本落后则回源并回填新版本，逻辑上更严谨但实现重。游戏服多数场景延迟双删 + MQ 重试足够，重一致性业务上 canal 订阅 binlog（见 redis-governance 节点）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Cache-Aside + 延迟双删 + MQ 重试（活动配置更新）\npublic void updateConfig(String key, String value) {\n    db.updateConfig(key, value);                    // 1) 更新 DB（事实源）\n    redis.del(\"cfg:\" + key);                        // 2) 第一次删缓存\n    delayedExecutor.schedule(() -> {\n        long n = redis.del(\"cfg:\" + key);\n        if (n == 0) {\n            // 第二次删时缓存可能已过期自然消失，\n            // 但若恰好被并发读回填了旧值，这里补一刀\n            mq.send(\"cache.del\", \"cfg:\" + key);    // 进 MQ 重试，删缓存幂等\n        }\n    }, 500, TimeUnit.MILLISECONDS);                 // 延迟 > 读回填耗时\n}"
   },
   {
    "t": "h",
    "text": "四、多级缓存：本地 Caffeine + Redis + DB"
   },
   {
    "t": "p",
    "text": "游戏服的热点数据其实第一层应该在本地：ConcurrentHashMap/Caffeine 挡掉绝大部分读，Redis 做跨进程共享与兜底，DB 是事实源。本地缓存一致性靠短 TTL（秒级）+ 主动失效广播（Pub/Sub 或版本号轮询）。这一层就是热 key 治理的第一道墙——全服公告、活动开关、排行 TopN 这类读多写少数据全部本地化，Redis 的 QPS 压力直线下降。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">多级缓存：本地 → Redis → DB，三兄弟各被挡在不同层</text><rect x=\"30\" y=\"48\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"120\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">L1 本地缓存</text><text x=\"120\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Caffeine/ConcurrentHashMap</text><text x=\"120\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">短 TTL + 版本号轮询刷新</text><rect x=\"230\" y=\"48\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">L2 Redis</text><text x=\"320\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跨进程共享 + 防击穿</text><text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">互斥锁/逻辑过期兜底</text><rect x=\"430\" y=\"48\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"520\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">DB 事实源</text><text x=\"520\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MySQL/配置中心</text><text x=\"520\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">写全落库</text><path d=\"M210 83 L230 83\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M410 83 L430 83\" stroke=\"var(--accent)\" stroke-width=\"2\"/><text x=\"320\" y=\"146\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三层各挡一个兄弟：</text><text x=\"320\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">L1 挡雪崩（热点不过期、本地消化）</text><text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">L2 挡击穿（互斥锁/逻辑过期重建）</text><text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">入口挡穿透（布隆过滤器 + 空值缓存）</text><text x=\"320\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全服公告、活动开关、排行 TopN 这类读多写少数据全部本地化，Redis QPS 直线下降</text><text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一致性：短 TTL + 版本号轮询 + 主动失效广播，游戏场景秒级最终一致足够</text><text x=\"320\" y=\"292\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">货币/充值等强一致数据以 DB 为准，Redis 只做读加速</text></svg>",
    "caption": "图：多级缓存分层与三兄弟的防御位置"
   },
   {
    "t": "h",
    "text": "五、游戏服活动配置缓存实战（完整链路）"
   },
   {
    "t": "p",
    "text": "活动配置（奖励表、掉落概率、活动开关）是读多写少、GM 后台会改的典型数据。设计：内容 key 存 JSON + 版本号 key 存版本；GM 改配置 → 写 DB → 版本号 +1（INCR）→ 各服定时（如 3s）轮询版本号，变了就重载本地缓存；读走本地缓存优先，miss 再查 Redis/DB。这样 GM 改完配置全服最多 3~5 秒生效，且本地缓存天然抗雪崩。注意：空配置也要缓存（防穿透）；版本号必须全局单调（INCR 天然单调）；多服共享一套 Redis 时版本号 key 要区分环境前缀。"
   },
   {
    "t": "pits",
    "items": [
     "布隆过滤器误判方向要想清楚：防超发宁可错杀，普发奖励误判 = 玩家投诉，不能用",
     "延迟双删的\"延迟 500ms\"是拍脑袋，要压测读回填的 P99 耗时再定；第二次删除必须能重试",
     "多级缓存的一致性窗口会叠加，本地缓存 TTL 太长会出现\"改了配置玩家看不到\"的线上事故",
     "Write-Through/Write-Behind 写路径变长或丢数据，游戏服写多场景别乱用",
     "版本号要用 INCR 保证单调，别用 SETEX 覆盖，否则并发更新可能版本倒退",
     "别把缓存空值设计成永久：空值 TTL 30~60s，防止大量不存在 key 长期占内存"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三兄弟靠\"入口拦穿透、单点防击穿、全层挡雪崩\"；更新策略 Cache-Aside 为主、延迟双删 + 版本号兜底并发窗口、多级缓存让热点先落本地。面试把三层防御位置和活动配置的版本号链路走一遍，就是可落地的缓存架构师回答。"
   }
  ]
 },
 {
  "id": "redis-mq-stream",
  "title": "消息队列方案对比与 Stream 实战",
  "layer": 3,
  "depends": [
   "redis-advanced-structs",
   "redis-replication-sentinel"
  ],
  "covers": [
   "redis-24",
   "redis-27"
  ],
  "quiz": [
   "redis-24"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服的异步链路选型是架构题：Stream 补齐了 Redis 内 MQ 的最后一块拼图，但\"什么量级选什么\"才是答案——轻量异步用 Stream、实时广播用 Pub/Sub、重型链路用 Kafka、帧同步内任务用本地队列。四个容器各司其职，别指望一个方案通吃。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 Stream 基本结构与命令（redis-advanced-structs）",
     "掌握 Pub/Sub 即发即忘的语义与局限（redis-data-structures）",
     "了解 Kafka 分区、消费组、副本的基本概念",
     "了解游戏服 Netty/Disruptor 内存态架构"
    ]
   },
   {
    "t": "h",
    "text": "一、Stream 消费组机制深挖"
   },
   {
    "t": "p",
    "text": "XADD 追加消息，自动生成\"毫秒时间戳-序号\"ID，天然有序可范围查询；XREADGROUP GROUP 组 消费者 > 创建/加入消费组并读新消息（> 是\"只读未投递过的新消息\"）；每条已投递未确认的消息进 Pending Entries List（PEL），XACK 确认后移除；消费者崩溃，其他消费者用 XCLAIM（指定 ID 接管）或 XAUTOCLAIM（按空闲时长批量接管）把 Pending 消息转移重投；XTRIM MAXLEN ~ N 近似裁剪防内存无限涨。死信设计：在消费逻辑里统计重试次数，超过上限转存死信 Stream。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Lettuce Stream 消费组：读新消息 → 处理 → ACK → 失败进死信\nStreamReadOptions readOpts = StreamReadOptions.builder()\n        .count(10).block(Duration.ofSeconds(1)).build();\nStreamOffset<String> offset = StreamOffset.create(\"task:mail\", \">\");\nwhile (running) {\n    List<StreamMessage<String, String>> msgs = redis.xreadgroup(\n            Consumer.from(\"mail-cg\", \"worker-1\"), readOpts, offset);\n    for (StreamMessage<String, String> m : msgs) {\n        try {\n            sendMail(m.getBody());\n            redis.xack(\"task:mail\", \"mail-cg\", m.getId());   // 成功才 ACK\n        } catch (Exception e) {\n            redis.xadd(\"task:mail:dead\", m.getBody());        // 失败进死信\n            redis.xack(\"task:mail\", \"mail-cg\", m.getId());   // 死信也 ACK，防 PEL 无限涨\n        }\n    }\n}\n// 崩溃恢复：XAUTOCLAIM 按空闲时长接管崩溃消费者的 Pending 消息\n// redis.xautoclaim(\"task:mail\", \"mail-cg\", \"worker-2\", 60000, \"0-0\", 100)"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Stream 消费组：投递 → PEL → ACK，崩溃可接管</text><rect x=\"30\" y=\"44\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"100\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">生产者</text><text x=\"100\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">XADD 追加</text><rect x=\"250\" y=\"44\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Stream 队列</text><text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">有序日志 + PEL</text><rect x=\"470\" y=\"44\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"540\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">消费者</text><text x=\"540\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">XREADGROUP 读</text><path d=\"M170 70 L250 70\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M390 70 L470 70\" stroke=\"var(--accent)\" stroke-width=\"2\"/><rect x=\"30\" y=\"120\" width=\"580\" height=\"60\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"50\" y=\"142\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">Pending Entries List（PEL）：已投递未确认的消息</text><text x=\"50\" y=\"166\" font-size=\"12\" fill=\"var(--ink)\">XACK 确认后移除；消费者崩溃 → XCLAIM/XAUTOCLAIM 转移给其他消费者重投</text><text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">死信：重试次数超上限 → 转存死信 Stream（task:mail:dead）定期巡检</text><text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">每个消费组各自维护 PEL：组内竞争消费、组间互不影响（广播语义要每个消费者独立建组）</text><text x=\"320\" y=\"262\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">XTRIM MAXLEN ~ N 近似裁剪，防内存无限涨；不裁剪 PEL 会一直占内存</text><text x=\"320\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">XREADGROUP 必须用 > 读新消息，传 0-0 会反复读历史</text></svg>",
    "caption": "图：Stream 消费组、PEL 与死信重投机制"
   },
   {
    "t": "h",
    "text": "二、Pub/Sub 的局限与适用边界"
   },
   {
    "t": "p",
    "text": "Pub/Sub 是\"即发即忘\"的实时广播：不持久（发布时没人订阅消息直接丢）、无 ACK（发送方不知道谁收到）、订阅者断线期间消息全丢、SUBSCRIBE 后客户端进入订阅模式不能执行普通命令、慢消费者会因输出缓冲超限被强制断开。能用：在线玩家实时推送（系统公告、跑马灯）、配置热更广播、哨兵事件通知——共同点是\"丢了无所谓或客户端会主动拉齐\"。不能用：发奖、订单、需要审计的日志。"
   },
   {
    "t": "h",
    "text": "三、四方对比：Stream / PubSub / Kafka / 本地队列"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "Stream",
     "Pub/Sub",
     "Kafka",
     "本地队列(Disruptor)"
    ],
    "rows": [
     [
      "持久化",
      "AOF/RDB",
      "不持久",
      "磁盘顺序写",
      "内存"
     ],
     [
      "消费组/ACK",
      "有（PEL/XACK）",
      "无",
      "有（offset/多组）",
      "无（直接消费）"
     ],
     [
      "重投/死信",
      "XCLAIM 手工",
      "无",
      "offset 回退",
      "无"
     ],
     [
      "吞吐",
      "几十万 TPS",
      "高",
      "百万 TPS+",
      "千万 TPS"
     ],
     [
      "积压能力",
      "内存，怕积压",
      "无堆积",
      "亿级，落磁盘",
      "内存，怕溢出"
     ],
     [
      "生态运维",
      "Redis 自带",
      "Redis 自带",
      "connector/监控成熟",
      "无外部依赖"
     ]
    ]
   },
   {
    "t": "p",
    "text": "选型结论一句话：轻量异步任务（邮件发放、成就结算、全服事件）用 Stream；允许丢的实时广播用 Pub/Sub；日志/BI 这类大流量、要重放、要长期积压的链路用 Kafka；帧同步战斗内的事件/RPC 用本地 Disruptor，连 Redis 都不要碰。"
   },
   {
    "t": "h",
    "text": "四、游戏服场景选型实战"
   },
   {
    "t": "p",
    "text": "我项目里的分工：行为日志 → 日志服 → Kafka → BI（高峰数十万 TPS、要补数重放，超出 Stream 内存舒适区）；游戏内异步任务（邮件发放、成就解锁、公告广播）用 Stream 或 Pub/Sub；战斗服内部技能/Buff 到期、帧同步事件全部本地 Disruptor 时间轮，零网络开销。面试把\"什么量级选什么\"讲清楚是加分项，别一句\"我们全用 Kafka\"糊过去。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服消息链路选型决策</text><rect x=\"30\" y=\"48\" width=\"580\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"74\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">业务事件产生（登录/战斗/发奖/日志/公告）</text><rect x=\"30\" y=\"104\" width=\"140\" height=\"58\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"100\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">轻量异步</text><text x=\"100\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ Stream</text><rect x=\"180\" y=\"104\" width=\"140\" height=\"58\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/><text x=\"250\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">实时广播</text><text x=\"250\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ Pub/Sub</text><rect x=\"330\" y=\"104\" width=\"140\" height=\"58\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"400\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">大流量日志</text><text x=\"400\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ Kafka</text><rect x=\"480\" y=\"104\" width=\"130\" height=\"58\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"545\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">帧同步内</text><text x=\"545\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">→ Disruptor</text><text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Stream：邮件发放、成就结算、全服事件（要 ACK/重投，量小）</text><text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Pub/Sub：公告跑马灯、配置热更、哨兵通知（允许丢）</text><text x=\"320\" y=\"244\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">Kafka：行为日志→BI、支付回调（要重放、长期积压）</text><text x=\"320\" y=\"268\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Disruptor：技能/Buff 到期、帧同步事件（零网络，绝不碰 Redis）</text></svg>",
    "caption": "图：游戏服四种消息场景的选型决策"
   },
   {
    "t": "pits",
    "items": [
     "别把 Stream 当 Kafka 平替：全内存存储，积压等于内存爆炸，量级一上去就扛不住",
     "XREADGROUP 必须用 > 读新消息，传 0-0 会反复读历史",
     "消费组语义别记反：组内消息竞争（一条只被组内一个消费者拿到）、组间独立（广播要每个消费者独立建组）",
     "ACK 必须做：PEL 不清理会无限占内存；死信也要 ACK，否则死信消息反复重投",
     "Pub/Sub 慢消费者会被输出缓冲超限强制断开，这是线上真实事故源",
     "帧同步战斗内任务走 Redis 是架构错误：加锁、网络、延迟全部不可控，用本地队列"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：消息队列的面试框架是\"场景 → 选型 → 理由\"。Stream 有消费组/ACK/重投但怕积压，Pub/Sub 实时但即发即忘，Kafka 可靠能积压但重，本地队列最快但只在进程内。把游戏服四种场景对号入座，就是有架构判断力的回答。"
   }
  ]
 },
 {
  "id": "redis-security-ops",
  "title": "安全、运维与监控",
  "layer": 3,
  "depends": [
   "redis-replication-sentinel",
   "redis-cluster",
   "redis-persistence"
  ],
  "covers": [
   "redis-29",
   "redis-21",
   "redis-31"
  ],
  "quiz": [
   "redis-29"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Redis 裸奔上线是事故，不是配置问题。安全三板斧（保护模式/密码/危险命令改名）+ 监控三件套（慢日志/INFO 指标/告警）+ 故障演练复盘，是游戏服 Redis 运维的完整闭环。这篇把从配置到复盘的全套打法走一遍。"
   },
   {
    "t": "pre",
    "items": [
     "掌握主从/哨兵/Cluster 架构（redis-replication-sentinel、redis-cluster）",
     "掌握持久化与混合持久化（redis-persistence）",
     "掌握慢日志与内存碎片指标（redis-memory-optimize）"
    ]
   },
   {
    "t": "h",
    "text": "一、安全配置：别让 Redis 裸奔"
   },
   {
    "t": "p",
    "text": "Redis 没配认证 + 暴露公网 = 被挖矿/勒索的入场券，这是真实高频事故。基线：bind 只监听内网网段、protected-mode yes、requirepass 强密码、rename-command 禁掉/改名危险命令（KEYS/FLUSHALL/FLUSHDB/CONFIG/DEBUG/EVAL 视情况）、ACL 最小权限、禁止 DEBUG 相关、别用 root 跑、关键实例关掉危险配置项。多业务共用集群时 ACL 是硬隔离手段，应用账号只给业务命令 + key 前缀。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# redis.conf 安全基线\nbind 10.0.0.0/24          # 只监听内网网段\nprotected-mode yes\nrequirepass strong-password\nrename-command KEYS \"\"                    # 禁掉 KEYS\nrename-command FLUSHALL \"\"\nrename-command FLUSHDB \"\"\nrename-command CONFIG \"cfg_op\"            # 改名降权\nrename-command DEBUG \"\"\nrename-command EVAL \"eval_op\"             # 生产若用 Lua 建议改名 + ACL 限制\n# 慢查询\nslowlog-log-slower-than 5000              # 5ms 记入慢日志\nslowlog-max-len 1024"
   },
   {
    "t": "h",
    "text": "二、慢查询日志与 MONITOR"
   },
   {
    "t": "p",
    "text": "SLOWLOG 只统计\"命令执行时间\"，不含排队和网络——所以\"客户端慢但 SLOWLOG 空\"要往 CPU 打满、网络带宽、AOF fsync、fork、swap 方向查。SLOWLOG GET 看六元组（id/时间戳/耗时/命令/客户端地址/名），优先排查 KEYS、SMEMBERS、HGETALL、ZRANGE 0 -1 这类 O(N) 命令和大 key 操作。MONITOR 实时看所有命令，排障利器但生产慎用：性能开销 + 命令明文可能泄密，高峰期别开。还有个实用技巧：用 redis-cli --bigkeys（低峰跑）和 --hotkeys（需 LFU 策略）做周期性体检。"
   },
   {
    "t": "h",
    "text": "三、INFO 指标解读"
   },
   {
    "t": "list",
    "items": [
     "INFO server：版本、运行时间、uptime 异常重启线索",
     "INFO clients：connected_clients 超过 80% 容量要扩容/排查连接泄漏",
     "INFO memory：used_memory、mem_fragmentation_ratio（>1.5 碎片、<1 swap）、maxmemory",
     "INFO stats：keyspace_hits/misses 命中率 <90% 查缓存设计；瞬时 QPS 峰值",
     "INFO replication：master_link_status、master_last_io_seconds_ago（主从断连）、repl_backlog_size",
     "INFO persistence：rdb_last_bgsave_status、aof_last_write_status 持久化健康"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">监控面板核心指标与告警阈值</text><rect x=\"30\" y=\"44\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">内存</text><text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">碎片率 &gt;1.5 告警</text><text x=\"120\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">&lt;1 是 swap 更危险</text><rect x=\"230\" y=\"44\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">连接</text><text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">connected_clients &gt;80%</text><text x=\"320\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">查泄漏/扩容</text><rect x=\"430\" y=\"44\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"520\" y=\"66\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">主从</text><text x=\"520\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">master_link_status 断</text><text x=\"520\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">lag 超阈值告警</text><rect x=\"30\" y=\"130\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"120\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">命中率</text><text x=\"120\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">keyspace 命中率 &lt;90%</text><text x=\"120\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">查缓存设计</text><rect x=\"230\" y=\"130\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">持久化</text><text x=\"320\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">rdb/aof last status</text><text x=\"320\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">失败立即告警</text><rect x=\"430\" y=\"130\" width=\"180\" height=\"70\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"520\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">慢查询</text><text x=\"520\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">SLOWLOG 条数增长</text><text x=\"520\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">O(N) 命令抓现行</text><text x=\"320\" y=\"228\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">监控 + 告警 + 巡检（--bigkeys/--hotkeys/主从切换演练）三位一体</text><text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">客户端慢但 SLOWLOG 空 → 查 CPU 单核 100%、网络、AOF fsync、fork、swap</text><text x=\"320\" y=\"272\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">MONITOR 排障利器但生产慎用：性能开销 + 命令明文</text></svg>",
    "caption": "图：监控面板核心指标与阈值"
   },
   {
    "t": "h",
    "text": "四、主从切换演练与故障复盘"
   },
   {
    "t": "p",
    "text": "演练脚本：低峰期 SHUTDOWN 或断网模拟主库宕机，验证三件事——哨兵故障转移耗时（秒级~十几秒）、客户端能否自动重连新主（JedisSentinelPool/Lettuce 验证）、切换期间写入失败的补偿逻辑是否生效（重试队列/幂等）。复盘清单：故障时间线、根因（fork？大 key？AOF fsync？连接风暴？）、影响面（哪些服务、丢了什么）、预案执行情况、改进项（参数调优、架构改造）。真实案例：登录高峰主从切换丢 session → 加 min-replicas-to-write 缩小脑裂窗口 + 客户端重试 + session 持久化到 DB。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">故障复盘时间线：从发现到改进</text><rect x=\"30\" y=\"48\" width=\"580\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"73\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">T0 故障发生（主库宕机 / 毛刺 / 连接打满）</text><rect x=\"30\" y=\"94\" width=\"580\" height=\"40\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"320\" y=\"119\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">T1 告警触发（监控项命中 → 值班响应）</text><rect x=\"30\" y=\"140\" width=\"580\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"320\" y=\"165\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">T2 定位根因（SLOWLOG/INFO/--bigkeys/fork 指标）</text><rect x=\"30\" y=\"186\" width=\"580\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"320\" y=\"211\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">T3 恢复 + 复盘（改进项落到配置/架构/预案）</text><text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">复盘必答三问：丢了多少？为什么没挡住？下次怎么不丢？</text></svg>",
    "caption": "图：故障复盘时间线与三问"
   },
   {
    "t": "h",
    "text": "五、常见故障复盘速查"
   },
   {
    "t": "list",
    "items": [
     "内存打满触发淘汰误删正常 key → 检查 maxmemory 是否打满、过期风暴、拆实例",
     "连接数暴涨 → 连接泄漏（客户端没 close）+ 慢查询堆积，排查 connected_clients 与 SLOWLOG",
     "主从切换丢数据/脑裂 → min-replicas-to-write + 业务幂等兜底，别只靠 Redis 层",
     "AOF fsync 阻塞主线程 → 盘太慢/和高 IO 服务抢磁盘，上 SSD + 分离磁盘",
     "大 key 迁移/删除卡顿 → UNLINK、lazyfree 系列参数、提前拆分",
     "登录高峰毛刺 → fork + COW + 批量 session 写撞刷盘，持久化挪从节点 + TTL 抖动"
    ]
   },
   {
    "t": "pits",
    "items": [
     "别在生产开 KEYS/FLUSHALL——改名或 ACL 禁掉是基线，不是可选项",
     "MONITOR 高峰期别开：性能开销大 + 命令明文泄露风险",
     "命中率要结合业务判断：低命中率未必是问题，可能是数据本就不常读",
     "主从切换不是自动保险：客户端要有重试和降级，业务要幂等",
     "密码要轮换、ACL 要最小权限，别一年不换一个 requirepass 用到退休",
     "备份要验证可恢复：RDB 文件坏了只有真恢复过才知道",
     "演练要真停机，别只写文档——切换过一次才有资格说高可用"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：运维 = 安全基线（bind/密码/rename/ACL）+ 监控三件套（SLOWLOG/INFO/告警）+ 周期性演练（主从切换/故障复盘）。面试把安全配置逐条报出来、把 INFO 指标和阈值对号入座、把一次主从切换事故的复盘链路走完整，就是能扛事的运维工程师。"
   }
  ]
 }
]
};
