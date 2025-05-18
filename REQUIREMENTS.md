## 🧾 Apocalypse Readiness Assessor – Hackathon Project Requirements (Agent-Readable Format)

### 🧠 Summary
This is a single-page React + TypeScript web app themed after 90s apocalypse films. Users choose an apocalypse scenario and answer five hardcoded short-answer questions. An LLM evaluates their survival likelihood based on a templated prompt. Scores are usually 0%, with comedic exceptions. Stretch goal: leaderboard with simple persistence (no auth).

---

### 🔧 Tech Stack
- **Frontend**: React (with TypeScript)
- **Styling**: TailwindCSS (preferred for rapid theme iteration)
- **Backend**: Node.js (Express or similar), colocated in monorepo
- **LLM Integration**: Initially OpenAI (via API route or function)
- **Storage (Stretch Goal)**: SQLite or Supabase (no auth)

---

### 📁 Monorepo Structure (Suggested)

\```
/apps
  /web       → React frontend SPA
  /api       → Node/Express backend
/packages
  /ui        → Shared UI components (e.g., Card, Input)
  /lib       → Shared utilities (e.g., LLM prompt templates)
\```

---

### 🖥️ UI/UX Requirements

#### 1. **Main View (Single Page App)**
- Dropdown: Select Apocalypse Scenario (predefined list)
- Display: Themed background (image + color palette per scenario)
- 5 Short Answer Questions (hardcoded per scenario)
- Submit button: triggers score evaluation

#### 2. **Result Display**
- Comedic, exaggerated styling (e.g., CRT text, alert red, pixel fonts)
- Survival Score (0–100%) with over-the-top LLM-generated verdict
- Option to restart with a new scenario

#### 3. **Leaderboard (Stretch Goal)**
- Accessible via `/leaderboard` route
- Displays top user entries by score
- User provides name/alias with submission (no login required)

---

### 📦 Data Models

#### ApocalypseScenario

\```ts
type ApocalypseScenario = {
  id: string; // e.g. 'zombie'
  name: string; // e.g. 'Zombie Outbreak'
  theme: {
    image: string; // path to background image
    colorPalette: string[]; // Tailwind-compatible
  };
  questions: string[]; // 5 unique survival questions
  promptTemplate: string; // Template for LLM evaluation
};
\```

#### Submission (Stretch)

\```ts
type Submission = {
  id: string;
  scenarioId: string;
  answers: string[];
  name: string;
  score: number;
  feedback: string; // LLM-generated commentary
  timestamp: string;
};
\```

---

### 🤖 LLM Prompting Logic

#### Template (per scenario)

\```txt
Given the following apocalypse scenario and user answers, evaluate their likelihood of survival. Respond with:
1. A survival score from 0–100.
2. A brief comment explaining the reasoning in a sarcastic or dramatic tone.

Scenario: Zombie Outbreak  
Answers:
1. [User input]
2. [User input]
3. ...
\```

- Normally return score = 0–5%
- Rarely allow 10–50% if responses are clever/funny
- Ensure response includes both score and commentary

---

### 📈 Stretch Goals
- Leaderboard with persistence (no auth)
- User-defined apocalypse scenario + AI-generated questions
- Exportable certificate/badge (PNG or PDF)
- Sound effects or 90s-themed UI transitions

---

### 🧪 Development & AI Agent Notes
- Use modular structure for easy override (e.g., scenario config, prompt generation)
- Build mobile-first layout (no dark mode required)
- Theming must change based on selected scenario
- Frontend and backend to be scaffolded independently, but share types
