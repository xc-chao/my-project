import React, { useState, useEffect, useRef } from 'react';
import { Cell, Progress } from 'zarm';
import s from './style.module.less';
import CustomIcon from '@/components/CustomIcon';
import { typeMap } from '@/utils';
import Header from '@/components/Header';
import * as echarts from 'echarts';


const Data = () => {
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);

  const initPieChart = () => {
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const myChart = echarts.init(pieChartRef.current);
    chartInstance.current = myChart;

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['支出', '收入']
      },
      series: [
        {
          name: '收支情况',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: totalExpense, name: '支出', itemStyle: { color: 'rgb(90, 198, 90)' } },
            { value: totalIncome, name: '收入', itemStyle: { color: 'red' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  };

  useEffect(() => {
    // 模拟数据，实际项目中应该从API获取
    const mockData = [
      {
        type_id: 1,
        type_name: '餐饮',
        amount: 300,
        pay_type: 1
      },
      {
        type_id: 2,
        type_name: '购物',
        amount: 200,
        pay_type: 1
      },
      {
        type_id: 11,
        type_name: '工资',
        amount: 1000,
        pay_type: 2
      }
    ];

    const expense = mockData.filter(item => item.pay_type === 1);
    const income = mockData.filter(item => item.pay_type === 2);

    setTotalExpense(expense.reduce((acc, curr) => acc + curr.amount, 0));
    setTotalIncome(income.reduce((acc, curr) => acc + curr.amount, 0));
    setExpenseData(expense);
    setIncomeData(income);
    initPieChart();
  }, [totalExpense, totalIncome]);



  return (
    <>
      <Header title="数据统计" showLeft={false} />
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time}>
          <span>2023年12月</span>
        </div>
        <div className={s.expense}>
          <span>支出</span>
          <span>¥{totalExpense}</span>
        </div>
        <div className={s.income}>
          <span>收入</span>
          <span>¥{totalIncome}</span>
        </div>
      </div>
      <div className={s.structure}>
        <div className={s.title}>支出构成</div>
        <div className={s.content}>
          {expenseData.map(item => {
            const percent = (item.amount / totalExpense * 100).toFixed(2);
            return (
              <Cell
                key={item.type_id}
                className={s.cell}
                title={
                  <>
                    <CustomIcon
                      className={s.icon}
                      type={item.type_id ? typeMap[item.type_id].icon : 1}
                    />
                    <span className={s.type_name}>{item.type_name}</span>
                  </>
                }
                description={
                  <div className={s.progress}>
                    <Progress
                      shape="line"
                      percent={percent}
                      theme='primary'
                    />
                    <span className={s.percent}>{percent}%</span>
                  </div>
                }
                help={
                  <div className={s.amount}>¥{item.amount}</div>
                }
              />
            );
          })}
        </div>
      </div>
      <div className={s.pieChart}>
        <div className={s.title}>收支占比</div>
        <div ref={pieChartRef} className={s.chart}></div>
      </div>
    </div>
    </>
  );
};

export default Data;