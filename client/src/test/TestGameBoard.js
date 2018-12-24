import React, { Component } from 'react';

import Interact from '../Interact';

import GameBoard from '../views/board/GameBoard';

import { colorMatchAPI } from '../util';

import './TestGameBoard.css';

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
   x_restrict: {
      restriction: 'parent',
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
   },
   onstart: event => {
      event.target.className = 'resize-drag dragging';
   },
   onmove: event => {
      drag(event.target, event.dx, event.dy, 1.1);
   },
   onend: event => {
      event.target.className = 'resize-drag notdragging';
      moveTo(event.target, 0, 0, 1);
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
const dropzoneOptions = {
   overlap: 0.75,

   ondragenter: event => {
      console.log('ondragenter', event);
   },
   ondragleave: event => {
      console.log('ondragleave', event);
   },
   ondrop: event => {
      console.log('ondrop', event);
   }
};
class TestGameBoard extends Component {
   callApi() {
      console.log('callApi');
      colorMatchAPI('');
   }
   callApiTest() {
      console.log('callApiTest');
      colorMatchAPI('testlevel1/testlevel2');
   }
   render() {
      const dummyGame = {
         height: 3,
         width: 3,
         moves: []
      }
      return (
         <div>
            <button onClick={this.callApi}>call /api</button>
            <button onClick={this.callApiTest}>call /api/test</button>
            <h3>Tile/Gameboard test</h3>
            <GameBoard game={dummyGame} tileSize={142}/>
            <h3>Draggable/resizable test</h3>
            <div className='resize-container'>
               <Interact draggableOptions={draggableOptions} resizableOptions={resizableOptions}>
                  <div className='resize-drag notdragging'>FOO</div>
               </Interact>
               <Interact dropzoneOptions={dropzoneOptions}>
                  <div className='dropzone'/>
               </Interact>
            </div>
            <h3>Dropzone</h3>
         </div>
      );
   }
}

export default TestGameBoard;