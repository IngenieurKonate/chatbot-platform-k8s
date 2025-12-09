import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:30080", // URL du Backend K8s (NodePort)
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendMessage = async (
  conversationId: string,
  messageContent: string,
  model: string
) => {
  try {
    const response = await api.post("/chat", {
      conversation_id: conversationId,
      message_content: messageContent,
      choix_model: model,
    });
    return response.data; // Expected format: { response: "AI message", ... }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default api;
