const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ============================================================
// 86hk.vip 商品数据抓取脚本
// 用法: node scraper.js
// 前提: 已通过 Claude Code 登录过一次（.browser-profile 存在）
// ============================================================

const PROFILE_DIR = path.join(__dirname, '.browser-profile');
const BASE_URL = 'https://www.86hk.vip';

const today = new Date().toISOString().substring(0, 10);
const OUTPUT_DIR = path.join(__dirname, '数据', today);

async function main() {
  if (!fs.existsSync(PROFILE_DIR)) {
    console.error('❌ 未找到 .browser-profile 目录，请先在 Claude Code 中登录一次。');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('🚀 启动浏览器...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: true,
    viewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();

  try {
    // Step 1: 验证登录状态
    console.log('🔐 验证登录状态...');
    await page.goto(`${BASE_URL}/admin/dashboard?ref=addtabs`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    if (page.url().includes('/admin/index/login')) {
      console.error('❌ 登录已过期，请在 Claude Code 中重新登录。');
      await browser.close();
      process.exit(1);
    }
    console.log('✅ 已登录');

    // Step 2: 进入商品管理页
    console.log('📋 进入商品管理页...');
    await page.goto(`${BASE_URL}/admin/goods?ref=addtabs`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    console.log('  页面标题:', await page.title());

    // Step 3: 用 jQuery AJAX 抓取列表 + 详情
    console.log('📝 抓取商品列表与详情（串行，约 1-2 分钟）...');
    const result = await page.evaluate(async () => {
      // 获取列表
      const listData = await new Promise((resolve, reject) => {
        $.ajax({
          url: '/admin/goods/index',
          data: { status: 1, settlement_method: 2, sort: 'id', order: 'desc', offset: 0, limit: 500, filter: '{}', op: '{}' },
          dataType: 'json',
          success: (data) => resolve(data),
          error: (xhr, s, e) => reject(e || s)
        });
      });

      const products = listData.rows.map(p => ({
        id: p.id,
        goods_name: p.goods_name,
        product_id: p.product_id,
        parent_goods_id: p.parent_goods_id,
        title_picture: p.title_picture,
        create_time: p.create_time,
        point_msg: p.point_msg,
        brokerage_msg: p.brokerage_msg,
        rule_msg: p.rule_msg,
        agent_brokerage: p.agent_brokerage,
        agent_crown: p.agent_crown,
        agent_dragon: p.agent_dragon,
        settlement_rule: p.settlement_rule,
        province_tag: p.province_tag
      }));

      const parentIds = products.map(p => p.parent_goods_id);

      const hasTags = (html) => /<[a-zA-Z/][^>]*>/.test(html);

      const parseDetail = (html, id) => {
        const $temp = $('<div>').html(html);
        const name = $temp.find('.f1').contents().first().text().trim();
        const image = $temp.find('.jjj').attr('src') || '';
        const sections = {};

        $temp.find('.copy_title').each(function () {
          const titleEl = $(this).find('.f2.p');
          const contentEl = $(this).find('.f3, .f5, .f6');
          if (!titleEl.length || !contentEl.length) return;

          const title = titleEl.text().trim();
          const innerHTML = contentEl.html().trim();

          const paragraphs = contentEl.find('p');
          let text;
          if (paragraphs.length > 0) {
            text = paragraphs.map(function () { return $(this).text().trim(); }).get().join('\n');
          } else {
            text = contentEl.text().trim();
          }

          if (hasTags(innerHTML)) {
            sections[title] = { text, html: innerHTML };
          } else {
            sections[title] = text;
          }
        });

        return { parent_goods_id: id, name, image, sections };
      };

      const details = [];
      for (let i = 0; i < parentIds.length; i++) {
        try {
          const html = await $.get('/admin/goods/get_document', { ids: parentIds[i] });
          details.push(parseDetail(html, parentIds[i]));
        } catch (e) {
          details.push({ parent_goods_id: parentIds[i], error: 'fetch failed' });
        }
        if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${parentIds.length}`);
      }

      return { products, details };
    });

    const { products, details } = result;
    console.log(`  列表: ${products.length} 条`);
    console.log(`  详情: ${details.filter(d => !d.error).length}/${details.length} 条成功`);

    // Step 4: 合并列表与详情
    const detailMap = {};
    details.forEach(d => { detailMap[d.parent_goods_id] = d; });
    const merged = products.map(p => ({ ...p, detail: detailMap[p.parent_goods_id] || null }));

    // Step 5: 保存
    const listPath = path.join(OUTPUT_DIR, '商品列表.json');
    const detailPath = path.join(OUTPUT_DIR, '商品详情.json');
    const fullPath = path.join(OUTPUT_DIR, '商品完整数据.json');

    fs.writeFileSync(listPath, JSON.stringify(products, null, 2));
    fs.writeFileSync(detailPath, JSON.stringify(details, null, 2));
    fs.writeFileSync(fullPath, JSON.stringify(merged, null, 2));

    console.log(`✅ 已保存到 ${OUTPUT_DIR}/`);
    console.log(`   商品列表.json   — ${products.length} 条`);
    console.log(`   商品详情.json   — ${details.filter(d => !d.error).length}/${details.length} 条成功`);
    console.log(`   商品完整数据.json — 列表+详情合并`);

    // Step 6: 与上次数据对比
    const dataRoot = path.join(__dirname, '数据');
    const dateDirs = fs.readdirSync(dataRoot)
      .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse();

    const prevDir = dateDirs.find(d => d !== today);
    if (prevDir) {
      const prevFullPath = path.join(dataRoot, prevDir, '商品完整数据.json');
      if (fs.existsSync(prevFullPath)) {
        const prevData = JSON.parse(fs.readFileSync(prevFullPath, 'utf8'));
        const prevIds = new Set(prevData.map(p => p.parent_goods_id));
        const currIds = new Set(merged.map(p => p.parent_goods_id));

        const added = merged.filter(p => !prevIds.has(p.parent_goods_id));
        const removed = prevData.filter(p => !currIds.has(p.parent_goods_id));
        const changed = [];
        merged.forEach(p => {
          if (!p.detail) return;
          const prev = prevData.find(pp => pp.parent_goods_id === p.parent_goods_id);
          if (prev && prev.detail && JSON.stringify(p.detail) !== JSON.stringify(prev.detail)) {
            changed.push({ goods_name: p.goods_name, parent_goods_id: p.parent_goods_id });
          }
        });

        console.log(`\n📊 变化对比（对比 ${prevDir}）:`);
        console.log(`   🆕 新增: ${added.length} 条`);
        if (added.length > 0 && added.length <= 10) {
          added.forEach(p => console.log(`      - ${p.goods_name}`));
        }
        console.log(`   ❌ 下架: ${removed.length} 条`);
        if (removed.length > 0 && removed.length <= 10) {
          removed.forEach(p => console.log(`      - ${p.goods_name}`));
        }
        console.log(`   ✏️  内容变化: ${changed.length} 条`);
        if (changed.length > 0 && changed.length <= 10) {
          changed.forEach(p => console.log(`      - ${p.goods_name}`));
        }

        if (added.length > 0 || removed.length > 0 || changed.length > 0) {
          const report = { 对比日期: prevDir, 新增: added, 下架: removed, 内容变化: changed };
          fs.writeFileSync(path.join(OUTPUT_DIR, '变化报告.json'), JSON.stringify(report, null, 2));
          console.log(`   变化报告已保存到 变化报告.json`);
        }
      }
    }

  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await browser.close();
    console.log('🔒 浏览器已关闭');
  }
}

main();
