import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  mine: boolean;
  time: string;
}

interface Conversation {
  id: string;
  username: string;
  lastMessage: string;
  time: string;
  unread: number;
  letter: string;
  color: string;
}

const CONVERSATIONS: Conversation[] = [
  { id: '1', username: 'модна_фана',    lastMessage: 'Дали е уште достапно?', time: '2м',  unread: 2, letter: 'М', color: 'from-yellow-400 to-pink-500' },
  { id: '2', username: 'винтаж',        lastMessage: 'Ок, се гледаме утре!',   time: '1ч',  unread: 0, letter: 'В', color: 'from-purple-400 to-blue-500' },
  { id: '3', username: 'куче_тренер',   lastMessage: 'Може ли попуст?',        time: '3ч',  unread: 1, letter: 'К', color: 'from-green-400 to-teal-500' },
  { id: '4', username: 'стил_гуру',     lastMessage: 'Пратено! 📦',            time: 'вчер',unread: 0, letter: 'С', color: 'from-orange-400 to-red-500' },
];

const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'Здраво! Дали е уште достапно?',              mine: false, time: '14:22' },
  { id: '2', text: 'Да, сè уште го имам! 😊',                    mine: true,  time: '14:23' },
  { id: '3', text: 'Одлично! Може ли малку попуст?',              mine: false, time: '14:24' },
  { id: '4', text: 'За 40€ може, пониско не можам за жал.',       mine: true,  time: '14:25' },
  { id: '5', text: 'Добро, се согласувам! Каде можеме да се сретнеме?', mine: false, time: '14:26' },
];

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConv]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, {
      id: Date.now().toString(),
      text: input.trim(),
      mine: true,
      time: new Date().toLocaleTimeString('mk', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
  };

  const conv = CONVERSATIONS.find(c => c.id === activeConv);

  // Conversation list
  if (!activeConv) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
          <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center">
            <span className="text-[17px] font-semibold text-[#262626]">Пораки</span>
          </div>
        </header>

        <div className="max-w-[480px] mx-auto pb-24">
          {CONVERSATIONS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border-b border-[#efefef] active:bg-[#fafafa] transition-colors text-left"
            >
              <div className="w-[52px] h-[52px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{c.letter}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${c.unread > 0 ? 'font-bold' : 'font-semibold'} text-[#262626]`}>{c.username}</span>
                  <span className="text-xs text-[#8e8e8e]">{c.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className={`text-sm truncate ${c.unread > 0 ? 'font-semibold text-[#262626]' : 'text-[#8e8e8e]'}`}>{c.lastMessage}</span>
                  {c.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 bg-[#0095f6] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <BottomNav active="chat" />
      </div>
    );
  }

  // Chat view
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center gap-3">
          <button onClick={() => setActiveConv(null)} className="text-[#262626]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${conv?.color} flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{conv?.letter}</span>
          </div>
          <span className="text-[15px] font-semibold text-[#262626]">{conv?.username}</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 max-w-[480px] w-full mx-auto px-4 py-4 flex flex-col gap-2 pb-24 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
              msg.mine
                ? 'bg-[#0095f6] text-white rounded-br-sm'
                : 'bg-white border border-[#efefef] text-[#262626] rounded-bl-sm'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.mine ? 'text-blue-100' : 'text-[#8e8e8e]'} text-right`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 py-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#efefef] rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Напиши порака..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              className="flex-1 bg-transparent text-sm text-[#262626] placeholder-[#8e8e8e] outline-none"
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-9 h-9 bg-[#0095f6] disabled:bg-[#b2dffc] rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const BottomNav: React.FC<{ active: string }> = ({ active }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#dbdbdb]">
      <div className="max-w-[480px] mx-auto h-[54px] flex items-center justify-around">
        <button onClick={() => navigate('/')} className="p-3">
          <svg className="w-6 h-6" fill={active === 'home' ? '#262626' : 'none'} stroke="#262626" strokeWidth={active === 'home' ? 0 : 1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          </svg>
        </button>
        <button onClick={() => navigate('/search')} className="p-3">
          <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button onClick={() => navigate('/sell')} className="p-3">
          <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="4" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
          </svg>
        </button>
        <button onClick={() => navigate('/chat')} className="p-3 relative">
          <svg className="w-6 h-6" fill={active === 'chat' ? '#262626' : 'none'} stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button onClick={() => navigate('/profile')} className="p-3">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${active === 'profile' ? 'ring-2 ring-[#262626] ring-offset-1' : ''}`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  );
};