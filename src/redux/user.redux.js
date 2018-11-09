import axios from 'axios'
import {getRedirectPath} from '../util'

// const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
const ERROR_MSG = 'ERROR_MSG'
// const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

const LOAD_DATA = 'LOAD_DATA'

const AUTH_SUCCESS = 'AUTH_SUCCESS'
const LOGOUT = 'LOGOUT' // 注销，清空所有redux状态

const initState = {
  redirectTo: '', // 控制用户跳转
  msg: '', // 报错信息
  // isAuth: false, // 是否登录
  user: '',
  pwd: '',
  type: ''
}

// reducer (负责登录注册相关)
export function user(state = initState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {...state, msg: '', redirectTo: getRedirectPath(action.payload), ...action.payload}
    // case REGISTER_SUCCESS:
    //   return {...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload}
    case LOGOUT:
      return {...initState, redirectTo: '/login'}
    case ERROR_MSG:
      return {...state, msg: action.msg}
    // case LOGIN_SUCCESS:
    //   return {...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload}
    case LOAD_DATA:
      // return {...state, ...action.payload}
      return {...state, msg: '', redirectTo: getRedirectPath(action.payload), ...action.payload}
    default:
      return state
  }
}

// action

function authSuccess(data) {
  return {type: AUTH_SUCCESS, payload: data}
}


// function registerSuccess(data) {
//   return {type: REGISTER_SUCCESS, payload: data}
// }

function errorMsg(msg) {
  // return {type: ERROR_MSG, msg: msg}
  // 等同于
  return {msg, type: ERROR_MSG}
}

// function loginSuccess(data) {
//   return {type: LOGIN_SUCCESS, payload: data}
// }


export function loadData(userinfo) {
  return {type: LOAD_DATA, payload: userinfo}
}

export function login({user, pwd}) {
  if (!user || !pwd) {
    return errorMsg('用户名密码不能为空')
  }
  return dispatch => {
    axios.post('/user/login', {user, pwd}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        // dispatch(registerSuccess({user, pwd, type}))
        dispatch(authSuccess(res.data.data))
      } else {
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}


// 注销
export function logoutSubmit() {
  return {type: LOGOUT}
}


export function register({user, pwd, repeatPwd, type}) {
  if (!user || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }
  if (pwd !== repeatPwd) {
    return errorMsg('密码和确认密码不同')
  }

  return dispatch => {
    axios.post('/user/register', {user, pwd, type}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(authSuccess({user, pwd, type}))
      } else {
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}


// 完善boss信息
export function update(data) {
  return dispatch => {
    axios.post('/user/update', data).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(authSuccess(res.data.data))
      } else {
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}