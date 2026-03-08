import { configureStore } from '@reduxjs/toolkit';
import reducerUser from './reducerUser';
import reducerTheme from './reducerTheme';
import reducerNoti from './reducerNoti';

export const store = configureStore({
  reducer: {
    userInfo: reducerUser,
    themeApp: reducerTheme,
    notification: reducerNoti,
  },
});

export type ReduxTypes = {
  RootState: ReturnType<typeof store.getState>;
  AppDispatch: typeof store.dispatch;
};