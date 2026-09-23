import React, { useState } from 'react';
import { BookOpen, Search, Filter, ChevronLeft, ChevronRight, Bookmark, Compass, Eye, ArrowUpRight } from 'lucide-react';
import { Artwork, ARTWORKS_DATA, EXHIBITION_ROOMS } from '../data/museumData';
import { isFavourite, toggleFavourite } from '../utils/collectionStore';
import { museumAudio } from '../utils/audioSystem';

interface MuseumCatalogueProps {
  onSelectArtwork: (artwork: Artwork) => void;
  onJumpToRoom: (roomId: Artwork['room']) => void;
}

export const MuseumCatalogue: React.FC<MuseumCatalogueProps> = ({
  onSelectArtwork,
  onJumpToRoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovement, setSelectedMovement] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4; // 4 items per archival catalogue spread

  const movements = ['All', 'Renaissance', 'Impressionism', 'Post-Impressionism', 'Modern Art', 'Indian Art'];

  const filtered = ARTWORKS_DATA.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.period.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMovement = selectedMovement === 'All' || art.movement === selectedMovement;
    return matchesSearch && matchesMovement;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      museumAudio.playPageTurn();
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      museumAudio.playPageTurn();
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite(id);
    museumAudio.playPlaqueClick();
  };

  return (
    <div className="min-h-screen bg-[#14100c] pt-20 pb-16 px-4 sm:px-6 md:px-10 text-[#2b2216]">
      {/* 35mm Analog Film Grain Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none film-grain" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Archival Art Book Cover & Title Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[#c59b27] font-display mb-2">
            <span className="h-[1px] w-12 bg-[#8c6f37]" />
            <span>Permanent Collection Monograph · Vol. IV</span>
            <span className="h-[1px] w-12 bg-[#8c6f37]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#faf3e3] tracking-wide uppercase">
            The Catalogue
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#bdae97] mt-1 max-w-xl mx-auto">
            Comprehensive Archival Register of Masterpieces & Historical Provenance
          </p>
        </div>

        {/* Vintage Search & Filter Tooling Ribbon */}
        <div className="mb-6 bg-[#1f1812] border border-[#4d3824] rounded-sm p-4 text-xs font-serif text-[#e5d6be] shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input styled like a library card ledger */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8f7a63]" />
              <input
                type="text"
                placeholder="Search catalogue ledger..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-[#120e0a] border border-[#523d27] rounded text-xs font-serif text-[#faf3e3] placeholder:text-[#6e5c4a] focus:outline-none focus:border-[#c59b27]"
              />
            </div>

            {/* Movement Filter Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <span className="text-[11px] uppercase tracking-wider text-[#9c8973] font-sans mr-1 hidden md:inline">
                Curatorial Section:
              </span>
              {movements.map((mov) => (
                <button
                  key={mov}
                  onClick={() => {
                    museumAudio.playPageTurn();
                    setSelectedMovement(mov);
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap ${
                    selectedMovement === mov
                      ? 'bg-[#8a6829] text-[#1c1206] font-semibold'
                      : 'bg-[#150f0b] border border-[#3b2a1a] text-[#bdae97] hover:text-[#faebd0]'
                  }`}
                >
                  {mov}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PHYSICAL PRINTED CATALOGUE BOOK PRESENTATION */}
        <div className="relative parchment-texture border-4 border-[#3a2817] rounded shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)] p-6 sm:p-10 md:p-14 overflow-hidden">
          {/* Book Spine Center Crease Shadow */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/15 via-black/25 to-transparent pointer-events-none" />

          {/* Book Header Margin Rule */}
          <div className="border-b border-[#a89578]/50 pb-3 mb-8 flex justify-between items-center text-xs tracking-widest font-serif text-[#7d6b53] uppercase">
            <span>Virtual Art Museum · Accession Registry</span>
            <span>Folio {currentPage} of {totalPages}</span>
          </div>

          {/* Catalogue Items Grid (Curatorial Plate + Provenance Record) */}
          {pageItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-lg text-[#5e4f3c] italic">
                No matching archival records found in this catalogue folio.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMovement('All');
                }}
                className="cursor-pointer mt-4 px-4 py-1.5 text-xs font-serif bg-[#8a6829] text-white rounded hover:bg-[#6e521e]"
              >
                Reset Catalogue Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
              {pageItems.map((art, idx) => (
                <div
                  key={art.id}
                  className="group relative flex flex-col sm:flex-row gap-5 pb-6 border-b border-[#c2b297]/60 hover:bg-[#ebdcc4]/30 p-3 rounded transition-colors"
                >
                  {/* Artwork Thumbnail Plate in Wood Matting */}
                  <div className="relative shrink-0 w-full sm:w-36 h-44 bg-[#211810] p-1.5 shadow-md border border-[#8a7251]/70 flex items-center justify-center overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter group-hover:contrast-105 transition-all"
                    />
                  </div>

                  {/* Curatorial Ledger Text Record */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#78664f]">
                          {art.accessionNumber}
                        </span>
                        <button
                          onClick={(e) => handleToggleFav(art.id, e)}
                          className="cursor-pointer text-[#8a7251] hover:text-[#c59b27] transition-colors"
                          title="Save to My Collection"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFavourite(art.id) ? 'fill-[#8a7251]' : ''}`} />
                        </button>
                      </div>

                      <h3
                        onClick={() => onSelectArtwork(art)}
                        className="font-serif text-lg sm:text-xl font-bold text-[#1f170e] hover:text-[#78531d] cursor-pointer transition-colors leading-tight mt-1"
                      >
                        {art.title}
                      </h3>

                      <div className="font-serif italic text-xs text-[#5c4933] mt-0.5">
                        {art.artist} ({art.date})
                      </div>

                      <div className="text-[11px] font-sans text-[#78664f] mt-1 line-clamp-1">
                        {art.medium} · {art.dimensions}
                      </div>

                      <p className="font-serif text-xs text-[#3b2f21] mt-2 line-clamp-2 leading-relaxed">
                        {art.historicalContext}
                      </p>
                    </div>

                    {/* Interactive Archival Links */}
                    <div className="mt-3 pt-2 border-t border-[#d1c2a7] flex items-center justify-between text-xs font-serif">
                      <button
                        onClick={() => onSelectArtwork(art)}
                        className="cursor-pointer text-[#7a5722] hover:text-[#1c1206] font-semibold flex items-center gap-1 group-hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Plate</span>
                      </button>

                      <button
                        onClick={() => onJumpToRoom(art.room)}
                        className="cursor-pointer text-[#614e36] hover:text-[#1c1206] flex items-center gap-1"
                        title="Walk to this gallery in 3D museum"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#8a7251]" />
                        <span>Visit Gallery</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Book Footer Page Turn Navigation */}
          <div className="mt-10 pt-4 border-t border-[#a89578]/50 flex items-center justify-between text-xs font-serif text-[#695844]">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 border border-[#8a765c] bg-[#ede1ce] hover:bg-[#e3d3bd] disabled:opacity-40 disabled:cursor-not-allowed rounded"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Turn to Previous Folio</span>
            </button>

            <span className="font-mono text-xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 border border-[#8a765c] bg-[#ede1ce] hover:bg-[#e3d3bd] disabled:opacity-40 disabled:cursor-not-allowed rounded"
            >
              <span>Turn to Next Folio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
