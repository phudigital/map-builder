const assert = require('assert');
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'index.html');
const source = fs.readFileSync(sourcePath, 'utf8');

const headerStart = source.indexOf('<header class="header">');
const headerEnd = source.indexOf('</header>');
assert(headerStart !== -1 && headerEnd !== -1, 'Khong tim thay header trong index.html');

const headerHtml = source.slice(headerStart, headerEnd);

assert(
  headerHtml.includes('class="header-toggle"'),
  'Tu chon xuat legend nen dung control toggle trong header'
);

assert(
  headerHtml.includes('class="header-toggle-input"'),
  'Toggle legend nen co input rieng de de style va truy cap'
);

assert(
  headerHtml.includes('class="header-toggle-slider"'),
  'Toggle legend nen co slider hien thi trang thai bat/tat'
);

assert(
  headerHtml.includes('📋 Bảng chú thích'),
  'Label toggle legend nen hien thi text moi'
);

assert(
  source.includes("btn.innerHTML = '✅ Đã copy!';"),
  'Sau khi copy, nut phai doi sang trang thai Da copy'
);

assert(
  !source.includes("setTimeout(() => btn.innerHTML = originalText, 2000);"),
  'Nut copy khong nen tu reset ve Copy code sau khi da copy'
);

console.log('Export toggle and copy state regression checks passed.');
