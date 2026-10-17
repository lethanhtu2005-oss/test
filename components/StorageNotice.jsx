import { storageModeName } from "@/lib/store";

// Chỉ hiện khi dữ liệu lưu tạm trong bộ nhớ (mặc định trên Vercel), để không ai tưởng dữ liệu đã được lưu bền.
export default function StorageNotice() {
  if (storageModeName() !== "memory") return null;
  return (
    <p role="note" className="bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950">
      Bản demo trực tuyến: đặt chỗ, chuyến đi và đánh giá chỉ được lưu tạm trên máy chủ và có thể mất bất cứ lúc nào.
    </p>
  );
}
