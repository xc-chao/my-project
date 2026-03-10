import React, { useState, useCallback } from "react";
import s from './style.module.less';
import { Icon } from 'zarm';
import BillItem from '@/components/BillItem';
import useStore from '@/store';
import CustomIcon from '@/components/CustomIcon';
import { typeMap } from '@/utils';

const Home = () => {
  const [showTypePopup, setShowTypePopup] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState('');

  const { originList, list, setList } = useStore();

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const performSearchWithEmbeddings = async () => {
    if (keyword.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });

      const data = await response.json();
      if (data.status === 200) {
        setSearchResults(data.data);
      } else {
        console.error('Search failed:', data.message);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const debouncedSearch = useCallback(debounce(performSearchWithEmbeddings, 500), [keyword]);

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.typeWrap}>
          <div className={s.searchWrap}>
            <input
              className={s.search}
              placeholder="AI搜索"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                debouncedSearch();
              }}
            />
          </div>
          <div className={s.left}>
            <span className={s.title} onClick={() => setShowTypePopup(true)}>类型<Icon className={s.arrow} type="arrow-bottom"/></span>
          </div>
          <div className={s.right}>
            <span className={s.time} onClick={() => setShowDatePopup(true)}>{selectedMonth}<Icon className={s.arrow} type="arrow-bottom"/></span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {keyword.trim() === '' ? (
          (list.length ? list : originList).map((item) => <BillItem key={item.date} bill={item}/>)
        ) : (
          searchResults.map(result => (
            <BillItem key={result.id} bill={{
              date: result.date,
              bills: [{
                amount: result.amount,
                date: result.date,
                id: result.id,
                pay_type: result.pay_type, // Assuming you have this in your search results
                type_id: result.type_id, // Assuming you have this in your search results
                type_name: result.type_name,
                remark: result.remark || "", // Assuming you have this in your search results
              }]
            }} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;