import axios from 'axios';
import  {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants';

export const login =(email, password) => async (dispatch) => {
    try{
        dispatch({ type: LOGIN_REQUEST})
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        const {data} = await axios.post('api/v1/login', {email, password}, config)
        
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

//clear CLEAR_ERRORS
export const clearErrors = () => async (dispatch) => {
    dispatch({ 
        type: CLEAR_ERRORS
    })
}