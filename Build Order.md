=> Phase 1 (Required)
    Notes CRUD
    AI summaries / flashcards
    Auth + DB


=> Phase 2 (Collaboration Core)
    Note sharing
    Permissions
    Shared editing (optional)


=> Phase 3 (Real-Time)
    Group chat per note
    Study rooms


=> Phase 4 (Advanced)
    Video calling
    Screen share (optional)
    Group AI actions

------------------------------------------------------------------------------------------------------

=> Architecture Overview

Frontend (React + TS)
 ├─ Notes UI
 ├─ Chat UI
 ├─ Video UI
 |
Backend (Node / Next)
 ├─ REST APIs
 ├─ WebSocket Server
 ├─ Auth & Permissions
 |
Services
 ├─ PostgreSQL
 ├─ Redis (optional)
 ├─ WebRTC Service
 └─ LLM API
