import { useEffect } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { createProduct, producDelete, productList } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { PRODUCT_CREATE_RESET } from '../constraints/productConstrain';


const ProductListScreen = ({match, history}) => {

    const dispatch = useDispatch()
    const pageNumber = match.params.pageNumber || 1

    const listProduct = useSelector(state=> state.listProduct)
    const { loading, error, products, pages, page } = listProduct

    const userLogin = useSelector(state=> state.userLogin)
    const { userInfo } = userLogin
    
    const productDelete = useSelector(state=> state.productDelete)
    const { success : deleteSuccess, loading: productLoading, error: productError } = productDelete

    const productCreate = useSelector(state=> state.productCreate)
    const { success : createSuccess, loading: createLoading, error: createError, product:createdProduct } = productCreate

    useEffect(()=>{

        if(!userInfo ){
           history.push('/login')
        }
        
        if(createSuccess){
            dispatch({type:PRODUCT_CREATE_RESET})
            history.push(`/admin/product/${createdProduct._id}/edit`)
        }else{
            dispatch(productList('', pageNumber))
        }
        
    },[dispatch,userInfo,history,deleteSuccess, createSuccess, createdProduct, pageNumber])

    const deleteHandler = (id)=>{
        if(window.confirm('Are you sure?')){
            dispatch(producDelete(id))
        }
        
    }

    const createOrductHandler = ()=>{
        dispatch(createProduct())
    }

    return (
        <>
          <Row className='align-items-center'>
              <Col>
                   <h1>Products</h1>
              </Col>
              <Col className='text-right'>
                  <Button className='my-3' onClick={createOrductHandler}>
                      <i className='fas fa-plus'> Create Product</i>
                  </Button>
              </Col>
          </Row>

          {productLoading && <Loader/>}
          {productError && <Message variant='danger'>{productError}</Message>}

          {createLoading && <Loader/>}
          {createError && <Message variant='danger'>{createError}</Message>}


          { loading ? <Loader/> : error ? <Message>{error}</Message>
            :(
              <>  
              <Table striped bordered hover responsive className="table-sm">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Category</th>
                          <th>Brand</th>

                      </tr>
                  </thead>
                    <tbody>
                         {products.map((product)=>(
                             <tr key={product._id}>
                                 <td>{product._id}</td>
                                 <td>{product.name}</td>
                                 <td>{product.price}</td>
                                 <td>{product.category}</td>
                                 <td>{product.brand}</td>
                                 <td>
                                     <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                         <Button variant='light' className='btn-sm'>
                                              <i className='fas fa-edit'></i>
                                         </Button>
                                     </LinkContainer>
                                     <Button variant='danger' className='btn-sm' onClick={()=> deleteHandler(product._id)}>
                                          <i className='fas fa-trash'></i>
                                     </Button>
                                 </td>

                             </tr>
                         ))}
                    </tbody>

              </Table>
              <Paginate pages={pages} page={page} isAdmin={true} />
              </>
            )             
            }
            
        </>
    )
}

export default ProductListScreen
