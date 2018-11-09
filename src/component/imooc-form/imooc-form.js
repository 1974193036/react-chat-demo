// 高阶组件
// 处理输入框输入文字改变state

import React from 'react'

export function imoocForm(Comp) {
  return class WrapperHello extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange(key, val) {
      this.setState({
        [key]: val
      })
    }

    render() {
      return <Comp handleChange={this.handleChange} state={this.state} {...this.props}></Comp>
    }
  }
}