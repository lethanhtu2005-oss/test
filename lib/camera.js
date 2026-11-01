// AI01: thông báo dễ hiểu cho từng lỗi khi mở camera (getUserMedia).
export function cameraErrorMessage(error) {
  switch (error?.name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Bạn đã từ chối quyền camera. Có thể bật lại trong cài đặt trình duyệt, hoặc chọn ảnh có sẵn.";
    case "NotFoundError":
    case "DevicesNotFoundError":
    case "OverconstrainedError":
      return "Không tìm thấy camera trên thiết bị này. Bạn có thể chọn ảnh có sẵn.";
    case "NotReadableError":
    case "TrackStartError":
      return "Camera đang được ứng dụng khác sử dụng. Hãy đóng ứng dụng đó rồi thử lại.";
    case "SecurityError":
      return "Camera chỉ mở được trên trang HTTPS. Bạn có thể chọn ảnh có sẵn.";
    default:
      return "Không mở được camera. Hãy thử lại hoặc chọn ảnh có sẵn.";
  }
}
export function cameraSupported(nav) {
  return !!nav?.mediaDevices?.getUserMedia;
}
