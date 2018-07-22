import React, { Component } from 'react';

import Interact from '../Interact';

import GameBoard from '../views/board/GameBoard';

import './TestGameBoard.css';

const draggableOptions = {
   restrict: {
      restriction: 'parent',
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
const resizableOptions = {
   edges: { left: true, right: true, bottom: true, top: true }, 
   restrictEdges: { outer: 'parent', endOnly: true },
   restrictSize: { min: {width: 50, height: 50}, max: {width: 300, height: 300}},
   inertia: true,
   onresizemove: event => {
      var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      y = (parseFloat(target.getAttribute('data-y')) || 0);

      // update the element's style
      target.style.width  = event.rect.width + 'px';
      target.style.height = event.rect.height + 'px';

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.webkitTransform = target.style.transform =
         'translate(' + x + 'px,' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
      target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);      
   }
};

class TestGameBoard extends Component {
   render() {
      const dummyGame = {
         height: 3,
         width: 3
      }
      return (
         <div>
            <h3>Tile/Gameboard test</h3>
            <GameBoard game={dummyGame} tileSize={142}/>
            <h3>Draggable/resizable test</h3>
            <div className='resize-container'>
               <Interact resizable draggable draggableOptions={draggableOptions} resizableOptions={resizableOptions}>
                  <div className='resize-drag'>FOO</div>
               </Interact>
            </div>
         </div>
      );
   }
}

export default TestGameBoard;