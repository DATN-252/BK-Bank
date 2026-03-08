import { NotificationType } from '@/types/noti';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  
export interface NotiBalance extends NotificationType {
  readed: boolean;
}

const reducerNoti = createSlice({
  name: 'notification',
  initialState: [] as NotiBalance[],
  reducers: {
    addToNoti: (state, action: PayloadAction<NotiBalance>) => {
      state.unshift(action.payload); // thêm noti mới lên đầu
    },

    removeAllNoti: () => {
      return [];
    },

    checkNoti: (state, action: PayloadAction<string>) => {
      const noti = state.find(item => item.id === action.payload);
      if (noti) {
        noti.readed = true;
      }
    },

    checkAllNoti: (state) => {
      state.forEach(item => {
        item.readed = true;
      });
    },
  },
});

export const { addToNoti, removeAllNoti, checkNoti, checkAllNoti } = reducerNoti.actions;
export default reducerNoti.reducer;