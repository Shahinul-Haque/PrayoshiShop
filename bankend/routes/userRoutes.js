import express from 'express';
import { authUser, getUserById, getUserProfile, getUsers, registerNewUser, removeUser, updateUser, updateUserProfile } from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router
       .route('/')
       .post(registerNewUser)
       .get(protect, admin, getUsers);
       
router.post('/login', authUser);
router
      .route('/profile')
      .get(protect, getUserProfile)
      .put(protect, updateUserProfile)
router.route('/:id')
      .delete(protect, admin, removeUser) 
      .get(protect,admin, getUserById)
      .put(protect, admin, updateUser)


//router.get('/:id',getProductByID );

export default router;