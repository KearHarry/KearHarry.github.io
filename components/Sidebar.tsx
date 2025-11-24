
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Home, User, Github, CodeXml, ChevronRight } from 'lucide-react';
import { CATEGORIES, SOCIAL_LINKS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { language, toggleLanguage, t } = useLanguage();
  const currentCategory = searchParams.get('category') || 'All';
  
  const isActivePath = (path: string) => location.pathname === path && location.search === '';
  const isHome = location.pathname === '/';

  const navItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: User, label: t('nav.about'), path: '/profile' },
  ];

  // 检查某个主分类是否处于激活状态（自己被选中，或其子分类被选中）
  const isGroupActive = (groupName: string, items: string[]) => {
    return currentCategory === groupName || items.includes(currentCategory);
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 md:h-screen md:sticky md:top-0 flex flex-col justify-between py-8 px-4 md:px-6 bg-[#fbfbfd]/80 backdrop-blur-sm border-r border-white/50">
      {/* Logo & Language Toggle Area */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="h-10 px-4 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg tracking-wide select-none">
          Kear
        </div>
        
        {/* iOS Style Segmented Control for Language */}
        <div className="flex items-center p-1 bg-gray-200/50 rounded-full border border-white/50 backdrop-blur-md shadow-inner select-none">
            <button 
                onClick={() => language === 'en' && toggleLanguage()}
                className={`
                    px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ease-out
                    ${language === 'zh' 
                        ? 'bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.1)] scale-100' 
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'}
                `}
            >
                中
            </button>
            <button 
                onClick={() => language === 'zh' && toggleLanguage()}
                className={`
                    px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ease-out
                    ${language === 'en' 
                        ? 'bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.1)] scale-100' 
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'}
                `}
            >
                En
            </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full overflow-y-auto scrollbar-hide">
        <ul className="flex md:flex-col justify-around md:justify-start gap-3 md:gap-5">
          {navItems.map((item) => {
            // Check active state. For Home, it's active if path is / AND category is All
            const isItemActive = item.path === '/' 
                ? isHome && currentCategory === 'All'
                : isActivePath(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                    ${isItemActive 
                      ? 'bg-white shadow-md text-gray-900' 
                      : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'}
                  `}
                >
                  <item.icon size={26} strokeWidth={isItemActive ? 2.5 : 2} />
                  {/* 增大一级导航字体 至 text-lg (18px) */}
                  <span className="hidden lg:block font-bold text-lg tracking-tight">{item.label}</span>
                </Link>

                {/* Categories - Nested Logic */}
                {item.path === '/' && (isHome || location.pathname === '/') && (
                  <div className="hidden md:flex flex-col mt-4 space-y-1.5 mb-2 animate-slide-up pl-2">
                    
                    {/* 全部 */}
                    <Link 
                        to="/?category=All"
                        className={`
                            relative flex items-center px-4 py-2.5 mx-2 rounded-lg text-base font-medium transition-all duration-200
                            ${currentCategory === 'All' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'}
                        `}
                    >
                        {t('nav.all_posts')}
                    </Link>

                    {CATEGORIES.map((group) => {
                        const active = isGroupActive(group.name, group.items);
                        
                        return (
                            <div key={group.name} className="flex flex-col">
                                {/* Main Category */}
                                <Link 
                                    to={`/?category=${group.name}`}
                                    className={`
                                        relative flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg text-base font-medium transition-all duration-200 group
                                        ${currentCategory === group.name 
                                            ? 'text-blue-600 bg-blue-50/50' 
                                            : active 
                                                ? 'text-gray-800 font-bold' 
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'}
                                    `}
                                >
                                    <span>{t(group.name)}</span>
                                    {active && <div className="w-1 h-5 bg-blue-500 rounded-full absolute left-0 top-1/2 -translate-y-1/2 -ml-2"></div>}
                                </Link>

                                {/* Sub Categories (Expanded if active) */}
                                <div className={`
                                    overflow-hidden transition-all duration-300 ease-in-out ml-6 border-l-2 border-gray-100
                                    ${active ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
                                `}>
                                    {group.items.map(subItem => (
                                        <Link
                                            key={subItem}
                                            to={`/?category=${subItem}`}
                                            className={`
                                                block pl-4 py-2 text-[15px] transition-colors rounded-r-lg
                                                ${currentCategory === subItem 
                                                    ? 'text-blue-600 font-semibold bg-gradient-to-r from-blue-50/50 to-transparent' 
                                                    : 'text-gray-400 hover:text-gray-600'}
                                            `}
                                        >
                                            {t(subItem)}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Socials */}
      <div className="hidden md:flex flex-col gap-4 mt-auto px-2">
        <div className="h-px bg-gray-200 w-full" />
        <div className="flex justify-center lg:justify-start gap-4">
          {SOCIAL_LINKS.github && (
            <a 
              href={SOCIAL_LINKS.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              title="GitHub"
            >
              <Github size={20} />
            </a>
          )}
          
          {SOCIAL_LINKS.leetcode && (
            <a 
              href={SOCIAL_LINKS.leetcode} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#ffa116] transition-colors"
              title="LeetCode"
            >
              <CodeXml size={20} />
            </a>
          )}
        </div>
        <p className="hidden lg:block text-xs text-gray-400 font-medium">{t('nav.copyright')}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
