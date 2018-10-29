import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import rootStore from './stores/rootStore';

const NavBarObserver = observer(class NavBar extends Component {
   componentDidMount() {
      rootStore.friendStore.requestFriends();
      rootStore.gameStore.requestGames();
   }
   render() {
      let myGamesBadge = 'My Games';
      const readyGames = rootStore.gameStore.games.yourTurn.length;
      if (readyGames) {
         myGamesBadge += ' (' + readyGames + ')';
      }

      const onlineFriends = rootStore.friendStore.friends.reduce((total, friend) => total + Number(friend.status === 'online'), 0);
      let friendsBadge = 'Players (' + onlineFriends + ')';
      return (
         <nav className="sideNav lightUIPadding">
            <ul>
               <li><Link to='/'>Color Match</Link></li>
               <li><Link to='/home/mygames'>{myGamesBadge}</Link></li>
               <li><Link to='/home/friends'>{friendsBadge}</Link></li>
               <li><Link to='/home/voting'>Voting</Link></li>
               <li><Link to='/home/leaderboard'>Leaderboard</Link></li>
               <li><Link to='/welcome/logout'>Sign Out</Link></li>
               <hr/>
               <li><Link to='/home/testboard'>...test...</Link></li>
            </ul>
         </nav>
      );
   }
});

export default NavBarObserver;