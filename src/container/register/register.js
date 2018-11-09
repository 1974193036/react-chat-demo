import React from 'react'
import Logo from '../../component/logo/logo'
import {Button, InputItem, List, Radio, WhiteSpace, WingBlank} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {imoocForm} from '../../component/imooc-form/imooc-form' // 高阶组件
/*redux相关*/
import {connect} from 'react-redux'
import {register} from '../../redux/user.redux'


@connect(
  state => state.user, // 你要state什么属性放到props里面
  {register} // 你要什么方法放到props里面，自动dispatch
)
@imoocForm // 相当于在(class Register)组件最后增加了Register = imoocForm(Register), Register
class Register extends React.Component {
  constructor(props) {
    super(props)
    // 删除，变成高阶组件使用
    // this.state = {
    //   user: '',
    //   pwd: '',
    //   repeatPwd: '',
    //   type: 'genius' // 或者boss
    // }
    this.handleRegister = this.handleRegister.bind(this)
  }

  // 输入框输入文字改变state
  // 删除，变成高阶组件使用
  // handleChange(key, val) {
  //   this.setState({
  //     [key]: val
  //   })
  // }

  // 高阶组件-初始化type: 'genius' // 或者boss
  componentDidMount() {
    this.props.handleChange('type', 'genius')
  }

  // 点击注册按钮
  handleRegister() {
    // this.props.state => 变成高阶组件使用
    console.log(this.props.state)
    this.props.register(this.props.state)
  }

  render() {
    const RadioItem = Radio.RadioItem
    return (
      <div>
        {this.props.redirectTo ? <Redirect to={this.props.redirectTo}/> : null}
        <Logo></Logo>
        <WingBlank>
          <List>
            {this.props.msg ? <p className='err-msg'>{this.props.msg}</p> : null}
            {/*this.props.handleChange => 变成高阶组件使用*/}
            <InputItem onChange={(v) => this.props.handleChange('user', v)}>用户</InputItem>
            <InputItem onChange={(v) => this.props.handleChange('pwd', v)} type='password'>密码</InputItem>
            <InputItem onChange={(v) => this.props.handleChange('repeatPwd', v)} type='password'>确认密码</InputItem>
          </List>
          <WhiteSpace/>
          <List>
            <RadioItem
              checked={this.props.state.type === 'genius'}
              onChange={() => this.props.handleChange('type', 'genius')}
            >
              牛人(求职者)
            </RadioItem>
            <RadioItem
              checked={this.props.state.type === 'boss'}
              onChange={() => this.props.handleChange('type', 'boss')}
            >
              BOSS
            </RadioItem>
          </List>
          <WhiteSpace/>
          <Button type='primary' onClick={this.handleRegister}>注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default Register





