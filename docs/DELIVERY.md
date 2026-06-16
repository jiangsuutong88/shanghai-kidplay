# 上海周末遛娃推荐小程序 — 交付文档

> 项目名称：shanghai-kidplay
> 交付日期：2026-06-15
> 文档版本：v1.0

---

## TL;DR

上海周末遛娃推荐小程序已完成前后端开发，核心功能包括：天气×年龄×预算三维智能推荐、月度轮换（排除已去过的地方）、薅羊毛多平台比价、官方预约渠道。前后端编译均通过，QA 验证全部通过。

---

## 一、交付状态

| 项目 | 状态 | 说明 |
|------|------|------|
| 后端 (NestJS) | ✅ 编译通过 | 6 模块 / 7 Entity / 11 API |
| 前端 (Taro) | ✅ 编译通过 | 4 页面 / 12 组件 / 30 Mock 场所 |
| HTML 预览版 | ✅ 可用 | 包含完整交互流程 |
| 文档 | ✅ 齐全 | PRD + 架构设计 + 时序图 + 类图 |
| QA 验证 | ✅ 全部通过 | 7/7 项验证通过 |

---

## 二、项目目录结构

```
/workspace/shanghai-kidplay/
├── client/                          # 前端小程序（Taro + React + TypeScript）
│   ├── src/
│   │   ├── pages/                    # 4 个核心页面
│   │   │   ├── index/               # 首页（3步选择 + 月度横幅 + 足迹）
│   │   │   ├── recommend/           # Top3 推荐结果
│   │   │   ├── detail/              # 方案详情（含薅羊毛 + 足迹标记）
│   │   │   └── compare/            # 对比页面
│   │   ├── components/             # 12 个组件
│   │   │   ├── AgePicker/          # 年龄选择
│   │   │   ├── BudgetSelector/     # 预算选择
│   │   │   ├── WeatherTag/         # 天气标签
│   │   │   ├── PlanCard/           # 推荐卡片（含"新"标签）
│   │   │   ├── CompareTable/       # 对比表格
│   │   │   ├── VenueInfo/          # 场所信息
│   │   │   ├── ReviewList/         # 评价列表
│   │   │   ├── BookingButton/      # 预约按钮（gzh/mp）
│   │   │   ├── TagBadge/           # 标签徽章
│   │   │   ├── EmptyState/         # 空状态
│   │   │   ├── DealCard/           # 🆕 薅羊毛比价卡片
│   │   │   └── VisitTag/           # 🆕 足迹标签
│   │   ├── stores/                 # Zustand 状态
│   │   │   ├── useRecommendStore.ts
│   │   │   ├── useUserStore.ts
│   │   │   └── useVisitStore.ts    # 🆕 足迹 store
│   │   ├── services/               # API 服务（真实 API + Mock 降级）
│   │   ├── data/venues.ts          # 30 个 Mock 场所
│   │   ├── utils/                  # 工具函数
│   │   │   ├── recommend.ts        # 推荐算法（含已去降权 + 新场所优先）
│   │   │   ├── weather.ts          # 天气判断
│   │   │   ├── distance.ts         # 距离计算
│   │   │   └── format.ts           # 格式化
│   │   └── constants/              # 常量
│   │       ├── ageGroups.ts
│   │       ├── budgetLevels.ts
│   │       └── weatherTypes.ts     # 🆕 含月度推荐映射
│   └── project.config.json
│
├── server/                          # 后端服务（NestJS + TypeORM + PostgreSQL）
│   ├── src/
│   │   ├── modules/
│   │   │   ├── venue/              # 场所模块（CRUD + 搜索）
│   │   │   ├── recommend/          # 推荐模块（三维筛选 + Top3）
│   │   │   ├── weather/             # 天气模块（和风 API + Redis 缓存）
│   │   │   ├── tag/                # 标签模块
│   │   │   ├── visit/              # 🆕 足迹模块（标记/取消/列表）
│   │   │   └── deal/              # 🆕 薅羊毛模块（多平台比价）
│   │   ├── common/                 # 公共模块
│   │   ├── config/                 # 配置
│   │   └── database/seeds/        # 种子数据
│   └── docker-compose.yml          # PostgreSQL + Redis
│
├── preview/                         # HTML 预览版
│   └── index.html
│
└── docs/                            # 文档
    ├── PRD.md                       # 产品需求文档
    ├── architecture.md              # 架构设计文档
    ├── sequence-diagram.mermaid      # 推荐流程时序图
    └── class-diagram.mermaid         # 数据模型类图
```

---

## 三、核心功能清单

| # | 功能 | 优先级 | 前端 | 后端 | 说明 |
|---|------|--------|------|------|------|
| 1 | 天气智能推荐 | P0 | ✅ | ✅ | 晴天户外/阴雨天室内自动切换 |
| 2 | 年龄适配筛选 | P0 | ✅ | ✅ | 0-1/1-3/3-6 岁分段 |
| 3 | 成本分档推荐 | P0 | ✅ | ✅ | 💚0-100 / 💛100-200 / 🧡200+ |
| 4 | Top3 方案对比 | P0 | ✅ | ✅ | 多维度对比表格 + 优劣势 |
| 5 | 官方预约渠道 | P0 | ✅ | ✅ | 公众号 + 微信小程序 |
| 6 | 多平台数据聚合 | P0 | ✅ | ✅ | 大众点评+小红书+抖音评分加权 |
| 7 | 🆕 月度推荐轮换 | P1 | ✅ | ✅ | 每月新推荐+排除已去场所 |
| 8 | 🆕 薅羊毛比价 | P1 | ✅ | ✅ | 美团/抖音/大众点评优惠价+省XX元 |
| 9 | 🆕 足迹记录 | P1 | ✅ | ✅ | 标记已去过+推荐降权 |
| 10 | 早教价值标签 | P1 | ✅ | ✅ | 感官/大运动/认知等 |
| 11 | UGC 评价摘要 | P1 | ✅ | ✅ | 好评关键词+避坑提示 |
| 12 | 方案分享 | P1 | ✅ | — | 分享到家庭群 |
| 13 | 定位与距离 | P1 | ✅ | ✅ | 基于用户位置计算距离 |
| 14 | 小红书笔记链接 | P1 | ✅ | ✅ | 高赞笔记直达 |

---

## 四、API 接口清单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/recommend/top3 | Top3 推荐（含天气+年龄+预算筛选） |
| GET | /api/v1/venues | 场所列表（分页+筛选） |
| GET | /api/v1/venues/:id | 场所详情（含 deals + bookingLinks） |
| GET | /api/v1/weather/weekend | 周末天气预报 |
| GET | /api/v1/tags | 标签列表 |
| POST | /api/v1/visits | 标记已去过 |
| DELETE | /api/v1/visits/:venueId | 取消标记 |
| GET | /api/v1/visits | 获取足迹列表 |
| GET | /api/v1/deals/venue/:venueId | 场所比价信息 |
| GET | /api/v1/deals/best | 最优惠推荐 |

---

## 五、技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Taro 4 + React 18 + TypeScript + Zustand + Tailwind CSS |
| 后端 | NestJS 10 + TypeORM + PostgreSQL 15 + Redis 7 |
| 天气 | 和风天气 API |
| 部署 | Docker Compose (PostgreSQL + Redis) + 阿里云 ECS |

---

## 六、用户下一步操作

### 1. 本地预览小程序
```bash
# 用微信开发者工具导入
路径：/workspace/shanghai-kidplay/client/
AppID：使用游客模式或替换为你自己的 AppID
```

### 2. 启动后端（需要先启动数据库）
```bash
cd /workspace/shanghai-kidplay/server

# 启动 PostgreSQL + Redis
docker-compose up -d

# 安装依赖（如果未安装）
npm install

# 运行种子数据
npm run seed

# 启动后端
npm run start:dev
```

### 3. 前端对接后端
修改 `client/src/services/recommendService.ts` 中的 `API_BASE` 为你的后端地址

### 4. 正式发布前
- [ ] 替换 `project.config.json` 中的 `touristappid` 为真实 AppID
- [ ] 配置后端域名（需 HTTPS）
- [ ] 微信小程序后台配置服务器域名白名单
- [ ] 对接和风天气 API（配置 API Key）
- [ ] 运营团队审核 30 个种子场所数据的准确性
- [ ] 提交微信小程序审核

### 5. 后续迭代方向
- V1.0：P1 功能上线（早教标签、UGC 摘要、收藏历史）
- V2.0：P2 功能上线（智能日历提醒、遛娃打卡地图、AI 对话推荐）
