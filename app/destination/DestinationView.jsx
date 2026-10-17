"use client";

import DestinationActions from "@/components/DestinationActions";
import ReportIssue from "@/components/ReportIssue";
import { articles } from "@/data/articles";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import VerifiedImage from "@/components/VerifiedImage";
import DestinationCard from "@/components/DestinationCard";
import { getDestination, destinations } from "@/data/destinations";
import {
  SpeakerIcon, MapPinIcon, AccessibleIcon, CompassIcon, CalendarIcon, PhoneIcon,
} from "@/components/Icons";

function AccessRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 hc-border sm:grid-cols-[220px_1fr] sm:gap-5">
      <dt className="font-semibold">{label}</dt>
      <dd className="hc-muted text-ink-soft">{value}</dd>
    </div>
  );
}

function DestinationContent() {
  const params = useSearchParams();
  const slug = params.get("d");
  const d = getDestination(slug);
  const { speak } = useA11y();

  if (!slug) {
    return (
      <div className="container-page py-10">
        <p className="font-semibold text-accent-dark">Destination & Accessibility Data</p>
        <h1 className="mt-1 text-4xl sm:text-5xl">Điểm đến Hà Nội</h1>
        <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">Ảnh địa điểm đã được đối chiếu theo nguồn. Accessibility data chưa đủ bằng chứng được gắn nhãn “cần khảo sát / cần xác minh” thay vì suy đoán.</p>
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{destinations.map((item) => <DestinationCard key={item.slug} d={item} />)}</div>
      </div>
    );
  }

  // Không tự rơi về địa điểm khác: người khiếm thị có thể nghe nhầm mô tả nơi mình không định tới.
  if (!d) {
    return (
      <div className="container-page py-16" role="alert">
        <h1 className="text-3xl">Không tìm thấy điểm đến</h1>
        <p className="hc-muted mt-3 text-lg text-ink-soft">Đường dẫn không khớp với địa điểm nào trong dữ liệu WayEcho.</p>
        <Link href="/destination" className="btn-primary mt-5">Xem danh sách điểm đến</Link>
      </div>
    );
  }

  const accessRows = [
    ["Phù hợp người mù", d.access.blind],
    ["Phù hợp người nhìn kém", d.access.lowVision],
    ["Nhân viên / quầy hỗ trợ", d.access.staff],
    ["Audio / thuyết minh", d.access.audio],
    ["Braille", d.access.braille],
    ["Thang máy", d.access.elevator],
    ["Lối không bậc", d.access.stepFree],
  ];

  return (
    <div className="container-page py-10">
      <p className="text-sm text-ink-soft hc-muted">
        <Link href="/destination" className="hover:underline">Điểm đến</Link> ·{" "}
        <MapPinIcon size={14} className="inline align-[-2px]" /> {d.area}
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <figure>
          <div className="aspect-[4/3] overflow-hidden rounded-[18px] bg-surface-alt shadow-card">
            <VerifiedImage src={d.image} fallback={d.imageFallback} alt={d.alt} priority className="h-full w-full object-cover" />
          </div>
          <figcaption className="hc-muted mt-2 text-sm text-ink-soft">
            <span className="font-semibold text-ink">Ảnh:</span> {d.imageCredit}. {d.imageSource && (
              <a href={d.imageSource} target="_blank" rel="noreferrer" className="font-semibold text-accent-dark underline">Xem nguồn ảnh</a>
            )}
          </figcaption>
        </figure>

        <div>
          <span className="chip hc-surface hc-border bg-primary">
            <AccessibleIcon size={16} /> Accessibility: {d.access.level}
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl">{d.name}</h1>
          <p className="mt-2 flex items-start gap-2 text-ink-soft hc-muted"><MapPinIcon size={18} className="mt-1 shrink-0" /> {d.address}</p>
          <p className="hc-muted mt-3 text-lg text-ink-soft">{d.summary}</p>

          <button type="button" onClick={() => speak(d.audio)} className="btn-primary mt-5 text-lg">
            <SpeakerIcon size={22} /> Nghe mô tả bằng giọng nói
          </button>

          <DestinationActions destination={d} />
          <ReportIssue itemId={d.slug} itemName={d.name} />
          <div className="mt-4 rounded-2xl border border-line bg-surface-alt p-4 hc-surface hc-border">
            <p className="text-sm font-semibold text-ink-soft hc-muted">Mô tả âm thanh có cảnh báo mức độ chắc chắn</p>
            <p className="mt-1 text-lg">{d.audio}</p>
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]" aria-labelledby="access-heading">
        <div>
          <h2 id="access-heading" className="text-3xl">Dữ liệu tiếp cận</h2>
          <p className="hc-muted mt-2 max-w-3xl text-ink-soft">
            WayEcho tách thông tin địa điểm khỏi dữ liệu accessibility. “Chưa công bố” không có nghĩa là “không có”; nó có nghĩa là bản demo chưa có nguồn đủ tin cậy để xác nhận.
          </p>
          <dl className="mt-4">
            <AccessRow label="Trạng thái dữ liệu" value={d.access.status} />
            {accessRows.map(([label, value]) => <AccessRow key={label} label={label} value={value} />)}
            <AccessRow label="Ghi chú an toàn" value={d.access.note} />
          </dl>
        </div>

        <aside className="rounded-[18px] border border-line bg-white p-5 shadow-card hc-surface hc-border" aria-labelledby="visit-heading">
          <h2 id="visit-heading" className="text-2xl">Thông tin đã đối chiếu</h2>
          <dl className="mt-3 space-y-3">
            <div><dt className="font-semibold">Giờ tham quan</dt><dd className="hc-muted text-ink-soft">{d.visit.hours}</dd></div>
            <div><dt className="font-semibold">Giá / vé</dt><dd className="hc-muted text-ink-soft">{d.visit.price}</dd></div>
            <div><dt className="font-semibold">Kiểm tra dữ liệu</dt><dd className="hc-muted text-ink-soft">{d.checkedAt}</dd></div>
          </dl>
          {d.facts.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-soft hc-muted">
              {d.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          {d.sources.length > 0 && (
            <div className="mt-5 border-t border-line pt-4 hc-border">
              <p className="font-semibold">Nguồn công khai</p>
              <ul className="mt-2 space-y-2 text-sm">
                {d.sources.map((s) => (
                  <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-accent-dark underline">{s.label}</a></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <section className="mt-8 max-w-3xl"><h2 className="text-3xl">Trước khi đến</h2><p className="mt-3">WayEcho chưa có tuyến phương tiện và điểm đón trả đã khảo sát cho {d.name}. Hãy hỏi đơn vị quản lý về lối vào đang sử dụng, hình thức thuyết minh, người hỗ trợ và điều kiện tham quan vào ngày bạn đi. Nguồn địa chỉ hoặc giá vé không xác nhận các tiện ích này.</p><h3 className="mt-5 text-2xl">Cẩm nang liên quan</h3><ul className="mt-3 space-y-2">{articles.filter(a=>a.destinationSlugs.includes(d.slug)).map(a=><li key={a.slug}><Link className="underline" href={`/articles/${a.slug}`}>{a.title}</Link></li>)}</ul><Link className="mt-4 inline-block underline" href="/services/guide-dogs">Thông tin về chó dẫn đường</Link></section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/booking?item=${d.slug}`} className="btn-primary text-lg"><CalendarIcon size={22} /> Tạo yêu cầu / đặt dịch vụ</Link>
        <Link href={`/navigation?to=${d.slug}`} className="btn-ghost hc-border text-lg"><CompassIcon size={22} /> Mở bản đồ demo</Link>
        <Link href="/help" className="btn-ghost hc-border text-lg"><PhoneIcon size={22} /> Thông tin hỗ trợ</Link>
      </div>

      <section className="mt-14" aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-2xl">Điểm đến khác</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.filter((x) => x.slug !== d.slug).slice(0, 3).map((x) => (
            <li key={x.slug}>
              <Link href={`/destination?d=${x.slug}`} className="card hc-surface hc-border block h-full overflow-hidden border border-line hover:shadow-card-hover">
                <VerifiedImage src={x.image} fallback={x.imageFallback} alt={x.alt} className="h-36 w-full object-cover" />
                <span className="block p-4 text-lg font-semibold">{x.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function DestinationView() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải…</div>}>
      <DestinationContent />
    </Suspense>
  );
}
