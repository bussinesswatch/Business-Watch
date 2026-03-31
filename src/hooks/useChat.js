import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDatabase, ref, push, onValue, serverTimestamp, query, limitToLast } from 'firebase/database';

export const useChat = (maxMessages = 100) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const db = getDatabase();

  // Subscribe to messages
  useEffect(() => {
    const messagesRef = query(
      ref(db, 'chat/messages'),
      limitToLast(maxMessages)
    );

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data)
          .map(([id, msg]) => ({ id, ...msg }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, maxMessages]);

  // Send message
  const sendMessage = useCallback(async (text, type = 'text') => {
    if (!user || !text.trim()) return;

    try {
      const messagesRef = ref(db, 'chat/messages');
      await push(messagesRef, {
        text: text.trim(),
        userId: user.uid,
        userName: user.displayName || user.email,
        userRole: user.role || 'Staff',
        timestamp: serverTimestamp(),
        type,
      });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [user, db]);

  // Mark as typing
  const setTyping = useCallback(async (isTyping) => {
    if (!user) return;

    try {
      const typingRef = ref(db, `chat/typing/${user.uid}`);
      if (isTyping) {
        await push(typingRef, {
          userName: user.displayName || user.email,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Typing indicator error:', err);
    }
  }, [user, db]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    typingUsers,
    setTyping,
    currentUser: user,
  };
};
