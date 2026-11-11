# Xưởng Vox — Manual 2.5D Camera Editor

Ứng dụng web độc lập, xử lý tại trình duyệt, không cần tài khoản, backend hoặc AI. Cài Node.js rồi chạy `npm install`, `npm run dev`; bản triển khai tĩnh tạo bằng `npm run build` (thư mục `dist`).

Nhập nhiều PNG/JPG, chọn layer rồi kéo trục trên màn hình; chuyển Custom 3D View để quan sát bố trí không gian. Sửa thông số trong bảng bên phải. Đưa con trỏ thời gian tới vị trí cần thiết, đổi thuộc tính rồi thêm keyframe; chọn hình thoi để sửa thời điểm, easing hoặc xóa. Preset tạo keyframe camera tại đầu và cuối cảnh. Bấm Phát để xem. Dự án tự lưu IndexedDB theo trình duyệt và tên miền; xuất ZIP thường xuyên để sao lưu. ZIP bao gồm project.json và ảnh gốc.

MP4 được mã hóa tại máy bằng WebCodecs H.264, 1920×1080, 30 fps và mux thành MP4. Tính năng phụ thuộc hỗ trợ thực tế của trình duyệt/thiết bị; ứng dụng kiểm tra codec và báo lỗi nếu không hỗ trợ. Chrome/Edge mới thường phù hợp hơn, không đảm bảo tất cả máy. Xuất video dài có thể dùng nhiều RAM. Cảnh demo tạo hình bằng canvas, không dùng AI.

Chi tiết nghiên cứu kho và giấy phép trong [NGHIEN-CUU.md](NGHIEN-CUU.md).
