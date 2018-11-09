// 底部tab切换栏

import React from 'react'
import PropTypes from 'prop-types' // 属性检测：指定组件对外暴露的参数类型
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

@withRouter
class NavLinkBar extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired // selectAvatar属性是数组并且必传
  }

  render() {
    const navList = this.props.data.filter(v => !v.hide) // 过滤出hide为false的数据
    const pathname = this.props.location.pathname
    return (
      <TabBar>
        {navList.map(v => (
          <TabBar.Item
            key={v.path}
            title={v.text}
            icon={{uri: require(`./img/${v.icon}.png`)}}
            selectedIcon={{uri: require(`./img/${v.icon}-active.png`)}}
            selected={pathname === v.path}
            onPress={() => {
              this.props.history.push(v.path)
            }}
          >
          </TabBar.Item>
        ))}
      </TabBar>
    )
  }
}

export default NavLinkBar