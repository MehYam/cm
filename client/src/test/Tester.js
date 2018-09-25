import React from 'react';
import auth from '../auth/auth';
import axios from 'axios';

class Tester extends React.Component {
   test() {
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/test',
            data: {}
      })
      .then((res) => {
         console.log('test:', res);
      })
      .catch((error) => {
         console.log('test error', error);
      })
   }
   render() {
      return (<button onClick={this.test}>Test</button>);
   }
}

export default Tester