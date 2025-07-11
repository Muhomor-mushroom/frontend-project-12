import { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import i18n from '../i18n'
import filter from 'leo-profanity'

const messageSubmit = async (data) => {
  const resp = await axios.post('/api/v1/messages', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return resp.data
}

const Messages = ({ messages, activeChannel }) => {
  if (activeChannel == null) {
    return null
  }
  const [text, setText] = useState('')
  const activeUser = useSelector(state => state.user.userName)

  const handleInputChange = (event) => {
    setText(event.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (activeUser == null) {
      console.error('that is not a real user')
      return
    }
    const name = activeUser.userName
    const newMessage = {
      body: text,
      channelId: activeChannel.id,
      userName: name,
    }

    try {
      await messageSubmit(newMessage)
      setText('')
    }
    catch (error) {
      console.error('Error submitting message:', error)
    }
  }

  return (
    <>
      <div className="messages-header">
        <h3 className="messages-title">
          {i18n.t('chatForm.channel')}
          {' '}
          #
          {activeChannel.name}
        </h3>
      </div>
      <div className="messages-body">
        {messages.map(
          message =>

            message.channelId == activeChannel.id && !filter.check(message.body) && (
              <div key={message.id} className={`message-container ${message.userName == activeUser.userName ? 'author-message' : 'default-message'}`}>
                <p className="message-text">
                  {message.userName}
                  :
                  {message.body}
                </p>
              </div>
            ),
        )}
      </div>
      <div className="messages-bottom">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            aria-label={i18n.t('chatForm.newMessage')}
            onChange={handleInputChange}
            className="messages-input"
          />
          <button type="submit" className="messages-bottom-submit">
            {i18n.t('chatForm.send')}
          </button>
        </form>
      </div>
    </>
  )
}

export default Messages
