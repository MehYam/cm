import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import registerServiceWorker from './boilerplate/registerServiceWorker';
import App from './App';
import rootReducer from './reducers';

import {loginBegin, logout} from './actions/loginActions';

import auth from './auth/auth';

const store = createStore(rootReducer, applyMiddleware(thunk));

///// TEST CODE - export these for testing from the console
function testHooks() {
   console.warn('test hooks enabled');
   window.test = {store, loginBegin, logout};
   window.auth = auth;
}
testHooks();
///// end test code

ReactDOM.render(
   <Provider store={store}>
      <BrowserRouter>
         <App/>
      </BrowserRouter>
   </Provider>, 
   document.getElementById('root')
);

registerServiceWorker();
