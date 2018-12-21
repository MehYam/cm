import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react';

import rootStore from './stores/rootStore';

const HeaderObserver = observer(class Header extends Component {

   render() {
      const style = { 
         color: (rootStore.loginStore.liveConnected ? '#22bb22' : 'red'),
         fontSize: '24px'
      };
      return (
         <div className='menubar'>
            <span style={style}>•</span>&nbsp;
            Signed in as: <span className='menubarNameplate'>{rootStore.loginStore.user.name},</span>
            &nbsp;&nbsp;
            <Link className='signOutLink' to='/welcome/logout'>sign out</Link>
         </div>
      );
   }
});

export default HeaderObserver;