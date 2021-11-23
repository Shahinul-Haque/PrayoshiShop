import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { productListDetails, updateProduct } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_UPDATE_RESET } from '../constraints/productConstrain';


const ProductEditScreen = ({history,match}) => {

    const productId = match.params.id

    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [price, setPrice] = useState(0)
    //const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()
    // const userLogin = useSelector(state=> state.userLogin)
    // const { userInfo } = userLogin
    
    const productDetails = useSelector(state=> state.productDetails)
    const { product, loading: productDetailsLoading, error: productDetailsError } = productDetails

    const productUpdate = useSelector(state=> state.productUpdate)
    const { success:ProductUpdatSuccess , loading: productUpdateLoading, error: productUpdateError } = productUpdate


    useEffect(()=>{

    if(ProductUpdatSuccess){
        dispatch({ type:PRODUCT_UPDATE_RESET })
        history.push('/admin/productlist')
    } 
        else{
        
            if(!product || product._id !== productId){
                //dispatch({type:PRODUCT_DETAILS_RESET})
                dispatch(productListDetails(productId))
                //history.push(`/admin/product/${productId}/edit`)
            }else{
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setCountInStock(product.countInStock)
                setDescription(product.description)
                setBrand(product.brand)
                setCategory(product.category)
            }
        }
        
    },[dispatch,history,product, productId, ProductUpdatSuccess])

    // const uploadFileHandler = async(e)=>{
        
    //     const file = e.target.files[0]
    //     const formData = new FormData()
    //     formData.append('image', file)
    //     setUploading(true)

    //     try {

    //         const config = {
    //             headers:{
    //                 'Content-Type' : 'multipart/form-data'
    //             }
    //         }
            
    //         const { data } = await axios.post('/api/upload', formData, config)

    //         setImage(data)
    //         setUploading(true)
                        
    //     } catch (error) {
    //         console.error(error)
    //         setUploading(false)
    //     }
    // }

    const submitHandler = (e)=>{
        //Update
        e.preventDefault();
        dispatch(updateProduct({_id: productId, name, price, countInStock, description, brand, category}))
    }

    return <>

          <Link to='/admin/productlist' className='btn btn-light my-3'>
              Go Back
          </Link>
           
          <FormContainer>
            <h1>Edit Product</h1>
            
            {productUpdateLoading && <Loader/>}
            {productUpdateError && <Message>{productUpdateError}</Message>}

             {productDetailsLoading ? <Loader/> : productDetailsError ? <Message>{productDetailsError}</Message>
                 : (
                    <Form onSubmit={submitHandler}>

                        <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name"
                                                value={name}
                                                onChange={(e)=> setName(e.target.value) }
                                ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" placeholder="Enter price"
                                                value={price}
                                                onChange={(e)=> setPrice(e.target.value) }
                                ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control type="text" placeholder="Enter a Category"
                                                value={category}
                                                onChange={(e)=> setCategory(e.target.value) }
                                ></Form.Control>
                        </Form.Group>
        
                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" placeholder="Enter image url"
                                            value={image}
                                            onChange={(e)=> setImage(e.target.value) }
                            ></Form.Control> 
                        </Form.Group>

                        
        
                        <Form.Group controlId="brand">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type="text" placeholder="Enter brand"
                                                value={brand}
                                                onChange={(e)=> setBrand(e.target.value) }
                                ></Form.Control>
                        </Form.Group>
        

                        <Form.Group controlId="countInStock">
                                <Form.Label>CountInStock</Form.Label>
                                <Form.Control type="number" placeholder="Enter countInStock"
                                                value={countInStock}
                                                onChange={(e)=> setCountInStock(e.target.value) }
                                ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" placeholder="Enter description"
                                                value={description}
                                                onChange={(e)=> setDescription(e.target.value) }
                                ></Form.Control>
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

export default ProductEditScreen
