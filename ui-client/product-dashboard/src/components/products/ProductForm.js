import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  getProduct
} from "../../datasources/productService";
import { getCategories } from "../../datasources/categoryService";
import "../../styles/productForm.css";

const ProductForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    quantity: "", 
    category: "",
    description: "",
    image_url: "",
    is_featured: false,
  });

  /* Load categories */
  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.results))
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* Load product if edit */
  useEffect(() => {
    if (isEditMode) {
      getProduct(id)
        .then(product => {
          setForm({
            title: product.title,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            description: product.description,
            image_url: product.image_url || "",
            is_featured: product.is_featured,
          });
        })
        .catch(() => setError("Failed to load product"));
    }
  }, [id, isEditMode]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.price || !form.category) {
      setError("Title, Price and Category are required");
      return;
    }
    if (Number(form.quantity) <= 0) {
      setError("Quantity must be greater than zero");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      history.replace("/products");
    } catch (err) {
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{isEditMode ? "Edit Product" : "Create Product"}</h2>

      {error && <div className="error-banner">{error}</div>}

      <form className="product-form" onSubmit={handleSubmit}>
        Title:
        <input
          name="title"
          placeholder="Enter Title"
          value={form.title}
          onChange={handleChange}
        />
        Price:
        <input
          name="price"
          type="number"
          placeholder="Enter Price"
          value={form.price}
          onChange={handleChange}
        />
        Quantity:
        <input
          name="quantity"
          type="number"
          min="1"
          placeholder="Enter Quantity"
          value={form.quantity}
          onChange={handleChange}
        />
        Category:
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        Image URL:
        <input
          name="image_url"
          placeholder="Enter Image URL"
          value={form.image_url}
          onChange={handleChange}
        />

        {form.image_url && (
          <img
            src={form.image_url}
            alt="Preview"
            className="image-preview"
            onError={() => setError("Invalid image URL")}
          />
        )}
        Description:
        <textarea
          name="description"
          placeholder="Enter Description"
          value={form.description}
          onChange={handleChange}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
          />
          Featured Product
        </label>

        <div style={{ padding: "20px",display: "flex",              // Use flexbox
    justifyContent: "space-between" }}>
          {/* Container with flexbox to align buttons in one line */}
          <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Product"
            : "Create Product"}
        </button>
        <button className="secondary-btn" onClick={() => history.push("/products")}>
        Back to Products
      </button>
        </div>

        
      </form>

      
    </div>
  );
};

export default ProductForm;
