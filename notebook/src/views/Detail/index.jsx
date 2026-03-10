import React, { useEffect, useState } from "react";
import { useLocation, useParams } from 'react-router-dom';
import qs from 'query-string';
import { getBillDetail } from '@/api';
import Header from '@/components/Header';
import s from './style.module.less';
import CustomIcon from '@/components/CustomIcon';
import { typeMap } from '@/utils'; // 全局配置
import cx from 'classnames'; // 类名绑定

const Detail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    const getDetial = async () => {
        try {
            // 模拟接口返回数据
            const mockData = {
                id: 1,
                type_id: 1, // 餐饮
                type_name: '餐饮',
                pay_type: 1, // 1为支出，2为收入
                amount: 138.00,
                date: '2023-12-20',
                remark: '和同事聚餐'
            };
            setDetail(mockData);
        } catch (error) {
            setDetail({});
            console.error("请求失败", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDetial();
    }, [id]);

    if (loading) return <div className={s.loading}>加载中...</div>;
    if (!detail) return <div className={s.error}>数据加载失败</div>;


    return (
        <div className={s.detail}>
            <Header title="账单详情" />
            <div className={s.contentWrap}>
                <div className={s.card}>
                    <div className={s.type}>
                        <span className={cx({
                            [s.expense]: detail?.pay_type === 1,
                            [s.income]: detail?.pay_type === 2
                        })}>
                            <CustomIcon
                                className={s.iconfont}
                                type={typeMap[detail?.type_id]?.icon || 'qita'}
                            />
                        </span>
                        <span>{typeMap[detail?.type_id]?.name || '-'}</span>
                    </div>
                    <div className={s.amount}>
                        <span className={s.title}>金额</span>
                        <span>{detail.pay_type === 1 ? '-' : '+'}{detail.amount || '-'}</span>
                    </div>
                    <div className={s.date}>
                        <span className={s.title}>日期</span>
                        <span>{detail.date || '-'}</span>
                    </div>
                    <div className={s.remark}>
                        <span className={s.title}>备注</span>
                        <span>{detail.remark || '-'}</span>
                    </div>
                    <div className={s.operation}>
                        <span onClick={() => { }}>
                            <CustomIcon type="sc" /> 删除
                        </span>
                        <span onClick={() => { }}>
                            <CustomIcon type="bianji" /> 编辑
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail;