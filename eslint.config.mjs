import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      // Các trang đọc localStorage / API trình duyệt sau khi mount để tránh lệch hydration — đây là pattern có chủ đích.
      "react-hooks/set-state-in-effect": "warn",
      // VerifiedImage/Logo dùng <img> để có fallback khi ảnh lỗi.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**", "public/sw.js"] },
];

export default eslintConfig;
