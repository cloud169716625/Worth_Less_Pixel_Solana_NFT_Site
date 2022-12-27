import * as React from "react";
const _ = require("lodash");

export default class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.minValue = 1;
    this.maxValue = 100;
    this.mounted = false;
    this.state = {
      data: [],
    };

    this.radiusScale = this.radiusScale.bind(this);
    this.simulatePositions = this.simulatePositions.bind(this);
    this.renderBubbles = this.renderBubbles.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    if (this.props.data?.length > 0) {
      this.minValue =
        0.95 *
        this.props.zoomRatio *
        this.props.zoomRatio *
        window.d3.min(this.props.data, (item) => {
          return item.v;
        });

      this.maxValue =
        1.05 *
        this.props.zoomRatio *
        this.props.zoomRatio *
        window.d3.max(this.props.data, (item) => {
          return item.v;
        });

      this.setNodeData(this.props.data);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  radiusScale = (value, min, max) => {
    const fx = window.d3
      .scaleSqrt()
      .range([min, max])
      .domain([this.minValue, this.maxValue]);

    return fx(value);
  };

  setNodeData = (data) => {
    if (this.mounted) {
      this.setState({ data });
    }
  };

  simulatePositions = (data) => {
    const diff = this.props.isTablet ? 2 : 20;
    console.log(diff);
    this.simulation = window.d3
      .forceSimulation()
      .nodes(data)
      .velocityDecay(0.3)
      .force("x", window.d3.forceX().strength(0.05))
      .force("y", window.d3.forceY().strength(0.25))
      .force(
        "collide",
        window.d3.forceCollide((d) => {
          return (
            this.radiusScale(d.v, 40, 70) +
            diff * (this.props.zoomRatio * this.props.zoomRatio)
          );
        })
      )
      .on("tick", () => {});
  };

  renderBubbles = (data) => {
    this.simulatePositions(data);
    let maxPrice = this.props.tokenList[0]["price"];
    for (let i = 1; i < this.props.tokenList.length; i++)
      if (maxPrice < this.props.tokenList[i]["price"])
        maxPrice = this.props.tokenList[i]["price"];

    // render simple circle element
    const radius = this.props.isTablet ? 50 : 300;

    if (!this.props.useLabels) {
      const circles = _.map(data, (item, index) => {
        let ratio =
          (this.props.zoomRatio *
            this.props.zoomRatio *
            this.props.tokenList[index]["price"]) /
          maxPrice;
        return (
          <circle
            key={index}
            r={this.radiusScale(radius * ratio, 40, 60)}
            cx={item.x}
            cy={item.y}
            fill={"url(#flameGradient)"}
          />
        );
      });

      return (
        <g
          transform={`translate(${this.props.width / 2}, ${
            this.props.height / 3
          })`}
        >
          {circles}
        </g>
      );
    }

    // render circle and text elements inside a group
    const texts = _.map(data, (item, index) => {
      const props = this.props;
      let ratio =
        (props.zoomRatio * props.zoomRatio * props.tokenList[index]["price"]) /
        maxPrice;
      const fontSize = this.radiusScale(ratio * 0.2, 25, 30);
      const fontSize1 = this.radiusScale(ratio * 0.2, 15, 20);
      const imageSize = this.radiusScale(ratio * 0.2 * 70, 40, 50);
      const diff = -imageSize / 2;
      const dy = diff - 10;

      return (
        <g
          key={index}
          transform={`translate(${props.width / 2 + item.x}, ${
            props.height / 3 + item.y
          })`}
          style={{ cursor: "pointer" }}
          onClick={() => {}}
        >
          <circle
            r={this.radiusScale(radius * ratio, 40, 60)}
            fill={"url(#flameGradient)"}
          />
          <text
            dy={dy}
            fill="#fff"
            textAnchor="middle"
            fontSize={`${fontSize1}px`}
            fontWeight="bold"
          >
            {props.tokenList[index]["title"]}
          </text>
          <image
            x={diff}
            y={diff}
            width={imageSize}
            height={imageSize}
            // display="none"
            href={props.tokenList[index]["img"]}
          />
          <text
            dy={-dy + 15}
            fill="#fff"
            textAnchor="middle"
            fontSize={`${fontSize}px`}
            fontWeight="bold"
          >
            {props.tokenList[index]["price"]}◎
          </text>
        </g>
      );
    });

    return texts;
  };

  render() {
    if (this.state.data.length) {
      return (
        <svg width={this.props.width} height={this.props.height}>
          <radialGradient
            spreadMethod="reflect"
            id="flameGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
            fr="10%"
          >
            <stop offset="0%" stopColor="#04400940" />
            <stop offset="70%" stopColor="#04400940" />
            <stop offset="100%" stopColor="#05e618" />
          </radialGradient>
          {this.renderBubbles(this.state.data)}
        </svg>
      );
    }

    return <div>Loading</div>;
  }
}
