import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationDialog from '../components/Confirmation/ConfirmationDialog';
export type ConfirmationIcon = 'trash' | 'hanger' | 'heart-break' | 'box' | 'user-minus' | 'map-pin';

export interface ConfirmationOptions {
    title: string;
    subtitle: string;
    confirmLabel?: string;
    cancelLabel?: string;
    icon?: ConfirmationIcon;
    onConfirm: () => void;
    onCancel?: () => void;
    critical?: boolean;
}

interface ConfirmationContextType {
    showConfirmation: (options: ConfirmationOptions) => void;
    hideConfirmation: () => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmationOptions | null>(null);

    const showConfirmation = useCallback((ops: ConfirmationOptions) => {
        setOptions(ops);
        setIsOpen(true);
    }, []);

    const hideConfirmation = useCallback(() => {
        setIsOpen(false);
        if (options?.onCancel) options.onCancel();
    }, [options]);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        if (options?.onConfirm) options.onConfirm();
    }, [options]);

    return (
        <ConfirmationContext.Provider value={{ showConfirmation, hideConfirmation }}>
            {children}
            {isOpen && options && (
                <ConfirmationPortal
                    options={options}
                    onClose={hideConfirmation}
                    onConfirm={handleConfirm}
                />
            )}
        </ConfirmationContext.Provider>
    );
};

// Internal component to render the actual dialog via portal or direct render
// For now, we'll keep it simple and the ConfirmationDialog component will be managed here or in App

const ConfirmationPortal: React.FC<{
    options: ConfirmationOptions;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ options, onClose, onConfirm }) => {
    return (
        <ConfirmationDialog
            {...options}
            isOpen={true}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
};

export const useConfirmation = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider');
    }
    return context;
};
