import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DestinationMap = ({ destination, height = '400px' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Helper function to get coordinates based on region
  const getCoordinatesForRegion = (region, name) => {
    // Default coordinates for different regions in Egypt
    const regionCoordinates = {
      'Giza': { lat: 29.9773, lng: 31.1325 },
      'Cairo': { lat: 30.0444, lng: 31.2357 },
      'Luxor': { lat: 25.6872, lng: 32.6396 },
      'Aswan': { lat: 24.0889, lng: 32.8998 },
      'Alexandria': { lat: 31.2001, lng: 29.9187 },
      'Sinai Peninsula': { lat: 29.5, lng: 34.0 },
      'Red Sea': { lat: 27.2578, lng: 33.8117 },
      'Western Desert': { lat: 25.0, lng: 26.0 },
      'Siwa': { lat: 29.2032, lng: 25.5196 },
      'Faiyum': { lat: 29.3084, lng: 30.8428 },
      'Dahshur': { lat: 29.7908, lng: 31.2220 },
      'Saqqara': { lat: 29.8713, lng: 31.2156 },
      'Abydos': { lat: 26.1856, lng: 31.9194 },
      'Dendera': { lat: 26.1420, lng: 32.6558 },
      'Kom Ombo': { lat: 24.4521, lng: 32.9283 },
      'Edfu': { lat: 24.9781, lng: 32.8731 },
      'Esna': { lat: 25.2934, lng: 32.5548 },
      'Eastern Desert': { lat: 26.0, lng: 34.0 }
    };

    // Specific coordinates for famous destinations
    const specificCoordinates = {
      'Pyramids of Giza': { lat: 29.9792, lng: 31.1342 },
      'Great Pyramid of Giza': { lat: 29.9792, lng: 31.1342 },
      'Sphinx': { lat: 29.9753, lng: 31.1376 },
      'Karnak Temple': { lat: 25.7188, lng: 32.6573 },
      'Luxor Temple': { lat: 25.6995, lng: 32.6391 },
      'Valley of the Kings': { lat: 25.7402, lng: 32.6014 },
      'Abu Simbel': { lat: 22.3372, lng: 31.6258 },
      'Philae Temple': { lat: 24.0267, lng: 32.8848 },
      'Temple of Hatshepsut': { lat: 25.7380, lng: 32.6065 },
      'Saqqara': { lat: 29.8713, lng: 31.2156 },
      'Red Sea Coast': { lat: 27.2578, lng: 33.8117 },
      'Siwa Oasis': { lat: 29.2032, lng: 25.5196 }
    };

    // Check for specific destination first
    if (name && specificCoordinates[name]) {
      return specificCoordinates[name];
    }

    // Return coordinates for the region or default to Cairo if region not found
    return regionCoordinates[region] || { lat: 30.0444, lng: 31.2357 };
  };

  useEffect(() => {
    if (!destination || !mapRef.current) return;

    // Get coordinates for the destination
    const coordinates = getCoordinatesForRegion(destination.region, destination.name);

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Add marker for the destination
      const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(mapInstanceRef.current);
      
      // Add popup with destination info
      marker.bindPopup(`
        <div style="text-align: center; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 16px;">${destination.name}</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${destination.region}, Egypt</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}"
             target="_blank"
             style="color: #2563eb; text-decoration: none; font-size: 12px; font-weight: 500;">
            📍 Get Directions on Google Maps
          </a>
        </div>
      `).openPopup();
    } else {
      // Update existing map
      mapInstanceRef.current.setView([coordinates.lat, coordinates.lng], 13);
      
      // Clear existing markers and add new one
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(mapInstanceRef.current);
      marker.bindPopup(`
        <div style="text-align: center; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 16px;">${destination.name}</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${destination.region}, Egypt</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}"
             target="_blank"
             style="color: #2563eb; text-decoration: none; font-size: 12px; font-weight: 500;">
            📍 Get Directions on Google Maps
          </a>
        </div>
      `).openPopup();
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-200 shadow-sm"
    />
  );
};

export default DestinationMap;
