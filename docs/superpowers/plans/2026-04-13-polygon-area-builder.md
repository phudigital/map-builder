# Polygon Area Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a safe polygon-area builder in a new HTML file that lets users draw subdivision areas, choose always-visible vs hover-only display, show icon + tooltip, and export/import polygon data without breaking the current builder.

**Architecture:** Start from the existing static builder as a separate file `polygon-builder.html` so the live builder remains untouched. Extend the current point/route state model with a polygon layer rendered in the existing SVG overlay, then add polygon-specific editing, mobile tap interactions, and export/import support for polygon metadata.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node assertion-based regression tests.

---

### File Structure

**Primary files:**

- Create: `polygon-builder.html`
  Responsibility: safe working copy of the current builder with polygon functionality
- Create: `tests/polygon-builder-scaffolding.test.js`
  Responsibility: lock the presence of new polygon state, mode, and rendering scaffolding
- Create: `tests/polygon-builder-export.test.js`
  Responsibility: lock polygon export/import hooks and metadata
- Create: `tests/polygon-builder-interactions.test.js`
  Responsibility: lock hover/tap/outside-close behavior and display mode support

**Reference files to read while implementing:**

- Read: `index.html`
  Responsibility: source of the current builder behavior to clone safely
- Read: `tests/route-lines-builder.test.js`
  Responsibility: model for source-based builder regression tests
- Read: `tests/route-lines-export.test.js`
  Responsibility: model for export/import regression assertions
- Read: `docs/superpowers/specs/2026-04-13-polygon-area-design.md`
  Responsibility: approved design contract

### Task 1: Create the safe builder copy and lock polygon scaffolding

**Files:**
- Create: `polygon-builder.html`
- Create: `tests/polygon-builder-scaffolding.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('polygon-builder.html', 'utf8');

assert(source.includes('let polygons = [];'), 'Can co state polygons rieng');
assert(source.includes("editorMode = 'point'"), 'Can giu editor mode mac dinh');
assert(source.includes("'polygon'") || source.includes('polygon'), 'Can co mode polygon');
assert(source.includes('selectedPolygon'), 'Can track polygon dang duoc chon');
assert(source.includes('id="mapRoutesSvg"'), 'Can tai su dung SVG overlay cho routes va polygons');

console.log('Polygon builder scaffolding regression checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/polygon-builder-scaffolding.test.js`
Expected: FAIL because `polygon-builder.html` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Copy `index.html` to `polygon-builder.html`
- Add polygon state variables:

```js
let polygons = [];
let selectedPolygon = null;
let currentPolygonDraft = [];
```

- Extend editor mode comments/logic to include polygon mode:

```js
let editorMode = 'point'; // point | route-click | route-freehand | polygon
```

- Keep the existing SVG overlay shell in the new file.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/polygon-builder-scaffolding.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add polygon-builder.html tests/polygon-builder-scaffolding.test.js
git commit -m "feat: scaffold polygon builder in safe html copy"
```

### Task 2: Add polygon draw mode and draft rendering

**Files:**
- Modify: `polygon-builder.html`
- Modify: `tests/polygon-builder-scaffolding.test.js`

- [ ] **Step 1: Write the failing test**

```js
assert(source.includes('function startPolygonMode()'), 'Can co ham bat dau mode polygon');
assert(source.includes('function finishCurrentPolygon()'), 'Can co ham chot polygon dang ve');
assert(source.includes('function cancelCurrentPolygon()'), 'Can co ham huy polygon dang ve');
assert(source.includes('function buildPolygonPath(points)'), 'Can co helper sinh path polygon');
assert(source.includes('currentPolygonDraft.length < 3'), 'Can chan luu polygon khi chua du 3 diem');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/polygon-builder-scaffolding.test.js`
Expected: FAIL because polygon mode functions do not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Add toolbar buttons in `polygon-builder.html`:
  - `Polygon`
  - `Kết thúc polygon`
  - `Hủy polygon`
- Implement:

```js
function startPolygonMode() {}
function finishCurrentPolygon() {}
function cancelCurrentPolygon() {}
function buildPolygonPath(points) {}
```

- Update map click handler so polygon mode appends percent-based points to `currentPolygonDraft`
- Render polygon draft preview into the existing SVG overlay
- Auto-close the shape when finishing the polygon

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/polygon-builder-scaffolding.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add polygon-builder.html tests/polygon-builder-scaffolding.test.js
git commit -m "feat: add polygon draw mode and draft preview"
```

### Task 3: Add polygon selection and sidebar editing

**Files:**
- Modify: `polygon-builder.html`
- Modify: `tests/polygon-builder-scaffolding.test.js`

- [ ] **Step 1: Write the failing test**

```js
assert(source.includes('id="polygonForm"'), 'Can co form chinh sua polygon');
assert(source.includes('function selectPolygon('), 'Can co ham chon polygon');
assert(source.includes('function savePolygon()'), 'Can co ham luu polygon');
assert(source.includes('displayMode'), 'Can luu display mode cho polygon');
assert(source.includes('fillOpacity'), 'Can chinh fill opacity');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/polygon-builder-scaffolding.test.js`
Expected: FAIL because polygon editor UI does not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Add polygon list section in the sidebar
- Add polygon editor fields:
  - title
  - icon
  - show/hide icon
  - tooltip title
  - tooltip body
  - fill color
  - fill opacity
  - stroke color
  - stroke width
  - display mode
- Implement:

```js
function selectPolygon(id) {}
function savePolygon() {}
```

- Re-render SVG polygon styles and icon state from the form values

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/polygon-builder-scaffolding.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add polygon-builder.html tests/polygon-builder-scaffolding.test.js
git commit -m "feat: add polygon sidebar editing"
```

### Task 4: Add polygon display modes, icon anchor, and tooltip interactions

**Files:**
- Modify: `polygon-builder.html`
- Create: `tests/polygon-builder-interactions.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('polygon-builder.html', 'utf8');

assert(source.includes('always-visible'), 'Can ho tro polygon luon hien');
assert(source.includes('hover-only'), 'Can ho tro polygon chi hien khi hover');
assert(source.includes('function getPolygonCentroid('), 'Can co helper tinh vi tri icon');
assert(source.includes('function togglePolygonActive('), 'Can co ham toggle active cho mobile tap');
assert(source.includes('function closePolygonTooltip('), 'Can co ham dong tooltip');
assert(source.includes('document.addEventListener(\'pointerdown\''), 'Can co logic tap ra ngoai de dong');

console.log('Polygon builder interaction regression checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/polygon-builder-interactions.test.js`
Expected: FAIL because the polygon interaction helpers do not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Add CSS/state for:
  - always-visible polygon fill
  - hover-only polygon fill
  - active polygon style
- Implement:

```js
function getPolygonCentroid(points) {}
function togglePolygonActive(id) {}
function closePolygonTooltip() {}
```

- Add polygon icon rendering in SVG/HTML overlay using centroid
- Desktop:
  - hover polygon or icon to show tooltip
- Mobile:
  - tap polygon or icon to toggle active tooltip
  - tap same polygon again or tap outside to close

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/polygon-builder-interactions.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add polygon-builder.html tests/polygon-builder-interactions.test.js
git commit -m "feat: add polygon display modes and tooltip interactions"
```

### Task 5: Extend export and import with polygon metadata

**Files:**
- Modify: `polygon-builder.html`
- Create: `tests/polygon-builder-export.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('polygon-builder.html', 'utf8');

assert(source.includes('polygons: polygons'), 'JSON export can chua du lieu polygons');
assert(source.includes('data-bds-polygon="true"'), 'HTML export can danh dau polygon');
assert(source.includes('data-polygon-payload='), 'HTML export can luu payload polygon');
assert(source.includes('payload.polygons') || source.includes('parsed.polygons'), 'Import JSON moi can doc duoc polygons');
assert(source.includes('[data-bds-polygon="true"]'), 'Import HTML can tim polygon bang data attr');

console.log('Polygon builder export regression checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/polygon-builder-export.test.js`
Expected: FAIL because export/import does not know about polygons yet.

- [ ] **Step 3: Write minimal implementation**

- Update export preview logic to allow export when:

```js
if (points.length === 0 && routes.length === 0 && polygons.length === 0) return false;
```

- Extend export JSON payload:

```js
{
  version: 3,
  imageSrc,
  mapId,
  points,
  routes,
  polygons
}
```

- Add helpers to render polygon export markup and CSS metadata
- Add polygon import for:
  - JSON payloads with `polygons`
  - HTML payloads carrying `data-bds-polygon="true"` and `data-polygon-payload`

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/polygon-builder-export.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add polygon-builder.html tests/polygon-builder-export.test.js
git commit -m "feat: add polygon export and import"
```

### Task 6: Regression verification for the safe builder file

**Files:**
- Modify: `polygon-builder.html`
- Test: `tests/polygon-builder-scaffolding.test.js`
- Test: `tests/polygon-builder-interactions.test.js`
- Test: `tests/polygon-builder-export.test.js`

- [ ] **Step 1: Run the polygon regression suite**

Run:

```bash
node tests/polygon-builder-scaffolding.test.js
node tests/polygon-builder-interactions.test.js
node tests/polygon-builder-export.test.js
```

Expected: All PASS.

- [ ] **Step 2: Smoke-check the safe builder manually**

Open `polygon-builder.html` in the browser and verify:

1. Draw a polygon with 3+ clicks
2. Switch between `always-visible` and `hover-only`
3. Hover on desktop to show tooltip
4. Tap on mobile emulation to open, tap again/outside to close
5. Export JSON/HTML and re-import successfully

Expected: All behaviors match the approved spec.

- [ ] **Step 3: Document any intentional gaps**

Record in the final handoff if any of these remain out of scope:

- no freehand polygon drawing
- no per-vertex editing after save
- no manual icon anchor dragging

- [ ] **Step 4: Commit**

```bash
git add polygon-builder.html tests/polygon-builder-scaffolding.test.js tests/polygon-builder-interactions.test.js tests/polygon-builder-export.test.js
git commit -m "feat: ship safe polygon area builder"
```
