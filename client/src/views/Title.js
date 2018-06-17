import React, { Component } from 'react';
import Login from '../auth/Login';

class Title extends Component {
  render() {
      return (
        <div className="CenteredPane">
          <h1>Welcome to Color Match</h1>
          <hr/>
          <Login/>
        </div>
      );
    }
}

export default Title;