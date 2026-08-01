#!/usr/bin/env node
/**
 * 题库数据质检脚本（临时工具）
 * 用法: node tools/qa-check.js [--json]
 * 校验项:
 *  1. 每个 data/*.js 可加载、questions 非空
 *  2. 每题 id 全局唯一，且与文件名前缀一致（允许 <prefix>-NN 或 <prefix>NN 变体）
 *  3. level ∈ {1,2,3}
 *  4. q / a 非空字符串
 *  5. point / approach / memory / followups / tags 字段存在情况统计（缺失列出题号）
 *  6. followups 元素结构合法（对象含 q、a 或字符串）
 *  7. 难度分布统计
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const OUT_JSON = process.argv.includes("--json");

const files = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.endsWith(".js"))
  .sort();

const report = {
  filesChecked: 0,
  fileErrors: [],
  totalQuestions: 0,
  perFile: {},
  globalIds: new Map(), // id -> file
  duplicateIds: [],
  prefixMismatches: [], // {file, id, expected}
  badLevel: [],
  emptyQ: [],
  emptyA: [],
  missingFields: { point: [], approach: [], memory: [], followups: [], tags: [] },
  badFollowups: [],
  levelDist: { 1: 0, 2: 0, 3: 0, other: 0 },
};

function expectedPrefixes(fileBase) {
  // e.g. game-server -> ["game-server-", "gameserver-", "gs-"] 宽松匹配：去连字符比较
  return fileBase;
}

for (const file of files) {
  const fileBase = file.replace(/\.js$/, "");
  const filePath = path.join(DATA_DIR, file);
  let bank;
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: file });
    bank = sandbox.window.QB && sandbox.window.QB[fileBase];
    if (!bank) {
      // 兼容: 文件可能注册了别的 key
      const keys = Object.keys(sandbox.window.QB || {});
      report.fileErrors.push({ file, error: `window.QB 未注册 "${fileBase}"，实际 key: ${keys.join(",") || "(空)"}` });
      continue;
    }
  } catch (e) {
    report.fileErrors.push({ file, error: "加载失败: " + e.message });
    continue;
  }

  report.filesChecked++;
  const qs = bank.questions;
  if (!Array.isArray(qs) || qs.length === 0) {
    report.fileErrors.push({ file, error: "questions 为空或非数组" });
    continue;
  }

  report.perFile[fileBase] = { count: qs.length, levels: { 1: 0, 2: 0, 3: 0, other: 0 } };

  const baseNorm = fileBase.replace(/-/g, "");
  for (const item of qs) {
    report.totalQuestions++;
    const id = item && item.id;

    // id 唯一性
    if (typeof id !== "string" || !id) {
      report.duplicateIds.push({ file, id: String(id), reason: "id 缺失或非字符串" });
    } else {
      if (report.globalIds.has(id)) {
        report.duplicateIds.push({ file, id, reason: `与 ${report.globalIds.get(id)} 重复` });
      } else {
        report.globalIds.set(id, file);
      }
      // 前缀一致性：id 的前缀（去掉末尾 -NN / NN 数字）与文件名前缀一致
      const m = id.match(/^([a-zA-Z-]+?)-?(\d+)$/);
      const idPrefix = m ? m[1] : id;
      if (idPrefix.replace(/-/g, "") !== baseNorm) {
        report.prefixMismatches.push({ file, id, expected: fileBase + "-NN" });
      }
    }

    // level
    if (![1, 2, 3].includes(item.level)) {
      report.badLevel.push({ file, id, level: item.level });
      report.levelDist.other++;
      report.perFile[fileBase].levels.other++;
    } else {
      report.levelDist[item.level]++;
      report.perFile[fileBase].levels[item.level]++;
    }

    // q / a 非空
    if (typeof item.q !== "string" || !item.q.trim()) report.emptyQ.push({ file, id });
    if (typeof item.a !== "string" || !item.a.trim()) report.emptyA.push({ file, id });

    // 可选字段存在性
    for (const f of ["point", "approach", "memory", "followups", "tags"]) {
      const v = item[f];
      const missing = v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0);
      if (missing) report.missingFields[f].push(`${fileBase}:${id}`);
    }

    // followups 结构
    if (Array.isArray(item.followups)) {
      item.followups.forEach((fu, i) => {
        const ok =
          typeof fu === "string"
            ? fu.trim().length > 0
            : fu && typeof fu === "object" && typeof fu.q === "string" && fu.q.trim() && typeof fu.a === "string" && fu.a.trim();
        if (!ok) report.badFollowups.push({ file, id, index: i, value: JSON.stringify(fu).slice(0, 80) });
      });
    }
  }
}

const failCount =
  report.fileErrors.length +
  report.duplicateIds.length +
  report.prefixMismatches.length +
  report.badLevel.length +
  report.emptyQ.length +
  report.emptyA.length +
  report.badFollowups.length;

if (OUT_JSON) {
  const r = { ...report };
  delete r.globalIds;
  console.log(JSON.stringify(r, null, 2));
  process.exit(failCount ? 1 : 0);
}

console.log("========== 题库质检报告 ==========");
console.log(`文件数: ${files.length}，成功加载: ${report.filesChecked}，总题数: ${report.totalQuestions}`);
console.log(`硬性错误数: ${failCount}（文件错误 ${report.fileErrors.length} / 重复id ${report.duplicateIds.length} / 前缀不符 ${report.prefixMismatches.length} / 非法level ${report.badLevel.length} / 空q ${report.emptyQ.length} / 空a ${report.emptyA.length} / 追问结构异常 ${report.badFollowups.length}）`);
console.log("");
console.log("-- 各分类题数 --");
for (const [k, v] of Object.entries(report.perFile)) {
  console.log(`  ${k}: ${v.count} 题 (L1=${v.levels[1]}, L2=${v.levels[2]}, L3=${v.levels[3]}${v.levels.other ? ", other=" + v.levels.other : ""})`);
}
console.log("");
console.log("-- 难度分布 --");
console.log(`  L1 基础必会: ${report.levelDist[1]} (${pct(report.levelDist[1], report.totalQuestions)})`);
console.log(`  L2 进阶高频: ${report.levelDist[2]} (${pct(report.levelDist[2], report.totalQuestions)})`);
console.log(`  L3 深挖架构: ${report.levelDist[3]} (${pct(report.levelDist[3], report.totalQuestions)})`);
if (report.levelDist.other) console.log(`  非法 level: ${report.levelDist.other}`);
console.log("");

console.log("-- 可选字段缺失统计（缺失题号） --");
for (const [f, list] of Object.entries(report.missingFields)) {
  console.log(`  ${f}: 缺失 ${list.length} 题${list.length ? " -> " + list.join(", ") : ""}`);
}
console.log("");

function dump(title, arr, fmt) {
  if (!arr.length) return;
  console.log(`-- ${title} (${arr.length}) --`);
  arr.forEach((x) => console.log("  " + fmt(x)));
  console.log("");
}
dump("文件加载错误", report.fileErrors, (x) => `${x.file}: ${x.error}`);
dump("id 重复/缺失", report.duplicateIds, (x) => `${x.file}: ${x.id} (${x.reason})`);
dump("id 前缀与文件名不符", report.prefixMismatches, (x) => `${x.file}: ${x.id}，期望前缀 ${x.expected}`);
dump("非法 level", report.badLevel, (x) => `${x.file}: ${x.id} level=${x.level}`);
dump("q 为空", report.emptyQ, (x) => `${x.file}: ${x.id}`);
dump("a 为空", report.emptyA, (x) => `${x.file}: ${x.id}`);
dump("followups 元素结构异常", report.badFollowups, (x) => `${x.file}: ${x.id} followups[${x.index}] = ${x.value}`);

console.log(failCount === 0 ? "✅ 质检全部通过" : "❌ 存在需处理问题，见上文");
process.exit(failCount ? 1 : 0);

function pct(n, total) {
  return ((n / total) * 100).toFixed(1) + "%";
}
