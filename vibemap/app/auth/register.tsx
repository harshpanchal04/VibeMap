import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../src/features/store';
import { register, clearError } from '../../src/features/auth/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

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
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-6"
            >
                <View className="mb-10">
                    <Text className="text-4xl font-bold text-cyan-400 mb-2">
                        Join VibeMap
                    </Text>
                    <Text className="text-slate-400 text-lg">
                        Create your account and start exploring.
                    </Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-cyan-200 mb-1 ml-1">Full Name</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-cyan-400"
                            placeholder="John Doe"
                            placeholderTextColor="#64748b"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View>
                        <Text className="text-cyan-200 mb-1 ml-1">Email</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-cyan-400"
                            placeholder="user@example.com"
                            placeholderTextColor="#64748b"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-cyan-200 mb-1 ml-1">Password</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-cyan-400"
                            placeholder="••••••••"
                            placeholderTextColor="#64748b"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-cyan-500 p-4 rounded-xl items-center mt-6 shadow-lg shadow-cyan-500/50"
                        onPress={handleRegister}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-slate-900 font-bold text-lg">
                                Register
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-slate-400">Already have an account? </Text>
                        <Link href="/auth/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-cyan-400 font-bold">Login</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
