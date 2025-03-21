
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, RefreshCcw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ipcSections, crpcSections, legalProcedures } from "@/lib/legal-knowledge";

// Define the message structure
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const VidhiSaarthi: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'नमस्ते! मैं विधि साथी हूँ, आपका कानूनी सहायक। आप मुझसे भारतीय दंड संहिता (IPC) और आपराधिक प्रक्रिया संहिता (CrPC) के बारे में पूछ सकते हैं। / Hello! I am VidhiSaarthi, your legal assistant. You can ask me about Indian Penal Code (IPC) and Criminal Procedure Code (CrPC).',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample legal knowledge base
  const legalKnowledge = {
    'ipc 420': 'IPC Section 420 deals with cheating and dishonestly inducing delivery of property. It is punishable with imprisonment up to 7 years and fine.',
    'ipc 302': 'IPC Section 302 deals with punishment for murder. It is punishable with death or imprisonment for life and fine.',
    'ipc 376': 'IPC Section 376 deals with punishment for rape. It is punishable with rigorous imprisonment for a term not less than 10 years, but which may extend to imprisonment for life and fine.',
    'fir': 'FIR (First Information Report) is a written document prepared by police when they receive information about a cognizable offense. Steps to file an FIR:\n1. Visit the police station in whose jurisdiction the offense occurred\n2. Provide details of the incident\n3. Get a copy of the FIR',
    'bail': 'Bail is the temporary release of an accused person awaiting trial. Process:\n1. File bail application in appropriate court\n2. For bailable offenses, bail is a matter of right\n3. For non-bailable offenses, it\'s at court\'s discretion based on factors like severity of crime and flight risk',
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to generate a simple response based on the input
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific legal terms or sections
    for (const [key, value] of Object.entries(legalKnowledge)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }
    
    // Check for IPC sections from imported knowledge base
    for (const [section, info] of Object.entries(ipcSections)) {
      if (lowerQuery.includes(section)) {
        return `IPC ${section}: ${info}`;
      }
    }
    
    // Check for CrPC sections from imported knowledge base
    for (const [section, info] of Object.entries(crpcSections)) {
      if (lowerQuery.includes(section)) {
        return `CrPC ${section}: ${info}`;
      }
    }
    
    // Check for legal procedures from imported knowledge base
    for (const [procedure, info] of Object.entries(legalProcedures)) {
      if (lowerQuery.includes(procedure)) {
        return info;
      }
    }
    
    // Check for common legal questions
    if (lowerQuery.includes('file complaint') || lowerQuery.includes('police complaint')) {
      return 'To file a police complaint:\n1. Visit the nearest police station\n2. Write a clear statement of the incident\n3. Ensure you get an acknowledgment receipt\n4. If the police refuse to file an FIR for a cognizable offense, you can approach the Superintendent of Police or file a complaint with the Magistrate under CrPC Section 156(3).';
    }
    
    if (lowerQuery.includes('tenant') || lowerQuery.includes('landlord')) {
      return 'Landlord-tenant disputes are primarily governed by state rent control acts. A landlord cannot evict a tenant without following proper legal procedure, which typically involves giving notice and obtaining an eviction order from the court.';
    }
    
    // Generic response for unrecognized queries
    return 'I don\'t have specific information on that legal query. Please ask about specific IPC or CrPC sections, or common legal procedures like filing an FIR or applying for bail. Disclaimer: This is general information and not professional legal advice.';
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const response = generateResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      
      // Scroll to the bottom after new message
      setTimeout(scrollToBottom, 100);
    }, 1000);
  };

  // Function to clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'नमस्ते! मैं विधि साथी हूँ, आपका कानूनी सहायक। आप मुझसे भारतीय दंड संहिता (IPC) और आपराधिक प्रक्रिया संहिता (CrPC) के बारे में पूछ सकते हैं। / Hello! I am VidhiSaarthi, your legal assistant. You can ask me about Indian Penal Code (IPC) and Criminal Procedure Code (CrPC).',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Chat cleared",
      description: "All conversation history has been cleared.",
    });
  };

  return (
    <Card className="flex flex-col h-[500px] max-w-3xl mx-auto">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary font-semibold">विधि साथी</span> | 
          <span className="text-sm font-normal text-muted-foreground">Your Legal Assistant</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-line">{message.text}</div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[80%] rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearChat}
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your legal question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            className="shrink-0"
          >
            <SendIcon className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VidhiSaarthi;
