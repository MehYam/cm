import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LinkButton extends Component {
   render() {
      return (
         <Link to={this.props.to}>
            <button className={this.props.buttonClass} >
               {this.props.label}
            </button>
         </Link>);
   }
}

export default LinkButton;