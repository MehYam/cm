import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import auth from './auth/auth';

const version = 'v0.01.01';

function colorMatchAPI(call, parameters) {
   const method = parameters ? 'POST' : 'GET';
   return axios({
      method,
      headers: { Authorization: auth.user.token },
      url: '/api/' + call,
      data: parameters
   });
}
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

export { version, colorMatchAPI, getGameUrl, getNewGameRedirect, prettifyJsonDateTime };