import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Evegah — EV Fleet SaaS Platform | Smarter Fleets. Greener Tomorrow.',
  description: 'A complete SaaS platform to manage your EV fleet, riders, battery operations, rentals and more — built for a cleaner, smarter and more sustainable future.',
  keywords: [
    'EV Fleet Management',
    'Battery Swapping SaaS',
    'EV Scooter Rental Software',
    'Electric Vehicle Telematics',
    'Evegah Fleet OS',
    'India EV Fleet Platform'
  ],
  icons: {
    icon: '/assets/logo.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
