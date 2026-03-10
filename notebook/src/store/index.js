import {create} from 'zustand';

// 定义 Zustand store
const useStore = create((set) => ({
  originList: [
    {
      date: '2020-12-20',
      bills: [
        {
          amount: "21.53",
          date: "2020-12-20T00:00:00",
          id: 1,
          pay_type: 1,
          remark: "",
          type_id: 1,
          type_name: "餐饮"
        },
        {
          amount: "11.78",
          date: "2020-12-20T22:28:00",
          id: 2,
          pay_type: 1,
          remark: "",
          type_id: 1,
          type_name: "餐饮"
        },
        {
          amount: "9.75",
          date: "2020-12-20T22:28:00",
          id: 3,
          pay_type: 1,
          remark: "",
          type_id: 1,
          type_name: "餐饮"
        },
        {
          amount: "25.80",
          date: "2020-12-20T22:35:00",
          id: 4,
          pay_type: 2,
          remark: "",
          type_id: 11,
          type_name: "工资"
        }
      ]
    },
    {
      date: '2020-12-09',
      bills: [
        {
          amount: "25.00",
          date: "2020-12-09T09:59:00",
          id: 5,
          pay_type: 1,
          remark: "我是备注",
          type_id: 1,
          type_name: "餐饮"
        },
        {
          amount: "2508.00",
          date: "2020-12-09T00:00:00",
          id: 6,
          pay_type: 1,
          remark: "",
          type_id: 6,
          type_name: "学习"
        },
        {
          amount: "120.00",
          date: "2020-12-09T00:00:00",
          id: 7,
          pay_type: 1,
          remark: "",
          type_id: 1,
          type_name: "餐饮" 
        },
        {
          amount: "25.80",
          date: "2020-12-09T22:35:00",
          id: 8,  
          pay_type: 2,
          remark: "",
          type_id: 11,
          type_name: "工资" 
        }
      ]
    }
  ],
  list: [], // 过滤后的数据
  setList: (newList) => set({ list: newList }), // 更新 list 的方法
}));

export default useStore;
