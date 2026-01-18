import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Defining the Trip interface locally to avoid circular dependencies or breaking existing types immediately,
// though ideally this should be in src/types.
interface Trip {
    _id: string;
    itinerary_title?: string; // Matching the existing Itinerary type
    trip_title?: string;      // Matching the prompt request, checking both
    vibe_summary?: string;     // Matching Itinerary
    createdAt: string;
}

interface TripHistoryCardProps {
    trip: Trip;
}

export const TripHistoryCard: React.FC<TripHistoryCardProps> = ({ trip }) => {
    const router = useRouter();
    const title = trip.trip_title || trip.itinerary_title || 'Untitled Vibe';

    // Format date similar to "Jan 18, 2024"
    const date = new Date(trip.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const handlePress = () => {
        router.push(`/map/${trip._id}`);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            style={styles.cardContainer}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.dateText}>{date}</Text>
                    <Ionicons name="time-outline" size={14} color="#94a3b8" />
                </View>

                <Text style={styles.titleText} numberOfLines={2}>
                    {title}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.replayButton}>
                        <Text style={styles.replayText}>REPLAY VIBE</Text>
                        <Ionicons name="arrow-forward" size={14} color={theme.colors.background} style={{ marginLeft: 4 }} />
                    </View>
                </View>
            </View>

            {/* Decoration similar to VibeCard */}
            <View style={styles.neonLine} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        overflow: 'hidden',
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dateText: {
        color: '#94a3b8', // Slate 400
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    titleText: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    replayButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    replayText: {
        color: theme.colors.background,
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    neonLine: {
        height: 3,
        width: '100%',
        backgroundColor: theme.colors.accent, // Purple accent for history
    },
});
