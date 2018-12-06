import React, { Component } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../stores/rootStore';

const RegisterObserver = observer(class Register extends Component {
   constructor() {
      super();

      const user = rootStore.loginStore.user;
      const uname = (user && user.name) ? user.name : '';
      this.state = {
         name: uname,
         password: '',
         passwordVerify: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }
   handleChange(event) {
      rootStore.loginStore.modifyingRegistration();

      const newState = {};
      newState[event.target.id] = event.target.value;
      this.setState(newState);
   }
   handleSubmit(event) {
      event.preventDefault();

      rootStore.loginStore.requestRegistration(this.state.name, this.state.password);
   }
   render() {
      let validationMsg = null;
      if (!this.state.name) {
         validationMsg = 'choose a name';
      }
      else if (!this.state.password) {
         validationMsg = 'enter password';
      }
      else if (this.state.password && !this.state.passwordVerify) {
         validationMsg = 'password again for verification';
      }
      else if (this.state.password !== this.state.passwordVerify) {
         validationMsg = 'passwords must match';
      }

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
               <label htmlFor='password'>Verify Password</label>
               <input
                  type='password'
                  id='passwordVerify'
                  value={this.state.passwordVerify}
                  onChange={this.handleChange}
               />
               <br/>
               <button className='bigButton' type='submit' disabled={validationMsg !== null}>Register</button>
               <div className='loginError'><i>{validationMsg}</i></div>
               <div className='loginError'>{rootStore.loginStore.registrationError}</div>
            </div>
         </form>
      );
   }
});

export default RegisterObserver;