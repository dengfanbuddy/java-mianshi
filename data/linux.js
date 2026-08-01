window.QB = window.QB || {};
window.QB["linux"] = {
  id: "linux",
  name: "Linux 与线上部署运维",
  icon: "🐧",
  desc: "候选人邓凡负责游戏服线上部署维护，Linux 是必考大类：常用命令、负载/CPU/内存/IO/网络五维排查、Shell 与定时任务、服务守护、Docker 部署与容器排查、发布回滚预案，全部结合游戏服线上实战作答。",
  questions: [
    {
      id: "linux-01",
      level: 1,
      q: "线上游戏服要快速看一眼健康状况，top、free、vmstat 分别看什么？load average 三个数字代表什么？",
      a: "核心结论：top 看「谁在吃资源」，free 看「内存还剩多少」，vmstat 看「系统整体在忙什么」，三个命令 30 秒内建立现场第一印象。\n1. top：第一行 load average 是 1/5/15 分钟的平均负载（处于运行或不可中断状态的进程数），经验值是不超过 CPU 核数；再看 %Cpu(s) 的 us（用户态）、sy（内核态）、wa（IO 等待）、id（空闲）；按 P 按 CPU 排序、按 M 按内存排序，找到最耗资源的 PID。\n2. free -h：重点看 available 列（真正可用内存），而不是 free 列——Linux 会把空闲内存拿去做 buffer/cache，free 很小不等于内存不足。\n3. vmstat 1：看 r（运行队列，持续大于核数说明 CPU 不够）、b（阻塞在 IO 的进程数）、si/so（swap 交换，非 0 要警惕）、cs（上下文切换）、us/sy/wa 列。\n4. 游戏服经验：开服高峰期玩家反馈卡，我第一反应就是 top 看 load 和 wa——wa 高说明瓶颈在磁盘（可能是落地刷盘或日志写入），us 高说明业务逻辑/GC 在烧 CPU，两条路排查方向完全不同。",
      point: "考察能否用三个命令在 30 秒内建立线上第一印象并把瓶颈定性，而非背参数。",
      approach: "先给三命令分工的一句话结论 → 逐个说看哪个指标（top 的 load/us/sy/wa、free 的 available、vmstat 的 r/b/si/so）→ 结合开服卡顿案例讲 wa 高与 us 高两种截然不同的排查方向 → 主动补 load 经验值不超过核数。坑：别把 free 列当可用内存，这是考官埋的点。",
      followups: [
        {
          q: "load 很高但 CPU 使用率不高，说明什么？",
          a: "说明大量进程处于 D 状态（不可中断睡眠）在等 IO，而不是在算。看 top 的 wa 列和 vmstat 的 b 列确认，再用 ps -eo state,pid,comm | grep '^D' 找出卡住的进程，iostat 定位磁盘热点。"
        },
        {
          q: "top 里的 RES 和 java 进程 -Xmx 对不上，内存去哪了？",
          a: "RSS = 堆 + 元空间 + 线程栈（每线程约 1M）+ 直接内存（Netty 堆外）+ JIT 代码缓存 + GC 开销，RSS 超 Xmx 2~3G 属正常，超出过多开 NMT（Native Memory Tracking）排查堆外部分。"
        },
        {
          q: "为什么看内存要用 available 而不是 free？",
          a: "Linux 把空闲内存拿去当 buffer/cache，free 列把这些算成「已用」，看起来很小；available 才是扣掉可回收缓存后真正能分配给程序的内存，看 free 会误判内存不足。"
        }
      ],
      memory: "top 是「点名册」（谁吃得最多），free 是「粮仓余量」（看 available 别看 free），vmstat 是「心电监护仪」（r/b/swap 三条曲线）。load 超过核数 = 排队买单的人比收银台多。",
      tags: ["Linux基础", "top", "load", "排查入门"]
    },
    {
      id: "linux-02",
      level: 1,
      q: "日志服磁盘报警「使用率 95%」，你的排查和处理流程是什么？df 和 du 结果对不上是怎么回事？",
      a: "核心结论：先用 df 定位哪个分区满，再用 du 逐层找到大目录，处理时优先「删 + 防复发」，而不是无脑扩容。\n1. 定位分区：df -h 看各分区使用率，确认是日志分区还是根分区满。\n2. 定位目录：du -sh /* 逐层下钻（或 du -h --max-depth=1 | sort -hr | head），游戏服常见罪魁是游戏服业务日志、GC 日志、Kafka 的 segment 文件、MySQL binlog。\n3. df 和 du 对不上的经典原因：文件被删除但仍被进程持有句柄（deleted 状态），空间没释放——用 lsof | grep deleted 找出来，重启进程或 kill 才能释放。这就是为什么生产上删日志不能直接 rm，要用 > file 清空或先停写。\n4. 处理与预防：游戏服日志必须接 logback 的 SizeAndTimeBasedRollingPolicy 或外部 logrotate 做切割+保留天数；Kafka 配 log.retention.hours；binlog 配 expire_logs_days；再加磁盘使用率监控告警（80% 预警，90% 电话告警）。\n5. 应急：实在删不动时，可以把旧日志打包 scp 到冷备机再删，切勿直接 rm 正在写入的日志文件。",
      point: "考察磁盘满的完整处置链路，尤其是「已删文件仍占空间」这个句柄坑是否真踩过。",
      approach: "按「df 定分区 → du 逐层下钻 → 处理 + 防复发」的流程线讲；讲到 du 时主动抛出 df/du 不一致的经典原因（lsof | grep deleted）；收尾用 logrotate、retention 参数和分级告警体现预防意识。坑：千万别说直接 rm 正在写入的日志，正确姿势是 > file 清空或先停写。",
      followups: [
        {
          q: "为什么 rm 了一个 10G 日志文件，df 显示空间没变化？",
          a: "文件仍被进程持有句柄（deleted 状态），空间不释放。用 lsof | grep deleted 找出持有进程，重启或 kill 后空间才回来；生产删日志要用 > file 清空或先停写再删。"
        },
        {
          q: "logrotate 是怎么做到不中断进程就切割日志的？copytruncate 有什么坑？",
          a: "默认是 mv 旧文件 + 发信号让进程重新打开新文件；copytruncate 是先复制再原地清空，复制窗口内写入的日志会丢，且瞬间占双倍磁盘空间，大日志文件慎用。"
        },
        {
          q: "du -sh 很慢怎么加速定位大文件？",
          a: "用 du -h --max-depth=1 | sort -hr | head 逐层下钻而非全量递归；或直接 find / -size +1G 找超大文件；也可先查已知大户：日志目录、Kafka segment、binlog 目录。"
        }
      ],
      memory: "df 看「房间还剩多大」，du 看「哪个家具占地方」；删了文件空间不释放 = 垃圾袋扎了口但还有人攥着袋口（句柄），得让他松手（重启进程）才算扔出去。",
      tags: ["磁盘", "df", "du", "游戏实战", "日志"]
    },
    {
      id: "linux-03",
      level: 1,
      q: "线上要统计游戏服日志里「今天充值回调报错的次数和涉及的订单号」，grep / awk / sed 你会怎么用？",
      a: "核心结论：grep 负责「筛行」，awk 负责「切列做统计」，sed 负责「替换清洗」，三个管道串起来就是线上日志分析的瑞士军刀。\n1. grep 筛行：grep 'pay callback error' game.log 找关键字；-c 直接计数；-A 5/-B 5 看上下文（排查 NPE 堆栈必用）；-v 反向过滤；grep -E 支持正则；zgrep 直接搜压缩的历史日志。\n2. awk 统计：awk 默认按空白切分列，$1、$2 取列。例：grep 'pay callback' game.log | awk '{print $5}' | sort | uniq -c | sort -rn | head 统计各错误码出现次数；awk '/payError/{cnt[$7]++} END{for(k in cnt) print k, cnt[k]}' 按订单号聚合。sort | uniq -c | sort -rn 是「频率排行榜」万能组合拳。\n3. sed 清洗：sed -n '10:00:00,11:00:00/p' game.log 按时间段截取日志（定位故障窗口神器）；sed 's/xxx/yyy/g' 做替换。\n4. 游戏服实战案例：玩家投诉充值未到账，我用 sed -n 截取支付回调时间段的日志，grep 订单号拿到完整回调报文，确认是渠道签名验证失败还是我们发货逻辑异常——整个过程不用把几个 G 的日志拉回本地。",
      point: "考察文本三剑客能否组合成「线上 SQL」，不把大日志拉本地就完成统计定位。",
      approach: "先一句话分工（grep 筛行/awk 切列统计/sed 清洗）→ 每个工具给 1-2 个真用例：grep -A 看堆栈、sort|uniq -c 频率排行榜、sed 按时间窗截取 → 落到充值未到账的完整实战案例收束。坑：只背参数不给组合命令是低分答案，一定要演示管道串联。",
      followups: [
        {
          q: "日志文件 20G，grep 一次要几分钟，怎么优化定位效率？",
          a: "先用 sed 按时间窗截取缩小范围再 grep；历史日志用 zgrep 免解压；日常按天/按服切分日志文件；长期方案是接 ELK/Loki，别拿 grep 硬扛超大日志。"
        },
        {
          q: "awk 里怎么做类似 SQL 的 group by + having？",
          a: "用数组聚合：awk '/error/{cnt[$7]++} END{for(k in cnt) if(cnt[k]>100) print k,cnt[k]}'，cnt[$7]++ 就是 group by，END 块里的 if 过滤就是 having。"
        },
        {
          q: "怎么统计日志里某个接口的 P99 耗时？",
          a: "awk 提取耗时列 | sort -n | awk '{a[NR]=$1} END{print a[int(NR*0.99)]}'，排序后取 99% 位置的值即可；更专业的做法是接 metrics/APM 直接算分位数。"
        }
      ],
      memory: "grep 是「保安查证件」（放行匹配的行），awk 是「会计」（按列记账做汇总），sed 是「剪辑师」（按时间段剪片子）。三件套 = 线上日志的 SQL。",
      tags: ["grep", "awk", "sed", "日志分析", "游戏实战"]
    },
    {
      id: "linux-04",
      level: 1,
      q: "部署购买服时启动报错「Address already in use」，怎么查端口被谁占了并处理？ps / ss / lsof 各自怎么用？",
      a: "核心结论：端口冲突先用 ss 或 lsof 找到占用者 PID，再用 ps 确认它是什么进程，最后决定 kill 还是换端口。\n1. 查端口占用：ss -lntp | grep 8080（-l 监听、-n 数字端口、-t TCP、-p 显示进程），或 lsof -i:8080，老系统用 netstat -lntp。\n2. 确认进程身份：ps -ef | grep PID 或 ps -fp PID，看完整的启动命令——游戏服机器上经常一台机器跑多个服（游戏服/日志服/GM 后台），别杀错。\n3. 处理：确认是上次部署没杀干净的残留进程（kill PID，杀不掉再 kill -9），就杀掉重启；如果是别的服务在用，就改自己服务的端口配置。\n4. 常见根因：JVM 服务 shutdown 钩子卡住、kill 后线程没退完（守护线程阻塞），或者 SpringBoot 优雅停机超时。所以部署脚本里要「kill 后 sleep + 检查端口确认释放 + 没释放再 kill -9」。\n5. kill -9 的代价：不执行 shutdown 钩子，游戏服直接 kill -9 会丢内存里未落地的玩家数据——游戏服必须是 kill（SIGTERM）触发优雅停机（踢人、刷盘、关连接），超时后才允许 -9。",
      point: "考察端口冲突的标准处置流程，以及对 kill 信号语义和游戏服优雅停机的理解。",
      approach: "先给三步流程：ss/lsof 找 PID → ps 确认身份 → kill 或换端口；强调一台机器跑多个服别杀错；主动展开 kill vs kill -9 与未落地玩家数据的关系，这是加分点。坑：上来就说 kill -9 是减分项，正确顺序是先 SIGTERM 优雅停机、超时后才 -9。",
      followups: [
        {
          q: "kill 和 kill -9 的区别？JVM 收到 SIGTERM 会做什么？",
          a: "kill 发 SIGTERM，JVM 触发 shutdown 钩子执行优雅停机（踢人、刷盘、关连接）；kill -9 是 SIGKILL，内核直接终止，钩子不执行，未落地数据丢失，只能作超时后的最后手段。"
        },
        {
          q: "ss 和 netstat 有什么区别？为什么新机器推荐 ss？",
          a: "ss 直接从内核 netlink 接口读数据，netstat 要遍历 /proc/net/tcp；连接数几万时 netstat 卡数秒而 ss 毫秒返回，且过滤能力更强，新系统 netstat 常未预装。"
        },
        {
          q: "怎么查一个 Java 进程到底开了哪些网络连接？",
          a: "ss -antp | grep PID 看该进程全部 TCP 连接及状态，lsof -p PID -i 更直观；再用 awk 统计状态分布，若 CLOSE_WAIT 堆积说明连接关闭处理有 bug。"
        }
      ],
      memory: "端口冲突像「车位被占」：ss/lsof 查车牌（PID），ps 查车主（是什么进程），联系车主挪车（kill），叫拖车（kill -9）是最后手段——拖游戏服的车会把车上乘客（未落地数据）一起拖走。",
      tags: ["端口", "进程", "ss", "lsof", "部署"]
    },
    {
      id: "linux-05",
      level: 1,
      q: "玩家 14:03 反馈「合成道具时卡死」，你怎么在游戏服日志里快速定位这个时间点前后的异常？tail / less / find 怎么用？",
      a: "核心结论：按「时间窗 + 玩家标识 + 异常关键字」三维过滤，先 tail/head 看首尾确认日志滚动情况，再 sed 截时间窗，最后 grep 玩家 ID 和 Exception。\n1. 实时观察：tail -f game.log 边复现边看；tail -n 5000 看最近五千行；head 看文件开头确认启动时间。\n2. 大文件翻查：less game.log 比 vim/cat 安全（不全量读入内存），进 less 后 /Exception 向下搜、?Exception 向上搜、G 到文件尾。\n3. 时间窗截取：sed -n '/2024-06-01 14:02/,/2024-06-01 14:05/p' game.log 精确剪出故障窗口。\n4. 组合定位：sed 截窗后 | grep 'playerId=10086' 锁定该玩家操作流水，再 | grep -A 20 'Exception' 拿完整堆栈。\n5. 找文件：find /data/logs -name '*.log' -mtime -1 找最近一天的日志；find . -size +1G 找超大文件；zgrep 直接搜 .gz 历史归档日志，不用解压。\n6. 游戏服经验：一定要按玩家 ID 而不是昵称搜（昵称有编码问题），并且日志框架必须打 MDC/统一 trace 字段（玩家 ID、协议号），否则十万人同时在线的日志根本没法捞针。",
      point: "考察大日志中按「时间窗+玩家标识」三维定位的实战手法和日志规范意识。",
      approach: "用「调监控录像」的叙事展开：sed 截时间窗 → grep 玩家 ID 锁人 → grep -A 20 看堆栈细节；tail/less/find 各点一个关键用法；收尾主动讲 MDC/trace 字段规范，体现日志体系设计意识。坑：用昵称搜日志（编码问题）、用 vim 打开 10G 文件（内存暴涨）都是反例，要主动避开。",
      followups: [
        {
          q: "less 和 vim 打开 10G 日志文件，内存表现有什么不同？为什么？",
          a: "less 按需读入（只加载当前屏幕内容），10G 文件秒开；vim 默认全量读入并建 swap，内存暴涨甚至把机器拖垮。大文件排查永远用 less，别用 vim/cat。"
        },
        {
          q: "怎么在日志里统计 14:00~15:00 每个协议号的调用次数？",
          a: "sed -n 截时间窗 | grep 协议字段 | awk '{cnt[$N]++} END{for(k in cnt) print k,cnt[k]}' | sort -rn；前提是日志统一打了协议号字段，这正是日志规范的意义。"
        },
        {
          q: "tail -f 和 tail -F 的区别？日志切割后哪个还能继续跟踪？",
          a: "-f 按文件描述符跟踪，日志被 mv 切割后还盯着旧句柄收不到新内容；-F 会检测文件被重建并重新打开，配合 logrotate 切割场景必须用 tail -F。"
        }
      ],
      memory: "定位日志 = 查监控录像：先按时间调录像（sed 时间窗），再锁定嫌疑人（grep 玩家 ID），最后放慢动作看细节（grep -A 20 堆栈）。没有统一 trace 字段的日志就像没有时间的监控——没法查。",
      tags: ["日志定位", "tail", "less", "find", "游戏实战"]
    },
    {
      id: "linux-06",
      level: 1,
      q: "你会写 Shell 脚本吗？写一个游戏服部署/日志清理脚本会涉及哪些核心语法？crontab 怎么配？",
      a: "核心结论：游戏服运维 Shell 脚本三板斧 = 变量与命令替换、流程控制、退出码检查；crontab 负责定时化，但要注意环境变量差异这个大坑。\n1. 核心语法：变量 name=value（等号无空格）；命令替换 pid=$(ss -lntp | grep 8080 | awk '{print $6}')；条件 if [ -z \"$pid\" ]; then ... fi；循环 for f in *.log; do ... done；$? 取上条命令退出码，非 0 即失败要 set -e 或显式判断。\n2. 部署脚本骨架：拉包 → 备份旧版本 → kill 旧进程（先 SIGTERM 等优雅停机，超时 -9）→ 校验端口释放 → nohup java -jar ... & → sleep 后 curl 健康检查端口 → 失败则告警。每一步都检查 $?，任何一步失败立即退出并通知，绝不带病上线。\n3. crontab：crontab -e 编辑，格式「分 时 日 月 周 命令」，如 0 4 * * * /data/script/clean_log.sh 每天 4 点清理日志；crontab -l 查看。\n4. crontab 经典坑：cron 环境变量极简（PATH 只有 /usr/bin:/bin），脚本里要用绝对路径或开头 source /etc/profile，否则手动跑没问题、cron 跑就「command not found」。\n5. 游戏服实战：日志切割清理、每天凌晨低峰期的数据备份、定时拉起守护检查脚本都是 cron + shell 完成的；脚本输出要重定向到自己的日志文件（>> /data/script/clean.log 2>&1），否则出问题无从查起。",
      point: "考察 Shell 工程素养：脚本健壮性（每步查退出码）与 cron 环境变量坑，而非语法背诵。",
      approach: "先给「部署脚本=发射检查单」的框架 → 核心语法点到为止（变量/命令替换/$?）→ 部署脚本骨架分步讲，突出每步检查 $? 失败即退 → cron 配置格式 + 环境变量坑（手动能跑 cron 报错）→ 输出重定向收尾。坑：不查退出码、脚本输出不重定向留日志，都暴露没在生产写过脚本。",
      followups: [
        {
          q: "Shell 里 $0、$1、$#、$? 分别是什么？",
          a: "$0 脚本名、$1 第一个参数、$# 参数个数、$? 上条命令退出码（0 为成功）。部署脚本里 $? 和 set -e 就是每一步成败的保险丝。"
        },
        {
          q: "crontab 最小粒度是分钟，要 30 秒跑一次怎么办？",
          a: "三种土办法：脚本内跑两次中间 sleep 30；写 while true + sleep 30 的常驻脚本用 systemd 托管；或上 systemd timer 支持秒级。注意防重叠执行，脚本加 flock 锁。"
        },
        {
          q: "set -e、set -x 分别有什么用？",
          a: "set -e 任何命令失败立即退出，防带病执行；set -x 打印每条执行的命令，调试用。生产脚本常写 set -euo pipefail，但注意 -e 与管道、条件判断交互的坑。"
        }
      ],
      memory: "Shell 部署脚本 = 发射火箭检查单：每一步签字确认（$? 检查），任何一项不通过就终止发射（set -e）。cron 是闹钟，但闹钟在另一个房间（环境变量不同），命令得写全地址。",
      tags: ["Shell", "crontab", "部署脚本", "游戏实战"]
    },
    {
      id: "linux-07",
      level: 1,
      q: "chmod 755 和 644 分别是什么意思？部署时常见的权限问题有哪些？为什么生产环境不建议用 root 跑游戏服？",
      a: "核心结论：权限三位数字 = 所有者/所属组/其他人的 rwx 累加值（r=4、w=2、x=1），755 是可执行文件标配，644 是普通文件标配。\n1. 数字含义：7=rwx、5=r-x、6=rw-、4=r--。755 = 所有者可读写执行，其他人只读+执行（部署的 jar、脚本用它）；644 = 所有者可读写，其他人只读（配置文件、日志用它）。\n2. 常见权限坑：脚本上传后忘了 chmod +x 报 Permission denied；scp 从 Windows 传脚本带 CRLF 换行符报 bad interpreter（要 dos2unix 或 sed 处理）；部署账号对日志目录无写权限，logback 启动即失败。\n3. chown -R appuser:appgroup /data/game 把整个服务目录归属专用账号。\n4. 为什么不用 root 跑游戏服：Java 服务有漏洞被拿到 RCE 时，root 权限 = 整台机器沦陷，攻击者可以改配置、种木马、删数据；专用账号即使被攻破，破坏面也只限该账号能写的目录。这是安全基线，面试说出来体现生产意识。\n5. 配套习惯：sudo 授权精确到命令而不是 ALL；数据库密码、Redis 密码放配置文件并 chmod 600，只 owner 可读。",
      point: "考察权限数字之外的安全意识：最小权限原则与 root 跑服务的真实风险。",
      approach: "先给 r=4/w=2/x=1 的换算规则，755/644 对号入座 → 列三个部署权限坑（忘 +x、CRLF、目录写权限）→ 重点展开为何不用 root：被 RCE 后破坏面的差异 → sudo 精确授权、密码文件 600 收尾。坑：只背数字含义不答安全问题是偏题，第三问才是分量所在。",
      followups: [
        {
          q: "rwx 对目录和文件的含义有什么不同？",
          a: "对文件：r 读内容、w 改内容、x 执行；对目录：r 列文件名（ls）、w 增删文件、x 进入目录（cd）。目录有 w 无 x 仍无法操作文件，目录的 x 是访问门槛。"
        },
        {
          q: "为什么日志文件经常要用 umask 控制默认权限？",
          a: "umask 决定新建文件默认权限（如 022 → 文件 644、目录 755），避免日志被创建成 777 带来篡改风险，也避免 600 导致日志采集 Agent 读不到，部署脚本里应显式设置。"
        },
        {
          q: "scp 上传脚本后报 /bin/bash^M: bad interpreter 怎么解决？",
          a: "Windows 的 CRLF 换行符导致。用 dos2unix 或 sed -i 's/\\r$//' 转换；一劳永逸是 git 配 core.autocrlf、编辑器存为 LF，scp 用二进制模式传输。"
        }
      ],
      memory: "755 是「带钥匙的营业员」（自己能开能改能跑，顾客只能看和用），644 是「公告栏」（自己贴别人看）。root 跑服务 = 把全楼总钥匙挂在大门上，被抢就全完。",
      tags: ["权限", "chmod", "安全", "部署"]
    },
    {
      id: "linux-08",
      level: 2,
      q: "load average 飙到 32（机器 8 核），但 top 显示 CPU 使用率只有 20%，这是什么情况？游戏服遇到这种「load 高 CPU 低」怎么排查？",
      a: "核心结论：load 统计的是「运行中 + 不可中断睡眠（D 状态）」的进程数，load 高而 CPU 低，说明大量进程卡在不可中断等待——头号嫌疑是磁盘 IO，其次是网络/NFS。\n1. 确认方向：top 里看 wa（iowait）列，如果 wa 高，基本锁定 IO 瓶颈；vmstat 1 看 b 列（阻塞进程数）是否持续非 0。\n2. 找 D 状态进程：ps -eo state,pid,comm | grep '^D'，直接列出所有卡在不可中断睡眠的进程，看是不是 Java 进程或 Kafka。\n3. 定位 IO 热点：iostat -x 1 看 %util（接近 100% = 磁盘打满）和 await（IO 响应延迟）；iotop -oP 找到具体是哪个进程在狂读写。\n4. 游戏服典型场景：玩家数据定时落地（每 5 分钟全量刷盘）撞上日志高峰，磁盘被刷穿，业务线程全部卡在 write 系统调用上——表现就是 load 爆炸但 CPU 空闲。解法：落地改异步批量+错峰、日志和业务数据分盘、Kafka 日志服单独用磁盘阵列。\n5. 其他可能：swap 频繁换入换出（si/so 非 0）、网络文件系统（NFS）挂起、云盘性能到上限（IOPS/吞吐配额打满，云监控里看）。",
      point: "考察对 load 统计口径（含 D 状态进程）的理解，能否从「load 高 CPU 低」反推 IO 瓶颈。",
      approach: "先给结论：load=运行中+D 状态，CPU 低说明卡在等 IO → 按「wa 列定性 → ps 找 D 状态进程 → iostat/iotop 定位凶手」三步展开 → 结合游戏服落地刷盘撞日志高峰的实战场景给解法 → 补 swap/NFS/云盘配额其他可能。坑：把 load 高直接当 CPU 不够，暴露不懂 load 统计口径。",
      followups: [
        {
          q: "D 状态（不可中断睡眠）和 S 状态有什么区别？为什么 D 状态 kill 不掉？",
          a: "S 是可中断睡眠，等事件可被信号唤醒也能 kill；D 是不可中断睡眠，等内核 IO 返回，信号排不进去，kill -9 也没用，只能等 IO 完成或重启——D 状态堆积通常意味着存储/驱动层出了问题。"
        },
        {
          q: "iostat 里 %util 100% 一定代表磁盘是瓶颈吗？",
          a: "不一定。%util 只反映设备「有事做」的时间占比，SSD/RAID 可并行处理多个 IO，util 100% 但 await 很低时磁盘仍游刃有余，要结合 await 和 avgqu-sz 综合判断。"
        },
        {
          q: "容器/云主机环境下怎么确认是宿主机磁盘被打满了？",
          a: "容器里 iostat 看到的是块设备整体（含其他容器），要配合 cgroup 的 blkio 统计看自己容器的 IO 量；云主机直接看云监控的磁盘 IOPS/吞吐配额是否打满——iostat 不满但配额满也会毛刺。"
        }
      ],
      memory: "load 是「排队总人数」，CPU 是「正在收银的人」。load 高 CPU 低 = 队伍很长但收银员闲着——顾客全卡在等上货（D 状态等磁盘）。查谁卡着：ps 找 D，查上货速度：iostat。",
      tags: ["load", "IO等待", "iostat", "游戏实战", "排查"]
    },
    {
      id: "linux-09",
      level: 2,
      q: "游戏服进程 CPU 跑到 400%（4 核打满），请完整描述从 Linux 命令到 Java 线程的「CPU 100% 定位三连」流程。",
      a: "核心结论：top 定进程 → top -H 定线程 → jstack 转十六进制定位 Java 代码行，三步把「机器发烫」精确映射到「哪行代码」。\n1. 第一步 top：按 P 排序，确认是 Java 游戏服进程在吃 CPU，记下 PID。同时看 us 还是 sy——us 高是业务代码，sy 高要怀疑系统调用/上下文切换。\n2. 第二步 top -H -p PID：切换到线程视图，找到吃 CPU 最高的线程 TID（如 12345）。\n3. 第三步换算 + 抓栈：printf '%x\\n' 12345 得到十六进制 nid（如 0x3039），然后 jstack PID | grep -A 30 'nid=0x3039'，直接看到该线程正在执行的 Java 堆栈。\n4. 游戏服常见结论：死循环（策划配置错误导致寻路/合成匹配逻辑出不了循环）、正则灾难性回溯、大集合 O(n²) 遍历（全服广播时嵌套循环）、频繁 Full GC（GC 线程吃 CPU，此时 nid 对应的是 GC task thread）。\n5. 工程化建议：连抓 3 次 jstack 间隔 5 秒对比（同一线程始终在 same frame 才是真热点）；CPU 毛刺型问题用 arthas 的 profiler/start 火焰图抓一段，比手动三连更直观。\n6. 预防：游戏服业务代码禁止无界 while(true)，循环必须有最大迭代保护；给核心线程池配监控，线程池满+CPU 高同时告警。",
      point: "考察 CPU 热点定位三连是否形成肌肉记忆，以及能否区分业务热点与 GC 热点。",
      approach: "先给三步口诀：top 定进程 → top -H 定线程 → jstack+十六进制定代码行 → 每步说清记什么数（PID/TID/nid）→ 列游戏服四种典型结论（死循环/正则回溯/O(n²)/Full GC）→ 工程化收尾：连抓 3 次对比、arthas 火焰图。坑：只抓一次 jstack 就下结论，偶发线程可能误判，要强调多次采样。",
      followups: [
        {
          q: "为什么 jstack 里的线程 id 要用十六进制匹配？",
          a: "jstack 输出的 nid 是十六进制的 native 线程 id，而 top -H 显示的 TID 是十进制，必须 printf '%x' 换算后再 grep；不换算直接搜十进制永远搜不到。"
        },
        {
          q: "如果热点线程是 GC 线程而不是业务线程，下一步怎么查？",
          a: "说明瓶颈在内存不在业务代码。jstat -gcutil 1s 看各区占用和 GC 频率，再 dump 堆用 MAT/arthas 查大对象和泄漏；游戏服常见是缓存集合无限增长或玩家对象未及时释放。"
        },
        {
          q: "arthas 的 thread -n 3 和 dashboard 能替代手动三连吗？",
          a: "日常定位可以，thread -n 3 直接列最忙线程带堆栈。但 arthas 线上接入要权限、attach 有瞬时开销，手动三连是不依赖任何工具的兜底技能，面试官更想听三连本身。"
        }
      ],
      memory: "三连定位 = 抓小偷：top 锁定哪栋楼（进程），top -H 锁定哪户人家（线程 TID），printf 换门牌号格式（十进制转十六进制），jstack 破门而入看现场（Java 堆栈）。",
      tags: ["CPU排查", "jstack", "top", "游戏实战", "Arthas"]
    },
    {
      id: "linux-10",
      level: 2,
      q: "日志服 Kafka 和消费端都报延迟毛刺，怀疑磁盘 IO。iostat 的关键指标怎么看？游戏服有哪些 IO 优化手段？",
      a: "核心结论：iostat -x 看四个数——%util（磁盘忙不忙）、await（IO 快不快）、r/s+w/s（频率）、avgrq-sz（块大小），组合判断 IO 是「量大」还是「盘慢」。\n1. iostat -x 1 关键列：\n   - %util 接近 100%：磁盘饱和；\n   - await（平均 IO 响应时间 ms）：机械盘超过 10ms、SSD 超过 2ms 就要警惕；\n   - r_await / w_await 分开看读写延迟；\n   - avgqu-sz：队列深度，持续大于 1 说明请求在排队。\n2. iotop -oP 定位到具体进程和线程，确认是 Kafka 落盘、MySQL 刷 binlog 还是应用日志在打满磁盘。\n3. 游戏服 IO 优化手段：\n   - 日志：logback 配 AsyncAppender + 合理 buffer，避免同步写盘阻塞业务线程；\n   - Kafka：本身就是顺序写 + 页缓存，优化方向是刷盘参数（log.flush.interval）和磁盘隔离；\n   - MySQL：innodb_flush_log_at_trx_commit 在日志服可容忍丢几秒数据的场景下调 2；\n   - 玩家落地：批量 + 错峰 + 异步，避免整点全服同时刷盘；\n   - 架构层：业务盘 / 日志盘 / 数据盘物理隔离，避免互相抢 IO。\n4. 云上特别提示：云盘有 IOPS 和吞吐上限，iostat 看着不满但云监控里配额打满，也会毛刺——这是传统经验在云上容易栽的坑。",
      point: "考察 iostat 指标组合解读能力，以及游戏服全链路 IO 优化手段的广度。",
      approach: "先给四指标分工：%util 忙不忙、await 快不快、频率、队列深度 → iotop 定位凶手进程 → 优化手段分组件展开（logback 异步、Kafka 刷盘、MySQL 参数、落地批量错峰、分盘隔离）→ 补云盘配额坑体现云上经验。坑：只看 %util 就下结论，忽略 await 和队列深度的组合判断。",
      followups: [
        {
          q: "await 很高但 %util 不高，说明什么？",
          a: "磁盘不忙但每次 IO 很慢：典型是随机小 IO 打机械盘，或云盘/RAID 本身性能差、队列深度不足；也可能是坏盘前兆，查 dmesg 里的 IO error。"
        },
        {
          q: "Kafka 为什么能把机械盘跑出接近内存的速度？",
          a: "三个设计：顺序写（append-only，机械盘顺序写≈内存随机写）；页缓存批量刷盘，读写大多命中内存；sendfile 零拷贝，数据从页缓存直接到网卡不经过用户态拷贝。"
        },
        {
          q: "怎么区分应用层写放大和磁盘本身慢？",
          a: "对比应用层写入量与 iostat 的 wMB/s：应用写 10MB/s 磁盘却 100MB/s 就是写放大（日志双写、binlog+redo、RAID 写惩罚）；写入量不大但 await 高则是盘本身慢。"
        }
      ],
      memory: "磁盘是食堂后厨：%util = 厨师有没有停手，await = 出一道菜要多久，avgqu-sz = 窗口排了几个人。厨师没停手但出菜慢 = 厨子手艺问题（盘慢）；排队很长 = 点菜太猛（应用写放大）。",
      tags: ["IO排查", "iostat", "Kafka", "游戏实战"]
    },
    {
      id: "linux-11",
      level: 2,
      q: "运营反馈部分玩家「间歇性掉线」，你怎么用 Linux 网络工具排查？ss 统计连接状态、TIME_WAIT 过多、tcpdump 抓包分别怎么玩？",
      a: "核心结论：网络排查先看连接状态分布（ss -s），再看异常状态堆积（TIME_WAIT/CLOSE_WAIT），最后 tcpdump 抓包看真实报文交互。\n1. 连接状态总览：ss -s 看整体统计；ss -ant | awk '{print $1}' | sort | uniq -c 统计各 TCP 状态数量。游戏服长连接网关 ESTABLISHED 应该约等于在线人数。\n2. TIME_WAIT 过多：主动关闭方进入 TIME_WAIT 等 2MSL。游戏服自己主动踢人/断连是正常来源；如果是网关主动短连请求（如 HTTP 回调支付渠道）产生大量 TIME_WAIT，要开 tcp_tw_reuse 或用连接池复用。危险是耗尽本地端口导致对外连接受限。\n3. CLOSE_WAIT 堆积（更危险）：对方关了连接、我方没 close，说明应用代码没正确处理连接关闭事件——游戏服出现大量 CLOSE_WAIT 通常是 Netty 里 channelInactive 没处理或业务 Handler 异常跳过了关闭逻辑，属于代码 bug。\n4. tcpdump 抓包：tcpdump -i any port 7777 -w game.pcap 抓游戏端口流量，拉到本地用 Wireshark 分析。玩家掉线场景重点看：是客户端发了 FIN（玩家真退出/切后台）、服务端发的 RST（我们踢的）、还是中间网络丢包重传（运营商/NAT 超时）。\n5. NAT 会话超时是手游掉线经典原因：移动网络 NAT 会话可能 5 分钟就回收，游戏心跳间隔必须小于这个值——这也是我们心跳定 30 秒的原因。\n6. 内核参数：somaxconn（accept 队列）、tcp_max_syn_backlog、net.ipv4.ip_local_port_range，开服瞬间连接洪峰时都可能成为瓶颈。",
      point: "考察 TCP 状态机实战理解：能否从 TIME_WAIT/CLOSE_WAIT 堆积反推代码或配置问题。",
      approach: "按「ss 统计状态分布 → 异常状态分析 → tcpdump 抓包验证」递进展开；重点讲 CLOSE_WAIT=我方没 close 是代码 bug（Netty 关闭逻辑），比 TIME_WAIT 更危险；落到 NAT 超时与心跳 30 秒的关联体现实战深度。坑：把 TIME_WAIT 当洪水猛兽乱调 recycle，方向就错了。",
      followups: [
        {
          q: "TIME_WAIT 和 CLOSE_WAIT 哪个更值得警惕？为什么？",
          a: "CLOSE_WAIT。TIME_WAIT 是协议正常状态，多是量的问题可调参缓解；CLOSE_WAIT 堆积是对方已关闭而我方代码没 close，属应用 bug，堆下去耗尽 fd 直接搞挂服务。"
        },
        {
          q: "tcpdump 抓包怎么只抓某个玩家的连接？怎么控制抓包文件大小？",
          a: "按来源 IP 过滤：tcpdump -i any port 7777 and host 玩家IP；控制大小用 -c 抓满 N 个包停、-C 按 MB 切分文件、-s 限制抓包长度；线上抓包务必加过滤条件防打满磁盘。"
        },
        {
          q: "为什么 NAT 超时会导致「静止不动必掉线，一直操作不掉线」？",
          a: "NAT 会话表有超时（移动网可能几分钟），有数据流动会话就续期；静止超时后表项被回收，下行报文找不到映射被丢弃，连接实际已死但客户端不知——心跳就是为保活 NAT 表项。"
        }
      ],
      memory: "TCP 状态排查像查快递：ESTABLISHED = 正常派送中，TIME_WAIT = 已签收但快递单还要留档 2 分钟（正常），CLOSE_WAIT = 对方已签收但你死活不点「确认收货」（代码 bug）。tcpdump = 调出全程物流监控。",
      tags: ["网络排查", "TIME_WAIT", "tcpdump", "游戏实战", "掉线"]
    },
    {
      id: "linux-12",
      level: 2,
      q: "free 显示内存几乎用满，但游戏服 RSS 远小于 -Xmx，内存到底被谁吃了？buffer/cache、swap、OOM Killer 分别是什么机制？",
      a: "核心结论：Linux 内存「用满」通常是文件页缓存，不是问题；真正要盯的是 available、swap 使用量和 dmesg 里的 OOM Killer 记录。\n1. buffer/cache：Linux 把空闲内存用作磁盘缓存（加速读写），free 低不代表内存不足，available 才是「还能给程序分配多少」。Kafka 能跑得快，很大程度靠的就是页缓存。\n2. RSS 与 -Xmx 对不上：Java 进程实际内存 = 堆 + 元空间 + 线程栈（每个线程默认 1M，几千线程就是几个 G）+ 直接内存（Netty 堆外）+ JIT 代码缓存 + GC 自身开销。游戏服 RSS 超过 Xmx 2~3G 很正常，超出太多要查 NMT（Native Memory Tracking）和 DirectBuffer 用量。\n3. swap：物理内存不够时把冷内存页换到磁盘。si/so 持续非 0 = 性能灾难（换页 IO 极慢）。游戏服务器建议 swappiness 调低（如 1~10），宁可 OOM 报错也不要慢慢卡死——卡顿比 Crash 更难排查、玩家体验更差。\n4. OOM Killer：内存耗尽时内核按 oom_score 挑进程杀掉。dmesg -T | grep -i 'killed process' 或 /var/log/messages 里查记录。游戏服物理机部署要给 JVM 留足堆外余量，否则 Xmx 配 16G、机器 16G，OOM Killer 必来。\n5. 容器环境注意：cgroup 内存限制触发的是容器内 OOM Kill，dmesg 在宿主机上看；Docker 里 RSS 超限直接被 kill -9，Java 进程来不及打任何日志。",
      point: "考察 Linux 内存模型的完整理解：页缓存、JVM 堆外内存、swap 与 OOM Killer 的关系。",
      approach: "先纠正「free 低=内存不足」的误区，available 才是关键 → 拆解 RSS 与 Xmx 的差（线程栈/直接内存/代码缓存，引到 NMT）→ swap 讲清为何调低 swappiness 而非禁用 → OOM Killer 用 dmesg 查记录 → 补容器 OOM 差异。坑：忽略堆外内存，把 Xmx 当进程全部内存。",
      followups: [
        {
          q: "为什么生产上建议关掉或调低 swappiness，而不是直接禁 swap？",
          a: "swap 是最后缓冲，禁掉后内存耗尽直接 OOM 杀进程；调低 swappiness（1~10）让内核尽量不主动换页，极端情况还有 swap 兜底喘口气，给告警和人工介入留时间。"
        },
        {
          q: "怎么给 Java 进程调整 oom_score_adj 避免它被优先杀？",
          a: "echo -900 > /proc/PID/oom_score_adj（范围 -1000~1000，越小越不容易被杀），需 root 并写进启动脚本；容器场景配 --oom-score-adj。注意别保护过度，真泄漏时会把系统拖死。"
        },
        {
          q: "NMT 怎么开启？能看出哪几类堆外内存？",
          a: "启动加 -XX:NativeMemoryTracking=summary，用 jcmd PID VM.native_memory 查看；能看 Java Heap、Class、Thread 栈、Code、GC、Internal 等类别，对比 reserved 增长趋势定位泄漏区域。"
        }
      ],
      memory: "Linux 内存是仓库：free 是「货架全摆满」，但大部分是周转箱（page cache），随时能腾出来——看 available 才知道真实空仓。swap 是把货搬到隔壁县（慢），OOM Killer 是仓库爆满时保安随机扔一家货（挑 oom_score 高的扔）。",
      tags: ["内存排查", "swap", "OOM Killer", "页缓存", "游戏实战"]
    },
    {
      id: "linux-13",
      level: 2,
      q: "游戏服进程半夜崩了要能自动拉起、服务器重启要能自动起服。nohup/&、systemd、supervisor 这几种守护方式有什么区别？你会怎么选？",
      a: "核心结论：nohup & 是「防挂断」不是守护；真正的进程守护要 systemd 或 supervisor，负责崩溃拉起、开机自启、日志管理。\n1. nohup java -jar game.jar &：只是忽略 SIGHUP 让进程在退出终端后存活。进程崩了就是崩了，没有任何拉起机制，服务器重启后也不会自启——只适合临时测试，生产不可用。\n2. systemd（主流选择）：写一个 unit 文件（[Service] 段配 ExecStart=启动命令、Restart=always/on-failure、RestartSec=10、User=appuser、LimitNOFILE=655350），systemctl enable 实现开机自启，崩溃后自动拉起，journalctl -u game 看日志。优点是系统原生、零额外依赖；还能配 StartLimitBurst 防止反复崩溃死循环拉起。\n3. supervisor：Python 写的进程管理器，配置简单（[program:game] 段），带 web 管理界面，适合没有 systemd 的老系统或多进程统一管理。\n4. 游戏服的特殊性——崩溃拉起不是简单 restart：游戏服是有状态服务，自动拉起前必须考虑：玩家数据上次落地时间点（丢多少）、拉起后旧连接如何处理（客户端重连）、要不要先进「维护模式」校验数据再开放登录。所以我们的做法是守护脚本拉起后先发告警，运维确认数据安全才放开登录网关。\n5. 配套：守护 + 监控双保险，进程消失 1 分钟内电话告警，不能只依赖自动拉起而无人知晓——自动拉起掩盖了崩溃频率，反而耽误根治。",
      point: "考察对「守护」本质的理解，以及有状态服务崩溃拉起的特殊处理，而非工具罗列。",
      approach: "先定性 nohup 只是防挂断不是守护 → 对比 systemd（主流、原生）与 supervisor（老系统/多进程）适用场景 → 重点展开游戏服有状态难点：拉起前查数据落地、先进维护模式 → 守护+监控双保险收尾。坑：只答自动拉起不提数据安全和告警，说明没真正运维过有状态服务。",
      followups: [
        {
          q: "systemd 的 Restart=always 和 on-failure 有什么区别？",
          a: "always 无论退出码如何都拉起（含正常退出）；on-failure 只在异常退出（非 0 码/被信号杀）时拉起。游戏服维护停服不应被自动拉起，常用 on-failure 并配 StartLimitBurst 防崩溃循环。"
        },
        {
          q: "为什么有状态的游戏服不能简单粗暴地崩溃秒拉起？",
          a: "崩溃瞬间内存可能有未落地数据，秒拉起开放登录会数据回滚、奖励重复、旧连接状态错乱。正确姿势：拉起 → 告警 → 数据校验/维护模式 → 确认安全再放玩家进。"
        },
        {
          q: "容器化之后还需要 systemd 吗？K8s 的 restartPolicy 解决了什么？",
          a: "容器单进程模型下守护职责上移：K8s 的 restartPolicy 管 Pod 重启，liveness/readiness 探针管摘流量，宿主机 systemd 退居管 kubelet；但虚拟机+裸 Docker 场景仍要配 restart 策略。"
        }
      ],
      memory: "nohup 是「下班后不锁门」（没人看守），systemd 是「请了 24 小时保安」（崩溃拉起+上下班自动开门）。但游戏服是有状态的仓库，保安把门重新打开前，得先盘点上次丢了多少货（数据落地检查）。",
      tags: ["进程守护", "systemd", "supervisor", "游戏实战", "运维"]
    },
    {
      id: "linux-14",
      level: 2,
      q: "现在要把 GM 后台和购买服容器化部署。讲讲 Docker 的镜像/容器/仓库核心概念，一个 SpringBoot 服务的 Dockerfile 怎么写？",
      a: "核心结论：镜像是「打包好的应用 + 运行环境」，容器是镜像的运行实例，仓库负责镜像分发；SpringBoot 容器化核心是一个分层友好的 Dockerfile + 合理的 JVM 容器参数。\n1. 三概念：镜像（Image）= 只读模板，分层存储；容器（Container）= 镜像 + 可写层的运行实例，互相隔离；仓库（Registry）= 镜像的 gitlab，docker push/pull 分发。\n2. 典型 Dockerfile：FROM eclipse-temurin:17-jre 选精简 JRE 基础镜像；WORKDIR /app；COPY target/gm-admin.jar app.jar；EXPOSE 8080；ENTRYPOINT [\"java\",\"-jar\",\"app.jar\"]。构建 docker build -t gm-admin:1.0 .，运行 docker run -d -p 8080:8080 --name gm gm-admin:1.0。\n3. 生产优化点：\n   - 镜像分层：依赖层（不常变）和应用层分开 COPY，日常发布只传应用层，秒级推送；SpringBoot 的 layertools 模式就是为这个设计的；\n   - 别在镜像里塞配置文件，配置用 -v 挂载或环境变量注入；\n   - JVM 必须感知容器内存：JDK8u191+/17 默认支持 -XX:MaxRAMPercentage=75.0，否则 JVM 按宿主机内存算堆，容器必被 OOM Kill；\n   - 基础镜像别用 latest 标签，版本锁定保证可复现。\n4. 游戏服容器化的特殊考量：GM 后台、购买服这类无状态 HTTP 服务很适合容器化；长连接游戏服容器化要小心——宿主机内核参数共享、网络层多一层 NAT 转发、滚动更新时玩家连接怎么迁移，都要提前设计。\n5. 常用命令链：docker ps / logs -f / exec -it bash / stats / inspect，排查容器问题就靠这五件。",
      point: "考察 Docker 三概念之外的工程细节：分层构建、JVM 容器感知与有状态服容器化边界。",
      approach: "三概念各一句比喻带过 → Dockerfile 逐行讲清 → 生产优化三点（分层缓存/配置外挂/MaxRAMPercentage 容器感知）→ 主动讲长连接游戏服容器化的坑（内核参数共享、连接迁移），区分无状态与有状态 → 排查命令链收尾。坑：把 EXPOSE 当端口映射讲，立刻露怯。",
      followups: [
        {
          q: "镜像分层是什么原理？为什么构建顺序要「依赖先 COPY，代码后 COPY」？",
          a: "镜像由只读层堆叠，每层对应一条 Dockerfile 指令且有缓存；依赖层不变则命中缓存，构建只重做应用层、推送只传差量层。所以变化频率低的依赖先 COPY，天天变的代码后 COPY。"
        },
        {
          q: "ENTRYPOINT 和 CMD 的区别？",
          a: "ENTRYPOINT 是容器入口主命令，CMD 是默认参数（会被 docker run 后的参数覆盖）。组合用法：ENTRYPOINT [\"java\",\"-jar\",\"app.jar\"] 固定入口，CMD 提供可覆盖的默认 JVM 参数。"
        },
        {
          q: "容器里 Java 看到的 CPU 核数不对（看到的是宿主机的），会有什么问题？",
          a: "JVM 按核数定 GC 线程、JIT 编译线程和 ForkJoinPool 并行度，看到宿主机几十核会开出远超配额的线程互相抢 CPU。JDK8u191+ 默认支持容器感知，老版本要手动限制 GC 线程数。"
        }
      ],
      memory: "镜像是「速冻饺子配方 + 包好的饺子」（只读模板），容器是「下锅煮的那一盘」（运行实例），仓库是「饺子冷链配送中心」。Dockerfile 的顺序 = 先放不变的大白菜（依赖层），后放每天换的馅料（应用层），热菜上得快。",
      tags: ["Docker", "Dockerfile", "容器化", "游戏实战", "部署"]
    },
    {
      id: "linux-15",
      level: 2,
      q: "Docker 容器里的服务连不上宿主机的 MySQL/Redis，怎么排查？docker run 的端口映射、挂载、网络模式，docker-compose 编排，你实际怎么用？",
      a: "核心结论：容器网络问题九成分三类——端口没映射、用了 localhost 这个容器内环回、防火墙/安全组拦截，按顺序查。\n1. 端口映射：docker run -p 宿主机端口:容器端口，外部访问走宿主机 IP + 映射端口。容器内应用必须监听 0.0.0.0 而不是 127.0.0.1，否则映射了也白搭——这是最高频的坑。\n2. localhost 陷阱：容器里的 localhost 是容器自己，不是宿主机！容器访问宿主机服务要用宿主机内网 IP、host.docker.internal（新版本），或 docker run --network host 直接用宿主机网络（牺牲隔离性换简单）。\n3. 数据持久化：-v /data/mysql:/var/lib/mysql 把数据目录挂载到宿主机，容器删了数据还在；日志同理挂载出来，否则 docker rm 后日志全没。\n4. docker-compose 编排：一个 yaml 描述多服务（购买服 + MySQL + Redis + Kafka），depends_on 控制启动顺序，networks 让服务间用服务名互相访问（如 jdbc:mysql://mysql:3306），docker-compose up -d 一键起整套环境——开发测试环境的神器，我们也是用它给测试快速搭环境。\n5. 排查命令链：docker ps 确认容器活着 → docker logs --tail 200 看启动报错 → docker exec -it xxx bash 进容器 ping/telnet 目标地址 → docker inspect 看网络配置和挂载是否生效。\n6. 资源限制：--memory、--cpus 限制容器资源，避免一个容器把宿主机吃垮；游戏相关服务混部时这是必配项。",
      point: "考察容器网络排障的套路化能力：端口映射、localhost 陷阱、防火墙三类按序排查。",
      approach: "先给三类根因定性（没映射/localhost 环回/防火墙）→ 逐条展开：-p 映射 + 应用必须监听 0.0.0.0、localhost 是容器自己、-v 挂载保数据 → compose 讲服务名互访（内置 DNS）→ ps/logs/exec/inspect 排查命令链收尾。坑：容器内 curl localhost 通就认为网络没问题，恰恰是最经典的误判。",
      followups: [
        {
          q: "bridge、host、none 三种网络模式有什么区别？生产上怎么选？",
          a: "bridge 是默认 NAT 隔离网络，需 -p 映射对外；host 直接用宿主机网络栈，性能好无端口映射但端口冲突自己管、隔离差；none 无网络。无状态服务用 bridge，网关/压测类性能敏感可选 host。"
        },
        {
          q: "docker-compose 里服务名为什么能当域名用？原理是什么？",
          a: "compose 自动创建 bridge 网络并内置 DNS，容器启动时把服务名注册为记录指向容器 IP；所以 jdbc:mysql://mysql:3306 里的 mysql 会被解析到 MySQL 容器，无需写死 IP。"
        },
        {
          q: "容器重启策略 restart: always 和 unless-stopped 的区别？",
          a: "always 无论容器怎么退出都重启（含手动 docker stop，dockerd 重启后又拉起）；unless-stopped 也是总是重启，但手动 stop 后守护进程重启不会再拉起。长期运行服务用 unless-stopped 更可控。"
        }
      ],
      memory: "容器是合租房里的独立房间：localhost 是自己房间里打转，找隔壁楼的 MySQL 得写对方楼牌号（宿主机 IP）；-p 是给你房间开个对外的门；-v 是把贵重家具（数据）存到楼下仓库，退租（rm 容器）也丢不了。",
      tags: ["Docker", "网络", "compose", "排查", "游戏实战"]
    },
    {
      id: "linux-16",
      level: 3,
      q: "线上全服玩家反馈「游戏变卡了」，你作为负责人，从 Linux 系统视角的完整排查路径是什么？请给出有优先级的方法论，而不是零散命令堆砌。",
      a: "核心结论：按「由面到点、由快到慢」五层漏斗排查：负载总览 → CPU → 内存 → 磁盘 IO → 网络，每层先花 30 秒定性再深入，先恢复服务再定位根因。\n第 0 步（先救命）：确认影响面（全服/单服/部分玩家），能重启恢复就先滚回或重启，保留现场快照（top、jstack、dump）再动手——10 年经验的价值体现在「止损优先于查案」。\n第 1 层 负载定性（30 秒）：uptime / top 看 load 与核数比值。load 高 CPU 高 → 走 CPU 路径；load 高 CPU 低 → 走 IO 路径；load 不高但卡 → 走网络或应用锁路径。\n第 2 层 CPU（2 分钟）：top -H + jstack 三连定位热点线程；jstat -gcutil 1s 看是否 Full GC 风暴；arthas profiler 出火焰图。游戏服典型结论：死循环、正则回溯、GC 失控。\n第 3 层 内存（1 分钟）：free 看 available 和 swap；RSS 是否超容器/机器限额；dmesg 查 OOM Kill。\n第 4 层 磁盘 IO（2 分钟）：iostat -x 看 %util 和 await；iotop 找凶手进程；df 确认没写满。游戏服典型结论：落地刷盘撞日志高峰。\n第 5 层 网络（2 分钟）：ss -s 看连接状态分布（CLOSE_WAIT 堆积？）；sar -n DEV 看带宽是否打满；丢包重传率；ping/telnet 依赖服务（MySQL/Redis/Kafka）确认下游没挂。\n收尾方法论：\n1. 每层都先问「是这台机器的问题，还是下游依赖的问题」——游戏服卡常常是 MySQL 慢查询或 Redis 热 key 的表象；\n2. 对比法：同集群挑一台正常机器对比指标，差异即线索；\n3. 时间对齐：把指标异常的开始时间对齐发布记录、活动开启时间、监控告警，80% 的线上问题能在「变更点」找到根因；\n4. 复盘产出：监控盲区补齐、阈值调整、预案更新，形成闭环。",
      point: "考察 L3 级方法论：能否给出有优先级的排查漏斗和「先止损再查案」的负责人思维。",
      approach: "严格按结构答：第 0 步止损留现场（先救命）→ 五层漏斗每层给时限、关键命令和游戏服典型结论 → 收尾四条方法论（本机还是下游、对比法、时间对齐变更点、复盘闭环）。坑：零散堆命令、上来就 jstack，都会被判定为没有负责人视角；结构化表达本身就是答案的一半。",
      followups: [
        {
          q: "如果所有系统指标都正常，玩家还是卡，下一层怀疑什么？",
          a: "下潜应用内部：锁竞争（jstack 看 BLOCKED 线程和死锁）、线程池队列积压、下游 RT 毛刺（MySQL 慢查询/Redis 热 key）、客户端侧问题（弱网/机型）。系统指标正常不代表应用链路健康。"
        },
        {
          q: "为什么强调「保留现场再重启」？哪些现场信息重启就没了？",
          a: "top 快照、jstack 堆栈、GC 日志、堆 dump 反映的都是异常瞬间状态，重启即销毁，事后只剩「变卡了」三个字无法复盘。先 jstack+jmap 再重启，几秒钟换根因可查。"
        },
        {
          q: "这套方法论和 APM（SkyWalking）是什么关系？能互相替代吗？",
          a: "互补不替代：系统命令管机器层（CPU/内存/IO/网络），APM 管应用链路层（调用链/慢 SQL/RT）。正确顺序是先用系统命令定性「是不是机器的锅」，不是再用 APM 钻链路细节。"
        }
      ],
      memory: "五层漏斗 = 医生问诊：量体温（load）→ 查心跳（CPU）→ 查血（内存）→ 查消化（IO）→ 查神经（网络）。先打退烧针（重启/回滚止损）再查病因，病历（现场快照）先拍下来，最后写病例总结（复盘）。",
      tags: ["排查方法论", "L3", "游戏实战", "负责人视角"]
    },
    {
      id: "linux-17",
      level: 3,
      q: "你们游戏服要更新版本，在裸机/虚拟机 + Shell 脚本的环境下（没有 K8s），怎么设计「不停机更新 + 出问题秒回滚」的发布方案？",
      a: "核心结论：无 K8s 环境下靠「多实例 + 目录版本化 + 流量入口切换 + 快速回滚脚本」手工实现滚动发布，游戏服还要额外处理「有状态玩家连接」这个核心难点。\n1. 无状态服务（GM 后台/购买服/登录服）：\n   - 目录版本化：/data/app/gm/v1.2.0、v1.2.1 并存，软链 /data/app/gm/current 指向当前版本；回滚 = 软链指回旧目录 + 重启，10 秒内完成；\n   - 多实例滚动：一台台摘流量（nginx upstream 摘节点）→ 更新 → 健康检查 → 挂回，全程服务不断。\n2. 有状态游戏服（核心难点）：玩家连着呢，不能硬切。我们的方案：\n   - 逻辑层滚动：按「区服/分线」为单位滚动更新，单线维护时该线玩家收到「分线维护」提示并引导换线；\n   - 优雅下线：对要更新的实例先发「停止接收新登录」指令 → 等在线玩家自然流失或超时踢人 → 强制落地所有玩家数据 → 关服更新；\n   - 连接迁移（高级玩法）：网关节点与逻辑节点分离时，网关保持连接不动，只重启后端逻辑节点，玩家无感知——这是战斗服/功能服分离架构的红利。\n3. 回滚设计：发布前自动备份（旧包 + 数据库版本标记）；回滚脚本一键执行（软链回指 + 重启 + 健康检查）；特别要命的是「数据库结构变更不可回滚」——所以 DDL 必须「向前兼容」：先加字段不发版、发版用新字段、稳定后再清理旧字段（三阶段变更法）。\n4. 灰度：先更一个内部测试服/小流量区服跑 24 小时，关键指标（报错率、在线、充值）无异常再全量。\n5. 发布 checklist：发布窗口选低峰（凌晨）、发布前公告、发布后盯盘 30 分钟、回滚决策人明确——发布是「操作 + 预案 + 决策机制」的组合，不只是脚本。",
      point: "考察无 K8s 环境手工实现滚动发布的能力，核心是有状态连接与 DDL 兼容两大难点。",
      approach: "分两层答：无状态服务（目录版本化+软链+nginx 摘流量滚动）→ 有状态游戏服（按分线滚动/优雅下线/网关逻辑分离三种手段）→ 回滚设计重点讲 DDL 三阶段变更法（这是真正的考点）→ 灰度+发布 checklist 收尾体现「预案+决策机制」。坑：只说备份旧包能回滚、不提数据库结构变更不可回滚，直接暴露没发过大版本。",
      followups: [
        {
          q: "为什么数据库结构变更是回滚的最大障碍？三阶段变更法具体怎么操作？",
          a: "代码回滚靠软链秒级完成，但 DDL 不可回滚——旧代码不认新字段可能报错，删字段直接炸。三阶段：先发兼容 DDL（只加不改）→ 发代码用新字段 → 稳定后清理旧字段，每步都可回退。"
        },
        {
          q: "蓝绿发布和你们这种滚动发布各有什么适用场景？",
          a: "蓝绿是两套完整环境瞬时切流量、回滚=切回，适合无状态且资源充足的服务，代价是双倍资源和数据同步难；滚动发布逐台更新省资源、适合有状态游戏服按分线灰度，但窗口长、新旧版本共存要求协议兼容。"
        },
        {
          q: "如果更新涉及协议变更（客户端也要更新），发布顺序怎么安排？",
          a: "协议向前兼容优先：新客户端兼容旧协议时先发客户端（提审周期长）再发服务端；强更场景服务端同时部署新旧两套协议入口，旧客户端走旧入口灰度切流，确认旧版本无人使用后再下线。"
        }
      ],
      memory: "发布像飞机换引擎：无状态服务是直升机（悬停换引擎），有状态游戏服是满载客机（先让乘客下机/转乘，再换）。回滚软链 = 随时能换回来的备用引擎；DDL 三阶段 = 乘客还在机上，不能拆座椅只能先加安全带。",
      tags: ["发布", "回滚", "灰度", "游戏实战", "L3"]
    },
    {
      id: "linux-18",
      level: 3,
      q: "讲几个你知道的「教科书之外」的 Linux 诡异线上问题：时钟回拨、conntrack 表满、DNS 解析卡顿——这些在游戏服上会造成什么现象，怎么排查和预防？",
      a: "核心结论：高级排查的胜负手是「非常规嫌疑清单」，时钟、conntrack、DNS 是三个教科书不讲但线上真出事的暗坑。\n1. 时钟回拨：NTP 同步或虚拟机漂移导致系统时间倒退。游戏服连锁反应：定时任务重复触发（活动奖励重复发放）、基于时间的签到/结算错乱、雪花 ID 生成器直接抛异常、TLS 证书校验失败。排查：dmesg/日志里看时间戳跳跃；预防：NTP 用 slew 模式（缓慢追时而非跳变，ntpd -x 或 chrony 的 makestep 配置），关键时间判断用单调时钟（System.nanoTime 思想）而非墙钟。\n2. conntrack 表满：内核连接跟踪表（nf_conntrack）记录每条连接状态，默认上限可能只有几万。游戏长连接网关 + 高并发回调容易打满，现象是「随机丢包、连接建立失败、新连接超时但老连接正常」，日志报 nf_conntrack: table full, dropping packet。排查：cat /proc/sys/net/netfilter/nf_conntrack_count 对比 max；解决：调大 max 和 hashsize、缩短 timeout，或游戏服网关干脆用 raw socket/关闭不必要的 conntrack（NOTRACK 规则）。\n3. DNS 解析卡顿：Java 默认会缓存 DNS（networkaddress.cache.ttl），但 glibc 的 resolver 是同步阻塞的，DNS 服务器抖动时，首次解析的线程全部阻塞数秒——表现是服务间歇性无规律卡顿且 CPU 正常。游戏服调用渠道支付/登录验证接口时会踩到。预防：内网 DNS 高可用、应用层直接配 IP + Host 头、JDK 层确认缓存策略。\n4. 通用启示：线上问题排查到应用层、JVM 层都干净时，要敢于下潜到内核/系统层——dmesg、/proc 计数器、内核日志是最后的信息源；这些案例面试讲一个，直接和背八股的候选人拉开档次。",
      point: "考察系统层非常规问题的真实积累，能否下潜内核层讲清机理而非背名词。",
      approach: "每个暗坑按「成因 → 游戏服现象 → 排查命令 → 预防」四步讲透：时钟回拨重点挂雪花 ID 和定时任务、conntrack 讲「老连接正常新连接失败」的迷惑性、DNS 讲同步阻塞导致无规律卡顿；收尾升华「应用层查干净后要敢于下潜内核层」。坑：只报名词讲不出机理反而露怯，宁可深讲两个不要浅背三个。",
      followups: [
        {
          q: "为什么时钟回拨对雪花 ID 是致命的？业务上怎么容忍？",
          a: "雪花 ID 依赖时间戳递增，回拨会产生重复 ID，主键冲突直接炸库。容忍方案：回拨检测后等时钟追上、回拨时切备用 workerId 发号、或用号段模式/Leaf 这类不依赖单机时钟的方案。"
        },
        {
          q: "conntrack 表满为什么「老连接正常、新连接失败」？",
          a: "老连接已写入 conntrack 表项，内核转发直接命中；新连接要新建表项，表满插不进去，报文直接被 drop，SYN 都到不了应用——存量正常、增量全挂，极具迷惑性。"
        },
        {
          q: "还有哪些你了解的系统层暗坑？（如 TCP 粘包级别的内核缓冲、文件系统 atime、透明大页 THP）",
          a: "THP 导致 Redis 持久化时内存延迟毛刺，生产要关；atime 每次读都触发元数据写，日志大盘挂 noatime；还有软中断集中单核（ksoftirqd 打满）、fd 上限/句柄泄漏、cache pressure 诱发 swap 换页等。"
        }
      ],
      memory: "三大暗坑 = 城市基础设施事故：时钟回拨 = 全城钟表倒着走（红绿灯全乱、奖励重发）；conntrack 满 = 车管所登记簿写满了（老车照跑、新车不让上牌）；DNS 卡 = 导航公司电话占线（司机全在路边干等）。背八股的查大楼内部，老司机会查市政管网。",
      tags: ["L3", "时钟回拨", "conntrack", "DNS", "疑难杂症"]
    }
  ]
};
