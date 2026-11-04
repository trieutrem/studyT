StudyT Aurora V5.2 – CẬP NHẬT XÁC THỰC & ĐĂNG NHẬP
=================================================
Bản này được tạo từ bộ StudyT Aurora V5.1 FIXED.

A. QUẢN TRỊ
- Email quản trị duy nhất trong giao diện: hktrieuvioletvc@gmail.com
- /admin.html chỉ chấp nhận Gmail đó và đòi profiles.role = 'admin'.
- /index.html từ chối Gmail quản trị và từ chối profiles.role = 'admin'.
- Đây là kiểm tra client/UI. Phân quyền dữ liệu thật vẫn phải thực thi bằng RLS phía Supabase.
- KHÔNG tự tạo tài khoản quản trị mới. Chuyển email của CHÍNH tài khoản quản trị cũ trong Supabase,
  giữ nguyên auth.users.id (UID) để không mất hồ sơ/quan hệ dữ liệu.

B. TÀI KHOẢN HỌC VIÊN CŨ
- Đăng nhập bằng tên cũ được giữ tương thích với @studyt.app, @quizmaster.app.
- Những tài khoản cũ đăng nhập thành công được yêu cầu bổ sung Gmail.
- Popup chỉ đóng khi Supabase đã trả về Gmail được xác nhận; không tự đóng ngay khi gửi yêu cầu.
- Với email ảo @studyt.app không có hộp thư, nếu bật Secure email change (xác nhận hai địa chỉ)
  thì người dùng KHÔNG THỂ xác nhận email cũ. Phải dùng chức năng quản trị đáng tin cậy để chuyển đổi
  auth.users.email của CHÍNH UID đó sau khi kiểm tra quyền sở hữu Gmail mới. Không tạo tài khoản mới.
- Nếu Supabase từ chối đăng nhập email ảo với lỗi "Email address ... is invalid", mã web không thể tự
  vượt qua kiểm tra của Supabase Auth. Quản trị viên phải chuyển email account cũ bằng Auth Admin API.
- Trên Supabase Auth Dashboard/URL Configuration:
  Site URL = https://itsstudyt.vercel.app/
  Redirect URLs cho phép cả:
   https://itsstudyt.vercel.app/
   https://itsstudyt.vercel.app/admin.html
- Xem Authentication > Emails > Templates, bảo đảm email xác nhận dùng {{ .ConfirmationURL }}
  hoặc mẫu mặc định Supabase, không dùng các đường dẫn /auth/confirm chưa tồn tại trong hosting.
- Liên kết xác nhận có thời hạn và chỉ dùng một lần; xin email xác nhận mới nếu hết hạn.

C. TRIỂN KHAI VERCEL
1. Sao lưu toàn bộ website và trạng thái Supabase.
2. Thay tất cả file trong thư mục deploy, không lồng thêm thư mục phía trên index.html.
3. Commit vào repository kết nối Vercel, kiểm tra Deployments > Production đã Ready.
4. Tải lại bằng Ctrl+Shift+R hoặc kiểm tra trong cửa sổ ẩn danh để tránh Service Worker cache cũ.
5. Kiểm thử: đăng ký Gmail mới, xác nhận email, học viên đăng nhập; admin đăng nhập;
   người dùng cũ được yêu cầu cập nhật email, các link xác nhận quay về website.

D. BẢO MẬT
- Supabase publishable/anon key có thể nằm trong mã client; tuyệt đối KHÔNG đưa service_role
  hay secret key vào HTML, JavaScript công khai, Vercel repo client hoặc ZIP deploy.
- Mọi thao tác cập nhật email hàng loạt phải có kiểm tra danh tính và bản sao lưu trước đó.
- Chỉ so sánh email trong HTML không ngăn được gọi Supabase API trực tiếp. RLS vẫn phải
  xác định role và user ID phía database. Chưa xác minh schema/RLS hiện tại.

Không có SQL tự động chạy trong bản deploy này.
