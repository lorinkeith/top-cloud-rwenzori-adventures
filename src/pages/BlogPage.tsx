import { useEffect, useState } from 'react';
import { FiArrowRight as ArrowRight, FiSearch as Search } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { PageLoader } from '../components/blog/BlogLayout';
import { Footer } from '../components/blog/BlogLayout';
import { FinalCTA } from '../components/blog/BlogLayout';
import { calculateReadTime, formatDate, getPublicPosts } from '../lib/supabaseBlog';
import { images } from '../data/images';
import { PageHero } from '../components/PageHero';
const blogHeroImage = images.elephants;
import type { PublicBlogPost } from '../types/supabaseBlog';

export function BlogPage() {
  const [posts, setPosts] = useState<PublicBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    setError('');
    getPublicPosts()
      .then((data) => {
        if (active) setPosts(data);
      })
      .catch(() => {
        if (active) setError('Blog articles could not be loaded right now.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHero title="Discover" subtitle="Discover inspiring destinations, travel tips, safari experiences, and stories from Uganda and beyond." image={blogHeroImage} />

      <section className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:py-24" aria-label="Blog articles">
        <div className="mx-auto w-full max-w-7xl">
          {error ? <p className="mb-8 rounded-[1rem] border border-[#ead8c8] bg-white px-4 py-3 text-sm font-bold text-[#5f5a56]">{error}</p> : posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => <BlogCard key={post.id} post={post} />)}
            </div>
          ) : <EmptyBlogState compact />}
        </div>
      </section>

      <FinalCTA heading="Ready for Your Next Adventure?" primaryLabel="Plan Your Journey" primaryHref="/contact" secondaryLabel="Talk to Our Team" secondaryHref="/contact" />
      <Footer />
    </>
  );
}

export function BlogCard({ post }: { post: PublicBlogPost }) {
  const category = post.blog_categories;
  return (
    <article className="min-h-full">
      <Link className="group flex min-h-full cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-[#e7e2dd] bg-white shadow-[0_14px_36px_rgb(24_24_27/0.05)] transition-colors duration-200 hover:border-[#0b7a3a]/35" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        <span className="overflow-hidden bg-[#f7f7f6]"><img className="aspect-[4/3] w-full object-cover object-center transition duration-500 group-hover:scale-[1.018]" src={post.featured_image_url || images.elephants} alt={post.featured_image_alt ?? ''} loading="lazy" decoding="async" /></span>
        <span className="flex flex-1 flex-col p-6 sm:p-7">
          <span className="text-xs font-bold uppercase tracking-normal text-[#0b7a3a]">{category?.name ?? 'Insights'}</span>
          <span className="mt-3 text-[1.35rem] font-semibold leading-tight text-[#18181b] transition-colors group-hover:text-[#0b7a3a]">{post.title}</span>
          <span className="mt-3 text-sm leading-6 text-[#5f5a56]">{post.excerpt}</span>
          <span className="mt-4 text-xs font-bold uppercase text-[#766e67]">{formatDate(post.published_at ?? post.scheduled_at)} - {calculateReadTime(post.content)} min read</span>
          <span className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-bold text-[#0b7a3a] transition-colors duration-smooth group-hover:text-[#00651e]">Read Article<ArrowRight className="size-4 transition-transform duration-smooth group-hover:translate-x-1" aria-hidden="true" /></span>
        </span>
      </Link>
    </article>
  );
}

function EmptyBlogState({ compact = false }: { compact?: boolean }) {
  return <div className={'mx-auto max-w-[42rem] rounded-[1.35rem] border border-[#ead8c8] bg-white p-8 text-center shadow-[0_18px_45px_rgb(63_45_30/0.06)] ' + (compact ? 'mt-10' : 'my-20')}><Search className="mx-auto size-10 text-[#0b7a3a]" aria-hidden="true" /><h2 className="mt-4 text-2xl font-semibold text-[#18181b]">No published articles yet.</h2><p className="mt-3 text-base leading-7 text-[#5f5a56]">Travel stories, safari guides, and destination insights will appear here.</p></div>;
}



