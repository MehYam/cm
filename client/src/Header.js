import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react';

import rootStore from './stores/rootStore';

const HeaderObserver = observer(class Header extends Component {

   render() {
      const connected = {
         style: { color: 'black' },
         glyph: '✓',
         tooltip: 'connected live'
      };
      const disconnected = {
         style: { color: 'red' },
         glyph: '⚠',
         tooltip: 'live connection off, try refreshing page'
      };
      const status = rootStore.loginStore.liveConnected ? connected: disconnected;
      let thumbnail = rootStore.loginStore.user.photoUrl ?
         (<img className='thumbnailSmall' alt='profile' src={rootStore.loginStore.user.photoUrl}/>) : null;

      return (
         <div className='menubar'>
            {thumbnail}<span className='menubarNameplate'>{rootStore.loginStore.user.displayName}</span>
            &nbsp;<span style={status.style} title={status.tooltip}>{status.glyph}</span>&nbsp;
            &nbsp;<Link to='/welcome/logout'>sign out</Link>
         </div>
      );
   }
});

export default HeaderObserver;