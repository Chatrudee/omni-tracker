import requests
import time
import schedule
from api.models import WeatherLog, CurrencyLog

def fetch_weather():
    url = "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.51&current_weather=true"

    try:
        # เพิ่ม timeout=10 — ถ้า API ไม่ตอบใน 10 วินาที จะไม่ค้างตลอดไป
        response = requests.get(url, timeout=10)

        # raise_for_status() — ถ้า server ตอบ 404/500 จะ raise error ทันที
        response.raise_for_status()

        data = response.json()

        # ใช้ .get() แทน [] — ถ้า key ไม่มี จะได้ None แทน crash
        current_weather = data.get('current_weather')
        if not current_weather:
            print("❌ [Weather] 'current_weather' key not found in response")
            return

        temp = current_weather.get('temperature')
        if temp is None:
            print("❌ [Weather] 'temperature' key not found")
            return

        # บันทึกลง database
        WeatherLog.objects.create(city="Bangkok", temperature=temp)
        print(f"🌡️ [Weather] Bangkok: {temp}°C — saved successfully")

    except requests.exceptions.Timeout:
        # API ไม่ตอบภายใน 10 วินาที
        print("❌ [Weather] Request timed out after 10 seconds")

    except requests.exceptions.ConnectionError:
        # ไม่มี internet หรือ DNS ใช้งานไม่ได้
        print("❌ [Weather] Connection error — check internet connection")

    except requests.exceptions.HTTPError as e:
        # Server ตอบกลับ แต่เป็น error code (4xx, 5xx)
        print(f"❌ [Weather] HTTP error: {e}")

    except requests.exceptions.RequestException as e:
        # error อื่นๆ จาก requests library
        print(f"❌ [Weather] Unexpected request error: {e}")

    except (KeyError, TypeError, ValueError) as e:
        # Response format เปลี่ยนหรือ parse JSON ไม่ได้
        print(f"❌ [Weather] Failed to parse response: {e}")

def fetch_currency():
    """
    ดึงอัตราแลกเปลี่ยน USD/THB จาก Frankfurter API แล้วบันทึกลง database
    เพิ่ม: error handling ครบทุกกรณี + timeout
    """
    url = "https://api.frankfurter.app/latest?from=USD&to=THB"

    try:
        #เพิ่ม timeout=10
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        #ใช้ .get() แทน [] ทุกที่
        rates = data.get('rates')
        if not rates:
            print("❌ [Currency] 'rates' key not found in response")
            return

        rate = rates.get('THB')
        if rate is None:
            print("❌ [Currency] 'THB' rate not found")
            return

        # บันทึกลง database
        CurrencyLog.objects.create(pair="USD/THB", rate=rate)
        print(f"💱 [Currency] USD/THB: {rate} ฿ — saved successfully")

    except requests.exceptions.Timeout:
        print("❌ [Currency] Request timed out after 10 seconds")

    except requests.exceptions.ConnectionError:
        print("❌ [Currency] Connection error — check internet connection")

    except requests.exceptions.HTTPError as e:
        print(f"❌ [Currency] HTTP error: {e}")

    except requests.exceptions.RequestException as e:
        print(f"❌ [Currency] Unexpected request error: {e}")

    except (KeyError, TypeError, ValueError) as e:
        print(f"❌ [Currency] Failed to parse response: {e}")

def run_jobs():
    """รัน fetch ทั้งสองตัวพร้อมกัน พร้อม timestamp"""
    print(f"\n[{time.strftime('%H:%M:%S')}] Bot is fetching data...")
    fetch_weather()
    fetch_currency()
    print(f"[{time.strftime('%H:%M:%S')}] Done.\n")


def start_bot():
    """
    เริ่มต้น bot — รันทันที 1 ครั้ง แล้วตั้ง schedule ทุกวัน 08:00
    """
    print("🚀 Starting Omni-Bot... (Scheduled at 08:00 daily)")

    # รันทันที 1 ครั้งตอน start
    run_jobs()

    # เพิ่ม schedule เวลาอื่นถ้าต้องการ เช่น ทุก 1 ชั่วโมง:
    # schedule.every(1).hours.do(run_jobs)
    schedule.every().day.at("08:00").do(run_jobs)

    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    start_bot()
