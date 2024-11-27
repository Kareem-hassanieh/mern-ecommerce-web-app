import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ProductsGallery from "./components/ProductsGallery"; 
import AddProductForm from "./components/AddProductForm";
import Cart from "./components/Cart";


import Login from "./components/Login";
import Signup from "./components/Signup";
import Order from "./components/Orders";
// import Cart from "./components/Cart";


function App() {
  return (
    <Router>
   
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products-gallery" element={<ProductsGallery />} />
      <Route path="/add-product" element={<AddProductForm />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/cart" element={<Cart />} />
     
    
    </Routes>
  </Router>
  );
}

export default App;