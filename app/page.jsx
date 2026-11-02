import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import DestinationGallery from "@/components/DestinationGallery";
import { destinations } from "@/data/destinations";
import VerifiedImage from "@/components/VerifiedImage";
import InstallAppCard from "@/components/InstallAppCard";
import {
  AccessibleIcon,
  BedIcon,
  BookmarkIcon,
  BusIcon,
  CameraIcon,
  CompassIcon,
  FoodIcon,
  HeadphonesIcon,
  MapPinIcon,
  MicIcon,
  MuseumIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "@/components/Icons";

export const metadata = pageMetadata(
  "WayEcho — Du lịch Phố Cổ Hà Nội cho người khiếm thị",
  "Tìm hiểu điểm đến Phố Cổ Hà Nội, đối chiếu dữ liệu tiếp cận và chuẩn bị hành trình theo nhu cầu của bạn. Công cụ SOS, camera và booking có giới hạn demo.",
  "/"
);

const FALLBACK = "/assets/images/location-image-unavailable.svg";

const HOME_IMAGES = {
  hoGuom: {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Huc_Bridge.jpg",
    alt: "Cầu Thê Húc màu đỏ bắc qua Hồ Hoàn Kiếm, nối bờ hồ với khu đền Ngọc Sơn; cây xanh phủ quanh mặt hồ.",
  },
  oldQuarter: {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/31/Vietnam_hanoi_old_quarter.jpg",
    alt: "Một tuyến phố thuộc khu Phố cổ Hà Nội với cửa hàng hai bên, xe máy, người đi bộ và người bán hàng trên phố.",
  },
  pho: {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Ph%E1%BB%9F_b%C3%A1t_%C4%91%C3%A1.jpg",
    alt: "Một suất phở bát đá chụp tại Phố Cổ Hà Nội, gồm nước dùng nóng, bánh phở, thịt bò, rau và gia vị ăn kèm.",
  },
  trainStreet: {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Hanoi_train_street.jpg",
    alt: "Phố đường tàu Phố Cổ Hà Nội với đường ray chạy giữa khu dân cư, cây xanh, quán nhỏ và cờ Việt Nam treo bên lối đi.",
  },
  nhaCoMaMay: {
    src: "/assets/images/pho-co-alley.jpg",
    alt: "Không gian Nhà cổ 87 Mã Mây với kiến trúc nhà ống truyền thống của Phố Cổ Hà Nội.",
  },
  choDongXuan: {
    src: "/assets/images/wet-market.jpg",
    alt: "Khuôn viên Chợ Đồng Xuân tấp nập tại trung tâm thương mại lịch sử Phố Cổ Hà Nội.",
  },
  navigation: {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/43/Smartphone_with_navigation_map_app.jpg",
    alt: "Một bàn tay cầm điện thoại thông minh đang mở ứng dụng bản đồ điều hướng; ảnh minh họa cho chức năng chỉ đường.",
  },
  camera: {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/16/A_man_using_a_cell_phone_to_take_a_photo.jpg",
    alt: "Một người đang dùng điện thoại để chụp ảnh; ảnh minh họa cho chức năng trợ lý camera của WayEcho.",
  },
  humanSupport: {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/dc/O%26M_instructor.jpg",
    alt: "Một buổi hướng dẫn định hướng và di chuyển, trong đó người hướng dẫn đứng cạnh người đang thực hành sử dụng gậy trắng; ảnh minh họa cho hỗ trợ con người.",
  },
};

const needCards = [
  { icon: AccessibleIcon, label: "Thông tin\nđiểm đến", href: "/explore", tone: "bg-[#41b866]" },
  { icon: BedIcon, label: "Lưu trú\nDEMO", href: "/explore?cat=accommodation", tone: "bg-[#4d83cc]" },
  { icon: BusIcon, label: "Di chuyển\nDEMO", href: "/explore?cat=transport", tone: "bg-[#f56f41]" },
  { icon: FoodIcon, label: "Ẩm thực\nđịa phương", href: "/explore?cat=restaurant", tone: "bg-[#ea5973]" },
  { icon: MuseumIcon, label: "Trải nghiệm\nvăn hóa", href: "/explore?cat=activity", tone: "bg-[#8d62d8]" },
  { icon: UserIcon, label: "Guide &\nAssistant", href: "/item?id=demo-guide-tour", tone: "bg-[#eea22e]" },
];

const destinationCards = destinations.slice(0, 4).map((d) => ({
  title: d.name,
  area: d.area,
  image: { src: d.image, alt: d.alt },
  facts: [d.access.status],
  badge: d.access.level,
  badgeClass: "bg-amber-100 text-amber-950",
  href: `/destination?d=${d.slug}`,
}));

const featureCards = [
  {
    icon: MicIcon,
    title: "Tìm kiếm bằng giọng nói",
    desc: "Nói khi thiết bị hỗ trợ hoặc nhập bằng bàn phím để tìm điểm đến và dịch vụ trong dữ liệu hiện có.",
    tone: "bg-[#ff6b2c]",
  },
  {
    icon: AccessibleIcon,
    title: "Thông tin tiếp cận rõ ràng",
    desc: "Đối chiếu nguồn và trạng thái dữ liệu. Tiện ích chưa xác minh luôn được ghi rõ để bạn chủ động hỏi trước.",
    tone: "bg-[#397ecb]",
  },
  {
    icon: CompassIcon,
    title: "Chỉ đường & cảnh báo",
    desc: "Xem vị trí điểm đến và nghe các bước minh họa. Chưa có tuyến đường hoặc cảnh báo chướng ngại thời gian thực.",
    tone: "bg-[#35a356]",
  },
  {
    icon: UserIcon,
    title: "Trợ lý tại điểm đến",
    desc: "Xem quy trình Guide & Assistant ở chế độ demo; hiện chưa có nhân sự được phân công hỗ trợ thực tế.",
    tone: "bg-[#8a5bd2]",
  },
];

const journeyAssist = [
  {
    image: HOME_IMAGES.navigation,
    icon: CompassIcon,
    title: "Chỉ đường tiếp cận Phố Cổ",
    desc: "Bản đồ vị trí và lời đọc minh họa; chưa phải chỉ đường an toàn thời gian thực.",
    href: "/navigation",
  },
  {
    image: HOME_IMAGES.camera,
    icon: CameraIcon,
    title: "Trợ lý camera / AI Vision",
    desc: "Xem mô tả ảnh mẫu. Bản hiện tại chưa có AI/OCR thật hoặc tư vấn viên trực.",
    href: "/assistant",
  },
  {
    image: HOME_IMAGES.humanSupport,
    icon: UserIcon,
    title: "Điểm hẹn Guide & Assistant — DEMO",
    desc: "Xem các điểm hẹn minh họa tại Phố cổ; hiện chưa có hướng dẫn viên hoặc trợ lý được phân công thực tế.",
    href: "/item?id=demo-guide-tour",
  },
];

const processSteps = [
  { n: "1", icon: SearchIcon, title: "Khám phá", desc: "Tìm kiếm điểm đến, xem thông tin và hình ảnh bằng giọng nói." },
  { n: "2", icon: AccessibleIcon, title: "Kiểm tra tiếp cận", desc: "Xem mức độ tiếp cận, lối đi phù hợp và các tiện ích hỗ trợ tại điểm đến." },
  { n: "3", icon: MuseumIcon, title: "Đặt dịch vụ & hỗ trợ", desc: "Đặt vé, đặt Guide/Assistant hoặc các dịch vụ hỗ trợ cần thiết." },
  { n: "4", icon: MapPinIcon, title: "Trải nghiệm điểm đến", desc: "Tự tin khám phá, tận hưởng văn hóa, ẩm thực và những điều tuyệt vời của Phố Cổ Hà Nội." },
];

const stories = [
  {
    initial: "M",
    quote: "“Nhờ WayEcho, mình có thể tự tìm đường đến Hồ Gươm và nghe thuyết minh bằng giọng nói. Cảm giác thật sự tự do và chủ động hơn rất nhiều!”",
    name: "Minh Đức",
    role: "Người khiếm thị",
  },
  {
    initial: "T",
    quote: "“Tôi nhìn kém nên thường lo lắng khi đi chỗ lạ. WayEcho giúp tôi kiểm tra trước mức độ tiếp cận và đặt hỗ trợ khi cần. Nhờ vậy, tôi tự tin khám phá Phố Cổ Hà Nội hơn rất nhiều.”",
    name: "Thu Hà",
    role: "Người nhìn kém",
  },
  {
    initial: "H",
    quote: "“Là thành viên cộng đồng, tôi rất vui khi thấy WayEcho tạo ra một cầu nối ý nghĩa. Tôi đã có cơ hội đồng hành cùng nhiều bạn, cùng khám phá Phố Cổ Hà Nội theo cách trọn vẹn hơn.”",
    name: "Anh Hùng",
    role: "Thành viên cộng đồng",
  },
];

function RoundIcon({ children, className = "" }) {
  return <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${className}`}>{children}</span>;
}

export default function HomePage() {
  return (
    <div className="home-page hc-surface">
      {/* Lối tắt nhảy nhanh 4 vùng chức năng cho bàn phím & Screen Reader (B-02) */}
      <nav
        aria-label="Lối tắt truy cập nhanh 4 vùng chức năng trang chủ"
        className="sr-only focus-within:not-sr-only focus-within:relative focus-within:z-50 focus-within:block focus-within:border-b-2 focus-within:border-primary focus-within:bg-black focus-within:p-4 focus-within:text-white"
      >
        <p className="font-bold text-lg mb-2">Chuyển nhanh tới vùng chức năng chính:</p>
        <div className="flex flex-wrap gap-4">
          <a href="#home-search" className="rounded-lg bg-primary px-3 py-2 text-ink font-bold focus:outline-none focus:ring-4 focus:ring-white">
            [1. Tìm kiếm bằng giọng nói]
          </a>
          <a href="#home-destinations" className="rounded-lg bg-primary px-3 py-2 text-ink font-bold focus:outline-none focus:ring-4 focus:ring-white">
            [2. Địa điểm Phố Cổ]
          </a>
          <a href="#home-camera" className="rounded-lg bg-primary px-3 py-2 text-ink font-bold focus:outline-none focus:ring-4 focus:ring-white">
            [3. Trợ lý Camera & Điều hướng]
          </a>
          <a href="#home-guide" className="rounded-lg bg-primary px-3 py-2 text-ink font-bold focus:outline-none focus:ring-4 focus:ring-white">
            [4. Đặt HDV & Trợ lý đồng hành]
          </a>
        </div>
      </nav>

      {/* VÙNG 1: TÌM KIẾM & ĐIỀU KHIỂN GIỌNG NÓI */}
      <section id="home-search" aria-label="Vùng 1: Tìm kiếm & Điều khiển giọng nói" className="container-page pb-8 pt-8 lg:pb-10 lg:pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-12">
          <div>
            <span className="chip hc-surface hc-border">
              <AccessibleIcon size={16} /> Thiết kế cho người khiếm thị
            </span>
            <h1 className="mt-5 max-w-[650px] text-5xl leading-[.98] sm:text-6xl lg:text-[68px]">
              Du lịch Phố Cổ Hà Nội,<br />dẫn lối <span className="text-[#eb5d27]">bằng giọng nói</span>
            </h1>
            <p className="hc-muted mt-5 max-w-[650px] text-[18px] leading-8 text-ink-soft">
              WayEcho giúp người khiếm thị khám phá Phố Cổ Hà Nội dễ dàng hơn bằng giọng nói. Bạn có thể tìm kiếm thông tin, xem khả năng tiếp cận, đặt dịch vụ, nhờ hỗ trợ và trải nghiệm các điểm đến tại Phố Cổ Hà Nội cùng những công cụ hỗ trợ phù hợp.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="/search" className="btn-primary min-h-[56px] px-6 text-base font-bold sm:text-lg shadow-card">
                <MicIcon size={24} /> Bắt đầu bằng giọng nói
              </Link>
              <Link href="/assistant" className="btn-ghost hc-border min-h-[56px] px-6 text-base font-bold sm:text-lg">
                <CameraIcon size={24} /> Mở trợ lý camera
              </Link>
            </div>
            <p className="hc-muted mt-5 flex items-center gap-3 text-sm italic text-ink-soft">
              <span aria-hidden="true" className="inline-block h-[4px] w-10 rounded-full bg-primary" /> Phố Cổ Hà Nội gần hơn, cho mọi người
            </p>
          </div>

          <div className="grid min-h-[430px] grid-cols-2 grid-rows-2 gap-3" aria-label="Một số hình ảnh thật về Phố Cổ Hà Nội">
            <Link href="/destination?d=ho-guom" className="group relative row-span-1 overflow-hidden rounded-[24px] shadow-card lg:row-span-2">
              <VerifiedImage src={HOME_IMAGES.hoGuom.src} fallback={FALLBACK} alt={HOME_IMAGES.hoGuom.alt} priority className="h-full min-h-[250px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/60 px-4 py-3 text-white backdrop-blur-sm">
                <span className="flex items-center gap-2 font-bold"><MapPinIcon size={18} /> Hồ Gươm</span>
                <span className="block pl-6 text-xs text-white/85">Biểu tượng của Phố Cổ Hà Nội</span>
              </span>
            </Link>
            <Link href="/destination?d=nha-co-ma-may" className="group relative overflow-hidden rounded-[24px] shadow-card">
              <VerifiedImage src={HOME_IMAGES.nhaCoMaMay.src} fallback={FALLBACK} alt={HOME_IMAGES.nhaCoMaMay.alt} className="h-full min-h-[205px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/60 px-3 py-2.5 text-white backdrop-blur-sm">
                <span className="flex items-center gap-2 font-bold"><MapPinIcon size={17} /> Nhà cổ Mã Mây</span>
                <span className="block pl-6 text-[11px] text-white/85">Nét xưa giữa lòng phố cổ</span>
              </span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <figure className="relative overflow-hidden rounded-[22px] shadow-card">
                <VerifiedImage src={HOME_IMAGES.pho.src} fallback={FALLBACK} alt={HOME_IMAGES.pho.alt} className="h-full min-h-[205px] w-full object-cover" />
                <figcaption className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-2.5 py-2 text-white backdrop-blur-sm">
                  <span className="font-bold">Ẩm thực Phố Cổ</span>
                  <span className="block text-[10px] text-white/85">Hương vị đậm đà</span>
                </figcaption>
              </figure>
              <figure className="relative overflow-hidden rounded-[22px] shadow-card">
                <VerifiedImage src={HOME_IMAGES.trainStreet.src} fallback={FALLBACK} alt={HOME_IMAGES.trainStreet.alt} className="h-full min-h-[205px] w-full object-cover" />
                <figcaption className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-2.5 py-2 text-white backdrop-blur-sm">
                  <span className="font-bold">Đường tàu Phố Cổ</span>
                  <span className="block text-[10px] text-white/85">Trải nghiệm độc đáo</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Thanh tìm kiếm âm thanh & gợi ý nhanh */}
        <div className="mt-8 rounded-[22px] border border-line bg-white p-5 shadow-card hc-surface hc-border sm:p-7">
          <h2 className="text-3xl font-bold">Bạn muốn khám phá Phố Cổ Hà Nội như thế nào?</h2>
          <p className="hc-muted mt-1 text-ink-soft">Nhận trợ giúp bằng giọng nói, tìm thông tin, kiểm tra khả năng tiếp cận và đặt dịch vụ phù hợp với nhu cầu của bạn.</p>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/search" className="flex min-h-[56px] flex-1 items-center gap-3 rounded-2xl border border-line bg-white px-4 text-left text-ink-soft shadow-sm hc-surface hc-border">
              <SearchIcon size={22} /> <span>Bạn muốn đi đâu, làm gì ở Phố Cổ Hà Nội?</span>
            </Link>
            <Link href="/search" aria-label="Tìm bằng giọng nói" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-ink shadow-card">
              <MicIcon size={24} />
            </Link>
            <Link href="/assistant" aria-label="Mở trợ lý camera" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4ead7] text-ink shadow-card">
              <CameraIcon size={24} />
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">Gợi ý nhanh Phố Cổ:</span>
            {["Hồ Gươm", "Nhà cổ Mã Mây", "Chợ Đồng Xuân", "Ô Quan Chưởng", "Cà phê Giảng", "Đền Bạch Mã", "Đình Kim Ngân"].map((label) => (
              <Link key={label} href={`/search?q=${encodeURIComponent(label)}`} className="rounded-full bg-surface-alt px-4 py-2 font-semibold hover:underline">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Danh mục dịch vụ tiếp cận */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-3xl font-bold">Chọn theo nhu cầu</h2>
            <p className="hc-muted mt-1 text-ink-soft">Lựa chọn nhanh các dịch vụ và thông tin phù hợp với hành trình của bạn.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {needCards.map(({ icon: Icon, label, href, tone }) => (
              <Link key={label} href={href} className="group flex min-h-[108px] items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover hc-surface hc-border lg:flex-col lg:items-start">
                <RoundIcon className={tone}><Icon size={23} /></RoundIcon>
                <span className="whitespace-pre-line font-bold leading-tight">{label}</span>
                <span aria-hidden="true" className="ml-auto text-xl lg:hidden">›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VÙNG 2: ĐỊA ĐIỂM PHỐ CỔ TIẾP CẬN */}
      <section id="home-destinations" aria-label="Vùng 2: Địa điểm Phố Cổ tiếp cận" className="border-y border-line bg-[#fffaf2] py-12 hc-surface hc-border">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-4xl font-bold">Điểm đến Phố Cổ Hà Nội tiếp cận</h2>
              <p className="hc-muted mt-1 text-ink-soft">100% điểm đến nằm trong phạm vi Phố Cổ Hoàn Kiếm với thông tin tiếp cận đã được gắn nhãn minh bạch.</p>
            </div>
            <Link href="/destination" className="btn-ghost hc-border min-h-[48px] px-5 py-2 font-bold text-sm">
              Xem toàn bộ 7 điểm đến Phố Cổ ›
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinationCards.map((card) => (
              <Link key={card.title} href={card.href} className="overflow-hidden rounded-[20px] border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover hc-surface hc-border">
                <VerifiedImage src={card.image.src} fallback={FALLBACK} alt={card.image.alt} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-[24px] font-bold">{card.title}</h3>
                  <p className="hc-muted mt-2 flex items-center gap-2 text-sm text-ink-soft">
                    <MapPinIcon size={17} /> {card.area}
                  </p>
                  <ul className="hc-muted mt-2 space-y-1 text-sm text-ink-soft">
                    {card.facts.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <AccessibleIcon size={17} /> {f}
                      </li>
                    ))}
                  </ul>
                  <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <DestinationGallery destinations={destinations} />
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-sm hc-surface hc-border">
            <h3 className="text-2xl font-bold">Chuẩn bị trước khi đi</h3>
            <p className="mt-2 text-ink-soft hc-muted">Tìm hiểu cách đọc dữ liệu tiếp cận, chọn thông tin muốn chia sẻ và chuẩn bị câu hỏi cho điểm đến Phố Cổ.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link className="btn-primary min-h-[48px] px-5 font-bold" href="/articles">Đọc cẩm nang Phố Cổ</Link>

            </div>
          </div>
        </div>
      </section>

      {/* VÙNG 3: TRỢ LÝ CAMERA & ĐIỀU HƯỚNG */}
      <section id="home-camera" aria-label="Vùng 3: Trợ lý Camera & Điều hướng" className="container-page py-12">
        <h2 className="text-4xl font-bold">Trợ lý <span className="text-[#eb5d27]">trong hành trình</span></h2>
        <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">Công nghệ và con người cùng đồng hành, giúp bạn tự tin khám phá Phố Cổ Hà Nội theo cách của riêng mình.</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {journeyAssist.map(({ image, icon: Icon, title, desc, href }) => (
            <article key={title} className="overflow-hidden rounded-[22px] border border-line bg-white shadow-card hc-surface hc-border">
              <VerifiedImage src={image.src} fallback={FALLBACK} alt={image.alt} className="h-56 w-full object-cover" />
              <div className="flex gap-4 p-5">
                <RoundIcon className="bg-[#f48627]"><Icon size={24} /></RoundIcon>
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">{desc}</p>
                </div>
                <Link href={href} aria-label={`Mở ${title}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-alt text-xl font-bold">
                  →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Nút fallback kết nối tư vấn viên */}
        <div className="mt-6 rounded-[22px] border border-amber-300 bg-amber-50 p-6 text-amber-950">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">AI không chắc chắn về môi trường thực tế?</h3>
              <p className="mt-1 text-sm text-amber-900">
                Camera và điều hướng chỉ là công cụ hỗ trợ. Bản demo chưa có tư vấn viên trực; tín hiệu SOS không được chuyển tới lực lượng cứu hộ.
              </p>
            </div>
            <Link href="/sos" className="btn-primary min-h-[56px] px-6 text-base font-bold shrink-0 shadow-md">
              <PhoneIcon size={20} /> Mở SOS demo
            </Link>
          </div>
        </div>

        {/* Tính năng nổi bật */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ icon: Icon, title, desc, tone }) => (
            <article key={title} className="rounded-2xl border border-line bg-white p-5 shadow-card hc-surface hc-border">
              <RoundIcon className={tone}><Icon size={23} /></RoundIcon>
              <h3 className="mt-4 text-[22px] font-bold">{title}</h3>
              <p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* VÙNG 4: ĐẶT HDV & TRỢ LÝ ĐỒNG HÀNH */}
      <section id="home-guide" aria-label="Vùng 4: Đặt HDV & Trợ lý đồng hành" className="border-t border-line bg-[#fffdf8] py-12 hc-surface hc-border">
        <div className="container-page">
          <div className="rounded-[22px] border border-line bg-white p-5 shadow-card hc-surface hc-border sm:p-7">
            <h2 className="text-4xl font-bold">Hành trình đồng hành với <span className="text-[#eb5d27]">WayEcho</span></h2>
            <p className="hc-muted mt-1 text-ink-soft">Chỉ 4 bước đơn giản để bắt đầu hành trình khám phá Phố Cổ Hà Nội dễ dàng hơn.</p>
            <ol className="mt-6 grid gap-5 lg:grid-cols-4">
              {processSteps.map(({ n, icon: Icon, title, desc }) => (
                <li key={n} className="relative flex gap-4 lg:block">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fff3e0] text-[#ee7d20]">
                    <Icon size={28} />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-ink">{n}</span>
                  </div>
                  <div className="lg:mt-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">{desc}</p>
                  </div>
                  {n !== "4" && <span aria-hidden="true" className="absolute right-0 top-6 hidden text-3xl text-primary lg:block">›</span>}
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-4 border-t border-line flex flex-wrap gap-4">
              <Link href="/booking" className="btn-primary min-h-[56px] px-6 text-base font-bold shadow-md">
                Đặt Guide & Assistant tại Phố Cổ (DEMO)
              </Link>
              <Link href="/my-booking" className="btn-ghost hc-border min-h-[56px] px-6 text-base font-bold">
                Kiểm tra đặt chỗ của tôi
              </Link>
            </div>
          </div>

          {/* Tình huống minh họa */}
          <div className="mt-8" aria-labelledby="stories-heading">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 id="stories-heading" className="text-4xl font-bold">Những <span className="text-[#eb5d27]">tình huống minh họa</span></h2>
                <p className="hc-muted mt-1 text-ink-soft">Nội dung mẫu để minh họa nhu cầu sử dụng, không phải đánh giá của khách hàng đã được xác minh.</p>
              </div>
              <Link href="/review" className="btn-ghost hc-border !min-h-[44px] !px-5 !py-2 text-sm font-bold">
                Viết đánh giá trải nghiệm →
              </Link>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {stories.map((story) => (
                <article key={story.name} className="rounded-2xl border border-line bg-white p-5 shadow-card hc-surface hc-border">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f3e3c5] text-xl font-bold text-[#8b5b12]" aria-hidden="true">
                      {story.initial}
                    </div>
                    <div>
                      <p className="text-sm leading-6 text-ink-soft hc-muted">{story.quote}</p>
                      <p className="mt-3 font-bold">{story.name}</p>
                      <p className="text-sm text-ink-soft hc-muted">{story.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Cài đặt Ứng dụng PWA (B-03) — Thay thế nút App Store / Google Play gây hiểu nhầm */}
          <div className="mt-10" id="install-pwa">
            <InstallAppCard />
          </div>

          {/* Trợ giúp & Liên hệ */}
          <div className="mt-8 rounded-[22px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
            <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <h2 className="text-4xl font-bold">Cần hỗ trợ thêm?</h2>
                <p className="hc-muted mt-1 text-ink-soft">Chúng tôi luôn sẵn sàng đồng hành cùng bạn trong hành trình khám phá Phố Cổ Hà Nội.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Link href="/help" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border">
                  <RoundIcon className="bg-[#dceaff] text-[#3d73bc]"><span aria-hidden="true" className="text-xl">▤</span></RoundIcon>
                  <div>
                    <h3 className="text-base font-bold">Xem hướng dẫn sử dụng</h3>
                    <p className="hc-muted mt-1 text-xs text-ink-soft">Tìm hiểu cách dùng WayEcho trên điện thoại.</p>
                  </div>
                </Link>
                <Link href="/sos" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 hover:bg-red-100 hc-border">
                  <RoundIcon className="bg-red-600 text-white"><PhoneIcon size={20} /></RoundIcon>
                  <div>
                    <h3 className="text-base font-bold text-red-900">SOS demo</h3>
                    <p className="mt-1 text-xs text-red-800">Chỉ lưu tín hiệu demo; không gọi cứu hộ.</p>
                  </div>
                </Link>
                <Link href="/guide/login" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border">
                  <RoundIcon className="bg-[#ffe9ca] text-[#d57d0a]"><UserIcon size={21} /></RoundIcon>
                  <div>
                    <h3 className="text-base font-bold">Kênh Guide & Trợ lý</h3>
                    <p className="hc-muted mt-1 text-xs text-ink-soft">Dành cho hướng dẫn viên thực địa.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

