import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
            <Text className="text-cyan-400 text-2xl font-bold">User Profile</Text>
            <Text className="text-slate-400 mt-2">Coming Soon...</Text>
        </SafeAreaView>
    );
}
