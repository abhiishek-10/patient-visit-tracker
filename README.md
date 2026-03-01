# Patient Visit Tracker

A web application for internal users to track patient visits by clinicians.

## Tech Stack

- **Backend**: Node.js, Express, Prisma ORM, TypeScript, PostgreSQL
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a remote connection string)

---

### Backend Setup

```bash
cd backend
npm install
```

1. Copy the example env file and fill in your database URL:

```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

2. Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

3. Seed the database with initial clinicians, patients, and visits:

```bash
npm run seed
```

4. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

---

### Frontend Setup

```bash
cd frontend
npm install
```

1. Copy the example env file and set the API base URL:

```bash
cp .env.example .env
# Edit .env if your backend runs on a different host or port
```

`.env` default:
```
VITE_API_URL=http://localhost:3001/api
```

2. Start the development server:

```bash
npm run dev
```

The UI will be available at `http://localhost:5173`.

---

## API Endpoints

### Clinicians

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clinicians` | List all clinicians |
| GET | `/api/clinicians/:id` | Get a clinician by ID |
| POST | `/api/clinicians` | Create a new clinician |

**POST body:**
```json
{ "name": "Dr. Jane Doe", "specialty": "Cardiology", "email": "dr.doe@clinic.com" }
```

### Patients

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/patients` | List all patients |
| GET | `/api/patients/:id` | Get a patient by ID |
| POST | `/api/patients` | Create a new patient |

**POST body:**
```json
{ "name": "John Smith", "dateOfBirth": "1985-03-12", "email": "john@example.com", "phone": "555-0100" }
```

### Visits

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/visits` | List visits (newest first) |
| GET | `/api/visits?clinicianId=1` | Filter by clinician |
| GET | `/api/visits?patientId=2` | Filter by patient |
| GET | `/api/visits/:id` | Get a visit by ID |
| POST | `/api/visits` | Record a new visit |

**POST body:**
```json
{ "clinicianId": 1, "patientId": 2, "visitedAt": "2026-03-01T10:30:00", "notes": "Routine checkup." }
```

---

## Database Schema

```
clinicians   — id, name, specialty, email, createdAt, updatedAt
patients     — id, name, dateOfBirth, email?, phone?, createdAt, updatedAt
visits       — id, clinicianId, patientId, visitedAt, notes?, createdAt, updatedAt
```
