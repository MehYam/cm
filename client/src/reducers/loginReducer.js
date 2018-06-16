import {
   LOGIN_BEGIN,
   LOGIN_SUCCESS,
   LOGIN_ERROR,
   LOGOUT
} from '../actions/loginActions';

const initialState = {
   user: null,
   pending: false,
   error: null
};
// state.user has the format:
//
// const initialUserState = {
//    name: null,
//    isGuest: false,
//    isAdmin: false,
//    token: null
// };

export default function loginReducer(state = initialState, action) {
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
         return {
            ...initialState
         }
      default:
         return state;
   }
}