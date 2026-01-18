import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localhost for emulator (10.0.2.2 for Android) or your machine's IP for physical device
// It's best to put this in .env as EXPO_PUBLIC_API_URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error retrieving token from storage:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
