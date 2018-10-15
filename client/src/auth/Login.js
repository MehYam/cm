import React, { Component } from 'react';
import rootStore from '../stores/rootStore';

class Login extends Component {
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
               <br/>
               <button className='linkButton' type='submit'>Login</button>
            </div>
         </form>
      );
   }
};

export default Login;