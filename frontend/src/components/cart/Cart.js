import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import { addItemToCart, removeItemFromCart } from '../../actions/cartActions';

import MetaData from '../layouts/MetaData';



const Cart = ({history}) => {

    const dispatch = useDispatch();

    const { cartItems } = useSelector(state => state.cart);

    const increaseQuantity = (id, quantity , stock )=> {
        const newQty = quantity + 1 ;

        if(newQty > stock) return 
        
        dispatch(addItemToCart(id, newQty))

    }

    const decreaseQuantity = (id, quantity) => {

        const newQty = quantity - 1 ;

        if(newQty <= 0) return 
        
        dispatch(addItemToCart(id, newQty))
    }
//remove from cart
    const removeFromCartHandler =(id) =>{
        dispatch(removeItemFromCart(id))
    }

    const checkoutHandler = () => {
        history.push('login?redirect=shipping')
    }

    return (
        <Fragment>
            <MetaData title={'Your Cart'} />
            {cartItems.length === 0 ? (<h2 className='mt-5 p-4' id="white-bg">Your Cart is Empty</h2>) : (
                <Fragment >

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8 mt-5" id = "white-bg">
                        <h2 className="mt-5">Your Cart: <b>{cartItems.length} items</b></h2>
                            {cartItems.map(item => (
                                <Fragment key={item.product}>
                                    <hr/>
                                    <div className="cart-item" >
                                        <div className="row">
                                            <div className="col-4 col-lg-3">
                                                <img src={item.image} alt="Laptop" height="90" width="115"/>
                                            </div>

                                            <div className="col-5 col-lg-3">
                                                <Link to={`/products/${item.product}`}>{item.name}</Link>
                                            </div>


                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p id="card_item_price">${item.price}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    <span className="btn btn-danger minus" onClick= {()=> decreaseQuantity(item.product, item.quantity)}>-</span>
                                                    <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

                                                    <span className="btn btn-primary plus" onClick= {()=> increaseQuantity(item.product, item.quantity, item.stock)} >+</span>
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick= {() =>removeFromCartHandler(item.product)} ></i>
                                            </div>

                                        </div>
                                    </div>
                                    <hr />

                                </Fragment>
                            ))}
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal:  <span className="order-summary-values">{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0 )} (Units)</span></p>
                                <p>Est. total: <span className="order-summary-values">${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0 ).toFixed(2)}</span></p>

                                <hr />
                                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>Check out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}

        </Fragment>
    )
}

export default Cart
