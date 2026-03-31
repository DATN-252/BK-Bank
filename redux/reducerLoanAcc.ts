import { createSlice } from '@reduxjs/toolkit';

export interface LoanAccountInfo {
    principal: number;
    createdAt: string;
    principalOutstanding: number;
    accountNumber: string;
    status: "ACTIVE" | "INACTIVE";
}

const reducerLoanAccount = createSlice({
    name: 'infoLoanAccount',
    initialState: [] as LoanAccountInfo[],
    reducers: {
        setLoanAccount: (state, action) => {
            return action.payload;
        },

    },
});

export const { setLoanAccount } = reducerLoanAccount.actions;
export default reducerLoanAccount.reducer;
