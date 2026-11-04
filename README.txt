STUDYT AURORA V2 — CẬP NHẬT 04/11/2026
==========================================
BẢN SỬA TỪ HAI FILE STUDYT AURORA (HỌC VIÊN + QUẢN TRỊ)

CẬP NHẬT GIAO DIỆN
1) Chuông góc phải: hiện bảng tin ngay trong popover (dùng lại #newsBox và renderNews từ mã cũ).
   Mục Bảng tin ở phần nội dung phía dưới đã bị ẩn. Quản trị vẫn có thể đăng/sửa/xóa tin từ popover.
2) Avatar chữ cái: mở trực tiếp màn Cài đặt (#stPane); không còn hiển thị mục Cài đặt
   ở sidebar. Trong Cài đặt có các nút Đăng xuất, và Sao lưu/Khôi phục cho quản trị.
3) Admin: ẩn mục Phân tích trên sidebar và giao diện phân tích riêng;
   không xóa các xử lý dữ liệu liên quan, để giảm nguy cơ hỏng chức năng cũ.
4) Trang mới khi chưa đăng nhập: trang giới thiệu StudyT với hình chú heo, mô tả
   tính năng, và CTA Đăng nhập/Đăng ký. Hộp đăng nhập hiện khi nhấn CTA.
5) Hiển thị tốt trên desktop và mobile; chuyển động tôn trọng reduced-motion.

ĐĂNG NHẬP VÀ ĐĂNG KÝ
- Người dùng mới (chỉ trang index.html) điền Họ tên, Tên tài khoản, Gmail và Mật khẩu.
- Gmail bắt buộc dạng @gmail.com cho luồng đăng ký mới; ứng dụng chuẩn hóa
  dấu chấm (.) và bí danh +... của Gmail về cùng một địa chỉ để giảm trùng lặp.
- Supabase Auth nhận Gmail thật (không dùng tài khoản @studyt.app giả cho người mới).
- Đăng nhập hỗ trợ Gmail của người mới và Tên đăng nhập cũ của người dùng hiện hữu.
- Trang admin.html KHÔNG cho đăng ký quản trị công khai; quyền admin vẫn phải
  được gán và kiểm tra từ profiles/RLS trong hệ thống hiện tại.

CẤU HÌNH SUPABASE CẦN KIỂM TRA TRƯỚC KHI TRIỂN KHAI
1. Authentication -> Providers -> Email: bật Confirm Email (Xác nhận email)
   nếu muốn chỉ Gmail được xác thực mới đăng nhập. Cài Site URL/Redirect URLs.
2. Kiểm tra trigger tạo profiles từ auth.users: phải hỗ trợ email Gmail thật,
   đọc raw_user_meta_data.username và full_name; nếu trigger chỉ chấp nhận email
   giả @studyt.app, đăng ký có thể chưa tạo hồ sơ. KHÔNG tự sửa trigger vì chưa có SQL.
3. Supabase Auth duy trì tính duy nhất của email đăng ký trong Auth; việc frontend
   kiểm tra format và chuẩn hóa Gmail không thay thế xác minh và bảo vệ ở server.
   Khi Confirm Email bật, hệ thống có thể trả phản hồi không cho biết email đã
   đăng ký để tránh tiết lộ tài khoản; giao diện hiển thị thông báo trung tính.
4. Kiểm tra RLS trên profiles, exams, attempts, announcements; trang quản trị
   không được dựa riêng vào UI để chặn quyền truy cập.
5. Tài khoản cũ dùng @studyt.app/@quizmaster.app vẫn được giữ nguyên; bộ này
   KHÔNG chuyển email hoặc thay đổi dữ liệu của các tài khoản đã tồn tại.

KIỂM TRA ĐÃ THỰC HIỆN
- Node.js kiểm tra cú pháp 38 khối script inline của index.html,
  25 khối script inline của admin.html, JS chính và JS V2: không lỗi cú pháp.
- Kiểm tra ID trùng trong hai file: không phát hiện.
- Kiểm tra tương tác trên DOM mô phỏng: guest page, modal đăng nhập, di chuyển
  newsBox vào chuông, ẩn nav Cài đặt: đạt.
- Chưa kiểm tra đầy đủ luồng end-to-end trên hosting thật hoặc tài khoản Supabase:
  môi trường Chromium chặn địa chỉ localhost. Cần kiểm thử đăng ký qua Gmail,
  xác nhận email, đăng nhập, phân quyền, đăng bảng tin và các màn hình cũ.

CÁCH TRIỂN KHAI
- Sao lưu website cũ và dữ liệu Supabase trước.
- Triển khai đầy đủ nội dung thư mục (index.html, admin.html, CSS, JS,
  thư mục assets, icons, sw.js và manifest.webmanifest) trong cùng thư mục web.
- Không tách hai file HTML khỏi các tài nguyên đi kèm.
- Triển khai lên HTTPS với đường dẫn cấu hình đúng để Service Worker hoạt động.
- Sau khi cập nhật, dùng Ctrl+Shift+R để nạp tài nguyên mới; nếu PWA cũ còn cache,
  xóa cache của website hoặc cập nhật phiên bản Service Worker theo hệ thống của bạn.

---------------- HƯỚNG DẪN TRƯỚC ĐÂY ----------------
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
