import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState()

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: messagesAdapter.addOne,
        addMessages: messagesAdapter.addMany,
        removeMessage: (state, {payload}) => {
            messagesAdapter.removeOne(state, payload);
        }
    }
})

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;