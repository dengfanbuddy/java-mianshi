window.TB = window.TB || {};
window.TB["algorithm"] = {
  id: "algorithm",
  name: "数据结构与算法",
  icon: "🧮",
  nodes: [
 {
  "id": "algorithm-complexity",
  "title": "复杂度与算法思想",
  "layer": 0,
  "depends": [],
  "covers": [
   "algorithm-01"
  ],
  "quiz": [
   "algorithm-01"
  ],
  "body": [
   {
    "t": "lead",
    "text": "复杂度是算法的'计价单位'：它回答的不是'这段代码多快'，而是'输入规模变大时，代码会怎么变慢'。游戏服务器里，一次全服广播、一次排行榜刷新、一次 AOI 扫描，选错复杂度就是线上事故。"
   },
   {
    "t": "pre",
    "items": [
     "会用 Java 写最基本的循环、递归、数组操作",
     "做过游戏服的玩家列表遍历、排行榜更新、AOI 扫描",
     "理解'输入规模 n'：在线玩家数、道具数量、配置行数"
    ]
   },
   {
    "t": "h",
    "text": "大 O 到底是什么"
   },
   {
    "t": "p",
    "text": "大 O 记号描述的是'渐进上界'：当输入规模 n 趋近无穷大时，基本操作次数的增长趋势。三个要点必须吃透：第一，只抓主导项，忽略低阶项和常数系数，3n² + 5n + 10 就是 O(n²)；第二，看的是趋势不是绝对值，O(n²) 的算法在 n=10 时可能比 O(nlogn) 还快，n 大到一定程度才反转；第三，复杂度描述的是'增长级别'，同一个 O(nlogn) 的实际常数可以差 10 倍，这就是工程上为什么要测 benchmark。"
   },
   {
    "t": "h",
    "text": "从代码结构直接读出复杂度"
   },
   {
    "t": "list",
    "items": [
     "顺序语句：取所有片段里最大的那个，O(A + B) 取 max",
     "单层循环：循环跑 n 次就是 O(n)，内层是常数操作",
     "双层嵌套：内层也随 n 变就是 O(n²)，但内层边界固定时只是 O(n)",
     "折半类：每次砍一半是 O(logn)，二分查找、平衡树查找都是",
     "递归：画递归树，树的深度 × 每层代价，归并是 T(n) = 2T(n/2) + O(n) = O(nlogn)",
     "均摊：ArrayList 的 add 单次可能 O(n) 扩容，摊到多次插入后是 O(1) 均摊"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 从代码结构读复杂度：四个典型片段\n\n// O(1)：按玩家 ID 从 Map 取对象，与玩家总数无关\nPlayer p = onlineMap.get(playerId);\n\n// O(logn)：有序战力数组里二分定位排名\nint lo = 0, hi = powers.length - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;   // 防溢出写法\n    if (powers[mid] >= target) hi = mid - 1;\n    else lo = mid + 1;\n}\n\n// O(n)：遍历在线玩家做全服广播\nfor (Player online : onlinePlayers) {\n    online.send(msg);\n}\n\n// O(nlogn)：排行榜全量排序（JDK TimSort/DualPivot）\nArrays.sort(players, Comparator.comparingLong(Player::getPower));\n\n// O(n²)：新手写 AOI，万人同屏是 10^8 次距离计算，必须换九宫格\nfor (Player a : players) {\n    for (Player b : players) {\n        double d = dist(a, b); // 灾难\n    }\n}"
   },
   {
    "t": "h",
    "text": "递归与分治：三件套拆解"
   },
   {
    "t": "p",
    "text": "递归不是'循环的替代品'，而是一种'把问题缩小到同样的子问题'的思维方式。写递归先想三件事：基线条件（什么时候直接返回）、递归调用（问题怎么变小）、返回值怎么用。分治是递归最常见的形态：把大问题拆成几个独立小问题，分别解决，再合并结果。归并排序、快排、最近点对都是经典分治。游戏里常见的分治场景：跨服排行榜把各服局部榜单合并成全局榜单、日志文件按天切分后并行统计。"
   },
   {
    "t": "p",
    "text": "递归的复杂度要靠'递归树'来算，这是面试官最爱考的点：朴素斐波那契 f(n) = f(n-1) + f(n-2)，递归树每一层节点翻倍，总节点数 O(2^n)；加了记忆化（备忘录）后每个 n 只算一次，降为 O(n)；再用矩阵快速幂可以到 O(logn)。从 O(2^n) 到 O(n) 到 O(logn) 是动态规划入门的三连问，后面 DP 篇会细讲。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">常见复杂度增长曲线（横轴 n 数据量，纵轴操作次数）</text>\n<line x1=\"40\" y1=\"280\" x2=\"620\" y2=\"280\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"40\" y1=\"280\" x2=\"40\" y2=\"30\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"28\" y=\"285\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">0</text>\n<text x=\"300\" y=\"298\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">n（输入规模）</text>\n<text x=\"24\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">操作数</text>\n<path d=\"M40 278 L580 278\" stroke=\"var(--lv1)\" stroke-width=\"2.5\"/>\n<text x=\"585\" y=\"282\" font-size=\"13\" fill=\"var(--lv1)\">O(1) 常数级</text>\n<path d=\"M40 276 Q200 150 580 60\" stroke=\"var(--accent)\" stroke-width=\"2.5\" fill=\"none\"/>\n<text x=\"585\" y=\"64\" font-size=\"13\" fill=\"var(--accent)\">O(logn)</text>\n<path d=\"M40 270 L580 40\" stroke=\"var(--lv2)\" stroke-width=\"2.5\"/>\n<text x=\"585\" y=\"44\" font-size=\"13\" fill=\"var(--lv2)\">O(n)</text>\n<path d=\"M40 268 Q240 180 420 90 T580 22\" stroke=\"var(--lv3)\" stroke-width=\"2.5\" fill=\"none\"/>\n<text x=\"585\" y=\"26\" font-size=\"13\" fill=\"var(--lv3)\">O(nlogn)</text>\n<path d=\"M40 265 Q300 100 520 14 L560 8 L580 4\" stroke=\"#ff8a65\" stroke-width=\"2.5\" fill=\"none\"/>\n<text x=\"585\" y=\"8\" font-size=\"13\" fill=\"#ff8a65\">O(n²)</text>\n<text x=\"320\" y=\"316\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏服帧预算只有几毫秒：任何 O(n²) 出现在热路径都是事故</text>\n</svg>",
    "caption": "图：五大复杂度级别增长曲线，O(n²) 在大规模下断崖式恶化"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">递归树：f(5) 朴素递归（无记忆化）节点爆炸</text>\n<text x=\"320\" y=\"48\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">每层节点翻倍，总节点数 O(2^n)，大量重复计算 f(3)、f(2)…</text>\n<g stroke=\"var(--line)\" stroke-width=\"1.2\">\n<line x1=\"320\" y1=\"90\" x2=\"240\" y2=\"140\"/>\n<line x1=\"320\" y1=\"90\" x2=\"400\" y2=\"140\"/>\n<line x1=\"240\" y1=\"140\" x2=\"180\" y2=\"190\"/>\n<line x1=\"240\" y1=\"140\" x2=\"300\" y2=\"190\"/>\n<line x1=\"400\" y1=\"140\" x2=\"340\" y2=\"190\"/>\n<line x1=\"400\" y1=\"140\" x2=\"460\" y2=\"190\"/>\n</g>\n<rect x=\"295\" y=\"66\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"320\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(5)</text>\n<rect x=\"215\" y=\"116\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"240\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(4)</text>\n<rect x=\"375\" y=\"116\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"400\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(3)</text>\n<rect x=\"155\" y=\"166\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"180\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(3)</text>\n<rect x=\"275\" y=\"166\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"300\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(2)</text>\n<rect x=\"315\" y=\"166\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"340\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(2)</text>\n<rect x=\"435\" y=\"166\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"460\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(1)</text>\n<g stroke=\"var(--line)\" stroke-width=\"1.2\">\n<line x1=\"180\" y1=\"190\" x2=\"135\" y2=\"240\"/>\n<line x1=\"180\" y1=\"190\" x2=\"225\" y2=\"240\"/>\n</g>\n<rect x=\"110\" y=\"216\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"135\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(2)</text>\n<rect x=\"200\" y=\"216\" width=\"50\" height=\"24\" rx=\"6\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"225\" y=\"232\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">f(1)</text>\n<text x=\"565\" y=\"150\" font-size=\"13\" fill=\"var(--lv3)\">红框 = 被重复计算</text>\n<text x=\"565\" y=\"172\" font-size=\"13\" fill=\"var(--accent)\">记忆化 → O(n)</text>\n<text x=\"565\" y=\"194\" font-size=\"13\" fill=\"var(--lv2)\">矩阵快速幂 → O(logn)</text>\n<text x=\"565\" y=\"216\" font-size=\"13\" fill=\"var(--muted)\">递归深度=栈空间</text>\n<text x=\"565\" y=\"238\" font-size=\"13\" fill=\"var(--muted)\">记得答空间复杂度</text>\n</svg>",
    "caption": "图：斐波那契递归树，暴露重复子问题，引出 DP 优化路径"
   },
   {
    "t": "h",
    "text": "贪心、动态规划、分治的适用边界"
   },
   {
    "t": "table",
    "head": [
     "思想",
     "核心",
     "适用条件",
     "典型反例"
    ],
    "rows": [
     [
      "分治",
      "拆小、分别解、合并",
      "子问题独立（无重叠）",
      "斐波那契重叠子问题不适用朴素分治"
     ],
     [
      "贪心",
      "每步选当前最优，不回退",
      "局部最优能推出全局最优（贪心选择性质）",
      "01 背包（选最贵的先装会失败）"
     ],
     [
      "动态规划",
      "重叠子问题 + 最优子结构",
      "状态可枚举、转移有递推关系",
      "不满足最优子结构的问题（如最长回文子序列变体需小心）"
     ],
     [
      "回溯",
      "枚举所有可能 + 剪枝",
      "解空间是组合/排列/子集",
      "无解空间可枚举时不可用"
     ]
    ]
   },
   {
    "t": "p",
    "text": "一句话记牢：能用贪心的一定能证明'局部最优累积成全局最优'，证明不了就退一步用 DP；DP 是'暴力枚举 + 记忆化'的优雅化，凡是能写出递归暴力解的，几乎都能改成 DP。游戏里的典型映射：匹配系统的贪心（战力相近优先匹配，证明不了全局最优就用匈牙利/最大流）、背包系统的 DP（装备词条组合最优）、怪物 AI 的分治（视野区域划分）。面试时被问'为什么这里不能用贪心'，要能立刻举反例——这是区分背模板和真理解的分水岭。"
   },
   {
    "t": "pits",
    "items": [
     "只背定义不会从代码读复杂度：面试是看代码结构让你说复杂度，内层边界固定时嵌套循环其实是 O(n)",
     "忘答空间复杂度：递归深度 O(n) 栈空间、辅助数组 O(n)，主动说'时间 O(n)、空间 O(1) 原地操作'",
     "把均摊复杂度说成最坏复杂度：HashMap get 是均摊 O(1)，最坏（哈希碰撞）是 O(n)，Java 8 树化后 O(logn)",
     "递归复杂度算错：斐波那契朴素递归是 O(2^n) 不是 O(n)，漏算递归树的重复节点",
     "复杂度不和游戏业务挂钩：面试官期待你把 O(n²) 对应到万人同屏 AOI、把 O(logn) 对应到 ZSet 排行，这是 10 年游戏人的独有优势",
     "把 O(nlogn) 和 O(n²) 记混实际量级：n=10 万时 nlogn 约 170 万次，n² 是 100 亿次，差 6000 倍"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：复杂度是算法的'计价单位'，抓主导项、读代码结构、画递归树、记均摊。游戏面试升级点：把复杂度与帧预算挂钩——单玩家逻辑帧预算只有几毫秒，热路径出现 O(n²) 就是事故，这句话能直接区别于纯刷题选手。关联题库题见下方卡片。"
   }
  ]
 },
 {
  "id": "algorithm-array-two-pointer",
  "title": "数组与双指针",
  "layer": 0,
  "depends": [
   "algorithm-complexity"
  ],
  "covers": [
   "algorithm-15"
  ],
  "quiz": [
   "algorithm-15"
  ],
  "body": [
   {
    "t": "lead",
    "text": "数组是连续内存的线性表，双指针是数组题的'万能钥匙'：对撞、快慢、滑动窗口三大流派，能把一大票 O(n²) 暴力压到 O(n)。前缀和与差分数组则是把'区间查询/区间更新'从 O(n) 降到 O(1) 的预处理利器。"
   },
   {
    "t": "pre",
    "items": [
     "掌握时间复杂度分析（见复杂度篇）",
     "会用 Java 数组和 ArrayList",
     "理解'连续子数组'、'区间 [l, r]'这些基础概念"
    ]
   },
   {
    "t": "h",
    "text": "双指针三流派：识别信号是关键"
   },
   {
    "t": "p",
    "text": "双指针不是一种算法，是一套'用有序性/单调性减少重复扫描'的框架。面试官考双指针，真正考的是你能不能识别出该用哪一派。对撞指针：数组有序，一左一右往中间收，典型是两数之和（有序版）、回文判断、盛水容器。快慢指针：同向走，一快一慢，典型是链表判环、数组去重。滑动窗口：维护一个动态区间，右指针扩张、左指针收缩，典型是子串/子数组问题。识别信号记一句：'有序 + 成对 → 对撞；同向 + 环/去重 → 快慢；连续区间 + 最优/计数 → 滑窗'。"
   },
   {
    "t": "h",
    "text": "滑动窗口模板（最高频）"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 滑动窗口通用模板：无重复字符的最长子串\n// 核心口诀：右扩记账，冲突左缩（while 不是 if）\npublic int lengthOfLongestSubstring(String s) {\n    Set<Character> window = new HashSet<>();\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.length(); right++) {\n        char c = s.charAt(right);\n        // 右扩导致冲突：持续左缩直到冲突消失\n        while (window.contains(c)) {\n            window.remove(s.charAt(left));\n            left++;\n        }\n        window.add(c);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n// 复杂度：每个字符进出窗口各一次，O(n) 时间，O(字符集) 空间\n\n// 游戏场景变体：判断一段聊天文本里\n// '连续出现的表情种类不超过 8 个'的最长片段（滑窗 + 计数器）"
   },
   {
    "t": "p",
    "text": "滑动窗口的一个经典误写是用 if 而不是 while 收缩左指针。为什么必须 while？因为新加入的字符可能和窗口里多个字符冲突，比如窗口里有两个 a，又来了第三个 a，必须把两个 a 都移出去才算干净，if 只移一次窗口内仍有重复，破坏了'窗口内始终无重复'的不变式。写完后一定要自己验证一个重复多发的用例，这是面试官观察你严谨性的点。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">滑动窗口：右扩记账，冲突左缩</text>\n<rect x=\"40\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"66\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a</text>\n<rect x=\"100\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"126\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">b</text>\n<rect x=\"160\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"186\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">c</text>\n<rect x=\"220\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"246\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a</text>\n<rect x=\"280\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"306\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">b</text>\n<rect x=\"340\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"366\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">c</text>\n<rect x=\"400\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"426\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a</text>\n<rect x=\"460\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"486\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">d</text>\n<rect x=\"520\" y=\"60\" width=\"52\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"546\" y=\"87\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">e</text>\n<line x1=\"220\" y1=\"50\" x2=\"160\" y2=\"50\" stroke=\"var(--lv1)\" stroke-width=\"2.5\" marker-end=\"url(#a1)\"/>\n<line x1=\"332\" y1=\"50\" x2=\"272\" y2=\"50\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#a1)\"/>\n<defs><marker id=\"a1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"190\" y=\"42\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv1)\">left 右缩</text>\n<text x=\"305\" y=\"42\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">right 右扩</text>\n<text x=\"320\" y=\"136\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--muted)\">窗口 = 无重复区间，冲突字符 a 出现第二次 → 左缩到 a 出窗</text>\n<rect x=\"40\" y=\"170\" width=\"140\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"110\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">对撞指针</text>\n<text x=\"110\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">有序数组两数之和</text>\n<rect x=\"250\" y=\"170\" width=\"140\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"320\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">快慢指针</text>\n<text x=\"320\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">链表判环 / 去重</text>\n<rect x=\"460\" y=\"170\" width=\"140\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"530\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">滑动窗口</text>\n<text x=\"530\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">子串 / 连续子数组</text>\n<text x=\"320\" y=\"258\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">识别信号：有序+成对→对撞；同向+环/去重→快慢；连续区间+最优/计数→滑窗</text>\n<text x=\"320\" y=\"282\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏落地：聊天过滤连续表情、战力区间匹配、活动期间连续签到天数统计</text>\n<text x=\"320\" y=\"306\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">左缩必须用 while 不能用 if</text>\n</svg>",
    "caption": "图：滑动窗口右扩左缩过程与双指针三流派识别信号"
   },
   {
    "t": "h",
    "text": "前缀和与差分数组：区间问题的预处理利器"
   },
   {
    "t": "p",
    "text": "前缀和解决'静态数组频繁区间求和'：pre[i] 表示前 i 个元素之和，区间 [l, r] 的和 = pre[r] - pre[l-1]，O(1) 查询、O(n) 预处理。游戏场景：每日活跃玩家数按天统计，要查'最近 7 天累计活跃'，先建前缀和再 O(1) 出答案。差分数组解决'区间批量加减'：diff[i] 记录相邻元素差，对区间 [l, r] 统一加 v，只需 diff[l] += v、diff[r+1] -= v，最后前缀和还原。游戏场景：活动 buff 期间全体攻击力 +10%，用差分数组标记生效区间，再一次性还原。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 前缀和：区间求和 O(1)\nlong[] pre = new long[n + 1]; // pre[i] = 前 i 个元素和，pre[0]=0\nfor (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];\n// 区间 [l, r] 的和（含端点）\nlong sum = pre[r + 1] - pre[l];\n\n// 差分数组：区间 [l, r] 统一加 v，最后前缀和还原\nlong[] diff = new long[n + 2];\nvoid add(int l, int r, int v) {\n    diff[l] += v;\n    diff[r + 1] -= v;\n}\nlong[] result = new long[n];\nfor (int i = 0; i < n; i++) {\n    result[i] = (i > 0 ? result[i - 1] : 0) + diff[i];\n}\n// 复杂度：N 次区间更新 O(N) 完成，若逐个遍历是 O(N * 区间长)"
   },
   {
    "t": "pits",
    "items": [
     "识别错流派：无重复最长子串是滑窗不是对撞；两数之和无序用哈希、有序才对撞，别一上来就套",
     "左缩用 if 不用 while：冲突字符可能对应窗口内多个元素，必须持续收缩到冲突消除",
     "前缀和数组下标偏移记错：用 1-based 的 pre 数组（pre[0]=0）避免 l-1 越界，这是最常见的 off-by-one",
     "差分数组忘开 r+1：diff 长度开 n+2，否则 r 是末位时越界",
     "滑动窗口忘了维护窗口内计数的不变式：set/map 只记录窗口内元素，收缩时必须同步删除",
     "游戏场景答不出落地：聊天敏感词连续片段、战力区间匹配、连续签到、活动 buff 区间，随手举一个显实战感"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：双指针三流派 + 前缀和 + 差分数组，是数组题的'五件套'。核心是识别信号而非背代码，滑窗左缩用 while 是最高频坑。游戏落地随手举：连续签到天数、buff 区间、聊天连续表情、战力区间匹配。"
   }
  ]
 },
 {
  "id": "algorithm-linked-list",
  "title": "链表",
  "layer": 1,
  "depends": [
   "algorithm-complexity"
  ],
  "covers": [
   "algorithm-02",
   "algorithm-05"
  ],
  "quiz": [
   "algorithm-02",
   "algorithm-05"
  ],
  "body": [
   {
    "t": "lead",
    "text": "链表是指针操作的基本功验收场：反转、判环、合并、回文、LRU，每一个都是笔试上机必考。核心思维只有一条——'动手前先把指针关系画清楚，动手后先暂存后患'。Netty 的 Pipeline、手写 LRU 的双向链表、消息队列的延迟队列，都是链表在游戏服的化身。"
   },
   {
    "t": "pre",
    "items": [
     "会用 Java 定义 Node 类和 new 对象",
     "理解引用赋值只是拷贝地址，不是拷贝对象",
     "掌握复杂度分析（见复杂度篇）"
    ]
   },
   {
    "t": "h",
    "text": "反转单链表：基本功验收题"
   },
   {
    "t": "p",
    "text": "反转链表是链表题的'九九乘法表'，迭代版用三个指针 prev/curr/next 滚一遍：先暂存 next = curr.next（保住后继，否则断链丢数据），再 curr.next = prev（掉头），最后 prev = curr、curr = next（双指针前进）。循环结束条件是 curr 为 null，此时 prev 就是新头。递归版思路是'假设 head 之后的子链已反转好，只需让 head.next.next = head、head.next = null'。两个版本都要会，迭代版空间 O(1)，递归版空间 O(n)（递归栈），游戏服热路径别用深递归。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 迭代版反转：O(n) 时间 O(1) 空间\npublic ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode next = curr.next; // ① 先暂存后继，否则断链\n        curr.next = prev;          // ② 掉头\n        prev = curr;               // ③ 前进\n        curr = next;\n    }\n    return prev; // 注意返回 prev 不是 curr\n}\n\n// 递归版：O(n) 时间 O(n) 栈空间\npublic ListNode reverseListRec(ListNode head) {\n    if (head == null || head.next == null) return head;\n    ListNode newHead = reverseListRec(head.next); // 子问题已反转\n    head.next.next = head; // 后继指回自己\n    head.next = null;      // 断开原指向，防成环\n    return newHead;\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">反转链表三指针流转：暂存 → 掉头 → 前进</text>\n<rect x=\"40\" y=\"60\" width=\"110\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"95\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">prev=null</text>\n<text x=\"95\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">初始</text>\n<rect x=\"220\" y=\"60\" width=\"90\" height=\"44\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"265\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">curr</text>\n<text x=\"265\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">A 节点</text>\n<rect x=\"400\" y=\"60\" width=\"90\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"445\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next</text>\n<text x=\"445\" y=\"96\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">B 节点</text>\n<line x1=\"310\" y1=\"82\" x2=\"398\" y2=\"82\" stroke=\"var(--lv1)\" stroke-width=\"2\" marker-end=\"url(#b1)\"/>\n<line x1=\"150\" y1=\"82\" x2=\"218\" y2=\"82\" stroke=\"var(--muted)\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/>\n<text x=\"185\" y=\"76\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">null</text>\n<defs><marker id=\"b1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv1)\"/></marker></defs>\n<text x=\"320\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">核心三步（顺序不能反）</text>\n<rect x=\"60\" y=\"170\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"145\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">① 暂存 next</text>\n<text x=\"145\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">next = curr.next</text>\n<rect x=\"240\" y=\"170\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"325\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">② 掉头</text>\n<text x=\"325\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">curr.next = prev</text>\n<rect x=\"420\" y=\"170\" width=\"170\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"505\" y=\"192\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">③ 前进</text>\n<text x=\"505\" y=\"212\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">prev=curr, curr=next</text>\n<text x=\"320\" y=\"260\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">高频坑：不暂存 next 就掉头 → 链断丢数据；返回 curr（null）而不是 prev</text>\n<text x=\"320\" y=\"284\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Netty Pipeline 双向链表、LRU 双向链表 = 反转链表的进阶版</text>\n</svg>",
    "caption": "图：反转链表三指针流程，'先暂存后掉头'的顺序是灵魂"
   },
   {
    "t": "h",
    "text": "判环与找环入口：Floyd 快慢指针"
   },
   {
    "t": "p",
    "text": "判环用快慢指针：slow 每次走一步，fast 每次走两步，如果链表有环，两个指针必然在环内相遇（没环则 fast 先到 null）。找环入口需要一点数学：设头到环入口距离 a，相遇点距环入口 b，慢指针在环内走了 b，快指针走了 2(a+b)，快指针比慢指针多走的部分正好是环长整数倍。结论：相遇后让一个指针回到头，两个指针同速走，再相遇点就是环入口。这个'回头部同速走'的结论面试必考，要能说出为什么。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Floyd 判环 + 找环入口\npublic ListNode detectCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) {         // 相遇说明有环\n            slow = head;            // 一个回头部，同速走\n            while (slow != fast) {\n                slow = slow.next;\n                fast = fast.next;\n            }\n            return slow;            // 再相遇即环入口\n        }\n    }\n    return null;                    // 无环\n}"
   },
   {
    "t": "h",
    "text": "兄弟题型串讲 + 哑节点技巧"
   },
   {
    "t": "list",
    "items": [
     "找链表中点/倒数第 K 个：快慢指针，快指针先走 K 步（倒数第 K）或两倍速（中点）",
     "合并两个有序链表：哑节点 dummy 当头，双指针比较，谁小接谁，和归并排序合并段同款",
     "回文链表：快慢找中点 + 反转后半段 + 逐位比对，空间 O(1)",
     "哑节点（dummy head）技巧：在头部不确定的场景（合并、删除头节点）加一个虚拟头，统一边界，代码量减半",
     "手写 LRU：HashMap 定位 + 双向链表维护顺序，Node 必须存 key 才能淘汰时反查删 Map 项"
    ]
   },
   {
    "t": "pits",
    "items": [
     "不暂存 next 就掉头：这是链表题第一坑，先保住后继再动当前指针",
     "返回 curr 而不是 prev：循环结束时 curr 是 null，必须返回 prev",
     "判环快慢指针：快指针要判断 fast 和 fast.next 都不为 null，否则 NPE",
     "循环条件写错：while (curr != null) 与 while (curr.next != null) 语义不同，删除场景常用后者",
     "递归反转深度：链表几万节点可能 StackOverflowError（默认栈约 1M），游戏服热路径用迭代版",
     "LRU 淘汰尾节点忘记从 Map 删 key、Node 漏存 key：见 algorithm-02"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：链表题 = 画图 + 先暂存后操作 + 边界用例。反转、判环、合并、LRU 四件套都要手写流畅。游戏联系：Netty Pipeline、LRU 会话缓存、延迟队列都是链表。关联题库：algorithm-02（LRU）、algorithm-05（反转链表）。"
   }
  ]
 },
 {
  "id": "algorithm-stack-queue",
  "title": "栈与队列",
  "layer": 1,
  "depends": [
   "algorithm-array-two-pointer"
  ],
  "covers": [
   "algorithm-06"
  ],
  "quiz": [
   "algorithm-06"
  ],
  "body": [
   {
    "t": "lead",
    "text": "栈是'后进先出'的嵌套/回退结构，队列是'先进先出'的排队/缓冲结构。两者语义不同，却能在手写题里互相变来变去——两栈实现队列、单调栈、单调队列，是笔试上机的高频组合拳。"
   },
   {
    "t": "pre",
    "items": [
     "理解 LIFO 与 FIFO 的语义区别",
     "会画数组/链表的基本结构",
     "能分析均摊复杂度（见复杂度篇）"
    ]
   },
   {
    "t": "h",
    "text": "什么时候用栈，什么时候用队列"
   },
   {
    "t": "list",
    "items": [
     "栈的典型场景：括号匹配、表达式求值、函数调用栈、递归改迭代、单调栈（下一个更大元素）、浏览器前进后退",
     "队列的典型场景：BFS 层序遍历、消息缓冲、线程池任务队列、生产者消费者、登录排队系统",
     "游戏服例子：技能连招嵌套状态回退用栈，开服登录排队用队列，Disruptor 的 RingBuffer 本质是环形队列"
    ]
   },
   {
    "t": "p",
    "text": "判断用栈还是队列，关键看'最近优先还是最早优先'。括号匹配为什么天然用栈：括号是严格嵌套结构，最内层（最近）的左括号必须最先被匹配，天然 LIFO。登录排队为什么用队列：先来先服务，先排队的先进游戏，天然 FIFO。一句话：'嵌套/回退 → 栈；排队/缓冲 → 队列'。"
   },
   {
    "t": "h",
    "text": "两栈实现队列：懒惰倒栈"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 两栈实现队列：in 负责入队，out 负责出队\npublic class MyQueue {\n    private final Deque<Integer> in = new ArrayDeque<>();\n    private final Deque<Integer> out = new ArrayDeque<>();\n\n    public void push(int x) { in.push(x); }   // 入队直接进 in\n\n    public int pop() {\n        if (out.isEmpty()) drain();           // 关键：out 空才倒\n        return out.pop();\n    }\n    public int peek() {\n        if (out.isEmpty()) drain();\n        return out.peek();\n    }\n    private void drain() {\n        while (!in.isEmpty()) out.push(in.pop()); // 懒惰倒栈\n    }\n}\n// 均摊 O(1)：每个元素进 in、出 in、进 out、出 out 各一次，共 4 次\n// 坑：每次 pop 都 drain() 会退化 O(n)"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">两栈实现队列：in 入队，out 出队，out 空才倒</text>\n<rect x=\"60\" y=\"60\" width=\"150\" height=\"120\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"135\" y=\"82\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">in 栈（入队）</text>\n<rect x=\"90\" y=\"100\" width=\"90\" height=\"30\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"135\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">3</text>\n<rect x=\"90\" y=\"134\" width=\"90\" height=\"30\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"135\" y=\"154\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">2</text>\n<rect x=\"90\" y=\"168\" width=\"90\" height=\"30\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"135\" y=\"188\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">1</text>\n<rect x=\"330\" y=\"60\" width=\"150\" height=\"120\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"405\" y=\"82\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">out 栈（出队）</text>\n<text x=\"405\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">（空时先从 in 整体倒入）</text>\n<line x1=\"210\" y1=\"120\" x2=\"328\" y2=\"120\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#q1)\"/>\n<defs><marker id=\"q1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"270\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">倒入</text>\n<text x=\"320\" y=\"215\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">出队顺序：1 → 2 → 3（FIFO），与入队顺序一致</text>\n<text x=\"320\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">均摊 O(1)：每个元素进出各一次共 4 次操作摊薄</text>\n<text x=\"320\" y=\"264\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv3)\">坑：每次 pop 都倒栈 → 退化成 O(n)，'懒惰倒栈'才是正解</text>\n<text x=\"320\" y=\"288\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏场景：登录排队、消息缓冲、任务队列都是 FIFO</text>\n</svg>",
    "caption": "图：两栈实现队列，倒栈只在 out 为空时发生"
   },
   {
    "t": "h",
    "text": "单调栈：下一个更大元素"
   },
   {
    "t": "p",
    "text": "单调栈解决一类问题：'每个元素右侧第一个比它大（或小）的元素'。维护一个递减栈，遍历数组，新元素比栈顶大时，栈顶出栈并记录答案（新元素就是它右侧第一个更大的），然后把新元素入栈。每个元素进栈出栈各一次，O(n)。模板口诀：'新大弹栈记答案，随后新元素入栈'。游戏场景：技能伤害曲线里找'下一个更强技能'、副本掉落里找'下一个更高级装备'。和单调队列（滑动窗口最大值）区分开：单调栈是'单向找下一个'，单调队列是'窗口内动态取极值'。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 单调栈模板：每个元素右侧第一个更大值\n// 维护递减栈（栈顶最小），新元素弹掉所有更小的栈顶\npublic int[] nextGreater(int[] nums) {\n    int n = nums.length;\n    int[] res = new int[n];\n    Arrays.fill(res, -1);\n    Deque<Integer> stack = new ArrayDeque<>(); // 存下标\n    for (int i = 0; i < n; i++) {\n        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {\n            res[stack.pop()] = nums[i];  // 栈顶的答案就是 nums[i]\n        }\n        stack.push(i);\n    }\n    return res;\n}\n// O(n)：每个元素进栈出栈各一次\n// 游戏场景：装备强化序列中，每个等级'下一个更强等级'的暴击加成"
   },
   {
    "t": "h",
    "text": "单调队列与循环队列"
   },
   {
    "t": "p",
    "text": "单调队列用于'滑动窗口内的最大值/最小值'：维护双端队列，队头是当前窗口极值，新元素入队时从队尾弹出所有比它小（求最大时）的元素，队头过期（下标滑出窗口）就出队。复杂度 O(n)。游戏场景：开服在线人数曲线里看'最近 10 分钟峰值'。循环队列用数组实现，用 (rear + 1) % capacity == front 判满、rear == front 判空（牺牲一格），或额外维护 size 计数。Disruptor 的 RingBuffer 就是高性能无锁环形队列的巅峰。"
   },
   {
    "t": "pits",
    "items": [
     "两栈实现队列每次都倒栈：退化成 O(n)，必须 out 空才倒，均摊 O(1) 要能现场论证",
     "单调栈存下标不是存值：单调队列同理，判过期需要下标",
     "单调栈内层 while 用 < 还是 <=：找'第一个大于'用严格递减栈（弹出 <= 栈顶的），要求相等不相邻时用 <，写前先确认题意",
     "循环队列判满公式记错：(rear + 1) % capacity == front，下标从 0 开始",
     "Deque 的 push/pop 是栈语义（操作头部），offer/poll 是队列语义（尾进头出），别用混",
     "栈空时 pop 抛异常：手写时用 isEmpty 判断或返回 -1/null"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：栈管嵌套回退、队列管排队缓冲；两栈实现队列靠懒惰倒栈；单调栈/单调队列把 O(n²) 暴力压到 O(n)。游戏落地：技能嵌套、登录排队、在线峰值窗口、RingBuffer。关联题库：algorithm-06。"
   }
  ]
 },
 {
  "id": "algorithm-hash-string",
  "title": "哈希与字符串",
  "layer": 1,
  "depends": [
   "algorithm-array-two-pointer"
  ],
  "covers": [
   "algorithm-07"
  ],
  "quiz": [
   "algorithm-07"
  ],
  "body": [
   {
    "t": "lead",
    "text": "哈希表用空间换时间，把查找/计数/去重从 O(n) 降到均摊 O(1)。它是无数算法题的'总开关'：两数之和、频率统计、组合 key 去重、敏感词集合、Bitmap/布隆过滤器的思想源头。字符串则是一大票笔试题的载体：判重、前缀、匹配、编辑距离。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 HashMap 的 get/put/containsKey 基础用法",
     "理解哈希冲突与扩容的代价（见复杂度篇均摊分析）",
     "会 Java 字符串基本操作：charAt、substring、StringBuilder"
    ]
   },
   {
    "t": "h",
    "text": "哈希三招：存出现、存位置、存计数"
   },
   {
    "t": "p",
    "text": "面试官考哈希，核心就是这三招。第一招存出现（Set 去重/判重）：判断道具是否已领取、玩家是否已签到，Set 一查便知。第二招存位置（Map 存下标）：两数之和里存 num -> index，滑动窗口里存字符最后出现位置。第三招存计数（Map 做频率统计）：统计在线玩家分属多少工会 Map<guildId, count>，统计副本掉落各稀有度数量。能脱口而出这三招，哈希题基本就通了。"
   },
   {
    "t": "h",
    "text": "两数之和：先查后存"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 两数之和：一次遍历，先查后存（O(n) 时间 O(n) 空间）\npublic int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> pos = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int need = target - nums[i];\n        if (pos.containsKey(need)) {          // 先查：搭档是否已在等\n            return new int[]{pos.get(need), i};\n        }\n        pos.put(nums[i], i);                  // 后存：把自己登记进去\n    }\n    return new int[]{-1, -1};\n}\n// 关键细节：先查后存，避免同一元素被自己匹配\n// 例：target=6, nums[0]=3，若先存后查会匹配到自身\n\n// 游戏场景：两名玩家组队战力恰好达到活动门槛"
   },
   {
    "t": "p",
    "text": "两数之和有个高频坑：必须先查后存。如果先把当前元素存进 Map 再查，当 target = 2 * num 时（如 target=6、num=3），会匹配到同一个元素自己，返回两个相同的下标。笔试写完一定要主动说'先查后存'，这是面试官判断你是否真懂哈希细节的点。有序数组版的两数之和可以用对撞双指针 O(1) 空间，这是 follow-up 常问的。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">HashMap 结构：数组 + 链表/红黑树 + 哈希冲突链地址法</text>\n<rect x=\"40\" y=\"60\" width=\"120\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"100\" y=\"86\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">table[0]</text>\n<rect x=\"40\" y=\"112\" width=\"120\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"100\" y=\"138\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">table[1]</text>\n<rect x=\"40\" y=\"164\" width=\"120\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"100\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">table[2]</text>\n<rect x=\"40\" y=\"216\" width=\"120\" height=\"44\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"100\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">table[3]</text>\n<rect x=\"180\" y=\"164\" width=\"64\" height=\"30\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"212\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text>\n<rect x=\"260\" y=\"164\" width=\"64\" height=\"30\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"292\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text>\n<rect x=\"340\" y=\"164\" width=\"64\" height=\"30\" rx=\"5\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"372\" y=\"184\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">C</text>\n<text x=\"160\" y=\"186\" font-size=\"12\" fill=\"var(--accent)\">→</text>\n<text x=\"240\" y=\"186\" font-size=\"12\" fill=\"var(--accent)\">→</text>\n<text x=\"320\" y=\"186\" font-size=\"12\" fill=\"var(--lv3)\">→</text>\n<line x1=\"160\" y1=\"186\" x2=\"178\" y2=\"186\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<line x1=\"244\" y1=\"186\" x2=\"258\" y2=\"186\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<line x1=\"324\" y1=\"186\" x2=\"338\" y2=\"186\" stroke=\"var(--lv3)\" stroke-width=\"2\"/>\n<text x=\"450\" y=\"100\" font-size=\"13\" fill=\"var(--ink)\">哈希冲突 → 链地址法</text>\n<text x=\"450\" y=\"124\" font-size=\"13\" fill=\"var(--muted)\">桶内链表 O(n) 退化</text>\n<text x=\"450\" y=\"146\" font-size=\"13\" fill=\"var(--muted)\">链表 ≥8 且容量 ≥64 树化 O(logn)</text>\n<text x=\"450\" y=\"168\" font-size=\"13\" fill=\"var(--lv3)\">Java 8：TREEIFY_THRESHOLD=8</text>\n<text x=\"450\" y=\"190\" font-size=\"13\" fill=\"var(--lv3)\">UNTREEIFY_THRESHOLD=6</text>\n<text x=\"450\" y=\"212\" font-size=\"13\" fill=\"var(--lv2)\">扩容 = 容量 ×2，均摊 O(1)</text>\n<text x=\"450\" y=\"234\" font-size=\"13\" fill=\"var(--muted)\">预估容量：size/0.75+1 防多次 rehash</text>\n<text x=\"320\" y=\"292\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--accent)\">三招：存出现(Set) / 存位置(Map) / 存计数(Map 频率)</text>\n</svg>",
    "caption": "图：HashMap 数组+链表（红黑树）结构，三招套路总纲"
   },
   {
    "t": "h",
    "text": "异或技巧与组合 key"
   },
   {
    "t": "p",
    "text": "异或 ^ 是位运算里最适合装点门面的技巧：a ^ a = 0、a ^ 0 = a、异或满足交换律结合律。经典题'数组中只出现一次的数'（其余都出现两次），全数组异或一遍就是答案。'找两个只出现一次的数'：先全体异或得到 x ^ y，再按某一位 1 分组分别异或。组合 key 设计是游戏工程高频点：playerId + activityId 去重，别用字符串拼接（12 拼 3 和 1 拼 23 撞车），用位运算合成 long（playerId 左移 32 位 | activityId）或小对象重写 equals/hashCode。"
   },
   {
    "t": "h",
    "text": "Trie 前缀树：字符串家族的树结构"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Trie 前缀树：单词插入与搜索（含前缀匹配）\npublic class Trie {\n    private static class Node {\n        Node[] next = new Node[26]; // 只处理小写字母\n        boolean end;                 // 是否单词结尾\n    }\n    private final Node root = new Node();\n\n    public void insert(String word) {\n        Node cur = root;\n        for (char c : word.toCharArray()) {\n            if (cur.next[c - 'a'] == null) cur.next[c - 'a'] = new Node();\n            cur = cur.next[c - 'a'];\n        }\n        cur.end = true;\n    }\n    public boolean search(String word) {\n        Node cur = find(word);\n        return cur != null && cur.end;   // 必须到结尾才算单词\n    }\n    public boolean startsWith(String prefix) {\n        return find(prefix) != null;      // 有路径即前缀存在\n    }\n    private Node find(String s) {\n        Node cur = root;\n        for (char c : s.toCharArray()) {\n            if (cur.next[c - 'a'] == null) return null;\n            cur = cur.next[c - 'a'];\n        }\n        return cur;\n    }\n}\n// 复杂度：插入/查找 O(单词长度)，空间为字符集大小\n// 游戏场景：敏感词树、协议号前缀路由、装备名/玩家名补全"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">Trie 前缀树：插入 cat, car, dog 三个词</text>\n<circle cx=\"320\" cy=\"70\" r=\"22\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">root</text>\n<circle cx=\"200\" cy=\"140\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"200\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">c</text>\n<circle cx=\"440\" cy=\"140\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"440\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">d</text>\n<line x1=\"300\" y1=\"84\" x2=\"215\" y2=\"126\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"340\" y1=\"84\" x2=\"425\" y2=\"126\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"160\" cy=\"210\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"160\" y=\"215\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">a</text>\n<circle cx=\"250\" cy=\"210\" r=\"20\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"250\" y=\"215\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">t*</text>\n<circle cx=\"360\" cy=\"210\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"360\" y=\"215\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">a</text>\n<circle cx=\"460\" cy=\"210\" r=\"20\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"460\" y=\"215\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">g*</text>\n<line x1=\"188\" y1=\"152\" x2=\"167\" y2=\"194\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"213\" y1=\"152\" x2=\"242\" y2=\"194\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"428\" y1=\"152\" x2=\"368\" y2=\"194\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"453\" y1=\"152\" x2=\"452\" y2=\"194\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"230\" cy=\"260\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"230\" y=\"265\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">r*</text>\n<circle cx=\"330\" cy=\"260\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"330\" y=\"265\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">r*</text>\n<line x1=\"372\" y1=\"222\" x2=\"340\" y2=\"246\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"253\" y1=\"222\" x2=\"238\" y2=\"246\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"120\" y=\"240\" font-size=\"12\" fill=\"var(--muted)\">* = 单词结尾</text>\n<text x=\"540\" y=\"160\" font-size=\"12\" fill=\"var(--muted)\">共享前缀 c 省空间</text>\n<text x=\"540\" y=\"182\" font-size=\"12\" fill=\"var(--muted)\">AC 自动机 = Trie + fail 指针</text>\n<text x=\"540\" y=\"204\" font-size=\"12\" fill=\"var(--muted)\">敏感词过滤工业标准</text>\n<text x=\"540\" y=\"226\" font-size=\"12\" fill=\"var(--muted)\">插入/查找 O(单词长度)</text>\n</svg>",
    "caption": "图：Trie 结构示意，前缀共享；* 表示单词结尾"
   },
   {
    "t": "pits",
    "items": [
     "两数之和先存后查：target=6、num=3 会自匹配，返回两个相同下标",
     "字符串拼接组合 key：'1'+'23' 和 '12'+'3' 撞车，用位运算合成 long 或分隔符加字段校验",
     "HashMap 容量不预估：频繁 rehash 产生毛刺，热路径用 new HashMap<>(expectedSize / 0.75 + 1)",
     "Trie 的 search 和 startsWith 混淆：search 要求 end 标记，startsWith 只要求路径存在",
     "异或技巧只适用于成对出现找单个：'所有数都出现两次找一次'才能全体异或",
     "String 用 += 拼接长字符串：O(n²)，用 StringBuilder（游戏日志/协议组包常踩）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：哈希三招（存出现/存位置/存计数）是套路总纲，两数之和先查后存是细节考点；异或玩位运算门面，Trie 管前缀。游戏落地：工会统计、道具去重、敏感词树、组合 key 防重复领取。关联题库：algorithm-07。"
   }
  ]
 },
 {
  "id": "algorithm-binary-tree",
  "title": "二叉树",
  "layer": 1,
  "depends": [
   "algorithm-stack-queue"
  ],
  "covers": [
   "algorithm-14"
  ],
  "quiz": [
   "algorithm-14"
  ],
  "body": [
   {
    "t": "lead",
    "text": "二叉树是'一切树结构的基本功'：遍历四件套、BST 的身份证性质、最近公共祖先、序列化、平衡树思想。笔试手写二叉树，考的是递归转迭代的思维和边界严谨性，不是默写模板。"
   },
   {
    "t": "pre",
    "items": [
     "会用递归（见复杂度篇递归与分治）",
     "会用栈模拟递归栈、用队列做 BFS（见栈队列篇）",
     "理解树的高度/深度/节点概念"
    ]
   },
   {
    "t": "h",
    "text": "遍历四件套：递归三行，迭代是考点"
   },
   {
    "t": "p",
    "text": "递归版前中后序遍历是'三十秒默写'的基本功：判空返回、按'根左右/左根右/左右根'访问。迭代版才是面试重头——本质是用栈模拟递归栈。前序迭代：压右再压左（栈是 LIFO，先出左）。中序迭代有口诀：'curr 不空就压栈往左走，空了弹出访问并右拐'。后序迭代最繁琐：要区分第几次遇到该节点，常用技巧是记录 lastVisit 判断右子树是否访问完，或用'根右左'遍历后逆序。层序用队列 BFS，每层用 size 记录当前层节点数实现分层输出。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 递归前序（三行），中序/后序只是换行序\npublic void preorder(TreeNode root) {\n    if (root == null) return;\n    visit(root);\n    preorder(root.left);\n    preorder(root.right);\n}\n\n// 中序迭代：压栈向左到底，弹出访问，右拐\npublic void inorder(TreeNode root) {\n    Deque<TreeNode> stack = new ArrayDeque<>();\n    TreeNode cur = root;\n    while (cur != null || !stack.isEmpty()) {\n        while (cur != null) {        // 一路向左压栈\n            stack.push(cur);\n            cur = cur.left;\n        }\n        cur = stack.pop();           // 弹出访问\n        visit(cur);\n        cur = cur.right;             // 右拐\n    }\n}\n\n// 层序 BFS：队列 + size 分层\npublic void levelOrder(TreeNode root) {\n    if (root == null) return;\n    Deque<TreeNode> q = new ArrayDeque<>();\n    q.offer(root);\n    while (!q.isEmpty()) {\n        int size = q.size();         // 当前层节点数\n        for (int i = 0; i < size; i++) {\n            TreeNode node = q.poll();\n            visit(node);\n            if (node.left != null) q.offer(node.left);\n            if (node.right != null) q.offer(node.right);\n        }\n        // 到这里一层结束，可打印分隔符\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">二叉树遍历顺序：前序 根左右 / 中序 左根右 / 后序 左右根</text>\n<circle cx=\"320\" cy=\"70\" r=\"26\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"75\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\">1</text>\n<line x1=\"300\" y1=\"88\" x2=\"220\" y2=\"140\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"340\" y1=\"88\" x2=\"420\" y2=\"140\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"200\" cy=\"160\" r=\"24\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"200\" y=\"165\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\">2</text>\n<circle cx=\"440\" cy=\"160\" r=\"24\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"440\" y=\"165\" text-anchor=\"middle\" font-size=\"14\" fill=\"var(--ink)\">3</text>\n<line x1=\"186\" y1=\"178\" x2=\"150\" y2=\"228\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"215\" y1=\"178\" x2=\"250\" y2=\"228\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"132\" cy=\"246\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"132\" y=\"251\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">4</text>\n<circle cx=\"268\" cy=\"246\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"268\" y=\"251\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">5</text>\n<line x1=\"426\" y1=\"178\" x2=\"392\" y2=\"228\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"454\" y1=\"178\" x2=\"488\" y2=\"228\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"374\" cy=\"246\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"374\" y=\"251\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">6</text>\n<circle cx=\"506\" cy=\"246\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"506\" y=\"251\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">7</text>\n<text x=\"565\" y=\"90\" font-size=\"13\" fill=\"var(--accent)\">前序:1 2 4 5 3 6 7</text>\n<text x=\"565\" y=\"114\" font-size=\"13\" fill=\"var(--lv2)\">中序:4 2 5 1 6 3 7</text>\n<text x=\"565\" y=\"138\" font-size=\"13\" fill=\"var(--lv3)\">后序:4 5 2 6 7 3 1</text>\n<text x=\"565\" y=\"162\" font-size=\"13\" fill=\"var(--muted)\">层序:1 2 3 4 5 6 7</text>\n<text x=\"320\" y=\"300\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BST 中序 = 升序序列，这是 BST 的身份证性质</text>\n</svg>",
    "caption": "图：二叉树四种遍历顺序，中序+BST 是核心性质"
   },
   {
    "t": "h",
    "text": "BST 操作与中序升序性质"
   },
   {
    "t": "p",
    "text": "二叉搜索树（BST）：左子树所有节点小于根，右子树所有节点大于根。中序遍历 BST 得到升序序列——这是它的身份证性质。应用：TreeMap/TreeSet 的有序遍历、校验一棵树是不是 BST（中序遍历验证严格递增，不能只比相邻节点，因为左子树深层可能藏着大于根的节点）、找第 K 小（中序数到第 K 个）。BST 的查找/插入平均 O(logn)，但退化成链时是 O(n)——所以才有 AVL/红黑树这些平衡树，把树高控制在 O(logn)。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 校验 BST：中序遍历严格递增（只比相邻孩子会漏深层违规）\nlong prev = Long.MIN_VALUE;\npublic boolean isValidBST(TreeNode root) {\n    return inOrder(root);\n}\nprivate boolean inOrder(TreeNode node) {\n    if (node == null) return true;\n    if (!inOrder(node.left)) return false;\n    if (node.val <= prev) return false;  // 必须严格递增\n    prev = node.val;\n    return inOrder(node.right);\n}\n\n// 递归版带 min/max 边界，思路等价\npublic boolean isValidBST2(TreeNode root) {\n    return check(root, Long.MIN_VALUE, Long.MAX_VALUE);\n}\nprivate boolean check(TreeNode node, long lo, long hi) {\n    if (node == null) return true;\n    if (node.val <= lo || node.val >= hi) return false;\n    return check(node.left, lo, node.val) && check(node.right, node.val, hi);\n}"
   },
   {
    "t": "h",
    "text": "最近公共祖先、路径和、序列化、平衡树"
   },
   {
    "t": "list",
    "items": [
     "最近公共祖先 LCA：递归，左右子树各找到一个即当前节点是 LCA；BST 版可利用大小关系 O(logn)",
     "路径和：根到叶子累加，DFS 带当前和，游戏场景=技能树路径、剧情章节解锁条件",
     "序列化/反序列化：前序 + 空标记（'#'）最常用，层序也能做；游戏场景=技能树/天赋树存档",
     "最大深度：DFS 一行 max(左,右)+1；直径 = 左右深度之和最大",
     "镜像翻转：递归交换左右孩子",
     "平衡树概念：AVL 严格平衡（高差≤1）、红黑树近似平衡（最长≤最短 2 倍），工程用后者（HashMap 树化、TreeMap、epoll）",
     "Morris 遍历：O(1) 空间，用空闲右指针做线索，代价是遍历中临时改树、代码难懂，面试说清原理即可"
    ]
   },
   {
    "t": "pits",
    "items": [
     "判 BST 只比相邻节点：左子树深层藏着大于根的节点会被漏掉，必须中序严格递增或 min/max 边界收紧",
     "层序 BFS 忘了 size：不分层输出就退化成普通 BFS，打印不出层级",
     "递归不判空：每层递归入口先判 null，NPE 是二叉树手写第一坑",
     "后序迭代的 lastVisit 逻辑混淆：右子树访问完的标志是刚访问的是右孩子",
     "序列化空节点漏标记：不标记 null 就无法唯一重建二叉树",
     "BST 删除节点三种情况：无孩子直接删、单孩子接上、双孩子用后继（或前驱）替换",
     "LCA 递归写错：要在左右都探索完才知道当前节点是不是 LCA，不是提前返回"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：遍历四件套（递归三行 + 迭代模拟栈 + 层序 BFS）是基本功，BST 中序升序是身份证性质，LCA/序列化/平衡树思想是进阶。游戏落地：技能树、天赋树存档、剧情解锁路径。关联题库：algorithm-14。"
   }
  ]
 },
 {
  "id": "algorithm-sort-search",
  "title": "排序与查找",
  "layer": 2,
  "depends": [
   "algorithm-complexity"
  ],
  "covers": [
   "algorithm-03",
   "algorithm-04",
   "algorithm-11"
  ],
  "quiz": [
   "algorithm-03",
   "algorithm-04",
   "algorithm-11"
  ],
  "body": [
   {
    "t": "lead",
    "text": "排序是算法题的'预处理开关'，查找是'边界控制验收场'。快排/归并/堆排三巨头 + 二分查找及其变体 + TopK 三板斧，是笔试上机出现频率最高的组合，游戏排行榜、经验表查等级、全服 TopK 全是它们的直接落地。"
   },
   {
    "t": "pre",
    "items": [
     "理解分治思想（见复杂度篇）",
     "会分析时间复杂度与空间复杂度",
     "理解'稳定性'：相等元素排序后相对顺序是否保持"
    ]
   },
   {
    "t": "h",
    "text": "排序三巨头：原理、复杂度、稳定性"
   },
   {
    "t": "table",
    "head": [
     "算法",
     "原理",
     "时间",
     "空间",
     "稳定",
     "工程地位"
    ],
    "rows": [
     [
      "快排",
      "选 pivot 原地分区，递归左右",
      "平均 O(nlogn) 最坏 O(n²)",
      "O(logn) 栈",
      "不稳定",
      "工程之王：缓存友好、原地，JDK 基本类型用双轴快排"
     ],
     [
      "归并",
      "拆到单元素，两两合并有序段",
      "O(nlogn) 稳定",
      "O(n) 辅助",
      "稳定",
      "JDK 对象排序 TimSort 基础，外部排序核心"
     ],
     [
      "堆排",
      "建堆 + 反复取堆顶",
      "O(nlogn)",
      "O(1)",
      "不稳定",
      "TopK/优先队列，缓存不友好用得少"
     ]
    ]
   },
   {
    "t": "p",
    "text": "快排为什么是工程之王：原地分区顺序访问内存，CPU 缓存命中率高，常数因子远小于归并（归并每次合并要开临时数组、缓存不友好）。最坏 O(n²) 靠随机 pivot 或三数取中规避。归并的优势是稳定 + 复杂度有保证，是外部排序（磁盘大文件）的基础。JDK 的排序实现值得背熟：基本类型 Arrays.sort 用双轴快排 DualPivotQuicksort（不需要稳定性），对象类型用 TimSort（归并改良，保证稳定性、利用数据已有有序性）——这是面试高频问点，已验证。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 快排：分区 + 递归（随机 pivot 防最坏）\npublic void quickSort(int[] a, int l, int r) {\n    if (l >= r) return;\n    int p = partition(a, l, r);\n    quickSort(a, l, p - 1);\n    quickSort(a, p + 1, r);\n}\nprivate int partition(int[] a, int l, int r) {\n    int pivot = a[l];\n    int i = l, j = r;\n    while (i < j) {\n        while (i < j && a[j] >= pivot) j--;\n        a[i] = a[j];\n        while (i < j && a[i] <= pivot) i++;\n        a[i] = a[j];\n    }\n    a[i] = pivot;\n    return i;\n}\n\n// 稳定性业务意义：排行榜'同分先到排前'\n// 若先按时间排、再用稳定排序按分数排，同分保持时间序\n// 若排序不稳定，就合成复合 key：score * 100000 + timestamp"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">快排分区：选 pivot，小的在左大的在右，递归两侧</text>\n<rect x=\"30\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"60\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">5</text>\n<rect x=\"94\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"124\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">2</text>\n<rect x=\"158\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"188\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">8</text>\n<rect x=\"222\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/>\n<text x=\"252\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">4</text>\n<rect x=\"286\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"316\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">9</text>\n<rect x=\"350\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"380\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">1</text>\n<rect x=\"414\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"444\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">7</text>\n<rect x=\"478\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"508\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">3</text>\n<rect x=\"542\" y=\"60\" width=\"60\" height=\"40\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"572\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">6</text>\n<text x=\"252\" y=\"48\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">pivot=4</text>\n<line x1=\"222\" y1=\"108\" x2=\"222\" y2=\"140\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<line x1=\"282\" y1=\"108\" x2=\"282\" y2=\"140\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<rect x=\"30\" y=\"150\" width=\"188\" height=\"40\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"124\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">小于 4：2 1 3</text>\n<rect x=\"252\" y=\"150\" width=\"56\" height=\"40\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/>\n<text x=\"280\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">4</text>\n<rect x=\"342\" y=\"150\" width=\"248\" height=\"40\" rx=\"5\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"466\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">大于 4：5 8 9 7 6</text>\n<text x=\"320\" y=\"225\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">递归处理左右两段，每段再选 pivot 分区 → 平均 O(nlogn)</text>\n<text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">最坏 O(n²)：每次 pivot 是极值（有序数组选首元素）→ 随机 pivot / 三数取中规避</text>\n<text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--lv2)\">JDK：基本类型双轴快排（不稳），对象 TimSort（稳定，归并改良）</text>\n<text x=\"320\" y=\"298\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">稳定性业务：排行榜同分先到排前</text>\n</svg>",
    "caption": "图：快排一次分区过程，pivot 归位后递归两侧"
   },
   {
    "t": "h",
    "text": "二分查找：难点在边界"
   },
   {
    "t": "p",
    "text": "二分的思想一句话：'谁可能是答案，区间就保留谁'。标准版闭区间 [left, right]：while (left <= right)，mid = left + (right - left) / 2 防溢出，目标小于 mid 则 right = mid - 1，大于则 left = mid + 1，相等返回。变体'第一个 ≥ target 的位置'（lower_bound）：while (left < right)，nums[mid] >= target 则 right = mid（mid 可能是答案，区间不能丢），否则 left = mid + 1（mid 一定不是）。区间定义全程一致是防死循环的关键。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 标准版二分：闭区间\npublic int binarySearch(int[] nums, int target) {\n    int left = 0, right = nums.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;  // 防溢出\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\n// 变体：第一个 >= target 的位置（lower_bound）\n// 游戏场景：排行榜'我的分数排多少名'→ 降序数组找第一个 <= 我的分数\npublic int lowerBound(int[] nums, int target) {\n    int left = 0, right = nums.length;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] >= target) right = mid; // mid 可能是答案，保留\n        else left = mid + 1;                  // mid 一定不是\n    }\n    return left;\n}\n// upper_bound（第一个 > target）：>= 改 > 即可\n// 出现次数 = upper_bound - lower_bound"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">lower_bound：找第一个 >= 5 的位置</text>\n<rect x=\"40\" y=\"60\" width=\"70\" height=\"44\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"75\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">1</text>\n<rect x=\"115\" y=\"60\" width=\"70\" height=\"44\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"150\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">3</text>\n<rect x=\"190\" y=\"60\" width=\"70\" height=\"44\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"225\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">5</text>\n<rect x=\"265\" y=\"60\" width=\"70\" height=\"44\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/>\n<text x=\"300\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">5</text>\n<rect x=\"340\" y=\"60\" width=\"70\" height=\"44\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"375\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">7</text>\n<rect x=\"415\" y=\"60\" width=\"70\" height=\"44\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"450\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">9</text>\n<rect x=\"490\" y=\"60\" width=\"70\" height=\"44\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"525\" y=\"87\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">11</text>\n<line x1=\"265\" y1=\"112\" x2=\"265\" y2=\"150\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/>\n<line x1=\"332\" y1=\"112\" x2=\"332\" y2=\"150\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/>\n<rect x=\"265\" y=\"158\" width=\"70\" height=\"34\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"300\" y=\"180\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">答案</text>\n<text x=\"320\" y=\"225\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">口诀：nums[mid] >= target 则 right = mid（保留），否则 left = mid + 1（丢弃）</text>\n<text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">'谁可能是答案，区间就保留谁'——与标准版 right = mid - 1 的本质区别</text>\n<text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">二分答案升级：答案单调可判定就能对答案空间二分（最小容量装道具/最长活动周期）</text>\n</svg>",
    "caption": "图：lower_bound 边界控制，保留可能是答案的半边"
   },
   {
    "t": "h",
    "text": "TopK 三板斧"
   },
   {
    "t": "p",
    "text": "TopK 求第 K 大/最大的 K 个，三方案按场景选。方案一全量排序 O(nlogn)：数据量小、一次性的场景。方案二大小为 K 的小顶堆 O(nlogK)：堆顶是'第 K 名守门员'，新元素比堆顶大就替换调整——流式更新场景首选，空间 O(K)。方案三快速选择 O(n) 平均：快排 partition 后只递归含第 K 大的一半，适合离线、可改原数组。为什么用小顶堆不用大顶堆：小顶堆堆顶是最小元素即'守门员'，新元素赢了它才能进榜；大顶堆堆顶是最大值，无法判断新元素是否够格。游戏真实场景：实时排行榜用 ZSet（跳表 O(logn) 原地更新），离线跨服海选用分片 + 堆汇总，'知道什么时候不用手写算法'是更高段位。"
   },
   {
    "t": "pits",
    "items": [
     "快排最坏 O(n²) 不提规避：要主动说随机 pivot / 三数取中",
     "稳定性说混：快排堆排不稳定，归并插入冒泡稳定；JDK 基本类型双轴快排、对象 TimSort 是送分点",
     "二分 mid 用 (left+right)/2：可能溢出 int，必须 left + (right-left)/2",
     "lower_bound 条件写反：>= 时 right = mid（保留），不是 mid-1，否则把答案丢出区间",
     "二分区间定义中途切换：闭区间和左闭右开全程只能用一种，混用必死循环",
     "TopK 大小顶堆用反：求第 K 大用小顶堆，堆顶守门员；大顶堆是求第 K 小",
     "二分写完不过边界用例：空数组、单元素、目标不存在、全相同，主动过一遍",
     "计数排序识别：值域远小于数据量（等级 1~200、一亿玩家）用计数排序 O(n)"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：排序三巨头（快排/归并/堆排）记住原理复杂度稳定性 + JDK 实现；二分记'保留可能是答案的半边'；TopK 按场景选小顶堆/快选/排序。游戏落地：排行榜、经验表查等级、全服 Top100。关联题库：algorithm-03、algorithm-04、algorithm-11。"
   }
  ]
 },
 {
  "id": "algorithm-graph-basics",
  "title": "图论基础",
  "layer": 2,
  "depends": [
   "algorithm-stack-queue"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "图论是游戏服务器最'硬'的算法域：地图寻路、技能/任务依赖、工会社交网络、跨服匹配、AI 视野，全是图。BFS/DFS、拓扑排序、最短路径、并查集、最小生成树，一套组合拳打遍笔试上机图论题。"
   },
   {
    "t": "pre",
    "items": [
     "会用队列做 BFS、用栈/递归做 DFS（见栈队列篇、二叉树篇）",
     "理解邻接表与邻接矩阵两种存储",
     "掌握复杂度分析"
    ]
   },
   {
    "t": "h",
    "text": "图存储：邻接矩阵 vs 邻接表"
   },
   {
    "t": "table",
    "head": [
     "维度",
     "邻接矩阵",
     "邻接表"
    ],
    "rows": [
     [
      "结构",
      "N×N 二维数组，edge[i][j]=权",
      "数组/Map：顶点 → 邻居列表"
     ],
     [
      "空间",
      "O(V²)，顶点多就爆",
      "O(V+E)，稀疏图友好"
     ],
     [
      "查询 i-j 边",
      "O(1) 直接取",
      "O(度)，要遍历邻居"
     ],
     [
      "遍历全图",
      "O(V²)",
      "O(V+E)"
     ],
     [
      "适用",
      "稠密图、顶点少（如状态转移）",
      "稀疏图（游戏地图几乎都是）"
     ]
    ]
   },
   {
    "t": "p",
    "text": "游戏场景几乎全是稀疏图：一张地图几千个格子，每个格子连四邻，邻接表最合适。邻接矩阵适合顶点少但边密的场景，如技能状态机（N 个状态之间的转移表）。Java 里邻接表常用 List<int[]>[] 存 (邻居, 权重)，或 Map<Integer, List<Edge>>。笔试手写优先邻接表，内存和遍历都占优。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 邻接表建图（带权有向/无向图）\nList<int[]>[] graph = new List[n];\nfor (int i = 0; i < n; i++) graph[i] = new ArrayList<>();\n// 有向边 u -> v，权重 w\n// graph[u].add(new int[]{v, w});\n// 无向图再加反向边：graph[v].add(new int[]{u, w});\n\n// BFS：队列，最短距离（无权图）\nint[] dist = new int[n];\nArrays.fill(dist, -1);\nDeque<Integer> q = new ArrayDeque<>();\ndist[start] = 0;\nq.offer(start);\nwhile (!q.isEmpty()) {\n    int u = q.poll();\n    for (int[] e : graph[u]) {\n        int v = e[0];\n        if (dist[v] == -1) {   // 首次访问即最短\n            dist[v] = dist[u] + 1;\n            q.offer(v);\n        }\n    }\n}\n// 游戏场景：地图格子 BFS 找最近 NPC、技能链跳转最短步数"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">BFS 层序扩散 vs DFS 深度优先</text>\n<circle cx=\"320\" cy=\"70\" r=\"26\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">起点</text>\n<circle cx=\"170\" cy=\"140\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"170\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">1</text>\n<circle cx=\"470\" cy=\"140\" r=\"22\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"470\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">1</text>\n<circle cx=\"80\" cy=\"220\" r=\"20\" fill=\"var(--lv2)\" />\n<text x=\"80\" y=\"225\" text-anchor=\"middle\" font-size=\"13\" fill=\"#fff\">2</text>\n<circle cx=\"230\" cy=\"220\" r=\"20\" fill=\"var(--lv2)\"/>\n<text x=\"230\" y=\"225\" text-anchor=\"middle\" font-size=\"13\" fill=\"#fff\">2</text>\n<circle cx=\"410\" cy=\"220\" r=\"20\" fill=\"var(--lv2)\"/>\n<text x=\"410\" y=\"225\" text-anchor=\"middle\" font-size=\"13\" fill=\"#fff\">2</text>\n<circle cx=\"560\" cy=\"220\" r=\"20\" fill=\"var(--lv2)\"/>\n<text x=\"560\" y=\"225\" text-anchor=\"middle\" font-size=\"13\" fill=\"#fff\">2</text>\n<line x1=\"302\" y1=\"86\" x2=\"182\" y2=\"126\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"338\" y1=\"86\" x2=\"458\" y2=\"126\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"158\" y1=\"152\" x2=\"92\" y2=\"206\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"182\" y1=\"152\" x2=\"222\" y2=\"206\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"458\" y1=\"152\" x2=\"422\" y2=\"206\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"482\" y1=\"152\" x2=\"548\" y2=\"206\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"320\" y=\"265\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">BFS 按层扩散（队列），数字 = 距离起点的最短步数</text>\n<text x=\"320\" y=\"289\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DFS 一条道走到黑再回溯（栈/递归），用于连通性、路径存在性</text>\n<text x=\"320\" y=\"311\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏场景：地图寻路 BFS 找最近目标 / 技能树依赖 DFS 判环</text>\n</svg>",
    "caption": "图：BFS 分层扩散得到最短步数，DFS 深度优先搜索"
   },
   {
    "t": "h",
    "text": "拓扑排序：任务/技能依赖"
   },
   {
    "t": "p",
    "text": "拓扑排序解决'有向无环图（DAG）的线性化'：任务 A 依赖 B，B 必须先做。Kahn 算法：统计每个节点的入度，入度为 0 的入队列，出队时把邻居入度减一，减到 0 再入队。最终如果出队数量小于节点总数，说明图有环——拓扑排序不能完成，这也是判环的另一种方法。游戏场景：技能树解锁顺序、剧情任务链、装备合成路径、构建系统的依赖解析。DFS 也能做拓扑：后序逆序输出。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 拓扑排序 Kahn 算法：统计入度 + 入度 0 队列\npublic int[] topoSort(int n, int[][] edges) {\n    List<Integer>[] g = new List[n];\n    int[] indeg = new int[n];\n    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();\n    for (int[] e : edges) {\n        g[e[0]].add(e[1]);\n        indeg[e[1]]++;\n    }\n    Deque<Integer> q = new ArrayDeque<>();\n    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);\n    int[] res = new int[n];\n    int idx = 0;\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        res[idx++] = u;\n        for (int v : g[u]) {\n            if (--indeg[v] == 0) q.offer(v);\n        }\n    }\n    if (idx < n) return null; // 有环，无法完成\n    return res;\n}\n// 游戏场景：技能树解锁顺序、剧情任务依赖、合成配方拓扑"
   },
   {
    "t": "h",
    "text": "最短路径：Dijkstra / Floyd / Bellman-Ford"
   },
   {
    "t": "list",
    "items": [
     "Dijkstra：非负权单源最短路，贪心 + 优先队列，O((V+E)logV)，每次选当前最近未确定节点，游戏寻路标配（A* 是它的启发式变体）",
     "Floyd：全源最短路，三层循环 dp[k][i][j] = min(dp[k-1][i][j], dp[k-1][i][k]+dp[k-1][k][j])，O(V³)，顶点少用",
     "Bellman-Ford：可处理负权边，V 轮松弛 V×E 次，还能检测负环（第 V 轮仍能松弛即有负环）",
     "SPFA：Bellman-Ford 的队列优化，平均快但最坏 O(VE)，被卡过的都懂",
     "游戏落地：地图寻路 Dijkstra/A*、副本连通性、匹配网络最短跳数"
    ]
   },
   {
    "t": "h",
    "text": "并查集：连通性判断 + 最小生成树"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 并查集：路径压缩 + 按秩合并\npublic class UnionFind {\n    int[] parent, rank;\n    UnionFind(int n) {\n        parent = new int[n];\n        rank = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n    }\n    int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]); // 路径压缩\n        return parent[x];\n    }\n    boolean union(int x, int y) {\n        int rx = find(x), ry = find(y);\n        if (rx == ry) return false;\n        if (rank[rx] < rank[ry]) { int t = rx; rx = ry; ry = t; }\n        parent[ry] = rx;\n        if (rank[rx] == rank[ry]) rank[rx]++;\n        return true;\n    }\n}\n// 复杂度：接近 O(α(n))，α 是反阿克曼函数，可视为常数\n// 游戏场景：工会合并/解散、阵营关系、好友圈连通判断、地图区块连通性\n// 最小生成树：Kruskal 按边权排序 + 并查集连边，避免成环，O(ElogE)"
   },
   {
    "t": "pits",
    "items": [
     "邻接矩阵顶点多爆内存：1 万顶点就是 1 亿条边，游戏地图必须邻接表",
     "BFS 忘记 dist/visited：不加标记会重复入队，稀疏图退化 O(V×E)",
     "拓扑排序输出数小于 n 就是有环：不要只做队列不回判断环",
     "Dijkstra 用在负权边：会出错误答案，负权用 Bellman-Ford",
     "Dijkstra 优先队列重复入队：visited 标记要在出队时确认，同一节点可能被 push 多次",
     "Floyd 三层循环顺序记错：k 必须在外层，否则转移不完整",
     "并查集不路径压缩：find 是 O(n) 退化链，union 前先 find",
     "Kruskal 判环靠并查集 find：union 返回 false 说明已在同一集合，跳过该边"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：图论 = 存储（邻接表）+ 遍历（BFS/DFS）+ 三个专项（拓扑排序、最短路、并查集/MST）。游戏落地：地图寻路、技能树依赖、工会连通、匹配网络。这套是笔试上机图论题的完整武器库。"
   }
  ]
 },
 {
  "id": "algorithm-dp",
  "title": "动态规划",
  "layer": 2,
  "depends": [
   "algorithm-complexity"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "动态规划是'暴力枚举 + 记忆化'的优雅化：把递归里反复计算的子问题结果存下来，从下往上填表。背包、最长子序列、区间 DP、状态压缩、股票系列，一套'五步模板'能通吃 90% 的 DP 题。"
   },
   {
    "t": "pre",
    "items": [
     "理解递归与分治（见复杂度篇）",
     "能写出暴力递归解（回溯思想见下篇）",
     "掌握复杂度分析：状态数 × 单状态转移代价"
    ]
   },
   {
    "t": "h",
    "text": "DP 的本质：重叠子问题 + 最优子结构"
   },
   {
    "t": "p",
    "text": "两个前提缺一不可。重叠子问题：同样的子问题被反复计算，斐波那契的 f(3) 在 f(5) 的递归树里被算了两遍；没有重叠就是分治，不用 DP。最优子结构：问题的最优解包含子问题的最优解，比如最短路径里，A→C 的最短路经过 B，则 A→B 段必然是 A 到 B 的最短路；反例是最长简单路径（NP 问题），因为你不能保证子路径拼接后仍简单。面试判断一个题能不能 DP：先写暴力递归，看递归树里有没有重复节点，有就加记忆化，能递推就转填表。"
   },
   {
    "t": "h",
    "text": "五步模板：定义状态 → 转移 → 初始化 → 遍历顺序 → 答案"
   },
   {
    "t": "list",
    "items": [
     "定义状态：dp[i] 表示什么？要满足'无后效性'——未来只依赖状态值，不依赖过去怎么到达",
     "状态转移：dp[i] 从哪些更小的状态推来？画状态转移图",
     "初始化：dp[0]/dp[i][0] 的边界值，往往就是暴力递归的基线条件",
     "遍历顺序：一维从前往后；二维看依赖方向（背包物品外层容量内层，完全背包要正序）",
     "答案：一般是 dp[n] 或 dp[n][...] 的最大/最小值",
     "复杂度：状态数 × 单状态转移代价，写完主动说"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 0-1 背包：n 件物品，每件重量 w[i]、价值 v[i]，容量 W 内最大价值\n// dp[j] = 容量 j 时能装的最大价值，一维滚动数组\npublic int knapsack(int W, int[] w, int[] v) {\n    int[] dp = new int[W + 1];\n    for (int i = 0; i < w.length; i++) {      // 外层物品\n        for (int j = W; j >= w[i]; j--) {      // 内层容量倒序（关键！）\n            dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);\n        }\n    }\n    return dp[W];\n}\n// 为什么倒序：一维滚动数组下正序会让同一物品被选多次（完全背包才正序）\n// 游戏场景：装备背包容量内选最大战力组合、背包道具价值最大化"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">0-1 背包状态转移：dp[j] = max(不放, 放)</text>\n<rect x=\"40\" y=\"60\" width=\"560\" height=\"60\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"320\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">处理第 i 件物品（重量 w、价值 v）</text>\n<text x=\"320\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">dp[j] 表示容量 j 的最大价值</text>\n<line x1=\"320\" y1=\"120\" x2=\"320\" y2=\"155\" stroke=\"var(--accent)\" stroke-width=\"2.5\" marker-end=\"url(#d1)\"/>\n<defs><marker id=\"d1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<rect x=\"70\" y=\"160\" width=\"220\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"180\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">不放：dp[j] 保持原值</text>\n<text x=\"180\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">= dp[j]（继承上一物品状态）</text>\n<rect x=\"350\" y=\"160\" width=\"220\" height=\"70\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"460\" y=\"188\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">放：dp[j - w] + v</text>\n<text x=\"460\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">腾出 w 容量 + 物品价值</text>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">两者取 max；容量 j 必须倒序遍历，避免同一物品重复取</text>\n<text x=\"320\" y=\"294\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">完全背包 = 正序遍历容量；多重背包 = 二进制拆分转 0-1</text>\n</svg>",
    "caption": "图：0-1 背包放/不放的转移，滚动数组倒序的原因"
   },
   {
    "t": "h",
    "text": "最长子序列与子串的区别"
   },
   {
    "t": "p",
    "text": "最长公共子序列（LCS）与最长公共子串的区别：子序列可以不连续，子串必须连续。LCS 的转移：dp[i][j] 表示 s1 前 i 个和 s2 前 j 个的 LCS 长度，s1[i]==s2[j] 时 dp[i][j] = dp[i-1][j-1] + 1，否则取 max(dp[i-1][j], dp[i][j-1])。子串则要求相等时 dp[i][j] = dp[i-1][j-1] + 1，不等时归零，答案取全局最大。最长递增子序列（LIS）是经典中的经典：O(n²) 的 dp 模板（dp[i] = max(dp[j]+1) where nums[j] < nums[i]）要会，O(nlogn) 的贪心+二分（维护 tails 数组）进阶也要会。游戏场景：技能释放序列相似度、玩家行为模式匹配、排行榜战力走势。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 最长公共子序列 LCS\npublic int longestCommonSubsequence(String a, String b) {\n    int m = a.length(), n = b.length();\n    int[][] dp = new int[m + 1][n + 1];\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (a.charAt(i - 1) == b.charAt(j - 1)) {\n                dp[i][j] = dp[i - 1][j - 1] + 1;\n            } else {\n                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n    }\n    return dp[m][n];\n}\n// 复杂度 O(mn) 时间 O(mn) 空间（可滚到 O(min(m,n))）\n\n// 最长递增子序列 LIS（O(nlogn) 贪心 + 二分）\npublic int lengthOfLIS(int[] nums) {\n    int[] tails = new int[nums.length];\n    int len = 0;\n    for (int x : nums) {\n        int lo = 0, hi = len;\n        while (lo < hi) {\n            int mid = (lo + hi) >>> 1;\n            if (tails[mid] < x) lo = mid + 1;\n            else hi = mid;\n        }\n        tails[lo] = x;\n        if (lo == len) len++;\n    }\n    return len;\n}"
   },
   {
    "t": "h",
    "text": "区间 DP、状态压缩、股票系列"
   },
   {
    "t": "list",
    "items": [
     "区间 DP：dp[i][j] 表示区间 [i, j] 的最优解，枚举分割点 k 合并。模板：先枚举区间长度，再枚举左端点。游戏场景：合并宝石最大收益、回文串分割最少次数",
     "状态压缩 DP：当状态是'哪些元素已被选'时，用 int 的二进制位表示集合，dp[mask] 表示该集合的最优值。游戏场景：旅行商式的最优采集路径、副本攻略顺序",
     "股票系列（买卖时机）：核心是状态机 dp[i][0/1] 表示第 i 天持币/持股的最大收益，'最多交易 k 次'加一维。这个系列值得死磕：不限次、冷冻期、手续费全是同一状态机的变体",
     "数位 DP：统计 [L, R] 内满足条件的数，按位记忆化，游戏场景：抽卡保底次数统计、掉落概率区间",
     "概率 DP：期望计算，游戏场景：强化成功率期望、抽卡出货期望次数"
    ]
   },
   {
    "t": "h",
    "text": "游戏服务器的 DP 实战案例"
   },
   {
    "t": "p",
    "text": "游戏里 DP 无处不在：背包系统（0-1 背包选装备组合）、排行榜奖励阶梯（贪心或 DP 决策最优领取）、技能搭配（背包变体）、合成系统（区间 DP 求最小合成代价）、抽卡保底（概率 DP）、匹配系统的稳定匹配（匈牙利/最大流，比 DP 更硬）。面试官问'有没有用过动态规划'，把这几个场景一说，比背模板强一百倍——关键要能讲出状态怎么定义、转移怎么写。"
   },
   {
    "t": "pits",
    "items": [
     "状态定义不清导致无后效性被破坏：dp 必须只依赖'状态值'不依赖'到达方式'，否则结果错误",
     "0-1 背包一维滚动数组正序遍历：同一物品被选多次，必须倒序；完全背包才正序",
     "初始化漏边界：dp[0] 或 dp[i][0] 不初始化就全错，先找暴力递归的基线条件",
     "遍历顺序错：LCS 必须外层 i 内层 j 且依赖左上，区间 DP 必须先枚举长度",
     "只写 O(n²) 不优化：LIS 的 O(nlogn) 二分要会，面试会追问",
     "状态转移不画图：二维转移画个表，先手推小例子再写代码",
     "忘了复杂度分析：写完主动说'状态数 × 转移代价'，这是加分项",
     "把子串当子序列：连续性条件不同，LCS 和最长公共子串的转移不一样"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：DP = 重叠子问题 + 最优子结构 + 五步模板。背包/最长子序列/区间 DP/股票系列是四大金刚。游戏落地：背包选装、合成代价、抽卡期望、奖励阶梯。笔试遇到 DP 先写暴力递归验证重叠，再转记忆化/填表。"
   }
  ]
 },
 {
  "id": "algorithm-greedy-backtracking",
  "title": "贪心与回溯",
  "layer": 2,
  "depends": [
   "algorithm-sort-search"
  ],
  "covers": [],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "贪心是'每步选当前最优'的快刀，回溯是'枚举所有可能再剪枝'的重剑。贪心难在证明（局部最优是否等于全局最优），回溯难在剪枝（怎么把指数级搜索剪到能跑）。两者是 DP 的邻居：贪心是 DP 的特例，回溯是 DP 的前身。"
   },
   {
    "t": "pre",
    "items": [
     "掌握排序（见排序篇），贪心经常要先排序",
     "理解递归（见复杂度篇），回溯是递归的加强版",
     "掌握集合与排列的数学概念"
    ]
   },
   {
    "t": "h",
    "text": "贪心：什么时候能用，怎么证明"
   },
   {
    "t": "p",
    "text": "贪心的核心是贪心选择性质：每一步的局部最优能推导出全局最优，且中途不回退。怎么证明？常用交换论证（exchange argument）：假设最优解和贪心解不同，找到第一个分歧点，证明把最优解调整成贪心解不会变差，矛盾于'最优'。区间调度是教科书例子：按结束时间排序，每次选结束最早且不冲突的区间，用交换论证可证。游戏场景：活动日程排期（每天最多活动数）、装备强化顺序（金币有限求战力最大化）、任务奖励领取顺序。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 区间调度（活动安排）：选最多不重叠区间，按结束时间排序\n// 经典贪心：结束最早的活动优先\npublic int eraseOverlapIntervals(int[][] intervals) {\n    if (intervals.length == 0) return 0;\n    Arrays.sort(intervals, (a, b) -> a[1] - b[1]); // 按结束时间升序\n    int count = 1, lastEnd = intervals[0][1];\n    for (int i = 1; i < intervals.length; i++) {\n        if (intervals[i][0] >= lastEnd) { // 不重叠，接上\n            count++;\n            lastEnd = intervals[i][1];\n        }\n    }\n    return intervals.length - count; // 要删掉的重叠区间数\n}\n// 为什么按结束排序：结束早的给后面留的余地最大（交换论证）\n// 游戏场景：活动排期不冲突最大化、组队副本时段安排"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">区间调度贪心：按结束时间排序，结束早的优先</text>\n<rect x=\"50\" y=\"60\" width=\"120\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"110\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A 1~3</text>\n<rect x=\"200\" y=\"60\" width=\"100\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"250\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B 2~4</text>\n<rect x=\"320\" y=\"60\" width=\"120\" height=\"30\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"380\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">C 4~6</text>\n<rect x=\"470\" y=\"60\" width=\"100\" height=\"30\" rx=\"5\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"520\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">D 5~7</text>\n<text x=\"110\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">排期：B 与 A 冲突</text>\n<text x=\"380\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">C 与 A 不冲突，选</text>\n<text x=\"320\" y=\"170\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">最优解 = {A, C}，结束时间最早优先给后面留余地</text>\n<rect x=\"60\" y=\"200\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"180\" y=\"222\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">证明：交换论证</text>\n<text x=\"180\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">最优解第一项换成贪心选择不变差</text>\n<rect x=\"340\" y=\"200\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"460\" y=\"222\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">不能证明 → 退用 DP</text>\n<text x=\"460\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">0-1 背包按性价比贪心是错的</text>\n<text x=\"320\" y=\"290\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">跳跃游戏（贪心）、最少加油次数、Huffman 编码都是经典贪心</text>\n</svg>",
    "caption": "图：区间调度按结束时间排序贪心，及证明思路与 DP 边界"
   },
   {
    "t": "h",
    "text": "回溯模板：选择-探索-撤销"
   },
   {
    "t": "p",
    "text": "回溯 = 深度优先搜索 + 状态重置（撤销选择）。模板四步：选择（在可选列表里挑一个）、探索（递归进入下一层）、撤销（把状态改回去，保证兄弟分支看到干净的现场）、终止（到达目标深度或没得选）。所有排列/组合/子集题都是这一个模板。关键在于'可选列表怎么排除已用的'：排列用 used 数组，组合/子集用 start 下标保证只往后选（避免重复组合），去重要先排序 + 跳过相邻重复。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 全排列模板：选择-探索-撤销\npublic List<List<Integer>> permute(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    boolean[] used = new boolean[nums.length];\n    backtrack(nums, used, new ArrayList<>(), res);\n    return res;\n}\nprivate void backtrack(int[] nums, boolean[] used,\n                       List<Integer> path, List<List<Integer>> res) {\n    if (path.size() == nums.length) {      // 终止：达到深度\n        res.add(new ArrayList<>(path));     // 必须拷贝！\n        return;\n    }\n    for (int i = 0; i < nums.length; i++) {\n        if (used[i]) continue;              // 跳过已用\n        used[i] = true;                     // 选择\n        path.add(nums[i]);\n        backtrack(nums, used, path, res);   // 探索\n        path.remove(path.size() - 1);       // 撤销\n        used[i] = false;\n    }\n}\n// 排列 O(n!)，组合/子集 O(2^n)，剪枝是性能关键\n\n// 子集（组合）：start 下标控制只往后选，去重先排序跳过相同"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">回溯决策树：组合 C(3,2) = 选 2 个，start 控制不回头</text>\n<circle cx=\"320\" cy=\"70\" r=\"24\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">root</text>\n<line x1=\"300\" y1=\"90\" x2=\"180\" y2=\"140\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"320\" y1=\"94\" x2=\"320\" y2=\"140\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"340\" y1=\"90\" x2=\"460\" y2=\"140\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"160\" cy=\"158\" r=\"22\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"160\" y=\"163\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">选1</text>\n<circle cx=\"320\" cy=\"158\" r=\"22\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"320\" y=\"163\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">选2</text>\n<circle cx=\"480\" cy=\"158\" r=\"22\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"480\" y=\"163\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">选3</text>\n<line x1=\"148\" y1=\"176\" x2=\"120\" y2=\"230\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"172\" y1=\"176\" x2=\"200\" y2=\"230\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"308\" y1=\"176\" x2=\"280\" y2=\"230\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"332\" y1=\"176\" x2=\"360\" y2=\"230\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"468\" y1=\"176\" x2=\"440\" y2=\"230\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"492\" y1=\"176\" x2=\"520\" y2=\"230\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<rect x=\"80\" y=\"230\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"110\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">{1,2}</text>\n<rect x=\"180\" y=\"230\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"210\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">{1,3}</text>\n<rect x=\"260\" y=\"230\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"290\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">{2,3}</text>\n<text x=\"440\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">选2 后只能选 3（start 下标），</text>\n<text x=\"440\" y=\"268\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">不会再回头选 1 → 避免重复</text>\n<text x=\"320\" y=\"300\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">剪枝：已选元素达不到目标 / 剩余元素不足 / 非法摆放（N 皇后）提前返回</text>\n</svg>",
    "caption": "图：回溯决策树，start 下标避免重复组合，剪枝提升性能"
   },
   {
    "t": "h",
    "text": "N 皇后与剪枝的艺术"
   },
   {
    "t": "p",
    "text": "N 皇后是回溯的综合题：逐行放皇后，校验列和两条对角线不冲突，冲突就剪枝（该位置直接跳过）。复杂度 O(n!)，但剪枝后实际很快。判断对角线的技巧：主对角线 row-col 相等，副对角线 row+col 相等，用 Set 判冲突 O(1)。剪枝三要素：可行性剪枝（当前选择是否合法）、最优性剪枝（当前路径已不可能优于已知最优）、对称性剪枝（排列去重）。游戏场景：任务序列最优解搜索、装备词条组合、副本站位布阵。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// N 皇后：逐行回溯 + 列/对角线冲突剪枝\npublic List<List<String>> solveNQueens(int n) {\n    List<List<String>> res = new ArrayList<>();\n    int[] cols = new int[n];            // cols[i] = 第 i 行皇后的列\n    boolean[] usedCol = new boolean[n];\n    Set<Integer> diag1 = new HashSet<>(); // row - col\n    Set<Integer> diag2 = new HashSet<>(); // row + col\n    dfs(0, n, cols, usedCol, diag1, diag2, res);\n    return res;\n}\nprivate void dfs(int row, int n, int[] cols, boolean[] usedCol,\n                 Set<Integer> d1, Set<Integer> d2, List<List<String>> res) {\n    if (row == n) { res.add(build(cols)); return; }\n    for (int col = 0; col < n; col++) {\n        if (usedCol[col] || d1.contains(row - col) || d2.contains(row + col)) continue;\n        cols[row] = col;\n        usedCol[col] = true; d1.add(row - col); d2.add(row + col);\n        dfs(row + 1, n, cols, usedCol, d1, d2, res);\n        usedCol[col] = false; d1.remove(row - col); d2.remove(row + col);\n    }\n}"
   },
   {
    "t": "pits",
    "items": [
     "贪心不证明直接套：局部最优不等于全局最优的题一堆（0-1 背包按性价比就是错的），说不出交换论证就先别用贪心",
     "回溯忘记撤销选择：状态污染导致兄弟分支错乱，这是回溯第一坑",
     "结果 add 忘记拷贝：path 是复用对象，必须 new ArrayList<>(path) 否则全是空/同一引用",
     "排列用 start 不用 used：排列要回头（used 数组），组合不回头（start 下标），用反了结果全错",
     "去重不排序：重复元素去重必须先排序再跳过相邻相等，否则漏解",
     "剪枝条件写错：'剩余元素不足'不剪会 TLE，N 皇后对角线剪枝漏判就错",
     "回溯复杂度不分析：排列 O(n!)、子集 O(2^n)，写完主动说并讲剪枝收益",
     "跳跃游戏贪心：维护最远可达位置，不用每步真正跳，理解'最远可达'的贪心本质"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：贪心要能证明（交换论证），证不了退 DP；回溯是'选择-探索-撤销'模板 + 剪枝艺术，排列用 used、组合用 start、去重先排序。游戏落地：活动排期、任务最优解、N 皇后式布阵。"
   }
  ]
 },
 {
  "id": "algorithm-handwrite-top",
  "title": "高频手写题",
  "layer": 3,
  "depends": [
   "algorithm-linked-list",
   "algorithm-stack-queue"
  ],
  "covers": [
   "algorithm-02",
   "algorithm-10",
   "algorithm-13",
   "algorithm-18"
  ],
  "quiz": [
   "algorithm-02",
   "algorithm-10",
   "algorithm-13"
  ],
  "body": [
   {
    "t": "lead",
    "text": "笔试上机的'必考清单'：LRU、限流器、线程池简化、生产者消费者、单例、字符串转整数。这些题不考算法深度，考工程素养——边界处理、并发安全、代码组织。每一道都要练到'闭眼能写'。"
   },
   {
    "t": "pre",
    "items": [
     "掌握双向链表与 HashMap（见链表篇、哈希篇）",
     "理解线程池与并发基础（见 Java 并发分类）",
     "掌握复杂度分析"
    ]
   },
   {
    "t": "h",
    "text": "LRU：笔试第一必考题"
   },
   {
    "t": "p",
    "text": "LRU = HashMap 负责 O(1) 定位 + 双向链表负责 O(1) 维护访问顺序，头最新尾最老，淘汰尾部。Node 必须存 key（淘汰尾节点时反查删 Map）。手写要点：虚拟头尾哨兵节点消除空指针判断、摘除与插头抽成私有方法、每个指针操作都双向更新。get：查到则摘除插头；put：存在则更新移头，不存在则新建插头，超容量删尾。笔试写完主动说'LinkedHashMap 三行取巧版我会，但这是原生版'——既显素养又不被质疑。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// LRU：HashMap + 双向链表（哨兵节点版）\nclass LRUCache {\n    static class Node {\n        int key, val;\n        Node prev, next;\n        Node(int k, int v) { key = k; val = v; }\n    }\n    private final int cap;\n    private final Map<Integer, Node> map = new HashMap<>();\n    private final Node head = new Node(-1, -1); // 虚拟头\n    private final Node tail = new Node(-1, -1); // 虚拟尾\n\n    LRUCache(int capacity) {\n        cap = capacity;\n        head.next = tail;\n        tail.prev = head;\n    }\n    public int get(int key) {\n        Node n = map.get(key);\n        if (n == null) return -1;\n        moveToHead(n);\n        return n.val;\n    }\n    public void put(int key, int value) {\n        Node n = map.get(key);\n        if (n != null) {\n            n.val = value;\n            moveToHead(n);\n            return;\n        }\n        n = new Node(key, value);\n        map.put(key, n);\n        addToHead(n);\n        if (map.size() > cap) {\n            Node last = tail.prev;       // 最老节点\n            remove(last);\n            map.remove(last.key);        // 必须用 Node.key 反查删 Map\n        }\n    }\n    private void moveToHead(Node n) { remove(n); addToHead(n); }\n    private void addToHead(Node n) {\n        n.prev = head; n.next = head.next;\n        head.next.prev = n; head.next = n;\n    }\n    private void remove(Node n) {\n        n.prev.next = n.next;\n        n.next.prev = n.prev;\n    }\n}"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">LRU 结构：HashMap 定位 + 双向链表维护顺序</text>\n<rect x=\"40\" y=\"60\" width=\"130\" height=\"46\" rx=\"6\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"105\" y=\"80\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">Map:key→Node</text>\n<text x=\"105\" y=\"98\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">O(1) 定位</text>\n<rect x=\"60\" y=\"120\" width=\"90\" height=\"28\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"105\" y=\"139\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">key=A</text>\n<rect x=\"60\" y=\"154\" width=\"90\" height=\"28\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"105\" y=\"173\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">key=B</text>\n<rect x=\"60\" y=\"188\" width=\"90\" height=\"28\" rx=\"4\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"105\" y=\"207\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">key=C</text>\n<rect x=\"200\" y=\"60\" width=\"400\" height=\"170\" rx=\"8\" fill=\"var(--bg)\" stroke=\"var(--line)\" stroke-dasharray=\"5 4\"/>\n<text x=\"400\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">双向链表（头=最新，尾=最老）</text>\n<rect x=\"220\" y=\"100\" width=\"52\" height=\"34\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"246\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">头</text>\n<rect x=\"292\" y=\"100\" width=\"52\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"318\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">C</text>\n<rect x=\"364\" y=\"100\" width=\"52\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"390\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text>\n<rect x=\"436\" y=\"100\" width=\"52\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"462\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text>\n<rect x=\"508\" y=\"100\" width=\"52\" height=\"34\" rx=\"5\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"534\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">尾</text>\n<text x=\"300\" y=\"152\" font-size=\"12\" fill=\"var(--accent)\">→</text>\n<text x=\"372\" y=\"152\" font-size=\"12\" fill=\"var(\">→</text>\n<text x=\"444\" y=\"152\" font-size=\"12\" fill=\"var(--line)\">→</text>\n<text x=\"400\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">get/put 访问后移到头，淘汰尾节点</text>\n<text x=\"400\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Node 必须存 key：删尾时反查删 Map</text>\n<text x=\"320\" y=\"270\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">哨兵头尾消除判空，摘除/插头抽私有方法，指针双向更新</text>\n<text x=\"320\" y=\"292\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">追问：并发→分段锁/按玩家线程隔离/Caffeine；LFU→频次+minFreq 链表</text>\n</svg>",
    "caption": "图：LRU 数据结构组合与操作语义，Node 存 key 的原因"
   },
   {
    "t": "h",
    "text": "限流器：令牌桶手写"
   },
   {
    "t": "p",
    "text": "令牌桶 = 按固定速率发牌，请求持牌通行、桶空拒绝，允许攒牌应对突发。手写关键是惰性补充：用时间差计算应补令牌，不开后台线程。字段：capacity、rate（每秒）、tokens、lastTime。tryAcquire() 里先按 (now - lastTime) * rate 惰性补充（封顶 capacity），再判断 tokens >= 1 扣减放行。配合漏桶（强制匀速）与滑动窗口（解决临界突刺）对比讲，登录服用令牌桶、GM 后台固定窗口、第三方回调漏桶。工程关联：Guava RateLimiter、Sentinel 匀速排队、Redis+Lua 分布式限流。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 令牌桶限流器：惰性补充，不开后台线程\npublic class TokenBucket {\n    private final int capacity;          // 桶容量\n    private final double rate;           // 每秒补充令牌数\n    private double tokens;               // 当前令牌\n    private long lastTime;               // 上次补充时间\n\n    public TokenBucket(int capacity, double rate) {\n        this.capacity = capacity;\n        this.rate = rate;\n        this.tokens = capacity;          // 初始满桶\n        this.lastTime = System.currentTimeMillis();\n    }\n    public synchronized boolean tryAcquire() {\n        long now = System.currentTimeMillis();\n        // 惰性补充：时间差 × 速率，封顶容量\n        tokens = Math.min(capacity, tokens + (now - lastTime) * rate / 1000.0);\n        lastTime = now;\n        if (tokens >= 1.0) {\n            tokens -= 1.0;\n            return true;\n        }\n        return false;\n    }\n}\n// 追问：为什么惰性补充？省线程、空闲零开销、无状态\n// 场景选型：登录服令牌桶(允许突发)、GM 固定窗口、第三方回调漏桶(强制匀速)"
   },
   {
    "t": "h",
    "text": "简化线程池 + 生产者消费者"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 简化线程池：固定 Worker + 阻塞队列 + 拒绝策略\npublic class SimpleThreadPool {\n    private final int coreSize;\n    private final BlockingQueue<Runnable> queue;\n    private final List<Thread> workers = new ArrayList<>();\n    private volatile boolean running = true;\n\n    public SimpleThreadPool(int coreSize, int queueCapacity) {\n        this.coreSize = coreSize;\n        this.queue = new ArrayBlockingQueue<>(queueCapacity); // 有界，防 OOM\n        for (int i = 0; i < coreSize; i++) {\n            Thread t = new Thread(this::workLoop, \"worker-\" + i);\n            t.start();\n            workers.add(t);\n        }\n    }\n    public boolean execute(Runnable task) {\n        if (!running) return false;\n        return queue.offer(task);  // 有界队列 + 入队失败即拒绝\n    }\n    private void workLoop() {\n        while (running) {\n            try {\n                Runnable task = queue.take();   // 阻塞取任务\n                try {\n                    task.run();\n                } catch (Throwable t) {\n                    t.printStackTrace();       // 吞异常保线程，关键！\n                }\n            } catch (InterruptedException e) {\n                Thread.currentThread().interrupt();\n            }\n        }\n    }\n    public void shutdown() { running = false; }\n}\n// 与 ThreadPoolExecutor 对应：核心线程、入队、扩线程、拒绝四步流程\n// 游戏落地：登录服异步写日志/通知，满了降级丢弃+告警；Disruptor 是极致版"
   },
   {
    "t": "p",
    "text": "生产者消费者是并发手写题的另一高频：BlockingQueue 一行搞定（生产者 put、消费者 take），但要能讲清楚为什么用阻塞队列、无界队列的风险、以及信号量/条件变量的手写版本。单例题：懒汉双检锁（volatile + synchronized 双重检查）和静态内部类两种都要会，说清 volatile 防止指令重排的原因。字符串转整数：处理前导空格、正负号、溢出（用 long 或提前判断）、非法字符，是'边界处理'的验收题。"
   },
   {
    "t": "pits",
    "items": [
     "LRU Node 漏存 key：删尾时无法反查删 Map，缓存永不清干净",
     "LRU 指针漏更新一个方向：prev/next 必须双向，不然链表断链",
     "令牌桶用定时线程补充：应惰性计算，省线程且零空闲开销",
     "令牌桶 forgot 封顶：tokens 无限累积，桶容量形同虚设",
     "线程池 Worker 循环不捕异常：任务抛异常线程死亡，线程数悄悄减少",
     "线程池用无界队列：生产快于消费时任务堆积 OOM，且拒绝策略永远不触发",
     "单例 double-check 不加 volatile：instance 可能读到半初始化对象（指令重排）",
     "生产者消费者裸用 Object wait/notify 而不用 BlockingQueue：手写时易死锁，优先讲阻塞队列方案"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：LRU（双链表+Map+哨兵）、令牌桶（惰性补充）、简化线程池（有界队列+Worker 循环+捕异常）、单例（双检锁+volatile）、字符串转整数（边界处理）是上机五件套。每道练到闭眼能写，并主动讲并发与工程落地。关联题库：algorithm-02、algorithm-10、algorithm-13、algorithm-18。"
   }
  ]
 },
 {
  "id": "algorithm-bit-math",
  "title": "位运算与数学",
  "layer": 3,
  "depends": [
   "algorithm-complexity"
  ],
  "covers": [
   "algorithm-12"
  ],
  "quiz": [],
  "body": [
   {
    "t": "lead",
    "text": "位运算是程序员的手工机关枪：O(1) 的乘除 2、判奇偶、状态压缩、异或找唯一。数学题则是'数论 + 组合 + 随机'的小题库：快速幂、gcd/lcm、素数筛、进制转换，笔试里几乎必有 1~2 道。"
   },
   {
    "t": "pre",
    "items": [
     "掌握二进制的补码表示",
     "理解 HashMap 里 hash & (n-1) 的下标计算（哈希篇）",
     "掌握复杂度分析"
    ]
   },
   {
    "t": "h",
    "text": "位运算十大技巧"
   },
   {
    "t": "list",
    "items": [
     "乘除 2：n << 1、n >> 1，比乘除快但要注意负数的右移是算术右移",
     "判奇偶：n & 1 == 1 是奇数，比 n % 2 快",
     "取最低位 1：n & (-n)，即 lowbit，树状数组核心",
     "清除最低位 1：n & (n - 1)，统计二进制中 1 的个数（每次清一个）",
     "异或特性：a ^ a = 0、a ^ 0 = a、交换律结合律 → '只出现一次的数'全数组异或",
     "判断是否 2 的幂：n > 0 && (n & (n - 1)) == 0",
     "hash 取模优化：hash & (n - 1)，前提容量是 2 的幂（HashMap 扩容设计）",
     "状态压缩：int 的 32 位表示 32 个开关（技能解锁位图、签到位图）",
     "RGB 通道提取与合成：(rgb >> 16) & 0xFF 取 R",
     "掩码：n & 0xFF 取低 8 位，n | mask 置位，n ^ mask 翻转"
    ]
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 找只出现一次的数（其余都出现两次）\npublic int singleNumber(int[] nums) {\n    int xor = 0;\n    for (int n : nums) xor ^= n;  // 成对消掉，剩下落单的\n    return xor;\n}\n// 扩展：找两个只出现一次的数\n// 全体异或得到 x^y，取最低位1分组，各组分别异或\n\n// 统计 1 的个数（每次清除最低位 1）\npublic int countBits(int n) {\n    int c = 0;\n    while (n != 0) {\n        n &= n - 1;\n        c++;\n    }\n    return c;\n}\n\n// 判断 2 的幂\nboolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}\n// 游戏场景：签到 31 天用 int 位图记录、Buff 状态位图、每日活跃标记"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">位运算技巧速查：状态压缩与常用公式</text>\n<rect x=\"40\" y=\"50\" width=\"270\" height=\"64\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"175\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">状态压缩：int 32 位 = 32 个开关</text>\n<text x=\"175\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">签到 31 天：1 个 int 搞定，set/get 用位运算</text>\n<rect x=\"330\" y=\"50\" width=\"270\" height=\"64\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"465\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">n & (n-1)：清除最低位 1</text>\n<text x=\"465\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">数 1 个数 / 判 2 的幂，一次清一个</text>\n<rect x=\"40\" y=\"130\" width=\"270\" height=\"64\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"175\" y=\"156\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">异或：a^a=0，a^0=a</text>\n<text x=\"175\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">成对消掉 → 找落单元素</text>\n<rect x=\"330\" y=\"130\" width=\"270\" height=\"64\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"465\" y=\"156\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">n & (-n)：lowbit 取最低位 1</text>\n<text x=\"465\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">树状数组、区间查询核心</text>\n<text x=\"320\" y=\"230\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">hash & (n-1)：容量为 2 的幂时取模优化</text>\n<text x=\"320\" y=\"254\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏场景：签到位图、Buff 状态位图、每日活跃、道具拥有标记</text>\n<text x=\"320\" y=\"278\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">位图再延伸 = Bitmap 判重 → 海量数据篇的武器</text>\n</svg>",
    "caption": "图：位运算技巧速查，与游戏位图场景挂钩"
   },
   {
    "t": "h",
    "text": "快速幂：分治的数学应用"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 快速幂：x^n 在 O(logn) 内完成\npublic long fastPow(long x, long n, long mod) {\n    long res = 1;\n    while (n > 0) {\n        if ((n & 1) == 1) res = res * x % mod;  // 当前位是 1，乘上\n        x = x * x % mod;                         // 底数平方（2 的幂次）\n        n >>= 1;                                 // 处理下一位\n    }\n    return res;\n}\n// 原理：n 拆成二进制，x^n = x^(2^k1) * x^(2^k2) * ...\n// 游戏场景：概率多次独立判定、每日奖励翻倍叠加、Hash 一致性里的 murmur 散列"
   },
   {
    "t": "h",
    "text": "gcd/lcm 与素数筛"
   },
   {
    "t": "p",
    "text": "辗转相除法求 gcd：gcd(a, b) = gcd(b, a % b)，递归或迭代，O(log(min(a,b)))。lcm = a / gcd * b（先除防溢出）。素数判断到 sqrt(n)，素数筛用埃氏筛（标记倍数）O(nloglogn) 和线性筛（欧拉筛，每个合数被最小质因子筛一次）O(n)。游戏场景：装备掉率化简（gcd）、奖励比例配平、掉落表配置里的质数检测、随机数生成的质量控制。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 埃氏筛：求 1~n 所有素数\npublic List<Integer> sieve(int n) {\n    boolean[] notPrime = new boolean[n + 1];\n    List<Integer> primes = new ArrayList<>();\n    for (int i = 2; i <= n; i++) {\n        if (!notPrime[i]) {\n            primes.add(i);\n            // 防止 i*i 溢出：long\n            if ((long) i * i <= n) {\n                for (long j = (long) i * i; j <= n; j += i) {\n                    notPrime[(int) j] = true;\n                }\n            }\n        }\n    }\n    return primes;\n}\n// O(n loglogn)，从 i*i 开始标记避免重复\n// 游戏场景：掉落表随机种子质量、抽卡伪随机分布均匀性验证"
   },
   {
    "t": "h",
    "text": "随机算法与进制转换"
   },
   {
    "t": "p",
    "text": "随机算法在游戏里是重头：洗牌用 Fisher-Yates（原地 O(n)，保证每种排列等概率，别用 Collections.shuffle 的误区是没理解源码）；加权随机用前缀和 + 二分（掉落表的核心，概率权重累加再二分定位）；蓄水池采样解决'未知总量流式等概率采样'。进制转换是送分题：除基取余、倒序排列，注意处理负数与字母。组合数学：阶乘、排列组合数 C(n,k) 用组合递推避免阶乘溢出。"
   },
   {
    "t": "pits",
    "items": [
     "负数的右移是算术右移（补符号位），别用 >> 处理无符号场景",
     "快速幂 mod 不取：大数直接溢出 long，必须每步 % mod",
     "gcd 用减法不用取模：效率低，用辗转相除 a % b",
     "lcm = a * b / gcd 溢出：先除后乘 a / gcd * b",
     "埃氏筛从 i*i 开始：从 2*i 开始会重复标记，虽然结果对但慢；溢出要转 long",
     "洗牌写错成每个位置随机换：必须 Fisher-Yates（从后往前每位置与 [0,i] 随机交换）",
     "加权随机每次 O(n) 遍历：大数据量用前缀和 + 二分 O(logn)",
     "进制转换忘了倒序：除基取余的结果要 reverse",
     "素数判断用 i*i <= n 每轮算：提前缓存 sqrt(n)，或 i <= sqrt（避免溢出）"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：位运算十大技巧（异或、lowbit、清除最低位、状态压缩）+ 数学四件套（快速幂、gcd/lcm、素数筛、Fisher-Yates 洗牌 + 加权随机）。游戏落地：签到位图、Buff 位图、掉落表加权随机、抽卡洗牌。"
   }
  ]
 },
 {
  "id": "algorithm-string-matching",
  "title": "字符串匹配",
  "layer": 3,
  "depends": [
   "algorithm-hash-string"
  ],
  "covers": [
   "algorithm-15"
  ],
  "quiz": [
   "algorithm-15"
  ],
  "body": [
   {
    "t": "lead",
    "text": "字符串匹配是从 KMP 单模式到 AC 自动机多模式、再到通配符与编辑距离的完整谱系。游戏里敏感词过滤、聊天监控、协议解析全是它。KMP 是面试重灾区，AC 自动机是工业标准。"
   },
   {
    "t": "pre",
    "items": [
     "掌握 Trie 前缀树（见哈希与字符串篇）",
     "理解数组与滑动窗口（见数组篇）",
     "掌握复杂度分析"
    ]
   },
   {
    "t": "h",
    "text": "KMP：主串指针不回退"
   },
   {
    "t": "p",
    "text": "KMP 的核心是 next 数组（部分匹配表）：next[i] 表示模式串前 i 个字符的最长相等真前后缀长度。匹配失败时，主串指针 i 不回退，模式串指针 j 跳到 next[j-1]（或 next[j] 视定义），利用已匹配信息跳过无效比较，复杂度稳定 O(n+m)。next 数组怎么算：就是'模式串自己匹配自己'，j 记录当前最长相等前后缀长度，失配时 j = next[j-1] 回退。手写 KMP 是最典型的'会背不会写'的题，必须画图理解 next 的跳转。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// KMP：next 数组（前缀函数）+ 匹配，O(n+m)\npublic int kmp(String text, String pattern) {\n    if (pattern.isEmpty()) return 0;\n    int[] next = buildNext(pattern);\n    int j = 0;\n    for (int i = 0; i < text.length(); i++) {\n        while (j > 0 && text.charAt(i) != pattern.charAt(j)) {\n            j = next[j - 1];        // 失配回退到已匹配的最长前缀\n        }\n        if (text.charAt(i) == pattern.charAt(j)) j++;\n        if (j == pattern.length()) {\n            return i - j + 1;       // 找到首位置\n        }\n    }\n    return -1;\n}\nprivate int[] buildNext(String p) {\n    int m = p.length();\n    int[] next = new int[m];\n    int j = 0;\n    for (int i = 1; i < m; i++) {\n        while (j > 0 && p.charAt(i) != p.charAt(j)) j = next[j - 1];\n        if (p.charAt(i) == p.charAt(j)) j++;\n        next[i] = j;                // 前 i+1 个字符的最长相等前后缀\n    }\n    return next;\n}\n// 游戏场景：协议匹配、指令解析、日志关键字定位、装备名模板匹配"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">KMP：模式串 ABABABC 的 next 数组（最长相等前后缀）</text>\n<rect x=\"40\" y=\"60\" width=\"66\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"73\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text>\n<rect x=\"110\" y=\"60\" width=\"66\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"143\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text>\n<rect x=\"180\" y=\"60\" width=\"66\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"213\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text>\n<rect x=\"250\" y=\"60\" width=\"66\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"283\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text>\n<rect x=\"320\" y=\"60\" width=\"66\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"353\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text>\n<rect x=\"390\" y=\"60\" width=\"66\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"423\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text>\n<rect x=\"460\" y=\"60\" width=\"66\" height=\"34\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"493\" y=\"82\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">C</text>\n<rect x=\"40\" y=\"108\" width=\"66\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"73\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next 0</text>\n<rect x=\"110\" y=\"108\" width=\"66\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"143\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next 0</text>\n<rect x=\"180\" y=\"108\" width=\"66\" height=\"30\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"213\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next 1</text>\n<rect x=\"250\" y=\"108\" width=\"66\" height=\"30\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"283\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next 2</text>\n<rect x=\"320\" y=\"108\" width=\"66\" height=\"30\" rx=\"5\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"353\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next 3</text>\n<rect x=\"390\" y=\"108\" width=\"66\" height=\"30\" rx=\"5\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"423\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next 4</text>\n<rect x=\"460\" y=\"108\" width=\"66\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"493\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">next 0</text>\n<rect x=\"70\" y=\"170\" width=\"100\" height=\"44\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"120\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ABAB 前缀=后缀 AB</text>\n<rect x=\"230\" y=\"170\" width=\"130\" height=\"44\" rx=\"6\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"295\" y=\"196\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">ABABA 前缀=后缀 ABA</text>\n<text x=\"500\" y=\"180\" font-size=\"12\" fill=\"var(--ink)\">失配时：</text>\n<text x=\"500\" y=\"200\" font-size=\"12\" fill=\"var(--ink)\">j = next[j-1]</text>\n<text x=\"320\" y=\"250\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">主串指针 i 绝不回退 → O(n+m)，适合流式数据（无法回溯）</text>\n<text x=\"320\" y=\"274\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">next 数组 = '模式串匹配自己'，面试需手推一遍 ABABABC</text>\n<text x=\"320\" y=\"298\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">BM 是 KMP 之外的工程利器：坏字符 + 好后缀，Java String.indexOf 有优化</text>\n</svg>",
    "caption": "图：KMP next 数组含义与失配回退，主串不回退的本质"
   },
   {
    "t": "h",
    "text": "AC 自动机：敏感词过滤工业标准"
   },
   {
    "t": "p",
    "text": "敏感词过滤为什么不能逐个词 indexOf：词库 5 万词 × 每条消息 O(n) = 灾难。AC 自动机 = Trie + fail 指针：把全部敏感词建成 Trie，再给每个节点建 fail 指针（失配时跳到'当前串最长可匹配后缀'对应节点，类似 KMP next 在树上的推广）。构建一次，之后每条消息扫描一遍 O(n)，所有命中一次性输出，与词库规模无关。工程细节：变体字对抗（归一化：繁简转换、去空格、谐音映射）、热更新（双 buffer 后台建树 AtomicReference 切换）、命中策略分级。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// AC 自动机核心思路（Trie + fail 指针）\npublic class AcAutoMaton {\n    static class Node {\n        Node[] next = new Node[26];\n        Node fail;\n        boolean end;\n    }\n    private final Node root = new Node();\n\n    public void insert(String word) {\n        Node cur = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (cur.next[idx] == null) cur.next[idx] = new Node();\n            cur = cur.next[idx];\n        }\n        cur.end = true;\n    }\n    public void buildFail() {  // BFS 构建 fail 指针\n        Deque<Node> q = new ArrayDeque<>();\n        for (int i = 0; i < 26; i++) {\n            if (root.next[i] != null) {\n                root.next[i].fail = root;\n                q.offer(root.next[i]);\n            }\n        }\n        while (!q.isEmpty()) {\n            Node cur = q.poll();\n            for (int i = 0; i < 26; i++) {\n                Node child = cur.next[i];\n                if (child != null) {\n                    Node f = cur.fail;\n                    while (f != null && f.next[i] == null) f = f.fail;\n                    child.fail = (f == null) ? root : f.next[i];\n                    q.offer(child);\n                }\n            }\n        }\n    }\n    // 匹配：主串指针不回溯，失配沿 fail 跳，命中即输出\n}\n// 复杂度：构建 O(词库总长)，匹配 O(文本长)，与词库规模无关"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">AC 自动机 = Trie + fail 指针：敏感词 she / he / his</text>\n<circle cx=\"320\" cy=\"70\" r=\"22\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"75\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">root</text>\n<circle cx=\"180\" cy=\"140\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"180\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">s</text>\n<circle cx=\"340\" cy=\"140\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"340\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">h</text>\n<circle cx=\"500\" cy=\"140\" r=\"20\" fill=\"var(--panel)\" stroke=\"var(--ink)\"/>\n<text x=\"500\" y=\"145\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">h</text>\n<line x1=\"302\" y1=\"86\" x2=\"192\" y2=\"126\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"338\" y1=\"86\" x2=\"328\" y2=\"126\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"340\" y1=\"160\" x2=\"340\" y2=\"196\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"340\" cy=\"214\" r=\"20\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"340\" y=\"219\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">e*</text>\n<circle cx=\"180\" cy=\"214\" r=\"20\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"180\" y=\"219\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">h*</text>\n<line x1=\"160\" y1=\"152\" x2=\"168\" y2=\"198\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"200\" y1=\"152\" x2=\"188\" y2=\"198\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"500\" cy=\"214\" r=\"20\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"500\" y=\"219\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">i</text>\n<line x1=\"480\" y1=\"152\" x2=\"490\" y2=\"198\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"520\" y1=\"152\" x2=\"510\" y2=\"198\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<circle cx=\"500\" cy=\"276\" r=\"20\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\" stroke-width=\"2\"/>\n<text x=\"500\" y=\"281\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">s*</text>\n<line x1=\"500\" y1=\"234\" x2=\"500\" y2=\"258\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<path d=\"M340 234 C 380 260, 460 260, 488 258\" stroke=\"var(--accent)\" stroke-width=\"2\" fill=\"none\" stroke-dasharray=\"5 3\" marker-end=\"url(#ac1)\"/>\n<defs><marker id=\"ac1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--accent)\"/></marker></defs>\n<text x=\"415\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--accent)\">fail: h→h</text>\n<text x=\"580\" y=\"90\" font-size=\"12\" fill=\"var(--ink)\">* = 敏感词结尾</text>\n<text x=\"580\" y=\"112\" font-size=\"12\" fill=\"var(--muted)\">失配跳 fail 指针，</text>\n<text x=\"580\" y=\"132\" font-size=\"12\" fill=\"var(--muted)\">一次扫描全命中</text>\n<text x=\"320\" y=\"308\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">工程：归一化对抗变体字、双 buffer 热更新、命中策略分级</text>\n</svg>",
    "caption": "图：AC 自动机 Trie 树上加 fail 指针，失配跳转共享匹配"
   },
   {
    "t": "h",
    "text": "通配符匹配与编辑距离"
   },
   {
    "t": "p",
    "text": "通配符匹配（'*' 匹配任意长度、'?' 匹配单字符）和正则匹配是 DP 题：dp[i][j] 表示前 i 个文本与前 j 个模式是否匹配，按模式串当前字符分类讨论。编辑距离（莱文斯坦距离）是经典 DP：dp[i][j] = 删除/插入/替换三操作的最小代价，字符相等则继承 dp[i-1][j-1]。游戏场景：玩家名模糊搜索、聊天内容相似度判定（屏蔽变体）、装备名联想。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 编辑距离：插入/删除/替换的最小次数\npublic int minDistance(String word1, String word2) {\n    int m = word1.length(), n = word2.length();\n    int[][] dp = new int[m + 1][n + 1];\n    for (int i = 0; i <= m; i++) dp[i][0] = i;   // 全删\n    for (int j = 0; j <= n; j++) dp[0][j] = j;   // 全插\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {\n                dp[i][j] = dp[i - 1][j - 1];\n            } else {\n                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],  // 替换\n                                Math.min(dp[i - 1][j],      // 删除\n                                         dp[i][j - 1]));    // 插入\n            }\n        }\n    }\n    return dp[m][n];\n}\n// O(mn) 时间，可滚到 O(n) 空间\n// 游戏场景：屏蔽词相似度判定（容错）、聊天垃圾识别、玩家名联想"
   },
   {
    "t": "pits",
    "items": [
     "KMP next 数组定义记混：next[i] = 前 i+1 字符最长相等前后缀，失配回退 next[j-1]，写前画图验证",
     "KMP 边界：空模式串、单字符模式、全重复字符（aaaaa）都要手推",
     "AC 自动机 fail 指针不 BFS：fail 需要逐层构建（BFS 层序），直接用递归会错",
     "敏感词逐个 indexOf：5 万词 × O(n) 是 CPU 灾难，必须 AC 自动机一次扫描",
     "通配符匹配 '*' 匹配空串也要考虑：dp 初始化和转移漏空匹配",
     "编辑距离三操作漏项：替换/删除/插入三选一，常漏一个",
     "BM 算法只背名词：坏字符 + 好后缀两种启发式，滑动量取最大值",
     "字符串匹配写完不过特殊用例：空串、长度 1、全相同、交替出现，主动过一遍"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：KMP（next 数组 + 主串不回退）→ AC 自动机（Trie + fail 多模式）→ 通配符/编辑距离（DP）。游戏落地：敏感词过滤、聊天监控、玩家名联想、协议解析。关联题库：algorithm-15。"
   }
  ]
 },
 {
  "id": "algorithm-massive-data",
  "title": "海量数据算法",
  "layer": 3,
  "depends": [
   "algorithm-bit-math"
  ],
  "covers": [
   "algorithm-12",
   "algorithm-16"
  ],
  "quiz": [
   "algorithm-12",
   "algorithm-16"
  ],
  "body": [
   {
    "t": "lead",
    "text": "海量数据题考的不是算法，是'内存账本'：先算装不装得下，再选方案。Bitmap、哈希分治、外排序、布隆过滤器、一致性哈希，一套'先算账再选型'的方法论，是游戏大数据场景（DAU、日志、排行榜）的标配。"
   },
   {
    "t": "pre",
    "items": [
     "掌握位运算（见位运算篇）",
     "理解哈希冲突与分桶（见哈希篇）",
     "掌握 TopK 与排序（见排序篇）"
    ]
   },
   {
    "t": "h",
    "text": "先算账，再选方案"
   },
   {
    "t": "p",
    "text": "海量数据题第一步永远是算内存账：10 亿个 long 原样存要 8G，1G 内存装不下；10 亿个玩家 ID 判重，bitmap 一位一个只要约 125MB（10 亿 bit）。方案选择的三个问句：值域有多大？要不要精确？要不要支持删除？问清约束再给方案，比上来就答更像老手——这是面试官判断'工程思维'的点。游戏场景：DAU 去重、签到判重、活动参与统计、跨服玩家数据归并。"
   },
   {
    "t": "h",
    "text": "Bitmap 与哈希分治"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// Bitmap 判重：一位表示一个 ID 是否出现（用 long[] 实现）\npublic class BitMap {\n    private final long[] bits;\n    public BitMap(int maxId) { bits = new long[(maxId >>> 6) + 1]; }\n    public void set(int id) {\n        bits[id >>> 6] |= 1L << (id & 63);   // id/64 定位字，id%64 定位位\n    }\n    public boolean get(int id) {\n        return (bits[id >>> 6] & (1L << (id & 63))) != 0;\n    }\n}\n// 10 亿 ID 判重：约 125MB，两遍扫描：第一遍置位，第二遍发现已置位即重复\n// Redis Bitmap：SETBIT/GETBIT 现成方案，签到/DAU 去重直接可用\n\n// 哈希分治：hash(id) % 1000 切 1000 个小文件\n// 重复 ID 必然落在同一文件（哈希确定性），逐个小文件 HashMap 统计\n// 变种：TopK 汇总用堆、交集用双文件哈希分治对、排序用外排序"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">海量数据三套路：先算账再选方案</text>\n<rect x=\"40\" y=\"60\" width=\"180\" height=\"90\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"130\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">Bitmap 判重</text>\n<text x=\"130\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">一位一个 ID，10亿 ≈125MB</text>\n<text x=\"130\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">两遍扫描找重复</text>\n<rect x=\"230\" y=\"60\" width=\"180\" height=\"90\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"320\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">哈希分治</text>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">hash % N 切小文件</text>\n<text x=\"320\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">重复必同文件，逐片统计</text>\n<rect x=\"420\" y=\"60\" width=\"180\" height=\"90\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"510\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">外排序/堆</text>\n<text x=\"510\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">分段内排 + 多路归并</text>\n<text x=\"510\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">或小顶堆取 TopK</text>\n<text x=\"320\" y=\"185\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">先问三个问题：值域多大？要不要精确？要不要支持删除？</text>\n<rect x=\"60\" y=\"210\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"180\" y=\"232\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">布隆过滤器：允许误判</text>\n<text x=\"180\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">位图 + k 个哈希函数，查'不存在'准确、查'存在'可能误报</text>\n<rect x=\"340\" y=\"210\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"460\" y=\"232\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">一致性哈希：节点路由</text>\n<text x=\"460\" y=\"252\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">加节点只迁移 1/N，配合虚拟节点均匀分布</text>\n<text x=\"320\" y=\"296\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">游戏落地：DAU 去重、签到位图、活动参与统计、跨服数据归并、Redis 代理路由</text>\n</svg>",
    "caption": "图：海量数据三套路总览 + 布隆过滤器与一致性哈希的适用边界"
   },
   {
    "t": "h",
    "text": "外排序与布隆过滤器"
   },
   {
    "t": "p",
    "text": "外排序处理'内存装不下整份数据'的全局排序：数据切段、每段内部排序写盘、多路归并（K 路归并用小顶堆取最小）。游戏场景：全服玩家战力榜单离线重算、日志文件按时间排序、跨服结算数据归并。布隆过滤器：m 位位图 + k 个哈希函数，插入时把 k 个位置都置 1，查询时 k 个位置全 1 才认为可能存在（可能有误报）、任一为 0 则必然不存在。误判率约 (1 - e^(-kn/m))^k，m/n 取 10 时约 1%。不能删除（多位共享）——要删用计数布隆。游戏场景：防重复领取（先查布隆再查库，DB 兜底）、已读消息、URL 去重。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 布隆过滤器核心（简化版）\npublic class BloomFilter {\n    private final BitSet bits;\n    private final int k;\n    public BloomFilter(int m, int k) {\n        bits = new BitSet(m);\n        this.k = k;\n    }\n    private int hash(String s, int seed) {\n        int h = seed;\n        for (char c : s.toCharArray()) h = h * 31 + c;\n        return Math.abs(h);\n    }\n    public void add(String s) {\n        for (int i = 0; i < k; i++) bits.set(hash(s, i) % bits.size());\n    }\n    public boolean mightContain(String s) {\n        for (int i = 0; i < k; i++) {\n            if (!bits.get(hash(s, i) % bits.size())) return false; // 一定不存在\n        }\n        return true;  // 可能存在（有误报）\n    }\n}\n// Guava 有现成 BloomFilter，生产直接用\n// 游戏场景：活动奖励防重复、已处理消息去重（配合 DB 兜底防误报误伤）"
   },
   {
    "t": "h",
    "text": "一致性哈希：节点路由与数据迁移最小化"
   },
   {
    "t": "p",
    "text": "一致性哈希把节点和数据都映射到哈希环上，数据顺时针找第一个节点。增删节点只影响环上相邻区间，迁移量约 1/N，完胜取模 hash % N 的全量重排。虚拟节点解决物理节点少时分布不均：每个物理节点虚拟化成上百个虚拟点打散在环上。手写三件套：TreeMap 存'哈希值 → 节点'（ceilingEntry 找顺时针第一个，找不到取 firstEntry 回环）、addNode 加虚拟节点、getNode 定位。游戏落地：分服/跨服路由、缓存节点路由（twemproxy/codis 思想）。追问：MurMurHash 均匀快、节点故障天然倒给下一个、有状态服务要注意归属漂移。"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"320\" cy=\"160\" r=\"120\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"2.5\"/>\n<circle cx=\"320\" cy=\"160\" r=\"4\" fill=\"var(--ink)\"/>\n<circle cx=\"320\" cy=\"66\" r=\"20\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"320\" y=\"71\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">A</text>\n<circle cx=\"438\" cy=\"170\" r=\"20\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"438\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">B</text>\n<circle cx=\"280\" cy=\"262\" r=\"20\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"280\" y=\"267\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">C</text>\n<circle cx=\"170\" cy=\"150\" r=\"8\" fill=\"var(--ink)\"/>\n<circle cx=\"230\" cy=\"110\" r=\"8\" fill=\"var(--ink)\"/>\n<circle cx=\"370\" cy=\"90\" r=\"8\" fill=\"var(--ink)\"/>\n<circle cx=\"470\" cy=\"230\" r=\"8\" fill=\"var(--ink)\"/>\n<text x=\"150\" y=\"120\" font-size=\"12\" fill=\"var(--muted)\">key1→C</text>\n<text x=\"370\" y=\"80\" font-size=\"12\" fill=\"var(--muted)\">key2→A</text>\n<path d=\"M288 140 C 260 180, 230 220, 282 244\" stroke=\"var(--lv3)\" stroke-width=\"1.8\" fill=\"none\" marker-end=\"url(#h1)\"/>\n<defs><marker id=\"h1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--lv3)\"/></marker></defs>\n<text x=\"240\" y=\"200\" font-size=\"12\" fill=\"var(--lv3)\">顺时针→</text>\n<text x=\"320\" y=\"66\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">▲</text>\n<text x=\"320\" y=\"30\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">一致性哈希环：key 顺时针找第一个节点</text>\n<text x=\"600\" y=\"160\" font-size=\"12\" fill=\"var(--ink)\">加节点只影响</text>\n<text x=\"600\" y=\"180\" font-size=\"12\" fill=\"var(--ink)\">逆时针相邻段</text>\n<text x=\"600\" y=\"200\" font-size=\"12\" fill=\"var(--muted)\">迁移量 ≈ 1/N</text>\n<text x=\"320\" y=\"306\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">虚拟节点打散分布；手写三件套：TreeMap 环 + ceilingEntry + 回环 firstEntry</text>\n</svg>",
    "caption": "图：一致性哈希环，key 顺时针归属，加节点只影响相邻段"
   },
   {
    "t": "pits",
    "items": [
     "不先算内存账就选方案：bitmap 的前提是值域压缩后放得下，ID 范围 100 亿就得换布隆/分治",
     "bitmap 位运算写错：word = id >>> 6，bit = 1L << (id & 63)，别把除 64 和取模 64 记反",
     "哈希分治倾斜：某个小文件还是装不下，换哈希函数二次分治，分桶数按总数据量 ×2~3 预估",
     "布隆过滤器当精确判重用：有误报率，业务上要 DB 兜底，误伤正常玩家是事故",
     "布隆过滤器删除：直接清零会误删其他元素，要删用计数布隆",
     "一致性哈希忘了回环：ceilingEntry 找不到要取 firstEntry，否则 key 落在最大哈希之后丢失",
     "取模 hash % N 扩容全量迁移：面试必讲一致性哈希对比，取模命中率雪崩",
     "海量题不问约束就答：先问值域、精度、删除需求，再给方案，这是加分项",
     "外排序多路归并用手工比较：K 路归并用小顶堆 O(KlogK) 取最小"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：先算内存账，再选 Bitmap（判重）/哈希分治（统计）/外排序（全局有序）/布隆（容忍误判）/一致性哈希（路由）。游戏落地：DAU 去重、签到位图、跨服归并、缓存路由。关联题库：algorithm-12、algorithm-16。"
   }
  ]
 },
 {
  "id": "algorithm-advanced-structs",
  "title": "高级数据结构",
  "layer": 3,
  "depends": [
   "algorithm-linked-list",
   "algorithm-sort-search"
  ],
  "covers": [
   "algorithm-08",
   "algorithm-09"
  ],
  "quiz": [
   "algorithm-08",
   "algorithm-09"
  ],
  "body": [
   {
    "t": "lead",
    "text": "高级数据结构是'以结构换复杂度'的工程智慧：跳表用概率换平衡、红黑树用近似平衡换效率、线段树和树状数组用区间思想换 O(logn) 查询、左偏堆用偏序换快速合并。理解思想比会写实现更重要——因为生产里几乎都用现成的。"
   },
   {
    "t": "pre",
    "items": [
     "掌握有序链表与平衡树概念（见链表篇、二叉树篇）",
     "理解 O(logn) 的来源（二分）",
     "掌握递归与分治"
    ]
   },
   {
    "t": "h",
    "text": "跳表：有序链表 + 多层随机索引"
   },
   {
    "t": "p",
    "text": "跳表 = 底层完整有序链表 + 每节点以概率 p 向上晋升一层索引，期望层数 O(logn)。查找从头最高层开始'能往右就往右，不能就下一层'，像高速公路-国道-县道分级赶路。Redis 的 p=1/4，每节点期望指针 1/(1-p) ≈ 1.33 个。为什么 Redis ZSet 选跳表而不是红黑树（高频深挖）：范围查询（ZRANGEBYSCORE）跳表 O(logn) 定位后顺序遍历即可，红黑树要中序遍历实现繁琐；实现简单，插入只动相邻指针，红黑树要旋转变色；并发友好，可细粒度锁甚至无锁；内存实际更省（1.33 vs 2 指针 + 颜色位）。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 跳表 insert 核心：记录每层前驱 update[]，逐层链接\n// 关键步骤：随机层数 → 从高到低找每层前驱 → 逐层插入\nprivate static final int MAX_LEVEL = 16;\nprivate static final double P = 0.5;\n\nNode insert(int key, int val) {\n    Node[] update = new Node[MAX_LEVEL + 1];\n    Node cur = head;\n    for (int i = level; i >= 0; i--) {\n        while (cur.next[i] != null && cur.next[i].key < key) {\n            cur = cur.next[i];\n        }\n        update[i] = cur;              // 记录第 i 层前驱\n    }\n    int newLevel = randomLevel();\n    if (newLevel > level) {\n        for (int i = level + 1; i <= newLevel; i++) update[i] = head;\n        level = newLevel;\n    }\n    Node newNode = new Node(key, val, newLevel);\n    for (int i = 0; i <= newLevel; i++) {\n        newNode.next[i] = update[i].next[i];   // 逐层链接\n        update[i].next[i] = newNode;\n    }\n    return newNode;\n}\nprivate int randomLevel() {\n    int l = 0;\n    while (Math.random() < P && l < MAX_LEVEL) l++;\n    return l;\n}\n// 复杂度：增删查期望 O(logn)，空间 O(n)。'期望'二字是概率结构的标准表述"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">跳表：高速公路(索引层)-国道-县道(底层)，能右则右不能则下楼</text>\n<g stroke=\"var(--line)\" stroke-width=\"1.5\">\n<line x1=\"70\" y1=\"50\" x2=\"70\" y2=\"250\"/>\n<line x1=\"610\" y1=\"50\" x2=\"610\" y2=\"250\"/>\n</g>\n<text x=\"60\" y=\"130\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">L2</text>\n<text x=\"60\" y=\"190\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">L1</text>\n<text x=\"60\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">L0</text>\n<rect x=\"90\" y=\"100\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"116\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">3</text>\n<rect x=\"240\" y=\"100\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"266\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">18</text>\n<rect x=\"440\" y=\"100\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"466\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">40</text>\n<line x1=\"142\" y1=\"113\" x2=\"238\" y2=\"113\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"292\" y1=\"113\" x2=\"438\" y2=\"113\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<rect x=\"90\" y=\"150\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"116\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">3</text>\n<rect x=\"170\" y=\"150\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"196\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">9</text>\n<rect x=\"240\" y=\"150\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"266\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">18</text>\n<rect x=\"340\" y=\"150\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--ink)\"/>\n<text x=\"366\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">27</text>\n<rect x=\"440\" y=\"150\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"466\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">40</text>\n<rect x=\"540\" y=\"150\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"566\" y=\"168\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">51</text>\n<line x1=\"142\" y1=\"163\" x2=\"168\" y2=\"163\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"222\" y1=\"163\" x2=\"238\" y2=\"163\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"292\" y1=\"163\" x2=\"338\" y2=\"163\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"392\" y1=\"163\" x2=\"438\" y2=\"163\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"492\" y1=\"163\" x2=\"538\" y2=\"163\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<rect x=\"90\" y=\"200\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"116\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">3</text>\n<rect x=\"170\" y=\"200\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"196\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">9</text>\n<rect x=\"240\" y=\"200\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"266\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">18</text>\n<rect x=\"340\" y=\"200\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"366\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">27</text>\n<rect x=\"440\" y=\"200\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"466\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">40</text>\n<rect x=\"540\" y=\"200\" width=\"52\" height=\"26\" rx=\"4\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"566\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">51</text>\n<line x1=\"142\" y1=\"213\" x2=\"168\" y2=\"213\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"222\" y1=\"213\" x2=\"238\" y2=\"213\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"292\" y1=\"213\" x2=\"338\" y2=\"213\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"392\" y1=\"213\" x2=\"438\" y2=\"213\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"492\" y1=\"213\" x2=\"538\" y2=\"213\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<text x=\"420\" y=\"70\" font-size=\"12\" fill=\"var(--accent)\">查找 27：L2 走到 18 → 下楼 L1 → 40 太大 → 下楼 L0 → 27</text>\n<text x=\"320\" y=\"292\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">Redis p=1/4，期望指针 1.33；ZSet 选跳表因范围查询/实现简单/并发友好/内存省</text>\n</svg>",
    "caption": "图：跳表多层索引结构，查找路径'能右则右不能则下楼'"
   },
   {
    "t": "h",
    "text": "红黑树：近似平衡的工程选择"
   },
   {
    "t": "p",
    "text": "红黑树五条性质（根黑、叶黑、红节点的孩子黑、黑高一致）推出最长路径不超过最短的 2 倍——这就是'近似平衡'。靠变色和旋转维持，插入最多两次旋转、删除最多三次——比 AVL（严格平衡但调整次数多）更适合增删查混合的工程场景。所以 TreeMap、HashMap 树化、Linux epoll 的 fd 集合、CFS 调度器全用红黑树。笔试不会让你手写红黑树（分支情况太繁琐），但性质、与 AVL/跳表/B+ 树的选型对比必须张口就来。与 B+ 树辨析：红黑树管内存、B+ 树管磁盘（节点对齐磁盘页）。"
   },
   {
    "t": "h",
    "text": "线段树与树状数组：区间查询的左右手"
   },
   {
    "t": "p",
    "text": "线段树是'分治思想的数组实现'：用树节点表示区间，构建 O(n)，查询/更新 O(logn)，支持区间求和、最大值、区间更新（懒标记）。游戏场景：工会战伤害区间统计、全服玩家等级区间分布实时查询、活动进度区间汇总。树状数组（Fenwick Tree）是线段树的轻量版：只支持前缀查询 + 单点更新（O(logn)），lowbit 驱动下标移动，实现极短。区别：树状数组能做的线段树都能做，但线段树支持区间更新；树状数组代码量小、常数小。面试说'树状数组是线段树的简化，生产用线段树或现成库'就够。"
   },
   {
    "t": "code",
    "lang": "java",
    "code": "// 树状数组：单点更新 + 前缀查询，O(logn)\npublic class Fenwick {\n    private final int[] tree;\n    public Fenwick(int n) { tree = new int[n + 1]; }\n    private int lowbit(int x) { return x & (-x); }\n    public void add(int i, int delta) {\n        while (i < tree.length) {\n            tree[i] += delta;\n            i += lowbit(i);\n        }\n    }\n    public int prefix(int i) {   // 求前 i 个元素和\n        int sum = 0;\n        while (i > 0) {\n            sum += tree[i];\n            i -= lowbit(i);\n        }\n        return sum;\n    }\n}\n// 游戏场景：在线玩家按等级实时计数，前缀查询'某等级段以上多少人'\n// 排行榜前缀名次：ZSet 的 rank 类似能力（跳表 span 字段）\n\n// 线段树（区间求和版）：build / query / update 均为 O(logn)"
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">线段树：分治区间，[1,8] 的求和与更新路径</text>\n<rect x=\"300\" y=\"50\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\" stroke-width=\"2\"/>\n<text x=\"330\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">[1,8]</text>\n<rect x=\"160\" y=\"100\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"190\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">[1,4]</text>\n<rect x=\"440\" y=\"100\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"470\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">[5,8]</text>\n<rect x=\"60\" y=\"150\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"90\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">[1,2]</text>\n<rect x=\"250\" y=\"150\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--ink)\"/>\n<text x=\"280\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">[3,4]</text>\n<rect x=\"410\" y=\"150\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"440\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">[5,6]</text>\n<rect x=\"520\" y=\"150\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"550\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">[7,8]</text>\n<line x1=\"320\" y1=\"80\" x2=\"195\" y2=\"100\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"340\" y1=\"80\" x2=\"465\" y2=\"100\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"180\" y1=\"130\" x2=\"95\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"200\" y1=\"130\" x2=\"275\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"460\" y1=\"130\" x2=\"425\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<line x1=\"480\" y1=\"130\" x2=\"545\" y2=\"150\" stroke=\"var(--line)\" stroke-width=\"1.5\"/>\n<rect x=\"60\" y=\"230\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"90\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a1</text>\n<rect x=\"120\" y=\"230\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"150\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a2</text>\n<rect x=\"250\" y=\"230\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"280\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a3</text>\n<rect x=\"310\" y=\"230\" width=\"60\" height=\"30\" rx=\"5\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"340\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--ink)\">a4</text>\n<text x=\"470\" y=\"250\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">叶子存原始数据</text>\n<text x=\"470\" y=\"270\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">区间查询 [l,r] 拆分合并</text>\n<text x=\"470\" y=\"290\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">树状数组 = 轻量版前缀查询</text>\n<text x=\"200\" y=\"300\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">构建 O(n)，查询/更新 O(logn)，懒标记支持区间更新</text>\n</svg>",
    "caption": "图：线段树分治区间结构，查询/更新沿树路径 O(logn)"
   },
   {
    "t": "h",
    "text": "左偏堆与单调队列"
   },
   {
    "t": "p",
    "text": "左偏堆（Leftist Heap）：可合并堆，合并 O(logn)，dist 字段保证合并沿右路径走。游戏场景：K 路归并（海量日志合并）、多个排行榜小堆的批量合并。单调队列前面讲过（数组篇），这里强调它的本质：滑动窗口内 O(1) 取极值，双端队列维护单调性，队头是极值、过期出队。它是'数据结构思想'的收官：所有高级结构都是'换一种存储，换一种复杂度'。生产建议：除非算法岗，游戏开发直接用现成库（Redis ZSet、JDK PriorityQueue、Guava），但要知道它们背后的结构才能选对——这就是面试考思想的全部意义。"
   },
   {
    "t": "pits",
    "items": [
     "跳表把'期望 O(logn)'说成'保证 O(logn)'：概率结构的标准表述是期望，说保证就被抓",
     "跳表 insert 忘记记录每层前驱 update[]：这是手写题的关键数据结构，漏了插入无法逐层链接",
     "ZSet 选跳表理由记不全：范围查询、实现简单、并发友好、内存更省（1.33 vs 2 指针）",
     "红黑树试图手写插入分支：笔试不考手写，讲清性质 + 与 AVL/跳表/B+ 树选型即可，硬写陷泥潭",
     "树状数组下标从 0 开始：Fenwick 必须 1-based（tree[n+1]），add/query 循环边界写错",
     "线段树懒标记不处理：区间更新不 push 会覆盖未下传的修改，结果错",
     "左偏堆合并忘维护 dist：dist 是左偏的保证，合并后必须更新",
     "优先级队列大小顶搞反：JDK PriorityQueue 默认小顶堆（堆顶最小），TopK 大的用小顶堆守门员",
     "高级结构生产乱造轮子：能用 ZSet/PriorityQueue/现成库就用，手写只在笔试和定制场景"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：跳表（概率平衡）、红黑树（近似平衡）、线段树/树状数组（区间 O(logn)）、左偏堆（可合并堆）。思想是'换存储换复杂度'。游戏落地：排行榜 ZSet、等级分布查询、区间统计。关联题库：algorithm-08、algorithm-09。"
   }
  ]
 },
 {
  "id": "algorithm-methodology",
  "title": "算法面试方法论",
  "layer": 3,
  "depends": [
   "algorithm-complexity"
  ],
  "covers": [
   "algorithm-01",
   "algorithm-03"
  ],
  "quiz": [
   "algorithm-01",
   "algorithm-03"
  ],
  "body": [
   {
    "t": "lead",
    "text": "笔试上机不是考刷题量，是考'30 分钟内完成一道题'的工程化能力：快速识别题型、手写代码规范、主动叙述复杂度、处理边界用例。方法论是把平时积累变成考场上稳定输出的流程。"
   },
   {
    "t": "pre",
    "items": [
     "已完成前 15 篇的知识积累",
     "做过题库里的手写题（LRU、反转链表、二分等）",
     "理解复杂度分析（见复杂度篇）"
    ]
   },
   {
    "t": "h",
    "text": "刷题路线：30 天四阶段"
   },
   {
    "t": "list",
    "items": [
     "第 1 周（地基）：复杂度 + 数组双指针 + 链表 + 栈队列，每天 2 道经典，吃透模板不贪多",
     "第 2 周（核心）：哈希 + 二叉树 + 排序 + 二分，重复练习到'闭眼能写'标准（反转链表、快排、lower_bound、层序）",
     "第 3 周（进阶）：DP + 贪心回溯 + 图论，重点练识别题型（背包/子序列/区间）而非背代码",
     "第 4 周（实战）：高频手写题（LRU/令牌桶/线程池）+ 字符串匹配 + 海量数据，按 30 分钟计时模拟笔试，每次写完复盘边界用例",
     "每天节奏：新题 1~2 道 + 旧题复习 1 道，周日统一复盘本周错题",
     "游戏向重点：LRU、一致性哈希、限流器、TopK、二分变体是成都游戏公司笔试高频，优先保证"
    ]
   },
   {
    "t": "svg",
    "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"320\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--ink)\">30 天刷题路线：四阶段递进</text>\n<rect x=\"40\" y=\"60\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"105\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">第 1 周 地基</text>\n<text x=\"105\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">复杂度/数组/链表/栈</text>\n<text x=\"105\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">吃透模板</text>\n<rect x=\"185\" y=\"60\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv1)\"/>\n<text x=\"250\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">第 2 周 核心</text>\n<text x=\"250\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">哈希/树/排序/二分</text>\n<text x=\"250\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">闭眼能写</text>\n<rect x=\"330\" y=\"60\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv1-bg)\" stroke=\"var(--lv2)\"/>\n<text x=\"395\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">第 3 周 进阶</text>\n<text x=\"395\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">DP/贪心回溯/图</text>\n<text x=\"395\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">识别题型</text>\n<rect x=\"475\" y=\"60\" width=\"130\" height=\"70\" rx=\"8\" fill=\"var(--lv3-bg)\" stroke=\"var(--lv3)\"/>\n<text x=\"540\" y=\"86\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--ink)\">第 4 周 实战</text>\n<text x=\"540\" y=\"108\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">手写高频/海量数据</text>\n<text x=\"540\" y=\"124\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">30 分钟计时模拟</text>\n<line x1=\"170\" y1=\"95\" x2=\"183\" y2=\"95\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#m1)\"/>\n<line x1=\"315\" y1=\"95\" x2=\"328\" y2=\"95\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#m1)\"/>\n<line x1=\"460\" y1=\"95\" x2=\"473\" y2=\"95\" stroke=\"var(--line)\" stroke-width=\"2\" marker-end=\"url(#m1)\"/>\n<defs><marker id=\"m1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"var(--line)\"/></marker></defs>\n<text x=\"320\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">每天：新题 1~2 + 旧题复习 1，周日复盘错题</text>\n<rect x=\"60\" y=\"200\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--panel)\" stroke=\"var(--line)\"/>\n<text x=\"180\" y=\"222\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">优先保证（游戏公司高频）</text>\n<text x=\"180\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">LRU / 一致性哈希 / 限流 / TopK / 二分变体</text>\n<rect x=\"340\" y=\"200\" width=\"240\" height=\"52\" rx=\"8\" fill=\"var(--accent-soft)\" stroke=\"var(--accent)\"/>\n<text x=\"460\" y=\"222\" text-anchor=\"middle\" font-size=\"13\" fill=\"var(--ink)\">质量 > 数量</text>\n<text x=\"460\" y=\"242\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">10 道吃透 > 100 道背过，每道写注释+复杂度</text>\n<text x=\"320\" y=\"290\" text-anchor=\"middle\" font-size=\"12\" fill=\"var(--muted)\">错题本：记录'识别错题型/边界漏用例/复杂度记错'三类错误</text>\n</svg>",
    "caption": "图：30 天四阶段刷题路线，游戏公司高频题优先"
   },
   {
    "t": "h",
    "text": "笔试上机的 30 分钟流程"
   },
   {
    "t": "p",
    "text": "拿到题先花 3 分钟干三件事：读清输入输出约束（n 的范围决定算法）、识别题型（连续区间→滑窗/DP、有序→二分、成对→哈希、组合→回溯、最短路→图）、预估复杂度。再花 5 分钟想样例：手推一个中小样例，验证状态转移或边界。然后写代码：先骨架后细节，注释标出关键步骤（如'倒序防止重复取'）。写完必做两件事：主动过边界用例（空、单元素、全相同、最大输入）和说复杂度。最后 5 分钟复盘：有没有更优解、有没有边界遗漏。这套流程的价值是'让正确性可预期'，不慌不超时。"
   },
   {
    "t": "h",
    "text": "代码风格与叙述技巧"
   },
   {
    "t": "list",
    "items": [
     "命名清晰：left/right/curr/prev/pivot/dp，别用 a/b/c 缩写",
     "防御性开头：空数组、null 直接返回，游戏里也能避免 NPE 事故",
     "每段代码附一句注释：解释'为什么'不是'是什么'，考官会看到你的工程习惯",
     "写完主动说复杂度：'时间 O(n)、空间 O(1)，原地操作'——这是面试官判断熟练度的直接信号",
     "叙述顺序：结论先行（数据结构选型）→ 操作流程 → 边界处理 → 复杂度，和你答系统设计一个套路",
     "不会的题说思路：哪怕代码没写完，把暴力解 + 优化方向讲清楚，比闷头写强，考官看的是思考过程"
    ]
   },
   {
    "t": "h",
    "text": "快速分析题目类型"
   },
   {
    "t": "table",
    "head": [
     "特征信号",
     "题型",
     "首选思路"
    ],
    "rows": [
     [
      "连续子数组/子串 + 最优",
      "滑动窗口/DP",
      "先滑窗，不满足单调再 DP"
     ],
     [
      "有序数组 + 查找/边界",
      "二分",
      "lower_bound 模板，关注边界"
     ],
     [
      "成对/求和/去重",
      "哈希",
      "存位置/存计数三招"
     ],
     [
      "组合/排列/子集",
      "回溯",
      "选择-探索-撤销模板"
     ],
     [
      "图/依赖/最短路径",
      "图论",
      "邻接表 + BFS/DFS/Dijkstra"
     ],
     [
      "最大/最小 + 可决策单调",
      "贪心/二分答案",
      "先证贪心，证不了二分答案或 DP"
     ],
     [
      "第 K 大 / TopK",
      "堆/快选",
      "小顶堆 O(nlogK) 或快选 O(n)"
     ],
     [
      "值域小 + 计数",
      "计数/桶排序",
      "O(n) 桶，值域远小于数据量时"
     ],
     [
      "递归可枚举 + 重叠子问题",
      "DP",
      "暴力递归→记忆化→填表"
     ]
    ]
   },
   {
    "t": "pits",
    "items": [
     "拿到题直接写代码：先花 3 分钟读约束/识别题型/估复杂度，代码方向错了全白费",
     "只背模板不懂识别信号：滑窗和 DP 都处理'连续区间'，识别信号是'窗口单调可收缩'",
     "代码全用缩写命名：left/right/curr 是基础素养，考官看命名判断工程水平",
     "写完不说复杂度：主动说'时间 O(n)、空间 O(1)'是送分动作，不说就是丢分",
     "不过边界用例就交卷：空、单元素、全相同、最大 n，过一遍能救回大部分 bug",
     "手写题不写注释：关键步骤（倒序、惰性补充、哨兵）注释一句，展示理解深度",
     "不会的题闷头写不交流：讲思路 + 暴力到优化，比卡住强",
     "30 分钟超时不会取舍：先写对暴力版再优化，保证有产出"
    ]
   },
   {
    "t": "callout",
    "kind": "tip",
    "text": "小结：方法论 = 30 天四阶段刷题 + 30 分钟标准流程 + 工程化代码风格 + 题型识别表。对 10 年游戏人：把复杂度与帧预算、手写题与真实场景挂钩，是纯刷题选手无法复制的加分项。关联题库：algorithm-01、algorithm-03。"
   }
  ]
 }
]
};
