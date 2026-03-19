from rest_framework import generics
from .models import WeatherLog, CurrencyLog
from .serializers import WeatherSerializer, CurrencySerializer

class WeatherList(generics.ListCreateAPIView):
    queryset = WeatherLog.objects.all()
    serializer_class = WeatherSerializer

class CurrencyList(generics.ListCreateAPIView):
    queryset = CurrencyLog.objects.all()
    serializer_class = CurrencySerializer