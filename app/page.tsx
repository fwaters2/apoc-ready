"use client";

import { useState } from "react";
import { APOCALYPSE_SCENARIOS } from "./constants/scenarios";
import type { Answer, ApocalypseScenario } from "./types";

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<ApocalypseScenario | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleAnswerChange = (questionIndex: number, text: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(a => a.questionIndex === questionIndex);
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { questionIndex, text };
      } else {
        newAnswers.push({ questionIndex, text });
      }
      
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    // TODO: Implement submission logic
    console.log("Submitting answers:", answers);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 font-mono text-green-400">
          APOCALYPSE READINESS ASSESSOR
        </h1>
        
        {/* Scenario Selection */}
        <div className="mb-8">
          <select
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-green-400"
            value={selectedScenario?.id || ""}
            onChange={(e) => {
              const scenario = APOCALYPSE_SCENARIOS.find(s => s.id === e.target.value);
              setSelectedScenario(scenario || null);
              setAnswers([]);
            }}
          >
            <option value="">SELECT YOUR APOCALYPSE</option>
            {APOCALYPSE_SCENARIOS.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        {/* Questions */}
        {selectedScenario && (
          <div className="space-y-6">
            {selectedScenario.questions.map((question, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <label className="block mb-3 font-mono text-green-400">
                  {`[${index + 1}] ${question}`}
                </label>
                <textarea
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-100 font-mono"
                  rows={3}
                  value={answers.find(a => a.questionIndex === index)?.text || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Type your answer here..."
                />
              </div>
            ))}

            <button
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg font-mono mt-8 transition-colors"
              onClick={handleSubmit}
            >
              EVALUATE SURVIVAL CHANCES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
