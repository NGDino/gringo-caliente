import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//states from package
import {UsaStates} from 'usa-states';

import { saveShippingInfo } from '../../actions/cartActions';

import MetaData from '../layouts/MetaData';
import CheckoutSteps from './CheckoutSteps';
 

const Shipping = ({history}) => {

    // var usStates = new UsaStates();

    const usStates = new UsaStates();

    const states = usStates.states

    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [usState, setUsState] = useState(shippingInfo.usState)
    const [zipCode, setZipCode] = useState(shippingInfo.zipCode)
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber)

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('states', usState)
        console.log(city, address, zipCode, phoneNumber)
        dispatch(saveShippingInfo({address, city, phoneNumber, zipCode, usState} ))

        history.push('/order/confirm')

    }

    return (
        <Fragment>
            <MetaData title={'Shipping Info'}/>
            <CheckoutSteps shipping/>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value= {address}
                                required
                                onChange= {(e) => setAddress(e.target.value) }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                required
                                onChange= {(e) => setCity(e.target.value) }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">State</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={usState}
                                required
                                onChange= {(e) => setUsState(e.target.value) }
                            >
                                {states.map(st => (
                                    <option key = {st.abbreviation} value={st.abbreviation}>
                                        {st.abbreviation}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNumber}
                                required
                                onChange= {(e) => setPhoneNumber(e.target.value) }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={zipCode}
                                required
                                onChange= {(e) => setZipCode(e.target.value) }
                            />
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Shipping;
