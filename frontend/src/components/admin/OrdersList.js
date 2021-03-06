import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {getAllOrders, deleteOrder, clearErrors} from '../../actions/orderActions'
import { useAlert } from 'react-alert';
import {MDBDataTable} from 'mdbreact';

import {DELETE_ORDER_RESET} from '../../constants/orderConstants'

import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import Sidebar from './Sidebar';


const OrdersList = ({history}) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    
    const { loading, error, orders } = useSelector(state => state.allOrders);
    const {isDeleted} = useSelector(state => state.order)

    useEffect(() => {
        dispatch(getAllOrders());

        if(error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success('order Deleted Successfully')
            history.push('/admin/orders')
            dispatch({type: DELETE_ORDER_RESET})
        }
        
    },[ alert, error, isDeleted, history])

    const deleteHandler = (id) => {
        console.log('delete', id)
        dispatch(deleteOrder(id))
    }

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id', 
                    sort: 'asc'
                },
                {
                    label: 'Num of Items',
                    field: 'numOfItems', 
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount', 
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status', 
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


        orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice.toFixed(2)}`, 
                status: order.orderStatus && String(order.orderStatus).includes('Delivered') ? <p style={{color: 'green'}}>{order.orderStatus}</p> : <p style={{color: 'red'}}>{order.orderStatus}</p>,
                actions: 
                    <Fragment>
                            <Link to= {`/admin/order/${order._id}`} className= 'btn btn-primary py-1 px-2'>
                            <i className="fa fa-eye"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={ () => deleteHandler(order._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                    
            })
        })
        return data;
    }
    return (
        <Fragment>
        <MetaData title={'All Orders'}/>
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>

            <div className="col-12 col-md-10">
                <Fragment>
                    <h1 className="my-5 text-center" >All Orders</h1>
                    {loading ? <Loader/> : (
                        <Fragment>
                            <MDBDataTable id="table-bg"
                                data={setOrders()}
                                className='px-3'
                                bordered
                                striped
                                hover
                            />
                        </Fragment>
                    )}
                </Fragment>
            </div>
        </div>
    </Fragment>
    )
}

export default OrdersList
