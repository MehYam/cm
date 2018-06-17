import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { requestLogin, requestLogout } from '../actions/loginActions';

const ConnectedAuthTestRedux = ({ login, requestLogin, requestLogout }) => {

   const loginName = login.user ? login.user.name : '---';
   const loginToken = login.user ? login.user.token : '---';
   return (
      <div>
         <Link to='/'><button>To Title</button></Link>
         <h3>logged in name: { loginName }</h3>
         <h3>logged in token: { loginToken }</h3>
         <button onClick={() => requestLogin('user5', 'user5')}>test login</button>
         <button onClick={() => requestLogout()}>test logout</button>
      </div>
   );
};

const mapStateToProps = state => {
   return { login: state.login };
};

const mapDispatchToProps = dispatch => {
   return {
      requestLogin: (name, password) => dispatch(requestLogin(name, password)),
      requestLogout: () => dispatch(requestLogout())
   };
}

const AuthTestRedux = connect(mapStateToProps, mapDispatchToProps)(ConnectedAuthTestRedux);

export default AuthTestRedux;
