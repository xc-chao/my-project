import React, { useState, useEffect } from "react"
import s from './style.module.less'
import { useNavigate } from 'react-router-dom'
import {
  Cell, Input, Button, Modal, Loading
} from 'zarm';
import { getUserInfo as getUserInfoUtil, get } from '@/utils'


const User = () => {
  const [signature, setSignature] = useState('')
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const getUserInfo = async () => {
    try {
      const { data } = await getUserInfoUtil();
      if (data) {
        setUser(data);
        setSignature(data.signature || '');
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return;
    }
    getUserInfo();
  }, [])

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className={s.user}>
        <div className={s.head}>
          <div className={s.info}>
            <span>昵称：{user.username}</span>
            <span>
              <img
                style={{ width: 30, height: 30, verticalAlign: '-10px' }}
                src="//s.yezgea02.com/1616032174786/cryptocurrency.png"
                alt=""
              />
              <b onClick={() => setShowSignatureModal(true)}>{user.signature || '这个家伙很懒，什么都没有留下'}</b>
            </span>
          </div>
          <img
            src={user.avatar || "https://p26-passport.byteacctimg.com/img/user-avatar/06b83e3cfbde35bd2e711fb625da50da~200x200.awebp"} alt=""
            className={s.avatar}
            style={{ width: 60, height: 60, borderRadius: 8 }}
          />
        </div>
        <div className={s.content}>
          <Cell
            hasArrow
            title="用户信息修改"
            onClick={() => { navigate('/userinfo') }}
            icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1616032174786/cryptocurrency.png" />}
          />
          <Cell
            hasArrow
            title="重置密码"
            onClick={() => { navigate('/reset-password') }}
            icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1616032174786/cryptocurrency.png" />}
          />
          <Cell
            hasArrow
            title="关于我们"
            onClick={() => { navigate('/about') }}
            icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1616032174786/cryptocurrency.png" />}
          />
        </div>
        <Button className={s.logout} block theme="danger" onClick={logout}>退出登录</Button>
        <Modal
          visible={showSignatureModal}
          title="标题"
          closable
          onCancel={() => { setShowSignatureModal(false) }}
          footer={
            <Button block theme="primary" onClick={() => { }}>
              确认
            </Button>
          }
        >
          <Input
            maxLength={50}
            type="text"
            row={3}
            value={signature}
            onChange={(value) => { setSignature(value) }}
            placeholder="请输入签名"
          />
        </Modal>
      </div>
    </>
  )
}

export default User