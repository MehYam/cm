import React, { Component } from 'react';

import Interact from '../Interact';
import './TestGameBoard.css';

class Tile extends Component {
   render() {
      return <h3>Tile</h3>;
   }
}

const draggableOptions = {
     onmove: event => {
        const target = event.target
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
}

class TestGameBoard extends Component {
   render() {
      return (
         <Interact draggable draggableOptions={draggableOptions}>
            <h3>TestGameBoard</h3>
         </Interact>
      );
   }
}


export default TestGameBoard;