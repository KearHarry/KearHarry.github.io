
import { Experience, Skill, MusicTrack, Project } from './types';

// ==============================================================================
// 🔧 网站内容配置中心
// ==============================================================================

export interface CategoryGroup {
  name: string;
  items: string[];
}

/**
 * 🏷️ 分类配置（支持二级分类）
 */
export const CATEGORIES: CategoryGroup[] = [
  { 
    name: '设计', 
    items: ['UI设计', '交互体验', '平面视觉'] 
  },
  { 
    name: '工程', 
    items: ['前端开发', '后端架构', '人工智能', 'DevOps'] 
  },
  { 
    name: '产品', 
    items: ['产品思维', '用户增长', '商业分析'] 
  },
  { 
    name: '游戏', 
    items: ['独立游戏', '游戏攻略', '游戏设计'] 
  },
  { 
    name: '生活', 
    items: ['日常随笔', '旅行摄影', '好物推荐'] 
  }
];

/**
 * 📝 文章列表
 */
export const POST_FILES = [
  'Game_1_save_the_forest.md',
];

// ==============================================================================
// 👤 个人资料
// ==============================================================================

export const PROFILE_AVATAR_URL = "/images/avatar.jpg";

export const SOCIAL_LINKS = {
  github: "https://github.com/KearHarry",
  leetcode: "https://leetcode.cn/u/your-username"
};

export const EXPERIENCE_DATA: Experience[] = [
  {
    role: '高级前端工程师',
    company: '科技创新有限公司',
    period: '2021 - 至今',
    description: '主导 React 重构工作，将网站性能提升了 40%，并负责指导初级开发人员的技术成长。'
  },
  {
    role: 'UI/UX 设计师',
    company: '创意工作室',
    period: '2019 - 2021',
    description: '负责移动应用的设计系统搭建，以及高保真原型的设计与交互实现。'
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    title: '拯救森林',
    description: 'Unity 策略塔防游戏',
    imageUrl: 'images/tower_thunder_1.png',
    link: 'https://github.com/your-username/save-the-forest'
  },
  {
    title: '个人网站',
    description: 'React + Tailwind 极简作品集',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    link: 'https://github.com/your-username/portfolio'
  },
  {
    title: '智能家居控制',
    description: 'IoT 物联网控制中心',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a16617ce?auto=format&fit=crop&q=80&w=800',
    link: 'https://github.com/your-username/smart-home'
  },
    {
    title: '智能家居控制',
    description: 'IoT 物联网控制中心',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a16617ce?auto=format&fit=crop&q=80&w=800',
    link: 'https://github.com/your-username/smart-home'
  },
    {
    title: '智能家居控制',
    description: 'IoT 物联网控制中心',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a16617ce?auto=format&fit=crop&q=80&w=800',
    link: 'https://github.com/your-username/smart-home'
  }
];

export const SKILLS_DATA: Skill[] = [
  { category: '前端开发', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
  { category: '设计能力', items: ['Figma', 'Adobe XD', 'Motion Design'] },
  { category: '工具/运维', items: ['Git', 'Docker', 'Vite'] }
];

// ==============================================================================
// 🎵 背景音乐 (网络调试模式)
// ==============================================================================

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    title: '午后放松',
    artist: '舒缓节拍',
    // 使用稳定的网络资源代替本地文件，防止加载失败
    url: '/music/1.mp3'
  },
  {
    title: '静谧钢琴',
    artist: '治愈系',
    url: '/music/2.mp3'
  },
];