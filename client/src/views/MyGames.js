import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';
import Game from './Game';
import rootStore from '../stores/rootStore';

const ExistingGamesObserver = observer(class ExistingGames extends React.Component {
   refreshGames() {
      rootStore.gameStore.requestGames();
   }
   componentDidMount() {
      this.refreshGames();
   }
   render() {
      const games = [];
      for (const game of rootStore.gameStore.games) {
         const nthGame = games.length + 1;
         const url = '/home/mygames/game=' + game._id;
         games.push(
            <div key={nthGame}>
               <Link to={url}><GameBoard game={game} tileSize={5}/>game {nthGame}, players {game.players[0].name}, {game.players[1].name}</Link>
            </div>);
      }
      return (
         <div>
            <h2>Existing games:</h2>
            {games}
            <button onClick={this.refreshGames}>Refresh Games</button><br/>
         </div>
      );
   }
});

class Default extends React.Component {
   startGame() {
      rootStore.gameStore.createGame();
      rootStore.gameStore.requestGames();
   }
   render() {
      return (
         <div>
            <ExistingGamesObserver/>
            <hr/>
            <button onClick={this.startGame}>Start New Game</button><br/>
            <i>KAI: need to mark games where it's your turn</i><br/>
            <i>KAI: need option to abandon games</i>
         </div>
      );
   }
}
class MyGames extends Component {
   render() {
      return (
         <div>
            <Switch>
               <Route path='/home/mygames' exact component={Default}/>
               <Route path='/home/mygames/game=:gameId' component={Game}/>
            </Switch>
         </div>
      );
   }
}

export default MyGames;