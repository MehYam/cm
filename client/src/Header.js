import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react';

import rootStore from './stores/rootStore';

const HeaderObserver = observer(class Header extends Component {

   render() {
      const connected = {
         style: { color: 'black' },
         glyph: '✓',
         tooltip: 'live connection active'
      };
      const disconnected = {
         style: { color: 'red' },
         glyph: '⚠',
         tooltip: 'live connection off, try refreshing page'
      };
      const status = rootStore.loginStore.liveConnected ? connected: disconnected;
      return (
         <div className='menubar'>
            &nbsp;<span style={status.style} title={status.tooltip}>{status.glyph}</span>&nbsp;
            Signed in as <span className='menubarNameplate'>{rootStore.loginStore.user.displayName}.</span>
            &nbsp;<Link to='/welcome/logout'>sign out</Link>
         </div>
      );
   }
});

export default HeaderObserver;