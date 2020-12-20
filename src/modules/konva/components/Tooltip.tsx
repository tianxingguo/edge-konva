import Konva from "konva";
import * as React from "react";
import { Position } from "../types";
import { mluviiTheme } from "../../../theme";
import { Text, Rect, Line, KonvaNodeEvents } from "react-konva";
import { Transition, animated } from "react-spring/renderprops-konva";

type Props = {
  show: boolean;
  text?: string;
  onMouseEnter?: KonvaNodeEvents["onMouseEnter"];
} & Position;

export class Tooltip extends React.PureComponent<Props> {
  state = {
    width: 0,
    height: 0
  };

  private readonly padding = 16;
  private text = React.createRef<Konva.Text>();
  private group = React.createRef<Konva.Group>();

  render() {
    const { show, x, text } = this.props;
    const { width, height } = this.state;
    return (
      <Transition
        items={show}
        config={{ duration: 0 }}
        onStart={this.configure}
        enter={{ opacity: 1, y: this.props.y }}
        from={{ opacity: 0, y: this.props.y - this.padding * 2 }}
        leave={{ opacity: 0, y: this.props.y - this.padding * 2 }}
      >
        {show => {
          if (!show) return null;
          return props => (
            <animated.Group
              x={x}
              y={props.y}
              ref={this.group}
              opacity={props.opacity}
              offsetX={this.state.width / 2}
              onMouseEnter={this.props.onMouseEnter}
              offsetY={this.state.height + this.padding / 2}
            >
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={mluviiTheme.palette.dark}
                cornerRadius={parseInt(mluviiTheme.common.radius)}
              />
              <Line
                closed
                tension={0}
                offsetX={8}
                x={this.state.width / 2}
                y={this.state.height - 1}
                fill={mluviiTheme.palette.dark}
                points={[0, 0, this.padding, 0, this.padding / 2, this.padding / 2]}
              />
              <Text
                text={text}
                fontSize={13}
                ref={this.text}
                lineHeight={1.6}
                x={this.padding}
                y={this.padding / 2}
                fill={mluviiTheme.palette.white}
              />
            </animated.Group>
          );
        }}
      </Transition>
    );
  }

  private configure = () => {
    if (!this.text.current) return;
    const stage = this.text.current.getStage();
    const { width, height } = this.text.current.getClientRect({ relativeTo: stage });
    this.setState({ width: width + this.padding * 2, height: height + this.padding - 2 });
  };
}
