import React from 'react';
import s from './style.module.less';
import Header from '@/components/Header';

export default function About() {
  return (
    <>
    <Header title="关于我们"/>
    <div className={s.about}>
      <div className={s.content}>
        <div className={s.head}></div>
        <div className={s.title}>项目介绍</div>
        <div className={s.text}>
          这是一个使用React和Node.js开发的全栈记账本项目。该项目旨在帮助用户更好地管理个人财务，
          提供了简单易用的记账功能，包括收支记录、数据统计和账单管理等功能。
        </div>
        <div className={s.title}>技术栈</div>
        <div className={s.text}>
          前端：React、React Router、Less、Zarm UI
          <br />
          后端：Egg.js、Express、MySQL
          <br />
          部署：Docker
        </div>
      </div>
    </div>
    </>
  );
}
