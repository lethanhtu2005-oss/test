export const visitGuides = {
  "ho-guom": {
    intro:
      "Hồ Hoàn Kiếm là không gian mặt nước trong trung tâm Hà Nội. Từ bờ hồ, bạn có thể tìm hiểu câu chuyện Tháp Rùa; Cầu Thê Húc nối bờ với khu đền Ngọc Sơn. Tham quan quanh hồ và vào khu đền là hai phạm vi khác nhau, cần kiểm tra riêng điều kiện vào cửa.",
    transport:
      "Thống nhất một điểm đón trả cụ thể quanh khu vực hồ. Trước khi chọn phương tiện công cộng hoặc taxi, kiểm tra điểm dừng và đoạn đi bộ cuối tuyến với nhà cung cấp; WayEcho chưa xác minh hành trình không bậc từ từng điểm dừng đến hồ.",
    tips: [
      "Nói rõ bạn định dạo bờ hồ hay vào đền Ngọc Sơn khi hỏi hỗ trợ.",
      "Xác nhận điều kiện giao cắt và khu vực đông người vào thời điểm dự kiến.",
      "Chưa có dữ liệu xác minh chính sách chó dẫn đường cho từng không gian tại đây.",
    ],
  },
  "van-mieu": {
    intro:
      "Văn Miếu – Quốc Tử Giám là điểm đến văn hóa gắn với truyền thống học tập tại Hà Nội. Khu di tích có nhiều lớp sân và công trình, vì vậy hãy hỏi tuyến tham quan cụ thể thay vì áp dụng một đánh giá chung cho toàn khu.",
    transport:
      "Địa chỉ cổng được ghi trong dữ liệu dự án là 58 Quốc Tử Giám. Xác nhận lại cổng đón khách, vị trí xuống xe và hỗ trợ từ cổng tới quầy vé trước khi đi.",
    tips: [
      "Hỏi cách mượn hoặc sử dụng thiết bị thuyết minh và nội dung có phù hợp nhu cầu của bạn không.",
      "Xác nhận bậc, mặt sân và điểm nghỉ trên tuyến bạn muốn tham quan.",
      "Giá và giờ trong dữ liệu gốc cần được đối chiếu lại ở thời điểm đặt.",
    ],
  },
  "hoang-thanh-thang-long": {
    intro:
      "Hoàng thành Thăng Long là quần thể di tích gắn với lịch sử kinh thành Thăng Long – Hà Nội. Cổng Đoan Môn là một trong những công trình được giới thiệu trong khu di sản. Bạn có thể chọn phạm vi tham quan dựa trên thời gian và nhu cầu của mình.",
    transport:
      "Dữ liệu nguồn chính thức ghi địa chỉ 19C Hoàng Diệu. Hỏi đơn vị quản lý cổng vào áp dụng cho chương trình bạn chọn và điểm hẹn phù hợp; chưa có tuyến di chuyển tiếp cận được khảo sát trong WayEcho.",
    tips: [
      "Hỏi chương trình đang mở và phạm vi tham quan trước chuyến đi.",
      "Xác nhận bậc, nền sân và cách tiếp cận nội dung giới thiệu.",
      "Chưa xác minh dịch vụ đồng hành hoặc chính sách chó dẫn đường tại di tích.",
    ],
  },
};
export function visitGuide(d) {
  return (
    visitGuides[d.slug] || {
      intro: d.summary,
      transport: `Trước khi đến ${d.name}, xác nhận điểm xuống xe và đoạn di chuyển từ đó tới lối vào bạn định sử dụng. Bản đồ trong WayEcho là mô phỏng, chưa có tuyến tiếp cận được khảo sát cho toàn bộ hành trình.`,
      tips: [
        "Kiểm tra thông tin giờ, vé và hỗ trợ trên nguồn chính thức hoặc với đơn vị quản lý.",
        "Xác nhận nhu cầu mô tả bằng lời và điểm gặp nếu có người đồng hành.",
        "Dành thời gian nghỉ và chuẩn bị phương án thay đổi lịch.",
      ],
    }
  );
}
