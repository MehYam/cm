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

      console.log('dragging', event.target.id);

      const you = rootStore.gameStore.you;
      const paletteIndex = parseInt(event.target.id);
      rootStore.gameStore.pendingMove = {
         paletteIndex,
         color: you.palette[paletteIndex]
      }
   },
   onend: event => {
      removeClass(event.target, 'draggableInMotion');
      addClass(event.target, 'draggable');

      moveTo(event.target, 0, 0, 1);
   }, 
   onmove: event => {
      drag(event.target, event.dx, event.dy, 1.5);
   }
};
function parseCoords(elementId)
{
   const indexes = elementId.split('_');
   return indexes.length == 2 
      ? { row: parseInt(indexes[0]), col: parseInt(indexes[1])}
      : null;
}
const dropzoneOptions = {
   ondragenter: event => {
      const coords = parseCoords(event.target.id);
      console.log('GameBoard ondragenter', event, coords);

      const store = rootStore.gameStore;
      store.pendingMove = {
         paletteIndex: store.pendingMove.paletteIndex,
         color: store.pendingMove.color,
         hoverCoords: coords
      };
   },
   ondragleave: event => {
      const coords = parseCoords(event.target.id);
      console.log('GameBoard ondragleave', event, coords);

      const store = rootStore.gameStore;
      store.pendingMove = {
         paletteIndex: store.pendingMove.paletteIndex,
         color: store.pendingMove.color,
         hoverCoords: null
      };
   },
   ondrop: event => {
      const coords = parseCoords(event.target.id);
      console.log('GameBoard ondrop tile', coords);

      const store = rootStore.gameStore;
      store.pendingMove = {
         paletteIndex: store.pendingMove.paletteIndex,
         color: store.pendingMove.color,
         dropCoords: coords
      };

      store.applyPendingMove();
   }
};

class Palette extends React.Component {
   render() {
      const tiles = [];
      if (this.props.player) {
         let idx = 0;

         const draggable = this.props.enabled ? draggableOptions : null;
         this.props.player.palette.forEach(color => {

            const visible = !this.props.moves.find(move => move.paletteIdx == idx);

            console.log('visible', visible);
            tiles.push(
               <Interact key={color} draggableOptions={draggable}>
                  <Tile id={idx++} color={color} visible={visible} size={this.props.tileSize}/>
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
      const store = rootStore.gameStore;
      const game = store.currentGame;
      const you = store.you;

      const players = [];
      if (game && game.players) {
         game.players.forEach(player => {
            players.push(<h3 key={player.user}>player {players.length + 1}: {player.user}</h3>);
         });
      }

      const yourTurn = store.currentPlayer && store.currentPlayer.you;
      console.warn('moves', store.yourMoves.length);
      return (
         <div>
            <h2>Game ID: {this.props.match.params.gameId}</h2>
            {players}
            <h3>{yourTurn ? 'waiting for your move' : 'waiting for other player'}</h3>
            <GameBoard game={game} pendingMove={store.pendingMove} dropzoneOptions={dropzoneOptions} tileSize={142}/>
            <hr/>
            <Palette enabled={yourTurn} player={you} moves={store.yourMoves} tileSize={70}/>
         </div>
      );
   }
});

export default GameObserver;