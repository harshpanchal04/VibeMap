import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stop } from '../types';

const { width } = Dimensions.get('window');

interface VibeCardProps {
    stop: Stop;
    onPress: () => void;
    onUnlock?: () => void;
    isUnlocked?: boolean;
}

export const VibeCard = ({ stop, onPress, onUnlock, isUnlocked = false }: VibeCardProps) => {
    const isLocked = stop.is_premium && !isUnlocked;

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.cardContainer}>
            {/* Header Badge */}
            <View style={styles.headerRow}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{stop.category.toUpperCase()}</Text>
                </View>
                <Text style={styles.costText}>{stop.estimated_cost}</Text>
            </View>

            {/* Main Title */}
            <Text style={styles.titleText} numberOfLines={1}>{stop.name}</Text>

            {/* Content Area */}
            <View style={styles.contentArea}>
                {isLocked ? (
                    <View style={styles.lockedState}>
                        <View style={styles.lockIconContainer}>
                            <Ionicons name="lock-closed" size={20} color="#FFD700" />
                        </View>
                        <Text style={styles.lockedText}>Premium Vibe Locked</Text>
                        <TouchableOpacity style={styles.unlockButton} onPress={onUnlock}>
                            <Text style={styles.unlockButtonText}>UNLOCK VIBE</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.descriptionText} numberOfLines={3}>
                            {stop.vibe_match_reason}
                        </Text>
                        {stop.hidden_details && (
                            <Text style={styles.hiddenTip}>✨ Tip: {stop.hidden_details}</Text>
                        )}
                    </View>
                )}
            </View>

            {/* Neon Gradient Line Effect */}
            <View style={styles.neonLine} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: width * 0.85, // Carousel width
        height: 220, // Fixed height for consistency
        backgroundColor: '#1e293b', // Dark Slate
        borderRadius: 20,
        padding: 20,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10, // Android shadow
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryBadge: {
        backgroundColor: '#6366f1', // Indigo/Purple Neon
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    costText: {
        color: '#94a3b8',
        fontWeight: '700',
    },
    titleText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
    },
    descriptionText: {
        color: '#cbd5e1', // Slate-300
        fontSize: 14,
        lineHeight: 20,
    },
    hiddenTip: {
        marginTop: 8,
        color: '#fbbf24', // Amber/Gold
        fontSize: 12,
        fontStyle: 'italic',
    },
    // Locked State Styles
    lockedState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.5)', // Slightly darker overlay
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.2)', // Faint gold border
    },
    lockIconContainer: {
        marginBottom: 5,
    },
    lockedText: {
        color: '#cbd5e1',
        fontSize: 12,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    unlockButton: {
        backgroundColor: '#fbbf24', // Gold
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    unlockButtonText: {
        color: '#0f172a', // Dark text on gold
        fontWeight: 'bold',
        fontSize: 12,
    },
    neonLine: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        height: 4,
        backgroundColor: '#3b82f6', // Bright Blue
        borderRadius: 2,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
});