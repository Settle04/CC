# WSL2 Playwright Chromium 依赖库缺失

## 问题描述

Playwright 启动 Chromium 时报错：
```
error while loading shared libraries: libnspr4.so: cannot open shared object file
```

## 根本原因

WSL2 环境缺少 Chromium 运行所需的系统库：
- libnspr4.so
- libnss3.so
- libnssutil3.so
- libasound.so.2

`npx playwright install-deps` 需要 sudo 密码安装系统依赖，当前环境无法执行。

## 解决方案

无需 sudo，手动下载并提取 deb 包：

```bash
# 下载 deb 包
cd /tmp && apt-get download libnspr4 libnss3 libasound2

# 提取到用户目录
mkdir -p ~/.local/lib
dpkg-deb -x libnspr4_*.deb ~/.local/lib/
dpkg-deb -x libnss3_*.deb ~/.local/lib/
dpkg-deb -x libasound2_*.deb ~/.local/lib/
```

使用时设置环境变量：
```bash
LD_LIBRARY_PATH=~/.local/lib/usr/lib/x86_64-linux-gnu node your_script.js
```

## 环境信息

- 系统：WSL2 Ubuntu 22.04
- Node：v24.15.0
- Chromium：ms-playwright/chromium_headless_shell-1217
- 库路径：`~/.local/lib/usr/lib/x86_64-linux-gnu/`

## 验证结果

```bash
LD_LIBRARY_PATH=/home/settle/.local/lib/usr/lib/x86_64-linux-gnu node -e "
const { chromium } = require('./node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://platform.minimaxi.com/docs/guides/token-plan-mcp-guide');
  console.log('Page title:', await page.title());
  await browser.close();
})();
"

# 输出: Page title: Token Plan MCP - MiniMax 开放平台文档中心
```

## 状态

**已解决** — 2026-04-26

## 相关文档

- 详细记录：`/home/settle/projects/playwright-mcp-setup.md`
