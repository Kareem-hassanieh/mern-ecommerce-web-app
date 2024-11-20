import React,{useEffect,useState} from 'react'


function ProductsGallery() {
  const [products,setProducts] = useState([]);

  async function getAllProducts(){
    const response = await fetch(
      'http://localhost:5000/api/products'
    )
    const result = await response.json();
    setProducts(result.data);
  }


  useEffect(()=>{
    getAllProducts();
  },[]);


  return (

  )
}

export default ProductsGallery