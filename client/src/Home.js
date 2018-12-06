import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Header from './Header';
import NavBar from './NavBar';

import Leaderboard from './views/Leaderboard';
import MyGames from './views/MyGames';
import Voting from './views/Voting';
import Friends from './views/Friends';

import TestGameBoard from './test/TestGameBoard';

const Default = () => {
  return <Redirect to='/home/mygames'/>;
}

class Home extends Component {
  render() {
    return (
      <div className='parent'>
        <Header/>
        <div className='bottom'>
          <NavBar/>
          <div className='clientArea heavyUIPadding'>
            <Switch>
              <Route path="/home" exact component={Default}/>
              <Route path="/home/leaderboard" component={Leaderboard}/>
              <Route path="/home/mygames" component={MyGames}/>
              <Route path="/home/friends" component={Friends}/>
              <Route path="/home/voting" component={Voting}/>
              <Route path="/home/testboard" component={TestGameBoard}/>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;