StudyT AURORA PREMIUM · 04/11/2026
===================================

BỘ GIAO DIỆN STUDYT HỌC VIÊN + QUẢN TRỊ

Nội dung
---------
index.html                 Trang học viên (giữ mã nguồn chức năng hiện có)
admin.html                 Trang quản trị (giữ mã nguồn chức năng hiện có)
studyt-premium.css         Bộ thiết kế dùng chung (sáng/tối/responsive)
studyt-premium.js          Bảng điều khiển mới + các điều hướng tương thích
assets/                   Hình heo, icon từ ảnh mẫu người dùng cung cấp
manifest.webmanifest      PWA manifest
sw.js                     Service worker: chỉ hỗ trợ cache vỏ giao diện
icons/                    Biểu tượng PWA
README.txt                Hướng dẫn này

CÀI ĐẶT
-------
1. Giải nén đầy đủ vào cùng một thư mục.
2. Đưa nguyên thư mục lên hosting đang chạy StudyT qua HTTPS.
3. Không chỉ tải lên riêng index.html/admin.html; các file CSS, JS và assets/ là cần thiết.
4. Các file index.html và admin.html phải cùng cấp để chuyển trang đúng.
5. Giữ cấu hình Supabase hiện có trong hai HTML; bộ giao diện mới không sửa database hoặc RLS.
6. Nên xóa cache trình duyệt/refresh mạnh (Ctrl+Shift+R) khi kiểm tra lần đầu.
7. Đăng nhập bằng tài khoản học viên và quản trị thật, thử các luồng nghiệp vụ trước khi cập nhật trang chính thức.

TÍNH NĂNG GIAO DIỆN MỚI
-----------------------
- Sidebar navy/tím với logo heo, menu nổi bật, bóng đổ và hiệu ứng hover.
- Trang chủ premium gồm banner heo, số liệu liên kết nguồn dữ liệu hiện hữu,
  nhóm thẻ chức năng, gợi ý lối tắt và hoạt động gần đây.
- Giao diện riêng cho học viên và quản trị, sử dụng chung bộ màu và components.
- Tìm nhanh thông qua ST+ cũ; bảng ST PRO vẫn được giữ lại.
- Tùy chọn chế độ sáng/tối và tùy chọn theo thiết bị từ StudyT cũ;
  với người dùng chưa từng lưu cài đặt, mặc định sáng.
- Menu avatar: cài đặt, đăng xuất; trên admin có quản lý tài khoản,
  chuyển sang trang học viên, sao lưu và khôi phục (gọi lại hàm cũ).
- Chú heo mascot có chuyển động; hỗ trợ prefers-reduced-motion.
- Responsive: sidebar ở desktop, rail với tablet, bottom nav ở điện thoại.
- Mục tiêu số lượt thi có thể điều chỉnh bằng cách chọn vào vòng tiến độ
  trên giao diện học viên. Chỉ lưu trên trình duyệt.

NGUỒN DỮ LIỆU CỦA CÁC THẺ
------------------------
- Số môn, tài liệu, kỳ thi, lịch sử làm bài: đọc từ trạng thái đang có trong app;
  không tự tạo dữ liệu và không thực hiện thao tác ghi vào Supabase.
- Vòng tròn học viên là số lượt thi đã ghi nhận / mục tiêu tùy chỉnh (mặc định 5),
  KHÔNG phải phần trăm hoàn thành toàn bộ giáo trình.
- Vòng tròn admin là số kỳ thi có trạng thái published=true / tổng kỳ thi có trường published boolean;
  nếu thiếu trường này, dashboard không thể tự xác nhận trạng thái xuất bản.
- Khi chưa đăng nhập hoặc chưa tải được dữ liệu, các chỉ số có thể hiện 0 hoặc “—”.

NHỮNG GÌ KHÔNG ĐƯỢC KHẲNG ĐỊNH
-----------------------------
- Chưa có kiểm thử Supabase trực tuyến, RLS, quyền truy cập hay mọi luồng nghiệp vụ.
- Chưa kiểm thử đầu cuối trên hosting thật; kiểm tra browser nội bộ có hạn chế mạng.
- Việc giữ mã nguồn cũ không tự đảm bảo mọi chức năng hoạt động trong mọi điều kiện.
- PWA chỉ cache vỏ giao diện; không hỗ trợ sửa bài, đăng nhập hoặc đồng bộ Supabase offline.

ĐỂ KHÔI PHỤC PHIÊN BẢN TRƯỚC
----------------------------
Giữ lại bản StudyT_Premium_Mascot.zip trước đó để quay lại khi cần.
Không sửa SQL schema, policies hoặc bảng Supabase khi triển khai giao diện này.
