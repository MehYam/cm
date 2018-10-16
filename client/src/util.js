import React from 'react';
import { Redirect } from 'react-router-dom';

function getGameUrl(gameId) {
   return '/home/mygames/game=' + gameId;
}
function getNewGameRedirect(gameId) {
   // feels klunky to do this
   return <Redirect to={getGameUrl(gameId)}/>;
}

export { getGameUrl, getNewGameRedirect };