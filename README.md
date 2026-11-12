# Xưởng Vox — Manual 2.5D Camera Editor

Ứng dụng dựng video 2.5D chạy trong trình duyệt. Chạy `npm install` rồi `npm run dev`; bản triển khai tạo bằng `npm run build`.

## Dự án và cảnh

Danh sách trên thanh trên cùng dùng để chuyển giữa các dự án đã lưu trên trình duyệt. Nút **Dự án mới** tạo dự án riêng sau khi lưu dự án hiện tại. Các dự án cũ được chuyển sang danh sách khi mở lần đầu. Dữ liệu vẫn thuộc trình duyệt và tên miền hiện tại; **Xuất dự án ZIP** tạo bản sao gồm mọi cảnh, ảnh, âm thanh và font được nhập để sao lưu hoặc chuyển máy.

Danh sách **Cảnh** trên timeline dùng để thêm, nhân đôi, đổi tên, đổi thứ tự và xóa cảnh; mỗi cảnh có layer, camera, thời lượng và âm thanh riêng. **Phát tất cả cảnh** xem lần lượt; xuất MP4 ghép các cảnh theo thứ tự. Dữ liệu và âm thanh của từng cảnh được lưu riêng.

## Chữ và mẫu

Phím **T** mở tab Text; thêm layer chữ, chỉnh kiểu và chọn hiệu ứng. Chọn một đoạn trong ô nội dung để đánh dấu bằng nét tô, gạch chân, khoanh hoặc gạch chéo. Nút **Nhập font UTM Bebas** nhận file font người dùng cung cấp và lưu cùng dự án.

Nút **Lưu mẫu** trên thanh đầu lưu keyframe camera; danh sách có hình xem trước quỹ đạo. Trong tab Text, **Lưu mẫu chữ** lưu kiểu chữ, đánh dấu và keyframe; ảnh xem trước giúp chọn lại mẫu. Mẫu được lưu tại trình duyệt.

## Xuất video

MP4 H.264/AAC được mã hóa tại máy bằng WebCodecs và bộ mã hóa AAC dự phòng. Tỉ lệ theo khung camera đang chọn. Tiến độ hiển thị trên nút xuất; khi hoàn thành hoặc gặp lỗi ứng dụng phục hồi cảnh đang chỉnh. Hỗ trợ codec, tốc độ và bộ nhớ phụ thuộc trình duyệt và máy. Xuất video dài có thể dùng nhiều RAM.

Kiểm tra tự động: `npm test`. Kiểm tra giải mã AAC thực tế dùng FFmpeg nếu máy có sẵn; bài đó được bỏ qua nếu không tìm thấy FFmpeg.
