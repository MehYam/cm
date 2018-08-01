import React from 'react';
import { observer } from 'mobx-react';

import Interact from '../Interact';
import GameBoard from './board/GameBoard';
import Tile from './board/Tile';

import rootStore from '../stores/rootStore';

const draggableOptions = {
   inertia: true,
   restrict: {
      restriction: 'parent',
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
   },
   onmove: event => {
      const target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

      // translate the element
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
   }
};

class Palette extends React.Component {
   render() {
      const tiles = [];
      if (this.props.player) {
         this.props.player.palette.forEach(color => {
            tiles.push(
               <Interact draggableOptions={draggableOptions}>
                  <Tile key={color} color={color} size={this.props.tileSize}/>
               </Interact>
            );
         });
      }
      return (
         <div class='palette'>
            {tiles}
         </div>
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