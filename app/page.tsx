"use client";
import { useState, useEffect } from "react";
import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import { algodClient, getParams } from "../lib/algorand";

const peraWallet = new PeraWalletConnect();

export default function Home() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Reconnect session if it exists
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) setAccount(accounts[0]);
    });
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccount(accounts[0]);
    } catch (error) {
      console.log("Wallet connection failed", error);
    }
  };

  const joinPremiumSession = async () => {
    if (!account) return alert("Connect wallet first!");
    
    const params = await getParams();
    
    // ⚠️ REPLACE THESE WITH REAL TESTNET ADDRESSES
    const hostAddress = "HSS5ZL5PITNSCCRMFAMUP5U453FBAB7M5MKBVYB7DA5NG4CZ3EF4CAVJY7Q"; 
    const platformAddress = "SS5ZL5PITNSCCRMFAMUP5U453FBAB7M5MKBVYB7DA5NG4CZ3EF4CAVJY7QRESS_HERE";

    // 10 ALGO total (amounts are in microAlgos: 1 ALGO = 1,000,000 microAlgos)
    const hostAmount = 8000000; // 8 ALGO (80%)
    const platformAmount = 2000000; // 2 ALGO (20%)

    const txn1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account,
      to: hostAddress,
      amount: hostAmount,
      suggestedParams: params,
    });

    const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account,
      to: platformAddress,
      amount: platformAmount,
      suggestedParams: params,
    });

    // Group the transactions (Atomic Transfer)
    const txGroup = [txn1, txn2];
    algosdk.assignGroupID(txGroup);

    try {
      const signedTx = await peraWallet.signTransaction([
        { txn: txn1, signers: [account] },
        { txn: txn2, signers: [account] },
      ]);

      const { txId } = await algodClient.sendRawTransaction(signedTx).do();
      alert("Success! Opening block explorer...");
      window.open(`https://testnet.algoexplorer.io/tx/${txId}`, "_blank");
    } catch (e) {
      console.error(e);
      alert("Transaction failed or rejected.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-600">LuminaChain</h1>
          {!account ? (
            <button onClick={connectWallet} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
              Connect Pera Wallet
            </button>
          ) : (
            <p className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-mono text-sm">
              Connected: {account.slice(0, 8)}...{account.slice(-4)}
            </p>
          )}
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Working Blockchain Feature */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Live Web3 Feature</span>
            <h2 className="text-2xl font-bold mt-4 mb-2">Premium Peer Session</h2>
            <p className="text-gray-600 mb-4">Topic: Advanced React Hooks<br/>Host: Alex (Student)<br/>Cost: 10 ALGO</p>
            <div className="bg-gray-50 p-3 rounded mb-4 text-sm text-gray-500">
              ⚡ Smart Contract Split: 80% to Host | 20% to Lumina Treasury
            </div>
            <button onClick={joinPremiumSession} className="w-full bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800">
              Stake 10 ALGO & Join Session
            </button>
          </div>

          {/* Mocked Feature */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Community Space</span>
            <h2 className="text-2xl font-bold mt-4 mb-2">Free Hourly Study Room</h2>
            <p className="text-gray-600 mb-4">Current Slot: 4:00 PM - 5:00 PM<br/>Seats: 24/50 remaining</p>
            <div className="bg-gray-50 p-3 rounded mb-4 text-sm text-gray-500">
              🕒 Auto-creates every hour. No coins required.
            </div>
            <button onClick={() => alert("Joined! Google Meet link: meet.google.com/abc-defg-hij")} className="w-full bg-white text-black border-2 border-black px-4 py-3 rounded-lg font-semibold hover:bg-gray-50">
              Reserve Seat (Free)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}