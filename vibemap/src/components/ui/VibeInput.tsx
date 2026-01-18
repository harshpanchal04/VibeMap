import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../theme';

interface VibeInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const VibeInput: React.FC<VibeInputProps> = ({
    label,
    error,
    style,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const borderColor = error
        ? theme.colors.error
        : isFocused
            ? theme.colors.accent
            : theme.colors.surface;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                    },
                    style,
                ]}
                placeholderTextColor="#64748b"
                onFocus={handleFocus}
                onBlur={handleBlur}
                selectionColor={theme.colors.accent}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: theme.colors.primary,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    input: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
