import {
   LOGIN_BEGIN,
   LOGIN_SUCCESS,
   LOGIN_ERROR,
   LOGOUT
} from '../actions/loginActions';

//KAI: there's got to be something better
const initialUserState = {
   name: null,
   isGuest: false,
   isAdmin: false
};
const initialState = {
   user: { ...initialUserState },
   pending: false,
   error: null
};

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
         return {
            ...state,
            loading: false,
            login: action.payload.user,
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