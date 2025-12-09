# GuideSagesse : Le Flambeau de la Persistance

Salut à toi, Gardien de la Donnée.

Si tu lis ce parchemin, c'est que le Frontend (l'Interface) et le Backend (le Cerveau) sont déjà opérationnels. Ils discutent entre eux, l'IA répond, le design est en place.
Cependant, il manque une pierre angulaire à l'édifice : **La Mémoire.**

Actuellement, le Backend utilise un petit carnet de notes temporaire (SQLite volatile). Si on redémarre, tout s'efface.
**Ta mission est de graver ces conversations dans la pierre.**

---

## Ta Mission Principale

Remplacer le stockage temporaire par une **Base de Données PostgreSQL** robuste et persistante dans notre cluster Kubernetes.

---

## Ton Terrain de Jeu

Tu travailleras essentiellement dans ce dossier :
`k8s/base/database/`

Et tu devras connecter tes tuyaux au Backend.

---

## Tes Étapes (Le Chemin à Suivre)

### 1. Construire le Temple (Kubernetes Manifests)

Dans le dossier `k8s/base/database/`, tu dois créer les fichiers nécessaires pour PostgreSQL.

- **`statefulset.yaml`** : Contrairement au Frontend/Backend qui sont des _Deployments_ (sans état), une base de données doit être un **StatefulSet** pour garder son identité et ses données.
- **`service.yaml`** : Pour que le Backend puisse trouver la base (sur le port 5432).
- **`pvc.yaml` (PersistentVolumeClaim)** : C'est le disque dur virtuel qui survivra même si le pod de la base de données explose.

### 2. Relier les Fils (Configuration Backend)

Le code du Backend est déjà prêt à parler à Postgres (via SQLAlchemy), mais il ne sait pas où il se trouve.
Tu dois modifier le secret du Backend :
Fichier : `k8s/base/backend/secret.yaml`

- Change la variable `DATABASE_URL`.
- Elle pointe actuellement vers un SQLite factice. Remplace-la par l'URL de connexion à ton service Postgres (ex: `postgresql://user:password@database-service:5432/dbname`).
- _(Astuce : N'oublie pas d'encoder tes valeurs en Base64)._

### 3. L'Activation Finale (Kustomization)

Une fois tes fichiers prêts, tu dois dire à Kubernetes de les charger.
Fichier : `k8s/base/kustomization.yaml`

- Cherche la section commentée `# Database`.
- Décommente la ligne qui inclut ton dossier `database/`.
- C'est le seul moment où tu touches à la configuration globale.

---

## Règles d'Or (Sagesse des Anciens)

1.  **Ne touche pas au code Frontend.** Il est fini, il marche.
2.  **Ne touche pas au code Python du Backend.** Il attend juste ta connexion.
3.  **Vérifie la Persistance.** Pour savoir si tu as réussi :
    - Lance le chatbot, parle un peu.
    - Tue le pod de ta base de données (`kubectl delete pod ...`).
    - Quand il redémarre, l'historique de conversation doit toujours être là (invisible au frontend pour l'instant, mais présent dans la base).

Bonne chance. Que ta data soit intègre et tes backups fréquents.
