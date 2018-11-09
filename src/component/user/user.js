// 用户个人中心页

import React from 'react'
import {List, Modal, Result, WhiteSpace} from 'antd-mobile'
import browserCookie from 'browser-cookies' // 操作cookie
import {Redirect} from 'react-router-dom'
/*redux相关*/
import {connect} from 'react-redux'
import {logoutSubmit} from '../../redux/user.redux'

@connect(
  state => state.user, // 你要state什么属性放到props里面
  {logoutSubmit}
)
class User extends React.Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  logout() {
    Modal.alert('注销', '确认退出登录吗???', [
      {text: '取消', onPress: () => console.log('cancel')},
      {
        text: '确认', onPress: () => {
        browserCookie.erase('userID') // 删除cookie
        // window.location.href = window.location.href // 刷新当前页面，或者window.location.Reload()
        this.props.logoutSubmit()
      }
      },
    ])
  }

  render() {
    // console.log(this.props)
    const props = this.props

    const Item = List.Item
    const Brief = Item.Brief

    // 点击注销之后, props.user不存在, redirectTo变成'/login'
    return props.user ? (
      <div>
        <Result
          img={<img src={require(`../img/${props.avatar}.png`)} style={{width: 50, height: 50}} alt=''/>}
          title={props.user}
          message={props.type === 'boss' ? props.company : null}
        />
        <List renderHeader={() => '简介'}>
          <Item wrap>
            <div>{props.type === 'boss' ? '招聘岗位: ' : '应聘岗位: '}{props.title}</div>
            {props.desc.split('\n').map((v, index) => (<Brief key={index}>{v}</Brief>))}
            {props.money ? <Brief>薪资: {props.money}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace/>
        <List>
          <Item arrow="horizontal" onClick={this.logout}>退出登录</Item>
        </List>
      </div>
    ) : (props.redirectTo ? <Redirect to={props.redirectTo}/> : null)
  }
}

export default User