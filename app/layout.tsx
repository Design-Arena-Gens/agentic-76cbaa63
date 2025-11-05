import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agentic SEO Article Generator',
  description: 'Generate unique, humanized, SEO-ready articles with web research.',
  metadataBase: new URL('https://agentic-76cbaa63.vercel.app'),
  openGraph: {
    title: 'Agentic SEO Article Generator',
    description: 'Generate unique, humanized, SEO-ready articles with web research.',
    url: 'https://agentic-76cbaa63.vercel.app',
    siteName: 'Agentic Writer',
    images: [
      {
        url: 'https://source.unsplash.com/featured/1200x630/?writing,seo',
        width: 1200,
        height: 630,
        alt: 'Agentic SEO Writer'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Agentic SEO Article Generator</h1>
            <p className="sub">Unique, humanized long-form content with real web context.</p>
          </header>
          {children}
          <footer className="footer">Built for fast Vercel deployment.</footer>
        </div>
      </body>
    </html>
  );
}
