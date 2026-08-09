const vm = require('vm'), fs = require('fs');
const x = { window: {} };
vm.createContext(x);
vm.runInContext(fs.readFileSync('data/tutorials/parts/mysql-ext.js', 'utf8'), x);
const nodes = x.window.TB_EXT;

// 提取 JS 源码里的 id（正则取引号内内容）
function extractIds(src, pattern) {
  const out = [];
  const re = new RegExp('id:\\s*"(' + pattern + ')"', 'g');
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}

const cur = fs.readFileSync('data/tutorials/mysql.js', 'utf8');
const bank = fs.readFileSync('data/mysql.js', 'utf8');
const nodeIds = extractIds(cur, 'mysql-[a-z0-9-]+');
const qIds = extractIds(bank, 'mysql-[0-9]+');
console.log('现有教程节点数', nodeIds.length, '题目数', qIds.length);
console.log('新节点与现有冲突', nodes.filter(n => nodeIds.includes(n.id)).map(n => n.id));
console.log('新节点内部重复', (() => { const a = nodes.map(n => n.id); return a.length !== new Set(a).size; })());

// 字数：全部文本块 + SVG 内 text 内容的中文
function cntChinese(str) {
  if (!str) return 0;
  // 去掉 SVG 标签只留 text 内容
  const svgText = (str.match(/<text[^>]*>([^<]*)<\/text>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join(' ');
  return (str.replace(/<[^>]+>/g, ' ').match(/[\u4e00-\u9fff]/g) || []).length
       + (svgText.match(/[\u4e00-\u9fff]/g) || []).length;
}
nodes.forEach((n, i) => {
  let total = 0, svgCnt = 0;
  for (const b of n.body) {
    if (b.t === 'lead' || b.t === 'h' || b.t === 'p' || b.t === 'callout') total += cntChinese(b.text);
    else if (b.t === 'pre' || b.t === 'list' || b.t === 'pits') total += cntChinese(b.items.join(' '));
    else if (b.t === 'table') total += cntChinese(b.rows.flat().join(' '));
    else if (b.t === 'code') total += cntChinese(b.code);
    else if (b.t === 'svg') { svgCnt++; total += cntChinese(b.svg); }
  }
  console.log(i, '全量中文', total, 'svg', svgCnt);
});

// covers/quiz 有效性
nodes.forEach((n, i) => {
  const badC = n.covers.filter(id => !qIds.includes(id));
  const badQ = n.quiz.filter(id => !qIds.includes(id));
  console.log(i, 'covers', JSON.stringify(n.covers), 'quiz', JSON.stringify(n.quiz), '无效cover', badC, '无效quiz', badQ);
});

// layer 与 depends 合理性
nodes.forEach((n, i) => {
  const badD = n.depends.filter(id => !nodeIds.includes(id) && !nodes.map(x => x.id).includes(id));
  console.log(i, 'layer', n.layer, 'depends', JSON.stringify(n.depends), '无效depends', badD);
});
