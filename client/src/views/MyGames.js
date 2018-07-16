import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import rootStore from '../stores/rootStore';

class Default extends React.Component {
   startGame() {
      rootStore.gameStore.createGame();
   }
   getGames() {
      rootStore.gameStore.getGames();
   }
   render() {
      return (
         <div>
            <button onClick={this.startGame}>Start New Game</button>
            <h2>Existing games:</h2>
            <button onClick={this.getGames}>Get My Games</button><br/>
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
            <h1>MyGames</h1>
            <Switch>
               <Route path='/home/mygames' exact component={Default}/>
               <Route path='/home/mygames/game' component={Game}/>
            </Switch>
         </div>
      );
   }
}

export default MyGames;