import { OrganizationShort } from './organization';

export interface NewsInterface {
  created_at: string;
  id: number;
  image: string;
  published: boolean;
  published_at: Date;
  title: string;
  updated_at: string;
  organization: OrganizationShort;
  excerpt: string;
  tags?: string[];
}

export interface NextPrevNewsButtons {
  id: number;
  organization_id: number;
}

export interface INewsDetails {
  content: string;
  created_at: string;
  id: number;
  preview: string;
  excerpt: string;
  prev?: NextPrevNewsButtons;
  next?: NextPrevNewsButtons;
  organization: {
    avatar?: string;
    id: number;
    name: string;
    short_name: string;
    type_id: number;
    type_name: string;
  };
  published: boolean;
  title: string;
  updated_at: string;
  published_at: Date;
  tags?: string[];
  user_id: {
    id: number;
    public_avatar?: string;
    public_family?: string;
    public_name?: string;
  };
}
