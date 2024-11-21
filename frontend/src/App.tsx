import { useEffect, useState } from "react";
import ProductsGallery from "./components/ProductsGallery"; 
import AddProductForm from "./components/AddProductForm";

import Header from "./components/Header";


function App() {
  return (
    <>
    <Header />
      {/* <ProductsGallery /> */}
      <AddProductForm />
    </>
  );
}

export default App;