import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '../../src/features/store';
import { useMapBridge } from '../../src/features/map/useMapBridge';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import { processPayment } from '../../src/features/payment/stripe';
import { VibeCard } from '../../src/components/VibeCard';

const { height } = Dimensions.get('window');

export default function MapScreen() {
    const { itinerary } = useSelector((state: RootState) => state.trip);
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

    if (!itinerary) {
        return (
            <ScreenWrapper>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading itinerary...</Text>
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
                {/* Map WebView - Top 65% */}
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

                {/* Stop Cards Carousel - Bottom 35% */}
                <View style={styles.carouselContainer}>
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
                        <ActivityIndicator size="large" color="#fbbf24" />
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
        backgroundColor: '#334155',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
    },
    // Map takes 65% height
    mapContainer: {
        flex: 0.65,
        width: '100%',
        backgroundColor: '#000', // Preload bg
    },
    webview: {
        flex: 1,
        opacity: 0.95, // Slight dim for vibe
    },
    // Carousel takes 35% height
    carouselContainer: {
        flex: 0.35,
        backgroundColor: '#0f172a', // Slate-900
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    carouselHeader: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    carouselSubtitle: {
        fontSize: 12,
        color: '#94a3b8', // slate-400
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 15,
        alignItems: 'center', // Center cards vertically in the scroll view if needed
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
        color: '#fbbf24',
        marginTop: 15,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
