import React from 'react'
import {Icon, InputItem, List, NavBar, Grid} from 'antd-mobile'
import {getChatId} from '../../util'
// import io from 'socket.io-client'
/*redux相关*/
import {connect} from 'react-redux'
import {getMsgList, recvMsg, sendMsg, readMsg} from '../../redux/chat.redux'
// 动画
import QueueAnim from 'rc-queue-anim'


// const socket = io('ws://localhost:9093')

@connect(
  state => state, // 你要state什么属性放到props里面
  {getMsgList, sendMsg, recvMsg, readMsg}
)
class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      // msg: []
    }
  }

  componentDidMount() {
    // socket.on('recvmsg', (data) => {
    //   console.log(data) // 如{text: 'hello'}
    //   this.setState({
    //     msg: [...this.state.msg, data.text]
    //   })
    // })
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
    // const to = this.props.match.params.user // 和谁对话
    // this.props.readMsg(to)
  }

  componentWillUnmount() {
    // 离开当前页面的时候 调用读取消息接口
    // console.log('在组件从 DOM 中移除的时候立刻被调用')
    const to = this.props.match.params.user // 和谁对话
    this.props.readMsg(to)
  }

  // 修复grid加入轮播效果只显示一行的bug
  fixCarousel() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 0)
  }

  handleSubmit() {
    // console.log(this.state.text)
    // socket.emit('sendmsg', {text: this.state.text})
    // this.setState({
    //   text: ''
    // })
    const from = this.props.user._id // 当前登录人id
    const to = this.props.match.params.user // 发送目标的人id
    const msg = this.state.text

    this.props.sendMsg({from, to, msg})
    this.setState({
      text: '',
      showEmoji: false
    })
  }

  render() {
    const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ 🤘 👌 👈 👉 👆 👇 ✋  🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 👁 👀'
      .split(' ')
      .filter(v => v)
      .map(v => ({
        text: v
      }))
    const Item = List.Item
    const userid = this.props.match.params.user
    const users = this.props.chat.users
    if (!users[userid]) {
      return null
    }

    const chatid = getChatId(this.props.user._id, userid)
    const chatmsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)

    return (
      <div id='chat-page'>
        <NavBar
          className="fixd-header"
          mode='dark'
          icon={<Icon type='left'/>}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          {/*{users[userid] ? users[userid].name : null}*/}
          {users[userid].name}
        </NavBar>
        <div style={{marginTop: 45,marginBottom: 60}}>
          <QueueAnim delay={100} type='top'>
            {chatmsgs.map(v => {
              const avatar = require(`../img/${users[v.from].avatar}.png`)
              return v.from === userid ? (
                // 对方发的文字靠左：
                <List key={v._id}>
                  <Item
                    thumb={avatar}
                  >{v.content}</Item>
                </List>
              ) : (
                // 我发的文字靠右：
                <List key={v._id}>
                  <Item
                    extra={<img src={avatar} alt='头像'/>}
                    className='chat-me'
                  >{v.content}</Item>
                </List>
              )
            })}
          </QueueAnim>
        </div>
        <div className="stick-footer">
          <List>
            <InputItem
              placeholder='请输入'
              value={this.state.text}
              onChange={v => {
                this.setState({text: v})
              }}
              extra={
                <div>
                  <span style={{marginRight: 15}}
                    onClick={() => {
                      this.setState({
                        showEmoji: !this.state.showEmoji
                      })
                      this.fixCarousel()
                    }}>{'😃'}</span>
                  <span onClick={() => this.handleSubmit()}>发送</span>
                </div>
              }
            ></InputItem>
          </List>
          {this.state.showEmoji ? <Grid
            style={{touchAction: 'none'}}
            data={emoji}
            columnNum={9}
            carouselMaxRow={4}
            isCarousel={true}
            onClick={el => {
              this.setState({
                text: this.state.text + el.text
              })
            }}
          /> : null}
        </div>
      </div>
      // console.log(this.props)
      // <h1>chat width user: {this.props.match.params.user}</h1>
    )
  }
}

export default Chat