import axios from 'axios';
import  {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants';

export const login =(email, password) => async (dispatch) => {
    try{
        dispatch({ type: LOGIN_REQUEST})
        const config = {
            headers: {
                'content-type': 'application/json',
            }
        }

        const {data} = await axios.post('api/vi/login', {email, password}, config)
        
        dispatch({ 
            type: LOGIN_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}