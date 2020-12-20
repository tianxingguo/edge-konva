import Konva from "konva";
import * as React from "react";
import { WH, Position } from "../types";
import { mluviiTheme } from "../../../theme";
import { KonvaNodeEvents } from "react-konva";
import { Spring, animated } from "react-spring/renderprops-konva";

export type GroupItemProps = {
  id?: string;
  hovered?: boolean;
  shadowed?: boolean;
  expanded?: boolean;
  selected?: boolean;
  draggable?: boolean;
  animScaleX?: number;
  animScaleY?: number;
  expandedHeight?: number;
  disabledAnimation?: boolean;
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

export class GroupItem extends React.PureComponent<GroupItemProps> {
  private maingroup = React.createRef<Konva.Group>();

  componentDidMount() {
    if (this.props.innerRef) {
      this.props.innerRef(this.maingroup.current);
    }
  }

  render() {
    const { width, height, disabledAnimation } = this.props;
    return (
      <Spring
        native
        onFrame={this.onFrame}
        immediate={disabledAnimation}
        to={{
          y: this.props.y,
          x: this.props.x + width / 2,
          opacity: this.props.shadowed ? 0.5 : 1
        }}
      >
        {anim => (
          <animated.Group
            x={anim.x}
            y={anim.y}
            name="groupItem"
            id={this.props.id}
            offsetX={width / 2}
            ref={this.maingroup}
            opacity={anim.opacity}
            width={this.props.width}
            height={this.props.height}
            onDragMove={this.onDragMove}
            scaleX={this.props.animScaleX}
            scaleY={this.props.animScaleY}
            draggable={this.props.draggable}
            onDragEnd={this.props.onDragEnd}
            onDragStart={this.props.onDragStart}
            onMouseDown={this.props.onMouseDown}
            onMouseLeave={this.props.onMouseLeave}
            onMouseEnter={this.props.onMouseEnter}
          >
            <Spring native to={{ width, height }} onFrame={this.onFrame}>
              {anim => (
                <animated.Rect
                  fill="white"
                  width={anim.width}
                  height={anim.height}
                  stroke={this.strokeColor}
                  strokeWidth={this.props.selected ? 2 : 1}
                  cornerRadius={parseInt(mluviiTheme.common.radius, 10)}
                />
              )}
            </Spring>
            {this.props.children}
          </animated.Group>
        )}
      </Spring>
    );
  }

  private onDragMove: KonvaNodeEvents["onDragMove"] = e => {
    if (this.props.onDragMove) {
      this.props.onDragMove(e);
    }
    this.onFrame();
  };

  private onFrame = () => {
    if (this.props.onFrame) {
      this.props.onFrame(this.maingroup.current);
    }
  };

  private get strokeColor() {
    if (this.props.selected || this.props.hovered) {
      return mluviiTheme.palette.blue;
    }
    return mluviiTheme.palette.line;
  }
}
