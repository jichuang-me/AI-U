import React, { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../services/mapService';

const MapContainer = ({ center = { lat: 35.0116, lng: 135.7681 }, markers = [] }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps();
        if (mapRef.current) {
          googleMapRef.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 13,
            mapId: 'DEMO_MAP_ID', // Required for advanced markers
            disableDefaultUI: true,
            styles: [
              {
                "elementType": "geometry",
                "stylers": [{ "color": "#212121" }]
              },
              {
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#757575" }]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#212121" }]
              },
              // ... more dark styles could be added here
            ]
          });
        }
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
      }
    };

    initMap();
  }, []);

  // Update center when prop changes
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.panTo(center);
    }
  }, [center]);

  return (
    <div ref={mapRef} style={{
      width: '100%',
      height: '100%',
      background: '#0c0c0e',
    }} />
  );
};

export default MapContainer;
