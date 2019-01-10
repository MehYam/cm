import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { FaFacebook } from 'react-icons/fa';

import Login from '../auth/Login';
import Register from '../auth/Register';
import LinkButton from '../LinkButton';

import { version } from '../util';
import rootStore from '../stores/rootStore';

// non-ideal that we're using absolute links everywhere, but it's actually less messy than the alternative
class SignedOutLinks extends Component {
  facebookLogin() {
    window.location.href = '/auth/facebook/login';
  }
  googleLogin() {
    window.location.href = '/auth/google/login';
  }
  render() {
    return (
       <div className='centerText'>
          <button className='bigFbButton' onClick={this.facebookLogin}>
            <div className='fbButtonContent'>
              <FaFacebook size='24' className='fbIcon'/>
              <span className='fbButtonLabel'>Continue with Facebook</span>
            </div>
          </button><br/>
          <button className='bigButton' onClick={this.googleLogin}>
            <div className='fbButtonContent'>
              <img width='22' height='22' alt='google signin' src='Google__G__Logo.svg'/>
              <span className='fbButtonLabel'>Continue with Google</span>
            </div>
          </button><br/>
          <LinkButton buttonClass='bigButton' to='/welcome/login' label='Sign In'/><br/>
          <LinkButton buttonClass='bigButton' to='/welcome/register' label='Register'/>
       </div>
    );
  }
}
class SignedInLinks extends Component {
  render() {
    return (
      <div className='centerText'>
        <div>Welcome back, {rootStore.loginStore.user.displayName}!</div>
        <LinkButton buttonClass='bigButton' to='/home' label='Go To Games'/>
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
            <div className='centerText'>{version}</div>
          </div>
          <hr/>
          <div className='signInParent'>
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