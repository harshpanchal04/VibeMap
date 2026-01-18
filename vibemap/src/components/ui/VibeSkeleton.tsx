import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme';

export const VibeSkeleton = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, [opacity]);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.content}>
                {/* Header Skeleton */}
                <View style={styles.header}>
                    <Animated.View style={[styles.skeletonText, styles.dateSkeleton, { opacity }]} />
                </View>

                {/* Title Skeleton lines */}
                <Animated.View style={[styles.skeletonText, styles.titleSkeleton, { opacity }]} />
                <Animated.View style={[styles.skeletonText, styles.titleSkeletonShort, { opacity }]} />

                {/* Footer Skeleton */}
                <View style={styles.footer}>
                    <Animated.View style={[styles.buttonSkeleton, { opacity }]} />
                </View>
            </View>

            <View style={styles.neonLine} />
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
        overflow: 'hidden',
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    dateSkeleton: {
        width: 80,
        height: 12,
        borderRadius: 6,
    },
    titleSkeleton: {
        width: '90%',
        height: 20,
        borderRadius: 10,
        marginBottom: 8,
    },
    titleSkeletonShort: {
        width: '60%',
        height: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    skeletonText: {
        backgroundColor: '#334155', // slate-700
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonSkeleton: {
        width: 100,
        height: 32,
        borderRadius: 20,
        backgroundColor: '#334155',
    },
    neonLine: {
        height: 3,
        width: '100%',
        backgroundColor: '#334155', // Dimmer neon placeholder
    },
});
