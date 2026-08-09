const vm = require('vm'), fs = require('fs');
const x = { window: {} };
vm.createContext(x);
vm.runInContext(fs.readFileSync('data/tutorials/parts/mysql-ext.js', 'utf8'), x);
const nodes = x.window.TB_EXT;
let bad = 0;
nodes.forEach((n, i) => {
  n.body.filter(b => b.t === 'svg').forEach((s, j) => {
    const svg = s.svg;
    // 去除全部标签后，检查残留的 < > &
    const text = svg.replace(/<[^>]*>/g, '');
    const lt = (text.match(/</g) || []).length;
    const gt = (text.match(/>/g) || []).length;
    const amp = (text.match(/&/g) || []).length;
    // 标签结构：< 后必须是字母或 /
    const badLt = (svg.match(/<[^a-zA-Z/!?]/g) || []).length;
    // 检查 text 元素字号
    const smallFont = (svg.match(/font-size="(1[01]|9|8|7|6|5|4|3|2|1)"/g) || []).length;
    if (lt || gt || amp || badLt || smallFont) {
      bad++;
      console.log(i + '/' + j, '残留<', lt, '残留>', gt, '残留&', amp, '坏标签<', badLt, '字号<12px', smallFont);
    }
  });
});
console.log('SVG 违规总数', bad);
// 中文标注字号最小检查：找出所有 font-size 值
const sizes = new Set();
nodes.forEach(n => n.body.filter(b => b.t === 'svg').forEach(s => {
  (s.svg.match(/font-size="([\d.]+)"/g) || []).forEach(v => sizes.add(v));
}));
console.log('出现的字号', [...sizes].join(', '));
