import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Maximize, Minimize, Bookmark, Share2, Compass, ArrowRight, BookOpen } from 'lucide-react';
import { Artwork, ARTWORKS_DATA } from '../data/museumData';
import { isFavourite, toggleFavourite, getArtworkNotes, saveArtworkNotes } from '../utils/collectionStore';
import { museumAudio } from '../utils/audioSystem';

interface ExhibitDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onSelectRelated: (artwork: Artwork) => void;
  onJumpToRoom: (roomId: Artwork['room']) => void;
}

export const ExhibitDetailModal: React.FC<ExhibitDetailModalProps> = ({
  artwork,
  onClose,
  onSelectRelated,
  onJumpToRoom,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [faved, setFaved] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'curatorial' | 'facts' | 'notes'>('curatorial');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (artwork) {
      setFaved(isFavourite(artwork.id));
      setNotes(getArtworkNotes(artwork.id));
      setZoomLevel(1);
      setImageError(false);
    }
  }, [artwork]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!artwork) return null;

  const handleToggleFav = () => {
    const next = toggleFavourite(artwork.id);
    setFaved(next);
    museumAudio.playPlaqueClick();
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    saveArtworkNotes(artwork.id, val);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
    museumAudio.playPlaqueClick();
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
    museumAudio.playPlaqueClick();
  };

  const relatedArtworks = ARTWORKS_DATA.filter(a => artwork.relatedArtworkIds.includes(a.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`Detailed exhibit for ${artwork.title}`}
    >
      {/* 35mm Analog Film Grain Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none film-grain" />

      {/* Main Archival Exhibit Modal Window */}
      <div className="relative z-10 w-full max-w-6xl max-h-[94vh] bg-[#16120e] border border-[#523d26] shadow-2xl rounded-sm flex flex-col overflow-hidden text-[#ede2cd]">
        {/* Modal Top Heritage Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#3b2a1a] bg-[#1d1610] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c59b27] shadow-[0_0_8px_#c59b27]" />
            <div className="text-xs uppercase tracking-[0.2em] font-display text-[#c59b27]">
              Curatorial Accession Record · {artwork.accessionNumber}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFav}
              className={`cursor-pointer px-3 py-1.5 text-xs font-serif rounded border transition-colors flex items-center gap-1.5 ${
                faved
                  ? 'bg-[#3d2c18] border-[#c59b27] text-[#fceecf]'
                  : 'bg-[#18110b] border-[#473420] text-[#b3a189] hover:text-[#ede2cd]'
              }`}
              title={faved ? 'In My Collection' : 'Save to My Collection'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${faved ? 'fill-[#c59b27] text-[#c59b27]' : ''}`} />
              <span>{faved ? 'Saved in Collection' : 'Save to Collection'}</span>
            </button>

            <button
              onClick={() => {
                museumAudio.playPlaqueClick();
                onClose();
              }}
              className="cursor-pointer p-1.5 rounded bg-[#241a12] hover:bg-[#332419] border border-[#4a3622] text-[#d6c4a5] transition-colors"
              aria-label="Close exhibit details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Presentation (Painting Viewer on Left, Curatorial Documentation on Right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#3b2a1a]">
          {/* Left Column: High-Resolution Artwork Viewer with Zoom & Pan */}
          <div className="lg:col-span-7 bg-[#0f0c09] p-4 sm:p-6 flex flex-col justify-between items-center min-h-[380px] lg:min-h-[580px] relative overflow-hidden">
            {/* Ambient Wall Light Gradient behind painting */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Artwork Frame & Canvas Stage */}
            <div className="my-auto w-full flex items-center justify-center overflow-hidden py-4">
              <div
                className="relative transition-transform duration-300 ease-out origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <div className="museum-frame p-2.5 sm:p-3 bg-[#24190e] rounded-sm">
                  {imageError ? (
                    <div className="w-80 h-96 p-6 flex flex-col items-center justify-center text-center bg-stone-900 border border-amber-900/40">
                      <div className="text-4xl text-amber-500/80 mb-4 font-serif">❦</div>
                      <h4 className="font-serif text-lg text-amber-100">{artwork.title}</h4>
                      <p className="text-xs text-stone-400 mt-2">{artwork.artist} · {artwork.date}</p>
                      <span className="text-[11px] text-amber-600/80 uppercase tracking-widest mt-4">{artwork.medium}</span>
                    </div>
                  ) : (
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      onError={() => setImageError(true)}
                      className="max-h-[52vh] w-auto object-contain rounded shadow-2xl filter brightness-100 contrast-[1.02]"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Viewer Zoom & Scale Utility Controls Ribbon */}
            <div className="relative z-10 w-full max-w-sm mx-auto bg-[#1b140e]/90 border border-[#523d26] rounded px-3 py-1.5 flex items-center justify-between text-xs text-[#c2b095]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="cursor-pointer p-1 hover:text-[#faebd0] disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="cursor-pointer p-1 hover:text-[#faebd0] disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] font-serif text-[#a39278]">
                {artwork.dimensions}
              </div>

              <button
                onClick={() => {
                  museumAudio.playFootstep();
                  onJumpToRoom(artwork.room);
                  onClose();
                }}
                className="cursor-pointer flex items-center gap-1 text-[11px] text-[#c59b27] hover:underline"
                title="View in 3D Museum Gallery"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View on Wall</span>
              </button>
            </div>
          </div>

          {/* Right Column: Curatorial Dossier & Historical Context */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between bg-[#17120e] overflow-y-auto">
            <div>
              {/* Primary Headings */}
              <div className="border-b border-[#3b2a1a] pb-4 mb-4">
                <div className="text-[11px] uppercase tracking-widest font-sans text-[#a89578] mb-1">
                  {artwork.movement} · {artwork.country}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#faf3e3] leading-tight">
                  {artwork.title}
                </h2>
                {artwork.originalTitle && artwork.originalTitle !== artwork.title && (
                  <div className="font-serif italic text-xs text-[#bfab8b] mt-0.5">
                    Original title: {artwork.originalTitle}
                  </div>
                )}
                <div className="mt-2 text-sm text-[#e0cfb1] font-serif flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#f5ebd7]">{artwork.artist}</span>
                  <span className="text-[#69533c]">({artwork.artistLifespan})</span>
                  <span className="text-[#69533c]">·</span>
                  <span>{artwork.artistNationality}</span>
                </div>
              </div>

              {/* Curatorial Specification Grid (Zero-pill text format with hairline dividers) */}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs border-b border-[#3b2a1a] pb-4 mb-4 font-serif">
                <div>
                  <dt className="text-[#8c7a65] text-[11px] uppercase tracking-wider font-sans">Date Created</dt>
                  <dd className="text-[#ded1ba] font-medium">{artwork.date}</dd>
                </div>
                <div>
                  <dt className="text-[#8c7a65] text-[11px] uppercase tracking-wider font-sans">Period / Style</dt>
                  <dd className="text-[#ded1ba] font-medium">{artwork.period}</dd>
                </div>
                <div>
                  <dt className="text-[#8c7a65] text-[11px] uppercase tracking-wider font-sans">Medium & Support</dt>
                  <dd className="text-[#ded1ba] font-medium">{artwork.medium}</dd>
                </div>
                <div>
                  <dt className="text-[#8c7a65] text-[11px] uppercase tracking-wider font-sans">Current Custody</dt>
                  <dd className="text-[#ded1ba] font-medium truncate" title={artwork.currentLocation}>
                    {artwork.currentLocation}
                  </dd>
                </div>
              </dl>

              {/* Curatorial Tabs: Analysis, Facts, Visitor Notes */}
              <div className="flex border-b border-[#3b2a1a] mb-4 text-xs font-serif">
                <button
                  onClick={() => {
                    museumAudio.playPlaqueClick();
                    setActiveTab('curatorial');
                  }}
                  className={`cursor-pointer pb-2 px-3 font-semibold transition-colors relative ${
                    activeTab === 'curatorial'
                      ? 'text-[#f5d799] border-b-2 border-[#c59b27]'
                      : 'text-[#9c8973] hover:text-[#ede2cd]'
                  }`}
                >
                  Curatorial Analysis
                </button>
                <button
                  onClick={() => {
                    museumAudio.playPlaqueClick();
                    setActiveTab('facts');
                  }}
                  className={`cursor-pointer pb-2 px-3 font-semibold transition-colors relative ${
                    activeTab === 'facts'
                      ? 'text-[#f5d799] border-b-2 border-[#c59b27]'
                      : 'text-[#9c8973] hover:text-[#ede2cd]'
                  }`}
                >
                  Historical Facts ({artwork.interestingFacts.length})
                </button>
                <button
                  onClick={() => {
                    museumAudio.playPlaqueClick();
                    setActiveTab('notes');
                  }}
                  className={`cursor-pointer pb-2 px-3 font-semibold transition-colors relative ${
                    activeTab === 'notes'
                      ? 'text-[#f5d799] border-b-2 border-[#c59b27]'
                      : 'text-[#9c8973] hover:text-[#ede2cd]'
                  }`}
                >
                  My Curatorial Notes
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'curatorial' && (
                <div className="space-y-4 text-xs sm:text-sm font-serif leading-relaxed text-[#d4c3ab]">
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-[#a89578] font-sans font-semibold mb-1">
                      Historical Context
                    </h4>
                    <p>{artwork.historicalContext}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-[#a89578] font-sans font-semibold mb-1">
                      Technique & Formal Composition
                    </h4>
                    <p>{artwork.curatorialNotes}</p>
                  </div>
                </div>
              )}

              {activeTab === 'facts' && (
                <ul className="space-y-3 text-xs sm:text-sm font-serif text-[#d4c3ab]">
                  {artwork.interestingFacts.map((fact, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <span className="text-[#c59b27] font-bold text-xs mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-2">
                  <p className="text-xs text-[#a89578] font-serif italic">
                    Record your personal impressions, historical reflections, or study notes for this artwork. Saved in your browser collection.
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Write your curatorial thoughts here..."
                    className="w-full h-32 p-3 bg-[#110d0a] border border-[#4a3622] rounded text-xs font-serif text-[#faf3e3] focus:outline-none focus:border-[#c59b27] placeholder:text-[#6e5d4b]"
                  />
                  <div className="text-[11px] text-[#8c7a65] text-right">
                    Saved automatically to My Collection
                  </div>
                </div>
              )}
            </div>

            {/* Related Masterworks in the Museum Wing */}
            {relatedArtworks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#3b2a1a]">
                <div className="text-[11px] uppercase tracking-wider text-[#a89578] font-sans font-semibold mb-2 flex items-center justify-between">
                  <span>Related Works in Collection</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {relatedArtworks.map(rel => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        museumAudio.playPlaqueClick();
                        onSelectRelated(rel);
                      }}
                      className="cursor-pointer p-2 rounded bg-[#1f1710] hover:bg-[#2e2115] border border-[#45331e] text-left transition-colors flex items-center gap-2 group"
                    >
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-10 h-10 object-cover rounded border border-[#6b522a]/50 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="font-serif text-xs text-[#f5ebd7] font-semibold truncate group-hover:text-[#f8d48d]">
                          {rel.title}
                        </div>
                        <div className="text-[11px] text-[#9c8973] truncate">
                          {rel.artist}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
