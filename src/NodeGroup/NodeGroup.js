// @flow weak
/* eslint max-len: "off" */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import Node from '../Node';

export default class NodeGroup extends PureComponent {
  static propTypes = {
    /**
     * An array of data objects.  The data prop is treated as immutable so the nodes will only update if prev.data !== next.data.
     */
    data: PropTypes.array.isRequired,
    /**
     * A function that returns the starting state.  The function is passed the data and index.
     */
    start: PropTypes.func.isRequired,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on enter.  The function is passed the data and index.
     */
    enter: PropTypes.func,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the data and index.
     */
    update: PropTypes.func,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on leave.  The function is passed the data, index and remove function to be called when you want to remove the node.
     */
    leave: PropTypes.func,
    /**
     * Function that is used to render the current state of each node.  Passed the data, state, index, and type (ENTER, UPDATE or LEAVE).
     */
    render: PropTypes.func.isRequired,
    /**
     * The wrapper component for the nodes. Can be a custom component or 'div', 'span', etc.
     */
    component: PropTypes.any,
    /**
     * String class name for the wrapper component.
     */
    className: PropTypes.string,
    /**
     * Function that returns a string key given a data object.  Used to track which nodes are entering, updating and leaving.
     */
    keyAccessor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    enter: () => {},
    update: () => {},
    leave: () => {},
    component: 'g',
    className: 'node-group',
  };

  state = dataUpdate(this.props.data, {}, this.props.keyAccessor);

  componentWillReceiveProps(next) {
    if (this.props.data !== next.data) {
      this.setState((prevState) => {
        return dataUpdate(next.data, prevState, next.keyAccessor);
      });
    }
  }

  removeKey = (udid) => {
    this.setState((prevState, props) => {
      const index0 = prevState.nodes
        .findIndex((d) => props.keyAccessor(d) === udid);

      const index1 = props.data
        .findIndex((d) => props.keyAccessor(d) === udid);

      if (index0 >= 0 && index1 === -1) {
        const udids = Object.assign({}, prevState.udids);
        delete udids[udid];

        return {
          udids,
          nodes: [
            ...prevState.nodes.slice(0, index0),
            ...prevState.nodes.slice(index0 + 1),
          ],
        };
      }

      return prevState;
    });
  }

  lazyRemoveKey = (udid) => {
    this.setState((prevState) => ({
      removed: Object.assign({}, prevState.removed, { [udid]: true }),
    }));
  }

  render() {
    const { props: {
      data,
      start,
      enter,
      update,
      leave,
      render,
      component,
      className,
      keyAccessor,
    }, state } = this;

    return React.createElement(
      component,
      { className },
      state.nodes.map((node, index) => {
        const udid = keyAccessor(node);
        const type = state.udids[udid];

        return (
          <Node
            key={udid}

            data={data}

            udid={udid}
            type={type}
            node={node}
            index={index}

            start={start}

            enter={enter}
            update={update}
            leave={leave}

            render={render}

            removeKey={this.removeKey}
            lazyRemoveKey={this.lazyRemoveKey}
          />
        );
      }),
    );
  }
}
