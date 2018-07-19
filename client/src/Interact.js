import { Component, cloneElement } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types';

import interact from 'interact.js'

class Interact extends Component {

   static defaultProps = {
      draggable: false,
      resizable: false,
      draggableOptions: {},
      resizableOptions: {}
   }

   render() {
      return cloneElement(this.props.children, {
         ref: node => this.node = node,
         draggable: false
      })
   }

   componentDidMount() {
      this.interact = interact(findDOMNode(this.node))
      this.setInteractions()
   }

   componentWillReceiveProps() {
      this.interact = interact(findDOMNode(this.node))
      this.setInteractions()
   }

   setInteractions() {
      if (this.props.draggable) this.interact.draggable(this.props.draggableOptions)
      if (this.props.resizable) this.interact.resizable(this.props.resizableOptions)
   }
}

Interact.propTypes = {
   children: PropTypes.node.isRequired,
   draggable: PropTypes.bool,
   draggableOptions: PropTypes.object,
   resizable: PropTypes.bool,
   resizableOptions: PropTypes.object
}

export default Interact;