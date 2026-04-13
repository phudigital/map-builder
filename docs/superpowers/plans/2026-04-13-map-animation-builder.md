# Map Animation Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone HTML map animation builder that places an image background under animated route lines, blinking icons, overlay images, and info boxes, then imports/exports scene JSON and exports a single self-contained HTML file.

**Architecture:** Create a new builder file, `map-animation-builder.html`, so the existing `index.html` remains untouched. Reuse the current repo's static-builder patterns for stage rendering and export, but switch to a scene-plus-layers model with one SVG route layer and one DOM overlay layer to support route drawing plus positioned overlays.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node assertion-based regression tests.

---

### File Structure

**Primary files:**

- Create: `map-animation-builder.html`
  Responsibility: standalone builder UI, stage renderer, scene state, import/export logic
- Create: `tests/map-animation-builder-scaffolding.test.js`
  Responsibility: lock builder scaffolding, scene state, toolbar actions, and stage layers
- Create: `tests/map-animation-builder-route-draw.test.js`
  Responsibility: lock route-drawing mode, draft route behavior, and route data helpers
- Create: `tests/map-animation-builder-layers.test.js`
  Responsibility: lock icon/image/box layer creation, selection, and property editing scaffolding
- Create: `tests/map-animation-builder-export.test.js`
  Responsibility: lock JSON scene export/import and self-contained HTML export hooks

**Reference files to read while implementing:**

- Read: `index.html`
  Responsibility: source of stable editor layout, SVG route rendering, and export patterns worth reusing
- Read: `tests/route-lines-builder.test.js`
  Responsibility: model for source-string regression tests against the HTML builder
- Read: `tests/route-lines-export.test.js`
  Responsibility: model for export/import regression assertions
- Read: `docs/superpowers/specs/2026-04-13-map-animation-builder-design.md`
  Responsibility: approved product contract for the builder

### Task 1: Scaffold the standalone builder shell

**Files:**
- Create: `map-animation-builder.html`
- Create: `tests/map-animation-builder-scaffolding.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('map-animation-builder.html', 'utf8');

assert(source.includes('let scene = {'), 'Can co scene state trung tam');
assert(source.includes('layers: []'), 'Can co mang layers trong scene');
assert(source.includes('id="animationStage"'), 'Can co preview stage rieng');
assert(source.includes('id="routeSvgLayer"'), 'Can co SVG layer cho route');
assert(source.includes('id="overlayLayer"'), 'Can co HTML overlay layer');
assert(source.includes('Export HTML'), 'Can co nut export HTML');

console.log('Map animation builder scaffolding regression checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/map-animation-builder-scaffolding.test.js`
Expected: FAIL because `map-animation-builder.html` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Create `map-animation-builder.html`
- Build the editor shell:
  - top toolbar
  - center preview stage
  - right sidebar
- Add initial scene state:

```js
let scene = {
  version: 1,
  name: 'Untitled scene',
  background: null,
  stage: { width: 1600, height: 900 },
  layers: []
};
```

- Add root rendering placeholders for:
  - background image
  - route SVG layer
  - overlay layer

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/map-animation-builder-scaffolding.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-scaffolding.test.js
git commit -m "feat: scaffold map animation builder shell"
```

### Task 2: Add background scene setup and route drawing mode

**Files:**
- Modify: `map-animation-builder.html`
- Create: `tests/map-animation-builder-route-draw.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('map-animation-builder.html', 'utf8');

assert(source.includes("let editorMode = 'select'"), 'Can co editor mode mac dinh');
assert(source.includes('route-draw'), 'Can co mode route draw');
assert(source.includes('let currentRouteDraft = []'), 'Can co state route draft');
assert(source.includes('function startRouteDrawMode()'), 'Can co ham vao mode ve route');
assert(source.includes('function finishRouteDraft()'), 'Can co ham chot route');
assert(source.includes('function cancelRouteDraft()'), 'Can co ham huy route');
assert(source.includes('function getStagePercentPoint('), 'Can co helper doi click sang toa do %');
assert(source.includes('currentRouteDraft.length < 2'), 'Can chan luu route duoi 2 diem');

console.log('Map animation route draw regression checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/map-animation-builder-route-draw.test.js`
Expected: FAIL because route draw mode does not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Add background upload/import control
- Render background image inside the stage
- Add route toolbar controls:
  - `Them Route`
  - `Undo Point`
  - `Ket thuc Route`
  - `Huy Route`
- Implement:

```js
let editorMode = 'select';
let selectedLayerId = null;
let currentRouteDraft = [];

function startRouteDrawMode() {}
function finishRouteDraft() {}
function cancelRouteDraft() {}
function undoRoutePoint() {}
function getStagePercentPoint(event) {}
```

- Update stage click handling so route mode appends `%`-based points
- Render the route draft preview in the SVG layer

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/map-animation-builder-route-draw.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-route-draw.test.js
git commit -m "feat: add route draw mode to map animation builder"
```

### Task 3: Add route layer editing and animated SVG rendering

**Files:**
- Modify: `map-animation-builder.html`
- Modify: `tests/map-animation-builder-route-draw.test.js`

- [ ] **Step 1: Write the failing test**

```js
assert(source.includes("type: 'route'"), 'Can luu layer route vao scene');
assert(source.includes('function renderRouteLayer('), 'Can co renderer route');
assert(source.includes('stroke-dasharray'), 'Can co style dash cho route animation');
assert(source.includes('stroke-dashoffset'), 'Can co flow animation cho route');
assert(source.includes('function updateRouteForm('), 'Can co form edit route');
assert(source.includes('flowSpeed'), 'Can cho chinh toc do route');
assert(source.includes('glowWidth'), 'Can cho chinh do glow route');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/map-animation-builder-route-draw.test.js`
Expected: FAIL because route editing and animation styles do not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Save finished route drafts into `scene.layers`
- Add route property form with:
  - name
  - color
  - width
  - glow width
  - dash length
  - dash gap
  - flow speed
  - opacity
  - animation preset
- Implement:

```js
function renderRouteLayer(layer) {}
function updateRouteForm(layer) {}
function saveRouteLayerForm() {}
```

- Add CSS keyframes for route flow
- Render each route as an SVG group with:
  - glow path
  - base path
  - flowing dash path

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/map-animation-builder-route-draw.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-route-draw.test.js
git commit -m "feat: add animated route editing"
```

### Task 4: Add icon, image, and box overlay layers

**Files:**
- Modify: `map-animation-builder.html`
- Create: `tests/map-animation-builder-layers.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('map-animation-builder.html', 'utf8');

assert(source.includes("type: 'icon'"), 'Can co layer icon');
assert(source.includes("type: 'image'"), 'Can co layer image');
assert(source.includes("type: 'box'"), 'Can co layer box');
assert(source.includes('function createIconLayerAt('), 'Can co factory cho icon');
assert(source.includes('function createImageLayerAt('), 'Can co factory cho image');
assert(source.includes('function createBoxLayerAt('), 'Can co factory cho box');
assert(source.includes('function renderOverlayLayer('), 'Can co renderer cho overlay');
assert(source.includes('heartbeat') || source.includes('pulse'), 'Can co preset animation cho icon');

console.log('Map animation layer regression checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/map-animation-builder-layers.test.js`
Expected: FAIL because overlay layer factories and renderers do not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Add toolbar controls:
  - `Them Icon`
  - `Them Image`
  - `Them Box`
- Implement one-click placement flow on the stage for each type
- Implement:

```js
function createIconLayerAt(point) {}
function createImageLayerAt(point) {}
function createBoxLayerAt(point) {}
function renderOverlayLayer(layer) {}
```

- Add property forms for each type:
  - icon: icon text, size, background, color, effect, label, opacity
  - image: src, width, height, fit, radius, shadow, rotation, opacity
  - box: title, body, width, colors, padding, radius, shadow, opacity
- Render overlay items as absolute-position DOM elements over the stage

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/map-animation-builder-layers.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-layers.test.js
git commit -m "feat: add animated overlay layers"
```

### Task 5: Add layer selection, ordering, visibility, and lock controls

**Files:**
- Modify: `map-animation-builder.html`
- Modify: `tests/map-animation-builder-layers.test.js`

- [ ] **Step 1: Write the failing test**

```js
assert(source.includes('id="layersList"'), 'Can co danh sach layers');
assert(source.includes('function selectLayer('), 'Can co ham chon layer');
assert(source.includes('function moveLayerUp('), 'Can co ham dua layer len tren');
assert(source.includes('function moveLayerDown('), 'Can co ham dua layer xuong duoi');
assert(source.includes('function toggleLayerVisibility('), 'Can co toggle an hien');
assert(source.includes('function toggleLayerLock('), 'Can co toggle khoa layer');
assert(source.includes('function deleteSelectedLayer('), 'Can co xoa layer dang chon');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/map-animation-builder-layers.test.js`
Expected: FAIL because layer management controls do not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Add sidebar list for all layers
- Show type badge, visibility state, and lock state
- Implement:

```js
function selectLayer(id) {}
function moveLayerUp(id) {}
function moveLayerDown(id) {}
function toggleLayerVisibility(id) {}
function toggleLayerLock(id) {}
function deleteSelectedLayer() {}
```

- Keep stage selection and sidebar selection in sync
- Re-render layer order based on `scene.layers`

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/map-animation-builder-layers.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-layers.test.js
git commit -m "feat: add layer management controls"
```

### Task 6: Add JSON import/export and self-contained HTML export

**Files:**
- Modify: `map-animation-builder.html`
- Create: `tests/map-animation-builder-export.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('map-animation-builder.html', 'utf8');

assert(source.includes('function exportSceneJson()'), 'Can co ham export JSON');
assert(source.includes('function importSceneJson('), 'Can co ham import JSON');
assert(source.includes('function exportStandaloneHtml()'), 'Can co ham export HTML self-contained');
assert(source.includes('JSON.stringify(scene'), 'Can stringify scene khi export');
assert(source.includes('<!DOCTYPE html>'), 'Can tao output HTML hoan chinh');
assert(source.includes('data:image/') || source.includes('FileReader'), 'Can ho tro embed asset base64');

console.log('Map animation export regression checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/map-animation-builder-export.test.js`
Expected: FAIL because export/import functions do not exist yet.

- [ ] **Step 3: Write minimal implementation**

- Add import/export controls in the toolbar or modal
- Implement:

```js
function exportSceneJson() {}
function importSceneJson(payload) {}
function exportStandaloneHtml() {}
function downloadTextFile(filename, content) {}
```

- Export JSON with scene version and all layers
- Import JSON with safe defaults for missing fields
- Export one complete HTML document that:
  - embeds CSS
  - embeds scene JSON
  - renders background, routes, and overlay layers on load

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/map-animation-builder-export.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-export.test.js
git commit -m "feat: add scene import and standalone export"
```

### Task 7: Verify responsive behavior and polish builder defaults

**Files:**
- Modify: `map-animation-builder.html`
- Modify: `tests/map-animation-builder-scaffolding.test.js`
- Modify: `tests/map-animation-builder-layers.test.js`
- Modify: `tests/map-animation-builder-export.test.js`

- [ ] **Step 1: Write the failing test**

```js
assert(source.includes('@media (max-width: 1200px)'), 'Can co responsive layout cho builder');
assert(source.includes('preserveAspectRatio'), 'Can giu ti le stage va SVG');
assert(source.includes('pointer-events'), 'Can kiem soat tuong tac giua SVG va overlay');
assert(source.includes('function normalizeScene('), 'Can co helper gan default scene khi import');
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node tests/map-animation-builder-scaffolding.test.js
node tests/map-animation-builder-layers.test.js
node tests/map-animation-builder-export.test.js
```

Expected: At least one FAIL because responsive and normalization polish is not complete yet.

- [ ] **Step 3: Write minimal implementation**

- Add responsive CSS so preview + sidebar remain usable on narrower screens
- Add scene normalization helper for imported payloads
- Ensure exported renderer uses the same aspect-ratio assumptions as the editor
- Add empty-state and validation messages for:
  - no background
  - no selected layer
  - invalid import payload

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node tests/map-animation-builder-scaffolding.test.js
node tests/map-animation-builder-route-draw.test.js
node tests/map-animation-builder-layers.test.js
node tests/map-animation-builder-export.test.js
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-scaffolding.test.js tests/map-animation-builder-route-draw.test.js tests/map-animation-builder-layers.test.js tests/map-animation-builder-export.test.js
git commit -m "feat: polish map animation builder"
```

### Task 8: Final verification

**Files:**
- Verify only: `map-animation-builder.html`
- Verify only: `tests/map-animation-builder-scaffolding.test.js`
- Verify only: `tests/map-animation-builder-route-draw.test.js`
- Verify only: `tests/map-animation-builder-layers.test.js`
- Verify only: `tests/map-animation-builder-export.test.js`

- [ ] **Step 1: Run the full builder regression suite**

Run:

```bash
node tests/map-animation-builder-scaffolding.test.js
node tests/map-animation-builder-route-draw.test.js
node tests/map-animation-builder-layers.test.js
node tests/map-animation-builder-export.test.js
```

Expected: PASS for all four scripts.

- [ ] **Step 2: Manual browser verification**

Open `map-animation-builder.html` in a browser and verify:

- background loads correctly
- route drawing adds points where clicked
- finishing a route creates an animated line
- icon/image/box placement appears at clicked positions
- layer list actions update the stage
- JSON round-trip restores the same scene
- exported HTML opens independently and looks correct

Expected: All flows work without touching `index.html`.

- [ ] **Step 3: Final commit**

```bash
git add map-animation-builder.html tests/map-animation-builder-scaffolding.test.js tests/map-animation-builder-route-draw.test.js tests/map-animation-builder-layers.test.js tests/map-animation-builder-export.test.js
git commit -m "feat: add standalone map animation builder"
```
