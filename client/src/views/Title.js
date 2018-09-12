import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import Login from '../auth/Login';
import Register from '../auth/Register';

import rootStore from '../stores/rootStore';

// non-ideal that we're using absolute links everywhere, but it's actually less messy than the alternative
class SignedOutLinks extends Component {
   render() {
      return (
         <div>
            <Link to='/welcome/login'>Login</Link>
            <br/>
            <Link to='/welcome/register'>Register</Link>
         </div>
      );
   }
}
class SignedInLinks extends Component {
  render() {
    return (
      <div>
        <h3>Welcome back, {rootStore.loginStore.user.name}</h3>
        <Link to='/home'>Begin</Link>
        <br/>
        <Link to='/welcome/logout'>Logout</Link>
      </div>
    );
  }
}
class Logout extends Component {
  render() {
    rootStore.loginStore.logout();

    return (
      <Redirect to='/welcome'/>
    );
  }
}
const TitleObserver = observer(class Title extends Component {
  render() {
      return (
        <div>
          <div className='titleParent'>
            <div className='title centerText'>Color Match</div>
            <div className='centerText'><i>A Steve Rockwell Game</i></div>
          </div>
          <hr/>
            <Route exact path='/welcome' component={rootStore.loginStore.loggedIn ? SignedInLinks : SignedOutLinks}/>
            <Route path='/welcome/register' 
              render={(props) => rootStore.loginStore.loggedIn ? (<Redirect to='/'/>) : (<Register/>) }/>
            <Route path='/welcome/login' 
              render={(props) => rootStore.loginStore.loggedIn ? (<Redirect to='/'/>) : (<Login/>) }/>
            <Route path='/welcome/logout' component={Logout}/>
        </div>
      );
    }
});

export default TitleObserver;