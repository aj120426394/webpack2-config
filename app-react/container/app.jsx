import React, { Component } from 'react';
import { connect } from 'react-redux';
// import TEMPLATE_COMPONENT from '../components/TEMPLATE';


// import { normal_action, action_with_middleware } from '../redux/actions/action.template'

/**
 * This is the template of a react component that connec with redux.
 *
 * Plugins:
 * classname: This plugin is helping to join different class when you use the css module.
 */

class TEMPLATE extends Component {
  render() {
    return (
      <div>
        <h4>fucafasdfk </h4>
      </div>
    );
  }
}

TEMPLATE.propTypes = {};
TEMPLATE.defaultProps = {};

/**
 * The normal action will be dispatch the return derectly.
 * The middleAction will not be dispatch until the user call dispatch in the function.
 */
export default connect(
  (state, ownProps) => ({

  }), {

  }
)(TEMPLATE);
