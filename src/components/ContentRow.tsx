import { ReactNode, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRowProps {
  title: string;
  children: ReactNode;
  onSeeAll?: () => void;
}

const ContentRow = ({ title, children, onSeeAll }: ContentRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between px-6 mb-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {onSeeAll && (
          <button onClick={onSeeAll} className="text-sm text-primary hover:underline">
            See All →
          </button>
        )}
      </div>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div ref={scrollRef} className="flex gap-3 px-6 overflow-x-auto scrollbar-hide scroll-smooth">
          {children}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default ContentRow;
