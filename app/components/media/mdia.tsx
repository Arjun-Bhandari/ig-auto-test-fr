'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import Image from 'next/image';
import { getIgMedia } from '../../lib/instagram/api';
import type { IgMediaItem } from '../../lib/instagram/media';
import { useMediaSelection } from '../../stores/media-selection';

interface IgMediaGridProps {
  limit?: number;
  className?: string;
}

const SkeletonGrid = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="aspect-square w-full rounded-md bg-white/5 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-white/5 animate-pulse" />
      </div>
    ))}
  </div>
);

const MediaCard = ({
  item,
  isSelected,
  onToggle,
}: {
  item: IgMediaItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => {
  const showPlay = item.media_type === 'VIDEO';
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      className={`group w-full text-left focus:outline-none ${
        isSelected ? 'ring-2 ring-violet-500 rounded-md' : ''
      }`}
    >
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-black/20">
          <Image
            src={item.media_url}
            alt={item.caption ?? 'Instagram media'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            priority={false}
            unoptimized
            referrerPolicy="no-referrer"
          />
          {showPlay && (
            <div className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              VIDEO
            </div>
          )}
          {item.media_type === 'CAROUSEL_ALBUM' && (
            <div className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              ALBUM
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 rounded-md ring-2 ring-violet-500" />
          )}
        </div>
      </div>
      {item.caption ? (
        <p className="mt-2 line-clamp-2 text-sm text-white/80">{item.caption}</p>
      ) : null}
    </button>
  );
};

export const IgMediaGrid = ({ limit = 24, className }: IgMediaGridProps) => {
  const [media, setMedia] = useState<IgMediaItem[] | null>(null);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [igUserId, setIgUserId] = useState<string| null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('igUserId');
    setIgUserId(stored ?? null);
  }, []);

  
  const { isSelected, toggle } = useMediaSelection();

  useEffect(() => {
    let abort = new AbortController();

    const run = async () => {
      if (!igUserId) return;
      try {
        setIsLoading(true);
        setHasError(null);
        console.log(igUserId, limit);
        const data = await getIgMedia(igUserId, limit);
        console.log(data);
        if (!abort.signal.aborted) {
          setMedia(data);
        }
      } catch (e: any) {
        if (!abort.signal.aborted) {
          setHasError(e?.message ?? 'Failed to load media');
        }
      } finally {
        if (!abort.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      abort.abort();
    };
  }, [igUserId, limit]);
console.log("Media",media)
  return (
    <section className={`w-full min-h-screen bg-[#12111A] px-4 py-6 ${className ?? ''}`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Your Instagram Media</h2>
          <span className="text-sm text-white/60">
            {media?.length ?? 0} item{(media?.length ?? 0) === 1 ? '' : 's'}
          </span>
        </header>

        {isLoading ? (
          <SkeletonGrid count={Math.min(limit, 12)} />
        ) : hasError ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {hasError}
          </div>
        ) : !media || media.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            No media found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                isSelected={isSelected(item.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Backward-compatible default export if needed elsewhere.
export default IgMediaGrid;