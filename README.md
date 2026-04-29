# Omni-Tracker 🌐 🌤️ 💵

A full-stack, microservices-based tracking system that automatically fetches and logs real-time data for Bangkok's weather and the USD/THB exchange rate. 

## 🚀 Features
* **Automated Data Fetching:** A background Python bot runs on a schedule to gather data from external APIs without manual intervention.
* **RESTful API:** Provides clean JSON endpoints to serve the collected data using Django REST Framework.
* **Robust Database:** Stores historical data securely in a PostgreSQL database.
* **Dockerized Environment:** Fully containerized services (API, Database, and Bot) for seamless deployment and isolation.

## 🛠️ Tech Stack
* **Backend:** Python, Django, Django REST Framework (DRF)
* **Database:** PostgreSQL
* **Automation:** Python `schedule` library, `requests`
* **Infrastructure:** Docker, Docker Compose

## 📡 External APIs Used (No API Key Required)
* **Weather Data:** [Open-Meteo API](https://open-meteo.com/) (Tracking Bangkok's temperature)
* **Currency Exchange:** [Frankfurter API](https://www.frankfurter.app/) (Tracking USD to THB rates)

## ⚙️ Local Setup & Installation

**Prerequisite:** Ensure you have Docker and Docker Compose installed on your system.

**1. Clone the repository**
```bash
git clone [https://github.com/Chatrudee/omni-tracker.git](https://github.com/Chatrudee/omni-tracker.git)
cd omni-tracker
```

**2. Start the Docker containers**
```bash
docker compose up -d
```

**3. Apply database migrations**
```bash
docker compose run --rm web python manage.py makemigrations
docker compose run --rm web python manage.py migrate
```

## 🔍 API Endpoints
Once the containers are successfully running, you can access the JSON data via your local browser:

* **Weather Data:** `http://localhost:8000/api/weather/`
* **Currency Data:** `http://localhost:8000/api/currency/`

## 💡 How the Bot Works
The background worker (`bot` service in `docker-compose.yml`) wakes up based on the defined schedule. It acts as an independent microservice that pings the external APIs, parses the incoming JSON payload, and securely saves the current temperature and exchange rate directly into the PostgreSQL database.

## 🚧 Future Improvements
* Build a Frontend Dashboard using HTML/JS or Streamlit to visualize the data with real-time charts.
* Implement error handling and alert notifications.
