// 牛人列表页

import React from 'react'
import UserCard from '../usercard/usercard'
/*redux相关*/
import {connect} from 'react-redux'
import {getUserList} from '../../redux/chatuser.redux'

@connect(
  state => state.chatuser, // 你要state什么属性放到props里面
  {getUserList} // 你要什么方法放到props里面，自动dispatch
)

class Boss extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     data: []
  //   }
  // }

  componentDidMount() {
    // axios.get('/user/list?type=genius').then(res => {
    //   if (res.data.code === 0) {
    //     this.setState({
    //       data: res.data.data
    //     })
    //   }
    // })
    this.props.getUserList('genius')
  }

  render() {
    // return (
    //   <div>
    //     <WingBlank>
    //       {this.props.userList.map(v => (
    //         v.avatar ? (<div key={v._id}>
    //           <WhiteSpace/>
    //           <Card>
    //             <Card.Header
    //               title={v.user}
    //               thumb={require(`../img/${v.avatar}.png`)}
    //               extra={<span>{v.title}</span>}
    //             />
    //             <Card.Body>
    //               {v.desc.split('\n').map(v => (
    //                 <div key={v}>
    //                   {v}
    //                   <WhiteSpace/>
    //                 </div>
    //               ))}
    //             </Card.Body>
    //           </Card>
    //         </div>) : null
    //       ))}
    //     </WingBlank>
    //   </div>
    // )
    return <UserCard userlist={this.props.userList}></UserCard>
  }
}

export default Boss