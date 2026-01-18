import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../../src/features/store';
import { generateItinerary, resetTrip } from '../../src/features/chat/tripSlice';
import ScreenWrapper from '../../src/components/ScreenWrapper';

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
            // Navigate to the map screen with the generated trip's ID
            router.push(`/map/${itinerary._id}`);
        }
    }, [status, itinerary, router]);

    const handleSubmit = () => {
        if (prompt.trim()) {
            dispatch(generateItinerary(prompt));
        }
    };

    const handleChipPress = (vibe: string) => {
        // Remove emoji for cleaner prompt if desired, or keep it.
        // Keeping it adds character.
        setPrompt(vibe);
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>What's the vibe today?</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Moody jazz bar for a rainy night..."
                        placeholderTextColor="#94a3b8"
                        value={prompt}
                        onChangeText={setPrompt}
                        multiline
                        numberOfLines={3}
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
                    >
                        {status === 'loading' ? (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator color="#ffffff" style={{ marginRight: 10 }} />
                                <Text style={styles.buttonText}>Waking up AI...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>Generate Itinerary</Text>
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
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#1e293b', // slate-800
        color: '#ffffff',
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155', // slate-700
        marginBottom: 20,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    button: {
        width: '100%',
        backgroundColor: '#3b82f6', // blue-500
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#ef4444', // red-500
        marginBottom: 15,
    },
    // Chips Styling
    chipsContainer: {
        width: '100%',
        marginBottom: 25,
    },
    chipsLabel: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chipsScrollContent: {
        paddingRight: 20,
    },
    chip: {
        backgroundColor: '#334155', // slate-700
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#475569',
    },
    chipText: {
        color: '#e2e8f0', // slate-200
        fontSize: 14,
        fontWeight: '500',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
