import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserDetails, updateUser } from '../actions/userAction';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { USER_UPDATE_RESET } from '../constraints/userConstraint';

const UserEditScreen = ({ match, history })=>{

    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [isAdmin, setIsdmin] = useState(false)

     const userId = match.params.id

     const dispatch = useDispatch();

     const userDetails = useSelector(state => state.userDetails);
     const { user, loading, error } = userDetails;

     const updateUserByAdmin = useSelector(state => state.updateUser);
     const { success: successUpdate, loading: loadingUpdate, error : errorUpdate } = updateUserByAdmin;

     useEffect(() => {    
         
         if(successUpdate){
            dispatch({type: USER_UPDATE_RESET })
            history.push('/admin/userlist')
         } else{
             
            if(!user || user._id !== userId){
                dispatch(getUserDetails(userId))
            }else{
                setName(user.name)
                setEmail(user.email)
                setIsdmin(user.isAdmin)
            
            }
         }

         
     }, [dispatch, user, userId, history, successUpdate])

    const submitHandler= (e)=>{        
     e.preventDefault();
     //console.log('Checking isAdmin-',isAdmin)
     dispatch(updateUser({_id: userId, name, email, isAdmin}))
     

    }

    return <>

          <Link to='/admin/userlist' className='btn btn-light my-3'>
              Go Back
          </Link>
          
          <FormContainer>
            <h1>Edit User</h1>
             {loadingUpdate && <Loader/>}
             {errorUpdate && <Message>{errorUpdate}</Message>}
             {loading ? <Loader/> : error ? <Message>{error}</Message>
                 : (
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
        
                        <Form.Group controlId="isAdmin">
                            <Form.Check type="checkbox" 
                                        label='isAdmin'
                                        checked={isAdmin}
                                        onChange={(e)=> setIsdmin(e.target.checked) }
                            ></Form.Check>
                        </Form.Group>
        
                        <Button type="submit" variant='primary' style={{marginTop:'10px'}}>
                            Update
                        </Button>
                    </Form>
                 )
             }

           

       </FormContainer>
     </>  
}

export default UserEditScreen;