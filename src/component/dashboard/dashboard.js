// 登录之后的页面

import React from 'react'
import {NavBar} from 'antd-mobile'
import {Route,Redirect} from 'react-router-dom'
import NavLinkBar from '../navlink/navlink'
import Boss from '../boss/boss'
import Genius from '../genius/genius'
import User from '../user/user'
import Msg from '../msg/msg'
/*redux相关*/
import {connect} from 'react-redux'
import {getMsgList, recvMsg} from '../../redux/chat.redux'
// 动画
import QueueAnim from 'rc-queue-anim'

// function Boss() {
//   return <h2>Boss首页</h2>
// }

// function Genius() {
//   return <h2>牛人首页</h2>
// }

// function Msg() {
//   return <h2>Msg</h2>
// }

// function User() {
//   return <h2>用户个人中心页</h2>
// }

@connect(
  state => state, // 你要state什么属性放到props里面
  {getMsgList, recvMsg}
)
class Dashboard extends React.Component {

  componentDidMount() {
    // this.props.getMsgList()
    // this.props.recvMsg()
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }

  render() {
    const pathname = this.props.location.pathname
    // console.log(pathname) 如 '/boss'

    const user = this.props.user // 多个redux内的user
    const navList = [
      {
        path: '/boss',
        text: '牛人',
        icon: 'boss',
        title: '牛人列表',
        component: Boss,
        hide: user.type === 'genius'
      },
      {
        path: '/genius',
        text: 'boss',
        icon: 'job',
        title: 'BOSS列表',
        component: Genius,
        hide: user.type === 'boss'
      },
      {
        path: '/msg',
        text: '消息',
        icon: 'msg',
        title: '消息列表',
        component: Msg
      },
      {
        path: '/me',
        text: '我',
        icon: 'user',
        title: '个人中心',
        component: User
      }
    ]
    // 让动画生效，只渲染一个Route，根据当前的path决定组件
    const page = navList.find(v => v.path === pathname)
    return page ? (
      <div>
        <NavBar className="fixd-header" mode="dark">{page.title}</NavBar>

        <div style={{marginTop: 45, marginBottom: 60}}>
          {/*<Switch>*/}
          {/*{navList.map(v => (*/}
          {/*<Route key={v.path} path={v.path} component={v.component}></Route>*/}
          {/*))}*/}
          {/*</Switch>*/}
          <QueueAnim duration={500} type='scaleX'>
            <Route key={page.path} path={page.path} component={page.component}></Route>
          </QueueAnim>
        </div>

        <NavLinkBar data={navList}></NavLinkBar>
      </div>
    ):<Redirect to='/msg'></Redirect>
  }
}

export default Dashboard