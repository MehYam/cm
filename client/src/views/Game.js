import React from 'react';
import { observer } from 'mobx-react';

import Interact from '../Interact';
import GameBoard from './board/GameBoard';
import Tile from './board/Tile';

import rootStore from '../stores/rootStore';

//KAI: x-browser class editing from w3schools - put in a utils class
function addClass(elem, className) {
   const classes = elem.className.split(' ');
   if (classes.indexOf(className) == -1) {
      elem.className += ' ' + className;
   }
}
function removeClass(elem, className) {
   let classes = elem.className.split(' ');
   const index = classes.indexOf(className);
   if (index != -1) {
      classes.splice(index, 1)
      elem.className = classes.join(' ');
   }
}
function moveTo(elem, x, y, scale) {
      // translate the element
      const transform = `translate(${x}px, ${y}px) scale(${scale})`;
      elem.style.webkitTransform = transform;
      elem.style.transform = transform;

      // keep the dragged position in the data-x/data-y attributes
      elem.setAttribute('data-x', x);
      elem.setAttribute('data-y', y);
}
function drag(elem, dx, dy, scale) {
      const x = (parseFloat(elem.getAttribute('data-x')) || 0) + dx;
      const y = (parseFloat(elem.getAttribute('data-y')) || 0) + dy;

      moveTo(elem, x, y, scale);
}
const draggableOptions = {
   onstart: event => {
      removeClass(event.target, 'draggable');
      addClass(event.target, 'draggableInMotion');
   },
   onend: event => {
      removeClass(event.target, 'draggableInMotion');
      addClass(event.target, 'draggable');

      moveTo(event.target, 0, 0, 1);
   }, 
   onmove: event => {
      drag(event.target, event.dx, event.dy, 1.1);
   }
};

class Palette extends React.Component {
   render() {
      const tiles = [];
      if (this.props.player) {
         this.props.player.palette.forEach(color => {
            tiles.push(
               <Interact key={color} draggableOptions={draggableOptions}>
                  <Tile color={color} size={this.props.tileSize}/>
               </Interact>
            );
         });
      }
      return (
         <div className='palette'>{tiles}</div>
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