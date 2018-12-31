import React from 'react'
import ReactDOM from 'react-dom'
import {applyMiddleware, compose, createStore} from 'redux' // 使用applyMiddleware开启thunk中间件 做异步处理
import thunk from 'redux-thunk' // redux-thunk处理异步, redux的chrome插件：使用compose结合thunk和window.devToolsExtension
import {Provider} from 'react-redux' // 使用react-redux优化
import {BrowserRouter, Route, Switch} from 'react-router-dom' // 路由组件
// import Login from './container/login/login'
// import Register from './container/register/register'
// import BossInfo from './container/bossinfo/bossinfo'
// import GeniusInfo from './container/geniusinfo/geniusinfo'
// import AuthRoute from './component/authroute/authroute'
// import Dashboard from './component/dashboard/dashboard'
// import Chat from './component/chat/chat'
/**
 * 针对服务端渲染 改造 客户端代码
 * 引入app.js
 */
import App from './app'

import reducers from './reducer' // 合并的reducer
import './config' // 设置axios拦截器
import './index.css' // 引入css

/*多个reducer*/
const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))


// 页面有boss genius me msg 4个页面
// ReactDOM.render(
// ReactDOM.render改成ReactDOM.hydrate，配合服务端renderToNodeStream渲染
ReactDOM.hydrate(
  (<Provider store={store}>
    <BrowserRouter>
      {/*<div>*/}
        {/*<AuthRoute></AuthRoute>*/}
        {/*<Switch>*/}
          {/*<Route path='/bossinfo' component={BossInfo}></Route>*/}
          {/*<Route path='/geniusinfo' component={GeniusInfo}></Route>*/}
          {/*<Route path='/login' component={Login}></Route>*/}
          {/*<Route path='/register' component={Register}></Route>*/}
          {/*<Route path='/chat/:user' component={Chat}></Route>*/}
          {/*<Route component={Dashboard}></Route>*/}
        {/*</Switch>*/}
      {/*</div>*/}
      <App/>
    </BrowserRouter>
  </Provider>),
  document.getElementById('root')
)
