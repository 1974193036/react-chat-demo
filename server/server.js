const express = require('express')


// 针对 post() 引入
const bodyParser = require('body-parser')

// 引入 cookie-parser
const cookieParser = require('cookie-parser')


const userRouter = require('./user')


// 新建app
const app = express()

// 可以解析cookie
app.use(cookieParser())
// 可以解析post的数据
app.use(bodyParser.json())


app.use('/user', userRouter)


// const mongoose = require('mongoose')
//
// // 连接mongodb,并且使用imooc这个集合
// const DB_URL = 'mongodb://localhost:27017/imooc'
// mongoose.connect(DB_URL)
// // 检测是否连接成功
// mongoose.connection.on('connected', function () {
//   console.log('mongo connect success')
// })

// app.get('/', function (req, res) {
//   res.send('<h1>Hello world</h1>')
// })

app.listen(9093, function () {
  console.log('Node app start at port 9093')
})