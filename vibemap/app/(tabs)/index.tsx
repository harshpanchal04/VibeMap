import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../../src/features/store';
import { generateItinerary, resetTrip } from '../../src/features/chat/tripSlice';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import { theme, glassStyles } from '../../src/theme';

const TRENDING_VIBES = [
    '☕ Late Night Brew',
    '🍜 Spicy Street Food',
    '💻 Quiet Work Spot',
    '🍸 Rooftop Views',
    '🎨 Art Gallery Hopping',
    '🧘 Peaceful Park Walk'
];

export default function ChatScreen() {
    const [prompt, setPrompt] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { status, error, itinerary } = useSelector((state: RootState) => state.trip);

    useEffect(() => {
        if (status === 'success' && itinerary) {
            router.push(`/map/${itinerary._id}`);
        }
    }, [status, itinerary, router]);

    const handleSubmit = () => {
        if (prompt.trim()) {
            dispatch(generateItinerary(prompt));
        }
    };

    const handleChipPress = (vibe: string) => {
        setPrompt(vibe);
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Text style={styles.brandTitle}>VIBEMAP</Text>
                    <Text style={styles.title}>What's the vibe today?</Text>

                    <TextInput
                        style={styles.glassInput}
                        placeholder="e.g., Moody jazz bar for a rainy night..."
                        placeholderTextColor="#6B7280"
                        value={prompt}
                        onChangeText={setPrompt}
                        multiline
                        numberOfLines={3}
                        selectionColor={theme.colors.accent}
                    />

                    {/* Trending Vibes Chips */}
                    <View style={styles.chipsContainer}>
                        <Text style={styles.chipsLabel}>Trending Vibes</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.chipsScrollContent}
                        >
                            {TRENDING_VIBES.map((vibe, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.chip}
                                    onPress={() => handleChipPress(vibe)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.chipText}>{vibe}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {error && (
                        <Text style={styles.errorText}>Error: {error}</Text>
                    )}

                    <TouchableOpacity
                        style={[styles.button, status === 'loading' && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={status === 'loading'}
                        activeOpacity={0.8}
                    >
                        {status === 'loading' ? (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator color="#ffffff" style={{ marginRight: 10 }} />
                                <Text style={styles.buttonText}>Waking up AI...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>GENERATE ITINERARY</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: theme.colors.accent,
        marginBottom: 10,
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 30,
        textAlign: 'center',
        textShadowColor: theme.colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    glassInput: {
        ...glassStyles(),
        width: '100%',
        color: '#ffffff',
        padding: 20,
        borderRadius: 16,
        fontSize: 16,
        marginBottom: 30,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    button: {
        width: '100%',
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    errorText: {
        color: theme.colors.error,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    // Chips Styling
    chipsContainer: {
        width: '100%',
        marginBottom: 30,
    },
    chipsLabel: {
        color: theme.colors.textDim,
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chipsScrollContent: {
        paddingRight: 20,
    },
    chip: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    chipText: {
        color: '#e2e8f0',
        fontSize: 14,
        fontWeight: '500',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
