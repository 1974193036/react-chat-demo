// 合并所有的reducer，并且返回
import {combineReducers} from 'redux'

import {user} from './redux/user.redux'
import {chatuser} from './redux/chatuser.redux'
import {chat} from './redux/chat.redux'
// xx
// xx


export default combineReducers({
  user,
  chatuser,
  chat
  // xx
  // xx
})
