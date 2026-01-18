import { useRef } from 'react';
import WebView from 'react-native-webview';

export const useMapBridge = () => {
    const webviewRef = useRef<WebView>(null);

    const zoomToLocation = (lat: number, lng: number) => {
        if (webviewRef.current) {
            const script = `window.zoomToLocation(${lat}, ${lng}); true;`;
            webviewRef.current.injectJavaScript(script);
        }
    };

    const updateMarkers = (stopsJson: string) => {
        if (webviewRef.current) {
            try {
                // Safety Check: Parse and ensure coordinates are numbers
                const stops = JSON.parse(stopsJson);
                const safeStops = stops.map((stop: any) => ({
                    ...stop,
                    coordinates: {
                        lat: parseFloat(stop.coordinates.lat),
                        lng: parseFloat(stop.coordinates.lng)
                    }
                }));

                const safeJson = JSON.stringify(safeStops);

                // Escape the JSON string properly for JavaScript injection
                const escapedJson = safeJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                const script = `window.updateMarkers('${escapedJson}'); true;`;
                webviewRef.current.injectJavaScript(script);
            } catch (error) {
                console.error("Error processing map markers:", error);
            }
        }
    };

    return {
        webviewRef,
        zoomToLocation,
        updateMarkers,
    };
};
