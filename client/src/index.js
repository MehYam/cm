import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import registerServiceWorker from './boilerplate/registerServiceWorker';
import App from './App';

import auth from './auth/auth';

///// TEST CODE - export these for testing from the console
function testHooks() {
   console.warn('test hooks enabled');
   window.auth = auth;
}
testHooks();
///// end test code

ReactDOM.render(
   <BrowserRouter>
      <App/>
   </BrowserRouter>,
   document.getElementById('root')
);

registerServiceWorker();
