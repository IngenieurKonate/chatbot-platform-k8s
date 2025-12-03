from fastapi import FastAPI
from .models import chatMessage
from .services import save_message, get_ai_response
import os 

# Création de l'application principale
app = FastAPI(
    title="chatbot backend",
    version="1.0.0"
)

#basic endpoint for check if the app is online
@app.get("/")
def health_check():
    return {"status": "ok", "message": "backend is running"}

# Endpoint pour recevoir les messages de chat
@app.post("/chat")
def handle_chat(chat_data: chatMessage):
    """
    Endpoint principal pour l'interaction du chatbot.
    Chaîne la persistance DB et l'appel OpenAI.
    """
    # 1. Extraction des données
    conversation_id = chat_data.conversation_id
    message_content = chat_data.message_content
    choix_model = chat_data.choix_model
    
    # 2. Sauvegarde du message utilisateur DANS la DB
    # Ceci doit se faire avant l'appel AI
    save_message(data={
        "conversation_id": conversation_id,
        "role": "user",
        "content": message_content
    })

    # 3. Appel au service OpenAI
    # Il utilise l'historique chargé en interne via load_history
    ai_response_content = get_ai_response(
        conversation_id=conversation_id, 
        new_message_content=message_content,
        choix_model=choix_model
    )
    
    # 4. Sauvegarde de la réponse de l'AI DANS la DB
    save_message(data={
        "conversation_id": conversation_id,
        "role": "assistant",
        "content": ai_response_content
    })
    
    # 5. Retour de la réponse finale au client
    return {"conversation_id": conversation_id, "response": ai_response_content}