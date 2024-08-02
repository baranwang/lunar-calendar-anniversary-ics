import type { Metadata } from 'next';

import './global.css';

const title = '农历纪念日订阅';
const description = '农历纪念日订阅生成器，轻松创建和管理您的农历重要日期';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['农历纪念日', '农历订阅', 'ICS 生成器', 'iCalendar', '农历事件', '日历订阅', '纪念日提醒', '农历日历', '农历提醒'],
  openGraph: {
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
