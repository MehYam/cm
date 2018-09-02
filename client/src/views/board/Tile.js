import React, { Component } from 'react';

export default class Tile extends Component {
   render() {
      //KAI: belongs in a utils file, not here
      const color = this.props.color || 0xffffff;
      const colorHexPad = '000000';
      const colorHex = (colorHexPad + color.toString(16)).slice(-colorHexPad.length);

      const styleF = {
         backgroundColor: '#' + colorHex,
         width: this.props.size,
         height: this.props.size
      };

      var txtId;
      if (this.props.id) {
         txtId = this.props.id.row + '_' + this.props.id.col;
      }
      return <div id={txtId} className='tile draggable' style={styleF}></div>;
   }
}