import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameBoard from './board/GameBoard';
import Tile from './board/Tile';

import rootStore from '../stores/rootStore';

class Palette extends React.Component {
   render() {
      const tiles = [];
      if (this.props.player) {
         this.props.player.palette.forEach(color => {
            tiles.push(<Tile key={color} color={color} size={this.props.tileSize}/>)
         });
      }
      return (
         <div class='boardrow'>{tiles}</div>
      );
   }  
}

const GameObserver = observer(class Game extends React.Component {
   componentDidMount() {
      rootStore.gameStore.requestGame(this.props.match.params.gameId);
   }
   render() {

      const game = rootStore.gameStore.currentGame;
      const you = game && game.players.find(player => player.you);
      return (
         <div>
            <h2>This is game {this.props.match.params.gameId}</h2>
            <GameBoard game={game} tileSize={142}/>
            <hr/>
            <Palette player={you} tileSize={70}/>
         </div>
      );
   }
});

export default GameObserver;