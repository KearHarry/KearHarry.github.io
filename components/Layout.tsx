
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  // 监听用户首次交互（点击或触摸），用于解锁浏览器自动播放限制
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      // 一旦交互过一次，就移除监听器
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative">
      {/* Pure White Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none bg-white">
      </div>

      <Sidebar />

      {/* 
          1. 减少顶部 padding (pt-2 md:pt-4) 使文章上移
          2. 增加底部 padding (pb-64) 防止《拯救森林》等底部文章被播放器遮挡 
      */}
      <main className="flex-1 px-4 pt-2 pb-48 md:pt-4 md:pb-64 md:px-8 lg:pt-6 lg:px-12 max-w-6xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
      
      {/* 全局音乐播放器 - 传入交互状态以触发自动播放 */}
      <MusicPlayer autoPlay={true} userInteracted={hasInteracted} />
    </div>
  );
};

export default Layout;
