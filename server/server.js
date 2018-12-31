const path = require('path')

const model = require('./model')
const Chat = model.getModel('chat')
// const express = require('express')
/** 利用 babel-cli(npm install babel-cli --save) 支持es6语法
 require 可以写成 import 形式
 package.json内设置 "server": "NODE_ENV=test nodemon --exec babel-node server/server.js",
 npm run server 启动项目
 */
import express from 'express'
/** 服务端渲染：
 利用新建 .babelrc 文件，支持react的jsx语法
 利用renderToString, renderToStaticMarkup, 可以把react组件变成div等html元素

 改造此项目：保证客户端运行正常到情况下, 把index.js的内容复制到server端

 处理css问题：
 1.npm install css-modules-require-hook --save,
 import csshook from 'css-modules-require-hook/preset'放最上面
 2.根目录新建cmrh.conf.js

 处理图片问题：
 1.npm install asset-require-hook --save
 import assethook from 'asset-require-hook'
 2.assethook({extensions: ['png']})

 加入页面骨架, 便于做SEO
 `<!DOCTYPE html><html lang="en"><head><......


 */
import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'
assethook({
  extensions: ['png']
})
import React from 'react'
import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {StaticRouter} from 'react-router-dom' // 路由组件，在服务端使用 StaticRouter
import reducers from '../src/reducer'
import App from '../src/app'


import {renderToStaticMarkup, renderToString, renderToNodeStream} from 'react-dom/server' // 把react组件变成html元素
import staticPath from '../build/asset-manifest.json' // 引入静态资源


// 针对 post() 引入
const bodyParser = require('body-parser')

// 引入 cookie-parser
const cookieParser = require('cookie-parser')

// 新建app
const app = express()


// work width express
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', function (socket) {
  // console.log('user login')
  socket.on('sendmsg', function (data) {
    // console.log(data)
    // // 把数据广播到全局
    // io.emit('recvmsg', data)

    const {from, to, msg} = data
    const chatid = [from, to].sort().join('-')
    Chat.create({chatid, from, to, content: msg}, function (err, doc) {
      io.emit('recvmsg', Object.assign({}, doc._doc))
    })
  })
})


const userRouter = require('./user')


// 可以解析cookie
app.use(cookieParser())
// 可以解析post的数据
app.use(bodyParser.json())

app.use('/user', userRouter)



function HelloMessage() {
  return <h1>Hello World! hi!</h1>
}

// console.log(renderToString(<HelloMessage/>)) // <h1 data-reactroot="">Hello World!</h1>


/** 项目打包部署方法：
 编译打包后(npm run build)，生成build目录
 express中间件，拦截路由，手动渲染index.html
 build设置成静态资源地址
 */
app.use(function (req, res, next) {
  if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
    return next()
  }
  /**项目打包部署(客户端渲染)*/
    // console.log(path.resolve('build/index.html')) // 绝对路径：/demo/react-my-app/build/index.html
    // return res.sendFile(path.resolve('build/index.html'))


  const store = createStore(reducers, compose(
    applyMiddleware(thunk)
    ))

  const obj = {
    '/msg': 'React聊天消息列表',
    '/boss': 'boss查看牛人列表页面'
  }

  /**renderToString方法(服务端渲染)*/
  // let context = {}
  // const markup = renderToString(
  //   (<Provider store={store}>
  //     <StaticRouter location={req.url} context={context}>
  //       <App></App>
  //     </StaticRouter>
  //   </Provider>)
  // )
  // const pageHtml = `<!DOCTYPE html>
  // <html lang="en">
  // <head>
  // <meta charset="utf-8">
  // <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  // <meta name="theme-color" content="#000000">
  // <meta name='keywords' content='Reacr,Redux,Imooc,聊天,ssr'>
  // <meta name='description' content='${obj[req.url]}'>
  // <title>React App</title>
  // <link rel="stylesheet" href="/${staticPath['main.css']}">
  // </head>
  // <body>
  //   <div id="root">${markup}</div>
  //   <script src="/${staticPath['main.js']}"}></script>
  // </body>
  // </html>`
  // res.send(pageHtml)


  /**renderToNodeStream方法(服务端渲染)*/
  res.write(`<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <meta name='keywords' content='Reacr,Redux,Imooc,聊天,ssr'>
  <meta name='description' content='${obj[req.url]}'>
  <title>React App</title>
  <link rel="stylesheet" href="/${staticPath['main.css']}">
  </head>
  <body>
    <div id="root">`)

  let context = {}
  const markupStream = renderToNodeStream(
    (<Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App></App>
      </StaticRouter>
    </Provider>)
  )
  markupStream.pipe(res, {end: false})
  markupStream.on('end', () => {
    res.write(`</div>
    <script src="/${staticPath['main.js']}"}></script>
  </body>
  </html>`)
    res.end()
  })



  /**简易版服务端渲染如下*/
  // return res.send('<h1 data-reactroot="">Hello World!</h1>')
  // return res.send(renderToString(<HelloMessage/>))

})
app.use('/', express.static(path.resolve('build')))

// 上线
// 购买域名
// DNS解析到服务器IP
// 安装nginx
// 使用 pm2 管理node进程


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

server.listen(9093, function () {
  console.log('Node app start at port 9093')
})