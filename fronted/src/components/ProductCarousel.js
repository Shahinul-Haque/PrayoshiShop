import React, { useEffect } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTopProductsList } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';


const ProductCarousel = () => {

    const dispatch = useDispatch()

    const topProductsList = useSelector(state=> state.topProductsList)
    
    const { loading, error, products } = topProductsList

    useEffect(()=>{
        dispatch(getTopProductsList())
    },[dispatch])

    return loading ? <Loader /> 
              : error ? <Message variant='danger'>{error}</Message> : (
             
         <Carousel pause='hover' className='bg-dark' style={{ marginTop:'15px'}}>
            {products.map((product)=>(
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />        
                        <Carousel.Caption className='carousel-capiton'>
                            <h2>
                                {product.name} (${product.price})
                            </h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
         </Carousel>       
    ) 
}

export default ProductCarousel
