import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
// import { StripeProvider } from '@stripe/stripe-react-native';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from '../src/features/store';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../src/theme';
import '../global.css';

function AuthGuard() {
    const { user, status } = useSelector((state: RootState) => state.auth);
    const segments = useSegments();
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();

    useEffect(() => {
        if (!rootNavigationState?.key) return;

        const inAuthGroup = segments[0] === 'auth';

        // Use setTimeout to ensure navigation is ready and avoid "navigate before mount" error
        const timer = setTimeout(() => {
            if (!user && !inAuthGroup) {
                router.replace('/auth/login');
            } else if (user && inAuthGroup) {
                router.replace('/(tabs)');
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [user, segments, rootNavigationState?.key]);

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="map/[id]" />
            <Stack.Screen name="auth" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            {/* <StripeProvider publishableKey="pk_test_placeholder"> */}
            <AuthGuard />
            {/* </StripeProvider> */}
        </Provider>
    );
}
