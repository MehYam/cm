import React, { Component } from 'react';
import { observer } from 'mobx-react';

import rootStore from '../stores/rootStore';

const LoginObserver = observer(class Login extends Component {
   constructor() {
      super();

      this.state = {
         name: '',
         password: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }
   handleChange(event) {
      const newState = {};
      newState[event.target.id] = event.target.value;
      this.setState(newState);
   }
   handleSubmit(event) {
      event.preventDefault();

      rootStore.loginStore.requestLogin(this.state.name, this.state.password);
   }
   render() {
      let validationMsg = null;
      if (!this.state.name) {
         validationMsg = 'enter name';
      }
      else if (!this.state.password) {
         validationMsg = 'enter password';
      }
      return (
         <form onSubmit={this.handleSubmit}>
            <div>
               <input
                  type='text'
                  id='name'
                  placeholder='player name'
                  value={this.state.name}
                  onChange={this.handleChange}
               />
               <br/>
               <input
                  type='password'
                  id='password'
                  placeholder='password'
                  value={this.state.password}
                  onChange={this.handleChange}
               />
               <br/>
               <button className='bigButton' type='submit' disabled={validationMsg !== null}>Sign In</button>
               <div className='loginError'>{rootStore.loginStore.loginError}</div>
            </div>
         </form>
      );
   }
});

export default LoginObserver;