import { useEffect, useState } from 'react';
import Header from './Header';

import { useSearchStore  } from '../store/searchStore';

import useProductStore from '../store/productStore';

function ProductsGallery() {
  const { products, loading, error, fetchProducts, handleAddToCart, handleLike } = useProductStore();
  const { searchQuery, selectedCategory, isLikedFilter } = useSearchStore();

  useEffect(() => {
    fetchProducts(searchQuery, selectedCategory, isLikedFilter);
  }, [searchQuery, selectedCategory, isLikedFilter]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <>
  <Header />


      {loading && <p>Loading products...</p>} {/* Show loading indicator */}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Show error message */}

      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 justify-items-center mt-[10px]">
        {products.map((product: any) => (
          <div key={product._id} className="bg-gray-200 rounded-lg overflow-hidden w-[230px] h-[440px]">
            <div className="card-top h-[50%]">
              <img
                className="object-cover w-full h-full"
                src={`http://localhost:5000/${product.pictures[0]}`}
                alt={product.name || 'Product Image'}
              />
            </div>
            <div className="card-bottom h-[50%] p-2 flex flex-col justify-between">
              <div className="flex flex-col justify-between">
                <div className="flex justify-between">
                  <h2 className="text-xl">
                    <b>{product.name}</b>
                  </h2>
                  <h3 className="text-xl">${product.price}</h3>
                </div>
                <p className="text-start">{product.description}</p>
                <p className="mt-[30px]">{product.category}</p>
              </div>

              <div>
                <button
                  className="bg-[red] text-white"
                  onClick={() => handleLike(product._id)} 
                >
                  Like
                </button>
                <span className="flex justify-end">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="text-xs font-bold px-2 py-3 bg-black rounded-md text-white ml-[auto] hover:bg-green-500 transition-colors duration-300"
                  >
                    Add To Cart
                  </button>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductsGallery;