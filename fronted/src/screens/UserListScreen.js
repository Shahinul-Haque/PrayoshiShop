import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { deleteUser, getUsers } from '../actions/userAction';
import Loader from '../components/Loader';
import Message from '../components/Message';



const UserListScreen = ({history}) => {

    const dispatch = useDispatch()

    const userList = useSelector(state=> state.userList)
    const { loading, users, error } = userList

    const userLogin = useSelector(state=> state.userLogin)
    const { userInfo } = userLogin

    const removeUser = useSelector(state=> state.removeUser)
    const { success : deleteSuccess } = removeUser

    //console.log('users=>', users);

    useEffect(()=>{

        if(userInfo && userInfo.isAdmin){
            dispatch(getUsers())
        }else{
            history.push('/')
        }
        
    },[dispatch,userInfo,history, deleteSuccess])

    const deleteHandler = (id)=>{
        if(window.confirm('Are you sure')){
            dispatch(deleteUser(id))
        }
       
    }

    return (
        <>
          <h1>Users</h1>
          { loading ? <Loader/> : error ? <Message>{error}</Message>
            :(
              <Table striped bordered hover responsive className="table-sm">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Admin</th>

                      </tr>
                  </thead>
                    <tbody>
                         {users.map((user)=>(
                             <tr key={user._id}>
                                 <td>{user._id}</td>
                                 <td>{user.name}</td>
                                 <td><a href={`mailto: ${user.email}`}>{user.email}</a></td>
                                 <td>
                                     {user.isAdmin ? (<i className='fas fa-check' style={{ color:'green'}}></i>)
                                         : (
                                             <i className='fas fa-times' style={{color:'red'}}></i>
                                         )
                                         }
                                 </td>
                                 <td>
                                     <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                         <Button variant='light' className='btn-sm'>
                                              <i className='fas fa-edit'></i>
                                         </Button>
                                     </LinkContainer>
                                     <Button variant='danger' className='btn-sm' onClick={()=> deleteHandler(user._id)}>
                                          <i className='fas fa-trash'></i>
                                     </Button>
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

export default UserListScreen
