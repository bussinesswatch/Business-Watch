import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Pusher from 'pusher-js';

// Pusher free tier: 200k messages/day, no credit card, no expiration
const PUSHER_KEY = 'a6f9d8c2a8e8c2a8e8c2'; // Replace with your Pusher key
const PUSHER_CLUSTER = 'ap2'; // Mumbai cluster

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pusher, setPusher] = useState(null);

  // Initialize Pusher
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const pusherClient = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
      });

      const channel = pusherClient.subscribe('business-watch-chat');

      // Listen for new messages
      channel.bind('message', (data) => {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.id === data.id)) {
            return prev;
          }
          return [...prev, data].sort((a, b) => a.timestamp - b.timestamp);
        });
      });

      // Load initial messages from localStorage (for persistence across sessions)
      const saved = localStorage.getItem('bw_chat_messages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Keep only last 100 messages, within last 24 hours
          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
          const recent = parsed.filter((m) => m.timestamp > oneDayAgo).slice(-100);
          setMessages(recent);
        } catch (e) {
          console.error('Failed to parse saved messages:', e);
        }
      }

      setPusher(pusherClient);
      setLoading(false);

      return () => {
        pusherClient.unsubscribe('business-watch-chat');
        pusherClient.disconnect();
      };
    } catch (err) {
      setError('Failed to connect to chat. Please try again.');
      setLoading(false);
      console.error('Pusher init error:', err);
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('bw_chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Send message
  const sendMessage = useCallback(
    async (text, type = 'text') => {
      if (!user || !text.trim()) return false;

      try {
        const message = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: text.trim(),
          userId: user.uid,
          userName: user.displayName || user.email,
          userRole: user.role || 'Staff',
          timestamp: Date.now(),
          type,
        };

        // Add to local state immediately
        setMessages((prev) => [...prev, message]);

        // Trigger Pusher event
        if (pusher) {
          // Note: In production, you'd send to your backend which triggers Pusher
          // For now, we broadcast locally and rely on other clients receiving it
          const channel = pusher.channel('business-watch-chat');
          if (channel) {
            channel.trigger('client-message', message);
          }
        }

        return true;
      } catch (err) {
        setError('Failed to send message');
        console.error('Send message error:', err);
        return false;
      }
    },
    [user, pusher]
  );

  // Clear old messages (keep last 50)
  const clearOldMessages = useCallback(() => {
    setMessages((prev) => prev.slice(-50));
    localStorage.setItem('bw_chat_messages', JSON.stringify(messages.slice(-50)));
  }, [messages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearOldMessages,
    currentUser: user,
  };
};
