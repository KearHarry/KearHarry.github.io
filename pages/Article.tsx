
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { loadAllPosts } from '../utils/markdownParser';
import { BlogPost } from '../types';
import GlassCard from '../components/GlassCard';
import { ArrowLeft, Calendar, Share2, Loader2, Tag, Copy, Check, Clipboard } from 'lucide-react';

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const allPosts = await loadAllPosts();
      const found = allPosts.find(p => p.slug === slug);
      setPost(found || null);
      setLoading(false);
    };
    
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  // Custom renderers for Markdown
  const markdownComponents: Components = {
    code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        const codeString = String(children).replace(/\n$/, '');
        
        // State for the copy button (using a local component approach would be cleaner, but this is inside a render function)
        // We can't use hooks directly inside this callback unless we extract it to a component.
        // So we extract the CodeBlock logic below.
        return !inline && match ? (
           <CodeBlock language={match[1]} value={codeString} {...props} />
        ) : (
           <code className={className} {...props}>{children}</code>
        );
    },
    img: ({ node, ...props }) => {
      let rawSrc = typeof props.src === 'string' ? props.src : '';
      if (!rawSrc) return null;
      let finalSrc = rawSrc;
      if (!rawSrc.startsWith('http') && !rawSrc.startsWith('data:')) {
         const cleanPath = rawSrc.replace(/^(\.\/|\/)/, '');
         finalSrc = `/${cleanPath}`;
      }
      return (
        <span className="block my-6">
            <img
              {...props}
              src={finalSrc}
              className="markdown-image mx-auto" 
              title={props.alt}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.getAttribute('data-error-handled')) return;
                img.setAttribute('data-error-handled', 'true');
                img.classList.add('image-error'); 
                img.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.className = "flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-400 my-4";
                errorDiv.innerHTML = `
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21l-4.486-4.494M9 5h6a2 2 0 0 1 2 2v6m0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.5"></path><polyline points="3 15 9 9 11 11"></polyline></svg>
                    <span class="mt-2 text-sm font-medium">图片未上传: ${finalSrc.split('/').pop()}</span>
                `;
                img.parentNode?.insertBefore(errorDiv, img.nextSibling);
              }}
            />
        </span>
      );
    },
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-8 rounded-xl border border-gray-200/60 shadow-sm bg-white scrollbar-hide">
        <table {...props} className="w-full border-collapse text-sm" />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead {...props} className="bg-gray-50/80 text-gray-900 font-semibold backdrop-blur-sm" />
    ),
    th: ({ node, ...props }) => (
      <th {...props} className="px-4 py-4 text-center border-b border-gray-200 whitespace-nowrap tracking-wide text-xs uppercase text-gray-500 font-bold bg-gray-50/50 align-middle" />
    ),
    td: ({ node, ...props }) => (
      <td {...props} className="px-4 py-4 border-b border-gray-100 text-gray-600 align-middle text-center" />
    ),
    a: ({ node, ...props }) => (
      <a {...props} className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-600 transition-all duration-200" target="_blank" rel="noopener noreferrer" />
    ),
    h1: ({ node, ...props }) => <h1 {...props} className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-gray-900 tracking-tight" />,
    h2: ({ node, ...props }) => <h2 {...props} className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-gray-900 tracking-tight border-b border-gray-100 pb-2" />,
    h3: ({ node, ...props }) => <h3 {...props} className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900" />,
    h4: ({ node, ...props }) => <h4 {...props} className="text-lg font-bold mt-6 mb-3 text-gray-900" />,
    blockquote: ({ node, ...props }) => (
      <blockquote {...props} className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50/50 rounded-r-lg italic text-gray-600" />
    ),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-300">未找到该文章</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">返回首页</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors px-4 md:px-0"
      >
        <ArrowLeft size={18} /> 返回列表
      </button>

      <GlassCard className="min-h-[60vh] !p-6 md:!p-12 !rounded-3xl">
        <header className="mb-10 border-b border-gray-100 pb-8">
          <div className="flex flex-wrap justify-between items-start gap-4">
             <div className="flex flex-wrap gap-3">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase">
                 <Calendar size={12} /> {post.date}
               </span>
               {/* 显示所有分类标签 */}
               {post.categories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold tracking-wide uppercase hover:bg-gray-200 transition-colors cursor-default">
                    <Tag size={12} /> {cat}
                  </span>
               ))}
             </div>
             <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors" title="分享">
               <Share2 size={18} />
             </button>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-8 mb-4 leading-tight tracking-tighter">
            {post.title}
          </h1>
        </header>

        <div className="markdown-body">
          <ReactMarkdown 
            components={markdownComponents}
            remarkPlugins={[remarkGfm]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </GlassCard>
    </div>
  );
};

// Separate component to handle the copy logic and state
const CodeBlock = ({ language, value, ...props }: { language: string, value: string, [key: string]: any }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-8 rounded-xl overflow-hidden shadow-2xl border border-gray-800/50 bg-[#282c34]">
            {/* Mac-style Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#21252b] border-b border-[#181a1f]">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors" />
                </div>
                
                {/* Copy Button - Icon Only */}
                <button 
                    onClick={handleCopy}
                    className={`
                        flex items-center justify-center w-8 h-8 rounded-md
                        transition-all duration-200
                        ${copied 
                            ? 'text-green-400 bg-green-400/10' 
                            : 'text-gray-400 hover:text-white hover:bg-white/10'}
                    `}
                    title={copied ? '已复制' : '复制代码'}
                >
                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                </button>
            </div>

            <div className="relative">
                <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{ margin: 0, padding: '1.5rem', paddingBottom: '3rem', fontSize: '0.95rem', lineHeight: '1.6' }}
                    wrapLines={true}
                    {...props}
                >
                    {value}
                </SyntaxHighlighter>

                {/* Language Label - Boxed & Highlighted */}
                <div className="absolute bottom-3 right-4 pointer-events-none select-none z-10">
                     <span className="text-[11px] font-bold text-blue-200 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider font-mono shadow-sm backdrop-blur-sm">
                        {language || 'TEXT'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Article;
