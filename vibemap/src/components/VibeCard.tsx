import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stop } from '../types';
import { theme } from '../theme';

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

            {/* Gradient Line Removed in favor of Outer Glow */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: width * 0.85,
        height: 220,
        backgroundColor: 'rgba(20, 20, 30, 0.85)', // High opacity dark
        borderRadius: 20,
        padding: 24,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)', // Top/Glass border effect
        // Purple Glow Effect
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 10,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        backgroundColor: theme.colors.accent, // Purple Badge
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    costText: {
        color: theme.colors.textDim,
        fontWeight: '700',
        fontSize: 14,
    },
    titleText: {
        color: '#ffffff',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
    },
    descriptionText: {
        color: '#cbd5e1',
        fontSize: 15,
        lineHeight: 22,
    },
    hiddenTip: {
        marginTop: 8,
        color: '#fbbf24', // Amber/Gold
        fontSize: 13,
        fontStyle: 'italic',
    },
    // Locked State Styles
    lockedState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    lockIconContainer: {
        marginBottom: 8,
    },
    lockedText: {
        color: '#cbd5e1',
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    unlockButton: {
        backgroundColor: theme.colors.success, // Cyan/Gold per instruction, using success (cyan) or gold. User said Cyan OR Gold. Let's stick to Gold for "Premium/Currency" feel typically, but instructions said "success (Cyan) or Gold". Let's use Gold/Amber to match lock icon for consistency.
        // Actually, user strict constraint: "Ensure the 'Unlock' button inside the card uses the theme.colors.success (Cyan) or Gold".
        // Let's use theme.colors.success (Cyan) for a Cyberpunk pop.
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 24,
        shadowColor: theme.colors.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    unlockButtonText: {
        color: '#000000',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
});