// md5加密密码
const utility = require('utility')

const express = require('express')
const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')
const _filter = {'pwd': 0, '__v': 0}  // 设置 {'pwd': 0}，表示返回不显示pwd的字段

Router.get('/list', function (req, res) {
  // [新增数据  create()]
  // User.create({
  //   user: '李四5',
  //   age: 288
  // }, function (err, doc) {
  //   if (!err) {
  //     console.log(doc)
  //   } else {
  //     console.log(err)
  //   }
  // })

  // [删除age=18的数据  remove()]
  // User.remove({age: 288}, function (err, doc) {
  //   console.log(doc)
  // })

  // [更新数据  update()]
  // 把 李四 的 age 改成28
  // User.update({'user': '李四'}, {'$set': {age: 28}}, function (err, doc) {
  //   console.log(doc)
  // })

  // 查找所有数据
  // User.find(function (err, doc) {
  //   return res.json(doc)
  // })

  const type = req.query.type
  // 查找 /user/list?type=genius或者boss的数据
  User.find({type: type}, function (err, doc) {
    return res.json({code: 0, data: doc})
  })
})

// 清空聊天信息
// Chat.remove({}, function (err, doc) {
//   console.log(doc)
// })
Router.get('/getmsglist', function (req, res) {
  const user = req.cookies.userID

  User.find({}, function (err, userdoc) {
    let users = {}
    userdoc.forEach(function (v) {
      users[v._id] = {name: v.user, avatar: v.avatar}
    })
    Chat.find({'$or': [{from: user}, {to: user}]}, function (err, doc) {
      if (!err) {
        return res.json({code: 0, msgs: doc, users: users})
      }
    })
  })
})


Router.post('/readmsg', function (req, res) {

  // console.log(req.body) // { from: '5bbb2f131c2a9807584d9663' }
  const {from} = req.body // 获取传递的参数，发送人
  // console.log(from) // '5bbb2f131c2a9807584d9663'

  const userID = req.cookies.userID
  // console.log(userID) // 登录人id

  // {'multi': true}查出并更新所有数据，否则只会更新第一条查出的数据
  Chat.update({from, to: userID}, {'$set': {read: true}}, {'multi': true},function (err, doc) {
    // console.log(doc) // { n: 5, nModified: 5, ok: 1 }，修改了几条数据
    if (err) {
      return res.json({code: 1, msg: '修改失败'})
    }
    return res.json({code: 0, num: doc.nModified})
  })
})

Router.post('/update', function (req, res) {
  const userID = req.cookies.userID
  if (!userID) {
    return res.dumps({code: 1})
  }
  const body = req.body // 获取接收到的参数集合，如{avatar: "man", title: "1", company: "2", money: "3", desc: "4"}
  // 查找并且更新数据库
  User.findByIdAndUpdate(userID, body, function (err, doc) {
    const data = Object.assign({}, {
      user: doc.user,
      type: doc.type
    }, body)
    return res.json({code: 0, data: data})
  })
})

Router.post('/login', function (req, res) {
  const {user, pwd} = req.body

  User.findOne({user, pwd: md5Pwd(pwd)}, _filter, function (err, doc) {
    if (!doc) {
      return res.json({code: 1, msg: '用户名或者密码错误'})
    }

    // 登录成功之后,设置cookie
    res.cookie('userID', doc._id)

    // 返回登录成功之后的数据
    return res.json({code: 0, data: doc})
  })
})

Router.post('/register', function (req, res) {
  console.log(req.body) // {user: 'imooc',pwd: 123,type:'boss'}
  const {user, pwd, type} = req.body // 即 user='imooc',pwd=123,type='boss'
  User.findOne({user: user}, function (err, doc) {
    if (doc) {
      return res.json({code: 1, msg: '用户名重复'})
    }

    const userModel = new User({user, type, pwd: md5Pwd(pwd)})
    userModel.save(function (err, doc) {
      if (err) {
        return res.json({code: 1, msg: '服务端出错'})
      }
      // 注册成功后如同登录，加cookie自动登录
      const {user, type, _id} = doc
      res.cookie('userID', _id)

      return res.json({code: 0, msg: '注册成功', data: {user, type, _id}})
    })


    // User.create({
    //   user: user,
    //   // pwd: utility.md5(pwd), // 简单md5加密
    //   pwd: md5Pwd(pwd),
    //   type: type,
    // }, function (err, doc) {
    //   if (err) {
    //     return res.json({code: 1, msg: '服务端出错了'})
    //   }
    //   return res.json({code: 0, msg: '注册成功'})
    // })
  })

})

// 如果密码复杂度太低，加密的时候自己可以先在密码上加一大串复杂的字符串 (加盐)
// 可以使用两层md5加盐
// 从而让简单的密码变成复杂的密文
function md5Pwd(pwd) {
  const salt = 'imooc_is_good_3957x8yza6!@#IUHJh';
  return utility.md5(utility.md5(pwd + salt))
}


Router.get('/info', function (req, res) {
  // 用户有没有cookie,有没有登录状态
  // 0-success, 1-fail
  const {userID} = req.cookies

  if (!userID) {
    return res.json({code: 1})
  }

  User.findOne({_id: userID}, _filter, function (err, doc) {
    if (err) {
      return res.json({code: 1, msg: '服务端出错'})
    }
    if (doc) {
      // return res.json({code: 0})
      return res.json({code: 0, data: doc})
    }
  })

  // return res.json({code: 1})
  // return res.json({code: 0})
})

module.exports = Router