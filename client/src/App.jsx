import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import InputBar from './components/InputBar';
import AIDraftAssistant from './components/AIDraftAssistant';

const socket = io("https://cliq2025.onrender.com", {
  transports: ["websocket"],
});


function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Harsha",
      text: "Deadline Loading... 30th November, 11:59 PM\nJust 48 hours left to fine-tune your integrations and submit your apps\n\nSubmit Your App here: https://zurl.co/CO800\n\nDon't wait until the last minute - ship it, test it, and submit your best version!\nBring it on Trixsters (Edited)",
      timestamp: "Yesterday",
      reactions: { "Like": 13, "Party": 3, "Fire": 3, "Heart": 2 }
    }
  ]);

  const [input, setInput] = useState('');
  const [correction, setCorrection] = useState(null);
  const [isLoadingCorrection, setIsLoadingCorrection] = useState(false);
  const [isAIDraftOpen, setIsAIDraftOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const correctionTimeoutRef = useRef(null);

  // Socket.io listeners
  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('message');
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: "You",
      text: input,
      timestamp: "Just now",
      isOwn: true
    };
    socket.emit('message', newMsg);
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setCorrection(null);
  };

  // Send message from AI Draft
  const sendDraftMessage = (msg) => {
    socket.emit('message', msg);
    setMessages(prev => [...prev, msg]);
  };

  // Get correction with debounce
  const getInputCorrection = async (text) => {
    if (!text.trim() || text.length < 8) {
      setCorrection(null);
      return;
    }

    if (correctionTimeoutRef.current) {
      clearTimeout(correctionTimeoutRef.current);
    }

    setIsLoadingCorrection(true);

    correctionTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.post('https://cliq2025.onrender.com/api/fix-text', { text }, { timeout: 8000 });
        const corrected = res.data.corrected.replace(/ \(fixed by AI\)$/, '');

        if (corrected !== text) {
          setCorrection(corrected);
        } else {
          setCorrection(null);
        }
      } catch (err) {
        if (err.response?.status !== 429) {
          setCorrection(null);
        }
      } finally {
        setIsLoadingCorrection(false);
      }
    }, 3000);
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInput(newText);
    getInputCorrection(newText);
  };

  const acceptCorrection = () => {
    if (correction) {
      setInput(correction);
      setCorrection(null);
    }
  };

  const fixMessageWithAI = async (messageId, originalText) => {
    setEditingMessageId(messageId);
    try {
      const res = await axios.post('https://cliq2025.onrender.com/api/fix-text', { text: originalText });
      const corrected = res.data.corrected;

      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, text: corrected } : m
      ));
    } catch (err) {
      alert("AI correction failed. Please try again.");
      console.error(err);
    } finally {
      setEditingMessageId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-cliqtrix-darker via-cliqtrix-dark to-cliqtrix-darker text-cliqtrix-textLight font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader onOpenAIDraft={() => setIsAIDraftOpen(true)} />
        <MessageList
          messages={messages}
          editingMessageId={editingMessageId}
          onFixMessage={fixMessageWithAI}
        />
        <InputBar
          input={input}
          correction={correction}
          isLoadingCorrection={isLoadingCorrection}
          onInputChange={handleInputChange}
          onSendMessage={sendMessage}
          onAcceptCorrection={acceptCorrection}
        />
      </div>
      {isAIDraftOpen && (
        <AIDraftAssistant
          isOpen={isAIDraftOpen}
          onClose={() => setIsAIDraftOpen(false)}
          onSendMessage={sendDraftMessage}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default App;
