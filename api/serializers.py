from rest_framework import serializers
from .models import WeatherLog, CurrencyLog

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherLog
        fields = '__all__'

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyLog
        fields = '__all__'