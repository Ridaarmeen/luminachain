"use client";
import { useEffect, useState } from "react";
import { getSessions, createP2PSession, joinSession } from "@/lib/api";
import Quiz from "@/components/Quiz";

export default function P2PSessions({ walletAddress }: { walletAddress: string | null }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [form, setForm] = useState({
    subject: "", topic: "", entry_fee: 1000000,
    max_participants: 10, meet_link: "", datetime: ""
  });

  useEffect(() => { getSessions("p2p").then(setSessions); }, []);

  const handleCreate = async () => {
    if (!walletAddress) return alert("Connect wallet first!");
    await createP2PSession({ ...form, host_address: walletAddress });
    setShowForm(false);
    getSessions("p2p").then(setSessions);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">P2P Teaching Sessions</h2>
          <p className="text-slate-500 text-sm mt-1">Learn from peers. Stake to join. Win by quiz.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          + Host Session
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Create New Session</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { placeholder: "Subject (e.g. Mathematics)", key: "subject" },
              { placeholder: "Topic (e.g. Calculus)", key: "topic" },
              { placeholder: "Meet/Zoom Link", key: "meet_link" },
            ].map(field => (
              <input
                key={field.key}
                placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            ))}
            <input
              type="number"
              placeholder="Entry Fee (microAlgo)"
              value={form.entry_fee}
              onChange={e => setForm({ ...form, entry_fee: Number(e.target.value) })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
            <input
              type="number"
              placeholder="Max Participants"
              value={form.max_participants}
              onChange={e => setForm({ ...form, max_participants: Number(e.target.value) })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
            <input
              type="datetime-local"
              value={form.datetime}
              onChange={e => setForm({ ...form, datetime: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Session
            </button>
            <button onClick={() => setShowForm(false)}
              className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessions.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{s.subject}</h3>
                <p className="text-slate-500 text-sm">{s.topic}</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-1 rounded-full font-medium">P2P</span>
            </div>
            <div className="space-y-1.5 mb-4">
              <p className="text-sm text-slate-600">💰 {s.entry_fee / 1000000} ALGO to join</p>
              <p className="text-sm text-slate-600">👥 {s.participants.length}/{s.max_participants} participants</p>
              <p className="text-sm text-slate-600">🏆 50% Host · 40% Quiz Winner · 10% Platform</p>
              <p className="text-sm text-slate-500">🕐 {new Date(s.datetime).toLocaleString()}</p>
            </div>

            <div className="flex gap-2 mb-2">
              <button onClick={() => joinSession(s.id, walletAddress!)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Join & Stake
              </button>
              <a href={s.meet_link} target="_blank"
                className="flex-1 text-center border border-slate-200 text-slate-600 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
                Open Meet
              </a>
            </div>

            <button
              onClick={() => setActiveQuiz(activeQuiz === s.id ? null : s.id)}
              className="w-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {activeQuiz === s.id ? "Close Quiz ✕" : "📝 Take Quiz"}
            </button>

            {activeQuiz === s.id && walletAddress && (
              <div className="mt-4">
                <Quiz
                  sessionId={s.id}
                  walletAddress={walletAddress}
                  onComplete={(score, total) => {
                    alert(`Quiz done! Score: ${score}/${total}\n${score / total >= 0.7 ? "🏆 You may win the reward!" : "Better luck next time!"}`);
                    setActiveQuiz(null);
                  }}
                />
              </div>
            )}

            {activeQuiz === s.id && !walletAddress && (
              <p className="text-center text-red-400 text-xs mt-3">Connect your wallet to take the quiz!</p>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-slate-500">No sessions yet. Be the first to host one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
