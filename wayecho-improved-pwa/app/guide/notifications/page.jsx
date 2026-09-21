export default function GuideNotificationsPage() {
  const items = [
    { title: "Booking mới đang chờ xác nhận", detail: "Hỗ trợ đi bộ phố cổ · 28/09 · 08:00" },
    { title: "Lịch đã được cập nhật", detail: "Thuyết minh Văn Miếu · 28/09 · 14:00" },
  ];
  return (
    <div className="container-page py-10">
      <h2 className="text-4xl sm:text-5xl">Thông báo</h2>
      <p className="hc-muted mt-2 text-lg text-ink-soft">Các cập nhật liên quan đến booking và lịch hỗ trợ của bạn.</p>
      <div className="mt-7 space-y-3">
        {items.map((item) => <article key={item.title} className="card hc-surface hc-border p-5"><h3 className="text-lg">{item.title}</h3><p className="hc-muted mt-1 text-sm text-ink-soft">{item.detail}</p></article>)}
      </div>
    </div>
  );
}
