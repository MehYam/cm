import axios from 'axios';
import auth from '../auth/auth'

export function requestLogin(name, password) {

   return dispatch => {

      dispatch(loginBegin());

      axios.post('/auth/login', { name, password })
      .then((res) => {
         console.log('/auth/login response', res);
         console.log('user+token', res.data.user);

         auth.user = res.data.user;

         dispatch(loginSuccess(res.data.user));
      })
      .catch((error) => {
         console.log('/auth/login error', error);

         auth.clear();

         dispatch(loginError(error.message));
      })

   };
}

export function requestLogout() {
   return dispatch => {
      auth.clear();
      dispatch(logout());
   }
}

export const LOGIN_BEGIN = 'LOGIN_BEGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

// these are not exported, as they are wrapped by the request* thunk methods above
const loginBegin = (name, password) => ({ type: LOGIN_BEGIN, payload: {name, password} });

const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: {user} });

const loginError = error => ({ type: LOGIN_ERROR, payload: {error} });

const logout = () => ({ type: LOGOUT });