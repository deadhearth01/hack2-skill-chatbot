import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  return (
    <div
      className={cn(
        "py-3 px-4 rounded-lg max-w-[85%] mb-4 backdrop-blur-sm",
        isBot 
          ? "bg-white/10 border border-white/20 self-start text-purple-100" 
          : "bg-gradient-to-r from-purple-500 to-blue-500 self-end text-white"
      )}
    >
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={cn("bg-black/30 px-1 py-0.5 rounded", className)} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;