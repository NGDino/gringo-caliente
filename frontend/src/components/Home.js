import React, { Fragment, useEffect, useState } from 'react';

import MetaData from '../components/layouts/MetaData';
import Loader from '../components/layouts/Loader';
import Product from './product/Product';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const heatLevel = {
    1: "mild",
    2: "medium",
    3: "hot",
    4: "XXX Hot"

};

const {createSliderWithTooltip} = Slider;
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({match}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [heat, setHeat] = useState([1,4]);

    const alert = useAlert();
    const dispatch = useDispatch();

    const {loading, products, error, productsCount, resPerPage} = useSelector(state => state.products);

    const keyword = match.params.keyword
    
    useEffect(() => {
        
        if(error) {
            return alert.error(error)
        }

        dispatch(getProducts(keyword, currentPage, heat));

    }, [dispatch, alert, error, keyword, currentPage, heat])

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
                        
                            {keyword ? (
                                <Fragment>
                                    <div className="col=6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{ 
                                                    1: "Mild",
                                                    4: "XXX Hot"
                                                }}
                                                min={1}
                                                max={4}
                                                dots= {true}
                                                default={[1 , 4]}
                                                tipFormatter={value => `${heatLevel[value]}`}
                                                tipProps={{
                                                    placement: 'top',
                                                }}
                                                value={heat}
                                                onChange= {heat=> setHeat(heat)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products.map((product) =>(
                                            <Product key={product._id} product={product} col={4}/>
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>

                            ):(
                                products.map((product) =>(
                                    <Product key={product._id} product={product} col={3}/>
                                ))
                            )}

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
