from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction
from algosdk.transaction import ApplicationCreateTxn, ApplicationNoOpTxn, PaymentTxn, StateSchema, wait_for_confirmation
import os, base64
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="LuminaChain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Algorand client
def get_client():
    return algod.AlgodClient(
        os.getenv("ALGOD_TOKEN"),
        f"{os.getenv('ALGOD_HOST')}:{os.getenv('ALGOD_PORT')}"
    )

def get_platform_account():
    mn = os.getenv("PLATFORM_MNEMONIC")
    private_key = mnemonic.to_private_key(mn)
    address = account.address_from_private_key(private_key)
    return private_key, address

def read_teal(filename):
    with open(f"../contracts/{filename}", "r") as f:
        return f.read()

# ─── Models ───────────────────────────────────────────────
class P2PSessionCreate(BaseModel):
    host_address: str
    subject: str
    topic: str
    entry_fee: int
    max_participants: int
    meet_link: str
    datetime: str

class LecturerSessionCreate(BaseModel):
    lecturer_address: str
    title: str
    entry_fee: int
    meet_link: str
    datetime: str

class StudyRoomJoin(BaseModel):
    student_address: str
    room_id: str

class FreelanceCreate(BaseModel):
    client_address: str
    freelancer_address: str
    amount: int
    description: str

class QuizResult(BaseModel):
    app_id: int
    winner_address: str
    host_private_key: str

# In-memory store (replace with DB in production)
sessions_db = {}
study_rooms_db = {}
freelance_db = {}

# ─── Routes ───────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "🌟 LuminaChain API is live!"}

@app.post("/sessions/p2p/create")
async def create_p2p_session(data: P2PSessionCreate):
    client = get_client()
    _, platform_address = get_platform_account()
    
    session_id = f"p2p_{len(sessions_db)+1}"
    sessions_db[session_id] = {
        "type": "p2p",
        "host": data.host_address,
        "subject": data.subject,
        "topic": data.topic,
        "entry_fee": data.entry_fee,
        "max_participants": data.max_participants,
        "meet_link": data.meet_link,
        "datetime": data.datetime,
        "participants": [],
        "pool": 0,
        "status": "open"
    }
    return {"session_id": session_id, "session": sessions_db[session_id]}

@app.get("/sessions/p2p")
def list_p2p_sessions():
    return [{"id": k, **v} for k, v in sessions_db.items() if v["type"] == "p2p" and v["status"] == "open"]

@app.post("/sessions/lecturer/create")
async def create_lecturer_session(data: LecturerSessionCreate):
    session_id = f"lec_{len(sessions_db)+1}"
    sessions_db[session_id] = {
        "type": "lecturer",
        "lecturer": data.lecturer_address,
        "title": data.title,
        "entry_fee": data.entry_fee,
        "meet_link": data.meet_link,
        "datetime": data.datetime,
        "participants": [],
        "pool": 0,
        "status": "open"
    }
    return {"session_id": session_id, "session": sessions_db[session_id]}

@app.get("/sessions/lecturer")
def list_lecturer_sessions():
    return [{"id": k, **v} for k, v in sessions_db.items() if v["type"] == "lecturer" and v["status"] == "open"]

@app.post("/sessions/{session_id}/join")
def join_session(session_id: str, student_address: str):
    if session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    session = sessions_db[session_id]
    if student_address in session["participants"]:
        raise HTTPException(status_code=400, detail="Already joined")
    session["participants"].append(student_address)
    session["pool"] += session["entry_fee"]
    return {"message": "Joined successfully", "session": session}

@app.get("/study-rooms")
def get_study_rooms():
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    hour = now.hour
    rooms = []
    for i in range(3):
        slot_hour = (hour + i) % 24
        room_id = f"room_{now.date()}_{slot_hour}"
        if room_id not in study_rooms_db:
            study_rooms_db[room_id] = {
                "id": room_id,
                "time": f"{slot_hour}:00 - {slot_hour+1}:00 UTC",
                "seats_taken": 0,
                "max_seats": 50,
                "meet_link": "https://meet.jit.si/luminachain-study-" + room_id,
                "status": "open"
            }
        rooms.append(study_rooms_db[room_id])
    return rooms

@app.post("/study-rooms/{room_id}/join")
def join_study_room(room_id: str, student_address: str):
    if room_id not in study_rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")
    room = study_rooms_db[room_id]
    if room["seats_taken"] >= room["max_seats"]:
        raise HTTPException(status_code=400, detail="Room is full")
    room["seats_taken"] += 1
    return {"message": "Seat reserved!", "room": room}

@app.post("/freelance/create")
def create_freelance(data: FreelanceCreate):
    job_id = f"job_{len(freelance_db)+1}"
    freelance_db[job_id] = {
        "client": data.client_address,
        "freelancer": data.freelancer_address,
        "amount": data.amount,
        "description": data.description,
        "status": "pending"
    }
    return {"job_id": job_id, "job": freelance_db[job_id]}

@app.post("/freelance/{job_id}/release")
def release_payment(job_id: str, client_address: str):
    if job_id not in freelance_db:
        raise HTTPException(status_code=404, detail="Job not found")
    job = freelance_db[job_id]
    if job["client"] != client_address:
        raise HTTPException(status_code=403, detail="Not authorized")
    job["status"] = "released"
    return {"message": "Payment released!", "job": job}

@app.get("/account/{address}")
def get_account_info(address: str):
    client = get_client()
    try:
        info = client.account_info(address)
        return {"address": address, "balance": info["amount"], "assets": info.get("assets", [])}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))