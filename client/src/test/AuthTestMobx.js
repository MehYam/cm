import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import rootStore from '../stores/rootStore';

const AuthTestMobx = observer(class AuthTestMobx extends Component {
   constructor() {
      super();
   }
   render() {
      const user = rootStore.loginStore.user;
      const name = user ? user.name : '---';
      const token = user ? user.token : '---'
      return (
         <div>
            <Link to='/'>To Title</Link>
            <h3>logged in name: {name}</h3>
            <h3>logged in token: {token}</h3>
            <button onClick={() => rootStore.loginStore.requestLogin('user5', 'user5')}>login</button>
            <button>logout</button>
         </div>
      );
   }
})

export default AuthTestMobx;