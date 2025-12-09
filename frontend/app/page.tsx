import { ChatInterface } from "@/components/chat/ChatInterface";
import ShaderBackground from "@/components/ui/shader-background";

export default function Home() {
  return (
    <main className="flex h-screen w-full items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <ShaderBackground />
      <div className="z-10 w-full max-w-4xl">
        <ChatInterface />
      </div>
    </main>
  );
}
