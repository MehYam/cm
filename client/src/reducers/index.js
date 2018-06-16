import { combineReducers } from 'redux';
import login from './loginReducer';

const initialState = {
   login: {
      name: null,
      isGuest: false,
      isAdmin: false
   },
   games: [],
   currentGame: {},
};

console.log(initialState);

// const rootReducer = (state = initialState, action) => {
//    switch(action.type) {
//       case 'LOGIN':
//          return {...state, login: action.loginState};
//       case 'LOGOUT':
//          return {...state, login: null};
//    }
//    return state;
// };

//export default rootReducer;

export default combineReducers({ login });