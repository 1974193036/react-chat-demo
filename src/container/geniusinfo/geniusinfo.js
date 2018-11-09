import React from 'react'
import {Button, InputItem, List, NavBar, TextareaItem, WhiteSpace} from 'antd-mobile'
import AvatarSelect from '../../component/avatar-select/avatar-select'
import {Redirect} from 'react-router-dom'
/*redux相关*/
import {connect} from 'react-redux'
import {update} from '../../redux/user.redux'

@connect(
  state => state.user, // 你要state什么属性放到props里面
  {update} // 你要什么方法放到props里面，自动dispatch
)

class GeniusInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar: '',
      title: '',
      desc: ''
    }
    this.updateGenius = this.updateGenius.bind(this)
  }

  handleChange(key, val) {
    this.setState({
      [key]: val
    })
  }

  updateGenius() {
    console.log(this.state)
    this.props.update(this.state)
  }

  render() {
    const path = this.props.location.pathname
    const redirect = this.props.redirectTo
    return (
      <div>
        {redirect && redirect !== path ? <Redirect to={this.props.redirectTo}/> : null}
        <NavBar mode="dark">牛人完善信息页面</NavBar>
        <AvatarSelect
          selectAvatar={imgName => {
            this.setState({
              avatar: imgName
            })
          }}
        ></AvatarSelect>
        <WhiteSpace/>
        <List>
          <InputItem onChange={(v) => this.handleChange('title', v)}>
            求职岗位
          </InputItem>
          <TextareaItem
            rows={3}
            autoHeight
            title="个人简介"
            onChange={(v) => this.handleChange('desc', v)}>
          </TextareaItem>
        </List>
        <WhiteSpace/>
        <Button
          type="primary"
          onClick={this.updateGenius}
        >保存</Button>
      </div>
    )
  }
}

export default GeniusInfo