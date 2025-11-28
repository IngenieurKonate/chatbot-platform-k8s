# chatbot-platform-k8s
Ce projet consiste à déployer une plateforme de chat spécialisée (type ChatGPT, mais avec un domaine précis grâce à un prompt système) sur un cluster Kubernetes.
L’objectif pédagogique est de mettre en place une architecture complète frontend – backend – base de données, entièrement orchestrée avec Kubernetes et déployée sur un cluster Kind (Kubernetes IN Docker).

## 1- Architecture de l’application

L’application se compose de trois services principaux :

**Frontend**

- Interface web permettant d’envoyer des messages au chatbot
- Communique avec le backend via API REST
- Déployé dans Kubernetes à partir de son image Docker

**Backend API (Python / FastAPI)**

- Reçoit les messages du frontend
- Interroge l’API OpenAI
- Gère toute la logique (contexte, prompt système, traitement)
- Écrit l’historique dans la base de données

**Base de données (PostgreSQL)**

- Stocke les conversations
- Déployée via Deployment ou StatefulSet
- Volume persistant (PVC) recommandé

## Contribuer
Clonner le depô
```bash
git clone https://github.com/IngenieurKonate/chatbot-platform-k8s.git
```
Accéder au dossier du projet
```bash
cd chatbot-platform-k8s
```
Accéder à sa branche
```bash
git checkout -b feature/backend
git checkout -b feature/frontend
git checkout -b feature/k8s
```
