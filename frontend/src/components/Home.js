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

const {createSliderWithTooltip} = Slider;
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({match}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [heat, setHeat] = useState([1,4]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0)

    const categories = [
        'Hot Sauce',
        'Other Sauce',
        'Marinade',
        'BBQ Sauce',
        'Snacks',
        'Seasonings'
    ];

    const heatLevel = {
        1: "mild",
        2: "medium",
        3: "hot",
        4: "XXX Hot"
    
    };

    const alert = useAlert();
    const dispatch = useDispatch();

    const {loading, products, error, productsCount, resPerPage, filteredProductsCount} = useSelector(state => state.products);

    const keyword = match.params.keyword
    
    useEffect(() => {
        console.log('useEffect')
        
        if(error) {
            return alert.error(error)
        }

        dispatch(getProducts(keyword, currentPage, heat, category, rating)); 
        console.log(products)

    }, [dispatch, alert, error, keyword, currentPage, heat, category, rating])

    function setCurrentPageNo(pageNumber){
        setCurrentPage(pageNumber)
    }

    let count = productsCount;
    if(keyword){
        count = filteredProductsCount;
    }


    return (
        <Fragment >
            <div className="container container-fluid">
            {loading ? <Loader/> : (
                <Fragment>
                    <MetaData title={"Gringo Caliente - Hot Sauce"}/>
                    <h1 className="text-center" id="products_heading"><strong>Latest Products</strong></h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                        
                            {keyword ? (
                                <Fragment>
                                    <div className="col-12 col-md-3 pt-4 mt-5 mb-5" id="white-bg">
                                        <div className="px-5">
                                        <h4 className="mb-3">
                                            Heat
                                        </h4>
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
                                            <hr className="my-5"/>

                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Categories
                                                </h4>
                                                <ul className="pl-0">
                                                    {categories.map(category => (
                                                        <li
                                                        style={{cursor: 'pointer',
                                                                listStyleType: 'none',
                                                            }}
                                                        key={category}
                                                        onClick= {()=> setCategory(category)}
                                                        >
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Ratings
                                                </h4>
                                                <ul className="pl-0">
                                                    {[5,4,3,2,1].map(star => (
                                                        <li
                                                        style={{cursor: 'pointer',
                                                                listStyleType: 'none',
                                                            }}
                                                        key={star}
                                                        onClick= {()=> setRating(star)}
                                                        >
                                                            <div className="rating-outer">
                                                                <div className="rating-inner" style={{ width: `${ star*20}%`}}/>
                                                            </div>

                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-9">
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
                    
                    {resPerPage < count  && (
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
