import React, { Fragment, useEffect } from 'react';

import MetaData from '../components/layouts/MetaData';
import Loader from '../components/layouts/Loader';
import Product from './product/Product';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions'

const Home = () => {

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch])

    const {loading, products, error, productsCount } = useSelector(state => state.products)

    return (
        <Fragment className="container container-fluid">
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
                </Fragment>
            )}
        </Fragment>

    )
}

export default Home
