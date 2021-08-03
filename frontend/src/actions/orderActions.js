import axios from 'axios';

import { 
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    CLEAR_ERRORS
} from '../constants/orderConstants';

export const createOrder = (order) => async (dispatch, getState) => {
    try {

        console.log('from action', order)

        dispatch({ type: CREATE_ORDER_REQUEST })

        const config = {
            headers:{
                'content-type' : 'application/json'
            }
        }
        const {data} = await axios.post('/api/v1/order/new', order, config)

        dispatch({ 
            type: CREATE_ORDER_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.message
        })
    }

  
}

export const myOrders = (id) => async (dispatch) => {
    try {

        dispatch({ type: MY_ORDERS_REQUEST});

        const {data} = await axios.get('/api/v1/order/me')

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.orders
        })

    }catch(error){
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.respons.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({ 
        type: CLEAR_ERRORS
    })
}

