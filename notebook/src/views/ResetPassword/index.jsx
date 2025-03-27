import React, { useState } from 'react';
import { Cell, Input, Button, Toast } from 'zarm';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '@/api/user';
import style from './style.module.less';
import Header from '@/components/Header';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 密码格式验证
  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      Toast.show('密码长度不能小于6位');
      return false;
    }
    return true;
  }

  // 提交重置密码
  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Toast.show('请输入密码');
      return;
    }
    if (password !== confirmPassword) {
      Toast.show('两次输入的密码不一致');
      return;
    }
    if (!validatePassword(password)) {
      return;
    }

    try {
      await resetPassword({ password });
      Toast.show('密码重置成功');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      Toast.show('密码重置失败');
    }
  }


  return (
    <>
      <form>
        <Header title="重置密码" />
        <div className={style.auth}>
          <div className={style.head}></div>
          <div className={style.form}>
            <Cell title="新密码">
              <Input
                clearable
                type="password"
                placeholder="请输入新密码"
                onChange={(value) => setPassword(value)}
              />
            </Cell>
            <Cell title="确认密码">
              <Input
                clearable
                type="password"
                placeholder="请再次输入新密码"
                onChange={(value) => setConfirmPassword(value)}
              />
            </Cell>
          </div>
          <div className={style.operation}>
            <Button block theme="primary" onClick={handleSubmit}>
              确认重置
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default ResetPassword;