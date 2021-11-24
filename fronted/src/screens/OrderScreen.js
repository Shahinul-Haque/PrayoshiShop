import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DeliverOrder, getOrderDetails, payOrder } from '../actions/orderAction';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constraints/orderConstraint';

const OrderScreen = ({ match }) => {

    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state=> state.orderDetails)
    const { error, loading, order } = orderDetails

    const orderPay = useSelector(state=> state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const userLogin = useSelector(state=> state.userLogin)
    const { userInfo } = userLogin

    const orderDeliver = useSelector(state=> state.orderDeliver)
    const { loading: loadingDelivery, success: successDelivery, error : errorDelivery } = orderDeliver

    //console.log(orderPay);
    
    const orderId = match.params.id
    
    //Calculation prices
    if(!loading){
        const adddecimals = (num)=>{
            return (Math.round(num*100) / 100).toFixed(2)
        }         
        order.itemsPrice = adddecimals(
            order.orderItems.reduce((acc,item)=> acc + item.price * item.qty,0)
          )
    }       
    
    useEffect(()=>{       

        const addPaypalScript = async ()=>{
            const { data : clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = ()=>{
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if(!order || successPay || successDelivery){
            dispatch({ type: ORDER_PAY_RESET }) 
            dispatch({type: ORDER_DELIVER_RESET})           
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid){
            if(!window.paypal){
                addPaypalScript()
            }else{
                setSdkReady(true)
            }
        }
        
              // eslint-disable-next-line
    },[dispatch, orderId, order, successPay, successDelivery])

    const successPaymentHandler = (paymentResult)=>{
        //console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    const delilverHandler = ()=>{
        dispatch(DeliverOrder(orderId))
    }
 
        
    return loading ? <Loader/> : error ? <Message>{error}</Message>
            :
           <> 
            <h2>Order {order._id}</h2>
            <Row>
            <Col md={8}>
                <ListGroup variant='flush'>

                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong> {order.user.name}</p>
                        <p>
                         <strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>    
                        <p>
                            <strong>Address:</strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                            {' '} {order.shippingAddress.postalCode}, {' '}
                            {order.shippingAddress.country}
                        </p>
                          {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message>
                            :
                            <Message variant='danger'>Not Paid</Message>
                          }
                     </ListGroup.Item>        
                                           
                    <ListGroup.Item>
                       <p> <h2>Payment Method</h2> </p>
                        <p> 
                            <strong>Method: {order.paymentMethod}</strong>   
                        </p>  
                          {order.isDelivered ? <Message variant='success'>Delivery on {order.deliveredAt}</Message>
                            :
                            <Message variant='danger'>Not Delivered</Message>
                          }    
                     </ListGroup.Item>   
                                     
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? 
                        <Message variant='danger'>Your cart is empty</Message>
                        : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item,index)=>(
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
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                    </ListGroup.Item>

                    {!order.isPaid && (
                       <ListGroup.Item>
                           {loadingPay && <Loader/>}
                           {!sdkReady ?(
                               <Loader/>
                           ):(
                               <PayPalButton
                                 amount={order.totalPrice}
                                 onSuccess={successPaymentHandler}
                               />
                           )}
                       </ListGroup.Item>
                    )}
                    
                    {loadingDelivery && <Loader/>}
                    {errorDelivery && <Message> {errorDelivery}</Message>}

                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                            <Button 
                                type='button' 
                                className='btn btn-block' 
                                onClick={delilverHandler}>
                                Mark As Delivered
                            </Button>
                        </ListGroup.Item>
                    )}
                        
                        {/* <ListGroup.Item>
                            <Button type='button' className='btn-block'
                                disabled={order.orderItems ===0}
                                onClick={placeOrderHandler}
                            >
                            Place Order
                            </Button>
                        </ListGroup.Item> */}
                </Card>
            </Col>
        </Row>    
      </>      
        
        
}

export default OrderScreen
