"use client";
import { useState } from "react";
import P2PSessions from "@/components/P2PSessions";
import LecturerSessions from "@/components/LecturerSessions";
import StudyRooms from "@/components/StudyRooms";
import FreelanceBoard from "@/components/FreelanceBoard";
import WalletConnect from "@/components/WalletConnect";
import AnonQA from "@/components/AnonQA";

const tabs = [
  { id: "P2P Teaching", icon: "📚" },
  { id: "Lecturer Sessions", icon: "🎓" },
  { id: "Study Rooms", icon: "📖" },
  { id: "Freelance", icon: "💼" },
  { id: "Q&A", icon: "🎭" }, 
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("P2P Teaching");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Lumina<span className="text-indigo-600">Chain</span>
            </span>
          </div>
          <WalletConnect onConnect={setWalletAddress} address={walletAddress} />
        </div>
      </header>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
  {activeTab === "P2P Teaching" && <P2PSessions walletAddress={walletAddress} />}
  {activeTab === "Lecturer Sessions" && <LecturerSessions walletAddress={walletAddress} />}
  {activeTab === "Study Rooms" && <StudyRooms walletAddress={walletAddress} />}
  {activeTab === "Freelance" && <FreelanceBoard walletAddress={walletAddress} />}
  {activeTab === "Q&A" && <AnonQA />}
</div>
    </main>
  );
}