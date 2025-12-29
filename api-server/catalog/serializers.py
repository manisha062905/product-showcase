from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    ''' Converts Category model instances to and from JSON representations'''
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    ''' Provides full validation and representation of product data'''
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'price', 'priority', 'is_featured', 'image_url',
            'created_at', 'updated_at','quantity',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        '''validate product title - non empty and does not exceed maximum allowed length'''
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        if len(value) > 200:
            raise serializers.ValidationError("Title cannot exceed 200 characters.")
        return value

    def validate_price(self, value):
        ''' Validate price - positive value'''
        if value <= 0:
            raise serializers.ValidationError("Price must be positive.")
        return value

    def validate_priority(self, value):
        ''' Validate priority - matches one of the defined PRIORITY_CHOICES'''
        if value not in dict(Product.PRIORITY_CHOICES):
            raise serializers.ValidationError("Invalid priority choice.")
        return value

    def validate_image_url(self, value):
        ''' Validate image URL - uses valid HTTP or HTTPS scheme'''
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Image URL must be a valid HTTP or HTTPS URL.")
        return value

    def validate_quantity(self, value):
        ''' Validate quantity - positive integer'''
        if value <= 0:
            raise serializers.ValidationError("Quantity must be positive.")
        return value

class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'category', 'category_name',
            'price', 'priority', 'is_featured', 'image_url','quantity',
        ]
