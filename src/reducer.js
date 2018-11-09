// 合并所有的reducer，并且返回
import {combineReducers} from 'redux'

import {user} from './redux/user.redux'
import {chatuser} from './redux/chatuser.redux'
// xx
// xx


export default combineReducers({
  user,
  chatuser
  // xx
  // xx
})
