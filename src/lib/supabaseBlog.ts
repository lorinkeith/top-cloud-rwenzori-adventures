import { supabase as configuredClient } from './supabaseClient';
function client() { if (!configuredClient) throw new Error('Blog is not configured yet.'); return configuredClient; }
import type { PublicBlogCategory, PublicBlogComment, PublicBlogPost, PublicBlogTag } from '../types/supabaseBlog';

const fields = 'id,title,slug,excerpt,content,featured_image_url,featured_image_alt,category_id,author_name,status,seo_title,meta_description,canonical_url,allow_comments,published_at,scheduled_at,updated_at,blog_categories(id,name,slug,description,created_at,updated_at)';

function normalizePost<T extends Record<string, unknown>>(post: T) {
  const category = post.blog_categories;
  return { ...post, blog_categories: Array.isArray(category) ? category[0] ?? null : category ?? null } as unknown as PublicBlogPost;
}

export function calculateReadTime(content: string | null | undefined) {
  const words = (content ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export async function getPublicPosts() {
  const { data, error } = await client().from('blog_posts').select(fields).or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${new Date().toISOString()})`).order('published_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as Array<Record<string, unknown>>).map(normalizePost).filter((post) => post.status === 'published' || (post.status === 'scheduled' && post.scheduled_at && new Date(post.scheduled_at) <= new Date()));
}

export async function getPublicPostsByCategory(categorySlug: string) {
  const posts = await getPublicPosts();
  return posts.filter((post) => post.blog_categories?.slug === categorySlug);
}

export async function getPublicCategories() {
  const posts = await getPublicPosts();
  const categoryMap = new Map<string, PublicBlogCategory>();
  posts.forEach((post) => {
    if (post.blog_categories) categoryMap.set(post.blog_categories.id, post.blog_categories);
  });
  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPublicPostBySlug(slug: string) {
  const { data, error } = await client().from('blog_posts').select(fields).eq('slug', slug).or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${new Date().toISOString()})`).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const post = normalizePost(data as Record<string, unknown>);
  if (post.status === 'scheduled' && (!post.scheduled_at || new Date(post.scheduled_at) > new Date())) return null;
  post.blog_tags = await getPostTags(post.id);
  return post;
}

export async function getPostTags(postId: string) {
  const { data, error } = await client().from('blog_post_tags').select('blog_tags(id,name,slug,created_at)').eq('post_id', postId);
  if (error) return [];
  return ((data ?? []) as Array<{ blog_tags: PublicBlogTag | PublicBlogTag[] | null }>).flatMap((row) => Array.isArray(row.blog_tags) ? row.blog_tags : row.blog_tags ? [row.blog_tags] : []);
}

export async function getApprovedComments(postId: string) {
  const { data, error } = await client().from('topcloud_public_blog_comments').select('id,post_id,name,comment,status,created_at').eq('post_id', postId).eq('status', 'approved').order('created_at');
  if (error) throw error;
  return (data ?? []) as PublicBlogComment[];
}

export async function submitPendingComment(input: { postId: string; name: string; email: string; comment: string }) {
  const { error } = await client().from('blog_comments').insert({ post_id: input.postId, name: input.name, email: input.email, comment: input.comment, status: 'pending' });
  if (error) throw error;
}

export async function getRelatedPosts(current: PublicBlogPost, limit = 4) {
  const posts = await getPublicPosts();
  const currentTagIds = new Set((current.blog_tags ?? []).map((tag) => tag.id));
  return posts
    .filter((post) => post.id !== current.id)
    .sort((a, b) => {
      const categoryScore = Number(b.category_id === current.category_id) - Number(a.category_id === current.category_id);
      if (categoryScore) return categoryScore;
      const aTagScore = (a.blog_tags ?? []).filter((tag) => currentTagIds.has(tag.id)).length;
      const bTagScore = (b.blog_tags ?? []).filter((tag) => currentTagIds.has(tag.id)).length;
      if (bTagScore !== aTagScore) return bTagScore - aTagScore;
      return new Date(b.published_at ?? b.updated_at).getTime() - new Date(a.published_at ?? a.updated_at).getTime();
    })
    .slice(0, limit);
}


