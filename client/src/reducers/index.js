import { combineReducers } from 'redux';

const initialState = {
   login: null,
   games: []
};

const rootReducer = (state = initialState, action) => {
   switch(action.type) {
      case 'LOGIN':
         return {...state, login: action.loginState};
      case 'LOGOUT':
         return {...state, login: null};
   }
   return state;
};

export default rootReducer;

//export default combineReducers({});