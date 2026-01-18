import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../../src/features/store';
import { logout } from '../../src/features/auth/authSlice';
import { theme, glassStyles } from '../../src/theme';

export default function ProfileScreen() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        console.log("User logged out");
                        dispatch(logout());
                        router.replace('/auth/login');
                    }
                }
            ]
        );
    };

    const stats = [
        { label: "Places Visited", value: "12", icon: "map-outline" },
        { label: "Reviews Left", value: "5", icon: "chatbubble-ellipses-outline" },
        { label: "Saved Vibes", value: "8", icon: "heart-outline" },
        { label: "Vibe Level", value: "5", icon: "flash-outline" },
    ];

    const menuItems = [
        { label: "Edit Profile", icon: "person-outline", action: () => console.log("Edit Profile") },
        { label: "Notification Settings", icon: "notifications-outline", action: () => console.log("Notifications") },
        { label: "Past Itineraries", icon: "time-outline", action: () => console.log("Past Itineraries") },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name || 'Guest') + '&background=7000FF&color=fff&size=200' }}
                            style={styles.avatar}
                        />
                        <View style={styles.onlineBadge} />
                    </View>
                    <Text style={styles.name}>{user?.name || "Guest User"}</Text>
                    <Text style={styles.vibeScore}>VIBE SCOUT: LVL 5</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <Ionicons name={stat.icon as any} size={24} color={theme.colors.primary} style={{ marginBottom: 8 }} />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu Options */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action} activeOpacity={0.7}>
                            <View style={styles.menuItemLeft}>
                                <Ionicons name={item.icon as any} size={22} color={theme.colors.textDim} />
                                <Text style={styles.menuItemText}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textDim} />
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout} activeOpacity={0.7}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
                            <Text style={[styles.menuItemText, { color: theme.colors.error }]}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
        padding: 4,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: theme.colors.accent,
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.surface,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.success,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    vibeScore: {
        fontSize: 14,
        fontWeight: '900',
        color: theme.colors.success, // Cyan
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        ...glassStyles(),
        width: '48%',
        backgroundColor: 'rgba(30, 30, 40, 0.6)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textDim,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Menu
    menuContainer: {
        ...glassStyles(),
        backgroundColor: 'rgba(30, 30, 40, 0.4)',
        borderRadius: 20,
        padding: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    logoutButton: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
});
