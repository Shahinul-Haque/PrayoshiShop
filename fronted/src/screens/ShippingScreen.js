import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartAction';
import CheckoutStep from '../components/CheckoutStep';
import FormContainer from '../components/FormContainer';


const ShippingScreen = ({history}) => {
    
    const dispatch = useDispatch()
    const cart = useSelector(state=>state.cart)

    const userLogin = useSelector(state=>state.userLogin)
    const { userInfo } = userLogin;

    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)


    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }
    }, [userInfo,history])

    const submitHandler =(e)=>{
        e.preventDefault();

        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        history.push('/payment')
    }

    return (
          <FormContainer>
            <CheckoutStep step1 step2 />   
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address"
                                    value={address}
                                    onChange={(e)=> setAddress(e.target.value) }
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="Enter city"
                                    value={city}
                                    onChange={(e)=> setCity(e.target.value) }
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="postalCode">
                    <Form.Label>PostalCode</Form.Label>
                    <Form.Control type="text" placeholder="Enter postalcode"
                                    value={postalCode}
                                    onChange={(e)=> setPostalCode(e.target.value) }
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" placeholder="Enter country"
                                    value={country}
                                    onChange={(e)=> setCountry(e.target.value) }
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}


export default ShippingScreen