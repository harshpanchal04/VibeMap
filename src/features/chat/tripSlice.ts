import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Itinerary } from '../../types';
import { generateVibe } from '../../services/gemini';

interface TripState {
    status: 'idle' | 'loading' | 'success' | 'failed';
    itinerary: Itinerary | null;
    error: string | null;
}

const initialState: TripState = {
    status: 'idle',
    itinerary: null,
    error: null,
};

export const generateItinerary = createAsyncThunk(
    'trip/generateItinerary',
    async (prompt: string, { rejectWithValue }) => {
        try {
            const data = await generateVibe(prompt);
            return data;
        } catch (error) {
            return rejectWithValue('Failed to generate vibe');
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateItinerary.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(generateItinerary.fulfilled, (state, action: PayloadAction<Itinerary>) => {
                state.status = 'success';
                state.itinerary = action.payload;
            })
            .addCase(generateItinerary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetTrip, resetStatus } = tripSlice.actions;
export default tripSlice.reducer;
