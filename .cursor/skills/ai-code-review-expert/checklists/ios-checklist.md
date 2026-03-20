# iOS 端检查清单

> 代码异味 & SOLID：[solid-checklist.md](solid-checklist.md)（共用）  
> 安全性基础：[security-checklist.md](security-checklist.md)（共用）

---

## 1️⃣ 稳定性 & Crash 风险 🔴 最高

- 空指针（强制解包 `!` 滥用，优先 `guard let` / `if let` / `??`，只有逻辑上确定非 nil 才用 `!`）
- 数组、集合越界（访问前校验 `index < count`，或用 `first` / `last` / `dropFirst`）
- 类型转换（`as!` 强转改用 `as?`，失败时有兜底处理）
- `try!` 使用（改用 `try?` 或 `do-catch`）
- 生命周期或对象销毁后仍被访问（异步回调中 `[weak self]` 后 `guard let self = self else { return }`）
- 多线程 / 异步回调竞态（共享变量需串行队列或锁保护）
- ObjC 互操作：nullable 对象在 Swift 侧未作可选值处理（隐式 non-optional）
- `@IBOutlet` / `@IBAction` 连接断开（对应 nib / storyboard 控件是否存在）
- Swift `enum` 的 `switch` 未覆盖全部 case（加 `@unknown default` 捕获未来新增值）

---

## 2️⃣ 逻辑正确性 🔴 最高

- 新增逻辑是否与原来的业务语义一致
- 条件分支是否完整（成功 / 失败 / 边界），`switch` / `if-else` 有兜底
- 默认值、兜底逻辑是否合理
- 状态切换是否存在遗漏或冲突
- `guard` 提前退出时是否清理必要状态（如隐藏 loading、取消请求）
- 异步回调完成时 VC 是否已被销毁（用 `[weak self]` 并在回调入口判断）
- 通知 / 代理回调顺序不可假设固定，逻辑需健壮
- Combine / async-await：`sink` / `assign` 订阅是否存入 `cancellables`，否则立即销毁
- 注释描述是否与实际逻辑一致


---

## 3️⃣ 生命周期 & 资源管理 🔴 最高

- 闭包循环引用（`[weak self]` / `[unowned self]`，不确定生命周期一律用 `weak`）
- `delegate` 属性未声明为 `weak`（强引用导致 retain cycle）
- `Timer` 未在 `deinit` / `viewWillDisappear` 调用 `invalidate()` 并置 nil（Timer 强持有 target）
- `NotificationCenter` 未在 `deinit` 调用 `removeObserver`
- Combine 订阅未存入 `cancellables`（提前取消或永不释放）
- `unowned` 使用场景不安全（对象生命周期无法确保时改用 `weak`）
- KVO 注册后未在合适时机移除观察者


---

## 4️⃣ 线程 & 性能 🟠 中等

- 主线程做 IO / 网络 / 数据库操作等耗时操作
- UI 更新是否发生在主线程（`DispatchQueue.main.async` / `@MainActor`）
- 主线程调用 `DispatchQueue.main.sync`（在主线程同步派发主队列会死锁）
- 大图未在后台线程解码再切主线程展示
- Swift async/await：`@MainActor` 标注是否正确，避免在后台线程直接操作 UI
- 是否存在死循环、无限递归问题
- `viewWillAppear` 每次重新请求（应有防重 / 缓存策略）
- 列表数据全量加载（应分页或虚拟化）
- 资源是否及时释放回收


---

## 5️⃣ 兼容性 🟡 一般

- 是否可能影响已有逻辑或行为
- 修改函数、字段、接口是否会导致调用方异常
- 新增 / 修改代码是否考虑向下兼容
- 新 API 调用前 `if #available(iOS X.0, *)` 判断（或方法标注 `@available(iOS X.0, *)`）
- `@available` 修饰的符号在低版本有替代逻辑
- deprecated API 有迁移方案
- ObjC 暴露给 Swift 的接口标注 `_Nullable` / `_Nonnull`，避免隐式 non-optional
- `@objc` 按需暴露，减少不必要的 bridge 开销

---

## 6️⃣ 架构规范 🟠 中等

- ViewController 职责单一（业务逻辑抽到 ViewModel / Service / Interactor，避免 Massive VC）
- Protocol extension 默认实现不导致行为难以追踪（多继承钻石问题）
- 数据模型优先用 `struct`（值语义，无引用计数开销，线程安全）
- 关键依赖通过初始化注入（可测试，可替换 mock），避免在方法内直接实例化重依赖
- 全局状态 / 单例是否必要，不导致状态难以追踪
- 模块间通信是否通过协议 / 回调解耦，禁止跨模块直接访问内部实现

---
