
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  categories: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface MusicTrack {
  title: string;
  artist: string;
  url: string;
}