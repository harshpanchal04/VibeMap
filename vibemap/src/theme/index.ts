import { ViewStyle } from 'react-native';

export const theme = {
    colors: {
        background: '#030014', // Deep Violet Black
        surface: '#1E1E2E',    // Dark Blue-Grey for cards
        surfaceHighlight: '#2D2D44', // Lighter for inputs
        primary: '#3b82f6',    // Electric Blue
        accent: '#7000FF',     // Neon Violet
        text: '#FFFFFF',
        textDim: '#A1A1AA',    // Zinc 400
        success: '#00F0FF',    // Cyan
        error: '#FF0055',      // Pink-Red
    },
} as const;

export const glassStyles = (): ViewStyle => ({
    backgroundColor: 'rgba(30, 30, 40, 0.75)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
});

export type Theme = typeof theme;
export type ColorKey = keyof typeof theme.colors;
