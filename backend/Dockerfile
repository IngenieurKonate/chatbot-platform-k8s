# Dockerfile

# 1. Image de base
FROM python:3.11-slim-buster

# 2. Définir le répertoire de travail
WORKDIR /backend 

# 3. Copier les dépendances et les installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copier le code source de l'application
COPY . .

# 5. Déclarer le port d'écoute (standard pour FastAPI/Uvicorn)
EXPOSE 8000

# 6. Démarrer le serveur
# Nous omettons --reload et utilisons --host 0.0.0.0 pour l'accessibilité du conteneur
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]