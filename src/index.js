import React from 'react'
import ReactDOM from 'react-dom'
import {applyMiddleware, compose, createStore} from 'redux' // 使用applyMiddleware开启thunk中间件 做异步处理
import thunk from 'redux-thunk' // redux-thunk处理异步, redux的chrome插件：使用compose结合thunk和window.devToolsExtension
import {Provider} from 'react-redux' // 使用react-redux优化
import {BrowserRouter, Route, Switch} from 'react-router-dom' // 路由组件
import Login from './container/login/login'
import Register from './container/register/register'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import AuthRoute from './component/authroute/authroute'
import Dashboard from './component/dashboard/dashboard'


import reducers from './reducer' // 合并的reducer
import './config' // 设置axios拦截器
import './index.css' // 引入css

/*多个reducer*/
const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))


// 页面有boss genius me msg 4个页面
ReactDOM.render(
  (<Provider store={store}>
    <BrowserRouter>
      <div>
        <AuthRoute></AuthRoute>
        <Switch>
          <Route path='/bossinfo' component={BossInfo}></Route>
          <Route path='/geniusinfo' component={GeniusInfo}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/register' component={Register}></Route>
          <Route component={Dashboard}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>),
  document.getElementById('root')
)
