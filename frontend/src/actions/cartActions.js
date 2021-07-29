import axios from 'axios';

import { 
    ADD_TO_CART,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL
} from '../constants/cartConstants';

export const addItemToCart =  (id, quantity) => async (dispatch, getState) => {
    const {data} = await axios.get(`/api/v1/product/${id}`)
    console.log('add to cart', data)

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}