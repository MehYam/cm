import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';

class Title extends Component {
  render() {
      return (
        <div className="CenteredPane">
          <h1>Welcome to Color Match</h1>
          <Link to='/home'><button>Begin</button></Link>
        </div>
      );
    }
}

class Home extends Component {
  render() {
    return (
      <div className="CenteredPane"><h1>Home</h1></div>
    );
  }
}

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
