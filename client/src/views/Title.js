import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Title extends Component {
  render() {
      return (
        <div className="CenteredPane">
          <h1>Welcome to Color Match</h1>
          <Link to='/home/mygames'><button>My Games</button></Link>
          <hr/>
          <a href="/">Been here before, login</a><br/>
          <a href="/">Login as Guest</a><br/>
          <a href="/">Register</a>
        </div>
      );
    }
}

export default Title;