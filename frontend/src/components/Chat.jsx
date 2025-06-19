import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  actions as channelsActions,
  selectors as channelsSelectors,
} from '../slices/channelsSlice.js'
import {
  actions as messagesActions,
  selectors as messagesSelectors,
} from '../slices/messagesSlice.js'
import { setUser } from '../slices/userSlice.js'
import Channels from './Channels.jsx'
import Messages from './messages.jsx'
import i18n from '../i18n.js'
import { ToastContainer, toast } from 'react-toastify'

const createdChannelToast = () => toast(i18n.t('chatForm.createdChannelToast'))

const deletedChannelToast = () => toast(i18n.t('chatForm.deletedChannelToast'))

const renaimedChannelToast = () => toast(i18n.t('chatForm.renaimedChannelToast'))

const errorToast = message => toast(`${i18n.t('chatForm.networkErrorToast')}${message}`)

const ChatPage = () => {
  const token = localStorage.getItem('token')
  const [activeChannel, setActiveChannel] = useState({})
  const dispatch = useDispatch()
  if (!token) {
    window.location = '/login'
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelsResponse = await axios.get('/api/v1/channels', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setActiveChannel(channelsResponse.data[0])
        const messagesResponse = await axios.get('/api/v1/messages', {
          headers: { Authorization: `Bearer ${token}` },
        })
        dispatch(messagesActions.addMessages(messagesResponse.data))
        dispatch(channelsActions.addChannels(channelsResponse.data))
        dispatch(setUser({ userName: localStorage.getItem('userName') }))
      }
      catch (error) {
        console.error('Error fetching data: ', error)
        errorToast(error)
        window.location = '/login'
      }
    }

    fetchData()
  }, [dispatch, token])

  const logOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    window.location = '/login'
  }

  if (!token) return null
  const channels = useSelector(channelsSelectors.selectAll)
  const messages = useSelector(messagesSelectors.selectAll)
  console.log(channels)
  return (
    <div className="chat-container">
      <ToastContainer />
      <div className="channels-container">
        <Channels channels={channels} setActiveChannel={setActiveChannel} />
        <a className="log-out" onClick={() => logOut()}>{i18n.t('chatForm.logOut')}</a>
        <button onClick={() => window.location = '/'}>{i18n.t('chatForm.hexletChannel')}</button>
      </div>
      <div className="messages-container">
        <Messages messages={messages} activeChannel={activeChannel} />
      </div>
    </div>
  )
}
/* eslint-disable */ 
export default () => <ChatPage />
export { createdChannelToast, deletedChannelToast, renaimedChannelToast, errorToast }
/* eslint-enable */
