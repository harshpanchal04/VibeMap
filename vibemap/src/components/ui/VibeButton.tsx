import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { theme } from '../../theme';

interface VibeButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'outline';
    isLoading?: boolean;
    onPress: () => void;
    title: string;
}

export const VibeButton: React.FC<VibeButtonProps> = ({
    variant = 'primary',
    isLoading = false,
    onPress,
    title,
    style,
    disabled,
    ...props
}) => {
    const isPrimary = variant === 'primary';
    const backgroundColor = isPrimary ? theme.colors.primary : 'transparent';
    const borderColor = theme.colors.primary;
    const textColor = isPrimary ? theme.colors.text : theme.colors.primary;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor,
                    borderColor,
                    borderWidth: isPrimary ? 0 : 2,
                    opacity: disabled || isLoading ? 0.7 : 1,
                },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
