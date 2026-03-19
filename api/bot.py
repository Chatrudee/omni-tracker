import requests
import time
import schedule
from api.models import WeatherLog, CurrencyLog

def fetch_weather():
    # ดึงอากาศกรุงเทพฯ จาก Open-Meteo API
    url = "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.51&current_weather=true"
    response = requests.get(url).json()
    temp = response['current_weather']['temperature']
    
    WeatherLog.objects.create(city="Bangkok", temperature=temp)
    print(f"🌤️ [Weather] Bangkok: {temp} °C")

def fetch_currency():
    # ดึงค่าเงิน USD -> THB จาก Frankfurter API
    url = "https://api.frankfurter.app/latest?from=USD&to=THB"
    response = requests.get(url).json()
    rate = response['rates']['THB']
    
    CurrencyLog.objects.create(pair="USD/THB", rate=rate)
    print(f"💵 [Currency] USD/THB: {rate} ฿")

def run_jobs():
    print(f"\n[{time.strftime('%H:%M:%S')}] Bot is fetching data...")
    fetch_weather()
    fetch_currency()

def start_bot():
    print("🚀 Starting Omni-Bot... (Running every 1 minute)")
    run_jobs() # รันรอบแรกทันที
    
    schedule.every().day.at("08:00").do(run_jobs)
    
    while True:
        schedule.run_pending()
        time.sleep(1)
