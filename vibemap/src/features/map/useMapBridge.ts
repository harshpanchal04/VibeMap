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
            // Escape the JSON string properly for JavaScript injection
            const escapedJson = stopsJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            const script = `window.updateMarkers('${escapedJson}'); true;`;
            webviewRef.current.injectJavaScript(script);
        }
    };

    return {
        webviewRef,
        zoomToLocation,
        updateMarkers,
    };
};
