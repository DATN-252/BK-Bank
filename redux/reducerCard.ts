import { createSlice } from '@reduxjs/toolkit';
import { CardType } from '@/types/card';

const reducerCard = createSlice({
    name: 'infoCard',
    initialState: [] as CardType[],
    reducers: {
        getCards: (state, action) => {
            return action.payload;
        },

    },
});

export const { getCards } = reducerCard.actions;
export default reducerCard.reducer;