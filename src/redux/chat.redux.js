import axios from 'axios'
import io from 'socket.io-client'

const socket = io('ws://localhost:9093')

// 获取聊天列表
const MSG_LIST = 'MSG_LIST'
// 读取信息
const MSG_RECV = 'MSG_RECV'
// 标识已读
const MSG_READ = 'MSG_READ'

const initState = {
  chatmsg: [],
  unread: 0,
  users: {}
}


// reducer
export function chat(state = initState, action) {
  switch (action.type) {
    case MSG_LIST:
      return {
        ...state,
        users: action.payload.users,
        chatmsg: action.payload.msgs,
        // 只统计别人发给我的未读消息数量
        unread: action.payload.msgs.filter(v => !v.read && v.to === action.payload.userid).length
      }
    case MSG_RECV:
      // 只统计别人发给我的未读消息数量
      const n = action.payload.msg.to === action.payload.userid ? 1 : 0
      return {...state, chatmsg: [...state.chatmsg, action.payload.msg], unread: state.unread + n}
    case MSG_READ:
      const {from, num} = action.payload
      return {
        ...state,
        // chatmsg: state.chatmsg.map(v => ({...v, read: true})),
        chatmsg: state.chatmsg.map(v => ({...v, read: from === v.from ? true : v.read})),
        unread: state.unread - num
      }
    default:
      return state
  }
}

// action
function msgList(msgs, users, userid) {
  return {type: MSG_LIST, payload: {msgs, users, userid}}
}

function msgRecv(msg, userid) {
  return {type: MSG_RECV, payload: {msg, userid}}
}

function msgRead({from, userid, num}) {
  return {type: MSG_READ, payload: {from, userid, num}}
}

export function readMsg(from) {
  return (dispatch, getStatus) => {
    axios.post('/user/readmsg', {from}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        // console.log(getStatus())
        // 当前登录人id
        const userid = getStatus().user._id
        dispatch(msgRead({from, userid, num: res.data.num}))
        // dispatch({type: MSG_READ, payload: {from, userid, num}})
      }
    })
  }
}

export function recvMsg() {
  return (dispatch, getStatus) => {
    socket.on('recvmsg', (data) => {
      // console.log('recvmsg', data)
      // 当前登录人id
      const userid = getStatus().user._id
      dispatch(msgRecv(data, userid))
    })
  }
}


export function sendMsg({from, to, msg}) {
  return dispatch => {
    socket.emit('sendmsg', {from, to, msg})
  }
}

export function getMsgList() {
  return (dispatch, getStatus) => {
    axios.get('/user/getmsglist').then(res => {
      if (res.status === 200 && res.data.code === 0) {
        // console.log(getStatus())
        // 当前登录人id
        const userid = getStatus().user._id
        dispatch(msgList(res.data.msgs, res.data.users, userid))
      }
    })
  }
}