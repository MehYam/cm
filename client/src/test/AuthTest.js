import React from "react";
import auth from '../auth/auth';
import axios from 'axios';

class AuthTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {name: 'user5', password: 'user5'};
  }
  register = (event) => {
    console.log('registering', this.state);
    axios.post('/auth/register', this.state)
    .then((res) => {
      console.log('/auth/register response', res);
    })
    .catch((error) => {
      console.log('/auth/register error', error);
    })
  }
  login = (event) => {
    axios.post('/auth/login', this.state)
    .then((res) => {
      console.log('/auth/login response', res);
      console.log('user+token', res.data.user);

      auth.token = res.data.user.token;
      console.log('logged in:', auth.loggedIn);
    })
    .catch((error) => {
      console.log('/auth/login error', error);
    })
  };
  logout = (event) => {
    auth.logout();
    console.log('logged in:', auth.loggedIn);
    // axios.get('/auth/logout')
    // .then((res) => {
    //   console.log('/auth/logout response', res);
    // })
    // .catch((error) => {
    //   console.log('/auth/logout error', error);
    // })
  }
  accessStuff = (event) => {
    axios(
      {
        method: 'GET',
        headers: { 'Authorization': auth.token },
        url: '/api/someCall',
        data: this.state
      })
    .then((res) => {
      console.log('/api response', res);
    })
    .catch((error) => {
      console.log('/api error', error);
    })
  }
  handleNameChange = (e) => {
    this.setState({ name: e.target.value, password: this.state.password});
  }
  handlePasswordChange = (e) => {
    this.setState({ name: this.state.name, password: e.target.value });
  }
  render() {

    return (
      <div>
        <input type='text' placeholder='name' value={this.state.name} onChange={this.handleNameChange}/>
        <input type='password' value={this.state.password} onChange={this.handlePasswordChange}/>
        <button onClick={this.register}>Register</button>
        <button onClick={this.login}>Log in</button>
        <br/>
        <button onClick={this.logout}>Log out</button>
        <button onClick={this.accessStuff}>Access Stuff</button>
        <p>Open the developer console to see log output</p>
      </div>
    );
  }
}

export default AuthTest;