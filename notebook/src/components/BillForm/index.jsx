import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button } from 'zarm';
import s from './style.module.less';
import { typeMap } from '@/utils';

const BillForm = ({ onSubmit, initialValues = {} }) => {
  const [form] = Form.useForm();
  const [payType, setPayType] = useState(initialValues.pay_type || 1);

  const typeOptions = Object.entries(typeMap).map(([id, { name }]) => ({
    label: name,
    value: parseInt(id)
  }));

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        pay_type: payType,
        amount: String(values.amount)
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <div className={s.form}>
      <Form
        form={form}
        initialValues={{
          ...initialValues,
          date: initialValues.date ? new Date(initialValues.date) : new Date()
        }}
      >
        <Form.Item label="类型" name="type_id">
          <Select
            placeholder="请选择账单类型"
            options={typeOptions}
          />
        </Form.Item>

        <Form.Item label="金额" name="amount">
          <Input 
            type="number"
            placeholder="请输入金额"
          />
        </Form.Item>

        <Form.Item label="日期" name="date">
          <DatePicker
            placeholder="请选择日期"
            mode="date"
          />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input
            type="text"
            placeholder="请输入备注"
          />
        </Form.Item>

        <div className={s.typeWrap}>
          <div className={s.type}>
            <span 
              onClick={() => setPayType(1)}
              className={payType === 1 ? s.active : ''}
            >
              支出
            </span>
            <span 
              onClick={() => setPayType(2)}
              className={payType === 2 ? s.active : ''}
            >
              收入
            </span>
          </div>
        </div>

        <div className={s.btnWrap}>
          <Button block theme="primary" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BillForm;