import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { listOrders } from '../actions/orderAction';
import Loader from '../components/Loader';
import Message from '../components/Message';



const OrderListScreen = ({history}) => {

    const dispatch = useDispatch()

    const listOfOrders = useSelector(state=> state.listOfOrders)
    const { loading, orders, error } = listOfOrders

    const userLogin = useSelector(state=> state.userLogin)
    const { userInfo } = userLogin

    //console.log('users=>', users);

    useEffect(()=>{

        if(userInfo && userInfo.isAdmin){
            dispatch(listOrders())
        }else{
            history.push('/')
        }
        
    },[dispatch,userInfo,history])



    return (
        <>
          <h1>Orders</h1>
          { loading ? <Loader/> : error ? <Message>{error}</Message>
            :(
              <Table striped bordered hover responsive className="table-sm">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>USER</th>
                          <th>DATE</th>
                          <th>TOTAL</th>
                          <th>PAID</th>
                          <th>DELIVERED</th>
                          
                      </tr>
                  </thead>
                    <tbody>
                         {orders.map((order)=>(
                             <tr key={order._id}>
                                 <td>{order._id}</td>
                                 <td>{order.user && order.user.name}</td>
                                 <td>{order.createdAt.substring(0,10)}</td>
                                 <td>{order.totalPrice}</td>
                                 <td>
                                     {order.isPaid ? 
                                           order.paidAt.substring(0,10)
                                         : (
                                             <i className='fas fa-times' style={{color:'red'}}></i>
                                         )
                                         }
                                 </td>
                                 <td>
                                     {order.isDelivered ? 
                                           order.deliveredAt.substring(0,10)
                                         : (
                                             <i className='fas fa-times' style={{color:'red'}}></i>
                                         )
                                         }
                                 </td>
                                 <td>
                                     <LinkContainer to={`/order/${order._id}/edit`}>
                                         <Button variant='light' className='btn-sm'>
                                              Details
                                         </Button>
                                     </LinkContainer>
    
                                 </td>

                             </tr>
                         ))}
                    </tbody>

              </Table>
            )             
            }
            
        </>
    )
}

export default OrderListScreen
