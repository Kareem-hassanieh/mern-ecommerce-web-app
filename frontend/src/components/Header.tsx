import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { faCar, faTshirt, faDog, faBook, faHeart } from "@fortawesome/free-solid-svg-icons";

function Header() {
  return (
    <>

      <div className='flex justify-between  items-center ml-[15px] mr-[15px]'>


        <h1>Quik shop</h1>


        <div className='flex gap-[20px]'>
          <p>Home</p>
          <p>Add product</p>
          <p>my orders</p>
          <p><FontAwesomeIcon icon={faShoppingCart} /></p>
          <p><FontAwesomeIcon icon={faUser} /></p>
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

        <input  className="flex-grow ml-[5px] mr-[5px]" type="text" placeholder='search'></input>

        <button className='mr-[15px]'> <FontAwesomeIcon icon={faHeart} /></button>



      </div>
    </>

  )
}

export default Header