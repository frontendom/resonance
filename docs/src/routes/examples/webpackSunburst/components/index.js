// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import Arc from './Arc';
import { makeGetSelectedData } from '../module';
import { VIEW, TRBL, DIMS } from '../module/constants';
import description from '../description.md';
import { arcTweenZoom } from './utils';

const arcKeyAccessor = (d) => d.filePath;

export class Example extends Component {
  constructor(props) {
    super(props);

    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setActiveArc = this.setActiveArc.bind(this);
  }

  state = {
    activeArc: null,
    duration: 500,
  }

  setActiveArc(activeArc) {
    this.setState({ activeArc });
  }

  setDuration(e, value) {
    this.setState({
      duration: Math.floor(value * 10000),
    });
  }

  render() {
    const { data } = this.props;
    const { duration, activeArc } = this.state;

    let tween = null;

    if (this.state.activeArc) {
      tween = arcTweenZoom(activeArc);
    }

    return (
      <Paper style={{ padding: 20 }}>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <MarkdownElement text={description} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <h5>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</h5>
                <Slider
                  defaultValue={0.1}
                  onChange={this.setDuration}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-12" style={{ padding: 0 }}>
                <h3>This example is under construction</h3>
                <Surface view={VIEW} trbl={TRBL}>
                  <g transform={`translate(${DIMS[0] / 2},${DIMS[1] / 2})`}>
                    <NodeGroup
                      data={data}
                      duration={duration}
                      clickHandler={this.setActiveArc}
                      keyAccessor={arcKeyAccessor}
                      tween={tween}
                      nodeComponent={Arc}
                    />
                  </g>
                </Surface>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

Example.propTypes = {
  data: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getSelectedData = makeGetSelectedData();
  const mapStateToProps = (state) => {
    return getSelectedData(state);
  };
  return mapStateToProps;
};


export default connect(makeMapStateToProps())(Example);