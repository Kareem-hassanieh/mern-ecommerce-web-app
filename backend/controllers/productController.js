const express = require('express');
const Product = require('../models/Product');
const Like = require('../models/Like');

const router = express.Router();
const mongoose = require('mongoose'); 
const ImageUpload = require('../middleware/ImageUpload');



router.get('/search', async (req, res) => {
  try {
      let args  = {}
      const category = req.query.category;

      if(category){
          args['category'] = category
      }
      
      const search = req.query.search

      if (search) {
        args['$or'] = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

      
      const minPrice = req.query.minPrice
      const maxPrice = req.query.maxPrice
      if(minPrice || maxPrice){
          const priceRange  ={}
          if(minPrice ){
              priceRange['$gte'] = minPrice
          }
          
          if(maxPrice ){
              priceRange['$lte'] = maxPrice
          }
          
          args['price'] = priceRange
      }
      
      const likedBy = req.query.likedBy
      if(likedBy){
          const likes = await Like.find({user:likedBy})
          const productIds = likes.map(like=>like.product)
          args['_id'] = {
              $in : productIds
          }
      }
      //const products = await Product.find(args);
      // @ts-ignore
      // const products = await Product.find({ $text: { $search: search } });
      const products = await Product.find(args);
      res.status(200).json({
          errors: null,
          message: "Products fetched!",
          data: products
      })
  } catch (error) {
      console.log(error)
      res.status(500).json({
          errors: [error.message],
          message: "Something went wrong!",
          data: null
      })
  }
})

router.post('/create', ImageUpload.array('pictures', 5), async (req, res) => {
  try {
    
      console.log(req.files)
      
      const pictures = req.files.map((file) => file.path)
      
      
      
      const {
          name,
          description,
          price,
          category,
      } = req.body

      if (
          !name ||
          !description ||
          !price ||
          !pictures.length ||
          !category
      ) {
          throw new Error("At least one of the required fields is empty")
      }


      const product = new Product({
          name,
          description,
          price,
          pictures,
          category
      })

      await product.save()

      res.status(200).json({
          errors: null,
          message: "Product created!",
          data: product
      })
  } catch (error) {
      res.status(500).json({
          errors: [error.message],
          message: "Something went wrong!",
          data: null
      })
  }
})



router.put('/update', async (req, res) => {

  try {

    const {
      productId,
      name,
      description,
      price,
      pictures,
      category
    } = req.body;

    //   or
    // const productId = req.body.productId;
    // const name = req.body.name;
    // const description = req.body.description;
    // const price = req.body.price;
    // const pictures = req.body.pictures;
    // const category = req.body.category;


    if (!productId || !name || !description || !price || !pictures || !category) {
      throw new Error("at least one of the required fields is required")
    }

    const product = await Product.findByIdAndUpdate(productId, {
      name,
      description,
      price,
      pictures,
      category
    }, { new: true });

    //or 
    // const product = await Product.findByIdAndUpdate(productId, {
    //   name: name,
    //   description: description,
    //   price: price,
    //   pictures: pictures,
    //   category: category
    // }, { new: true });



    res.status(200).json({
      errors: null,
      message: 'Product updated successfully',
      data: product
    })
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while updating the product',
      data: null
    })
  }

})



router.delete('/delete', async function (req, res) {
  try {
    const { productId } = req.body;
    if (!productId) {
      throw new Error('productId is not found')
    }
    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      errors: null,
      message: "Product deleted successfully",
      data: null,
    })
  } catch (error) {
    res.status(500)(
      {
        errors: [error.message],
        message: "some error occurred while deleting",
        data: null,
      }
    )
  }
})

router.get('/fetch-products',async (req,res)=>{
  try{
    const products=await Product.find();
    res.status(200).json({
      errors: null,
      message: 'products fetched',
      data: products
    })
  }catch(error){
    console.log(error)
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while fetching products',
      data: null
    })
  }

})
// router.get('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const product = await Product.findById(id);
//     const likes = await Like.find({
//       product: new mongoose.Types.ObjectId(id)
//     })
//     res.status(200).json({
//       error: null,
//       message: 'product retrieved successfully',
//       data: { product, likes }
//       //or 
//       //data: {
//       //   product: product,
//       //   likes: likes
//       // }
//     })
//   } catch (error) {
//     res.status(500).json({
//       errors: [error.message],
//       message: 'something went wrong while retrieving the product',
//       data: null,
//     })
//   }

// })

module.exports = { ProductController: router };