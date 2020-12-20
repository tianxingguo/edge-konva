import Konva from "konva";
import * as React from "react";
import { Button, Icon } from "../../../konva";
import { Position } from "../../../konva/types";
import { mluviiTheme } from "../../../../theme";
import { Text, KonvaNodeEvents } from "react-konva";
import { TooltipContextProps } from "../TooltipContext";
import { Spring, Transition, animated } from "react-spring/renderprops-konva";

type Props = {
  width: number;
  groupId: string;
  visibleCount: number;
  visibleCountOf: number;
  onAdd: () => void;
  onReset: () => void;
} & Position &
  TooltipContextProps;

export class StatusBar extends React.PureComponent<Props> {
  state = {
    mounted: false,
    counterWidth: 0
  };

  private text = React.createRef<Konva.Text>();

  componentDidMount() {
    this.setState({ mounted: true });
    this.setCounterWidth();
  }

  render() {
    const { onAdd, groupId, width, x, y } = this.props;
    return (
      <Spring to={{ y }}>
        {anim => (
          <animated.Group x={x} y={anim.y} height={32} width={width}>
            <Button onClick={onAdd} id={`${groupId}.addButton`} icon="plus" />
            {this.counter}
          </animated.Group>
        )}
      </Spring>
    );
  }

  private setCounterWidth = () => {
    if (!this.text.current) {
      return;
    }
    const counterWidth = this.text.current.getWidth() + 8;
    if (this.state.counterWidth !== counterWidth) {
      this.setState({ counterWidth });
    }
  };

  private get counter() {
    const { counterWidth, mounted } = this.state;
    const { groupId, width, visibleCount, visibleCountOf } = this.props;

    return (
      <Transition
        from={{ opacity: 0 }}
        leave={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        onStart={this.setCounterWidth}
        immediate={mounted ? false : true}
        items={visibleCount !== visibleCountOf}
      >
        {show =>
          show &&
          (anim => (
            <animated.Group opacity={anim.opacity}>
              <Icon
                y={3}
                icon="undo"
                onClick={this.onReset}
                id={`${groupId}.resetItems`}
                x={width - counterWidth - 26}
                onMouseEnter={this.showTooltip}
                onMouseLeave={this.props.hideTooltip}
              />
              <Text
                height={32}
                fontSize={13}
                align="center"
                ref={this.text}
                lineHeight={2.7}
                x={width - counterWidth}
                fill={mluviiTheme.palette.grayText}
                text={`${visibleCount}/${visibleCountOf}`}
              />
            </animated.Group>
          ))
        }
      </Transition>
    );
  }

  private onReset = () => {
    this.props.onReset();
    this.props.hideTooltip();
  };

  private showTooltip: KonvaNodeEvents["onMouseEnter"] = e => {
    const stage = e.target.getStage();
    const { x, y, width } = e.target.getClientRect({ relativeTo: stage });
    this.props.showTooltip(x + width / 2, y, "showAll");
  };
}
