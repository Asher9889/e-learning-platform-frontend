import { LandingHeader } from '../headers/LandingHeader';

export const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      {/* Main Content: Flex-grow ensures footer always stays at bottom */}
      <main className="flex-grow ">
        {children}
      </main>

      {/* Basic Footer */}
      <footer className="bg-gray-900 text-white p-8 text-center">
        <p>© 2026 Patshala. All rights reserved.</p>
      </footer>
    </div>
  );
};