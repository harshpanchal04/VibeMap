import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';

interface ScreenWrapperProps extends ViewProps {
    children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, ...props }) => {
    return (
        <SafeAreaView style={[styles.container, style]} edges={['top', 'left', 'right']} {...props}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
});
