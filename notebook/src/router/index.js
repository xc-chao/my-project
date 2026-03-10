import Home from '@/views/Home'
import Data from '@/views/Data'
import User from '@/views/User'
import Login from '@/views/Login'
import UserInfo from '@/views/UserInfo'
import Detail from '@/views/Detail'
import ResetPassword from '@/views/ResetPassword'
import About from '@/views/About'
import Llm from '@/views/Llm'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/data',
    component: Data
  },
  {
    path: '/user',
    component: User
  },
  {
    path: '/userinfo',
    component: UserInfo
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/reset-password',
    component: ResetPassword
  },
  {
    path:'/detail/:id',
    component: Detail
  },
  {
    path:'/about',
    component: About
  },
  {
    path:'/llm',
    component: Llm
  }
  
]

export default routes