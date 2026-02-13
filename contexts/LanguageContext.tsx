
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
    'C++': 'C++',
    'C#': 'C#',
    'Unity': 'Unity',
    '游戏': '游戏',
    '生活': '生活',
    'C++面试题': 'C++面试题',
    'C++算法题': 'C++算法题',
    'C#面试题': 'C#面试题',
    'C#工程题': 'C#工程题',
    'Unity面试题': 'Unity面试题',
    'Unity工程题': 'Unity工程题',
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

    'profile.role': 'Unity Game Developer',
    'profile.location': 'Chengdu, China',
    'profile.about_title': 'About Me',
    'profile.about_desc': 'Hello! My nickname is Qianchen. I am a male sophomore student majoring in Software Engineering at UESTC. I have experience in Unity game development and a solid foundation in computer science, enabling me to complete tasks effectively. I am passionate about my work, have strong teamwork skills, and am also capable of independent development with good problem-solving abilities. I am highly executive, responsible, have a strong sense of collective honor, and am willing to take on responsibilities. I look forward to working with you!',
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
    'C++': 'C++',
    'C#': 'C#',
    'Unity': 'Unity',
    '游戏': 'Game',
    '生活': 'Life',
    'C++面试题': 'C++ Interview',
    'C++算法题': 'C++ Algorithm',
    'C#面试题': 'C# Interview',
    'C#工程题': 'C# Engineering',
    'Unity面试题': 'Unity Interview',
    'Unity工程题': 'Unity Engineering',
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
