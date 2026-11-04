STUDYT AURORA V4 — GIAO DIỆN TINH GỌN & SỬA LỖI THEO ẢNH NGƯỜI DÙNG
Ngày cập nhật: 04/11/2026

THAY ĐỔI
1. Gỡ dải "Trung tâm tài khoản" trong Cài đặt. Các chức năng Cài đặt gốc vẫn được giữ nguyên.
2. Avatar trên thanh trên cùng mở menu thả xuống với Cài đặt và Đăng xuất (admin còn có các lối tắt quản lý/sao lưu). Bấm lần nữa hoặc bên ngoài để đóng.
3. Bộ đếm lượt xem và người trực tuyến đặt ở cuối tab TRANG CHỦ, không còn bám cố định màn hình hay che nội dung.
4. Bỏ 3 dải tiêu đề lớn Kỳ thi, Bài ôn, Tự ôn từ file. Giữ nguyên toàn bộ danh sách đề/môn và các thao tác.
5. Khôi phục tương phản chữ/nút trong các thẻ Ôn trắc nghiệm và Ôn tự luận, có quy tắc cho chế độ sáng/tối.
6. Gỡ các lối mở "Góc học tập thông minh" (V3) khỏi giao diện học viên: thanh bên, trang chủ, menu heo, phím tắt; giữ lại dữ liệu cục bộ cũ để tránh mất ghi chú nếu từng sử dụng. Trung tâm vận hành admin vẫn còn.
7. Thanh tìm kiếm là ô nhập thật, người dùng gõ và nhấn Enter/nút mũi tên để tìm phần nội dung đã nạp vào trang, điều hướng đến mục trùng và làm nổi bật mục đó. KHÔNG tìm toàn bộ Supabase, KHÔNG hiển thị kết quả popup hay gợi ý ở dưới.
8. Tắt Ctrl+K tự mở ST+; ST+ chỉ mở khi người dùng chủ động nhấn biểu tượng heo và chọn Tiện ích nhanh.
9. Giữ nguyên bảng tin của chuông trong V3, không tạo bảng tin bản sao; giữ các hàm đăng/chỉnh sửa/xóa hiện có của website gốc.
10. Cập nhật Service Worker cache version V4 và thêm stylesheet studyt-refine.css.

TRIỂN KHAI VERCEL
- Dùng file StudyT_Aurora_V4_Deploy.zip: giải nén, đưa NỘI DUNG thư mục (index.html ở gốc repo) vào repository GitHub đang kết nối Vercel.
- Không chỉ đưa 2 HTML. Phải đi kèm các tệp CSS/JS/assets/icons/sw.js/manifest.webmanifest.
- Không đổi tên các tệp; Vercel có thể tự triển khai lại sau khi commit.
- Bản Complete có kèm migration SQL V3 CHỈ để tham khảo; không tải thư mục migrations lên website công khai, không chạy SQL khi chưa kiểm tra staging.
- Tại Supabase Authentication > URL Configuration: giữ đúng Site URL của Vercel và các Redirect URLs cần thiết.
- Tải lại bằng Ctrl+Shift+R nếu browser còn giữ tài nguyên cache cũ.

KIỂM THỬ ĐÃ THỰC HIỆN
- Node.js syntax check: các file JS, inline script trong cả 2 HTML.
- HTML ID uniqueness: không phát hiện ID trùng lặp.
- Kiểm thử DOM cô lập bằng Chromium: mở/đóng menu avatar, chuông Bảng tin, tìm từ khóa, ẩn tiêu đề, màu chữ 2 thẻ, không hiển thị Góc học tập thông minh, không hiển thị Trung tâm tài khoản.
- Kiểm tra đoạn mã bộ đếm: nằm trong .home-pane[data-pane=home], không còn fixed.
CHƯA KIỂM THỬ đăng nhập và Supabase trên hosting thực tế, hoặc mọi luồng chức năng trong hệ thống cũ; trước khi triển khai production hãy sao lưu và thử trên preview/staging.

GIỮ NGUYÊN CÁC DỮ LIỆU
- Không thay đổi bảng Supabase, SQL, RLS hoặc cấu trúc tài khoản.
- Không xóa dữ liệu của V3. Chỉ gỡ lối truy cập đến module Góc học tập thông minh dành cho học viên.
- Admin vẫn dùng Trung tâm vận hành V3.
