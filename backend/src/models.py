from pydantic import BaseModel 

class chatMessage(BaseModel):
    message_content: str
    conversation_id: str
    choix_model: str = "gpt-3.5-turbo"