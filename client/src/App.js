import React from 'react';
import { Route } from 'react-router-dom';

import './index.css';
import Home from './Home';
import Title from './views/Title';
import AuthTest from './test/AuthTestMobx';

const App = () => {

   return (
      <div>
         <Route path='/' component={Title}/>
         <Route path='/home' component={Home}/>
         <Route path='/authtest' component={AuthTest}/>
      </div>
   );
};

export default App;
