import { red } from 'colors';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { listMyOrders } from '../actions/orderAction';
import { getUserDetails, updateUserProfile } from '../actions/userAction';
import Loader from '../components/Loader';
import Message from '../components/Message';


const ProfileScreen = ({ location, history })=>{
    const [name, setName] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null)

  
     const dispatch = useDispatch();

     const userDetails = useSelector(state => state.userDetails);
     const { loading, error, user } = userDetails;

     const userLogin = useSelector(state=> state.userLogin);
     const { userInfo } = userLogin;

     const userUpdate = useSelector(state => state.userUpdate);
     const { success } = userUpdate

     const orderList = useSelector(state => state.orderList);
     const { loading: loadingOrders, error: errorOrders, orders } = orderList


     useEffect(() => {

         if(!userInfo){
             history.push('/login')
         }else{
            if(!user.name){
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            }else{
                setName(user.name)
                setEmail(user.email)
            }
         }
        
     }, [dispatch,history, userInfo, user])

    

    const submitHandler= (e)=>{        
     e.preventDefault();
     if(password !== confirmPassword){
         setMessage('Password do not match')
     }else{
        dispatch(updateUserProfile({id : user._id, name, email, password}))
     }
     

    }

    return <Row>    
            <Col md={3}>
                <h1>User Profile</h1>

                {error && <Message variant='danger'>{error}</Message>}
                {message && <Message variant='danger'>{message}</Message>}
                {success && <Message variant='success'>Profile Updated</Message>}

                {loading && <Loader />}

                <Form onSubmit={submitHandler}>

                    <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name"
                                            value={name}
                                            onChange={(e)=> setName(e.target.value) }
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"
                                            value={email}
                                            onChange={(e)=> setEmail(e.target.value) }
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password"
                                            value={password}
                                            onChange={(e)=> setPassword(e.target.value) }
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="Confirmpassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={(e)=> setConfirmPassword(e.target.value) }
                            ></Form.Control>
                        </Form.Group>

                        <Button type="submit" variant='primary'>
                            UPDATE
                        </Button>
                    </Form>

            </Col>
            
            <Col md={9}> 
            <h2>My Orders</h2>
            {loadingOrders ? <Loader/> : errorOrders ? <Message variant='danger'>{errorOrders}</Message>
              : (
                  <Table striped bordered hover responsive className="table-sm">
                     <thead>
                         <tr>
                             <th>ID</th>
                             <th>DATE</th>
                             <th>TOTAL</th>
                             <th>PAID</th>
                             <th>DELIVERED</th>
                         </tr>
                     </thead>
                     <tbody>
                         {orders && orders.map((order)=> (
                             <tr key={order._id}>
                                 <td>{order._id}</td>
                                 <td>{order.createdAt.substring(0,10)}</td>
                                 <td>{order.totalPrice}</td>
                                 <td>
                                     {order.isPaid ? (
                                         order.paidAt.substring(0,10)
                                     ):(
                                         <i className='fas fa-times' style={{ color: red}}></i>
                                     )

                                     }
                                </td>
                                 <td>
                                    {order.isDelivered ? (
                                            order.deliveredAt.substring(0,10)
                                        ):(
                                            <i className='fas fa-times' style={{ color:red}}></i>
                                        )
                                        }
                                 </td>
                                 <td>
                                     <LinkContainer to={`/order/${order._id}`}>
                                         <Button variant='light'>Details</Button>
                                     </LinkContainer>
                                 </td>

                             </tr>
                         ))}
                     </tbody>
                  </Table>
              )
            }
            </Col>

        </Row>
}   

export default ProfileScreen;