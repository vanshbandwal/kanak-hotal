export const darkTheme = {
    background: "#0A0F2C",
    surface: "#120B30",
    surfaceLight: "#1A1040",

    primary: "#E8C97B",
    primaryDark: "#C9963A",
    primaryLight: "#F5E6C8",

    accent: "#9B89C4",
    glow: "rgba(232, 201, 123, 0.6)",
    buttonText: "#0A0F2C",

    textPrimary: "#F5E6C8",
    textSecondary: "#9B89C4",
    textLight: "rgba(245, 230, 200, 0.6)",
    textWhite: "#FFFFFF",
    white: "#FFFFFF",
    black: "#000000",

    border: "rgba(232, 201, 123, 0.3)",
    glassBackground: "rgba(5, 3, 20, 0.7)",
    glassBorder: "rgba(212, 175, 55, 0.2)",
    cardShadow: "0 20px 50px rgba(0,0,0,0.5)",

    success: "#22C55E",
    error: "#EF4444",
    warning: "#FBBF24",
    info: "#3B82F6",

    transparent: "transparent",
};

export const lightTheme = {
    background: "#FDFCF8",
    surface: "#FFFFFF",
    surfaceLight: "#F5F1E6",

    primary: "#B8860B",
    primaryDark: "#8B6508",
    primaryLight: "#DAA520",

    accent: "#7E57C2",
    glow: "rgba(184, 134, 11, 0.2)",
    buttonText: "#FFFFFF",

    textPrimary: "#1A1A1A",
    textSecondary: "#5D4037",
    textLight: "rgba(26, 26, 26, 0.6)",
    textWhite: "#000000",
    white: "#FFFFFF",
    black: "#000000",

    border: "rgba(184, 134, 11, 0.15)",
    glassBackground: "rgba(255, 255, 255, 0.7)",
    glassBorder: "rgba(184, 134, 11, 0.1)",
    cardShadow: "0 10px 30px rgba(0,0,0,0.05)",

    success: "#166534",
    error: "#991B1B",
    warning: "#92400E",
    info: "#1E40AF",

    transparent: "transparent",
};

export const luxuryTheme = {
    background: "#050505",
    surface: "#111111",
    surfaceLight: "#1A1A1A",

    primary: "#D4AF37", // Metallic Gold
    primaryDark: "#AA880B",
    primaryLight: "#F1D592",

    accent: "#8E7618",
    glow: "rgba(212, 175, 55, 0.4)",
    buttonText: "#050505",

    textPrimary: "#F5F5F5",
    textSecondary: "#AFAFAF",
    textLight: "rgba(245, 245, 245, 0.5)",
    textWhite: "#FFFFFF",
    white: "#FFFFFF",
    black: "#000000",

    border: "rgba(212, 175, 55, 0.25)",
    glassBackground: "rgba(10, 10, 10, 0.8)",
    glassBorder: "rgba(212, 175, 55, 0.15)",
    cardShadow: "0 25px 60px rgba(0,0,0,0.9)",

    success: "#D4AF37", // Gold for success in luxury
    error: "#FF4D4D",
    warning: "#C5A028",
    info: "#AFAFAF",

    transparent: "transparent",
};

export const minimalTheme = {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceLight: "#F9F9F9",

    primary: "#000000",
    primaryDark: "#1A1A1A",
    primaryLight: "#333333",

    accent: "#666666",
    glow: "rgba(0, 0, 0, 0.05)",
    buttonText: "#FFFFFF",

    textPrimary: "#000000",
    textSecondary: "#444444",
    textLight: "rgba(0, 0, 0, 0.4)",
    textWhite: "#000000",
    white: "#FFFFFF",
    black: "#000000",

    border: "rgba(0, 0, 0, 0.1)",
    glassBackground: "rgba(255, 255, 255, 0.9)",
    glassBorder: "rgba(0, 0, 0, 0.05)",
    cardShadow: "0 10px 40px rgba(0,0,0,0.08)",

    success: "#000000",
    error: "#000000",
    warning: "#000000",
    info: "#000000",

    transparent: "transparent",
};

// CSS Variable-based COLORS for root-level theme injection
export const COLORS = {
    background: "var(--background)",
    surface: "var(--surface)",
    surfaceLight: "var(--surface-light)",

    primary: "var(--primary)",
    primaryDark: "var(--primary-dark)",
    primaryLight: "var(--primary-light)",

    accent: "var(--accent)",
    glow: "var(--glow)",
    buttonText: "var(--button-text)",

    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textLight: "var(--text-light)",
    textWhite: "var(--text-white)",
    white: "var(--white)",
    black: "var(--black)",

    border: "var(--border)",
    glassBackground: "var(--glass-background)",
    glassBorder: "var(--glass-border)",
    cardShadow: "var(--card-shadow)",

    success: "var(--success)",
    error: "var(--error)",
    warning: "var(--warning)",
    info: "var(--info)",

    transparent: "transparent",
};
