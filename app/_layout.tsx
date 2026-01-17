import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Provider } from 'react-redux';
import { store } from '../src/features/store';
import '../global.css';

export default function RootLayout() {
    return (
        <Provider store={store}>
            <StripeProvider publishableKey="pk_test_placeholder">
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="map/[id]" />
                </Stack>
            </StripeProvider>
        </Provider>
    );
}
