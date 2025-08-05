import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Clock,
  Minimize2,
  Maximize2,
  Phone,
  Mail
} from "lucide-react";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'support', time: string}>>([]);

  const startChat = () => {
    if (!name || !email) return;
    setChatStarted(true);
    setMessages([
      {
        id: 1,
        text: `Hello ${name}! I'm Sarah from GameHost Pro support. How can I help you today?`,
        sender: 'support',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate support response
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! Let me help you with that.",
        "I understand your concern. Let me check that for you.",
        "That's a great question! Here's what I can tell you...",
        "I'll be happy to assist you with your server setup.",
        "Let me look into that right away for you."
      ];
      const response = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'support' as const,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black rounded-full p-4 shadow-2xl animate-pulse"
          size="lg"
        >
          <MessageCircle className="w-6 h-6 mr-2" />
          Live Chat
          <Badge className="ml-2 bg-red-500 text-white animate-bounce">Online</Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`bg-gaming-dark border-gaming-green/30 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        <CardHeader className="bg-gaming-green text-gaming-black p-4 rounded-t-lg flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <CardTitle className="text-lg">Live Support</CardTitle>
            <Badge className="bg-green-500 text-white text-xs">Online</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gaming-black hover:bg-gaming-green-dark"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gaming-black hover:bg-gaming-green-dark"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {!chatStarted ? (
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-gaming-white font-semibold mb-2">Start a conversation</h3>
                  <p className="text-gaming-gray text-sm">Get instant help from our support team</p>
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white"
                  />
                  <Input
                    placeholder="Your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2 text-gaming-gray">
                    <Clock className="w-4 h-4" />
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gaming-gray">
                    <User className="w-4 h-4" />
                    <span>Expert Support</span>
                  </div>
                </div>

                <Button
                  onClick={startChat}
                  disabled={!name || !email}
                  className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                >
                  Start Chat
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-gaming-gray text-xs">Or reach us directly:</p>
                  <div className="flex justify-center space-x-4 text-xs">
                    <Button variant="ghost" size="sm" className="text-gaming-green hover:bg-gaming-green/10">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gaming-green hover:bg-gaming-green/10">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gaming-black-lighter">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-gaming-green text-gaming-black' 
                          : 'bg-gaming-dark border border-gaming-green/20 text-gaming-white'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-gaming-black/70' : 'text-gaming-gray'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gaming-green/20">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      size="sm"
                      className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}