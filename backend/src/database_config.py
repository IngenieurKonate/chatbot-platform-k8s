from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

# NOTE : La variable DATABASE_URL sera chargée via python-dotenv pour le dev local
# et via les Secrets/ConfigMap pour Kubernetes
DATABASE_URL = "sqlite:///./test.db" # On utilise SQLite en mock pour l'instant

# 1. Le Moteur (Engine): Gère la connexion
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} # Requis pour SQLite avec FastAPI
)

# 2. La Fabrique de Session: Permet de faire des requêtes (lire/écrire)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. La Base Déclarative: La classe de base pour tous nos modèles
Base = declarative_base()

''' 
Modèle SQLAlchemy pour l'historique des conversations 
'''

class ConversationHistory(Base):
    # Nom de la table dans la base de données
    __tablename__ = "conversation_history"

    #  Clé primaire : identifiant unique pour chaque message
    id = Column(Integer, primary_key=True, index=True)
    
    # Identifiant de la conversation pour lier les messages
    conversation_id = Column(String, index=True, nullable=False)
    
    # Qui parle : 'user', 'assistant' ou 'system'
    role = Column(String, nullable=False)
    
    # Contenu textuel du message
    content = Column(String, nullable=False)
    
    # Horodatage : l'heure actuelle est utilisée par défaut lors de la création
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)