# Stalker Karmine 🎮

Suivi en temps réel des matchs de **Karmine Corp** sur League of Legends, Rocket League et Valorant.

**URL de production :** [stalker-karmine.vercel.app](https://stalker-karmine.vercel.app)

## Stack

- **Next.js 14** (App Router, ISR 60s)
- **Tailwind CSS** — design system KC
- **PandaScore API** — données matchs, standings, roster
- **Vercel** — CI/CD depuis GitHub

## Setup local

```bash
# 1. Cloner
git clone https://github.com/<ton-user>/stalker-karmine.git
cd stalker-karmine

# 2. Installer les dépendances
npm install

# 3. Variables d'environnement
cp .env.example .env.local
# Remplir PANDASCORE_TOKEN avec ta clé sur https://pandascore.co

# 4. Lancer en dev
npm run dev
# → http://localhost:3000
```

## Variables d'environnement requises

| Variable | Description |
|---|---|
| `PANDASCORE_TOKEN` | Token API PandaScore (gratuit, 1000 req/h) |

## Pages

| Route | Description |
|---|---|
| `/` | Accueil — live, prochains matchs, win rates |
| `/lol` | Matchs League of Legends |
| `/rl` | Matchs Rocket League |
| `/valorant` | Matchs Valorant |
| `/classements` | Standings par compétition |
| `/match/[game]/[id]` | Détail d'un match |

## Architecture & sécurité

- La clé `PANDASCORE_TOKEN` n'est **jamais exposée côté client** — elle est exclusivement consommée dans les Server Components Next.js (exécution serveur uniquement).
- ISR (Incremental Static Regeneration) toutes les **60 secondes** : zéro WebSocket, charge API minimale.
- `.env` est ignoré par git — ne jamais committer la clé.

## Déploiement Vercel

```
Settings > Environment Variables > PANDASCORE_TOKEN = <valeur>
Settings > General > Project Name = stalker-karmine
→ URL : stalker-karmine.vercel.app
```

---

Projet fan non-officiel. Données © PandaScore. KC © Karmine Corp.
