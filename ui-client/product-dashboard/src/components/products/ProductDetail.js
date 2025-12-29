import { useParams, useHistory } from "react-router-dom";
import { getProduct } from "../../datasources/productService";
import React, { useState, useEffect } from "react";
import "../../styles/productDetails.css";
import { useCart } from "../../components/cart/CartContext";
import Notification from "../Notification";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const history = useHistory();
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowModal(true);
  };

  useEffect(() => {
    getProduct(id).then(setProduct);
  }, [id]);

  if (!product) {
    return <div className="product-detail-loading">Loading...</div>;
  }

  return (
    <>
    {showModal && (
        <Notification
          product={product}
          onClose={() => setShowModal(false)}
          onGoToCart={() => window.location.href = "/cart"}
        />
      )}
    <div className="product-detail-wrapper">
      <div className="product-detail-card">
        {/* LEFT: IMAGE */}
        <div className="product-image-section">
          <img
            src={product.image_url || "https://via.placeholder.com/400"}
            alt={product.title}
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="product-info-section">
          <h2>{product.title}</h2>

          <p>
            <span>Category:</span> {product.category_name}
          </p>

          <p>
            <span>Description:</span> {product.description}
          </p>

          <p className="product-price">Rs. {product.price}</p>

          <p className="product-featured">
            <span>Featured:</span> {product.is_featured ? "Yes" : "No"}
          </p>
          <div style={{ padding: "20px",display: "flex",              // Use flexbox
    justifyContent: "space-between" }}>
          <button className="primary" disabled={product.quantity === 0} onClick={handleAddToCart}>
              Add to Cart
          </button>
          <button onClick={() => history.push("/products")}>
            Back to Products
          </button>
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetail;
