import React, { useEffect, useState } from 'react'
// 前后端分离 前端独立的路由功能
import {
  // es6 模块化语法
  // BrowserRouter as Router, // hash #, history /
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import routes from '@/router'
import { ConfigProvider } from 'zarm';
import 'zarm/dist/zarm.css'; // vite-plugin-style-import 自动引入css
import NavBar from './components/NavBar';
import s from './App.module.less';
import { uploadAvatar } from '@/api';

export default function App() {

  const [showNav, setShowNav] = useState(false)
  const needNav = ['/', '/data', '/user', '/llm'];
  const { pathname } = useLocation(); // 路由切换的路径
  // console.log(location);
  // 当url 切换为/user 的时候 showNav false 
  useEffect(() => {
    // 当前路径 
    // 是否在needNav中
    setShowNav(
      needNav.includes(pathname)
    )
  }, [pathname])

  // useEffect(() => {
  //   (async () => {
  //     await uploadAvatar();
  //   })()
  // }, [])

  return (
    <ConfigProvider primaryColor='#007fff'>
      <div className={s.app}>
        <Routes>
          { routes.map(route => <Route key={route.path} path={route.path} element={<route.component />}/>)}
        </Routes>
        <NavBar showNav={showNav} />
      </div>
    </ConfigProvider>
  )
}


