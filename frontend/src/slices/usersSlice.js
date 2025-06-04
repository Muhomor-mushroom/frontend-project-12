import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

const usersReducer = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: usersAdapter.addOne,
    addUsers: usersAdapter.addMany,
    // Если нужна дополнительная обработка, то создаем свою функцию
    removeUser: (state, { payload }) => {
      // ...
      // Внутри можно вызвать метод адаптера
      usersAdapter.removeOne(state, payload)
    },
    updateUser: usersAdapter.updateOne,
  },
})
export const selectors = usersAdapter.getSelectors(state => state.users);
export const { actions } = usersReducer;
export default usersReducer.reducer;