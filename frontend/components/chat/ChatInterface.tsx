"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { sendMessage } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MODELS = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4.1", name: "GPT-4.1" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5" },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      role: "assistant", 
      content: "Bonjour, je suis Mentor.ia — votre guide personnel.\nPrêt à explorer vos talents et à construire ensemble le futur qui vous ressemble ?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  
  // Stable conversation ID for the session with setter to reset it
  const [conversationId, setConversationId] = useState(() => Date.now().toString());
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNewChat = () => {
    setConversationId(Date.now().toString());
    setMessages([
      { 
        id: Date.now().toString(), 
        role: "assistant", 
        content: "Bonjour, je suis Mentor.ia — votre guide personnel.\nPrêt à explorer vos talents et à construire ensemble le futur qui vous ressemble ?" 
      }
    ]);
  };

  const handleSend = async (content: string) => {
    const newMessage: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Corrected API call with conversationId and selected model
      const response = await sendMessage(conversationId, content, selectedModel.id);
      
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: response.response || response.message || "Reçu." 
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: "Connexion impossible. Veuillez vérifier que le Backend est en cours d'exécution." 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Logic for "Zero State" / Landing View
  const isLanding = messages.length <= 1;

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,243,255,0.2)] bg-black/40 backdrop-blur-2xl border border-cyan-500/30 ring-1 ring-cyan-400/20 relative transition-all duration-700">
      
      {/* Header acting as title bar */}
      <div className="p-4 border-b border-cyan-500/10 bg-gradient-to-r from-transparent via-cyan-950/20 to-transparent flex items-center justify-between z-50 relative">
        <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-100 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)] pl-4">
          MENTOR.IA
        </h1>

        <div className="flex items-center gap-3">
          {/* New Chat Button */}
          <button 
            onClick={handleNewChat}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-200 hover:text-cyan-400 group"
            title="Nouvelle conversation"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          </button>

          {/* Model Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsModelOpen(!isModelOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-sm text-gray-200"
            >
            {selectedModel.name}
            <ChevronDown className={cn("h-3 w-3 text-gray-400 transition-transform", isModelOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isModelOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-32 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 ring-1 ring-white/5"
              >
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                        setSelectedModel(model);
                        setIsModelOpen(false);
                    }}
                    className={cn(
                      "w-full block px-4 py-3 text-sm transition-colors hover:bg-white/5 text-left font-medium",
                      selectedModel.id === model.id ? "bg-cyan-950/30 text-cyan-100" : "text-gray-400"
                    )}
                  >
                    {model.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>


      <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
        
        <ScrollArea className="h-full w-full">
          <div className={cn(
            "flex flex-col gap-6 p-6 pb-20 transition-all duration-700", // Added padding here, and extra bottom padding
            isLanding ? "justify-center min-h-full" : ""
          )}>
            
            {/* Storytelling Mission Text - Only visible in landing state */}
            <AnimatePresence mode="wait">
              {isLanding && (
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Premium "Apple-like" ease
                  className="text-center mb-12 space-y-4 max-w-2xl mx-auto px-4"
                >
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
                    Votre avenir. Clair. <span className="text-cyan-400">Puissant.</span> Possible.
                  </h2>
                  <p className="text-lg text-gray-400 font-light leading-relaxed max-w-xl mx-auto">
                    Laissez notre IA découvrir qui vous êtes vraiment, révéler les métiers qui vous correspondent, et tracer le parcours le plus sûr vers votre réussite.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
              ))}
            </AnimatePresence>
            
            {isLoading && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="flex items-center gap-2 text-cyan-400/70 text-sm pl-4 font-mono"
               >
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                 </span>
                 Mentor IA est en train de réfléchir...
               </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
