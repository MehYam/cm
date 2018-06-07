import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './index.css';
import Home from './Home';
import Title from './views/Title';

class App extends Component {
  render() {
    return (
      <div>
        <Route path='/' exact={true} component={Title}/>
        <Route path='/home' component={Home}/>
      </div>
    );
  }
}

export default App;
