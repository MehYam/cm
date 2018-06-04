import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App from './boilerplate/App';
import AuthTest from './test/AuthTest';
import registerServiceWorker from './boilerplate/registerServiceWorker';

ReactDOM.render(<AuthTest/>, document.getElementById('root'));
registerServiceWorker();
