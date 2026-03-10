import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';

// lưu token
export const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (err) {
    console.log('Save token error:', err);
  }
};

// lấy token
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    return token;
  } catch (err) {
    console.log('Get token error:', err);
    return null;
  }
};

// xóa token (logout)
export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  } catch (err) {
    console.log('Remove token error:', err);
  }
};