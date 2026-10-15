import { mediaCredits } from "@/data/media";
export default function ImageCredit({ src }) {
  const credit = mediaCredits.find((m) => src.endsWith(m.file));
  return credit ? (
    <figcaption className="image-credit">
      Ảnh: {credit.artist} ·{" "}
      <a href={credit.source} target="_blank" rel="noreferrer">
        Wikimedia Commons
      </a>{" "}
      ·{" "}
      <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
        {credit.license}
      </a>{" "}
      · Đã đổi kích thước / định dạng WebP; có thể cắt hiển thị.
    </figcaption>
  ) : null;
}
