import React, { useEffect } from 'react';
import { X, Compass, ArrowRight, MapPin } from 'lucide-react';
import { ExhibitionRoom, EXHIBITION_ROOMS } from '../data/museumData';
import { museumAudio } from '../utils/audioSystem';

interface FloorPlanModalProps {
  currentRoomId: ExhibitionRoom['id'];
  onSelectRoom: (roomId: ExhibitionRoom['id']) => void;
  onClose: () => void;
}

export const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  currentRoomId,
  onSelectRoom,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleRoomClick = (roomId: ExhibitionRoom['id']) => {
    museumAudio.playFootstep();
    onSelectRoom(roomId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Museum Architectural Floor Plan"
    >
      <div className="relative w-full max-w-4xl bg-[#17120e] border-2 border-[#543e26] rounded shadow-2xl p-6 sm:p-8 text-[#ede2cd]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3b2a1a] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[#c59b27]" />
            <div>
              <h3 className="font-display font-bold text-lg text-[#faf3e3] uppercase tracking-wider">
                Museum Wing Architectural Plan
              </h3>
              <p className="font-serif italic text-xs text-[#a99981]">
                Permanent Collections Pavilion · Ground & Mezzanine Levels
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              museumAudio.playPlaqueClick();
              onClose();
            }}
            className="cursor-pointer p-1.5 rounded bg-[#241a12] hover:bg-[#332419] border border-[#4a3622] text-[#d6c4a5]"
            aria-label="Close Floor Plan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vintage Architectural Blueprint Wing Layout */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {EXHIBITION_ROOMS.map((room, idx) => {
              const isCurrent = room.id === currentRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className={`cursor-pointer p-4 rounded text-left transition-all border relative flex flex-col justify-between h-44 ${
                    isCurrent
                      ? 'bg-[#332416] border-[#dfb743] shadow-[0_0_15px_rgba(223,183,67,0.25)]'
                      : 'bg-[#1e1610] border-[#42311e] hover:border-[#8f6e33] hover:bg-[#281d14]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-[#c59b27] font-semibold">{room.number}</span>
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-[#dfb743] font-sans font-bold">
                          <MapPin className="w-3 h-3 animate-bounce" />
                          <span>HERE</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#faf3e3] leading-tight mb-1">
                      {room.title}
                    </h4>

                    <div className="text-[11px] font-serif text-[#a89578] italic">
                      {room.era}
                    </div>
                  </div>

                  <div className="text-[10px] text-[#786650] font-sans border-t border-[#3b2b1b] pt-2">
                    {room.artworks.length} Masterworks
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend & Navigation Tips */}
        <div className="border-t border-[#3b2a1a] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif text-[#9e8b73]">
          <div>
            Click any gallery wing to teleport directly to its exhibition room.
          </div>
          <div className="text-[11px] font-sans text-[#786650]">
            Use Left / Right keyboard arrow keys to step between paintings.
          </div>
        </div>
      </div>
    </div>
  );
};
