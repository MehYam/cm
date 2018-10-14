import React from 'react';
import { observer } from 'mobx-react';

import Interact from '../Interact';
import GameBoard from './board/GameBoard';
import Tile from './board/Tile';

import rootStore from '../stores/rootStore';

//KAI: x-browser class editing from w3schools - put in a utils class
function addClass(elem, className) {
   const classes = elem.className.split(' ');
   if (classes.indexOf(className) === -1) {
      elem.className += ' ' + className;
   }
}
function removeClass(elem, className) {
   let classes = elem.className.split(' ');
   const index = classes.indexOf(className);
   if (index !== -1) {
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

      const store = rootStore.gameStore;
      const you = store.currentGame.yourPlayer;
      const paletteIndex = parseInt(event.target.id, 10);
      store.pendingMove = {
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
   return indexes.length === 2 
      ? { row: parseInt(indexes[0], 10), col: parseInt(indexes[1], 10)}
      : null;
}
const dropzoneOptions = {
   ondragenter: event => {
      const coords = parseCoords(event.target.id);
      const store = rootStore.gameStore;
      if (!store.currentGame.rows[coords.row][coords.col]) {
         store.pendingMove = {
            paletteIndex: store.pendingMove.paletteIndex,
            color: store.pendingMove.color,
            hoverCoords: coords
         };
      }
   },
   ondragleave: event => {
      const store = rootStore.gameStore;
      store.pendingMove = {
         paletteIndex: store.pendingMove.paletteIndex,
         color: store.pendingMove.color,
         hoverCoords: null
      };
   },
   ondrop: event => {
      const coords = parseCoords(event.target.id);
      const store = rootStore.gameStore;
      if (store.currentGame.rows[coords.row][coords.col]) {
         store.pendingMove = null;
      }
      else {
         store.pendingMove = {
            paletteIndex: store.pendingMove.paletteIndex,
            color: store.pendingMove.color,
            dropCoords: coords
         };
      }
   }
};

class Palette extends React.Component {
   render() {
      const tiles = [];

      this.props.palette.forEach(paletteSlot => {

         const visible = !paletteSlot.used && this.props.hideOne !== tiles.length;
         const tile = this.props.enabled 
            ? (<Interact key={paletteSlot.color} draggableOptions={draggableOptions}>
                  <Tile id={tiles.length} color={paletteSlot.color} visible={visible} size={this.props.tileSize}/>
               </Interact>)
            : (<Tile key={paletteSlot.color} id={tiles.length} color={paletteSlot.color} visible={visible} size={this.props.tileSize}/>)

         tiles.push(tile);
      });
      return (
         <div className='palette'>{tiles}</div>
      );
   }  
}

class AcceptUndo extends React.Component {
   accept() { rootStore.gameStore.acceptPendingMove(); }
   undo() { rootStore.gameStore.undoPendingMove(); }
   render() {
      return (
         <div>
            <button onClick={this.accept}>Accept</button>
            <button onClick={this.undo}>Undo</button>
            Accept this move?
         </div>
      );
   }
}

const GameObserver = observer(class Game extends React.Component {
   componentDidMount() {
      rootStore.gameStore.requestGame(this.props.match.params.gameId);
   }
   acceptUndo() {
      const store = rootStore.gameStore;
      return store.pendingMove && store.pendingMove.dropCoords
         ? <AcceptUndo/>
         : null;
   }
   render() {
      const store = rootStore.gameStore;
      const game = store.currentGame;

      const players = [];
      if (game && game.players) {
         game.players.forEach(player => {
            players.push(<h5 key={player.user}>player {players.length + 1}: {player.name}</h5>);
         });
      }

      const pendingDrop = store.pendingMove && store.pendingMove.dropCoords;
      const palette = game ? game.yourPlayer.availablePalette : [];
      var hideDroppedTile = -1;  //KLUDGE
      if (pendingDrop) {
         hideDroppedTile = store.pendingMove.paletteIndex;
      }

      //KAI: WHAT'S WRONG WITH THIS EQUALITY!  IT WORKS IN THE CONSOLE!
      //const yourTurn = game && game.currentPlayer == game.yourPlayer;
      const yourTurn = game && game.currentPlayer._id === game.yourPlayer._id;
      const paletteEnabled = game && !game.completed && yourTurn && !pendingDrop;

      var statusMessage;
      if (game) {
         if (game.completed) {
            statusMessage = 'Game finished at ' + game.completed;
         }
         else if (yourTurn) {
            statusMessage = 'Your turn';
         }
         else {
            statusMessage = `Waiting for ${game.currentPlayer.name}'s turn`;
         }
      }
      return (
         <div>
            <h1 className='centerText'>{statusMessage}</h1>
            <GameBoard game={game} pendingMove={store.pendingMove} dropzoneOptions={dropzoneOptions} tileSize={150}/>
            { this.acceptUndo() }
            <Palette enabled={paletteEnabled} palette={palette} hideOne={hideDroppedTile} tileSize={70}/>
         </div>
      );
   }
});

export default GameObserver;