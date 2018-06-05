import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Header from './Header';
import NavBar from './NavBar';

import './index.css';

class Home extends Component {
  render() {
    return (
      <div>
         <Header/>
         <NavBar/>
         <div className="CenteredPane"><h1>Home</h1></div>
      </div>
    );
  }
}

export default Home;