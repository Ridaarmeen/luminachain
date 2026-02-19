"use client";
import { useState } from "react";

const sampleQuestions = [
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
  },
  {
    question: "Which data structure uses FIFO?",
    options: ["Stack", "Tree", "Queue", "Graph"],
    correct: 2,
  },
  {
    question: "What does API stand for?",
    options: ["App Programming Interface", "Application Programming Interface", "Applied Program Interface", "Application Process Integration"],
    correct: 1,
  },
];

interface Props {
  sessionId: string;
  walletAddress: string;
  onComplete: (score: number, total: number) => void;
}

export default function Quiz({ sessionId, walletAddress, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = sampleQuestions[current];

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 < sampleQuestions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete(score + (selected === question.correct ? 1 : 0), sampleQuestions.length);
    }
  };

  if (finished) {
    const finalScore = score + (selected === question.correct ? 1 : 0);
    const percentage = Math.round((finalScore / sampleQuestions.length) * 100);
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="text-5xl mb-4">{percentage >= 70 ? "🏆" : "📚"}</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Quiz Complete!</h3>
        <p className="text-slate-500 mb-6">You scored {finalScore} out of {sampleQuestions.length}</p>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <p className="text-4xl font-bold text-indigo-600">{percentage}%</p>
          <p className="text-slate-500 text-sm mt-1">
            {percentage >= 70 ? "🎉 Eligible for the reward!" : "Better luck next time!"}
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-slate-500">
          Question {current + 1} of {sampleQuestions.length}
        </span>
        <span className="text-sm font-medium text-indigo-600">
          Score: {score}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all"
          style={{ width: `${(current / sampleQuestions.length) * 100}%` }}
        />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-6">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((option, i) => {
          let style = "border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";
          if (answered) {
            if (i === question.correct) style = "border border-green-400 bg-green-50 text-green-700";
            else if (i === selected) style = "border border-red-300 bg-red-50 text-red-600";
            else style = "border border-slate-200 text-slate-400";
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${style}`}
            >
              <span className="mr-3 text-slate-400">{["A", "B", "C", "D"][i]}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-medium transition-colors"
        >
          {current + 1 < sampleQuestions.length ? "Next Question →" : "See Results →"}
        </button>
      )}
    </div>
  );
}