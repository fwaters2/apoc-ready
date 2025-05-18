"use client";

import { useState } from "react";
import { APOCALYPSE_SCENARIOS } from "./constants/scenarios";
import type { Answer, ApocalypseScenario, Submission } from "./types";

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<ApocalypseScenario | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!selectedScenario) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          answers,
          name: "Anonymous", // You could add a name input field later
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate survival chances");
      }

      const evaluation = await response.json();
      setResult(evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setAnswers([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 font-mono text-green-400">
        APOCALYPSE READINESS ASSESSOR
      </h1>
      
      {result ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-mono text-green-400 mb-4">EVALUATION COMPLETE</h2>
            <div className="mb-4">
              <span className="text-6xl font-bold font-mono text-green-400">
                {result.score}%
              </span>
              <span className="text-gray-400 ml-2">Survival Rate</span>
            </div>
            <p className="text-xl font-mono text-gray-300 mb-6">{result.feedback}</p>
            <button
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg font-mono transition-colors"
              onClick={handleReset}
            >
              TRY ANOTHER SCENARIO
            </button>
          </div>
        </div>
      ) : (
        <>
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
                    className="w-full bg-gray-900 text-gray-100 p-3 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    rows={3}
                    value={answers.find(a => a.questionIndex === index)?.text || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type your answer here..."
                  />
                </div>
              ))}

              <button
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg font-mono mt-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading || answers.length !== selectedScenario.questions.length}
              >
                {loading ? "EVALUATING..." : "EVALUATE SURVIVAL CHANCES"}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-400 font-mono">
                  {error}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
