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
              <button  className="text-xs font-bold px-2 py-3 bg-black rounded-md text-white ml-[auto] hover:bg-green-500 transition-colors duration-300">Add To Cart</button>
              </span>

              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductsGallery