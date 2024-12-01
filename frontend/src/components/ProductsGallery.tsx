import { useEffect, useState } from 'react';
import Header from './Header';

import { useSearchStore  } from '../store/searchStore';

function ProductsGallery() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { searchQuery, selectedCategory, isLikedFilter } = useSearchStore();

  async function getAllProducts(search = '', category = '', likedFilter = false) {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:5000/api/v1/product/search?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
      if (likedFilter) {
        const token = localStorage.getItem('authToken');
        if (token) url += `&likedBy=${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch products');

      const result = await response.json();
      setProducts(result.data);
    } catch (err) {
      //@ts-ignore
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllProducts(searchQuery, selectedCategory, isLikedFilter);
  }, [searchQuery, selectedCategory, isLikedFilter]);

  const handleAddToCart = async (productId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const cartUpdate = {
      cart: {
        [productId]: 1,
      },
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartUpdate),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Product added to cart successfully!');
        console.log('Updated Cart:', result.data);
      } else {
        alert(result.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      alert('An error occurred while adding the product to the cart.');
    }
  };

  const handleLike = async (productId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to like products.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/like/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Product liked successfully!');
      } else {
        alert(result.message || 'Failed to like product.');
      }
    } catch (error) {
      alert('An error occurred while liking the product.');
    }
  };


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
                  onClick={() => handleLike(product._id)} // Trigger like functionality
                >
                  Like
                </button>
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
        ))}
      </div>
    </>
  );
}

export default ProductsGallery;