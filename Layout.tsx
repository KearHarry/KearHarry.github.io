
import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative">
      {/* Dynamic Animated Aurora Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none bg-[#fbfbfd]">
         
         {/* Blob 1: Purple/Pink */}
         <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-aurora-1" />
         
         {/* Blob 2: Blue/Cyan */}
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-aurora-2" />
         
         {/* Blob 3: Orange/Yellow (Accent) */}
         <div className="absolute top-[40%] left-[40%] w-[50vw] h-[50vw] bg-pink-200/30 rounded-full mix-blend-multiply filter blur-[120px] animate-aurora-3" />

      </div>

      <Sidebar />

      <main className="flex-1 px-4 py-8 md:p-8 lg:p-12 max-w-6xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
