import { Tabs } from 'expo-router';
import { View } from 'react-native';
// You might want to import icons here, e.g. from @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0f172a', // Cyberpunk dark slate
                    borderTopColor: '#334155',
                },
                tabBarActiveTintColor: '#22d3ee', // Cyan-400
                tabBarInactiveTintColor: '#94a3b8', // Slate-400
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
