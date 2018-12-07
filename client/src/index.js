import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { unregister } from './boilerplate/registerServiceWorker';
import App from './App';

import auth from './auth/auth';

import rootStore from './stores/rootStore';

///// TEST CODE - export these for testing from the console
function testHooks() {
   console.warn('test hooks enabled');
   window.auth = auth;
   window.rootStore = rootStore;
}
testHooks();
///// end test code

ReactDOM.render(
   <BrowserRouter>
      <App/>
   </BrowserRouter>,
   document.getElementById('root')
);

unregister();
