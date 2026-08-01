window.QB = window.QB || {};
window.QB["spring"] = {
  "id": "spring",
  "name": "Spring 与 SpringBoot",
  "icon": "🌱",
  "desc": "面向游戏服务器候选人的 Spring 全家桶复习：IOC/AOP/事务/MVC 原理打底，自动装配与 starter 深挖，重点结合 GM 后台（RuoYi）、游戏服 Handler 管理与支付回调事务一致性场景。",
  "questions": [
    {
      "id": "spring-01",
      "level": 1,
      "q": "什么是 IOC 和 DI？Spring 的 IOC 容器到底解决了什么问题？",
      "a": "一句话：IOC 是把对象的创建和依赖组装权从代码反转给容器，DI 是容器把依赖注入给对象的方式，核心解决的是对象间耦合问题。\n1. IOC（控制反转）：传统写法是 new Service()、new Dao()，谁使用谁创建，类之间硬编码耦合；IOC 后由容器统一创建、装配、管理 Bean，类只声明“我需要什么”，不关心“怎么来的”。\n2. DI（依赖注入）三种方式：构造器注入（官方推荐，依赖不可变、便于测试、可配 final）、Setter 注入（可选依赖）、字段注入 @Autowired（最常用但隐藏依赖，不利于单测）。\n3. 容器两大核心接口：BeanFactory（顶层接口，懒加载）和 ApplicationContext（企业级实现，启动时预实例化单例 Bean，还提供事件发布、国际化、资源加载等能力）。\n4. 收益：解耦、可配置（换实现不改代码）、便于管理单例/生命周期/AOP 代理。",
      "followups": [
        {
          "q": "为什么官方推荐构造器注入？字段注入有什么坑？",
          "a": "构造器注入保证依赖不可变（可配 final）、对象构造完即可用、依赖关系显式可见、便于单测手动 new。字段注入隐藏依赖、不能 final、靠反射塞值不利于测试，还会掩盖循环依赖。"
        },
        {
          "q": "BeanFactory 和 ApplicationContext 的区别？你们项目里用的是哪个？",
          "a": "BeanFactory 是顶层接口、懒加载；ApplicationContext 启动时预实例化单例，并额外提供事件发布、国际化、资源加载。企业项目（含 GM 后台）都用 ApplicationContext。"
        },
        {
          "q": "如果没有 Spring，你们游戏服的 Handler 依赖关系怎么管理？",
          "a": "只能自写工厂或注册表手动 new 并层层传依赖，改一处依赖动一串代码。引入 Spring 正是为了把 Handler 的装配、单例管理和生命周期托管给容器。"
        }
      ],
      "memory": "类比餐厅后厨：IOC 是“食材采购交给采购部”，DI 是“配菜员把食材递到厨师手里”，厨师只管炒菜，不管买米。",
      "tags": [
        "IOC",
        "DI",
        "容器"
      ],
      "point": "考察是否理解 IOC 解决的是对象耦合与生命周期托管问题，而非只会背概念定义。",
      "approach": "先一句话给定义（创建与组装权反转给容器）→ 对比传统 new 写法说清解决什么耦合 → 讲三种注入方式并表态推荐构造器 → 提 BeanFactory 与 ApplicationContext 分层 → 落到项目解耦例子。坑：别把 IOC 和 DI 说成并列技术，DI 是实现手段。"
    },
    {
      "id": "spring-02",
      "level": 1,
      "q": "Bean 的作用域有哪些？游戏服业务 Handler 用单例有什么要注意的？",
      "a": "一句话：默认 singleton，还有 prototype、request/session/application/websocket 等 Web 作用域。\n1. singleton：容器内唯一实例，无状态的 Bean 才安全（Service/Dao/Handler 都是无状态逻辑，共享无问题）。\n2. prototype：每次注入新建，有状态对象用，Spring 只管创建不管销毁。\n3. Web 作用域：request/session 底层靠代理实现，注入的其实是代理对象。\n4. 结合游戏服：登录服/游戏服里的消息分发 Handler 全是 singleton，Handler 本身绝不能存玩家状态——状态要放玩家对象（Player）或缓存里，Handler 只操作传进来的上下文。若把“当前玩家”写进 Handler 字段，单例下所有玩家共享一个字段，就是串号事故。解决：状态随方法参数传递（如 PlayerSession 上下文），或 ThreadLocal（但 Netty 异步线程模型下慎用 ThreadLocal）。",
      "followups": [
        {
          "q": "单例 Bean 里能不能用成员变量？什么情况下可以？",
          "a": "可以，但只能放无状态共享物：final 依赖、配置、常量、只读缓存。放可变的业务状态（当前玩家、临时计数）并发下立刻串数据。"
        },
        {
          "q": "Netty 业务线程模型下为什么 ThreadLocal 不安全？",
          "a": "ThreadLocal 绑的是线程不是连接。Netty 中同一 channel 的连续消息可能被不同 EventLoop 或消费线程处理，换线程就拿到别人的数据——比拿不到更危险。"
        },
        {
          "q": "prototype 的 Bean 注入到单例 Bean 里会发生什么？怎么解决？",
          "a": "单例只装配一次，prototype 退化成单例。解法：@Lookup 方法注入、注入 ObjectFactory/Provider 每次 getObject()、或直接注入 ApplicationContext 按需 getBean。"
        }
      ],
      "memory": "单例 Handler 是“公用锅铲”：谁都能用，但锅里装的是哪个玩家的菜（状态）不能贴在锅铲上。",
      "tags": [
        "作用域",
        "singleton",
        "游戏服"
      ],
      "point": "考察是否理解单例 Bean 的共享本质与无状态设计原则，而非背六种作用域名称。",
      "approach": "先给默认 singleton 结论 → 简列 prototype 与 Web 作用域 → 重点切游戏服：Handler 单例必须无状态，状态放 Player 或上下文 → 举串号反例 → 给方案并主动提 Netty 下 ThreadLocal 的坑。坑：只背作用域列表不结合项目是大忌。"
    },
    {
      "id": "spring-03",
      "level": 1,
      "q": "说一遍 Spring Bean 的完整生命周期。",
      "a": "一句话：实例化 → 属性填充 → 初始化前后回调 → 使用中 → 销毁。\n1. 实例化：createBeanInstance，反射调用构造器创建对象（此时属性还没注入）。\n2. 属性填充：populateBean，处理 @Autowired/@Value 等依赖注入。\n3. Aware 回调：BeanNameAware、BeanFactoryAware、ApplicationContextAware（拿到容器引用）。\n4. BeanPostProcessor.postProcessBeforeInitialization：初始化前处理。\n5. 初始化：@PostConstruct 方法 → InitializingBean.afterPropertiesSet() → 自定义 init-method。\n6. BeanPostProcessor.postProcessAfterInitialization：初始化后处理，AOP 代理就是在这里生成并替换原 Bean。\n7. 使用：Bean 就绪进容器。\n8. 销毁：容器关闭时，@PreDestroy → DisposableBean.destroy() → destroy-method。\n记忆顺序：构造→注入→Aware→前置→@PostConstruct→afterPropertiesSet→init→后置（AOP）→销毁。",
      "followups": [
        {
          "q": "AOP 代理是在生命周期哪一步生成的？如果 Bean 在 @PostConstruct 里被引用会怎样？",
          "a": "在初始化后的 postProcessAfterInitialization 生成。@PostConstruct 执行时拿到的 this 还是原始对象，此时把 this 注册出去，外部拿到的就是未代理对象，AOP 失效。"
        },
        {
          "q": "@PostConstruct 和 afterPropertiesSet 和 init-method 的执行顺序？",
          "a": "@PostConstruct（JSR-250 注解）→ InitializingBean.afterPropertiesSet（Spring 接口）→ 自定义 init-method。记法：先规范、再接口、后配置。"
        },
        {
          "q": "BeanPostProcessor 和 BeanFactoryPostProcessor 的区别？",
          "a": "前者操作 Bean 实例，在每个 Bean 初始化前后回调，能返回代理；后者操作 BeanDefinition（定义），在所有 Bean 实例化之前执行，改的是图纸。"
        }
      ],
      "memory": "口诀：生(实例化)填(填充)觉(Aware)前(前置)初(初始化)后(后置AOP)亡(销毁)——“生填觉前初后亡”。",
      "tags": [
        "Bean生命周期",
        "BeanPostProcessor"
      ],
      "point": "考察对 Bean 生命周期全流程及扩展点位置的记忆，尤其 AOP 代理生成时机。",
      "approach": "先抛主干口诀（实例化→填充→Aware→前置→初始化→后置→销毁）→ 按序展开每步干什么 → 强调 AOP 代理在初始化后阶段生成并替换原 Bean → 口诀收尾。坑：漏 Aware 和 BeanPostProcessor 回调、顺序说错，比说不全更减分。"
    },
    {
      "id": "spring-04",
      "level": 1,
      "q": "SpringMVC 的一次请求处理流程是怎样的？（画 DispatchServlet 主流程）",
      "a": "一句话：DispatchServlet 是总调度，拿到请求后按“找 Handler → 调适配器执行 → 渲染视图”三步走。\n1. 请求进入 DispatcherServlet（前端控制器）。\n2. HandlerMapping（如 RequestMappingHandlerMapping）根据 URL 找到对应 HandlerMethod（Controller 方法），返回 HandlerExecutionChain（含拦截器链）。\n3. 拦截器 preHandle 逐个执行，false 则中断。\n4. HandlerAdapter（RequestMappingHandlerAdapter）执行：参数解析器（HandlerMethodArgumentResolver）解析 @RequestBody/@RequestParam/路径变量 → 反射调用 Controller 方法 → 返回值处理器（HandlerMethodReturnValueHandler）用 HttpMessageConverter（Jackson）把返回值转 JSON 写回响应。\n5. 拦截器 postHandle、afterCompletion（无论成败都执行）。\n6. 异常统一走 HandlerExceptionResolver（@ControllerAdvice）。\n你们 GM 后台（RuoYi）的请求就是这么流转的：JWT/登录拦截器在 preHandle 校验 Token，@PreAuthorize 注解权限由 Security/AOP 处理，业务异常被 @RestControllerAdvice 统一包装成 AjaxResult。",
      "followups": [
        {
          "q": "HandlerMapping 和 HandlerAdapter 为什么要分开两个组件？",
          "a": "职责分离加开闭原则：Mapping 只负责找，Adapter 只负责调。新增一种 Handler 类型只需加对应 Adapter，不动 Mapping，两者可独立扩展。"
        },
        {
          "q": "RuoYi 里登录校验为什么用拦截器而权限用 @PreAuthorize？两者执行顺序谁在前？",
          "a": "拦截器在 DispatcherServlet 内、Controller 前执行；@PreAuthorize 是 AOP 代理在方法调用时生效。拦截器在前，先认证后授权，层次清晰。"
        },
        {
          "q": "如果 Controller 抛异常，拦截器的 afterCompletion 还会执行吗？",
          "a": "会。afterCompletion 类似 finally，无论成功还是异常都回调；只有 preHandle 返回 false 中断时，仅已放行的拦截器会收到 afterCompletion。"
        }
      ],
      "memory": "类比游戏服消息分发：DispatcherServlet=协议分发器，HandlerMapping=按协议号找 Handler，拦截器=登录态校验，Adapter=解码+执行+编码回包。",
      "tags": [
        "SpringMVC",
        "DispatcherServlet",
        "RuoYi"
      ],
      "point": "考察 DispatcherServlet 调度主流程的掌握及与自身项目的映射。",
      "approach": "先给主干：找 Handler、适配执行、渲染返回 → 按序讲 Mapping、拦截器链、Adapter 参数解析与返回值处理 → 补异常走 HandlerExceptionResolver → 落到 RuoYi 的 Token 拦截器与统一异常包装。坑：别混淆两者职责。"
    },
    {
      "id": "spring-05",
      "level": 1,
      "q": "SpringBoot 相比 Spring 到底“Boot”了什么？约定大于配置体现在哪？",
      "a": "一句话：SpringBoot 解决的是 Spring 配置繁琐、依赖版本地狱、部署复杂三大痛点。\n1. 自动装配：@EnableAutoConfiguration 按条件自动装配 Bean，不用手写 XML/@Configuration。\n2. starter 依赖：spring-boot-starter-web 一个依赖聚合了 web 全套（Tomcat、MVC、Jackson），且父 POM 管理版本仲裁，不用关心版本兼容。\n3. 内嵌容器：Tomcat 内嵌进 jar，java -jar 直接跑，对运维友好。\n4. 外部化配置：application.yml + @ConfigurationProperties，多环境 profile。\n5. Actuator：生产级监控端点。\n约定大于配置例子：静态资源默认放 /static、模板默认 /templates、端口默认 8080、扫描默认主类同包及子包。这些约定在 GM 后台重构（SpringBoot+若依）里直接受益——相比老 SSH/SSM 项目动辄几百行 XML，新项目几乎零 XML。",
      "followups": [
        {
          "q": "你们重构 GM 后台时，老项目是什么技术栈？迁移到 SpringBoot 最大的收益是什么？",
          "a": "老项目多为 SSM/SSH，XML 配置动辄几百行、版本冲突频发。迁移后几乎零 XML、父 POM 版本仲裁、java -jar 一键部署，配置与运维成本大幅下降。"
        },
        {
          "q": "为什么 @SpringBootApplication 默认只扫描同包及子包？想扫别的包怎么办？",
          "a": "约定大于配置，避免全 classpath 扫描拖慢启动。要扫其他包用 scanBasePackages 显式指定，或把主类放到根包覆盖更多模块。"
        },
        {
          "q": "application.yml 和 bootstrap.yml 加载顺序？",
          "a": "bootstrap 先于 application 加载，但它只在引入 SpringCloud 配置中心依赖时存在，负责拉远程配置。纯 SpringBoot 项目没有 bootstrap 阶段。"
        }
      ],
      "memory": "Spring 是毛坯房（自己设计装修），SpringBoot 是精装房（拎包入住，不满意再砸墙）。",
      "tags": [
        "SpringBoot",
        "约定大于配置",
        "GM后台"
      ],
      "point": "考察能否说清 SpringBoot 解决的三大痛点，而非罗列特性名词。",
      "approach": "先点明三大痛点（配置繁琐、依赖版本地狱、部署复杂）→ 逐条对应解法：自动装配、starter 聚合、内嵌容器、外部化配置 → 举约定的具体例子 → 结合 GM 后台重构对比老 SSM 讲收益。坑：别把 SpringBoot 说成替代 Spring，它是 Spring 之上的封装与约定层。"
    },
    {
      "id": "spring-06",
      "level": 1,
      "q": "Spring 的 @Transactional 常用属性有哪些？默认对什么异常回滚？",
      "a": "一句话：@Transactional 核心属性是传播级别、隔离级别、超时、只读、回滚规则；默认只对 RuntimeException 和 Error 回滚。\n1. propagation：REQUIRED（默认，有事务加入无则新建）、REQUIRES_NEW、NESTED 等 7 种。\n2. isolation：DEFAULT（随数据库，MySQL 默认 RR）、RC、RR、SERIALIZABLE。\n3. rollbackFor：指定哪些异常回滚。默认 unchecked 异常（RuntimeException/Error）回滚，checked 异常（如 IOException）不回滚——所以业务里要么抛 RuntimeException，要么显式 rollbackFor = Exception.class。\n4. readOnly：提示数据库可优化（如路由只读库）。\n5. timeout：事务超时秒数。\n游戏项目实例：购买服下订单扣道具走事务，若代码 try-catch 吞了异常或抛 checked 异常，会出现“钱扣了、道具没发”或重复发货，必须显式 rollbackFor 并让异常抛出去。",
      "followups": [
        {
          "q": "为什么 checked 异常默认不回滚？你觉得这个设计合理吗？",
          "a": "设计初衷是 checked 异常代表可预期的业务情况，调用方应处理而非回滚。实践中极易踩坑，业界共识是业务统一抛 RuntimeException 或显式 rollbackFor。"
        },
        {
          "q": "readOnly=true 在 MySQL 主从架构下有什么用？",
          "a": "它是提示而非强制：部分中间件和驱动可据此把连接路由到只读库，数据库也可做相应优化。但不会真正禁止写操作，别当权限用。"
        },
        {
          "q": "timeout 超时后是立即回滚吗？",
          "a": "不是精确的立即中断。timeout 是提示性约束，事务操作发现超时时标记回滚，具体行为依赖数据库与驱动实现，别依赖它做精确限时。"
        }
      ],
      "memory": "口诀：默认只认“裸奔异常”（Runtime），checked 异常是“穿了马甲”，得 rollbackFor 点名才回滚。",
      "tags": [
        "事务",
        "@Transactional",
        "支付"
      ],
      "point": "考察对事务注解核心属性的掌握，尤其默认回滚规则这个高频线上事故点。",
      "approach": "先给最响结论：默认只对 RuntimeException/Error 回滚 → 分属性讲传播、隔离、回滚、只读、超时 → 重点讲 rollbackFor 与 checked 异常坑 → 用购买服钱扣了道具没发案例落地，带出吞异常衍生坑。坑：只背属性不讲默认回滚规则等于没答。"
    },
    {
      "id": "spring-07",
      "level": 1,
      "q": "Spring 事件机制（ApplicationEvent）用过吗？游戏里能怎么玩？",
      "a": "一句话：事件机制是容器内的观察者模式：publishEvent 发布事件，@EventListener 监听，实现发布者与订阅者解耦。\n三要素：\n1. 事件：继承 ApplicationEvent 或任意 POJO（Spring 4.2+）。\n2. 发布：applicationEventPublisher.publishEvent(new PlayerLoginEvent(playerId))。\n3. 监听：@EventListener 方法，或实现 ApplicationListener。\n游戏场景：\n1. 玩家登录后：发 LoginEvent，成就系统、七日签到、邮件推送各自监听，互不知道对方存在——避免登录 Handler 里堆一堆 if 调用，新增系统只需加个监听器。\n2. GM 后台（RuoYi）：操作日志 sys_oper_log 就可以用事件异步落库，不影响主请求。\n3. 异步事件：@Async + @EventListener 异步处理；注意异步后事务上下文/安全上下文不再传递，需要的数据要在事件对象里带全。\n4. 事务事件：@TransactionalEventListener(phase = AFTER_COMMIT) 保证事务提交后才触发，适合“充值成功后发公告”这类不能脏读的场景。",
      "followups": [
        {
          "q": "@EventListener 默认是同步还是异步？怎么改异步？有什么坑？",
          "a": "默认同步，在发布者线程内执行；加 @Async 改异步。坑：事务上下文、安全上下文、ThreadLocal 全部不传递，需要的数据必须在事件对象里带全。"
        },
        {
          "q": "@TransactionalEventListener 的 AFTER_COMMIT 和 BEFORE_COMMIT 区别？充值回调为什么必须用 AFTER_COMMIT？",
          "a": "AFTER_COMMIT 在事务提交后触发，BEFORE_COMMIT 在提交前。充值若在提交前发公告，事务随后回滚就出现公告发了、充值没成的事故。"
        },
        {
          "q": "如果监听器抛异常，会影响发布者吗？",
          "a": "同步监听会：异常沿调用链抛给发布者导致发布失败。异步监听不影响发布者，异常走 AsyncUncaughtExceptionHandler 处理。"
        }
      ],
      "memory": "事件机制就是游戏里的“世界频道喊话”：喊话的（发布者）不管谁在听，想听自己开频道（监听器），新系统上线=多开一个叫听频道，不改喊话人代码。",
      "tags": [
        "事件机制",
        "ApplicationEvent",
        "游戏架构"
      ],
      "point": "考察对容器内观察者模式的理解，及在游戏业务解耦中的落地设计能力。",
      "approach": "先定性：容器内观察者模式 → 讲三要素：事件、发布、监听 → 重点讲登录事件让成就、签到、邮件各自订阅 → 进阶讲 @Async 异步与事务事件监听器 → 点出异步丢上下文的坑。坑：别把 Spring 事件和 MQ 混谈，它是进程内机制。"
    },
    {
      "id": "spring-08",
      "level": 1,
      "q": "@Autowired 和 @Resource 有什么区别？多个同类型 Bean 怎么注入？",
      "a": "一句话：@Autowired 是 Spring 的按类型装配，@Resource 是 JSR-250 规范按名称装配。\n1. @Autowired：默认 byType；同类型多个 Bean 时报 NoUniqueBeanDefinitionException，需配合 @Qualifier(\"xxService\") 指定，或 @Primary 标记默认实现；支持 required = false。\n2. @Resource：JDK 注解，默认 byName（字段名当 Bean 名），找不到再按类型兜底；可显式 @Resource(name = \"xx\")。\n3. 同类型多实现的其他解法：注入 List<Interface>（Spring 自动收集所有实现，策略模式常用）、注入 Map<String, Interface>（key 为 Bean 名）。\n游戏服实战：协议 Handler 常用策略模式——定义 GameHandler 接口，每种协议一个实现类，启动时注入 Map<String, GameHandler> 或扫描注册到协议号→Handler 的路由表，消息来了按协议号路由，天然开闭原则：新协议=新 Handler 类，不改分发代码。",
      "followups": [
        {
          "q": "策略模式注入 List 时顺序怎么控制？",
          "a": "实现类上加 @Order 或实现 Ordered 接口，数值小的排在 List 前面。注意 @Order 只管集合注入等场景的排序，不管 Bean 实例化顺序。"
        },
        {
          "q": "你们游戏服的协议分发是不是这么实现的？协议号到 Handler 的映射是启动时建还是运行期建？",
          "a": "正是如此：启动时扫描所有 @Protocol 注解的 Handler 建立协议号到 Handler 的路由表，运行期只查表零反射，保证热路径性能。"
        },
        {
          "q": "@Primary 和 @Qualifier 同时存在谁生效？",
          "a": "@Qualifier 生效。它是调用方显式点名，优先级高于 @Primary 的默认兜底，遵循精确指定优先原则。"
        }
      ],
      "memory": "Autowired 是“按工种找人”（类型），Resource 是“点名叫人”（名字）；一堆同工种的人时用花名册（List/Map 全收）。",
      "tags": [
        "DI",
        "Autowired",
        "策略模式"
      ],
      "point": "考察两种注入注解的装配策略差异，及同类型多 Bean 的工程化解法（策略模式）。",
      "approach": "先给差异结论：Autowired 按类型、Resource 按名称 → 讲冲突解法 @Qualifier/@Primary → 进阶给出注入 List/Map 收集全部实现 → 落到游戏服协议 Handler 路由表这个杀手级例子，点明开闭原则。坑：只说区别不给多实现场景的解法，丢掉的正是考察重点。"
    },
    {
      "id": "spring-09",
      "level": 1,
      "q": "你们 GM 后台用若依 RuoYi 做权限，说说登录拦截器和数据权限的实现方式。",
      "a": "一句话：RuoYi 权限分三层——登录态用拦截器/Token 校验，功能权限用 @PreAuthorize + 权限字符，数据权限用 AOP 动态拼 SQL。\n1. 登录校验：登录后签发 JWT（RuoYi-Vue 版）存 Redis；后续请求经 TokenFilter/拦截器解析 Token、从 Redis 取 LoginUser 放入 SecurityContext/ThreadLocal，无 Token 或过期直接 401。\n2. 功能权限：菜单/按钮挂权限字符如 system:user:list，方法上 @PreAuthorize(\"@ss.hasPermi('system:user:list')\")，底层 Spring EL 调自定义 PermissionService 比对当前用户权限集合。\n3. 数据权限：@DataScope 注解 + AOP 切面，根据用户角色（本部门/本部门及以下/全部）给 Mapper SQL 动态拼 dept_id 过滤条件，SQL 拼到 params.dataScope。\n4. 菜单渲染：前端按用户权限树动态生成路由和按钮（v-hasPermi 指令）。\n面试时主动讲：这套设计和游戏 GM 需求契合——不同运营看到不同区服/不同数据，数据权限用 AOP 拼 SQL 的思路和游戏服“按渠道过滤可见玩家”是同一套路。",
      "followups": [
        {
          "q": "JWT 为什么存 Redis？无状态 Token 为什么还要服务端存储？",
          "a": "为了可控性：支持主动踢人下线、Token 续期、多端登录管理。纯无状态 JWT 签发后无法吊销，GM 场景要求封号即时生效。"
        },
        {
          "q": "数据权限 AOP 拼 SQL 有什么风险？（SQL 注入/性能）",
          "a": "拼接内容必须来自服务端会话而非前端传参，否则有注入风险；大表拼 dept 条件要确认走索引，否则全表扫描拖慢查询。"
        },
        {
          "q": "如果让你给游戏 GM 后台设计权限，RuoYi 这套够吗？区服维度权限怎么加？",
          "a": "基础够用。区服维度可仿照 @DataScope 做 @ServerScope 切面自动拼 server_id 条件；玩法级细粒度权限则扩展权限字符体系。"
        }
      ],
      "memory": "RuoYi 权限三把锁：门卡（登录拦截器）、房间钥匙（@PreAuthorize）、柜子里隔板（数据权限拼 SQL）。",
      "tags": [
        "RuoYi",
        "权限",
        "拦截器",
        "AOP"
      ],
      "point": "考察 RuoYi 三层权限模型的实现机制及向游戏区服维度的迁移。",
      "approach": "先给三层结论：登录态、功能权限、数据权限 → 逐层讲实现：JWT+Redis、@PreAuthorize 权限字符、@DataScope AOP 拼 SQL → 补前端权限树渲染 → 主动迁移到游戏场景：不同运营看不同区服，与按渠道过滤玩家同一套路。坑：别把三层混为一谈，要体现分层思维。"
    },
    {
      "id": "spring-10",
      "level": 2,
      "q": "Spring 怎么解决循环依赖？三级缓存每一级存什么？为什么三级而不是二级？",
      "a": "一句话：Spring 用三级缓存解决 setter/字段注入的单例循环依赖，构造器注入的循环依赖解决不了（直接抛异常）。\n三级缓存（DefaultSingletonBeanRegistry）：\n1. 一级 singletonObjects：成品 Bean（初始化完成）。\n2. 二级 earlySingletonObjects：半成品 Bean（实例化完、未填充属性），提前暴露引用。\n3. 三级 singletonFactories：ObjectFactory 工厂，存的是“能产出早期引用”的 lambda（getEarlyBeanReference）。\n流程：A 实例化 → 把 A 的 ObjectFactory 放入三级 → 填充属性时发现依赖 B → 创建 B → B 填充时依赖 A → 从三级缓存拿 A 的 ObjectFactory 生成早期引用（若 A 需要 AOP 代理，这一步就生成代理）放入二级 → B 完成进一级 → A 拿到 B 继续 → A 完成进一级。\n为什么必须三级：关键是 AOP。Bean 最终暴露的可能是代理对象而非原始对象，若只有二级缓存存早期裸对象，B 注入的就是未代理的 A，和容器里最终的代理 A 不是同一个对象，事务/AOP 失效。三级缓存的 ObjectFactory 保证“早期引用”和“最终 Bean”一致（需要代理时代理，不需要时原样），且延迟到真正被循环依赖时才生成，正常 Bean 不走代理提前生成。\n注意：prototype 不支持循环依赖；构造器循环依赖无解（构造时就要对方完整实例），可改 setter 或 @Lazy 解决。",
      "followups": [
        {
          "q": "构造器注入的循环依赖为什么解决不了？怎么破局？",
          "a": "构造时就要拿到对方完整实例，对方还没创建，死锁无解。破局：改 setter/字段注入，或一方加 @Lazy 注入延迟解析的代理。"
        },
        {
          "q": "如果 A 被 AOP 代理，B 注入的是代理还是原始对象？为什么？",
          "a": "注入的是代理。B 从三级缓存取 A 的 ObjectFactory 时，getEarlyBeanReference 会按需生成代理，保证与容器最终的 A 是同一对象。"
        },
        {
          "q": "SpringBoot 2.6+ 默认禁止循环依赖了（allow-circular-references=false），为什么官方这么做？",
          "a": "循环依赖是设计坏味道，掩盖职责划分问题且让启动行为难以推理。官方默认禁止是倒逼开发者显式开启、正视并消除它。"
        }
      ],
      "memory": "三级缓存=三个货架：成品架（一级）、半成品架（二级）、代工厂提货单（三级）——提货单保证你提前拿到的货和最终出厂的货是同一个（可能是包装过的代理）。",
      "tags": [
        "循环依赖",
        "三级缓存",
        "AOP"
      ],
      "point": "考察三级缓存的设计动机：保证 AOP 代理早期引用与最终 Bean 一致。",
      "approach": "先给结论：三级缓存解 setter/字段注入的单例循环依赖，构造器注入无解 → 讲三级各存什么 → 走一遍 A→B→A 的流程 → 重点答为什么必须三级：AOP 代理一致性，二级不够 → 补 prototype 不支持、Boot2.6 默认禁止等边界。坑：只背三级名字说不出二级为何不够，丢掉题眼。"
    },
    {
      "id": "spring-11",
      "level": 2,
      "q": "AOP 底层原理是什么？JDK 动态代理和 CGLIB 怎么选？SpringBoot 2.x 默认用哪个？",
      "a": "一句话：AOP 通过动态代理在目标方法执行前后织入增强逻辑，JDK 代理基于接口，CGLIB 基于继承字节码。\n1. 原理：BeanPostProcessor（AnnotationAwareAspectJAutoProxyCreator）在 Bean 初始化后判断是否匹配切点，匹配则用代理替换原 Bean 放入容器。\n2. JDK 动态代理：要求目标实现接口，Proxy.newProxyInstance 生成接口实现类，调用走 InvocationHandler。生成快、调用略慢（反射）。\n3. CGLIB：ASM 字节码生成目标类的子类，方法拦截走 MethodInterceptor。调用快（FastClass 索引直接调），生成慢；不能代理 final 类/final 方法。\n4. 选择规则（SpringBoot 2.x 起）：默认 proxyTargetClass=true，一律 CGLIB；Spring 5 经典规则是“有接口用 JDK，没接口用 CGLIB”。\n5. 游戏/后台实战坑：\n- Controller/Service 方法上加 @Transactional 失效排查第一步就是看是不是 final 方法或自调用。\n- RuoYi 的 @DataScope、@Log 注解都是 AOP 实现，Controller 没接口也生效——正因为 SpringBoot 2.x 默认 CGLIB。\n- 性能：代理调用有轻微开销，游戏服热路径（每帧/高频协议）别滥用 AOP，放 Disruptor 消费者链路里要控制切面数量。",
      "followups": [
        {
          "q": "为什么 JDK 代理必须有接口而 CGLIB 不用？CGLIB 为什么不能代理 final？",
          "a": "JDK 代理基于 Proxy.newProxyInstance，只能生成接口实现类；CGLIB 用 ASM 生成子类复写方法。final 类不能被继承、final 方法不能被复写，故无法增强。"
        },
        {
          "q": "同一个类里 this.a() 调用 this.b()，b 上的 @Transactional 为什么不生效？（自调用问题，怎么解决？）",
          "a": "this.b() 是原始对象内部调用，不经过代理入口，增强无从触发。解决：注入自身 Bean、AopContext.currentProxy()、或拆到不同 Bean。"
        },
        {
          "q": "怎么看一个 Bean 实际被哪种代理了？（AopUtils.isJdkDynamicProxy / isCglibProxy）",
          "a": "打印 bean.getClass()：类名带 $Proxy 是 JDK 代理，带 EnhancerBySpringCGLIB 是 CGLIB；编程判断用 AopUtils.isJdkDynamicProxy/isCglibProxy。"
        }
      ],
      "memory": "JDK 代理是“拿营业执照（接口）开店”，CGLIB 是“直接克隆一家一模一样的店（子类）”；SpringBoot 2.x 嫌看执照麻烦，一律克隆。",
      "tags": [
        "AOP",
        "动态代理",
        "CGLIB"
      ],
      "point": "考察两种动态代理的机制差异与选型规则，以及代理引发的典型失效场景认知。",
      "approach": "先讲原理：BeanPostProcessor 在初始化后生成代理替换原 Bean → 对比 JDK 与 CGLIB 机制和性能 → 给结论：Boot2.x 默认一律 CGLIB → 落到实战坑：final、自调用、热路径慎用。坑：还把有接口 JDK 无接口 CGLIB 当现行结论就露怯。"
    },
    {
      "id": "spring-12",
      "level": 2,
      "q": "事务传播行为 REQUIRED / REQUIRES_NEW / NESTED 有什么区别？充值回调场景怎么选？",
      "a": "一句话：REQUIRED 加入当前事务，REQUIRES_NEW 挂起当前事务独立提交，NESTED 在当前事务内建保存点。\n1. REQUIRED（默认）：外层有事务就加入，一起提交/回滚；无则新建。\n2. REQUIRES_NEW：挂起外层事务，新建独立事务，内层提交/回滚不影响外层（注意内层回滚抛异常会被外层感知，外层不 catch 就一起滚）。\n3. NESTED：JDBC savepoint 实现，嵌套在外层事务里；内层回滚只回滚到保存点，外层可 catch 后继续；外层回滚则内层一起回滚。\n充值回调实战（购买服）：第三方支付平台回调 → 校验签名 → 写订单流水 → 发放道具 → 更新玩家资产。\n- 整体必须一个事务（REQUIRED），否则“订单成功但道具没发”就是资损。\n- 写回调通知日志/操作日志用 REQUIRES_NEW：日志落库失败不应导致整个发货回滚。\n- 发放多种道具若允许部分失败重试，可用 NESTED 分段保存点。\n注意死锁：支付回调常并发重试，事务内按固定顺序（先订单后资产）加锁更新，减少死锁；回调幂等（订单号唯一索引 + 状态机校验）是前置条件，事务不解决幂等。",
      "followups": [
        {
          "q": "REQUIRES_NEW 挂起外层事务时用的是同一个数据库连接吗？连接池会怎么被消耗？",
          "a": "不是同一连接。挂起外层后内层从连接池另取连接，嵌套越深占用越多，高并发下容易打满连接池，要控制嵌套深度。"
        },
        {
          "q": "NESTED 在 MySQL 上依赖什么机制？为什么有的数据库不支持？",
          "a": "依赖 JDBC Savepoint 保存点机制，MySQL InnoDB 支持。本质仍是同一物理事务，数据库不支持保存点就无法用 NESTED。"
        },
        {
          "q": "支付回调的幂等设计具体怎么做？事务和幂等是什么关系？",
          "a": "订单号唯一索引加状态机 UPDATE WHERE status=PENDING 判断影响行数。事务保证原子性，幂等保证重试安全，二者互补缺一不可。"
        }
      ],
      "memory": "REQUIRED 是“拼车”（同生共死），REQUIRES_NEW 是“中途下车换自己车”（各走各的），NESTED 是“同一辆车里设里程碑”（回滚只退到里程碑）。",
      "tags": [
        "事务传播",
        "支付",
        "幂等"
      ],
      "point": "考察三种主流传播级别的语义差异，及支付回调场景的事务边界设计能力。",
      "approach": "先用类比给三者语义（拼车/换车/里程碑）→ 逐个讲机制：挂起、独立连接、保存点 → 落到充值回调：核心链路 REQUIRED、日志 REQUIRES_NEW、分段 NESTED → 主动补幂等设计与死锁防范。坑：别说漏「REQUIRES_NEW 内层回滚抛异常会波及外层」这个细节。"
    },
    {
      "id": "spring-13",
      "level": 2,
      "q": "@Transactional 哪些场景会失效？至少说出五种。",
      "a": "一句话：事务本质是 AOP 代理，凡是绕过代理或代理不生效的场景都会失效。\n1. 自调用：同类中 this.method() 直接调，不经过代理——最常见。解决：注入自身、AopContext.currentProxy()、拆分 Bean。\n2. 非 public 方法：Spring 事务只代理 public（CGLIB 子类复写限制，protected/private 不增强）。\n3. 异常被 catch 吞掉：try-catch 后没再抛，事务感知不到。解决：catch 里 rethrow 或 TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()。\n4. 异常类型不匹配：默认只回滚 RuntimeException/Error，checked 异常需 rollbackFor。\n5. 多线程：@Transactional 方法里 new Thread/CompletableFuture 里操作数据库，子线程不在事务上下文（事务绑定 ThreadLocal/连接）。游戏服常见坑：协议处理在 Netty 线程或 Disruptor 消费线程异步落库，事务注解加在上游是无效的。\n6. 数据库引擎：MyISAM 不支持事务，须 InnoDB。\n7. 传播级别用错：NOT_SUPPORTED/SUPPORTS 无事务。\n8. 同类 final 方法（CGLIB 无法代理）。",
      "followups": [
        {
          "q": "你们游戏服用 Disruptor 异步处理业务时，事务边界划在哪里？",
          "a": "只划在消费线程内的最终落库方法上，分发层和 IO 线程不开事务；批量落库任务作为整体一个事务，绝不跨线程传播事务上下文。"
        },
        {
          "q": "自调用为什么代理不生效？从代理机制原理上解释。",
          "a": "代理是包装对象：外部调用走代理进增强再调目标方法；自调用是目标对象内部 this 直调，根本不经过代理入口，增强逻辑无从触发。"
        },
        {
          "q": "大事务有什么危害？游戏里下单+发货+日志的大事务怎么拆？",
          "a": "长持连接与行锁，拖垮连接池并加剧死锁。拆法：核心资金操作一个本地事务，日志 REQUIRES_NEW 或事件异步，跨服通知走 MQ 最终一致。"
        }
      ],
      "memory": "失效口诀：自调私法（自调用/非public）吞异常（catch吞掉），错异常（checked）跨线程（ThreadLocal失效），引擎不对（MyISAM）传播乱（级别用错）。",
      "tags": [
        "事务失效",
        "AOP",
        "游戏服"
      ],
      "point": "考察对「事务即 AOP 代理」本质的理解，能否枚举并解释各类绕过代理的失效场景。",
      "approach": "先立总纲：一切失效都源于绕过代理或代理不生效 → 按类枚举：自调用、非 public、吞异常、异常类型、跨线程、引擎、传播级别 → 结合游戏服 Netty 异步线程重点讲跨线程失效 → 每类顺手给解法。坑：只列清单不讲原理显得靠背，每类都要说出为什么。"
    },
    {
      "id": "spring-14",
      "level": 2,
      "q": "SpringBoot 自动装配的原理是什么？从 @SpringBootApplication 讲到 spring.factories / AutoConfiguration.imports。",
      "a": "一句话：自动装配 = 条件注解 + 配置类清单加载，按条件批量注册 Bean。\n流程拆解：\n1. @SpringBootApplication 是三合一套壳：@SpringBootConfiguration（就是个 @Configuration）+ @EnableAutoConfiguration（自动装配开关）+ @ComponentScan（扫同包及子包）。\n2. @EnableAutoConfiguration 内部 @Import(AutoConfigurationImportSelector.class)。\n3. 该 Selector 的 selectImports() 读取配置类清单：\n- SpringBoot 2.x：META-INF/spring.factories 中 EnableAutoConfiguration 为 key 的类列表；\n- SpringBoot 3.x：META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports 文件（spring.factories 方式已废弃）。\n4. 清单先经 AutoConfigurationImportFilter / @Conditional 系列注解过滤：@ConditionalOnClass（类路径有该类才生效）、@ConditionalOnMissingBean（容器没有才装配）、@ConditionalOnProperty 等，只留满足条件的配置类。\n5. 过滤后的 @Configuration 类按普通配置解析，@Bean 方法注册 Bean（如 DataSourceAutoConfiguration 装配 DataSource）。\n6. 加载顺序控制：@AutoConfigureAfter/@Before、@AutoConfigureOrder。\n一句话答题模板：启动时 @EnableAutoConfiguration 触发 ImportSelector，读取 AutoConfiguration.imports 清单，经 @Conditional 过滤后按需装配。",
      "followups": [
        {
          "q": "SpringBoot 3.x 为什么废弃 spring.factories 改用 imports 文件？（GraalVM/AOT 友好，启动更快）",
          "a": "imports 文件每行一个类名，无需解析 properties 键值，对 AOT 编译期处理友好、加载更快；spring.factories 保留给 EnvironmentPostProcessor 等其他用途。"
        },
        {
          "q": "自动装配的 Bean 和用户自己 @Bean 定义的同名 Bean 冲突谁赢？（@ConditionalOnMissingBean 保证用户优先）",
          "a": "用户优先。自动配置的 @Bean 大多带 @ConditionalOnMissingBean，用户已定义同类型 Bean 时自动装配让位，这也是覆盖默认实现的标准姿势。"
        },
        {
          "q": "为什么你引入 spring-boot-starter-data-redis 后 RedisTemplate 直接能注入？把这个链路完整讲一遍。",
          "a": "starter 引入 redis 类 → RedisAutoConfiguration 命中清单 → OnClass 与 OnMissingBean 通过 → 按 yml 装配连接工厂与 RedisTemplate。"
        }
      ],
      "memory": "自动装配像自助餐：清单（imports 文件）是菜单，@Conditional 是“有食材才上菜”，你自带菜（自定义 Bean）了就不上重样的（@ConditionalOnMissingBean）。",
      "tags": [
        "自动装配",
        "EnableAutoConfiguration",
        "SpringBoot3"
      ],
      "point": "考察自动装配清单加载与条件过滤的完整链路，含 Boot2/3 差异。",
      "approach": "先总述：清单加条件按需装配 → 拆 @SpringBootApplication 三合一 → Selector 读清单，点出 2.x factories 与 3.x imports 差异 → @Conditional 过滤 → 给答题模板。坑：不提 Boot3 的 imports 文件就过时。"
    },
    {
      "id": "spring-15",
      "level": 2,
      "q": "手写一个自定义 starter 的步骤是什么？如果让你把游戏服的协议分发模块做成 starter，你怎么设计？",
      "a": "一句话：starter = 依赖聚合模块（xxx-spring-boot-starter）+ 自动配置模块（xxx-spring-boot-autoconfigure），核心是“清单文件 + 条件注解 + Properties 绑定”。\n标准步骤：\n1. autoconfigure 模块：\n- 定义属性类 @ConfigurationProperties(prefix = \"game.protocol\") 暴露可配置项（端口、线程数、扫描包）。\n- 写 AutoConfiguration：@AutoConfiguration + @ConditionalOnClass(Dispatcher.class) + @EnableConfigurationProperties，@Bean 方法上 @ConditionalOnMissingBean 保证可覆盖。\n- 注册清单：SpringBoot 3.x 在 META-INF/spring/...AutoConfiguration.imports 写全限定类名。\n2. starter 模块：空壳 pom，只依赖 autoconfigure + 必要三方库，用户引一个就齐。\n3. 使用者：引入 starter，yml 里配 game.protocol.xxx 即用。\n游戏服协议分发 starter 设计：\n1. 提供 @GameProtocol(opcode) 注解 + ProtocolAutoConfiguration 启动时扫描并注册到路由表（CommandLineRunner/ApplicationRunner 或 SmartInitializingSingleton）。\n2. 属性类暴露 netty.port、business.threads（Disruptor 消费线程数）、scanPackages。\n3. 装配 Netty Server Bootstrap、Disruptor RingBuffer、Handler 路由器等基础设施 Bean，全部 @ConditionalOnMissingBean 允许业务方替换实现。\n4. 提供 ProtocolHandlerFactory 接口 SPI 扩展点。\n亮点话术：这就是把你们项目里的导表工具/协议生成工具 + 分发框架产品化，体现“工具沉淀”思维。",
      "followups": [
        {
          "q": "@ConditionalOnMissingBean 为什么必须配合 @AutoConfigureAfter 或顺序控制使用？",
          "a": "条件评估发生在配置解析期，若用户自定义 Bean 的配置类尚未解析，会误判不存在而装配默认实现引发冲突；顺序控制保证判断时机正确。"
        },
        {
          "q": "starter 的 Bean 装配失败怎么排查？（--debug 启动看 ConditionEvaluationReport / actuator/conditions）",
          "a": "启动加 --debug 输出 ConditionEvaluationReport，或访问 /actuator/conditions 端点，能看到每个自动配置匹配与不匹配的具体原因，逐项核对条件。"
        },
        {
          "q": "如果你的 starter 里 Bean 初始化依赖游戏配置热更新，怎么保证初始化顺序？",
          "a": "把依赖热更源的初始化后置到 SmartInitializingSingleton 或 ApplicationRunner；或让 Bean 构造器显式依赖配置源，用拓扑排序保证先加载后构建。"
        }
      ],
      "memory": "starter 三板斧：Properties（参数表）+ AutoConfiguration（装机单）+ imports 清单（注册处），条条加 @Conditional（按需发货）。",
      "tags": [
        "starter",
        "自动装配",
        "工程化"
      ],
      "point": "考察 starter 三板斧的工程化落地能力，及把项目组件产品化的设计思维。",
      "approach": "先给结构：autoconfigure 加空壳 starter 两模块 → 讲三板斧：Properties、AutoConfiguration 加条件注解、imports 清单 → 再做设计题：注解扫描、路由表、可覆盖装配 → 用工具沉淀话术收尾。坑：只答步骤不做设计题，拉分点全丢。"
    },
    {
      "id": "spring-16",
      "level": 2,
      "q": "@Conditional 家族有哪些注解？分别什么场景用？",
      "a": "一句话：@Conditional 是“满足条件才注册 Bean/配置”的总开关，自动装配的半壁江山。\n常用成员：\n1. @ConditionalOnClass / @ConditionalOnMissingClass：类路径存在/不存在某类。典型：starter 里“用户引入了 kafka-clients 才装配 KafkaTemplate”。\n2. @ConditionalOnBean / @ConditionalOnMissingBean：容器已有/没有某 Bean。覆盖默认实现的标准姿势。\n3. @ConditionalOnProperty：配置项开关，如 game.hotfix.enabled=true 才装配热更新监听。\n4. @ConditionalOnExpression：SpEL 表达式，组合多个配置项。\n5. @ConditionalOnWebApplication / NotWebApplication：区分 Servlet/Reactive/非 Web 环境。游戏服是纯 Netty 长连服务（非 Web），可用它排除 MVC 相关自动装配。\n6. @ConditionalOnResource：资源文件存在才生效（如某个导表 json 存在才装配）。\n7. @ConditionalOnJava / @ConditionalOnJndi / @ConditionalOnSingleCandidate：JDK 版本、JNDI、唯一候选。\n自定义：实现 Condition 接口 matches(ConditionContext, AnnotatedTypeMetadata)，元注解组合出自定义条件——比如游戏项目里 @ConditionalOnServerType(\"battle\") 只在战斗服装配战斗模块、功能服不装配。\n底层入口：ConfigurationClassPostProcessor 解析配置类时统一评估条件。",
      "followups": [
        {
          "q": "@ConditionalOnBean 在多配置类间有顺序问题吗？怎么保证判断时目标 Bean 已注册？",
          "a": "有。它只能看到评估时已处理的 Bean 定义，配置类解析顺序影响结果。用 @AutoConfigureAfter 控制顺序，保证目标定义先被处理。"
        },
        {
          "q": "你们游戏服战斗服和功能服同代码库部署，怎么用 @Conditional 或 profile 实现按角色装配？",
          "a": "自定义 @ConditionalOnServerType 条件注解读启动参数或环境变量，战斗模块仅满足时装配；简单场景直接 spring.profiles.active=battle 按 profile 装配。"
        },
        {
          "q": "Condition 接口和 @ConditionalOnProperty 各自适合什么场景？",
          "a": "OnProperty 适合纯配置开关，零代码；Condition 接口适合需要编程判断的复杂条件，如读环境、按服务器角色、探测端口，更灵活但要写实现类。"
        }
      ],
      "memory": "Conditional 家族记成“四看”：看类（OnClass）、看 Bean（OnBean）、看配置（OnProperty）、看环境（OnWeb/Java）——条件不齐不发货。",
      "tags": [
        "@Conditional",
        "自动装配",
        "条件注解"
      ],
      "point": "考察条件注解家族的覆盖面与选型能力，及按部署角色差异化装配的实战思维。",
      "approach": "先定性：按需装配总开关 → 按四看分类讲：看类、看 Bean、看配置、看环境 → 讲自定义 Condition 扩展 → 给战斗服与功能服按角色装配的例子 → 提底层评估入口。坑：别漏 @ConditionalOnBean 的评估顺序问题。"
    },
    {
      "id": "spring-17",
      "level": 2,
      "q": "SpringBoot Actuator 是什么？线上游戏/后台服务暴露哪些端点、怎么保证安全？",
      "a": "一句话：Actuator 是 SpringBoot 的生产级监控门面，通过 /actuator/* 端点暴露应用运行状态。\n核心端点：\n1. /actuator/health：健康检查，可聚合 DB/Redis/Kafka 状态（K8s liveness/readiness 探针对接它）。\n2. /actuator/metrics：JVM 内存、线程、GC、HTTP 指标，配合 Micrometer 吐给 Prometheus，Grafana 出图。\n3. /actuator/info：应用信息（常配 git commit、版本号，发版核对用）。\n4. /actuator/env、/actuator/beans、/actuator/mappings：配置/Bean/URL 映射（排查装配问题）。\n5. /actuator/conditions：自动装配条件评估报告，排查“为什么我的 Bean 没装上”。\n6. /actuator/loggers：运行时动态调日志级别——线上排查问题不重启神器。\n7. /actuator/heapdump、/actuator/threaddump：导出堆/线程快照，OOM 和死锁排查。\n8. /actuator/shutdown：优雅停机（默认禁用，慎用）。\n线上安全（你们线上部署维护经验可直接讲）：\n1. 只暴露需要的端点：management.endpoints.web.exposure.include=health,info,metrics。\n2. 独立管理端口 management.server.port + 内网 ACL / 网关屏蔽外网。\n3. 接 Spring Security 认证，env/heapdump 这类敏感端点必须鉴权（heapdump 会泄露内存里的密钥）。\n4. 游戏服场景：登录服/游戏服注册健康检查给网关/Nacos，熔断下线摘流量；metrics 看在线人数、协议处理耗时 P99。",
      "followups": [
        {
          "q": "线上 OOM 时怎么用 heapdump + MAT 定位？你们的排查流程是什么？",
          "a": "heapdump 端点导出 hprof，MAT 看支配树找占用最大的对象链，结合 Histogram 定位泄漏类；先复现再抓，抓两次对比增量更准。"
        },
        {
          "q": "health 端点里 Redis 挂了会导致整个服务 DOWN 吗？怎么自定义 HealthIndicator 改成 WARN？",
          "a": "会，health 聚合所有 indicator，Redis DOWN 整体 DOWN，K8s 会摘流量。可自定义 HealthIndicator 把非关键组件降级，或关掉对应自动 indicator。"
        },
        {
          "q": "loggers 动态调级别和日志框架的自动扫描 reload 有什么区别？",
          "a": "loggers 端点改的是运行中 Logger 的 level，立即生效、重启丢失，适合临时排查；自动扫描重读配置文件，持久但有重载开销，适合永久调整。"
        }
      ],
      "memory": "Actuator 是“汽车仪表盘 + 4S 店诊断口”：health 是发动机故障灯，metrics 是时速表，heapdump 是把发动机吊出来拆检——诊断口必须锁好（安全）。",
      "tags": [
        "Actuator",
        "监控",
        "运维"
      ],
      "point": "考察生产监控端点的实战运用与安全意识，而非罗列端点名称。",
      "approach": "先定性：生产级监控门面 → 按用途分组讲端点：健康、指标、排查、快照 → 重点讲线上安全四件事：按需暴露、独立端口加内网 ACL、敏感端点鉴权、heapdump 防泄密 → 落到游戏服健康注册摘流量与协议耗时 P99 指标。坑：不讲安全部分等于没答完。"
    },
    {
      "id": "spring-18",
      "level": 3,
      "q": "Spring 里 BeanFactoryPostProcessor 和 BeanPostProcessor 有什么区别？你们在导表/协议生成工具里能用上吗？",
      "a": "一句话：前者动“Bean 的定义”（BeanDefinition），后者动“Bean 的实例”。\n1. BeanFactoryPostProcessor（BFPP）：在所有 BeanDefinition 加载完、任何 Bean 实例化之前执行，可修改 BeanDefinition（改类、改属性、改作用域）。典型实现：ConfigurationClassPostProcessor（解析 @Configuration/@ComponentScan）、PropertySourcesPlaceholderConfigurer（${} 占位符替换，现已由 PropertySourcesPlaceholderConfigurer 继任机制处理）。\n2. BeanPostProcessor（BPP）：每个 Bean 实例化初始化过程中回调（init 前后），改实例或返回代理。典型：AOP 自动代理、@Autowired 注入处理（AutowiredAnnotationBeanPostProcessor）。\n执行顺序：先 BFPP（定义级）→ 再各 Bean 实例化 + BPP（实例级）。\n游戏工具场景：\n1. 协议 Handler 自动注册：自定义 BPP 或 SmartInitializingSingleton，扫描带 @Protocol(1001) 注解的 Handler Bean，注册到 opcode→Handler 路由表——免手动注册、加协议零改动。\n2. 导表配置热加载：配置表 Bean 用 BFPP 在容器启动前按配置中心内容修改表路径/版本属性；热更新时事件驱动重建 prototype 配置 Bean。\n3. 占位符与多环境：${game.db.url} 在测试/正式环境切换，本质是占位符在 BeanDefinition 阶段替换完成。",
      "followups": [
        {
          "q": "为什么 ${} 占位符替换要在 BeanDefinition 阶段做而不是实例阶段？",
          "a": "BeanDefinition 是图纸，实例化填充时属性值从定义读取。占位符必须在图纸阶段替换完成，实例阶段再改就来不及，且保证所有实例读到一致值。"
        },
        {
          "q": "如果协议 Handler 需要 AOP（如权限校验切面），用 BPP 注册路由表会拿到代理对象吗？",
          "a": "能拿到。注册若放在所有单例就绪后（SmartInitializingSingleton），AOP 代理已在初始化后阶段生成，从容器取到的就是代理对象，切面正常生效。"
        },
        {
          "q": "SmartInitializingSingleton 和 BPP 的 afterInitialization 做扫描注册有什么区别？",
          "a": "BPP 的 after 是每个 Bean 初始化完就回调、逐个触发；SmartInitializingSingleton 在所有单例就绪后只回调一次，适合全齐活再建表的聚合型初始化。"
        }
      ],
      "memory": "BFPP 改“图纸”（定义），BPP 改“产品”（实例）：先改图纸再开工，产品出厂前还能质检包装（代理）。",
      "tags": [
        "扩展点",
        "BeanPostProcessor",
        "工具链"
      ],
      "point": "考察「定义级」与「实例级」扩展点的本质区分，及在游戏工具链中的运用能力。",
      "approach": "先给区分：BFPP 改图纸、BPP 改产品 → 各讲执行时机与典型实现 → 给执行顺序 → 落到游戏场景：路由表注册、占位符在定义阶段替换 → 主动串到 FactoryBean。坑：别把 ConfigurationClassPostProcessor 归到 BPP。"
    },
    {
      "id": "spring-19",
      "level": 2,
      "q": "SpringBoot 应用启动慢怎么排查和优化？游戏服/后台项目实际怎么做的？",
      "a": "一句话：先量化定位（启动耗时分析），再对症优化（懒加载、减装配、异步初始化、AOT）。\n排查手段：\n1. 开 debug 日志看各阶段耗时；spring-boot-startup-analyzer 或 StartupMonitor 这类工具精确到每个 Bean 初始化耗时。\n2. --debug + /actuator/conditions 看装了多少没用的自动配置。\n3. JFR（Java Flight Recorder）录制启动过程。\n优化手段：\n1. 精简依赖：砍掉用不到的 starter，排除多余自动配置（@SpringBootApplication(exclude=...) 或 spring.autoconfigure.exclude）。\n2. 懒加载：SpringBoot 2.2+ spring.main.lazy-initialization=true（全懒加载）或对重 Bean 单独 @Lazy——注意会把启动慢挪到首次请求慢，GM 后台可接受，游戏服网关/登录服首包延迟敏感要评估。\n3. 异步初始化：重资源（导表加载、预热线程池、连接池）放 ApplicationRunner + 线程池异步，健康检查先 UP，就绪探针（readiness）等初始化完再 UP——K8s 场景标准做法。\n4. JVM 层：-XX:TieredStopAtLevel=1、AppCDS（类数据共享）、SpringBoot 3.x AOT/GraalVM Native Image（启动毫秒级，但对反射/动态代理限制多）。\n5. 游戏服实际：导表工具产出的配置表是启动大头——大表异步加载 + 关键表先加载；Netty 端口监听可以放在非关键 Bean 后，先让 K8s 探针通过再开放流量。",
      "followups": [
        {
          "q": "全懒加载为什么可能导致第一次请求超时？怎么平衡？",
          "a": "懒加载把初始化推迟到首次使用，第一个请求现场初始化所有 Bean 导致超时。平衡：热路径关键 Bean 保持饿汉、重资源单独 @Lazy，配合 readiness 预热后再接流量。"
        },
        {
          "q": "readiness 和 liveness 探针分别应该依赖什么？游戏服就绪前该不该收玩家协议？",
          "a": "liveness 只依赖进程存活，别挂外部组件避免级联重启；readiness 依赖能否接客（表加载完、路由表就绪）。就绪前不该收玩家协议，先开门后上菜必出事故。"
        },
        {
          "q": "CDS/AOT 对你们这种大量反射（MyBatis、协议序列化）的项目有什么限制？",
          "a": "AOT 要求为反射、动态代理、资源加载显式注册 hint；MyBatis Mapper 扫描、协议反射注册都要适配，改造量大，建议先在无状态边缘服务试点。"
        }
      ],
      "memory": "启动优化三步：先称体重（Startup 分析找大头），再节食（砍装配），最后分批上菜（异步初始化）——别让玩家在门口等后厨备菜。",
      "tags": [
        "启动优化",
        "懒加载",
        "运维"
      ],
      "point": "考察「先量化后优化」的方法论，及懒加载、异步初始化、AOT 等手段的取舍判断。",
      "approach": "先立方法论：先量化定位再对症下药 → 讲排查工具（启动分析器、conditions 报告、JFR）→ 按手段讲优化：砍装配、懒加载、异步初始化、JVM 层 → 落到游戏服导表异步加载与就绪探针配合 → 主动点出懒加载把启动慢挪成首请求慢的副作用。坑：不报定位手段直接背优化清单，没有说服力。"
    },
    {
      "id": "spring-20",
      "level": 3,
      "q": "游戏服用 Spring 管理业务 Handler，但业务跑在 Netty/Disruptor 自定义线程模型里，Spring 的 ThreadLocal 绑定（事务、Security）会踩什么坑？架构上怎么设计？",
      "a": "一句话：Spring 的事务/安全上下文都绑在 ThreadLocal 上，而 Netty+Disruptor 是跨线程异步流水线，线程一变上下文全丢，所以架构上必须“显式上下文传递 + 明确线程边界”。\n坑点分析：\n1. 事务失效：TransactionSynchronizationManager 用 ThreadLocal 绑数据库连接。Netty IO 线程收到协议 → 投到 Disruptor RingBuffer → 消费线程处理，若在 IO 线程开事务、消费线程执行 SQL，事务注解形同虚设。\n2. 玩家上下文丢失：若用 ThreadLocal<PlayerSession> 存当前玩家，Netty 一个 channel 的连续消息可能被不同消费线程处理，ThreadLocal 取到的就是别的玩家——比“没有”更危险。\n3. 异步事件：@Async 事件监听同样丢上下文。\n正确架构（生产实践）：\n1. 显式上下文对象：消息封装 PlayerContext（playerId、session、协议体）随事件在 Disruptor 上流转，不用 ThreadLocal。\n2. 玩家串行化：按 playerId hash 到固定 Disruptor 消费者（多消费者按玩家分片），保证同一玩家消息有序、无锁；跨玩家才需要并发控制。\n3. 事务边界内收：事务只划在最终落库方法（消费线程内），方法粒度小、锁粒度小；不在分发层开事务。\n4. 读写分离落库：热路径只改内存状态（玩家对象），异步批量刷库（Disruptor 另一消费者或定时批量），此时 Spring 事务用于批量落库任务而非单次操作。\n5. Spring 的角色：只做 Bean 装配、配置管理、Handler 注册路由、定时任务、事件总线，线程调度交给 Netty EventLoop + Disruptor——这是游戏服和 Web 服务用 Spring 的本质区别。",
      "followups": [
        {
          "q": "按玩家 hash 到固定消费者，玩家上下线频繁时怎么避免消费者负载不均？",
          "a": "固定 hash 会不均。解法：一致性哈希加按活跃度动态迁移分片，或按 playerId 取模并监控各队列积压告警，必要时弹性调整消费者数。"
        },
        {
          "q": "异步批量刷库时宕机丢数据怎么办？（先写日志/队列 + 定期快照）",
          "a": "操作日志先持久化到 Kafka 或本地文件再改内存，定期快照玩家状态；宕机后从最近快照加日志回放恢复。关键是日志先于状态变更落盘。"
        },
        {
          "q": "如果一定要异步线程里复用调用方的事务上下文，有什么机制？（基本没有，必须用 REQUIRES_NEW 或手动传连接，说明为什么）",
          "a": "基本没有通用机制。事务上下文绑定线程与连接，跨线程必须新起事务（REQUIRES_NEW）；手动传连接危险且破坏封装。正确做法是重新划分事务边界。"
        }
      ],
      "memory": "ThreadLocal 是“服务员的围裙”——服务员（线程）一换班，围裙里的小票（上下文）就归别人了；游戏里把小票钉在订单（PlayerContext）上，谁接手都能看。",
      "tags": [
        "Disruptor",
        "ThreadLocal",
        "游戏服架构"
      ],
      "point": "考察 ThreadLocal 上下文与异步线程模型冲突的理解及架构解法。",
      "approach": "先给结论：线程一变上下文全丢，必须显式传递 → 分析三坑：事务失效、玩家串号、异步事件丢上下文 → 给方案：PlayerContext 随事件流转、按玩家 hash 串行化、事务边界内收 → 升华：Spring 管装配不管调度。坑：不给替代架构只答一半。"
    },
    {
      "id": "spring-21",
      "level": 3,
      "q": "支付回调要求严格一致性：订单状态、道具发放、资产变更必须原子完成。结合 Spring 事务 + 消息队列 + 分布式场景，设计一套充值到账方案，并说明各环节的失败兜底。",
      "a": "一句话：核心思路是“本地事务保证核心原子性 + 幂等防重 + 本地消息表/事务消息保证异步通知最终一致”，不依赖分布式事务框架也能落地。\n流程设计：\n1. 回调接入（购买服）：验签 → 查订单（不存在则建档）→ 状态机校验（只受理 PENDING 状态，幂等第一层）。\n2. 本地事务（@Transactional REQUIRED，InnoDB）：\n- UPDATE order SET status=SUCCESS WHERE id=? AND status=PENDING（乐观状态机，影响行数=0 说明重复回调，直接返回 success 给支付平台）；\n- 插入发货流水（订单号唯一索引，幂等第二层，重复插入冲突即视为已发）；\n- 更新玩家资产/发放道具（先扣库存再发放，行锁按固定顺序防死锁）；\n- 同事务插入本地消息表 outbox（event=RECHARGE_SUCCESS, payload=订单号）。\n3. 异步投递：定时任务/MQ 事务消息扫描 outbox 投递 Kafka（通知 BI 服记日志、GM 后台刷新、发公告邮件），消费端各自幂等（事件ID 去重），失败重试 + 死信队列 + 人工告警。\n4. 对账兜底：T+1 与支付平台对账文件比对，状态不一致的进入补单/退款流程。\n关键决策点：\n1. 为什么不用 Seata/2PC：充值主链路是单库操作，本地事务足够；跨服（BI、公告）允许秒级延迟，最终一致即可，分布式事务成本高。\n2. 为什么必须先 UPDATE 状态再发货：状态机 + 影响行数判断是最强幂等防线，支付平台超时必然重试回调。\n3. 事务内不放 RPC/HTTP 调用：回调里若同步调发货服接口，长事务撑爆连接池——所以道具发放若是跨服的，改为 outbox 事件驱动。\n4. @TransactionalEventListener(AFTER_COMMIT) 可直接替代部分 outbox 场景（事务提交后再发 MQ），但要处理“提交后应用宕机消息丢”的边界，严格场景还是落 outbox 表稳。",
      "followups": [
        {
          "q": "玩家资产更新和道具发放如果在不同库（分库分表后），本地事务还够吗？怎么演进到柔性事务？",
          "a": "不够了，跨库本地事务失效。演进：各库本地事务加 outbox，用 MQ 驱动状态机流转（SAGA 思路），失败补偿退款或回收道具，配合对账兜底。"
        },
        {
          "q": "支付平台回调要求 3 秒内响应，事务里耗时长怎么办？（先落单+快速 ack，异步发货）",
          "a": "先落订单（PENDING）快速 ack，发货由消息异步驱动完成，游戏内提示到账中即可；支付平台只看 ack 速度，耗时操作全部异步化。"
        },
        {
          "q": "outbox 表消息投递和状态更新之间宕机了，会出现什么问题？怎么保证至少一次？",
          "a": "outbox 与业务数据同事务落库，不存在状态改了消息没落。投递流程是扫描、发 MQ、标记已投，标记前宕机下次扫描重发，天然至少一次，消费端幂等去重即可。"
        }
      ],
      "memory": "充值一致性四字诀：先改状态（状态机幂等）、事务打包（订单+道具+资产+outbox 一锅端）、事后广播（MQ 最终一致）、每日对账（兜底补单）——“改、包、播、对”。",
      "tags": [
        "支付",
        "分布式事务",
        "幂等",
        "outbox"
      ],
      "point": "考察支付一致性的体系化设计：本地事务加幂等加 outbox 最终一致的完整闭环。",
      "approach": "先给总思路：本地事务保核心、幂等防重、outbox 保最终一致 → 按流程讲：验签、状态机、事务四件套、outbox、MQ、对账 → 讲关键决策：不用 Seata 的理由、先 UPDATE 状态 → 强调幂等先行。坑：漏对账兜底或把 MQ 塞进同步链路都是硬伤。"
    },
    {
      "id": "spring-22",
      "level": 3,
      "q": "Spring 容器启动时 Bean 之间如果有隐式顺序依赖（如协议路由表必须在所有 Handler 装配后构建、配置表必须在 Handler 初始化前加载），怎么保证初始化顺序？说出所有手段并按可靠性排序。",
      "a": "一句话：隐式顺序靠不住（容器只保证显式依赖的拓扑序），正确做法是把隐式依赖显式化。\n手段（按可靠性从高到低）：\n1. 构造器注入显式依赖：Router 构造器需要 List<GameHandler>，Spring 拓扑排序自然保证所有 Handler 先就绪——最可靠，编译期可见。\n2. SmartInitializingSingleton.afterSingletonsInstantiated()：所有单例实例化完成后回调，路由表构建放这里，语义就是“全齐活后执行”——游戏服路由表构建的最佳钩子。\n3. ApplicationRunner / CommandLineRunner：容器 refresh 完成后执行，适合启动期任务（开 Netty 端口、预加载表）。多个 Runner 用 @Order 排序。\n4. @DependsOn：声明 Bean 间硬依赖，能用但散落在注解里难维护。\n5. @Order / Ordered：只对集合注入、Runner、拦截器等特定场景生效，不控制 Bean 实例化顺序——常被误用，面试要主动指出这一点。\n6. 事件驱动：ContextRefreshedEvent / ApplicationReadyEvent 监听，等价于 Runner 思路。\n游戏服落地案例：\n1. 配置表（导表工具产物）必须先于 Handler 可用：TableManager 作为普通 Bean，Handler 构造器注入 TableManager——显式依赖，最干净。\n2. 路由表构建：Router Bean 实现 SmartInitializingSingleton，遍历容器里所有 @Protocol Handler 建表，之后 Netty Server（ApplicationRunner @Order 最后）才 bind 端口对外收包——保证“先路由后开门”。\n3. 反例：靠 Bean 名字字母序、靠 xml 声明顺序，都是实现细节不是契约，升级 Spring 版本可能翻车。",
      "followups": [
        {
          "q": "@Order 注解加在 @Component 上能控制 Bean 实例化顺序吗？为什么？",
          "a": "不能。@Order 只对集合注入、拦截器链、Runner 等特定场景生效；Bean 实例化顺序由依赖关系拓扑决定，与 @Order 无关。"
        },
        {
          "q": "SmartInitializingSingleton 和 ContextRefreshedEvent 执行先后？哪个更适合建路由表？",
          "a": "SmartInitializingSingleton 在所有单例实例化完成后、refresh 收尾前执行；ContextRefreshedEvent 在 refresh 完成时发布，前者更早且语义就是齐活回调，更适合建路由表。"
        },
        {
          "q": "如果 Handler A 依赖配置表 T，T 的热更新会重建，A 持有的 T 引用会失效吗？怎么设计支持热更？",
          "a": "会。设计：A 持有 TableManager 门面（引用不变），热更新只换 Manager 内部表数据；或 A 每次通过查表接口取数据而非缓存引用。"
        }
      ],
      "memory": "顺序三靠谱：构造注入（拓扑排序）> SmartInitializingSingleton（齐活回调）> Runner 排队（@Order）；@Order 管排队不管出生——记成“@Order 管上菜顺序，不管做菜顺序”。",
      "tags": [
        "初始化顺序",
        "SmartInitializingSingleton",
        "游戏服"
      ],
      "point": "考察「隐式顺序不可信、显式依赖最可靠」的认知，及各类排序手段的适用边界。",
      "approach": "先立原则：把隐式依赖显式化 → 按可靠性排序：构造器注入、SmartInitializingSingleton、Runner、@DependsOn → 主动指出 @Order 不管实例化顺序的误用 → 落到先建路由表再开端口的案例。坑：声称 @Order 能控实例化顺序是高频错误。"
    },
    {
      "id": "spring-23",
      "level": 2,
      "q": "过滤器 Filter、拦截器 Interceptor、AOP 三者有什么区别？执行顺序怎样？RuoYi 和游戏项目里各自用在哪？",
      "a": "一句话：三者都是横切手段，但 Filter 是 Servlet 规范（容器层），Interceptor 是 SpringMVC 组件（DispatcherServlet 内），AOP 是方法级动态代理（不依赖 Web）。\n1. 归属与粒度：Filter 属于 Servlet 容器，在 DispatcherServlet 之前，能拦所有请求（含静态资源、错误转发），拿到的是 ServletRequest/Response；Interceptor 在 DispatcherServlet 内、Handler 前后，只对 Handler 生效，能拿到 HandlerMethod 和 ModelAndView；AOP 切任意 Spring Bean 的方法，粒度最细，能拿方法参数和返回值。\n2. 执行顺序：Filter.doFilter 链 → DispatcherServlet → Interceptor.preHandle → Controller（AOP 嵌套在方法调用处）→ postHandle → 渲染 → afterCompletion → Filter 链回卷。\n3. 能力差异：Filter 能包装 request/response 流（如多次读 body）；Interceptor 的 preHandle 返回 false 即中断，能感知具体是哪个 Controller 方法；AOP 不依赖 Web 环境，Service/Dao 层也能切，但有自调用失效等代理通病。\n4. 项目落地：RuoYi 登录态用 Filter 层（SecurityFilterChain/TokenFilter），功能权限 @PreAuthorize 本质是 AOP，@DataScope 数据权限也是 AOP 拼 SQL；GM 后台接口耗时统计用 AOP 切 Service；支付回调验签不放 Filter（读 body 流需包装），放拦截器或 Controller 前置 AOP 更合适。",
      "followups": [
        {
          "q": "Filter 里把 body 读掉后 Controller 的 @RequestBody 拿不到数据，怎么解决？",
          "a": "用 ContentCachingRequestWrapper 或自定义 HttpServletRequestWrapper 在 Filter 里缓存 body，包装后传给下游，Controller 读的是包装类的流副本。"
        },
        {
          "q": "拦截器 afterCompletion 和 Filter 链后半段谁先执行？异常情况下呢？",
          "a": "afterCompletion 先执行（视图渲染后、DispatcherServlet 内），然后才回卷到 Filter 链后半段。异常时两者照常执行，除非异常直接中断响应。"
        },
        {
          "q": "网关层已经做了鉴权，应用内还重复做一遍吗？怎么分层？",
          "a": "要做但分层：网关做粗粒度认证（Token 有效性、限流），应用内做细粒度授权（权限字符、数据权限）。纵深防御，两层职责不同不冲突。"
        }
      ],
      "memory": "三道门：Filter 是小区大门（Servlet 容器，谁都得过），拦截器是单元门禁（MVC 调度器内，只对住户生效），AOP 是房间门锁（方法级）——越往里越懂业务。",
      "tags": [
        "Filter",
        "Interceptor",
        "AOP"
      ],
      "point": "考察三层横切机制的归属层级、执行顺序与按场景选型的能力。",
      "approach": "先给归属：Filter 属 Servlet 容器、拦截器属 MVC、AOP 是方法级代理 → 画执行链 → 对比粒度与能力 → 落到 RuoYi 登录用 Filter、权限用 AOP，及验签不放 Filter 的理由。坑：顺序说反，尤其 afterCompletion 与 Filter 回卷位置。"
    },
    {
      "id": "spring-24",
      "level": 2,
      "q": "@Async 的底层原理是什么？默认线程池有什么坑？生产上怎么配置？为什么会失效？",
      "a": "一句话：@Async 本质是 AOP 代理把方法调用封装成任务提交给 TaskExecutor 异步执行，坑集中在“默认线程池”和“代理失效”两处。\n1. 原理：@EnableAsync 开启后，AsyncAnnotationBeanPostProcessor 给带 @Async 的 Bean 生成代理，调用时包装成 Callable/Runnable 提交给线程池，返回值支持 Future/CompletableFuture。\n2. 默认线程池的坑：没有自定义 Executor 时，兜底是 SimpleAsyncTaskExecutor——不复用线程、每次 new Thread，高并发下直接打爆；SpringBoot 2.x 自动装配的 applicationTaskExecutor 队列是无界的（默认 queueCapacity=Integer.MAX_VALUE），任务积压只排队不拒绝，最终 OOM。生产必须自定义 ThreadPoolTaskExecutor：corePoolSize/maxPoolSize/queueCapacity（有界）/threadNamePrefix/RejectedExecutionHandler（CallerRunsPolicy 兜底防丢，注意会把压力回弹给调用线程）/waitForTasksToCompleteOnShutdown（配合优雅停机）。\n3. 失效场景：自调用（this 直接调不经过代理）、非 public 方法、同类中调用——和 @Transactional 失效同源。\n4. 异常处理：void 方法的异常走 AsyncUncaughtExceptionHandler；返回 Future 的异常被吞在 Future.get() 里，不 get 就永远不知道失败。\n5. 游戏结合：日志服行为日志异步落库用 @Async(\"logExecutor\")，登录日志和支付日志分开线程池隔离，防慢任务拖垮主链路；热路径已有 Disruptor，则 @Async 只用于非热路径（GM 后台报表导出、邮件发送）。",
      "followups": [
        {
          "q": "线程池四种拒绝策略分别是什么？CallerRunsPolicy 有什么副作用？",
          "a": "AbortPolicy 抛异常、CallerRunsPolicy 回退调用线程、DiscardPolicy 静默丢弃、DiscardOldestPolicy 丢最老任务。CallerRuns 会把压力回弹给调用方拖慢主线程，相当于变相限流。"
        },
        {
          "q": "@Async 方法里的事务上下文还能用吗？为什么？",
          "a": "不能直接用。事务上下文绑 ThreadLocal，异步方法跑在另一线程上下文为空。异步方法上单独加 @Transactional，由新线程建立自己的事务上下文。"
        },
        {
          "q": "为什么不建议 @Async 返回 void？怎么拿到异步任务的结果和异常？",
          "a": "void 方法异常只能走 AsyncUncaughtExceptionHandler，调用方完全无感知。返回 CompletableFuture 可 get 结果、exceptionally 捕获异常、组合多任务，可观测性完全不同。"
        }
      ],
      "memory": "@Async 是“把活外包”：默认外包队是个光杆司令（现招人现干活、活多了无限排队），必须自己配常备军（有界线程池）+ 应急预案（拒绝策略）+ 验收单（Future 收结果）。",
      "tags": [
        "@Async",
        "线程池",
        "异步"
      ],
      "point": "考察 @Async 代理原理、默认线程池两大陷阱与失效场景，重点是生产配置经验。",
      "approach": "先讲原理：代理包装任务提交线程池 → 重点批默认线程池两坑：不复用线程、无界队列 → 给生产配置清单：有界队列、拒绝策略、优雅停机 → 讲失效场景与异常处理 → 落到日志分池隔离。坑：默认线程池的坑说不清就白答。"
    },
    {
      "id": "spring-25",
      "level": 2,
      "q": "Spring Cache 的 @Cacheable/@CachePut/@CacheEvict 原理和使用坑？接 Redis 怎么配？",
      "a": "一句话：@EnableCaching 开启后缓存注解由 AOP 代理（CacheInterceptor）实现，CacheManager 统一管理缓存区，@Cacheable 先查后放、@CachePut 必执行再更新、@CacheEvict 删除。\n1. 核心属性：cacheNames（缓存分区）、key 用 SpEL（#playerId、#root.methodName）、condition（条件缓存）/unless（结果过滤，如 #result == null 不缓存）、sync=true（同 key 并发只放一个请求进方法，底层是 JVM 本地锁，防单机击穿）。\n2. 接 Redis：RedisCacheManager + RedisCacheConfiguration 配序列化器（GenericJackson2JsonRedisSerializer 替代 JDK 序列化，可读性好）、key 前缀、按 cacheName 分别设 TTL——经典坑：@Cacheable 注解本身不支持 TTL，必须在配置层按分区设置。\n3. 坑位清单：自调用失效（AOP 通病）；sync 只是单机锁，集群下防击穿要靠 Redisson 分布式锁或逻辑过期；缓存与 DB 一致性用 Cache Aside（先更新库再删缓存，极端并发下延迟双删）；@CacheEvict(allEntries=true) 清整个分区慎用。\n4. 三大问题联动：穿透（缓存空值/布隆过滤器）、击穿（sync/互斥锁/逻辑过期）、雪崩（TTL 加随机抖动）。\n5. 游戏结合：GM 后台字典表、权限树 @Cacheable 到 Redis；导表配置热更新后 @CacheEvict 清对应 cacheName；玩家排行榜查询缓存 30 秒 TTL 削峰，榜单更新事件主动失效。",
      "followups": [
        {
          "q": "@Cacheable 为什么不支持直接配 TTL？按分区配 TTL 的代码怎么写？",
          "a": "注解是通用抽象，TTL 是具体实现的能力。用 RedisCacheManager 的 withInitialCacheConfigurations 按 cacheName 配带 TTL 的 RedisCacheConfiguration。"
        },
        {
          "q": "sync=true 能防分布式缓存击穿吗？集群下怎么办？",
          "a": "不能。sync 底层是 JVM 本地锁，只防单机。集群下用 Redisson 分布式锁，或逻辑过期（不设 TTL、异步线程重建），或随机提前刷新。"
        },
        {
          "q": "更新数据时先删缓存还是先更新库？两个顺序各有什么并发问题？",
          "a": "先删缓存再更新库：删除后更新前有并发读会把旧值回填。先更新库再删缓存：删除失败留脏数据，设短 TTL 兜底。极端一致用延迟双删或 binlog 订阅失效。"
        }
      ],
      "memory": "三个注解记成“读、写、撕”：Cacheable 读（没货才进货）、CachePut 写（必跑再上架）、Evict 撕标签（过期作废）；TTL 不在标签上写，在货架规划表（CacheConfiguration）里定。",
      "tags": [
        "缓存",
        "@Cacheable",
        "Redis"
      ],
      "point": "考察缓存注解语义与生产坑位：TTL 配置、sync 局限与一致性方案。",
      "approach": "先讲机制：AOP 加 CacheManager → 说清三注解语义：读、写、撕 → 讲 Redis 集成：序列化、按分区配 TTL → 列坑：自调用、sync 单机锁、Cache Aside → 联动穿透击穿雪崩 → 落到字典缓存与排行榜。坑：答不出注解不支持 TTL 就露馅。"
    },
    {
      "id": "spring-26",
      "level": 1,
      "q": "Spring Validation 参数校验怎么用？@Valid 和 @Validated 区别？分组校验和自定义校验怎么做？",
      "a": "一句话：基于 JSR-303 规范（Hibernate Validator 实现），Controller 参数前加 @Valid/@Validated 触发校验，失败抛 MethodArgumentNotValidException，由 @RestControllerAdvice 统一包装返回。\n1. 常用注解：@NotNull（不为 null）/@NotEmpty（不为 null 且长度>0，集合字符串通用）/@NotBlank（字符串去空格后非空）——三者区别是高频考点；另有 @Size/@Min/@Max/@Pattern/@Email。\n2. @Valid vs @Validated：@Valid 是 JSR 标准注解，支持嵌套对象的级联校验；@Validated 是 Spring 增强版，支持分组（Groups）且可用在类上配合方法级参数校验。\n3. 分组校验：定义标记接口（如 Add/Update），DTO 字段上 @NotNull(groups = Update.class)，Controller 上 @Validated(Update.class)——GM 后台“新增用户不传 id、修改必传 id”的标准解法，避免写两套 DTO。\n4. 自定义校验：@Constraint(validatedBy = XxxValidator.class) 自定义注解 + ConstraintValidator 实现类（本身是 Bean，可注入 Service 做查库校验，如校验渠道号是否存在）。\n5. 嵌套集合：List<@Valid PlayerDTO> 或字段上加 @Valid 级联。\n6. 游戏结合：支付回调参数验签前先校验必填字段和格式；GM 后台表单 DTO 全量校验，错误信息统一包装成 RuoYi 的 AjaxResult；错误消息走 MessageSource 可顺带国际化。",
      "followups": [
        {
          "q": "@NotBlank 和 @NotEmpty 的区别？校验 Integer 类型的“必传”应该用哪个？",
          "a": "@NotBlank 只用于字符串（去空格后非空），@NotEmpty 用于集合和字符串（非空且 size 大于 0）。Integer 必传用 @NotNull，前两个对 Integer 无意义。"
        },
        {
          "q": "校验失败默认的响应结构是什么？怎么统一成你们的返回体？",
          "a": "默认抛 MethodArgumentNotValidException 返回 400 和默认结构。用 @RestControllerAdvice 捕获，提取字段错误，包装成统一返回体如 RuoYi 的 AjaxResult。"
        },
        {
          "q": "分组校验用多了 DTO 注解很乱，有什么治理手段？",
          "a": "分组收敛到 Add/Update/Query 等少数标准组；共性校验抽基础 DTO 继承；复杂交叉校验用类级自定义 Constraint 或下沉 Service 层，别让注解堆成墙。"
        }
      ],
      "memory": "校验三板斧：@Valid 进场检票、Groups 分场次（新增场/修改场）、@Constraint 自印门票（自定义规则）——三个 Not 记“Null 管有无、Empty 管多少、Blank 管空白”。",
      "tags": [
        "Validation",
        "参数校验",
        "JSR303"
      ],
      "point": "考察 JSR-303 校验体系用法，重点是三个 Not 辨析与分组校验。",
      "approach": "先给机制：注解触发校验、异常统一包装 → 辨析三个 Not（高频考点）→ 讲 @Valid 与 @Validated 差异 → 讲分组与自定义 Constraint → 落到 GM 表单与支付回调校验。坑：三个 Not 混淆是减分重灾区，必须先讲清。"
    },
    {
      "id": "spring-27",
      "level": 1,
      "q": "SpringBoot 配置文件的加载顺序和优先级？多环境怎么隔离？配置里的数据库密码怎么加密？",
      "a": "一句话：外部化配置按固定优先级覆盖——命令行参数 > 系统属性/环境变量 > 外部配置文件 > jar 内配置文件；同级下 profile 特定文件压通用文件，properties 压 yml。\n1. 加载位置（外压内）：启动目录 /config 子目录 > 启动目录 > classpath:/config > classpath:/；spring.config.location 替换默认位置，additional-location 追加。\n2. profile 机制：spring.profiles.active 激活；application-{profile}.yml 覆盖 application.yml；3.x 推荐 spring.config.import 显式导入其他配置源（如 optional:nacos:game.yaml）。\n3. bootstrap.yml 陷阱：只有引入 SpringCloud 配置中心依赖才有 bootstrap 阶段（先于 application 加载，负责拉远程配置），纯 SpringBoot 项目没有 bootstrap——别把配置放错文件。\n4. 加密方案：jasypt-spring-boot-starter，密文写 ENC(xxx)，密钥通过启动参数/环境变量注入（--jasypt.encryptor.password），绝不在仓库和镜像里出现；更优解是 Nacos 配置中心 + K8s Secret 环境变量注入，敏感配置根本不进 jar。\n5. 游戏结合：登录服/游戏服/购买服同代码库多角色部署——公共 application.yml + 每服 application-gameserver.yml 差异配置；线上密码一律环境变量注入，CI 流水线打包零明文；导表路径、协议端口按 profile 区分测试/正式。",
      "followups": [
        {
          "q": "改配置能不重启生效吗？（@RefreshScope / spring.config.import 的 watch / Nacos 监听）",
          "a": "可以。Nacos 等配置中心监听推送，配合 @RefreshScope 或可重绑的 @ConfigurationProperties 刷新 Bean；没加这些注解的 Bean 不会自动拿到新值。"
        },
        {
          "q": "jasypt 的密钥本身怎么保管？密钥泄露了怎么办？",
          "a": "密钥走环境变量或启动参数注入，不进仓库不进镜像，K8s 用 Secret。泄露后立即轮换密钥、重新加密全部密文，并审计访问日志确认影响面。"
        },
        {
          "q": "同一个 key 在 yml 和环境变量里都有，谁生效？环境变量名怎么映射到配置 key（relaxed binding）？",
          "a": "环境变量优先于配置文件。映射规则 relaxed binding：SPRING_DATASOURCE_URL 自动映射到 spring.datasource.url，全大写、下划线替点、去横线。"
        }
      ],
      "memory": "优先级口诀：“命令行最大、环境变量老二、外置压内置、专精(profile)压通用”；密码三原则：不进 git、不进镜像、密钥走环境变量。",
      "tags": [
        "配置文件",
        "profile",
        "jasypt",
        "多环境"
      ],
      "point": "考察外部化配置优先级、profile 隔离与敏感配置加密的完整运维知识。",
      "approach": "先给优先级口诀：命令行最大、环境变量老二、外置压内置、profile 压通用 → 讲加载位置与覆盖规则 → 澄清 bootstrap 只在 SpringCloud 场景存在 → 讲 jasypt 加密与配置中心方案 → 落到多服 profile 实践。坑：把 bootstrap 当原生机制会露怯。"
    },
    {
      "id": "spring-28",
      "level": 2,
      "q": "SpringBoot 打出来的 jar 为什么能 java -jar 直接运行？包太大怎么瘦身？",
      "a": "一句话：spring-boot-maven-plugin 把业务类和全部依赖打成 fat jar，靠 MANIFEST.MF 里的 Main-Class=JarLauncher（自定义 ClassLoader，能直接读嵌套 jar）+ Start-Class=业务主类实现一键启动。\n1. 包结构：BOOT-INF/classes（业务代码）、BOOT-INF/lib（全部依赖 jar）、META-INF/MANIFEST.MF、org/springframework/boot/loader（启动器）。\n2. 核心原理：普通 URLClassLoader 不支持 jar in jar，SpringBoot Loader 自定义了嵌套 jar 的 URL 协议和 ClassLoader，不解压直接从内层 jar 读类——这是“能跑”的关键。\n3. 瘦身手段：\n- 分层打包 layertools：dependencies（稳定依赖）/spring-boot-loader/snapshot-dependencies/application（业务代码）四层，Docker 镜像按层缓存，业务层常只有几百 KB，发版只推变化层——CI/CD 提速最明显，游戏服多节点滚动发版从分钟级降到秒级。\n- 依赖外置：thin jar + loader.path 指向共享 lib 目录，多服同机部署共享依赖。\n- 砍依赖：mvn dependency:analyze 找未使用依赖、exclude 无用传递依赖。\n- 老项目迁移：打 war 部署外置 Tomcat（继承 SpringBootServletInitializer）。\n4. 游戏结合：GM 后台与业务服分开打包避免互相带依赖；镜像里配置文件外置挂载，同镜像按环境变量切换区服角色。",
      "followups": [
        {
          "q": "嵌套 jar 为什么普通 ClassLoader 加载不了？JarLauncher 怎么解决的？",
          "a": "普通 URLClassLoader 的 jar 协议不支持嵌套寻址。JarLauncher 自定义嵌套 jar 的 URL handler 和 ClassLoader，随机访问内层条目，不解压直接读类。"
        },
        {
          "q": "分层打包的四层分别是什么？为什么业务代码放最后一层？",
          "a": "dependencies（稳定依赖）、spring-boot-loader、snapshot-dependencies（快照依赖）、application（业务代码）。业务层变动最频繁放最后，Docker 缓存命中前层，发版只推业务层。"
        },
        {
          "q": "怎么排查 fat jar 里的依赖冲突（不同版本同名类）？",
          "a": "mvn dependency:tree 看版本仲裁；运行时 NoSuchMethodError 多半是冲突症状；解压看 BOOT-INF/lib 有无同 group 多版本 jar，用 exclusion 排掉传递依赖。"
        }
      ],
      "memory": "fat jar 是“搬家集装箱”：JarLauncher 是随车吊，能把箱中箱（嵌套 jar）的货直接吊出来用；分层打包是“家具分层装车”——常动的（业务代码）放最上层，换个沙发不用卸整车。",
      "tags": [
        "打包",
        "fat jar",
        "Docker",
        "CI/CD"
      ],
      "point": "考察 fat jar 可运行原理（嵌套 jar 类加载）与瘦身手段。",
      "approach": "先给原理：JarLauncher 加自定义 ClassLoader 读嵌套 jar → 讲包结构 → 解释普通 ClassLoader 不支持 jar in jar → 瘦身三招：分层打包、依赖外置、砍依赖 → 落到分层镜像提速发版。坑：答不出嵌套 jar 难点等于只用过没想过。"
    },
    {
      "id": "spring-29",
      "level": 2,
      "q": "什么是优雅停机？SpringBoot 怎么配置？游戏服停机相比普通 Web 服务还要多做什么？",
      "a": "一句话：优雅停机=收到停机信号后拒新、等在途、再退出；SpringBoot 2.3+ 内置 server.shutdown=graceful + spring.lifecycle.timeout-per-shutdown-phase=30s。\n1. 流程：SIGTERM（kill -15）→ 发布 ContextClosedEvent → Web 容器停止接受新连接/新请求 → 等待在途请求完成（超时上限后强杀）→ SmartLifecycle 按 phase 逆序停止 → @PreDestroy 回调 → JVM 退出。\n2. K8s 配合：terminationGracePeriodSeconds 必须大于应用 timeout；preStop hook（sleep 几秒）等待 endpoints 摘除和 iptables 收敛——否则 Pod 已 Terminating 但流量还在进来，新请求打到将死的实例上。\n3. 游戏服额外动作（和普通 Web 服务的本质区别）：\n- 先摘流：从 Nacos/网关反注册，登录服停止分配新玩家，已有连接推停服公告。\n- 玩家存档：踢下线前把内存里的玩家状态强制批量落库——Web 服务没有“内存态玩家数据”这个概念，这是游戏服停机最大的特殊点。\n- 队列刷盘：Disruptor RingBuffer 积压消费完、日志服缓冲刷 Kafka/库。\n- 定时任务先停：@Scheduled 停止触发，避免停机窗口产生半截任务（如结算到一半）。\n- SmartLifecycle 编排：phase 小先启动后停止——先停 Netty 端口（入口）→ 再刷数据 → 最后关连接池和线程池。",
      "followups": [
        {
          "q": "直接 kill -9 会发生什么？什么场景下可以接受？",
          "a": "JVM 没有任何回调：在途请求中断、内存玩家数据丢失、队列积压丢弃。只有无状态服务或可重放任务这类接受数据丢失的场景可以用。"
        },
        {
          "q": "K8s 里 readiness 探针失败到流量真正停止有延迟，怎么兜底？",
          "a": "endpoints 摘除与 iptables 收敛有秒级延迟。兜底：preStop hook 先 sleep 几秒再发 SIGTERM，等流量真正停止后再进入停机流程。"
        },
        {
          "q": "停机时玩家正在战斗中（一局没打完），设计上怎么处理？",
          "a": "给宽限期：提前推停服公告、进入结算模式禁止开新局、在打的局正常结算落库；超时未完的按预设规则判和或按进度结算并补偿。"
        }
      ],
      "memory": "优雅停机像“餐厅打烊”：门口挂牌不迎客（摘流）、等堂食客人吃完（在途请求）、厨房半成品做完封盒（玩家存档/队列刷盘）、最后拉闸断电（销毁 Bean）——kill -9 是直接拉电闸，半成品全扔。",
      "tags": [
        "优雅停机",
        "K8s",
        "运维",
        "游戏服"
      ],
      "point": "考察优雅停机全流程，及游戏服相比 Web 服务的特殊动作：摘流、存档、刷队列。",
      "approach": "先给定义：拒新、等在途、再退出，加 2.3+ 配置 → 讲 K8s 配合：gracePeriod 与 preStop → 重点讲游戏服四件事：摘流、玩家存档、队列刷盘、SmartLifecycle 编排 → 用 kill -9 反例收尾。坑：只答 graceful 配置不讲内存态存档，没答到点上。"
    },
    {
      "id": "spring-30",
      "level": 1,
      "q": "跨域 CORS 是什么？SpringBoot 有哪几种解决方式？预检请求是什么？",
      "a": "一句话：CORS 是浏览器同源策略的豁免机制——对非简单请求浏览器先发 OPTIONS 预检，服务端响应 Access-Control-Allow-* 头声明许可后才放行真实请求；注意卡人的是浏览器，服务器间调用不存在跨域。\n1. 三种解法：@CrossOrigin 注解（Controller/方法级，细粒度）；WebMvcConfigurer.addCorsMappings 全局路径配置；CorsFilter Bean（Filter 层，优先级最高）。\n2. 与 Spring Security 共存必须 CorsFilter：Security 的 Filter 链在 MVC 拦截器之前，预检 OPTIONS 若被鉴权拦截返回 401，跨域直接失败——CorsFilter 要在 SecurityFilter 之前放行 OPTIONS 并写好响应头。\n3. 关键参数：allowedOrigins（allowCredentials=true 时不能用 *，Spring 5.3+/Boot 2.4+ 必须用 allowedOriginPatterns 通配）、allowedMethods、allowedHeaders、maxAge（预检结果缓存秒数，调大减少 OPTIONS 次数）。\n4. 预检（preflight）：带自定义头、Content-Type=application/json、PUT/DELETE 等非简单请求触发；简单请求（GET/POST 表单）直接发，但响应头不对浏览器照样拦截结果。\n5. 游戏结合：GM 后台前后端分离（Vue 开发端口调 SpringBoot）必配，RuoYi 在 SecurityConfig 注册 CorsFilter；生产环境更推荐 Nginx/网关统一加跨域头、应用内关闭——双层配置会产生重复响应头，浏览器直接判失败。",
      "followups": [
        {
          "q": "为什么 allowCredentials=true 时 allowedOrigins 不能是 *？",
          "a": "规范要求：携带 Cookie 凭证时若 Allow-Origin 为星号，任意站点都能带用户凭证读响应，等于敞开 CSRF 大门，浏览器直接拒绝。必须明确域名或用 allowedOriginPatterns。"
        },
        {
          "q": "预检请求需不需要鉴权？为什么？",
          "a": "不需要也不应该。预检是浏览器自动发的问路请求，不带业务凭证；若被鉴权拦成 401，真实请求永远发不出。CorsFilter 必须最先放行 OPTIONS。"
        },
        {
          "q": "Nginx 和应用同时加 CORS 头，浏览器报什么错？怎么排查？",
          "a": "报响应头重复错误（multiple values），浏览器判跨域失败。排查：F12 看响应头是否重复，确定一层配置（推荐网关统一加），另一层关掉。"
        }
      ],
      "memory": "CORS 是“海关预申报”：敏感货物（复杂请求）先发 OPTIONS 报关单，海关（浏览器）看回执（Allow-* 头）盖章才放行——卡人的是浏览器海关，不是目的港（服务器）。",
      "tags": [
        "CORS",
        "跨域",
        "前后端分离"
      ],
      "point": "考察对跨域本质（浏览器行为）与预检机制的理解及配置经验。",
      "approach": "先纠认知：卡人的是浏览器同源策略，服务器间无跨域 → 讲三种解法及优先级 → 重点讲与 Security 共存必须 CorsFilter（预检被拦成 401）→ 讲关键参数 → 落到 RuoYi 与网关统一加头的取舍。坑：说不出预检触发条件和 401 根因显得没实战。"
    },
    {
      "id": "spring-31",
      "level": 2,
      "q": "Spring 6 / SpringBoot 3 有哪些重大变化？老项目（如 GM 后台）升级要注意什么？",
      "a": "一句话：三大变化——JDK 17 起步、javax 全面迁移 jakarta 命名空间、AOT/GraalVM Native Image 支持；升级最大工作量在 jakarta 迁移和第三方依赖联动升级。\n1. Jakarta 迁移：javax.servlet/persistence/validation → jakarta.*，所有依赖包（老版 MyBatis 集成包、Swagger 2、旧 Druid）必须同步升级到 jakarta 兼容版；可用 OpenRewrite 自动化迁移。注意 MyBatis-Plus 在 Boot 3 下要用 mybatis-plus-spring-boot3-starter。\n2. 自动装配清单格式变化：spring.factories 的 EnableAutoConfiguration key 废弃，改 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports——自定义 starter 必须跟着改（和 starter 知识直接串联）。\n3. AOT/GraalVM：构建期处理 Bean 定义、为反射/代理/资源生成 hint，Native Image 启动毫秒级、内存降数倍；代价是反射/动态代理需显式注册 hint、CGLIB 受限、构建慢——MyBatis 这类重反射框架适配成本高，适合先拿无状态边缘服务（登录网关）试点。\n4. 其他亮点：JDK 17 record 作 DTO、虚拟线程支持（GM 后台 IO 密集接口直接受益，server.threads 配置切换）、RFC 7807 ProblemDetail 统一错误响应、@HttpExchange 声明式 HTTP 客户端、PathPatternParser 成默认路径匹配（AntPathMatcher 尾匹配行为有差异，老 URL 映射要回归测试）。\n5. 升级策略：先升到 2.7.x 最新再跨 3.x；若依有 SpringBoot3 分支可评估直接替换 GM 后台基座。",
      "followups": [
        {
          "q": "javax 为什么要改成 jakarta？（Java EE 移交 Eclipse 基金会，javax 商标归 Oracle 不可继续演进）",
          "a": "Java EE 移交 Eclipse 基金会后，javax 商标归 Oracle，新规范不能沿用该包名演进，Jakarta EE 9 起全面改 jakarta.*，纯商标法律问题。"
        },
        {
          "q": "虚拟线程上了之后传统线程池还要调优吗？synchronized 在虚拟线程下有什么坑（pinning）？",
          "a": "思路变了：虚拟线程不需池化调优，每请求一线程即可。坑是 pinning：synchronized 块内阻塞 IO 会钉住载体线程，建议换 ReentrantLock 并监控载体占用。"
        },
        {
          "q": "AOT 模式下你们游戏服的协议反射注册、MyBatis Mapper 扫描要怎么适配？",
          "a": "为反射、代理、资源显式注册 RuntimeHints；MyBatis 用官方 AOT 支持或自配 hint；动态生成的类要预生成或改编译期方案。改造量大，先拿边缘服务试点。"
        }
      ],
      "memory": "升级三件事记“换鞋、改名、塑身”：JDK17 换鞋、jakarta 改名、AOT 塑身——鞋不合脚（老依赖不兼容）全身走不动。",
      "tags": [
        "SpringBoot3",
        "Jakarta",
        "AOT",
        "升级"
      ],
      "point": "考察对 JDK17、jakarta、AOT 三大变化的认知与升级风险评估。",
      "approach": "先给三大变化：换鞋、改名、塑身 → 重点讲 jakarta 迁移是最大工作量 → 讲自动装配清单变化，串联 starter 知识 → 讲 AOT 收益与代价 → 给升级策略：先 2.7 再跨 3.x。坑：只列新特性不讲升级坑，面试官要的是落地判断力。"
    },
    {
      "id": "spring-32",
      "level": 2,
      "q": "说说 MyBatis 一次查询从 Mapper 接口调用到 SQL 执行的完整链路，以及 Mapper 接口为什么没有实现类也能注入。",
      "a": "一句话：Mapper 接口由 MyBatis 用 JDK 动态代理生成 MapperProxy，方法调用被转成“按 类全名+方法名 查 MappedStatement → Executor 执行 → 结果映射”的流水线。\n1. 启动期：SqlSessionFactoryBuilder 解析 mybatis-config.xml 和 Mapper.xml/注解，构建 Configuration——核心是 MappedStatement 注册表（key=namespace.statementId）。\n2. Mapper 绑定：Spring 集成靠 MapperFactoryBean（FactoryBean 的典型应用），注入的是 MapperProxyFactory 生成的 JDK 代理；调用 playerMapper.selectById(1) → MapperProxy.invoke → MapperMethod 按“接口全限定名+方法名”定位 MappedStatement——这就是 xml 的 namespace 必须等于接口全名、statement id 必须等于方法名的原因，也是 Mapper 接口不能重载的原因（绑定 key 不含参数签名）。\n3. 执行链：Executor（Simple 默认/Reuse/Batch，CachingExecutor 装饰器负责二级缓存）→ StatementHandler（路由 PreparedStatementHandler）→ ParameterHandler 把 #{} 参数预编译设值 → JDBC 执行 → ResultSetHandler 按 resultMap/resultType 映射成 Java 对象。\n4. #{} vs ${}：#{} 是 PreparedStatement 占位符，防 SQL 注入；${} 是字符串拼接，只有动态表名/ORDER BY 列名才用，且必须白名单校验——GM 后台列表排序字段是经典注入点。\n5. 插件机制：Interceptor 基于 JDK 代理 + 责任链，只能拦 Executor/StatementHandler/ParameterHandler/ResultSetHandler 四个接口；分页插件、SQL 慢查询统计、游戏日志服的 SQL 审计都挂这里。",
      "followups": [
        {
          "q": "Mapper 接口为什么不能重载方法？想按不同参数查询怎么办？",
          "a": "绑定 key 是接口全名加方法名，不含参数签名，重载方法 key 冲突无法区分。不同参数查询用不同方法名，或一个方法传 @Param 多参数。"
        },
        {
          "q": "插件为什么只能拦那四个接口？想拦所有 Mapper 方法该怎么做（在 MapperProxy 层或 Spring AOP）？",
          "a": "MyBatis 插件基于 JDK 代理，只暴露 Executor 等四个可拦截接口。拦所有 Mapper 方法：自定义 MapperProxy 层工厂，或用 Spring AOP 切 Mapper 接口。"
        },
        {
          "q": "Batch 模式的 Executor 在批量插入时为什么快？配合 JDBC 还要加什么参数（rewriteBatchedStatements）？",
          "a": "Batch 累积多条 SQL 一次 executeBatch 发送，减少网络往返与解析。MySQL 连接串还要加 rewriteBatchedStatements=true，驱动才把多条 insert 重写成单条多 values。"
        }
      ],
      "memory": "MyBatis 四件套：Executor 是调度员、StatementHandler 是翻译官、ParameterHandler 是押运员（#{} 装箱防调包）、ResultSetHandler 是拆包工——Mapper 代理就是那个只动嘴不动手的项目经理。",
      "tags": [
        "MyBatis",
        "MapperProxy",
        "插件"
      ],
      "point": "考察 Mapper 代理机制与四大组件执行链的完整理解，及绑定规则背后的为什么。",
      "approach": "先给总链路：代理定位 MappedStatement 走执行流水线 → 讲启动期注册与代理绑定，点出 namespace 等于接口全名的原因 → 讲四件套执行链 → 讲两种占位符差异 → 讲插件四接口。坑：答不出不能重载等原因只算背了流程。"
    },
    {
      "id": "spring-33",
      "level": 2,
      "q": "MyBatis-Plus 相比 MyBatis 做了什么增强？分页插件、自动填充、逻辑删除的原理分别是什么？",
      "a": "一句话：MP 是 MyBatis 增强工具包，核心是“通用 CRUD 免写 SQL + 统一拦截器插件体系 + Wrapper 条件构造器”，所有增强都挂在 MappedStatement 动态注入和 Interceptor 插件上，底层仍是 MyBatis。\n1. 通用 CRUD：BaseMapper<T> 的 selectById/insert 等方法在启动期由 SqlInjector 按实体类 @TableName/@TableId/@TableField 元数据动态生成 MappedStatement 注入容器——实体注解就是生成 SQL 的依据；@TableId(type = IdType.ASSIGN_ID) 内置雪花算法主键。\n2. 分页插件：MybatisPlusInterceptor（3.4+ 统一入口）+ PaginationInnerInterceptor，拦 Executor.query：先执行 count 查询（join 复杂时可关 optimizeJoin 或自定义 count），再重写 SQL 拼 LIMIT（方言层按数据库类型适配）。面试陷阱：没注册分页插件时 page 查询不报错但返回全量、total=0。\n3. 自动填充：MetaObjectHandler 实现 insertFill/updateFill，配合 @TableField(fill = FieldFill.INSERT)，创建人/创建时间/更新人自动填——GM 后台审计字段标准方案。\n4. 逻辑删除：@TableLogic 标记字段，delete 变 UPDATE deleted=1，查询自动追加 deleted=0 条件；游戏运营误删玩家资产可找回。注意唯一索引要和 deleted 联合设计（或删除标记用时间戳/ID）。\n5. 其他常用：LambdaQueryWrapper 防字段名写错、IService 通用 Service、@Version 乐观锁插件、TenantLineInnerInterceptor 多租户（自动拼 tenant_id——和游戏“按渠道/区服隔离数据”同一思路）。",
      "followups": [
        {
          "q": "分页插件的 count 查询在什么情况下会算错？怎么优化大表 count？",
          "a": "多表 join 加 distinct 或 group by 时自动 count 会算错。优化：自定义 count 语句、关 optimizeJoin；大表用近似值或缓存总数，深分页改游标 seek。"
        },
        {
          "q": "逻辑删除后唯一索引冲突怎么办？",
          "a": "唯一索引与 deleted 联合设计，或删除标记不用 0/1 而用删除时间戳或雪花 ID，保证同一业务键可多次删除不冲突。"
        },
        {
          "q": "你自己写的 MyBatis Interceptor 和 MP 的 MybatisPlusInterceptor 同时存在，执行顺序怎么保证？",
          "a": "MyBatis 拦截器按配置成责任链，后注册先执行。最佳做法是统一挂进 MybatisPlusInterceptor 的 InnerInterceptor 链，用添加顺序控制，比多个外层拦截器更可控。"
        }
      ],
      "memory": "MP 三件套：“认表注解读元数据（SqlInjector）、条件用 Wrapper 拼、增强靠拦截器挂”——分页先数后切、字段自动填、删除改打勾。",
      "tags": [
        "MyBatis-Plus",
        "分页插件",
        "逻辑删除"
      ],
      "point": "考察 MP 增强的实现原理：动态注入与拦截器体系，而非只会用。",
      "approach": "先定性：增强工具包，底层仍是 MyBatis → 逐个讲原理：CRUD 是 SqlInjector 动态注入、分页是拦截器重写 SQL、填充是 MetaObjectHandler、逻辑删除是 SQL 改写 → 落到审计字段与误删找回。坑：只讲用法不讲原理，拉分点全丢。"
    },
    {
      "id": "spring-34",
      "level": 2,
      "q": "MyBatis 一级缓存和二级缓存有什么区别？为什么生产环境常建议关闭二级缓存？",
      "a": "一句话：一级缓存是 SqlSession 级 HashMap（默认开启），二级缓存是 Mapper namespace 级、跨 SqlSession 共享（默认关闭需显式开启）；生产慎用二级缓存，优先用 Redis。\n1. 一级缓存：同一 SqlSession 内，同 statement+同参数+同分页命中；任何 insert/update/delete、commit/rollback/close 都会清空。关键陷阱：Spring 集成后 SqlSessionTemplate 在无事务时每次方法调用都新开 SqlSession，所以 Spring 环境下一级缓存基本不生效，只有同一事务内才命中。\n2. 二级缓存：Mapper.xml 加 <cache/> 或 @CacheNamespace 开启；由 CachingExecutor 装饰 Executor 实现；按 namespace 隔离；查询结果先暂存 TransactionalCacheManager，事务提交后才真正写入（防止脏读其他事务未提交数据）；实体默认要求可序列化。\n3. 生产慎用原因：多表关联查询的结果缓存在某个 namespace 下，另一个 namespace 更新了关联表不会触发失效→脏数据，缓存粒度太粗；二级缓存是 JVM 本地缓存，多实例部署时各节点数据不一致；TTL 和主动失效的控制能力弱。结论：只有字典表这类几乎不变的单表适合开；其余走 Redis 集中缓存。\n4. 接 Redis：实现 org.apache.ibatis.cache.Cache 接口自定义二级缓存即可接入 Redis——GM 后台字典/菜单可这么玩。\n5. 游戏结合：玩家数据、资产绝不走 MyBatis 二级缓存，统一走 Redis 集群，失效策略、热点 key、TTL 全在自己手里。",
      "followups": [
        {
          "q": "为什么 Spring 环境下无事务时一级缓存不生效？同一事务内两次相同查询真的不查库吗？",
          "a": "SqlSessionTemplate 无事务时每次调用新建 SqlSession 随即关闭，缓存随会话销毁；同一事务内复用同一会话，第二次相同查询命中缓存不查库。"
        },
        {
          "q": "二级缓存为什么要等事务提交后才写入？",
          "a": "防脏读：未提交就写入共享缓存，其他会话读到未提交数据，事务回滚后缓存就脏了。TransactionalCacheManager 暂存、提交后才真正写入。"
        },
        {
          "q": "实现 Cache 接口接 Redis 要注意什么（序列化、namespace 隔离、清空语义）？",
          "a": "注意序列化选型（JSON 可读性）、key 带 namespace 前缀隔离、clear 映射为删整个前缀、TTL 策略，以及与 Redis 自身淘汰策略的一致性。"
        }
      ],
      "memory": "一级缓存是“同桌草稿纸”（换同桌即废），二级缓存是“班级共享黑板”（跨桌可见，但隔壁班/别的实例看不见，别人改了内容你也不知道）——真要全校共享不如挂公告栏（Redis）。",
      "tags": [
        "MyBatis",
        "一级缓存",
        "二级缓存",
        "Redis"
      ],
      "point": "考察两级缓存的作用域与失效机制，及生产弃二级缓存改用 Redis 的决策逻辑。",
      "approach": "先给结论：一级 SqlSession 级、二级 namespace 级 → 讲一级缓存在 Spring 环境基本不生效的反直觉点 → 讲二级缓存提交后才写入 → 给慎用三理由 → 落到玩家数据走 Redis。坑：Spring 环境一级缓存这个点最能暴露水平，必须主动讲。"
    },
    {
      "id": "spring-35",
      "level": 3,
      "q": "Spring 扩展点全家桶：除了 BeanPostProcessor/BeanFactoryPostProcessor 还知道哪些？按容器启动阶段把它们串一遍。",
      "a": "一句话：Spring 在启动每个阶段都留了钩子，按阶段记忆：环境准备 → 上下文初始化 → 定义注册/修改 → 实例化前后 → 初始化 → 全部就绪 → 生命周期启停。\n1. EnvironmentPostProcessor：配置文件解析后、容器创建前，往 Environment 注入属性——jasypt 解密、配置中心拉取都挂这里（spring.factories 注册）。\n2. ApplicationContextInitializer：context 创建后、refresh 前，编程式注入属性源/激活 profile。\n3. BeanDefinitionRegistryPostProcessor：BFPP 的子接口且先执行，能动态注册新 BeanDefinition——ConfigurationClassPostProcessor 扫描 @Component 就靠它，是“动态造 Bean 定义”的正门。\n4. BeanFactoryPostProcessor：改已有 BeanDefinition（占位符替换）。\n5. InstantiationAwareBeanPostProcessor：实例化前后回调，可直接返回代理跳过默认实例化，@Autowired 的解析也在它的 postProcessProperties。\n6. Aware 家族：BeanNameAware/ApplicationContextAware 等，容器回调注入基础设施。\n7. 初始化三件套：@PostConstruct → InitializingBean.afterPropertiesSet → init-method。\n8. FactoryBean：getObject() 定制复杂 Bean 的创建，MyBatis 的 SqlSessionFactoryBean、MapperFactoryBean 都是——串联 MyBatis 原理必提。\n9. SmartInitializingSingleton/ApplicationRunner：全部单例就绪后/refresh 完成后执行（路由表构建、预热）。\n10. SmartLifecycle：容器启动/停止阶段回调，phase 小先启动后停止——游戏服 Netty Server 启停的标准挂载点（start 里 bind 端口，stop 里优雅关 EventLoopGroup），优雅停机编排靠它。\n游戏结合：协议路由表用 BPP/SmartInitializingSingleton 构建；热更新模块用 ApplicationListener 收配置变更事件；导表配置源可用 EnvironmentPostProcessor 注入。",
      "followups": [
        {
          "q": "BeanDefinitionRegistryPostProcessor 和 BeanFactoryPostProcessor 谁先执行？为什么？",
          "a": "前者先执行（它是 BFPP 子接口且优先级更高）。先动态注册新 BeanDefinition，再由 BFPP 修改定义——先造图纸再改图纸。"
        },
        {
          "q": "Aware 回调和 @PostConstruct 谁先执行？",
          "a": "Aware 先执行，属于初始化前回调阶段注入容器基础设施；然后才是 @PostConstruct、afterPropertiesSet、init-method 的初始化三件套。"
        },
        {
          "q": "SmartLifecycle 的 phase 值大小和启动/停止顺序的关系？游戏服 Netty 和数据库连接池谁的 phase 应该大？",
          "a": "phase 小的先启动、后停止（逆序关停）。Netty 监听端口 phase 应大（后启动、先停止），连接池 phase 小（先启动、后停止），停机先关入口再关资源。"
        }
      ],
      "memory": "按装修流程记：通水电(EnvironmentPostProcessor)→图纸会审(Initializer)→图纸盖章(BDRPP/BFPP)→毛坯验收(实例化前后 BPP)→精装收尾(@PostConstruct)→竣工验收(SmartInitializingSingleton/Runner)→开门营业和打烊(SmartLifecycle)。",
      "tags": [
        "扩展点",
        "SmartLifecycle",
        "FactoryBean"
      ],
      "point": "考察对 Spring 启动各阶段钩子的全景认知，及按阶段串联的体系化表达能力。",
      "approach": "先给阶段主线：环境准备、上下文初始化、定义注册修改、实例化前后、初始化、全部就绪、生命周期启停 → 按阶段逐个挂扩展点并给典型实现 → 用装修流程类比帮助记忆 → 落到游戏服 Netty 用 SmartLifecycle 挂载。坑：只堆名词不讲阶段归属，面试官听的是你脑中有启动时序图。"
    },
    {
      "id": "spring-36",
      "level": 1,
      "q": "Spring 国际化（i18n）怎么做？游戏多语言场景怎么落地？",
      "a": "一句话：核心是 MessageSource 按 Locale 从 messages_语言.properties 取文案，Web 端由 LocaleResolver 确定当前 Locale，三者配合完成国际化。\n1. 三件套：语言文件 messages.properties（默认兜底）/messages_zh_CN/messages_en_US/messages_ja_JP；MessageSource（ResourceBundleMessageSource）的 getMessage(code, args, locale) 取文案，支持 {0} 参数插值；LocaleResolver 决定用哪个 Locale。\n2. LocaleResolver 选择：AcceptHeaderLocaleResolver（默认，读 Accept-Language 头，适合无状态 API）；SessionLocaleResolver/CookieLocaleResolver + LocaleChangeInterceptor（?lang=en 切换，适合用户手动切语言的 GM 后台）。\n3. 联动：Hibernate Validator 的校验消息可走 MessageSource 插值实现错误提示多语言（ValidationMessages.properties）；找不到 key 可配 useCodeAsDefaultMessage 或 fallback 到默认文件。\n4. 热更新：ReloadableResourceBundleMessageSource 支持 cacheSeconds 定时重载语言文件——运营改文案不用发版。\n5. 游戏结合（merge 女性向游戏出海视角）：协议返回 errorCode 为主、文案服务端按玩家 locale 渲染兜底，客户端也可按语言包渲染；玩家 locale 存档案（注册时取设备语言），邮件/公告推送按 locale 取 MessageSource 文案；配置表多语言字段（t_item_name_en/ja）由导表工具生成，随热更新整表刷新；GM 后台（RuoYi）自带 vue-i18n + 后端 messages 机制。",
      "followups": [
        {
          "q": "AcceptHeaderLocaleResolver 和 SessionLocaleResolver 分别适合什么场景？游戏 API 用哪个？",
          "a": "AcceptHeader 无状态适合 API；Session 加 Cookie 适合用户手动切换的后台。游戏 API 用 AcceptHeader 或直接读玩家档案里的 locale，登录后更准确。"
        },
        {
          "q": "消息里带玩家昵称、数量等参数怎么插值？复数形式怎么处理？",
          "a": "getMessage 支持 {0} 占位参数插值；复数用 ChoiceFormat 或在语言文件按数量区间定义多条文案，代码里按数量选 code。"
        },
        {
          "q": "语言文件改错导致线上文案缺失，有什么兜底和监控手段？",
          "a": "兜底：useCodeAsDefaultMessage 或 fallback 到默认语言文件；监控：发版前脚本校验各语言文件 key 完整性，线上对取文案失败打点告警。"
        }
      ],
      "memory": "i18n 三件套：字典（messages_语言.properties）、翻译官（MessageSource）、导购（LocaleResolver 决定给哪国客人递哪本字典）。",
      "tags": [
        "国际化",
        "i18n",
        "MessageSource"
      ],
      "point": "考察 i18n 三件套机制及游戏出海多语言的落地设计能力。",
      "approach": "先给三件套：语言文件、MessageSource、LocaleResolver → 讲 LocaleResolver 选型 → 讲校验消息联动与热更新 → 落到游戏：errorCode 为主、locale 存档案、配置表多语言随热更刷新。坑：只讲 Web 端用法，游戏协议多语言才是差异点。"
    },
    {
      "id": "spring-37",
      "level": 2,
      "q": "Spring 定时任务 @Scheduled 的原理和使用注意？游戏服集群部署时定时任务重复执行怎么办？",
      "a": "一句话：@EnableScheduling 开启后由 ScheduledAnnotationBeanPostProcessor 扫描 @Scheduled 方法注册到 TaskScheduler 执行；默认调度池是单线程，多任务互相阻塞是第一个坑。\n1. 三种触发：fixedRate（按上次开始时间固定间隔，不等完成）、fixedDelay（上次结束后固定间隔）、cron（Spring cron 是六段式：秒 分 时 日 月 周，比 Linux cron 多“秒”位；zone 属性指定时区——海外服按区服时区结算必用）。\n2. 坑位清单：默认单线程，一个任务卡住全部延迟——用 SchedulingConfigurer 自定义线程池；任务内异常不处理会静默影响后续调度；@Scheduled 也是 AOP 代理，自调用/非 public 同样失效；fixedRate 单任务不并发但会积压。\n3. 集群防重（多实例每个节点都触发，游戏结算重复执行就是资损事故）：\n- ShedLock：基于 Redis/DB 的分布式锁注解（@SchedulerLock），抢到锁的节点执行，lockAtMostFor 防持锁节点宕机死锁——轻量无外部组件，每日签到重置/榜单结算首选。\n- xxl-job/ElasticJob 调度中心：支持分片广播（按区服分片，各实例处理部分区服）、失败重试、可视化管理台——区服多的 MMO 更合适。\n- 固定节点路由：leader 选举或配置指定执行节点。\n4. 游戏结合：merge 游戏每日签到重置 @Scheduled(cron = \"0 0 4 * * ?\", zone = \"Asia/Shanghai\") + ShedLock(Redis)；日志服定时批量刷库用 fixedDelay；大玩家量结算拆批提交避免单事务过大；结算放凌晨 4 点避开跨天活动和日志切割高峰。",
      "followups": [
        {
          "q": "fixedRate 任务执行时间超过间隔，会并发执行吗？",
          "a": "不会并发。同一任务的调度是串行的，上次没执行完下次触发会等待；但积压会导致后续执行点漂移，长期超间隔要考虑任务拆分。"
        },
        {
          "q": "ShedLock 的 lockAtMostFor 和 lockAtLeastFor 分别防什么？",
          "a": "lockAtMostFor 防持锁节点宕机后锁永远不释放（死锁），到点强制释放；lockAtLeastFor 防任务执行过快时多节点在锁释放间隙重复抢到，保证最小间隔。"
        },
        {
          "q": "定时任务里要调用游戏服内存中的玩家数据（不在 DB），定时任务该怎么设计（MQ 通知业务节点 vs 调度中心分片）？",
          "a": "定时节点不直接碰内存数据：定时任务只发 MQ 事件通知各业务节点开始结算，节点各自处理本服内存玩家；或调度中心按区服分片广播，天然路由到对应节点。"
        }
      ],
      "memory": "定时任务三问：谁触发（Scheduler）、几点跑（cron 六段多一秒）、几个人抢（集群加 ShedLock）——“闹钟人人有，谁先起床锁门谁干活”。",
      "tags": [
        "定时任务",
        "@Scheduled",
        "ShedLock",
        "集群"
      ],
      "point": "考察定时任务原理、单线程调度坑与集群防重方案选型。",
      "approach": "先讲原理：BPP 扫描注册到 TaskScheduler → 讲三种触发与六段 cron → 列坑：默认单线程为首 → 重点讲集群防重三方案及选型 → 落到签到重置加锁案例。坑：集群重复执行导致资损是题眼，只答单机用法不及格。"
    }
  ]
};
