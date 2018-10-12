import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import rootStore from './stores/rootStore';

const NavBarObserver = observer(class NavBar extends Component {
   componentDidMount() {
      rootStore.badgeStore.requestBadges();
   }
   render() {
      let myGamesBadge = 'My Games';
      if (rootStore.badgeStore.badges.readyGames) {
         myGamesBadge += '(' + rootStore.badgeStore.badges.readyGames + ')';
      }

      const onlineFriends = rootStore.friendStore.friends.reduce((total, friend) => total + Number(friend.status == 'online'), 0);
      let friendsBadge = 'Friends (' + onlineFriends + ')';
      return (
         <nav className="sideNav lightUIPadding">
            <ul>
               <li><Link to='/'>Color Match</Link></li>
               <li><Link to='/home/mygames'>{myGamesBadge}</Link></li>
               <li><Link to='/home/friends'>{friendsBadge}</Link></li>
               <li><Link to='/home/voting'>Voting</Link></li>
               <li><Link to='/home/leaderboard'>Leaderboard</Link></li>
               <li><Link to='/welcome/logout'>Logout</Link></li>
               <hr/>
               <li><Link to='/home/testboard'>Test Board</Link></li>
            </ul>
         </nav>
      );
   }
});

export default NavBarObserver;