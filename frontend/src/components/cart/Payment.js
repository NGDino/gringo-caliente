import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import MetaData from '../layouts/MetaData';
import CheckoutSteps from './CheckoutSteps';

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const options = {
    styles: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}


const Payment = ({ history }) => {
    const alert = useAlert();
    const stripe = useStripe();
    const elemtns = useElements();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { cartItems, shippingInfo } = useSelector(state => state.cart)

    useEffect(() => {

    })

    return (
        <Fragment>
            <MetaData title={'Payment Info'} />
            <CheckoutSteps shipping confirmOrder payment />
            <div class="row wrapper">
                <div class="col-10 col-lg-5">
                    <form class="shadow-lg">
                        <h1 class="mb-4">Card Info</h1>
                        <div class="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <CardNumberElement
                                type="text"
                                id="card_num_field"
                                class="form-control"
                                options={options}
                            />
                        </div>

                        <div class="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <CardExpiryElement
                                type="text"
                                id="card_exp_field"
                                class="form-control"
                                options={options}
                            />
                        </div>

                        <div class="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <CardCvcElement
                                type="text"
                                id="card_cvc_field"
                                class="form-control"
                                options={options}
                            />
                        </div>


                        <button
                            id="pay_btn"
                            type="submit"
                            class="btn btn-block py-3"
                        >
                            Pay
                        </button>

                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Payment
