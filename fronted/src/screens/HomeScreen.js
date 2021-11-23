import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { productList } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = ({ match }) => {
 
    const dispatch = useDispatch();
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1

    const listProduct = useSelector((state)=> state.listProduct)

    const { loading, error, products, page, pages } = listProduct;

    //console.log('pages, page', pages,page)

    useEffect(()=>{
       dispatch(productList(keyword, pageNumber));
    },[dispatch, keyword, pageNumber]);


    return (
        <>
         <Meta />
          {!keyword ? (<ProductCarousel /> ): 
             (<Link className='btn btn-light'  to='/'>
                 Go Back
             </Link>)
          }
          
          <h1>Latest Products</h1>
           
               {loading ? (
                  <h2><Loader /></h2> ) : 
                   error ? 
                    (<Message variant="danger"> {error} </Message>) 
                    
                    :   

                    (
                    <>    
                    <Row>
                    {products.map((product)=>(
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                    ))}
                    </Row> 
                      <Paginate 
                         pages={pages}
                         page={page} 
                         keyword={keyword ? keyword : ''}/>
                    </>
                    )
               
               }
            
        </> 
    )
}

export default HomeScreen
