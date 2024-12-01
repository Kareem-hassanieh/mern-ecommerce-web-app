import React from 'react'

function PriceFilter() {
  return (
    <div className='flex gap-[10px]'>
      <input type="text" placeholder='min-price' className='w-[100px] border-[2px] '></input>
      <input type="text" placeholder='max-price' className='w-[100px] border-[2px]'></input>
    </div>
  )
}

export default PriceFilter