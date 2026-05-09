import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <h1 style={styles.title}>Something went wrong</h1>
                        <p style={styles.message}>{this.state.error?.message}</p>
                        <button 
                            style={styles.button}
                            onClick={() => window.location.reload()}
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    card: {
        backgroundColor: '#1a1a1a',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid #333',
        textAlign: 'center',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
    },
    title: {
        color: '#e8c97b',
        fontSize: '24px',
        margin: '0 0 16px 0'
    },
    message: {
        color: '#888',
        fontSize: '14px',
        margin: '0 0 32px 0',
        lineHeight: '1.6'
    },
    button: {
        backgroundColor: '#e8c97b',
        color: '#000',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '12px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default ErrorBoundary;
