# Đánh giá mã nguồn tham khảo

Ngày khảo sát: 11/11/2026. Đây là đánh giá kỹ thuật và thông tin giấy phép trong kho, không phải tư vấn pháp lý.

| Kho | Giấy phép và phạm vi | Module đáng tham khảo/tái sử dụng | Quyết định |
|---|---|---|---|
| [My Motion Studio](https://github.com/rodolphe37/my-motion-studio), commit 161414bc | MIT, Copyright (c) 2026 rodolphe37; phải giữ thông báo bản quyền và giấy phép khi phân phối phần mã sao chép đáng kể. | `src/lib/animation.ts` nội suy và easing; `Canvas3D.tsx` cảnh Three.js và gizmo; `db.ts` lưu IndexedDB; `ExportModal.tsx` ghi canvas. | Đã điều chỉnh các hàm easing từ mã MIT; các thành phần giao diện gốc chưa được tích hợp và cần tiếp tục nghiên cứu khả năng tương thích. Xuất MP4 gốc dùng MediaRecorder nên phải kiểm tra hỗ trợ định dạng. |
| [PixelStage](https://github.com/YUANYINGLONG-91/pixelstage) | MIT, Copyright (c) 2026 PixelStage contributors; giữ thông báo nếu phân phối phần mã sao chép đáng kể. | `src/core/cameraPaths.ts`: toán học orbit/dolly/sweep; stage 3D và camera. | Tham khảo ý tưởng chuyển động; viết preset riêng theo keyframe để chỉnh thủ công. |
| [Parallaxie](https://github.com/RobinSallstrom/Parallaxie) | Không thấy LICENSE ở thư mục gốc lúc khảo sát. `cep/LICENSE` là MIT của Hyper Brew LLC, không đủ căn cứ để coi toàn bộ lõi Parallaxie là MIT. | Lõi ExtendScript dựng rig/camera và panel CEP phụ thuộc After Effects; biểu đồ depth là ví dụ giao diện. | Không sao chép lõi hoặc tích hợp trực tiếp; chỉ tham khảo ý tưởng bố trí lớp theo chiều sâu. |

Các thư viện sử dụng qua npm có giấy phép riêng trong từng gói; Three.js (MIT), JSZip (MIT/GPLv3 dual), mp4-muxer (MIT), Vite (MIT). Xem LICENSE của từng gói để biết chi tiết.
