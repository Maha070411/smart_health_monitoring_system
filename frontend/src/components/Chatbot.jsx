import { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquare, Send, X, Activity } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (isOpen && messages.length === 0 && user?.referenceId) {
            loadHistory();
        }
    }, [isOpen, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadHistory = async () => {
        try {
            const res = await api.get(`/chatbot/history/${user.referenceId}`);
            const history = [];
            res.data.forEach(item => {
                history.push({ text: item.question, sender: 'user' });
                history.push({ text: item.answer, sender: 'bot' });
            });
            if (history.length === 0) {
                history.push({ text: "Hello! I am your AI health assistant. What are your symptoms today?", sender: 'bot' });
            }
            setMessages(history);
        } catch (error) {
            console.error('Failed to load chat history', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chatbot/ask', {
                patient: { id: user.referenceId },
                question: userMsg
            });
            setMessages(prev => [...prev, { text: res.data.answer, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Error connecting to AI service.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:bg-emerald-700 transition shadow-emerald-200"
            >
                <MessageSquare size={28} />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 z-50">
                    <div className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md z-10">
                        <div className="font-semibold flex items-center gap-2">
                            <Activity size={20}/> Health AI
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-emerald-200 transition">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                                    m.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-slate-600 border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                    <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type symptoms..."
                            className="flex-1 bg-slate-100 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                        <button type="submit" disabled={loading} className="bg-emerald-600 p-2.5 rounded-full text-white hover:bg-emerald-700 disabled:opacity-50 transition">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};


export default Chatbot;
