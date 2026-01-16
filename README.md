# 📅 Calendly Clone – Full Stack Scheduling Application

This project is a full-stack Calendly-like scheduling system built as part of an assignment to demonstrate frontend–backend integration, REST API design, database schema design, and scheduling logic. Users can create event types, define availability, and allow invitees to book meetings without time conflicts.

---

## 🚀 Features

### 🧑‍💼 Scheduling (Host)
- Create event types (name, duration, location)
- Edit, delete, enable/disable event types
- Copy public booking links
- Define weekly availability
- View booking pages

### 👤 Booking (Invitee)
- Access booking page via event slug
- View calendar
- See available time slots
- Book meetings
- Prevent double booking

### ⚙️ Backend
- REST APIs for events, bookings, availability
- SQLite database (file-based)
- Slot conflict detection
- Dynamic availability calculation

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- Context API

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)

---

## 📂 Project Structure
```
calendly-clone/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── booking/
│   │   │   ├── event-types/
│   │   │   └── sidebar/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── schema.js
│   │   ├── controllers/
│   │   │   ├── eventTypes.controller.js
│   │   │   ├── bookings.controller.js
│   │   │   └── availability.controller.js
│   │   ├── routes/
│   │   │   ├── eventTypes.routes.js
│   │   │   ├── bookings.routes.js
│   │   │   └── availability.routes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── database.sqlite
│   └── package.json
└── README.md
```
---

## 🗄️ Database Schema (SQLite)

Event Types Table:
CREATE TABLE event_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  slug TEXT UNIQUE,
  duration INTEGER,
  location TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

Availability Table:
CREATE TABLE availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type_id INTEGER,
  day TEXT,
  start_time TEXT,
  end_time TEXT,
  enabled INTEGER,
  UNIQUE(event_type_id, day)
);

Bookings Table:
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type_id INTEGER,
  invitee_name TEXT,
  invitee_email TEXT,
  date TEXT,
  start_time TEXT,
  end_time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_type_id, date, start_time)
);

---

## ⚙️ Setup Instructions

1️⃣ Clone Repository  
git clone <repository-url>  
cd calendly-clone  

2️⃣ Backend Setup  
cd backend  
npm install  
npm run dev  

Backend runs on: http://localhost:5000  
SQLite database and tables are auto-created on first run.

3️⃣ Frontend Setup  
cd frontend  
npm install  
npm run dev  

Frontend runs on: http://localhost:5173

---

## 🔗 API Endpoints

Event Types  
GET    /api/events                  Fetch all events  
POST   /api/events                  Create event  
PUT    /api/events/:id              Update event  
DELETE /api/events/:id              Delete event  
GET    /api/events/slug/:slug       Get event by slug  

Availability  
GET    /api/availability/:eventTypeId?date=YYYY-MM-DD   Get available slots  
POST   /api/availability/:eventTypeId                  Save weekly availability  

Bookings  
POST   /api/bookings                Create booking  
GET    /api/bookings/:eventTypeId   Fetch bookings  

---

## 📅 Scheduling Logic

- Host defines weekly availability
- Invitee selects a date
- Backend reads availability
- Slots are generated based on event duration
- Already booked slots are removed
- Available slots are returned to frontend
- Booking is saved only if the slot is free

---

## ❌ Conflict Prevention

Each booking enforces a unique constraint on:
(event_type_id, date, start_time)

If a slot is already booked, the API returns:
409 Conflict

---

## 🔄 Frontend–Backend Integration Flow

- Create Event → POST /api/events
- Edit/Delete Event → PUT /DELETE /api/events/:id
- Booking Page → GET /api/events/slug/:slug
- Calendar Slots → GET /api/availability/:eventTypeId
- Book Meeting → POST /api/bookings

---

## 📌 Author

Megha Vardhan Mirthipati

---

## 📜 License

This project is for educational purposes only.
