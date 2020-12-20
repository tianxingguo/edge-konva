import * as React from "react";
import { Line, KonvaNodeEvents } from "react-konva";
import { mluviiTheme } from "../../../theme";
import Konva from "konva";

type Props = {
  id?: string;
  disabled?: boolean;
  shadowed?: boolean;
  selected?: boolean;
  to: [number, number];
  from: [number, number];
  onMouseDown?: KonvaNodeEvents["onMouseDown"];
  innerRef?: (instance: Konva.Line) => void;
};

export class ConnectionLine extends React.PureComponent<Props> {
  state = {
    hovered: false
  };

  private line = React.createRef<Konva.Line>();

  componentDidMount() {
    if (this.props.innerRef) {
      this.props.innerRef(this.line.current);
    }
  }

  render() {
    const { id, from, to, selected, shadowed, onMouseDown } = this.props;
    return (
      <Line
        x={0}
        y={0}
        id={id}
        bezier={true}
        ref={this.line}
        name="connection"
        hitStrokeWidth={5}
        stroke={this.color}
        onMouseDown={onMouseDown}
        opacity={shadowed ? 0.25 : 1}
        strokeWidth={selected ? 2 : 1}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        points={[...from, ...this.waypoints, ...to]}
      />
    );
  }

  private onMouseEnter: KonvaNodeEvents["onMouseEnter"] = () => {
    if (this.props.onMouseDown) {
      this.line.current.getStage().container().style.cursor = "pointer";
    }
    this.setState({ hovered: true });
  };

  private onMouseLeave: KonvaNodeEvents["onMouseLeave"] = () => {
    if (this.props.onMouseDown) {
      this.line.current.getStage().container().style.cursor = "default";
    }
    this.setState({ hovered: false });
  };

  private get color() {
    const { palette } = mluviiTheme;
    const { hovered } = this.state;
    const { disabled, selected } = this.props;
    if (disabled) {
      return palette.line;
    }
    if (selected || hovered) {
      return palette.blue;
    }
    return palette.line;
  }

  private get waypoints() {
    const { from, to } = this.props;
    return [from[0] + 80, from[1], to[0] - 80, to[1]];
  }
}
