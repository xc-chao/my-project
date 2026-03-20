# Android 端检查清单

> 代码异味 & SOLID：[solid-checklist.md](solid-checklist.md)（共用）  
> 安全性基础：[security-checklist.md](security-checklist.md)（共用）

---

## 1️⃣ 稳定性 & Crash 风险 🔴 最高

- 空指针、数组、集合越界（用 `getOrNull` / 访问前检查 size）、类型转换（用 `as?` 安全转换，避免 `as` 强转崩溃）
- 吞掉的异常：空的 catch 块或仅包含日志记录的 catch 块
- 缺少错误处理：没有针对可能出错的操作（I/O、网络、解析）的 try-catch 语句。
- 注意kotlin与java互相调用时候是否判空
---

## 2️⃣ 逻辑正确性 🔴 最高

- 新增逻辑是否的与原来的业务语义一致
- 条件分支是否完整（成功 / 失败 / 边界）
- 默认值、兜底逻辑是否合理
- 注释是否正确
- RecyclerView 复用状态泄漏
- 数值边界处理是否合理：除以零、整数溢出等

---

## 3️⃣ 生命周期 & 资源管理 🔴 最高

- Context 泄漏（静态 / 单例持有 Activity Context，改为 ApplicationContext）
- Handler 泄漏（匿名内部类 Handler 隐式持有外部引用，改用 `WeakReference` 或 lambda）
- 协程泄漏（绑定 `viewModelScope` / `lifecycleScope`，非 `GlobalScope`）
- Flow 后台收集（`collect` 用 `repeatOnLifecycle` 或 `flowWithLifecycle`）
- EventBus / RxJava `register` 与 `unregister` / `dispose` 成对
- BroadcastReceiver 动态注册未解注册
- 异步任务、回调、定时器是否在销毁时正确处理
- Context / View / Controller 引用是否可能导致泄漏
- 是否存在内存泄漏

---

## 4️⃣ 线程 & 性能（ANR 风险）🟠 中等

- 主线程做 IO / 网络 / 数据库操作等耗时操作
- UI 更新是否发生在主线程
- 是否引入明显的性能或内存风险
- 是否存在内存泄漏风险
- 是否存在死循环、递归问题
- 资源是否及时释放回收
- 协程调度器：

---

## 5️⃣ 兼容性 🟡 一般

- 是否可能影响已有逻辑或行为
- 修改函数、字段、接口是否会导致调用放异常
- 新增/修改代码是否考虑向下兼容
---

## 6️⃣ 架构规范 🟠 中等

- 新建页面使用 MVI；UIState 只在 ViewModel 内更新
- 启动页面优先路由（`@RouterUri` / `UriHandler`），避免直接 `startActivity`
- 打车 / 拼车弹窗继承 `VehicleBaseDialog`
- ViewModel 不持有 View / Activity / Fragment 引用

---
