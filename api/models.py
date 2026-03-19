from django.db import models

class WeatherLog(models.Model):
    city = models.CharField(max_length=50)
    temperature = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class CurrencyLog(models.Model):
    pair = models.CharField(max_length=20)
    rate = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
