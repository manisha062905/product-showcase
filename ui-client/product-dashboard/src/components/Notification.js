import React from "react";
import "../styles/notification.css";

const Notification = ({ product, onClose, onGoToCart }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Item added to cart</h3>

        <div className="modal-content">
          <div>
            <p className="title">{product.title}</p>
            <p className="price">₹{product.price}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="primary" onClick={onGoToCart}>
            Go to Cart
          </button>
          <button className="secondary" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
