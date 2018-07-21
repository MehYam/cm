import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import NavBar from './NavBar';

import Leaderboard from './views/Leaderboard';
import MyGames from './views/MyGames';
import Voting from './views/Voting';
import TestGameBoard from './test/TestGameBoard';

const Default = () => {
  return <div><h2>Choose an option on the left</h2><i>KAI: one should probably just be default</i></div>;
}

class Home extends Component {
  render() {
    return (
      <div className='top'>
        <Header/>
        <div className='bottom'>
          <NavBar/>
          <div className='clientArea heavyUIPadding'>
            <Switch>
              <Route path="/home" exact component={Default}/>
              <Route path="/home/leaderboard" component={Leaderboard}/>
              <Route path="/home/mygames" component={MyGames}/>
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