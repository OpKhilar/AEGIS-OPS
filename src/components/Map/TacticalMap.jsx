import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGION } from '../../config/region';
import { 
  Layers, 
  MapPin, 
  Crosshair, 
  Shield, 
  Radio, 
  Flame, 
  AlertTriangle, 
  Maximize2,
  Minimize2,
  Navigation,
  HeartPulse,
  Users,
  Building2,
  Globe
} from 'lucide-react';

export default function TacticalMap({
  incidents = [],
  responders = [],
  resources = [],
  userBeacon = null,
  focusedItem = null,
  onSelectIncident,
  onSelectResponder,
  onSelectResource
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelLayerRef = useRef(null);
  const markersRef = useRef({});
  
  // Layer toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showMedical, setShowMedical] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);
  const [tileStyle, setTileStyle] = useState('dark'); // 'dark' | 'osm'
  const [severityFilter, setSeverityFilter] = useState('all');
  const [cursorCoords, setCursorCoords] = useState({ lat: REGION.center[0], lng: REGION.center[1] });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: REGION.center,
      zoom: REGION.defaultZoom,
      minZoom: REGION.minZoom,
      maxZoom: REGION.maxZoom,
      zoomControl: false
    });

    // Default Esri Dark Gray Canvas tiles (keyless; CARTO basemaps now require an API key)
    const initialTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16
    }).addTo(map);

    const initialLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      pane: 'shadowPane'
    }).addTo(map);

    tileLayerRef.current = initialTiles;
    labelLayerRef.current = initialLabels;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('mousemove', (e) => {
      setCursorCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4))
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Toggle between Dark Mode and standard OpenStreetMap tiles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    if (tileStyle === 'osm') {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
      }).addTo(map);
      labelLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        pane: 'shadowPane'
      }).addTo(map);
    }
  }, [tileStyle]);

  // Update map markers when data or layer toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach(layer => map.removeLayer(layer));
    markersRef.current = {};

    // 1. Plot Active Incidents (lat, long, type, description)
    if (showIncidents) {
      incidents.forEach(inc => {
        if (severityFilter !== 'all' && inc.severity !== severityFilter) return;

        const isCritical = inc.severity === 'critical';
        const colorClass = isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950';
        const ringClass = isCritical ? 'ring-rose-500/50' : 'ring-amber-500/40';
        const pingColor = isCritical ? 'bg-rose-500' : 'bg-amber-500';

        const iconHtml = `
          <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer">
            <span class="absolute w-12 h-12 rounded-full ${pingColor} opacity-40 animate-ping"></span>
            <div class="relative w-8 h-8 rounded-full ${colorClass} ring-4 ${ringClass} shadow-xl flex items-center justify-center font-bold text-xs">
              ${inc.type === 'fire' ? '🔥' : inc.type === 'flood' ? '🌊' : inc.type === 'hazmat' ? '☣️' : '⚠️'}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-incident-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const marker = L.marker(inc.location, { icon: customIcon }).addTo(map);

        const popupContent = `
          <div class="p-2 space-y-2 text-xs font-sans min-w-[250px] theme-popup">
            <div class="flex items-center justify-between gap-2 pb-1.5" style="border-bottom: 1px solid var(--line)">
              <span class="font-mono font-bold text-rose-400">${inc.id}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }">${inc.severity} • ${inc.type.toUpperCase()}</span>
            </div>
            <div class="font-bold text-sm leading-tight" style="color: var(--ink)">${inc.title}</div>
            <p class="text-[11px] leading-relaxed" style="color: var(--ink-3)">${inc.description}</p>
            <div class="rounded p-2 space-y-1 text-[11px]" style="background: var(--app-bg-2); border: 1px solid var(--line)">
              <div class="flex justify-between"><span style="color: var(--ink-3)">Casualties:</span> <span class="font-semibold" style="color: var(--ink)">${inc.casualties}</span></div>
              <div class="flex justify-between"><span style="color: var(--ink-3)">Address:</span> <span style="color: var(--ink-2)">${inc.address}</span></div>
              <div class="flex justify-between font-mono text-[10px]" style="color: var(--ink-3)"><span>Coords:</span> <span class="text-rose-400">${inc.location[0].toFixed(4)}, ${inc.location[1].toFixed(4)}</span></div>
            </div>
            <div class="pt-1 flex items-center justify-between text-[10px] font-mono" style="color: var(--ink-3)">
              <span>Status: <span class="text-emerald-500 font-bold">${inc.status?.toUpperCase()}</span></span>
              <span class="text-sky-500">${inc.assignedResponders?.length || 0} units assigned</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectIncident) onSelectIncident(inc);
        });

        markersRef.current[`inc-${inc.id}`] = marker;

        if (inc.radius) {
          const circle = L.circle(inc.location, {
            radius: inc.radius,
            color: isCritical ? '#f43f5e' : '#f59e0b',
            weight: 1.5,
            fillColor: isCritical ? '#f43f5e' : '#f59e0b',
            fillOpacity: 0.12,
            dashArray: '4, 6'
          }).addTo(map);
          markersRef.current[`circle-${inc.id}`] = circle;
        }
      });
    }

    // 2. Plot Nearby Resources (Shelters, Medical Centers, Volunteer Hubs)
    resources.forEach(res => {
      const isShelter = res.type === 'shelter';
      const isMedical = res.type === 'medical_center';
      const isVolunteer = res.type === 'volunteer_hub';

      if (isShelter && !showShelters) return;
      if (isMedical && !showMedical) return;
      if (isVolunteer && !showVolunteers) return;

      let markerBg = 'bg-emerald-600 text-white ring-emerald-400/50';
      let iconEmoji = '🛡️';
      let typeLabel = 'EMERGENCY SHELTER';

      if (isMedical) {
        markerBg = 'bg-rose-600 text-white ring-rose-400/50';
        iconEmoji = '🏥';
        typeLabel = 'TRAUMA & MEDICAL CENTER';
      } else if (isVolunteer) {
        markerBg = 'bg-purple-600 text-white ring-purple-400/50';
        iconEmoji = '🤝';
        typeLabel = 'VOLUNTEER & RELIEF DEPOT';
      }

      const iconHtml = `
        <div class="relative flex items-center justify-center w-7 h-7 cursor-pointer hover:scale-110 transition-transform">
          <div class="w-7 h-7 rounded-lg ${markerBg} ring-2 shadow-xl flex items-center justify-center text-xs">
            ${iconEmoji}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-resource-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker(res.location, { icon: customIcon }).addTo(map);

      const percent = Math.round((res.capacityCurrent / res.capacityMax) * 100);
      const servicesList = Array.isArray(res.services) ? res.services.join(', ') : (res.services || 'General Emergency Aid');

      const popupContent = `
        <div class="p-2 space-y-2 text-xs font-sans min-w-[260px] theme-popup">
          <div class="flex items-center justify-between pb-1" style="border-bottom: 1px solid var(--line)">
            <span class="font-mono font-bold text-[10px] ${
              isMedical ? 'text-rose-400' : isVolunteer ? 'text-purple-400' : 'text-emerald-500'
            }">${typeLabel}</span>
            <span class="text-[10px] font-mono" style="color: var(--ink-3)">${percent}% CAPACITY</span>
          </div>
          <div class="font-bold text-sm" style="color: var(--ink)">${res.name}</div>
          <div class="text-[11px]" style="color: var(--ink-2)">📍 ${res.address}</div>
          
          <div class="w-full rounded-full h-1.5 overflow-hidden" style="background: var(--line-strong)">
            <div class="h-full ${percent > 85 ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${percent}%"></div>
          </div>
          <div class="text-[10px] font-mono" style="color: var(--ink-3)">Capacity: ${res.capacityCurrent} / ${res.capacityMax} beds/staff</div>

          <div class="p-2 rounded space-y-1" style="background: var(--app-bg-2); border: 1px solid var(--line)">
            <div class="text-[10px]" style="color: var(--ink-3)">Services & Supplies:</div>
            <div class="text-[11px]" style="color: var(--ink)">${servicesList}</div>
          </div>

          <div class="pt-1 flex items-center justify-between text-[11px] font-mono text-sky-500">
            <span>📞 ${res.contact}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectResource) onSelectResource(res);
      });

      markersRef.current[`res-${res.id}`] = marker;
    });

    // 3. Plot Deployed Responders
    if (showResponders) {
      responders.forEach(resp => {
        const isOnScene = resp.status === 'ON SCENE';
        const isEnRoute = resp.status === 'EN ROUTE';
        const badgeColor = isOnScene ? 'bg-emerald-500 text-white' : isEnRoute ? 'bg-sky-500 text-white' : 'bg-line-strong text-ink';
        const ring = isOnScene ? 'ring-emerald-500/50' : isEnRoute ? 'ring-sky-500/50' : 'ring-slate-600/40';

        const iconHtml = `
          <div class="relative flex items-center justify-center w-7 h-7 cursor-pointer group">
            <div class="w-7 h-7 rounded-lg ${badgeColor} ring-2 ${ring} shadow-lg flex items-center justify-center font-bold text-[10px]">
              ${resp.unitType.includes('Air') ? '🚁' : resp.unitType.includes('Fire') ? '🚒' : resp.unitType.includes('Marine') ? '🚤' : '🚑'}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-responder-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const marker = L.marker(resp.location, { icon: customIcon }).addTo(map);

        const popupContent = `
          <div class="p-2 space-y-2 text-xs font-sans min-w-[220px] theme-popup">
            <div class="flex items-center justify-between pb-1" style="border-bottom: 1px solid var(--line)">
              <span class="font-mono font-bold text-sky-500">${resp.id}</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isOnScene ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' : 'bg-sky-500/20 text-sky-500 border border-sky-500/40'
              }">${resp.status}</span>
            </div>
            <div class="font-bold" style="color: var(--ink)">${resp.name}</div>
            <div class="text-[11px]" style="color: var(--ink-3)">${resp.unitType} • Lead: ${resp.leadOfficer}</div>
            <div class="p-1.5 rounded text-[10px] font-mono space-y-0.5" style="background: var(--app-bg-2); color: var(--ink-2)">
              <div>Radio: ${resp.radioChannel}</div>
              <div>Crew: ${resp.crewCount} personnel | Fuel: ${resp.fuelBattery}</div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectResponder) onSelectResponder(resp);
        });

        markersRef.current[`resp-${resp.id}`] = marker;
      });
    }

    // 4. Plot User GPS Beacon if triggered
    if (userBeacon) {
      const isCritical = userBeacon.status === 'CRITICAL';
      const userHtml = `
        <div class="relative flex items-center justify-center w-9 h-9">
          <span class="absolute w-14 h-14 rounded-full ${isCritical ? 'bg-rose-600' : 'bg-emerald-500'} opacity-60 animate-ping"></span>
          <div class="relative w-9 h-9 rounded-full ${isCritical ? 'bg-rose-600' : 'bg-emerald-600'} text-white ring-4 ${isCritical ? 'ring-rose-400' : 'ring-emerald-400'} shadow-2xl flex items-center justify-center font-bold text-sm">
            ${isCritical ? '🆘' : '📍'}
          </div>
        </div>
      `;

      const beaconIcon = L.divIcon({
        html: userHtml,
        className: 'user-beacon-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const userMarker = L.marker(userBeacon.coordinates, { icon: beaconIcon }).addTo(map);
      userMarker.bindPopup(`
        <div class="p-2 space-y-1 text-xs theme-popup">
          <div class="font-bold ${isCritical ? 'text-rose-400' : 'text-emerald-500'}">CITIZEN STATUS PING</div>
          <div style="color: var(--ink)">Status: <strong>${userBeacon.status}</strong></div>
          <div class="text-[10px]" style="color: var(--ink-3)">Synced via Supabase user_status table</div>
        </div>
      `).openPopup();

      markersRef.current['user-beacon'] = userMarker;
    }
  }, [
    incidents, 
    responders, 
    resources, 
    userBeacon, 
    showIncidents, 
    showResponders, 
    showShelters, 
    showMedical, 
    showVolunteers, 
    severityFilter, 
    onSelectIncident, 
    onSelectResponder,
    onSelectResource
  ]);

  // Handle fly-to when focused
  useEffect(() => {
    if (!focusedItem || !mapInstanceRef.current) return;
    const coords = focusedItem.location || focusedItem.coordinates;
    if (coords && Array.isArray(coords)) {
      mapInstanceRef.current.flyTo(coords, 15, {
        animate: true,
        duration: 1.2
      });

      const key = focusedItem.id ? (
        focusedItem.id.startsWith('INC') ? `inc-${focusedItem.id}` :
        focusedItem.id.startsWith('RES') ? `res-${focusedItem.id}` :
        `resp-${focusedItem.id}`
      ) : null;

      if (key && markersRef.current[key]) {
        markersRef.current[key].openPopup();
      }
    }
  }, [focusedItem]);

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(REGION.center, REGION.defaultZoom, { duration: 1 });
    }
  };

  const totalShelters = resources.filter(r => r.type === 'shelter').length;
  const totalMedical = resources.filter(r => r.type === 'medical_center').length;
  const totalVolunteers = resources.filter(r => r.type === 'volunteer_hub').length;

  return (
    <div className="relative w-full h-[460px] lg:h-[560px] rounded-2xl overflow-hidden border border-line bg-app-2 shadow-2xl">
      
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Overlay Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-app/95 backdrop-blur-md border border-line shadow-xl pointer-events-auto text-xs font-mono">
          
          {/* Incidents Toggle */}
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              showIncidents ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 font-bold' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Incidents ({incidents.length})</span>
          </button>

          {/* Shelters Toggle */}
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              showShelters ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 font-bold' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shelters ({totalShelters})</span>
          </button>

          {/* Medical Centers Toggle */}
          <button
            onClick={() => setShowMedical(!showMedical)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              showMedical ? 'bg-rose-600/20 text-rose-600 dark:text-rose-300 border border-rose-600/40 font-bold' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Medical ({totalMedical})</span>
          </button>

          {/* Volunteer Hubs Toggle */}
          <button
            onClick={() => setShowVolunteers(!showVolunteers)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              showVolunteers ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 font-bold' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Volunteers ({totalVolunteers})</span>
          </button>

          {/* Responders Toggle */}
          <button
            onClick={() => setShowResponders(!showResponders)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              showResponders ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/40 font-bold' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>Units ({responders.length})</span>
          </button>
        </div>

        {/* Tile Style & Reset Center Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Map Tile Style Switch (Dark Matter vs OpenStreetMap Standard) */}
          <button
            onClick={() => setTileStyle(tileStyle === 'dark' ? 'osm' : 'dark')}
            title={`Switch to ${tileStyle === 'dark' ? 'OpenStreetMap Standard' : 'Esri Dark Gray Canvas'} view`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-elevated/90 text-ink-2 border border-line-strong hover:text-ink text-xs font-mono transition-all shadow-lg"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{tileStyle === 'dark' ? 'Dark View' : 'OSM Standard'}</span>
          </button>

          <button
            onClick={handleResetCenter}
            title="Reset to Command Center"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-elevated/90 text-ink-2 border border-line-strong hover:border-sky-500/60 hover:text-ink text-xs font-mono transition-all shadow-lg"
          >
            <Crosshair className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Recenter</span>
          </button>
        </div>

      </div>

      {/* Bottom Floating Telemetry Bar */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-app/95 backdrop-blur-md border border-line text-[11px] font-mono text-ink-3 shadow-xl">
          <div className="flex items-center gap-1.5 text-ink-2">
            <Navigation className="w-3 h-3 text-emerald-400 rotate-45" />
            <span>GRID COORDS:</span>
            <span className="text-emerald-400 font-bold">{cursorCoords.lat.toFixed(4)}, {cursorCoords.lng.toFixed(4)}</span>
          </div>
          <span className="w-px h-3 bg-line-strong"></span>
          <span className="text-ink-3/80 hidden sm:inline">
            {tileStyle === 'dark' ? 'ESRI DARK GRAY TILES' : 'OPENSTREETMAP TILE LAYER'} • WGS84
          </span>
        </div>
      </div>

    </div>
  );
}
