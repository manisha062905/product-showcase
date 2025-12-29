# catalog/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import IntegrityError, DatabaseError
from rest_framework import serializers
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    '''
    ModelViewSet - Category

    Provided CRUD operations (list,retrieve,create,update,destory) for categories
    Includes exception related to validation and database operations which returns appropriate HTTP responses
    '''
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    # Overrides methods to catch exceptions to create Category
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response({'error': 'Validation failed', 'details': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            return Response({'error': 'Database error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response({'error': 'Validation failed', 'details': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            return Response({'error': 'Database error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except DatabaseError as e:
            return Response({'error': 'Database error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductViewSet(viewsets.ModelViewSet):
    '''
    ModelViewSet - Product

    Provided CRUD operations (list,retrieve,create,update,destory) for categories
    - Includes exception related to validation and database operations which returns appropriate HTTP responses
    - Filtering by category,priority and featured status
    - Searching by title and description
    - Ordering by creation date,price and priority
    '''
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'priority', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'priority']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        '''This functions provides list of products which are featured'''
        try:
            featured_products = self.get_queryset().filter(is_featured=True)
            serializer = self.get_serializer(featured_products, many=True)
            return Response(serializer.data)
        except DatabaseError as e:
            return Response({'error': 'Database error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Override methods to catch exceptions to create Products
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response({'error': 'Validation failed', 'details': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            return Response({'error': 'Database error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response({'error': 'Validation failed', 'details': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            return Response({'error': 'Database error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except DatabaseError as e:
            return Response({'error': 'Database error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)