// boss／牛人 列表页公共组件

import React from 'react'
import PropTypes from 'prop-types'
import {Card, WhiteSpace, WingBlank} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

@withRouter
class UserCard extends React.Component {
  static propTypes = {
    userlist: PropTypes.array.isRequired
  }

  handleClick(v) {
    this.props.history.push(`/chat/${v._id}`)
  }

  render() {
    return (
      <div>
        <WingBlank>
          {this.props.userlist.map(v => (
            v.avatar ? (<div key={v._id} onClick={() => this.handleClick(v)}>
              <WhiteSpace/>
              <Card>
                <Card.Header
                  title={v.user}
                  thumb={require(`../img/${v.avatar}.png`)}
                  extra={<span>{v.title}</span>}
                />
                <Card.Body>
                  {v.type === 'boss' ? <div>公司: {v.company}<WhiteSpace/></div> : null}
                  {v.desc.split('\n').map(vi => (
                    <div key={vi}>
                      {v.type === 'boss' ? '要求' : null} {vi}
                      <WhiteSpace/>
                    </div>
                  ))}
                  {v.type === 'boss' ? <div>薪资: {v.money}</div> : null}
                </Card.Body>
              </Card>
            </div>) : null
          ))}
        </WingBlank>
      </div>
    )
  }
}

export default UserCard