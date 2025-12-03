from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Paramètres chargés automatiquement depuis l'environnement
    (variables d'environnement ou fichier .env local)
    """
    # Clé secrète OpenAI (sera un Kubernetes Secret)
    OPENAI_API_KEY: str 
    
    #RL de connexion à la DB (sera dans un Kubernetes Secret ou ConfigMap)
    # Nous gardons la valeur SQLite par défaut pour le développement local
    DATABASE_URL: str
    #L'instruction principale du chatbot (sera dans une ConfigMap)
    SYSTEM_PROMPT: str 

    class Config:
        # Fichier .env pour le développement local
        env_file = ".env"

# On crée une seule instance des paramètres
settings = Settings()