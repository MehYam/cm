import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import Login from '../auth/Login';
import Register from '../auth/Register';

import rootStore from '../stores/rootStore';

class SignedOutLinks extends Component {
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
class SignedInLinks extends Component {
  render() {
    return (
      <div>
        <h3>Welcome back, {rootStore.loginStore.user.name}</h3>
        <Link to='home'>Begin</Link>
        <br/>
        <Link to='logout'>Logout</Link>
      </div>
    );
  }
}
class Logout extends Component {
  render() {
    rootStore.loginStore.logout();

    return (
      <Redirect to='/'/>
    );
  }
}
const TitleObserver = observer(class Title extends Component {
  render() {
      return (
        <div className="CenteredPane">
          <h1>Welcome to Color Match</h1>
          <hr/>
            <Route exact path='/' component={rootStore.loginStore.loggedIn ? SignedInLinks : SignedOutLinks}/>
            <Route path='/register' 
              render={(props) => rootStore.loginStore.loggedIn ? (<Redirect to='/'/>) : (<Register/>) }/>
            <Route path='/login' 
              render={(props) => rootStore.loginStore.loggedIn ? (<Redirect to='/'/>) : (<Login/>) }/>
            <Route path='/logout' component={Logout}/>
        </div>
      );
    }
});

export default TitleObserver;