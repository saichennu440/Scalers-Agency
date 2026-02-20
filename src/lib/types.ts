export type ContentType = 'image' | 'video' | 'text';

export interface ClientContent {
  id: string;
  title: string;
  description: string;
  content_type: ContentType;
  content_url: string;
  content_text: string;
  client_name: string;
  client_logo_url: string;
  category: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export type Page = 'home' | 'clients' | 'services' | 'about' | 'contact' | 'admin';
