import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { version } from './util';
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
         <nav className='sideNav lightUIPadding'>
            <div className='sideNavList'>
               <Link to='/'>Color Match</Link>
               <hr/>
               <Link to='/home/mygames'>{myGamesBadge}</Link>
               <hr/>
               <Link to='/home/friends'>{friendsBadge}</Link>
               <hr/>
               <Link to='/home/voting'>Voting</Link>
               <hr/>
               <Link to='/home/leaderboard'>Leaderboard</Link>
               <hr/>
               <Link to='/welcome/logout'>Sign Out</Link>
               <hr/>
               <div className='version'>{version}</div>
               <Link className='version' to='/home/testboard'>...tests...</Link>
            </div>
         </nav>
      );
   }
});

export default NavBarObserver;