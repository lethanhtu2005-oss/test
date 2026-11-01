import test, { after } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const root = fileURLToPath(new URL("../", import.meta.url));
register(new URL("./helpers/alias-loader.mjs", import.meta.url), { data: { root } });

const folder = await fs.mkdtemp(path.join(tmpdir(), "wayecho-session-tests-"));
process.env.WAYECHO_DATA_PATH = path.join(folder, "db.json");
delete process.env.VERCEL;
delete process.env.WAYECHO_STORAGE_MODE;
delete process.env.WAYECHO_SESSION_SECRET;
delete process.env.WAYECHO_USERS;

const { transaction, list } = await import("../lib/store.js");
const { login, logout, revokeUserSessions, authenticate, IDLE_TIMEOUT_MS } = await import("../lib/auth.js");
const heartbeatRoute = await import("../app/api/auth/heartbeat/route.js");

const password = randomBytes(24).toString("hex");
const { hashPassword } = await import("../lib/auth.js");
const hash = await hashPassword(password);

await transaction(db => {
  db.users.push(
    { id: "b_sess", email: "biz@session.test", role: "business", businessId: "b_sess", active: true, passwordHash: hash },
    { id: "g_sess", email: "guide@session.test", role: "guide", guideId: "g_sess", active: true, passwordHash: hash },
    { id: "t_sess", email: "trav@session.test", role: "traveler", active: true, passwordHash: hash }
  );
});

after(async () => {
  await fs.rm(folder, { recursive: true, force: true });
  delete process.env.WAYECHO_DATA_PATH;
});

function mockReq(token, origin = "http://localhost") {
  return new Request("http://localhost/api/test", {
    headers: {
      Origin: origin,
      Cookie: `we_session=${token}`,
    },
  });
}

test("I-01: Login tạo session có sid 256-bit ngẫu nhiên và lưu vào bảng sessions", async () => {
  const { token, user } = await login("biz@session.test", password, "business", "test-source-1", "TestAgent/1.0");
  assert.equal(user.id, "b_sess");
  assert.equal(user.role, "business");

  const sessions = await list("sessions");
  const current = sessions.find(s => s.userId === "b_sess");
  assert.ok(current);
  assert.match(current.sid, /^[a-f0-9]{64}$/); // 32 bytes hex = 64 characters
  assert.equal(current.role, "business");
  assert.equal(current.ip, "test-source-1");
  assert.equal(current.userAgent, "TestAgent/1.0");

  const authUser = await authenticate(mockReq(token));
  assert.equal(authUser.id, "b_sess");
});

test("I-07: Đơn phiên cho Business/Guide (đăng nhập mới hủy phiên cũ)", async () => {
  const session1 = await login("biz@session.test", password, "business", "device-1");
  const session2 = await login("biz@session.test", password, "business", "device-2");

  // Phiên mới hợp lệ
  const auth2 = await authenticate(mockReq(session2.token));
  assert.equal(auth2.id, "b_sess");

  // Phiên cũ bị hủy (không còn trong db.sessions) -> 401
  await assert.rejects(
    authenticate(mockReq(session1.token)),
    err => err.status === 401 && /thu hồi/i.test(err.message)
  );
});

test("I-07: Traveler được phép đa phiên (không bị hủy phiên cũ)", async () => {
  const sessionA = await login("trav@session.test", password, "traveler", "phone-a");
  const sessionB = await login("trav@session.test", password, "traveler", "laptop-b");

  const authA = await authenticate(mockReq(sessionA.token));
  const authB = await authenticate(mockReq(sessionB.token));
  assert.equal(authA.id, "t_sess");
  assert.equal(authB.id, "t_sess");
});

test("I-04: Logout xóa phiên phía server", async () => {
  const { token } = await login("guide@session.test", password, "guide");
  const authBefore = await authenticate(mockReq(token));
  assert.equal(authBefore.id, "g_sess");

  await logout(mockReq(token));

  // Sau khi logout, phiên không còn tồn tại -> 401
  await assert.rejects(
    authenticate(mockReq(token)),
    err => err.status === 401
  );
});

test("I-05: Idle timeout sau 30 phút không hoạt động đối với Portal", async () => {
  const { token } = await login("biz@session.test", password, "business");
  const authOk = await authenticate(mockReq(token));
  assert.equal(authOk.id, "b_sess");

  // Giả lập phiên không hoạt động quá 30 phút
  await transaction(db => {
    const s = db.sessions.find(x => x.userId === "b_sess");
    assert.ok(s);
    s.lastActivityAt = Date.now() - (IDLE_TIMEOUT_MS + 5000);
  });

  await assert.rejects(
    authenticate(mockReq(token)),
    err => err.status === 401 && /30 phút/i.test(err.message)
  );
});

test("I-05: API Heartbeat gia hạn thời gian hoạt động", async () => {
  const { token } = await login("biz@session.test", password, "business");
  
  // Set lastActivityAt về 20 phút trước
  const pastTime = Date.now() - (20 * 60 * 1000);
  await transaction(db => {
    const s = db.sessions.find(x => x.userId === "b_sess");
    s.lastActivityAt = pastTime;
  });

  const req = new Request("http://localhost/api/auth/heartbeat", {
    method: "POST",
    headers: {
      Origin: "http://localhost",
      Cookie: `we_session=${token}`,
    },
  });

  const res = await heartbeatRoute.POST(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);

  const sessions = await list("sessions");
  const s = sessions.find(x => x.userId === "b_sess");
  assert.ok(s.lastActivityAt > pastTime + 1000);
});

test("I-04: revokeUserSessions thu hồi tất cả phiên của user khi bị khóa/đổi mật khẩu", async () => {
  const sess1 = await login("guide@session.test", password, "guide");
  assert.equal((await authenticate(mockReq(sess1.token))).id, "g_sess");

  await revokeUserSessions("g_sess");

  await assert.rejects(
    authenticate(mockReq(sess1.token)),
    err => err.status === 401
  );
});
