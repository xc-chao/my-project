import React, {
  useState,
  useRef,
  useCallback,
  useEffect
} from 'react';
import {
  Cell,
  Input,
  Button,
  Checkbox,
  Toast
} from 'zarm';
import s from './style.module.less'
import cx from 'classnames';
import CustomIcon from '@/components/CustomIcon';
import { login, register } from '@/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState('');
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    document.title = type === 'login' ? '登录' : '注册'
  }, [type])

  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号');
      return;
    }
    if (!password) {
      Toast.show('请输入密码');
      return;
    }
    try {
      if (type == 'login') {
        const { data } = await login(username, password);
        localStorage.setItem('token', data.token);
        Toast.show('登录成功');
        navigate('/');
      } else {
        if (!verify) {
          Toast.show('请再次输入密码');
          return;
        }
        if (verify !== password) {
          Toast.show('两次输入的密码不一致');
          return;
        }
        if (!agree) {
          Toast.show('请阅读并同意条款');
          return;
        }
        const { data } = await register(username, password);
        Toast.show('注册成功');
        setType('login');
      }
    } catch (err) {
      Toast.show('系统错误');
    }
  }

  return (
    <form>
      <div className={s.auth}>
        <div className={s.head} />
        <div className={s.tab}>
          <span className={cx({ [s.active]: type == 'login' })} onClick={() => setType('login')}>登录</span>
          <span className={cx({ [s.active]: type == 'register' })} onClick={() => setType('register')}>注册</span>
        </div>
        <div className={s.form}>
          <Cell icon={<CustomIcon type="zhanghao" />}>
            <Input
              clearable
              type="text"
              placeholder='请输入账号'
              onChange={(value) => setUsername(value)}
            />
          </Cell>
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="password"
              placeholder='请输入密码'
              onChange={(value) => setPassword(value)}
            />
          </Cell>
          {type == "register" && (
            <Cell icon={<CustomIcon type="mima" />}>
              <Input
                clearable
                type="password"
                placeholder='请重复输入密码'
                onChange={(value) => setVerify(value)}
              />
            </Cell>
          )}
          <div className={s.operation}>
            {
              type == "register" && (
                <div className={s.agree}>
                  <Checkbox checked={agree} onChange={(value) => setAgree(value)} />
                  <label className="text-light">阅读并同意<a>《使用条款》</a></label>
                </div>
              )
            }
            <Button onClick={onSubmit} block theme="primary">{type == "login" ? "登录" : "注册"}</Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Login;