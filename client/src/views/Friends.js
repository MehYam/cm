import React from 'react';
import { observer } from 'mobx-react';

import rootStore from '../stores/rootStore';
import { getNewGameRedirect } from '../util';

const statusToColor = {
   offline: 'red',
   idle: 'amber',
   online: 'green'
};
const FriendsObserver = observer(class Friends extends React.Component {
   componentDidMount() {
      rootStore.friendStore.requestFriends();
   }
   createGame(friendId) {
      // ... implement the button, and the opening of the game.  createGame should return a new game id
      rootStore.gameStore.createGame(friendId);
   }
   render() {
      //KAI: this pendingGame hack has leaked into here...
      const gs = rootStore.gameStore;
      if (gs.pendingCreateGame && gs.pendingCreateGame.result) {
         return getNewGameRedirect(gs.pendingCreateGame.result);
      }

      const friends = [];
      for (const friend of rootStore.friendStore.friends) {
         const style = { color: statusToColor[friend.status] };
         friends.push(
            <div key={friends.length}>
               <h3>
                  <button className='linkButton' onClick={this.createGame.bind(this, friend._id)}>New Game</button>
                  &nbsp;
                  name: {friend.name}, status: <span style={style}>{ friend.status }</span>, lastActivity: { friend.lastActivity }
               </h3>
            </div>
         );
      }
      return (
         <div>
            <h1>Friends</h1>
            {friends}
         </div>
      );
   }
});

export default FriendsObserver;