import React from 'react';
import { observer } from 'mobx-react';

import rootStore from '../stores/rootStore';

const FriendsObserver = observer(class Friends extends React.Component {
   componentDidMount() {
      rootStore.friendStore.requestFriends();
   }
   render() {
      const friends = [];
      for (const friend of rootStore.friendStore.friends) {
         friends.push(
            <div key={friends.length}>
               <h3>name: {friend.name}, status: { friend.status }, lastActivity: { friend.lastActivity }</h3>
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