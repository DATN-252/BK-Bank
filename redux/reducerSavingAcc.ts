import { createSlice } from '@reduxjs/toolkit';

export interface SavingAccountInfo {
    createdAt: string;
    balance: number;
    accountNumber: string;
    status: "ACTIVE" | "INACTIVE";
}

const reducerSavingAccount = createSlice({
    name: 'infoSavingAccount',
    initialState: [] as SavingAccountInfo[],
    reducers: {
        setSavingAccount: (state, action) => {
            return action.payload;
        },

    },
});

export const { setSavingAccount } = reducerSavingAccount.actions;
export default reducerSavingAccount.reducer;