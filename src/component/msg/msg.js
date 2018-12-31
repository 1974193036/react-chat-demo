import React from 'react'
import {Badge, List} from 'antd-mobile'
/*redux相关*/
import {connect} from 'react-redux'

@connect(
  state => state // 你要state什么属性放到props里面
)
class Msg extends React.Component {
  getLast(arr) {
    return arr[arr.length - 1]
  }

  render() {
    const Item = List.Item
    const Brief = Item.Brief
    const userid = this.props.user._id // 登录人id
    const userinfo = this.props.chat.users // 所有聊天用户


    console.log(this.props)
    // 按照聊天用户分组，根据chatid
    const msgGroup = {}
    this.props.chat.chatmsg.forEach(v => {
      msgGroup[v.chatid] = msgGroup[v.chatid] || []
      msgGroup[v.chatid].push(v)
    })
    console.log(msgGroup)
    // console.log(Object.values({name: 'xxx', age: 18})) // ["xxx", 18]

    // const chatList = Object.values(msgGroup)
    // 测试-根据最后一项排序
    // var test = [[1, 3, 2], [10, 20, 55], [33, 44, 15]].sort(function (a, b) {
    //   return b[b.length - 1] - a[a.length - 1]
    // })
    // console.log(test) // [[10, 20, 55], [33,44,15], [1, 3, 2]]

    const chatList = Object.values(msgGroup).sort((a, b) => {
      const a_last = this.getLast(a).create_time
      const b_last = this.getLast(b).create_time
      return b_last - a_last // 根据时间戳降序，最新的时间显示在上面
    })
    console.log(chatList) // 二维数组[[和张三信息],[和李四信息],[和王五信息]]


    return (
      <div>
        {chatList.map(v => {
          // console.log(v)
          const lastItem = this.getLast(v)
          // console.log(9)
          const targetId = v[0].from === userid ? v[0].to : v[0].from // 找出和谁对话，张三??
          const unreadNum = v.filter(vv => !vv.read && vv.to === userid).length

          if (!userinfo[targetId]) {
            return null
          }
          // const name = userinfo[targetId]?userinfo[targetId].name:''
          // const avatar = userinfo[targetId]?userinfo[targetId].avatar:''
          return (
            <List key={lastItem._id}>
              <Item
                key={lastItem._id}
                extra={<Badge text={unreadNum}></Badge>}
                thumb={require(`../img/${userinfo[targetId].avatar}.png`)}
                arrow="horizontal"
                onClick={() => {
                  this.props.history.push(`/chat/${targetId}`)
                }}
              >
                {lastItem.content}
                <Brief>{userinfo[targetId].name}</Brief>
              </Item>
            </List>
          )
        })}
      </div>
    )
  }
}

export default Msg