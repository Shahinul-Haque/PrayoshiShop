import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';



//@desc Create new order 
// @route Post /api/orders
// @access private

export const addOrderItems = asyncHandler(async (req,res)=>{
   
    const { orderItems, 
            shippingAddress,
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice} = req.body

      if(orderItems && orderItems.length ===0){
          res.status(400)
          throw new Error('No Order Items.')
          return
      }else{
          const order = new Order({
              orderItems,
              user : req.user._id,
              shippingAddress,
              paymentMethod,
              itemsPrice,
              taxPrice,
              shippingPrice,
              totalPrice
          })

          const createOrder = await order.save()
          res.status(201).json(createOrder)
      }
      
      
})


//@desc Get an order by Id 
// @route Get /api/orders/:id
// @access private

export const getOrderById = asyncHandler ( async(req,res)=>{

    const order = await Order.findById(req.params.id).populate('user', 'name email')

    //console.log(order);

    if(order){
        res.json(order)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
})


//@desc Update order to paid
// @route Get /api/orders/:id/pay
// @access private

export const updateOrderToPaid = asyncHandler(async(req,res)=>{
    
    const order = await Order.findById(req.params.id)

    //console.log("OrderId->",req.params.id);
    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time : req.body.update_time,
            email_address : req.body.payer.email_address
        }
    
        const updateOrder = await order.save()
        res.json(updateOrder)

    }
     else{
        res.status(404)
        throw new Error('Order not found')
    }

   // console.log(order);
})


//@desc Get logged in user orders
// @route Get /api/orders/myorders
// @access private

export const getMyOrders = asyncHandler(async(req,res)=>{
   const order = await Order.find({user:req.user._id})
   res.json(order)

    //console.log(order);
})


//@desc Get all orders
// @route Get /api/orders
// @access private

export const getOrders = asyncHandler(async(req,res)=>{
    const orders = await Order.find({}).populate('user','id name')
    //console.log('My Orders',orders)
    res.json(orders)
 
     //console.log(order);
 })
 
 
//@desc Update order to delivered
// @route Put /api/orders/:id/deliver
// @access private

export const updateOrderToDelivered = asyncHandler(async(req,res)=>{
    
    const order = await Order.findById(req.params.id)

    if(order){
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updateOrder = await order.save()
        res.json(updateOrder)

    }
     else{
        res.status(404)
        throw new Error('Order not found')
    }

   // console.log(order);
})