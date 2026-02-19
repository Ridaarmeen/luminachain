"use client";
import { useEffect, useState } from "react";
import { getStudyRooms, joinStudyRoom } from "@/lib/api";

export default function StudyRooms({ walletAddress }: { walletAddress: string | null }) {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => { getStudyRooms().then(setRooms); }, []);

  const handleJoin = async (roomId: string) => {
    if (!walletAddress) return alert("Connect wallet first!");
    const res = await joinStudyRoom(roomId, walletAddress);
    alert(`✅ ${res.message}\n🔗 ${res.room.meet_link}`);
    getStudyRooms().then(setRooms);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Study Rooms</h2>
        <p className="text-slate-500 text-sm mt-1">Free community rooms · New slot every hour · No staking required</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {rooms.map((room, i) => (
          <div key={room.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-emerald-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                  {i === 0 ? "🟢 Now" : i === 1 ? "🕐 Next" : "🕑 Later"}
                </span>
                <h3 className="font-semibold text-slate-900 mt-2">{room.time}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Free · No quiz · Community</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Seats available</span>
                <span className="font-medium">{room.seats_taken}/{room.max_seats}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(room.seats_taken / room.max_seats) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleJoin(room.id)}
              disabled={room.seats_taken >= room.max_seats}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {room.seats_taken >= room.max_seats ? "Room Full" : "Join Room →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}