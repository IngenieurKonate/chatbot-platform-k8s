"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 relative z-20">
      <form 
        onSubmit={handleSubmit} 
        className={cn(
            "relative flex w-full items-center gap-2 rounded-[26px] bg-[#2f2f2f] p-2 pr-2 transition-all duration-300",
            isFocused ? "ring-1 ring-neutral-600" : ""
        )}
      >
        {/* Left Action (Attachment) */}
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full shrink-0"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </Button>

        {/* Text Input */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Poser une question"
          disabled={isLoading}
          className="flex-1 bg-transparent border-none text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 h-10 text-base shadow-none"
        />

        {/* Send Button (Exact Match: White Circle + Up Arrow) */}
        <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className={cn(
                "h-8 w-8 rounded-full transition-all duration-200",
                input.trim() 
                    ? "bg-white text-black hover:bg-neutral-200" 
                    : "bg-neutral-600 text-neutral-400 cursor-not-allowed" // Disabled state style
            )}
        >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      </form>
    </div>
  );
}
