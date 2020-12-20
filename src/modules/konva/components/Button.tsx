import * as React from "react";
import { Icon } from "./Icon";
import { mluviiTheme } from "../../../theme";
import { Position, IconType } from "../types";
import { KonvaNodeEvents } from "react-konva";
import { Spring, animated } from "react-spring/renderprops-konva";

type Props = {
  id?: string;
  icon: IconType;
  disabled?: boolean;
  // shadowed?: boolean;
  onClick?: KonvaNodeEvents["onClick"];
} & Position;

export class Button extends React.PureComponent<Props> {
  state = {
    hovered: false,
    pressed: false
  };

  render() {
    const { pressed, hovered } = this.state;
    const { x, y, disabled, icon, onClick } = this.props;
    return (
      <Spring
        native
        config={{ duration: 150 }}
        to={{
          opacity: disabled ? 0.5 : 1,
          shadowOffsetY: pressed ? 0 : 2,
          shadowOpacity: hovered ? 0.2 : 0.1
        }}
      >
        {props => (
          <animated.Group
            y={y}
            x={x}
            name="button"
            id={this.props.id}
            opacity={props.opacity}
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onClick={!disabled && onClick}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <animated.Rect
              width={32}
              height={32}
              fill="white"
              strokeWidth={1}
              shadowBlur={2}
              shadowColor="black"
              stroke={mluviiTheme.palette.line}
              shadowOffsetY={props.shadowOffsetY}
              shadowOpacity={props.shadowOpacity}
              cornerRadius={parseInt(mluviiTheme.common.radius)}
            />
            <Icon icon={icon} x={3} y={3} />
          </animated.Group>
        )}
      </Spring>
    );
  }

  private onMouseEnter: KonvaNodeEvents["onMouseEnter"] = e => {
    if (!this.props.disabled) {
      this.setState({ hovered: true });
      e.target.getStage().container().style.cursor = "pointer";
    }
  };

  private onMouseLeave: KonvaNodeEvents["onMouseLeave"] = e => {
    this.setState({ hovered: false });
    e.target.getStage().container().style.cursor = "default";
  };

  private onMouseDown: KonvaNodeEvents["onMouseDown"] = e => {
    if (!this.props.disabled) {
      this.setState({ pressed: true });
    }
    document.addEventListener("mouseup", this.onMouseUp);
  };

  private onMouseUp: EventListener = e => {
    this.setState({ pressed: false });
    document.removeEventListener("mouseup", this.onMouseUp);
  };
}
