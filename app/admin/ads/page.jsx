"use client";
import { useEffect, useState } from "react";
import { ads, validAd, adDestinations } from "@/data/ads";
import AdCard from "@/components/AdCard";
export default function AdsAdminPage() {
  const [records, setRecords] = useState(ads),
    [selected, setSelected] = useState(ads[0].id),
    [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("we-ad-drafts") || "null");
      if (Array.isArray(saved) && saved.length && saved.every(validAd))
        setRecords(saved);
    } catch (_) {}
  }, []);
  const ad = records.find((a) => a.id === selected) || records[0];
  function edit(field, value) {
    setMessage("");
    setRecords((prev) =>
      prev.map((r) => (r.id === ad.id ? { ...r, [field]: value } : r)),
    );
  }
  function save() {
    if (!records.every(validAd)) {
      setMessage("Kiểm tra lại các trường bắt buộc và trang đích.");
      return;
    }
    try {
      localStorage.setItem("we-ad-drafts", JSON.stringify(records));
      setMessage(
        "Đã lưu bản nháp trên trình duyệt này. Website công khai chưa thay đổi.",
      );
    } catch (_) {
      setMessage("Không lưu được trên trình duyệt này.");
    }
  }
  function exportRecords() {
    if (!records.every(validAd)) {
      setMessage("Chưa thể xuất: có trường bắt buộc không hợp lệ.");
      return;
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(records, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "wayecho-ad-drafts.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="container-page py-10">
      <h1 className="text-4xl">Quản lý nội dung giới thiệu & quảng cáo</h1>
      <p className="notice mt-5">
        Cổng admin hiện là demo. Chỉnh sửa ở đây chỉ tạo bản nháp cục bộ, không
        phát hành lên website. Chỉ quản trị viên dự án mới cập nhật dữ liệu
        chiến dịch trong source sau khi xác minh đối tác.
      </p>
      <label className="block mt-7 font-bold" htmlFor="campaign">
        Chọn chiến dịch
      </label>
      <select
        id="campaign"
        value={ad.id}
        onChange={(e) => setSelected(e.target.value)}
        className="bg-white border border-line rounded-xl p-3 w-full mt-2"
      >
        {records.map((a) => (
          <option key={a.id} value={a.id}>
            {a.id}
          </option>
        ))}
      </select>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="grid gap-5 md:grid-cols-2 mt-6"
      >
        {[
          ["title", "Tiêu đề"],
          ["description", "Mô tả"],
          ["label", "Nhãn nhận diện"],
          ["cta", "Chữ nút CTA"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block font-semibold mb-2" htmlFor={`ad-${key}`}>
              {label}
            </label>
            <input
              required
              id={`ad-${key}`}
              value={ad[key]}
              onChange={(e) => edit(key, e.target.value)}
              className="w-full border border-line bg-white rounded-xl p-3"
            />
          </div>
        ))}
        <div>
          <label htmlFor="ad-href" className="block font-semibold mb-2">
            Trang đích hợp lệ
          </label>
          <select
            id="ad-href"
            className="w-full border border-line bg-white rounded-xl p-3"
            value={ad.href}
            onChange={(e) => edit("href", e.target.value)}
          >
            {adDestinations.map((url) => (
              <option key={url}>{url}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="ad-active"
            checked={ad.active}
            onChange={(e) => edit("active", e.target.checked)}
            className="h-5 w-5"
          />
          <label htmlFor="ad-active">Trạng thái hoạt động trong bản nháp</label>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="btn-primary" type="submit">
            Lưu bản nháp
          </button>
          <button className="btn-ghost" type="button" onClick={exportRecords}>
            Xuất JSON cho quản trị viên
          </button>
        </div>
      </form>
      <p className="mt-4" role="status">
        {message}
      </p>
      <h2 className="text-2xl mt-8">Xem trước bố cục</h2>
      <AdCard ad={ad} preview />
      <p className="text-ink-soft">
        Chưa kết nối công cụ phân tích; chưa có số liệu lượt xem, lượt nhấp hoặc
        CTR thực tế.
      </p>
    </div>
  );
}
