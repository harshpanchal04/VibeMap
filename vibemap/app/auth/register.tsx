import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    TextInputProps,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../src/features/store';
import { register, clearError } from '../../src/features/auth/authSlice';
import { theme, glassStyles } from '../../src/theme';

// Glass Input Component
interface GlassInputProps extends TextInputProps {
    label?: string;
}

const GlassInput: React.FC<GlassInputProps> = ({ label, style, ...props }) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
            style={[styles.glassInput, style]}
            placeholderTextColor="#6B7280"
            selectionColor={theme.colors.accent}
            {...props}
        />
    </View>
);

// Neon Button Component
interface NeonButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ title, onPress, variant = 'primary', isLoading }) => {
    const isPrimary = variant === 'primary';
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading}
            activeOpacity={0.8}
            style={[
                styles.button,
                isPrimary ? styles.primaryButton : styles.secondaryButton,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary ? '#FFF' : theme.colors.primary} />
            ) : (
                <Text style={[styles.buttonText, isPrimary ? { color: '#FFF' } : { color: theme.colors.textDim }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (error) {
            Alert.alert('Registration Failed', error);
            dispatch(clearError());
        }
        if (user) {
            router.replace('/(tabs)');
        }
    }, [error, user, dispatch, router]);

    const handleRegister = () => {
        dispatch(register({ name, email, password }));
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.brandTitle}>VIBEMAP</Text>
                        <Text style={styles.title}>Join VibeMap</Text>
                        <Text style={styles.subtitle}>Create your account and start exploring.</Text>
                    </View>

                    <View style={styles.form}>
                        <GlassInput
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChangeText={setName}
                        />

                        <GlassInput
                            label="Email"
                            placeholder="user@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <GlassInput
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />

                        <View style={styles.buttonContainer}>
                            <NeonButton
                                title="REGISTER"
                                onPress={handleRegister}
                                isLoading={status === 'loading'}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Link href="/auth/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.linkText}>Login</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 24,
        width: '100%',
    },
    header: {
        marginBottom: 48,
        alignItems: 'flex-start',
    },
    brandTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: theme.colors.accent,
        marginBottom: 12,
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textDim,
    },
    form: {
        width: '100%',
    },
    // Glass Input Styles
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: theme.colors.textDim,
        marginBottom: 8,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    glassInput: {
        ...glassStyles(),
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        color: '#FFFFFF',
    },
    // Button Styles
    buttonContainer: {
        marginTop: 12,
        marginBottom: 24,
    },
    button: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 8,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.textDim,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
    },
    footerText: {
        color: theme.colors.textDim,
        fontSize: 14,
    },
    linkText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
