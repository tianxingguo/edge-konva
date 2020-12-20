import Konva from "konva";
import * as React from "react";
import { mluviiTheme } from "../../../theme";
import { NodeConfig } from "konva/types/Node";
import { Position, IconType } from "../types";
import { Text, Group, KonvaNodeEvents } from "react-konva";
import { Spring, animated, config } from "react-spring/renderprops-konva";

const icons: { [key in IconType]: string } = {
  eye: "",
  undo: "",
  plus: "",
  users: "",
  phone: "",
  random: "",
  archive: "",
  envelope: "",
  "eye-slash": "",
  "pencil-square-o": ""
};

type Props = {
  id?: string;
  icon: IconType;
  color?: string;
  tooltip?: string;
  onClick?: () => void;
  onMouseEnter?: KonvaNodeEvents["onMouseEnter"];
  onMouseLeave?: KonvaNodeEvents["onMouseEnter"];
} & Position;

export class Icon extends React.PureComponent<Props> {
  state = {
    active: false,
    hovered: false
  };

  private readonly size = 26;
  private group = React.createRef<Konva.Group>();

  render() {
    const { active, hovered } = this.state;
    const { id, icon, onClick, x, y, color } = this.props;

    return (
      <Group
        x={x}
        y={y}
        id={id}
        name="icon"
        ref={this.group}
        onMouseUp={this.onMouseUp}
        onClick={this.props.onClick}
        onMouseDown={this.onMouseDown}
        draggable={!!this.props.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        dragBoundFunc={this.dragBoundFunc}
        onDragEnd={e => (e.cancelBubble = true)}
        onDragStart={e => (e.cancelBubble = true)}
      >
        <Spring
          native
          to={{
            scaleX: !onClick ? 0 : hovered ? 1 : 0,
            scaleY: !onClick ? 0 : hovered ? 1 : 0
          }}
          config={{ ...config.molasses, duration: 200 }}
        >
          {({ scaleX, scaleY }) => (
            <animated.Circle
              fill="black"
              scaleX={scaleX}
              scaleY={scaleY}
              x={this.size / 2}
              y={this.size / 2}
              radius={this.size / 2}
              opacity={active ? 0.2 : 0.1}
            />
          )}
        </Spring>
        <Text
          x={0}
          y={icon === "envelope" || icon === "eye-slash" ? -1 : 0}
          lineHeight={2}
          align="center"
          width={this.size}
          text={icons[icon]}
          height={this.size}
          fontSize={this.size / 2}
          fontFamily="FontAwesome"
          fill={color || mluviiTheme.palette.text}
        />
      </Group>
    );
  }

  private dragBoundFunc: NodeConfig["dragBoundFunc"] = () => ({
    x: this.group.current.getAbsolutePosition().x,
    y: this.group.current.getAbsolutePosition().y
  });

  private onMouseUp: KonvaNodeEvents["onMouseUp"] = () => this.setState({ active: false });
  private onMouseDown: KonvaNodeEvents["onMouseDown"] = () => this.setState({ active: true });

  private onMouseEnter: KonvaNodeEvents["onMouseEnter"] = e => {
    this.setState({ hovered: true });
    if (!this.props.onMouseEnter) return;
    this.props.onMouseEnter(e);
  };

  private onMouseLeave: KonvaNodeEvents["onMouseLeave"] = e => {
    this.setState({ hovered: false });
    if (!this.props.onMouseLeave) return;
    this.props.onMouseLeave(e);
  };
}
