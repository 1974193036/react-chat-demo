import React from 'react'
import Logo from '../../component/logo/logo'
import {Button, InputItem, List, WhiteSpace, WingBlank} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {imoocForm} from '../../component/imooc-form/imooc-form' // 高阶组件
/*redux相关*/
import {connect} from 'react-redux'
import {login} from '../../redux/user.redux'

// 高阶组件,把一个组件传入，返回另一个新的组件
// 装饰者模式
// function hello() {
//   console.log('hello imooc I love react')
// }
// function WrapperHello(fn) {
//   return function () {
//     console.log('before say hello')
//     fn()
//     console.log('after say hello')
//   }
// }
// hello = WrapperHello(hello)
// hello()

// 高阶组件-属性代理
// function WrapperHello(Comp) {
//   class WrapComp extends React.Component {
//     render() {
//       return (
//         <div>
//           <p>这是HOC高阶组件特有的元素</p>
//           <Comp name="text" {...this.props}/>
//         </div>
//       )
//     }
//   }
//   return WrapComp
// }

// 高阶组件-反向继承
// function WrapperHello(Comp) {
//   class WrapComp extends Comp {
//     componentDidMount() {
//       console.log('高阶组件新增的生命周期，加载完成')
//     }
//     render() {
//       return (
//         <div>
//           <p>这是HOC高阶组件特有的元素</p>
//           <Comp name="text" {...this.props}/>
//         </div>
//       )
//     }
//   }
//   return WrapComp
// }

// 装饰者模式，装饰了Hello函数，类似 Hello = WrapperHello(Hello)
// 给原有的组件（Hello）增强功能
// @ + 高阶函数
// @WrapperHello
// class Hello extends React.Component {
//   render() {
//     return <h2>hello imooc I love react&redux {this.props.name}</h2>
//   }
// }
// Hello = WrapperHello(Hello)



@connect(
  state => state.user, // 你要state什么属性放到props里面
  {login} // 你要什么方法放到props里面，自动dispatch
)
@imoocForm // 相当于在(class Login)组件最后增加了Login = imoocForm(Login), 装饰了一次Login
class Login extends React.Component {
  constructor(props) {
    super(props)

    // 删除，变成高阶组件使用
    // this.state = {
    //   user: '',
    //   pwd: ''
    // }
    this.register = this.register.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  register() {
    // console.log(this.props)
    this.props.history.push('./register')
  }

  handleLogin() {
    // this.props.state => 变成高阶组件使用
    console.log(this.props.state)
    this.props.login(this.props.state)
  }

  // 输入框输入文字改变state,
  // 删除，变成高阶组件使用
  // handleChange(key, val) {
  //   this.setState({
  //     [key]: val
  //   })
  // }

  render() {
    return (
      <div>
        {/*<Hello/>*/}
        {(this.props.redirectTo && this.props.redirectTo !== '/login') ? <Redirect to={this.props.redirectTo}/> : null}
        <Logo></Logo>
        <WingBlank>
          <List>
            {this.props.msg ? <p className='err-msg'>{this.props.msg}</p> : null}
            {/*this.props.handleChange => 变成高阶组件使用*/}
            <InputItem onChange={(v) => this.props.handleChange('user', v)}>用户</InputItem>
            <InputItem onChange={(v) => this.props.handleChange('pwd', v)} type='password'>密码</InputItem>
          </List>
          <WhiteSpace/>
          <Button onClick={this.handleLogin} type='primary'>登录</Button>
          <WhiteSpace/>
          <Button type='primary' onClick={this.register}>没有账号？请先注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default Login