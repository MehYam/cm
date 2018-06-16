import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Title extends Component {
  render() {
      return (
        <div className="CenteredPane">
          <h1>Welcome to Color Match</h1>
          <Link to='/home/mygames'><button>My Games</button></Link>
          <hr/>
        </div>
      );
    }
}

export default Title;