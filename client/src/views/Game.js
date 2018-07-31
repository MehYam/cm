import React, { Component } from 'react';

import rootStore from '../stores/rootStore';

class Game extends React.Component {
   componentDidMount() {
      rootStore.gameStore.requestGame(this.props.match.params.gameId);
   }
   render() {
      console.log(this.props);
      return (
         <div>
            <h2>This is game {this.props.match.params.gameId}</h2>
         </div>
      );
   }
}

export default Game;