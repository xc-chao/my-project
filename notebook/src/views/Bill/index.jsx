import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'zarm';
import s from './style.module.less';
import BillItem from '@/components/BillItem';
import BillForm from '@/components/BillForm';
import { getBillList, addBill, deleteBill } from '@/api/bill';

const Bill = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 获取账单列表
  const fetchBillList = async () => {
    setLoading(true);
    try {
      const { data } = await getBillList();
      setList(data);
    } catch (error) {
      console.error('Failed to fetch bill list:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加账单
  const handleAddBill = async (values) => {
    try {
      await addBill(values);
      setShowForm(false);
      fetchBillList();
    } catch (error) {
      console.error('Failed to add bill:', error);
    }
  };

  // 删除账单
  const handleDeleteBill = async (id) => {
    try {
      await deleteBill(id);
      fetchBillList();
    } catch (error) {
      console.error('Failed to delete bill:', error);
    }
  };

  useEffect(() => {
    fetchBillList();
  }, []);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <Button
          theme="primary"
          onClick={() => setShowForm(true)}
        >
          新增账单
        </Button>
      </div>

      <div className={s.content}>
        {list.map((item) => (
          <BillItem
            key={item.date}
            bill={item}
            onDelete={handleDeleteBill}
          />
        ))}
      </div>

      <Modal
        visible={showForm}
        onClose={() => setShowForm(false)}
        title="新增账单"
      >
        <BillForm onSubmit={handleAddBill} />
      </Modal>
    </div>
  );
};

export default Bill;