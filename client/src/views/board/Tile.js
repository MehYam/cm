import React, { Component } from 'react';

export default class Tile extends Component {
   render() {
      //KAI: belongs in a utils file, not here
      const color = this.props.color || 0xffffff;
      const colorHexPad = '000000';
      const colorHex = (colorHexPad + color.toString(16)).slice(-colorHexPad.length);

      const visibility = (this.props.visible === undefined || this.props.visible) ? 'visible' : 'hidden';
      const style = {
         backgroundColor: '#' + colorHex,
         width: this.props.size,
         height: this.props.size,
         visibility
      };

      return <div id={this.props.id} className='tile draggable' style={style}></div>;
   }
}