import { Icon } from "./Icon";
import * as React from "react";
import { Position, IconType } from "../types";
import { Group, KonvaNodeEvents } from "react-konva";

export type IconGroupIcon = {
  id?: string;
  icon: IconType;
  onClick?: () => void;
  onMouseEnter?: KonvaNodeEvents["onMouseEnter"];
  onMouseLeave?: KonvaNodeEvents["onMouseEnter"];
};

type Props = {
  icons: IconGroupIcon[];
} & Position;

export class IconGroup extends React.PureComponent<Props> {
  private readonly height = 26;

  render() {
    const { x, y } = this.props;

    return (
      <Group
        x={x}
        y={y}
        height={this.height}
        onMouseEnter={e => (e.cancelBubble = true)}
        onMouseLeave={e => (e.cancelBubble = true)}
      >
        {this.icons}
      </Group>
    );
  }

  private get icons() {
    return this.props.icons.map((icon, i) => {
      return <Icon key={i} x={22 * i} {...icon} />;
    });
  }
}
