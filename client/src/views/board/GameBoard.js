import React, { Component } from 'react';
import Tile from './Tile';

import Interact from '../../Interact';

const dropzoneOptions = {
   overlap: 0.75,

   ondragenter: event => {
      console.log('GameBoard ondragenter', event);
   },
   ondragleave: event => {
      console.log('GameBoard ondragleave', event);
   },
   ondrop: event => {
      console.log('GameBoard ondrop', event);
   }
};

class GameBoardRow extends Component {
   render() {
      const tiles = [];
      for (let c = 0; c < this.props.row.length; ++c) {
         const tileId = { row: this.props.rowIndex, col: c};
         tiles.push(
            <Interact key={c} dropzoneOptions={dropzoneOptions}>
               <Tile color={this.props.row[c] || 0} id={tileId} size={this.props.tileSize}/>
            </Interact>
         );
      }
      return (
         <div className='boardrow'>
            {tiles}
         </div>
      );
   }
}

export default class GameBoard extends Component {
   renderRows() {
      const game = this.props.game;
      if (!game) {
         return null;
      }
      const rows = new Array(game.height);
      for (let r = 0; r < rows.length; ++r) {
         rows[r] = new Array(game.width);
      }

      //KAI: 
      // for (let i = 0; i < game.moves.length; ++i) {
      //    const playerIdx = i % game.players.length;
      //    const move = game.moves[i];

      //    rows[move.y][move.x] = game.players[playerIdx].palette[move.paletteIdx];
      // }

      const rowComponents= [];
      for (let r = 0; r < rows.length; ++r) {
         const row = rows[r];
         rowComponents.push(<GameBoardRow key={r} row={row} rowIndex={r} tileSize={this.props.tileSize}/>);
      }
      return rowComponents;
   }
   render() {
      return <div className='board'>{this.renderRows()}</div>;
   }
}