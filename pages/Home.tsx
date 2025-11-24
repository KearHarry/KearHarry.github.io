
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loadAllPosts } from '../utils/markdownParser';
import { BlogPost } from '../types';
import { CATEGORIES, PROFILE_AVATAR_URL } from '../constants';
import GlassCard from '../components/GlassCard';
import { Calendar, ArrowRight, Loader2, Tag, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const POEMS = [
  "海内存知己，天涯若比邻",
  "长风破浪会有时，直挂云帆济沧海",
  "会当凌绝顶，一览众山小",
  "大鹏一日同风起，扶摇直上九万里",
  "山重水复疑无路，柳暗花明又一村",
  "不经一番寒彻骨，怎得梅花扑鼻香",
  "路漫漫其修远兮，吾将上下而求索"
];

const Typewriter: React.FC = () => {
  const [text, setText] = useState('');
  const [poemIndex, setPoemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPoem = POEMS[poemIndex % POEMS.length];
    
    let speed = 150;
    if (isDeleting) speed = 50;
    if (!isDeleting && charIndex === currentPoem.length) speed = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPoem.length) {
        setCharIndex(prev => prev + 1);
        setText(currentPoem.substring(0, charIndex + 1));
      } else if (!isDeleting && charIndex === currentPoem.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(prev => prev - 1);
        setText(currentPoem.substring(0, charIndex - 1));
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPoemIndex(prev => prev + 1);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, poemIndex]);

  return (
    <p className="text-gray-500 min-h-[1.5rem] flex items-center font-medium">
      <span>{text}</span>
      <span className="ml-1 w-[2px] h-4 bg-blue-500 animate-pulse"></span>
    </p>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    loadAllPosts().then(loadedPosts => {
      setPosts(loadedPosts);
      setLoading(false);
    });
  }, []);

  // 移动端展示的分类列表（仅展示一级分类）
  const mobileCategories = useMemo(() => {
    return ['All', ...CATEGORIES.map(c => c.name)];
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;

    // 分类筛选逻辑升级
    if (selectedCategory !== 'All') {
      // 1. 检查 selectedCategory 是否是一个主分类组名
      const categoryGroup = CATEGORIES.find(c => c.name === selectedCategory);

      if (categoryGroup) {
        // 如果选中的是主分类（如“设计”），则匹配文章标签中包含“设计”或者该组下任意子分类（如“UI设计”）的文章
        const validTags = new Set([categoryGroup.name, ...categoryGroup.items]);
        result = result.filter(p => p.categories.some(cat => validTags.has(cat)));
      } else {
        // 如果选中的是具体的子分类，则精确匹配
        result = result.filter(p => p.categories.includes(selectedCategory));
      }
    }

    if (searchQuery.trim()) {
      const keywords = searchQuery.toLowerCase().trim().split(/\s+/);
      result = result.filter(p => {
        const cats = p.categories.join(' ');
        const textToSearch = `${p.title} ${p.excerpt} ${p.content} ${cats}`.toLowerCase();
        return keywords.every(keyword => textToSearch.includes(keyword));
      });
    }
    return result;
  }, [posts, selectedCategory, searchQuery]);

  const handleCategoryClick = (category: string) => {
    setSearchParams({ category });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{t('home.title')}</h1>
          <Typewriter />
        </div>
        
        <Link to="/profile" className="relative group">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <img 
              src={PROFILE_AVATAR_URL}
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-colors" />
        </Link>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-full group z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-10 py-3.5 bg-white/60 border border-gray-200/50 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-md"
          placeholder={t('home.search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Mobile Categories - 只在移动端显示一级分类 */}
      {!loading && (
        <div className="flex flex-wrap gap-2 pb-2 sticky top-0 z-20 backdrop-blur-md -mx-4 px-4 md:mx-0 md:px-0 pt-2 transition-all md:hidden">
          {mobileCategories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${selectedCategory === category 
                  ? 'bg-gray-900 text-white shadow-lg scale-105' 
                  : 'bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm border border-white/40'}
              `}
            >
              {category === 'All' ? t('home.all') : t(category)}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <GlassCard 
                key={post.id} 
                hoverEffect={true}
                onClick={() => navigate(`/post/${post.slug}`)}
                className="animate-slide-up !p-8 min-h-[260px] flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                    {/* 显示前两个分类标签 */}
                    <div className="flex gap-2">
                        {post.categories.slice(0, 3).map(cat => (
                            <span key={cat} className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50/90 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                                <Tag size={12} /> {t(cat)}
                            </span>
                        ))}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed line-clamp-4 text-lg">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mt-6 group-hover:translate-x-1 transition-transform">
                  {t('home.read_more')} <ArrowRight size={16} />
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-20 animate-slide-up">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t('home.no_posts')}</h3>
              <p className="text-gray-500">{t('home.try_again')}</p>
              {searchQuery && (
                <button 
                  onClick={clearSearch} 
                  className="mt-4 text-blue-600 hover:underline font-medium"
                >
                  {t('home.clear_search')}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
