import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews, deleteReview, clearErrors } from '../../actions/productActions'
import { useAlert } from 'react-alert';
import { MDBDataTable } from 'mdbreact';

import {DELETE_REVIEW_RESET} from '../../constants/productConstants'

import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import Sidebar from './Sidebar';


const ProductReviews = () => {

    const [productId, setProductId] = useState('')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { reviews, error } = useSelector(state => state.productReviews);
    const {isDeleted, error: deleteError} = useSelector(state => state.review)


    useEffect(() => {

        if (error) {
            alert.error(error);
            // dispatch(clearErrors())
        }
        if(deleteError){
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success('Review Deleted Successfully')
            dispatch({type: DELETE_REVIEW_RESET})
        }
        if (productId !== '') {
            dispatch(getProductReviews(productId))
        }

    }, [alert,  error, deleteError, isDeleted])

    const deleteHandler = (id) => {
        dispatch(deleteReview(id, productId))
    }

    const  submitHandler = async (e) => {
        e.preventDefault();
        try{
            await dispatch(getProductReviews(productId))
        
        }catch(error){
            alert.error(error);
            dispatch(clearErrors())
            
        }
        
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'review ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        }
        

        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,
                actions:
                    <Fragment>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteHandler(review._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>

            })
        })
        return data;
    }
    return (
        <Fragment>
            <MetaData title={'All Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>

                        <div className="row justify-content-center mt-5">
                            <div className="col-5 p-4" id="white-bg">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="productId_field">Enter Product ID</label>
                                        <input
                                            type="text"
                                            id="productId_field"
                                            className="form-control"
                                            value={productId}
                                            onChange= {(e) => setProductId(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        SEARCH
                                    </button>
                                </ form>
                            </div>

                        </div>
                        <h1 className="my-5">All Reviews</h1>
                        {reviews && reviews.length > 0 ? (
                            <MDBDataTable id="table-bg"
                                data={setReviews()}
                                className='px-3'
                                bordered
                                striped
                                hover
                            />
                        ) :(
                            <h4 className= "mt-5 text-center"> No Reviews</h4>
                        )}
                                
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default ProductReviews
