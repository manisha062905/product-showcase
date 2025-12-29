import React, { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";
import { getProducts } from "../../datasources/productService";
import "../../styles/cart.css";
import { useHistory } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getProducts().then(res => {
      setProducts(res.results || res);
    });
  }, []);

  const cartProducts = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;

      return {
        ...product,
        cartQuantity: item.quantity
      };
    })
    .filter(Boolean);

  const total = cartProducts.reduce(
    (sum, p) => sum + p.price * p.cartQuantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartProducts.length === 0 && (
        <p className="cart-empty">Cart is empty</p>
      )}

      {cartProducts.map(product => (
        <div className="cart-item" key={product.id}>
          <div className="cart-item-info">
            <h4>{product.title}</h4>
            <p>Price: ₹{product.price}</p>
          </div>

          <div className="cart-quantity">
            <button
              onClick={() =>
                updateQuantity(product, product.cartQuantity - 1)
              }
              disabled={product.cartQuantity === 1}
            >
              −
            </button>

            <span>{product.cartQuantity}</span>

            <button
              onClick={() =>
                updateQuantity(product, product.cartQuantity + 1)
              }
              disabled={product.cartQuantity >= product.quantity}
            >
              +
            </button>

            </div>

            <button
              className="cart-remove"
              onClick={() => removeFromCart(product.id)}
            >
              Remove
            </button>
        </div>
      ))}

      {cartProducts.length > 0 && (
        <div className="cart-total">
          Total: ₹{total.toFixed(2)}
        </div>
      )}
      <div style={{display: "flex",alignItems: "center",justifyContent:"center"}} >
        <button className='back-button' onClick={() => history.push("/products")}>
                Back to Products
        </button>
    </div>
    </div>

  );
};

export default Cart;
