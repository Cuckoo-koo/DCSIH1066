import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Compass,
  MapPin,
  Volume2,
  Sparkles,
  ArrowRight,
  Layers,
  Info
} from 'lucide-react';
import { INDIAN_STATES } from '../data/indiaGeoData';
import { CulturalEntry } from '../types';
import { useAtlasStore } from '../store/useAtlasStore';

// Custom Leaflet Pin Marker Icon with Heritage Orange Pin Glow
const createHeritagePin = (categoryName: string, isSelected: boolean) => {
  const color = isSelected ? '#E07A1F' : '#2563EB';
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface InteractiveMapProps {
  entries: CulturalEntry[];
  onSelectEntry: (entry: CulturalEntry) => void;
}

// Map Zoom Controller component to trigger smooth zoom (0.8s) when state is clicked
const MapViewController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ entries, onSelectEntry }) => {
  const { filters, setFilters, selectedState, setSelectedState } = useAtlasStore();
  const [activeRegionFilter, setActiveRegionFilter] = useState<string | null>(null);

  // Determine current map center
  const activeStateObj = INDIAN_STATES.find(s => s.id === selectedState || s.id === filters.selectedState);
  const mapCenter: [number, number] = activeStateObj ? activeStateObj.coordinates : [22.5937, 78.9629]; // Default Center of India
  const mapZoom = activeStateObj ? activeStateObj.zoom : 5;

  const filteredEntries = entries.filter(entry => {
    if (selectedState && entry.state_id !== selectedState) return false;
    if (filters.selectedCategory && entry.category_id !== filters.selectedCategory) return false;
    return true;
  });

  return (
    <div className="relative w-full h-[650px] bg-cream-200 rounded-3xl overflow-hidden border border-cream-300 shadow-lg">

      {/* Map Control Overlay Header */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-cream-300 shadow-md max-w-sm">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-heritage-600 animate-spin" style={{ animationDuration: '12s' }} />
          <h2 className="font-heading font-bold text-sm text-charcoal-900">
            Interactive India Cultural Atlas Map
          </h2>
        </div>
        <p className="text-[11px] text-charcoal-700 mt-1">
          Click state nodes or map pins to discover oral bards, sacred songs & endangered dialects.
        </p>

        {/* Region Quick Filters */}
        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-cream-200">
          {['North', 'South', 'East', 'West', 'NorthEast', 'Central'].map(region => (
            <button
              key={region}
              onClick={() => {
                const firstStateInRegion = INDIAN_STATES.find(s => s.region === region);
                if (firstStateInRegion) {
                  setSelectedState(firstStateInRegion.id);
                  setFilters({ selectedState: firstStateInRegion.id });
                }
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                activeStateObj?.region === region
                  ? 'bg-heritage-500 text-white shadow-xs'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              {region}
            </button>
          ))}
          {selectedState && (
            <button
              onClick={() => { setSelectedState(null); setFilters({ selectedState: null }); }}
              className="px-2 py-0.5 rounded text-[10px] font-semibold text-red-600 bg-red-50 hover:bg-red-100"
            >
              Reset Zoom
            </button>
          )}
        </div>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Bharat Culture Atlas'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewController center={mapCenter} zoom={mapZoom} />

        {/* Render Markers for Cultural Entries */}
        {filteredEntries.map(entry => (
          <Marker
            key={entry.id}
            position={[entry.latitude, entry.longitude]}
            icon={createHeritagePin(entry.category_name, true)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 max-w-xs font-sans">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-heritage-100 text-heritage-700 mb-1">
                  {entry.category_name} • {entry.language.split('(')[0]}
                </span>
                <h4 className="font-heading font-bold text-xs text-charcoal-900 leading-snug">
                  {entry.title}
                </h4>
                <p className="text-[11px] text-charcoal-700 mt-1 line-clamp-2">
                  {entry.description}
                </p>
                <div className="mt-2 pt-2 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-heritage-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-0.5" />
                    {entry.district_name}, {entry.state_name}
                  </span>
                  <button
                    onClick={() => onSelectEntry(entry)}
                    className="px-2.5 py-1 bg-heritage-500 text-white rounded text-[10px] font-semibold hover:bg-heritage-600 transition-colors shadow-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* State Quick Navigation Sidebar Drawer on Map */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-cream-300 shadow-lg max-w-xs hidden md:block">
        <p className="text-[11px] font-bold text-charcoal-800 uppercase tracking-wider mb-2 flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1 text-heritage-500" />
          Active State Focus
        </p>
        {activeStateObj ? (
          <div className="space-y-1.5 text-xs">
            <p className="font-heading font-bold text-sm text-heritage-600">{activeStateObj.name}</p>
            <p className="text-[11px] text-charcoal-700">{activeStateObj.description}</p>
            <div className="pt-2 border-t border-cream-200 flex justify-between text-[11px]">
              <span className="font-semibold text-charcoal-800">{activeStateObj.traditions_count} Preserved Records</span>
              <span className="text-heritage-600 font-medium">{activeStateObj.districts.length} Districts</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-charcoal-700 italic">
            Zooming across India. Click any region button to focus state.
          </p>
        )}
      </div>

    </div>
  );
};
