const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sourcePath = path.join(__dirname, '..', 'index.html');
const source = fs.readFileSync(sourcePath, 'utf8');

function extractFunction(name) {
  const signature = `function ${name}`;
  const start = source.indexOf(signature);
  assert(start !== -1, `Khong tim thay ham ${name} trong index.html`);

  let braceIndex = source.indexOf('{', start);
  let depth = 0;
  let end = braceIndex;

  for (; end < source.length; end += 1) {
    const char = source[end];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        end += 1;
        break;
      }
    }
  }

  return source.slice(start, end);
}

const sanitizeFn = extractFunction('sanitizeMapId');
const formatFn = extractFunction('formatMapIdFromDate');

const context = { result: null };
vm.createContext(context);
vm.runInContext(`${sanitizeFn}\n${formatFn}\nresult = formatMapIdFromDate(new Date('2026-04-09T21:26:00'));`, context);

assert.strictEqual(
  context.result,
  '2126thu09apr2026',
  'Map ID mac dinh phai duoc sinh theo gio-phut-thu-ngay-thang-nam'
);

assert(
  source.includes('setExportMapId(createAutoMapId());'),
  'O Map ID nen duoc dien san ngay khi tai trang'
);

assert(
  source.includes("let currentImageSrc = '';"),
  'Can luu image src hien tai rieng de export duoc ca URL va data src'
);

assert(
  source.includes("let imgUrl = currentImageSrc;"),
  'Export phai uu tien currentImageSrc thay vi bat buoc currentImageUrl'
);

assert(
  source.includes("currentImageUrl = '';"),
  'Khi upload anh can xoa URL cu de tranh xung dot voi data src'
);

assert(
  source.includes('setCurrentImageSource(e.target.result, \'upload\');'),
  'Khi upload anh can luu data src lam nguon anh hien tai'
);

assert(
  source.includes("setCurrentImageSource(url, 'url');"),
  'Khi nhap URL can ghi de nguon anh hien tai bang URL'
);

console.log('Map ID and image source regression checks passed.');
