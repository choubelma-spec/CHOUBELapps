# CHOUBEL CONSULTING — application web

Site public (3 pôles) + comptes clients + back-office, avec base de données.
Stack : **Next.js** (front + back-end réunis) + **PostgreSQL** (via Prisma).

## Ce que contient l'application

- **Site public** : Accueil, Services, À propos, Contact (formulaire → enregistré en base)
- **Comptes clients** : inscription, connexion, espace client (suivi de leurs demandes, nouvelle demande)
- **Back-office** : connexion admin, liste de toutes les demandes (3 pôles), détail avec changement de statut et note interne
- **Pôles couverts** : Choubel Consulting (conseil), Négoce & Facilitation (agroalimentaire, aéronefs, hydrocarbures), SecondLifeMaroc (médical, immobilier, administratif)

## 1. Créer la base de données (gratuit)

La solution la plus simple et économique : **Neon** (https://neon.tech) ou **Supabase** (https://supabase.com).
1. Créer un compte, créer un nouveau projet Postgres
2. Copier l'URL de connexion fournie (commence par `postgresql://...`)

## 2. Installer et lancer en local

```bash
npm install
cp .env.example .env
# éditer .env : coller DATABASE_URL, générer AUTH_SECRET (ex. openssl rand -base64 32),
# renseigner ADMIN_EMAIL / ADMIN_PASSWORD pour le premier compte back-office

npx prisma db push       # crée les tables dans la base
npx prisma db seed       # crée le compte administrateur
npm run dev              # http://localhost:3000
```

Connectez-vous sur `/connexion` avec l'ADMIN_EMAIL / ADMIN_PASSWORD choisis pour accéder au back-office (`/admin`).
**Changez ce mot de passe dès que possible** (pas d'interface de changement de mot de passe pour l'instant — à faire directement en base ou en relançant le seed avec un nouveau mot de passe après avoir supprimé le compte).

## 3. Déployer (le plus simple)

**Vercel** (https://vercel.com) — gratuit pour ce volume de trafic :
1. Pousser ce projet sur un dépôt GitHub
2. Sur Vercel : "Add New… → Project", importer le dépôt
3. Dans les réglages du projet → Environment Variables, ajouter `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
4. Déployer. Une fois en ligne, exécuter une fois `npx prisma db seed` (en local, pointé vers la base de production via `DATABASE_URL`) pour créer le compte admin
5. Dans "Domains", brancher **www.cabinetchoubel.com** (ajouter les enregistrements DNS indiqués chez votre registrar)

## Structure du projet

```
app/
  page.js                        Accueil (3 pôles)
  services/page.js                Services détaillés
  a-propos/page.js                À propos
  contact/page.js                 Contact (formulaire public)
  connexion/, inscription/        Authentification
  espace-client/                  Espace client (protégé)
  admin/                          Back-office (protégé, réservé aux comptes ADMIN)
  api/auth/                       Connexion / inscription / déconnexion
  api/demandes/                   Création et gestion des demandes
lib/
  prisma.js, session.js, password.js, get-session.js
middleware.js                     Protège /espace-client et /admin
prisma/schema.prisma              Modèle de données
prisma/seed.js                    Crée le premier compte admin
```

## À faire avant la mise en ligne définitive

1. **Logo et visuels** : remplacer le texte "CHOUBEL CONSULTING" (`app/layout.js`) par une image dès réception du logo
2. **Coordonnées réelles** : dans `app/contact/page.js`, remplacer les e-mails d'exemple
3. **Notifications par e-mail** : actuellement, une nouvelle demande n'est visible que dans le back-office. Pour recevoir un e-mail à chaque nouvelle demande, brancher un service comme Resend (https://resend.com) dans `app/api/demandes/route.js`
4. **Gestion du mot de passe** : pas d'écran "mot de passe oublié" pour l'instant — à ajouter si plusieurs personnes doivent accéder au back-office
