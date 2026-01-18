import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Explore' }} />
            <Stack.Screen name="generate" options={{ title: 'Generate' }} />
            <Stack.Screen name="history" options={{ title: 'History' }} />
            <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        </Stack>
    );
}
