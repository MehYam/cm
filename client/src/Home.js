import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import NavBar from './NavBar';

import Leaderboard from './views/Leaderboard';
import MyGames from './views/MyGames';
import Voting from './views/Voting';

import './index.css';

class Home extends Component {
  render() {
    return (
      <div>
         <Header/>
         <NavBar/>
         <div className="CenteredPane">
            <h1>Home</h1>
            <Switch>
               <Route path="/home/leaderboard" component={Leaderboard}/>
               <Route path="/home/mygames" component={MyGames}/>
               <Route path="/home/voting" component={Voting}/>
            </Switch>
         </div>
      </div>
    );
  }
}

export default Home;