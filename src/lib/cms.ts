import type { BlogPost } from '../pages/BlogPage';
import { supabase } from './supabase';

export type CmsEntryType = 'news' | 'blog';
export type CmsEntryStatus = 'draft' | 'published';

export interface CmsEntry {
  id: string;
  type: CmsEntryType;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string | null;
  source_url: string | null;
  status: CmsEntryStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsEntryInput {
  id?: string;
  type: CmsEntryType;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content_html: string;
  cover_image_url?: string | null;
  source_url?: string | null;
  status: CmsEntryStatus;
  published_at?: string | null;
}

export interface SiteSetting {
  key: string;
  value_json: unknown;
  created_at: string;
  updated_at: string;
}

const contentTable = 'cms_entries';
const siteSettingsTable = 'site_settings';
const mediaBucket = 'cms-media';

const dateFormatter = new Intl.DateTimeFormat('cs-CZ', {
  month: 'long',
  year: 'numeric'
});

export const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

const extFromMime = (mime: string | undefined | null) => {
  if (!mime) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('gif')) return 'gif';
  if (mime.includes('svg')) return 'svg';
  return 'jpg';
};

const extFromUrl = (value: string) => {
  try {
    const { pathname } = new URL(value);
    const ext = pathname.split('.').pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  } catch {
    return undefined;
  }
  return undefined;
};

export const mapCmsEntryToBlogPost = (entry: CmsEntry): BlogPost => ({
  id: entry.id,
  title: entry.title,
  date: entry.published_at ? dateFormatter.format(new Date(entry.published_at)) : 'průběžně',
  category: entry.category,
  excerpt: entry.excerpt,
  imageUrl: entry.cover_image_url ?? undefined,
  contentHtml: entry.content_html,
  slug: entry.slug,
  sourceUrl: entry.source_url ?? undefined
});

export const fetchPublicEntries = async (type: CmsEntryType) => {
  const { data, error } = await supabase
    .from(contentTable)
    .select('*')
    .eq('type', type)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as CmsEntry[];
};

export const fetchAdminEntries = async () => {
  const { data, error } = await supabase
    .from(contentTable)
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CmsEntry[];
};

export const fetchSiteSettings = async (keys?: string[]) => {
  let query = supabase
    .from(siteSettingsTable)
    .select('*')
    .order('key', { ascending: true });

  if (keys && keys.length > 0) {
    query = query.in('key', keys);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SiteSetting[];
};

export const saveSiteSetting = async (key: string, valueJson: unknown) => {
  const { data, error } = await supabase
    .from(siteSettingsTable)
    .upsert(
      {
        key,
        value_json: valueJson
      },
      {
        onConflict: 'key'
      }
    )
    .select('*')
    .single();

  if (error) throw error;
  return data as SiteSetting;
};

export const saveEntry = async (entry: CmsEntryInput) => {
  const payload = {
    type: entry.type,
    title: entry.title,
    slug: entry.slug,
    category: entry.category,
    excerpt: entry.excerpt,
    content_html: entry.content_html,
    cover_image_url: entry.cover_image_url ?? null,
    source_url: entry.source_url ?? null,
    status: entry.status,
    published_at: entry.published_at ?? null
  };

  if (entry.id) {
    const { data, error } = await supabase
      .from(contentTable)
      .update(payload)
      .eq('id', entry.id)
      .select('*')
      .single();

    if (error) throw error;
    return data as CmsEntry;
  }

  const { data, error } = await supabase
    .from(contentTable)
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data as CmsEntry;
};

export const deleteEntry = async (id: string) => {
  const { error } = await supabase.from(contentTable).delete().eq('id', id);
  if (error) throw error;
};

export const isCurrentUserAdmin = async () => {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) throw error;
  return Boolean(data);
};

export const uploadImageFileToStorage = async (file: File, folder = 'covers') => {
  const extension = extFromMime(file.type);
  const baseName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
  const filePath = `${folder}/${Date.now()}-${baseName}.${extension}`;

  const { error } = await supabase.storage.from(mediaBucket).upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false
  });

  if (error) throw error;
  return supabase.storage.from(mediaBucket).getPublicUrl(filePath).data.publicUrl;
};

export const uploadImageFromUrlToStorage = async (imageUrl: string, folder = 'covers') => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Stažení obrázku selhalo (${response.status}).`);
  }

  const blob = await response.blob();
  const extension = extFromUrl(imageUrl) ?? extFromMime(blob.type);
  const baseName = slugify(imageUrl.split('/').pop() ?? 'image') || 'image';
  const filePath = `${folder}/${Date.now()}-${baseName}.${extension}`;

  const { error } = await supabase.storage.from(mediaBucket).upload(filePath, blob, {
    cacheControl: '3600',
    contentType: blob.type || undefined,
    upsert: false
  });

  if (error) throw error;
  return supabase.storage.from(mediaBucket).getPublicUrl(filePath).data.publicUrl;
};
