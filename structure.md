# TÀI LIỆU CẤU TRÚC VÀ CÁCH SỬ DỤNG - BDS INTERACTIVE MAP GENERATOR V2.0

File `index.html` là một ứng dụng Single Page Application (SPA) dạng tĩnh (không cần build-tool) chạy trực tiếp trên trình duyệt, có chức năng làm một "Visual Builder" (Trình kiến tạo trực quan) cho Bản đồ Bất động sản tương tác.

Dưới đây là mô tả chi tiết về cấu trúc mã nguồn, các luồng xử lý chức năng, và hướng dẫn sử dụng.

---

## 1. CẤU TRÚC LƯU TRỮ VÀ GIAO DIỆN CHÍNH (HTML / DOM)

Giao diện (layout) được tổ chức theo kiến trúc `Grid` 2 cột (1 cột làm bản đồ làm việc, 1 cột làm sidebar cài đặt), với phần `Header` cố định trên cùng. Cấu trúc thẻ HTML chính (`<body>`) gồm:

*   **`.app-container`**: Vùng chứa toàn bộ ứng dụng.
    *   **`<header class="header">`**: Chứa tên ứng dụng, phiên bản và các công cụ "Quick Access" (Tùy chọn export: Tắt/bật Legend tĩnh, Nén HTML, Map ID...). Nơi chứa nút **Xóa tất cả**, **Nhập Code**, và **Xuất Code**.
    *   **`<main class="main-content">`**: Vùng làm việc chính.
        *   **`.url-section` (Khu vực hình nền)**: Công cụ tải cảnh nền map từ link URL hoặc upload file Local.
        *   **`#mapWrapper` (Trình canvas tương tác)**: Thanh công cụ Toolbar (chọn Mode vẽ: Điểm, Line, Polygon).
        *   **`.bds-map-preview`**: Background Map chứa 1 ảnh `<img id="mapImage">` lót dưới và 1 thẻ `<svg id="mapRoutesSvg">` đè lên để vẽ các cấu trúc Vector (Lines và Polygons), cùng các mảng HTML `div.bds-hotspot` (Points) sinh ra tự động nhờ Javascript.
    *   **`<aside class="sidebar">`**: Trình quản trị thuộc tính (Inspector).
        *   Các Form cài đặt: `#pointForm`, `#routeForm`, `#polygonForm` – Sẽ hiển thị linh hoạt tùy theo việc người dùng click vào đối tượng nào trên map. Cấu hình Màu sắc, Kích thước, Icon, Animations (Lan tỏa, nhịp tim, rung...), Diện tích, Giá tiền...
        *   Các List đối tượng: Danh sách Điểm, Tuyến đường, Polygon đã vẽ nằm ở cuối sidebar, hỗ trợ click chọn nhanh, hoặc drag & drop sắp xếp lại layer mảng.
    *   **Modals (`#importModal`, `#exportModal`)**: Layer bật lên để tương tác Copy Export Code và Dán Code cũ để chỉnh sửa tiếp tục.

---

## 2. CHỨC NĂNG CSS VÀ STYLING MẶC ĐỊNH

Ứng dụng gom toàn bộ CSS vào trong các thẻ `<style>`. CSS có sự rạch ròi, tổ chức theo:
*   **CSS Variables (Root)**: Cài màu primary, danger, success, nền tối/sáng... cho chính phần mềm Builder.
*   **Utility & UI Components**: Các component giao diện như `btn`, `form-input`, `sidebar`, `workspace`.
*   **Cấu trúc Đối Tượng Xuất (Hotspot / Route / Polygon)**: Đây là một phần CSS cốt lõi định nghĩa cho cả bên trong Webbuilder và đoạn code sẽ xuất ra HTML cuối cùng. File chứa sẵn các lớp như `.bds-hotspot`, `.bds-route-core`, các keyframes animation cực kỳ chi tiết (`gentle-pulse`, `heartbeat`, `route-dash-flow` chạy line nét đứt...).
*   **Responsive**: Dù là app web nhưng vẫn có CSS media query cơ bản hiển thị responsive dạng mobile (điều hướng thuộc tính icon size cho màn lớn và bé).

---

## 3. CẤU TRÚC CHỨC NĂNG XỬ LÝ (JAVASCRIPT)

Script của file có hơn 4000 dòng ở cuối tài liệu xử lý vòng đời hoạt động của ứng dụng, được chia thành các nhóm chính sau:

### A. Quản lý trạng thái (State Management)
File lưu trữ toàn bộ dữ liệu đối tượng trên map vào các biến mảng Global:
*   `points = []`: Danh sách các điểm nhấn (hotspot) và thông tin cấu hình của nó.
*   `routes = []`: Danh sách các đoạn đường (mỗi route có danh sách tọa độ `points` tính bằng %).
*   `polygons = []`: Danh sách vùng đa giác.
*   Biến lưu trạng thái như `currentMode` (point, routeline, polygon), ID đối tượng đang được Edit hiện tại (`selectedPointIndex`, `selectedRouteId`,...).

### B. Logic Render & Events
*   **Click / Tương tác tạo đối tượng**: Tính toán vị trí chuột so le tỷ lệ width/height của background map (`normalizePointToPercent`) để lấy tọa độ mang dạng % -> điều này giúp Map responsive khi view trên màn hình khách ngoài thực tế. Tùy thuộc vào `currentMode` mà sinh ra point, nối điểm cho vector line, hoặc trổ điểm cho polygon.
*   **`renderPoints()`, `renderRoutes()`**:Hàm cập nhật lại DOM SVG, Div hotspot liên tục mỗi khi có sự thay đổi state, di chuyển (drag map icon). Xây dựng path SVG mềm mại (`buildSmoothPath`) hoặc đường khép kín (`buildPolygonPath`).
*   **Inspector (2-way Binding Simulation)**: Người dùng điều chỉnh số/chữ bên Sidebar. Biến kích hoạt `savePolygon`, `savePoint`, `saveRoute` sẽ được gọi khi có Event thay đổi -> Cập nhật State -> Kích hoạt Render lại Map Preview.

### C. Import & Export Logic
Đây là lõi tạo ra sức mạnh cho hệ thống Visual Builder (Sản sinh code tái sử dụng):
*   **Cơ chế Export**: Hàm `generateExportCode` đọc 3 mảng `points`, `routes`, `polygons` + link Image. Gắn chúng lại vào 1 khung Template HTML chuẩn + đoạn `<style>` sinh tự động dựa trên các màu sắc custom mà người dùng đã pick (Tạo riêng custom variable dạng biến inline cho mỗi icon) kèm hiệu ứng. Cung cấp cả HTML trực tiếp và JSON data riêng.
*   **Cơ chế Import**: Phân tích ngược mã HTML / JS / JSON cũ (`processImportCode`), khôi phục mảng `state` và setup biến -> Render trải ngược lên màn hình Builder cho phép người phát triển tiếp công việc.

---

## 4. HƯỚNG DẪN CÁCH SỬ DỤNG

File `index.html` là một ứng dụng độc lập, do đó bạn dùng rất dễ dàng theo quy trình:

**Bước 1: Chạy chương trình**
Kéo thả trực tiếp file `index.html` này vào trình duyệt web (Chrome, Safari, Edge...) hoặc chạy Live Server trong VSCode.

**Bước 2: Chuẩn bị Background Map**
Tại vùng `URL hình ảnh nền`, nhập link ảnh sa bàn dự án của bạn và bấm `Tải`, hoặc click Input File để tải ảnh lưu từ máy mình lên.

**Bước 3: Dựng các đối tượng Tương Tác**
*   **Tạo Điểm (Hotspot)**: Bấm "📍 Điểm", sau đó click một điểm cụ thể trên ảnh nền map -> Một icon được sinh ra. Click vào biểu tượng trên map, Sidebar bên phải sẽ tự thay đổi thành Form. Tại đây bạn điền Title, Icon (VD: 🏠, 🏬), màu sắc, thêm mô tả diện tích, v.v..
*   **Tạo Tuyến đường**: Bấm lựa chọn "〰️ Line theo điểm" (sẽ nhấp tọa độ nối theo line đa giác/gấp khúc) hoặc bấm vẽ tay. Cài đặt animation flow chạy dọc theo viền. Vẽ xong nhấn phím Esc (hoặc bấm "✅ Kết thúc line" trên toolbar) để đóng cấu trúc nét vẽ.
*   **Tạo Vùng Polygon**: Bấm "⬠ Polygon", chấm theo biên dự đoán của một Phân khu -> Kết thúc vẽ. Cài màu Fill (nhận % độ trong suốt), stroke line để tô sáng vùng.
*   **Chỉnh sửa & Sắp xếp thứ tự**: Có thể kéo thả các vị trí Item tại thẻ List dưới cùng bên phải để ưu tiên Layer nổi lên trên cùng (Thứ tự Z-index ảnh hưởng bởi thẻ DOM mảng dưới sẽ đè trên). Hoặc kéo trực tiếp icon/node trên bản đồ sang vị trí chuẩn hơn.

**Bước 4: Xuất Code (Export)**
Sau khi hài lòng với layout đã tạo:
1. Tại góc trên thanh Header, nhập `Map ID` cho dự án của bạn.
2. Bấm nút màu xanh lá **"📤 Xuất code"**.
3. Tại Modal hiển thị, bấm **"📋 Copy code"**.
4. Vào hệ thống quản trị WordPress hoặc website CMS của bạn, tạo nội dung mới, mở khung nhập "Custom HTML" và Dán vào.
5. Code xuất ra đã đầy đủ Responsive, Hover hiệu ứng chuẩn 100% như trên trình builder.

**Bước 5: Lưu tạm Code**
Website không dùng database. Giữa mỗi buổi làm việc, nên "Tạo file preview" hoặc lưu đoạn Export đó vào tệp JSON thủ công. Lần sử dụng sau bạn chỉ cần bấm nút "📥 Nhập code" và dán trở lại để Resume dự án.
