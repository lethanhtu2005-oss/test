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
    if (!image || image.length > 5_000_000) fail(400, "Ảnh không hợp lệ hoặc vượt giới hạn kích thước.");
    // Chưa cấu hình mô hình phân tích ảnh; không gán mô tả mẫu cho ảnh người dùng.
    const description = "WayEcho chưa kết nối mô hình AI phân tích ảnh. Ảnh chưa được phân tích.";
    const ocrText = "";

    return json({
      ok: true,
      sceneType: "Chưa xác định — ảnh chưa được phân tích",
      description,
      ocrText,
      confidence: "Không áp dụng",
      confidenceReason: "Đây là thông báo giới hạn của bản demo, không phải kết quả phân tích ảnh.",
      safetyNotice:
        "CẢNH BÁO AN TOÀN: AI chỉ là công cụ hỗ trợ mô tả thị giác và đọc chữ tĩnh. Tuyệt đối không dùng thông tin này để tự định hướng bước chân, qua đường hoặc né tránh vật cản trong thực tế.",
      isDemo: true,
      imageAnalyzed: false,
      humanSupportAvailable: false,
      analyzedAt: new Date().toISOString(),
    });
  } catch (e) {
    return errorResponse(e);
  }
}
