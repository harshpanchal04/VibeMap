export const theme = {
    colors: {
        background: '#0f172a', // Slate 900
        surface: '#1e293b',    // Slate 800
        primary: '#3b82f6',    // Blue 500
        accent: '#8b5cf6',     // Purple 500
        text: '#f8fafc',       // Slate 50
        error: '#ef4444',      // Red 500
    },
} as const;

export type Theme = typeof theme;
export type ColorKey = keyof typeof theme.colors;
