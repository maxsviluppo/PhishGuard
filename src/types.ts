export type AppStatus = 'ideation' | 'development' | 'testing' | 'production' | 'maintenance';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

export interface DevPlatform {
  github: string;
  vercel: string;
  domain: string;
  hosting: string;
}

export interface GoogleServices {
  hasProperty: boolean;
  ads: boolean;
  admob: boolean;
  adsense: boolean;
  analytics: boolean;
}

export interface PlatformUsage {
  github: boolean;
  studioAi: boolean;
  antigravity: boolean;
  vercel: boolean;
  supabase: boolean;
  firebase: boolean;
  neon: boolean;
  domain: boolean;
  android?: boolean;
  ios?: boolean;
}

export interface AppData {
  id: string;
  name: string;
  status: AppStatus;
  description: string;
  notes: string;
  urgency: UrgencyLevel;
  clientStatus: string;
  devPlatform: DevPlatform;
  googleServices: GoogleServices;
  platformUsage: PlatformUsage;
  todos: Todo[];
  gallery: string[];
  siteUrl: string;
  createdAt: string;
  updatedAt: string;
}
