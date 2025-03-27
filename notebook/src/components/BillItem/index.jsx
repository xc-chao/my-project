import React, { useEffect } from 'react';
import s from './style.module.less';
import PropTypes from 'prop-types';
import { Cell } from 'zarm';
import { typeMap } from '@/utils';
import CustomIcon from '@/components/CustomIcon';
import { useNavigate } from 'react-router-dom';

const BillItem = ({ bill }) => {
  const [expense, setExpense] = React.useState(0);
  const [income, setIncome] = React.useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const totalExpense = bill.bills
      .filter(item => item.pay_type === 1) // 支出
      .reduce((curr, item) => curr + Number(item.amount), 0);
    
    const totalIncome = bill.bills
      .filter(item => item.pay_type === 2) // 收入
      .reduce((curr, item) => curr + Number(item.amount), 0);

    setExpense(totalExpense);
    setIncome(totalIncome);
  }, [bill.bills]);

  const goToDetail = (item) => {
    navigate(`/detail/${item.id}`);
  } 

  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>
        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
            <span>¥{ expense.toFixed(2) }</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{ income.toFixed(2) }</span>
          </span>
        </div>
      </div>
      {bill.bills.map(item => (
        <Cell
          key={item.id}
          className={s.bill}
          onClick={() => goToDetail(item)}
          title={
            <>
              <CustomIcon 
                className={s.itemIcon}
                type={item.type_id ? typeMap[item.type_id].icon : 1}
              />
              <span>{ item.type_name }</span>
            </>
          }
          description={
            <span style={{color: item.pay_type === 2 ? 'red': '#39be77'}}>
              {`${item.pay_type === 1 ? '-' : '+'}${item.amount}`}
            </span>
          }
          help={<div>{item.date}</div>}
        />
      ))}
    </div>
  )
}

BillItem.propTypes = {
  bill: PropTypes.object
}

export default BillItem;