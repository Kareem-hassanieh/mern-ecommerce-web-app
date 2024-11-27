import React, { useEffect, useState } from 'react';
import Header from './Header';
import "../styles.css"

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
        <h1 className="text-2xl mb-4 ml-[25px]">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex justify-between all">
            {/* Products Section */}
            <div className="w-[50%] ml-[25px] products">
             
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 border-b-2 p-4"
                  >
                    <div className='w-[100px] h-[80px] mr-[10px]'>
                    <img
                      src={`http://localhost:5000/${item.product.pictures[0]}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                    </div>
                  
                    <div className="flex-grow flex flex-col gap-[7px]">
                      <h2 className="text-lg font-bold">{item.product.name}</h2>
                    
                      <p>
                         ${item.product.price}
                      </p>
                      <div className='flex justify-between'>
                      <p>
                        Quantity: {item.quantity}
                      </p>
                      <button
                       
                        className="text-sm font-bold px-2 py-1 bg-black rounded-md text-white hover:bg-red-500 transition-colors duration-300"
                      >remove</button>


                      </div>
                     
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Section */}
            <div className=" p-4 rounded w-[30%] mx-auto flex flex-col gap-[10px] summary">
              <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
              <div className="flex justify-between mb-2 border-b-2 p-[10px] ">
                <span>Total Items:</span>
                <span>{calculateTotalItems()}</span>
              </div>
              <div className="flex justify-between mb-4 border-b-2 p-[10px]">
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
