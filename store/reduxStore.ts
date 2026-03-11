import { configureStore } from '@reduxjs/toolkit';
import reducerUser from '@/redux/reducerUser';
import reducerTheme from '@/redux/reducerTheme';
import reducerNoti from '@/redux/reducerNoti';
import reducerCard from '@/redux/reducerCard';
import reducerAuth from '@/redux/reducerAuth';

export const store = configureStore({
  reducer: {
    userInfo: reducerUser,
    themeApp: reducerTheme,
    notification: reducerNoti,
    cardInfo: reducerCard,
    auth: reducerAuth,
  },
});

export type ReduxTypes = {
  RootState: ReturnType<typeof store.getState>;
  AppDispatch: typeof store.dispatch;
};