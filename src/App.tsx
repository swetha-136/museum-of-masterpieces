/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EXHIBITION_ROOMS, Artwork, ExhibitionRoom } from './data/museumData';
import { TopBar } from './components/TopBar';
import { MuseumEntrance } from './components/MuseumEntrance';
import { MuseumRoomView } from './components/MuseumRoomView';
import { MuseumCatalogue } from './components/MuseumCatalogue';
import { SearchAndDiscovery } from './components/SearchAndDiscovery';
import { MyCollection } from './components/MyCollection';
import { ExhibitDetailModal } from './components/ExhibitDetailModal';
import { FloorPlanModal } from './components/FloorPlanModal';
import { museumAudio } from './utils/audioSystem';

export default function App() {
  const [currentView, setCurrentView] = useState<'entrance' | 'museum' | 'catalogue' | 'search' | 'collection'>('entrance');
  const [currentRoomId, setCurrentRoomId] = useState<ExhibitionRoom['id']>('renaissance');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isFloorPlanOpen, setIsFloorPlanOpen] = useState<boolean>(false);

  const currentRoom = EXHIBITION_ROOMS.find((r) => r.id === currentRoomId) || EXHIBITION_ROOMS[0];

  const handleEnterMuseum = () => {
    setCurrentView('museum');
  };

  const handleJumpToRoom = (roomId: ExhibitionRoom['id']) => {
    setCurrentRoomId(roomId);
    setCurrentView('museum');
  };

  const handleSelectArtworkFromAnywhere = (artwork: Artwork) => {
    museumAudio.playPlaqueClick();
    setSelectedArtwork(artwork);
  };

  return (
    <div className="min-h-screen bg-[#120f0d] text-[#ede6d6] font-sans relative select-none">
      {/* Top Navigation Bar (Visible in all views except grand entrance screen for immersion) */}
      {currentView !== 'entrance' && (
        <TopBar
          currentView={currentView}
          onNavigate={(view) => {
            museumAudio.playFootstep();
            setCurrentView(view);
          }}
          onOpenFloorPlan={() => setIsFloorPlanOpen(true)}
          currentRoomNumber={currentRoom.number}
          currentRoomTitle={currentRoom.title}
        />
      )}

      {/* Main View Router */}
      <main className="w-full">
        {currentView === 'entrance' && (
          <MuseumEntrance
            onEnter={handleEnterMuseum}
            onOpenCatalogue={() => setCurrentView('catalogue')}
            onOpenSearch={() => setCurrentView('search')}
            onOpenFloorPlan={() => setIsFloorPlanOpen(true)}
          />
        )}

        {currentView === 'museum' && (
          <MuseumRoomView
            room={currentRoom}
            onSelectArtwork={handleSelectArtworkFromAnywhere}
            onNavigateRoom={handleJumpToRoom}
            onOpenFloorPlan={() => setIsFloorPlanOpen(true)}
            onOpenCatalogue={() => setCurrentView('catalogue')}
          />
        )}

        {currentView === 'catalogue' && (
          <MuseumCatalogue
            onSelectArtwork={handleSelectArtworkFromAnywhere}
            onJumpToRoom={handleJumpToRoom}
          />
        )}

        {currentView === 'search' && (
          <SearchAndDiscovery
            onSelectArtwork={handleSelectArtworkFromAnywhere}
            onJumpToRoom={handleJumpToRoom}
          />
        )}

        {currentView === 'collection' && (
          <MyCollection
            onSelectArtwork={handleSelectArtworkFromAnywhere}
            onJumpToRoom={handleJumpToRoom}
            onOpenCatalogue={() => setCurrentView('catalogue')}
          />
        )}
      </main>

      {/* Deep Exhibit Detail Modal with Zoom, Historical Context & Provenance */}
      {selectedArtwork && (
        <ExhibitDetailModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onSelectRelated={(related) => setSelectedArtwork(related)}
          onJumpToRoom={handleJumpToRoom}
        />
      )}

      {/* Museum Architectural Floor Plan / Wing Teleporter */}
      {isFloorPlanOpen && (
        <FloorPlanModal
          currentRoomId={currentRoomId}
          onSelectRoom={handleJumpToRoom}
          onClose={() => setIsFloorPlanOpen(false)}
        />
      )}
    </div>
  );
}
