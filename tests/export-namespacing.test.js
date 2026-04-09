const assert = require('assert');
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'index.html');
const source = fs.readFileSync(sourcePath, 'utf8');

const exportStart = source.indexOf('function refreshExportPreview()');
const exportEnd = source.indexOf("document.getElementById('codeWp').textContent = fullCode;");

assert(exportStart !== -1, 'Khong tim thay ham refreshExportPreview trong index.html');
assert(exportEnd !== -1, 'Khong tim thay diem ket thuc khoi export preview trong index.html');

const exportTemplate = source.slice(exportStart, exportEnd);

assert(
  source.includes('id="mapExportId"'),
  'Modal export can co o nhap Map ID de namespace tung map'
);

assert(
  exportTemplate.includes('data-bds-map-root="true"'),
  'Code export phai danh dau root map bang data-bds-map-root'
);

assert(
  exportTemplate.includes('data-bds-hotspot="true"'),
  'Code export phai danh dau hotspot bang data-bds-hotspot'
);

assert(
  exportTemplate.includes('wrapper.querySelectorAll('),
  'JavaScript export phai scope hotspot trong wrapper cua tung map'
);

assert(
  exportTemplate.includes('legend.querySelectorAll('),
  'JavaScript export phai scope legend trong legend container cua tung map'
);

assert(
  !exportTemplate.includes("window.bdsToggleLabels = function()"),
  'Khong duoc tao ham global dung chung cho nhieu map'
);

assert(
  !exportTemplate.includes("document.getElementById('bdsProjectMap')"),
  'Khong duoc hard-code wrapper id giong nhau cho moi map export'
);

assert(
  !exportTemplate.includes("document.querySelectorAll('.bds-hotspot')"),
  'Khong duoc query tat ca hotspot tren toan document trong code export'
);

console.log('Export namespacing regression checks passed.');
