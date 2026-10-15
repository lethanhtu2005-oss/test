export const topics = [
  {
    slug: "support",
    title: "Hỗ trợ tại điểm đến",
    short:
      "Trao đổi nhu cầu với người đồng hành và chuẩn bị câu hỏi cho đơn vị tiếp đón.",
    icon: "user",
    intro:
      "Một sự hỗ trợ phù hợp bắt đầu bằng câu hỏi: bạn muốn được hỗ trợ như thế nào? WayEcho giúp bạn chuẩn bị thông tin trước khi liên hệ.",
    sections: [
      {
        id: "before",
        title: "Nói rõ nhu cầu của bạn",
        paragraphs: [
          "Cho biết bạn muốn được hướng dẫn bằng lời, hỗ trợ tìm quầy vé hay có người đồng hành trên một đoạn đường. Bạn có thể chọn từng yêu cầu trong luồng đặt dịch vụ demo, thay vì chia sẻ toàn bộ hồ sơ.",
          "Đơn vị tiếp đón cần xác nhận ai sẽ hỗ trợ, tại đâu và vào thời điểm nào. Gửi yêu cầu chưa đồng nghĩa với được chấp thuận.",
        ],
      },
      {
        id: "meet",
        title: "Thống nhất điểm gặp và cách liên lạc",
        paragraphs: [
          "Chọn mốc rõ ràng như tên cổng hoặc quầy thông tin, tránh chỉ ghi ‘trước cửa’. Lưu xác nhận của đơn vị và một phương án thay thế nếu không gặp được người hỗ trợ.",
        ],
      },
    ],
    action: {
      href: "/booking?item=demo-guide-tour",
      label: "Thử gửi nhu cầu hỗ trợ — demo",
    },
    related: ["chuan-bi-chuyen-di", "hoi-ve-kha-nang-tiep-can"],
  },
  {
    slug: "guide-dogs",
    title: "Chó dẫn đường và hành trình của bạn",
    short:
      "Hiểu vai trò, cách ứng xử và những điều cần xác nhận trước khi di chuyển.",
    icon: "dog",
    image: "/assets/images/guide-dog.webp",
    alt: "Chó dẫn đường lông đen đeo bộ đai có tay cầm, đứng trên bãi cỏ cạnh người sử dụng.",
    intro:
      "Chó dẫn đường là động vật được huấn luyện để hỗ trợ người khiếm thị di chuyển. Mục này cung cấp kiến thức tham khảo; WayEcho chưa cung cấp, huấn luyện hay cho thuê chó dẫn đường.",
    sections: [
      {
        id: "role",
        title: "Một người bạn đồng hành đã qua huấn luyện",
        paragraphs: [
          "Chó dẫn đường hỗ trợ định hướng di chuyển cùng người sử dụng. Việc làm việc cùng chó đòi hỏi huấn luyện và phối hợp; không phải bất kỳ thú cưng nào cũng có thể đảm nhận vai trò này.",
        ],
      },
      {
        id: "etiquette",
        title: "Khi gặp một đội chó dẫn đường",
        paragraphs: [
          "Khi chó đang làm việc, tránh vuốt ve, gọi, cho ăn hoặc khiến chó mất tập trung. Hãy nói với người sử dụng nếu muốn đề nghị hỗ trợ và tôn trọng câu trả lời của họ.",
          "Đừng tự cầm dây hay bộ đai để dẫn chó. Người sử dụng là người điều khiển và quyết định cách nhận hỗ trợ.",
        ],
      },
      {
        id: "prepare",
        title: "Chuẩn bị trước khi di chuyển",
        paragraphs: [
          "Liên hệ từng hãng vận chuyển và nơi lưu trú để xác nhận điều kiện tiếp nhận, giấy tờ được yêu cầu, vị trí ngồi và thời điểm thông báo. Lưu câu trả lời bằng văn bản khi có thể.",
          "Chuẩn bị nước, thức ăn quen thuộc, vật dụng vệ sinh và thời gian nghỉ phù hợp. Trao đổi với đơn vị đã huấn luyện chó về những nhu cầu riêng của hành trình.",
        ],
      },
      {
        id: "access",
        title: "Xác nhận với từng địa điểm",
        paragraphs: [
          "WayEcho chưa xác minh chính sách tiếp nhận chó dẫn đường cho từng địa điểm và phương tiện tại Việt Nam. Không áp dụng mặc định quy định của nước ngoài cho chuyến đi trong nước. Hãy hỏi trực tiếp đơn vị quản lý trước khi đặt dịch vụ.",
          "Chưa có danh sách đơn vị cung cấp chó dẫn đường tại Việt Nam được xác minh trong dự án. Các tổ chức bên dưới là nguồn kiến thức quốc tế, không phải đối tác của WayEcho.",
        ],
      },
    ],
    sources: [
      {
        label: "Guide Dogs for the Blind — ứng xử với chó dẫn đường",
        url: "https://www.guidedogs.com/resources/guide-dog-etiquette",
      },
      {
        label: "Guide Dogs UK — hướng dẫn hỗ trợ người khiếm thị",
        url: "https://www.guidedogs.org.uk/getting-support/information-and-advice/",
      },
    ],
    action: {
      href: "/articles/hoi-ve-kha-nang-tiep-can",
      label: "Chuẩn bị câu hỏi trước chuyến đi",
    },
    related: ["hoi-ve-kha-nang-tiep-can", "chuan-bi-chuyen-di"],
  },
  {
    slug: "assistive-technology",
    title: "Công cụ hỗ trợ tiếp cận",
    short:
      "Tìm bằng giọng nói, nghe nội dung và điều chỉnh cách hiển thị theo nhu cầu.",
    icon: "voice",
    intro:
      "Bạn có thể chọn cách đọc, nghe và tìm thông tin phù hợp với mình. Các công cụ dưới đây đã có trong prototype WayEcho.",
    sections: [
      {
        id: "listen",
        title: "Nghe và tìm bằng giọng nói",
        paragraphs: [
          "Nút ‘Nghe nội dung’ trên trang chi tiết sử dụng giọng đọc có sẵn của trình duyệt. Trong bảng hỗ trợ ở góc màn hình, bạn có thể dừng đọc bất kỳ lúc nào. Chất lượng giọng tiếng Việt phụ thuộc thiết bị.",
          "Trang tìm kiếm có chức năng nhận giọng nói khi trình duyệt hỗ trợ và bạn cho phép dùng micro. Luôn có ô nhập chữ làm phương án thay thế.",
        ],
      },
      {
        id: "display",
        title: "Chọn cách hiển thị",
        paragraphs: [
          "Dùng nút Sáng / Tối trong thanh đầu trang hoặc bảng hỗ trợ để đổi giao diện. Các tùy chọn chữ lớn, tương phản cao và giảm chuyển động có thể bật độc lập. Lựa chọn được lưu trên trình duyệt bạn đang dùng.",
        ],
      },
      {
        id: "limits",
        title: "Biết giới hạn của công cụ",
        paragraphs: [
          "Bản đồ và trợ lý camera hiện là mô phỏng. Không dùng chúng để xác định đường qua giao lộ hoặc kết luận một tuyến đường an toàn. Thông tin hỗ trợ trên website không thay thế hướng dẫn di chuyển trực tiếp.",
        ],
      },
    ],
    action: { href: "/search", label: "Mở tìm kiếm có hỗ trợ giọng nói" },
    related: ["kham-pha-ha-noi-bang-am-thanh", "chuan-bi-chuyen-di"],
  },
];
export function getTopic(slug) {
  return topics.find((x) => x.slug === slug);
}
