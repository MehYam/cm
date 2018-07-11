import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
   render() {
      return (
         <nav className="NavBar">
            <ul>
               <li><Link to='/'>X</Link></li>
               <li><Link to='/home/mygames'>My Games</Link></li>
               <li><Link to='/home/leaderboard'>Leaderboard</Link></li>
               <li><Link to='/home/voting'>Voting</Link></li>
               <li><Link to='/logout'>Logout</Link></li>
            </ul>
         </nav>
      );
   }
}

export default NavBar;