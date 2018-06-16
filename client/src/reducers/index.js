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

export default combineReducers({ login });