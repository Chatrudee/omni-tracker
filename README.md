# 🌐 Omni Tracker

> A full-stack, microservices-based tracking system that automatically fetches and logs real-time data for **Bangkok's weather** and the **USD/THB exchange rate** — served via a REST API and visualized on a live React dashboard.

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-4.x-092E20?style=flat-square&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)

---

## 📸 Screenshots

> Dashboard — Dark Mode

<!-- Replace with actual screenshot after running the project -->

```
[ Add screenshot here after running: npm start in /frontend/omni-dashboard ]
```

---

## ✨ Features

- **Automated Data Fetching** — A background Python bot runs on a schedule, pulling live data from external APIs without manual intervention
- **RESTful API** — Clean JSON endpoints built with Django REST Framework, with pagination and query filtering
- **React Dashboard** — Live charts and stat cards showing historical data, with dark/light theme toggle and auto-refresh
- **Robust Error Handling** — Bot gracefully handles API timeouts, connection errors, and unexpected response formats
- **Dockerized Environment** — All services (API, Database, Bot) run in isolated containers with a single command
- **Admin Panel** — Django Admin configured for easy data inspection and management

---

## 🛠️ Tech Stack

| Layer              | Technology                                   |
| ------------------ | -------------------------------------------- |
| **Backend**        | Python, Django, Django REST Framework        |
| **Frontend**       | React 18, Recharts, CSS Variables            |
| **Database**       | PostgreSQL                                   |
| **Automation**     | Python `schedule` library                    |
| **Infrastructure** | Docker, Docker Compose                       |
| **External APIs**  | Open-Meteo (weather), Frankfurter (currency) |

---

## 🏗️ Project Structure

```
omni-tracker/
├── api/                     # Django app — models, views, serializers
│   ├── models.py            # WeatherLog, CurrencyLog models
│   ├── views.py             # ListCreateAPIView with pagination + filtering
│   ├── serializers.py       # DRF serializers
│   ├── bot.py               # Background data-fetching bot
│   ├── admin.py             # Django Admin configuration
│   └── tests.py             # Unit + API tests
├── core/                    # Django project settings
├── frontend/
│   └── omni-dashboard/      # React dashboard
│       ├── src/
│       │   ├── hooks/
│       │   │   └── useOmniData.js    # Custom hook — fetch + auto-refresh
│       │   ├── components/
│       │   │   ├── StatCard.jsx      # Latest value cards
│       │   │   └── ChartCard.jsx     # Area chart wrapper (Recharts)
│       │   └── App.jsx               # Main dashboard layout
│       └── package.json
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## 📡 API Endpoints

Once running, the API is available at `http://localhost:8000`

| Method | Endpoint                      | Description                           |
| ------ | ----------------------------- | ------------------------------------- |
| `GET`  | `/api/weather/`               | List all weather records (paginated)  |
| `GET`  | `/api/weather/?city=Bangkok`  | Filter by city                        |
| `GET`  | `/api/weather/?page=2`        | Paginate results                      |
| `GET`  | `/api/currency/`              | List all currency records (paginated) |
| `GET`  | `/api/currency/?pair=USD/THB` | Filter by currency pair               |

**Example response:**

```json
{
  "count": 120,
  "next": "http://localhost:8000/api/weather/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "city": "Bangkok",
      "temperature": 34.2,
      "timestamp": "2025-05-04T08:00:00Z"
    }
  ]
}
```

---

## ⚙️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed
- [Node.js](https://nodejs.org/) 18+ (for the React dashboard)

### 1. Clone the repository

```bash
git clone https://github.com/Chatrudee/omni-tracker.git
cd omni-tracker
```

### 2. Start the backend (Django + PostgreSQL + Bot)

```bash
docker compose up -d
```

### 3. Apply database migrations

```bash
docker compose run --rm web python manage.py makemigrations
docker compose run --rm web python manage.py migrate
```

### 4. (Optional) Create a Django Admin superuser

```bash
docker compose run --rm web python manage.py createsuperuser
```

Access the admin panel at: `http://localhost:8000/admin`

### 5. Start the React dashboard

```bash
cd frontend/omni-dashboard
npm install
npm start
```

Open `http://localhost:3000` in your browser.

---

## 💡 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                         │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │  bot     │───▶│  PostgreSQL  │◀───│  Django API   │  │
│  │ (Python) │    │   Database   │    │  (DRF)        │  │
│  └──────────┘    └──────────────┘    └───────┬───────┘  │
│       │                                      │          │
│  Fetches from                          Serves JSON       │
│  Open-Meteo API                              │          │
│  Frankfurter API                     ┌───────▼───────┐  │
│                                      │ React Dashboard│  │
│                                      │ localhost:3000 │  │
│                                      └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

The **bot service** wakes up on a schedule, fetches live data from free external APIs, and saves it directly to PostgreSQL. The **Django API** serves this historical data as paginated JSON. The **React dashboard** polls the API every 1/5/15 minutes, displaying live charts and current values.

---

## 🧪 Running Tests

```bash
docker compose run --rm web python manage.py test
```

Tests cover:

- `WeatherLog` model creation and `__str__` representation
- `CurrencyLog` model creation
- `GET /api/weather/` returns HTTP 200
- API returns correct data after record creation

---

## 🔭 External APIs Used (No API Key Required)

| API                                         | Usage                    | Docs                |
| ------------------------------------------- | ------------------------ | ------------------- |
| [Open-Meteo](https://open-meteo.com/)       | Bangkok temperature (°C) | Free, no key needed |
| [Frankfurter](https://www.frankfurter.app/) | USD → THB exchange rate  | Free, no key needed |

---

## 🚀 Future Improvements

- [ ] JWT Authentication — protect write endpoints
- [ ] Support multiple cities and currency pairs
- [ ] Deploy to cloud (Railway / Render / GCP)
- [ ] GitHub Actions CI/CD — auto-run tests on push
- [ ] Alert notifications when values exceed thresholds

---

## 👩‍💻 Author

**Chatrudee** — [GitHub](https://github.com/Chatrudee)
