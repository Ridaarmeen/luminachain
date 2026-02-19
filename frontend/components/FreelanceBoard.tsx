"use client";
import { useState } from "react";
import { createFreelanceJob } from "@/lib/api";

export default function FreelanceBoard({ walletAddress }: { walletAddress: string | null }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ freelancer_address: "", amount: 1000000, description: "" });

  const handleCreate = async () => {
    if (!walletAddress) return alert("Connect wallet first!");
    const job = await createFreelanceJob({ ...form, client_address: walletAddress });
    setJobs([...jobs, { id: job.job_id, ...job.job }]);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Freelance Escrow</h2>
          <p className="text-slate-500 text-sm mt-1">Trustless payments · Algorand-secured escrow</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          + Post Job
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">New Escrow Job</h3>
          <div className="grid grid-cols-1 gap-4">
            <input placeholder="Freelancer Wallet Address" value={form.freelancer_address}
              onChange={e => setForm({ ...form, freelancer_address: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50" />
            <textarea placeholder="Job Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 h-24 resize-none" />
            <input type="number" placeholder="Amount (microAlgo)" value={form.amount}
              onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Create Escrow
            </button>
            <button onClick={() => setShowForm(false)}
              className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-amber-200 transition-all">
            <p className="text-slate-700 text-sm mb-3">{job.description}</p>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-slate-600">💰 {job.amount / 1000000} ALGO in escrow</p>
              <p className="text-sm text-slate-600">📊 95% Freelancer · 5% Platform</p>
              <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                job.status === "released"
                  ? "bg-green-50 text-green-600 border border-green-100"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}>
                {job.status === "released" ? "✅ Completed" : "⏳ Pending"}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                ✅ Release Payment
              </button>
              <button className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition-colors">
                Dispute
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <p className="text-4xl mb-3">💼</p>
            <p className="text-slate-500">No jobs posted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}