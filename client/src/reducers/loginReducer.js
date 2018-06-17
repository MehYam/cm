import auth from '../auth/auth';
import {
   LOGIN_BEGIN,
   LOGIN_SUCCESS,
   LOGIN_ERROR,
   LOGOUT
} from '../actions/loginActions';

// state.user has the format:
//
// const initialUserState = {
//    name: null,
//    isGuest: false,
//    isAdmin: false,
//    token: null
// };

function getInitialState() {
   const savedUser = auth.user;
   const login = savedUser ? savedUser : 
   {
      name: null,
      isGuest: false,
      isAdmin: false,
      token: null
   };

   return {
      user: login,
      pending: false,
      error: null
   };
}

export default function loginReducer(state = null, action) {

   if (!state) {
      state = getInitialState();
   }

   //KAI: look up the look up technique to eliminate these switch statements
   switch(action.type) {
      case LOGIN_BEGIN:
         return {
            ...state,
            loading: true,
            error: null
         };
      case LOGIN_SUCCESS:
         console.log('LOGIN_SUCCESS user', action.payload.user);
         return {
            ...state,
            loading: false,
            user: action.payload.user,
            error: null
         };
      case LOGIN_ERROR:
         return {
            ...state,
            loading: false,
            error: action.payload.error
         };
      case LOGOUT:
         return getInitialState();
      default:
         return state;
   }
}