import { Noto_Sans_TC, Outfit } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "星級團隊私人推薦｜裝修專案跟進｜Good Build",
  description:
    "只介紹認識、信得過的星級團隊，按工種對口配對，並可跟進至完工。已有報價亦可在簽約前幫忙睇清楚條款。",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-HK"
      className={`${notoSansTC.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
