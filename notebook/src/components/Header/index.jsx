import React from 'react';
import { NavBar } from 'zarm';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less';

const Header = ({ title = '', showLeft = true }) => {
  const navigate = useNavigate();
  return (
    <div className={s.headerWrap}>
      <NavBar
        className={s.header}
        left={showLeft ? <span onClick={() => navigate(-1)}>返回</span> : null}
        title={title}
      />
    </div>
  );
};

export default Header;