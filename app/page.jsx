import Link from "next/link";
import VerifiedImage from "@/components/VerifiedImage";
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
  SearchIcon,
  SpeakerIcon,
  UserIcon,
} from "@/components/Icons";

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
    alt: "Một suất phở bát đá chụp tại Hà Nội, gồm nước dùng nóng, bánh phở, thịt bò, rau và gia vị ăn kèm.",
  },
  trainStreet: {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Hanoi_train_street.jpg",
    alt: "Phố đường tàu Hà Nội với đường ray chạy giữa khu dân cư, cây xanh, quán nhỏ và cờ Việt Nam treo bên lối đi.",
  },
  vanMieu: {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg",
    alt: "Khuôn viên Văn Miếu – Quốc Tử Giám tại Hà Nội với cổng kiến trúc truyền thống, mái ngói và cây xanh.",
  },
  westLake: {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/09/West_Lake_Hanoi.jpg",
    alt: "Mặt nước Hồ Tây nhìn từ khu vực Phủ Tây Hồ, phía xa là dải đô thị Hà Nội dưới bầu trời sáng.",
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
  { icon: AccessibleIcon, label: "Điểm đến\ndễ tiếp cận", href: "/explore", tone: "bg-[#41b866]" },
  { icon: BedIcon, label: "Lưu trú\nthân thiện", href: "/explore", tone: "bg-[#4d83cc]" },
  { icon: BusIcon, label: "Di chuyển\nthuận tiện", href: "/explore", tone: "bg-[#f56f41]" },
  { icon: FoodIcon, label: "Ẩm thực\nđịa phương", href: "/explore", tone: "bg-[#ea5973]" },
  { icon: MuseumIcon, label: "Trải nghiệm\nvăn hóa", href: "/explore", tone: "bg-[#8d62d8]" },
  { icon: UserIcon, label: "Guide &\nAssistant", href: "/guide/login", tone: "bg-[#eea22e]" },
];

const destinationCards = [
  {
    title: "Hồ Gươm & Cầu Thê Húc",
    area: "Quận Hoàn Kiếm",
    image: HOME_IMAGES.hoGuom,
    facts: ["Lối đi ven hồ", "Nhiều ghế nghỉ"],
    badge: "Dễ tiếp cận",
    badgeClass: "bg-[#dff5e5] text-[#16733b]",
    href: "/item?slug=ho-guom",
  },
  {
    title: "Văn Miếu – Quốc Tử Giám",
    area: "Quận Đống Đa",
    image: HOME_IMAGES.vanMieu,
    facts: ["Khuôn viên yên tĩnh", "Có thuyết minh"],
    badge: "Tiếp cận trung bình",
    badgeClass: "bg-[#fff0cf] text-[#a76500]",
    href: "/item?slug=van-mieu",
  },
  {
    title: "Phố cổ Hà Nội",
    area: "Quận Hoàn Kiếm",
    image: HOME_IMAGES.oldQuarter,
    facts: ["Nhiều âm thanh", "Cần hỗ trợ định hướng"],
    badge: "Cần hỗ trợ",
    badgeClass: "bg-[#ffe0dc] text-[#a33a2f]",
    href: "/item?slug=pho-co",
  },
  {
    title: "Hồ Tây & làng ven hồ",
    area: "Quận Tây Hồ",
    image: HOME_IMAGES.westLake,
    facts: ["Không gian thoáng", "Phù hợp dạo nhẹ"],
    badge: "Dễ tiếp cận",
    badgeClass: "bg-[#dff5e5] text-[#16733b]",
    href: "/item?slug=ho-tay",
  },
];

const featureCards = [
  {
    icon: MicIcon,
    title: "Tìm kiếm bằng giọng nói",
    desc: "Chỉ cần nói những gì bạn quan tâm, WayEcho sẽ giúp bạn tìm điểm đến, dịch vụ và thông tin phù hợp.",
    tone: "bg-[#ff6b2c]",
  },
  {
    icon: AccessibleIcon,
    title: "Thông tin tiếp cận rõ ràng",
    desc: "Xem chi tiết lối đi, nhà vệ sinh, mức độ hỗ trợ và các tiện ích ngay trên mỗi địa điểm.",
    tone: "bg-[#397ecb]",
  },
  {
    icon: CompassIcon,
    title: "Chỉ đường & cảnh báo",
    desc: "Nhận chỉ dẫn phù hợp với nhu cầu của bạn, cùng các cảnh báo về địa hình, chướng ngại vật trên đường.",
    tone: "bg-[#35a356]",
  },
  {
    icon: UserIcon,
    title: "Trợ lý tại điểm đến",
    desc: "Hướng dẫn chi tiết, gợi ý trải nghiệm phù hợp và hỗ trợ nhanh khi bạn cần giúp đỡ.",
    tone: "bg-[#8a5bd2]",
  },
];

const journeyAssist = [
  {
    image: HOME_IMAGES.navigation,
    icon: CompassIcon,
    title: "Chỉ đường tiếp cận",
    desc: "Hướng dẫn từng bước bằng giọng nói và cảnh báo theo dữ liệu hiện có về lối đi, chướng ngại vật, lối tiếp cận phù hợp.",
    href: "/navigation",
  },
  {
    image: HOME_IMAGES.camera,
    icon: CameraIcon,
    title: "Trợ lý camera",
    desc: "Đọc chữ, mô tả khung cảnh xung quanh và hỗ trợ người nhìn kém nhận biết thông tin trực quan một cách dễ dàng.",
    href: "/assistant",
  },
  {
    image: HOME_IMAGES.humanSupport,
    icon: UserIcon,
    title: "Hỗ trợ con người",
    desc: "Kết nối với Guide/Assistant địa phương khi bạn cần hỗ trợ trực tiếp trong chuyến đi, để hành trình luôn an toàn và trọn vẹn.",
    href: "/guide/login",
  },
];

const processSteps = [
  { n: "1", icon: SearchIcon, title: "Khám phá", desc: "Tìm kiếm điểm đến, xem thông tin và hình ảnh bằng giọng nói." },
  { n: "2", icon: AccessibleIcon, title: "Kiểm tra tiếp cận", desc: "Xem mức độ tiếp cận, lối đi phù hợp và các tiện ích hỗ trợ tại điểm đến." },
  { n: "3", icon: MuseumIcon, title: "Đặt dịch vụ & hỗ trợ", desc: "Đặt vé, đặt Guide/Assistant hoặc các dịch vụ hỗ trợ cần thiết." },
  { n: "4", icon: MapPinIcon, title: "Trải nghiệm điểm đến", desc: "Tự tin khám phá, tận hưởng văn hóa, ẩm thực và những điều tuyệt vời của Hà Nội." },
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
    quote: "“Tôi nhìn kém nên thường lo lắng khi đi chỗ lạ. WayEcho giúp tôi kiểm tra trước mức độ tiếp cận và đặt hỗ trợ khi cần. Nhờ vậy, tôi tự tin khám phá Hà Nội hơn rất nhiều.”",
    name: "Thu Hà",
    role: "Người nhìn kém",
  },
  {
    initial: "H",
    quote: "“Là thành viên cộng đồng, tôi rất vui khi thấy WayEcho tạo ra một cầu nối ý nghĩa. Tôi đã có cơ hội đồng hành cùng nhiều bạn, cùng khám phá Hà Nội theo cách trọn vẹn hơn.”",
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
      <section className="container-page pb-8 pt-8 lg:pb-10 lg:pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-12">
          <div>
            <span className="chip hc-surface hc-border"><AccessibleIcon size={16} /> Thiết kế cho người khiếm thị</span>
            <h1 className="mt-5 max-w-[650px] text-5xl leading-[.98] sm:text-6xl lg:text-[68px]">
              Du lịch Hà Nội,<br />dẫn lối <span className="text-[#eb5d27]">bằng giọng nói</span>
            </h1>
            <p className="hc-muted mt-5 max-w-[650px] text-[18px] leading-8 text-ink-soft">
              WayEcho giúp người khiếm thị khám phá Hà Nội dễ dàng hơn bằng giọng nói. Bạn có thể tìm kiếm thông tin, xem khả năng tiếp cận, đặt dịch vụ, nhờ hỗ trợ và trải nghiệm các điểm đến tại Hà Nội cùng những công cụ hỗ trợ phù hợp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary text-base sm:text-lg"><MicIcon size={22} /> Bắt đầu bằng giọng nói</Link>
              <Link href="/assistant" className="btn-ghost hc-border text-base sm:text-lg"><CameraIcon size={22} /> Mở trợ lý camera</Link>
            </div>
            <p className="hc-muted mt-5 flex items-center gap-3 text-sm italic text-ink-soft"><span aria-hidden="true" className="inline-block h-[4px] w-10 rounded-full bg-primary" /> Hà Nội gần hơn, cho mọi người</p>
          </div>

          <div className="grid min-h-[430px] grid-cols-2 grid-rows-2 gap-3" aria-label="Một số hình ảnh thật về Hà Nội">
            <Link href="/item?slug=ho-guom" className="group relative row-span-1 overflow-hidden rounded-[24px] shadow-card lg:row-span-2">
              <VerifiedImage src={HOME_IMAGES.hoGuom.src} fallback={FALLBACK} alt={HOME_IMAGES.hoGuom.alt} priority className="h-full min-h-[250px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/60 px-4 py-3 text-white backdrop-blur-sm"><span className="flex items-center gap-2 font-bold"><MapPinIcon size={18} /> Hồ Gươm</span><span className="block pl-6 text-xs text-white/85">Biểu tượng của Hà Nội</span></span>
            </Link>
            <Link href="/item?slug=pho-co" className="group relative overflow-hidden rounded-[24px] shadow-card">
              <VerifiedImage src={HOME_IMAGES.oldQuarter.src} fallback={FALLBACK} alt={HOME_IMAGES.oldQuarter.alt} className="h-full min-h-[205px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/60 px-3 py-2.5 text-white backdrop-blur-sm"><span className="flex items-center gap-2 font-bold"><MapPinIcon size={17} /> Phố cổ Hà Nội</span><span className="block pl-6 text-[11px] text-white/85">Nét xưa giữa lòng thành phố</span></span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <figure className="relative overflow-hidden rounded-[22px] shadow-card">
                <VerifiedImage src={HOME_IMAGES.pho.src} fallback={FALLBACK} alt={HOME_IMAGES.pho.alt} className="h-full min-h-[205px] w-full object-cover" />
                <figcaption className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-2.5 py-2 text-white backdrop-blur-sm"><span className="font-bold">Ẩm thực Hà Nội</span><span className="block text-[10px] text-white/85">Hương vị làm say lòng người</span></figcaption>
              </figure>
              <figure className="relative overflow-hidden rounded-[22px] shadow-card">
                <VerifiedImage src={HOME_IMAGES.trainStreet.src} fallback={FALLBACK} alt={HOME_IMAGES.trainStreet.alt} className="h-full min-h-[205px] w-full object-cover" />
                <figcaption className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-2.5 py-2 text-white backdrop-blur-sm"><span className="font-bold">Đường tàu Hà Nội</span><span className="block text-[10px] text-white/85">Trải nghiệm độc đáo</span></figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-7">
        <div className="rounded-[22px] border border-line bg-white p-5 shadow-card hc-surface hc-border sm:p-7">
          <h2 className="text-3xl">Bạn muốn khám phá Hà Nội như thế nào?</h2>
          <p className="hc-muted mt-1 text-ink-soft">Nhận trợ giúp bằng giọng nói, tìm thông tin, kiểm tra khả năng tiếp cận và đặt dịch vụ phù hợp với nhu cầu của bạn.</p>
          <div className="mt-4 flex items-center gap-2">
            <Link href="/search" className="flex min-h-[54px] flex-1 items-center gap-3 rounded-2xl border border-line bg-white px-4 text-left text-ink-soft shadow-sm hc-surface hc-border">
              <SearchIcon size={21} /> <span>Bạn muốn đi đâu, làm gì ở Hà Nội?</span>
            </Link>
            <Link href="/search" aria-label="Tìm bằng giọng nói" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-ink shadow-card"><MicIcon size={22} /></Link>
            <Link href="/assistant" aria-label="Mở trợ lý camera" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4ead7] text-ink shadow-card"><CameraIcon size={22} /></Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">Gợi ý nhanh:</span>
            {["Hồ Gươm", "Văn Miếu", "Phố cổ", "Quán cà phê", "Bảo tàng", "Nhà hàng", "Khách sạn"].map((label) => <Link key={label} href={`/search?q=${encodeURIComponent(label)}`} className="rounded-full bg-surface-alt px-4 py-2 font-semibold hover:underline">{label}</Link>)}
          </div>
        </div>
      </section>

      <section className="container-page pb-11" aria-labelledby="need-heading">
        <div className="mb-4">
          <h2 id="need-heading" className="text-3xl">Chọn theo nhu cầu</h2>
          <p className="hc-muted mt-1 text-ink-soft">Lựa chọn nhanh các dịch vụ và thông tin phù hợp với hành trình của bạn.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {needCards.map(({ icon: Icon, label, href, tone }) => (
            <Link key={label} href={href} className="group flex min-h-[108px] items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover hc-surface hc-border lg:flex-col lg:items-start">
              <RoundIcon className={tone}><Icon size={23} /></RoundIcon>
              <span className="whitespace-pre-line font-bold leading-tight">{label}</span><span aria-hidden="true" className="ml-auto text-xl lg:hidden">›</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-[#fffaf2] py-12 hc-surface hc-border" aria-labelledby="discover-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><h2 id="discover-heading" className="text-4xl">Gợi ý khám phá Hà Nội</h2><p className="hc-muted mt-1 text-ink-soft">Một vài điểm đến phù hợp để bắt đầu hành trình của bạn.</p></div>
            <Link href="/destination" className="btn-ghost hc-border !min-h-[42px] !px-5 !py-2 text-sm">Xem thêm điểm đến ›</Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinationCards.map((card) => (
              <Link key={card.title} href={card.href} className="overflow-hidden rounded-[20px] border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover hc-surface hc-border">
                <VerifiedImage src={card.image.src} fallback={FALLBACK} alt={card.image.alt} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-[24px]">{card.title}</h3>
                  <p className="hc-muted mt-2 flex items-center gap-2 text-sm text-ink-soft"><MapPinIcon size={17} /> {card.area}</p>
                  <ul className="hc-muted mt-2 space-y-1 text-sm text-ink-soft">
                    {card.facts.map((f) => <li key={f} className="flex items-center gap-2"><AccessibleIcon size={17} /> {f}</li>)}
                  </ul>
                  <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${card.badgeClass}`}>{card.badge}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12" aria-labelledby="help-heading">
        <h2 id="help-heading" className="text-4xl">WayEcho giúp bạn như thế nào?</h2>
        <p className="hc-muted mt-1 text-ink-soft">Những tính năng được thiết kế để hành trình khám phá Hà Nội của bạn dễ dàng và chủ động hơn.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ icon: Icon, title, desc, tone }) => (
            <article key={title} className="rounded-2xl border border-line bg-white p-5 shadow-card hc-surface hc-border">
              <RoundIcon className={tone}><Icon size={23} /></RoundIcon>
              <h3 className="mt-4 text-[22px]">{title}</h3>
              <p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">{desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-4xl">Vì sao WayEcho hữu ích?</h2>
          <p className="hc-muted mt-1 text-ink-soft">Chỉ với vài bước đơn giản, bạn đã có thể tự tin khám phá Hà Nội theo cách của riêng mình.</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <article className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-card hc-surface hc-border sm:grid-cols-[180px_1fr] lg:grid-cols-[150px_1fr]">
              <VerifiedImage src={HOME_IMAGES.navigation.src} fallback={FALLBACK} alt={HOME_IMAGES.navigation.alt} className="h-44 w-full object-cover sm:h-full" />
              <div className="p-5"><h3 className="text-xl">1. Tìm nơi phù hợp</h3><p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">Nói hoặc nhập nhu cầu của bạn, WayEcho sẽ gợi ý các điểm đến, dịch vụ phù hợp.</p></div>
            </article>
            <article className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-card hc-surface hc-border sm:grid-cols-[180px_1fr] lg:grid-cols-[150px_1fr]">
              <div className="relative min-h-[176px] overflow-hidden bg-[#f7f2e8]">
                <VerifiedImage src={HOME_IMAGES.camera.src} fallback={FALLBACK} alt={HOME_IMAGES.camera.alt} className="h-full w-full object-cover" />
                <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 p-3 text-[11px] shadow-card"><strong className="block">Thông tin tiếp cận</strong><span className="mt-1 block">✓ Lối đi tiếp cận</span><span className="block">✓ Điểm hỗ trợ</span><span className="block">✓ Lưu ý trước khi đi</span></div>
              </div>
              <div className="p-5"><h3 className="text-xl">2. Xem mức độ tiếp cận</h3><p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">Nắm rõ thông tin về khả năng tiếp cận, tiện ích và các lưu ý quan trọng trước khi đi.</p></div>
            </article>
            <article className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-card hc-surface hc-border sm:grid-cols-[180px_1fr] lg:grid-cols-[150px_1fr]">
              <VerifiedImage src={HOME_IMAGES.humanSupport.src} fallback={FALLBACK} alt={HOME_IMAGES.humanSupport.alt} className="h-44 w-full object-cover sm:h-full" />
              <div className="p-5"><h3 className="text-xl">3. Đi cùng công cụ hỗ trợ</h3><p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">Sử dụng bản đồ, chỉ đường bằng giọng nói và trợ lý tại điểm đến để có hành trình an toàn, thoải mái và trọn vẹn hơn.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#fffdf8] py-12 hc-surface hc-border" aria-labelledby="assistant-heading">
        <div className="container-page">
          <h2 id="assistant-heading" className="text-5xl">Trợ lý <span className="text-[#eb5d27]">trong hành trình</span></h2>
          <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">Công nghệ và con người cùng đồng hành, giúp bạn tự tin khám phá Hà Nội theo cách của riêng mình.</p>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {journeyAssist.map(({ image, icon: Icon, title, desc, href }) => (
              <article key={title} className="overflow-hidden rounded-[22px] border border-line bg-white shadow-card hc-surface hc-border">
                <VerifiedImage src={image.src} fallback={FALLBACK} alt={image.alt} className="h-60 w-full object-cover" />
                <div className="flex gap-4 p-5">
                  <RoundIcon className="bg-[#f48627]"><Icon size={24} /></RoundIcon>
                  <div className="min-w-0 flex-1"><h3 className="text-2xl">{title}</h3><p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">{desc}</p></div>
                  <Link href={href} aria-label={`Mở ${title}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt text-xl">→</Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] border border-line bg-white p-5 shadow-card hc-surface hc-border sm:p-7">
            <h2 className="text-4xl">Hành trình với <span className="text-[#eb5d27]">WayEcho</span></h2>
            <p className="hc-muted mt-1 text-ink-soft">Chỉ 4 bước đơn giản để bắt đầu hành trình khám phá Hà Nội dễ dàng hơn.</p>
            <ol className="mt-6 grid gap-5 lg:grid-cols-4">
              {processSteps.map(({ n, icon: Icon, title, desc }) => (
                <li key={n} className="relative flex gap-4 lg:block">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fff3e0] text-[#ee7d20]"><Icon size={28} /><span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-ink">{n}</span></div>
                  <div className="lg:mt-4"><h3 className="text-xl">{title}</h3><p className="hc-muted mt-2 text-sm leading-6 text-ink-soft">{desc}</p></div>
                  {n !== "4" && <span aria-hidden="true" className="absolute right-0 top-6 hidden text-3xl text-primary lg:block">›</span>}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8" aria-labelledby="stories-heading">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><h2 id="stories-heading" className="text-4xl">Những <span className="text-[#eb5d27]">trải nghiệm thật</span></h2><p className="hc-muted mt-1 text-ink-soft">Câu chuyện từ những người đã đồng hành cùng WayEcho.</p></div>
              <Link href="/review" className="btn-ghost hc-border !min-h-[42px] !px-5 !py-2 text-sm">Xem thêm câu chuyện →</Link>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {stories.map((story) => (
                <article key={story.name} className="rounded-2xl border border-line bg-white p-5 shadow-card hc-surface hc-border">
                  <div className="flex gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f3e3c5] text-xl font-bold text-[#8b5b12]" aria-hidden="true">{story.initial}</div><div><p className="text-sm leading-6 text-ink-soft hc-muted">{story.quote}</p><p className="mt-3 font-bold">{story.name}</p><p className="text-sm text-ink-soft hc-muted">{story.role}</p></div></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12" id="download-app" aria-labelledby="download-heading">
        <div className="overflow-hidden rounded-[28px] border border-[#eedfc9] bg-[linear-gradient(110deg,#fff7e9_0%,#fffdf9_55%,#f8ebd2_100%)] shadow-card hc-surface hc-border">
          <div className="grid items-center gap-8 p-7 lg:grid-cols-[1.05fr_.95fr] lg:p-10">
            <div>
              <h2 id="download-heading" className="text-5xl">Tải ứng dụng <span className="text-[#eb5d27]">WayEcho</span></h2>
              <p className="mt-2 text-2xl font-semibold">Khám phá Hà Nội đồng hành trên điện thoại của bạn.</p>
              <p className="hc-muted mt-4 max-w-2xl text-ink-soft">Tải ngay ứng dụng WayEcho để khám phá Hà Nội dễ dàng hơn với tìm kiếm bằng giọng nói, lưu hành trình yêu thích và nhận hỗ trợ nhanh chóng khi cần.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/app" aria-label="Xem hướng dẫn cài WayEcho trên iPhone hoặc iPad" className="rounded-xl bg-black px-5 py-3 text-white"><span className="block text-[10px] uppercase tracking-wider">Tải về trên</span><span className="text-xl font-bold"> App Store</span></Link>
                <Link href="/app" aria-label="Xem hướng dẫn cài WayEcho trên Android" className="rounded-xl bg-black px-5 py-3 text-white"><span className="block text-[10px] uppercase tracking-wider">Tải nội dung trên</span><span className="text-xl font-bold">▶ Google Play</span></Link>
              </div>
              <p className="hc-muted mt-5 flex items-center gap-3 italic text-ink-soft"><span aria-hidden="true" className="inline-block h-[4px] w-10 rounded-full bg-primary" /> Cùng WayEcho, Hà Nội gần hơn, cho mọi người!</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-[1fr_230px] sm:items-center">
              <div className="space-y-5">
                <div className="flex gap-4"><RoundIcon className="bg-[#f6a62e] text-ink"><MicIcon size={22} /></RoundIcon><div><h3 className="text-xl">Tìm kiếm bằng giọng nói</h3><p className="hc-muted mt-1 text-sm text-ink-soft">Hỏi và khám phá điểm đến, dịch vụ chỉ bằng giọng nói.</p></div></div>
                <div className="flex gap-4"><RoundIcon className="bg-[#3f7dca]"><BookmarkIcon size={22} /></RoundIcon><div><h3 className="text-xl">Lưu hành trình</h3><p className="hc-muted mt-1 text-sm text-ink-soft">Lưu lại những địa điểm yêu thích và tạo hành trình của riêng bạn.</p></div></div>
                <div className="flex gap-4"><RoundIcon className="bg-[#ec633b]"><HeadphonesIcon size={22} /></RoundIcon><div><h3 className="text-xl">Yêu cầu hỗ trợ khi cần</h3><p className="hc-muted mt-1 text-sm text-ink-soft">Kết nối nhanh với đội ngũ hỗ trợ, Guide & Assistant.</p></div></div>
              </div>
              <div className="relative mx-auto w-[220px] rounded-[34px] border-[8px] border-[#111827] bg-white p-3 shadow-2xl" aria-label="Mô phỏng giao diện ứng dụng WayEcho trên điện thoại">
                <div className="mx-auto mb-3 h-2 w-20 rounded-full bg-[#1f2937]" />
                <div className="flex items-center gap-2 text-sm font-black"><span className="text-[#ef6d28]">⌖</span> Way<span className="text-[#ef6d28]">Echo</span></div>
                <div className="mt-3 rounded-xl border border-line bg-white p-2 text-[10px] shadow-sm">Bạn muốn khám phá Hà Nội điều gì? <span className="float-right rounded-full bg-primary p-1"><MicIcon size={12} /></span></div>
                <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[8px]"><span>♿<br />Điểm đến</span><span>🍴<br />Ẩm thực</span><span>🏛<br />Văn hóa</span><span>🧭<br />Bản đồ</span></div>
                <div className="mt-3 text-[10px] font-bold">Khám phá Hà Nội</div>
                <div className="mt-1 overflow-hidden rounded-xl"><VerifiedImage src={HOME_IMAGES.hoGuom.src} fallback={FALLBACK} alt="Ảnh Cầu Thê Húc tại Hồ Hoàn Kiếm hiển thị trong mô phỏng màn hình ứng dụng WayEcho." className="h-28 w-full object-cover" /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div><h2 className="text-4xl">Cần hỗ trợ thêm?</h2><p className="hc-muted mt-1 text-ink-soft">Chúng tôi luôn sẵn sàng đồng hành cùng bạn trong hành trình khám phá Hà Nội.</p></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/help" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border"><RoundIcon className="bg-[#dceaff] text-[#3d73bc]"><span aria-hidden="true" className="text-xl">▤</span></RoundIcon><div><h3 className="text-base">Xem hướng dẫn sử dụng</h3><p className="hc-muted mt-1 text-xs text-ink-soft">Tìm hiểu cách sử dụng WayEcho dễ dàng và nhanh chóng.</p></div></Link>
              <Link href="/help#contact" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border"><RoundIcon className="bg-[#dff4e5] text-[#238a4d]"><HeadphonesIcon size={21} /></RoundIcon><div><h3 className="text-base">Liên hệ hỗ trợ</h3><p className="hc-muted mt-1 text-xs text-ink-soft">Đặt câu hỏi hoặc nhận hỗ trợ từ đội ngũ của chúng tôi.</p></div></Link>
              <Link href="/guide/login" className="flex gap-3 rounded-2xl border border-line p-4 hover:bg-surface-alt hc-border"><RoundIcon className="bg-[#ffe9ca] text-[#d57d0a]"><UserIcon size={21} /></RoundIcon><div><h3 className="text-base">Tìm Guide & Assistant</h3><p className="hc-muted mt-1 text-xs text-ink-soft">Kết nối với hướng dẫn viên và trợ lý phù hợp.</p></div></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
