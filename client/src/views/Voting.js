import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';

import rootStore from '../stores/rootStore';

class Candidate extends Component {
   vote() {

   }
   render() {
      return (
         <button class='voteButton'>
            <GameBoard game={this.props.game} tileSize={60}/>
         </button>
      );
   }
}

const VotingObserver = observer(class Voting extends Component {
   test() {
      rootStore.ballotStore.requestBallot();
   }
   vote() {

   }
   render() {
      const ballot = rootStore.ballotStore.ballot;
      const renderedBallots = [];
      ballot.forEach(game => {
         renderedBallots.push(<Candidate key={renderedBallots.length} game={game}/>);
      });
      return (
         <div>
            <h1>Voting</h1>
            <button onClick={this.test}>Refresh Ballot</button>
            <div class='boardParent'>
               {renderedBallots}
            </div>
         </div>
      );
   }
});

export default VotingObserver;