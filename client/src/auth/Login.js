import React, { Component } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../stores/rootStore';

const Login = observer(class Login extends Component {
   constructor() {
      super();

      const uname = rootStore.loginStore.user ? rootStore.loginStore.user.name : 'user5';
      this.state = {
         name: uname,
         password: uname  //KAI: bad and obviously wrong but we're still testing
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
      return (
         <form onSubmit={this.handleSubmit}>
            <div>
               <label htmlFor='name'>Name</label>
               <input
                  type='text'
                  id='name'
                  value={this.state.name}
                  onChange={this.handleChange}
               />
               <br/>
               <label htmlFor='password'>Password</label>
               <input
                  type='password'
                  id='password'
                  value={this.state.password}
                  onChange={this.handleChange}
               />
               <button type='submit'>Login</button>
            </div>
         </form>
      );
   }
});

export default Login;