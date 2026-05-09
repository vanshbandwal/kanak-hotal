import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

interface AuthState {
    token: string | null;
    admin: {
        id: string;
        name: string;
        email: string;
        role: string;
    } | null;
    isAuthenticated: boolean;
    loading: boolean;
    hasSidebar: boolean;
    sidebarItems: any[];
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    admin: JSON.parse(localStorage.getItem('admin_user') || 'null'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    hasSidebar: false,
    sidebarItems: [],
};

// Async Thunk for Logout
export const logoutAction = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        try {
            await authApi.logoutUser();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            dispatch(logout());
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; admin: AuthState['admin'] }>
        ) => {
            const { token, admin } = action.payload;
            state.token = token;
            state.admin = admin;
            state.isAuthenticated = true;
            localStorage.setItem('token', token); // ✅ Changed to match client interceptor
            localStorage.setItem('admin_user', JSON.stringify(admin));
        },
        logout: (state) => {
            state.token = null;
            state.admin = null;
            state.isAuthenticated = false;
            state.hasSidebar = false;
            state.sidebarItems = [];
            localStorage.removeItem('token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSidebarItems: (state, action: PayloadAction<any[]>) => {
            state.sidebarItems = action.payload;
            state.hasSidebar = action.payload.length > 0;
        },
    },
});

export const { setCredentials, logout, setLoading, setSidebarItems } = authSlice.actions;
export default authSlice.reducer;
