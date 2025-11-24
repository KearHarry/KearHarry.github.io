
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  zh: {
    'nav.home': '首页',
    'nav.about': '关于我',
    'nav.all_posts': '全部文章',
    'nav.copyright': '© 2025-至今 Kear',
    
    'home.title': '文章列表',
    'home.search_placeholder': '搜索文章标题、内容或标签...',
    'home.no_posts': '未找到相关文章',
    'home.try_again': '尝试更换搜索关键词或类别。',
    'home.clear_search': '清除搜索',
    'home.read_more': '阅读全文',
    'home.all': '全部',
    
    'profile.role': 'Unity 游戏开发',
    'profile.location': '中国，成都',
    'profile.about_title': '关于我',
    'profile.about_desc': 'Hello！我的昵称千尘，性别男，电子科技大学软件工程大二学生。我有Unity游戏开发经验，计算机基础知识掌握扎实，能够在工作中很好的完成自己的任务。此外，我有着充满激情的工作态度，团队协同作战能力强，同时我也具备独立开发的能力，擅于发现并解决问题。我的执行力强、责任感高、集体荣誉感强、敢于担当。十分期待与您的合作!',
    'profile.exp_title': '工作经历',
    'profile.portfolio_title': '作品集',
    'profile.skills_title': '技能专长',
    
    'music.label': '音乐',
    'music.playlist': '待播清单',
    'music.mode_sequence': '顺序播放',
    'music.mode_loop_all': '列表循环',
    'music.mode_loop_one': '单曲循环',
    'music.mode_shuffle': '随机播放',

    // Categories
    '设计': '设计',
    '工程': '工程',
    '产品': '产品',
    '游戏': '游戏',
    '生活': '生活',
    'UI设计': 'UI设计',
    '交互体验': '交互体验',
    '平面视觉': '平面视觉',
    '前端开发': '前端开发',
    '后端架构': '后端架构',
    '人工智能': '人工智能',
    'DevOps': 'DevOps',
    '产品思维': '产品思维',
    '用户增长': '用户增长',
    '商业分析': '商业分析',
    '独立游戏': '独立游戏',
    '游戏攻略': '游戏攻略',
    '游戏设计': '游戏设计',
    '日常随笔': '日常随笔',
    '旅行摄影': '旅行摄影',
    '好物推荐': '好物推荐'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.all_posts': 'All Posts',
    'nav.copyright': '© 2025-Present Kear',

    'home.title': 'Articles',
    'home.search_placeholder': 'Search title, content or tags...',
    'home.no_posts': 'No posts found',
    'home.try_again': 'Try different keywords or categories.',
    'home.clear_search': 'Clear Search',
    'home.read_more': 'Read More',
    'home.all': 'All',

    'profile.role': 'Senior Frontend Engineer & UI Designer',
    'profile.location': 'Shanghai, China',
    'profile.about_title': 'About Me',
    'profile.about_desc': 'Focused on crafting minimalist and high-performance digital experiences. Bridging the gap between creative vision and technical implementation. I believe the best interface is the one you don\'t notice.',
    'profile.exp_title': 'Experience',
    'profile.portfolio_title': 'Portfolio',
    'profile.skills_title': 'Skills',

    'music.label': 'Music',
    'music.playlist': 'Playlist',
    'music.mode_sequence': 'Sequence',
    'music.mode_loop_all': 'Loop All',
    'music.mode_loop_one': 'Loop One',
    'music.mode_shuffle': 'Shuffle',

    // Categories
    '设计': 'Design',
    '工程': 'Engineering',
    '产品': 'Product',
    '游戏': 'Game',
    '生活': 'Life',
    'UI设计': 'UI Design',
    '交互体验': 'UX',
    '平面视觉': 'Visual Design',
    '前端开发': 'Frontend',
    '后端架构': 'Backend',
    '人工智能': 'AI',
    'DevOps': 'DevOps',
    '产品思维': 'Product Thinking',
    '用户增长': 'Growth',
    '商业分析': 'Business Analysis',
    '独立游戏': 'Indie Games',
    '游戏攻略': 'Guides',
    '游戏设计': 'Game Design',
    '日常随笔': 'Journal',
    '旅行摄影': 'Photography',
    '好物推荐': 'Recommendations'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
