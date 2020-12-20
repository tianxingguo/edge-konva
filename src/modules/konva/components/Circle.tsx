import * as React from "react";
import { mluviiTheme } from "../../../theme";
import { KonvaNodeEvents } from "react-konva";
import { Spring, animated } from "react-spring/renderprops-konva";

type Props = {
  expanded?: boolean;
  selected?: boolean;
  parentWidth: number;
  parentHeight: number;
  side: "left" | "right";
  onMouseDown?: KonvaNodeEvents["onMouseDown"];
  onMouseEnter?: KonvaNodeEvents["onMouseEnter"];
  onMouseLeave?: KonvaNodeEvents["onMouseLeave"];
};

export class Circle extends React.PureComponent<Props> {
  private readonly radius = 9;

  state = {
    hovered: false
  };

  render() {
    const { side, parentWidth, parentHeight, selected } = this.props;
    return (
      <Spring
        native
        to={{
          y: parentHeight / 2,
          x: side === "left" ? 0 : parentWidth,
          opacity: this.props.expanded ? 0 : 1
        }}
      >
        {props => (
          <animated.Circle
            y={props.y}
            x={props.x}
            fill="white"
            radius={this.radius}
            opacity={props.opacity}
            stroke={this.strokeColor}
            strokeWidth={selected ? 2 : 1}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onMouseDown={this.props.onMouseDown}
          />
        )}
      </Spring>
    );
  }

  private onMouseEnter: KonvaNodeEvents["onMouseEnter"] = e => {
    this.setState({ hovered: true });
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
  };

  private onMouseLeave: KonvaNodeEvents["onMouseLeave"] = e => {
    this.setState({ hovered: false });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  };

  private get strokeColor() {
    if (this.props.selected) {
      return mluviiTheme.palette.blue;
    }
    if (this.state.hovered) {
      return mluviiTheme.palette.lightBlue;
    }
    return mluviiTheme.palette.line;
  }
}
