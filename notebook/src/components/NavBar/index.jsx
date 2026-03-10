import React, { useState, useEffect } from 'react';
import { TabBar } from 'zarm';
import s from './style.module.less';
// 有哪些类型
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomIcon from '@/components/CustomIcon';

const NavBar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState('/');
  const navigateTo = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  const changeTab = (path) => {
    setActiveKey(path)
    navigateTo(path)
  }

  return (
    <TabBar className={s.tab} visible={showNav} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="zhangdan"/>}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type="tongji"/>}
      />
      <TabBar.Item
        itemKey="/llm"
        title="AI"
        icon={<CustomIcon type="xuexi"/>}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="wode"/>}
      />
    </TabBar>
  );
};
// vue defineProps 
// react 申明组件的类型
NavBar.propTypes = {
  showNav: PropTypes.bool
}

export default NavBar;