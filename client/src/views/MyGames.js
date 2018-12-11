import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { PulseLoader } from 'react-spinners';

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

      function gamesList(games) {
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
      function renderGames(games) {
         if (games.length) {
            return gamesList(games);
         }
         //KAI: this is incorrect, it shouldn't show the loader if the user has no games
         return <PulseLoader
            sizeUnit={"px"}
            size={150}
            color={'#888888'}size={10}
            loading={true}/>;
      }
      return (
         <div>
            <div className='gamesPlaque'> <div className='gamesPlaqueLabel'>Waiting on you:</div>{renderGames(gs.games.yourTurn)} </div>
            <div className='gamesPlaque'> <div className='gamesPlaqueLabel'>Waiting on opponent:</div>{renderGames(gs.games.theirTurn)} </div>
            <div className='gamesPlaque'> <div className='gamesPlaqueLabel'>Complete:</div>{renderGames(gs.games.completed)} </div>
         </div>
      );
   }
});

class Default extends React.Component {
   render() {
      return (
         <div>
            <ExistingGamesObserver/>
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