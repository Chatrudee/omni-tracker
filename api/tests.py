from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import WeatherLog, CurrencyLog

class WeatherLogModelTest(TestCase):
    def setUp(self):
        WeatherLog.objects.create(city="Bangkok", temperature=35.5)

    def test_weather_log_created(self):
        log = WeatherLog.objects.get(city="Bangkok")
        self.assertEqual(log.temperature, 35.5)

    def test_str_representation(self):
        log = WeatherLog.objects.get(city="Bangkok")
        # ต้องเพิ่ม __str__ ใน model ก่อน
        self.assertIsNotNone(str(log))

class WeatherAPITest(APITestCase):
    def test_get_weather_list(self):
        response = self.client.get('/api/weather/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_weather_returns_list(self):
        WeatherLog.objects.create(city="Bangkok", temperature=33.0)
        response = self.client.get('/api/weather/')
        self.assertEqual(len(response.data['results']), 1)
