import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';
import rootStore from '../stores/rootStore';
import { prettifyJsonDateTime } from '../util';

const LeaderboardObserver = observer(class Leaderboard extends Component {
   componentDidMount() {
      rootStore.leaderboardStore.requestLeaders();
   }
   render() {
      const leaders = [];
      let rank = 1;
      for (let game of rootStore.leaderboardStore.leaderboard) {
         leaders.push(
            <div key={game._id} className='leaderboardEntry gamesPlaque'>
               <div className='leaderboardRank'>{rank++}.</div>
               <GameBoard game={game} tileSize={50}/>
               <div className='leaderboardEntryInfo'>
                  <div>Score: <span className='leaderboardEntryField'>{ (game.score * 100).toFixed(2) + ' (' + game.votes + ' / ' + game.ballots + ' votes)' }</span></div>
                  <div>Players: <span className='leaderboardEntryField'>{game.players[0].name}, {game.players[1].name}</span></div>
                  <div>Created: <span className='leaderboardEntryField'>{prettifyJsonDateTime(game.created)}</span></div>
                  <div>Completed: <span className='leaderboardEntryField'>{prettifyJsonDateTime(game.completed)}</span></div>
               </div>
            </div>);
      }
      return (
         <div>
            <h2>Current Leaders</h2>
            <div className='leaderboardParent'>
               {leaders}
            </div>
         </div>
      );
   }
});

export default LeaderboardObserver;