from django.contrib import admin
from .models import WeatherLog, CurrencyLog

@admin.register(WeatherLog)
class WeatherLogAdmin(admin.ModelAdmin):
    list_display = ['city', 'temperature', 'timestamp']
    list_filter = ['city']
    ordering = ['-timestamp']

@admin.register(CurrencyLog)
class CurrencyLogAdmin(admin.ModelAdmin):
    list_display = ['pair', 'rate', 'timestamp']
    ordering = ['-timestamp']
