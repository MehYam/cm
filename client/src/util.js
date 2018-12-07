import React from 'react';
import { Redirect } from 'react-router-dom';

function getGameUrl(gameId) {
   return '/home/mygames/game=' + gameId;
}
function getNewGameRedirect(gameId) {
   // feels klunky to do this
   return <Redirect to={getGameUrl(gameId)}/>;
}
function prettifyJsonDateTime(isoString) {
   const date = new Date(Date.parse(isoString));
   return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
}
const version = 'v0.1.0';

export { getGameUrl, getNewGameRedirect, prettifyJsonDateTime, version };