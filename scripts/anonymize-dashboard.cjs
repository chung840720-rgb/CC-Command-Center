// Anonymize all real person names + KOL names from dashboard before deploy
// 6/16 19:00 — Pre-interview safety pass

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Mapping：真實 → 匿名（順序很重要：長字串先換）
const REPLACEMENTS = [
  // 員工 / 老闆 — 長字串優先
  ['笙闆', '老闆'],
  ['笙哥', '老闆'],
  ['Tiffany', '老闆娘'],
  ['鍾尚勲', 'Johnny'],
  ['饅頭', 'Johnny'],

  // 員工名
  ['羽芯', '王大明'],
  ['跳跳', '林小美'],
  ['妮妮', '張大同'],
  ['Nini', '張大同'],
  ['媛媛', '宋小芳'],
  ['戴戴', '陳大華'],
  ['依庭', '蘇小美'],
  ['小瑄', '李大方'],
  ['Emily', '林大寶'],
  ['阿芸', '周小芳'],
  ['白白', '張小白'],
  ['美鳳', '前會計'],
  ['冠達', '外包代操 A'],
  ['詠婕', '客服 A'],
  ['采妮', '客服 B'],
  ['傅傅', '行銷專員 A'],
  ['Cara', '行銷專員 B'],
  ['于婷', '專櫃組長'],
  ['可可', '門市 A'],
  ['亞宣', '門市 B'],
  ['涵涵', '門市 C'],
  ['Vivian', '蝦皮商城 PM'],
  ['Linda', '蝦皮 KAM'],

  // KOL / KOC
  ['KOL-A', 'KOL-B'],
  ['KOL-B', 'KOL-A'],
  ['KOL-C', 'KOL-C'],
  ['KOL-D', 'KOL-D'],
  ['蔡阿嘎夫婦', '名人 KOL-A'],
  ['蔡阿嘎', '名人 KOL-A'],
  ['李李仁', '品牌代言人'],
  ['佩甄', '名人推薦 A'],
  ['許維恩', '名人推薦 B'],
  ['連靜雯', '名人推薦 C'],
  ['蹦闆', '名人推薦 D'],

  // KOC（順序重要：複合詞優先）
  ['KOC-1+KOC-2+KOC-3+KOC-4+KOC', 'KOC-1+2+3+4'],
  ['KOC-1+KOC-2+KOC-3+KOC-4', 'KOC-1+2+3+4'],
  ['KOC-1', 'KOC-1'],
  ['KOC-2', 'KOC-2'],
  ['KOC-3', 'KOC-3'],

  // 平台命名 — 真實串接 narrative → Demo
  ['Meta API 已連線', 'Meta MCP Demo 架構'],
  ['Google Ads API 已連線', 'Google Ads Demo 架構'],
  ['GA4 已連線', 'GA4 Demo 架構'],
  ['Shoplytics 已連線', 'Shoplytics Demo 架構'],
  ['Meta MCP 已串接', 'Meta MCP Demo 架構（離職前實測過、現脫敏）'],
];

// 要處理的檔案
const FILE_GLOBS = [
  'src/pages/*.tsx',
  'src/components/**/*.tsx',
  'public/data/snapshot.json',
];

function walkAndReplace(dirPath, extensions) {
  const results = [];
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        walk(fullPath);
      } else if (item.isFile() && extensions.some((ext) => item.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  walk(dirPath);
  return results;
}

const files = [
  ...walkAndReplace(path.join(ROOT, 'src'), ['.tsx', '.ts']),
  path.join(ROOT, 'public/data/snapshot.json'),
];

let totalReplacements = 0;
const fileChanges = {};

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fileReplaceCount = 0;
  const replacementsInFile = {};

  for (const [from, to] of REPLACEMENTS) {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, to);
      fileReplaceCount += matches.length;
      replacementsInFile[from] = matches.length;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    const relPath = path.relative(ROOT, filePath);
    fileChanges[relPath] = { count: fileReplaceCount, replacements: replacementsInFile };
    totalReplacements += fileReplaceCount;
  }
}

console.log(`✅ Anonymization complete`);
console.log(`   Total replacements: ${totalReplacements}`);
console.log(`   Files modified: ${Object.keys(fileChanges).length}`);
console.log('');
for (const [file, { count, replacements }] of Object.entries(fileChanges)) {
  console.log(`📄 ${file} (${count} replacements)`);
  for (const [from, n] of Object.entries(replacements)) {
    console.log(`   ${from} → ${REPLACEMENTS.find(([f]) => f === from)[1]} × ${n}`);
  }
}
