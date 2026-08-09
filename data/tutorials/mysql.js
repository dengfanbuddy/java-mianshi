window.TB = window.TB || {};
window.TB["mysql"] = {
  id: "mysql",
  name: "MySQL 与分库分表",
  icon: "🐬",
  nodes: [
 {
  "id": "mysql-inno-architecture",
  "title": "InnoDB 架构与存储：页、Buffer Pool、主键设计",
  "layer": 0,
  "depends": [],
  "covers": [
   "mysql-01",
   "mysql-02",
   "mysql-21",
   "mysql-24",
   "mysql-25"
  ],
  "quiz": [
   "mysql-01",
   "mysql-21",
   "mysql-25"
  ],
  "body": [
   {
    "t": "lead",
    "text": "InnoDB 是 MySQL 的默认存储引擎，先看懂它的内存/磁盘分层与页式存储，后面索引、事务、锁、慢 SQL 才有地基。"
   },
   {
    "t": "pre",
    "items": [
     "关系型数据库以行存储，但 InnoDB 以页（默认 16KB）为最小读写单位",
     "磁盘随机 IO 比内存慢几个数量级，一切设计都在为『少碰磁盘』服务",
     "B+ 树直觉：数据按主键有序组织，叶子节点存数据、双向链表相连（细节在下一节点展开）"
    ]
   },
   {
    "t": "h",
    "text": "一张图看懂 InnoDB：内存、磁盘与后台线程"
   },
   {
    "t": "p",
    "text": "InnoDB 的核心思想是『写内存、记日志、异步刷盘』：数据页缓存在 Buffer Pool，事务提交只保证 redo log 落盘（WAL），数据页由后台线程异步刷回磁盘——所以高频 update 很快。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 440\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">InnoDB 总体架构：写内存、记日志、异步刷盘</text><rect x=\"30\" y=\"45\" width=\"580\" height=\"170\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"48\" y=\"72\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">内存层</text><rect x=\"48\" y=\"85\" width=\"270\" height=\"112\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"60\" y=\"106\" font-size=\"14\" fill=\"var(--ink)\">Buffer Pool（改进 LRU）</text><rect x=\"60\" y=\"116\" width=\"150\" height=\"68\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"72\" y=\"140\" font-size=\"12\" fill=\"var(--ink)\">young 区 5/8</text><text x=\"72\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">活跃玩家热页常驻</text><rect x=\"216\" y=\"116\" width=\"92\" height=\"68\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"228\" y=\"140\" font-size=\"12\" fill=\"var(--ink)\">old 区 3/8</text><text x=\"228\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">新页停留后晋升</text><rect x=\"330\" y=\"85\" width=\"125\" height=\"112\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"342\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\">change buffer</text><text x=\"342\" y=\"126\" font-size=\"12\" fill=\"var(--muted)\">非唯一二级索引</text><text x=\"342\" y=\"144\" font-size=\"12\" fill=\"var(--muted)\">写缓冲后台 merge</text><rect x=\"467\" y=\"85\" width=\"125\" height=\"112\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"479\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\">redo log buffer</text><text x=\"479\" y=\"126\" font-size=\"12\" fill=\"var(--muted)\">提交时顺序写落盘</text><rect x=\"30\" y=\"235\" width=\"580\" height=\"115\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"48\" y=\"262\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">磁盘层</text><rect x=\"48\" y=\"275\" width=\"165\" height=\"58\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"62\" y=\"300\" font-size=\"13\" fill=\"var(--ink)\">数据文件 .ibd</text><text x=\"62\" y=\"318\" font-size=\"12\" fill=\"var(--muted)\">页 16KB 异步刷脏</text><rect x=\"233\" y=\"275\" width=\"165\" height=\"58\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"247\" y=\"300\" font-size=\"13\" fill=\"var(--ink)\">redo log（循环写）</text><text x=\"247\" y=\"318\" font-size=\"12\" fill=\"var(--muted)\">崩溃恢复重放</text><rect x=\"418\" y=\"275\" width=\"165\" height=\"58\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"432\" y=\"300\" font-size=\"13\" fill=\"var(--ink)\">binlog（追加写）</text><text x=\"432\" y=\"318\" font-size=\"12\" fill=\"var(--muted)\">主从复制与归档</text><path d=\"M 320 197 L 320 228\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 315 220 L 320 230 L 325 220\" fill=\"var(--accent)\"/><text x=\"330\" y=\"222\" font-size=\"12\" fill=\"var(--accent)\">写路径：先记 redo，数据页异步刷</text><text x=\"48\" y=\"382\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">后台线程</text><text x=\"48\" y=\"406\" font-size=\"13\" fill=\"var(--ink)\">master thread · purge（清 undo） · page cleaner（刷脏页） · change buffer merge</text><text x=\"360\" y=\"382\" font-size=\"12\" fill=\"var(--muted)\">刷盘节奏由后台调度，不阻塞事务提交</text></svg>",
    "caption": "图 1-1：InnoDB 内存层与磁盘层分工，WAL 让写数据变成『写日志 + 延迟刷页』"
   },
   {
    "t": "list",
    "items": [
     "内存层：Buffer Pool（缓存数据页+索引页）、change buffer（非唯一二级索引写缓冲）、redo log buffer（待落盘日志）",
     "磁盘层：独立表空间 .ibd、系统表空间、redo log（循环写）、binlog（Server 层追加写）",
     "后台线程：master thread、purge 线程、page cleaner 刷脏线程、change buffer merge 线程"
    ]
   },
   {
    "t": "h",
    "text": "Buffer Pool：游戏高热点数据的内存老家"
   },
   {
    "t": "p",
    "text": "Buffer Pool 默认 128M（生产常配物理内存 50%~70%），读写都先经过它。读 miss 从磁盘载页；写先改内存页（脏页）再写 redo log，异步刷盘。它用改进版 LRU 管理：分 young（5/8）与 old（3/8）区，新页先进 old 区头部，停留超过 innodb_old_blocks_time（默认 1 秒）再次被访问才晋升 young——防止全表扫描把热点页冲掉。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 查看命中率：对比 逻辑读 与 物理读\nSHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';\n-- 命中率 = 1 - Innodb_buffer_pool_reads / Innodb_buffer_pool_read_requests\n-- 健康线 > 99%；show engine innodb status 看 Buffer pool hit rate"
   },
   {
    "t": "h",
    "text": "change buffer：非唯一二级索引的快递暂存柜"
   },
   {
    "t": "p",
    "text": "对非唯一二级索引的 insert/update/delete，目标索引页不在内存时不立即读盘修改，而是把变更记入 change buffer，等下次读到该页或后台线程 merge。唯一索引必须立即读页查冲突，无法缓冲——这是两条写优化线的分界。"
   },
   {
    "t": "h",
    "text": "页与主键：为什么自增主键是铁律"
   },
   {
    "t": "p",
    "text": "页满后往中间插入新纪录会触发页分裂（一页拆两页，空间利用率掉到 50%~70%，伴随碎片与 IO 放大）。自增主键让插入永远追加到最右页，几乎不分裂；UUID 主键随机插入频繁页分裂，且 36 字节主键会同步放大所有二级索引体积。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 游戏玩家表建表规范\nCREATE TABLE player (\n  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '物理主键：自增保插入顺序',\n  player_id  BIGINT UNSIGNED NOT NULL COMMENT '业务玩家ID：区服号+库内自增',\n  nickname   VARCHAR(32) NOT NULL,\n  level      INT UNSIGNED NOT NULL DEFAULT 1,\n  diamond    BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '钻石：以 DB 为准',\n  reg_time   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (id),\n  UNIQUE KEY uk_player_id (player_id),\n  KEY idx_reg_time (reg_time)  -- 非唯一二级索引，可被 change buffer 缓冲\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
   },
   {
    "t": "p",
    "text": "说明：id 自增做物理主键保证插入顺序；player_id 做业务唯一键，是后续分片键；reg_time 这类非唯一索引只有在数据量远大于内存、写多读少的表上才享受 change buffer 红利（如全量行为明细表）。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：只看 Innodb_buffer_pool_reads 绝对值——要与 read_requests 对比算比例，命中率 95% 以下先查是否有周期性全表扫描（GM 报表直连主库是大忌）",
     "坑 2：以为主键用 UUID 没影响——随机主键触发页分裂、二级索引体积翻倍，插入性能可差一个数量级",
     "坑 3：把 innodb_buffer_pool_size 调到物理内存 90% 以上——连接线程、binlog、sort buffer 都要内存，过高直接 OOM 或频繁 swap"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：InnoDB = 内存优先 + 日志兜底 + 页式存储。Buffer Pool 是热的载体，redo log 是持久性底线，自增主键决定写入好坏。先把这张架构图刻进脑子，后面所有主题都在这张图上展开。"
   }
  ]
 },
 {
  "id": "mysql-index-btree",
  "title": "B+ 树索引：聚簇、回表、覆盖索引与最左前缀",
  "layer": 1,
  "depends": [
   "mysql-inno-architecture"
  ],
  "covers": [
   "mysql-06",
   "mysql-10",
   "mysql-26"
  ],
  "quiz": [
   "mysql-06",
   "mysql-26",
   "mysql-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "索引是 B+ 树在磁盘上的工程实现；搞懂聚簇/二级索引、回表、覆盖索引、最左前缀，你才能看懂 explain 并给慢 SQL 对症下药。"
   },
   {
    "t": "pre",
    "items": [
     "B+ 树矮胖：3 层可存千万级记录，一次磁盘 IO 读入大量 key",
     "InnoDB 表本身就是一棵以主键为键的 B+ 树（索引组织表 IOT）",
     "页是 IO 单位，树高 = 定位一条记录的 IO 次数（3 层约 3 次）"
    ]
   },
   {
    "t": "h",
    "text": "聚簇索引与二级索引：叶子节点存什么"
   },
   {
    "t": "p",
    "text": "聚簇索引（主键索引）的叶子节点存整行数据；二级索引（普通/联合/唯一索引）的叶子节点只存『索引列值 + 主键值』。表没有主键时选唯一非空索引，再没有就用隐藏 row_id。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 360\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">聚簇索引与二级索引的叶子节点差异</text><text x=\"60\" y=\"60\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">聚簇索引（主键树）</text><rect x=\"60\" y=\"75\" width=\"60\" height=\"30\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"78\" y=\"94\" font-size=\"13\" fill=\"var(--ink)\">根</text><rect x=\"140\" y=\"130\" width=\"60\" height=\"30\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"155\" y=\"149\" font-size=\"13\" fill=\"var(--ink)\">内节点</text><rect x=\"60\" y=\"200\" width=\"200\" height=\"70\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"75\" y=\"222\" font-size=\"13\" fill=\"var(--ink)\">叶子：主键 + 整行数据</text><text x=\"75\" y=\"242\" font-size=\"12\" fill=\"var(--muted)\">id + nickname + level + diamond...</text><text x=\"75\" y=\"260\" font-size=\"12\" fill=\"var(--muted)\">按主键有序、双向链表相连</text><path d=\"M 90 105 L 150 130\" stroke=\"var(--line)\"/><path d=\"M 90 105 L 90 200\" stroke=\"var(--line)\"/><text x=\"300\" y=\"60\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">二级索引（非主键树）</text><rect x=\"330\" y=\"75\" width=\"60\" height=\"30\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"345\" y=\"94\" font-size=\"13\" fill=\"var(--ink)\">根</text><rect x=\"410\" y=\"130\" width=\"60\" height=\"30\" rx=\"4\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"425\" y=\"149\" font-size=\"13\" fill=\"var(--ink)\">内节点</text><rect x=\"330\" y=\"200\" width=\"230\" height=\"70\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"345\" y=\"222\" font-size=\"13\" fill=\"var(--ink)\">叶子：索引列 + 主键值</text><text x=\"345\" y=\"242\" font-size=\"12\" fill=\"var(--muted)\">(level, player_id)</text><text x=\"345\" y=\"260\" font-size=\"12\" fill=\"var(--muted)\">查非索引列需拿主键回聚簇树</text><path d=\"M 360 105 L 420 130\" stroke=\"var(--line)\"/><path d=\"M 360 105 L 360 200\" stroke=\"var(--line)\"/><path d=\"M 560 235 L 300 235\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 308 230 L 300 235 L 308 240\" fill=\"var(--accent)\"/><text x=\"330\" y=\"310\" font-size=\"13\" fill=\"var(--ink)\">二级索引拿主键 → 回聚簇索引取整行 = 回表</text></svg>",
    "caption": "图 2-1：聚簇索引叶子存整行，二级索引叶子存索引列 + 主键，多一次 B+ 树查找即回表"
   },
   {
    "t": "h",
    "text": "回表与覆盖索引"
   },
   {
    "t": "p",
    "text": "select * 走二级索引时，先找到主键再到聚簇索引取整行，多一次 B+ 树查找，这就是回表。覆盖索引 = select 的列全部在索引里，explain Extra 显示 Using index，索引本身就是数据源，不用回表。"
   },
   {
    "t": "h",
    "text": "联合索引最左前缀"
   },
   {
    "t": "p",
    "text": "联合索引 (a, b, c) 按字典序组织，查询必须从最左列连续匹配；范围条件（>、<、between、like 前缀）之后的列无法用于索引定位（5.6+ 可被索引下推 ICP 在引擎层过滤）。where 书写顺序无关，优化器会重排。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">回表 vs 覆盖索引</text><rect x=\"40\" y=\"50\" width=\"260\" height=\"190\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"58\" y=\"78\" font-size=\"14\" fill=\"var(--lv2)\" font-weight=\"bold\">select * 走二级索引</text><text x=\"58\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\">二级索引叶 → 主键</text><text x=\"58\" y=\"130\" font-size=\"13\" fill=\"var(--ink)\">→ 回聚簇树取整行</text><text x=\"58\" y=\"158\" font-size=\"13\" fill=\"var(--ink)\">B+ 树查找 × 2</text><text x=\"58\" y=\"190\" font-size=\"12\" fill=\"var(--muted)\">Extra: Using where（回表后过滤）</text><text x=\"58\" y=\"216\" font-size=\"12\" fill=\"var(--muted)\">一次查询两次 IO 路径</text><rect x=\"340\" y=\"50\" width=\"260\" height=\"190\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"358\" y=\"78\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">select 覆盖列（覆盖索引）</text><text x=\"358\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\">索引叶即数据源</text><text x=\"358\" y=\"130\" font-size=\"13\" fill=\"var(--ink)\">零回表，直接返回</text><text x=\"358\" y=\"158\" font-size=\"13\" fill=\"var(--ink)\">B+ 树查找 × 1</text><text x=\"358\" y=\"190\" font-size=\"12\" fill=\"var(--muted)\">Extra: Using index（好）</text><text x=\"358\" y=\"216\" font-size=\"12\" fill=\"var(--muted)\">GM 列表页常用：只 select 必要列</text><text x=\"48\" y=\"272\" font-size=\"13\" fill=\"var(--accent)\">ICP（索引下推）补充：范围条件后的列在引擎层先过滤再回表，减少回表次数但消灭不了回表本身</text></svg>",
    "caption": "图 2-2：覆盖索引消灭回表，ICP 减少回表次数"
   },
   {
    "t": "h",
    "text": "索引失效的本质"
   },
   {
    "t": "list",
    "items": [
     "对索引列做函数/运算：where DATE(reg_time)='2024-01-01'——索引存原始值，顺序关系被破坏",
     "隐式类型转换：varchar 列 where phone=13800000000 传数字，列上发生转换等同函数",
     "like '%abc' 前缀模糊：B+ 树前缀有序失效（'abc%' 可以）",
     "违反最左前缀：联合索引 (a,b,c) 只查 b 或 c",
     "范围条件右边的列：a=? and b>? and c=?，c 不走索引定位",
     "or 连接非索引列：整体退化为全表扫（同表两列都有索引时可 index_merge）",
     "!= / not in / is null 看数据分布：优化器评估走索引成本高于全表扫就放弃——这是成本性失效，不是语法失效"
    ]
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- GM 后台按等级查玩家列表，用覆盖索引消除回表\nCREATE INDEX idx_level_player ON player (level, player_id, nickname);\n-- 零回表，Extra = Using index\nEXPLAIN SELECT player_id, nickname FROM player\nWHERE level >= 30 AND level < 40;"
   },
   {
    "t": "p",
    "text": "宽索引代价：为覆盖把很多列塞进索引会放大索引体积、拖慢写入，还会挤占 Buffer Pool——只对高频慢查询建宽索引，别为偶发报表堆索引。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：以为二级索引叶子存行物理地址——InnoDB 存的是主键值，回表靠主键再查聚簇索引",
     "坑 2：以为 where 书写顺序影响索引命中——优化器会重排条件，真正决定命中深度的是每列参与等值还是范围",
     "坑 3：绝对化说 is null、不等于必失效——那是优化器成本评估结果，小表全表扫可能更快，explain 看 possible_keys 有而 key 无即可确认"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：索引有两棵树——聚簇树管数据、二级树管定位；回表是代价，覆盖索引 + ICP 是省钱手段，最左前缀决定树能走多深，索引失效的本质是破坏了有序性或可比性。"
   }
  ]
 },
 {
  "id": "mysql-transaction-mvcc",
  "title": "事务、隔离级别与 MVCC",
  "layer": 1,
  "depends": [
   "mysql-inno-architecture"
  ],
  "covers": [
   "mysql-03",
   "mysql-04",
   "mysql-08",
   "mysql-18",
   "mysql-23"
  ],
  "quiz": [
   "mysql-04",
   "mysql-08",
   "mysql-23"
  ],
  "body": [
   {
    "t": "lead",
    "text": "事务的 ACID 不是口号：A 靠 undo、I 靠锁 + MVCC、D 靠 redo、C 是前三者加业务约束的共同结果；ReadView 与版本链是 MVCC 的灵魂。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握 InnoDB 内存/日志分层架构（本分类节点 1）",
     "区分快照读（普通 select）与当前读（select for update / update / delete）",
     "三种日志分工：redo 循环写、binlog 追加写、undo 记旧值"
    ]
   },
   {
    "t": "h",
    "text": "ACID 的四条机制映射"
   },
   {
    "t": "table",
    "head": [
     "特性",
     "机制",
     "一句话"
    ],
    "rows": [
     [
      "原子性 A",
      "undo log",
      "修改前记旧值，回滚时用 undo 恢复"
     ],
     [
      "持久性 D",
      "redo log（WAL）",
      "提交只保证 redo 落盘，数据页异步刷脏，宕机重放 redo"
     ],
     [
      "隔离性 I",
      "锁 + MVCC",
      "写写互斥靠锁，读写不阻塞靠 MVCC"
     ],
     [
      "一致性 C",
      "A+I+D + 业务约束",
      "数据库保证不了业务一致性，代码里校验余额等约束"
     ]
    ]
   },
   {
    "t": "h",
    "text": "四种隔离级别"
   },
   {
    "t": "p",
    "text": "RU（读未提交）脏读几乎不用；RC（读已提交）解决脏读，不可重复读仍存在；RR（可重复读）是 InnoDB 默认——事务第一次快照读建立 ReadView 后全程复用，配合 next-key lock 在当前读下也防幻读；Serializable 读写都加锁，性能最差几乎不用。"
   },
   {
    "t": "h",
    "text": "MVCC 实现：版本链 + ReadView"
   },
   {
    "t": "p",
    "text": "每行有隐藏列 DB_TRX_ID（最后修改该行的事务 ID）、DB_ROLL_PTR（回滚指针指向 undo 中的旧版本）。一行多次修改形成版本链，最新在头。ReadView 四字段：m_ids（生成时活跃事务列表）、min_trx_id、max_trx_id、creator_trx_id。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">MVCC：undo 版本链 + ReadView 可见性判断</text><text x=\"40\" y=\"60\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">版本链（每行）</text><rect x=\"40\" y=\"75\" width=\"210\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"55\" y=\"98\" font-size=\"13\" fill=\"var(--ink)\">最新版本 trx_id=50</text><text x=\"55\" y=\"114\" font-size=\"12\" fill=\"var(--muted)\">DB_ROLL_PTR ↓ 指向旧版</text><rect x=\"40\" y=\"135\" width=\"210\" height=\"46\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"55\" y=\"158\" font-size=\"13\" fill=\"var(--ink)\">旧版本 trx_id=42</text><text x=\"55\" y=\"174\" font-size=\"12\" fill=\"var(--muted)\">undo log 中串成链</text><rect x=\"40\" y=\"195\" width=\"210\" height=\"46\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"55\" y=\"218\" font-size=\"13\" fill=\"var(--ink)\">更旧版本 trx_id=30</text><text x=\"55\" y=\"234\" font-size=\"12\" fill=\"var(--muted)\">越旧越靠链尾</text><rect x=\"310\" y=\"75\" width=\"290\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"330\" y=\"102\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">ReadView 四字段</text><text x=\"330\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">m_ids：活跃事务列表</text><text x=\"330\" y=\"158\" font-size=\"13\" fill=\"var(--ink)\">min_trx_id：最小活跃 ID</text><text x=\"330\" y=\"184\" font-size=\"13\" fill=\"var(--ink)\">max_trx_id：下个待分配 ID</text><text x=\"330\" y=\"210\" font-size=\"13\" fill=\"var(--ink)\">creator_trx_id：本事务 ID</text><text x=\"330\" y=\"246\" font-size=\"12\" fill=\"var(--muted)\">可见性规则：自己改的可见；</text><text x=\"330\" y=\"264\" font-size=\"12\" fill=\"var(--muted)\">trx_id &lt; min 可见；≥ max 不可见；</text><text x=\"330\" y=\"282\" font-size=\"12\" fill=\"var(--muted)\">中间区间查 m_ids 是否活跃</text><text x=\"48\" y=\"300\" font-size=\"12\" fill=\"var(--muted)\">不可见就沿 roll_pointer 往下找，找不到说明该行对本事务不存在</text></svg>",
    "caption": "图 3-1：ReadView 相当于拍照瞬间的『活跃事务名单』，名单里的修改都当作没看见"
   },
   {
    "t": "h",
    "text": "RC 与 RR 的本质区别"
   },
   {
    "t": "p",
    "text": "ReadView 生成时机不同：RC 每条快照读都新建 ReadView（所以能看到新提交），RR 只在首次快照读建一次并全程复用（所以可重复读）。RC 下 gap lock 基本消失（仅唯一索引冲突检查和外键检查保留），死锁少、并发高，很多大厂推荐 RC。"
   },
   {
    "t": "h",
    "text": "三种日志与两阶段提交"
   },
   {
    "t": "p",
    "text": "redo（引擎层物理日志，崩溃恢复）、undo（引擎层逻辑日志，回滚 + MVCC）、binlog（Server 层逻辑日志，主从复制与归档）。提交时按两阶段：redo 先写 prepare → 写 binlog 并 fsync → redo 追加 commit 标记。崩溃恢复按 xid 查 binlog：binlog 有完整记录则补提交，否则用 undo 回滚——保证主库与 binlog 不分裂。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">两阶段提交：redo 与 binlog 一致</text><rect x=\"40\" y=\"55\" width=\"560\" height=\"205\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><rect x=\"55\" y=\"75\" width=\"170\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"75\" y=\"99\" font-size=\"13\" fill=\"var(--ink)\">① redo 写 prepare（带 xid）</text><path d=\"M 225 95 L 260 95\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 253 91 L 262 95 L 253 99\" fill=\"var(--accent)\"/><rect x=\"265\" y=\"75\" width=\"170\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"285\" y=\"99\" font-size=\"13\" fill=\"var(--ink)\">② 写 binlog 并 fsync</text><path d=\"M 435 95 L 470 95\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 463 91 L 472 95 L 463 99\" fill=\"var(--accent)\"/><rect x=\"475\" y=\"75\" width=\"110\" height=\"40\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"490\" y=\"99\" font-size=\"13\" fill=\"var(--ink)\">③ redo commit</text><text x=\"60\" y=\"150\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">崩溃恢复决策</text><text x=\"60\" y=\"180\" font-size=\"13\" fill=\"var(--ink)\">扫 redo 找 prepare 未 commit 的事务</text><text x=\"60\" y=\"208\" font-size=\"13\" fill=\"var(--ink)\">binlog 有完整记录 → 补提交（从库不丢这条）</text><text x=\"60\" y=\"236\" font-size=\"13\" fill=\"var(--ink)\">binlog 缺失/不完整 → 用 undo 回滚（客户端未收到成功）</text><text x=\"340\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">组提交：多个事务的 binlog 合并一次 fsync，</text><text x=\"340\" y=\"208\" font-size=\"12\" fill=\"var(--muted)\">摊薄每事务 2~3 次 fsync；</text><text x=\"340\" y=\"236\" font-size=\"12\" fill=\"var(--muted)\">双 1（flush=1 + sync_binlog=1）最安全</text></svg>",
    "caption": "图 3-2：prepare 必须在写 binlog 之前，否则『主库说成功、从库查不到』"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 当前读：扣钻石永远读到最新已提交值，两种隔离级别行为一致\nUPDATE player SET diamond = diamond - 100 WHERE player_id = 12345;\n-- 快照读：GM 报表事务内多次查询，RR 下结果一致，RC 下每次可能不同\nSTART TRANSACTION;\nSELECT COUNT(*) FROM player WHERE vip_level >= 5;\nCOMMIT;"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：说 RR 完全杜绝幻读——快照读与当前读混用（先快照查范围再 update 该范围）会破功，看到别人新插入的行",
     "坑 2：ReadView 可见性边界背反——精确记忆：小于 min 可见、大于等于 max 不可见、min 到 max 之间查 m_ids",
     "坑 3：以为 undo 可以无限留——长事务让 purge 线程清不掉它可能看到的旧版本，undo 链膨胀、磁盘上涨，线上查 information_schema.innodb_trx 按 trx_started 排序定位长事务"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：ACID 各有担当；MVCC 是快照读的时光机，ReadView 是活跃名单；两阶段提交让 redo 与 binlog 对同一事务达成一致。游戏服里扣钻石是当前读、GM 报表是快照读，分清它们就能解释绝大多数诡异现象。"
   }
  ]
 },
 {
  "id": "mysql-lock-deadlock",
  "title": "锁机制与死锁：行锁锁索引、间隙锁与死锁排查",
  "layer": 1,
  "depends": [
   "mysql-inno-architecture"
  ],
  "covers": [
   "mysql-09",
   "mysql-15",
   "mysql-35"
  ],
  "quiz": [
   "mysql-09",
   "mysql-15",
   "mysql-35"
  ],
  "body": [
   {
    "t": "lead",
    "text": "InnoDB 行锁锁的是索引记录而不是物理行；间隙锁与 next-key lock 是 RR 下防幻读的机制，也是死锁的高发地——先搞懂『锁在哪』，再谈怎么避免死锁。"
   },
   {
    "t": "pre",
    "items": [
     "行锁锁在索引记录上（依赖索引节点 2 的理解）",
     "RR 默认级别下 next-key lock 是加锁基本单位",
     "只有当前读（select for update / update / delete）加锁，快照读不加锁"
    ]
   },
   {
    "t": "h",
    "text": "为什么说行锁锁的是索引记录"
   },
   {
    "t": "p",
    "text": "update/delete 通过索引定位记录，锁加在索引项上。where 条件没有索引时只能逐行扫描聚簇索引并对每行加 next-key lock——等效锁全表，并发更新全部阻塞，这是生产事故高发点。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- nickname 无索引：全表扫聚簇索引 + 逐行 next-key lock = 锁全表\nUPDATE player SET level = 10 WHERE nickname = '张三';\n-- 正确姿势：update 必须带主键/唯一索引定位\nUPDATE player SET level = 10 WHERE player_id = 10001;\n-- GM 批量改号要 走索引 + 分批，一次几百条，避免大事务持锁过久"
   },
   {
    "t": "h",
    "text": "记录锁、间隙锁、next-key lock"
   },
   {
    "t": "p",
    "text": "记录锁锁单条索引记录；间隙锁锁记录之间的开区间 (a,b)，阻止其他事务往间隙插入；next-key lock 锁左开右闭区间 (a,b]，是 RR 下 InnoDB 加锁的基本单位。唯一索引等值命中会退化为记录锁。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">next-key lock：锁记录也锁间隙（左开右闭）</text><text x=\"40\" y=\"62\" font-size=\"13\" fill=\"var(--ink)\">索引值（如 id 或 level）：</text><rect x=\"40\" y=\"80\" width=\"80\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"64\" y=\"106\" font-size=\"14\" fill=\"var(--ink)\">10</text><rect x=\"120\" y=\"80\" width=\"80\" height=\"46\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"144\" y=\"106\" font-size=\"14\" fill=\"var(--ink)\">20</text><rect x=\"200\" y=\"80\" width=\"80\" height=\"46\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\"/><text x=\"230\" y=\"106\" font-size=\"14\" fill=\"var(--ink)\">30</text><rect x=\"120\" y=\"150\" width=\"80\" height=\"34\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"132\" y=\"172\" font-size=\"12\" fill=\"var(--ink)\">间隙 (10,20)</text><rect x=\"200\" y=\"150\" width=\"80\" height=\"34\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"212\" y=\"172\" font-size=\"12\" fill=\"var(--ink)\">间隙 (20,30)</text><text x=\"40\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">select ... where id=15 for update（未命中）锁 (10,20)，</text><text x=\"40\" y=\"148\" font-size=\"12\" fill=\"var(--muted)\">B 想 insert id=12 被阻塞</text><text x=\"320\" y=\"80\" font-size=\"13\" fill=\"var(--ink)\">退化规则：唯一索引等值命中 →</text><text x=\"320\" y=\"104\" font-size=\"13\" fill=\"var(--ink)\">只加记录锁，不锁间隙；</text><text x=\"320\" y=\"128\" font-size=\"13\" fill=\"var(--ink)\">非唯一索引范围/未命中 → next-key；</text><text x=\"320\" y=\"152\" font-size=\"12\" fill=\"var(--muted)\">RC 下 gap lock 基本消失（仅唯一索引冲突/</text><text x=\"320\" y=\"174\" font-size=\"12\" fill=\"var(--muted)\">外键检查保留），死锁大幅减少</text><text x=\"320\" y=\"216\" font-size=\"12\" fill=\"var(--accent)\">gap lock 之间不互斥：</text><text x=\"320\" y=\"238\" font-size=\"12\" fill=\"var(--accent)\">两个事务可同时持有同一间隙，</text><text x=\"320\" y=\"260\" font-size=\"12\" fill=\"var(--accent)\">随后互插即死锁</text></svg>",
    "caption": "图 4-1：间隙锁阻止插入，gap lock 之间不互斥是死锁的温床"
   },
   {
    "t": "h",
    "text": "经典死锁剧本"
   },
   {
    "t": "p",
    "text": "事务 A、B 同时 select ... where id=15 for update（id 不存在，都锁同一间隙，gap lock 之间不互斥、都成功）→ 各自 insert id=15，需要 insert intention lock，互等对方的间隙锁 → 死锁，MySQL 检测到后回滚一个。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">死锁循环等待</text><rect x=\"60\" y=\"60\" width=\"200\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"105\" y=\"86\" font-size=\"14\" fill=\"var(--ink)\">事务 A</text><text x=\"82\" y=\"108\" font-size=\"12\" fill=\"var(--muted)\">持有间隙 (10,20) 的 gap lock</text><rect x=\"380\" y=\"60\" width=\"200\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"425\" y=\"86\" font-size=\"14\" fill=\"var(--ink)\">事务 B</text><text x=\"402\" y=\"108\" font-size=\"12\" fill=\"var(--muted)\">持有间隙 (10,20) 的 gap lock</text><rect x=\"220\" y=\"160\" width=\"200\" height=\"50\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"255\" y=\"185\" font-size=\"13\" fill=\"var(--ink)\">双方 insert id=15</text><text x=\"245\" y=\"203\" font-size=\"12\" fill=\"var(--muted)\">等对方 gap lock 释放 → 死锁</text><path d=\"M 260 120 L 300 160\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 293 154 L 300 162 L 302 154\" fill=\"var(--accent)\"/><path d=\"M 380 120 L 340 160\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 347 154 L 340 162 L 338 154\" fill=\"var(--accent)\"/><text x=\"60\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">排查：show engine innodb status 看 LATEST DETECTED DEADLOCK，或开 innodb_print_all_deadlocks</text></svg>",
    "caption": "图 4-2：先同持间隙锁再互插 = 循环等待，检测后回滚牺牲者"
   },
   {
    "t": "h",
    "text": "upsert 的死锁：on duplicate key update"
   },
   {
    "t": "p",
    "text": "并发对同一唯一键（如 player_id + item_id）做 on duplicate key update，键不存在时 RR 下先拿 next-key/gap 锁再加 insert intention lock，多事务锁顺序交叉即死锁。游戏服最优解：Disruptor 按 player_id 串行化，同一玩家操作单线程，死锁在架构层消失。"
   },
   {
    "t": "p",
    "text": "replace into 三宗罪：先 delete 再 insert（自增主键跳变、关联表旧 ID 悬空）、触发删除触发器与外键级联、binlog 语义变成 delete + insert 两条（从库和 Canal 看到的语义全变）——背包表禁用。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 跨线程必须并发时的兜底姿势：先 update 后 insert\nint n = jdbc.update(\"UPDATE bag SET count = count + ? \" +\n    \"WHERE player_id = ? AND item_id = ?\", add, pid, itemId);\nif (n == 0) {\n    try {\n        jdbc.update(\"INSERT INTO bag (player_id, item_id, count) VALUES (?, ?, ?)\",\n            pid, itemId, add);\n    } catch (DuplicateKeyException e) {\n        // 撞唯一键，重试 update（此时行已存在）\n        jdbc.update(\"UPDATE bag SET count = count + ? \" +\n            \"WHERE player_id = ? AND item_id = ?\", add, pid, itemId);\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：以为 on duplicate key update 是原子操作就不会死锁——原子不等于无锁竞争，唯一键未命中先拿间隙锁再加 insert intention 才死锁",
     "坑 2：说 InnoDB 存在真正的锁升级——没有，只是锁的记录太多导致内存/性能问题，锁信息在事务的 lock 结构里",
     "坑 3：排查死锁只重启应用——先 show engine innodb status 看死锁日志签名，如 lock mode X locks gap before rec insert intention waiting"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：锁是挂在索引记录上的门牌，没有索引只能全楼贴封条；gap lock 不互斥、insert intention 互等是死锁的温床，on duplicate 在 RR 下最危险。游戏服的答案永远是：能串行化就串行化，DB 锁只做兜底。"
   }
  ]
 },
 {
  "id": "mysql-three-logs",
  "title": "三日志体系：binlog / redo log / undo log 全解剖",
  "layer": 1,
  "depends": [
   "mysql-transaction-mvcc"
  ],
  "covers": [
   "mysql-03",
   "mysql-18",
   "mysql-23"
  ],
  "quiz": [
   "mysql-18"
  ],
  "body": [
   {
    "t": "lead",
    "text": "redo log 保持久、undo log 保回滚与 MVCC、binlog 保复制与归档——三种日志各司其职，又在提交时『两阶段牵手』，是解释崩溃恢复、主从一致、游戏服数据安全的万能钥匙。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握事务 ACID 与 MVCC（mysql-transaction-mvcc）",
     "区分 Server 层（binlog）与 InnoDB 引擎层（redo / undo）的边界",
     "理解 fsync 落盘是持久性的唯一保证"
    ]
   },
   {
    "t": "h",
    "text": "一、三种日志一张表分清楚"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "redo log",
     "undo log",
     "binlog"
    ],
    "rows": [
     [
      "所属层",
      "InnoDB 引擎层",
      "InnoDB 引擎层",
      "Server 层"
     ],
     [
      "记录内容",
      "物理：某页某偏移改成什么",
      "逻辑：修改前的旧值",
      "逻辑：行变更或完整 SQL"
     ],
     [
      "写入方式",
      "固定大小文件循环写",
      "回滚段分段存储",
      "追加写，可归档"
     ],
     [
      "核心用途",
      "崩溃恢复（WAL 持久化）",
      "事务回滚 + MVCC 版本链",
      "主从复制 + 时间点恢复"
     ],
     [
      "崩溃后角色",
      "重放 redo 恢复数据页",
      "配合 undo 回滚未提交事务",
      "与 redo 两阶段比对定提交"
     ]
    ]
   },
   {
    "t": "h",
    "text": "二、redo log：顺序写换来的持久性"
   },
   {
    "t": "p",
    "text": "数据页刷盘是随机 IO，如果每次提交都刷数据页，写性能会被 IO 打爆。WAL（Write-Ahead Logging）把『先写 redo（顺序追加）』作为提交成功的标准，数据页由后台线程异步刷脏。innodb_flush_log_at_trx_commit 三个取值：1 = 每次提交都 fsync（最安全，默认，『双 1』中的一半）；0 = 每秒才刷一次（宕机最多丢 1 秒）；2 = 只写 OS cache（MySQL 进程崩不丢，OS 崩溃丢）。redo log 固定大小循环写，靠 checkpoint 记录已刷脏的位点，磁盘空间不足时强制刷脏推进 checkpoint。"
   },
   {
    "t": "h",
    "text": "三、undo log：后悔药与时光机"
   },
   {
    "t": "p",
    "text": "修改一行前先写 undo 记录旧值：回滚时把旧值写回；MVCC 快照读沿 DB_ROLL_PTR 顺着 undo 链找历史版本。purge 线程负责清理『没有任何活跃事务需要』的旧版本——长事务会让 purge 受阻、undo 链膨胀、磁盘上涨。undo 分两类：insert undo（仅回滚用，可尽快 purge）与 update undo（回滚 + MVCC 都要用）。8.0 把 undo 从系统表空间拆到独立 undo 表空间，支持自动截断。"
   },
   {
    "t": "h",
    "text": "四、binlog：Server 层的黑匣子"
   },
   {
    "t": "p",
    "text": "binlog 记录『数据怎么变的』，与存储引擎无关，用于主从复制、Canal 等 CDC、时间点恢复。三种格式：STATEMENT 记 SQL 原文，体积小，但同一 SQL 在从库重放可能结果不同（now()、limit、不确定函数），主从不一致风险高；ROW 记每一行的 before/after 镜像，最安全，但体积大——大批量 update 会记录每一行，主流选择，游戏服必选；MIXED 默认，普通语句走 STATEMENT、涉及不确定函数自动切 ROW，仍有隐式不一致风险，生产更推荐固定 ROW。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">三日志分工：保持久、保回滚、保复制</text><rect x=\"30\" y=\"42\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"52\" y=\"70\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">redo log</text><text x=\"48\" y=\"96\" font-size=\"13\" fill=\"var(--ink)\">引擎层 · 物理日志</text><text x=\"48\" y=\"120\" font-size=\"13\" fill=\"var(--ink)\">固定大小循环写</text><text x=\"48\" y=\"144\" font-size=\"12\" fill=\"var(--muted)\">WAL 持久 + 崩溃恢复</text><rect x=\"230\" y=\"42\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"252\" y=\"70\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">undo log</text><text x=\"248\" y=\"96\" font-size=\"13\" fill=\"var(--ink)\">引擎层 · 逻辑日志</text><text x=\"248\" y=\"120\" font-size=\"13\" fill=\"var(--ink)\">记录修改前旧值</text><text x=\"248\" y=\"144\" font-size=\"12\" fill=\"var(--muted)\">回滚 + MVCC 版本链</text><rect x=\"430\" y=\"42\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"452\" y=\"70\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">binlog</text><text x=\"448\" y=\"96\" font-size=\"13\" fill=\"var(--ink)\">Server 层 · 逻辑日志</text><text x=\"448\" y=\"120\" font-size=\"13\" fill=\"var(--ink)\">追加写可归档</text><text x=\"448\" y=\"144\" font-size=\"12\" fill=\"var(--muted)\">主从复制 + CDC + PITR</text><text x=\"32\" y=\"200\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">提交时两阶段牵手（保证 redo 与 binlog 对同一事务一致）</text><rect x=\"32\" y=\"216\" width=\"170\" height=\"34\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"52\" y=\"238\" font-size=\"13\" fill=\"var(--ink)\">① redo 写 prepare</text><path d=\"M 202 233 L 240 233\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 233 229 L 242 233 L 233 237\" fill=\"var(--accent)\"/><rect x=\"244\" y=\"216\" width=\"170\" height=\"34\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"264\" y=\"238\" font-size=\"13\" fill=\"var(--ink)\">② 写 binlog 并 fsync</text><path d=\"M 414 233 L 452 233\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 445 229 L 454 233 L 445 237\" fill=\"var(--accent)\"/><rect x=\"456\" y=\"216\" width=\"150\" height=\"34\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"476\" y=\"238\" font-size=\"13\" fill=\"var(--ink)\">③ redo 写 commit</text><text x=\"32\" y=\"278\" font-size=\"12\" fill=\"var(--muted)\">双 1 = innodb_flush_log_at_trx_commit=1 + sync_binlog=1，玩家资产库必须；日志服可放宽换吞吐</text></svg>",
    "caption": "图 2-1：三日志职责分工与提交时的两阶段协作"
   },
   {
    "t": "h",
    "text": "五、两阶段提交：redo 与 binlog 的一致性问题"
   },
   {
    "t": "p",
    "text": "如果不做两阶段：先写 binlog 再提交引擎，或先提交 redo 再写 binlog，崩溃时都可能出现『主库提交了、binlog 没记录』——从库和 Canal 就永远缺这条数据。两阶段提交（2PC）流程：事务执行中 redo 持续写；提交时先把 redo 标记为 prepare 状态（带上 xid）并 fsync；然后 Server 层写 binlog 并 fsync；成功后给 redo 追加 commit 标记——commit 这步可以不 fsync，因为 prepare + binlog 已足够判定提交。崩溃恢复决策：扫 redo 找 prepare 未 commit 的事务，按 xid 去 binlog 查——binlog 有完整记录则补提交（从库不丢这条），没有则用 undo 回滚（客户端本来也没收到成功）。"
   },
   {
    "t": "p",
    "text": "binlog 写入分两步：write（写进 page cache）与 fsync（落盘）。事务的 binlog 先缓存在线程的 binlog cache，超过 binlog_cache_size（默认 32KB）会落临时文件，超大事务要警惕临时文件撑爆磁盘。组提交把 fsync 合并，但 write 到 page cache 这步本身很快，真正贵的是 fsync——这也是 flush=2（只写 OS cache）比 flush=1 快一大截的原因，代价是 OS 崩溃时丢数据。另一个常被忽视的点：binlog 的写入顺序就是事务提交顺序，也就是从库重放与 Canal 消费的顺序——binlog 天然是游戏服『变更事件流』的权威来源。订阅 binlog 比业务自己发 MQ 更可靠，但 binlog 只含数据变更、不含业务上下文（请求 ID、来源渠道），需要业务把这些字段冗余进表里，这是设计 CDC 消费端时最容易漏掉的细节。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">崩溃恢复决策树：prepare 未 commit 的事务怎么处理</text><rect x=\"180\" y=\"44\" width=\"280\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"205\" y=\"68\" font-size=\"13\" fill=\"var(--ink)\">实例崩溃</text><text x=\"205\" y=\"88\" font-size=\"12\" fill=\"var(--muted)\">扫 redo 找出 prepare 未 commit 的事务</text><path d=\"M 320 96 L 320 118\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 315 112 L 320 122 L 325 112\" fill=\"var(--accent)\"/><rect x=\"140\" y=\"122\" width=\"360\" height=\"40\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"172\" y=\"146\" font-size=\"13\" fill=\"var(--ink)\">按 xid 查 binlog：该事务的记录是否完整？</text><path d=\"M 230 162 L 200 190\" stroke=\"var(--lv1)\" stroke-width=\"2\"/><path d=\"M 205 184 L 198 192 L 206 194\" fill=\"var(--lv1)\"/><text x=\"160\" y=\"180\" font-size=\"12\" fill=\"var(--lv1)\">是</text><path d=\"M 410 162 L 440 190\" stroke=\"var(--lv3)\" stroke-width=\"2\"/><path d=\"M 434 184 L 442 192 L 434 194\" fill=\"var(--lv3)\"/><text x=\"428\" y=\"180\" font-size=\"12\" fill=\"var(--lv3)\">否</text><rect x=\"70\" y=\"198\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"92\" y=\"222\" font-size=\"13\" fill=\"var(--ink)\">补提交（binlog 已完整）</text><text x=\"92\" y=\"242\" font-size=\"12\" fill=\"var(--muted)\">从库/CDC 不丢这条事务</text><rect x=\"330\" y=\"198\" width=\"250\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"352\" y=\"222\" font-size=\"13\" fill=\"var(--ink)\">用 undo 回滚</text><text x=\"352\" y=\"242\" font-size=\"12\" fill=\"var(--muted)\">客户端未收到成功，回滚是安全的</text></svg>",
    "caption": "图 2-2：崩溃恢复按 xid 查 binlog 决定补提交或回滚，这是『主库说成功、从库查不到』的根治逻辑"
   },
   {
    "t": "h",
    "text": "六、组提交：把 fsync 摊薄"
   },
   {
    "t": "p",
    "text": "每个事务提交理论上要 2~3 次 fsync（redo prepare、binlog、redo commit），而 fsync 是昂贵系统调用。组提交（group commit）把窗口期内的多个事务合并成一批：redo 侧 leader/follower 机制、binlog 侧 binlog_group_commit_sync_delay 与 sync_no_delay_count，让 N 个事务只做 1 次 fsync，吞吐大幅提升。代价是单个事务提交延迟变长（最多等一个 batch 窗口），适合高吞吐的日志写入场景。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 查看关键参数\nSHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';\nSHOW VARIABLES LIKE 'sync_binlog';\nSHOW VARIABLES LIKE 'binlog_format';\n-- 游戏服最佳实践：\n-- 玩家资产库：双 1 + ROW（SET GLOBAL innodb_flush_log_at_trx_commit=1; SET GLOBAL sync_binlog=1;）\n-- 日志服放宽换吞吐：flush=2 + sync_binlog=0/1000"
   },
   {
    "t": "h",
    "text": "七、游戏服数据一致性保障"
   },
   {
    "t": "list",
    "items": [
     "购买服/玩家资产库：双 1（flush=1 + sync_binlog=1）+ binlog_format=ROW，一条充值流水都不能丢",
     "日志服/行为库：flush=2 + sync_binlog=1000，丢一秒可接受，换 3~5 倍写入吞吐",
     "主从必须 ROW：STATEMENT 格式在游戏服的 now()/自增/limit 等场景易主从不一致",
     "Canal 等 CDC 也依赖 ROW：解析需要 before/after 镜像，STATEMENT 无法还原行变更"
    ]
   },
   {
    "t": "h",
    "text": "八、从日志角度理解游戏服写入路径"
   },
   {
    "t": "p",
    "text": "游戏服的高频写（扣钻石、加经验、背包变更）本质是『改内存页 + 写 redo + 写 binlog』三条流水线：改内存页瞬时完成；redo 顺序写、靠组提交摊薄 fsync；binlog 由 Server 层追加写，供给主从与 CDC。因此单条 update 的延迟主要由 fsync 次数决定——双 1 下每事务 2~3 次 fsync，配合 Disruptor 按 player_id 串行化攒批（一个逻辑操作一个事务），能把 fsync 次数压到最低。这也是『同一玩家的多次小更新合并成一次事务』能显著提吞吐的底层原因：省的是 fsync 次数，不是 SQL 执行本身。反过来，长事务会让 redo 与 binlog 缓存持续占用、undo 链膨胀、purge 受阻——长事务是三种日志共同的敌人，游戏服的玩家操作事务必须控制在毫秒级提交。redo log 的大小设置也有讲究：innodb_log_file_size 太小会导致高频 checkpoint 强制刷脏、写放大；太大则崩溃恢复时间变长。经验值：让 redo 能容纳高峰一小时的写入量，游戏开服与活动秒开瞬间的写入洪峰尤其要预留——只调大 Buffer Pool 却不同步评估 redo，写洪峰一来 checkpoint 疯狂追刷、磁盘 IO 打满，是『内存够大但写不快』的经典症状。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：说 redo 是逻辑日志、binlog 是物理日志——正好说反，redo 记物理页变更、binlog 记逻辑变更",
     "坑 2：以为两阶段提交是为了事务原子性——它解决的是 redo 与 binlog 两份日志提交状态一致，防止主从/CDC 缺数据",
     "坑 3：把 redo commit 阶段必须 fsync 当铁律——prepare + binlog 已足够判定提交，commit 只是收尾标记",
     "坑 4：日志服也用双 1——参数要按数据价值分层配置，玩家资产与行为日志的价值不同"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：三日志各管一段——redo 管『物理上别丢』、undo 管『逻辑上能退』、binlog 管『别人也知道』；提交时 redo 先 prepare、binlog 落盘、redo 再 commit 的两阶段，是崩溃恢复决策的依据；组提交把 fsync 摊薄。游戏服按数据价值分层配 flush/sync 参数，是老兵的分水岭。"
   }
  ]
 },
 {
  "id": "mysql-index-failure-checklist",
  "title": "索引失效与 SQL 规范防坑清单",
  "layer": 1,
  "depends": [
   "mysql-index-btree"
  ],
  "covers": [
   "mysql-10",
   "mysql-06"
  ],
  "quiz": [
   "mysql-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "把索引失效场景和 SQL 规范整理成一张防坑清单：每条坑背后都是『有序性或可比性被破坏』这一个本质，规范与 CodeReview 则是把坑挡在上线之前。"
   },
   {
    "t": "pre",
    "items": [
     "聚簇/二级索引与最左前缀（mysql-index-btree）",
     "explain 四看与优化器成本性放弃（mysql-slow-sql）",
     "意识到：大部分失效写法能被 CodeReview 提前拦下"
    ]
   },
   {
    "t": "h",
    "text": "一、失效的本质只有两条"
   },
   {
    "t": "p",
    "text": "索引失效归结为两个根因：一是破坏了索引的有序性/可比性——函数包裹、类型转换、左模糊、违反最左前缀，优化器无法按序定位；二是走索引成本高于全表扫——低区分度、范围太大、回表过多，优化器『主动放弃』。前者是写法问题，后者是成本问题。排查时先用 explain 区分：possible_keys 有而 key 无 = 成本性放弃；possible_keys 都没有 = 写法已让索引不可用。"
   },
   {
    "t": "h",
    "text": "二、八大失效场景逐个拆"
   },
   {
    "t": "list",
    "items": [
     "函数包裹：where DATE(reg_time)='2026-08-01'——索引存原始时间戳，函数后顺序关系破坏；改写为范围条件 reg_time >= '2026-08-01' AND reg_time < '2026-08-02'",
     "隐式类型转换：phone 是 varchar，where phone=13800000000 传数字——列上发生隐式转换等同函数；JOIN 两表字段类型不一致是最隐蔽的一种",
     "like 左模糊：like '%王者%' 前缀不可序；like '王者%' 可以。GM 昵称模糊搜走 ES 或冗余倒排字段",
     "违反最左前缀：联合索引 (a,b,c) 只查 b 或 c；范围条件之后的列——a=? and b>? and c=?，c 走不到定位",
     "or 连接非索引列：where a=? or b=? 且 b 无索引——整体退化为全表扫（两列都有索引才可能 index_merge）",
     "not in / not exists / is null：多数情况成本性放弃，但不绝对——小表全表扫可能更快，用 explain 验证再下结论",
     "字符集/collation 不一致：两表字段 utf8mb4 与 latin1 join，索引失效且结果可能错乱",
     "代价估算偏差：低区分度（status、sex）+ 大量回表大于全表扫——加覆盖索引或换查询方式"
    ]
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 建索引的玩家表\nCREATE INDEX idx_reg_time ON player(reg_time);\nCREATE INDEX idx_phone ON player(phone);\n\n-- 失效写法 → 正确写法\nSELECT * FROM player WHERE DATE(reg_time) = '2026-08-01';  -- 失效\nSELECT * FROM player WHERE reg_time >= '2026-08-01' AND reg_time < '2026-08-02';  -- 生效\nSELECT * FROM player WHERE phone = 13800000000;           -- 失效（隐式转换）\nSELECT * FROM player WHERE phone = '13800000000';         -- 生效\nSELECT * FROM player WHERE nickname LIKE '%王者%';        -- 失效\nSELECT * FROM player WHERE nickname LIKE '王者%';         -- 生效"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">八大失效场景清单</text><rect x=\"30\" y=\"40\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"44\" y=\"62\" font-size=\"13\" fill=\"var(--ink)\">① 函数包裹</text><text x=\"44\" y=\"82\" font-size=\"12\" fill=\"var(--muted)\">DATE(col) 顺序破坏</text><rect x=\"227\" y=\"40\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"241\" y=\"62\" font-size=\"13\" fill=\"var(--ink)\">② 隐式类型转换</text><text x=\"241\" y=\"82\" font-size=\"12\" fill=\"var(--muted)\">列上转换等同函数</text><rect x=\"424\" y=\"40\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"438\" y=\"62\" font-size=\"13\" fill=\"var(--ink)\">③ like 左模糊</text><text x=\"438\" y=\"82\" font-size=\"12\" fill=\"var(--muted)\">前缀不可序</text><rect x=\"30\" y=\"102\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"44\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">④ 违反最左前缀</text><text x=\"44\" y=\"144\" font-size=\"12\" fill=\"var(--muted)\">跳列 / 范围后列截断</text><rect x=\"227\" y=\"102\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"241\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">⑤ or 连接非索引列</text><text x=\"241\" y=\"144\" font-size=\"12\" fill=\"var(--muted)\">整体退化全表扫</text><rect x=\"424\" y=\"102\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"438\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">⑥ not in / != / is null</text><text x=\"438\" y=\"144\" font-size=\"12\" fill=\"var(--muted)\">成本性放弃，看分布</text><rect x=\"30\" y=\"164\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"44\" y=\"186\" font-size=\"13\" fill=\"var(--ink)\">⑦ 字符集/collation 不一致</text><text x=\"44\" y=\"206\" font-size=\"12\" fill=\"var(--muted)\">join 索引失效</text><rect x=\"227\" y=\"164\" width=\"185\" height=\"52\" rx=\"6\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"241\" y=\"186\" font-size=\"13\" fill=\"var(--ink)\">⑧ 成本估算偏差</text><text x=\"241\" y=\"206\" font-size=\"12\" fill=\"var(--muted)\">低区分度大量回表</text><text x=\"30\" y=\"246\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">本质只有两条</text><text x=\"30\" y=\"272\" font-size=\"13\" fill=\"var(--ink)\">有序性/可比性被破坏（写法问题，possible_keys 都无）</text><text x=\"30\" y=\"296\" font-size=\"13\" fill=\"var(--ink)\">走索引成本高于全表扫（成本问题，possible_keys 有而 key 无）</text></svg>",
    "caption": "图 8-1：八大失效场景，前三类多为写法问题、后两类偏成本性放弃，explain 区分"
   },
   {
    "t": "h",
    "text": "三、优化器选择偏差与验证"
   },
   {
    "t": "p",
    "text": "加了索引不走，先 explain 看 possible_keys 与 key；再 analyze table 刷新统计信息；仍不对再看 optimizer_trace 的成本估算，判断是数据分布问题（加直方图 ANALYZE TABLE ... UPDATE HISTOGRAM）还是估算偏差（analyze）。force index 能解一时，但数据分布变化后会把错误计划固化，是最后手段。验证铁律：改造前后 explain 对比 type / key / rows / Extra 四项，确认真的变化再上线。"
   },
   {
    "t": "p",
    "text": "成本性放弃可以量化估算，避免拍脑袋：走二级索引的总成本约等于『回表次数 × 单次回表 IO』，其中回表次数 ≈ 区分度 × 表行数；全表扫成本约等于『表占用的页数 × 顺序读 IO』。举例：1000 万行玩家表，status 列只有 0/1 两值，区分度约 50%，走索引要回表 500 万次（每次随机 IO 约 0.1ms，合计约 500 秒），而全表顺序扫 1000 万行可能只要几秒——优化器当然选全表扫。反过来，player_id 等值命中只回表 1 次，索引优势巨大。这就是『区分度决定一切』的量化来源。"
   },
   {
    "t": "h",
    "text": "四、SQL 规范与 CodeReview 检查点"
   },
   {
    "t": "list",
    "items": [
     "更新删除必须走主键/唯一索引等值条件——update/delete 无索引条件会锁全表，生产事故高发",
     "禁止 select *；select 只取必要列（配合覆盖索引消除回表）",
     "禁止对索引列做函数/运算/隐式类型转换；参数绑定用 PreparedStatement，天然防 SQL 注入并保类型",
     "join 字段类型/字符集/collation 必须一致；在线库禁止大表 join 大表",
     "深分页一律游标分页；大表 count 走汇总表或近似值",
     "批量写入 500~1000 条一个事务；日志表按天分表、无二级索引、自增主键顺序写",
     "like 左模糊、not in、or 非索引列一律打回重写",
     "每张表 DDL 必检：自增（或趋势递增）主键、业务唯一键、联合索引符合查询模式的最左前缀"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// CodeReview 检查点（挂在 MR 静态检查 + 人工评审）\n// 1. SQL 正则扫描（可进 CI）：\n//    SELECT\\s+\\*                          → 打回：显式列\n//    WHERE\\s+\\w+\\s*LIKE\\s*'%               → 打回：左模糊\n//    DATE\\(|NOW\\(\\)|\\+1 包裹索引列          → 打回：函数包裹\n//    UPDATE\\s+\\w+\\s+SET\\s+[^W]+WHERE\\s+\\w+\\s*=\\s*\\?  → 强制主键等值\n// 2. 人工检查点：\n//    - explain 结果贴 MR 评论区（type >= range、无 filesort/temporary）\n//    - 新表 DDL 审核：主键/唯一键/索引是否对齐查询模式\n//    - 批量删除/更新是否带 limit + sleep 限速"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">SQL 防坑落地：从规范到 CodeReview 闭环</text><rect x=\"30\" y=\"44\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"52\" y=\"72\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">SQL/Mapper</text><text x=\"45\" y=\"94\" font-size=\"12\" fill=\"var(--muted)\">提交 MR</text><path d=\"M 160 79 L 200 79\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 193 75 L 203 79 L 193 83\" fill=\"var(--accent)\"/><rect x=\"205\" y=\"44\" width=\"170\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"222\" y=\"72\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">CI 正则扫描</text><text x=\"222\" y=\"94\" font-size=\"12\" fill=\"var(--muted)\">select * / 左模糊 / 函数包裹</text><path d=\"M 375 79 L 415 79\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 408 75 L 418 79 L 408 83\" fill=\"var(--accent)\"/><rect x=\"420\" y=\"44\" width=\"190\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"438\" y=\"72\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">explain 评审</text><text x=\"438\" y=\"94\" font-size=\"12\" fill=\"var(--muted)\">type ≥ range、无 filesort/temporary</text><path d=\"M 510 114 L 510 134\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 505 128 L 510 138 L 515 128\" fill=\"var(--accent)\"/><rect x=\"330\" y=\"138\" width=\"290\" height=\"46\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"352\" y=\"162\" font-size=\"13\" fill=\"var(--ink)\">上线前 explain 基线存档，防计划回退</text><text x=\"352\" y=\"178\" font-size=\"12\" fill=\"var(--muted)\">事后：事故复盘 → 回填清单 → 更新扫描规则</text><text x=\"30\" y=\"238\" font-size=\"12\" fill=\"var(--muted)\">把个人经验沉淀成 CI 规则与评审模板，才能把索引坑挡在上线前</text></svg>",
    "caption": "图 8-2：CI 扫描 + explain 评审 + 基线存档 + 复盘回填，形成防坑闭环"
   },
   {
    "t": "h",
    "text": "五、落地：从清单到团队习惯"
   },
   {
    "t": "p",
    "text": "规范不落地等于零：SQL 审查进 CI（慢 SQL 模板扫描）、explain 基线进发布流程、新人 onboarding 跑一遍失效清单、事故复盘回填清单——把『个人经验』变成『团队检查点』，才能把索引坑挡在上线前。10 年老兵的价值不在于背熟八个坑，而在于把这八个坑固化成团队默认不犯。"
   },
   {
    "t": "p",
    "text": "还要给规范定优先级：写库语句（update/delete）的走索引要求最高——锁全表直接伤在线可用性；高频读查询次之——走索引保证延迟；低频报表最低——可接受全表扫走从库。按这条优先级排 CodeReview 的审查顺序：先审所有 update/delete 是否带主键/唯一索引等值条件，再审高频 select 的 explain，最后才轮到报表类 SQL。规范写得再全，评审顺序错了依然会漏掉最致命的那类。"
   },
   {
    "t": "h",
    "text": "六、反例/正例对照表（CodeReview 速查）"
   },
   {
    "t": "table",
    "head": [
     "反例",
     "问题",
     "正例"
    ],
    "rows": [
     [
      "where DATE(reg_time)='2026-08-01'",
      "函数包裹索引列",
      "reg_time >= ... AND reg_time < ..."
     ],
     [
      "where phone=13800000000",
      "隐式类型转换",
      "where phone='13800000000'"
     ],
     [
      "where nickname like '%张%'",
      "左模糊",
      "like '张%' 或走 ES"
     ],
     [
      "select * from player",
      "回表 + 传输浪费",
      "select 必要列"
     ],
     [
      "update player set ... where nickname=?",
      "无索引条件锁全表",
      "where player_id=?（主键等值）"
     ],
     [
      "order by create_time desc 全表扫描",
      "无索引排序",
      "建 (create_time) 索引或游标"
     ]
    ]
   },
   {
    "t": "p",
    "text": "这张表直接进团队 SQL 评审模板：评审时把新 SQL 逐条对照，命中反例直接打回。注意对照的终极判据永远是 explain——任何『看起来没问题』的 SQL 都要用 type ≥ range 且无 filesort 过一遍，规则是兜底，explain 是裁判。最后的团队纪律：任何 SQL 变更必须提交 explain 结果才能合并——『无 explain 不合并』这条纪律比十条规范都有效，它强制每个改动都过优化器这一关，也让新人从第一天就开始读执行计划、把索引思维变成肌肉记忆。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：is null / not in 一律背『必失效』——它是成本性选择，小表全表扫可能更快，用 explain 说话",
     "坑 2：只改 SQL 不加索引 / 只加索引不改 SQL——联合索引要与查询模式对齐，先看最左前缀再动手",
     "坑 3：参数化 SQL 用 concat 拼字符串——既 SQL 注入又类型转换，PreparedStatement 一次解决",
     "坑 4：CodeReview 只看逻辑不看执行计划——SQL 类变更必须带 explain 结果进评审"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：索引失效的本质是有序性/可比性被破坏或成本上不划算；八大场景 + 成本性放弃 + 优化器验证构成完整排查闭环；规范与 CodeReview 把 90% 的坑挡在上线前——把清单沉淀成 CI 规则与评审模板，是 10 年老兵该有的工程习惯。"
   }
  ]
 },
 {
  "id": "mysql-slow-sql",
  "title": "慢 SQL 诊断与优化：explain、filesort、count、join",
  "layer": 2,
  "depends": [
   "mysql-index-btree",
   "mysql-transaction-mvcc"
  ],
  "covers": [
   "mysql-05",
   "mysql-12",
   "mysql-27",
   "mysql-28",
   "mysql-29",
   "mysql-11"
  ],
  "quiz": [
   "mysql-05",
   "mysql-12",
   "mysql-28"
  ],
  "body": [
   {
    "t": "lead",
    "text": "慢 SQL 治理是漏斗：慢日志定位 → explain 四看诊断 → 索引/改写/架构三层优化；统计类需求别在在线库硬刚。"
   },
   {
    "t": "pre",
    "items": [
     "explain 的 type/key/rows/Extra 是诊断语言（来自索引节点 2）",
     "事务与 MVCC 知识用于理解锁与隔离对慢 SQL 的影响",
     "GM 后台/BI 场景的读多写少、离线容忍是架构降级的依据"
    ]
   },
   {
    "t": "h",
    "text": "第一步：定位——慢日志 + explain analyze"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "SET GLOBAL slow_query_log = ON;\nSET GLOBAL long_query_time = 1;   -- 超过 1 秒记录\n-- 8.0 可直接看真实执行耗时\nEXPLAIN ANALYZE SELECT * FROM player WHERE reg_time > '2024-01-01';"
   },
   {
    "t": "h",
    "text": "第二步：explain 四看"
   },
   {
    "t": "list",
    "items": [
     "type：system > const > eq_ref > ref > range > index > ALL，日常至少 range，杜绝 ALL；index 是全索引扫描，不算达标",
     "key：实际用的索引，NULL 说明没走；possible_keys 有而 key 无 = 优化器成本性放弃",
     "rows：估算扫描行数，越大越危险",
     "Extra：Using index=覆盖（好）；Using index condition=ICP；Using filesort=额外排序；Using temporary=临时表；Using where=回表后过滤"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">慢 SQL 排查漏斗</text><rect x=\"220\" y=\"48\" width=\"200\" height=\"44\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"258\" y=\"74\" font-size=\"14\" fill=\"var(--ink)\">慢日志 / performance_schema</text><path d=\"M 320 92 L 320 112\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 315 106 L 320 116 L 325 106\" fill=\"var(--accent)\"/><rect x=\"120\" y=\"120\" width=\"400\" height=\"44\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"150\" y=\"146\" font-size=\"14\" fill=\"var(--ink)\">explain 四看：type · key · rows · Extra</text><path d=\"M 320 164 L 320 184\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 315 178 L 320 188 L 325 178\" fill=\"var(--accent)\"/><rect x=\"40\" y=\"192\" width=\"170\" height=\"56\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"60\" y=\"216\" font-size=\"13\" fill=\"var(--ink)\">① 索引优化</text><text x=\"60\" y=\"236\" font-size=\"12\" fill=\"var(--muted)\">按 where+order by 建联合索引</text><rect x=\"235\" y=\"192\" width=\"170\" height=\"56\" rx=\"8\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"260\" y=\"216\" font-size=\"13\" fill=\"var(--ink)\">② SQL 改写</text><text x=\"255\" y=\"236\" font-size=\"12\" fill=\"var(--muted)\">深分页游标 / count 汇总</text><rect x=\"430\" y=\"192\" width=\"170\" height=\"56\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"455\" y=\"216\" font-size=\"13\" fill=\"var(--ink)\">③ 架构降级</text><text x=\"450\" y=\"236\" font-size=\"12\" fill=\"var(--muted)\">从库 / 汇总表 / OLAP</text><text x=\"48\" y=\"280\" font-size=\"13\" fill=\"var(--ink)\">统计类需求：预聚合 daily_stat 汇总表，报表只查汇总表</text><text x=\"48\" y=\"304\" font-size=\"12\" fill=\"var(--muted)\">兜底：kill 大查询、max_execution_time 限制单 SQL 超时，别拖垮在线库</text></svg>",
    "caption": "图 5-1：先定位再诊断，索引只是三层优化之一，统计需求挪出在线库才是架构意识"
   },
   {
    "t": "h",
    "text": "第三步：SQL 改写三板斧"
   },
   {
    "t": "list",
    "items": [
     "深分页：limit 1000000,20 要扫并排序前 100 万行再丢弃，改游标 where id > last_id order by id limit 20 直接索引定位 O(logN)，代价是不能跳页",
     "count(*)：千万级用近似值（show table status）/ 预聚合汇总表 / Redis 计数器；count(*)≈count(1) 最快，count(主键) 次之，count(字段) 逐行判 NULL 最慢",
     "大表 join：被驱动表必须走索引；join_buffer 装不下驱动表时分块，被驱动表按块数重复全表扫，是灾难"
    ]
   },
   {
    "t": "h",
    "text": "join 三代算法"
   },
   {
    "t": "p",
    "text": "NLJ（Index Nested-Loop）：被驱动表 join 字段有索引，驱动表每行查一次，小表驱动大表最优；BNL（Block Nested-Loop）：无索引时用 join_buffer 批量比对，把扫表次数从 N 降到 1；hash join（8.0.18+）：无索引等值 join 对小表建哈希表、大表逐行探测，是 BNL 场景的正解。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">join 三代算法</text><rect x=\"30\" y=\"48\" width=\"180\" height=\"190\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"55\" y=\"76\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">NLJ（有索引）</text><text x=\"50\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\">驱动表每行</text><text x=\"50\" y=\"130\" font-size=\"13\" fill=\"var(--ink)\">去被驱动表索引查</text><text x=\"50\" y=\"158\" font-size=\"13\" fill=\"var(--ink)\">一对一，效率最高</text><text x=\"50\" y=\"200\" font-size=\"12\" fill=\"var(--muted)\">小表驱动大表</text><text x=\"50\" y=\"220\" font-size=\"12\" fill=\"var(--muted)\">被驱动表必有索引</text><rect x=\"230\" y=\"48\" width=\"180\" height=\"190\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"252\" y=\"76\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">BNL（无索引）</text><text x=\"250\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\">join_buffer 装驱动表</text><text x=\"250\" y=\"130\" font-size=\"13\" fill=\"var(--ink)\">被驱动表全表扫一次</text><text x=\"250\" y=\"158\" font-size=\"13\" fill=\"var(--ink)\">buffer 满了分块重扫</text><text x=\"250\" y=\"200\" font-size=\"12\" fill=\"var(--muted)\">Extra: Using join buffer</text><text x=\"250\" y=\"220\" font-size=\"12\" fill=\"var(--muted)\">5.7 下的灾难场景</text><rect x=\"430\" y=\"48\" width=\"180\" height=\"190\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"452\" y=\"76\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">hash join（8.0.18+）</text><text x=\"450\" y=\"106\" font-size=\"13\" fill=\"var(--ink)\">小表建哈希表</text><text x=\"450\" y=\"130\" font-size=\"13\" fill=\"var(--ink)\">大表逐行探测</text><text x=\"450\" y=\"158\" font-size=\"13\" fill=\"var(--ink)\">无索引等值 join 正解</text><text x=\"450\" y=\"200\" font-size=\"12\" fill=\"var(--muted)\">内存不够分批落盘</text><text x=\"450\" y=\"220\" font-size=\"12\" fill=\"var(--muted)\">在线库大 join 仍应禁止</text><text x=\"40\" y=\"276\" font-size=\"13\" fill=\"var(--accent)\">优化主线：被驱动表走索引 + 小表驱动；join 两表字符集/排序规则/类型必须一致，否则索引失效</text></svg>",
    "caption": "图 5-2：8.0 的 hash join 补齐无索引等值 join 短板，但跨分片大 join 仍应归 BI"
   },
   {
    "t": "h",
    "text": "写侧慢查询：日志服批量写入优化"
   },
   {
    "t": "p",
    "text": "日志写入主线是减事务次数（事务 commit 次数 = redo fsync 次数）、减网络往返、顺序写：批量 insert 500~1000 条一个事务；日志表无二级索引 + 自增主键顺序写；可接受秒级丢失时 innodb_flush_log_at_trx_commit=2 或 0；按天分表让清理变成 drop table。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 500~1000 条一个事务，比逐条快一个数量级\nINSERT INTO behavior_log (player_id, event_type, event_data, ts) VALUES\n(10001, 1, '...', '2026-08-07 10:00:01'),\n(10002, 2, '...', '2026-08-07 10:00:01'),\n(10003, 1, '...', '2026-08-07 10:00:02');"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：上来就答加索引——先讲定位流程（慢日志 + explain），索引只是三层优化之一",
     "坑 2：把 type=index 当达标——它遍历整棵二级索引树，仅覆盖索引场景略好于 ALL，仍属需优化档位",
     "坑 3：把 sort_buffer_size 全局调大——会话级参数，连接多时内存直接爆掉，应先给 order by 建索引免排序"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：慢查询三板斧——慢日志定位、explain 四看诊断、索引→改写→从库/汇总表/OLAP 分层治理。统计别在在线库硬刚，深分页用游标，count 用汇总，日志写入靠攒批与顺序写。"
   }
  ]
 },
 {
  "id": "mysql-replication-cdc",
  "title": "主从复制、读写分离与 CDC 数据同步",
  "layer": 2,
  "depends": [
   "mysql-transaction-mvcc"
  ],
  "covers": [
   "mysql-13",
   "mysql-32",
   "mysql-31"
  ],
  "quiz": [
   "mysql-13",
   "mysql-32",
   "mysql-31"
  ],
  "body": [
   {
    "t": "lead",
    "text": "主从复制链路是 主写 binlog → 从库 IO 线程拉 → SQL 线程重放；延迟的根因是重放瓶颈；Canal 是伪装从库的 CDC，把 binlog 变成 BI 的实时数据流。"
   },
   {
    "t": "pre",
    "items": [
     "binlog 追加写、row/statement 格式（事务节点 3 已建立）",
     "两阶段提交保证 binlog 与 redo 一致，主从不分裂",
     "游戏服习惯：充值必读主库、报表读从库"
    ]
   },
   {
    "t": "h",
    "text": "复制三步与 binlog 格式"
   },
   {
    "t": "p",
    "text": "主库事务提交写 binlog → 从库 IO 线程拉取写 relay log → SQL 线程（5.7+ 可多线程并行）重放。binlog 三种格式：statement（记 SQL，有主从不一致风险）、row（记行变更，安全但体积大，主流）、mixed。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">主从复制三线程链路</text><rect x=\"30\" y=\"55\" width=\"150\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"62\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">主库</text><text x=\"52\" y=\"110\" font-size=\"12\" fill=\"var(--muted)\">事务提交写 binlog</text><text x=\"52\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">(row 格式)</text><text x=\"52\" y=\"150\" font-size=\"12\" fill=\"var(--muted)\">半同步等从库 ack</text><path d=\"M 180 90 L 225 90\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 218 86 L 228 90 L 218 94\" fill=\"var(--accent)\"/><rect x=\"230\" y=\"55\" width=\"150\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"258\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">IO 线程（从库）</text><text x=\"252\" y=\"110\" font-size=\"12\" fill=\"var(--muted)\">拉 binlog</text><text x=\"252\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">写本地 relay log</text><text x=\"252\" y=\"150\" font-size=\"12\" fill=\"var(--muted)\">位点/GTID 续传</text><path d=\"M 380 90 L 425 90\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 418 86 L 428 90 L 418 94\" fill=\"var(--accent)\"/><rect x=\"430\" y=\"55\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"462\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">SQL 线程（从库）</text><text x=\"452\" y=\"110\" font-size=\"12\" fill=\"var(--muted)\">重放 relay log</text><text x=\"452\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">5.7+ 并行复制</text><text x=\"452\" y=\"150\" font-size=\"12\" fill=\"var(--muted)\">延迟根源：重放瓶颈</text><text x=\"32\" y=\"210\" font-size=\"13\" fill=\"var(--ink)\">延迟成因：大事务、无索引行变更全表扫、批量 DDL、从库被报表读压垮</text><text x=\"32\" y=\"238\" font-size=\"13\" fill=\"var(--ink)\">缓解：并行复制（LOGICAL_CLOCK）、拆大事务、半同步 after_sync、关键链路读主库</text><text x=\"32\" y=\"266\" font-size=\"12\" fill=\"var(--muted)\">监控：Seconds_Behind_Master 大事务下不准，更准的是 relay log 位点差或 pt-heartbeat</text></svg>",
    "caption": "图 6-1：延迟的根因一句话——主库并发写、从库排队追"
   },
   {
    "t": "h",
    "text": "半同步复制：after_commit 与 after_sync"
   },
   {
    "t": "p",
    "text": "半同步 = 至少一个从库 ack 再返回客户端。5.6 的 after_commit 先提交再等 ack，主库宕机可能丢已返回成功的事务；5.7 的 after_sync 先传 binlog 到从库再引擎提交，不丢已提交事务，是主流（对应 rpl_semi_sync_master 插件，超时后自动降级为异步）。"
   },
   {
    "t": "h",
    "text": "8.0 分析语法：从库扛 BI 统计"
   },
   {
    "t": "p",
    "text": "BI 读从库时，8.0 的 CTE（with 命名子查询，支持递归生成日期序列）与窗口函数（row_number/rank/lag/sum over 等，行不折叠做组内计算）让留存、每组 TopN、连续登录统计一条 SQL 搞定——5.7 时代要靠变量模拟或自 join，又慢又难维护。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 次日留存：窗口函数按玩家分组，lag 取上一登录日\nWITH t AS (\n  SELECT player_id, DATE(login_time) AS d,\n         LAG(DATE(login_time)) OVER (PARTITION BY player_id ORDER BY login_time) AS prev_d\n  FROM login_log WHERE login_time >= '2026-08-01'\n)\nSELECT d, COUNT(*) AS dau,\n       SUM(DATEDIFF(d, prev_d) = 1) AS retain_1d\nFROM t GROUP BY d ORDER BY d;"
   },
   {
    "t": "h",
    "text": "Canal：伪装从库的 CDC"
   },
   {
    "t": "p",
    "text": "Canal server 用 dump 协议向主库注册为 slave 接收 binlog 事件，解析成消息投 Kafka，消费端按主键幂等 upsert 写 BI 库/ES。可靠性三段：消费位点持久化断点续传、Kafka 削峰、at-least-once + 幂等达到最终一致；同主键 hash 分区保证同一记录的多次变更有序消费。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">Canal 实时同步链路</text><rect x=\"30\" y=\"55\" width=\"120\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"48\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">业务库</text><text x=\"45\" y=\"110\" font-size=\"12\" fill=\"var(--muted)\">订单/玩家表</text><text x=\"45\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">row 格式 binlog</text><path d=\"M 150 100 L 190 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 183 96 L 193 100 L 183 104\" fill=\"var(--accent)\"/><rect x=\"195\" y=\"55\" width=\"120\" height=\"90\" rx=\"8\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"218\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">Canal</text><text x=\"212\" y=\"110\" font-size=\"12\" fill=\"var(--muted)\">伪装 slave</text><text x=\"212\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">解析 binlog 事件</text><path d=\"M 315 100 L 355 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 348 96 L 358 100 L 348 104\" fill=\"var(--accent)\"/><rect x=\"360\" y=\"55\" width=\"110\" height=\"90\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"382\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">Kafka</text><text x=\"372\" y=\"110\" font-size=\"12\" fill=\"var(--muted)\">按主键 hash 分区</text><text x=\"372\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">保序削峰</text><path d=\"M 470 100 L 510 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 503 96 L 513 100 L 503 104\" fill=\"var(--accent)\"/><rect x=\"515\" y=\"55\" width=\"100\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"533\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">BI 宽表</text><text x=\"525\" y=\"110\" font-size=\"12\" fill=\"var(--muted)\">按主键幂等 upsert</text><text x=\"525\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">最终一致</text><text x=\"32\" y=\"180\" font-size=\"13\" fill=\"var(--ink)\">可靠性三段：位点持久化断点续传 · Kafka 削峰 · 消费幂等 upsert</text><text x=\"32\" y=\"208\" font-size=\"13\" fill=\"var(--accent)\">红线：先 dump 快照 + 记录位点再接增量；CDC 单向流动，禁止回写业务库（循环复制风暴）</text><text x=\"32\" y=\"236\" font-size=\"12\" fill=\"var(--muted)\">游戏实践：订单库 binlog → Canal → Kafka → BI，运营实时看付费大盘；业务事件走 MQ、DB 状态同步走 CDC，两条线别混用</text></svg>",
    "caption": "图 6-2：Canal 拿 slave 工牌混进复制队伍，把 binlog 情报翻译成消息"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：充值/发货链路读从库——玩家刚充值 GM 却查不到，就是没走主库；关键链路读主库或用 GTID 等待",
     "坑 2：只盯 Seconds_Behind_Master——大事务下该指标虚高且不反映真实延迟，relay log 位点差 / pt-heartbeat 更可靠",
     "坑 3：Canal 落地直接跑——必须先 dump 快照 + 记录位点再接增量，否则初始化就丢数据；Kafka offset 与 binlog 位点是两套，别搞混"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：复制链路三线程，延迟根因是重放瓶颈；半同步 after_sync 是防丢的保险；Canal 是数据的高速公路。记住：玩家关键数据读主库，报表读从库，DB 状态变化走 CDC 进 BI。"
   }
  ]
 },
 {
  "id": "mysql-executor-optimizer",
  "title": "执行计划与优化器深入：EXPLAIN 全字段、成本模型与计划突变",
  "layer": 2,
  "depends": [
   "mysql-slow-sql"
  ],
  "covers": [
   "mysql-05",
   "mysql-10",
   "mysql-27"
  ],
  "quiz": [
   "mysql-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "慢 SQL 治理走到深水区，卡点往往不是『有没有索引』，而是『优化器为什么放着索引不用』；本节点把 EXPLAIN 每个字段、成本模型、直方图、ICP/MRR/BKA 与 optimizer_trace 讲透，专治『昨天还快、今天突然慢』的计划突变。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握 explain 四看：type / key / rows / Extra（mysql-slow-sql）",
     "理解聚簇/二级索引与回表成本（mysql-index-btree）",
     "意识到优化器不是全知全能，它的每个选择都是基于统计信息估算的总账"
    ]
   },
   {
    "t": "h",
    "text": "一、EXPLAIN 全字段拆解：不止四看"
   },
   {
    "t": "p",
    "text": "基础四看 type/key/rows/Extra 只是入门，生产排查要把每个字段都读一遍。id：数字越大越先执行，相同 id 按出现顺序执行；select_type 区分 SIMPLE、PRIMARY、SUBQUERY、DERIVED（派生表）、UNION、MATERIALIZED（物化）；table 显示被访问的表或别名；partitions 显示命中的分区（8.0 起）；possible_keys 是候选索引；key 是实际选中的索引；key_len 按字节累计，用来推算联合索引实际命中到第几列；ref 显示与 key 比对的是常量还是某列；rows 是优化器估算的扫描行数；filtered 是经过 where 过滤后剩余的估算比例，rows × filtered 才是 join 驱动次数的量级；Extra 携带 Using index、Using where、Using index condition、Using filesort、Using temporary、Using MRR 等关键标志。"
   },
   {
    "t": "table",
    "head": [
     "type",
     "含义",
     "达标线"
    ],
    "rows": [
     [
      "system",
      "表只有一行（系统表）",
      "最好"
     ],
     [
      "const",
      "主键/唯一索引等值命中，最多一行",
      "优秀"
     ],
     [
      "eq_ref",
      "join 被驱动表按主键/唯一键等值匹配",
      "join 达标"
     ],
     [
      "ref",
      "非唯一索引等值匹配，可返回多行",
      "常规达标"
     ],
     [
      "range",
      "索引范围扫描（between / in / 大于小于），8.0 支持 index_skip_scan 跳跃扫描",
      "底线"
     ],
     [
      "index",
      "全索引扫描，遍历整棵二级索引树",
      "需优化"
     ],
     [
      "ALL",
      "全表扫描聚簇索引",
      "禁止"
     ]
    ]
   },
   {
    "t": "h",
    "text": "二、优化器成本模型：为什么『有索引不用』"
   },
   {
    "t": "p",
    "text": "优化器对每条候选执行路径估算总成本：IO 成本（读页数 × 单位 IO 成本）+ CPU 成本（比较/计算次数）+ 内存成本（临时表、sort buffer）。它算的是『全量扫描 + 逐行回表』的总账：当某个二级索引区分度低（如 status、sex），回表次数 × 单次回表 IO 反而大于全表顺序扫描，优化器就主动放弃索引。所以 explain 出现 possible_keys 有、key 为 NULL，不是语法失效，而是成本性放弃。三类诱因最常见：统计信息过期（analyze table 之后计划可能焕然一新）；直方图缺失——8.0 的 ANALYZE TABLE ... UPDATE HISTOGRAM 让优化器看到列值分布，纠正『均匀分布』的错误假设，专治数据倾斜下 join 选错驱动表；估算偏差——rows 只是估算，实际差异大时计划失真。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">EXPLAIN 核心字段速查卡</text><rect x=\"30\" y=\"40\" width=\"180\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"44\" y=\"62\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">type 访问方式</text><text x=\"44\" y=\"82\" font-size=\"12\" fill=\"var(--muted)\">system 到 ALL 七档</text><rect x=\"230\" y=\"40\" width=\"180\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"244\" y=\"62\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">key 实际索引</text><text x=\"244\" y=\"82\" font-size=\"12\" fill=\"var(--muted)\">NULL = 没走；possible_keys 是候选</text><rect x=\"430\" y=\"40\" width=\"180\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"444\" y=\"62\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">key_len 命中深度</text><text x=\"444\" y=\"82\" font-size=\"12\" fill=\"var(--muted)\">字节累计到联合索引第几列</text><rect x=\"30\" y=\"104\" width=\"180\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"44\" y=\"126\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">rows × filtered</text><text x=\"44\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\">估算行数 × 过滤比例 = 驱动次数</text><rect x=\"230\" y=\"104\" width=\"180\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"244\" y=\"126\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">Extra 额外标志</text><text x=\"244\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\">index / filesort / MRR / ICP / temp</text><rect x=\"430\" y=\"104\" width=\"180\" height=\"54\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"444\" y=\"126\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">partitions 分区</text><text x=\"444\" y=\"146\" font-size=\"12\" fill=\"var(--muted)\">8.0 分区表看命中了哪个区</text><text x=\"30\" y=\"188\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">type 优劣条：</text><rect x=\"30\" y=\"200\" width=\"80\" height=\"36\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"52\" y=\"223\" font-size=\"13\" fill=\"var(--ink)\">system</text><rect x=\"116\" y=\"200\" width=\"80\" height=\"36\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"138\" y=\"223\" font-size=\"13\" fill=\"var(--ink)\">const</text><rect x=\"202\" y=\"200\" width=\"80\" height=\"36\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"220\" y=\"223\" font-size=\"13\" fill=\"var(--ink)\">eq_ref</text><rect x=\"288\" y=\"200\" width=\"80\" height=\"36\" rx=\"4\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"311\" y=\"223\" font-size=\"13\" fill=\"var(--ink)\">ref</text><rect x=\"374\" y=\"200\" width=\"80\" height=\"36\" rx=\"4\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"400\" y=\"223\" font-size=\"13\" fill=\"var(--ink)\">range</text><rect x=\"460\" y=\"200\" width=\"80\" height=\"36\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"486\" y=\"223\" font-size=\"13\" fill=\"var(--ink)\">index</text><rect x=\"546\" y=\"200\" width=\"70\" height=\"36\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"567\" y=\"223\" font-size=\"13\" fill=\"var(--ink)\">ALL</text><text x=\"30\" y=\"262\" font-size=\"12\" fill=\"var(--muted)\">达标线：日常至少 range，杜绝 ALL；type=index 遍历整棵二级索引树，仅略好于 ALL</text><text x=\"30\" y=\"286\" font-size=\"12\" fill=\"var(--accent)\">possible_keys 有而 key 无 = 成本性放弃（看直方图/统计信息），不是语法失效</text></svg>",
    "caption": "图 1-1：EXPLAIN 关键字段速查卡，possible_keys 有而 key 无是成本问题不是写法问题"
   },
   {
    "t": "h",
    "text": "三、ICP / MRR / BKA：三条『少碰聚簇索引』的路径"
   },
   {
    "t": "list",
    "items": [
     "ICP（Index Condition Pushdown，索引下推）：把 where 中无法用于定位但索引里有的列（如联合索引非最左列）下推到引擎层，先过滤再回表。Extra 显示 Using index condition。作用是减少回表次数。",
     "MRR（Multi-Range Read，多范围读）：二级索引范围扫描时先收集一批主键，按主键排序后再批量回聚簇索引取行，把随机 IO 转成顺序 IO，同时合并回表次数。Extra 显示 Using MRR。",
     "BKA（Batched Key Access，批量键访问）：join 场景的 MRR——驱动表一次取一批 join 键，对被驱动表批量查，避免逐行随机回表。Extra 显示 Using join buffer (Batched Key Access)。"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">ICP / MRR / BKA 三件套对比</text><rect x=\"30\" y=\"44\" width=\"180\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"52\" y=\"72\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">ICP 索引下推</text><text x=\"48\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">where 过滤下推引擎层</text><text x=\"48\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">先过滤再回表</text><text x=\"48\" y=\"156\" font-size=\"12\" fill=\"var(--muted)\">Extra: Using index condition</text><text x=\"48\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">作用：减少回表次数</text><rect x=\"230\" y=\"44\" width=\"180\" height=\"150\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"252\" y=\"72\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">MRR 多范围读</text><text x=\"248\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">二级索引收集主键</text><text x=\"248\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">按主键排序后批量回表</text><text x=\"248\" y=\"156\" font-size=\"12\" fill=\"var(--muted)\">Extra: Using MRR</text><text x=\"248\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">作用：随机 IO 变顺序 IO</text><rect x=\"430\" y=\"44\" width=\"180\" height=\"150\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"452\" y=\"72\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">BKA 批量键访问</text><text x=\"448\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">join 场景的 MRR</text><text x=\"448\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">一批 join 键批量查</text><text x=\"448\" y=\"156\" font-size=\"12\" fill=\"var(--muted)\">Extra: join buffer (BKA)</text><text x=\"448\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">作用：避免逐行随机回表</text><text x=\"32\" y=\"226\" font-size=\"13\" fill=\"var(--accent)\">三者共同目标：少碰聚簇索引，把随机 IO 转成顺序 IO，各自解决一个环节的浪费</text><text x=\"32\" y=\"252\" font-size=\"12\" fill=\"var(--muted)\">开启开关：optimizer_switch 的 index_condition_pushdown / mrr / batched_key_access，默认多数开启</text></svg>",
    "caption": "图 1-2：ICP 过滤下推、MRR 回表排序、BKA 是 join 版 MRR，Extra 标志各不相同"
   },
   {
    "t": "h",
    "text": "四、optimizer_trace：看穿优化器的心思"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 8.0 开启优化器追踪\nSET optimizer_trace='enabled=on', end_markers_in_json=on;\nSELECT * FROM player WHERE level BETWEEN 30 AND 40 ORDER BY reg_time DESC LIMIT 20;\nSELECT * FROM information_schema.OPTIMIZER_TRACE;  -- 输出为 JSON"
   },
   {
    "t": "p",
    "text": "输出按阶段分：join_preparation（解析与重写）、join_optimization（成本计算：逐个索引估算 range 代价、选 join 顺序）、join_execution（真实执行）。重点读 rows_estimation 里每个候选索引的 cost 估算，以及 condition_processing 里等值/范围条件怎么被剥离出来决定索引命中深度。它能回答『为什么选了这个计划』，比靠猜靠谱得多。"
   },
   {
    "t": "h",
    "text": "五、执行计划突变：昨天还快，今天突然慢"
   },
   {
    "t": "list",
    "items": [
     "场景 A：数据量增长到阈值，优化器判定『走索引回表不如全表扫』——type 从 range 变 ALL，低区分度索引最典型",
     "场景 B：新增一个索引改变了另一条 SQL 的 join 驱动表选择——优化器选错驱动顺序，慢一个数量级",
     "场景 C：analyze table 或实例重启后统计信息刷新，成本重算，计划漂移",
     "场景 D：直方图过期——数据分布变了但直方图没更新，倾斜数据被当成均匀数据估算"
    ]
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 场景 A 验证：对比 explain 前后 type 与 rows\nEXPLAIN SELECT player_id FROM player WHERE status=1;\nALTER TABLE player DROP INDEX idx_status;\nEXPLAIN SELECT player_id FROM player WHERE status=1;   -- 看 rows 变化\n-- 场景 C：刷新统计信息让优化器重估\nANALYZE TABLE player;\n-- 场景 D：重刷直方图\nANALYZE TABLE player UPDATE HISTOGRAM ON status WITH 32 BUCKETS;"
   },
   {
    "t": "p",
    "text": "生产上『计划突变』比『一直很慢』更危险——它会静默拖垮在线库。应对三板斧：每次 SQL 上线前存 explain 基线，突变时 diff；用 optimizer_trace 看成本从哪一步开始变；必要时用 hint 稳定计划（8.0 的 JOIN_ORDER / SET_VAR 比 force index 粒度更细，但同样要评估数据分布变化后的自适应性，hint 是最后手段）。"
   },
   {
    "t": "h",
    "text": "六、直方图实操：让优化器看见倾斜分布"
   },
   {
    "t": "p",
    "text": "直方图（histogram）是 8.0 给优化器的『数据分布地图』。建了索引仍选错驱动表、或对倾斜列（如 90% 玩家 status=0）走错计划时，先看是不是统计信息把它当均匀分布估算。命令：ANALYZE TABLE player UPDATE HISTOGRAM ON status WITH 32 BUCKETS。singleton 直方图适合低基数列，equi-height 适合高基数；INFORMATION_SCHEMA.COLUMN_STATISTICS 可查看已建直方图。注意直方图只服务优化器的选择估算，不参与索引结构——它不会让查询变快，只是让优化器选对计划；数据分布变化后要重刷，否则过期直方图同样误导优化器。"
   },
   {
    "t": "h",
    "text": "七、与其他工具配合：慢日志、performance_schema 与 sys schema"
   },
   {
    "t": "p",
    "text": "EXPLAIN 回答『一条 SQL 怎么跑』，但『哪条 SQL 该优化』要靠慢日志与 performance_schema 回答。slow_query_log 记录超过 long_query_time 的 SQL，log_queries_not_using_indexes 还能把没走索引的 SQL 全部抓出来。performance_schema 的 events_statements_summary_by_digest 按 SQL 指纹聚合耗时与执行次数，是线上 Top SQL 的权威来源；sys schema 是 performance_schema 的视图封装，一条查询就能拿到 Top 语句、等待事件、锁等待。完整排查链路：慢日志/摘要表定位 → explain 看计划 → optimizer_trace 看成本 → 改造 → explain 对比验证 → 观察慢日志条数与 p99 延迟回归。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 按 SQL 指纹找 Top 耗时语句（performance_schema 摘要表）\nSELECT DIGEST_TEXT, COUNT_STAR,\n       ROUND(AVG_TIMER_WAIT/1e12, 2) AS avg_s,\n       SUM_ROWS_EXAMINED\nFROM performance_schema.events_statements_summary_by_digest\nWHERE SCHEMA_NAME = 'game_db'\nORDER BY AVG_TIMER_WAIT DESC LIMIT 20;"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：拿 rows 当实际扫描行数——rows 只是估算，filtered 与 rows 相乘才是 join 驱动次数的量级，精确值要看 EXPLAIN ANALYZE",
     "坑 2：ICP/MRR/BKA 三者混为一谈——ICP 是过滤下推、MRR 是回表排序合并、BKA 是 join 版 MRR，Extra 标志各不相同",
     "坑 3：遇到 possible_keys 有、key 空就背『索引失效』——那是优化器成本性放弃，先看数据分布与直方图再下结论",
     "坑 4：force index 一把梭——统计信息失真时会把错误计划固化，先 analyze table 再观察，hint 是最后手段"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：优化器不是魔法，它是『拿着统计信息算总账』的成本评估器。EXPLAIN 全字段、成本模型、直方图、ICP/MRR/BKA、optimizer_trace 五件套，能把『有索引不用』从玄学变成可解释的成本账；计划突变要建 explain 基线并定期 analyze，hint 只做兜底。"
   }
  ]
 },
 {
  "id": "mysql-ha-architecture",
  "title": "高可用架构：主从切换、半同步、MGR 与跨机房容灾",
  "layer": 2,
  "depends": [
   "mysql-replication-cdc"
  ],
  "covers": [
   "mysql-13"
  ],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "复制解决『读扩展』，高可用解决『写不中断』；本节点从 RTO/RPO 讲起，把主从切换、MHA/Orchestrator、半同步、MGR 与跨机房容灾串成一张决策图，落到游戏服 DB 高可用设计。"
   },
   {
    "t": "pre",
    "items": [
     "主从复制三线程与延迟治理（mysql-replication-cdc）",
     "GTID、binlog 位点的基础概念",
     "理解 RPO（最多丢多少）与 RTO（多久恢复）是两个独立目标"
    ]
   },
   {
    "t": "h",
    "text": "一、高可用的度量：RTO 与 RPO"
   },
   {
    "t": "p",
    "text": "RTO（Recovery Time Objective）是故障后恢复服务的时间，RPO（Recovery Point Objective）是最多丢失的数据量。所有 HA 方案的本质都是在『切换时间、丢多少、复杂度/成本』三者间权衡。游戏服通常 RTO 分钟级、RPO 尽力为零（玩家资产库）或可容忍秒级（登录服/日志库）。"
   },
   {
    "t": "h",
    "text": "二、主从切换：人工 vs 自动"
   },
   {
    "t": "p",
    "text": "切换六步：确认主库不可用 → 选出数据最新的从库 → 补齐该从库落后的事务（等它追平，或从其他从库拷贝 relay log）→ 提升为主（stop slave + reset slave all）→ 修改应用读写指向（VIP / 配置中心 / MySQL Router）→ 原主恢复后作为新主的从库重新加入（GTID 让自动对齐成为可能）。最大的坑是『脑裂』：主库只是网络分区不是真死，新主已接管后旧主恢复，两边同时写。需要隔离手段——MHA 用 SSH 强停旧主、Orchestrator 依赖 Raft 法定人数、MGR 用组共识自动排斥孤岛。"
   },
   {
    "t": "h",
    "text": "三、MHA vs Orchestrator"
   },
   {
    "t": "p",
    "text": "MHA（Master High Availability）：最经典方案，故障检测 → SSH 到各从库补齐 relay log → 选出最完整从库提升。优势是成熟、轻量；劣势是官方已基本停止维护（社区事实，以你所在团队采用的版本为准）、无强脑裂隔离、依赖 SSH 与脚本、自动切换需人工介入多。Orchestrator：近年主流，每个实例装 agent 相互探测，靠 Raft 选主协调『由谁决策切换』，自动提升 + 自动改写复制拓扑，提供 API/UI，被 GitHub 大规模使用，是 MySQL 8.0 时代 DBA 工具链首选。两者都要配合半同步复制，否则切换存在数据丢失窗口。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">MHA vs Orchestrator：切换决策方式对比</text><rect x=\"30\" y=\"42\" width=\"280\" height=\"190\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"55\" y=\"70\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">MHA</text><text x=\"48\" y=\"98\" font-size=\"13\" fill=\"var(--ink)\">manager 单点探测主库</text><text x=\"48\" y=\"122\" font-size=\"13\" fill=\"var(--ink)\">SSH 各从库补齐 relay log</text><text x=\"48\" y=\"146\" font-size=\"13\" fill=\"var(--ink)\">选最完整从库提升</text><text x=\"48\" y=\"182\" font-size=\"12\" fill=\"var(--lv2)\">局限：无强脑裂隔离、依赖脚本、</text><text x=\"48\" y=\"202\" font-size=\"12\" fill=\"var(--lv2)\">官方已基本停止维护</text><text x=\"48\" y=\"222\" font-size=\"12\" fill=\"var(--muted)\">需人工介入多</text><rect x=\"330\" y=\"42\" width=\"280\" height=\"190\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"355\" y=\"70\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">Orchestrator</text><text x=\"348\" y=\"98\" font-size=\"13\" fill=\"var(--ink)\">各实例 agent 相互探测</text><text x=\"348\" y=\"122\" font-size=\"13\" fill=\"var(--ink)\">Raft 法定人数定夺谁决策</text><text x=\"348\" y=\"146\" font-size=\"13\" fill=\"var(--ink)\">自动提升 + 改复制拓扑</text><text x=\"348\" y=\"182\" font-size=\"12\" fill=\"var(--lv1)\">优势：API/UI、防脑裂、</text><text x=\"348\" y=\"202\" font-size=\"12\" fill=\"var(--lv1)\">GitHub 大规模生产验证</text><text x=\"348\" y=\"222\" font-size=\"12\" fill=\"var(--muted)\">8.0 时代 DBA 首选</text><text x=\"32\" y=\"258\" font-size=\"13\" fill=\"var(--accent)\">两者都要配半同步复制（after_sync）兜底，否则切换必然丢数据</text><text x=\"32\" y=\"282\" font-size=\"12\" fill=\"var(--muted)\">切换后监控：all_gtids 一致性核对、旧主重搭从库、应用读写指向同步切</text></svg>",
    "caption": "图 4-1：MHA 单点决策 vs Orchestrator Raft 共识，防脑裂能力是分水岭"
   },
   {
    "t": "h",
    "text": "四、半同步复制：after_commit 与 after_sync"
   },
   {
    "t": "p",
    "text": "异步复制下主库宕机可能丢已返回成功的事务。半同步要求至少一个从库确认收到 binlog 才向客户端返回成功：5.6 的 after_commit 是先提交引擎再等 ack，主库宕机仍可能丢；5.7 的 after_sync 先传 binlog 给从库、从库 ack 后才引擎提交，不丢已返回成功的事务，是主流。注意 rpl_semi_sync_source_timeout 超时会自动降级为异步，防止主库可用性被从库拖垮——但降级期间 RPO 重新变差，必须有监控告警。"
   },
   {
    "t": "h",
    "text": "五、组复制 MGR / InnoDB Cluster"
   },
   {
    "t": "p",
    "text": "MGR 是基于 Paxos 类共识的组复制：集群成员通过网络互通 + 组通信共识对事务排序，成员自动检测与排斥。两种模式：单主模式——只有 primary 可写，其余只读，故障自动选新主，应用只连 primary，游戏服推荐；多主模式——所有成员可写，靠分布式冲突检测保证一致，但限制多：默认不支持 SERIALIZABLE 隔离级别、不支持多级级联外键、同一对象并发 DDL 与 DML 不受支持、SELECT FOR UPDATE 可能死锁，官方建议配合 READ COMMITTED。硬约束：组成员上限 9 个（官方测试的安全边界）；单个事务过大（超过约 5 秒传输窗口）会被误判故障踢出；对网络延迟极敏感——跨机房高延迟会导致频繁被疑出组，所以 MGR 适合同机房，跨机房通常用半同步或异步级联。InnoDB Cluster 是 MGR + MySQL Router + MySQL Shell 的成套方案，提供自动故障转移与读写路由。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">MGR 单主模式拓扑与硬限制</text><rect x=\"30\" y=\"42\" width=\"150\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"60\" y=\"70\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">MySQL Router</text><text x=\"46\" y=\"94\" font-size=\"12\" fill=\"var(--muted)\">读写路由，感知成员变化</text><path d=\"M 180 77 L 230 70\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 224 65 L 234 69 L 226 75\" fill=\"var(--accent)\"/><rect x=\"235\" y=\"42\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"262\" y=\"68\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">primary（写）</text><text x=\"255\" y=\"88\" font-size=\"12\" fill=\"var(--muted)\">唯一可写节点</text><rect x=\"385\" y=\"42\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"408\" y=\"68\" font-size=\"14\" fill=\"var(--ink)\">副本（读）</text><rect x=\"505\" y=\"42\" width=\"110\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"528\" y=\"68\" font-size=\"14\" fill=\"var(--ink)\">副本（读）</text><path d=\"M 375 72 L 385 72\" stroke=\"var(--line)\"/><path d=\"M 495 72 L 505 72\" stroke=\"var(--line)\"/><text x=\"235\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">组通信（Group Communication）共识：所有成员互连，事务排序与提交一致</text><text x=\"235\" y=\"156\" font-size=\"12\" fill=\"var(--muted)\">主挂 → 自动选新主；成员失效自动排斥（防脑裂）</text><rect x=\"30\" y=\"176\" width=\"580\" height=\"96\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"48\" y=\"200\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">硬限制（面试必答）</text><text x=\"48\" y=\"224\" font-size=\"13\" fill=\"var(--ink)\">组成员上限 9 个；大事务超约 5 秒传输窗口会被误判踢出</text><text x=\"48\" y=\"248\" font-size=\"13\" fill=\"var(--ink)\">多主模式：默认禁 SERIALIZABLE、禁级联外键、并发 DDL/DML 同对象不支持</text><text x=\"48\" y=\"268\" font-size=\"12\" fill=\"var(--muted)\">对网络延迟极敏感 → 只适合同机房；跨机房用半同步/异步级联</text></svg>",
    "caption": "图 4-2：MGR 单主模式拓扑与共识机制，跨机房是共识协议的物理边界"
   },
   {
    "t": "h",
    "text": "六、MySQL Router：应用的统一入口"
   },
   {
    "t": "p",
    "text": "Router 伪装成 MySQL 端口，按规则把读写流量分到 primary/副本，监听 group 成员变化自动切换路由——应用无感知，只需连 Router。代价是多一跳网络与 Router 自身的高可用（部署多个 + VIP/LB）。"
   },
   {
    "t": "h",
    "text": "七、跨机房容灾与游戏服 DB 高可用设计"
   },
   {
    "t": "list",
    "items": [
     "同城双活：主库在 A、半同步从库在 B（跨机房延迟低可接受），A 机房故障 B 秒级接管",
     "异地容灾：异步级联复制到异地机房，RPO 分钟级，只做兜底与报表，不承担在线切换",
     "脑裂隔离是跨机房最大风险：第三方仲裁者（observer）或分布式锁决定哪一边存活",
     "游戏服落地：玩家资产库用 半同步 + Orchestrator（同机房）+ 异地异步兜底；登录服/日志服容忍秒级丢，可只做异步 + 快速重建"
    ]
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 半同步核心参数（8.0 主从各自装插件）\n-- 主库：\nINSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';\nSET GLOBAL rpl_semi_sync_source_enabled = 1;\nSET GLOBAL rpl_semi_sync_source_timeout = 3000;   -- 超时 3 秒自动降级异步\n-- 从库：\nINSTALL PLUGIN rpl_semi_sync_replica SONAME 'semisync_replica.so';\nSET GLOBAL rpl_semi_sync_replica_enabled = 1;"
   },
   {
    "t": "h",
    "text": "八、故障演练与切换剧本"
   },
   {
    "t": "p",
    "text": "HA 方案不是部署完就完事，切换能力要靠演练逼出来。标准剧本：随机杀掉一个实例 → 观察自动切换是否成功、RTO 是否达标 → 核对数据不丢（RPO 达标）→ 验证应用读写指向是否自动切到新主 → 回切演练（旧主回归为从库）→ 复盘改进。演练频度季度一次，最好选真实业务流量低峰，配合故障注入（随机 kill 主库连接、拔网线模拟网络分区）。很多『主库挂了 20 分钟没人发现』的事故，都是没演练、告警没配、运维不会切三重叠加的结果——演练出的不只是技能，还有告警链路与操作手册的可信度。"
   },
   {
    "t": "p",
    "text": "监控指标也要按 HA 目标设计：主从状态（复制是否中断）、延迟（用 pt-heartbeat 每 5 秒打点，比 Seconds_Behind_Master 更准）、半同步降级事件、切换事件审计。所有『自动』都必须有『人工接管』开关：自动切换失败时，运维要能在 5 分钟内按手册手动完成切换——手册里每一步的命令、连接串、验证 SQL 都要预先写死并演练过，临时翻文档是最慢的恢复方式。游戏服开服/活动期间慎做切换演练，选低峰执行并预留回切通道。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：切换后旧主重搭不及时——GTID 时代也要定期核对全局 GTID 一致性，旧主回切前必须重新作为从库接入",
     "坑 2：半同步降级无人监控——超时自动降异步是『丢数据风险』的静默开关，必须有告警与巡检",
     "坑 3：把 MGR 当跨机房银弹——高延迟会被疑出组，9 成员上限与单事务传输窗口是硬约束",
     "坑 4：切换只动数据库不动应用——VIP / 配置中心 / Router 三处写指向要一起切，先演练后上线"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：HA 是『目标（RTO/RPO）→ 方案（半同步/Orchestrator/MGR）→ 入口（Router）→ 容灾（同城/异地）』的四层决策。游戏服推荐组合：同机房半同步 + Orchestrator 自动切换 + Router 路由 + 异地异步兜底；跨机房强一致别上 MGR。定期切换演练比任何方案都重要。"
   }
  ]
 },
 {
  "id": "mysql-backup-recovery",
  "title": "备份与恢复：mysqldump / xtrabackup、binlog 增量与 PITR 回档",
  "layer": 2,
  "depends": [
   "mysql-three-logs",
   "mysql-replication-cdc"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "高可用防『主库挂』，备份防『数据没』——误删一行、外挂刷数据、代码 bug 批量改错，最后靠的都是备份加 binlog 的 PITR 时间点恢复；本节点把逻辑/物理备份、全量/增量、恢复演练讲透。"
   },
   {
    "t": "pre",
    "items": [
     "binlog 追加写与 ROW 格式（mysql-three-logs）",
     "主从复制位点/GTID 概念（mysql-replication-cdc）",
     "理解 RPO 边界：恢复只能到『上次全量 + binlog 重放』的最优点"
    ]
   },
   {
    "t": "h",
    "text": "一、备份的分类"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "逻辑备份",
     "物理备份"
    ],
    "rows": [
     [
      "代表工具",
      "mysqldump / mysqlpump",
      "XtraBackup（物理文件）"
     ],
     [
      "内容",
      "可回放的 SQL 语句",
      "数据文件 + redo log 拷贝"
     ],
     [
      "粒度",
      "行级、可选择性导出",
      "整库/整表空间、块级"
     ],
     [
      "速度",
      "慢，适合小库/迁移",
      "快，适合大库/生产"
     ],
     [
      "恢复方式",
      "回放 SQL，慢",
      "还原文件即可，快"
     ],
     [
      "一致性",
      "--single-transaction 借助事务快照",
      "备份期间同步拷贝 redo log 达成一致"
     ]
    ]
   },
   {
    "t": "p",
    "text": "增量备份的基础是 binlog：『全量备份 + 全量之后到故障点的 binlog 重放』就是 PITR（Point-in-Time Recovery）。全量决定恢复的基准时间，binlog 归档频率决定 RPO——每小时归档一次 binlog，最坏丢一小时。"
   },
   {
    "t": "h",
    "text": "二、mysqldump：逻辑备份的正确姿势"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 单事务一致快照 + 记录 binlog 位点/GTID（InnoDB 表）\nmysqldump -uBackup -p --single-transaction --master-data=2 \\\n  --set-gtid-purged=ON --routines --triggers --events \\\n  game_db > game_db_full.sql\n# 恢复\nmysql -uRoot -p game_db < game_db_full.sql"
   },
   {
    "t": "p",
    "text": "--single-transaction 用 REPEATABLE READ 快照保证导出期间数据一致（不加锁，借助 MVCC）；--master-data=2 在文件头注释记录导出时刻的 binlog 文件与位点（或 GTID），是后续增量重放的对齐点。注意 mysqldump 对 MyISAM 表会全程锁表——8.0 已全面 InnoDB 化，但遗留表要注意。逻辑备份适合小库、迁移、抽数据，大库恢复要回放几小时 SQL，不可接受。"
   },
   {
    "t": "h",
    "text": "三、XtraBackup：物理备份与增量"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 全量备份\nxtrabackup --backup --target-dir=/backup/full --user=Backup --password=...\n# 增量备份（基于 LSN，增量比解析 binlog 重放更快）\nxtrabackup --backup --target-dir=/backup/inc1 --incremental-basedir=/backup/full\n# 应用 redo log 使备份一致，再还原\nxtrabackup --prepare --target-dir=/backup/full\nxtrabackup --copy-back --target-dir=/backup/full"
   },
   {
    "t": "p",
    "text": "原理：备份期间持续拷贝 .ibd 数据文件，同时另开线程持续拷贝 redo log（备份期间的所有新写入都在这里）；--prepare 阶段用 redo log 把数据文件『追到一致点』。8.0 必须用 XtraBackup 8.0+（兼容 8.0 的 redo 格式，旧版本会报不兼容）。增量备份基于 LSN（日志序列号），比全量快得多，适合超大盘：周一全量 + 周二到周日每日增量，恢复时依次 apply 增量再 prepare。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">备份方案选型：物理 vs 逻辑 × 全量 vs 增量</text><rect x=\"30\" y=\"44\" width=\"280\" height=\"140\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"55\" y=\"72\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">物理备份 XtraBackup</text><text x=\"48\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">拷贝数据文件 + redo log</text><text x=\"48\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">快，适合生产大库</text><text x=\"48\" y=\"148\" font-size=\"13\" fill=\"var(--ink)\">支持 LSN 增量</text><text x=\"48\" y=\"172\" font-size=\"12\" fill=\"var(--muted)\">8.0 必须用 XtraBackup 8.0+</text><rect x=\"330\" y=\"44\" width=\"280\" height=\"140\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"355\" y=\"72\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">逻辑备份 mysqldump</text><text x=\"348\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">导出 SQL，可选择性恢复</text><text x=\"348\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">慢，适合小库/迁移/抽数</text><text x=\"348\" y=\"148\" font-size=\"13\" fill=\"var(--ink)\">--single-transaction 一致快照</text><text x=\"348\" y=\"172\" font-size=\"12\" fill=\"var(--muted)\">--master-data=2 记录对齐点</text><rect x=\"30\" y=\"204\" width=\"580\" height=\"54\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"48\" y=\"228\" font-size=\"13\" fill=\"var(--ink)\">增量层 = binlog 归档（每小时）：全量 + binlog 重放 = PITR，归档频率决定 RPO</text><text x=\"48\" y=\"250\" font-size=\"12\" fill=\"var(--muted)\">RPO 目标小时级：每小时归档一次并异地备份；每季度一次完整恢复演练</text></svg>",
    "caption": "图 5-1：物理备份扛生产、逻辑备份做迁移，增量靠 binlog 归档实现 PITR"
   },
   {
    "t": "h",
    "text": "四、binlog 增量与 PITR 时间点恢复"
   },
   {
    "t": "p",
    "text": "恢复流程：先恢复最近一次全量备份 → 用 mysqlbinlog 把全量点之后、目标时间点之前的 binlog 依次重放。定位目标点用 --start-datetime / --stop-datetime，或更精确的 --start-position / --stop-position（位置号）。误删/批量改错场景的思路：确定误操作时间点 T → 恢复全量备份到 T 之前 → 重放 binlog 到 T 前 1 秒 → 导出受影响的目标表/行 → 合入线上库（避免全库回滚影响 T 之后产生的新数据）。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 把 binlog.000042 里 2026-08-07 09:30:00 之前的事件重放进恢复库\nmysqlbinlog --start-position=154 --stop-datetime='2026-08-07 09:30:00' \\\n  --database=game_db binlog.000042 | mysql -uRoot -p recovery_db\n# 或按位置号精确切段\nmysqlbinlog --start-position=154 --stop-position=89512 binlog.000042 \\\n  | mysql -uRoot -p recovery_db"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">PITR 时间线：全量 + binlog 重放到目标点</text><rect x=\"40\" y=\"50\" width=\"120\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"55\" y=\"76\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">T0 全量备份</text><text x=\"55\" y=\"98\" font-size=\"12\" fill=\"var(--muted)\">01:00，--master-data</text><rect x=\"200\" y=\"50\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"215\" y=\"76\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">binlog 事件流</text><text x=\"215\" y=\"98\" font-size=\"12\" fill=\"var(--muted)\">持续归档，每小时一份</text><rect x=\"420\" y=\"50\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"435\" y=\"76\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">误删点 T（09:20）</text><text x=\"435\" y=\"98\" font-size=\"12\" fill=\"var(--muted)\">重放到 T 前 1 秒停止</text><path d=\"M 160 85 L 200 85\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 193 81 L 203 85 L 193 89\" fill=\"var(--accent)\"/><path d=\"M 380 85 L 420 85\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 413 81 L 423 85 L 413 89\" fill=\"var(--accent)\"/><text x=\"40\" y=\"156\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">恢复三步</text><text x=\"40\" y=\"186\" font-size=\"13\" fill=\"var(--ink)\">① 恢复全量备份 → ② mysqlbinlog 重放至 stop-position → ③ 校验后导出受影响表合入线上</text><text x=\"40\" y=\"212\" font-size=\"12\" fill=\"var(--muted)\">校验：count 对比、钻石总量守恒、抽样全字段 hash 比对</text><text x=\"40\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">只恢复受影响表/行，避免全库回滚覆盖 T 之后的新数据</text><text x=\"40\" y=\"268\" font-size=\"12\" fill=\"var(--muted)\">回滚预案：旧数据保留 N 天只读，出问题可回切</text></svg>",
    "caption": "图 5-2：全量 + binlog 重放到误删点前 1 秒，是误删/批量改错的最后防线"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">恢复演练流程：把恢复能力练成肌肉记忆</text><rect x=\"30\" y=\"44\" width=\"110\" height=\"56\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"48\" y=\"66\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">故障通告</text><text x=\"45\" y=\"88\" font-size=\"12\" fill=\"var(--muted)\">定 RPO/RTO</text><path d=\"M 140 72 L 172 72\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 165 68 L 175 72 L 165 76\" fill=\"var(--accent)\"/><rect x=\"178\" y=\"44\" width=\"110\" height=\"56\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"196\" y=\"66\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">恢复全量</text><text x=\"193\" y=\"88\" font-size=\"12\" fill=\"var(--muted)\">XtraBackup</text><path d=\"M 288 72 L 320 72\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 313 68 L 323 72 L 313 76\" fill=\"var(--accent)\"/><rect x=\"326\" y=\"44\" width=\"110\" height=\"56\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"344\" y=\"66\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">重放 binlog</text><text x=\"341\" y=\"88\" font-size=\"12\" fill=\"var(--muted)\">mysqlbinlog</text><path d=\"M 436 72 L 468 72\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 461 68 L 471 72 L 461 76\" fill=\"var(--accent)\"/><rect x=\"474\" y=\"44\" width=\"130\" height=\"56\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"492\" y=\"66\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">校验后切换</text><text x=\"489\" y=\"88\" font-size=\"12\" fill=\"var(--muted)\">count + hash 对比</text><text x=\"32\" y=\"126\" font-size=\"13\" fill=\"var(--ink)\">校验三件套：表级 count、钻石总量守恒、抽样玩家全字段 hash 比对</text><text x=\"32\" y=\"152\" font-size=\"12\" fill=\"var(--muted)\">演练通过率作为 SLO 纳入运维考核；季度一次全流程 + 版本上线前验证备份可用</text><text x=\"32\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">演练要覆盖：误删背包、外挂刷钻石、批量改错等级、drop table 四种剧本</text><text x=\"32\" y=\"216\" font-size=\"12\" fill=\"var(--accent)\">只有演练过的恢复流程才是可靠的——备份有效性的唯一证明是恢复成功</text></svg>",
    "caption": "图 5-3：恢复演练四步流程，校验三件套是说服运营『数据没丢』的凭据"
   },
   {
    "t": "h",
    "text": "六、备份安全、监控与生命周期"
   },
   {
    "t": "p",
    "text": "备份要回答三个运维问题：备份本身安全吗、备份任务成功了吗、保留多久。安全：备份文件加密传输（mysqldump 走 SSH 隧道，xtrabackup 支持 --encrypt 加密备份），异地存一份防机房级故障；监控：备份任务失败必须告警——失败天数超过 RPO 上限就是事故，binlog 归档任务的滞后要有指标看板；生命周期：全量保留 N 天（如 30 天）+ 归档长期冷备，超出自动清理，磁盘空间按『备份体积 × 保留天数』提前规划。恢复演练的通过率要作为 SLO 纳入运维考核——演练不是可选动作，而是备份有效性的唯一证明。"
   },
   {
    "t": "p",
    "text": "binlog 的保留策略与空间也要算清楚：expire_logs_days（8.0 用 binlog_expire_logs_seconds）决定 binlog 本地保留时长，至少覆盖『全量备份周期 + 一次完整重放演练的时间』，否则全量还没跑完 binlog 已过期，PITR 出现断档。max_binlog_size（默认 1GB）控制单个文件大小，配合定期 mysqlbinlog 归档到异地存储；游戏服高峰期 binlog 生成速率可达数十 GB/小时，归档链路必须跟得上，否则本地磁盘被 binlog 写满会触发实例只读保护——这是最容易被忽视的磁盘杀手之一。"
   },
   {
    "t": "h",
    "text": "五、游戏服回档演练"
   },
   {
    "t": "list",
    "items": [
     "场景设计：误删玩家背包、外挂批量刷钻石、代码 bug 批量改错等级、drop table",
     "演练流程：故障通报 → 定 RPO/RTO 目标 → 恢复全量 → 重放 binlog → 抽检（count 对比、钻石总量守恒、抽样 hash）→ 切换上线",
     "频度：季度至少一次全流程演练（含从零搭建恢复环境）；每次版本上线前备份可验证",
     "备份策略落地：每日全量（XtraBackup）+ 每小时 binlog 增量归档；保留 N 天冷备；异地副本一份防机房级故障"
    ]
   },
   {
    "t": "pits",
    "items": [
     "坑 1：备份从不验证——磁盘坏道、工具版本不兼容会让『备份』变成『备份了个寂寞』，定期做恢复演练才是真备份",
     "坑 2：mysqldump 不带 --master-data / --set-gtid-purged——增量重放时找不到对齐点，只能盲恢复",
     "坑 3：PITR 重放后不校验数据字典——目标表主键/唯一键冲突要先清理，重复记录要先按幂等规则去重",
     "坑 4：把 xtrabackup --prepare 和 --backup 混在同一个目录跑——prepare 会修改备份文件，要 copy 一份再 prepare",
     "坑 5：只做全量不做 binlog 归档——RPO 变成 24 小时，误删后丢一天数据，玩家直接投诉到客服"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：备份黄金法则——全量加 binlog 增量缺一不可，归档频率决定 RPO；逻辑备份留给迁移与抽数据，物理备份扛生产大盘；PITR 是误删/批量改错最后一道防线，但只有『演练过』的恢复流程才是可靠的。回档演练的校验环节（count + 总量守恒 + 抽样 hash）是说服运营『数据没丢』的凭据。"
   }
  ]
 },
 {
  "id": "mysql80-advanced-features",
  "title": "MySQL 8.0 新特性与高阶功能：窗口函数、CTE、哈希连接、JSON",
  "layer": 2,
  "depends": [
   "mysql-index-btree"
  ],
  "covers": [
   "mysql-31",
   "mysql-30"
  ],
  "quiz": [
   "mysql-31"
  ],
  "body": [
   {
    "t": "lead",
    "text": "8.0 不是 5.7 的小版本，而是一次引擎级换代：窗口函数、递归 CTE、哈希连接、不可见/降序索引、instant DDL、SQL 角色——每一条都在回答『旧版要用黑魔法才做得到』的痛点。"
   },
   {
    "t": "pre",
    "items": [
     "索引与 explain 基础（mysql-index-btree）",
     "join 三代算法与 filesort 的代价（mysql-slow-sql）",
     "BI/GM 统计是 8.0 分析能力的主战场"
    ]
   },
   {
    "t": "h",
    "text": "一、窗口函数：行不折叠的组内计算"
   },
   {
    "t": "p",
    "text": "group by 把一组行折叠成一行；窗口函数保留每一行，同时附加组内计算列。常用函数：row_number() / rank() / dense_rank()（排名，区别在并列是否跳号）、lag() / lead()（取前后行，算留存与连续登录）、sum() over()（滚动累计）、ntile()（等深分箱）、percent_rank() / cume_dist()（分布）。执行时机在 where 之后、order by / limit 之前——所以分页不省窗口计算，千万级流水上开窗要先用 where 缩小输入范围。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 每个渠道付费 Top10（窗口函数的招牌场景）\nSELECT * FROM (\n  SELECT player_id, channel, pay_amount,\n         ROW_NUMBER() OVER (PARTITION BY channel ORDER BY pay_amount DESC) AS rn\n  FROM pay_log\n) t WHERE rn <= 10;\n-- 次日留存：lag 取上一登录日，比 5.7 自 join 两遍简洁一个数量级\nSELECT d, COUNT(*) AS dau,\n       SUM(DATEDIFF(d, prev_d) = 1) AS retain_1d\nFROM (\n  SELECT player_id, DATE(login_time) AS d,\n         LAG(DATE(login_time)) OVER (PARTITION BY player_id ORDER BY login_time) AS prev_d\n  FROM login_log WHERE login_time >= '2026-08-01'\n) t GROUP BY d ORDER BY d;"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">窗口函数：行不折叠，每行附加组内计算列</text><text x=\"30\" y=\"52\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">原始 5 行（player_id, channel, pay）</text><rect x=\"30\" y=\"62\" width=\"560\" height=\"120\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"46\" y=\"86\" font-size=\"12\" fill=\"var(--muted)\">1001 ios 300</text><text x=\"46\" y=\"108\" font-size=\"12\" fill=\"var(--muted)\">1002 ios 500</text><text x=\"46\" y=\"130\" font-size=\"12\" fill=\"var(--muted)\">1003 ios 400</text><text x=\"46\" y=\"152\" font-size=\"12\" fill=\"var(--muted)\">2001 android 200</text><text x=\"46\" y=\"174\" font-size=\"12\" fill=\"var(--muted)\">2002 android 600</text><path d=\"M 300 62 L 300 182\" stroke=\"var(--line)\" stroke-dasharray=\"4 3\"/><text x=\"320\" y=\"86\" font-size=\"12\" fill=\"var(--accent)\">PARTITION BY channel → 两组</text><text x=\"320\" y=\"110\" font-size=\"12\" fill=\"var(--accent)\">组内 ORDER BY pay DESC</text><text x=\"320\" y=\"134\" font-size=\"12\" fill=\"var(--accent)\">ROW_NUMBER() 附加 rn 列</text><text x=\"320\" y=\"162\" font-size=\"12\" fill=\"var(--ink)\">结果仍 5 行，每行多一列 rn</text><text x=\"320\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">group by 会折叠成 2 行——这是区别</text><text x=\"30\" y=\"216\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">与 group by 的本质区别</text><text x=\"30\" y=\"242\" font-size=\"13\" fill=\"var(--ink)\">group by：一组一行（拍集体照，丢明细）；窗口函数：每人胸前别名次牌（保留明细）</text><text x=\"30\" y=\"268\" font-size=\"12\" fill=\"var(--muted)\">执行时机在 order by / limit 之前 → 分页不省窗口计算，千万级先缩小输入范围</text></svg>",
    "caption": "图 6-1：窗口函数保留行数并附加计算列，与 group by 折叠行是根本区别"
   },
   {
    "t": "h",
    "text": "二、CTE 与递归 CTE"
   },
   {
    "t": "p",
    "text": "WITH 给子查询命名、可复用、层层嵌套不绕晕；递归 CTE（WITH RECURSIVE）能生成日期序列、遍历树形/图结构（公会层级、道具合成链）。游戏 BI 常用递归 CTE 补齐无数据日期，让报表日期不断档。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 生成 8 月连续日期序列，left join 统计表补零（无登录的日期也显示）\nWITH RECURSIVE dates AS (\n  SELECT DATE('2026-08-01') AS d\n  UNION ALL\n  SELECT DATE_ADD(d, INTERVAL 1 DAY) FROM dates WHERE d < '2026-08-31'\n)\nSELECT d, COALESCE(cnt, 0) AS dau\nFROM dates\nLEFT JOIN (SELECT DATE(login_time) AS d, COUNT(DISTINCT player_id) AS cnt\n           FROM login_log GROUP BY DATE(login_time)) s USING (d);"
   },
   {
    "t": "h",
    "text": "三、哈希连接 hash join"
   },
   {
    "t": "p",
    "text": "8.0.18 引入，等值 join 无可用索引时：对驱动表建哈希表，扫描被驱动表逐行探测，把 5.7 的 BNL（join_buffer 分批全表扫）场景提升一个数量级——小表能装进 join_buffer 内存直接完成，超内存则分批落盘。不是银弹：有索引时 NLJ 仍更优；explain 在 8.0.18+ 显示 hash join 字样（8.0.20 起优化器隐藏为新的 BNL 行为）。"
   },
   {
    "t": "h",
    "text": "四、不可见索引与降序索引"
   },
   {
    "t": "p",
    "text": "invisible index 让优化器『假装索引不存在』：删索引前的后悔药——先 ALTER INDEX idx INVISIBLE，观察生产无波动再真删，有波动立刻 VISIBLE 恢复。降序索引：8.0 真正按降序存储，order by a desc, b asc 这类混合方向排序免 filesort（5.7 只能升序存储，混合方向必走文件排序）。注意降序索引并非万能：查询的排序方向必须与索引方向完全一致才能免排序，order by a asc, b desc 与索引 (a desc, b asc) 方向不匹配时仍会 filesort。删索引前还要确认没有其他 SQL 依赖它——查 information_schema.statistics 与实际慢日志引用，别把仍在服务的索引当冗余删了。"
   },
   {
    "t": "h",
    "text": "五、JSON 类型与函数"
   },
   {
    "t": "p",
    "text": "JSON 列配合函数式索引：json_extract、->、->>、json_contains 等。8.0.17+ 支持多值索引（CAST(... AS UNSIGNED ARRAY)），加速对 JSON 数组的 WHERE ... MEMBER OF 查询。游戏服的背包/成就进度等结构化但不稳定 schema 的数据适合 JSON；高频查询字段要冗余到普通列建索引，别把 JSON 当查询主战场——JSON 计算无法利用普通索引有序性，大 JSON 文档更新也有 off-page 代价。"
   },
   {
    "t": "h",
    "text": "六、instant DDL 与原子 DDL"
   },
   {
    "t": "p",
    "text": "8.0 数据字典改为事务性 InnoDB 存储，DDL 原子化：成功即提交、失败自动回滚，不留半成品表。instant 算法（8.0.12 起，加列场景最初由腾讯游戏团队贡献）只改数据字典、秒级完成、不阻塞 DML；8.0.29 起支持任意位置加列与删列；上限 64 次 instant 变更，满了要 ALTER TABLE ... ENGINE=InnoDB 重建重置计数。注意：加主键/唯一约束列仍需 inplace（要构建索引），instant 不支持。"
   },
   {
    "t": "h",
    "text": "七、账号角色与其他"
   },
   {
    "t": "p",
    "text": "CREATE ROLE 把权限打包成角色，一次授予多人、DROP ROLE 一键回收——GM/运维/业务账号分级放权，是审计的基础。其他 8.0 红利：caching_sha2_password 默认认证、utf8mb4 默认字符集（emoji 玩家昵称零配置）、EXPLAIN ANALYZE 输出真实执行耗时（含每步 rows 与实际时间，比 explain 估算可靠）、NOWAIT / SKIP LOCKED 处理锁竞争——活动结算抢榜位点时用 NOWAIT 立即失败重试，比默认阻塞等待更可控。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 角色 + 授权\nCREATE ROLE 'gm_read';\nGRANT SELECT ON game_db.* TO 'gm_read';\nCREATE USER 'gm01'@'%' IDENTIFIED BY '***';\nGRANT 'gm_read' TO 'gm01'@'%';\nSET DEFAULT ROLE ALL TO 'gm01'@'%';\n-- 不可见索引：删索引前的后悔药\nALTER TABLE player ALTER INDEX idx_level INVISIBLE;\nEXPLAIN SELECT player_id FROM player WHERE level=30;   -- 不再走 idx_level\nALTER TABLE player ALTER INDEX idx_level VISIBLE;      -- 观察后可恢复\n-- 降序索引：混合方向排序免 filesort\nCREATE INDEX idx_mixed ON player (reg_time DESC, level ASC);"
   },
   {
    "t": "h",
    "text": "八、8.0 升级路径与兼容预检"
   },
   {
    "t": "p",
    "text": "从 5.7 升 8.0 要过兼容关：mysqlcheck --check-upgrade 预检系统表；默认认证改 caching_sha2_password，老客户端驱动不支持要显式兼容（可回退 mysql_native_password）；默认字符集 utf8mb4 解决 emoji 问题；sql_mode 默认更严格（ONLY_FULL_GROUP_BY 等，依赖宽松模式的 SQL 要逐个改写）；GROUP BY 隐式排序等旧行为被移除。游戏服升级建议：先在测试环境跑全量 SQL 回归，重点抓窗口函数/CTE 替代的老变量写法、依赖隐式排序的 SQL、老驱动认证。升级决策要有账可算——把 instant DDL、分析函数、角色、哈希连接带来的收益列进升级计划，而不是为了升级而升级。"
   },
   {
    "t": "h",
    "text": "九、JSON 实战示例与落地建议"
   },
   {
    "t": "p",
    "text": "给一个游戏背包快照的例子：成就/活动进度这类『结构变化快』的数据存 JSON 列，查询用 JSON_CONTAINS 或多值索引；但排行榜、统计等高频查询字段必须冗余普通列建索引。8.0 的 JSON 列底层是 BLOB，更新会整体重写（partial update 优化仅限 JSON_SET / JSON_REPLACE 特定场景），大文档频繁更新有写放大——背包扩展数据超过一定体积要拆到附表，别把 JSON 当万能容器。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- JSON 多值索引（8.0.17+）：加速 MEMBER OF 查询\nCREATE TABLE player_achievement (\n  player_id BIGINT PRIMARY KEY,\n  achieve_tags JSON COMMENT '成就标签数组'\n);\nALTER TABLE player_achievement ADD INDEX idx_tags\n  ((CAST(achieve_tags AS UNSIGNED ARRAY)));\n-- 查询：拥有 tag=100 成就的玩家\nSELECT player_id FROM player_achievement\nWHERE 100 MEMBER OF (achieve_tags);\n-- 聚合：渠道付费总额 JSON 数组\nSELECT JSON_ARRAYAGG(pay_amount) FROM pay_log WHERE channel = 'ios';"
   },
   {
    "t": "h",
    "text": "十、8.0 在游戏服的落地清单"
   },
   {
    "t": "list",
    "items": [
     "玩家资产库：优先吃 instant DDL 红利——加字段从小时级变秒级，维护窗口基本消失",
     "BI 统计：窗口函数 + 递归 CTE 替换 5.7 的变量黑魔法，留存、TopN、连续登录一条 SQL 搞定",
     "运维安全：不可见索引验证删索引、角色分级放权（GM/运维/业务）、原子 DDL 防半成品",
     "兼容预检：老驱动认证、严格 sql_mode、GROUP BY 隐式排序移除——三处必查"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">8.0 三大红利落点</text><rect x=\"30\" y=\"44\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"52\" y=\"72\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">分析能力</text><text x=\"48\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">窗口函数 / 递归 CTE</text><text x=\"48\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">哈希连接</text><text x=\"48\" y=\"148\" font-size=\"12\" fill=\"var(--muted)\">BI 留存 TopN 一条 SQL</text><rect x=\"230\" y=\"44\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"252\" y=\"72\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">运维安全</text><text x=\"248\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">instant DDL 秒级加列</text><text x=\"248\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">不可见索引验证删索引</text><text x=\"248\" y=\"148\" font-size=\"12\" fill=\"var(--muted)\">原子 DDL / SQL 角色</text><rect x=\"430\" y=\"44\" width=\"180\" height=\"130\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"452\" y=\"72\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">索引与 SQL</text><text x=\"448\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">降序索引 / 多值索引</text><text x=\"448\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">EXPLAIN ANALYZE</text><text x=\"448\" y=\"148\" font-size=\"12\" fill=\"var(--muted)\">NOWAIT / SKIP LOCKED</text><text x=\"32\" y=\"204\" font-size=\"13\" fill=\"var(--accent)\">升级前兼容预检：老驱动认证、严格 sql_mode、GROUP BY 隐式排序移除</text><text x=\"32\" y=\"232\" font-size=\"12\" fill=\"var(--muted)\">升级收益要有账可算：把 DDL 提速、BI 简化、运维安全列进计划，而不是为了升级而升级</text></svg>",
    "caption": "图 6-2：8.0 三大红利——分析能力、运维安全、索引与 SQL 增强"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：窗口函数与 group by 混用语义不清——窗口在 where 之后、group by 之上执行，聚合后再开窗要用子查询包一层",
     "坑 2：递归 CTE 忘写终止条件——无限递归直接打爆内存，上限由 cte_max_recursion_depth 控制（默认 1000）",
     "坑 3：instant DDL 当万能——加唯一/主键列、改列类型仍走 inplace，且 64 次上限没监控会突然报错",
     "坑 4：角色授权后用户没生效——记得 SET DEFAULT ROLE 或直接 GRANT 权限，否则连接后无权限",
     "坑 5：hash join 出现就以为最优——有索引时 NLJ 仍更优，无索引等值 join 才是它的主场"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：8.0 是『把分析能力还给 SQL、把运维安全做进引擎』的一次换代：窗口函数接管留存与 TopN、递归 CTE 生成日期序列、哈希连接救无索引 join、不可见/降序索引与 instant DDL 让 DBA 操作更安全。游戏服升级 8.0 的收益集中在 BI 与 DDL 两条线，升级时用 mysqlcheck 与 percona-toolkit 做兼容预检。"
   }
  ]
 },
 {
  "id": "mysql-sharding-middleware",
  "title": "分库分表原理与中间件选型",
  "layer": 3,
  "depends": [
   "mysql-slow-sql",
   "mysql-replication-cdc"
  ],
  "covers": [
   "mysql-07",
   "mysql-14",
   "mysql-16",
   "mysql-19",
   "mysql-30"
  ],
  "quiz": [
   "mysql-07",
   "mysql-14",
   "mysql-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "分库分表的关键不是中间件而是分片键：游戏里 player_id 是天然的单一分片键，请求 100% 落单库单表；跨库三难——深分页、join、事务——在设计上绕开而不是在中间件上硬扛。"
   },
   {
    "t": "pre",
    "items": [
     "单库单表的索引与慢 SQL 治理（节点 5）",
     "每个分片之上仍要主从复制，分片是水平扩展、复制是高可用",
     "理解『玩家维度自治』：一个请求的所有读写围绕一个玩家"
    ]
   },
   {
    "t": "h",
    "text": "为什么玩家数据天然适合按 player_id 分片"
   },
   {
    "t": "p",
    "text": "玩家的一切数据（背包、任务、邮件、养成线）以 player_id 为天然归属，一个请求的所有读写都围绕一个玩家。按 player_id 取模路由后请求只落在固定一库一表：没有跨库 join、没有分布式事务。这是游戏服比电商（按买家分片后商家查订单还要异构索引）简单的地方。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">按 player_id 取模路由：同一玩家永远落同一库</text><rect x=\"30\" y=\"55\" width=\"220\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"52\" y=\"85\" font-size=\"14\" fill=\"var(--ink)\">请求：player_id=100000123</text><text x=\"52\" y=\"112\" font-size=\"12\" fill=\"var(--muted)\">登录/背包/任务/邮件</text><text x=\"52\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">读写的表全带 player_id</text><text x=\"52\" y=\"152\" font-size=\"12\" fill=\"var(--muted)\">分片键：hash(player_id) % 8</text><path d=\"M 250 110 L 290 110\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 283 106 L 293 110 L 283 114\" fill=\"var(--accent)\"/><rect x=\"295\" y=\"55\" width=\"60\" height=\"110\" rx=\"8\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"310\" y=\"112\" font-size=\"16\" fill=\"var(--ink)\">%8</text><path d=\"M 355 110 L 395 110\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 388 106 L 398 110 L 388 114\" fill=\"var(--accent)\"/><rect x=\"400\" y=\"40\" width=\"100\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"425\" y=\"68\" font-size=\"14\" fill=\"var(--ink)\">库 3</text><text x=\"410\" y=\"90\" font-size=\"12\" fill=\"var(--muted)\">player 表 · bag 表</text><rect x=\"510\" y=\"40\" width=\"100\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"535\" y=\"68\" font-size=\"14\" fill=\"var(--ink)\">库 4</text><text x=\"520\" y=\"90\" font-size=\"12\" fill=\"var(--muted)\">mail 表 · task 表</text><rect x=\"400\" y=\"130\" width=\"100\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"425\" y=\"158\" font-size=\"14\" fill=\"var(--ink)\">库 5</text><text x=\"410\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">同玩家必落同库同组表</text><rect x=\"510\" y=\"130\" width=\"100\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"535\" y=\"158\" font-size=\"14\" fill=\"var(--ink)\">库 6</text><text x=\"520\" y=\"180\" font-size=\"12\" fill=\"var(--muted)\">规则禁止个别表自搞分片键</text><text x=\"30\" y=\"246\" font-size=\"13\" fill=\"var(--ink)\">取模：分布均匀，扩容要迁移（预分片缓解）；区间（ID 段/注册时间）：扩容平滑，滚服/新区友好</text><text x=\"30\" y=\"274\" font-size=\"12\" fill=\"var(--muted)\">跨库查询全部导流 BI：统计、排行榜类需求走日志服/BI 宽表或 OLAP，不在玩家在线库上做</text></svg>",
    "caption": "图 7-1：player_id 既是生产侧也是消费侧，请求百分百落单库单表"
   },
   {
    "t": "h",
    "text": "分布式 ID：发号四方案"
   },
   {
    "t": "p",
    "text": "UUID 无序长字符串做主键会页分裂，只适合日志 trace_id；雪花算法本地生成、趋势递增，怕时钟回拨（解决：回拨等待/报错/逻辑时钟）；号段模式一次领 1000 个本地自增，DB 压力降到 1/1000，严格递增适合主键；Redis incr 简单但引入单点依赖。游戏常用『区服号 + 库内自增』（如 1001_000001）——ID 自带区服信息，客服报 ID 就知道是哪个区，合服按规则重映射。"
   },
   {
    "t": "h",
    "text": "中间件：客户端 vs 代理"
   },
   {
    "t": "p",
    "text": "ShardingSphere-JDBC 客户端模式 jar 嵌入应用、性能好、绑定 Java；ShardingSphere-Proxy / MyCat 代理模式独立进程伪装 MySQL、对应用透明，但多一跳网络、有单点与运维成本。游戏服分片键永远是 player_id，路由逻辑就是 hash(player_id) % N，一个注解/拦截器搞定——自研轻路由零依赖、性能最好、团队完全掌控。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">客户端模式 vs 代理模式</text><rect x=\"30\" y=\"48\" width=\"280\" height=\"180\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"55\" y=\"78\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">客户端模式（JDBC）</text><text x=\"52\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">ShardingSphere-JDBC / 自研路由</text><text x=\"52\" y=\"134\" font-size=\"13\" fill=\"var(--ink)\">jar 嵌入应用进程，无额外部署</text><text x=\"52\" y=\"160\" font-size=\"13\" fill=\"var(--ink)\">性能最好，绑定 Java 技术栈</text><text x=\"52\" y=\"196\" font-size=\"12\" fill=\"var(--muted)\">游戏服：分片键永远 player_id，</text><text x=\"52\" y=\"216\" font-size=\"12\" fill=\"var(--muted)\">hash % N 一个拦截器搞定</text><rect x=\"330\" y=\"48\" width=\"280\" height=\"180\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"355\" y=\"78\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">代理模式（Proxy）</text><text x=\"352\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">MyCat / ShardingSphere-Proxy</text><text x=\"352\" y=\"134\" font-size=\"13\" fill=\"var(--ink)\">独立进程伪装 MySQL</text><text x=\"352\" y=\"160\" font-size=\"13\" fill=\"var(--ink)\">对应用透明，支持多语言</text><text x=\"352\" y=\"196\" font-size=\"12\" fill=\"var(--muted)\">代价：多一跳网络、单点、运维成本</text><text x=\"352\" y=\"216\" font-size=\"12\" fill=\"var(--muted)\">GM/BI 跨库聚合是它的价值区</text><text x=\"32\" y=\"262\" font-size=\"13\" fill=\"var(--accent)\">自研路由的代价：跨库聚合能力为零，GM 跨库需求要另建 BI 链路，分片规则变更要自己写迁移工具</text></svg>",
    "caption": "图 7-2：游戏自研轻路由因为分片键极简；跨库聚合留给 BI 链路"
   },
   {
    "t": "h",
    "text": "跨库三难与禁令"
   },
   {
    "t": "list",
    "items": [
     "深分页：limit 1000000,20 每个分片各取 1000020 条归并，灾难级——禁止深分页，用游标；业务坚持跳页走 ES/ClickHouse 异构索引",
     "join：在线库禁止；小字典表做广播表每库冗余一份（道具配置表），大表间 join 走离线数仓",
     "分布式事务：XA/2PC 持锁久性能差，TCC 写三套接口侵入大——游戏内购用本地消息表 + 可靠消息 + 消费幂等最终一致；Seata AT 适合低频后台链路"
    ]
   },
   {
    "t": "h",
    "text": "运维：日志表清理与大表 DDL"
   },
   {
    "t": "p",
    "text": "亿级日志按时间分区/分表，到期 drop partition / drop table——元数据操作秒级完成，无 undo、无大 binlog；存量表用 limit 5000 分批 delete + sleep 限速，或 pt-archiver 归档。大表加字段：8.0.12+ 的 instant 秒级只改元数据（8.0.29 支持任意位置）；不满足条件用 gh-ost 影子表 + binlog 追增量 + cut-over 原子换表。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 所有玩家相关表统一 player_id 分片，保证同玩家同库\n-- 日志表按天分表：清理即 drop，而不是 delete\nCREATE TABLE behavior_log_20260807 LIKE behavior_log_template;\n-- 大表加字段优先 instant（8.0.12+，秒级）\nALTER TABLE player ADD COLUMN channel VARCHAR(16) DEFAULT 'ios', ALGORITHM=INSTANT;"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：只答取模均匀——要讲玩家维度自治、请求百分百落单库单表，这是游戏分片的根本原因",
     "坑 2：推荐在线库做跨库 join——在线库禁 join，跨库统计归 BI/OLAP",
     "坑 3：replace into 造成自增 ID 跳变——日志/好友关系存旧 ID 全悬空，被外部引用的表禁用 replace"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分片键定生死，player_id 让游戏分片最简单；发号四方案各有权衡，区服号 + 自增最配游戏；跨库三难靠『绕开』不靠硬扛；日志清理用 DDL 代替 DML，大表 DDL 用 instant/gh-ost。"
   }
  ]
 },
 {
  "id": "mysql-player-data-sharding",
  "title": "玩家数据分片实战：一致性、合服、排行榜与分布式事务",
  "layer": 3,
  "depends": [
   "mysql-sharding-middleware"
  ],
  "covers": [
   "mysql-17",
   "mysql-20",
   "mysql-22",
   "mysql-33",
   "mysql-34"
  ],
  "quiz": [
   "mysql-17",
   "mysql-22",
   "mysql-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "玩家数据分片的实战闭环：缓存一致性、充值扣款幂等、合服迁移、全服排行榜、跨库最终一致——每个场景都围绕『玩家即分片键』展开。"
   },
   {
    "t": "pre",
    "items": [
     "分片键与路由规则（节点 7）",
     "锁、MVCC、两阶段提交知识用于资金安全",
     "Redis 缓存、ZSET 排行榜基础能力"
    ]
   },
   {
    "t": "h",
    "text": "玩家档案缓存一致性：Cache Aside"
   },
   {
    "t": "p",
    "text": "读：先查缓存，miss 回源 DB 回填；写：先更新 DB 再删缓存（删而不是更新——删除幂等，并发写不会留脏值）。为什么先 DB 后删：反过来先删后写，删完还没写 DB 时另一线程读 miss 回源旧值回填，脏缓存长期存在。删缓存失败闭环：延时双删 + MQ 重删 + Canal 订阅 binlog 触发删除 + TTL 兜底。"
   },
   {
    "t": "p",
    "text": "游戏服简化：玩家请求经 Disruptor 按 player_id 串行，同一玩家读写不并发，一致性天然简单；真正的并发在跨服共享数据（公会资金、全服限购库存）。"
   },
   {
    "t": "h",
    "text": "三崩防线（游戏版）"
   },
   {
    "t": "list",
    "items": [
     "穿透（外挂/GM 刷不存在 ID）：缓存空值 + 布隆过滤器",
     "击穿（开服/活动瞬间热点 key 过期）：逻辑过期 + setnx 互斥单线程回源",
     "雪崩（大批 key 同时过期）：TTL 随机抖动 + 多级缓存"
    ]
   },
   {
    "t": "h",
    "text": "充值扣款：三道防线"
   },
   {
    "t": "p",
    "text": "唯一索引防重复（订单表对渠道单号建唯一索引，重复回调撞索引失败或状态机拒绝）；条件 update 防超扣（update player set diamond=diamond-#{cost} where player_id=? and diamond>=#{cost}，影响 0 行即余额不足，一条 SQL 原子完成校验 + 扣减）；事务保证扣款 + 流水 + 订单状态原子。绝不能『读出来-判断-写回』三步（check-then-act 竞态）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">充值扣款三道防线</text><rect x=\"30\" y=\"50\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"52\" y=\"80\" font-size=\"14\" fill=\"var(--ink)\">防线一：唯一索引</text><text x=\"48\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">渠道单号建唯一索引</text><text x=\"48\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">重复回调撞索引失败</text><text x=\"48\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">幂等守门</text><rect x=\"230\" y=\"50\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"252\" y=\"80\" font-size=\"14\" fill=\"var(--ink)\">防线二：条件 update</text><text x=\"248\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">diamond >= cost 校验</text><text x=\"248\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">一条 SQL 原子扣减</text><text x=\"248\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">防超扣，无锁竞争</text><rect x=\"430\" y=\"50\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"452\" y=\"80\" font-size=\"14\" fill=\"var(--ink)\">防线三：事务</text><text x=\"448\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">扣款 + 流水 + 订单状态</text><text x=\"448\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">一个事务内提交</text><text x=\"448\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">原子生效</text><text x=\"32\" y=\"206\" font-size=\"13\" fill=\"var(--ink)\">架构层：Netty → Disruptor 按 player_id 哈希到固定线程串行执行</text><text x=\"32\" y=\"232\" font-size=\"13\" fill=\"var(--accent)\">同一玩家的扣款天然无并发，DB 防线只是兜底——先排队，再上锁</text><text x=\"32\" y=\"260\" font-size=\"12\" fill=\"var(--muted)\">跨库（购买服扣款 + 游戏服发货）：本地消息表 + Kafka 可靠投递 + 消费端幂等，最终一致 + 三方对账</text><text x=\"32\" y=\"282\" font-size=\"12\" fill=\"var(--muted)\">渠道回调重复乱序一律按幂等 + 状态机处理</text></svg>",
    "caption": "图 8-1：唯一索引守门、条件 update 防超扣、事务保原子，Disruptor 串行化在架构层消灭并发"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 一条 SQL 原子完成『校验余额 + 扣减』，无锁竞争\nint n = jdbc.update(\n    \"UPDATE player SET diamond = diamond - ? \" +\n    \"WHERE player_id = ? AND diamond >= ?\", cost, pid, cost);\nif (n == 0) {\n    throw new NotEnoughDiamondException(pid);\n}\n// 写流水 + 改订单状态 在同一事务内提交"
   },
   {
    "t": "h",
    "text": "全服排行榜：Redis ZSET"
   },
   {
    "t": "p",
    "text": "分库后在线库 top N 需全分片归并，数据量大且战力变化高频，不可行。工业标准：Redis ZSET，key=rank:power:server，member=player_id，score=power。ZADD 更新、ZREVRANGE 查榜、ZREVRANK 查名次，都是 O(logN)。同分用 score 编码 power * 10^13 + (10^13 - timestamp)，先达者排前。Redis 挂了从各库扫数据重建（ZADD 幂等），榜单允许分钟级延迟。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">全服排行榜：Redis ZSET</text><rect x=\"30\" y=\"50\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"52\" y=\"80\" font-size=\"14\" fill=\"var(--ink)\">战力变化事件</text><text x=\"48\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">升级/换装 → ZADD</text><text x=\"48\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">key: rank:power:server</text><text x=\"48\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">member: player_id</text><path d=\"M 210 110 L 250 110\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 243 106 L 253 110 L 243 114\" fill=\"var(--accent)\"/><rect x=\"255\" y=\"50\" width=\"180\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"277\" y=\"80\" font-size=\"14\" fill=\"var(--ink)\">Redis ZSET</text><text x=\"270\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">score = power</text><text x=\"270\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">同分编码时间戳先达者前</text><text x=\"270\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">O(logN) 读写</text><path d=\"M 435 110 L 475 110\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 468 106 L 478 110 L 468 114\" fill=\"var(--accent)\"/><rect x=\"480\" y=\"50\" width=\"140\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"498\" y=\"80\" font-size=\"14\" fill=\"var(--ink)\">查询</text><text x=\"492\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">ZREVRANGE 查 top100</text><text x=\"492\" y=\"132\" font-size=\"13\" fill=\"var(--ink)\">ZREVRANK 查名次</text><text x=\"492\" y=\"158\" font-size=\"12\" fill=\"var(--muted)\">排行榜≠在线库</text><text x=\"32\" y=\"206\" font-size=\"13\" fill=\"var(--ink)\">跨服排行：各服 ZSET 定时汇总到全局 key，或各服上报 Kafka 由排行服统一计算</text><text x=\"32\" y=\"234\" font-size=\"13\" fill=\"var(--accent)\">容灾：DB 是账本，Redis 挂了定时任务从各分库扫数据重建，重建期间读旧快照降级展示</text><text x=\"32\" y=\"262\" font-size=\"12\" fill=\"var(--muted)\">周期榜/活动榜：按周期换 key（rank:power:2026w32），结算瞬间停消费 + 归档 top N 到 DB 发奖，宁可延迟不可错发</text></svg>",
    "caption": "图 8-2：DB 只当账本不当榜，跨服归并靠周期换 key"
   },
   {
    "t": "h",
    "text": "合服迁移"
   },
   {
    "t": "p",
    "text": "停服窗口：停写排空（内存态数据先刷盘落库）→ 导出 → 转换（重名玩家加后缀、全局排行重建、公会/好友双向校验）→ 导入 → 校验（表级 count、钻石总量守恒、抽样全字段 hash 比对）→ 切路由表开服。回滚预案：旧库保留只读 N 天，出问题可回切路由。不停机方案：全量拷贝 + binlog 增量追平 + 秒级禁写切路由。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：先查余额再扣款——典型 check-then-act 竞态，并发下必然超扣，必须条件 update 一条 SQL 原子完成",
     "坑 2：缓存顺序说反（先删缓存后更 DB）——脏缓存长期存在，先 DB 后删才是标准姿势",
     "坑 3：合服没校验就切路由——count + 钻石总量守恒 + 抽样 hash 三层校验是生命线；游戏服内存缓存没刷盘就迁移会丢最近数据，定时任务/补偿任务在迁移途中写旧库也是坑"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：玩家维度串行化（Disruptor）+ 条件 update 兜底 + 唯一索引幂等 = 资金安全的铁三角；跨库靠消息表最终一致 + 对账兜底；排行榜归 Redis ZSET；合服成败在校验与回滚预案。数据库防线永远保留，架构防线让它无事可做。"
   }
  ]
 },
 {
  "id": "mysql-sql-opt-practice",
  "title": "SQL 优化实战：深分页、JOIN、排序、COUNT 与大表 DDL 改造",
  "layer": 3,
  "depends": [
   "mysql-slow-sql",
   "mysql-index-btree"
  ],
  "covers": [
   "mysql-11",
   "mysql-28",
   "mysql-29",
   "mysql-30"
  ],
  "quiz": [
   "mysql-28"
  ],
  "body": [
   {
    "t": "lead",
    "text": "纸上谈兵的优化都是『建索引』三个字；本节点把高频慢 SQL 的六类改造逐一带到具体方案——深分页、JOIN、排序、COUNT、大表 DDL、批量写入，每一个都给到可直接落地的 SQL 与工程判断。"
   },
   {
    "t": "pre",
    "items": [
     "explain 四看与索引失效清单（mysql-slow-sql / mysql-index-btree）",
     "理解 filesort、临时表、回表的代价模型",
     "日志服/GM 后台读多写少、容忍离线的特性是架构降级依据"
    ]
   },
   {
    "t": "h",
    "text": "一、深分页：limit 1000000,20 为什么慢"
   },
   {
    "t": "p",
    "text": "limit offset, size 的实现是『取 offset+size 行，扔掉前 offset 行』——offset 越大，扫描与排序的行越多，且每行都要进排序阶段，深翻页呈线性恶化。两种正解：游标分页——where id > last_id order by id limit 20，直接走主键索引定位，O(logN)，代价是不能跳页、排序键必须唯一稳定（主键或 (time, id) 联合）；延迟关联——先用覆盖索引把目标主键查出来（小集合），再 join 回原表取整行，把百万次回表压缩到几十次，适合必须跳页的场景。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 游标分页（GM 日志/玩家列表标配）\nSELECT * FROM behavior_log\nWHERE player_id = ? AND id > #{lastId}\nORDER BY id LIMIT 20;\n-- 延迟关联（必须跳页时：覆盖索引取主键 + join 回表）\nSELECT t.* FROM (\n  SELECT id FROM player\n  WHERE level >= 30 ORDER BY level DESC, id DESC LIMIT 100000, 20\n) tmp JOIN player t ON tmp.id = t.id;"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">深分页：limit offset 线性恶化 vs 游标定位</text><rect x=\"30\" y=\"44\" width=\"280\" height=\"150\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"52\" y=\"72\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">limit 1000000, 20</text><text x=\"48\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">扫 100 万行进排序</text><text x=\"48\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">排序后丢弃前 100 万行</text><text x=\"48\" y=\"148\" font-size=\"13\" fill=\"var(--ink)\">只返回最后 20 行</text><text x=\"48\" y=\"176\" font-size=\"12\" fill=\"var(--muted)\">随 offset 线性恶化，不可救</text><rect x=\"330\" y=\"44\" width=\"280\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"352\" y=\"72\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">游标 where id &gt; last_id</text><text x=\"348\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">主键索引直接定位</text><text x=\"348\" y=\"124\" font-size=\"13\" fill=\"var(--ink)\">只读 20 行 O(logN)</text><text x=\"348\" y=\"148\" font-size=\"13\" fill=\"var(--ink)\">代价：不能跳页</text><text x=\"348\" y=\"176\" font-size=\"12\" fill=\"var(--muted)\">排序键必须唯一稳定</text><text x=\"32\" y=\"222\" font-size=\"13\" fill=\"var(--accent)\">必须跳页时用延迟关联：子查询覆盖索引取 20 个主键，再 join 回表取整行</text><text x=\"32\" y=\"248\" font-size=\"12\" fill=\"var(--muted)\">BI 硬要跳页：数据同步到 ES / ClickHouse，在线库只支持游标</text><text x=\"32\" y=\"274\" font-size=\"12\" fill=\"var(--muted)\">分页插件（RuoYi/PageHelper）在大表上的 count 是另一个重灾区，见 COUNT 优化</text></svg>",
    "caption": "图 3-1：游标分页把深分页从线性扫排序降为 O(logN)，跳页需求导流 BI"
   },
   {
    "t": "h",
    "text": "二、JOIN 优化：小表驱动大表"
   },
   {
    "t": "p",
    "text": "NLJ（Index Nested-Loop）下，驱动表每行去被驱动表索引查一次，所以『驱动表越小、被驱动表索引越好』总成本越低。优化器会按统计信息估算驱动方向，但统计失真时会选错——straight_join 可强制驱动顺序（慎用）。无索引的等值 join 在 8.0.18+ 走 hash join（小表建哈希表、大表逐行探测），比 5.7 的 BNL（join_buffer 分批全表扫）快一个数量级。游戏服在线库原则：能单表就单表，join 只留给 GM/BI，且两表 join 字段类型、字符集、collation 必须一致，否则索引失效。"
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 反例：被驱动表 join 字段无索引，Extra = Using join buffer，被驱动表反复全表扫\nSELECT p.nickname, o.amount FROM pay_order o\nLEFT JOIN player p ON o.player_id = p.player_id\nWHERE o.pay_time >= '2026-08-01';\n-- 正解：player_id 有唯一索引 + 驱动表选过滤后更小的那张\nEXPLAIN SELECT p.nickname, o.amount FROM pay_order o\nSTRAIGHT_JOIN player p ON o.player_id = p.player_id\nWHERE o.pay_time >= '2026-08-01';"
   },
   {
    "t": "h",
    "text": "三、排序优化：filesort 是怎么产生的"
   },
   {
    "t": "p",
    "text": "order by 的列能利用索引有序性就免排序（Extra 无 filesort）；否则进 filesort：行估算宽度不超过 max_length_for_sort_data（默认 1024 字节）用单路排序（整行入 sort_buffer 排完直接返回），超过则双路排序（sort_buffer 只放排序列 + 主键，排完按主键回表取行）。sort_buffer 装不下就落磁盘临时文件归并排序，慢一个量级。8.0 降序索引让 order by a desc, b asc 混合方向也能走索引。优化主线：让 order by 列进联合索引，注意范围列之后无法用索引排序的问题（where a=? and b>? order by c，c 无法利用索引顺序）。"
   },
   {
    "t": "h",
    "text": "四、COUNT 优化：别在千万级表上数数"
   },
   {
    "t": "p",
    "text": "InnoDB 没有行数缓存，count(*) 必须扫描（优化器挑最小的二级索引遍历，IO 最少）。性能上 count(*) ≈ count(1) > count(主键) > count(字段)——count(字段) 要逐行判 NULL 最慢。大表优化四件套：show table status 的估算行数用于『约』类展示；预聚合 daily_stat 汇总表（T+1 跑批 + 当日增量两段相加，报表只查汇总表）；Redis 计数器（在线人数类）；统计走从库或 OLAP。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">count 语义与性能排序</text><rect x=\"30\" y=\"44\" width=\"90\" height=\"44\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"47\" y=\"71\" font-size=\"13\" fill=\"var(--ink)\">count(*)</text><rect x=\"150\" y=\"44\" width=\"90\" height=\"44\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"167\" y=\"71\" font-size=\"13\" fill=\"var(--ink)\">count(1)</text><rect x=\"270\" y=\"56\" width=\"90\" height=\"32\" rx=\"4\" fill=\"var(--lv2)\" stroke=\"var(--line)\"/><text x=\"287\" y=\"76\" font-size=\"13\" fill=\"var(--ink)\">count(主键)</text><rect x=\"390\" y=\"68\" width=\"90\" height=\"20\" rx=\"4\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"407\" y=\"83\" font-size=\"13\" fill=\"var(--ink)\">count(字段)</text><text x=\"30\" y=\"118\" font-size=\"13\" fill=\"var(--ink)\">速度从快到慢；count(字段) 逐行判 NULL 最慢，且不统计 NULL 行</text><text x=\"30\" y=\"144\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">大表 count 优化四件套</text><rect x=\"30\" y=\"156\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"46\" y=\"178\" font-size=\"13\" fill=\"var(--ink)\">近似值</text><text x=\"46\" y=\"198\" font-size=\"12\" fill=\"var(--muted)\">show table status</text><rect x=\"180\" y=\"156\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"196\" y=\"178\" font-size=\"13\" fill=\"var(--ink)\">预聚合汇总表</text><text x=\"196\" y=\"198\" font-size=\"12\" fill=\"var(--muted)\">T+1 跑批 + 当日增量</text><rect x=\"330\" y=\"156\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"346\" y=\"178\" font-size=\"13\" fill=\"var(--ink)\">Redis 计数器</text><text x=\"346\" y=\"198\" font-size=\"12\" fill=\"var(--muted)\">在线人数类</text><rect x=\"480\" y=\"156\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"496\" y=\"178\" font-size=\"13\" fill=\"var(--ink)\">从库 / OLAP</text><text x=\"496\" y=\"198\" font-size=\"12\" fill=\"var(--muted)\">报表不打在线库</text><text x=\"30\" y=\"236\" font-size=\"12\" fill=\"var(--muted)\">精确 + 实时 + 大表三者不可兼得，按业务接受度选两样</text></svg>",
    "caption": "图 3-2：count 语义排序与大表统计四件套"
   },
   {
    "t": "h",
    "text": "五、大表 DDL：instant / pt-osc / gh-ost"
   },
   {
    "t": "p",
    "text": "三代算法：copy（建临时表拷数据、全程锁写，最老）；inplace（原表空间重建、支持并发 DML，但 8.0 前加列仍要 rebuild，大表小时级）；instant（8.0.12 起仅改数据字典、秒级，早期限末尾加列，8.0.29 支持任意位置加列/删列，有 64 次上限需 OPTIMIZE 重置）。不能用 instant 时用 gh-ost/pt-osc 影子表方案：建 __gho 影子表 → 在影子表上 alter → 全量分块拷贝 + 伪装从库订阅 row 格式 binlog 追增量 → cut-over 原子 rename 换表。gh-ost 无触发器（pt-osc 靠触发器，高并发下开销大）、可暂停限速、要求原表有主键/唯一键、不支持外键。游戏 7×24 服选型：有停服窗口且表不大 → 维护期直接 alter；7×24 大表 → gh-ost 低峰跑 + max-load 限速；版本支持 instant → 吃版本红利。"
   },
   {
    "t": "h",
    "text": "六、慢查询改造案例：排行榜、分页、批量写入"
   },
   {
    "t": "list",
    "items": [
     "排行榜：在线库不直接 order by 战力 limit 100——数据进 Redis ZSET（rank:power:server），ZREVRANGE 出榜、ZREVRANK 查名次，DB 只当账本",
     "深分页：GM 玩家列表与日志查询一律游标分页；BI 跳页需求走预聚合报表或 ES 异构索引",
     "批量写入：日志服 500~1000 条一个事务、无二级索引、自增主键顺序写、按天分表（清理即 drop 而不是 delete）；binlog 用 ROW 格式下大事务事件膨胀，注意 max_binlog_cache_size"
    ]
   },
   {
    "t": "code",
    "lang": "sql",
    "code": "-- 改造后的日志批量写入（攒批一个事务，事务数 = fsync 数）\nINSERT INTO behavior_log_20260807 (player_id, event_type, event_data, ts) VALUES\n(10001, 1, '...', NOW()), (10002, 2, '...', NOW()), (10003, 1, '...', NOW());\n-- 大表加字段优先 instant（8.0.12+）\nALTER TABLE player ADD COLUMN channel VARCHAR(16) DEFAULT 'ios', ALGORITHM=INSTANT;"
   },
   {
    "t": "h",
    "text": "七、优化效果验证与回归"
   },
   {
    "t": "p",
    "text": "任何优化上线前都要回答三个问题：真的变快了吗、对写路径有没有副作用、计划会不会回退。做法：改造前后 explain 对比 type/key/rows/Extra 四项；用 EXPLAIN ANALYZE 对比真实耗时；批量写入类用基准脚本测 QPS 与 p99 延迟；上线后观察慢日志条数与主从延迟。索引是『读写权衡』——加一个索引换一次查询提速，但每次写入要多维护一棵 B+ 树，索引冗余过多时 Buffer Pool 被索引页挤占，所以删除无用索引与新增索引同等重要，8.0 的 invisible index 就是为此设计的低风险验证手段：先设 INVISIBLE 观察生产无波动，再真删。"
   },
   {
    "t": "p",
    "text": "给一个可量化的判断模型：一次慢查询的优化收益 = 执行频率 × 单次耗时下降；一次索引的写入代价 = 单条写入多维护一个 B+ 树节点的平均 IO。频率低但耗时长的报表 SQL，与频率高但耗时短的在线查询，优先级完全不同——先用 performance_schema 摘要表拿到执行频率，再决定要不要为这条 SQL 建宽索引。游戏服里 GM 报表类查询频率低，别为它堆索引；玩家在线查询频率高，值得为它设计联合索引与覆盖索引。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：深分页只想到加索引——索引救不了 offset 百万级的排序，必须换游标或延迟关联",
     "坑 2：以为 count(*) 最慢——InnoDB 对它做过专门优化（选最小二级索引扫），最慢的是 count(字段) 的逐行判 NULL",
     "坑 3：sort_buffer_size 全局调大——它是会话级参数，连接多时内存直接爆掉，先给 order by 建索引免排序",
     "坑 4：inplace 以为不锁表就随便跑——8.0 前加列仍 rebuild，IO 风暴 + 从库延迟，必须低峰 + 监控磁盘/Buffer Pool"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：优化是『用什么方案换什么代价』——深分页换游标、JOIN 换小表驱动加索引、排序换索引免 filesort、COUNT 换汇总表、大表 DDL 换 instant/gh-ost。每个改造都要 explain 验证 rows 与 Extra 确实变化再上线，并用 explain 基线防止计划回退。"
   }
  ]
 },
 {
  "id": "mysql-distributed-tx",
  "title": "分布式事务方案选型：XA、Seata AT/TCC/Saga、本地消息表与对账",
  "layer": 3,
  "depends": [
   "mysql-sharding-middleware"
  ],
  "covers": [
   "mysql-34",
   "mysql-17"
  ],
  "quiz": [
   "mysql-34"
  ],
  "body": [
   {
    "t": "lead",
    "text": "跨库跨服的『一笔业务』怎么保证不丢不错？强一致派（XA/TCC）与最终一致派（消息表/Seata AT/Saga）各有边界；游戏服的答案几乎永远是：本地消息表 + 可靠投递 + 消费幂等 + 对账兜底。"
   },
   {
    "t": "pre",
    "items": [
     "分库分表后的跨库三难（mysql-sharding-middleware）",
     "资金安全三道防线：唯一索引、条件 update、事务（mysql-player-data-sharding）",
     "理解 at-least-once 投递 + 消费幂等的最终一致模型"
    ]
   },
   {
    "t": "h",
    "text": "一、游戏服的分布式事务场景"
   },
   {
    "t": "list",
    "items": [
     "跨服结算：跨服战场/公会战结束后，各服玩家奖励发放要写多个服库",
     "支付流水：购买服扣订单库、游戏服加钻石是两个库",
     "合服迁移：两区玩家数据合并过程中的对账与回滚",
     "GM 批量操作：批量封禁/改档横跨多个分片库"
    ]
   },
   {
    "t": "h",
    "text": "二、方案全景对比"
   },
   {
    "t": "table",
    "head": [
     "方案",
     "原理",
     "一致性",
     "侵入性",
     "性能",
     "适用"
    ],
    "rows": [
     [
      "XA / 2PC",
      "prepare → commit 两阶段，DB 原生",
      "强一致",
      "低",
      "差（prepare 持锁）",
      "银行核心、低频强一致"
     ],
     [
      "Seata AT",
      "本地事务 + undo_log 前后镜像 + 全局锁",
      "最终一致（隔离弱）",
      "低（一个注解）",
      "较高",
      "常规跨库短事务（约 80% 场景）"
     ],
     [
      "Seata TCC",
      "Try 冻结 / Confirm 提交 / Cancel 回滚",
      "强一致（业务自控）",
      "高",
      "高",
      "资金级强一致、跨异构资源"
     ],
     [
      "Saga",
      "长事务拆分 + 失败逐级补偿",
      "最终一致",
      "中",
      "高（无锁）",
      "长流程、遗留系统、事件驱动"
     ],
     [
      "本地消息表",
      "订单与消息同库同事务 → MQ 投递 → 消费幂等",
      "最终一致",
      "中",
      "高",
      "游戏内购、跨服发货（项目首选）"
     ]
    ]
   },
   {
    "t": "h",
    "text": "三、XA 两阶段：为什么在线服不用"
   },
   {
    "t": "p",
    "text": "XA 把分布式事务交给数据库原生 2PC：协调者（TC）向所有参与者发 prepare，各分支本地事务执行但不提交、持锁；全部返回 ready 才统一 commit，任一失败全回滚。强一致、应用侵入低；但 prepare 阶段资源持锁阻塞、协调者单点、跨库网络延迟被放大、吞吐差——高并发游戏服直接排除，只适合低频、短事务、强一致的管理类操作（如银行对账类）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">XA 两阶段提交时序：prepare 持锁是性能死穴</text><rect x=\"30\" y=\"44\" width=\"120\" height=\"200\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"58\" y=\"150\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">协调者</text><text x=\"48\" y=\"176\" font-size=\"12\" fill=\"var(--muted)\">TC</text><text x=\"48\" y=\"222\" font-size=\"12\" fill=\"var(--muted)\">单点风险</text><rect x=\"200\" y=\"44\" width=\"180\" height=\"200\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"245\" y=\"70\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">参与者 RM1</text><text x=\"220\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">① 本地事务执行 + prepare</text><text x=\"220\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">不提交、持锁</text><text x=\"220\" y=\"164\" font-size=\"13\" fill=\"var(--ink)\">② 返回 ready</text><text x=\"220\" y=\"210\" font-size=\"13\" fill=\"var(--ink)\">③ commit 或 rollback</text><rect x=\"430\" y=\"44\" width=\"180\" height=\"200\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"475\" y=\"70\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">参与者 RM2</text><text x=\"450\" y=\"108\" font-size=\"13\" fill=\"var(--ink)\">① 本地事务执行 + prepare</text><text x=\"450\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">不提交、持锁</text><text x=\"450\" y=\"164\" font-size=\"13\" fill=\"var(--ink)\">② 返回 ready</text><text x=\"450\" y=\"210\" font-size=\"13\" fill=\"var(--ink)\">③ commit 或 rollback</text><path d=\"M 150 120 L 200 120\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 193 116 L 203 120 L 193 124\" fill=\"var(--accent)\"/><path d=\"M 200 145 L 150 145\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 157 141 L 147 145 L 157 149\" fill=\"var(--accent)\"/><path d=\"M 380 120 L 430 120\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 423 116 L 433 120 L 423 124\" fill=\"var(--accent)\"/><path d=\"M 430 145 L 380 145\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 387 141 L 377 145 L 387 149\" fill=\"var(--accent)\"/><text x=\"32\" y=\"264\" font-size=\"13\" fill=\"var(--accent)\">prepare 期间所有分支持锁 → 高并发在线服是灾难；只适合低频强一致管理类操作</text></svg>",
    "caption": "图 7-1：XA 2PC 的 prepare 阶段持锁阻塞是性能死穴，游戏服基本排除"
   },
   {
    "t": "h",
    "text": "四、Seata AT 模式：无侵入的自动补偿"
   },
   {
    "t": "p",
    "text": "一阶段：业务 SQL 执行时框架自动记录前后镜像到 undo_log 表，与业务更新同库同事务提交，随即释放本地锁——这就是『一阶段提交』，性能接近本地事务。二阶段：全部成功 → TC 通知各分支异步清理 undo_log；任一失败 → 各分支按 undo_log 生成反向 SQL 自动补偿回滚。全局锁由 TC 管理，防止不同服务并发改同一行。侵入极小（@GlobalTransactional 一个注解）。局限：只能关系型库、不支持跨异构资源（如 MySQL + Redis）、全局隔离级别较弱（官方文档说明其隔离性依赖全局锁与快照语义，弱于本地读已提交）——适合 GM 后台、运营低频跨库操作这类链路。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Seata AT：一个注解把跨分片库的操作纳入全局事务\n@GlobalTransactional(name = \"gm-batch-op\", rollbackFor = Exception.class)\npublic void gmBatchOp(List<Long> playerIds) {\n    for (Long pid : playerIds) {\n        playerMapper.deductDiamond(pid, 1000);   // 分片 A\n        logMapper.writeFlow(pid, \"GM_DEDUCT\");   // 分片 B\n    }\n}"
   },
   {
    "t": "h",
    "text": "五、Seata TCC 与 Saga"
   },
   {
    "t": "p",
    "text": "TCC：业务自己写三套接口——Try 冻结资源、Confirm 确认提交、Cancel 回滚释放。控制力最强、可包异构资源（Redis/Kafka 也能纳入），但每个分支三套实现、侵入大，且要处理空回滚/悬挂/Confirm 后 Cancel 的补偿边界（Seata 提供防悬挂防幂等框架支持）。Saga：一阶段每个参与者各自提交本地事务，出现失败就逆向逐级补偿；无锁、高吞吐、事件驱动，适合合服、跨服结算这类多步骤长流程；不保证隔离性，补偿逻辑要业务自己实现。"
   },
   {
    "t": "h",
    "text": "六、本地消息表 + MQ 最终一致：游戏服标准答案"
   },
   {
    "t": "p",
    "text": "核心是『原子性』：订单与待发消息写进同一个库的同一个事务——要么都成功要么都失败，消息不会凭空多也不会凭空少。之后投递线程扫消息表发 Kafka，游戏服消费消息发货，消费端按消息 ID 幂等（去重表唯一索引）。链路自愈：投递服务挂 → 重启扫表补投；Kafka 挂 → 消息还在 DB 里，永不丢；消费端收到重复消息 → 撞唯一索引跳过。玩家看到钻石延迟几秒到账可接受（发货中状态），但账绝不能错——幂等 + 对账缺一不可。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\"><text x=\"20\" y=\"26\" font-size=\"16\" fill=\"var(--ink)\" font-weight=\"bold\">本地消息表链路：订单与消息同库同事务是关键</text><rect x=\"30\" y=\"44\" width=\"170\" height=\"110\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/><text x=\"48\" y=\"70\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">购买服订单库</text><text x=\"48\" y=\"94\" font-size=\"12\" fill=\"var(--ink)\">一个事务内：</text><text x=\"48\" y=\"114\" font-size=\"12\" fill=\"var(--ink)\">插入订单 + 插入 outbox 消息表</text><text x=\"48\" y=\"140\" font-size=\"12\" fill=\"var(--muted)\">原子：要么都成要么都败</text><path d=\"M 200 100 L 250 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 243 96 L 253 100 L 243 104\" fill=\"var(--accent)\"/><rect x=\"255\" y=\"44\" width=\"110\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"272\" y=\"70\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">投递线程</text><text x=\"272\" y=\"94\" font-size=\"12\" fill=\"var(--muted)\">扫消息表发 Kafka</text><text x=\"272\" y=\"114\" font-size=\"12\" fill=\"var(--muted)\">挂了重启补投</text><text x=\"272\" y=\"140\" font-size=\"12\" fill=\"var(--muted)\">表即队列不丢</text><path d=\"M 365 100 L 415 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 408 96 L 418 100 L 408 104\" fill=\"var(--accent)\"/><rect x=\"420\" y=\"44\" width=\"90\" height=\"110\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"437\" y=\"70\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Kafka</text><text x=\"437\" y=\"94\" font-size=\"12\" fill=\"var(--muted)\">削峰 + 可靠投递</text><text x=\"437\" y=\"140\" font-size=\"12\" fill=\"var(--muted)\">at-least-once</text><path d=\"M 510 100 L 560 100\" stroke=\"var(--accent)\" stroke-width=\"2\"/><path d=\"M 553 96 L 563 100 L 553 104\" fill=\"var(--accent)\"/><rect x=\"565\" y=\"44\" width=\"60\" height=\"110\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/><text x=\"575\" y=\"70\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服</text><text x=\"575\" y=\"94\" font-size=\"12\" fill=\"var(--muted)\">去重表</text><text x=\"575\" y=\"114\" font-size=\"12\" fill=\"var(--muted)\">幂等发货</text><text x=\"30\" y=\"184\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">对账兜底（最终一致的验收线）</text><rect x=\"30\" y=\"202\" width=\"580\" height=\"70\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/><text x=\"48\" y=\"228\" font-size=\"13\" fill=\"var(--ink)\">定时任务比对：渠道流水（微信/苹果） × 订单库 × 发货流水 三方对账</text><text x=\"48\" y=\"252\" font-size=\"12\" fill=\"var(--muted)\">不一致 → 告警 + 补单脚本；玩家资产日对账（钻石进出总量守恒）是生命线</text><text x=\"48\" y=\"272\" font-size=\"12\" fill=\"var(--muted)\">重复消息乱序消息一律按消息 ID 幂等 + 订单状态机处理</text></svg>",
    "caption": "图 7-2：订单与消息同库同事务保证原子，Kafka 可靠投递，消费端幂等，对账兜底"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 事务 1：订单 + 消息同库同事务（关键：原子）\n@Transactional\npublic void createOrderAndNotify(Order o, String payload) {\n    orderMapper.insert(o);                                  // 订单表\n    outboxMapper.insert(o.getId(), \"PAY_NOTIFY\", payload); // 消息表\n}\n// 事务 2：消费端幂等发货（去重表 + 业务操作同事务）\n@Transactional\npublic void onPayNotify(String msgId, long playerId, int diamond) {\n    int n = dedupMapper.insertIgnore(msgId);   // 撞唯一索引返回 0\n    if (n > 0) {\n        playerMapper.addDiamond(playerId, diamond);   // 发货\n    }\n}"
   },
   {
    "t": "h",
    "text": "七、补偿与对账：最终一致的最后一公里"
   },
   {
    "t": "p",
    "text": "消息链路再可靠也有盲区：重放乱序、异常没消费、补偿 SQL 自身失败。对账是兜底——定时任务对渠道流水、订单库、发货流水三方比对，不一致告警 + 补单脚本。对账粒度：玩家资产日对账（钻石进出总量守恒）、订单状态机异常清单、跨服结算结算单核对。自动补单只处理可确定性恢复的场景（扣款成功未发货 → 补发货）；涉及资金回退（已发货需扣回）一律人工审核加工单，且所有自动补偿必须有流水、可回放、有次数上限。"
   },
   {
    "t": "h",
    "text": "八、实战决策树：一个跨服结算案例走一遍"
   },
   {
    "t": "p",
    "text": "案例：跨服公会战结束，Top3 公会每个成员发钻石。走一遍决策树：奖励金额跨多个服库、可容忍秒级延迟 → 选最终一致；方案定为本地消息表——结算服一个事务内写『结算单 + outbox 消息』，投递线程按公会成员列表生成批量消息发 Kafka，各服消费端按消息 ID 幂等发货，同一玩家消息按 player_id hash 分区保序；对账任务日核对『结算单应发数 × 单玩家金额』与『各服实发流水』，不一致告警 + 补单。为何不上 AT：结算链路是游戏内高频路径，TC 全局锁会放大跨库延迟；为何不上 TCC：为发钻石写 Try/Confirm/Cancel 三套接口成本不值——消息表方案在『可幂等 + 可重试 + 可对账』三特性下已足够。"
   },
   {
    "t": "pits",
    "items": [
     "坑 1：把 XA 当主流——prepare 持锁 + 协调者单点 + 吞吐差，高并发在线服是灾难，最终一致才是主流",
     "坑 2：AT 模式当强一致用——它的隔离性弱，跨服务并发改同一行依赖 TC 全局锁，锁冲突与脏读边界要说清",
     "坑 3：TCC 三套接口只写了 Try——Confirm/Cancel 必须幂等（空回滚/悬挂是高频翻车点），且要处理 Confirm 后 Cancel 的边界",
     "坑 4：消息表投递和消费都做了幂等，却没人做对账——对账才是最终一致系统的『验收线』，没有对账就是裸奔",
     "坑 5：undo_log 表忘建/权限没给——AT 一阶段就报错，先跑 Seata 官方初始化脚本再上线"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：分布式事务是『一致性强度 × 侵入性 × 性能』的三角债：XA 强但慢、TCC 强但重、AT 轻但隔离弱、Saga 松但补偿靠人。游戏服选型定式：资金强一致低频走 TCC、后台跨库走 AT、跨服结算/支付发货走本地消息表 + 幂等 + 对账。记住：最终一致系统，对账就是它的 ACID。"
   }
  ]
 }
]
};
