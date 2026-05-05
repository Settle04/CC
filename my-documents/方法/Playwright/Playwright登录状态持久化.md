# Playwright 登录状态持久化

## 概述

使用 Playwright 的 `storageState` 功能实现登录状态持久化，避免每次运行都需要重新登录。

## 核心原理

`context.storageState()` 会保存完整的浏览器状态（cookies + localStorage/sessionStorage），比只保存 cookies 更可靠。

## 方法文件

```javascript
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'state.json');

async function main() {
  console.log('启动浏览器...');
  const browser = await chromium.launch({ headless: false });

  // 检查是否有已保存的状态
  const hasState = fs.existsSync(STATE_FILE);

  // 创建 context，storageState 自动加载已有状态
  const context = await browser.newContext({
    storageState: hasState ? STATE_FILE : undefined
  });

  const page = await context.newPage();

  await page.goto('https://www.biji.com/note', { waitUntil: 'networkidle' });

  if (!hasState) {
    console.log('首次登录，请在浏览器中登录...');
    console.log('登录后回到终端输入"done"并回车，然后可以关闭浏览器');

    // 等待用户输入
    await new Promise((resolve) => {
      process.stdin.once('data', () => resolve());
    });

    // 保存完整状态（cookies + storage）
    console.log('保存状态...');
    const state = await context.storageState();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));
    console.log('状态已保存到 state.json');
  } else {
    console.log('已加载登录状态！');
  }

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('完成！');
}

main().catch(console.error);
```

## 使用流程

### 首次登录

1. 运行脚本：`node login-state.js`
2. 浏览器打开 → 手动登录网站
3. 登录后**不要关闭浏览器**，回终端输入 `done` **回车**
4. 状态自动保存到 `state.json`
5. 可以关闭浏览器

### 后续使用

直接运行脚本，已保存的状态会自动加载，无需再次登录。

## 关键点

1. **`storageState` vs 只保存 cookies**：`storageState` 保存完整状态包括 localStorage，登录持久化更可靠
2. **使用绝对路径**：`__dirname` 确保路径正确
3. **headless: false**：需要手动操作时使用，已登录后可改为 true

## 来源问题

[WSL2 Playwright 依赖库缺失](./问题/2026-04-26/WSL2-Playwright依赖库缺失.md)

---

## 案例：86hk.vip 管理后台登录持久化

**目标网站：** https://www.86hk.vip/admin/index/login

**脚本：**
```javascript
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginUrl = 'https://www.86hk.vip/admin/index/login?url=%2Fadmin%2Fdashboard%3Fref%3Daddtabs';
  
  console.log('打开登录页...');
  await page.goto(loginUrl);

  console.log('请手动登录...');
  await page.waitForURL('**/admin/dashboard**', { timeout: 0 });

  console.log('登录成功，保存 cookies...');
  const cookies = await context.cookies();
  fs.writeFileSync(path.join(__dirname, 'cookies.json'), JSON.stringify(cookies, null, 2));

  console.log('Cookies 已保存到 cookies.json');
  await browser.close();
})();
```

**流程：**
1. 运行脚本 → 浏览器打开登录页
2. 手动登录 → 脚本检测到跳转 dashboard → 自动保存 cookies 到 cookies.json

**关键点：**
- 使用 `waitForURL` 监听登录成功后的跳转
- 只保存 cookies，未使用 `storageState`（如果持久化失败可改用 storageState）

---

## 案例：86hk.vip 商品详情抓取

**目标：** 从商品列表进入每个商品的"查看资料"弹窗，抓取详细信息

**关键发现：**
1. 弹窗是 layui iframe，URL 格式：`/admin/goods/get_document?ids={抓单编码}`
2. 弹窗内容在 Frame 3 中
3. 需要 `layer.closeAll()` 关闭弹窗才能继续操作

**脚本：**
```javascript
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

let allDetails = [];
const dataFile = path.join(__dirname, 'product-details.json');
if (fs.existsSync(dataFile)) {
  allDetails = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  console.log(`已加载 ${allDetails.length} 条已有数据`);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const cookies = JSON.parse(fs.readFileSync(path.join(__dirname, 'cookies.json'), 'utf-8'));
  await context.addCookies(cookies);

  const page = await context.newPage();
  await page.goto('https://www.86hk.vip/admin/goods?ref=addtabs', { waitUntil: 'networkidle' });

  const frame = page.frames().find(f => f.url().includes('addtabs=1'));
  await frame.waitForSelector('#table1 tbody tr', { timeout: 10000 });

  // 关闭弹窗
  const closeAllPopups = async () => {
    await frame.evaluate(() => {
      if (window.layer) layer.closeAll();
      document.querySelectorAll('.layui-layer, .layui-layer-shade, .layui-layer-iframe').forEach(el => el.remove());
    });
    await page.waitForTimeout(200);
  };

  // 获取详情
  const getDetail = async (rowIndex) => {
    await closeAllPopups();
    await frame.click(`.opendAdd_express_type[data-row-index="${rowIndex}"]`);
    await page.waitForTimeout(2000);
    const frame3 = page.frames().find(f => f.url().includes('get_document'));
    if (!frame3) return null;
    return await frame3.evaluate(() => document.body?.innerText || '');
  };

  let pageNum = 1;
  let startPage = Math.floor(allDetails.length / 10) + 1 || 1;
  let startRow = allDetails.length % 10;

  while (true) {
    const rowCount = await frame.evaluate(() => document.querySelectorAll('#table1 tbody tr').length);
    const startRowIdx = pageNum === startPage ? startRow : 0;

    for (let i = startRowIdx; i < rowCount; i++) {
      try {
        const detail = await getDetail(i);
        if (detail) {
          allDetails.push({ page: pageNum, row: i + 1, content: detail, timestamp: Date.now() });
          if (allDetails.length % 5 === 0) fs.writeFileSync(dataFile, JSON.stringify(allDetails, null, 2));
        }
      } catch (e) { /* 错误处理 */ }
      await page.waitForTimeout(200);
    }

    // 翻页逻辑...
  }
})();
```

**结果：**
- 总抓取：285 条（第30页只抓到前3条）
- 输出：`product-details.json`
- 特性：断点续传、每5条自动保存

**问题解决：**
1. 弹窗阻挡点击 → `layer.closeAll()` + 移除 `.layui-layer` 元素
2. 超时失败 → try-catch 捕获异常
