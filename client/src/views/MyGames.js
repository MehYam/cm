import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';
import Game from './Game';
import rootStore from '../stores/rootStore';

import { getGameUrl, getNewGameRedirect } from '../util';

const ExistingGamesObserver = observer(class ExistingGames extends React.Component {
   componentDidMount() {
      rootStore.gameStore.requestGames();
   }
   render() {
      const gs = rootStore.gameStore;
      if (gs.gameCreationState && gs.gameCreationState.result) {
         return getNewGameRedirect(gs.gameCreationState.result);
      }

      function renderGames(games) {
         let retval = [];

         for (const game of games) {
            const nthGame = retval.length + 1;
            const url = getGameUrl(game._id);
            retval.push(
               <Link to={url} key={nthGame}>
                  <button className='myGamesEntry'>
                     <GameBoard game={game} tileSize={30}/><div>{nthGame}. {game.players[0].name}, {game.players[1].name}</div>
                  </button>
               </Link>
            );
         }
         return retval;
      }
      return (
         <div>
            <div className='gamesParent gamesPlaque'><h3>Your Turn:</h3><br/> {renderGames(gs.games.yourTurn)} </div>
            <h3>Their Turn:</h3>
            <div className='gamesParent gamesPlaque'> {renderGames(gs.games.theirTurn)} </div>
            <h3>Complete:</h3>
            <div className='gamesParent gamesPlaque'> {renderGames(gs.games.completed)} </div>
         </div>
      );
   }
});

class Default extends React.Component {
   render() {
      return (
         <div>
            <ExistingGamesObserver/>
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