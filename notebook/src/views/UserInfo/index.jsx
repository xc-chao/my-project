import React, { useEffect, useState } from 'react';
import { Button, FilePicker, Input, Toast } from 'zarm';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import axios from 'axios';
import { 
  getUserInfo as getUser,
  updateSignature
} from '@/api'
import { get, post } from '@/utils'
import { baseUrl } from '@/config'
import s from './style.module.less';

const UserInfo = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState('')
  const [signature, setSignature] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await getUser();
    setUser(data);
    setAvatar(data.avatar)
    setSignature(data.signature)
  };

  const handleSelect = (file) => {
    console.log('file.file', file.file)
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不得超过 200 KB！！')
      return
    }
    let formData = new FormData()
    formData.append('file', file.file)
    axios({
      method: 'post',
      url: `/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }).then(res => {
      if (res.data.code === 200) {
        console.log(res.data, '////////')
        // setAvatar 是一个函数，用于更新组件的状态，将上传的头像 URL 存储在组件的状态中
        setAvatar(res.data.avatarUrl)
        Toast.show('头像上传成功')
      } else {
        Toast.show('头像上传失败')
      }
    }).catch(err => {
      Toast.show('头像上传失败')
      console.error(err)
    })
  }

  const save = async () => {
    try {
      const { data } = await updateSignature(signature);
      if (data.code === 200) {
        Toast.show('修改成功')
        navigate(-1)
      } else {
        Toast.show(data.msg || '修改失败')
      }
    } catch (error) {
      Toast.show('修改失败')
      console.error(error)
    }
  }

  return <>
    <Header title='用户信息' />
    <div className={s.userinfo}>
      <h1>个人资料</h1>
      <div className={s.item}>
        <div className={s.title}>头像</div>
        <div className={s.avatar}>
          <img className={s.avatarUrl} src={avatar} alt=""/>
          <div className={s.desc}>
            <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
            <FilePicker className={s.filePicker} onChange={handleSelect} accept="image/*">
              <Button className={s.upload} theme='primary' size='xs'>点击上传</Button>
            </FilePicker>
          </div>
        </div>
      </div>
      <div className={s.item}>
        <div className={s.title}>个性签名</div>
        <div className={s.signature}>
          <Input
            clearable
            type="text"
            value={signature}
            placeholder="请输入个性签名"
            onChange={(value) => setSignature(value)}
          />
        </div>
      </div>
      <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>保存</Button>
    </div>
  </>
};

export default UserInfo;