import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different days
const createCustomIcon = (dayNumber, color = '#D4AF37') => {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}, #B8860B);
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">${dayNumber}</div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const ItineraryMap = ({ days, selectedDay = null, height = '500px', onDestinationClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routingControlsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // Helper function to get coordinates for destinations
  const getCoordinatesForDestination = (destinationName, region) => {
    // Comprehensive coordinates mapping for Egyptian destinations
    const destinationCoordinates = {
      // Giza & Cairo
      'Pyramids of Giza': { lat: 29.9773, lng: 31.1325 },
      'Sphinx of Giza': { lat: 29.9753, lng: 31.1376 },
      'Egyptian Museum': { lat: 30.0478, lng: 31.2336 },
      'Grand Egyptian Museum': { lat: 29.9936, lng: 31.1173 },
      'Khan El Khalili Bazaar': { lat: 30.0472, lng: 31.2629 },
      'Al-Azhar Mosque': { lat: 30.0458, lng: 31.2629 },
      'Citadel of Saladin': { lat: 30.0287, lng: 31.2602 },
      'Mosque of Muhammad Ali': { lat: 30.0287, lng: 31.2602 },
      'Coptic Cairo': { lat: 30.0051, lng: 31.2306 },
      'Cairo Tower': { lat: 30.0459, lng: 31.2243 },
      'Al-Azhar Park': { lat: 30.0414, lng: 31.2629 },
      'Zamalek Island': { lat: 30.0626, lng: 31.2197 },
      'Manial Palace': { lat: 30.0206, lng: 31.2289 },
      
      // Saqqara & Dahshur
      'Saqqara Step Pyramid': { lat: 29.8713, lng: 31.2156 },
      'Serapeum of Saqqara': { lat: 29.8713, lng: 31.2156 },
      'Dahshur Pyramids': { lat: 29.7908, lng: 31.2220 },
      'Meidum Pyramid': { lat: 29.3881, lng: 31.1575 },
      
      // Luxor
      'Luxor Temple': { lat: 25.6995, lng: 32.6391 },
      'Karnak Temple': { lat: 25.7188, lng: 32.6573 },
      'Valley of the Kings': { lat: 25.7402, lng: 32.6014 },
      'Valley of the Queens': { lat: 25.7284, lng: 32.5918 },
      'Temple of Hatshepsut': { lat: 25.7379, lng: 32.6065 },
      'Medinet Habu': { lat: 25.7200, lng: 32.6006 },
      'Ramesseum': { lat: 25.7286, lng: 32.6106 },
      'Luxor Museum': { lat: 25.6872, lng: 32.6396 },
      
      // Aswan
      'Abu Simbel': { lat: 22.3372, lng: 31.6258 },
      'Philae Temple': { lat: 24.0267, lng: 32.8848 },
      'Aswan High Dam': { lat: 23.9707, lng: 32.8770 },
      'Nubian Village': { lat: 24.0889, lng: 32.8998 },
      'Elephantine Island': { lat: 24.0889, lng: 32.8889 },
      'Kitchener\'s Island': { lat: 24.0889, lng: 32.8889 },
      'Tombs of the Nobles': { lat: 24.0889, lng: 32.8998 },
      'Nubian Museum': { lat: 24.0889, lng: 32.8998 },
      
      // Red Sea
      'Sharm El Sheikh': { lat: 27.9158, lng: 34.3300 },
      'Dahab': { lat: 28.4951, lng: 34.5136 },
      'Hurghada': { lat: 27.2578, lng: 33.8117 },
      'Marsa Alam': { lat: 25.0657, lng: 34.8943 },
      'El Gouna': { lat: 27.3951, lng: 33.6801 },
      'Ras Mohammed National Park': { lat: 27.7312, lng: 34.2417 },
      'Blue Hole Dahab': { lat: 28.5951, lng: 34.5236 },
      'Makadi Bay': { lat: 26.9900, lng: 33.8900 },
      'Soma Bay': { lat: 26.8000, lng: 33.9500 },
      
      // Alexandria
      'Library of Alexandria': { lat: 31.2084, lng: 29.9097 },
      'Citadel of Qaitbay': { lat: 31.2139, lng: 29.8850 },
      'Pompey\'s Pillar': { lat: 31.1816, lng: 29.8951 },
      'Catacombs of Kom el Shoqafa': { lat: 31.1781, lng: 29.8926 },
      'Montaza Palace': { lat: 31.2895, lng: 30.0178 },
      'Alexandria Corniche': { lat: 31.2001, lng: 29.9187 },
      
      // Sinai
      'Mount Sinai': { lat: 28.5362, lng: 33.9753 },
      'Monastery of Saint Catherine': { lat: 28.5562, lng: 33.9753 },
      'Colored Canyon': { lat: 29.0000, lng: 34.7000 },
      'Nuweiba': { lat: 29.0324, lng: 34.6691 },
      'Taba': { lat: 29.4969, lng: 34.8878 },
      
      // Western Desert & Oases
      'Siwa Oasis': { lat: 29.2032, lng: 25.5196 },
      'White Desert National Park': { lat: 27.0000, lng: 28.0000 },
      'Black Desert': { lat: 27.8333, lng: 28.3333 },
      'Bahariya Oasis': { lat: 28.3489, lng: 28.8647 },
      'Farafra Oasis': { lat: 27.0578, lng: 27.9706 },
      'Dakhla Oasis': { lat: 25.4892, lng: 29.0328 },
      'Kharga Oasis': { lat: 25.4519, lng: 30.5414 },
      'Crystal Mountain': { lat: 27.1333, lng: 28.4167 },
      
      // Fayoum
      'Wadi El Rayan': { lat: 29.2167, lng: 30.4000 },
      'Wadi El Hitan': { lat: 29.2833, lng: 30.0500 },
      'Fayoum Oasis': { lat: 29.3084, lng: 30.8428 },
      'Qasr Qarun': { lat: 29.5167, lng: 30.6333 },
      
      // Other temples and sites
      'Edfu Temple': { lat: 24.9784, lng: 32.8734 },
      'Kom Ombo Temple': { lat: 24.4539, lng: 32.9320 },
      'Dendera Temple Complex': { lat: 26.1419, lng: 32.6703 },
      'Temple of Seti I': { lat: 26.1856, lng: 31.9194 },
      'Temple of Esna': { lat: 25.2919, lng: 32.5519 }
    };

    // Try exact match first
    if (destinationCoordinates[destinationName]) {
      return destinationCoordinates[destinationName];
    }

    // Try partial match
    const partialMatch = Object.keys(destinationCoordinates).find(key => 
      key.toLowerCase().includes(destinationName.toLowerCase()) ||
      destinationName.toLowerCase().includes(key.toLowerCase())
    );
    
    if (partialMatch) {
      return destinationCoordinates[partialMatch];
    }

    // Default coordinates based on region
    const regionDefaults = {
      'Cairo': { lat: 30.0444, lng: 31.2357 },
      'Giza': { lat: 29.9773, lng: 31.1325 },
      'Luxor': { lat: 25.6872, lng: 32.6396 },
      'Aswan': { lat: 24.0889, lng: 32.8998 },
      'Alexandria': { lat: 31.2001, lng: 29.9187 },
      'Red Sea': { lat: 27.2578, lng: 33.8117 },
      'Sinai': { lat: 28.5362, lng: 33.9753 },
      'Western Desert': { lat: 27.0000, lng: 28.0000 },
      'Fayoum': { lat: 29.3084, lng: 30.8428 }
    };

    return regionDefaults[region] || { lat: 26.8206, lng: 30.8025 }; // Center of Egypt
  };

  // Clear existing markers and routes
  const clearMap = () => {
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    routingControlsRef.current.forEach(control => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeControl(control);
      }
    });
    routingControlsRef.current = [];
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);
      
      // Create map instance
      const map = L.map(mapRef.current, {
        center: [26.8206, 30.8025], // Center of Egypt
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsLoading(false);
      setMapError(null);

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to load map');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map with itinerary data
  useEffect(() => {
    if (!mapInstanceRef.current || !days) return;

    clearMap();

    try {
      const allDestinations = [];
      const dayColors = [
        '#D4AF37', // Gold
        '#1E40AF', // Blue
        '#DC2626', // Red
        '#059669', // Green
        '#7C3AED', // Purple
        '#EA580C', // Orange
        '#DB2777', // Pink
        '#0891B2'  // Cyan
      ];

      // Process each day
      Object.entries(days).forEach(([dayId, activities], dayIndex) => {
        if (!activities || activities.length === 0) return;

        const dayNumber = parseInt(dayId.split('-')[1]);
        const dayColor = dayColors[dayIndex % dayColors.length];
        const dayDestinations = [];

        // Add markers for each destination in the day
        activities.forEach((activity, activityIndex) => {
          if (!activity.location) return;

          const coords = getCoordinatesForDestination(activity.location, activity.region || '');
          if (!coords) return;

          const marker = L.marker([coords.lat, coords.lng], {
            icon: createCustomIcon(dayNumber, dayColor)
          }).addTo(mapInstanceRef.current);

          // Create popup content
          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: ${dayColor}; font-size: 16px; font-weight: bold;">
                Day ${dayNumber}: ${activity.title}
              </h3>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                ${activity.time || 'Time not set'} • ${activity.location}
              </p>
              <p style="margin: 0; color: #374151; font-size: 13px;">
                ${activity.description || 'No description available'}
              </p>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Add click handler
          if (onDestinationClick) {
            marker.on('click', () => {
              onDestinationClick(activity, dayId);
            });
          }

          markersRef.current.push(marker);
          dayDestinations.push([coords.lat, coords.lng]);
          allDestinations.push([coords.lat, coords.lng]);
        });

        // Add routing between destinations in the same day (if more than 1)
        if (dayDestinations.length > 1) {
          const routingControl = L.Routing.control({
            waypoints: dayDestinations.map(coord => L.latLng(coord[0], coord[1])),
            routeWhileDragging: false,
            addWaypoints: false,
            createMarker: () => null, // Don't create default markers
            lineOptions: {
              styles: [{ 
                color: dayColor, 
                weight: 4, 
                opacity: 0.8,
                dashArray: selectedDay && selectedDay !== dayId ? '10, 10' : null
              }]
            },
            show: false, // Hide the instruction panel
            collapsible: false
          }).addTo(mapInstanceRef.current);

          routingControlsRef.current.push(routingControl);
        }
      });

      // Fit map to show all destinations
      if (allDestinations.length > 0) {
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }

    } catch (error) {
      console.error('Error updating map:', error);
      setMapError('Failed to update map with itinerary data');
    }
  }, [days, selectedDay, onDestinationClick]);

  if (mapError) {
    return (
      <div 
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">{mapError}</p>
          <p className="text-gray-500 text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          style={{ height }}
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pharaoh-gold border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200 shadow-md"
      />
    </div>
  );
};

export default ItineraryMap;
