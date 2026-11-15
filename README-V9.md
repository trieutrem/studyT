# StudyT Aurora V9 – bản nâng cấp thử nghiệm

## Cài đặt
1. Giữ bản V8 và sao lưu Supabase trước khi thay đổi.
2. Giải nén ZIP, triển khai thư mục chứa index.html lên một dự án Vercel thử nghiệm (static site, không cần build).
3. Đăng nhập bằng tài khoản StudyT hiện có. Mở mục **Không gian V9** ở thanh điều hướng.
4. Nếu cần sao lưu cloud, chạy `supabase/migrations/20261115_v9_workspace.sql` trong SQL Editor của đúng dự án Supabase. Sau đó mở Cài đặt trong Không gian V9 và thử sao lưu/khôi phục bằng tài khoản thử nghiệm.
5. Kiểm tra trên hai tài khoản khác nhau, desktop và điện thoại trước khi thay website chính.

## Phạm vi
V9 bổ sung một workspace độc lập để tránh sửa các luồng V8 đang sử dụng. Mã V8 và admin.html được giữ nguyên ngoại trừ việc thêm CSS/JS V9 vào index.html và cập nhật SW. Dữ liệu mới được lưu theo ID tài khoản trên localStorage; không tự nhập hoặc đồng bộ dữ liệu V8. Sao lưu cloud thủ công, ghi đè có xác nhận, không phải realtime hoặc merge đa thiết bị.

Các chức năng: dashboard từ dữ liệu V9, môn học, tính điểm cuối kỳ, Kanban chuyển trạng thái, lịch tổng hợp, xem PDF cục bộ, ghi chú và tạo flashcard, lịch ôn đơn giản, ngân hàng câu hỏi trắc nghiệm và lịch sử trả lời, timer tập trung, thống kê và XP, HTML/CSS/JS sandbox, kế hoạch học theo quy tắc, hồ sơ điện tử tự khai, tìm kiếm Ctrl+K, sao lưu/khôi phục. Giao diện V9 dùng màu sáng và đen thuần, có nhãn Việt/Anh theo lang của trang.

## Chưa hoàn thành
- Hợp nhất hoàn toàn giao diện và dữ liệu V8/V9, thay thế sidebar/dashboard cũ, i18n toàn bộ V8, phân rã HTML cũ.
- PDF highlight trực tiếp trên trang, OCR, lịch sử tài liệu, lưu PDF cloud, chỉnh sửa PDF.
- GPA tích lũy theo quy chế trường, lịch tháng/tuần, đồng bộ Google Calendar, thông báo push.
- AI thực sự, API AI, chấm tự luận, trích dẫn tài liệu, SQL/C#/Python runtime, UML/ERD.
- Thi chính thức, ma trận đề, chống gian lận, phân tích câu hỏi nâng cao, nâng cấp admin và phân quyền toàn hệ thống.
- Học nhóm realtime, QR xác minh, chứng nhận, Study Pet đầy đủ, app store, offline PDF và đồng bộ tự động.

## Kiểm thử
`node --check studyt-v9.js` và `node --check sw.js` đã chạy thành công. Fixture `tests/workspace-smoke.html` có thể mở qua HTTP để kiểm tra thêm môn, nhiệm vụ, lịch flashcard và các tab; môi trường tạo file chặn điều hướng Chromium nên chưa xác nhận kết quả chạy fixture. Chưa kiểm thử tài khoản thật, RLS thực tế hoặc triển khai Vercel. Không dùng bản thử nghiệm để thay bản production trước khi kiểm thử.
