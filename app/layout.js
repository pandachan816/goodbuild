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
  title: "GoodBuild",
  description:
    "GoodBuild 一站式裝修工程團隊：住宅全屋翻新、局部改造、商舖裝修。透明報價、專人監工、售後保障。免費上門睇位報價。",
  applicationName: "GoodBuild",
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
