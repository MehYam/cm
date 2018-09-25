import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';
import rootStore from '../stores/rootStore';

const LeaderboardObserver = observer(class Leaderboard extends Component {
   componentDidMount() {
      rootStore.leaderboardStore.requestLeaders();
   }
   render() {
      const leaders = [];
      for (let game of rootStore.leaderboardStore.leaderboard) {
         leaders.push(
            <div key={game._id}>
               <GameBoard game={game} tileSize={15}/>
               Score: { (game.score * 100).toFixed(2) + ' (' + game.votes + ' / ' + game.ballots + ')' }
            </div>);
      }
      return (
         <div>
            <h1>Leaderboard</h1>
            {leaders}
         </div>
      );
   }
});

export default LeaderboardObserver;