import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Groq } from 'groq-sdk';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  content: string;
  isBot: boolean;
}

const GROQ_API_KEY_STORAGE = 'groq-api-key';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(GROQ_API_KEY_STORAGE) || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(GROQ_API_KEY_STORAGE, apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Groq API key has been saved successfully.",
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter your Groq API key first.",
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { content: message, isBot: false }]);

      const groq = new Groq({
        apiKey: apiKey,
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

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-blue-500 to-purple-700">
        <div className="w-full max-w-md space-y-4 p-8 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">AI Chat Assistant</h1>
            <p className="text-purple-100">Please enter your Groq API key to continue</p>
          </div>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Groq API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-purple-200"
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Save API Key
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
      <div className="flex justify-between items-center mb-6 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">AI Chat Assistant</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem(GROQ_API_KEY_STORAGE);
            setApiKey('');
          }}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Reset API Key
        </Button>
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