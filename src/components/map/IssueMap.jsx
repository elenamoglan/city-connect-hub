import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const statusColors = {
  OPEN: '#dc2626',
  IN_PROGRESS: '#d97706',
  RESOLVED: '#16a34a',
};

function createCustomIcon(status) {
  const color = statusColors[status];
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function IssueMap({
  issues,
  center = [40.7128, -74.006], // Default to NYC
  zoom = 12,
  onIssueClick,
  className = 'h-[500px]',
  interactive = true,
  onLocationSelect,
  selectedLocation,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const selectedMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (onLocationSelect) {
      map.on('click', (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, zoom, interactive, onLocationSelect]);

  // Update markers when issues change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    issues.forEach((issue) => {
      const marker = L.marker([issue.latitude, issue.longitude], {
        icon: createCustomIcon(issue.status),
      })
        .addTo(map)
        .bindPopup(`
          <div class="p-1">
            <h3 class="font-semibold text-sm mb-1">${issue.title}</h3>
            <p class="text-xs text-gray-600 line-clamp-2">${issue.description}</p>
          </div>
        `);

      if (onIssueClick) {
        marker.on('click', () => onIssueClick(issue));
      }

      markersRef.current.push(marker);
    });
  }, [issues, onIssueClick]);

  // Handle selected location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }

    if (selectedLocation) {
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: L.divIcon({
          className: 'selected-location-marker',
          html: `
            <div style="
              background-color: #2563eb;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 2px 12px rgba(37, 99, 235, 0.5);
              animation: pulse 2s infinite;
            "></div>
            <style>
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
              }
            </style>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      }).addTo(map);

      selectedMarkerRef.current = marker;
      map.setView([selectedLocation.lat, selectedLocation.lng], map.getZoom());
    }
  }, [selectedLocation]);

  return <div ref={mapRef} className={className} />;
}