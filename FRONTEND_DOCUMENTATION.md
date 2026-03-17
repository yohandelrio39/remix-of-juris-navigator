# Documentation technique du frontend — SKANDAMIS Legal Research

> **Destinataire** : Agent de développement back-end (Claude Code)  
> **Dernière mise à jour** : Mars 2026  
> **Stack** : React 18 · Vite 5 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui (Radix)

---

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Structure des dossiers](#2-structure-des-dossiers)
3. [Architecture des composants](#3-architecture-des-composants)
4. [Routage et navigation](#4-routage-et-navigation)
5. [Intégration des données (Contrats d'API)](#5-intégration-des-données-contrats-dapi)
6. [Styles et mise en page](#6-styles-et-mise-en-page)
7. [Gestion des formulaires et entrées utilisateur](#7-gestion-des-formulaires-et-entrées-utilisateur)
8. [Tests et qualité du code](#8-tests-et-qualité-du-code)
9. [Optimisation des performances](#9-optimisation-des-performances)
10. [Instructions de configuration et de développement](#10-instructions-de-configuration-et-de-développement)

---

## 1. Vue d'ensemble du projet

### Objectif

Application web de **pré-recherche de jurisprudences** pour l'**Étude SKANDAMIS**, un cabinet d'avocats basé à Genève spécialisé en **droit pénal suisse**.

L'outil permet à un avocat de :
1. Décrire un cas juridique (texte libre, dictée vocale ou upload de documents)
2. Répondre à des questions de clarification générées par l'IA
3. Obtenir une liste de jurisprudences pertinentes classées par score de pertinence
4. Organiser les résultats dans des dossiers

### Public cible

- Avocats pénalistes de l'Étude SKANDAMIS (Genève)
- Interface entièrement en **français**

### Cas d'utilisation principaux

| # | Cas d'utilisation | Description |
|---|---|---|
| 1 | Recherche par texte | L'avocat décrit les faits / la question juridique |
| 2 | Dictée vocale | Enregistrement audio → transcription → recherche |
| 3 | Upload de documents | PDF/Word → extraction de texte → recherche |
| 4 | Clarification IA | Le système pose des questions pour affiner la recherche |
| 5 | Consultation des résultats | Liste triée par pertinence, résumés, liens vers sources |
| 6 | Gestion de dossiers | Organiser les jurisprudences trouvées par affaire |

### Technologies principales

| Technologie | Version | Rôle |
|---|---|---|
| React | ^18.3.1 | Framework UI |
| Vite | ^5.4.19 | Bundler / Dev server (SWC) |
| TypeScript | ^5.8.3 | Typage statique |
| Tailwind CSS | ^3.4.17 | Styles utilitaires |
| shadcn/ui (Radix) | — | Composants UI accessibles |
| React Router | ^6.30.1 | Routage côté client |
| TanStack React Query | ^5.83.0 | Cache de données (disponible, pas encore utilisé) |
| Lucide React | ^0.462.0 | Icônes |
| Zod | ^3.25.76 | Validation de schémas |
| React Hook Form | ^7.61.1 | Gestion de formulaires (disponible) |

---

## 2. Structure des dossiers

```
├── public/                     # Assets statiques (favicon, robots.txt)
├── src/
│   ├── assets/                 # Images et ressources importées
│   ├── components/
│   │   ├── layout/             # Composants de mise en page
│   │   │   ├── AppLayout.tsx   # Layout principal (sidebar + contenu)
│   │   │   └── Sidebar.tsx     # Navigation latérale avec dossiers
│   │   ├── results/            # Affichage des résultats
│   │   │   ├── ResultCard.tsx  # Carte individuelle de jurisprudence
│   │   │   └── ResultsList.tsx # Liste complète des résultats
│   │   ├── search/             # Entrée de recherche
│   │   │   ├── SearchInputPanel.tsx    # Panneau principal (3 onglets)
│   │   │   ├── TextInput.tsx           # Textarea pour texte libre
│   │   │   ├── VoiceRecorder.tsx       # Enregistrement / transcription
│   │   │   ├── FileUpload.tsx          # Drag & drop de fichiers
│   │   │   └── ClarificationQuestions.tsx # Questions de clarification
│   │   ├── ui/                 # Composants shadcn/ui (ne pas modifier)
│   │   └── NavLink.tsx         # Lien de navigation
│   ├── data/
│   │   └── mockData.ts         # Données de démonstration
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Détection mobile
│   │   └── use-toast.ts        # Système de notifications
│   ├── lib/
│   │   └── utils.ts            # Utilitaire cn() (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Index.tsx           # Page principale (orchestrateur)
│   │   └── NotFound.tsx        # Page 404
│   ├── services/
│   │   └── api.ts              # Client API REST (vers FastAPI)
│   ├── types/
│   │   └── index.ts            # Types TypeScript partagés
│   ├── test/
│   │   ├── setup.ts            # Configuration Vitest
│   │   └── example.test.ts     # Test d'exemple
│   ├── App.tsx                 # Point d'entrée React (providers + routes)
│   ├── App.css                 # Styles globaux additionnels
│   ├── index.css               # Design system (CSS variables + Tailwind)
│   └── main.tsx                # Point d'entrée Vite
├── index.html                  # HTML template
├── tailwind.config.ts          # Configuration Tailwind étendue
├── vite.config.ts              # Configuration Vite
├── tsconfig.json               # Configuration TypeScript
├── components.json             # Configuration shadcn/ui
└── package.json                # Dépendances et scripts
```

### Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `SearchInputPanel.tsx` |
| Hooks | camelCase avec préfixe `use-` | `use-mobile.tsx` |
| Services | camelCase | `api.ts` |
| Types | PascalCase (interfaces) | `JurisprudenceResult` |
| Dossiers | kebab-case | `search/`, `results/` |

---

## 3. Architecture des composants

### Hiérarchie complète

```
App.tsx
├── QueryClientProvider (TanStack)
├── TooltipProvider (Radix)
├── Toaster (shadcn)
├── Sonner (notifications)
└── BrowserRouter
    └── Routes
        ├── "/" → Index.tsx (page principale)
        │   └── AppLayout
        │       ├── Sidebar
        │       │   ├── Logo SKANDAMIS
        │       │   ├── Navigation (Nouvelle recherche / Dossiers)
        │       │   └── Profil utilisateur
        │       └── <main> (contenu dynamique selon step)
        │           ├── [step='search'] → SearchInputPanel
        │           │   ├── Tabs (Texte / Dictée / Documents)
        │           │   ├── TextInput
        │           │   ├── VoiceRecorder
        │           │   └── FileUpload
        │           ├── [step='clarification'] → ClarificationQuestions
        │           │   ├── Select (questions à choix)
        │           │   └── Input (questions ouvertes)
        │           └── [step='results'] → ResultsList
        │               └── ResultCard (× N)
        └── "*" → NotFound
```

### Machine à états (flux applicatif)

Le composant `Index.tsx` gère un flux en 3 étapes via `useState<AppStep>` :

```
┌──────────┐     API: /api/search      ┌─────────────────┐     API: /api/search/execute     ┌──────────┐
│  search  │ ──────────────────────────→│  clarification  │ ────────────────────────────────→│ results  │
└──────────┘                            └─────────────────┘                                  └──────────┘
     ↑                                                                                           │
     └───────────────────────────── handleNewSearch() ───────────────────────────────────────────┘
```

### Gestion de l'état

L'état est géré **localement** dans `Index.tsx` via `useState` :

```typescript
// États principaux dans Index.tsx
const [step, setStep] = useState<AppStep>('search');           // Étape courante
const [isLoading, setIsLoading] = useState(false);             // Chargement
const [showClarification, setShowClarification] = useState(false);
const [results, setResults] = useState<JurisprudenceResult[]>([]);
const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
const [originalSearchRequest, setOriginalSearchRequest] = useState<{
  text: string;
  files: UploadedDocument[];
} | null>(null);
```

### Flux de données

```
Utilisateur → SearchInputPanel → handleSearchSubmit()
  → api.search(request)
  → Réponse du backend :
    ├── needsClarification=true → setClarificationQuestions() → ClarificationQuestions
    │     → handleClarificationSubmit(answers)
    │       → api.executeSearch(request, clarifications)
    │       → setResults() → ResultsList
    └── needsClarification=false → setResults() → ResultsList
```

---

## 4. Routage et navigation

### Configuration des routes (`App.tsx`)

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

**Seules 2 routes existent.** La navigation entre les étapes (search → clarification → results) est gérée par l'**état applicatif** (`step`), pas par des routes URL distinctes.

### Navigation interne

| Action | Déclencheur | Résultat |
|---|---|---|
| Soumettre une recherche | Bouton "Confirmer et analyser" | `step → 'clarification'` ou `'results'` |
| Répondre aux clarifications | Bouton "Lancer la recherche" | `step → 'results'` |
| Nouvelle recherche | Bouton "← Nouvelle recherche" | `step → 'search'` (reset complet) |

### Sidebar

La sidebar (`Sidebar.tsx`) contient une navigation entre :
- **Nouvelle recherche** (section active par défaut)
- **Dossiers** (liste dépliable avec les dossiers existants)

> ⚠️ Actuellement, la sidebar utilise des **données mock** (`mockDossiers`). Le backend devra fournir les endpoints pour la gestion réelle des dossiers.

---

## 5. Intégration des données (Contrats d'API)

### Configuration

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

Le frontend attend un backend **FastAPI** accessible via `VITE_API_URL`.

### Types TypeScript partagés (`src/types/index.ts`)

```typescript
export interface SearchRequest {
  textInput?: string;
  audioTranscription?: string;
  uploadedDocuments?: UploadedDocument[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;       // MIME type (e.g. "application/pdf")
  size: number;        // en bytes
  extractedText?: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  type: 'select' | 'text';
  options?: string[];  // requis si type='select'
  answer?: string;
}

export interface JurisprudenceResult {
  id: string;
  title: string;
  jurisdiction: string;
  date: string;        // format "DD.MM.YYYY"
  relevanceScore: number; // 0-100
  summary: string;
  sourceUrl: string;
  dossierId?: string;
}

export interface Dossier {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  searchCount: number;
}
```

### Endpoints REST attendus

#### 1. `GET /api/health`

Vérification de l'état du service.

**Réponse attendue :**
```json
{
  "status": "healthy",
  "service": "skandamis-api",
  "version": "1.0.0"
}
```

#### 2. `POST /api/search`

Analyse initiale de la requête. Le backend doit analyser le texte/documents et retourner soit des questions de clarification, soit des résultats directs.

**Corps de la requête :**
```json
{
  "textInput": "Mon client a été arrêté pour vol...",
  "uploadedDocuments": [
    {
      "id": "doc-1",
      "name": "plainte.pdf",
      "type": "application/pdf",
      "size": 245000,
      "extractedText": "Contenu extrait du document..."
    }
  ]
}
```

**Réponse — Cas 1 : Clarification nécessaire**
```json
{
  "needsClarification": true,
  "clarificationQuestions": [
    {
      "id": "q1",
      "question": "Quel est le stade de la procédure ?",
      "type": "select",
      "options": ["Instruction", "Première instance", "Appel", "Tribunal fédéral"]
    },
    {
      "id": "q2",
      "question": "Y a-t-il des antécédents judiciaires ?",
      "type": "select",
      "options": ["Oui", "Non", "Non précisé"]
    }
  ]
}
```

**Réponse — Cas 2 : Résultats directs**
```json
{
  "needsClarification": false,
  "results": [
    {
      "id": "1",
      "title": "ATF 147 IV 73 - Vol avec effraction",
      "jurisdiction": "Tribunal fédéral",
      "date": "15.03.2023",
      "relevanceScore": 94,
      "summary": "Le Tribunal fédéral a confirmé...",
      "sourceUrl": "https://www.bger.ch/..."
    }
  ]
}
```

#### 3. `POST /api/search/execute`

Exécution de la recherche avec les réponses aux questions de clarification.

**Corps de la requête :**
```json
{
  "textInput": "Mon client a été arrêté pour vol...",
  "uploadedDocuments": [],
  "clarifications": {
    "answers": {
      "q1": "Première instance",
      "q2": "Non, casier vierge"
    }
  }
}
```

**Réponse :** Tableau de `JurisprudenceResult[]` (même structure que ci-dessus).

#### 4. `POST /api/dossiers?name={name}`

Création d'un nouveau dossier.

**Réponse attendue :**
```json
{
  "id": "dossier-uuid",
  "name": "Affaire Dupont",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "searchCount": 0
}
```

#### 5. `POST /api/dossiers/{dossierId}/results?result_id={resultId}`

Ajouter une jurisprudence à un dossier existant.

**Réponse :** Confirmation JSON (structure libre).

### Gestion des erreurs

Le frontend s'attend à recevoir les erreurs sous la forme :
```json
{
  "detail": "Message d'erreur lisible"
}
```

Les erreurs sont affichées via le système de **toast** (notification en bas de l'écran).

### CORS

Le backend doit autoriser les requêtes CORS depuis l'origine du frontend (en développement : `http://localhost:8080`).

---

## 6. Styles et mise en page

### Design System

Le design system est défini dans **`src/index.css`** via des CSS custom properties HSL :

```css
:root {
  --background: 220 14% 96%;      /* Gris chaud clair */
  --foreground: 220 25% 10%;      /* Quasi noir */
  --primary: 220 20% 16%;         /* Charbon profond */
  --accent: 152 60% 42%;          /* Émeraude (succès/scores) */
  --warning: 28 85% 60%;          /* Orange doux */
  --destructive: 0 72% 51%;       /* Rouge */
  --border: 220 14% 90%;
  --radius: 0.75rem;
  /* ... + mode dark complet */
}
```

### Polices

| Usage | Police | Poids |
|---|---|---|
| Corps de texte | Inter | 300–700 |
| Titres (h1, h2, h3) | Playfair Display | 500–700 |

Chargées via Google Fonts dans `index.css`.

### Classes utilitaires custom

Définies dans `index.css` sous `@layer components` :

| Classe | Usage |
|---|---|
| `.card-elevated` | Cartes avec ombre et hover effect |
| `.score-badge` / `.score-badge-high` / `-medium` / `-low` | Badges de score colorés |
| `.recording-pulse` | Animation de pulsation pour l'enregistrement vocal |
| `.nav-item` / `.nav-item.active` | Items de navigation sidebar |
| `.input-focus-ring` | Focus ring uniforme |
| `.file-drop-zone` / `.file-drop-zone.drag-over` | Zone de dépôt de fichiers |
| `.scrollbar-thin` | Scrollbar fine et stylée |

### Couleurs de score

Les scores de pertinence utilisent un code couleur :
- **≥ 80%** : vert (`--score-high` / `success`)
- **≥ 60%** : orange (`--score-medium` / `warning`)
- **< 60%** : rouge (`--score-low` / `destructive`)

### Responsive

- **Desktop** (≥ 1024px) : Sidebar permanente + contenu principal
- **Mobile** (< 1024px) : Sidebar en overlay avec bouton hamburger
- Contenu principal limité à `max-w-5xl` (1280px) centré
- Tabs de recherche : labels texte masqués sur mobile (`hidden sm:inline`), icônes seules

### Animations

Définies dans `tailwind.config.ts` :

| Animation | Durée | Usage |
|---|---|---|
| `fade-in` | 300ms | Entrée des composants |
| `slide-in-left` | 300ms | Entrée latérale |
| `pulse-soft` | 2s (infini) | Bouton d'enregistrement actif |
| `accordion-down/up` | 200ms | Accordéons |

---

## 7. Gestion des formulaires et entrées utilisateur

### SearchInputPanel (3 modes d'entrée)

#### Onglet "Texte" (`TextInput.tsx`)

- Composant wrapper autour de `<Textarea>` (shadcn)
- `min-h-[120px]`, non-redimensionnable
- Valeur contrôlée via `useState` dans `SearchInputPanel`

#### Onglet "Dictée" (`VoiceRecorder.tsx`)

- Utilise `navigator.mediaDevices.getUserMedia({ audio: true })`
- `MediaRecorder` API pour l'enregistrement
- **Actuellement mockée** : retourne une transcription statique après 1.5s
- Le backend devra fournir un endpoint de transcription audio (Whisper, etc.)
- La transcription est ajoutée au champ texte

#### Onglet "Documents" (`FileUpload.tsx`)

- Drag & drop + input file classique
- Formats acceptés : `.pdf`, `.doc`, `.docx`
- Taille max affichée : 10 MB
- **Actuellement mockée** : simule l'extraction de texte (`extractedText`)
- Le backend devra fournir un endpoint d'extraction de texte depuis les documents

### ClarificationQuestions

- Génère dynamiquement des `<Select>` ou `<Input>` selon le `type` de chaque question
- Validation : toutes les questions doivent être répondues (`allAnswered`)
- Les réponses sont envoyées comme `Record<string, string>` (id → réponse)

### Validation

- Validation minimale côté client : `hasInput` vérifie qu'il y a du texte ou des fichiers
- `allAnswered` pour les questions de clarification
- **Zod** et **React Hook Form** sont installés mais pas encore utilisés

### Soumission

```typescript
// SearchInputPanel → Index.tsx
onSubmit({ text: combinedText, files: uploadedFiles })

// ClarificationQuestions → Index.tsx
onSubmit(answers: Record<string, string>)
```

---

## 8. Tests et qualité du code

### Framework de test

| Outil | Rôle |
|---|---|
| Vitest | Test runner |
| @testing-library/react | Rendu de composants |
| @testing-library/jest-dom | Matchers DOM |
| jsdom | Environnement DOM simulé |

### Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
```

### État actuel

- **Couverture minimale** : un seul fichier `example.test.ts` existe
- Les outils sont en place pour ajouter des tests unitaires et d'intégration

### Scripts

```bash
npm run test        # Exécution unique
npm run test:watch  # Mode watch
```

### Linting

- ESLint 9 avec `typescript-eslint`
- Plugins : `react-hooks`, `react-refresh`

```bash
npm run lint
```

---

## 9. Optimisation des performances

### Techniques en place

| Technique | Détail |
|---|---|
| **Vite + SWC** | Compilation ultra-rapide (SWC au lieu de Babel) |
| **Tree-shaking** | Vite élimine le code mort automatiquement |
| **Composants atomiques** | shadcn/ui — imports individuels, pas de bundle monolithique |
| **Animations CSS** | Préférence aux animations CSS plutôt qu'aux animations JS |
| **`useCallback`** | Utilisé dans `VoiceRecorder` et `FileUpload` pour éviter les re-renders |

### Optimisations potentielles (non implémentées)

| Technique | Recommandation |
|---|---|
| **React.lazy()** | Lazy-loading des pages/composants lourds |
| **React Query** | Installé mais pas utilisé — idéal pour le cache des résultats |
| **Virtualisation** | Pour les longues listes de résultats (si > 100 items) |
| **Service Worker** | Cache offline des jurisprudences consultées |

### HMR

Hot Module Replacement activé en développement. L'overlay d'erreur est désactivé :

```typescript
// vite.config.ts
server: {
  hmr: { overlay: false }
}
```

---

## 10. Instructions de configuration et de développement

### Prérequis

| Outil | Version |
|---|---|
| Node.js | ≥ 18 |
| npm / bun / pnpm | Dernière version |

### Installation

```bash
git clone <repository-url>
cd skandamis-frontend
npm install
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# URL du backend FastAPI
VITE_API_URL=http://localhost:8000
```

### Scripts de développement

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de développement (port 8080) |
| `npm run build` | Build de production |
| `npm run build:dev` | Build en mode développement |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | Lint du code |
| `npm run test` | Exécution des tests |
| `npm run test:watch` | Tests en mode watch |

### Alias de chemins

```typescript
// tsconfig.json → paths
"@/*" → "./src/*"

// Utilisation dans le code
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
```

### Port de développement

Le serveur Vite écoute sur le **port 8080** (pas le 3000 par défaut) :

```typescript
// vite.config.ts
server: {
  host: "::",   // Écoute sur toutes les interfaces
  port: 8080
}
```

### Checklist pour le backend

Le backend FastAPI doit :

- [ ] Implémenter les 5 endpoints REST documentés en section 5
- [ ] Retourner les erreurs au format `{ "detail": "..." }`
- [ ] Configurer CORS pour `http://localhost:8080` (dev) et l'URL de production
- [ ] Implémenter la transcription audio (remplacer le mock de `VoiceRecorder`)
- [ ] Implémenter l'extraction de texte depuis PDF/Word (remplacer le mock de `FileUpload`)
- [ ] Générer les questions de clarification via IA
- [ ] Effectuer la recherche de jurisprudences (scraping / base de données)
- [ ] Calculer les scores de pertinence (0-100)
- [ ] Gérer la persistence des dossiers

---

## Annexe : Données mock disponibles

Le fichier `src/data/mockData.ts` contient :

- **10 jurisprudences mock** avec des arrêts réalistes du Tribunal fédéral et de la Cour de justice de Genève
- **3 questions de clarification mock** (stade de la procédure, juridiction, antécédents)

Ces données peuvent servir de référence pour le format exact attendu par le frontend.

---

*Document généré pour faciliter l'intégration backend par l'agent Claude Code.*
