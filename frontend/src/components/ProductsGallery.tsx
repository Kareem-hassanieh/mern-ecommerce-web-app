import React, { useEffect, useState } from 'react'


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


  return (
    <div className="flex gap-10 text-black">
      {products.map((product: any) => {
        return (
          <div className="bg-gray-200 rounded-lg overflow-hidden  w-[250px] h-[500px]">
            <div className="card-top h-[50%]">
              <img
                className="object-cover w-full h-full"
                src={`http://localhost:5000/${product.pictures[0]}`}
                alt={product.name || 'Product Image'}
              />
            </div>
            <div className="card-bottom p-2 h-[50%]">
              <div className="flex flex-col justify-between ">
                <div className="flex justify-between">
                  <h2 className="text-xl"><b>{product.name}</b></h2>
                  <h3 className="text-xl">${product.price}</h3>
                </div>
                <p className="text-start">{product.description}</p>
              </div>

              <div>
                <button className="text-white">
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductsGallery