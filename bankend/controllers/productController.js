
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';



//@desc Fetch all products 
// @route GET/api/produts
// @access public
const getProducts = asyncHandler(async (req,res)=>{

    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
          name : { $regex : req.query.keyword,
           $options : 'i'}
           
       }: {}

    const count = await Product.countDocuments({...keyword});
    //console.log('Count page and page', count, page);
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page-1))
    res.json({products, page, pages: Math.ceil( count / pageSize)})
})


//@desc Fetch single products 
// @route GET/api/produts/:id
// @access public
const getProductByID = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)

    if(product){
         res.json(product)

    } else {
        
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc Delete single product 
// @route Delete/api/produts/:id
// @access private
const deleteProduct = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)

    if(product){
         await product.remove()
         res.json({
             message:'Product removed'
         })

    } else {
        
        res.status(404)
        throw new Error('Product not found')
    }
})


//@desc Create a product 
// @route POST/api/produts
// @access private

const createProduct = asyncHandler ( async(req,res)=>{
   const product = new Product({
        name: 'Sample name',
        user: req.user._id,
        image: '/images/sample.jpg',
        description: 'Sample description',
        brand: 'Sample',
        category: 'Sample category',
        price: 0,
        countInStock: 0,
        rating: 4.0,
        numReviews: 4,

   })

   const createProduct = await product.save()
   res.status(201).json(createProduct)
  // console.log(createProduct);
})


//@desc Update a product 
// @route Put/api/produts/:id
// @access private

const updateProduct = asyncHandler ( async(req,res)=>{
    
    const { name, price, description, brand, category, countInStock } = req.body

    const product = await Product.findById(req.params.id)
    if(product){
        product.name = name 
        product.price = price
        product.description = description
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
    }
 
    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
 })

 
//@desc Create new review 
// @route POST/api/produts/:id/review
// @access private

const createProductReview = asyncHandler ( async(req,res)=>{
    
     const { rating, comment } = req.body

     const product = await Product.findById(req.params.id)

     if(product){
        
        const alreadyReviewed = product.reviews.find((r)=> r.user.toString() === req.user._id.toString())

        if(alreadyReviewed){
            res.status(400)
            throw new Error('Product already reviews')
        }

        const review = {
            name : req.user.name,
            rating : Number(rating),
            comment,
            user : req.user._id
        }
        product.reviews.push(review)        
        
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item)=> item.rating + acc, 0) / product.reviews.length
        
        await product.save()

        res.status(201).json({ message : 'Review added.'})

     }else{
         res.status(404)
         throw new Error('Product not found')
     }

 })

 
//@desc Get top rated products 
// @route GET/api/produts/top
// @access public
const getTopProducts = asyncHandler(async (req,res)=>{

   const products = await Product.find({}).sort({ rating : -1}).limit(3)
   res.json(products)
   
})

export { getProducts, getProductByID, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts };

