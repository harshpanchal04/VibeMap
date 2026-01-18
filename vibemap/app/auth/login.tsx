import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../src/features/store';
import { login, clearError } from '../../src/features/auth/authSlice';
import { ScreenWrapper } from '../../src/components/ui/ScreenWrapper';
import { VibeInput } from '../../src/components/ui/VibeInput';
import { VibeButton } from '../../src/components/ui/VibeButton';
import { theme } from '../../src/theme';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (error) {
            Alert.alert('Login Failed', error);
            dispatch(clearError());
        }
        if (user) {
            router.replace('/(tabs)');
        }
    }, [error, user, dispatch, router]);

    const handleLogin = () => {
        dispatch(login({ email, password }));
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <Text style={styles.brandTitle}>VibeMap</Text>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue your vibe.</Text>
                </View>

                <View style={styles.form}>
                    <VibeInput
                        label="Email"
                        placeholder="user@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <VibeInput
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    <VibeButton
                        title="Login"
                        onPress={handleLogin}
                        isLoading={status === 'loading'}
                        style={styles.loginButton}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/auth/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'flex-start',
    },
    brandTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: theme.colors.accent,
        marginBottom: 16,
        textShadowColor: theme.colors.accent,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        letterSpacing: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#94a3b8', // Slate 400
    },
    form: {
        width: '100%',
    },
    loginButton: {
        marginTop: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    footerText: {
        color: '#94a3b8', // Slate 400
        fontSize: 16,
    },
    linkText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
