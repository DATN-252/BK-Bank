import { createSlice } from "@reduxjs/toolkit";

// todo nên là isAuthenticated: boolean, vì token cần giấu đi, không nên lưu trong state
// gộp vào reducerUser, vì nó liên quan đến user, khi logout thì xóa cả user info đi luôn, tránh trường hợp token hết hạn mà vẫn còn user
interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { saveToken, logout } = authSlice.actions;
export default authSlice.reducer;