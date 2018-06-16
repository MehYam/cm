import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import registerServiceWorker from './boilerplate/registerServiceWorker';
import App from './App';
import './index.css';
import rootReducer from './reducers';

import {loginBegin, logout} from './actions/loginActions';

const store = createStore(rootReducer, applyMiddleware(thunk));

///// TEST CODE - export these for testing from the console
window.test = {store, loginBegin, logout};
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
