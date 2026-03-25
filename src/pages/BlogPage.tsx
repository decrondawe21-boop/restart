import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface BlogPost {
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

interface BlogPageProps {
  posts: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/10 pb-12">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
              Blog REST||ART
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
              Novinky <br /><span className="text-cyan-300 headline-thin">a aktuality</span>
            </h2>
          </div>
          <p className="text-white/40 font-light max-w-md text-sm">
            Pravidelně sdílíme průběh realizace, výsledky programů a klíčové milníky projektu REST||ART INTEGRACE.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.title} className="glass-panel p-8 rounded-[2.5rem] border-white/10 hover:border-cyan-400/30 hover:-translate-y-2 transition-all duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-400">{post.category}</span>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{post.date}</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight mb-4 group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-white/50 font-light leading-relaxed">{post.excerpt}</p>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Číst detail</span>
                <ArrowRight size={14} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

