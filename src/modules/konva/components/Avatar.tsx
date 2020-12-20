import * as React from "react";
import useImage from "use-image";
import { Position, WH } from "../types";
import { mluviiTheme } from "../../../theme";
import { getColorFromText, roundRect } from "../helpers";
import { Group, Image, Text, Rect } from "react-konva";

type Props = {
  src?: string;
  text?: string;
} & Position &
  WH;

const LionImage = ({ width, height, src }: WH & { src: string }) => {
  const [image] = useImage(src);
  return (
    <Image
      image={image}
      width={width}
      height={height}
      cornerRadius={parseInt(mluviiTheme.common.radius, 10)}
    />
  );
};

export class Avatar extends React.Component<Props> {
  private readonly radius = parseInt(mluviiTheme.common.radius, 10);

  render() {
    const { x, y, width, height } = this.props;
    return (
      <Group
        x={x}
        y={y}
        offsetX={-width! / 2}
        offsetY={-height! / 2}
        clipFunc={ctx => {
          const fillColor = getColorFromText(this.initials);
          roundRect(ctx, 0, 0, width!, height!, this.radius, fillColor);
        }}
      >
        {this.content}
      </Group>
    );
  }

  private get content() {
    const { width, height, src } = this.props;
    if (src) {
      return <LionImage width={width} height={height} src={src} />;
    }
    return (
      <Text
        width={width}
        align="center"
        fontSize={14}
        height={height}
        text={this.initials}
        verticalAlign="middle"
      />
    );
  }

  private get initials() {
    return this.props.text!
      .split(" ")
      .slice(0, 2)
      .map(t => t.slice(0, 1))
      .join("");
  }
}
