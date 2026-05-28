import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '紫微斗数 · 命盘排盘',
  description: '紫微斗数命盘排盘与白话解读 — 水墨风水版',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;500;700&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#f5efe0] text-[#3d3226]" style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(180,150,100,0.12) 0%, transparent 70%), radial-gradient(ellipse at 80% 100%, rgba(140,120,90,0.08) 0%, transparent 60%)',
      }}>
        {children}
      </body>
    </html>
  );
}
