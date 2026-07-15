import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Aura Blog - 프리미엄 블로그 서비스",
  description: "Supabase와 Next.js로 구축된 프리미엄 블로그 서비스입니다. 다양한 글과 사진을 감상해 보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${plusJakarta.variable} ${outfit.variable}`}>
      <body>
        <div className={styles.container}>
          <header className={styles.header}>
            <Link href="/">
              <div className={styles.logo}>
                <span>AURA</span>
                <span className="gradient-text">BLOG</span>
                <div className={styles.logoDot} />
              </div>
            </Link>
            <nav className={styles.nav}>
              <Link href="/" className={styles.navLink}>
                피드
              </Link>
              <Link href="/write" className={styles.navLink}>
                글쓰기
              </Link>
            </nav>
          </header>
          
          <main className={styles.main}>
            {children}
          </main>
          
          <footer className={styles.footer}>
            <div className={styles.logo} style={{ fontSize: '1.2rem' }}>
              <span>AURA</span>
              <span className="gradient-text">BLOG</span>
            </div>
            <p className={styles.footerText}>
              &copy; {new Date().getFullYear()} AURA BLOG. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}

