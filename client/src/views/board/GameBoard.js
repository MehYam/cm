import React, { Component } from 'react';
import Tile from './Tile';

import Interact from '../../Interact';

class GameBoardRow extends Component {
   render() {
      const tiles = [];
      for (let c = 0; c < this.props.row.length; ++c) {

         const local = this.props.localGameState;
         var color = this.props.row[c] || 0;
         if (local && local.hovering && local.hovering.row === this.props.rowIndex && local.hovering.col === c) {
            color = local.localDragging.color;
         }

         const tileId = this.props.rowIndex + '_' + c;
         tiles.push(
            <Interact key={c} dropzoneOptions={this.props.dropzoneOptions}>
               <Tile key={c} color={color} id={tileId} size={this.props.tileSize}/>
            </Interact>
         );
      }
      return <div className='boardrow'>{tiles}</div>;
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

      for (let i = 0; i < game.moves.length; ++i) {
         const playerIdx = i % game.players.length;
         const move = game.moves[i];

         rows[move.y][move.x] = game.players[playerIdx].palette[move.paletteIdx];
      }

      const pending = this.props.pendingMove;
      if (pending) {
         const coords = pending.hoverCoords || pending.dropCoords;
         if (coords) {
            rows[coords.row][coords.col] = pending.color;
         }
      }

      const rowComponents= [];
      for (let r = 0; r < rows.length; ++r) {
         const row = rows[r];
         rowComponents.push(<GameBoardRow dropzoneOptions={this.props.dropzoneOptions} key={r} row={row} rowIndex={r} tileSize={this.props.tileSize}/>);
      }
      return rowComponents;
   }
   render() {
      return <span className='board'>{this.renderRows()}</span>;
   }
}