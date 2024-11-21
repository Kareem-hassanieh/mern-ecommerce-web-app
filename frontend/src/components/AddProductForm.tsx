import React, { useState } from "react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function AddProductForm() {
  const inputClasses = "flex flex-col gap-2 items-start";

  const [images, setImages] = useState([]); // Image URLs for preview
  const [selectedFiles, setSelectedFiles] = useState([]); // Actual file objects

  const [name, setName] = useState("cat");
  const [description, setDescription] = useState("a cat");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("pets");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    //@ts-ignore
    formData.append("price", price);
    formData.append("category", category);

    // Add image files
    selectedFiles.forEach((file) => {
      formData.append("pictures", file);
    });
    try {
      const response = await fetch("http://localhost:5000/api/v1/product/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // Handle success (clear form, show message, etc.)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="bg-[#e0e0e0] w-full lg:w-[500px] p-4 text-[#333333] rounded-xl m-[20px]">
        <h1 className="text-3xl font-bold mb-[15px]">Add a Product</h1>
        <form className="flex flex-col gap-2 " onSubmit={handleSubmit}>
          <div className={inputClasses}>
            <label htmlFor="name">Product Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-2 rounded-xl"
              placeholder="car"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className={inputClasses}>
            <label htmlFor="description">Product Description:</label>
            <input
              type="text"
              name="description"
              id="description"
              className="w-full p-2 rounded-xl"
              placeholder="A toyota mod 2010"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className={inputClasses}>
            <label htmlFor="number">Price:</label>
            <input
              type="number"
              min="1"
              name="price"
              id="price"
              className="w-full p-2 rounded-xl"
              value={price}
              onChange={(event) => setPrice(parseInt(event.target.value))}
            />
          </div>
          <div className={inputClasses}>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              className="w-full p-2 rounded-xl text-black"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="cars">Cars</option>
              <option value="pets">Pets</option>
              <option value="devices">Devices</option>
              <option value="shoes">Shoes</option>
            </select>
          </div>

          <div className={inputClasses}>
            <label htmlFor="pictures">Pictures:</label>
            <input
              type="file"
              name="pictures"
              id="pictures"
              multiple
              onChange={(event) => {
                if (!event.target.files) return;

                const newFiles = Array.from(event.target.files);

                if (newFiles.length + selectedFiles.length > 5) {
                  alert("You can only upload up to 5 images.");
                  return;
                }

                const newSelectedFiles = [...selectedFiles, ...newFiles];
                const newImageURLs = newFiles.map((file) =>
                  URL.createObjectURL(file)
                );

                //@ts-ignore

                setSelectedFiles(newSelectedFiles);
                //@ts-ignore
                setImages((prev) => [...prev, ...newImageURLs]);

                //@ts-ignore

                event.target.value = null;
              }}
            />
            <button
              type="submit"
              className="text-xs font-bold px-2 py-3 bg-black rounded-md text-white ml-[auto] hover:bg-green-500 transition-colors duration-300">
            
              Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center m-[20px]">
        {images.map((imagePath, index) => (
          <div key={index} className="relative w-full h-[200px] rounded-lg shadow-lg overflow-hidden group flex items-center justify-center">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={imagePath}
              alt={`Preview ${index + 1}`}
            />
            <button
              onClick={() => {
                setImages((prev) => prev.filter((_, i) => i !== index));
                setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
              }}
              className="absolute top-0 right-1 p-2 "
            >
              <FontAwesomeIcon icon={faTimes} size="lg" className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddProductForm;
