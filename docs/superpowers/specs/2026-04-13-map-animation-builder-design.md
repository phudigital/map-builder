# Map Animation Builder Design

**Date:** 2026-04-13

**Goal:** Tao mot file HTML builder moi de dat anh nen map va chen cac lop animation len tren, bao gom route line chuyen dong, blink icon, image overlay, va info box, voi panel nhap lieu tuong tu `index.html`, co import/export JSON va export ra mot file HTML self-contained duy nhat.

## Context

Repo hien tai da co mot builder lon trong `index.html`, trong do:

- map duoc render tren mot stage co anh nen
- route line duoc ve bang SVG overlay
- hotspot duoc render bang HTML overlay
- import/export da ton tai cho JSON va HTML
- UI editor dang theo mo hinh preview o giua + panel dieu khien ben phai

User muon mot cong cu rieng, khong chen vao builder hien co, de xu ly mot use case khac:

- anh nen la hinh map tinh
- click nhieu diem tren anh de ve tuyen duong
- chen icon nhap nhay de danh dau vi tri
- chen hinh anh va box thong tin len tren map
- sau cung export thanh mot file HTML tu chay duoc de gui di

## Product Direction

Da chot voi user:

- tao **mot file HTML rieng**
- UI theo huong **panel nhap lieu giong `index.html`**
- route duoc tao bang **click nhieu diem truc tiep len anh**
- builder can ho tro:
  - `Route`
  - `Blink Icon`
  - `Image Overlay`
  - `Info Box`
- can co:
  - import/export `JSON`
  - export `HTML self-contained` duy nhat

Phien ban dau tap trung vao builder va renderer, khong mo rong sang timeline editor phuc tap hay video export.

## Delivery Strategy

De tranh anh huong toi builder dang dung:

- tao file moi, de xuat ten `map-animation-builder.html`
- tai su dung cac pattern tot tu `index.html`
- khong sua `index.html` o pham vi MVP nay
- neu builder moi on dinh, ve sau co the can nhac chia se utility/export logic

## Architecture

Builder moi se theo cau truc 3 tang tren stage:

1. `Background layer`
   - hien thi anh nen map
2. `SVG route layer`
   - chiu trach nhiem route line, glow, flow animation
3. `HTML overlay layer`
   - chua blink icon, image overlay, info box

Layout tong the:

- preview stage o cot chinh
- sidebar ben phai gom:
  - config scene
  - layers list
  - editor form cho object dang chon
- toolbar tren cung cho:
  - upload/chon anh nen
  - them route/icon/image/box
  - import JSON
  - export JSON
  - export HTML

## Scene Data Model

Scene duoc luu thanh mot object trung tam:

```json
{
  "version": 1,
  "name": "Long Thanh route scene",
  "background": {
    "src": "data:image/jpeg;base64,...",
    "width": 1600,
    "height": 900
  },
  "stage": {
    "width": 1600,
    "height": 900
  },
  "layers": [
    {
      "id": "route-1",
      "type": "route",
      "name": "Tuyen cao toc",
      "visible": true,
      "locked": false,
      "points": [
        { "x": 15.2, "y": 24.4 },
        { "x": 22.8, "y": 27.9 },
        { "x": 34.1, "y": 31.6 }
      ],
      "style": {
        "color": "#1d4ed8",
        "width": 1.1,
        "glowWidth": 3.2,
        "dashLength": 3,
        "dashGap": 2.2,
        "flowSpeed": 2.4,
        "animation": "brand-flow"
      }
    },
    {
      "id": "icon-1",
      "type": "icon",
      "name": "San bay",
      "visible": true,
      "locked": false,
      "x": 72.5,
      "y": 26.4,
      "style": {
        "icon": "✈️",
        "size": 42,
        "background": "#2563eb",
        "color": "#ffffff",
        "effect": "heartbeat"
      }
    }
  ]
}
```

Quy uoc:

- toa do deu luu theo `%` de responsive theo anh nen
- thu tu `layers` la thu tu z-index
- moi layer co `visible` va `locked`
- object style duoc tach rieng de de import/export

## Supported Layer Types

### 1. Route

Dung cho cac tuyen duong minh hoa.

Thuoc tinh MVP:

- `name`
- `points`
- `color`
- `width`
- `glowWidth`
- `dashLength`
- `dashGap`
- `flowSpeed`
- `animation`
- `opacity`

Animation route se dung `SVG path` ket hop:

- `stroke-dasharray`
- `stroke-dashoffset`
- glow path phia sau

Phien ban dau chi can `polyline/path` tu danh sach diem click, khong can Bezier editor.

### 2. Blink Icon

Dung cho icon danh dau vi tri.

Thuoc tinh MVP:

- `name`
- `x`, `y`
- `icon`
- `size`
- `background`
- `color`
- `effect`
- `label`
- `opacity`

Preset animation de xuat:

- `pulse`
- `heartbeat`
- `blink`
- `bounce`
- `rotate`

### 3. Image Overlay

Dung cho logo, thumbnail, minh hoa, marker bitmap.

Thuoc tinh MVP:

- `name`
- `x`, `y`
- `width`
- `height`
- `src`
- `fit`
- `rotation`
- `opacity`
- `borderRadius`
- `shadow`

Phien ban dau uu tien resize bang form; drag truc tiep la nice-to-have.

### 4. Info Box

Dung cho box callout thong tin.

Thuoc tinh MVP:

- `name`
- `x`, `y`
- `width`
- `title`
- `body`
- `background`
- `borderColor`
- `textColor`
- `padding`
- `radius`
- `shadow`
- `opacity`

Info box la DOM element absolute-position de de style va export.

## Builder UX

## 1. Scene Setup

User co the:

- upload anh nen tu may
- dat ten scene
- reset scene

Ngay khi co anh nen, stage duoc render theo ti le anh.

## 2. Add Layer Flow

### Route

- bam `Them Route`
- builder vao che do `route-draw`
- moi click tren map them mot diem
- line preview cap nhat ngay
- nut `Ket thuc route` luu layer
- nut `Huy route` bo ban nhap

Dieu kien:

- route phai co it nhat 2 diem moi duoc luu

Phien ban MVP nen ho tro:

- hien marker nho tai moi diem khi route dang duoc chon
- xoa diem cuoi cung bang nut `Undo point`

### Icon / Image / Box

- bam `Them Icon`, `Them Image`, hoac `Them Box`
- click mot diem tren map de dat vi tri ban dau
- object moi duoc them vao `layers`
- sidebar mo ngay form chinh sua cho object vua tao

## 3. Layers Panel

Panel layer can co:

- danh sach tat ca layer
- click de chon
- doi ten nhanh
- toggle an/hien
- toggle khoa
- dua len/xuong de doi thu tu
- xoa layer

Route, icon, image, va box can co nhan type ro rang de user nhin nhanh.

## 4. Property Panel

Khi chon mot layer, panel hien dung form theo type.

Pattern nen giong `index.html`:

- input text
- textarea
- select
- color input
- range / number input
- preview nho neu can

## Interaction Model

### Stage

- click vao layer de chon
- click ra ngoai de bo chon neu khong o che do draw
- object dang chon duoc vien highlight

### Route Editing

Trong MVP:

- route duoc tao bang click-point
- sau khi tao xong, cho phep chinh lai toa do diem trong panel duoi dang danh sach
- co nut `Xoa diem`
- co the bo sung drag point truc tiep neu chi phi thap, nhung khong bat buoc cho scope dau tien

### Overlay Editing

Cho `icon`, `image`, `box`:

- dat vi tri ban dau bang click tren map
- sau do chinh toa do `x`, `y` trong form
- neu implementation on dinh, co the bo sung drag de tang toc do thao tac

## Rendering Rules

Stage preview can on dinh giua editor va export:

- background dung cung mot source
- route layer render bang SVG theo he toa do 0..100
- overlay layer render bang DOM absolute theo `%`
- scale theo width cua container nhung giu dung aspect ratio

Khi export HTML:

- CSS animation va renderer logic duoc nhung truc tiep trong file
- scene JSON duoc nhung vao mot script tag
- app export chi can load file HTML la chay, khong phu thuoc asset ben ngoai neu background/image da duoc doi thanh data URL

## Import / Export

### JSON Import/Export

Builder can:

- `Export JSON` scene hien tai
- `Import JSON` scene da luu

Backward compatibility cho MVP:

- neu field nao thieu, gan default an toan
- version scene duoc luu de de nang cap sau nay

### HTML Export

Output la:

- `1 file HTML self-contained`
- nhung CSS/JS/scene data vao cung file
- scene tu render khi mo bang browser thong thuong

Asset strategy:

- background image: uu tien embed `data URL`
- image overlay: uu tien embed `data URL` neu upload tu local
- neu user nhap URL online, co the giu nguyen URL trong export va canh bao la file export phu thuoc mang

## Error Handling

- khong cho export HTML neu chua co background
- khong cho luu route neu < 2 diem
- import JSON loi thi thong bao ro field nao khong hop le
- neu image load that bai thi hien placeholder
- neu scene qua lon do embed nhieu asset base64, can thong bao file export se nang

## Testing Strategy

Can verify toi thieu:

1. Scene moi tao render duoc voi background.
2. Route draw bang click-point luu dung toa do `%`.
3. Chon layer trong list va tren stage dong bo.
4. Icon/image/box them vao dung vi tri click.
5. Export JSON roi import lai khong mat du lieu.
6. Export HTML mo doc lap van render dung route + overlay.
7. Resize viewport khong lam vo layout.

## Non-Goals For MVP

Nhung muc nay co the de sau:

- timeline keyframe editor
- video/GIF export
- freehand brush route
- Bezier curve route
- crop/chinh sua image trong tool
- multi-scene project manager

## Recommendation

Huong nen trien khai la clone cac pattern da on dinh trong `index.html`, nhung tach builder moi theo `scene + layers` thay vi tron chung vao model hotspot cu. Nhu vay se dat duoc:

- UX quen thuoc voi user
- scope vua du cho MVP
- duong dan nang cap ro rang cho drag handles, richer animation, va template export ve sau
