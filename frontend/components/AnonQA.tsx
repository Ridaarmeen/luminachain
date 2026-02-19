"use client";
import { useState } from "react";

interface Question {
  id: string;
  text: string;
  votes: number;
  answers: string[];
  timestamp: string;
}

export default function AnonQA() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
  const [showAnswerBox, setShowAnswerBox] = useState<string | null>(null);

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;
    const q: Question = {
      id: Date.now().toString(),
      text: newQuestion,
      votes: 0,
      answers: [],
      timestamp: new Date().toLocaleTimeString(),
    };
    setQuestions([q, ...questions]);
    setNewQuestion("");
  };

  const handleVote = (id: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, votes: q.votes + 1 } : q
    ));
  };

  const handleAnswer = (id: string) => {
    if (!answerText[id]?.trim()) return;
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, answers: [...q.answers, answerText[id]] } : q
    ));
    setAnswerText({ ...answerText, [id]: "" });
    setShowAnswerBox(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Anonymous Q&A</h2>
        <p className="text-slate-500 text-sm mt-1">Ask anything anonymously · Upvote the best questions</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Ask Anonymously 🎭</h3>
        <textarea
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          placeholder="Ask anything... your identity is hidden"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-none h-24"
        />
        <button
          onClick={handleAskQuestion}
          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Post Question Anonymously
        </button>
      </div>
      <div className="space-y-4">
        {questions.map(q => (
          <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-200 transition-all">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleVote(q.id)}
                  className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-lg transition-colors flex items-center justify-center"
                >
                  ▲
                </button>
                <span className="text-sm font-semibold text-slate-700">{q.votes}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">🎭 Anonymous</span>
                  <span className="text-xs text-slate-400">{q.timestamp}</span>
                </div>
                <p className="text-slate-800 font-medium mb-3">{q.text}</p>
                {q.answers.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {q.answers.map((ans, i) => (
                      <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-slate-700">
                        💬 {ans}
                      </div>
                    ))}
                  </div>
                )}
                {showAnswerBox === q.id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={answerText[q.id] || ""}
                      onChange={e => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                      placeholder="Write your answer..."
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    />
                    <button onClick={() => handleAnswer(q.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Post
                    </button>
                    <button onClick={() => setShowAnswerBox(null)}
                      className="border border-slate-200 text-slate-500 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowAnswerBox(q.id)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    + Answer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎭</p>
            <p className="text-slate-500">No questions yet. Be the first to ask!</p>
          </div>
        )}
      </div>
    </div>
  );
}
