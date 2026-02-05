import { Loader } from '@googlemaps/js-api-loader';

// IMPORTANT: Replace with actual key or provided via config
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const loadGoogleMaps = async () => {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Google Maps API Key is missing. Map will not load.");
        return Promise.reject(new Error("API Key Missing"));
    }

    const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'marker']
    });

    return loader.load();
};

export const createAdvancedMarker = (map, position, title) => {
    if (!window.google) return null;

    const { AdvancedMarkerElement } = window.google.maps.marker;

    const marker = new AdvancedMarkerElement({
        map,
        position,
        title,
    });

    return marker;
};
