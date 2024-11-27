import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { faCar, faTshirt, faDog, faBook, faHeart } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const navigate = useNavigate();
  return (
    <div className='mb-[20px]'>

      <div className='flex justify-between  items-center ml-[15px] mr-[15px] '>


        <h1>Quik shop</h1>


        <div className='flex gap-[20px]'>
          <p>Home</p>
          <button onClick={()=>navigate('/add-product')}>Add product</button>
          <button onClick={()=>navigate('/orders')}>my orders</button>
          <button onClick={()=>navigate('/cart')} ><FontAwesomeIcon icon={faShoppingCart} /></button>
          <button onClick={()=>navigate('/')}><FontAwesomeIcon icon={faUser} /></button>
          <p></p>
        </div>
      </div>

      <div className='flex mt-[10px] ml-[15px] mr-[15px]'>

        <div className='flex gap-[15px]'>
          <button>All</button>

          <button><FontAwesomeIcon icon={faCar} /></button>

          <button> <FontAwesomeIcon icon={faTshirt} /></button>

          <button>
            <FontAwesomeIcon icon={faDog} />
          </button>
          <button>
            <FontAwesomeIcon icon={faBook} />
          </button>




        </div>

        <input  className="flex-grow ml-[5px] mr-[5px] border-4" type="text" placeholder='search'></input>

        <button className='mr-[15px]'> <FontAwesomeIcon icon={faHeart} /></button>



      </div>
    </div>

  )
}

export default Header