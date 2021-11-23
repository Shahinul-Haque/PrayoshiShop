
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utlis/generateToken.js';



//@desc  Post user and get token 
// @route Post/api/users/login
// @access public
const authUser = asyncHandler(async (req,res)=>{
    const { email, password } = req.body

    const  user = await User.findOne({ email })

    if ( user && (await user.matchPassword(password))) {

        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

//@desc  Get user profile
// @route get/api/users/profile
// @access private
const getUserProfile = asyncHandler(async(req,res)=>{

    const user = await User.findById(req.user._id);
    
    if(user){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id),
        })
    }else {
        res.status(401)
        throw new Error('User not found.')
    }
})

//@desc  Regiser a new user
// @route get/api/users/
// @access public
const registerNewUser = asyncHandler( async(req,res)=>{
    const { name, email, password } = req.body;

    const existUser = await User.findOne({email})

    if(existUser){
        res.status(400)
        throw new Error("User already exist.")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    //console.log("UserInfo =>", user);

    if(user){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id),
        })
    }else {
        res.status(401)
        throw new Error('Invalid user data.')
    }
})

//@desc  Update user profile
// @route put/api/users/profile
// @access private
const updateUserProfile = asyncHandler( async(req,res)=>{
   
    const user = await User.findById(req.user._id)

    if(user){

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password){
            user.password = req.body.password
        }

        const updateUser = await user.save();
 
        res.json({
            _id : updateUser._id,
            name : updateUser.name,
            email : updateUser.email,
            isAdmin : updateUser.isAdmin,
            token : generateToken(updateUser._id),
        })

    } else{
        res.status(404)
        throw new Error('User not found.')
    }

   

})


//@desc  Update user profile
// @route put/api/users/profile
// @access private
const getUsers = asyncHandler( async(req,res)=>{
    const data = await User.find({})
    //console.log(user);
    res.json(data);
})

const removeUser = asyncHandler( async(req,res)=>{
    //console.log('UserID->', req.params.id);
    const user = await User.findById(req.params.id)

    if(user){
        await user.remove();
        res.json({
            message: 'User Removed.'
        })
    }else{
        res.status(403)
        new Error('No user found for delete.')
    }
})


//@desc  Get user name and eamil
// @route get/api/users/:id
// @access private
const getUserById = asyncHandler(async(req,res)=>{
     const user = await User.findById(req.params.id).select('-password')
     if(user){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
        })
     }
})

//@desc  Update a user details
// @route put/api/users/:id
// @access private
const updateUser = asyncHandler( async(req,res)=>{
   
    const user = await User.findById(req.params.id).select('-password')

    //console.log('Checking is Admin-', req.body.isAdmin);

    if(user){

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updateUser = await user.save();
 
        res.json({
            _id : updateUser._id,
            name : updateUser.name,
            email : updateUser.email,
            isAdmin : updateUser.isAdmin,
        })

    } else{
        res.status(404)
        throw new Error('User not found.')
    }

   

})

export { authUser, getUserProfile, registerNewUser, updateUserProfile, getUsers, removeUser, getUserById, updateUser };

