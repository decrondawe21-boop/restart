import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, X } from 'lucide-react';

export interface BlogPost {
  id?: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  imageUrl?: string;
  contentHtml?: string;
  slug?: string;
  sourceUrl?: string;
}

interface BlogPageProps {
  posts: BlogPost[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({
  posts,
  eyebrow = 'Blog REST||ART',
  title = 'Novinky',
  highlight = 'a aktuality',
  description = 'Pravidelně sdílíme průběh realizace, výsledky programů a klíčové milníky projektu REST||ART INTEGRACE.'
}) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = useMemo(
    () =>
      posts.find((post) => (post.id ?? post.slug ?? post.title) === selectedPostId) ?? null,
    [posts, selectedPostId]
  );
  const selectedPostHtml = selectedPost?.contentHtml?.trim();

  useEffect(() => {
    if (!selectedPost) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPostId(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedPost]);

  return (
    <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/10 pb-12">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
              {eyebrow}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
              {title} <br /><span className="text-cyan-300 headline-thin">{highlight}</span>
            </h2>
          </div>
          <p className="text-white/40 font-light max-w-md text-sm">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const postKey = post.id ?? post.slug ?? post.title;
            const detailHtml = post.contentHtml?.trim();

            return (
            <article key={postKey} className="glass-panel overflow-hidden rounded-[2.5rem] border-white/10 transition-all duration-500 group hover:-translate-y-2 hover:border-cyan-400/30">
              {post.imageUrl && (
                <div className="aspect-[16/10] overflow-hidden border-b border-white/10 bg-black/20">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              )}

              <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-400">{post.category}</span>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{post.date}</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight mb-4 group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-white/50 font-light leading-relaxed">{post.excerpt}</p>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedPostId(postKey)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition hover:text-cyan-300"
                >
                  Číst detail
                  <ArrowRight size={14} className="text-cyan-400 transition-transform group-hover:translate-x-1" />
                </button>
                {post.sourceUrl && (
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/35 transition hover:text-cyan-300"
                  >
                    Zdroj
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              </div>
            </article>
          )})}
        </div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 md:p-8">
          <button
            type="button"
            aria-label="Zavřít detail článku"
            onClick={() => setSelectedPostId(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2.8rem] border border-white/10 bg-[#031012]/95 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">{selectedPost.category}</p>
                <p className="mt-2 text-sm text-white/40">{selectedPost.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPostId(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(92vh-84px)] overflow-y-auto px-6 py-6 md:px-8 md:py-8">
              {selectedPost.imageUrl && (
                <div className="mb-8 overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/20">
                  <img src={selectedPost.imageUrl} alt={selectedPost.title} className="max-h-[420px] w-full object-cover" />
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-3xl font-black leading-tight text-white md:text-5xl">{selectedPost.title}</h3>
                <p className="max-w-3xl text-base font-light leading-relaxed text-white/55">{selectedPost.excerpt}</p>

                <div
                  className="prose prose-invert max-w-none text-white/75 [&_a]:text-cyan-300 [&_blockquote]:border-cyan-400/30 [&_blockquote]:text-white/65 [&_h2]:text-white [&_h3]:text-white [&_li]:text-white/75"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedPostHtml && selectedPostHtml !== '<p></p>'
                        ? selectedPostHtml
                        : `<p>${selectedPost.excerpt}</p>`
                  }}
                />

                {selectedPost.sourceUrl && (
                  <a
                    href={selectedPost.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-cyan-200 transition hover:border-cyan-400/35 hover:text-cyan-100"
                  >
                    Otevřít zdroj
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;

