"use client";
import { useEffect, useState } from "react";
import { getSessions, createLecturerSession, joinSession } from "@/lib/api";

export default function LecturerSessions({ walletAddress }: { walletAddress: string | null }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", entry_fee: 2000000, meet_link: "", datetime: "" });

  useEffect(() => { getSessions("lecturer").then(setSessions); }, []);

  const handleCreate = async () => {
    if (!walletAddress) return alert("Connect wallet first!");
    await createLecturerSession({ ...form, lecturer_address: walletAddress });
    setShowForm(false);
    getSessions("lecturer").then(setSessions);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lecturer Premium Sessions</h2>
          <p className="text-slate-500 text-sm mt-1">Expert-led sessions. Stake to attend. No quiz.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          + Post Session
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">New Lecturer Session</h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Session Title" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50" />
            <input type="number" placeholder="Entry Fee (microAlgo)" value={form.entry_fee}
              onChange={e => setForm({ ...form, entry_fee: Number(e.target.value) })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50" />
            <input placeholder="Meet Link" value={form.meet_link}
              onChange={e => setForm({ ...form, meet_link: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50" />
            <input type="datetime-local" value={form.datetime}
              onChange={e => setForm({ ...form, datetime: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
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
          <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-violet-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-slate-900">{s.title}</h3>
              <span className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-2 py-1 rounded-full font-medium">Premium</span>
            </div>
            <div className="space-y-1.5 mb-4">
              <p className="text-sm text-slate-600">💰 {s.entry_fee / 1000000} ALGO to join</p>
              <p className="text-sm text-slate-600">📊 80% Lecturer · 20% Platform</p>
              <p className="text-sm text-slate-500">🕐 {new Date(s.datetime).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => joinSession(s.id, walletAddress!)}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Join & Stake
              </button>
              <a href={s.meet_link} target="_blank"
                className="flex-1 text-center border border-slate-200 text-slate-600 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
                Open Meet
              </a>
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <p className="text-4xl mb-3">🎓</p>
            <p className="text-slate-500">No sessions posted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}