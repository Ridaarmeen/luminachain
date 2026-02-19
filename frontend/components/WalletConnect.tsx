"use client";
import { useState } from "react";
import { getAccountInfo } from "@/lib/api";

interface Props {
  onConnect: (address: string) => void;
  address: string | null;
}

export default function WalletConnect({ onConnect, address }: Props) {
  const [inputAddr, setInputAddr] = useState("");
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    if (!inputAddr) return;
    setLoading(true);
    try {
      await getAccountInfo(inputAddr);
      onConnect(inputAddr);
    } catch {
      alert("Invalid address or not found on localnet");
    }
    setLoading(false);
  };

  if (address) {
    return (
      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-indigo-700">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        value={inputAddr}
        onChange={e => setInputAddr(e.target.value)}
        placeholder="Paste Algorand address"
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
      />
      <button
        onClick={connect}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "..." : "Connect"}
      </button>
    </div>
  );
}