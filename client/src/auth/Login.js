import React, { Component } from 'react';

import { requestLogin } from '../stores/loginStore';

class Login extends Component {
   constructor() {
      super();

      this.state = {
         name: 'user5',
         password: 'user5'
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

      this.props.requestLogin(this.state.name, this.state.password);
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
}

export default Login;