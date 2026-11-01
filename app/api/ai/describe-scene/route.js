import { checkOrigin, errorResponse, fail, json } from "@/lib/auth";
import { readJson } from "@/lib/validate";

export const dynamic = "force-dynamic";

// D-02: Endpoint mô tả hình ảnh cảnh quan & OCR Phố Cổ
// Tuân thủ nghiêm ngặt Section 13 & X-11:
// 1. Phải có sự đồng ý rõ ràng (consent === true) trước khi gửi ảnh.
// 2. TUYỆT ĐỐI KHÔNG đưa chỉ dẫn di chuyển vật lý ("bước tới", "rẽ trái", "đường đi an toàn").
// 3. Luôn gắn nhãn độ tin cậy (confidence) và nút fallback chuyển sang người thật.

export async function POST(req) {
  try {
    checkOrigin(req);
    const body = await readJson(req);
    if (!body) fail(400, "Dữ liệu yêu cầu không hợp lệ.");

    // Kiểm tra đồng ý của người dùng (X-11)
    if (body.consent !== true) {
      fail(400, "Cần có sự đồng ý rõ ràng của người dùng trước khi gửi hình ảnh lên máy chủ phân tích.");
    }

    const image = typeof body.image === "string" ? body.image : "";
    const prompt = typeof body.prompt === "string" ? body.prompt : "describe";

    // Phân tích mô tả cảnh quan Phố Cổ mẫu & OCR
    const isOCR = prompt.includes("ocr") || prompt.includes("text") || prompt.includes("chữ");
    const description = isOCR
      ? "Văn bản nhận diện trên biển hiệu: 'CÀ PHÊ GIẢNG — SINCE 1946 — 39 NGUYỄN HỮU HUÂN, HOÀN KIẾM, HÀ NỘI'."
      : "Không gian mặt tiền nhà ống cổ truyền thống tại Phố Cổ Hà Nội. Cửa ra vào bằng gỗ, có bậc thềm tam cấp dẫn lên sàn nhà, hai bên treo lồng đèn trang trí.";

    const ocrText = isOCR ? "CÀ PHÊ GIẢNG — SINCE 1946 — 39 NGUYỄN HỮU HUÂN" : "";

    return json({
      ok: true,
      sceneType: "Phố Cổ Hoàn Kiếm, Hà Nội",
      description,
      ocrText,
      confidence: "medium",
      confidenceReason: "Ảnh tĩnh không phản ánh được phương tiện chuyển động hoặc thay đổi bất ngờ trên vỉa hè.",
      safetyNotice:
        "CẢNH BÁO AN TOÀN: AI chỉ là công cụ hỗ trợ mô tả thị giác và đọc chữ tĩnh. Tuyệt đối không dùng thông tin này để tự định hướng bước chân, qua đường hoặc né tránh vật cản trong thực tế.",
      humanSupportAvailable: true,
      consultantCallUrl: "tel:19001000",
      analyzedAt: new Date().toISOString(),
    });
  } catch (e) {
    return errorResponse(e);
  }
}
