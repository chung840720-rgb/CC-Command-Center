// Batch fix stale skill counts + category names after 24→19 merge
const fs = require('fs');
const path = require('path');

const files = [
  'src/components/TopNav.tsx',
  'src/pages/Skills.tsx',
  'src/pages/Trust.tsx',
  'src/pages/DataPipeline.tsx',
];

const REPLACEMENTS = [
  ['22 份個人能力沉澱', '19 份個人能力沉澱（2 master + 17 SOP）'],
  ['21 份 SOP', '19 份 SOP'],
  ['23 份 SOP', '19 份 SOP'],
  ['20 份 SOP', '19 份 SOP'],
  ['🔧 平台 API 反向工程', '🔧 平台 ETL + MCP × AI'],
  ['看 21 份 SOP', '看 19 份 SOP'],
];

files.forEach((f) => {
  const fullPath = path.join(__dirname, '..', f);
  let content = fs.readFileSync(fullPath, 'utf8');
  let count = 0;
  REPLACEMENTS.forEach(([from, to]) => {
    while (content.indexOf(from) !== -1) {
      content = content.replace(from, to);
      count++;
    }
  });
  if (count > 0) {
    fs.writeFileSync(fullPath, content);
    console.log('✓', f, '→', count, 'replacements');
  }
});
