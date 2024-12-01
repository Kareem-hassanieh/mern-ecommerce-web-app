import { create } from 'zustand';

type Product = {
  id: string;
  name: string;
  [key: string]: any; // Add other product properties as needed
};

type ProductStore = {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (search: string, category: string, likedFilter: boolean) => Promise<void>;
  handleAddToCart: (productId: string) => Promise<void>;
  handleLike: (productId: string) => Promise<void>;
};

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (search, category, likedFilter) => {
    set({ loading: true, error: null });
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
      set({ products: result.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  handleAddToCart: async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    try {
      const cartUpdate = { cart: { [productId]: 1 } };
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
      } else {
        alert(result.message || 'Failed to add product to cart.');
      }
    } catch (err) {
      alert('An error occurred while adding the product to the cart.');
    }
  },

  handleLike: async (productId) => {
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
    } catch (err) {
      alert('An error occurred while liking the product.');
    }
  },
}));

export default useProductStore;
