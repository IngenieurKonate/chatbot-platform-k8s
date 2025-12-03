## Tout le code source du backend se trouve dans le fichier "src"
## le fichier "Dockerfile" contient l'image docker du code source
## Les fichiers importants pour le déploiement kubernetes se trouvent dans le dossier k8s/base/backend
  - configma.yaml: contient la variable d'environnement pour le prompt système
  - secret.yaml: contient les variables d'environnement secret (clé api et connection à la db)
  - Service.yaml: contient la config réseaux pour mettre aux autres services d'accéder au backend
  - Deployment.yaml: c'est le fichier de déploiement principale sur kubernetes

## Comment Utiliser le backend

    - Cloner le dépôt GitHub et accéder au repertoire /backend .
    - Construire l'Image docker :  docker build -t chatbot-backend:v1 
    - Créer cluster Kind (kind create cluster --name chatbot-cluster) ou se connecter au cluster s'il existe déjà
    - Charger l'Image dans le cluster: kind load docker-image chatbot-backend:v1 --name [cluster_name]
    - Déployer les Manifests pour lancer les Pods et Services :kubectl apply -f k8s/base/backend/
    (pour rédiriger vers la machine hôte si necessaire -> kubectl port-forward svc/chatbot-backend-service 30080:80)

## NOTE: 

  ### ETudiant A: 
   - le fichier openapi.json contient la décription complète de l'api tu peux l'utiliser pour 
   - le code doit pointer vers uRL = http://chatbot-backend-service:80

   ## Etudiant C
    - Après avoir faire le déployment de la bd postgres, tu dois configurer son URL  dans le fichier 
    k8s/base/backend/secret.yaml en remplaçant la valeur de la variable DATABASE_URL avant de déployer le backend.
    - l'URL de la base de données doit être encodée en Base64. (comme pour le faire: echo -n "postgresql://user:pass@db-service:5432/chatdb" | base64)