
import { BlogPost } from '../types';
import { POST_FILES } from '../constants';

/**
 * Parses frontmatter from a markdown string.
 */
export function parseMarkdownFile(filename: string, rawContent: string): BlogPost {
  // 从路径中提取文件夹名作为大分类，如 'C++/C++面试题（1）.md' => 'C++'
  const folderCategory = filename.includes('/') ? filename.split('/')[0] : null;
  const bareFilename = filename.includes('/') ? filename.split('/').slice(1).join('/') : filename;

  const match = /---\n([\s\S]*?)\n---\n([\s\S]*)/.exec(rawContent);

  if (!match) {
    const fallbackCategories = folderCategory ? [folderCategory] : ['其他'];
    return {
      id: filename,
      slug: bareFilename.replace(/\.md$/, ''),
      title: bareFilename.replace(/\.md$/, ''),
      date: '未知日期',
      excerpt: '',
      content: rawContent,
      categories: fallbackCategories
    };
  }

  const frontmatterBlock = match[1];
  const content = match[2];

  const metadata: Record<string, any> = {};
  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      
      // 增强的数组解析逻辑：处理 [Tag1, Tag2] 格式
      if (value.startsWith('[') && value.endsWith(']')) {
         // 移除首尾括号，按逗号分割，并去除每个元素的首尾空格
         metadata[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      } else {
         metadata[key] = value;
      }
    }
  });

  // 解析分类：优先使用 categories 字段，其次 category，支持逗号分隔
  let categories: string[] = [];
  // 优先查找 categories，如果没有则查找 category
  const rawCats = metadata.categories || metadata.category;
  
  if (Array.isArray(rawCats)) {
    categories = rawCats.map(String);
  } else if (typeof rawCats === 'string') {
    // 支持中英文逗号分隔，去除空项
    categories = rawCats.split(/[,，]/).map(s => s.trim()).filter(Boolean);
  } else {
    categories = [];
  }

  // 将文件夹大分类自动合并（去重）
  if (folderCategory && !categories.includes(folderCategory)) {
    categories.unshift(folderCategory);
  }
  if (categories.length === 0) {
    categories = ['其他'];
  }

  return {
    id: filename,
    // Enhanced slug generation to support multi-language characters (e.g., Chinese)
    slug: metadata.title 
      ? metadata.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)+/g, '') 
      : bareFilename.replace(/\.md$/, ''),
    title: metadata.title || '无标题',
    date: metadata.date || '未知日期',
    excerpt: metadata.excerpt || '',
    content: content.trim(),
    categories: categories
  };
}

/**
 * Fetches and parses all posts defined in POST_FILES.
 */
export async function loadAllPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(
    POST_FILES.map(async (filename) => {
      try {
        // Fetch relative to the public root, encoding each path segment for safety with special characters
        const encodedPath = filename.split('/').map(seg => encodeURIComponent(seg)).join('/');
        const response = await fetch(`posts/${encodedPath}`);
        if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
        const text = await response.text();
        return parseMarkdownFile(filename, text);
      } catch (error) {
        console.error(`Error loading post ${filename}:`, error);
        return null;
      }
    })
  );
  
  return posts.filter((post): post is BlogPost => post !== null);
}
