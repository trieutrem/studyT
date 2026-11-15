# StudyT 9.6 · Giải đấu Free Fire tích hợp (V1.0)

## Vị trí chức năng

**Trang học viên (`index.html`)**: Đăng nhập StudyT → **Điện tử** → điền mã ID, họ tên, ngày sinh → đánh dấu đồng ý → **Xác nhận thông tin**. Sau khi lưu Supabase thành công, ngay phía dưới xuất hiện khu vực **Giải đấu Free Fire**: Thể lệ, Bảng xếp hạng, Đăng ký. Dữ liệu được lưu trên server, không lưu mã ID/ngày sinh ở localStorage.

**Trang quản trị (`admin.html`)**: Đăng nhập quản trị viên hiện có → menu **🏆 Giải đấu Free Fire** → Thí sinh / Nhập điểm / Xếp hạng & cúp / 15 tài khoản. Admin xem toàn bộ thông tin đăng ký (bao gồm ngày sinh của thí sinh, cần bảo mật), duyệt hoặc từ chối, nhập kết quả và tải danh sách CSV.

## Thể thức nội bộ (không phải luật Garena)

- **Sinh tồn Solo – 19/11/2026:** 5 trận, cá nhân. Top 1: 20; 2:17; 3:15; 4:13; 5:12; 6–10: 10→6; 11–15:5; 16–20:3; 21–30:2; 31–40:1; 41–50:0; mỗi kill +2 điểm. Bằng điểm ưu tiên Booyah, tổng kill, thứ hạng trận 5.
- **Tử chiến – 22/11/2026:** 5 trận 4v4; thắng 4 round trước; 3 điểm trận thắng, 0 điểm trận thua. Bằng điểm dùng hiệu số round và tổng round thắng. Quản trị phải đủ 4 thành viên đã duyệt ở mỗi đội để nhập kết quả.
- **Độc Lang Chiến – 25/11/2026:** 1v1 thắng 5 round trước; quản trị lưu các trận vòng loại/bán kết/chung kết/tranh ba. 🏆/🥈/🥉 tự xác định từ kết quả chung kết và trận tranh ba.

## Triển khai bắt buộc

1. **Sao lưu Supabase trước khi chạy migration.** Không cần sửa các bảng nghiệp vụ StudyT hiện có.
2. Chạy `supabase/migrations/20261116_freefire_tournament.sql` trong Supabase SQL Editor của dự án StudyT **sau khi đã có bảng profiles**. Migration tạo bảng riêng, RLS, chính sách hạn chế tài khoản thi đấu và view bảng xếp hạng.
3. Dùng gói **thiết lập riêng tư** (cấp riêng, KHÔNG đặt trên hosting) để chạy `cap_15_tai_khoan.mjs` với **service_role** từ Supabase. Tập lệnh sẽ tạo 15 account `ffplayer01` → `ffplayer15` có mật khẩu ngẫu nhiên trong CSV. **Chưa chạy bước này thì 15 tài khoản chưa tồn tại trên Supabase, không thể đăng nhập.**
4. Đưa **toàn bộ thư mục website** lên host HTTPS, bao gồm `studyt-freefire.js` và `studyt-freefire.css`. Không đưa CSV, tập lệnh provisioning hoặc khóa bí mật lên host.
5. Mở thử bằng Chrome/Edge và đăng nhập 1 tài khoản hạn chế. Các mục StudyT khác bị làm mờ/không thể click; cơ sở dữ liệu ngăn truy cập dữ liệu bảng đã bật RLS.

## Quyền và an toàn

- **Người thường:** xác nhận thông tin cá nhân, chọn chế độ và đăng ký; xem xếp hạng đã công bố, không thấy hồ sơ riêng của người khác.
- **15 tài khoản giới hạn:** là user Auth thật, được quản lý trong `ff_accounts`, chỉ truy cập mục Điện tử. Quản trị viên có thể tạm khóa.
- **Quản trị:** giữ tài khoản `admin.html` hiện có. Chỉ admin có quyền sửa điểm và duyệt thí sinh qua RLS.
- **Cảnh báo quan trọng:** Migration áp policy hạn chế lên các bảng StudyT **đã bật RLS** tại thời điểm chạy. Những bảng chưa bật RLS, chức năng RPC `SECURITY DEFINER`, hoặc endpoint ngoài Supabase chưa được rà soát sẽ cần kiểm toán riêng trước khi công khai quyền truy cập. CSS blur tự nó không phải biện pháp bảo mật.
- Mật khẩu tài khoản thi đấu chỉ nằm trong CSV cấp riêng (không nằm trong mã nguồn website). Nên phát từng thông tin đăng nhập cho đúng thí sinh và đổi mật khẩu ban đầu.
- Giải đấu hoạt động trên Supabase khi cấu hình hoàn tất; không có đăng ký/điểm thực tế nếu chưa chạy migration.

## Những gì đã và chưa được kiểm tra

Đã kiểm tra cú pháp script Node/JavaScript; dựng giao diện thí sinh và quản trị trong trình duyệt cô lập bằng dữ liệu giả để thử render, bảng xếp hạng và biểu mẫu. Chưa kiểm thử tích hợp trực tiếp với cơ sở dữ liệu Supabase thực của bạn, do không có khóa admin hay quyền chạy migration trên dự án.
