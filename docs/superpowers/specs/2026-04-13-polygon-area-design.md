# Polygon Area Builder Design

**Date:** 2026-04-13

**Goal:** Them chuc nang ve polygon de minh hoa phan khu tren map, ho tro hien thi luon hoac chi hien khi hover/tap, co icon + tooltip, responsive, va duoc phat trien an toan trong mot file HTML moi.

## Context

Repo hien tai la mot builder static HTML, trong do:

- `index.html` la file builder chinh
- `docs/index.html` la ban publish
- app da co:
  - anh nen map
  - hotspot point voi icon + tooltip
  - route line SVG overlay
  - export/import HTML va JSON
  - responsive behavior cho hotspot va route

User muon them mot lop minh hoa **phan khu** bang polygon, khong thay the route line hien co. User yeu cau lam an toan bang cach tao **mot file HTML moi** de phat trien, thay vi sua truc tiep file builder dang dung.

## Product Direction

Da chot voi user:

- polygon duoc ve bang cac doan thang qua tung diem click
- khi ket thuc, he thong tu dong noi diem cuoi ve diem dau de dong hinh
- moi polygon co tuy chon rieng:
  - `always-visible`
  - `hover-only`
- polygon co the co icon
- hover desktop hoac tap mobile se hien tooltip
- mobile behavior:
  - tap vao polygon/icon de mo tooltip
  - tap lan nua hoac tap ra ngoai de dong
- can responsive theo anh nen map
- muc tieu chinh la minh hoa mot phan khu tren ban do

## Safe Delivery Strategy

De giam rui ro hoi quy:

- tao mot file moi, de xuat `polygon-builder.html`
- file moi se duoc copy tu builder hien tai lam nen tang
- tinh nang polygon duoc phat trien va test tren file moi
- chi khi user xac nhan on moi can nhac dong bo lai `index.html` va `docs/index.html`

Phien ban dau **khong bat buoc** thay doi luong xuat ban hien dang dung.

## Architecture

Them mot lop du lieu `polygons` song song voi `points` va `routes`.

Trang thai chinh trong builder moi:

- `points`
- `routes`
- `polygons`
- `selectedPoint`
- `selectedRoute`
- `selectedPolygon`
- `editorMode`

`editorMode` mo rong them:

- `point`
- `route-click`
- `route-freehand`
- `polygon`

`#mapContainer` tiep tuc la wrapper goc, gom:

- anh nen
- SVG overlay cho routes va polygons
- hotspot HTML layer

Polygon se duoc render trong SVG overlay, tach rieng thanh `polygon group` de:

- ve fill + stroke
- gan icon anchor
- dieu khien hover/active state
- de export/import metadata ro rang

## Polygon Data Model

Moi polygon duoc luu theo toa do phan tram tren anh nen:

```json
{
  "id": 101,
  "title": "Phan khu A",
  "displayMode": "always-visible",
  "fillColor": "#f59e0b",
  "fillOpacity": 0.22,
  "strokeColor": "#d97706",
  "strokeWidth": 1.2,
  "showIcon": true,
  "icon": "🏗️",
  "tooltipTitle": "Phan khu A",
  "tooltipBody": "Thong tin gioi thieu phan khu",
  "points": [
    { "x": 16.4, "y": 17.1 },
    { "x": 68.0, "y": 12.0 },
    { "x": 84.0, "y": 34.0 },
    { "x": 60.0, "y": 56.0 },
    { "x": 21.0, "y": 49.0 }
  ]
}
```

Quy uoc:

- can it nhat 3 diem moi duoc luu polygon
- `points` la du lieu nguon de render lai path
- path SVG khong can luu trong state
- icon anchor mac dinh tinh theo tam hinh hoc cua polygon
- `displayMode` quyet dinh style mac dinh va cach hien tooltip

## Builder UX

### 1. Toolbar

Them nut mode moi:

- `Polygon`
- `Kết thúc polygon`
- `Hủy polygon`

Quy tac:

- khi vao mode `Polygon`, moi click tren map them mot dinh moi
- builder hien preview polygon dang ve
- `Kết thúc polygon` se dong shape bang cach noi diem cuoi ve diem dau
- `Hủy polygon` xoa ban nhap dang ve
- neu polygon < 3 diem thi khong cho luu

### 2. Sidebar Editing

Them section editor cho polygon, song song voi point va route:

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

Danh sach polygon hien trong sidebar de de chon lai va chinh sua.

### 3. Visual States

#### `always-visible`

- polygon hien fill mac dinh
- opacity duoc chinh trong form
- hover/tap active se tang nhan manh viền/fill
- icon va tooltip co the hien theo active state

#### `hover-only`

- mac dinh polygon an hoac gan nhu an, chi de lai vien rat nhe
- hover desktop hoac tap mobile moi hien fill ro hon
- active state hien tooltip va icon neu bat

## Interaction Model

### Desktop

- hover vao polygon hoac icon:
  - active polygon
  - hien tooltip
  - nhan manh style polygon

### Mobile

- tap vao polygon hoac icon:
  - mo tooltip
  - dat polygon vao active state
- tap lai vao cung polygon hoac tap ra ngoai:
  - dong tooltip
  - bo active state

Can tai su dung pattern active/outside-click dang co trong hotspot export neu phu hop.

## Geometry And Rendering

Polygon duoc sinh tu danh sach diem theo thu tu click:

- preview path cap nhat ngay trong luc ve
- khi ket thuc, shape duoc dong tu dong
- render uu tien duoi dang SVG `path` hoac `polygon`

De giu pham vi gon:

- phien ban dau chi can editor theo `click-point`
- chua can freehand polygon
- chua can keo tung dinh sau khi da luu
- chua can dat lai icon anchor bang tay

Neu can, icon anchor duoc tinh bang centroid don gian. Truong hop centroid nam ngoai shape khong can toi uu o phien ban dau, chi can on dinh voi cac polygon minh hoa thong thuong.

## Export

Builder moi can ho tro:

- JSON export co them `polygons`
- HTML export co markup polygon va metadata de import lai

HTML export nen danh dau polygon bang metadata ro rang, vi du:

- `data-bds-polygon="true"`
- `data-polygon-payload="..."`

JSON export format de xuat:

```json
{
  "version": 3,
  "imageSrc": "...",
  "mapId": "...",
  "points": [],
  "routes": [],
  "polygons": []
}
```

## Import

Import can ho tro:

- JSON cu chi co point
- JSON moi co `points`, `routes`, `polygons`
- HTML export co polygon metadata

Backward compatibility:

- neu khong co `polygons`, builder van nhap du lieu binh thuong
- route va hotspot cu khong bi anh huong

## Responsive Requirements

Vi tat ca diem polygon duoc luu theo `%`, polygon se tu co gian theo kich thuoc anh.

Can dam bao:

- stroke width va icon size khong qua be tren mobile
- tooltip khong tran man hinh
- touch target de tap du lon
- polygon hover-only van co cach nhan biet va tap duoc tren mobile

## Error Handling

- khong cho luu polygon neu < 3 diem
- khi chuyen mode trong luc dang ve polygon, can confirm hoac tu dong huy an toan
- import payload sai dinh dang thi thong bao ro
- neu icon/tooltip de trong, polygon van render duoc

## Testing Strategy

Them regression tests theo kieu source-based hien co:

- co `let polygons = [];`
- co mode `polygon`
- co helper finish polygon va render polygon
- export JSON chua `polygons`
- export HTML co `data-bds-polygon="true"`
- import doc duoc `payload.polygons`
- co display mode `always-visible` va `hover-only`
- co tap/outside-close logic cho mobile state

Can uu tien test tren file moi truoc. Neu sau nay dong bo vao `index.html`, se rerun full suite cho ca file chinh.

## Constraints

- giu app la static HTML
- uu tien sua trong file moi `polygon-builder.html`
- khong refactor lon sang module o phien ban dau
- khong lam vo route builder va hotspot builder hien co

## Acceptance Criteria

- co the ve va luu it nhat mot polygon bang click-point
- polygon tu dong dong shape khi ket thuc
- moi polygon co the chon `always-visible` hoac `hover-only`
- polygon co the co icon va tooltip
- desktop hover hoat dong
- mobile tap de mo, tap lai hoac tap ngoai de dong
- polygon responsive theo anh nen
- export/import giu duoc polygon metadata
- toan bo duoc thuc hien tren mot file HTML moi de tranh anh huong builder hien tai
