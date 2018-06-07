import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

import App from './App';
import './index.css';

import registerServiceWorker from './boilerplate/registerServiceWorker';

import {login, logout} from './actions';

const store = createStore(rootReducer);

// TEST CODE - export these for testing from the console
window.test = {store, login, logout};
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
