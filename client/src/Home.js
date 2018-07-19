import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import NavBar from './NavBar';

import Leaderboard from './views/Leaderboard';
import MyGames from './views/MyGames';
import Voting from './views/Voting';
import TestGameBoard from './views/TestGameBoard';

import './Home.css';

const Default = () => {
  return <div><h2>Choose an option on the left</h2><i>KAI: one should probably just be default</i></div>;
}

class Home extends Component {
  render() {
    return (
      <div>
         <Header/>
         <NavBar/>
         <div className="CenteredPane">
            <Switch>
              <Route path="/home" exact component={Default}/>
              <Route path="/home/leaderboard" component={Leaderboard}/>
              <Route path="/home/mygames" component={MyGames}/>
              <Route path="/home/voting" component={Voting}/>
              <Route path="/home/testboard" component={TestGameBoard}/>
            </Switch>
         </div>
      </div>
    );
  }
}

export default Home;