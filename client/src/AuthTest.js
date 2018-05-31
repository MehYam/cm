import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import axios from 'axios';

const AuthExample = () => (
  <Router>
    <div>
      <AuthButton />
      <ul>
        <li>
          <Link to="/public">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>
      <Route path="/public" component={Public} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/protected" component={Protected} />
    </div>
  </Router>
);

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };

  register() {
    axios.post('/auth/register', {
      name: 'test2',
      password: 'test2'
    })
    .then((res) => {
      console.log('/auth/register response', res);
    })
    .catch((error) => {
      console.log('/auth/register error', error);
    })
  }
  login() {
    axios.post('/auth/login', {
      name: 'test2',
      password: 'test2'
    })
    .then((res) => {
      console.log('/auth/login response', res);
    })
    .catch((error) => {
      console.log('/auth/login error', error);
    })
    //KAI: this would redirect
    // fakeAuth.authenticate(() => {
    //   this.setState({ redirectToReferrer: true });
    // });
  };
  logout() {
    axios.get('/auth/logout')
    .then((res) => {
      console.log('/auth/logout response', res);
    })
    .catch((error) => {
      console.log('/auth/logout error', error);
    })
  }
  accessStuff() {
    axios.get('/api')
    .then((res) => {
      console.log('/api response', res);
    })
    .catch((error) => {
      console.log('/api error', error);
    })
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.register}>Register</button>
        <button onClick={this.login}>Log in</button>
        <button onClick={this.accessStuff}>Access Stuff</button>
        <button onClick={this.logout}>Log out</button>
      </div>
    );
  }
}

export default AuthExample;