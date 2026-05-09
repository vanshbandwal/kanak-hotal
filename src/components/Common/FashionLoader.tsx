import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './FashionLoader.css';

interface FashionLoaderProps {
    theme?: "light" | "dark" | "auto";
    size?: "sm" | "md" | "lg";
    fullScreen?: boolean;
    message?: string;
}

const FashionLoader: React.FC<FashionLoaderProps> = ({
    theme: propTheme,
    size = "md",
    fullScreen = false,
    message
}) => {
    const { colors: themeColors } = useTheme();
    const [taglineIndex, setTaglineIndex] = useState(0);
    const taglines = [
        "Curating your look...",
        "Style is loading...",
        "Draping the details...",
        "Almost runway-ready...",
        "Vélour Admin: Defining the Cut."
    ];

    useEffect(() => {
        if (message) return;
        const interval = setInterval(() => {
            setTaglineIndex((prev) => (prev + 1) % taglines.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [message, taglines.length]);

    const activeColors = {
        background: themeColors.background,
        primary: themeColors.primary,
        secondary: themeColors.primary,
        text: themeColors.textPrimary
    };

    const sizeMap = {
        sm: 50,
        md: 80,
        lg: 120
    };

    const currentSize = sizeMap[size];

    return (
        <div
            role="status"
            aria-label="Loading, please wait"
            className={`fashion-loader-wrapper ${fullScreen ? 'full-screen' : ''}`}
            style={{ backgroundColor: activeColors.background }}
        >
            <div className="fashion-loader-content">
                <div
                    className="fashion-loader-animation-container"
                    style={{ width: currentSize, height: currentSize }}
                >
                    <svg viewBox="0 0 100 100" className="fashion-loader-svg">
                        <path
                            d="M10,10 L50,90 L90,10"
                            fill="none"
                            stroke={activeColors.primary}
                            strokeWidth="1"
                            strokeOpacity="0.1"
                            strokeLinecap="round"
                        />
                        <path
                            d="M10,10 L50,90 L90,10"
                            fill="none"
                            stroke={activeColors.secondary}
                            strokeWidth="2.5"
                            strokeDasharray="8 4"
                            strokeLinecap="round"
                            className="fashion-loader-stitch"
                        />
                        <circle
                            cx="0" cy="0" r="1.5"
                            fill={activeColors.primary}
                            className="fashion-loader-needle"
                        />
                    </svg>
                </div>

                <div className="fashion-loader-tagline-wrapper">
                    <p
                        key={message || taglineIndex}
                        className={`fashion-loader-tagline ${!message ? 'fading' : ''}`}
                        style={{ color: activeColors.text }}
                    >
                        {message || taglines[taglineIndex]}
                    </p>
                    <div 
                        className="fashion-loader-luxury-bar" 
                        style={{ background: activeColors.secondary }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default FashionLoader;
