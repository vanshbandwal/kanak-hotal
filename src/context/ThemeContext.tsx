import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme, luxuryTheme, minimalTheme, COLORS } from '../theme/colors';

type Theme = 'light' | 'dark' | 'luxury' | 'minimal';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: typeof darkTheme;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme as Theme) || 'dark';
    });

    const getColors = (t: Theme) => {
        switch (t) {
            case 'light': return lightTheme;
            case 'luxury': return luxuryTheme;
            case 'minimal': return minimalTheme;
            case 'dark':
            default: return darkTheme;
        }
    };

    const colors = getColors(theme);
    const isDark = theme === 'dark' || theme === 'luxury';

    useEffect(() => {
        localStorage.setItem('theme', theme);

        // Sync theme colors to CSS variables on :root
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
            if (typeof value === 'string' && value.startsWith('var(')) return;
            const cssVarName = `--${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
            root.style.setProperty(cssVarName, value as string);
        });

        // Set body background for a solid feel
        document.body.style.backgroundColor = colors.background;
        document.body.setAttribute('data-theme', theme);
    }, [theme, colors]);

    const toggleTheme = () => {
        setTheme((prev) => {
            if (prev === 'dark') return 'light';
            if (prev === 'light') return 'luxury';
            if (prev === 'luxury') return 'minimal';
            return 'dark';
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
