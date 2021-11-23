import React from 'react'
import { Pagination } from 'react-bootstrap'
import PageItem from 'react-bootstrap/PageItem'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, keyword='', isAdmin=false}) => {
    return (
         pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map((x)=> (
                <LinkContainer key={x+1} 
                to={
                    !isAdmin ? 
                        keyword ? `/search/${keyword}/page/${x+1}` :
                        `/page/${x+1}`
                    :
                    `/admin/productlist/${x+1}`
                    }>
                    <PageItem active={x+1===page}>
                        {x+1}
                    </PageItem>
                </LinkContainer>
            ))}
            
        </Pagination>
     )
  )
}

export default Paginate
