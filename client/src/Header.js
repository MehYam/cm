import React, { Component } from 'react';
import { observer } from 'mobx-react';

import rootStore from './stores/rootStore';

const HeaderObserver = observer(class Header extends Component {
   render() {
      return (<div className='menubar'>Signed in as: <span className='menubarNameplate'>{rootStore.loginStore.user.name}</span></div>);
   }
});

export default HeaderObserver;