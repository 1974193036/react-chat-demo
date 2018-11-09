const mongoose = require('mongoose')

// 连接mongodb,并且使用imooc这个集合
const DB_URL = 'mongodb://localhost:27017/imooc-chat'
mongoose.connect(DB_URL)

// 检测是否连接成功
mongoose.connection.on('connected', function () {
  console.log('mongo connect success')
})

// 定义数据模型
const models = {
  user: {
    'user': {'type': String, 'require': true},
    'pwd': {'type': String, 'require': true},
    'type': {'type': String, 'require': true},
    // 头像
    'avatar': {'type': String},
    // 个人简介或者职位要求
    'desc': {'type': String},
    // 招聘职位
    'title': {'type': String},
    // 如果你是boss，还有 公司名称,职位薪资
    'company': {'type': String},
    'money':{'type': String}
  },
  chat: {}
}

for(let m in models) {
  mongoose.model(m,new mongoose.Schema(models[m]))
}

module.exports = {
  getModel: function (name) {
    return mongoose.model(name)
  }
}