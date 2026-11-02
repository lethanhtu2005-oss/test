// Danh mục bài viết Topic Cluster 100% về Phố Cổ Hà Nội cho người khiếm thị
// Gồm 1 bài Pillar trung tâm, 10 bài Cluster chuyên sâu và 3 bài cẩm nang nền tảng.
// Tuân thủ nguyên tắc dữ liệu: Không bịa đối tác, gắn nhãn minh bạch.

export const articles = [
  // 1. BÀI PILLAR TRUNG TÂM (H-01)
  {
    slug: "cam-nang-du-lich-pho-co",
    title: "Cẩm nang du lịch tiếp cận Phố Cổ Hà Nội cho người khiếm thị",
    category: "Cẩm nang Phố Cổ",
    summary: "Hướng dẫn toàn diện về khám phá 36 phố phường: tuyến đi bộ âm thanh, các trạm tập kết hỗ trợ du khách, ẩm thực ngõ nhỏ và phương tiện di chuyển trợ năng.",
    destinationSlugs: ["ho-guom", "nha-co-ma-may", "cho-dong-xuan", "o-quan-chuong"],
    related: ["tuyen-bo-hang-bac-ma-may", "nghe-thuyet-minh-den-ngoc-son", "tram-ho-tro-28-hang-buom", "chuan-bi-hanh-trinh"],
    sections: [
      {
        heading: "1. Bối cảnh không gian Phố Cổ và lưu ý định hướng",
        paragraphs: [
          "Khu Phố Cổ Hà Nội (quận Hoàn Kiếm) có cấu trúc mạng lưới ô cờ với nhiều ngõ nhỏ, nhà ống sâu và vỉa hè có độ cao không đồng đều. Người khiếm thị khi di chuyển cần chú ý âm thanh giao thông của xe máy, tiếng rao của hàng quán và vị trí của các cây cổ thụ ven đường.",
          "Hồ Hoàn Kiếm là tâm điểm định hướng tự nhiên dễ nhận biết nhất nhờ không gian thoáng đãng, tiếng chuông đồng hồ bưu điện và làn gió mát từ mặt hồ. Từ Bờ Hồ, bạn có thể dễ dàng tiếp cận các phố nghề truyền thống như Hàng Bạc, Hàng Buồm, Mã Mây.",
        ],
      },
      {
        heading: "2. Mạng lưới trạm tập kết hỗ trợ thực địa dưới 10 phút",
        paragraphs: [
          "WayEcho thiết lập mô hình điểm hẹn cố định tại các di tích trọng điểm: Trung tâm Văn hóa 28 Hàng Buồm, Tượng đài Cảm Tử (Bờ Hồ), Nhà cổ 87 Mã Mây và Chợ Đồng Xuân. Đây là những vị trí dễ tìm, có nhân sự hoặc tình nguyện viên hỗ trợ tiếp cận.",
          "Khi đặt dịch vụ đồng hành (Guide & Assistant), bạn nên chọn điểm hẹn gần nhất với hành trình dự kiến. Trong mô hình vận hành của WayEcho, mục tiêu kết nối tình nguyện viên hỗ trợ thực địa là dưới 10 phút từ thời điểm hẹn.",
        ],
      },
      {
        heading: "3. Thưởng thức ẩm thực và di chuyển trợ năng",
        paragraphs: [
          "Ẩm thực Phố Cổ mang đậm hương vị truyền thống, từ phở nước dùng ninh xương thơm mùi thảo quả đến cà phê trứng béo ngậy. Hãy ưu tiên các quán ăn có lối đi thoáng hoặc liên hệ trước để nhân viên hỗ trợ chỗ ngồi yên tĩnh.",
          "Về di chuyển, bạn có thể trải nghiệm xích lô trợ năng có bệ bước thấp, xe điện du lịch Phố Cổ đón trả quanh Bờ Hồ, hoặc đi bộ dọc theo các tuyến vỉa hè có gạch dò xúc giác quanh hồ Hoàn Kiếm.",
        ],
      },
    ],
  },

  // 2. CLUSTER 1: Tuyến bộ Hàng Bạc - Mã Mây
  {
    slug: "tuyen-bo-hang-bac-ma-may",
    title: "Hướng dẫn đi bộ âm thanh tuyến Hàng Bạc — Mã Mây",
    category: "Tuyến đi bộ âm thanh",
    summary: "Lộ trình đi bộ khám phá phố kim hoàn Hàng Bạc đến không gian di sản Mã Mây với các tín hiệu âm thanh định hướng đặc trưng.",
    destinationSlugs: ["dinh-kim-ngan", "nha-co-ma-may"],
    related: ["cam-nang-du-lich-pho-co", "kham-pha-nha-co-ma-may", "den-bach-ma-dinh-kim-ngan"],
    sections: [
      {
        heading: "1. Tín hiệu âm thanh trên phố kim hoàn Hàng Bạc",
        paragraphs: [
          "Phố Hàng Bạc đặc trưng bởi tiếng đe búa chạm khắc bạc lách cách phát ra từ các xưởng kim hoàn truyền thống. Tiếng búa gõ nhịp nhàng là cột mốc âm thanh tự nhiên giúp bạn nhận biết mình đang đi trên trục phố nghề di sản này.",
          "Tại số 42-44 Hàng Bạc là Đình Kim Ngân, nơi thờ ông tổ bách nghệ. Đình có khoảng sân yên ắng tách biệt hẳn với âm thanh náo nhiệt ngoài phố, rất thích hợp để dừng chân nghỉ ngơi.",
        ],
      },
      {
        heading: "2. Chuyển tiếp vào không gian phố Mã Mây",
        paragraphs: [
          "Từ ngã tư Hàng Bạc rẽ sang Mã Mây, nhịp phố thay đổi rõ rệt với mùi thơm của các món ăn địa phương và tiếng trò chuyện của du khách. Vỉa hè phố Mã Mây hẹp hơn, bạn nên dùng gậy dò sát mép tường nhà cổ để tránh xe máy dừng đỗ.",
          "Nhà cổ 87 Mã Mây nằm ở giữa phố với bậc tam cấp bằng đá xanh nhẵn bóng. Đây là điểm hẹn an toàn để nghe audio guide về kiến trúc nhà ống Hà Nội xưa.",
        ],
      },
      {
        heading: "3. Mẹo an toàn khi qua đường ngã tư",
        paragraphs: [
          "Các ngã tư trong Phố Cổ thường không có đèn tín hiệu âm thanh. Luôn lắng nghe tiếng động cơ xe máy giảm tốc độ hoặc yêu cầu người đi bộ cùng đường hỗ trợ khi qua ngã tư Hàng Bạc — Tạ Hiện.",
        ],
      },
    ],
  },

  // 3. CLUSTER 2: Thuyết minh Đền Ngọc Sơn & Bờ Hồ
  {
    slug: "nghe-thuyet-minh-den-ngoc-son",
    title: "Kinh nghiệm nghe thuyết minh âm thanh Đền Ngọc Sơn và Hồ Gươm",
    category: "Di tích & Thuyết minh",
    summary: "Cách cảm nhận không gian linh thiêng của Đền Ngọc Sơn qua cầu Thê Húc, tiếng sóng nước Hồ Gươm và bản audio guide chi tiết.",
    destinationSlugs: ["ho-guom"],
    related: ["cam-nang-du-lich-pho-co", "tham-quan-mua-roi-thang-long"],
    sections: [
      {
        heading: "1. Cảm nhận Cầu Thê Húc bằng xúc giác và âm thanh",
        paragraphs: [
          "Cầu Thê Húc bằng gỗ uốn cong nối bờ hồ sang đảo Ngọc Sơn. Khi bước chân lên mặt cầu, bạn sẽ cảm nhận độ dốc thoai thoải và tiếng gỗ vang nhẹ dưới bước gậy. Lan can cầu bằng gỗ tròn vừa tầm tay vịn.",
          "Gió hồ Hoàn Kiếm thổi qua mặt cầu mang theo hơi nước mát lành và tiếng lá liễu xào xạc ven bờ. Đây là trải nghiệm xúc giác và thính giác không thể bỏ qua.",
        ],
      },
      {
        heading: "2. Thuyết minh âm thanh về rùa Hồ Gươm và Đền Ngọc Sơn",
        paragraphs: [
          "Bên trong đền có bản audio guide thuyết minh chi tiết về tiêu bản Rùa Hồ Gươm, truyền thuyết vua Lê Lợi trả gươm báu và ý nghĩa của Đài Nghiên — Tháp Bút.",
          "Hãy đeo tai nghe một bên (tai mở) để vừa lắng nghe thuyết minh lịch sử, vừa giữ khả năng nhận biết môi trường xung quanh và các bậc tam cấp dẫn vào hậu cung.",
        ],
      },
      {
        heading: "3. Lối đi quanh hồ Hoàn Kiếm",
        paragraphs: [
          "Đường dạo quanh Hồ Gươm đã được lát đá hoa cương phẳng phiu và có các đoạn lát gạch xúc giác. Tuy nhiên, bạn cần chú ý các bồn hoa và rễ cây cổ thụ nhô lên gần mép hồ.",
        ],
      },
    ],
  },

  // 4. CLUSTER 3: Ô Quan Chưởng
  {
    slug: "trai-nghiem-o-quan-chuong",
    title: "Trải nghiệm âm thanh và lịch sử tại Cửa ô Quan Chưởng",
    category: "Di tích & Thuyết minh",
    summary: "Tìm hiểu cửa ô duy nhất còn lại của tòa thành Thăng Long xưa với vòm cổng đá cổ kính và nhịp sống phố cửa ô.",
    destinationSlugs: ["o-quan-chuong", "cho-dong-xuan"],
    related: ["cam-nang-du-lich-pho-co", "kinh-nghiem-cho-dong-xuan"],
    sections: [
      {
        heading: "1. Âm vang vòm cổng gạch đá vồ",
        paragraphs: [
          "Cửa ô Quan Chưởng được xây dựng từ năm 1749 bằng loại gạch vồ lớn và đá xám. Khi bạn đi dưới vòm cổng chính, âm thanh giọng nói và tiếng bước chân sẽ có độ dội âm (reverb) rất đặc trưng.",
          "Chạm tay vào các viên gạch vồ rêu phong ở chân cổng thành, bạn có thể cảm nhận bề mặt thô ráp nhuốm màu thời gian của chứng tích lịch sử Thăng Long - Hà Nội.",
        ],
      },
      {
        heading: "2. Giao điểm giữa phố Hàng Chiếu và Thanh Hà",
        paragraphs: [
          "Ô Quan Chưởng nằm ở nút giao của phố Hàng Chiếu, Thanh Hà và Đào Duy Từ. Nơi đây luôn nhộn nhịp tiếng người mua bán hàng đan lát, chiếu cói và các món quà sáng truyền thống như bún ốc, bánh rán cổ truyền.",
          "Vào buổi sáng sớm, không gian nơi đây trong trẻo với tiếng chim hót trên cây đa cổ thụ sát bên vọng lâu của cổng thành.",
        ],
      },
      {
        heading: "3. Hướng dẫn di chuyển an toàn",
        paragraphs: [
          "Cửa vòm chính hiện nay vẫn có người đi bộ và xe máy qua lại. Người khiếm thị nên đi sát lối vòm phụ hai bên để đảm bảo an toàn tuyệt đối.",
        ],
      },
    ],
  },

  // 5. CLUSTER 4: Nhà cổ 87 Mã Mây
  {
    slug: "kham-pha-nha-co-ma-may",
    title: "Khám phá không gian kiến trúc truyền thống Nhà cổ 87 Mã Mây",
    category: "Di tích & Thuyết minh",
    summary: "Cảm nhận cấu trúc nhà ống truyền thống, giếng trời thông gió và mùi gỗ lim cổ thụ tại di sản tiêu biểu của Phố Cổ.",
    destinationSlugs: ["nha-co-ma-may"],
    related: ["cam-nang-du-lich-pho-co", "tuyen-bo-hang-bac-ma-may"],
    sections: [
      {
        heading: "1. Cấu trúc nhà ống sâu và giếng trời thoáng đãng",
        paragraphs: [
          "Nhà cổ 87 Mã Mây xây dựng vào cuối thế kỷ XIX, là hình mẫu kinh điển của nhà phố cổ Thăng Long: mặt tiền hẹp nhưng lòng nhà kéo dài qua nhiều lớp sân trong (giếng trời).",
          "Khi bước từ gian ngoài vào khoảng giếng trời giữa nhà, bạn sẽ cảm nhận rõ sự thay đổi của luồng không khí mát mẻ, tiếng nước tí tách trong bể cảnh và ánh sáng tự nhiên rọi từ trên cao.",
        ],
      },
      {
        heading: "2. Trải nghiệm xúc giác với chất liệu gỗ lim",
        paragraphs: [
          "Cột nhà, vì kèo, cầu thang và hệ cửa bức bàn đều được làm từ gỗ lim và gỗ xoan cổ thụ. Bề mặt gỗ được bào nhẵn bóng, lưu giữ hương thơm dịu nhẹ của tinh dầu gỗ tự nhiên.",
          "Cầu thang gỗ lên tầng 2 có độ dốc khá cao đặc trưng của kiến trúc xưa. Nhân viên bảo tồn tại đây luôn sẵn sàng hỗ trợ bạn từng bước chân khi lên xuống.",
        ],
      },
      {
        heading: "3. Thuyết minh âm thanh và thưởng thức trà",
        paragraphs: [
          "Tại tầng 2 của nhà cổ có không gian thưởng trà sen truyền thống. Bạn có thể vừa nhâm nhi ngụm trà ấm thơm nồng, vừa nghe bản thuyết minh âm thanh về đời sống phong lưu của thương nhân Hà Nội xưa.",
        ],
      },
    ],
  },

  // 6. CLUSTER 5: Ẩm thực ngõ nhỏ Phố Cổ
  {
    slug: "am-thuc-ngo-nho-pho-co",
    title: "Thưởng thức cà phê trứng và ẩm thực ngõ nhỏ Phố Cổ Hà Nội",
    category: "Ẩm thực Phố Cổ",
    summary: "Hành trình vị giác và khứu giác: từ tách cà phê Giảng béo ngậy phố Nguyễn Hữu Huân đến bát phở Bát Đàn thơm nức ngõ nhỏ.",
    destinationSlugs: ["ho-guom", "nha-co-ma-may"],
    related: ["cam-nang-du-lich-pho-co", "kham-pha-nha-co-ma-may"],
    sections: [
      {
        heading: "1. Hương vị cà phê Giảng tại 39 Nguyễn Hữu Huân",
        paragraphs: [
          "Quán Cà phê Giảng nằm sâu trong một lối ngõ nhỏ trên phố Nguyễn Hữu Huân. Bước qua con ngõ râm mát, mùi thơm nồng nàn của cà phê rang xay quyện với mùi trứng đánh bông ngầy ngậy sẽ chào đón bạn.",
          "Tách cà phê trứng luôn được đặt trong một bát nước nóng để giữ ấm. Vị đắng đậm đà của cà phê Robusta cân bằng hoàn hảo với lớp bọt kem trứng mềm mịn, ngọt thanh như kem tươi.",
        ],
      },
      {
        heading: "2. Phở bò Bát Đàn và nghệ thuật nước dùng gia truyền",
        paragraphs: [
          "Phở Bát Đàn là biểu tượng ẩm thực của 36 phố phường. Bát phở nóng hổi bốc khói nghi ngút mang mùi thơm của hành hoa, gừng nướng, thảo quả và thịt bò tươi thái mỏng.",
          "Đối với người khiếm thị, nhân viên quán luôn ưu tiên xếp bàn ngồi thuận tiện và hỗ trợ bưng bê nước dùng nóng an toàn đến tận bàn.",
        ],
      },
      {
        heading: "3. Mẹo thưởng thức ẩm thực trong ngõ hẹp",
        paragraphs: [
          "Nên ghé các quán ăn nổi tiếng vào khung giờ tránh cao điểm (khoảng 9:30 sáng hoặc 14:30 chiều) để có không gian yên tĩnh hơn, dễ dàng trò chuyện và thưởng thức trọn vẹn hương vị.",
        ],
      },
    ],
  },

  // 7. CLUSTER 6: Trạm hỗ trợ 28 Hàng Buồm
  {
    slug: "tram-ho-tro-28-hang-buom",
    title: "Điểm tập kết hỗ trợ du khách 28 Hàng Buồm và mạng lưới TNV",
    category: "Dịch vụ & Trợ giúp",
    summary: "Tìm hiểu Trung tâm Văn hóa Nghệ thuật 28 Hàng Buồm — điểm hẹn đón trả trọng yếu của tình nguyện viên và Guide WayEcho.",
    destinationSlugs: ["den-bach-ma", "nha-co-ma-may"],
    related: ["cam-nang-du-lich-pho-co", "tuyen-bo-hang-bac-ma-may", "den-bach-ma-dinh-kim-ngan"],
    sections: [
      {
        heading: "1. Vị trí trung tâm và không gian tiếp cận",
        paragraphs: [
          "Tọa lạc tại số 28 Hàng Buồm (trước đây là Hội quán Quảng Đông), công trình đã được trùng tu thành Trung tâm Giao lưu Văn hóa Phố Cổ với lối vào rộng rãi, bằng phẳng và có bảo vệ trực tại cổng.",
          "Đây là vị trí hội tụ lý tưởng nằm giữa các tuyến phố di sản Hàng Buồm, Tạ Hiện, Mã Mây và Đền Bạch Mã, thuận tiện làm điểm xuất phát cho mọi tour đi bộ.",
        ],
      },
      {
        heading: "2. Quy trình kết nối hướng dẫn viên tình nguyện",
        paragraphs: [
          "Khi bạn đặt hẹn Guide hoặc Assistant qua WayEcho và chọn điểm tập kết 28 Hàng Buồm, thông tin sẽ được gửi tới mạng lưới tình nguyện viên đang trực trong bán kính 1km.",
          "Mục tiêu điều phối là kết nối nhân sự hỗ trợ tiếp cận bạn tại sảnh chờ 28 Hàng Buồm trong vòng dưới 10 phút. Tại đây có ghế ngồi nghỉ, nước uống và nhà vệ sinh sạch sẽ.",
        ],
      },
      {
        heading: "3. Trạm hỗ trợ tình huống khẩn cấp",
        paragraphs: [
          "Trong trường hợp gặp sự cố định hướng hoặc cần trợ giúp y tế nhẹ, 28 Hàng Buồm đóng vai trò như một trạm trú chân an toàn để nhân viên hỗ trợ thực địa tiếp cận bạn kịp thời.",
        ],
      },
    ],
  },

  // 8. CLUSTER 7: Xích lô trợ năng Phố Cổ
  {
    slug: "xich-lo-tro-nang-pho-co",
    title: "Kinh nghiệm đi xích lô trợ năng quanh Bờ Hồ và 36 phố phường",
    category: "Di chuyển tiếp cận",
    summary: "Thong dong dạo phố bằng phương tiện biểu tượng của Hà Nội với dịch vụ hỗ trợ lên xuống xe an toàn cho người nhìn kém và người mù.",
    destinationSlugs: ["ho-guom", "o-quan-chuong", "cho-dong-xuan"],
    related: ["cam-nang-du-lich-pho-co", "nghe-thuyet-minh-den-ngoc-son"],
    sections: [
      {
        heading: "1. Trải nghiệm dạo phố bằng xích lô",
        paragraphs: [
          "Ngồi trên xích lô với tốc độ di chuyển thong thả (khoảng 10-15 km/h), bạn có thể cảm nhận trọn vẹn nhịp đập của phố cổ: ngọn gió thoảng mát trên da, tiếng còi xe lanh lảnh và hương hoa sữa nồng nàn mùa thu.",
          "Ghế ngồi xích lô được thiết kế êm ái với mái che gập linh hoạt, cho phép bạn nghe rõ lời thuyết minh chỉ dẫn của người lái xe suốt chuyến đi.",
        ],
      },
      {
        heading: "2. Hỗ trợ lên xuống xe an toàn (Trợ năng DEMO)",
        paragraphs: [
          "Các dòng xích lô tham gia mô hình đối tác WayEcho được trang bị thêm bệ tỳ chân chống trượt và tay vịn chắc chắn. Người lái xe được tập huấn kỹ năng hỗ trợ người khiếm thị lên xuống an toàn.",
          "Điểm đón trả cố định được quy hoạch tại các vị trí vỉa hè hạ thấp như Quảng trường Đông Kinh Nghĩa Thục, Bến xe điện Bờ Hồ và cổng Chợ Đồng Xuân.",
        ],
      },
      {
        heading: "3. Lưu ý khi đặt xe",
        paragraphs: [
          "Hãy thông báo rõ nhu cầu hỗ trợ khi đặt lịch (ví dụ: cần người đỡ tay khi lên xe, có sử dụng gậy trắng) để được sắp xếp chuyến xe phù hợp nhất.",
        ],
      },
    ],
  },

  // 9. CLUSTER 8: Múa rối nước Thăng Long
  {
    slug: "tham-quan-mua-roi-thang-long",
    title: "Hướng dẫn tham quan và thưởng thức Nhà hát Múa rối Nước Thăng Long",
    category: "Văn hóa & Nghệ thuật",
    summary: "Thưởng thức nghệ thuật múa rối nước độc đáo qua thanh âm của dàn nhạc cụ dân tộc chèo, tiếng pháo té nước và mô tả âm thanh trực tiếp.",
    destinationSlugs: ["mua-roi-thang-long", "ho-guom"],
    related: ["cam-nang-du-lich-pho-co", "nghe-thuyet-minh-den-ngoc-son"],
    sections: [
      {
        heading: "1. Không gian âm nhạc dân gian sống động",
        paragraphs: [
          "Dù không nhìn thấy trực tiếp các chú rối gỗ biểu diễn trên mặt nước, thính giác của bạn sẽ được đánh thức trọn vẹn bởi dàn nhạc cụ dân tộc sống: tiếng trống khẩu rộn rã, tiếng đàn bầu da diết, tiếng đàn nhị réo rắt và giọng hát chèo ngọt ngào của các nghệ nhân.",
          "Tiếng nước tát rào rạt, tiếng pháo nổ giòn giã và tiếng cười sảng khoái của nhân vật chú Tễu tạo nên một bữa tiệc âm thanh dân gian độc nhất vô nhị.",
        ],
      },
      {
        heading: "2. Trải nghiệm xúc giác với con rối gỗ",
        paragraphs: [
          "Tại khu vực trưng bày trước giờ diễn, bạn có thể được chạm tay vào các chú rối làm bằng gỗ sung nhẹ, phủ sơn ta bóng bẩy để cảm nhận hình dáng chú Tễu búi tóc ba chỏm, con rồng phun nước hay cô tiên múa lụa.",
        ],
      },
      {
        heading: "3. Lối vào tiếp cận và vị trí ngồi ưu tiên",
        paragraphs: [
          "Nhà hát tọa lạc tại số 57B Đinh Tiên Hoàng, ngay sát Bờ Hồ. Lối vào sảnh chính có đường dốc cho xe lăn và nhân viên nhà hát luôn hỗ trợ dẫn đường du khách khiếm thị vào tận hàng ghế ưu tiên gần sân khấu.",
        ],
      },
    ],
  },

  // 10. CLUSTER 9: Đền Bạch Mã & Đình Kim Ngân
  {
    slug: "den-bach-ma-dinh-kim-ngan",
    title: "Tìm hiểu di sản Đền Bạch Mã và Đình Kim Ngân",
    category: "Di tích & Thuyết minh",
    summary: "Hành trình khám phá đền Trấn Đông Thăng Long tứ trấn tại Hàng Buồm và ngôi đình bách nghệ kim hoàn tại phố Hàng Bạc.",
    destinationSlugs: ["den-bach-ma", "dinh-kim-ngan"],
    related: ["cam-nang-du-lich-pho-co", "tuyen-bo-hang-bac-ma-may", "tram-ho-tro-28-hang-buom"],
    sections: [
      {
        heading: "1. Đền Bạch Mã — Thần trấn phương Đông của kinh thành",
        paragraphs: [
          "Tọa lạc tại 76 Hàng Buồm, Đền Bạch Mã thờ thần Long Đỗ — vị thần gắn liền với sự tích giúp vua Lý Thái Tổ xây đắp thành Thăng Long. Bước qua cánh cửa gỗ lớn, mùi hương trầm ngào ngạt và tiếng khánh đồng ngân vang tạo nên không khí trang nghiêm.",
          "Hệ thống khung gỗ lim với kỹ thuật chạm khắc rồng phượng tinh xảo mang phong cách thời Lê — Nguyễn là di sản quý giá được bảo tồn nguyên vẹn.",
        ],
      },
      {
        heading: "2. Đình Kim Ngân — Tinh hoa nghề chạm bạc Thăng Long",
        paragraphs: [
          "Đình Kim Ngân tại 42-44 Hàng Bạc không chỉ là nơi sinh hoạt tâm linh mà còn là bảo tàng sống của nghề kim hoàn. Bạn có thể nghe các nghệ nhân cao niên kể chuyện lịch sử đúc bạc và nghe biểu diễn ca trù vào các tối cuối tuần.",
        ],
      },
      {
        heading: "3. Hướng dẫn tham quan tiếp cận",
        paragraphs: [
          "Cả hai di tích đều có bậc cửa gỗ cao theo kiến trúc truyền thống. Hãy sử dụng đầu gậy trắng gõ nhẹ để định vị độ cao ngưỡng cửa trước khi bước qua.",
        ],
      },
    ],
  },

  // 11. CLUSTER 10: Chợ Đồng Xuân
  {
    slug: "kinh-nghiem-cho-dong-xuan",
    title: "Mẹo di chuyển an toàn và nhận diện âm thanh Chợ Đồng Xuân",
    category: "Kinh nghiệm thực địa",
    summary: "Hướng dẫn người khiếm thị định hướng âm thanh trong ngôi chợ truyền thống lớn nhất Phố Cổ và khám phá ngõ ẩm thực Đồng Xuân.",
    destinationSlugs: ["cho-dong-xuan"],
    related: ["cam-nang-du-lich-pho-co", "trai-nghiem-o-quan-chuong", "am-thuc-ngo-nho-pho-co"],
    sections: [
      {
        heading: "1. Không gian âm thanh sống động của chợ đầu mối",
        paragraphs: [
          "Chợ Đồng Xuân là bức tranh âm thanh đặc sắc nhất của Hà Nội: tiếng xe đẩy hàng ken két, tiếng tiểu thương mời chào, tiếng xé vải lách cách và tiếng mặc cả nhộn nhịp khắp các gian hàng.",
          "Mái vòm chợ cao tạo độ vang âm lớn, đòi hỏi bạn phải tập trung lắng nghe để nhận biết các lối đi chính và tránh va chạm với xe bốc dỡ hàng hóa.",
        ],
      },
      {
        heading: "2. Ngõ ẩm thực Đồng Xuân hấp dẫn",
        paragraphs: [
          "Ngay bên hông chợ là ngõ ẩm thực Đồng Xuân nổi tiếng với bún chả que tre nướng than hoa thơm nức, bánh tôm giòn rụm, chè sắn nóng hổi và chè xôi chè ngọt ngào.",
          "Ngõ ẩm thực hẹp và đông đúc, nên bạn hãy đi cùng hướng dẫn viên hoặc nhờ người bán hàng sắp xếp bàn ngồi đầu ngõ để dễ thưởng thức.",
        ],
      },
      {
        heading: "3. Điểm hẹn đón trả an toàn tại cổng chợ",
        paragraphs: [
          "Cổng chính phố Đồng Xuân có khoảng sân rộng và vỉa hè lát đá, là điểm đón trả xích lô và xe điện rất thuận lợi. Hãy hẹn người đón ngay tại chân đài phun nước hoặc cột cờ trước sảnh chợ.",
        ],
      },
    ],
  },

  // 12. CẨM NANG NỀN TẢNG 1 (Hiện có)
  {
    slug: "chuan-bi-hanh-trinh",
    title: "Chuẩn bị một chuyến đi khi thông tin tiếp cận còn thiếu",
    category: "Chuẩn bị hành trình",
    summary: "Từ nhu cầu cá nhân đến những câu hỏi cụ thể cho điểm đến, giúp bạn chuẩn bị mà không nhầm dữ liệu chưa biết với điều kiện đã được bảo đảm.",
    destinationSlugs: ["ho-guom", "nha-co-ma-may", "cho-dong-xuan"],
    related: ["cam-nang-du-lich-pho-co", "doc-du-lieu-tiep-can", "dung-wayecho-va-quyen-chia-se"],
    sections: [
      {
        heading: "Bắt đầu từ trải nghiệm bạn muốn có",
        paragraphs: [
          "Một chuyến đi có thể bắt đầu từ việc nghe câu chuyện về một di tích, đi dạo cùng người thân hoặc thưởng thức món ăn địa phương. Hãy chọn mục tiêu chính và khoảng thời gian phù hợp với bạn, rồi mới chọn các công cụ hỗ trợ. Bạn không cần sử dụng mọi chức năng chỉ vì chúng xuất hiện trên ứng dụng.",
          "Với một buổi tham quan Nhà cổ 87 Mã Mây, điều cần biết trước có thể là nơi gặp người đi cùng và cách tiếp cận nội dung thuyết minh. Với một cuộc dạo quanh Hồ Hoàn Kiếm, điều cần hỏi có thể là điểm đón trả và đoạn đường dự định đi. Đây là câu hỏi chuẩn bị, chưa phải khẳng định các nơi đó có sẵn hỗ trợ.",
        ],
      },
      {
        heading: "Chuyển nhu cầu thành câu hỏi có thể trả lời",
        paragraphs: [
          "Thay vì chỉ hỏi địa điểm có dễ tiếp cận hay không, hãy mô tả nhu cầu của mình. Bạn có thể hỏi lối vào nào đang mở, có nhân viên hướng dẫn từ điểm hẹn không, nội dung tham quan được truyền đạt bằng hình thức nào, và cần thông báo trước bao lâu. Một câu trả lời cụ thể giúp bạn quyết định tốt hơn một nhãn đánh giá chung.",
          "Chỉ chia sẻ những gì cần cho việc hỗ trợ. Bạn có thể nói mình cần hướng dẫn bằng lời tại lối vào mà không phải cung cấp toàn bộ hồ sơ tiếp cận. Hãy xác nhận người nhận thông tin và mục đích sử dụng trước khi gửi.",
        ],
      },
      {
        heading: "Chừa khoảng linh hoạt cho hành trình",
        paragraphs: [
          "Chuẩn bị một phương án quay lại hoặc đổi hoạt động nếu điều kiện thực tế khác thông tin trước chuyến đi. Lưu địa chỉ, điểm hẹn, liên hệ của người đi cùng và thông tin từ đơn vị quản lý trên thiết bị. Việc này không thay thế khảo sát thực địa nhưng giúp bạn có lựa chọn khi mất mạng.",
          "Bản đồ WayEcho hiện chỉ hỗ trợ tìm hiểu vị trí và các bước minh họa. Đừng dùng tuyến demo để qua đường hoặc xác định một lối đi an toàn. Hãy kết hợp kỹ năng di chuyển của bạn với sự hỗ trợ phù hợp tại nơi đến.",
        ],
      },
      {
        heading: "Kiểm tra lại trước khi khởi hành",
        paragraphs: [
          "Đọc nguồn và thời điểm cập nhật trong trang điểm đến. Giờ mở cửa, phạm vi tham quan và cách tổ chức hỗ trợ có thể thay đổi. Nếu chưa nhận được câu trả lời cho nhu cầu thiết yếu, hãy giữ trạng thái chưa xác nhận trong kế hoạch, thay vì coi việc gửi câu hỏi là đã được hỗ trợ.",
          "Bạn có thể bắt đầu bằng danh sách điểm đến bên dưới, đọc trạng thái dữ liệu và mở cẩm nang về cách hiểu thông tin tiếp cận. Quyết định cuối cùng dựa trên thông tin được xác nhận cho chuyến đi cụ thể của bạn.",
        ],
      },
    ],
  },

  // 13. CẨM NANG NỀN TẢNG 2 (Hiện có)
  {
    slug: "doc-du-lieu-tiep-can",
    title: "Đọc dữ liệu tiếp cận trước khi chọn điểm đến",
    category: "Thông tin tiếp cận",
    summary: "Hiểu đúng nguồn, thời điểm cập nhật và các nhãn chưa công bố, cần khảo sát để chủ động quyết định.",
    destinationSlugs: ["ho-guom", "nha-co-ma-may"],
    related: ["chuan-bi-hanh-trinh", "dung-wayecho-va-quyen-chia-se", "cam-nang-du-lich-pho-co"],
    sections: [
      {
        heading: "Địa điểm có thật không đồng nghĩa tiện ích đã xác nhận",
        paragraphs: [
          "Một địa chỉ chính xác, một bức ảnh đúng nơi chụp hoặc thông tin từ website đơn vị quản lý giúp bạn hiểu về điểm đến. Những dữ liệu đó chưa chứng minh có lối đi phù hợp, biển chữ nổi hay người hỗ trợ cho nhu cầu của bạn. WayEcho trình bày thông tin địa điểm và thông tin tiếp cận thành hai phần riêng để bạn kiểm tra.",
          "Ví dụ, trang Hồ Hoàn Kiếm có mô tả về cảnh quan và nguồn ảnh, trong khi lối không bậc vẫn cần khảo sát theo từng đoạn. Bạn có thể dùng mô tả để tìm hiểu địa điểm, nhưng chưa thể dùng nó làm căn cứ bảo đảm một tuyến đi bộ.",
        ],
      },
      {
        heading: "Phân biệt chưa biết với không có",
        paragraphs: [
          "Nhãn chưa công bố nghĩa là bản dữ liệu chưa có thông tin đủ để xác nhận. Nó không đồng nghĩa tiện ích chắc chắn không tồn tại. Nhãn cần khảo sát cũng không phải kết luận địa điểm không phù hợp: thông tin hiện chưa đủ để đưa ra kết luận đó.",
          "Khi một tiện ích quyết định khả năng tham quan của bạn, hãy hỏi đơn vị quản lý bằng một tình huống cụ thể. Sau khi nhận thông tin, kiểm tra nó áp dụng cho khu vực, ngày và giờ nào. Tránh suy rộng một câu trả lời cho toàn bộ khuôn viên.",
        ],
      },
      {
        heading: "Đọc nguồn và kiểm tra phạm vi",
        paragraphs: [
          "Mỗi nguồn có thể chỉ chứng minh một phần. Nguồn ảnh chứng minh bối cảnh hình ảnh; website điểm đến có thể công bố địa chỉ, lịch mở cửa hoặc nội dung thuyết minh. Không nên coi mọi trường trong cùng một thẻ đều đã được nguồn đó xác nhận.",
          "Thời điểm kiểm tra cho biết thông tin được đối chiếu khi nào, không phải cam kết nó còn đúng vào ngày bạn đến. Nếu không rõ phạm vi nguồn, hãy coi phần đó là cần hỏi thêm. WayEcho chưa cấp chứng nhận an toàn cho các điểm đến.",
        ],
      },
      {
        heading: "Dùng bộ lọc như điểm khởi đầu",
        paragraphs: [
          "Bộ lọc chỉ xét những trường dữ liệu hiện có. Không tìm thấy kết quả không có nghĩa Phố Cổ không có nơi đáp ứng nhu cầu đó. Nó có thể cho thấy bộ dữ liệu chưa đủ rộng hoặc chưa có căn cứ để gắn nhãn.",
          "Sau khi lọc, hãy mở trang chi tiết để đọc ghi chú, nguồn và giới hạn. Sau đó đối chiếu nhu cầu của bạn với câu trả lời của điểm đến, thay vì quyết định chỉ từ một badge hoặc một bức ảnh.",
        ],
      },
    ],
  },

  // 14. CẨM NANG NỀN TẢNG 3 (Hiện có)
  {
    slug: "dung-wayecho-va-quyen-chia-se",
    title: "Dùng WayEcho và kiểm soát thông tin hỗ trợ của bạn",
    category: "Hướng dẫn sử dụng",
    summary: "Phân biệt hồ sơ trên thiết bị, yêu cầu chia sẻ trong booking và giới hạn của công cụ demo.",
    destinationSlugs: ["ho-guom"],
    related: ["chuan-bi-hanh-trinh", "doc-du-lieu-tiep-can", "cam-nang-du-lich-pho-co"],
    sections: [
      {
        heading: "Hồ sơ ghi nhớ nhu cầu trên thiết bị",
        paragraphs: [
          "Hồ sơ tiếp cận giúp bạn lưu các tùy chọn thường dùng như chữ lớn, tốc độ đọc hoặc nhu cầu được hỗ trợ bằng lời. Ở phiên bản này, hồ sơ được lưu trong trình duyệt trên thiết bị. Nó chưa phải hồ sơ tài khoản đồng bộ giữa nhiều máy.",
          "Thiết lập một nhu cầu trong hồ sơ không đồng nghĩa mọi công cụ tương ứng đã được tích hợp. Hãy đọc phần giới hạn ở từng trang. Khi dùng máy chung, cân nhắc dữ liệu bạn để lại trong trình duyệt và không coi đăng xuất tài khoản là thao tác xóa hồ sơ cục bộ.",
        ],
      },
      {
        heading: "Mỗi yêu cầu có lựa chọn chia sẻ riêng",
        paragraphs: [
          "Khi tạo booking demo, bạn có thể chọn những nhu cầu cần cho lần sử dụng đó. Công tắc cho phép gửi yêu cầu tới Business là lựa chọn riêng: nếu tắt, server không tạo accessibility request từ nội dung hỗ trợ. Không cần gửi toàn bộ hồ sơ của bạn để thử một dịch vụ.",
          "Chỉ khi thao tác ghi dữ liệu thành công, website mới có cơ sở báo đã lưu. Nếu xuất hiện lỗi xác thực hoặc lưu trữ, yêu cầu chưa được xác nhận thành công. Việc đã lưu trong hệ thống demo vẫn chưa có nghĩa nhà cung cấp thật đã nhận hoặc đồng ý phục vụ.",
        ],
      },
      {
        heading: "Hiểu giới hạn của bản đồ, camera và SOS",
        paragraphs: [
          "Bản đồ giúp xem điểm đến có tọa độ và nghe cách điều hướng dự kiến hoạt động. Camera AI đang dùng ảnh mẫu và lời mô tả viết sẵn, chưa phân tích hình ảnh bạn chụp. Nhận diện giọng nói chỉ dùng được khi trình duyệt và thiết bị hỗ trợ.",
          "SOS chỉ xin vị trí sau khi bạn chủ động kích hoạt. Bản demo không gọi cứu hộ hoặc gửi vị trí tới đầu nhận thật. Khi cần hỗ trợ khẩn cấp thực tế, hãy dùng phương thức liên hệ khả dụng của thiết bị và người hỗ trợ tại chỗ.",
        ],
      },
      {
        heading: "Chủ động kiểm tra kết quả",
        paragraphs: [
          "Trong Đặt chỗ của tôi, hãy đọc đúng trạng thái từng bản ghi. Đang chờ, đã từ chối, đã hủy và DEMO có ý nghĩa khác nhau; không nên diễn giải tất cả thành đã xác nhận. Thông báo lỗi tải danh sách cũng khác với việc bạn không có booking.",
          "Bạn có thể quay về hồ sơ để xem tùy chọn đã lưu, mở cẩm nang chuẩn bị hành trình hoặc tìm hiểu các công cụ hỗ trợ tiếp cận. Website không tự gửi thông tin của bạn đến các tổ chức được dẫn nguồn trong cẩm nang.",
        ],
      },
    ],
  },
];

export function getArticle(slug) {
  return articles.find((a) => a.slug === slug) || null;
}
