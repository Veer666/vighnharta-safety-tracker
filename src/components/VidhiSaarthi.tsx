
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, RefreshCcw, Trash2, Bot, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ipcSections, crpcSections, legalProcedures } from "@/lib/legal-knowledge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";

// Define the message structure
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface VidhiSaarthiProps {
  floatingMode?: boolean;
}

const VidhiSaarthi: React.FC<VidhiSaarthiProps> = ({ floatingMode = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'नमस्ते! मैं विधि साथी हूँ, आपका कानूनी सहायक। आप मुझसे भारतीय दंड संहिता (IPC) और आपराधिक प्रक्रिया संहिता (CrPC) के बारे में पूछ सकते हैं। / Hello! I am VidhiSaarthi, your legal assistant. You can ask me about Indian Penal Code (IPC), Criminal Procedure Code (CrPC), and other Indian legal matters.',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to generate a response following the structured legal analysis approach
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific IPC sections from imported knowledge base
    for (const section of ipcSections) {
      if (lowerQuery.includes(`ipc ${section.number}`) || lowerQuery.includes(`section ${section.number}`)) {
        return `IPC Section ${section.number}: ${section.title}\n\nDescription: ${section.description}\n\nPunishment: ${section.punishment || 'Not specified in the knowledge base.'}\n\nPlease note that the exact punishment is determined by the court based on evidence and circumstances. It is advised to consult a legal expert for a case-specific opinion.`;
      }
    }
    
    // Check for specific CrPC sections from imported knowledge base
    for (const section of crpcSections) {
      if (lowerQuery.includes(`crpc ${section.number}`) || lowerQuery.includes(`section ${section.number} crpc`)) {
        return `CrPC Section ${section.number}: ${section.title}\n\nDescription: ${section.description}\n\nPlease note that the exact application is determined by the court based on evidence and circumstances. It is advised to consult a legal expert for a case-specific opinion.`;
      }
    }
    
    // Check for legal procedures from imported knowledge base
    for (const [key, procedure] of Object.entries(legalProcedures)) {
      if (lowerQuery.includes(key.replace('_', ' '))) {
        return `${procedure.title}:\n\n${procedure.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nPlease note that these are general guidelines. For specific legal advice, please consult a qualified legal professional.`;
      }
    }
    
    // Special handling for crime scenarios requiring legal analysis
    if (lowerQuery.includes('theft') || lowerQuery.includes('robbery') || lowerQuery.includes('stolen')) {
      return analyzeTheftScenario(query);
    }
    
    if (lowerQuery.includes('hurt') || lowerQuery.includes('injury') || lowerQuery.includes('assault') || lowerQuery.includes('hit')) {
      return analyzeAssaultScenario(query);
    }
    
    if (lowerQuery.includes('murder') || lowerQuery.includes('kill') || lowerQuery.includes('death')) {
      return analyzeHomicideScenario(query);
    }
    
    if (lowerQuery.includes('rape') || lowerQuery.includes('sexual assault') || lowerQuery.includes('molest')) {
      return analyzeSexualOffenseScenario(query);
    }
    
    if (lowerQuery.includes('fraud') || lowerQuery.includes('cheat') || lowerQuery.includes('dupe')) {
      return analyzeFraudScenario(query);
    }
    
    // For filing an FIR or legal procedure question
    if (lowerQuery.includes('file fir') || lowerQuery.includes('how to report') || lowerQuery.includes('complaint')) {
      return `Filing an FIR (First Information Report):\n\n1. Visit the police station in whose jurisdiction the offense occurred\n2. Provide a written or oral complaint detailing the incident\n3. Police officer must register the FIR if the offense is cognizable\n4. Get a free copy of the FIR\n5. If police refuse to register an FIR for a cognizable offense, approach the Superintendent of Police or file a complaint with the Magistrate under Section 156(3) CrPC\n\nPlease note that these are general guidelines. For specific legal advice, please consult a qualified legal professional.`;
    }
    
    // Generic response for unrecognized queries
    return `I understand you're asking about a legal matter. To provide accurate information, I need specific details about:\n\n1. The exact situation or incident you're inquiring about\n2. Whether you're asking from the perspective of a victim, accused, or witness\n3. Any specific legal sections or procedures you want to know about\n\nAs a legal assistant, I can help with information on Indian Penal Code (IPC), Criminal Procedure Code (CrPC), and civil matters. Please provide more details so I can assist you properly.\n\nDisclaimer: My responses are for informational purposes only and not a substitute for professional legal advice.`;
  };

  // Helper function to analyze theft scenarios
  const analyzeTheftScenario = (query: string): string => {
    return `Based on your query about theft, here's my legal analysis:\n\n1️⃣ Potential Legal Offenses:\n- Simple theft (IPC Section 379): Punishment up to 3 years imprisonment and/or fine\n- Theft in dwelling house (IPC Section 380): Punishment up to 7 years and fine\n- Robbery (IPC Section 392): If force was used, punishment up to 10 years and fine\n- Dacoity (IPC Section 395): If committed by five or more persons, punishment up to life imprisonment\n\n2️⃣ Legal Consequences:\nThe exact punishment depends on factors like:\n- Value of stolen property\n- Use of force or weapons\n- Number of persons involved\n- Prior criminal history\n\n3️⃣ Recommended Actions:\n- File an FIR at the police station with jurisdiction\n- Provide all evidence including CCTV footage if available\n- List all stolen items with approximate values\n- Cooperate with the police investigation\n\n4️⃣ Legal Note:\nThe exact punishment is determined by the court based on evidence and circumstances. It is advised to consult a legal expert for a case-specific opinion.`;
  };

  // Helper function to analyze assault scenarios
  const analyzeAssaultScenario = (query: string): string => {
    return `Based on your query about assault/injury, here's my legal analysis:\n\n1️⃣ Potential Legal Offenses:\n- Hurt (IPC Section 323): Simple hurt, punishment up to 1 year and/or fine\n- Grievous hurt (IPC Section 325): Serious injury, punishment up to 7 years and fine\n- Attempt to murder (IPC Section 307): If intent to kill, punishment up to 10 years\n- Assault to outrage modesty (IPC Section 354): If gender-based, punishment up to 5 years\n\n2️⃣ Legal Consequences:\nThe severity of punishment depends on:\n- Nature and extent of injury\n- Weapon used, if any\n- Intent behind the assault\n- Relationship between parties\n\n3️⃣ Recommended Actions:\n- Get medical treatment and secure a Medico-Legal Certificate (MLC)\n- File an FIR with detailed description of the incident\n- Collect witness statements and any available evidence\n- Consider applying for victim compensation\n\n4️⃣ Legal Note:\nThe exact punishment is determined by the court based on evidence and circumstances. It is advised to consult a legal expert for a case-specific opinion.`;
  };

  // Helper function to analyze homicide scenarios
  const analyzeHomicideScenario = (query: string): string => {
    return `Based on your query about death/homicide, here's my legal analysis:\n\n1️⃣ Potential Legal Offenses:\n- Murder (IPC Section 302): Intentional killing, punishment with death or life imprisonment and fine\n- Culpable homicide not amounting to murder (IPC Section 304): Unintentional killing, punishment up to life imprisonment\n- Death by negligence (IPC Section 304A): Accidental death, punishment up to 2 years\n- Dowry death (IPC Section 304B): Death of woman within 7 years of marriage under suspicious circumstances\n\n2️⃣ Legal Consequences:\nThe charge and punishment depend on:\n- Presence of intention (mens rea)\n- Circumstances and method of killing\n- Relationship between parties\n- Evidence of premeditation\n\n3️⃣ Recommended Actions:\n- Report to police immediately\n- Ensure proper post-mortem examination\n- Preserve all evidence\n- Consider engaging a criminal lawyer\n\n4️⃣ Legal Note:\nThe exact punishment is determined by the court based on evidence and circumstances. It is advised to consult a legal expert for a case-specific opinion.`;
  };

  // Helper function to analyze sexual offense scenarios
  const analyzeSexualOffenseScenario = (query: string): string => {
    return `Based on your query about sexual offenses, here's my legal analysis:\n\n1️⃣ Potential Legal Offenses:\n- Rape (IPC Section 376): Punishment with rigorous imprisonment from 10 years to life and fine\n- Sexual harassment (IPC Section 354A): Punishment up to 3 years and/or fine\n- Stalking (IPC Section 354D): Punishment up to 5 years for subsequent offenses\n- Voyeurism (IPC Section 354C): Punishment from 1 to 7 years depending on repetition\n\n2️⃣ Legal Consequences:\nSexual offenses are treated severely under Indian law with enhanced punishments for:\n- Offenses against minors (POCSO Act)\n- Repeat offenders\n- Position of authority or trust\n- Offenses causing grievous hurt\n\n3️⃣ Recommended Actions for Victims:\n- Report to police or women's helpline (1091)\n- Seek immediate medical examination\n- Statement can be recorded by female officer\n- Right to free legal aid\n\n4️⃣ Legal Note:\nThe exact punishment is determined by the court based on evidence and circumstances. It is advised to consult a legal expert for a case-specific opinion. All sexual offense cases are handled with confidentiality to protect victim identity.`;
  };

  // Helper function to analyze fraud scenarios
  const analyzeFraudScenario = (query: string): string => {
    return `Based on your query about fraud/cheating, here's my legal analysis:\n\n1️⃣ Potential Legal Offenses:\n- Cheating (IPC Section 420): Punishment up to 7 years and fine\n- Criminal breach of trust (IPC Section 406): Punishment up to 3 years and/or fine\n- Forgery (IPC Sections 465, 468): Punishment up to 7 years and fine\n- Cybercrime (IT Act, 2000): Various penalties depending on the nature of fraud\n\n2️⃣ Legal Consequences:\nThe severity of punishment depends on:\n- Amount involved in fraud\n- Method and sophistication\n- Number of victims affected\n- Position of trust (if any)\n\n3️⃣ Recommended Actions:\n- Preserve all documentation and evidence\n- File a detailed FIR with the police\n- For online fraud, also report to cybercrime portal (cybercrime.gov.in)\n- Consider civil remedies for recovery of money\n\n4️⃣ Legal Note:\nThe exact punishment is determined by the court based on evidence and circumstances. It is advised to consult a legal expert for a case-specific opinion. For financial frauds, also consider approaching consumer forums or financial regulators.`;
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
        text: 'नमस्ते! मैं विधि साथी हूँ, आपका कानूनी सहायक। आप मुझसे भारतीय दंड संहिता (IPC) और आपराधिक प्रक्रिया संहिता (CrPC) के बारे में पूछ सकते हैं। / Hello! I am VidhiSaarthi, your legal assistant. You can ask me about Indian Penal Code (IPC), Criminal Procedure Code (CrPC), and other Indian legal matters.',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Chat cleared",
      description: "All conversation history has been cleared.",
    });
  };

  // Render the full chat interface
  const renderChatInterface = () => (
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

  // Render floating button and sheet for mobile
  const renderFloatingButton = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="fixed left-6 bottom-20 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping-subtle"></div>
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center overflow-hidden border-2 border-white">
              <Bot className="h-7 w-7" />
            </div>
          </div>
        </motion.button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] pt-10 px-0 sm:max-w-none">
        <div className="h-full flex flex-col overflow-hidden">
          <div className="h-full overflow-auto pb-16">
            {renderChatInterface()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Return appropriate UI based on mode
  return floatingMode ? renderFloatingButton() : renderChatInterface();
};

export default VidhiSaarthi;
