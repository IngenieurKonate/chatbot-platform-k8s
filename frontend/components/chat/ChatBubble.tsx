"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
      className={cn(
        "flex w-full items-end gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 ring-2 ring-offset-2 ring-offset-black transition-all duration-300", 
        isUser ? "ring-cyan-400" : "ring-white/20"
      )}>
        <AvatarImage src={isUser ? "/user-avatar.png" : "/ai-avatar.png"} />
        <AvatarFallback className={cn(
          "font-bold text-xs",
          isUser ? "bg-cyan-500 text-black" : "bg-white/10 text-cyan-200"
        )}>
          {isUser ? "U" : "IA"}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "relative max-w-[80%] px-5 py-3.5 text-[0.95rem] shadow-lg backdrop-blur-md",
          "before:absolute before:bottom-0 before:w-4 before:h-4 before:contents-['']", // Tail logic placeholder if needed
          isUser
            ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-medium rounded-2xl rounded-tr-sm shadow-cyan-500/20"
            : "bg-white/5 border border-white/10 text-gray-100 rounded-2xl rounded-tl-sm shadow-black/40"
        )}
      >
        <div className="markdown-container leading-relaxed tracking-wide text-[0.95rem]">
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
             <ReactMarkdown 
               components={{
                 strong: ({node, ...props}) => <span className="font-bold text-cyan-200" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                 ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                 li: ({node, ...props}) => <li className="pl-1" {...props} />,
                 p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
               }}
             >
               {content}
             </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}
