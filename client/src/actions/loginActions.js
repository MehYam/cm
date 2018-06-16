import axios from 'axios';
import auth from '../auth/auth'

export function requestLogin(name, password) {

   return dispatch => {

      dispatch(loginBegin());

      axios.post('/auth/login', { name, password })
      .then((res) => {
         console.log('/auth/login response', res);
         console.log('user+token', res.data.user);

         auth.token = res.data.user.token;  //KAI: duplication.  Should this all be in the store?
         console.log('logged in:', auth.loggedIn);

         dispatch(loginSuccess(res.data.user));
      })
      .catch((error) => {
         console.log('/auth/login error', error);

         dispatch(loginError(error.message));
      })

   };
}

export function requestLogout() {
   return dispatch => {
      auth.logout();
      dispatch(logout());
   }
}

export const LOGIN_BEGIN = 'LOGIN_BEGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export const loginBegin = (name, password) => ({ type: LOGIN_BEGIN, payload: {name, password} });

export const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: {user} });

export const loginError = error => ({ type: LOGIN_ERROR, payload: {error} });

export const logout = () => ({ type: LOGOUT });