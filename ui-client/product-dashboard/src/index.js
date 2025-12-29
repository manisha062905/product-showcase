import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';
import {CartProvider} from './components/cart/CartContext'

import { BrowserRouter } from "react-router-dom";

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>,
  document.getElementById("root")
);