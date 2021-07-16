import React, { Fragment, useEffect, useState } from 'react';

import MetaData from '../components/layouts/MetaData';
import Loader from '../components/layouts/Loader';
import Product from './product/Product';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';


const Home = ({match}) => {

    const [currentPage, setCurrentPage] = useState(1)

    const alert = useAlert();
    const dispatch = useDispatch();

    const {loading, products, error, productsCount, resPerPage} = useSelector(state => state.products);

    const keyword = match.params.keyword
    
    useEffect(() => {
        
        if(error) {
            return alert.error(error)
        }

        dispatch(getProducts(keyword, currentPage));

    }, [dispatch, alert, error, keyword, currentPage])

    function setCurrentPageNo(pageNumber){
        setCurrentPage(pageNumber)
    }


    return (
        <Fragment >
            <div className="container container-fluid">
            {loading ? <Loader/> : (
                <Fragment>
                    <MetaData title={"Hot Sauce"}/>
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">

                            {products && products.map((product) =>(
                                <Product key={product._id} product={product}/>
                            ))}
                            

                        </div>
                    </section>
                    
                    {resPerPage < productsCount  && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage = {currentPage}
                                itemsCountPerPage = {resPerPage}
                                totalItemsCount={productsCount}
                                onChange = {setCurrentPageNo}
                                nextPageText = {'Next'}
                                prevPageText = { 'Prev'}
                                firstPageText = { 'First'}
                                lastPageText = { 'Last'}
                                itemClass = 'page-item'
                                linkClass = 'page-link'

                            />
                    </div>
                    )}
                    

                </Fragment>
            )}
            </div>

        </Fragment>

    )
}

export default Home
