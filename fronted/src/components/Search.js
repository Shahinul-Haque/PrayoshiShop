import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const Search = ({ history }) => {

    const [keyword, setKeyword] = useState('')

    const submitHandler = (e)=>{
        e.preventDefault()
        
        if(keyword.trim()){
            history.push(`/search/${keyword}`)
            setKeyword('')
        }else{
            history.push('/')
        }
    }

    return (
        <Form className='d-flex' onSubmit={submitHandler}  style={{position:'absolute'}}>
             <Form.Control
              type='text'
              placeholder='Search Products..'
              onChange={(e)=> setKeyword(e.target.value)}
              value={keyword}
              name='q'
              className='mr-sm-2 ml-sm-5 mt-2'>
                 
             </Form.Control>
             <Button type='submit' variant='outline-success' className='p-2'>
                 Search
             </Button>
        </Form>
    )
}

export default Search
