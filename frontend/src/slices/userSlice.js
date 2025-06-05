import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
const userAdapter = createEntityAdapter();

const userSlice = createSlice({
  name: 'user',
  initialState: {userName: null},
  reducers: {
    setUser: (state, action) => action.payload, // Сохраняем данные пользователя
    clearUser: () => null, // Очищаем при выходе
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;