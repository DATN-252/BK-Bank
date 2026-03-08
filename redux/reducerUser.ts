import { createSlice } from '@reduxjs/toolkit';

export interface UserInfo {
    clientId: number;
    fullName: string;
    role: string;
    username: string;

    avatar?: string;
    email?: string;
    phoneNumber?: string;
    country?: string;
    city?: string;
    address?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth?: string;
    idNumber?: string;
    status?: "ACTIVE" | "INACTIVE";
}

const reducerUser = createSlice({
    name: 'infoUser',
    initialState: {} as UserInfo | null,
    reducers: {
        setUser: (state, action) => {
            return action.payload; //Nó chỉ gán nguyên object bạn truyền vào làm state mới.
        },

    },
});

export const { setUser } = reducerUser.actions;
export default reducerUser.reducer;