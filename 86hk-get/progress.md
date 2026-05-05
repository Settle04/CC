# 86hk.vip 商品数据抓取 - 进度记录

## 目标
从 `https://www.86hk.vip/admin/dashboard` 后台抓取约 300 个在售商品的"查看资料"详情，用于视频创作素材。

## 环境信息
- **站点**: https://www.86hk.vip （号易系统）
- **后台入口**: /admin/dashboard?ref=addtabs
- **方案**: 使用 Playwright MCP 操控浏览器完成登录和数据抓取
- **登录持久化**: `.browser-profile` 目录（已验证，关闭重开无需登录）

## 完成状态

| 时间 | 步骤 | 状态 |
|------|------|------|
| 2026-05-02 | 登录后台 | ✅ 已持久化 |
| 2026-05-02 | 发现列表 API `/admin/goods/index` | ✅ JSON 格式 |
| 2026-05-02 | 发现详情 API `/admin/goods/get_document?ids=` | ✅ HTML 格式 |
| 2026-05-02 | 批量抓取 298 条商品详情 | ✅ 291/298 完整 (97.7%) |
| 2026-05-02 | 修正数据结构（小标题作为 key，段落保留） | ✅ v4 |

## 输出文件

| 文件 | 说明 | 大小 |
|------|------|------|
| `86hk_products_list.json` | 商品列表（298条，含佣金/标签/结算规则） | 264KB |
| `86hk_products_detail_v4.json` | 商品详情（298条，小标题→内容映射） | 1.6MB |
| `86hk_products_full_v2.json` | **主文件**（列表+详情合并，291条完整） | 1.9MB |

## 数据结构

每条商品包含：
- 基础信息：商品名称、编码、图片、发布时间
- 佣金相关：收入佣金、皇冠/龙奖励、给下级佣金、结算规则
- 标签：激活方式、发货范围（point_msg 数组）
- 详情 sections（14个小标题）：
  - 产品特色、原套餐、优惠详情、快递方式、是否支持5G
  - 激活方式、充值链接、办卡年龄、合约期、定向范围
  - 激活流程图、温馨提示、复机及注销方式、不发货地区
- 每个 section 包含 `.text`（纯文本，段落用换行分隔）和 `.html`（原始HTML）

## API 备忘

- 列表：`GET /admin/goods/index?status=1&settlement_method=2&sort=id&order=desc&offset=0&limit=300&filter={}&op={}`
- 详情：`GET /admin/goods/get_document?ids={parent_goods_id}`
- 需要请求头：`X-Requested-With: XMLHttpRequest`
