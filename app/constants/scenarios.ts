import { ApocalypseScenario } from "../types";

export const APOCALYPSE_SCENARIOS: ApocalypseScenario[] = [
  {
    id: "zombie",
    name: "Zombie Outbreak",
    theme: {
      image: "/backgrounds/zombie.jpg",
      colorPalette: ["#2D3436", "#636E72", "#B2BEC3", "#DFE6E9"],
    },
    questions: [
      "What's your first move when you hear about the zombie outbreak?",
      "What's your weapon of choice for the zombie apocalypse?",
      "Where would you set up your base of operations?",
      "What special skill do you bring to a survivor group?",
      "How would you handle encountering an infected loved one?",
    ],
    promptTemplate: `Given the following zombie apocalypse scenario and user answers, evaluate their likelihood of survival. Be brutally honest but humorous.
Scenario: Zombie Outbreak
Answers:
{{answers}}

Respond with a survival score (0-100) and a brief, sarcastic comment about their chances.`,
  },
  {
    id: "alien",
    name: "Alien Invasion",
    theme: {
      image: "/backgrounds/alien.jpg",
      colorPalette: ["#004D40", "#00897B", "#4DB6AC", "#B2DFDB"],
    },
    questions: [
      "How would you try to communicate with the aliens?",
      "What Earth technology would you use against them?",
      "Where would you hide from their advanced detection systems?",
      "How would you convince them humans are worth keeping around?",
      "What's your backup plan if negotiation fails?",
    ],
    promptTemplate: `Given the following alien invasion scenario and user answers, evaluate their likelihood of survival. Be brutally honest but humorous.
Scenario: Alien Invasion
Answers:
{{answers}}

Respond with a survival score (0-100) and a brief, sarcastic comment about their chances.`,
  },
]; 