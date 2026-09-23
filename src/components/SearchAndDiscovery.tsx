import React, { useState, useMemo } from 'react';
import { Search, Filter, Compass, Eye, Bookmark, X, RotateCcw } from 'lucide-react';
import { Artwork, ARTWORKS_DATA, ARTISTS_LIST, COUNTRIES_LIST, MOVEMENTS_LIST } from '../data/museumData';
import { isFavourite, toggleFavourite } from '../utils/collectionStore';
import { museumAudio } from '../utils/audioSystem';

interface SearchAndDiscoveryProps {
  onSelectArtwork: (artwork: Artwork) => void;
  onJumpToRoom: (roomId: Artwork['room']) => void;
}

export const SearchAndDiscovery: React.FC<SearchAndDiscoveryProps> = ({
  onSelectArtwork,
  onJumpToRoom,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovement, setSelectedMovement] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedArtist, setSelectedArtist] = useState('All');

  const filteredArtworks = useMemo(() => {
    return ARTWORKS_DATA.filter((art) => {
      const matchQuery =
        !searchTerm ||
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.movement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.medium.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMovement = selectedMovement === 'All' || art.movement === selectedMovement;
      const matchCountry = selectedCountry === 'All' || art.country.includes(selectedCountry);
      const matchArtist = selectedArtist === 'All' || art.artist === selectedArtist;

      return matchQuery && matchMovement && matchCountry && matchArtist;
    });
  }, [searchTerm, selectedMovement, selectedCountry, selectedArtist]);

  const handleReset = () => {
    museumAudio.playPlaqueClick();
    setSearchTerm('');
    setSelectedMovement('All');
    setSelectedCountry('All');
    setSelectedArtist('All');
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite(id);
    museumAudio.playPlaqueClick();
  };

  return (
    <div className="min-h-screen bg-[#14100c] pt-20 pb-16 px-4 sm:px-6 md:px-10 text-[#ede2cd]">
      {/* 35mm Analog Film Grain Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none film-grain" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Archival Card Catalogue Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[#c59b27] font-display mb-2">
            <span className="h-[1px] w-12 bg-[#8c6f37]" />
            <span>Card Catalogue & Archival Index</span>
            <span className="h-[1px] w-12 bg-[#8c6f37]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#faf3e3] uppercase tracking-wide">
            Search & Discovery
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#baa890] mt-1 max-w-xl mx-auto">
            Cross-reference masterworks by era, artist, geographic origin, and aesthetic movement
          </p>
        </div>

        {/* Vintage Walnut Index Cabinet Filter Box */}
        <div className="bg-[#1f1711] border-2 border-[#473420] rounded-sm p-5 sm:p-7 shadow-[0_20px_40px_rgba(0,0,0,0.8)] mb-8">
          <div className="flex flex-col lg:flex-row gap-5 items-end justify-between">
            {/* Search Input Box */}
            <div className="w-full lg:w-1/3">
              <label className="block text-[11px] uppercase tracking-widest font-sans text-[#a89578] mb-1.5 font-semibold">
                Search Terms (Title, Artist, Keyword)
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8f7961]" />
                <input
                  type="text"
                  placeholder="e.g. Leonardo, Impression, India, Oil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-[#120d09] border border-[#523d26] rounded text-xs font-serif text-[#faf3e3] placeholder:text-[#665442] focus:outline-none focus:border-[#c59b27]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="cursor-pointer absolute right-3 top-3 text-[#8f7961] hover:text-[#ede2cd]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Curatorial Dropdown Filters */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Movement Filter */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-sans text-[#a89578] mb-1.5 font-semibold">
                  Art Movement
                </label>
                <select
                  value={selectedMovement}
                  onChange={(e) => {
                    museumAudio.playPlaqueClick();
                    setSelectedMovement(e.target.value);
                  }}
                  className="w-full py-2.5 px-3 bg-[#120d09] border border-[#523d26] rounded text-xs font-serif text-[#ede2cd] focus:outline-none focus:border-[#c59b27]"
                >
                  <option value="All">All Movements</option>
                  {MOVEMENTS_LIST.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-sans text-[#a89578] mb-1.5 font-semibold">
                  Origin Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    museumAudio.playPlaqueClick();
                    setSelectedCountry(e.target.value);
                  }}
                  className="w-full py-2.5 px-3 bg-[#120d09] border border-[#523d26] rounded text-xs font-serif text-[#ede2cd] focus:outline-none focus:border-[#c59b27]"
                >
                  <option value="All">All Countries</option>
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Artist Filter */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-sans text-[#a89578] mb-1.5 font-semibold">
                  Master Artist
                </label>
                <select
                  value={selectedArtist}
                  onChange={(e) => {
                    museumAudio.playPlaqueClick();
                    setSelectedArtist(e.target.value);
                  }}
                  className="w-full py-2.5 px-3 bg-[#120d09] border border-[#523d26] rounded text-xs font-serif text-[#ede2cd] focus:outline-none focus:border-[#c59b27]"
                >
                  <option value="All">All Artists</option>
                  {ARTISTS_LIST.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips & Clear Action */}
          <div className="mt-4 pt-3 border-t border-[#382718] flex flex-wrap items-center justify-between gap-2 text-xs font-serif text-[#a89578]">
            <div className="flex items-center gap-2">
              <span>Catalogued Records Matching:</span>
              <span className="font-mono text-[#f5d799] font-bold">{filteredArtworks.length}</span>
              <span>of {ARTWORKS_DATA.length} artworks</span>
            </div>

            <button
              onClick={handleReset}
              className="cursor-pointer text-[#c59b27] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Archive Queries</span>
            </button>
          </div>
        </div>

        {/* Search Results Display: Archival Index Cards */}
        {filteredArtworks.length === 0 ? (
          <div className="bg-[#19130e] border border-[#3b2a1a] rounded p-12 text-center">
            <p className="font-serif text-lg text-[#b8a78e] italic">
              No accession cards correspond to the requested query.
            </p>
            <p className="text-xs text-[#7d6c57] mt-1 font-serif">
              Try adjusting the artist, movement, or country filter parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArtwork(art)}
                className="group cursor-pointer bg-[#1a140f] border border-[#42311e] hover:border-[#8f6e33] rounded-sm p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Card Accession & Collection Bookmark */}
                  <div className="flex items-center justify-between text-[11px] text-[#8c7a63] font-mono mb-2">
                    <span>{art.accessionNumber}</span>
                    <button
                      onClick={(e) => handleToggleFav(art.id, e)}
                      className="cursor-pointer p-1 text-[#8c7a63] hover:text-[#c59b27]"
                      title="Save to Collection"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFavourite(art.id) ? 'fill-[#c59b27] text-[#c59b27]' : ''}`} />
                    </button>
                  </div>

                  {/* Artwork Plate Thumbnail */}
                  <div className="relative w-full h-48 bg-[#0d0a07] border border-[#3b2a1a] p-2 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter group-hover:brightness-105 transition-all"
                    />
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="text-[11px] text-[#a89578] font-sans flex items-center gap-1.5 flex-wrap">
                    <span>{art.movement}</span>
                    <span>·</span>
                    <span>{art.country}</span>
                    <span>·</span>
                    <span>{art.date}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#faf3e3] group-hover:text-[#f8d48d] transition-colors leading-tight mt-1">
                    {art.title}
                  </h3>

                  <div className="font-serif text-xs text-[#baa890] italic mt-0.5">
                    {art.artist}
                  </div>

                  <div className="text-[11px] text-[#7d6c57] font-serif mt-1 line-clamp-1">
                    {art.medium}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-[#2e2114] flex items-center justify-between text-xs font-serif">
                  <span className="text-[#c59b27] group-hover:underline flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Examine Plate</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      museumAudio.playFootstep();
                      onJumpToRoom(art.room);
                    }}
                    className="cursor-pointer text-[#8f7c65] hover:text-[#faf3e3] flex items-center gap-1 transition-colors"
                    title="Jump to this room in 3D museum"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Go to Gallery</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
