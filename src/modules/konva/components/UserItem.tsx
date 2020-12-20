import * as React from "react";
import { Avatar } from "./Avatar";
import { ListItem } from "./ListItem";
import { Position, WH } from "../types";
import { Group, Text } from "react-konva";
import { IconGroupIcon } from "./IconGroup";
import { mluviiTheme } from "../../../theme";

type Props = {
  src?: string;
  text?: string;
  subText?: string;
  rightIcons?: IconGroupIcon[];
} & Position &
  WH;

export class UserItem extends React.Component<Props> {
  render() {
    const { x, y, width, height, src, text, subText, rightIcons } = this.props;
    return (
      <Group x={x} y={y} width={width} height={height}>
        <Avatar x={0} y={0} src={src} text={text} width={36} height={36} />
        <ListItem x={36 + 16} y={10} width={width - 36 - 16} text={text} rightIcons={rightIcons} />
        <Text
          y={39}
          ellipsis
          wrap="none"
          x={36 + 32}
          text={subText}
          width={width - 36 - 32}
          fill={mluviiTheme.palette.midiGray}
        />
      </Group>
    );
  }
}
