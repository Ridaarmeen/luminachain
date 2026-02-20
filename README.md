# LuminaChain
A decentralized learning economy built on Algorand.
## Live Demo
- Frontend:[ your-vercel-url.vercel.app](https://vercel.com/ridaarmeens-projects/luminachain/86jnk1o46gM6v1ZNmz2EdCyHXGpA)
- API Docs: [your-render-url.onrender.com/docs](https://luminachain.onrender.com)
- GitHub: [github.com/Ridaarmeen/luminachain](https://github.com/Ridaarmeen/luminachain)
## Features
### 1. P2P Teaching Sessions
A peer-to-peer learning model where any student can host a teaching session. 
The host sets a subject, topic, entry fee, and meeting link. Students stake 
ALGO to join. After the session, a quiz is conducted and rewards are 
distributed automatically via Algorand smart contracts in a 50/40/10 split — 
50% to the host, 40% to the quiz winner, and 10% to the platform.
### 2. Lecturer Premium Sessions
Expert-led sessions hosted by professional lecturers. Students stake ALGO 
to attend. No quiz is conducted. After the session ends, rewards are 
distributed in an 80/20 split — 80% to the lecturer and 20% to the platform.
### 3. Free Study Rooms
Community-focused study spaces that are free to join. A new room opens every 
hour with a maximum capacity of 50 seats. Each room provides a Jitsi meeting 
link. There is no staking, no quiz, and no reward distribution. It is 
designed purely for collaborative, distraction-free studying.
### 4. Freelance Escrow
A trustless payment system for freelance work. The client deposits ALGO into 
an Algorand escrow smart contract. Funds are only released when the client 
approves the completed work. On release, 95% goes to the freelancer and 5% 
to the platform. Clients can also raise a dispute to reclaim funds.
### 5. Quiz System
An integrated quiz conducted after each P2P teaching session. Students answer 
multiple choice questions related to the session topic. The highest scoring 
student wins 40% of the total staked pool, incentivizing active participation 
and competitive learning.
### 6. Anonymous Q&A
A community question and answer board where users can post questions 
anonymously. Other users can answer questions and upvote the most helpful 
ones. This encourages open discussion without the fear of judgment.
## Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend: FastAPI (Python)
- Blockchain: Algorand (PyTeal smart contracts)
- Deployment: Vercel + Render
## How It Works
Students stake ALGO to join sessions. After the session, a quiz determines the winner. Smart contracts automatically distribute rewards to the host, quiz winner, and platform.
## Getting Started
Run the development server:
npm run dev
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Environment Variables
ALGOD_TOKEN=
ALGOD_HOST=https://testnet-api.algonode.cloud
ALGOD_PORT=443
PLATFORM_MNEMONIC=your 25 word mnemonic
NEXT_PUBLIC_API_URL=https://luminachain.onrender.com
