import React, { useState, useEffect } from 'react';
import { ZoomIn, Bookmark, Info } from 'lucide-react';
import { Artwork } from '../data/museumData';
import { isFavourite, toggleFavourite } from '../utils/collectionStore';
import { museumAudio } from '../utils/audioSystem';

interface ArtworkFrameProps {
  artwork: Artwork;
  isFocused: boolean;
  onFocus: () => void;
  onExamine: () => void;
  scale?: number;
}

export const ArtworkFrame: React.FC<ArtworkFrameProps> = ({
  artwork,
  isFocused,
  onFocus,
  onExamine,
  scale = 1,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [faved, setFaved] = useState(isFavourite(artwork.id));

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setFaved(isFavourite(artwork.id));
  }, [artwork.id]);

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleFavourite(artwork.id);
    setFaved(next);
    museumAudio.playPlaqueClick();
  };

  return (
    <div
      onClick={isFocused ? onExamine : onFocus}
      className={`group relative flex flex-col items-center cursor-pointer transition-all duration-700 select-none ${
        isFocused ? 'scale-[1.04] z-30' : 'hover:scale-[1.015] z-10'
      }`}
      style={{ transform: `scale(${scale})` }}
      role="button"
      tabIndex={0}
      aria-label={`Examine ${artwork.title} by ${artwork.artist}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isFocused) onExamine();
          else onFocus();
        }
      }}
    >
      {/* Warm Ambient Overhead Ceiling Spotlight Cone */}
      <div
        className={`absolute -top-32 w-72 sm:w-96 h-48 pointer-events-none rounded-full transition-opacity duration-700 ${
          isFocused ? 'opacity-90' : 'opacity-40 group-hover:opacity-75'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(254, 243, 199, 0.4) 0%, rgba(245, 158, 11, 0.12) 45%, transparent 75%)',
        }}
      />

      {/* Heavy Vintage Museum Gilded Frame Structure */}
      <div className="relative p-3 sm:p-4 rounded-sm museum-frame bg-[#2b1f13] transition-shadow duration-500">
        {/* Antiqued Wood Bevel & Linen Matting */}
        <div className="p-2 sm:p-3 bg-[#1d1610] shadow-inner border border-[#6b522a]/70">
          <div className="relative overflow-hidden bg-[#0c0907] flex items-center justify-center max-w-[280px] sm:max-w-[360px] md:max-w-[420px] max-h-[380px] sm:max-h-[460px] min-h-[220px]">
            {/* Visual Fallback Container in case of network issue */}
            {imageError ? (
              <div className="w-full h-64 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#1e1710] to-[#120d09] border border-[#523d21]">
                <div className="w-12 h-12 rounded-full border border-[#8a6829] flex items-center justify-center mb-3 text-[#d8ba6f] font-serif text-lg">
                  {artwork.artist.charAt(0)}
                </div>
                <h4 className="font-serif text-base text-[#e8dac2] italic mb-1">{artwork.title}</h4>
                <p className="text-xs text-[#a99982] mb-3">{artwork.artist} · {artwork.date}</p>
                <span className="text-[11px] text-[#7d6c55] font-serif uppercase tracking-wider">{artwork.medium}</span>
              </div>
            ) : (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-[#16110c] animate-pulse flex items-center justify-center text-xs text-[#8c7a65] font-serif">
                    Loading Masterpiece...
                  </div>
                )}
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-auto h-auto max-h-[440px] object-contain transition-all duration-700 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  } ${isFocused ? 'brightness-105' : 'brightness-95 group-hover:brightness-100'}`}
                />
              </>
            )}

            {/* Quick Action Overlay on Hover/Focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <button
                onClick={handleToggleFavourite}
                className="cursor-pointer p-2 rounded bg-[#1f170f]/90 border border-[#6b522a] text-[#dfb743] hover:text-[#fef08a] hover:bg-[#2b1f13] transition-colors"
                title={faved ? 'Remove from My Collection' : 'Save to My Collection'}
                aria-label="Save to favourites"
              >
                <Bookmark className={`w-4 h-4 ${faved ? 'fill-[#dfb743]' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExamine();
                }}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif bg-[#8a6829] hover:bg-[#a17a32] text-[#1c1206] font-semibold rounded shadow transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Examine Exhibit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Museum Wall Shadow Beneath Frame */}
      <div className="w-4/5 h-4 -mt-1 bg-black/70 blur-md rounded-full pointer-events-none" />

      {/* Antique Engraved Brass Information Plaque */}
      <div
        className={`mt-4 w-64 sm:w-72 p-3 rounded-sm transition-all duration-500 text-center ${
          isFocused
            ? 'brass-plaque scale-105 shadow-xl'
            : 'brass-plaque-dark text-[#d5c3a3] group-hover:border-[#b89139]'
        }`}
      >
        {/* Screw head accents */}
        <div className="flex justify-between items-center mb-1 text-[10px] text-stone-500 font-mono">
          <span>•</span>
          <span className="text-[11px] uppercase tracking-widest font-sans opacity-85">
            {artwork.accessionNumber}
          </span>
          <span>•</span>
        </div>

        <h3
          className={`font-serif text-base sm:text-lg font-bold leading-tight ${
            isFocused ? 'text-[#1c1305]' : 'text-[#f5e7ce]'
          }`}
        >
          {artwork.title}
        </h3>

        <div
          className={`font-serif text-xs italic mt-0.5 ${
            isFocused ? 'text-[#38280f]' : 'text-[#c2b093]'
          }`}
        >
          {artwork.artist} ({artwork.date})
        </div>

        <div
          className={`text-[11px] font-sans mt-1 line-clamp-1 ${
            isFocused ? 'text-[#473315]' : 'text-[#9c8b74]'
          }`}
        >
          {artwork.medium}
        </div>

        {/* Action affordance prompt */}
        <div
          className={`mt-2 pt-1.5 border-t text-[11px] font-serif flex items-center justify-center gap-1 ${
            isFocused
              ? 'border-[#8f6b21] text-[#2c1c07] font-semibold'
              : 'border-[#3d2e1c] text-[#b39e7e]'
          }`}
        >
          <Info className="w-3 h-3" />
          <span>{isFocused ? 'Click to open full exhibit details' : 'Click to focus view'}</span>
        </div>
      </div>
    </div>
  );
};
