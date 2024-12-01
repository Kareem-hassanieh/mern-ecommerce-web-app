import React from 'react'

function filter() {
  return (
    <div>
      

      <div>
        <label for="category">Category:</label>
        <select id="category" name="category">
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      

  
    </div>
  )
}

export default filter