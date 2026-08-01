#!/usr/bin/env node
/**
 * export-anki.js — 将 data/ 下 16 个题库 JS 文件导出为 Anki 可导入的 UTF-8 TSV
 *
 * 用法：node tools/export-anki.js
 * 输出：anki/java-mianshi-anki.txt
 *
 * 卡牌设计（Basic 牌型，两字段 + tags 第三列）：
 *   正面 = 分类名 + 难度 + 题干 + 考点(point)
 *   背面 = 回答思路(approach) + 参考答案(a) + 追问与解答(followups) + 记忆钩子(memory)
 *   tags = 分类id + 难度标签 + 原 tags（空格分隔）
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const OUT_DIR = path.join(ROOT, "anki");
const OUT_FILE = path.join(OUT_DIR, "java-mianshi-anki.txt");

const LEVEL_MAP = { 1: "基础", 2: "进阶", 3: "深挖" };

/** 加载全部 data 文件：vm 沙箱中提供 window 全局，eval 文件内容 */
function loadQuestionBank() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".js"))
    .sort();

  const sandbox = { window: {} };
  vm.createContext(sandbox);

  for (const file of files) {
    const code = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  }

  return { files, qb: sandbox.window.QB || {} };
}

/** TSV 安全化：tab → 空格，换行 → <br>，去掉回车与控制字符 */
function esc(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, "    ") // tab 是分隔符，必须替换
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("<br>")
    .trim();
}

/** Anki 标签安全化：标签内空格替换为下划线，去掉 # 等非法字符 */
function tagSafe(tag) {
  return String(tag)
    .trim()
    .replace(/[\s　]+/g, "_")
    .replace(/[#"'`]/g, "")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** 构造正面 HTML */
function buildFront(cat, item) {
  const level = LEVEL_MAP[item.level] || `L${item.level}`;
  const parts = [
    `<b>[${esc(cat.name)}]</b> <i>难度：${esc(level)}</i>`,
    "",
    esc(item.q),
  ];
  if (item.point) {
    parts.push("", `<b>🎯 考点：</b>${esc(item.point)}`);
  }
  return parts.join("<br>");
}

/** 构造背面 HTML */
function buildBack(item) {
  const parts = [];
  if (item.approach) {
    parts.push(`<b>💡 回答思路：</b>${esc(item.approach)}`);
  }
  if (item.a) {
    if (parts.length) parts.push("");
    parts.push(`<b>📖 参考答案：</b>`, esc(item.a));
  }
  const fus = Array.isArray(item.followups) ? item.followups.filter((f) => f && f.q) : [];
  if (fus.length) {
    parts.push("", `<b>🔁 面试官可能追问：</b>`);
    fus.forEach((f, i) => {
      parts.push(`<b>Q${i + 1}：</b>${esc(f.q)}`);
      parts.push(`<b>A${i + 1}：</b>${esc(f.a || "")}`);
    });
  }
  if (item.memory) {
    parts.push("", `<b>🧠 记忆钩子：</b>${esc(item.memory)}`);
  }
  return parts.join("<br>");
}

/** 构造第三列 tags：分类id + 难度 + 原 tags，去重、空格分隔 */
function buildTags(cat, item) {
  const level = LEVEL_MAP[item.level] || `L${item.level}`;
  const raw = [cat.id, `难度-${level}`, ...(Array.isArray(item.tags) ? item.tags : [])];
  const seen = new Set();
  const out = [];
  for (const t of raw) {
    const s = tagSafe(t);
    if (s && !seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out.join(" ");
}

function main() {
  const { files, qb } = loadQuestionBank();
  const catIds = Object.keys(qb);
  if (catIds.length === 0) {
    console.error("❌ 未从 data/ 加载到任何题库数据");
    process.exit(1);
  }

  const header = [
    "#separator:tab",
    "#html:true",
    "#tags column:3",
    "#notetype:Basic",
    "#deck:Java面试题库",
    "#columns:正面\t背面\t标签",
  ];

  const rows = [];
  const stats = [];
  let total = 0;

  for (const id of catIds) {
    const cat = qb[id];
    const questions = Array.isArray(cat.questions) ? cat.questions : [];
    stats.push({ id, name: cat.name, count: questions.length });
    for (const item of questions) {
      const front = buildFront(cat, item);
      const back = buildBack(item);
      const tags = buildTags(cat, item);
      // 防御：字段内绝不允许残留 tab / 换行
      for (const field of [front, back, tags]) {
        if (/[\t\n\r]/.test(field)) {
          throw new Error(`字段转义失败（${item.id}）`);
        }
      }
      rows.push([front, back, tags].join("\t"));
      total++;
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const content = header.join("\n") + "\n" + rows.join("\n") + "\n";
  fs.writeFileSync(OUT_FILE, content, "utf8");

  console.log(`✅ 已加载 ${files.length} 个数据文件，${catIds.length} 个分类`);
  for (const s of stats) {
    console.log(`   ${s.id.padEnd(18)} ${s.name}：${s.count} 题`);
  }
  console.log(`✅ 共导出 ${total} 张卡牌 → ${path.relative(ROOT, OUT_FILE)}`);
  console.log(`   数据行数（不含 ${header.length} 行头部）：${rows.length}`);
}

main();
