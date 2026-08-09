window.TB = window.TB || {};
window.TB["linux"] = {
  id: "linux",
  name: "Linux 与线上部署运维",
  icon: "🐧",
  nodes: [
 {
  "id": "linux-fs-basics",
  "title": "Linux 基础与文件系统",
  "layer": 0,
  "depends": [],
  "covers": [
   "linux-07"
  ],
  "quiz": [
   "linux-07"
  ],
  "body": [
   {
    "t": "lead",
    "text": "Linux 的一切都是文件，游戏服部署的所有操作（配置、日志、脚本、数据落盘）最终都落在文件系统上——把目录结构、文件类型、权限和 inode 讲透，是吃透后续所有排查命令的地基。"
   },
   {
    "t": "pre",
    "items": [
     "会用 ls / cd / cat / mkdir 等最基本的命令",
     "接触过把 jar 包、配置文件放到某个目录下的部署动作",
     "不需要 root 权限使用经验"
    ]
   },
   {
    "t": "h",
    "text": "FHS：Linux 目录结构为什么长这样"
   },
   {
    "t": "p",
    "text": "FHS（Filesystem Hierarchy Standard，文件系统层次标准）规定了根目录下各大目录的用途。你不用背全部，但要能解释出每个目录「是干什么的、游戏服运维会碰到哪个」。/bin 和 /usr/bin 放可执行命令（ls、cp 等）；/etc 放系统与应用的配置文件（java 环境变量、nginx.conf 都在这）；/var 放可变数据——/var/log 是系统日志、/var/lib 是 MySQL 数据默认目录；/home 是普通用户家目录；/opt 是第三方软件安装目录（我们常把 JDK 装到 /opt）；/tmp 是可随时清的空目录（临时文件）；/proc 是虚拟文件系统，不占磁盘，反映内核与进程状态（见进程篇）。生产环境更常见的做法是单独划一个 /data 分区，把所有游戏服应用、日志、脚本都规整到 /data 下，避免应用数据与系统盘互相挤占——这也是磁盘满告警时「系统盘 / 与数据盘 /data 分开看」的原因。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Linux FHS 目录结构（游戏服视角）</text>\n<rect x=\"275\" y=\"40\" width=\"90\" height=\"34\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"62\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">/ 根目录</text>\n<rect x=\"25\" y=\"96\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"118\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">/bin /usr/bin</text>\n<text x=\"95\" y=\"137\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">系统命令 ls/cp/tar</text>\n<rect x=\"180\" y=\"96\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"250\" y=\"118\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">/etc</text>\n<text x=\"250\" y=\"137\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">配置：profile/nginx/limits</text>\n<rect x=\"335\" y=\"96\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"405\" y=\"118\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">/var/log</text>\n<text x=\"405\" y=\"137\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">系统日志/MySQL 数据</text>\n<rect x=\"490\" y=\"96\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"560\" y=\"118\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">/home</text>\n<text x=\"560\" y=\"137\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">普通用户家目录</text>\n<rect x=\"25\" y=\"166\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">/opt</text>\n<text x=\"95\" y=\"207\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">第三方软件：JDK 等</text>\n<rect x=\"180\" y=\"166\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"250\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">/tmp</text>\n<text x=\"250\" y=\"207\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">临时文件，可随意清</text>\n<rect x=\"335\" y=\"166\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"405\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">/proc（虚拟）</text>\n<text x=\"405\" y=\"207\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">进程/内核状态接口</text>\n<rect x=\"490\" y=\"166\" width=\"140\" height=\"52\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"560\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">/data（自建）</text>\n<text x=\"560\" y=\"207\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服应用+日志分区</text>\n<text x=\"320\" y=\"248\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">部署习惯：应用与系统盘分离，/data 独立分区，df 报警先分清是系统盘还是数据盘</text>\n</svg>",
    "caption": "图 1：FHS 目录树与游戏服部署落点"
   },
   {
    "t": "h",
    "text": "文件类型：ls -l 第一列不只是 d 和 -"
   },
   {
    "t": "p",
    "text": "ls -l 输出的第一列首字符表示文件类型：- 普通文件、d 目录、l 软链接、b/c 块/字符设备、s 套接字（socket）、p 命名管道（FIFO）。游戏服运维会实际碰到：日志是 -，配置目录是 d，nohup 启动产生的 /dev/null 是 c，而进程间通信可能出现 s 开头的 socket 文件。认识这些类型有个实际用途：df -h 与 du 对不上、find 找不到某个文件却报「文件存在」，很多时候就是类型判断问题；另外 /dev/null 这种特殊文件反复被重定向（2>&1 >/dev/null），理解它是字符设备就不会疑惑为什么往里写多少数据都「不占磁盘」。"
   },
   {
    "t": "h",
    "text": "权限 rwx 与 chmod / chown"
   },
   {
    "t": "p",
    "text": "权限三位数字是每类用户的 rwx 累加值：r=4（读）、w=2（写）、x=1（执行）。755 = 所有者 7（rwx），组和其他 5（r-x）；644 = 所有者 6（rw-），组和其他 4（r--）。对文件：r 可读内容、w 可改内容、x 可执行；对目录语义完全不同——r 能列出文件名（ls）、w 能增删文件、x 才能进入目录（cd），所以目录至少要有 x，否则有 w 也无法操作里面的文件。生产部署最常见的权限问题：脚本上传后没加执行位报 Permission denied；scp 从 Windows 传来的脚本带 CRLF 换行符报 bad interpreter（用 dos2unix 或 sed -i 's/\\r$//' 转换）；部署账号对日志目录无写权限导致 logback 启动即失败。所以部署收尾要 chown -R appuser:appgroup /data/game 把整个目录归属给专用账号。"
   },
   {
    "t": "table",
    "head": [
     "数字",
     "rwx",
     "含义",
     "典型场景"
    ],
    "rows": [
     [
      "7",
      "rwx",
      "读+写+执行",
      "启动脚本、jar 的所属者"
     ],
     [
      "6",
      "rw-",
      "读+写",
      "配置文件、日志文件"
     ],
     [
      "5",
      "r-x",
      "读+执行",
      "脚本的组/其他用户"
     ],
     [
      "4",
      "r--",
      "只读",
      "只读配置文件、公钥文件"
     ],
     [
      "0",
      "---",
      "无权限",
      "私钥之外禁止任何访问"
     ]
    ]
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "chmod 755 start.sh              # 所有者rwx，组和其他r-x\nchmod 644 app.conf              # 所有者rw，组和其他r\nchmod u+x start.sh              # 只给所有者加执行位\nchmod -R 755 /data/game         # 递归设置整个目录\nchown -R appuser:appgroup /data/game  # 目录归属专用账号\nchown appuser:appgroup app.jar\n\nls -ld /data/game               # 看目录本身的权限\nstat app.jar                    # 看完整元信息（含 inode）\nls -li app.jar                  # -i 直接打印 inode 号"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">权限三位拆分：rwxr-xr-x（755）</text>\n<rect x=\"30\" y=\"46\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"122\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">所有者 u</text>\n<text x=\"122\" y=\"94\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\">r w x</text>\n<text x=\"122\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">= 7</text>\n<text x=\"122\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可读可写可执行</text>\n<rect x=\"228\" y=\"46\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">所属组 g</text>\n<text x=\"320\" y=\"94\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\">r - x</text>\n<text x=\"320\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">= 5</text>\n<text x=\"320\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">可读可执行</text>\n<rect x=\"426\" y=\"46\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"518\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">其他人 o</text>\n<text x=\"518\" y=\"94\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\">r - x</text>\n<text x=\"518\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">= 5</text>\n<text x=\"518\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只读+执行</text>\n<text x=\"320\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">规则：r=4 w=2 x=1，按「所有者/组/其他」三组累加；目录的 x 是进入门槛，缺 x 则 w 无意义</text>\n<text x=\"320\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">生产安全基线：不用 root 跑游戏服，专用账号 + 精确 sudo，密码文件 chmod 600</text>\n</svg>",
    "caption": "图 2：rwx 权限三位拆分与数字换算"
   },
   {
    "t": "h",
    "text": "软链接与硬链接：inode 视角看文件"
   },
   {
    "t": "p",
    "text": "inode 是文件的「身份证」，记录文件大小、权限、所有者、时间戳、数据块指针，文件名只是 inode 的入口。硬链接是在同一文件系统内新增一个目录项指向同一个 inode，两个名字删除其一不影响另一个，本质是 inode 引用计数 +1；软链接（符号链接）是一个独立的文件，内容存的是「目标路径」，目标被删它就悬空（dangling）。运维场景里两个都用得到：发布系统的 /data/app/gm/current -> v1.2.0 软链回滚（见发布篇）；日志目录做硬链接备份的场景很少，但「同 inode 是同一个文件」这个判断技巧很实用——比如用 ln 对配置文件做硬链接备份，改了任意一个名字文件内容都同步，因为底层是同一个 inode。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">软链接与硬链接对比</text>\n<rect x=\"30\" y=\"46\" width=\"280\" height=\"140\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">软链接 ln -s</text>\n<text x=\"170\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">link 是独立文件，内容=目标路径</text>\n<rect x=\"60\" y=\"104\" width=\"100\" height=\"30\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"110\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">link -> app.jar</text>\n<rect x=\"180\" y=\"104\" width=\"100\" height=\"30\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"230\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">app.jar (inode=100)</text>\n<path d=\"M160 119 L180 119\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#ha1)\"/>\n<text x=\"170\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">目标删除 → 悬空链接，路径失效</text>\n<rect x=\"335\" y=\"46\" width=\"280\" height=\"140\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"475\" y=\"68\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">硬链接 ln</text>\n<text x=\"475\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">两个目录项指向同一 inode（引用计数）</text>\n<rect x=\"370\" y=\"104\" width=\"90\" height=\"30\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"415\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a.log</text>\n<rect x=\"475\" y=\"104\" width=\"90\" height=\"30\" rx=\"5\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">b.log</text>\n<path d=\"M460 119 L475 119\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#ha2)\"/>\n<path d=\"M505 104 L505 80 L565 80 L565 104\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#ha3)\"/>\n<rect x=\"545\" y=\"70\" width=\"44\" height=\"24\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"567\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">inode</text>\n<text x=\"475\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">删除一个名，另一名仍有效；仅限同文件系统</text>\n<defs><marker id=\"ha1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker><marker id=\"ha2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--ink)\"/></marker><marker id=\"ha3\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">发布常用软链：/data/app/gm/current -> v1.2.0，回滚只需改指针</text>\n</svg>",
    "caption": "图 3：软链接与硬链接的 inode 指向关系"
   },
   {
    "t": "h",
    "text": "磁盘空间与 inode 耗尽"
   },
   {
    "t": "p",
    "text": "磁盘满有两个维度：容量满（block 用完）和 inode 满（文件条目用完）。游戏服日志海量小文件时（比如每行日志一个文件、玩家背包快照文件），可能出现 df -h 只用了 30% 但 df -i 显示 100%——新文件创建报 No space left on device，但 df -h 明明有空间，这是最迷惑人的坑。排查命令：df -h 看容量、df -i 看 inode、find /data -type f | wc -l 统计文件数、find / -xdev -type f -size +1G 找超大文件。清理要配合日志轮转（logrotate）与保留策略，而不是手动 rm（见磁盘与存储篇）。"
   },
   {
    "t": "pits",
    "items": [
     "把目录的 x 权限说成「执行」：目录 x 是进入门槛，缺 x 则 r/w 都无法真正操作文件",
     "chmod 用成 chmod 777 一把梭：生产日志/脚本 755 足够，777 会被安全审计直接标记",
     "软链接叫「快捷方式」不严谨：软链内容存的是路径，路径失效会悬空，快捷方式语义不同",
     "df -h 显示有空间但写文件报 No space：一定是没看 df -i（inode 耗尽），游戏服小文件海量时必踩",
     "用 root 跑游戏服：被 RCE 后整机沦陷，最小权限原则是安全基线"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：FHS 目录各有职责，/data 独立分区是游戏服部署标配；权限用 r=4/w=2/x=1 换算，目录权限语义特殊；inode 是文件本质身份，软链存路径、硬链接共享 inode；磁盘满要同时看容量与 inode 两个维度。下一篇把这些命令串成高频命令集。"
   }
  ]
 },
 {
  "id": "linux-command-suite",
  "title": "高频命令集：文件与文本处理",
  "layer": 0,
  "depends": [
   "linux-fs-basics"
  ],
  "covers": [
   "linux-03",
   "linux-05"
  ],
  "quiz": [
   "linux-03",
   "linux-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "文件五件套 + 文本三剑客（grep/awk/sed）+ 管道，是游戏服线上日志分析的瑞士军刀——不把几个 G 的日志拉回本地，就能在机器上完成「筛行、切列、统计、清洗」四步定位。"
   },
   {
    "t": "pre",
    "items": [
     "已经掌握 ls/cd/cat 等基本命令",
     "理解标准输出与重定向的概念",
     "知道游戏服日志一般长什么样（时间戳 + 级别 + 玩家 ID + 消息）"
    ]
   },
   {
    "t": "h",
    "text": "文件操作五件套：ls / cp / mv / rm / tar"
   },
   {
    "t": "p",
    "text": "ls 要会用 -l（详细信息）、-h（人性化大小）、-t（按时间排序）、-lt（时间+详情）。cp 注意 -r 递归拷贝目录、-p 保留权限时间戳；mv 同分区是改名字瞬间完成、跨分区是复制+删除。rm 是危险操作——生产上绝不直接 rm 正在被进程写着的日志，正确姿势是 > file 清空（重定向清空不释放句柄）或先停写再删。tar 是发布核心：tar -zcvf 打包压缩、tar -zxvf 解包，-C 指定解包目录，加 --exclude 排除日志目录；游戏服打发布包时常用 tar czf pkg.tar.gz --exclude='*.log' --exclude='logs' 把无用日志剔除，包体积能小一个数量级。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 文件操作\nls -lht /data/game/logs\ncp -r /data/app/v1.0.0 /data/app/v1.0.1\nmv game.jar.old game.jar.bak     # 改名（同分区瞬时完成）\n\n# tar 打包/解包（发布核心）\ntar czf game-1.2.0.tar.gz --exclude='logs' --exclude='*.log' -C /data/build game/\ntar zxvf game-1.2.0.tar.gz -C /data/app/v1.2.0\n\n# 清空日志（不删文件、不中断写）\n> /data/game/logs/game.log\n\n# 找超大文件\nfind /data -xdev -type f -size +1G"
   },
   {
    "t": "h",
    "text": "文本三剑客：grep 筛行、awk 切列统计、sed 清洗"
   },
   {
    "t": "p",
    "text": "grep 负责「筛行」：grep 'pay callback error' game.log 找关键字；-c 直接计数；-A 5 / -B 5 看上下文（排查 NPE 堆栈必备）；-v 反向过滤；-E 用正则；zgrep 直接搜压缩的历史日志不用解压。awk 负责「切列做统计」：默认按空白切分，$1、$2 取列；awk '{print $5}' 取第五列；awk '/error/{cnt[$7]++} END{for(k in cnt) print k, cnt[k]}' 就是 SQL 的 group by——按第 7 列聚合计数。sed 负责「清洗截取」：sed -n '10,20p' file 打印 10 到 20 行；sed -n '/2026-08-01 10:00/,/2026-08-01 10:05/p' file 按时间窗截取，这是定位故障窗口的神器；sed 's/foo/bar/g' 做替换。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# grep：筛行 + 上下文 + 计数\ngrep 'pay callback error' game.log\ngrep -c 'NPE' game.log                      # 数出现次数\ngrep -A 20 -B 5 'Exception' game.log        # 拿完整堆栈\ngrep -v 'heartbeat' game.log                # 反向过滤心跳\nzgrep 'pay error' game.log.2026-08-01.gz     # 直接搜压缩历史日志\n\n# awk：切列统计（频率排行榜万能组合）\ngrep 'pay callback' game.log | awk '{print $7}' | sort | uniq -c | sort -rn | head\nawk '/payError/{cnt[$7]++} END{for(k in cnt) print k, cnt[k]}' game.log\n\n# sed：时间窗截取（定位故障窗口）\nsed -n '/2026-08-01 14:02/,/2026-08-01 14:05/p' game.log\nsed -i 's/oldOrderId/newOrderId/g' conf.xml     # 批量替换"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">文本三剑客 + 管道 = 线上日志的 SQL</text>\n<rect x=\"30\" y=\"50\" width=\"140\" height=\"64\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">grep 筛行</text>\n<text x=\"100\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">找关键字/上下文</text>\n<rect x=\"190\" y=\"50\" width=\"140\" height=\"64\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"260\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">awk 切列</text>\n<text x=\"260\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">$N 取列 / 聚合计数</text>\n<rect x=\"350\" y=\"50\" width=\"140\" height=\"64\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">sed 清洗</text>\n<text x=\"420\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">时间窗/替换</text>\n<rect x=\"510\" y=\"50\" width=\"120\" height=\"64\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"570\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">sort|uniq</text>\n<text x=\"570\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">频率排行榜</text>\n<path d=\"M170 82 L190 82\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#cm1)\"/>\n<path d=\"M330 82 L350 82\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#cm1)\"/>\n<path d=\"M490 82 L510 82\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#cm1)\"/>\n<defs><marker id=\"cm1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"140\" width=\"600\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"330\" y=\"164\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">实战：统计充值回调报错涉及的订单号</text>\n<text x=\"330\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">sed 截时间窗 → grep 'payError' 筛报错 → awk '{print $7}' 取订单号 → sort | uniq -c | sort -rn | head 排行</text>\n<text x=\"330\" y=\"206\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">全程不把几 G 日志拉回本地，一台机器一条管道搞定</text>\n</svg>",
    "caption": "图 4：grep/awk/sed/sort 组合成线上日志 SQL"
   },
   {
    "t": "h",
    "text": "find 找文件与通配符"
   },
   {
    "t": "p",
    "text": "find 是「按属性找文件」的正规军：find /data/logs -name '*.log' -mtime -1 找最近一天修改的日志；find /data -size +1G 找超大文件；find / -name 'core' -type f 找核心转储。注意 find 的 -mtime 是「整数天」，-mmin 可以精确到分钟。配合 -exec 可以批量操作：find /data/logs -name '*.log' -mtime +7 -exec rm {} \\; 删除 7 天前的日志——但生产上优先用 logrotate 而不是裸 rm。通配符 * ? [ ] 在 shell 里由 glob 展开，区分正则与 glob 是个考点：* 在 glob 是任意字符、在 grep 正则里是「前一个字符重复任意次」。"
   },
   {
    "t": "h",
    "text": "head / tail / less 看日志的正确姿势"
   },
   {
    "t": "p",
    "text": "tail -n 5000 看最近五千行、tail -f 实时跟踪、tail -F 在日志被切割（mv 后重建）后还能继续跟踪——logrotate 场景必须用 -F 否则盯着旧句柄收不到新内容。head 看文件开头确认启动时间。less 是大文件翻查神器：按需读入，10G 文件秒开；进 less 后 /Exception 向下搜、?Exception 向上搜、G 到文件尾、g 回开头、q 退出。反面教材是用 vim 打开 10G 日志：全量读入 + 建 swap，内存直接爆掉。游戏服玩家投诉「合成道具卡死」，标准姿势是 sed 截时间窗 → grep 玩家 ID（用 playerId 而不是昵称，昵称有编码坑）→ grep -A 20 拿堆栈。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "tail -F /data/game/logs/game.log          # 切割后仍跟踪\nhead -n 20 /data/game/logs/game.log       # 看启动时间\nless /data/game/logs/game.log             # 大文件翻查，按需读入\n\n# 玩家卡死定位三连\ngrep 'playerId=10086' game.log | tail -50\nsed -n '/2026-08-01 14:02/,/2026-08-01 14:05/p' game.log | grep '10086'\nsed -n '/2026-08-01 14:02/,/2026-08-01 14:05/p' game.log | grep -A 20 'Exception'"
   },
   {
    "t": "h",
    "text": "实战复盘：充值未到账的完整排查"
   },
   {
    "t": "p",
    "text": "玩家投诉充值未到账，日志几个 G，流程是：1) 拿玩家 ID 和充值时间点；2) sed -n 截取支付回调时间窗；3) grep 玩家 ID 锁到该玩家所有回调报文；4) grep -A 20 看异常堆栈；5) 结论通常是两类——渠道签名验证失败（渠道侧问题）或我方发货逻辑抛异常（业务 bug）。整个过程一台机器、一条管道完成。这是文本三剑客组合能力的真实考试题，面试答这段比背十个参数强得多。"
   },
   {
    "t": "pits",
    "items": [
     "grep 搜日志用昵称：昵称有编码问题，必须用 playerId/traceId 等稳定字段",
     "用 vim/cat 打开 10G 日志：vim 全量读入建 swap 内存暴涨，less 按需读入秒开",
     "tail -f 在日志切割后跟丢了：必须 -F 才能检测文件重建重新打开",
     "只背参数不演示管道组合：grep→awk→sort|uniq -c→sort -rn 是频率统计万能链，要能一口气写出来",
     "awk 列号对错：默认按连续空白切分，日志格式一变列号就变，先 head 一行确认列序"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：文件五件套管「搬移打包」，文本三剑客管「筛切洗」，sort|uniq 管「统计排行」，管道把它们串成线上 SQL；tail -F/less/zgrep 是日志查看三正确姿势；一切以 playerId 为锚点、先截时间窗再筛人是游戏服定位的通用打法。下一篇进入进程管理。"
   }
  ]
 },
 {
  "id": "linux-process-mgmt",
  "title": "进程管理：状态、信号与守护",
  "layer": 1,
  "depends": [
   "linux-command-suite"
  ],
  "covers": [
   "linux-04",
   "linux-13"
  ],
  "quiz": [
   "linux-04",
   "linux-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服是一个 Java 进程，运维的本质就是管好这个进程：看清它在干嘛（ps/top）、搞懂它的状态（运行/睡眠/僵尸）、用对信号（kill）、再决定谁来守护它（nohup/systemd）。"
   },
   {
    "t": "pre",
    "items": [
     "会用 ls/cd/grep，熟悉管道",
     "知道 PID 是进程号",
     "部署过 Java 服务，见过 nohup 启动命令"
    ]
   },
   {
    "t": "h",
    "text": "看清进程：ps / top / pstree / pidof"
   },
   {
    "t": "p",
    "text": "ps -ef 看全量进程列表（-f 完整格式含启动命令），ps -fp PID 看单个进程；ps -eo pid,ppid,state,comm,rss --sort=-rss 按内存排序找大户；ps aux 的 CPU 列是累计均值不是瞬时值，看瞬时 CPU 用 top。top 是交互式：按 P 按 CPU 排序、按 M 按内存排序、按 T 按累计时间排序、q 退出，按 1 看每个核。pstree -p 把进程树画出来，一眼看出谁是谁的父进程——排查孤儿进程、确认 Java 进程是 systemd 拉起的还是 nohup 流浪的非常直观。pidof java 或 pgrep -f 'game.jar' 按名字找 PID，比 grep 更精确（pgrep -f 匹配完整命令行，能区分 game.jar 和 gm-admin.jar）。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "ps -ef | grep game.jar                # 找游戏服进程\nps -fp 12345                          # 看单个进程完整命令\nps -eo pid,ppid,state,comm,rss --sort=-rss | head\npidof java                            # 按名字找 PID\npgrep -af game.jar                    # 按命令行匹配（推荐）\npstree -p 12345                       # 看进程树\n\n# 找 D 状态（不可中断睡眠，卡 IO）进程\nps -eo state,pid,comm | grep '^D'\n# 找僵尸进程\nps -eo stat,ppid,pid,comm | awk '$1 ~ /Z/'"
   },
   {
    "t": "h",
    "text": "进程状态与僵尸进程"
   },
   {
    "t": "p",
    "text": "top/ps 里 STAT 列是状态标识：R 运行中或就绪、S 可中断睡眠（等事件，可被信号唤醒）、D 不可中断睡眠（等内核 IO 返回，信号排不进去，kill -9 也没用）、T 停止、Z 僵尸、I 空闲。D 状态堆积是磁盘/存储层故障的典型信号——游戏服落地刷盘撞上磁盘打满，业务线程全卡在 write 系统调用上，top 显示一堆 D，load 爆炸但 CPU 空闲。僵尸进程是「子进程已死但父进程没调用 wait 收尸」，占着 PID 与内核进程表项不占内存；大量 Z 通常是父进程有 bug（如 Java 的 Process 对象没 close/没 waitFor）。父进程退出后，僵尸会被 init/systemd 收养并清理，所以根治是修父进程，不是 kill -9 僵尸（僵尸杀不掉）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">进程状态机与两类「异常态」</text>\n<rect x=\"40\" y=\"48\" width=\"130\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">R 运行/就绪</text>\n<text x=\"105\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">吃 CPU</text>\n<rect x=\"200\" y=\"48\" width=\"130\" height=\"50\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"265\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">S 可中断睡眠</text>\n<text x=\"265\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">等事件，可唤醒</text>\n<rect x=\"360\" y=\"48\" width=\"130\" height=\"50\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"425\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">D 不可中断睡眠</text>\n<text x=\"425\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">等 IO，kill 不掉</text>\n<rect x=\"520\" y=\"48\" width=\"100\" height=\"50\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"570\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">T 停止</text>\n<text x=\"570\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SIGSTOP/SIGTSTP</text>\n<path d=\"M105 98 L105 130\" stroke=\"var(--ink)\" stroke-width=\"1.5\" marker-end=\"url(#pm1)\"/>\n<path d=\"M105 130 L300 130\" stroke=\"var(--ink)\" stroke-width=\"1.5\" marker-end=\"url(#pm1)\"/>\n<rect x=\"200\" y=\"118\" width=\"200\" height=\"30\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"300\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">Z 僵尸：已死未收尸</text>\n<path d=\"M425 98 L425 130\" stroke=\"var(--ink)\" stroke-width=\"1.5\" marker-end=\"url(#pm1)\"/>\n<rect x=\"360\" y=\"118\" width=\"130\" height=\"30\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"425\" y=\"138\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">僵尸清理：父进程 wait</text>\n<rect x=\"30\" y=\"176\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">排查口诀</text>\n<text x=\"320\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">D 多 → iostat 看磁盘；Z 多 → 修父进程没 wait；R 多且 us 高 → CPU 热点定位（见性能四件套）</text>\n<defs><marker id=\"pm1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--ink)\"/></marker></defs>\n</svg>",
    "caption": "图 5：进程状态机与异常态排查方向"
   },
   {
    "t": "h",
    "text": "信号与 kill：为什么不能上来就 kill -9"
   },
   {
    "t": "p",
    "text": "kill 的本质是发信号，默认发 SIGTERM（15）。游戏服必须走「优雅停机」：kill（SIGTERM）触发 JVM shutdown 钩子——踢下线、强制落地玩家数据、关连接、停线程池；超时（如 30 秒）后才允许 kill -9（SIGKILL）。SIGKILL 由内核直接终止，钩子不执行，内存里未落地的玩家数据直接丢，还能导致依赖状态的服务（如排行榜、在线列表）数据不一致。常用信号：SIGHUP（1）终端挂断/重读配置、SIGINT（2）Ctrl+C、SIGTERM（15）优雅终止、SIGKILL（9）强杀、SIGSTOP（19）暂停、SIGCONT（18）继续。JVM 应用还能注册 shutdown 钩子处理清理逻辑；kill -0 PID 是「探测进程还活着」的惯用技巧（不发信号只检测），部署脚本里判断进程是否还在就用它。"
   },
   {
    "t": "table",
    "head": [
     "信号",
     "编号",
     "行为",
     "运维场景"
    ],
    "rows": [
     [
      "SIGTERM",
      "15",
      "优雅终止",
      "kill PID：JVM 触发 shutdown 钩子，游戏服主用"
     ],
     [
      "SIGKILL",
      "9",
      "强制终止",
      "kill -9 PID：超时后兜底，会丢未落地数据"
     ],
     [
      "SIGHUP",
      "1",
      "挂断/重读配置",
      "nohup 忽略它；部分进程用它 reload 配置"
     ],
     [
      "SIGINT",
      "2",
      "Ctrl+C",
      "前台进程中断"
     ],
     [
      "SIGSTOP",
      "19",
      "暂停",
      "Ctrl+Z 暂停任务，kill -CONT 恢复"
     ],
     [
      "SIGQUIT",
      "3",
      "退出+转储",
      "JVM 收到会打线程 dump（可用 jstack 替代）"
     ]
    ]
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "kill 12345                        # SIGTERM 优雅停机\nsleep 30\nkill -0 12345 && echo 'still alive'   # 探测是否已退出\nkill -9 12345                     # 超时兜底强杀\n\n# 部署脚本里「杀不干净就确认端口」\nkill 12345; for i in $(seq 1 30); do\n  kill -0 12345 || break\n  sleep 1\ndone\nkill -0 12345 && kill -9 12345\nss -lntp | grep :8080 || echo 'port released'"
   },
   {
    "t": "h",
    "text": "nohup / & / setsid：前台、后台与守护的区别"
   },
   {
    "t": "p",
    "text": "直接 java -jar game.jar 是前台运行，Ctrl+C 就挂；java -jar game.jar & 是后台运行，但退出终端时 SIGHUP 会把它带走；nohup java -jar game.jar > game.log 2>&1 & 是「忽略 SIGHUP + 后台 + 重定向输出」，是目前最通用的手工启动姿势——但记住 nohup 只是「防挂断」，不是守护：进程崩了没人拉起，服务器重启后不会自启。setsid 可以完全脱离会话（新会话首进程），适合不想被终端生命周期影响的场景，但生产上这些都不如 systemd 正规。判断方式：pstree 看进程挂在哪个父进程下，挂在 systemd(1) 下就是被守护的，挂在 bash 下就是手工起的。"
   },
   {
    "t": "h",
    "text": "systemd：现代进程守护的标准答案"
   },
   {
    "t": "p",
    "text": "systemd 接管 init，服务用 unit 文件描述。/etc/systemd/system/game.service 写一个 [Service] 段：ExecStart 启动命令、User 指定专用账号（不用 root）、Restart=on-failure 崩溃自动拉起、RestartSec=10 重启间隔、StartLimitBurst + StartLimitIntervalSec 防崩溃循环（熔断）、LimitNOFILE 提文件描述符上限。systemctl daemon-reload 重载配置（改 unit 必执行）、systemctl enable game 开机自启、systemctl start/stop/restart/status game 管理、journalctl -u game 看日志。Restart=always 与 on-failure 的区别是考点：always 无论怎么退出都拉起（手动 stop 也会被拉起），on-failure 只在异常退出（非 0 退出码/被信号杀）时拉起——游戏服维护停服时用 systemctl stop 正常退出，不该被自动拉起，所以配 on-failure 更合理，再配 StartLimitBurst 防止「起来就崩」死循环把机器拖垮。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# /etc/systemd/system/game.service\n[Unit]\nDescription=Game Server\nAfter=network.target\n\n[Service]\nType=simple\nUser=appuser\nWorkingDirectory=/data/game\nExecStart=/usr/bin/java -Xmx8g -jar /data/game/game.jar\nRestart=on-failure\nRestartSec=10\nStartLimitBurst=5\nStartLimitIntervalSec=60\nLimitNOFILE=655350\n\n[Install]\nWantedBy=multi-user.target\n\n# 操作命令\nsystemctl daemon-reload\nsystemctl enable game\nsystemctl start game\nsystemctl status game\njournalctl -u game -n 50 -f"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">三类进程守护方式对比</text>\n<rect x=\"25\" y=\"48\" width=\"190\" height=\"150\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">nohup &</text>\n<text x=\"120\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">只防 SIGHUP 挂断</text>\n<text x=\"120\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">崩溃无拉起机制</text>\n<text x=\"120\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">重启不自启</text>\n<text x=\"120\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\" font-weight=\"bold\">只适合临时/测试</text>\n<rect x=\"225\" y=\"48\" width=\"190\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">systemd ★主流</text>\n<text x=\"320\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">崩溃拉起 + 开机自启</text>\n<text x=\"320\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Restart/StartLimit 熔断</text>\n<text x=\"320\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">journalctl 统一日志</text>\n<text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">系统原生，生产首选</text>\n<rect x=\"425\" y=\"48\" width=\"190\" height=\"150\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">supervisor</text>\n<text x=\"520\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Python 进程管理器</text>\n<text x=\"520\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">web 管理界面</text>\n<text x=\"520\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>适合老系统/多进程</text>\n<text x=\"520\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无 systemd 时备选</text>\n<rect x=\"25\" y=\"210\" width=\"590\" height=\"34\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\" font-weight=\"bold\">游戏服特例：有状态服务拉起前要先告警+数据校验（踢人/刷盘/维护模式），不能盲目秒拉起</text>\n</svg>",
    "caption": "图 6：nohup / systemd / supervisor 守护能力对比"
   },
   {
    "t": "h",
    "text": "游戏服进程管理的三个要点"
   },
   {
    "t": "p",
    "text": "一是优雅停机优先：部署/维护一律 kill（SIGTERM），给 shutdown 钩子时间落地数据，超时才 -9；二是守护 + 监控双保险：systemd 拉起后必须发告警，自动拉起会掩盖崩溃频率，反过来耽误根治（进程消失 1 分钟电话告警）；三是有状态服务不能盲目秒拉起：崩溃瞬间内存可能有未落地数据，拉起后先查数据完整性，进维护模式校验再放玩家登录，否则数据回滚、奖励重复、旧连接状态错乱全来了。"
   },
   {
    "t": "pits",
    "items": [
     "上来就 kill -9：不执行 shutdown 钩子，游戏服丢未落地玩家数据；先 SIGTERM 超时再 -9",
     "把 nohup 当守护：nohup 只防挂断，崩溃拉起/开机自启都没有，生产必须 systemd/supervisor",
     "Restart=always 配在有状态服务：手动 stop 也会被拉起，维护停服变自动复活，应配 on-failure",
     "kill 僵尸进程：僵尸已经死了，kill 不掉，根因在父进程没 wait；杀父进程让 systemd 收养",
     "改 unit 不执行 daemon-reload：配置不生效，改完必须先 systemctl daemon-reload"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：ps/pgrep/pstree 看清进程，状态机里 D 看磁盘、Z 修父进程；kill 默认 SIGTERM 优雅停机，-9 是最后手段；nohup 只是防挂断，systemd 是生产守护标准（Restart=on-failure + 熔断 + 开机自启）；有状态游戏服拉起前要告警校验。下一篇用网络工具排查连接与端口。"
   }
  ]
 },
 {
  "id": "linux-net-troubleshoot",
  "title": "网络排查：连接状态与延迟定位",
  "layer": 1,
  "depends": [
   "linux-command-suite"
  ],
  "covers": [
   "linux-11"
  ],
  "quiz": [
   "linux-11"
  ],
  "body": [
   {
    "t": "lead",
    "text": "玩家掉线、端口连不上、支付回调超时——网络问题的排查套路是固定的：先看连接状态分布（ss），再看异常状态堆积（TIME_WAIT/CLOSE_WAIT），最后抓包看真实报文（tcpdump），结合游戏长连接场景定性。"
   },
   {
    "t": "pre",
    "items": [
     "会 ps/grep，理解端口概念",
     "知道 TCP 是面向连接的协议",
     "部署过游戏服，见过端口被占的报错"
    ]
   },
   {
    "t": "h",
    "text": "端口占用定位：netstat / ss / lsof"
   },
   {
    "t": "p",
    "text": "部署报 Address already in use 的标准流程三步：ss -lntp 找监听者 → ps -fp PID 确认是什么进程 → 决定 kill 还是换端口。ss 从内核 netlink 接口直接读数据，连接数几万时毫秒返回；netstat 遍历 /proc/net/tcp，大连接数下卡数秒，且新系统常常没预装——所以新机器一律推荐 ss。ss 常用组合：-l 只看监听、-n 不反解域名（快）、-t TCP、-p 显示进程、-a 所有状态；ss -lntp | grep :8080 直接找 8080 端口占用者；lsof -i:8080 按端口找，lsof -p PID -i 看某个进程开了哪些网络连接。游戏服一台机器经常跑多个服（游戏服/日志服/GM 后台），确认身份再动手，别杀错。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "ss -lntp | grep :8080          # 谁在监听 8080（-l 监听 -n 数字 -t TCP -p 进程）\nlsof -i:8080                    # 按端口找进程\nlsof -p 12345 -i                # 某个进程的所有网络连接\nnetstat -lntp                   # 老系统兜底\n\n# 确认身份再处理\nps -fp 12345\nkill 12345                      # 优雅停机\n\n# 查端口释放\nss -lntp | grep :8080 || echo 'port released'"
   },
   {
    "t": "h",
    "text": "TCP 状态机：TIME_WAIT 与 CLOSE_WAIT"
   },
   {
    "t": "p",
    "text": "TCP 断开走四次挥手。主动关闭方发出 FIN 后进入 FIN_WAIT_1 → 收到对端 ACK 进 FIN_WAIT_2 → 收到对端 FIN 回 ACK 后进入 TIME_WAIT，停留 2MSL（Linux 内核 TCP_TIMEWAIT_LEN 默认 60 秒，即 2 个 30 秒的 MSL），保证最后一个 ACK 能到达 + 让网络中的残留报文消失。TIME_WAIT 是协议正常状态，多在主动关闭方——游戏服网关自己踢人/断连是正常来源；如果支付渠道 HTTP 回调是短连接，会大量产生 TIME_WAIT，量大了耗尽本地端口（默认 ip_local_port_range 32768~60999），对外连接受限报 Cannot assign requested address。缓解：连接池/长连接复用治本；tcp_tw_reuse=1 允许安全复用 TIME_WAIT 端口（配 tcp_timestamps）；注意 tcp_tw_recycle 已废弃（Linux 4.12 移除），NAT 环境下有严重问题，别用。CLOSE_WAIT 是更危险的信号：对端已 FIN，我方应用没 close，说明代码没正确处理连接关闭——游戏服出现大量 CLOSE_WAIT 通常是 Netty 的 channelInactive 没处理或 Handler 异常跳过了关闭逻辑，属于代码 bug，堆下去耗尽 fd 直接搞挂服务。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">四次挥手与 TIME_WAIT / CLOSE_WAIT</text>\n<rect x=\"30\" y=\"48\" width=\"180\" height=\"40\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"73\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">主动关闭方（我方）</text>\n<rect x=\"430\" y=\"48\" width=\"180\" height=\"40\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"73\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">被动关闭方（对端）</text>\n<text x=\"205\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">FIN</text>\n<line x1=\"210\" y1=\"110\" x2=\"430\" y2=\"110\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#nt1)\"/>\n<text x=\"205\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ACK</text>\n<line x1=\"430\" y1=\"140\" x2=\"210\" y2=\"140\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#nt1)\"/>\n<text x=\"205\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">FIN</text>\n<line x1=\"430\" y1=\"170\" x2=\"210\" y2=\"170\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#nt1)\"/>\n<text x=\"205\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ACK</text>\n<line x1=\"210\" y1=\"200\" x2=\"430\" y2=\"200\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#nt1)\"/>\n<defs><marker id=\"nt1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"228\" width=\"280\" height=\"56\" rx=\"7\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"170\" y=\"250\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv2)\" font-weight=\"bold\">TIME_WAIT（主动关闭方停留 2MSL≈60s）</text>\n<text x=\"170\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">正常状态，量大病轻 → 连接池/tw_reuse 缓解</text>\n<rect x=\"330\" y=\"228\" width=\"280\" height=\"56\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"470\" y=\"250\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">CLOSE_WAIT（对端 FIN 我方未 close）</text>\n<text x=\"470\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">代码 bug → Netty channelInactive 未处理</text>\n</svg>",
    "caption": "图 7：四次挥手与两类异常连接状态"
   },
   {
    "t": "h",
    "text": "连接数统计：ss -s 与状态分布"
   },
   {
    "t": "p",
    "text": "排查先看整体：ss -s 一行给出 TCP/UDP 连接总数与 TIME_WAIT 等分项；ss -ant | awk '{print $1}' | sort | uniq -c 统计各 TCP 状态数量。游戏服长连接网关的 ESTABLISHED 应该约等于在线人数，数量级对不上就是网关逻辑或连接泄漏。连接数满的表现：新连接建立失败、accept 队列满（somaxconn 太小，大量 SYN 排队）、fd 耗尽（进程打开文件数到上限报 Too many open files，看 ulimit -n 和 /proc/PID/limits）。开服瞬间连接洪峰，内核参数 net.core.somaxconn、net.ipv4.tcp_max_syn_backlog 都可能成为瓶颈。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "ss -s                                      # 整体连接统计\nss -ant | awk '{print $1}' | sort | uniq -c   # 各状态分布\nss -tan state time-wait | wc -l               # 数 TIME_WAIT\nss -tan state established | wc -l             # 数 ESTABLISHED\n\n# 连接数满排查\ncat /proc/sys/net/core/somaxconn\ngrep -E 'Max open files' /proc/PID/limits\nss -ant | grep -c SYN_RECV                  # SYN 堆积 = accept 队列满\nsysctl net.ipv4.ip_local_port_range"
   },
   {
    "t": "h",
    "text": "网络延迟与丢包排查"
   },
   {
    "t": "p",
    "text": "玩家间歇掉线，先 ping 目标 IP 看基础连通性与延迟（ping -c 10 看丢包率）；mtr 结合 traceroute 与 ping，逐跳定位哪一跳丢包；sar -n DEV 1 看网卡吞吐，sarv -n EDEV 1 看网卡错误与丢包；ss -ant 找重传（Retrans）；tcpdump 抓包看真实报文——玩家掉线场景重点区分：客户端发了 FIN（真退出/切后台）、服务端发 RST（我们踢的）、还是中间网络丢包重传（运营商/NAT 超时）。NAT 会话超时是手游掉线经典原因：移动网络 NAT 会话可能几分钟就回收，静止连接超时后表项删除，下行报文被丢——所以游戏心跳间隔（我们定 30 秒）必须小于 NAT 超时，这是「静止不动必掉线、一直操作不掉线」的根因。抓包务必加过滤和限长：tcpdump -i any port 7777 and host 玩家IP -w game.pcap，-c 控制包数、-C 按 MB 切分，防打满磁盘。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "ping -c 10 8.8.8.8                  # 基础连通与丢包\nmtr 8.8.8.8                        # 逐跳延迟，定位哪一跳丢包\nsar -n DEV 1 5                      # 网卡吞吐\nsar -n EDEV 1 5                     # 网卡错误/丢包\n\n# 抓包（务必加过滤防打满磁盘）\ntcpdump -i any port 7777 and host 192.168.1.10 -w /tmp/player.pcap\n# 配合 -c 2000 只抓 2000 个包，或 -C 50 每 50MB 切分\n\n# 下游依赖健康检查\ntelnet mysql-host 3306 && echo 'mysql ok'\nss -ant | grep :6379 | head"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">网络排查决策流程</text>\n<rect x=\"30\" y=\"48\" width=\"140\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">连接数异常？</text>\n<text x=\"100\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ss -s 状态分布</text>\n<rect x=\"190\" y=\"48\" width=\"140\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"260\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">端口连不上？</text>\n<text x=\"260\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ss -lntp 定位占用</text>\n<rect x=\"350\" y=\"48\" width=\"140\" height=\"52\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">延迟/丢包？</text>\n<text x=\"420\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ping / mtr / sar</text>\n<rect x=\"510\" y=\"48\" width=\"120\" height=\"52\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"570\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">报文真相</text>\n<text x=\"570\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">tcpdump 抓包</text>\n<path d=\"M170 74 L190 74\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#nt2)\"/>\n<path d=\"M330 74 L350 74\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#nt2)\"/>\n<path d=\"M490 74 L510 74\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#nt2)\"/>\n<defs><marker id=\"nt2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"128\" width=\"600\" height=\"100\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"330\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">三类结论的定性</text>\n<text x=\"330\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">TIME_WAIT 多 → 短连接量大，量的问题，连接池/tw_reuse 缓解</text>\n<text x=\"330\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CLOSE_WAIT 多 → 我方代码没 close，是 bug；掉线间歇性 → 查 NAT 超时与心跳间隔</text>\n<text x=\"330\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">RST 突增 → 服务端主动踢/异常；丢包重传 → 运营商链路问题，抓包验证</text>\n</svg>",
    "caption": "图 8：网络排查决策树与三类结论定性"
   },
   {
    "t": "pits",
    "items": [
     "把 TIME_WAIT 当洪水猛兽乱调参数：它是正常协议状态，方向是连接池复用与 tcp_tw_reuse；tcp_tw_recycle 已废弃（4.12 移除）NAT 下别用",
     "分不清 TIME_WAIT/CLOSE_WAIT 谁危险：CLOSE_WAIT 是对端关了而我没 close，是代码 bug，堆下去耗尽 fd 更危险",
     "容器里 curl localhost 通就认为网络没问题：localhost 是容器自己，连宿主机服务要查映射/网络模式",
     "抓包不加过滤条件：线上几 G 流量直接打满磁盘，必须 -c/-C/-w 控制",
     "ss 和 netstat 混用不解释差异：ss 读 netlink 毫秒级，netstat 遍历 /proc 大连接数卡顿"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：端口问题 ss -lntp 三步定位；TIME_WAIT 是正常状态、CLOSE_WAIT 是代码 bug；连接数统计用 ss -s + 状态分布，ESTABLISHED 对得上在线人数才算健康；延迟丢包走 ping/mtr/sar/tcpdump 递进，抓包控制体积；NAT 超时与心跳 30 秒的匹配是手游掉线经典结论。下一篇系统性能四件套。"
   }
  ]
 },
 {
  "id": "linux-perf-four",
  "title": "系统性能四件套：top/vmstat/iostat/mpstat",
  "layer": 1,
  "depends": [
   "linux-process-mgmt"
  ],
  "covers": [
   "linux-01",
   "linux-08"
  ],
  "quiz": [
   "linux-01",
   "linux-08"
  ],
  "body": [
   {
    "t": "lead",
    "text": "top、vmstat、iostat、mpstat 四件套能在 30 秒内给系统性能定性：top 看谁在吃资源，vmstat 看系统整体忙什么，iostat 看磁盘快不快，mpstat 看单个核——再结合 load 与上下文切换，CPU/内存/IO/网络瓶颈都能对上号。"
   },
   {
    "t": "pre",
    "items": [
     "理解进程概念，会看 ps 输出",
     "知道 CPU、内存、磁盘 IO 的基本含义",
     "接触过 load average 这个词"
    ]
   },
   {
    "t": "h",
    "text": "四件套分工：一句话定性"
   },
   {
    "t": "p",
    "text": "top 是「点名册」：谁吃得最多（按 P 按 CPU、按 M 按内存排序），第一行还带 load average 与 us/sy/wa 等 CPU 分配比例；vmstat 1 是「心电监护仪」：r（运行队列）、b（阻塞进程）、si/so（swap 换页）、cs（上下文切换）四条曲线，反映系统整体态势；iostat -x 1 是「磁盘体检」：%util（磁盘忙不忙）、await（IO 响应快慢）、r/s+w/s（频率）；mpstat -P ALL 1 是「单核体检」：CPU 不均衡（某核打满其他空闲）往往暴露锁竞争或中断集中。四件套配合的思路：先 top 定性「哪个维度出问题」，再对应的工具深入。"
   },
   {
    "t": "table",
    "head": [
     "工具",
     "一句话定位",
     "关键指标",
     "游戏服场景"
    ],
    "rows": [
     [
      "top",
      "谁在吃资源",
      "load / us / sy / wa / RES",
      "开服卡顿先看它"
     ],
     [
      "vmstat 1",
      "系统整体忙什么",
      "r / b / si / so / cs",
      "swap 与运行队列监控"
     ],
     [
      "iostat -x 1",
      "磁盘快不快",
      "%util / await / avgqu-sz",
      "落地刷盘撞日志高峰"
     ],
     [
      "mpstat -P ALL",
      "单个核是否均衡",
      "单核 us/sy/soft",
      "锁竞争 / 中断集中"
     ]
    ]
   },
   {
    "t": "h",
    "text": "top 详解：load 与 CPU 状态列"
   },
   {
    "t": "p",
    "text": "top 第一行：load average 是 1/5/15 分钟平均负载，统计口径是「运行中 + 不可中断睡眠（D 状态）」的进程数，经验值是不要超过 CPU 核数——超过说明有排队。%Cpu(s) 行：us 用户态（业务代码）、sy 内核态（系统调用）、wa 等待 IO、id 空闲、st 被虚拟机偷走。按 P 按 CPU 排序、按 M 按内存排序、按 1 展开每个核、按 H 切线程视图（CPU 定位三连的第二层）。RES 列是常驻内存，Java 进程 RES 大于 -Xmx 是正常的（堆外内存，见内存篇）。看内存别用 top 的 %MEM 拍脑袋，用 free -h 的 available。"
   },
   {
    "t": "h",
    "text": "vmstat：运行队列、阻塞与 swap"
   },
   {
    "t": "p",
    "text": "vmstat 1 每秒刷新：r 是运行队列长度（持续大于核数 = CPU 不够，排队的比收银台多）；b 是阻塞在 IO 的进程数（持续非 0 = 磁盘是瓶颈）；si/so 是 swap 换入换出页数（非 0 要警惕，换页 IO 极慢，游戏服性能灾难）；cs 是每秒上下文切换次数（过高说明线程太多互相抢，或锁竞争激烈）；us/sy/wa 三列与 top 一致。看内存要用 free -h 的 available 而不是 free 列——Linux 把空闲内存拿去做 buffer/cache，free 很小不等于内存不足，available 才是扣掉可回收缓存后真正能分配的。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "vmstat 1                # 每秒刷新，Ctrl+C 退出\nvmstat 1 5              # 采样 5 次\n# r   b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n# 关注：r>核数=CUP不足  b>0=IO阻塞  si/so>0=swap  cs过高=上下文切换\n\n# 内存视角：看 available 别看 free\nfree -h\n\n# 找 D 状态进程（load 高 CPU 低的头号嫌疑）\nps -eo state,pid,comm | grep '^D'"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">load 高而 CPU 低：进程卡在等 IO</text>\n<rect x=\"30\" y=\"48\" width=\"180\" height=\"44\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">R 状态进程（在算）</text>\n<rect x=\"230\" y=\"48\" width=\"180\" height=\"44\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">D 状态进程（等磁盘 IO）</text>\n<rect x=\"430\" y=\"48\" width=\"180\" height=\"44\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">load = R + D 数量</text>\n<text x=\"40\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">CPU 只统计 R</text>\n<text x=\"320\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">D 不占 CPU 但计入 load</text>\n<path d=\"M160 92 L90 118\" stroke=\"var(--ink)\" stroke-width=\"1.5\" marker-end=\"url(#pf1)\"/>\n<path d=\"M350 92 L350 118\" stroke=\"var(--lv3)\" stroke-width=\"2\" marker-end=\"url(#pf1)\"/>\n<defs><marker id=\"pf1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"150\" width=\"290\" height=\"92\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"175\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">load 高 + CPU 高</text>\n<text x=\"175\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">业务在烧 CPU → top -H + jstack 定位</text>\n<text x=\"175\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">（CPU 100% 三连，见故障 SOP）</text>\n<rect x=\"330\" y=\"150\" width=\"290\" height=\"92\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"475\" y=\"174\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">load 高 + CPU 低</text>\n<text x=\"475\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">卡在等 IO → ps 找 D 进程 → iostat 定位磁盘</text>\n<text x=\"475\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">（落地刷盘撞日志高峰典型场景）</text>\n</svg>",
    "caption": "图 9：load 统计口径与两条排查分支"
   },
   {
    "t": "h",
    "text": "iostat：磁盘瓶颈的组合判断"
   },
   {
    "t": "p",
    "text": "iostat -x 1 四个数组合判断：%util 接近 100% 说明磁盘「忙」（但 SSD/RAID 可并行，util 100% 但 await 很低时磁盘仍游刃有余，不能只凭 util 下结论）；await 是平均 IO 响应时间，机械盘超 10ms、SSD 超 2ms 要警惕；avgqu-sz 队列深度持续大于 1 说明请求在排队；r_await/w_await 分开看读写。await 高但 %util 不高 = 磁盘不忙但每次 IO 慢（随机小 IO 打机械盘、云盘性能差、坏盘前兆，查 dmesg）。游戏服场景：日志服 Kafka 落盘、MySQL 刷 binlog、应用同步写日志三路 IO 抢一块盘，iostat 就能看出谁在打满。iotop -oP 定位到具体进程——注意容器里看到的是宿主机整盘 IO，要配合 cgroup blkio 统计或云监控的 IOPS/吞吐配额。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "iostat -x 1\n# %util 忙不忙 / await 快不快 / avgqu-sz 队列 / r_await w_await 读写延迟\n# util 100% + await 高 = 磁盘真瓶颈；util 100% + await 低 = 磁盘还能扛\n\n# 定位凶手进程\niotop -oP\n\n# 容器/云上补充视角\ncat /sys/fs/cgroup/blkio/blkio.throttle.io_service_bytes\n# 云主机看云监控的 IOPS/吞吐配额是否打满"
   },
   {
    "t": "h",
    "text": "mpstat：单核不均衡与软中断"
   },
   {
    "t": "p",
    "text": "mpstat -P ALL 1 看每个核的使用率。四核机器三核 20% 一核 100%，典型是锁竞争（线程全部在抢一把锁，只有拿锁的核在忙）或软中断集中（网卡多队列没开，流量全走一个核的 ksoftirqd）。游戏服 Netty 多线程 + 高并发下，单核打满 + 整体 CPU 不高，优先怀疑：一是有锁的同步热点（jstack 看 BLOCKED），二是网卡多队列/RSS 没开启把软中断集中到 CPU0。这两个排查方向比盲目加机器强得多——加机器不解决锁竞争。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "mpstat -P ALL 1          # 看每个核\n# 某核 100% 其他闲 → 锁竞争 或 软中断集中\n# 软中断相关\ncat /proc/interrupts | head\n# 看哪个核在处理软中断（ksoftirqd）\ntop -H -n1 | grep ksoftirqd"
   },
   {
    "t": "h",
    "text": "瓶颈识别方法论：先定性再深入"
   },
   {
    "t": "p",
    "text": "四件套是「由面到点」的漏斗：先 top/uptime 定性负载与方向（CPU 路径 or IO 路径），再 vmstat 看整体态势（r/b/si/so/cs），然后 iostat 钻磁盘、mpstat 钻单核。核心心法三条：一是先问「是这台机器的问题还是下游的问题」——游戏服卡常常是 MySQL 慢查询或 Redis 热 key 的表象，系统指标正常不代表链路健康；二是对比法——同集群挑一台正常机器对比，差异即线索；三是时间对齐——异常开始时间对齐发布记录、活动开启时间、监控告警，80% 的问题能在变更点找到根因。"
   },
   {
    "t": "pits",
    "items": [
     "把 load 高直接当 CPU 不够：load 含 D 状态（等 IO）进程，load 高 CPU 低先怀疑磁盘",
     "free 列当可用内存：Linux 页缓存被算进已用，必须看 available",
     "iostat 只看 %util 下结论：util 100% 但 await 低说明 SSD 并行能力强，要组合 await/avgqu-sz 判断",
     "忽略单核：整体 CPU 不高但单核打满，锁竞争与软中断集中才是真凶",
     "si/so 非 0 不当回事：swap 换页 IO 极慢，持续换页是性能灾难，游戏服优先调低 swappiness"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：top 定性（load/us/sy/wa）、vmstat 看态势（r/b/si/so/cs）、iostat 钻磁盘（%util/await/队列）、mpstat 钻单核（锁/软中断）；load 是 R+D 进程数，load 高 CPU 低走 IO 路径；看内存用 available；单核打满找锁。下一篇讲磁盘与存储。"
   }
  ]
 },
 {
  "id": "linux-disk-storage",
  "title": "磁盘与存储：空间、inode 与 IO",
  "layer": 1,
  "depends": [
   "linux-command-suite"
  ],
  "covers": [
   "linux-02",
   "linux-10"
  ],
  "quiz": [
   "linux-02",
   "linux-10"
  ],
  "body": [
   {
    "t": "lead",
    "text": "磁盘是游戏服最脆弱的资源：日志、Kafka segment、binlog 都在抢它。df/du 定位空间、inode 耗尽防小文件风暴、logrotate 保日志不爆盘、iostat 定 IO 慢——四个能力组合成完整的磁盘运维闭环。"
   },
   {
    "t": "pre",
    "items": [
     "会用 ls/du，理解文件与目录",
     "见过磁盘使用率告警",
     "知道日志文件会一直增长"
    ]
   },
   {
    "t": "h",
    "text": "df 与 du：空间是谁在用"
   },
   {
    "t": "p",
    "text": "df 看「文件系统还剩多少」（按分区），du 看「目录占了多大」（按目录递归统计）。磁盘告警流程：df -h 先定位哪个分区满（系统盘 / 还是数据盘 /data），du -sh /* 或 du -h --max-depth=1 /data | sort -hr | head 逐层下钻找到大目录。游戏服磁盘大户四件套：业务日志、GC 日志、Kafka segment（/data/kafka-logs）、MySQL binlog。du 慢就下钻而不是全量递归：du -h --max-depth=1 一层一层看，或 find / -size +1G 直接找超大文件。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "df -h                     # 各分区使用率\ndf -i                     # 各分区 inode 使用率\n\ndu -sh /data/*            # 看 /data 下每个子目录大小\ndu -h --max-depth=1 /data/game | sort -hr | head\nfind /data -xdev -type f -size +1G    # 直接找超大文件\n\n# 防复发：按天/按服切分日志、配置保留天数"
   },
   {
    "t": "h",
    "text": "df 与 du 对不上：deleted 句柄坑"
   },
   {
    "t": "p",
    "text": "经典场景：rm 了一个 10G 的日志文件，df 显示空间一点没变。原因是文件仍被进程持有句柄——inode 的数据块要到最后一个持有者关闭文件才释放，rm 只是删了目录项，进程还在写那个 inode。排查：lsof | grep deleted 找到持有被删文件的进程；处理：重启进程或 kill 让句柄释放，空间立刻回来。这就是生产上「删日志不能直接 rm，要用 > file 清空或先停写再删」的根本原因。对正在写入的日志，正确做法是 logrotate 切割：mv 旧文件 + 发信号让进程重新打开新文件，而不是裸 rm。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">rm 了文件但空间不释放：句柄原理</text>\n<rect x=\"30\" y=\"48\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">进程持有文件句柄</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Java 进程 / 日志 Agent</text>\n<rect x=\"230\" y=\"48\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">rm 只删目录项</text>\n<text x=\"320\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">inode 引用减一</text>\n<rect x=\"430\" y=\"48\" width=\"180\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">inode 数据块不释放</text>\n<text x=\"520\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">df 显示空间没变</text>\n<path d=\"M210 76 L230 76\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#ds1)\"/>\n<path d=\"M410 76 L430 76\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#ds1)\"/>\n<defs><marker id=\"ds1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"128\" width=\"580\" height=\"84\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">排查与正确姿势</text>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">lsof | grep deleted 找持有进程 → 重启/kill 后空间才回来</text>\n<text x=\"320\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">正确姿势：> file 清空（不释放句柄但清内容）或 logrotate 切割；绝不裸 rm 正在写入的日志</text>\n</svg>",
    "caption": "图 10：deleted 句柄导致空间不释放的原理"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "lsof | grep deleted        # 找持有已删文件的进程\nlsof -p PID | grep deleted  # 指定进程\n\n# 清空正在写的日志（安全，不中断写入）\n> /data/game/logs/game.log\n\n# 生产清理原则：先停写 → 切割/备份 → 删除"
   },
   {
    "t": "h",
    "text": "inode 耗尽：小文件风暴"
   },
   {
    "t": "p",
    "text": "inode 数量在格式化时固定（ext4 按 16KB/个左右预分配）。海量小文件会把 inode 用光：现象是 df -h 还有空间，但写任何文件都报 No space left on device。游戏服高危场景：按玩家 ID 拆文件、按次写文件不追加、日志文件不滚动导致每天上万个文件。排查 df -i 看 inode 使用率、find /data -type f | wc -l 数文件总量。根治是「不产生小文件」：日志统一追加进大文件并按时滚动、临时文件用完即删、Kafka 日志段合理配置。"
   },
   {
    "t": "h",
    "text": "日志清理策略：logrotate 与 retention"
   },
   {
    "t": "p",
    "text": "生产日志必须配 logrotate（或应用内 SizeAndTimeBasedRollingPolicy），不能靠人肉删。logrotate 配置：daily 按天切割、rotate 7 保留 7 份、compress 压缩历史、copytruncate 先复制再清空（复制窗口内的写入会丢，且瞬时双倍磁盘，大日志慎用；默认是 mv 旧文件 + postrotate 发信号让进程重开新文件）。应用侧：logback 用 SizeAndTimeBasedRollingPolicy 按大小+时间滚动，Kafka 配 log.retention.hours，MySQL 配 expire_logs_days。再加监控：磁盘使用率 80% 预警、90% 电话告警，形成闭环。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# /etc/logrotate.d/game\n/data/game/logs/*.log {\n    daily\n    rotate 7\n    compress\n    delaycompress\n    missingok\n    notifempty\n    copytruncate\n}\n\n# logrotate -d 测试，-f 强制\nlogrotate -d /etc/logrotate.d/game\n\n# Kafka 保留\n# log.retention.hours=72\n# MySQL binlog 保留\nexpire_logs_days = 7"
   },
   {
    "t": "h",
    "text": "磁盘 IO 慢定位：iostat 组合拳"
   },
   {
    "t": "p",
    "text": "iostat -x 1 组合判断（见性能篇）：%util 忙不忙、await 快不快、avgqu-sz 队列。游戏服 IO 优化手段分层：应用层 logback 用 AsyncAppender 避免同步写盘阻塞业务线程；Kafka 本身顺序写 + 页缓存，优化刷盘参数与磁盘隔离；MySQL 日志服可容忍丢几秒数据时 innodb_flush_log_at_trx_commit 调 2；玩家数据落地批量 + 错峰 + 异步，避免整点全服同时刷盘；架构层业务盘/日志盘/数据盘物理隔离，避免互相抢 IO。云上特别注意：云盘有 IOPS/吞吐上限，iostat 看着不满但云监控配额打满也会毛刺——这是传统经验在云上最容易栽的坑。"
   },
   {
    "t": "h",
    "text": "LVM / RAID / swap 简述"
   },
   {
    "t": "p",
    "text": "LVM 把物理盘组合成卷组再划逻辑卷，好处是能在线扩容（lvresize + fs 扩容），日志分区不够时不用重装系统；RAID 分软硬：RAID1 镜像（数据双写，坏一块盘不丢）、RAID5 带校验条带（空间利用率高，坏一块可重建）、RAID0 纯条带（性能好无冗余，坏一块全没）。游戏服数据盘生产至少 RAID1/RAID5，日志盘可 RAID0 换性能。swap 是内存不足时的最后缓冲：si/so 持续非 0 是性能灾难，游戏服务器建议 swappiness 调低（1~10），宁可 OOM 报错也不要慢慢卡死——卡顿比 Crash 更难排查，玩家体验更差；但别直接禁 swap，极端情况要靠它喘口气给告警留时间。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# swap 配置查看\nfree -h | grep -i swap\ncat /proc/sys/vm/swappiness\nsysctl -w vm.swappiness=10        # 临时\n# /etc/sysctl.conf 写 vm.swappiness=10 永久生效\n\n# 磁盘类型与阵列\nlsblk\ncat /proc/mdstat                 # 软 RAID 状态\npvs && vgs && lvs                # LVM 卷信息\n\n# 坏盘征兆\ndmesg -T | grep -i 'error.*sda'   # IO error 常是坏盘前兆"
   },
   {
    "t": "pits",
    "items": [
     "rm 正在写的日志：句柄不释放空间不回，必须 > file 清空或 logrotate",
     "df 有空间写文件却报 No space：没看 df -i（inode 耗尽），小文件风暴必踩",
     "logrotate copytruncate 无脑用：复制窗口丢日志 + 瞬时双倍磁盘，大日志慎用",
     "iostat 只看 %util：await 高 util 不高是盘慢（随机小 IO/坏盘），组合判断",
     "云盘满 IOPS 看不出：iostat 显示不满但配额打满，必须看云监控"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：df/du 定位空间、lsof deleted 解句柄坑、df -i 防 inode 耗尽、logrotate + retention 保日志不爆盘、iostat 组合判断 IO 瓶颈；LVM 在线扩容、RAID1/5 保数据、swappiness 调低防卡死。下一篇 Shell 脚本编程。"
   }
  ]
 },
 {
  "id": "linux-shell-scripting",
  "title": "Shell 脚本编程与定时任务",
  "layer": 2,
  "depends": [
   "linux-command-suite"
  ],
  "covers": [
   "linux-06"
  ],
  "quiz": [
   "linux-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "游戏服运维的自动化全靠 Shell：部署脚本、日志清理、备份、拉起检查。核心不是语法背诵，而是工程素养——每步查退出码、set -e 失败即退、cron 环境变量坑、输出重定向留日志。"
   },
   {
    "t": "pre",
    "items": [
     "会基础 Linux 命令与管道",
     "理解进程与端口概念",
     "用 crontab 配过简单的定时任务"
    ]
   },
   {
    "t": "h",
    "text": "变量、命令替换与位置参数"
   },
   {
    "t": "p",
    "text": "变量赋值 name=value（等号两边不能有空格，这是新手第一坑）；引用加 $name 或 ${name}（大括号防歧义，如 ${name}_bak）；命令替换 pid=$(ss -lntp | grep :8080 | awk '{print $6}')，老写法 `cmd` 反引号已不推荐；位置参数 $0 脚本名、$1 第一个参数、$# 参数个数、$? 上条命令退出码（0 成功）、$$ 当前进程 PID。引号：双引号内变量会展开，单引号原样输出。判断变量为空 if [ -z \"$pid\" ]——引号必须加，否则空变量展开成空串会让 [ ] 语法报错。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "#!/bin/bash\n# 变量与命令替换\nPORT=8080\nAPP_NAME=\"game-1.2.0\"\npid=$(ss -lntp | grep :$PORT | awk '{print $6}' | cut -d= -f2 | head -1)\n\necho \"port=$PORT app=$APP_NAME pid=${pid:-none}\"  # ${var:-default} 默认值\n\necho \"script=$0 args=$# pid=$$\"\n\n# 判断\nif [ -z \"$pid\" ]; then\n  echo \"no process on $PORT\"\n  exit 1\nfi"
   },
   {
    "t": "h",
    "text": "条件、循环与函数"
   },
   {
    "t": "p",
    "text": "if [ 条件 ] 注意条件两边空格；数值比较用 -eq/-ne/-gt/-lt，字符串用 =/!=，文件判断 -f 文件存在、-d 目录、-x 可执行、-w 可写。for 循环 for f in /data/logs/*.log; do ... done 遍历文件；while read line 逐行读文件；函数 function_name() { ... } 定义，函数内 $1 是函数参数（与脚本 $1 不同）。case 做多分支（按参数分发子命令，部署脚本常用）。循环里防死循环：while true 必须有 break 条件或最大次数保护。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "#!/bin/bash\n# 检查旧日志并保留 7 天\nfor f in /data/game/logs/*.log; do\n  [ -f \"$f\" ] || continue\n  echo \"handling $f\"\ndone\n\n# 按参数分发命令\ncase \"$1\" in\n  start)  echo \"start game\";;\n  stop)   echo \"stop game\";;\n  restart) echo \"restart game\";;\n  *)      echo \"usage: $0 {start|stop|restart}\"; exit 1;;\nesac\n\n# 函数\ncheck_health() {\n  curl -s http://127.0.0.1:8080/actuator/health | grep -q '\"status\":\"UP\"'\n}\ncheck_health || { echo 'health check failed'; exit 1; }"
   },
   {
    "t": "h",
    "text": "字符串处理"
   },
   {
    "t": "p",
    "text": "${var#pattern} 去前缀、${var%pattern} 去后缀；${var//old/new} 全局替换；cut -d: -f1 按冒号切列；tr 字符转换（大写转小写、删空格）；sort | uniq 去重计数。处理路径：basename /path/file 拿文件名、dirname 拿目录。给变量去空格用 sed 或 xargs：echo \" $var \" | xargs。这些都是拼接发布脚本、解析命令输出时的高频操作。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "ver=\"game-1.2.0.tar.gz\"\n# 去后缀取版本名\necho \"${ver%.tar.gz}\"          # game-1.2.0\n# 取文件名\necho \"$(basename /data/pkg/$ver)\"\n# 替换\necho \"${ver//1.2.0/1.3.0}\"\n# cut/tr 处理命令输出\nfree -h | grep Mem | awk '{print $3}' | tr -d 'i'"
   },
   {
    "t": "h",
    "text": "部署脚本骨架：发射检查单"
   },
   {
    "t": "p",
    "text": "游戏服部署脚本 = 火箭发射检查单：每一步签字确认（检查 $?），任何一步失败立即终止并通知，绝不带病上线。流程：拉包 → 备份旧版本 → 优雅停旧进程（SIGTERM 等超时）→ 校验端口释放 → 放新包 → 启动（nohup/systemd）→ 健康检查（curl 端口/接口）→ 失败告警。每一步 if [ $? -ne 0 ]; then 报错退出。这是 linux-06 的核心考点——不查退出码、输出不重定向留日志，都暴露没在生产写过脚本。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "#!/bin/bash\nset -euo pipefail          # 关键：任何命令失败即退出；未定义变量报错；管道失败也算\n\nAPP=/data/game\nPKG=/data/pkg/game-1.2.0.tar.gz\nPORT=8080\nLOG=/data/logs/deploy.log\n\nexec >> \"$LOG\" 2>&1        # 脚本所有输出进日志\n\necho \"[deploy] start $(date +%F_%T)\"\n\n# 1. 备份旧版本\ncp -r $APP $APP.bak.$(date +%Y%m%d%H%M%S)\n\n# 2. 优雅停旧进程\nold_pid=$(pgrep -f 'game.jar' | head -1)\n[ -n \"$old_pid\" ] && kill $old_pid\nfor i in $(seq 1 30); do kill -0 \"$old_pid\" 2>/dev/null || break; sleep 1; done\n\n# 3. 校验端口释放\nif ss -lntp | grep -q \":$PORT\"; then\n  echo \"[deploy] port $PORT still in use\"\n  exit 1\nfi\n\n# 4. 解包启动\ntar zxf $PKG -C $APP\nnohup java -jar $APP/game.jar > $APP/logs/game.log 2>&1 &\n\n# 5. 健康检查（60 秒内端口起来）\nfor i in $(seq 1 60); do\n  if ss -lntp | grep -q \":$PORT\"; then\n    echo \"[deploy] ok after ${i}s\"\n    exit 0\n  fi\n  sleep 1\ndone\necho \"[deploy] timeout, health check failed\"\nexit 1"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">部署脚本 = 发射检查单</text>\n<rect x=\"40\" y=\"48\" width=\"120\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">① 拉包</text>\n<text x=\"100\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">校验 md5/版本</text>\n<rect x=\"185\" y=\"48\" width=\"120\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"245\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">② 备份旧版</text>\n<text x=\"245\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">cp -r 带时间戳</text>\n<rect x=\"330\" y=\"48\" width=\"120\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"390\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">③ 优雅停服</text>\n<text x=\"390\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">SIGTERM 等超时</text>\n<rect x=\"475\" y=\"48\" width=\"120\" height=\"50\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"535\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">④ 端口释放</text>\n<text x=\"535\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">ss 确认再继续</text>\n<path d=\"M160 73 L185 73\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#sh1)\"/>\n<path d=\"M305 73 L330 73\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#sh1)\"/>\n<path d=\"M450 73 L475 73\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#sh1)\"/>\n<defs><marker id=\"sh1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"40\" y=\"118\" width=\"200\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"140\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">⑤ 解包启动</text>\n<text x=\"140\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">nohup / systemd 拉起</text>\n<rect x=\"260\" y=\"118\" width=\"200\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"360\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">⑥ 健康检查</text>\n<text x=\"360\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">60s 内端口/接口就绪</text>\n<rect x=\"480\" y=\"118\" width=\"140\" height=\"56\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"550\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">⑦ 失败告警</text>\n<text x=\"550\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">每一步 $? 检查</text>\n<path d=\"M240 146 L260 146\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#sh1)\"/>\n<path d=\"M460 146 L480 146\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#sh1)\"/>\n<rect x=\"40\" y=\"200\" width=\"580\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"330\" y=\"224\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">工程素养三件套</text>\n<text x=\"330\" y=\"246\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">set -euo pipefail 失败即退；exec >> LOG 2>&1 输出留痕；任何一步失败 exit 1 绝不带病上线</text>\n</svg>",
    "caption": "图 11：部署脚本的检查单式流程"
   },
   {
    "t": "h",
    "text": "crontab 定时任务"
   },
   {
    "t": "p",
    "text": "crontab -e 编辑、crontab -l 查看、crontab -r 删除（慎用）。格式「分 时 日 月 周 命令」：0 4 * * * 每天 4 点；*/5 * * * * 每 5 分钟；30 2 * * 1 每周一 2 点半。日志清理、每天凌晨低峰期数据备份、定时拉起检查都用它。crontab 的经典坑：环境变量极简（PATH 只有 /usr/bin:/bin），脚本里手动跑没问题、cron 跑就 command not found——解决：脚本开头 source /etc/profile 或命令用绝对路径。第二个坑是脚本输出不重定向，cron 会把输出发邮件（通常没人看）——必须 >> 自己的日志文件 2>&1。第三个坑是防重叠：任务执行时间超过周期会并发执行（备份脚本跑到一半下一个又开始了），脚本里加 flock 锁。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# crontab -e 内容\n# 分 时 日 月 周  命令\n0 4 * * * /data/scripts/clean_log.sh >> /data/logs/clean.log 2>&1\n*/5 * * * * /data/scripts/check_alive.sh >> /data/logs/check.log 2>&1\n30 2 * * 1 /data/scripts/backup_db.sh >> /data/logs/backup.log 2>&1\n\n# 防重叠执行：脚本内加锁\n#!/bin/bash\nexec 9>/data/locks/clean.lock\nflock -n 9 || { echo \"another instance running\"; exit 1; }\n# 业务逻辑...\n\n# 最小粒度 1 分钟；要秒级用 while+systemd timer\n# cron 环境变量极简，脚本内 source /etc/profile 或全用绝对路径"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">crontab 五段字段</text>\n<rect x=\"30\" y=\"46\" width=\"100\" height=\"62\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"80\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">分</text>\n<text x=\"80\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">0-59</text>\n<rect x=\"145\" y=\"46\" width=\"100\" height=\"62\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"195\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">时</text>\n<text x=\"195\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">0-23</text>\n<rect x=\"260\" y=\"46\" width=\"100\" height=\"62\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"310\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">日</text>\n<text x=\"310\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">1-31</text>\n<rect x=\"375\" y=\"46\" width=\"100\" height=\"62\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"425\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">月</text>\n<text x=\"425\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>1-12</text>\n<rect x=\"490\" y=\"46\" width=\"120\" height=\"62\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"550\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">周</text>\n<text x=\"550\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>0-7（0/7=周日）</text>\n<rect x=\"30\" y=\"126\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">游戏服典型任务</text>\n<text x=\"320\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">0 4 * * * 日志清理；30 2 * * 1 数据库备份；*/5 * * * * 进程存活检查（配合 flock 防重叠）</text>\n</svg>",
    "caption": "图 12：crontab 字段含义与典型任务"
   },
   {
    "t": "h",
    "text": "脚本健壮性三件套"
   },
   {
    "t": "p",
    "text": "set -e 任何命令失败立即退出；set -u 未定义变量报错；set -o pipefail 管道中任一命令失败整体算失败。组合起来 set -euo pipefail 是生产脚本标配。注意 set -e 与条件判断的交互坑：if/while 条件里的命令失败不会触发退出（那是正常分支判断）；grep 没匹配返回 1 会让脚本退出，所以「想允许失败」的命令要加 || true 或放进 if。最后：脚本输出 exec >> log 2>&1 重定向留痕，crash 后能查；函数库放单独文件 source 引入；脚本顶部 set -euo pipefail + 注释用途。"
   },
   {
    "t": "pits",
    "items": [
     "变量赋值等号两边加空格：name = value 是命令不是赋值，立即报 command not found",
     "不查退出码、不用 set -e：部署脚本某步失败还继续跑，带病上线",
     "cron 里脚本 command not found：环境变量极简，必须绝对路径或 source /etc/profile",
     "cron 输出不重定向：输出发邮件没人看，故障无从查起，必须 >> log 2>&1",
     "长任务与 cron 周期重叠并发：备份脚本必须 flock 加锁防并发",
     "set -e 下 grep 无匹配导致脚本意外退出：期望允许失败的命令加 || true 或放进 if"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：变量/条件/循环/函数是语法地基；部署脚本是「检查单」，每步查 $? 失败即退；crontab 五段字段 + 环境变量坑 + flock 防重叠；set -euo pipefail + 输出重定向是生产脚本标配。下一篇把脚本用起来：发布部署与回滚。"
   }
  ]
 },
 {
  "id": "linux-deploy-rollback",
  "title": "发布部署与回滚设计",
  "layer": 2,
  "depends": [
   "linux-shell-scripting",
   "linux-process-mgmt"
  ],
  "covers": [
   "linux-17"
  ],
  "quiz": [
   "linux-17"
  ],
  "body": [
   {
    "t": "lead",
    "text": "裸机/虚拟机没有 K8s，靠「多实例 + 目录版本化 + 流量入口切换 + 快速回滚脚本」手工实现不停机发布；游戏服的特殊难点在于有状态玩家连接和不可回滚的 DDL，这两点想透才算真会发布。"
   },
   {
    "t": "pre",
    "items": [
     "会写基础 Shell 脚本（见上篇）",
     "理解 nginx 反代与 upstream 概念",
     "知道游戏服是有状态的（玩家连接、内存数据）"
    ]
   },
   {
    "t": "h",
    "text": "JDK 安装与版本管理"
   },
   {
    "t": "p",
    "text": "JDK 装到 /opt/jdk 下按版本分目录（jdk-8u402、jdk-17.0.10），配置 /etc/profile 的 JAVA_HOME 指向，或用 update-alternatives 切换系统默认版本。多版本并存时注意：不同服务需要不同 JDK，千万别全机器改一个 JAVA_HOME——游戏服 Java 8 + GM 后台 Java 17 并存很常见，正确做法是每个服务的启动脚本里显式写 JAVA_HOME 或用 wrapper。检查部署环境：java -version、echo $JAVA_HOME、which java（看符号链接最终指向）。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "tar zxvf jdk-17_linux-x64_bin.tar.gz -C /opt/jdk/\nls /opt/jdk/\n\n# 写入 /etc/profile（或 /etc/profile.d/java.sh）\nexport JAVA_HOME=/opt/jdk/jdk-17.0.10\nexport PATH=$JAVA_HOME/bin:$PATH\n\n# 切换默认版本\nupdate-alternatives --config java\n\n# 多版本服务各自指定（发布脚本内）\nexport JAVA_HOME=/opt/jdk/jdk-17.0.10\nnohup $JAVA_HOME/bin/java -jar /data/game/game.jar &"
   },
   {
    "t": "h",
    "text": "目录版本化 + 软链：回滚的原子操作"
   },
   {
    "t": "p",
    "text": "无状态服务（GM 后台/购买服/登录服）回滚的核心是「目录版本化 + 软链」：/data/app/gm/v1.2.0、v1.2.1 并存，软链 /data/app/gm/current -> v1.2.1 指向当前版本。发布 = 放新目录 + 改软链 + 重启，回滚 = 软链指回旧目录 + 重启，10 秒内完成，不需要重新解包旧版本（旧版本一直躺着）。配合 nginx 摘流量逐台滚动，全程服务不断。这是裸机环境下最接近「秒级回滚」的工程做法。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">目录版本化 + 软链秒级回滚</text>\n<rect x=\"30\" y=\"48\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">v1.2.0</text>\n<text x=\"120\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">旧版本（保留躺着）</text>\n<rect x=\"230\" y=\"48\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">v1.2.1</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">新版本目录</text>\n<rect x=\"430\" y=\"48\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"520\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">current 软链</text>\n<text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>-> v1.2.1（当前）</text>\n<path d=\"M410 78 L430 78\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#dr1)\"/>\n<defs><marker id=\"dr1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"132\" width=\"580\" height=\"50\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"154\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">发布</text>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">放 v1.2.1 目录 → 改 current 软链 → 重启 → 健康检查</text>\n<rect x=\"30\" y=\"196\" width=\"580\" height=\"50\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"218\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">回滚</text>\n<text x=\"320\" y=\"238\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>软链指回 v1.2.0 → 重启 → 健康检查，10 秒完成且旧包从未被删</text>\n</svg>",
    "caption": "图 13：目录版本化与软链回滚机制"
   },
   {
    "t": "h",
    "text": "无状态服务滚动发布：nginx 摘流量"
   },
   {
    "t": "p",
    "text": "GM 后台/购买服/登录服多实例部署，发布流程：nginx upstream 里把这个节点 down 掉（注释或加 down 标记）→ nginx reload → 该节点不再接新请求 → 等存量请求排空 → 更新该节点 → 健康检查通过 → 挂回 upstream → nginx reload。逐台滚动，始终有节点在服务。登录服的特殊点：登录请求有会话状态，摘流前要确认没有「登录到一半」的请求，通常登录流程都是秒级无状态的，排空 30 秒足够。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# nginx upstream 摘节点\n# 将 server 192.168.1.11:8080; 改为 server 192.168.1.11:8080 down;\nnginx -t && nginx -s reload\n\n# 更新后挂回\n# 改回 server 192.168.1.11:8080;\nnginx -t && nginx -s reload\n\n# 发布脚本循环\nfor node in 11 12 13; do\n  ssh deploy@192.168.1.$node 'bash -s' <<'EOF'\n    # 摘流由外部 nginx 控制，本机只做：备份→更新→重启→健康检查\nEOF\ndone"
   },
   {
    "t": "h",
    "text": "有状态游戏服的发布：分线与优雅下线"
   },
   {
    "t": "p",
    "text": "玩家连着的游戏服不能硬切。按「区服/分线」为单位滚动：单线维护时该线玩家收到「分线维护」提示并引导换线；对要更新的实例先发「停止接收新登录」指令 → 等在线玩家自然流失或超时踢人 → 强制落地所有玩家数据 → 关服更新 → 重新开放。连接迁移是高级玩法：网关节点与逻辑节点分离时，网关保持连接不动，只重启后端逻辑节点，玩家无感知——这是战斗服/功能服分离架构的红利。发布窗口选低峰（凌晨），发布前公告，发布后盯盘 30 分钟。"
   },
   {
    "t": "h",
    "text": "DDL 三阶段变更：回滚的真正障碍"
   },
   {
    "t": "p",
    "text": "代码回滚靠软链秒级完成，但数据库结构变更不可回滚——旧代码不认新字段可能报错，删字段直接炸。解法是「三阶段变更法」：阶段一先发兼容 DDL（只加字段不改逻辑），阶段二发代码（开始用新字段），阶段三稳定后清理旧字段。每一步都可回退，每一阶段的代码都与前后阶段的 schema 兼容。游戏服表（玩家表、充值流水表）高频变更字段时尤其要遵守。回滚设计还要做发布前自动备份（旧包 + 数据库版本标记），回滚脚本一键执行（软链回指 + 重启 + 健康检查）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">数据库结构变更三阶段法</text>\n<rect x=\"30\" y=\"46\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"122\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">阶段一：兼容 DDL</text>\n<text x=\"122\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>ALTER TABLE ADD COLUMN</text>\n<text x=\"122\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>只加不改不删</text>\n<text x=\"122\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>旧代码完全兼容</text>\n<rect x=\"228\" y=\"46\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">阶段二：发代码</text>\n<text x=\"320\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>新代码开始读写</text>\n<text x=\"320\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>新字段/新表</text>\n<text x=\"320\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>配合新 DDL 上线</text>\n<rect x=\"426\" y=\"46\" width=\"185\" height=\"120\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"518\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv3)\" font-weight=\"bold\">阶段三：清理</text>\n<text x=\"518\" y=\"94\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>稳定运行数天后</text>\n<text x=\"518\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>删除旧字段/旧表</text>\n<text x=\"518\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>确认无旧代码引用</text>\n<path d=\"M215 106 L228 106\" stroke=\"var(--accent) stroke-width=\"2\" marker-end=\"url(#dr2)\"/>\n<path d=\"M413 106 L426 106\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#dr2)\"/>\n<defs><marker id=\"dr2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"190\" width=\"580\" height=\"50\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">核心：每一步都可回退，每阶段代码与前后 schema 兼容</text>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一次性「加字段 + 改代码 + 删字段」上线，回滚时旧代码必炸</text>\n</svg>",
    "caption": "图 14：DDL 三阶段变更法"
   },
   {
    "t": "h",
    "text": "灰度发布与回滚方案落地"
   },
   {
    "t": "p",
    "text": "灰度：先更一个内部测试服或小流量区服跑 24 小时，盯关键指标（报错率、在线、充值成功率、CPU/内存）无异常再全量。回滚决策要「预案 + 决策机制」：发布前写清回滚触发条件（如报错率 > 1% 或充值失败激增立即回滚）、明确决策人。发布 checklist：发布窗口低峰、发布前公告、发布后盯盘 30 分钟、回滚脚本提前演练过。涉及协议变更时：新客户端兼容旧协议则先发客户端（提审周期长）再发服务端；强更场景服务端新旧协议并存灰度切流。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 回滚脚本骨架（与发布脚本对称）\n#!/bin/bash\nset -euo pipefail\nAPP=/data/app/gm\nROLLBACK_TO=v1.2.0\n\necho \"[rollback] to $ROLLBACK_TO\"\nln -sfn $APP/$ROLLBACK_TO $APP/current    # 软链回指\nsystemctl restart gm\n\n# 健康检查\nfor i in $(seq 1 60); do\n  if curl -sf http://127.0.0.1:8080/actuator/health >/dev/null; then\n    echo \"[rollback] ok after ${i}s\"\n    exit 0\n  fi\n  sleep 1\ndone\necho \"[rollback] failed\"\nexit 1\n\n# 发布后盯盘：报错率/在线/充值成功率对比发布前基线"
   },
   {
    "t": "pits",
    "items": [
     "发布只备份旧包不处理数据库：DDL 不可回滚，旧代码遇到新结构直接报错，必须三阶段变更",
     "软链回滚比整目录还原快：先建 current 软链方案，别用 rm -rf + 重新解包",
     "有状态游戏服硬切发布：玩家连接直接断、内存数据丢失，要分线滚动 + 优雅下线",
     "crontab 凌晨任务与发布撞车：发布窗口要避开所有定时任务",
     "灰度 = 全量上线到一个小服测试：灰度不只是「测功能」，要看报错率/在线/充值三指标"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：JDK 按版本隔离、按服务指定；目录版本化 + 软链实现 10 秒回滚；无状态服务 nginx 摘流滚动，有状态游戏服分线滚动 + 优雅下线；DDL 三阶段变更法是回滚设计的灵魂；灰度 + 预案 + 决策机制构成完整发布体系。下一篇容器化：Docker。"
   }
  ]
 },
 {
  "id": "linux-docker-basics",
  "title": "Docker 容器：镜像、网络与排查",
  "layer": 2,
  "depends": [
   "linux-deploy-rollback"
  ],
  "covers": [
   "linux-14",
   "linux-15"
  ],
  "quiz": [
   "linux-14",
   "linux-15"
  ],
  "body": [
   {
    "t": "lead",
    "text": "镜像打包环境与应用、容器隔离运行、仓库分发镜像，三层概念 + 分层 Dockerfile + 网络模式 + 排查命令链，是 GM 后台和购买服容器化的完整知识闭环。"
   },
   {
    "t": "pre",
    "items": [
     "会写 Shell 脚本，做过裸机部署",
     "理解端口、进程、日志的基本概念",
     "知道 SpringBoot 内嵌 Tomcat 启动方式"
    ]
   },
   {
    "t": "h",
    "text": "镜像 / 容器 / 仓库：三概念一句话"
   },
   {
    "t": "p",
    "text": "镜像（Image）是只读模板，本质是分层的文件系统快照，包含应用 + 运行环境 + 依赖；容器（Container）是镜像 + 可写层的运行实例，互相隔离（进程、网络、文件系统用 namespace 与 cgroup 隔离）；仓库（Registry）是镜像的 git，docker push/pull 做分发（公有 Docker Hub，私有 Harbor）。容器删了可写层就没了——所以数据必须挂载到宿主机（数据卷），镜像可以反复复用。区别一句话：镜像是一张只读 DVD，容器是插上 DVD 的独立电脑。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">镜像分层与可写层</text>\n<rect x=\"40\" y=\"46\" width=\"280\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"180\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">容器可写层（writable）</text>\n<text x=\"180\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">运行时改动，容器删了就丢</text>\n<rect x=\"40\" y=\"116\" width=\"280\" height=\"42\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"180\" y=\"143\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">应用层（app.jar，经常变）</text>\n<rect x=\"40\" y=\"172\" width=\"280\" height=\"42\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"180\" y=\"199\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">依赖层（lib，不常变）</text>\n<rect x=\"40\" y=\"228\" width=\"280\" height=\"38\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"180\" y=\"252\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">基础镜像层（JRE，几乎不变）</text>\n<rect x=\"340\" y=\"46\" width=\"280\" height=\"220\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"480\" y=\"72\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">构建优化原则</text>\n<text x=\"480\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">依赖先 COPY，代码后 COPY</text>\n<text x=\"480\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">依赖层不变 → 命中缓存</text>\n<text x=\"480\" y=\"142\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">日常发布只重建应用层</text>\n<text x=\"480\" y=\"164\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">推送只传差量层，秒级</text>\n<text x=\"480\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\" font-weight=\"bold\">SpringBoot 用 layertools 实现</text>\n<text x=\"480\" y=\"214\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">基础镜像锁版本不用 latest</text>\n<text x=\"480\" y=\"234\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">配置不塞镜像：-v 挂载/环境变量</text>\n<text x=\"480\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">容器内非 root 用户运行</text>\n</svg>",
    "caption": "图 15：镜像分层结构与构建优化原则"
   },
   {
    "t": "h",
    "text": "Dockerfile 编写与优化"
   },
   {
    "t": "p",
    "text": "一个生产可用的 SpringBoot Dockerfile：FROM eclipse-temurin:17-jre 选精简 JRE 基础镜像并锁版本；WORKDIR /app 工作目录；COPY 分层复制；EXPOSE 8080 声明端口（注意 EXPOSE 只是声明，不是端口映射）；ENTRYPOINT 固定入口命令。优化要点：依赖与代码分层 COPY 吃缓存（SpringBoot 1.4.2+ 的 spring-boot-maven-plugin 带 layertools 可以把 jar 拆成 deps/app 多 COPY 指令）；基础镜像永远不用 latest；配置用环境变量或 -v 挂载而不是打进镜像；容器内用非 root 用户跑应用。"
   },
   {
    "t": "code",
    "lang": "dockerfile",
    "code": "# Dockerfile\nFROM eclipse-temurin:17-jre\nWORKDIR /app\nCOPY --from=build target/gm-admin.jar app.jar\nRUN useradd -r -u 1001 appuser && chown appuser:appuser /app\nUSER appuser\nEXPOSE 8080\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]\n\n# 构建与运行\ndocker build -t gm-admin:1.0 .\ndocker run -d -p 8080:8080 --name gm-admin \\\n  -e SPRING_PROFILES_ACTIVE=prod \\\n  -v /data/gm/logs:/app/logs \\\n  --memory=2g --cpus=2 \\\n  --restart=unless-stopped \\\n  gm-admin:1.0"
   },
   {
    "t": "h",
    "text": "JVM 容器感知：最容易踩的坑"
   },
   {
    "t": "p",
    "text": "JDK 8u191 之前，JVM 按宿主机内存算堆，容器限 2G 但宿主机 64G，JVM 按 64G 的 1/4 开 16G 堆，必被容器 OOM Kill。8u191+ 默认支持容器感知（UseContainerSupport），配合 -XX:MaxRAMPercentage=75.0 按容器配额算堆。CPU 同理：JVM 按核数定 GC 线程/JIT 线程/ForkJoinPool 并行度，老版本看到宿主机几十核会开出超配线程互相抢。所以基础镜像必须选新 JDK，启动参数显式给 MaxRAMPercentage。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "docker run -d --memory=2g --cpus=2 ... \\\n  gm-admin:1.0 -XX:MaxRAMPercentage=75.0\n\n# 验证容器内看到的资源\ndocker exec gm-admin free -h\ndocker exec gm-admin nproc\n\n# 老 JDK 兜底（8u191 之前必须手动）：\n# -XX:MaxHeapSize=1g -XX:ActiveProcessorCount=2"
   },
   {
    "t": "h",
    "text": "网络模式：bridge / host / none"
   },
   {
    "t": "p",
    "text": "bridge 是默认：容器通过 docker0 虚拟网桥分配独立 IP（172.17.0.x），对外访问走 NAT，需 -p 映射端口，容器间可通过自定义 bridge 网络 + 服务名互访（内置 DNS）。host 模式直接共享宿主机网络栈：无 NAT 开销性能最好，容器端口直接占宿主机端口、无端口映射，但隔离性最差、端口冲突自己管。none 只有回环，完全隔离。生产选型：无状态 HTTP 服务用 bridge（GM 后台、购买服标准姿势）；网络性能敏感或要直接抓宿主机网络时用 host（日志采集 Agent）。容器访问宿主机服务：localhost 是容器自己，要写宿主机内网 IP 或用 host.docker.internal，这是最高频的坑。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">bridge 与 host 网络模式对比</text>\n<rect x=\"30\" y=\"46\" width=\"290\" height=\"150\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"175\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">bridge（默认）</text>\n<rect x=\"55\" y=\"84\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">容器 A</text>\n<text x=\"100\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">172.17.0.2</text>\n<rect x=\"200\" y=\"84\" width=\"90\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"245\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">容器 B</text>\n<text x=\"245\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">172.17.0.3</text>\n<rect x=\"85\" y=\"140\" width=\"180\" height=\"40\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"1.5\"/>\n<text x=\"175\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">docker0 网桥 + NAT</text>\n<text x=\"175\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>-p 8080:8080 端口映射</text>\n<rect x=\"340\" y=\"46\" width=\"280\" height=\"150\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"480\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">host</text>\n<rect x=\"380\" y=\"84\" width=\"200\" height=\"40\" rx=\"6\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"480\" y=\"102\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">共享宿主机网络栈</text>\n<text x=\"480\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">无 NAT，无端口映射</text>\n<rect x=\"380\" y=\"140\" width=\"200\" height=\"40\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"480\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\" font-weight=\"bold\">性能最好 / 隔离最差</text>\n<text x=\"480\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">端口冲突自己管</text>\n<rect x=\"30\" y=\"212\" width=\"590\" height=\"32\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"325\" y=\"233\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">经典坑：容器内 localhost 是容器自己，连宿主机 MySQL/Redis 要写宿主机 IP 或 host.docker.internal</text>\n</svg>",
    "caption": "图 16：bridge 与 host 网络模式对比"
   },
   {
    "t": "h",
    "text": "docker compose 与服务编排"
   },
   {
    "t": "p",
    "text": "compose 用 yaml 描述多服务（购买服 + MySQL + Redis + Kafka），depends_on 控制启动顺序，networks 让服务用服务名互访——compose 自动建 bridge 网络并内置 DNS，jdbc:mysql://mysql:3306 里的 mysql 会解析到 MySQL 容器。docker compose up -d 一键起整套环境，是开发测试环境搭建的神器。生产环境轻量多服务混部时也可用 compose 管理，但严格生产还是 K8s。"
   },
   {
    "t": "code",
    "lang": "yaml",
    "code": "# docker-compose.yml\nservices:\n  gm:\n    image: gm-admin:1.0\n    ports:\n      - \"8080:8080\"\n    environment:\n      SPRING_PROFILES_ACTIVE: prod\n      DB_URL: jdbc:mysql://mysql:3306/gm_db\n    volumes:\n      - /data/gm/logs:/app/logs\n    depends_on:\n      - mysql\n    restart: unless-stopped\n  mysql:\n    image: mysql:8.0\n    volumes:\n      - /data/mysql:/var/lib/mysql\n    environment:\n      MYSQL_ROOT_PASSWORD: \"change-me\"\n\n# 命令\ndocker compose up -d\ndocker compose ps\ndocker compose logs -f gm"
   },
   {
    "t": "h",
    "text": "数据卷、日志驱动与资源限制"
   },
   {
    "t": "p",
    "text": "数据卷 -v /data/mysql:/var/lib/mysql 把容器内数据目录挂到宿主机，容器删了数据还在；日志同样挂出来，否则 docker rm 后日志全没。日志驱动默认 json-file（写 /var/lib/docker/containers），高吞吐日志建议配 logrotate 或改用 file 驱动；docker logs 只对 json-file/fluentd 等驱动有效。资源限制 --memory --cpus 必须配——游戏服相关服务混部时，一个容器把宿主机吃垮是灾难。restart=unless-stopped 与 always 的区别：unless-stopped 手动 stop 后 dockerd 重启不会再拉起，更可控。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "docker run -d --name gm \\\n  --memory=2g --memory-swap=2g --cpus=2 \\\n  --log-opt max-size=100m --log-opt max-file=5 \\\n  -v /data/gm/logs:/app/logs \\\n  gm-admin:1.0\n\n# 排查命令链\ndocker ps                      # 容器活着吗\ndocker logs --tail 200 gm      # 启动报错\ndocker exec -it gm bash        # 进容器看\n  # ping 目标IP / telnet 端口 / cat 配置\ndocker inspect gm              # 网络配置、挂载是否生效\ndocker stats                   # 实时资源占用"
   },
   {
    "t": "h",
    "text": "游戏服容器化的边界"
   },
   {
    "t": "p",
    "text": "GM 后台、购买服、登录服这类无状态 HTTP 服务非常适合容器化；长连接游戏服要谨慎：宿主机内核参数共享（somaxconn、fd 上限是整机概念）、网络层多一层 NAT 转发、滚动更新时玩家长连接怎么迁移、容器重启丢失内存状态——都要提前设计。现实中常见折中：无状态服全面容器化，长连接战斗服仍用裸机 + systemd，等架构演进到网关/逻辑分离再逐步容器化。"
   },
   {
    "t": "pits",
    "items": [
     "把 EXPOSE 当端口映射：EXPOSE 只是声明，对外访问必须 -p 映射",
     "容器内 curl localhost 通就认为网络没问题：localhost 是容器自己，连宿主机服务要写宿主机 IP",
     "JVM 容器不配 MaxRAMPercentage：老 JDK 按宿主机内存开堆必被 OOM Kill",
     "基础镜像用 latest：无法复现，构建结果漂移，锁版本",
     "数据不挂载：docker rm 后数据日志全丢，-v 必须配",
     "容器不设资源限制：一个容器吃垮宿主机，--memory/--cpus 是混部必配项"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：镜像分层 + Dockerfile 优化 + JVM 容器感知 + compose 编排 + 网络模式 + 数据卷 + 资源限制 + 排查命令链；无状态服容器化、长连接服谨慎边界。下一篇 K8s 基础。"
   }
  ]
 },
 {
  "id": "linux-k8s-basics",
  "title": "Kubernetes 基础：对象、调度与发布",
  "layer": 2,
  "depends": [
   "linux-docker-basics"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "K8s 把容器从「手工管理的进程」升级为「声明式编排的对象」：Pod 是调度的原子、Deployment 管副本与滚动、Service 管发现与负载、ConfigMap 管配置——游戏服上 K8s 的核心是搞清 requests/limits、探针与滚动更新。"
   },
   {
    "t": "pre",
    "items": [
     "已掌握 Docker 镜像与容器概念",
     "理解端口、负载均衡、配置注入等运维概念",
     "知道健康检查是发布的关键环节"
    ]
   },
   {
    "t": "h",
    "text": "核心对象：Pod / Deployment / Service / ConfigMap"
   },
   {
    "t": "p",
    "text": "Pod 是最小调度单元，一个 Pod 内可挂多个容器（同 Pod 共享网络与存储，用 localhost 互访——日志边车 Filebeat 与主容器同 Pod 是经典组合）；Deployment 声明「我要 3 个副本」，Controller 保证实际副本数等于期望值，滚动更新、回滚都由它管；Service 是稳定的访问入口，ClusterIP 集群内访问、NodePort 暴露到宿主机、LoadBalancer 对接云 LB，Service 通过 label selector 把流量打到 Pod；ConfigMap/Secret 把配置和敏感信息从镜像里剥出来。还有 StatefulSet（有状态服务，稳定网络标识 + 有序部署，游戏服数据库/缓存可以用）、Ingress（七层入口，类比 nginx）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 290\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Deployment / Service / Pod 关系</text>\n<rect x=\"30\" y=\"46\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"120\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\" font-weight=\"bold\">Service</text>\n<text x=\"120\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">稳定访问入口 VIP:8080</text>\n<text x=\"120\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">label selector 选 Pod</text>\n<rect x=\"30\" y=\"146\" width=\"180\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"170\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--lv1)\" font-weight=\"bold\">Deployment</text>\n<text x=\"120\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">声明 replicas: 3</text>\n<text x=\"120\" y=\"206\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">滚动更新/回滚</text>\n<rect x=\"260\" y=\"146\" width=\"110\" height=\"70\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"315\" y=\"170\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Pod 1</text>\n<text x=\"315\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">app + sidecar</text>\n<rect x=\"390\" y=\"146\" width=\"110\" height=\"70\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"445\" y=\"170\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Pod 2</text>\n<text x=\"445\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>app + sidecar</text>\n<rect x=\"520\" y=\"146\" width=\"110\" height=\"70\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"575\" y=\"170\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Pod 3</text>\n<text x=\"575\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>app + sidecar</text>\n<path d=\"M210 81 L260 150\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#k8s1)\"/>\n<path d=\"M210 100 L300 146\" stroke=\"var(--accent)\" stroke-width=\"1.5\" marker-end=\"url(#k8s1)\"/>\n<path d=\"M210 100 L410 146\" stroke=\"var(--accent)\" stroke-width=\"1.5\" marker-end=\"url(#k8s1)\"/>\n<path d=\"M210 100 L535 146\" stroke=\"var(--accent)\" stroke-width=\"1.5\" marker-end=\"url(#k8s1)\"/>\n<defs><marker id=\"k8s1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"236\" width=\"580\" height=\"44\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"256\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">ConfigMap 注入配置、Secret 注入敏感信息</text>\n<text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">配置不进镜像 → 同一镜像不同环境复用，镜像内容只由代码决定</text>\n</svg>",
    "caption": "图 17：Deployment/Service/Pod/ConfigMap 关系"
   },
   {
    "t": "h",
    "text": "requests 与 limits：调度与杀人的分界"
   },
   {
    "t": "p",
    "text": "requests 是调度依据：节点剩余资源 >= 所有 Pod 的 requests 之和才允许调度；limits 是运行时硬上限：CPU 超限被限流（throttle），内存超限直接 OOM Kill 该容器。经典错误是把 requests 设得巨大导致节点塞不进 Pod、或 limits 不给导致一个 Pod 把节点内存吃爆拖死整个节点（node-pressure eviction）。实践建议：requests 按日常均值的 80% 估，limits 按峰值上限设，Java 容器把 MaxRAMPercentage 与 limits 对齐。requests/limits 与 HPA 配合：HPA 按「当前使用量/requests」算扩缩容比例。"
   },
   {
    "t": "code",
    "lang": "yaml",
    "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: gm-admin\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: gm-admin\n  template:\n    metadata:\n      labels:\n        app: gm-admin\n    spec:\n      containers:\n        - name: gm\n          image: gm-admin:1.0\n          imagePullPolicy: IfNotPresent\n          ports:\n            - containerPort: 8080\n          resources:\n            requests:\n              cpu: 500m\n              memory: 1Gi\n            limits:\n              cpu: \"2\"\n              memory: 2Gi\n          readinessProbe:\n            httpGet: { path: /actuator/health, port: 8080 }\n            initialDelaySeconds: 20\n          livenessProbe:\n            httpGet: { path: /actuator/health, port: 8080 }\n            initialDelaySeconds: 60\n            periodSeconds: 10"
   },
   {
    "t": "h",
    "text": "滚动更新与回滚"
   },
   {
    "t": "p",
    "text": "修改 Deployment 的镜像版本触发滚动更新：默认 maxUnavailable=25%、maxSurge=25%——先起一个新 Pod，就绪后摘一个旧 Pod，交替进行，全程可用副本数不降。回滚：kubectl rollout undo deployment/gm-admin 直接回到上一个 revision；kubectl rollout history 看历史版本；kubectl rollout status 看进度。与裸机软链回滚比，K8s 把「回滚到上一版本」变成一条命令——前提是镜像 tag 有版本记录且不可变（同一 tag 覆盖 = 无法回滚，教训）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">滚动更新：先增后减</text>\n<rect x=\"40\" y=\"50\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">v1 旧 Pod</text>\n<text x=\"100\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">3 副本服务中</text>\n<rect x=\"180\" y=\"50\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"240\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">v1 旧 Pod</text>\n<text x=\"240\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">准备被替换</text>\n<rect x=\"320\" y=\"50\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"380\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\" font-weight=\"bold\">v2 新 Pod</text>\n<text x=\"380\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">就绪后接入流量</text>\n<rect x=\"460\" y=\"50\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">v2 扩副本</text>\n<text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">旧版逐个下线</text>\n<path d=\"M160 78 L180 78\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#k8s2)\"/>\n<path d=\"M300 78 L320 78\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#k8s2)\"/>\n<path d=\"M440 78 L460 78\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#k8s2)\"/>\n<defs><marker id=\"k8s2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"40\" y=\"130\" width=\"560\" height=\"44\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">默认 maxUnavailable=25% + maxSurge=25%</text>\n<text x=\"320\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">先起后杀，随时保持可用副本数，全流程服务不断</text>\n<rect x=\"40\" y=\"188\" width=\"560\" height=\"40\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"213\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\" font-weight=\"bold\">回滚：kubectl rollout undo deployment/gm-admin 一条命令回上一版本；镜像 tag 必须不可变否则无法回滚</text>\n</svg>",
    "caption": "图 18：K8s 滚动更新机制"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "kubectl rollout status deployment/gm-admin\nkubectl rollout history deployment/gm-admin\nkubectl rollout undo deployment/gm-admin          # 回上一版\nkubectl rollout undo deployment/gm-admin --to-revision=2\n\n# 查看与排查\nkubectl get pods -o wide\nkubectl describe pod gm-admin-xxxxx     # 看事件：镜像拉取/调度/OOM\nkubectl logs gm-admin-xxxxx\nkubectl exec -it gm-admin-xxxxx -- bash\nkubectl get svc / ingress / cm / secret"
   },
   {
    "t": "h",
    "text": "探针：就绪与存活"
   },
   {
    "t": "p",
    "text": "readinessProbe（就绪探针）决定 Pod 是否接入 Service 流量：没就绪就摘流量，用于「启动慢/依赖未就绪」阶段，避免 502；livenessProbe（存活探针）决定 Pod 是否被杀重启：持续失败会 kill 容器触发重启，用于检测死锁/假死。两者的区别是核心考点：readiness 失败只是不接流量（Pod 还活着），liveness 失败是直接杀掉重建。initialDelaySeconds 要给足（SpringBoot 启动 20-60 秒很常见），否则启动期间就被误杀。exec/tcpSocket/httpGet 三种探测方式，HTTP 服务用 httpGet 探 /actuator/health。"
   },
   {
    "t": "h",
    "text": "HPA 与游戏服的 K8s 实践"
   },
   {
    "t": "p",
    "text": "HPA 按指标自动扩缩：targetCPUUtilizationPercentage 80% 表示「所有 Pod 平均 CPU 使用率（当前用量/requests）超 80% 就扩容」，搭配 metrics-server。游戏服上 K8s 的现实结论：无状态服（GM 后台/购买服/登录服）上 K8s 收益明确——声明式发布、秒级回滚、自动扩缩；长连接游戏服（战斗服）要解决会话粘滞（Service 的 sessionAffinity）、滚动更新时连接迁移、StatefulSet 与数据库/Redis 的持久化，复杂度高，建议先容器化再逐步编排，不要一步到位。"
   },
   {
    "t": "code",
    "lang": "yaml",
    "code": "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: gm-admin-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: gm-admin\n  minReplicas: 3\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 80\n\n# 常用命令\nkubectl get hpa\nkubectl describe hpa gm-admin-hpa"
   },
   {
    "t": "pits",
    "items": [
     "readiness 和 liveness 混为一谈：readiness 失败摘流量不杀 Pod，liveness 失败直接杀——启动慢场景配错 liveness 会被反复误杀",
     "limits 内存不配：Pod 内存超限被 OOM Kill，或吃爆节点触发节点驱逐拖死整机",
     "镜像 tag 覆盖：同一 tag 反复 push 无法回滚到旧版本，tag 必须带版本号不可变",
     "requests 拍脑袋设巨大：节点调度不进去，明明有资源 Pod 一直 Pending",
     "initialDelaySeconds 给太短：SpringBoot 启动慢，探针误判直接杀进程"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：Pod 是调度原子、Deployment 管副本滚动、Service 管发现、ConfigMap 剥配置；requests 管调度、limits 管生死；readiness 摘流量、liveness 杀进程；HPA 按使用率扩缩；无状态服上 K8s 收益明确，长连接服谨慎设计。下一篇 Nginx 与负载均衡。"
   }
  ]
 },
 {
  "id": "linux-nginx-lb",
  "title": "Nginx 与负载均衡：反代、限流与缓存",
  "layer": 3,
  "depends": [
   "linux-net-troubleshoot"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "Nginx 是游戏服体系的事实标准入口：GM 后台反代、购买服/登录服 upstream 负载均衡、支付回调 SSL、静态资源缓存、长连接 WebSocket 代理——一个进程扛住全部七层流量。"
   },
   {
    "t": "pre",
    "items": [
     "理解 TCP 端口与 HTTP 协议",
     "会看 ss/netstat 网络状态",
     "知道负载均衡的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "反向代理与正向代理"
   },
   {
    "t": "p",
    "text": "正向代理代理的是「客户端」（替你访问外部，如科学上网/抓包工具），反向代理代理的是「服务端」（替你对外暴露，客户端不知道后端是谁）。Nginx 反代核心就两条：listen 收外部流量 + proxy_pass 转发给 upstream。游戏服场景：GM 后台外部访问走 nginx -> 内部多个 GM 实例；支付回调厂商只认一个回调地址，nginx 把回调分发到多个支付服实例。反代带来的能力：负载均衡、隐藏后端、统一 SSL 终结、限流、缓存。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">反向代理架构</text>\n<rect x=\"30\" y=\"48\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">玩家/GM</text>\n<text x=\"90\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">浏览器/客户端</text>\n<rect x=\"190\" y=\"48\" width=\"140\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"260\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">Nginx 反代</text>\n<text x=\"260\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">80/443 入口 + 限流</text>\n<rect x=\"380\" y=\"48\" width=\"110\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"435\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">后端 1</text>\n<text x=\"435\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>GM 实例 8081</text>\n<rect x=\"505\" y=\"48\" width=\"110\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"560\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">后端 2</text>\n<text x=\"560\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>GM 实例 8082</text>\n<path d=\"M150 76 L190 76\" stroke=\"var(--accent)\" stroke-width=\"2\" marker-end=\"url(#ng1)\"/>\n<path d=\"M330 76 L380 76\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#ng1)\"/>\n<path d=\"M330 76 L505 76\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#ng1)\"/>\n<defs><marker id=\"ng1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"130\" width=\"585\" height=\"46\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">负载策略</text>\n<text x=\"322\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">round_robin 轮询（默认）| least_conn 最少连接 | ip_hash 按 IP 哈希 | weight 权重</text>\n<rect x=\"30\" y=\"190\" width=\"585\" height=\"56\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"322\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">发布时摘流：server 192.168.1.11:8080 down; 然后 nginx -s reload</text>\n<text x=\"322\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">挂回后 reload，全程服务不断——裸机滚动发布的流量入口就在这</text>\n</svg>",
    "caption": "图 19：Nginx 反向代理与 upstream 负载"
   },
   {
    "t": "h",
    "text": "upstream 负载策略与健康检查"
   },
   {
    "t": "p",
    "text": "upstream 块里列后端：默认轮询，least_conn 适合长短连接混合（长连接按连接数更均匀）、ip_hash 让同一 IP 固定到同一后端（有会话态时用，游戏 GM 会话短暂无所谓）、weight 权重配新老机器。健康检查：nginx 商业版有主动健康检查，开源版靠 max_fails + fail_timeout 被动剔除（连续失败 N 次后 30 秒内不再转发），被剔除的后端会自动恢复。配置后 nginx -t 校验语法再 reload，这是铁律——reload 失败会断流量。"
   },
   {
    "t": "code",
    "lang": "nginx",
    "code": "upstream gm_backend {\n    # 默认轮询；least_conn 最少连接；ip_hash 固定 IP；weight 配权重\n    server 192.168.1.11:8081 max_fails=3 fail_timeout=30s;\n    server 192.168.1.12:8082 max_fails=3 fail_timeout=30s;\n    # server 192.168.1.13:8083 down;   # 发布时摘流\n}\n\nserver {\n    listen 80;\n    server_name gm.example.com;\n\n    location / {\n        proxy_pass http://gm_backend;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    }\n}"
   },
   {
    "t": "h",
    "text": "限流限速：漏桶算法"
   },
   {
    "t": "p",
    "text": "limit_req 实现请求限流，基于漏桶算法：limit_req_zone 定义桶（key 用 $binary_remote_addr 按客户端 IP 区分，rate=10r/s 固定速率），limit_req 在 location 里套用。burst=20 是桶容量（突发允许排队 20 个），nodelay 表示桶里的突发请求立即放行（不排队直接放，超出 rate+burst 的直接拒绝）。默认拒绝返回 503，API 场景配 limit_req_status 429 更语义化。game 服场景：GM 后台登录接口限流防爆破、支付回调接口按 IP 限流防重放刷接口。注意 limit_req_zone 必须放 http 块，zone 大小 1m 约存 1.6 万 IP。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">limit_req 漏桶 + burst 突发</text>\n<rect x=\"40\" y=\"50\" width=\"130\" height=\"70\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">突发请求</text>\n<text x=\"105\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">同一 IP 连打</text>\n<text x=\"105\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">20 个/秒</text>\n<rect x=\"250\" y=\"50\" width=\"140\" height=\"70\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\" font-weight=\"bold\">漏桶 burst=20</text>\n<text x=\"320\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">桶容量 20，漏出 10/s</text>\n<text x=\"320\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">nodelay 立即放行</text>\n<rect x=\"470\" y=\"50\" width=\"130\" height=\"70\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">超桶拒绝</text>\n<text x=\"535\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>limit_req_status 429</text>\n<text x=\"535\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>防爆破/防重放</text>\n<path d=\"M170 85 L250 85\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#ng2)\"/>\n<path d=\"M390 85 L470 85\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#ng2)\"/>\n<defs><marker id=\"ng2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"40\" y=\"144\" width=\"560\" height=\"66\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">配置要点</text>\n<text x=\"320\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">limit_req_zone 必须放 http 块；zone 1m 约存 1.6 万 IP；rate=10r/s 即 100ms/个</text>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">GM 登录防爆破用 5r/m + burst 3；支付回调防重放按 IP + 全局双限流</text>\n</svg>",
    "caption": "图 20：limit_req 漏桶与突发处理"
   },
   {
    "t": "code",
    "lang": "nginx",
    "code": "http {\n    # 定义限流桶：按客户端 IP，1m 内存，速率 10 请求/秒\n    limit_req_zone $binary_remote_addr zone=gm_api:10m rate=10r/s;\n    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;\n\n    server {\n        location /api/ {\n            limit_req zone=gm_api burst=20 nodelay;\n            limit_req_status 429;\n            proxy_pass http://gm_backend;\n        }\n        location /login {\n            limit_req zone=login burst=3 nodelay;\n            limit_req_status 429;\n            proxy_pass http://gm_backend;\n        }\n    }\n}\n\n# 测试限流\nab -n 200 -c 50 http://gm.example.com/api/health"
   },
   {
    "t": "h",
    "text": "SSL 证书与强制 HTTPS"
   },
   {
    "t": "p",
    "text": "SSL 终结在 nginx：证书（.crt）与私钥（.key）配在 server 块，listen 443 ssl + ssl_certificate/ssl_certificate_key；http 转 https 用 return 301 https://$host$request_uri。证书快过期要告警（certbot renew 定时续期或云证书服务）。支付回调、GM 后台这类涉钱涉权接口必须 HTTPS——回调和登录流量被中间人截获是安全事故。更新证书 nginx -t + reload 即可，连接不断。"
   },
   {
    "t": "code",
    "lang": "nginx",
    "code": "server {\n    listen 443 ssl;\n    server_name gm.example.com;\n    ssl_certificate     /etc/nginx/certs/gm.crt;\n    ssl_certificate_key /etc/nginx/certs/gm.key;\n    ssl_protocols TLSv1.2 TLSv1.3;\n\n    location / {\n        proxy_pass http://gm_backend;\n        proxy_set_header X-Forwarded-Proto https;\n    }\n}\n\nserver {\n    listen 80;\n    server_name gm.example.com;\n    return 301 https://$host$request_uri;\n}"
   },
   {
    "t": "h",
    "text": "静态资源缓存与 WebSocket 代理"
   },
   {
    "t": "p",
    "text": "GM 后台前端静态资源（js/css/图片）用 alias + expires 缓存，浏览器缓存 7 天，版本号变化强制刷新；expires 7d 配 add_header Cache-Control。WebSocket 代理是游戏服网关前置的常见形态：upgrade 头转发是关键——proxy_set_header Upgrade $http_upgrade; Connection upgrade; 并加大 proxy_read_timeout 防长连接断开（WS 心跳周期内不被切断）。游戏服场景：网关端口不直接暴露公网，前面挂 nginx 做 WS 代理 + 限流 + 证书终结。"
   },
   {
    "t": "code",
    "lang": "nginx",
    "code": "# 静态资源缓存\nlocation /static/ {\n    alias /data/gm-web/static/;\n    expires 7d;\n    add_header Cache-Control \"public\";\n}\n\n# WebSocket 代理（游戏服网关前置）\nmap $http_upgrade $connection_upgrade {\n    default upgrade;\n    ''      close;\n}\nserver {\n    listen 8443 ssl;\n    location /ws {\n        proxy_pass http://gw_backend;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection $connection_upgrade;\n        proxy_read_timeout 3600s;   # 长连接防断\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "改 nginx 配置不 nginx -t 直接 reload：语法错误导致 reload 失败断流量，必须先 -t 再 reload",
     "限流 zone 写在 server/location 块：limit_req_zone 必须在 http 块，否则启动报错",
     "upstream 摘流只注释不 reload：down 标记/注释后必须 nginx -s reload 才生效",
     "WS 代理不配 Upgrade 头：客户端连接被当成普通 HTTP，长连接建立失败",
     "SSL 证书过期不监控：到期后全站握手失败，证书有效期告警是标配"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：反代 + upstream 负载 + 摘流发布是裸机滚动发布的流量入口；limit_req 漏桶限流防爆破防重放（zone 在 http 块，429 语义化）；SSL 终结 + http 跳转 + 证书监控；静态缓存与 WS 代理（Upgrade 头）覆盖游戏服全场景。下一篇监控告警体系。"
   }
  ]
 },
 {
  "id": "linux-monitoring-alerting",
  "title": "监控告警体系：Prometheus 全家桶",
  "layer": 3,
  "depends": [
   "linux-perf-four"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "Prometheus 拉指标、Grafana 画看板、Alertmanager 发告警，配合 Node Exporter 采机器、黑盒探针查端口进程、自定义指标进业务——一套体系让线上问题从「玩家投诉才知道」变成「指标先报警」。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 top/vmstat/iostat 四件套",
     "理解 CPU/内存/磁盘/网络指标含义",
     "知道 HTTP 接口与 JSON 基本概念"
    ]
   },
   {
    "t": "h",
    "text": "监控体系三层：指标 / 日志 / 链路"
   },
   {
    "t": "p",
    "text": "完整可观测性分三层：指标（Metrics）回答「现在坏没坏」——CPU/内存/连接数/QPS/延迟，Prometheus 管；日志（Logs）回答「为什么坏」——异常堆栈、错误码，Filebeat/ELK 管；链路（Traces）回答「坏在哪一段」——一次请求经过哪些服务各耗时多少，SkyWalking/Jaeger 管。游戏服优先建设指标层（成本低见效快），日志层配合 grep 兜底，链路层看团队投入。告警的本质是「指标异常先于玩家感知」，阈值要给对，误报会让人麻木，漏报会出事故。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 270\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Prometheus 采集架构</text>\n<rect x=\"30\" y=\"48\" width=\"150\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">Node Exporter</text>\n<text x=\"105\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">9100：机器指标</text>\n<rect x=\"30\" y=\"130\" width=\"150\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">Blackbox Exporter</text>\n<text x=\"105\" y=\"172\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">9115：端口/进程/HTTP</text>\n<rect x=\"30\" y=\"212\" width=\"150\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"105\" y=\"233\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">应用 /micrometer</text>\n<text x=\"105\" y=\"251\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>业务指标 + JVM</text>\n<rect x=\"230\" y=\"48\" width=\"150\" height=\"214\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"305\" y=\"74\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--accent)\" font-weight=\"bold\">Prometheus</text>\n<text x=\"305\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">pull 拉取 9090</text>\n<text x=\"305\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">PromQL 查询</text>\n<text x=\"305\" y=\"146\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">告警规则评估</text>\n<text x=\"305\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>TSDB 存储 15d</text>\n<text x=\"305\" y=\"226\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>Alertmanager</text>\n<text x=\"305\" y=\"244\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>分组/抑制/静默</text>\n<rect x=\"430\" y=\"48\" width=\"180\" height=\"80\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Grafana</text>\n<text x=\"520\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">3000：可视化看板</text>\n<text x=\"520\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">对接 Prometheus</text>\n<rect x=\"430\" y=\"150\" width=\"180\" height=\"60\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"520\" y=\"172\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">告警通道</text>\n<text x=\"520\" y=\"192\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">钉钉/企业微信/电话</text>\n<path d=\"M180 80 L230 80\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#mo1)\"/>\n<path d=\"M180 162 L230 162\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#mo1)\"/>\n<path d=\"M180 237 L230 237\" stroke=\"var(--ink)\" stroke-width=\"2\" marker-end=\"url(#mo1)\"/>\n<path d=\"M380 100 L430 100\" stroke=\"var(--accent) stroke-width=\"2\" marker-end=\"url(#mo1)\"/>\n<path d=\"M305 180 L305 200 L520 200 L520 210\" stroke=\"var(--lv3)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#mo1)\"/>\n<defs><marker id=\"mo1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n</svg>",
    "caption": "图 21：Prometheus + Exporter + Grafana + Alertmanager 架构"
   },
   {
    "t": "h",
    "text": "Node Exporter 与机器指标采集"
   },
   {
    "t": "p",
    "text": "Node Exporter 跑在每台机器上（9100 端口），暴露 node_cpu_seconds_total、node_memory_MemAvailable_bytes、node_filesystem_avail_bytes、node_network_receive_bytes_total 等标准指标。Prometheus 通过 job 拉取：scrape_configs 里定义 job 与 targets，schedule 每 15 秒拉一次。告警规则用 PromQL 表达式：CPU 使用率 = 100 - avg by(instance)(rate(node_cpu_seconds_total{mode=\"idle\"}[5m]))*100；磁盘使用率 = (1 - node_filesystem_avail_bytes{mountpoint=\"/data\"} / node_filesystem_size_bytes{mountpoint=\"/data\"})*100。游戏服按服/分区/进程分别打 labels，告警才能定位到具体哪台哪服。"
   },
   {
    "t": "code",
    "lang": "yaml",
    "code": "# prometheus.yml 片段\nscrape_configs:\n  - job_name: node\n    static_configs:\n      - targets: ['192.168.1.11:9100', '192.168.1.12:9100']\n  - job_name: blackbox\n    metrics_path: /probe\n    params:\n      module: [tcp_connect]\n    static_configs:\n      - targets:\n          - '192.168.1.11:8080'\n          - '192.168.1.12:8080'\n    relabel_configs:\n      - source_labels: [__address__]\n        target_label: __param_target\n      - source_labels: [__param_target]\n        target_label: instance\n\n# PromQL 示例\n# 5 分钟平均 CPU 使用率\n100 - avg by(instance) (rate(node_cpu_seconds_total{mode='idle'}[5m])) * 100\n# /data 分区使用率\n(1 - node_filesystem_avail_bytes{mountpoint='/data'} / node_filesystem_size_bytes{mountpoint='/data'}) * 100"
   },
   {
    "t": "h",
    "text": "业务自定义指标：Micrometer 与 JVM"
   },
   {
    "t": "p",
    "text": "SpringBoot 2.x 默认集成 Micrometer，加 micrometer-registry-prometheus 依赖并暴露 /actuator/prometheus 端点即可被 Prometheus 拉取。自带 JVM 指标（jvm_memory_used_bytes、jvm_gc_pause_seconds 等）。业务指标用 MeterRegistry 自建：在线人数 Gauge、登录 QPS Counter、充值失败率、任务队列积压、网关连接数——这些才是游戏服监控的灵魂。加自定义标签（serverId、opcode）区分维度。exporter 拉取慢接口用 Timer/SloTimer 直接得到 P95/P99，比日志分析准得多。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "@RestController\npublic class MetricsController {\n    private final MeterRegistry registry;\n    private final AtomicInteger online = new AtomicInteger();\n    private final AtomicInteger taskQueueDepth = new AtomicInteger();\n\n    public MetricsController(MeterRegistry registry) {\n        this.registry = registry;\n        Gauge.builder(\"game_online_players\", online, AtomicInteger::get)\n            .tag(\"server\", \"s1\").register(registry);\n        Gauge.builder(\"game_task_queue_depth\", taskQueueDepth, AtomicInteger::get)\n            .register(registry);\n    }\n\n    // 充值回调接口打点\n    public void onPayCallback(boolean ok, long costMs) {\n        registry.counter(\"game_pay_callback_total\", \"result\", ok ? \"success\" : \"fail\")\n            .increment();\n        registry.timer(\"game_pay_callback_rt\").record(costMs, TimeUnit.MILLISECONDS);\n    }\n}\n\n# 抓取配置\n# application.yml: management.endpoints.web.exposure.include=prometheus,health"
   },
   {
    "t": "h",
    "text": "Alertmanager 告警规则与分级"
   },
   {
    "t": "p",
    "text": "Prometheus 评估规则（rule_files 指向 rules.yml），命中规则推给 Alertmanager，Alertmanager 负责分组（group_by 把同服务的告警合并）、抑制（inhibition，节点挂了不再报子告警）、静默（silence 维护期屏蔽）、路由（route 按级别发不同通道）。游戏服告警分级：P0 紧急（电话，服务挂/数据风险，如磁盘 90%、进程消失、CLOSE_WAIT 暴涨）；P1 严重（IM 消息，如 CPU 90% 持续、充值失败率 >1%）；P2 提醒（如磁盘 80%、备份失败）。关键原则：告警必须有处理人、有处理预案，否则告警是噪音；阈值先宽松再收紧，减少误报麻木。"
   },
   {
    "t": "code",
    "lang": "yaml",
    "code": "# rules.yml 片段\ngroups:\n  - name: game\n    rules:\n      - alert: NodeDown\n        expr: up{job='node'} == 0\n        for: 1m\n        labels: { severity: P0 }\n        annotations:\n          summary: '{{ $labels.instance }} 宕机'\n      - alert: DiskUsageHigh\n        expr: (1 - node_filesystem_avail_bytes{mountpoint='/data'} / node_filesystem_size_bytes{mountpoint='/data'}) * 100 > 90\n        for: 5m\n        labels: { severity: P0 }\n      - alert: CpuHigh\n        expr: 100 - avg by(instance) (rate(node_cpu_seconds_total{mode='idle'}[5m])) * 100 > 90\n        for: 10m\n        labels: { severity: P1 }\n      - alert: CloseWaitBurst\n        expr: increase(node_netstat_Tcp_CloseWait[5m]) > 1000\n        for: 5m\n        labels: { severity: P1 }\n\n# Alertmanager 路由按 severity 分发\nroute:\n  group_by: ['alertname']\n  routes:\n    - match: { severity: P0 }\n      receiver: phone\n    - match: { severity: P1 }\n      receiver: im"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">告警分级与收敛链路</text>\n<rect x=\"30\" y=\"46\" width=\"130\" height=\"64\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">P0 紧急</text>\n<text x=\"95\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>服务挂/数据风险</text>\n<text x=\"95\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>电话告警</text>\n<rect x=\"180\" y=\"46\" width=\"130\" height=\"64\" rx=\"7\" fill=\"var(--lv2-bg)\" stroke=\"var(--lv2)\" stroke-width=\"1.5\"/>\n<text x=\"245\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv2)\" font-weight=\"bold\">P1 严重</text>\n<text x=\"245\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">CPU/连接数异常</text>\n<text x=\"245\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>IM 群告警</text>\n<rect x=\"330\" y=\"46\" width=\"130\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"395\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">P2 提醒</text>\n<text x=\"395\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>磁盘 80%/备份失败</text>\n<text x=\"395\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>IM 消息</text>\n<rect x=\"480\" y=\"46\" width=\"130\" height=\"64\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"545\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">处理闭环</text>\n<text x=\"545\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>告警必须有负责人</text>\n<text x=\"545\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>有预案，避免噪音</text>\n<path d=\"M160 78 L180 78\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#mo2)\"/>\n<path d=\"M310 78 L330 78\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#mo2)\"/>\n<path d=\"M460 78 L480 78\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#mo2)\"/>\n<defs><marker id=\"mo2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"130\" width=\"580\" height=\"72\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"152\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Alertmanager 收敛机制</text>\n<text x=\"320\" y=\"174\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">分组：同服务同级别合并一条；抑制：节点挂了不重复报子告警；静默：维护期屏蔽</text>\n<text x=\"320\" y=\"194\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>核心：告警要「可行动」，收到即知道该干嘛，否则全是噪音，人会麻木</text>\n</svg>",
    "caption": "图 22：告警分级、路由与收敛机制"
   },
   {
    "t": "h",
    "text": "进程 / 端口 / 日志监控"
   },
   {
    "t": "p",
    "text": "进程与端口监控用 Blackbox Exporter（TCP/HTTP 探活）：tcp_connect 探端口、http 探健康接口，比 node_exporter 的进程计数更接近「服务可用性」。游戏服必配：端口探活（进程死了端口消失）、HTTP 健康检查（进程活着但接口异常）、日志关键字告警（ERROR 级别突增、NPE 连续出现）——日志监控用 Promtail/Loki 或 Filebeat + ES watcher，核心是「异常先报警而非玩家投诉」。进程假死的场景：端口通、进程在、但请求全超时——此时要靠业务指标（QPS 归零、任务队列积压、RT 暴涨）来发现，这就是业务指标的灵魂所在。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 黑盒探活：TCP + HTTP\nblackbox_exporter --config.file=blackbox.yml &\n# blackbox.yml modules: tcp_connect / http_2xx 定义探活方式\n\n# 日志关键字监控（Promtail 方案）\nscrape_configs:\n  - job_name: game-log\n    static_configs:\n      - targets: ['192.168.1.11:9080']\n    pipeline_stages:\n      - regex:\n          expression: 'ERROR.*(?P<error>Exception|NPE)'\n      - metrics:\n          error_count:\n            type: Counter\n            description: 'error log count'\n            source: error\n\n# 快速自建：每分钟 grep 错误数写文件 + node_exporter textfile\n# */1 * * * * grep -c ERROR /data/game/logs/game.log | awk '{print \"game_error_total \" $1}' > /var/lib/node_exporter/textfile/game_errors.prom"
   },
   {
    "t": "h",
    "text": "游戏服监控指标清单"
   },
   {
    "t": "list",
    "items": [
     "机器层：CPU/load、内存 available、/data 磁盘使用率与 inode、网卡流量与丢包、上下文切换",
     "进程层：端口探活、进程数、fd 使用率、线程数",
     "JVM 层：堆使用、GC 次数与暂停时间、FGC 频率、线程状态分布",
     "业务层：在线人数、登录 QPS、支付回调成功率、排行榜刷新耗时、任务队列深度、网关连接数",
     "链路层：登录链路 P95/P99、充值回调 P95、下游 MySQL/Redis/Kafka 耗时"
    ]
   },
   {
    "t": "pits",
    "items": [
     "只看系统指标不看业务指标：进程活着但玩家登录全失败，系统指标全绿，业务指标才兜底",
     "告警没负责人没预案：告警响了没人处理=噪音，人麻了反而掩盖真故障",
     "阈值一次拍死：先宽松后收紧，误报会让人忽略告警",
     "Grafana 数据源连错/看板没人维护：监控先于告警，看板失效等于没监控",
     "磁盘告警只看容量不看 inode：df -i 100% 写文件失败但容量没满，告警规则两个都要"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：指标/日志/链路三层可观测；Prometheus pull + Node/Blackbox Exporter 采机器与探活，Micrometer 出 JVM 与业务指标；Alertmanager 分组抑制路由按 P0/P1/P2 分级；进程端口探活 + 日志关键字告警 + 业务指标清单构成游戏服监控闭环。下一篇高可用与容灾。"
   }
  ]
 },
 {
  "id": "linux-ha-dr",
  "title": "高可用与容灾：VIP、多机房与备份",
  "layer": 3,
  "depends": [
   "linux-nginx-lb",
   "linux-monitoring-alerting"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "高可用是「出故障后服务不中断」，容灾是「出大故障后数据不丢」：Keepalived 漂 VIP 保入口不挂，多机房互备保地区级故障，备份策略保数据底线，故障演练与应急预案保证人知道怎么动。"
   },
   {
    "t": "pre",
    "items": [
     "理解 nginx 反代与入口概念",
     "知道 MySQL 主从与数据持久化",
     "接触过备份与恢复的基本概念"
    ]
   },
   {
    "t": "h",
    "text": "高可用分层：入口 / 应用 / 数据"
   },
   {
    "t": "p",
    "text": "三层高可用：入口层（nginx + Keepalived VIP 漂移，单点挂了自动切）、应用层（多副本 + 负载均衡，横向扩容与摘流）、数据层（MySQL 主从 + 自动切换、Redis 主从/哨兵、Kafka 多副本）。高可用不是「配置了就是高可用」，而是「任何单点故障都有预案且演练过」。游戏服体系里：登录服/购买服/GM 后台天然无状态可多副本；游戏服本服是有状态单点，靠「分线 + 跨服迁移」降低爆炸半径；数据库与缓存是全服命脉，必须主从 + 自动切换。"
   },
   {
    "t": "h",
    "text": "Keepalived 双机热备：VIP 漂移"
   },
   {
    "t": "p",
    "text": "Keepalived 在两台 nginx 上跑 VRRP 协议，对外广播一个虚拟 IP（VIP）。正常情况下 VIP 绑在主节点（MASTER），客户端访问 VIP 即打到主 nginx；主节点宕机后 BACKUP 节点通过 VRRP 心跳发现主失联，抢占 VIP，流量自动切到备 nginx——客户端无感知。keepalived.conf 核心：vrrp_instance 里配虚拟路由 ID（同网段唯一）、主备优先级（priority 主 100 备 90）、VIP 地址；加 nginx 存活检测脚本，nginx 挂了主动降级让 VIP 漂走（否则 nginx 挂 VIP 还在主上等于白搭）。游戏服入口标配：双 nginx + VIP，故障切换秒级。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Keepalived 双机热备：VIP 漂移</text>\n<rect x=\"30\" y=\"48\" width=\"130\" height=\"56\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">客户端</text>\n<text x=\"95\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">访问 VIP 10.0.0.100</text>\n<rect x=\"255\" y=\"48\" width=\"160\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"335\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">Nginx A（MASTER）</text>\n<text x=\"335\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>priority=100 持有 VIP</text>\n<rect x=\"455\" y=\"48\" width=\"160\" height=\"56\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Nginx B（BACKUP）</text>\n<text x=\"535\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>priority=90 待命</text>\n<path d=\"M160 76 L255 76\" stroke=\"var(--accent) stroke-width=\"2\" marker-end=\"url(#ha1)\"/>\n<defs><marker id=\"ha1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"320\" y=\"126\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">VRRP 心跳 1 秒；A 失联后 B 抢占 VIP</text>\n<rect x=\"255\" y=\"140\" width=\"160\" height=\"56\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"335\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">A 宕机</text>\n<text x=\"335\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>VIP 漂移到 B</text>\n<rect x=\"455\" y=\"140\" width=\"160\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"535\" y=\"162\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">B 接管 VIP</text>\n<text x=\"535\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>流量切到 B，秒级</text>\n<path d=\"M160 76 L160 168 L255 168\" stroke=\"var(--lv3)\" stroke-width=\"2\" fill=\"none\" marker-end=\"url(#ha1)\"/>\n<rect x=\"30\" y=\"212\" width=\"580\" height=\"34\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"234\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">关键：配 nginx 存活检测脚本，nginx 挂了主动降级让 VIP 漂走；VIP 必须在网卡上（绑 eth0:0）</text>\n</svg>",
    "caption": "图 23：Keepalived VIP 漂移双机热备"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# /etc/keepalived/keepalived.conf（MASTER）\n! Configuration File for keepalived\nglobal_defs {\n    router_id NGINX_HA\n    script_user root\n    enable_script_security\n}\n\nvrrp_script chk_nginx {\n    script \"/etc/keepalived/check_nginx.sh\"   # nginx 挂了返回非 0\n    interval 2\n    weight -20\n}\n\nvrrp_instance VI_1 {\n    state MASTER\n    interface eth0\n    virtual_router_id 51\n    priority 100\n    advert_int 1\n    virtual_ipaddress {\n        10.0.0.100/24 dev eth0 label eth0:0\n    }\n    track_script {\n        chk_nginx\n    }\n}\n\n# BACKUP 节点：state BACKUP / priority 90 / virtual_router_id 相同\n# 校验与启停\nkeepalived -t -f /etc/keepalived/keepalived.conf\nsystemctl start keepalived\nip addr show eth0 | grep 10.0.0.100    # 看 VIP 在谁身上"
   },
   {
    "t": "h",
    "text": "多机房部署"
   },
   {
    "t": "p",
    "text": "多机房（多可用区）解决的是「一个机房挂掉」的级联故障。三种常见形态：双活（两个机房都接流量，DNS/GSLB 分流，适合无状态服与可多主的缓存）、主备（主机房全量，备机房热备，故障切换，适合数据库）、两地三中心（同城双活 + 异地灾备，成本最高）。游戏服现实方案：登录服/购买服/GM 双机房双活，数据库主备 + 半同步复制，Kafka 双机房副本（跨机房延迟注意 topic 的 min.insync.replicas 与 producer acks 权衡），Redis 用哨兵/Cluster 跨机房（跨机房网络延迟要评估）。核心原则：任何跨机房方案都要量化「延迟成本」——游戏对延迟敏感，跨机房主从同步的 RTT 必须测过再定。"
   },
   {
    "t": "h",
    "text": "数据备份策略"
   },
   {
    "t": "p",
    "text": "备份三要素：全量（每天一次） + 增量（binlog/归档） + 验证（定期恢复演练）。MySQL 全量用 mysqldump（逻辑备份）或 xtrabackup（物理热备，不锁库），配合 binlog 做时间点恢复；备份保留 N 天 + 定期冷备到异机/异地。游戏服数据分层备份：玩家档案/充值流水（必须备份，恢复 SLA 小时级）、Redis 缓存（可重建，按需备份）、Kafka 日志（短期保留）。备份最容易被忽视的是「验证」——备份成功 ≠ 能恢复，每月做一次恢复演练，灾难时才发现备份坏了是最惨的事故。备份脚本要落盘 cron + 监控（备份失败告警 P1）。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 备份脚本骨架（cron 每天 3 点）\n#!/bin/bash\nset -euo pipefail\nBACKUP_DIR=/backup/mysql\nTS=$(date +%Y%m%d%H%M%S)\n\n# 物理热备（不锁库）\nxtrabackup --backup --target-dir=$BACKUP_DIR/$TS\nxtrabackup --prepare --target-dir=$BACKUP_DIR/$TS\n# 打包归档\ntar czf $BACKUP_DIR/mysql-$TS.tar.gz -C $BACKUP_DIR $TS\n# 同步到异地\nrsync -az $BACKUP_DIR/mysql-$TS.tar.gz backup@192.168.2.10:/backup/mysql/\n# 清理 14 天前\nfind $BACKUP_DIR -name 'mysql-*.tar.gz' -mtime +14 -delete\n\n# 定时 + 监控\n# 0 3 * * * /data/scripts/backup_mysql.sh >> /data/logs/backup.log 2>&1\n# 告警规则：job 的 up==0（脚本成功才上报成功指标）\n# 每月恢复演练：恢复到一个测试实例验证数据可读"
   },
   {
    "t": "h",
    "text": "故障演练与应急预案"
   },
   {
    "t": "p",
    "text": "高可用是「配置出来的」，可靠性是「练出来的」。故障演练清单：主 nginx 宕机（看 VIP 漂移秒级）、主库宕机（看主从切换是否自动化、应用连接池是否秒切）、Redis 主宕（哨兵自动切换）、Kafka broker 宕（producer 是否降级）、磁盘满（监控是否 P0 告警、日志清理预案是否可用）。应急预案三要素：触发条件（什么现象触发预案）、操作步骤（谁做什么、顺序）、回滚/验证（如何确认恢复）。游戏服典型应急预案：开服失败（回滚到上一版本 + 数据校验）、全服卡顿（先定位负载还是下游、必要时分线降级）、支付链路中断（暂停充值入口、公告补偿预案）。演练产出：预案更新 + 监控盲区补齐，形成闭环。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">容灾体系：备份与验证闭环</text>\n<rect x=\"30\" y=\"46\" width=\"180\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">全量备份</text>\n<text x=\"120\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">每天凌晨 xtrabackup</text>\n<rect x=\"230\" y=\"46\" width=\"180\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">增量 + binlog</text>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>时间点恢复能力</text>\n<rect x=\"430\" y=\"46\" width=\"180\" height=\"64\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"520\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\" font-weight=\"bold\">异地冷备</text>\n<text x=\"520\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>rsync 到异机/异地</text>\n<path d=\"M210 78 L230 78\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#ha2)\"/>\n<path d=\"M410 78 L430 78\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#ha2)\"/>\n<defs><marker id=\"ha2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"130\" width=\"580\" height=\"44\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">备份监控</text>\n<text x=\"320\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>备份脚本成功才上报指标，失败 P1 告警——备份失败的代价是「以为有备份」</text>\n<rect x=\"30\" y=\"188\" width=\"580\" height=\"36\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"211\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\" font-weight=\"bold\">每月恢复演练：备份成功 ≠ 能恢复；演练产出预案更新 + 监控盲区补齐</text>\n</svg>",
    "caption": "图 24：备份-监控-演练闭环"
   },
   {
    "t": "pits",
    "items": [
     "Keepalived 配了 VIP 没配 nginx 存活检测：nginx 挂了 VIP 还在主上，白切",
     "备份成功就完事：备份不验证 = 没备份，必须每月恢复演练",
     "多机房同步不计延迟成本：跨机房 RTT 大，半同步复制/生产者 acks 都要权衡",
     "应急预案只有文档没演练：故障时第一反应是翻文档，演练过才有肌肉记忆",
     "主从切换不自动化：主库挂了等人工切，SLA 按小时计，哨兵/MHA 自动切换是标配"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：入口 Keepalived VIP 漂移 + nginx 检测脚本；应用多副本摘流；数据主从自动切换；多机房按延迟量化选双活/主备；备份全量+增量+异地+验证四件套；故障演练产出预案与监控闭环。下一篇安全加固。"
   }
  ]
 },
 {
  "id": "linux-security-hardening",
  "title": "安全加固：SSH、防火墙与最小权限",
  "layer": 3,
  "depends": [
   "linux-command-suite"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "游戏服的安全不是「被攻击后处理」，而是「部署基线里就加固」：SSH 禁密码用密钥、防火墙最小开放、root 不跑服务、sudo 精确授权、危险命令管控——每一层都让攻击者多花一道功夫，纵深防御才有意义。"
   },
   {
    "t": "pre",
    "items": [
     "理解端口与网络概念",
     "会用 chmod/chown 做权限管理",
     "知道 root 权限的风险"
    ]
   },
   {
    "t": "h",
    "text": "SSH 加固：第一道门"
   },
   {
    "t": "p",
    "text": "SSH 是服务器最暴露的攻击面（公网 22 端口天天被扫），加固要点：禁用 root 直接登录（PermitRootLogin no，运维用普通账号 + sudo）；禁用密码登录（PasswordAuthentication no，只用密钥）；改监听端口（Port 22022 降低被扫概率，配合防火墙限制来源 IP 更有效）；Fail2ban 防暴力破解（多次失败封 IP）；密钥权限 chmod 600 ~/.ssh/authorized_keys。生产事故高发区：root 密码弱被扫破、密钥文件权限过宽被读、SSH 配置改错把自己锁在门外——改 SSH 前必须保留带外通道（云控制台 VNC/串口），改后先新开一个连接验证再断开旧的。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# /etc/ssh/sshd_config 关键项\nPort 22022\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\nAllowUsers deploy\nMaxAuthTries 3\n\n# 生成密钥并分发\nssh-keygen -t ed25519\nssh-copy-id -i ~/.ssh/id_ed25519.pub -p 22022 deploy@192.168.1.11\n\n# 改配置后验证再断开\nssh -t -p 22022 deploy@192.168.1.11 'sudo systemctl restart sshd'\n# 新开连接验证能进，再关旧连接\n\n# Fail2ban 防爆破\napt install fail2ban\n# /etc/fail2ban/jail.local\n[sshd]\nenabled = true\nport = 22022\nmaxretry = 3\nbantime = 3600"
   },
   {
    "t": "h",
    "text": "防火墙：iptables 与 firewalld"
   },
   {
    "t": "p",
    "text": "两者都基于内核 netfilter，iptables 是底层工具（表+链+规则），firewalld 是高层封装（区域 zone + 服务）。CentOS7+ 默认 firewalld：firewall-cmd --permanent --add-port=8080/tcp 开放端口、--add-service=http 开放服务、--reload 生效、--list-all 查看；临时规则不加 --permanent 重启即失。iptables 直接操作：-A INPUT -p tcp --dport 22 -j ACCEPT、-P INPUT DROP 默认拒绝、-m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT 放行回包。原则：默认拒绝 + 最小开放——只开必要端口（SSH、游戏端口、监控 9100 只对监控内网 IP 开放）；别同时跑 firewalld 和 iptables 会冲突；改防火墙前留后路（云服务器至少留 VNC 通道），配错把自己锁在门外。游戏服安全组/防火墙四件套：SSH 限 IP、游戏端口只开必要来源、监控端口内网限定、支付/回调接口限渠道 IP。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">防火墙最小开放原则</text>\n<rect x=\"30\" y=\"48\" width=\"130\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"95\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">SSH 22022</text>\n<text x=\"95\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>仅运维 IP</text>\n<rect x=\"180\" y=\"48\" width=\"130\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"245\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">游戏端口</text>\n<text x=\"245\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>网关/战斗 限定来源</text>\n<rect x=\"330\" y=\"48\" width=\"130\" height=\"50\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"395\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">监控 9100</text>\n<text x=\"395\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>仅监控内网</text>\n<rect x=\"480\" y=\"48\" width=\"130\" height=\"50\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"545\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">其他全拒</text>\n<text x=\"545\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>默认 DROP</text>\n<rect x=\"30\" y=\"120\" width=\"580\" height=\"112\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">firewalld 命令（CentOS7+）</text>\n<text x=\"320\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted\">firewall-cmd --permanent --add-port=8080/tcp 开放端口</text>\n<text x=\"320\" y=\"186\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>firewall-cmd --reload 生效；--list-all 查看；临时规则不加 --permanent 重启即失</text>\n<text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>坑：别同时跑 firewalld 和 iptables；配错防火墙前留 VNC 带外通道，防锁死在门外</text>\n</svg>",
    "caption": "图 25：防火墙最小开放原则"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# firewalld（CentOS7+ 默认）\nfirewall-cmd --permanent --add-port=8080/tcp\nfirewall-cmd --permanent --add-service=http\nfirewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=10.0.0.0/8 port port=22 protocol=tcp accept'\nfirewall-cmd --reload\nfirewall-cmd --list-all\n\n# iptables（老系统/精细控制）\niptables -P INPUT DROP                     # 默认拒绝\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\niptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\niptables -A INPUT -p tcp --dport 8080 -s 10.0.0.0/8 -j ACCEPT\nservice iptables save                       # 持久化"
   },
   {
    "t": "h",
    "text": "用户权限与 sudo 最小化"
   },
   {
    "t": "p",
    "text": "生产铁律：不用 root 跑任何服务。Java 服务被 RCE 拿到 shell 时，root = 整机沦陷，攻击者可改配置、种木马、删数据；专用账号被攻破破坏面只限该账号可写目录。部署规范：建专用账号 useradd -m deploy，服务目录 chown -R deploy:deploy，sudo 精确到命令（sudoers 写 NOPASSWD 白名单：/usr/bin/systemctl restart game、/usr/bin/nginx -s reload），不给 ALL。密码文件/私钥 chmod 600。sudo 日志审计 /var/log/sudo 记录谁执行了什么——被攻破时这是第一手取证资料。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 创建部署账号并授权\nuseradd -m -s /bin/bash deploy\necho 'deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart game, /usr/bin/nginx -s reload' >> /etc/sudoers.d/deploy\nchown -R deploy:deploy /data/game\n\n# 密码文件 600 只 owner 可读\nchmod 600 /data/game/conf/db.properties\n\n# sudo 审计\ncat /var/log/sudo | grep -i 'root.*(ALL)'\n\n# 禁止 root 远程\n# sshd_config: PermitRootLogin no"
   },
   {
    "t": "h",
    "text": "危险命令管控与历史记录"
   },
   {
    "t": "p",
    "text": "rm -rf、shutdown、kill -9 全库、mysql -e 'DROP TABLE'、git push --force 都是高危操作。管控手段：高危命令统一走脚本封装（发布脚本、回滚脚本），不裸敲；sudo 白名单不放 rm/mysql；操作审计 history 带时间戳（HISTTIMEFORMAT='%F %T '）+ 共享到日志服；关键生产变更走发布单 + 双人复核（一人操作一人盯）。游戏服事故里「手滑 rm -rf 错目录」「在错的服务器执行了重装脚本」占比不低——防呆设计：脚本开头检查 hostname/服务目录、高危命令加确认参数（rm -i 别名）。"
   },
   {
    "t": "h",
    "text": "入侵检测基础"
   },
   {
    "t": "p",
    "text": "安全监控的核心是「知道被攻了」：命令历史异常（history 被清、突然出现非运维时段操作）、异常登录（last 看最近登录、/var/log/secure 看 SSH 失败、新账号出现在 /etc/passwd）、文件被改（监控关键文件 md5、定时任务被注入 crontab -l 对基线）、对外连接异常（ss -ant 突然出现陌生外连、/proc 里有可疑进程）、挖矿木马常见特征（CPU 打满但 ps 看不到常规进程、连接矿池 IP）。排查命令：last、who、awk '/Failed password/' /var/log/secure | awk '{print $11}' | sort | uniq -c、ss -antp | grep ESTABLISHED 看外连、检查 /etc/cron* 与 /var/spool/cron/*。发现入侵立即断网取证（保留现场）再清理，别先杀进程——证据没了。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">纵深防御：四层防线</text>\n<rect x=\"30\" y=\"48\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">① 边界</text>\n<text x=\"100\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>防火墙/安全组</text>\n<text x=\"100\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>最小开放</text>\n<rect x=\"185\" y=\"48\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"255\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">② 访问</text>\n<text x=\"255\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>SSH 密钥/免 root</text>\n<text x=\"255\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>Fail2ban</text>\n<rect x=\"340\" y=\"48\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"410\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">③ 权限</text>\n<text x=\"410\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>最小权限账号</text>\n<text x=\"410\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>sudo 精确白名单</text>\n<rect x=\"495\" y=\"48\" width=\"140\" height=\"80\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"565\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\" font-weight=\"bold\">④ 检测</text>\n<text x=\"565\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>登录审计/文件基线</text>\n<text x=\"565\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>异常外连/挖矿特征</text>\n<path d=\"M170 88 L185 88\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#se1)\"/>\n<path d=\"M325 88 L340 88\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#se1)\"/>\n<path d=\"M480 88 L495 88\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#se1)\"/>\n<defs><marker id=\"se1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"152\" width=\"580\" height=\"80\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">入侵检查三分钟</text>\n<text x=\"320\" y=\"198\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>last 查登录；/var/log/secure 查爆破来源 IP；ss -antp 查陌生外连</text>\n<text x=\"320\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>crontab -l 与 /etc/cron* 对基线；发现入侵先断网取证保留现场，再清理</text>\n</svg>",
    "caption": "图 26：纵深防御四层防线"
   },
   {
    "t": "pits",
    "items": [
     "root 跑游戏服：被 RCE 整机沦陷，专用账号 + sudo 白名单是安全基线",
     "SSH 改配置不验证就断开：把自己锁在门外，改前留带外通道、改后新连接验证",
     "防火墙默认 ACCEPT + 只加拒绝：规则全白搭，必须默认拒绝 + 最小开放",
     "sudo 给 ALL：等于给 root，白名单精确到命令并配审计",
     "密码文件 644：数据库密码人人可读，私钥/密码文件必须 600",
     "发现入侵先杀进程：证据没了没法取证，先断网快照保留现场"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：SSH 密钥免密 + 禁 root + Fail2ban；防火墙默认拒绝最小开放；专用账号 + sudo 精确白名单 + 审计；危险命令脚本化管控；四层纵深防御 + 三分钟入侵检查。下一篇日志分析与排查。"
   }
  ]
 },
 {
  "id": "linux-log-analysis",
  "title": "日志分析与排查：规范、采集与定位",
  "layer": 3,
  "depends": [
   "linux-command-suite",
   "linux-disk-storage"
  ],
  "covers": [
   "linux-05",
   "linux-03"
  ],
  "quiz": [
   "linux-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "日志是线上问题的唯一真相：规范先行（统一 trace 字段、按天滚动），Filebeat + ELK 采集成链路，grep/awk/sed 做快速定位，logrotate 管生命周期——四段组合让「几 G 日志里捞一根针」变成可操作流程。"
   },
   {
    "t": "pre",
    "items": [
     "会 grep/awk/sed 文本三剑客",
     "理解日志文件与磁盘的关系",
     "部署过 Java 服务，知道 logback 配置"
    ]
   },
   {
    "t": "h",
    "text": "日志规范：没有 trace 字段的日志没法查"
   },
   {
    "t": "p",
    "text": "十万人在线的日志，定位玩家的唯一锚点是「统一标识」：每条日志必须带时间戳、级别、玩家 ID（playerId）、协议号（opcode）、traceId/请求号。logback pattern 统一格式 + MDC 传玩家 ID：登录时 MDC.put(\"playerId\", playerId)，日志自动带上；请求进来时生成 traceId 贯穿整条链路。没有统一字段的日志就像没有时间的监控——玩家投诉「合成卡死」，你连「哪条日志属于他」都不知道。另一个规范：日志按天/按大小滚动（SizeAndTimeBasedRollingPolicy），文件名带日期和序号，否则单个文件无限增长，grep 一次十几分钟。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// logback.xml pattern 统一格式\n<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} [playerId=%X{playerId}] [opcode=%X{opcode}] %msg%n</pattern>\n\n// 滚动策略：按天 + 大小双维度，保留 7 天\n<rollingPolicy class=\"ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy\">\n    <fileNamePattern>/data/game/logs/game.%d{yyyy-MM-dd}.%i.log</fileNamePattern>\n    <maxFileSize>500MB</maxFileSize>\n    <maxHistory>7</maxHistory>\n    <totalSizeCap>10GB</totalSizeCap>\n</rollingPolicy>\n\n// 业务侧：登录时打 MDC\npublic class LoginHandler {\n    public void onLogin(PlayerContext ctx) {\n        MDC.put(\"playerId\", String.valueOf(ctx.getPlayerId()));\n        MDC.put(\"opcode\", \"1001\");\n        // ... 后续日志自动带 playerId=xxx\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">Filebeat + ELK 日志采集链路</text>\n<rect x=\"30\" y=\"48\" width=\"120\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">游戏服日志</text>\n<text x=\"90\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>/data/logs/*.log</text>\n<rect x=\"175\" y=\"48\" width=\"110\" height=\"56\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"230\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Filebeat</text>\n<text x=\"230\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>轻量采集 Agent</text>\n<rect x=\"310\" y=\"48\" width=\"110\" height=\"56\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"365\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\" font-weight=\"bold\">Kafka</text>\n<text x=\"365\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>缓冲削峰</text>\n<rect x=\"445\" y=\"48\" width=\"80\" height=\"56\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"485\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Logstash</text>\n<text x=\"485\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>清洗过滤</text>\n<rect x=\"545\" y=\"48\" width=\"80\" height=\"56\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"585\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">ES</text>\n<text x=\"585\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>存储检索</text>\n<path d=\"M150 76 L175 76\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#lg1)\"/>\n<path d=\"M285 76 L310 76\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#lg1)\"/>\n<path d=\"M420 76 L445 76\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#lg1)\"/>\n<path d=\"M525 76 L545 76\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#lg1)\"/>\n<defs><marker id=\"lg1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"175\" y=\"126\" width=\"450\" height=\"52\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"400\" y=\"148\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">Kibana 可视化检索</text>\n<text x=\"400\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>按 playerId / opcode / 时间窗全文检索，秒级</text>\n<path d=\"M585 104 L585 118 L400 126\" stroke=\"var(--lv1) stroke-width=\"2\" fill=\"none\" marker-end=\"url(#lg1)\"/>\n<rect x=\"30\" y=\"126\" width=\"120\" height=\"52\" rx=\"7\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"90\" y=\"148\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">轻量替代：Promtail</text>\n<text x=\"90\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>+ Loki + Grafana</text>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">小团队可 Filebeat → Kafka → ES 直连（省 Logstash）；Kafka 让日志服具备削峰与多消费</text>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>采集链路挂了不影响业务：Filebeat 本地持久化待重发，游戏服日志照常写盘</text>\n</svg>",
    "caption": "图 27：Filebeat + Kafka + ELK 日志链路"
   },
   {
    "t": "h",
    "text": "Filebeat 采集与 ELK 链路"
   },
   {
    "t": "p",
    "text": "Filebeat 是轻量采集 Agent：监控日志目录的增量，把新行发到 Kafka/ES，本地有持久化队列（采集中断不丢，恢复后重发），占资源极小适合游戏服每台机器挂一个。filebeat.yml 关键：paths 监控哪些文件、fields 打标签（serverId、app 类型）、output.kafka 发到日志服 Kafka。采集链路挂了不影响业务——日志照常写盘，恢复后补齐，这是设计上对业务零侵入。大规模用 Filebeat → Kafka → Logstash/ES；小规模直接 Filebeat → ES + Kibana 或 Promtail → Loki。日志服（你们跑 Kafka 的那台）的角色就是日志总线的枢纽。"
   },
   {
    "t": "code",
    "lang": "yaml",
    "code": "# filebeat.yml 片段\nfilebeat.inputs:\n  - type: log\n    enabled: true\n    paths:\n      - /data/game/logs/*.log\n    fields:\n      app: game\n      serverId: s1\n    fields_under_root: true\n    json.keys_under_root: true\n\noutput.kafka:\n  hosts: [\"log-kafka1:9092\", \"log-kafka2:9092\"]\n  topic: game-log\n  required_acks: 1\n\n# 常用排查\nsystemctl status filebeat\njournalctl -u filebeat -n 50\n# 看注册文件（已读位置）\nls -l /var/lib/filebeat/registry"
   },
   {
    "t": "h",
    "text": "grep 定位线上问题：时间窗 + 玩家 + 异常"
   },
   {
    "t": "p",
    "text": "没接 ELK 时（或 ELK 查不到细节时），grep 三件套仍然是兜底技能。定位公式：「时间窗 × 玩家 × 异常」三维过滤：sed 截时间窗（缩小范围，几个 G 变几十 M）→ grep 玩家 ID（锁定人）→ grep -A 20 异常（拿堆栈）。玩家卡死案例：sed -n '/14:02/,/14:05/p' game.log | grep 'playerId=10086' | grep -A 20 'Exception'。统计类问题用频率公式：grep 关键字 | awk 取列 | sort | uniq -c | sort -rn | head。大文件优化：zgrep 直接搜压缩历史日志、先 head 确认滚动文件名、grep 加 -m 限制匹配数。注意「日志跟丢」：tail -F 用于切割后继续跟踪；logrotate 切割时应用是否重开文件（logback 是重开的，logrotate copytruncate 不重开）要与采集端匹配。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 三维定位：时间窗 x 玩家 x 异常\nsed -n '/2026-08-01 14:02/,/2026-08-01 14:05/p' game.log | grep 'playerId=10086'\nsed -n '/2026-08-01 14:02/,/2026-08-01 14:05/p' game.log | grep -A 20 'Exception'\n\n# 统计：各错误码出现次数\nzgrep 'pay callback error' game.log.2026-08-01.gz | awk '{print $7}' | sort | uniq -c | sort -rn | head\n\n# 慢接口统计：提取耗时列排序取 P99\nawk '/payCost=/{print $NF}' game.log | sort -n | awk '{a[NR]=$1} END{print \"P99=\" a[int(NR*0.99)]}'\n\n# 时间窗内玩家操作流水\nsed -n '/14:02/,/14:05/p' game.log | grep '10086' | tail -100"
   },
   {
    "t": "h",
    "text": "慢接口与异常日志分析"
   },
   {
    "t": "p",
    "text": "慢接口定位两阶段：先在监控/APM 里看 RT 曲线确认异常窗口，再到日志里捞该窗口的接口日志。游戏服慢接口高频根因：数据库慢查询（日志里 SQL 耗时 > 100ms）、Redis 热 key 阻塞（命令耗时暴涨）、下游 HTTP 超时（调用外部服务没设超时）、锁竞争（同 playerId 串行处理队列积压）、Full GC 停顿。异常日志分析：NPE/OOM 先看频率（突然激增 = 发版引入或数据异常），按 traceId 把一条请求的所有日志串起来看先后顺序。复盘产出：慢查询加索引、接口超时加熔断、异常加告警——日志分析的价值在「闭环」，不在「看见」。"
   },
   {
    "t": "h",
    "text": "日志轮转与生命周期"
   },
   {
    "t": "p",
    "text": "日志是磁盘消耗大户，生命周期管理三件事：滚动（logback 按大小+时间滚动，logrotate 兜底外部日志）、保留（maxHistory/rotate 控制份数，totalSizeCap 控总量）、归档（历史日志打包压缩，冷备或进 ELK 后删本地）。游戏服常见问题：GC 日志不滚动（配 -Xloggc 加滚动）、第三方组件日志不轮转、ELK 采集失败导致本地日志积压——用 df -h 与日志目录 du 建立日巡检，日志分区独立挂载防撑爆系统盘。采集成链路后，本地保留期可以缩短（7 天），进一步控制磁盘。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">日志生命周期管理</text>\n<rect x=\"30\" y=\"48\" width=\"140\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"100\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">滚动</text>\n<text x=\"100\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>按大小+时间滚动</text>\n<text x=\"100\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>logback/logrotate</text>\n<rect x=\"190\" y=\"48\" width=\"140\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"260\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">保留</text>\n<text x=\"260\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>maxHistory/rotate</text>\n<text x=\"260\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>totalSizeCap 控总量</text>\n<rect x=\"350\" y=\"48\" width=\"140\" height=\"64\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv1)\" font-weight=\"bold\">归档/采集</text>\n<text x=\"420\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>Filebeat → ELK</text>\n<text x=\"420\" y=\"106\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>采集成功再删本地</text>\n<rect x=\"510\" y=\"48\" width=\"120\" height=\"64\" rx=\"7\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"570\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\" font-weight=\"bold\">回收</text>\n<text x=\"570\" y=\"90\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>压缩冷备/删除</text>\n<path d=\"M170 80 L190 80\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#lg2)\"/>\n<path d=\"M330 80 L350 80\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#lg2)\"/>\n<path d=\"M490 80 L510 80\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#lg2)\"/>\n<defs><marker id=\"lg2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"136\" width=\"580\" height=\"76\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">注意切割与采集的匹配</text>\n<text x=\"320\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>logrotate 切割方式与 Filebeat 要匹配：mv 重建型 vs copytruncate 型，采集端都要能跟上</text>\n<text x=\"320\" y=\"202\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)>日志分区独立挂载 + df -h 日巡检；接 ELK 后本地保留期可缩短到 7 天</text>\n</svg>",
    "caption": "图 28：日志生命周期管理"
   },
   {
    "t": "pits",
    "items": [
     "日志不统一字段：没 playerId/opcode 的日志没法按人查，规范先行是日志体系的灵魂",
     "用昵称搜日志：编码问题搜不到，必须用 playerId/traceId",
     "vim 开 10G 日志：内存暴涨，用 less",
     "日志不滚动：单个文件无限增长，grep 一次十几分钟",
     "采集链路挂断无感知：Filebeat 停了日志积压撑爆磁盘，采集端也要监控",
     "滚动策略与采集端不匹配：logrotate 与 Filebeat 对不上，日志丢了或重复读"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：规范先行（统一 trace 字段 + 滚动策略）；Filebeat→Kafka→ELK 成链路、采集对业务零侵入；grep 三维定位（时间窗×玩家×异常）是兜底技能；慢接口按窗口捞日志找根因；生命周期滚动-保留-归档-回收闭环。下一篇 8 类线上故障 SOP。"
   }
  ]
 },
 {
  "id": "linux-fault-sop",
  "title": "线上故障实战 SOP：八类高频故障",
  "layer": 3,
  "depends": [
   "linux-perf-four",
   "linux-net-troubleshoot",
   "linux-disk-storage",
   "linux-log-analysis"
  ],
  "covers": [
   "linux-16",
   "linux-18",
   "linux-09",
   "linux-12"
  ],
  "quiz": [
   "linux-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "故障处理的胜负手不是命令，是「先止损再查案、保留现场、时间对齐变更点」的负责人思维。CPU 100%、内存不足、磁盘满、连接数满、端口被占、进程假死——八类高频故障各有标准动作，组合成一套可复用的 SOP。"
   },
   {
    "t": "pre",
    "items": [
     "掌握性能四件套与网络排查",
     "会 grep 日志定位",
     "理解 systemd 守护与发布回滚"
    ]
   },
   {
    "t": "h",
    "text": "总纲：先救命，再查案"
   },
   {
    "t": "p",
    "text": "任何故障的第一步是止损：确认影响面（全服/单服/部分玩家），能回滚先回滚、能重启先重启；动手前保留现场快照（top、jstack、jmap dump、ss、日志截取）——重启即销毁异常现场，事后只剩「变卡了」三个字无法复盘。第二步才是按「由面到点、由快到慢」的五层漏斗排查：负载定性 → CPU → 内存 → 磁盘 IO → 网络，每层 30 秒定性再深入。收尾三条方法论：先问「本机还是下游」（游戏服卡常是 MySQL 慢查询的表象）；对比法（同集群正常机器差异即线索）；时间对齐（异常开始时间对齐发布/活动/告警，80% 根因在变更点）。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"26\" text-anchor=\"middle\" font-size=\"15\" fill=\"var(--ink)\" font-weight=\"bold\">五层漏斗排查 + 止损优先</text>\n<rect x=\"220\" y=\"46\" width=\"200\" height=\"40\" rx=\"7\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--lv3)\" font-weight=\"bold\">第 0 步：确认影响面 + 止损 + 留现场</text>\n<rect x=\"220\" y=\"94\" width=\"200\" height=\"34\" rx=\"7\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"116\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\" font-weight=\"bold\">① 负载定性 load/核数</text>\n<rect x=\"190\" y=\"136\" width=\"260\" height=\"34\" rx=\"7\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\" font-weight=\"bold\">② CPU → ③ 内存 → ④ 磁盘 IO → ⑤ 网络</text>\n<path d=\"M320 86 L320 94\" stroke=\"var(--lv3) stroke-width=\"2\" marker-end=\"url(#sop1)\"/>\n<path d=\"M320 128 L320 136\" stroke=\"var(--ink) stroke-width=\"2\" marker-end=\"url(#sop1)\"/>\n<defs><marker id=\"sop1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"30\" y=\"188\" width=\"580\" height=\"56\" rx=\"8\" fill=\"var(--panel) stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"210\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\" font-weight=\"bold\">收尾方法论</text>\n<text x=\"320\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">本机还是下游；对比正常机器；时间对齐发布/活动/告警；复盘补齐监控盲区与预案</text>\n</svg>",
    "caption": "图 29：五层漏斗排查总纲"
   },
   {
    "t": "h",
    "text": "① CPU 100%：三连定位"
   },
   {
    "t": "p",
    "text": "top 定进程（记 PID）→ top -H -p PID 定线程（记 TID）→ printf '%x\\n' TID 转十六进制 → jstack PID | grep -A 30 'nid=0x...' 定位 Java 代码行。游戏服四种典型结论：死循环（策划配置导致寻路/合成逻辑出不了循环）、正则灾难性回溯、大集合 O(n²) 遍历（全服广播嵌套循环）、Full GC 风暴（热点线程是 GC task thread）。工程化：连抓 3 次 jstack 间隔 5 秒对比，同一线程始终在同一 frame 才是真热点；arthas profiler 出火焰图更直观。预防：禁止无界 while(true)、循环加最大迭代保护。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "top -bn1 | head -20                        # 记 PID\ntop -H -p 12345 -bn1 | head -20           # 记最忙线程 TID\nprintf '%x\\n' 23456                        # TID -> nid 十六进制\njstack 12345 | grep -A 30 'nid=0x5ba0'     # 定位代码行\n\n# GC 视角\njstat -gcutil 12345 1s\n# 连抓 3 次确认\nfor i in 1 2 3; do jstack 12345 > /tmp/js$i.txt; sleep 5; done\ndiff /tmp/js1.txt /tmp/js3.txt"
   },
   {
    "t": "h",
    "text": "② 内存不足：available、swap 与 OOM"
   },
   {
    "t": "p",
    "text": "free -h 看 available 与 swap；dmesg -T | grep -i 'killed process' 查 OOM Killer 记录；Java 进程 RSS 超 -Xmx 是正常的（线程栈/直接内存/代码缓存），超出太多用 NMT（-XX:NativeMemoryTracking=summary + jcmd PID VM.native_memory）查堆外。游戏服铁律：物理机部署留足堆外余量（Xmx 配 16G 机器 32G），容器配 MaxRAMPercentage 与 limits 对齐；swappiness 调低（1~10）宁可 OOM 报错不要慢慢卡死；OOM 后 jmap -dump 保现场再重启。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "free -h\ndmesg -T | grep -i 'killed process'       # OOM Killer 记录\ncat /proc/PID/status | grep -E 'VmRSS|Threads'\n\n# NMT 查堆外（启动加 -XX:NativeMemoryTracking=summary）\njcmd 12345 VM.native_memory summary\n\n# 现场保留\njmap -dump:format=b,file=/tmp/heap.hprof 12345"
   },
   {
    "t": "h",
    "text": "③ 磁盘满 / ④ 连接数满 / ⑤ 端口被占"
   },
   {
    "t": "p",
    "text": "磁盘满：df -h 定位分区 → du -sh /* 逐层下钻 → lsof | grep deleted 查句柄坑 → logrotate 兜底，应急先 > file 清空不删文件；同时看 df -i 防 inode 耗尽。连接数满：ss -s 看整体、ss -ant | awk '{print $1}' | sort | uniq -c 看状态分布，CLOSE_WAIT 堆积是代码 bug（Netty channelInactive 没处理），fd 满看 /proc/PID/limits 与 ulimit -n；开服洪峰看 somaxconn。端口被占：ss -lntp 找 PID → ps -fp 确认身份 → kill 还是换端口——先 SIGTERM 优雅停机，超时才 -9；部署脚本「kill 后 sleep + 确认端口释放 + 未释放再 -9」。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 磁盘满\nlsof | grep deleted\ndf -i /data\ndu -h --max-depth=1 /data | sort -hr | head\n\n# 连接数满\nss -s\nss -ant | awk '{print $1}' | sort | uniq -c\nss -tan state close-wait | wc -l\ncat /proc/PID/limits | grep 'open files'\n\n# 端口被占\nss -lntp | grep :8080\nps -fp PID\nkill PID; sleep 10; ss -lntp | grep :8080 || echo released"
   },
   {
    "t": "h",
    "text": "⑥ 进程假死 / ⑦ load 高 CPU 低 / ⑧ 慢请求"
   },
   {
    "t": "p",
    "text": "进程假死：端口通、进程在、请求全超时。排查 jstack 看大量 BLOCKED/WAITING 线程（锁竞争/死锁）、线程池队列积压、Full GC 停顿；liveness 探针/守护脚本要有「假死检测」而不是只探端口。load 高 CPU 低：D 状态进程堆积（ps -eo state,pid,comm | grep '^D'）+ iostat 定位磁盘；swap 风暴（si/so 非 0）；NFS/云盘配额。慢请求：先系统命令定性「本机还是下游」，再日志按 traceId 串链路，慢查询/热 key/下游超时按窗口定位。系统指标全绿但玩家卡 → 下潜应用内部：锁、线程池、RT 毛刺。"
   },
   {
    "t": "table",
    "head": [
     "故障",
     "10 秒定性",
     "关键命令",
     "根因方向"
    ],
    "rows": [
     [
      "CPU 100%",
      "top us 高",
      "top -H + jstack",
      "死循环/GC/正则回溯"
     ],
     [
      "内存不足",
      "available 低/swap",
      "free -h + dmesg OOM",
      "堆外泄漏/FGC"
     ],
     [
      "磁盘满",
      "df 95%+",
      "df/du + lsof deleted",
      "日志/Kafka segment"
     ],
     [
      "连接数满",
      "ss 状态堆积",
      "ss -s + fd limits",
      "CLOSE_WAIT bug/洪峰"
     ],
     [
      "端口被占",
      "Address in use",
      "ss -lntp + ps",
      "残留进程/端口冲突"
     ],
     [
      "进程假死",
      "端口通请求超时",
      "jstack 看 BLOCKED",
      "锁/线程池积压"
     ],
     [
      "load 高 CPU 低",
      "wa/b 高",
      "ps D 状态 + iostat",
      "磁盘 IO 瓶颈"
     ],
     [
      "慢请求",
      "RT 曲线飙升",
      "日志 traceId 串联",
      "慢 SQL/热 key/下游"
     ]
    ]
   },
   {
    "t": "h",
    "text": "系统层暗坑：时钟回拨 / conntrack / DNS"
   },
   {
    "t": "p",
    "text": "应用层、JVM 层查干净时，要敢下潜系统层。时钟回拨：NTP/虚拟机漂移导致时间倒退，游戏服连锁反应是定时任务重复触发（奖励重复发放）、雪花 ID 重复（主键冲突炸库）；预防 NTP 用 slew 模式（ntpd -x/chrony makestep），时间判断用单调时钟。conntrack 表满：内核连接跟踪表打满，现象是「老连接正常、新连接全失败」，日志报 nf_conntrack: table full；查 cat /proc/sys/net/netfilter/nf_conntrack_count 对比 max，调大 max/hashsize 或网关用 NOTRACK 旁路。DNS 解析卡顿：glibc resolver 同步阻塞，DNS 抖动时线程全卡，表现是无规律卡顿 CPU 正常——内网 DNS 高可用 + 应用配 IP/缓存策略。"
   },
   {
    "t": "code",
    "lang": "bash",
    "code": "# 时钟回拨排查\nntpq -p                      # NTP 同步状态\n# 日志里看时间戳跳跃/dmesg\n\n# conntrack 表\ncat /proc/sys/net/netfilter/nf_conntrack_count\ncat /proc/sys/net/netfilter/nf_conntrack_max\ndmesg | grep nf_conntrack\n\n# DNS 排查\ncat /etc/resolv.conf\ncat /proc/sys/net/ipv4/tcp_syn_retries"
   },
   {
    "t": "pits",
    "items": [
     "不保留现场直接重启：jstack/dump 重启即销毁，事后只剩「变卡了」三个字",
     "零散堆命令没优先级：必须有「止损 → 五层漏斗 → 时间对齐变更点」的结构",
     "load 高就加机器：没先判断是 CPU 还是 IO 瓶颈，加机器解决不了锁竞争和 IO",
     "把 TIME_WAIT 当洪水猛兽：正常状态量的问题，CLOSE_WAIT 才是代码 bug",
     "jstack 只抓一次就下结论：偶发线程误判，连抓 3 次对比才准",
     "故障复盘不产出：监控盲区补齐 + 预案更新 + 阈值调整，闭环才是复盘的价值"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：故障 SOP = 先止损留现场 → 五层漏斗（负载/CPU/内存/IO/网络）→ 系统层暗坑（时钟/conntrack/DNS）；八类高频故障各有 10 秒定性命令；时间对齐变更点找根因；复盘产出监控与预案闭环。这套方法论配合全分类教程，从命令到体系全覆盖。"
   }
  ]
 }
]
};
