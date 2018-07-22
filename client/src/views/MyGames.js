import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

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
      rootStore.gameStore.games.forEach((game) => {
         const key = games.length + 1;
         games.push(<div key={key}>game {games.length + 1}, players {game.players[0].name}, {game.players[1].name}</div>);
      });
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
const Game = () => {
   return (
      <div>
         <h2>This is a game</h2>
      </div>
   );
}
class MyGames extends Component {
   render() {
      return (
         <div>
            <Switch>
               <Route path='/home/mygames' exact component={Default}/>
               <Route path='/home/mygames/game' component={Game}/>
            </Switch>
         </div>
      );
   }
}

export default MyGames;