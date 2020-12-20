import Konva from "konva";
import * as React from "react";
import { ListItem } from "./ListItem";
import { Position, WH } from "../types";
import { IconGroupIcon } from "./IconGroup";
import { mluviiTheme } from "../../../theme";
import { Spring, animated } from "react-spring/renderprops-konva";
import { Group as KonvaGroup, KonvaNodeEvents } from "react-konva";

export type GroupProps = {
  id: string;
  name?: string;
  hovered?: boolean;
  selected?: boolean;
  draggable?: boolean;
  icons: IconGroupIcon[];
  innerRef?: (group: Konva.Group) => void;
  onFrame?: (instance: Konva.Group) => void;
  onDragEnd?: KonvaNodeEvents["onDragEnd"];
  onDragMove?: KonvaNodeEvents["onDragMove"];
  onDragStart?: KonvaNodeEvents["onDragStart"];
  onMouseDown?: KonvaNodeEvents["onMouseDown"];
  onMouseLeave?: KonvaNodeEvents["onMouseLeave"];
  onMouseEnter?: KonvaNodeEvents["onMouseEnter"];
} & WH &
  Position;

export class Group extends React.PureComponent<GroupProps> {
  static defaultProps: Partial<GroupProps> = {
    width: 0,
    height: 0
  };

  private maingroup = React.createRef<Konva.Group>();
  private maingroupSpring = React.createRef<Spring<Position>>();

  componentDidMount() {
    if (this.props.innerRef) {
      this.props.innerRef(this.maingroup.current);
    }
  }

  render() {
    const { icons, name } = this.props;
    const { x, y, width, height, draggable } = this.props;

    return (
      <Spring native to={{ x, y }} onFrame={this.onFrame} ref={this.maingroupSpring}>
        {anim => (
          <animated.Group
            x={anim.x}
            y={anim.y}
            name="group"
            ref={this.maingroup}
            draggable={draggable}
            onDragStart={this.onDragStart}
            onDragEnd={this.props.onDragEnd}
            onDragMove={this.props.onDragMove}
          >
            <ListItem
              text={name}
              width={width}
              rightIcons={icons}
              textColor={mluviiTheme.palette.grayText}
            />
            {this.content}
          </animated.Group>
        )}
      </Spring>
    );
  }

  private onDragStart: KonvaNodeEvents["onDragStart"] = e => {
    const spring = this.maingroupSpring.current as any;
    spring.controller.destroy();
    if (this.props.onDragStart) {
      this.props.onDragStart(e);
    }
  };

  private onFrame = () => {
    if (this.props.onFrame) {
      this.props.onFrame(this.maingroup.current);
    }
  };

  private get content() {
    return (
      <KonvaGroup
        y={32}
        id={this.props.id}
        name="groupContent"
        onMouseDown={this.props.onMouseDown}
        onMouseLeave={this.props.onMouseLeave}
        onMouseEnter={this.props.onMouseEnter}
      >
        {this.animatedRect}
        {this.props.children}
      </KonvaGroup>
    );
  }

  private get animatedRect() {
    const { width, height, selected } = this.props;
    return (
      <Spring native to={{ width, height }}>
        {({ width, height }) => (
          <animated.Rect
            name="groupContentRect"
            dash={[4, 4]}
            width={width}
            height={height}
            stroke={this.strokeColor}
            strokeWidth={selected ? 2 : 1}
            cornerRadius={parseInt(mluviiTheme.common.radius, 0) * 2}
          />
        )}
      </Spring>
    );
  }

  private get strokeColor() {
    if (this.props.selected || this.props.hovered) {
      return mluviiTheme.palette.blue;
    }
    return mluviiTheme.palette.line;
  }
}
