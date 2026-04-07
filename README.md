# map-builder

Public page cho repo này đã được cấu hình bằng GitHub Pages (deploy tự động qua GitHub Actions).

## Cách xuất bản public page

1. Commit và push các file hiện tại lên nhánh master.
2. Vào GitHub repo này, mở tab Settings > Pages.
3. Ở mục Build and deployment, chọn Source là GitHub Actions.
4. Sau khi workflow Deploy static site to Pages chạy xong, site public sẽ có URL dạng:

	https://phudigital.github.io/map-builder/

## Deploy lần đầu

- Workflow nằm tại .github/workflows/deploy-pages.yml
- Mỗi lần push lên master sẽ tự deploy lại.
