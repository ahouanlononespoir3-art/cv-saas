# CVPro AI — SaaS de génération de CV par IA

Application SaaS complète de génération de CV et lettres de motivation par IA.

---

## Stack technique

| Couche          | Technologie                        |
|-----------------|------------------------------------|
| Frontend        | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend         | Next.js API Routes (Node.js)       |
| Base de données | PostgreSQL + Prisma ORM            |
| Authentification| NextAuth.js v5 (Email + Google)    |
| IA              | Anthropic Claude API               |
| Paiement        | Stripe                             |
| Export PDF      | @react-pdf/renderer                |
| Export DOCX     | docx                               |
| Déploiement     | Vercel + Docker                    |

---

## Arborescence

```
cv-saas/
├── prisma/
│   └── schema.prisma          # Modèles DB
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Layout global
│   │   ├── globals.css        # Styles globaux
│   │   ├── (auth)/            # Pages auth (login, register, forgot)
│   │   ├── dashboard/         # Dashboard (CV, lettres, settings)
│   │   └── api/               # API Routes
│   │       ├── auth/          # NextAuth + register + forgot-password
│   │       ├── cv/            # CRUD CV
│   │       ├── letters/       # CRUD lettres
│   │       ├── ai/            # Génération IA (CV + lettre)
│   │       ├── export/        # PDF + DOCX
│   │       ├── stripe/        # Checkout + webhook + portal
│   │       ├── upload/        # Import PDF
│   │       └── user/          # Profil utilisateur
│   ├── components/
│   │   ├── cv/                # Preview, templates, selector
│   │   ├── dashboard/         # Sidebar, Header
│   │   └── forms/             # Formulaires (PersonalInfo, Education, etc.)
│   ├── lib/
│   │   ├── auth.ts            # Config NextAuth
│   │   ├── prisma.ts          # Client Prisma
│   │   ├── stripe.ts          # Client Stripe
│   │   ├── ai.ts              # Service IA (Claude)
│   │   ├── email.ts           # Envoi d'emails
│   │   └── utils.ts           # Utilitaires
│   ├── middleware.ts           # Protection des routes
│   └── types/
│       └── index.ts           # Types TypeScript
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── nginx/nginx.conf
├── vercel.json
└── package.json
```

---

## 🚀 Démarrage rapide (développement)

### 1. Cloner et installer

```bash
git clone https://github.com/votre-repo/cv-saas.git
cd cv-saas
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditez `.env` avec vos clés :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cvpro_db"
AUTH_SECRET="votre-secret-minimum-32-caracteres"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ANTHROPIC_API_KEY="sk-ant-..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PREMIUM_PRICE_ID="price_..."
```

### 3. Configurer PostgreSQL

Option A — Docker (recommandé) :
```bash
docker run -d \
  --name cvpro_db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=cvpro_db \
  -p 5432:5432 \
  postgres:16-alpine
```

Option B — PostgreSQL local : Créez la base `cvpro_db`.

### 4. Initialiser la base de données

```bash
npx prisma generate
npx prisma db push
```

### 5. Lancer en développement

```bash
npm run dev
```

Ouvrez http://localhost:3000

---

## ⚙️ Configuration des services externes

### Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un projet → APIs & Services → Credentials
3. OAuth 2.0 Client ID → Web application
4. Authorized redirect URIs : `http://localhost:3000/api/auth/callback/google`
5. Copiez `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`

### Anthropic (Claude AI)

1. Créez un compte sur [anthropic.com](https://www.anthropic.com)
2. API Keys → Create Key
3. Copiez dans `ANTHROPIC_API_KEY`

### Stripe

1. Créez un compte [stripe.com](https://stripe.com)
2. Dashboard → Developers → API Keys → copiez les clés
3. Créez un produit (Premium 9,99€/mois) → copiez le Price ID
4. Webhooks → Add endpoint : `https://votre-domaine.com/api/stripe/webhook`
   - Events : `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`
5. Copiez le Signing Secret dans `STRIPE_WEBHOOK_SECRET`

Test Stripe CLI (développement) :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Email (SMTP)

Pour Gmail :
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre@gmail.com
EMAIL_SERVER_PASSWORD=votre-app-password  # Mot de passe d'application Gmail
EMAIL_FROM="CVPro AI <noreply@cvpro.ai>"
```

---

## 🐳 Déploiement Docker

### Production complète

```bash
# Copiez et configurez les variables
cp .env.example .env
nano .env  # Remplissez toutes les variables

# Build et démarrage
docker-compose up -d --build

# Initialiser la DB
docker-compose exec app npx prisma db push
```

Accès : http://localhost:3000

### Mise à jour

```bash
docker-compose pull
docker-compose up -d --build
```

---

## ▲ Déploiement Vercel (recommandé)

### 1. Préparer la base de données (Neon / Supabase)

Option Neon (gratuit) :
```bash
# Créez un compte sur neon.tech
# Créez un projet → copiez la connection string
```

### 2. Déployer

```bash
npm install -g vercel
vercel login
vercel --prod
```

### 3. Configurer les variables d'environnement

Dans le dashboard Vercel → Settings → Environment Variables :
- Ajoutez toutes les variables de `.env.example`
- Pour `NEXT_PUBLIC_APP_URL` : mettez votre domaine Vercel

### 4. Initialiser la DB en production

```bash
DATABASE_URL="postgresql://..." npx prisma db push
```

### 5. Configurer le webhook Stripe

Mettez à jour l'URL du webhook dans Stripe Dashboard :
`https://votre-app.vercel.app/api/stripe/webhook`

---

## 📜 Scripts disponibles

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run start        # Démarrage production
npm run db:push      # Push schema vers DB
npm run db:migrate   # Migrations (production)
npm run db:generate  # Générer le client Prisma
npm run db:studio    # Interface visuelle DB
```

---

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt (rounds: 12)
- Sessions JWT sécurisées via NextAuth
- Validation Zod sur toutes les entrées API
- Vérification de signature Stripe sur les webhooks
- Protection CSRF via NextAuth
- Headers de sécurité via Nginx
- Isolation par userId sur toutes les données

---

## 💳 Plans et limites

| Feature          | Gratuit | Premium (9,99€/mois) |
|------------------|---------|----------------------|
| CV par mois      | 2       | Illimités            |
| Lettres par mois | 2       | Illimitées           |
| Templates        | 3       | 5 (tous)             |
| Export PDF       | ✅      | ✅                   |
| Export DOCX      | ❌      | ✅                   |
| Score ATS        | Basique | Avancé               |

---

## 📧 Support

Pour toute question technique : dev@cvpro.ai
