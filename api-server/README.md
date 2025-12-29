# Tech Stack
- Backend: Python, Django, Django REST Framework
- Frontend: React
- Database: SQLite (for simplicity)

# Backend - Product Showcase API Server

Django REST API for managing products and categories.

## Getting Started

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Locate the project:**
   ```bash
   cd product-showcase/api-server
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r showcase_api/requirements.txt
   ```

5. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Load sample data (optional):**
   ```bash
   python manage.py loaddata initial_data
   ```

7. **Create a superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

9. **Run the test cases:**
   ```bash
   python manage.py test

The API will be available at `http://localhost:8000/`

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create new product
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/by_priority/?level=high` - Filter by priority

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{id}/` - Get category details
- `POST /api/categories/` - Create new category
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category
- `GET /api/categories/{id}/products/` - Get all products in a category

### Admin
- `GET /admin/` - Django admin panel

# Frontend - Product Dashboard React(Follow README.md)





