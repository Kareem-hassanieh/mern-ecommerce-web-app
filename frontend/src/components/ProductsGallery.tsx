import React, { useEffect, useState } from 'react'
import Header from './Header';


function ProductsGallery() {
  const [products, setProducts] = useState([]);

  async function getAllProducts() {
    const response = await fetch(
      'http://localhost:5000/api/v1/product/search'
    )
    const result = await response.json();
    setProducts(result.data);
    console.log(result.data);
  }


  useEffect(() => {
    getAllProducts();
  }, []);

  async function handleAddToCart(productId:any) {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (!token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const cartUpdate = {
      cart: {
        [productId]: 1, // Set quantity to 1 for simplicity
      },
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify(cartUpdate),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Product added to cart successfully!');
        console.log('Updated Cart:', result.data);
      } else {
        alert(result.message || 'Failed to add product to cart.');
        console.error(result.errors);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the product to the cart.');
    }
  }

 


  return (
    <>
      <Header />
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 justify-items-center mt-[10px]  ">
        {products.map((product: any) => {
          return (
            <div className="bg-gray-200 rounded-lg overflow-hidden w-[230px] h-[440px]">
              <div className="card-top h-[50%]">
                <img
                  className="object-cover w-full h-full"
                  src={`http://localhost:5000/${product.pictures[0]}`}
                  alt={product.name || 'Product Image'}
                />
              </div>
              <div className="card-bottom h-[50%] p-2 flex flex-col justify-between">
                <div className="flex flex-col justify-between ">
                  <div className="flex justify-between">
                    <h2 className="text-xl"><b>{product.name}</b></h2>
                    <h3 className="text-xl">${product.price}</h3>
                  </div>
                  <p className="text-start">{product.description}</p>
                </div>

                <div>
                  <span className="flex justify-end">
                  <button
                  onClick={() => handleAddToCart(product._id)} // Pass product ID
                  className="text-xs font-bold px-2 py-3 bg-black rounded-md text-white ml-[auto] hover:bg-green-500 transition-colors duration-300"
                >
                  Add To Cart
                </button>
                  </span>

                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>

  )
}

export default ProductsGallery