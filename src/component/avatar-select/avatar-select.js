// 选择头像页

import React from 'react'
import {Grid, List} from 'antd-mobile'
import PropTypes from 'prop-types' // 属性检测：指定组件对外暴露的参数类型

class AvatarSelect extends React.Component {
  static propTypes = {
    selectAvatar: PropTypes.func.isRequired  // selectAvatar属性是函数并且必传
  }

  constructor(props) {
    super(props)
    this.state = {
      icon: ''
    }
  }

  render() {
    const avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'.split(',')
      .map(v => ({
        icon: require(`../img/${v}.png`),
        text: v
      }))
    const gridHeader = this.state.icon ? (
      <div>
        <span>已选择头像</span>
        <img src={this.state.icon} style={{width: 20}} alt="头像"/>
      </div>
    ) : <div>请选择头像</div>
    return (
      <div>
        <List renderHeader={() => gridHeader}>
          <Grid
            data={avatarList}
            columnNum={5}
            activeStyle={true}
            onClick={
              elem => {
                this.setState({
                  icon: elem.icon
                })
                this.props.selectAvatar(elem.text)
              }
            }
          />
        </List>
      </div>
    )
  }
}

export default AvatarSelect