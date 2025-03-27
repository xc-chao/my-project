import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.less';
import Header from '@/components/Header';

const MESSAGE_LIMIT = 50;
// 修改为使用 import.meta.env
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const Llm = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatLogRef = useRef(null);
  const backToTopRef = useRef(null);
  const [temperature, setTemperature] = useState(0.7);
  const [model, setModel] = useState('deepseek-chat');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // 消息处理逻辑
  const typeMessage = useCallback((content, callback) => {
    let index = 0;
    const intervalId = setInterval(() => {
      setMessages(prev => {
        if (index >= content.length) {
          clearInterval(intervalId);
          callback?.();
          return prev;
        }

        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage) {
          lastMessage.content = content.substring(0, index + 1);
        }
        return newMessages;
      });
      index++;
    }, 50);
  }, []);

  const handleCopy = useCallback(async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('内容已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动选择文本复制');
    }
  }, []);

  // 数据持久化逻辑
  const saveChatLog = useCallback((role, content) => {
    try {
      const chatLog = JSON.parse(localStorage.getItem('chatLog')) || [];
      chatLog.push({ role, content });
      localStorage.setItem('chatLog', JSON.stringify(chatLog));
    } catch (error) {
      console.error('保存聊天记录失败:', error);
    }
  }, []);

  const loadChatLog = useCallback(() => {
    try {
      const chatLog = JSON.parse(localStorage.getItem('chatLog')) || [];
      setMessages(chatLog.slice(-MESSAGE_LIMIT));
    } catch (error) {
      console.error('加载聊天记录失败:', error);
    }
  }, []);

  // 消息处理
  const appendMessage = useCallback((role, content) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (role === 'assistant') {
        newMessages.push({ role, content: '' });
      } else {
        newMessages.push({ role, content });
        saveChatLog(role, content);
      }
      return newMessages;
    });

    if (role === 'assistant') {
      typeMessage(content, () => saveChatLog(role, content));
    }

    setTimeout(() => {
      chatLogRef.current?.scrollTo({
        top: chatLogRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);
  }, [saveChatLog, typeMessage]);

  // API通信
  const sendMessage = useCallback(async (message) => {
    try {
      const requestBody = {
        model,
        messages: [{ role: 'user', content: message }],
        temperature
      };
      console.log('Request Body:', requestBody);

      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody),
        credentials: 'include' // 如果后端允许携带凭证，设置为 'include'
      });

      console.log('Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API 请求失败，状态码: ${response.status}, 错误信息: ${JSON.stringify(errorData)}`);
      }

      const responseData = await response.json();
      console.log('Response Data:', responseData);
      return responseData;
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }, [BASE_URL, API_KEY, model, temperature]);

  // 事件处理
  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    try {
      setMessageInput('');
      appendMessage('user', trimmedMessage);
      setLoading(true);

      const response = await sendMessage(trimmedMessage);
      appendMessage('assistant', response.message);
    } catch (error) {
      appendMessage('assistant', '抱歉，暂时无法处理您的请求');
    } finally {
      setLoading(false);
    }
  }, [messageInput, appendMessage, sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // 对话管理
  const saveCurrentConversation = useCallback(() => {
    try {
      const chatLog = JSON.parse(localStorage.getItem('chatLog')) || [];
      if (chatLog.length === 0) {
        alert('当前没有对话内容');
        return;
      }

      const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
      const newHistory = [...history, {
        name: `对话 ${history.length + 1} (${new Date().toLocaleString()})`,
        messages: chatLog
      }];

      localStorage.setItem('chatHistory', JSON.stringify(newHistory));
      setChatHistory(newHistory);
    } catch (error) {
      console.error('保存对话失败:', error);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    saveCurrentConversation();
    localStorage.removeItem('chatLog');
    setMessages([]);
  }, [saveCurrentConversation]);

  // 初始化效果
  useEffect(() => {
    const loadData = () => {
      loadChatLog();
      try {
        const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setChatHistory(history);
      } catch (error) {
        console.error('加载对话历史失败:', error);
      }
    };
    loadData();
  }, [loadChatLog]);

  // 滚动处理
  useEffect(() => {
    const handleScroll = () => {
      if (backToTopRef.current && chatLogRef.current) {
        backToTopRef.current.style.display = chatLogRef.current.scrollTop > 300
          ? 'block'
          : 'none';
      }
    };

    const currentRef = chatLogRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // 弹出层交互处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSettingsModal) {
        setShowSettingsModal(false);
      }
    };

    if (showSettingsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [showSettingsModal]);

  return (
    <>
      <Header title="AI助手" showLeft={false} />
      <div className={styles.chatContainer}>
        {/* 左侧聊天区域 */}
        <div className={styles.chatMain}>
          <div ref={chatLogRef} className={styles.chatLog}>
            {messages.map((message, index) => (
              <div key={`msg-${index}`} className={styles.message}>
                <div className={`${styles.bubble} ${styles[message.role]}`}>
                  {message.content}
                  {message.role === 'assistant' && (
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopy(message.content)}
                      aria-label="复制内容"
                    >
                      复制
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {loading && <div className={styles.loading}>加载中...</div>}

          <div className={styles.inputArea}>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              aria-label="聊天输入框"
              disabled={loading}
            />
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={loading}
            >
              发送
            </button>
          </div>

          <button
            ref={backToTopRef}
            className={styles.backToTop}
            onClick={() => {
              if (chatLogRef.current) {
                chatLogRef.current.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            aria-label="回到顶部"
          >
            ↑
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className={styles.mobileSettingsButton}
          >
            设置
          </button>
        </div>

        {/* 移动端设置弹出层 */}
        {showSettingsModal && (
          <div className={styles.modalOverlay} onClick={() => setShowSettingsModal(false)}>
            <div className={styles.settingsModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>模型设置</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>
              <div className={styles.settings}>
                <div className={styles.settingItem}>
                  <button onClick={startNewConversation}>
                    新对话
                  </button>
                  <button onClick={saveCurrentConversation}>
                    保存当前
                  </button>
                </div>
                <div className={styles.settingItem}>
                  <label>创意度 (0-1.5):</label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(Math.min(1.5, Math.max(0, parseFloat(e.target.value))))}
                    min="0"
                    max="1.5"
                    step="0.1"
                  />
                  <label>模式选择:</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value="deepseek-chat">对话模式</option>
                    <option value="deepseek-coder">编程模式</option>
                  </select>
                </div>
                <div className={styles.conversationList}>
                  {chatHistory.map((conv, index) => (
                    <div key={`conv-${index}`} className={styles.convItem}>
                      <button onClick={() => setMessages(conv.messages)}>
                        {conv.name}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => {
                          const newHistory = chatHistory.filter((_, i) => i !== index);
                          setChatHistory(newHistory);
                          localStorage.setItem('chatHistory', JSON.stringify(newHistory));
                        }}
                        aria-label="删除对话"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Llm;
    