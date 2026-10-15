import Link from "next/link";
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Đường dẫn trang">
      <ol className="breadcrumbs">
        <li>
          <Link href="/">Trang chủ</Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
