import React, { Component } from 'react';
import { observer } from 'mobx-react';

import rootStore from '../stores/rootStore';

const LeaderboardObserver = observer(class Leaderboard extends Component {
   componentDidMount() {
      rootStore.leaderboardStore.requestLeaders();
   }
   render() {
      const leaders = [];
      for (let leader of rootStore.leaderboardStore.leaderboard) {
         leaders.push(<div key={leader._id}>leader with score {leader.score}</div>);
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