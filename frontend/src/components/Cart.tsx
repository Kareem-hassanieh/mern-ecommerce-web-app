import React, { useEffect, useState } from 'react';
import Header from './Header';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem('authToken'); // Get token from local storage
      if (!token) {
        alert('Please log in to view your cart.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/v1/cart/get', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        const result = await response.json();
        if (response.ok) {
          setCartItems(result.data);
        } else {
          alert(result.message || 'Failed to fetch cart.');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        alert('An error occurred while fetching the cart.');
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  return (
    <>
      <Header />
      <div className="p-4">
        <h1 className="text-2xl mb-4">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="col-span-2">
              <h2 className="text-xl font-bold mb-4">Products</h2>
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 border p-4 rounded shadow-md"
                  >
                    <img
                      src={`http://localhost:5000/${item.product.pictures[0]}`}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h2 className="text-lg font-bold">{item.product.name}</h2>
                      <p className="text-sm text-gray-600">
                        {item.product.description}
                      </p>
                      <p>
                        <b>Price:</b> ${item.product.price}
                      </p>
                      <p>
                        <b>Quantity:</b> {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Section */}
            <div className=" p-4 rounded ">
              <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Total Items:</span>
                <span>{calculateTotalItems()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Total Price:</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
              <button className="w-full py-2 bg-black text-white rounded hover:bg-green-500 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
