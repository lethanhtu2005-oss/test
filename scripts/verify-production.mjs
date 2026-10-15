import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { destinations } from "../data/destinations.js";
import { articles } from "../data/articles.js";
import { topics } from "../data/topics.js";

// Production HTTP tests only. No browser, no external calls, isolated runtime data.
const taskTemp = mkdtempSync(path.join(tmpdir(), "wayecho-check-"));
const port = 3487;
const base = `http://127.0.0.1:${port}`;
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      WAYECHO_DB_PATH: path.join(taskTemp, "db.json"),
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let serverLog = "";
child.stdout.on("data", (d) => {
  serverLog += d;
});
child.stderr.on("data", (d) => {
  serverLog += d;
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) => s.replace(/<[^>]*>/g, "").trim();
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [
      m[1],
      m[2].replace(/&amp;/g, "&"),
    ]),
  );
const metrics = {
  pages: 0,
  links: 0,
  images: 0,
  metadata: 0,
  redirects: 0,
  apiFlows: 0,
};
const json = (body) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(base);
      if (r.status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await sleep(200);
  }
  assert.ok(ready, `Production server failed: ${serverLog}`);
  const publicRoutes = [
    "/",
    "/about",
    "/explore",
    "/articles",
    "/destination",
    "/help",
    "/privacy",
    "/terms",
    "/sitemap",
    ...destinations.map((d) => `/destination/${d.slug}`),
    ...articles.map((a) => `/articles/${a.slug}`),
    ...topics.map((t) => `/explore/${t.slug}`),
  ];
  const htmlMap = new Map(),
    links = new Set(),
    images = new Set(),
    titles = new Set(),
    descriptions = new Set();
  for (const route of publicRoutes) {
    const r = await fetch(base + route);
    assert.equal(r.status, 200, route);
    const html = await r.text();
    htmlMap.set(route, html);
    metrics.pages++;
    const hs = [...html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/g)];
    assert.equal(hs.length, 1, `One H1: ${route}`);
    assert.ok(strip(hs[0][1]).length > 2);
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    assert.ok(title, `Title: ${route}`);
    assert.ok(!titles.has(title), `Unique title: ${route}`);
    titles.add(title);
    const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map((m) =>
      attrs(m[0]),
    );
    const desc = tags.find((a) => a.name === "description")?.content;
    assert.ok(desc?.length > 20, `Description: ${route}`);
    assert.ok(!descriptions.has(desc), `Unique description: ${route}`);
    descriptions.add(desc);
    assert.ok(
      tags.some(
        (a) => a.rel === "canonical" && new URL(a.href).pathname === route,
      ),
      `Canonical: ${route}`,
    );
    metrics.metadata++;
    assert.ok(
      !tags.some((a) => a.name === "robots" && a.content.includes("noindex")),
      `Public indexing: ${route}`,
    );
    for (const tag of html.matchAll(/<a\b[^>]*>/g)) {
      const a = attrs(tag[0]);
      assert.ok(a.href !== "#", `Fake link ${route}`);
      if (a.href?.startsWith("/")) {
        links.add(a.href);
        metrics.links++;
      }
    }
    for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
      const a = attrs(tag[0]);
      assert.ok(Object.hasOwn(a, "alt"), `Alt: ${route}`);
      if (a.src?.startsWith("/")) images.add(a.src);
      metrics.images++;
    }
  }
  for (const href of links) {
    const url = new URL(href, base);
    const r = await fetch(url);
    assert.equal(r.status, 200, `Internal link: ${href}`);
    if (url.hash) {
      const html = htmlMap.get(url.pathname) || (await r.text());
      assert.ok(
        html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Anchor ${href}`,
      );
    }
  }
  for (const src of images) {
    const r = await fetch(base + src);
    assert.equal(r.status, 200, `Image ${src}`);
    assert.ok(r.headers.get("content-type")?.startsWith("image/"));
  }
  for (const a of articles) {
    const html = htmlMap.get(`/articles/${a.slug}`);
    assert.ok(
      a.related.some((slug) => html.includes(`href="/articles/${slug}"`)),
      `Related reading: ${a.slug}`,
    );
  }
  for (const old of [
    "/destination?d=ho-guom",
    "/item?slug=van-mieu",
    "/item?id=pho-co",
  ]) {
    const r = await fetch(base + old, { redirect: "manual" });
    assert.equal(r.status, 308);
    assert.ok(r.headers.get("location")?.startsWith("/destination/"));
    metrics.redirects++;
  }
  for (const bad of [
    "/destination/not-a-place",
    "/destination?d=not-a-place",
    "/articles/not-a-story",
    "/explore/not-a-topic",
    "/item?id=not-a-service",
  ]) {
    assert.equal((await fetch(base + bad)).status, 404, bad);
  }
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  for (const route of publicRoutes)
    assert.ok(
      sitemap.includes(`<loc>`) &&
        sitemap.includes(route === "/" ? "/</loc>" : `${route}</loc>`),
    );
  for (const privatePath of [
    "/admin",
    "/profile",
    "/booking",
    "/my-trip",
    "/business",
    "/guide",
    "/notifications",
    "/search",
  ]) {
    assert.ok(!sitemap.includes(`${privatePath}</loc>`));
    const html = await (await fetch(base + privatePath)).text();
    assert.ok(
      /name="robots"[^>]*content="[^"]*noindex/.test(html),
      `Noindex ${privatePath}`,
    );
  }
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.ok(
    robots.includes("Allow: /") &&
      robots.includes("Disallow: /admin") &&
      robots.includes("Sitemap:"),
  );
  const qHtml = await (
    await fetch(base + "/explore?q=V%C4%83n%20Mi%E1%BA%BFu")
  ).text();
  assert.ok(strip(qHtml).includes("1 kết quả"));
  assert.ok(!qHtml.includes('class="ad-label">Quảng cáo đối tác'));
  const item = {
    refId: "qa-place",
    name: "QA only",
    cat: "destination",
    image: "/assets/images/hoang-thanh.webp",
  };
  for (const collection of ["saved", "trip"]) {
    let r = await fetch(`${base}/api/${collection}`, json(item));
    assert.equal(r.status, 201);
    r = await fetch(`${base}/api/${collection}`, json(item));
    assert.equal(r.status, 200);
    assert.ok(
      (await (await fetch(`${base}/api/${collection}`)).json()).some(
        (x) => x.refId === item.refId,
      ),
    );
    assert.equal(
      (
        await fetch(`${base}/api/${collection}?refId=${item.refId}`, {
          method: "DELETE",
        })
      ).status,
      200,
    );
    metrics.apiFlows++;
  }
  let r = await fetch(
    base + "/api/bookings",
    json({
      itemId: "demo-hotel",
      itemName: "QA booking",
      date: "2026-11-01",
      time: "08:00",
      guests: 1,
      assist: true,
      accessibilityRequests: ["Staff assistance"],
      demo: true,
    }),
  );
  assert.equal(r.status, 201);
  const booking = await r.json();
  assert.equal(booking.status, "pending");
  const requests = await (
    await fetch(base + "/api/requests?business=b1")
  ).json();
  assert.ok(
    requests.some(
      (x) => x.bookingId === booking.id && x.content === "Staff assistance",
    ),
  );
  r = await fetch(base + "/api/bookings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: booking.id, status: "confirmed" }),
  });
  assert.equal(r.status, 200);
  metrics.apiFlows++;
  const before = (
    await (await fetch(base + "/api/requests?business=b1")).json()
  ).length;
  assert.equal(
    (
      await fetch(
        base + "/api/bookings",
        json({
          itemId: "demo-hotel",
          itemName: "QA no sharing",
          guests: 1,
          assist: false,
          accessibilityRequests: [],
        }),
      )
    ).status,
    201,
  );
  assert.equal(
    (await (await fetch(base + "/api/requests?business=b1")).json()).length,
    before,
  );
  metrics.apiFlows++;
  assert.equal(
    (
      await fetch(
        base + "/api/bookings",
        json({ itemId: "demo-hotel", itemName: "Invalid", guests: -1 }),
      )
    ).status,
    400,
  );
  const errors = serverLog
    .split("\n")
    .filter((line) => /^(?:Error|TypeError|ReferenceError):/.test(line));
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      {
        status: "PASS",
        ...metrics,
        uniqueImages: images.size,
        uniqueInternalUrls: links.size,
      },
      null,
      2,
    ),
  );
  if (process.env.QA_REPORT)
    writeFileSync(
      process.env.QA_REPORT,
      JSON.stringify(
        {
          status: "PASS",
          ...metrics,
          uniqueImages: images.size,
          uniqueInternalUrls: links.size,
        },
        null,
        2,
      ),
    );
} finally {
  child.kill("SIGTERM");
  await new Promise((r) => {
    if (child.exitCode !== null) return r();
    child.once("exit", r);
    setTimeout(() => {
      child.kill("SIGKILL");
      r();
    }, 3000).unref();
  });
  rmSync(taskTemp, { recursive: true, force: true });
}
