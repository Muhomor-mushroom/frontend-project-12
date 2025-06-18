import {
  createSlice,
} from '@reduxjs/toolkit'

const setNewActiveUser = (state, action) => {
  state.userName = action.payload
}

const userSlice = createSlice({
  name: 'user',
  initialState: { userName: null },
  reducers: {
    setUser: (state, action) => setNewActiveUser(state, action), // Сохраняем данные пользователя
    clearUser: state => state.userName = null, // Очищаем при выходе
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
