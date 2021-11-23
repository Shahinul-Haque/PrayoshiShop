import React, { useEffect } from 'react';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderAction';
import CheckoutStep from '../components/CheckoutStep';
import Message from '../components/Message';

const PlaceOrderScreen = ({history}) => {

    const dispatch = useDispatch()

    const cart = useSelector(state=>state.cart)
    const orderCreate = useSelector(state=> state.orderCreate)

    const { error, success, order } = orderCreate

    //Calculation prices

    const adddecimals = (num)=>{
        return (Math.round(num*100) / 100).toFixed(2)
    }
     
    cart.itemsPrice = adddecimals(
        cart.cartItems.reduce((acc,item)=> acc + item.price * item.qty,0)
      )
    cart.shippingPrice = adddecimals(cart.itemsPrice > 100 ? 0 : 100)

    cart.taxPrice = adddecimals(Number((0.12*cart.itemsPrice).toFixed(2)))

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    useEffect(()=>{
        if(success){            
            history.push(`/order/${order._id}`)
        }
        //eslint-disable-next-line
    },[history, success])

    const placeOrderHandler = ()=>{
        dispatch(createOrder({
            orderItems : cart.cartItems,
            shippingAddress : cart.shippingAddress,
            paymentMethod : cart.paymentMethod,
            itemsPrice : cart.itemsPrice,
            shippingPrice : cart.shippingPrice,            
            taxPrice : cart.taxPrice,
            totalPrice: cart.totalPrice,
           
        }))
    }

    return (
        <>
        <CheckoutStep step1 step2 step3 step4/>
        <Row>
           <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                        <strong>Address:</strong>
                        {cart.shippingAddress.address}, {cart.shippingAddress.city}
                        {' '} {cart.shippingAddress.postalCode}, {' '}
                        {cart.shippingAddress.country}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                      <h2>Payment Method</h2>
                      <strong>Method: {cart.paymentMethod}</strong>    
                </ListGroup.Item>                        
                <ListGroup.Item>
                     <h2>Order Items</h2>
                     {cart.cartItems.length === 0 ? 
                      <Message variant='danger'>Your cart is empty</Message>
                    : (
                        <ListGroup variant='flush'>
                            {cart.cartItems.map((item,index)=>(
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col>
                                          <Link to={`/product/${item.product}`}>
                                              {item.name}
                                          </Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} × {item.price} = ${item.price*item.qty}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )
                     }
                </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
               <Card>
                   <ListGroup variant='flush'>
                      <ListGroup.Item>
                          <h2>Order Summary</h2>
                      </ListGroup.Item>
                      <ListGroup.Item>
                          <Row>
                              <Col>Items</Col>
                              <Col>${cart.itemsPrice}</Col>
                          </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                          <Row>
                              <Col>Shipping</Col>
                              <Col>${cart.shippingPrice}</Col>
                          </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                          <Row>
                              <Col>Tax</Col>
                              <Col>${cart.taxPrice}</Col>
                          </Row>
                      </ListGroup.Item>
                   </ListGroup>
                   <ListGroup.Item>
                          <Row>
                              <Col>Total</Col>
                              <Col>${cart.totalPrice}</Col>
                          </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                          { error && <Message variant='danger'> {error} </Message> }
                      </ListGroup.Item>
                      <ListGroup.Item>
                          <Button type='button' className='btn-block'
                             disabled={cart.cartItems ===0}
                             onClick={placeOrderHandler}
                          >
                           Place Order
                          </Button>
                      </ListGroup.Item>
               </Card>
          </Col>
        </Row>
        </>
    )
}

export default PlaceOrderScreen
