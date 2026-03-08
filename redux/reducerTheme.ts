import { createSlice } from "@reduxjs/toolkit";

const reducerTheme = createSlice({
    name: 'themeApp',
    initialState: 'light' as 'light' | 'dark',
    reducers: {
        switchTheme: (state, action) => (state === 'light' ? 'dark' : 'light'),
    },
});

export const { switchTheme } = reducerTheme.actions;
export default reducerTheme.reducer;