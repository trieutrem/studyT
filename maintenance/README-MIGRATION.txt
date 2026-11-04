CỨU TÀI KHOẢN CŨ @studyt.app — CHỈ DÀNH CHO NGƯỜI SỞ HỮU DỰ ÁN SUPABASE

Vì các địa chỉ @studyt.app và @quizmaster.app không phải hộp thư Gmail thật,
đăng nhập có thể bị Supabase Auth từ chối hoặc không xác nhận được email cũ.
Không có cách sửa đáng tin cậy chỉ bằng HTML/JS công khai cho tài khoản bị khóa này.

Quy trình:
1. Sao lưu database/auth của dự án Supabase.
2. Mở Supabase Dashboard > Authentication > Users. Xác định đúng UID (UUID),
   email giả đang gắn với tài khoản, role trong public.profiles và người sở hữu hợp lệ.
3. Xác minh người sở hữu có quyền sử dụng Gmail mới qua phương thức tin cậy
   (ví dụ yêu cầu người dùng chứng minh đã nhận một email kiểm tra do quản trị viên gửi).
4. Bằng môi trường server/máy tính quản trị tin cậy (không trong website/Vercel frontend),
   dùng Supabase Auth Admin API updateUserById với UID hiện có để cập nhật email,
   không tạo tài khoản mới hoặc đổi ID. Có thể dùng script .mjs kèm theo.
5. Chỉ sau khi đã xác minh quyền sở hữu Gmail, mới sử dụng email_confirm:true.
6. Kiểm tra lại Auth Users / Profiles và thử đăng nhập bằng Gmail mới và mật khẩu cũ.

Script (phải cài @supabase/supabase-js bằng npm trong thư mục maintenance, Node 20+):
Môi trường cần SUPABASE_URL, SUPABASE_SECRET_KEY, STUDYT_USER_ID,
STUDYT_EXPECT_OLD_EMAIL, STUDYT_NEW_GMAIL, STUDYT_PROOF_VERIFIED=YES.
Chạy: node migrate-existing-account-email.mjs
Không đưa secret vào các file HTML, repository frontend hoặc ảnh chụp gửi công khai.

Email quản trị cố định: hktrieuvioletvc@gmail.com
- Để trang admin truy cập được, chính Auth user cũ có profiles.role='admin'
  phải có email này trong Auth Users; thay bằng Auth Admin API nếu đang dùng email giả.
- KHÔNG tạo user admin mới nếu bạn muốn giữ nguyên toàn bộ dữ liệu liên kết UID cũ.
- Script này không tự cấp quyền admin và không đổi role.
- Phải thiết kế RLS để backend chỉ cho đúng vai trò truy cập dữ liệu quản trị.
