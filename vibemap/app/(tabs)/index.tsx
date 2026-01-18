import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../../src/features/store';
import { generateItinerary, resetTrip } from '../../src/features/chat/tripSlice';
import ScreenWrapper from '../../src/components/ScreenWrapper';

export default function ChatScreen() {
    const [prompt, setPrompt] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { status, error } = useSelector((state: RootState) => state.trip);

    useEffect(() => {
        if (status === 'success') {
            router.push('/map/1');
            // Optional: reset trip status here if you want to allow back navigation without auto-forwarding
            // dispatch(resetTrip()); 
        }
    }, [status, router]);

    const handleSubmit = () => {
        if (prompt.trim()) {
            dispatch(generateItinerary(prompt));
        }
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

                    {error && (
                        <Text style={styles.errorText}>Error: {error}</Text>
                    )}

                    <TouchableOpacity
                        style={[styles.button, status === 'loading' && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <ActivityIndicator color="#ffffff" />
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
    }
});
