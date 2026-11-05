import { sanitizeBlogHtml } from '../utils/sanitizeBlogHtml';
import { useLoadingTask } from '../context/LoadingContext';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { FiAlertCircle as AlertCircle, FiArrowLeft as ArrowLeft, FiCheckCircle as CheckCircle2 } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import { PageLoader } from '../components/blog/BlogLayout';
import { Footer } from '../components/blog/BlogLayout';
import { images } from '../data/images';
import { PageHero } from '../components/PageHero';
const blogHeroImage = images.elephants;
import { FinalCTA } from '../components/blog/BlogLayout';
import { calculateReadTime, formatDate, getApprovedComments, getPublicCategories, getPublicPostBySlug, getRelatedPosts, submitPendingComment } from '../lib/supabaseBlog';
import type { PublicBlogCategory, PublicBlogComment, PublicBlogPost } from '../types/supabaseBlog';

type CommentErrors = Partial<Record<'name' | 'email' | 'comment', string>>;

export function BlogArticlePage() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<PublicBlogPost | null>(null);
  const [related, setRelated] = useState<PublicBlogPost[]>([]);
  const [comments, setComments] = useState<PublicBlogComment[]>([]);
  const [categories, setCategories] = useState<PublicBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedSlug, setLoadedSlug] = useState('');
  const [loadError, setLoadError] = useState('');
  const [values, setValues] = useState({ name: '', email: '', comment: '' });
  const [errors, setErrors] = useState<CommentErrors>({});
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useLoadingTask(submitting);

  useEffect(() => {
    const previousTitle = document.title;
    const selectors = ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'link[rel="canonical"]'];
    const previous = selectors.map(selector => ({ selector, element: document.head.querySelector(selector)?.cloneNode(true) ?? null }));
    let active = true;

    async function load() {
      setLoading(true);
      setLoadError('');

      try {
        const loaded = await getPublicPostBySlug(slug);
        if (!active) return;

        setPost(loaded);
        if (loaded) {
          const [commentData, relatedData, categoryData] = await Promise.all([getApprovedComments(loaded.id), getRelatedPosts(loaded, 5), getPublicCategories()]);
          if (!active) return;

          setComments(commentData);
          setRelated(relatedData);
          setCategories(categoryData);
          const title = loaded.seo_title || loaded.title;
          const description = loaded.meta_description || loaded.excerpt || '';
          document.title = title + ' | Top Cloud Rwenzori Adventures';
          setMeta('meta[name="description"]', 'name', 'description', description);
          setMeta('meta[property="og:title"]', 'property', 'og:title', title);
          setMeta('meta[property="og:description"]', 'property', 'og:description', description);
          setMeta('meta[property="og:image"]', 'property', 'og:image', loaded.featured_image_url || images.elephants);
          setCanonical(loaded.canonical_url || `${window.location.origin}/blog/${loaded.slug}`);
        } else {
          setComments([]);
          setRelated([]);
          setCategories([]);
        }
      } catch {
        if (!active) return;
        setPost(null);
        setComments([]);
        setRelated([]);
        setCategories([]);
        setLoadError("We couldn't load this article right now.");
      } finally {
        if (active) {
          setLoadedSlug(slug);
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
      document.title = previousTitle;
      previous.forEach(({ selector, element }) => { document.head.querySelector(selector)?.remove(); if (element) document.head.appendChild(element); });
    };
  }, [slug]);

  if (loading || loadedSlug !== slug) return <PageLoader />;
  if (loadError) return <><section className="bg-white px-5 py-28 sm:px-6 lg:py-32"><div className="mx-auto max-w-[46rem] text-center"><p className="section-eyebrow">Article Error</p><h1 className="mt-4 text-[2.45rem] font-semibold leading-tight text-[#18181b]">Article could not be loaded.</h1><p className="mx-auto mt-5 max-w-[34rem] text-base leading-7 text-[#5f5a56]">{loadError}</p><Link className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0b7a3a]" to="/blog"><ArrowLeft className="size-4" />Back to Discover</Link></div></section><Footer /></>;
  if (!post) return <><section className="bg-white px-5 py-28 sm:px-6 lg:py-32"><div className="mx-auto max-w-[46rem] text-center"><p className="section-eyebrow">Article Not Found</p><h1 className="mt-4 text-[2.45rem] font-semibold leading-tight text-[#18181b]">This article is not available.</h1><Link className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0b7a3a]" to="/blog"><ArrowLeft className="size-4" />Back to Discover</Link></div></section><Footer /></>;

  const currentPost = post;
  const category = currentPost.blog_categories;

  function updateValue(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage('');
    setSubmitError('');
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: CommentErrors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const comment = values.comment.trim();

    if (!name) nextErrors.name = 'Name is required.';
    if (!email) nextErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email.';
    if (!comment) nextErrors.comment = 'Comment is required.';
    else if (comment.length > 1200) nextErrors.comment = 'Comment must be 1200 characters or fewer.';

    setErrors(nextErrors);
    setMessage('');
    setSubmitError('');
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await submitPendingComment({ postId: currentPost.id, name, email, comment });
      setValues({ name: '', email: '', comment: '' });
      setMessage('Thanks. Your comment has been submitted for review.');
    } catch {
      setSubmitError("We couldn't submit your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <BlogDetailHero post={currentPost} category={category} />
      <article data-scroll-reveal-skip="true" className="bg-white px-5 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="admin-article-body mx-auto max-w-[860px] text-[1.08rem] leading-8 text-[#332f2b] sm:text-[1.13rem] sm:leading-9" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(currentPost.content) }} />
      </article>
      {(related.length || categories.length) ? <ArticleDiscovery posts={related} categories={categories} /> : null}
      {currentPost.allow_comments ? <CommentsSection comments={comments} errors={errors} message={message} submitError={submitError} submitting={submitting} values={values} onChange={updateValue} onSubmit={submitComment} /> : null}
      <FinalCTA heading="Ready for Your Next Adventure?" primaryLabel="Plan Your Journey" primaryHref="/contact" secondaryLabel="Talk to Our Team" secondaryHref="/contact" /><Footer />
    </>
  );
}

function BlogDetailHero({ post, category }: { post: PublicBlogPost; category: PublicBlogPost['blog_categories'] }) {
  return <><PageHero article title={post.title} subtitle={post.excerpt || ''} image={post.featured_image_url || blogHeroImage} eyebrow={category?.name || 'Travel Stories'} /><div className="mx-auto max-w-5xl px-5"><ArticleMeta post={post} /><Link className="mt-5 inline-block font-bold text-luxury-green" to="/blog">Back to Discover</Link>{post.blog_tags?.length ? <p className="mt-4 text-sm text-muted">{post.blog_tags.map(tag => tag.name).join(' · ')}</p> : null}</div></>;
}

function ArticleMeta({ post, variant = 'default' }: { post: PublicBlogPost; variant?: 'default' | 'hero' }) {
  const author = post.author_name || 'Top Cloud Rwenzori Adventures Team';
  const isHero = variant === 'hero';
  return (
    <div className={isHero ? 'mt-8 flex flex-col items-center gap-4 border-y border-white/30 px-2 py-5 sm:flex-row sm:justify-center sm:gap-6' : 'mt-7 flex flex-col gap-4 border-y border-[#e8e8e8] py-5 sm:flex-row sm:items-center sm:justify-between'}>
      <div className="flex items-center gap-3">
        <div className={isHero ? 'grid size-11 shrink-0 place-items-center rounded-full bg-white/18 text-sm font-bold uppercase text-white ring-1 ring-white/30' : 'grid size-11 shrink-0 place-items-center rounded-full bg-[#f0faf2] text-sm font-bold uppercase text-[#007a24]'} aria-hidden="true">{getInitials(author)}</div>
        <div className={isHero ? 'text-left' : ''}>
          <p className={isHero ? 'text-sm font-bold text-white' : 'text-sm font-bold text-[#18181b]'}>{author}</p>
          <p className={isHero ? 'mt-0.5 text-sm text-white' : 'mt-0.5 text-sm text-[#766e67]'}>Top Cloud Rwenzori Adventures Team</p>
        </div>
      </div>
      <p className={isHero ? 'text-sm font-bold uppercase leading-6 text-white' : 'text-sm font-bold uppercase leading-6 text-[#766e67]'}>{formatDate(post.published_at ?? post.scheduled_at)} · {calculateReadTime(post.content)} min read</p>
    </div>
  );
}

function ArticleDiscovery({ posts, categories }: { posts: PublicBlogPost[]; categories: PublicBlogCategory[] }) {
  return (
    <section className="bg-white px-5 pb-8 sm:px-6 sm:pb-10" aria-label="More blog discovery">
      <div className="mx-auto w-full max-w-[1480px] border-t border-[#e8e8e8] pt-14 sm:pt-16 lg:pt-20">
        {posts.length ? <TrendingArticles posts={posts} /> : null}
        {categories.length ? <CategoryShortcuts categories={categories} /> : null}
      </div>
    </section>
  );
}

function TrendingArticles({ posts }: { posts: PublicBlogPost[] }) {
  return (
    <section aria-labelledby="trending-articles-heading">
      <div className="max-w-[48rem]">
        <p className="section-eyebrow">Continue Reading</p>
        <h2 id="trending-articles-heading" className="mt-3 text-[2rem] font-semibold leading-tight text-[#18181b] sm:text-[2.45rem]">Trending on Top Cloud Rwenzori Adventures</h2>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {posts.slice(0, 3).map((post) => <TrendingItem key={post.id} post={post} />)}
      </div>
    </section>
  );
}

function CategoryShortcuts({ categories }: { categories: PublicBlogCategory[] }) {
  return (
    <section className="mt-14 border-t border-[#e8e8e8] pt-10 sm:mt-16 sm:pt-12" aria-labelledby="article-categories-heading">
      <h2 id="article-categories-heading" className="text-[1.75rem] font-semibold leading-tight text-[#18181b]">Categories</h2>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {categories.map((category) => <Link key={category.id} className="rounded-full bg-[#f0faf2] px-3 py-1.5 text-xs font-bold uppercase tracking-normal text-[#00651e] transition-colors hover:bg-[#0b7a3a] hover:text-white" to={`/blog/category/${category.slug}`}>{category.name}</Link>)}
      </div>
    </section>
  );
}

function TrendingItem({ post }: { post: PublicBlogPost }) {
  const category = post.blog_categories;
  return (
    <article>
      <Link className="group block cursor-pointer" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        <span className="block overflow-hidden rounded-[0.75rem] bg-[#f7f7f6]"><img className="aspect-[16/10] w-full object-cover object-center transition duration-300 group-hover:scale-[1.018]" src={post.featured_image_url || images.elephants} alt={post.featured_image_alt || post.title} loading="lazy" decoding="async" /></span>
        <span className="mt-5 block min-w-0">
          {category ? <span className="text-xs font-bold uppercase tracking-normal text-[#0b7a3a]">{category.name}</span> : null}
          <span className="mt-2 line-clamp-2 block text-[1.2rem] font-semibold leading-tight text-[#18181b] transition-colors group-hover:text-[#0b7a3a]">{post.title}</span>
          <span className="mt-3 block text-xs font-bold uppercase leading-5 text-[#766e67]">{formatDate(post.published_at ?? post.scheduled_at)} · {calculateReadTime(post.content)} min read</span>
        </span>
      </Link>
    </article>
  );
}
function CommentsSection({ comments, errors, message, submitError, submitting, values, onChange, onSubmit }: { comments: PublicBlogComment[]; errors: CommentErrors; message: string; submitError: string; submitting: boolean; values: { name: string; email: string; comment: string }; onChange: (field: keyof typeof values, value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="bg-white px-5 pb-16 sm:px-6 sm:pb-20 lg:pb-24" aria-labelledby="comments-heading">
      <div className="mx-auto w-full max-w-[820px] border-t border-[#eaeaea] pt-12 sm:pt-14">
        <h2 id="comments-heading" className="text-[1.75rem] font-semibold leading-tight text-[#18181b]">Comments{comments.length ? ` (${comments.length})` : ''}</h2>
        <div className="mt-6">{comments.length ? <div className="divide-y divide-[#eaeaea]">{comments.map((comment) => <CommentItem comment={comment} key={comment.id} />)}</div> : <p className="text-[1rem] leading-7 text-[#5f5a56]">No comments yet. Be the first to share your thoughts.</p>}</div>
        <form className="mt-10" onSubmit={onSubmit} noValidate>
          <div><h3 className="text-[1.55rem] font-semibold leading-tight text-[#18181b]">Leave a Comment</h3><p className="mt-2 text-sm leading-6 text-[#766e67]">Your email address will not be published.</p></div>
          <div aria-live="polite" className="mt-6 space-y-3">{message ? <p className="inline-flex items-start gap-2 rounded-[0.75rem] border border-[#b8e2c2] bg-[#f0fbf3] px-4 py-3 text-sm font-bold leading-6 text-[#166534]"><CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{message}</p> : null}{submitError ? <p className="inline-flex items-start gap-2 rounded-[0.75rem] border border-[#f3c4be] bg-[#fff5f4] px-4 py-3 text-sm font-bold leading-6 text-[#b42318]"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{submitError}</p> : null}</div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2"><CommentField label="Name" error={errors.name}><input className={fieldClass(Boolean(errors.name))} value={values.name} placeholder="Your name" autoComplete="name" onChange={(event) => onChange('name', event.target.value)} /></CommentField><CommentField label="Email" error={errors.email}><input className={fieldClass(Boolean(errors.email))} type="email" value={values.email} placeholder="you@example.com" autoComplete="email" onChange={(event) => onChange('email', event.target.value)} /></CommentField></div>
          <CommentField label="Comment" error={errors.comment}><textarea className={fieldClass(Boolean(errors.comment), true)} value={values.comment} placeholder="Share your thoughts..." maxLength={1200} onChange={(event) => onChange('comment', event.target.value)} /></CommentField>
          <button className="mt-6 inline-flex h-11 items-center justify-center rounded-[0.65rem] bg-[#0b7a3a] px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#00651e] disabled:cursor-not-allowed disabled:bg-[#8bd29f]" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Comment'}</button>
        </form>
      </div>
    </section>
  );
}

function CommentItem({ comment }: { comment: PublicBlogComment }) {
  return <article className="flex gap-4 py-6 first:pt-0"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f0faf2] text-sm font-bold uppercase text-[#007a24]" aria-hidden="true">{getInitials(comment.name)}</div><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h3 className="text-[1rem] font-bold leading-6 text-[#18181b]">{comment.name}</h3><p className="text-sm text-[#766e67]">{formatDate(comment.created_at)}</p></div><p className="mt-2 text-[1rem] leading-7 text-[#332f2b]">{comment.comment}</p></div></article>;
}

function CommentField({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="mt-5 block"><span className="text-sm font-bold text-[#18181b]">{label}</span><span className="mt-2 block">{children}</span>{error ? <span className="mt-2 block text-sm font-bold text-[#b42318]">{error}</span> : null}</label>; }
function fieldClass(error: boolean, multiline = false) { return 'w-full rounded-[0.65rem] border bg-white px-4 text-[0.95rem] font-medium text-[#18181b] outline-none transition-colors placeholder:text-[#aaa29a] focus:border-[#0b7a3a] focus:ring-2 focus:ring-[#0b7a3a]/10 ' + (multiline ? 'min-h-[9rem] resize-y py-3 leading-7 ' : 'h-11 ') + (error ? 'border-[#b42318]' : 'border-[#e1ddd8]'); }
function getInitials(name: string) { const parts = name.trim().split(/\s+/).filter(Boolean); return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase(); }
function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) { let el = document.head.querySelector<HTMLMetaElement>(selector); if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); } el.setAttribute('content', content); }
function setCanonical(href: string) { let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el); } el.href = href; }







