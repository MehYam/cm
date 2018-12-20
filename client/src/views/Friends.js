import React from 'react';
import { observer } from 'mobx-react';
import { MdPerson } from 'react-icons/md';

import rootStore from '../stores/rootStore';
import { getNewGameRedirect } from '../util';

const statusToColor = {
   offline: 'red',
   idle: 'amber',
   online: '#22bb22'
};
const FriendsObserver = observer(class Friends extends React.Component {
   componentDidMount() {
      rootStore.friendStore.requestFriends();
   }
   createGame(friendId) {
      // ... implement the button, and the opening of the game.  createGame should return a new game id
      rootStore.gameStore.createGame(friendId);
   }
   createRandomGame() {
      rootStore.gameStore.createGame();
   }
   render() {
      //KAI: this pendingGame hack has leaked into here...
      const gs = rootStore.gameStore;
      if (gs.gameCreationState && gs.gameCreationState.result) {
         return getNewGameRedirect(gs.gameCreationState.result);
      }

      const friends = [];
      for (const friend of rootStore.friendStore.friends) {
         const style = { color: statusToColor[friend.status] };
         friends.push(
            <div key={friends.length}>
               <MdPerson/>
               <b>{friend.name}, <span style={style}>{ friend.status }</span></b>
               <button className='smallButton' onClick={this.createGame.bind(this, friend._id)}>start new game</button>
            </div>
         );
      }
      return (
         <div>
            <button className='bigButton' onClick={this.createRandomGame}>Start Random Game</button><br/>
            {friends}
         </div>
      );
   }
});

export default FriendsObserver;