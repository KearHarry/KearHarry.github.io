
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
    name: 'C++', 
    items: ['面试题', '算法题'] 
  },
  {
    name: 'C#',
    items: ['面试题','工程题']
  },
  {
    name: 'Unity',
    items: ['面试题','工程题']
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
 * 格式: '分类文件夹/文件名.md'
 * 文件夹名对应 CATEGORIES 中的一级分类 name，文章会自动归入该大分类
 */
export const POST_FILES = [
  '游戏/Game_1_拯救森林.md',
  '游戏/Game_2_迷雾森林.md',
  'C++/C++面试题（1）.md',
];

// ==============================================================================
// 👤 个人资料
// ==============================================================================

export const PROFILE_INFO = {
  name: "KearHarry",
  role: "profile.role", // 对应语言包中的 key
  location: "profile.location", // 对应语言包中的 key
  website: "kearharry.design",
  email: "2825450285@qq.com",
  aboutTitle: "profile.about_title",
  aboutDesc: "profile.about_desc"
};

export const PROFILE_AVATAR_URL = "/images/avatar.jpg";

export const SOCIAL_LINKS = {
  github: "https://github.com/KearHarry",
  leetcode: "https://leetcode.cn/u/angry-nobel9kk/"
};

export const EXPERIENCE_DATA: Experience[] = [
  {
    role: 'Unity 游戏开发',
    company: '电子科技大学',
    period: '2024 - 至今',
    description: '使用C#开发制作Unity游戏，具有丰富的游戏设计和开发经验。'
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    title: '迷雾森林',
    description: "Unity 2D横板冒险游戏",
    imageUrl: 'images/Works/1.png',
    link: 'https://github.com/KearHarry/AVG'
  },
  {
    title: '梦溪物理志',
    description: "以中国古代科学家沈括为主人公的物理益智游戏",
    imageUrl: 'images/Works/2.png',
    link: ''
  },
  {
    title: '拯救森林',
    description: "Unity 2D塔防游戏",
    imageUrl: 'images/Works/3.png',
    link: ''
  },
  

];

export const SKILLS_DATA: Skill[] = [
  { category: '游戏开发', items: ['Unity', 'C#', 'C++','Lua','UE'] },
  { category: '后端开发', items: ['Python', 'Java','MySQL','Redis','Springboot','JWT'] },
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