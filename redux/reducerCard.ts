import { createSlice } from '@reduxjs/toolkit';
import { CreditCardType } from '@/types/card';

const reducerCard = createSlice({
    name: 'infoCard',
    initialState: [] as CreditCardType[],
    reducers: {
        getCards: (state, action) => {
            return action.payload;
        },

    },
});

export const { getCards } = reducerCard.actions;
export default reducerCard.reducer;