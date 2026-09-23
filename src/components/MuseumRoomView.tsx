import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Info, Compass, Maximize2, Sparkles, BookOpen } from 'lucide-react';
import { ExhibitionRoom, Artwork, EXHIBITION_ROOMS } from '../data/museumData';
import { ArtworkFrame } from './ArtworkFrame';
import { museumAudio } from '../utils/audioSystem';

// Import generated atmospheric gallery backdrops
import renaissanceBg from '../assets/images/museum_renaissance_wing_1790143280620.jpg';
import grandHallBg from '../assets/images/museum_grand_hall_1790143263556.jpg';
import indianGalleryBg from '../assets/images/museum_indian_gallery_1790143295956.jpg';

interface MuseumRoomViewProps {
  room: ExhibitionRoom;
  onSelectArtwork: (artwork: Artwork) => void;
  onNavigateRoom: (roomId: ExhibitionRoom['id']) => void;
  onOpenFloorPlan: () => void;
  onOpenCatalogue: () => void;
}

export const MuseumRoomView: React.FC<MuseumRoomViewProps> = ({
  room,
  onSelectArtwork,
  onNavigateRoom,
  onOpenFloorPlan,
  onOpenCatalogue,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [cameraMode, setCameraMode] = useState<'room' | 'focus'>('room');
  const [showRoomIntro, setShowRoomIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch swipe support for mobile
  const touchStartX = useRef<number>(0);

  // Background photographic texture based on room identity
  const getRoomBackground = () => {
    switch (room.id) {
      case 'renaissance':
        return renaissanceBg;
      case 'indian':
        return indianGalleryBg;
      case 'impressionism':
      case 'post-impressionism':
      case 'modern':
      default:
        return grandHallBg;
    }
  };

  // Keyboard navigation for desktop: Left/Right arrows cycle artworks; Escape returns to room view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextArtwork();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevArtwork();
      } else if (e.key === 'Escape') {
        setCameraMode('room');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, room.artworks.length]);

  const handleNextArtwork = () => {
    museumAudio.playFootstep();
    setFocusedIndex((prev) => (prev + 1) % room.artworks.length);
    setCameraMode('focus');
  };

  const handlePrevArtwork = () => {
    museumAudio.playFootstep();
    setFocusedIndex((prev) => (prev - 1 + room.artworks.length) % room.artworks.length);
    setCameraMode('focus');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) handleNextArtwork();
      else handlePrevArtwork();
    }
  };

  const currentArtwork = room.artworks[focusedIndex] || room.artworks[0];

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen bg-[#110e0b] pt-16 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 35mm Analog Film Grain Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none film-grain" />

      {/* Layered 3D Spatial Museum Architecture Environment */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Archival Gallery Hall Backdrop with Soft 1990s Lighting */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen filter saturate-75 brightness-75 scale-105"
          style={{ backgroundImage: `url(${getRoomBackground()})` }}
        />

        {/* Tall Exhibition Walls with Classical Decorative Wainscoting & Crown Moulding */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806] via-[#1a140f] to-[#120e0a]" />

        {/* Upper Plaster Crown Moulding & Picture Hanging Brass Rail */}
        <div className="absolute top-16 left-0 right-0 h-6 border-b border-[#3b2a1a] bg-[#140e0a] shadow-md flex items-center justify-between px-8">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#8a6829]/60 to-transparent" />
        </div>

        {/* Ambient Ceiling Spotlights Array */}
        <div className="absolute top-16 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-amber-400/8 blur-3xl pointer-events-none" />
        <div className="absolute top-16 left-3/4 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        {/* 3D Herringbone Parquet Oak Flooring with Subtle Warm Varnish Reflections */}
        <div className="absolute bottom-0 left-0 right-0 h-[38vh] parquet-floor border-t border-[#4a3622] transform perspective-[800px] rotate-x-[15deg]">
          {/* Floor Vignette and Wall Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />
        </div>
      </div>

      {/* Museum Room Header & Curatorial Orientation Banner */}
      <div className="relative z-30 pt-4 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-[#c59b27] tracking-[0.2em] uppercase text-sm sm:text-base">
            {room.number}
          </span>
          <span className="text-[#594734]">·</span>
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#f5ebd7] tracking-wide">
            {room.title}
          </h2>
          <span className="hidden md:inline text-xs text-[#a3947f] font-serif italic">
            ({room.era})
          </span>
        </div>

        {/* Room Navigation Buttons & Curatorial Intro Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              setShowRoomIntro(!showRoomIntro);
            }}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1 bg-[#221810]/80 hover:bg-[#302216] border border-[#543e26] text-[#ded1ba] rounded text-xs transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-[#c59b27]" />
            <span className="hidden sm:inline">Room Notes</span>
          </button>

          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onOpenFloorPlan();
            }}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1 bg-[#221810]/80 hover:bg-[#302216] border border-[#543e26] text-[#ded1ba] rounded text-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
            <span className="hidden sm:inline">Wing Map</span>
          </button>
        </div>
      </div>

      {/* Collapsible Curator Introduction Plaque at Entrance of Gallery */}
      {showRoomIntro && (
        <div className="relative z-30 max-w-3xl mx-auto my-2 px-6 py-3.5 bg-[#18120d]/90 border border-[#6b522a] shadow-2xl rounded text-center backdrop-blur-sm transition-all">
          <p className="font-serif text-xs sm:text-sm text-[#e0d2be] leading-relaxed italic">
            "{room.curatorIntro}"
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-[#a19077] uppercase tracking-wider font-display">
            <span>{room.subtitle}</span>
            <span>·</span>
            <button
              onClick={() => setShowRoomIntro(false)}
              className="cursor-pointer text-[#d4af37] hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* MAIN 3D EXHIBITION GALLERY WALL & ARTWORK STAGE */}
      <div className="relative z-20 flex-1 flex items-center justify-center my-auto px-4 sm:px-12 py-6 overflow-hidden">
        {/* Doorway to Previous Gallery (Left) */}
        {room.prevRoomId && (
          <button
            onClick={() => {
              museumAudio.playFootstep();
              onNavigateRoom(room.prevRoomId as ExhibitionRoom['id']);
            }}
            className="group absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 cursor-pointer p-2 sm:p-3 rounded-full bg-[#1c140d]/80 hover:bg-[#2e2115] border border-[#6b522a] text-[#decab0] shadow-2xl transition-all hover:scale-110 flex items-center gap-2"
            title="Walk to Previous Gallery"
            aria-label="Walk to previous gallery"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27] group-hover:-translate-x-0.5 transition-transform" />
            <div className="hidden lg:block text-left text-[11px]">
              <div className="text-[#8c7a65] uppercase tracking-wider text-[10px]">Previous Wing</div>
              <div className="text-[#ded1ba] font-serif truncate max-w-[100px]">
                {EXHIBITION_ROOMS.find(r => r.id === room.prevRoomId)?.title}
              </div>
            </div>
          </button>
        )}

        {/* Doorway to Next Gallery (Right) */}
        {room.nextRoomId && (
          <button
            onClick={() => {
              museumAudio.playFootstep();
              onNavigateRoom(room.nextRoomId as ExhibitionRoom['id']);
            }}
            className="group absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 cursor-pointer p-2 sm:p-3 rounded-full bg-[#1c140d]/80 hover:bg-[#2e2115] border border-[#6b522a] text-[#decab0] shadow-2xl transition-all hover:scale-110 flex items-center gap-2"
            title="Walk to Next Gallery"
            aria-label="Walk to next gallery"
          >
            <div className="hidden lg:block text-right text-[11px]">
              <div className="text-[#8c7a65] uppercase tracking-wider text-[10px]">Next Wing</div>
              <div className="text-[#ded1ba] font-serif truncate max-w-[100px]">
                {EXHIBITION_ROOMS.find(r => r.id === room.nextRoomId)?.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27] group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* 3D Exhibition Wall Display: Artworks positioned with depth and spatial perspective */}
        <div className="relative w-full max-w-5xl flex items-center justify-center transition-all duration-700">
          {/* Focused Painting Front and Center */}
          <div className="flex flex-col items-center">
            <ArtworkFrame
              artwork={currentArtwork}
              isFocused={true}
              onFocus={() => {
                museumAudio.playPlaqueClick();
                setCameraMode('focus');
              }}
              onExamine={() => {
                museumAudio.playPlaqueClick();
                onSelectArtwork(currentArtwork);
              }}
            />
          </div>
        </div>
      </div>

      {/* Classic Vintage Gallery Bench in Foreground of Parquet Floor */}
      <div className="relative z-10 w-full flex justify-center -mb-2 pointer-events-none">
        <div className="relative w-64 sm:w-80 h-10 bg-gradient-to-r from-[#291e14] via-[#453221] to-[#291e14] rounded-t-sm shadow-[0_15px_30px_rgba(0,0,0,0.9)] border-t border-[#664b2d] flex items-center justify-center">
          <div className="w-full h-1 bg-[#1a130c] shadow-inner" />
          {/* Subtle brass plate on bench center */}
          <div className="absolute top-1 px-3 py-0.5 text-[8px] tracking-[0.25em] font-serif uppercase text-[#8c744c]">
            Museum Visitor Seat
          </div>
        </div>
      </div>

      {/* Museum Bottom Floor Navigation & Artwork Carousel Ribbon */}
      <div className="relative z-30 border-t border-[#3b2a1a] bg-[#140e09]/95 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Artwork Selector Rail / Gallery Strip */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8a7965] font-display hidden sm:inline mr-2">
              In this gallery:
            </span>
            {room.artworks.map((art, idx) => (
              <button
                key={art.id}
                onClick={() => {
                  museumAudio.playFootstep();
                  setFocusedIndex(idx);
                  setCameraMode('focus');
                }}
                className={`cursor-pointer px-3 py-1.5 rounded text-xs font-serif transition-all whitespace-nowrap flex items-center gap-2 border ${
                  focusedIndex === idx
                    ? 'bg-[#3b2a19] border-[#c59b27] text-[#fceecf] font-semibold shadow-md'
                    : 'bg-[#18110b] border-[#382819] text-[#b3a18a] hover:text-[#e8dac2] hover:border-[#694d2f]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
                <span>{art.title}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions & Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrevArtwork}
              className="cursor-pointer p-1.5 bg-[#20160e] hover:bg-[#2e1f14] border border-[#523d26] text-[#d6c4a5] rounded transition-colors"
              title="Previous Painting (Left Arrow)"
              aria-label="Previous painting"
            >
              <ChevronLeft className="w-4 h-4 text-[#c59b27]" />
            </button>
            <span className="text-xs font-mono text-[#a3937d] px-1 tabular-nums">
              {focusedIndex + 1} / {room.artworks.length}
            </span>
            <button
              onClick={handleNextArtwork}
              className="cursor-pointer p-1.5 bg-[#20160e] hover:bg-[#2e1f14] border border-[#523d26] text-[#d6c4a5] rounded transition-colors"
              title="Next Painting (Right Arrow)"
              aria-label="Next painting"
            >
              <ChevronRight className="w-4 h-4 text-[#c59b27]" />
            </button>

            <span className="text-[#473523] mx-1">|</span>

            <button
              onClick={() => onSelectArtwork(currentArtwork)}
              className="cursor-pointer px-3 py-1 text-xs font-serif bg-[#8a6829] hover:bg-[#a37c32] text-[#1c1206] font-semibold rounded shadow transition-colors flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Exhibit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
