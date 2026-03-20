# 云服务端检查清单

> 代码异味 & SOLID：[solid-checklist.md](solid-checklist.md)（共用）  
> 安全性基础：[security-checklist.md](security-checklist.md)（共用）

---

## 1️⃣ 稳定性 & Crash 风险 🔴 最高

- NPE / 空值（DB / 下游接口返回需 null 检查；Java 用 `Optional`，Kotlin 用 `?.` / `?:`）
- 强制类型转换（转换前校验类型）
- 集合越界（按 index 访问前校验 size，或用 `getOrNull` / `getOrElse`）
- 递归无终止条件（栈溢出风险）
- `NC.ofNull()` 滥用（吞掉所有异常返回 null，会掩盖真正的业务错误；仅用于"访问链式字段时的安全 NPE 防护"，严禁包裹有副作用的操作）
- `ApiResult.fetch()` 结果未判断（调用后不加 `.logErrorIfNeed()` 或 `.getOrDefault()` 则 RpcFail 会被静默丢弃）
- MQ Handler 中 `pushMsg.getData()` / `pushMsg.getUserGuid()` 未 null 检查直接使用（参考 `BaseDriverPushHandler` 子类实践）

---

## 2️⃣ 逻辑正确性 & 幂等性 🔴 最高

- 写操作具备幂等性（同一请求重复发送，结果一致）
- 资金 / 订单敏感操作有防重机制（分布式锁 / 唯一约束 / 幂等 Key）
- 订单状态机严格校验前置状态，禁止非法跳转
- 条件分支覆盖所有业务场景，有 `default` / `else` 兜底
- `ApiResult` 的 Success / Error / RpcFail 三种状态是否都有处理（尤其是 RpcFail 不等同于业务失败）
- MQ 消息处理后是否需要 ack / nack，避免重复消费或消息丢失
- `@Deprecated` 方法是否仍在新代码中被调用（应迁移到非废弃实现）
- CTIEvent 中 `userGuid` / `userNewId` 关键字段为 null 时是否有提前返回，避免后续逻辑产生脏数据


---

## 3️⃣ 资源管理 & 连接池 🔴 最高
- HMS（MQ）订阅在服务启动后才发起（参考 `MQConsumer` 中 `onApplicationEvent` 时机），不提前消费导致依赖未就绪
---

## 4️⃣ 并发 & 性能 🟠 中等

- 调用下游 SOA 服务配置合理超时（避免无限等待阻塞线程，SOA 5000 错误码大概率是超时）
- 批量操作有数量上限（防慢查询阻塞）
- 禁止在循环中逐条查 DB / 调 RPC（改为批量 IN 查询，防 N+1）
- MQ Handler 处理耗时操作时是否影响消费速度（慎重阻塞消费线程）
- 重试有上限和退避间隔；**非幂等操作禁止自动重试**

---

## 5️⃣ 兼容性 & 变更管理 🟡 一般

- 接口新增字段设为可选并有默认值，不删除 / 重命名已有字段
- MQ 消息格式变更向下兼容旧版本消费者
- Apollo 配置项（`ApolloKey`）变更时旧 key 是否仍需兼容，不可直接删除
- 灰度策略（`GrayUtils`）变更后是否覆盖了全量和灰度两条路径的逻辑
- SOA 接口升级时（新旧 `AppXxxServiceIface`）是否有过渡方案，旧接口下线前新旧并存

---

## 6️⃣ 架构规范 🟠 中等

- Facade / Application / Domain 层职责清晰，不跨层直接调用
- MQ Handler 中只做轻量路由与编排，复杂业务逻辑沉到 Service 层
- `cloudEventSenderHolder.send()` 的 CTIEvent 不为 null 才发送（空事件发出去会造成端上逻辑异常）
- 调用下游 SOA 服务有兜底（`ApiResult.getOrDefault` / `getOrElse`），不直接 `get()` 抛异常影响主流程
- `NC.ofNull()` 不用于核心业务逻辑（只适合读取链式字段的防御性编码）

---

## 7️⃣ 安全性 & 鉴权 🔴 最高

- MQ 消息来源中的用户标识（`pushMsg.getUserGuid()`）是否在使用前校验合法性

---

## 8️⃣ 日志 & 可观测性 🟠 中等

- 关键节点（入参 / 出参 / 状态变更）有结构化日志（使用 `LogUtils.COMMON.info` / `LogUtils.ERROR.error`）
- 日志脱敏（禁止打印手机号 / 身份证 / token / 银行卡号）
- `ApiResult` 失败时调用 `.logErrorIfNeed()` 记录错误（禁止静默忽略失败）
- MQ Handler 处理失败时有日志记录（便于排查消息消费异常）

---
