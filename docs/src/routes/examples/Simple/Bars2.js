// @flow weak
/* eslint react/no-multi-comp: 'off', max-len: "off" */

import React, { PureComponent } from 'react';
import NodeGroup from 'resonance/NodeGroup';
import Surface from 'docs/src/components/Surface';
import { scaleBand } from 'd3-scale';
import { shuffle } from 'd3-array';
import { easeExpInOut } from 'd3-ease';

// **************************************************
//  SVG Layout
// **************************************************
const view = [1000, 250];        // [width, height]
const trbl = [10, 100, 10, 100]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

// **************************************************
//  Mock Data
// **************************************************
const mockData = [
  {
    name: 'Linktype',
    value: 45,
  }, {
    name: 'Quaxo',
    value: 53,
  }, {
    name: 'Skynoodle',
    value: 86,
  }, {
    name: 'Realmix',
    value: 36,
  }, {
    name: 'Jetpulse',
    value: 54,
  }, {
    name: 'Chatterbridge',
    value: 91,
  }, {
    name: 'Riffpedia',
    value: 67,
  }, {
    name: 'Layo',
    value: 12,
  }, {
    name: 'Oyoba',
    value: 69,
  }, {
    name: 'Ntags',
    value: 17,
  }, {
    name: 'Brightbean',
    value: 73,
  }, {
    name: 'Blogspan',
    value: 25,
  }, {
    name: 'Twitterlist',
    value: 73,
  }, {
    name: 'Rhycero',
    value: 67,
  }, {
    name: 'Trunyx',
    value: 52,
  }, {
    name: 'Browsecat',
    value: 90,
  }, {
    name: 'Skinder',
    value: 88,
  }, {
    name: 'Tagpad',
    value: 83,
  }, {
    name: 'Gabcube',
    value: 6,
  }, {
    name: 'Jabberstorm',
    value: 19,
  },
];

// **************************************************
//  Example
// **************************************************
class Example extends PureComponent {

  state = {
    data: shuffle(mockData).slice(0, Math.floor(Math.random() * ((mockData.length + 2) - (5 + 1))) + 5),
  }

  update = () => {
    this.setState({
      data: shuffle(mockData).slice(0, Math.floor(Math.random() * ((mockData.length + 2) - (5 + 1))) + 5),
    });
  }

  render() {
    const scale = scaleBand()
      .rangeRound([0, dims[0]])
      .domain(this.state.data.map((d) => d.name))
      .padding(0.1);

    return (
      <div>
        <button onClick={this.update}>
          Update
        </button>
        <span style={{ margin: 5 }}>
          Bar Count: {this.state.data.length}
        </span>
        <Surface view={view} trbl={trbl}>
          <NodeGroup
            data={this.state.data}
            keyAccessor={(d) => d.name}

            start={() => ({
              opacity: 1e-6,
              x: 1e-6,
              fill: 'green',
              width: scale.bandwidth(),
            })}

            enter={(data, index) => ({
              opacity: [0.5],
              x: [scale(data.name)],
              timing: { duration: 200 * index, delay: 1000 },
            })}

            update={(data) => ({
              opacity: [0.5],
              x: [scale(data.name)],
              fill: 'blue',
              width: [scale.bandwidth()],
              timing: { duration: 1000, ease: easeExpInOut },
            })}

            leave={() => ({
              opacity: [1e-6],
              x: [scale.range()[1]],
              fill: 'red',
              timing: { duration: 2000 },
            })}
          >
            {(nodes) => {
              return (
                <g>
                  {nodes.map(({ key, data, state }) => {
                    const { x, opacity, ...rest } = state;

                    return (
                      <g key={key} opacity={opacity} transform={`translate(${x},0)`}>
                        <rect
                          height={dims[1]}
                          {...rest}
                        />
                        <text
                          x="0"
                          y="20"
                          fill="white"
                          transform="rotate(90 5,20)"
                        >{`x: ${Math.round(x)}`}</text>
                        <text
                          x="0"
                          y="5"
                          fill="white"
                          transform="rotate(90 5,20)"
                        >{`name: ${data.name}`}</text>
                      </g>
                    );
                  })}
                </g>
              );
            }}
          </NodeGroup>
        </Surface>
      </div>
    );
  }
}

export default Example;
