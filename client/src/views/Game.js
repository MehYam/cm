import React, { Component } from 'react';

const Game = ({ match }) => {
   return (
      <div>
         <h2>This is game {match.params.gameId}</h2>
      </div>
   );
}

export default Game;