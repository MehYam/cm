import React from 'react';
import { Route } from 'react-router-dom';

import './index.css';
import Home from './Home';
import Title from './views/Title';
import AuthTestRedux from './test/AuthTestRedux';

const App = () => {

   return (
      <div>
         <Route path='/' exact={true} component={Title}/>
         <Route path='/home' component={Home}/>
         <Route path='/authtest' component={AuthTestRedux}/>
      </div>
   );
};

export default App;
