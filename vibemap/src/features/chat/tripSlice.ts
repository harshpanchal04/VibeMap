import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Itinerary } from '../../types';
import api from '../../services/api';

// Extended type for Trip with ID and timestamps
export interface Trip extends Itinerary {
    _id: string;
    createdAt: string;
    trip_title?: string;
}

interface TripState {
    status: 'idle' | 'loading' | 'success' | 'failed';
    itinerary: Trip | null;
    history: Trip[];
    error: string | null;
}

const initialState: TripState = {
    status: 'idle',
    itinerary: null,
    history: [],
    error: null,
};

const normalizeTrip = (data: any): Trip => {
    // If the backend returns the structure nested in itineraryJson, flatten it.
    if (data.itineraryJson) {
        return {
            _id: data._id,
            createdAt: data.createdAt,
            trip_title: data.trip_title, // Assuming this might exist or be in itineraryJson
            ...data.itineraryJson,
        };
    }
    return data;
};

export const generateItinerary = createAsyncThunk(
    'trip/generateItinerary',
    async (prompt: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/vibes/generate', { prompt });
            return normalizeTrip(response.data);
        } catch (error: any) {
            console.error('Generate Itinerary Error:', error);
            // Handle Axios error response structure correctly
            const message = error.response?.data?.message || error.message || 'Failed to generate vibe';
            return rejectWithValue(message);
        }
    }
);

export const fetchUserHistory = createAsyncThunk(
    'trip/fetchUserHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/vibes/history');
            return response.data.map(normalizeTrip);
        } catch (error: any) {
            console.error('Fetch History Error:', error);
            const message = error.response?.data?.message || 'Failed to fetch history';
            return rejectWithValue(message);
        }
    }
);

const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        resetTrip: (state) => {
            state.status = 'idle';
            state.itinerary = null;
            state.error = null;
        },
        setTrip: (state, action: PayloadAction<Trip>) => {
            state.itinerary = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Generate Itinerary
            .addCase(generateItinerary.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(generateItinerary.fulfilled, (state, action: PayloadAction<Trip>) => {
                state.status = 'success';
                state.itinerary = action.payload;
            })
            .addCase(generateItinerary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Fetch History
            .addCase(fetchUserHistory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserHistory.fulfilled, (state, action: PayloadAction<Trip[]>) => {
                state.status = 'success';
                state.history = action.payload;
            })
            .addCase(fetchUserHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetTrip, setTrip } = tripSlice.actions;
export default tripSlice.reducer;
