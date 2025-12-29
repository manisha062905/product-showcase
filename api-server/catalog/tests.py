import os
import django
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Product, Category
from .serializers import ProductSerializer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'showcase_api.settings')
django.setup()

# Test Model

class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", description="Electronic items")

    def test_product_creation(self):
        product = Product.objects.create(
            title="Test Product",
            description="A test product",
            category=self.category,
            price=99.99,
            priority="high",
            quantity=3
        )
        self.assertEqual(product.title, "Test Product")
        self.assertEqual(product.price, 99.99)
        self.assertEqual(product.quantity, 3)

    def test_product_str(self):
        product = Product.objects.create(
            title="Test Product",
            description="A test product",
            category=self.category,
            price=99.99,
            priority="high",
            quantity=2
        )
        self.assertEqual(str(product), "Test Product")

# Test Serializer

class ProductSerializerTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", description="Electronic items")

    def test_valid_product_serializer(self):
        data = {
            "title": "Valid Product",
            "description": "A valid product",
            "category": self.category.id,
            "price": 50.00,
            "priority": "medium",
            "quantity": 1
        }
        serializer = ProductSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_price(self):
        data = {
            "title": "Invalid Product",
            "description": "A product with invalid price",
            "category": self.category.id,
            "price": -10.00,
            "priority": "medium",
            "quantity": 1

        }
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("price", serializer.errors)
    def test_invalid_quantity(self):
        data = {
            "title": "Invalid Product",
            "description": "A product with invalid price",
            "category": self.category.id,
            "price": 10.00,
            "priority": "medium",
            "quantity": -10
        }
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors)

    def test_invalid_priority(self):
        data = {
            "title": "Invalid Product",
            "description": "A product with invalid priority",
            "category": self.category.id,
            "price": 50.00,
            "priority": "invalid",
            "quantity": 1
        }
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("priority", serializer.errors)

    def test_empty_title(self):
        data = {
            "title": "",
            "description": "A product with empty title",
            "category": self.category.id,
            "price": 50.00,
            "priority": "medium",
            "quantity": 1
        }
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)


# Test ViewSet
class ProductViewSetTest(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", description="Electronic items")
        self.product = Product.objects.create(
            title="Test Product",
            description="A test product",
            category=self.category,
            price=99.99,
            priority="high",
            is_featured=True,
            quantity=3
        )

    def test_list_products(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_create_product(self):
        url = reverse('product-list')
        data = {
            "title": "New Product",
            "description": "A new product",
            "category": self.category.id,
            "price": 75.00,
            "priority": "low",
            "quantity": 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)

    def test_create_invalid_product(self):
        url = reverse('product-list')
        data = {
            "title": "",
            "description": "Invalid product",
            "category": self.category.id,
            "price": -5.00,
            "priority": "medium",
            "quantity": 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_featured_products(self):
        url = reverse('product-featured')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]['is_featured'])

    def test_patch_product(self):
        url = reverse('product-detail', args=[self.product.id])
        data = {"title": "Updated Product"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.title, "Updated Product")

    def test_update_product(self):
        url = reverse('product-detail', args=[self.product.id])
        data = {
            "title": "Update Product",
            "description": "Invalid product",
            "category": self.category.id,
            "price": 5.00,
            "priority": "medium",
            "quantity": 4
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.title, "Update Product")
        self.assertEqual(self.product.quantity, 4)
        self.assertEqual(self.product.price, 5.00)

    def test_delete_product(self):
        url = reverse('product-detail', args=[self.product.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)
