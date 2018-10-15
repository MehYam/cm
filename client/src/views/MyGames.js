import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';
import Game from './Game';
import rootStore from '../stores/rootStore';

const ExistingGamesObserver = observer(class ExistingGames extends React.Component {
   componentDidMount() {
      rootStore.gameStore.requestGames();
   }
   startGame() {
      rootStore.gameStore.createGame();
   }
   render() {
      const pendingGames = rootStore.gameStore.games.filter(game => game.moves.length < (game.width * game.height));
      const completeGames = rootStore.gameStore.games.filter(game => game.moves.length === (game.width * game.height));

      function renderGames(games) {
         let retval = [];

         for (const game of games) {
            const nthGame = retval.length + 1;
            const url = '/home/mygames/game=' + game._id;
            retval.push(
               <Link to={url} key={nthGame}>
                  <button className='myGamesEntry'>
                     <GameBoard game={game} tileSize={30}/><div>{nthGame}. {game.players[0].name} - {game.players[1].name}</div>
                  </button>
               </Link>
            );
         }
         return retval;
      }
      return (
         <div>
            <button className='linkButton' onClick={this.startGame}>Start New Random Game</button><br/>
            <h2>In Progress:</h2>
            <div className='gamesParent'> {renderGames(pendingGames)} </div>
            <h2>Complete:</h2>
            <div className='gamesParent'> {renderGames(completeGames)} </div>
         </div>
      );
   }
});

class Default extends React.Component {
   render() {
      return (
         <div>
            <ExistingGamesObserver/>
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