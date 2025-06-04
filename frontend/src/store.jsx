import { createStore } from 'redux'
import { usersReducer } from './slices/usersSlice'

const formStore = createStore(usersReducer);