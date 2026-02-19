import axios from "axios";
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export const getSessions = (type: "p2p" | "lecturer") =>
  API.get(`/sessions/${type}`).then(r => r.data);

export const createP2PSession = (data: any) =>
  API.post("/sessions/p2p/create", data).then(r => r.data);

export const createLecturerSession = (data: any) =>
  API.post("/sessions/lecturer/create", data).then(r => r.data);

export const joinSession = (sessionId: string, address: string) =>
  API.post(`/sessions/${sessionId}/join?student_address=${address}`).then(r => r.data);

export const getStudyRooms = () =>
  API.get("/study-rooms").then(r => r.data);

export const joinStudyRoom = (roomId: string, address: string) =>
  API.post(`/study-rooms/${roomId}/join?student_address=${address}`).then(r => r.data);

export const createFreelanceJob = (data: any) =>
  API.post("/freelance/create", data).then(r => r.data);

export const getAccountInfo = (address: string) =>
  API.get(`/account/${address}`).then(r => r.data);