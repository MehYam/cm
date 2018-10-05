import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';

import rootStore from '../stores/rootStore';

class Candidate extends Component {
   constructor() {
      super();
      this.vote = this.vote.bind(this);
   }
   vote() {
      rootStore.ballotStore.vote(this.props.index);
   }
   render() {
      return (
         <button className='voteButton' onClick={this.vote}>
            <GameBoard game={this.props.game} tileSize={60}/>
         </button>
      );
   }
}

const VotingObserver = observer(class Voting extends Component {
   componentDidMount() {
      rootStore.ballotStore.requestBallot();
   }
   render() {
      const ballot = rootStore.ballotStore.ballot;
      const renderedBallots = [];
      ballot.forEach(game => {
         renderedBallots.push(<Candidate key={renderedBallots.length} index={renderedBallots.length} game={game}/>);
      });
      return (
         <div>
            <h1>Voting</h1>
            <div>{renderedBallots}</div>
         </div>
      );
   }
});

export default VotingObserver;