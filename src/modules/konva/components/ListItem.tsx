import * as React from "react";
import { Group } from "react-konva";
import { Position } from "../types";
import { mluviiTheme } from "../../../theme";
import { IconGroupIcon, IconGroup } from "./IconGroup";
import { Spring, animated } from "react-spring/renderprops-konva";

type Props = {
  text: string;
  width: number;
  opacity?: number;
  textColor?: string;
  leftIcons?: IconGroupIcon[];
  rightIcons?: IconGroupIcon[];
} & Position;

export class ListItem extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    leftIcons: [],
    rightIcons: []
  };

  private readonly height = 32;

  render() {
    const { x, y, width, text, leftIcons, rightIcons, opacity } = this.props;
    return (
      <Group height={this.height} opacity={opacity || 1} x={x} y={y}>
        <IconGroup y={3} x={8} icons={leftIcons} />
        <Spring
          native
          config={{ duration: 200 }}
          to={{
            x: leftIcons.length * 22 + 16,
            width: width - leftIcons.length * 22 - rightIcons.length * 22 - 32
          }}
        >
          {({ x, width }) => (
            <animated.Text
              x={x}
              ellipsis
              wrap="none"
              text={text}
              width={width}
              fontSize={13}
              lineHeight={2.7}
              height={this.height}
              fill={this.props.textColor || mluviiTheme.palette.text}
            />
          )}
        </Spring>
        <IconGroup
          y={3}
          icons={rightIcons}
          x={width - rightIcons.length * 22 - 12}
        />
      </Group>
    );
  }
}
