import React, { Component } from 'react';
import Tile from './Tile';

class GameBoardRow extends Component {
   render() {
      const tiles = [];
      for (let c = 0; c < this.props.row.length; ++c) {
         const tileId = { row: this.props.rowIndex, col: c};
         tiles.push(<Tile key={c} color={this.props.row[c] || 0} id={tileId} size={this.props.tileSize}/>);
      }
      return (
         <div>
            {tiles}
            <div className='clear'/>
         </div>
      );
   }
}

export default class GameBoard extends Component {
   renderRows() {
      const game = this.props.game;
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
      return <div>{this.renderRows()}</div>;
   }
}