import { View, SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import React from 'react';

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {children}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // slate-950
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    safeArea: {
        flex: 1,
    }
});
