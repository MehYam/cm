import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Login from '../auth/Login';
import Register from '../auth/Register';

class Links extends Component {
   render() {
      return (
         <div>
            <Link to='login'>Login</Link>
            <br/>
            <Link to='register'>Register</Link>
         </div>
      );
   }
}
class Title extends Component {
  render() {
      return (
        <div className="CenteredPane">
          <h1>Welcome to Color Match</h1>
          <hr/>
            <Route exact path='/' component={Links}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
        </div>
      );
    }
}

export default Title;