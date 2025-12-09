FROM node:20-alpine AS base

# 1. Installer les dépendances uniquement lorsque nécessaire
FROM base AS deps
# Vérifier https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine pour comprendre pourquoi libc6-compat peut être nécessaire.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Reconstruire le code source uniquement lorsque nécessaire
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collecte des données de télémétrie totalement anonymes.
# En savoir plus ici : https://nextjs.org/telemetry
# Décommentez la ligne suivante si vous souhaitez désactiver la télémétrie pendant le build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 3. Image de production, copier tous les fichiers et lancer Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Décommentez la ligne suivante si vous souhaitez désactiver la télémétrie pendant l'exécution.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Définir les permissions correctes pour le cache de pré-rendu
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Tirer parti automatiquement des traces de sortie pour réduire la taille de l'image
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# Définir le nom d'hôte sur localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
