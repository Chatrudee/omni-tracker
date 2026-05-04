from django.db import models


# ============================================================
# 🌤️  WEATHER LOG MODEL
# ============================================================

class WeatherLog(models.Model):
    city        = models.CharField(max_length=50)
    temperature = models.FloatField()
    timestamp   = models.DateTimeField(auto_now_add=True)

    # เพิ่ม Meta class — บอก Django ให้เรียง record ล่าสุดขึ้นก่อน
    class Meta:
        ordering = ['-timestamp']
        verbose_name     = 'Weather Log'       # ชื่อใน Django Admin (เอกพจน์)
        verbose_name_plural = 'Weather Logs'   # ชื่อใน Django Admin (พหูพจน์)

    # เพิ่ม __str__ — ทำให้อ่านออกตอน debug หรือดูใน Admin
    # ก่อนหน้านี้ถ้า print(log) จะได้ "WeatherLog object (1)" ซึ่งอ่านไม่รู้เรื่อง
    def __str__(self):
        return f"{self.city} | {self.temperature}°C | {self.timestamp:%Y-%m-%d %H:%M}"

class CurrencyLog(models.Model):
    pair      = models.CharField(max_length=20)
    rate      = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    # เพิ่ม Meta class
    class Meta:
        ordering = ['-timestamp']
        verbose_name     = 'Currency Log'
        verbose_name_plural = 'Currency Logs'

    #  เพิ่ม __str__
    def __str__(self):
        return f"{self.pair} | {self.rate} ฿ | {self.timestamp:%Y-%m-%d %H:%M}"
