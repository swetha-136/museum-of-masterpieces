import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Compass, Search, ChevronRight } from 'lucide-react';
import { museumAudio } from '../utils/audioSystem';
import entranceImage from '../assets/images/museum_entrance_facade_1790143242907.jpg';

interface MuseumEntranceProps {
  onEnter: () => void;
  onOpenCatalogue: () => void;
  onOpenSearch: () => void;
  onOpenFloorPlan: () => void;
}

export const MuseumEntrance: React.FC<MuseumEntranceProps> = ({
  onEnter,
  onOpenCatalogue,
  onOpenSearch,
  onOpenFloorPlan,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(museumAudio.getMuted());

  const handleEnterClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    museumAudio.playFootstep();
    museumAudio.playPlaqueClick();
    // Prompt asks for audio not to autoplay without interaction; now user has interacted:
    if (museumAudio.getMuted()) {
      museumAudio.toggleMute();
      setIsMuted(false);
    }
    // Cinematic camera zoom into museum entrance (1.4s delay for camera dolly)
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = museumAudio.toggleMute();
    setIsMuted(muted);
    museumAudio.playPlaqueClick();
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0d0a08] flex flex-col justify-between selection:bg-[#78350f] selection:text-[#fef3c7]">
      {/* Background 1990s Museum Photographic Image with Cinematic Zoom Transition */}
      <div
        className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out ${
          isTransitioning ? 'scale-125 brightness-110 filter blur-[1px]' : 'scale-100 filter brightness-95'
        }`}
        style={{
          backgroundImage: `url(${entranceImage})`,
        }}
      >
        {/* Soft 1990s Analog Film Vignette & Warm Tungsten Amber Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-[#120d09]/60 to-[#0d0a08]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0d0a08]/40 to-[#070504]/90" />
      </div>

      {/* 35mm Analog Film Grain Texture */}
      <div className="absolute inset-0 z-10 pointer-events-none film-grain" />

      {/* Top Heritage Header Strip */}
      <div className="relative z-20 pt-8 px-6 sm:px-12 flex justify-between items-center text-xs tracking-widest uppercase font-serif text-[#d8c7a6]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#dfb743] shadow-[0_0_8px_#dfb743]" />
          <span>Pavilion of Masterworks · Permanent Archives</span>
        </div>
        <button
          onClick={handleToggleAudio}
          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 border border-[#523e27] bg-[#1a130c]/70 hover:bg-[#281d12] text-[#d6c4a3] rounded transition-colors"
        >
          {!isMuted ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#dfb743] animate-pulse" />
              <span>Ambience Active</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#8f8270]" />
              <span>Unmute Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Center Monumental Classical Entrance Content */}
      <div
        className={`relative z-20 max-w-4xl mx-auto px-6 text-center my-auto flex flex-col items-center transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100'
        }`}
      >
        {/* Archival Roman Numerals & Institutional Crest */}
        <div className="mb-4 inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[#c2ad82] font-display">
          <span className="h-[1px] w-8 bg-[#8c703b]" />
          <span>Curatorial Collection · Est. MCMXCVI</span>
          <span className="h-[1px] w-8 bg-[#8c703b]" />
        </div>

        {/* Mandatory Title: VIRTUAL ART MUSEUM */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.16em] text-[#faf5ea] uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] mb-3">
          Virtual Art Museum
        </h1>

        {/* Mandatory Subtitle: Explore Art. Discover History. */}
        <p className="font-serif text-lg sm:text-2xl text-[#dccbb0] italic tracking-wide max-w-2xl mx-auto mb-10 text-balance drop-shadow">
          Explore Art. Discover History.
        </p>

        {/* Primary Action Button: Styled like an elegant antique museum plaque */}
        <button
          onClick={handleEnterClick}
          className="group relative cursor-pointer px-10 sm:px-14 py-4 sm:py-5 brass-plaque rounded-sm transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#f5d799] focus:ring-offset-4 focus:ring-offset-[#120d09]"
          aria-label="Enter Virtual Art Museum"
        >
          {/* Subtle Outer Inset Screws on Plaque Corners */}
          <span className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-[#523d13] shadow-inner" />
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#523d13] shadow-inner" />
          <span className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-[#523d13] shadow-inner" />
          <span className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#523d13] shadow-inner" />

          {/* Inner Plaque Border */}
          <div className="border border-[#755519]/70 px-6 py-2 flex items-center gap-3">
            <span className="font-display font-bold text-sm sm:text-base tracking-[0.25em] text-[#221706] uppercase group-hover:text-[#120a02]">
              Enter Museum
            </span>
            <ChevronRight className="w-4 h-4 text-[#4a340b] group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Entrance Hall Quick Gateways */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-[#b8a78a] font-serif">
          <button
            onClick={() => {
              museumAudio.playPageTurn();
              onOpenCatalogue();
            }}
            className="cursor-pointer hover:text-[#faebd0] flex items-center gap-1.5 transition-colors underline-offset-4 hover:underline"
          >
            <BookOpen className="w-4 h-4 text-[#c59b27]" />
            <span>Browse The Catalogue</span>
          </button>
          <span className="text-[#594734]">·</span>
          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onOpenSearch();
            }}
            className="cursor-pointer hover:text-[#faebd0] flex items-center gap-1.5 transition-colors underline-offset-4 hover:underline"
          >
            <Search className="w-4 h-4 text-[#c59b27]" />
            <span>Archival Search</span>
          </button>
          <span className="text-[#594734]">·</span>
          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onOpenFloorPlan();
            }}
            className="cursor-pointer hover:text-[#faebd0] flex items-center gap-1.5 transition-colors underline-offset-4 hover:underline"
          >
            <Compass className="w-4 h-4 text-[#c59b27]" />
            <span>Museum Floor Plan</span>
          </button>
        </div>
      </div>

      {/* Operational Utility Ribbon & 1990s Curatorial Information Strip */}
      <div className="relative z-20 border-t border-[#3b2d1f]/90 bg-[#140e0a]/85 backdrop-blur-sm py-4 px-6 sm:px-12 text-xs text-[#a99a82] font-serif">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <span>Galleries: Renaissance · Impressionism · Post-Impressionism · Modern · Indian Masters</span>
            <span className="hidden sm:inline text-[#594734]">·</span>
            <span>Admission: Open Public Access</span>
          </div>
          <div className="text-[#7d6f5c] text-[11px] font-sans">
            Archival 1990s Photographic Documentation & Spatial Experience
          </div>
        </div>
      </div>
    </div>
  );
};
