"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startGuideSession } from "@/lib/guideSession";
import Logo from "@/components/Logo";
import { CalendarIcon, CheckIcon, UserIcon } from "@/components/Icons";

function MailIcon({ size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function LockIcon({ size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function GuideLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }
    // Prototype: khi kết nối backend, thay bằng API xác thực + session/token an toàn.
    startGuideSession();
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(
      next && next.startsWith("/guide/") && !next.startsWith("//")
        ? next
        : "/guide",
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="border-b border-line bg-white">
        <div className="container-page flex min-h-[70px] items-center justify-between gap-4">
          <Link href="/" aria-label="Về WayEcho">
            <Logo height={38} />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-accent-dark hover:underline"
          >
            ← Về WayEcho
          </Link>
        </div>
      </header>

      <div className="container-page grid min-h-[calc(100vh-70px)] items-center gap-10 py-10 lg:grid-cols-[1.1fr_.9fr]">
        <section
          className="relative overflow-hidden rounded-[32px] bg-surface-alt p-7 sm:p-10 lg:min-h-[660px]"
          aria-labelledby="guide-login-intro"
        >
          <p className="text-xs font-bold uppercase tracking-[.24em] text-ink-soft">
            Kết nối con người – mở rộng trải nghiệm
          </p>
          <h1 id="guide-login-intro" className="mt-5 text-5xl sm:text-6xl">
            WayEcho
            <br />
            <span className="text-accent-dark">Guide Portal</span>
          </h1>
          <p className="hc-muted mt-5 max-w-xl text-lg text-ink-soft">
            Không gian dành cho hướng dẫn viên và Personal Assistant đồng hành
            cùng Traveler.
          </p>

          <div className="mt-8 grid gap-4 sm:max-w-xl">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
                <CalendarIcon size={20} />
              </span>
              <div>
                <p className="font-bold">Quản lý lịch hỗ trợ</p>
                <p className="text-sm text-ink-soft">
                  Theo dõi và sắp xếp lịch hỗ trợ dễ dàng.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-alt">
                <CheckIcon size={20} />
              </span>
              <div>
                <p className="font-bold">Xác nhận booking</p>
                <p className="text-sm text-ink-soft">
                  Cập nhật trạng thái và xác nhận yêu cầu nhanh chóng.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-alt">
                <UserIcon size={20} />
              </span>
              <div>
                <p className="font-bold">Cập nhật hồ sơ & lịch rảnh</p>
                <p className="text-sm text-ink-soft">
                  Giữ thông tin luôn chính xác để Traveler dễ kết nối.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-9 h-64 overflow-hidden rounded-[28px] sm:h-72 lg:absolute lg:bottom-8 lg:right-8 lg:w-[54%]">
            <Image
              src="/assets/images/old-quarter-street.jpg"
              alt="Phố cổ Hà Nội với kiến trúc và đường phố đặc trưng, ảnh minh họa cho hoạt động đồng hành du lịch của Guide WayEcho."
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
          <p className="mt-7 max-w-xs font-quote text-2xl italic lg:absolute lg:bottom-12 lg:left-10">
            Cùng bạn tạo nên những hành trình ý nghĩa.
          </p>
        </section>

        <section
          className="rounded-[28px] border border-line bg-white p-6 shadow-card sm:p-9"
          aria-labelledby="login-title"
        >
          <h2 id="login-title" className="text-4xl">
            Đăng nhập
          </h2>
          <p className="hc-muted mt-1 text-ink-soft">
            Dành cho Guide / Personal Assistant
          </p>

          <form className="mt-7" onSubmit={submit} noValidate>
            <label className="block font-semibold" htmlFor="guide-account">
              Email hoặc số điện thoại
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-line px-4 focus-within:ring-2 focus-within:ring-[#f8ae38]">
              <MailIcon />
              <input
                id="guide-account"
                name="account"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="min-h-[52px] w-full bg-transparent outline-none"
                placeholder="Nhập email hoặc số điện thoại"
              />
            </div>

            <label
              className="mt-5 block font-semibold"
              htmlFor="guide-password"
            >
              Mật khẩu
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-line px-4 focus-within:ring-2 focus-within:ring-[#f8ae38]">
              <LockIcon />
              <input
                id="guide-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="min-h-[52px] w-full bg-transparent outline-none"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5 accent-[#f8ae38]" />{" "}
                Ghi nhớ đăng nhập
              </label>
              <Link
                href="/help#contact"
                className="font-semibold text-accent-dark hover:underline"
              >
                Trợ giúp đăng nhập demo
              </Link>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-6 w-full">
              Đăng nhập →
            </button>
            <div className="my-5 flex items-center gap-3 text-sm text-ink-soft">
              <span className="h-px flex-1 bg-line" />
              <span>hoặc</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <Link href="/guide/register" className="btn-ghost hc-border w-full">
              <UserIcon size={19} /> Trở thành Guide WayEcho
            </Link>
          </form>

          <p className="mt-6 rounded-xl bg-surface-alt px-4 py-3 text-sm text-ink-soft">
            Tài khoản Guide cần được xác minh trước khi nhận lịch. Bản prototype
            hiện mô phỏng bước đăng nhập; chưa kết nối hệ thống xác thực thật.
          </p>
        </section>
      </div>
    </div>
  );
}
