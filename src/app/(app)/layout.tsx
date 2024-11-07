import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  /*
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
  */

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#212A31]">
      <div className="w-full bg-[#212A31]/95 backdrop-blur-sm border-b border-[#748D92]/10 sticky top-0 z-50 shadow-lg shadow-black/10">
        <Navbar />
      </div>
      <main className="flex-grow px-4 md:px-0">
        {children}
      </main>
      <footer className="w-full border-t border-[#748D92]/10 bg-[#212A31]/80 backdrop-blur-sm py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-[#748D92] text-sm text-center">
          © 2024 Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}