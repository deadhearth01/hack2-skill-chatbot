import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Groq } from 'groq-sdk';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  content: string;
  isBot: boolean;
}

const GROQ_API_KEY = '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';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { content: message, isBot: false }]);

      const groq = new Groq({
        apiKey: GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          ...messages.map(msg => ({
            role: msg.isBot ? 'assistant' as const : 'user' as const,
            content: msg.content,
          })),
          { role: 'user' as const, content: message },
        ],
        model: 'llama-3.3-70b-versatile',
      });

      const response = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { content: response, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
      <div className="flex justify-between items-center mb-6 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">AI Chat Assistant</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto messages-container mb-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-4">
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isBot={message.isBot}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;