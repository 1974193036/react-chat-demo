import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
/*redux相关*/
import {connect} from 'react-redux'
import {loadData} from '../../redux/user.redux'

@withRouter

@connect(
  // null,
  state => state.user, // 你要state什么属性放到props里面
  {loadData} // 你要什么方法放到props里面，自动dispatch
)
class AuthRoute extends React.Component {
  componentDidMount() {
    // 如果已经是登录或注册页，则不判断是否直接跳转到主页
    const publicList = ['/login', '/register']
    const pathname = this.props.location.pathname
    if (publicList.indexOf(pathname) > -1) {
      return null
    }

    // 获取用户信息,判断是否直接跳转到主页，否则跳转到登录页
    // 这部分可以放到redux内
    axios.get('/user/info').then(res => {
      if (res.status === 200) {
        // console.log(res.data)

        if (res.data.code === 0) {
          // 有登录信息,直接跳转到主页
          this.props.loadData(res.data.data)

          // 自己写的部分
          // this.props.history.push(this.props.redirectTo)


        } else {
          // console.log(this.props.history)
          this.props.history.push('/login')
        }
      }
    })
    // 是否登录
    // 用户是否完善信息（选择头像 个人简介）
    // 用户的type 身份是boss还是牛人
  }

  render() {
    return null
  }
}

export default AuthRoute