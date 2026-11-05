export type PublicBlogCategory = { id: string; name: string; slug: string; description: string | null; created_at: string; updated_at: string };
export type PublicBlogTag = { id: string; name: string; slug: string; created_at: string };
export type PublicBlogPost = {
  id: string; title: string; slug: string; excerpt: string | null; content: string | null; featured_image_url: string | null; featured_image_alt: string | null; category_id: string | null; author_name: string | null; status: 'published' | 'scheduled'; seo_title: string | null; meta_description: string | null; canonical_url: string | null; allow_comments: boolean; published_at: string | null; scheduled_at: string | null; updated_at: string; blog_categories?: PublicBlogCategory | null; blog_tags?: PublicBlogTag[];
};
export type PublicBlogComment = { id: string; post_id: string; name: string; comment: string; status: 'approved'; created_at: string };
