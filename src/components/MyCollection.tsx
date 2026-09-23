import React, { useState, useEffect } from 'react';
import { Bookmark, Eye, Compass, Trash2, Printer, BookOpen, Share2, Sparkles } from 'lucide-react';
import { Artwork, ARTWORKS_DATA } from '../data/museumData';
import { getFavouriteIds, toggleFavourite, getArtworkNotes, subscribeToCollection } from '../utils/collectionStore';
import { museumAudio } from '../utils/audioSystem';

interface MyCollectionProps {
  onSelectArtwork: (artwork: Artwork) => void;
  onJumpToRoom: (roomId: Artwork['room']) => void;
  onOpenCatalogue: () => void;
}

export const MyCollection: React.FC<MyCollectionProps> = ({
  onSelectArtwork,
  onJumpToRoom,
  onOpenCatalogue,
}) => {
  const [favouriteIds, setFavouriteIds] = useState<string[]>(getFavouriteIds());

  useEffect(() => {
    return subscribeToCollection(() => {
      setFavouriteIds(getFavouriteIds());
    });
  }, []);

  const savedArtworks = ARTWORKS_DATA.filter((art) => favouriteIds.includes(art.id));

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite(id);
    museumAudio.playPlaqueClick();
  };

  const handlePrint = () => {
    museumAudio.playPlaqueClick();
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#14100c] pt-20 pb-16 px-4 sm:px-6 md:px-10 text-[#ede2cd]">
      {/* 35mm Analog Film Grain Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none film-grain" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Curatorial Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#3d2e1c] pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#c59b27] font-display mb-1">
              <span>Personal Curatorial Portfolio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#faf3e3] uppercase">
              My Collection
            </h1>
            <p className="font-serif italic text-xs sm:text-sm text-[#bdae96] mt-0.5">
              Saved masterworks & personal visitor annotations ({savedArtworks.length} items catalogued)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedArtworks.length > 0 && (
              <button
                onClick={handlePrint}
                className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-[#211810] hover:bg-[#302316] border border-[#5c4427] text-[#ded1ba] rounded text-xs font-serif transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>Print Archival Guide</span>
              </button>
            )}

            <button
              onClick={() => {
                museumAudio.playPageTurn();
                onOpenCatalogue();
              }}
              className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-[#8a6829] hover:bg-[#a37c32] text-[#1c1206] font-semibold rounded text-xs font-serif shadow transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore More in Catalogue</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {savedArtworks.length === 0 ? (
          <div className="bg-[#19130e] border border-[#3d2c1a] rounded p-12 text-center max-w-xl mx-auto my-12">
            <Bookmark className="w-12 h-12 text-[#634e35] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#f5ebd7] mb-2">
              Your Personal Gallery is Empty
            </h3>
            <p className="font-serif text-xs sm:text-sm text-[#9c8973] leading-relaxed mb-6">
              While walking through the museum galleries or browsing the archival catalogue, click the bookmark icon on any painting to curate your personal collection.
            </p>
            <button
              onClick={onOpenCatalogue}
              className="cursor-pointer px-5 py-2 bg-[#8a6829] hover:bg-[#a37c32] text-[#1a1106] font-serif font-semibold rounded text-xs transition-colors"
            >
              Browse The Catalogue
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedArtworks.map((art) => {
              const personalNote = getArtworkNotes(art.id);
              return (
                <div
                  key={art.id}
                  onClick={() => onSelectArtwork(art)}
                  className="group cursor-pointer bg-[#1c150f] border border-[#42311e] hover:border-[#8f6e33] rounded-sm p-4 sm:p-6 shadow-xl transition-all flex flex-col md:flex-row gap-6 items-start justify-between"
                >
                  {/* Left: Thumbnail with Frame */}
                  <div className="relative shrink-0 w-full sm:w-44 h-48 bg-[#0f0c08] border border-[#473420] p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter group-hover:brightness-105 transition-all"
                    />
                  </div>

                  {/* Middle: Archival Metadata & Notes */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#8a765d] mb-1">
                      <span>{art.accessionNumber}</span>
                      <span>·</span>
                      <span className="uppercase font-sans text-[#a89578]">{art.movement}</span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#faf3e3] group-hover:text-[#f8d48d] transition-colors leading-tight">
                      {art.title}
                    </h2>

                    <div className="font-serif italic text-xs text-[#baa890] mt-0.5">
                      {art.artist} ({art.artistLifespan}) · {art.date}
                    </div>

                    <div className="text-xs font-serif text-[#7d6c57] mt-1">
                      {art.medium} · {art.dimensions} · Custody: {art.currentLocation}
                    </div>

                    <p className="font-serif text-xs text-[#bdae96] mt-2.5 line-clamp-2 leading-relaxed">
                      {art.historicalContext}
                    </p>

                    {/* Personal Curatorial Note Display */}
                    {personalNote && (
                      <div className="mt-3 p-2.5 bg-[#120e0a] border-l-2 border-[#c59b27] rounded-r text-xs font-serif text-[#decab0]">
                        <span className="text-[10px] uppercase tracking-wider text-[#a89578] block font-sans font-semibold">
                          Your Curatorial Reflection:
                        </span>
                        <p className="italic mt-0.5">"{personalNote}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#2b1f13]">
                    <button
                      onClick={() => onSelectArtwork(art)}
                      className="cursor-pointer px-3.5 py-1.5 bg-[#8a6829] hover:bg-[#a37c32] text-[#1c1206] font-semibold rounded text-xs font-serif flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examine Plate</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        museumAudio.playFootstep();
                        onJumpToRoom(art.room);
                      }}
                      className="cursor-pointer px-3 py-1.5 bg-[#241a12] hover:bg-[#332419] border border-[#523d26] text-[#ded1ba] rounded text-xs font-serif flex items-center gap-1.5 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
                      <span>View in Gallery</span>
                    </button>

                    <button
                      onClick={(e) => handleRemove(art.id, e)}
                      className="cursor-pointer p-1.5 text-[#8a7258] hover:text-[#ef4444] transition-colors"
                      title="Remove from My Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
