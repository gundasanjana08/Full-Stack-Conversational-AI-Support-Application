
import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import TicketDashboard from './components/TicketDashboard';
import { GeminiService } from './services/geminiService';
import { 
  Message, 
  MessageRole, 
  Ticket, 
  TicketStatus, 
  TicketPriority, 
  AppState 
} from './types';

const INITIAL_STATE: AppState = {
  messages: [],
  tickets: [
    {
      id: 'TCK-1024',
      subject: 'Unable to login to Dashboard',
      customerName: 'Alice Johnson',
      status: TicketStatus.OPEN,
      priority: TicketPriority.URGENT,
      createdAt: Date.now() - 3600000,
      lastUpdate: Date.now()
    },
    {
      id: 'TCK-1025',
      subject: 'Billing inquiry for Q4',
      customerName: 'Bob Smith',
      status: TicketStatus.RESOLVED,
      priority: TicketPriority.LOW,
      createdAt: Date.now() - 86400000,
      lastUpdate: Date.now() - 43200000
    }
  ],
  isThinking: false,
  activeView: 'chat'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const gemini = useMemo(() => new GeminiService(), []);

  const handleSendMessage = useCallback(async (text: string) => {
    // 1. Update UI with user message
    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: MessageRole.USER,
      text,
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isThinking: true
    }));

    try {
      // 2. Define Handlers for Gemini Function Calling
      const onCreateTicket = (args: any) => {
        const newId = `TCK-${Math.floor(Math.random() * 9000) + 1000}`;
        const newTicket: Ticket = {
          id: newId,
          subject: args.subject,
          customerName: args.customerName,
          status: TicketStatus.OPEN,
          priority: args.priority as TicketPriority || TicketPriority.MEDIUM,
          createdAt: Date.now(),
          lastUpdate: Date.now()
        };
        
        setState(prev => ({
          ...prev,
          tickets: [newTicket, ...prev.tickets]
        }));
        
        return `Successfully created ticket ${newId} for ${args.customerName}. Subject: ${args.subject}`;
      };

      const onGetStatus = (id: string) => {
        const ticket = state.tickets.find(t => t.id === id || t.id.toLowerCase() === id.toLowerCase());
        if (ticket) {
          return `Ticket ${id} is currently ${ticket.status}. It has a ${ticket.priority} priority.`;
        }
        return `I couldn't find a ticket with ID ${id}. Please double-check the ID.`;
      };

      // 3. Call Gemini
      const aiResponse = await gemini.generateResponse(
        state.messages,
        text,
        { onCreateTicket, onGetStatus }
      );

      // 4. Update UI with AI response
      const aiMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: MessageRole.MODEL,
        text: aiResponse,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
        isThinking: false
      }));
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: MessageRole.MODEL,
        text: "I'm having trouble connecting right now. Please check your API key and network connection.",
        timestamp: Date.now()
      };
      setState(prev => ({ ...prev, messages: [...prev.messages, errorMsg], isThinking: false }));
    }
  }, [gemini, state.messages, state.tickets]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar 
        activeView={state.activeView} 
        setActiveView={(view) => setState(prev => ({ ...prev, activeView: view }))} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden p-6 gap-6">
        {state.activeView === 'chat' ? (
          <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col h-full">
            <header className="mb-4">
              <h1 className="text-2xl font-bold text-slate-800">Support Center</h1>
              <p className="text-slate-500">How can we help you today?</p>
            </header>
            <ChatWindow 
              messages={state.messages} 
              onSendMessage={handleSendMessage} 
              isThinking={state.isThinking} 
            />
          </div>
        ) : (
          <div className="flex-1 max-w-7xl mx-auto w-full">
            <TicketDashboard tickets={state.tickets} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
