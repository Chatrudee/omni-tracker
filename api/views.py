from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .models import WeatherLog, CurrencyLog
from .serializers import WeatherSerializer, CurrencySerializer

class StandardPagination(PageNumberPagination):
    """
    เพิ่ม Pagination — ป้องกัน return ข้อมูลหมื่นแถวพร้อมกัน
    ใช้งาน: GET /api/weather/?page=2
    """
    page_size            = 20    # แสดง 20 record ต่อหน้า
    page_size_query_param = 'page_size'  # ให้ user กำหนดเองได้: ?page_size=50
    max_page_size        = 100   # แต่ไม่เกิน 100



class WeatherList(generics.ListCreateAPIView):
    """
    GET  /api/weather/         — ดูข้อมูลอุณหภูมิทั้งหมด (แบบแบ่งหน้า)
    GET  /api/weather/?city=Bangkok  — filter เฉพาะเมือง
    POST /api/weather/         — เพิ่มข้อมูลใหม่ (ปกติ bot เป็นคนทำ)

    เดิม: return ทุก record ไม่จำกัด ไม่มี filter
    ใหม่: มี pagination + filter by city
    """
    serializer_class  = WeatherSerializer
    pagination_class  = StandardPagination 

    #  เปลี่ยนจาก queryset = ... เป็น get_queryset()
    # เพราะต้องการ filter ตาม query parameter ที่ user ส่งมา
    def get_queryset(self):
        queryset = WeatherLog.objects.all()  # เริ่มจากทุก record

        # ถ้า user ส่ง ?city=Bangkok มา ให้ filter เฉพาะเมืองนั้น
        # icontains = case-insensitive (bangkok, Bangkok, BANGKOK ได้หมด)
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)

        return queryset

class CurrencyList(generics.ListCreateAPIView):
    """
    GET  /api/currency/          — ดูข้อมูลอัตราแลกเปลี่ยนทั้งหมด
    GET  /api/currency/?pair=USD/THB  — filter เฉพาะ pair
    POST /api/currency/          — เพิ่มข้อมูลใหม่

    เดิม: return ทุก record ไม่จำกัด ไม่มี filter
    ใหม่: มี pagination + filter by pair
    """
    serializer_class  = CurrencySerializer
    pagination_class  = StandardPagination 

    def get_queryset(self):
        queryset = CurrencyLog.objects.all()

        # ถ้า user ส่ง ?pair=USD/THB มา ให้ filter เฉพาะ pair นั้น
        pair = self.request.query_params.get('pair')
        if pair:
            queryset = queryset.filter(pair__icontains=pair)

        return queryset
