from sqlalchemy.orm import Session
from typing import List, Dict, Any
from openai import OpenAI
from .config import settings # On importe les paramètres de configuration
from .database_config import SessionLocal, ConversationHistory # On importe SessionLocal pour ouvrir la connexion, et ConversationHistory pour requêter

def load_history(conversation_id: str) -> List[Dict[str, Any]]:
    """
    Charge l'historique d'une conversation spécifique depuis la DB
    et le formate dans le style attendu par l'API OpenAI (liste de messages).
    """
    
    db: Session = SessionLocal() # Ouvre la session de DB
    try:
        # 1. Exécution de la requête SQLAlchemy
        history_records = db.query(ConversationHistory) \
                            .filter(ConversationHistory.conversation_id == conversation_id) \
                            .order_by(ConversationHistory.timestamp) \
                            .all() # Récupère tous les résultats
        
        # 2. Transformation des objets SQLAlchemy en format compatible OpenAI
        # Format : [{"role": "user", "content": "Bonjour"}, ...]
        formatted_history = [
            {"role": record.role, "content": record.content}
            for record in history_records
        ]
        
        return formatted_history
        
    finally:
        # 3. Fermeture de la session
        db.close()

def save_message(data: Dict[str, Any]):
    """
    Crée et enregistre un nouvel enregistrement de message (utilisateur ou AI) dans la base de données.
    data doit contenir 'conversation_id', 'role' et 'content'.
    """
    db: Session = SessionLocal() # Ouvre la session de DB
    try:
        # 1. Crée une nouvelle instance du Modèle DB
        db_message = ConversationHistory(
            conversation_id=data["conversation_id"],
            role=data["role"],
            content=data["content"]
        )
        
        # 2. Ajoute l'objet à la session
        db.add(db_message)
        
        # 3. Valide la transaction (sauvegarde permanente)
        db.commit()
        
        # 4. Rafraîchit l'objet pour obtenir son ID (bonne pratique)
        db.refresh(db_message)
        
    finally:
        # 5. Ferme la session
        db.close()



def get_ai_response(conversation_id: str, new_message_content: str, choix_model: str) -> str:
    """
    Prépare le prompt, appelle l'API OpenAI et retourne la réponse textuelle.
    """
    
    # 1. Initialisation du client OpenAI avec la clé secrète
    # Le client utilise automatiquement la variable OPENAI_API_KEY
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    # 2. Chargement de l'historique de la DB
    history = load_history(conversation_id)
    
    # 3. Construction de la liste des messages pour l'API
    # Le format doit être : [System Prompt, Ancien Historique, Nouveau Message User]
    messages = [
        {"role": "system", "content": settings.SYSTEM_PROMPT},
    ]
    messages.extend(history)
    messages.append({"role": "user", "content": new_message_content})

    # 4. Appel à l'API de complétion de chat
    response = client.chat.completions.create(
        model=choix_model, # Modèle standard pour les chats rapides
        messages=messages,
        temperature=0.7,
    )
    
    # 5. Extraction du contenu de la réponse de l'IA
    ai_content = response.choices[0].message.content
    
    return ai_content