import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Header({
  onSearch,
  isLikedFilter,
  toggleLikedFilter,
}: {
  onSearch: (query: string, category: string) => void;
  isLikedFilter: boolean;
  toggleLikedFilter: () => void;
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className='mb-[20px]'>
      <div className='flex justify-between items-center ml-[15px] mr-[15px]'>
        <h1>Quick Shop</h1>
        <div className='flex gap-[20px]'>
          <p>Home</p>
          <button onClick={() => navigate('/add-product')}>Add Product</button>
          <button onClick={() => navigate('/orders')}>My Orders</button>
          <button onClick={() => navigate('/cart')}>
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
          <button onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </div>

      <div className='flex mt-[10px] ml-[15px] mr-[15px]'>
        <div className='flex gap-[15px]'>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('Shoes'); onSearch('', 'Shoes'); }}>Shoes</button>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('devices'); onSearch('', 'devices'); }}>Devices</button>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('cars'); onSearch('', 'cars'); }}>Cars</button>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('pets'); onSearch('', 'pets'); }}>Pets</button>
        </div>

        <input
          className="flex-grow ml-[5px] mr-[5px] border-4"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value, selectedCategory);
          }}
        />

        <button onClick={toggleLikedFilter}>
          {isLikedFilter ? 'Show All Products' : 'Show Liked Products'}
        </button>
      </div>
    </div>
  );
}

export default Header;
