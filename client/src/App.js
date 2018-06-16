import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import './index.css';
import Home from './Home';
import Title from './views/Title';

import { requestLogin, requestLogout } from './actions/loginActions';

const ConnectedApp = ({ login, requestLogin, requestLogout }) => {

   const loginName = login.user ? login.user.name : '---';
   const loginToken = login.user ? login.user.token : '---';
   return (
      <div>
         <Route path='/' exact={true} component={Title}/>
         <Route path='/home' component={Home}/>
         <h3>logged in name: { loginName }</h3>
         <h3>logged in token: { loginToken }</h3>
         <button onClick={() => requestLogin('user5', 'user5')}>test login</button>
         <button onClick={() => requestLogout()}>test logout</button>
      </div>
   );
};

const mapStateToProps = state => {
   return { login: state.login };
};

const mapDispatchToProps = dispatch => {
   return {
      requestLogin: (name, password) => dispatch(requestLogin(name, password)),
      requestLogout: () => dispatch(requestLogout())
   };
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;
