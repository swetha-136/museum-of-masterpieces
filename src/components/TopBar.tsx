import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Compass, BookOpen, Search, Bookmark, DoorOpen } from 'lucide-react';
import { museumAudio } from '../utils/audioSystem';
import { getFavouriteIds, subscribeToCollection } from '../utils/collectionStore';

interface TopBarProps {
  currentView: 'entrance' | 'museum' | 'catalogue' | 'search' | 'collection';
  onNavigate: (view: 'entrance' | 'museum' | 'catalogue' | 'search' | 'collection') => void;
  onOpenFloorPlan: () => void;
  currentRoomNumber?: string;
  currentRoomTitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onNavigate,
  onOpenFloorPlan,
  currentRoomNumber,
  currentRoomTitle,
}) => {
  const [isMuted, setIsMuted] = useState(museumAudio.getMuted());
  const [favouriteCount, setFavouriteCount] = useState(getFavouriteIds().length);

  useEffect(() => {
    const unsubAudio = museumAudio.subscribe(setIsMuted);
    const unsubCol = subscribeToCollection(() => {
      setFavouriteCount(getFavouriteIds().length);
    });
    return () => {
      unsubAudio();
      unsubCol();
    };
  }, []);

  const handleToggleAudio = () => {
    const muted = museumAudio.toggleMute();
    setIsMuted(muted);
    museumAudio.playPlaqueClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#16120e]/92 backdrop-blur-md border-b border-[#3d2f21] text-[#ede6d6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            museumAudio.playPlaqueClick();
            onNavigate('entrance');
          }}
          className="text-left group cursor-pointer"
          title="Return to Grand Entrance"
        >
          <span className="font-display text-base sm:text-lg tracking-[0.2em] font-bold text-[#e5c98d] group-hover:text-[#f8e7b9] transition-colors uppercase whitespace-nowrap">
            Virtual Art Museum
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links (single line, unboxed, subtle hover) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium tracking-wide">
          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onNavigate('museum');
            }}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentView === 'museum'
                ? 'text-[#f5d799] font-semibold'
                : 'text-[#c2b59f] hover:text-[#ede6d6]'
            }`}
          >
            Galleries
            {currentView === 'museum' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c59b27]" />
            )}
          </button>

          <button
            onClick={() => {
              museumAudio.playPageTurn();
              onNavigate('catalogue');
            }}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentView === 'catalogue'
                ? 'text-[#f5d799] font-semibold'
                : 'text-[#c2b59f] hover:text-[#ede6d6]'
            }`}
          >
            The Catalogue
            {currentView === 'catalogue' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c59b27]" />
            )}
          </button>

          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onNavigate('search');
            }}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentView === 'search'
                ? 'text-[#f5d799] font-semibold'
                : 'text-[#c2b59f] hover:text-[#ede6d6]'
            }`}
          >
            Search Archive
            {currentView === 'search' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c59b27]" />
            )}
          </button>

          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onNavigate('collection');
            }}
            className={`cursor-pointer transition-colors relative py-1 flex items-center gap-1.5 ${
              currentView === 'collection'
                ? 'text-[#f5d799] font-semibold'
                : 'text-[#c2b59f] hover:text-[#ede6d6]'
            }`}
          >
            My Collection
            {favouriteCount > 0 && (
              <span className="text-xs font-mono text-[#c59b27]">({favouriteCount})</span>
            )}
            {currentView === 'collection' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c59b27]" />
            )}
          </button>

          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onOpenFloorPlan();
            }}
            className="cursor-pointer text-[#c2b59f] hover:text-[#ede6d6] transition-colors py-1 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Floor Plan</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Ambience Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs font-serif tracking-wider border rounded transition-colors whitespace-nowrap ${
              !isMuted
                ? 'bg-[#291e13] border-[#9a7837] text-[#f5d799]'
                : 'bg-[#18130e] border-[#3d2f21] text-[#a89b88] hover:text-[#ede6d6]'
            }`}
            title={isMuted ? 'Turn on subtle museum audio ambience' : 'Mute museum audio'}
            aria-label="Toggle Museum Audio"
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#dfb743] animate-pulse" />
                <span className="hidden sm:inline">Ambience On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8c7e6b]" />
                <span className="hidden sm:inline">Sound Off</span>
              </>
            )}
          </button>

          {/* Quick Exit/Entrance Toggle */}
          {currentView !== 'entrance' ? (
            <button
              onClick={() => {
                museumAudio.playFootstep();
                onNavigate('entrance');
              }}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium tracking-wide bg-[#2a1d12] hover:bg-[#382618] border border-[#5c4327] text-[#e8dac0] rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <DoorOpen className="w-3.5 h-3.5 text-[#c59b27]" />
              <span className="hidden sm:inline">Vestibule</span>
            </button>
          ) : (
            <button
              onClick={() => {
                museumAudio.playFootstep();
                onNavigate('museum');
              }}
              className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold tracking-wider bg-[#8a6829] hover:bg-[#a17a32] text-[#1a1208] rounded shadow transition-colors whitespace-nowrap"
            >
              Enter Galleries
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for compact viewports */}
      <div className="md:hidden flex items-center justify-around border-t border-[#2e2319] bg-[#140f0c] py-2 px-3 text-xs">
        <button
          onClick={() => {
            museumAudio.playPlaqueClick();
            onNavigate('museum');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'museum' ? 'text-[#e5c98d]' : 'text-[#8f8270]'
          }`}
        >
          <DoorOpen className="w-4 h-4" />
          <span>Rooms</span>
        </button>
        <button
          onClick={() => {
            museumAudio.playPageTurn();
            onNavigate('catalogue');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'catalogue' ? 'text-[#e5c98d]' : 'text-[#8f8270]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catalogue</span>
        </button>
        <button
          onClick={() => {
            museumAudio.playPlaqueClick();
            onNavigate('search');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'search' ? 'text-[#e5c98d]' : 'text-[#8f8270]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        <button
          onClick={() => {
            museumAudio.playPlaqueClick();
            onNavigate('collection');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'collection' ? 'text-[#e5c98d]' : 'text-[#8f8270]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Collection {favouriteCount > 0 && `(${favouriteCount})`}</span>
        </button>
        <button
          onClick={() => {
            museumAudio.playPlaqueClick();
            onOpenFloorPlan();
          }}
          className="flex flex-col items-center gap-0.5 text-[#8f8270]"
        >
          <Compass className="w-4 h-4" />
          <span>Map</span>
        </button>
      </div>
    </header>
  );
};
