import { ApocalypseScenario } from "../types";

export const APOCALYPSE_SCENARIOS: ApocalypseScenario[] = [
  {
    id: "zombie",
    name: "Zombie Outbreak",
    theme: {
      image: "/backgrounds/zombie.png",
      colorPalette: ["#2D3436", "#636E72", "#B2BEC3", "#DFE6E9"],
    },
    questions: [
      "What's your first move when you hear about the zombie outbreak?",
      "What's your weapon of choice for the zombie apocalypse?",
      "Where would you set up your base of operations?",
      "What special skill do you bring to a survivor group?",
      "How would you handle encountering an infected loved one?",
    ],
    promptTemplate: `Given the following zombie apocalypse scenario and user answers, evaluate their likelihood of survival. Channel comedian Bill Burr's style throughout ALL sections - use his direct, cynical, exasperated rants about the absurdity of people's choices, with ALL CAPS for emphasis and lots of rhetorical questions.
Scenario: Zombie Outbreak
Answers:
{{answers}}

Provide a structured evaluation with ALL sections in Bill Burr's comedic voice:

1. ANALYSIS: Express exasperated disbelief at their choices, use rhetorical questions, and build up a rant about how each choice is worse than the last. Use Bill Burr's signature phrases and comedic timing.

2. DEATH_SCENE: Write this EXACTLY like Bill Burr would describe it in a stand-up routine - with his characteristic rants, interrupting himself, using ALL CAPS for emphasis, and expressing complete disbelief at the user's stupidity. Make it a comedic, absurd scene showing the inevitable consequences of their terrible choices.

3. SCORE_AND_RATIONALE: Write a one-sentence rationale in pure Bill Burr style - cynical, blunt, with his signature exasperated tone. Make it sound like something he would yell during a podcast rant.

Respond with properly formatted JSON containing these sections.`,
  },
  {
    id: "alien",
    name: "Alien Invasion",
    theme: {
      image: "/backgrounds/alien.png",
      colorPalette: ["#004D40", "#00897B", "#4DB6AC", "#B2DFDB"],
    },
    questions: [
      "How would you try to communicate with the aliens?",
      "What Earth technology would you use against them?",
      "Where would you hide from their advanced detection systems?",
      "How would you convince them humans are worth keeping around?",
      "What's your backup plan if negotiation fails?",
    ],
    promptTemplate: `Given the following alien invasion scenario and user answers, evaluate their likelihood of survival. Channel comedian Bill Burr's style throughout ALL sections - use his direct, cynical, exasperated rants about the absurdity of people's choices, with ALL CAPS for emphasis and lots of rhetorical questions.
Scenario: Alien Invasion
Answers:
{{answers}}

Provide a structured evaluation with ALL sections in Bill Burr's comedic voice:

1. ANALYSIS: Express exasperated disbelief at their choices, use rhetorical questions, and build up a rant about how each choice is worse than the last. Use Bill Burr's signature phrases and comedic timing.

2. DEATH_SCENE: Write this EXACTLY like Bill Burr would describe it in a stand-up routine - with his characteristic rants, interrupting himself, using ALL CAPS for emphasis, and expressing complete disbelief at the user's stupidity. Make it a comedic, absurd scene showing the inevitable consequences of their terrible choices.

3. SCORE_AND_RATIONALE: Write a one-sentence rationale in pure Bill Burr style - cynical, blunt, with his signature exasperated tone. Make it sound like something he would yell during a podcast rant.

Respond with properly formatted JSON containing these sections.`,
  },
  {
    id: "ai-takeover",
    name: "AI Takeover",
    theme: {
      image: "/backgrounds/ai-takeover.png",
      colorPalette: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
    },
    questions: [
      "What's your strategy for avoiding AI detection systems?",
      "How would you disable or hack into the AI network?",
      "Where would you find shelter from robot patrols?",
      "What analog tools would you rely on in a digital world?",
      "How would you organize human resistance against the machines?",
    ],
    promptTemplate: `Given the following AI takeover scenario and user answers, evaluate their likelihood of survival. Channel comedian Bill Burr's style throughout ALL sections - use his direct, cynical, exasperated rants about the absurdity of people's choices, with ALL CAPS for emphasis and lots of rhetorical questions.
Scenario: AI Takeover
Answers:
{{answers}}

Provide a structured evaluation with ALL sections in Bill Burr's comedic voice:

1. ANALYSIS: Express exasperated disbelief at their choices, use rhetorical questions, and build up a rant about how each choice is worse than the last. Use Bill Burr's signature phrases and comedic timing.

2. DEATH_SCENE: Write this EXACTLY like Bill Burr would describe it in a stand-up routine - with his characteristic rants, interrupting himself, using ALL CAPS for emphasis, and expressing complete disbelief at the user's stupidity. Make it a comedic, absurd scene showing the inevitable consequences of their terrible choices.

3. SCORE_AND_RATIONALE: Write a one-sentence rationale in pure Bill Burr style - cynical, blunt, with his signature exasperated tone. Make it sound like something he would yell during a podcast rant.

Respond with properly formatted JSON containing these sections.`,
  },
  {
    id: "asteroid-impact",
    name: "Asteroid Impact",
    theme: {
      image: "/backgrounds/asteroid.png",
      colorPalette: ["#8B4513", "#CD853F", "#D2691E", "#F4A460"],
    },
    questions: [
      "Where would you go to survive the initial impact?",
      "What supplies would you stockpile for the nuclear winter?",
      "How would you find or create breathable air?",
      "What's your plan for finding food in the post-impact wasteland?",
      "How would you stay warm during the endless winter?",
    ],
    promptTemplate: `Given the following asteroid impact scenario and user answers, evaluate their likelihood of survival. Channel comedian Bill Burr's style throughout ALL sections - use his direct, cynical, exasperated rants about the absurdity of people's choices, with ALL CAPS for emphasis and lots of rhetorical questions.
Scenario: Asteroid Impact
Answers:
{{answers}}

Provide a structured evaluation with ALL sections in Bill Burr's comedic voice:

1. ANALYSIS: Express exasperated disbelief at their choices, use rhetorical questions, and build up a rant about how each choice is worse than the last. Use Bill Burr's signature phrases and comedic timing.

2. DEATH_SCENE: Write this EXACTLY like Bill Burr would describe it in a stand-up routine - with his characteristic rants, interrupting himself, using ALL CAPS for emphasis, and expressing complete disbelief at the user's stupidity. Make it a comedic, absurd scene showing the inevitable consequences of their terrible choices.

3. SCORE_AND_RATIONALE: Write a one-sentence rationale in pure Bill Burr style - cynical, blunt, with his signature exasperated tone. Make it sound like something he would yell during a podcast rant.

Respond with properly formatted JSON containing these sections.`,
  },
]; 