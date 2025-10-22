import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

const Chat = ({ rujukanId, isOpen, onClose }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/${rujukanId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [rujukanId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history when component mounts or rujukanId changes
  useEffect(() => {
    if (rujukanId && isOpen) {
      fetchMessages();
    }
  }, [rujukanId, isOpen, fetchMessages]);

  // Join chat room when socket is connected and rujukanId is available
  useEffect(() => {
    if (socket && isConnected && rujukanId && isOpen) {
      socket.emit('join-chat', rujukanId);
    }
  }, [socket, isConnected, rujukanId, isOpen]);

  // Listen for new messages
  useEffect(() => {
    if (socket && isConnected) {
      const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
      };

      socket.on('new-message', handleNewMessage);

      return () => {
        socket.off('new-message', handleNewMessage);
      };
    }
  }, [socket, isConnected]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !isConnected) return;

    try {
        const response = await fetch(`/api/chat/${rujukanId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ message: newMessage.trim() })
        });

        const data = await response.json();
        if (data.success) {
            // Message will be added via socket event
            setNewMessage('');
            inputRef.current?.focus();
        } else {
            console.error('Failed to send message:', data.message);
            alert('Gagal mengirim pesan: ' + data.message); // Menampilkan pesan kesalahan
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Terjadi kesalahan saat mengirim pesan.'); // Menampilkan pesan kesalahan
    }
};
// Cek koneksi socket
useEffect(() => {
    console.log('Socket connected:', isConnected);
}, [isConnected]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSenderDisplayName = (message) => {
    if (message.sender_name) {
      return message.sender_name;
    }
    return message.sender_username || 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-container" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <h3>Chat Rujukan #{rujukanId}</h3>
          <button className="chat-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chat-messages">
          {loading ? (
            <div className="chat-loading">Memuat pesan...</div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">Belum ada pesan. Mulai percakapan!</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender_id === user?.id ? 'own' : 'other'}`}
              >
                <div className="message-header">
                  <span className="sender-name">{getSenderDisplayName(message)}</span>
                  <span className="message-time">{formatTime(message.created_at)}</span>
                </div>
                <div className="message-content">{message.message}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={sendMessage}>
          <div className="chat-input-container">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isConnected ? "Ketik pesan..." : "Koneksi terputus..."}
              disabled={!isConnected}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected}
              className="send-btn"
            >
              Kirim
            </button>
          </div>
          {!isConnected && (
            <div className="connection-status">Koneksi terputus - pesan tidak dapat dikirim</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chat;
