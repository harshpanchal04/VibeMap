import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RootState, AppDispatch } from '../../src/features/store';
import { useMapBridge } from '../../src/features/map/useMapBridge';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import { processPayment } from '../../src/features/payment/stripe';
import { VibeCard } from '../../src/components/VibeCard';
import { setTrip, fetchUserHistory } from '../../src/features/chat/tripSlice';
import { theme } from '../../src/theme';

const { height } = Dimensions.get('window');

export default function MapScreen() {
    const { id: idParam } = useLocalSearchParams();
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const { itinerary, history, status } = useSelector((state: RootState) => state.trip);
    const dispatch = useDispatch<AppDispatch>();

    // Restored hooks
    const { webviewRef, zoomToLocation, updateMarkers } = useMapBridge();
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const router = useRouter();

    const handleWebViewLoad = () => {
        if (itinerary?.stops) {
            // Inject the markers data into the map
            const stopsJson = JSON.stringify(itinerary.stops);
            updateMarkers(stopsJson);
        }
    };

    const handleStopPress = (lat: number, lng: number) => {
        zoomToLocation(lat, lng);
    };

    const handleUnlock = async () => {
        setIsProcessingPayment(true);
        try {
            const success = await processPayment();
            if (success) {
                setIsUnlocked(true);
            }
        } catch (error) {
            console.error('Payment failed', error);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Effect to set the correct itinerary if we navigated from history
    useEffect(() => {
        if (!id) return;

        // If we already have the correct itinerary loaded, do nothing
        if (itinerary && itinerary._id === id) return;

        // Try to find in history
        const foundTrip = history.find(t => t._id === id);
        if (foundTrip) {
            dispatch(setTrip(foundTrip));
        } else if (history.length === 0 && status !== 'loading') {
            // If history is empty and we haven't found it, fetch history
            dispatch(fetchUserHistory());
        }
    }, [id, itinerary, history, status, dispatch]);

    // Loading State
    const foundInHistory = history.find(t => t._id === id);
    const isSwitchingTrip = foundInHistory && (!itinerary || itinerary._id !== id);
    const isFetchingHistory = history.length === 0 && !itinerary && status !== 'failed';

    const isLoading = status === 'loading' || isSwitchingTrip || isFetchingHistory;

    if (isLoading) {
        return (
            <ScreenWrapper>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>
                        {isSwitchingTrip ? "Preparing map..." : "Loading history..."}
                    </Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }

    // Not Found State
    if (!itinerary || itinerary._id !== id) {
        return (
            <ScreenWrapper>
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: theme.colors.error }]}>Trip not found.</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        )
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Map WebView - Full Screen */}
                <View style={styles.mapContainer}>
                    <WebView
                        ref={webviewRef}
                        source={require('../../src/assets/map.html')}
                        style={styles.webview}
                        onLoadEnd={handleWebViewLoad}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        onError={(e) => console.error("WebView Error:", e.nativeEvent)}
                    />
                </View>

                {/* Stop Cards Carousel - Absolute Bottom Overlay */}
                <View style={styles.carouselOverlay}>
                    <View style={styles.carouselHeader}>
                        <Text style={styles.carouselTitle}>{itinerary?.itinerary_title || "Your Itinerary"}</Text>
                        <Text style={styles.carouselSubtitle}>{itinerary?.vibe_summary || "Explore the city based on your vibe."}</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        style={styles.scrollView}
                        snapToInterval={Dimensions.get('window').width * 0.85 + 15} // Card width + margin
                        decelerationRate="fast"
                    >
                        {itinerary?.stops.map((stop) => (
                            <VibeCard
                                key={stop.id}
                                stop={stop}
                                onPress={() => handleStopPress(stop.coordinates.lat, stop.coordinates.lng)}
                                onUnlock={handleUnlock}
                                isUnlocked={isUnlocked}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Overlay Loading for Payment */}
                {isProcessingPayment && (
                    <View style={styles.paymentOverlay}>
                        <ActivityIndicator size="large" color={theme.colors.success} />
                        <Text style={styles.paymentText}>Confirming Payment...</Text>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
    },
    // Map takes Full Height
    mapContainer: {
        ...StyleSheet.absoluteFillObject, // Fill screen
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        opacity: 0.95,
    },
    // Carousel positioned absolutely at bottom
    carouselOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%', // Adjust height as needed
        justifyContent: 'flex-end',
        paddingBottom: 20,
        // Optional: Gradient or fade can be added here if needed, 
        // but current instructions just say VibeCards have their own glass styles.
        // We'll leave the container transparent to let map show through between cards?
        // User said "Cards are positioned absolutely at the bottom".
        // Let's add a gradient or just transparent? Transparent is riskier for text readability of header.
        // Let's add a very subtle bottom fade or just let it float.
        // Given "Cyberpunk", floating over map is cool.
    },
    carouselHeader: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        // Add text shadow for readability over map
    },
    carouselTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    carouselSubtitle: {
        fontSize: 12,
        color: '#e2e8f0', // lighter slate
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        marginBottom: 5,
    },
    scrollView: {
        flexGrow: 0, // Don't take up all space
    },
    scrollContent: {
        paddingHorizontal: 15,
        alignItems: 'center',
        paddingBottom: 20,
    },
    paymentOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    paymentText: {
        color: theme.colors.success,
        marginTop: 15,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
