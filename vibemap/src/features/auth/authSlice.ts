import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, thunkAPI) => {
        try {
            const response = await api.post('/auth/login', credentials);
            await AsyncStorage.setItem('userToken', response.data.token);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, thunkAPI) => {
        try {
            const response = await api.post('/auth/register', userData);
            await AsyncStorage.setItem('userToken', response.data.token);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await AsyncStorage.removeItem('userToken');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'success';
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'success';
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
