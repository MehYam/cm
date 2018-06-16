import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import './index.css';
import Home from './Home';
import Title from './views/Title';

import { requestLogin } from './actions/loginActions';

const ConnectedApp = ({ login, requestLogin }) => {

   return (
      <div>
         <Route path='/' exact={true} component={Title}/>
         <Route path='/home' component={Home}/>
         <h3>logged in status: {login ? login.name : 'none'}</h3>
         <button onClick={() => requestLogin('user5', 'user5')}>test login</button>
      </div>
   );
};

const mapStateToProps = state => {
   return { login: state.login };
};

const mapDispatchToProps = dispatch => {
   return {
      requestLogin: (name, password) => dispatch(requestLogin(name, password))
   };
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;
