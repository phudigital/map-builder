const assert = require('assert');
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'index.html');
const source = fs.readFileSync(sourcePath, 'utf8');

const headerStart = source.indexOf('<header class="header">');
const headerEnd = source.indexOf('</header>');
const modalStart = source.indexOf('<div class="modal-overlay" id="exportModal">');
const modalEnd = source.indexOf('</div>\n    </div>\n\n    <script>');

assert(headerStart !== -1 && headerEnd !== -1, 'Khong tim thay header trong index.html');
assert(modalStart !== -1 && modalEnd !== -1, 'Khong tim thay export modal trong index.html');

const headerHtml = source.slice(headerStart, headerEnd);
const exportModalHtml = source.slice(modalStart, modalEnd);

assert(
  headerHtml.includes('id="mapExportId"'),
  'Map ID phai duoc dua ra ngoai modal, uu tien trong header'
);

assert(
  headerHtml.includes('id="includeLegend"'),
  'Checkbox xuat bang chu thich phai duoc dua ra ngoai modal'
);

assert(
  !exportModalHtml.includes('id="mapExportId"'),
  'Map ID khong nen nam trong export modal nua'
);

assert(
  !exportModalHtml.includes('id="includeLegend"'),
  'Checkbox xuat legend khong nen nam trong export modal nua'
);

assert(
  source.includes("document.getElementById('includeLegend').addEventListener('change', refreshExportPreviewIfOpen);"),
  'Checkbox legend phai cap nhat lai code export khi thay doi'
);

assert(
  source.includes("document.getElementById('mapExportId').addEventListener('input'"),
  'Map ID nen cap nhat code export ngay khi dang go'
);

assert(
  source.includes("document.getElementById('mapExportId').addEventListener('change'"),
  'Map ID phai cap nhat lai code export khi thay doi'
);

assert(
  source.includes("navigator.clipboard.writeText(activeBlock.textContent)"),
  'Nut copy phai tiep tuc copy noi dung code hien dang active'
);

console.log('Export controls layout regression checks passed.');
