import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState({ activeUser: null })

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: usersAdapter.addOne,
    addUsers: usersAdapter.addMany,
    removeUser: (state, payload) => {
      usersAdapter.removeOne(state, payload.id)
    },
  },
})

export const { actions } = usersSlice
export const selectors = usersAdapter.getSelectors(state => state.users)
export default usersSlice.reducer
