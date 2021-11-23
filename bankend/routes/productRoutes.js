import express from 'express';
import { createProduct, createProductReview, deleteProduct, getProductByID, getProducts, getTopProducts, updateProduct } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.route('/')
         .get(getProducts)
         .post(protect, admin, createProduct)

router.route('/top').get(getTopProducts)

router.route('/:id/reviews').post(protect, createProductReview)    

router.route('/:id') 
             .get(getProductByID)
             .delete(protect, admin, deleteProduct )
             .put(protect, admin, updateProduct)
      

export default router;