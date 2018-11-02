import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

import Login from '../auth/Login';
import Register from '../auth/Register';
import LinkButton from '../LinkButton';

import rootStore from '../stores/rootStore';

// non-ideal that we're using absolute links everywhere, but it's actually less messy than the alternative
class SignedOutLinks extends Component {
   render() {
      return (
         <div className='centerText'>
            <LinkButton buttonClass='bigButton' to='/welcome/login' label='Sign In'/>
            <br/>
            <LinkButton buttonClass='bigButton' to='/welcome/register' label='Register'/>
         </div>
      );
   }
}
class SignedInLinks extends Component {
  render() {
    return (
      <div className='centerText'>
        <h3>Welcome back, {rootStore.loginStore.user.name}</h3>
        <LinkButton buttonClass='bigButton' to='/home' label='Begin'/>
        <br/>
        <LinkButton buttonClass='bigButton' to='/welcome/logout' label='Sign Out'/>
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
            <div className='title centerText'>Color Match Game (BETA)</div>
            <div className='centerText'><i>A Game of Aesthetic Strategy from Steve Rockwell</i></div>
            <div className='centerText'>v0.0.1</div>
          </div>
          <hr/>
          <div className='vertCenterParent'>
            <Route exact path='/welcome' component={rootStore.loginStore.loggedIn ? SignedInLinks : SignedOutLinks}/>
            <Route path='/welcome/register' 
              render={(props) => rootStore.loginStore.loggedIn ? (<Redirect to='/'/>) : (<Register/>) }/>
            <Route path='/welcome/login' 
              render={(props) => rootStore.loginStore.loggedIn ? (<Redirect to='/'/>) : (<Login/>) }/>
            <Route path='/welcome/logout' component={Logout}/>
          </div>
        </div>
      );
    }
});

export default TitleObserver;