import React from 'react';
import './LuxurySkeleton.css';

interface LuxurySkeletonProps {
    variant?: 'text' | 'rect' | 'circle';
    width?: string | number;
    height?: string | number;
    className?: string;
    count?: number;
}

const LuxurySkeleton: React.FC<LuxurySkeletonProps> = ({
    variant = 'text',
    width,
    height,
    className = '',
    count = 1
}) => {
    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    const skeletons = Array.from({ length: count }).map((_, i) => (
        <div 
            key={i}
            className={`luxury-skeleton skeleton-${variant} ${className}`}
            style={style}
        />
    ));

    return count === 1 ? skeletons[0] : <div className="skeleton-group">{skeletons}</div>;
};

export default LuxurySkeleton;
