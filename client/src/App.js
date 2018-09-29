import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import Home from './Home';
import Title from './views/Title';

// import AuthTest from './test/AuthTestMobx';
import AuthTest from './test/AuthTest';

import rootStore from './stores/rootStore';

class App extends Component {
   componentDidMount() {
      rootStore.loginStore.testCredentials();
   }
   render() {
      return (
         <div className='vertFill'>
            <Switch>
               <Route path='/welcome' component={Title}/>
               <Route path='/home' component={Home}/>
               <Route path='/authtest' component={AuthTest}/>
               <Redirect from='/' to='/welcome'/>
            </Switch>
         </div>
      );
   }
};

export default App;
