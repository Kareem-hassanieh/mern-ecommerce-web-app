import React, { useEffect, useState } from 'react';
// Correct import for jwt-decode
import jwt_decode from 'jwt-decode'; 
import Header from './Header';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  pictures: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

function Cart() {
  const [cart, setCart] = useState<Cart | null>(null);  // Type the state
  const [loading, setLoading] = useState<boolean>(true);  // Added loading state
  const [error, setError] = useState<string | null>(null);  // Added error state

  useEffect(() => {
    const token = localStorage.getItem('authToken');  // Get JWT from localStorage

    if (token) {
      try {
        // Define the type of the decoded token
        interface DecodedToken {
          _id: string;
        }

        // Decode the token directly using jwt_decode (default import)
        const decoded = jwt_decode<DecodedToken>(token);  // Decode and specify type
        const userId = decoded._id;  // Get userId from decoded token

        async function fetchCart() {
          try {
            const response = await fetch(`http://localhost:5000/api/v1/cart/${userId}`);
            const result = await response.json();

            if (response.ok) {
              setCart(result.data);
            } else {
              setError(result.message || 'Failed to fetch cart');
            }
          } catch (err) {
            setError('Error fetching cart data');
          } finally {
            setLoading(false);  // Ensure loading state is turned off
          }
        }

        fetchCart();
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Invalid token');
        setLoading(false);
      }
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <Header />
      <h2 className="text-center text-2xl my-4">Your Cart</h2>

      {loading && <p>Loading cart...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {cart && !loading && !error ? (
        <div className="cart-items">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div key={item.product._id} className="cart-item flex justify-between mb-4">
                <img
                  src={`http://localhost:5000/${item.product.pictures[0]}`}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover"
                />
                <div className="item-info flex-1 ml-4">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>${item.product.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Cart;
