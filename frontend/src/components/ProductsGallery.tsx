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

  async function handleAddToCart(productId: any) {
    const userId = '67402ca5bb0b9c4fe4e3d765'; // Replace with the actual logged-in user ID

    try {
      const response = await fetch('http://localhost:5000/api/v1/cart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // User ID for the cart
          items: [
            {
              product: productId, // ID of the product to add
              quantity: 1, // Default quantity
            },
          ],
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        alert(`Failed to add product to cart: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
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
                      onClick={() => handleAddToCart(product._id)} // Pass product ID when clicked
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