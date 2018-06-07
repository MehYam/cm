import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import './index.css';
import Home from './Home';
import Title from './views/Title';

const ConnectedApp = ({ login }) => {
   return (
      <div>
         <Route path='/' exact={true} component={Title}/>
         <Route path='/home' component={Home}/>
         <h3>logged in status: {login ? login.name : 'none'}</h3>
      </div>
   );
};

const mapStateToProps = state => {
   return { login: state.login };
};

const App = connect(mapStateToProps)(ConnectedApp);

export default App;
